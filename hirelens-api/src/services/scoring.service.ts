import { CONSTANTS } from '../config/constants';
import { AnalysisSignals, EvidenceLevel } from '../schemas/analysis.schema';
import { RoleProfile } from '../schemas/roleProfile.schema';

export interface ScoreResult {
  resumeQualityScore: number;
  jobReadinessScore: number;
  requiredSkillCoverage: number;
  resumeScoreLabel: string;
  readinessLabel: string;
  dimensionBreakdown: {
    roleRelevance: number;
    skillAlignment: number;
    evidenceQuality: number;
    projectClarity: number;
    structureReadability: number;
    languageQuality: number;
    projectEvidence: number;
    practicalExperience: number;
    toolExposure: number;
    communicationEvidence: number;
    questionnaireReadiness: number;
  };
}

export class ScoringService {
  public static calculateScores(
    signals: AnalysisSignals,
    roleProfile: RoleProfile,
    questionnaire: any
  ): ScoreResult {
    // 1. Calculate RequiredSkillCoverage
    const requiredSkillCoverage = this.calculateRequiredSkillCoverage(
      signals.candidateProfile.detectedSkills,
      roleProfile
    );

    // 2. Calculate ResumeQualityScore
    const rd = signals.resumeDimensions;
    const rawResumeQuality =
      rd.roleRelevance * 0.25 +
      rd.skillAlignment * 0.20 +
      rd.evidenceQuality * 0.20 +
      rd.projectClarity * 0.15 +
      rd.structureReadability * 0.10 +
      rd.languageQuality * 0.10;

    const resumeQualityScore = Math.min(100, Math.max(0, Math.round(rawResumeQuality)));

    // 3. Calculate ToolExposure score
    const toolExposure = this.calculateToolExposure(signals.candidateProfile.detectedTools, roleProfile);

    // 4. Calculate QuestionnaireReadiness score
    const questionnaireReadiness = this.calculateQuestionnaireReadiness(questionnaire);

    // 5. Calculate JobReadinessScore
    const rad = signals.readinessDimensions;
    const rawJobReadiness =
      requiredSkillCoverage * 0.35 +
      rad.projectEvidence * 0.25 +
      rad.practicalExperience * 0.15 +
      toolExposure * 0.10 +
      rad.communicationEvidence * 0.05 +
      questionnaireReadiness * 0.10;

    const jobReadinessScore = Math.min(100, Math.max(0, Math.round(rawJobReadiness)));

    return {
      resumeQualityScore,
      jobReadinessScore,
      requiredSkillCoverage: Math.round(requiredSkillCoverage),
      resumeScoreLabel: this.getResumeScoreLabel(resumeQualityScore),
      readinessLabel: this.getReadinessLabel(jobReadinessScore),
      dimensionBreakdown: {
        roleRelevance: rd.roleRelevance,
        skillAlignment: rd.skillAlignment,
        evidenceQuality: rd.evidenceQuality,
        projectClarity: rd.projectClarity,
        structureReadability: rd.structureReadability,
        languageQuality: rd.languageQuality,
        projectEvidence: rad.projectEvidence,
        practicalExperience: rad.practicalExperience,
        toolExposure,
        communicationEvidence: rad.communicationEvidence,
        questionnaireReadiness,
      },
    };
  }

  private static calculateRequiredSkillCoverage(
    detectedSkills: Array<{ skillId: string; evidenceLevel: EvidenceLevel }>,
    roleProfile: RoleProfile
  ): number {
    if (!roleProfile.requiredSkills || roleProfile.requiredSkills.length === 0) {
      return 70; // fallback default
    }

    let totalWeight = 0;
    let weightedScore = 0;

    const detectedMap = new Map(detectedSkills.map((s) => [s.skillId.toLowerCase(), s.evidenceLevel]));

    for (const reqSkill of roleProfile.requiredSkills) {
      const weight = reqSkill.weight || 10;
      totalWeight += weight;

      const level = detectedMap.get(reqSkill.id.toLowerCase()) || 'absent';
      const evidenceVal = CONSTANTS.EVIDENCE_LEVEL_WEIGHTS[level] ?? 0.0;

      weightedScore += weight * evidenceVal;
    }

    if (totalWeight === 0) return 70;

    return (weightedScore / totalWeight) * 100;
  }

  private static calculateToolExposure(detectedTools: string[], roleProfile: RoleProfile): number {
    const requiredTools = roleProfile.requiredSkills.filter((s) => s.category === 'tool');
    if (requiredTools.length === 0) return 75;

    const toolNamesLower = detectedTools.map((t) => t.toLowerCase());
    let matchedCount = 0;

    for (const reqTool of requiredTools) {
      if (toolNamesLower.some((t) => t.includes(reqTool.name.toLowerCase()) || reqTool.aliases.some((a) => t.includes(a.toLowerCase())))) {
        matchedCount++;
      }
    }

    return Math.round((matchedCount / requiredTools.length) * 100);
  }

  private static calculateQuestionnaireReadiness(q: any): number {
    let score = 50;

    if (!q) return score;

    if (q.projects === 'two_plus_completed') score += 20;
    else if (q.projects === 'one_completed') score += 10;

    if (q.internship === 'relevant_internship' || q.internship === 'three_months_plus') score += 20;
    else if (q.internship === 'virtual_internship') score += 10;

    if (typeof q.interviewConfidence === 'number') {
      score += (q.interviewConfidence - 3) * 5;
    }

    return Math.min(100, Math.max(0, score));
  }

  private static getResumeScoreLabel(score: number): string {
    if (score >= 85) return 'Outstanding';
    if (score >= 70) return 'Strong Resume';
    if (score >= 55) return 'Good Foundation';
    if (score >= 40) return 'Needs Refinement';
    return 'Needs Reconstruction';
  }

  private static getReadinessLabel(score: number): string {
    if (score >= 85) return 'Job Ready';
    if (score >= 70) return 'Nearly Ready';
    if (score >= 55) return 'Developing';
    if (score >= 40) return 'Early Stage';
    return 'Baseline';
  }
}

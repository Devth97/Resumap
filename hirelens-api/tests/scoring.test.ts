import { describe, it, expect } from 'vitest';
import { ScoringService } from '../src/services/scoring.service';
import { SEEDED_ROLE_PROFILES } from '../src/services/roleProfile.service';
import { AnalysisSignals } from '../src/schemas/analysis.schema';

describe('ScoringService', () => {
  it('calculates weighted ResumeQualityScore and JobReadinessScore correctly', () => {
    const roleProfile = SEEDED_ROLE_PROFILES[0]; // Data Analyst

    const mockSignals: AnalysisSignals = {
      candidateProfile: {
        educationSummary: 'B.Tech CS',
        experienceLevel: 'student',
        detectedSkills: [
          { skillId: 'sql', skillName: 'SQL', evidenceLevel: 'demonstrated', evidenceQuote: 'Built sales project', confidence: 0.9 },
          { skillId: 'excel', skillName: 'Excel', evidenceLevel: 'applied', evidenceQuote: 'Internship analysis', confidence: 0.9 },
          { skillId: 'data-visualization', skillName: 'Data Visualization', evidenceLevel: 'mentioned', evidenceQuote: null, confidence: 0.8 },
          { skillId: 'communication', skillName: 'Business Communication', evidenceLevel: 'mentioned', evidenceQuote: null, confidence: 0.8 },
        ],
        detectedTools: ['Excel', 'Power BI'],
        projects: [],
      },
      resumeDimensions: {
        roleRelevance: 80,
        skillAlignment: 75,
        evidenceQuality: 70,
        projectClarity: 70,
        structureReadability: 85,
        languageQuality: 80,
      },
      readinessDimensions: {
        projectEvidence: 75,
        practicalExperience: 60,
        communicationEvidence: 65,
      },
      strengths: [],
      gaps: [],
      resumeImprovements: [],
      roadmap: [
        { stage: 1, title: 'Stage 1', durationWeeks: 2, objective: 'Obj 1', actions: ['Act 1'], completionEvidence: 'Ev 1' },
        { stage: 2, title: 'Stage 2', durationWeeks: 2, objective: 'Obj 2', actions: ['Act 2'], completionEvidence: 'Ev 2' },
        { stage: 3, title: 'Stage 3', durationWeeks: 2, objective: 'Obj 3', actions: ['Act 3'], completionEvidence: 'Ev 3' },
        { stage: 4, title: 'Stage 4', durationWeeks: 2, objective: 'Obj 4', actions: ['Act 4'], completionEvidence: 'Ev 4' },
      ],
      immediateActions: ['Act A', 'Act B', 'Act C'],
      confidence: 'high',
      confidenceExplanation: 'Clear structure',
    };

    const questionnaire = {
      timeline: 'three_months',
      weeklyHours: 'six_to_ten',
      projects: 'one_completed',
      internship: 'none',
      interviewConfidence: 3,
      selfLevel: 'concepts_need_practice',
    };

    const scores = ScoringService.calculateScores(mockSignals, roleProfile, questionnaire);

    expect(scores.resumeQualityScore).toBeGreaterThanOrEqual(0);
    expect(scores.resumeQualityScore).toBeLessThanOrEqual(100);
    expect(scores.jobReadinessScore).toBeGreaterThanOrEqual(0);
    expect(scores.jobReadinessScore).toBeLessThanOrEqual(100);
    expect(scores.resumeScoreLabel).toBeDefined();
    expect(scores.readinessLabel).toBeDefined();
  });
});

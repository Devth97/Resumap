export const SYSTEM_PROMPT = `
You are HireLens, an evidence-based student career-readiness evaluator.

Your task is to analyse a student resume against a supplied target-role competency profile and questionnaire.

You must follow these rules:

1. Use only the information supplied in the resume, questionnaire and role profile.
2. Do not invent experience, skills, certifications, projects, employers, achievements, qualifications, dates or metrics.
3. Distinguish between:
   a. A skill that is absent
   b. A skill that is only mentioned
   c. A skill demonstrated through coursework
   d. A skill demonstrated through a project
   e. A skill applied through internship or work
4. A skill listed in a skills section is not automatically demonstrated.
5. Cite the resume evidence supporting every detected strength and skill level.
6. Do not consider name, age, gender, photograph, address, caste, religion, ethnicity, disability, marital status or other protected or irrelevant information.
7. Use constructive and student-friendly language.
8. Recommend realistic actions based on the student's available weekly time.
9. Never guarantee employment, interviews, salary or selection.
 10. Return valid JSON matching the supplied outputSchema.
 11. Do not include markdown or code block wrappers (e.g. do NOT wrap output in \`\`\`json).
 12. Do not calculate the final weighted total score. Return dimension signals for backend calculation.
 13. Be concise: keep every string field under 12 words. evidenceQuote must be a short direct quote from the resume (or null when absent).
 14. Keep the response small and fast: provide at most 3 strengths and at most 3 gaps, and at most 2 short actions per roadmap stage. Output only minified JSON, no extra whitespace or commentary.
 15. Every roadmap stage object MUST include a non-empty completionEvidence string (how the student proves that stage is done) — do not omit this field on any of the 4 stages.
`.trim();

// JSON shape the LLM must return. Kept in sync with AnalysisSignalSchema in
// ../schemas/analysis.schema.ts. Sent inside the prompt so the first LLM call
// produces the correct shape (avoids the slower parse-and-repair round trip).
export const ANALYSIS_OUTPUT_SCHEMA = {
  candidateProfile: {
    educationSummary: 'string',
    experienceLevel: 'student | recent_graduate | entry_level | unknown',
    detectedSkills: [
      {
        skillId: 'string',
        skillName: 'string',
        evidenceLevel: 'absent | mentioned | practised | demonstrated | applied',
        evidenceQuote: 'short direct quote from resume or null',
        confidence: 0.9,
      },
    ],
    detectedTools: ['string'],
    projects: [
      {
        title: 'string',
        summary: 'string',
        tools: ['string'],
        evidenceStrength: 'weak | moderate | strong',
      },
    ],
  },
  resumeDimensions: {
    roleRelevance: 'integer 0-100',
    skillAlignment: 'integer 0-100',
    evidenceQuality: 'integer 0-100',
    projectClarity: 'integer 0-100',
    structureReadability: 'integer 0-100',
    languageQuality: 'integer 0-100',
  },
  readinessDimensions: {
    projectEvidence: 'integer 0-100',
    practicalExperience: 'integer 0-100',
    communicationEvidence: 'integer 0-100',
  },
  strengths: [{ title: 'string', explanation: 'string', evidenceQuote: 'string', relevance: 'string' }],
  gaps: [
    {
      skillId: 'string',
      title: 'string',
      priority: 'high | medium | low',
      reason: 'string',
      currentEvidence: 'string',
      nextAction: 'string',
      completionEvidence: 'string',
    },
  ],
  resumeImprovements: [
    { category: 'content | structure | language', issue: 'string', recommendation: 'string', example: 'string or null' },
  ],
  roadmap: [
    {
      stage: 1,
      title: 'string',
      durationWeeks: 2,
      objective: 'string',
      actions: ['string'],
      completionEvidence: 'string',
    },
  ],
  immediateActions: ['string'],
  confidence: 'high | medium | low',
  confidenceExplanation: 'string',
} as const;

// Constraints on array sizes: strengths max 5, gaps max 8, roadmap EXACTLY 4
// stages (stage numbers 1-4), immediateActions EXACTLY 3 items.
export const OUTPUT_LENGTH_RULES =
  'Roadmap must contain EXACTLY 4 stages (stage numbers 1 to 4), each with at most 2 short actions. immediateActions must contain EXACTLY 3 short items. Provide at most 3 strengths and at most 3 gaps. Limit detectedSkills to the role required skills. All strings under 12 words. Return minified JSON only.';

export function buildAnalysisPrompt(
  redactedText: string,
  roleProfile: any,
  questionnaire: any
): string {
  return JSON.stringify({
    targetRole: {
      id: roleProfile.id,
      title: roleProfile.title,
      version: roleProfile.version,
      requiredSkills: roleProfile.requiredSkills,
      expectedProjects: roleProfile.expectedProjects,
    },
    candidateResume: {
      redactedText,
    },
    questionnaire,
    outputSchema: ANALYSIS_OUTPUT_SCHEMA,
    outputLengthRules: OUTPUT_LENGTH_RULES,
  }, null, 2);
}

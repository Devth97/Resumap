import { z } from 'zod';

export const EvidenceLevelSchema = z.enum([
  'absent',
  'mentioned',
  'practised',
  'demonstrated',
  'applied',
]);

export const QuestionnaireSchema = z.object({
  timeline: z.string(),
  weeklyHours: z.string(),
  projects: z.string(),
  internship: z.string(),
  interviewConfidence: z.number().min(1).max(5),
  selfLevel: z.string(),
  roleAnswers: z.record(z.any()).optional().default({}),
});

export const AnalysisSignalSchema = z.object({
  candidateProfile: z.object({
    educationSummary: z.string(),
    experienceLevel: z.enum([
      'student',
      'recent_graduate',
      'entry_level',
      'unknown',
    ]),
    detectedSkills: z.array(
      z.object({
        skillId: z.string(),
        skillName: z.string(),
        evidenceLevel: EvidenceLevelSchema,
        evidenceQuote: z.string().nullable(),
        confidence: z.number().min(0).max(1),
      })
    ),
    detectedTools: z.array(z.string()),
    projects: z.array(
      z.object({
        title: z.string(),
        summary: z.string(),
        tools: z.array(z.string()),
        evidenceStrength: z.enum(['weak', 'moderate', 'strong']),
      })
    ),
  }),

  resumeDimensions: z.object({
    roleRelevance: z.number().min(0).max(100),
    skillAlignment: z.number().min(0).max(100),
    evidenceQuality: z.number().min(0).max(100),
    projectClarity: z.number().min(0).max(100),
    structureReadability: z.number().min(0).max(100),
    languageQuality: z.number().min(0).max(100),
  }),

  readinessDimensions: z.object({
    projectEvidence: z.number().min(0).max(100),
    practicalExperience: z.number().min(0).max(100),
    communicationEvidence: z.number().min(0).max(100),
  }),

  strengths: z.array(
    z.object({
      title: z.string(),
      explanation: z.string(),
      evidenceQuote: z.string(),
      relevance: z.string(),
    })
  ).max(5),

  gaps: z.array(
    z.object({
      skillId: z.string(),
      title: z.string(),
      priority: z.enum(['high', 'medium', 'low']),
      reason: z.string(),
      currentEvidence: z.string(),
      nextAction: z.string(),
      completionEvidence: z.string(),
    })
  ).max(8),

  resumeImprovements: z.array(
    z.object({
      category: z.enum(['content', 'structure', 'language']),
      issue: z.string(),
      recommendation: z.string(),
      example: z.string().nullable(),
    })
  ),

  roadmap: z.array(
    z.object({
      stage: z.number().int().min(1).max(4),
      title: z.string(),
      durationWeeks: z.number().min(0),
      objective: z.string(),
      actions: z.array(z.string()),
      completionEvidence: z.string(),
    })
  ).length(4),

  immediateActions: z.array(z.string()).length(3),

  confidence: z.enum(['high', 'medium', 'low']),
  confidenceExplanation: z.string(),
});

export type Questionnaire = z.infer<typeof QuestionnaireSchema>;
export type AnalysisSignals = z.infer<typeof AnalysisSignalSchema>;
export type EvidenceLevel = z.infer<typeof EvidenceLevelSchema>;

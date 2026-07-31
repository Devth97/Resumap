import { z } from 'zod';

export const RoleSkillCategorySchema = z.enum([
  'technical',
  'tool',
  'business',
  'communication',
  'portfolio',
]);

export const SkillPrioritySchema = z.enum(['required', 'preferred']);

export const RoleSkillSchema = z.object({
  id: z.string(),
  name: z.string(),
  category: RoleSkillCategorySchema,
  priority: SkillPrioritySchema,
  weight: z.number(),
  aliases: z.array(z.string()),
  evidenceExamples: z.array(z.string()),
  beginnerActions: z.array(z.string()),
});

export const ExpectedProjectSchema = z.object({
  title: z.string(),
  description: z.string(),
  demonstratedSkills: z.array(z.string()),
});

export const RoadmapTemplateSchema = z.object({
  stage: z.number().int().min(1).max(4),
  title: z.string(),
  durationWeeks: z.number(),
  objective: z.string(),
  defaultActions: z.array(z.string()),
});

export const RoleProfileSchema = z.object({
  id: z.string(),
  title: z.string(),
  version: z.string(),
  description: z.string(),
  entryLevelTitles: z.array(z.string()),
  requiredSkills: z.array(RoleSkillSchema),
  preferredSkills: z.array(RoleSkillSchema),
  expectedProjects: z.array(ExpectedProjectSchema),
  communicationExpectations: z.array(z.string()),
  roadmapTemplates: z.array(RoadmapTemplateSchema).optional().default([]),
  lastReviewedAt: z.string(),
});

export type RoleSkill = z.infer<typeof RoleSkillSchema>;
export type RoleProfile = z.infer<typeof RoleProfileSchema>;

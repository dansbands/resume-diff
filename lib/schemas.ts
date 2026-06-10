import { z } from "zod";

export const levelSchema = z.enum(["nice-to-have", "required", "must-have"]);

export const requirementSchema = z.object({
  skill: z.string().min(1),
  level: levelSchema,
  evidence: z.string().min(1)
});

export const extractionSchema = z.object({
  requirements: z.array(requirementSchema)
});

export const rankedSkillSchema = z.object({
  skill: z.string().min(1),
  count: z.number().int().positive(),
  avgLevel: z.number().min(1).max(3),
  sampleEvidence: z.array(z.string()).min(1)
});

export const gapResultSchema = z.object({
  missing: z.array(
    z.object({
      skill: z.string().min(1),
      why_matters: z.string().min(1)
    })
  ),
  underweighted: z.array(
    z.object({
      skill: z.string().min(1),
      where_to_add: z.string().min(1)
    })
  ),
  strong: z.array(
    z.object({
      skill: z.string().min(1),
      how_to_lead: z.string().min(1)
    })
  )
});

export type Level = z.infer<typeof levelSchema>;
export type Extraction = z.infer<typeof extractionSchema>;
export type Requirement = z.infer<typeof requirementSchema>;
export type RankedSkill = z.infer<typeof rankedSkillSchema>;
export type GapResult = z.infer<typeof gapResultSchema>;

import Anthropic from "@anthropic-ai/sdk";
import { z } from "zod";

import { extractionSchema, gapResultSchema, type GapResult, type RankedSkill } from "@/lib/schemas";

const model = "claude-sonnet-4-6";

function anthropic() {
  if (!process.env.ANTHROPIC_API_KEY) {
    throw new Error("ANTHROPIC_API_KEY is required");
  }

  return new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY
  });
}

function parseJsonObject(content: string) {
  const trimmed = content.trim();
  const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const candidate = fenced?.[1] ?? trimmed;
  return JSON.parse(candidate);
}

async function requestJson(prompt: string) {
  const message = await anthropic().messages.create({
    model,
    max_tokens: 1800,
    temperature: 0,
    messages: [
      {
        role: "user",
        content: `${prompt}\n\nReturn only valid JSON. Do not include markdown fences or explanatory text.`
      }
    ]
  });

  const text = message.content
    .filter((block) => block.type === "text")
    .map((block) => block.text)
    .join("\n");

  return parseJsonObject(text);
}

export async function extractRequirements(rawText: string) {
  const result = await requestJson(
    `Extract structured requirements from this JD. Return JSON matching this schema: {requirements: [{skill: string, level: 'nice-to-have'|'required'|'must-have', evidence: string}]}. Normalize skill names (React.js -> React, JS -> JavaScript).\n\nJD:\n${rawText}`
  );

  return extractionSchema.parse(result);
}

export async function analyzeGap(resumeText: string, rankedSkills: RankedSkill[]): Promise<GapResult> {
  const result = await requestJson(
    `Given this resume and this ranked skill demand list, return JSON: {missing: [{skill, why_matters}], underweighted: [{skill, where_to_add}], strong: [{skill, how_to_lead}]}.\n\nRanked skill demand list:\n${JSON.stringify(
      rankedSkills,
      null,
      2
    )}\n\nResume:\n${resumeText}`
  );

  return gapResultSchema.parse(result);
}

export function getZodErrorMessage(error: unknown) {
  if (error instanceof z.ZodError) {
    return error.issues.map((issue) => issue.message).join(", ");
  }

  return error instanceof Error ? error.message : "Something went wrong";
}

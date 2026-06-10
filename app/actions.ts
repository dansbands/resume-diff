"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

import { getDb } from "@/db";
import { aggregations, diffs, gapAnalyses, jds } from "@/db/schema";
import { aggregateExtractions } from "@/lib/aggregate";
import { analyzeGap, extractRequirements, getZodErrorMessage } from "@/lib/anthropic";
import { rankedSkillSchema } from "@/lib/schemas";

export type ActionState<T> = {
  data?: T;
  error?: string;
};

function titleFromText(text: string) {
  const firstLine = text
    .split("\n")
    .map((line) => line.trim())
    .find(Boolean);

  return firstLine ? firstLine.slice(0, 80) : "Untitled diff";
}

export async function createAggregatedDiff(rawJds: string[]): Promise<ActionState<{ diffId: string }>> {
  try {
    const cleaned = rawJds.map((jd) => jd.trim()).filter(Boolean);

    if (cleaned.length === 0) {
      return { error: "Add at least one job description before aggregating." };
    }

    const extractions = await Promise.all(cleaned.map((jd) => extractRequirements(jd)));
    const rankedSkills = aggregateExtractions(extractions);
    const db = getDb();

    const [diff] = await db
      .insert(diffs)
      .values({
        title: cleaned.length === 1 ? titleFromText(cleaned[0]) : `${cleaned.length} JD skill diff`
      })
      .returning({ id: diffs.id });

    await db.insert(jds).values(
      cleaned.map((rawText, index) => ({
        diffId: diff.id,
        rawText,
        parsedJson: extractions[index]
      }))
    );

    await db.insert(aggregations).values({
      diffId: diff.id,
      rankedSkills
    });

    revalidatePath(`/diff/${diff.id}`);

    return { data: { diffId: diff.id } };
  } catch (error) {
    return { error: getZodErrorMessage(error) };
  }
}

export async function runGapAnalysis(
  diffId: string,
  resumeText: string
): Promise<ActionState<{ result: Awaited<ReturnType<typeof analyzeGap>> }>> {
  try {
    const cleanedResume = resumeText.trim();

    if (!cleanedResume) {
      return { error: "Paste a resume before running the gap analysis." };
    }

    const db = getDb();
    const [aggregation] = await db
      .select({ rankedSkills: aggregations.rankedSkills })
      .from(aggregations)
      .where(eq(aggregations.diffId, diffId))
      .limit(1);

    if (!aggregation) {
      return { error: "No aggregation exists for this diff." };
    }

    const rankedSkills = rankedSkillSchema.array().parse(aggregation.rankedSkills);
    const result = await analyzeGap(cleanedResume, rankedSkills);

    await db.insert(gapAnalyses).values({
      diffId,
      resumeText: cleanedResume,
      resultJson: result
    });

    revalidatePath(`/diff/${diffId}/gap`);

    return { data: { result } };
  } catch (error) {
    return { error: getZodErrorMessage(error) };
  }
}

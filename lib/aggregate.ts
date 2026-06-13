import type { Extraction, RankedSkill } from "@/lib/schemas";

const levelWeights = {
  "nice-to-have": 1,
  required: 2,
  "must-have": 3
} as const;

export function normalizeSkillName(skill: string) {
  return skill
    .trim()
    .replace(/\bReact\.js\b/gi, "React")
    .replace(/\bJS\b/g, "JavaScript")
    .replace(/\s+/g, " ");
}

export function aggregateExtractions(extractions: Extraction[]): RankedSkill[] {
  const groups = new Map<
    string,
    { skill: string; count: number; mentions: number; totalLevel: number; sampleEvidence: string[] }
  >();

  for (const extraction of extractions) {
    const seenInThisJd = new Set<string>();

    for (const requirement of extraction.requirements) {
      const skill = normalizeSkillName(requirement.skill);
      const key = skill.toLowerCase();
      const existing =
        groups.get(key) ??
        groups
          .set(key, { skill, count: 0, mentions: 0, totalLevel: 0, sampleEvidence: [] })
          .get(key)!;

      if (!seenInThisJd.has(key)) {
        existing.count += 1;
        seenInThisJd.add(key);
      }

      existing.mentions += 1;
      existing.totalLevel += levelWeights[requirement.level];
      if (existing.sampleEvidence.length < 3) {
        existing.sampleEvidence.push(requirement.evidence);
      }
    }
  }

  return Array.from(groups.values())
    .map((group) => ({
      skill: group.skill,
      count: group.count,
      avgLevel: Number((group.totalLevel / Math.max(group.mentions, 1)).toFixed(2)),
      sampleEvidence: group.sampleEvidence
    }))
    .sort((a, b) => b.count - a.count || b.avgLevel - a.avgLevel || a.skill.localeCompare(b.skill));
}

import { relations } from "drizzle-orm";
import { jsonb, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const diffs = pgTable("diffs", {
  id: uuid("id").primaryKey().defaultRandom(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  title: text("title").notNull()
});

export const jds = pgTable("jds", {
  id: uuid("id").primaryKey().defaultRandom(),
  diffId: uuid("diff_id")
    .notNull()
    .references(() => diffs.id, { onDelete: "cascade" }),
  sourceUrl: text("source_url"),
  rawText: text("raw_text").notNull(),
  parsedJson: jsonb("parsed_json").notNull()
});

export const aggregations = pgTable("aggregations", {
  id: uuid("id").primaryKey().defaultRandom(),
  diffId: uuid("diff_id")
    .notNull()
    .references(() => diffs.id, { onDelete: "cascade" }),
  rankedSkills: jsonb("ranked_skills").notNull()
});

export const gapAnalyses = pgTable("gap_analyses", {
  id: uuid("id").primaryKey().defaultRandom(),
  diffId: uuid("diff_id")
    .notNull()
    .references(() => diffs.id, { onDelete: "cascade" }),
  resumeText: text("resume_text").notNull(),
  resultJson: jsonb("result_json").notNull()
});

export const diffsRelations = relations(diffs, ({ many, one }) => ({
  jds: many(jds),
  aggregation: one(aggregations),
  gapAnalyses: many(gapAnalyses)
}));

export const jdsRelations = relations(jds, ({ one }) => ({
  diff: one(diffs, {
    fields: [jds.diffId],
    references: [diffs.id]
  })
}));

export const aggregationsRelations = relations(aggregations, ({ one }) => ({
  diff: one(diffs, {
    fields: [aggregations.diffId],
    references: [diffs.id]
  })
}));

export const gapAnalysesRelations = relations(gapAnalyses, ({ one }) => ({
  diff: one(diffs, {
    fields: [gapAnalyses.diffId],
    references: [diffs.id]
  })
}));

CREATE TABLE "aggregations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"diff_id" uuid NOT NULL,
	"ranked_skills" jsonb NOT NULL
);
--> statement-breakpoint
CREATE TABLE "diffs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"title" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "gap_analyses" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"diff_id" uuid NOT NULL,
	"resume_text" text NOT NULL,
	"result_json" jsonb NOT NULL
);
--> statement-breakpoint
CREATE TABLE "jds" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"diff_id" uuid NOT NULL,
	"source_url" text,
	"raw_text" text NOT NULL,
	"parsed_json" jsonb NOT NULL
);
--> statement-breakpoint
ALTER TABLE "aggregations" ADD CONSTRAINT "aggregations_diff_id_diffs_id_fk" FOREIGN KEY ("diff_id") REFERENCES "public"."diffs"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "gap_analyses" ADD CONSTRAINT "gap_analyses_diff_id_diffs_id_fk" FOREIGN KEY ("diff_id") REFERENCES "public"."diffs"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "jds" ADD CONSTRAINT "jds_diff_id_diffs_id_fk" FOREIGN KEY ("diff_id") REFERENCES "public"."diffs"("id") ON DELETE cascade ON UPDATE no action;
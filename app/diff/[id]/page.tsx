import Link from "next/link";
import { eq } from "drizzle-orm";
import { ArrowRight } from "lucide-react";
import { notFound } from "next/navigation";

import { getDb } from "@/db";
import { aggregations, diffs } from "@/db/schema";
import { SiteHeader } from "@/components/site-header";
import { SkillTable } from "@/components/skill-table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { rankedSkillSchema } from "@/lib/schemas";

export const dynamic = "force-dynamic";

export default async function DiffPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const db = getDb();
  const [diff] = await db
    .select({
      id: diffs.id,
      title: diffs.title,
      createdAt: diffs.createdAt,
      rankedSkills: aggregations.rankedSkills
    })
    .from(diffs)
    .leftJoin(aggregations, eq(aggregations.diffId, diffs.id))
    .where(eq(diffs.id, id))
    .limit(1);

  if (!diff || !diff.rankedSkills) {
    notFound();
  }

  const rankedSkills = rankedSkillSchema.array().parse(diff.rankedSkills);

  return (
    <main>
      <SiteHeader />
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="text-sm text-stone-500">{diff.createdAt.toLocaleDateString()}</p>
            <h1 className="mt-1 text-3xl font-semibold tracking-normal text-stone-950">{diff.title}</h1>
          </div>
          <Button asChild>
            <Link href={`/diff/${diff.id}/gap`}>
              Paste resume
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Ranked skill demand</CardTitle>
          </CardHeader>
          <CardContent>
            <SkillTable skills={rankedSkills} />
          </CardContent>
        </Card>
      </div>
    </main>
  );
}

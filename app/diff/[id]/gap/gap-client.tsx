"use client";

import { useState, useTransition } from "react";
import { Sparkles } from "lucide-react";

import { runGapAnalysis } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import type { GapResult } from "@/lib/schemas";

export function GapClient({ diffId }: { diffId: string }) {
  const [resumeText, setResumeText] = useState("");
  const [result, setResult] = useState<GapResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function analyze() {
    setError(null);
    startTransition(async () => {
      const response = await runGapAnalysis(diffId, resumeText);

      if (response.error) {
        setError(response.error);
        return;
      }

      setResult(response.data?.result ?? null);
    });
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Paste resume</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            value={resumeText}
            onChange={(event) => setResumeText(event.target.value)}
            placeholder="Paste the resume text..."
            className="min-h-72"
          />
          <Button disabled={isPending} onClick={analyze} type="button">
            <Sparkles className="h-4 w-4" />
            {isPending ? "Analyzing..." : "Run gap analysis"}
          </Button>
          {error ? <p className="rounded-md bg-red-50 p-3 text-sm text-red-700">{error}</p> : null}
        </CardContent>
      </Card>

      {result ? (
        <div className="grid gap-4 lg:grid-cols-3">
          <GapColumn
            title="Missing"
            items={result.missing.map((item) => ({ skill: item.skill, body: item.why_matters }))}
          />
          <GapColumn
            title="Underweighted"
            items={result.underweighted.map((item) => ({ skill: item.skill, body: item.where_to_add }))}
          />
          <GapColumn
            title="Strong"
            items={result.strong.map((item) => ({ skill: item.skill, body: item.how_to_lead }))}
          />
        </div>
      ) : null}
    </div>
  );
}

function GapColumn({ title, items }: { title: string; items: { skill: string; body: string }[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {items.length ? (
          <div className="space-y-3">
            {items.map((item) => (
              <div key={`${title}-${item.skill}`} className="rounded-md border border-stone-200 p-3">
                <h3 className="font-medium text-stone-950">{item.skill}</h3>
                <p className="mt-1 text-sm leading-6 text-stone-600">{item.body}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-stone-500">Nothing flagged.</p>
        )}
      </CardContent>
    </Card>
  );
}

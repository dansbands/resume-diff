"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown, ChevronRight, Plus, Sparkles, Trash2 } from "lucide-react";

import { createAggregatedDiff } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

type JdItem = {
  id: string;
  text: string;
  open: boolean;
};

export function NewDiffClient() {
  const [draft, setDraft] = useState("");
  const [jds, setJds] = useState<JdItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function addJd() {
    const text = draft.trim();

    if (!text) {
      setError("Paste a job description before adding it.");
      return;
    }

    setJds((current) => [{ id: crypto.randomUUID(), text, open: true }, ...current]);
    setDraft("");
    setError(null);
  }

  function aggregate() {
    setError(null);
    startTransition(async () => {
      const result = await createAggregatedDiff(jds.map((jd) => jd.text));

      if (result.error) {
        setError(result.error);
        return;
      }

      if (result.data) {
        router.push(`/diff/${result.data.diffId}`);
      }
    });
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <section className="min-w-0">
        <Card>
          <CardHeader>
            <CardTitle>Add job descriptions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              placeholder="Paste a full job description..."
              className="min-h-64"
            />
            <div className="flex flex-wrap items-center gap-3">
              <Button onClick={addJd} type="button">
                <Plus className="h-4 w-4" />
                Add JD
              </Button>
              <p className="text-sm text-stone-500">{jds.length} added</p>
            </div>
          </CardContent>
        </Card>

        <div className="mt-4 space-y-3">
          {jds.map((jd, index) => (
            <Card key={jd.id}>
              <button
                className="flex w-full items-center justify-between gap-3 p-4 text-left"
                onClick={() =>
                  setJds((current) =>
                    current.map((item) => (item.id === jd.id ? { ...item, open: !item.open } : item))
                  )
                }
                type="button"
              >
                <span className="flex min-w-0 items-center gap-2">
                  {jd.open ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                  <span className="truncate font-medium text-stone-950">JD {jds.length - index}</span>
                </span>
                <span className="text-xs text-stone-500">{jd.text.length.toLocaleString()} chars</span>
              </button>
              {jd.open ? (
                <CardContent className="space-y-3">
                  <p className="max-h-48 overflow-auto whitespace-pre-wrap rounded-md bg-stone-50 p-3 text-sm text-stone-700">
                    {jd.text}
                  </p>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setJds((current) => current.filter((item) => item.id !== jd.id))}
                    type="button"
                  >
                    <Trash2 className="h-4 w-4" />
                    Remove
                  </Button>
                </CardContent>
              ) : null}
            </Card>
          ))}
        </div>
      </section>

      <section className="min-w-0">
        <Card className="sticky top-6">
          <CardHeader>
            <CardTitle>Aggregate demand</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm leading-6 text-stone-600">
              Runs one Claude extraction per JD, stores the structured outputs, groups normalized skills, and ranks them
              by frequency and level.
            </p>
            <Button disabled={jds.length === 0 || isPending} onClick={aggregate} type="button">
              <Sparkles className="h-4 w-4" />
              {isPending ? "Aggregating..." : "Aggregate"}
            </Button>
            {error ? <p className="rounded-md bg-red-50 p-3 text-sm text-red-700">{error}</p> : null}
          </CardContent>
        </Card>
      </section>
    </div>
  );
}

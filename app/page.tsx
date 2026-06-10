import Link from "next/link";
import { ArrowRight, Layers, Search, Share2 } from "lucide-react";

import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";

const features = [
  ["Extract", "Claude turns each JD into normalized requirements.", Search],
  ["Aggregate", "Skills are ranked by frequency and demand level.", Layers],
  ["Share", "Every diff has a URL for resume gap analysis.", Share2]
] as const;

export default function Home() {
  return (
    <main>
      <SiteHeader />
      <section className="border-b border-stone-200 bg-white">
        <div className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-6xl items-center gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-normal text-emerald-700">Resume Diff</p>
            <h1 className="mt-4 text-4xl font-semibold tracking-normal text-stone-950 sm:text-6xl">
              Rank what the market is asking for before rewriting your resume.
            </h1>
            <p className="mt-5 text-lg leading-8 text-stone-600">
              Paste several job descriptions, extract normalized requirements with Claude, and compare the resulting
              demand map against a resume.
            </p>
            <div className="mt-8">
              <Button asChild size="lg">
                <Link href="/diff/new">
                  Start a new diff
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>

          <div className="grid gap-3 rounded-lg border border-stone-200 bg-stone-50 p-4">
            {features.map(([title, text, Icon]) => (
              <div key={title} className="rounded-md border border-stone-200 bg-white p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-md bg-emerald-50 text-emerald-800">
                    <Icon className="h-4 w-4" />
                  </div>
                  <div>
                    <h2 className="font-semibold text-stone-950">{title}</h2>
                    <p className="text-sm text-stone-600">{text}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

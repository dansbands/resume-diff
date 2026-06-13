import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { GapClient } from "@/app/diff/[id]/gap/gap-client";
import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";

export default async function GapPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return (
    <main>
      <SiteHeader />
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <div className="mb-6">
          <Button asChild variant="ghost" size="sm">
            <Link href={`/diff/${id}`}>
              <ArrowLeft className="h-4 w-4" />
              Back to diff
            </Link>
          </Button>
          <h1 className="mt-4 text-3xl font-semibold tracking-normal text-stone-950">Resume gap analysis</h1>
          <p className="mt-2 text-stone-600">Compare a resume against this diff&apos;s ranked skill demand.</p>
        </div>
        <GapClient diffId={id} />
      </div>
    </main>
  );
}

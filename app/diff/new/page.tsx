import { SiteHeader } from "@/components/site-header";
import { NewDiffClient } from "@/app/diff/new/new-diff-client";

export default function NewDiffPage() {
  return (
    <main>
      <SiteHeader />
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <div className="mb-6">
          <h1 className="text-3xl font-semibold tracking-normal text-stone-950">New diff</h1>
          <p className="mt-2 text-stone-600">Add one or more job descriptions, then aggregate the skill demand.</p>
        </div>
        <NewDiffClient />
      </div>
    </main>
  );
}

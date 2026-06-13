import Link from "next/link";

import { Button } from "@/components/ui/button";

export function SiteHeader() {
  return (
    <header className="border-b border-stone-200 bg-white">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="text-base font-semibold text-stone-950">
          Resume Diff
        </Link>
        <Button asChild variant="outline" size="sm">
          <Link href="/diff/new">New diff</Link>
        </Button>
      </div>
    </header>
  );
}

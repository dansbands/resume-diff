import type { Metadata } from "next";

import "./globals.css";

export const metadata: Metadata = {
  title: "Resume Diff",
  description: "Compare job descriptions, rank skill demand, and analyze resume gaps."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}

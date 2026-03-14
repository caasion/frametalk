"use client";

import React from "react";
type DesktopLayoutProps = {
  children: React.ReactNode;
  currentStep?: number;
  detectedObject?: string | null;
  steps?: Array<{ num: number; label: string }>;
};

export default function DesktopLayout({ children }: DesktopLayoutProps) {
  return (
    <div className="relative min-h-svh overflow-hidden bg-(--green-900) px-3 py-3 sm:px-6 sm:py-6">

      <main className="relative mx-auto min-h-[calc(100svh-1.5rem)] w-full max-w-115 overflow-hidden rounded-4xl border border-(--line-soft) bg-(--surface-main) shadow-[0_20px_48px_rgba(10,60,38,0.16)] sm:min-h-175 md:min-h-0 md:h-211 md:w-97.5 md:max-w-none">
        {children}
      </main>
    </div>
  );
}
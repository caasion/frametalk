"use client";

import React from "react";
import Link from "next/link";
import DesktopLayout from "@/components/DesktopLayout";

function IconSpark() {
  return (
    <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
      <path d="M12 3l2.3 5.7L20 11l-5.7 2.3L12 19l-2.3-5.7L4 11l5.7-2.3L12 3z" />
    </svg>
  );
}

function IconGrid() {
  return (
    <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
    </svg>
  );
}

function IconGlobe() {
  return (
    <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
      <circle cx="12" cy="12" r="10" />
      <line x1="2" y1="12" x2="22" y2="12" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  );
}

function IconPulse() {
  return (
    <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
      <path d="M22 12h-4l-2.5 5L9 7l-2.5 5H2" />
    </svg>
  );
}

type OrbButtonProps = {
  href: string;
  icon: React.ReactNode;
  label: string;
  delay?: number;
};

function OrbButton({ href, icon, label, delay = 0 }: OrbButtonProps) {
  return (
    <Link
      href={href}
      aria-label={label}
      className="group animate-rise-in rounded-[28px] border border-(--line-soft) bg-[linear-gradient(160deg,#ffffff,#f6fbef)] p-5 text-(--green-700) shadow-[0_10px_24px_rgba(7,70,43,0.1)] transition-all duration-300 hover:-translate-y-1 hover:border-(--gold-500) hover:shadow-[0_16px_28px_rgba(157,122,23,0.18)]"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex h-22 items-center justify-center rounded-[22px] bg-[radial-gradient(circle_at_30%_20%,#e8f4d6,#d7f0e2)] text-(--green-800) transition-transform duration-300 group-hover:scale-105">
        {icon}
      </div>
      <div className="mt-3 text-center text-[12px] font-semibold tracking-[0.02em] text-(--green-800)">{label}</div>
    </Link>
  );
}

export default function HomePage() {
  return (
    <DesktopLayout>
      <div className="relative flex h-full flex-col overflow-hidden bg-[linear-gradient(160deg,#eef8dd_0%,#f8fff4_40%,#ffffff_100%)] p-5">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-[linear-gradient(180deg,rgba(20,113,79,0.08),rgba(20,113,79,0))]" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-[linear-gradient(0deg,rgba(183,146,44,0.09),rgba(183,146,44,0))]" />

        <header className="relative z-10 flex items-center justify-between py-1">
          <div className="font-(--font-display) text-2xl tracking-[0.03em] text-(--green-800)">FT</div>
          <div className="h-2.5 w-2.5 rounded-full bg-(--gold-500) shadow-[0_0_0_6px_rgba(183,146,44,0.2)]" />
        </header>

        <div className="relative z-10 mt-8 grid flex-1 grid-cols-2 gap-4">
          <OrbButton href="/pictogram" icon={<IconGrid />} label="Pictograms" delay={20} />
          <OrbButton href="/pictogram" icon={<IconPulse />} label="Health" delay={120} />
          <OrbButton href="/pictogram" icon={<IconGlobe />} label="Language" delay={220} />
          <OrbButton href="/pictogram" icon={<IconSpark />} label="Start" delay={320} />
        </div>

        <footer className="relative z-10 mt-6 flex items-center justify-center gap-3 pb-1">
          <div className="h-1.5 w-9 rounded-full bg-(--green-700)" />
          <div className="h-1.5 w-1.5 rounded-full bg-(--gold-500)" />
          <div className="h-1.5 w-9 rounded-full bg-(--green-700)" />
        </footer>
      </div>
    </DesktopLayout>
  );
}
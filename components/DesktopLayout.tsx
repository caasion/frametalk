"use client";

import React from "react";

function IconBook() {
  return (
    <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
    </svg>
  );
}

function IconLayers() {
  return (
    <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <polygon points="12 2 2 7 12 12 22 7 12 2" />
      <polyline points="2 17 12 22 22 17" />
      <polyline points="2 12 12 17 22 12" />
    </svg>
  );
}

function IconTrendingUp() {
  return (
    <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
      <polyline points="17 6 23 6 23 12" />
    </svg>
  );
}

function IconGlobe() {
  return (
    <svg className="h-[11px] w-[11px]" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
      <circle cx="12" cy="12" r="10" />
      <line x1="2" y1="12" x2="22" y2="12" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  );
}

function IconSettings() {
  return (
    <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  );
}

type NavItemProps = {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
};

function NavItem({ icon, label, active = false }: NavItemProps) {
  return (
    <div
      className={`flex cursor-pointer items-center gap-2 rounded-[8px] px-[10px] py-2 text-xs font-bold transition-colors ${
        active ? "bg-[#E1F5EE] text-[#0F6E56]" : "text-[#888780] hover:bg-[#ffffff]"
      }`}
    >
      {icon}
      {label}
    </div>
  );
}

function Sidebar() {
  return (
    <div className="flex w-[180px] shrink-0 flex-col gap-1 pt-2">
      <div className="mb-4">
        <div className="text-[22px] font-extrabold tracking-[-0.5px] text-[#0F6E56]">
          Frame<span className="text-[#1D9E75]">Talk</span>
        </div>
        <div className="mt-0.5 text-[11px] font-semibold leading-[1.5] text-[#888780]">See it. Say it. Master it.</div>
      </div>

      <div className="px-[10px] py-1 text-[10px] font-bold uppercase tracking-[1px] text-[#B4B2A9]">Learn</div>
      <NavItem icon={<IconBook />} label="New lesson" active />
      <NavItem icon={<IconLayers />} label="My lessons" />
      <NavItem icon={<IconTrendingUp />} label="Progress" />

      <div className="mt-2 px-[10px] py-1 text-[10px] font-bold uppercase tracking-[1px] text-[#B4B2A9]">Settings</div>
      <NavItem icon={<IconSettings />} label="Language" />

      <div className="mt-auto rounded-[12px] border border-[#d3d1c7] bg-white p-3 pt-6">
        <div className="mb-1 text-[11px] font-extrabold text-[#0F6E56]">Stuck?</div>
        <div className="text-[10px] leading-[1.5] text-[#888780]">Tap the globe any time to hear the phrase in your language.</div>
        <div className="mt-1.5 inline-flex cursor-pointer items-center gap-1 rounded-full bg-[#1D9E75] px-2.5 py-1 text-[10px] font-bold text-white">
          <IconGlobe /> Globe hint
        </div>
      </div>
    </div>
  );
}

const DEFAULT_STEPS = [
  { num: 1, label: "Upload object" },
  { num: 2, label: "Comic story" },
  { num: 3, label: "Say it out loud" },
];

type StepDef = { num: number; label: string };

type RightPanelProps = {
  currentStep?: number;
  detectedObject?: string | null;
  steps?: StepDef[];
};

function RightPanel({ currentStep = 1, detectedObject = null, steps = DEFAULT_STEPS }: RightPanelProps) {
  return (
    <div className="flex w-[200px] shrink-0 flex-col gap-3 pt-2">
      <div className="text-[10px] font-bold uppercase tracking-[1px] text-[#B4B2A9]">Flow</div>

      <div className="flex flex-col gap-1.5">
        {steps.map((s) => {
          const isCurrent = s.num === currentStep;
          const isDone = s.num < currentStep;
          return (
            <div
              key={s.num}
              className={`flex items-center gap-2 rounded-[10px] border px-[10px] py-2 ${
                isCurrent ? "border-[#1D9E75] bg-[#E1F5EE]" : "border-[#d3d1c7] bg-white"
              }`}
            >
              <div
                className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 text-[10px] font-extrabold ${
                  s.num <= currentStep
                    ? `${isDone ? "bg-[#1D9E75]" : "bg-[#E1F5EE]"} border-[#1D9E75] text-[#0F6E56]`
                    : "border-[#d3d1c7] bg-[#E1F5EE] text-[#B4B2A9]"
                }`}
              >
                {s.num}
              </div>
              <div className={`text-[11px] font-semibold ${isCurrent ? "text-[#0F6E56]" : "text-[#888780]"}`}>{s.label}</div>
            </div>
          );
        })}
      </div>

      <div className="mt-1 text-[10px] font-bold uppercase tracking-[1px] text-[#B4B2A9]">Object detected</div>
      <div className="rounded-[12px] border border-[#d3d1c7] bg-white p-3">
        <div className="mb-2 inline-flex items-center gap-1 rounded-full bg-[#E1F5EE] px-2.5 py-[3px] text-[10px] font-bold text-[#0F6E56]">
          {detectedObject ? "Detected" : "Waiting..."}
        </div>
        <div className="mb-0.5 text-xs font-extrabold text-[#2C2C2A]">{detectedObject ?? "No photo yet"}</div>
        <div className="text-[10px] leading-[1.4] text-[#888780]">
          {detectedObject
            ? `GPT-4o identified: ${detectedObject}`
            : "Upload a photo and GPT-4o will identify the object and build your story."}
        </div>
      </div>

      <div className="rounded-[10px] border border-[#d3d1c7] bg-white p-2.5">
        <div className="mb-1 text-[10px] font-extrabold text-[#2C2C2A]">Keyboard shortcuts</div>
        <div className="text-[10px] leading-[1.6] text-[#888780]">
          <span className="rounded border border-[#d3d1c7] bg-[#F7F6F2] px-1.5 py-px font-bold">Space</span> replay audio
          <br />
          <span className="rounded border border-[#d3d1c7] bg-[#F7F6F2] px-1.5 py-px font-bold">R</span> start recording
        </div>
      </div>
    </div>
  );
}

type PhoneFrameProps = {
  children: React.ReactNode;
};

function PhoneFrame({ children }: PhoneFrameProps) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="w-[380px] rounded-[44px] bg-[#1a1a1a] p-2.5 shadow-[0_0_0_1px_#333,0_24px_48px_rgba(0,0,0,0.18)]">
        <div className="mx-auto mb-1 flex h-6 w-[90px] items-center justify-center gap-[7px] rounded-b-[16px] bg-[#1a1a1a]">
          <div className="h-[7px] w-[7px] rounded-full border-[1.5px] border-[#333] bg-[#2a2a2a]" />
          <div className="h-1 w-[34px] rounded bg-[#2a2a2a]" />
          <div className="h-[7px] w-[7px] rounded-full border-[1.5px] border-[#333] bg-[#2a2a2a]" />
        </div>

        <div className="min-h-[700px] overflow-hidden rounded-[32px] bg-[#F7F6F2]">{children}</div>

        <div className="mx-auto mt-2 h-1 w-16 rounded bg-[#2a2a2a]" />
      </div>
      <div className="text-[11px] font-semibold text-[#888780]">Mobile screen - desktop frame</div>
    </div>
  );
}

type DesktopLayoutProps = {
  children: React.ReactNode;
  currentStep?: number;
  detectedObject?: string | null;
  steps?: StepDef[];
};

export default function DesktopLayout({ children, currentStep = 1, detectedObject = null, steps }: DesktopLayoutProps) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f0ede6] px-6 py-8">
      <div className="flex items-start justify-center gap-9">
        <Sidebar />
        <PhoneFrame>{children}</PhoneFrame>
        <RightPanel currentStep={currentStep} detectedObject={detectedObject} steps={steps} />
      </div>
    </div>
  );
}
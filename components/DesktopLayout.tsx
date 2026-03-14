"use client";

import React from "react";

// ─── Icons ────────────────────────────────────────────────────────────────────

function IconBook() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
    </svg>
  );
}

function IconLayers() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <polygon points="12 2 2 7 12 12 22 7 12 2" />
      <polyline points="2 17 12 22 22 17" />
      <polyline points="2 12 12 17 22 12" />
    </svg>
  );
}

function IconTrendingUp() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
      <polyline points="17 6 23 6 23 12" />
    </svg>
  );
}

function IconGlobe() {
  return (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
      <circle cx="12" cy="12" r="10" />
      <line x1="2" y1="12" x2="22" y2="12" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  );
}

function IconSettings() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  );
}

// ─── Nav Item ─────────────────────────────────────────────────────────────────

type NavItemProps = {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
};

function NavItem({ icon, label, active = false }: NavItemProps) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        padding: "8px 10px",
        borderRadius: "var(--radius-sm)",
        fontSize: 12,
        fontWeight: 700,
        color: active ? "var(--green-dark)" : "var(--text-muted)",
        background: active ? "var(--green-pale)" : "transparent",
        cursor: "pointer",
        transition: "background 0.15s, color 0.15s",
      }}
    >
      {icon}
      {label}
    </div>
  );
}

// ─── Sidebar ──────────────────────────────────────────────────────────────────

function Sidebar() {
  return (
    <div
      style={{
        width: 180,
        flexShrink: 0,
        display: "flex",
        flexDirection: "column",
        gap: 4,
        paddingTop: 8,
      }}
    >
      {/* Logo */}
      <div style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 22, fontWeight: 800, color: "var(--green-dark)", letterSpacing: -0.5 }}>
          Frame<span style={{ color: "var(--green-mid)" }}>Talk</span>
        </div>
        <div style={{ fontSize: 11, color: "var(--text-muted)", fontWeight: 600, lineHeight: 1.5, marginTop: 2 }}>
          See it. Say it. Master it.
        </div>
      </div>

      {/* Nav */}
      <div style={{ fontSize: 10, fontWeight: 700, color: "var(--text-faint)", textTransform: "uppercase", letterSpacing: 1, padding: "4px 10px" }}>
        Learn
      </div>
      <NavItem icon={<IconBook />} label="New lesson" active />
      <NavItem icon={<IconLayers />} label="My lessons" />
      <NavItem icon={<IconTrendingUp />} label="Progress" />

      <div style={{ fontSize: 10, fontWeight: 700, color: "var(--text-faint)", textTransform: "uppercase", letterSpacing: 1, padding: "4px 10px", marginTop: 8 }}>
        Settings
      </div>
      <NavItem icon={<IconSettings />} label="Language" />

      {/* Globe hint card */}
      <div
        style={{
          marginTop: "auto",
          paddingTop: 24,
          background: "var(--bg-white)",
          borderRadius: "var(--radius-md)",
          border: "1px solid var(--border)",
          padding: 12,
        }}
      >
        <div style={{ fontSize: 11, fontWeight: 800, color: "var(--green-dark)", marginBottom: 4 }}>Stuck?</div>
        <div style={{ fontSize: 10, color: "var(--text-muted)", lineHeight: 1.5 }}>
          Tap the globe any time to hear the phrase in your language.
        </div>
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 4,
            background: "var(--green-mid)",
            color: "white",
            borderRadius: 20,
            padding: "4px 10px",
            fontSize: 10,
            fontWeight: 700,
            marginTop: 6,
            cursor: "pointer",
          }}
        >
          <IconGlobe /> Globe hint
        </div>
      </div>
    </div>
  );
}

// ─── Right Panel ──────────────────────────────────────────────────────────────

const STEPS = [
  { num: 1, label: "Upload object" },
  { num: 2, label: "Comic story" },
  { num: 3, label: "Say it out loud" },
];

type RightPanelProps = {
  currentStep?: number;
  detectedObject?: string | null;
};

function RightPanel({ currentStep = 1, detectedObject = null }: RightPanelProps) {
  return (
    <div style={{ width: 200, flexShrink: 0, display: "flex", flexDirection: "column", gap: 12, paddingTop: 8 }}>
      <div style={{ fontSize: 10, fontWeight: 700, color: "var(--text-faint)", textTransform: "uppercase", letterSpacing: 1 }}>
        Flow
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {STEPS.map((s) => (
          <div
            key={s.num}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "8px 10px",
              background: s.num === currentStep ? "var(--green-pale)" : "var(--bg-white)",
              borderRadius: 10,
              border: `1px solid ${s.num === currentStep ? "var(--green-mid)" : "var(--border)"}`,
            }}
          >
            <div
              style={{
                width: 20,
                height: 20,
                borderRadius: "50%",
                background: s.num < currentStep ? "var(--green-mid)" : s.num === currentStep ? "var(--green-pale)" : "var(--green-pale)",
                border: s.num <= currentStep ? `2px solid var(--green-mid)` : "2px solid var(--border)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 10,
                fontWeight: 800,
                color: s.num <= currentStep ? "var(--green-dark)" : "var(--text-faint)",
                flexShrink: 0,
              }}
            >
              {s.num}
            </div>
            <div style={{ fontSize: 11, fontWeight: 600, color: s.num === currentStep ? "var(--green-dark)" : "var(--text-muted)" }}>
              {s.label}
            </div>
          </div>
        ))}
      </div>

      <div style={{ fontSize: 10, fontWeight: 700, color: "var(--text-faint)", textTransform: "uppercase", letterSpacing: 1, marginTop: 4 }}>
        Object detected
      </div>
      <div style={{ background: "var(--bg-white)", borderRadius: "var(--radius-md)", border: "1px solid var(--border)", padding: 12 }}>
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 4,
            background: "var(--green-pale)",
            borderRadius: 20,
            padding: "3px 10px",
            fontSize: 10,
            fontWeight: 700,
            color: "var(--green-dark)",
            marginBottom: 8,
          }}
        >
          {detectedObject ? "Detected" : "Waiting..."}
        </div>
        <div style={{ fontSize: 12, fontWeight: 800, color: "var(--text-primary)", marginBottom: 2 }}>
          {detectedObject ?? "No photo yet"}
        </div>
        <div style={{ fontSize: 10, color: "var(--text-muted)", lineHeight: 1.4 }}>
          {detectedObject
            ? `GPT-4o identified: ${detectedObject}`
            : "Upload a photo and GPT-4o will identify the object and build your story."}
        </div>
      </div>

      <div style={{ background: "var(--bg-white)", borderRadius: 10, border: "1px solid var(--border)", padding: 10 }}>
        <div style={{ fontSize: 10, fontWeight: 800, color: "var(--text-primary)", marginBottom: 3 }}>Keyboard shortcuts</div>
        <div style={{ fontSize: 10, color: "var(--text-muted)", lineHeight: 1.6 }}>
          <span style={{ background: "var(--bg-surface)", border: "1px solid var(--border)", borderRadius: 4, padding: "1px 6px", fontWeight: 700 }}>Space</span>{" "}
          replay audio
          <br />
          <span style={{ background: "var(--bg-surface)", border: "1px solid var(--border)", borderRadius: 4, padding: "1px 6px", fontWeight: 700 }}>R</span>{" "}
          start recording
        </div>
      </div>
    </div>
  );
}

// ─── Phone Frame ──────────────────────────────────────────────────────────────

type PhoneFrameProps = {
  children: React.ReactNode;
};

function PhoneFrame({ children }: PhoneFrameProps) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
      <div
        style={{
          width: 380,
          background: "#1a1a1a",
          borderRadius: 44,
          padding: 10,
          boxShadow: "0 0 0 1px #333, 0 24px 48px rgba(0,0,0,0.18)",
        }}
      >
        {/* Notch */}
        <div style={{ width: 90, height: 24, background: "#1a1a1a", borderRadius: "0 0 16px 16px", margin: "0 auto 4px", display: "flex", alignItems: "center", justifyContent: "center", gap: 7 }}>
          <div style={{ width: 7, height: 7, background: "#2a2a2a", borderRadius: "50%", border: "1.5px solid #333" }} />
          <div style={{ width: 34, height: 4, background: "#2a2a2a", borderRadius: 4 }} />
          <div style={{ width: 7, height: 7, background: "#2a2a2a", borderRadius: "50%", border: "1.5px solid #333" }} />
        </div>

        {/* Screen */}
        <div style={{ background: "var(--bg-surface)", borderRadius: 32, overflow: "hidden", minHeight: 700 }}>
          {children}
        </div>

        {/* Home bar */}
        <div style={{ width: 64, height: 4, background: "#2a2a2a", borderRadius: 4, margin: "8px auto 0" }} />
      </div>
      <div style={{ fontSize: 11, color: "var(--text-muted)", fontWeight: 600 }}>
        Mobile screen — desktop frame
      </div>
    </div>
  );
}

// ─── Desktop Layout ───────────────────────────────────────────────────────────

type DesktopLayoutProps = {
  children: React.ReactNode;
  currentStep?: number;
  detectedObject?: string | null;
};

export default function DesktopLayout({ children, currentStep = 1, detectedObject = null }: DesktopLayoutProps) {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "var(--bg-page)",
        padding: "32px 24px",
      }}
    >
      <div style={{ display: "flex", gap: 36, alignItems: "flex-start", justifyContent: "center" }}>
        <Sidebar />
        <PhoneFrame>{children}</PhoneFrame>
        <RightPanel currentStep={currentStep} detectedObject={detectedObject} />
      </div>
    </div>
  );
}
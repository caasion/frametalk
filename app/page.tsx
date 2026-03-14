"use client";

import React, { useRef, useState } from "react";
import DesktopLayout from "@/components/DesktopLayout";

// ─── Icons ────────────────────────────────────────────────────────────────────

function IconUpload() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--green-mid)" strokeWidth="2.5">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="17 8 12 3 7 8" />
      <line x1="12" y1="3" x2="12" y2="15" />
    </svg>
  );
}

function IconCamera() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
      <circle cx="12" cy="13" r="4" />
    </svg>
  );
}

function IconGlobe() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
      <circle cx="12" cy="12" r="10" />
      <line x1="2" y1="12" x2="22" y2="12" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  );
}

function IconChevron() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--green-dark)" strokeWidth="2.5">
      <polyline points="9 18 15 12 9 6" />
    </svg>
  );
}

// ─── Screen ───────────────────────────────────────────────────────────────────

export default function UploadScreen() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);

  function handleFile(file: File) {
    if (!file.type.startsWith("image/")) return;
    const url = URL.createObjectURL(file);
    setPreview(url);
    // TODO: pass file to vision.ts → GPT-4o
  }

  function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  }

  function onDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  }

  return (
    <DesktopLayout currentStep={1} detectedObject={null}>
      {/* Phone screen content */}

      {/* Header */}
      <div style={{ background: "var(--green-mid)", padding: "16px 16px 14px" }}>
        <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", color: "rgba(255,255,255,0.7)", marginBottom: 3 }}>
          FrameTalk
        </div>
        <div style={{ fontSize: 19, fontWeight: 800, color: "white" }}>See it, say it</div>
      </div>

      {/* Body */}
      <div style={{ padding: 14, display: "flex", flexDirection: "column", gap: 12 }}>
        <div style={{ fontSize: 10, fontWeight: 700, color: "var(--green-dark)", textTransform: "uppercase", letterSpacing: 1 }}>
          Step 1 — Pick an object
        </div>

        {/* Upload zone */}
        <div
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={onDrop}
          onClick={() => fileInputRef.current?.click()}
          style={{
            background: preview ? "transparent" : "var(--bg-white)",
            border: `2px dashed ${dragging ? "var(--green-mid)" : "var(--green-light)"}`,
            borderRadius: "var(--radius-lg)",
            minHeight: 140,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 6,
            cursor: "pointer",
            overflow: "hidden",
            transition: "border-color 0.15s",
            position: "relative",
          }}
        >
          {preview ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={preview}
              alt="uploaded object"
              style={{ width: "100%", height: 140, objectFit: "cover", borderRadius: "var(--radius-lg)" }}
            />
          ) : (
            <>
              <div style={{ width: 42, height: 42, background: "var(--green-pale)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <IconUpload />
              </div>
              <div style={{ fontSize: 12, fontWeight: 700, color: "var(--green-dark)" }}>Upload a photo</div>
              <div style={{ fontSize: 10, color: "var(--text-muted)" }}>pill bottle · bus pass · utility bill...</div>
            </>
          )}
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          style={{ display: "none" }}
          onChange={onFileChange}
        />

        {/* OR divider */}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
          <div style={{ fontSize: 10, color: "var(--text-muted)", fontWeight: 600 }}>or</div>
          <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
        </div>

        {/* Camera button */}
        <button
          onClick={() => {
            // TODO: open getUserMedia camera stream
            alert("Camera integration — wire up getUserMedia or a file input with capture='environment'");
          }}
          style={{
            background: "var(--green-mid)",
            color: "white",
            border: "none",
            borderRadius: "var(--radius-md)",
            padding: "11px 14px",
            fontFamily: "inherit",
            fontSize: 13,
            fontWeight: 700,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 7,
            cursor: "pointer",
            width: "100%",
            transition: "opacity 0.15s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.88")}
          onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
        >
          <IconCamera />
          Use camera
        </button>

        {/* Globe hint row */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            background: "var(--green-pale)",
            borderRadius: "var(--radius-md)",
            padding: "10px 12px",
            cursor: "pointer",
          }}
        >
          <div style={{ width: 22, height: 22, background: "var(--green-mid)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <IconGlobe />
          </div>
          <div style={{ fontSize: 11, color: "var(--green-dark)", fontWeight: 700, flex: 1 }}>
            Hear in your language
          </div>
          <IconChevron />
        </div>

        {/* Continue button — shown once image is uploaded */}
        {preview && (
          <button
            onClick={() => {
              // TODO: navigate to /comic or trigger GPT-4o call
              alert("Proceed to comic strip screen");
            }}
            style={{
              background: "var(--green-dark)",
              color: "white",
              border: "none",
              borderRadius: "var(--radius-md)",
              padding: "12px 14px",
              fontFamily: "inherit",
              fontSize: 13,
              fontWeight: 800,
              cursor: "pointer",
              width: "100%",
              transition: "opacity 0.15s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.88")}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
          >
            Build my story →
          </button>
        )}
      </div>
    </DesktopLayout>
  );
}
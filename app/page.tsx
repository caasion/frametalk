"use client";

import React, { useRef, useState } from "react";
import Link from "next/link";
import DesktopLayout from "@/components/DesktopLayout";

// ─── Icons ────────────────────────────────────────────────────────────────────

function IconUpload() {
  return (
    <svg className="h-[22px] w-[22px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
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
    <svg className="h-[13px] w-[13px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <polyline points="9 18 15 12 9 6" />
    </svg>
  );
}

function IconGrid() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
      <rect x="3" y="3" width="7" height="7" />
      <rect x="14" y="3" width="7" height="7" />
      <rect x="3" y="14" width="7" height="7" />
      <rect x="14" y="14" width="7" height="7" />
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
      <div className="bg-[#1D9E75] px-4 pb-3.5 pt-4">
        <div className="mb-[3px] text-[10px] font-bold uppercase tracking-[1.5px] text-white/70">
          FrameTalk
        </div>
        <div className="text-[19px] font-extrabold text-white">See it, say it</div>
      </div>

      <div className="flex flex-col gap-3 p-[14px]">
        <div className="text-[10px] font-bold uppercase tracking-[1px] text-[#0F6E56]">
          Step 1 — Pick an object
        </div>

        <div
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={onDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`relative flex min-h-[140px] cursor-pointer flex-col items-center justify-center gap-1.5 overflow-hidden rounded-[16px] border-2 border-dashed transition-colors ${
            preview ? "bg-transparent" : "bg-white"
          } ${dragging ? "border-[#1D9E75]" : "border-[#9FE1CB]"}`}
        >
          {preview ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={preview}
              alt="uploaded object"
              className="h-[140px] w-full rounded-[16px] object-cover"
            />
          ) : (
            <>
              <div className="flex h-[42px] w-[42px] items-center justify-center rounded-full bg-[#E1F5EE] text-[#1D9E75]">
                <IconUpload />
              </div>
              <div className="text-xs font-bold text-[#0F6E56]">Upload a photo</div>
              <div className="text-[10px] text-[#888780]">pill bottle · bus pass · utility bill...</div>
            </>
          )}
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={onFileChange}
        />

        <div className="flex items-center gap-2">
          <div className="h-px flex-1 bg-[#d3d1c7]" />
          <div className="text-[10px] font-semibold text-[#888780]">or</div>
          <div className="h-px flex-1 bg-[#d3d1c7]" />
        </div>

        <button
          onClick={() => {
            alert("Camera integration — wire up getUserMedia or a file input with capture='environment'");
          }}
          className="flex w-full cursor-pointer items-center justify-center gap-[7px] rounded-[12px] bg-[#1D9E75] px-[14px] py-[11px] text-[13px] font-bold text-white transition-opacity hover:opacity-90"
        >
          <IconCamera />
          Use camera
        </button>

        <div className="flex items-center gap-2">
          <div className="h-px flex-1 bg-[#d3d1c7]" />
          <div className="text-[10px] font-semibold text-[#888780]">or</div>
          <div className="h-px flex-1 bg-[#d3d1c7]" />
        </div>

        <Link
          href="/pictogram"
          className="flex w-full items-center justify-center gap-[7px] rounded-[12px] bg-[#0F6E56] px-[14px] py-[11px] text-[13px] font-bold text-white transition-opacity hover:opacity-90"
        >
          <IconGrid />
          Use pictograms
        </Link>

        <div className="flex cursor-pointer items-center gap-2 rounded-[12px] bg-[#E1F5EE] px-3 py-2.5">
          <div className="flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-full bg-[#1D9E75]">
            <IconGlobe />
          </div>
          <div className="flex-1 text-[11px] font-bold text-[#0F6E56]">
            Hear in your language
          </div>
          <div className="text-[#0F6E56]">
            <IconChevron />
          </div>
        </div>

        {preview && (
          <button
            onClick={() => {
              alert("Proceed to comic strip screen");
            }}
            className="w-full cursor-pointer rounded-[12px] bg-[#0F6E56] px-[14px] py-3 text-[13px] font-extrabold text-white transition-opacity hover:opacity-90"
          >
            Build my story -&gt;
          </button>
        )}
      </div>
    </DesktopLayout>
  );
}
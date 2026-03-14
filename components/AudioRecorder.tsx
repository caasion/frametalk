"use client";

/**
 * AudioRecorder – Hold-to-record component with zero-text, visual-only UI.
 *
 * Records audio as WAV (16kHz mono PCM) using the WavRecorder utility,
 * which Azure Speech SDK can process directly.
 *
 * States:
 *   idle       → dark grey mic icon
 *   recording  → red background + pulsing ring
 *   processing → amber background + spinning ring
 */

import React, { useState, useRef, useCallback } from "react";
import { WavRecorder } from "@/lib/wavRecorder";

// ─── Types ──────────────────────────────────────────────────────────────────

interface EvaluationWord {
  word: string;
  accuracy_score: number;
  is_omitted: boolean;
}

interface EvaluationResult {
  target: string;
  overall_accuracy: number;
  words: EvaluationWord[];
}

interface AudioRecorderProps {
  targetSentence: string;
  onResult: (result: EvaluationResult) => void;
  onError?: (error: string) => void;
}

type RecordingState = "idle" | "recording" | "processing";

// ─── Component ──────────────────────────────────────────────────────────────

export default function AudioRecorder({
  targetSentence,
  onResult,
  onError,
}: AudioRecorderProps) {
  const [state, setState] = useState<RecordingState>("idle");
  const wavRecorderRef = useRef<WavRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // ── Mic access ────────────────────────────────────────────────────────────

  const ensureMicAccess = useCallback(async () => {
    if (streamRef.current) return;
    try {
      streamRef.current = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
        },
      });
    } catch {
      onError?.("Microphone access denied.");
      throw new Error("Mic denied");
    }
  }, [onError]);

  // ── Send to backend ───────────────────────────────────────────────────────

  const sendForEvaluation = useCallback(
    async (blob: Blob) => {
      const formData = new FormData();
      formData.append("audio", blob, "recording.wav");
      formData.append("target_sentence", targetSentence);

      try {
        const res = await fetch("/api/evaluate", {
          method: "POST",
          body: formData,
        });

        if (!res.ok) {
          const detail = await res.text();
          onError?.(`Evaluation failed: ${detail}`);
          setState("idle");
          return;
        }

        const data: EvaluationResult = await res.json();
        onResult(data);
      } catch (err) {
        onError?.(
          `Network error: ${err instanceof Error ? err.message : "unknown"}`
        );
      } finally {
        setState("idle");
      }
    },
    [targetSentence, onResult, onError]
  );

  // ── Start / stop recording ────────────────────────────────────────────────

  const startRecording = useCallback(async () => {
    try {
      await ensureMicAccess();
    } catch {
      return;
    }

    const recorder = new WavRecorder();
    await recorder.start(streamRef.current!);
    wavRecorderRef.current = recorder;
    setState("recording");
  }, [ensureMicAccess]);

  const stopRecording = useCallback(() => {
    if (!wavRecorderRef.current) return;

    setState("processing");
    const wavBlob = wavRecorderRef.current.stop();
    wavRecorderRef.current = null;
    sendForEvaluation(wavBlob);
  }, [sendForEvaluation]);

  // ── Event handlers ────────────────────────────────────────────────────────

  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      e.preventDefault();
      if (state === "idle") startRecording();
    },
    [state, startRecording]
  );

  const handlePointerUp = useCallback(
    (e: React.PointerEvent) => {
      e.preventDefault();
      if (state === "recording") stopRecording();
    },
    [state, stopRecording]
  );

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="flex items-center justify-center">
      <button
        className={`relative flex h-[88px] w-[88px] cursor-pointer items-center justify-center rounded-full border-none transition-all duration-200 ${
          state === "recording"
            ? "scale-[1.08] bg-[#7f1d1d] text-[#fca5a5]"
            : state === "processing"
            ? "cursor-wait bg-[#78350f] text-[#fcd34d]"
            : "bg-[#2a2a2e] text-[#9ca3af] hover:bg-[#3a3a40]"
        }`}
        style={{ touchAction: "none", WebkitTapHighlightColor: "transparent" }}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
        aria-label="Hold to record"
      >
        {/* Pulse ring (recording) */}
        {state === "recording" && (
          <span
            className="pointer-events-none absolute -inset-[10px] rounded-full border-[3px] border-red-500"
            style={{ animation: "pulse-ring 1s ease-out infinite" }}
          />
        )}

        {/* Spinner ring (processing) */}
        {state === "processing" && (
          <span className="pointer-events-none absolute -inset-[6px] animate-spin rounded-full border-[3px] border-transparent border-t-amber-500" />
        )}

        {/* Mic icon */}
        <svg
          className="z-10 h-9 w-9"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect x="9" y="2" width="6" height="12" rx="3" fill="currentColor" />
          <path
            d="M5 11a7 7 0 0 0 14 0"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <line x1="12" y1="18" x2="12" y2="22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <line x1="8" y1="22" x2="16" y2="22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </button>
    </div>
  );
}

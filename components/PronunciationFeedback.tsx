"use client";

/**
 * PronunciationFeedback – Karaoke-style word-by-word reveal with TTS emphasis.
 *
 * After receiving scores, reveals each word left-to-right:
 *   1. Highlights the current word (active state)
 *   2. Speaks it slowly with emphasis
 *   3. Shows the score result (green pulse / red shake)
 *   4. Plays success chime or fail buzz
 *   5. Moves to the next word
 *
 * Tapping a red tile replays that word via SpeechSynthesis.
 */

import React, { useState, useEffect, useRef, useCallback } from "react";

// ─── Types ──────────────────────────────────────────────────────────────────

interface Pictogram {
  id: string;
  label: string;
  imageUrl: string;
}

interface WordScore {
  word: string;
  accuracy_score: number;
  is_omitted: boolean;
}

type WordStatus = "pending" | "active" | "correct" | "incorrect";

interface WordState {
  id: string;
  label: string;
  imageUrl: string;
  status: WordStatus;
  score: number;
  isOmitted: boolean;
}

interface PronunciationFeedbackProps {
  pictograms: Pictogram[];
  scores: WordScore[];
  onComplete?: () => void;
}

// ─── Constants ──────────────────────────────────────────────────────────────

const PASS_THRESHOLD = 70;

// ─── Audio helpers (Web Audio API generated tones) ──────────────────────────

let audioCtx: AudioContext | null = null;
function getAudioCtx(): AudioContext {
  if (!audioCtx) audioCtx = new AudioContext();
  return audioCtx;
}

function playSuccessChime() {
  const ctx = getAudioCtx();
  const now = ctx.currentTime;

  // Rising two-tone: D5 → G5
  const osc1 = ctx.createOscillator();
  const gain1 = ctx.createGain();
  osc1.type = "sine";
  osc1.frequency.value = 587.33;
  gain1.gain.setValueAtTime(0.18, now);
  gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
  osc1.connect(gain1).connect(ctx.destination);
  osc1.start(now);
  osc1.stop(now + 0.25);

  const osc2 = ctx.createOscillator();
  const gain2 = ctx.createGain();
  osc2.type = "sine";
  osc2.frequency.value = 783.99;
  gain2.gain.setValueAtTime(0.18, now + 0.12);
  gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
  osc2.connect(gain2).connect(ctx.destination);
  osc2.start(now + 0.12);
  osc2.stop(now + 0.4);
}

function playFailSound() {
  const ctx = getAudioCtx();
  const now = ctx.currentTime;

  // Descending buzz: 440 → 220 Hz
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = "triangle";
  osc.frequency.setValueAtTime(440, now);
  osc.frequency.linearRampToValueAtTime(220, now + 0.35);
  gain.gain.setValueAtTime(0.2, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
  osc.connect(gain).connect(ctx.destination);
  osc.start(now);
  osc.stop(now + 0.35);
}

// ─── TTS helper ─────────────────────────────────────────────────────────────

function speakWord(word: string): Promise<void> {
  return new Promise((resolve) => {
    if (typeof window === "undefined" || !window.speechSynthesis) {
      resolve();
      return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(word);
    utterance.rate = 0.5; // very slow, emphasised
    utterance.pitch = 1.1;
    utterance.lang = "en-US";
    utterance.onend = () => resolve();
    utterance.onerror = () => resolve();
    window.speechSynthesis.speak(utterance);
  });
}

function wait(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// ─── Component ──────────────────────────────────────────────────────────────

export default function PronunciationFeedback({
  pictograms,
  scores,
  onComplete,
}: PronunciationFeedbackProps) {
  const [wordStates, setWordStates] = useState<WordState[]>([]);
  const [activeIndex, setActiveIndex] = useState(-1);
  const hasRevealedRef = useRef(false);

  // Build initial word states and run the karaoke reveal
  useEffect(() => {
    if (scores.length === 0 || pictograms.length === 0) return;
    if (hasRevealedRef.current) return;
    hasRevealedRef.current = true;

    const states: WordState[] = pictograms.map((picto, i) => {
      const scoreEntry = scores[i] ?? {
        word: picto.label,
        accuracy_score: 0,
        is_omitted: true,
      };
      return {
        id: picto.id,
        label: picto.label,
        imageUrl: picto.imageUrl,
        status: "pending" as WordStatus,
        score: scoreEntry.accuracy_score,
        isOmitted: scoreEntry.is_omitted,
      };
    });

    setWordStates(states);

    // Run the karaoke-style reveal sequence
    let cancelled = false;

    (async () => {
      await wait(400); // initial pause

      for (let i = 0; i < states.length; i++) {
        if (cancelled) return;

        // Step 1: Highlight current word as "active"
        setActiveIndex(i);
        setWordStates((prev) =>
          prev.map((w, idx) =>
            idx === i ? { ...w, status: "active" } : w
          )
        );

        // Step 2: Speak the word slowly with emphasis
        await speakWord(states[i].label);
        await wait(300);

        if (cancelled) return;

        // Step 3: Reveal the score (green or red)
        const passed = !states[i].isOmitted && states[i].score >= PASS_THRESHOLD;
        setWordStates((prev) =>
          prev.map((w, idx) =>
            idx === i ? { ...w, status: passed ? "correct" : "incorrect" } : w
          )
        );

        // Step 4: Play chime or buzz
        if (passed) {
          playSuccessChime();
        } else {
          playFailSound();
        }

        // Pause between words
        await wait(800);
      }

      setActiveIndex(-1);
      onComplete?.();
    })();

    return () => {
      cancelled = true;
    };
  }, [scores, pictograms, onComplete]);

  // Tap a red tile to replay that word
  const handleTileClick = useCallback(
    (index: number) => {
      const entry = wordStates[index];
      if (entry?.status === "incorrect") {
        speakWord(entry.label);
      }
    },
    [wordStates]
  );

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Sentence with words highlighted left to right */}
      <div className="flex flex-wrap justify-center gap-2 px-2">
        {wordStates.map((entry, i) => (
          <span
            key={entry.id}
            className={`inline-block rounded-lg px-3 py-1.5 text-lg font-extrabold transition-all duration-300 ${
              entry.status === "active"
                ? "scale-110 bg-[#1D9E75]/20 text-[#1D9E75]"
                : entry.status === "correct"
                ? "bg-green-100 text-green-700"
                : entry.status === "incorrect"
                ? "bg-red-100 text-red-600"
                : "text-gray-300"
            }`}
            style={{
              animation:
                entry.status === "active"
                  ? "word-glow 0.8s ease-in-out infinite alternate"
                  : entry.status === "correct"
                  ? "pop 0.35s ease-out"
                  : entry.status === "incorrect"
                  ? "shake 0.4s ease-out"
                  : "none",
            }}
          >
            {entry.label}
          </span>
        ))}
      </div>

      {/* Pictogram tiles */}
      <div className="flex flex-wrap justify-center gap-3">
        {wordStates.map((entry, i) => (
          <button
            key={entry.id}
            onClick={() => handleTileClick(i)}
            className={`relative flex h-20 w-20 cursor-pointer items-center justify-center overflow-hidden rounded-2xl border-[2.5px] transition-all duration-300 ${
              entry.status === "active"
                ? "scale-105 border-[#1D9E75] shadow-[0_0_18px_rgba(29,158,117,0.5)]"
                : entry.status === "correct"
                ? "border-green-500 shadow-[0_0_14px_rgba(34,197,94,0.45)]"
                : entry.status === "incorrect"
                ? "border-red-500 shadow-[0_0_14px_rgba(239,68,68,0.45)]"
                : "border-[#d3d1c7] bg-white opacity-40"
            }`}
            style={{
              animation:
                entry.status === "active"
                  ? "word-glow 0.8s ease-in-out infinite alternate"
                  : entry.status === "correct"
                  ? "pop 0.35s ease-out"
                  : entry.status === "incorrect"
                  ? "shake 0.4s ease-out"
                  : "none",
            }}
            aria-label={entry.label}
          >
            {/* Pictogram image */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={entry.imageUrl}
              alt=""
              className="pointer-events-none z-10 h-[52px] w-[52px] object-contain"
            />

            {/* Score ring (circular progress) */}
            {(entry.status === "correct" || entry.status === "incorrect") && (
              <svg
                className="pointer-events-none absolute inset-[2px] z-20 h-[calc(100%-4px)] w-[calc(100%-4px)]"
                viewBox="0 0 36 36"
              >
                <circle
                  cx="18" cy="18" r="15.5"
                  strokeWidth="3" fill="none"
                  className="stroke-gray-200"
                />
                <circle
                  cx="18" cy="18" r="15.5"
                  strokeWidth="3" fill="none"
                  className={`transition-all duration-600 ${
                    entry.status === "correct" ? "stroke-green-500" : "stroke-red-500"
                  }`}
                  strokeDasharray={`${entry.score} ${100 - entry.score}`}
                  strokeDashoffset="25"
                  strokeLinecap="round"
                />
              </svg>
            )}

            {/* Pulse overlay */}
            {entry.status === "active" && (
              <span className="pointer-events-none absolute inset-0 z-0 animate-pulse rounded-[14px] bg-[#1D9E75]/15" />
            )}
            {entry.status === "correct" && (
              <span className="pointer-events-none absolute inset-0 z-0 animate-pulse rounded-[14px] bg-green-500/15" />
            )}
            {entry.status === "incorrect" && (
              <>
                <span className="pointer-events-none absolute inset-0 z-0 animate-pulse rounded-[14px] bg-red-500/15" />
                {/* Retry icon */}
                <svg
                  className="absolute bottom-1 right-1 z-30 h-[18px] w-[18px] rounded-full bg-red-500/85 p-0.5"
                  viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"
                >
                  <polyline points="1 4 1 10 7 10" />
                  <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
                </svg>
              </>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}

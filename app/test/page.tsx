"use client";

/**
 * Test page – hardcoded sentence to try TTS pacing + speech evaluation.
 * Visit http://localhost:3000/test
 */

import React, { useState, useCallback } from "react";
import { useSpeechPacing } from "@/hooks/useSpeechPacing";
import AudioRecorder from "@/components/AudioRecorder";
import PronunciationFeedback from "@/components/PronunciationFeedback";

// ── Hardcoded test data ─────────────────────────────────────────────────────

const TEST_SENTENCE = "I need water";

const TEST_PICTOGRAMS = [
  {
    id: "test-i",
    label: "I",
    imageUrl: "https://static.arasaac.org/pictograms/6632/6632_2500.png",
  },
  {
    id: "test-need",
    label: "need",
    imageUrl: "https://static.arasaac.org/pictograms/37160/37160_2500.png",
  },
  {
    id: "test-water",
    label: "water",
    imageUrl: "https://static.arasaac.org/pictograms/32464/32464_2500.png",
  },
];

// ── Types ───────────────────────────────────────────────────────────────────

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

// ── Component ───────────────────────────────────────────────────────────────

export default function TestPage() {
  const { speakWithPacing, speakWord } = useSpeechPacing();
  const [evalResult, setEvalResult] = useState<EvaluationResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [phase, setPhase] = useState<"listen" | "record" | "results">("listen");

  const handlePlayTTS = useCallback(() => {
    setError(null);
    speakWithPacing(TEST_SENTENCE);
  }, [speakWithPacing]);

  const handleResult = useCallback((result: EvaluationResult) => {
    setEvalResult(result);
    setPhase("results");
  }, []);

  const handleError = useCallback((err: string) => {
    setError(err);
  }, []);

  const handleReset = useCallback(() => {
    setEvalResult(null);
    setError(null);
    setPhase("listen");
  }, []);

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f0ede6] p-8">
      <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-lg">
        {/* Header */}
        <div className="mb-6 text-center">
          <div className="text-xs font-bold uppercase tracking-widest text-[#1D9E75]">
            FrameTalk Test
          </div>
          <div className="mt-2 text-2xl font-extrabold text-[#2C2C2A]">
            &ldquo;{TEST_SENTENCE}&rdquo;
          </div>
        </div>

        {/* Phase: Listen */}
        {phase === "listen" && (
          <div className="flex flex-col items-center gap-5">
            {/* Pictogram row */}
            <div className="flex gap-3">
              {TEST_PICTOGRAMS.map((p) => (
                <div
                  key={p.id}
                  className="flex h-20 w-20 items-center justify-center rounded-2xl border-2 border-[#d3d1c7] bg-[#F7F6F2]"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={p.imageUrl} alt="" className="h-14 w-14 object-contain" />
                </div>
              ))}
            </div>

            {/* Play TTS button */}
            <button
              onClick={handlePlayTTS}
              className="flex cursor-pointer items-center gap-2 rounded-xl bg-[#1D9E75] px-6 py-3 text-sm font-bold text-white transition-opacity hover:opacity-90"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
                <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
              </svg>
              Listen (normal → slow word-by-word)
            </button>

            {/* Move to record */}
            <button
              onClick={() => setPhase("record")}
              className="cursor-pointer text-sm font-semibold text-[#0F6E56] underline underline-offset-2 transition-opacity hover:opacity-70"
            >
              Ready? Tap to record →
            </button>
          </div>
        )}

        {/* Phase: Record */}
        {phase === "record" && (
          <div className="flex flex-col items-center gap-5">
            <div className="text-sm font-semibold text-[#888780]">
              Hold the mic and say: &ldquo;{TEST_SENTENCE}&rdquo;
            </div>

            <AudioRecorder
              targetSentence={TEST_SENTENCE}
              onResult={handleResult}
              onError={handleError}
            />

            <button
              onClick={() => setPhase("listen")}
              className="cursor-pointer text-xs font-semibold text-[#888780] underline underline-offset-2"
            >
              ← Back to listen
            </button>
          </div>
        )}

        {/* Phase: Results */}
        {phase === "results" && evalResult && (
          <div className="flex flex-col items-center gap-5">
            <div className="text-sm font-semibold text-[#888780]">
              Overall: {evalResult.overall_accuracy}%
            </div>

            <PronunciationFeedback
              pictograms={TEST_PICTOGRAMS}
              scores={evalResult.words}
            />

            {/* Score details */}
            <div className="w-full rounded-xl bg-[#F7F6F2] p-4">
              {evalResult.words.map((w, i) => (
                <div key={i} className="flex items-center justify-between border-b border-[#e5e5e5] py-2 last:border-b-0">
                  <span className="text-sm font-bold text-[#2C2C2A]">{w.word}</span>
                  <span className={`text-sm font-extrabold ${w.accuracy_score >= 70 ? "text-green-600" : "text-red-500"}`}>
                    {w.is_omitted ? "Omitted" : `${w.accuracy_score}%`}
                  </span>
                </div>
              ))}
            </div>

            <button
              onClick={handleReset}
              className="cursor-pointer rounded-xl bg-[#0F6E56] px-6 py-3 text-sm font-bold text-white transition-opacity hover:opacity-90"
            >
              Try again
            </button>
          </div>
        )}

        {/* Error display */}
        {error && (
          <div className="mt-4 rounded-lg bg-red-50 p-3 text-center text-xs font-semibold text-red-600">
            {error}
          </div>
        )}
      </div>
    </div>
  );
}

"use client";

/**
 * Test page – word-by-word pronunciation teaching for Rohingya learners.
 * Each word is spoken very slowly (3×) before the learner tries to say it.
 * Visit http://localhost:3000/test
 */

import React, { useState, useCallback, useEffect, useRef } from "react";
import AudioRecorder from "@/components/AudioRecorder";

// ── Data ─────────────────────────────────────────────────────────────────────

const TEST_WORDS = [
  {
    word: "I",
    // "I." (with period) stops the browser synthesizer from spelling it out
    ttsText: "I.",
    imageUrl: "https://static.arasaac.org/pictograms/6632/6632_2500.png",
  },
  {
    word: "need",
    ttsText: "need",
    imageUrl: "https://static.arasaac.org/pictograms/37160/37160_2500.png",
  },
  {
    word: "water",
    ttsText: "water",
    imageUrl: "https://static.arasaac.org/pictograms/32464/32464_2500.png",
  },
];

// ── Speech helpers ────────────────────────────────────────────────────────────

// Each repetition gets slower and more emphatic:
//   pass 0 → rate 0.4, pitch 1.2  (slow, clear, bright)
//   pass 1 → rate 0.2, pitch 1.1  (very slow, strong)
//   pass 2 → rate 0.1, pitch 1.0  (absolute minimum rate, full emphasis)
const SPEECH_PASSES = [
  { rate: 0.4, pitch: 1.2 },
  { rate: 0.2, pitch: 1.1 },
  { rate: 0.1, pitch: 1.0 },
];

function speakAt(text: string, rate: number, pitch: number): Promise<void> {
  return new Promise((resolve) => {
    if (typeof window === "undefined" || !window.speechSynthesis) {
      resolve();
      return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = rate;
    utterance.pitch = pitch;
    utterance.volume = 1;
    utterance.lang = "en-US";
    utterance.onend = () => resolve();
    utterance.onerror = () => resolve();
    window.speechSynthesis.speak(utterance);
  });
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// ── Types ─────────────────────────────────────────────────────────────────────

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

type Phase = "teaching" | "pronounce" | "result";

// ── Component ─────────────────────────────────────────────────────────────────

export default function TestPage() {
  const [wordIndex, setWordIndex] = useState(0);
  const [phase, setPhase] = useState<Phase>("teaching");
  const [wordResult, setWordResult] = useState<EvaluationWord | null>(null);
  const [allDone, setAllDone] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speakPass, setSpeakPass] = useState(0); // which repetition (0,1,2)
  const cancelledRef = useRef(false);

  const currentWord = TEST_WORDS[wordIndex];

  // Speak the word 3× slowly with pauses between
  const playWordSlowly = useCallback(async () => {
    if (isSpeaking) return;
    cancelledRef.current = false;
    setIsSpeaking(true);

    for (let i = 0; i < SPEECH_PASSES.length; i++) {
      if (cancelledRef.current) break;
      setSpeakPass(i);
      const { rate, pitch } = SPEECH_PASSES[i];
      await speakAt(currentWord.ttsText, rate, pitch);
      if (i < SPEECH_PASSES.length - 1 && !cancelledRef.current) {
        await delay(1800);
      }
    }

    setIsSpeaking(false);
  }, [currentWord.ttsText, isSpeaking]);

  // Auto-play when entering teaching phase
  useEffect(() => {
    if (phase !== "teaching") return;
    const run = async () => {
      cancelledRef.current = false;
      setIsSpeaking(true);
      await delay(400); // small pause before first utterance
      for (let i = 0; i < SPEECH_PASSES.length; i++) {
        if (cancelledRef.current) break;
        setSpeakPass(i);
        const { rate, pitch } = SPEECH_PASSES[i];
        await speakAt(currentWord.ttsText, rate, pitch);
        if (i < SPEECH_PASSES.length - 1 && !cancelledRef.current) {
          await delay(1800);
        }
      }
      setIsSpeaking(false);
    };
    run();
    return () => {
      cancelledRef.current = true;
      window.speechSynthesis?.cancel();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wordIndex, phase]);

  const handleResult = useCallback((result: EvaluationResult) => {
    setWordResult(result.words[0] ?? null);
    setError(null);
    setPhase("result");
  }, []);

  const handleNext = useCallback(() => {
    cancelledRef.current = true;
    window.speechSynthesis?.cancel();
    if (wordIndex < TEST_WORDS.length - 1) {
      setWordIndex((i) => i + 1);
      setWordResult(null);
      setError(null);
      setPhase("teaching");
    } else {
      setAllDone(true);
    }
  }, [wordIndex]);

  const handleRetry = useCallback(() => {
    setWordResult(null);
    setError(null);
    setPhase("teaching");
  }, []);

  const handleReset = useCallback(() => {
    cancelledRef.current = true;
    window.speechSynthesis?.cancel();
    setWordIndex(0);
    setWordResult(null);
    setError(null);
    setPhase("teaching");
    setAllDone(false);
  }, []);

  // ── All done screen ────────────────────────────────────────────────────────
  if (allDone) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-green-50 p-8">
        <div className="flex w-full max-w-sm flex-col items-center rounded-3xl bg-white p-10 shadow-lg text-center gap-6">
          <div className="text-7xl">🎉</div>
          <div className="text-3xl font-extrabold text-green-600">Great job!</div>
          <div className="text-lg font-semibold text-green-700">
            You said all the words!
          </div>
          <button
            onClick={handleReset}
            className="w-full rounded-2xl bg-green-500 py-4 text-lg font-bold text-white transition-opacity hover:opacity-90"
          >
            Start over
          </button>
        </div>
      </div>
    );
  }

  // ── Main screen ────────────────────────────────────────────────────────────
  return (
    <div className="flex min-h-screen items-center justify-center bg-green-50 p-8">
      <div className="flex w-full max-w-sm flex-col items-center rounded-3xl bg-white p-8 shadow-lg gap-6">

        {/* Progress dots */}
        <div className="flex gap-3">
          {TEST_WORDS.map((_, i) => (
            <div
              key={i}
              className={`rounded-full transition-all duration-300 ${
                i < wordIndex
                  ? "h-3 w-8 bg-green-500"
                  : i === wordIndex
                  ? "h-3 w-8 bg-green-400 ring-2 ring-green-300"
                  : "h-3 w-3 bg-green-100"
              }`}
            />
          ))}
        </div>

        {/* Pictogram */}
        <div className="flex h-40 w-40 items-center justify-center rounded-3xl border-4 border-green-200 bg-green-50">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={currentWord.imageUrl}
            alt={currentWord.word}
            className="h-28 w-28 object-contain"
          />
        </div>

        {/* Word — big green */}
        <div className="text-6xl font-extrabold tracking-wide text-green-600">
          {currentWord.word}
        </div>

        {/* ── Teaching phase ──────────────────────────────────────────────── */}
        {phase === "teaching" && (
          <div className="flex w-full flex-col items-center gap-4">
            {/* Speaking indicator */}
            <div
              className={`flex flex-col items-center gap-2 transition-opacity ${
                isSpeaking ? "opacity-100" : "opacity-0"
              }`}
            >
              <div className="flex items-center gap-2 text-base font-semibold text-green-700">
                <span className="animate-pulse text-xl">🔊</span>
                <span>
                  {speakPass === 0 ? "Listen…" : speakPass === 1 ? "Slower…" : "Very slow…"}
                </span>
              </div>
              {/* Pass dots */}
              <div className="flex gap-2">
                {SPEECH_PASSES.map((_, i) => (
                  <div
                    key={i}
                    className={`h-2 w-2 rounded-full transition-all ${
                      i <= speakPass ? "bg-green-500 scale-125" : "bg-green-200"
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Hear again */}
            <button
              onClick={playWordSlowly}
              disabled={isSpeaking}
              className="flex w-full items-center justify-center gap-3 rounded-2xl border-2 border-green-400 bg-white py-4 text-base font-bold text-green-600 transition-opacity hover:bg-green-50 disabled:opacity-40"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
                <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
              </svg>
              Hear it again
            </button>

            {/* Now you say it */}
            <button
              onClick={() => { cancelledRef.current = true; window.speechSynthesis?.cancel(); setIsSpeaking(false); setPhase("pronounce"); }}
              className="w-full rounded-2xl bg-green-500 py-4 text-lg font-bold text-white transition-opacity hover:opacity-90"
            >
              Now you say it →
            </button>
          </div>
        )}

        {/* ── Pronounce phase ─────────────────────────────────────────────── */}
        {phase === "pronounce" && (
          <div className="flex w-full flex-col items-center gap-4">
            <div className="text-base font-bold text-green-700">
              Say:{" "}
              <span className="text-green-500">&ldquo;{currentWord.word}&rdquo;</span>
            </div>

            <AudioRecorder
              targetSentence={currentWord.word}
              onResult={handleResult}
              onError={(e) => setError(e)}
            />

            <button
              onClick={() => setPhase("teaching")}
              className="text-sm font-semibold text-green-500 underline underline-offset-2"
            >
              ← Hear it again first
            </button>
          </div>
        )}

        {/* ── Result phase ────────────────────────────────────────────────── */}
        {phase === "result" && wordResult && (
          <div className="flex w-full flex-col items-center gap-4">
            {wordResult.accuracy_score >= 70 ? (
              <>
                <div className="text-5xl">✅</div>
                <div className="text-2xl font-extrabold text-green-600">Well done!</div>
                <div className="text-base font-semibold text-green-500">
                  {wordResult.accuracy_score}% correct
                </div>
                <button
                  onClick={handleNext}
                  className="w-full rounded-2xl bg-green-500 py-4 text-lg font-bold text-white transition-opacity hover:opacity-90"
                >
                  {wordIndex < TEST_WORDS.length - 1 ? "Next word →" : "Finish!"}
                </button>
              </>
            ) : (
              <>
                <div className="text-5xl">🔄</div>
                <div className="text-2xl font-extrabold text-green-700">Try again!</div>
                <div className="text-base font-semibold text-green-500">
                  {wordResult.is_omitted ? "Not heard" : `${wordResult.accuracy_score}% correct`}
                </div>
                <button
                  onClick={handleRetry}
                  className="w-full rounded-2xl bg-green-500 py-4 text-lg font-bold text-white transition-opacity hover:opacity-90"
                >
                  Try again
                </button>
                <button
                  onClick={handleNext}
                  className="text-sm font-semibold text-green-400 underline underline-offset-2"
                >
                  Skip →
                </button>
              </>
            )}
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="w-full rounded-xl bg-orange-50 p-4 text-center">
            {error.includes("AZURE_SPEECH_KEY") ? (
              <>
                <div className="text-sm font-bold text-orange-700 mb-1">
                  Speech check not set up yet
                </div>
                <div className="text-xs text-orange-600 mb-3">
                  Azure credentials are missing. You can still practice!
                </div>
                <button
                  onClick={handleNext}
                  className="rounded-xl bg-green-500 px-6 py-2 text-sm font-bold text-white"
                >
                  {wordIndex < TEST_WORDS.length - 1 ? "Next word →" : "Finish!"}
                </button>
              </>
            ) : (
              <div className="text-sm font-semibold text-red-500">{error}</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

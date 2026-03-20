"use client";

import React, { useState, useCallback, useEffect, useRef } from "react";
import DesktopLayout from "@/components/DesktopLayout";
import { pictogramTree, PictogramNode } from "@/lib/pictogramTree";
import { useArasaacImage } from "@/lib/useArasaacImage";
import { useSpeech } from "@/hooks/useSpeech";
import AudioRecorder from "@/components/AudioRecorder";
import {
  resolveArasaacImages,
  WordPictogram,
} from "@/lib/resolveArasaacImages";
import { Mic2, Speech, ArrowRight, RotateCcw, ArrowRightToLine, Check, X, Home, ArrowLeft } from "lucide-react";
import { WavRecorder } from "@/lib/wavRecorder";

function IconCheck() {
  return (
    <svg className="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function IconSpeaker() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
      <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
      <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
    </svg>
  );
}

function IconRefresh() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <polyline points="23 4 23 10 17 10" />
      <polyline points="1 20 1 14 7 14" />
      <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
    </svg>
  );
}

function IconBack() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <line x1="19" y1="12" x2="5" y2="12" />
      <polyline points="12 19 5 12 12 5" />
    </svg>
  );
}

function IconHome() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  );
}

// ─── Pictogram tile image ─────────────────────────────────────────────────────

function IconPlay() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" stroke="none">
      <path d="M8 5v14l11-7-11-7z" />
    </svg>
  );
}

function IconGrid() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
    </svg>
  );
}

function IconMic() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
      <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
      <line x1="12" y1="19" x2="12" y2="23" />
      <line x1="8" y1="23" x2="16" y2="23" />
    </svg>
  );
}

function PictogramImage({
  keyword,
  preferredId,
  size = 56,
}: {
  keyword: string;
  preferredId?: number;
  size?: number;
}) {
  const { url, loading } = useArasaacImage(keyword, { preferredId });

  if (loading) {
    return (
      <div
        className="animate-pulse rounded-xl bg-[linear-gradient(130deg,#e2f2c7,#d8efe1)]"
        style={{ width: size, height: size }}
      />
    );
  }

  if (!url) {
    return (
      <div
        className="flex items-center justify-center rounded-xl bg-[linear-gradient(130deg,#e2f2c7,#d8efe1)] text-[10px] text-(--green-700)"
        style={{ width: size, height: size }}
      >
        ?
      </div>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={url}
      alt={keyword}
      style={{ width: size, height: size }}
      className="object-contain"
    />
  );
}

// ─── Tile grid ────────────────────────────────────────────────────────────────

function PictogramTile({
  node,
  index,
  onTap,
}: {
  node: PictogramNode;
  index: number;
  onTap: (node: PictogramNode) => void;
}) {
  return (
    <button
      onClick={() => onTap(node)}
      className="pictogram-card animate-card-in flex cursor-pointer flex-col items-center justify-center rounded-[22px] border border-(--line-soft) bg-[linear-gradient(155deg,#ffffff,#f8fff4)] p-3"
      style={{ minHeight: 140, animationDelay: `${index * 40}ms` }}
      aria-label={node.label}
    >
      <div className="relative flex h-21 w-full items-center justify-center rounded-[18px] bg-[radial-gradient(circle_at_30%_20%,#e4f4ce,#d8efe1)]">
        <PictogramImage keyword={node.arasaacKeyword} preferredId={node.arasaacId} size={64} />
      </div>
      <div className="mt-2 text-center text-[12px] font-semibold text-(--green-800)">{node.label}</div>
      {node.label_2 && (
        <div className="mt-0.5 text-center text-[10px] font-medium text-(--green-700)/60">{node.label_2}</div>
      )}
    </button>
  );
}

function TileGrid({
  nodes,
  onTap,
}: {
  nodes: PictogramNode[];
  onTap: (node: PictogramNode) => void;
}) {
  return (
    <div className="grid grid-cols-2 gap-3 p-4">
      {nodes.map((node, index) => (
        <PictogramTile key={node.id} node={node} index={index} onTap={onTap} />
      ))}
    </div>
  );
}

// ─── Trail chips ──────────────────────────────────────────────────────────────

function TrailChips({
  trail,
  size = "default",
}: {
  trail: PictogramNode[];
  size?: "default" | "large";
}) {
  const imgSize = size === "large" ? 80 : 60;
  const cardWidth = imgSize + 16;

  return (
    <div className={`flex flex-wrap items-center justify-center ${size === "large" ? "gap-3 px-4" : "gap-2 px-2"}`}>
      {trail.map((node) => (
        <div
          key={node.id}
          className="flex flex-col items-center overflow-hidden rounded-2xl border border-(--line-soft) bg-white shadow-[0_4px_10px_rgba(7,70,43,0.08)]"
          style={{ width: cardWidth }}
        >
          <div
            className="flex w-full items-center justify-center bg-[radial-gradient(circle_at_30%_20%,#e4f4ce,#d8efe1)] p-1.5"
          >
            <PictogramImage keyword={node.arasaacKeyword} preferredId={node.arasaacId} size={imgSize} />
          </div>
          <div className="w-full px-1 py-1 text-center text-[10px] font-semibold leading-tight text-(--green-800)">
            {node.label_2 ?? node.label}
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Speech evaluation types ──────────────────────────────────────────────────

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

// ─── Speech helpers ───────────────────────────────────────────────────────────

// Each repetition gets slower and more emphatic
const SPEECH_PASSES = [
  { rate: 0.4, pitch: 1.2 },
  { rate: 0.2, pitch: 1.1 },
  { rate: 0.1, pitch: 1.0 },
];

function speakAt(text: string, rate: number, pitch: number): Promise<void> {
  return new Promise((resolve) => {
    if (typeof window === "undefined" || !window.speechSynthesis) { resolve(); return; }
    window.speechSynthesis.cancel();
    const utt = new SpeechSynthesisUtterance(text);
    utt.rate = rate; utt.pitch = pitch; utt.volume = 1; utt.lang = "en-US";
    utt.onend = () => resolve(); utt.onerror = () => resolve();
    window.speechSynthesis.speak(utt);
  });
}

function msDelay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// ─── Word-by-word speech practice ────────────────────────────────────────────

type WordPhase = "teaching" | "result";

function SpeechPractice({
  words,
  onBack,
  onGoHome,
}: {
  words: WordPictogram[];
  onBack: () => void;
  onGoHome: () => void;
}) {
  const [wordIndex, setWordIndex] = useState(0);
  const [phase, setWordPhase] = useState<WordPhase>("teaching");
  const [wordResult, setWordResult] = useState<EvaluationWord | null>(null);
  const [allDone, setAllDone] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speakPass, setSpeakPass] = useState(0);
  const cancelledRef = useRef(false);
  const [recordingState, setRecordingState] = useState<"idle" | "recording" | "processing">("idle");
  const wavRecorderRef = useRef<WavRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const currentWord = words[wordIndex];
  // Single-letter "I" gets a period so TTS doesn't spell it out
  const ttsText = currentWord.label === "I" ? "I." : currentWord.label;

  const playAtSpeed = useCallback(async (index: number) => {
    if (isSpeaking) return;
    cancelledRef.current = false;
    setSpeakPass(index);
    setIsSpeaking(true);
    const { rate, pitch } = SPEECH_PASSES[index];
    await speakAt(ttsText, rate, pitch);
    setIsSpeaking(false);
  }, [ttsText, isSpeaking]);

  // Auto-play once at rabbit speed when entering teaching phase
  useEffect(() => {
    if (phase !== "teaching") return;
    let isCancelled = false;
    cancelledRef.current = false;
    setSpeakPass(0);
    const run = async () => {
      setIsSpeaking(true);
      await msDelay(400);
      if (isCancelled || cancelledRef.current) { setIsSpeaking(false); return; }
      await speakAt(ttsText, SPEECH_PASSES[0].rate, SPEECH_PASSES[0].pitch);
      if (!isCancelled) setIsSpeaking(false);
    };
    run();
    return () => {
      isCancelled = true;
      cancelledRef.current = true;
      window.speechSynthesis?.cancel();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wordIndex, phase]);

  const handleResult = useCallback((result: EvaluationResult) => {
    setWordResult(result.words[0] ?? null);
    setError(null);
    setWordPhase("result");
  }, []);

  const handleNext = useCallback(() => {
    cancelledRef.current = true;
    window.speechSynthesis?.cancel();
    if (wordIndex < words.length - 1) {
      setWordIndex((i) => i + 1);
      setWordResult(null);
      setError(null);
      setWordPhase("teaching");
    } else {
      setAllDone(true);
    }
  }, [wordIndex, words.length]);

  const handleRetry = useCallback(() => {
    setWordResult(null);
    setError(null);
    setRecordingState("idle");
    setWordPhase("teaching");
  }, []);

  // ── Inline recording ─────────────────────────────────────────────────────

  const ensureMicAccess = useCallback(async () => {
    if (streamRef.current) return;
    try {
      streamRef.current = await navigator.mediaDevices.getUserMedia({
        audio: { echoCancellation: true, noiseSuppression: true },
      });
    } catch {
      setError("Microphone access denied.");
      throw new Error("Mic denied");
    }
  }, []);

  const sendForEvaluation = useCallback(async (blob: Blob, target: string) => {
    const formData = new FormData();
    formData.append("audio", blob, "recording.wav");
    formData.append("target_sentence", target);
    try {
      const res = await fetch("/api/evaluate", { method: "POST", body: formData });
      if (!res.ok) {
        const detail = await res.text();
        setError(`Evaluation failed: ${detail}`);
        setRecordingState("idle");
        return;
      }
      const data: EvaluationResult = await res.json();
      handleResult(data);
    } catch (err) {
      setError(`Network error: ${err instanceof Error ? err.message : "unknown"}`);
    } finally {
      setRecordingState("idle");
    }
  }, [handleResult]);

  const startRecording = useCallback(async () => {
    cancelledRef.current = true;
    window.speechSynthesis?.cancel();
    setIsSpeaking(false);
    try { await ensureMicAccess(); } catch { return; }
    const recorder = new WavRecorder();
    await recorder.start(streamRef.current!);
    wavRecorderRef.current = recorder;
    setRecordingState("recording");
  }, [ensureMicAccess]);

  const stopRecording = useCallback(() => {
    if (!wavRecorderRef.current) return;
    setRecordingState("processing");
    const wavBlob = wavRecorderRef.current.stop();
    wavRecorderRef.current = null;
    sendForEvaluation(wavBlob, currentWord.label);
  }, [sendForEvaluation, currentWord.label]);

  const handleRecordPointerDown = useCallback((e: React.PointerEvent) => {
    e.preventDefault();
    if (recordingState === "idle") startRecording();
  }, [recordingState, startRecording]);

  const handleRecordPointerUp = useCallback((e: React.PointerEvent) => {
    e.preventDefault();
    if (recordingState === "recording") stopRecording();
  }, [recordingState, stopRecording]);

  // ── All done ─────────────────────────────────────────────────────────────

  if (allDone) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-6 bg-[linear-gradient(170deg,#edf8dc_0%,#f9fff4_45%,#ffffff_100%)] p-6">
        <div className="text-8xl">🎉</div>
        <button
          onClick={onGoHome}
          aria-label="Go back to home"
          title="Go back to home"
          className="flex h-24 w-24 items-center justify-center rounded-full border-2 border-(--gold-500) bg-[linear-gradient(145deg,#1a9a68,#14714f)] shadow-[0_12px_32px_rgba(7,70,43,0.3)] transition-all hover:-translate-y-1 hover:shadow-[0_16px_36px_rgba(7,70,43,0.35)]"
        >
          <Home size={48} color="white" strokeWidth={2} />
        </button>
        <button
          onClick={onBack}
          className="w-fit max-w-xs rounded-[14px] border border-(--gold-500) bg-[linear-gradient(145deg,#1a9a68,#14714f)] px-4 py-3 text-[13px] font-semibold text-white shadow-[0_10px_20px_rgba(7,70,43,0.2)] transition-all hover:-translate-y-0.5"
        >
          <ArrowLeft size={24} color="white" strokeWidth={2} />
        </button>
      </div>
    );
  }

  // ── Main practice screen ──────────────────────────────────────────────────

  return (
    <div className="flex h-full flex-col bg-[linear-gradient(170deg,#edf8dc_0%,#f9fff4_45%,#ffffff_100%)]">
      <div className="ml-4 mt-4 flex items-center gap-2">
        <button
          onClick={onBack}
          title="Back to sentence"
          aria-label="Back to sentence"
          className="flex h-9 w-9 items-center justify-center rounded-full border border-(--line-soft) bg-white text-(--green-700) transition-all hover:-translate-y-0.5 hover:border-(--gold-500)"
        >
          <IconBack />
        </button>
        <button
          onClick={onGoHome}
          title="Back to home"
          aria-label="Back to home"
          className="flex h-9 w-9 items-center justify-center rounded-full border border-(--line-soft) bg-white text-(--green-700) transition-all hover:-translate-y-0.5 hover:border-(--gold-500)"
        >
          <IconHome />
        </button>
      </div>
      {/* Progress dots */}
      <div className="flex justify-center gap-2 px-4 pt-3">
        {words.map((_, i) => (
          <div
            key={i}
            className={`rounded-full transition-all duration-300 ${i < wordIndex
              ? "h-3 w-8 bg-[#1a9a68]"
              : i === wordIndex
                ? "h-3 w-8 bg-[#1a9a68]/60 ring-2 ring-[#1a9a68]/30"
                : "h-3 w-3 bg-[linear-gradient(130deg,#e2f2c7,#d8efe1)]"
              }`}
          />
        ))}
      </div>

      <div className="flex flex-1 flex-col items-center justify-center gap-5 p-6">
        {/* Pictogram */}
        <div className="flex h-44 w-44 items-center justify-center rounded-3xl border-2 border-(--line-soft) bg-[radial-gradient(circle_at_30%_20%,#e4f4ce,#d8efe1)]">
          {currentWord.imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={currentWord.imageUrl} alt={currentWord.label} className="h-36 w-36 object-contain" />
          ) : (
            <span className="text-5xl font-extrabold text-(--green-700)">{currentWord.label}</span>
          )}
        </div>

        {/* Word */}
        <div className="text-5xl font-extrabold tracking-wide text-(--green-700)">
          {currentWord.label}
        </div>

        {/* Teaching phase */}
        {phase === "teaching" && (
          <div className="flex w-full flex-col items-center gap-6">
            {/* Animal speed row – tap to choose speed */}
            <div className="flex items-center justify-center gap-6">
              {([
                { emoji: "🐇" },
                { emoji: "🐢" },
                { emoji: "🐌" },
              ] as const).map(({ emoji }, i) => (
                <button
                  key={i}
                  onClick={() => setSpeakPass(i)}
                  className={`rounded-2xl p-2 text-4xl transition-all duration-150 hover:scale-125 hover:opacity-100 active:scale-95 ${i === speakPass
                    ? "opacity-100 bg-[#1a9a68]/10 ring-2 ring-[#1a9a68]/30"
                    : "opacity-30"
                    }`}
                >
                  {emoji}
                </button>
              ))}
            </div>

            {/* Hear it again – replay at selected speed */}
            <button
              onClick={() => playAtSpeed(speakPass)}
              disabled={isSpeaking}
              aria-label="Hear it again"
              title="Hear it again"
              className="relative flex h-20 w-20 items-center justify-center rounded-full border-2 border-(--line-soft) bg-white shadow-[0_8px_24px_rgba(7,70,43,0.12)] transition-all hover:-translate-y-1 hover:border-(--gold-500) disabled:opacity-40"
            >
              <span className="text-4xl">🔊</span>
              <div className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full bg-[#1a9a68] text-white shadow-md">
                <IconRefresh />
              </div>
            </button>

            {/* Hold to record */}
            <button
              onPointerDown={handleRecordPointerDown}
              onPointerUp={handleRecordPointerUp}
              onPointerLeave={handleRecordPointerUp}
              aria-label="Hold to say it"
              title="Hold to say it"
              disabled={recordingState === "processing"}
              style={{ touchAction: "none" }}
              className={`relative flex h-28 w-28 items-center justify-center rounded-full border-2 transition-all ${recordingState === "recording"
                ? "scale-110 border-red-400 bg-[linear-gradient(145deg,#dc2626,#991b1b)] shadow-[0_12px_32px_rgba(220,38,38,0.4)]"
                : recordingState === "processing"
                  ? "cursor-wait border-amber-400 bg-[linear-gradient(145deg,#d97706,#92400e)] opacity-70 shadow-[0_12px_32px_rgba(217,119,6,0.4)]"
                  : "border-(--gold-500) bg-[linear-gradient(145deg,#1a9a68,#14714f)] shadow-[0_12px_32px_rgba(7,70,43,0.3)] hover:-translate-y-1 hover:shadow-[0_16px_36px_rgba(7,70,43,0.35)]"
                }`}
            >
              {recordingState === "recording" && (
                <span
                  className="pointer-events-none absolute -inset-[10px] rounded-full border-[3px] border-red-400"
                  style={{ animation: "pulse-ring 1s ease-out infinite" }}
                />
              )}
              {recordingState === "processing" && (
                <span className="pointer-events-none absolute -inset-[6px] animate-spin rounded-full border-[3px] border-transparent border-t-amber-400" />
              )}
              <Speech size={56} color="white" strokeWidth={1.5} />
            </button>
          </div>
        )}

        {/* Result phase */}
        {phase === "result" && wordResult && (
          <div className="flex w-full flex-col items-center gap-6">
            {wordResult.accuracy_score >= 70 ? (
              <>
                {/* Success card */}
                <div className="relative inline-flex items-center justify-center rounded-3xl border-2 border-[#d1fae5] bg-[linear-gradient(135deg,#ecfdf5,#ffffff)] p-6 shadow-[0_8px_24px_rgba(7,70,43,0.1)]">
                  <span className="text-7xl">😊</span>
                  <div className="absolute -bottom-3 -right-3 flex h-10 w-10 items-center justify-center rounded-full border-2 border-white bg-[#1a9a68] shadow-md">
                    <Check size={20} color="white" strokeWidth={3} />
                  </div>
                </div>
                <button
                  onClick={handleNext}
                  aria-label={wordIndex < words.length - 1 ? "Next word" : "Finish"}
                  title={wordIndex < words.length - 1 ? "Next word" : "Finish"}
                  className="flex h-24 w-24 items-center justify-center rounded-full border-2 border-(--gold-500) bg-[linear-gradient(145deg,#1a9a68,#14714f)] shadow-[0_12px_32px_rgba(7,70,43,0.3)] transition-all hover:-translate-y-1 hover:shadow-[0_16px_36px_rgba(7,70,43,0.35)]"
                >
                  <ArrowRight size={48} color="white" strokeWidth={2} />
                </button>
              </>
            ) : (
              <>
                {/* Failure card */}
                <div className="relative inline-flex items-center justify-center rounded-3xl border-2 border-[#fecaca] bg-[linear-gradient(135deg,#fef2f2,#ffffff)] p-6 shadow-[0_8px_24px_rgba(220,38,38,0.08)]">
                  <span className="text-7xl">😢</span>
                  <div className="absolute -bottom-3 -right-3 flex h-10 w-10 items-center justify-center rounded-full border-2 border-white bg-red-500 shadow-md">
                    <X size={20} color="white" strokeWidth={3} />
                  </div>
                </div>
                <div className="flex flex-col items-center gap-5">
                  <button
                    onClick={handleRetry}
                    aria-label="Try again"
                    title="Try again"
                    className="flex h-24 w-24 items-center justify-center rounded-full border-2 border-(--gold-500) bg-[linear-gradient(145deg,#1a9a68,#14714f)] shadow-[0_12px_32px_rgba(7,70,43,0.3)] transition-all hover:-translate-y-1 hover:shadow-[0_16px_36px_rgba(7,70,43,0.35)]"
                  >
                    <RotateCcw size={40} color="white" strokeWidth={2} />
                  </button>
                  <button
                    onClick={handleNext}
                    aria-label="Skip"
                    title="Skip"
                    className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-(--line-soft) bg-white text-(--green-700) shadow-[0_8px_24px_rgba(7,70,43,0.12)] transition-all hover:-translate-y-1 hover:border-(--gold-500)"
                  >
                    <ArrowRightToLine size={28} strokeWidth={2} />
                  </button>
                </div>
              </>
            )}
          </div>
        )}

        {/* Error display */}
        {error && (
          <div className="w-full max-w-xs rounded-xl bg-orange-50 p-4 text-center">
            {error.includes("AZURE_SPEECH_KEY") ? (
              <>
                <div className="mb-1 text-[12px] font-bold text-orange-700">Speech check not set up yet</div>
                <div className="mb-3 text-[11px] text-orange-600">Azure credentials are missing. You can still practice!</div>
                <button
                  onClick={handleNext}
                  className="rounded-xl bg-[#1a9a68] px-5 py-2 text-[12px] font-bold text-white"
                >
                  {wordIndex < words.length - 1 ? "Next word →" : "Finish!"}
                </button>
              </>
            ) : (
              <div className="text-[12px] font-semibold text-red-500">{error}</div>
            )}
          </div>
        )}
      </div>

    </div>
  );
}

// ─── Output screen ────────────────────────────────────────────────────────────

function OutputScreen({
  trail,
  onBack,
  onGoHome,
}: {
  trail: PictogramNode[];
  onBack: () => void;
  onGoHome: () => void;
}) {
  const [sentence, setSentence] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [showPractice, setShowPractice] = useState(false);
  const [wordPictograms, setWordPictograms] = useState<WordPictogram[]>([]);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [imageError, setImageError] = useState(false);
  const imageBlobUrlRef = useRef<string | null>(null);
  const isImageLoading = !!sentence && imageSrc === null && !imageError;

  const fetchSentence = useCallback(async () => {
    setLoading(true);
    setSentence(null);
    setImageSrc(null);
    setImageError(false);
    setShowPractice(false);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          trail: trail.map((n) => n.label),
          context: trail.map((n) => n.llmContext).filter(Boolean),
        }),
      });
      const data = await res.json();
      const text = data.sentence || "I need help.";
      setSentence(text);
      // Pre-resolve pictogram images for each sentence word
      const words = text.trim().split(/\s+/);
      resolveArasaacImages(words).then(setWordPictograms);
    } catch {
      const fallback = "I need help.";
      setSentence(fallback);
      resolveArasaacImages(["I", "need", "help"]).then(setWordPictograms);
    } finally {
      setLoading(false);
    }
  }, [trail]);

  const fetchedRef = useRef(false);

  useEffect(() => {
    if (fetchedRef.current) return;
    fetchedRef.current = true;
    fetchSentence();
  }, [fetchSentence]);

  const { speak } = useSpeech();

  // Auto-speak when sentence arrives
  useEffect(() => {
    if (sentence && !showPractice) {
      speak(sentence, { rate: 0.85, pitch: 1 });
    }
  }, [sentence, speak, showPractice]);

  // Fetch image when sentence changes
  useEffect(() => {
    if (!sentence) return;

    const controller = new AbortController();
    setImageSrc(null);
    setImageError(false);

    const prompt = `A single clean pictogram illustration showing: ${sentence}. Style: flat 2D vector art, thick outlines, solid colors, white background. No text, no letters, no words, no numbers anywhere in the image. One clear focal subject only, no background clutter.`;
    fetch(`/api/image?prompt=${encodeURIComponent(prompt)}`, { signal: controller.signal })
      .then((res) => {
        if (!res.ok || !res.headers.get("content-type")?.startsWith("image/")) {
          throw new Error("non-image response");
        }
        return res.blob();
      })
      .then((blob) => {
        if (imageBlobUrlRef.current) URL.revokeObjectURL(imageBlobUrlRef.current);
        const objectUrl = URL.createObjectURL(blob);
        imageBlobUrlRef.current = objectUrl;
        setImageSrc(objectUrl);
      })
      .catch((err) => {
        if (err.name === "AbortError") return;
        setImageError(true);
      });

    return () => {
      controller.abort();
      if (imageBlobUrlRef.current) {
        URL.revokeObjectURL(imageBlobUrlRef.current);
        imageBlobUrlRef.current = null;
      }
    };
  }, [sentence, trail]);

  if (showPractice && wordPictograms.length > 0) {
    return <SpeechPractice words={wordPictograms} onBack={() => setShowPractice(false)} onGoHome={onGoHome} />;
  }

  return (
    <div className="flex h-full flex-col bg-[linear-gradient(170deg,#edf8dc_0%,#f9fff4_45%,#ffffff_100%)]">
      <div className="ml-4 mt-4 flex items-center gap-2">
        <button
          onClick={onBack}
          title="Back to grid"
          aria-label="Back to grid"
          className="flex h-9 w-9 items-center justify-center rounded-full border border-(--line-soft) bg-white text-(--green-700) transition-all hover:-translate-y-0.5 hover:border-(--gold-500)"
        >
          <IconBack />
        </button>
        <button
          onClick={onGoHome}
          title="Back to home"
          aria-label="Back to home"
          className="flex h-9 w-9 items-center justify-center rounded-full border border-(--line-soft) bg-white text-(--green-700) transition-all hover:-translate-y-0.5 hover:border-(--gold-500)"
        >
          <IconHome />
        </button>
      </div>
      <div className="flex flex-1 flex-col items-center justify-center gap-5 p-6">
        {loading ? (
          <div className="flex flex-col items-center gap-3">
            <div className="h-6 w-48 animate-pulse rounded-lg bg-[linear-gradient(130deg,#e2f2c7,#d8efe1)]" />
            <div className="h-6 w-32 animate-pulse rounded-lg bg-[linear-gradient(130deg,#e2f2c7,#d8efe1)]" />
          </div>
        ) : (
          <div className="animate-rise-in relative rounded-[28px] border border-(--line-soft) bg-white/90 px-5 pb-10 pt-4 text-center font-(--font-display) text-[20px] leading-snug text-(--green-800) shadow-[0_14px_28px_rgba(7,70,43,0.12)]">
            {sentence}
            {/* Speak + Regenerate icons pinned to bottom-right of the text box */}
            <div className="absolute bottom-2 right-2 flex items-center gap-1.5">
              <button
                onClick={() => sentence && speak(sentence, { rate: 0.85, pitch: 1 })}
                disabled={loading}
                className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border border-(--line-soft) bg-white text-(--green-700) shadow-[0_4px_10px_rgba(7,70,43,0.1)] transition-all hover:-translate-y-0.5 hover:border-(--gold-500) disabled:opacity-50"
                aria-label="Speak"
              >
                <IconSpeaker />
              </button>
              <button
                onClick={fetchSentence}
                disabled={loading}
                className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border border-(--line-soft) bg-white text-(--green-700) shadow-[0_4px_10px_rgba(7,70,43,0.1)] transition-all hover:-translate-y-0.5 hover:border-(--gold-500) disabled:opacity-50"
                aria-label="Refresh"
              >
                <IconRefresh />
              </button>
            </div>
          </div>
        )}

        {/* Contextual illustration */}
        {!loading && (isImageLoading || imageSrc || imageError) && (
          <div className="h-64 w-64 overflow-hidden rounded-[22px] border border-(--line-soft) bg-[linear-gradient(130deg,#e2f2c7,#d8efe1)] shadow-[0_8px_18px_rgba(7,70,43,0.09)]">
            {isImageLoading && (
              <div className="h-full w-full animate-pulse rounded-[22px] bg-[linear-gradient(130deg,#e2f2c7,#d8efe1)]" />
            )}
            {imageError && (
              <div className="flex h-full w-full items-center justify-center rounded-[22px]">
                <span className="text-[12px] font-semibold text-(--green-700)/60">Image unavailable</span>
              </div>
            )}
            {imageSrc && (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={imageSrc}
                alt={sentence ?? ""}
                className="block h-full w-full rounded-[22px] object-cover opacity-100 transition-opacity duration-500"
              />
            )}
          </div>
        )}

        {/* Practice speaking – circular, centred below sentence */}
        {!loading && <button
          onClick={() => setShowPractice(true)}
          disabled={loading || wordPictograms.length === 0}
          title="Practice speaking"
          aria-label="Practice speaking"
          className="flex h-20 w-20 items-center justify-center rounded-full border-2 border-(--gold-500) bg-[linear-gradient(145deg,#1a9a68,#14714f)] shadow-[0_12px_32px_rgba(7,70,43,0.3)] transition-all hover:-translate-y-1 hover:shadow-[0_16px_36px_rgba(7,70,43,0.35)] disabled:border-slate-300 disabled:bg-slate-200 disabled:shadow-none"
        >
          <Speech size={36} color="white" strokeWidth={1.5} />
        </button>}
      </div>

      <div className="mt-auto p-3">
        <TrailChips trail={trail} />
      </div>
    </div>
  );
}

export default function PictogramPage() {
  const [trail, setTrail] = useState<PictogramNode[]>([]);
  const [showOutput, setShowOutput] = useState(false);
  const { speak } = useSpeech();

  const currentNodes = (() => {
    if (trail.length === 0) return pictogramTree;
    const lastNode = trail[trail.length - 1];
    return lastNode.children ?? [];
  })();

  const handleTileTap = (node: PictogramNode) => {
    speak(node.label, { rate: 0.9, pitch: 1 });
    const newTrail = [...trail, node];
    setTrail(newTrail);

    // Auto-navigate when there are no more options to choose from
    const newIsLeaf = !node.children || node.children.length === 0;
    if (newIsLeaf) {
      setShowOutput(true);
    }
  };

  const handleGoBack = () => {
    if (trail.length > 0) {
      setTrail(trail.slice(0, -1));
    }
  };

  const isLeaf = trail.length > 0 && !trail[trail.length - 1].children;
  const canGenerate = isLeaf || trail.length >= 3;

  if (showOutput) {
    return (
      <DesktopLayout>
        <OutputScreen
          trail={trail}
          onBack={() => setShowOutput(false)}
          onGoHome={() => { setTrail([]); setShowOutput(false); }}
        />
      </DesktopLayout>
    );
  }

  return (
    <DesktopLayout>
      <div className="relative flex h-full flex-col bg-[linear-gradient(170deg,#edf8dc_0%,#f9fff4_42%,#ffffff_100%)]">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-20 bg-[linear-gradient(180deg,rgba(20,113,79,0.08),rgba(20,113,79,0))]" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-[linear-gradient(0deg,rgba(183,146,44,0.1),rgba(183,146,44,0))]" />

        {trail.length > 0 && (
          <div className="relative z-10 ml-4 mt-4 flex items-center gap-2">
            <button
              onClick={handleGoBack}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-(--line-soft) bg-white text-(--green-700) transition-all hover:-translate-y-0.5 hover:border-(--gold-500)"
              aria-label="Back"
            >
              <IconBack />
            </button>
            <button
              onClick={() => setTrail([])}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-(--line-soft) bg-white text-(--green-700) transition-all hover:-translate-y-0.5 hover:border-(--gold-500)"
              aria-label="Home"
            >
              <IconHome />
            </button>
          </div>
        )}

        <div className="relative z-10 flex-1 overflow-y-auto">
          <TileGrid nodes={currentNodes} onTap={handleTileTap} />
        </div>

        <div className="relative z-10 mt-auto border-t border-(--line-soft) bg-white/90 p-3 backdrop-blur-sm">
          {trail.length > 0 && !isLeaf ? <TrailChips trail={trail} /> : trail.length === 0 ? <div className="h-12" /> : null}
          <div className="flex justify-center">
            <button
              onClick={() => setShowOutput(true)}
              disabled={!canGenerate}
              title="Speak"
              aria-label="Speak"
              className="flex h-20 w-20 items-center justify-center rounded-full border-2 border-(--gold-500) bg-[linear-gradient(145deg,#1a9a68,#14714f)] shadow-[0_12px_32px_rgba(7,70,43,0.3)] transition-all hover:-translate-y-1 hover:shadow-[0_16px_36px_rgba(7,70,43,0.35)] disabled:border-slate-300 disabled:bg-slate-200 disabled:shadow-none"
            >
              <Speech size={36} color="white" strokeWidth={1.5} />
            </button>
          </div>
        </div>
      </div>
    </DesktopLayout>
  );
}
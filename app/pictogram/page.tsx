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

function IconChevronSmall() {
  return (
    <svg className="h-3 w-3 shrink-0 text-(--gold-200)" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
      <polyline points="9 18 15 12 9 6" />
    </svg>
  );
}

function IconCheck() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
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

// ─── Pictogram tile image ─────────────────────────────────────────────────────

function IconPlay() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" stroke="none">
      <path d="M8 5v14l11-7-11-7z" />
    </svg>
  );
}

function PictogramImage({ keyword, size = 56 }: { keyword: string; size?: number }) {
  const { url, loading } = useArasaacImage(keyword);

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

// ─── Breadcrumb ───────────────────────────────────────────────────────────────

function Breadcrumb({
  trail,
  onTap,
}: {
  trail: PictogramNode[];
  onTap: (index: number) => void;
}) {
  if (trail.length === 0) {
    return <div className="h-10" />;
  }

  return (
    <div className="no-scrollbar flex h-10 items-center gap-1 overflow-x-auto">
      {trail.map((node, i) => (
        <React.Fragment key={node.id}>
          {i > 0 && <IconChevronSmall />}
          <button
            onClick={() => onTap(i)}
            className="shrink-0 cursor-pointer rounded-full border border-(--line-soft) bg-white/90 px-1.5 py-0.5 transition-all hover:-translate-y-0.5 hover:border-(--gold-500)"
            aria-label={`Go to ${node.label}`}
          >
            <span className="flex items-center gap-1.5">
              <PictogramImage keyword={node.arasaacKeyword} size={30} />
              <span className="text-[10px] font-semibold text-(--green-800)">{node.label}</span>
            </span>
          </button>
        </React.Fragment>
      ))}
    </div>
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
      style={{ minHeight: 124, animationDelay: `${index * 40}ms` }}
      aria-label={node.label}
    >
      <div className="relative flex h-21 w-full items-center justify-center rounded-[18px] bg-[radial-gradient(circle_at_30%_20%,#e4f4ce,#d8efe1)]">
        <PictogramImage keyword={node.arasaacKeyword} size={64} />
      </div>
      <div className="mt-2 text-center text-[12px] font-semibold text-(--green-800)">{node.label}</div>
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

function TrailChips({ trail }: { trail: PictogramNode[] }) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-1.5 px-3">
      {trail.map((node) => (
        <div
          key={node.id}
          className="flex items-center gap-1 rounded-full border border-(--line-soft) bg-white px-2 py-1"
        >
          <PictogramImage keyword={node.arasaacKeyword} size={18} />
          <span className="text-[10px] font-semibold text-(--green-800)">{node.label}</span>
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

type WordPhase = "teaching" | "pronounce" | "result";

function SpeechPractice({
  words,
  onBack,
}: {
  words: WordPictogram[];
  onBack: () => void;
}) {
  const [wordIndex, setWordIndex] = useState(0);
  const [phase, setWordPhase] = useState<WordPhase>("teaching");
  const [wordResult, setWordResult] = useState<EvaluationWord | null>(null);
  const [allDone, setAllDone] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speakPass, setSpeakPass] = useState(0);
  const cancelledRef = useRef(false);

  const currentWord = words[wordIndex];
  // Single-letter "I" gets a period so TTS doesn't spell it out
  const ttsText = currentWord.label === "I" ? "I." : currentWord.label;

  const playWordSlowly = useCallback(async () => {
    if (isSpeaking) return;
    cancelledRef.current = false;
    setIsSpeaking(true);
    for (let i = 0; i < SPEECH_PASSES.length; i++) {
      if (cancelledRef.current) break;
      setSpeakPass(i);
      const { rate, pitch } = SPEECH_PASSES[i];
      await speakAt(ttsText, rate, pitch);
      if (i < SPEECH_PASSES.length - 1 && !cancelledRef.current) await msDelay(1800);
    }
    setIsSpeaking(false);
  }, [ttsText, isSpeaking]);

  // Auto-play when entering teaching phase
  useEffect(() => {
    if (phase !== "teaching") return;
    let isCancelled = false;
    cancelledRef.current = false;
    const run = async () => {
      setIsSpeaking(true);
      await msDelay(400);
      for (let i = 0; i < SPEECH_PASSES.length; i++) {
        if (isCancelled || cancelledRef.current) break;
        setSpeakPass(i);
        const { rate, pitch } = SPEECH_PASSES[i];
        await speakAt(ttsText, rate, pitch);
        if (i < SPEECH_PASSES.length - 1 && !isCancelled && !cancelledRef.current) {
          await msDelay(1800);
        }
      }
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
    setWordPhase("teaching");
  }, []);

  // ── All done ─────────────────────────────────────────────────────────────

  if (allDone) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-6 bg-[linear-gradient(170deg,#edf8dc_0%,#f9fff4_45%,#ffffff_100%)] p-6">
        <div className="text-6xl">🎉</div>
        <div className="text-2xl font-extrabold text-(--green-700)">Great job!</div>
        <div className="text-[13px] font-semibold text-(--green-600)">You said all the words!</div>
        <button
          onClick={onBack}
          className="w-full max-w-xs rounded-[14px] border border-(--gold-500) bg-[linear-gradient(145deg,#1a9a68,#14714f)] px-4 py-3 text-[13px] font-semibold text-white shadow-[0_10px_20px_rgba(7,70,43,0.2)] transition-all hover:-translate-y-0.5"
        >
          Back to sentence
        </button>
      </div>
    );
  }

  // ── Main practice screen ──────────────────────────────────────────────────

  return (
    <div className="flex h-full flex-col bg-[linear-gradient(170deg,#edf8dc_0%,#f9fff4_45%,#ffffff_100%)]">
      {/* Progress dots */}
      <div className="flex justify-center gap-2 px-4 pt-5">
        {words.map((_, i) => (
          <div
            key={i}
            className={`rounded-full transition-all duration-300 ${
              i < wordIndex
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
        <div className="flex h-36 w-36 items-center justify-center rounded-3xl border-2 border-(--line-soft) bg-[radial-gradient(circle_at_30%_20%,#e4f4ce,#d8efe1)]">
          {currentWord.imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={currentWord.imageUrl} alt={currentWord.label} className="h-24 w-24 object-contain" />
          ) : (
            <span className="text-4xl font-extrabold text-(--green-700)">{currentWord.label}</span>
          )}
        </div>

        {/* Word */}
        <div className="text-5xl font-extrabold tracking-wide text-(--green-700)">
          {currentWord.label}
        </div>

        {/* Teaching phase */}
        {phase === "teaching" && (
          <div className="flex w-full flex-col items-center gap-4">
            <div className={`flex flex-col items-center gap-2 transition-opacity ${isSpeaking ? "opacity-100" : "opacity-0"}`}>
              <div className="flex items-center gap-2 text-[13px] font-semibold text-(--green-700)">
                <span className="animate-pulse">🔊</span>
                <span>{speakPass === 0 ? "Listen…" : speakPass === 1 ? "Slower…" : "Very slow…"}</span>
              </div>
              <div className="flex gap-2">
                {SPEECH_PASSES.map((_, i) => (
                  <div
                    key={i}
                    className={`h-2 w-2 rounded-full transition-all ${i <= speakPass ? "scale-125 bg-[#1a9a68]" : "bg-[linear-gradient(130deg,#e2f2c7,#d8efe1)]"}`}
                  />
                ))}
              </div>
            </div>

            <button
              onClick={playWordSlowly}
              disabled={isSpeaking}
              className="flex w-full max-w-xs items-center justify-center gap-2 rounded-[14px] border border-(--line-soft) bg-white px-4 py-3 text-[12px] font-semibold text-(--green-700) transition-all hover:-translate-y-0.5 hover:border-(--gold-500) disabled:opacity-40"
            >
              <IconSpeaker />
              Hear it again
            </button>

            <button
              onClick={() => { cancelledRef.current = true; window.speechSynthesis?.cancel(); setIsSpeaking(false); setWordPhase("pronounce"); }}
              className="w-full max-w-xs rounded-[14px] border border-(--gold-500) bg-[linear-gradient(145deg,#1a9a68,#14714f)] px-4 py-3 text-[13px] font-semibold text-white shadow-[0_10px_20px_rgba(7,70,43,0.2)] transition-all hover:-translate-y-0.5"
            >
              Now you say it →
            </button>
          </div>
        )}

        {/* Pronounce phase */}
        {phase === "pronounce" && (
          <div className="flex w-full flex-col items-center gap-4">
            <div className="text-[13px] font-semibold text-(--green-600)">
              Say: <span className="font-extrabold">&ldquo;{currentWord.label}&rdquo;</span>
            </div>

            <AudioRecorder
              targetSentence={currentWord.label}
              onResult={handleResult}
              onError={(e) => setError(e)}
            />

            <button
              onClick={() => setWordPhase("teaching")}
              className="cursor-pointer text-[11px] font-semibold text-(--green-600)/70 underline underline-offset-2"
            >
              &larr; Hear it again first
            </button>
          </div>
        )}

        {/* Result phase */}
        {phase === "result" && wordResult && (
          <div className="flex w-full flex-col items-center gap-4">
            {wordResult.accuracy_score >= 70 ? (
              <>
                <div className="text-5xl">✅</div>
                <div className="text-xl font-extrabold text-(--green-700)">Well done!</div>
                <div className="text-[13px] font-semibold text-(--green-600)">{wordResult.accuracy_score}% correct</div>
                <button
                  onClick={handleNext}
                  className="w-full max-w-xs rounded-[14px] border border-(--gold-500) bg-[linear-gradient(145deg,#1a9a68,#14714f)] px-4 py-3 text-[13px] font-semibold text-white shadow-[0_10px_20px_rgba(7,70,43,0.2)] transition-all hover:-translate-y-0.5"
                >
                  {wordIndex < words.length - 1 ? "Next word →" : "Finish!"}
                </button>
              </>
            ) : (
              <>
                <div className="text-5xl">🔄</div>
                <div className="text-xl font-extrabold text-(--green-700)">Try again!</div>
                <div className="text-[13px] font-semibold text-(--green-600)">
                  {wordResult.is_omitted ? "Not heard" : `${wordResult.accuracy_score}% correct`}
                </div>
                <button
                  onClick={handleRetry}
                  className="w-full max-w-xs rounded-[14px] border border-(--gold-500) bg-[linear-gradient(145deg,#1a9a68,#14714f)] px-4 py-3 text-[13px] font-semibold text-white shadow-[0_10px_20px_rgba(7,70,43,0.2)] transition-all hover:-translate-y-0.5"
                >
                  Try again
                </button>
                <button
                  onClick={handleNext}
                  className="cursor-pointer text-[11px] font-semibold text-(--green-600)/70 underline underline-offset-2"
                >
                  Skip →
                </button>
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

      <div className="mt-auto p-3">
        <button
          onClick={onBack}
          className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-[14px] border border-(--line-soft) bg-white px-4 py-3 text-[12px] font-semibold text-(--green-800) transition-colors hover:bg-(--surface-soft)"
        >
          <IconBack />
          <span>Back to sentence</span>
        </button>
      </div>
    </div>
  );
}

// ─── Output screen ────────────────────────────────────────────────────────────

function OutputScreen({
  trail,
  onBack,
}: {
  trail: PictogramNode[];
  onBack: () => void;
}) {
  const [sentence, setSentence] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [showPractice, setShowPractice] = useState(false);
  const [wordPictograms, setWordPictograms] = useState<WordPictogram[]>([]);

  const fetchSentence = useCallback(async () => {
    setLoading(true);
    setSentence(null);
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

  if (showPractice && wordPictograms.length > 0) {
    return <SpeechPractice words={wordPictograms} onBack={() => setShowPractice(false)} />;
  }

  return (
    <div className="flex h-full flex-col bg-[linear-gradient(170deg,#edf8dc_0%,#f9fff4_45%,#ffffff_100%)]">
      <div className="px-4 pb-3 pt-4">
        <Breadcrumb trail={trail} onTap={() => {}} />
      </div>

      <div className="flex flex-1 flex-col items-center justify-center gap-5 p-6">
        {loading ? (
          <div className="flex flex-col items-center gap-3">
            <div className="h-6 w-48 animate-pulse rounded-lg bg-[linear-gradient(130deg,#e2f2c7,#d8efe1)]" />
            <div className="h-6 w-32 animate-pulse rounded-lg bg-[linear-gradient(130deg,#e2f2c7,#d8efe1)]" />
          </div>
        ) : (
          <div className="animate-rise-in rounded-[28px] border border-(--line-soft) bg-white/90 px-6 py-5 text-center font-(--font-display) text-[28px] leading-tight text-(--green-800) shadow-[0_14px_28px_rgba(7,70,43,0.12)]">
            {sentence}
          </div>
        )}

        <div className="flex items-center gap-3">
          <button
            onClick={() => sentence && speak(sentence, { rate: 0.85, pitch: 1 })}
            disabled={loading}
            className="flex h-12 w-12 cursor-pointer items-center justify-center rounded-full border border-(--line-soft) bg-white text-(--green-700) shadow-[0_8px_18px_rgba(7,70,43,0.1)] transition-all hover:-translate-y-0.5 hover:border-(--gold-500) disabled:opacity-50"
            aria-label="Speak"
          >
            <IconSpeaker />
          </button>
          <button
            onClick={fetchSentence}
            disabled={loading}
            className="flex h-12 w-12 cursor-pointer items-center justify-center rounded-full border border-(--line-soft) bg-white text-(--green-700) shadow-[0_8px_18px_rgba(7,70,43,0.1)] transition-all hover:-translate-y-0.5 hover:border-(--gold-500) disabled:opacity-50"
            aria-label="Refresh"
          >
            <IconRefresh />
          </button>
        </div>
      </div>

      <div className="mt-auto flex flex-col gap-2.5 p-3">
        <button
          onClick={onBack}
          className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-[14px] border border-(--line-soft) bg-white px-4 py-3 text-[12px] font-semibold text-(--green-800) transition-colors hover:bg-(--surface-soft)"
        >
          <IconBack />
          <span>Grid</span>
        </button>
        <button
          onClick={() => setShowPractice(true)}
          disabled={loading || wordPictograms.length === 0}
          className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-[14px] border border-(--gold-500) bg-[linear-gradient(145deg,#1a9a68,#14714f)] px-4 py-3 text-[13px] font-semibold text-white shadow-[0_10px_20px_rgba(7,70,43,0.2)] transition-all hover:-translate-y-0.5 disabled:opacity-50"
        >
          <IconPlay />
          <span>Practice Speaking</span>
        </button>
      </div>
    </div>
  );
}

export default function PictogramPage() {
  const [trail, setTrail] = useState<PictogramNode[]>([]);
  const [showOutput, setShowOutput] = useState(false);

  const currentNodes = (() => {
    if (trail.length === 0) return pictogramTree;
    const lastNode = trail[trail.length - 1];
    return lastNode.children ?? [];
  })();

  const handleTileTap = (node: PictogramNode) => {
    const newTrail = [...trail, node];
    setTrail(newTrail);
  };

  const handleBreadcrumbTap = (index: number) => {
    setTrail(trail.slice(0, index + 1));
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
        <OutputScreen trail={trail} onBack={() => setShowOutput(false)} />
      </DesktopLayout>
    );
  }

  return (
    <DesktopLayout>
      <div className="relative flex h-full flex-col bg-[linear-gradient(170deg,#edf8dc_0%,#f9fff4_42%,#ffffff_100%)]">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-20 bg-[linear-gradient(180deg,rgba(20,113,79,0.08),rgba(20,113,79,0))]" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-[linear-gradient(0deg,rgba(183,146,44,0.1),rgba(183,146,44,0))]" />

        <div className="relative z-10 px-4 pb-3 pt-4">
          <Breadcrumb trail={trail} onTap={handleBreadcrumbTap} />
        </div>

        {trail.length > 0 && (
          <button
            onClick={handleGoBack}
            className="relative z-10 ml-4 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-(--line-soft) bg-white text-(--green-700) transition-all hover:-translate-y-0.5 hover:border-(--gold-500)"
            aria-label="Back"
          >
            <IconBack />
          </button>
        )}

        {isLeaf ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-full border border-(--gold-500) bg-white text-(--green-700) shadow-[0_10px_20px_rgba(7,70,43,0.12)]">
              <IconCheck />
            </div>
            <TrailChips trail={trail} />
          </div>
        ) : (
          <div className="relative z-10 flex-1 overflow-y-auto">
            <TileGrid nodes={currentNodes} onTap={handleTileTap} />
          </div>
        )}

        {canGenerate && (
          <div className="relative z-10 mt-auto border-t border-(--line-soft) bg-white/90 p-3 backdrop-blur-sm">
            <TrailChips trail={trail} />
            <button
              onClick={() => setShowOutput(true)}
              className="mt-2.5 flex w-full cursor-pointer items-center justify-center gap-2 rounded-[14px] border border-(--gold-500) bg-[linear-gradient(145deg,#1a9a68,#14714f)] px-4 py-3 text-[13px] font-semibold text-white shadow-[0_10px_20px_rgba(7,70,43,0.2)] transition-all hover:-translate-y-0.5"
            >
              <IconPlay />
              <span>Speak</span>
            </button>
          </div>
        )}
      </div>
    </DesktopLayout>
  );
}
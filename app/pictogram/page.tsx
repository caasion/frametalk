"use client";

import React, { useState, useCallback, useEffect, useRef } from "react";
import DesktopLayout from "@/components/DesktopLayout";
import { pictogramTree, PictogramNode } from "@/lib/pictogramTree";
import { useArasaacImage } from "@/lib/useArasaacImage";
import { useSpeech } from "@/hooks/useSpeech";
import { useSpeechPacing } from "@/hooks/useSpeechPacing";
import AudioRecorder from "@/components/AudioRecorder";
import PronunciationFeedback from "@/components/PronunciationFeedback";
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

// ─── Types for speech evaluation ─────────────────────────────────────────────

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

function IconMic() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2">
      <rect x="9" y="2" width="6" height="12" rx="3" />
      <path d="M5 11a7 7 0 0 0 14 0" fill="none" />
      <line x1="12" y1="18" x2="12" y2="22" />
    </svg>
  );
}

// ─── Output screen ────────────────────────────────────────────────────────────

type OutputPhase = "output" | "listen" | "record" | "results";

function OutputScreen({
  trail,
  onBack,
}: {
  trail: PictogramNode[];
  onBack: () => void;
}) {
  const [sentence, setSentence] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [phase, setPhase] = useState<OutputPhase>("output");
  const [evalResult, setEvalResult] = useState<EvaluationResult | null>(null);
  const [evalError, setEvalError] = useState<string | null>(null);
  const [wordPictograms, setWordPictograms] = useState<WordPictogram[]>([]);

  const fetchSentence = useCallback(async () => {
    setLoading(true);
    setSentence(null);
    setPhase("output");
    setEvalResult(null);
    setEvalError(null);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          trail: trail.map((n) => n.label),
          context: trail
            .map((n) => n.llmContext)
            .filter(Boolean),
        }),
      });
      const data = await res.json();
      const text = data.sentence || "I need help.";
      setSentence(text);
      // Pre-resolve pictogram images for the sentence words
      const words = text.trim().split(/\s+/);
      resolveArasaacImages(words).then(setWordPictograms);
    } catch {
      const fallback = "I need help.";
      setSentence(fallback);
      resolveArasaacImages(fallback.replace(".", "").split(/\s+/)).then(setWordPictograms);
    } finally {
      setLoading(false);
    }
  }, [trail]);

  const fetchedRef = useRef(false);

  // Fetch on mount
  useEffect(() => {
    if (fetchedRef.current) return;
    fetchedRef.current = true;
    fetchSentence();
  }, [fetchSentence]);

  const { speak } = useSpeech();
  const { speakWithPacing } = useSpeechPacing();

  // Auto-speak when sentence arrives (only in output phase)
  useEffect(() => {
    if (sentence && phase === "output") {
      speak(sentence, { rate: 0.85, pitch: 1 });
    }
  }, [sentence, speak, phase]);

  const handleStartPractice = useCallback(() => {
    if (!sentence) return;
    setEvalResult(null);
    setEvalError(null);
    setPhase("listen");
    speakWithPacing(sentence);
  }, [sentence, speakWithPacing]);

  const handleEvalResult = useCallback((result: EvaluationResult) => {
    setEvalResult(result);
    setPhase("results");
  }, []);

  const handleEvalError = useCallback((err: string) => {
    setEvalError(err);
  }, []);

  const handleTryAgain = useCallback(() => {
    setEvalResult(null);
    setEvalError(null);
    setPhase("listen");
    if (sentence) speakWithPacing(sentence);
  }, [sentence, speakWithPacing]);

  // ── Phase: output (sentence display) ───────────────────────────────────

  if (phase === "output") {
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
            onClick={handleStartPractice}
            disabled={loading}
            className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-[14px] border border-(--gold-500) bg-[linear-gradient(145deg,#1a9a68,#14714f)] px-4 py-3 text-[13px] font-semibold text-white shadow-[0_10px_20px_rgba(7,70,43,0.2)] transition-all hover:-translate-y-0.5 disabled:opacity-50"
          >
            <IconMic />
            <span>Practice Speaking</span>
          </button>
        </div>
      </div>
    );
  }

  // ── Phase: listen (paced TTS playback) ─────────────────────────────────

  if (phase === "listen") {
    return (
      <div className="flex h-full flex-col bg-[linear-gradient(170deg,#edf8dc_0%,#f9fff4_45%,#ffffff_100%)]">
        <div className="px-4 pb-3 pt-4">
          <Breadcrumb trail={trail} onTap={() => {}} />
        </div>

        <div className="flex flex-1 flex-col items-center justify-center gap-6 p-6">
          <div className="text-[11px] font-bold uppercase tracking-widest text-(--green-600)">
            Listen carefully
          </div>
          <div className="rounded-[28px] border border-(--line-soft) bg-white/90 px-6 py-5 text-center font-(--font-display) text-[28px] leading-tight text-(--green-800) shadow-[0_14px_28px_rgba(7,70,43,0.12)]">
            {sentence}
          </div>

          <button
            onClick={() => sentence && speakWithPacing(sentence)}
            className="flex cursor-pointer items-center gap-2 rounded-xl border border-(--line-soft) bg-white px-5 py-3 text-[12px] font-semibold text-(--green-700) shadow-[0_8px_18px_rgba(7,70,43,0.1)] transition-all hover:-translate-y-0.5 hover:border-(--gold-500)"
          >
            <IconSpeaker />
            <span>Listen again</span>
          </button>

          <button
            onClick={() => setPhase("record")}
            className="cursor-pointer text-[13px] font-semibold text-(--green-700) underline underline-offset-2 transition-opacity hover:opacity-70"
          >
            Ready? Tap to record &rarr;
          </button>
        </div>

        <div className="mt-auto p-3">
          <button
            onClick={() => setPhase("output")}
            className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-[14px] border border-(--line-soft) bg-white px-4 py-3 text-[12px] font-semibold text-(--green-800) transition-colors hover:bg-(--surface-soft)"
          >
            <IconBack />
            <span>Back</span>
          </button>
        </div>
      </div>
    );
  }

  // ── Phase: record (microphone input) ───────────────────────────────────

  if (phase === "record") {
    return (
      <div className="flex h-full flex-col bg-[linear-gradient(170deg,#edf8dc_0%,#f9fff4_45%,#ffffff_100%)]">
        <div className="px-4 pb-3 pt-4">
          <Breadcrumb trail={trail} onTap={() => {}} />
        </div>

        <div className="flex flex-1 flex-col items-center justify-center gap-6 p-6">
          <div className="text-[11px] font-semibold text-(--green-600)/70">
            Hold the mic and say:
          </div>
          <div className="rounded-[28px] border border-(--line-soft) bg-white/90 px-6 py-4 text-center font-(--font-display) text-[22px] leading-tight text-(--green-800) shadow-[0_10px_20px_rgba(7,70,43,0.08)]">
            &ldquo;{sentence}&rdquo;
          </div>

          <AudioRecorder
            targetSentence={sentence!}
            onResult={handleEvalResult}
            onError={handleEvalError}
          />

          {evalError && (
            <div className="rounded-lg bg-red-50 px-4 py-2 text-center text-[11px] font-semibold text-red-600">
              {evalError}
            </div>
          )}

          <button
            onClick={() => setPhase("listen")}
            className="cursor-pointer text-[11px] font-semibold text-(--green-600)/70 underline underline-offset-2"
          >
            &larr; Back to listen
          </button>
        </div>
      </div>
    );
  }

  // ── Phase: results (pronunciation feedback) ────────────────────────────

  return (
    <div className="flex h-full flex-col bg-[linear-gradient(170deg,#edf8dc_0%,#f9fff4_45%,#ffffff_100%)]">
      <div className="px-4 pb-3 pt-4">
        <Breadcrumb trail={trail} onTap={() => {}} />
      </div>

      <div className="flex flex-1 flex-col items-center justify-center gap-5 overflow-y-auto p-6">
        {evalResult && (
          <>
            <div className="text-[11px] font-bold uppercase tracking-widest text-(--green-600)">
              Overall: {evalResult.overall_accuracy}%
            </div>

            <PronunciationFeedback
              pictograms={wordPictograms}
              scores={evalResult.words}
            />

            <div className="w-full max-w-xs rounded-xl border border-(--line-soft) bg-white/90 p-4">
              {evalResult.words.map((w, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between border-b border-(--line-soft) py-2 last:border-b-0"
                >
                  <span className="text-[12px] font-bold text-(--green-800)">{w.word}</span>
                  <span
                    className={`text-[12px] font-extrabold ${
                      w.accuracy_score >= 70 ? "text-green-600" : "text-red-500"
                    }`}
                  >
                    {w.is_omitted ? "Omitted" : `${w.accuracy_score}%`}
                  </span>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      <div className="mt-auto flex flex-col gap-2.5 p-3">
        <button
          onClick={handleTryAgain}
          className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-[14px] border border-(--gold-500) bg-[linear-gradient(145deg,#1a9a68,#14714f)] px-4 py-3 text-[13px] font-semibold text-white shadow-[0_10px_20px_rgba(7,70,43,0.2)] transition-all hover:-translate-y-0.5"
        >
          <IconRefresh />
          <span>Try Again</span>
        </button>
        <button
          onClick={onBack}
          className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-[14px] border border-(--line-soft) bg-white px-4 py-3 text-[12px] font-semibold text-(--green-800) transition-colors hover:bg-(--surface-soft)"
        >
          <IconBack />
          <span>Back to Grid</span>
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

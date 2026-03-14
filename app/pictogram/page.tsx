"use client";

import React, { useState, useCallback, useEffect } from "react";
import DesktopLayout from "@/components/DesktopLayout";
import { pictogramTree, PictogramNode } from "@/lib/pictogramTree";
import { useArasaacImage } from "@/lib/useArasaacImage";

// ─── Steps for this flow ──────────────────────────────────────────────────────

const PICTOGRAM_STEPS = [
  { num: 1, label: "Pick topic" },
  { num: 2, label: "Build sentence" },
  { num: 3, label: "Say it" },
];

// ─── Icons ────────────────────────────────────────────────────────────────────

function IconChevronSmall() {
  return (
    <svg className="h-3 w-3 shrink-0 text-white/50" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
      <polyline points="9 18 15 12 9 6" />
    </svg>
  );
}

function IconSpeechBubble() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
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

function PictogramImage({ keyword, size = 56 }: { keyword: string; size?: number }) {
  const { url, loading } = useArasaacImage(keyword);

  if (loading) {
    return (
      <div
        className="animate-pulse rounded-lg bg-[#E1F5EE]"
        style={{ width: size, height: size }}
      />
    );
  }

  if (!url) {
    return (
      <div
        className="flex items-center justify-center rounded-lg bg-[#E1F5EE] text-[10px] text-[#888780]"
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
    return <div className="text-[13px] text-white/70">Choose a topic</div>;
  }

  return (
    <div className="flex items-center gap-1 overflow-x-auto">
      {trail.map((node, i) => (
        <React.Fragment key={node.id}>
          {i > 0 && <IconChevronSmall />}
          <button
            onClick={() => onTap(i)}
            className="shrink-0 cursor-pointer rounded-md p-0.5 transition-colors hover:bg-white/10"
          >
            <PictogramImage keyword={node.arasaacKeyword} size={36} />
          </button>
        </React.Fragment>
      ))}
    </div>
  );
}

// ─── Tile grid ────────────────────────────────────────────────────────────────

function PictogramTile({
  node,
  onTap,
}: {
  node: PictogramNode;
  onTap: (node: PictogramNode) => void;
}) {
  return (
    <button
      onClick={() => onTap(node)}
      className="flex cursor-pointer flex-col items-center justify-center gap-1.5 rounded-[16px] border-2 border-transparent bg-white p-3 shadow-[0_1px_3px_rgba(0,0,0,0.06)] transition-all hover:border-[#1D9E75] hover:shadow-[0_2px_8px_rgba(29,158,117,0.15)]"
      style={{ minHeight: 100 }}
    >
      <PictogramImage keyword={node.arasaacKeyword} size={56} />
      <div className="text-[10px] font-bold uppercase tracking-[0.5px] text-[#2C2C2A]">
        {node.label}
      </div>
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
    <div className="grid grid-cols-2 gap-2.5 p-3">
      {nodes.map((node) => (
        <PictogramTile key={node.id} node={node} onTap={onTap} />
      ))}
    </div>
  );
}

// ─── Trail chips ──────────────────────────────────────────────────────────────

function TrailChips({ trail }: { trail: PictogramNode[] }) {
  return (
    <div className="flex flex-wrap items-center gap-1.5 px-3">
      {trail.map((node) => (
        <div
          key={node.id}
          className="flex items-center gap-1 rounded-full bg-[#E1F5EE] px-2 py-1"
        >
          <PictogramImage keyword={node.arasaacKeyword} size={18} />
          <span className="text-[10px] font-bold text-[#0F6E56]">{node.label}</span>
        </div>
      ))}
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

  const fetchSentence = useCallback(async () => {
    setLoading(true);
    setSentence(null);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ trail: trail.map((n) => n.label) }),
      });
      const data = await res.json();
      if (data.sentence) {
        setSentence(data.sentence);
      } else {
        setSentence("I need help.");
      }
    } catch {
      setSentence("I need help.");
    } finally {
      setLoading(false);
    }
  }, [trail]);

  // Fetch on mount
  useEffect(() => {
    fetchSentence();
  }, [fetchSentence]);

  // Auto-speak when sentence arrives
  useEffect(() => {
    if (sentence && typeof window !== "undefined" && window.speechSynthesis) {
      const utterance = new SpeechSynthesisUtterance(sentence);
      utterance.rate = 0.85;
      utterance.pitch = 1;
      window.speechSynthesis.speak(utterance);
    }
  }, [sentence]);

  const speak = () => {
    if (sentence && typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(sentence);
      utterance.rate = 0.85;
      utterance.pitch = 1;
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="bg-[#1D9E75] px-4 pb-3 pt-4">
        <div className="mb-[3px] text-[10px] font-bold uppercase tracking-[1.5px] text-white/70">
          FrameTalk
        </div>
        <Breadcrumb trail={trail} onTap={() => {}} />
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col items-center justify-center gap-5 p-6">
        {/* Sentence */}
        {loading ? (
          <div className="flex flex-col items-center gap-3">
            <div className="h-6 w-48 animate-pulse rounded-lg bg-[#E1F5EE]" />
            <div className="h-6 w-32 animate-pulse rounded-lg bg-[#E1F5EE]" />
          </div>
        ) : (
          <div className="text-center text-[24px] font-bold leading-[1.3] text-[#2C2C2A]">
            {sentence}
          </div>
        )}

        {/* Action buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={speak}
            disabled={loading}
            className="flex h-12 w-12 cursor-pointer items-center justify-center rounded-full bg-[#E1F5EE] text-[#0F6E56] transition-colors hover:bg-[#d0ede2] disabled:opacity-50"
          >
            <IconSpeaker />
          </button>
          <button
            onClick={fetchSentence}
            disabled={loading}
            className="flex h-12 w-12 cursor-pointer items-center justify-center rounded-full bg-[#E1F5EE] text-[#0F6E56] transition-colors hover:bg-[#d0ede2] disabled:opacity-50"
          >
            <IconRefresh />
          </button>
        </div>
      </div>

      {/* Bottom */}
      <div className="mt-auto flex flex-col gap-2.5 p-3">
        <button
          onClick={onBack}
          className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-[12px] border border-[#d3d1c7] bg-white px-4 py-2.5 text-[12px] font-bold text-[#2C2C2A] transition-colors hover:bg-[#F7F6F2]"
        >
          <IconBack />
          Back to pictograms
        </button>
        <button
          onClick={() => console.log("Practice speaking")}
          className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-[12px] bg-[#1D9E75] px-4 py-3 text-[13px] font-extrabold text-white transition-opacity hover:opacity-90"
        >
          Practice speaking &rarr;
        </button>
      </div>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function PictogramPage() {
  const [trail, setTrail] = useState<PictogramNode[]>([]);
  const [showOutput, setShowOutput] = useState(false);

  // Current nodes to display
  const currentNodes = (() => {
    if (trail.length === 0) return pictogramTree;
    const lastNode = trail[trail.length - 1];
    return lastNode.children ?? [];
  })();

  const handleTileTap = (node: PictogramNode) => {
    const newTrail = [...trail, node];
    setTrail(newTrail);
    // If leaf node (no children), trail is complete — user can generate
  };

  const handleBreadcrumbTap = (index: number) => {
    // Go back to that level — show children of the tapped node
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
      <DesktopLayout currentStep={2} steps={PICTOGRAM_STEPS}>
        <OutputScreen trail={trail} onBack={() => setShowOutput(false)} />
      </DesktopLayout>
    );
  }

  return (
    <DesktopLayout currentStep={1} steps={PICTOGRAM_STEPS}>
      <div className="flex min-h-[700px] flex-col">
        {/* Header */}
        <div className="bg-[#1D9E75] px-4 pb-3 pt-4">
          <div className="mb-[3px] text-[10px] font-bold uppercase tracking-[1.5px] text-white/70">
            FrameTalk
          </div>
          <Breadcrumb trail={trail} onTap={handleBreadcrumbTap} />
        </div>

        {/* Back button when navigated deeper */}
        {trail.length > 0 && (
          <button
            onClick={handleGoBack}
            className="flex cursor-pointer items-center gap-1.5 px-3 pt-2.5 pb-0 text-[11px] font-bold text-[#0F6E56] transition-colors hover:text-[#1D9E75]"
          >
            <IconBack />
            Back
          </button>
        )}

        {/* Grid */}
        {isLeaf ? (
          // Leaf reached — show confirmation
          <div className="flex flex-1 flex-col items-center justify-center gap-3 p-6">
            <div className="text-center text-[13px] font-bold text-[#0F6E56]">
              Selection complete
            </div>
            <TrailChips trail={trail} />
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto">
            <TileGrid nodes={currentNodes} onTap={handleTileTap} />
          </div>
        )}

        {/* Bottom generate bar */}
        {canGenerate && (
          <div className="mt-auto border-t border-[#E1F5EE] bg-white p-3">
            <TrailChips trail={trail} />
            <button
              onClick={() => setShowOutput(true)}
              className="mt-2.5 flex w-full cursor-pointer items-center justify-center gap-2 rounded-[12px] bg-[#1D9E75] px-4 py-3 text-[13px] font-extrabold text-white transition-opacity hover:opacity-90"
            >
              <IconSpeechBubble />
              Build my sentence
            </button>
          </div>
        )}
      </div>
    </DesktopLayout>
  );
}

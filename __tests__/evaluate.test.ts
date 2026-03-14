/**
 * Unit tests for the pronunciation evaluation word-comparison logic.
 *
 * These tests exercise the word-result-building algorithm directly,
 * without requiring Azure credentials.
 */

import { describe, it, expect } from "vitest";

// ---------------------------------------------------------------------------
// Extract the word-result-building logic so we can test it in isolation.
// This mirrors the algorithm in app/api/evaluate/route.ts
// ---------------------------------------------------------------------------

interface AzureWordEntry {
  word: string;
  accuracyScore: number;
  errorType: string;
}

interface WordResult {
  word: string;
  accuracy_score: number;
  is_omitted: boolean;
}

function buildWordResults(
  referenceText: string,
  azureWords: AzureWordEntry[]
): { words: WordResult[]; overall_accuracy: number } {
  const refWords = referenceText.match(/[a-zA-Z']+/g) ?? [];
  const wordResults: WordResult[] = [];
  let recognisedIdx = 0;

  for (const refWord of refWords) {
    if (recognisedIdx < azureWords.length) {
      const entry = azureWords[recognisedIdx];

      if (entry.errorType === "Omission") {
        wordResults.push({
          word: refWord,
          accuracy_score: 0,
          is_omitted: true,
        });
      } else {
        wordResults.push({
          word: entry.word,
          accuracy_score: Math.round(entry.accuracyScore * 10) / 10,
          is_omitted: false,
        });
      }
      recognisedIdx++;
    } else {
      wordResults.push({
        word: refWord,
        accuracy_score: 0,
        is_omitted: true,
      });
    }
  }

  const scored = wordResults
    .filter((w) => !w.is_omitted)
    .map((w) => w.accuracy_score);
  const overall_accuracy =
    scored.length > 0
      ? Math.round((scored.reduce((a, b) => a + b, 0) / scored.length) * 10) /
        10
      : 0;

  return { words: wordResults, overall_accuracy };
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe("buildWordResults", () => {
  it("marks all words correct with high scores", () => {
    const result = buildWordResults("I need water", [
      { word: "I", accuracyScore: 95, errorType: "None" },
      { word: "need", accuracyScore: 88, errorType: "None" },
      { word: "water", accuracyScore: 92, errorType: "None" },
    ]);

    expect(result.words).toEqual([
      { word: "I", accuracy_score: 95, is_omitted: false },
      { word: "need", accuracy_score: 88, is_omitted: false },
      { word: "water", accuracy_score: 92, is_omitted: false },
    ]);
    expect(result.overall_accuracy).toBeCloseTo(91.7, 1);
  });

  it("flags omitted words correctly", () => {
    const result = buildWordResults("I need water", [
      { word: "I", accuracyScore: 90, errorType: "None" },
      { word: "need", accuracyScore: 0, errorType: "Omission" },
      { word: "water", accuracyScore: 75, errorType: "None" },
    ]);

    expect(result.words[0].is_omitted).toBe(false);
    expect(result.words[1].is_omitted).toBe(true);
    expect(result.words[1].accuracy_score).toBe(0);
    expect(result.words[2].is_omitted).toBe(false);

    // Overall should only average non-omitted words: (90 + 75) / 2 = 82.5
    expect(result.overall_accuracy).toBeCloseTo(82.5, 1);
  });

  it("marks remaining words as omitted when Azure returns fewer words", () => {
    const result = buildWordResults("I need water now", [
      { word: "I", accuracyScore: 95, errorType: "None" },
      { word: "need", accuracyScore: 80, errorType: "None" },
    ]);

    expect(result.words).toHaveLength(4);
    expect(result.words[2]).toEqual({ word: "water", accuracy_score: 0, is_omitted: true });
    expect(result.words[3]).toEqual({ word: "now", accuracy_score: 0, is_omitted: true });
  });

  it("returns 0 overall accuracy when all words are omitted", () => {
    const result = buildWordResults("I need water", [
      { word: "I", accuracyScore: 0, errorType: "Omission" },
      { word: "need", accuracyScore: 0, errorType: "Omission" },
      { word: "water", accuracyScore: 0, errorType: "Omission" },
    ]);

    expect(result.words.every((w) => w.is_omitted)).toBe(true);
    expect(result.overall_accuracy).toBe(0);
  });

  it("handles empty reference text", () => {
    const result = buildWordResults("", []);
    expect(result.words).toEqual([]);
    expect(result.overall_accuracy).toBe(0);
  });

  it("handles empty Azure response (user was silent)", () => {
    const result = buildWordResults("I need water", []);
    expect(result.words).toHaveLength(3);
    expect(result.words.every((w) => w.is_omitted)).toBe(true);
    expect(result.overall_accuracy).toBe(0);
  });

  it("rounds accuracy scores to 1 decimal place", () => {
    const result = buildWordResults("Hello", [
      { word: "Hello", accuracyScore: 87.456, errorType: "None" },
    ]);

    expect(result.words[0].accuracy_score).toBe(87.5);
  });
});

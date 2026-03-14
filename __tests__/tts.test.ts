/**
 * Unit tests for the TTS API route – specifically the generateSsml() function.
 */

import { describe, it, expect } from "vitest";
import { generateSsml } from "../app/api/tts/route";

describe("generateSsml", () => {
  it("generates correct SSML for a multi-word sentence", () => {
    const ssml = generateSsml("I need water");

    // Should contain the full sentence spoken once
    expect(ssml).toContain("I need water");

    // Should have a 1-second break after the full sentence
    expect(ssml).toContain('<break time="1s"/>');

    // Should have x-slow prosody for the word-by-word section
    expect(ssml).toContain('<prosody rate="x-slow">');

    // Should have breaks between individual words
    expect(ssml).toContain('I <break time="1s"/> need <break time="1s"/> water');

    // Should be wrapped in <speak> tags
    expect(ssml).toMatch(/^<speak>/);
    expect(ssml).toMatch(/<\/speak>$/);
  });

  it("generates correct SSML for a single word", () => {
    const ssml = generateSsml("Help");

    expect(ssml).toContain("Help");
    expect(ssml).toContain('<break time="1s"/>');
    expect(ssml).toContain('<prosody rate="x-slow">');
    // Single word should NOT have breaks between words
    expect(ssml).not.toContain('Help <break time="1s"/> ');
  });

  it("returns empty speak tags for blank input", () => {
    expect(generateSsml("")).toBe("<speak></speak>");
    expect(generateSsml("   ")).toBe("<speak></speak>");
  });

  it("handles extra whitespace in the sentence", () => {
    const ssml = generateSsml("  I   need   water  ");

    // Full sentence has leading space trimmed by split, but original is preserved
    expect(ssml).toContain("I   need   water");
    // Word-by-word should have proper breaks (split on whitespace)
    expect(ssml).toContain('I <break time="1s"/> need <break time="1s"/> water');
  });

  it("generates word breaks matching the exact word count", () => {
    const ssml = generateSsml("I have stomach pain");
    const breakCount = (ssml.match(/<break time="1s"\/>/g) ?? []).length;

    // 1 break after full sentence + 3 breaks between 4 words = 4 total
    expect(breakCount).toBe(4);
  });
});

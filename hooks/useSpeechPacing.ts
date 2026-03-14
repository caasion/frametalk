"use client";

/**
 * useSpeechPacing – Custom hook that implements the SSML-equivalent pacing
 * using the browser's SpeechSynthesis API:
 *   1. Speak full sentence at normal rate
 *   2. Pause for 1 second
 *   3. Speak each word individually at a slow rate with 1-second pauses
 *
 * This replaces the need for SSML / Google Cloud TTS entirely.
 */

import { useCallback, useRef } from "react";

export function useSpeechPacing() {
  const timeoutIds = useRef<ReturnType<typeof setTimeout>[]>([]);

  const cancel = useCallback(() => {
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    for (const id of timeoutIds.current) clearTimeout(id);
    timeoutIds.current = [];
  }, []);

  /**
   * Speak a single word/phrase at the given rate.
   * Returns a promise that resolves when the utterance finishes.
   */
  const speakOne = useCallback(
    (text: string, rate = 1): Promise<void> =>
      new Promise((resolve) => {
        if (typeof window === "undefined" || !window.speechSynthesis) {
          resolve();
          return;
        }
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = rate;
        utterance.lang = "en-US";
        utterance.onend = () => resolve();
        utterance.onerror = () => resolve();
        window.speechSynthesis.speak(utterance);
      }),
    []
  );

  /**
   * Wait for a given duration in milliseconds.
   */
  const wait = useCallback(
    (ms: number): Promise<void> =>
      new Promise((resolve) => {
        const id = setTimeout(resolve, ms);
        timeoutIds.current.push(id);
      }),
    []
  );

  /**
   * Full paced speech sequence:
   *   1. Sentence at normal rate
   *   2. 1-second pause
   *   3. Each word at slow rate (0.6) with 1-second pauses between
   */
  const speakWithPacing = useCallback(
    async (sentence: string) => {
      cancel();
      const words = sentence.trim().split(/\s+/);
      if (words.length === 0) return;

      // Step 1: full sentence at normal rate
      await speakOne(sentence, 0.85);

      // Step 2: 1-second pause
      await wait(1000);

      // Step 3: word-by-word at slow rate
      for (let i = 0; i < words.length; i++) {
        await speakOne(words[i], 0.6);
        if (i < words.length - 1) {
          await wait(1000);
        }
      }
    },
    [cancel, speakOne, wait]
  );

  /**
   * Speak a single word slowly (used to replay failed words).
   */
  const speakWord = useCallback(
    (word: string) => {
      cancel();
      speakOne(word, 0.6);
    },
    [cancel, speakOne]
  );

  return { speakWithPacing, speakWord, cancel };
}

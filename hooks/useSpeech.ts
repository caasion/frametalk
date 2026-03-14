import { useCallback } from 'react';

export const useSpeech = () => {
  const speak = useCallback((text: string, options?: { rate?: number; pitch?: number }) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) {
      console.warn('Speech synthesis not supported');
      return;
    }

    // Cancel any ongoing speech to start new one immediately
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    if (options?.rate) utterance.rate = options.rate;
    if (options?.pitch) utterance.pitch = options.pitch;

    window.speechSynthesis.speak(utterance);
  }, []);

  return { speak };
};

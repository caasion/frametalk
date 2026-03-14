"use client";

import { useState, useEffect } from "react";

const cache = new Map<string, string>();

export function useArasaacImage(keyword: string): { url: string | null; loading: boolean } {
  const [url, setUrl] = useState<string | null>(cache.get(keyword) ?? null);
  const [loading, setLoading] = useState(!cache.has(keyword));

  useEffect(() => {
    if (cache.has(keyword)) {
      setUrl(cache.get(keyword)!);
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);

    fetch(`https://api.arasaac.org/v1/pictograms/en/search/${encodeURIComponent(keyword)}`)
      .then((res) => res.json())
      .then((data) => {
        if (cancelled) return;
        if (Array.isArray(data) && data.length > 0) {
          const id = data[0]._id;
          const imageUrl = `https://static.arasaac.org/pictograms/${id}/${id}_2500.png`;
          cache.set(keyword, imageUrl);
          setUrl(imageUrl);
        }
        setLoading(false);
      })
      .catch(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [keyword]);

  return { url, loading };
}

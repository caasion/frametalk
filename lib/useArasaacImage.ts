"use client";

import { useState, useEffect } from "react";

const cache = new Map<string, string>();

type UseArasaacImageOptions = {
  preferredId?: number;
};

export function useArasaacImage(
  keyword: string,
  options?: UseArasaacImageOptions,
): { url: string | null; loading: boolean } {
  const cacheKey = `${keyword}::${options?.preferredId ?? ""}`;
  const [url, setUrl] = useState<string | null>(cache.get(cacheKey) ?? null);
  const [loading, setLoading] = useState(!cache.has(cacheKey));

  useEffect(() => {
    if (cache.has(cacheKey)) {
      setUrl(cache.get(cacheKey)!);
      setLoading(false);
      return;
    }

    // Explicit override should not depend on search result ordering or matching.
    if (typeof options?.preferredId === "number") {
      const forcedUrl = `https://static.arasaac.org/pictograms/${options.preferredId}/${options.preferredId}_2500.png`;
      cache.set(cacheKey, forcedUrl);
      setUrl(forcedUrl);
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
          cache.set(cacheKey, imageUrl);
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
  }, [cacheKey, keyword, options?.preferredId]);

  return { url, loading };
}

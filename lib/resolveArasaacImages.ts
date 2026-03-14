/**
 * Resolves ARASAAC pictogram image URLs for a list of words.
 * Uses the same API endpoint as useArasaacImage hook but as a plain async function
 * suitable for non-hook contexts.
 */

export interface WordPictogram {
  id: string;
  label: string;
  imageUrl: string | null;
}

const imageCache = new Map<string, string | null>();

async function fetchImageUrl(keyword: string): Promise<string | null> {
  if (imageCache.has(keyword)) return imageCache.get(keyword)!;

  try {
    const res = await fetch(
      `https://api.arasaac.org/v1/pictograms/en/search/${encodeURIComponent(keyword)}`
    );
    const data = await res.json();
    if (Array.isArray(data) && data.length > 0) {
      const id = data[0]._id;
      const url = `https://static.arasaac.org/pictograms/${id}/${id}_2500.png`;
      imageCache.set(keyword, url);
      return url;
    }
  } catch {
    // ignore fetch errors
  }

  imageCache.set(keyword, null);
  return null;
}

export async function resolveArasaacImages(
  words: string[]
): Promise<WordPictogram[]> {
  const results = await Promise.all(
    words.map(async (word, i) => {
      const imageUrl = await fetchImageUrl(word.toLowerCase());
      return {
        id: `word-${i}-${word}`,
        label: word,
        imageUrl,
      };
    })
  );
  return results;
}

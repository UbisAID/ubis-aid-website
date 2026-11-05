import "server-only";

/**
 * Pexels photo lookup (https://www.pexels.com/api/).
 * Runs on the server at build/revalidate time only, so PEXELS_API_KEY never
 * reaches the browser. Returns null when the key is missing or the request
 * fails, and callers fall back to an illustrated placeholder.
 *
 * Pexels photos are stand-ins. Replace them with your own photography
 * (with model consent) before launch.
 */

export type PexelsPhoto = {
  src: string;
  width: number;
  height: number;
  alt: string;
  photographer: string;
  photographerUrl: string;
  pageUrl: string;
};

type ApiPhoto = {
  id: number;
  width: number;
  height: number;
  url: string;
  alt: string;
  photographer: string;
  photographer_url: string;
  src: { original: string };
};

const WEEK = 60 * 60 * 24 * 7;

export async function getPexelsPhoto(
  query: string,
  { orientation = "landscape", pick = 0 }: { orientation?: "landscape" | "portrait" | "square"; pick?: number } = {},
): Promise<PexelsPhoto | null> {
  const key = process.env.PEXELS_API_KEY;
  if (!key) return null;

  const url = new URL("https://api.pexels.com/v1/search");
  url.searchParams.set("query", query);
  url.searchParams.set("orientation", orientation);
  url.searchParams.set("per_page", "10");
  url.searchParams.set("locale", "en-US");

  try {
    const res = await fetch(url, {
      headers: { Authorization: key },
      next: { revalidate: WEEK, tags: ["pexels"] },
    });
    if (!res.ok) return null;
    const data = (await res.json()) as { photos?: ApiPhoto[] };
    const photo = data.photos?.[pick] ?? data.photos?.[0];
    if (!photo) return null;
    return {
      src: `${photo.src.original}?auto=compress&cs=tinysrgb&w=1400`,
      width: photo.width,
      height: photo.height,
      alt: photo.alt,
      photographer: photo.photographer,
      photographerUrl: photo.photographer_url,
      pageUrl: photo.url,
    };
  } catch {
    return null;
  }
}

import Image from "next/image";
import type { Tint } from "@/lib/content";
import { getPexelsPhoto } from "@/lib/pexels";
import { cn } from "@/lib/utils";
import { PhotoPlaceholder, tintBg } from "./primitives";

/**
 * Photo slot. Uses a Pexels photo matching `query` when PEXELS_API_KEY is set,
 * otherwise an illustrated placeholder that shows the photo brief.
 *
 * Default treatment is a warm duotone: the photo is rendered in grayscale and
 * multiplied over a brand tint. This makes stock photos from different
 * photographers read as one consistent brand. Use treatment="color" to opt out.
 */
export async function Photo({
  query,
  alt,
  brief,
  briefLabel,
  tint = "peach",
  orientation = "landscape",
  pick = 0,
  priority = false,
  sizes = "(min-width: 1024px) 45vw, calc(100vw - 2rem)",
  treatment = "duotone",
  decorative = false,
  credit = true,
  className,
  imageClassName,
  creditClassName,
}: {
  query: string;
  alt: string;
  brief?: string;
  briefLabel?: string;
  tint?: Tint;
  orientation?: "landscape" | "portrait" | "square";
  pick?: number;
  priority?: boolean;
  sizes?: string;
  treatment?: "duotone" | "color";
  /** Purely atmospheric image: empty alt so screen readers skip it. */
  decorative?: boolean;
  /** Set false inside links (avoids nested anchors); show <PhotoCredits> nearby instead. */
  credit?: boolean;
  className?: string;
  imageClassName?: string;
  /** Position/style override for the photographer credit. */
  creditClassName?: string;
}) {
  const photo = await getPexelsPhoto(query, { orientation, pick });
  if (!photo) {
    return (
      <PhotoPlaceholder
        alt={alt}
        brief={brief}
        label={briefLabel}
        tint={tint}
        className={className}
      />
    );
  }

  return (
    <figure
      className={cn(
        "relative isolate overflow-hidden rounded-[2rem]",
        treatment === "duotone" && tintBg[tint],
        className,
      )}
    >
      <Image
        src={photo.src}
        // Pexels' own description matches the actual image better than our brief.
        alt={decorative ? "" : photo.alt || alt}
        fill
        sizes={sizes}
        quality={60}
        // Above-the-fold photos load eagerly with high priority (Next 16 replaced `priority`).
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : "auto"}
        className={cn(
          "object-cover",
          treatment === "duotone" &&
            "contrast-[1.08] grayscale mix-blend-multiply",
          imageClassName,
        )}
      />
      {credit && (
        <figcaption
          className={cn(
            "absolute right-3 bottom-3 rounded-full bg-black/60 px-2.5 py-1 text-xs text-white",
            creditClassName,
          )}
        >
          <a
            href={photo.pageUrl}
            rel="noopener noreferrer"
            className="hover:underline"
          >
            {photo.photographer} / Pexels
          </a>
        </figcaption>
      )}
    </figure>
  );
}

/** Credit line for photos rendered with a hidden in-image credit. */
export async function PhotoCredits({
  photos,
  label,
  className,
}: {
  photos: {
    query: string;
    orientation?: "landscape" | "portrait" | "square";
    pick?: number;
  }[];
  label: string;
  className?: string;
}) {
  const found = (
    await Promise.all(photos.map((p) => getPexelsPhoto(p.query, p)))
  ).filter((p): p is NonNullable<typeof p> => p !== null);
  if (!found.length) return null;
  return (
    <p className={cn("text-xs text-muted-foreground", className)}>
      {label}:{" "}
      {found.map((p, i) => (
        <span key={p.pageUrl}>
          {i > 0 && ", "}
          <a
            href={p.pageUrl}
            rel="noopener noreferrer"
            className="underline-offset-2 hover:underline"
          >
            {p.photographer}
          </a>
        </span>
      ))}{" "}
      / Pexels
    </p>
  );
}

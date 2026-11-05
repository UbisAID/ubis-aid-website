import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { localePath, type Locale } from "@/i18n/config";
import { Photo } from "@/components/sections/photo";
import { cn } from "@/lib/utils";

export type BentoTile = {
  href: string;
  eyebrow: string;
  title: string;
  text: string;
  /** Large figure shown on the tile, e.g. "13–19". */
  figure?: string;
};

const arrow =
  "grid size-12 shrink-0 place-items-center rounded-full transition-transform duration-300 group-hover:rotate-45";

/**
 * Audience paths as a bento grid: one large photo tile for the primary
 * audience (young people 13–19), three supporting tiles with distinct colours.
 */
export async function AudienceBento({
  tiles,
  locale,
  photoAlt,
}: {
  tiles: [BentoTile, BentoTile, BentoTile, BentoTile];
  locale: Locale;
  photoAlt: string;
}) {
  const [main, adults, grownups, engage] = tiles;
  return (
    <ul className="grid grid-cols-1 gap-3 sm:gap-4 lg:grid-cols-4 lg:grid-rows-[minmax(15rem,auto)_minmax(15rem,auto)]">
      <li className="min-w-0 lg:col-span-2 lg:row-span-2">
        <Link
          href={localePath(locale, main.href)}
          className="group flex h-full flex-col overflow-hidden rounded-[2rem] bg-peach"
        >
          <div className="flex items-start justify-between gap-4 p-7 sm:p-9">
            <div>
              <span className="text-[0.8rem] font-semibold tracking-[0.14em] uppercase">{main.eyebrow}</span>
              <span className="mt-3 block font-heading text-4xl font-extrabold tracking-[-0.03em] sm:text-5xl">
                {main.title}
              </span>
              <span className="mt-3 block max-w-sm text-lg text-ink/80">{main.text}</span>
            </div>
            <span aria-hidden="true" className={cn(arrow, "bg-ink text-white")}>
              <ArrowUpRight className="size-5" />
            </span>
          </div>
          <Photo
            query="teenagers laughing together outdoors"
            pick={1}
            alt={photoAlt}
            tint="peach"
            sizes="(min-width: 1024px) 40vw, 100vw"
            className="mx-3 mb-3 min-h-60 flex-1 rounded-[1.6rem] sm:mx-4 sm:mb-4"
            credit={false}
          />
        </Link>
      </li>

      <li className="min-w-0 lg:col-span-2">
        <Link
          href={localePath(locale, adults.href)}
          className="group flex h-full flex-col justify-between gap-6 rounded-[2rem] bg-lavender p-7 sm:p-9"
        >
          <div className="flex items-start justify-between gap-4">
            <span className="text-[0.8rem] font-semibold tracking-[0.14em] uppercase">{adults.eyebrow}</span>
            <span aria-hidden="true" className={cn(arrow, "bg-white")}>
              <ArrowUpRight className="size-5" />
            </span>
          </div>
          <div className="flex items-end justify-between gap-4">
            <div>
              <span className="block font-heading text-3xl font-extrabold tracking-[-0.02em] sm:text-4xl">
                {adults.title}
              </span>
              <span className="mt-2 block max-w-xs text-ink/80">{adults.text}</span>
            </div>
            {adults.figure && (
              <span aria-hidden="true" className="font-serif text-5xl leading-none whitespace-nowrap text-ink/70 italic sm:text-7xl">
                {adults.figure}
              </span>
            )}
          </div>
        </Link>
      </li>

      {[grownups, engage].map((tile, i) => (
        <li key={tile.href} className="min-w-0">
          <Link
            href={localePath(locale, tile.href)}
            className={cn(
              "group flex h-full flex-col justify-between gap-6 rounded-[2rem] p-7",
              i === 0 ? "bg-sage" : "bg-ink text-white",
            )}
          >
            <div className="flex items-start justify-between gap-4">
              <span
                className={cn(
                  "text-[0.8rem] font-semibold tracking-[0.14em] uppercase",
                  i === 1 && "text-butter",
                )}
              >
                {tile.eyebrow}
              </span>
              <span aria-hidden="true" className={cn(arrow, i === 0 ? "bg-white" : "bg-primary text-white")}>
                <ArrowUpRight className="size-5" />
              </span>
            </div>
            <div>
              <span className="block font-heading text-2xl font-extrabold tracking-[-0.02em] sm:text-3xl">
                {tile.title}
              </span>
              <span className={cn("mt-2 block", i === 0 ? "text-ink/80" : "text-white/80")}>{tile.text}</span>
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
}

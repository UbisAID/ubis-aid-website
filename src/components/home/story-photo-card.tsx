import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { localePath, type Locale } from "@/i18n/config";
import type { Entry, StoryMeta } from "@/lib/content";
import { Photo } from "@/components/sections/photo";

/**
 * Story card with the quote set over a mood photo (never a face – storytellers
 * are not shown). A dark gradient keeps the white text above 4.5:1 contrast.
 */
export async function StoryPhotoCard({
  story,
  locale,
  roleLabel,
}: {
  story: Entry<StoryMeta>;
  locale: Locale;
  roleLabel: string;
}) {
  const m = story.meta;
  return (
    <Link
      href={localePath(locale, `/berattelser/${story.slug}`)}
      className="group relative isolate flex aspect-[4/5] flex-col justify-end overflow-hidden rounded-[2rem] text-white"
    >
      <Photo
        query={m.photoQuery}
        orientation="portrait"
        alt=""
        decorative
        tint={m.color}
        sizes="(min-width: 768px) 33vw, 100vw"
        className="absolute inset-0 -z-20 rounded-none transition-transform duration-700 group-hover:scale-105"
        credit={false}
      />
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-t from-ink via-ink/80 via-45% to-ink/0" />
      <div className="p-6 sm:p-7">
        <span className="inline-flex rounded-full bg-white/15 px-3 py-1 text-xs font-semibold tracking-[0.12em] uppercase backdrop-blur">
          {roleLabel}
        </span>
        <blockquote className="mt-4 font-serif text-[1.65rem] leading-[1.15] sm:text-3xl">”{m.excerpt}”</blockquote>
        <p className="mt-5 flex items-center justify-between gap-3 text-white/85">
          <span>
            <span className="font-semibold text-white">{m.name}</span>
            {m.age ? `, ${m.age}` : ""}
          </span>
          <span
            aria-hidden="true"
            className="grid size-10 place-items-center rounded-full bg-white text-ink transition-transform duration-300 group-hover:rotate-45"
          >
            <ArrowUpRight className="size-5" />
          </span>
        </p>
        <span className="sr-only">{m.title}</span>
      </div>
    </Link>
  );
}

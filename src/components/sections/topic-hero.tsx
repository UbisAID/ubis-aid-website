import type { Tint } from "@/lib/content";
import { cn } from "@/lib/utils";
import { Photo } from "./photo";
import { tintBg } from "./primitives";

/**
 * Article header for topic pages: a large title, an italic serif lead and a
 * hairline meta row, beside the brand split-circle with a toned mood photo
 * (after Intercom's and Wise's editorial article headers).
 */
export function TopicHero({
  title,
  lead,
  meta,
  photoQuery,
  tint,
  lang,
}: {
  title: string;
  lead: string;
  meta: { label: string; value: string }[];
  photoQuery?: string;
  tint: Tint;
  lang?: string;
}) {
  return (
    <header className="mt-8 grid items-end gap-10 border-b border-ink/15 pb-12 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)] lg:gap-16">
      <div>
        <h1
          lang={lang}
          className="text-[clamp(3rem,7vw,6rem)] leading-[0.95] font-extrabold tracking-[-0.045em]"
        >
          {title}
        </h1>
        <p lang={lang} className="mt-6 max-w-xl font-serif text-2xl leading-snug text-ink/80 italic sm:text-3xl">
          {lead}
        </p>
        <dl className="mt-10 flex flex-wrap gap-x-10 gap-y-3 border-t border-ink/15 pt-5">
          {meta.map((m) => (
            <div key={m.label}>
              <dt className="text-sm text-muted-foreground">{m.label}</dt>
              <dd className="font-semibold">{m.value}</dd>
            </div>
          ))}
        </dl>
      </div>

      {/* Split circle: toned photo (left) + topic tint (right), with a brand accent dot */}
      <div aria-hidden="true" className="relative mx-auto hidden aspect-square w-full max-w-[22rem] sm:block lg:mx-0 lg:ml-auto">
        {photoQuery ? (
          <Photo
            query={photoQuery}
            orientation="portrait"
            decorative
            credit={false}
            alt=""
            tint={tint}
            sizes="180px"
            className="absolute inset-y-0 left-0 w-1/2 rounded-l-full rounded-r-none"
          />
        ) : (
          <span className="absolute inset-y-0 left-0 w-1/2 rounded-l-full bg-secondary" />
        )}
        <span className={cn("absolute inset-y-0 right-0 w-1/2 rounded-r-full", tintBg[tint])} />
        <span className="absolute right-[12%] -bottom-4 size-[28%] rounded-full bg-primary" />
      </div>
    </header>
  );
}

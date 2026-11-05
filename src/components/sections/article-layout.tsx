import Link from "next/link";
import { ArrowLeft, Clock, Languages } from "lucide-react";
import type { Dictionary } from "@/i18n/dictionaries/sv";
import { cn } from "@/lib/utils";
import { Container } from "./primitives";

/** Shared shell for topic, story, news and policy pages. */
export function ArticleLayout({
  dict,
  backHref,
  backLabel,
  eyebrow,
  title,
  lead,
  meta,
  fallback,
  children,
  aside,
  lang,
  hero,
}: {
  dict: Dictionary;
  backHref: string;
  backLabel: string;
  eyebrow?: React.ReactNode;
  title: string;
  lead?: string;
  meta?: React.ReactNode;
  fallback?: boolean;
  children: React.ReactNode;
  aside?: React.ReactNode;
  /** Language of the body when it differs from the page (translation fallback). */
  lang?: string;
  /** Full-width header that replaces the default title block (used by topics). */
  hero?: React.ReactNode;
}) {
  return (
    <Container className="py-10 sm:py-14">
      <Link
        href={backHref}
        className="inline-flex min-h-11 items-center gap-2 rounded-full pr-3 font-semibold text-secondary hover:underline"
      >
        <ArrowLeft aria-hidden="true" className="size-5" />
        {backLabel}
      </Link>
      {hero}
      <article
        className={cn(
          "grid gap-12 lg:grid-cols-[minmax(0,1fr)_22rem]",
          hero ? "mt-12" : "mt-6",
        )}
      >
        <div>
          {!hero && (
            <header>
              {eyebrow}
              <h1
                lang={lang}
                className="mt-4 text-4xl font-extrabold sm:text-5xl"
              >
                {title}
              </h1>
              {lead && (
                <p
                  lang={lang}
                  className="mt-4 max-w-2xl text-xl text-muted-foreground"
                >
                  {lead}
                </p>
              )}
              {meta && (
                <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-muted-foreground">
                  {meta}
                </div>
              )}
            </header>
          )}
          {fallback && (
            <p
              className={cn(
                "flex items-center gap-2 rounded-2xl bg-butter px-4 py-3",
                !hero && "mt-6",
              )}
            >
              <Languages aria-hidden="true" className="size-5 shrink-0" />
              {dict.common.contentFallback}
            </p>
          )}
          <div
            lang={lang}
            className={cn("text-lg", (!hero || fallback) && "mt-10")}
          >
            {children}
          </div>
        </div>
        {aside && (
          <aside className="space-y-6 lg:sticky lg:top-28 lg:self-start">
            {aside}
          </aside>
        )}
      </article>
    </Container>
  );
}

export function ReadingTime({
  minutes,
  label,
}: {
  minutes: number;
  label: string;
}) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <Clock aria-hidden="true" className="size-4" />
      {label.replace("{min}", String(minutes))}
    </span>
  );
}

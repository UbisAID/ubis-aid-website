import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { localePath, type Locale } from "@/i18n/config";
import type { Entry, TopicMeta } from "@/lib/content";
import { tintBg } from "@/components/sections/primitives";
import { cn } from "@/lib/utils";

/**
 * Editorial topic index: pure typography with hairline rules, an inline arrow
 * after each title and the reading time on the right (after Dovetail/A24).
 * Hovering softly fills the row with the topic's tint.
 */
export function TopicIndex({
  topics,
  locale,
  minReadLabel,
}: {
  topics: Entry<TopicMeta>[];
  locale: Locale;
  /** e.g. "{min} min läsning" */
  minReadLabel: string;
}) {
  return (
    <ul className="border-t border-ink/15">
      {topics.map((topic) => (
        <li key={topic.slug} className="border-b border-ink/15">
          <Link
            href={localePath(locale, `/amnen/${topic.slug}`)}
            className="group relative isolate flex items-end justify-between gap-6 py-6 sm:py-7"
          >
            <span
              aria-hidden="true"
              className={cn(
                "absolute inset-y-0 -inset-x-4 -z-10 origin-left scale-x-0 rounded-2xl transition-transform duration-500 ease-out group-hover:scale-x-100 sm:-inset-x-5",
                tintBg[topic.meta.color],
              )}
            />
            <span className="min-w-0">
              <span className="inline-flex items-start gap-2 font-heading text-[1.75rem] leading-tight font-bold tracking-[-0.025em] sm:text-4xl">
                {topic.meta.title}
                <ArrowUpRight
                  aria-hidden="true"
                  className="mt-1 size-5 shrink-0 text-primary transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 sm:size-6"
                />
              </span>
              <span className="mt-1.5 block max-w-xl text-muted-foreground">{topic.meta.description}</span>
            </span>
            <span className="hidden shrink-0 pb-1 text-sm whitespace-nowrap text-muted-foreground sm:block">
              {minReadLabel.replace("{min}", String(topic.readingMinutes))}
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { localePath, type Locale } from "@/i18n/config";
import type { Tint } from "@/lib/content";
import { cn } from "@/lib/utils";
import { tintBg } from "./primitives";

export type AudienceCard = {
  href: string;
  eyebrow: string;
  title: string;
  text: string;
  tint: Tint;
};

export function AudienceCards({ cards, locale }: { cards: AudienceCard[]; locale: Locale }) {
  return (
    <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((card, i) => (
        <li key={card.href}>
          <Link
            href={localePath(locale, card.href)}
            className={cn(
              "group relative flex h-full min-h-64 flex-col overflow-hidden rounded-[2rem] p-7 transition-transform duration-200 motion-safe:hover:-translate-y-1",
              tintBg[card.tint],
            )}
          >
            <span
              aria-hidden="true"
              className="absolute -right-10 -bottom-10 size-40 rounded-full bg-white/40 transition-transform duration-300 motion-safe:group-hover:scale-110"
            />
            <span className="relative text-sm font-semibold tracking-wide uppercase">
              {card.eyebrow}
            </span>
            <span className="relative mt-3 font-heading text-2xl font-extrabold sm:text-3xl">
              {card.title}
            </span>
            <span className="relative mt-3 text-ink/80">{card.text}</span>
            <span
              aria-hidden="true"
              className={cn(
                "relative mt-auto grid size-12 place-items-center self-start rounded-full transition-colors",
                i < 2 ? "bg-ink text-white" : "bg-white group-hover:bg-ink group-hover:text-white",
              )}
            >
              <ArrowRight className="size-5" />
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}

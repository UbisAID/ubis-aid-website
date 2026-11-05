import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { localePath, type Locale } from "@/i18n/config";
import type { Tint } from "@/lib/content";
import { cn } from "@/lib/utils";
import { tintBg } from "./primitives";

export type Prompt = { text: string; href: string; tint: Tint };

/** "Do you recognise yourself?" cards: first-person statements linking to topics. */
export function PromptLinks({ prompts, locale }: { prompts: Prompt[]; locale: Locale }) {
  return (
    <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {prompts.map((p) => (
        <li key={p.text}>
          <Link
            href={localePath(locale, p.href)}
            className={cn(
              "group flex min-h-20 items-center justify-between gap-4 rounded-3xl px-6 py-5 font-heading text-lg font-bold transition-transform motion-safe:hover:-translate-y-0.5",
              tintBg[p.tint],
            )}
          >
            ”{p.text}”
            <ArrowRight aria-hidden="true" className="size-5 shrink-0 transition-transform group-hover:translate-x-1" />
          </Link>
        </li>
      ))}
    </ul>
  );
}

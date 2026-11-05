import Link from "next/link";
import { MessageCircleHeart } from "lucide-react";
import { localePath, type Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries/sv";
import { fill } from "@/i18n/fill";
import { site } from "@/lib/site";

/** Persistent top banner shown on every page. */
export function ChatBanner({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  return (
    <aside aria-label={dict.banner.lead} className="bg-secondary text-secondary-foreground">
      <p className="mx-auto flex max-w-7xl items-center justify-center gap-2 px-4 py-2 text-center text-sm sm:text-base">
        <MessageCircleHeart aria-hidden="true" className="size-5 shrink-0" />
        <span>
          {dict.banner.lead}{" "}
          <Link
            href={localePath(locale, "/prata-med-oss")}
            className="font-semibold underline decoration-2 underline-offset-4 hover:decoration-butter"
          >
            {fill(dict.banner.cta, { hours: site.hours.chatLabel })}
          </Link>
        </span>
      </p>
    </aside>
  );
}

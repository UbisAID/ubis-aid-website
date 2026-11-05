"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Globe } from "lucide-react";
import { localePath, stripLocale, type Locale } from "@/i18n/config";
import { cn } from "@/lib/utils";

export function LanguageToggle({
  locale,
  label,
  ariaLabel,
  className,
}: {
  locale: Locale;
  label: string;
  ariaLabel: string;
  className?: string;
}) {
  const path = stripLocale(usePathname());
  const target: Locale = locale === "sv" ? "en" : "sv";
  return (
    <Link
      href={localePath(target, path)}
      hrefLang={target}
      lang={target}
      aria-label={ariaLabel}
      className={cn(
        "inline-flex min-h-11 items-center gap-1.5 rounded-full px-3 text-sm font-semibold hover:bg-muted",
        className,
      )}
    >
      <Globe aria-hidden="true" className="size-4" />
      {label}
    </Link>
  );
}

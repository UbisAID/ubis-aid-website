"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { X } from "lucide-react";
import { stripLocale } from "@/i18n/config";
import { isYouthRoute, site } from "@/lib/site";

/**
 * Leaves the site immediately. Rendered in the sticky header on youth pages,
 * so it is always visible and never covers page content.
 * `location.replace` swaps the current history entry, so pressing Back does not
 * return to this page. Earlier pages from this visit stay in the history, which
 * is why the contact page explains how to browse safely.
 */
export function leaveSite() {
  try {
    sessionStorage.clear();
  } catch {
    // Storage can be blocked; leaving the page matters more.
  }
  document.title = "Väder";
  document.body.style.visibility = "hidden";
  window.location.replace(site.quickExitUrl);
}

export function QuickExit({ label, short, hint }: { label: string; short: string; hint: string }) {
  const path = stripLocale(usePathname());
  const lastEscape = useRef(0);
  const visible = isYouthRoute(path);

  useEffect(() => {
    if (!visible) return;
    function onKey(e: KeyboardEvent) {
      if (e.key !== "Escape") return;
      const now = Date.now();
      if (now - lastEscape.current < 600) leaveSite();
      lastEscape.current = now;
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [visible]);

  if (!visible) return null;

  return (
    <button
      type="button"
      onClick={leaveSite}
      aria-label={label}
      title={hint}
      className="inline-flex min-h-11 shrink-0 items-center gap-1.5 rounded-full bg-ink px-3.5 text-[0.95rem] font-bold whitespace-nowrap text-white shadow-sm transition-colors hover:bg-ink/85 focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-ring sm:px-4"
    >
      <X aria-hidden="true" className="size-5" />
      <span>{short}</span>
    </button>
  );
}

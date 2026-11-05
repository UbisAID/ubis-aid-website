"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import Script from "next/script";
import { stripLocale } from "@/i18n/config";
import { useConsent } from "@/lib/consent";
import { isYouthRoute } from "@/lib/site";

declare global {
  interface Window {
    plausible?: (event: string, options?: { u?: string }) => void;
  }
}

const DOMAIN = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN;

/**
 * Privacy-friendly statistics (Plausible, cookieless).
 * Loads only when (1) a domain is configured and (2) the visitor allowed
 * statistics. Uses manual pageviews so support pages are never recorded,
 * even during client-side navigation.
 */
export function Analytics() {
  const consent = useConsent();
  const pathname = usePathname();
  const allowed = Boolean(DOMAIN && consent?.analytics);

  useEffect(() => {
    if (!allowed) return;
    if (isYouthRoute(stripLocale(pathname))) return;
    const send = () => window.plausible?.("pageview", { u: window.location.origin + pathname });
    if (window.plausible) send();
    else window.addEventListener("plausible-ready", send, { once: true });
  }, [allowed, pathname]);

  if (!allowed) return null;
  return (
    <Script
      src="https://plausible.io/js/script.manual.js"
      data-domain={DOMAIN}
      strategy="afterInteractive"
      onLoad={() => window.dispatchEvent(new Event("plausible-ready"))}
    />
  );
}

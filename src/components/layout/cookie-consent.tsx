"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Cookie } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  onOpenConsentSettings,
  openConsentSettings,
  saveConsent,
  useConsent,
} from "@/lib/consent";

type Labels = {
  title: string;
  text: string;
  decline: string;
  accept: string;
  readMore: string;
};

export function CookieConsent({ labels, policyHref }: { labels: Labels; policyHref: string }) {
  const consent = useConsent();
  const [reopened, setReopened] = useState(false);
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(
    () =>
      onOpenConsentSettings(() => {
        setReopened(true);
        requestAnimationFrame(() => headingRef.current?.focus());
      }),
    [],
  );

  // undefined = server render / not hydrated yet; render nothing to avoid a flash.
  const open = consent === null || reopened;
  if (consent === undefined || !open) return null;

  function choose(analytics: boolean) {
    saveConsent(analytics);
    setReopened(false);
  }

  return (
    <section
      aria-labelledby="cookie-title"
      className="fixed inset-x-3 bottom-3 z-50 rounded-3xl border border-border bg-card p-5 shadow-xl sm:inset-x-auto sm:bottom-5 sm:left-5 sm:max-w-md"
    >
      <div className="flex items-start gap-3">
        <Cookie aria-hidden="true" className="mt-1 size-6 shrink-0 text-primary" />
        <div>
          <h2
            id="cookie-title"
            ref={headingRef}
            tabIndex={-1}
            className="text-lg font-bold outline-none"
          >
            {labels.title}
          </h2>
          <p className="mt-1 text-[0.95rem] text-muted-foreground">{labels.text}</p>
          <Link
            href={policyHref}
            className="mt-1 inline-block text-sm font-semibold text-secondary underline underline-offset-4"
          >
            {labels.readMore}
          </Link>
        </div>
      </div>
      {/* Both choices get equal weight: no dark patterns. */}
      <div className="mt-4 grid grid-cols-2 gap-2">
        <Button variant="secondary" onClick={() => choose(false)}>
          {labels.decline}
        </Button>
        <Button variant="secondary" onClick={() => choose(true)}>
          {labels.accept}
        </Button>
      </div>
    </section>
  );
}

export function CookieSettingsButton({ label }: { label: string }) {
  return (
    <button
      type="button"
      onClick={openConsentSettings}
      className="underline-offset-4 hover:underline"
    >
      {label}
    </button>
  );
}

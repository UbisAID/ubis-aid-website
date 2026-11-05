"use client";

import { useSyncExternalStore } from "react";

/**
 * Cookie consent, stored in localStorage (strictly necessary, never sent to a
 * server). Non-essential categories default to declined until the visitor
 * actively allows them.
 */
export type Consent = { analytics: boolean; decidedAt: string };

const KEY = "consent-v1";
const EVENT = "consent-change";
const OPEN_EVENT = "consent-open";

function read(): string | null {
  try {
    return localStorage.getItem(KEY);
  } catch {
    return null;
  }
}

function subscribe(callback: () => void) {
  window.addEventListener(EVENT, callback);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener(EVENT, callback);
    window.removeEventListener("storage", callback);
  };
}

/** Returns undefined during SSR, null when no choice is made, otherwise the choice. */
export function useConsent(): Consent | null | undefined {
  const raw = useSyncExternalStore(subscribe, read, () => undefined);
  if (raw === undefined) return undefined;
  if (raw === null) return null;
  try {
    return JSON.parse(raw) as Consent;
  } catch {
    return null;
  }
}

export function saveConsent(analytics: boolean) {
  const value: Consent = { analytics, decidedAt: new Date().toISOString() };
  try {
    localStorage.setItem(KEY, JSON.stringify(value));
  } catch {
    // If storage is blocked we keep the default (declined).
  }
  window.dispatchEvent(new Event(EVENT));
}

export function openConsentSettings() {
  window.dispatchEvent(new Event(OPEN_EVENT));
}

export function onOpenConsentSettings(callback: () => void) {
  window.addEventListener(OPEN_EVENT, callback);
  return () => window.removeEventListener(OPEN_EVENT, callback);
}

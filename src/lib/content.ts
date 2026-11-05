import "server-only";
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { defaultLocale, type Locale } from "@/i18n/config";

/**
 * File-based CMS.
 *
 * Long-form content lives in /content/<collection>/<locale>/<slug>.mdx.
 * Swedish is the source of truth: every slug must exist in /sv. If a
 * translation is missing, the Swedish file is shown with a notice.
 *
 * Structured lists (events, team, reports…) live in /content/data/*.json and
 * use { "sv": "...", "en": "..." } for translated fields.
 *
 * To move to a headless CMS (e.g. Sanity), keep these function signatures and
 * replace the bodies with CMS queries. Pages do not touch the file system.
 */

const CONTENT_ROOT = path.join(process.cwd(), "content");

export type Collection = "topics" | "stories" | "news" | "pages";

export type TopicMeta = {
  title: string;
  description: string;
  /** Pexels search for a calm, non-literal mood image (no faces) for the article header. */
  photoQuery?: string;
  icon: string;
  color: Tint;
  order: number;
  related?: string[];
  updated: string;
};

export type StoryMeta = {
  title: string;
  name: string;
  age?: number;
  role: "ung" | "volontar" | "personal" | "foralder";
  excerpt: string;
  date: string;
  consent: string;
  /** Brief for the real photo; also the alt text for the placeholder. */
  photo: string;
  /** Pexels search for a mood image. Never a face: storytellers are not shown. */
  photoQuery: string;
  color: Tint;
};

export type NewsMeta = {
  title: string;
  description: string;
  date: string;
  tag: string;
  press?: boolean;
};

export type PageMeta = {
  title: string;
  description: string;
  updated: string;
};

export type Tint = "peach" | "sage" | "lavender" | "butter" | "sky";

export type Entry<T> = {
  slug: string;
  meta: T;
  body: string;
  /** True when the requested locale was missing and Swedish was used. */
  fallback: boolean;
  readingMinutes: number;
};

function collectionDir(collection: Collection, locale: Locale) {
  return path.join(CONTENT_ROOT, collection, locale);
}

function readingMinutes(body: string) {
  const words = body.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

export function getSlugs(collection: Collection): string[] {
  const dir = collectionDir(collection, defaultLocale);
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".mdx"))
    .map((f) => f.replace(/\.mdx$/, ""));
}

export function getEntry<T>(
  collection: Collection,
  locale: Locale,
  slug: string,
): Entry<T> | null {
  if (!/^[a-z0-9-]+$/.test(slug)) return null;
  const localized = path.join(collectionDir(collection, locale), `${slug}.mdx`);
  const fallbackFile = path.join(collectionDir(collection, defaultLocale), `${slug}.mdx`);
  const useLocalized = fs.existsSync(localized);
  const file = useLocalized ? localized : fallbackFile;
  if (!fs.existsSync(file)) return null;

  const { data, content } = matter(fs.readFileSync(file, "utf8"));
  return {
    slug,
    meta: data as T,
    body: content,
    fallback: !useLocalized && locale !== defaultLocale,
    readingMinutes: readingMinutes(content),
  };
}

export function getEntries<T>(collection: Collection, locale: Locale): Entry<T>[] {
  return getSlugs(collection)
    .map((slug) => getEntry<T>(collection, locale, slug))
    .filter((e): e is Entry<T> => e !== null);
}

export function getTopics(locale: Locale) {
  return getEntries<TopicMeta>("topics", locale).sort((a, b) => a.meta.order - b.meta.order);
}

export function getStories(locale: Locale) {
  return getEntries<StoryMeta>("stories", locale).sort((a, b) =>
    b.meta.date.localeCompare(a.meta.date),
  );
}

export function getNews(locale: Locale) {
  return getEntries<NewsMeta>("news", locale).sort((a, b) =>
    b.meta.date.localeCompare(a.meta.date),
  );
}

/* ---------- Structured data (JSON) ---------- */

export type Localized = string | { sv: string; en?: string };

export function tr(value: Localized | undefined, locale: Locale): string {
  if (value === undefined) return "";
  if (typeof value === "string") return value;
  return value[locale] ?? value.sv;
}

export function getData<T>(name: string): T {
  const file = path.join(CONTENT_ROOT, "data", `${name}.json`);
  return JSON.parse(fs.readFileSync(file, "utf8")) as T;
}

export type Person = {
  name: string;
  role: Localized;
  text?: Localized;
  email?: string;
};

export type Report = {
  year: number;
  title: Localized;
  file: string;
  size: string;
};

export type Training = {
  id: string;
  title: Localized;
  audience: Localized;
  format: Localized;
  length: Localized;
  price: Localized;
  text: Localized;
};

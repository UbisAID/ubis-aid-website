import type { MetadataRoute } from "next";
import { locales, localePath } from "@/i18n/config";
import { getEntry, getSlugs, type NewsMeta, type StoryMeta, type TopicMeta } from "@/lib/content";
import { site } from "@/lib/site";

const staticPaths = [
  "/",
  "/prata-med-oss",
  "/unga",
  "/unga-vuxna",
  "/vuxna",
  "/amnen",
  "/sjalvtest",
  "/berattelser",
  "/nyheter",
  "/stod-oss",
  "/engagera-dig",
  "/for-yrkesverksamma",
  "/foretag",
  "/om-oss",
  "/om-oss/stadgar",
  "/om-oss/press",
  "/integritetspolicy",
];

function entry(path: string, lastModified?: string, priority = 0.7): MetadataRoute.Sitemap {
  const languages = Object.fromEntries(locales.map((l) => [l, `${site.url}${localePath(l, path)}`]));
  return locales.map((locale) => ({
    url: `${site.url}${localePath(locale, path)}`,
    lastModified: lastModified ? new Date(lastModified) : undefined,
    priority,
    alternates: { languages },
  }));
}

export default function sitemap(): MetadataRoute.Sitemap {
  const topics = getSlugs("topics").map((slug) =>
    entry(`/amnen/${slug}`, getEntry<TopicMeta>("topics", "sv", slug)?.meta.updated, 0.8),
  );
  const stories = getSlugs("stories").map((slug) =>
    entry(`/berattelser/${slug}`, getEntry<StoryMeta>("stories", "sv", slug)?.meta.date, 0.6),
  );
  const news = getSlugs("news").map((slug) =>
    entry(`/nyheter/${slug}`, getEntry<NewsMeta>("news", "sv", slug)?.meta.date, 0.5),
  );
  return [
    ...staticPaths.flatMap((p) => entry(p, undefined, p === "/" ? 1 : p === "/prata-med-oss" ? 0.9 : 0.7)),
    ...topics.flat(),
    ...stories.flat(),
    ...news.flat(),
  ];
}

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ShieldCheck } from "lucide-react";
import { localePath, locales } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { resolveLocale } from "@/i18n/resolve";
import { getEntry, getSlugs, type StoryMeta } from "@/lib/content";
import { formatDate } from "@/lib/format";
import { buildMetadata } from "@/lib/seo";
import { MdxContent } from "@/components/mdx/mdx-content";
import { ArticleLayout, ReadingTime } from "@/components/sections/article-layout";
import { TalkCta } from "@/components/sections/callouts";
import { tintBg } from "@/components/sections/primitives";
import { Photo } from "@/components/sections/photo";
import { cn } from "@/lib/utils";

export const dynamicParams = false;

export function generateStaticParams() {
  return locales.flatMap((locale) => getSlugs("stories").map((slug) => ({ locale, slug })));
}

export async function generateMetadata({ params }: PageProps<"/[locale]/berattelser/[slug]">): Promise<Metadata> {
  const locale = await resolveLocale(params);
  const { slug } = await params;
  const story = getEntry<StoryMeta>("stories", locale, slug);
  if (!story) return {};
  return buildMetadata({
    locale,
    path: `/berattelser/${slug}`,
    title: story.meta.title,
    description: story.meta.excerpt,
    type: "article",
  });
}

export default async function StoryPage({ params }: PageProps<"/[locale]/berattelser/[slug]">) {
  const locale = await resolveLocale(params);
  const { slug } = await params;
  const dict = await getDictionary(locale);
  const story = getEntry<StoryMeta>("stories", locale, slug);
  if (!story) notFound();
  const m = story.meta;

  return (
    <ArticleLayout
      dict={dict}
      backHref={localePath(locale, "/berattelser")}
      backLabel={dict.common.allStories}
      lang={story.fallback ? "sv" : undefined}
      fallback={story.fallback}
      eyebrow={
        <span className={cn("inline-flex rounded-full px-3 py-1 text-sm font-semibold", tintBg[m.color])}>
          {dict.storyRoles[m.role]}
        </span>
      }
      title={m.title}
      lead={`”${m.excerpt}”`}
      meta={
        <>
          <span className="font-semibold text-foreground">
            {m.name}
            {m.age ? `, ${m.age}` : ""}
          </span>
          <span>{formatDate(locale, m.date)}</span>
          <ReadingTime minutes={story.readingMinutes} label={dict.common.minRead} />
        </>
      }
      aside={
        <>
          <Photo
            query={m.photoQuery}
            orientation="portrait"
            sizes="(min-width: 1024px) 22rem, 100vw"
            alt={m.photo}
            brief={m.photo}
            briefLabel={dict.common.photoLabel}
            tint={m.color}
            className="aspect-[4/5]"
          />
          <p className="flex gap-3 rounded-2xl bg-muted p-5 text-[0.95rem]">
            <ShieldCheck aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-secondary" />
            <span lang={story.fallback ? "sv" : undefined}>{m.consent}</span>
          </p>
        </>
      }
    >
      <MdxContent source={story.body} />
      <TalkCta locale={locale} dict={dict} className="mt-14" />
    </ArticleLayout>
  );
}

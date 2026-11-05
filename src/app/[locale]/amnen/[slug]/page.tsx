import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { localePath, locales } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { resolveLocale } from "@/i18n/resolve";
import { getEntry, getSlugs, getTopics, type TopicMeta } from "@/lib/content";
import { formatDate } from "@/lib/format";
import { buildMetadata, JsonLd } from "@/lib/seo";
import { site } from "@/lib/site";
import { MdxContent } from "@/components/mdx/mdx-content";
import { ArticleLayout } from "@/components/sections/article-layout";
import { TopicHero } from "@/components/sections/topic-hero";
import { EmergencyBox, TalkCta } from "@/components/sections/callouts";

export const dynamicParams = false;

export function generateStaticParams() {
  return locales.flatMap((locale) => getSlugs("topics").map((slug) => ({ locale, slug })));
}

export async function generateMetadata({ params }: PageProps<"/[locale]/amnen/[slug]">): Promise<Metadata> {
  const locale = await resolveLocale(params);
  const { slug } = await params;
  const topic = getEntry<TopicMeta>("topics", locale, slug);
  if (!topic) return {};
  return buildMetadata({
    locale,
    path: `/amnen/${slug}`,
    title: topic.meta.title,
    description: topic.meta.description,
    type: "article",
  });
}

export default async function TopicPage({ params }: PageProps<"/[locale]/amnen/[slug]">) {
  const locale = await resolveLocale(params);
  const { slug } = await params;
  const dict = await getDictionary(locale);
  const topic = getEntry<TopicMeta>("topics", locale, slug);
  if (!topic) notFound();

  const related = getTopics(locale).filter((t) => topic.meta.related?.includes(t.slug));

  return (
    <>
      <ArticleLayout
        dict={dict}
        backHref={localePath(locale, "/amnen")}
        backLabel={dict.common.allTopics}
        lang={topic.fallback ? "sv" : undefined}
        fallback={topic.fallback}
        title={topic.meta.title}
        hero={
          <TopicHero
            title={topic.meta.title}
            lead={topic.meta.description}
            lang={topic.fallback ? "sv" : undefined}
            photoQuery={topic.meta.photoQuery}
            tint={topic.meta.color}
            meta={[
              {
                label: locale === "sv" ? "Läsning" : "Reading",
                value: `${topic.readingMinutes} min`,
              },
              {
                label: locale === "sv" ? "Uppdaterad" : "Updated",
                value: formatDate(locale, topic.meta.updated),
              },
            ]}
          />
        }
        aside={
          <>
            <TalkCta locale={locale} dict={dict} className="p-6 sm:p-7 [&_h2]:text-2xl" />
            {related.length > 0 && (
              <nav aria-labelledby="related-title" className="rounded-[1.75rem] bg-card p-6 ring-1 ring-border">
                <h2 id="related-title" className="text-lg font-bold">
                  {locale === "sv" ? "Relaterade ämnen" : "Related topics"}
                </h2>
                <ul className="mt-3 space-y-1">
                  {related.map((r) => (
                    <li key={r.slug}>
                      <Link
                        href={localePath(locale, `/amnen/${r.slug}`)}
                        className="inline-flex min-h-10 items-center font-semibold text-secondary hover:underline"
                      >
                        {r.meta.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            )}
          </>
        }
      >
        <MdxContent source={topic.body} />
        <EmergencyBox dict={dict} className="mt-12" />
      </ArticleLayout>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: topic.meta.title,
          description: topic.meta.description,
          dateModified: topic.meta.updated,
          inLanguage: topic.fallback ? "sv-SE" : locale,
          publisher: { "@id": `${site.url}/#organization` },
          mainEntityOfPage: `${site.url}${localePath(locale, `/amnen/${slug}`)}`,
        }}
      />
    </>
  );
}

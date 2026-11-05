import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { localePath, locales } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { resolveLocale } from "@/i18n/resolve";
import { getEntry, getSlugs, type NewsMeta } from "@/lib/content";
import { formatDate } from "@/lib/format";
import { buildMetadata, JsonLd } from "@/lib/seo";
import { site } from "@/lib/site";
import { MdxContent } from "@/components/mdx/mdx-content";
import { ArticleLayout } from "@/components/sections/article-layout";

export const dynamicParams = false;

export function generateStaticParams() {
  return locales.flatMap((locale) => getSlugs("news").map((slug) => ({ locale, slug })));
}

export async function generateMetadata({ params }: PageProps<"/[locale]/nyheter/[slug]">): Promise<Metadata> {
  const locale = await resolveLocale(params);
  const { slug } = await params;
  const item = getEntry<NewsMeta>("news", locale, slug);
  if (!item) return {};
  return buildMetadata({
    locale,
    path: `/nyheter/${slug}`,
    title: item.meta.title,
    description: item.meta.description,
    type: "article",
  });
}

export default async function NewsArticlePage({ params }: PageProps<"/[locale]/nyheter/[slug]">) {
  const locale = await resolveLocale(params);
  const { slug } = await params;
  const dict = await getDictionary(locale);
  const item = getEntry<NewsMeta>("news", locale, slug);
  if (!item) notFound();

  return (
    <>
      <ArticleLayout
        dict={dict}
        backHref={localePath(locale, "/nyheter")}
        backLabel={dict.common.allNews}
        lang={item.fallback ? "sv" : undefined}
        fallback={item.fallback}
        eyebrow={<span className="text-sm font-semibold text-secondary">{item.meta.tag}</span>}
        title={item.meta.title}
        lead={item.meta.description}
        meta={
          <span>
            {dict.common.published} <time dateTime={item.meta.date}>{formatDate(locale, item.meta.date)}</time>
          </span>
        }
      >
        <MdxContent source={item.body} />
      </ArticleLayout>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "NewsArticle",
          headline: item.meta.title,
          description: item.meta.description,
          datePublished: item.meta.date,
          publisher: { "@id": `${site.url}/#organization` },
        }}
      />
    </>
  );
}

import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import { localePath, type Locale } from "@/i18n/config";
import { resolveLocale } from "@/i18n/resolve";
import { getNews } from "@/lib/content";
import { formatDate } from "@/lib/format";
import { buildMetadata } from "@/lib/seo";
import { PageHeader } from "@/components/sections/page-header";
import { Container, Section } from "@/components/sections/primitives";

const copy = {
  sv: { title: "Nyheter", eyebrow: "Senaste nytt", lead: "Det senaste från föreningen – nya verksamheter, pressmeddelanden och rapporter." },
  en: { title: "News", eyebrow: "Latest", lead: "The latest from the association – new activities, press releases and reports." },
} satisfies Record<Locale, unknown>;

export async function generateMetadata({ params }: PageProps<"/[locale]/nyheter">): Promise<Metadata> {
  const locale = await resolveLocale(params);
  return buildMetadata({ locale, path: "/nyheter", title: copy[locale].title, description: copy[locale].lead });
}

export default async function NewsPage({ params }: PageProps<"/[locale]/nyheter">) {
  const locale = await resolveLocale(params);
  const t = copy[locale];
  const news = getNews(locale);

  return (
    <>
      <PageHeader title={t.title} lead={t.lead} tint="sky" />
      <Section className="pt-0" aria-label={t.title}>
        <Container>
          <ul className="divide-y divide-border rounded-[2rem] bg-card ring-1 ring-border">
            {news.map((item) => (
              <li key={item.slug}>
                <Link
                  href={localePath(locale, `/nyheter/${item.slug}`)}
                  className="group grid gap-2 p-6 sm:grid-cols-[10rem_1fr_auto] sm:items-center sm:gap-6 sm:p-8"
                >
                  <span className="text-muted-foreground">
                    <time dateTime={item.meta.date}>{formatDate(locale, item.meta.date)}</time>
                  </span>
                  <span>
                    <span className="text-sm font-semibold text-secondary">{item.meta.tag}</span>
                    <span className="mt-1 block font-heading text-xl font-bold group-hover:underline sm:text-2xl">
                      {item.meta.title}
                    </span>
                    <span className="mt-1 block text-muted-foreground">{item.meta.description}</span>
                  </span>
                  <ArrowRight aria-hidden="true" className="hidden size-6 sm:block" />
                </Link>
              </li>
            ))}
          </ul>
        </Container>
      </Section>
    </>
  );
}

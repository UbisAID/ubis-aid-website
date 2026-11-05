import type { Metadata } from "next";
import type { Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { resolveLocale } from "@/i18n/resolve";
import { getTopics } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";
import { PageHeader } from "@/components/sections/page-header";
import { Container, Section, plain } from "@/components/sections/primitives";
import { TopicIndex } from "@/components/home/topic-index";
import { TalkCta } from "@/components/sections/callouts";

const copy = {
  sv: {
    title: "Läs i din *takt*",
    eyebrow: "Ämnen",
    lead: "Korta, lättlästa texter om sådant som många unga går igenom. Du är inte ensam om att känna så här.",
  },
  en: {
    title: "Read at your *pace*",
    eyebrow: "Topics",
    lead: "Short, easy-to-read texts about things many young people go through. You're not the only one who feels this way.",
  },
} satisfies Record<Locale, unknown>;

export async function generateMetadata({ params }: PageProps<"/[locale]/amnen">): Promise<Metadata> {
  const locale = await resolveLocale(params);
  return buildMetadata({ locale, path: "/amnen", title: copy[locale].title, description: copy[locale].lead });
}

export default async function TopicsPage({ params }: PageProps<"/[locale]/amnen">) {
  const locale = await resolveLocale(params);
  const dict = await getDictionary(locale);
  const t = copy[locale];
  const topics = getTopics(locale);

  return (
    <>
      <PageHeader title={t.title} lead={t.lead} tint="lavender" />
      <Section className="pt-12 sm:pt-16" aria-label={plain(t.title)}>
        <Container>
          <h2 className="sr-only">{plain(t.title)}</h2>
          <TopicIndex topics={topics} locale={locale} minReadLabel={dict.common.minRead} />
          <TalkCta locale={locale} dict={dict} className="mt-16" />
        </Container>
      </Section>
    </>
  );
}

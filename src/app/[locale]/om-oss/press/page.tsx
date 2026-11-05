import Link from "next/link";
import type { Metadata } from "next";
import { Download, Mail, Phone } from "lucide-react";
import { localePath, type Locale } from "@/i18n/config";
import { resolveLocale } from "@/i18n/resolve";
import { getNews } from "@/lib/content";
import { formatDate } from "@/lib/format";
import { buildMetadata } from "@/lib/seo";
import { site } from "@/lib/site";
import { PageHeader } from "@/components/sections/page-header";
import { Container, Section, SectionHeading } from "@/components/sections/primitives";

const copy = {
  sv: {
    title: "Press",
    eyebrow: "För media",
    lead: "Här hittar du pressmeddelanden, fakta om föreningen och logotyper. Vi ställer gärna upp med experter och, med samtycke, unga som vill berätta.",
    contactTitle: "Presskontakt",
    contactText: "Vi svarar oftast samma dag.",
    releasesTitle: "Pressmeddelanden",
    factsTitle: "Fakta i korthet",
    facts: [
      `Ideell förening grundad ${site.foundedYear}, säte i ${site.city}.`,
      "Ger gratis, anonymt stöd till unga 13–25 år via chatt, sms, mejl och telefon.",
      "Gruppverksamhet i Stockholm, Göteborg, Malmö, Uppsala och digitalt.",
      "Cirka 420 utbildade volontärer (platshållare).",
    ],
    assetsTitle: "Logotyp och bilder",
    logo: "Logotyp (PNG)",
    note: "När du skriver om unga som har det svårt: undvik detaljer som kan identifiera personer och hänvisa gärna till var man kan få stöd.",
  },
  en: {
    title: "Press",
    eyebrow: "For media",
    lead: "Here you'll find press releases, facts about the association and logos. We're happy to provide experts and, with consent, young people who want to share their story.",
    contactTitle: "Press contact",
    contactText: "We usually reply the same day.",
    releasesTitle: "Press releases",
    factsTitle: "Quick facts",
    facts: [
      `Non-profit association founded in ${site.foundedYear}, based in ${site.city}.`,
      "Free, anonymous support for ages 13–25 via chat, text, email and phone.",
      "Group activities in Stockholm, Gothenburg, Malmö, Uppsala and online.",
      "Around 420 trained volunteers (placeholder).",
    ],
    assetsTitle: "Logo and images",
    logo: "Logo (PNG)",
    note: "When writing about young people in difficulty: avoid identifying details and consider pointing readers to where they can get support.",
  },
} satisfies Record<Locale, unknown>;

export async function generateMetadata({ params }: PageProps<"/[locale]/om-oss/press">): Promise<Metadata> {
  const locale = await resolveLocale(params);
  return buildMetadata({ locale, path: "/om-oss/press", title: copy[locale].title, description: copy[locale].lead });
}

export default async function PressPage({ params }: PageProps<"/[locale]/om-oss/press">) {
  const locale = await resolveLocale(params);
  const t = copy[locale];
  const releases = getNews(locale).filter((n) => n.meta.press);

  return (
    <>
      <PageHeader title={t.title} lead={t.lead} tint="sky" />
      <Section aria-label={t.title} className="pt-0">
        <Container className="grid gap-10 lg:grid-cols-[1.4fr_1fr]">
          <div>
            <SectionHeading id="releases-title" title={t.releasesTitle} />
            <ul className="mt-8 divide-y divide-border rounded-[1.75rem] bg-card ring-1 ring-border">
              {releases.map((r) => (
                <li key={r.slug}>
                  <Link href={localePath(locale, `/nyheter/${r.slug}`)} className="block p-6 hover:bg-muted/50">
                    <time dateTime={r.meta.date} className="text-sm text-muted-foreground">
                      {formatDate(locale, r.meta.date)}
                    </time>
                    <span className="mt-1 block font-heading text-xl font-bold">{r.meta.title}</span>
                    <span className="mt-1 block text-muted-foreground">{r.meta.description}</span>
                  </Link>
                </li>
              ))}
            </ul>
            <h2 className="mt-14 text-2xl font-extrabold">{t.factsTitle}</h2>
            <ul className="mt-4 list-disc space-y-2 pl-6 text-lg marker:text-primary">
              {t.facts.map((f) => (
                <li key={f}>{f}</li>
              ))}
            </ul>
          </div>
          <div className="space-y-4">
            <section aria-labelledby="press-contact" className="rounded-[1.75rem] bg-peach p-7">
              <h2 id="press-contact" className="text-xl font-bold">
                {t.contactTitle}
              </h2>
              <p className="mt-1">{t.contactText}</p>
              <p className="mt-4 flex items-center gap-2">
                <Mail aria-hidden="true" className="size-5" />
                <a href={`mailto:${site.contact.pressEmail}`} className="font-semibold underline underline-offset-4">
                  {site.contact.pressEmail}
                </a>
              </p>
              <p className="mt-2 flex items-center gap-2">
                <Phone aria-hidden="true" className="size-5" />
                <a href={`tel:${site.contact.phoneHref}`} className="font-semibold underline underline-offset-4">
                  {site.contact.phone}
                </a>
              </p>
            </section>
            <section aria-labelledby="assets-title" className="rounded-[1.75rem] bg-card p-7 ring-1 ring-border">
              <h2 id="assets-title" className="text-xl font-bold">
                {t.assetsTitle}
              </h2>
              <a
                href="/brand/ubis-aid-logo.png"
                download
                className="mt-4 inline-flex min-h-11 items-center gap-2 rounded-full bg-muted px-4 font-semibold hover:bg-border"
              >
                <Download aria-hidden="true" className="size-4" />
                {t.logo}
              </a>
              <p className="mt-5 text-[0.95rem] text-muted-foreground">{t.note}</p>
            </section>
          </div>
        </Container>
      </Section>
    </>
  );
}

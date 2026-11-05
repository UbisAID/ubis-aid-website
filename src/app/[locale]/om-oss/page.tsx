import Link from "next/link";
import type { Metadata } from "next";
import { Download, FileText, Mail, Newspaper, ScrollText } from "lucide-react";
import { localePath, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { resolveLocale } from "@/i18n/resolve";
import { getData, tr, type Person, type Report } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";
import { site } from "@/lib/site";
import { withBase } from "@/lib/base-path";
import { PageHeader } from "@/components/sections/page-header";
import { Container, Section, SectionHeading } from "@/components/sections/primitives";
import { Photo } from "@/components/sections/photo";
import { TrustBadges } from "@/components/sections/trust-badges";

const copy = {
  sv: {
    title: "Om *oss*",
    eyebrow: `Ideell förening sedan ${site.foundedYear}`,
    lead: "Vi finns för att ingen ung person ska behöva vara ensam med det som är svårt. Vi erbjuder öppet, gratis och anonymt stöd till barn och unga 13–25 år.",
    photoAlt: "Medarbetare och unga i föreningens lokal, samlade runt ett bord.",
    missionTitle: "Vårt uppdrag",
    mission: [
      { title: "Vision", text: "Ett samhälle där alla unga har minst en vuxen som lyssnar." },
      { title: "Uppdrag", text: "Vi ger öppet socialt stöd till unga som har det svårt – genom samtal, grupper och aktiviteter – och delar kunskap med de vuxna som möter dem." },
      { title: "Så arbetar vi", text: "Lågtröskligt och på ungas villkor. Inga krav, inga köer, inga journaler. Ungas egna röster styr hur vi utvecklas." },
    ],
    valuesTitle: "Våra värderingar",
    values: ["Vi lyssnar utan att döma", "Den unga bestämmer takten", "Trygghet går före allt", "Vi är ärliga – även när det är svårt"],
    teamTitle: "Medarbetare",
    boardTitle: "Styrelse",
    boardLead: "Styrelsen väljs av årsmötet. Minst en plats är reserverad för en ungdomsrepresentant under 26 år.",
    docsTitle: "Styrdokument och redovisning",
    bylaws: "Stadgar",
    bylawsText: "Föreningens stadgar, antagna på årsmötet.",
    reportsTitle: "Årsredovisningar",
    download: "Ladda ner",
    pressTitle: "Press",
    pressText: "Pressmeddelanden, bilder och kontakt för media.",
    pressCta: "Till pressrummet",
    orgTitle: "Föreningsuppgifter",
    org: [
      ["Namn", site.name],
      ["Org.nr", site.orgNumber],
      ["Länsäte", site.county],
      ["Kommunsäte", site.city],
    ],
  },
  en: {
    title: "About *us*",
    eyebrow: `Non-profit association since ${site.foundedYear}`,
    lead: "We exist so that no young person has to be alone with what's hard. We offer open, free and anonymous support to children and young people aged 13–25.",
    photoAlt: "Staff and young people in the association's space, gathered around a table.",
    missionTitle: "Our mission",
    mission: [
      { title: "Vision", text: "A society where every young person has at least one adult who listens." },
      { title: "Mission", text: "We provide open social support to young people who are struggling – through conversations, groups and activities – and share knowledge with the adults who meet them." },
      { title: "How we work", text: "Low threshold and on young people's terms. No requirements, no queues, no records. Young people's own voices guide how we develop." },
    ],
    valuesTitle: "Our values",
    values: ["We listen without judging", "The young person sets the pace", "Safety comes first", "We're honest – even when it's hard"],
    teamTitle: "Staff",
    boardTitle: "Board",
    boardLead: "The board is elected by the annual meeting. At least one seat is reserved for a youth representative under 26.",
    docsTitle: "Governance and reporting",
    bylaws: "Bylaws",
    bylawsText: "The association's bylaws, adopted at the annual meeting.",
    reportsTitle: "Annual reports",
    download: "Download",
    pressTitle: "Press",
    pressText: "Press releases, images and media contact.",
    pressCta: "Go to the press room",
    orgTitle: "Association details",
    org: [
      ["Name", site.name],
      ["Reg. no.", site.orgNumber],
      ["County", site.county],
      ["Municipality", site.city],
    ],
  },
} satisfies Record<Locale, unknown>;

function initials(name: string) {
  const clean = name.replace(/[[\]]/g, "");
  return clean
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export async function generateMetadata({ params }: PageProps<"/[locale]/om-oss">): Promise<Metadata> {
  const locale = await resolveLocale(params);
  return buildMetadata({ locale, path: "/om-oss", title: copy[locale].title, description: copy[locale].lead });
}

export default async function AboutPage({ params }: PageProps<"/[locale]/om-oss">) {
  const locale = await resolveLocale(params);
  const dict = await getDictionary(locale);
  const t = copy[locale];
  const team = getData<Person[]>("team");
  const board = getData<Person[]>("board");
  const reports = getData<Report[]>("reports").sort((a, b) => b.year - a.year);
  const tints = ["bg-peach", "bg-sage", "bg-lavender", "bg-butter", "bg-sky"];

  return (
    <>
      <PageHeader
        title={t.title}
        lead={t.lead}
        tint="butter"
        aside={<Photo query="community group around table warm" alt={t.photoAlt} tint="butter" className="aspect-[4/3]" priority />}
      />

      <Section labelledBy="mission-title" className="pt-4">
        <Container>
          <SectionHeading id="mission-title" title={t.missionTitle} />
          <ul className="mt-10 grid gap-4 md:grid-cols-3">
            {t.mission.map((m, i) => (
              <li key={m.title} className={`rounded-[1.75rem] p-7 ${tints[i]}`}>
                <h3 className="text-2xl font-extrabold">{m.title}</h3>
                <p className="mt-3 text-lg">{m.text}</p>
              </li>
            ))}
          </ul>
          <h3 className="mt-14 text-2xl font-extrabold">{t.valuesTitle}</h3>
          <ul className="mt-5 flex flex-wrap gap-3">
            {t.values.map((v) => (
              <li key={v} className="rounded-full bg-card px-5 py-3 text-lg font-semibold ring-1 ring-border">
                {v}
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      <Section labelledBy="team-title" className="bg-muted/60">
        <Container>
          <SectionHeading id="team-title" title={t.teamTitle} />
          <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {team.map((p, i) => (
              <li key={`${p.name}-${i}`} className="flex gap-4 rounded-[1.75rem] bg-card p-6 ring-1 ring-border">
                <span
                  aria-hidden="true"
                  className={`grid size-16 shrink-0 place-items-center rounded-full font-heading text-xl font-extrabold ${tints[i % tints.length]}`}
                >
                  {initials(p.name) || "?"}
                </span>
                <div className="min-w-0">
                  <h3 className="text-lg font-bold">{p.name}</h3>
                  <p className="font-semibold text-secondary">{tr(p.role, locale)}</p>
                  {p.text && <p className="mt-1 text-muted-foreground">{tr(p.text, locale)}</p>}
                  {p.email && (
                    <a href={`mailto:${p.email}`} className="mt-2 inline-flex items-center gap-1.5 text-[0.95rem] break-all underline underline-offset-4">
                      <Mail aria-hidden="true" className="size-4 shrink-0" />
                      {p.email}
                    </a>
                  )}
                </div>
              </li>
            ))}
          </ul>

          <h2 id="board-title" className="mt-20 text-3xl font-extrabold sm:text-4xl">
            {t.boardTitle}
          </h2>
          <p className="mt-3 max-w-2xl text-lg text-muted-foreground">{t.boardLead}</p>
          <ul className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {board.map((p, i) => (
              <li key={`${p.name}-${i}`} className="rounded-2xl bg-card px-5 py-4 ring-1 ring-border">
                <p className="font-bold">{p.name}</p>
                <p className="text-muted-foreground">{tr(p.role, locale)}</p>
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      <Section id="arsredovisningar" labelledBy="docs-title">
        <Container className="grid gap-10 lg:grid-cols-[1.4fr_1fr]">
          <div>
            <SectionHeading id="docs-title" title={t.docsTitle} />
            <Link
              href={localePath(locale, "/om-oss/stadgar")}
              className="mt-8 flex items-center gap-4 rounded-[1.5rem] bg-card p-5 ring-1 ring-border hover:shadow-md"
            >
              <ScrollText aria-hidden="true" className="size-8 shrink-0 text-primary" />
              <span>
                <span className="block text-lg font-bold">{t.bylaws}</span>
                <span className="block text-muted-foreground">{t.bylawsText}</span>
              </span>
            </Link>
            <h3 className="mt-10 text-xl font-bold">{t.reportsTitle}</h3>
            <ul className="mt-4 divide-y divide-border rounded-[1.5rem] bg-card ring-1 ring-border">
              {reports.map((r) => (
                <li key={r.year} className="flex items-center justify-between gap-4 p-5">
                  <span className="flex items-center gap-3">
                    <FileText aria-hidden="true" className="size-6 shrink-0 text-secondary" />
                    <span className="font-semibold">{tr(r.title, locale)}</span>
                  </span>
                  <a
                    href={withBase(r.file)}
                    download
                    className="inline-flex min-h-11 shrink-0 items-center gap-2 rounded-full bg-muted px-4 font-semibold hover:bg-border"
                  >
                    <Download aria-hidden="true" className="size-4" />
                    {t.download}
                    <span className="sr-only">
                      {" "}
                      {tr(r.title, locale)} ({r.size})
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div className="space-y-4">
            <section aria-labelledby="org-title" className="rounded-[1.75rem] bg-sage p-7">
              <h2 id="org-title" className="text-xl font-bold">
                {t.orgTitle}
              </h2>
              <dl className="mt-4 space-y-3">
                {t.org.map(([k, v]) => (
                  <div key={k}>
                    <dt className="text-sm font-semibold text-secondary">{k}</dt>
                    <dd>{v}</dd>
                  </div>
                ))}
              </dl>
            </section>
            <TrustBadges dict={dict} />
            <Link
              href={localePath(locale, "/om-oss/press")}
              className="flex items-center gap-4 rounded-[1.75rem] bg-card p-6 ring-1 ring-border hover:shadow-md"
            >
              <Newspaper aria-hidden="true" className="size-8 shrink-0 text-primary" />
              <span>
                <span className="block text-lg font-bold">{t.pressTitle}</span>
                <span className="block text-muted-foreground">{t.pressText}</span>
              </span>
            </Link>
          </div>
        </Container>
      </Section>
    </>
  );
}

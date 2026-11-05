import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import type { Metadata } from "next";
import { localePath, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { resolveLocale } from "@/i18n/resolve";
import { getStories, getTopics } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";
import { site } from "@/lib/site";
import { ButtonLink } from "@/components/ui/button";
import {
  Container,
  Rich,
  Section,
  SectionHeading,
} from "@/components/sections/primitives";
import { PhotoCredits } from "@/components/sections/photo";
import { SupportChannels } from "@/components/sections/support-channels";
import { EmergencyBox } from "@/components/sections/callouts";
import { ImpactStats } from "@/components/sections/impact-stats";
import { HeroShapes } from "@/components/home/hero-shapes";
import { AudienceBento, type BentoTile } from "@/components/home/audience-bento";
import { TopicIndex } from "@/components/home/topic-index";
import { StoryPhotoCard } from "@/components/home/story-photo-card";


type Copy = {
  metaTitle: string;
  h1: string;
  lead: string;
  ctaTalk: string;
  ctaDonate: string;
  promise: string;
  heroAlts: [string, string];
  chatTonight: string;
  ticker: string[];
  statement: string;
  principles: { title: string; text: string }[];
  audienceTitle: string;
  audienceLead: string;
  audience: [BentoTile, BentoTile, BentoTile, BentoTile];
  audiencePhotoAlt: string;
  supportTitle: string;
  supportLead: string;
  topicsTitle: string;
  topicsLead: string;
  allTopics: string;
  testTitle: string;
  testMeta: string;
  testCta: string;
  impactTitle: string;
  impactNote: string;
  stats: { value: number; suffix?: string; label: string }[];
  storiesTitle: string;
  allStories: string;
  donateTitle: string;
  donateText: string;
  donateCta: string;
  volunteerTitle: string;
  volunteerText: string;
  volunteerCta: string;
  photoCredit: string;
};

const years = new Date().getFullYear() - site.foundedYear;

const copy: Record<Locale, Copy> = {
  sv: {
    metaTitle: "Du är inte ensam – stöd för unga 13–25",
    h1: "Du är inte *ensam.*",
    lead: "Vad du än går igenom – hemma, i skolan eller inuti dig – kan du prata med oss. Vi lyssnar, utan att döma.",
    ctaTalk: "Prata med oss",
    ctaDonate: "Stötta oss",
    promise: "Gratis · Anonymt · Vi för inget vidare",
    heroAlts: ["Unga som pratar i en trappa.", "En tonåring som ler utomhus."],
    chatTonight: `Chatt varje kväll ${site.hours.chatLabel}`,
    ticker: [
      "Gratis",
      "Anonymt",
      "Utan krav",
      `Chatt alla dagar ${site.hours.chatLabel}`,
      "Sms, mejl och telefon",
      "Du bestämmer vad du berättar",
    ],
    statement: "Ingen ung ska behöva vara *ensam* med det som är svårt.",
    principles: [
      { title: "Gratis", text: "Det kostar ingenting." },
      { title: "Anonymt", text: "Du behöver aldrig säga vem du är." },
      { title: "Vi för inget vidare", text: "Om inte ett liv är i fara – och då pratar vi med dig först." },
    ],
    audienceTitle: "Vem är *du?*",
    audienceLead: "Välj det som passar dig bäst, så hittar du rätt snabbare.",
    audience: [
      { href: "/unga", eyebrow: "13–19 år", title: "För dig som är ung", text: "Stöd, ämnen och träffar för dig som går i skolan." },
      { href: "/unga-vuxna", eyebrow: "Unga vuxna", title: "När vuxenlivet blev tungt", text: "Flytt, ensamhet, jobb och familj som fortfarande gör ont.", figure: "18–25" },
      { href: "/vuxna", eyebrow: "Förälder, skola, kommun", title: "Vuxna som möter unga", text: "Råd, utbildningar och samarbeten." },
      { href: "/engagera-dig", eyebrow: "Volontär, medlem, givare", title: "Engagera dig", text: "Bli en del av det som gör skillnad." },
    ],
    audiencePhotoAlt: "Tonåringar som skrattar tillsammans utomhus.",
    supportTitle: "Välj hur du vill *prata*",
    supportLead: "Du behöver inte ha ett stort problem för att höra av dig. Allt som känns jobbigt är värt att prata om.",
    topicsTitle: "Vad handlar *det* om?",
    topicsLead: "Korta texter om det många unga går igenom. Läs i din egen takt.",
    allTopics: "Alla ämnen",
    testTitle: "Hur mår du *hemma?*",
    testMeta: "Självtest · 8 frågor · 2 minuter · Inget sparas",
    testCta: "Gör testet",
    impactTitle: "Varje samtal *räknas*",
    impactNote: "Siffrorna är platshållare och uppdateras med verkliga data.",
    stats: [
      { value: 12400, suffix: "+", label: "unga har fått stöd" },
      { value: 18600, label: "timmar samtal och chatt" },
      { value: 420, label: "volontärer i hela landet" },
      { value: years, label: "år av verksamhet" },
    ],
    storiesTitle: "Med *egna* ord",
    allStories: "Alla berättelser",
    donateTitle: "Håll chatten *öppen*",
    donateText: "300 kronor räcker till ungefär en kväll av chattstöd för en ung person.",
    donateCta: "Ge en gåva",
    volunteerTitle: "Bli *volontär*",
    volunteerText: "Du behöver inte vara expert. Vi utbildar dig och finns med hela vägen.",
    volunteerCta: "Läs mer och anmäl dig",
    photoCredit: "Foto",
  },
  en: {
    metaTitle: "You are not alone – support for young people 13–25",
    h1: "You are not *alone.*",
    lead: "Whatever you're going through – at home, at school or inside – you can talk to us. We listen, without judging.",
    ctaTalk: "Talk to us",
    ctaDonate: "Support us",
    promise: "Free · Anonymous · We don't pass it on",
    heroAlts: ["Young people talking on a staircase.", "A teenager smiling outdoors."],
    chatTonight: `Chat every night ${site.hours.chatLabel}`,
    ticker: [
      "Free",
      "Anonymous",
      "No requirements",
      `Chat every day ${site.hours.chatLabel}`,
      "Text, email and phone",
      "You decide what to share",
    ],
    statement: "No young person should be *alone* with what's hard.",
    principles: [
      { title: "Free", text: "It costs nothing." },
      { title: "Anonymous", text: "You never have to say who you are." },
      { title: "We don't pass it on", text: "Unless a life is in danger – and then we talk to you first." },
    ],
    audienceTitle: "Who are *you?*",
    audienceLead: "Choose what fits you best and you'll find the right place faster.",
    audience: [
      { href: "/unga", eyebrow: "Ages 13–19", title: "For young people", text: "Support, topics and meet-ups while you're at school." },
      { href: "/unga-vuxna", eyebrow: "Young adults", title: "When adult life got heavy", text: "Moving out, loneliness, work and a family that still hurts.", figure: "18–25" },
      { href: "/vuxna", eyebrow: "Parent, school, municipality", title: "Adults who meet young people", text: "Advice, training and partnerships." },
      { href: "/engagera-dig", eyebrow: "Volunteer, member, donor", title: "Get involved", text: "Be part of what makes a difference." },
    ],
    audiencePhotoAlt: "Teenagers laughing together outdoors.",
    supportTitle: "Choose how you want to *talk*",
    supportLead: "You don't need a big problem to reach out. Anything that feels hard is worth talking about.",
    topicsTitle: "What's *it* about?",
    topicsLead: "Short texts about things many young people go through. Read at your own pace.",
    allTopics: "All topics",
    testTitle: "How are things at *home?*",
    testMeta: "Self-test · 8 questions · 2 minutes · Nothing stored",
    testCta: "Take the test",
    impactTitle: "Every conversation *counts*",
    impactNote: "These figures are placeholders and will be updated with real data.",
    stats: [
      { value: 12400, suffix: "+", label: "young people supported" },
      { value: 18600, label: "hours of talks and chat" },
      { value: 420, label: "volunteers across Sweden" },
      { value: years, label: "years of work" },
    ],
    storiesTitle: "In their *own* words",
    allStories: "All stories",
    donateTitle: "Keep the chat *open*",
    donateText: "SEK 300 covers roughly one evening of chat support for a young person.",
    donateCta: "Give a gift",
    volunteerTitle: "Become a *volunteer*",
    volunteerText: "You don't need to be an expert. We train you and support you all the way.",
    volunteerCta: "Read more and sign up",
    photoCredit: "Photos",
  },
};

export async function generateMetadata({ params }: PageProps<"/[locale]">): Promise<Metadata> {
  const locale = await resolveLocale(params);
  const dict = await getDictionary(locale);
  return {
    ...buildMetadata({ locale, path: "/", title: copy[locale].metaTitle, description: dict.meta.description }),
    title: { absolute: `${site.name} – ${copy[locale].metaTitle}` },
  };
}

export default async function HomePage({ params }: PageProps<"/[locale]">) {
  const locale = await resolveLocale(params);
  const dict = await getDictionary(locale);
  const t = copy[locale];
  const topics = getTopics(locale);
  const stories = getStories(locale).slice(0, 3);

  return (
    <>
      {/* Hero */}
      <Container className="grid items-center gap-12 pt-10 pb-14 sm:pt-16 lg:grid-cols-[1.15fr_1fr] lg:gap-16 lg:pt-20 lg:pb-20">
        <div>
          <h1 className="text-[clamp(3.25rem,9vw,7rem)] leading-[0.95] font-extrabold tracking-[-0.045em]">
            <Rich text={t.h1} accentClassName="pr-2" />
          </h1>
          <p className="mt-7 max-w-xl text-xl text-ink/80 sm:text-2xl sm:leading-snug">{t.lead}</p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <ButtonLink href={localePath(locale, "/prata-med-oss")} size="lg">
              {t.ctaTalk}
              <ArrowRight aria-hidden="true" />
            </ButtonLink>
            <ButtonLink href={localePath(locale, "/stod-oss")} size="lg" variant="outline">
              {t.ctaDonate}
            </ButtonLink>
          </div>
          <p className="mt-7 text-[0.95rem] font-semibold text-secondary">{t.promise}</p>
        </div>
        <HeroShapes alts={t.heroAlts} tonight={t.chatTonight} />
      </Container>

      {/* Promise strip */}
      <div className="border-y border-ink/10 bg-ink py-4 text-white">
        <Container>
          <ul className="flex flex-wrap items-center justify-center gap-x-5 gap-y-1 text-center sm:gap-x-3 text-base font-semibold sm:text-lg">
            {t.ticker.map((item, i) => (
              <li key={item} className="flex items-center gap-3">
                {i > 0 && (
                  <span aria-hidden="true" className="hidden text-white/50 sm:inline">
                    ·
                  </span>
                )}
                {item}
              </li>
            ))}
          </ul>
        </Container>
      </div>

      {/* Statement */}
      <Section labelledBy="statement-title">
        <Container>
          <h2
            id="statement-title"
            className="max-w-5xl text-[clamp(2rem,4.6vw,3.9rem)] leading-[1.08] font-bold tracking-[-0.03em]"
          >
            <Rich text={t.statement} />
          </h2>
          <ol className="mt-14 grid border-t border-ink/15 md:grid-cols-3">
            {t.principles.map((p) => (
              <li
                key={p.title}
                className="border-b border-ink/15 py-7 md:border-b-0 md:py-8 md:pr-8 md:not-first:border-l md:not-first:pl-8"
              >
                <h3 className="text-2xl font-bold">{p.title}</h3>
                <p className="mt-2 text-muted-foreground">{p.text}</p>
              </li>
            ))}
          </ol>
        </Container>
      </Section>

      {/* Audience paths */}
      <Section labelledBy="audience-title" className="pt-0">
        <Container>
          <SectionHeading
            id="audience-title"
            title={t.audienceTitle}
            lead={t.audienceLead}
          />
          <div className="mt-12">
            <AudienceBento tiles={t.audience} locale={locale} photoAlt={t.audiencePhotoAlt} />
          </div>
        </Container>
      </Section>

      {/* Get support – inset dark panel */}
      <div className="px-3 sm:px-4">
        <section
          aria-labelledby="support-title"
          className="mx-auto max-w-[90rem] rounded-[2.5rem] bg-ink py-16 text-white sm:py-24"
        >
          <Container>
            <SectionHeading
              id="support-title"
              title={t.supportTitle}
              lead={t.supportLead}
              tone="dark"
            />
            <div className="mt-12">
              <SupportChannels locale={locale} dict={dict} tone="dark" />
            </div>
            <p className="mt-8 max-w-3xl text-white/75">{dict.trust.confidentialNote}</p>
            <EmergencyBox dict={dict} className="mt-8 text-foreground" />
          </Container>
        </section>
      </div>

      {/* Topics – editorial index */}
      <Section labelledBy="topics-title">
        <Container className="grid gap-12 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.4fr)] lg:gap-20">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <SectionHeading
              id="topics-title"
              title={t.topicsTitle}
              lead={t.topicsLead}
            />
            {/* Self-test: a quiet serif invitation rather than another card */}
            <Link href={localePath(locale, "/sjalvtest")} className="group mt-12 block border-t-2 border-ink pt-6">
              <span className="text-sm font-semibold text-muted-foreground">{t.testMeta}</span>
              <span className="mt-3 block font-serif text-5xl leading-[1.02] sm:text-6xl">
                <Rich text={t.testTitle} />
              </span>
              <span className="mt-6 inline-flex items-center gap-2 border-b-2 border-primary pb-1 text-lg font-semibold transition-[gap] duration-300 group-hover:gap-3">
                {t.testCta}
                <ArrowUpRight aria-hidden="true" className="size-5 text-primary" />
              </span>
            </Link>
          </div>
          <div>
            <TopicIndex topics={topics} locale={locale} minReadLabel={dict.common.minRead} />
            <ButtonLink href={localePath(locale, "/amnen")} variant="soft" className="mt-8">
              {t.allTopics}
              <ArrowRight aria-hidden="true" />
            </ButtonLink>
          </div>
        </Container>
      </Section>

      {/* Impact */}
      <Section labelledBy="impact-title" className="bg-butter/60">
        <Container>
          <SectionHeading id="impact-title" title={t.impactTitle} />
          <div className="mt-14">
            <ImpactStats stats={t.stats} locale={locale === "sv" ? "sv-SE" : "en-GB"} tone="light" />
          </div>
          <p className="mt-10 text-sm text-muted-foreground">{t.impactNote}</p>
        </Container>
      </Section>

      {/* Stories */}
      <Section labelledBy="stories-title">
        <Container>
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <SectionHeading id="stories-title" title={t.storiesTitle} />
            <ButtonLink href={localePath(locale, "/berattelser")} variant="soft">
              {t.allStories}
              <ArrowUpRight aria-hidden="true" />
            </ButtonLink>
          </div>
          <ul className="mt-12 grid gap-4 md:grid-cols-3">
            {stories.map((story) => (
              <li key={story.slug}>
                <StoryPhotoCard story={story} locale={locale} roleLabel={dict.storyRoles[story.meta.role]} />
              </li>
            ))}
          </ul>
          <PhotoCredits
            photos={stories.map((s) => ({ query: s.meta.photoQuery, orientation: "portrait" as const }))}
            label={t.photoCredit}
            className="mt-4"
          />
        </Container>
      </Section>

      {/* Activities */}

      {/* Engage */}
      <Section aria-label={`${t.donateCta} / ${t.volunteerCta}`} className="pt-4 pb-0 sm:pb-0">
        <Container className="grid gap-4 md:grid-cols-[1.2fr_1fr]">
          <div className="relative flex min-h-80 flex-col overflow-hidden rounded-[2.5rem] bg-primary p-8 text-white sm:p-12">
            <div aria-hidden="true" className="absolute -right-24 -bottom-24 size-80 rounded-full bg-white/10" />
            <div aria-hidden="true" className="absolute right-16 -bottom-40 size-80 rounded-full bg-white/10" />
            <h2 className="relative text-4xl font-extrabold tracking-[-0.03em] sm:text-5xl">
              <Rich text={t.donateTitle} accentClassName="text-butter" />
            </h2>
            <p className="relative mt-4 max-w-md text-lg text-white/90">{t.donateText}</p>
            <ButtonLink
              href={localePath(locale, "/stod-oss")}
              size="lg"
              variant="soft"
              className="relative mt-auto self-start"
            >
              {t.donateCta}
            </ButtonLink>
          </div>
          <div className="flex min-h-80 flex-col rounded-[2.5rem] bg-sage p-8 sm:p-12">
            <h2 className="text-4xl font-extrabold tracking-[-0.03em] sm:text-5xl">
              <Rich text={t.volunteerTitle} accentClassName="text-secondary" />
            </h2>
            <p className="mt-4 max-w-md text-lg">{t.volunteerText}</p>
            <ButtonLink
              href={localePath(locale, "/engagera-dig")}
              size="lg"
              variant="secondary"
              className="mt-auto self-start"
            >
              {t.volunteerCta}
            </ButtonLink>
          </div>
        </Container>
      </Section>
    </>
  );
}

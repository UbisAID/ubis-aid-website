import type { Metadata } from "next";
import { Compass, FileText, HeartPulse, Wallet } from "lucide-react";
import { localePath, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { resolveLocale } from "@/i18n/resolve";
import { buildMetadata } from "@/lib/seo";
import { ButtonLink } from "@/components/ui/button";
import { PageHeader } from "@/components/sections/page-header";
import { Container, Section, SectionHeading } from "@/components/sections/primitives";
import { Photo } from "@/components/sections/photo";
import { SupportChannels, TrustPills } from "@/components/sections/support-channels";
import { EmergencyBox } from "@/components/sections/callouts";
import { PromptLinks, type Prompt } from "@/components/sections/prompt-links";


const copy = {
  sv: {
    title: "När vuxenlivet blev *tyngre* än du trodde",
    eyebrow: "För dig som är 18–25 år",
    lead: "Att bli vuxen är inte en rak linje. Flytta hemifrån, hitta jobb, hantera ensamhet eller en familj som fortfarande gör ont – du behöver inte göra det själv.",
    talk: "Prata med oss",
    photoAlt: "En ung vuxen sitter vid ett fönster med en kopp te.",
    promptsTitle: "Känner du igen dig?",
    prompts: [
      { text: "Jag har flyttat och känner mig ensam", href: "/amnen/ensamhet", tint: "butter" },
      { text: "Familjen gör fortfarande ont", href: "/amnen/hemma", tint: "peach" },
      { text: "Jag orkar inte med vardagen", href: "/amnen/psykisk-halsa", tint: "lavender" },
      { text: "Min partner kontrollerar mig", href: "/amnen/vald", tint: "sky" },
      { text: "Jag vet inte vad jag vill med livet", href: "/amnen/identitet", tint: "sage" },
      { text: "Jag hoppade av och skäms", href: "/amnen/skola", tint: "butter" },
    ] satisfies Prompt[],
    helpTitle: "Vi kan hjälpa dig med det praktiska också",
    help: [
      { icon: FileText, title: "Myndighetskontakter", text: "Vi hjälper dig förstå brev och följer med på möten med till exempel socialtjänsten eller Försäkringskassan." },
      { icon: Wallet, title: "Ekonomi och boende", text: "Budget, skulder och bostadsfrågor – vi vet var du kan få hjälp." },
      { icon: HeartPulse, title: "Vård", text: "Vi hjälper dig hitta rätt vård och förbereda dig inför första besöket." },
      { icon: Compass, title: "Studier och jobb", text: "Komvux, folkhögskola eller första jobbet – vi bollar idéer och nästa steg." },
    ],
    supportTitle: "Prata med oss",
  },
  en: {
    title: "When adult life got *heavier* than you expected",
    eyebrow: "For you if you're 18–25",
    lead: "Becoming an adult isn't a straight line. Moving out, finding work, coping with loneliness or a family that still hurts – you don't have to do it alone.",
    talk: "Talk to us",
    photoAlt: "A young adult sitting by a window with a cup of tea.",
    promptsTitle: "Sound familiar?",
    prompts: [
      { text: "I've moved out and feel lonely", href: "/amnen/ensamhet", tint: "butter" },
      { text: "My family still hurts me", href: "/amnen/hemma", tint: "peach" },
      { text: "I can't cope with everyday life", href: "/amnen/psykisk-halsa", tint: "lavender" },
      { text: "My partner controls me", href: "/amnen/vald", tint: "sky" },
      { text: "I don't know what I want in life", href: "/amnen/identitet", tint: "sage" },
      { text: "I dropped out and feel ashamed", href: "/amnen/skola", tint: "butter" },
    ] satisfies Prompt[],
    helpTitle: "We can help with practical things too",
    help: [
      { icon: FileText, title: "Dealing with authorities", text: "We help you understand letters and come with you to meetings with social services or the Social Insurance Agency." },
      { icon: Wallet, title: "Money and housing", text: "Budgets, debt and housing – we know where to get help." },
      { icon: HeartPulse, title: "Healthcare", text: "We help you find the right care and prepare for your first visit." },
      { icon: Compass, title: "Studies and work", text: "Adult education, folk high school or a first job – we talk through ideas and next steps." },
    ],
    supportTitle: "Talk to us",
  },
} satisfies Record<Locale, unknown>;

export async function generateMetadata({ params }: PageProps<"/[locale]/unga-vuxna">): Promise<Metadata> {
  const locale = await resolveLocale(params);
  return buildMetadata({ locale, path: "/unga-vuxna", title: copy[locale].title, description: copy[locale].lead });
}

export default async function YoungAdultsPage({ params }: PageProps<"/[locale]/unga-vuxna">) {
  const locale = await resolveLocale(params);
  const dict = await getDictionary(locale);
  const t = copy[locale];

  return (
    <>
      <PageHeader
        title={t.title}
        lead={t.lead}
        tint="lavender"
        aside={<Photo query="young adult window tea thoughtful" alt={t.photoAlt} tint="lavender" className="aspect-[4/3]" priority />}
      >
        <div className="flex flex-col gap-3 sm:flex-row">
          <ButtonLink href={localePath(locale, "/prata-med-oss")} size="lg">
            {t.talk}
          </ButtonLink>
        </div>
        <TrustPills dict={dict} className="mt-6" />
      </PageHeader>

      <Section labelledBy="prompts-title" className="pt-4">
        <Container>
          <SectionHeading id="prompts-title" title={t.promptsTitle} />
          <div className="mt-10">
            <PromptLinks prompts={t.prompts} locale={locale} />
          </div>
        </Container>
      </Section>

      <Section labelledBy="help-title" className="bg-muted/60">
        <Container>
          <SectionHeading id="help-title" title={t.helpTitle} />
          <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {t.help.map(({ icon: Icon, title, text }) => (
              <li key={title} className="rounded-[1.75rem] bg-card p-6 ring-1 ring-border">
                <Icon aria-hidden="true" className="size-8 text-secondary" />
                <h3 className="mt-4 text-xl font-bold">{title}</h3>
                <p className="mt-2 text-muted-foreground">{text}</p>
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      <Section labelledBy="support-title">
        <Container>
          <SectionHeading id="support-title" title={t.supportTitle} />
          <div className="mt-10">
            <SupportChannels locale={locale} dict={dict} />
          </div>
        </Container>
      </Section>


      <Container>
        <EmergencyBox dict={dict} />
      </Container>
    </>
  );
}

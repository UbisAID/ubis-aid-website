import type { Metadata } from "next";
import { Scale } from "lucide-react";
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
    title: "Det är okej att inte må *okej*",
    eyebrow: "För dig som är 13–19 år",
    lead: "Du behöver inte ha ett stort problem för att få prata med någon. Hos oss är du anonym, och du bestämmer vad du vill berätta.",
    talk: "Prata med oss",
    test: "Gör självtestet",
    photoAlt: "Tonåringar som skrattar tillsammans utomhus.",
    promptsTitle: "Känner du igen dig?",
    promptsLead: "Välj det som ligger närmast. Där finns korta texter och tips.",
    prompts: [
      { text: "Det är bråk hemma", href: "/amnen/hemma", tint: "peach" },
      { text: "Jag mår dåligt och vet inte varför", href: "/amnen/psykisk-halsa", tint: "lavender" },
      { text: "Någon gör mig illa", href: "/amnen/vald", tint: "butter" },
      { text: "Någon är elak mot mig", href: "/amnen/mobbning", tint: "sky" },
      { text: "Skolan känns omöjlig", href: "/amnen/skola", tint: "sage" },
      { text: "Jag vet inte vem jag är", href: "/amnen/identitet", tint: "lavender" },
      { text: "Jag känner mig ensam", href: "/amnen/ensamhet", tint: "butter" },
    ] satisfies Prompt[],
    supportTitle: "Prata med oss",
    rightsTitle: "Dina rättigheter",
    rights: [
      "Barnkonventionen är svensk lag. Du har rätt att säga vad du tycker och bli lyssnad på.",
      "Du har rätt att vara skyddad mot våld, hot och kränkningar – hemma, i skolan och på nätet.",
      "Du kan själv kontakta socialtjänsten och be om hjälp, även utan att dina föräldrar vet om det först.",
    ],
  },
  en: {
    title: "It's okay not to be *okay*",
    eyebrow: "For you if you're 13–19",
    lead: "You don't need a big problem to talk to someone. With us you're anonymous, and you decide what to share.",
    talk: "Talk to us",
    test: "Take the self-test",
    photoAlt: "Teenagers laughing together outdoors.",
    promptsTitle: "Sound familiar?",
    promptsLead: "Pick the one closest to you. You'll find short texts and tips.",
    prompts: [
      { text: "There's fighting at home", href: "/amnen/hemma", tint: "peach" },
      { text: "I feel bad and don't know why", href: "/amnen/psykisk-halsa", tint: "lavender" },
      { text: "Someone is hurting me", href: "/amnen/vald", tint: "butter" },
      { text: "Someone is mean to me", href: "/amnen/mobbning", tint: "sky" },
      { text: "School feels impossible", href: "/amnen/skola", tint: "sage" },
      { text: "I don't know who I am", href: "/amnen/identitet", tint: "lavender" },
      { text: "I feel lonely", href: "/amnen/ensamhet", tint: "butter" },
    ] satisfies Prompt[],
    supportTitle: "Talk to us",
    rightsTitle: "Your rights",
    rights: [
      "The UN Convention on the Rights of the Child is Swedish law. You have the right to say what you think and be listened to.",
      "You have the right to be protected from violence, threats and abuse – at home, at school and online.",
      "You can contact social services yourself and ask for help, even without your parents knowing first.",
    ],
  },
} satisfies Record<Locale, unknown>;

export async function generateMetadata({ params }: PageProps<"/[locale]/unga">): Promise<Metadata> {
  const locale = await resolveLocale(params);
  return buildMetadata({ locale, path: "/unga", title: copy[locale].title, description: copy[locale].lead });
}

export default async function YouthPage({ params }: PageProps<"/[locale]/unga">) {
  const locale = await resolveLocale(params);
  const dict = await getDictionary(locale);
  const t = copy[locale];

  return (
    <>
      <PageHeader
        title={t.title}
        lead={t.lead}
        tint="peach"
        aside={<Photo query="teenagers laughing together outdoors" pick={1} alt={t.photoAlt} className="aspect-[4/3]" priority />}
      >
        <div className="flex flex-col gap-3 sm:flex-row">
          <ButtonLink href={localePath(locale, "/prata-med-oss")} size="lg">
            {t.talk}
          </ButtonLink>
          <ButtonLink href={localePath(locale, "/sjalvtest")} size="lg" variant="outline">
            {t.test}
          </ButtonLink>
        </div>
        <TrustPills dict={dict} className="mt-6" />
      </PageHeader>

      <Section labelledBy="prompts-title" className="pt-4">
        <Container>
          <SectionHeading id="prompts-title" title={t.promptsTitle} lead={t.promptsLead} />
          <div className="mt-10">
            <PromptLinks prompts={t.prompts} locale={locale} />
          </div>
        </Container>
      </Section>

      <Section labelledBy="support-title" className="bg-muted/60">
        <Container>
          <SectionHeading id="support-title" title={t.supportTitle} />
          <div className="mt-10">
            <SupportChannels locale={locale} dict={dict} />
          </div>
          <EmergencyBox dict={dict} className="mt-8" />
        </Container>
      </Section>


      <Container>
        <section aria-labelledby="rights-title" className="rounded-[2rem] bg-lavender p-8 sm:p-10">
          <Scale aria-hidden="true" className="size-9" />
          <h2 id="rights-title" className="mt-4 text-3xl font-extrabold">
            {t.rightsTitle}
          </h2>
          <ul className="mt-5 max-w-3xl list-disc space-y-3 pl-6 text-lg marker:text-primary">
            {t.rights.map((r) => (
              <li key={r}>{r}</li>
            ))}
          </ul>
        </section>
      </Container>
    </>
  );
}

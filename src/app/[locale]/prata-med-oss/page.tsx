import Link from "next/link";
import type { Metadata } from "next";
import { ShieldCheck } from "lucide-react";
import { localePath, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { resolveLocale } from "@/i18n/resolve";
import { buildMetadata, JsonLd } from "@/lib/seo";
import { site } from "@/lib/site";
import { Container, Section, SectionHeading } from "@/components/sections/primitives";
import { Photo } from "@/components/sections/photo";
import { PageHeader } from "@/components/sections/page-header";
import { SupportChannels, TrustPills } from "@/components/sections/support-channels";
import { EmergencyBox } from "@/components/sections/callouts";
import { Faq, faqJsonLd } from "@/components/sections/faq";
import { ChatLauncher } from "@/components/sections/chat-launcher";

const copy = {
  sv: {
    title: "Prata med *oss*",
    eyebrow: "Få stöd",
    lead: "Chatta, sms:a, mejla eller ring. Det är gratis, du är anonym och du bestämmer själv vad du vill berätta.",
    chatTitle: "Chatta med oss",
    chatText: "Chatten är det vanligaste sättet att prata med oss. Du skriver med en utbildad stödperson – en person, inte en robot.",
    chatHours: `Alla dagar kl. ${site.hours.chatLabel}`,
    photoAlt: "En ung person sitter med telefonen i soffan, avslappnad.",
    photoBrief: "Tonåring i soffa med telefon och filt, mjukt lampljus, vardagsrum som inte är perfekt städat.",
    channelsTitle: "Alla sätt att nå oss",
    stepsTitle: "Så går det till",
    steps: [
      { title: "Du hör av dig", text: "Skriv eller ring när det passar dig. Du behöver inte uppge namn eller förklara allt direkt." },
      { title: "En stödperson svarar", text: "Alla som svarar är utbildade och har handledning. Ibland får du vänta en stund – vi svarar så fort vi kan." },
      { title: "Ni pratar i din takt", text: "Du bestämmer vad ni pratar om. Du kan avsluta när du vill, och höra av dig igen en annan dag." },
    ],
    faqTitle: "Vanliga frågor",
    faq: [
      { q: "Kostar det något?", a: "Nej. Allt stöd är gratis. Samtal och sms till oss kostar ingenting och syns inte på telefonräkningen." },
      { q: "Måste jag säga vem jag är?", a: "Nej. Du är anonym. Vi frågar aldrig efter ditt namn, personnummer eller var du bor." },
      { q: "Berättar ni för mina föräldrar eller skolan?", a: "Nej. Det du berättar stannar hos oss. Bara om ditt eller någon annans liv är i fara kan vi behöva kontakta andra – och då pratar vi med dig först." },
      { q: "Vad gör jag om jag inte vet vad jag ska säga?", a: "Skriv bara ”hej”. Många börjar så. Vi hjälper dig att komma igång." },
      { q: "Vilka är det som svarar?", a: "Anställda stödsamordnare och utbildade volontärer. Alla har gått vår utbildning, har tystnadslöfte och får regelbunden handledning." },
      { q: "Kan jag prata på andra språk än svenska?", a: "Ja, vissa kvällar har vi stödpersoner som talar engelska, arabiska och somaliska. Skriv vilket språk du vill prata så försöker vi ordna det." },
    ],
    safeTitle: "Surfa tryggt",
    safeText: "Knappen ”Lämna sidan” längst ner till höger tar dig direkt till en neutral sida. Du kan också trycka Esc två gånger. Använd gärna ett privat fönster om du delar dator eller telefon med någon.",
    safeLink: "Så surfar du tryggt",
  },
  en: {
    title: "Talk to *us*",
    eyebrow: "Get support",
    lead: "Chat, text, email or call. It's free, you're anonymous and you decide what you want to share.",
    chatTitle: "Chat with us",
    chatText: "Chat is the most common way to talk to us. You write with a trained support person – a human, not a bot.",
    chatHours: `Every day ${site.hours.chatLabel}`,
    photoAlt: "A young person relaxing on a sofa with their phone.",
    photoBrief: "Teenager on a sofa with a phone and blanket, soft lamp light, a living room that isn't perfectly tidy.",
    channelsTitle: "All the ways to reach us",
    stepsTitle: "How it works",
    steps: [
      { title: "You reach out", text: "Write or call when it suits you. You don't have to give your name or explain everything at once." },
      { title: "A support person replies", text: "Everyone who replies is trained and supervised. Sometimes you'll wait a moment – we answer as soon as we can." },
      { title: "You talk at your pace", text: "You decide what to talk about. You can stop whenever you like and come back another day." },
    ],
    faqTitle: "Frequently asked questions",
    faq: [
      { q: "Does it cost anything?", a: "No. All support is free. Calls and texts to us cost nothing and don't show on the phone bill." },
      { q: "Do I have to say who I am?", a: "No. You're anonymous. We never ask for your name, ID number or where you live." },
      { q: "Will you tell my parents or school?", a: "No. What you tell us stays with us. Only if your life or someone else's is in danger might we need to contact others – and we talk to you first." },
      { q: "What if I don't know what to say?", a: "Just write “hi”. Lots of people start that way. We'll help you get going." },
      { q: "Who replies?", a: "Employed support coordinators and trained volunteers. Everyone has completed our training, has signed a confidentiality pledge and receives regular supervision." },
      { q: "Can I talk in languages other than Swedish?", a: "Yes, some evenings we have support staff who speak English, Arabic and Somali. Tell us which language you'd like and we'll try to arrange it." },
    ],
    safeTitle: "Browse safely",
    safeText: "The “Leave site” button at the bottom right takes you straight to a neutral page. You can also press Esc twice. Consider a private window if you share a computer or phone.",
    safeLink: "How to browse safely",
  },
} satisfies Record<Locale, unknown>;

export async function generateMetadata({ params }: PageProps<"/[locale]/prata-med-oss">): Promise<Metadata> {
  const locale = await resolveLocale(params);
  return buildMetadata({ locale, path: "/prata-med-oss", title: copy[locale].title, description: copy[locale].lead });
}

export default async function TalkPage({ params }: PageProps<"/[locale]/prata-med-oss">) {
  const locale = await resolveLocale(params);
  const dict = await getDictionary(locale);
  const t = copy[locale];

  return (
    <>
      <PageHeader title={t.title} lead={t.lead} tint="peach">
        <TrustPills dict={dict} />
      </PageHeader>

      <Container>
        <section
          id="chatt"
          aria-labelledby="chat-title"
          className="grid items-center gap-10 rounded-[2rem] bg-card p-7 shadow-sm ring-1 ring-border sm:p-10 lg:grid-cols-2"
        >
          <div>
            <h2
              id="chat-title"
              className="font-serif text-6xl leading-[0.95] font-normal tracking-normal sm:text-7xl lg:text-8xl"
            >
              {t.chatTitle}
            </h2>
            <p className="mt-4 mb-8 text-lg text-muted-foreground">{t.chatText}</p>
            <ChatLauncher
              chatUrl={site.chatUrl}
              labels={{ start: dict.channels.chat.action, hours: t.chatHours }}
            />
          </div>
          <Photo
            query="teenager on sofa with phone at home"
            alt={t.photoAlt}
            brief={t.photoBrief}
            briefLabel={dict.common.photoLabel}
            tint="sage"
            className="aspect-[4/3]"
          />
        </section>
      </Container>

      <Section id="kanaler" labelledBy="channels-title">
        <Container>
          <SectionHeading id="channels-title" title={t.channelsTitle} />
          <div className="mt-10">
            <SupportChannels locale={locale} dict={dict} />
          </div>
          <p className="mt-8 flex max-w-3xl gap-3 text-muted-foreground">
            <ShieldCheck aria-hidden="true" className="mt-1 size-5 shrink-0 text-secondary" />
            {dict.trust.confidentialNote}
          </p>
        </Container>
      </Section>

      <Section labelledBy="steps-title" className="bg-muted/60">
        <Container>
          <SectionHeading id="steps-title" title={t.stepsTitle} />
          <ol className="mt-10 grid gap-4 md:grid-cols-3">
            {t.steps.map((step, i) => (
              <li key={step.title} className="rounded-[1.75rem] bg-card p-7 ring-1 ring-border">
                <span
                  aria-hidden="true"
                  className="grid size-12 place-items-center rounded-full bg-primary font-heading text-xl font-extrabold text-white"
                >
                  {i + 1}
                </span>
                <h3 className="mt-5 text-xl font-bold">{step.title}</h3>
                <p className="mt-2 text-muted-foreground">{step.text}</p>
              </li>
            ))}
          </ol>
        </Container>
      </Section>

      <Section labelledBy="faq-title">
        <Container className="grid gap-10 lg:grid-cols-[1fr_1.4fr]">
          <div>
            <SectionHeading id="faq-title" title={t.faqTitle} />
            <div className="mt-8 rounded-[1.75rem] bg-lavender p-7">
              <h3 className="text-xl font-bold">{t.safeTitle}</h3>
              <p className="mt-2">{t.safeText}</p>
              <Link
                href={`${localePath(locale, "/integritetspolicy")}#surfa-tryggt`}
                className="mt-3 inline-block font-semibold text-secondary underline underline-offset-4"
              >
                {t.safeLink}
              </Link>
            </div>
          </div>
          <Faq items={t.faq} />
        </Container>
      </Section>

      <Container>
        <EmergencyBox dict={dict} />
      </Container>

      <JsonLd data={faqJsonLd(t.faq)} />
    </>
  );
}

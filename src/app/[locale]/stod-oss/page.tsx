import type { Metadata } from "next";
import { Building2, Flower2, Landmark, MessageCircle, Repeat, ScrollText, Smartphone, Users } from "lucide-react";
import { htmlLang, localePath, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { resolveLocale } from "@/i18n/resolve";
import { formatSek } from "@/lib/format";
import { buildMetadata, JsonLd } from "@/lib/seo";
import { site } from "@/lib/site";
import { ButtonLink } from "@/components/ui/button";
import { Container, Rich, Section, SectionHeading } from "@/components/sections/primitives";
import { TrustBadges } from "@/components/sections/trust-badges";
import { Faq, faqJsonLd } from "@/components/sections/faq";
import { DonateWidget, type DonateCopy } from "@/components/donate/donate-widget";

type Copy = {
  title: string;
  eyebrow: string;
  lead: string;
  points: string[];
  widget: DonateCopy;
  impactTitle: string;
  impact: { icon: typeof MessageCircle; amount: string; text: string }[];
  waysTitle: string;
  ways: { icon: typeof MessageCircle; title: string; text: string; href?: string; cta?: string }[];
  trustTitle: string;
  trustText: string;
  split: { label: string; value: number; color: string }[];
  splitNote: string;
  faqTitle: string;
  faq: { q: string; a: string }[];
};

const copy: Record<Locale, Copy> = {
  sv: {
    title: "Stötta *oss*",
    eyebrow: "Varje gåva gör skillnad",
    lead: "Din gåva gör att en ung person som har det svårt får någon att prata med – i kväll, i morgon och nästa vecka.",
    points: ["Gratis och anonymt stöd för unga 13–25", "Minst 75 % går till ändamålet"],
    widget: {
      title: "Ge en gåva",
      frequencyLabel: "Hur ofta vill du ge?",
      once: "En gång",
      monthly: "Varje månad",
      monthlyNudge: "Månadsgåvor hjälper oss planera långsiktigt.",
      amountLabel: "Välj belopp",
      popular: "Vanligast",
      custom: "Eller välj eget belopp",
      customHint: "Minst 50 kr.",
      perMonth: "/mån",
      impact: {
        "200": "räcker till ett långt chattsamtal med en ung person.",
        "300": "räcker till ungefär en kväll av chattstöd.",
        "600": "räcker till en gruppträff med mat för tio unga.",
      },
      impactCustom: "hjälper oss hålla stödet öppet för fler unga.",
      tributeToggle: "Ge gåvan som minnes- eller hyllningsgåva",
      tributeType: "Typ av gåva",
      memorial: "Minnesgåva",
      honour: "Hyllningsgåva",
      honoreeName: "Till minne av / för att hylla",
      tributeMessage: "Hälsning på gåvobeviset",
      recipientEmail: "Mottagarens e-post",
      recipientHint: "Vi mejlar ett gåvobevis. Lämna tomt om du vill få det själv.",
      methodLabel: "Betalsätt",
      swish: "Swish",
      card: "Kort",
      swishInstructions: "Öppna Swish-appen och skanna QR-koden. Beloppet och meddelandet fylls i automatiskt.",
      swishNumber: "Swish-nummer",
      swishMessage: "Meddelande",
      cardInstructions: "Du skickas till Stripes säkra betalsida. Vi ser aldrig ditt kortnummer.",
      cardButton: "Ge {amount} med kort",
      cardRedirecting: "Skickar dig till betalningen…",
      cardUnavailable: "Kortbetalning är inte aktiverad ännu. Använd Swish – tack!",
      cardError: "Något gick fel. Försök igen eller välj Swish.",
      monthlyMethods: "Månadsgåvor betalas med kort. Vill du hellre ge via autogiro? Mejla oss så skickar vi en blankett.",
      minAmount: "Välj eller skriv ett belopp på minst 50 kr.",
      secure: "Säker betalning med Stripe · Du kan avsluta månadsgåvan när du vill",
    },
    impactTitle: "Det här gör din gåva",
    impact: [
      { icon: MessageCircle, amount: "200 kr", text: "Ett långt chattsamtal där en ung person blir lyssnad på." },
      { icon: Users, amount: "600 kr", text: "En gruppträff med mat och samtal för tio unga." },
      { icon: Repeat, amount: "150 kr/mån", text: "Utbildning av en ny volontär under ett år." },
    ],
    waysTitle: "Fler sätt att ge",
    ways: [
      { icon: Smartphone, title: "Swish", text: `Swisha valfritt belopp till ${site.giving.swishNumber}.` },
      { icon: Landmark, title: "Plusgiro", text: `Plusgiro ${site.giving.plusgiro}.` },
      { icon: Flower2, title: "Minnes- och hyllningsgåvor", text: "Hedra någon du tycker om. Vi skickar ett fint gåvobevis till mottagaren." },
      { icon: ScrollText, title: "Testamente", text: "Skriv in föreningen i ditt testamente och gör skillnad för framtidens unga.", href: "mailto:info@ubisaid.se", cta: "Kontakta oss" },
      { icon: Building2, title: "Företag", text: "Partnerskap, julgåvor och anställdas engagemang.", href: "/foretag", cta: "Läs om företagssamarbeten" },
    ],
    trustTitle: "Trygg givare",
    trustText: `Vi är en ideell förening (org.nr ${site.orgNumber}) och granskas av Svensk Insamlingskontroll. Vi redovisar varje år hur pengarna används i vår årsredovisning och effektrapport.`,
    split: [
      { label: "Stöd till unga", value: 82, color: "bg-primary" },
      { label: "Insamling", value: 12, color: "bg-secondary" },
      { label: "Administration", value: 6, color: "bg-ink/40" },
    ],
    splitNote: "Fördelning 2025 (platshållare – uppdatera från årsredovisningen).",
    faqTitle: "Frågor om att ge",
    faq: [
      { q: "Får jag skattereduktion för min gåva?", a: "Om föreningen är godkänd gåvomottagare hos Skatteverket kan du få skattereduktion med 25 % av gåvobeloppet. Ange ditt personnummer när du ger så rapporterar vi det åt dig. (Platshållare – kontrollera status.)" },
      { q: "Hur avslutar jag min månadsgåva?", a: "Mejla oss eller använd länken i kvittot från Stripe. Du kan pausa eller avsluta när du vill, utan krångel." },
      { q: "Får jag ett kvitto?", a: "Ja. Vid kortbetalning får du kvitto direkt via e-post. För Swish och plusgiro skickar vi gärna ett tack om du anger din e-post i meddelandet." },
      { q: "Hur behandlar ni mina personuppgifter?", a: "Vi sparar bara det som behövs för att hantera din gåva och följa bokföringslagen. Vi säljer aldrig uppgifter. Läs mer i vår integritetspolicy." },
    ],
  },
  en: {
    title: "Support *us*",
    eyebrow: "Every gift makes a difference",
    lead: "Your gift means a young person who is struggling has someone to talk to – tonight, tomorrow and next week.",
    points: ["Free, anonymous support for ages 13–25", "At least 75% goes to the cause"],
    widget: {
      title: "Give a gift",
      frequencyLabel: "How often would you like to give?",
      once: "One time",
      monthly: "Monthly",
      monthlyNudge: "Monthly gifts help us plan long term.",
      amountLabel: "Choose an amount",
      popular: "Most common",
      custom: "Or choose your own amount",
      customHint: "At least SEK 50.",
      perMonth: "/month",
      impact: {
        "200": "covers a long chat conversation with a young person.",
        "300": "covers roughly one evening of chat support.",
        "600": "covers a group meeting with food for ten young people.",
      },
      impactCustom: "helps us keep support open for more young people.",
      tributeToggle: "Give as a memorial or tribute gift",
      tributeType: "Type of gift",
      memorial: "In memory",
      honour: "In honour",
      honoreeName: "In memory / honour of",
      tributeMessage: "Greeting on the gift certificate",
      recipientEmail: "Recipient's email",
      recipientHint: "We'll email a gift certificate. Leave empty to receive it yourself.",
      methodLabel: "Payment method",
      swish: "Swish",
      card: "Card",
      swishInstructions: "Open the Swish app and scan the QR code. Amount and message are filled in automatically.",
      swishNumber: "Swish number",
      swishMessage: "Message",
      cardInstructions: "You'll be sent to Stripe's secure payment page. We never see your card number.",
      cardButton: "Give {amount} by card",
      cardRedirecting: "Taking you to payment…",
      cardUnavailable: "Card payment isn't enabled yet. Please use Swish – thank you!",
      cardError: "Something went wrong. Try again or choose Swish.",
      monthlyMethods: "Monthly gifts are paid by card. Prefer direct debit (autogiro)? Email us and we'll send a form.",
      minAmount: "Choose or enter an amount of at least SEK 50.",
      secure: "Secure payment with Stripe · Cancel your monthly gift any time",
    },
    impactTitle: "What your gift does",
    impact: [
      { icon: MessageCircle, amount: "SEK 200", text: "A long chat where a young person is really listened to." },
      { icon: Users, amount: "SEK 600", text: "A group meeting with food and conversation for ten young people." },
      { icon: Repeat, amount: "SEK 150/month", text: "Training for one new volunteer over a year." },
    ],
    waysTitle: "More ways to give",
    ways: [
      { icon: Smartphone, title: "Swish", text: `Swish any amount to ${site.giving.swishNumber}.` },
      { icon: Landmark, title: "Plusgiro", text: `Plusgiro ${site.giving.plusgiro}.` },
      { icon: Flower2, title: "Memorial and tribute gifts", text: "Honour someone you care about. We send a lovely certificate to the recipient." },
      { icon: ScrollText, title: "Legacy gifts", text: "Include the association in your will and make a difference for future generations.", href: "mailto:info@ubisaid.se", cta: "Contact us" },
      { icon: Building2, title: "Companies", text: "Partnerships, Christmas gifts and employee engagement.", href: "/foretag", cta: "About corporate partnerships" },
    ],
    trustTitle: "Give with confidence",
    trustText: `We are a non-profit association (reg. no. ${site.orgNumber}) and is monitored by the Swedish Fundraising Control. Every year we report how the money is used in our annual and impact reports.`,
    split: [
      { label: "Support for young people", value: 82, color: "bg-primary" },
      { label: "Fundraising", value: 12, color: "bg-secondary" },
      { label: "Administration", value: 6, color: "bg-ink/40" },
    ],
    splitNote: "Breakdown 2025 (placeholder – update from the annual report).",
    faqTitle: "Questions about giving",
    faq: [
      { q: "Do I get a tax reduction?", a: "If the association is an approved gift recipient with the Swedish Tax Agency, Swedish taxpayers can get a 25% tax reduction. Give your personal ID number and we report it for you. (Placeholder – check status.)" },
      { q: "How do I cancel my monthly gift?", a: "Email us or use the link in your Stripe receipt. You can pause or cancel any time, no hassle." },
      { q: "Will I get a receipt?", a: "Yes. Card payments get an email receipt immediately. For Swish and plusgiro we're happy to send a thank-you if you include your email in the message." },
      { q: "How do you handle my personal data?", a: "We only store what's needed to handle your gift and meet bookkeeping rules. We never sell data. Read more in our privacy policy." },
    ],
  },
};

export async function generateMetadata({ params }: PageProps<"/[locale]/stod-oss">): Promise<Metadata> {
  const locale = await resolveLocale(params);
  return buildMetadata({ locale, path: "/stod-oss", title: copy[locale].title, description: copy[locale].lead });
}

export default async function DonatePage({ params }: PageProps<"/[locale]/stod-oss">) {
  const locale = await resolveLocale(params);
  const dict = await getDictionary(locale);
  const t = copy[locale];
  const presets = site.giving.presetAmounts;
  const formatted = Object.fromEntries(presets.map((p) => [String(p), formatSek(locale, p)]));

  return (
    <>
      <div className="relative overflow-hidden">
        <div aria-hidden="true" className="absolute -right-40 -bottom-56 hidden size-[36rem] rounded-full bg-peach lg:block" />
        <Container className="relative grid items-start gap-10 py-12 sm:py-16 lg:grid-cols-[1fr_28rem]">
          <div className="lg:pt-10">
            <h1 className="text-[clamp(3rem,7vw,5.5rem)] leading-[0.95] font-extrabold tracking-[-0.045em]">
              <Rich text={t.title} />
            </h1>
            <p className="mt-5 max-w-xl text-xl text-ink/80">{t.lead}</p>
            <ul className="mt-8 space-y-3">
              {t.points.map((p) => (
                <li key={p} className="flex items-center gap-3 text-lg">
                  <span aria-hidden="true" className="grid size-7 place-items-center rounded-full bg-sage text-secondary">
                    ✓
                  </span>
                  {p}
                </li>
              ))}
            </ul>
            <TrustBadges dict={dict} className="mt-10" />
          </div>
          <DonateWidget
            copy={t.widget}
            locale={htmlLang[locale]}
            presets={presets}
            swishNumber={site.giving.swishNumber}
            swishRaw={site.giving.swishRaw}
            formatSek={formatted}
          />
        </Container>
      </div>

      <Section labelledBy="impact-title">
        <Container>
          <SectionHeading id="impact-title" title={t.impactTitle} />
          <ul className="mt-10 grid gap-4 md:grid-cols-3">
            {t.impact.map(({ icon: Icon, amount, text }) => (
              <li key={amount} className="rounded-[1.75rem] bg-peach p-7">
                <Icon aria-hidden="true" className="size-8 text-primary" />
                <p className="mt-4 font-heading text-3xl font-extrabold">{amount}</p>
                <p className="mt-2 text-lg">{text}</p>
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      <Section labelledBy="ways-title" className="bg-muted/60">
        <Container>
          <SectionHeading id="ways-title" title={t.waysTitle} />
          <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {t.ways.map(({ icon: Icon, title, text, href, cta }) => (
              <li key={title} className="flex flex-col rounded-[1.75rem] bg-card p-6 ring-1 ring-border">
                <Icon aria-hidden="true" className="size-7 text-secondary" />
                <h3 className="mt-4 text-xl font-bold">{title}</h3>
                <p className="mt-2 text-muted-foreground">{text}</p>
                {href && cta && (
                  <ButtonLink
                    href={href.startsWith("/") ? localePath(locale, href) : href}
                    external={!href.startsWith("/")}
                    variant="soft"
                    className="mt-5 self-start"
                  >
                    {cta}
                  </ButtonLink>
                )}
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      <Section labelledBy="trust-title">
        <Container className="grid gap-10 lg:grid-cols-2">
          <div>
            <SectionHeading id="trust-title" title={t.trustTitle} lead={t.trustText} />
            <TrustBadges dict={dict} className="mt-8" />
          </div>
          <div className="rounded-[2rem] bg-card p-7 ring-1 ring-border sm:p-9">
            <div className="flex h-5 overflow-hidden rounded-full" aria-hidden="true">
              {t.split.map((s) => (
                <span key={s.label} className={s.color} style={{ width: `${s.value}%` }} />
              ))}
            </div>
            <ul className="mt-6 space-y-3">
              {t.split.map((s) => (
                <li key={s.label} className="flex items-center justify-between gap-4 text-lg">
                  <span className="flex items-center gap-3">
                    <span aria-hidden="true" className={`size-4 rounded-full ${s.color}`} />
                    {s.label}
                  </span>
                  <span className="font-heading font-extrabold">{s.value} %</span>
                </li>
              ))}
            </ul>
            <p className="mt-6 text-sm text-muted-foreground">{t.splitNote}</p>
          </div>
        </Container>
      </Section>

      <Section labelledBy="faq-title" className="pt-0">
        <Container className="grid gap-10 lg:grid-cols-[1fr_1.4fr]">
          <SectionHeading id="faq-title" title={t.faqTitle} />
          <Faq items={t.faq} />
        </Container>
      </Section>
      <JsonLd data={faqJsonLd(t.faq)} />
    </>
  );
}

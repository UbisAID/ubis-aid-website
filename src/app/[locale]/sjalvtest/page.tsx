import type { Metadata } from "next";
import { localePath, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { resolveLocale } from "@/i18n/resolve";
import { buildMetadata } from "@/lib/seo";
import { PageHeader } from "@/components/sections/page-header";
import { Container } from "@/components/sections/primitives";
import { EmergencyBox } from "@/components/sections/callouts";
import { SelfTest, type SelfTestCopy } from "@/components/self-test/self-test";

const copy: Record<Locale, { title: string; eyebrow: string; lead: string; test: SelfTestCopy }> = {
  sv: {
    title: "Hur mår du *hemma?*",
    eyebrow: "Anonymt självtest",
    lead: "Åtta korta frågor som hjälper dig sätta ord på hur du har det. Det finns inga rätt eller fel svar.",
    test: {
      introTitle: "Innan du börjar",
      introText: "Tänk på hur det har varit de senaste veckorna. Välj det svar som stämmer bäst. Testet tar ungefär två minuter.",
      privacy: "Testet är helt anonymt. Dina svar sparas inte och skickas ingenstans – de försvinner när du stänger sidan.",
      start: "Starta testet",
      progress: "Fråga {n} av {total}",
      back: "Tillbaka",
      next: "Nästa",
      showResult: "Visa resultat",
      options: ["Inte alls", "Ibland", "Ofta", "Nästan alltid"],
      questions: [
        { text: "Jag känner mig trygg när jag är hemma.", positive: true },
        { text: "Det är bråk eller hög stämning hemma." },
        { text: "Det finns en vuxen hemma som jag kan prata med när något är jobbigt.", positive: true },
        { text: "Jag oroar mig för någon i min familj." },
        { text: "Jag tar hand om saker hemma som vuxna borde ta hand om." },
        { text: "Jag vill helst inte gå hem efter skolan." },
        { text: "Någon hemma säger saker som får mig att må dåligt." },
        { text: "Jag har varit rädd för någon hemma.", safety: true },
      ],
      results: [
        {
          min: 0,
          title: "Det verkar fungera ganska bra hemma just nu",
          text: "Skönt att höra. Alla familjer har sina stunder, och det är okej att ibland ha det jobbigt ändå. Om något förändras, eller om du vill prata om något annat, finns vi här.",
        },
        {
          min: 7,
          title: "Det låter som att vissa saker är tunga hemma",
          text: "Det du känner är viktigt, även om det inte är kris. Många unga har det som du. Att prata med någon kan göra det lättare att förstå vad du behöver – och att det inte är ditt fel.",
        },
        {
          min: 15,
          title: "Det låter som att du har det riktigt tufft hemma",
          text: "Det är modigt av dig att göra det här testet. Du ska inte behöva bära det här ensam. Vi vill gärna höra hur du har det – du är anonym och bestämmer själv vad du berättar.",
        },
      ],
      safetyTitle: "Du har rätt att vara trygg",
      safetyText: "Du svarade att du har varit rädd för någon hemma. Om du är i fara just nu, ring 112. Annars – prata med oss eller med en vuxen du litar på. Vi kan hjälpa dig att hitta en väg framåt.",
      talk: "Prata med oss",
      topic: "Läs om problem hemma",
      restart: "Gör om testet",
      disclaimer: "Testet är ingen diagnos eller bedömning. Det är ett sätt att tänka kring hur du har det.",
    },
  },
  en: {
    title: "How are things at *home?*",
    eyebrow: "Anonymous self-test",
    lead: "Eight short questions to help you put words to how you're doing. There are no right or wrong answers.",
    test: {
      introTitle: "Before you start",
      introText: "Think about the last few weeks. Choose the answer that fits best. It takes about two minutes.",
      privacy: "The test is completely anonymous. Your answers are not stored or sent anywhere – they disappear when you close the page.",
      start: "Start the test",
      progress: "Question {n} of {total}",
      back: "Back",
      next: "Next",
      showResult: "Show result",
      options: ["Not at all", "Sometimes", "Often", "Almost always"],
      questions: [
        { text: "I feel safe when I'm at home.", positive: true },
        { text: "There are arguments or tension at home." },
        { text: "There's an adult at home I can talk to when something is hard.", positive: true },
        { text: "I worry about someone in my family." },
        { text: "I handle things at home that adults should be handling." },
        { text: "I'd rather not go home after school." },
        { text: "Someone at home says things that make me feel bad." },
        { text: "I have been afraid of someone at home.", safety: true },
      ],
      results: [
        {
          min: 0,
          title: "Things seem to be going fairly well at home right now",
          text: "Good to hear. Every family has its moments, and it's okay to find things hard sometimes anyway. If anything changes, or you want to talk about something else, we're here.",
        },
        {
          min: 7,
          title: "It sounds like some things are heavy at home",
          text: "What you feel matters, even if it isn't a crisis. Lots of young people feel like you. Talking to someone can help you understand what you need – and that it's not your fault.",
        },
        {
          min: 15,
          title: "It sounds like things are really hard at home",
          text: "It's brave of you to take this test. You shouldn't have to carry this alone. We'd like to hear how you're doing – you're anonymous and decide what to share.",
        },
      ],
      safetyTitle: "You have the right to be safe",
      safetyText: "You answered that you have been afraid of someone at home. If you are in danger right now, call 112. Otherwise – talk to us or an adult you trust. We can help you find a way forward.",
      talk: "Talk to us",
      topic: "Read about problems at home",
      restart: "Take the test again",
      disclaimer: "This test is not a diagnosis or assessment. It's a way to reflect on how you're doing.",
    },
  },
};

export async function generateMetadata({ params }: PageProps<"/[locale]/sjalvtest">): Promise<Metadata> {
  const locale = await resolveLocale(params);
  return buildMetadata({ locale, path: "/sjalvtest", title: copy[locale].title, description: copy[locale].lead });
}

export default async function SelfTestPage({ params }: PageProps<"/[locale]/sjalvtest">) {
  const locale = await resolveLocale(params);
  const dict = await getDictionary(locale);
  const t = copy[locale];

  return (
    <>
      <PageHeader title={t.title} lead={t.lead} tint="lavender" />
      <Container className="max-w-3xl">
        <SelfTest
          copy={t.test}
          talkHref={localePath(locale, "/prata-med-oss")}
          topicHref={localePath(locale, "/amnen/hemma")}
        />
        <EmergencyBox dict={dict} className="mt-10" />
      </Container>
    </>
  );
}

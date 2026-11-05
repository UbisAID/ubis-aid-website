import type { Metadata } from "next";
import { HeartHandshake } from "lucide-react";
import { localePath, type Locale } from "@/i18n/config";
import { resolveLocale } from "@/i18n/resolve";
import { buildMetadata } from "@/lib/seo";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/sections/primitives";

const copy = {
  sv: {
    title: "Tack för din gåva!",
    text: "Du har just gjort det möjligt för en ung person att få någon att prata med. Ett kvitto är på väg till din e-post.",
    share: "Berätta gärna för någon du känner att vi finns. Det kan betyda allt.",
    home: "Till startsidan",
    stories: "Läs berättelser",
  },
  en: {
    title: "Thank you for your gift!",
    text: "You've just made it possible for a young person to have someone to talk to. A receipt is on its way to your inbox.",
    share: "Tell someone you know that we exist. It can mean everything.",
    home: "Go to the home page",
    stories: "Read stories",
  },
} satisfies Record<Locale, unknown>;

export async function generateMetadata({ params }: PageProps<"/[locale]/stod-oss/tack">): Promise<Metadata> {
  const locale = await resolveLocale(params);
  return buildMetadata({ locale, path: "/stod-oss/tack", title: copy[locale].title, description: copy[locale].text, noIndex: true });
}

export default async function ThanksPage({ params }: PageProps<"/[locale]/stod-oss/tack">) {
  const locale = await resolveLocale(params);
  const t = copy[locale];
  return (
    <Container className="max-w-3xl py-20 text-center">
      <span className="mx-auto grid size-20 place-items-center rounded-full bg-peach">
        <HeartHandshake aria-hidden="true" className="size-10 text-primary" />
      </span>
      <h1 className="mt-8 text-4xl font-extrabold sm:text-6xl">{t.title}</h1>
      <p className="mt-5 text-xl">{t.text}</p>
      <p className="mt-3 text-lg text-muted-foreground">{t.share}</p>
      <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
        <ButtonLink href={localePath(locale)} size="lg">
          {t.home}
        </ButtonLink>
        <ButtonLink href={localePath(locale, "/berattelser")} size="lg" variant="soft">
          {t.stories}
        </ButtonLink>
      </div>
    </Container>
  );
}

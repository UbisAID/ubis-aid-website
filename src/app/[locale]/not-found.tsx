import { locale as rootLocale } from "next/root-params";
import { defaultLocale, isLocale, localePath } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/sections/primitives";

export default async function NotFound() {
  const value = await rootLocale();
  const locale = value && isLocale(value) ? value : defaultLocale;
  const dict = await getDictionary(locale);
  return (
    <Container className="max-w-3xl py-24 text-center">
      <p className="font-heading text-7xl font-extrabold text-primary">404</p>
      <h1 className="mt-6 text-4xl font-extrabold sm:text-5xl">{dict.notFound.title}</h1>
      <p className="mt-4 text-xl text-muted-foreground">{dict.notFound.text}</p>
      <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
        <ButtonLink href={localePath(locale)} size="lg">
          {dict.notFound.home}
        </ButtonLink>
        <ButtonLink href={localePath(locale, "/prata-med-oss")} size="lg" variant="soft">
          {dict.nav.talkToUs}
        </ButtonLink>
        <ButtonLink href={localePath(locale, "/amnen")} size="lg" variant="soft">
          {dict.nav.topics}
        </ButtonLink>
      </div>
    </Container>
  );
}

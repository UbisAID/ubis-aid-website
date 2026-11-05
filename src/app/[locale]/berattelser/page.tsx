import type { Metadata } from "next";
import { localePath, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { resolveLocale } from "@/i18n/resolve";
import { getStories } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";
import { PageHeader } from "@/components/sections/page-header";
import { Container, Section, plain } from "@/components/sections/primitives";
import { StoryPhotoCard } from "@/components/home/story-photo-card";
import { PhotoCredits } from "@/components/sections/photo";
import { ButtonLink } from "@/components/ui/button";

const copy = {
  sv: {
    title: "Med *egna* ord",
    eyebrow: "Berättelser",
    lead: "Unga, volontärer, föräldrar och personal berättar om hur det var – och hur det blev.",
    consentTitle: "Om samtycke",
    consent:
      "Alla berättelser publiceras med skriftligt samtycke. För unga under 18 har även vårdnadshavare godkänt när det behövs. Namn och detaljer är ofta ändrade, och vi visar aldrig bilder på de som berättar. Du kan när som helst be oss ta bort en berättelse.",
    shareTitle: "Vill du dela din berättelse?",
    shareText: "Din erfarenhet kan hjälpa någon annan att våga höra av sig. Vi hjälper dig att skriva, och du godkänner allt innan något publiceras.",
    shareCta: "Kontakta oss",
  },
  en: {
    title: "In their *own* words",
    eyebrow: "Stories",
    lead: "Young people, volunteers, parents and staff share what it was like – and how things turned out.",
    consentTitle: "About consent",
    consent:
      "Every story is published with written consent. For under-18s, a guardian has also approved where required. Names and details are often changed, and we never show photos of the storytellers. You can ask us to remove a story at any time.",
    shareTitle: "Want to share your story?",
    shareText: "Your experience could help someone else dare to reach out. We'll help you write it, and you approve everything before anything is published.",
    shareCta: "Contact us",
  },
} satisfies Record<Locale, unknown>;

export async function generateMetadata({ params }: PageProps<"/[locale]/berattelser">): Promise<Metadata> {
  const locale = await resolveLocale(params);
  return buildMetadata({ locale, path: "/berattelser", title: copy[locale].title, description: copy[locale].lead });
}

export default async function StoriesPage({ params }: PageProps<"/[locale]/berattelser">) {
  const locale = await resolveLocale(params);
  const dict = await getDictionary(locale);
  const t = copy[locale];
  const stories = getStories(locale);

  return (
    <>
      <PageHeader title={t.title} lead={t.lead} tint="butter" />
      <Section className="pt-12 sm:pt-16" aria-label={plain(t.title)}>
        <Container>
          <ul className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {stories.map((story) => (
              <li key={story.slug}>
                <StoryPhotoCard story={story} locale={locale} roleLabel={dict.storyRoles[story.meta.role]} />
              </li>
            ))}
          </ul>
          <PhotoCredits
            photos={stories.map((s) => ({ query: s.meta.photoQuery, orientation: "portrait" as const }))}
            label={locale === "sv" ? "Foto" : "Photos"}
            className="mt-4"
          />

          <div className="mt-16 grid gap-4 md:grid-cols-2">
            <section aria-labelledby="consent-title" className="rounded-[2rem] bg-sage p-8">
              <h2 id="consent-title" className="text-2xl font-extrabold">
                {t.consentTitle}
              </h2>
              <p className="mt-3">{t.consent}</p>
            </section>
            <section aria-labelledby="share-title" className="rounded-[2rem] bg-peach p-8">
              <h2 id="share-title" className="text-2xl font-extrabold">
                {t.shareTitle}
              </h2>
              <p className="mt-3">{t.shareText}</p>
              <ButtonLink href={localePath(locale, "/prata-med-oss")} className="mt-6">
                {t.shareCta}
              </ButtonLink>
            </section>
          </div>
        </Container>
      </Section>
    </>
  );
}

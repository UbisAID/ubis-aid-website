import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight, Building2, GraduationCap, HeartHandshake, Landmark, Phone } from "lucide-react";
import { localePath, type Locale } from "@/i18n/config";
import { resolveLocale } from "@/i18n/resolve";
import { buildMetadata } from "@/lib/seo";
import { site } from "@/lib/site";
import { PageHeader } from "@/components/sections/page-header";
import { Container, Section, SectionHeading } from "@/components/sections/primitives";
import { Photo } from "@/components/sections/photo";


const copy = {
  sv: {
    title: "För dig som *möter* unga",
    eyebrow: "Föräldrar, skola, socialtjänst och företag",
    lead: "Ni vuxna är ofta de första som märker att något är fel. Här finns råd, utbildningar och sätt att samarbeta med oss.",
    photoAlt: "En vuxen och en tonåring sitter bredvid varandra på en parkbänk och pratar.",
    pathsTitle: "Vem är du?",
    paths: [
      { icon: HeartHandshake, title: "Förälder eller anhörig", text: "Råd om att prata med din tonåring, och föräldraträffar.", href: "#prata", tint: "bg-peach" },
      { icon: GraduationCap, title: "Skolpersonal", text: "Föreläsningar för elever och utbildningar för personal.", href: "/for-yrkesverksamma", tint: "bg-sky" },
      { icon: Landmark, title: "Socialtjänst och kommun", text: "Samverkan, processtöd och öppna insatser för unga.", href: "/for-yrkesverksamma", tint: "bg-sage" },
      { icon: Building2, title: "Företag", text: "Partnerskap och CSR-samarbeten.", href: "/foretag", tint: "bg-butter" },
    ],
    talkTitle: "Så kan du prata med en ung person som har det svårt",
    talkTips: [
      { title: "Välj rätt stund", text: "Sida vid sida går ofta lättare än öga mot öga – i bilen, på en promenad, när ni lagar mat." },
      { title: "Lyssna mer än du pratar", text: "Fråga ”hur är det, på riktigt?” och stå ut med tystnaden. Undvik att direkt komma med lösningar." },
      { title: "Ta det på allvar", text: "Säg ”vad bra att du berättar”. Det som verkar litet för dig kan vara enormt för den unga." },
      { title: "Lova inte att hålla hemligt", text: "Om någon far illa kan du behöva agera. Säg det ärligt – och berätta vad du tänker göra." },
      { title: "Ta hand om dig själv", text: "Det är tungt att vara orolig. Du får också prata med oss om hur du har det." },
    ],
    worryTitle: "Orolig för ett barn eller en ung person?",
    worryText:
      "Alla kan göra en orosanmälan till socialtjänsten. Du behöver inte vara säker – det är socialtjänstens uppgift att utreda. Yrkesverksamma inom bland annat skola, vård och socialtjänst har anmälningsplikt. Är det akut, ring 112.",
    adultLine: "Vuxenlinjen",
    tipsPhotoAlt: "En förälder och en tonåring som promenerar bredvid varandra.",
    adultLineText: `Ring oss vardagar ${site.hours.phone.open}–${site.hours.phone.close} om du är orolig för en ung person.`,
  },
  en: {
    title: "For adults who *meet* young people",
    eyebrow: "Parents, schools, social services and companies",
    lead: "Adults are often the first to notice something is wrong. Here you'll find advice, training and ways to work with us.",
    photoAlt: "An adult and a teenager sitting side by side on a park bench, talking.",
    pathsTitle: "Who are you?",
    paths: [
      { icon: HeartHandshake, title: "Parent or relative", text: "Advice on talking with your teenager, and parent groups.", href: "#prata", tint: "bg-peach" },
      { icon: GraduationCap, title: "School staff", text: "Talks for students and training for staff.", href: "/for-yrkesverksamma", tint: "bg-sky" },
      { icon: Landmark, title: "Social services and municipalities", text: "Collaboration, process support and open services for young people.", href: "/for-yrkesverksamma", tint: "bg-sage" },
      { icon: Building2, title: "Companies", text: "Partnerships and CSR collaborations.", href: "/foretag", tint: "bg-butter" },
    ],
    talkTitle: "How to talk with a young person who is struggling",
    talkTips: [
      { title: "Pick the right moment", text: "Side by side is often easier than face to face – in the car, on a walk, while cooking." },
      { title: "Listen more than you talk", text: "Ask “how are you, really?” and sit with the silence. Avoid jumping to solutions." },
      { title: "Take it seriously", text: "Say “I'm glad you told me”. What seems small to you can be huge to them." },
      { title: "Don't promise secrecy", text: "If someone is at risk you may need to act. Say so honestly – and explain what you plan to do." },
      { title: "Look after yourself", text: "Worrying is heavy. You're welcome to talk to us about how you're doing too." },
    ],
    worryTitle: "Worried about a child or young person?",
    worryText:
      "Anyone can report a concern to social services. You don't need to be certain – it's their job to investigate. Professionals in schools, healthcare and social services have a duty to report. In an emergency, call 112.",
    adultLine: "Adult line",
    tipsPhotoAlt: "A parent and a teenager walking side by side.",
    adultLineText: `Call us on weekdays ${site.hours.phone.open}–${site.hours.phone.close} if you're worried about a young person.`,
  },
} satisfies Record<Locale, unknown>;

export async function generateMetadata({ params }: PageProps<"/[locale]/vuxna">): Promise<Metadata> {
  const locale = await resolveLocale(params);
  return buildMetadata({ locale, path: "/vuxna", title: copy[locale].title, description: copy[locale].lead });
}

export default async function AdultsPage({ params }: PageProps<"/[locale]/vuxna">) {
  const locale = await resolveLocale(params);
  const t = copy[locale];

  return (
    <>
      <PageHeader
        title={t.title}
        lead={t.lead}
        tint="sage"
        aside={<Photo query="parent and teenager talking on bench" alt={t.photoAlt} tint="sage" className="aspect-[4/3]" priority />}
      />

      <Section labelledBy="paths-title" className="pt-4">
        <Container>
          <SectionHeading id="paths-title" title={t.pathsTitle} />
          <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {t.paths.map(({ icon: Icon, title, text, href, tint }) => (
              <li key={title}>
                <Link
                  href={href.startsWith("#") ? href : localePath(locale, href)}
                  className={`group flex h-full flex-col rounded-[1.75rem] p-6 ${tint}`}
                >
                  <Icon aria-hidden="true" className="size-8" />
                  <span className="mt-4 font-heading text-xl font-bold">{title}</span>
                  <span className="mt-2 text-ink/80">{text}</span>
                  <ArrowRight aria-hidden="true" className="mt-auto size-6 self-end pt-1 transition-transform group-hover:translate-x-1" />
                </Link>
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      <Section id="prata" labelledBy="talk-title" className="bg-muted/60">
        <Container>
          <SectionHeading id="talk-title" title={t.talkTitle} className="max-w-4xl" />
          <div className="mt-12 grid gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:gap-16">
            {/* Exclusive accordion (native <details name>): one tip open at a time, after Zaro */}
            <ol className="border-t border-ink/15">
              {t.talkTips.map((tip, i) => (
                <li key={tip.title} className="border-b border-ink/15">
                  <details name="talk-tips" open={i === 0} className="group">
                    <summary className="flex cursor-pointer list-none items-baseline gap-5 py-6 [&::-webkit-details-marker]:hidden">
                      <span
                        aria-hidden="true"
                        className="w-10 shrink-0 font-serif text-4xl leading-none text-muted-foreground transition-colors group-open:text-primary sm:text-5xl"
                      >
                        {i + 1}
                      </span>
                      <span className="font-heading text-2xl font-bold tracking-[-0.02em] text-muted-foreground transition-colors group-open:text-ink group-hover:text-ink sm:text-3xl">
                        {tip.title}
                      </span>
                    </summary>
                    <p className="-mt-2 max-w-lg pb-7 pl-15 text-lg text-ink/80">{tip.text}</p>
                  </details>
                </li>
              ))}
            </ol>

            <div className="relative">
              <Photo
                query="parent and teenager walking together"
                orientation="portrait"
                alt={t.tipsPhotoAlt}
                tint="peach"
                sizes="(min-width: 1024px) 40vw, 100vw"
                className="aspect-[4/5] w-full"
                creditClassName="top-3 bottom-auto"
              />
              <div className="relative -mt-24 mx-4 rounded-[1.75rem] bg-card p-6 shadow-xl ring-1 ring-border sm:mx-8 sm:p-7">
                <p className="font-serif text-3xl leading-tight">{t.adultLine}</p>
                <p className="mt-2 text-muted-foreground">{t.adultLineText}</p>
                <a
                  href={`tel:${site.contact.phoneHref}`}
                  className="mt-4 inline-flex min-h-11 items-center gap-2 font-heading text-2xl font-extrabold text-secondary underline-offset-4 hover:underline"
                >
                  <Phone aria-hidden="true" className="size-5" />
                  {site.contact.phone}
                </a>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      <Section labelledBy="worry-title">
        <Container>
          <div className="rounded-[2rem] border-2 border-primary/30 bg-card p-8 sm:p-10">
            <h2 id="worry-title" className="text-3xl font-extrabold">
              {t.worryTitle}
            </h2>
            <p className="mt-4 max-w-3xl text-lg">{t.worryText}</p>
          </div>
        </Container>
      </Section>

    </>
  );
}

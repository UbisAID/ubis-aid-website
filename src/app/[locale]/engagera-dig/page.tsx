import type { Metadata } from "next";
import { BadgeCheck, GraduationCap, HandHeart, HeartHandshake, MessagesSquare, Users } from "lucide-react";
import { localePath, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { resolveLocale } from "@/i18n/resolve";
import { buildMetadata } from "@/lib/seo";
import { submitVolunteer } from "@/lib/forms/actions";
import { ButtonLink } from "@/components/ui/button";
import { PageHeader } from "@/components/sections/page-header";
import { Container, Section, SectionHeading } from "@/components/sections/primitives";
import { Photo } from "@/components/sections/photo";
import {
  ChoiceGroup,
  ConsentField,
  CheckboxField,
  FormShell,
  TextAreaField,
  TextField,
} from "@/components/forms/form-kit";

const copy = {
  sv: {
    title: "Engagera *dig*",
    eyebrow: "Bli en del av oss",
    lead: "Bli volontär, medlem eller givare. Oavsett hur mycket tid du har kan du göra skillnad för en ung person.",
    waysTitle: "Välj hur du vill bidra",
    ways: [
      { icon: MessagesSquare, title: "Volontär i chatten", text: "En kväll i veckan, hemifrån. Du får utbildning och handledning.", href: "#anmalan" },
      { icon: Users, title: "Gruppledare", text: "Var med och håll i gruppträffar och aktiviteter på någon av våra orter.", href: "#anmalan" },
      { icon: BadgeCheck, title: "Medlem", text: "Stötta föreningen och var med och påverka på årsmötet. 100 kr per år.", href: "#anmalan" },
      { icon: HandHeart, title: "Månadsgivare", text: "Ge en fast summa varje månad så kan vi planera långsiktigt.", href: "/stod-oss" },
    ],
    pathTitle: "Så blir du volontär",
    path: [
      { title: "Anmälan", text: "Fyll i formuläret nedan. Det tar fem minuter." },
      { title: "Samtal", text: "Vi ringer dig för ett kort samtal om dig och om uppdraget." },
      { title: "Utbildning", text: "Tre kvällar om samtalsmetodik, sekretess och självomsorg." },
      { title: "Handledning", text: "Du får regelbunden handledning och har alltid en kollega att vända dig till." },
    ],
    requirements: "Du behöver vara minst 20 år, ha tid ungefär fyra timmar i veckan och kunna visa utdrag ur belastningsregistret.",
    photoAlt: "En grupp volontärer i olika åldrar som skrattar runt ett bord med kaffe.",
    photoBrief: "Volontärer i olika åldrar och bakgrunder på en utbildningskväll, kaffe och post-it-lappar, äkta skratt.",
    formTitle: "Anmälan",
    formLead: "Vi hör av oss inom en vecka. Inget är bindande.",
    success: { title: "Tack för din anmälan!", text: "Vi har tagit emot dina uppgifter och hör av oss inom en vecka." },
    f: {
      kind: "Jag vill bli",
      kinds: [
        { value: "volontar", label: "Volontär", description: "Chatt, grupper eller aktiviteter" },
        { value: "medlem", label: "Medlem", description: "100 kr per år" },
        { value: "bada", label: "Både och" },
      ],
      name: "Namn",
      email: "E-post",
      phone: "Telefon",
      phoneHint: "Frivilligt. Vi ringer bara för att boka ett samtal.",
      city: "Ort",
      interests: "Vad är du intresserad av?",
      interestsHint: "Välj så många du vill.",
      interestOptions: [
        { value: "chatt", label: "Chatt och sms" },
        { value: "grupper", label: "Gruppträffar" },
        { value: "aktiviteter", label: "Aktiviteter och utflykter" },
        { value: "insamling", label: "Insamling och event" },
      ],
      adult: "Jag är 20 år eller äldre (krävs för volontärer).",
      message: "Berätta gärna lite om dig själv",
      submit: "Skicka anmälan",
    },
  },
  en: {
    title: "Get *involved*",
    eyebrow: "Join us",
    lead: "Become a volunteer, member or donor. Whatever time you have, you can make a difference for a young person.",
    waysTitle: "Choose how to contribute",
    ways: [
      { icon: MessagesSquare, title: "Chat volunteer", text: "One evening a week, from home. You get training and supervision.", href: "#anmalan" },
      { icon: Users, title: "Group leader", text: "Help run group meetings and activities in one of our cities.", href: "#anmalan" },
      { icon: BadgeCheck, title: "Member", text: "Support the association and have a say at the annual meeting. SEK 100 a year.", href: "#anmalan" },
      { icon: HandHeart, title: "Monthly donor", text: "Give a fixed amount each month so we can plan long term.", href: "/stod-oss" },
    ],
    pathTitle: "How to become a volunteer",
    path: [
      { title: "Sign up", text: "Fill in the form below. It takes five minutes." },
      { title: "Conversation", text: "We'll call you for a short chat about you and the role." },
      { title: "Training", text: "Three evenings on conversation skills, confidentiality and self-care." },
      { title: "Supervision", text: "You get regular supervision and always have a colleague to turn to." },
    ],
    requirements: "You need to be at least 20, have around four hours a week and be able to show a police record extract.",
    photoAlt: "A group of volunteers of different ages laughing around a table with coffee.",
    photoBrief: "Volunteers of different ages and backgrounds at a training evening, coffee and sticky notes, genuine laughter.",
    formTitle: "Sign up",
    formLead: "We'll get back to you within a week. Nothing is binding.",
    success: { title: "Thank you for signing up!", text: "We've received your details and will get back to you within a week." },
    f: {
      kind: "I want to become",
      kinds: [
        { value: "volontar", label: "Volunteer", description: "Chat, groups or activities" },
        { value: "medlem", label: "Member", description: "SEK 100 a year" },
        { value: "bada", label: "Both" },
      ],
      name: "Name",
      email: "Email",
      phone: "Phone",
      phoneHint: "Optional. We only call to book a conversation.",
      city: "City",
      interests: "What are you interested in?",
      interestsHint: "Choose as many as you like.",
      interestOptions: [
        { value: "chatt", label: "Chat and text" },
        { value: "grupper", label: "Group meetings" },
        { value: "aktiviteter", label: "Activities and trips" },
        { value: "insamling", label: "Fundraising and events" },
      ],
      adult: "I am 20 or older (required for volunteers).",
      message: "Tell us a bit about yourself",
      submit: "Send sign-up",
    },
  },
} satisfies Record<Locale, unknown>;

export async function generateMetadata({ params }: PageProps<"/[locale]/engagera-dig">): Promise<Metadata> {
  const locale = await resolveLocale(params);
  return buildMetadata({ locale, path: "/engagera-dig", title: copy[locale].title, description: copy[locale].lead });
}

export default async function EngagePage({ params }: PageProps<"/[locale]/engagera-dig">) {
  const locale = await resolveLocale(params);
  const dict = await getDictionary(locale);
  const t = copy[locale];
  const f = t.f;

  return (
    <>
      <PageHeader title={t.title} lead={t.lead} tint="butter">
        <div className="flex flex-col gap-3 sm:flex-row">
          <ButtonLink href="#anmalan" size="lg">
            {f.submit}
          </ButtonLink>
          <ButtonLink href={localePath(locale, "/stod-oss")} size="lg" variant="outline">
            {dict.nav.donate}
          </ButtonLink>
        </div>
      </PageHeader>

      <Section labelledBy="ways-title" className="pt-4">
        <Container>
          <SectionHeading id="ways-title" title={t.waysTitle} />
          <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {t.ways.map(({ icon: Icon, title, text, href }) => (
              <li key={title}>
                <a
                  href={href.startsWith("/") ? localePath(locale, href) : href}
                  className="flex h-full flex-col rounded-[1.75rem] bg-card p-6 ring-1 ring-border transition-shadow hover:shadow-md"
                >
                  <Icon aria-hidden="true" className="size-8 text-primary" />
                  <span className="mt-4 font-heading text-xl font-bold">{title}</span>
                  <span className="mt-2 text-muted-foreground">{text}</span>
                </a>
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      <Section labelledBy="path-title" className="bg-muted/60">
        <Container className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <SectionHeading id="path-title" title={t.pathTitle} />
            <ol className="mt-8 space-y-5">
              {t.path.map((step, i) => (
                <li key={step.title} className="flex gap-4">
                  <span
                    aria-hidden="true"
                    className="grid size-11 shrink-0 place-items-center rounded-full bg-secondary font-heading font-extrabold text-white"
                  >
                    {i + 1}
                  </span>
                  <div>
                    <h3 className="text-lg font-bold">{step.title}</h3>
                    <p className="text-muted-foreground">{step.text}</p>
                  </div>
                </li>
              ))}
            </ol>
            <p className="mt-8 flex gap-3 rounded-2xl bg-card p-5 ring-1 ring-border">
              <GraduationCap aria-hidden="true" className="mt-0.5 size-6 shrink-0 text-secondary" />
              {t.requirements}
            </p>
          </div>
          <Photo
            query="volunteers laughing around table"
            alt={t.photoAlt}
            brief={t.photoBrief}
            briefLabel={dict.common.photoLabel}
            tint="butter"
            className="aspect-[4/3]"
          />
        </Container>
      </Section>

      <Section id="anmalan" labelledBy="form-title">
        <Container className="grid gap-10 lg:grid-cols-[1fr_1.6fr]">
          <div>
            <HeartHandshake aria-hidden="true" className="size-10 text-primary" />
            <h2 id="form-title" className="mt-4 text-3xl font-extrabold sm:text-4xl">
              {t.formTitle}
            </h2>
            <p className="mt-3 text-lg text-muted-foreground">{t.formLead}</p>
          </div>
          <FormShell
            id="volunteer"
            action={submitVolunteer}
            locale={locale}
            labels={{ ...dict.forms, successTitle: t.success.title, successText: t.success.text }}
            submitLabel={f.submit}
            fieldLabels={{
              kind: f.kind,
              name: f.name,
              email: f.email,
              phone: f.phone,
              city: f.city,
              adult: f.adult,
              message: f.message,
              consent: dict.forms.consentLink,
            }}
          >
            <ChoiceGroup name="kind" legend={f.kind} type="radio" required options={f.kinds} />
            <div className="grid gap-6 sm:grid-cols-2">
              <TextField name="name" label={f.name} required autoComplete="name" />
              <TextField name="email" label={f.email} type="email" required autoComplete="email" />
              <TextField name="phone" label={f.phone} type="tel" autoComplete="tel" hint={f.phoneHint} />
              <TextField name="city" label={f.city} required autoComplete="address-level2" />
            </div>
            <ChoiceGroup
              name="interests"
              legend={f.interests}
              hint={f.interestsHint}
              type="checkbox"
              options={f.interestOptions}
            />
            <TextAreaField name="message" label={f.message} />
            <CheckboxField name="adult" label={f.adult} />
            <ConsentField policyHref={localePath(locale, "/integritetspolicy")} />
          </FormShell>
        </Container>
      </Section>
    </>
  );
}

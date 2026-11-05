import type { Metadata } from "next";
import { Banknote, CalendarRange, Clock, Presentation, Users } from "lucide-react";
import { localePath, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { resolveLocale } from "@/i18n/resolve";
import { getData, tr, type Training } from "@/lib/content";
import { buildMetadata, JsonLd } from "@/lib/seo";
import { site } from "@/lib/site";
import { submitBooking } from "@/lib/forms/actions";
import { ButtonLink } from "@/components/ui/button";
import { PageHeader } from "@/components/sections/page-header";
import { Container, Section, SectionHeading } from "@/components/sections/primitives";
import { Photo } from "@/components/sections/photo";
import {
  ConsentField,
  FormShell,
  SelectField,
  TextAreaField,
  TextField,
} from "@/components/forms/form-kit";

const copy = {
  sv: {
    title: "För skola och *kommun*",
    eyebrow: "Föreläsningar och utbildningar",
    lead: "Vi delar det vi lär oss av tusentals samtal med unga. Föreläsningar, utbildningar och processtöd för skolor, socialtjänst och kommuner.",
    cta: "Skicka bokningsförfrågan",
    whyTitle: "Kunskap direkt från ungas vardag",
    why: "Våra utbildare arbetar själva med stödsamtal varje vecka. Allt vi lär ut bygger på verkliga erfarenheter, forskning och ungas egna röster – och är anpassat efter er verksamhet.",
    photoAlt: "En föreläsare pratar inför en grupp lärare i ett klassrum.",
    trainingsTitle: "Utbud",
    audience: "Målgrupp",
    format: "Format",
    length: "Längd",
    price: "Pris",
    formTitle: "Bokningsförfrågan",
    formLead: "Berätta lite om er så återkommer vi inom tre arbetsdagar med förslag på upplägg och pris. Förfrågan är inte bindande.",
    success: { title: "Tack för er förfrågan!", text: "Vi återkommer inom tre arbetsdagar." },
    f: {
      organisation: "Skola / organisation",
      name: "Kontaktperson",
      email: "E-post",
      phone: "Telefon",
      training: "Vilken utbildning är ni intresserade av?",
      trainingPlaceholder: "Välj utbildning",
      other: "Annat / vet inte än",
      participants: "Ungefärligt antal deltagare",
      preferredDate: "Önskat datum eller period",
      preferredHint: "Till exempel ”vecka 12” eller ”under vårterminen”.",
      city: "Kommun / ort",
      message: "Något mer vi bör veta?",
      submit: "Skicka förfrågan",
    },
  },
  en: {
    title: "For schools and *municipalities*",
    eyebrow: "Talks and training",
    lead: "We share what we learn from thousands of conversations with young people. Talks, training and process support for schools, social services and municipalities.",
    cta: "Send a booking request",
    whyTitle: "Knowledge straight from young people's lives",
    why: "Our trainers do support conversations every week themselves. Everything we teach builds on real experience, research and young people's own voices – tailored to your organisation.",
    photoAlt: "A speaker talking to a group of teachers in a classroom.",
    trainingsTitle: "What we offer",
    audience: "Audience",
    format: "Format",
    length: "Length",
    price: "Price",
    formTitle: "Booking request",
    formLead: "Tell us a little about yourselves and we'll get back within three working days with a suggested plan and price. The request is not binding.",
    success: { title: "Thank you for your request!", text: "We'll get back to you within three working days." },
    f: {
      organisation: "School / organisation",
      name: "Contact person",
      email: "Email",
      phone: "Phone",
      training: "Which training are you interested in?",
      trainingPlaceholder: "Choose training",
      other: "Other / not sure yet",
      participants: "Approximate number of participants",
      preferredDate: "Preferred date or period",
      preferredHint: "For example “week 12” or “during spring term”.",
      city: "Municipality / city",
      message: "Anything else we should know?",
      submit: "Send request",
    },
  },
} satisfies Record<Locale, unknown>;

export async function generateMetadata({ params }: PageProps<"/[locale]/for-yrkesverksamma">): Promise<Metadata> {
  const locale = await resolveLocale(params);
  return buildMetadata({ locale, path: "/for-yrkesverksamma", title: copy[locale].title, description: copy[locale].lead });
}

export default async function ProfessionalsPage({ params }: PageProps<"/[locale]/for-yrkesverksamma">) {
  const locale = await resolveLocale(params);
  const dict = await getDictionary(locale);
  const t = copy[locale];
  const f = t.f;
  const trainings = getData<Training[]>("trainings");

  return (
    <>
      <PageHeader
        title={t.title}
        lead={t.lead}
        tint="sky"
        aside={
          <Photo
            query="teacher workshop classroom adults"
            alt={t.photoAlt}
            tint="sky"
            className="aspect-[4/3]"
            priority
          />
        }
      >
        <ButtonLink href="#bokning" size="lg">
          {t.cta}
        </ButtonLink>
      </PageHeader>

      <Section labelledBy="trainings-title" className="pt-4">
        <Container>
          <SectionHeading id="trainings-title" title={t.trainingsTitle} lead={t.why} />
          <ul className="mt-10 grid gap-4 md:grid-cols-2">
            {trainings.map((tr_) => (
              <li key={tr_.id} className="flex flex-col rounded-[1.75rem] bg-card p-7 ring-1 ring-border">
                <Presentation aria-hidden="true" className="size-8 text-primary" />
                <h3 className="mt-4 text-2xl font-bold">{tr(tr_.title, locale)}</h3>
                <p className="mt-2 text-muted-foreground">{tr(tr_.text, locale)}</p>
                <dl className="mt-5 grid gap-2 text-[0.95rem] sm:grid-cols-2">
                  {[
                    [Users, t.audience, tr(tr_.audience, locale)],
                    [CalendarRange, t.format, tr(tr_.format, locale)],
                    [Clock, t.length, tr(tr_.length, locale)],
                    [Banknote, t.price, tr(tr_.price, locale)],
                  ].map(([Icon, label, value]) => {
                    const I = Icon as typeof Users;
                    return (
                      <div key={label as string}>
                        <dt className="flex items-center gap-2 font-semibold">
                          <I aria-hidden="true" className="size-4 shrink-0 text-secondary" />
                          {label as string}
                        </dt>
                        <dd className="pl-6 text-muted-foreground">{value as string}</dd>
                      </div>
                    );
                  })}
                </dl>
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      <Section id="bokning" labelledBy="booking-title" className="bg-muted/60">
        <Container className="grid gap-10 lg:grid-cols-[1fr_1.6fr]">
          <div>
            <h2 id="booking-title" className="text-3xl font-extrabold sm:text-4xl">
              {t.formTitle}
            </h2>
            <p className="mt-3 text-lg text-muted-foreground">{t.formLead}</p>
          </div>
          <FormShell
            id="booking"
            action={submitBooking}
            locale={locale}
            labels={{ ...dict.forms, successTitle: t.success.title, successText: t.success.text }}
            submitLabel={f.submit}
            fieldLabels={{
              organisation: f.organisation,
              name: f.name,
              email: f.email,
              phone: f.phone,
              training: f.training,
              participants: f.participants,
              preferredDate: f.preferredDate,
              city: f.city,
              message: f.message,
              consent: dict.forms.consentLink,
            }}
          >
            <div className="grid gap-6 sm:grid-cols-2">
              <TextField name="organisation" label={f.organisation} required autoComplete="organization" />
              <TextField name="city" label={f.city} required autoComplete="address-level2" />
              <TextField name="name" label={f.name} required autoComplete="name" />
              <TextField name="email" label={f.email} type="email" required autoComplete="email" />
              <TextField name="phone" label={f.phone} type="tel" autoComplete="tel" />
              <TextField name="participants" label={f.participants} type="number" min={1} required inputMode="numeric" />
            </div>
            <SelectField
              name="training"
              label={f.training}
              required
              placeholder={f.trainingPlaceholder}
              options={[
                ...trainings.map((x) => ({ value: x.id, label: tr(x.title, locale) })),
                { value: "annat", label: f.other },
              ]}
            />
            <TextField name="preferredDate" label={f.preferredDate} hint={f.preferredHint} />
            <TextAreaField name="message" label={f.message} />
            <ConsentField policyHref={localePath(locale, "/integritetspolicy")} />
          </FormShell>
        </Container>
      </Section>

      <JsonLd
        data={trainings.map((x) => ({
          "@context": "https://schema.org",
          "@type": "Course",
          name: tr(x.title, locale),
          description: tr(x.text, locale),
          provider: { "@type": "NGO", name: site.name, sameAs: site.url },
        }))}
      />
    </>
  );
}

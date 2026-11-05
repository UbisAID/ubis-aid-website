import type { Metadata } from "next";
import { Check, Gift, HandHeart, Sparkles, Users } from "lucide-react";
import { localePath, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { resolveLocale } from "@/i18n/resolve";
import { buildMetadata } from "@/lib/seo";
import { submitPartner } from "@/lib/forms/actions";
import { cn } from "@/lib/utils";
import { ButtonLink } from "@/components/ui/button";
import { PageHeader } from "@/components/sections/page-header";
import { Container, Section, SectionHeading } from "@/components/sections/primitives";
import { Photo } from "@/components/sections/photo";
import { ConsentField, FormShell, SelectField, TextAreaField, TextField } from "@/components/forms/form-kit";

const copy = {
  sv: {
    title: "För *företag*",
    eyebrow: "CSR och partnerskap",
    lead: "Tillsammans kan vi se till att ingen ung person behöver vara ensam med det som är svårt. Välj ett samarbete som passar ert företag och era värderingar.",
    cta: "Bli partner",
    photoAlt: "Kollegor samlade i ett ljust kontor, i samtal.",
    tiersTitle: "Partnerskap",
    tiersLead: "Alla samarbeten är ettåriga och innehåller en tydlig effektrapport. Beloppen är riktmärken – vi skräddarsyr gärna.",
    perYear: "per år",
    tiers: [
      {
        name: "Vän",
        price: "från 25 000 kr",
        tint: "bg-card",
        featured: false,
        perks: ["Logotyp på vår partnersida", "Digitalt partnerbevis", "Nyhetsbrev för partners", "Effektrapport en gång per år"],
      },
      {
        name: "Partner",
        price: "från 100 000 kr",
        tint: "bg-peach",
        featured: true,
        perks: ["Allt i Vän", "Föreläsning för era anställda", "Gemensam kommunikation i sociala medier", "Volontärdag för ert team"],
      },
      {
        name: "Huvudpartner",
        price: "från 300 000 kr",
        tint: "bg-sage",
        featured: false,
        perks: ["Allt i Partner", "Namngiven verksamhet, t.ex. en stödgrupp", "Plats i vårt partnerråd", "Skräddarsydd effektmätning"],
      },
    ],
    featured: "Populärast",
    otherTitle: "Fler sätt att engagera företaget",
    other: [
      { icon: Gift, title: "Julgåva", text: "Ge en gåva till unga i stället för julklappar – vi tar fram gåvobevis till kunder och anställda." },
      { icon: Users, title: "Anställdas engagemang", text: "Volontärdagar, löneavdrag och matchning av anställdas gåvor." },
      { icon: Sparkles, title: "Kampanjer och produkter", text: "Låt en del av försäljningen gå till unga som behöver stöd." },
      { icon: HandHeart, title: "Pro bono", text: "Bidra med kompetens inom till exempel IT, juridik eller kommunikation." },
    ],
    formTitle: "Kontakta oss om partnerskap",
    formLead: "Vi hör av oss inom två arbetsdagar för ett första samtal.",
    success: { title: "Tack för ert intresse!", text: "Vi hör av oss inom två arbetsdagar." },
    f: {
      company: "Företag",
      name: "Namn",
      email: "E-post",
      phone: "Telefon",
      interest: "Vad är ni intresserade av?",
      interestPlaceholder: "Välj",
      interests: [
        { value: "van", label: "Partnerskap: Vän" },
        { value: "partner", label: "Partnerskap: Partner" },
        { value: "huvudpartner", label: "Partnerskap: Huvudpartner" },
        { value: "julgava", label: "Julgåva" },
        { value: "anstallda", label: "Anställdas engagemang" },
        { value: "annat", label: "Annat" },
      ],
      message: "Berätta gärna mer",
      submit: "Skicka",
    },
  },
  en: {
    title: "For *companies*",
    eyebrow: "CSR and partnerships",
    lead: "Together we can make sure no young person has to be alone with what's hard. Choose a partnership that fits your company and values.",
    cta: "Become a partner",
    photoAlt: "Colleagues gathered in a bright office, in conversation.",
    tiersTitle: "Partnerships",
    tiersLead: "All partnerships run for one year and include a clear impact report. Amounts are guidelines – we're happy to tailor.",
    perYear: "per year",
    tiers: [
      {
        name: "Friend",
        price: "from SEK 25,000",
        tint: "bg-card",
        featured: false,
        perks: ["Logo on our partner page", "Digital partner certificate", "Partner newsletter", "Annual impact report"],
      },
      {
        name: "Partner",
        price: "from SEK 100,000",
        tint: "bg-peach",
        featured: true,
        perks: ["Everything in Friend", "Talk for your employees", "Joint social media communication", "Volunteer day for your team"],
      },
      {
        name: "Main partner",
        price: "from SEK 300,000",
        tint: "bg-sage",
        featured: false,
        perks: ["Everything in Partner", "Named activity, e.g. a support group", "Seat on our partner council", "Tailored impact measurement"],
      },
    ],
    featured: "Most popular",
    otherTitle: "More ways to engage your company",
    other: [
      { icon: Gift, title: "Christmas gift", text: "Give to young people instead of corporate gifts – we provide certificates for clients and staff." },
      { icon: Users, title: "Employee engagement", text: "Volunteer days, payroll giving and matched employee gifts." },
      { icon: Sparkles, title: "Campaigns and products", text: "Let part of your sales go to young people who need support." },
      { icon: HandHeart, title: "Pro bono", text: "Contribute skills in IT, law or communications, for example." },
    ],
    formTitle: "Contact us about partnerships",
    formLead: "We'll get back within two working days for a first conversation.",
    success: { title: "Thank you for your interest!", text: "We'll get back to you within two working days." },
    f: {
      company: "Company",
      name: "Name",
      email: "Email",
      phone: "Phone",
      interest: "What are you interested in?",
      interestPlaceholder: "Choose",
      interests: [
        { value: "van", label: "Partnership: Friend" },
        { value: "partner", label: "Partnership: Partner" },
        { value: "huvudpartner", label: "Partnership: Main partner" },
        { value: "julgava", label: "Christmas gift" },
        { value: "anstallda", label: "Employee engagement" },
        { value: "annat", label: "Other" },
      ],
      message: "Tell us more",
      submit: "Send",
    },
  },
} satisfies Record<Locale, unknown>;

export async function generateMetadata({ params }: PageProps<"/[locale]/foretag">): Promise<Metadata> {
  const locale = await resolveLocale(params);
  return buildMetadata({ locale, path: "/foretag", title: copy[locale].title, description: copy[locale].lead });
}

export default async function CompaniesPage({ params }: PageProps<"/[locale]/foretag">) {
  const locale = await resolveLocale(params);
  const dict = await getDictionary(locale);
  const t = copy[locale];
  const f = t.f;

  return (
    <>
      <PageHeader
        title={t.title}
        lead={t.lead}
        tint="sage"
        aside={<Photo query="colleagues talking bright office" alt={t.photoAlt} tint="sage" className="aspect-[4/3]" priority />}
      >
        <ButtonLink href="#kontakt" size="lg">
          {t.cta}
        </ButtonLink>
      </PageHeader>

      <Section labelledBy="tiers-title" className="pt-4">
        <Container>
          <SectionHeading id="tiers-title" title={t.tiersTitle} lead={t.tiersLead} />
          <ul className="mt-10 grid gap-4 lg:grid-cols-3">
            {t.tiers.map((tier) => (
              <li
                key={tier.name}
                className={cn(
                  "relative flex flex-col rounded-[2rem] p-8 ring-1 ring-border",
                  tier.tint,
                  tier.featured && "ring-2 ring-primary",
                )}
              >
                {tier.featured && (
                  <span className="absolute -top-3 left-8 rounded-full bg-primary px-3 py-1 text-sm font-semibold text-white">
                    {t.featured}
                  </span>
                )}
                <h3 className="text-2xl font-extrabold">{tier.name}</h3>
                <p className="mt-2">
                  <span className="font-heading text-3xl font-extrabold">{tier.price}</span>{" "}
                  <span className="text-muted-foreground">{t.perYear}</span>
                </p>
                <ul className="mt-6 space-y-3">
                  {tier.perks.map((perk) => (
                    <li key={perk} className="flex items-start gap-3">
                      <Check aria-hidden="true" className="mt-1 size-5 shrink-0 text-secondary" />
                      {perk}
                    </li>
                  ))}
                </ul>
                <ButtonLink
                  href="#kontakt"
                  variant={tier.featured ? "default" : "soft"}
                  className="mt-8 self-start"
                >
                  {t.cta}
                  <span className="sr-only">: {tier.name}</span>
                </ButtonLink>
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      <Section labelledBy="other-title" className="bg-muted/60">
        <Container>
          <SectionHeading id="other-title" title={t.otherTitle} />
          <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {t.other.map(({ icon: Icon, title, text }) => (
              <li key={title} className="rounded-[1.75rem] bg-card p-6 ring-1 ring-border">
                <Icon aria-hidden="true" className="size-8 text-primary" />
                <h3 className="mt-4 text-xl font-bold">{title}</h3>
                <p className="mt-2 text-muted-foreground">{text}</p>
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      <Section id="kontakt" labelledBy="partner-title">
        <Container className="grid gap-10 lg:grid-cols-[1fr_1.6fr]">
          <div>
            <h2 id="partner-title" className="text-3xl font-extrabold sm:text-4xl">
              {t.formTitle}
            </h2>
            <p className="mt-3 text-lg text-muted-foreground">{t.formLead}</p>
          </div>
          <FormShell
            id="partner"
            action={submitPartner}
            locale={locale}
            labels={{ ...dict.forms, successTitle: t.success.title, successText: t.success.text }}
            submitLabel={f.submit}
            fieldLabels={{
              company: f.company,
              name: f.name,
              email: f.email,
              phone: f.phone,
              interest: f.interest,
              message: f.message,
              consent: dict.forms.consentLink,
            }}
          >
            <div className="grid gap-6 sm:grid-cols-2">
              <TextField name="company" label={f.company} required autoComplete="organization" />
              <TextField name="name" label={f.name} required autoComplete="name" />
              <TextField name="email" label={f.email} type="email" required autoComplete="email" />
              <TextField name="phone" label={f.phone} type="tel" autoComplete="tel" />
            </div>
            <SelectField name="interest" label={f.interest} required placeholder={f.interestPlaceholder} options={f.interests} />
            <TextAreaField name="message" label={f.message} />
            <ConsentField policyHref={localePath(locale, "/integritetspolicy")} />
          </FormShell>
        </Container>
      </Section>
    </>
  );
}

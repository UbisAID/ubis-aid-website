import type { Metadata } from "next";
import { locales, localePath, ogLocale, type Locale } from "@/i18n/config";
import { site } from "@/lib/site";

type MetaInput = {
  locale: Locale;
  /** Path without locale, e.g. "/amnen". */
  path: string;
  title: string;
  description: string;
  /** Set for pages that should stay out of search results. */
  noIndex?: boolean;
  type?: "website" | "article";
};

export function buildMetadata({
  locale,
  path,
  title,
  description,
  noIndex,
  type = "website",
}: MetaInput): Metadata {
  // Headlines may contain *emphasis* markers for the serif accent.
  title = title.replace(/\*/g, "");
  const languages = Object.fromEntries(locales.map((l) => [l, localePath(l, path)]));
  return {
    title,
    description,
    alternates: {
      canonical: localePath(locale, path),
      languages: { ...languages, "x-default": localePath("sv", path) },
    },
    openGraph: {
      type,
      title,
      description,
      url: localePath(locale, path),
      siteName: site.name,
      locale: ogLocale[locale],
    },
    twitter: { card: "summary_large_image", title, description },
    // The GitHub Pages client preview is never indexed.
    robots:
      process.env.NEXT_PUBLIC_PREVIEW === "1"
        ? { index: false, follow: false }
        : noIndex
          ? { index: false, follow: true }
          : undefined,
  };
}

/** JSON-LD for the organisation (schema.org/NGO). */
export function organizationJsonLd(locale: Locale, description: string) {
  return {
    "@context": "https://schema.org",
    "@type": "NGO",
    "@id": `${site.url}/#organization`,
    name: site.name,
    url: `${site.url}${localePath(locale)}`,
    logo: `${site.url}/brand/ubis-aid-logo.png`,
    description,
    foundingDate: String(site.foundedYear),
    nonprofitStatus: "Nonprofit",
    identifier: { "@type": "PropertyValue", propertyID: "Organisationsnummer", value: site.orgNumber },
    address: {
      "@type": "PostalAddress",
      streetAddress: site.address.street,
      postalCode: site.address.postalCode,
      addressLocality: site.address.city,
      addressRegion: site.address.region,
      addressCountry: site.address.country,
    },
    email: site.contact.email,
    telephone: site.contact.phoneHref,
    contactPoint: [
      {
        "@type": "ContactPoint",
        contactType: "customer support",
        telephone: site.contact.phoneHref,
        email: site.contact.supportEmail,
        availableLanguage: ["Swedish", "English"],
        areaServed: "SE",
      },
    ],
    sameAs: site.social.map((s) => s.href),
  };
}

export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      // JSON.stringify output is safe once "<" is escaped.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}

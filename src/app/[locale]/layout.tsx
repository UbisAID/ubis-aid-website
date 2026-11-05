import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import { Bricolage_Grotesque, Figtree, Instrument_Serif } from "next/font/google";
import "../globals.css";
import { htmlLang, isLocale, locales, localePath } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { site } from "@/lib/site";
import { JsonLd, organizationJsonLd } from "@/lib/seo";
import { ChatBanner } from "@/components/layout/chat-banner";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { CookieConsent } from "@/components/layout/cookie-consent";
import { Analytics } from "@/components/layout/analytics";

const display = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
  weight: ["500", "700", "800"],
});

// Italic serif used sparingly for emphasised words in headlines.
const serif = Instrument_Serif({
  subsets: ["latin"],
  variable: "--font-instrument",
  display: "swap",
  weight: "400",
  style: ["normal", "italic"],
});

const body = Figtree({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

export const dynamicParams = false;

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export const viewport: Viewport = {
  themeColor: "#fbf7f0",
  width: "device-width",
  initialScale: 1,
};

export async function generateMetadata({ params }: LayoutProps<"/[locale]">): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const dict = await getDictionary(locale);
  return {
    metadataBase: new URL(site.url),
    title: { default: `${site.name} – ${dict.meta.tagline}`, template: `%s | ${site.name}` },
    description: dict.meta.description,
    applicationName: site.name,
    icons: { icon: "/brand/icon-512.png", apple: "/brand/apple-icon.png" },
    formatDetection: { telephone: false },
  };
}

export default async function LocaleLayout({ children, params }: LayoutProps<"/[locale]">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = await getDictionary(locale);

  return (
    <html lang={htmlLang[locale]} className={`${display.variable} ${body.variable} ${serif.variable} antialiased`}>
      <body className="flex min-h-dvh flex-col">
        <a
          href="#main"
          className="sr-only z-[60] rounded-full bg-ink px-5 py-3 font-semibold text-white focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
        >
          {dict.skipLink}
        </a>
        <ChatBanner locale={locale} dict={dict} />
        <SiteHeader locale={locale} dict={dict} />
        <main id="main" tabIndex={-1} className="flex-1 outline-none">
          {children}
        </main>
        <SiteFooter locale={locale} dict={dict} />
        <CookieConsent
          labels={dict.cookies}
          policyHref={`${localePath(locale, "/integritetspolicy")}#cookies`}
        />
        <Analytics />
        <JsonLd data={organizationJsonLd(locale, dict.meta.description)} />
      </body>
    </html>
  );
}

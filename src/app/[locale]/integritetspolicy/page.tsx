import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { localePath } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { resolveLocale } from "@/i18n/resolve";
import { getEntry, type PageMeta } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";
import { MdxPage } from "@/components/sections/mdx-page";

export async function generateMetadata({ params }: PageProps<"/[locale]/integritetspolicy">): Promise<Metadata> {
  const locale = await resolveLocale(params);
  const page = getEntry<PageMeta>("pages", locale, "integritetspolicy");
  if (!page) return {};
  return buildMetadata({ locale, path: "/integritetspolicy", title: page.meta.title, description: page.meta.description });
}

export default async function PrivacyPage({ params }: PageProps<"/[locale]/integritetspolicy">) {
  const locale = await resolveLocale(params);
  const dict = await getDictionary(locale);
  const page = getEntry<PageMeta>("pages", locale, "integritetspolicy");
  if (!page) notFound();
  return (
    <MdxPage page={page} locale={locale} dict={dict} backHref={localePath(locale)} backLabel={dict.nav.home} />
  );
}

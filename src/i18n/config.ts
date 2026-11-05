export const locales = ["sv", "en"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "sv";

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

/** Prefix an internal path with the locale, e.g. ("en", "/amnen") -> "/en/amnen". */
export function localePath(locale: Locale, path = "/"): string {
  const clean = path === "/" ? "" : path.startsWith("/") ? path : `/${path}`;
  return `/${locale}${clean}`;
}

/** Remove the locale prefix from a pathname, e.g. "/sv/amnen" -> "/amnen". */
export function stripLocale(pathname: string): string {
  const parts = pathname.split("/");
  if (parts[1] && isLocale(parts[1])) {
    const rest = `/${parts.slice(2).join("/")}`;
    return rest === "/" ? "/" : rest.replace(/\/$/, "");
  }
  return pathname;
}

export const htmlLang: Record<Locale, string> = { sv: "sv-SE", en: "en" };
export const ogLocale: Record<Locale, string> = { sv: "sv_SE", en: "en_GB" };

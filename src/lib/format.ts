import { htmlLang, type Locale } from "@/i18n/config";

const TZ = "Europe/Stockholm";

export function formatDate(
  locale: Locale,
  iso: string,
  options: Intl.DateTimeFormatOptions = { day: "numeric", month: "long", year: "numeric" },
) {
  return new Intl.DateTimeFormat(htmlLang[locale], { timeZone: TZ, ...options }).format(new Date(iso));
}

export function formatTime(locale: Locale, iso: string) {
  return new Intl.DateTimeFormat(htmlLang[locale], {
    timeZone: TZ,
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(iso));
}

export function formatSek(locale: Locale, amount: number) {
  return new Intl.NumberFormat(htmlLang[locale], {
    style: "currency",
    currency: "SEK",
    maximumFractionDigits: 0,
  }).format(amount);
}

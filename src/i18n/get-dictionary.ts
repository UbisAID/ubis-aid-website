import "server-only";
import type { Locale } from "./config";
import type { Dictionary } from "./dictionaries/sv";

const dictionaries: Record<Locale, () => Promise<Dictionary>> = {
  sv: () => import("./dictionaries/sv").then((m) => m.default),
  en: () => import("./dictionaries/en").then((m) => m.default),
};

export function getDictionary(locale: Locale): Promise<Dictionary> {
  return dictionaries[locale]();
}

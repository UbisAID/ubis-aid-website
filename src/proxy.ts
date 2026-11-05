import { NextResponse, type NextRequest } from "next/server";
import { defaultLocale, locales } from "@/i18n/config";

/**
 * Sends requests without a locale prefix to the Swedish site.
 * Swedish is the primary language, so we do not guess from Accept-Language;
 * visitors switch to English with the language toggle.
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hasLocale = locales.some(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`),
  );
  if (hasLocale) return;

  request.nextUrl.pathname = `/${defaultLocale}${pathname === "/" ? "" : pathname}`;
  return NextResponse.redirect(request.nextUrl, 308);
}

export const config = {
  matcher: [
    // Skip Next internals, API routes and any file with an extension.
    "/((?!_next|api|.*\\..*).*)",
  ],
};

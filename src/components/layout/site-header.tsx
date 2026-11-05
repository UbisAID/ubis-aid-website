import Link from "next/link";
import { localePath, type Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries/sv";
import { site } from "@/lib/site";
import { ButtonLink } from "@/components/ui/button";
import { Logo } from "@/components/brand/logo";
import { DesktopNav, MobileNav } from "./header-nav";
import { LanguageToggle } from "./language-toggle";
import { QuickExit } from "./quick-exit";
import { mobileNavGroups, primaryNav } from "./nav-items";

export function SiteHeader({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/90 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="mx-auto flex h-18 max-w-7xl items-center justify-between gap-3 px-4 sm:px-6">
        <Link
          href={localePath(locale)}
          className="shrink-0 rounded-xl"
          aria-label={`${site.name} – ${dict.nav.home}`}
        >
          <Logo alt={site.name} priority className="h-11 sm:h-12" />
        </Link>

        <DesktopNav locale={locale} items={primaryNav(dict)} label={dict.nav.label} />

        <div className="flex items-center gap-2">
          <LanguageToggle
            locale={locale}
            label={dict.language.switchTo}
            ariaLabel={dict.language.switchToLabel}
            className="hidden md:inline-flex"
          />
          <ButtonLink
            href={localePath(locale, "/stod-oss")}
            variant="ghost"
            className="hidden 2xl:inline-flex"
          >
            {dict.nav.donate}
          </ButtonLink>
          <ButtonLink
            href={localePath(locale, "/prata-med-oss")}
            className="hidden md:inline-flex"
          >
            {dict.nav.talkToUs}
          </ButtonLink>
          <QuickExit
            label={dict.quickExit.label}
            short={dict.quickExit.short}
            hint={dict.quickExit.hint}
          />
          <MobileNav
            locale={locale}
            groups={mobileNavGroups(dict)}
            labels={{ menu: dict.nav.menu, close: dict.nav.closeMenu, nav: dict.nav.label }}
            ctas={{ talk: dict.nav.talkToUs, donate: dict.nav.donate }}
            language={{ label: dict.language.switchTo, ariaLabel: dict.language.switchToLabel }}
          />
        </div>
      </div>
    </header>
  );
}

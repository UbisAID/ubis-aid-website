import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import { localePath, type Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries/sv";
import { site } from "@/lib/site";
import { Logo } from "@/components/brand/logo";
import { TrustBadges } from "@/components/sections/trust-badges";
import { Rich, SinceMark } from "@/components/sections/primitives";
import { fill } from "@/i18n/fill";
import { CookieSettingsButton } from "./cookie-consent";

export function SiteFooter({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const p = (path: string) => localePath(locale, path);
  const columns = [
    {
      title: dict.footer.support,
      links: [
        { href: "/prata-med-oss", label: dict.nav.talkToUs },
        { href: "/amnen", label: dict.nav.topics },
        { href: "/sjalvtest", label: dict.nav.selfTest },
        { href: "/berattelser", label: dict.nav.stories },
      ],
    },
    {
      title: dict.footer.adults,
      links: [
        { href: "/vuxna", label: dict.nav.adults },
        { href: "/for-yrkesverksamma", label: dict.nav.professionals },
        { href: "/foretag", label: dict.nav.companies },
        { href: "/engagera-dig", label: dict.nav.engage },
        { href: "/stod-oss", label: dict.nav.donate },
      ],
    },
    {
      title: dict.footer.org,
      links: [
        { href: "/om-oss", label: dict.nav.about },
        { href: "/nyheter", label: dict.nav.news },
        { href: "/om-oss/press", label: dict.nav.press },
        { href: "/om-oss/stadgar", label: dict.footer.bylaws },
        { href: "/om-oss#arsredovisningar", label: dict.footer.reports },
      ],
    },
  ];

  return (
    <footer className="mt-24 border-t border-ink/10 bg-muted text-ink">
      {/* Light surface on purpose: the logo must never sit on a dark background. */}
      <div className="mx-auto max-w-7xl px-4 pt-16 pb-6 sm:px-6">
        <div className="grid gap-12 lg:grid-cols-[1.3fr_2fr]">
          <div>
            <Logo alt={site.name} className="h-16" />
            <SinceMark label={fill(dict.sinceLong, { year: site.foundedYear })} className="mt-5 text-xl sm:text-2xl" />
            <p className="mt-5 max-w-sm text-ink/80">{dict.footer.about}</p>

            <h2 className="mt-8 text-base font-semibold">{dict.footer.contact}</h2>
            <ul className="mt-3 space-y-2 text-ink/85">
              <li className="flex items-center gap-2">
                <Mail aria-hidden="true" className="size-4" />
                <a href={`mailto:${site.contact.email}`} className="hover:underline">
                  {site.contact.email}
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Phone aria-hidden="true" className="size-4" />
                <a href={`tel:${site.contact.phoneHref}`} className="hover:underline">
                  {site.contact.phone}
                </a>
              </li>
              <li className="flex items-start gap-2">
                <MapPin aria-hidden="true" className="mt-1 size-4" />
                <span>
                  {site.address.street}, {site.address.postalCode} {site.address.city}
                </span>
              </li>
            </ul>

            <h2 className="mt-8 text-base font-semibold">{dict.footer.follow}</h2>
            <ul className="mt-3 flex flex-wrap gap-2">
              {site.social.map((s) => (
                <li key={s.label}>
                  <a
                    href={s.href}
                    rel="noopener noreferrer"
                    className="inline-flex min-h-11 items-center rounded-full border border-ink/20 bg-card px-4 text-sm font-medium hover:border-ink/40"
                  >
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="grid gap-10 sm:grid-cols-3">
            {columns.map((col) => (
              <div key={col.title}>
                <h2 className="text-[0.8rem] font-semibold tracking-[0.14em] text-secondary uppercase">{col.title}</h2>
                <ul className="mt-4 space-y-1">
                  {col.links.map((l) => (
                    <li key={l.href}>
                      <Link
                        href={p(l.href)}
                        className="inline-flex min-h-10 items-center text-ink/85 hover:text-ink hover:underline"
                      >
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-14 rounded-3xl border border-ink/15 bg-card p-6">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-md">
              <h2 className="text-base font-semibold">{dict.footer.trustTitle}</h2>
              <p className="mt-1 text-sm text-muted-foreground">{dict.footer.trustText}</p>
            </div>
            <TrustBadges dict={dict} />
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-4 border-t border-ink/15 pt-6 text-sm text-muted-foreground md:flex-row md:items-center md:justify-between">
          <p>
            © {new Date().getFullYear()} {site.name} · {dict.footer.orgNr} {site.orgNumber} ·{" "}
            {dict.footer.rights}
          </p>
          <div className="flex flex-wrap gap-x-5 gap-y-2">
            <Link href={p("/integritetspolicy")} className="underline-offset-4 hover:underline">
              {dict.footer.privacy}
            </Link>
            <CookieSettingsButton label={dict.cookies.settings} />
          </div>
        </div>
        <p
          aria-hidden="true"
          className="mt-14 font-heading text-[clamp(3.5rem,13.5vw,12.5rem)] leading-[0.85] font-extrabold tracking-[-0.055em] text-ink select-none"
        >
          <Rich text={dict.footer.statement} accentClassName="pr-[0.08em]" />
        </p>
      </div>
    </footer>
  );
}

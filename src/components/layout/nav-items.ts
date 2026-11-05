import type { Dictionary } from "@/i18n/dictionaries/sv";

export type NavItem = { href: string; label: string };

export function primaryNav(d: Dictionary): NavItem[] {
  return [
    { href: "/prata-med-oss", label: d.nav.getSupport },
    { href: "/amnen", label: d.nav.topics },
    { href: "/berattelser", label: d.nav.stories },
    { href: "/vuxna", label: d.nav.forAdults },
    { href: "/om-oss", label: d.nav.about },
  ];
}

export function mobileNavGroups(d: Dictionary): { title: string; items: NavItem[] }[] {
  return [
    {
      title: d.nav.youthGroup,
      items: [
        { href: "/prata-med-oss", label: d.nav.getSupport },
        { href: "/unga", label: d.nav.youth1319 },
        { href: "/unga-vuxna", label: d.nav.youth1825 },
        { href: "/amnen", label: d.nav.topics },
        { href: "/sjalvtest", label: d.nav.selfTest },
        { href: "/berattelser", label: d.nav.stories },
      ],
    },
    {
      title: d.nav.adultGroup,
      items: [
        { href: "/vuxna", label: d.nav.adults },
        { href: "/for-yrkesverksamma", label: d.nav.professionals },
        { href: "/foretag", label: d.nav.companies },
        { href: "/engagera-dig", label: d.nav.engage },
        { href: "/stod-oss", label: d.nav.donate },
        { href: "/om-oss", label: d.nav.about },
        { href: "/nyheter", label: d.nav.news },
      ],
    },
  ];
}

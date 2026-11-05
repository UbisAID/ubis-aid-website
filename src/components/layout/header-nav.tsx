"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import { localePath, stripLocale, type Locale } from "@/i18n/config";
import { cn } from "@/lib/utils";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { buttonVariants } from "@/components/ui/button";
import { LanguageToggle } from "./language-toggle";
import type { NavItem } from "./nav-items";

function isActive(current: string, href: string) {
  return current === href || current.startsWith(`${href}/`);
}

export function DesktopNav({
  locale,
  items,
  label,
}: {
  locale: Locale;
  items: NavItem[];
  label: string;
}) {
  const current = stripLocale(usePathname());
  return (
    <nav aria-label={label} className="hidden xl:block">
      <ul className="flex items-center gap-1">
        {items.map((item) => {
          const active = isActive(current, item.href);
          return (
            <li key={item.href}>
              <Link
                href={localePath(locale, item.href)}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "rounded-full px-3.5 py-2 text-[0.98rem] font-medium transition-colors hover:bg-muted",
                  active && "bg-muted font-semibold",
                )}
              >
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

export function MobileNav({
  locale,
  groups,
  labels,
  ctas,
  language,
}: {
  locale: Locale;
  groups: { title: string; items: NavItem[] }[];
  labels: { menu: string; close: string; nav: string };
  ctas: { talk: string; donate: string };
  language: { label: string; ariaLabel: string };
}) {
  const current = stripLocale(usePathname());
  return (
    <Sheet>
      <SheetTrigger
        className={cn(buttonVariants({ variant: "soft", size: "default" }), "px-3.5 xl:hidden")}
      >
        <Menu aria-hidden="true" />
        <span className="sr-only min-[380px]:not-sr-only">{labels.menu}</span>
      </SheetTrigger>
      <SheetContent
        side="right"
        closeLabel={labels.close}
        className="w-[88%] max-w-sm overflow-y-auto bg-background p-0"
      >
        <div className="p-6 pb-2">
          <SheetTitle className="font-heading text-xl font-bold">{labels.menu}</SheetTitle>
          <SheetDescription className="sr-only">{labels.nav}</SheetDescription>
        </div>
        <nav aria-label={labels.nav} className="px-4 pb-6">
          {groups.map((group) => (
            <div key={group.title} className="mt-4">
              <p className="px-2 text-sm font-semibold tracking-wide text-muted-foreground uppercase">
                {group.title}
              </p>
              <ul className="mt-2">
                {group.items.map((item) => {
                  const active = isActive(current, item.href);
                  return (
                    <li key={item.href}>
                      <SheetClose
                        render={
                          <Link
                            href={localePath(locale, item.href)}
                            aria-current={active ? "page" : undefined}
                          />
                        }
                        nativeButton={false}
                        className={cn(
                          "flex min-h-12 items-center rounded-xl px-3 text-lg font-medium hover:bg-muted",
                          active && "bg-muted font-semibold",
                        )}
                      >
                        {item.label}
                      </SheetClose>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
          <div className="mt-8 grid gap-3">
            <SheetClose
              render={<Link href={localePath(locale, "/prata-med-oss")} />}
              nativeButton={false}
              className={buttonVariants({ size: "lg" })}
            >
              {ctas.talk}
            </SheetClose>
            <SheetClose
              render={<Link href={localePath(locale, "/stod-oss")} />}
              nativeButton={false}
              className={buttonVariants({ size: "lg", variant: "outline" })}
            >
              {ctas.donate}
            </SheetClose>
            <LanguageToggle
              locale={locale}
              label={language.label}
              ariaLabel={language.ariaLabel}
              className="justify-center text-base"
            />
          </div>
        </nav>
      </SheetContent>
    </Sheet>
  );
}

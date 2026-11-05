import Link from "next/link";
import { ArrowUpRight, EyeOff, Gift, Lock } from "lucide-react";
import { localePath, type Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries/sv";
import { site } from "@/lib/site";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Photo } from "./photo";

type Schedule = { days: readonly number[]; open: string; close: string };

function hours(schedule: Schedule, dict: Dictionary) {
  const days = schedule.days.length === 7 ? dict.status.everyDay : dict.status.weekdays;
  return `${days} ${schedule.open}–${schedule.close}`;
}

/** The three promises every support surface repeats: free, anonymous, confidential. */
export function TrustPills({ dict, className }: { dict: Dictionary; className?: string }) {
  const items = [
    { icon: Gift, label: dict.trust.free },
    { icon: EyeOff, label: dict.trust.anonymous },
    { icon: Lock, label: dict.trust.confidential },
  ];
  return (
    <ul className={cn("flex flex-wrap gap-2", className)}>
      {items.map(({ icon: Icon, label }) => (
        <li
          key={label}
          className="inline-flex items-center gap-2 rounded-full bg-white px-3.5 py-1.5 text-sm font-semibold shadow-sm ring-1 ring-border"
        >
          <Icon aria-hidden="true" className="size-4 text-secondary" />
          {label}
        </li>
      ))}
    </ul>
  );
}

/**
 * Ways to get support. Chat is the most used channel, so it gets a warm
 * feature card; SMS, email and phone follow as a quiet list with one shared
 * opening-hours block (inspired by Function's and Fluz's help pages).
 * Works on dark panels (`tone="dark"`) and on the light page background.
 */
export function SupportChannels({
  locale,
  dict,
  tone = "light",
}: {
  locale: Locale;
  dict: Dictionary;
  tone?: "light" | "dark";
}) {
  const c = dict.channels;
  const dark = tone === "dark";
  const chatHref = site.chatUrl || `${localePath(locale, "/prata-med-oss")}#chatt`;
  const chatInternal = chatHref.startsWith("/");

  const others = [
    { key: "sms", ...c.sms, detail: site.contact.sms, href: `sms:${site.contact.smsHref}` },
    { key: "email", ...c.email, detail: site.contact.supportEmail, href: `mailto:${site.contact.supportEmail}` },
    { key: "phone", ...c.phone, detail: site.contact.phone, href: `tel:${site.contact.phoneHref}` },
  ];

  const schedule = [
    { name: c.chat.name, value: hours(site.hours.chat, dict) },
    { name: c.sms.name, value: hours(site.hours.sms, dict) },
    { name: c.phone.name, value: hours(site.hours.phone, dict) },
    { name: c.email.name, value: c.emailHours },
  ];

  const chatCta = cn(buttonVariants({ size: "lg" }), "mt-auto self-start");

  return (
    <div className="grid gap-4 lg:grid-cols-[1.05fr_1fr] lg:gap-6">
      {/* Feature: chat */}
      <section
        aria-labelledby="channel-chat"
        className="relative isolate flex min-h-[26rem] flex-col overflow-hidden rounded-[2rem] bg-peach p-8 text-ink sm:p-10"
      >
        {/* Brand split-sun motif (decorative): navy + photo half circles over red + butter */}
        <div aria-hidden="true" className="absolute right-0 bottom-0 -z-10 hidden size-[22rem] sm:block">
          <span className="absolute -right-16 -bottom-16 size-64">
            <span className="absolute inset-y-0 left-0 w-1/2 rounded-l-full bg-primary/85" />
            <span className="absolute inset-y-0 right-0 w-1/2 rounded-r-full bg-butter" />
          </span>
          <span className="absolute right-[6.5rem] bottom-[6.5rem] size-52">
            <span className="absolute inset-y-0 left-0 w-1/2 rounded-l-full bg-secondary" />
            <Photo
              query="teenager texting on phone"
              orientation="portrait"
              decorative
              credit={false}
              alt=""
              tint="peach"
              sizes="120px"
              className="absolute inset-y-0 right-0 w-1/2 rounded-l-none rounded-r-full"
            />
          </span>
        </div>
        <h3
          id="channel-chat"
          className="font-serif text-7xl leading-[0.9] font-normal tracking-normal sm:text-8xl"
        >
          {c.chatHeading}
        </h3>
        <p className="mt-5 max-w-sm text-lg text-ink/80">{c.chat.text}</p>
        <p className="mt-4 mb-10 font-semibold text-ink/80">{hours(site.hours.chat, dict)}</p>
        {chatInternal ? (
          <Link href={chatHref} className={chatCta}>
            {c.chat.action}
          </Link>
        ) : (
          <a href={chatHref} className={chatCta}>
            {c.chat.action}
          </a>
        )}
      </section>

      {/* More options */}
      <section
        aria-labelledby="channel-more"
        className={cn(
          "flex flex-col rounded-[2rem] p-8 sm:p-10",
          dark ? "bg-white/[0.06] ring-1 ring-white/15" : "bg-card ring-1 ring-border",
        )}
      >
        <h3 id="channel-more" className="font-serif text-3xl leading-tight font-normal tracking-normal sm:text-4xl">
          {c.more}
        </h3>
        <ul className={cn("mt-6 border-t", dark ? "border-white/15" : "border-ink/15")}>
          {others.map((o) => (
            <li key={o.key} className={cn("border-b", dark ? "border-white/15" : "border-ink/15")}>
              <a href={o.href} className="group flex items-center justify-between gap-4 py-5">
                <span className="min-w-0">
                  <span className="block text-sm font-semibold tracking-[0.12em] uppercase opacity-75">
                    {o.name}
                  </span>
                  <span className="mt-1 block font-heading text-xl font-bold break-all sm:text-2xl">{o.detail}</span>
                </span>
                <span
                  className={cn(
                    "inline-flex min-h-11 shrink-0 items-center gap-1.5 rounded-full px-4 text-sm font-semibold transition-colors",
                    dark ? "bg-white text-ink group-hover:bg-butter" : "bg-ink text-white group-hover:bg-secondary",
                  )}
                >
                  {o.action}
                  <ArrowUpRight aria-hidden="true" className="size-4" />
                </span>
              </a>
            </li>
          ))}
        </ul>

        <div className="mt-8">
          <h4 className="text-sm font-semibold tracking-[0.12em] uppercase opacity-75">{c.hoursTitle}</h4>
          <dl className="mt-3 grid gap-x-6 gap-y-2 sm:grid-cols-2">
            {schedule.map((row) => (
              <div key={row.name}>
                <dt className="font-semibold">{row.name}</dt>
                <dd className={dark ? "text-white/75" : "text-muted-foreground"}>{row.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>
    </div>
  );
}

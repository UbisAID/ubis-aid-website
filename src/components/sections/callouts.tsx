import { MessageCircleHeart, Siren } from "lucide-react";
import { localePath, type Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries/sv";
import { ButtonLink } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { site } from "@/lib/site";
import { TrustPills } from "./support-channels";

/** The "talk to us" box placed after every article and topic. */
export function TalkCta({
  locale,
  dict,
  className,
}: {
  locale: Locale;
  dict: Dictionary;
  className?: string;
}) {
  return (
    <aside
      aria-labelledby="talk-cta-title"
      className={cn("rounded-[2rem] bg-peach p-7 sm:p-10", className)}
    >
      <MessageCircleHeart aria-hidden="true" className="size-9 text-primary" />
      <h2 id="talk-cta-title" className="mt-4 text-2xl font-extrabold sm:text-3xl">
        {dict.talkCta.title}
      </h2>
      <p className="mt-3 max-w-xl text-lg">{dict.talkCta.text}</p>
      <TrustPills dict={dict} className="mt-5" />
      <div className="mt-7 flex flex-wrap gap-3">
        <ButtonLink href={localePath(locale, "/prata-med-oss")} size="lg">
          {dict.talkCta.primary}
        </ButtonLink>
        <ButtonLink href={localePath(locale, "/sjalvtest")} size="lg" variant="soft">
          {dict.talkCta.secondary}
        </ButtonLink>
      </div>
      <p className="mt-5 text-[0.95rem]">
        {dict.psychologist.lead}{" "}
        <a href={`mailto:${site.contact.email}`} className="font-semibold text-secondary underline underline-offset-4">
          {dict.psychologist.cta}
        </a>
      </p>
    </aside>
  );
}

/** Always-visible pointer to emergency services. */
export function EmergencyBox({ dict, className }: { dict: Dictionary; className?: string }) {
  return (
    <aside
      aria-labelledby="emergency-title"
      className={cn(
        "flex flex-col gap-4 rounded-3xl border-2 border-primary/30 bg-card p-6 sm:flex-row sm:items-center",
        className,
      )}
    >
      <Siren aria-hidden="true" className="size-8 shrink-0 text-primary" />
      <div className="flex-1">
        <h2 id="emergency-title" className="text-lg font-bold">
          {dict.emergency.title}
        </h2>
        <p className="mt-1 text-muted-foreground">{dict.emergency.text}</p>
      </div>
      <a
        href="tel:112"
        className="inline-flex min-h-11 items-center justify-center rounded-full bg-ink px-5 font-bold text-white hover:bg-ink/85"
      >
        {dict.emergency.call112}
      </a>
    </aside>
  );
}

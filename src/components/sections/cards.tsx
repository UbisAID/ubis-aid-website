import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  CloudSun,
  House,
  MessageSquareWarning,
  Moon,
  ShieldAlert,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import { localePath, type Locale } from "@/i18n/config";
import type { Entry, StoryMeta, TopicMeta } from "@/lib/content";
import { cn } from "@/lib/utils";
import { tintBg } from "./primitives";

export const topicIcons: Record<string, LucideIcon> = {
  house: House,
  cloud: CloudSun,
  shield: ShieldAlert,
  message: MessageSquareWarning,
  book: BookOpen,
  sparkles: Sparkles,
  moon: Moon,
};

export function TopicCard({ topic, locale }: { topic: Entry<TopicMeta>; locale: Locale }) {
  const Icon = topicIcons[topic.meta.icon] ?? Sparkles;
  return (
    <Link
      href={localePath(locale, `/amnen/${topic.slug}`)}
      className={cn(
        "group flex h-full flex-col rounded-[1.75rem] p-6 transition-transform duration-200 motion-safe:hover:-translate-y-1",
        tintBg[topic.meta.color],
      )}
    >
      <span className="grid size-12 place-items-center rounded-2xl bg-white/80">
        <Icon aria-hidden="true" className="size-6" />
      </span>
      <h3 className="mt-5 text-xl font-bold">{topic.meta.title}</h3>
      <p className="mt-2 text-ink/80">{topic.meta.description}</p>
      <span
        aria-hidden="true"
        className="mt-auto grid size-11 place-items-center self-end rounded-full bg-white pt-0 transition-colors group-hover:bg-ink group-hover:text-white"
      >
        <ArrowRight className="size-5" />
      </span>
    </Link>
  );
}

export function StoryCard({
  story,
  locale,
  roleLabel,
}: {
  story: Entry<StoryMeta>;
  locale: Locale;
  roleLabel: string;
}) {
  return (
    <Link
      href={localePath(locale, `/berattelser/${story.slug}`)}
      className="group flex h-full flex-col rounded-[1.75rem] bg-card p-7 shadow-sm ring-1 ring-border transition-shadow hover:shadow-md"
    >
      <span
        className={cn(
          "inline-flex self-start rounded-full px-3 py-1 text-sm font-semibold",
          tintBg[story.meta.color],
        )}
      >
        {roleLabel}
      </span>
      <blockquote className="mt-5 font-heading text-xl leading-snug font-bold sm:text-2xl">
        ”{story.meta.excerpt}”
      </blockquote>
      <p className="mt-auto pt-6 text-muted-foreground">
        <span className="font-semibold text-foreground">{story.meta.name}</span>
        {story.meta.age ? `, ${story.meta.age}` : ""}
      </p>
      <span className="mt-3 inline-flex items-center gap-1.5 font-semibold text-secondary group-hover:underline">
        {story.meta.title}
        <ArrowRight aria-hidden="true" className="size-4" />
      </span>
    </Link>
  );
}

import { BadgeCheck, ShieldCheck, HandHeart } from "lucide-react";
import type { Dictionary } from "@/i18n/dictionaries/sv";
import { site } from "@/lib/site";
import { cn } from "@/lib/utils";

/**
 * Placeholder trust marks. Replace each with the official artwork once the
 * association holds the 90-account / Giva Sverige membership. Do not show
 * official logos until you are approved.
 */
export function TrustBadges({
  dict,
  tone = "light",
  className,
}: {
  dict: Dictionary;
  tone?: "light" | "dark";
  className?: string;
}) {
  const b = dict.footer.badges;
  const items = [
    { icon: BadgeCheck, title: b.ninety, sub: site.giving.plusgiro },
    { icon: ShieldCheck, title: b.insamling, sub: b.placeholder },
    { icon: HandHeart, title: b.giva, sub: b.placeholder },
  ];
  return (
    <ul className={cn("flex flex-wrap gap-3", className)}>
      {items.map(({ icon: Icon, title, sub }) => (
        <li
          key={title}
          className={cn(
            "flex items-center gap-2.5 rounded-2xl border px-3.5 py-2.5",
            tone === "dark" ? "border-white/25 bg-white/5" : "border-border bg-card",
          )}
        >
          <Icon
            aria-hidden="true"
            className={cn("size-6", tone === "dark" ? "text-butter" : "text-secondary")}
          />
          <span className="leading-tight">
            <span className="block text-sm font-semibold">{title}</span>
            <span
              className={cn("block text-xs", tone === "dark" ? "text-white/75" : "text-muted-foreground")}
            >
              {sub}
            </span>
          </span>
        </li>
      ))}
    </ul>
  );
}

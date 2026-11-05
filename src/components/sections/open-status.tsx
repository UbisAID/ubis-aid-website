"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

type Schedule = { days: readonly number[]; open: string; close: string };

function stockholmNow() {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Europe/Stockholm",
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(new Date());
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? "";
  const day = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(get("weekday"));
  return { day, time: `${get("hour")}:${get("minute")}` };
}

export function isOpen(schedule: Schedule) {
  const { day, time } = stockholmNow();
  return schedule.days.includes(day) && time >= schedule.open && time < schedule.close;
}

/**
 * "Open now" indicator, computed in the browser so static pages stay correct.
 * `pill` is a compact badge; `inline` is a calm line of text with a dot.
 */
export function OpenStatus({
  schedule,
  labels,
  variant = "pill",
  className,
}: {
  schedule: Schedule;
  labels: { open: string; closed: string };
  variant?: "pill" | "inline";
  className?: string;
}) {
  const [open, setOpen] = useState<boolean | null>(null);

  useEffect(() => {
    const update = () => setOpen(isOpen(schedule));
    update();
    const id = window.setInterval(update, 60_000);
    return () => window.clearInterval(id);
  }, [schedule]);

  if (open === null) return <span className={cn("inline-block h-7", className)} />;

  if (variant === "inline") {
    return (
      <span className={cn("inline-flex items-center gap-2 font-semibold", className)}>
        <span aria-hidden="true" className="relative flex size-2.5">
          {open && (
            <span className="absolute inline-flex size-full rounded-full bg-current opacity-50 motion-safe:animate-ping" />
          )}
          <span className={cn("relative inline-flex size-2.5 rounded-full", open ? "bg-current" : "bg-current/40")} />
        </span>
        {open ? labels.open : labels.closed}
      </span>
    );
  }

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-sm font-semibold",
        open ? "bg-sage text-secondary" : "bg-muted text-muted-foreground",
        className,
      )}
    >
      <span
        aria-hidden="true"
        className={cn("size-2 rounded-full", open ? "bg-secondary motion-safe:animate-pulse" : "bg-muted-foreground")}
      />
      {open ? labels.open : labels.closed}
    </span>
  );
}

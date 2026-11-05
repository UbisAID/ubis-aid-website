"use client";

import { useEffect, useRef, useState } from "react";

type Stat = { value: number; suffix?: string; label: string };

/** Shows the final number until the block scrolls into view, then counts up from 0. */
function useCountUp(target: number, start: boolean) {
  const [value, setValue] = useState(target);

  useEffect(() => {
    if (!start) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const duration = 1600;
    const t0 = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const p = Math.min(1, (now - t0) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setValue(Math.round(target * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [start, target]);

  return value;
}

function StatItem({
  stat,
  start,
  locale,
  tone,
}: {
  stat: Stat;
  start: boolean;
  locale: string;
  tone: "light" | "dark";
}) {
  const value = useCountUp(stat.value, start);
  const finalText = `${stat.value.toLocaleString(locale)}${stat.suffix ?? ""}`;
  return (
    <div
      className={
        tone === "dark"
          ? "rounded-[1.75rem] bg-white/10 p-7 ring-1 ring-white/15"
          : "border-t border-ink/20 pt-6 pr-6 pb-2"
      }
    >
      <dt className="sr-only">{stat.label}</dt>
      <dd>
        {/* Screen readers get the final number, not every frame. */}
        <span className="sr-only">{finalText}</span>
        <span
          aria-hidden="true"
          className={
            tone === "dark"
              ? "block font-heading text-5xl font-extrabold tabular-nums sm:text-6xl"
              : "block font-heading text-6xl font-extrabold tracking-[-0.04em] tabular-nums lg:text-7xl"
          }
        >
          {value.toLocaleString(locale)}
          {stat.suffix}
        </span>
        <span
          aria-hidden="true"
          className={`mt-3 block text-lg ${tone === "dark" ? "text-white/85" : "text-muted-foreground"}`}
        >
          {stat.label}
        </span>
      </dd>
    </div>
  );
}

/** Animated key numbers. Respects prefers-reduced-motion. */
export function ImpactStats({
  stats,
  locale,
  tone = "dark",
}: {
  stats: Stat[];
  locale: string;
  tone?: "light" | "dark";
}) {
  const ref = useRef<HTMLDListElement>(null);
  const [start, setStart] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStart(true);
          io.disconnect();
        }
      },
      { threshold: 0.3 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <dl ref={ref} className={tone === "dark" ? "grid gap-4 sm:grid-cols-2 lg:grid-cols-4" : "grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-4"}>
      {stats.map((s) => (
        <StatItem key={s.label} stat={s} start={start} locale={locale} tone={tone} />
      ))}
    </dl>
  );
}

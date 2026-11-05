import { cn } from "@/lib/utils";
import type { Tint } from "@/lib/content";

export const tintBg: Record<Tint, string> = {
  peach: "bg-peach",
  sage: "bg-sage",
  lavender: "bg-lavender",
  butter: "bg-butter",
  sky: "bg-sky",
};

export function Container({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn("mx-auto w-full max-w-7xl px-4 sm:px-6", className)} {...props} />;
}

export function Section({
  className,
  children,
  labelledBy,
  ...props
}: React.ComponentProps<"section"> & { labelledBy?: string }) {
  return (
    <section aria-labelledby={labelledBy} className={cn("py-16 sm:py-24", className)} {...props}>
      {children}
    </section>
  );
}

/**
 * Small uppercase label used above headings. With `index` it renders the
 * numbered editorial label, e.g. "(01) Få stöd".
 */
export function Eyebrow({
  className,
  index,
  children,
  ...props
}: React.ComponentProps<"p"> & { index?: string }) {
  return (
    <p
      className={cn(
        "inline-flex items-center gap-2.5 text-[0.8rem] font-semibold tracking-[0.14em] text-secondary uppercase",
        className,
      )}
      {...props}
    >
      {index ? (
        <span className="rounded-full border border-current px-2 py-0.5 tabular-nums">{index}</span>
      ) : (
        <span aria-hidden="true" className="size-2 rounded-full bg-primary" />
      )}
      {children}
    </p>
  );
}

/**
 * Renders a headline where words wrapped in *asterisks* get the italic serif
 * accent, e.g. "Du är inte *ensam*." Lets editors add emphasis in plain strings.
 */
export function Rich({ text, accentClassName }: { text: string; accentClassName?: string }) {
  const parts = text.split(/(\*[^*]+\*)/g).filter(Boolean);
  return (
    <>
      {parts.map((part, i) =>
        part.startsWith("*") && part.endsWith("*") ? (
          <em
            key={i}
            className={cn(
              "font-serif font-normal tracking-normal text-primary italic",
              accentClassName,
            )}
          >
            {part.slice(1, -1)}
          </em>
        ) : (
          <span key={i}>{part}</span>
        ),
      )}
    </>
  );
}

/** Strip *emphasis* markers, for metadata and aria labels. */
export function plain(text: string) {
  return text.replace(/\*/g, "");
}

export function SectionHeading({
  id,
  eyebrow,
  index,
  title,
  lead,
  align = "left",
  tone = "light",
  className,
}: {
  id: string;
  eyebrow?: string;
  index?: string;
  title: string;
  lead?: string;
  align?: "left" | "center";
  tone?: "light" | "dark";
  className?: string;
}) {
  return (
    <div className={cn("max-w-3xl", align === "center" && "mx-auto text-center", className)}>
      {eyebrow && (
        <Eyebrow index={index} className={tone === "dark" ? "text-butter" : undefined}>
          {eyebrow}
        </Eyebrow>
      )}
      <h2
        id={id}
        className={cn(
          "text-4xl leading-[1.05] font-extrabold tracking-[-0.03em] sm:text-5xl md:text-6xl",
          eyebrow && "mt-5",
        )}
      >
        <Rich text={title} accentClassName={tone === "dark" ? "text-butter" : undefined} />
      </h2>
      {lead && (
        <p
          className={cn(
            "mt-5 max-w-2xl text-lg sm:text-xl",
            tone === "dark" ? "text-white/80" : "text-muted-foreground",
            align === "center" && "mx-auto",
          )}
        >
          {lead}
        </p>
      )}
    </div>
  );
}

/** Running ticker band. Duplicated content is hidden from assistive tech; static with reduced motion. */
export function Marquee({ items, className }: { items: string[]; className?: string }) {
  const row = (hidden: boolean) => (
    <ul aria-hidden={hidden || undefined} className="flex shrink-0 items-center gap-8 pr-8">
      {items.map((item, i) => (
        <li key={`${item}-${i}`} className="flex items-center gap-8 whitespace-nowrap">
          <span>{item}</span>
          <svg aria-hidden="true" viewBox="0 0 24 24" className="size-5 fill-current opacity-70">
            <path d="M12 0c1 6 6 11 12 12-6 1-11 6-12 12-1-6-6-11-12-12 6-1 11-6 12-12Z" />
          </svg>
        </li>
      ))}
    </ul>
  );
  return (
    <div className={cn("group overflow-hidden", className)}>
      <div className="flex w-max animate-[marquee_40s_linear_infinite] group-hover:[animation-play-state:paused]">
        {row(false)}
        {row(true)}
      </div>
    </div>
  );
}

/** Rule with a label, used to separate editorial blocks. */
export function Rule({ className }: { className?: string }) {
  return <hr className={cn("border-t border-ink/15", className)} />;
}

/**
 * Stand-in for real photography. The caption doubles as a photo brief for the
 * photographer: real people, real places, natural light, no posed stock shots.
 * Replace with next/image once photos with model consent exist.
 */
export function PhotoPlaceholder({
  alt,
  brief,
  tint = "peach",
  className,
  label,
}: {
  alt: string;
  brief?: string;
  tint?: Tint;
  className?: string;
  label?: string;
}) {
  return (
    <div
      role="img"
      aria-label={alt}
      className={cn("relative isolate overflow-hidden rounded-[2rem]", tintBg[tint], className)}
    >
      <svg
        aria-hidden="true"
        viewBox="0 0 400 300"
        preserveAspectRatio="xMidYMid slice"
        className="absolute inset-0 -z-10 size-full"
      >
        <circle cx="320" cy="70" r="90" fill="#fff" opacity=".45" />
        <circle cx="70" cy="250" r="120" fill="#fff" opacity=".3" />
        <path d="M0 230 C 120 170, 230 290, 400 200 L400 300 L0 300Z" fill="#fff" opacity=".35" />
        <g fill="var(--ink)" opacity=".12">
          <circle cx="160" cy="135" r="28" />
          <path d="M112 230c0-34 22-58 48-58s48 24 48 58Z" />
          <circle cx="245" cy="148" r="24" />
          <path d="M205 236c0-30 18-50 40-50s40 20 40 50Z" />
        </g>
      </svg>
      {brief && (
        <span
          aria-hidden="true"
          className="absolute inset-x-3 top-3 rounded-2xl bg-white/80 px-3 py-2 text-xs text-ink backdrop-blur-sm"
        >
          {label && <span className="font-semibold">{label}: </span>}
          {brief}
        </span>
      )}
    </div>
  );
}

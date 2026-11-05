import { cn } from "@/lib/utils";
import type { Tint } from "@/lib/content";
import { Container, Eyebrow, Rich, tintBg } from "./primitives";

/** Decorative split-sun shapes echoing the home hero; used when a page has no photo. */
function Shapes({ tint }: { tint: Tint }) {
  return (
    <div aria-hidden="true" className="relative mx-auto hidden aspect-square w-full max-w-sm lg:block">
      <div className="absolute inset-y-0 left-0 w-1/2 rounded-l-full bg-primary" />
      <div className={cn("absolute inset-y-0 right-0 w-1/2 rounded-r-full", tintBg[tint])} />
      <div className="absolute right-[18%] -bottom-6 size-1/3 rounded-full bg-ink" />
      <div className="absolute top-[12%] left-[12%] size-[18%] rounded-full bg-butter" />
    </div>
  );
}

export function PageHeader({
  eyebrow,
  title,
  lead,
  tint = "peach",
  children,
  aside,
  shapes = true,
  className,
}: {
  eyebrow?: string;
  /** Supports *emphasis* for the italic serif accent. */
  title: string;
  lead?: string;
  tint?: Tint;
  children?: React.ReactNode;
  aside?: React.ReactNode;
  /** Show the geometric composition when there is no aside. */
  shapes?: boolean;
  className?: string;
}) {
  const side = aside ?? (shapes ? <Shapes tint={tint} /> : null);
  return (
    <div className={cn("relative overflow-hidden border-b border-ink/10", className)}>
      <Container className="relative grid items-center gap-10 py-14 sm:py-20 lg:grid-cols-[1.35fr_1fr] lg:gap-16">
        <div>
          {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
          <h1 className={cn("text-[clamp(2.6rem,6vw,5rem)] leading-[1] font-extrabold tracking-[-0.04em]", eyebrow && "mt-6")}>
            <Rich text={title} />
          </h1>
          {lead && <p className="mt-6 max-w-2xl text-lg text-ink/75 sm:text-xl">{lead}</p>}
          {children && <div className="mt-8">{children}</div>}
        </div>
        {side && <div>{side}</div>}
      </Container>
    </div>
  );
}

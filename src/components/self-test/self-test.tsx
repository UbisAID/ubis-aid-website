"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Lock, RotateCcw, Siren } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type SelfTestCopy = {
  introTitle: string;
  introText: string;
  privacy: string;
  start: string;
  progress: string; // "Fråga {n} av {total}"
  back: string;
  next: string;
  showResult: string;
  options: string[]; // 4 options, scored 0–3
  questions: { text: string; positive?: boolean; safety?: boolean }[];
  results: { min: number; title: string; text: string }[]; // sorted by min ascending
  safetyTitle: string;
  safetyText: string;
  talk: string;
  topic: string;
  restart: string;
  disclaimer: string;
};

type Step = "intro" | number | "result";

/**
 * Anonymous self-test. Runs entirely in the browser: answers live only in
 * component state and disappear when the page is closed or restarted.
 * Nothing is sent, stored or tracked.
 */
export function SelfTest({
  copy,
  talkHref,
  topicHref,
}: {
  copy: SelfTestCopy;
  talkHref: string;
  topicHref: string;
}) {
  const [step, setStep] = useState<Step>("intro");
  const [answers, setAnswers] = useState<(number | null)[]>(() => copy.questions.map(() => null));
  const headingRef = useRef<HTMLHeadingElement>(null);
  const firstRender = useRef(true);

  // Move focus to the new heading on each step so screen readers follow along.
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    headingRef.current?.focus();
  }, [step]);

  const total = copy.questions.length;

  function score() {
    return answers.reduce<number>((sum, a, i) => {
      if (a === null) return sum;
      return sum + (copy.questions[i].positive ? 3 - a : a);
    }, 0);
  }

  function restart() {
    setAnswers(copy.questions.map(() => null));
    setStep("intro");
  }

  if (step === "intro") {
    return (
      <div className="rounded-[2rem] bg-card p-7 shadow-sm ring-1 ring-border sm:p-10">
        <h2 ref={headingRef} tabIndex={-1} className="text-3xl font-extrabold outline-none">
          {copy.introTitle}
        </h2>
        <p className="mt-3 text-lg text-muted-foreground">{copy.introText}</p>
        <p className="mt-5 flex items-start gap-3 rounded-2xl bg-sage p-4">
          <Lock aria-hidden="true" className="mt-1 size-5 shrink-0 text-secondary" />
          {copy.privacy}
        </p>
        <Button size="lg" className="mt-8" onClick={() => setStep(0)}>
          {copy.start}
          <ArrowRight aria-hidden="true" />
        </Button>
      </div>
    );
  }

  if (step === "result") {
    const s = score();
    const result = [...copy.results].reverse().find((r) => s >= r.min) ?? copy.results[0];
    const safetyFlag = copy.questions.some((q, i) => q.safety && (answers[i] ?? 0) > 0);
    return (
      <div className="space-y-5">
        {safetyFlag && (
          <div role="alert" className="flex gap-4 rounded-[2rem] border-2 border-primary bg-card p-6">
            <Siren aria-hidden="true" className="size-8 shrink-0 text-primary" />
            <div>
              <h3 className="text-xl font-bold">{copy.safetyTitle}</h3>
              <p className="mt-1">{copy.safetyText}</p>
            </div>
          </div>
        )}
        <div className="rounded-[2rem] bg-peach p-7 sm:p-10">
          <h2 ref={headingRef} tabIndex={-1} className="text-3xl font-extrabold outline-none">
            {result.title}
          </h2>
          <p className="mt-4 text-lg">{result.text}</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href={talkHref} className={buttonVariants({ size: "lg" })}>
              {copy.talk}
            </Link>
            <Link href={topicHref} className={buttonVariants({ size: "lg", variant: "soft" })}>
              {copy.topic}
            </Link>
          </div>
        </div>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-muted-foreground">{copy.disclaimer}</p>
          <Button variant="ghost" onClick={restart}>
            <RotateCcw aria-hidden="true" />
            {copy.restart}
          </Button>
        </div>
      </div>
    );
  }

  const index = step;
  const question = copy.questions[index];
  const current = answers[index];
  const isLast = index === total - 1;
  const progressText = copy.progress.replace("{n}", String(index + 1)).replace("{total}", String(total));
  const name = `q${index}`;

  return (
    <form
      className="rounded-[2rem] bg-card p-7 shadow-sm ring-1 ring-border sm:p-10"
      onSubmit={(e) => {
        e.preventDefault();
        if (current === null) return;
        setStep(isLast ? "result" : index + 1);
      }}
    >
      <div
        role="progressbar"
        aria-label={progressText}
        aria-valuemin={1}
        aria-valuemax={total}
        aria-valuenow={index + 1}
        className="h-2.5 overflow-hidden rounded-full bg-muted"
      >
        <div
          className="h-full rounded-full bg-secondary transition-[width] duration-300"
          style={{ width: `${((index + 1) / total) * 100}%` }}
        />
      </div>
      <fieldset className="mt-6">
        <legend className="w-full">
          <span className="text-sm font-semibold text-muted-foreground">{progressText}</span>
          <h2 ref={headingRef} tabIndex={-1} className="mt-2 text-2xl font-extrabold outline-none sm:text-3xl">
            {question.text}
          </h2>
        </legend>
        <div className="mt-6 grid gap-3">
          {copy.options.map((option, value) => {
            const id = `${name}-${value}`;
            const checked = current === value;
            return (
              <label
                key={id}
                htmlFor={id}
                className={cn(
                  "flex min-h-14 cursor-pointer items-center gap-4 rounded-2xl border-2 px-5 text-lg font-medium transition-colors",
                  checked ? "border-secondary bg-sage" : "border-border hover:border-input hover:bg-muted/60",
                )}
              >
                <input
                  id={id}
                  type="radio"
                  name={name}
                  value={value}
                  checked={checked}
                  onChange={() =>
                    setAnswers((prev) => prev.map((a, i) => (i === index ? value : a)))
                  }
                  className="size-5 accent-[var(--secondary)]"
                />
                {option}
              </label>
            );
          })}
        </div>
      </fieldset>
      <div className="mt-8 flex items-center justify-between gap-3">
        <Button
          type="button"
          variant="ghost"
          onClick={() => setStep(index === 0 ? "intro" : index - 1)}
        >
          <ArrowLeft aria-hidden="true" />
          {copy.back}
        </Button>
        <Button type="submit" size="lg" disabled={current === null}>
          {isLast ? copy.showResult : copy.next}
          <ArrowRight aria-hidden="true" />
        </Button>
      </div>
    </form>
  );
}

"use client";

import { createContext, useActionState, useContext, useEffect, useRef } from "react";
import Link from "next/link";
import { CircleAlert, CircleCheck, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import type { FormName, FormState } from "@/lib/forms/schemas";
import { submitBooking, submitPartner, submitVolunteer } from "@/lib/forms/actions";

const actions = { volunteer: submitVolunteer, booking: submitBooking, partner: submitPartner } satisfies Record<
  FormName,
  (prev: FormState, data: FormData) => Promise<FormState>
>;

export type FormLabels = {
  required: string;
  submit: string;
  sending: string;
  errorSummary: string;
  genericError: string;
  consentPrefix: string;
  consentLink: string;
  consentSuffix: string;
  honeypot: string;
  successTitle: string;
  successText: string;
};

type Ctx = { state: FormState; labels: FormLabels; formId: string };
const FormCtx = createContext<Ctx | null>(null);

function useFormCtx() {
  const ctx = useContext(FormCtx);
  if (!ctx) throw new Error("Field must be used inside <FormShell>");
  return ctx;
}

function valueOf(state: FormState, name: string) {
  const v = state.values?.[name];
  return Array.isArray(v) ? v : v ?? "";
}

/**
 * Accessible form wrapper for server actions:
 * - error summary with links to each field (focused after a failed submit)
 * - success message that receives focus
 * - values preserved after a failed submit
 * - honeypot field against spam bots
 */
export function FormShell({
  id,
  form,
  locale,
  labels,
  children,
  submitLabel,
  fieldLabels,
}: {
  id: string;
  /** Which form this is; picks the matching server action. */
  form: FormName;
  locale: string;
  labels: FormLabels;
  children: React.ReactNode;
  submitLabel?: string;
  /** Human-readable field names for the error summary. */
  fieldLabels: Record<string, string>;
}) {
  const [state, formAction, pending] = useActionState(actions[form], { status: "idle" });
  const summaryRef = useRef<HTMLDivElement>(null);
  const successRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (state.status === "error") summaryRef.current?.focus();
    if (state.status === "success") successRef.current?.focus();
  }, [state]);

  if (state.status === "success") {
    return (
      <div
        ref={successRef}
        tabIndex={-1}
        role="status"
        className="rounded-[2rem] bg-sage p-8 outline-none sm:p-10"
      >
        <CircleCheck aria-hidden="true" className="size-10 text-secondary" />
        <h3 className="mt-4 text-2xl font-extrabold">{labels.successTitle}</h3>
        <p className="mt-2 text-lg">{labels.successText}</p>
      </div>
    );
  }

  const errors = state.errors ?? {};
  const errorKeys = Object.keys(errors);

  return (
    <FormCtx.Provider value={{ state, labels, formId: id }}>
      <form
        key={state.submittedAt ?? 0}
        id={id}
        action={formAction}
        noValidate
        className="space-y-6 rounded-[2rem] bg-card p-6 shadow-sm ring-1 ring-border sm:p-9"
      >
        {state.status === "error" && (
          <div
            ref={summaryRef}
            tabIndex={-1}
            role="alert"
            className="rounded-2xl border-2 border-destructive/60 bg-destructive/5 p-5 outline-none"
          >
            <p className="flex items-center gap-2 font-bold text-destructive">
              <CircleAlert aria-hidden="true" className="size-5" />
              {errors.form ? labels.genericError : labels.errorSummary}
            </p>
            {!errors.form && (
              <ul className="mt-2 list-disc space-y-1 pl-6">
                {errorKeys.map((k) => (
                  <li key={k}>
                    <a href={`#${id}-${k}`} className="font-semibold underline underline-offset-4">
                      {fieldLabels[k] ?? k}
                    </a>
                    : {errors[k]}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        <input type="hidden" name="locale" value={locale} />
        {/* Honeypot – hidden from people and assistive tech */}
        <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
          <label htmlFor={`${id}-website`}>{labels.honeypot}</label>
          <input id={`${id}-website`} name="website" type="text" tabIndex={-1} autoComplete="off" />
        </div>

        {children}

        <Button type="submit" size="lg" disabled={pending} className="w-full sm:w-auto">
          {pending && <Loader2 aria-hidden="true" className="animate-spin" />}
          {pending ? labels.sending : submitLabel ?? labels.submit}
        </Button>
      </form>
    </FormCtx.Provider>
  );
}

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} className="mt-2 flex items-start gap-1.5 font-semibold text-destructive">
      <CircleAlert aria-hidden="true" className="mt-1 size-4 shrink-0" />
      {message}
    </p>
  );
}

function RequiredMark({ label }: { label: string }) {
  return (
    <span className="ml-1 font-normal text-muted-foreground">
      <span aria-hidden="true">*</span>
      <span className="sr-only">({label})</span>
    </span>
  );
}

const controlClass =
  "min-h-12 rounded-xl border-2 border-input bg-white px-4 text-base md:text-base aria-invalid:border-destructive focus-visible:border-ring";

export function TextField({
  name,
  label,
  type = "text",
  required,
  hint,
  autoComplete,
  inputMode,
  className,
  min,
}: {
  name: string;
  label: string;
  type?: string;
  required?: boolean;
  hint?: string;
  autoComplete?: string;
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
  className?: string;
  min?: number;
}) {
  const { state, labels, formId } = useFormCtx();
  const id = `${formId}-${name}`;
  const error = state.errors?.[name];
  const describedBy = [hint && `${id}-hint`, error && `${id}-error`].filter(Boolean).join(" ") || undefined;
  return (
    <div className={className}>
      <label htmlFor={id} className="block font-semibold">
        {label}
        {required && <RequiredMark label={labels.required} />}
      </label>
      {hint && (
        <p id={`${id}-hint`} className="mt-1 text-[0.95rem] text-muted-foreground">
          {hint}
        </p>
      )}
      <Input
        id={id}
        name={name}
        type={type}
        min={min}
        required={required}
        aria-required={required}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy}
        autoComplete={autoComplete}
        inputMode={inputMode}
        defaultValue={valueOf(state, name) as string}
        className={cn("mt-2", controlClass)}
      />
      <FieldError id={`${id}-error`} message={error} />
    </div>
  );
}

export function TextAreaField({ name, label, hint, required }: { name: string; label: string; hint?: string; required?: boolean }) {
  const { state, labels, formId } = useFormCtx();
  const id = `${formId}-${name}`;
  const error = state.errors?.[name];
  const describedBy = [hint && `${id}-hint`, error && `${id}-error`].filter(Boolean).join(" ") || undefined;
  return (
    <div>
      <label htmlFor={id} className="block font-semibold">
        {label}
        {required && <RequiredMark label={labels.required} />}
      </label>
      {hint && (
        <p id={`${id}-hint`} className="mt-1 text-[0.95rem] text-muted-foreground">
          {hint}
        </p>
      )}
      <Textarea
        id={id}
        name={name}
        rows={5}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy}
        defaultValue={valueOf(state, name) as string}
        className={cn("mt-2 py-3", controlClass)}
      />
      <FieldError id={`${id}-error`} message={error} />
    </div>
  );
}

export function SelectField({
  name,
  label,
  options,
  required,
  placeholder,
}: {
  name: string;
  label: string;
  options: { value: string; label: string }[];
  required?: boolean;
  placeholder: string;
}) {
  const { state, labels, formId } = useFormCtx();
  const id = `${formId}-${name}`;
  const error = state.errors?.[name];
  return (
    <div>
      <label htmlFor={id} className="block font-semibold">
        {label}
        {required && <RequiredMark label={labels.required} />}
      </label>
      <select
        id={id}
        name={name}
        required={required}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : undefined}
        defaultValue={valueOf(state, name) as string}
        className={cn("mt-2 w-full appearance-auto", controlClass)}
      >
        <option value="">{placeholder}</option>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      <FieldError id={`${id}-error`} message={error} />
    </div>
  );
}

export function ChoiceGroup({
  name,
  legend,
  options,
  type,
  required,
  hint,
}: {
  name: string;
  legend: string;
  options: { value: string; label: string; description?: string }[];
  type: "radio" | "checkbox";
  required?: boolean;
  hint?: string;
}) {
  const { state, labels, formId } = useFormCtx();
  const id = `${formId}-${name}`;
  const error = state.errors?.[name];
  const current = valueOf(state, name);
  const selected = Array.isArray(current) ? current : [current];
  return (
    <fieldset
      id={id}
      tabIndex={-1}
      aria-invalid={error ? true : undefined}
      aria-describedby={[hint && `${id}-hint`, error && `${id}-error`].filter(Boolean).join(" ") || undefined}
      className="outline-none"
    >
      <legend className="font-semibold">
        {legend}
        {required && <RequiredMark label={labels.required} />}
      </legend>
      {hint && (
        <p id={`${id}-hint`} className="mt-1 text-[0.95rem] text-muted-foreground">
          {hint}
        </p>
      )}
      <div className="mt-3 grid gap-2 sm:grid-cols-2">
        {options.map((o) => {
          const optId = `${id}-${o.value}`;
          return (
            <label
              key={o.value}
              htmlFor={optId}
              className="flex min-h-12 cursor-pointer items-start gap-3 rounded-xl border-2 border-border bg-white p-3.5 has-checked:border-secondary has-checked:bg-sage"
            >
              <input
                id={optId}
                type={type}
                name={name}
                value={o.value}
                defaultChecked={selected.includes(o.value)}
                className="mt-1 size-5 shrink-0 accent-[var(--secondary)]"
              />
              <span>
                <span className="block font-semibold">{o.label}</span>
                {o.description && <span className="block text-[0.95rem] text-muted-foreground">{o.description}</span>}
              </span>
            </label>
          );
        })}
      </div>
      <FieldError id={`${id}-error`} message={error} />
    </fieldset>
  );
}

export function CheckboxField({ name, label, required }: { name: string; label: React.ReactNode; required?: boolean }) {
  const { state, labels, formId } = useFormCtx();
  const id = `${formId}-${name}`;
  const error = state.errors?.[name];
  return (
    <div>
      <div className="flex items-start gap-3">
        <input
          id={id}
          name={name}
          type="checkbox"
          required={required}
          aria-required={required}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${id}-error` : undefined}
          defaultChecked={state.values?.[name] === "on"}
          className="mt-1 size-5 shrink-0 accent-[var(--secondary)]"
        />
        <label htmlFor={id}>
          {label}
          {required && <RequiredMark label={labels.required} />}
        </label>
      </div>
      <FieldError id={`${id}-error`} message={error} />
    </div>
  );
}

export function ConsentField({ policyHref }: { policyHref: string }) {
  const { labels } = useFormCtx();
  return (
    <CheckboxField
      name="consent"
      required
      label={
        <>
          {labels.consentPrefix}{" "}
          <Link href={policyHref} className="font-semibold text-secondary underline underline-offset-4">
            {labels.consentLink}
          </Link>{" "}
          {labels.consentSuffix}
        </>
      }
    />
  );
}

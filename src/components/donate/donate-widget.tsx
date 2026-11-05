"use client";

import { useId, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { CreditCard, Heart, Loader2, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type DonateCopy = {
  title: string;
  frequencyLabel: string;
  once: string;
  monthly: string;
  monthlyNudge: string;
  amountLabel: string;
  popular: string;
  custom: string;
  customHint: string;
  perMonth: string;
  impact: Record<string, string>; // keyed by preset amount
  impactCustom: string;
  tributeToggle: string;
  tributeType: string;
  memorial: string;
  honour: string;
  honoreeName: string;
  tributeMessage: string;
  recipientEmail: string;
  recipientHint: string;
  methodLabel: string;
  swish: string;
  card: string;
  swishInstructions: string;
  swishNumber: string;
  swishMessage: string;
  cardInstructions: string;
  cardButton: string;
  cardRedirecting: string;
  cardUnavailable: string;
  cardError: string;
  monthlyMethods: string;
  minAmount: string;
  secure: string;
};

type Method = "swish" | "card";

const MIN = 50;
const MAX = 100_000;

/**
 * Donation widget: one-time or monthly, preset or custom amount, optional
 * memorial/tribute gift, and Swish (QR) or card (Stripe Checkout).
 */
export function DonateWidget({
  copy,
  locale,
  presets,
  swishNumber,
  swishRaw,
  formatSek,
}: {
  copy: DonateCopy;
  locale: string;
  presets: readonly number[];
  swishNumber: string;
  swishRaw: string;
  formatSek: Record<string, string>;
}) {
  const uid = useId();
  const [frequency, setFrequency] = useState<"once" | "monthly">("once");
  const [preset, setPreset] = useState<number | null>(presets[1] ?? presets[0]);
  const [custom, setCustom] = useState("");
  const [method, setMethod] = useState<Method>("swish");
  const [tribute, setTribute] = useState(false);
  const [tributeType, setTributeType] = useState<"memorial" | "honour">("memorial");
  const [honoree, setHonoree] = useState("");
  const [message, setMessage] = useState("");
  const [recipient, setRecipient] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "unavailable" | "error">("idle");

  const customNumber = Number(custom.replace(/\s/g, ""));
  const amount = preset ?? (Number.isFinite(customNumber) ? Math.round(customNumber) : 0);
  const valid = amount >= MIN && amount <= MAX;
  const activeMethod: Method = frequency === "monthly" ? "card" : method;
  const fmt = (n: number) => formatSek[String(n)] ?? `${n.toLocaleString(locale)} kr`;

  // Swish "prefilled" QR payload: C<number>;<amount>;<message>;<lock mask>.
  // Verify against Swish's current QR spec or generate via their QR API before launch.
  const swishMsg = tribute && honoree ? `${tributeType === "memorial" ? "Minne" : "Hyllning"} ${honoree}`.slice(0, 50) : "Gava";
  const swishPayload = `C${swishRaw};${valid ? amount : ""};${swishMsg};0`;

  async function payByCard() {
    if (!valid) return;
    setStatus("loading");
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount,
          frequency,
          locale: locale.startsWith("sv") ? "sv" : "en",
          tribute: tribute ? { type: tributeType, honoree, message, recipient } : undefined,
        }),
      });
      if (res.status === 503) return setStatus("unavailable");
      const data = (await res.json()) as { url?: string };
      if (!res.ok || !data.url) return setStatus("error");
      window.location.assign(data.url);
    } catch {
      setStatus("error");
    }
  }

  const segBtn = (active: boolean) =>
    cn(
      "flex min-h-12 flex-1 items-center justify-center gap-2 rounded-full px-4 font-semibold transition-colors",
      active ? "bg-ink text-white shadow-sm" : "text-ink hover:bg-white/70",
    );

  return (
    <div className="rounded-[2rem] bg-card p-6 shadow-xl ring-1 ring-border sm:p-8">
      <h2 className="text-2xl font-extrabold">{copy.title}</h2>

      {/* Frequency */}
      <fieldset className="mt-6">
        <legend className="sr-only">{copy.frequencyLabel}</legend>
        <div className="flex gap-1 rounded-full bg-muted p-1">
          {(["once", "monthly"] as const).map((f) => (
            <label key={f} className={segBtn(frequency === f)}>
              <input
                type="radio"
                name={`${uid}-freq`}
                value={f}
                checked={frequency === f}
                onChange={() => setFrequency(f)}
                className="sr-only"
              />
              {f === "monthly" && <Heart aria-hidden="true" className="size-4" />}
              {f === "once" ? copy.once : copy.monthly}
            </label>
          ))}
        </div>
        {frequency === "once" && <p className="mt-2 text-center text-sm text-secondary">{copy.monthlyNudge}</p>}
      </fieldset>

      {/* Amount */}
      <fieldset className="mt-6">
        <legend className="font-semibold">{copy.amountLabel}</legend>
        <div className="mt-3 grid grid-cols-3 gap-2">
          {presets.map((p, i) => (
            <label
              key={p}
              className={cn(
                "relative flex min-h-14 cursor-pointer items-center justify-center rounded-2xl border-2 font-heading text-lg font-bold transition-colors has-focus-visible:outline-3 has-focus-visible:outline-offset-2 has-focus-visible:outline-ring",
                preset === p ? "border-primary bg-peach" : "border-border hover:border-input",
              )}
            >
              <input
                type="radio"
                name={`${uid}-amount`}
                value={p}
                checked={preset === p}
                onChange={() => {
                  setPreset(p);
                  setCustom("");
                }}
                className="sr-only"
              />
              {fmt(p)}
              {i === 1 && (
                <span className="absolute -top-2.5 rounded-full bg-secondary px-2 py-0.5 font-sans text-[0.7rem] font-semibold text-white">
                  {copy.popular}
                </span>
              )}
            </label>
          ))}
        </div>
        <label htmlFor={`${uid}-custom`} className="mt-4 block text-[0.95rem] font-semibold">
          {copy.custom}
        </label>
        <div className="relative mt-2">
          <input
            id={`${uid}-custom`}
            inputMode="numeric"
            pattern="[0-9 ]*"
            value={custom}
            onChange={(e) => {
              setCustom(e.target.value);
              setPreset(null);
            }}
            onFocus={() => custom === "" && setPreset(null)}
            aria-describedby={`${uid}-custom-hint`}
            aria-invalid={preset === null && custom !== "" && !valid ? true : undefined}
            className="min-h-12 w-full rounded-xl border-2 border-input bg-white px-4 pr-12 text-lg font-semibold outline-none focus-visible:border-ring aria-invalid:border-destructive"
          />
          <span aria-hidden="true" className="absolute top-1/2 right-4 -translate-y-1/2 text-muted-foreground">
            kr
          </span>
        </div>
        <p id={`${uid}-custom-hint`} className="mt-1 text-sm text-muted-foreground">
          {copy.customHint}
        </p>
      </fieldset>

      <p aria-live="polite" className="mt-5 rounded-2xl bg-sage px-4 py-3 text-[0.95rem]">
        {valid ? (
          <>
            <strong>
              {fmt(amount)}
              {frequency === "monthly" ? ` ${copy.perMonth}` : ""}
            </strong>{" "}
            – {copy.impact[String(amount)] ?? copy.impactCustom}
          </>
        ) : (
          copy.minAmount
        )}
      </p>

      {/* Tribute gift */}
      <div className="mt-5">
        <label className="flex cursor-pointer items-start gap-3">
          <input
            type="checkbox"
            checked={tribute}
            onChange={(e) => setTribute(e.target.checked)}
            aria-expanded={tribute}
            aria-controls={`${uid}-tribute`}
            className="mt-1 size-5 accent-[var(--secondary)]"
          />
          <span className="font-semibold">{copy.tributeToggle}</span>
        </label>
        {tribute && (
          <div id={`${uid}-tribute`} className="mt-4 space-y-4 rounded-2xl bg-muted/70 p-4">
            <fieldset>
              <legend className="text-[0.95rem] font-semibold">{copy.tributeType}</legend>
              <div className="mt-2 flex flex-wrap gap-2">
                {(["memorial", "honour"] as const).map((t) => (
                  <label
                    key={t}
                    className={cn(
                      "flex min-h-11 cursor-pointer items-center gap-2 rounded-full border-2 px-4 font-semibold has-focus-visible:outline-3 has-focus-visible:outline-ring",
                      tributeType === t ? "border-ink bg-white" : "border-border",
                    )}
                  >
                    <input
                      type="radio"
                      name={`${uid}-tribute-type`}
                      checked={tributeType === t}
                      onChange={() => setTributeType(t)}
                      className="sr-only"
                    />
                    {t === "memorial" ? copy.memorial : copy.honour}
                  </label>
                ))}
              </div>
            </fieldset>
            {[
              { id: "honoree", label: copy.honoreeName, value: honoree, set: setHonoree, type: "text" },
              { id: "recipient", label: copy.recipientEmail, value: recipient, set: setRecipient, type: "email", hint: copy.recipientHint },
            ].map((f) => (
              <div key={f.id}>
                <label htmlFor={`${uid}-${f.id}`} className="block text-[0.95rem] font-semibold">
                  {f.label}
                </label>
                {f.hint && (
                  <p id={`${uid}-${f.id}-hint`} className="text-sm text-muted-foreground">
                    {f.hint}
                  </p>
                )}
                <input
                  id={`${uid}-${f.id}`}
                  type={f.type}
                  value={f.value}
                  onChange={(e) => f.set(e.target.value)}
                  aria-describedby={f.hint ? `${uid}-${f.id}-hint` : undefined}
                  className="mt-1 min-h-11 w-full rounded-xl border-2 border-input bg-white px-3 outline-none focus-visible:border-ring"
                />
              </div>
            ))}
            <div>
              <label htmlFor={`${uid}-msg`} className="block text-[0.95rem] font-semibold">
                {copy.tributeMessage}
              </label>
              <textarea
                id={`${uid}-msg`}
                rows={3}
                maxLength={300}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="mt-1 w-full rounded-xl border-2 border-input bg-white px-3 py-2 outline-none focus-visible:border-ring"
              />
            </div>
          </div>
        )}
      </div>

      {/* Payment method */}
      {frequency === "once" ? (
        <fieldset className="mt-6">
          <legend className="font-semibold">{copy.methodLabel}</legend>
          <div className="mt-3 grid grid-cols-2 gap-2">
            {(
              [
                ["swish", copy.swish, Smartphone],
                ["card", copy.card, CreditCard],
              ] as const
            ).map(([value, label, Icon]) => (
              <label
                key={value}
                className={cn(
                  "flex min-h-16 cursor-pointer flex-col items-center justify-center gap-1 rounded-2xl border-2 text-sm font-semibold has-focus-visible:outline-3 has-focus-visible:outline-offset-2 has-focus-visible:outline-ring",
                  method === value ? "border-ink bg-muted" : "border-border hover:border-input",
                )}
              >
                <input
                  type="radio"
                  name={`${uid}-method`}
                  value={value}
                  checked={method === value}
                  onChange={() => setMethod(value)}
                  className="sr-only"
                />
                <Icon aria-hidden="true" className="size-5" />
                {label}
              </label>
            ))}
          </div>
        </fieldset>
      ) : (
        <p className="mt-6 text-[0.95rem] text-muted-foreground">{copy.monthlyMethods}</p>
      )}

      <div className="mt-5">
        {activeMethod === "swish" && (
          <div className="grid items-center gap-5 rounded-2xl bg-muted/70 p-5 sm:grid-cols-[auto_1fr]">
            <div className="mx-auto rounded-2xl bg-white p-3 ring-1 ring-border">
              <QRCodeSVG
                value={swishPayload}
                size={148}
                level="M"
                title={`Swish ${swishNumber}${valid ? `, ${fmt(amount)}` : ""}`}
              />
            </div>
            <div>
              <p>{copy.swishInstructions}</p>
              <p className="mt-3 text-sm text-muted-foreground">{copy.swishNumber}</p>
              <p className="font-heading text-2xl font-extrabold tracking-wide">{swishNumber}</p>
              <p className="mt-2 text-sm text-muted-foreground">
                {copy.swishMessage}: <span className="font-semibold text-foreground">{swishMsg}</span>
              </p>
            </div>
          </div>
        )}

        {activeMethod === "card" && (
          <div className="space-y-3">
            <p className="text-[0.95rem] text-muted-foreground">{copy.cardInstructions}</p>
            <Button size="lg" className="w-full" disabled={!valid || status === "loading"} onClick={payByCard}>
              {status === "loading" ? (
                <>
                  <Loader2 aria-hidden="true" className="animate-spin" />
                  {copy.cardRedirecting}
                </>
              ) : (
                <>
                  <CreditCard aria-hidden="true" />
                  {copy.cardButton.replace(
                    "{amount}",
                    valid ? `${fmt(amount)}${frequency === "monthly" ? ` ${copy.perMonth}` : ""}` : "",
                  )}
                </>
              )}
            </Button>
            <div aria-live="polite">
              {status === "unavailable" && (
                <p className="rounded-xl bg-butter px-3 py-2 text-[0.95rem]">{copy.cardUnavailable}</p>
              )}
              {status === "error" && (
                <p className="rounded-xl bg-destructive/10 px-3 py-2 text-[0.95rem] text-destructive">{copy.cardError}</p>
              )}
            </div>
            <p className="text-center text-sm text-muted-foreground">{copy.secure}</p>
          </div>
        )}

      </div>
    </div>
  );
}

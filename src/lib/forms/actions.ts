"use server";

import { isLocale } from "@/i18n/config";
import { messages, schemas, type FormName, type FormState, type MessageCode } from "./schemas";

/** Fields that can hold several values (checkbox groups). */
const MULTI = new Set(["interests"]);

function toObject(formData: FormData) {
  const out: Record<string, string | string[]> = {};
  for (const [key, value] of formData.entries()) {
    if (typeof value !== "string" || key.startsWith("$")) continue;
    if (MULTI.has(key)) out[key] = [...((out[key] as string[]) ?? []), value];
    else out[key] = value;
  }
  return out;
}

/**
 * Sends a validated submission to FORMS_WEBHOOK_URL (Zapier, Make, a Slack
 * workflow, your CRM…). Without a webhook the submission is only logged,
 * which is fine in development but means nothing is stored in production.
 */
async function deliver(form: FormName, data: Record<string, unknown>) {
  const url = process.env.FORMS_WEBHOOK_URL;
  const payload = { form, data, receivedAt: new Date().toISOString() };
  if (!url) {
    console.warn(`[forms] FORMS_WEBHOOK_URL is not set – ${form} submission not delivered.`);
    if (process.env.NODE_ENV !== "production") console.info(payload);
    return;
  }
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(process.env.FORMS_WEBHOOK_SECRET ? { "X-Webhook-Secret": process.env.FORMS_WEBHOOK_SECRET } : {}),
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(`Webhook responded ${res.status}`);
}

async function handle(form: FormName, _prev: FormState, formData: FormData): Promise<FormState> {
  const raw = toObject(formData);
  const locale = typeof raw.locale === "string" && isLocale(raw.locale) ? raw.locale : "sv";
  const t = messages[locale];
  const values = { ...raw };
  delete values.website;
  delete values.locale;

  // Honeypot: real people never see or fill the "website" field.
  if (raw.website) return { status: "success", submittedAt: Date.now() };

  const parsed = schemas[form].safeParse(values);
  if (!parsed.success) {
    const errors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = String(issue.path[0] ?? "form");
      if (errors[key]) continue;
      const code = issue.message as MessageCode;
      errors[key] = t[code] ?? t.required;
    }
    return { status: "error", errors, values, submittedAt: Date.now() };
  }

  try {
    await deliver(form, parsed.data);
  } catch (err) {
    console.error(`[forms] delivery failed for ${form}`, err);
    return { status: "error", errors: { form: "delivery" }, values, submittedAt: Date.now() };
  }
  return { status: "success", submittedAt: Date.now() };
}

export async function submitVolunteer(prev: FormState, formData: FormData) {
  return handle("volunteer", prev, formData);
}

export async function submitBooking(prev: FormState, formData: FormData) {
  return handle("booking", prev, formData);
}

export async function submitPartner(prev: FormState, formData: FormData) {
  return handle("partner", prev, formData);
}

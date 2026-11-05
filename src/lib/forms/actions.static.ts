/**
 * Browser-only stand-in for ./actions.ts, used by the static GitHub Pages
 * preview (copied over actions.ts by scripts/prepare-static-export.mjs).
 * It validates exactly like the real server actions but never sends anything,
 * so clients can try the forms without submissions going anywhere.
 */
import { isLocale } from "@/i18n/config";
import { messages, schemas, type FormName, type FormState, type MessageCode } from "./schemas";

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

async function handle(form: FormName, _prev: FormState, formData: FormData): Promise<FormState> {
  const raw = toObject(formData);
  const locale = typeof raw.locale === "string" && isLocale(raw.locale) ? raw.locale : "sv";
  const t = messages[locale];
  const values = { ...raw };
  delete values.website;
  delete values.locale;

  const parsed = schemas[form].safeParse(values);
  if (!parsed.success) {
    const errors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = String(issue.path[0] ?? "form");
      if (!errors[key]) errors[key] = t[issue.message as MessageCode] ?? t.required;
    }
    return { status: "error", errors, values, submittedAt: Date.now() };
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

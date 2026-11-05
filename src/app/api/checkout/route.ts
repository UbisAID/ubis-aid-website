import { NextResponse, type NextRequest } from "next/server";
import Stripe from "stripe";
import { z } from "zod";
import { site } from "@/lib/site";

/**
 * Creates a Stripe Checkout session for a one-time or monthly gift.
 * Card payment is optional: without STRIPE_SECRET_KEY this returns 503 and
 * the donate widget tells the visitor to use Swish instead.
 */
const bodySchema = z.object({
  amount: z.number().int().min(50).max(100_000),
  frequency: z.enum(["once", "monthly"]),
  locale: z.enum(["sv", "en"]),
  tribute: z
    .object({
      type: z.enum(["memorial", "honour"]),
      honoree: z.string().max(100),
      message: z.string().max(300),
      recipient: z.string().max(200),
    })
    .optional(),
});

export async function POST(request: NextRequest) {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return NextResponse.json({ error: "not_configured" }, { status: 503 });

  const parsed = bodySchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "invalid" }, { status: 400 });
  const { amount, frequency, locale, tribute } = parsed.data;
  const monthly = frequency === "monthly";
  const origin = process.env.NEXT_PUBLIC_SITE_URL ?? request.nextUrl.origin;

  const name =
    locale === "sv"
      ? monthly
        ? `Månadsgåva till ${site.name}`
        : `Gåva till ${site.name}`
      : monthly
        ? `Monthly gift to ${site.name}`
        : `Gift to ${site.name}`;

  try {
    const stripe = new Stripe(key);
    const session = await stripe.checkout.sessions.create({
      mode: monthly ? "subscription" : "payment",
      locale: locale === "sv" ? "sv" : "en",
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: "sek",
            unit_amount: amount * 100,
            product_data: { name },
            ...(monthly ? { recurring: { interval: "month" as const } } : {}),
          },
        },
      ],
      ...(monthly ? {} : { submit_type: "donate" as const }),
      billing_address_collection: "auto",
      metadata: {
        frequency,
        tribute_type: tribute?.type ?? "",
        tribute_honoree: tribute?.honoree ?? "",
        tribute_message: tribute?.message ?? "",
        tribute_recipient: tribute?.recipient ?? "",
      },
      success_url: `${origin}/${locale}/stod-oss/tack?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/${locale}/stod-oss`,
    });
    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("[checkout] Stripe error", err);
    return NextResponse.json({ error: "stripe_error" }, { status: 502 });
  }
}

/**
 * Organisation settings. Replace every [PLACEHOLDER] before launch.
 * Everything that appears in the header, footer, donate page and structured
 * data is read from here, so this is the only file you need to change.
 */
export const site = {
  name: "Ubis AID",
  shortName: "Ubis AID",
  orgNumber: "802464-4109",
  city: "Malmö",
  /** Länsäte (county of registration). */
  county: "Skåne län",
  foundedYear: 2012,
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",

  /** Postal/visiting address (the registered seat is `city`/`county` above). */
  address: {
    street: "Lummelunda Bruket 506",
    postalCode: "621 71",
    city: "Visby",
    region: "Gotlands län",
    country: "SE",
  },

  contact: {
    email: "info@ubisaid.se",
    supportEmail: "info@ubisaid.se",
    pressEmail: "info@ubisaid.se",
    phone: "070-926 16 26",
    phoneHref: "+46709261626",
    sms: "070-926 16 26",
    smsHref: "+46709261626",
  },

  /**
   * Support opening hours (Europe/Stockholm). Used for the top banner,
   * the "open now" badges and the contact page. Day 0 = Sunday.
   */
  hours: {
    chatLabel: "10–12",
    chat: { days: [6, 0], open: "10:00", close: "12:00" },
    phone: { days: [1, 2, 3, 4, 5], open: "15:00", close: "21:00" },
    sms: { days: [1, 2, 3, 4, 5], open: "15:00", close: "21:00" },
  },

  /** Where the chat button goes. Point this at your chat provider. */
  chatUrl: process.env.NEXT_PUBLIC_CHAT_URL ?? "",

  /** Neutral page used by the quick-exit button. */
  quickExitUrl: "https://www.google.com/search?q=v%C3%A4der",

  giving: {
    swishNumber: "070-926 16 26",
    swishRaw: "0709261626",
    plusgiro: "[90 XX XX-X]",
    presetAmounts: [200, 300, 600],
  },

} as const;

/**
 * Pages aimed at young people. The quick-exit button is shown on these, and
 * analytics never runs on them, even with consent.
 */
export const youthRoutes = [
  "/",
  "/prata-med-oss",
  "/unga",
  "/unga-vuxna",
  "/amnen",
  "/sjalvtest",
  "/berattelser",
];

export function isYouthRoute(path: string): boolean {
  if (path === "/") return true;
  return youthRoutes.some((r) => r !== "/" && (path === r || path.startsWith(`${r}/`)));
}

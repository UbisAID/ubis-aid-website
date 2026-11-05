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
  foundedYear: 2016,
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",

  address: {
    street: "[Gatuadress 1]",
    postalCode: "[123 45]",
    city: "Malmö",
    region: "Skåne län",
    country: "SE",
  },

  contact: {
    email: "hej@exempel.se",
    supportEmail: "prata@exempel.se",
    pressEmail: "press@exempel.se",
    phone: "020-00 00 00",
    phoneHref: "+46200000000",
    sms: "71000",
    smsHref: "+4671000",
  },

  /**
   * Support opening hours (Europe/Stockholm). Used for the top banner,
   * the "open now" badges and the contact page. Day 0 = Sunday.
   */
  hours: {
    chatLabel: "18–22",
    chat: { days: [0, 1, 2, 3, 4, 5, 6], open: "18:00", close: "22:00" },
    phone: { days: [1, 2, 3, 4, 5], open: "15:00", close: "21:00" },
    sms: { days: [1, 2, 3, 4, 5], open: "15:00", close: "21:00" },
  },

  /** Where the chat button goes. Point this at your chat provider. */
  chatUrl: process.env.NEXT_PUBLIC_CHAT_URL ?? "",

  /** Neutral page used by the quick-exit button. */
  quickExitUrl: "https://www.google.com/search?q=v%C3%A4der",

  giving: {
    swishNumber: "123 456 78 90",
    swishRaw: "1234567890",
    plusgiro: "[90 XX XX-X]",
    presetAmounts: [200, 300, 600],
  },

  social: [
    { label: "Instagram", href: "https://instagram.com/" },
    { label: "TikTok", href: "https://tiktok.com/" },
    { label: "Facebook", href: "https://facebook.com/" },
    { label: "LinkedIn", href: "https://linkedin.com/" },
  ],
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

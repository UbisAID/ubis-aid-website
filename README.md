# [ORGANISATION NAME] – webbplats

Webbplats för Ubis AID, en ideell förening i Malmö (org.nr 802464-4109). Den riktar sig till unga 13–25 år som behöver stöd, och till vuxna: föräldrar, skola, kommun, företag, givare och volontärer.

Byggd med **Next.js 16 (App Router) · TypeScript · Tailwind CSS v4 · shadcn/ui (Base UI)**. Innehållet är filbaserat (MDX + JSON) och kan flyttas till ett headless CMS senare.

---

## Kom igång

Kräver Node.js 20.9 eller senare.

```bash
npm install
cp .env.example .env.local   # fyll i nycklar (alla är valfria)
npm run dev                  # http://localhost:3000 → /sv
```

| Kommando | Vad det gör |
| --- | --- |
| `npm run dev` | Utvecklingsserver |
| `npm run build` | Produktionsbygge (alla sidor genereras statiskt) |
| `npm start` | Kör produktionsbygget |
| `npm run lint` | ESLint |

## Miljövariabler

Alla variabler är valfria. Webbplatsen fungerar utan dem, med reservlägen.

| Variabel | Används till | Utan värde |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Kanoniska länkar, sitemap, Open Graph, Stripe-redirects | `http://localhost:3000` |
| `NEXT_PUBLIC_CHAT_URL` | Knappen ”Starta chatten” | Knappen leder till övriga kontaktvägar |
| `PEXELS_API_KEY` | Platshållarfoton från Pexels (hämtas på servern och cachas en vecka) | Illustrerade platshållare med fotobrief |
| `STRIPE_SECRET_KEY` | Kortbetalning via Stripe Checkout (engångs- och månadsgåvor) | Kortknappen visar ”använd Swish” |
| `FORMS_WEBHOOK_URL` | Mottagare för formulär (volontär, bokning, företag) som JSON | Inskick loggas bara, **inget sparas** |
| `FORMS_WEBHOOK_SECRET` | Skickas som `X-Webhook-Secret` | – |
| `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` | Cookiefri statistik (Plausible) efter samtycke | Ingen statistik |

Lägg aldrig hemliga nycklar i variabler som börjar med `NEXT_PUBLIC_`. Sådana variabler skickas till webbläsaren.

## Mappstruktur

```
content/                    ← redigerbart innehåll (”CMS”)
  topics/{sv,en}/*.mdx      ämnesbiblioteket (hemma, psykisk hälsa, våld …)
  stories/sv/*.mdx          berättelser
  news/sv/*.mdx             nyheter och pressmeddelanden (press: true)
  pages/{sv,en}/*.mdx       stadgar, integritetspolicy
  data/*.json               personal, styrelse, årsredovisningar, utbildningar
public/
  dokument/*.pdf            årsredovisningar (platshållare)
  icon.svg, logo.svg
src/
  app/[locale]/…            alla sidor, en mapp per URL (svenska slugs)
  app/api/checkout/         Stripe Checkout
  app/sitemap.ts, robots.ts
  proxy.ts                  skickar / → /sv
  i18n/                     språk: config, ordlistor (sv.ts, en.ts)
  lib/
    site.ts                 ★ föreningsuppgifter, öppettider, Swish, sociala länkar
    content.ts              läser MDX/JSON (byt mot CMS här)
    forms/                  zod-scheman + server actions
    consent.ts              cookie-samtycke
    pexels.ts, seo.tsx, format.ts
  components/
    ui/                     shadcn/ui-primitiver (button, input, sheet, accordion …)
    layout/                 chattbanner, header, ”Lämna sidan”, footer, cookie-banner, statistik
    sections/               hero-delar, kort, stödkanaler, effektsiffror, FAQ, foto …
    donate/                 gåvowidget (Swish-QR, kort, minnesgåvor)
    forms/                  tillgängligt formulärkit
    self-test/              självtestet ”Hur mår du hemma?”
```

## Redigera innehåll (för icke-tekniska redaktörer)

Allt innehåll ligger i mappen `content/`. Du kan redigera filerna direkt på GitHub (pennikonen). När ändringen sparas till `main` bygger Vercel om sidan automatiskt.

**Ny nyhet:** skapa `content/news/sv/min-nyhet.mdx`:

```mdx
---
title: "Rubrik"
description: "Kort ingress som visas i listor och i Google."
date: "2026-11-20"
tag: "Aktiviteter"
press: false          # true = visas även i pressrummet
---

Brödtext i **Markdown**. Länka gärna: [Stötta oss](/sv/stod-oss).
```

**Ny berättelse:** kopiera en fil i `content/stories/sv/`. Fyll alltid i `consent`, alltså hur samtycke har getts. `photoQuery` är ett Pexels-sökord för en stämningsbild. Använd aldrig ett ansikte, eftersom personen inte ska kunna kännas igen.

**Nytt ämne:** kopiera en fil i `content/topics/sv/`. Välj `icon` (`house`, `cloud`, `shield`, `message`, `book`, `sparkles`, `moon`) och `color` (`peach`, `sage`, `lavender`, `butter`, `sky`).

**Översättningar:** lägg samma filnamn under `en/` i stället för `sv/`. Saknas en översättning visas den svenska texten med en notis. I JSON skriver du `{ "sv": "…", "en": "…" }`.

**Specialrutor i MDX:** `<Callout>…</Callout>` (grön infobox) och `<Tip title="…">…</Tip>` (gul tipsruta).

**Övrig sidtext:** sidtexterna ligger överst i varje `src/app/[locale]/**/page.tsx` i ett objekt `copy = { sv: {…}, en: {…} }`. Gemensamma texter (meny, knappar, formulär, footer) finns i `src/i18n/dictionaries/`.

### Flytta till ett headless CMS (t.ex. Sanity)

Sidorna läser allt innehåll via funktionerna i `src/lib/content.ts` (`getTopics`, `getEntry`, `getData` …). Behåll funktionssignaturerna och byt implementationen mot CMS-anrop. Använd typerna `TopicMeta`, `StoryMeta`, `EventItem` med flera som schema. För att publicera direkt kan du lägga till en revalidate-webhook (`revalidateTag`).

## Viktiga funktioner

- **Lämna sidan snabbt:** en knapp i den klistriga headern på alla ungdomssidor (`youthRoutes` i `src/lib/site.ts`), plus Esc två gånger. `location.replace()` ersätter historikposten och skickar till `site.quickExitUrl`. `Referrer-Policy: no-referrer` gör att målsidan inte ser varifrån besökaren kom.
- **Chattbanner** överst på alla sidor. Öppettiderna i `site.hours` styr också ”Öppet nu”-märkningarna, som räknas ut i webbläsaren i svensk tid.
- **Självtest:** körs bara i webbläsaren. Svaren finns i komponentens state och sparas eller skickas aldrig.
- **GDPR:** icke-nödvändigt är avvisat tills besökaren aktivt tillåter det. Båda valen har samma visuella vikt. Statistik laddas aldrig på ungdomssidor, inte heller med samtycke. Inställningarna kan öppnas igen från footern.
- **Gåvor:** engångsgåva eller månadsgåva, 200/300/600 kr eller eget belopp, minnes- och hyllningsgåvor, Swish-QR och kort via Stripe.
- **Formulär:** server actions med zod-validering, felsammanfattning som får fokus, behållna värden, honeypot mot spam och obligatoriskt GDPR-samtycke.
- **SEO:** metadata och Open Graph per sida, `hreflang`, `sitemap.xml`, `robots.txt`, dynamisk OG-bild och JSON-LD (`NGO`, `Article`, `NewsArticle`, `Course`, `FAQPage`).

## Stripe

1. Skapa ett Stripe-konto, aktivera SEK och lägg `STRIPE_SECRET_KEY` i Vercel.
2. Inget mer behövs för att ta emot betalningar. Checkout skapas i `src/app/api/checkout/route.ts`.
3. Minnesgåvornas uppgifter (namn, hälsning, mottagare) sparas i sessionens `metadata`. Lägg till en Stripe-webhook om gåvobevis ska skickas automatiskt.

## Swish

QR-koden använder Swish ”prefilled”-format (`C<nummer>;<belopp>;<meddelande>;<lås>`). **Kontrollera formatet mot Swish aktuella specifikation före lansering**, eller generera koden via Swish QR-API. Swish-numret sätts i `site.giving`.

## Driftsättning på Vercel

1. Pusha repot till GitHub och importera det på [vercel.com/new](https://vercel.com/new). Next.js upptäcks automatiskt.
2. Lägg in miljövariablerna under **Settings → Environment Variables**.
3. Koppla domänen och sätt `NEXT_PUBLIC_SITE_URL` till den.
4. Varje push till `main` driftsätts. Pull requests får förhandsvisningslänkar.

Sidorna uppdateras vid varje deploy.

## Förhandsvisning för kunder (GitHub Pages)

Varje push till `main` bygger en statisk förhandsvisning och publicerar den på
**https://ubisaid.github.io/ubis-aid-preview/** (workflow: `.github/workflows/preview.yml`).

- Källkoden stannar i det privata repot. Bara de färdiga filerna publiceras i det publika repot `UbisAID/ubis-aid-preview`.
- I förhandsvisningen validerar formulären men skickar ingenting, kortbetalning är avstängd och sidan är dold för sökmotorer.
- Byggsteget kör `STATIC_EXPORT=1` (se `next.config.ts`) och skripten i `scripts/`. Kör inte `scripts/prepare-static-export.mjs` lokalt – det tar bort filer.
- Secrets i det privata repot: `PREVIEW_DEPLOY_KEY` (krävs) och `PEXELS_API_KEY` (valfri).

## Innan lansering

- [ ] Ersätt alla `[PLATSHÅLLARE]` i `src/lib/site.ts` (adress, Swish, plusgiro, öppettider, sociala länkar).
- [ ] Byt `public/icon.svg` och `public/logo.svg` mot riktig logotyp.
- [ ] Byt Pexels-bilderna mot egna foton med modellsamtycke (komponenten `Photo` i `src/components/sections/photo.tsx`).
- [ ] Byt platshållarna för 90-konto, Svensk Insamlingskontroll och Giva Sverige (`trust-badges.tsx`) mot officiella märken. Visa dem först när föreningen är godkänd.
- [ ] Ersätt effektsiffrorna på startsidan och fördelningen på gåvosidan med verkliga data.
- [ ] Ladda upp riktiga årsredovisningar i `public/dokument/` och uppdatera `content/data/reports.json`.
- [ ] Låt jurist granska integritetspolicyn och stadgarna. Fyll i lagringstider `[X]`.
- [ ] Koppla chatten (`NEXT_PUBLIC_CHAT_URL`) och formulären (`FORMS_WEBHOOK_URL`).
- [ ] Verifiera Swish-QR med en riktig betalning.
- [ ] Kör Lighthouse på produktions-URL:en.

## Kvalitet och tester

Under utvecklingen har varje sida kontrollerats med:

- **axe-core** (WCAG 2.1 A/AA + best practice). Inga anmärkningar på någon sida.
- **Horisontell overflow** vid 390 px på alla sidor, och för header och startsida vid 320–1440 px. Ingen overflow.
- **Interaktionstester** i headless Edge: cookie-samtycke, formulärvalidering och lyckat inskick, självtestet hela vägen, gåvowidget (QR, kort-fallback, månadsgåva), Lämna sidan, mobilmeny och språkbyte.
- `npm run lint`, `tsc --noEmit` och `npm run build` utan fel.
- **Lighthouse** (mobil, lokal produktionsserver): Accessibility 100, Best Practices 100 och SEO 100 på alla testade sidor. Performance låg på 82–93 med stora variationer mellan körningar. Startsidan och Om oss låg lägst (82). Uppmätt LCP lokalt är cirka 0,3 s, men Lighthouses simulerade långsamma 4G drar ner poängen. Mät igen på Vercel-URL:en (CDN, Brotli, HTTP/2). Behövs mer: lazy-loada mobilmenyn (Base UI Dialog) och använd mindre hero-bilder.

Designmönstren har researchats på Mobbin, bland annat Headspace (split-hero), GoFundMe och PayPal (gåvoflöde), Apple Health (frågeformulär), Maze (målgruppskort) samt Complex Law och Vanta (footer med förtroendemärken).

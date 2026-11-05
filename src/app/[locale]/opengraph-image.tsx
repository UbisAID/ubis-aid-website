import { readFile } from "node:fs/promises";
import path from "node:path";
import { ImageResponse } from "next/og";
import { isLocale, locales } from "@/i18n/config";
import { site } from "@/lib/site";

export const dynamic = "force-static";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export const alt = site.name;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const text = {
  sv: { title: "Du är inte ensam.", sub: "Gratis och anonymt stöd för unga 13–25 år" },
  en: { title: "You are not alone.", sub: "Free, anonymous support for young people aged 13–25" },
};

export default async function Image({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = text[isLocale(locale) ? locale : "sv"];
  const logo = await readFile(path.join(process.cwd(), "public/brand/ubis-aid-logo.png"));
  const logoSrc = `data:image/png;base64,${logo.toString("base64")}`;
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 80,
          background: "#fbf7f0",
          position: "relative",
        }}
      >
        <div style={{ position: "absolute", top: -160, right: -120, width: 560, height: 560, borderRadius: 9999, background: "#fde4d3" }} />
        <div style={{ position: "absolute", bottom: -200, left: 420, width: 480, height: 480, borderRadius: 9999, background: "#ddefe7" }} />
        {/* eslint-disable-next-line @next/next/no-img-element -- ImageResponse needs a plain img */}
        <img src={logoSrc} alt={site.name} width={267} height={140} />
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 104, fontWeight: 800, color: "#0e1a33", letterSpacing: -3 }}>{t.title}</div>
          <div style={{ fontSize: 40, color: "#4f5568", marginTop: 16 }}>{t.sub}</div>
        </div>
      </div>
    ),
    size,
  );
}

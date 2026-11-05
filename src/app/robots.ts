import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  // The GitHub Pages client preview must never be indexed.
  if (process.env.NEXT_PUBLIC_PREVIEW === "1") return { rules: [{ userAgent: "*", disallow: "/" }] };
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/api/", "/*/stod-oss/tack"] }],
    sitemap: `${site.url}/sitemap.xml`,
    host: site.url,
  };
}

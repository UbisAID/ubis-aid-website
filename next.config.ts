import type { NextConfig } from "next";

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  // Never leak which support page a young person was on to external sites.
  { key: "Referrer-Policy", value: "no-referrer" },
  { key: "X-Frame-Options", value: "DENY" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
  },
];

/**
 * STATIC_EXPORT=1 builds a plain static site for the GitHub Pages client
 * preview (see .github/workflows/preview.yml). Server features (proxy, API
 * routes, server actions, image optimisation, headers) are unavailable there.
 */
const isStaticExport = process.env.STATIC_EXPORT === "1";

const nextConfig: NextConfig = {
  // The site is fully static per locale, so classic static generation is used
  // instead of Cache Components.
  ...(isStaticExport && {
    output: "export",
    basePath: process.env.NEXT_PUBLIC_BASE_PATH || undefined,
    trailingSlash: true,
  }),
  images: {
    unoptimized: isStaticExport,
    formats: ["image/avif", "image/webp"],
    qualities: [60, 75],
    remotePatterns: [{ protocol: "https", hostname: "images.pexels.com", pathname: "/photos/**" }],
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  ...(!isStaticExport && {
    async headers() {
      return [{ source: "/:path*", headers: securityHeaders }];
    },
  }),
};

export default nextConfig;

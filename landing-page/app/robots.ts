import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // Thank-you is a conversion surface, not content. Portal / admin /
        // sign-in / sign-up redirect to a noindex subdomain anyway, but we
        // keep them out of crawl budget too. /api is never crawlable.
        disallow: [
          "/api/",
          "/auth/",
          "/admin",
          "/admin/",
          "/portal",
          "/portal/",
          "/sign-in",
          "/sign-up",
          "/thank-you",
          "/_next/",
          "/test-results/",
        ],
      },
      // Block AI scrapers we do not want ingesting our copy. Keep Googlebot,
      // Bingbot, and friends unblocked above.
      { userAgent: "GPTBot", disallow: "/" },
      { userAgent: "CCBot", disallow: "/" },
      { userAgent: "Google-Extended", disallow: "/" },
      { userAgent: "anthropic-ai", disallow: "/" },
      { userAgent: "ClaudeBot", disallow: "/" },
    ],
    sitemap: "https://www.easytradesetup.com/sitemap.xml",
    host: "https://www.easytradesetup.com",
  };
}

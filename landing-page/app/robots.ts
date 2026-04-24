import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // Thank-you is a conversion surface, not content — keep it out of
        // Google. API is never crawlable. Test-results and build artifacts
        // should never reach the edge but blocked explicitly as defense.
        disallow: ["/api/", "/thank-you", "/_next/", "/test-results/"],
      },
      // Block AI scrapers we do not want ingesting our copy. Keep Googlebot,
      // Bingbot, and friends unblocked above.
      { userAgent: "GPTBot", disallow: "/" },
      { userAgent: "CCBot", disallow: "/" },
      { userAgent: "Google-Extended", disallow: "/" },
      { userAgent: "anthropic-ai", disallow: "/" },
      { userAgent: "ClaudeBot", disallow: "/" },
    ],
    sitemap: "https://easytradesetup.com/sitemap.xml",
    host: "https://easytradesetup.com",
  };
}

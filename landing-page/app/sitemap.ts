import type { MetadataRoute } from "next";
import { strategies } from "@/lib/strategies";

const base = "https://easytradesetup.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const staticRoutes = [
    "",
    "/product",
    "/pricing",
    "/strategy",
    "/docs",
    "/docs/install",
    "/docs/risk-calc",
    "/docs/faq",
    "/docs/changelog",
    "/updates",
    "/research",
    "/about",
    "/contact",
    "/checkout",
    "/legal/terms",
    "/legal/privacy",
    "/legal/refund",
    "/legal/disclaimer",
  ].map((p) => ({
    url: `${base}${p}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: p === "" ? 1 : 0.7,
  }));

  const strategyRoutes = strategies.map((s) => ({
    url: `${base}/strategy/${s.slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [...staticRoutes, ...strategyRoutes];
}

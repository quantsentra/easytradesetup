import type { MetadataRoute } from "next";
import { strategies } from "@/lib/strategies";

const base = "https://easytradesetup.com";

type CF = "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";

const priorityMap: Array<[string, number, CF]> = [
  ["",                    1.0, "weekly"],
  ["/product",            0.9, "weekly"],
  ["/pricing",            0.9, "weekly"],
  ["/checkout",           0.9, "weekly"],
  ["/compare",            0.8, "monthly"],
  ["/case-studies",       0.8, "monthly"],
  ["/sample",             0.8, "monthly"],
  ["/strategy",           0.8, "monthly"],
  ["/updates",            0.7, "daily"],
  ["/docs",               0.6, "monthly"],
  ["/docs/install",       0.6, "monthly"],
  ["/docs/risk-calc",     0.6, "monthly"],
  ["/docs/faq",           0.7, "monthly"],
  ["/docs/changelog",     0.5, "weekly"],
  ["/about",              0.6, "monthly"],
  ["/contact",            0.5, "monthly"],
  ["/legal/terms",        0.3, "yearly"],
  ["/legal/privacy",      0.3, "yearly"],
  ["/legal/refund",       0.4, "yearly"],
  ["/legal/disclaimer",   0.5, "yearly"],
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const staticRoutes = priorityMap.map(([p, priority, changeFrequency]) => ({
    url: `${base}${p}`,
    lastModified: now,
    changeFrequency,
    priority,
  }));

  const strategyRoutes = strategies.map((s) => ({
    url: `${base}/strategy/${s.slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [...staticRoutes, ...strategyRoutes];
}

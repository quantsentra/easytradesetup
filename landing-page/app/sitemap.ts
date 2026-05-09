import type { MetadataRoute } from "next";
import { allPostsSorted } from "@/lib/blog";

const base = "https://www.easytradesetup.com";

type CF = "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";

const priorityMap: Array<[string, number, CF]> = [
  ["",                    1.0, "weekly"],
  ["/product",            0.9, "weekly"],
  ["/pricing",            0.9, "weekly"],
  ["/checkout",           0.9, "weekly"],
  ["/sample",             0.8, "monthly"],
  // Programmatic SEO — per-market landing pages.
  ["/indicator/nifty",     0.85, "monthly"],
  ["/indicator/banknifty", 0.85, "monthly"],
  ["/indicator/spx",       0.85, "monthly"],
  ["/indicator/nasdaq",    0.8,  "monthly"],
  ["/indicator/gold",      0.8,  "monthly"],
  ["/indicator/btc",       0.8,  "monthly"],
  ["/compare",            0.7, "monthly"],
  // Blog — index hub + each article from lib/blog.ts.
  ["/blog",               0.7, "weekly"],
  ["/docs/install",       0.6, "monthly"],
  ["/docs/faq",           0.6, "monthly"],
  ["/about",              0.6, "monthly"],
  ["/contact",            0.5, "monthly"],
  ["/legal/terms",        0.3, "yearly"],
  ["/legal/privacy",      0.3, "yearly"],
  ["/legal/refund",       0.4, "yearly"],
  ["/legal/disclaimer",   0.5, "yearly"],
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const staticEntries = priorityMap.map(([p, priority, changeFrequency]) => ({
    url: `${base}${p}`,
    lastModified: now,
    changeFrequency,
    priority,
  }));
  // Each blog article gets priority 0.6, lastModified = its actual publish/edit
  // date so Google sees freshness without a global stamp on every URL.
  const blogEntries: MetadataRoute.Sitemap = allPostsSorted().map((p) => ({
    url:            `${base}/blog/${p.slug}`,
    lastModified:   new Date(p.dateModified ?? p.datePublished),
    changeFrequency: "monthly" as CF,
    priority:       0.6,
  }));
  return [...staticEntries, ...blogEntries];
}

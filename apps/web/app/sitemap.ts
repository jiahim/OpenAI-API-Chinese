import type { MetadataRoute } from "next";

import { navigation } from "@/lib/documents";
import { siteOrigin } from "@/lib/site";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = navigation().flatMap((section) => [
    section.route,
    ...section.groups.flatMap((group) => group.entries.map((entry) => entry.route)),
  ]);
  return [
    { url: siteOrigin, changeFrequency: "weekly", priority: 1 },
    ...(["zh", "en"] as const).flatMap((locale) =>
      routes.map((route) => ({
        url: `${siteOrigin}/${locale}${route}`,
        changeFrequency: "weekly" as const,
        priority: route === "/api/docs" || route === "/api/reference" ? 0.9 : 0.6,
      })),
    ),
  ];
}

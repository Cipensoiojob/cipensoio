import type { MetadataRoute } from "next";
import { getPublishedListingSlugs } from "@/lib/listings";
import { BRANCH_SLUGS, SITE_URL } from "@/lib/types";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const listings = await getPublishedListingSlugs();

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified: now,
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${SITE_URL}/pubblica`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/chi-siamo`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${SITE_URL}/privacy-policy`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${SITE_URL}/cookie-policy`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    ...BRANCH_SLUGS.map((branch) => ({
      url: `${SITE_URL}/${branch}`,
      lastModified: now,
      changeFrequency: "daily" as const,
      priority: 0.9,
    })),
  ];

  const listingRoutes: MetadataRoute.Sitemap = listings.map((item) => ({
    url: `${SITE_URL}/annunci/${item.slug}`,
    lastModified: new Date(item.created_at),
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  return [...staticRoutes, ...listingRoutes];
}

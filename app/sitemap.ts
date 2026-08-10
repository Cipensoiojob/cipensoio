import type { MetadataRoute } from "next";
import {
  getCategoryCityPairs,
  getPublishedListingSlugs,
} from "@/lib/listings";
import { mergeSeoHubs, seoHubHref } from "@/lib/seo";
import { SITE_URL } from "@/lib/types";
import { VERTICAL_SLUGS } from "@/lib/verticals";

/** Cache 1h: Google riceve risposta veloce anche se Supabase è lento. */
export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  let listings: { slug: string; created_at: string }[] = [];
  let pairs: { category: string; city: string }[] = [];

  try {
    const result = await Promise.race([
      Promise.all([getPublishedListingSlugs(), getCategoryCityPairs()]),
      new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error("sitemap-timeout")), 8000),
      ),
    ]);
    listings = result[0];
    pairs = result[1];
  } catch {
    // Sitemap statica comunque valida se il DB non risponde in tempo.
  }

  const hubs = mergeSeoHubs(pairs);

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified: now,
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${SITE_URL}/disponibili`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.92,
    },
    {
      url: `${SITE_URL}/cerca`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.95,
    },
    {
      url: `${SITE_URL}/pubblica`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.85,
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
    ...VERTICAL_SLUGS.map((slug) => ({
      url: `${SITE_URL}/${slug}`,
      lastModified: now,
      changeFrequency: "daily" as const,
      priority: 0.9,
    })),
  ];

  const hubRoutes: MetadataRoute.Sitemap = hubs.map((hub) => ({
    url: `${SITE_URL}${seoHubHref(hub)}`,
    lastModified: now,
    changeFrequency: "daily",
    priority: 0.8,
  }));

  const listingRoutes: MetadataRoute.Sitemap = listings.map((item) => ({
    url: `${SITE_URL}/annunci/${item.slug}`,
    lastModified: new Date(item.created_at),
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  return [...staticRoutes, ...hubRoutes, ...listingRoutes];
}

import { slugify } from "@/lib/slug";
import type { MacroBranch } from "@/lib/types";
import { BRANCH_SLUGS, isBranchSlug } from "@/lib/types";

/** Segmenti riservati (non sono categorie SEO). */
export const RESERVED_PATH_SEGMENTS = new Set([
  ...BRANCH_SLUGS,
  "annunci",
  "admin",
  "pubblica",
  "cerca",
  "disponibili",
  "chi-siamo",
  "privacy-policy",
  "cookie-policy",
  "assistenza-care",
  "babysitter",
  "pet-sitter",
  "professionisti",
  "lavoro",
  "persona-assistenza",
  "pet-home",
  "lavoro-tradizionale",
  "api",
  "_next",
  "favicon.ico",
  "robots.txt",
  "sitemap.xml",
]);

export type SeoHub = {
  categorySlug: string;
  citySlug: string;
  category: string;
  city: string;
  branch?: MacroBranch;
};

/** Hub prioritari anche senza annunci (long-tail SEO). */
export const PRIORITY_SEO_HUBS: SeoHub[] = [
  hub("badante", "Milano"),
  hub("badante", "Roma"),
  hub("badante", "Torino"),
  hub("badante", "Napoli"),
  hub("badante", "Segrate"),
  hub("badante", "Monza"),
  hub("colf", "Milano"),
  hub("colf", "Roma"),
  hub("idraulico", "Milano"),
  hub("idraulico", "Roma"),
  hub("elettricista", "Milano"),
  hub("babysitter", "Milano"),
  hub("babysitter", "Roma"),
  hub("oss", "Milano"),
  hub("dogsitter", "Milano"),
  hub("dogsitter", "Bologna"),
  hub("dogsitter", "Roma"),
  hub("catsitter", "Milano"),
  hub("giardinaggio", "Milano"),
  hub("ai_engineer", "Italia"),
  hub("sviluppatore", "Milano"),
  hub("commerciale", "Milano"),
  hub("ristorazione", "Milano"),
];

function hub(category: string, city: string): SeoHub {
  return {
    category,
    city,
    categorySlug: categoryToSlug(category),
    citySlug: cityToSlug(city),
  };
}

export function categoryToSlug(category: string): string {
  return slugify(category.replace(/_/g, "-")) || "categoria";
}

export function categoryFromSlug(slug: string): string {
  return slug.trim().toLowerCase().replace(/-/g, "_");
}

export function cityToSlug(city: string): string {
  return slugify(city) || "italia";
}

/** Query città da slug URL (milano → milano). */
export function cityQueryFromSlug(slug: string): string {
  return slug.replace(/-/g, " ").trim();
}

export function formatCategoryLabel(category: string): string {
  return category
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

export function formatCityLabel(city: string): string {
  return city
    .split(/\s+/)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(" ");
}

export function isReservedCategorySegment(segment: string): boolean {
  return RESERVED_PATH_SEGMENTS.has(segment.toLowerCase());
}

export function seoHubHref(hub: Pick<SeoHub, "categorySlug" | "citySlug">): string {
  return `/${hub.categorySlug}/${hub.citySlug}`;
}

export function buildLocalSeoTitle(category: string, city: string): string {
  return `${formatCategoryLabel(category)} a ${formatCityLabel(city)}`;
}

export function buildLocalSeoDescription(
  category: string,
  city: string,
  count: number,
): string {
  const label = formatCategoryLabel(category);
  const cityLabel = formatCityLabel(city);
  if (count > 0) {
    return `${count} annunci di ${label} a ${cityLabel} su CiPensoIo. Contatti protetti, pubblicazione gratis.`;
  }
  return `Cerchi o offri ${label} a ${cityLabel}? Pubblica gratis su CiPensoIo — annunci locali moderati.`;
}

export function mergeSeoHubs(
  fromData: Array<{ category: string; city: string }>,
): SeoHub[] {
  const map = new Map<string, SeoHub>();

  for (const h of PRIORITY_SEO_HUBS) {
    map.set(`${h.categorySlug}/${h.citySlug}`, h);
  }

  for (const row of fromData) {
    const category = row.category.trim();
    const city = row.city.trim();
    if (!category || !city) continue;
    const item = hub(category, city);
    if (isBranchSlug(item.categorySlug)) continue;
    map.set(`${item.categorySlug}/${item.citySlug}`, item);
  }

  return [...map.values()];
}

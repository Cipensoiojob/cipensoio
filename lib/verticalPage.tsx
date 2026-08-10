import type { Metadata } from "next";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { VerticalPageView } from "@/components/VerticalPageView";
import { getListings } from "@/lib/listings";
import { getVertical, type VerticalSlug } from "@/lib/verticals";

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

function first(
  value: string | string[] | undefined,
): string | undefined {
  if (Array.isArray(value)) return value[0];
  return value;
}

export function verticalMetadata(slug: VerticalSlug): Metadata {
  const vertical = getVertical(slug)!;
  return {
    title: vertical.label,
    description: vertical.description,
    alternates: { canonical: vertical.href },
  };
}

export async function renderVerticalPage(
  slug: VerticalSlug,
  searchParams: SearchParams,
) {
  const vertical = getVertical(slug)!;
  const query = await searchParams;
  const categoriaRaw = first(query.categoria)
    ?.trim()
    .toLowerCase()
    .replace(/-/g, "_");
  const categoryFilter =
    categoriaRaw && vertical.categories.includes(categoriaRaw)
      ? categoriaRaw
      : undefined;

  const categories = categoryFilter
    ? [categoryFilter]
    : [...vertical.categories];

  const [
    { listings: offro, fromFallback: fb1 },
    { listings: cerco, fromFallback: fb2 },
  ] = await Promise.all([
    getListings({
      branch: vertical.macroBranch,
      categories,
      intent: "offro",
      limit: 30,
    }),
    getListings({
      branch: vertical.macroBranch,
      categories,
      intent: "cerco",
      limit: 30,
    }),
  ]);

  return (
    <>
      <SiteHeader />
      <VerticalPageView
        vertical={vertical}
        offro={offro}
        cerco={cerco}
        fromFallback={fb1 || fb2}
        categoryFilter={categoryFilter}
      />
      <SiteFooter />
    </>
  );
}

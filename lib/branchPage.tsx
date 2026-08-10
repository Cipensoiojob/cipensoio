import type { Metadata } from "next";
import { BranchPageView } from "@/components/BranchPageView";
import { parseIntentParam } from "@/components/BranchFilters";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { getCategoryCityPairs, getListings } from "@/lib/listings";
import { mergeSeoHubs } from "@/lib/seo";
import type { MacroBranch, WorkType } from "@/lib/types";
import { WORK_TYPES, getBranchMeta } from "@/lib/types";

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

function firstParam(
  value: string | string[] | undefined,
): string | undefined {
  if (Array.isArray(value)) return value[0];
  return value;
}

function parseWorkType(value: string | undefined): WorkType | undefined {
  if (!value) return undefined;
  return (WORK_TYPES as string[]).includes(value)
    ? (value as WorkType)
    : undefined;
}

export async function renderBranchPage(
  branchId: MacroBranch,
  searchParams: SearchParams,
) {
  const meta = getBranchMeta(branchId);
  const query = await searchParams;
  const q = firstParam(query.q)?.trim() || undefined;
  const citta = firstParam(query.citta)?.trim() || undefined;
  const zona = firstParam(query.zona)?.trim() || undefined;
  const tipo = parseWorkType(firstParam(query.tipo));
  const intento = parseIntentParam(firstParam(query.intento));

  const [{ listings, fromFallback }, pairs] = await Promise.all([
    getListings({
      branch: branchId,
      q,
      city: citta,
      zone: zona,
      workType: tipo,
      intent: intento,
      limit: 40,
    }),
    getCategoryCityPairs(),
  ]);

  const hubs = mergeSeoHubs(pairs).filter((h) =>
    (meta.categories as readonly string[]).includes(h.category),
  );

  return (
    <>
      <SiteHeader />
      <BranchPageView
        branchId={branchId}
        listings={listings}
        fromFallback={fromFallback}
        filters={{ q, citta, zona, tipo, intento }}
        hubs={hubs.length ? hubs : mergeSeoHubs(pairs).slice(0, 8)}
      />
      <SiteFooter />
    </>
  );
}

export function branchMetadata(branchId: MacroBranch): Metadata {
  const meta = getBranchMeta(branchId);
  return {
    title: meta.label,
    description: meta.description,
    alternates: {
      canonical: `/${
        branchId === "persona_assistenza"
          ? "persona-assistenza"
          : branchId === "pet_home"
            ? "pet-home"
            : "lavoro-tradizionale"
      }`,
    },
  };
}

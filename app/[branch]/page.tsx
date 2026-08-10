import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BranchFilters } from "@/components/BranchFilters";
import { ListingResults } from "@/components/ListingResults";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { getListings } from "@/lib/listings";
import type { WorkType } from "@/lib/types";
import {
  BRANCH_SLUGS,
  BRANCH_SLUG_TO_ID,
  WORK_TYPES,
  getBranchMeta,
  isBranchSlug,
} from "@/lib/types";

type Props = {
  params: Promise<{ branch: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

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

export function generateStaticParams() {
  return BRANCH_SLUGS.map((branch) => ({ branch }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { branch: branchSlug } = await params;
  if (!isBranchSlug(branchSlug)) {
    return { title: "Ramo non trovato" };
  }

  const meta = getBranchMeta(BRANCH_SLUG_TO_ID[branchSlug]);
  return {
    title: meta.label,
    description: meta.description,
    alternates: { canonical: `/${branchSlug}` },
  };
}

export default async function BranchPage({ params, searchParams }: Props) {
  const { branch: branchSlug } = await params;
  if (!isBranchSlug(branchSlug)) notFound();

  const branchId = BRANCH_SLUG_TO_ID[branchSlug];
  const meta = getBranchMeta(branchId);
  const query = await searchParams;

  const q = firstParam(query.q)?.trim() || undefined;
  const citta = firstParam(query.citta)?.trim() || undefined;
  const zona = firstParam(query.zona)?.trim() || undefined;
  const tipo = parseWorkType(firstParam(query.tipo));

  const { listings, fromFallback } = await getListings({
    branch: branchId,
    q,
    city: citta,
    zone: zona,
    workType: tipo,
    limit: 40,
  });

  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <section className="relative isolate overflow-hidden border-b border-[var(--line)]">
          <div
            className="pointer-events-none absolute inset-0 -z-10"
            style={{
              background: `radial-gradient(90%_70%_at_15%_0%, ${meta.accent} 0%, transparent 55%), linear-gradient(180deg, color-mix(in srgb, ${meta.accent} 55%, white) 0%, var(--background) 80%)`,
            }}
            aria-hidden
          />
          <div className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
            <p
              className="text-sm font-semibold uppercase tracking-wide"
              style={{ color: meta.color }}
            >
              Macro-ramo
            </p>
            <h1 className="mt-2 font-[family-name:var(--font-syne)] text-3xl font-semibold tracking-tight sm:text-4xl">
              {meta.label}
            </h1>
            <p className="mt-3 max-w-2xl text-[var(--muted)]">
              {meta.description}
            </p>
          </div>
        </section>

        <section className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
          <BranchFilters
            action={`/${branchSlug}`}
            values={{ q, citta, zona, tipo }}
            accentColor={meta.color}
          />

          <div className="mt-8 flex items-end justify-between gap-3">
            <p className="text-sm text-[var(--muted)]">
              {listings.length} annunci
              {fromFallback ? " · anteprima demo" : ""}
            </p>
          </div>

          <div className="mt-4">
            <ListingResults
              listings={listings}
              emptyMessage="Nessun annuncio in questo ramo con i filtri scelti. Prova ad azzerare o pubblica tu il primo."
            />
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}

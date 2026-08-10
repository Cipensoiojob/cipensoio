import Link from "next/link";
import { BranchFilters } from "@/components/BranchFilters";
import { EasySearchIntents } from "@/components/EasySearchIntents";
import { ListingSections } from "@/components/ListingSections";
import { ListingResults } from "@/components/ListingResults";
import { SeoHubLinks } from "@/components/SeoHubLinks";
import type { ListingPublic, MacroBranch } from "@/lib/types";
import { BRANCH_ID_TO_SLUG, getBranchMeta } from "@/lib/types";
import type { SeoHub } from "@/lib/seo";

type FilterValues = {
  q?: string;
  citta?: string;
  zona?: string;
  tipo?: string;
  intento?: string;
};

type Props = {
  branchId: MacroBranch;
  listings: ListingPublic[];
  fromFallback: boolean;
  filters: FilterValues;
  hubs: SeoHub[];
};

export function BranchPageView({
  branchId,
  listings,
  fromFallback,
  filters,
  hubs,
}: Props) {
  const meta = getBranchMeta(branchId);
  const branchSlug = BRANCH_ID_TO_SLUG[branchId];
  const isAssistenza = branchId === "persona_assistenza";
  const hasIntentFilter = Boolean(filters.intento);
  const hasQueryFilter = Boolean(filters.q?.trim());
  const useSections = isAssistenza && !hasIntentFilter && !hasQueryFilter;

  return (
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
            {isAssistenza
              ? "Offro lavoro e Cerco lavoro sono separati. Badante e babysitter anche: scegli cosa ti serve."
              : meta.description}
          </p>
          <Link
            href={`/pubblica?ramo=${branchSlug}`}
            className="mt-6 inline-flex min-h-12 items-center rounded-xl px-5 py-3 text-base font-semibold text-white"
            style={{ backgroundColor: meta.color }}
          >
            Pubblica gratis in questo ramo
          </Link>
        </div>
      </section>

      {isAssistenza && (
        <div className="border-b border-[var(--line)] bg-white/50">
          <EasySearchIntents />
        </div>
      )}

      <section className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
        <BranchFilters
          action={`/${branchSlug}`}
          values={filters}
          accentColor={meta.color}
        />

        <div className="mt-8 flex items-end justify-between gap-3">
          <p className="text-sm text-[var(--muted)]">
            {listings.length} annunci
            {fromFallback ? " · anteprima demo" : ""}
          </p>
        </div>

        <div className="mt-4">
          {useSections ? (
            <ListingSections
              listings={listings}
              splitCareCategories
              emptyMessage="Nessun annuncio qui. Pubblica tu il primo — basta telefono e WhatsApp."
            />
          ) : (
            <ListingResults
              listings={listings}
              emptyMessage="Nessun annuncio qui. Pubblica tu il primo — basta telefono e WhatsApp."
            />
          )}
        </div>

        {hubs.length > 0 && (
          <div className="mt-12">
            <SeoHubLinks
              title="Annunci per città e categoria"
              hubs={hubs}
            />
          </div>
        )}
      </section>
    </main>
  );
}

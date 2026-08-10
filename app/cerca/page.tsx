import type { Metadata } from "next";
import Link from "next/link";
import { BranchFilters, parseIntentParam } from "@/components/BranchFilters";
import { EasySearchIntents } from "@/components/EasySearchIntents";
import { ListingSections } from "@/components/ListingSections";
import { ListingResults } from "@/components/ListingResults";
import { SeoHubLinks } from "@/components/SeoHubLinks";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import {
  getCategoryCityPairs,
  getListings,
  getPublishedCount,
} from "@/lib/listings";
import { mergeSeoHubs } from "@/lib/seo";
import type { WorkType } from "@/lib/types";
import { WORK_TYPES } from "@/lib/types";

type Props = {
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

export const metadata: Metadata = {
  title: "Cerca annunci",
  description:
    "Cerca badanti, pet sitter e lavoro vicino a te su CiPensoIo. Filtra per città, zona e tipo di contratto.",
  alternates: { canonical: "/cerca" },
};

export default async function CercaPage({ searchParams }: Props) {
  const query = await searchParams;
  const q = firstParam(query.q)?.trim() || undefined;
  const citta = firstParam(query.citta)?.trim() || undefined;
  const zona = firstParam(query.zona)?.trim() || undefined;
  const tipo = parseWorkType(firstParam(query.tipo));
  const intento = parseIntentParam(firstParam(query.intento));

  const [{ listings, fromFallback }, pairs, count] = await Promise.all([
    getListings({
      q,
      city: citta,
      zone: zona,
      workType: tipo,
      intent: intento,
      limit: 50,
    }),
    getCategoryCityPairs(),
    getPublishedCount(),
  ]);

  const hubs = mergeSeoHubs(pairs);
  const useSections = !intento && !q;

  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <section className="border-b border-[var(--line)] bg-[radial-gradient(90%_70%_at_20%_0%,#c8ebe2_0%,transparent_55%),linear-gradient(180deg,#eaf6f1_0%,var(--background)_80%)]">
          <div className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
            <h1 className="font-[family-name:var(--font-syne)] text-3xl font-semibold tracking-tight sm:text-4xl">
              Cerca annunci
            </h1>
            <p className="mt-3 max-w-2xl text-[var(--muted)]">
              {count} annunci. Sezioni separate: Offro lavoro e Cerco lavoro;
              badante e babysitter non sono mischiate.{" "}
              <Link
                href="/pubblica"
                className="font-semibold text-[var(--brand)] hover:underline"
              >
                Pubblica gratis
              </Link>
              .
            </p>
          </div>
        </section>

        <div className="border-b border-[var(--line)] bg-white/40">
          <EasySearchIntents />
        </div>

        <section className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
          <BranchFilters
            action="/cerca"
            values={{ q, citta, zona, tipo, intento }}
            accentColor="var(--brand)"
          />

          <p className="mt-8 text-sm text-[var(--muted)]">
            {listings.length} risultati
            {fromFallback ? " · anteprima demo" : ""}
            {intento === "offro" ? " · solo Offro lavoro" : ""}
            {intento === "cerco" ? " · solo Cerco lavoro" : ""}
            {q ? ` per “${q}”` : ""}
            {citta ? ` a ${citta}` : ""}
          </p>

          <div className="mt-4">
            {useSections ? (
              <ListingSections
                listings={listings}
                splitCareCategories
                emptyMessage="Nessun risultato. Prova un’altra città o pubblica tu il primo annuncio."
              />
            ) : (
              <ListingResults
                listings={listings}
                emptyMessage="Nessun risultato. Prova un’altra città o pubblica tu il primo annuncio."
              />
            )}
          </div>

          <div className="mt-12">
            <SeoHubLinks
              title="Pagine locali popolari"
              hubs={hubs}
              limit={20}
            />
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}

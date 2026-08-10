import type { Metadata } from "next";
import Link from "next/link";
import { BranchFilters, parseIntentParam } from "@/components/BranchFilters";
import { ListingSections } from "@/components/ListingSections";
import { ListingResults } from "@/components/ListingResults";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { getListings } from "@/lib/listings";
import type { WorkType } from "@/lib/types";
import { WORK_TYPES } from "@/lib/types";

export const metadata: Metadata = {
  title: "Offro lavoro — persone disponibili",
  description:
    "Profili di chi offre lavoro: badanti e babysitter in sezioni separate, pet sitter, idraulici e altri su CiPensoIo.",
  alternates: { canonical: "/disponibili" },
};

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

const CATEGORY_CHIPS = [
  { q: "", label: "Tutti" },
  { q: "badante", label: "Badante" },
  { q: "babysitter", label: "Babysitter" },
  { q: "colf", label: "Colf" },
  { q: "oss", label: "OSS" },
  { q: "dogsitter", label: "Pet sitter" },
  { q: "idraulico", label: "Idraulico" },
] as const;

export default async function DisponibiliPage({ searchParams }: Props) {
  const query = await searchParams;
  const q = firstParam(query.q)?.trim() || undefined;
  const citta = firstParam(query.citta)?.trim() || undefined;
  const zona = firstParam(query.zona)?.trim() || undefined;
  const tipo = parseWorkType(firstParam(query.tipo));
  const intento = parseIntentParam(firstParam(query.intento)) ?? "offro";

  const { listings, fromFallback } = await getListings({
    intent: intento,
    q,
    city: citta,
    zone: zona,
    workType: tipo,
    limit: 50,
  });

  const showCareSplit = intento === "offro" && !q;

  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <section className="border-b border-[var(--line)] bg-[radial-gradient(90%_70%_at_20%_0%,#fff3d6_0%,transparent_55%),linear-gradient(180deg,#eaf6f1_0%,var(--background)_80%)]">
          <div className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
            <p className="text-sm font-semibold uppercase tracking-wide text-[var(--branch-lavoro)]">
              Offro lavoro
            </p>
            <h1 className="mt-2 font-[family-name:var(--font-syne)] text-3xl font-semibold tracking-tight sm:text-4xl">
              Chi è disponibile vicino a te
            </h1>
            <p className="mt-3 max-w-2xl text-[var(--muted)]">
              Solo profili di chi offre il proprio lavoro. Badante e babysitter
              sono in elenchi separati.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/pubblica?intento=offro"
                className="inline-flex min-h-12 items-center rounded-xl bg-[var(--brand)] px-5 py-3 text-base font-semibold text-white hover:bg-[var(--brand-deep)]"
              >
                Metti in mostra il tuo profilo gratis
              </Link>
              <Link
                href="/cerca?intento=cerco"
                className="inline-flex min-h-12 items-center rounded-xl border border-[var(--line)] bg-white px-5 py-3 text-base font-semibold hover:border-[var(--brand)]"
              >
                Vai a Cerco lavoro
              </Link>
            </div>
          </div>
        </section>

        <section className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
          <ul className="mb-4 flex flex-wrap gap-2" aria-label="Categoria">
            {CATEGORY_CHIPS.map((chip) => {
              const active = (q ?? "") === chip.q;
              const href = chip.q
                ? `/disponibili?q=${encodeURIComponent(chip.q)}${citta ? `&citta=${encodeURIComponent(citta)}` : ""}`
                : `/disponibili${citta ? `?citta=${encodeURIComponent(citta)}` : ""}`;
              return (
                <li key={chip.label}>
                  <Link
                    href={href}
                    className={`inline-flex min-h-11 items-center rounded-xl px-4 py-2 text-sm font-semibold ${
                      active
                        ? "bg-[var(--brand)] text-white"
                        : "border border-[var(--line)] bg-white"
                    }`}
                  >
                    {chip.label}
                  </Link>
                </li>
              );
            })}
          </ul>

          <BranchFilters
            action="/disponibili"
            values={{ q, citta, zona, tipo, intento }}
            accentColor="var(--brand)"
            showIntentChips={false}
          />

          <p className="mt-8 text-sm text-[var(--muted)]">
            {listings.length} profili · Offro lavoro
            {fromFallback ? " · anteprima demo" : ""}
          </p>

          <div className="mt-4">
            {showCareSplit ? (
              <ListingSections
                listings={listings}
                splitCareCategories
                hideIntentHeaders
                emptyMessage="Nessun profilo qui. Sei un professionista? Metti in vetrina il tuo lavoro."
              />
            ) : (
              <ListingResults
                listings={listings}
                emptyMessage="Nessun profilo qui. Sei un professionista? Metti in vetrina il tuo lavoro."
              />
            )}
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}

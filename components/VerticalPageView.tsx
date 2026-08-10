import Link from "next/link";
import { ListingResults } from "@/components/ListingResults";
import type { ListingPublic } from "@/lib/types";
import type { VerticalMeta } from "@/lib/verticals";
import { formatVerticalCategoryLabel } from "@/lib/verticals";

type Props = {
  vertical: VerticalMeta;
  offro: ListingPublic[];
  cerco: ListingPublic[];
  fromFallback?: boolean;
  categoryFilter?: string;
};

/**
 * Pagina verticale: Offro lavoro | Cerco lavoro, con CTA iscrizione / ricerca.
 */
export function VerticalPageView({
  vertical,
  offro,
  cerco,
  fromFallback,
  categoryFilter,
}: Props) {
  const catParam = categoryFilter
    ? `&categoria=${encodeURIComponent(categoryFilter)}`
    : "";

  return (
    <main className="flex-1">
      <section className="relative isolate overflow-hidden border-b border-[var(--line)]">
        <div
          className="pointer-events-none absolute inset-0 -z-10"
          style={{
            background: `radial-gradient(90%_70%_at_15%_0%, ${vertical.accent} 0%, transparent 55%), linear-gradient(180deg, color-mix(in srgb, ${vertical.accent} 55%, white) 0%, var(--background) 80%)`,
          }}
          aria-hidden
        />
        <div className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
          <p
            className="text-sm font-semibold uppercase tracking-wide"
            style={{ color: vertical.color }}
          >
            Categoria
          </p>
          <h1 className="mt-2 font-[family-name:var(--font-syne)] text-3xl font-semibold tracking-tight sm:text-4xl">
            {vertical.label}
          </h1>
          <p className="mt-3 max-w-2xl text-[var(--muted)]">
            {vertical.description}
          </p>

          {vertical.categories.length > 1 ? (
            <ul className="mt-5 flex flex-wrap gap-2" aria-label="Sottocategorie">
              <li>
                <Link
                  href={vertical.href}
                  className={`inline-flex min-h-10 items-center rounded-xl px-3 py-2 text-sm font-semibold ${
                    !categoryFilter
                      ? "text-white"
                      : "border border-[var(--line)] bg-white"
                  }`}
                  style={
                    !categoryFilter
                      ? { backgroundColor: vertical.color }
                      : undefined
                  }
                >
                  Tutte
                </Link>
              </li>
              {vertical.categories.map((cat) => {
                const active = categoryFilter === cat;
                return (
                  <li key={cat}>
                    <Link
                      href={`${vertical.href}?categoria=${encodeURIComponent(cat)}`}
                      className={`inline-flex min-h-10 items-center rounded-xl px-3 py-2 text-sm font-semibold ${
                        active
                          ? "text-white"
                          : "border border-[var(--line)] bg-white"
                      }`}
                      style={
                        active ? { backgroundColor: vertical.color } : undefined
                      }
                    >
                      {formatVerticalCategoryLabel(vertical, cat)}
                    </Link>
                  </li>
                );
              })}
            </ul>
          ) : null}
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
        <div className="grid gap-12 lg:grid-cols-2">
          {/* OFFRO */}
          <div id="offro" className="scroll-mt-8">
            <p
              className="text-xs font-semibold uppercase tracking-wide"
              style={{ color: "var(--branch-lavoro)" }}
            >
              Sottocategoria
            </p>
            <h2 className="font-[family-name:var(--font-syne)] text-2xl font-semibold tracking-tight">
              Offro lavoro
            </h2>
            <p className="mt-2 text-sm text-[var(--muted)]">
              Chi si è registrato ed è disponibile. Tocca e contatta — oppure
              iscriviti tu.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <Link
                href={`/pubblica?verticale=${vertical.slug}&intento=offro${catParam}`}
                className="inline-flex min-h-12 items-center rounded-xl px-5 py-3 text-sm font-semibold text-white"
                style={{ backgroundColor: vertical.color }}
              >
                Registrati / metti in vetrina
              </Link>
              <Link
                href={`/disponibili?q=${encodeURIComponent(categoryFilter || vertical.categories[0])}`}
                className="inline-flex min-h-12 items-center rounded-xl border border-[var(--line)] bg-white px-4 py-3 text-sm font-semibold"
              >
                Vedi tutti i disponibili
              </Link>
            </div>
            <div className="mt-6">
              <ListingResults
                listings={offro}
                emptyMessage="Ancora nessuno in vetrina qui. Sei del settore? Registrati gratis."
              />
            </div>
          </div>

          {/* CERCO */}
          <div id="cerco" className="scroll-mt-8">
            <p className="text-xs font-semibold uppercase tracking-wide text-[var(--brand)]">
              Sottocategoria
            </p>
            <h2 className="font-[family-name:var(--font-syne)] text-2xl font-semibold tracking-tight">
              Cerco lavoro
            </h2>
            <p className="mt-2 text-sm text-[var(--muted)]">
              Chi cerca una persona: pubblica l’annuncio, oppure guarda prima chi
              è già disponibile a sinistra.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <Link
                href={`/pubblica?verticale=${vertical.slug}&intento=cerco${catParam}`}
                className="inline-flex min-h-12 items-center rounded-xl bg-[var(--brand)] px-5 py-3 text-sm font-semibold text-white hover:bg-[var(--brand-deep)]"
              >
                Pubblica “cerco…”
              </Link>
              <a
                href="#offro"
                className="inline-flex min-h-12 items-center rounded-xl border border-[var(--line)] bg-white px-4 py-3 text-sm font-semibold"
              >
                Vedi i disponibili
              </a>
            </div>
            <div className="mt-6">
              <ListingResults
                listings={cerco}
                emptyMessage="Nessuna richiesta aperta. Pubblica tu se stai cercando qualcuno."
              />
            </div>
          </div>
        </div>

        {fromFallback ? (
          <p className="mt-8 text-xs text-[var(--muted)]">Anteprima demo</p>
        ) : null}
      </section>
    </main>
  );
}

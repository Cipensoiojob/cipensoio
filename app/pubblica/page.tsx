import type { Metadata } from "next";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { PublishListingForm } from "@/components/PublishListingForm";
import type { ListingIntent } from "@/lib/types";
import { isVerticalSlug, type VerticalSlug } from "@/lib/verticals";

export const metadata: Metadata = {
  title: "Pubblica un annuncio o il tuo profilo",
  description:
    "Scegli la categoria (Care, Babysitter, Pet, Professionisti, Lavoro), poi Offro o Cerco. Gratis, online dopo moderazione.",
  alternates: { canonical: "/pubblica" },
};

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

function first(value: string | string[] | undefined): string | undefined {
  if (Array.isArray(value)) return value[0];
  return value;
}

export default async function PubblicaPage({ searchParams }: Props) {
  const query = await searchParams;
  const verticale = first(query.verticale);
  const categoria = first(query.categoria);
  const citta = first(query.citta);
  const intentoRaw = first(query.intento);
  const initialIntent: ListingIntent | undefined =
    intentoRaw === "offro" || intentoRaw === "cerco" ? intentoRaw : undefined;

  const initialVertical: VerticalSlug | undefined =
    verticale && isVerticalSlug(verticale) ? verticale : undefined;

  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <section className="relative isolate overflow-hidden border-b border-[var(--line)]">
          <div
            className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(90%_70%_at_20%_0%,#c8ebe2_0%,transparent_55%),linear-gradient(180deg,#eaf6f1_0%,var(--background)_80%)]"
            aria-hidden
          />
          <div className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
            <p className="text-sm font-medium text-[var(--brand)]">
              Gratuiti in fase di lancio · online in ~24h dopo check
            </p>
            <h1 className="mt-2 font-[family-name:var(--font-syne)] text-3xl font-semibold tracking-tight sm:text-4xl">
              {initialIntent === "offro"
                ? "Offro lavoro — metti in vetrina"
                : initialIntent === "cerco"
                  ? "Cerco lavoro — pubblica la richiesta"
                  : "Pubblica: Offro o Cerco"}
            </h1>
            <p className="mt-3 max-w-xl text-[var(--muted)]">
              Prima la categoria (es. Assistenza Care / Babysitter), poi Offro
              lavoro o Cerco lavoro. Chi offre compare tra i disponibili; chi
              cerca può anche contattarli subito.
            </p>
          </div>
        </section>

        <section className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
          <div className="rounded-2xl border border-[var(--line)] bg-white/80 p-5 shadow-[var(--shadow-soft)] sm:p-8">
            <PublishListingForm
              initialVertical={initialVertical}
              initialCategory={categoria}
              initialCity={citta}
              initialIntent={initialIntent}
            />
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}

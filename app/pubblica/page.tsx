import type { Metadata } from "next";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { PublishListingForm } from "@/components/PublishListingForm";

export const metadata: Metadata = {
  title: "Pubblica un annuncio",
  description:
    "Inserisci gratis un annuncio per badante, pet care o lavoro tradizionale. Form guidato in 3 passi.",
  alternates: { canonical: "/pubblica" },
};

export default function PubblicaPage() {
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
              Gratuiti in fase di lancio
            </p>
            <h1 className="mt-2 font-[family-name:var(--font-syne)] text-3xl font-semibold tracking-tight sm:text-4xl">
              Pubblica il tuo annuncio
            </h1>
            <p className="mt-3 max-w-xl text-[var(--muted)]">
              Tre passi semplici. Lo slug SEO lo generiamo noi — tu pensa a
              cosa cerchi o offri.
            </p>
          </div>
        </section>

        <section className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
          <div className="rounded-2xl border border-[var(--line)] bg-white/80 p-5 shadow-[var(--shadow-soft)] sm:p-8">
            <PublishListingForm />
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}

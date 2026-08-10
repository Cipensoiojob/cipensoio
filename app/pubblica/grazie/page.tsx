import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";

export const metadata: Metadata = {
  title: "Annuncio inviato",
  robots: { index: false, follow: false },
};

export default function PubblicaGraziePage() {
  return (
    <>
      <SiteHeader />
      <main className="flex flex-1 items-center justify-center px-4 py-16">
        <div className="max-w-lg rounded-2xl border border-[var(--line)] bg-white p-8 text-center shadow-[var(--shadow-soft)]">
          <p className="text-sm font-semibold uppercase tracking-wide text-[var(--brand)]">
            In moderazione
          </p>
          <h1 className="mt-2 font-[family-name:var(--font-syne)] text-2xl font-semibold tracking-tight sm:text-3xl">
            Grazie — annuncio ricevuto
          </h1>
          <p className="mt-3 text-[var(--muted)]">
            Il tuo annuncio è in stato <strong>pending</strong>. Dopo
            l&apos;approvazione del team diventerà pubblico su home, macro-rami
            e sitemap SEO.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              href="/"
              className="rounded-xl bg-[var(--brand)] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[var(--brand-deep)]"
            >
              Torna alla home
            </Link>
            <Link
              href="/pubblica"
              className="rounded-xl border border-[var(--line)] px-5 py-2.5 text-sm font-medium"
            >
              Pubblica un altro
            </Link>
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}

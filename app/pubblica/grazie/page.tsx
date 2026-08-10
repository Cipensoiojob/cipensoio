import type { Metadata } from "next";
import Link from "next/link";
import { ShareButtons } from "@/components/ShareButtons";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { SITE_URL } from "@/lib/types";

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
            Di solito lo revisioniamo entro <strong>24 ore</strong>. Quando è
            approvato compare su home, macro-rami, pagine città e sitemap SEO.
          </p>
          <p className="mt-4 text-sm text-[var(--muted)]">
            Nel frattempo: condividilo con chi potrebbe rispondere.
          </p>
          <ShareButtons
            title="Sto pubblicando un annuncio su CiPensoIo — portale gratis per assistenza, pet e lavoro vicino a casa"
            url={`${SITE_URL}/pubblica`}
          />
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

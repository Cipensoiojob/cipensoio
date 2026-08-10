import Link from "next/link";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";

export default function NotFound() {
  return (
    <>
      <SiteHeader />
      <main className="flex flex-1 items-center justify-center px-4 py-20">
        <div className="max-w-md text-center">
          <p className="font-[family-name:var(--font-syne)] text-5xl font-bold text-[var(--brand)]">
            404
          </p>
          <h1 className="mt-4 font-[family-name:var(--font-syne)] text-2xl font-semibold">
            Pagina non trovata
          </h1>
          <p className="mt-2 text-[var(--muted)]">
            L&apos;annuncio o il ramo che cerchi non esiste (o è stato rimosso).
          </p>
          <Link
            href="/"
            className="mt-6 inline-flex rounded-xl bg-[var(--brand)] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[var(--brand-deep)]"
          >
            Torna alla home
          </Link>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}

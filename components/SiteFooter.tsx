import Link from "next/link";

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-[var(--line)] bg-[var(--brand-deep)] text-white">
      <div className="mx-auto grid w-full max-w-6xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <p className="font-[family-name:var(--font-syne)] text-2xl font-bold tracking-tight">
            CiPensoIo
          </p>
          <p className="mt-3 max-w-sm text-sm leading-relaxed text-white/75">
            Trova il lavoro o la persona giusta per te, vicino a casa tua.
            Piattaforma gratuita in fase di lancio — assistenza, pet & home care
            e lavoro tradizionale & tech.
          </p>
        </div>

        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-white/55">
            Esplora
          </p>
          <ul className="mt-3 space-y-2 text-sm text-white/85">
            <li>
              <Link href="/persona-assistenza" className="hover:text-white">
                Assistenza & Persona
              </Link>
            </li>
            <li>
              <Link href="/pet-home" className="hover:text-white">
                Pet & Home Care
              </Link>
            </li>
            <li>
              <Link href="/lavoro-tradizionale" className="hover:text-white">
                Lavoro & Tech
              </Link>
            </li>
            <li>
              <Link href="/pubblica" className="hover:text-white">
                Pubblica un annuncio
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-white/55">
            Legale & SEO
          </p>
          <ul className="mt-3 space-y-2 text-sm text-white/85">
            <li>
              <Link href="/privacy" className="hover:text-white">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link href="/termini" className="hover:text-white">
                Termini di servizio
              </Link>
            </li>
            <li>
              <Link href="/cookie" className="hover:text-white">
                Cookie Policy
              </Link>
            </li>
            <li>
              <a href="https://cipensoio.it" className="hover:text-white">
                cipensoio.it
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-2 px-4 py-5 text-xs text-white/55 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p>© {year} CiPensoIo. Tutti i diritti riservati.</p>
          <p>
            Annunci di lavoro e servizi locali — Schema.org JobPosting &amp;
            LocalBusiness ready.
          </p>
        </div>
      </div>
    </footer>
  );
}

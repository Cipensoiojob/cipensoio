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
              <Link href="/assistenza-care" className="hover:text-white">
                Assistenza Care
              </Link>
            </li>
            <li>
              <Link href="/babysitter" className="hover:text-white">
                Babysitter
              </Link>
            </li>
            <li>
              <Link href="/pet-sitter" className="hover:text-white">
                Pet sitter
              </Link>
            </li>
            <li>
              <Link href="/professionisti" className="hover:text-white">
                Professionisti
              </Link>
            </li>
            <li>
              <Link href="/lavoro" className="hover:text-white">
                Lavoro
              </Link>
            </li>
            <li>
              <Link href="/disponibili" className="hover:text-white">
                Disponibili
              </Link>
            </li>
            <li>
              <Link href="/pubblica" className="hover:text-white">
                Pubblica
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
              <Link href="/chi-siamo" className="hover:text-white">
                Chi siamo
              </Link>
            </li>
            <li>
              <Link href="/privacy-policy" className="hover:text-white">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link href="/cookie-policy" className="hover:text-white">
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

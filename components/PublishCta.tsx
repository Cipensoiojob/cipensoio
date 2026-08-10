import Link from "next/link";
import { Plus, Sparkles } from "lucide-react";

type Props = {
  listingCount?: number;
};

export function PublishCta({ listingCount }: Props) {
  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
      <div className="relative overflow-hidden rounded-2xl border border-[var(--line)] bg-[linear-gradient(135deg,var(--brand-soft)_0%,white_55%,var(--accent-soft)_100%)] px-6 py-10 shadow-[var(--shadow-soft)] sm:px-10">
        <div className="max-w-xl">
          <p className="inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--brand)]">
            <Sparkles className="size-4" aria-hidden />
            Gratis in fase di lancio
          </p>
          <h2 className="mt-2 font-[family-name:var(--font-syne)] text-2xl font-semibold tracking-tight sm:text-3xl">
            Pubblica gratis in 2 minuti — online dopo un check rapido
          </h2>
          <p className="mt-3 text-[var(--muted)]">
            Famiglie e lavoratori: inserisci l&apos;annuncio, noi moderiamo, poi
            sei su Google e sulla home. Contatti protetti fino al click.
            {typeof listingCount === "number" && listingCount > 0
              ? ` Già ${listingCount} annunci pubblicati.`
              : ""}
          </p>
          <Link
            href="/pubblica"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[var(--brand)] px-5 py-3 text-sm font-semibold text-white hover:bg-[var(--brand-deep)]"
          >
            <Plus className="size-4" aria-hidden />
            Pubblica un annuncio gratis
          </Link>
        </div>
      </div>
    </section>
  );
}

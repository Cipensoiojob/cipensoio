import Link from "next/link";
import { Menu, Plus } from "lucide-react";

export function SiteHeader() {
  return (
    <header className="relative z-20 border-b border-[var(--line)] bg-[color-mix(in_srgb,var(--background)_82%,white)]/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link
          href="/"
          className="font-[family-name:var(--font-syne)] text-2xl font-bold tracking-tight text-[var(--brand-deep)]"
          aria-label="CiPensoIo — Home"
        >
          CiPensoIo
        </Link>

        <nav className="hidden items-center gap-6 text-sm text-[var(--muted)] md:flex">
          <Link href="/assistenza" className="transition-colors hover:text-[var(--brand)]">
            Assistenza
          </Link>
          <Link href="/pet-home" className="transition-colors hover:text-[var(--brand)]">
            Pet & Casa
          </Link>
          <Link href="/lavoro" className="transition-colors hover:text-[var(--brand)]">
            Lavoro
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/pubblica"
            className="inline-flex items-center gap-1.5 rounded-xl bg-[var(--brand)] px-3.5 py-2 text-sm font-semibold text-white transition-colors hover:bg-[var(--brand-deep)]"
          >
            <Plus className="size-4" aria-hidden />
            <span className="hidden sm:inline">Pubblica / Registrati</span>
            <span className="sm:hidden">Pubblica</span>
          </Link>
          <button
            type="button"
            className="inline-flex size-10 items-center justify-center rounded-xl border border-[var(--line)] text-[var(--foreground)] md:hidden"
            aria-label="Apri menu"
          >
            <Menu className="size-5" />
          </button>
        </div>
      </div>
    </header>
  );
}

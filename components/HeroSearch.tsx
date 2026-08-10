import Link from "next/link";
import { MapPin, Search } from "lucide-react";
import { SearchSuggestionChips } from "@/components/SearchSuggestionChips";

export function HeroSearch() {
  return (
    <section className="relative isolate overflow-hidden">
      <div
        className="pointer-events-none absolute inset-0 -z-10"
        aria-hidden
      >
        <div className="absolute inset-0 bg-[radial-gradient(120%_80%_at_10%_0%,#c8ebe2_0%,transparent_55%),radial-gradient(90%_70%_at_90%_10%,#ffe8b8_0%,transparent_50%),linear-gradient(180deg,#eaf6f1_0%,var(--background)_72%)]" />
        <div className="hero-orb absolute -left-16 top-10 h-56 w-56 rounded-full bg-[var(--brand)]/15 blur-3xl" />
        <div className="hero-orb absolute -right-10 bottom-0 h-64 w-64 rounded-full bg-[var(--accent)]/20 blur-3xl [animation-delay:-4s]" />
        <div
          className="absolute inset-x-0 bottom-0 h-40 opacity-[0.35]"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%230f6b5c' fill-opacity='0.08'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
          }}
        />
      </div>

      <div className="mx-auto flex min-h-[78vh] w-full max-w-6xl flex-col justify-center px-4 pb-16 pt-12 sm:px-6 sm:pb-20 sm:pt-16">
        <p className="animate-rise font-[family-name:var(--font-syne)] text-5xl font-bold tracking-tight text-[var(--brand-deep)] sm:text-6xl md:text-7xl">
          CiPensoIo
        </p>

        <h1 className="animate-rise animate-rise-delay-1 mt-5 max-w-2xl font-[family-name:var(--font-syne)] text-2xl font-semibold leading-tight tracking-tight text-[var(--foreground)] sm:text-3xl md:text-4xl">
          Trova badante, colf o lavoro vicino a casa — anche solo con il
          telefono.
        </h1>

        <p className="animate-rise animate-rise-delay-2 mt-4 max-w-xl text-base leading-relaxed text-[var(--muted)] sm:text-lg">
          Pochi passi, tasti grandi, WhatsApp. Gratis in fase di lancio.
        </p>

        <div className="animate-rise animate-rise-delay-2 mt-5 flex flex-wrap items-center gap-3">
          <Link
            href="/assistenza-care#offro"
            className="inline-flex min-h-12 items-center rounded-xl bg-[var(--brand)] px-5 py-3 text-base font-semibold text-white hover:bg-[var(--brand-deep)]"
          >
            Offro lavoro
          </Link>
          <Link
            href="/assistenza-care#cerco"
            className="inline-flex min-h-12 items-center rounded-xl border border-[var(--line)] bg-white/80 px-5 py-3 text-base font-semibold text-[var(--brand-deep)]"
          >
            Cerco lavoro
          </Link>
          <Link
            href="/babysitter"
            className="inline-flex min-h-12 items-center rounded-xl border border-transparent px-3 py-3 text-sm font-semibold text-[var(--muted)] hover:text-[var(--brand)]"
          >
            Babysitter
          </Link>
        </div>

        <form
          action="/cerca"
          method="get"
          className="animate-rise animate-rise-delay-3 search-shell mt-8 flex w-full max-w-2xl flex-col gap-2 rounded-2xl border border-[var(--line)] bg-white/90 p-2 shadow-[var(--shadow-soft)] backdrop-blur sm:flex-row sm:items-center"
          role="search"
          aria-label="Ricerca unificata CiPensoIo"
        >
          <label className="flex flex-1 items-center gap-2 px-3 py-3">
            <Search className="size-5 shrink-0 text-[var(--brand)]" aria-hidden />
            <input
              type="search"
              name="q"
              placeholder="Scrivi: badante, colf, dog sitter…"
              className="w-full bg-transparent text-base outline-none placeholder:text-[var(--muted)]"
              autoComplete="off"
            />
          </label>
          <span className="hidden h-8 w-px bg-[var(--line)] sm:block" aria-hidden />
          <label className="flex flex-1 items-center gap-2 px-3 py-3 sm:max-w-[200px]">
            <MapPin className="size-5 shrink-0 text-[var(--accent)]" aria-hidden />
            <input
              type="text"
              name="citta"
              placeholder="La tua città"
              className="w-full bg-transparent text-base outline-none placeholder:text-[var(--muted)]"
              autoComplete="address-level2"
            />
          </label>
          <button
            type="submit"
            className="min-h-12 rounded-xl bg-[var(--brand)] px-5 py-3 text-base font-semibold text-white transition-colors hover:bg-[var(--brand-deep)]"
          >
            Cerca
          </button>
        </form>

        <div className="animate-rise animate-rise-delay-3 max-w-2xl">
          <SearchSuggestionChips />
        </div>
      </div>
    </section>
  );
}

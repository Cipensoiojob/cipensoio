import Link from "next/link";
import {
  ArrowRight,
  Baby,
  Briefcase,
  HeartHandshake,
  PawPrint,
  Wrench,
} from "lucide-react";
import { VERTICALS, type VerticalSlug } from "@/lib/verticals";

const ICONS: Record<VerticalSlug, typeof HeartHandshake> = {
  "assistenza-care": HeartHandshake,
  babysitter: Baby,
  "pet-sitter": PawPrint,
  professionisti: Wrench,
  lavoro: Briefcase,
};

export function MacroBranches() {
  return (
    <section
      className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-6 sm:py-20"
      aria-labelledby="macro-heading"
    >
      <div className="max-w-2xl">
        <h2
          id="macro-heading"
          className="font-[family-name:var(--font-syne)] text-2xl font-semibold tracking-tight sm:text-3xl"
        >
          Cinque categorie, due modi: Offro o Cerco
        </h2>
        <p className="mt-2 text-[var(--muted)]">
          Scegli il settore. Poi: chi offre si registra in vetrina; chi cerca
          pubblica l’annuncio o contatta chi è già disponibile.
        </p>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {VERTICALS.map((vertical) => {
          const Icon = ICONS[vertical.slug];
          return (
            <Link
              key={vertical.slug}
              href={vertical.href}
              className="branch-door group relative block overflow-hidden rounded-2xl border border-[var(--line)] p-6 outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand)]"
              style={{
                background: `linear-gradient(165deg, ${vertical.accent} 0%, #fff 58%)`,
                borderColor: `color-mix(in srgb, ${vertical.color} 28%, transparent)`,
              }}
            >
              <span
                className="inline-flex size-11 items-center justify-center rounded-xl text-white"
                style={{ backgroundColor: vertical.color }}
                aria-hidden
              >
                <Icon className="size-5" />
              </span>
              <h3 className="mt-5 font-[family-name:var(--font-syne)] text-xl font-semibold tracking-tight">
                {vertical.label}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">
                {vertical.description}
              </p>
              <p className="mt-3 text-xs font-medium text-[var(--muted)]">
                Offro lavoro · Cerco lavoro
              </p>
              <span
                className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold"
                style={{ color: vertical.color }}
              >
                Entra
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
              </span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

import Link from "next/link";
import { ArrowRight, Briefcase, HeartHandshake, PawPrint } from "lucide-react";
import { MACRO_BRANCHES } from "@/lib/types";

const ICONS = {
  persona_assistenza: HeartHandshake,
  pet_home: PawPrint,
  lavoro_tradizionale: Briefcase,
} as const;

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
          Tre porte d&apos;ingresso, stessa vicinanza
        </h2>
        <p className="mt-2 text-[var(--muted)]">
          Scegli il ramo che ti serve: ogni percorso ha priorità uguale e ricerca
          locale.
        </p>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-3">
        {MACRO_BRANCHES.map((branch) => {
          const Icon = ICONS[branch.id];
          return (
            <Link
              key={branch.id}
              href={branch.href}
              className="branch-door group relative block overflow-hidden rounded-2xl border border-[var(--line)] p-6 outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand)]"
              style={{
                background: `linear-gradient(165deg, ${branch.accent} 0%, #fff 58%)`,
                borderColor: `color-mix(in srgb, ${branch.color} 28%, transparent)`,
              }}
            >
              <span
                className="inline-flex size-11 items-center justify-center rounded-xl text-white"
                style={{ backgroundColor: branch.color }}
                aria-hidden
              >
                <Icon className="size-5" />
              </span>
              <h3 className="mt-5 font-[family-name:var(--font-syne)] text-xl font-semibold tracking-tight">
                {branch.label}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">
                {branch.description}
              </p>
              <span
                className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold"
                style={{ color: branch.color }}
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

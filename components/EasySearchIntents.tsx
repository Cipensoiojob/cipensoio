import Link from "next/link";
import {
  Baby,
  HeartHandshake,
  PawPrint,
  UserRound,
  Wrench,
} from "lucide-react";

const OFFRO_LINKS = [
  {
    href: "/assistenza-care#offro",
    label: "Badante / Care disponibile",
    hint: "Offro lavoro · Assistenza Care",
    icon: UserRound,
  },
  {
    href: "/babysitter#offro",
    label: "Babysitter disponibile",
    hint: "Offro lavoro · Babysitter",
    icon: Baby,
  },
  {
    href: "/pet-sitter#offro",
    label: "Pet sitter disponibile",
    hint: "Offro lavoro · Pet",
    icon: PawPrint,
  },
  {
    href: "/professionisti#offro",
    label: "Professionista disponibile",
    hint: "Offro lavoro · casa / impianti",
    icon: Wrench,
  },
] as const;

const CERCO_LINKS = [
  {
    href: "/assistenza-care#cerco",
    label: "Cerco badante / Care",
    hint: "Pubblica o vedi i disponibili",
    icon: HeartHandshake,
  },
  {
    href: "/babysitter#cerco",
    label: "Cerco babysitter",
    hint: "Pubblica o vedi i disponibili",
    icon: Baby,
  },
  {
    href: "/pubblica?intento=cerco",
    label: "Pubblica “Cerco…”",
    hint: "Qualsiasi categoria",
    icon: HeartHandshake,
  },
  {
    href: "/pubblica?intento=offro",
    label: "Registrati in vetrina",
    hint: "Offro lavoro",
    icon: UserRound,
  },
] as const;

type Props = {
  compact?: boolean;
};

export function EasySearchIntents({ compact = false }: Props) {
  return (
    <section
      className={compact ? "mt-6" : "mx-auto w-full max-w-6xl px-4 py-8 sm:px-6"}
      aria-labelledby="easy-search-heading"
    >
      <h2
        id="easy-search-heading"
        className={`font-[family-name:var(--font-syne)] font-semibold tracking-tight ${
          compact ? "text-lg" : "text-xl sm:text-2xl"
        }`}
      >
        Categorie separate · Offro o Cerco
      </h2>
      <p className="mt-1 text-sm text-[var(--muted)] sm:text-base">
        Care, babysitter, pet e professionisti non sono mischiati. Chi offre si
        iscrive; chi cerca pubblica o contatta i disponibili.
      </p>

      <div className="mt-6 grid gap-8 lg:grid-cols-2">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-[var(--branch-lavoro)]">
            Offro lavoro
          </p>
          <h3 className="mt-1 font-[family-name:var(--font-syne)] text-lg font-semibold">
            Registrati / vedi disponibili
          </h3>
          <ul className="mt-3 grid gap-3">
            {OFFRO_LINKS.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="flex min-h-[4.25rem] items-center gap-4 rounded-2xl border border-[var(--line)] bg-white px-4 py-3 shadow-[var(--shadow-soft)] transition-colors hover:border-[var(--branch-lavoro)]"
                  >
                    <span className="inline-flex size-11 shrink-0 items-center justify-center rounded-xl bg-[var(--accent-soft)] text-[var(--branch-lavoro)]">
                      <Icon className="size-5" aria-hidden />
                    </span>
                    <span>
                      <span className="block text-base font-semibold">
                        {item.label}
                      </span>
                      <span className="block text-sm text-[var(--muted)]">
                        {item.hint}
                      </span>
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-[var(--brand)]">
            Cerco lavoro
          </p>
          <h3 className="mt-1 font-[family-name:var(--font-syne)] text-lg font-semibold">
            Pubblica richiesta / trova qualcuno
          </h3>
          <ul className="mt-3 grid gap-3">
            {CERCO_LINKS.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.href + item.label}>
                  <Link
                    href={item.href}
                    className="flex min-h-[4.25rem] items-center gap-4 rounded-2xl border border-[var(--line)] bg-white px-4 py-3 shadow-[var(--shadow-soft)] transition-colors hover:border-[var(--brand)]"
                  >
                    <span className="inline-flex size-11 shrink-0 items-center justify-center rounded-xl bg-[var(--brand-soft)] text-[var(--brand)]">
                      <Icon className="size-5" aria-hidden />
                    </span>
                    <span>
                      <span className="block text-base font-semibold">
                        {item.label}
                      </span>
                      <span className="block text-sm text-[var(--muted)]">
                        {item.hint}
                      </span>
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}

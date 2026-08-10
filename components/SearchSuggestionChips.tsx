import Link from "next/link";

const SUGGESTIONS = [
  {
    label: "Care · Offro",
    href: "/assistenza-care#offro",
  },
  {
    label: "Care · Cerco",
    href: "/assistenza-care#cerco",
  },
  {
    label: "Babysitter · Offro",
    href: "/babysitter#offro",
  },
  {
    label: "Babysitter · Cerco",
    href: "/babysitter#cerco",
  },
  {
    label: "Pet sitter",
    href: "/pet-sitter",
  },
  {
    label: "Professionisti",
    href: "/professionisti",
  },
] as const;

export function SearchSuggestionChips() {
  return (
    <div className="mt-4">
      <p className="text-sm text-[var(--muted)]">Scelte rapide — tocca qui:</p>
      <ul className="mt-2 flex flex-wrap gap-2">
        {SUGGESTIONS.map((s) => (
          <li key={s.href + s.label}>
            <Link
              href={s.href}
              className="inline-flex min-h-10 items-center rounded-xl border border-[var(--line)] bg-white/90 px-3.5 py-2 text-sm font-medium text-[var(--foreground)] shadow-sm hover:border-[var(--brand)] hover:text-[var(--brand)]"
            >
              {s.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

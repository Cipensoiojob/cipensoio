import Link from "next/link";

type Props = {
  active: "moderazione" | "statistiche";
};

export function AdminNav({ active }: Props) {
  return (
    <nav
      className="mb-6 flex flex-wrap items-center gap-2 border-b border-[var(--line)] pb-4"
      aria-label="Area admin"
    >
      <Link
        href="/admin/moderazione"
        className={`rounded-xl px-3 py-2 text-sm font-semibold ${
          active === "moderazione"
            ? "bg-[var(--brand)] text-white"
            : "border border-[var(--line)] bg-white text-[var(--muted)] hover:text-[var(--foreground)]"
        }`}
      >
        Moderazione
      </Link>
      <Link
        href="/admin/statistiche"
        className={`rounded-xl px-3 py-2 text-sm font-semibold ${
          active === "statistiche"
            ? "bg-[var(--brand)] text-white"
            : "border border-[var(--line)] bg-white text-[var(--muted)] hover:text-[var(--foreground)]"
        }`}
      >
        Statistiche
      </Link>
    </nav>
  );
}

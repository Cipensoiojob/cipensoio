import { MapPin, Search } from "lucide-react";
import type { WorkType } from "@/lib/types";
import { WORK_TYPE_LABELS, WORK_TYPES } from "@/lib/types";

export type BranchFilterValues = {
  q?: string;
  citta?: string;
  zona?: string;
  tipo?: string;
};

type Props = {
  action: string;
  values: BranchFilterValues;
  accentColor: string;
};

export function BranchFilters({ action, values, accentColor }: Props) {
  return (
    <form
      action={action}
      method="get"
      className="search-shell rounded-2xl border border-[var(--line)] bg-white/90 p-3 shadow-[var(--shadow-soft)] backdrop-blur sm:p-4"
      role="search"
      aria-label="Filtra annunci"
    >
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <label className="flex items-center gap-2 rounded-xl border border-[var(--line)] bg-white px-3 py-2.5">
          <Search className="size-4 shrink-0 text-[var(--brand)]" aria-hidden />
          <input
            type="search"
            name="q"
            defaultValue={values.q ?? ""}
            placeholder="Cerca (es. badante…)"
            className="w-full bg-transparent text-sm outline-none placeholder:text-[var(--muted)]"
          />
        </label>

        <label className="flex items-center gap-2 rounded-xl border border-[var(--line)] bg-white px-3 py-2.5">
          <MapPin className="size-4 shrink-0 text-[var(--accent)]" aria-hidden />
          <input
            type="text"
            name="citta"
            defaultValue={values.citta ?? ""}
            placeholder="Città"
            className="w-full bg-transparent text-sm outline-none placeholder:text-[var(--muted)]"
          />
        </label>

        <label className="flex items-center gap-2 rounded-xl border border-[var(--line)] bg-white px-3 py-2.5">
          <MapPin className="size-4 shrink-0 text-[var(--muted)]" aria-hidden />
          <input
            type="text"
            name="zona"
            defaultValue={values.zona ?? ""}
            placeholder="Zona (opzionale)"
            className="w-full bg-transparent text-sm outline-none placeholder:text-[var(--muted)]"
          />
        </label>

        <label className="flex items-center gap-2 rounded-xl border border-[var(--line)] bg-white px-3 py-2.5">
          <select
            name="tipo"
            defaultValue={values.tipo ?? ""}
            className="w-full bg-transparent text-sm outline-none"
            aria-label="Tipo di contratto"
          >
            <option value="">Tutti i contratti</option>
            {WORK_TYPES.map((type) => (
              <option key={type} value={type}>
                {WORK_TYPE_LABELS[type as WorkType]}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <button
          type="submit"
          className="rounded-xl px-4 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
          style={{ backgroundColor: accentColor }}
        >
          Applica filtri
        </button>
        <a
          href={action}
          className="rounded-xl px-3 py-2.5 text-sm font-medium text-[var(--muted)] hover:text-[var(--foreground)]"
        >
          Azzera
        </a>
      </div>
    </form>
  );
}

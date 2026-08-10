import { MapPin, Search } from "lucide-react";
import Link from "next/link";
import type { ListingIntent, WorkType } from "@/lib/types";
import {
  INTENT_LABELS,
  WORK_TYPE_LABELS,
  WORK_TYPES,
} from "@/lib/types";

export type BranchFilterValues = {
  q?: string;
  citta?: string;
  zona?: string;
  tipo?: string;
  intento?: string;
};

type Props = {
  action: string;
  values: BranchFilterValues;
  accentColor: string;
  showTipoChips?: boolean;
  showIntentChips?: boolean;
};

function buildHref(
  action: string,
  values: BranchFilterValues,
  patch: Partial<BranchFilterValues>,
): string {
  const merged = { ...values, ...patch };
  const params = new URLSearchParams();
  if (merged.q) params.set("q", merged.q);
  if (merged.citta) params.set("citta", merged.citta);
  if (merged.zona) params.set("zona", merged.zona);
  if (merged.tipo) params.set("tipo", merged.tipo);
  if (merged.intento) params.set("intento", merged.intento);
  const qs = params.toString();
  return qs ? `${action}?${qs}` : action;
}

export function BranchFilters({
  action,
  values,
  accentColor,
  showTipoChips = true,
  showIntentChips = true,
}: Props) {
  return (
    <div>
      {showIntentChips && (
        <ul className="mb-3 flex flex-wrap gap-2" aria-label="Tipo annuncio">
          {(
            [
              ["", "Tutti"],
              ["offro", INTENT_LABELS.offro],
              ["cerco", INTENT_LABELS.cerco],
            ] as const
          ).map(([value, label]) => {
            const active = (values.intento ?? "") === value;
            return (
              <li key={label}>
                <Link
                  href={buildHref(action, values, { intento: value || undefined })}
                  className={`inline-flex min-h-11 items-center rounded-xl px-4 py-2 text-sm font-semibold ${
                    active
                      ? "text-white"
                      : "border border-[var(--line)] bg-white text-[var(--foreground)]"
                  }`}
                  style={active ? { backgroundColor: accentColor } : undefined}
                >
                  {label}
                </Link>
              </li>
            );
          })}
        </ul>
      )}

      {showTipoChips && (
        <ul className="mb-4 flex flex-wrap gap-2" aria-label="Tipo di lavoro">
          <li>
            <Link
              href={buildHref(action, values, { tipo: undefined })}
              className={`inline-flex min-h-11 items-center rounded-xl px-4 py-2 text-sm font-semibold ${
                !values.tipo
                  ? "text-white"
                  : "border border-[var(--line)] bg-white text-[var(--foreground)]"
              }`}
              style={!values.tipo ? { backgroundColor: accentColor } : undefined}
            >
              Tutti i contratti
            </Link>
          </li>
          {WORK_TYPES.map((type) => {
            const active = values.tipo === type;
            return (
              <li key={type}>
                <Link
                  href={buildHref(action, values, { tipo: type })}
                  className={`inline-flex min-h-11 items-center rounded-xl px-4 py-2 text-sm font-semibold ${
                    active
                      ? "text-white"
                      : "border border-[var(--line)] bg-white text-[var(--foreground)]"
                  }`}
                  style={active ? { backgroundColor: accentColor } : undefined}
                >
                  {WORK_TYPE_LABELS[type as WorkType]}
                </Link>
              </li>
            );
          })}
        </ul>
      )}

      <form
        action={action}
        method="get"
        className="search-shell rounded-2xl border border-[var(--line)] bg-white/90 p-3 shadow-[var(--shadow-soft)] backdrop-blur sm:p-4"
        role="search"
        aria-label="Filtra annunci"
      >
        {values.tipo ? (
          <input type="hidden" name="tipo" value={values.tipo} />
        ) : null}
        {values.intento ? (
          <input type="hidden" name="intento" value={values.intento} />
        ) : null}

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <label className="flex min-h-12 items-center gap-2 rounded-xl border border-[var(--line)] bg-white px-3 py-3">
            <Search className="size-5 shrink-0 text-[var(--brand)]" aria-hidden />
            <input
              type="search"
              name="q"
              defaultValue={values.q ?? ""}
              placeholder="Parola (es. badante, idraulico)"
              className="w-full bg-transparent text-base outline-none placeholder:text-[var(--muted)]"
            />
          </label>

          <label className="flex min-h-12 items-center gap-2 rounded-xl border border-[var(--line)] bg-white px-3 py-3">
            <MapPin className="size-5 shrink-0 text-[var(--accent)]" aria-hidden />
            <input
              type="text"
              name="citta"
              defaultValue={values.citta ?? ""}
              placeholder="Città"
              className="w-full bg-transparent text-base outline-none placeholder:text-[var(--muted)]"
            />
          </label>

          <label className="flex min-h-12 items-center gap-2 rounded-xl border border-[var(--line)] bg-white px-3 py-3">
            <MapPin className="size-5 shrink-0 text-[var(--muted)]" aria-hidden />
            <input
              type="text"
              name="zona"
              defaultValue={values.zona ?? ""}
              placeholder="Zona (opzionale)"
              className="w-full bg-transparent text-base outline-none placeholder:text-[var(--muted)]"
            />
          </label>
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-2">
          <button
            type="submit"
            className="min-h-11 rounded-xl px-5 py-2.5 text-base font-semibold text-white transition-opacity hover:opacity-90"
            style={{ backgroundColor: accentColor }}
          >
            Cerca
          </button>
          <a
            href={action}
            className="rounded-xl px-3 py-2.5 text-sm font-medium text-[var(--muted)] hover:text-[var(--foreground)]"
          >
            Azzera
          </a>
        </div>
      </form>
    </div>
  );
}

export function parseIntentParam(
  value: string | undefined,
): ListingIntent | undefined {
  if (value === "cerco" || value === "offro") return value;
  return undefined;
}

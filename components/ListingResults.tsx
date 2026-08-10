import Link from "next/link";
import { BadgeCheck, MapPin } from "lucide-react";
import type { ListingPublic } from "@/lib/types";
import { getBranchMeta, WORK_TYPE_LABELS } from "@/lib/types";

type Props = {
  listings: ListingPublic[];
  emptyMessage?: string;
};

export function ListingResults({ listings, emptyMessage }: Props) {
  if (!listings.length) {
    return (
      <p className="rounded-2xl border border-dashed border-[var(--line)] bg-white/60 px-5 py-10 text-center text-[var(--muted)]">
        {emptyMessage ?? "Nessun annuncio trovato con questi filtri."}
      </p>
    );
  }

  return (
    <ul className="grid gap-3">
      {listings.map((listing) => {
        const meta = getBranchMeta(listing.macro_branch);
        return (
          <li key={listing.id}>
            <Link
              href={`/annunci/${listing.slug}`}
              className="listing-row flex flex-col gap-3 rounded-2xl border border-[var(--line)] bg-white/70 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5"
            >
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2 text-xs font-medium">
                  <span
                    className="rounded-md px-2 py-0.5 text-white"
                    style={{ backgroundColor: meta.color }}
                  >
                    {meta.short}
                  </span>
                  {listing.is_verified && (
                    <span className="inline-flex items-center gap-1 text-[var(--brand)]">
                      <BadgeCheck className="size-3.5" />
                      Verificato
                    </span>
                  )}
                </div>
                <h3 className="mt-2 truncate font-[family-name:var(--font-syne)] text-lg font-semibold tracking-tight">
                  {listing.title}
                </h3>
                <p className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-[var(--muted)]">
                  <span className="inline-flex items-center gap-1">
                    <MapPin className="size-3.5" />
                    {listing.is_remote
                      ? "Full remote"
                      : [listing.location_city, listing.location_zone]
                          .filter(Boolean)
                          .join(" · ")}
                  </span>
                  <span>{WORK_TYPE_LABELS[listing.work_type]}</span>
                  {listing.salary_custom && <span>{listing.salary_custom}</span>}
                </p>
              </div>
              <span className="shrink-0 text-sm font-semibold text-[var(--brand)]">
                Dettagli →
              </span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

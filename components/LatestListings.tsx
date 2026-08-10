import Link from "next/link";
import { BadgeCheck, MapPin, Radio } from "lucide-react";
import type { ListingPublic } from "@/lib/types";
import { getBranchMeta, WORK_TYPE_LABELS } from "@/lib/types";

type Props = {
  listings: ListingPublic[];
  fromFallback: boolean;
};

export function LatestListings({ listings, fromFallback }: Props) {
  return (
    <section
      className="border-y border-[var(--line)] bg-[color-mix(in_srgb,var(--brand-soft)_35%,white)]"
      aria-labelledby="latest-heading"
    >
      <div className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-6 sm:py-20">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2
              id="latest-heading"
              className="font-[family-name:var(--font-syne)] text-2xl font-semibold tracking-tight sm:text-3xl"
            >
              Ultimi annunci / Vicino a te
            </h2>
            <p className="mt-2 text-[var(--muted)]">
              {fromFallback
                ? "Anteprima demo — collega Supabase per gli annunci reali della tua zona."
                : "Aggiornati di continuo. Filtra per città quando cerchi."}
            </p>
          </div>
          <Link
            href="/cerca"
            className="text-sm font-semibold text-[var(--brand)] hover:text-[var(--brand-deep)]"
          >
            Vedi tutti →
          </Link>
        </div>

        <ul className="mt-8 grid gap-3">
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
                      {listing.is_featured && (
                        <span className="text-[var(--branch-lavoro)]">In evidenza</span>
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
                  <span className="inline-flex shrink-0 items-center gap-1 text-sm font-semibold text-[var(--brand)]">
                    Dettagli
                    <Radio className="size-3.5 opacity-60" aria-hidden />
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

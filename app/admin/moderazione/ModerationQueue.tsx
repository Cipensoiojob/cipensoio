"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  Check,
  MapPin,
  Phone,
  X,
} from "lucide-react";
import {
  logoutModerator,
  moderateListing,
} from "@/app/admin/moderazione/actions";
import type { Listing, ListingStatus } from "@/lib/types";
import {
  STATUS_LABELS,
  WORK_TYPE_LABELS,
  getBranchMeta,
} from "@/lib/types";

type Props = {
  initialListings: Listing[];
  initialStatus: ListingStatus;
  loadError: string | null;
};

export function ModerationQueue({
  initialListings,
  initialStatus,
  loadError,
}: Props) {
  const router = useRouter();
  const [listings, setListings] = useState(initialListings);
  const [message, setMessage] = useState<string | null>(loadError);
  const [pending, startTransition] = useTransition();

  function onModerate(id: string, status: "published" | "rejected") {
    startTransition(async () => {
      const result = await moderateListing(id, status);
      if (!result.ok) {
        setMessage(result.error);
        return;
      }
      setListings((prev) => prev.filter((l) => l.id !== id));
      setMessage(
        status === "published" ? "Annuncio approvato." : "Annuncio rifiutato.",
      );
      router.refresh();
    });
  }

  return (
    <div className="mx-auto w-full max-w-4xl">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-[family-name:var(--font-syne)] text-2xl font-semibold tracking-tight">
            Coda moderazione
          </h1>
          <p className="mt-1 text-sm text-[var(--muted)]">
            Stato: {STATUS_LABELS[initialStatus]} · {listings.length} elementi
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {(
            [
              ["pending", "In attesa"],
              ["published", "Pubblicati"],
              ["rejected", "Rifiutati"],
            ] as const
          ).map(([value, label]) => (
            <a
              key={value}
              href={`/admin/moderazione?status=${value}`}
              className={`rounded-xl px-3 py-2 text-sm font-medium ${
                initialStatus === value
                  ? "bg-[var(--brand)] text-white"
                  : "border border-[var(--line)] bg-white text-[var(--muted)]"
              }`}
            >
              {label}
            </a>
          ))}
          <button
            type="button"
            onClick={() =>
              startTransition(async () => {
                await logoutModerator();
                router.refresh();
              })
            }
            className="rounded-xl border border-[var(--line)] px-3 py-2 text-sm"
          >
            Esci
          </button>
        </div>
      </div>

      {message && (
        <p
          role="status"
          className="mt-4 rounded-xl border border-[var(--line)] bg-white px-4 py-3 text-sm"
        >
          {message}
        </p>
      )}

      <ul className="mt-6 grid gap-4">
        {listings.length === 0 && (
          <li className="rounded-2xl border border-dashed border-[var(--line)] bg-white/70 px-5 py-10 text-center text-[var(--muted)]">
            Nessun annuncio in questo stato.
          </li>
        )}

        {listings.map((listing) => {
          const meta = getBranchMeta(listing.macro_branch);
          return (
            <li
              key={listing.id}
              className="rounded-2xl border border-[var(--line)] bg-white p-5 shadow-[var(--shadow-soft)]"
            >
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span
                  className="rounded-md px-2 py-0.5 text-white"
                  style={{ backgroundColor: meta.color }}
                >
                  {meta.short}
                </span>
                <span className="text-[var(--muted)]">
                  {WORK_TYPE_LABELS[listing.work_type]}
                </span>
                <span className="text-[var(--muted)]">/{listing.slug}</span>
              </div>
              <h2 className="mt-2 font-[family-name:var(--font-syne)] text-lg font-semibold">
                {listing.title}
              </h2>
              <p className="mt-1 text-sm text-[var(--muted)]">
                {listing.company_or_family_name} ·{" "}
                <span className="inline-flex items-center gap-1">
                  <MapPin className="size-3.5" />
                  {[listing.location_city, listing.location_zone]
                    .filter(Boolean)
                    .join(" · ")}
                </span>
              </p>
              <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed">
                {listing.description}
              </p>
              <p className="mt-3 inline-flex items-center gap-1.5 text-sm text-[var(--brand-deep)]">
                <Phone className="size-3.5" />
                {listing.contact_phone}
                {listing.contact_whatsapp
                  ? ` · WA ${listing.contact_whatsapp}`
                  : ""}
              </p>

              {initialStatus === "pending" && (
                <div className="mt-4 flex flex-wrap gap-2">
                  <button
                    type="button"
                    disabled={pending}
                    onClick={() => onModerate(listing.id, "published")}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-[var(--brand)] px-4 py-2 text-sm font-semibold text-white hover:bg-[var(--brand-deep)] disabled:opacity-60"
                  >
                    <Check className="size-4" />
                    Approva
                  </button>
                  <button
                    type="button"
                    disabled={pending}
                    onClick={() => onModerate(listing.id, "rejected")}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-red-200 bg-red-50 px-4 py-2 text-sm font-semibold text-red-800 disabled:opacity-60"
                  >
                    <X className="size-4" />
                    Rifiuta
                  </button>
                </div>
              )}

              {initialStatus === "rejected" && (
                <div className="mt-4">
                  <button
                    type="button"
                    disabled={pending}
                    onClick={() => onModerate(listing.id, "published")}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-[var(--brand)] px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
                  >
                    <Check className="size-4" />
                    Pubblica comunque
                  </button>
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

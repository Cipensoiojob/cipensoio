import type { Metadata } from "next";
import { ModeratorLoginForm } from "@/app/admin/moderazione/ModeratorLoginForm";
import { ModerationQueue } from "@/app/admin/moderazione/ModerationQueue";
import { getListingsForModeration } from "@/lib/listings";
import {
  isModerationSecretConfigured,
  isModeratorAuthenticated,
} from "@/lib/moderation";
import type { ListingStatus } from "@/lib/types";

export const metadata: Metadata = {
  title: "Moderazione annunci",
  robots: { index: false, follow: false },
};

type Props = {
  searchParams: Promise<{ status?: string }>;
};

function parseStatus(value: string | undefined): ListingStatus {
  if (value === "published" || value === "rejected" || value === "pending") {
    return value;
  }
  return "pending";
}

export default async function ModerazionePage({ searchParams }: Props) {
  const query = await searchParams;
  const status = parseStatus(query.status);
  const configured = isModerationSecretConfigured();
  const authed = configured && (await isModeratorAuthenticated());

  if (!configured) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[var(--background)] px-4">
        <div className="max-w-md rounded-2xl border border-[var(--line)] bg-white p-6 text-sm text-[var(--muted)]">
          <p className="font-[family-name:var(--font-syne)] text-lg font-semibold text-[var(--foreground)]">
            Moderazione non configurata
          </p>
          <p className="mt-2">
            Aggiungi <code className="text-[var(--foreground)]">MODERATION_SECRET</code> e{" "}
            <code className="text-[var(--foreground)]">SUPABASE_SERVICE_ROLE_KEY</code> in{" "}
            <code className="text-[var(--foreground)]">.env.local</code>, poi riesegui lo
            schema FASE 3 su Supabase.
          </p>
        </div>
      </main>
    );
  }

  if (!authed) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[var(--background)] px-4">
        <ModeratorLoginForm />
      </main>
    );
  }

  const { listings, error } = await getListingsForModeration(status);

  return (
    <main className="min-h-screen bg-[var(--background)] px-4 py-10 sm:px-6">
      <ModerationQueue
        initialListings={listings}
        initialStatus={status}
        loadError={error}
      />
    </main>
  );
}

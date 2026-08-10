import type { Metadata } from "next";
import Link from "next/link";
import { AdminNav } from "@/components/AdminNav";
import { ModeratorLoginForm } from "@/app/admin/moderazione/ModeratorLoginForm";
import { getAnalyticsDashboard } from "@/lib/analytics";
import {
  isModerationSecretConfigured,
  isModeratorAuthenticated,
} from "@/lib/moderation";

export const metadata: Metadata = {
  title: "Statistiche sito",
  robots: { index: false, follow: false },
};

type Props = {
  searchParams: Promise<{ giorni?: string }>;
};

function parseDays(value: string | undefined): number {
  const n = Number.parseInt(value ?? "7", 10);
  if (!Number.isFinite(n)) return 7;
  return Math.min(90, Math.max(1, n));
}

function StatCard({
  label,
  value,
  hint,
}: {
  label: string;
  value: string | number;
  hint?: string;
}) {
  return (
    <div className="rounded-2xl border border-[var(--line)] bg-white p-4 shadow-[var(--shadow-soft)]">
      <p className="text-xs font-semibold uppercase tracking-wide text-[var(--muted)]">
        {label}
      </p>
      <p className="mt-2 font-[family-name:var(--font-syne)] text-3xl font-semibold tracking-tight">
        {value}
      </p>
      {hint ? <p className="mt-1 text-xs text-[var(--muted)]">{hint}</p> : null}
    </div>
  );
}

function RankList({
  title,
  items,
  empty,
}: {
  title: string;
  items: { label: string; count: number }[];
  empty: string;
}) {
  return (
    <section className="rounded-2xl border border-[var(--line)] bg-white p-5">
      <h2 className="font-[family-name:var(--font-syne)] text-lg font-semibold">
        {title}
      </h2>
      {items.length === 0 ? (
        <p className="mt-3 text-sm text-[var(--muted)]">{empty}</p>
      ) : (
        <ol className="mt-3 space-y-2">
          {items.map((item, i) => (
            <li
              key={item.label}
              className="flex items-center justify-between gap-3 text-sm"
            >
              <span className="min-w-0 truncate">
                <span className="mr-2 text-[var(--muted)]">{i + 1}.</span>
                {item.label}
              </span>
              <span className="shrink-0 font-semibold tabular-nums">
                {item.count}
              </span>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}

export default async function AdminStatistichePage({ searchParams }: Props) {
  const query = await searchParams;
  const rangeDays = parseDays(query.giorni);
  const configured = isModerationSecretConfigured();
  const authed = configured && (await isModeratorAuthenticated());

  if (!configured) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[var(--background)] px-4">
        <div className="max-w-md rounded-2xl border border-[var(--line)] bg-white p-6 text-sm text-[var(--muted)]">
          <p className="font-[family-name:var(--font-syne)] text-lg font-semibold text-[var(--foreground)]">
            Admin non configurato
          </p>
          <p className="mt-2">
            Imposta <code className="text-[var(--foreground)]">MODERATION_SECRET</code>{" "}
            in <code className="text-[var(--foreground)]">.env.local</code>.
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

  const stats = await getAnalyticsDashboard(rangeDays);
  const delta =
    stats.pageViewsYesterday === 0
      ? null
      : Math.round(
          ((stats.pageViewsToday - stats.pageViewsYesterday) /
            stats.pageViewsYesterday) *
            100,
        );

  return (
    <main className="min-h-screen bg-[var(--background)] px-4 py-10 sm:px-6">
      <div className="mx-auto w-full max-w-5xl">
        <AdminNav active="statistiche" />

        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="font-[family-name:var(--font-syne)] text-2xl font-semibold tracking-tight">
              Statistiche
            </h1>
            <p className="mt-1 text-sm text-[var(--muted)]">
              Visite, ricerche e annunci aperti — solo area admin.
            </p>
          </div>
          <ul className="flex flex-wrap gap-2">
            {[1, 7, 30].map((d) => (
              <li key={d}>
                <Link
                  href={`/admin/statistiche?giorni=${d}`}
                  className={`rounded-xl px-3 py-2 text-sm font-medium ${
                    rangeDays === d
                      ? "bg-[var(--brand)] text-white"
                      : "border border-[var(--line)] bg-white text-[var(--muted)]"
                  }`}
                >
                  {d === 1 ? "Oggi*" : `${d} giorni`}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {stats.error ? (
          <p className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
            {stats.error}
            {stats.error.includes("schema-analytics") ? (
              <>
                {" "}
                File:{" "}
                <code className="font-semibold">schema-analytics.sql</code>
              </>
            ) : null}
          </p>
        ) : null}

        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            label="Pagine viste"
            value={stats.pageViews}
            hint={`Ultimi ${rangeDays} giorni`}
          />
          <StatCard
            label="Sessioni uniche"
            value={stats.uniqueSessions}
            hint="Stima da ID anonimo"
          />
          <StatCard
            label="Ricerche"
            value={stats.searches}
            hint="Query su /cerca e /disponibili"
          />
          <StatCard
            label="Annunci aperti"
            value={stats.listingViews}
            hint="Schede /annunci/…"
          />
        </div>

        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <StatCard
            label="Visite oggi (UTC)"
            value={stats.pageViewsToday}
            hint={
              delta === null
                ? "Confronto ieri non disponibile"
                : `${delta >= 0 ? "+" : ""}${delta}% vs ieri`
            }
          />
          <StatCard
            label="Visite ieri (UTC)"
            value={stats.pageViewsYesterday}
          />
        </div>

        <section className="mt-8 rounded-2xl border border-[var(--line)] bg-[color-mix(in_srgb,var(--brand-soft)_45%,white)] p-5 sm:p-6">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-[var(--brand)]">
                SEO · Google
              </p>
              <h2 className="font-[family-name:var(--font-syne)] text-xl font-semibold tracking-tight sm:text-2xl">
                Quanto sei ricercabile su Google
              </h2>
              <p className="mt-1 max-w-2xl text-sm text-[var(--muted)]">
                Stima dal traffico che arriva da Google (referrer organico). Non
                sostituisce Search Console (impressioni/click), ma dice se il SEO
                sta già portando visite reali.
              </p>
            </div>
            <div className="rounded-2xl border border-[var(--line)] bg-white px-4 py-3 text-center">
              <p className="text-xs font-semibold uppercase tracking-wide text-[var(--muted)]">
                Indice visibilità
              </p>
              <p className="font-[family-name:var(--font-syne)] text-3xl font-semibold tabular-nums">
                {stats.seo.visibilityScore}
                <span className="text-base text-[var(--muted)]">/100</span>
              </p>
              <p className="text-sm font-semibold capitalize text-[var(--brand-deep)]">
                {stats.seo.visibilityLabel}
              </p>
            </div>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
              label="Visite da Google"
              value={stats.seo.googleVisits}
              hint={`${stats.seo.googleSharePercent}% del traffico pagine`}
            />
            <StatCard
              label="Sessioni da Google"
              value={stats.seo.googleSessions}
              hint="Persone arrivate da ricerca"
            />
            <StatCard
              label="Altri motori"
              value={stats.seo.otherSearchVisits}
              hint="Bing, DuckDuckGo…"
            />
            <StatCard
              label="Annunci pubblicati"
              value={stats.seo.publishedListings}
              hint="Pagine potenzialmente indicizzabili"
            />
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            <div className="rounded-xl border border-[var(--line)] bg-white/80 px-3 py-3 text-sm">
              <span className="text-[var(--muted)]">Diretto / sconosciuto</span>
              <p className="font-semibold tabular-nums">{stats.seo.directVisits}</p>
            </div>
            <div className="rounded-xl border border-[var(--line)] bg-white/80 px-3 py-3 text-sm">
              <span className="text-[var(--muted)]">Social</span>
              <p className="font-semibold tabular-nums">{stats.seo.socialVisits}</p>
            </div>
            <div className="rounded-xl border border-[var(--line)] bg-white/80 px-3 py-3 text-sm">
              <span className="text-[var(--muted)]">Interno (cipensoio)</span>
              <p className="font-semibold tabular-nums">{stats.seo.internalVisits}</p>
            </div>
          </div>

          <p className="mt-4 text-sm text-[var(--foreground)]/80">{stats.seo.hint}</p>

          <div className="mt-5">
            <RankList
              title="Pagine di atterraggio da Google"
              items={stats.seo.topGoogleLandings}
              empty="Nessun ingresso da Google nel periodo. Controlla sitemap, hub locali e Search Console."
            />
          </div>
        </section>

        <p className="mt-2 text-xs text-[var(--muted)]">
          * Il filtro “1 giorno” usa le ultime 24 ore di eventi; i KPI “oggi/ieri”
          sono per giorno UTC.
        </p>

        <div className="mt-8 grid gap-4 lg:grid-cols-2">
          <RankList
            title="Cosa hanno cercato"
            items={stats.topSearches}
            empty="Ancora nessuna ricerca tracciata."
          />
          <RankList
            title="Città nei filtri"
            items={stats.topCities}
            empty="Nessuna città nei parametri di ricerca."
          />
          <RankList
            title="Pagine più viste"
            items={stats.topPaths}
            empty="Nessuna pagina vista nel periodo."
          />
          <RankList
            title="Annunci più aperti"
            items={stats.topListings}
            empty="Nessuna scheda annuncio aperta."
          />
        </div>

        <section className="mt-8 rounded-2xl border border-[var(--line)] bg-white p-5">
          <h2 className="font-[family-name:var(--font-syne)] text-lg font-semibold">
            Eventi recenti
          </h2>
          {stats.recent.length === 0 ? (
            <p className="mt-3 text-sm text-[var(--muted)]">
              Nessun evento. Naviga il sito (anche in locale) dopo aver eseguito
              lo schema SQL.
            </p>
          ) : (
            <div className="mt-3 overflow-x-auto">
              <table className="w-full min-w-[640px] text-left text-sm">
                <thead className="text-xs uppercase text-[var(--muted)]">
                  <tr>
                    <th className="py-2 pr-3 font-semibold">Quando</th>
                    <th className="py-2 pr-3 font-semibold">Tipo</th>
                    <th className="py-2 pr-3 font-semibold">Dettaglio</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.recent.map((ev) => (
                    <tr key={ev.id} className="border-t border-[var(--line)]">
                      <td className="py-2 pr-3 whitespace-nowrap text-[var(--muted)]">
                        {new Date(ev.created_at).toLocaleString("it-IT")}
                      </td>
                      <td className="py-2 pr-3 font-medium">{ev.event_type}</td>
                      <td className="py-2 pr-3">
                        {ev.event_type === "search"
                          ? [ev.query, ev.city].filter(Boolean).join(" · ") ||
                            ev.path
                          : ev.event_type === "listing_view"
                            ? ev.listing_slug
                            : ev.path}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

import {
  getSupabaseAdminClient,
  getSupabaseClient,
  isSupabaseAdminConfigured,
  isSupabaseConfigured,
} from "@/lib/supabaseClient";

export type AnalyticsEventType = "page_view" | "search" | "listing_view";

export type AnalyticsEventInput = {
  event_type: AnalyticsEventType;
  path?: string | null;
  query?: string | null;
  city?: string | null;
  intent?: string | null;
  listing_slug?: string | null;
  referrer?: string | null;
  session_id?: string | null;
};

export type TopItem = { label: string; count: number };

export type TrafficSource =
  | "google"
  | "other_search"
  | "social"
  | "internal"
  | "direct";

export type SeoStats = {
  googleVisits: number;
  otherSearchVisits: number;
  socialVisits: number;
  internalVisits: number;
  directVisits: number;
  googleSharePercent: number;
  googleSessions: number;
  topGoogleLandings: TopItem[];
  /** 0–100: proxy di quanto il sito “prende” da Google. */
  visibilityScore: number;
  visibilityLabel: "basso" | "modesto" | "buono" | "forte";
  publishedListings: number;
  hint: string;
};

export type AnalyticsDashboard = {
  rangeDays: number;
  pageViews: number;
  searches: number;
  listingViews: number;
  uniqueSessions: number;
  pageViewsToday: number;
  pageViewsYesterday: number;
  topPaths: TopItem[];
  topSearches: TopItem[];
  topCities: TopItem[];
  topListings: TopItem[];
  seo: SeoStats;
  recent: Array<{
    id: string;
    event_type: AnalyticsEventType;
    path: string | null;
    query: string | null;
    city: string | null;
    listing_slug: string | null;
    referrer: string | null;
    created_at: string;
  }>;
  error: string | null;
};

function clip(value: string | null | undefined, max: number): string | null {
  if (!value) return null;
  const trimmed = value.trim().slice(0, max);
  return trimmed || null;
}

/** Classifica il referrer (o UTM già normalizzato a google.com). */
export function classifyReferrer(referrer: string | null | undefined): TrafficSource {
  if (!referrer?.trim()) return "direct";
  let host = "";
  try {
    host = new URL(referrer).hostname.toLowerCase();
  } catch {
    const raw = referrer.toLowerCase();
    if (/google\./.test(raw)) return "google";
    return "direct";
  }

  if (
    host.includes("google.") ||
    host === "google.com" ||
    host.endsWith(".google.com") ||
    host.includes("googleusercontent.")
  ) {
    return "google";
  }
  if (
    /(bing\.|yahoo\.|duckduckgo\.|ecosia\.|yandex\.|baidu\.)/.test(host)
  ) {
    return "other_search";
  }
  if (
    /(facebook\.|instagram\.|t\.co|twitter\.|x\.com|linkedin\.|tiktok\.|whatsapp\.)/.test(
      host,
    )
  ) {
    return "social";
  }
  if (host.includes("cipensoio.")) return "internal";
  return "direct";
}

function emptySeo(): SeoStats {
  return {
    googleVisits: 0,
    otherSearchVisits: 0,
    socialVisits: 0,
    internalVisits: 0,
    directVisits: 0,
    googleSharePercent: 0,
    googleSessions: 0,
    topGoogleLandings: [],
    visibilityScore: 0,
    visibilityLabel: "basso",
    publishedListings: 0,
    hint: "Ancora pochi dati: dopo visite da Google vedrai la quota organica.",
  };
}

function scoreSeo(input: {
  pageViews: number;
  googleVisits: number;
  googleSharePercent: number;
  googleLandings: number;
  publishedListings: number;
}): Pick<SeoStats, "visibilityScore" | "visibilityLabel" | "hint"> {
  const { pageViews, googleVisits, googleSharePercent, googleLandings, publishedListings } =
    input;

  if (pageViews < 5) {
    return {
      visibilityScore: 0,
      visibilityLabel: "basso",
      hint: "Servono più visite per stimare il SEO. Condividi hub locali e aspetta l’indicizzazione Google.",
    };
  }

  // Peso: quota Google + volume + varietà landing (+ leggero boost inventario)
  const sharePts = Math.min(55, googleSharePercent * 0.7);
  const volumePts = Math.min(25, Math.log10(Math.max(googleVisits, 1) + 1) * 12);
  const diversityPts = Math.min(15, googleLandings * 3);
  const inventoryPts = Math.min(5, Math.log10(Math.max(publishedListings, 1) + 1) * 2);
  const visibilityScore = Math.round(
    Math.min(100, sharePts + volumePts + diversityPts + inventoryPts),
  );

  let visibilityLabel: SeoStats["visibilityLabel"] = "basso";
  if (visibilityScore >= 70) visibilityLabel = "forte";
  else if (visibilityScore >= 45) visibilityLabel = "buono";
  else if (visibilityScore >= 20) visibilityLabel = "modesto";

  let hint =
    "Proxy basato sul traffico che arriva da Google (referrer), non impressioni Search Console.";
  if (googleVisits === 0) {
    hint =
      "Nessuna visita da Google nel periodo: sitemap/robots ok? Controlla Search Console e le pagine hub (/badante/milano…).";
  } else if (googleSharePercent < 10) {
    hint =
      "Poco traffico organico rispetto al totale: spingi hub città/categoria e titoli locali.";
  } else if (googleSharePercent >= 25) {
    hint =
      "Buona quota da Google: il SEO sta portando visite. Continua ad aggiornare annunci e hub.";
  }

  return { visibilityScore, visibilityLabel, hint };
}

/** Inserisce un evento (client anon o server). Fallisce in silenzio se DB assente. */
export async function trackAnalyticsEvent(
  input: AnalyticsEventInput,
): Promise<{ ok: boolean; error?: string }> {
  if (!isSupabaseConfigured()) {
    return { ok: false, error: "Supabase non configurato" };
  }

  const row = {
    event_type: input.event_type,
    path: clip(input.path, 500),
    query: clip(input.query, 200)?.toLowerCase() ?? null,
    city: clip(input.city, 120),
    intent: clip(input.intent, 40),
    listing_slug: clip(input.listing_slug, 200),
    referrer: clip(input.referrer, 500),
    session_id: clip(input.session_id, 80),
  };

  try {
    const client = getSupabaseClient();
    const { error } = await client.from("site_events").insert(row);
    if (error) return { ok: false, error: error.message };
    return { ok: true };
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : "errore insert",
    };
  }
}

function countBy(
  rows: Array<Record<string, string | null>>,
  key: string,
  limit = 10,
): TopItem[] {
  const map = new Map<string, number>();
  for (const row of rows) {
    const raw = row[key];
    if (!raw) continue;
    const label = raw.trim();
    if (!label) continue;
    map.set(label, (map.get(label) ?? 0) + 1);
  }
  return [...map.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([label, count]) => ({ label, count }));
}

function startOfUtcDay(d = new Date()): Date {
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
}

/** Aggregati per dashboard admin (service role). */
export async function getAnalyticsDashboard(
  rangeDays = 7,
): Promise<AnalyticsDashboard> {
  const empty: AnalyticsDashboard = {
    rangeDays,
    pageViews: 0,
    searches: 0,
    listingViews: 0,
    uniqueSessions: 0,
    pageViewsToday: 0,
    pageViewsYesterday: 0,
    topPaths: [],
    topSearches: [],
    topCities: [],
    topListings: [],
    seo: emptySeo(),
    recent: [],
    error: null,
  };

  if (!isSupabaseAdminConfigured()) {
    return {
      ...empty,
      error:
        "Configura SUPABASE_SERVICE_ROLE_KEY e esegui schema-analytics.sql su Supabase.",
    };
  }

  const since = new Date();
  since.setUTCDate(since.getUTCDate() - Math.max(1, Math.min(rangeDays, 90)));
  const todayStart = startOfUtcDay();
  const yesterdayStart = new Date(todayStart);
  yesterdayStart.setUTCDate(yesterdayStart.getUTCDate() - 1);

  try {
    const admin = getSupabaseAdminClient();
    const [{ data, error }, publishedRes] = await Promise.all([
      admin
        .from("site_events")
        .select(
          "id, event_type, path, query, city, listing_slug, referrer, session_id, created_at",
        )
        .gte("created_at", since.toISOString())
        .order("created_at", { ascending: false })
        .limit(5000),
      admin
        .from("listings")
        .select("id", { count: "exact", head: true })
        .eq("status", "published"),
    ]);

    if (error) {
      return {
        ...empty,
        error:
          error.message.includes("site_events") || error.code === "42P01"
            ? "Tabella site_events assente: esegui schema-analytics.sql su Supabase."
            : error.message,
      };
    }

    const rows = data ?? [];
    const sessions = new Set<string>();
    const googleSessions = new Set<string>();
    let pageViews = 0;
    let searches = 0;
    let listingViews = 0;
    let pageViewsToday = 0;
    let pageViewsYesterday = 0;
    let googleVisits = 0;
    let otherSearchVisits = 0;
    let socialVisits = 0;
    let internalVisits = 0;
    let directVisits = 0;
    const googleLandings: Array<{ path: string | null }> = [];

    for (const row of rows) {
      if (row.session_id) sessions.add(row.session_id);
      const created = new Date(row.created_at).getTime();
      if (row.event_type === "page_view") {
        pageViews += 1;
        if (created >= todayStart.getTime()) pageViewsToday += 1;
        else if (created >= yesterdayStart.getTime()) pageViewsYesterday += 1;

        const source = classifyReferrer(row.referrer);
        if (source === "google") {
          googleVisits += 1;
          googleLandings.push({ path: row.path });
          if (row.session_id) googleSessions.add(row.session_id);
        } else if (source === "other_search") otherSearchVisits += 1;
        else if (source === "social") socialVisits += 1;
        else if (source === "internal") internalVisits += 1;
        else directVisits += 1;
      } else if (row.event_type === "search") {
        searches += 1;
      } else if (row.event_type === "listing_view") {
        listingViews += 1;
      }
    }

    const publishedListings = publishedRes.count ?? 0;
    const googleSharePercent =
      pageViews > 0 ? Math.round((googleVisits / pageViews) * 1000) / 10 : 0;
    const topGoogleLandings = countBy(googleLandings, "path", 10);
    const scored = scoreSeo({
      pageViews,
      googleVisits,
      googleSharePercent,
      googleLandings: topGoogleLandings.length,
      publishedListings,
    });

    return {
      rangeDays,
      pageViews,
      searches,
      listingViews,
      uniqueSessions: sessions.size,
      pageViewsToday,
      pageViewsYesterday,
      topPaths: countBy(
        rows
          .filter((r) => r.event_type === "page_view")
          .map((r) => ({ path: r.path })),
        "path",
        12,
      ),
      topSearches: countBy(
        rows
          .filter((r) => r.event_type === "search" && r.query)
          .map((r) => ({ query: r.query })),
        "query",
        15,
      ),
      topCities: countBy(
        rows.filter((r) => r.city).map((r) => ({ city: r.city })),
        "city",
        10,
      ),
      topListings: countBy(
        rows
          .filter((r) => r.event_type === "listing_view" && r.listing_slug)
          .map((r) => ({ listing_slug: r.listing_slug })),
        "listing_slug",
        12,
      ),
      seo: {
        googleVisits,
        otherSearchVisits,
        socialVisits,
        internalVisits,
        directVisits,
        googleSharePercent,
        googleSessions: googleSessions.size,
        topGoogleLandings,
        publishedListings,
        ...scored,
      },
      recent: rows.slice(0, 40).map((r) => ({
        id: r.id as string,
        event_type: r.event_type as AnalyticsEventType,
        path: r.path,
        query: r.query,
        city: r.city,
        listing_slug: r.listing_slug,
        referrer: r.referrer,
        created_at: r.created_at as string,
      })),
      error: null,
    };
  } catch (err) {
    return {
      ...empty,
      error: err instanceof Error ? err.message : "Errore lettura analytics",
    };
  }
}

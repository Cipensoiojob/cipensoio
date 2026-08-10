import {
  getSupabaseAdminClient,
  getSupabaseClient,
  isSupabaseAdminConfigured,
  isSupabaseConfigured,
} from "@/lib/supabaseClient";
import { buildListingSlug } from "@/lib/slug";
import type {
  Listing,
  ListingIntent,
  ListingPublic,
  ListingStatus,
  MacroBranch,
  WorkType,
} from "@/lib/types";
import {
  FULL_LISTING_COLUMNS,
  PUBLIC_LISTING_COLUMNS,
} from "@/lib/types";

const FALLBACK_LISTINGS: Listing[] = [
  {
    id: "fallback-1",
    macro_branch: "persona_assistenza",
    category: "badante",
    title: "Badante H24 convivente a Segrate",
    slug: "badante-h24-convivente-segrate-001",
    description:
      "Famiglia cerca badante convivente per assistenza anziana. Preferenza esperienza e referenze.",
    company_or_family_name: "Famiglia Rossi",
    location_city: "Segrate",
    location_zone: "Milano Est",
    is_remote: false,
    work_type: "convivenza",
    salary_custom: "Retribuzione secondo CCNL",
    apply_external_url: null,
    is_featured: true,
    is_verified: true,
    status: "published",
    intent: "cerco",
    created_at: new Date().toISOString(),
    contact_phone: "+390200000001",
    contact_whatsapp: "+393400000001",
  },
  {
    id: "fallback-2",
    macro_branch: "pet_home",
    category: "dogsitter",
    title: "Dog sitter per passeggiate quotidiane a Milano",
    slug: "dogsitter-passeggiate-milano-002",
    description:
      "Cerchiamo dog sitter affidabile per due passeggiate al giorno in zona Navigli.",
    company_or_family_name: "Famiglia Bianchi",
    location_city: "Milano",
    location_zone: "Navigli",
    is_remote: false,
    work_type: "ad_ore",
    salary_custom: "12€/ora",
    apply_external_url: null,
    is_featured: false,
    is_verified: true,
    status: "published",
    intent: "cerco",
    created_at: new Date().toISOString(),
    contact_phone: "+390200000002",
    contact_whatsapp: null,
  },
  {
    id: "fallback-3",
    macro_branch: "lavoro_tradizionale",
    category: "ai_engineer",
    title: "AI Engineer Full Remote — startup italiana",
    slug: "ai-engineer-full-remote-003",
    description:
      "Ruolo su LLM e pipeline dati. Full remote, team italiano.",
    company_or_family_name: "NovaTech Srl",
    location_city: "Italia",
    location_zone: null,
    is_remote: true,
    work_type: "full_time",
    salary_custom: "RAL 38-48k",
    apply_external_url: null,
    is_featured: true,
    is_verified: false,
    status: "published",
    intent: "cerco",
    created_at: new Date().toISOString(),
    contact_phone: "+390200000003",
    contact_whatsapp: null,
  },
  {
    id: "fallback-4",
    macro_branch: "persona_assistenza",
    category: "badante",
    title: "Badante disponibile a Milano — Maria",
    slug: "badante-disponibile-milano-maria-101",
    description:
      "Ho esperienza con anziani e convivenza. Disponibile da subito, preferisco contatto WhatsApp.",
    company_or_family_name: "Maria Rossi",
    location_city: "Milano",
    location_zone: "Città Studi",
    is_remote: false,
    work_type: "convivenza",
    salary_custom: "Da concordare / CCNL",
    apply_external_url: null,
    is_featured: true,
    is_verified: true,
    status: "published",
    intent: "offro",
    created_at: new Date().toISOString(),
    contact_phone: "+393401010101",
    contact_whatsapp: "+393401010101",
  },
  {
    id: "fallback-5",
    macro_branch: "pet_home",
    category: "idraulico",
    title: "Idraulico per piccoli interventi a Milano",
    slug: "idraulico-milano-disponibile-104",
    description:
      "Riparazioni perdite, rubinetti, scarichi. Interventi rapidi in città.",
    company_or_family_name: "Andrea Neri",
    location_city: "Milano",
    location_zone: null,
    is_remote: false,
    work_type: "ad_ore",
    salary_custom: "Preventivo",
    apply_external_url: null,
    is_featured: true,
    is_verified: false,
    status: "published",
    intent: "offro",
    created_at: new Date().toISOString(),
    contact_phone: "+393401010104",
    contact_whatsapp: "+393401010104",
  },
];

function toPublic(listing: Listing): ListingPublic {
  const { contact_phone: _p, contact_whatsapp: _w, ...rest } = listing;
  return rest;
}

export type ListingFilters = {
  branch?: MacroBranch;
  category?: string;
  /** Più categorie (verticale Care, Professionisti, …). */
  categories?: string[];
  intent?: ListingIntent;
  q?: string;
  city?: string;
  zone?: string;
  workType?: WorkType;
  limit?: number;
};

function filterFallback(filters: ListingFilters): ListingPublic[] {
  let rows = FALLBACK_LISTINGS.filter((r) => r.status === "published");

  if (filters.branch) {
    rows = rows.filter((r) => r.macro_branch === filters.branch);
  }
  if (filters.intent) {
    rows = rows.filter((r) => r.intent === filters.intent);
  }
  if (filters.category?.trim()) {
    const cat = filters.category.trim().toLowerCase().replace(/-/g, "_");
    rows = rows.filter(
      (r) =>
        r.category.toLowerCase() === cat ||
        r.category.toLowerCase().replace(/_/g, "-") ===
          filters.category!.trim().toLowerCase(),
    );
  }
  if (filters.categories?.length) {
    const set = new Set(
      filters.categories.map((c) => c.toLowerCase().replace(/-/g, "_")),
    );
    rows = rows.filter((r) => set.has(r.category.toLowerCase()));
  }
  if (filters.workType) {
    rows = rows.filter((r) => r.work_type === filters.workType);
  }
  if (filters.city?.trim()) {
    const city = filters.city.trim().toLowerCase();
    rows = rows.filter((r) => r.location_city.toLowerCase().includes(city));
  }
  if (filters.zone?.trim()) {
    const zone = filters.zone.trim().toLowerCase();
    rows = rows.filter((r) =>
      (r.location_zone ?? "").toLowerCase().includes(zone),
    );
  }
  if (filters.q?.trim()) {
    const q = filters.q.trim().toLowerCase();
    rows = rows.filter(
      (r) =>
        r.title.toLowerCase().includes(q) ||
        r.description.toLowerCase().includes(q) ||
        r.category.toLowerCase().includes(q) ||
        r.company_or_family_name.toLowerCase().includes(q),
    );
  }

  const limit = filters.limit ?? 50;
  return rows.slice(0, limit).map(toPublic);
}

export async function getLatestListings(
  limit = 6,
): Promise<{ listings: ListingPublic[]; fromFallback: boolean }> {
  return getListings({ limit });
}

/** Solo annunci published (vista listings_public). */
export async function getListings(
  filters: ListingFilters = {},
): Promise<{ listings: ListingPublic[]; fromFallback: boolean }> {
  const limit = filters.limit ?? 50;

  if (!isSupabaseConfigured()) {
    return { listings: filterFallback(filters), fromFallback: true };
  }

  try {
    const supabase = getSupabaseClient();
    let query = supabase
      .from("listings_public")
      .select(PUBLIC_LISTING_COLUMNS)
      .order("created_at", { ascending: false })
      .limit(limit);

    if (filters.branch) {
      query = query.eq("macro_branch", filters.branch);
    }
    if (filters.intent) {
      query = query.eq("intent", filters.intent);
    }
    if (filters.category?.trim()) {
      const cat = filters.category.trim().toLowerCase().replace(/-/g, "_");
      query = query.eq("category", cat);
    } else if (filters.categories?.length) {
      const cats = filters.categories.map((c) =>
        c.toLowerCase().replace(/-/g, "_"),
      );
      query = query.in("category", cats);
    }
    if (filters.workType) {
      query = query.eq("work_type", filters.workType);
    }
    if (filters.city?.trim()) {
      query = query.ilike("location_city", `%${filters.city.trim()}%`);
    }
    if (filters.zone?.trim()) {
      query = query.ilike("location_zone", `%${filters.zone.trim()}%`);
    }
    if (filters.q?.trim()) {
      const q = filters.q.trim().replace(/[%_]/g, "");
      query = query.or(
        `title.ilike.%${q}%,description.ilike.%${q}%,category.ilike.%${q}%,company_or_family_name.ilike.%${q}%`,
      );
    }

    const { data, error } = await query;

    if (error || !data) {
      return { listings: filterFallback(filters), fromFallback: true };
    }

    if (!data.length && (filters.branch || filters.q || filters.city || filters.category || filters.categories?.length)) {
      return { listings: [], fromFallback: false };
    }

    if (!data.length) {
      return { listings: filterFallback(filters), fromFallback: true };
    }

    return { listings: data as ListingPublic[], fromFallback: false };
  } catch {
    return { listings: filterFallback(filters), fromFallback: true };
  }
}

/** Dettaglio pubblico: solo published. */
export async function getListingBySlug(
  slug: string,
): Promise<{ listing: Listing | null; fromFallback: boolean }> {
  if (!slug) return { listing: null, fromFallback: false };

  if (!isSupabaseConfigured()) {
    const fallback =
      FALLBACK_LISTINGS.find(
        (l) => l.slug === slug && l.status === "published",
      ) ?? null;
    return { listing: fallback, fromFallback: true };
  }

  try {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from("listings")
      .select(FULL_LISTING_COLUMNS)
      .eq("slug", slug)
      .eq("status", "published")
      .maybeSingle();

    if (error) {
      const fallback =
        FALLBACK_LISTINGS.find(
          (l) => l.slug === slug && l.status === "published",
        ) ?? null;
      return { listing: fallback, fromFallback: Boolean(fallback) };
    }

    if (!data) {
      const fallback =
        FALLBACK_LISTINGS.find(
          (l) => l.slug === slug && l.status === "published",
        ) ?? null;
      return { listing: fallback, fromFallback: Boolean(fallback) };
    }

    return { listing: data as Listing, fromFallback: false };
  } catch {
    const fallback =
      FALLBACK_LISTINGS.find(
        (l) => l.slug === slug && l.status === "published",
      ) ?? null;
    return { listing: fallback, fromFallback: Boolean(fallback) };
  }
}

/** Slug + date per sitemap (solo published). */
export async function getPublishedListingSlugs(): Promise<
  { slug: string; created_at: string }[]
> {
  if (!isSupabaseConfigured()) {
    return FALLBACK_LISTINGS.filter((l) => l.status === "published").map(
      (l) => ({ slug: l.slug, created_at: l.created_at }),
    );
  }

  try {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from("listings_public")
      .select("slug, created_at")
      .order("created_at", { ascending: false });

    if (error || !data?.length) {
      return FALLBACK_LISTINGS.filter((l) => l.status === "published").map(
        (l) => ({ slug: l.slug, created_at: l.created_at }),
      );
    }

    return data as { slug: string; created_at: string }[];
  } catch {
    return FALLBACK_LISTINGS.filter((l) => l.status === "published").map(
      (l) => ({ slug: l.slug, created_at: l.created_at }),
    );
  }
}

/** Conteggio annunci published (social proof). */
export async function getPublishedCount(): Promise<number> {
  if (!isSupabaseConfigured()) {
    return FALLBACK_LISTINGS.filter((l) => l.status === "published").length;
  }

  try {
    const supabase = getSupabaseClient();
    const { count, error } = await supabase
      .from("listings_public")
      .select("id", { count: "exact", head: true });

    if (error || count == null) {
      return FALLBACK_LISTINGS.filter((l) => l.status === "published").length;
    }
    return count;
  } catch {
    return FALLBACK_LISTINGS.filter((l) => l.status === "published").length;
  }
}

/** Coppie categoria+città dagli annunci published (SEO hubs). */
export async function getCategoryCityPairs(): Promise<
  { category: string; city: string }[]
> {
  if (!isSupabaseConfigured()) {
    return FALLBACK_LISTINGS.filter((l) => l.status === "published").map(
      (l) => ({ category: l.category, city: l.location_city }),
    );
  }

  try {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from("listings_public")
      .select("category, location_city")
      .limit(500);

    if (error || !data?.length) {
      return FALLBACK_LISTINGS.filter((l) => l.status === "published").map(
        (l) => ({ category: l.category, city: l.location_city }),
      );
    }

    return data.map((row) => ({
      category: row.category as string,
      city: row.location_city as string,
    }));
  } catch {
    return FALLBACK_LISTINGS.filter((l) => l.status === "published").map(
      (l) => ({ category: l.category, city: l.location_city }),
    );
  }
}

export type CreateListingInput = {
  macro_branch: MacroBranch;
  category: string;
  title: string;
  description: string;
  company_or_family_name: string;
  location_city: string;
  location_zone?: string | null;
  is_remote?: boolean;
  work_type: WorkType;
  salary_custom?: string | null;
  contact_phone: string;
  contact_whatsapp?: string | null;
  intent?: ListingIntent;
};

async function ensureUniqueSlug(
  title: string,
  city: string,
): Promise<string> {
  const base = buildListingSlug(title, city);
  if (!isSupabaseConfigured()) {
    return buildListingSlug(title, city, Date.now().toString(36).slice(-4));
  }

  const supabase = getSupabaseClient();
  for (let attempt = 0; attempt < 8; attempt++) {
    const candidate =
      attempt === 0
        ? base
        : buildListingSlug(title, city, String(attempt + 1).padStart(3, "0"));

    // Check via admin if available (pending rows are hidden by RLS SELECT)
    if (isSupabaseAdminConfigured()) {
      const admin = getSupabaseAdminClient();
      const { data } = await admin
        .from("listings")
        .select("id")
        .eq("slug", candidate)
        .maybeSingle();
      if (!data) return candidate;
      continue;
    }

    const { data } = await supabase
      .from("listings")
      .select("id")
      .eq("slug", candidate)
      .maybeSingle();

    if (!data) return candidate;
  }

  return buildListingSlug(
    title,
    city,
    `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 5)}`,
  );
}

export async function createListing(
  input: CreateListingInput,
): Promise<{ listing: Listing | null; error: string | null }> {
  if (!isSupabaseConfigured()) {
    return {
      listing: null,
      error:
        "Supabase non configurato. Aggiungi NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local.",
    };
  }

  try {
    const slug = await ensureUniqueSlug(input.title, input.location_city);
    const supabase = getSupabaseClient();

    const row = {
      macro_branch: input.macro_branch,
      category: input.category.trim().toLowerCase().replace(/\s+/g, "_"),
      title: input.title.trim(),
      slug,
      description: input.description.trim(),
      company_or_family_name: input.company_or_family_name.trim(),
      location_city: input.location_city.trim(),
      location_zone: input.location_zone?.trim() || null,
      is_remote: Boolean(input.is_remote),
      work_type: input.work_type,
      salary_custom: input.salary_custom?.trim() || null,
      contact_phone: input.contact_phone.trim(),
      contact_whatsapp: input.contact_whatsapp?.trim() || null,
      apply_external_url: null,
      is_featured: false,
      is_verified: false,
      status: "pending" as const,
      intent: input.intent === "offro" ? ("offro" as const) : ("cerco" as const),
    };

    // RLS: SELECT solo published → non usare .select() dopo insert
    const { error } = await supabase.from("listings").insert(row);

    if (error) {
      return { listing: null, error: error.message };
    }

    const listing: Listing = {
      id: "pending",
      ...row,
      created_at: new Date().toISOString(),
    };

    return { listing, error: null };
  } catch (err) {
    return {
      listing: null,
      error: err instanceof Error ? err.message : "Errore imprevisto",
    };
  }
}

/** Moderazione: lista per status (richiede service role). */
export async function getListingsForModeration(
  status: ListingStatus = "pending",
): Promise<{ listings: Listing[]; error: string | null }> {
  if (!isSupabaseAdminConfigured()) {
    return {
      listings: [],
      error:
        "Configura SUPABASE_SERVICE_ROLE_KEY in .env.local per la moderazione.",
    };
  }

  try {
    const admin = getSupabaseAdminClient();
    const { data, error } = await admin
      .from("listings")
      .select(FULL_LISTING_COLUMNS)
      .eq("status", status)
      .order("created_at", { ascending: true })
      .limit(100);

    if (error) return { listings: [], error: error.message };
    return { listings: (data ?? []) as Listing[], error: null };
  } catch (err) {
    return {
      listings: [],
      error: err instanceof Error ? err.message : "Errore imprevisto",
    };
  }
}

export async function updateListingStatus(
  id: string,
  status: Extract<ListingStatus, "published" | "rejected">,
): Promise<{ ok: boolean; error: string | null }> {
  if (!isSupabaseAdminConfigured()) {
    return {
      ok: false,
      error: "SUPABASE_SERVICE_ROLE_KEY mancante.",
    };
  }

  try {
    const admin = getSupabaseAdminClient();
    const { error } = await admin
      .from("listings")
      .update({ status })
      .eq("id", id);

    if (error) return { ok: false, error: error.message };
    return { ok: true, error: null };
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : "Errore imprevisto",
    };
  }
}

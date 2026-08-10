import { getSupabaseClient, isSupabaseConfigured } from "@/lib/supabaseClient";
import { buildListingSlug } from "@/lib/slug";
import type {
  Listing,
  ListingPublic,
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
    created_at: new Date().toISOString(),
    contact_phone: "+390200000003",
    contact_whatsapp: null,
  },
];

function toPublic(listing: Listing): ListingPublic {
  const { contact_phone: _p, contact_whatsapp: _w, ...rest } = listing;
  return rest;
}

export type ListingFilters = {
  branch?: MacroBranch;
  q?: string;
  city?: string;
  zone?: string;
  workType?: WorkType;
  limit?: number;
};

function filterFallback(filters: ListingFilters): ListingPublic[] {
  let rows = [...FALLBACK_LISTINGS];

  if (filters.branch) {
    rows = rows.filter((r) => r.macro_branch === filters.branch);
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

    if (!data.length && (filters.branch || filters.q || filters.city)) {
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

export async function getListingBySlug(
  slug: string,
): Promise<{ listing: Listing | null; fromFallback: boolean }> {
  if (!slug) return { listing: null, fromFallback: false };

  if (!isSupabaseConfigured()) {
    const fallback = FALLBACK_LISTINGS.find((l) => l.slug === slug) ?? null;
    return { listing: fallback, fromFallback: true };
  }

  try {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from("listings")
      .select(FULL_LISTING_COLUMNS)
      .eq("slug", slug)
      .maybeSingle();

    if (error) {
      const fallback = FALLBACK_LISTINGS.find((l) => l.slug === slug) ?? null;
      return { listing: fallback, fromFallback: Boolean(fallback) };
    }

    if (!data) {
      const fallback = FALLBACK_LISTINGS.find((l) => l.slug === slug) ?? null;
      return { listing: fallback, fromFallback: Boolean(fallback) };
    }

    return { listing: data as Listing, fromFallback: false };
  } catch {
    const fallback = FALLBACK_LISTINGS.find((l) => l.slug === slug) ?? null;
    return { listing: fallback, fromFallback: Boolean(fallback) };
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
    };

    const { data, error } = await supabase
      .from("listings")
      .insert(row)
      .select(FULL_LISTING_COLUMNS)
      .single();

    if (error) {
      return { listing: null, error: error.message };
    }

    return { listing: data as Listing, error: null };
  } catch (err) {
    return {
      listing: null,
      error: err instanceof Error ? err.message : "Errore imprevisto",
    };
  }
}

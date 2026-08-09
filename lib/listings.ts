import { getSupabaseClient, isSupabaseConfigured } from "@/lib/supabaseClient";
import type { ListingPublic } from "@/lib/types";

const FALLBACK_LISTINGS: ListingPublic[] = [
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
  },
];

export async function getLatestListings(
  limit = 6,
): Promise<{ listings: ListingPublic[]; fromFallback: boolean }> {
  if (!isSupabaseConfigured()) {
    return { listings: FALLBACK_LISTINGS.slice(0, limit), fromFallback: true };
  }

  try {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from("listings_public")
      .select(
        "id, macro_branch, category, title, slug, description, company_or_family_name, location_city, location_zone, is_remote, work_type, salary_custom, apply_external_url, is_featured, is_verified, created_at",
      )
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error || !data?.length) {
      return { listings: FALLBACK_LISTINGS.slice(0, limit), fromFallback: true };
    }

    return { listings: data as ListingPublic[], fromFallback: false };
  } catch {
    return { listings: FALLBACK_LISTINGS.slice(0, limit), fromFallback: true };
  }
}

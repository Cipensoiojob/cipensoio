/**
 * Import scrapati → Supabase `listings` (service role).
 *
 * Uso:
 *   npm run scrape:import                 # EURES Italia (default, annunci reali)
 *   npm run scrape:import -- --dry-run
 *   npm run scrape:import -- --source=eures
 *   npm run scrape:import -- --source=catalog   # solo test
 *   npm run scrape:import -- --url https://…
 *   npm run scrape:import -- --max=30
 *   npm run scrape:import -- --purge-seeds      # nasconde i seed finti catalog-*
 */
import { config } from "dotenv";
import { resolve } from "node:path";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { buildListingSlug } from "../lib/slug";
import type { MacroBranch, WorkType } from "../lib/types";
import { WORK_TYPES } from "../lib/types";
import { scrapeSampleSource, type ScrapeSource } from "./scrapers/sampleScraper";
import type { ScrapedListing } from "./scrapers/utils";
import { sanitizeText } from "./scrapers/utils";

config({ path: resolve(process.cwd(), ".env.local"), quiet: true });
config({ path: resolve(process.cwd(), ".env"), quiet: true });

const MACRO_BRANCHES: MacroBranch[] = [
  "persona_assistenza",
  "pet_home",
  "lavoro_tradizionale",
];

export type ImportResult = {
  inserted: number;
  updated: number;
  skipped: number;
  errors: { title: string; error: string }[];
};

function normalizeSupabaseUrl(url: string): string {
  return url.replace(/\/rest\/v1\/?$/, "").replace(/\/$/, "");
}

export function createAdminClient(): SupabaseClient {
  const rawUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!rawUrl || !serviceKey || serviceKey.includes("YOUR_SERVICE_ROLE")) {
    throw new Error(
      "Configura NEXT_PUBLIC_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY in .env.local",
    );
  }

  return createClient(normalizeSupabaseUrl(rawUrl), serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

function isMacroBranch(value: string): value is MacroBranch {
  return MACRO_BRANCHES.includes(value as MacroBranch);
}

function isWorkType(value: string): value is WorkType {
  return (WORK_TYPES as string[]).includes(value);
}

type ListingRow = {
  macro_branch: MacroBranch;
  category: string;
  title: string;
  slug: string;
  description: string;
  company_or_family_name: string;
  location_city: string;
  location_zone: string | null;
  is_remote: boolean;
  work_type: WorkType;
  salary_custom: string | null;
  contact_phone: string;
  contact_whatsapp: string | null;
  apply_external_url: string | null;
  status: "published";
  is_featured: false;
  is_verified: false;
  intent: "cerco" | "offro";
};

/** Valida, sanifica e prepara la riga per upsert. */
export function prepareListingRow(
  input: ScrapedListing,
  slug: string,
): { ok: true; row: ListingRow } | { ok: false; error: string } {
  if (!isMacroBranch(input.macro_branch)) {
    return { ok: false, error: "macro_branch non valido" };
  }
  if (!isWorkType(input.work_type)) {
    return { ok: false, error: "work_type non valido" };
  }

  const title = sanitizeText(input.title);
  const description = sanitizeText(input.description);
  const city = sanitizeText(input.location_city);
  const company = sanitizeText(input.company_or_family_name);
  const phone = sanitizeText(input.contact_phone).replace(/\s+/g, "");
  const category = sanitizeText(input.category)
    .toLowerCase()
    .replace(/\s+/g, "_")
    .replace(/[^a-z0-9_]/g, "");

  if (title.length < 8) return { ok: false, error: "titolo troppo corto" };
  if (description.length < 20) {
    return { ok: false, error: "descrizione troppo corta" };
  }
  if (!city) return { ok: false, error: "città mancante" };
  if (!company) return { ok: false, error: "nome inserzionista mancante" };
  if (phone.replace(/\D/g, "").length < 8) {
    return { ok: false, error: "telefono non valido" };
  }
  if (!category) return { ok: false, error: "categoria mancante" };

  return {
    ok: true,
    row: {
      macro_branch: input.macro_branch,
      category,
      title,
      slug,
      description,
      company_or_family_name: company,
      location_city: city,
      location_zone: sanitizeText(input.location_zone ?? "") || null,
      is_remote: Boolean(input.is_remote),
      work_type: input.work_type,
      salary_custom: sanitizeText(input.salary_custom ?? "") || null,
      contact_phone: phone,
      contact_whatsapp: sanitizeText(input.contact_whatsapp ?? "") || null,
      apply_external_url: input.apply_external_url?.trim() || null,
      status: "published",
      is_featured: false,
      is_verified: false,
      intent: input.intent === "offro" ? "offro" : "cerco",
    },
  };
}

async function ensureUniqueSlug(
  admin: SupabaseClient,
  title: string,
  city: string,
  preferredSuffix?: string,
): Promise<string> {
  const base = preferredSuffix
    ? buildListingSlug(title, city, preferredSuffix)
    : buildListingSlug(title, city);

  for (let attempt = 0; attempt < 12; attempt++) {
    const candidate =
      attempt === 0
        ? base
        : buildListingSlug(
            title,
            city,
            `${preferredSuffix ?? ""}${String(attempt + 1).padStart(2, "0")}`.replace(
              /^-/,
              "",
            ),
          );

    const { data } = await admin
      .from("listings")
      .select("id")
      .eq("slug", candidate)
      .maybeSingle();

    if (!data) return candidate;
  }

  return buildListingSlug(
    title,
    city,
    `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 4)}`,
  );
}

/**
 * Riceve un array di annunci scrapati e li scrive su Supabase.
 * - slug univoco via `lib/slug.ts`
 * - status sempre `published`
 * - conflitto su `slug` → upsert
 */
export async function importListings(
  listingsData: ScrapedListing[],
  options?: { dryRun?: boolean; client?: SupabaseClient },
): Promise<ImportResult> {
  const dryRun = Boolean(options?.dryRun);
  const admin = options?.client ?? (dryRun ? null : createAdminClient());

  const result: ImportResult = {
    inserted: 0,
    updated: 0,
    skipped: 0,
    errors: [],
  };

  for (const item of listingsData) {
    const titleHint = sanitizeText(item.title) || "(senza titolo)";
    const cityHint = sanitizeText(item.location_city) || "n-a";
    const provisionalSlug = buildListingSlug(titleHint, cityHint);

    const prepared = prepareListingRow(item, provisionalSlug);
    if (!prepared.ok) {
      result.skipped += 1;
      result.errors.push({ title: titleHint, error: prepared.error });
      continue;
    }

    if (dryRun || !admin) {
      console.log(
        `[dry-run] UPSERT — ${prepared.row.title} @ ${prepared.row.location_city} → ${prepared.row.slug}`,
      );
      result.inserted += 1;
      continue;
    }

    try {
      // Dedup stabile su URL esterno; slug sempre con suffisso corto dall'URL.
      let existingSlug: string | null = null;
      const extUrl = prepared.row.apply_external_url;
      if (extUrl) {
        const { data: byUrl } = await admin
          .from("listings")
          .select("slug")
          .eq("apply_external_url", extUrl)
          .maybeSingle();
        existingSlug = byUrl?.slug ?? null;
      } else {
        const { data: byTitleCity } = await admin
          .from("listings")
          .select("slug")
          .eq("title", prepared.row.title)
          .eq("location_city", prepared.row.location_city)
          .maybeSingle();
        existingSlug = byTitleCity?.slug ?? null;
      }

      const urlSuffix = extUrl
        ? extUrl.replace(/[^a-zA-Z0-9]/g, "").slice(-10).toLowerCase()
        : undefined;

      const slug =
        existingSlug ??
        (await ensureUniqueSlug(
          admin,
          prepared.row.title,
          prepared.row.location_city,
          urlSuffix,
        ));

      const row = { ...prepared.row, slug };

      const { error, data } = await admin
        .from("listings")
        .upsert(row, { onConflict: "slug" })
        .select("id, created_at")
        .single();

      if (error) {
        result.errors.push({ title: row.title, error: error.message });
        result.skipped += 1;
        continue;
      }

      // Heuristica: se created_at ≈ now → insert, altrimenti update
      const created = data?.created_at
        ? new Date(data.created_at).getTime()
        : 0;
      const isFresh = Date.now() - created < 5_000;
      if (isFresh) {
        result.inserted += 1;
        console.log(`+ upsert (nuovo): ${row.title} → ${slug}`);
      } else {
        result.updated += 1;
        console.log(`↻ upsert (update): ${row.title} → ${slug}`);
      }
    } catch (err) {
      result.errors.push({
        title: prepared.row.title,
        error: err instanceof Error ? err.message : "errore imprevisto",
      });
      result.skipped += 1;
    }
  }

  return result;
}

function parseArgs(argv: string[]) {
  const dryRun = argv.includes("--dry-run");
  const purgeSeeds = argv.includes("--purge-seeds");
  const urlIdx = argv.indexOf("--url");
  const url =
    urlIdx >= 0 && argv[urlIdx + 1] ? argv[urlIdx + 1] : undefined;

  const maxArg = argv.find((a) => a.startsWith("--max="));
  const maxListings = maxArg
    ? Number.parseInt(maxArg.split("=")[1] ?? "", 10)
    : undefined;

  let source: ScrapeSource | undefined;
  const sourceArg = argv.find((a) => a.startsWith("--source="));
  if (sourceArg) {
    const value = sourceArg.split("=")[1] as ScrapeSource;
    if (
      value === "eures" ||
      value === "catalog" ||
      value === "html" ||
      value === "url"
    ) {
      source = value;
    }
  } else if (url) {
    source = "url";
  } else {
    source = "eures";
  }

  return {
    dryRun,
    purgeSeeds,
    url,
    source,
    maxListings:
      maxListings && Number.isFinite(maxListings) && maxListings > 0
        ? maxListings
        : undefined,
  };
}

/** Nasconde seed/fixture (catalogo demo e URL cipensoio.it/seed/). */
export async function purgeFixtureListings(
  options?: { dryRun?: boolean; client?: SupabaseClient },
): Promise<number> {
  const dryRun = Boolean(options?.dryRun);
  const admin = options?.client ?? (dryRun ? null : createAdminClient());
  if (dryRun || !admin) {
    console.log(
      "[dry-run] purge seed: apply_external_url LIKE %cipensoio.it/seed/% o company Demo",
    );
    return 0;
  }

  const { data, error } = await admin
    .from("listings")
    .update({ status: "rejected" })
    .or(
      [
        "apply_external_url.ilike.%cipensoio.it/seed/%",
        "apply_external_url.eq.https://example.com/test",
        "company_or_family_name.ilike.%Demo%",
        "company_or_family_name.ilike.%fixture%",
        "title.ilike.%prova HTML parser%",
      ].join(","),
    )
    .neq("status", "rejected")
    .select("id");

  if (error) {
    throw new Error(`purge seed fallito: ${error.message}`);
  }
  return data?.length ?? 0;
}

async function main() {
  const { dryRun, purgeSeeds, url, source, maxListings } = parseArgs(
    process.argv.slice(2),
  );

  if (purgeSeeds) {
    console.log("→ Purge seed / fixture…");
    const n = await purgeFixtureListings({ dryRun });
    console.log(`  nascosti (rejected): ${n}`);
  }

  console.log("→ Scrape…");
  const scraped = await scrapeSampleSource({
    url,
    source,
    maxListings,
  });
  console.log(`  ${scraped.length} ScrapedListing validi`);
  console.log(
    `  di cui offro=${scraped.filter((s) => s.intent === "offro").length}, cerco=${scraped.filter((s) => s.intent !== "offro").length}`,
  );

  if (!scraped.length) {
    console.log("Niente da importare.");
    return;
  }

  console.log(
    dryRun
      ? "→ Dry-run (nessuna scrittura su Supabase)…"
      : "→ Import su Supabase (service role)…",
  );

  const result = await importListings(scraped, { dryRun });

  console.log("\nRisultato:");
  console.log(`  inserted: ${result.inserted}`);
  console.log(`  updated:  ${result.updated}`);
  console.log(`  skipped:  ${result.skipped}`);
  if (result.errors.length) {
    console.log("  errori:");
    for (const e of result.errors) {
      console.log(`    - ${e.title}: ${e.error}`);
    }
  }
}

const isDirectRun = process.argv[1]?.includes("import-scraped-data");

if (isDirectRun) {
  main().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}

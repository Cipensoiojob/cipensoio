/**
 * Utility condivise per scraper → payload CiPensoIo.
 */
import type { MacroBranch, WorkType } from "../../lib/types";
import type { BranchSlug } from "../../lib/types";
import { BRANCH_SLUG_TO_ID } from "../../lib/types";

/** Record grezzo estratto da una pagina / feed. */
export type ScrapedRawItem = {
  title?: string;
  description?: string;
  company?: string;
  city?: string;
  zone?: string;
  category?: string;
  sourceCategory?: string;
  workType?: string;
  salary?: string;
  phone?: string;
  whatsapp?: string;
  isRemote?: boolean;
  url?: string;
  /** Se presente, ha priorità sull'heuristica dal testo. */
  intent?: "cerco" | "offro";
};

/**
 * Telefono sentinella: candidatura solo via link esterno (schema NOT NULL).
 * ContactCard lo nasconde e mostra il CTA sul sito originale.
 */
export const APPLY_ONLY_PHONE = "+390000000000";

/**
 * Dato estratto pronto per `importListings` / tabella `listings`.
 * Alias richiesto dalla specifica scraper.
 */
export type ScrapedListing = {
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
  apply_external_url?: string | null;
  intent?: "cerco" | "offro";
};

/** @deprecated usa ScrapedListing */
export type ScrapedListingInput = ScrapedListing;

const BRANCH_KEYWORDS: Record<MacroBranch, string[]> = {
  persona_assistenza: [
    "badante",
    "colf",
    "babysitter",
    "baby sitter",
    "oss",
    "assistenza",
    "anziani",
    "caregiver",
    "domestica",
  ],
  pet_home: [
    "dog sitter",
    "dogsitter",
    "cat sitter",
    "catsitter",
    "pet",
    "stiro",
    "giardinaggio",
    "pulizie",
    "casa",
    "manutenzione",
    "idraulico",
    "elettricista",
    "manutentore",
  ],
  lavoro_tradizionale: [
    "developer",
    "ingegnere",
    "engineer",
    "ai",
    "fullstack",
    "commerciale",
    "ristorazione",
    "cameriere",
    "remote",
    "tech",
    "lavoro",
  ],
};

/** Map URL kebab (`persona-assistenza`) → enum DB. */
const BRANCH_SLUG_ALIASES: Record<string, MacroBranch> = {
  ...BRANCH_SLUG_TO_ID,
  persona_assistenza: "persona_assistenza",
  pet_home: "pet_home",
  lavoro_tradizionale: "lavoro_tradizionale",
};

const WORK_TYPE_MAP: Record<string, WorkType> = {
  full_time: "full_time",
  "full-time": "full_time",
  fulltime: "full_time",
  "tempo pieno": "full_time",
  part_time: "part_time",
  "part-time": "part_time",
  parttime: "part_time",
  "part time": "part_time",
  convivenza: "convivenza",
  convivente: "convivenza",
  ad_ore: "ad_ore",
  "ad ore": "ad_ore",
  ore: "ad_ore",
  oraria: "ad_ore",
  turni: "turni",
  turno: "turni",
};

/** Pulisce HTML/entities e whitespace. */
export function sanitizeText(input: string | null | undefined): string {
  if (!input) return "";
  return input
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/\u00a0/g, " ")
    .replace(/[\t\r\n]+/g, " ")
    .replace(/\s{2,}/g, " ")
    .trim();
}

/** Estrae il primo telefono IT plausibile (con o senza +39). */
export function extractPhone(text: string | null | undefined): string | null {
  if (!text) return null;
  const cleaned = text.replace(/[^\d+()\s./-]/g, " ");
  const match = cleaned.match(
    /(?:\+?39[\s./-]?)?(?:0\d{1,4}|3\d{2})[\s./-]?\d{2,4}[\s./-]?\d{2,4}[\s./-]?\d{0,4}/,
  );
  if (!match) return null;
  const digits = match[0].replace(/\D/g, "");
  if (digits.length < 8 || digits.length > 13) return null;
  if (digits.startsWith("39") && digits.length >= 10) {
    return `+${digits}`;
  }
  return digits.startsWith("0") || digits.startsWith("3")
    ? `+39${digits}`
    : `+${digits}`;
}

/** WhatsApp: preferisce numeri mobili IT (3xx). */
export function extractWhatsApp(
  text: string | null | undefined,
  fallbackPhone?: string | null,
): string | null {
  if (!text && !fallbackPhone) return null;
  const fromText = extractPhone(text);
  const candidate = fromText ?? fallbackPhone ?? null;
  if (!candidate) return null;
  const digits = candidate.replace(/\D/g, "");
  const national = digits.startsWith("39") ? digits.slice(2) : digits;
  if (national.startsWith("3")) return `+39${national}`;
  if (text && /whats?\s*app/i.test(text) && fallbackPhone) {
    return extractPhone(fallbackPhone);
  }
  return null;
}

export function resolveBranchSlug(
  value: string | null | undefined,
): MacroBranch | null {
  if (!value) return null;
  const key = value.trim().toLowerCase();
  return BRANCH_SLUG_ALIASES[key] ?? null;
}

export function mapSourceCategoryToBranch(
  sourceCategory: string | null | undefined,
  title = "",
  description = "",
): MacroBranch {
  const explicit = resolveBranchSlug(sourceCategory);
  if (explicit) return explicit;

  const haystack =
    `${sourceCategory ?? ""} ${title} ${description}`.toLowerCase();

  let best: MacroBranch = "lavoro_tradizionale";
  let bestScore = 0;

  for (const [branch, keywords] of Object.entries(BRANCH_KEYWORDS) as [
    MacroBranch,
    string[],
  ][]) {
    const score = keywords.reduce(
      (acc, kw) => (haystack.includes(kw) ? acc + 1 : acc),
      0,
    );
    if (score > bestScore) {
      bestScore = score;
      best = branch;
    }
  }

  return best;
}

export function mapWorkType(
  raw: string | null | undefined,
  fallback: WorkType = "ad_ore",
): WorkType {
  if (!raw) return fallback;
  const key = sanitizeText(raw).toLowerCase();
  return WORK_TYPE_MAP[key] ?? fallback;
}

export function normalizeCategory(raw: string | null | undefined): string {
  const base = sanitizeText(raw || "generico")
    .toLowerCase()
    .replace(/\s+/g, "_")
    .replace(/[^a-z0-9_]/g, "");
  return base || "generico";
}

/** Trasforma dati grezzi → `ScrapedListing` (formato atteso da Supabase/import). */
export function transformRawToScrapedListing(
  raw: ScrapedRawItem,
): ScrapedListing | null {
  const title = sanitizeText(raw.title);
  const description = sanitizeText(raw.description);
  const city = sanitizeText(raw.city);
  const company = sanitizeText(raw.company) || "Inserzionista";

  const phone =
    extractPhone(raw.phone) ||
    extractPhone(raw.description) ||
    extractPhone(raw.title);
  const applyUrl = raw.url?.trim() || null;

  if (!title || title.length < 8) return null;
  if (!description || description.length < 20) return null;
  if (!city) return null;
  if (!phone && !applyUrl) return null;

  const branch = mapSourceCategoryToBranch(
    raw.sourceCategory ?? raw.category,
    title,
    description,
  );

  const contactPhone = phone ?? APPLY_ONLY_PHONE;

  return {
    macro_branch: branch,
    category: normalizeCategory(raw.category ?? raw.sourceCategory),
    title,
    description,
    company_or_family_name: company,
    location_city: city,
    location_zone: sanitizeText(raw.zone) || null,
    is_remote: Boolean(raw.isRemote),
    work_type: mapWorkType(raw.workType),
    salary_custom: sanitizeText(raw.salary) || null,
    contact_phone: contactPhone,
    contact_whatsapp:
      contactPhone === APPLY_ONLY_PHONE
        ? null
        : extractWhatsApp(raw.whatsapp ?? raw.description, contactPhone),
    apply_external_url: applyUrl,
    intent: inferIntent(raw.intent, title, description),
  };
}

/** Preferisce hint esplicito; altrimenti segnali cerco (prioritari) vs offro. */
function inferIntent(
  hint: "cerco" | "offro" | undefined,
  title: string,
  description: string,
): "cerco" | "offro" {
  if (hint === "cerco" || hint === "offro") return hint;
  const blob = `${title} ${description}`;
  if (
    /cercasi|famiglia\s+cerca|azienda\s+cerca|ristorante\s+cerca|startup\s+cerca|\bserve\b|si\s+cerca|cerchiamo/i.test(
      blob,
    )
  ) {
    return "cerco";
  }
  if (/disponibil|offro|cerco lavoro|mi propongo|sono\s+disponibile/i.test(blob)) {
    return "offro";
  }
  return "cerco";
}

/** @deprecated usa transformRawToScrapedListing */
export const toScrapedListingInput = transformRawToScrapedListing;

export type { BranchSlug };

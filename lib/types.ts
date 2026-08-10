export type MacroBranch =
  | "persona_assistenza"
  | "pet_home"
  | "lavoro_tradizionale";

export type WorkType =
  | "full_time"
  | "part_time"
  | "convivenza"
  | "ad_ore"
  | "turni";

export type ListingStatus = "pending" | "published" | "rejected";

/** Cerco = domanda (famiglia/azienda). Offro = vetrina operatore. */
export type ListingIntent = "cerco" | "offro";

/** Campi pubblici (senza contatti protetti). */
export type ListingPublic = {
  id: string;
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
  apply_external_url: string | null;
  is_featured: boolean;
  is_verified: boolean;
  status: ListingStatus;
  intent: ListingIntent;
  created_at: string;
};

/** Annuncio completo incluso contatti (dettaglio / pubblicazione / admin). */
export type Listing = ListingPublic & {
  contact_phone: string;
  contact_whatsapp: string | null;
};

/** Segmenti URL kebab-case dei macro-rami (FASE 2). */
export type BranchSlug =
  | "persona-assistenza"
  | "pet-home"
  | "lavoro-tradizionale";

export const BRANCH_SLUGS: readonly BranchSlug[] = [
  "persona-assistenza",
  "pet-home",
  "lavoro-tradizionale",
] as const;

export const BRANCH_SLUG_TO_ID: Record<BranchSlug, MacroBranch> = {
  "persona-assistenza": "persona_assistenza",
  "pet-home": "pet_home",
  "lavoro-tradizionale": "lavoro_tradizionale",
};

export const BRANCH_ID_TO_SLUG: Record<MacroBranch, BranchSlug> = {
  persona_assistenza: "persona-assistenza",
  pet_home: "pet-home",
  lavoro_tradizionale: "lavoro-tradizionale",
};

export function isBranchSlug(value: string): value is BranchSlug {
  return (BRANCH_SLUGS as readonly string[]).includes(value);
}

export const MACRO_BRANCHES = [
  {
    id: "persona_assistenza" as const,
    href: "/assistenza-care",
    label: "Assistenza & Persona",
    short: "Assistenza",
    description:
      "Badanti, colf, OSS (Care) e babysitter su percorsi separati.",
    color: "var(--branch-assistenza)",
    accent: "var(--branch-assistenza-accent)",
    categories: ["badante", "colf", "oss", "babysitter"],
  },
  {
    id: "pet_home" as const,
    href: "/pet-sitter",
    label: "Pet & Professionisti",
    short: "Pet & Casa",
    description:
      "Pet sitter e professionisti casa (idraulico, elettricista…).",
    color: "var(--branch-pet)",
    accent: "var(--branch-pet-accent)",
    categories: [
      "dogsitter",
      "catsitter",
      "stiro",
      "giardinaggio",
      "idraulico",
      "elettricista",
      "pulizie",
      "manutentore",
    ],
  },
  {
    id: "lavoro_tradizionale" as const,
    href: "/lavoro",
    label: "Lavoro & Tech",
    short: "Lavoro",
    description:
      "Tech/AI, ristorazione, commerciale ed entry-level.",
    color: "var(--branch-lavoro)",
    accent: "var(--branch-lavoro-accent)",
    categories: [
      "ai_engineer",
      "sviluppatore",
      "commerciale",
      "ristorazione",
      "cameriere",
      "barista",
      "manutentore",
    ],
  },
] as const;

export function getBranchMeta(id: MacroBranch) {
  return MACRO_BRANCHES.find((b) => b.id === id)!;
}

export const WORK_TYPE_LABELS: Record<WorkType, string> = {
  full_time: "Full time",
  part_time: "Part time",
  convivenza: "Convivenza",
  ad_ore: "Ad ore",
  turni: "Turni",
};

export const WORK_TYPES = Object.keys(WORK_TYPE_LABELS) as WorkType[];

export const STATUS_LABELS: Record<ListingStatus, string> = {
  pending: "In attesa",
  published: "Pubblicato",
  rejected: "Rifiutato",
};

export const INTENT_LABELS: Record<ListingIntent, string> = {
  cerco: "Cerco lavoro",
  offro: "Offro lavoro",
};

export const INTENT_HINTS: Record<ListingIntent, string> = {
  cerco: "Chi cerca una persona o un servizio da assumere",
  offro: "Chi offre il proprio lavoro ed è già disponibile",
};

export const SITE_URL = "https://cipensoio.it";

export const PUBLIC_LISTING_COLUMNS =
  "id, macro_branch, category, title, slug, description, company_or_family_name, location_city, location_zone, is_remote, work_type, salary_custom, apply_external_url, is_featured, is_verified, created_at, status, intent" as const;

export const FULL_LISTING_COLUMNS =
  `${PUBLIC_LISTING_COLUMNS}, contact_phone, contact_whatsapp` as const;

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
  created_at: string;
};

export const MACRO_BRANCHES = [
  {
    id: "persona_assistenza" as const,
    href: "/assistenza",
    label: "Assistenza & Persona",
    short: "Assistenza",
    description:
      "Badanti, colf, babysitter e OSS vicino a casa tua.",
    color: "var(--branch-assistenza)",
    accent: "var(--branch-assistenza-accent)",
  },
  {
    id: "pet_home" as const,
    href: "/pet-home",
    label: "Pet & Home Care",
    short: "Pet & Casa",
    description:
      "Dog/cat sitter, stiro, giardinaggio e piccole manutenzioni.",
    color: "var(--branch-pet)",
    accent: "var(--branch-pet-accent)",
  },
  {
    id: "lavoro_tradizionale" as const,
    href: "/lavoro",
    label: "Lavoro & Tech",
    short: "Lavoro",
    description:
      "Tech/AI, full remote, ristorazione, commerciale ed entry-level.",
    color: "var(--branch-lavoro)",
    accent: "var(--branch-lavoro-accent)",
  },
] as const;

export const WORK_TYPE_LABELS: Record<WorkType, string> = {
  full_time: "Full time",
  part_time: "Part time",
  convivenza: "Convivenza",
  ad_ore: "Ad ore",
  turni: "Turni",
};

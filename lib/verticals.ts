/**
 * Verticali UX (5 porte) mappate su macro_branch + category del DB.
 * Sottolivello ovunque: Offro lavoro | Cerco lavoro (campo `intent`).
 */
import type { MacroBranch } from "@/lib/types";

export type VerticalSlug =
  | "assistenza-care"
  | "babysitter"
  | "pet-sitter"
  | "professionisti"
  | "lavoro";

export type VerticalMeta = {
  slug: VerticalSlug;
  href: string;
  label: string;
  short: string;
  description: string;
  /** Esempio flusso badante / professionista. */
  offroHint: string;
  cercoHint: string;
  color: string;
  accent: string;
  /** Enum DB esistente. */
  macroBranch: MacroBranch;
  /** Categorie listing ammesse in questa verticale. */
  categories: readonly string[];
  categoryLabels: Record<string, string>;
};

export const VERTICALS: readonly VerticalMeta[] = [
  {
    slug: "assistenza-care",
    href: "/assistenza-care",
    label: "Assistenza Care",
    short: "Care",
    description:
      "Badanti, colf e OSS. Chi offre si mette in vetrina; chi cerca pubblica o contatta i disponibili.",
    offroHint: "Sono badante / colf / OSS — metti in vetrina il tuo profilo",
    cercoHint: "Cerco assistenza — pubblica la richiesta o vedi chi è disponibile",
    color: "var(--branch-assistenza)",
    accent: "var(--branch-assistenza-accent)",
    macroBranch: "persona_assistenza",
    categories: ["badante", "colf", "oss"],
    categoryLabels: {
      badante: "Badante",
      colf: "Colf",
      oss: "OSS",
    },
  },
  {
    slug: "babysitter",
    href: "/babysitter",
    label: "Babysitter",
    short: "Babysitter",
    description:
      "Solo babysitter e tata. Separato dall’assistenza anziani, così non si confonde.",
    offroHint: "Offro babysitting — registrati in vetrina",
    cercoHint: "Cerco babysitter — pubblica o scegli tra i disponibili",
    color: "var(--branch-assistenza)",
    accent: "var(--branch-assistenza-accent)",
    macroBranch: "persona_assistenza",
    categories: ["babysitter"],
    categoryLabels: {
      babysitter: "Babysitter",
    },
  },
  {
    slug: "pet-sitter",
    href: "/pet-sitter",
    label: "Pet sitter",
    short: "Pet",
    description: "Dog sitter, cat sitter e pet sitting vicino a casa.",
    offroHint: "Offro pet sitting — metti in mostra la disponibilità",
    cercoHint: "Cerco pet sitter — pubblica o contatta chi è già online",
    color: "var(--branch-pet)",
    accent: "var(--branch-pet-accent)",
    macroBranch: "pet_home",
    categories: ["dogsitter", "catsitter"],
    categoryLabels: {
      dogsitter: "Dog sitter",
      catsitter: "Cat sitter",
    },
  },
  {
    slug: "professionisti",
    href: "/professionisti",
    label: "Professionista",
    short: "Pro",
    description:
      "Idraulico, elettricista, giardiniere, pulizie, stiro e piccoli interventi casa.",
    offroHint: "Sono un professionista — vetrina interventi / disponibilità",
    cercoHint: "Mi serve un professionista — pubblica o chiama chi è disponibile",
    color: "var(--branch-pet)",
    accent: "var(--branch-pet-accent)",
    macroBranch: "pet_home",
    categories: [
      "idraulico",
      "elettricista",
      "giardinaggio",
      "giardiniere",
      "pulizie",
      "stiro",
      "manutentore",
    ],
    categoryLabels: {
      idraulico: "Idraulico",
      elettricista: "Elettricista",
      giardinaggio: "Giardinaggio",
      giardiniere: "Giardiniere",
      pulizie: "Pulizie",
      stiro: "Stiro",
      manutentore: "Manutentore",
    },
  },
  {
    slug: "lavoro",
    href: "/lavoro",
    label: "Lavoro",
    short: "Lavoro",
    description:
      "Ristorazione, commerciale, tech e altre posizioni. Sempre con Offro / Cerco.",
    offroHint: "Cerco lavoro / mi candido — profilo in vetrina",
    cercoHint: "Assumo / cerco personale — pubblica l’offerta",
    color: "var(--branch-lavoro)",
    accent: "var(--branch-lavoro-accent)",
    macroBranch: "lavoro_tradizionale",
    categories: [
      "ristorazione",
      "cameriere",
      "barista",
      "commerciale",
      "ai_engineer",
      "sviluppatore",
      "manutentore",
    ],
    categoryLabels: {
      ristorazione: "Ristorazione",
      cameriere: "Cameriere",
      barista: "Barista",
      commerciale: "Commerciale",
      ai_engineer: "AI / Tech",
      sviluppatore: "Sviluppatore",
      manutentore: "Manutentore",
    },
  },
] as const;

export const VERTICAL_SLUGS = VERTICALS.map((v) => v.slug);

export function isVerticalSlug(value: string): value is VerticalSlug {
  return (VERTICAL_SLUGS as readonly string[]).includes(value);
}

export function getVertical(slug: string): VerticalMeta | null {
  return VERTICALS.find((v) => v.slug === slug) ?? null;
}

export function getVerticalByCategory(category: string): VerticalMeta | null {
  const cat = category.toLowerCase().replace(/-/g, "_");
  // Ordine: match più specifico prima (babysitter vs assistenza)
  for (const v of VERTICALS) {
    if (v.categories.includes(cat)) return v;
  }
  return null;
}

export function formatVerticalCategoryLabel(
  vertical: VerticalMeta,
  category: string,
): string {
  const cat = category.toLowerCase().replace(/-/g, "_");
  return (
    vertical.categoryLabels[cat] ??
    cat.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
  );
}

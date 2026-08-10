"use server";

import { createListing, type CreateListingInput } from "@/lib/listings";
import { WORK_TYPES, type MacroBranch, type WorkType } from "@/lib/types";
import { MACRO_BRANCHES } from "@/lib/types";

export type PublishResult = {
  slug: string | null;
  error: string | null;
};

const BRANCH_IDS = MACRO_BRANCHES.map((b) => b.id) as MacroBranch[];

function isWorkType(value: string): value is WorkType {
  return (WORK_TYPES as string[]).includes(value);
}

function isMacroBranch(value: string): value is MacroBranch {
  return BRANCH_IDS.includes(value as MacroBranch);
}

export async function publishListing(
  input: CreateListingInput,
): Promise<PublishResult> {
  if (!isMacroBranch(input.macro_branch)) {
    return { slug: null, error: "Macro-ramo non valido." };
  }
  if (!isWorkType(input.work_type)) {
    return { slug: null, error: "Tipo di contratto non valido." };
  }
  if (!input.title?.trim() || input.title.trim().length < 8) {
    return { slug: null, error: "Titolo troppo corto (min. 8 caratteri)." };
  }
  if (!input.description?.trim() || input.description.trim().length < 20) {
    return {
      slug: null,
      error: "Descrizione troppo corta (min. 20 caratteri).",
    };
  }
  if (!input.company_or_family_name?.trim()) {
    return { slug: null, error: "Inserisci il nome famiglia o azienda." };
  }
  if (!input.location_city?.trim()) {
    return { slug: null, error: "Inserisci la città." };
  }
  if (!input.contact_phone?.trim() || input.contact_phone.trim().length < 8) {
    return { slug: null, error: "Telefono non valido." };
  }
  if (!input.category?.trim()) {
    return { slug: null, error: "Seleziona una categoria." };
  }

  const { listing, error } = await createListing(input);
  if (error || !listing) {
    return { slug: null, error: error ?? "Pubblicazione non riuscita." };
  }

  return { slug: listing.slug, error: null };
}

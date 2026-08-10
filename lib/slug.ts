/** Genera uno slug SEO-safe: solo a-z, 0-9 e trattini. */
export function slugify(input: string): string {
  return input
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-")
    .slice(0, 72);
}

/** Slug univoco a partire da titolo + città (+ suffisso numerico). */
export function buildListingSlug(
  title: string,
  city: string,
  suffix?: string | number,
): string {
  const base = slugify(`${title}-${city}`) || "annuncio";
  if (suffix === undefined || suffix === "") return base;
  const tail = String(suffix).replace(/[^a-z0-9]/gi, "").toLowerCase();
  return tail ? `${base}-${tail}` : base;
}

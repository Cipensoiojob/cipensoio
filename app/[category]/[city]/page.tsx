import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ListingResults } from "@/components/ListingResults";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { getCategoryCityPairs, getListings } from "@/lib/listings";
import {
  PRIORITY_SEO_HUBS,
  buildLocalSeoDescription,
  buildLocalSeoTitle,
  categoryFromSlug,
  categoryToSlug,
  cityQueryFromSlug,
  cityToSlug,
  formatCategoryLabel,
  formatCityLabel,
  isReservedCategorySegment,
  mergeSeoHubs,
  seoHubHref,
} from "@/lib/seo";
import { SITE_URL } from "@/lib/types";

type Props = {
  params: Promise<{ category: string; city: string }>;
};

export async function generateStaticParams() {
  const pairs = await getCategoryCityPairs();
  const hubs = mergeSeoHubs(pairs);
  return hubs.map((h) => ({
    category: h.categorySlug,
    city: h.citySlug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category: categorySlug, city: citySlug } = await params;
  if (isReservedCategorySegment(categorySlug)) {
    return { title: "Pagina non trovata" };
  }

  const category = categoryFromSlug(categorySlug);
  const city = formatCityLabel(cityQueryFromSlug(citySlug));
  const title = buildLocalSeoTitle(category, city);

  const { listings } = await getListings({
    category,
    city: cityQueryFromSlug(citySlug),
    limit: 40,
  });

  return {
    title,
    description: buildLocalSeoDescription(category, city, listings.length),
    alternates: { canonical: `/${categorySlug}/${citySlug}` },
    openGraph: {
      title,
      description: buildLocalSeoDescription(category, city, listings.length),
      url: `/${categorySlug}/${citySlug}`,
    },
  };
}

export default async function CategoryCityPage({ params }: Props) {
  const { category: categorySlug, city: citySlug } = await params;

  if (
    isReservedCategorySegment(categorySlug) ||
    !categorySlug ||
    !citySlug ||
    categorySlug.includes(".") ||
    citySlug.includes(".")
  ) {
    notFound();
  }

  const category = categoryFromSlug(categorySlug);
  const cityQuery = cityQueryFromSlug(citySlug);
  const cityLabel = formatCityLabel(cityQuery);
  const categoryLabel = formatCategoryLabel(category);

  const { listings, fromFallback } = await getListings({
    category,
    city: cityQuery,
    limit: 40,
  });

  const related = mergeSeoHubs(await getCategoryCityPairs())
    .filter(
      (h) =>
        h.categorySlug === categoryToSlug(category) ||
        h.citySlug === cityToSlug(cityLabel),
    )
    .filter(
      (h) =>
        !(h.categorySlug === categorySlug && h.citySlug === citySlug),
    )
    .slice(0, 8);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: buildLocalSeoTitle(category, cityLabel),
    url: `${SITE_URL}/${categorySlug}/${citySlug}`,
    numberOfItems: listings.length,
    itemListElement: listings.slice(0, 20).map((listing, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: `${SITE_URL}/annunci/${listing.slug}`,
      name: listing.title,
    })),
  };

  const publishHref = `/pubblica?categoria=${encodeURIComponent(category)}&citta=${encodeURIComponent(cityLabel)}`;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <SiteHeader />
      <main className="flex-1">
        <section className="border-b border-[var(--line)] bg-[radial-gradient(90%_70%_at_15%_0%,#c8ebe2_0%,transparent_50%),linear-gradient(180deg,#eaf6f1_0%,var(--background)_85%)]">
          <div className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
            <nav className="text-sm text-[var(--muted)]" aria-label="Breadcrumb">
              <Link href="/" className="hover:text-[var(--brand)]">
                Home
              </Link>
              <span className="mx-2">/</span>
              <Link href="/cerca" className="hover:text-[var(--brand)]">
                Cerca
              </Link>
              <span className="mx-2">/</span>
              <span className="text-[var(--foreground)]">
                {categoryLabel} · {cityLabel}
              </span>
            </nav>
            <h1 className="mt-4 font-[family-name:var(--font-syne)] text-3xl font-semibold tracking-tight sm:text-4xl">
              {categoryLabel} a {cityLabel}
            </h1>
            <p className="mt-3 max-w-2xl text-[var(--muted)]">
              {listings.length > 0
                ? `${listings.length} annunci di ${categoryLabel.toLowerCase()} a ${cityLabel}. Contatti protetti fino al click.`
                : `Nessun annuncio ancora per ${categoryLabel.toLowerCase()} a ${cityLabel}. Sii il primo: pubblicazione gratis e moderata.`}
            </p>
            <Link
              href={publishHref}
              className="mt-6 inline-flex rounded-xl bg-[var(--brand)] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[var(--brand-deep)]"
            >
              Pubblica {categoryLabel.toLowerCase()} a {cityLabel}
            </Link>
          </div>
        </section>

        <section className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
          <ListingResults
            listings={listings}
            emptyMessage={`Nessun annuncio qui per ora. Pubblica il primo di ${categoryLabel.toLowerCase()} a ${cityLabel}.`}
          />
          {fromFallback && listings.length > 0 && (
            <p className="mt-3 text-xs text-[var(--muted)]">Anteprima demo</p>
          )}

          {related.length > 0 && (
            <div className="mt-12">
              <h2 className="font-[family-name:var(--font-syne)] text-xl font-semibold">
                Vicino a questa ricerca
              </h2>
              <ul className="mt-4 flex flex-wrap gap-2">
                {related.map((hub) => (
                  <li key={seoHubHref(hub)}>
                    <Link
                      href={seoHubHref(hub)}
                      className="inline-flex rounded-xl border border-[var(--line)] bg-white px-3 py-1.5 text-sm hover:border-[var(--brand)] hover:text-[var(--brand)]"
                    >
                      {formatCategoryLabel(hub.category)} ·{" "}
                      {formatCityLabel(hub.city)}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <p className="mt-10 text-sm text-[var(--muted)]">
            Altre città tipiche:{" "}
            {PRIORITY_SEO_HUBS.filter((h) => h.category === category)
              .slice(0, 5)
              .map((h, i) => (
                <span key={seoHubHref(h)}>
                  {i > 0 ? ", " : ""}
                  <Link
                    href={seoHubHref(h)}
                    className="text-[var(--brand)] hover:underline"
                  >
                    {formatCityLabel(h.city)}
                  </Link>
                </span>
              ))}
          </p>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}

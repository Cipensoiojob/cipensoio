import { HeroSearch } from "@/components/HeroSearch";
import { ListingSections } from "@/components/ListingSections";
import { MacroBranches } from "@/components/MacroBranches";
import { PublishCta } from "@/components/PublishCta";
import { SeoHubLinks } from "@/components/SeoHubLinks";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import {
  getCategoryCityPairs,
  getListings,
  getPublishedCount,
} from "@/lib/listings";
import { mergeSeoHubs } from "@/lib/seo";
import { SITE_URL } from "@/lib/types";

export default async function Home() {
  const [count, pairs, { listings: offro }, { listings: cerco }] =
    await Promise.all([
      getPublishedCount(),
      getCategoryCityPairs(),
      getListings({ intent: "offro", limit: 24 }),
      getListings({ intent: "cerco", limit: 24 }),
    ]);

  const hubs = mergeSeoHubs(pairs);
  const mixed = [...offro, ...cerco];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "CiPensoIo",
    url: SITE_URL,
    description:
      "Trova il lavoro o la persona giusta per te, vicino a casa tua.",
    potentialAction: {
      "@type": "SearchAction",
      target: `${SITE_URL}/cerca?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <SiteHeader />
      <main className="flex-1">
        <HeroSearch />
        <MacroBranches />

        <section className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
          <ListingSections
            listings={mixed}
            splitCareCategories
            perSectionLimit={8}
            emptyMessage="Ancora pochi annunci. Pubblica tu il primo — gratis."
          />
        </section>

        <section className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6">
          <SeoHubLinks
            title="Esplora per città e categoria"
            hubs={hubs}
            limit={18}
          />
        </section>
        <PublishCta listingCount={count} />
      </main>
      <SiteFooter />
    </>
  );
}

import { HeroSearch } from "@/components/HeroSearch";
import { LatestListings } from "@/components/LatestListings";
import { MacroBranches } from "@/components/MacroBranches";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { getLatestListings } from "@/lib/listings";

export default async function Home() {
  const { listings, fromFallback } = await getLatestListings(6);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "CiPensoIo",
    url: "https://cipensoio.it",
    description:
      "Trova il lavoro o la persona giusta per te, vicino a casa tua.",
    potentialAction: {
      "@type": "SearchAction",
      target: "https://cipensoio.it/cerca?q={search_term_string}",
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
        <LatestListings listings={listings} fromFallback={fromFallback} />
      </main>
      <SiteFooter />
    </>
  );
}

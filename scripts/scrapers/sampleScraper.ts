/**
 * Scraper / template di estrazione (Cheerio + Fetch + EURES).
 *
 * Default: annunci reali da EURES Italia (`--source=eures`).
 *
 * Opzioni:
 *   source: "eures" | "catalog" | "html" | "url"
 */
import * as cheerio from "cheerio";
import type { AnyNode } from "domhandler";
import { scrapeEuresItaly } from "./euresScraper";
import { getItalianCatalogRaw } from "./italianCatalog";
import {
  mapSourceCategoryToBranch,
  sanitizeText,
  transformRawToScrapedListing,
  type ScrapedListing,
  type ScrapedRawItem,
} from "./utils";

export type { ScrapedListing, ScrapedRawItem };

/** HTML minimo di prova se chiedi esplicitamente --source=html */
export const SAMPLE_HTML = `
<section class="listings">
  <article class="listing" data-category="badante">
    <h2 class="title">Badante di prova HTML parser</h2>
    <p class="company">Famiglia Demo</p>
    <p class="city">Milano</p>
    <p class="zone">Centro</p>
    <p class="contract">Ad ore</p>
    <p class="salary">CCNL</p>
    <div class="body">
      Test parser Cheerio. Contatto: 02 1112223 WhatsApp 340 9998887
    </div>
    <a class="detail" href="https://example.com/test">Dettagli</a>
  </article>
</section>
`;

function parseListingCard(
  $: cheerio.CheerioAPI,
  el: AnyNode,
): ScrapedRawItem {
  const root = $(el);
  const sourceCategory =
    root.attr("data-category") ||
    root.find(".category").first().text() ||
    root.find("[data-cat]").attr("data-cat") ||
    "";
  const body =
    root.find(".body").text() ||
    root.find(".description").text() ||
    root.find("p").last().text();
  const title =
    root.find(".title").first().text() ||
    root.find("h2, h3").first().text();

  return {
    title,
    description: body,
    company:
      root.find(".company").first().text() ||
      root.find(".author, .name").first().text(),
    city: root.find(".city").first().text() || "Italia",
    zone: root.find(".zone").first().text(),
    sourceCategory: sanitizeText(sourceCategory),
    category: sanitizeText(sourceCategory),
    workType: root.find(".contract, .work-type").first().text(),
    salary: root.find(".salary").first().text(),
    phone: body,
    whatsapp: body,
    isRemote: /remote|remoto/i.test(`${title} ${body} ${sourceCategory}`),
    url:
      root.find("a.detail, a[href*='annunci'], a[href*='job']").attr("href") ??
      undefined,
  };
}

export function parseListingsHtml(html: string): ScrapedRawItem[] {
  const $ = cheerio.load(html);
  const items: ScrapedRawItem[] = [];

  const selectors = [
    ".listing",
    "article.job",
    ".annuncio",
    "[data-listing]",
    ".job-card",
    ".offer-card",
  ].join(", ");

  $(selectors).each((_, el) => {
    items.push(parseListingCard($, el));
  });

  if (!items.length) {
    $("article").each((_, el) => {
      items.push(parseListingCard($, el));
    });
  }

  return items;
}

function mapRawList(rawItems: ScrapedRawItem[]): ScrapedListing[] {
  const listings: ScrapedListing[] = [];

  for (const raw of rawItems) {
    const mapped = transformRawToScrapedListing(raw);
    if (!mapped) {
      console.warn(
        `[scraper] skip: "${sanitizeText(raw.title)}" (campi mancanti)`,
      );
      continue;
    }

    mapped.macro_branch = mapSourceCategoryToBranch(
      raw.sourceCategory ?? raw.category,
      mapped.title,
      mapped.description,
    );
    listings.push(mapped);
  }

  return listings;
}

export type ScrapeSource = "eures" | "catalog" | "html" | "url";

/**
 * Estrae e trasforma in `ScrapedListing[]`.
 * Default = EURES Italia (annunci reali).
 */
export async function scrapeSampleSource(options?: {
  url?: string;
  html?: string;
  source?: ScrapeSource;
  maxListings?: number;
}): Promise<ScrapedListing[]> {
  const source: ScrapeSource =
    options?.source ??
    (options?.url ? "url" : options?.html ? "html" : "eures");

  if (source === "eures") {
    console.log("  fonte: EURES Italia (annunci reali)");
    return scrapeEuresItaly({ maxListings: options?.maxListings ?? 48 });
  }

  if (source === "catalog") {
    console.log("  fonte: catalogo italiano (fixture di test)");
    return mapRawList(getItalianCatalogRaw());
  }

  let html = options?.html;

  if (source === "url") {
    if (!options?.url) {
      throw new Error("source=url richiede --url");
    }
    console.log(`  fonte: URL ${options.url}`);
    const res = await fetch(options.url, {
      headers: {
        "User-Agent":
          "CiPensoIoBot/0.1 (+https://cipensoio.it; scrape-import)",
        Accept: "text/html,application/xhtml+xml",
      },
    });
    if (!res.ok) {
      throw new Error(`Fetch fallito ${res.status} su ${options.url}`);
    }
    html = await res.text();
  } else {
    console.log("  fonte: SAMPLE_HTML (parser test)");
    html = html ?? SAMPLE_HTML;
  }

  return mapRawList(parseListingsHtml(html));
}

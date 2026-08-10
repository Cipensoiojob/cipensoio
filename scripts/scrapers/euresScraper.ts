/**
 * Scraper annunci reali da EURES (portale UE / centri per l’impiego).
 * API pubblica: POST /jv-searchengine/public/jv-search/search
 *
 * Non scrapa marketplace privati (Subito, Bakeca, …): ToS e copyright.
 */
import {
  mapSourceCategoryToBranch,
  sanitizeText,
  transformRawToScrapedListing,
  type ScrapedListing,
  type ScrapedRawItem,
} from "./utils";

const EURES_SEARCH =
  "https://europa.eu/eures/api/jv-searchengine/public/jv-search/search";
const EURES_DETAIL =
  "https://europa.eu/eures/api/jv-searchengine/public/jv/id";
const EURES_PUBLIC =
  "https://europa.eu/eures/portal/jv-se/jv_details_show";

const USER_AGENT = "CiPensoIoBot/0.1 (+https://cipensoio.it; eures-import)";

/** Query mirate ai 3 macro-rami (IT). */
export const EURES_QUERIES = [
  { keyword: "cameriere", category: "cameriere" },
  { keyword: "barista", category: "barista" },
  { keyword: "elettricista civile", category: "elettricista" },
  { keyword: "giardiniere", category: "giardiniere" },
  { keyword: "operatore socio-sanitario", category: "oss" },
  { keyword: "assistente infermiere", category: "oss" },
  { keyword: "addetto alle pulizie", category: "pulizie" },
  { keyword: "lavoro domestico", category: "colf" },
  { keyword: "assistenza anziani", category: "badante" },
  { keyword: "badante", category: "badante" },
  { keyword: "colf", category: "colf" },
  { keyword: "babysitter", category: "babysitter" },
  { keyword: "idraulico", category: "idraulico" },
  { keyword: "lavapiatti", category: "cameriere" },
] as const;

const RELEVANT =
  /(?:^|[^a-z])(?:badante|colf|babysitter|baby\s*sitter|oss|socio[-\s]?sanitar|assistente\s+infermier|assistenza\s+anzian|caregiver|dog\s*sitter|pet\s*sitter|idraulic|elettricista|giardinier|camerier|barist|addetto(?:\s+\w+){0,3}\s+puliz|pulizie|domestico|domestica|stiro|lavapiatti)(?:[^a-z]|$)/i;

const IRRELEVANT =
  /chimico|circuiti\s+stampati|disinfestant|macellator|miniera|trafila|statistica|database|network|account\s+executive|sales|marketing/i;

/** NUTS IT → città/area di fallback se il dettaglio non ha cityName. */
const NUTS_CITY: Record<string, string> = {
  ITC11: "Torino",
  ITC12: "Vercelli",
  ITC13: "Biella",
  ITC14: "Verbania",
  ITC15: "Cuneo",
  ITC16: "Asti",
  ITC17: "Alessandria",
  ITC18: "Aosta",
  ITC20: "Milano",
  ITC33: "Como",
  ITC34: "Lecco",
  ITC41: "Varese",
  ITC42: "Como",
  ITC43: "Lecco",
  ITC44: "Sondrio",
  ITC46: "Bergamo",
  ITC47: "Brescia",
  ITC48: "Pavia",
  ITC49: "Lodi",
  ITC4A: "Cremona",
  ITC4B: "Mantova",
  ITC4C: "Milano",
  ITC4D: "Monza",
  ITH10: "Bolzano",
  ITH20: "Trento",
  ITH31: "Verona",
  ITH32: "Vicenza",
  ITH33: "Belluno",
  ITH34: "Treviso",
  ITH35: "Venezia",
  ITH36: "Padova",
  ITH37: "Rovigo",
  ITH41: "Pordenone",
  ITH42: "Udine",
  ITH43: "Gorizia",
  ITH44: "Trieste",
  ITH51: "Piacenza",
  ITH52: "Parma",
  ITH53: "Reggio Emilia",
  ITH54: "Modena",
  ITH55: "Bologna",
  ITH56: "Ferrara",
  ITH57: "Ravenna",
  ITH58: "Forlì",
  ITH59: "Rimini",
  ITI11: "Massa",
  ITI12: "Lucca",
  ITI13: "Pistoia",
  ITI14: "Firenze",
  ITI15: "Prato",
  ITI16: "Livorno",
  ITI17: "Pisa",
  ITI18: "Arezzo",
  ITI19: "Siena",
  ITI1A: "Grosseto",
  ITI21: "Perugia",
  ITI22: "Terni",
  ITI31: "Pesaro",
  ITI32: "Ancona",
  ITI33: "Macerata",
  ITI34: "Ascoli Piceno",
  ITI35: "Fermo",
  ITI41: "Viterbo",
  ITI42: "Rieti",
  ITI43: "Roma",
  ITI44: "Latina",
  ITI45: "Frosinone",
  ITF11: "L'Aquila",
  ITF12: "Teramo",
  ITF13: "Pescara",
  ITF14: "Chieti",
  ITF21: "Isernia",
  ITF22: "Campobasso",
  ITF31: "Caserta",
  ITF32: "Benevento",
  ITF33: "Napoli",
  ITF34: "Avellino",
  ITF35: "Salerno",
  ITF41: "Foggia",
  ITF42: "Bari",
  ITF43: "Taranto",
  ITF44: "Brindisi",
  ITF45: "Lecce",
  ITF46: "Barletta",
  ITF51: "Potenza",
  ITF52: "Matera",
  ITF61: "Cosenza",
  ITF62: "Catanzaro",
  ITF63: "Crotone",
  ITF64: "Vibo Valentia",
  ITF65: "Reggio Calabria",
  ITG11: "Trapani",
  ITG12: "Palermo",
  ITG13: "Messina",
  ITG14: "Agrigento",
  ITG15: "Caltanissetta",
  ITG16: "Enna",
  ITG17: "Catania",
  ITG18: "Ragusa",
  ITG19: "Siracusa",
  ITG2A: "Sassari",
  ITG2B: "Nuoro",
  ITG2C: "Cagliari",
  ITG2D: "Oristano",
  ITG2E: "Olbia",
  ITG2F: "Sud Sardegna",
  ITG2G: "Medio Campidano",
  ITG2H: "Carbonia",
};

type EuresSearchHit = {
  id: string;
  title?: string;
  description?: string;
  locationMap?: Record<string, string[]>;
  positionScheduleCodes?: string[];
  employer?: { name?: string };
};

type EuresDetail = {
  id: string;
  jvProfiles?: Record<
    string,
    {
      title?: string;
      description?: string;
      positionScheduleCodes?: string[];
      positionOfferingCode?: string;
      applicationInstructions?: string[];
      remoteWorkAllowed?: boolean;
      employer?: { name?: string; website?: string | null };
      locations?: Array<{
        cityName?: string | null;
        region?: string | null;
        addressLines?: string[] | null;
      }>;
      personContacts?: Array<{
        givenName?: string;
        familyName?: string;
        communications?: {
          telephoneNumbers?: Array<{
            countryDialing?: string | null;
            dialNumber?: string | null;
          }>;
          mobileTelephoneNumbers?: Array<{
            countryDialing?: string | null;
            dialNumber?: string | null;
          }>;
        };
      }>;
    }
  >;
};

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

async function euresFetch(url: string, init?: RequestInit): Promise<Response> {
  const res = await fetch(url, {
    ...init,
    headers: {
      Accept: "application/json",
      "User-Agent": USER_AGENT,
      ...(init?.headers ?? {}),
    },
  });
  if (!res.ok) {
    throw new Error(`EURES ${res.status} su ${url}`);
  }
  return res;
}

function searchBody(keyword: string, page: number, resultsPerPage: number) {
  return {
    resultsPerPage,
    page,
    sortSearch: "MOST_RECENT",
    keywords: [{ keyword, specificSearchCode: "EVERYWHERE" }],
    publicationPeriod: null,
    occupationUris: [],
    skillUris: [],
    requiredExperienceCodes: [],
    positionScheduleCodes: [],
    sectorCodes: [],
    educationAndQualificationLevelCodes: [],
    positionOfferingCodes: [],
    locationCodes: ["it"],
    euresFlagCodes: [],
    otherBenefitsCodes: [],
    requiredLanguages: [],
    minNumberPost: null,
    sessionId: `cipensoio-${Date.now()}`,
    requestLanguage: "it",
  };
}

function cityFromNuts(locationMap?: Record<string, string[]>): string | null {
  if (!locationMap) return null;
  for (const codes of Object.values(locationMap)) {
    for (const code of codes ?? []) {
      const city = NUTS_CITY[code.toUpperCase()];
      if (city) return city;
    }
  }
  return null;
}

function extractHref(htmlish: string): string | null {
  const m = htmlish.match(/href=["']([^"']+)["']/i);
  return m?.[1]?.trim() || null;
}

function pickPhone(
  contacts: NonNullable<
    NonNullable<EuresDetail["jvProfiles"]>[string]["personContacts"]
  >,
): string | null {
  for (const c of contacts) {
    const bags = [
      ...(c.communications?.mobileTelephoneNumbers ?? []),
      ...(c.communications?.telephoneNumbers ?? []),
    ];
    for (const t of bags) {
      const dial = sanitizeText(t.dialNumber);
      if (!dial) continue;
      if (dial.startsWith("+")) return dial.replace(/\s+/g, "");
      const cc = sanitizeText(t.countryDialing) || "+39";
      const national = dial.replace(/^\+?39/, "").replace(/\D/g, "");
      if (national.length >= 8) return `${cc}${national}`.replace(/\s+/g, "");
    }
  }
  return null;
}

function mapSchedule(codes?: string[]): string {
  const joined = (codes ?? []).join(" ").toLowerCase();
  if (/part/.test(joined)) return "part_time";
  if (/full|tempo\s*pieno/.test(joined)) return "full_time";
  if (/shift|turn/.test(joined)) return "turni";
  return "ad_ore";
}

function isRelevant(title: string, description: string): boolean {
  const blob = `${title} ${description}`;
  if (IRRELEVANT.test(title)) return false;
  return RELEVANT.test(blob);
}

function publicVacancyUrl(id: string): string {
  return `${EURES_PUBLIC}?id=${encodeURIComponent(id)}&lang=it`;
}

async function searchKeyword(
  keyword: string,
  resultsPerPage: number,
): Promise<EuresSearchHit[]> {
  const res = await euresFetch(EURES_SEARCH, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(searchBody(keyword, 1, resultsPerPage)),
  });
  const data = (await res.json()) as { jvs?: EuresSearchHit[] };
  return data.jvs ?? [];
}

async function fetchDetail(id: string): Promise<EuresDetail | null> {
  const url = `${EURES_DETAIL}/${encodeURIComponent(id)}`;
  try {
    const res = await euresFetch(url);
    return (await res.json()) as EuresDetail;
  } catch (err) {
    console.warn(
      `[eures] dettaglio skip ${id}:`,
      err instanceof Error ? err.message : err,
    );
    return null;
  }
}

function profileOf(detail: EuresDetail) {
  const profiles = detail.jvProfiles ?? {};
  return profiles.it ?? profiles.en ?? Object.values(profiles)[0] ?? null;
}

function detailToRaw(
  hit: EuresSearchHit,
  categoryHint: string,
  detail: EuresDetail | null,
): ScrapedRawItem {
  const profile = detail ? profileOf(detail) : null;
  const loc = profile?.locations?.[0];
  const city =
    sanitizeText(loc?.cityName) ||
    cityFromNuts(hit.locationMap) ||
    "Italia";
  const titleBase = sanitizeText(profile?.title ?? hit.title);
  const title = uniqueTitle(titleBase, city, hit.id);
  const description = sanitizeText(
    profile?.description ?? hit.description ?? "",
  );
  const zone = sanitizeText(loc?.addressLines?.[0] ?? "") || null;
  const company =
    sanitizeText(profile?.employer?.name ?? hit.employer?.name) ||
    "Agenzia / datore (EURES)";
  const phone = profile?.personContacts
    ? pickPhone(profile.personContacts)
    : null;

  let applyUrl: string | null = null;
  for (const instr of profile?.applicationInstructions ?? []) {
    const href = extractHref(instr);
    const plain = sanitizeText(instr);
    const candidate = href || (plain.startsWith("http") ? plain : "");
    if (candidate.startsWith("http")) {
      applyUrl = candidate;
      break;
    }
  }
  if (!applyUrl) applyUrl = publicVacancyUrl(hit.id);

  return {
    title,
    description:
      description.length >= 20
        ? `${description}\n\nFonte: EURES (UE). Verifica sempre l’offerta sul link ufficiale.`
        : `Offerta pubblicata su EURES. Dettagli e candidatura sul link ufficiale.`,
    company,
    city,
    zone: zone || undefined,
    category: categoryHint,
    sourceCategory: categoryHint,
    workType: mapSchedule(
      profile?.positionScheduleCodes ?? hit.positionScheduleCodes,
    ),
    phone: phone ?? undefined,
    whatsapp: phone ?? undefined,
    isRemote: Boolean(profile?.remoteWorkAllowed),
    url: applyUrl,
    intent: "cerco",
  };
}

/** Rende titoli ESCO generici univoci (città + ref). */
function uniqueTitle(title: string, city: string, id: string): string {
  const ref = id.replace(/\s+/g, "").slice(0, 10);
  const base = sanitizeText(title) || "Offerta EURES";
  return `${base} — ${city} · ${ref}`;
}

export type EuresScrapeOptions = {
  /** Max annunci dopo filtro + dettaglio (default 48). */
  maxListings?: number;
  /** Risultati per query EURES (default 25). */
  perQuery?: number;
  /** Pausa tra dettagli (ms). */
  detailDelayMs?: number;
};

/**
 * Scarica annunci reali IT da EURES, filtrati sulle nicchie CiPensoIo.
 */
export async function scrapeEuresItaly(
  options?: EuresScrapeOptions,
): Promise<ScrapedListing[]> {
  const maxListings = options?.maxListings ?? 48;
  const perQuery = options?.perQuery ?? 25;
  const detailDelayMs = options?.detailDelayMs ?? 120;

  const byId = new Map<
    string,
    { hit: EuresSearchHit; category: string }
  >();

  for (const q of EURES_QUERIES) {
    console.log(`  eures query: "${q.keyword}"…`);
    let hits: EuresSearchHit[] = [];
    try {
      hits = await searchKeyword(q.keyword, perQuery);
    } catch (err) {
      console.warn(
        `  eures query fallita (${q.keyword}):`,
        err instanceof Error ? err.message : err,
      );
      continue;
    }

    for (const hit of hits) {
      const title = hit.title ?? "";
      const description = hit.description ?? "";
      if (!isRelevant(title, description)) continue;
      if (byId.has(hit.id)) continue;
      byId.set(hit.id, { hit, category: q.category });
    }
    await sleep(80);
  }

  console.log(`  candidati rilevanti: ${byId.size}`);

  const selected = [...byId.values()].slice(0, maxListings);
  const listings: ScrapedListing[] = [];

  for (let i = 0; i < selected.length; i++) {
    const { hit, category } = selected[i];
    const detail = await fetchDetail(hit.id);
    if (i < selected.length - 1) await sleep(detailDelayMs);

    const raw = detailToRaw(hit, category, detail);
    const mapped = transformRawToScrapedListing(raw);
    if (!mapped) {
      console.warn(`[eures] skip transform: "${raw.title}"`);
      continue;
    }
    mapped.macro_branch = mapSourceCategoryToBranch(
      raw.sourceCategory,
      mapped.title,
      mapped.description,
    );
    listings.push(mapped);
  }

  return listings;
}

/**
 * Catalogo italiano ricco per seed/import (non HTML demo da 3 card).
 * Dati sintetici realistici — da sostituire con scrape reale quando hai
 * una fonte autorizzata.
 */
import type { ScrapedRawItem } from "./utils";

type Seed = ScrapedRawItem & { intentHint?: "cerco" | "offro" };

const SEEDS: Seed[] = [
  // —— OFFRO: operatori in vetrina ——
  {
    title: "Badante convivente disponibile a Torino",
    description:
      "Esperienza con anziani e mobilità ridotta. Preferisco WhatsApp. Referenze disponibili. Disponibile da subito.",
    company: "Elena Greco",
    city: "Torino",
    zone: "San Salvario",
    category: "badante",
    sourceCategory: "badante",
    workType: "Convivenza",
    salary: "CCNL",
    phone: "011 3344556 WhatsApp 347 2200111",
    intentHint: "offro",
  },
  {
    title: "Colf part-time disponibile a Firenze",
    description:
      "Pulizie e stiratura 3 mattine a settimana. Puntuale e affidabile. Contatto preferito WhatsApp.",
    company: "Ana Popescu",
    city: "Firenze",
    zone: "Campo di Marte",
    category: "colf",
    sourceCategory: "colf",
    workType: "Part time",
    salary: "11€/ora",
    phone: "055 778899 WhatsApp 348 5511223",
    intentHint: "offro",
  },
  {
    title: "Babysitter pomeridiana a Verona",
    description:
      "Mi occupo di bambini in età scolare: compiti e giochi. Disponibile lun-ven 15-19. Parlo italiano e spagnolo.",
    company: "Sofia Conti",
    city: "Verona",
    zone: "Borgo Trento",
    category: "babysitter",
    sourceCategory: "babysitter",
    workType: "Ad ore",
    salary: "13€/ora",
    phone: "045 990011 WhatsApp 349 6677889",
    intentHint: "offro",
  },
  {
    title: "OSS disponibile turni a Napoli",
    description:
      "Qualifica OSS, esperienza ospedale e domicilio. Disponibile turni diurni e notturni. Preferisco contatto telefonico.",
    company: "Carmela Esposito",
    city: "Napoli",
    zone: "Vomero",
    category: "oss",
    sourceCategory: "oss",
    workType: "Turni",
    salary: "Da concordare",
    phone: "081 2233445 WhatsApp 320 1122334",
    intentHint: "offro",
  },
  {
    title: "Dog sitter e pet sitting a Padova",
    description:
      "Passeggiate, custodia diurna e visite a domicilio. Cani e gatti. Zona centro e Arcella.",
    company: "Marco Bellini",
    city: "Padova",
    zone: "Arcella",
    category: "dogsitter",
    sourceCategory: "dogsitter",
    workType: "Ad ore",
    salary: "10€/ora",
    phone: "049 556677 WhatsApp 333 4455667",
    intentHint: "offro",
  },
  {
    title: "Cat sitter disponibile a Genova",
    description:
      "Cura gatti in casa: cibo, lettiera e compagnia. Ideale per vacanze. Messaggio WhatsApp.",
    company: "Chiara Riva",
    city: "Genova",
    zone: "Albaro",
    category: "catsitter",
    sourceCategory: "catsitter",
    workType: "Ad ore",
    salary: "15€/visita",
    phone: "010 887766 WhatsApp 328 9988776",
    intentHint: "offro",
  },
  {
    title: "Idraulico interventi rapidi a Brescia",
    description:
      "Perdite, scarichi ostruiti, sostituzione rubinetti. Preventivo chiaro prima di iniziare. Disponibile anche weekend.",
    company: "Paolo Ferrari",
    city: "Brescia",
    zone: "Centro",
    category: "idraulico",
    sourceCategory: "idraulico",
    workType: "Ad ore",
    salary: "Preventivo",
    phone: "030 112233 WhatsApp 335 7788990",
    intentHint: "offro",
  },
  {
    title: "Elettricista impianti civili a Bergamo",
    description:
      "Quadri, prese, illuminazione LED, piccole riparazioni. Intervento in giornata se urgente.",
    company: "Impresa Luce di Stefano Villa",
    city: "Bergamo",
    zone: "Città Alta",
    category: "elettricista",
    sourceCategory: "elettricista",
    workType: "Ad ore",
    salary: "Preventivo",
    phone: "035 445566 WhatsApp 339 0011223",
    intentHint: "offro",
  },
  {
    title: "Giardiniere manutenzione giardini a Monza",
    description:
      "Taglio erba, siepi, potature leggere. Clienti privati e condomini. Contatto WhatsApp.",
    company: "Garden Green — Luca Moretti",
    city: "Monza",
    zone: "San Fruttuoso",
    category: "giardinaggio",
    sourceCategory: "giardinaggio",
    workType: "Ad ore",
    salary: "25€/ora",
    phone: "039 667788 WhatsApp 340 5544332",
    intentHint: "offro",
  },
  {
    title: "Stiro a domicilio a Segrate",
    description:
      "Ritiro e consegna biancheria stirata. Ideale famiglie e professionisti. Disponibile martedì e giovedì.",
    company: "Laura Fontana",
    city: "Segrate",
    zone: "Redecesio",
    category: "stiro",
    sourceCategory: "stiro",
    workType: "Ad ore",
    salary: "12€/ora",
    phone: "02 9988776 WhatsApp 347 8899001",
    intentHint: "offro",
  },
  {
    title: "Cameriere/ssa disponibile serate Milano",
    description:
      "Esperienza ristoranti e eventi. Disponibile sera e weekend. Curriculum su richiesta.",
    company: "Davide Serra",
    city: "Milano",
    zone: "Isola",
    category: "ristorazione",
    sourceCategory: "ristorazione",
    workType: "Part time",
    salary: "Da concordare",
    phone: "02 3344556 WhatsApp 331 2233445",
    intentHint: "offro",
  },
  {
    title: "Commerciale junior disponibile Lombardia",
    description:
      "Vendita B2B, CRM e trattative. Auto e patente B. Preferisco ruolo partita IVA o indeterminato.",
    company: "Francesca De Luca",
    city: "Milano",
    zone: undefined,
    category: "commerciale",
    sourceCategory: "commerciale",
    workType: "Full time",
    salary: "RAL da concordare + provvigioni",
    phone: "02 5566778 WhatsApp 338 6677889",
    isRemote: false,
    intentHint: "offro",
  },

  // —— CERCO: famiglie / aziende ——
  {
    title: "Famiglia cerca badante diurna a Roma",
    description:
      "Assistenza anziana 8-18, no convivenza. Preferenza esperienza e referenze. Contatto famiglia: WhatsApp.",
    company: "Famiglia Mancini",
    city: "Roma",
    zone: "Monteverde",
    category: "badante",
    sourceCategory: "badante",
    workType: "Ad ore",
    salary: "CCNL",
    phone: "06 7788990 WhatsApp 339 1122334",
    intentHint: "cerco",
  },
  {
    title: "Cercasi colf 2 mattine a Napoli",
    description:
      "Pulizie appartamento 80mq, martedì e venerdì mattina. Zona Vomero. Retribuzione regolare.",
    company: "Famiglia Russo",
    city: "Napoli",
    zone: "Vomero",
    category: "colf",
    sourceCategory: "colf",
    workType: "Part time",
    salary: "10€/ora",
    phone: "081 5566778",
    intentHint: "cerco",
  },
  {
    title: "Babysitter per due bambini a Torino",
    description:
      "Bambini 4 e 7 anni, pomeriggi dopo scuola. Preferenza patente e referenze recenti.",
    company: "Famiglia Gallo",
    city: "Torino",
    zone: "Crocetta",
    category: "babysitter",
    sourceCategory: "babysitter",
    workType: "Ad ore",
    salary: "12€/ora",
    phone: "011 9988776 WhatsApp 340 9988776",
    intentHint: "cerco",
  },
  {
    title: "Cercasi dog sitter zona Navigli Milano",
    description:
      "Due passeggiate al giorno per beagle. Chiavi e istruzioni fornite. Preferenza zona sud.",
    company: "Famiglia Costa",
    city: "Milano",
    zone: "Navigli",
    category: "dogsitter",
    sourceCategory: "dogsitter",
    workType: "Ad ore",
    salary: "12€/ora",
    phone: "02 4455667 WhatsApp 333 2211009",
    intentHint: "cerco",
  },
  {
    title: "Serve idraulico per bagno a Bologna",
    description:
      "Sostituzione box doccia e riparazione scarico. Preventivo scritto richiesto. Zona Savena.",
    company: "Condominio Via Emilia",
    city: "Bologna",
    zone: "Savena",
    category: "idraulico",
    sourceCategory: "idraulico",
    workType: "Ad ore",
    salary: "Preventivo",
    phone: "051 3344556",
    intentHint: "cerco",
  },
  {
    title: "Azienda cerca elettricista manutentore a Firenze",
    description:
      "Manutenzione negozi retail, contratti partita IVA. Interventi programmati e urgenze.",
    company: "Retail Light Srl",
    city: "Firenze",
    zone: "Osmannoro",
    category: "elettricista",
    sourceCategory: "elettricista",
    workType: "Full time",
    salary: "Compenso a intervento",
    phone: "055 1122334 WhatsApp 334 5566778",
    intentHint: "cerco",
  },
  {
    title: "Ristorante cerca camerieri weekend Genova",
    description:
      "Servizio sala venerdì-domenica. Esperienza gradita. Contratto regolare.",
    company: "Trattoria del Porto",
    city: "Genova",
    zone: "Porto Antico",
    category: "ristorazione",
    sourceCategory: "ristorazione",
    workType: "Part time",
    salary: "Da concordare",
    phone: "010 2233445",
    intentHint: "cerco",
  },
  {
    title: "Startup cerca commerciale entry-level remote",
    description:
      "Vendita SaaS B2B, full remote Italia. Formazione interna. Contratto indeterminato dopo prova.",
    company: "CloudPeak Srl",
    city: "Italia",
    category: "commerciale",
    sourceCategory: "commerciale",
    workType: "Full time",
    salary: "RAL 28-32k + bonus",
    phone: "02 8899001",
    isRemote: true,
    intentHint: "cerco",
  },
  {
    title: "Famiglia cerca OSS notturna a Padova",
    description:
      "Assistenza notturna H12 per anziano. Preferenza qualifica e referenze. Retribuzione CCNL.",
    company: "Famiglia Zanetti",
    city: "Padova",
    zone: "Guizza",
    category: "oss",
    sourceCategory: "oss",
    workType: "Turni",
    salary: "CCNL",
    phone: "049 7788990 WhatsApp 320 4455667",
    intentHint: "cerco",
  },
  {
    title: "Cercasi giardiniere condominio a Verona",
    description:
      "Manutenzione aree verdi condominiali, 1 volta a settimana. Partita IVA.",
    company: "Amministrazione Verde Quattro",
    city: "Verona",
    zone: "Borgo Roma",
    category: "giardinaggio",
    sourceCategory: "giardinaggio",
    workType: "Part time",
    salary: "Preventivo mensile",
    phone: "045 1122334",
    intentHint: "cerco",
  },
  {
    title: "Badante H24 cercasi a Bergamo",
    description:
      "Convivenza per assistenza completa. Preferenza esperienza Alzheimer. Contratto regolare.",
    company: "Famiglia Rota",
    city: "Bergamo",
    zone: "Longuelo",
    category: "badante",
    sourceCategory: "badante",
    workType: "Convivenza",
    salary: "CCNL convivente",
    phone: "035 9988776 WhatsApp 347 0011223",
    intentHint: "cerco",
  },
  {
    title: "Petsitter per weekend a Brescia",
    description:
      "Custodia cane medio taglia sabato-domenica a casa nostra. Chiavi e cibo forniti.",
    company: "Famiglia Pellegrini",
    city: "Brescia",
    zone: "Mompiano",
    category: "dogsitter",
    sourceCategory: "dogsitter",
    workType: "Ad ore",
    salary: "40€/giorno",
    phone: "030 5566778 WhatsApp 339 7788990",
    intentHint: "cerco",
  },
];

/** Restituisce il catalogo grezzo (pronto per transform). */
export function getItalianCatalogRaw(): ScrapedRawItem[] {
  return SEEDS.map((seed, index) => {
    const { intentHint, ...raw } = seed;
    return {
      ...raw,
      intent: intentHint,
      url: `https://cipensoio.it/seed/catalog-${String(index + 1).padStart(3, "0")}`,
    };
  });
}

export function getItalianCatalogCount(): number {
  return SEEDS.length;
}

import Link from "next/link";
import { ListingResults } from "@/components/ListingResults";
import type { ListingIntent, ListingPublic } from "@/lib/types";
import { INTENT_LABELS } from "@/lib/types";

type CategoryBucket = {
  key: string;
  title: string;
  match: (category: string) => boolean;
};

const CARE_BUCKETS: CategoryBucket[] = [
  {
    key: "badante",
    title: "Badante",
    match: (c) => /^(badante|caregiver|oss)$/.test(c) || c.includes("badante"),
  },
  {
    key: "babysitter",
    title: "Babysitter",
    match: (c) => /babysitter|baby_sitter|baby-sitter|tata/.test(c),
  },
];

function normalizeCategory(category: string) {
  return category.toLowerCase().replace(/[\s-]+/g, "_");
}

function splitByCareCategory(listings: ListingPublic[]) {
  const used = new Set<string>();
  const groups: { key: string; title: string; items: ListingPublic[] }[] = [];

  for (const bucket of CARE_BUCKETS) {
    const items = listings.filter((l) => {
      const cat = normalizeCategory(l.category);
      const title = l.title.toLowerCase();
      const hit =
        bucket.match(cat) ||
        (bucket.key === "badante" && /badante|caregiver|\boss\b/.test(title)) ||
        (bucket.key === "babysitter" &&
          /babysitter|baby\s*sitter|\btata\b/.test(title));
      return hit;
    });
    for (const item of items) used.add(item.id);
    if (items.length) {
      groups.push({ key: bucket.key, title: bucket.title, items });
    }
  }

  const rest = listings.filter((l) => !used.has(l.id));
  if (rest.length) {
    groups.push({ key: "altri", title: "Altre categorie", items: rest });
  }

  return groups;
}

const INTENT_ORDER: ListingIntent[] = ["offro", "cerco"];

const INTENT_SECTION: Record<
  ListingIntent,
  { title: string; subtitle: string; href: string }
> = {
  offro: {
    title: "Offro lavoro",
    subtitle: "Persone e professionisti già disponibili — contattali tu.",
    href: "/disponibili",
  },
  cerco: {
    title: "Cerco lavoro",
    subtitle: "Famiglie e aziende che cercano qualcuno da assumere.",
    href: "/cerca?intento=cerco",
  },
};

type Props = {
  listings: ListingPublic[];
  /** Se true, spezza anche badante vs babysitter (e resto). */
  splitCareCategories?: boolean;
  /** Nasconde i titoli Offro/Cerco (utile se la pagina è già filtrata). */
  hideIntentHeaders?: boolean;
  emptyMessage?: string;
  /** Limite per ogni sotto-sezione (utile in home). */
  perSectionLimit?: number;
};

/**
 * Annunci in sezioni separate: Offro lavoro | Cerco lavoro,
 * e opzionalmente Badante | Babysitter.
 */
export function ListingSections({
  listings,
  splitCareCategories = true,
  hideIntentHeaders = false,
  emptyMessage,
  perSectionLimit,
}: Props) {
  if (!listings.length) {
    return (
      <ListingResults listings={[]} emptyMessage={emptyMessage} />
    );
  }

  const byIntent = INTENT_ORDER.map((intent) => ({
    intent,
    items: listings.filter((l) => l.intent === intent),
  })).filter((g) => g.items.length > 0);

  return (
    <div className="grid gap-12">
      {byIntent.map(({ intent, items }) => {
        const meta = INTENT_SECTION[intent];
        const limited = perSectionLimit
          ? items.slice(0, perSectionLimit)
          : items;
        const groups = splitCareCategories
          ? splitByCareCategory(limited)
          : [{ key: "all", title: "", items: limited }];

        const showIntentChrome = !hideIntentHeaders;

        return (
          <section
            key={intent}
            aria-labelledby={showIntentChrome ? `intent-${intent}` : undefined}
            className="scroll-mt-6"
          >
            {showIntentChrome ? (
              <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p
                    className={`text-xs font-semibold uppercase tracking-wide ${
                      intent === "offro"
                        ? "text-[var(--branch-lavoro)]"
                        : "text-[var(--brand)]"
                    }`}
                  >
                    {INTENT_LABELS[intent]}
                  </p>
                  <h2
                    id={`intent-${intent}`}
                    className="font-[family-name:var(--font-syne)] text-2xl font-semibold tracking-tight sm:text-3xl"
                  >
                    {meta.title}
                  </h2>
                  <p className="mt-1 text-sm text-[var(--muted)] sm:text-base">
                    {meta.subtitle}
                  </p>
                </div>
                <Link
                  href={meta.href}
                  className="text-sm font-semibold text-[var(--brand)] hover:text-[var(--brand-deep)]"
                >
                  Vedi tutti →
                </Link>
              </div>
            ) : null}

            <div className={showIntentChrome ? "mt-6 grid gap-8" : "grid gap-8"}>
              {groups.map((group) => (
                <div key={`${intent}-${group.key}`}>
                  {group.title ? (
                    <div className="mb-3 flex items-baseline justify-between gap-3">
                      <h3 className="font-[family-name:var(--font-syne)] text-lg font-semibold tracking-tight">
                        {intent === "offro"
                          ? `${group.title} disponibili`
                          : `Cerco ${group.title.toLowerCase()}`}
                      </h3>
                      {group.key !== "altri" ? (
                        <Link
                          href={
                            intent === "offro"
                              ? `/disponibili?q=${encodeURIComponent(group.key)}`
                              : `/cerca?intento=cerco&q=${encodeURIComponent(group.key)}`
                          }
                          className="text-xs font-semibold text-[var(--muted)] hover:text-[var(--brand)]"
                        >
                          Filtra
                        </Link>
                      ) : null}
                    </div>
                  ) : null}
                  <ListingResults listings={group.items} />
                </div>
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}

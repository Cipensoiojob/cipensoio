import Link from "next/link";
import type { SeoHub } from "@/lib/seo";
import {
  formatCategoryLabel,
  formatCityLabel,
  seoHubHref,
} from "@/lib/seo";

type Props = {
  title: string;
  hubs: SeoHub[];
  limit?: number;
};

export function SeoHubLinks({ title, hubs, limit = 16 }: Props) {
  const items = hubs.slice(0, limit);
  if (!items.length) return null;

  return (
    <section aria-labelledby="seo-hubs-heading">
      <h2
        id="seo-hubs-heading"
        className="font-[family-name:var(--font-syne)] text-xl font-semibold tracking-tight"
      >
        {title}
      </h2>
      <ul className="mt-4 flex flex-wrap gap-2">
        {items.map((hub) => (
          <li key={`${hub.categorySlug}-${hub.citySlug}`}>
            <Link
              href={seoHubHref(hub)}
              className="inline-flex rounded-xl border border-[var(--line)] bg-white px-3 py-1.5 text-sm text-[var(--foreground)] transition-colors hover:border-[var(--brand)] hover:text-[var(--brand)]"
            >
              {formatCategoryLabel(hub.category)} ·{" "}
              {formatCityLabel(hub.city)}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

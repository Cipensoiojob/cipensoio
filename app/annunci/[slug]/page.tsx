import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  BadgeCheck,
  Briefcase,
  Clock,
  MapPin,
  Wallet,
} from "lucide-react";
import { ContactCard } from "@/components/ContactCard";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { getListingBySlug } from "@/lib/listings";
import type { Listing } from "@/lib/types";
import {
  BRANCH_ID_TO_SLUG,
  getBranchMeta,
  WORK_TYPE_LABELS,
} from "@/lib/types";

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

function buildJobPosting(listing: Listing) {
  const location = listing.is_remote
    ? {
        "@type": "Place",
        address: {
          "@type": "PostalAddress",
          addressCountry: "IT",
          addressLocality: listing.location_city,
        },
      }
    : {
        "@type": "Place",
        address: {
          "@type": "PostalAddress",
          addressCountry: "IT",
          addressLocality: listing.location_city,
          addressRegion: listing.location_zone ?? undefined,
        },
      };

  return {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title: listing.title,
    description: listing.description,
    identifier: {
      "@type": "PropertyValue",
      name: "CiPensoIo",
      value: listing.id,
    },
    datePosted: listing.created_at,
    hiringOrganization: {
      "@type": "Organization",
      name: listing.company_or_family_name,
      sameAs: "https://cipensoio.it",
    },
    jobLocation: location,
    employmentType: listing.work_type.toUpperCase(),
    industry: getBranchMeta(listing.macro_branch).label,
    url: `https://cipensoio.it/annunci/${listing.slug}`,
    directApply: true,
    ...(listing.salary_custom
      ? {
          baseSalary: {
            "@type": "MonetaryAmount",
            currency: "EUR",
            value: {
              "@type": "QuantitativeValue",
              unitText: listing.salary_custom,
            },
          },
        }
      : {}),
    ...(listing.is_remote
      ? {
          jobLocationType: "TELECOMMUTE",
          applicantLocationRequirements: {
            "@type": "Country",
            name: "Italy",
          },
        }
      : {}),
  };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const { listing } = await getListingBySlug(slug);

  if (!listing) {
    return { title: "Annuncio non trovato" };
  }

  const location = listing.is_remote
    ? "Full remote"
    : [listing.location_city, listing.location_zone].filter(Boolean).join(", ");

  return {
    title: listing.title,
    description: `${listing.description.slice(0, 155)}${
      listing.description.length > 155 ? "…" : ""
    }`,
    alternates: { canonical: `/annunci/${listing.slug}` },
    openGraph: {
      title: listing.title,
      description: `${WORK_TYPE_LABELS[listing.work_type]} · ${location}`,
      url: `/annunci/${listing.slug}`,
      type: "article",
    },
  };
}

export default async function AnnuncioPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const query = await searchParams;
  const { listing, fromFallback } = await getListingBySlug(slug);

  if (!listing) notFound();

  const meta = getBranchMeta(listing.macro_branch);
  const branchHref = `/${BRANCH_ID_TO_SLUG[listing.macro_branch]}`;
  const justPublished = query.pubblicato === "1";
  const jsonLd = buildJobPosting(listing);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <SiteHeader />
      <main className="flex-1">
        <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
          {justPublished && (
            <p
              role="status"
              className="mb-6 rounded-xl border border-[var(--brand)]/25 bg-[var(--brand-soft)] px-4 py-3 text-sm text-[var(--brand-deep)]"
            >
              Annuncio pubblicato. Ecco la scheda pubblica con i dati
              strutturati SEO.
            </p>
          )}

          <nav className="text-sm text-[var(--muted)]" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-[var(--brand)]">
              Home
            </Link>
            <span className="mx-2" aria-hidden>
              /
            </span>
            <Link href={branchHref} className="hover:text-[var(--brand)]">
              {meta.short}
            </Link>
            <span className="mx-2" aria-hidden>
              /
            </span>
            <span className="text-[var(--foreground)]">{listing.title}</span>
          </nav>

          <div className="mt-6 grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
            <article>
              <div className="flex flex-wrap items-center gap-2 text-xs font-medium">
                <Link
                  href={branchHref}
                  className="rounded-md px-2 py-0.5 text-white"
                  style={{ backgroundColor: meta.color }}
                >
                  {meta.label}
                </Link>
                {listing.is_verified && (
                  <span className="inline-flex items-center gap-1 text-[var(--brand)]">
                    <BadgeCheck className="size-3.5" />
                    Verificato
                  </span>
                )}
                {fromFallback && (
                  <span className="text-[var(--muted)]">Anteprima demo</span>
                )}
              </div>

              <h1 className="mt-4 font-[family-name:var(--font-syne)] text-3xl font-semibold tracking-tight sm:text-4xl">
                {listing.title}
              </h1>

              <p className="mt-3 text-[var(--muted)]">
                {listing.company_or_family_name}
              </p>

              <ul className="mt-6 flex flex-wrap gap-3 text-sm">
                <li className="inline-flex items-center gap-1.5 rounded-xl border border-[var(--line)] bg-white px-3 py-2">
                  <MapPin className="size-4 text-[var(--accent)]" />
                  {listing.is_remote
                    ? "Full remote"
                    : [listing.location_city, listing.location_zone]
                        .filter(Boolean)
                        .join(" · ")}
                </li>
                <li className="inline-flex items-center gap-1.5 rounded-xl border border-[var(--line)] bg-white px-3 py-2">
                  <Briefcase className="size-4 text-[var(--brand)]" />
                  {WORK_TYPE_LABELS[listing.work_type]}
                </li>
                {listing.salary_custom && (
                  <li className="inline-flex items-center gap-1.5 rounded-xl border border-[var(--line)] bg-white px-3 py-2">
                    <Wallet className="size-4 text-[var(--branch-lavoro)]" />
                    {listing.salary_custom}
                  </li>
                )}
                <li className="inline-flex items-center gap-1.5 rounded-xl border border-[var(--line)] bg-white px-3 py-2 text-[var(--muted)]">
                  <Clock className="size-4" />
                  {new Date(listing.created_at).toLocaleDateString("it-IT")}
                </li>
              </ul>

              <div className="mt-8 rounded-2xl border border-[var(--line)] bg-white/80 p-5 sm:p-6">
                <h2 className="font-[family-name:var(--font-syne)] text-lg font-semibold">
                  Descrizione
                </h2>
                <p className="mt-3 whitespace-pre-wrap leading-relaxed text-[var(--foreground)]/90">
                  {listing.description}
                </p>
                <p className="mt-4 text-sm text-[var(--muted)]">
                  Categoria:{" "}
                  <span className="font-medium text-[var(--foreground)]">
                    {listing.category.replace(/_/g, " ")}
                  </span>
                </p>
              </div>
            </article>

            <div className="lg:sticky lg:top-6 lg:self-start">
              <ContactCard
                phone={listing.contact_phone}
                whatsapp={listing.contact_whatsapp}
                title={listing.title}
              />
              {listing.apply_external_url && (
                <a
                  href={listing.apply_external_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-flex w-full items-center justify-center rounded-xl border border-[var(--line)] px-4 py-3 text-sm font-semibold text-[var(--brand)] hover:bg-white"
                >
                  Candidati sul sito esterno
                </a>
              )}
            </div>
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}

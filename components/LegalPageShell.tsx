import type { ReactNode } from "react";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";

type Props = {
  title: string;
  lead: string;
  children: ReactNode;
};

export function LegalPageShell({ title, lead, children }: Props) {
  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <section className="border-b border-[var(--line)] bg-[radial-gradient(90%_70%_at_20%_0%,#c8ebe2_0%,transparent_55%),linear-gradient(180deg,#eaf6f1_0%,var(--background)_80%)]">
          <div className="mx-auto w-full max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
            <h1 className="font-[family-name:var(--font-syne)] text-3xl font-semibold tracking-tight sm:text-4xl">
              {title}
            </h1>
            <p className="mt-3 text-[var(--muted)]">{lead}</p>
          </div>
        </section>
        <article className="mx-auto w-full max-w-3xl px-4 py-10 text-[15px] leading-relaxed text-[var(--foreground)]/90 sm:px-6 sm:py-14 [&_h2]:mt-8 [&_h2]:font-[family-name:var(--font-syne)] [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:tracking-tight [&_h2]:text-[var(--foreground)] [&_li]:mt-1 [&_p]:mt-3 [&_ul]:mt-2 [&_ul]:list-disc [&_ul]:pl-5">
          {children}
        </article>
      </main>
      <SiteFooter />
    </>
  );
}

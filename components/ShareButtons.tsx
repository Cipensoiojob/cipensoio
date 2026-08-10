"use client";

import { Share2 } from "lucide-react";
import { SITE_URL } from "@/lib/types";

type Props = {
  title?: string;
  url?: string;
};

export function ShareButtons({
  title = "Ho pubblicato un annuncio su CiPensoIo",
  url = `${SITE_URL}/pubblica`,
}: Props) {
  const encodedText = encodeURIComponent(`${title} — ${url}`);
  const encodedUrl = encodeURIComponent(url);

  return (
    <div className="mt-6 flex flex-wrap justify-center gap-2">
      <a
        href={`https://wa.me/?text=${encodedText}`}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 rounded-xl bg-[#1fa855] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#188a45]"
      >
        <Share2 className="size-4" aria-hidden />
        WhatsApp
      </a>
      <a
        href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 rounded-xl border border-[var(--line)] bg-white px-4 py-2.5 text-sm font-semibold text-[var(--foreground)] hover:border-[var(--brand)]"
      >
        Facebook
      </a>
    </div>
  );
}

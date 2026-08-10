"use client";

import { useState } from "react";
import { ExternalLink, MessageCircle, Phone } from "lucide-react";

/** Allineato a `APPLY_ONLY_PHONE` nello scraper (solo link esterno). */
const APPLY_ONLY_PHONE = "+390000000000";

type Props = {
  phone: string;
  whatsapp: string | null;
  title: string;
  applyUrl?: string | null;
};

function digitsOnly(value: string) {
  return value.replace(/\D/g, "");
}

function maskPhone(phone: string) {
  const digits = digitsOnly(phone);
  if (digits.length < 6) return "••••••••";
  return `${digits.slice(0, 3)} ••• ••• ${digits.slice(-2)}`;
}

function isApplyOnlyPhone(phone: string) {
  return digitsOnly(phone) === digitsOnly(APPLY_ONLY_PHONE);
}

export function ContactCard({ phone, whatsapp, title, applyUrl }: Props) {
  const [revealed, setRevealed] = useState(false);
  const applyOnly = isApplyOnlyPhone(phone) || (!phone && Boolean(applyUrl));
  const waNumber = applyOnly ? "" : digitsOnly(whatsapp || phone);
  const waText = encodeURIComponent(
    `Ciao, ti contatto da CiPensoIo riguardo: ${title}`,
  );

  if (applyOnly && applyUrl) {
    return (
      <aside className="rounded-2xl border border-[var(--line)] bg-white p-5 shadow-[var(--shadow-soft)]">
        <h2 className="font-[family-name:var(--font-syne)] text-xl font-semibold tracking-tight">
          Candidati qui
        </h2>
        <p className="mt-2 text-base leading-relaxed text-[var(--muted)]">
          Questo annuncio arriva da una fonte esterna: apri il link ufficiale per
          candidarti. Non c’è un telefono diretto su CiPensoIo.
        </p>
        <a
          href={applyUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-5 inline-flex min-h-14 w-full items-center justify-center gap-2 rounded-2xl bg-[var(--brand)] px-4 py-4 text-base font-semibold text-white transition-colors hover:bg-[var(--brand-deep)]"
        >
          <ExternalLink className="size-5" aria-hidden />
          Apri annuncio originale
        </a>
        <p className="mt-4 text-xs leading-relaxed text-[var(--muted)]">
          Verifica sempre datore, contratto e condizioni sul sito di origine.
        </p>
      </aside>
    );
  }

  return (
    <aside className="rounded-2xl border border-[var(--line)] bg-white p-5 shadow-[var(--shadow-soft)]">
      <h2 className="font-[family-name:var(--font-syne)] text-xl font-semibold tracking-tight">
        Parla subito
      </h2>
      <p className="mt-2 text-base leading-relaxed text-[var(--muted)]">
        Tocca un pulsante grande. WhatsApp è spesso il modo più facile — anche
        senza computer.
      </p>

      <div className="mt-5 grid gap-3">
        {waNumber && (
          <a
            href={`https://wa.me/${waNumber}?text=${waText}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-14 w-full items-center justify-center gap-2 rounded-2xl bg-[#1fa855] px-4 py-4 text-base font-semibold text-white transition-colors hover:bg-[#188a45]"
          >
            <MessageCircle className="size-5" aria-hidden />
            Scrivi su WhatsApp
          </a>
        )}

        <button
          type="button"
          onClick={() => {
            if (!revealed) {
              setRevealed(true);
              return;
            }
            window.location.href = `tel:${digitsOnly(phone)}`;
          }}
          className="inline-flex min-h-14 w-full items-center justify-center gap-2 rounded-2xl border-2 border-[var(--brand)] bg-[var(--brand-soft)] px-4 py-4 text-base font-semibold text-[var(--brand-deep)] transition-colors hover:bg-[color-mix(in_srgb,var(--brand-soft)_70%,white)]"
        >
          <Phone className="size-5" aria-hidden />
          {revealed
            ? `Tocca di nuovo per chiamare · ${digitsOnly(phone) || phone}`
            : `Mostra telefono · ${maskPhone(phone)}`}
        </button>
      </div>

      {revealed && (
        <p className="mt-3 text-sm text-[var(--muted)]">
          Secondo tocco avvia la chiamata. Meglio in orari diurni.
        </p>
      )}

      {applyUrl && (
        <a
          href={applyUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-[var(--line)] px-4 py-3 text-sm font-semibold text-[var(--brand)] hover:bg-white"
        >
          <ExternalLink className="size-4" aria-hidden />
          Candidati sul sito esterno
        </a>
      )}

      <p className="mt-4 text-xs leading-relaxed text-[var(--muted)]">
        Contatto diretto famiglia ↔ lavoratore. Il lavoro domestico va
        inquadrato secondo le regole italiane (es. CCNL): CiPensoIo facilita
        l&apos;incontro, non sostituisce obblighi di legge.
      </p>
    </aside>
  );
}

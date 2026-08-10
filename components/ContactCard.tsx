"use client";

import { useState } from "react";
import { MessageCircle, Phone } from "lucide-react";

type Props = {
  phone: string;
  whatsapp: string | null;
  title: string;
};

function digitsOnly(value: string) {
  return value.replace(/\D/g, "");
}

function maskPhone(phone: string) {
  const digits = digitsOnly(phone);
  if (digits.length < 6) return "••••••••";
  return `${digits.slice(0, 3)} ••• ••• ${digits.slice(-2)}`;
}

export function ContactCard({ phone, whatsapp, title }: Props) {
  const [revealed, setRevealed] = useState(false);
  const waNumber = digitsOnly(whatsapp || phone);
  const waText = encodeURIComponent(
    `Ciao, ti contatto da CiPensoIo riguardo: ${title}`,
  );

  return (
    <aside className="rounded-2xl border border-[var(--line)] bg-white p-5 shadow-[var(--shadow-soft)]">
      <h2 className="font-[family-name:var(--font-syne)] text-lg font-semibold tracking-tight">
        Contatta l&apos;inserzionista
      </h2>
      <p className="mt-1 text-sm text-[var(--muted)]">
        I numeri restano nascosti fino al click — niente spam.
      </p>

      <div className="mt-5 grid gap-3">
        <button
          type="button"
          onClick={() => {
            if (!revealed) {
              setRevealed(true);
              return;
            }
            window.location.href = `tel:${digitsOnly(phone)}`;
          }}
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-[var(--line)] bg-[var(--brand-soft)] px-4 py-3 text-sm font-semibold text-[var(--brand-deep)] transition-colors hover:bg-[color-mix(in_srgb,var(--brand-soft)_70%,white)]"
        >
          <Phone className="size-4" aria-hidden />
          {revealed ? digitsOnly(phone) || phone : `Mostra numero · ${maskPhone(phone)}`}
        </button>

        {waNumber && (
          <a
            href={`https://wa.me/${waNumber}?text=${waText}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#1fa855] px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#188a45]"
          >
            <MessageCircle className="size-4" aria-hidden />
            Scrivi su WhatsApp
          </a>
        )}
      </div>

      {revealed && (
        <p className="mt-3 text-xs text-[var(--muted)]">
          Secondo click chiama il numero. Orari: rispetta la privacy della
          famiglia o dell&apos;azienda.
        </p>
      )}
    </aside>
  );
}

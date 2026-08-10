import type { Metadata } from "next";
import Link from "next/link";
import { LegalPageShell } from "@/components/LegalPageShell";

export const metadata: Metadata = {
  title: "Cookie Policy",
  description:
    "Informativa sui cookie utilizzati da CiPensoIo e su come gestirli.",
  alternates: { canonical: "/cookie-policy" },
};

export default function CookiePolicyPage() {
  return (
    <LegalPageShell
      title="Cookie Policy"
      lead="Come CiPensoIo usa cookie e tecnologie simili sul sito."
    >
      <h2>1. Cosa sono i cookie</h2>
      <p>
        I cookie sono piccoli file di testo memorizzati sul tuo dispositivo. Ci
        aiutano a far funzionare il sito, ricordare preferenze e capire come
        viene usato il servizio.
      </p>

      <h2>2. Cookie che usiamo</h2>
      <ul>
        <li>
          <strong>Tecnici / di sessione</strong> — necessari al funzionamento
          (es. sessione area moderazione protetta). Non richiedono consenso.
        </li>
        <li>
          <strong>Preferenze</strong> — eventuali scelte UI salvate in locale
          (localStorage) senza profilazione pubblicitaria.
        </li>
        <li>
          <strong>Analitici first-party</strong> — misuriamo in modo aggregato
          visite di pagina, ricerche e aperture annunci (ID sessione anonimo in{" "}
          <em>localStorage</em>, senza profilazione pubblicitaria né vendita
          dati). I dati sono visibili solo nell&apos;area admin. Puoi cancellare
          i dati locali dal browser.
        </li>
      </ul>

      <h2>3. Cosa non facciamo</h2>
      <p>
        Non usiamo cookie di profilazione pubblicitaria di terze parti per
        retargeting. Non vendiamo dati di navigazione.
      </p>

      <h2>4. Come gestirli</h2>
      <p>
        Puoi cancellare o bloccare i cookie dalle impostazioni del browser.
        Disabilitare i cookie tecnici può impedire l&apos;accesso ad aree
        riservate (es. moderazione).
      </p>

      <h2>5. Privacy</h2>
      <p>
        Per i dati personali (inclusi i contatti negli annunci) vedi la{" "}
        <Link
          href="/privacy-policy"
          className="text-[var(--brand)] hover:underline"
        >
          Privacy Policy
        </Link>
        .
      </p>

      <p className="mt-8 text-sm text-[var(--muted)]">
        Ultimo aggiornamento: agosto 2026.
      </p>
    </LegalPageShell>
  );
}

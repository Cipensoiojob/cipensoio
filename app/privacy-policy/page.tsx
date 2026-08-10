import type { Metadata } from "next";
import Link from "next/link";
import { LegalPageShell } from "@/components/LegalPageShell";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Informativa sulla privacy di CiPensoIo: gestione dei dati di contatto, finalità e diritti GDPR.",
  alternates: { canonical: "/privacy-policy" },
};

export default function PrivacyPolicyPage() {
  return (
    <LegalPageShell
      title="Privacy Policy"
      lead="Informativa sul trattamento dei dati personali ai sensi del Regolamento UE 2016/679 (GDPR)."
    >
      <p>
        <strong>Titolare del trattamento:</strong> CiPensoIo (cipensoio.it). Per
        richieste:{" "}
        <a
          className="font-medium text-[var(--brand)] underline-offset-2 hover:underline"
          href="mailto:privacy@cipensoio.it"
        >
          privacy@cipensoio.it
        </a>
        .
      </p>

      <h2>1. Dati che raccogliamo</h2>
      <p>
        Quando pubblichi un annuncio tramite il form{" "}
        <Link href="/pubblica" className="text-[var(--brand)] hover:underline">
          /pubblica
        </Link>
        , trattiamo i dati che ci fornisci volontariamente, tra cui:
      </p>
      <ul>
        <li>nome famiglia / azienda o nome del lavoratore;</li>
        <li>titolo, descrizione e categoria dell&apos;annuncio;</li>
        <li>città e zona;</li>
        <li>
          <strong>numero di telefono</strong> e, se indicato,{" "}
          <strong>WhatsApp</strong>;
        </li>
        <li>eventuale retribuzione o URL esterni.</li>
      </ul>
      <p>
        I contatti telefonici / WhatsApp restano nascosti nella scheda pubblica
        fino a un click esplicito dell&apos;utente (&ldquo;mostra numero&rdquo; /
        WhatsApp), per ridurre lo spam.
      </p>

      <h2>2. Finalità e base giuridica</h2>
      <ul>
        <li>
          <strong>Pubblicazione e moderazione annunci</strong> — esecuzione di
          misure precontrattuali / legittimo interesse a gestire la piattaforma
          (art. 6.1.b e 6.1.f GDPR);
        </li>
        <li>
          <strong>Messa in contatto</strong> tra famiglie, lavoratori e aziende
          — consenso / interesse legittimo connesso alla finalità del servizio;
        </li>
        <li>
          <strong>Sicurezza e abuso</strong> — prevenzione di spam e contenuti
          illeciti;
        </li>
        <li>
          <strong>Statistiche di utilizzo</strong> — misura aggregata di visite,
          ricerche e aperture annunci (ID sessione anonimo, senza vendere i dati
          a terzi) — legittimo interesse a migliorare il servizio (art. 6.1.f).
        </li>
      </ul>

      <h2>3. Conservazione</h2>
      <p>
        Gli annunci restano nei nostri sistemi finché sono utili al servizio o
        finché non vengono rifiutati / rimossi. Gli annunci in stato{" "}
        <em>pending</em> sono visibili solo al team di moderazione; quelli{" "}
        <em>rejected</em> non sono pubblici. Puoi chiedere la cancellazione
        scrivendo a privacy@cipensoio.it.
      </p>

      <h2>4. Destinatari</h2>
      <p>
        I dati sono ospitati su infrastruttura cloud (es. Supabase / hosting
        Next.js). Non vendiamo i tuoi contatti a terzi. I numeri mostrati nella
        scheda pubblica possono essere usati solo per rispondere all&apos;annuncio.
      </p>

      <h2>5. I tuoi diritti</h2>
      <p>
        Hai diritto di accesso, rettifica, cancellazione, limitazione,
        opposizione e portabilità, nonché di proporre reclamo al Garante per la
        protezione dei dati personali. Per esercitarli: privacy@cipensoio.it.
      </p>

      <h2>6. Cookie</h2>
      <p>
        Dettagli su cookie e tecnologie simili nella{" "}
        <Link
          href="/cookie-policy"
          className="text-[var(--brand)] hover:underline"
        >
          Cookie Policy
        </Link>
        .
      </p>

      <p className="mt-8 text-sm text-[var(--muted)]">
        Ultimo aggiornamento: agosto 2026.
      </p>
    </LegalPageShell>
  );
}

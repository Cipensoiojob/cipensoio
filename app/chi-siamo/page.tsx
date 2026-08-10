import type { Metadata } from "next";
import Link from "next/link";
import { LegalPageShell } from "@/components/LegalPageShell";

export const metadata: Metadata = {
  title: "Chi siamo",
  description:
    "La mission di CiPensoIo: avvicinare famiglie, caregiver e lavoro di nicchia, vicino a casa.",
  alternates: { canonical: "/chi-siamo" },
};

export default function ChiSiamoPage() {
  return (
    <LegalPageShell
      title="Chi siamo"
      lead="Vicino a casa tua — lavoro e assistenza senza fronzoli."
    >
      <h2>La mission</h2>
      <p>
        <strong>CiPensoIo</strong> nasce per avvicinare chi cerca e chi offre
        aiuto concreto: badanti, colf, babysitter, pet &amp; home care e
        opportunità di lavoro tradizionali o tech. Crediamo che il matching
        migliore sia locale, chiaro e rispettoso della privacy.
      </p>

      <h2>Tre porte, stessa vicinanza</h2>
      <ul>
        <li>
          <Link
            href="/persona-assistenza"
            className="text-[var(--brand)] hover:underline"
          >
            Assistenza &amp; Persona
          </Link>{" "}
          — cura e quotidianità familiare;
        </li>
        <li>
          <Link href="/pet-home" className="text-[var(--brand)] hover:underline">
            Pet &amp; Home Care
          </Link>{" "}
          — animali e casa;
        </li>
        <li>
          <Link
            href="/lavoro-tradizionale"
            className="text-[var(--brand)] hover:underline"
          >
            Lavoro &amp; Tech
          </Link>{" "}
          — ruoli di nicchia, anche remote.
        </li>
      </ul>

      <h2>Come lavoriamo</h2>
      <p>
        Gli annunci passano da una <strong>moderazione</strong> prima di andare
        online. I numeri di telefono restano protetti fino al click. Il servizio
        è gratuito in fase di lancio: vogliamo prima costruire fiducia e
        qualità, poi monetizzare senza chiudere le porte a chi ha più bisogno.
      </p>

      <h2>Partecipa</h2>
      <p>
        Hai un annuncio da condividere?{" "}
        <Link href="/pubblica" className="text-[var(--brand)] hover:underline">
          Pubblicalo in pochi passi
        </Link>
        . Domande o partnership:{" "}
        <a
          href="mailto:ciao@cipensoio.it"
          className="text-[var(--brand)] hover:underline"
        >
          ciao@cipensoio.it
        </a>
        .
      </p>
    </LegalPageShell>
  );
}

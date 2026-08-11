import PageShell from "../../ui/PageShell";
import Section from "../../ui/Section";

export default function HowItWorks() {
  return (
    <PageShell title="Comment ça marche" subtitle="Le parcours passager et conducteur, étape par étape" actions={[{ label: "Rechercher un trajet", href: "/search" }]}>
      <div className="grid gap-6 md:grid-cols-2">
        <Section title="Côté passager">
          <ol className="list-decimal pl-5 text-sm text-gray-700 space-y-2">
            <li>Inscription avec téléphone (code SMS), NPI et scan de carte d'identité.</li>
            <li>Recherche d'un trajet (ville de départ → arrivée, date).</li>
            <li>Choix d'un conducteur, réservation d'une ou plusieurs places.</li>
            <li>Paiement Mobile Money du prix + une part des frais de retrait.</li>
            <li>Coordination via la messagerie interne, puis départ.</li>
            <li>Notation du conducteur après le trajet.</li>
          </ol>
        </Section>
        <Section title="Côté conducteur">
          <ol className="list-decimal pl-5 text-sm text-gray-700 space-y-2">
            <li>Inscription avec téléphone (code SMS), permis et NIP.</li>
            <li>Casier judiciaire à fournir dans le mois (rappels automatiques par SMS).</li>
            <li>Validation manuelle du dossier par un administrateur.</li>
            <li>Publication d'un trajet (ville, point précis, heure, prix, places).</li>
            <li>Réception des réservations et confirmation du départ.</li>
            <li>Versement Mobile Money (acompte au départ ou totalité en fin de course).</li>
          </ol>
        </Section>
      </div>
    </PageShell>
  );
}

import PageShell from "../../ui/PageShell";
import Section from "../../ui/Section";

export default function FraudDetection() {
  return (
    <PageShell title="Détection de fraude" subtitle="Module à construire">
      <Section title="Statut">
        <p className="text-sm text-gray-600">
          Ce module n'est pas encore branché à un moteur de détection réel. Il est prévu pour analyser les
          schémas suspects (comptes multiples, paiements anormaux, trajets fictifs) une fois le volume de
          données de production suffisant. En attendant, les cas suspects remontent manuellement via
          <a className="underline ml-1" href="/admin/disputes">Litiges & remboursements</a>.
        </p>
      </Section>
    </PageShell>
  );
}

import PageShell from "../../ui/PageShell";
import Section from "../../ui/Section";

export default function AnomalyDetection() {
  return (
    <PageShell title="Détection d'anomalies" subtitle="Module à construire">
      <Section title="Statut">
        <p className="text-sm text-gray-600">
          Surveillance automatique des anomalies (pics de transactions, trajets sans activité, comportements
          inhabituels) — prévue pour une prochaine itération, une fois assez de données collectées via
          <a className="underline ml-1" href="/admin/finance-reports">Rapports financiers</a> et
          <a className="underline ml-1" href="/admin/trips">Trajets</a>.
        </p>
      </Section>
    </PageShell>
  );
}

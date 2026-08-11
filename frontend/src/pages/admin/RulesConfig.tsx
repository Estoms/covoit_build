import PageShell from "../../ui/PageShell";
import Section from "../../ui/Section";

export default function RulesConfig() {
  return (
    <PageShell title="Configuration des règles" subtitle="Paramètres métier">
      <Section title="Règles actuelles (définies côté backend)">
        <ul className="list-disc pl-5 text-sm text-gray-700 space-y-1">
          <li>Commission de départ : 12%, plancher 8% selon le volume mensuel du conducteur.</li>
          <li>Part des frais de retrait Mobile Money payée par le passager : 50%.</li>
          <li>Délai de fourniture du casier judiciaire : 30 jours après inscription.</li>
          <li>Éligibilité pack coûts opérationnels (cash-out + data) : à partir de 4 trajets/mois.</li>
        </ul>
        <p className="mt-3 text-xs text-gray-500">
          Ces valeurs sont actuellement définies via les variables d'environnement du backend
          (<code>COMMISSION_BASE_PERCENT</code>, etc.). Une interface d'édition en direct pourra être ajoutée
          une fois le besoin confirmé.
        </p>
      </Section>
    </PageShell>
  );
}

import PageShell from "../../ui/PageShell";
import Section from "../../ui/Section";

export default function Privacy() {
  return (
    <PageShell
      title="Politique de confidentialité"
      subtitle="Protection des données personnelles"
    >
      <Section title="1. Données collectées">
        <ul className="list-disc pl-5 text-sm text-gray-700 space-y-1">
          <li>Nom, email, téléphone</li>
          <li>Informations de trajets et réservations</li>
          <li>Messages échangés sur la plateforme</li>
        </ul>
      </Section>

      <Section title="2. Utilisation des données">
        <p className="text-sm text-gray-700">
          Les données servent à gérer les comptes, les réservations, la sécurité
          et l’amélioration du service.
        </p>
      </Section>

      <Section title="3. Partage des données">
        <p className="text-sm text-gray-700">
          Les données ne sont jamais vendues. Certaines informations sont
          partagées uniquement entre conducteur et passager pour le trajet.
        </p>
      </Section>

      <Section title="4. Sécurité">
        <p className="text-sm text-gray-700">
          Nous mettons en place des mesures techniques pour protéger les
          informations personnelles.
        </p>
      </Section>

      <Section title="5. Droits des utilisateurs">
        <p className="text-sm text-gray-700">
          L’utilisateur peut demander la modification ou la suppression de ses
          données personnelles.
        </p>
      </Section>
    </PageShell>
  );
}

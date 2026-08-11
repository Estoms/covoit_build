import PageShell from "../../ui/PageShell";
import Section from "../../ui/Section";

export default function TrustSafety() {
  return (
    <PageShell title="Confiance & sécurité" subtitle="Ce que MobiBenin met en place pour protéger ses utilisateurs">
      <div className="grid gap-6 md:grid-cols-2">
        <Section title="Vérification d'identité">
          <p className="text-sm text-gray-700">
            Passagers (NPI + carte d'identité) et conducteurs (permis, NIP, casier judiciaire) sont vérifiés.
            Aucun conducteur ne peut publier de trajet sans validation manuelle d'un administrateur.
          </p>
        </Section>
        <Section title="Paiement protégé">
          <p className="text-sm text-gray-700">
            L'argent est déposé sur un portefeuille MobiBenin à la réservation et débloqué progressivement pour
            le conducteur, jamais échangé en espèces.
          </p>
        </Section>
        <Section title="Vie privée">
          <p className="text-sm text-gray-700">
            La messagerie interne remplace l'échange de numéro de téléphone entre passager et conducteur.
          </p>
        </Section>
        <Section title="Modération">
          <p className="text-sm text-gray-700">
            Une équipe support traite les litiges et signalements via un système de tickets et de médiation.
          </p>
        </Section>
      </div>
    </PageShell>
  );
}

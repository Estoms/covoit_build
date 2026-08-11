import PageShell from "../../ui/PageShell";
import Section from "../../ui/Section";

export default function About() {
  return (
    <PageShell title="À propos de MobiBenin" subtitle="Le covoiturage interurbain pensé pour le Bénin" actions={[{ label: "Rechercher un trajet", href: "/search" }]}>
      <div className="grid gap-6 md:grid-cols-2">
        <Section title="Notre mission">
          <p className="text-sm text-gray-700">
            MobiBenin connecte les particuliers qui font déjà des trajets interurbains (Cotonou, Parakou et
            au-delà) avec des passagers, principalement des étudiants et jeunes, à la recherche d'un moyen de
            transport fiable, moins cher que le bus classique et plus confortable que les gares routières
            traditionnelles.
          </p>
        </Section>
        <Section title="Comment nous choisissons nos conducteurs">
          <p className="text-sm text-gray-700">
            Chaque conducteur fournit son permis, son NIP et un extrait de casier judiciaire. Un administrateur
            valide manuellement chaque dossier avant l'activation du compte, pour la sécurité de tous.
          </p>
        </Section>
      </div>
      <Section title="Nos engagements">
        <ul className="list-disc pl-5 text-sm text-gray-700 space-y-1">
          <li>Paiement 100% Mobile Money (MTN MoMo, Moov Money), sans espèces.</li>
          <li>Vie privée protégée : la messagerie interne remplace l'échange de numéro.</li>
          <li>Commission dégressive : les conducteurs réguliers gardent une plus grande part de leurs gains.</li>
        </ul>
      </Section>
    </PageShell>
  );
}

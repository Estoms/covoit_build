import PageShell from "../../ui/PageShell";
import Section from "../../ui/Section";
import InfoList from "../../ui/InfoList";

export default function MyBookingsCancelled() {
  return (
    <PageShell
      title="Mes réservations annulées"
      subtitle="Espace Passager : rechercher, réserver, payer, voyager et laisser un avis."
      actions={[{"label":"Voir mes réservations","href":"/p/bookings/upcoming","variant":"primary"},{"label":"Messages","href":"/p/messages","variant":"secondary"}]}
      nextApi={["POST /bookings","POST /payments","GET /bookings/me","POST /reviews"]}
    >
      <div className="grid gap-6 md:grid-cols-2">
        <Section title="Objectif">
          <InfoList
            items={[
              "Décrire clairement le rôle de cette page",
              "Afficher une UI cohérente et responsive",
              "Préparer l’intégration backend (API)",
            ]}
          />
        </Section>

        <Section title="À implémenter (UI)">
          <InfoList
            items={[
              "Formulaire / liste / détails selon la page",
              "États : loading, empty, error",
              "Actions principales (CTA) + navigation",
            ]}
          />
        </Section>
      </div>

      <Section title="Notes Bénin">
        <InfoList
          items={[
            "Devise : FCFA (XOF)",
            "Fuseau horaire : Africa/Porto-Novo",
            "Villes : Porto-Novo, Cotonou, Abomey-Calavi, Parakou, …",
          ]}
        />
      </Section>
    </PageShell>
  );
}

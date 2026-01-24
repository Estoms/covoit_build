import React from "react";
import PageShell from "../../ui/PageShell";
import Section from "../../ui/Section";
import InfoList from "../../ui/InfoList";

export default function DriverSupport() {
  return (
    <PageShell
      title="Support conducteur"
      subtitle="Espace Conducteur : publier, gérer les trajets, demandes, revenus et véhicules."
      actions={[{"label":"Publier un trajet","href":"/d/trips/publish","variant":"primary"},{"label":"Mes trajets","href":"/d/trips","variant":"secondary"}]}
      nextApi={["POST /trips","PUT /trips/{id}","GET /trips/me","GET /earnings/me"]}
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

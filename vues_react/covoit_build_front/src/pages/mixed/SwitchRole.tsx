import React from "react";
import PageShell from "../../ui/PageShell";
import Section from "../../ui/Section";
import InfoList from "../../ui/InfoList";

export default function SwitchRole() {
  return (
    <PageShell
      title="Changer de rôle"
      subtitle="Mode Mixte : basculer entre passager et conducteur, historique global et statistiques."
      actions={[{"label":"Historique global","href":"/m/history","variant":"primary"}]}
      nextApi={["GET /history/me","GET /stats/me"]}
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

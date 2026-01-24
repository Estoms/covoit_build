import React from "react";
import PageShell from "../../ui/PageShell";
import Section from "../../ui/Section";
import InfoList from "../../ui/InfoList";

export default function LegalNotice() {
  return (
    <PageShell
      title="Mentions légales"
      subtitle="Contexte Bénin : villes (Porto-Novo, Cotonou, Parakou…), prix en FCFA, timezone Africa/Porto-Novo."
      actions={[{"label":"Rechercher un trajet","href":"/search","variant":"primary"}]}
      nextApi={["GET /trips/search","GET /trips/{id}","GET /cities (Bénin)"]}
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

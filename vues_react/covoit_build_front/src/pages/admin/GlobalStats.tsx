import React from "react";
import PageShell from "../../ui/PageShell";
import Section from "../../ui/Section";
import InfoList from "../../ui/InfoList";

export default function GlobalStats() {
  return (
    <PageShell
      title="Statistiques globales"
      subtitle="Administration : supervision, modération, finance, sécurité et configuration."
      actions={[{"label":"Statistiques globales","href":"/admin/stats","variant":"primary"}]}
      nextApi={["GET /admin/stats","GET /admin/users","POST /admin/moderation","GET /admin/finance"]}
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

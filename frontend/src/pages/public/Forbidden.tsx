import PageShell from "../../ui/PageShell";
import Section from "../../ui/Section";

export default function Forbidden() {
  return (
    <PageShell
      title="Accès refusé"
      subtitle="Tu n’as pas les droits nécessaires pour accéder à cette page."
      actions={[{ label: "Retour accueil", href: "/", variant: "secondary" }]}
    >
      <Section title="403">
        <p className="text-gray-700">
          Si tu penses que c’est une erreur, connecte-toi avec le bon compte.
        </p>
      </Section>
    </PageShell>
  );
}

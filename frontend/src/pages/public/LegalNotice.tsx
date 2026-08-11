import PageShell from "../../ui/PageShell";
import Section from "../../ui/Section";

export default function LegalNotice() {
  return (
    <PageShell title="Mentions légales" subtitle="Informations relatives à l'éditeur de la plateforme MobiBenin">
      <Section title="Éditeur">
        <p className="text-sm text-gray-700">MobiBenin — plateforme de covoiturage interurbain opérant en République du Bénin.</p>
      </Section>
      <Section title="Hébergement">
        <p className="text-sm text-gray-700">Les informations d'hébergement seront précisées avant la mise en production.</p>
      </Section>
      <Section title="Propriété intellectuelle">
        <p className="text-sm text-gray-700">L'ensemble des contenus (textes, marque, interface) est la propriété de MobiBenin, sauf mention contraire.</p>
      </Section>
      <Section title="Contact">
        <p className="text-sm text-gray-700">Pour toute question légale, contacte l'équipe via le centre d'aide.</p>
      </Section>
    </PageShell>
  );
}

import PageShell from "../../ui/PageShell";
import Section from "../../ui/Section";

export default function Terms() {
  return (
    <PageShell
      title="Conditions d’utilisation"
      subtitle="Plateforme de covoiturage – MobiBenin"
    >
      <Section title="1. Objet">
        <p className="text-sm text-gray-700">
          MobiBenin met en relation conducteurs et passagers pour le partage
          de trajets au Bénin. La plateforme n’est pas une société de transport.
        </p>
      </Section>

      <Section title="2. Responsabilité">
        <p className="text-sm text-gray-700">
          Les conducteurs et passagers sont responsables de leur comportement,
          du respect du code de la route et des lois locales.
        </p>
      </Section>

      <Section title="3. Comptes utilisateurs">
        <p className="text-sm text-gray-700">
          L’utilisateur s’engage à fournir des informations exactes et à ne pas
          usurper l’identité d’autrui.
        </p>
      </Section>

      <Section title="4. Paiements">
        <p className="text-sm text-gray-700">
          Les paiements effectués via la plateforme sont destinés au partage de
          frais de transport et non à une activité professionnelle.
        </p>
      </Section>

      <Section title="5. Suspension de compte">
        <p className="text-sm text-gray-700">
          MobiBenin peut suspendre un compte en cas de fraude, abus ou
          comportement dangereux.
        </p>
      </Section>
    </PageShell>
  );
}

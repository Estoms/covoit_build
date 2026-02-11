import PageShell from "../../ui/PageShell";
import Section from "../../ui/Section";

export default function SupportMediation() {
  return (
    <PageShell
      title="Médiation"
      subtitle="Résolution des litiges (mock)."
      actions={[{ label: "Console", href: "/support", variant: "secondary" }]}
    >
      <Section title="Cas en cours">
        <div className="rounded-2xl border bg-white p-4 shadow-sm text-gray-800">
          Aucun cas en cours pour le moment.
        </div>
      </Section>
    </PageShell>
  );
}

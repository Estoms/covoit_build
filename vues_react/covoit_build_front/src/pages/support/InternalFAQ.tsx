import PageShell from "../../ui/PageShell";
import Section from "../../ui/Section";

export default function SupportInternalFaq() {
  const items = [
    { q: "Comment vérifier un compte ?", a: "Aller dans Admin → Utilisateurs → Vérifications (mock)." },
    { q: "Que faire en cas de litige ?", a: "Ouvrir un cas dans Support → Médiation." },
  ];

  return (
    <PageShell
      title="FAQ interne"
      subtitle="Réponses rapides pour l’équipe support (mock)."
      actions={[{ label: "Console", href: "/support", variant: "secondary" }]}
    >
      <Section title="Articles">
        <div className="space-y-3">
          {items.map((it) => (
            <div key={it.q} className="rounded-2xl border bg-white p-4 shadow-sm">
              <div className="font-semibold">{it.q}</div>
              <div className="text-sm text-gray-700 mt-1">{it.a}</div>
            </div>
          ))}
        </div>
      </Section>
    </PageShell>
  );
}

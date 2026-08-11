import PageShell from "../../ui/PageShell";
import Section from "../../ui/Section";

export default function SupportInternalFaq() {
  const items = [
    { q: "Comment valider le dossier d'un conducteur ?", a: "Admin → Modération des dossiers conducteurs (/admin/user-moderation), approuver ou refuser avec un motif." },
    { q: "Que faire en cas de litige sur une réservation ?", a: "Ouvrir le ticket depuis Support → Médiation, documenter la décision dans les outils de médiation." },
    { q: "Un passager n'a pas reçu son code SMS", a: "Vérifier dans les logs backend (mode démo) ou renvoyer un nouveau code depuis la page d'inscription." },
    { q: "Un conducteur n'a pas reçu son versement", a: "Vérifier l'historique de son portefeuille dans Admin → Utilisateurs → détail du compte." },
  ];

  return (
    <PageShell title="FAQ interne" subtitle="Réponses rapides pour l'équipe support" actions={[{ label: "Console", href: "/support", variant: "secondary" }]}>
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

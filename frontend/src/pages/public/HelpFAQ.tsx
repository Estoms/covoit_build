import PageShell from "../../ui/PageShell";
import Section from "../../ui/Section";

const FAQS = [
  { q: "Comment payer un trajet ?", a: "Via Mobile Money (MTN MoMo ou Moov Money), directement dans l'application au moment de la réservation." },
  { q: "Pourquoi dois-je fournir mon NPI ou mon casier judiciaire ?", a: "Pour la sécurité de tous les utilisateurs de la plateforme. Ces documents ne sont visibles que par l'équipe de modération." },
  { q: "Puis-je contacter le conducteur directement ?", a: "La coordination se fait via la messagerie interne MobiBenin, qui protège la vie privée du conducteur." },
  { q: "Que se passe-t-il si j'annule ma réservation ?", a: "Tu peux annuler depuis le détail de ta réservation tant qu'elle n'est pas en cours ou terminée." },
  { q: "Comment fonctionnent les points de fidélité ?", a: "Tu gagnes des points à chaque trajet terminé, échangeables contre un trajet gratuit ou des tickets valeur partenaires." },
];

export default function HelpFAQ() {
  return (
    <PageShell title="Centre d'aide" subtitle="Questions fréquentes" actions={[{ label: "Contacter le support", href: "/login" }]}>
      <Section title="Questions fréquentes">
        <div className="divide-y">
          {FAQS.map((f) => (
            <div key={f.q} className="py-3">
              <div className="font-semibold text-sm">{f.q}</div>
              <div className="text-sm text-gray-600 mt-1">{f.a}</div>
            </div>
          ))}
        </div>
      </Section>
    </PageShell>
  );
}

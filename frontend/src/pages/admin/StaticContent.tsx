import PageShell from "../../ui/PageShell";
import Section from "../../ui/Section";

export default function StaticContent() {
  return (
    <PageShell title="Contenu statique" subtitle="Pages publiques">
      <Section title="Pages gérées">
        <ul className="list-disc pl-5 text-sm text-gray-700 space-y-1">
          <li><a className="underline" href="/about">À propos</a></li>
          <li><a className="underline" href="/how-it-works">Comment ça marche</a></li>
          <li><a className="underline" href="/help">Centre d'aide</a></li>
          <li><a className="underline" href="/trust-safety">Confiance & sécurité</a></li>
          <li><a className="underline" href="/terms">Conditions d'utilisation</a></li>
          <li><a className="underline" href="/privacy">Politique de confidentialité</a></li>
          <li><a className="underline" href="/legal">Mentions légales</a></li>
        </ul>
        <p className="mt-3 text-xs text-gray-500">Ces pages sont actuellement gérées directement dans le code du frontend.</p>
      </Section>
    </PageShell>
  );
}

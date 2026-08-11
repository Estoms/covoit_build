import { Link } from "react-router-dom";
import PageShell from "../../ui/PageShell";
import Section from "../../ui/Section";
import { useAuth } from "../../auth/AuthContext";

/**
 * L'identité est vérifiée principalement par SMS (OTP) à l'inscription.
 * L'email est optionnel et sert uniquement de canal de contact secondaire —
 * cette page explique ce choix plutôt que de bloquer l'accès au compte.
 */
export default function VerifyEmail() {
  const { user } = useAuth();

  return (
    <PageShell
      title="Vérification de compte"
      subtitle="Ton identité est vérifiée par SMS, l'email est optionnel."
      actions={[{ label: "Retour accueil", href: "/", variant: "secondary" }]}
    >
      <div className="grid gap-6 lg:grid-cols-2">
        <Section title="Comment ton compte est-il vérifié ?">
          <p className="text-sm text-gray-700">
            MobiBenin vérifie ton numéro de téléphone par SMS (OTP) à l'inscription — c'est cette étape qui
            active ton compte. L'email {user?.email ? <>(<span className="font-semibold">{user.email}</span>)</> : ""} reste
            optionnel et sert seulement à te contacter en complément du SMS.
          </p>
        </Section>
        <Section title="Besoin d'aide ?">
          <p className="text-sm text-gray-600">
            Si tu n'as pas reçu ton code par SMS lors de l'inscription, contacte le support.
          </p>
          <Link className="mt-3 inline-block underline text-sm" to="/help">Centre d'aide</Link>
        </Section>
      </div>
    </PageShell>
  );
}

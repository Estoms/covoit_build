import { Link } from "react-router-dom";
import PageShell from "../../ui/PageShell";
import Section from "../../ui/Section";

export default function SwitchRole() {
  return (
    <PageShell title="Changer de vue" subtitle="Ton compte est à la fois passager et conducteur">
      <div className="grid gap-4 sm:grid-cols-2">
        <Link to="/p"><Section title="Vue passager"><p className="text-sm text-gray-600">Rechercher un trajet, gérer mes réservations.</p></Section></Link>
        <Link to="/d"><Section title="Vue conducteur"><p className="text-sm text-gray-600">Publier des trajets, gérer mes passagers et mes gains.</p></Section></Link>
      </div>
    </PageShell>
  );
}

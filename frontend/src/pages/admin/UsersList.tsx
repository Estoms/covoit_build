import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import PageShell from "../../ui/PageShell";
import Section from "../../ui/Section";
import { adminListUsers } from "../../api/admin";
import type { PublicUser } from "../../types";

export default function UsersList() {
  const [role, setRole] = useState<string>("");
  const [items, setItems] = useState<PublicUser[]>([]);

  useEffect(() => {
    adminListUsers(role || undefined).then((r) => setItems(r.items));
  }, [role]);

  return (
    <PageShell title="Utilisateurs" nextApi={["GET /admin/users"]}>
      <Section title="Filtrer" action={
        <select className="rounded-xl border px-3 py-1.5 text-sm bg-white" value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="">Tous les rôles</option>
          <option value="PASSENGER">Passager</option>
          <option value="DRIVER">Conducteur</option>
          <option value="ADMIN">Admin</option>
          <option value="SUPPORT">Support</option>
        </select>
      }>
        <div className="divide-y">
          {items.map((u) => (
            <Link key={u.id} to={`/admin/users/${u.id}`} className="flex items-center justify-between py-2 text-sm hover:bg-gray-50 px-1 rounded">
              <div>
                <div className="font-medium">{u.fullName}</div>
                <div className="text-gray-500 text-xs">{u.phone}</div>
              </div>
              <div className="text-xs text-gray-500">{u.roles.join(", ")}</div>
            </Link>
          ))}
        </div>
      </Section>
    </PageShell>
  );
}

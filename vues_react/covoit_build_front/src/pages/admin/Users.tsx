import PageShell from "../../ui/PageShell";
import Section from "../../ui/Section";

type U = { id: string; name: string; role: string; status: string };

export default function AdminUsers() {
  const users: U[] = [
    { id: "U-001", name: "Awa K.", role: "PASSENGER", status: "Actif" },
    { id: "U-002", name: "Kossi D.", role: "DRIVER", status: "Actif" },
    { id: "U-003", name: "Mariam S.", role: "PASSENGER+DRIVER", status: "En vérification" },
  ];

  return (
    <PageShell
      title="Utilisateurs"
      subtitle="Liste et actions administrateur (mock)."
      actions={[{ label: "Dashboard", href: "/admin", variant: "secondary" }]}
    >
      <Section title="Liste">
        <div className="overflow-auto">
          <table className="min-w-full text-sm">
            <thead className="text-left text-gray-600">
              <tr className="[&>th]:py-2 [&>th]:pr-4">
                <th>ID</th>
                <th>Nom</th>
                <th>Rôle</th>
                <th>Statut</th>
              </tr>
            </thead>
            <tbody className="text-gray-800">
              {users.map((u) => (
                <tr key={u.id} className="border-t [&>td]:py-2 [&>td]:pr-4">
                  <td className="font-semibold">{u.id}</td>
                  <td>{u.name}</td>
                  <td>{u.role}</td>
                  <td>{u.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>
    </PageShell>
  );
}

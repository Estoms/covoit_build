import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import Logo from "../ui/Logo";

type NavItem = { label: string; to: string };

function cx(active: boolean) {
  return active
    ? "rounded-xl bg-brand-green-600 text-white px-3 py-2 font-semibold"
    : "rounded-xl hover:bg-brand-green-50 px-3 py-2 text-gray-800";
}

export default function AppLayout() {
  const { user, logout } = useAuth();

  const roles = user?.roles ?? [];
  const isMixed = roles.includes("PASSENGER_DRIVER");
  const isPassenger = roles.includes("PASSENGER") || isMixed;
  const isDriver = roles.includes("DRIVER") || isMixed;
  const isAdmin = roles.includes("ADMIN");
  const isSupport = roles.includes("SUPPORT");

  const items: NavItem[] = [];

  if (isMixed) {
    items.push({ label: "Tableau de bord", to: "/m" }, { label: "Historique global", to: "/m/history" }, { label: "Mes statistiques", to: "/m/stats" });
  }

  if (isPassenger) {
    items.push(
      { label: isMixed ? "Espace passager" : "Tableau de bord", to: "/p" },
      { label: "Rechercher", to: "/search" },
      { label: "Mes réservations", to: "/p/bookings/upcoming" },
      { label: "Paiements", to: "/p/payments/history" },
      { label: "Fidélité", to: "/p/loyalty" }
    );
  }

  if (isDriver) {
    items.push(
      { label: isMixed ? "Espace conducteur" : "Tableau de bord", to: "/d" },
      { label: "Publier un trajet", to: "/d/trips/publish" },
      { label: "Mes trajets", to: "/d/trips" },
      { label: "Gains", to: "/d/earnings" },
      { label: "Récompenses", to: "/d/rewards" }
    );
  }

  if (isPassenger || isDriver) {
    items.push({ label: "Messagerie", to: "/messages" }, { label: "Vérifications", to: "/profile/verifications" }, { label: "Notifications", to: "/notifications" });
  }

  if (isAdmin) {
    items.push(
      { label: "Admin", to: "/admin" },
      { label: "Utilisateurs", to: "/admin/users" },
      { label: "Modération", to: "/admin/user-moderation" },
      { label: "Trajets", to: "/admin/trips" },
      { label: "Finances", to: "/admin/finance-reports" },
      { label: "Litiges", to: "/admin/disputes" },
      { label: "Statistiques", to: "/admin/stats" }
    );
  }

  if (isSupport) {
    items.push({ label: "Support", to: "/support" }, { label: "Tickets", to: "/support/tickets" }, { label: "Médiation", to: "/support/mediation" });
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between gap-3">
          <Logo />
          <div className="flex items-center gap-3">
            <div className="text-sm text-gray-700">
              <span className="font-semibold">{user?.fullName || "Utilisateur"}</span>
              <span className="text-gray-400"> • </span>
              <span className="text-gray-600">{roles.join(", ")}</span>
            </div>
            <button onClick={() => logout()} className="rounded-xl border border-gray-300 px-3 py-2 text-sm font-medium hover:bg-gray-50">
              Déconnexion
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-6 grid gap-6 md:grid-cols-[260px_1fr]">
        <aside className="rounded-2xl border border-gray-200 bg-white p-3 h-fit">
          <div className="text-xs font-semibold text-gray-500 px-2 pb-2">MENU</div>
          <nav className="grid gap-1">
            {items.map((it) => (
              <NavLink key={it.to} to={it.to} end={it.to === "/p" || it.to === "/d" || it.to === "/m"} className={({ isActive }) => cx(isActive)}>
                {it.label}
              </NavLink>
            ))}
          </nav>
        </aside>

        <main className="min-w-0">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

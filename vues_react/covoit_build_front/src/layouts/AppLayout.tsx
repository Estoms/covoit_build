import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

type NavItem = { label: string; to: string };

function cx(active: boolean) {
  return active
    ? "rounded-xl bg-gray-900 text-white px-3 py-2 font-semibold"
    : "rounded-xl hover:bg-gray-50 px-3 py-2 text-gray-800";
}

export default function AppLayout() {
  const { user, logout } = useAuth();

  const roles = user?.roles ?? [];
  const isPassenger = roles.includes("PASSENGER");
  const isDriver = roles.includes("DRIVER");
  const isAdmin = roles.includes("ADMIN");
  const isSupport = roles.includes("SUPPORT");

  const items: NavItem[] = [];

  // Menu Passager
  if (isPassenger) {
    items.push(
      { label: "Dashboard", to: "/p" },
      { label: "Rechercher", to: "/search" },
      { label: "Mes réservations", to: "/p/bookings/upcoming" },
      { label: "Messages", to: "/p/messages" },
      { label: "Paiements", to: "/p/payments/history" },
      { label: "Vérifications", to: "/profile/verifications" }
    );
  }

  // Menu Conducteur
  if (isDriver) {
    items.push(
      { label: "Dashboard conducteur", to: "/d" },
      { label: "Publier un trajet", to: "/d/trips/publish" },
      { label: "Mes trajets", to: "/d/trips" },
      { label: "Demandes", to: "/d/requests" },
      { label: "Gains", to: "/d/earnings" },
      { label: "Vérifications", to: "/profile/verifications" }
    );
  }

  // Menu Admin
  if (isAdmin) {
    items.push(
      { label: "Admin", to: "/admin" },
      { label: "Utilisateurs", to: "/admin/users" },
      { label: "Trajets", to: "/admin/trips" },
      { label: "Signalements", to: "/admin/reports" }
    );
  }

  // Menu Support
  if (isSupport) {
    items.push(
      { label: "Support", to: "/support" },
      { label: "Tickets", to: "/support/tickets" },
      { label: "Médiation", to: "/support/mediation" }
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top bar */}
      <div className="border-b bg-white">
        <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between gap-3">
          <div className="font-extrabold">CovoitBuild</div>
          <div className="flex items-center gap-3">
            <div className="text-sm text-gray-700">
              <span className="font-semibold">{user?.fullName || "Utilisateur"}</span>
              <span className="text-gray-400"> • </span>
              <span className="text-gray-600">{roles.join(", ")}</span>
            </div>
            <button
              onClick={logout}
              className="rounded-xl border px-3 py-2 text-sm font-medium hover:bg-gray-50"
            >
              Déconnexion
            </button>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="mx-auto max-w-6xl px-4 py-6 grid gap-6 md:grid-cols-[260px_1fr]">
        {/* Menu */}
        <aside className="rounded-2xl border bg-white p-3 h-fit">
          <div className="text-xs font-semibold text-gray-500 px-2 pb-2">
            MENU
          </div>
          <nav className="grid gap-1">
            {items.map((it) => (
              <NavLink key={it.to} to={it.to} className={({ isActive }) => cx(isActive)}>
                {it.label}
              </NavLink>
            ))}
          </nav>
        </aside>

        {/* Page */}
        <main className="min-w-0">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

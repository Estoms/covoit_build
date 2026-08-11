import { Outlet, Link } from "react-router-dom";
import Logo from "../ui/Logo";
import { useAuth } from "../auth/AuthContext";

export default function PublicLayout() {
  const { isAuthenticated, user } = useAuth();

  function homeLink() {
    if (!isAuthenticated) return "/";
    const roles = user?.roles ?? [];
    if (roles.includes("PASSENGER_DRIVER")) return "/m";
    if (roles.includes("ADMIN")) return "/admin";
    if (roles.includes("SUPPORT")) return "/support";
    if (roles.includes("DRIVER")) return "/d";
    return "/p";
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b border-gray-200 bg-white">
        <nav className="mx-auto max-w-6xl px-4 py-3 flex flex-wrap items-center justify-between gap-3">
          <Link to="/"><Logo /></Link>
          <div className="flex flex-wrap items-center gap-4 text-sm font-medium text-gray-700">
            <Link to="/search" className="hover:text-brand-green-700">Rechercher</Link>
            <Link to="/how-it-works" className="hover:text-brand-green-700">Comment ça marche</Link>
            <Link to="/help" className="hover:text-brand-green-700">Aide</Link>
            {isAuthenticated ? (
              <Link to={homeLink()} className="rounded-xl bg-brand-green-600 px-4 py-2 text-white font-semibold hover:bg-brand-green-700">
                Mon espace
              </Link>
            ) : (
              <>
                <Link to="/login" className="hover:text-brand-green-700">Connexion</Link>
                <Link to="/register" className="rounded-xl bg-brand-green-600 px-4 py-2 text-white font-semibold hover:bg-brand-green-700">
                  Inscription
                </Link>
              </>
            )}
          </div>
        </nav>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-6">
        <Outlet />
      </main>
    </div>
  );
}

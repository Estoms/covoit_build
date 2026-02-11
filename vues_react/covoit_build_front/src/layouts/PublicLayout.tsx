import React from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";

export default function PublicLayout() {
  const loc = useLocation();
  const nav = useNavigate();
  const showBack = loc.pathname !== "/";

  return (
    <>
      <header style={{ padding: 16, borderBottom: "1px solid #eee" }}>
        <nav style={{ display: "flex", gap: 16 }}>
          <Link to="/">Accueil</Link>
          <Link to="/search">Recherche</Link>
          <Link to="/login">Connexion</Link>
          <Link to="/register">Inscription</Link>
        </nav>
      </header>

      <main style={{ padding: 24 }}>
        {showBack && (
          <div style={{ marginBottom: 16, display: "flex", gap: 12, alignItems: "center" }}>
            <button
              onClick={() => nav(-1)}
              style={{ padding: "8px 12px", border: "1px solid #ddd", borderRadius: 12, background: "white" }}
            >
              ← Retour
            </button>
            <Link to="/" style={{ padding: "8px 12px", border: "1px solid #ddd", borderRadius: 12, background: "white" }}>
              Accueil
            </Link>
          </div>
        )}
        <Outlet />
      </main>
    </>
  );
}

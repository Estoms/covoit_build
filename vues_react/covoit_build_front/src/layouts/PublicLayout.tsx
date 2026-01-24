import React from "react";
import { Outlet, Link } from "react-router-dom";

export default function PublicLayout() {
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
        <Outlet />
      </main>
    </>
  );
}

import React from "react";
import { Outlet, Link } from "react-router-dom";

export default function AppLayout() {
  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <aside style={{ width: 260, padding: 16, borderRight: "1px solid #eee" }}>
        <h3>Espace utilisateur</h3>

        <nav style={{ display: "grid", gap: 8 }}>
          <Link to="/p">Passager</Link>
          <Link to="/d">Conducteur</Link>
          <Link to="/m">Mixte</Link>
          <Link to="/admin">Admin</Link>
          <Link to="/support">Support</Link>
        </nav>
      </aside>

      <main style={{ flex: 1, padding: 24 }}>
        <Outlet />
      </main>
    </div>
  );
}

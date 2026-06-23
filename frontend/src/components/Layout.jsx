// src/components/Layout.jsx — menu latéral + barre du haut
import { Link, useNavigate, useLocation } from "react-router-dom";

function Layout({ children, titre }) {
  const navigate = useNavigate();
  const location = useLocation();
  const utilisateur = JSON.parse(localStorage.getItem("utilisateur") || "{}");

  const seDeconnecter = () => {
    localStorage.clear();
    navigate("/login");
  };

  const menu = [
    { chemin: "/dashboard", label: "Tableau de bord" },
    { chemin: "/projets", label: "Projets" },
    { chemin: "/chantiers", label: "Chantiers" },
    { chemin: "/taches", label: "Tâches" },
  ];

  return (
    <div style={{ display: "flex", height: "100vh", fontFamily: "sans-serif" }}>
      {/* Menu latéral */}
      <aside style={{ width: 220, background: "#1E3A5F", color: "#cdd8e6", padding: 20 }}>
        <div style={{ fontSize: 20, fontWeight: "bold", color: "white", marginBottom: 30 }}>
          <span style={{ background: "#E8841A", padding: "4px 9px", borderRadius: 8, marginRight: 8 }}>B</span>
          BâtiSuivi
        </div>
        {menu.map((item) => (
          <Link
            key={item.chemin}
            to={item.chemin}
            style={{
              display: "block", padding: "10px 12px", borderRadius: 8, marginBottom: 4,
              textDecoration: "none", color: location.pathname === item.chemin ? "white" : "#aebccd",
              background: location.pathname === item.chemin ? "rgba(255,255,255,0.12)" : "transparent",
            }}
          >
            {item.label}
          </Link>
        ))}
      </aside>

      {/* Zone principale */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", background: "#F7F9FC" }}>
        {/* Barre du haut */}
        <header style={{ height: 60, background: "white", borderBottom: "1px solid #e3e8ef", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 24px" }}>
          <h2 style={{ fontSize: 17 }}>{titre}</h2>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <span style={{ fontSize: 14, color: "#6a7585" }}>{utilisateur.prenom} {utilisateur.nom} · {utilisateur.role}</span>
            <button onClick={seDeconnecter} style={{ padding: "7px 14px", background: "#E8841A", color: "white", border: "none", borderRadius: 6, cursor: "pointer" }}>
              Déconnexion
            </button>
          </div>
        </header>

        {/* Contenu de la page */}
        <main style={{ padding: 24, overflow: "auto" }}>{children}</main>
      </div>
    </div>
  );
}

export default Layout;
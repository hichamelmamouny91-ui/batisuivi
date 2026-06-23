// src/pages/Dashboard.jsx — tableau de bord
import { useEffect, useState } from "react";
import api from "../api";
import Layout from "../components/Layout";

function Dashboard() {
  const [projets, setProjets] = useState([]);

  // Au chargement de la page, on récupère les projets depuis le back-end
  useEffect(() => {
    const token = localStorage.getItem("token");
    api.get("/projets", { headers: { Authorization: `Bearer ${token}` } })
      .then((reponse) => setProjets(reponse.data))
      .catch((err) => console.error(err));
  }, []);

  // Quelques statistiques calculées
  const enCours = projets.filter((p) => p.statut === "En cours").length;
  const termines = projets.filter((p) => p.statut === "Termine").length;

  const carte = { background: "white", border: "1px solid #e3e8ef", borderRadius: 12, padding: 16, flex: 1 };
  const valeur = { fontSize: 28, fontWeight: "bold", color: "#1E3A5F", marginTop: 6 };

  return (
    <Layout titre="Tableau de bord">
      {/* Cartes de statistiques */}
      <div style={{ display: "flex", gap: 16, marginBottom: 20 }}>
        <div style={carte}><div style={{ fontSize: 12, color: "#6a7585" }}>Total projets</div><div style={valeur}>{projets.length}</div></div>
        <div style={carte}><div style={{ fontSize: 12, color: "#6a7585" }}>En cours</div><div style={valeur}>{enCours}</div></div>
        <div style={carte}><div style={{ fontSize: 12, color: "#6a7585" }}>Terminés</div><div style={valeur}>{termines}</div></div>
      </div>

      {/* Liste des projets récents */}
      <div style={{ background: "white", border: "1px solid #e3e8ef", borderRadius: 12, padding: 18 }}>
        <h3 style={{ fontSize: 14, marginBottom: 14 }}>Projets récents</h3>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
          <thead>
            <tr style={{ color: "#6a7585", textAlign: "left" }}>
              <th style={{ padding: 8, borderBottom: "1px solid #e3e8ef" }}>Code</th>
              <th style={{ padding: 8, borderBottom: "1px solid #e3e8ef" }}>Nom</th>
              <th style={{ padding: 8, borderBottom: "1px solid #e3e8ef" }}>Client</th>
              <th style={{ padding: 8, borderBottom: "1px solid #e3e8ef" }}>Statut</th>
            </tr>
          </thead>
          <tbody>
            {projets.map((p) => (
              <tr key={p.idProjet}>
                <td style={{ padding: 10, borderBottom: "1px solid #eef2f7" }}>{p.code}</td>
                <td style={{ padding: 10, borderBottom: "1px solid #eef2f7" }}>{p.nom}</td>
                <td style={{ padding: 10, borderBottom: "1px solid #eef2f7" }}>{p.nomClient}</td>
                <td style={{ padding: 10, borderBottom: "1px solid #eef2f7" }}>{p.statut}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Layout>
  );
}

export default Dashboard;
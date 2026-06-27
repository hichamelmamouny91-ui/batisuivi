// src/pages/Dashboard.jsx — tableau de bord enrichi
import { useEffect, useState } from "react";
import api from "../api";
import Layout from "../components/Layout";
import Badge from "../components/Badge";

function Dashboard() {
  const [projets, setProjets] = useState([]);
  const [chantiers, setChantiers] = useState([]);
  const [taches, setTaches] = useState([]);

  const token = localStorage.getItem("token");
  const config = { headers: { Authorization: `Bearer ${token}` } };

  useEffect(() => {
    api.get("/projets", config).then((r) => setProjets(r.data)).catch((e) => console.error(e));
    api.get("/chantiers", config).then((r) => setChantiers(r.data)).catch((e) => console.error(e));
    api.get("/taches", config).then((r) => setTaches(r.data)).catch((e) => console.error(e));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Statistiques calculées
  const projetsEnCours = projets.filter((p) => p.avancementCalcule > 0 && p.avancementCalcule < 100).length;
  const tachesEnCours = taches.filter((t) => t.statut === "En cours").length;
  const avancementMoyen = chantiers.length
    ? Math.round(chantiers.reduce((s, ch) => s + ch.avancementCalcule, 0) / chantiers.length)
    : 0;

  // Détermine le statut d'un projet à partir de son avancement calculé
  const statutProjet = (p) =>
    p.avancementCalcule >= 100 ? "Termine"
    : p.avancementCalcule > 0 ? "En cours"
    : "Planifie";

  const stats = [
    { label: "Projets", valeur: projets.length, sousLabel: `${projetsEnCours} en cours`, couleur: "#2C5282" },
    { label: "Chantiers", valeur: chantiers.length, sousLabel: "actifs", couleur: "#E8841A" },
    { label: "Tâches", valeur: taches.length, sousLabel: `${tachesEnCours} en cours`, couleur: "#2E9E6B" },
    { label: "Avancement moyen", valeur: `${avancementMoyen}%`, sousLabel: "des chantiers", couleur: "#8E6FB8" },
  ];

  return (
    <Layout titre="Tableau de bord">
      {/* Cartes de statistiques */}
      <div style={{ display: "flex", gap: 16, marginBottom: 20, flexWrap: "wrap" }}>
        {stats.map((s) => (
          <div key={s.label} style={{ flex: 1, minWidth: 180, background: "white", border: "1px solid #e3e8ef", borderRadius: 12, padding: 18, borderTop: `3px solid ${s.couleur}` }}>
            <div style={{ fontSize: 12, color: "#6a7585" }}>{s.label}</div>
            <div style={{ fontSize: 30, fontWeight: "bold", color: s.couleur, margin: "6px 0 2px" }}>{s.valeur}</div>
            <div style={{ fontSize: 11, color: "#9aa5b5" }}>{s.sousLabel}</div>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 16 }}>
        {/* Projets récents */}
        <div style={{ background: "white", border: "1px solid #e3e8ef", borderRadius: 12, padding: 18 }}>
          <h3 style={{ fontSize: 14, marginTop: 0, marginBottom: 14 }}>Projets récents</h3>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead>
              <tr style={{ color: "#6a7585", textAlign: "left" }}>
                <th style={{ padding: 8, borderBottom: "1px solid #e3e8ef" }}>Code</th>
                <th style={{ padding: 8, borderBottom: "1px solid #e3e8ef" }}>Nom</th>
                <th style={{ padding: 8, borderBottom: "1px solid #e3e8ef" }}>Avancement</th>
                <th style={{ padding: 8, borderBottom: "1px solid #e3e8ef" }}>Statut</th>
              </tr>
            </thead>
            <tbody>
              {projets.map((p) => (
                <tr key={p.idProjet}>
                  <td style={{ padding: 10, borderBottom: "1px solid #eef2f7" }}>{p.code}</td>
                  <td style={{ padding: 10, borderBottom: "1px solid #eef2f7" }}>{p.nom}</td>
                  <td style={{ padding: 10, borderBottom: "1px solid #eef2f7" }}>{p.avancementCalcule}%</td>
                  <td style={{ padding: 10, borderBottom: "1px solid #eef2f7" }}><Badge statut={statutProjet(p)} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Avancement des chantiers */}
        <div style={{ background: "white", border: "1px solid #e3e8ef", borderRadius: 12, padding: 18 }}>
          <h3 style={{ fontSize: 14, marginTop: 0, marginBottom: 14 }}>Avancement des chantiers</h3>
          {chantiers.map((ch) => (
            <div key={ch.idChantier} style={{ marginBottom: 14 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 4 }}>
                <span>{ch.nom}</span>
                <strong>{ch.avancementCalcule}%</strong>
              </div>
              <div style={{ height: 7, background: "#EAEEF3", borderRadius: 20, overflow: "hidden" }}>
                <div style={{ width: `${ch.avancementCalcule}%`, height: "100%", background: "#E8841A", borderRadius: 20 }}></div>
              </div>
            </div>
          ))}
          {chantiers.length === 0 && <p style={{ fontSize: 13, color: "#9aa5b5" }}>Aucun chantier.</p>}
        </div>
      </div>
    </Layout>
  );
}

export default Dashboard;
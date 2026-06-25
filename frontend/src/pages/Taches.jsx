// src/pages/Taches.jsx — gestion des tâches (vue Kanban)
import { useEffect, useState } from "react";
import api from "../api";
import Layout from "../components/Layout";
import Badge from "../components/Badge";

function Taches() {
  const [taches, setTaches] = useState([]);
  const [afficherFormulaire, setAfficherFormulaire] = useState(false);
  const [form, setForm] = useState({
    titre: "", description: "", dateEcheance: "",
    statut: "A faire", idChantier: 1, idUser: 4,
  });

  const token = localStorage.getItem("token");
  const config = { headers: { Authorization: `Bearer ${token}` } };

  const chargerTaches = () => {
    api.get("/taches", config)
      .then((reponse) => setTaches(reponse.data))
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    chargerTaches();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Créer une tâche
  const creerTache = async (e) => {
    e.preventDefault();
    try {
      await api.post("/taches", form, config);
      setAfficherFormulaire(false);
      setForm({ titre: "", description: "", dateEcheance: "", statut: "A faire", idChantier: 1, idUser: 4 });
      chargerTaches();
    } catch (err) {
      console.error(err);
      alert("Erreur lors de la création de la tâche");
    }
  };

  // Déplacer une tâche vers un autre statut (colonne)
  const changerStatut = async (idTache, nouveauStatut) => {
    try {
      await api.patch(`/taches/${idTache}/statut`, { statut: nouveauStatut }, config);
      chargerTaches();
    } catch (err) {
      console.error(err);
    }
  };

  const supprimerTache = async (id) => {
    if (!window.confirm("Supprimer cette tâche ?")) return;
    try {
      await api.delete(`/taches/${id}`, config);
      chargerTaches();
    } catch (err) {
      console.error(err);
    }
  };

  // Les 3 colonnes du Kanban
  const colonnes = [
    { cle: "A faire", titre: "À faire", couleur: "#6a7585" },
    { cle: "En cours", titre: "En cours", couleur: "#E8841A" },
    { cle: "Termine", titre: "Terminé", couleur: "#2E9E6B" },
  ];

  const champStyle = { width: "100%", padding: 9, margin: "4px 0 12px", boxSizing: "border-box", border: "1px solid #ddd", borderRadius: 6 };

  return (
    <Layout titre="Tâches">
      <button
        onClick={() => setAfficherFormulaire(!afficherFormulaire)}
        style={{ marginBottom: 16, padding: "9px 16px", background: "#E8841A", color: "white", border: "none", borderRadius: 6, cursor: "pointer" }}
      >
        {afficherFormulaire ? "Annuler" : "+ Nouvelle tâche"}
      </button>

      {/* Formulaire de création */}
      {afficherFormulaire && (
        <form onSubmit={creerTache} style={{ background: "white", border: "1px solid #e3e8ef", borderRadius: 12, padding: 18, marginBottom: 20, maxWidth: 500 }}>
          <label>Titre</label>
          <input name="titre" value={form.titre} onChange={handleChange} style={champStyle} required />
          <label>Description</label>
          <input name="description" value={form.description} onChange={handleChange} style={champStyle} />
          <label>Date d'échéance</label>
          <input type="date" name="dateEcheance" value={form.dateEcheance} onChange={handleChange} style={champStyle} />
          <label>ID du chantier</label>
          <input type="number" name="idChantier" value={form.idChantier} onChange={handleChange} style={champStyle} required />
          <label>ID de l'utilisateur affecté</label>
          <input type="number" name="idUser" value={form.idUser} onChange={handleChange} style={champStyle} />
          <button type="submit" style={{ padding: "10px 16px", background: "#1E3A5F", color: "white", border: "none", borderRadius: 6, cursor: "pointer" }}>
            Enregistrer
          </button>
        </form>
      )}

      {/* Les 3 colonnes Kanban */}
      <div style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
        {colonnes.map((col) => (
          <div key={col.cle} style={{ flex: 1, background: "#eef1f5", borderRadius: 12, padding: 12, minHeight: 300 }}>
            <h3 style={{ fontSize: 13, textTransform: "uppercase", color: col.couleur, marginBottom: 12 }}>
              {col.titre} ({taches.filter((t) => t.statut === col.cle).length})
            </h3>

            {taches.filter((t) => t.statut === col.cle).map((t) => (
              <div key={t.idTache} style={{ background: "white", border: "1px solid #e3e8ef", borderRadius: 9, padding: 11, marginBottom: 9 }}>
                <div style={{ marginBottom: 6 }}><Badge statut={t.statut} /></div>
                <div style={{ fontSize: 11, color: "#6a7585", marginBottom: 8 }}>
                  {t.nomChantier} {t.prenomUser ? `· ${t.prenomUser} ${t.nomUser}` : ""}
                </div>

                {/* Boutons pour déplacer la tâche entre colonnes */}
                <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                  {col.cle !== "A faire" && (
                    <button onClick={() => changerStatut(t.idTache, "A faire")} style={miniBtn}>← À faire</button>
                  )}
                  {col.cle !== "En cours" && (
                    <button onClick={() => changerStatut(t.idTache, "En cours")} style={miniBtn}>En cours</button>
                  )}
                  {col.cle !== "Termine" && (
                    <button onClick={() => changerStatut(t.idTache, "Termine")} style={miniBtn}>Terminé →</button>
                  )}
                  <button onClick={() => supprimerTache(t.idTache)} style={{ ...miniBtn, color: "#D9534F", borderColor: "#D9534F" }}>✕</button>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </Layout>
  );
}

// Style des petits boutons
const miniBtn = {
  fontSize: 11, padding: "3px 7px", background: "white",
  border: "1px solid #cbd3df", borderRadius: 5, cursor: "pointer", color: "#1E3A5F",
};

export default Taches;
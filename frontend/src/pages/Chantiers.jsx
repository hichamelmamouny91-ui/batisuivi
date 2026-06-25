// src/pages/Chantiers.jsx — gestion et suivi des chantiers
import { useEffect, useState } from "react";
import api from "../api";
import Layout from "../components/Layout";
import Badge from "../components/Badge";
import { aLeRole } from "../auth";

function Chantiers() {
  const [chantiers, setChantiers] = useState([]);
  const [afficherFormulaire, setAfficherFormulaire] = useState(false);
  const [form, setForm] = useState({
    nom: "", localisation: "", dateDebut: "", dateFin: "",
    avancement: 0, statut: "Planifie", idProjet: 1,
  });

  const token = localStorage.getItem("token");
  const config = { headers: { Authorization: `Bearer ${token}` } };

  const chargerChantiers = () => {
    api.get("/chantiers", config)
      .then((reponse) => setChantiers(reponse.data))
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    chargerChantiers();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Créer un chantier
  const creerChantier = async (e) => {
    e.preventDefault();
    try {
      await api.post("/chantiers", form, config);
      setAfficherFormulaire(false);
      setForm({ nom: "", localisation: "", dateDebut: "", dateFin: "", avancement: 0, statut: "Planifie", idProjet: 1 });
      chargerChantiers();
    } catch (err) {
      console.error(err);
      alert("Erreur lors de la création du chantier");
    }
  };

// Pendant qu'on glisse : on met à jour l'affichage localement (fluide, sans appel serveur)
  const glisserAvancement = (idChantier, nouvelAvancement) => {
    setChantiers((liste) =>
      liste.map((ch) =>
        ch.idChantier === idChantier ? { ...ch, avancement: Number(nouvelAvancement) } : ch
      )
    );
  };

  // Quand on relâche : on enregistre dans la base de données
  const enregistrerAvancement = async (chantier) => {
    try {
      await api.patch(`/chantiers/${chantier.idChantier}/avancement`, { avancement: chantier.avancement }, config);
    } catch (err) {
      console.error(err);
    }
  };

  const supprimerChantier = async (id) => {
    if (!window.confirm("Voulez-vous vraiment supprimer ce chantier ?")) return;
    try {
      await api.delete(`/chantiers/${id}`, config);
      chargerChantiers();
    } catch (err) {
      console.error(err);
    }
  };

  const champStyle = { width: "100%", padding: 9, margin: "4px 0 12px", boxSizing: "border-box", border: "1px solid #ddd", borderRadius: 6 };

  return (
    <Layout titre="Chantiers">
            {aLeRole("Administrateur", "Chef de projet") && (
        <button
          onClick={() => setAfficherFormulaire(!afficherFormulaire)}
          style={{ marginBottom: 16, padding: "9px 16px", background: "#E8841A", color: "white", border: "none", borderRadius: 6, cursor: "pointer" }}
        >
          {afficherFormulaire ? "Annuler" : "+ Nouveau chantier"}
        </button>
      )}

      {/* Formulaire de création */}
      {afficherFormulaire && (
        <form onSubmit={creerChantier} style={{ background: "white", border: "1px solid #e3e8ef", borderRadius: 12, padding: 18, marginBottom: 20, maxWidth: 500 }}>
          <label>Nom du chantier</label>
          <input name="nom" value={form.nom} onChange={handleChange} style={champStyle} required />
          <label>Localisation</label>
          <input name="localisation" value={form.localisation} onChange={handleChange} style={champStyle} />
          <label>Date de début</label>
          <input type="date" name="dateDebut" value={form.dateDebut} onChange={handleChange} style={champStyle} />
          <label>Avancement (%)</label>
          <input type="number" name="avancement" min="0" max="100" value={form.avancement} onChange={handleChange} style={champStyle} />
          <label>Statut</label>
          <select name="statut" value={form.statut} onChange={handleChange} style={champStyle}>
            <option value="Planifie">Planifié</option>
            <option value="En cours">En cours</option>
            <option value="Termine">Terminé</option>
            <option value="Suspendu">Suspendu</option>
          </select>
          <label>ID du projet associé</label>
          <input type="number" name="idProjet" value={form.idProjet} onChange={handleChange} style={champStyle} required />
          <button type="submit" style={{ padding: "10px 16px", background: "#1E3A5F", color: "white", border: "none", borderRadius: 6, cursor: "pointer" }}>
            Enregistrer
          </button>
        </form>
      )}

      {/* Liste des chantiers sous forme de cartes avec barre d'avancement */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 16 }}>
        {chantiers.map((ch) => (
          <div key={ch.idChantier} style={{ background: "white", border: "1px solid #e3e8ef", borderRadius: 12, padding: 18 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <h3 style={{ fontSize: 15, margin: 0 }}>{ch.nom}</h3>
                <p style={{ fontSize: 12, color: "#6a7585", margin: "4px 0" }}>{ch.localisation} · Projet : {ch.nomProjet}</p>
              </div>
                <Badge statut={ch.statut} />
            </div>

            {/* Barre d'avancement */}
            <div style={{ marginTop: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 4 }}>
                <span>Avancement</span>
                <strong>{ch.avancement}%</strong>
              </div>
              <div style={{ height: 8, background: "#EAEEF3", borderRadius: 20, overflow: "hidden" }}>
                <div style={{ width: `${ch.avancement}%`, height: "100%", background: "#E8841A", borderRadius: 20 }}></div>
              </div>
            </div>

            {/* Mise à jour rapide de l'avancement */}
            <div style={{ marginTop: 12 }}>
              <input
                type="range" min="0" max="100" value={ch.avancement}
                onChange={(e) => glisserAvancement(ch.idChantier, e.target.value)}
                onMouseUp={() => enregistrerAvancement(ch)}
                onTouchEnd={() => enregistrerAvancement(ch)}
                style={{ width: "100%" }}
              />
            </div>

            {aLeRole("Administrateur") && (
              <button
                onClick={() => supprimerChantier(ch.idChantier)}
                style={{ marginTop: 10, padding: "5px 10px", background: "#D9534F", color: "white", border: "none", borderRadius: 5, cursor: "pointer", fontSize: 12 }}
              >
                Supprimer
              </button>
            )}
          </div>
        ))}
      </div>
    </Layout>
  );
}

export default Chantiers;
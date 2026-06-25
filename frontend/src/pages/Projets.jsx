// src/pages/Projets.jsx — gestion des projets (CRUD complet : créer, modifier, supprimer)
import { useEffect, useState } from "react";
import api from "../api";
import Layout from "../components/Layout";
import Badge from "../components/Badge";

function Projets() {
  const [projets, setProjets] = useState([]);
  const [afficherFormulaire, setAfficherFormulaire] = useState(false);
  const [idEnModification, setIdEnModification] = useState(null); // null = création, sinon = modification

  const formVide = {
    code: "", nom: "", description: "", dateDebut: "", dateFin: "",
    statut: "Planifie", idClient: 1, idChef: 2,
  };
  const [form, setForm] = useState(formVide);

  const token = localStorage.getItem("token");
  const config = { headers: { Authorization: `Bearer ${token}` } };

  const chargerProjets = () => {
    api.get("/projets", config)
      .then((reponse) => setProjets(reponse.data))
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    chargerProjets();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Ouvrir le formulaire en mode CRÉATION
  const ouvrirCreation = () => {
    setForm(formVide);
    setIdEnModification(null);
    setAfficherFormulaire(true);
  };

  // Ouvrir le formulaire en mode MODIFICATION (pré-rempli)
  const ouvrirModification = (projet) => {
    setForm({
      code: projet.code || "",
      nom: projet.nom || "",
      description: projet.description || "",
      dateDebut: projet.dateDebut ? projet.dateDebut.substring(0, 10) : "",
      dateFin: projet.dateFin ? projet.dateFin.substring(0, 10) : "",
      statut: projet.statut || "Planifie",
      idClient: projet.idClient || 1,
      idChef: projet.idChef || 2,
    });
    setIdEnModification(projet.idProjet);
    setAfficherFormulaire(true);
  };

  // Enregistrer : crée OU modifie selon le mode
  const enregistrer = async (e) => {
    e.preventDefault();
    try {
      if (idEnModification) {
        // Mode modification
        await api.put(`/projets/${idEnModification}`, form, config);
      } else {
        // Mode création
        await api.post("/projets", form, config);
      }
      setAfficherFormulaire(false);
      setForm(formVide);
      setIdEnModification(null);
      chargerProjets();
    } catch (err) {
      console.error(err);
      alert("Erreur lors de l'enregistrement du projet");
    }
  };

  const supprimerProjet = async (id) => {
    if (!window.confirm("Voulez-vous vraiment supprimer ce projet ?")) return;
    try {
      await api.delete(`/projets/${id}`, config);
      chargerProjets();
    } catch (err) {
      console.error(err);
    }
  };

  const champStyle = { width: "100%", padding: 9, margin: "4px 0 12px", boxSizing: "border-box", border: "1px solid #ddd", borderRadius: 6 };

  return (
    <Layout titre="Projets">
      <button
        onClick={() => (afficherFormulaire ? setAfficherFormulaire(false) : ouvrirCreation())}
        style={{ marginBottom: 16, padding: "9px 16px", background: "#E8841A", color: "white", border: "none", borderRadius: 6, cursor: "pointer" }}
      >
        {afficherFormulaire ? "Annuler" : "+ Nouveau projet"}
      </button>

      {/* Formulaire (création ou modification) */}
      {afficherFormulaire && (
        <form onSubmit={enregistrer} style={{ background: "white", border: "1px solid #e3e8ef", borderRadius: 12, padding: 18, marginBottom: 20, maxWidth: 500 }}>
          <h3 style={{ fontSize: 15, marginTop: 0 }}>
            {idEnModification ? "Modifier le projet" : "Nouveau projet"}
          </h3>
          <label>Code</label>
          <input name="code" value={form.code} onChange={handleChange} style={champStyle} required />
          <label>Nom</label>
          <input name="nom" value={form.nom} onChange={handleChange} style={champStyle} required />
          <label>Description</label>
          <input name="description" value={form.description} onChange={handleChange} style={champStyle} />
          <label>Date de début</label>
          <input type="date" name="dateDebut" value={form.dateDebut} onChange={handleChange} style={champStyle} />
          <label>Date de fin</label>
          <input type="date" name="dateFin" value={form.dateFin} onChange={handleChange} style={champStyle} />
          <label>Statut</label>
          <select name="statut" value={form.statut} onChange={handleChange} style={champStyle}>
            <option value="Planifie">Planifié</option>
            <option value="En cours">En cours</option>
            <option value="Termine">Terminé</option>
            <option value="Suspendu">Suspendu</option>
          </select>
          <button type="submit" style={{ padding: "10px 16px", background: "#1E3A5F", color: "white", border: "none", borderRadius: 6, cursor: "pointer" }}>
            {idEnModification ? "Enregistrer les modifications" : "Créer le projet"}
          </button>
        </form>
      )}

      {/* Tableau des projets */}
      <div style={{ background: "white", border: "1px solid #e3e8ef", borderRadius: 12, padding: 18 }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
          <thead>
            <tr style={{ color: "#6a7585", textAlign: "left" }}>
              <th style={{ padding: 8, borderBottom: "1px solid #e3e8ef" }}>Code</th>
              <th style={{ padding: 8, borderBottom: "1px solid #e3e8ef" }}>Nom</th>
              <th style={{ padding: 8, borderBottom: "1px solid #e3e8ef" }}>Client</th>
              <th style={{ padding: 8, borderBottom: "1px solid #e3e8ef" }}>Statut</th>
              <th style={{ padding: 8, borderBottom: "1px solid #e3e8ef" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {projets.map((p) => (
              <tr key={p.idProjet}>
                <td style={{ padding: 10, borderBottom: "1px solid #eef2f7" }}>{p.code}</td>
                <td style={{ padding: 10, borderBottom: "1px solid #eef2f7" }}>{p.nom}</td>
                <td style={{ padding: 10, borderBottom: "1px solid #eef2f7" }}>{p.nomClient}</td>
                <td style={{ padding: 10, borderBottom: "1px solid #eef2f7" }}><Badge statut={p.statut} /></td>
                <td style={{ padding: 10, borderBottom: "1px solid #eef2f7" }}>
                  <button onClick={() => ouvrirModification(p)} style={{ padding: "5px 10px", marginRight: 6, background: "#1E3A5F", color: "white", border: "none", borderRadius: 5, cursor: "pointer" }}>
                    Modifier
                  </button>
                  <button onClick={() => supprimerProjet(p.idProjet)} style={{ padding: "5px 10px", background: "#D9534F", color: "white", border: "none", borderRadius: 5, cursor: "pointer" }}>
                    Supprimer
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Layout>
  );
}

export default Projets;
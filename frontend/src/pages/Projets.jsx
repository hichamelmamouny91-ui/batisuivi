// src/pages/Projets.jsx — page de gestion des projets (liste + création + suppression)
import { useEffect, useState } from "react";
import api from "../api";
import Layout from "../components/Layout";

function Projets() {
  const [projets, setProjets] = useState([]);
  const [afficherFormulaire, setAfficherFormulaire] = useState(false);

  // Les champs du formulaire de création
  const [form, setForm] = useState({
    code: "", nom: "", description: "", dateDebut: "", dateFin: "",
    statut: "Planifie", idClient: 1, idChef: 2,
  });

  const token = localStorage.getItem("token");
  const config = { headers: { Authorization: `Bearer ${token}` } };

  // Charger la liste des projets
  const chargerProjets = () => {
    api.get("/projets", config)
      .then((reponse) => setProjets(reponse.data))
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    chargerProjets();
  }, []);

  // Mettre à jour les champs du formulaire
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Créer un projet
  const creerProjet = async (e) => {
    e.preventDefault();
    try {
      await api.post("/projets", form, config);
      setAfficherFormulaire(false);
      setForm({ code: "", nom: "", description: "", dateDebut: "", dateFin: "", statut: "Planifie", idClient: 1, idChef: 2 });
      chargerProjets(); // on recharge la liste
    } catch (err) {
      console.error(err);
      alert("Erreur lors de la création du projet");
    }
  };

  // Supprimer un projet
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
      {/* Bouton pour afficher/masquer le formulaire */}
      <button
        onClick={() => setAfficherFormulaire(!afficherFormulaire)}
        style={{ marginBottom: 16, padding: "9px 16px", background: "#E8841A", color: "white", border: "none", borderRadius: 6, cursor: "pointer" }}
      >
        {afficherFormulaire ? "Annuler" : "+ Nouveau projet"}
      </button>

      {/* Formulaire de création */}
      {afficherFormulaire && (
        <form onSubmit={creerProjet} style={{ background: "white", border: "1px solid #e3e8ef", borderRadius: 12, padding: 18, marginBottom: 20, maxWidth: 500 }}>
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
            Enregistrer
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
              <th style={{ padding: 8, borderBottom: "1px solid #e3e8ef" }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {projets.map((p) => (
              <tr key={p.idProjet}>
                <td style={{ padding: 10, borderBottom: "1px solid #eef2f7" }}>{p.code}</td>
                <td style={{ padding: 10, borderBottom: "1px solid #eef2f7" }}>{p.nom}</td>
                <td style={{ padding: 10, borderBottom: "1px solid #eef2f7" }}>{p.nomClient}</td>
                <td style={{ padding: 10, borderBottom: "1px solid #eef2f7" }}>{p.statut}</td>
                <td style={{ padding: 10, borderBottom: "1px solid #eef2f7" }}>
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
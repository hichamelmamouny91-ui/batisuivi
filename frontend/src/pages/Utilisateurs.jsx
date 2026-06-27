// src/pages/Utilisateurs.jsx — gestion des comptes utilisateurs (réservée à l'admin)
import { useEffect, useState } from "react";
import api from "../api";
import Layout from "../components/Layout";
import Badge from "../components/Badge";

function Utilisateurs() {
  const [utilisateurs, setUtilisateurs] = useState([]);
  const [roles, setRoles] = useState([]);
  const [afficherFormulaire, setAfficherFormulaire] = useState(false);
  const [form, setForm] = useState({ nom: "", prenom: "", email: "", motDePasse: "", idRole: 4 });

  const token = localStorage.getItem("token");
  const config = { headers: { Authorization: `Bearer ${token}` } };

  const charger = () => {
    api.get("/utilisateurs", config)
      .then((r) => setUtilisateurs(r.data))
      .catch((e) => console.error(e));
    api.get("/utilisateurs/roles", config)
      .then((r) => setRoles(r.data))
      .catch((e) => console.error(e));
  };

  useEffect(() => {
    charger();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const creerUtilisateur = async (e) => {
    e.preventDefault();
    try {
      await api.post("/utilisateurs", form, config);
      setAfficherFormulaire(false);
      setForm({ nom: "", prenom: "", email: "", motDePasse: "", idRole: 4 });
      charger();
    } catch (err) {
      // On affiche le message d'erreur du back-end (ex: email déjà utilisé)
      const message = err.response?.data?.erreur || "Erreur lors de la création";
      alert(message);
    }
  };

  const supprimerUtilisateur = async (id) => {
    if (!window.confirm("Voulez-vous vraiment supprimer cet utilisateur ?")) return;
    try {
      await api.delete(`/utilisateurs/${id}`, config);
      charger();
    } catch (err) {
      console.error(err);
      alert("Impossible de supprimer cet utilisateur (il est peut-être lié à des données).");
    }
  };

  const champStyle = { width: "100%", padding: 9, margin: "4px 0 12px", boxSizing: "border-box", border: "1px solid #ddd", borderRadius: 6 };

  return (
    <Layout titre="Utilisateurs">
      <button
        onClick={() => setAfficherFormulaire(!afficherFormulaire)}
        style={{ marginBottom: 16, padding: "9px 16px", background: "#E8841A", color: "white", border: "none", borderRadius: 6, cursor: "pointer" }}
      >
        {afficherFormulaire ? "Annuler" : "+ Nouvel utilisateur"}
      </button>

      {/* Formulaire de création */}
      {afficherFormulaire && (
        <form onSubmit={creerUtilisateur} style={{ background: "white", border: "1px solid #e3e8ef", borderRadius: 12, padding: 18, marginBottom: 20, maxWidth: 500 }}>
          <label>Nom</label>
          <input name="nom" value={form.nom} onChange={handleChange} style={champStyle} required />
          <label>Prénom</label>
          <input name="prenom" value={form.prenom} onChange={handleChange} style={champStyle} required />
          <label>Email</label>
          <input type="email" name="email" value={form.email} onChange={handleChange} style={champStyle} required />
          <label>Mot de passe</label>
          <input type="password" name="motDePasse" value={form.motDePasse} onChange={handleChange} style={champStyle} required />
          <label>Rôle</label>
          <select name="idRole" value={form.idRole} onChange={handleChange} style={champStyle}>
            {roles.map((r) => (
              <option key={r.idRole} value={r.idRole}>{r.libelle}</option>
            ))}
          </select>
          <button type="submit" style={{ padding: "10px 16px", background: "#1E3A5F", color: "white", border: "none", borderRadius: 6, cursor: "pointer" }}>
            Créer l'utilisateur
          </button>
        </form>
      )}

      {/* Tableau des utilisateurs */}
      <div style={{ background: "white", border: "1px solid #e3e8ef", borderRadius: 12, padding: 18 }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
          <thead>
            <tr style={{ color: "#6a7585", textAlign: "left" }}>
              <th style={{ padding: 8, borderBottom: "1px solid #e3e8ef" }}>Nom</th>
              <th style={{ padding: 8, borderBottom: "1px solid #e3e8ef" }}>Prénom</th>
              <th style={{ padding: 8, borderBottom: "1px solid #e3e8ef" }}>Email</th>
              <th style={{ padding: 8, borderBottom: "1px solid #e3e8ef" }}>Rôle</th>
              <th style={{ padding: 8, borderBottom: "1px solid #e3e8ef" }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {utilisateurs.map((u) => (
              <tr key={u.idUser}>
                <td style={{ padding: 10, borderBottom: "1px solid #eef2f7" }}>{u.nom}</td>
                <td style={{ padding: 10, borderBottom: "1px solid #eef2f7" }}>{u.prenom}</td>
                <td style={{ padding: 10, borderBottom: "1px solid #eef2f7" }}>{u.email}</td>
                <td style={{ padding: 10, borderBottom: "1px solid #eef2f7" }}><Badge statut={u.role} /></td>
                <td style={{ padding: 10, borderBottom: "1px solid #eef2f7" }}>
                  <button onClick={() => supprimerUtilisateur(u.idUser)} style={{ padding: "5px 10px", background: "#D9534F", color: "white", border: "none", borderRadius: 5, cursor: "pointer" }}>
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

export default Utilisateurs;
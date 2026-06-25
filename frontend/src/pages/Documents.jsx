// src/pages/Documents.jsx — gestion des documents (upload vers MinIO)
import { useEffect, useState } from "react";
import api from "../api";
import Layout from "../components/Layout";

function Documents() {
  const [documents, setDocuments] = useState([]);
  const [fichier, setFichier] = useState(null);
  const [idProjet, setIdProjet] = useState(1);
  const [enCours, setEnCours] = useState(false);

  const token = localStorage.getItem("token");
  const config = { headers: { Authorization: `Bearer ${token}` } };

  const chargerDocuments = () => {
    api.get("/documents", config)
      .then((reponse) => setDocuments(reponse.data))
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    chargerDocuments();
  }, []);

  // Envoyer un fichier
  const uploader = async (e) => {
    e.preventDefault();
    if (!fichier) {
      alert("Veuillez choisir un fichier");
      return;
    }

    const utilisateur = JSON.parse(localStorage.getItem("utilisateur") || "{}");

    // FormData permet d'envoyer un fichier
    const data = new FormData();
    data.append("fichier", fichier);
    data.append("idProjet", idProjet);
    data.append("idUser", utilisateur.idUser);

    try {
      setEnCours(true);
      await api.post("/documents", data, {
        headers: { ...config.headers, "Content-Type": "multipart/form-data" },
      });
      setFichier(null);
      e.target.reset();
      chargerDocuments();
    } catch (err) {
      console.error(err);
      alert("Erreur lors de l'envoi du document");
    } finally {
      setEnCours(false);
    }
  };

  // Ouvrir un document (récupère un lien temporaire depuis MinIO)
  const consulter = async (id) => {
    try {
      const reponse = await api.get(`/documents/${id}/lien`, config);
      window.open(reponse.data.lien, "_blank");
    } catch (err) {
      console.error(err);
    }
  };

  const champStyle = { padding: 9, margin: "0 8px 0 0", border: "1px solid #ddd", borderRadius: 6 };

  return (
    <Layout titre="Documents">
      {/* Formulaire d'upload */}
      <form onSubmit={uploader} style={{ background: "white", border: "1px solid #e3e8ef", borderRadius: 12, padding: 18, marginBottom: 20, display: "flex", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
        <input type="file" onChange={(e) => setFichier(e.target.files[0])} style={champStyle} required />
        <label style={{ fontSize: 13 }}>Projet :</label>
        <input type="number" value={idProjet} onChange={(e) => setIdProjet(e.target.value)} style={{ ...champStyle, width: 70 }} />
        <button type="submit" disabled={enCours} style={{ padding: "9px 16px", background: "#E8841A", color: "white", border: "none", borderRadius: 6, cursor: "pointer" }}>
          {enCours ? "Envoi..." : "Envoyer le document"}
        </button>
      </form>

      {/* Liste des documents */}
      <div style={{ background: "white", border: "1px solid #e3e8ef", borderRadius: 12, padding: 18 }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
          <thead>
            <tr style={{ color: "#6a7585", textAlign: "left" }}>
              <th style={{ padding: 8, borderBottom: "1px solid #e3e8ef" }}>Nom</th>
              <th style={{ padding: 8, borderBottom: "1px solid #e3e8ef" }}>Type</th>
              <th style={{ padding: 8, borderBottom: "1px solid #e3e8ef" }}>Projet</th>
              <th style={{ padding: 8, borderBottom: "1px solid #e3e8ef" }}>Date</th>
              <th style={{ padding: 8, borderBottom: "1px solid #e3e8ef" }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {documents.map((d) => (
              <tr key={d.idDocument}>
                <td style={{ padding: 10, borderBottom: "1px solid #eef2f7" }}>{d.nom}</td>
                <td style={{ padding: 10, borderBottom: "1px solid #eef2f7" }}>{d.type}</td>
                <td style={{ padding: 10, borderBottom: "1px solid #eef2f7" }}>{d.nomProjet}</td>
                <td style={{ padding: 10, borderBottom: "1px solid #eef2f7" }}>{d.dateDepot}</td>
                <td style={{ padding: 10, borderBottom: "1px solid #eef2f7" }}>
                  <button onClick={() => consulter(d.idDocument)} style={{ padding: "5px 10px", background: "#1E3A5F", color: "white", border: "none", borderRadius: 5, cursor: "pointer" }}>
                    Consulter
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {documents.length === 0 && <p style={{ color: "#6a7585", fontSize: 13 }}>Aucun document pour le moment.</p>}
      </div>
    </Layout>
  );
}

export default Documents;
// src/pages/Login.jsx — page de connexion
import { useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";

function Login() {
  // Les "états" qui mémorisent ce que l'utilisateur tape
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [motDePasse, setMotDePasse] = useState("");
  const [erreur, setErreur] = useState("");

  // Fonction appelée quand on clique sur "Se connecter"
  const seConnecter = async (e) => {
    e.preventDefault(); // empêche le rechargement de la page
    setErreur("");
    try {
      // On envoie email + mot de passe au back-end
      const reponse = await api.post("/auth/login", { email, motDePasse });

      // On stocke le jeton et l'utilisateur pour les prochaines requêtes
      localStorage.setItem("token", reponse.data.token);
      localStorage.setItem("utilisateur", JSON.stringify(reponse.data.utilisateur));
      navigate("/dashboard");
    } catch {
      setErreur("Email ou mot de passe incorrect");
    }
  };

  // On affiche le formulaire de connexion
  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", fontFamily: "sans-serif" }}>
      <form onSubmit={seConnecter} style={{ width: 320, padding: 30, border: "1px solid #ddd", borderRadius: 10 }}>
        <h2 style={{ color: "#1E3A5F" }}>Connexion — BâtiSuivi</h2>

        <label>Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ width: "100%", padding: 10, margin: "6px 0 16px", boxSizing: "border-box" }}
          required
        />

        <label>Mot de passe</label>
        <input
          type="password"
          value={motDePasse}
          onChange={(e) => setMotDePasse(e.target.value)}
          style={{ width: "100%", padding: 10, margin: "6px 0 16px", boxSizing: "border-box" }}
          required
        />

        {erreur && <p style={{ color: "red" }}>{erreur}</p>}

        <button type="submit" style={{ width: "100%", padding: 12, background: "#E8841A", color: "white", border: "none", borderRadius: 6, cursor: "pointer" }}>
          Se connecter
        </button>
      </form>
    </div>
  );
}

export default Login;
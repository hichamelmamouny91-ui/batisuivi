// routes/auth.js — gestion de la connexion (authentification)
const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const pool = require("../db");

const router = express.Router();

// Clé secrète pour signer les jetons (à mettre dans .env en production)
const JWT_SECRET = "batisuivi_secret_2026";

// Route de connexion : POST /api/auth/login
router.post("/login", async (req, res) => {
  const { email, motDePasse } = req.body; // données envoyées par le front

  try {
    // 1. On cherche l'utilisateur par son email, et on récupère son rôle
    const [resultats] = await pool.query(
      `SELECT u.idUser, u.nom, u.prenom, u.email, u.motDePasse, r.libelle AS role
       FROM utilisateur u
       JOIN role r ON u.idRole = r.idRole
       WHERE u.email = ?`,
      [email]
    );

    // Si aucun utilisateur trouvé
    if (resultats.length === 0) {
      return res.status(401).json({ erreur: "Email ou mot de passe incorrect" });
    }

    const utilisateur = resultats[0];

    // 2. On compare le mot de passe saisi avec le mot de passe haché
    const motDePasseValide = await bcrypt.compare(motDePasse, utilisateur.motDePasse);

    if (!motDePasseValide) {
      return res.status(401).json({ erreur: "Email ou mot de passe incorrect" });
    }

    // 3. On crée un jeton JWT contenant l'identité de l'utilisateur
    const token = jwt.sign(
      {
        idUser: utilisateur.idUser,
        email: utilisateur.email,
        role: utilisateur.role,
      },
      JWT_SECRET,
      { expiresIn: "8h" } // le jeton expire après 8 heures
    );

    // 4. On renvoie le jeton et les infos de l'utilisateur (sans le mot de passe)
    res.json({
      token,
      utilisateur: {
        idUser: utilisateur.idUser,
        nom: utilisateur.nom,
        prenom: utilisateur.prenom,
        email: utilisateur.email,
        role: utilisateur.role,
      },
    });
  } catch (erreur) {
    console.error(erreur);
    res.status(500).json({ erreur: "Erreur serveur" });
  }
});

module.exports = router;
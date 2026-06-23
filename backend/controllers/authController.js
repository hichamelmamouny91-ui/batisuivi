// controllers/authController.js — logique de l'authentification
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const pool = require("../db");

const JWT_SECRET = "batisuivi_secret_2026";

// Connexion d'un utilisateur
exports.login = async (req, res) => {
  const { email, motDePasse } = req.body;

  try {
    // 1. On cherche l'utilisateur par son email, avec son rôle
    const [resultats] = await pool.query(
      `SELECT u.idUser, u.nom, u.prenom, u.email, u.motDePasse, r.libelle AS role
       FROM utilisateur u
       JOIN role r ON u.idRole = r.idRole
       WHERE u.email = ?`,
      [email]
    );

    if (resultats.length === 0) {
      return res.status(401).json({ erreur: "Email ou mot de passe incorrect" });
    }

    const utilisateur = resultats[0];

    // 2. On compare le mot de passe saisi avec le mot de passe haché
    const motDePasseValide = await bcrypt.compare(motDePasse, utilisateur.motDePasse);

    if (!motDePasseValide) {
      return res.status(401).json({ erreur: "Email ou mot de passe incorrect" });
    }

    // 3. On crée le jeton JWT
    const token = jwt.sign(
      { idUser: utilisateur.idUser, email: utilisateur.email, role: utilisateur.role },
      JWT_SECRET,
      { expiresIn: "8h" }
    );

    // 4. On renvoie le jeton et les infos (sans le mot de passe)
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
};
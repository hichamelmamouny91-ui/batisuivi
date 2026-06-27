// controllers/utilisateurController.js — gestion des utilisateurs
const pool = require("../db");
const bcrypt = require("bcrypt");

// Lister tous les utilisateurs (avec leur rôle, sans le mot de passe)
exports.getTousUtilisateurs = async (req, res) => {
  try {
    const [utilisateurs] = await pool.query(
      `SELECT u.idUser, u.nom, u.prenom, u.email, r.libelle AS role, u.idRole
       FROM utilisateur u
       JOIN role r ON u.idRole = r.idRole`
    );
    res.json(utilisateurs);
  } catch (erreur) {
    console.error(erreur);
    res.status(500).json({ erreur: "Erreur serveur" });
  }
};

// Lister les rôles disponibles (pour le menu déroulant du formulaire)
exports.getRoles = async (req, res) => {
  try {
    const [roles] = await pool.query("SELECT * FROM role");
    res.json(roles);
  } catch (erreur) {
    console.error(erreur);
    res.status(500).json({ erreur: "Erreur serveur" });
  }
};

// Créer un utilisateur (avec mot de passe haché)
exports.creerUtilisateur = async (req, res) => {
  const { nom, prenom, email, motDePasse, idRole } = req.body;
  try {
    // On hache le mot de passe avant de l'enregistrer
    const motDePasseHache = await bcrypt.hash(motDePasse, 10);

    await pool.query(
      `INSERT INTO utilisateur (nom, prenom, email, motDePasse, idRole)
       VALUES (?, ?, ?, ?, ?)`,
      [nom, prenom, email, motDePasseHache, idRole]
    );
    res.status(201).json({ message: "Utilisateur créé" });
  } catch (erreur) {
    console.error(erreur);
    // Cas fréquent : email déjà utilisé (contrainte UNIQUE)
    if (erreur.code === "ER_DUP_ENTRY") {
      return res.status(400).json({ erreur: "Cet email est déjà utilisé" });
    }
    res.status(500).json({ erreur: "Erreur serveur" });
  }
};

// Supprimer un utilisateur
exports.supprimerUtilisateur = async (req, res) => {
  try {
    await pool.query("DELETE FROM utilisateur WHERE idUser = ?", [req.params.id]);
    res.json({ message: "Utilisateur supprimé" });
  } catch (erreur) {
    console.error(erreur);
    res.status(500).json({ erreur: "Erreur serveur" });
  }
};
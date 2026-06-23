// controllers/projetController.js — logique métier des projets
const pool = require("../db");

// Récupérer tous les projets
exports.getTousProjets = async (req, res) => {
  try {
    const [projets] = await pool.query(
      `SELECT p.*, c.nom AS nomClient
       FROM projet p
       JOIN client c ON p.idClient = c.idClient`
    );
    res.json(projets);
  } catch (erreur) {
    console.error(erreur);
    res.status(500).json({ erreur: "Erreur serveur" });
  }
};

// Récupérer un projet par son id
exports.getProjetParId = async (req, res) => {
  try {
    const [projets] = await pool.query("SELECT * FROM projet WHERE idProjet = ?", [req.params.id]);
    if (projets.length === 0) {
      return res.status(404).json({ erreur: "Projet introuvable" });
    }
    res.json(projets[0]);
  } catch (erreur) {
    console.error(erreur);
    res.status(500).json({ erreur: "Erreur serveur" });
  }
};

// Créer un nouveau projet
exports.creerProjet = async (req, res) => {
  const { code, nom, description, dateDebut, dateFin, statut, idClient, idChef } = req.body;
  try {
    const [resultat] = await pool.query(
      `INSERT INTO projet (code, nom, description, dateDebut, dateFin, statut, idClient, idChef)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [code, nom, description, dateDebut, dateFin, statut, idClient, idChef]
    );
    res.status(201).json({ message: "Projet créé", idProjet: resultat.insertId });
  } catch (erreur) {
    console.error(erreur);
    res.status(500).json({ erreur: "Erreur serveur" });
  }
};

// Modifier un projet existant
exports.modifierProjet = async (req, res) => {
  const { code, nom, description, dateDebut, dateFin, statut, idClient, idChef } = req.body;
  try {
    await pool.query(
      `UPDATE projet
       SET code = ?, nom = ?, description = ?, dateDebut = ?, dateFin = ?, statut = ?, idClient = ?, idChef = ?
       WHERE idProjet = ?`,
      [code, nom, description, dateDebut, dateFin, statut, idClient, idChef, req.params.id]
    );
    res.json({ message: "Projet modifié" });
  } catch (erreur) {
    console.error(erreur);
    res.status(500).json({ erreur: "Erreur serveur" });
  }
};

// Supprimer un projet
exports.supprimerProjet = async (req, res) => {
  try {
    await pool.query("DELETE FROM projet WHERE idProjet = ?", [req.params.id]);
    res.json({ message: "Projet supprimé" });
  } catch (erreur) {
    console.error(erreur);
    res.status(500).json({ erreur: "Erreur serveur" });
  }
};
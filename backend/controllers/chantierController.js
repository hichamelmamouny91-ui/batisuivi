// controllers/chantierController.js — logique métier des chantiers
const pool = require("../db");

// Récupérer tous les chantiers (avec le nom du projet associé)
exports.getTousChantiers = async (req, res) => {
  try {
    const [chantiers] = await pool.query(
      `SELECT ch.*, p.nom AS nomProjet
       FROM chantier ch
       JOIN projet p ON ch.idProjet = p.idProjet`
    );
    res.json(chantiers);
  } catch (erreur) {
    console.error(erreur);
    res.status(500).json({ erreur: "Erreur serveur" });
  }
};

// Récupérer un chantier par son id
exports.getChantierParId = async (req, res) => {
  try {
    const [chantiers] = await pool.query("SELECT * FROM chantier WHERE idChantier = ?", [req.params.id]);
    if (chantiers.length === 0) {
      return res.status(404).json({ erreur: "Chantier introuvable" });
    }
    res.json(chantiers[0]);
  } catch (erreur) {
    console.error(erreur);
    res.status(500).json({ erreur: "Erreur serveur" });
  }
};

// Créer un nouveau chantier
exports.creerChantier = async (req, res) => {
  const { nom, localisation, dateDebut, dateFin, avancement, statut, idProjet } = req.body;
  try {
    const [resultat] = await pool.query(
      `INSERT INTO chantier (nom, localisation, dateDebut, dateFin, avancement, statut, idProjet)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [nom, localisation, dateDebut, dateFin, avancement, statut, idProjet]
    );
    res.status(201).json({ message: "Chantier créé", idChantier: resultat.insertId });
  } catch (erreur) {
    console.error(erreur);
    res.status(500).json({ erreur: "Erreur serveur" });
  }
};

// Modifier un chantier (utile surtout pour mettre à jour l'avancement)
exports.modifierChantier = async (req, res) => {
  const { nom, localisation, dateDebut, dateFin, avancement, statut, idProjet } = req.body;
  try {
    await pool.query(
      `UPDATE chantier
       SET nom = ?, localisation = ?, dateDebut = ?, dateFin = ?, avancement = ?, statut = ?, idProjet = ?
       WHERE idChantier = ?`,
      [nom, localisation, dateDebut, dateFin, avancement, statut, idProjet, req.params.id]
    );
    res.json({ message: "Chantier modifié" });
  } catch (erreur) {
    console.error(erreur);
    res.status(500).json({ erreur: "Erreur serveur" });
  }
};

// Supprimer un chantier
exports.supprimerChantier = async (req, res) => {
  try {
    await pool.query("DELETE FROM chantier WHERE idChantier = ?", [req.params.id]);
    res.json({ message: "Chantier supprimé" });
  } catch (erreur) {
    console.error(erreur);
    res.status(500).json({ erreur: "Erreur serveur" });
  }
};

// Mettre à jour uniquement l'avancement d'un chantier
exports.modifierAvancement = async (req, res) => {
  const { avancement } = req.body;
  try {
    await pool.query(
      "UPDATE chantier SET avancement = ? WHERE idChantier = ?",
      [avancement, req.params.id]
    );
    res.json({ message: "Avancement mis à jour" });
  } catch (erreur) {
    console.error(erreur);
    res.status(500).json({ erreur: "Erreur serveur" });
  }
};
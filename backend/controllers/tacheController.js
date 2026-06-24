// controllers/tacheController.js — logique métier des tâches
const pool = require("../db");

// Récupérer toutes les tâches (avec le nom du chantier et de l'utilisateur affecté)
exports.getToutesTaches = async (req, res) => {
  try {
    const [taches] = await pool.query(
      `SELECT t.*, ch.nom AS nomChantier, u.prenom AS prenomUser, u.nom AS nomUser
       FROM tache t
       JOIN chantier ch ON t.idChantier = ch.idChantier
       LEFT JOIN utilisateur u ON t.idUser = u.idUser`
    );
    res.json(taches);
  } catch (erreur) {
    console.error(erreur);
    res.status(500).json({ erreur: "Erreur serveur" });
  }
};

// Créer une nouvelle tâche
exports.creerTache = async (req, res) => {
  const { titre, description, dateEcheance, statut, idChantier, idUser } = req.body;
  try {
    const [resultat] = await pool.query(
      `INSERT INTO tache (titre, description, dateEcheance, statut, idChantier, idUser)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [titre, description, dateEcheance, statut, idChantier, idUser]
    );
    res.status(201).json({ message: "Tâche créée", idTache: resultat.insertId });
  } catch (erreur) {
    console.error(erreur);
    res.status(500).json({ erreur: "Erreur serveur" });
  }
};

// Modifier uniquement le statut d'une tâche (pour déplacer entre colonnes Kanban)
exports.modifierStatut = async (req, res) => {
  const { statut } = req.body;
  try {
    await pool.query("UPDATE tache SET statut = ? WHERE idTache = ?", [statut, req.params.id]);
    res.json({ message: "Statut mis à jour" });
  } catch (erreur) {
    console.error(erreur);
    res.status(500).json({ erreur: "Erreur serveur" });
  }
};

// Supprimer une tâche
exports.supprimerTache = async (req, res) => {
  try {
    await pool.query("DELETE FROM tache WHERE idTache = ?", [req.params.id]);
    res.json({ message: "Tâche supprimée" });
  } catch (erreur) {
    console.error(erreur);
    res.status(500).json({ erreur: "Erreur serveur" });
  }
};
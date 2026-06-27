// controllers/projetController.js — logique métier des projets
const pool = require("../db");

// Récupérer tous les projets, avec l'avancement calculé (moyenne des chantiers)
exports.getTousProjets = async (req, res) => {
  try {
    const [projets] = await pool.query(
      `SELECT p.*, c.nom AS nomClient
       FROM projet p
       JOIN client c ON p.idClient = c.idClient`
    );

    // Pour chaque projet, on calcule l'avancement moyen de ses chantiers
    for (const projet of projets) {
      // On récupère les chantiers du projet avec leur avancement (basé sur leurs tâches)
      const [chantiers] = await pool.query(
        `SELECT ch.idChantier,
          (SELECT COUNT(*) FROM tache t WHERE t.idChantier = ch.idChantier) AS totalTaches,
          (SELECT COUNT(*) FROM tache t WHERE t.idChantier = ch.idChantier AND t.statut = 'Termine') AS tachesTerminees
         FROM chantier ch
         WHERE ch.idProjet = ?`,
        [projet.idProjet]
      );

      if (chantiers.length === 0) {
        projet.avancementCalcule = 0;
      } else {
        // Avancement de chaque chantier = % de tâches terminées
        const avancements = chantiers.map((ch) =>
          ch.totalTaches > 0 ? (ch.tachesTerminees / ch.totalTaches) * 100 : 0
        );
        // Moyenne des avancements des chantiers
        const moyenne = avancements.reduce((s, a) => s + a, 0) / chantiers.length;
        projet.avancementCalcule = Math.round(moyenne);
      }
    }

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
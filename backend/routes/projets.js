// routes/projets.js — gestion des projets (CRUD)
const express = require("express");
const pool = require("../db");
const verifierToken = require("../middleware/auth");

const router = express.Router();

// READ — Récupérer tous les projets
router.get("/", verifierToken, async (req, res) => {
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
});

// READ — Récupérer UN projet par son id
router.get("/:id", verifierToken, async (req, res) => {
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
});

// CREATE — Créer un nouveau projet
router.post("/", verifierToken, async (req, res) => {
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
});

// UPDATE — Modifier un projet existant
router.put("/:id", verifierToken, async (req, res) => {
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
});

// DELETE — Supprimer un projet
router.delete("/:id", verifierToken, async (req, res) => {
  try {
    await pool.query("DELETE FROM projet WHERE idProjet = ?", [req.params.id]);
    res.json({ message: "Projet supprimé" });
  } catch (erreur) {
    console.error(erreur);
    res.status(500).json({ erreur: "Erreur serveur" });
  }
});

module.exports = router;
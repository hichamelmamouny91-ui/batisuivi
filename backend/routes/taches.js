// routes/taches.js — aiguillage avec contrôle des rôles
const express = require("express");
const router = express.Router();
const verifierToken = require("../middleware/auth");
const verifierRole = require("../middleware/verifierRole");
const tacheController = require("../controllers/tacheController");

// Lecture : tous les connectés
router.get("/", verifierToken, tacheController.getToutesTaches);

// Changer le statut (déplacer dans le Kanban) : tous
router.patch("/:id/statut", verifierToken, tacheController.modifierStatut);

// Création / suppression : Admin ou Chef de projet
router.post("/", verifierToken, verifierRole("Administrateur", "Chef de projet"), tacheController.creerTache);
router.delete("/:id", verifierToken, verifierRole("Administrateur", "Chef de projet"), tacheController.supprimerTache);

module.exports = router;
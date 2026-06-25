// routes/projets.js — aiguillage avec contrôle des rôles
const express = require("express");
const router = express.Router();
const verifierToken = require("../middleware/auth"); // adapte si besoin
const verifierRole = require("../middleware/verifierRole");
const projetController = require("../controllers/projetController");

// Lecture : tous les utilisateurs connectés
router.get("/", verifierToken, projetController.getTousProjets);
router.get("/:id", verifierToken, projetController.getProjetParId);

// Création / modification / suppression : Admin ou Chef de projet seulement
router.post("/", verifierToken, verifierRole("Administrateur", "Chef de projet"), projetController.creerProjet);
router.put("/:id", verifierToken, verifierRole("Administrateur", "Chef de projet"), projetController.modifierProjet);
router.delete("/:id", verifierToken, verifierRole("Administrateur"), projetController.supprimerProjet);

module.exports = router;
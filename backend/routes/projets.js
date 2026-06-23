// routes/projets.js — aiguillage des URLs vers le contrôleur
const express = require("express");
const router = express.Router();
const verifierToken = require("../middleware/auth"); // adapte si ton fichier a un autre nom
const projetController = require("../controllers/projetController");

// Chaque URL pointe vers une fonction du contrôleur
router.get("/", verifierToken, projetController.getTousProjets);
router.get("/:id", verifierToken, projetController.getProjetParId);
router.post("/", verifierToken, projetController.creerProjet);
router.put("/:id", verifierToken, projetController.modifierProjet);
router.delete("/:id", verifierToken, projetController.supprimerProjet);

module.exports = router;
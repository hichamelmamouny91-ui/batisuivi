// routes/taches.js — aiguillage des URLs vers le contrôleur
const express = require("express");
const router = express.Router();
const verifierToken = require("../middleware/auth"); // adapte si besoin
const tacheController = require("../controllers/tacheController");

router.get("/", verifierToken, tacheController.getToutesTaches);
router.post("/", verifierToken, tacheController.creerTache);
router.patch("/:id/statut", verifierToken, tacheController.modifierStatut);
router.delete("/:id", verifierToken, tacheController.supprimerTache);

module.exports = router;
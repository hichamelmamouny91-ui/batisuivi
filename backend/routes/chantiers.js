// routes/chantiers.js — aiguillage des URLs vers le contrôleur
const express = require("express");
const router = express.Router();
const verifierToken = require("../middleware/auth"); // adapte si ton fichier a un autre nom
const chantierController = require("../controllers/chantierController");

router.get("/", verifierToken, chantierController.getTousChantiers);
router.get("/:id", verifierToken, chantierController.getChantierParId);
router.post("/", verifierToken, chantierController.creerChantier);
router.put("/:id", verifierToken, chantierController.modifierChantier);
router.delete("/:id", verifierToken, chantierController.supprimerChantier);
router.patch("/:id/avancement", verifierToken, chantierController.modifierAvancement);
module.exports = router;
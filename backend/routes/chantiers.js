// routes/chantiers.js — aiguillage avec contrôle des rôles
const express = require("express");
const router = express.Router();
const verifierToken = require("../middleware/auth");
const verifierRole = require("../middleware/verifierRole");
const chantierController = require("../controllers/chantierController");

// Lecture : tous les connectés
router.get("/", verifierToken, chantierController.getTousChantiers);
router.get("/:id", verifierToken, chantierController.getChantierParId);

// Mise à jour de l'avancement : tous (y compris le technicien sur le terrain)
router.patch("/:id/avancement", verifierToken, chantierController.modifierAvancement);

// Création / modification / suppression : Admin ou Chef de projet
router.post("/", verifierToken, verifierRole("Administrateur", "Chef de projet"), chantierController.creerChantier);
router.put("/:id", verifierToken, verifierRole("Administrateur", "Chef de projet"), chantierController.modifierChantier);
router.delete("/:id", verifierToken, verifierRole("Administrateur"), chantierController.supprimerChantier);

module.exports = router;
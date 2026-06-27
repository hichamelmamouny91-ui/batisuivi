// routes/utilisateurs.js — gestion des utilisateurs (réservée à l'admin)
const express = require("express");
const router = express.Router();
const verifierToken = require("../middleware/auth");
const verifierRole = require("../middleware/verifierRole");
const utilisateurController = require("../controllers/utilisateurController");

// Toutes ces routes nécessitent le rôle Administrateur
router.get("/", verifierToken, verifierRole("Administrateur"), utilisateurController.getTousUtilisateurs);
router.get("/roles", verifierToken, verifierRole("Administrateur"), utilisateurController.getRoles);
router.post("/", verifierToken, verifierRole("Administrateur"), utilisateurController.creerUtilisateur);
router.delete("/:id", verifierToken, verifierRole("Administrateur"), utilisateurController.supprimerUtilisateur);

module.exports = router;
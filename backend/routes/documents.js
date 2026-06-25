// routes/documents.js — aiguillage avec contrôle des rôles
const express = require("express");
const router = express.Router();
const multer = require("multer");
const verifierToken = require("../middleware/auth");
const verifierRole = require("../middleware/verifierRole");
const documentController = require("../controllers/documentController");

const upload = multer({ storage: multer.memoryStorage() });

// Lecture / consultation : tous les connectés
router.get("/", verifierToken, documentController.getTousDocuments);
router.get("/:id/lien", verifierToken, documentController.telechargerDocument);

// Envoi d'un document : Admin, Chef de projet ou Ingénieur
router.post("/", verifierToken, verifierRole("Administrateur", "Chef de projet", "Ingenieur"), upload.single("fichier"), documentController.uploaderDocument);

module.exports = router;
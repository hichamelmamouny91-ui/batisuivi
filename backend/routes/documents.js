// routes/documents.js — aiguillage des URLs vers le contrôleur
const express = require("express");
const router = express.Router();
const multer = require("multer");
const verifierToken = require("../middleware/auth"); // adapte si besoin
const documentController = require("../controllers/documentController");

// multer garde le fichier en mémoire avant de l'envoyer à MinIO
const upload = multer({ storage: multer.memoryStorage() });

router.get("/", verifierToken, documentController.getTousDocuments);
router.post("/", verifierToken, upload.single("fichier"), documentController.uploaderDocument);
router.get("/:id/lien", verifierToken, documentController.telechargerDocument);

module.exports = router;
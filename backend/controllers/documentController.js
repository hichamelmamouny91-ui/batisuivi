// controllers/documentController.js — gestion des documents (upload vers MinIO)
const pool = require("../db");
const minioClient = require("../minioClient");

const BUCKET = "documents";

// Récupérer la liste des documents
exports.getTousDocuments = async (req, res) => {
  try {
    const [documents] = await pool.query(
      `SELECT d.*, p.nom AS nomProjet
       FROM document d
       JOIN projet p ON d.idProjet = p.idProjet`
    );
    res.json(documents);
  } catch (erreur) {
    console.error(erreur);
    res.status(500).json({ erreur: "Erreur serveur" });
  }
};

// Uploader un document : on l'envoie à MinIO et on enregistre son lien en base
exports.uploaderDocument = async (req, res) => {
  try {
    const fichier = req.file; // le fichier reçu via multer
    const { idProjet, idUser } = req.body;

    if (!fichier) {
      return res.status(400).json({ erreur: "Aucun fichier fourni" });
    }

    // Nom unique pour éviter les doublons (date + nom original)
    const nomObjet = `${Date.now()}-${fichier.originalname}`;

    // Envoi du fichier vers MinIO
    await minioClient.putObject(BUCKET, nomObjet, fichier.buffer, fichier.size, {
      "Content-Type": fichier.mimetype,
    });

    // Le chemin pour accéder au fichier
    const cheminFichier = `${BUCKET}/${nomObjet}`;

    // Enregistrement dans la base de données
    await pool.query(
      `INSERT INTO document (nom, type, cheminFichier, dateDepot, idProjet, idUser)
       VALUES (?, ?, ?, CURDATE(), ?, ?)`,
      [fichier.originalname, fichier.mimetype, cheminFichier, idProjet, idUser]
    );

    res.status(201).json({ message: "Document envoyé avec succès" });
  } catch (erreur) {
    console.error(erreur);
    res.status(500).json({ erreur: "Erreur lors de l'envoi du document" });
  }
};

// Télécharger / consulter un document (génère un lien temporaire sécurisé)
exports.telechargerDocument = async (req, res) => {
  try {
    const [documents] = await pool.query("SELECT * FROM document WHERE idDocument = ?", [req.params.id]);
    if (documents.length === 0) {
      return res.status(404).json({ erreur: "Document introuvable" });
    }

    const nomObjet = documents[0].cheminFichier.replace(`${BUCKET}/`, "");

    // Lien temporaire valable 1 heure (3600 secondes)
    const lien = await minioClient.presignedGetObject(BUCKET, nomObjet, 3600);
    res.json({ lien });
  } catch (erreur) {
    console.error(erreur);
    res.status(500).json({ erreur: "Erreur serveur" });
  }
};
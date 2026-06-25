// minioClient.js — connexion au serveur de stockage MinIO
const Minio = require("minio");

const minioClient = new Minio.Client({
  endPoint: "localhost",
  port: 9000,
  useSSL: false,
  accessKey: "minioadmin",
  secretKey: "minioadmin123",
});

const BUCKET = "documents";

// Crée le bucket automatiquement au démarrage s'il n'existe pas
async function initBucket() {
  try {
    const existe = await minioClient.bucketExists(BUCKET);
    if (!existe) {
      await minioClient.makeBucket(BUCKET);
      console.log(`Bucket "${BUCKET}" créé automatiquement.`);
    } else {
      console.log(`Bucket "${BUCKET}" déjà présent.`);
    }
  } catch (erreur) {
    console.error("Erreur lors de l'initialisation du bucket MinIO :", erreur.message);
  }
}

initBucket();

module.exports = minioClient;
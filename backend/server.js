// server.js — le serveur back-end Express
const express = require("express");
const cors = require("cors");
const pool = require("./db");
const chantiersRoutes = require("./routes/chantiers");
const tachesRoutes = require("./routes/taches");
const utilisateursRoutes = require("./routes/utilisateurs");


// --- Tous les imports de routes et middleware, regroupés en haut ---
const authRoutes = require("./routes/auth");
const projetsRoutes = require("./routes/projets");
const verifierToken = require("./middleware/auth"); // ou verifierToken selon ton nom
const documentsRoutes = require("./routes/documents");
const app = express();
app.use(cors());
app.use(express.json());
app.use("/api/chantiers", chantiersRoutes);
app.use("/api/taches", tachesRoutes);
app.use("/api/utilisateurs", utilisateursRoutes);


// --- Les routes ---
app.get("/", (req, res) => {
  res.json({ message: "API BâtiSuivi opérationnelle" });
});

app.use("/api/auth", authRoutes);
app.use("/api/projets", projetsRoutes);
app.use("/api/documents", documentsRoutes);

// --- Démarrage du serveur ---
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Serveur démarré sur http://localhost:${PORT}`);
});
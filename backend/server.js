// server.js — le serveur back-end Express
const express = require("express");
const cors = require("cors");
const pool = require("./db");
const chantiersRoutes = require("./routes/chantiers");

// --- Tous les imports de routes et middleware, regroupés en haut ---
const authRoutes = require("./routes/auth");
const projetsRoutes = require("./routes/projets");
const verifierToken = require("./middleware/auth"); // ou verifierToken selon ton nom

const app = express();
app.use(cors());
app.use(express.json());
app.use("/api/chantiers", chantiersRoutes);

// --- Les routes ---
app.get("/", (req, res) => {
  res.json({ message: "API BâtiSuivi opérationnelle" });
});

app.use("/api/auth", authRoutes);
app.use("/api/projets", projetsRoutes);

// --- Démarrage du serveur ---
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Serveur démarré sur http://localhost:${PORT}`);
});
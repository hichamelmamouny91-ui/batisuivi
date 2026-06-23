// middleware/auth.js — vérifie que la requête possède un jeton valide
const jwt = require("jsonwebtoken");

const JWT_SECRET = "batisuivi_secret_2026"; // la même clé que dans routes/auth.js

function verifierToken(req, res, next) {
  // Le jeton est envoyé dans l'en-tête "Authorization : Bearer <token>"
  const authHeader = req.headers["authorization"];

  if (!authHeader) {
    return res.status(401).json({ erreur: "Accès refusé : aucun jeton fourni" });
  }

  // On extrait le jeton après le mot "Bearer "
  const token = authHeader.split(" ")[1];

  try {
    // On vérifie que le jeton est valide et non expiré
    const utilisateur = jwt.verify(token, JWT_SECRET);
    req.utilisateur = utilisateur; // on attache l'utilisateur à la requête
    next(); // tout est bon, on laisse passer la requête
  } catch (erreur) {
    return res.status(403).json({ erreur: "Jeton invalide ou expiré" });
  }
}

module.exports = verifierToken;
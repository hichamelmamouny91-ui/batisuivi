// db.js — connexion à la base de données MySQL
const mysql = require("mysql2");

// On crée un "pool" de connexions (plus efficace qu'une seule connexion)
const pool = mysql.createPool({
  host: "localhost",      // la base tourne sur ta machine
  port: 3307,             // ATTENTION : 3307, le port qu'on a configuré dans Docker
  user: "root",           // l'utilisateur MySQL
  password: "root",       // le mot de passe défini dans docker-compose
  database: "bati_suivi", // le nom de ta base
});

// On exporte le pool pour pouvoir l'utiliser dans les autres fichiers
module.exports = pool.promise();
// hashPasswords.js — sécurise les mots de passe existants (à lancer UNE seule fois)
const bcrypt = require("bcrypt");
const pool = require("./db");

async function hacherMotsDePasse() {
  try {
    // On récupère tous les utilisateurs
    const [utilisateurs] = await pool.query("SELECT idUser, motDePasse FROM utilisateur");

    for (const user of utilisateurs) {
      // Si le mot de passe est déjà haché (commence par $2b$), on l'ignore
      if (user.motDePasse.startsWith("$2b$")) continue;

      // On hache le mot de passe en clair (10 = niveau de sécurité)
      const motDePasseHache = await bcrypt.hash(user.motDePasse, 10);

      // On met à jour la base avec le mot de passe haché
      await pool.query(
        "UPDATE utilisateur SET motDePasse = ? WHERE idUser = ?",
        [motDePasseHache, user.idUser]
      );
      console.log(`Mot de passe sécurisé pour l'utilisateur ${user.idUser}`);
    }

    console.log("Terminé ! Tous les mots de passe sont maintenant hachés.");
    process.exit(0); // on arrête le script
  } catch (erreur) {
    console.error(erreur);
    process.exit(1);
  }
}

hacherMotsDePasse();
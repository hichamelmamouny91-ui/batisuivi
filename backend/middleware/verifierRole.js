// middleware/verifierRole.js — autorise l'accès selon le rôle de l'utilisateur
// On lui passe la liste des rôles autorisés, ex: verifierRole("Administrateur", "Chef de projet")
function verifierRole(...rolesAutorises) {
  return (req, res, next) => {
    // req.utilisateur est rempli par le middleware verifierToken (il contient le rôle)
    const roleUtilisateur = req.utilisateur?.role;

    if (!roleUtilisateur) {
      return res.status(401).json({ erreur: "Utilisateur non authentifié" });
    }

    // Si le rôle de l'utilisateur n'est pas dans la liste autorisée, on refuse
    if (!rolesAutorises.includes(roleUtilisateur)) {
      return res.status(403).json({ erreur: "Accès refusé : vous n'avez pas les droits nécessaires" });
    }

    next(); // le rôle est autorisé, on continue
  };
}

module.exports = verifierRole;
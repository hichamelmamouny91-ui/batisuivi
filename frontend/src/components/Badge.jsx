// src/components/Badge.jsx — pastille de statut colorée réutilisable
function Badge({ statut }) {
  // On choisit la couleur selon le statut
  const couleurs = {
    "Planifie":  { fond: "#E5EEF8", texte: "#2C5282" }, // bleu
    "En cours":  { fond: "#FBEAD2", texte: "#B5701F" }, // orange
    "Termine":   { fond: "#E3F4EB", texte: "#2E9E6B" }, // vert
    "Suspendu":  { fond: "#F8E3E2", texte: "#D9534F" }, // rouge
    "A faire":   { fond: "#EAEEF3", texte: "#6A7585" }, // gris
  };

  const c = couleurs[statut] || { fond: "#EAEEF3", texte: "#6A7585" };

  return (
    <span style={{
      display: "inline-block",
      padding: "3px 10px",
      borderRadius: 20,
      fontSize: 11,
      fontWeight: 600,
      background: c.fond,
      color: c.texte,
    }}>
      {statut}
    </span>
  );
}

export default Badge;
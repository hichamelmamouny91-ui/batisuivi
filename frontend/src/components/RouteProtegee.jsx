// src/components/RouteProtegee.jsx — empêche l'accès aux pages sans connexion
import { Navigate } from "react-router-dom";

function RouteProtegee({ children }) {
  const token = localStorage.getItem("token");

  // Si pas de jeton, on redirige vers la page de connexion
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Sinon, on affiche la page demandée
  return children;
}

export default RouteProtegee;
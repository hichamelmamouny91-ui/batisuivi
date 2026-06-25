// src/auth.js — petites fonctions pour gérer le rôle de l'utilisateur connecté
export function getUtilisateur() {
  return JSON.parse(localStorage.getItem("utilisateur") || "{}");
}

export function getRole() {
  return getUtilisateur().role || "";
}

// Vérifie si l'utilisateur a l'un des rôles autorisés
export function aLeRole(...rolesAutorises) {
  return rolesAutorises.includes(getRole());
}
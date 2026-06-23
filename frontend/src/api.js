// src/api.js — configuration des appels vers le back-end
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api", // l'adresse de ton back-end
});

export default api;
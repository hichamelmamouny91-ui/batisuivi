// src/App.jsx — navigation principale avec protection des pages
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Projets from "./pages/Projets";
import Chantiers from "./pages/Chantiers";
import Taches from "./pages/Taches";
import Documents from "./pages/Documents";
import RouteProtegee from "./components/RouteProtegee";
import Utilisateurs from "./pages/Utilisateurs";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Page publique */}
        <Route path="/login" element={<Login />} />

        {/* Pages protégées : accessibles uniquement si connecté */}
        <Route path="/dashboard" element={<RouteProtegee><Dashboard /></RouteProtegee>} />
        <Route path="/projets" element={<RouteProtegee><Projets /></RouteProtegee>} />
        <Route path="/chantiers" element={<RouteProtegee><Chantiers /></RouteProtegee>} />
        <Route path="/taches" element={<RouteProtegee><Taches /></RouteProtegee>} />
        <Route path="/documents" element={<RouteProtegee><Documents /></RouteProtegee>} />
        <Route path="/utilisateurs" element={<RouteProtegee><Utilisateurs /></RouteProtegee>} />
        {/* Toute autre adresse renvoie vers la connexion */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
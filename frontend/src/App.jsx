// src/App.jsx — navigation principale
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Projets from "./pages/Projets";
import Chantiers from "./pages/Chantiers";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/projets" element={<Projets />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="*" element={<Navigate to="/login" />} />
        <Route path="/chantiers" element={<Chantiers />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
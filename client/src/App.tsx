import { Routes, Route, Navigate, Link } from "react-router-dom";
import LoginPage from "./pages/LoginPage.tsx";
import RegisterPage from "./pages/RegisterPage.tsx";
import CityPage from "./pages/CityPage.tsx";

export default function App() {
  return (
    <div style={{ maxWidth: 720, margin: "40px auto", padding: 16 }}>
      <nav style={{ display: "flex", gap: 12, marginBottom: 20 }}>
        <Link to="/login">Login</Link>
        <Link to="/register">Register</Link>
      </nav>

      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/city" element={<CityPage />} />
      </Routes>
    </div>
  );
}

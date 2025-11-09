import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children }) {
  const { user } = useAuth();

  if (user === null) {
    // Aún no sabemos si está autenticado (esperando verificación)
    return <div>Cargando...</div>;
  }

  if (!user) {
    // Si no hay usuario autenticado, redirige al inicio o login
    return <Navigate to="/" replace />;
  }
  if(user?.rol!=="Admin"){
    return <Navigate to="/profile" replace />;
  }

  // Si hay usuario autenticado, renderiza el contenido protegido
  return children;
}
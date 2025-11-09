import { Navigate,useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children }) {
  const { usuario } = useAuth();
  const location = useLocation();

  if (usuario === null) {
    // Aún no sabemos si está autenticado (esperando verificación)
    return <div>Cargando...</div>;
  }

  if (!usuario) {
    // Si no hay usuario autenticado, redirige al inicio o login
    return <Navigate to="/login" replace state={{ from: location }}/>;
  }
  if(location.pathname.startsWith("/admin") && usuario?.rol!=="Admin"){
    return <Navigate to="/profile" replace />;
  }

  // Si hay usuario autenticado, renderiza el contenido protegido
  return children;
}
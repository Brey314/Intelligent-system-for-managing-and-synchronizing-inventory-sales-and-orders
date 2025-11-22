import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children }) {
  const { usuario, loading} = useAuth();
  const location = useLocation();

  // 1. Usuario aún no cargado (null)
  if (loading) {
    return <div>Cargando...</div>;
  }

  // 2. Usuario autenticado intentando acceder a login/register
  if (
    (location.pathname.startsWith("/login") ||
     location.pathname.startsWith("/register")) &&
    usuario
  ) {
    return <Navigate to="/profile" replace />;
  }

  // 3. Usuario no autenticado
  if (!usuario) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  // 4. Usuario sin permisos de admin
  if (location.pathname.startsWith("/admin") && usuario?.rol !== "Admin") {
    return <Navigate to="/profile" replace />;
  }

  // 5. Todo OK → mostrar children
  return children;
}

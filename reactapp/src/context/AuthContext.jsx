import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

const api=process.env.REACT_APP_API_URL;
export const AuthProvider = ({ children }) => {
  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(true);

  // Verificar sesión activa al cargar la app
  useEffect(() => {
    const checkSession = async () => {
      try {
        console.log("AuthContext: Checking session...");
        const resp = await fetch(`${api}/api/usuarios/check`, {
          credentials: "include",
        });
        console.log("AuthContext: Check response status:", resp.status);

        if (!resp.ok) throw new Error("Sesión no válida");
        const data = await resp.json();
        console.log("AuthContext: Session valid, user:", data.usuario);
        setUsuario(data.usuario);
      } catch (err) {
        console.error("AuthContext: Session check failed:", err);
        setUsuario(null);
      } finally {
        setLoading(false);
      }
    };

    checkSession();
  }, []);

  const login = (userData) => {
    setUsuario(userData);
  };

  const logout = async () => {
    console.log("Frontend logout: Calling backend logout");
    try {
      const resp = await fetch(`${api}/api/usuarios/logout`, {
        method: "POST",
        credentials: "include",
      });
      console.log("Frontend logout: Backend response status:", resp.status);
      const data = await resp.json();
      console.log("Frontend logout: Response data:", data);
    } catch (err) {
      console.error("Frontend logout: Error calling logout:", err);
    }
    console.log("Frontend logout: Setting usuario to null");
    setUsuario(null);
  };

  return (
    <AuthContext.Provider value={{ usuario, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

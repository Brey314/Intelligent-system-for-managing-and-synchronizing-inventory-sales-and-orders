import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(true);

  // Verificar sesión activa al cargar la app
  useEffect(() => {
    const checkSession = async () => {
      try {
        const resp = await fetch("http://localhost:5000/api/usuarios/check", {
          credentials: "include",
        });

        if (!resp.ok) throw new Error("Sesión no válida");
        const data = await resp.json();
        setUsuario(data.usuario);
      } catch (err) {
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
    await fetch("http://localhost:5000/api/usuarios/logout", {
      method: "POST",
      credentials: "include",
    });
    setUsuario(null);
  };

  return (
    <AuthContext.Provider value={{ usuario, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

import "./css/form.css";
import { FaUser } from "react-icons/fa";
import { useState } from "react";
import { useNavigate ,Link} from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const api=process.env.REACT_APP_API_URL;
export default function Login() {
  const [usuario, setUsuario] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const resp = await fetch(`${api}/api/usuarios/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user: usuario, pass: password }),
        credentials: "include",
      });

      const data = await resp.json();
      if (!resp.ok) throw new Error(data.error);

      login(data.usuario);

      alert("Inicio de sesión exitoso");

      // Redirigir según rol
      navigate(data.usuario.rol === "Admin" ? "/admin" : "/");
    } catch (err) {
      alert(err.message || "Error en el inicio de sesión");
    }
  };

  return (
  <>
  {/* Header */}
  <header className="header">
    <div className="container">
      <div className="logo">
        <Link to="/">
          <img src="/assets/img/logo.svg.png" alt="Ktronix" />
        </Link>
      </div>
      <nav className="navbar">
        <ul>
          <li><Link className="btnH" to="/">Inicio</Link></li>
          <li><Link className="btnH" to="/search">Productos</Link></li>
          <li>
            <a className="btnH" id="login-btn" href="/Register">
              <FaUser /> Registrarse
            </a>
          </li>
        </ul>
      </nav>
    </div>
  </header>

  {/* Login Form */}
  <div className="containerLogin">
    <div className="login-form">
      <h1 className="title">Inicio sesión</h1>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="usuario">Usuario:</label>
          <input
            type="text"
            id="usuario"
            name="usuario"
            placeholder="Tu Usuario"
            value={usuario}
            onChange={(e) => setUsuario(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Contraseña:</label>
          <input
            type="password"
            id="password"
            name="password"
            placeholder="Tu Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="submit-btn">
          ENVIAR
        </button>
      </form>

      <p className="register-link">
        ¿No tienes cuenta?{" "}
        <a href="/Register" className="link">
          Regístrate aquí
        </a>
      </p>
    </div>
  </div>
</>
);
}
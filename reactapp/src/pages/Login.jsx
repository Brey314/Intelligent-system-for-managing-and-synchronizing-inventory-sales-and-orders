import "./css/form.css"; // copia aquí tu CSS
import { FaUser } from "react-icons/fa";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [usuario, setUsuario] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault(); // evita que se recargue la página
    if (usuario === "admin" && password === "admin") {
      navigate("/admin");
    } else {
      alert("Usuario o contraseña incorrectos");
    }
  };

  return (
  <>
  {/* Header */}
  <header className="header">
    <div className="container">
      <div className="logo">
        <a href="index.html">
          <img src="/assets/img/logo.svg.png" alt="Ktronix" />
        </a>
      </div>
      <nav className="navbar">
        <ul>
          <li><a href="/#inicio">Inicio</a></li>
          <li><a href="/search">Productos</a></li>
          <li>
            <a id="login-btn" href="/login">
              <FaUser /> Iniciar Sesión
            </a>
          </li>
          <li>
            <a href="/shoppingcart">
              <img src="/assets/img/carrito.png" alt="Carrito de compras" />
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
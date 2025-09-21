import React from "react";
import "./App.css";
import { FaUser } from "react-icons/fa";

function App() {
  return (
    <>
      {/* Header */}
      <header>
        <div className="container">
          <div className="logo">
            <a href="index.html">
              <img src="/assets/logo.svg.png" alt="Ktronix" />
            </a>
          </div>
          <nav className="navbar">
            <ul>
              <li>
                <a href="#inicio">Inicio</a>
              </li>
              <li>
                <a href="search.html">Productos</a>
              </li>
              <li>
                <a href="#contacto">Contacto</a>
              </li>
              <li>
                <a id="login-btn" href="login.html">
                  <FaUser /> Iniciar Sesión
                </a>
              </li>
              <li>
                <a href="shoppingcart.html">
                  <img src="/assets/carrito.png" alt="Carrito de compras" />
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section id="inicio" className="hero">
        <div className="container1">
          <div className="hero-text">
            <h1>Bienvenido a Ktronix</h1>
            <p>Los mejores productos tecnológicos al mejor precio</p>
            <button
              id="search"
              className="btn"
              onClick={() => (window.location.href = "search.html")}
            >
              <h2>BUSCAR</h2>
            </button>
          </div>
          <div className="hero-img">
            <img src="/assets/personaHero.png" alt="Una persona" />
          </div>
        </div>
      </section>

      {/* Contacto */}
      <section id="contacto" className="contact">
        <div className="container2">
          <h1>Contacto</h1>
          <div className="form-group">
            <h2 htmlFor="name">Nombre:</h2>
            <input type="text" id="name" required />
            <h2 htmlFor="email">Email:</h2>
            <input type="email" id="email" required />
            <h2 htmlFor="message">Mensaje:</h2>
            <textarea id="message" required></textarea>
          </div>
          <div className="submitbtn">
            <button type="submit" className="btn">
              <h2>ENVIAR</h2>
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer"></footer>
    </>
  );
}

export default App;

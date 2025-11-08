import "./css/home.css";
import { FaUser } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import { Link,useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();
  const { usuario, logout} = useAuth();
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
            <li><a href="/#inicio">Inicio</a></li>
            <li><Link to="/search">Productos</Link></li>
            <li><a href="/#contacto">Contacto</a></li>
            <li>
                {usuario ? (
                    <div>
                        <p>Bienvenido, <strong>{usuario.user}</strong></p>
                        <button onClick={logout}>Cerrar sesión</button>
                    </div>
                ) : (
                    <Link id="login-btn" to="/login">
                        <FaUser /> Iniciar Sesión
                    </Link>
                )}
              </li>
            <li>
              <Link to="/shoppingCart">
                <img src="/assets/img/carrito.png" alt="Carrito de compras" />
              </Link>
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
            onClick={() => navigate("/search")}
          >
            
          <h2>BUSCAR</h2>
          </button>
        </div>
      <div className="hero-img">
        <img src="/assets/img/personaHero.png" alt="Una persona" />
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

export default Home;

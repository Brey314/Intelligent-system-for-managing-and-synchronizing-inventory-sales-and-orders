import { Link } from "react-router-dom";
import { FaUser } from "react-icons/fa";
import "./css/form.css"; // Importas tu CSS original

function Register() {
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
            <li><a href="/#contacto">Contacto</a></li>
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

    <main>
        <div className="containerLogin">
            <div className="login-form">
                <h1 className="title">Crear Cuenta</h1>

                <form>
                    <div className="form-group">
                        <label htmlFor="name">Nombre Completo:</label>
                        <input type="text" id="name" name="usuario" placeholder="Tu Nombre Completo" required />
                    </div>

                    <div className="form-group">
                        <label htmlFor="email">Correo Electrónico:</label>
                        <input type="text" id="email" name="email" placeholder="Tu Correo" required />
                    </div>

                    <div className="form-group">
                        <label htmlFor="user">Usuario:</label>
                        <input type="text" id="user" name="user" placeholder="Tu Usuario" required />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Contraseña:</label>
                        <input type="password" id="password" name="password" placeholder="Tu Contraseña" required />
                    </div>

                    <button type="submit" className="submit-btn">ENVIAR</button>
                </form>

                <p className="register-link">
                    ¿Ya tienes cuenta? <Link to="/Login" className="link">Inicia sesión aquí</Link>
                </p>
            </div>
        </div>
    </main>
    </>
    );
    }

export default Register;

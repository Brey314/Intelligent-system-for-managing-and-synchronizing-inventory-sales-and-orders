import { Link } from "react-router-dom";
import { FaUser } from "react-icons/fa";
import { useState } from "react";
import "./css/form.css"; // Importas tu CSS original

const apiURL = "http://localhost:5000/api/usuarios";

function Register() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [newUser, setNewUser] = useState({
      name: "",
      email:"",
      user: "",
      pass: "",
      rol: "Consumer",
    });
  
  const handleSearch = async (e) => {
    e.preventDefault();
    setUsers([]);
    try {
      const url =apiURL;
      const respuesta = await fetch(url);
      if (!respuesta.ok) throw new Error(`Error HTTP: ${respuesta.status}`);
      const data = await respuesta.json();
      setUsers(data);
    } catch (err) {
      setError("Error al cargar los productos. Intenta nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  const saveNewUser = async () => {
    try {
      const resp = await fetch(`${apiURL}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newUser),
      });
      if (!resp.ok) throw new Error("Error al registrarse");

      const creado = await resp.json();
      setUsers((prev) => [...prev, creado]);
      setNewUser({ name: "",email:"", user: "", pass: "",rol: "Consumer" });
    } catch (err) {
      console.error("error",err);
      alert(" No se pudo crear el usuario");
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
                        <input 
                          type="text" 
                          value={newUser.name}
                          id="name" 
                          name="usuario" 
                          onChange={(e) =>
                            setNewUser({ ...newUser, name: e.target.value })
                          }
                          placeholder="Tu Nombre Completo" 
                          required />
                    </div>

                    <div className="form-group">
                        <label htmlFor="email">Correo Electrónico:</label>
                        <input 
                          type="text" 
                          value={newUser.email}
                          id="email" 
                          name="email" 
                          onChange={(e) =>
                            setNewUser({ ...newUser, email: e.target.value })
                          }
                          placeholder="Tu Email" 
                          required />
                    </div>

                    <div className="form-group">
                        <label htmlFor="user">Usuario:</label>
                        <input 
                          type="text" 
                          value={newUser.user}
                          id="user" 
                          name="user" 
                          onChange={(e) =>
                            setNewUser({ ...newUser, user: e.target.value })
                          }
                          placeholder="Tu Usuario" 
                          required />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Contraseña:</label>
                        <input 
                          type="password" 
                          value={newUser.pass}
                          id="password" 
                          name="password" 
                          onChange={(e) =>
                            setNewUser({ ...newUser, pass: e.target.value })
                          }
                          placeholder="Tu Contraseña" 
                          required />
                    </div>

                    <Link type="submit" className="submit-btn" onClick={saveNewUser} to="/Login">ENVIAR</Link>
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

import { motion } from "framer-motion";
import { useParams, Link ,useNavigate} from "react-router-dom";
import { useEffect, useState } from "react";
import "./css/payInfo.css";
import { useAuth } from "../context/AuthContext";
import { FaUser } from "react-icons/fa";

const api=process.env.REACT_APP_API_URL;
export default function SuccessPage() {
  const { id } = useParams();
  const [session, setSession] = useState(null);

  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { usuario, logout} = useAuth();

  const [countdown, setCountdown] = useState(10);

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const res = await fetch(`${api}/api/payment/session/${id}`);
        const data = await res.json();
        setSession(data);
      } catch (error) {
        console.error("Error loading session:", error);
      }
    };
    fetchSession();
  }, [id]);

  useEffect(() => {
    if (session) {
      const interval = setInterval(() => {
        setCountdown((prev) => {
            if (prev <= 1) {
                navigate("/profile");
                return 0;
            }
            return prev - 1;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [session, navigate]);

  return (

    <>
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
            <li 
              className="usuario-menu-container"
              onMouseEnter={() => setOpen(true)}
              onMouseLeave={() => setOpen(false)}
            >
              {usuario ? (
                <a className="btnH">
                  Bienvenido, <strong>{usuario.user}</strong>
                </a>
              ) : (
                <Link className="btnH" id="login-btn" to="/login">
                  <FaUser /> Iniciar Sesión
                </Link>
              )}

              {usuario && open && (
                <div className="usuario-dropdown">
                  {usuario.rol === "Admin" ? (
                    <Link to="/admin" className="dropdown-item">Administrar</Link>
                  ) : null}
                  <Link to="/profile" className="dropdown-item">Perfil</Link>
                  <button onClick={logout} className="dropdown-item">Cerrar sesión</button>
                </div>
              )}
            </li>
            <li>
              <Link to="/shoppingcart">
                <img src="/assets/img/carrito.png" alt="Carrito de compras" />
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
    <div className="page-container">

      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.7 }}
        className="card"
      >
        <motion.div
          initial={{ rotate: -180, opacity: 0 }}
          animate={{ rotate: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.8, type: "spring" }}
          className="icon-success"
        >
          ✓
        </motion.div>

        <h1 >¡Pago exitoso!</h1>
        <p >Gracias por tu compra 😊</p>

        {session ? (
          <div className="details-box">
            <p><b>Monto:</b> {(session.amount_total / 100).toLocaleString()} COP</p>
            <p><b>Email:</b> {session.customer_details?.email}</p>
            <p><b>Estado:</b> {session.payment_status}<b>Con: </b>{session.payment_method_types[0]}</p>
            <p className="redirect-msg">
                Serás redirigido al a tu perfil en {countdown} segundos...
            </p>
          </div>
        ) : (
          <p className="back-btn">Cargando detalles...</p>
        )}
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        <Link to="/">Volver al inicio</Link>
      </motion.div>
    </div>
    </>
  );
}

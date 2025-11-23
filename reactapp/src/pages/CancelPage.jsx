import { motion } from "framer-motion";
import { useParams, Link ,useNavigate} from "react-router-dom";
import { useEffect, useState } from "react";
import "./css/payInfo.css";
import { useAuth } from "../context/AuthContext";
import { FaUser } from "react-icons/fa";

export default function CancelPage() {

    const [open, setOpen] = useState(false);
    const [countdown, setCountdown] = useState(10);
    const navigate = useNavigate();
    const { usuario, logout} = useAuth();
    useEffect(() => {
        const interval = setInterval(() => {
            setCountdown((prev) => {
                if (prev <= 1) {
                    navigate("/");
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [navigate]);
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
                <li><Link className="btnH" to="/#inicio">Inicio</Link></li>
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
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="card"
        >
            <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", duration: 0.6 }}
            className="icon-cancel"
            >
            ✕
            </motion.div>

            <h1>Pago cancelado</h1>
            <p>Tu transacción no se completó.</p>
            <p className="redirect-msg">
                Serás redirigido al inicio en {countdown} segundos...
            </p>
            <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            >
            Puedes volver a intentarlo cuando quieras.
            </motion.p>
        </motion.div>

        <motion.Link
            to="/"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
        >
            Volver al inicio
        </motion.Link>
        </div>
    </>
  );
}

import { useState } from "react";
import { FaUser } from "react-icons/fa";
import "./css/search.css"; // Importas tu CSS
import { useAuth } from "../context/AuthContext";
import { Link,useNavigate } from "react-router-dom";

const apiURL = "http://localhost:5000/api/productos";

function Search() {
    const navigate = useNavigate();
    const { usuario, logout} = useAuth();
    const [productos, setProductos] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSearch = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setProductos([]);

        try {
            const url = searchTerm
            ? `${apiURL}?title=${encodeURIComponent(searchTerm)}`
            : apiURL;
            console.log(url)
            const respuesta = await fetch(url);
            if (!respuesta.ok) throw new Error(`Error HTTP: ${respuesta.status}`);
            const data = await respuesta.json();
            setProductos(data);
            } catch (err) {
                console.error("Error:", err);
                setError("Error al cargar los productos. Intenta nuevamente.");
            } finally {
                setLoading(false);
        }
    };

    const addToCart = async (prod) => {
        if (!usuario) {
            navigate("/Login");
        } else {
        try {
            console.log(usuario.id);
            const producto = {
                _id: prod._id,
                idUser:usuario.id,
                title: prod.title,
                description: prod.description,
                price: prod.price,
                image: prod.image,
                category: prod.category,
                stock: prod.stock,
                cuantity: 1,
                creation_date: prod.creation_date,
            };

            const resp = await fetch("http://localhost:5000/api/carrito");
            const data = await resp.json();
            const exist = data.find((item) => item._id === producto._id);

            
            if (exist) {
                // Si existe, aumentar la cantidad
                const nuevaCantidad = exist.cuantity + 1;

                await fetch(`http://localhost:5000/api/carrito/${producto._id}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ cuantity: nuevaCantidad }),
                });
            } else {
                // Si no existe, agregarlo al carrito
                await fetch("http://localhost:5000/api/carrito/", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(producto),
                });
            }
            alert(`${producto.title} agregado al carrito`);
            console.log(data);
        } catch (err) {
            console.error("Error al enviar producto:", err);
        }
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
                    <li><a href="/#inicio">Inicio</a></li>
                    <li><Link to="/search">Productos</Link></li>
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
                        <Link to="/shoppingcart">
                            <img src="/assets/img/carrito.png" alt="Carrito de compras" />
                        </Link>
                    </li>
                </ul>
                </nav>
            </div>
        </header>

        <main className="product">
            
            <form id="Ktronix-form" onSubmit={handleSearch}>
                <div className="search">
                    <input
                        type="text"
                        id="Busqueda"
                        placeholder="Ej: Mouse Gamer"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="searchbar"
                    />
                    <button type="submit" className="btn">
                        Buscar Productos
                    </button>
                </div>
            </form>
            

            <div id="productos" className="grid">
                {loading && <p>Cargando productos...</p>}
                {error && <p>{error}</p>}
                {!loading && productos.length === 0 }

                {productos.map((prod) => (
                    <div key={prod._id} className="card">
                        <img src={prod.image} alt={prod.title} loading="lazy" />
                        <h3>{prod.title}</h3>
                        <h4>COP {prod.price.toLocaleString()} $</h4>
                        <small>Categoría: {prod.category}</small>
                        <button
                            type="button"
                            className="btnP"
                            onClick={() => addToCart(prod)}
                        >
                        Enviar al Carrito
                        </button>
                    </div>
                ))}
            </div>
        </main>
        </>
        );
}

export default Search;

import { useState } from "react";
import { Link } from "react-router-dom";
import { FaUser } from "react-icons/fa";
import "./css/search.css"; // Importas tu CSS

const apiURL = "http://localhost:5000/api/productos";

function Search() {
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
        try {
            const producto = {
                _id: prod._id,
                title: prod.title,
                descripcion: prod.descripcion,
                precio: prod.precio,
                image: prod.image,
                category: prod.category,
                stock: prod.stock,
                creation_date: prod.creation_date,
            };

            const resp = await fetch("http://localhost:1000/api/cart", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(producto),
            });

            const data = await resp.json();
            alert(`${producto.title} agregado al carrito`);
            console.log(data);
            } catch (err) {
                console.error("Error al enviar producto:", err);
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
                        <h4>COP {prod.precio} $</h4>
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

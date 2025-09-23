import { useEffect, useState } from "react";
import { FaUser } from "react-icons/fa";
import "./css/shoppingcart.css";

function ShoppingCart() {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);

  // Cargar carrito
  useEffect(() => {
    const cargarCarrito = async () => {
      try {
        const answ = await fetch("http://localhost:1000/api/cart");
        const data = await answ.json();
        setCart(data);
      } catch (err) {
        console.error("Error cargando carrito:", err);
      } finally {
        setLoading(false);
      }
    };

    cargarCarrito();
  }, []);

  // Eliminar producto
  const eliminarDelCarrito = async (id) => {
    try {
      await fetch(`http://localhost:1000/api/cart/${id}`, { method: "DELETE" });
      setCart(cart.filter((prod) => prod.id !== id));
    } catch (err) {
      console.error("Error eliminando producto:", err);
    }
  };

  return (
    <>
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
    <main className="shopcart">

      <div id="productoss">
        {loading && <p>Cargando carrito...</p>}

        {!loading && cart.length === 0 && <p>No hay productos en el carrito</p>}

        {cart.map((prod) => (
          <div key={prod.id} className="cart-item">
            {/* Imagen del producto */}
            <div className="cart-item-image">
              <img src={prod.image[0]} alt={prod.title} loading="lazy" />
            </div>

            {/* Información */}
            <div className="cart-item-info">
              <h3>{prod.title}</h3>
              <p className="price">COP {prod.price.toLocaleString()} $</p>
              <p className="available">Disponible</p>

              <div className="cart-item-actions">
                <div className="quantity">
                  <button>-</button>
                  <span>1</span>
                  <button>+</button>
                </div>
                <button
                  onClick={() => eliminarDelCarrito(prod.id)}
                  className="delete-btn"
                >
                  Eliminar
                </button>
                <button className="save-btn">Guardar para más tarde</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </main>
    </>
  );
}

export default ShoppingCart;

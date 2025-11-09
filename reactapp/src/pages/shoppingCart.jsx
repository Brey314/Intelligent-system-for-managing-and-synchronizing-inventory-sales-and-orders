import { useEffect, useState } from "react";
import "./css/shoppingcart.css";
import { useAuth } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";

const apiURL = "http://localhost:5000/api/carrito";

function ShoppingCart() {
  const navigate = useNavigate();
  const { usuario, logout } = useAuth();
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [subtotal, setSubtotal] = useState(0);
  const [cuantity, setCantidad] = useState(0);

  const iduser = usuario?.id;
  
  // función auxiliar para obtener URL con idUser
  const getUserUrl = () =>
    iduser ? `${apiURL}?idUser=${encodeURIComponent(iduser)}` : apiURL;

  //  Cargar carrito
  useEffect(() => {
    const cargarCarrito = async () => {
      try {
        console.log(usuario);
        const answ = await fetch(getUserUrl());
        const data = await answ.json();
        
        setCart(data);
      } catch (err) {
        console.error("Error cargando carrito:", err);
      } finally {
        setLoading(false);
      }
    };

    if (iduser) cargarCarrito();
  }, [iduser]); // <-- vuelve a cargar si cambia el usuario

  // Eliminar producto
  const eliminarDelCarrito = async (_id) => {
    try {
      await fetch(`${getUserUrl()}/${_id}`, { method: "DELETE" });
      setCart((prevCart) => prevCart.filter((prod) => prod._id !== _id));
      calcularTotales(cart.filter((prod) => prod._id !== _id));
    } catch (err) {
      console.error("Error eliminando producto:", err);
    }
  };

  // Cambiar cantidad
  const cambiarCantidad = async (_id, cuantity, op) => {
    try {
      let newcuantity = cuantity;
      if (op === "+") newcuantity++;
      else if (cuantity > 1) newcuantity--;
      else {
        eliminarDelCarrito(_id);
        return;
      }

      await fetch(`${apiURL}/${_id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cuantity: newcuantity }),
      });

      setCart((prevCart) => {
        const nuevoCarrito = prevCart.map((prod) =>
          prod._id === _id ? { ...prod, cuantity: newcuantity } : prod
        );
        calcularTotales(nuevoCarrito);
        return nuevoCarrito;
      });
    } catch (err) {
      console.error("Error cambiando cantidad", err);
    }
  };

  //  Calcular totales
  const calcularTotales = (productos) => {
    let sumaPrecio = 0;
    let sumaCantidad = 0;
    productos.forEach((prod) => {
      sumaPrecio += prod.price * prod.cuantity;
      sumaCantidad += prod.cuantity;
    });
    setSubtotal(sumaPrecio);
    setCantidad(sumaCantidad);
  };

  //  Obtener totales desde el backend (por idUser)
  const obtenerPrecio = async () => {
    try {
      const answ = await fetch(getUserUrl());
      const data = await answ.json();
      let suma = 0;
      data.forEach((p) => (suma += p.price * p.cuantity));
      setSubtotal(suma);
    } catch (err) {
      console.error("Error calculando subtotal", err);
    }
  };

  const obtenerCantidad = async () => {
    try {
      const answ = await fetch(getUserUrl());
      const data = await answ.json();
      let suma = 0;
      data.forEach((p) => (suma += p.cuantity));
      setCantidad(suma);
    } catch (err) {
      console.error("Error calculando cantidad", err);
    }
  };

  useEffect(() => {
    if (iduser) {
      obtenerPrecio();
      obtenerCantidad();
    }
  }, [iduser, cart]);

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
              <li>
                <Link to="/">Inicio</Link>
              </li>
              <li>
                <Link to="/search">Productos</Link>
              </li>
              <li>
                <p>Bienvenido {usuario?.user}</p>
              </li>
              <li>
                <Link onClick={logout} to="/">
                  Cerrar sesión
                </Link>
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

      <main className="shopcart">
        <div className="body">
          <div id="productoss">
            {loading && <p className="infoCart">Cargando carrito...</p>}
            {!loading && cart.length === 0 && (
              <p className="infoCart">No hay productos en el carrito</p>
            )}
            {cart.map((prod) => (
              <div key={prod._id} className="cart-item">
                <div className="cart-item-image">
                  <img src={prod.image} alt={prod.title} loading="lazy" />
                </div>

                <div className="cart-item-info">
                  <h3>{prod.title}</h3>
                  <p className="price">COP {prod.price} $</p>
                  <p className="available">Disponible</p>

                  <div className="cart-item-actions">
                    <div className="quantity">
                      <button
                        onClick={() => cambiarCantidad(prod._id, prod.cuantity, "-")}
                      >
                        -
                      </button>
                      <span>{prod.cuantity}</span>
                      <button
                        onClick={() => cambiarCantidad(prod._id, prod.cuantity, "+")}
                      >
                        +
                      </button>
                    </div>
                    <button
                      onClick={() => eliminarDelCarrito(prod._id)}
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

          <div className="subtotal">
            <div className="text">
              <h2>
                Subtotal ({cuantity} productos):
              </h2>
              <h1>COP {subtotal} $</h1>
            </div>
            <button className="pay">Proceder al pago</button>
          </div>
        </div>
      </main>
    </>
  );
}

export default ShoppingCart;

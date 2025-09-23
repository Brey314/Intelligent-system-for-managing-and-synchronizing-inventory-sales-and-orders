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
  const eliminarDelCarrito = async (_id) => {
    try {
      await fetch(`http://localhost:1000/api/cart/${_id}`, { method: "DELETE" });
      setCart(cart.filter((prod) => prod._id !== _id));
    } catch (err) {
      console.error("Error eliminando producto:", err);
    }
  };

  const cambiarCantidad = async(_id,cuantity,op)=>{
    try {
      let newcuantity=cuantity
      if(op==="+"){
        newcuantity=cuantity+1;
      }else{
        if(cuantity>1){
          newcuantity=cuantity-1;
        }else{
          eliminarDelCarrito(_id);
        }
      }
      await fetch(`http://localhost:1000/api/cart/${_id}`, {
        method: "PUT", 
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cuantity: newcuantity }),
      });

      setCart((prevCart) =>
      prevCart.map((prod) =>
        prod._id === _id ? { ...prod, cuantity: newcuantity } : prod
      )
    );
    } catch (err) {
      console.error("Error aumentando cantidad",err)
    }
  }
  const [subtotal, setSubtotal] = useState(0);
  const obtenerPrecio = async () => {
    try {
      const answ = await fetch("http://localhost:1000/api/cart/");
      const data = await answ.json();
      let suma = 0;
      data.forEach(produ => {
        suma += (produ.price*produ.cuantity);
      });
      setSubtotal(suma);
    } catch (err) {
      console.error("Error calculando subtotal", err);
    }
  };

    // Llamamos la función cuando cargue el componente
  useEffect(() => {
    obtenerPrecio();
  }, []);

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
        
          {loading && <p className="infoCart">Cargando carrito...</p>}
          {!loading && cart.length === 0 && <p className="infoCart">No hay productos en el carrito</p>}
        
        {cart.map((prod) => (
          <div key={prod._id} className="cart-item">
            {/* Imagen del producto */}
            <div className="cart-item-image">
              <img src={prod.image} alt={prod.title} loading="lazy" />
            </div>

            {/* Información */}
            <div className="cart-item-info">
              <h3>{prod.title}</h3>
              <p className="price">COP {prod.price.toLocaleString()} $</p>
              <p className="available">Disponible</p>

              <div className="cart-item-actions">
                <div className="quantity">
                  <button
                    onClick={()=> cambiarCantidad(prod._id, prod.cuantity, "-")}
                  >-</button>
                  <span>{prod.cuantity}</span>
                  <button
                    onClick={()=> cambiarCantidad(prod._id, prod.cuantity, "+")}
                  >+</button>
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
              Subtotal( productos):
            </h2>
            <h1>
              COP {subtotal.toLocaleString()} $
            </h1>
          </div>
          <button>
            Proceder al pago
          </button>
        </div>
    </main>
    </>
  );
}

export default ShoppingCart;

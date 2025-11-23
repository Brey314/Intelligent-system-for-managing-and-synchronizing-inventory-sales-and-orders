import { useEffect, useState } from "react";
import "./css/shoppingcart.css";
import { useAuth } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";

const api=process.env.REACT_APP_API_URL;
const apiURL = `${api}/api/carrito`;

function ShoppingCart() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { usuario, logout } = useAuth();
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);

  const [subtotal, setSubtotal] = useState(0);
  const [cuantity, setCantidad] = useState(0);

  const [Address, setAddress] = useState(null);
  const [addressLoading, setAddressLoading] = useState(true);

  const [showAddressModal, setShowAddressModal] = useState(false); // Controla la visibilidad del modal
  const [selectedAddressIndex, setSelectedAddressIndex] = useState(0); // Índice de la dirección seleccionada
  
  // función auxiliar para obtener URL con idUser

  //  Cargar carrito


  // Eliminar producto
  const eliminarDelCarrito = async (_id) => {
    try {
      await fetch(`${apiURL}/${_id}`, {
        method: "DELETE",
        credentials: "include"
      });
      setCart((prevCart) => prevCart.filter((prod) => prod._id !== _id));
      calcularTotales(cart.filter((prod) => prod._id !== _id));
    } catch (err) {
      console.error("Error eliminando producto:", err);
    }
  };

  // Cambiar cantidad
  const cambiarCantidad = async (_id, cuantity,stock, op) => {
    try {
      let newcuantity = cuantity;
      if (op === "+") newcuantity++;
      else if (cuantity > 1) newcuantity--;
      else if (cuantity===stock) return;
      else {
        eliminarDelCarrito(_id);
        return;
      }

      await fetch(`${apiURL}/${_id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cuantity: newcuantity }),
        credentials: "include"
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
      const answ = await fetch(apiURL, {
        credentials: "include"
      });
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
      const answ = await fetch(apiURL, {
        credentials: "include"
      });
      const data = await answ.json();
      let suma = 0;
      data.forEach((p) => (suma += p.cuantity));
      setCantidad(suma);
    } catch (err) {
      console.error("Error calculando cantidad", err);
    }
  };


  const checkout = async () => {
    const selected = Address[selectedAddressIndex]
    if(cart.length===0){
      alert("No hay productos en el carrito"); 
      return;
    }
    if(!selected){
      alert("Agrega una dirección de envío"); 
      return;
    }
    const items = cart.map(prod => ({
      _id: prod._id,
      productId: prod.idProd,
      addressId: selected._id,
      name: prod.title,
      unit_amount: prod.price,
      quantity: prod.cuantity,
      total: subtotal,
      currency: "cop"
    }));
    if (!window.confirm("Asegurate de que tus datos en la dirección de envío esten bien")) return;

    const res = await fetch(`${api}/api/create-checkout-session`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        items,
        success_url: "http://localhost:3000/success/{CHECKOUT_SESSION_ID}",
        cancel_url: "http://localhost:3000/cancel"
      })
    });

    const data = await res.json();
    if (data.url) {
      window.location.href = data.url; // redirige a Stripe Checkout
    } else {
      console.error("No session url returned", data);
    }
  };



  const handleAddressSelection = (index) => {
    setSelectedAddressIndex(index);
    setShowAddressModal(false); // Cierra el modal al seleccionar
  };

  const renderAddressCard = () => {
    console.log("ShoppingCart: renderAddressCard called, Address:", Address, "addressLoading:", addressLoading);
    if (addressLoading) {
      return <div className="shipping-card-container"><p>Cargando dirección...</p></div>;
    }

    if (!Address || Address.length === 0) {
      return (
        <div className="shipping-card-container no-address">
          <p className="no-address-text">No hay dirección de envío registrada.</p>
          <button className="btn-add-address" onClick={() => {navigate("/profile");}}>
            + Agregar Dirección
          </button>
        </div>
      );
    }
    const selected = Address[selectedAddressIndex] || Address[0];
    return (
        <div className="shipping-card-container">
          <div className="shipping-card-header">
            <h3>Dirección de Envío</h3>
            <span className="change-link" onClick={() => setShowAddressModal(true)}>
              Cambiar
            </span>
          </div>
          <p className="address-info-name">
            {selected.name}
          </p>
          <p className="address-info-line">
            {selected.address}
          </p>
          <p className="address-info-line">
            {selected.city}, {selected.country} {selected.postalCode}
          </p>
          <p className="address-info-line">
            Teléfono: {selected.phone}
          </p>
        </div>
    );
  };

  const renderAddressModal = () => {
    if (!showAddressModal) return null;

    return (
      <div className="modal-overlay" onClick={() => setShowAddressModal(false)}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <h2>Selecciona una Dirección</h2>
          <div className="address-grid">
            {Address.map((dir, index) => (
              <div 
                key={dir._id} 
                className={`modal-address-item ${index === selectedAddressIndex ? 'selected' : ''}`}
                onClick={() => handleAddressSelection(index)} // Haz clic en la tarjeta para seleccionar
              >
                <div className="radio-button-container">
                  <input
                    type="radio"
                    name="addressSelection"
                    checked={index === selectedAddressIndex}
                    onChange={() => handleAddressSelection(index)} // Actualiza al cambiar el radio
                  />
                  <span className="radio-custom"></span>
                  <div className="address-details">
                    <p className="address-name-modal">
                      {dir.name} 
                      {index === selectedAddressIndex && <span className="current-indicator">(Actual)</span>}
                    </p>
                    <p>{dir.address}</p>
                    <p>{dir.city}, {dir.country}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <button className="btn-close-modal" onClick={() => {navigate("/profile")}}>Agregar Mas</button>
          <button className="btn-close-modal" onClick={() => setShowAddressModal(false)}>Cerrar</button>
        </div>
      </div>
    );
  };

  useEffect(() => {
    console.log("ShoppingCart: useEffect triggered, usuario:", usuario);
    const cargarCarrito = async () => {
      try {
        const answ = await fetch(apiURL, {
          credentials: "include"
        });
        const data = await answ.json();
        console.log("ShoppingCart: Cart data fetched:", data);

        setCart(data);
      } catch (err) {
        console.error("Error cargando carrito:", err);
      } finally {
        setLoading(false);
      }
    };

    const getAddress = async (_id) => {
      if (!_id) return;
      setAddressLoading(true);
      console.log("ShoppingCart: Fetching addresses for user ID:", _id);
      try {
        const response = await fetch(`${api}/addresses/${_id}`,{
          credentials: "include",
          cache: 'no-cache'
        });
        console.log("ShoppingCart: Address fetch response status:", response.status);

        if (!response.ok) {
          throw new Error(`Error al obtener las direcciones: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        console.log("ShoppingCart: Addresses fetched:", data);

        setAddress(data);
      } catch (error) {
        console.error("Error al cargar la dirección de envío:", error);
        setAddress([]);
      } finally {
        setAddressLoading(false);
      }
    };

    if (usuario) {
      cargarCarrito();
      getAddress(usuario.id);
      obtenerPrecio();
      obtenerCantidad();
      setLoading(false);

    }
  }, [usuario]); // <-- vuelve a cargar si cambia el usuario

  // Refetch addresses when window gains focus
  useEffect(() => {
    const handleFocus = () => {
      if (usuario) {
        console.log("ShoppingCart: Window focused, refetching addresses");
        const refetchAddress = async () => {
          try {
            const response = await fetch(`${api}/addresses/${usuario.id}`,{
              credentials: "include",
              cache: 'no-cache'
            });
            console.log("ShoppingCart: Refetch address response status:", response.status);
            if (response.ok) {
              const data = await response.json();
              console.log("ShoppingCart: Addresses refetched on focus:", data);
              setAddress(data);
            } else {
              console.error("ShoppingCart: Refetch failed with status:", response.status, response.statusText);
            }
          } catch (error) {
            console.error("Error refetching addresses on focus:", error);
          }
        };
        refetchAddress();
      }
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [usuario]);

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
                <Link className="btnH"  to="/">Inicio</Link>
              </li>
              <li>
                <Link className="btnH" to="/search">Productos</Link>
              </li>
              <li 
                className="usuario-menu-container"
                onMouseEnter={() => setOpen(true)}
                onMouseLeave={() => setOpen(false)}
              >
                <p className="btnH">Bienvenido, <strong>{usuario?.user}</strong></p>
                {open && (
                <div className="usuario-dropdown">
                  {usuario.rol === "Admin" ? (
                    <Link to="/admin" className="dropdown-item">Administrar</Link>
                  ) : null}
                  <Link to="/profile" className="dropdown-item">Perfil</Link>
                  <button onClick={async () => { await logout(); navigate("/login"); }} className="dropdown-item">Cerrar sesión</button>
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
                  <p className="price">COP {prod.price.toLocaleString()} $</p>
                  <p className="available">Disponible</p>

                  <div className="cart-item-actions">
                    <div className="quantity">
                      <button
                        onClick={() => cambiarCantidad(prod._id, prod.cuantity,prod.stock, "-")}
                      >
                        -
                      </button>
                      <span>{prod.cuantity}</span>
                      <button
                        onClick={() => cambiarCantidad(prod._id, prod.cuantity,prod.stock, "+")}
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

        <div className="summary-sidebar">
          {renderAddressCard()} {/* <-- Renderiza la tarjeta de dirección aquí */}
          <br></br>
          <div className="subtotal">
            <div className="text">
              <h2>
                Subtotal ({cuantity} productos):
              </h2>
              <h1>COP {subtotal.toLocaleString()} $</h1>
            </div>
            <button className="pay" onClick={checkout}>Proceder al pago</button>
            </div>
          </div>
        </div>
        {renderAddressModal()}
      </main>
    </>
  );
}

export default ShoppingCart;

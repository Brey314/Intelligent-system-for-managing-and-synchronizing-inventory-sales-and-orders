import { useEffect, useState } from "react";
import "./css/profile.css";
import { useAuth } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";

const api=process.env.REACT_APP_API_URL;
function Profile() {
  const navigate = useNavigate();
  const { logout} = useAuth();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [usuario, setUsuario] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [direcciones, setDirecciones] = useState([]);

  const [editingAddress, setEditingAddress] = useState(null);
  const [newAddress, setNewAddress] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    user: "",
    rol: "",
  });
  const [addressData, setAddressData] = useState({
    name: "",
    country: "",
    city: "",
    address: "",
    postalCode: "",
    phone: ""
  })
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPedido, setSelectedPedido] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedAddress, setSelectedAddress] = useState(null);

  const [pedidos, setPedidos] = useState([]);
  const [products, setProducts] = useState([]);
  const [address, setAddress] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  //   CARGA DE PERFIL
  useEffect(() => {
    const fetchPerfil = async () => {
      try {
        const res = await fetch(`${api}/api/usuarios/perfil`, {
          method: "GET",
          credentials: "include",
        });

        if (!res.ok) throw new Error("Error autenticando");

        const data = await res.json();

        setUsuario(data);
        setFormData({
          name: data.name,
          email: data.email,
          user: data.user,
        });

        // Cargar direcciones del usuario
        cargarDirecciones(data._id);

      } catch (err) {
        console.error("Error cargando perfil:", err);
      } finally {
        setLoading(false);
      }
    };
    const cargarDirecciones = async (id) => {
      try {
        const res = await fetch(`http://localhost:5000/api/addresses/${id}`, {
          credentials: "include",
        });

        if (!res.ok) throw new Error("Error obteniendo direcciones");

        const data = await res.json();
        setDirecciones(data);

      } catch (err) {
        console.error("Error al cargar direcciones:", err);
      }
    };

    const fetchPedidos = async()=>{
      try{
        setIsLoading(true);
        const res = await fetch(`http://localhost:5000/api/pedidos`, {
          method: "GET",
          credentials: "include",
        });
        if (!res.ok) throw new Error("Error obteniendo pedidos");
        const data = await res.json();
        setPedidos(data);
        const prods = [];
        for (const item of data) {
          try {
            const id=item.idProd;
            const resp=await fetch(`http://localhost:5000/api/productos/${id}`,{
              method: "GET",
              credentials: "include",
            })
            const dataP = await resp.json();
            prods.push(dataP);
          } catch (err) {
            console.error("Error al cargar pedidos (Productos):", err);
          }
        }
        setProducts(prods);
      }catch(err){
        console.error("Error al cargar pedidos:", err);
      }finally{
        setIsLoading(false);
      }

    }
    fetchPedidos();
    fetchPerfil();
  }, []);

  //   HANDLE CHANGE
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (editMode) {
      setFormData({
        ...formData,
        [name]: value,
      });
    }

    // Si estoy editando o creando una dirección
    if (editingAddress || newAddress) {
      setAddressData({
        ...addressData,
        [name]: value,
      });
    }
  };

  //   GUARDAR PERFIL
  const guardarCambios = async () => {
    try {
      const res = await fetch(`${api}/api/usuarios/perfil`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      alert("Perfil actualizado correctamente");

      setUsuario(data.usuario);
      setEditMode(false);

    } catch (err) {
      console.error("Error al guardar:", err);
    }
  };

  //   CREAR DIRECCIÓN
  const crearDireccion = async () => {
    try {
      console.log(addressData);
      const res = await fetch(`http://localhost:5000/api/addresses`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(addressData),
      });

      const nueva = await res.json();
      setDirecciones([...direcciones, nueva]);
      setNewAddress(false);

      // Reiniciar formulario
      setAddressData({
        name: "",
        country: "",
        city: "",
        address: "",
        postalCode: "",
        phone: "",
      });

    } catch (err) {
      console.error("Error creando dirección:", err);
    }
  };

  //   EDITAR DIRECCIÓN
  const guardarDireccion = async (id) => {
    try {
      console.log(id);
      const res = await fetch(`http://localhost:5000/api/addresses/${id}`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(addressData),
      });

      const actualizada = await res.json();

      setDirecciones(
        direcciones.map((d) => (d._id === id ? actualizada : d))
      );

      setEditingAddress(null);

    } catch (err) {
      console.error("Error guardando dirección:", err);
    }
  };
  const handleOpenModal = (pedido) => {
        setSelectedPedido(pedido);
        const prod = products.find(p => p._id === pedido.idProd);
        setSelectedProduct(prod);
        const addr = direcciones.find(d => d._id === pedido.idAddress);
        setSelectedAddress(addr);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedPedido(null);
    };

  //   ELIMINAR DIRECCIÓN
  const eliminarDireccion = async (id) => {
    try {
      await fetch(`http://localhost:5000/api/addresses/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      setDirecciones(direcciones.filter((d) => d._id !== id));

    } catch (err) {
      console.error("Error eliminando dirección:", err);
    }
  };

  const PedidoDetallesModal = ({ isOpen, onClose, pedido, direccion, producto }) => {
    // Si la modal no está abierta, no renderizamos nada
    if (!isOpen) return null;

    // Usamos datos mock para la estructura, pero idealmente usarías 'pedido', 'direccion', 'producto'
    const currentPedido = pedido;
    const currentDireccion = direccion;
    const currentProducto = producto;
    
    // Formatear la fecha
    const fechaFormateada = currentPedido.creation_date ? new Date(currentPedido.creation_date).toLocaleString('es-CO', {
        year: 'numeric', month: 'long', day: 'numeric',
        hour: '2-digit', minute: '2-digit'
    }) : 'Fecha no disponible';

    // Formatear el precio
    const precioFormateado = currentPedido.total ? currentPedido.total.toLocaleString('es-CO', { style: 'currency', currency: 'COP' }) : '$0';
    const precioUnitario = currentProducto.price ? currentProducto.price.toLocaleString('es-CO', { style: 'currency', currency: 'COP' }) : '$0';

    return (
      <div className="modal-overlay" onClick={onClose}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
              <button className="modal-close-btn" onClick={onClose}>&times;</button>
              <h2 className="modal-titulo">Detalles del Pedido</h2>

              <div className="modal-grid">
                  
                  {/* Sección de Resumen del Pedido */}
                  <div className="modal-section pedido-resumen-card">
                      <h3>Resumen del Pedido</h3>
                      <p><strong>Estado:</strong> <span className={`status status-${currentPedido.status.toLowerCase()}`}>{currentPedido.status}</span></p>
                      <p><strong>Fecha de Compra:</strong> {fechaFormateada}</p>
                      <p><strong>Cantidad de Productos:</strong> {currentPedido.cuantity}</p>
                      <p className="total-destacado"><strong>Total Pagado:</strong> {precioFormateado}</p>
                  </div>

                  {/* Sección de Dirección de Envío */}
                  <div className="modal-section direccion-card">
                      <h3>Dirección de Envío</h3>
                      <p><strong>{currentDireccion.name}</strong></p>
                      <p>{currentDireccion.address}</p>
                      <p>{currentDireccion.city}, {currentDireccion.country} - {currentDireccion.postalCode}</p>
                      <p>Teléfono: {currentDireccion.phone}</p>
                  </div>
              </div>

              {/* Sección de Detalles del Producto */}
              <div className="modal-section producto-detalles">
                  <h3>Producto Comprado</h3>
                  <div className="producto-detalle-card">
                      <img src={currentProducto.image} alt={currentProducto.title} className="producto-imagen-modal" />
                      <div className="producto-info-texto">
                          <h4>{currentProducto.title}</h4>
                          <p className="producto-categoria">Categoría: {currentProducto.category}</p>
                          <p className="producto-precio-modal">Precio Unitario: {precioUnitario}</p>
                          <p className="producto-descripcion-modal">{currentProducto.description}</p>
                      </div>
                  </div>
              </div>
          </div>
      </div>
    );
  };

  
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
      <main className="perfil-layout-container">
        <div className="columna-izquierda">
          <div className="perfil-card">

            <h2 className="perfil-titulo">Mi Perfil</h2>

            <div className="perfil-campos">
              <label>Nombre completo</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                disabled={!editMode}
                onChange={handleChange}
              />

              <label>Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                disabled={!editMode}
                onChange={handleChange}
              />

              <label>Usuario</label>
              <input
                type="text"
                name="user"
                value={formData.user}
                disabled={!editMode}
                onChange={handleChange}
              />
            </div>

            {!editMode ? (
              <button className="btn-editar" onClick={() => setEditMode(true)}>
                Editar
              </button>
            ) : (
              <button className="btn-guardar" onClick={guardarCambios}>
                Guardar
              </button>
            )}

          </div>
          <div className="profile-container"> {/* Agregamos un contenedor general para el ejemplo */}
            <div className="direcciones-card">
              <h2 className="perfil-titulo">Mis Direcciones</h2> {/* Cambiado el título */}

              {direcciones.length === 0 && !newAddress && <p>No has registrado direcciones.</p>}

              {/* Agregamos el "Agregar dirección" al principio si no hay ninguna */}
              {direcciones.length === 0 && !newAddress && (
                <div className="add-address-placeholder" onClick={() => setNewAddress(true)}>
                  <div className="add-icon">+</div>
                  <p>Agregar dirección</p>
                </div>
              )}

              {direcciones.map((dir) => (
                <div key={dir._id} className="direccion-item-display"> {/* Nuevo estilo para mostrar */}
                  {editingAddress === dir._id ? (
                    <div className="direccion-item-edit">
                      <input name="name" value={addressData.name} onChange={handleChange} placeholder="Nombre Completo" />
                      <input name="country" value={addressData.country} onChange={handleChange} placeholder="País" />
                      <input name="city" value={addressData.city} onChange={handleChange} placeholder="Ciudad" />
                      <input name="address" value={addressData.address} onChange={handleChange} placeholder="Dirección" />
                      <input name="postalCode" value={addressData.postalCode} onChange={handleChange} placeholder="Código Postal" />
                      <input name="phone" value={addressData.phone} onChange={handleChange} placeholder="Teléfono" />

                      <div className="direccion-actions">
                        <button className="btn-guardar" onClick={() => guardarDireccion(dir._id)}>Guardar</button>
                        <button className="btn-cancelar" onClick={() => setEditingAddress(null)}>Cancelar</button>
                      </div>
                    </div>
                  ) : (
                    <>
                      
                      <p className="address-name">{dir.name}</p>
                      <p className="address-line">{dir.address}</p>
                      <p className="address-line">{dir.city}, {dir.country}</p>
                      {dir.postalCode && <p className="address-line">{dir.postalCode}</p>}
                      <p className="address-line">Número de teléfono: {dir.phone}</p>

                      <div className="direccion-links">
                        <span className="link-button" onClick={() => { setEditingAddress(dir._id); setAddressData(dir); }}>Editar</span>
                        <span className="link-separator">|</span>
                        <span className="link-button" onClick={() => eliminarDireccion(dir._id)}>Descartar</span> 
                      </div>
                    </>
                  )}
                </div>
              ))}

              {/* NUEVA DIRECCIÓN */}
              {newAddress ? (
                <div className="direccion-nueva">
                  <h3>Añadir Nueva Dirección</h3>
                  <input name="name" value={addressData.name} onChange={handleChange} placeholder="Nombre Completo" />
                  <input name="country" value={addressData.country} onChange={handleChange} placeholder="País" />
                  <input name="city" value={addressData.city} onChange={handleChange} placeholder="Ciudad" />
                  <input name="address" value={addressData.address} onChange={handleChange} placeholder="Dirección" />
                  <input name="postalCode" value={addressData.postalCode} onChange={handleChange} placeholder="Código Postal" />
                  <input name="phone" value={addressData.phone} onChange={handleChange} placeholder="Teléfono" />

                  <div className="direccion-actions">
                    <button className="btn-guardar" onClick={crearDireccion}>Guardar</button>
                    <button className="btn-cancelar" onClick={() => setNewAddress(false)}>Cancelar</button>
                  </div>
                </div>
              ) : (
                direcciones.length > 0 && ( // Mostrar el botón "Añadir Dirección" si ya hay al menos una
                  <div className="add-address-placeholder" onClick={() => setNewAddress(true)}>
                    <div className="add-icon">+</div>
                    <p>Agregar dirección</p>
                  </div>
                )
              )}
            </div>
          </div>
        </div>
        <div className="columna-derecha">
          <div className="pedidos-card">
              <h2 className="perfil-titulo" style={{ textAlign: 'left' }}>Mis Pedidos</h2>
              
              {isLoading && <p>Cargando pedidos...</p>}

              {!isLoading && pedidos.length === 0 && <p>No tienes pedidos recientes.</p>}

              {!isLoading && pedidos.map((pedido) => {
                  const prod = products.find(p => p._id === pedido.idProd);
                  return (
                    <div key={pedido.idProd} className="pedido-item">
                      <div className="pedido-producto-info">
                          {/* Aquí puedes usar el campo imageUrl de tu producto */}
                          <img
                              src={prod?.image}
                              alt={prod?.title}
                              className="pedido-imagen"
                          />
                          <p className="pedido-nombre-producto">{prod?.title}</p>
                      </div>
                      <div className="pedido-info">
                          <p><strong>Fecha:</strong> {
                            pedido.creation_date ? new Date(pedido.creation_date).toLocaleString('es-CO', {
                                year: 'numeric', month: 'long', day: 'numeric',
                                hour: '2-digit', minute: '2-digit'
                            }) : 'Fecha no disponible'
                          }</p>
                          <p><strong>Estado:</strong> <span className="status">{pedido.status}</span></p>
                          <p><strong>Total:</strong> ${pedido.total ? pedido.total.toLocaleString() : '0'}</p>
                      </div>

                      <button className="btn-ver-detalles" onClick={() => handleOpenModal(pedido)}>
                          Ver Detalles
                      </button>
                    </div>
                  );
              })}
          </div>
        </div>
        <PedidoDetallesModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                pedido={selectedPedido}
                producto={selectedProduct}
                direccion={selectedAddress}
            />
      </main>
    </>
  );
}

export default Profile;

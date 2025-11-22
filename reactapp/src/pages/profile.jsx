import { useEffect, useState } from "react";
import "./css/profile.css";
import { useAuth } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";

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

  // ============================
  //   CARGA DE PERFIL
  // ============================
  useEffect(() => {
    const fetchPerfil = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/usuarios/perfil", {
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

    fetchPerfil();
  }, []);

  // ============================
  //   HANDLE CHANGE
  // ============================
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

  // ============================
  //   GUARDAR PERFIL
  // ============================
  const guardarCambios = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/usuarios/perfil", {
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

  // ============================
  //   CREAR DIRECCIÓN
  // ============================
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

  // ============================
  //   EDITAR DIRECCIÓN
  // ============================
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

  // ============================
  //   ELIMINAR DIRECCIÓN
  // ============================
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
        <h2 className="perfil-titulo">Tus Direcciones</h2> {/* Cambiado el título */}

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
                {/* Puedes añadir un logo de "Predeterminado: Amazon" aquí si es necesario */}
                {/* <div className="default-indicator">Predeterminado: <img src="amazon_logo.png" alt="Amazon" /></div> */}
                
                <p className="address-name">{dir.name}</p>
                <p className="address-line">{dir.address}</p>
                <p className="address-line">{dir.city}, {dir.country}</p>
                {dir.postalCode && <p className="address-line">{dir.postalCode}</p>}
                <p className="address-line">Número de teléfono: {dir.phone}</p>

                <div className="direccion-links">
                  <span className="link-button" onClick={() => { setEditingAddress(dir._id); setAddressData(dir); }}>Editar</span>
                  <span className="link-separator">|</span>
                  <span className="link-button" onClick={() => eliminarDireccion(dir._id)}>Descartar</span> {/* Cambiado a Descartar */}
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

    </>
  );
}

export default Profile;

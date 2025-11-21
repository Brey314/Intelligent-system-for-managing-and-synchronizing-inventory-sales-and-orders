import { useState } from "react";
import "./css/search.css";
import { useAuth } from "../context/AuthContext";
import { useNavigate ,Link} from "react-router-dom";


const apiURL = "http://localhost:5000/api/productos";
const apiURLU = "http://localhost:5000/api/usuarios";

function Search() {
  const [section, setSection] = useState("products");
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { usuario, logout} = useAuth();
  const [productos, setProductos] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editedProduct, setEditedProduct] = useState({
    title: "",
    description:"",
    price: "",
    image: "",
    category: "",
    stock:"",
  });
    const [newProduct, setNewProduct] = useState({
    title: "",
    description:"",
    price: "",
    image: "",
    category: "",
    stock:"",
  });
  const [searchEmail, setSearchEmail] = useState("");
  const [users, setUsers] = useState([]);
  const [editing, setEditing] = useState(null);
  const [editedUser, setEditedUser] = useState({
    name: "",
    email: "",
    user: "",
    rol: ""
  });
  

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setProductos([]);
    try {
      const url = searchTerm ? `${apiURL}?title=${encodeURIComponent(searchTerm)}` : apiURL;
      const respuesta = await fetch(url);
      if (!respuesta.ok) throw new Error(`Error HTTP: ${respuesta.status}`);
      const data = await respuesta.json();
      setProductos(data);
    } catch (err) {
      setError("Error al cargar los productos. Intenta nuevamente.");
    } finally {
      setLoading(false);
    }
    if (!searchEmail) return;

    const res = await fetch(`${apiURLU}/?email=${searchEmail}`,{credentials: "include"});
    const data = await res.json();

    if (Array.isArray(data)) {
      setUsers(data);
    } else {
      setUsers([]);
    }
  };

  // al hacer click en "editar"
  const edit = (prod) => {
    setEditingId(prod._id);
    setEditedProduct({   
        
        title: prod.title || '',
        description: prod.description || '',
        price: prod.price || '',
        image: prod.image || '',
        category: prod.category || '',
        stock: prod.stock || '' 
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditedProduct({});
  };

  const saveEdit = async () => {
    try {
      const resp = await fetch(`${apiURL}/${editingId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editedProduct),
        credentials: "include"
      });

      if (!resp.ok) throw new Error("Error al actualizar");

      // actualizar el producto localmente sin volver a consultar toda la lista
      setProductos((prev) =>
        prev.map((p) => (p._id === editingId ? { ...p,...editedProduct } : p))
      );

      setEditingId(null);
      setEditedProduct({});
    } catch (err) {
      console.error(err);
      alert(" No se pudo actualizar el producto");
    }
  };

    const saveNewProduct = async () => {
    try {
      const resp = await fetch(apiURL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newProduct),
        credentials: "include"
      });
      if (!resp.ok) throw new Error("Error al crear producto");

      const creado = await resp.json();
      setProductos((prev) => [...prev, creado]);
      setNewProduct({ title: "",description:"", price: "", image: "",category: "",stock:""  });
    } catch (err) {
      console.error(err);
      alert(" No se pudo crear el producto");
    }
  };

  const eliminar = async (_id) => {
    try {
      await fetch(`${apiURL}/${_id}`, { method: "DELETE" ,credentials: "include"});
      setProductos((prev) => prev.filter((prod) => prod._id !== _id));
    } catch (err) {
      console.error("Error eliminando producto:", err);
    }
  };

    // Iniciar edición
  const startEdit = (u) => {
    setEditing(u._id);
    setEditedUser({
      name: u.name,
      email: u.email,
      user: u.user,
      rol: u.rol
    });
  };

  //  Guardar edición
  const saveEditU = async () => {
    const res = await fetch(`${apiURLU}/${editing}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editedUser),
      credentials: "include"
    });

    const data = await res.json();
    console.log(data);

    // actualizar lista
    setUsers(users.map(u => u._id === editing ? { ...u, ...editedUser } : u));

    setEditing(null);
  };

  //  Eliminar usuario
  const deleteUser = async (id) => {
    if (!window.confirm("¿Seguro que deseas eliminar este usuario?")) return;
    const res = await fetch(`${apiURLU}/${id}`, { method: "DELETE" ,credentials: "include"});
    const data = await res.json();
    console.log(data);

    setUsers(users.filter(u => u._id !== id));
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
              <li><Link className="btnH" to="/">Inicio</Link></li>
              <li 
                className="usuario-menu-container"
                onMouseEnter={() => setOpen(true)}
                onMouseLeave={() => setOpen(false)}
                >
                <p className="btnH">Bienvenido {usuario?.user}</p>
                {open && (
                  <div className="usuario-dropdown">
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

      <main className="product">
        <div className="top-menu flex gap-4 mb-6">
          <button
            className={`btnP ${section === "products" ? "active" : ""}`}
            onClick={() => setSection("products")}
            >
            Productos
          </button>
          <button
            className={`btnP ${section === "users" ? "active" : ""}`}
            onClick={() => setSection("users")}
            >
            Usuarios
          </button>
        </div>
        {section === "products" && (
          <div>
          <form onSubmit={handleSearch}>
            <div className="search">
              <input
                type="text"
                placeholder="Ej: Mouse Gamer"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="searchbar"
              />
              <button type="submit" className="btn">Buscar Productos</button>
            </div>
          </form>

          <div id="productos" className="grid">
            {productos.map((prod) => (
              <div key={prod._id} className="card">
                {/* Si está en edición */}
                {editingId === prod._id ? (
                  <div className="edit-form">
                      <h3>Nombre</h3>
                    <input
                      type="text"
                      value={editedProduct.title}
                      onChange={(e) =>
                        setEditedProduct({ ...editedProduct, title: e.target.value })
                      }
                    />
                    <h3>Descripción</h3>
                    <input
                      type="text"
                      value={editedProduct.description}
                      onChange={(e) =>
                        setEditedProduct({ ...editedProduct, description: e.target.value })
                      }
                      />
                      <h3>Precio</h3>
                    <input
                      type="number"
                      value={editedProduct.price}
                      onChange={(e) =>
                        setEditedProduct({ ...editedProduct, price: Number(e.target.value) })
                      }
                    />
                    <h3>Categoría</h3>
                    <input
                      type="text"
                      value={editedProduct.category}
                      onChange={(e) =>
                        setEditedProduct({ ...editedProduct, category: e.target.value })
                      }
                    />
                    <h3>Stock</h3>
                    <input
                      type="number"
                      value={editedProduct.stock}
                      onChange={(e) =>
                        setEditedProduct({ ...editedProduct, stock: Number(e.target.value) })
                      }
                      />
                      <h3>Imagen</h3>
                      <input
                      type="text"
                      value={editedProduct.image}
                      onChange={(e) =>
                        setEditedProduct({ ...editedProduct, image: e.target.value })
                      }
                      />
                    <button className="btnP" onClick={saveEdit}>Guardar</button>
                    <button className="btnP cancel" onClick={cancelEdit}>Cancelar</button>
                  </div>
                ) : (
                  <>
                    <img src={prod.image} alt={prod.title} />
                    <h3>{prod.title}</h3>
                    <h4>COP {prod.price.toLocaleString()} $</h4>
                    <small>Categoría: {prod.category}</small>
                    <button className="btnP" onClick={() => edit(prod)}>
                      Editar Producto
                    </button>
                    <button className="btnP" onClick={() => eliminar(prod._id)}>
                      Eliminar Producto
                    </button>
                  </>
                )}
              </div>
            ))}
          </div>
          <br />
          <div className="grid">
              <div className="card">
                  <h2>Agregar Producto</h2>
                <input
                  type="text"
                  value={newProduct.title}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, title: e.target.value })
                  }
                  placeholder="Título"
                />
              <input
                  type="text"
                  value={newProduct.description}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, description: e.target.value })
                  }
                  placeholder="Descripción"
                />
                <input
                  type="number"
                  value={newProduct.price}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, price: Number(e.target.value) })
                  }
                  placeholder="Precio"
                />

                <input
                  type="text"
                  value={newProduct.category}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, category: e.target.value })
                  }
                  placeholder="Categoría"
                />
                  <input
                  type="number"
                  value={newProduct.stock}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, stock: Number(e.target.value) })
                  }
                  placeholder="Stock"
                />
                <input
                  type="text"
                  value={newProduct.image}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, image: e.target.value })
                  }
                  placeholder="URL imagen"
                />
                <button className="btnP" onClick={saveNewProduct}>
                  Crear Producto
                </button>
              </div>
            </div>
          </div>
          )}
        {section === "users" &&(
          <div className="user-section">

            <h2>Gestión de Usuarios</h2>

            {/* BUSCADOR */}
            <form onSubmit={handleSearch} className="search">
              <input
                type="text"
                placeholder="Buscar por email"
                value={searchEmail}
                onChange={(e) => setSearchEmail(e.target.value)}
                className="searchbar"
              />
              <button className="btnP">Buscar</button>
            </form>

            <div className="grid">
              {users.map((u) => (
                <div key={u._id} className="card">

                  {editing === u._id ? (
                    <div className="edit-form">

                      <h3>Nombre</h3>
                      <input
                        value={editedUser.name}
                        onChange={(e) =>
                          setEditedUser({ ...editedUser, name: e.target.value })
                        }
                      />

                      <h3>Email</h3>
                      <input
                        value={editedUser.email}
                        onChange={(e) =>
                          setEditedUser({ ...editedUser, email: e.target.value })
                        }
                      />

                      <h3>User</h3>
                      <input
                        value={editedUser.user}
                        onChange={(e) =>
                          setEditedUser({ ...editedUser, user: e.target.value })
                        }
                      />

                      <h3>Rol</h3>
                      <input
                        value={editedUser.rol}
                        onChange={(e) =>
                          setEditedUser({ ...editedUser, rol: e.target.value })
                        }
                      />

                      <button className="btnP" onClick={saveEditU}>Guardar</button>
                      <button className="btnP cancel" onClick={() => setEditing(null)}>
                        Cancelar
                      </button>
                    </div>

                  ) : (
                    <>
                      <h3>{u.name}</h3>
                      <p>Email: {u.email}</p>
                      <p>User: {u.user}</p>
                      <p>Rol: {u.rol}</p>

                      <button className="btnP" onClick={() => startEdit(u)}>
                        Editar
                      </button>

                      <button className="btnP" onClick={() => deleteUser(u._id)}>
                        Eliminar
                      </button>
                    </>
                  )}
                </div>
              ))}
            </div>

          </div>
        )
        }
      </main>
    </>
  );
}

export default Search;

 # Intelligent System for Managing and Synchronizing Inventory, Sales, and Orders

## Autores
Santiago Benavides Rey.
Juan David Forero Patarroyo.
Lizeth Maryory Diaz Castro.

---

## Descripción
Este proyecto implementa un sistema inteligente para la **gestión y sincronización de inventario, ventas y pedidos**.  
La solución combina un **backend en Node.js/Express**, un **frontend en React**, y un conjunto de páginas **HTML estáticas** de apoyo.

---

## Estructura del proyecto
```
├── Backend/               # Servidor Node.js (API REST)
│   ├──.env
│   ├── server.js
│   ├── models/...
│       ├── address.js
│       ├── pedidos.js
│       ├── usuarios.js
│       ├── Carrito.js
│       └── Producto.js
│   ├── routes/...
│       ├── address.js
│       ├── pagos.js
│       ├── pedidos.js
│       ├── carrito.js
│       ├── usuarios.js
│       └── productos.js
│   ├── middleware/...
│       └── auth.js
├── reactapp/              # Aplicación React (frontend principal)
│   ├── puiblic/...
│       ├── favicon.ico
│       ├── assets/...
│           └── img/...
│   ├── src/...
│       ├── components
│           └── ProtectedRoute.jsx
│       ├── context
│           └── AuthContex.jsx
│       ├── pages/...
│           ├── css/...
│           ├── CancelPage.jsx
│           ├── profile.jsx
│           ├── SuccesPage.jsx
│           ├── Admin.jsx
│           ├── Home.jsx
│           ├── Login.jsx
│           ├── Register.jsx
│           ├── Search.jsx
│           └── shoppingCart.jsx
│       ├── App.css
│       ├── App.js
│       ├── index.css
│       └── index.js
│
├── Documentation/         # Documentos de apoyo
│   ├── DB.json
│   ├── Document.pdf
│   ├── Requeriments_IEEE830.pdf
│   └── User Stories.xlsx
│
└── README.md              # Este archivo
└── .gitignore
```

---

## Tecnologías utilizadas
- **Backend:** Node.js, Express, JWT, MongoDB, cookieParser, dotenv
- **Frontend:** React (con Vite/CRA según configuración)  
- **Base de datos de prueba:** JSON (`DB.json`)  

---

## Instalación y ejecución

### 1. Clonar el repositorio
```bash
git clone https://github.com/Juancho-456/Intelligent-system-for-managing-and-synchronizing-inventory-sales-and-orders.git
cd Intelligent-system-for-managing-and-synchronizing-inventory-sales-and-orders
```
### 2. Instalar dependencias del backend
```bash
cd Backend
npm install express mongoose cors bcryptjs cookie-parser jsonwebtoken dotenv stripe axios
```

### 3. Crear .env dentro de backend
```ini
MONGODB_URI=url_de_conexion_a_mongodb
JWT_SECRET=clave_secreta_para_tokens
STRIPE_SECRET_KEY=clave_secreta_para_enviar_datos_pasarela_pago
STRIPE_WEBHOOK_SECRET=clave_secreta_para_recivir_datos_pasarela_pago
REACT_APP_API_URL=url_del_backend(por defecto http://localhost:5000)
PORT=5000
```
### 4. Instalar dependencias del frontend
```bash
cd reactapp
npm install react react-dom react-router-dom framer-motion
```
### 5. Crear .env dentro de frontend
```ini
REACT_APP_API_URL=url_del_backend(por defecto http://localhost:5000)
```
### 6. Ejecución
```bash
cd Backend
node server.js
cd reactapp
npm build run
```
---

### 2. Backend (Node.js + Express)

El backend ubicado en la carpeta `Backend/` implementa la **API REST** que gestiona inventario, ventas y pedidos.  
Está desarrollado con **Node.js** y el framework **Express** para la creación de endpoints.  
También utiliza **Mongoose** para la comunicación con la base de datos.

#### Archivos principales:
- `server.js` → Punto de entrada del servidor, configuración de Express, middlewares y conexión con la base de datos.  
- `package.json` → Definición de dependencias y scripts de ejecución.  
- `package-lock.json` → Registro exacto de versiones instaladas.  

#### Dependencias principales:
- `express` → Framework para crear rutas y middlewares HTTP.  
- `mongoose` → Modelado y conexión con la base de datos MongoDB.  
- `body-parser` → Procesa las solicitudes entrantes en formato JSON.  
- `cors` → Permite solicitudes desde otros orígenes (frontend en React).
- `bcryptjs` → Encripta contraseñas mediante hashing seguro.
- `jsonwebtoken` → Crea y valida tokens JWT para autenticación.
- `dotenv` → Carga variables de entorno desde un archivo .env.
- `stripe` → Permite integrar pagos y manejar cobros con la API de Stripe.
- `axios` → Cliente HTTP para realizar solicitudes a APIs desde backend o

El servidor se ejecutará en `http://localhost:5000` (según la configuración definida en `server.js`).  

#### Funcionalidades principales:
- **Gestión de inventario:** creación, lectura, actualización y eliminación de productos.  
- **CORS habilitado:** conexión segura con la aplicación React u otros clientes.  
- **Middleware JSON:** permite enviar y recibir datos en formato JSON.
- **Concexión a Stripe** permite una pasarela de pago brindada por Stripe, actualiza inventario, pagos, carrito.
- **Gestión de carrito y direcciones de envío** creación, lectura, actualización y eliminación de datos.


#### Ejecución:
```bash
cd Backend
npm install
cd reactapp
npm start
```

## API del Backend

El servidor expone una serie de endpoints REST para la gestión de inventario, ventas, pedidos y carrito de compras.  

### Endpoints principales

#### Inventario (`/api/products`)
- `GET /api/products` → Obtiene todos los productos.  
- `GET /api/products/:id` → Obtiene un producto por ID.  
- `POST /api/products` → Crea un nuevo producto, desde rol administrador.  
- `PUT /api/products/admin/:id` → Actualiza un producto existente, desde rol administrador.  
- `DELETE /api/products/:id` → Elimina un producto, desde rol administrador.
- `PUT /api/:id/stock` → Actualizar stock por pagos.

#### Carrito (`/api/carrito`)
- `GET /api/carrito` → Obtiene el contenido actual del carrito.  
- `POST /api/carrito` → Agrega un producto al carrito.  
- `PUT /api/carrito/:_id` → Actualiza la cantidad de un producto en el carrito.  
- `DELETE /api/carrito/:_id` → Elimina un producto del carrito.
- `DELETE /api/carrito/payed/:_id` → Elimina un producto del al comprar.

#### Usuarios (`/api/pedidos`)
- `POST /api/pedidos/` → Obtiene token para inicio de sesión.  
- `POST /api/usuarios/register` → Agrega un usuario a la base de datos.  
- `GET /api/usuarios/perfil` → Verifica que el usuario esté iniciado por contraseña.
- `PUT /api/usuarios/perfil` → Actualiza perfil, para el mismo usuario.
- `POST /api/usuarios/logout` → Elimina el token generado para cerrar sesión.
- `GET /api/usuarios/check` → Verifica que el usuario este iniciado por usuario, rol y email.
- `GET /api/usuarios/` → Buscar usuarios por id, para administrador.
- `PUT /api/usuarios/:id` → Actualiza usuarios, para administrador.
- `DELETE /api/usuarios/:id` → Elimina usuarios, para administrador.

#### Pedidos (`/api/usuarios`)
- `GET /api/pedidos/` → Obtiene todos los pedidos hechos por el usuario.  
- `POST /api/usuarios/register` → Agrega el pedido hecho por el usuario.

#### Direcciones (`/api/addresses`)
- `GET /api/addresses/:userId` → Obtiene todas las direcciones hechas por el usuario.  
- `GET /api/addresses/:addressId` → Obtiene una direccion especifica hecha por el usuario.
- `POST /api/addresses/` → Crea una dirección.
- `PUT /api/addresses/:_id` → Actualiza una dirección.
- `DELETE /api/addresses/:_id` → Elimina una dirección.

#### Pagos (`/api/`)
- `POST /create-checkout-session` → Crea una sesión de Stripe usando los productos del carrito, verifica el usuario con JWT y envía los datos a Stripe. Devuelve la URL para pagar.
- `GET /payment/session/:id` → Recupera información de una sesión de pago de Stripe.
- `POST /webhook` → Stripe llama aquí cuando un pago se completa.
 - Verifica firma del webhook.
 - Lee los productos pagados.
 - Actualiza el stock de cada producto.
 - Elimina los productos del carrito.
 - Crea un pedido en la base de datos para el usuario.
---

## Archivos principales del Backend

- **server.js** → Configura y levanta el servidor Express, define middlewares globales (`cors`, `body-parser`,`cookie-parser`,`dotenv`), manejo de cookies y conecta con MongoDB.  
- **controllers/** → Incluye la lógica de negocio de cada módulo (productos, ventas, pedidos, carrito).  
- **models/** → Define los esquemas de Mongoose para la persistencia en MongoDB, productos, productos carrito y usuarios, pedidos y direcciones.  
- **routes/** → Declara las rutas de la API que enlazan los controladores con Express.  
- **routes/carrito.js** → Contiene la lógica del carrito de compras, añade, elimina y edita productos.
- **routes/productos.js** → Contiene la lógica de la base de datos de añade, elimina y edita productos.
- **routes/usuarios.js** → Contiene la lógica de la gestion de token y registro de usuaios añade y edita usuarios.
- **routes/address.js** → Contiene la lógica de las direcciones, obtiene, crea, edita, elimina.
- **routes/pedidos.js** → Contiene la lógica de los pagos, obtiene, añade.
- **routes/pagos.js** → Contiene la lógica los pagos, llama a Stripe, genera resultados de pago, y actualiza las bases de datos al pagar.
- **middleware/auth.js** → Función para la verificacion de tokens en las cookies
---

### 3. Frontend (React)

La aplicación React ubicada en la carpeta `reactapp/` es la **interfaz principal del usuario**.  
Está desarrollada con **React** y utiliza librerías adicionales para la navegación y los íconos.

#### Archivos y carpetas principales:
- `components/` → ProtectedRoute.jsx Proteción a la carga de paginas como /admin o /shopping.
- `context/` → Uso de use Effect para llamar al backen para verificar la sesión iniciada y la salida de sesión.
- `src/` → Contiene todo el código fuente de la aplicación.
  - `pages/` → Vistas principales de la aplicación (Login, Registro, Dashboard, etc.).  
  - `.js` → Punto de entrada de la aplicación React.  
  - `index.js` → Renderiza la aplicación dentro del DOM.  

#### Dependencias principales:
- `react` → Librería principal para construir interfaces de usuario.  
- `react-router-dom` → Manejo de rutas y navegación entre páginas.  
- `react-icons/fa` → Conjunto de íconos para enriquecer la interfaz.
- `framer-motion` → Librería de animaciones para React que permite crear transiciones, gestos y efectos fluidos de forma sencilla.

La aplicación se abrirá en el navegador en `http://localhost:3000` (o el puerto configurado por Vite/CRA).  

#### Funcionalidades principales:
- **Login/Register:** autenticación de usuarios.  
- **Gestión de productos:** visualización y administración del inventario.
- **Gestión de pagos:** visualización y administración de pagos.
- **Gestión de pedidos:** visualización y administración de los pedidos hechos previamente.
- **Gestión de direcciones de envío:** visualización y administración de las direcciónes de envío.  
- **Carrito de compras:** permite simular pedidos y sincronización con ventas.  
- **Navegación dinámica:** cambio de vistas sin recargar la página gracias a `react-router-dom`.  

---

## Documentación adicional
Dentro de la carpeta `Documentation/` se incluye material de soporte:  
- **DB.json:** datos de prueba para simular inventario.  
- **Requeriments_IEEE830.pdf:** especificación formal de requerimientos.  
- **User Stories.xlsx:** historias de usuario del sistema.  
- **Document.pdf:** documentación general del proyecto.  

---

## Despliegue
- **Base de datos:** desplegada en Mongo Atlas
  - Modificar .env del backen **MONGODB_URI**, por la url administrada por Mongo Atlas. En seguridad de Mongo agregar 0.0.0.0/0 en direcciónes.
- **Backend deplegado** en Render.com
  - Modificar **linea 20 en server.js**:   origin: ['http://localhost:3000',"{'Colocar URL del frontend'}"],
  - Modificar variables de entorno **REACT_APP_API_URL** por la url suministrada por aplicación de despliege.
- **Frontend deplegado** en Vercel.com
  - Crear variable de entorno **REACT_APP_API_URL** por la url suministrada por aplicación de despliege.

## Licencia
Este proyecto se distribuye bajo la licencia que defina el repositorio (MIT, GPL, etc.).  
Si no está definida aún, recomendamos usar **MIT** por su flexibilidad.

---

# Intelligent System for Managing and Synchronizing Inventory, Sales, and Orders

## Descripción
Este proyecto implementa un sistema inteligente para la **gestión y sincronización de inventario, ventas y pedidos**.  
La solución combina un **backend en Node.js/Express**, un **frontend en React**, y un conjunto de páginas **HTML estáticas** de apoyo.

---

## Estructura del proyecto
```
├── Backend/               # Servidor Node.js (API REST)
│   ├── server.js
│   ├── package.json
│   └── package-lock.json
│
├── reactapp/              # Aplicación React (frontend principal)
│   ├── src/...
│   ├── package.json
│   └── README.md (Introducción a Create React App)
│
├── html/                  # Vistas HTML estáticas
│   ├── index.html
│   ├── login.html
│   ├── register.html
│   ├── search.html
│   └── shoppingcart.html
│
├── Documentation/         # Documentos de apoyo
│   ├── DB.json
│   ├── Document.pdf
│   ├── Requeriments_IEEE830.pdf
│   └── User Stories.xlsx
│
└── README.md              # Este archivo
```

---

## Tecnologías utilizadas
- **Backend:** Node.js, Express  
- **Frontend:** React (con Vite/CRA según configuración)  
- **Base de datos de prueba:** JSON (`DB.json`)  
- **HTML/CSS:** Páginas estáticas  

---

## Instalación y ejecución

### 1. Clonar el repositorio
```bash
git clone https://github.com/Juancho-456/Intelligent-system-for-managing-and-synchronizing-inventory-sales-and-orders.git
cd Intelligent-system-for-managing-and-synchronizing-inventory-sales-and-orders
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

El servidor se ejecutará en `http://localhost:3000` (según la configuración definida en `server.js`).  

#### Funcionalidades principales:
- **Gestión de inventario:** creación, lectura, actualización y eliminación de productos.  
- **Gestión de ventas:** registro y consulta de ventas realizadas.  
- **Gestión de pedidos:** sincronización de pedidos con inventario y ventas.  
- **CORS habilitado:** conexión segura con la aplicación React u otros clientes.  
- **Middleware JSON:** permite enviar y recibir datos en formato JSON.  


#### Ejecución:
```bash
cd Backend
npm install
npm start
```

---

### 3. Frontend (React)

La aplicación React ubicada en la carpeta `reactapp/` es la **interfaz principal del usuario**.  
Está desarrollada con **React** y utiliza librerías adicionales para la navegación y los íconos.

#### Archivos y carpetas principales:
- `src/` → Contiene todo el código fuente de la aplicación.  
  - `components/` → Componentes reutilizables de la interfaz (formularios, menús, etc.).  
  - `pages/` → Vistas principales de la aplicación (Login, Registro, Dashboard, etc.).  
  - `App.js` → Punto de entrada de la aplicación React.  
  - `index.js` → Renderiza la aplicación dentro del DOM.  

#### Dependencias principales:
- `react` → Librería principal para construir interfaces de usuario.  
- `react-router-dom` → Manejo de rutas y navegación entre páginas.  
- `react-icons/fa` → Conjunto de íconos para enriquecer la interfaz.

La aplicación se abrirá en el navegador en `http://localhost:5173` (o el puerto configurado por Vite/CRA).  

#### Funcionalidades principales:
- **Login/Register:** autenticación de usuarios.  
- **Gestión de productos:** visualización y administración del inventario.  
- **Carrito de compras:** permite simular pedidos y sincronización con ventas.  
- **Navegación dinámica:** cambio de vistas sin recargar la página gracias a `react-router-dom`.  

#### Ejecución:
```bash
cd reactapp
npm install
npm start
```

---

### 4. HTML estático
Las páginas dentro de `html/` pueden abrirse directamente en el navegador:  
- `index.html` → Página principal.  
- `login.html` → Inicio de sesión.  
- `register.html` → Registro de usuarios.  
- `search.html` → Búsqueda de productos.  
- `shoppingcart.html` → Carrito de compras.  

Estas vistas sirven como prototipos o interfaces alternas simples.

---

## Documentación adicional
Dentro de la carpeta `Documentation/` se incluye material de soporte:  
- **DB.json:** datos de prueba para simular inventario.  
- **Requeriments_IEEE830.pdf:** especificación formal de requerimientos.  
- **User Stories.xlsx:** historias de usuario del sistema.  
- **Document.pdf:** documentación general del proyecto.  

---

## Contribución
1. Haz un fork del repositorio.  
2. Crea una rama para tu cambio (`git checkout -b feature/nueva-funcionalidad`).  
3. Realiza tus cambios y haz commit (`git commit -m "Agrega nueva funcionalidad"`).  
4. Haz push a la rama (`git push origin feature/nueva-funcionalidad`).  
5. Abre un Pull Request.  

---

## Licencia
Este proyecto se distribuye bajo la licencia que defina el repositorio (MIT, GPL, etc.).  
Si no está definida aún, recomendamos usar **MIT** por su flexibilidad.

---

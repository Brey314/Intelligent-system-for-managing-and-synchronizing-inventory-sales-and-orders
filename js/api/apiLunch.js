const apiURL = 'https://api.escuelajs.co/api/v1/products/';

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('Ktronix-form');
  const contenedor = document.getElementById('productos');

  // función para cargar productos
  async function cargarProductos(searchTerm = '') {
    contenedor.innerHTML = ''; // limpiar resultados anteriores

    try {
      const url = searchTerm 
        ? `${apiURL}?title=${encodeURIComponent(searchTerm)}` 
        : apiURL;

      const respuesta = await fetch(url);
      if (!respuesta.ok) throw new Error(`Error HTTP: ${respuesta.status}`);

      const productos = await respuesta.json();
      console.log(url);

      productos.forEach(prod => {
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
          <img src="${prod.images[0]}" alt="${prod.title}" loading="lazy">
          <h3>${prod.title}</h3>
          <h4>$${prod.price}</h4>
          <small>Categoría: ${prod.category.name}</small>
          <button type="tocart" class="btnP"><h2>Envíar al Carrito<h2></button>
        `;
        contenedor.appendChild(card);
      });

    } catch (err) {
      console.error('Error:', err);
      contenedor.textContent = 'Error al cargar los productos. Intenta nuevamente.';
    }
  }

  // 1. Ejecutar búsqueda al enviar formulario
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const searchTerm = document.getElementById("Busqueda").value.trim().toLowerCase();
    cargarProductos(searchTerm);
  });

  // 2. Ejecutar búsqueda inicial al cargar la página
  cargarProductos();
});

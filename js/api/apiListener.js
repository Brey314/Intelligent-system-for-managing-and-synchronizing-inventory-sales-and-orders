const apiURL = 'https://api.escuelajs.co/api/v1/products/';

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('Ktronix-form');

  form.addEventListener('submit', async function (e) {
    e.preventDefault();
    const searchTerm = document.getElementById("Busqueda").value.trim().toLowerCase();
    const contenedor = document.getElementById('productos');
    contenedor.innerHTML = ''; // Limpiar resultados anteriores
    
    try {
      // Construir URL de búsqueda
      const url = searchTerm 
        ? `${apiURL}?title=${encodeURIComponent(searchTerm)}` 
        : apiURL;
      
      const respuesta = await fetch(url);
      
      if (!respuesta.ok) throw new Error(`Error HTTP: ${respuesta.status}`);
      const productos = await respuesta.json(); // Extraer el array "data"
      console.log(url)

      // Mostrar resultados
      productos.forEach(prod => {
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
          <img src="${prod.images[0]}" alt="${prod.title}" loading="lazy">
          <h3>${prod.title}</h3>
          <h4>$${prod.price}</h4>
          <small>Categoría: ${prod.category.name}</small>
          <button type="tocart" class="btnP">Envíar al Carrito</button>
        `;
        contenedor.appendChild(card);

        card.querySelector(".btnP").addEventListener("click", async () => {
          try {
            const producto = {
              id: prod.id,
              title: prod.title,
              slug: prod.slug,
              price: prod.price,
              description: prod.description,
              category: prod.category,
              image: prod.images
            };

            const resp = await fetch("http://localhost:3000/api/cart", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(producto)
            });

            const data = await resp.json();
            alert(`${producto.title} agregado al carrito`);
            console.log(data);
          } catch (err) {
            console.error("Error al enviar producto:", err);
          }
        });
      });

    } catch (err) {
      console.error('Error:', err);
      contenedor.textContent = 'Error al cargar los productos. Intenta nuevamente.';
    }
  });
});


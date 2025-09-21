async function cargarCarrito() {
    const answ = await fetch("http://localhost:3000/api/cart");
    const contenedor = document.getElementById("productos");
    const cart = await answ.json();

    if (cart.length === 0) {

        contenedor.innerHTML = "<p>No hay productos en el carrito</p>";
    return;
    }

    cart.forEach(prod => {
        const item = document.createElement("div");
        item.className='card';
        item.innerHTML = `
            <img src="${prod.image[0]}" alt="${prod.title}" loading="lazy"">
            <h3>${prod.title}</h3>
            <h4>$${prod.price}</h4>
            <small>${prod.category.name}</small>
            <button onclick="eliminarDelCarrito(${prod.id})" class="btnP">Eliminar</button>
        `;
        contenedor.appendChild(item);
    });
}

async function eliminarDelCarrito(id) {
    await fetch(`http://localhost:3000/api/cart/${id}`, { method: "DELETE" });
    location.reload(); // recargar carrito
}

cargarCarrito();
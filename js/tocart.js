card.querySelector(".btnP").addEventListener("click", async () => {
  try {
    const producto = {
      id: prod.id,
      title: prod.title,
      price: prod.price,
      image: prod.images[0],
      category: prod.category.name
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

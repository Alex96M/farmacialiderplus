fetch("/api/productos")
  .then(res => res.json())
  .then(productos => {
    const contenedor = document.getElementById("catalogo");

    productos.forEach(p => {
      const div = document.createElement("div");
      div.className = "producto";
      div.innerHTML = `
        <img src="/${p.image}" alt="${p.name}">
        <h3>${p.name}</h3>
        <p>${p.description}</p>
        <strong>$${p.price}</strong>
      `;
      
      contenedor.appendChild(div);
    });
  })
  .catch(err => console.error(err));



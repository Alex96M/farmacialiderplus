async function cargarProductos() {
    try {
        const response = await fetch("/api/productos");
        const productos = await response.json();

        const contenedor = document.getElementById("catalogo");
        contenedor.classList.add("products-grid"); // ← AQUI
        contenedor.innerHTML = "";

        productos.forEach(p => {
            contenedor.innerHTML += `
                <div class="product">
                    <img src="/img/${p.image}" alt="${p.name}">
                    <h3>${p.name}</h3>
                    <p class="desc">${p.description ?? ""}</p>
                    <div class="meta">
                        <span>$${p.price} MXN</span>
                    </div>
                </div>
            `;
        });

    } catch (error) {
        console.error("Error al cargar productos:", error);
    }
}

cargarProductos();


const buscador = document.getElementById("buscador");

buscador.addEventListener("input", async () => {
    const q = buscador.value.trim();

    if (q.length === 0) {
        cargarProductos(); // cargar todos
        return;
    }

    try {
        const response = await fetch(`/api/buscar?q=${encodeURIComponent(q)}`);
        const productos = await response.json();
        
        const contenedor = document.getElementById("catalogo");
        contenedor.innerHTML = "";

        productos.forEach(p => {
            contenedor.innerHTML += `
                <div class="producto">
                    <img src="${p.image}" alt="${p.name}">
                    <h3>${p.name}</h3>
                    <p>$${p.price} MXN</p>
                </div>
            `;
        });

    } catch (error) {
        console.error("Error al buscar:", error);
    }
});



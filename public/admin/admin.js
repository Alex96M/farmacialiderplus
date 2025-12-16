async function cargar() {
  const res = await fetch("/api/productos");
  const data = await res.json();

  const ul = document.getElementById("lista");
  ul.innerHTML = "";

  data.forEach(p => {
    ul.innerHTML += `
      <li>
        ${p.name} - $${p.price}
        <button onclick="eliminar(${p.id})">X</button>
      </li>
    `;
  });
}

async function guardar() {
  const name = document.getElementById("name").value;
  const price = document.getElementById("price").value;
  const stock = document.getElementById("stock").value;

  await fetch("/api/admin/productos", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name,
      price,
      stock,
      description: "",
      category: "",
      image: "img/default.png"
    })
  });

  cargar();
}

async function eliminar(id) {
  await fetch(`/api/admin/productos/${id}`, { method: "DELETE" });
  cargar();
}

cargar();

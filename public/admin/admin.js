const token = localStorage.getItem("adminToken");
if (!token) location.href = "login.html";

let editId = null;

async function cargar() {
  const res = await fetch("/api/admin/productos", {
    headers: { "x-admin-token": token }
  });
  const data = await res.json();

  const ul = document.getElementById("lista");
  ul.innerHTML = "";

  data.forEach(p => {
    ul.innerHTML += `
      <li>
        ${p.name} - $${p.price}
        <button onclick="editar(${p.id})">Editar</button>
        <button onclick="eliminar(${p.id})">Eliminar</button>
      </li>
    `;
  });
}

async function subirImagen() {
  const file = document.getElementById("imagen").files[0];
  if (!file) return null;

  const form = new FormData();
  form.append("imagen", file);

  const res = await fetch("/api/admin/upload", {
    method: "POST",
    headers: { "x-admin-token": token },
    body: form
  });

  return (await res.json()).image;
}

async function guardar() {
  const image = await subirImagen();

  const producto = {
    name: name.value,
    price: price.value,
    stock: stock.value,
    category: category.value,
    description: description.value,
    image
  };

  const method = editId ? "PUT" : "POST";
  const url = editId
    ? `/api/admin/productos/${editId}`
    : "/api/admin/productos";

  await fetch(url, {
    method,
    headers: {
      "Content-Type": "application/json",
      "x-admin-token": token
    },
    body: JSON.stringify(producto)
  });

  editId = null;
  limpiar();
  cargar();
}

function editar(id) {
  editId = id;
}

async function eliminar(id) {
  if (!confirm("¿Eliminar producto?")) return;

  await fetch(`/api/admin/productos/${id}`, {
    method: "DELETE",
    headers: { "x-admin-token": token }
  });

  cargar();
}

function limpiar() {
  name.value = "";
  price.value = "";
  stock.value = "";
  category.value = "";
  description.value = "";
  imagen.value = "";
}

cargar();

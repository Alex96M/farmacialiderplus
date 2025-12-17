console.log("admin.js cargado");

const token = localStorage.getItem("adminToken");
if (!token) location.href = "login.html";

async function subirImagen() {
  const input = document.getElementById("imagen");
  if (!input.files.length) return "";

  const formData = new FormData();
  formData.append("imagen", input.files[0]);

  const res = await fetch("/api/admin/upload", {
    method: "POST",
    headers: {
      "x-admin-token": token
    },
    body: formData
  });

  if (!res.ok) {
    alert("Error al subir imagen");
    return "";
  }

  const data = await res.json();
  return data.image;
}

async function guardar() {
  const image = await subirImagen();

  const producto = {
    name: document.getElementById("name").value.trim(),
    description: document.getElementById("description").value.trim(),
    price: document.getElementById("price").value,
    category: document.getElementById("category").value.trim(),
    stock: document.getElementById("stock").value,
    image
  };

  const res = await fetch("/api/admin/productos", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-admin-token": token
    },
    body: JSON.stringify(producto)
  });

  if (!res.ok) {
    alert("Error al guardar producto");
    return;
  }

  alert("Producto guardado correctamente");
  limpiar();
  cargar();
}

function limpiar() {
  document.getElementById("name").value = "";
  document.getElementById("description").value = "";
  document.getElementById("price").value = "";
  document.getElementById("category").value = "";
  document.getElementById("stock").value = "";
  document.getElementById("imagen").value = "";
}

async function cargar() {
  const res = await fetch("/api/admin/productos", {
    headers: { "x-admin-token": token }
  });
  const data = await res.json();
  const lista = document.getElementById("lista");
  lista.innerHTML = "";
  data.forEach(p => {
    lista.innerHTML += `
      <li>
        ${p.name}
        <button onclick="eliminar(${p.id})">Eliminar</button>
      </li>`;
  });
}

async function eliminar(id) {
  if (!confirm("¿Eliminar producto?")) return;

  await fetch(`/api/admin/productos/${id}`, {
    method: "DELETE",
    headers: { "x-admin-token": token }
  });

  cargar();
}

cargar();

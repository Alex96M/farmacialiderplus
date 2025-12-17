console.log("admin.js cargado");

const token = localStorage.getItem("adminToken");
if (!token) location.href = "login.html";

async function guardar() {
  console.log("Guardar clic");

  const producto = {
    name: document.getElementById("name").value.trim(),
    description: document.getElementById("description").value.trim(),
    price: document.getElementById("price").value,
    category: document.getElementById("category").value.trim(),
    stock: document.getElementById("stock").value,
    image: ""
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
}

function limpiar() {
  document.getElementById("name").value = "";
  document.getElementById("description").value = "";
  document.getElementById("price").value = "";
  document.getElementById("category").value = "";
  document.getElementById("stock").value = "";
}



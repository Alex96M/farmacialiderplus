const token = localStorage.getItem("adminToken");

if (!token) {
  window.location.href = "/admin/login.html";
}

/* Cargar productos */
async function cargar() {
  const res = await fetch("/api/admin/productos", {
    headers: {
      "x-admin-token": token
    }
  });

  if (!res.ok) {
    alert("No autorizado");
    logout();
    return;
  }

  const productos = await res.json();
  const lista = document.getElementById("lista");
  lista.innerHTML = "";

  productos.forEach(p => {
    lista.innerHTML += `
      <tr>
        <td>${p.image ? `<img src="/${p.image}" class="admin-img" />` : ""}</td>
        <td>${p.name}</td>
        <td>$${p.price}</td>
        <td>${p.stock}</td>
        <td>
          <button class="btn-danger" onclick="eliminar(${p.id})">
            Eliminar
          </button>
        </td>
      </tr>
    `;
  });
}

/* Guardar producto */
async function guardar() {
  const formData = new FormData();
  formData.append("name", document.getElementById("name").value);
  formData.append("price", document.getElementById("price").value);
  formData.append("category", document.getElementById("category").value);
  formData.append("stock", document.getElementById("stock").value);
  formData.append("description", document.getElementById("description").value);
  formData.append("imagen", document.getElementById("imagen").files[0]);

  await fetch("/api/admin/productos", {
    method: "POST",
    headers: {
      "x-admin-token": token
    },
    body: formData
  });

  limpiar();
  cargar();

  alert("Producto ingresado");
}

function limpiar(){
  document.getElementById("name").value = '';
  document.getElementById("price").value = '';
  document.getElementById("category").value = '';
  document.getElementById("stock").value = '';
  document.getElementById("description").value = '';
  document.getElementById("imagen").value = '';
}

/* Eliminar producto */
async function eliminar(id) {
  if (!confirm("¿Eliminar este producto?")) return;

  await fetch(`/api/admin/productos/${id}`, {
    method: "DELETE",
    headers: {
      "x-admin-token": token
    }
  });

  cargar();
}

/* Logout */
function logout() {
  localStorage.removeItem("adminToken");
  window.location.href = "/admin/login.html";
}

cargar();

function logout() {
  localStorage.removeItem("adminToken");
  window.location.href = "/admin/login.html";
}










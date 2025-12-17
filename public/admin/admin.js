const token = localStorage.getItem("token");

if (!token) {
  window.location.href = "/admin/login.html";
}

/* Cargar productos */
async function cargar() {
  const res = await fetch("/api/admin/productos", {
    headers: {
      Authorization: "Bearer " + token
    }
  });

  const productos = await res.json();
  const lista = document.getElementById("lista");
  lista.innerHTML = "";

  productos.forEach(p => {
    lista.innerHTML += `
      <tr>
        <td><img src="/${p.image}"></td>
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
      Authorization: "Bearer " + token
    },
    body: formData
  });

  cargar();
}

/* Eliminar */
async function eliminar(id) {
  if (!confirm("¿Eliminar este producto?")) return;

  await fetch(`/api/admin/productos/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: "Bearer " + token
    }
  });

  cargar();
}

/* Logout */
function logout() {
  localStorage.removeItem("token");
  window.location.href = "/admin/login.html";
}

cargar();



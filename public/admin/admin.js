async function subirImagen() {
  const fileInput = document.getElementById("imagen");
  if (!fileInput.files.length) return "";

  const formData = new FormData();
  formData.append("imagen", fileInput.files[0]);

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
  const image = await subirImagen(); // 🔑 primero sube imagen

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





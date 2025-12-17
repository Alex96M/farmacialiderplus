async function login() {
  const user = document.getElementById("usuario").value;
  const pass = document.getElementById("password").value;
  const mensaje = document.getElementById("mensaje");

  mensaje.textContent = "";

  const res = await fetch("/api/admin/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ user, pass })
  });

  if (!res.ok) {
    mensaje.textContent = "Credenciales incorrectas";
    return;
  }

  const data = await res.json();

  // Guardamos el token simple
  localStorage.setItem("adminToken", data.token);

  window.location.href = "/admin/admin.html";
}


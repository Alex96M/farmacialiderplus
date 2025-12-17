async function login() {
  const usuario = document.getElementById("usuario").value;
  const password = document.getElementById("password").value;
  const mensaje = document.getElementById("mensaje");

  mensaje.textContent = "";

  const res = await fetch("/api/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ usuario, password })
  });

  if (!res.ok) {
    mensaje.textContent = "Credenciales incorrectas";
    return;
  }

  const data = await res.json();
  localStorage.setItem("token", data.token);

  window.location.href = "/admin/admin.html";
}

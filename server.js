require("./db_init");

const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const multer = require("multer");
const path = require("path");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use("/img", express.static("/data/uploads"));
const PORT = process.env.PORT || 3000;

// Base de datos
const db = new sqlite3.Database("/data/database.sqlite");

const ADMIN_USER = process.env.ADMIN_USER || "administrador";
const ADMIN_PASS = process.env.ADMIN_PASS || "Farmalider+";

// Middleware para servir la carpeta /public
app.use(express.static(path.join(__dirname, "public")));

app.post("/api/admin/login", (req, res) => {
  const { user, pass } = req.body;

  if (user === ADMIN_USER && pass === ADMIN_PASS) {
    res.json({ token: ADMIN_PASS });
  } else {
    res.status(401).json({ error: "Credenciales incorrectas" });
  }
});

function authAdmin(req, res, next) {
  const token = req.headers["x-admin-token"];
  if (token !== ADMIN_PASS) {
    return res.status(403).json({ error: "No autorizado" });
  }
  next();
}


// Ruta para obtener productos
app.get("/api/admin/productos", authAdmin, (req, res) => {
  db.all("SELECT * FROM productos", [], (err, rows) => {
    if (err) {
      console.error("Error al listar productos (admin):", err);
      return res.status(500).json({ error: "Error al obtener productos" });
    }
    res.json(rows);
  });
});

app.get("/api/productos", (req, res) => {
  db.all("SELECT * FROM productos", [], (err, rows) => {
    if (err) {
      console.error("Error al listar productos:", err);
      return res.status(500).json({ error: "Error al obtener productos" });
    }
    res.json(rows);
  });
});

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "/data/uploads");
  },
  filename: function (req, file, cb) {
    const ext = file.originalname.split(".").pop();
    cb(null, Date.now() + "." + ext);
  }
});

const upload = multer({ storage });


// Ruta para buscar productos por nombre
app.get("/api/buscar", (req, res) => {
  const q = `%${req.query.q || ""}%`;

  db.all(
    `SELECT * FROM productos 
     WHERE name LIKE ? OR category LIKE ?`,
    [q, q],
    (err, rows) => {
      if (err) return res.status(500).json(err);
      res.json(rows);
    }
  );
});


// Iniciar servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

// Crear producto
app.post(
  "/api/admin/productos",
  authAdmin,
  upload.single("imagen"),
  (req, res) => {
    const { name, description, price, category, stock } = req.body;
    const imagePath = req.file ? "/img/" + req.file.filename : null;

    if (!name || !price) {
      return res.status(400).json({ error: "Datos incompletos" });
    }

    db.run(
      `INSERT INTO productos (name, description, price, category, image, stock)
       VALUES (?,?,?,?,?,?)`,
      [name, description, price, category, imagePath, stock],
      err => {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: "Error al guardar" });
        }
        res.json({ ok: true });
      }
    );
  }
);

// Editar Producto
app.put("/api/admin/productos/:id", authAdmin, (req, res) => {
  const { name, description, price, category, image, stock } = req.body;

  db.run(
    `UPDATE productos
     SET name=?, description=?, price=?, category=?, image=?, stock=?
     WHERE id=?`,
    [name, description, price, category, image, stock, req.params.id],
    err => {
      if (err) return res.status(500).json(err);
      res.json({ success: true });
    }
  );
});

// Eliminar Producto
app.delete("/api/admin/productos/:id", authAdmin, (req, res) => {
  db.run("DELETE FROM productos WHERE id=?", [req.params.id], err => {
    if (err) return res.status(500).json(err);
    res.json({ success: true });
  });
});

//Subir imagen
app.post(
  "/api/admin/upload",
  authAdmin,
  upload.single("imagen"),
  (req, res) => {
    if (!req.file) {
      return res.status(400).json({ error: "No se subió imagen" });
    }

    res.json({ image: `img/${req.file.filename}` });
  }
);

//






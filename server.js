const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const multer = require("multer");
const path = require("path");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const PORT = process.env.PORT || 3000;

// Base de datos
const db = new sqlite3.Database("/data/database.sqlite");

const ADMIN_USER = process.env.ADMIN_USER || "admin";
const ADMIN_PASS = process.env.ADMIN_PASS || "1234";

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
app.get("/api/productos", (req, res) => {
    db.all("SELECT * FROM productos", [], (err, rows) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: "Error al cargar productos" });
        } else {
            res.json(rows);
        }
    });
});

const storage = multer.diskStorage({
  destination: path.join(__dirname, "public/img"),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + ext);
  }
});

const upload = multer({ storage });

// Ruta para buscar productos por nombre
app.get("/api/buscar", (req, res) => {
    const termino = req.query.q;

    if (!termino) {
        return res.json([]);
    }

    const sql = `
        SELECT * FROM productos 
        WHERE name LIKE ? OR category LIKE ?
    `;

    db.all(sql, [`%${termino}%`, `%${termino}%`], (err, rows) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: "Error al buscar productos" });
        }
        res.json(rows);
    });
});


// Iniciar servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

// Crear producto
app.post("/api/admin/productos", authAdmin, (req, res) => {
  const { name, description, price, category, image, stock } = req.body;

  db.run(
    `INSERT INTO productos (name, description, price, category, image, stock)
     VALUES (?,?,?,?,?,?)`,
    [name, description, price, category, image, stock],
    function (err) {
      if (err) return res.status(500).json(err);
      res.json({ id: this.lastID });
    }
  );
});


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
    res.json({ image: `img/${req.file.filename}` });
  }
);



//



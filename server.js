const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const app = express();
app.use(express.json());
const PORT = process.env.PORT || 3000;

// Base de datos
const db = new sqlite3.Database("/data/database.sqlite");

// Middleware para servir la carpeta /public
app.use(express.static(path.join(__dirname, "public")));

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
app.post("/api/admin/productos", (req, res) => {
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
app.put("/api/admin/productos/:id", (req, res) => {
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
app.delete("/api/admin/productos/:id", (req, res) => {
  db.run(
    `DELETE FROM productos WHERE id=?`,
    [req.params.id],
    err => {
      if (err) return res.status(500).json(err);
      res.json({ success: true });
    }
  );
});


//

const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database("/data/database.sqlite");

db.serialize(() => {
  db.run(`DROP TABLE IF EXISTS productos;`);
  db.run(`
    CREATE TABLE productos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT,
      price REAL NOT NULL,
      category TEXT,
      image TEXT,
      stock INTEGER DEFAULT 0
    );
  `);

  const stmt = db.prepare(`
    INSERT INTO productos (name, description, price, category, image, stock)
    VALUES (?,?,?,?,?,?)
  `);

  // Productos de ejemplo (usa imágenes externas o rutas relativas)
  stmt.run(
    "Paracetamol 500 mg",
    "Caja 10 tabletas - Alivio de dolor y fiebre",
    25.00,
    "Analgésicos",
    "img/paracetamol.png",
    50
  );
  stmt.run(
    "Suero Oral 1L",
    "Líquido de rehidratación oral",
    32.00,
    "Rehidratación",
    "img/suero.png",
    20
  );
  stmt.run(
    "Ibuprofeno 400 mg",
    "Antiinflamatorio y analgésico",
    28.00,
    "Analgésicos",
    "img/ibuprofeno.png",
    30
  );
  stmt.run(
    "Vendas y Curitas",
    "Material de curación y primeros auxilios",
    15.00,
    "Material",
    "img/curitas.png",
    100
  );

  stmt.run(
  "Omeprazol 20 mg",
  "Protector gástrico",
  45.00,
  "Gastritis",
  "img/omeprazol.png",
  40
);

stmt.run(
  "Algodón Médico 100g",
  "Material de curación",
  18.00,
  "Material",
  "img/algodon.jpg",
  60
);

stmt.run(
  "Alcohol 70%",
  "Antiséptico para limpieza",
  22.00,
  "Material",
  "img/alcohol.png",
  30
);


  stmt.finalize();
});

db.close(() => {
  console.log("Base de datos inicializada: database.sqlite (productos de ejemplo insertados).");
});

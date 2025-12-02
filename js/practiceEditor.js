// practiceEditor.js - Funcionalidad del Laboratorio Interactivo
document.addEventListener('DOMContentLoaded', () => {
  // Elementos del DOM
  const sqlEditor = document.getElementById('sqlEditor');
  const queryOutput = document.getElementById('queryOutput');
  const runBtn = document.getElementById('runQuery');
  const clearBtn = document.getElementById('clearQuery');
  const exerciseItems = document.querySelectorAll('.exercise-item');
  const exerciseTitle = document.getElementById('exercise-title');
  const exerciseDesc = document.getElementById('exercise-desc');

  // Definición de ejercicios
  const exercises = {
    'setup': {
      title: 'Paso 0: Crear Base de Datos y Tablas',
      description: 'Ejecuta este script para inicializar la base de datos con tablas y datos de ejemplo.',
      starterCode: `-- Paso 1: Crear tablas
CREATE TABLE Productos (
    ProductoID INT IDENTITY(1,1) PRIMARY KEY,
    Nombre VARCHAR(100) NOT NULL,
    Precio DECIMAL(10,2) NOT NULL,
    Stock INT NOT NULL
);

CREATE TABLE Clientes (
    ClienteID INT IDENTITY(1,1) PRIMARY KEY,
    Nombre VARCHAR(100) NOT NULL,
    Email VARCHAR(100)
);

CREATE TABLE Ventas (
    VentaID INT IDENTITY(1,1) PRIMARY KEY,
    ProductoID INT,
    ClienteID INT,
    Cantidad INT,
    Total DECIMAL(10,2),
    FechaVenta DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (ProductoID) REFERENCES Productos(ProductoID),
    FOREIGN KEY (ClienteID) REFERENCES Clientes(ClienteID)
);

-- Paso 2: Insertar datos de ejemplo
INSERT INTO Productos (Nombre, Precio, Stock) VALUES
('Laptop Pro', 1499.99, 15),
('Teclado Mecánico', 89.99, 50),
('Mouse Inalámbrico', 29.99, 100),
('Monitor 24"', 199.99, 30);

INSERT INTO Clientes (Nombre, Email) VALUES
('Ana López', 'ana@email.com'),
('Carlos Ruiz', 'carlos@email.com');`,
      simulate: () => `
        <div class="result-display">
          <h5>✅ Base de Datos Inicializada</h5>
          <p>Tablas creadas: <code>Productos</code>, <code>Clientes</code>, <code>Ventas</code>.</p>
          <p>Datos de ejemplo insertados correctamente.</p>
          <p>¡Ahora puedes practicar con los otros ejercicios!</p>
        </div>`
    },
    '1': {
      title: 'Ejercicio 1: Crear Procedimiento',
      description: 'Crea un procedimiento que muestre los productos con stock menor a un valor dado como parámetro.',
      starterCode: `-- Ejemplo: Mostrar productos con stock < 20
CREATE PROCEDURE sp_ProductosBajoStock
    @StockMinimo INT
AS
BEGIN
    SELECT ProductoID, Nombre, Stock
    FROM Productos
    WHERE Stock < @StockMinimo
    ORDER BY Stock ASC;
END;`,
      simulate: () => `
        <div class="result-display">
          <h5>📊 Resultado de la ejecución</h5>
          <div class="result-table">
            <table>
              <thead><tr><th>ProductoID</th><th>Nombre</th><th>Stock</th></tr></thead>
              <tbody>
                <tr><td>1</td><td>Laptop Pro</td><td>15</td></tr>
              </tbody>
            </table>
          </div>
          <p><em>✅ Procedimiento ejecutado con @StockMinimo = 20.</em></p>
        </div>`
    },
    '2': {
      title: 'Ejercicio 2: Crear Trigger',
      description: 'Crea un trigger que registre en una tabla de auditoría cada vez que se actualice el precio de un producto.',
      starterCode: `-- Primero, crea la tabla de auditoría (si no existe)
CREATE TABLE AuditoriaPrecio (
    ID INT IDENTITY(1,1) PRIMARY KEY,
    ProductoID INT,
    PrecioAnterior DECIMAL(10,2),
    PrecioNuevo DECIMAL(10,2),
    Fecha DATETIME DEFAULT GETDATE()
);

-- Luego, crea el trigger
CREATE TRIGGER trg_AuditarPrecio
ON Productos
AFTER UPDATE
AS
BEGIN
    IF UPDATE(Precio)
    BEGIN
        INSERT INTO AuditoriaPrecio (ProductoID, PrecioAnterior, PrecioNuevo)
        SELECT d.ProductoID, d.Precio, i.Precio
        FROM deleted d
        JOIN inserted i ON d.ProductoID = i.ProductoID
        WHERE d.Precio <> i.Precio;
    END
END;`,
      simulate: () => `
        <div class="result-display">
          <h5>✅ Trigger creado</h5>
          <p>El trigger <code>trg_AuditarPrecio</code> se activará al modificar precios.</p>
          <p>Prueba con: <code>UPDATE Productos SET Precio = 1599.99 WHERE ProductoID = 1;</code></p>
        </div>`
    },
    '3': {
      title: 'Ejercicio 3: Optimizar Consulta',
      description: 'Reescribe la consulta para mejorar su rendimiento usando índices y evitando funciones en el WHERE.',
      starterCode: `-- Consulta original (lenta)
SELECT p.Nombre, c.Nombre AS Cliente, v.Cantidad
FROM Ventas v
JOIN Productos p ON v.ProductoID = p.ProductoID
JOIN Clientes c ON v.ClienteID = c.ClienteID
WHERE YEAR(v.FechaVenta) = 2024;`,
      simulate: () => `
        <div class="result-display">
          <h5>📊 Consulta Optimizada</h5>
          <pre><code>-- Versión recomendada
SELECT p.Nombre, c.Nombre AS Cliente, v.Cantidad
FROM Ventas v
JOIN Productos p ON v.ProductoID = p.ProductoID
JOIN Clientes c ON v.ClienteID = c.ClienteID
WHERE v.FechaVenta >= '2024-01-01'
  AND v.FechaVenta < '2025-01-01';</code></pre>
        <p>💡 Recuerda crear un índice en <code>Ventas(FechaVenta)</code> para mejorar el rendimiento.</p>
      </div>`
    }
  };

  // === FUNCIONALIDAD: Cambiar entre ejercicios ===
  exerciseItems.forEach(btn => {
    btn.addEventListener('click', () => {
      const exerciseId = btn.dataset.exercise;
      const ex = exercises[exerciseId];

      if (!ex) return;

      // Actualizar estado visual
      exerciseItems.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      // Actualizar descripción y editor
      if (exerciseTitle) exerciseTitle.textContent = ex.title;
      if (exerciseDesc) exerciseDesc.textContent = ex.description;
      if (sqlEditor) sqlEditor.value = ex.starterCode;

      // Resetear salida
      if (queryOutput) {
        queryOutput.innerHTML = `
          <div class="output-placeholder">
            <span class="output-icon">📊</span>
            <p>Los resultados aparecerán aquí al ejecutar tu consulta</p>
          </div>
        `;
      }
    });
  });

  // === FUNCIONALIDAD: Ejecutar consulta (simulación) ===
  if (runBtn) {
    runBtn.addEventListener('click', () => {
      const activeBtn = document.querySelector('.exercise-item.active');
      const exerciseId = activeBtn ? activeBtn.dataset.exercise : '1';
      const ex = exercises[exerciseId];

      if (ex && queryOutput) {
        queryOutput.innerHTML = ex.simulate();
      } else {
        queryOutput.innerHTML = `
          <div class="output-placeholder">
            <span class="output-icon">⚠️</span>
            <p>No se pudo ejecutar la consulta. Selecciona un ejercicio válido.</p>
          </div>
        `;
      }
    });
  }

  // === FUNCIONALIDAD: Limpiar editor ===
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      const activeBtn = document.querySelector('.exercise-item.active');
      const exerciseId = activeBtn ? activeBtn.dataset.exercise : '1';
      const ex = exercises[exerciseId];

      if (sqlEditor && ex) sqlEditor.value = ex.starterCode;

      if (queryOutput) {
        queryOutput.innerHTML = `
          <div class="output-placeholder">
            <span class="output-icon">📊</span>
            <p>Los resultados aparecerán aquí al ejecutar tu consulta</p>
          </div>
        `;
      }
    });
  }

  // === (Opcional) Soporte para pestañas Editor/Resultados ===
  document.querySelectorAll('.editor-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.editor-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      // En una versión avanzada, podrías ocultar/mostrar secciones del editor.
    });
  });
});
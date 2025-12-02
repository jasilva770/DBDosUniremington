// practiceEditor.js - Funcionalidad interactiva del laboratorio
document.addEventListener('DOMContentLoaded', () => {
  const sqlEditor = document.getElementById('sqlEditor');
  const queryOutput = document.getElementById('queryOutput');
  const runBtn = document.getElementById('runQuery');
  const clearBtn = document.getElementById('clearQuery');
  const exerciseItems = document.querySelectorAll('.exercise-item');
  const exerciseTitle = document.getElementById('exercise-title');
  const exerciseDesc = document.getElementById('exercise-desc');

  // Configuración de ejercicios
  const exercises = {
    '1': {
      title: 'Ejercicio 1: Crear Procedimiento',
      description: 'Crea un procedimiento que muestre los productos con stock menor a un valor dado como parámetro.',
      starterCode: `-- Escribe tu código SQL aquí
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
                <tr><td>105</td><td>Teclado Mecánico</td><td>8</td></tr>
                <tr><td>112</td><td>Mouse Inalámbrico</td><td>5</td></tr>
              </tbody>
            </table>
          </div>
          <p><em>✅ Procedimiento ejecutado correctamente.</em></p>
        </div>`
    },
    '2': {
      title: 'Ejercicio 2: Crear Trigger',
      description: 'Crea un trigger que registre en una tabla de auditoría cada vez que se actualice el precio de un producto.',
      starterCode: `-- Escribe tu código SQL aquí
CREATE TRIGGER trg_AuditarPrecio
ON Productos
AFTER UPDATE
AS
BEGIN
    INSERT INTO Auditoria (ProductoID, PrecioAnterior, PrecioNuevo, Fecha)
    SELECT 
        i.ProductoID,
        d.Precio,
        i.Precio,
        GETDATE()
    FROM inserted i
    JOIN deleted d ON i.ProductoID = d.ProductoID
    WHERE i.Precio <> d.Precio;
END;`,
      simulate: () => `
        <div class="result-display">
          <h5>📊 Resultado de la ejecución</h5>
          <p>✅ Trigger creado y activado en la tabla <code>Productos</code>.</p>
          <p>Se generó una entrada en <code>Auditoria</code> con los cambios de precio.</p>
        </div>`
    },
    '3': {
      title: 'Ejercicio 3: Optimizar Consulta',
      description: 'Reescribe la consulta para mejorar su rendimiento usando índices y evitando funciones en el WHERE.',
      starterCode: `-- Consulta original (lenta)
SELECT *
FROM Ventas v
JOIN Clientes c ON v.ClienteID = c.ClienteID
WHERE YEAR(v.Fecha) = 2024;`,
      simulate: () => `
        <div class="result-display">
          <h5>📊 Resultado de la ejecución</h5>
          <div class="performance-comparison">
            <div class="perf-item bad"><span class="label">Antes</span><span class="value">12.4s</span></div>
            <div class="perf-item good"><span class="label">Después</span><span class="value">0.2s</span></div>
          </div>
          <p>🎉 <strong>98% de mejora</strong> con tu versión optimizada.</p>
        </div>`
    }
  };

  // Cambiar ejercicio
  exerciseItems.forEach(btn => {
    btn.addEventListener('click', () => {
      const exerciseId = btn.dataset.exercise;
      const ex = exercises[exerciseId];

      // Actualizar UI
      exerciseItems.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      exerciseTitle.textContent = ex.title;
      exerciseDesc.textContent = ex.description;
      sqlEditor.value = ex.starterCode;
      queryOutput.innerHTML = `
        <div class="output-placeholder">
          <span class="output-icon">📊</span>
          <p>Los resultados aparecerán aquí al ejecutar tu consulta</p>
        </div>
      `;
    });
  });

  // Ejecutar consulta (simulación)
  if (runBtn) {
    runBtn.addEventListener('click', () => {
      const currentExerciseBtn = document.querySelector('.exercise-item.active');
      const exerciseId = currentExerciseBtn?.dataset.exercise || '1';
      const ex = exercises[exerciseId];

      queryOutput.innerHTML = ex.simulate();
    });
  }

  // Limpiar editor
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      const currentExerciseBtn = document.querySelector('.exercise-item.active');
      const exerciseId = currentExerciseBtn?.dataset.exercise || '1';
      sqlEditor.value = exercises[exerciseId].starterCode;
      queryOutput.innerHTML = `
        <div class="output-placeholder">
          <span class="output-icon">📊</span>
          <p>Los resultados aparecerán aquí al ejecutar tu consulta</p>
        </div>
      `;
    });
  }

  // (Opcional) Cambiar entre pestañas "Editor" y "Resultados"
  document.querySelectorAll('.editor-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.editor-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      // En una versión avanzada, podrías ocultar/mostrar secciones.
    });
  });
});
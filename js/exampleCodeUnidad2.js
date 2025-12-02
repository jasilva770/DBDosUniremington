// exampleCodeUnidad2.js - Funcionalidad para los bloques .code-example en Unidad 2
document.addEventListener('DOMContentLoaded', () => {
  // 1. MANEJO DE PESTAÑAS EN BLOQUES .code-example
  document.querySelectorAll('.code-example').forEach(example => {
    const tabsContainer = example.querySelector('.code-tabs');
    const panelsContainer = example.querySelector('.code-panels');

    if (!tabsContainer || !panelsContainer) return;

    const tabs = tabsContainer.querySelectorAll('.tab-btn');
    const panels = panelsContainer.querySelectorAll('.code-panel');

    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        // Quitar clase 'active' de todas las pestañas y paneles
        tabs.forEach(t => t.classList.remove('active'));
        panels.forEach(p => p.classList.remove('active'));

        // Activar pestaña clicada
        tab.classList.add('active');

        // Mostrar panel correspondiente
        const targetPanelId = tab.dataset.tab;
        const targetPanel = panelsContainer.querySelector(`#${targetPanelId}`);
        if (targetPanel) {
          targetPanel.classList.add('active');
        }
      });
    });
  });

  // 2. BOTONES DE COPIAR CÓDIGO
  document.querySelectorAll('.copy-btn').forEach(button => {
    button.addEventListener('click', () => {
      const codeId = button.dataset.code;
      const codeElement = document.getElementById(codeId);

      if (!codeElement) {
        console.warn(`Elemento con id="${codeId}" no encontrado.`);
        return;
      }

      const text = codeElement.textContent || codeElement.innerText;
      if (!text.trim()) return;

      navigator.clipboard.writeText(text).then(() => {
        const originalContent = button.innerHTML;
        button.innerHTML = '✅ ¡Copiado!';
        setTimeout(() => {
          button.innerHTML = originalContent;
        }, 2000);
      }).catch(err => {
        console.error('Error al copiar:', err);
        button.innerHTML = '⚠️ Error';
        setTimeout(() => {
          button.innerHTML = originalContent;
        }, 2000);
      });
    });
  });
});
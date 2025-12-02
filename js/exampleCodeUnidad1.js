// exampleCodeUnidad1.js - Funcionalidad para los bloques .code-example en Unidad 1
document.addEventListener('DOMContentLoaded', () => {
  // 1. MANEJO DE PESTAÑAS DENTRO DE .code-example
  document.querySelectorAll('.code-example').forEach(example => {
    const tabsContainer = example.querySelector('.code-tabs');
    const panelsContainer = example.querySelector('.code-panels');

    if (!tabsContainer || !panelsContainer) return;

    const tabs = tabsContainer.querySelectorAll('.tab-btn');
    const panels = panelsContainer.querySelectorAll('.code-panel');

    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        // Quitar 'active' de todas las pestañas y paneles
        tabs.forEach(t => t.classList.remove('active'));
        panels.forEach(p => p.classList.remove('active'));

        // Activar la pestaña clicada
        tab.classList.add('active');

        // Mostrar el panel correspondiente
        const targetPanelId = tab.dataset.tab;
        const targetPanel = panelsContainer.querySelector(`#${targetPanelId}`);
        if (targetPanel) targetPanel.classList.add('active');
      });
    });
  });

  // 2. BOTONES DE COPIAR CÓDIGO
  document.querySelectorAll('.copy-btn').forEach(button => {
    button.addEventListener('click', () => {
      const codeId = button.dataset.code;
      const codeElement = document.getElementById(codeId);

      if (!codeElement) {
        console.warn(`No se encontró el elemento con id="${codeId}"`);
        return;
      }

      const textToCopy = codeElement.textContent || codeElement.innerText;
      if (!textToCopy.trim()) return;

      // Copiar al portapapeles
      navigator.clipboard.writeText(textToCopy).then(() => {
        const originalHTML = button.innerHTML;
        button.innerHTML = '✅ ¡Copiado!';
        setTimeout(() => {
          button.innerHTML = originalHTML;
        }, 2000);
      }).catch(err => {
        console.error('Error al copiar:', err);
        button.innerHTML = '⚠️ Error';
        setTimeout(() => {
          button.innerHTML = originalHTML;
        }, 2000);
      });
    });
  });
});
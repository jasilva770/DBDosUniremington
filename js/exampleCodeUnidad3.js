// exampleCodeUnidad3.js - Funcionalidad para bloques .code-example en Unidad 3
document.addEventListener('DOMContentLoaded', () => {
  // 1. Manejo de pestañas en .code-example
  document.querySelectorAll('.code-example').forEach(example => {
    const tabsContainer = example.querySelector('.code-tabs');
    const panelsContainer = example.querySelector('.code-panels');

    if (!tabsContainer || !panelsContainer) return;

    const tabs = tabsContainer.querySelectorAll('.tab-btn');
    const panels = panelsContainer.querySelectorAll('.code-panel');

    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('active'));
        panels.forEach(p => p.classList.remove('active'));

        tab.classList.add('active');

        const targetPanelId = tab.dataset.tab;
        const targetPanel = panelsContainer.querySelector(`#${targetPanelId}`);
        if (targetPanel) targetPanel.classList.add('active');
      });
    });
  });

  // 2. Botones de copiar
  document.querySelectorAll('.copy-btn').forEach(button => {
    button.addEventListener('click', () => {
      const codeId = button.dataset.code;
      const codeEl = document.getElementById(codeId);
      if (!codeEl) return;

      const text = codeEl.textContent || codeEl.innerText;
      if (!text.trim()) return;

      navigator.clipboard.writeText(text).then(() => {
        const original = button.innerHTML;
        button.innerHTML = '✅ ¡Copiado!';
        setTimeout(() => button.innerHTML = original, 2000);
      }).catch(() => {
        button.innerHTML = '⚠️ Error';
        setTimeout(() => {
          const original = button.innerHTML;
          button.innerHTML = original;
        }, 2000);
      });
    });
  });
});
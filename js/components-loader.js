document.addEventListener('DOMContentLoaded', async () => {
  const headerPlaceholder = document.getElementById('header-placeholder');
  const footerPlaceholder = document.getElementById('footer-placeholder');

  if (!headerPlaceholder && !footerPlaceholder) return;

  try {
    if (headerPlaceholder) {
      const res = await fetch('components/header.html');
      if (res.ok) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(await res.text(), 'text/html');
        headerPlaceholder.replaceWith(...doc.body.children);
      }
    }

    if (footerPlaceholder) {
      const res = await fetch('components/footer.html');
      if (res.ok) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(await res.text(), 'text/html');
        footerPlaceholder.replaceWith(...doc.body.children);
      }
    }
  } catch (err) {
    console.warn('⚠️ Error al cargar componentes:', err);
  }
});
function loadIncludes() {
  document.querySelectorAll('[data-include]').forEach(el => {
    fetch(el.getAttribute('data-include'))
      .then(response => response.text())
      .then(html => {
        el.outerHTML = html;
      });
  });
}

document.addEventListener('DOMContentLoaded', loadIncludes);

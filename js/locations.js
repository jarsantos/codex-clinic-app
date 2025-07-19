document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('location-form');
  const tableBody = document.querySelector('#locations-table tbody');
  let locations = loadData('locations');
  if (!locations.length) {
    locations = [
      { id: 1, name: 'Gabinete 1' },
      { id: 2, name: 'Gabinete 2' },
      { id: 3, name: 'Gabinete 3' },
      { id: 4, name: 'Gabinete 4' },
      { id: 5, name: 'Gabinete 5' },
      { id: 6, name: 'Gabinete 6' },
      { id: 7, name: 'Gabinete 7' }
    ];
  }

  function render() {
    tableBody.innerHTML = '';
    locations.forEach(l => {
      const tr = document.createElement('tr');
      tr.innerHTML = `<td>${l.name}</td><td><button class="icon-btn" data-id="${l.id}" data-action="edit" aria-label="Editar">✏️</button> <button class="icon-btn" data-id="${l.id}" data-action="delete" aria-label="Eliminar">🗑️</button></td>`;
      tableBody.appendChild(tr);
    });
  }

  form.addEventListener('submit', e => {
    e.preventDefault();
    const id = document.getElementById('location-id').value;
    const name = document.getElementById('location-name').value.trim();
    if (id) {
      const l = locations.find(l => l.id == id);
      l.name = name;
    } else {
      locations.push({ id: nextId(locations), name });
    }
    saveData('locations', locations);
    form.reset();
    render();
  });

  tableBody.addEventListener('click', e => {
    const id = e.target.dataset.id;
    if (!id) return;
    const action = e.target.dataset.action;
    if (action === 'edit') {
      const l = locations.find(l => l.id == id);
      document.getElementById('location-id').value = l.id;
      document.getElementById('location-name').value = l.name;
    } else if (action === 'delete') {
      locations = locations.filter(l => l.id != id);
      saveData('locations', locations);
      render();
    }
  });

  saveData('locations', locations);
  render();
});

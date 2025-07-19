document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('type-form');
  const tableBody = document.querySelector('#types-table tbody');
  let types = loadData('appointmentTypes');

  function render() {
    tableBody.innerHTML = '';
    types.forEach(t => {
      const tr = document.createElement('tr');
      tr.innerHTML = `<td>${t.name}</td><td>${t.specialty}</td><td>${t.default_duration_minutes}</td><td><button data-id="${t.id}" data-action="edit">Editar</button> <button data-id="${t.id}" data-action="delete">Eliminar</button></td>`;
      tableBody.appendChild(tr);
    });
  }

  form.addEventListener('submit', e => {
    e.preventDefault();
    const id = document.getElementById('type-id').value;
    const name = document.getElementById('type-name').value.trim();
    const specialty = document.getElementById('type-specialty').value;
    const duration = parseInt(document.getElementById('type-duration').value, 10);
    if (id) {
      const t = types.find(t => t.id == id);
      t.name = name;
      t.specialty = specialty;
      t.default_duration_minutes = duration;
    } else {
      types.push({ id: nextId(types), name, specialty, default_duration_minutes: duration });
    }
    saveData('appointmentTypes', types);
    form.reset();
    render();
  });

  tableBody.addEventListener('click', e => {
    const id = e.target.dataset.id;
    if (!id) return;
    const action = e.target.dataset.action;
    if (action === 'edit') {
      const t = types.find(t => t.id == id);
      document.getElementById('type-id').value = t.id;
      document.getElementById('type-name').value = t.name;
      document.getElementById('type-specialty').value = t.specialty;
      document.getElementById('type-duration').value = t.default_duration_minutes;
    } else if (action === 'delete') {
      types = types.filter(t => t.id != id);
      saveData('appointmentTypes', types);
      render();
    }
  });

  render();
});

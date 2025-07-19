document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('patient-form');
  const tableBody = document.querySelector('#patients-table tbody');
  let patients = loadData('patients');

  function render() {
    tableBody.innerHTML = '';
    patients.forEach(p => {
      const tr = document.createElement('tr');
      tr.innerHTML = `<td>${p.name}</td><td><button class="icon-btn" data-id="${p.id}" data-action="edit" aria-label="Editar">✏️</button> <button class="icon-btn" data-id="${p.id}" data-action="delete" aria-label="Eliminar">🗑️</button></td>`;
      tableBody.appendChild(tr);
    });
  }

  form.addEventListener('submit', e => {
    e.preventDefault();
    const id = document.getElementById('patient-id').value;
    const name = document.getElementById('patient-name').value.trim();
    if (id) {
      const p = patients.find(p => p.id == id);
      p.name = name;
    } else {
      patients.push({ id: nextId(patients), name });
    }
    saveData('patients', patients);
    form.reset();
    render();
  });

  tableBody.addEventListener('click', e => {
    const id = e.target.dataset.id;
    if (!id) return;
    const action = e.target.dataset.action;
    if (action === 'edit') {
      const p = patients.find(p => p.id == id);
      document.getElementById('patient-id').value = p.id;
      document.getElementById('patient-name').value = p.name;
    } else if (action === 'delete') {
      patients = patients.filter(p => p.id != id);
      saveData('patients', patients);
      render();
    }
  });

  render();
});

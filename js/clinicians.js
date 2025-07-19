document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('clinician-form');
  const tableBody = document.querySelector('#clinicians-table tbody');
  let clinicians = loadData('clinicians');

  function render() {
    tableBody.innerHTML = '';
    clinicians.forEach(c => {
      const tr = document.createElement('tr');
      tr.innerHTML = `<td>${c.name}</td><td>${c.specialty}</td><td><button data-id="${c.id}" data-action="edit">Editar</button> <button data-id="${c.id}" data-action="delete">Eliminar</button></td>`;
      tableBody.appendChild(tr);
    });
  }

  form.addEventListener('submit', e => {
    e.preventDefault();
    const id = document.getElementById('clinician-id').value;
    const name = document.getElementById('clinician-name').value.trim();
    const specialty = document.getElementById('clinician-specialty').value;
    if (id) {
      const c = clinicians.find(c => c.id == id);
      c.name = name;
      c.specialty = specialty;
    } else {
      clinicians.push({ id: nextId(clinicians), name, specialty });
    }
    saveData('clinicians', clinicians);
    form.reset();
    render();
  });

  tableBody.addEventListener('click', e => {
    const id = e.target.dataset.id;
    if (!id) return;
    const action = e.target.dataset.action;
    if (action === 'edit') {
      const c = clinicians.find(c => c.id == id);
      document.getElementById('clinician-id').value = c.id;
      document.getElementById('clinician-name').value = c.name;
      document.getElementById('clinician-specialty').value = c.specialty;
    } else if (action === 'delete') {
      clinicians = clinicians.filter(c => c.id != id);
      saveData('clinicians', clinicians);
      render();
    }
  });

  render();
});

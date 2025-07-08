document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('pricing-form');
  const tableBody = document.querySelector('#pricing-table tbody');
  const typeSelect = document.getElementById('price-type');
  const patientSelect = document.getElementById('price-patient');
  const clinicianSelect = document.getElementById('price-clinician');
  const locationSelect = document.getElementById('price-location');
  let rules = loadData('pricingRules');
  const types = loadData('appointmentTypes');
  const patients = loadData('patients');
  const clinicians = loadData('clinicians');
  const locations = loadData('locations');

  function populate(select, items, placeholder) {
    select.innerHTML = `<option value="">${placeholder}</option>`;
    items.forEach(i => {
      const opt = document.createElement('option');
      opt.value = i.id;
      opt.textContent = i.name;
      select.appendChild(opt);
    });
  }
  populate(typeSelect, types, 'Any Type');
  populate(patientSelect, patients, 'Any Patient');
  populate(clinicianSelect, clinicians, 'Any Clinician');
  populate(locationSelect, locations, 'Any Location');

  function render() {
    tableBody.innerHTML = '';
    rules.forEach(r => {
      const tr = document.createElement('tr');
      const type = types.find(t => t.id == r.typeId)?.name || '';
      const patient = patients.find(p => p.id == r.patientId)?.name || '';
      const clinician = clinicians.find(c => c.id == r.clinicianId)?.name || '';
      const location = locations.find(l => l.id == r.locationId)?.name || '';
      tr.innerHTML = `<td>${type}</td><td>${patient}</td><td>${clinician}</td><td>${location}</td><td>${r.duration||''}</td><td>${r.price}</td><td><button data-id="${r.id}" data-action="delete">Delete</button></td>`;
      tableBody.appendChild(tr);
    });
  }

  form.addEventListener('submit', e => {
    e.preventDefault();
    const rule = {
      id: nextId(rules),
      typeId: typeSelect.value || null,
      patientId: patientSelect.value || null,
      clinicianId: clinicianSelect.value || null,
      locationId: locationSelect.value || null,
      duration: document.getElementById('price-duration').value || null,
      price: parseFloat(document.getElementById('price-value').value)
    };
    rules.push(rule);
    saveData('pricingRules', rules);
    form.reset();
    render();
  });

  tableBody.addEventListener('click', e => {
    if (e.target.dataset.action === 'delete') {
      const id = e.target.dataset.id;
      rules = rules.filter(r => r.id != id);
      saveData('pricingRules', rules);
      render();
    }
  });

  render();
});

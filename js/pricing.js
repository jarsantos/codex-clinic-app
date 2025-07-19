document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('pricing-form');
  const tableBody = document.querySelector('#pricing-table tbody');
  const typeSelect = document.getElementById('price-type');
  const specialtySelect = document.getElementById('price-specialty');
  const patientSelect = document.getElementById('price-patient');
  const clinicianSelect = document.getElementById('price-clinician');
  const locationSelect = document.getElementById('price-location');
  let rules = loadData('pricingRules');
  const types = loadData('appointmentTypes');
  const patients = loadData('patients');
  const clinicians = loadData('clinicians');
  const locations = loadData('locations');

  const specialties = Array.from(new Set([
    ...clinicians.map(c => c.specialty),
    ...types.map(t => t.specialty)
  ]));

  function populate(select, items, placeholder) {
    select.innerHTML = `<option value="">${placeholder}</option>`;
    items.forEach(i => {
      const opt = document.createElement('option');
      opt.value = i.id;
      opt.textContent = i.name;
      select.appendChild(opt);
    });
  }
  populate(typeSelect, types, 'Qualquer Tipo');
  specialtySelect.innerHTML = '<option value="">Qualquer Especialidade</option>';
  specialties.forEach(s => {
    const opt = document.createElement('option');
    opt.value = s;
    opt.textContent = s;
    specialtySelect.appendChild(opt);
  });
  populate(patientSelect, patients, 'Qualquer Paciente');
  populate(clinicianSelect, clinicians, 'Qualquer Profissional');
  populate(locationSelect, locations, 'Qualquer Local');

  const durationInput = document.getElementById('price-duration');

  function updateFields() {
    const t = types.find(tp => tp.id == typeSelect.value);
    if (t) {
      specialtySelect.value = t.specialty;
      specialtySelect.disabled = true;
      durationInput.value = t.default_duration_minutes;
      durationInput.readOnly = true;
      specialtySelect.required = false;
    } else {
      specialtySelect.disabled = false;
      durationInput.readOnly = false;
      specialtySelect.required = true;
    }
  }

  typeSelect.addEventListener('change', updateFields);
  updateFields();

  function render() {
    tableBody.innerHTML = '';
    rules.forEach(r => {
      const tr = document.createElement('tr');
      const type = types.find(t => t.id == r.typeId)?.name || '';
      const location = locations.find(l => l.id == r.locationId)?.name || '';
      const clinician = clinicians.find(c => c.id == r.clinicianId)?.name || '';
      const patient = patients.find(p => p.id == r.patientId)?.name || '';
      tr.innerHTML = `<td>${type}</td><td>${r.specialty||''}</td><td>${r.duration||''}</td><td>${location}</td><td>${clinician}</td><td>${patient}</td><td>${r.price}</td><td><button data-id="${r.id}" data-action="delete">Eliminar</button></td>`;
      tableBody.appendChild(tr);
    });
  }

  form.addEventListener('submit', e => {
    e.preventDefault();
    if (!typeSelect.value && !specialtySelect.value) {
      alert('Selecione um Tipo de Consulta ou uma Especialidade.');
      return;
    }
    const rule = {
      id: nextId(rules),
      typeId: typeSelect.value || null,
      specialty: specialtySelect.value || null,
      patientId: patientSelect.value || null,
      clinicianId: clinicianSelect.value || null,
      locationId: locationSelect.value || null,
      duration: document.getElementById('price-duration').value || null,
      price: parseFloat(document.getElementById('price-value').value)
    };
    rules.push(rule);
    saveData('pricingRules', rules);
    form.reset();
    updateFields();
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

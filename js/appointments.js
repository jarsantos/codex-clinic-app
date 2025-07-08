function computePrice(typeId, patientId, clinicianId, locationId, duration) {
  const rules = loadData('pricingRules');
  let rule = rules.find(r => r.typeId == typeId && r.patientId == patientId);
  if (!rule) {
    rule = rules.find(r => r.typeId == typeId && r.clinicianId == clinicianId && r.locationId == locationId);
  }
  if (!rule) {
    rule = rules.find(r => r.typeId == typeId && r.clinicianId == clinicianId && !r.locationId);
  }
  if (!rule) {
    rule = rules.find(r => r.typeId == typeId && r.duration == duration);
  }
  return rule ? rule.price : 0;
}

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('appointment-form');
  const tableBody = document.querySelector('#appointments-table tbody');
  const patientSelect = document.getElementById('appointment-patient');
  const clinicianSelect = document.getElementById('appointment-clinician');
  const typeSelect = document.getElementById('appointment-type');
  const locationSelect = document.getElementById('appointment-location');
  const durationInput = document.getElementById('appointment-duration');
  const priceInput = document.getElementById('appointment-price');
  let appointments = loadData('appointments');
  const patients = loadData('patients');
  const clinicians = loadData('clinicians');
  const types = loadData('appointmentTypes');
  const locations = loadData('locations');

  function populate(select, items) {
    select.innerHTML = '';
    items.forEach(i => {
      const opt = document.createElement('option');
      opt.value = i.id;
      opt.textContent = i.name;
      select.appendChild(opt);
    });
  }
  populate(patientSelect, patients);
  populate(typeSelect, types);
  function filterClinicians() {
    const t = types.find(t => t.id == typeSelect.value);
    let list = clinicians;
    if (t) {
      list = clinicians.filter(c => c.specialty === t.specialty);
    }
    populate(clinicianSelect, list);
  }
  filterClinicians();
  const initialType = types.find(t => t.id == typeSelect.value);
  if (initialType) {
    durationInput.value = initialType.default_duration_minutes;
  }
  populate(locationSelect, locations);
  updatePrice();

  typeSelect.addEventListener('change', () => {
    const t = types.find(t => t.id == typeSelect.value);
    if (t) {
      durationInput.value = t.default_duration_minutes;
    }
    filterClinicians();
    updatePrice();
  });
  clinicianSelect.addEventListener('change', updatePrice);
  patientSelect.addEventListener('change', updatePrice);
  locationSelect.addEventListener('change', updatePrice);

  function updatePrice() {
    const price = computePrice(typeSelect.value, patientSelect.value, clinicianSelect.value, locationSelect.value, durationInput.value);
    if (!form.dataset.manual) {
      priceInput.value = price;
    }
  }

  priceInput.addEventListener('input', () => {
    form.dataset.manual = true;
  });

  function render() {
    tableBody.innerHTML = '';
    appointments.forEach(a => {
      const tr = document.createElement('tr');
      const patient = patients.find(p => p.id == a.patient_id)?.name || '';
      const clinician = clinicians.find(c => c.id == a.clinician_id)?.name || '';
      tr.innerHTML = `<td>${patient}</td><td>${clinician}</td><td>${a.date_time}</td><td>${a.status}</td><td>${a.price}</td><td><button data-id="${a.id}" data-action="delete">Delete</button></td>`;
      tableBody.appendChild(tr);
    });
  }

  form.addEventListener('submit', e => {
    e.preventDefault();
    const appointment = {
      id: nextId(appointments),
      patient_id: parseInt(patientSelect.value, 10),
      clinician_id: parseInt(clinicianSelect.value, 10),
      specialty: clinicians.find(c => c.id == clinicianSelect.value).specialty,
      location: locations.find(l => l.id == locationSelect.value).name,
      appointment_type: parseInt(typeSelect.value, 10),
      duration_minutes: parseInt(durationInput.value, 10),
      date_time: document.getElementById('appointment-datetime').value,
      status: 'planned',
      price: parseFloat(priceInput.value)
    };
    appointments.push(appointment);
    saveData('appointments', appointments);
    form.reset();
    filterClinicians();
    const tReset = types.find(t => t.id == typeSelect.value);
    if (tReset) {
      durationInput.value = tReset.default_duration_minutes;
    }
    form.dataset.manual = '';
    updatePrice();
    render();
  });

  tableBody.addEventListener('click', e => {
    if (e.target.dataset.action === 'delete') {
      const id = e.target.dataset.id;
      appointments = appointments.filter(a => a.id != id);
      saveData('appointments', appointments);
      render();
    }
  });

  render();
});

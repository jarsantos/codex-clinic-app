function computePrice(typeId, specialty, locationId, clinicianId, patientId, duration) {
  const rules = loadData('pricingRules');
  let candidates;
  if (typeId) {
    candidates = rules.filter(r => r.typeId == typeId);
  } else {
    candidates = rules.filter(r => !r.typeId && r.specialty == specialty && r.duration == parseInt(duration,10));
  }

  let best = null;
  let bestScore = -1;

  for (const r of candidates) {
    if (locationId === '' && r.locationId) continue;
    if (r.locationId && r.locationId != locationId) continue;
    if (clinicianId === '' && r.clinicianId) continue;
    if (r.clinicianId && r.clinicianId != clinicianId) continue;
    if (patientId === '' && r.patientId) continue;
    if (r.patientId && r.patientId != patientId) continue;

    const score = (r.locationId ? 4 : 0) + (r.clinicianId ? 2 : 0) + (r.patientId ? 1 : 0);
    if (score > bestScore) {
      bestScore = score;
      best = r;
    }
  }

  return best ? best.price : 0;
}

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('appointment-form');
  const tableBody = document.querySelector('#appointments-table tbody');
  const patientSelect = document.getElementById('appointment-patient');
  const clinicianSelect = document.getElementById('appointment-clinician');
  const typeSelect = document.getElementById('appointment-type');
  const specialtySelect = document.getElementById('appointment-specialty');
  const locationSelect = document.getElementById('appointment-location');
  const durationInput = document.getElementById('appointment-duration');
  const priceInput = document.getElementById('appointment-price');
  let appointments = loadData('appointments');
  const patients = loadData('patients');
  const clinicians = loadData('clinicians');
  const types = loadData('appointmentTypes');
  const locations = loadData('locations');
  const specialties = Array.from(new Set([
    ...clinicians.map(c => c.specialty),
    ...types.map(t => t.specialty)
  ]));

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
  specialtySelect.innerHTML = '';
  specialties.forEach(s => {
    const opt = document.createElement('option');
    opt.value = s;
    opt.textContent = s;
    specialtySelect.appendChild(opt);
  });
  function filterClinicians() {
    const t = types.find(t => t.id == typeSelect.value);
    let spec = specialtySelect.value;
    if (t) {
      spec = t.specialty;
    }
    let list = clinicians;
    if (spec) {
      list = clinicians.filter(c => c.specialty === spec);
    }
    populate(clinicianSelect, list);
  }
  filterClinicians();
  const initialType = types.find(t => t.id == typeSelect.value);
  if (initialType) {
    specialtySelect.value = initialType.specialty;
    durationInput.value = initialType.default_duration_minutes;
  }
  populate(locationSelect, locations);
  updatePrice();

  typeSelect.addEventListener('change', () => {
    const t = types.find(t => t.id == typeSelect.value);
    if (t) {
      specialtySelect.value = t.specialty;
      durationInput.value = t.default_duration_minutes;
    }
    filterClinicians();
    updatePrice();
  });
  specialtySelect.addEventListener('change', () => {
    filterClinicians();
    updatePrice();
  });
  clinicianSelect.addEventListener('change', updatePrice);
  patientSelect.addEventListener('change', updatePrice);
  locationSelect.addEventListener('change', updatePrice);

  function updatePrice() {
    const price = computePrice(typeSelect.value, specialtySelect.value, locationSelect.value, clinicianSelect.value, patientSelect.value, durationInput.value);
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
      tr.innerHTML = `<td>${patient}</td><td>${clinician}</td><td>${a.date_time}</td><td>${a.status}</td><td>${a.price}</td><td><button class="icon-btn" data-id="${a.id}" data-action="delete" aria-label="Eliminar">🗑️</button></td>`;
      tableBody.appendChild(tr);
    });
  }

  form.addEventListener('submit', e => {
    e.preventDefault();
    const appointment = {
      id: nextId(appointments),
      patient_id: parseInt(patientSelect.value, 10),
      clinician_id: parseInt(clinicianSelect.value, 10),
      specialty: specialtySelect.value,
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
      specialtySelect.value = tReset.specialty;
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

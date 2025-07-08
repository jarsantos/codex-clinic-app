document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('report-form');
  const tableHead = document.querySelector('#report-table thead');
  const tableBody = document.querySelector('#report-table tbody');
  const appointments = loadData('appointments');
  const clinicians = loadData('clinicians');
  const patients = loadData('patients');

  function groupKey(a, group) {
    switch(group) {
      case 'clinician': return clinicians.find(c => c.id == a.clinician_id)?.name || '';
      case 'specialty': return a.specialty;
      case 'patient': return patients.find(p => p.id == a.patient_id)?.name || '';
      case 'location': return a.location;
      default: return '';
    }
  }

  form.addEventListener('submit', e => {
    e.preventDefault();
    const group = document.getElementById('report-group').value;
    const start = document.getElementById('report-start').value;
    const end = document.getElementById('report-end').value;
    const totals = {};
    appointments.forEach(a => {
      if (a.status !== 'completed') return;
      if (start && a.date_time < start) return;
      if (end && a.date_time > end + 'T23:59') return;
      const key = groupKey(a, group);
      totals[key] = (totals[key] || 0) + a.price;
    });
    tableHead.innerHTML = `<tr><th>${group}</th><th>Revenue</th></tr>`;
    tableBody.innerHTML = '';
    Object.keys(totals).forEach(k => {
      const tr = document.createElement('tr');
      tr.innerHTML = `<td>${k}</td><td>${totals[k].toFixed(2)}</td>`;
      tableBody.appendChild(tr);
    });
  });
});

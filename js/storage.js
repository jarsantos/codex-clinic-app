function loadData(key) {
  return JSON.parse(localStorage.getItem(key) || '[]');
}

function saveData(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

function nextId(items) {
  return items.length ? Math.max(...items.map(i => i.id)) + 1 : 1;
}

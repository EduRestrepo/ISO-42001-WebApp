// Helper utilities for the application

export const GOAL = 85;

export function movingAvg(arr, k) {
  if (!arr || !arr.length) return [];
  const out = [];
  for (let i = 0; i < arr.length; i++) {
    const start = Math.max(0, i - k + 1);
    const slice = arr.slice(start, i + 1);
    const avgValue = slice.reduce((a, b) => a + b, 0) / slice.length;
    out.push(Math.round(avgValue));
  }
  return out;
}

export function avg(a) {
  return a.length ? a.reduce((x, y) => x + y, 0) / a.length : 0;
}

export function clamp(v, min, max) {
  return Math.max(min, Math.min(max, v));
}

export function getBadge(value, type = 'level') {
  if (type === 'risk') {
    if (value === 'Crítico') return '<span class="badge red">Crítico</span>';
    if (value === 'Alto') return '<span class="badge red">Alto</span>';
    if (value === 'Medio') return '<span class="badge yellow">Medio</span>';
    return '<span class="badge green">Bajo</span>';
  }
  if (value < 40) return '<span class="badge red">Bajo</span>';
  if (value < 70) return '<span class="badge yellow">Medio</span>';
  return '<span class="badge green">Alto</span>';
}

export function showToast(message) {
  const container = document.getElementById('toastContainer');
  if (!container) return;
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = message;
  container.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    setTimeout(() => toast.remove(), 500);
  }, 4000);
}

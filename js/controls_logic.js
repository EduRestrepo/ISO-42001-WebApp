// Controls rendering and CRUD logic
import { store } from './store.js';
import { canEdit, syncUIWithRole } from './rbac.js';
import { getBadge, clamp, showToast } from './utils.js';
import { drawDashboard } from './charts.js';

const tbody = document.getElementById('controlesBody');

export function renderControles() {
  if (!tbody) return;
  const controls = store.get('controles', []);
  tbody.innerHTML = '';
  
  controls.forEach((c, i) => {
    const tr = document.createElement('tr');
    const editable = canEdit();

    // Mapping fields to elements
    const nameEl = createField(c.nombre, 'text', (val) => { c.nombre = val; saveControls(controls); }, editable);
    const estadoSel = createSelect(c.estado || "No iniciado", ["No iniciado", "En progreso", "Implementado"], (val) => { c.estado = val; saveControls(controls); drawDashboard(); }, editable);
    
    const inpInicio = createField(c.inicio || "", 'date', (val) => { c.inicio = val; saveControls(controls); }, editable);
    const inpObjetivo = createField(c.objetivo || "", 'date', (val) => { c.objetivo = val; saveControls(controls); }, editable);
    
    const inpC = createField(c.cumplimiento, 'number', (val) => { c.cumplimiento = clamp(Number(val), 0, 100); saveControls(controls); drawDashboard(); }, editable, 0, 100);
    const inpM = createField(c.madurez, 'number', (val) => { c.madurez = clamp(Number(val), 0, 100); saveControls(controls); drawDashboard(); }, editable, 0, 100);
    
    const riskSel = createSelect(c.riesgo || "Medio", ["Bajo", "Medio", "Alto", "Crítico"], (val) => { c.riesgo = val; saveControls(controls); }, editable, 'risk');
    const impactSel = createSelect(c.impacto || "Medio", ["Bajo", "Medio", "Alto"], (val) => { c.impacto = val; saveControls(controls); }, editable);
    
    const notes = createField(c.notas || "", 'text', (val) => { c.notas = val; saveControls(controls); }, editable);

    const acciones = document.createElement('div');
    if (editable) {
      const del = document.createElement('button');
      del.className = 'danger-sm';
      del.textContent = '×';
      del.title = 'Eliminar';
      del.onclick = () => {
        if (confirm(`¿Eliminar ${c.nombre}?`)) {
          controls.splice(i, 1);
          saveControls(controls);
          drawDashboard();
          showToast('Control eliminado');
        }
      };
      acciones.appendChild(del);
    } else {
      acciones.textContent = '—';
    }

    const td = (el) => { const cell = document.createElement('td'); cell.appendChild(el); return cell; };
    tr.append(
      td(nameEl), td(estadoSel), td(inpInicio), td(inpObjetivo), 
      td(inpC), td(inpM), td(riskSel), td(impactSel), 
      td(notes), td(acciones)
    );
    tbody.appendChild(tr);
  });
  
  syncUIWithRole();
}

function createField(value, type, onchange, editable, min, max) {
  if (editable) {
    const input = document.createElement('input');
    input.type = type;
    input.value = value;
    if (min !== undefined) input.min = min;
    if (max !== undefined) input.max = max;
    input.onchange = (e) => onchange(e.target.value);
    return input;
  }
  const div = document.createElement('div');
  div.textContent = (type === 'number' ? value + '%' : value) || '—';
  return div;
}

function createSelect(value, options, onchange, editable, badgeType) {
  if (editable) {
    const select = document.createElement('select');
    options.forEach(opt => {
      const o = document.createElement('option');
      o.textContent = opt;
      select.appendChild(o);
    });
    select.value = value;
    select.onchange = (e) => onchange(e.target.value);
    return select;
  }
  const div = document.createElement('div');
  div.innerHTML = (badgeType || value === 'Implementado' || value === 'En progreso' || value === 'No iniciado') 
    ? getBadge(value, badgeType || 'level') 
    : value;
  return div;
}

export function saveControls(arr) {
  store.set('controles', arr);
  renderControles();
}

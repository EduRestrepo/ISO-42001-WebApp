// Application Entry Point
import { store } from './store.js';
import { seedControls } from './controls_data.js';
import { syncUIWithRole, canEdit, isAdmin } from './rbac.js';
import { drawDashboard } from './charts.js';
import { renderControles, saveControls } from './controls_logic.js';
import { showToast } from './utils.js';

// Initialization
document.addEventListener('DOMContentLoaded', () => {
  // Initial Data Seed
  if (!store.get('controles')) {
    store.set('controles', seedControls);
  } else {
    // Migration for 38 controls: If they have significantly fewer controls, reset to full list
    const existing = store.get('controles');
    if (existing.length < 25 && confirm('Detectado set de controles antiguo. ¿Deseas actualizar a la lista completa de ISO 42001:2023?')) {
      store.set('controles', seedControls);
    }
  }

  // Set Defaults
  const defaults = {
    role: 'viewer',
    company: '',
    responsables: [],
    snapshots: [],
    notes: '',
    dashboardMode: 'torta_linea'
  };
  Object.keys(defaults).forEach(key => {
    if (store.get(key) === undefined) store.set(key, defaults[key]);
  });

  // Global UI Init
  initTabs();
  initForms();
  initRBAC();
  
  renderControles();
  renderResponsables();
  drawDashboard();

  // Wipe Feedback
  if (sessionStorage.getItem('justWiped')) {
    setTimeout(() => showToast('¡Datos eliminados! Se han restaurado los valores de fábrica.'), 500);
    sessionStorage.removeItem('justWiped');
  }
});

function initTabs() {
  document.querySelectorAll('.tab-button').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.tab').forEach(s => s.classList.remove('active'));
      document.querySelectorAll('.tab-button').forEach(b => b.classList.remove('active'));
      
      document.getElementById(btn.dataset.tab).classList.add('active');
      btn.classList.add('active');
      
      if (btn.dataset.tab === 'dashboard') drawDashboard();
    });
  });
}

function initForms() {
  // Company & Notes
  const companyInput = document.getElementById('companyName');
  if (companyInput) companyInput.value = store.get('company', '');
  
  document.getElementById('saveCompany')?.addEventListener('click', () => {
    if (!canEdit()) return showToast('Sin permiso.');
    const val = companyInput.value.trim();
    store.set('company', val);
    showToast('Compañía guardada.');
    drawDashboard();
  });

  const notesArea = document.getElementById('extraNotes');
  if (notesArea) notesArea.value = store.get('notes', '');
  document.getElementById('saveNotes')?.addEventListener('click', () => {
    if (!canEdit()) return showToast('Sin permiso.');
    store.set('notes', notesArea.value);
    showToast('Anotaciones guardadas.');
  });

  // Dashboard Mode
  const dashModeSel = document.getElementById('dashMode');
  if (dashModeSel) dashModeSel.value = store.get('dashboardMode', 'torta_linea');
  document.getElementById('saveDashMode')?.addEventListener('click', () => {
    store.set('dashboardMode', dashModeSel.value);
    showToast('Dashboard actualizado.');
    drawDashboard();
  });

  // Wipe
  document.getElementById('wipeAll')?.addEventListener('click', () => {
    if (!isAdmin()) return showToast('Solo el administrador puede borrar todo.');
    if (confirm('¿Deseas eliminar TODA la información y restaurar los valores de fábrica?')) {
      store.clear();
      sessionStorage.setItem('justWiped', 'true');
      location.reload();
    }
  });

  // Add Control
  document.getElementById('addControl')?.addEventListener('click', () => {
    if (!canEdit()) return showToast('Sin permiso.');
    
    const name = document.getElementById('newControlName').value.trim();
    if (!name) return showToast('Nombre requerido');

    const controls = store.get('controles', []);
    const nextId = controls.reduce((max, x) => Math.max(max, x.id), 0) + 1;
    
    const newControl = {
      id: nextId,
      nombre: name,
      estado: document.getElementById('newControlEstado').value,
      riesgo: document.getElementById('newControlRisk').value,
      impacto: document.getElementById('newControlImpact').value,
      inicio: document.getElementById('newControlInicio').value,
      objetivo: document.getElementById('newControlObjetivo').value,
      cumplimiento: Number(document.getElementById('newControlCumpl').value),
      madurez: Number(document.getElementById('newControlMad').value),
      notas: document.getElementById('newControlNotas').value.trim()
    };
    
    controls.push(newControl);
    saveControls(controls);
    
    // Clear inputs
    ['newControlName', 'newControlInicio', 'newControlObjetivo', 'newControlNotas'].forEach(id => document.getElementById(id).value = '');
    drawDashboard();
    showToast('Control agregado.');
  });
}

function initRBAC() {
  document.getElementById('applyRole')?.addEventListener('click', () => {
    const sel = document.getElementById('roleSelect').value;
    store.set('role', sel);
    syncUIWithRole();
    renderControles();
    renderResponsables();
    drawDashboard();
    showToast('Rol aplicado: ' + sel);
  });
  syncUIWithRole();
}

function renderResponsables() {
  const respList = document.getElementById('responsablesList');
  if (!respList) return;
  const responsables = store.get('responsables', []);
  respList.innerHTML = '';
  
  responsables.forEach((r, idx) => {
    const li = document.createElement('li');
    li.textContent = r;
    if (canEdit()) {
      const del = document.createElement('button');
      del.textContent = '×';
      del.className = 'delete-btn';
      del.onclick = () => {
        responsables.splice(idx, 1);
        store.set('responsables', responsables);
        renderResponsables();
        drawDashboard();
      };
      li.appendChild(del);
    }
    respList.appendChild(li);
  });
}

// Add Responsable
document.getElementById('addResponsable')?.addEventListener('click', () => {
  if (!canEdit()) return showToast('Sin permiso.');
  const input = document.getElementById('responsableInput');
  const val = input.value.trim();
  if (!val) return;
  const arr = store.get('responsables', []);
  arr.push(val);
  store.set('responsables', arr);
  input.value = '';
  renderResponsables();
  drawDashboard();
});

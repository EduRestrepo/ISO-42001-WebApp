/**
 * ISO/IEC 42001 Tracker - Core Logic (Consolidated for compatibility)
 * Author: Eduardo Restrepo
 * Version: 1.6
 */

(function() {
  // --- UTILS & CONSTANTS ---
  const GOAL = 85;
  const avg = a => a.length ? a.reduce((x, y) => x + y, 0) / a.length : 0;
  const clamp = (v, min, max) => Math.max(min, Math.min(max, v));
  
  function movingAvg(arr, k) {
    if (!arr || !arr.length) return [];
    const out = [];
    for (let i = 0; i < arr.length; i++) {
      const start = Math.max(0, i - k + 1);
      const slice = arr.slice(start, i + 1);
      out.push(Math.round(slice.reduce((a, b) => a + b, 0) / slice.length));
    }
    return out;
  }

  function getBadge(value, type = 'level') {
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

  function showToast(message) {
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

  // --- STORE ---
  const store = {
    get(key, def) {
      try {
        const val = localStorage.getItem(key);
        return val ? JSON.parse(val) : def;
      } catch { return def; }
    },
    set(key, val) { localStorage.setItem(key, JSON.stringify(val)); },
    clear() { localStorage.clear(); }
  };

  // --- SEED DATA (Full 38 controls) ---
  const seedControls = [
    { id: 1, categoria: "A.2 Políticas", nombre: "A.2.1 Políticas para IA", estado:"No iniciado", cumplimiento: 0, madurez: 0, riesgo: "Medio", impacto: "Medio", notas: "" },
    { id: 2, categoria: "A.3 Organización", nombre: "A.3.1 Roles y Responsabilidades", estado:"No iniciado", cumplimiento: 0, madurez: 0, riesgo: "Medio", impacto: "Medio", notas: "" },
    { id: 3, categoria: "A.4 Recursos", nombre: "A.4.1 Datos para Sistemas de IA", estado:"No iniciado", cumplimiento: 0, madurez: 0, riesgo: "Alto", impacto: "Alto", notas: "" },
    { id: 4, categoria: "A.4 Recursos", nombre: "A.4.2 Herramientas de Desarrollo", estado:"No iniciado", cumplimiento: 0, madurez: 0, riesgo: "Medio", impacto: "Medio", notas: "" },
    { id: 5, categoria: "A.4 Recursos", nombre: "A.4.3 Computación y Almacenamiento", estado:"No iniciado", cumplimiento: 0, madurez: 0, riesgo: "Medio", impacto: "Medio", notas: "" },
    { id: 6, categoria: "A.4 Recursos", nombre: "A.4.4 Expertise Humano", estado:"No iniciado", cumplimiento: 0, madurez: 0, riesgo: "Medio", impacto: "Medio", notas: "" },
    { id: 7, categoria: "A.4 Recursos", nombre: "A.4.5 Otros Recursos Críticos", estado:"No iniciado", cumplimiento: 0, madurez: 0, riesgo: "Medio", impacto: "Medio", notas: "" },
    { id: 8, categoria: "A.5 Impacto", nombre: "A.5.1 Evaluación del Impacto de la IA", estado:"No iniciado", cumplimiento: 0, madurez: 0, riesgo: "Crítico", impacto: "Crítico", notas: "" },
    { id: 9, categoria: "A.6 Ciclo de Vida", nombre: "A.6.1 Objetivos del Sistema de IA", estado:"No iniciado", cumplimiento: 0, madurez: 0, riesgo: "Medio", impacto: "Medio", notas: "" },
    { id: 10, categoria: "A.6 Ciclo de Vida", nombre: "A.6.2 Diseño y Desarrollo Responsable", estado:"No iniciado", cumplimiento: 0, madurez: 0, riesgo: "Alto", impacto: "Alto", notas: "" },
    { id: 11, categoria: "A.6 Ciclo de Vida", nombre: "A.6.3 Verificación y Validación", estado:"No iniciado", cumplimiento: 0, madurez: 0, riesgo: "Alto", impacto: "Alto", notas: "" },
    { id: 12, categoria: "A.6 Ciclo de Vida", nombre: "A.6.4 Implementación y Despliegue", estado:"No iniciado", cumplimiento: 0, madurez: 0, riesgo: "Medio", impacto: "Medio", notas: "" },
    { id: 13, categoria: "A.6 Ciclo de Vida", nombre: "A.6.5 Operación del Sistema de IA", estado:"No iniciado", cumplimiento: 0, madurez: 0, riesgo: "Medio", impacto: "Medio", notas: "" },
    { id: 14, categoria: "A.6 Ciclo de Vida", nombre: "A.6.6 Monitoreo y Revisión", estado:"No iniciado", cumplimiento: 0, madurez: 0, riesgo: "Alto", impacto: "Alto", notas: "" },
    { id: 15, categoria: "A.6 Ciclo de Vida", nombre: "A.6.7 Mantenimiento y Retiro", estado:"No iniciado", cumplimiento: 0, madurez: 0, riesgo: "Bajo", impacto: "Medio", notas: "" },
    { id: 16, categoria: "A.7 Datos", nombre: "A.7.1 Requisitos de Calidad de Datos", estado:"No iniciado", cumplimiento: 0, madurez: 0, riesgo: "Alto", impacto: "Crítico", notas: "" },
    { id: 17, categoria: "A.7 Datos", nombre: "A.7.2 Procedencia de Datos", estado:"No iniciado", cumplimiento: 0, madurez: 0, riesgo: "Alto", impacto: "Alto", notas: "" },
    { id: 18, categoria: "A.7 Datos", nombre: "A.7.3 Preparación y Limpieza", estado:"No iniciado", cumplimiento: 0, madurez: 0, riesgo: "Medio", impacto: "Alto", notas: "" },
    { id: 19, categoria: "A.7 Datos", nombre: "A.7.4 Protección y Privacidad", estado:"No iniciado", cumplimiento: 0, madurez: 0, riesgo: "Crítico", impacto: "Crítico", notas: "" },
    { id: 20, categoria: "A.8 Información", nombre: "A.8.1 Documentación para Usuarios", estado:"No iniciado", cumplimiento: 0, madurez: 0, riesgo: "Medio", impacto: "Medio", notas: "" },
    { id: 21, categoria: "A.8 Información", nombre: "A.8.2 Transparencia del Modelo", estado:"No iniciado", cumplimiento: 0, madurez: 0, riesgo: "Alto", impacto: "Alto", notas: "" },
    { id: 22, categoria: "A.8 Información", nombre: "A.8.3 Reportes Explicabilidad", estado:"No iniciado", cumplimiento: 0, madurez: 0, riesgo: "Medio", impacto: "Medio", notas: "" },
    { id: 23, categoria: "A.9 Uso", nombre: "A.9.1 Uso Responsable", estado:"No iniciado", cumplimiento: 0, madurez: 0, riesgo: "Alto", impacto: "Alto", notas: "" },
    { id: 24, categoria: "A.9 Uso", nombre: "A.9.2 Supervisión Humana", estado:"No iniciado", cumplimiento: 0, madurez: 0, riesgo: "Alto", impacto: "Alto", notas: "" },
    { id: 25, categoria: "A.9 Uso", nombre: "A.9.3 Restricciones de Uso", estado:"No iniciado", cumplimiento: 0, madurez: 0, riesgo: "Medio", impacto: "Medio", notas: "" },
    { id: 26, categoria: "A.10 Terceros", nombre: "A.10.1 Gestión de Proveedores IA", estado:"No iniciado", cumplimiento: 0, madurez: 0, riesgo: "Medio", impacto: "Medio", notas: "" },
    { id: 27, categoria: "A.10 Terceros", nombre: "A.10.2 Acuerdos de Datos", estado:"No iniciado", cumplimiento: 0, madurez: 0, riesgo: "Medio", impacto: "Alto", notas: "" },
    { id: 28, categoria: "A.10 Terceros", nombre: "A.10.3 Monitoreo de Terceros", estado:"No iniciado", cumplimiento: 0, madurez: 0, riesgo: "Medio", impacto: "Medio", notas: "" },
    { id: 29, categoria: "A.5 Impacto", nombre: "A.5.2 Evaluación de Sesgos", estado:"No iniciado", cumplimiento: 0, madurez: 0, riesgo: "Alto", impacto: "Alto", notas: "" },
    { id: 30, categoria: "A.5 Impacto", nombre: "A.5.3 Evaluación de Equidad", estado:"No iniciado", cumplimiento: 0, madurez: 0, riesgo: "Alto", impacto: "Alto", notas: "" },
    { id: 31, categoria: "A.6 Ciclo de Vida", nombre: "A.6.8 Gestión de Versiones", estado:"No iniciado", cumplimiento: 0, madurez: 0, riesgo: "Bajo", impacto: "Medio", notas: "" },
    { id: 32, categoria: "A.6 Ciclo de Vida", nombre: "A.6.9 Pruebas de Estrés", estado:"No iniciado", cumplimiento: 0, madurez: 0, riesgo: "Alto", impacto: "Alto", notas: "" },
    { id: 33, categoria: "A.6 Ciclo de Vida", nombre: "A.6.10 Red Teaming", estado:"No iniciado", cumplimiento: 0, madurez: 0, riesgo: "Alto", impacto: "Alto", notas: "" },
    { id: 34, categoria: "A.2 Políticas", nombre: "A.2.2 Código Ético de IA", estado:"No iniciado", cumplimiento: 0, madurez: 0, riesgo: "Bajo", impacto: "Bajo", notas: "" },
    { id: 35, categoria: "A.3 Organización", nombre: "A.3.2 Comité de Ética IA", estado:"No iniciado", cumplimiento: 0, madurez: 0, riesgo: "Medio", impacto: "Medio", notas: "" },
    { id: 36, categoria: "A.3 Organización", nombre: "A.3.3 Reporte de Incidentes", estado:"No iniciado", cumplimiento: 0, madurez: 0, riesgo: "Alto", impacto: "Alto", notas: "" },
    { id: 37, categoria: "A.10 Terceros", nombre: "A.10.4 Auditorías de Proveedor", estado:"No iniciado", cumplimiento: 0, madurez: 0, riesgo: "Medio", impacto: "Medio", notas: "" },
    { id: 38, categoria: "A.7 Datos", nombre: "A.7.5 Anonimización de Datos", estado:"No iniciado", cumplimiento: 0, madurez: 0, riesgo: "Crítico", impacto: "Alto", notas: "" }
  ];

  // --- RBAC ---
  const getCurrentRole = () => store.get('role', 'viewer');
  const canEdit = () => ['admin', 'auditor'].includes(getCurrentRole());
  const isAdmin = () => getCurrentRole() === 'admin';

  function syncUIWithRole() {
    const role = getCurrentRole();
    const editAllowed = canEdit();
    const adminOnly = isAdmin();
    const roleLabel = document.getElementById('currentRole');
    if (roleLabel) roleLabel.textContent = role;

    document.querySelectorAll('[data-role-restricted]').forEach(el => {
      const required = el.dataset.roleRestricted;
      if (required === 'admin' && !adminOnly) el.style.display = 'none';
      else if (required === 'edit' && !editAllowed) el.style.display = 'none';
      else el.style.display = '';
    });
    document.querySelectorAll('[data-role-disabled]').forEach(el => {
      if (!editAllowed) { el.setAttribute('disabled', 'true'); el.classList.add('disabled-ui'); }
      else { el.removeAttribute('disabled'); el.classList.remove('disabled-ui'); }
    });
  }

  // --- CHARTS ---
  let trendChart, statusChart, timeSeriesChart, scatterChart;
  function drawDashboard() {
    const controls = store.get('controles', []);
    const avgC = Math.round(avg(controls.map(c => c.cumplimiento)) || 0);
    const avgM = Math.round(avg(controls.map(c => c.madurez)) || 0);
    const implPct = Math.round((controls.filter(c => c.estado === 'Implementado').length / (controls.length || 1)) * 100);
    const riesgos = controls.filter(c => ((c.cumplimiento + c.madurez) / 2) < 40).length;
    const snaps = store.get('snapshots', []);

    const updateText = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
    updateText('kpiCumpl', `${avgC}%`);
    updateText('kpiMadur', `${avgM}%`);
    updateText('kpiImpl', `${implPct}%`);
    updateText('kpiRiesgos', riesgos);
    updateText('companyDash', store.get('company', '') || '—');

    const renderChart = (id, config, globalVar) => {
      const el = document.getElementById(id); if (!el) return null;
      if (globalVar && typeof globalVar.destroy === 'function') globalVar.destroy();
      return new Chart(el.getContext('2d'), config);
    };

    trendChart = renderChart('trendChart', {
      type: 'line', data: { labels: ['Cumplimiento', 'Madurez'], datasets: [{ label: 'Actual %', data: [avgC, avgM], fill: false, tension: 0.2 }] },
      options: { responsive: true, maintainAspectRatio: false, indexAxis: 'y', scales: { x: { min: 0, max: 100 } }, plugins: { legend: { display: false } } }
    }, trendChart);

    const statusCount = { "No iniciado": 0, "En progreso": 0, "Implementado": 0 };
    controls.forEach(c => statusCount[c.estado || "No iniciado"]++);
    if (store.get('dashboardMode') !== 'solo_linea') {
      statusChart = renderChart('statusChart', {
        type: 'pie', data: { labels: ['No iniciado', 'En progreso', 'Implementado'], datasets: [{ data: [statusCount['No iniciado'], statusCount['En progreso'], statusCount['Implementado']] }] },
        options: { responsive: true, maintainAspectRatio: false }
      }, statusChart);
    } else if (statusChart) { statusChart.destroy(); statusChart = null; }

    if (snaps.length) {
      timeSeriesChart = renderChart('timeSeriesChart', {
        type: 'line', data: { labels: snaps.map(s => s.fecha), datasets: [
          { label: 'Cumplimiento %', data: snaps.map(s => s.cumplimiento), fill: false, tension: .2 },
          { label: 'Madurez %', data: snaps.map(s => s.madurez), fill: false, tension: .2 },
          { label: 'Meta 85%', data: snaps.map(() => GOAL), fill: false, borderColor: '#ef4444', borderDash: [5, 5] }
        ]}, options: { responsive: true, maintainAspectRatio: false, scales: { y: { min: 0, max: 100 } } }
      }, timeSeriesChart);
    }

    scatterChart = renderChart('scatterChart', {
      type: 'scatter', data: { datasets: [{ label: 'Controles', data: controls.map(c => ({ x: c.cumplimiento, y: c.madurez, control: c.nombre, estado: c.estado, riesgo: c.riesgo, impacto: c.impacto })) }] },
      options: { responsive: true, maintainAspectRatio: false, scales: { x: { min: 0, max: 100 }, y: { min: 0, max: 100 } },
        plugins: { tooltip: { callbacks: { label: (ctx) => `${ctx.raw.control} [${ctx.raw.estado}] — Riesgo: ${ctx.raw.riesgo}, Impacto: ${ctx.raw.impacto}` } } } }
    }, scatterChart);
  }

  // --- CONTROLS ---
  function renderControles() {
    const tbody = document.getElementById('controlesBody'); if (!tbody) return;
    const controls = store.get('controles', []);
    tbody.innerHTML = '';
    controls.forEach((c, i) => {
      const tr = document.createElement('tr');
      const editable = canEdit();
      const td = (el) => { const cell = document.createElement('td'); cell.appendChild(el); return cell; };
      
      const inpName = createField(c.nombre, 'text', v => { c.nombre = v; saveControls(controls); }, editable);
      const selEstado = createSelect(c.estado, ["No iniciado", "En progreso", "Implementado"], v => { c.estado = v; saveControls(controls); drawDashboard(); }, editable);
      const inpIni = createField(c.inicio || "", 'date', v => { c.inicio = v; saveControls(controls); }, editable);
      const inpObj = createField(c.objetivo || "", 'date', v => { c.objetivo = v; saveControls(controls); }, editable);
      const inpC = createField(c.cumplimiento, 'number', v => { c.cumplimiento = clamp(Number(v), 0, 100); saveControls(controls); drawDashboard(); }, editable, 0, 100);
      const inpM = createField(c.madurez, 'number', v => { c.madurez = clamp(Number(v), 0, 100); saveControls(controls); drawDashboard(); }, editable, 0, 100);
      const selRisk = createSelect(c.riesgo, ["Bajo", "Medio", "Alto", "Crítico"], v => { c.riesgo = v; saveControls(controls); }, editable, 'risk');
      const selImp = createSelect(c.impacto, ["Bajo", "Medio", "Alto"], v => { c.impacto = v; saveControls(controls); }, editable);
      const inpNotes = createField(c.notas, 'text', v => { c.notas = v; saveControls(controls); }, editable);
      
      const delBtn = document.createElement('div');
      if (editable) {
        const btn = document.createElement('button'); btn.className = 'danger-sm'; btn.textContent = '×';
        btn.onclick = () => { if (confirm(`¿Eliminar ${c.nombre}?`)) { controls.splice(i, 1); saveControls(controls); drawDashboard(); showToast('Control eliminado'); } };
        delBtn.appendChild(btn);
      } else delBtn.textContent = '—';

      tr.append(td(inpName), td(selEstado), td(inpIni), td(inpObj), td(inpC), td(inpM), td(selRisk), td(selImp), td(inpNotes), td(delBtn));
      tbody.appendChild(tr);
    });
    syncUIWithRole();
  }

  function createField(val, type, cb, edit, min, max) {
    if (edit) {
      const i = document.createElement('input'); i.type = type; i.value = val || '';
      if (min !== undefined) i.min = min; if (max !== undefined) i.max = max;
      i.onchange = (e) => cb(e.target.value); return i;
    }
    const d = document.createElement('div'); d.textContent = (type === 'number' ? val + '%' : val) || '—'; return d;
  }

  function createSelect(val, opts, cb, edit, badge) {
    if (edit) {
      const s = document.createElement('select');
      opts.forEach(o => { const op = document.createElement('option'); op.textContent = o; s.appendChild(op); });
      s.value = val || opts[0]; s.onchange = (e) => cb(e.target.value); return s;
    }
    const d = document.createElement('div'); d.innerHTML = (badge || val === 'Implementado') ? getBadge(val, badge || 'level') : (val || '—'); return d;
  }

  function saveControls(arr) { store.set('controles', arr); renderControles(); }

  function renderResponsables() {
    const list = document.getElementById('responsablesList'); if (!list) return;
    const resps = store.get('responsables', []); list.innerHTML = '';
    resps.forEach((r, idx) => {
      const li = document.createElement('li'); li.textContent = r;
      if (canEdit()) {
        const d = document.createElement('button'); d.textContent = '×'; d.className = 'delete-btn';
        d.onclick = () => { resps.splice(idx, 1); store.set('responsables', resps); renderResponsables(); drawDashboard(); };
        li.appendChild(d);
      }
      list.appendChild(li);
    });
  }

  // --- INITIALIZATION ---
  document.addEventListener('DOMContentLoaded', () => {
    if (!store.get('controles')) store.set('controles', seedControls);
    else if (store.get('controles').length < 25 && confirm('¿Actualizar a la lista completa de ISO 42001 (38 controles)?')) store.set('controles', seedControls);
    
    const defaults = { role: 'viewer', company: '', responsables: [], snapshots: [], notes: '', dashboardMode: 'torta_linea' };
    Object.keys(defaults).forEach(k => { if (store.get(k) === undefined) store.set(k, defaults[k]); });

    // Tabs
    document.querySelectorAll('.tab-button').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.tab, .tab-button').forEach(el => el.classList.remove('active'));
        document.getElementById(btn.dataset.tab).classList.add('active');
        btn.classList.add('active');
        if (btn.dataset.tab === 'dashboard') drawDashboard();
      });
    });

    // Forms
    const co = document.getElementById('companyName'); if (co) co.value = store.get('company', '');
    document.getElementById('saveCompany')?.addEventListener('click', () => { store.set('company', co.value); showToast('Guardado'); drawDashboard(); });
    
    const nt = document.getElementById('extraNotes'); if (nt) nt.value = store.get('notes', '');
    document.getElementById('saveNotes')?.addEventListener('click', () => { store.set('notes', nt.value); showToast('Guardado'); });

    document.getElementById('saveDashMode')?.addEventListener('click', () => { store.set('dashboardMode', document.getElementById('dashMode').value); showToast('Dashboard actualizado'); drawDashboard(); });

    document.getElementById('wipeAll')?.addEventListener('click', () => {
      if (!isAdmin()) return showToast('Solo Admin');
      if (confirm('¿Borrar todo?')) { store.clear(); sessionStorage.setItem('justWiped', 'true'); location.reload(); }
    });

    document.getElementById('applyRole')?.addEventListener('click', () => { store.set('role', document.getElementById('roleSelect').value); syncUIWithRole(); renderControles(); renderResponsables(); drawDashboard(); showToast('Rol aplicado'); });

    document.getElementById('addResponsable')?.addEventListener('click', () => {
      const i = document.getElementById('responsableInput'); if (!i.value.trim()) return;
      const r = store.get('responsables', []); r.push(i.value.trim()); store.set('responsables', r); i.value = ''; renderResponsables(); drawDashboard();
    });

    document.getElementById('addControl')?.addEventListener('click', () => {
      const name = document.getElementById('newControlName').value.trim(); if (!name) return showToast('Nombre requerido');
      const ctrls = store.get('controles', []);
      ctrls.push({
        id: Date.now(), nombre: name,
        estado: document.getElementById('newControlEstado').value,
        riesgo: document.getElementById('newControlRisk').value,
        impacto: document.getElementById('newControlImpact').value,
        inicio: document.getElementById('newControlInicio').value,
        objetivo: document.getElementById('newControlObjetivo').value,
        cumplimiento: Number(document.getElementById('newControlCumpl').value),
        madurez: Number(document.getElementById('newControlMad').value),
        notas: document.getElementById('newControlNotas').value
      });
      saveControls(ctrls);
      ['newControlName', 'newControlInicio', 'newControlObjetivo', 'newControlNotas'].forEach(id => document.getElementById(id).value = '');
      drawDashboard(); showToast('Agregado');
    });

    // Exports
    document.getElementById('btnExportCSV')?.addEventListener('click', () => {
      const c = store.get('controles', []);
      let csv = "Control,Estado,Riesgo,Impacto,Cumplimiento,Madurez\n";
      c.forEach(x => csv += `"${x.nombre}","${x.estado}","${x.riesgo}","${x.impacto}",${x.cumplimiento},${x.madurez}\n`);
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a'); a.href = url; a.download = 'ISO42001_Controls.csv'; a.click();
    });

    document.getElementById('btnExportJSON')?.addEventListener('click', () => {
      const data = JSON.stringify(localStorage);
      const blob = new Blob([data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a'); a.href = url; a.download = 'ISO42001_Backup.json'; a.click();
    });

    document.getElementById('importJSON')?.addEventListener('change', (e) => {
      const file = e.target.files[0]; if (!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        try {
          const data = JSON.parse(ev.target.result);
          Object.keys(data).forEach(k => localStorage.setItem(k, data[k]));
          location.reload();
        } catch { showToast('Error al importar'); }
      };
      reader.readAsText(file);
    });

    document.getElementById('saveSnapshotDash')?.addEventListener('click', () => {
      if (!canEdit()) return showToast('Sin permiso');
      const c = store.get('controles', []);
      const s = store.get('snapshots', []);
      s.push({
        fecha: new Date().toLocaleDateString(),
        cumplimiento: Math.round(avg(c.map(x => x.cumplimiento))),
        madurez: Math.round(avg(c.map(x => x.madurez)))
      });
      store.set('snapshots', s);
      showToast('Snapshot guardado');
      drawDashboard();
    });

    // PDF Export
    document.getElementById('exportPdf')?.addEventListener('click', async () => {
      showToast('Generando PDF...');
      const { jsPDF } = window.jspdf;
      const doc = new jsPDF('p', 'mm', 'a4');
      const root = document.querySelector('[data-report-root="true"]');
      const canvas = await html2canvas(root);
      const imgData = canvas.toDataURL('image/png');
      const imgProps = doc.getImageProperties(imgData);
      const pdfWidth = doc.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      doc.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      doc.save(`Reporte_ISO42001_${new Date().toISOString().split('T')[0]}.pdf`);
    });

    // Boot
    if (sessionStorage.getItem('justWiped')) { showToast('Datos reiniciados'); sessionStorage.removeItem('justWiped'); }
    syncUIWithRole(); renderControles(); renderResponsables(); drawDashboard();
  });
})();

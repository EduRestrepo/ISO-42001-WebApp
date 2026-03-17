
// Store
const store = {
  get(key, def){ try{ return JSON.parse(localStorage.getItem(key)) ?? def }catch{ return def }},
  set(key, val){ localStorage.setItem(key, JSON.stringify(val)) },
  clear(){ localStorage.clear(); }
};

// Seed
const seedControls = [
  { id: 1, nombre: "A.1 Gobernanza de IA", estado:"No iniciado", inicio:"", objetivo:"", cumplimiento: 40, madurez: 30, notas:"" },
  { id: 2, nombre: "A.2 Gestión de Riesgos de IA", estado:"En progreso", inicio:"", objetivo:"", cumplimiento: 55, madurez: 45, notas:"" },
  { id: 3, nombre: "A.3 Transparencia y Explicabilidad", estado:"No iniciado", inicio:"", objetivo:"", cumplimiento: 25, madurez: 20, notas:"" },
  { id: 4, nombre: "A.4 Derechos de Usuarios y Privacidad", estado:"No iniciado", inicio:"", objetivo:"", cumplimiento: 35, madurez: 30, notas:"" },
  { id: 5, nombre: "A.5 Seguridad y Continuidad", estado:"En progreso", inicio:"", objetivo:"", cumplimiento: 60, madurez: 50, notas:"" },
  { id: 6, nombre: "A.6 Proveedores y Terceros", estado:"En progreso", inicio:"", objetivo:"", cumplimiento: 45, madurez: 35, notas:"" },
  { id: 7, nombre: "A.7 Auditoría y Monitoreo de Modelos", estado:"No iniciado", inicio:"", objetivo:"", cumplimiento: 30, madurez: 20, notas:"" },
  { id: 8, nombre: "A.8 Evaluación de Impacto (AIA/DPIA)", estado:"No iniciado", inicio:"", objetivo:"", cumplimiento: 20, madurez: 15, notas:"" },
  { id: 9, nombre: "A.9 Gestión del Ciclo de Vida de Modelos", estado:"No iniciado", inicio:"", objetivo:"", cumplimiento: 20, madurez: 20, notas:"" },
  { id:10, nombre: "A.10 Gestión de Datos y Calidad", estado:"En progreso", inicio:"", objetivo:"", cumplimiento: 35, madurez: 28, notas:"" },
  { id:11, nombre: "A.11 Seguridad de Datos y Modelo", estado:"No iniciado", inicio:"", objetivo:"", cumplimiento: 25, madurez: 22, notas:"" },
  { id:12, nombre: "A.12 Registro y Trazabilidad", estado:"No iniciado", inicio:"", objetivo:"", cumplimiento: 30, madurez: 25, notas:"" },
  { id:13, nombre: "A.13 Gestión de Incidentes de IA", estado:"No iniciado", inicio:"", objetivo:"", cumplimiento: 15, madurez: 10, notas:"" },
  { id:14, nombre: "A.14 Entrenamiento y Concienciación", estado:"No iniciado", inicio:"", objetivo:"", cumplimiento: 20, madurez: 18, notas:"" },
  { id:15, nombre: "A.15 Ética y No Discriminación", estado:"No iniciado", inicio:"", objetivo:"", cumplimiento: 22, madurez: 18, notas:"" },
  { id:16, nombre: "A.16 Gestión de Cambios de IA", estado:"No iniciado", inicio:"", objetivo:"", cumplimiento: 18, madurez: 14, notas:"" }
];
if(!store.get('controles')) {
  store.set('controles', seedControls);
} else {
  // Simple migration for new fields
  const cc = store.get('controles');
  let ch = false;
  cc.forEach(c => {
    if(!c.riesgo) { c.riesgo = "Medio"; ch=true; }
    if(!c.impacto) { c.impacto = "Medio"; ch=true; }
  });
  if(ch) store.set('controles', cc);
}
if(!store.get('role')) store.set('role', 'viewer');
if(!store.get('company')) store.set('company', '');
if(!store.get('responsables')) store.set('responsables', []);
if(!store.get('snapshots')) store.set('snapshots', []);
if(!store.get('notes')) store.set('notes', '');
if(!store.get('dashboardMode')) store.set('dashboardMode', 'torta_linea');

// Tabs
document.querySelectorAll('.tab-button').forEach(btn=>{
  btn.addEventListener('click', ()=>{
    document.querySelectorAll('.tab').forEach(s=>s.classList.remove('active'));
    document.getElementById(btn.dataset.tab).classList.add('active');
    if(btn.dataset.tab === 'dashboard') drawDashboard();
  });
});

// Helpers
function movingAvg(arr, k){
  if(!arr || !arr.length) return [];
  const out=[]; for(let i=0;i<arr.length;i++){
    const start=Math.max(0,i-k+1); const slice=arr.slice(start,i+1);
    const avg = slice.reduce((a,b)=>a+b,0)/slice.length; out.push(Math.round(avg));
  }
  return out;
}
const GOAL = 85;
function avg(a){ return a.length? a.reduce((x,y)=>x+y,0)/a.length : 0; }
function clamp(v,min,max){ return Math.max(min, Math.min(max,v)); }
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
  if(!container) return;
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = message;
  container.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    setTimeout(() => toast.remove(), 500);
  }, 3000);
}

// CONFIG
const companyInput = document.getElementById('companyName');
const companyDash = document.getElementById('companyDash');
if(companyInput){ companyInput.value = store.get('company',''); }
if(companyDash){ companyDash.textContent = store.get('company','') || '—'; }
if(document.getElementById('saveCompany')) document.getElementById('saveCompany').onclick = ()=>{
  store.set('company', (companyInput?.value||'').trim());
  if(companyDash){ companyDash.textContent = (companyInput?.value||'').trim() || '—'; }
  showToast('Compañía guardada.');
};

const respInput = document.getElementById('responsableInput');
const respList = document.getElementById('responsablesList');
function renderResponsables(){
  if(!respList) return;
  const responsables = store.get('responsables', []);
  respList.innerHTML = '';
  responsables.forEach((r, idx)=>{
    const li = document.createElement('li'); li.textContent = r;
    if (['admin','auditor'].includes(store.get('role'))) {
      const del = document.createElement('button'); del.textContent='×'; del.style.marginLeft='8px';
      del.onclick = ()=>{ const arr = store.get('responsables', []); arr.splice(idx,1); store.set('responsables', arr); renderResponsables(); drawDashboard(); };
      li.appendChild(del);
    }
    respList.appendChild(li);
  });
}
renderResponsables();
if(document.getElementById('addResponsable')) document.getElementById('addResponsable').onclick = ()=>{
  const role = store.get('role'); if(!['admin','auditor'].includes(role)) return showToast('Sin permiso para editar.');
  const val = (respInput?.value||'').trim(); if(!val) return;
  const arr = store.get('responsables', []); arr.push(val); store.set('responsables', arr);
  if(respInput) respInput.value=''; renderResponsables(); drawDashboard();
};

const notesArea = document.getElementById('extraNotes'); if(notesArea) notesArea.value = store.get('notes','');
if(document.getElementById('saveNotes')) document.getElementById('saveNotes').onclick = ()=>{ store.set('notes', notesArea?.value || ''); showToast('Anotaciones guardadas.'); };

// Dashboard mode select
const dashModeSel = document.getElementById('dashMode');
if(dashModeSel){ dashModeSel.value = store.get('dashboardMode','torta_linea'); }
if(document.getElementById('saveDashMode')) document.getElementById('saveDashMode').onclick = ()=>{
  const mode = dashModeSel ? dashModeSel.value : 'torta_linea';
  store.set('dashboardMode', mode);
  showToast('Modo de dashboard guardado: ' + mode);
  drawDashboard();
};

// Wipe all data
if(document.getElementById('wipeAll')) document.getElementById('wipeAll').onclick = ()=>{
  if(confirm('¿Deseas eliminar TODA la información almacenada localmente? Esta acción no se puede deshacer.')){
    localStorage.clear();
    showToast('Información eliminada. Recargando...');
    setTimeout(() => location.reload(), 1000);
  }
};

// CONTROLES (CRUD)
const tbody = document.getElementById('controlesBody');
function renderControles(){
  if(!tbody) return;
  const controls = store.get('controles', []); tbody.innerHTML='';
  controls.forEach((c, i)=>{
    const tr = document.createElement('tr');
    const role = store.get('role'); const canEdit = ['admin','auditor'].includes(role);

    const nameEl = document.createElement(canEdit?'input':'div');
    if(canEdit){ nameEl.type='text'; nameEl.value=c.nombre; nameEl.onchange=e=>{ c.nombre=e.target.value; saveControls(controls); }; } else { nameEl.textContent=c.nombre; }

    const estadoSel = document.createElement(canEdit?'select':'div');
    const estados = ["No iniciado","En progreso","Implementado"];
    if(canEdit){ estados.forEach(s=>{ const o=document.createElement('option'); o.textContent=s; estadoSel.appendChild(o); }); estadoSel.value = c.estado || "No iniciado"; estadoSel.onchange = e=>{ c.estado=e.target.value; saveControls(controls); drawDashboard(); }; } else { estadoSel.textContent = c.estado || "No iniciado"; }

    const inpInicio = document.createElement(canEdit?'input':'div'); if(canEdit){ inpInicio.type='date'; inpInicio.value=c.inicio||""; inpInicio.onchange=e=>{ c.inicio=e.target.value; saveControls(controls);} } else { inpInicio.textContent = c.inicio || '—'; }
    const inpObjetivo = document.createElement(canEdit?'input':'div'); if(canEdit){ inpObjetivo.type='date'; inpObjetivo.value=c.objetivo||""; inpObjetivo.onchange=e=>{ c.objetivo=e.target.value; saveControls(controls);} } else { inpObjetivo.textContent = c.objetivo || '—'; }

    const inpC = document.createElement(canEdit?'input':'div'); if(canEdit){ inpC.type='number'; inpC.min=0; inpC.max=100; inpC.value=c.cumplimiento; inpC.onchange = (e)=>{ c.cumplimiento = clamp(Number(e.target.value),0,100); saveControls(controls); drawDashboard(); }; } else { inpC.textContent = c.cumplimiento + '%'; }
    const inpM = document.createElement(canEdit?'input':'div'); if(canEdit){ inpM.type='number'; inpM.min=0; inpM.max=100; inpM.value=c.madurez; inpM.onchange = (e)=>{ c.madurez = clamp(Number(e.target.value),0,100); saveControls(controls); drawDashboard(); }; } else { inpM.textContent = c.madurez + '%'; }

    const riskSel = document.createElement(canEdit?'select':'div');
    const risks = ["Bajo","Medio","Alto","Crítico"];
    if(canEdit){ risks.forEach(r=>{ const o=document.createElement('option'); o.textContent=r; riskSel.appendChild(o); }); riskSel.value = c.riesgo || "Medio"; riskSel.onchange = e=>{ c.riesgo=e.target.value; saveControls(controls); }; } else { riskSel.innerHTML = getBadge(c.riesgo || "Medio", 'risk'); }

    const impactSel = document.createElement(canEdit?'select':'div');
    const impacts = ["Bajo","Medio","Alto"];
    if(canEdit){ impacts.forEach(r=>{ const o=document.createElement('option'); o.textContent=r; impactSel.appendChild(o); }); impactSel.value = c.impacto || "Medio"; impactSel.onchange = e=>{ c.impacto=e.target.value; saveControls(controls); }; } else { impactSel.textContent = c.impacto || "Medio"; }

    const notas = document.createElement(canEdit?'input':'div'); if(canEdit){ notas.type='text'; notas.value=c.notas||""; notas.onchange=e=>{ c.notas=e.target.value; saveControls(controls);} } else { notas.textContent = c.notas || '—'; }

    const acciones = document.createElement('div'); if(canEdit){
      const del = document.createElement('button'); del.className = 'danger'; del.textContent='Eliminar';
      del.onclick = ()=>{ if(confirm('¿Eliminar '+c.nombre+'?')){ controls.splice(i,1); saveControls(controls); drawDashboard(); showToast('Control eliminado'); } };
      acciones.appendChild(del);
    } else { acciones.textContent = '—'; }

    function td(el){ const td=document.createElement('td'); td.appendChild(el); return td; }
    tr.append(td(nameEl), td(estadoSel), td(inpInicio), td(inpObjetivo), td(inpC), td(inpM), td(riskSel), td(impactSel), td(notas), td(acciones));
    tbody.appendChild(tr);
  });
  updateKpis();
}
function saveControls(arr){ store.set('controles', arr); renderControles(); }
function updateKpis(){
  const controls = store.get('controles', []);
  const avgC = Math.round(avg(controls.map(c=>c.cumplimiento)) || 0);
  const avgM = Math.round(avg(controls.map(c=>c.madurez)) || 0);
  const elC = document.getElementById('kpiCumpl'); if(elC) elC.textContent = avgC + '%';
  const elM = document.getElementById('kpiMadur'); if(elM) elM.textContent = avgM + '%';
}
renderControles();

// Add control
if(document.getElementById('addControl')) document.getElementById('addControl').onclick = ()=>{
  const role = store.get('role'); if(!['admin','auditor'].includes(role)) return showToast('Sin permiso para editar.');
  const name = document.getElementById('newControlName').value.trim();
  const estado = document.getElementById('newControlEstado').value;
  const riesgo = document.getElementById('newControlRisk').value;
  const impacto = document.getElementById('newControlImpact').value;
  const inicio = document.getElementById('newControlInicio').value;
  const objetivo = document.getElementById('newControlObjetivo').value;
  const c = Number(document.getElementById('newControlCumpl').value);
  const m = Number(document.getElementById('newControlMad').value);
  const notas = document.getElementById('newControlNotas').value.trim();
  if(!name) return showToast('Nombre requerido');
  const controls = store.get('controles', []);
  const nextId = controls.reduce((max, x)=> Math.max(max, x.id), 0) + 1;
  controls.push({ id: nextId, nombre: name, estado, riesgo, impacto, inicio, objetivo, cumplimiento: Math.max(0,Math.min(100,c)), madurez: Math.max(0,Math.min(100,m)), notas });
  saveControls(controls);
  ['newControlName','newControlInicio','newControlObjetivo','newControlNotas'].forEach(id=>document.getElementById(id).value='');
  document.getElementById('newControlCumpl').value=0; document.getElementById('newControlMad').value=0;
  drawDashboard();
  showToast('Control agregado: ' + name);
};

// Export CSV
if(document.getElementById('btnExportCSV')) document.getElementById('btnExportCSV').onclick = ()=>{
  const controls = store.get('controles', []);
  const rows = [['id','control','estado','inicio','objetivo','cumplimiento','madurez','notas']].concat(
    controls.map(c=>[c.id, c.nombre, c.estado, c.inicio, c.objetivo, c.cumplimiento, c.madurez, c.notas])
  );
  const csv = rows.map(r=>r.map(x => `"${String(x).replaceAll('"','""')}"`).join(',')).join('\n');
  const blob = new Blob([csv], {type:'text/csv;charset=utf-8;'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a'); a.href=url; a.download='controles_iso42001.csv'; a.click();
  URL.revokeObjectURL(url);
};

// Export JSON (dataset completo)
if(document.getElementById('btnExportJSON')) document.getElementById('btnExportJSON').onclick = ()=>{
  const data = {
    company: store.get('company',''),
    responsables: store.get('responsables',[]),
    notes: store.get('notes',''),
    controles: store.get('controles',[]),
    snapshots: store.get('snapshots',[])
  };
  const blob = new Blob([JSON.stringify(data,null,2)], {type:'application/json'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a'); a.href=url; a.download='iso42001_dataset.json'; a.click();
  URL.revokeObjectURL(url);
};

// Import JSON
if(document.getElementById('importJSON')) document.getElementById('importJSON').addEventListener('change', (e)=>{
  const file = e.target.files[0]; if(!file) return;
  const reader = new FileReader();
  reader.onload = ()=>{
    try{
      const data = JSON.parse(reader.result);
      if(data.controles) store.set('controles', data.controles);
      if('company' in data) store.set('company', data.company);
      if(Array.isArray(data.responsables)) store.set('responsables', data.responsables);
      if('notes' in data) store.set('notes', data.notes);
      if(Array.isArray(data.snapshots)) store.set('snapshots', data.snapshots);
      alert('Datos importados correctamente.');
      if(companyInput) companyInput.value = store.get('company','');
      if(companyDash) companyDash.textContent = store.get('company','') || '—';
      if(notesArea) notesArea.value = store.get('notes','');
      renderResponsables(); renderControles(); drawDashboard();
    }catch(err){ alert('Archivo inválido.'); }
  };
  reader.readAsText(file);
});

// Reset (solo controles & snapshots)
if(document.getElementById('btnReset')) document.getElementById('btnReset').onclick = ()=>{
  const role = store.get('role'); if(role!=='admin') return alert('Solo admin puede reiniciar datos.');
  if(confirm('¿Seguro que deseas reiniciar controles y snapshots?')){
    store.set('controles', seedControls);
    store.set('snapshots', []);
    renderControles(); drawDashboard();
  }
};

// RBAC
if(document.getElementById('currentRole')) document.getElementById('currentRole').textContent = store.get('role');
if(document.getElementById('applyRole')) document.getElementById('applyRole').onclick = ()=>{
  const sel = document.getElementById('roleSelect').value;
  store.set('role', sel);
  document.getElementById('currentRole').textContent = sel;
  renderControles(); renderResponsables(); drawDashboard();
  alert('Rol aplicado: ' + sel);
};

// DASHBOARD CHARTS (gauges, estado, scatter)
let trendChart, statusChart, timeSeriesChart;

function drawDashboard(){
  if(companyDash) companyDash.textContent = store.get('company','') || '—';
  const controls = store.get('controles', []);
  const avgC = Math.round(avg(controls.map(c=>c.cumplimiento)) || 0);
  const avgM = Math.round(avg(controls.map(c=>c.madurez)) || 0);
  const implPct = Math.round((controls.filter(c=>c.estado==='Implementado').length / (controls.length||1)) * 100);
  const riesgos = controls.filter(c=> ((c.cumplimiento + c.madurez)/2) < 40 ).length;
  const snaps = store.get('snapshots', []);

  const elC = document.getElementById('kpiCumpl'); if(elC) elC.textContent = `${avgC}%`;
  const elM = document.getElementById('kpiMadur'); if(elM) elM.textContent = `${avgM}%`;
  const elI = document.getElementById('kpiImpl'); if(elI) elI.textContent = `${implPct}%`;
  const elR = document.getElementById('kpiRiesgos'); if(elR) elR.textContent = `${riesgos}`;

  if(document.getElementById('kpiCumplTrend')){
    if(snaps.length){
      const last = snaps[snaps.length-1];
      const dC = avgC - last.cumplimiento;
      const dM = avgM - last.madurez;
      document.getElementById('kpiCumplTrend').textContent = (dC>=0? '▲ +' : '▼ ') + dC + '% vs último snapshot';
      document.getElementById('kpiMadurTrend').textContent = (dM>=0? '▲ +' : '▼ ') + dM + '% vs último snapshot';
      document.getElementById('kpiImplDesc').textContent = `Implementados: ${controls.filter(c=>c.estado==='Implementado').length}/${controls.length}`;
    } else {
      document.getElementById('kpiCumplTrend').textContent = 'Sin snapshots previos';
      document.getElementById('kpiMadurTrend').textContent = 'Sin snapshots previos';
      document.getElementById('kpiImplDesc').textContent = `Implementados: ${controls.filter(c=>c.estado==='Implementado').length}/${controls.length}`;
    }
  }

  
  // Tendencia horizontal (0–100%) para Cumplimiento y Madurez
  const tEl = document.getElementById('trendChart');
  if(tEl){
    const ctxT = tEl.getContext('2d');
    if(trendChart) trendChart.destroy();
    // Horizontal line with two points (y labels)
    trendChart = new Chart(ctxT, {
      type: 'line',
      data: {
        labels: ['Cumplimiento', 'Madurez'],
        datasets: [{
          label: 'Actual %',
          data: [avgC, avgM],
          fill: false,
          tension: 0.2
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        indexAxis: 'y',
        scales: {
          x: { min: 0, max: 100, title: { display: true, text: 'Porcentaje (%)' } },
          y: { title: { display: false } }
        },
        plugins: { legend: { display: false } }
      }
    });
  }


  const statusCount = { "No iniciado":0, "En progreso":0, "Implementado":0 };
  controls.forEach(c=> statusCount[c.estado || "No iniciado"]++ );
  const ctx1El = document.getElementById('statusChart');
  const cardStatus = document.getElementById('cardStatus');
  const mode = store.get('dashboardMode','torta_linea');
  if(cardStatus){ cardStatus.style.display = (mode === 'solo_linea') ? 'none' : 'block'; }
  if(ctx1El && store.get('dashboardMode','torta_linea') !== 'solo_linea'){
    const ctx1 = ctx1El.getContext('2d');
    if(statusChart) statusChart.destroy();
    statusChart = new Chart(ctx1, {
      type:'pie',
      data:{ labels:['No iniciado','En progreso','Implementado'], datasets:[{label:'Controles', data:[statusCount['No iniciado'], statusCount['En progreso'], statusCount['Implementado']]}] },
      options:{ responsive:true, maintainAspectRatio:false }
    });
  } else {
    if(statusChart){ statusChart.destroy(); statusChart = null; }
  }

  // Time series (Evolución en el tiempo)
  const tsEl = document.getElementById('timeSeriesChart');
  if(tsEl){
    const snaps = store.get('snapshots', []);
    const labels = snaps.map(s=>s.fecha);
    const dataC = snaps.map(s=>s.cumplimiento);
    const dataM = snaps.map(s=>s.madurez);
    const ctxTS = tsEl.getContext('2d');
    if(timeSeriesChart) timeSeriesChart.destroy();
    timeSeriesChart = new Chart(ctxTS, {
      type:'line',
      data:{ labels, datasets:[
        { label:'Cumplimiento %', data: dataC, fill:false, tension:.2 },
        { label:'Madurez %', data: dataM, fill:false, tension:.2 },
        { label:'Meta 85%', data: labels.map(()=>GOAL), fill:false, tension:0 },
        { label:'PM(3) Cumplimiento', data: movingAvg(dataC,3), fill:false, tension:.2 },
        { label:'PM(3) Madurez', data: movingAvg(dataM,3), fill:false, tension:.2 }
      ] },
      options:{ responsive:true, maintainAspectRatio:false, scales:{ y:{ min:0, max:100 } } }
    });
  }

  const ctx2El = document.getElementById('scatterChart');
  if(ctx2El){
    const ctx2 = ctx2El.getContext('2d');
    if(scatterChart) scatterChart.destroy();
    scatterChart = new Chart(ctx2, {
      type: 'scatter',
      data: { datasets: [{ label:'Controles', data: controls.map(c=>({x:c.cumplimiento, y:c.madurez, control:c.nombre, estado:c.estado})) }] },
      options: { responsive:true, maintainAspectRatio:false, scales:{ x:{min:0,max:100, title:{display:true, text:'Cumplimiento %'} }, y:{min:0,max:100, title:{display:true, text:'Madurez %'} } }, plugins:{ tooltip:{ callbacks:{ label:(ctx)=> `${ctx.raw.control} — (${ctx.parsed.x}%, ${ctx.parsed.y}%) [${ctx.raw.estado}]` } } } }
    });
  }
}
drawDashboard();

// Snapshot from Dashboard
if(document.getElementById('saveSnapshotDash')) document.getElementById('saveSnapshotDash').onclick = ()=>{
  const role = store.get('role'); if(!['admin','auditor'].includes(role)) return alert('Sin permiso para guardar snapshots.');
  const controls = store.get('controles', []);
  const avgC = Math.round(avg(controls.map(c=>c.cumplimiento)) || 0);
  const avgM = Math.round(avg(controls.map(c=>c.madurez)) || 0);
  const fecha = new Date().toISOString().slice(0,10);
  const snaps = store.get('snapshots', []);
  snaps.push({ fecha, cumplimiento: avgC, madurez: avgM });
  store.set('snapshots', snaps);
  alert('Snapshot guardado.');
  drawDashboard();
};

// Export PDF (Portada + Dashboard + Hallazgos)
if(document.getElementById('exportPdf')){
  document.getElementById('exportPdf').onclick = async () => {
    const root = document.querySelector('section#dashboard[data-report-root="true"]');
    if(!root){ alert('No se encontró el Dashboard'); return; }

    // Data for cover and findings
    const company = JSON.parse(localStorage.getItem('company') || '""');
    const responsables = JSON.parse(localStorage.getItem('responsables') || '[]');
    const controles = JSON.parse(localStorage.getItem('controles') || '[]');
    const today = new Date();
    const fecha = today.toLocaleDateString(undefined, { year:'numeric', month:'2-digit', day:'2-digit' });

    // Compute Top 5 (menor promedio cumplimiento+madurez)
    const top5 = [...controles].map(c => ({
      nombre: c.nombre,
      promedio: Math.round(((Number(c.cumplimiento)||0) + (Number(c.madurez)||0))/2),
      estado: c.estado || '—',
      objetivo: c.objetivo || '—'
    })).sort((a,b)=> a.promedio - b.promedio).slice(0,5);

    // Capture dashboard as image
    root.scrollIntoView({behavior:'instant', block:'start'});
    const dashCanvas = await html2canvas(root, {scale:2, useCORS:true});
    const dashImg = dashCanvas.toDataURL('image/png');

    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF('p','mm','a4');
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    // ---- Portada ----
    try{
      const logoEl = document.querySelector('header.app-header img.logo');
      let logoData = null;
      if(logoEl){ logoData = logoEl.src; }
      if(logoData){
        // place logo at top-left
        pdf.addImage(logoData, 'PNG', 15, 15, 25, 25);
      }
    }catch(e){ /* ignore */ }
    pdf.setFontSize(18);
    pdf.text('Reporte de Implementación ISO/IEC 42001', pageWidth/2, 30, {align:'center'});
    pdf.setFontSize(12);
    pdf.text(`Empresa: ${company || '—'}`, 15, 50);
    pdf.text(`Fecha: ${fecha}`, 15, 58);
    pdf.text('Responsables:', 15, 66);
    const respLines = (responsables && responsables.length? responsables : ['—']).slice(0,12);
    let y=74;
    respLines.forEach(r => { pdf.text(`• ${r}`, 20, y); y+=6; });

    // ---- Dashboard (imagen) ----
    pdf.addPage();
    pdf.setFontSize(16);
    pdf.text('Dashboard', 15, 20);
    const imgMargin = 10;
    const imgWidth = pageWidth - imgMargin*2;
    const imgHeight = dashCanvas.height * imgWidth / dashCanvas.width;
    let imgY = 28;
    if(imgHeight <= pageHeight - imgY - 10){
      pdf.addImage(dashImg, 'PNG', imgMargin, imgY, imgWidth, imgHeight);
    } else {
      // paginate dashboard image if longer than a page
      let remaining = imgHeight;
      let position = imgY;
      while(remaining > 0){
        pdf.addImage(dashImg, 'PNG', imgMargin, position, imgWidth, imgHeight);
        remaining -= (pageHeight - imgY - 10);
        if(remaining > 0){ pdf.addPage(); position = 10 - (imgHeight - remaining); }
      }
    }

    // ---- Hallazgos (Top 5) ----
    pdf.addPage();
    pdf.setFontSize(16);
    pdf.text('Hallazgos — Top 5 a mejorar', 15, 20);
    pdf.setFontSize(11);
    let ty = 30;
    if(!top5.length){
      pdf.text('No hay datos suficientes para calcular el Top 5.', 15, ty);
    } else {
      pdf.text('Ordenados por menor promedio de Cumplimiento y Madurez.', 15, ty); ty+=8;
      // Simple table-like layout
      pdf.setFont(undefined, 'bold');
      pdf.text('Control', 15, ty);
      pdf.text('Promedio', 110, ty);
      pdf.text('Estado', 140, ty);
      pdf.text('Objetivo', 170, ty, {align:'right'});
      pdf.setFont(undefined, 'normal'); ty+=6;
      top5.forEach(item => {
        pdf.text(String(item.nombre).slice(0,60), 15, ty);
        pdf.text(`${item.promedio}%`, 110, ty);
        pdf.text(String(item.estado).slice(0,18), 140, ty);
        pdf.text(String(item.objetivo), 170, ty, {align:'right'});
        ty+=6;
        if(ty > pageHeight - 20){ pdf.addPage(); ty=20; }
      });
    }

    // Save
    const fileName = `reporte_iso42001_${company?company.replace(/\s+/g,'_'):'empresa'}_${fecha.replace(/\//g,'-')}.pdf`;
    pdf.save(fileName);
  };
}

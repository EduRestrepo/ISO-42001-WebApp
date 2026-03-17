// Chart.js integration and configuration
import { store } from './store.js';
import { GOAL, avg, movingAvg } from './utils.js';

let trendChart, statusChart, timeSeriesChart, scatterChart;

export function drawDashboard() {
  const controls = store.get('controles', []);
  const avgC = Math.round(avg(controls.map(c => c.cumplimiento)) || 0);
  const avgM = Math.round(avg(controls.map(c => c.madurez)) || 0);
  const implPct = Math.round((controls.filter(c => c.estado === 'Implementado').length / (controls.length || 1)) * 100);
  const riesgos = controls.filter(c => ((c.cumplimiento + c.madurez) / 2) < 40).length;
  const snaps = store.get('snapshots', []);

  // Update KPIs
  const updateText = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
  updateText('kpiCumpl', `${avgC}%`);
  updateText('kpiMadur', `${avgM}%`);
  updateText('kpiImpl', `${implPct}%`);
  updateText('kpiRiesgos', riesgos);
  updateText('companyDash', store.get('company', '') || '—');

  if (document.getElementById('kpiCumplTrend')) {
    if (snaps.length) {
      const last = snaps[snaps.length - 1];
      const dC = avgC - last.cumplimiento;
      const dM = avgM - last.madurez;
      updateText('kpiCumplTrend', (dC >= 0 ? '▲ +' : '▼ ') + dC + '% vs último snapshot');
      updateText('kpiMadurTrend', (dM >= 0 ? '▲ +' : '▼ ') + dM + '% vs último snapshot');
      updateText('kpiImplDesc', `Implementados: ${controls.filter(c => c.estado === 'Implementado').length}/${controls.length}`);
    } else {
      updateText('kpiCumplTrend', 'Sin snapshots previos');
      updateText('kpiMadurTrend', 'Sin snapshots previos');
      updateText('kpiImplDesc', `Implementados: ${controls.filter(c => c.estado === 'Implementado').length}/${controls.length}`);
    }
  }

  // --- RENDERING CHARTS ---
  const renderChart = (id, config, globalVar) => {
    const el = document.getElementById(id);
    if (!el) return null;
    if (globalVar) globalVar.destroy();
    return new Chart(el.getContext('2d'), config);
  };

  // 1. Trend Bar Chart (Horizontal)
  trendChart = renderChart('trendChart', {
    type: 'line',
    data: {
      labels: ['Cumplimiento', 'Madurez'],
      datasets: [{ label: 'Actual %', data: [avgC, avgM], fill: false, tension: 0.2 }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      indexAxis: 'y',
      scales: { x: { min: 0, max: 100 } },
      plugins: { legend: { display: false } }
    }
  }, trendChart);

  // 2. Status Pie Chart
  const statusCount = { "No iniciado": 0, "En progreso": 0, "Implementado": 0 };
  controls.forEach(c => statusCount[c.estado || "No iniciado"]++);
  const dashMode = store.get('dashboardMode', 'torta_linea');

  if (dashMode !== 'solo_linea') {
    statusChart = renderChart('statusChart', {
      type: 'pie',
      data: {
        labels: ['No iniciado', 'En progreso', 'Implementado'],
        datasets: [{ label: 'Controles', data: [statusCount['No iniciado'], statusCount['En progreso'], statusCount['Implementado']] }]
      },
      options: { responsive: true, maintainAspectRatio: false }
    }, statusChart);
  } else if (statusChart) {
    statusChart.destroy();
    statusChart = null;
  }

  // 3. Time Series Line Chart
  if (snaps.length) {
    const labels = snaps.map(s => s.fecha);
    const dataC = snaps.map(s => s.cumplimiento);
    const dataM = snaps.map(s => s.madurez);
    timeSeriesChart = renderChart('timeSeriesChart', {
      type: 'line',
      data: {
        labels,
        datasets: [
          { label: 'Cumplimiento %', data: dataC, fill: false, tension: .2 },
          { label: 'Madurez %', data: dataM, fill: false, tension: .2 },
          { label: 'Meta 85%', data: labels.map(() => GOAL), fill: false, tension: 0, borderColor: '#ef4444', borderDash: [5, 5] },
          { label: 'PM(3) Cumplimiento', data: movingAvg(dataC, 3), fill: false, tension: .2, borderColor: '#6366f1' },
          { label: 'PM(3) Madurez', data: movingAvg(dataM, 3), fill: false, tension: .2, borderColor: '#a855f7' }
        ]
      },
      options: { responsive: true, maintainAspectRatio: false, scales: { y: { min: 0, max: 100 } } }
    }, timeSeriesChart);
  }

  // 4. Scatter Plot
  scatterChart = renderChart('scatterChart', {
    type: 'scatter',
    data: {
      datasets: [{
        label: 'Controles',
        data: controls.map(c => ({
          x: c.cumplimiento,
          y: c.madurez,
          control: c.nombre,
          estado: c.estado,
          riesgo: c.riesgo,
          impacto: c.impacto
        }))
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: { min: 0, max: 100, title: { display: true, text: 'Cumplimiento %' } },
        y: { min: 0, max: 100, title: { display: true, text: 'Madurez %' } }
      },
      plugins: {
        tooltip: {
          callbacks: {
            label: (ctx) => `${ctx.raw.control} [${ctx.raw.estado}] — Riesgo: ${ctx.raw.riesgo}, Impacto: ${ctx.raw.impacto}`
          }
        }
      }
    }
  }, scatterChart);
}

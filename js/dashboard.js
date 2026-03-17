import { store, ui } from './core.js';

export class Dashboard {
    static async render() {
        const controls = await store.fetch('controls') || [];
        const actions = await store.fetch('actions') || [];
        
        const total = controls.length;
        const impl = controls.filter(c => c.estado === 'Implementado').length;
        const avgAvance = Math.round(controls.reduce((a, b) => a + (b.avance || 0), 0) / (total || 1));
        const vencidos = actions.filter(a => new Date(a.fechaObjetivo) < new Date() && a.estado !== 'Cerrado').length;

        const kpiGrid = document.getElementById('kpiGrid');
        kpiGrid.innerHTML = `
            <div class="card">
                <p class="text-muted">Total Controles</p>
                <h1>${total}</h1>
            </div>
            <div class="card">
                <p class="text-muted">Cumplimiento Global</p>
                <h1 style="color: var(--success);">${avgAvance}%</h1>
            </div>
            <div class="card">
                <p class="text-muted">Implementados</p>
                <h1>${impl}</h1>
            </div>
            <div class="card">
                <p class="text-muted">Accionables Vencidos</p>
                <h1 style="color: var(--danger);">${vencidos}</h1>
            </div>
        `;

        this.renderCharts(controls);
    }

    static renderCharts(controls) {
        // Domain chart
        const domains = [...new Set(controls.map(c => c.categoria))];
        const ctx = document.getElementById('domainChart');
        if (!ctx) return;
        
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: domains.map(d => d.split(' ')[0]),
                datasets: [{
                    label: '% Avance',
                    data: domains.map(d => {
                        const dc = controls.filter(c => c.categoria === d);
                        return Math.round(dc.reduce((a, b) => a + (b.avance || 0), 0) / dc.length);
                    }),
                    backgroundColor: '#2563eb'
                }]
            },
            options: { indexAxis: 'y', scales: { x: { min: 0, max: 100 } } }
        });
    }
}

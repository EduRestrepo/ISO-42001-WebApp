import { store, ui } from './core.js';

export class Actions {
    static async render() {
        const actions = await store.fetch('actions') || [];
        const container = document.getElementById('actionsTableContainer');
        const stats = document.getElementById('actionStats');

        const total = actions.length;
        const open = actions.filter(a => a.estado === 'Abierto').length;
        const closed = actions.filter(a => a.estado === 'Cerrado').length;
        
        stats.innerHTML = `
            <div class="card" style="padding: 16px;">
                <small class="text-muted">Total</small>
                <h3>${total}</h3>
            </div>
            <div class="card" style="padding: 16px; border-left: 4px solid var(--warning);">
                <small class="text-muted">Abiertos</small>
                <h3>${open}</h3>
            </div>
            <div class="card" style="padding: 16px; border-left: 4px solid var(--success);">
                <small class="text-muted">Cerrados</small>
                <h3>${closed}</h3>
            </div>
            <div class="card" style="padding: 16px; border-left: 4px solid var(--danger);">
                <small class="text-muted">Vencidos</small>
                <h3>${actions.filter(a => new Date(a.fechaObjetivo) < new Date() && a.estado !== 'Cerrado').length}</h3>
            </div>
        `;

        if (!total) {
            container.innerHTML = '<p class="text-muted">No hay planes de acción registrados.</p>';
            return;
        }

        let html = `
            <table class="table" style="width: 100%; border-collapse: collapse;">
                <thead>
                    <tr style="text-align: left; border-bottom: 2px solid var(--border);">
                        <th style="padding: 12px;">Accionable</th>
                        <th style="padding: 12px;">Responsable</th>
                        <th style="padding: 12px;">Fecha Fin</th>
                        <th style="padding: 12px;">Estado</th>
                        <th style="padding: 12px;">Prioridad</th>
                    </tr>
                </thead>
                <tbody>
        `;

        actions.forEach(a => {
            html += `
                <tr style="border-bottom: 1px solid var(--border);">
                    <td style="padding: 12px;">
                        <div style="font-weight: 500;">${a.titulo}</div>
                        <small class="text-muted">${a.descripcion}</small>
                    </td>
                    <td style="padding: 12px;">${a.responsable}</td>
                    <td style="padding: 12px;">${a.fechaObjetivo}</td>
                    <td style="padding: 12px;">
                        <span class="badge" style="background: ${a.estado === 'Cerrado' ? '#10b981' : '#f59e0b'}; color: white; padding: 4px 8px; border-radius: 4px; font-size: 11px;">
                            ${a.estado}
                        </span>
                    </td>
                    <td style="padding: 12px;">${a.prioridad}</td>
                </tr>
            `;
        });

        html += '</tbody></table>';
        container.innerHTML = html;
    }
}

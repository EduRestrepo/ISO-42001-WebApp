import { store, ui } from './core.js';

export class Participants {
    static async render() {
        const participants = await store.fetch('participants') || [];
        const container = document.getElementById('participantsTableContainer');
        
        if (!participants.length) {
            container.innerHTML = '<p class="text-muted">No hay participantes registrados.</p>';
            return;
        }

        let html = `
            <table class="table" style="width: 100%; border-collapse: collapse;">
                <thead>
                    <tr style="text-align: left; border-bottom: 2px solid var(--border);">
                        <th style="padding: 12px;">Nombre</th>
                        <th style="padding: 12px;">Cargo / Área</th>
                        <th style="padding: 12px;">Email</th>
                        <th style="padding: 12px;">Rol Proyecto</th>
                        <th style="padding: 12px;">Estado</th>
                    </tr>
                </thead>
                <tbody>
        `;

        participants.forEach(p => {
            html += `
                <tr style="border-bottom: 1px solid var(--border);">
                    <td style="padding: 12px; font-weight: 500;">${p.nombre}</td>
                    <td style="padding: 12px;">
                        <div>${p.cargo}</div>
                        <small class="text-muted">${p.area}</small>
                    </td>
                    <td style="padding: 12px;">${p.email}</td>
                    <td style="padding: 12px;">${p.rol}</td>
                    <td style="padding: 12px;">
                        <span style="color: ${p.estado === 'Activo' ? 'var(--success)' : 'var(--text-muted)'}; font-size: 11px; font-weight: bold;">
                            ● ${p.estado}
                        </span>
                    </td>
                </tr>
            `;
        });

        html += '</tbody></table>';
        container.innerHTML = html;
    }
}

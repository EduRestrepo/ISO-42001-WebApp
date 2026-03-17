import { store, ui } from './core.js';

export class Controls {
    static async render() {
        const controls = await store.fetch('controls') || [];
        const container = document.getElementById('controlsTableContainer');
        this.bindModal();
        
        if (!controls.length) {
            container.innerHTML = '<p class="text-muted">No hay controles registrados.</p>';
            return;
        }

        let html = `
            <table class="table" style="width: 100%; border-collapse: collapse; margin-top: 16px;">
                <thead>
                    <tr style="text-align: left; border-bottom: 2px solid var(--border);">
                        <th style="padding: 12px;">ID</th>
                        <th style="padding: 12px;">Control</th>
                        <th style="padding: 12px;">Estado</th>
                        <th style="padding: 12px;">Avance</th>
                        <th style="padding: 12px;">Madurez</th>
                        <th style="padding: 12px;">Responsable</th>
                        <th style="padding: 12px;">Acciones</th>
                    </tr>
                </thead>
                <tbody>
        `;

        controls.forEach(c => {
            html += `
                <tr style="border-bottom: 1px solid var(--border);">
                    <td style="padding: 12px; font-weight: bold;">${c.id}</td>
                    <td style="padding: 12px;">
                        <div style="font-weight: 500;">${c.nombre}</div>
                        <small class="text-muted">${c.categoria}</small>
                    </td>
                    <td style="padding: 12px;">
                        <span class="badge" style="background: ${this.getStatusColor(c.estado)}; color: white; padding: 4px 8px; border-radius: 4px; font-size: 11px;">
                            ${c.estado}
                        </span>
                    </td>
                    <td style="padding: 12px;">${c.avance || 0}%</td>
                    <td style="padding: 12px;">${c.madurez || 0}%</td>
                    <td style="padding: 12px;">${c.responsable || '—'}</td>
                    <td style="padding: 12px;">
                        <button class="btn-sm edit-control" data-id="${c.id}" style="padding: 4px 8px; background: none; border: 1px solid var(--border); border-radius: 4px; cursor: pointer;">✏️</button>
                    </td>
                </tr>
            `;
        });

        html += '</tbody></table>';
        container.innerHTML = html;
    }

    static bindModal() {
        const modal = document.getElementById('controlModal');
        const btnOpen = document.getElementById('btnOpenControlModal');
        const btnClose = document.getElementById('btnCloseControlModal');
        const form = document.getElementById('controlForm');

        if (btnOpen) btnOpen.onclick = () => modal.style.display = 'flex';
        if (btnClose) btnClose.onclick = () => modal.style.display = 'none';

        if (form) {
            form.onsubmit = async (e) => {
                e.preventDefault();
                await this.saveControl();
                modal.style.display = 'none';
                form.reset();
                await this.render();
                ui.showToast('Control guardado con éxito', 'success');
            };
        }
    }

    static async saveControl() {
        const controls = await store.fetch('controls') || [];
        const newCtrl = {
            id: document.getElementById('ctrlId').value,
            nombre: document.getElementById('ctrlNombre').value,
            categoria: document.getElementById('ctrlCat').value,
            descripcion: document.getElementById('ctrlDesc').value,
            estado: document.getElementById('ctrlEstado').value,
            prioridad: document.getElementById('ctrlPrio').value,
            avance: 0,
            madurez: 0,
            responsable: 'Admin'
        };
        controls.push(newCtrl);
        await store.save('controls', controls);
    }

    static getStatusColor(status) {
        switch(status) {
            case 'Implementado': return '#10b981';
            case 'En implementación': return '#3b82f6';
            case 'No iniciado': return '#64748b';
            case 'Cerrado': return '#10b981';
            default: return '#f59e0b';
        }
    }
}

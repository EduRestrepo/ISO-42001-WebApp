import { store, ui } from './core.js';

export class Config {
    static async render() {
        const company = await store.fetch('company') || {};
        const container = document.getElementById('configContainer');
        
        container.innerHTML = `
            <div class="grid grid-2">
                <div class="card">
                    <h3>Perfil de la Organización</h3>
                    <hr style="margin: 16px 0;">
                    <form id="companyForm" class="grid">
                        <div class="form-group">
                            <label>Nombre de la Empresa</label>
                            <input type="text" id="cfgName" value="${company.name || ''}" style="width:100%; padding:8px; margin-top:4px;">
                        </div>
                        <div class="form-group">
                            <label>Proyecto / Programa</label>
                            <input type="text" id="cfgProj" value="${company.project || ''}" style="width:100%; padding:8px; margin-top:4px;">
                        </div>
                        <div class="form-group">
                            <label>Responsable General</label>
                            <input type="text" id="cfgResp" value="${company.responsible || ''}" style="width:100%; padding:8px; margin-top:4px;">
                        </div>
                        <button type="submit" class="btn btn-primary" style="margin-top:16px;">Guardar Cambios</button>
                    </form>
                </div>
                <div class="card">
                    <h3>Metadata del Proyecto</h3>
                    <hr style="margin: 16px 0;">
                    <div class="grid">
                        <div class="form-group">
                            <label>Fecha de Inicio de Seguimiento</label>
                            <input type="date" id="cfgDate" value="${company.startDate || ''}" style="width:100%; padding:8px; margin-top:4px;">
                        </div>
                        <div class="form-group">
                            <label>Observaciones Generales</label>
                            <textarea id="cfgNotes" rows="5" style="width:100%; padding:8px; margin-top:4px;">${company.notes || ''}</textarea>
                        </div>
                    </div>
                </div>
            </div>
        `;

        this.bindEvents();
    }

    static bindEvents() {
        const form = document.getElementById('companyForm');
        if (form) {
            form.onsubmit = async (e) => {
                e.preventDefault();
                const data = {
                    name: document.getElementById('cfgName').value,
                    project: document.getElementById('cfgProj').value,
                    responsible: document.getElementById('cfgResp').value,
                    startDate: document.getElementById('cfgDate').value,
                    notes: document.getElementById('cfgNotes').value
                };
                await store.save('company', data);
                ui.showToast('Configuración guardada', 'success');
            };
        }
    }
}

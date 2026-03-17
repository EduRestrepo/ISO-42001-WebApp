import { store, ui } from './core.js';
import { Dashboard } from './dashboard.js';
import { Controls } from './controls.js';
import { Actions } from './actions.js';

class App {
    constructor() {
        this.currentTab = 'dashboard';
        this.init();
    }

    async init() {
        this.bindEvents();
        await this.loadInitialData();
        this.switchTab('dashboard'); // Initial render
    }

    bindEvents() {
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const tab = item.dataset.tab;
                this.switchTab(tab);
            });
        });
    }

    async switchTab(tabId) {
        // UI Updates
        document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
        const navItem = document.querySelector(`[data-tab="${tabId}"]`);
        if (navItem) navItem.classList.add('active');
        
        document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
        const content = document.getElementById(tabId);
        if (content) content.classList.add('active');
        
        this.currentTab = tabId;
        const titles = {
            dashboard: 'Resumen Ejecutivo',
            controles: 'Gestión de Controles',
            accionables: 'Planes de Mejora',
            participantes: 'Directorio de Proyecto',
            config: 'Configuración Organizacional',
            admin: 'Administración del Sistema'
        };
        ui.setPageTitle(titles[tabId] || 'ISO 42001 Tracker');

        // Module Rendering
        if (tabId === 'dashboard') await Dashboard.render();
        if (tabId === 'controles') await Controls.render();
        if (tabId === 'accionables') await Actions.render();
    }

    async loadInitialData() {
        // Placeholder for real data loading
        console.log('App Initializing...');
    }

    render() {
        ui.showToast('Sistema v1.5B iniciado');
    }
}

new App();

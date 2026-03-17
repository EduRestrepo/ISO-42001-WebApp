/**
 * Store System - API Wrapper
 */
class DataStore {
    async fetch(name) {
        try {
            const resp = await fetch(`/api/data/${name}`);
            return await resp.json();
        } catch (e) {
            console.error(`Error fetching ${name}:`, e);
            return null;
        }
    }

    async save(name, data) {
        try {
            const resp = await fetch(`/api/data/${name}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            return await resp.json();
        } catch (e) {
            console.error(`Error saving ${name}:`, e);
            return { success: false };
        }
    }

    async wipe() {
        if (!confirm('¿ESTÁS SEGURO? Esta acción borrará TODOS los datos permanentemente.')) return;
        const resp = await fetch('/api/data/all', { method: 'DELETE' });
        const result = await resp.json();
        if (result.success) location.reload();
    }
}

export const store = new DataStore();

/**
 * UI Utilities
 */
export const ui = {
    showToast(msg, type = 'info') {
        const container = document.getElementById('toastContainer');
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.textContent = msg;
        container.appendChild(toast);
        setTimeout(() => {
            toast.style.opacity = '0';
            setTimeout(() => toast.remove(), 500);
        }, 4000);
    },
    
    setPageTitle(title) {
        document.getElementById('pageTitle').textContent = title;
    }
};

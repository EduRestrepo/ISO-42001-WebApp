// Role-Based Access Control logic
import { store } from './store.js';

export function getCurrentRole() {
  return store.get('role', 'viewer');
}

export function canEdit() {
  const role = getCurrentRole();
  return ['admin', 'auditor'].includes(role);
}

export function isAdmin() {
  return getCurrentRole() === 'admin';
}

/**
 * Synchronizes the UI visibility and disabled states based on current role.
 */
export function syncUIWithRole() {
  const role = getCurrentRole();
  const editAllowed = canEdit();
  const adminOnly = isAdmin();

  // Highlight current role in UI
  const roleLabel = document.getElementById('currentRole');
  if (roleLabel) roleLabel.textContent = role;

  // Management elements that should be hidden for viewers/auditors
  document.querySelectorAll('[data-role-restricted]').forEach(el => {
    const requiredRole = el.dataset.roleRestricted;
    if (requiredRole === 'admin' && !adminOnly) {
      el.style.display = 'none';
    } else if (requiredRole === 'edit' && !editAllowed) {
      el.style.display = 'none';
    } else {
      el.style.display = ''; // Reset to default
    }
  });

  // Specifically for input groups that should be disabled
  document.querySelectorAll('[data-role-disabled]').forEach(el => {
    if (!editAllowed) {
      el.setAttribute('disabled', 'true');
      el.classList.add('disabled-ui');
    } else {
      el.removeAttribute('disabled');
      el.classList.remove('disabled-ui');
    }
  });
}

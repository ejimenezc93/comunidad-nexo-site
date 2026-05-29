const toggle = document.querySelector('[data-menu-toggle]');
const nav = document.querySelector('[data-nav]');

if (toggle && nav) {
  toggle.addEventListener('click', () => {
    const open = nav.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', String(open));
  });

  nav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      nav.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
    });
  });
}

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.14 });

document.querySelectorAll('.reveal').forEach((element) => observer.observe(element));


const registrationForm = document.querySelector('[data-registration-form]');
const statusEl = document.querySelector('[data-form-status]');
const downloadBtn = document.querySelector('[data-download-registrations]');
const storageKey = 'nexo_demo_registros';

function getRegistrations() {
  try { return JSON.parse(localStorage.getItem(storageKey) || '[]'); }
  catch { return []; }
}

if (registrationForm) {
  registrationForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(registrationForm).entries());
    data.fecha = new Date().toISOString();
    const rows = getRegistrations();
    rows.push(data);
    localStorage.setItem(storageKey, JSON.stringify(rows));
    registrationForm.reset();
    if (statusEl) statusEl.textContent = `Registro guardado para revisión. Total en este navegador: ${rows.length}.`;
  });
}

if (downloadBtn) {
  downloadBtn.addEventListener('click', () => {
    const rows = getRegistrations();
    const headers = ['fecha','nombre','correo','telefono','tipo','interes','mensaje','consentimiento'];
    const escape = (value='') => '"' + String(value).replaceAll('"','""') + '"';
    const csv = [headers.join(','), ...rows.map(row => headers.map(h => escape(row[h] || '')).join(','))].join('\n');
    const blob = new Blob([csv], {type: 'text/csv;charset=utf-8'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'registros-comunidad-nexo-demo.csv';
    a.click();
    URL.revokeObjectURL(url);
    if (statusEl) statusEl.textContent = rows.length ? 'CSV descargado.' : 'No hay registros guardados todavía.';
  });
}


// Faith page modals
const modalTriggers = document.querySelectorAll('[data-modal-target]');
modalTriggers.forEach((trigger) => {
  trigger.addEventListener('click', () => {
    const modal = document.getElementById(trigger.dataset.modalTarget);
    if (modal && typeof modal.showModal === 'function') modal.showModal();
  });
});
document.querySelectorAll('[data-modal-close]').forEach((button) => {
  button.addEventListener('click', () => button.closest('dialog')?.close());
});
document.querySelectorAll('dialog').forEach((dialog) => {
  dialog.addEventListener('click', (event) => {
    if (event.target === dialog) dialog.close();
  });
});

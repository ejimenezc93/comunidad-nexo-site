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


// Calendar generation for Comunidad Nexo
const calendarBoard = document.querySelector('[data-calendar-board]');
const calendarTitle = document.querySelector('[data-calendar-title]');
const calendarPrev = document.querySelector('[data-calendar-prev]');
const calendarNext = document.querySelector('[data-calendar-next]');
const eventDetails = {
  domingo: {
    title: 'Reunión general',
    type: 'general',
    time: '10:00 a.m. a 12:00 m.d.',
    location: 'Hotel Four Points, La Sabana',
    description: 'Adoración, enseñanza bíblica y comunidad. Incluye Nexo Play para bebés hasta 9 años y Play Plus para 10 a 14.',
    contact: 'Equipo de bienvenida'
  },
  vertice: {
    title: 'Grupo Vértice',
    type: 'groups',
    time: '7:00 p.m.',
    location: 'Casa / ubicación por confirmar',
    description: 'Grupo semanal para estudiar la Biblia, orar y caminar juntos en comunidad.',
    contact: 'Facilitador por confirmar'
  },
  youth13: {
    title: 'Jóvenes 13-17',
    type: 'youth',
    time: '5:00 p.m. a 7:00 p.m.',
    location: 'Hotel Four Points, La Sabana',
    description: 'Reunión de jóvenes de 13 a 17 años. Ocurre el primer sábado de cada mes.',
    contact: 'Equipo de jóvenes'
  },
  youth18: {
    title: 'Jóvenes 18-26',
    type: 'youth',
    time: '5:00 p.m. a 7:00 p.m.',
    location: 'Hotel Four Points, La Sabana',
    description: 'Reunión de jóvenes adultos de 18 a 26 años. Ocurre el segundo sábado de cada mes.',
    contact: 'Equipo de jóvenes'
  },
  youthAll: {
    title: 'Jóvenes juntos',
    type: 'youth',
    time: '5:00 p.m. a 7:00 p.m.',
    location: 'Hotel Four Points, La Sabana',
    description: 'Reunión conjunta de jóvenes. Ocurre el cuarto sábado de cada mes.',
    contact: 'Equipo de jóvenes'
  },
  women: {
    title: 'Grupo de mujeres',
    type: 'women',
    time: '10:00 a.m.',
    location: 'Hotel Four Points, La Sabana',
    description: 'Encuentro de mujeres el primer sábado de cada mes.',
    contact: 'Facilitadora por confirmar'
  }
};
function nthWeekdayOfMonth(date) {
  return Math.floor((date.getDate() - 1) / 7) + 1;
}
function eventsForDate(date) {
  const events = [];
  const day = date.getDay();
  const nth = nthWeekdayOfMonth(date);
  if (day === 0) events.push(eventDetails.domingo);
  if (day === 3) events.push(eventDetails.vertice);
  if (day === 6 && nth === 1) events.push(eventDetails.youth13, eventDetails.women);
  if (day === 6 && nth === 2) events.push(eventDetails.youth18);
  if (day === 6 && nth === 4) events.push(eventDetails.youthAll);
  return events;
}
function formatDate(date) {
  return date.toLocaleDateString('es-CR', { weekday: 'long', day: 'numeric', month: 'long' });
}
function mondayFirstIndex(date) {
  return (date.getDay() + 6) % 7;
}
function sameDate(a, b) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}
function openEventModal(event, date) {
  const dialog = document.createElement('dialog');
  dialog.className = 'belief-modal event-modal';
  dialog.innerHTML = `<button class="modal-close" data-modal-close aria-label="Cerrar">×</button><p class="eyebrow">${formatDate(date)} · ${event.time}</p><h2>${event.title}</h2><p>${event.description}</p><p><strong>Lugar:</strong> ${event.location}</p><p><strong>Contacto/facilitador:</strong> ${event.contact || 'Por confirmar'}.</p><a class="btn btn-primary" href="registro.html">Quiero más información</a>`;
  document.body.appendChild(dialog);
  dialog.querySelector('[data-modal-close]').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', (e) => { if (e.target === dialog) dialog.close(); });
  dialog.addEventListener('close', () => dialog.remove());
  dialog.showModal();
}
function renderCalendarMonth(monthDate) {
  if (!calendarBoard) return;
  calendarBoard.innerHTML = '';
  const today = new Date();
  today.setHours(0,0,0,0);
  const year = monthDate.getFullYear();
  const month = monthDate.getMonth();
  if (calendarTitle) {
    const title = monthDate.toLocaleDateString('es-CR', { month: 'long', year: 'numeric' });
    calendarTitle.textContent = title.charAt(0).toUpperCase() + title.slice(1);
  }
  const weekDays = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
  weekDays.forEach((day) => {
    const heading = document.createElement('div');
    heading.className = 'calendar-weekday';
    heading.textContent = day;
    calendarBoard.appendChild(heading);
  });
  const first = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const leading = mondayFirstIndex(first);
  const totalCells = Math.ceil((leading + daysInMonth) / 7) * 7;
  for (let cell = 0; cell < totalCells; cell += 1) {
    const dayNumber = cell - leading + 1;
    const card = document.createElement('article');
    card.className = 'month-day';
    if (dayNumber < 1 || dayNumber > daysInMonth) {
      card.classList.add('is-empty');
      calendarBoard.appendChild(card);
      continue;
    }
    const date = new Date(year, month, dayNumber);
    const dayEvents = eventsForDate(date);
    if (sameDate(date, today)) card.classList.add('today');
    if (dayEvents.length) card.classList.add('has-events');
    card.innerHTML = `<div class="month-day-number">${dayNumber}</div><div class="month-event-stack"></div>`;
    const stack = card.querySelector('.month-event-stack');
    dayEvents.forEach((event) => {
      const button = document.createElement('button');
      button.className = `month-event ${event.type}`;
      button.innerHTML = `<strong>${event.title}</strong><small>${event.time}</small>`;
      button.addEventListener('click', () => openEventModal(event, date));
      stack.appendChild(button);
    });
    calendarBoard.appendChild(card);
  }
}
if (calendarBoard) {
  let activeMonth = new Date();
  activeMonth = new Date(activeMonth.getFullYear(), activeMonth.getMonth(), 1);
  renderCalendarMonth(activeMonth);
  calendarPrev?.addEventListener('click', () => {
    activeMonth = new Date(activeMonth.getFullYear(), activeMonth.getMonth() - 1, 1);
    renderCalendarMonth(activeMonth);
  });
  calendarNext?.addEventListener('click', () => {
    activeMonth = new Date(activeMonth.getFullYear(), activeMonth.getMonth() + 1, 1);
    renderCalendarMonth(activeMonth);
  });
}

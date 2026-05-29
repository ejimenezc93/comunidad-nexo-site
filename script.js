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
  youth13: {
    title: 'RED · Jóvenes 13-17',
    type: 'youth',
    time: '5:00 p.m. a 7:00 p.m.',
    location: 'Hotel Four Points, La Sabana',
    description: 'RED es el espacio de jóvenes de Comunidad Nexo. Esta reunión es para jóvenes de 13 a 17 años y ocurre el primer sábado de cada mes.',
    contact: 'Daniel Arceyut y Andrés Monghalo'
  },
  youth18: {
    title: 'RED · Jóvenes 18-26',
    type: 'youth',
    time: '5:00 p.m. a 7:00 p.m.',
    location: 'Hotel Four Points, La Sabana',
    description: 'RED es el espacio de jóvenes de Comunidad Nexo. Esta reunión es para jóvenes adultos de 18 a 26 años y ocurre el segundo sábado de cada mes.',
    contact: 'Daniel Arceyut y Andrés Monghalo'
  },
  youthAll: {
    title: 'RED · Jóvenes juntos',
    type: 'youth',
    time: '5:00 p.m. a 7:00 p.m.',
    location: 'Hotel Four Points, La Sabana',
    description: 'RED es el espacio de jóvenes de Comunidad Nexo. El cuarto sábado se reúnen todos juntos.',
    contact: 'Daniel Arceyut y Andrés Monghalo'
  },
  women: {
    title: 'Grupo de mujeres',
    type: 'women',
    time: '10:00 a.m.',
    location: 'Hotel Four Points, La Sabana',
    description: 'Encuentro de mujeres el primer sábado de cada mes.',
    contact: 'Rebeca Guzman'
  }
};
const verticeGroups = [
  { no: 1, facilitator: 'Valeria Ramírez', day: 5, time: '7:30 p.m.', study: 'La vida de Jesús', focus: 'Mujeres', modality: 'Virtual', registration: 'Abierto', cadence: 'weekly' },
  { no: 2, facilitator: 'Andy Monghalo', day: 2, time: '8:00 p.m.', study: 'Mixto', focus: 'Hombres - Jóvenes', modality: 'Presencial', registration: 'Cerrado', cadence: 'weekly' },
  { no: 3, facilitator: 'Cinthya F.', day: 5, time: '7:00 p.m.', study: 'La vida de Jesús', focus: 'Mujeres', modality: 'Presencial', registration: 'Abierto', cadence: 'weekly' },
  { no: 4, facilitator: 'Diego Araya', day: 3, time: '7:00 p.m.', study: 'La vida de Jesús', focus: 'General', modality: 'Virtual', registration: 'Abierto', cadence: 'weekly' },
  { no: 5, facilitator: 'Naty Fuentes', day: 5, time: '1:00 p.m. (FT-Texas)', study: 'La vida de Jesús', focus: 'Mujeres', modality: 'Presencial', registration: 'Cerrado', cadence: 'weekly' },
  { no: 6, facilitator: 'Esteban Jiménez', day: 3, time: '6:30 p.m.', study: 'Expositiva - Romanos', focus: 'General', modality: 'Mixto', registration: 'Abierto', cadence: 'weekly' },
  { no: 7, facilitator: 'Vale Ballestero', day: 2, time: '7:00 p.m.', study: 'La vida de Jesús', focus: 'Mujeres - Jóvenes', modality: 'Presencial', registration: 'Abierto', cadence: 'biweekly-a' },
  { no: 8, facilitator: 'Rebeca Guzman', day: 3, time: '7:30 p.m.', study: 'La vida de Jesús', focus: 'Mujeres', modality: 'Virtual', registration: 'Abierto', cadence: 'weekly' },
  { no: 9, facilitator: 'Daniel Arceyut', day: 2, time: '7:00 p.m.', study: 'Expositiva - Gálatas', focus: 'Hombres - Jóvenes', modality: 'Mixta', registration: 'Abierto', cadence: 'biweekly-b' },
  { no: 10, facilitator: 'Erendira Rodríguez', day: 3, time: '6:00 p.m.', study: 'La vida de Jesús', focus: 'General', modality: 'Virtual', registration: 'Abierto', cadence: 'weekly' }
];
function nthWeekdayOfMonth(date) {
  return Math.floor((date.getDate() - 1) / 7) + 1;
}
function shouldShowVertice(group, date) {
  if (date.getDay() !== group.day) return false;
  if (group.cadence === 'weekly') return true;
  const nth = nthWeekdayOfMonth(date);
  if (group.cadence === 'biweekly-a') return nth === 1 || nth === 3 || nth === 5;
  if (group.cadence === 'biweekly-b') return nth === 2 || nth === 4;
  return true;
}
function verticeToEvent(group) {
  return {
    title: `Vértice · ${group.facilitator}`,
    type: group.registration === 'Cerrado' ? 'groups closed' : 'groups',
    time: group.time,
    location: group.modality === 'Virtual' ? 'Virtual' : group.modality === 'Presencial' ? 'Presencial' : 'Mixto',
    description: `${group.study}. Foco: ${group.focus}. Modalidad: ${group.modality}. Inscripción: ${group.registration}.`,
    contact: group.facilitator,
    study: group.study,
    focus: group.focus,
    modality: group.modality,
    registration: group.registration,
    cadence: group.cadence === 'weekly' ? 'Semanal' : 'Cada 15 días'
  };
}
function eventsForDate(date) {
  const events = [];
  const day = date.getDay();
  const nth = nthWeekdayOfMonth(date);
  verticeGroups.filter((group) => shouldShowVertice(group, date)).forEach((group) => events.push(verticeToEvent(group)));
  if (day === 0) events.push(eventDetails.domingo);
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
  const meta = event.study ? `<div class="event-meta-grid"><p><strong>Estudio</strong>${event.study}</p><p><strong>Foco</strong>${event.focus}</p><p><strong>Modalidad</strong>${event.modality}</p><p><strong>Inscripción</strong>${event.registration}</p><p><strong>Frecuencia</strong>${event.cadence}</p></div>` : '';
  dialog.innerHTML = `<button class="modal-close" data-modal-close aria-label="Cerrar">×</button><p class="eyebrow">${formatDate(date)} · ${event.time}</p><h2>${event.title}</h2><p>${event.description}</p>${meta}<p><strong>Lugar/modalidad:</strong> ${event.location}</p><p><strong>Contacto/facilitador:</strong> ${event.contact || 'Por confirmar'}.</p><a class="btn btn-primary" href="registro.html">Quiero más información</a>`;
  document.body.appendChild(dialog);
  dialog.querySelector('[data-modal-close]').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', (e) => { if (e.target === dialog) dialog.close(); });
  dialog.addEventListener('close', () => dialog.remove());
  dialog.showModal();
}
function openDayModal(date, events) {
  const dialog = document.createElement('dialog');
  dialog.className = 'belief-modal event-modal day-events-modal';
  const items = events.map((event) => {
    const closed = event.registration === 'Cerrado' ? '<span class="day-event-status closed">Cerrado</span>' : event.registration ? '<span class="day-event-status open">Abierto</span>' : '';
    return `<button class="day-event-row ${event.type}" type="button"><strong>${event.title.replace('Vértice · ', '')}</strong><span>${event.time}</span>${closed}<em>${event.study || event.description}</em></button>`;
  }).join('');
  dialog.innerHTML = `<button class="modal-close" data-modal-close aria-label="Cerrar">×</button><p class="eyebrow">${formatDate(date)}</p><h2>Actividades del día</h2><div class="day-event-list">${items}</div><p class="day-modal-hint">Seleccioná una actividad para ver más información.</p>`;
  document.body.appendChild(dialog);
  dialog.querySelector('[data-modal-close]').addEventListener('click', () => dialog.close());
  dialog.querySelectorAll('.day-event-row').forEach((button, index) => {
    button.addEventListener('click', () => {
      dialog.close();
      openEventModal(events[index], date);
    });
  });
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
    const visibleEvents = dayEvents.slice(0, 3);
    visibleEvents.forEach((event) => {
      const button = document.createElement('button');
      button.className = `month-event ${event.type}`;
      const label = event.title.replace('Vértice · ', '');
      button.innerHTML = `<strong>${label}</strong><small>${event.time}</small>`;
      button.addEventListener('click', () => openEventModal(event, date));
      stack.appendChild(button);
    });
    if (dayEvents.length > visibleEvents.length) {
      const more = document.createElement('button');
      more.className = 'month-event-more';
      more.textContent = `+${dayEvents.length - visibleEvents.length} más`;
      more.addEventListener('click', () => openDayModal(date, dayEvents));
      stack.appendChild(more);
    }
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

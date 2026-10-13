/**
 * Studio44 - Main Application Logic
 * Verwaltet UI-Rendering, interaktiven Buchungs-Flow, Lightbox, Personas,
 * Live-Status, Termine-Management & Toasts.
 */

(function () {
  'use strict';

  // Zugriff auf Konfiguration und State
  const CONFIG = window.STUDIO44_CONFIG;
  const STATE = window.studio44State;

  if (!CONFIG || !STATE) {
    console.error('Studio44: CONFIG oder STATE nicht gefunden.');
    return;
  }

  /* ==========================================================================
     GLOBAL APP STATE & DRAFT
     ========================================================================== */
  const appDraft = {
    step: 1,
    selectedServiceIds: ['haircut'], // Default Haarschnitt vorausgewählt für schnellen Start
    selectedBarberId: 'any',
    selectedDate: null,
    selectedTime: null,
    customer: {
      name: '',
      phone: '',
      email: '',
      notes: ''
    }
  };

  // Temporärer State für Reschedule & Cancel Modals
  let activeRescheduleAppointment = null;
  let activeCancelAppointmentId = null;
  let rescheduleSelectedDate = null;
  let rescheduleSelectedTime = null;

  // State für Galerie Lightbox
  let currentLightboxIndex = 0;
  let currentGalleryItems = [...CONFIG.gallery];

  /* ==========================================================================
     DOM ELEMENTS
     ========================================================================== */
  const dom = {
    // Header & Badges
    headerAppointmentsBtn: document.getElementById('headerAppointmentsBtn'),
    headerAppointmentsCount: document.getElementById('headerAppointmentsCount'),
    mobileNavBadgeCount: document.getElementById('mobileNavBadgeCount'),
    heroLiveStatusPill: document.getElementById('heroLiveStatusPill'),
    
    // Services
    servicesListContainer: document.getElementById('servicesListContainer'),
    
    // Booking Flow
    wizardProgressFill: document.getElementById('wizardProgressFill'),
    stepperItems: document.querySelectorAll('.stepper-step-item'),
    wizardSteps: {
      1: document.getElementById('step1'),
      2: document.getElementById('step2'),
      3: document.getElementById('step3'),
      4: document.getElementById('step4'),
      5: document.getElementById('step5'),
      success: document.getElementById('stepSuccess')
    },
    stepServicesGrid: document.getElementById('stepServicesGrid'),
    stepBarbersGrid: document.getElementById('stepBarbersGrid'),
    daysSlider: document.getElementById('daysSlider'),
    timeSlotsGrid: document.getElementById('timeSlotsGrid'),
    slotsHeadlineLabel: document.getElementById('slotsHeadlineLabel'),
    contactForm: document.getElementById('contactForm'),
    custName: document.getElementById('custName'),
    custPhone: document.getElementById('custPhone'),
    custEmail: document.getElementById('custEmail'),
    custNotes: document.getElementById('custNotes'),
    custNameError: document.getElementById('custNameError'),
    custPhoneError: document.getElementById('custPhoneError'),
    summaryDetailsCard: document.getElementById('summaryDetailsCard'),
    summaryTotalBoxPrice: document.getElementById('summaryTotalBoxPrice'),
    summaryTotalBoxDuration: document.getElementById('summaryTotalBoxDuration'),
    livePriceDisplay: document.getElementById('livePriceDisplay'),
    liveDurationDisplay: document.getElementById('liveDurationDisplay'),
    wizardPrevBtn: document.getElementById('wizardPrevBtn'),
    wizardNextBtn: document.getElementById('wizardNextBtn'),
    wizardBottomBar: document.getElementById('wizardBottomBar'),
    successBookingCode: document.getElementById('successBookingCode'),
    successAppointmentSummaryText: document.getElementById('successAppointmentSummaryText'),
    successViewAppointmentsBtn: document.getElementById('successViewAppointmentsBtn'),
    successBookAnotherBtn: document.getElementById('successBookAnotherBtn'),

    // Team
    teamContainer: document.getElementById('teamContainer'),
    
    // Galerie
    galleryFilterTabs: document.getElementById('galleryFilterTabs'),
    galleryGrid: document.getElementById('galleryGrid'),
    lightboxModal: document.getElementById('lightboxModal'),
    lightboxMainImg: document.getElementById('lightboxMainImg'),
    lightboxTitle: document.getElementById('lightboxTitle'),
    lightboxDesc: document.getElementById('lightboxDesc'),
    lightboxCloseBtn: document.getElementById('lightboxCloseBtn'),
    lightboxPrevBtn: document.getElementById('lightboxPrevBtn'),
    lightboxNextBtn: document.getElementById('lightboxNextBtn'),

    // Reviews
    reviewsContainer: document.getElementById('reviewsContainer'),

    // Personas
    personaTabsNav: document.getElementById('personaTabsNav'),
    personaPanesContainer: document.getElementById('personaPanesContainer'),

    // Opening Hours & Location
    liveStatusBox: document.getElementById('liveStatusBox'),
    liveStatusText: document.getElementById('liveStatusText'),
    liveStatusSubtext: document.getElementById('liveStatusSubtext'),
    openingHoursTable: document.getElementById('openingHoursTable'),

    // Appointments Management
    tabUpcoming: document.getElementById('tabUpcoming'),
    tabPast: document.getElementById('tabPast'),
    upcomingBadgeCount: document.getElementById('upcomingBadgeCount'),
    pastBadgeCount: document.getElementById('pastBadgeCount'),
    appointmentsListContainer: document.getElementById('appointmentsListContainer'),
    rescheduleModal: document.getElementById('rescheduleModal'),
    rescheduleCloseBtn: document.getElementById('rescheduleCloseBtn'),
    rescheduleAppointmentInfoText: document.getElementById('rescheduleAppointmentInfoText'),
    rescheduleDaysSlider: document.getElementById('rescheduleDaysSlider'),
    rescheduleSlotsGrid: document.getElementById('rescheduleSlotsGrid'),
    rescheduleCancelActionBtn: document.getElementById('rescheduleCancelActionBtn'),
    rescheduleConfirmActionBtn: document.getElementById('rescheduleConfirmActionBtn'),
    cancelConfirmModal: document.getElementById('cancelConfirmModal'),
    cancelModalDetailsText: document.getElementById('cancelModalDetailsText'),
    cancelModalBackBtn: document.getElementById('cancelModalBackBtn'),
    cancelModalConfirmBtn: document.getElementById('cancelModalConfirmBtn'),

    // Barber Modal
    barberDetailModal: document.getElementById('barberDetailModal'),
    barberModalCloseBtn: document.getElementById('barberModalCloseBtn'),
    barberModalCover: document.getElementById('barberModalCover'),
    barberModalRole: document.getElementById('barberModalRole'),
    barberModalName: document.getElementById('barberModalName'),
    barberModalRating: document.getElementById('barberModalRating'),
    barberModalReviews: document.getElementById('barberModalReviews'),
    barberModalBio: document.getElementById('barberModalBio'),
    barberModalSpecialization: document.getElementById('barberModalSpecialization'),
    barberModalCutsGrid: document.getElementById('barberModalCutsGrid'),
    barberModalBookBtn: document.getElementById('barberModalBookBtn'),

    // Toasts
    toastContainer: document.getElementById('toastContainer')
  };

  /* ==========================================================================
     TOAST NOTIFICATION ENGINE
     ========================================================================== */
  function showToast(message, type = 'success', duration = 3500) {
    const toast = document.createElement('div');
    toast.className = `toast ${type === 'error' ? 'toast-error' : type === 'warning' ? 'toast-warning' : ''}`;

    let iconSvg = `
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" class="toast-icon">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
        <polyline points="22 4 12 14.01 9 11.01"></polyline>
      </svg>
    `;

    if (type === 'error') {
      iconSvg = `
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" class="toast-icon">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="15" y1="9" x2="9" y2="15"></line>
          <line x1="9" y1="9" x2="15" y2="15"></line>
        </svg>
      `;
    } else if (type === 'warning') {
      iconSvg = `
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" class="toast-icon">
          <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
          <line x1="12" y1="9" x2="12" y2="13"></line>
          <line x1="12" y1="17" x2="12.01" y2="17"></line>
        </svg>
      `;
    }

    toast.innerHTML = `
      ${iconSvg}
      <div class="toast-message">${message}</div>
    `;

    dom.toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.classList.add('toast-hide');
      setTimeout(() => toast.remove(), 300);
    }, duration);
  }

  /* ==========================================================================
     DATE & TIME HELPER UTILITIES
     ========================================================================== */
  function formatDateIso(dateObj) {
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const day = String(dateObj.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  function formatGermanDate(isoStr) {
    if (!isoStr) return '';
    const [year, month, day] = isoStr.split('-').map(Number);
    const dateObj = new Date(year, month - 1, day);
    const weekdays = ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'];
    const months = ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'];
    return `${weekdays[dateObj.getDay()]}, ${day}. ${months[dateObj.getMonth()]} ${year}`;
  }

  // Generiert 14 Tage ab heute (Sonntage sind gesperrt)
  function getUpcomingDaysList(numDays = 14) {
    const list = [];
    const today = new Date();
    const dayNamesShort = ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'];
    const monthNamesShort = ['Jan', 'Feb', 'Mär', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez'];

    for (let i = 0; i < numDays; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      const iso = formatDateIso(d);
      const isSunday = d.getDay() === 0;

      list.push({
        dateObj: d,
        iso: iso,
        dayName: i === 0 ? 'Heute' : i === 1 ? 'Morgen' : dayNamesShort[d.getDay()],
        dayNum: d.getDate(),
        monthName: monthNamesShort[d.getMonth()],
        isClosed: isSunday
      });
    }
    return list;
  }

  // Generiert alle 30-Minuten Slots für einen Tag
  function generateSlotsForDay(isoDateStr) {
    const [year, month, day] = isoDateStr.split('-').map(Number);
    const dateObj = new Date(year, month - 1, day);
    const dayIndex = dateObj.getDay();

    const configDay = CONFIG.shop.openingHours.find(h => h.day === dayIndex);
    if (!configDay || configDay.closed || !configDay.open) {
      return [];
    }

    const [startH, startM] = configDay.open.split(':').map(Number);
    const [endH, endM] = configDay.close.split(':').map(Number);

    const slots = [];
    let currentTotalMin = startH * 60 + startM;
    const endTotalMin = endH * 60 + endM;

    while (currentTotalMin + CONFIG.shop.timeSlotIntervalMinutes <= endTotalMin) {
      const h = Math.floor(currentTotalMin / 60);
      const m = currentTotalMin % 60;
      slots.push(`${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`);
      currentTotalMin += CONFIG.shop.timeSlotIntervalMinutes;
    }

    return slots;
  }

  /* ==========================================================================
     LIVE SHOP STATUS & OPENING HOURS RENDERER
     ========================================================================== */
  function updateLiveShopStatus() {
    const now = new Date();
    const currentDay = now.getDay();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();

    const todayConfig = CONFIG.shop.openingHours.find(d => d.day === currentDay);
    let isOpen = false;
    let statusText = '';
    let subtext = '';

    if (todayConfig && !todayConfig.closed && todayConfig.open && todayConfig.close) {
      const [openH, openM] = todayConfig.open.split(':').map(Number);
      const [closeH, closeM] = todayConfig.close.split(':').map(Number);
      const openMinutes = openH * 60 + openM;
      const closeMinutes = closeH * 60 + closeM;

      if (currentMinutes >= openMinutes && currentMinutes < closeMinutes) {
        isOpen = true;
        statusText = 'Jetzt geöffnet';
        subtext = `Heute geöffnet bis ${todayConfig.close} Uhr`;
      } else if (currentMinutes < openMinutes) {
        statusText = 'Geschlossen';
        subtext = `Öffnet heute um ${todayConfig.open} Uhr`;
      } else {
        statusText = 'Geschlossen';
        subtext = 'Morgen ab 10:00 Uhr wieder für dich da';
      }
    } else {
      statusText = 'Sonntags geschlossen';
      subtext = 'Montag ab 10:00 Uhr wieder geöffnet';
    }

    // UI Elemente aktualisieren
    if (dom.liveStatusBox) {
      dom.liveStatusBox.className = `status-live-tag ${isOpen ? 'open' : 'closed'}`;
      dom.liveStatusText.textContent = statusText;
      dom.liveStatusSubtext.textContent = subtext;
    }

    if (dom.heroLiveStatusPill) {
      dom.heroLiveStatusPill.textContent = isOpen 
        ? `Live geöffnet • Jetzt Cut buchen` 
        : `Online 24/7 buchbar • ${subtext}`;
    }

    // Öffnungszeiten-Tabelle rendern
    if (dom.openingHoursTable) {
      dom.openingHoursTable.innerHTML = CONFIG.shop.openingHours.map(item => {
        const isToday = item.day === currentDay;
        const timeDisplay = item.closed ? 'Geschlossen' : `${item.open} – ${item.close} Uhr`;
        return `
          <tr class="hours-row ${isToday ? 'is-today' : ''}">
            <td style="font-weight: ${isToday ? '700' : '500'};">
              ${item.name} ${isToday ? '<span style="font-size: 11px; background: var(--accent-lime); color: #000; padding: 1px 6px; border-radius: 99px; margin-left: 6px;">Heute</span>' : ''}
            </td>
            <td style="text-align: right; color: ${isToday ? 'var(--accent-lime)' : item.closed ? '#777' : '#ddd'};">
              ${timeDisplay}
            </td>
          </tr>
        `;
      }).join('');
    }
  }

  /* ==========================================================================
     SERVICES PREVIEW SECTION
     ========================================================================== */
  function renderServicesSection() {
    if (!dom.servicesListContainer) return;

    dom.servicesListContainer.innerHTML = CONFIG.services.map(svc => `
      <div class="service-card" data-service-id="${svc.id}">
        <div class="service-card-media">
          <img src="${svc.image}" alt="${svc.title}" class="service-card-img" loading="lazy">
          <div class="service-media-overlay"></div>
          <span class="service-badge">${svc.badge}</span>
        </div>
        <div class="service-card-body">
          <div class="service-card-header">
            <h3 class="service-card-title">${svc.title}</h3>
            <span class="service-price-tag">${svc.price} €</span>
          </div>
          <div class="service-meta-row">
            <span class="service-duration-badge">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12 6 12 12 16 14"></polyline>
              </svg>
              ${svc.duration} Minuten
            </span>
          </div>
          <p class="service-card-desc">${svc.description}</p>
          <ul class="service-features-list">
            ${svc.features.map(f => `
              <li class="service-feature-item">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                ${f}
              </li>
            `).join('')}
          </ul>
          <button class="btn btn-primary btn-block select-service-cta-btn" data-id="${svc.id}">
            Diesen Cut wählen
          </button>
        </div>
      </div>
    `).join('');

    // Event Listener für "Diesen Cut wählen" Buttons
    dom.servicesListContainer.querySelectorAll('.select-service-cta-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const svcId = e.currentTarget.getAttribute('data-id');
        appDraft.selectedServiceIds = [svcId];
        renderBookingStep1();
        updateLiveCalculation();
        goToWizardStep(2);
        document.getElementById('booking').scrollIntoView({ behavior: 'smooth' });
        showToast('Service ausgewählt. Wähle jetzt deinen Barber!', 'success');
      });
    });
  }

  /* ==========================================================================
     INTERACTIVE BOOKING WIZARD
     ========================================================================== */

  // Berechnet Gesamtpreis und Gesamtdauer live
  function calculateDraftTotals() {
    let totalPrice = 0;
    let totalDuration = 0;
    const selectedServices = CONFIG.services.filter(s => appDraft.selectedServiceIds.includes(s.id));
    
    selectedServices.forEach(s => {
      totalPrice += s.price;
      totalDuration += s.duration;
    });

    return { totalPrice, totalDuration, selectedServices };
  }

  // Aktualisiert die Anzeige im Sticky Bottom Bar und in den Zusammenfassungen
  function updateLiveCalculation() {
    const { totalPrice, totalDuration } = calculateDraftTotals();
    
    if (dom.livePriceDisplay) {
      dom.livePriceDisplay.textContent = `${totalPrice} €`;
    }
    if (dom.liveDurationDisplay) {
      dom.liveDurationDisplay.querySelector('span').textContent = `${totalDuration} Min`;
    }
    if (dom.summaryTotalBoxPrice) {
      dom.summaryTotalBoxPrice.textContent = `${totalPrice} €`;
    }
    if (dom.summaryTotalBoxDuration) {
      dom.summaryTotalBoxDuration.textContent = `Gesamtdauer: ca. ${totalDuration} Min`;
    }
  }

  // Rendert Schritt 1: Mehrfachauswahl der Services
  function renderBookingStep1() {
    if (!dom.stepServicesGrid) return;

    dom.stepServicesGrid.innerHTML = CONFIG.services.map(svc => {
      const isSelected = appDraft.selectedServiceIds.includes(svc.id);
      return `
        <div class="service-select-item ${isSelected ? 'selected' : ''}" data-svc-id="${svc.id}">
          <div class="service-select-top">
            <span class="service-badge" style="position: static; font-size: 10px;">${svc.badge}</span>
            <div class="service-checkbox">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </div>
          </div>
          <div class="service-select-info">
            <h4>${svc.title}</h4>
            <div style="display: flex; justify-content: space-between; align-items: baseline; margin-top: 8px;">
              <span class="service-select-price">${svc.price} €</span>
              <span class="service-select-time">${svc.duration} Min</span>
            </div>
          </div>
        </div>
      `;
    }).join('');

    // Click Handler für Mehrfachauswahl
    dom.stepServicesGrid.querySelectorAll('.service-select-item').forEach(card => {
      card.addEventListener('click', () => {
        const id = card.getAttribute('data-svc-id');
        const index = appDraft.selectedServiceIds.indexOf(id);
        if (index > -1) {
          // Mindestens ein Service muss ausgewählt bleiben
          if (appDraft.selectedServiceIds.length > 1) {
            appDraft.selectedServiceIds.splice(index, 1);
          } else {
            showToast('Mindestens ein Service muss ausgewählt sein.', 'warning');
            return;
          }
        } else {
          appDraft.selectedServiceIds.push(id);
        }
        renderBookingStep1();
        updateLiveCalculation();
      });
    });
  }

  // Rendert Schritt 2: Barber Auswahl
  function renderBookingStep2() {
    if (!dom.stepBarbersGrid) return;

    // Option 1: Egal / Erster Freier
    const isAnySelected = appDraft.selectedBarberId === 'any';
    let html = `
      <div class="barber-select-card any-barber ${isAnySelected ? 'selected' : ''}" data-barber-id="any">
        <div class="any-barber-icon">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
            <circle cx="9" cy="7" r="4"></circle>
            <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
            <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
          </svg>
        </div>
        <span class="barber-select-name">Erster Freier</span>
        <span class="barber-select-role">Schnellster Termin</span>
      </div>
    `;

    // Barbers aus CONFIG
    CONFIG.barbers.forEach(b => {
      const isSelected = appDraft.selectedBarberId === b.id;
      html += `
        <div class="barber-select-card ${isSelected ? 'selected' : ''}" data-barber-id="${b.id}">
          <div class="barber-avatar-wrap">
            <img src="${b.avatar}" alt="${b.name}" class="barber-avatar-img">
          </div>
          <span class="barber-select-name">${b.name}</span>
          <span class="barber-select-role">${b.role.split('&')[0]}</span>
          <span style="font-size: 11px; color: var(--accent-lime); margin-top: 4px; font-weight: 700;">★ ${b.rating}</span>
        </div>
      `;
    });

    dom.stepBarbersGrid.innerHTML = html;

    dom.stepBarbersGrid.querySelectorAll('.barber-select-card').forEach(card => {
      card.addEventListener('click', () => {
        appDraft.selectedBarberId = card.getAttribute('data-barber-id');
        renderBookingStep2();
        // Slots in Step 3 aktualisieren, falls Datum bereits gesetzt
        if (appDraft.selectedDate) {
          renderTimeSlotsForSelectedDate(appDraft.selectedDate);
        }
      });
    });
  }

  // Rendert Schritt 3: Tage & Zeitslots
  function renderBookingStep3() {
    if (!dom.daysSlider) return;

    const days = getUpcomingDaysList(14);

    // Default Datum auswählen (erster geöffneter Tag, falls noch keiner gewählt)
    if (!appDraft.selectedDate) {
      const firstAvailable = days.find(d => !d.isClosed);
      if (firstAvailable) {
        appDraft.selectedDate = firstAvailable.iso;
      }
    }

    // Days Slider rendern
    dom.daysSlider.innerHTML = days.map(d => {
      const isSelected = appDraft.selectedDate === d.iso;
      return `
        <button type="button" class="day-pick-btn ${isSelected ? 'selected' : ''}" 
                data-iso="${d.iso}" 
                ${d.isClosed ? 'disabled title="Sonntags geschlossen"' : ''}>
          <span class="day-name">${d.dayName}</span>
          <span class="day-num">${d.dayNum}</span>
          <span class="day-month">${d.monthName}</span>
        </button>
      `;
    }).join('');

    dom.daysSlider.querySelectorAll('.day-pick-btn:not(:disabled)').forEach(btn => {
      btn.addEventListener('click', () => {
        appDraft.selectedDate = btn.getAttribute('data-iso');
        appDraft.selectedTime = null; // Zurücksetzen bei Datumswechsel
        renderBookingStep3();
      });
    });

    // Slots für ausgewähltes Datum rendern
    renderTimeSlotsForSelectedDate(appDraft.selectedDate);
  }

  function renderTimeSlotsForSelectedDate(isoDateStr) {
    if (!dom.timeSlotsGrid || !isoDateStr) return;

    const slots = generateSlotsForDay(isoDateStr);
    const bookedTimes = STATE.getBookedTimes(isoDateStr, appDraft.selectedBarberId);

    const barberName = appDraft.selectedBarberId === 'any' 
      ? 'allen Barbern' 
      : CONFIG.barbers.find(b => b.id === appDraft.selectedBarberId)?.name || 'Barber';

    dom.slotsHeadlineLabel.textContent = `Verfügbare Slots für ${formatGermanDate(isoDateStr)} bei ${barberName}:`;

    if (slots.length === 0) {
      dom.timeSlotsGrid.innerHTML = `
        <div style="grid-column: 1 / -1; padding: 20px; text-align: center; color: #888;">
          An diesem Tag hat Studio44 geschlossen. Bitte wähle ein anderes Datum.
        </div>
      `;
      return;
    }

    dom.timeSlotsGrid.innerHTML = slots.map(slotTime => {
      const isBooked = bookedTimes.includes(slotTime);
      const isSelected = appDraft.selectedTime === slotTime;
      const tooltip = isBooked ? 'Bereits gebucht / belegt' : 'Freier Termin';

      return `
        <button type="button" class="time-slot-btn ${isSelected ? 'selected' : ''}" 
                data-time="${slotTime}" 
                ${isBooked ? `disabled title="${tooltip}"` : `title="${tooltip}"`}>
          ${slotTime}
        </button>
      `;
    }).join('');

    dom.timeSlotsGrid.querySelectorAll('.time-slot-btn:not(:disabled)').forEach(btn => {
      btn.addEventListener('click', () => {
        appDraft.selectedTime = btn.getAttribute('data-time');
        renderTimeSlotsForSelectedDate(isoDateStr);
      });
    });
  }

  // Validiert Kontaktdaten in Schritt 4
  function validateStep4() {
    let isValid = true;
    const nameVal = dom.custName.value.trim();
    const phoneVal = dom.custPhone.value.trim();

    // Name Validierung
    if (!nameVal || nameVal.length < 2) {
      dom.custName.classList.add('error');
      dom.custNameError.style.color = '#ef4444';
      dom.custNameError.textContent = 'Bitte gib deinen Vornamen und Nachnamen ein.';
      isValid = false;
    } else {
      dom.custName.classList.remove('error');
      dom.custNameError.style.color = 'var(--text-muted)';
      dom.custNameError.textContent = 'Name erfasst.';
    }

    // Telefon Validierung (mindestens 6 Ziffern, gängige Zeichen)
    const phoneRegex = /^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]{5,15}$/;
    if (!phoneVal || !phoneRegex.test(phoneVal.replace(/\s+/g, ''))) {
      dom.custPhone.classList.add('error');
      dom.custPhoneError.style.color = '#ef4444';
      dom.custPhoneError.textContent = 'Bitte gib eine gültige Handynummer ein (z. B. 0676 1234567 oder +43...).';
      isValid = false;
    } else {
      dom.custPhone.classList.remove('error');
      dom.custPhoneError.style.color = 'var(--text-muted)';
      dom.custPhoneError.textContent = 'Gültige Mobilfunknummer.';
    }

    if (isValid) {
      appDraft.customer.name = nameVal;
      appDraft.customer.phone = phoneVal;
      appDraft.customer.email = dom.custEmail.value.trim();
      appDraft.customer.notes = dom.custNotes.value.trim();
    }

    return isValid;
  }

  // Rendert Schritt 5: Zusammenfassung & Check
  function renderBookingStep5() {
    if (!dom.summaryDetailsCard) return;

    const { totalPrice, totalDuration, selectedServices } = calculateDraftTotals();
    const barberObj = CONFIG.barbers.find(b => b.id === appDraft.selectedBarberId);
    let barberDisplayName = barberObj ? `${barberObj.name} (${barberObj.role.split('&')[0]})` : 'Egal / Erster freier Barber';

    if (appDraft.selectedBarberId === 'any' && appDraft.selectedDate && appDraft.selectedTime) {
      const bookedBarberIds = STATE.getAll()
        .filter(a => a.status === 'confirmed' && a.date === appDraft.selectedDate && a.time === appDraft.selectedTime)
        .map(a => a.barberId);
      const availableBarber = CONFIG.barbers.find(b => !bookedBarberIds.includes(b.id)) || CONFIG.barbers[0];
      barberDisplayName = `${availableBarber.name} (Schnellster freier Barber für deinen Slot)`;
    }

    dom.summaryDetailsCard.innerHTML = `
      <div class="summary-row">
        <span class="summary-label">Ausgewählte Services:</span>
        <span class="summary-val">
          ${selectedServices.map(s => `${s.title} (${s.price} €)`).join('<br>')}
        </span>
      </div>

      <div class="summary-row">
        <span class="summary-label">Zugewiesener Barber:</span>
        <span class="summary-val" style="color: var(--accent-lime);">${barberDisplayName}</span>
      </div>

      <div class="summary-row">
        <span class="summary-label">Datum & Uhrzeit:</span>
        <span class="summary-val">${formatGermanDate(appDraft.selectedDate)} um ${appDraft.selectedTime} Uhr</span>
      </div>

      <div class="summary-row">
        <span class="summary-label">Gesamtdauer:</span>
        <span class="summary-val">ca. ${totalDuration} Minuten</span>
      </div>

      <div class="summary-row">
        <span class="summary-label">Kunde:</span>
        <span class="summary-val">${appDraft.customer.name} • ${appDraft.customer.phone}</span>
      </div>

      ${appDraft.customer.email ? `
        <div class="summary-row">
          <span class="summary-label">E-Mail:</span>
          <span class="summary-val">${appDraft.customer.email}</span>
        </div>
      ` : ''}

      ${appDraft.customer.notes ? `
        <div class="summary-row">
          <span class="summary-label">Notiz:</span>
          <span class="summary-val" style="font-style: italic; font-weight: normal;">„${appDraft.customer.notes}“</span>
        </div>
      ` : ''}
    `;
  }

  // Wizard Navigation zwischen den Schritten
  function goToWizardStep(stepNumber) {
    appDraft.step = stepNumber;

    // Verstecke alle Steps
    Object.values(dom.wizardSteps).forEach(el => {
      if (el) el.classList.remove('active');
    });

    if (stepNumber === 'success') {
      dom.wizardSteps.success.classList.add('active');
      dom.wizardBottomBar.style.display = 'none';
      dom.wizardProgressFill.style.width = '100%';
      return;
    }

    // Aktiven Step anzeigen
    dom.wizardSteps[stepNumber].classList.add('active');
    dom.wizardBottomBar.style.display = 'flex';

    // Stepper Indicators anpassen
    dom.stepperItems.forEach(item => {
      const stepIdx = parseInt(item.getAttribute('data-step'), 10);
      item.classList.remove('active', 'completed');
      if (stepIdx === stepNumber) {
        item.classList.add('active');
      } else if (stepIdx < stepNumber) {
        item.classList.add('completed');
      }
    });

    // Progress bar fill width
    dom.wizardProgressFill.style.width = `${stepNumber * 20}%`;

    // Button Texte und Sichtbarkeit
    if (stepNumber === 1) {
      dom.wizardPrevBtn.style.display = 'none';
      dom.wizardNextBtn.textContent = 'Weiter zum Barber';
    } else {
      dom.wizardPrevBtn.style.display = 'inline-flex';
      if (stepNumber === 2) dom.wizardNextBtn.textContent = 'Weiter zum Termin';
      if (stepNumber === 3) dom.wizardNextBtn.textContent = 'Weiter zu deinen Daten';
      if (stepNumber === 4) dom.wizardNextBtn.textContent = 'Zur Zusammenfassung';
      if (stepNumber === 5) dom.wizardNextBtn.textContent = 'Termin verbindlich bestätigen';
    }

    // Renderspezifische Vorbereitungen
    if (stepNumber === 1) renderBookingStep1();
    if (stepNumber === 2) renderBookingStep2();
    if (stepNumber === 3) renderBookingStep3();
    if (stepNumber === 5) renderBookingStep5();
  }

  // Stepper Klick Navigation (nur wenn schon besucht)
  dom.stepperItems.forEach(item => {
    item.addEventListener('click', () => {
      const targetStep = parseInt(item.getAttribute('data-step'), 10);
      if (targetStep < appDraft.step) {
        goToWizardStep(targetStep);
      }
    });
  });

  // Wizard "Zurück"
  dom.wizardPrevBtn.addEventListener('click', () => {
    if (appDraft.step > 1) {
      goToWizardStep(appDraft.step - 1);
    }
  });

  // Wizard "Weiter"
  dom.wizardNextBtn.addEventListener('click', () => {
    if (appDraft.step === 1) {
      if (appDraft.selectedServiceIds.length === 0) {
        showToast('Bitte wähle mindestens einen Service.', 'warning');
        return;
      }
      goToWizardStep(2);
    } else if (appDraft.step === 2) {
      goToWizardStep(3);
    } else if (appDraft.step === 3) {
      if (!appDraft.selectedDate || !appDraft.selectedTime) {
        showToast('Bitte wähle einen freien Zeitslot für deinen Termin.', 'warning');
        return;
      }
      // Doppelbuchungs-Sicherheitscheck
      if (STATE.isSlotBooked(appDraft.selectedDate, appDraft.selectedTime, appDraft.selectedBarberId)) {
        showToast('Dieser Slot wurde soeben belegt. Bitte wähle eine andere Zeit.', 'error');
        renderTimeSlotsForSelectedDate(appDraft.selectedDate);
        return;
      }
      goToWizardStep(4);
    } else if (appDraft.step === 4) {
      if (!validateStep4()) {
        showToast('Bitte überprüfe deine Kontaktdaten.', 'warning');
        return;
      }
      goToWizardStep(5);
    } else if (appDraft.step === 5) {
      // Buchung finalisieren
      finalizeBooking();
    }
  });

  // Buchung final abschließen
  function finalizeBooking() {
    const { totalPrice, totalDuration, selectedServices } = calculateDraftTotals();
    const barberObj = CONFIG.barbers.find(b => b.id === appDraft.selectedBarberId);
    let resolvedBarberId = appDraft.selectedBarberId;
    let resolvedBarberName = barberObj ? barberObj.name : 'Erster Freier Barber';

    // Falls 'any' gewählt wurde, weise den ersten freien Barber für diesen Slot fest zu
    if (appDraft.selectedBarberId === 'any') {
      const bookedBarberIds = STATE.getAll()
        .filter(a => a.status === 'confirmed' && a.date === appDraft.selectedDate && a.time === appDraft.selectedTime)
        .map(a => a.barberId);
      const availableBarber = CONFIG.barbers.find(b => !bookedBarberIds.includes(b.id)) || CONFIG.barbers[0];
      resolvedBarberId = availableBarber.id;
      resolvedBarberName = `${availableBarber.name} (Erster Freier)`;
    }

    try {
      const newAppointment = STATE.addAppointment({
        date: appDraft.selectedDate,
        time: appDraft.selectedTime,
        services: selectedServices.map(s => ({
          id: s.id,
          title: s.title,
          price: s.price,
          duration: s.duration
        })),
        totalPrice,
        totalDuration,
        barberId: resolvedBarberId,
        barberName: resolvedBarberName,
        customer: { ...appDraft.customer }
      });

      // Erfolgsscreen befüllen
      dom.successBookingCode.textContent = newAppointment.id;
      dom.successAppointmentSummaryText.textContent = `
        Termin: ${formatGermanDate(newAppointment.date)} um ${newAppointment.time} Uhr bei ${newAppointment.barberName} (${newAppointment.totalPrice} €).
      `;

      showToast(`Termin erfolgreich gebucht! Code: ${newAppointment.id}`, 'success', 5000);
      goToWizardStep('success');

    } catch (err) {
      console.error(err);
      showToast('Fehler beim Buchen des Termins. Bitte versuche es erneut.', 'error');
    }
  }

  // Erfolgsscreen Buttons
  if (dom.successBookingCode) {
    dom.successBookingCode.style.cursor = 'pointer';
    dom.successBookingCode.title = 'Klicken zum Kopieren';
    dom.successBookingCode.addEventListener('click', () => {
      const code = dom.successBookingCode.textContent.trim();
      if (navigator.clipboard) {
        navigator.clipboard.writeText(code).then(() => {
          showToast(`Buchungscode ${code} in die Zwischenablage kopiert!`, 'success');
        }).catch(() => {
          showToast(`Buchungscode: ${code}`, 'info');
        });
      } else {
        showToast(`Buchungscode: ${code}`, 'info');
      }
    });
  }

  dom.successViewAppointmentsBtn.addEventListener('click', () => {
    document.getElementById('appointments').scrollIntoView({ behavior: 'smooth' });
  });

  dom.successBookAnotherBtn.addEventListener('click', () => {
    // Reset Draft
    appDraft.selectedTime = null;
    appDraft.step = 1;
    goToWizardStep(1);
    showToast('Neuer Buchungsvorgang gestartet.', 'info');
  });

  /* ==========================================================================
     TEAM SECTION & BARBER PROFILES
     ========================================================================== */
  function renderTeamSection() {
    if (!dom.teamContainer) return;

    dom.teamContainer.innerHTML = CONFIG.barbers.map(barber => `
      <div class="barber-team-card" data-barber-id="${barber.id}">
        <div class="barber-card-media">
          <img src="${barber.avatar}" alt="${barber.name} Barber" class="barber-card-img" loading="lazy">
          <div class="barber-rating-pill">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
            </svg>
            ${barber.rating}
          </div>
        </div>
        <div class="barber-card-content">
          <h3 class="barber-card-name">${barber.name}</h3>
          <span class="barber-card-role">${barber.nickname}</span>
          <p class="barber-card-spec">${barber.specialization}</p>
          <div class="barber-card-actions">
            <button class="btn btn-secondary btn-sm view-barber-profile-btn" data-id="${barber.id}">
              Profil & Cuts ansehen
            </button>
            <button class="btn btn-primary btn-sm direct-book-barber-btn" data-id="${barber.id}">
              Bei ${barber.name} buchen
            </button>
          </div>
        </div>
      </div>
    `).join('');

    // Event Listener
    dom.teamContainer.querySelectorAll('.view-barber-profile-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = btn.getAttribute('data-id');
        openBarberModal(id);
      });
    });

    dom.teamContainer.querySelectorAll('.direct-book-barber-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = btn.getAttribute('data-id');
        appDraft.selectedBarberId = id;
        renderBookingStep2();
        goToWizardStep(3); // Direkt zu Datum & Zeitslots springen
        document.getElementById('booking').scrollIntoView({ behavior: 'smooth' });
        showToast(`Barber ${CONFIG.barbers.find(b => b.id === id)?.name} gewählt. Wähle deinen Termin!`, 'success');
      });
    });
  }

  // Barber Detail Modal
  function openBarberModal(barberId) {
    const b = CONFIG.barbers.find(item => item.id === barberId);
    if (!b) return;

    dom.barberModalCover.src = b.avatar;
    dom.barberModalRole.textContent = b.role;
    dom.barberModalName.textContent = `${b.name} (${b.nickname})`;
    dom.barberModalRating.textContent = b.rating;
    dom.barberModalReviews.textContent = b.reviewCount;
    dom.barberModalBio.textContent = b.bio;
    dom.barberModalSpecialization.textContent = b.specialization;

    dom.barberModalCutsGrid.innerHTML = b.cuts.map(cutUrl => `
      <img src="${cutUrl}" alt="Cut von ${b.name}" class="portfolio-thumb-img" loading="lazy">
    `).join('');

    dom.barberModalBookBtn.textContent = `Jetzt bei ${b.name} buchen`;
    dom.barberModalBookBtn.onclick = () => {
      closeBarberModal();
      appDraft.selectedBarberId = b.id;
      renderBookingStep2();
      goToWizardStep(3);
      document.getElementById('booking').scrollIntoView({ behavior: 'smooth' });
      showToast(`Terminbuchung bei ${b.name} gestartet!`, 'success');
    };

    dom.barberDetailModal.classList.add('open');
  }

  function closeBarberModal() {
    dom.barberDetailModal.classList.remove('open');
  }

  dom.barberModalCloseBtn.addEventListener('click', closeBarberModal);
  dom.barberDetailModal.addEventListener('click', (e) => {
    if (e.target === dom.barberDetailModal) closeBarberModal();
  });

  /* ==========================================================================
     GALLERY SECTION & LIGHTBOX
     ========================================================================== */
  function renderGallerySection(filter = 'all') {
    if (!dom.galleryGrid) return;

    currentGalleryItems = filter === 'all' 
      ? [...CONFIG.gallery] 
      : CONFIG.gallery.filter(item => item.category === filter);

    dom.galleryGrid.innerHTML = currentGalleryItems.map((item, index) => `
      <div class="gallery-item" data-index="${index}">
        <img src="${item.image}" alt="${item.title}" class="gallery-img" loading="lazy">
        <div class="gallery-item-overlay">
          <span class="gallery-overlay-sub">${item.category} • by ${item.barber}</span>
          <span class="gallery-overlay-title">${item.title}</span>
        </div>
        <div class="gallery-zoom-badge">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <polyline points="15 3 21 3 21 9"></polyline>
            <polyline points="9 21 3 21 3 15"></polyline>
            <line x1="21" y1="3" x2="14" y2="10"></line>
            <line x1="3" y1="21" x2="10" y2="14"></line>
          </svg>
        </div>
      </div>
    `).join('');

    dom.galleryGrid.querySelectorAll('.gallery-item').forEach(itemEl => {
      itemEl.addEventListener('click', () => {
        const idx = parseInt(itemEl.getAttribute('data-index'), 10);
        openLightbox(idx);
      });
    });
  }

  // Filter Tabs
  if (dom.galleryFilterTabs) {
    dom.galleryFilterTabs.querySelectorAll('.gallery-filter-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        dom.galleryFilterTabs.querySelectorAll('.gallery-filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const filter = btn.getAttribute('data-filter');
        renderGallerySection(filter);
      });
    });
  }

  // Lightbox Steuerung
  function openLightbox(index) {
    currentLightboxIndex = index;
    updateLightboxContent();
    dom.lightboxModal.classList.add('open');
  }

  function closeLightbox() {
    dom.lightboxModal.classList.remove('open');
  }

  function updateLightboxContent() {
    const item = currentGalleryItems[currentLightboxIndex];
    if (!item) return;

    dom.lightboxMainImg.src = item.image;
    dom.lightboxTitle.textContent = `${item.title} (${item.barber})`;
    dom.lightboxDesc.textContent = `${item.desc} • Kategorie: ${item.category}`;
  }

  dom.lightboxPrevBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    currentLightboxIndex = (currentLightboxIndex - 1 + currentGalleryItems.length) % currentGalleryItems.length;
    updateLightboxContent();
  });

  dom.lightboxNextBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    currentLightboxIndex = (currentLightboxIndex + 1) % currentGalleryItems.length;
    updateLightboxContent();
  });

  dom.lightboxCloseBtn.addEventListener('click', closeLightbox);
  dom.lightboxModal.addEventListener('click', (e) => {
    if (e.target === dom.lightboxModal || e.target.classList.contains('lightbox-dialog')) {
      closeLightbox();
    }
  });

  // Keyboard navigation for Lightbox
  window.addEventListener('keydown', (e) => {
    if (!dom.lightboxModal.classList.contains('open')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') dom.lightboxPrevBtn.click();
    if (e.key === 'ArrowRight') dom.lightboxNextBtn.click();
  });

  /* ==========================================================================
     REVIEWS SECTION
     ========================================================================== */
  function renderReviewsSection() {
    if (!dom.reviewsContainer) return;

    dom.reviewsContainer.innerHTML = CONFIG.reviews.map(rev => `
      <div class="review-card">
        <div>
          <div class="review-card-top">
            <img src="${rev.avatar}" alt="${rev.name}" class="review-avatar-img" loading="lazy">
            <div>
              <div class="review-author-name">${rev.name}</div>
              <div class="review-author-handle">${rev.handle} • ${rev.age} J.</div>
            </div>
          </div>
          <div class="review-stars-row">
            ${Array(rev.stars).fill(0).map(() => `
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
              </svg>
            `).join('')}
          </div>
          <p class="review-text">„${rev.text}“</p>
        </div>
        <div class="review-footer-tag">
          <span>Barber: <strong>${rev.barber}</strong></span>
          <span>${rev.date}</span>
        </div>
      </div>
    `).join('');
  }

  /* ==========================================================================
     PERSONAS & EMPATHY MAPS SECTION
     ========================================================================== */
  function renderPersonasSection() {
    if (!dom.personaPanesContainer) return;

    dom.personaPanesContainer.innerHTML = CONFIG.personas.map((p, idx) => `
      <div class="persona-content-pane ${idx === 0 ? 'active' : ''}" id="personaPane-${p.id}">
        
        <div class="persona-header-grid">
          <img src="${p.avatar}" alt="${p.name}" class="persona-profile-avatar" loading="lazy">
          <div class="persona-profile-meta">
            <span class="persona-role-badge">${p.tag}</span>
            <h3 class="persona-name-title">${p.name} (${p.age}) – ${p.role}</h3>
            <p class="persona-goal-quote"><strong>Primäres Ziel:</strong> ${p.goal}</p>
          </div>
        </div>

        <div class="empathy-map-grid">
          
          <div class="empathy-quadrant">
            <div class="quadrant-tag">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"></circle><path d="M8 14s1.5 2 4 2 4-2 4-2"></path><line x1="9" y1="9" x2="9.01" y2="9"></line><line x1="15" y1="9" x2="15.01" y2="9"></line></svg>
              Denkt & Fühlt
            </div>
            <p class="quadrant-text">${p.empathyMap.thinksFeels}</p>
          </div>

          <div class="empathy-quadrant">
            <div class="quadrant-tag">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
              Sieht
            </div>
            <p class="quadrant-text">${p.empathyMap.sees}</p>
          </div>

          <div class="empathy-quadrant">
            <div class="quadrant-tag">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M3 18v-6a9 9 0 0 1 18 0v6"></path><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"></path></svg>
              Hört
            </div>
            <p class="quadrant-text">${p.empathyMap.hears}</p>
          </div>

          <div class="empathy-quadrant pain-card">
            <div class="quadrant-tag">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
              Pains (Hürden & Frust)
            </div>
            <p class="quadrant-text">${p.empathyMap.pains}</p>
          </div>

          <div class="empathy-quadrant gain-card">
            <div class="quadrant-tag">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
              Gains (Was begeistert)
            </div>
            <p class="quadrant-text">${p.empathyMap.gains}</p>
          </div>

          <div class="empathy-quadrant" style="border-color: rgba(255,255,255,0.15);">
            <div class="quadrant-tag" style="color: #fff;">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
              Studio44 Lösung
            </div>
            <p class="quadrant-text">
              100% Smartphone-Optimierung, 60s Live-Buchung, keine Doppelbuchungen, transparenter Festpreis & direkte Barber-Wahl.
            </p>
          </div>

        </div>

      </div>
    `).join('');

    // Tab Switcher
    if (dom.personaTabsNav) {
      dom.personaTabsNav.querySelectorAll('.persona-tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          dom.personaTabsNav.querySelectorAll('.persona-tab-btn').forEach(b => b.classList.remove('active'));
          btn.classList.add('active');

          const personaId = btn.getAttribute('data-persona');
          dom.personaPanesContainer.querySelectorAll('.persona-content-pane').forEach(p => p.classList.remove('active'));
          const targetPane = document.getElementById(`personaPane-${personaId}`);
          if (targetPane) targetPane.classList.add('active');
        });
      });
    }

    // Ausklappbar / Einklappbar Toggle
    const togglePersonasBtn = document.getElementById('togglePersonasBtn');
    const personasCardContainer = document.getElementById('personasCardContainer');
    const togglePersonasLabel = document.getElementById('togglePersonasLabel');
    const togglePersonasIcon = document.getElementById('togglePersonasIcon');

    if (togglePersonasBtn && personasCardContainer) {
      togglePersonasBtn.addEventListener('click', () => {
        const isCollapsed = personasCardContainer.classList.contains('is-collapsed');
        if (isCollapsed) {
          personasCardContainer.classList.remove('is-collapsed');
          personasCardContainer.style.display = 'block';
          togglePersonasBtn.setAttribute('aria-expanded', 'true');
          if (togglePersonasLabel) togglePersonasLabel.textContent = 'Research-Doku einklappen';
          if (togglePersonasIcon) togglePersonasIcon.innerHTML = '<polyline points="18 15 12 9 6 15"></polyline>';
        } else {
          personasCardContainer.classList.add('is-collapsed');
          personasCardContainer.style.display = 'none';
          togglePersonasBtn.setAttribute('aria-expanded', 'false');
          if (togglePersonasLabel) togglePersonasLabel.textContent = 'Research-Doku ausklappen (Kevin, Alex, Malik)';
          if (togglePersonasIcon) togglePersonasIcon.innerHTML = '<polyline points="6 9 12 15 18 9"></polyline>';
        }
      });
    }
  }

  /* ==========================================================================
     MEINE TERMINE (APPOINTMENTS MANAGEMENT VIA LOCALSTORAGE)
     ========================================================================== */
  let activeAppointmentsView = 'upcoming';

  function renderAppointmentsSection() {
    if (!dom.appointmentsListContainer) return;

    const { upcoming, past } = STATE.getGroupedAppointments();

    // Badge Counts aktualisieren
    const upcomingCount = upcoming.length;
    const pastCount = past.length;

    dom.upcomingBadgeCount.textContent = upcomingCount;
    dom.pastBadgeCount.textContent = pastCount;
    dom.headerAppointmentsCount.textContent = upcomingCount;

    if (upcomingCount > 0) {
      dom.mobileNavBadgeCount.style.display = 'flex';
      dom.mobileNavBadgeCount.textContent = upcomingCount;
    } else {
      dom.mobileNavBadgeCount.style.display = 'none';
    }

    const currentList = activeAppointmentsView === 'upcoming' ? upcoming : past;

    // Empty State
    if (currentList.length === 0) {
      dom.appointmentsListContainer.innerHTML = `
        <div class="empty-appointments-card">
          <div class="empty-icon-wrap">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="16" y1="2" x2="16" y2="6"></line>
              <line x1="8" y1="2" x2="8" y2="6"></line>
              <line x1="3" y1="10" x2="21" y2="10"></line>
            </svg>
          </div>
          <h3 class="empty-title">
            ${activeAppointmentsView === 'upcoming' ? 'Du hast aktuell keine anstehenden Cuts' : 'Noch keine vergangenen Termine vorhanden'}
          </h3>
          <p class="empty-desc">
            ${activeAppointmentsView === 'upcoming' 
              ? 'Sicher dir jetzt deinen Lieblings-Slot bei unseren Master Barbern in unter einer Minute.' 
              : 'Nach deinem ersten Besuch findest du hier deine Cut-Historie zum bequemen Wiederholen.'}
          </p>
          <a href="#booking" class="btn btn-primary" onclick="window.location.hash='booking';">
            Jetzt ersten Termin buchen
          </a>
        </div>
      `;
      return;
    }

    // Termine rendern
    dom.appointmentsListContainer.innerHTML = currentList.map(app => {
      const isPast = activeAppointmentsView === 'past';
      const isCancelled = app.status === 'cancelled';

      return `
        <div class="appointment-ticket-card ${isPast || isCancelled ? 'ticket-status-past' : ''}" data-app-id="${app.id}">
          <div>
            <div class="ticket-date-highlight">
              <span class="ticket-date-val">${formatGermanDate(app.date)}</span>
              <span class="ticket-time-badge">${app.time} Uhr</span>
              ${isCancelled ? '<span style="color: #ff6b6b; font-size: 12px; font-weight: 700; background: rgba(239,68,68,0.15); padding: 3px 8px; border-radius: 99px;">Storniert</span>' : ''}
            </div>

            <div class="ticket-services-list">
              <strong>${app.services.map(s => s.title).join(' + ')}</strong>
            </div>

            <div class="ticket-meta-info">
              <span>Barber: <strong>${app.barberName}</strong></span>
              <span>Dauer: ${app.totalDuration} Min</span>
              <span>Betrag: <strong style="color: var(--accent-lime);">${app.totalPrice} €</strong></span>
              <span class="copy-code-badge" data-code="${app.id}" title="Klicken zum Kopieren" style="cursor: pointer;">Code: <code>${app.id}</code></span>
            </div>

            ${app.customer?.notes ? `
              <div style="font-size: 12px; color: #888; margin-top: 8px; font-style: italic;">
                Notiz: „${app.customer.notes}“
              </div>
            ` : ''}
          </div>

          <div class="ticket-actions-row">
            ${!isPast && !isCancelled ? `
              <button class="btn btn-secondary btn-sm reschedule-btn" data-id="${app.id}">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="1 4 1 10 7 10"></polyline>
                  <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"></path>
                </svg>
                Verschieben
              </button>

              <button class="btn btn-danger btn-sm cancel-btn" data-id="${app.id}">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="3 6 5 6 21 6"></polyline>
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                </svg>
                Stornieren
              </button>
            ` : `
              <button class="btn btn-outline-lime btn-sm rebook-btn" data-id="${app.id}">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="23 4 23 10 17 10"></polyline>
                  <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path>
                </svg>
                Nochmal buchen
              </button>
            `}
          </div>
        </div>
      `;
    }).join('');

    // Event Listener für Verschieben, Stornieren, Nochmal buchen
    dom.appointmentsListContainer.querySelectorAll('.reschedule-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        openRescheduleModal(id);
      });
    });

    dom.appointmentsListContainer.querySelectorAll('.cancel-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        openCancelModal(id);
      });
    });

    dom.appointmentsListContainer.querySelectorAll('.rebook-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        const appointment = STATE.getAll().find(a => a.id === id);
        if (appointment) {
          appDraft.selectedServiceIds = appointment.services.map(s => s.id);
          appDraft.selectedBarberId = appointment.barberId || 'any';
          appDraft.selectedTime = null;
          renderBookingStep1();
          renderBookingStep2();
          updateLiveCalculation();
          goToWizardStep(3);
          document.getElementById('booking').scrollIntoView({ behavior: 'smooth' });
          showToast(`Services von ${appointment.barberName} übernommen. Wähle dein neues Datum!`, 'success');
        }
      });
    });

    // Buchungscode klickbar zum Kopieren
    dom.appointmentsListContainer.querySelectorAll('.copy-code-badge').forEach(badge => {
      badge.addEventListener('click', (e) => {
        e.stopPropagation();
        const code = badge.getAttribute('data-code');
        if (navigator.clipboard) {
          navigator.clipboard.writeText(code).then(() => {
            showToast(`Buchungscode ${code} kopiert!`, 'success');
          }).catch(() => {
            showToast(`Buchungscode: ${code}`, 'info');
          });
        } else {
          showToast(`Buchungscode: ${code}`, 'info');
        }
      });
    });
  }

  // Tabs Switcher (Anstehend vs Vergangen)
  dom.tabUpcoming.addEventListener('click', () => {
    activeAppointmentsView = 'upcoming';
    dom.tabUpcoming.classList.add('active');
    dom.tabPast.classList.remove('active');
    renderAppointmentsSection();
  });

  dom.tabPast.addEventListener('click', () => {
    activeAppointmentsView = 'past';
    dom.tabPast.classList.add('active');
    dom.tabUpcoming.classList.remove('active');
    renderAppointmentsSection();
  });

  /* ==========================================================================
     RESCHEDULE MODAL LOGIC
     ========================================================================== */
  function openRescheduleModal(appointmentId) {
    activeRescheduleAppointment = STATE.getAll().find(a => a.id === appointmentId);
    if (!activeRescheduleAppointment) return;

    dom.rescheduleAppointmentInfoText.textContent = `
      Termin #${activeRescheduleAppointment.id} bei ${activeRescheduleAppointment.barberName} (${formatGermanDate(activeRescheduleAppointment.date)}, ${activeRescheduleAppointment.time} Uhr).
    `;

    const days = getUpcomingDaysList(14);
    rescheduleSelectedDate = days.find(d => !d.isClosed)?.iso || null;
    rescheduleSelectedTime = null;

    // Render Days Slider
    dom.rescheduleDaysSlider.innerHTML = days.map(d => `
      <button type="button" class="day-pick-btn ${rescheduleSelectedDate === d.iso ? 'selected' : ''}" 
              data-iso="${d.iso}" 
              ${d.isClosed ? 'disabled' : ''}>
        <span class="day-name">${d.dayName}</span>
        <span class="day-num">${d.dayNum}</span>
        <span class="day-month">${d.monthName}</span>
      </button>
    `).join('');

    dom.rescheduleDaysSlider.querySelectorAll('.day-pick-btn:not(:disabled)').forEach(b => {
      b.addEventListener('click', () => {
        rescheduleSelectedDate = b.getAttribute('data-iso');
        dom.rescheduleDaysSlider.querySelectorAll('.day-pick-btn').forEach(btn => btn.classList.remove('selected'));
        b.classList.add('selected');
        renderRescheduleSlots();
      });
    });

    renderRescheduleSlots();
    dom.rescheduleModal.classList.add('open');
  }

  function renderRescheduleSlots() {
    if (!rescheduleSelectedDate) return;
    const slots = generateSlotsForDay(rescheduleSelectedDate);
    const booked = STATE.getBookedTimes(rescheduleSelectedDate, activeRescheduleAppointment.barberId);

    const now = new Date();
    const todayIso = formatDateIso(now);
    const isToday = rescheduleSelectedDate === todayIso;
    const currentMin = now.getHours() * 60 + now.getMinutes();

    dom.rescheduleSlotsGrid.innerHTML = slots.map(timeStr => {
      const [slotH, slotM] = timeStr.split(':').map(Number);
      const isPast = isToday && (slotH * 60 + slotM <= currentMin);
      // Wenn der Slot dem aktuell zu verschiebenden Termin gehört, gilt er als frei
      const isCurrentAppSlot = activeRescheduleAppointment.date === rescheduleSelectedDate && activeRescheduleAppointment.time === timeStr;
      const isBooked = booked.includes(timeStr) && !isCurrentAppSlot;
      const isDisabled = isBooked || isPast;
      const isSelected = rescheduleSelectedTime === timeStr;
      const tooltip = isPast ? 'Bereits verstrichen' : isBooked ? 'Bereits belegt' : 'Freier Slot';

      return `
        <button type="button" class="time-slot-btn ${isSelected ? 'selected' : ''}" 
                data-time="${timeStr}" 
                ${isDisabled ? `disabled title="${tooltip}"` : `title="${tooltip}"`}>
          ${timeStr}
        </button>
      `;
    }).join('');

    dom.rescheduleSlotsGrid.querySelectorAll('.time-slot-btn:not(:disabled)').forEach(b => {
      b.addEventListener('click', () => {
        rescheduleSelectedTime = b.getAttribute('data-time');
        dom.rescheduleSlotsGrid.querySelectorAll('.time-slot-btn').forEach(btn => btn.classList.remove('selected'));
        b.classList.add('selected');
      });
    });
  }

  function closeRescheduleModal() {
    dom.rescheduleModal.classList.remove('open');
    activeRescheduleAppointment = null;
    rescheduleSelectedDate = null;
    rescheduleSelectedTime = null;
  }

  dom.rescheduleCloseBtn.addEventListener('click', closeRescheduleModal);
  dom.rescheduleCancelActionBtn.addEventListener('click', closeRescheduleModal);
  dom.rescheduleConfirmActionBtn.addEventListener('click', () => {
    if (!rescheduleSelectedDate || !rescheduleSelectedTime) {
      showToast('Bitte wähle ein Datum und einen freien Zeitslot.', 'warning');
      return;
    }

    try {
      STATE.rescheduleAppointment(activeRescheduleAppointment.id, rescheduleSelectedDate, rescheduleSelectedTime);
      showToast(`Termin #${activeRescheduleAppointment.id} erfolgreich auf den ${formatGermanDate(rescheduleSelectedDate)} um ${rescheduleSelectedTime} Uhr verschoben!`, 'success', 4500);
      closeRescheduleModal();
    } catch (err) {
      showToast(err.message || 'Fehler beim Verschieben.', 'error');
    }
  });

  /* ==========================================================================
     CANCEL CONFIRMATION MODAL LOGIC
     ========================================================================== */
  function openCancelModal(appointmentId) {
    activeCancelAppointmentId = appointmentId;
    const app = STATE.getAll().find(a => a.id === appointmentId);
    if (!app) return;

    dom.cancelModalDetailsText.textContent = `
      Möchtest du deinen Termin #${app.id} am ${formatGermanDate(app.date)} um ${app.time} Uhr bei ${app.barberName} wirklich stornieren?
    `;

    dom.cancelConfirmModal.classList.add('open');
  }

  function closeCancelModal() {
    dom.cancelConfirmModal.classList.remove('open');
    activeCancelAppointmentId = null;
  }

  dom.cancelModalBackBtn.addEventListener('click', closeCancelModal);
  dom.cancelModalConfirmBtn.addEventListener('click', () => {
    if (!activeCancelAppointmentId) return;

    const success = STATE.cancelAppointment(activeCancelAppointmentId);
    if (success) {
      showToast(`Termin #${activeCancelAppointmentId} wurde storniert.`, 'info');
    } else {
      showToast('Fehler bei der Stornierung.', 'error');
    }
    closeCancelModal();
  });

  /* ==========================================================================
     SCROLLSPY & NAVIGATION HIGHLIGHT
     ========================================================================== */
  function setupNavigation() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.desktop-nav .nav-link, .mobile-bottom-nav .mobile-nav-item');

    window.addEventListener('scroll', () => {
      let currentSectionId = 'hero';
      const scrollPosition = window.scrollY + 140;

      sections.forEach(section => {
        const top = section.offsetTop;
        const height = section.offsetHeight;
        if (scrollPosition >= top && scrollPosition < top + height) {
          currentSectionId = section.getAttribute('id');
        }
      });

      navLinks.forEach(link => {
        const targetNav = link.getAttribute('data-nav');
        if (targetNav === currentSectionId) {
          link.classList.add('active');
        } else {
          link.classList.remove('active');
        }
      });
    }, { passive: true });

    // Header Termine Button Shortcut
    if (dom.headerAppointmentsBtn) {
      dom.headerAppointmentsBtn.addEventListener('click', () => {
        document.getElementById('appointments').scrollIntoView({ behavior: 'smooth' });
      });
    }
  }

  /* ==========================================================================
     INITIALIZATION
     ========================================================================== */
  function init() {
    // 1. Initial State Renderer
    updateLiveShopStatus();
    renderServicesSection();
    renderTeamSection();
    renderGallerySection('all');
    renderReviewsSection();
    renderPersonasSection();

    // 2. Wizard Defaults
    renderBookingStep1();
    renderBookingStep2();
    renderBookingStep3();
    updateLiveCalculation();

    // 3. Appointments Management
    renderAppointmentsSection();
    STATE.subscribe(() => {
      renderAppointmentsSection();
      // Auch eventuell offene Zeitslots im Wizard aktualisieren
      if (appDraft.selectedDate) {
        renderTimeSlotsForSelectedDate(appDraft.selectedDate);
      }
    });

    // 4. Setup Nav
    setupNavigation();

    // 5. Intervall für Shop-Status
    setInterval(updateLiveShopStatus, 60000);

    console.log('Studio44 Barbershop Website erfolgreich initialisiert.');
  }

  // Start bei DOM Ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();


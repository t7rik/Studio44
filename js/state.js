/**
 * Studio44 - State Management & LocalStorage Persistence
 * Verwaltet gebuchte Termine, Konfliktprüfungen und Entwürfe im Browser.
 */

class Studio44State {
  constructor() {
    this.STORAGE_KEY = 'studio44_appointments_v1';
    this.listeners = [];
    this.initDemoDataIfNeeded();
  }

  // Initialisiert realistische Demo-Termine, falls noch keine Daten vorliegen
  initDemoDataIfNeeded() {
    const existing = (window.__ls||localStorage).getItem(this.STORAGE_KEY);
    if (!existing) {
      const today = new Date();
      
      // Morgen um 15:30 Uhr
      const tomorrow = new Date(today);
      tomorrow.setDate(today.getDate() + 1);
      // Falls morgen Sonntag ist, nimm übermorgen
      if (tomorrow.getDay() === 0) {
        tomorrow.setDate(tomorrow.getDate() + 1);
      }
      const tomorrowStr = this.formatDateIso(tomorrow);

      // Vergangener Termin vor 10 Tagen
      const pastDate = new Date(today);
      pastDate.setDate(today.getDate() - 10);
      const pastDateStr = this.formatDateIso(pastDate);

      const demoAppointments = [
        {
          id: 'ST44-7821',
          createdAt: new Date(Date.now() - 86400000).toISOString(),
          date: tomorrowStr,
          time: '15:30',
          services: [
            { id: 'haircut', title: 'Haarschnitt', price: 20, duration: 30 },
            { id: 'beard', title: 'Bart trimmen & Konturen', price: 7, duration: 15 }
          ],
          totalPrice: 27,
          totalDuration: 45,
          barberId: 'zana',
          barberName: 'Zana',
          customer: {
            name: 'Alex Neumann',
            phone: '0676 2345678',
            email: 'alex.neumann@example.com',
            notes: 'Bitte Mid Fade mit fließendem Übergang in den Bart.'
          },
          status: 'confirmed'
        },
        {
          id: 'ST44-3190',
          createdAt: new Date(Date.now() - 15 * 86400000).toISOString(),
          date: pastDateStr,
          time: '14:00',
          services: [
            { id: 'haircut', title: 'Haarschnitt', price: 20, duration: 30 }
          ],
          totalPrice: 20,
          totalDuration: 30,
          barberId: 'tarik',
          barberName: 'Tarik',
          customer: {
            name: 'Alex Neumann',
            phone: '0676 2345678',
            email: 'alex.neumann@example.com',
            notes: 'Crop Top Styling mit Texture Powder.'
          },
          status: 'completed'
        }
      ];

      this.save(demoAppointments);
    }
  }

  formatDateIso(dateObj) {
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const day = String(dateObj.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  // Alle Termine laden
  getAll() {
    try {
      const data = (window.__ls||localStorage).getItem(this.STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error('Fehler beim Laden von Studio44 LocalStorage:', e);
      return [];
    }
  }

  // Speichern & Event trigger
  save(appointments) {
    try {
      (window.__ls||localStorage).setItem(this.STORAGE_KEY, JSON.stringify(appointments));
      this.notify(appointments);
    } catch (e) {
      console.error('Fehler beim Speichern in LocalStorage:', e);
    }
  }

  subscribe(callback) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(cb => cb !== callback);
    };
  }

  notify(data) {
    this.listeners.forEach(cb => {
      try {
        cb(data || this.getAll());
      } catch (err) {
        console.error('State listener error:', err);
      }
    });
  }

  // Neuen Termin anlegen
  addAppointment(appointmentData) {
    const list = this.getAll();
    const codeNumber = Math.floor(1000 + Math.random() * 9000);
    const newAppointment = {
      id: `ST44-${codeNumber}`,
      createdAt: new Date().toISOString(),
      status: 'confirmed',
      ...appointmentData
    };

    list.unshift(newAppointment);
    this.save(list);
    return newAppointment;
  }

  // Termin stornieren
  cancelAppointment(appointmentId) {
    const list = this.getAll();
    const target = list.find(a => a.id === appointmentId);
    if (!target) return false;

    target.status = 'cancelled';
    this.save(list);
    return true;
  }

  // Termin verschieben
  rescheduleAppointment(appointmentId, newDate, newTime) {
    const list = this.getAll();
    const target = list.find(a => a.id === appointmentId);
    if (!target) return false;

    // Prüfen, ob neuer Slot bereits von demselben Barber belegt ist
    if (this.isSlotBooked(newDate, newTime, target.barberId, appointmentId)) {
      throw new Error('Dieser Zeitslot ist bei diesem Barber leider bereits belegt.');
    }

    target.date = newDate;
    target.time = newTime;
    target.status = 'confirmed';
    target.rescheduledAt = new Date().toISOString();
    this.save(list);
    return target;
  }

  // Prüft Konfliktfreiheit eines Zeitslots
  isSlotBooked(dateStr, timeStr, barberId, excludeAppointmentId = null) {
    const list = this.getAll();
    const active = list.filter(a => a.status === 'confirmed' && a.id !== excludeAppointmentId && a.date === dateStr);

    if (barberId === 'any') {
      // Wenn "Egal / Erster freier", ist der Slot nur belegt, wenn ALLE Barbers belegt sind
      const totalBarbersCount = window.STUDIO44_CONFIG?.barbers?.length || 5;
      const bookedCountAtSlot = active.filter(a => a.time === timeStr).length;
      return bookedCountAtSlot >= totalBarbersCount;
    } else {
      // Bei speziellem Barber: belegt, wenn genau dieser Barber bereits einen Termin hat
      return active.some(a => a.time === timeStr && a.barberId === barberId);
    }
  }

  // Holt alle gebuchten Zeiten für ein Datum & Barber
  getBookedTimes(dateStr, barberId) {
    const list = this.getAll();
    const active = list.filter(a => a.status === 'confirmed' && a.date === dateStr);

    if (barberId === 'any') {
      const totalBarbersCount = window.STUDIO44_CONFIG?.barbers?.length || 5;
      const timeFreq = {};
      active.forEach(a => {
        timeFreq[a.time] = (timeFreq[a.time] || 0) + 1;
      });
      return Object.keys(timeFreq).filter(time => timeFreq[time] >= totalBarbersCount);
    } else {
      return active
        .filter(a => a.barberId === barberId)
        .map(a => a.time);
    }
  }

  // Trennt in anstehende und vergangene Termine
  getGroupedAppointments() {
    const all = this.getAll();
    const now = new Date();
    const upcoming = [];
    const past = [];

    all.forEach(app => {
      if (app.status === 'cancelled') {
        past.push(app);
        return;
      }

      // Datum und Zeit vergleichen
      const [year, month, day] = app.date.split('-').map(Number);
      const [hours, minutes] = app.time.split(':').map(Number);
      const appDateTime = new Date(year, month - 1, day, hours, minutes);

      if (appDateTime >= now) {
        upcoming.push(app);
      } else {
        past.push(app);
      }
    });

    // Sortierung: Upcoming aufsteigend, Past absteigend
    upcoming.sort((a, b) => new Date(`${a.date}T${a.time}`) - new Date(`${b.date}T${b.time}`));
    past.sort((a, b) => new Date(`${b.date}T${b.time}`) - new Date(`${a.date}T${a.time}`));

    return { upcoming, past };
  }
}

window.studio44State = new Studio44State();


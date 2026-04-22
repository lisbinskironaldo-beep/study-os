const Calendar = {

    eventStorageKey: "planner_events_v2",
    reminderStorageKey: "planner_quick_reminders_v2",
    legacyEventStorageKey: "calendar_core_v1",
    legacyReminderStorageKey: "alarms_core_v1",
    notificationStorageKey: "planner_notifications_seen_v1",

    data: {},
    quickReminders: [],
    notifiedMap: {},
    currentDate: new Date(),
    modalEl: null,
    modalContent: null,
    toastHost: null,
    notificationTimer: null,

    days: ["dom", "seg", "ter", "qua", "qui", "sex", "sab"],

    init() {
        this.load();
        this.ensureUIChrome();
        this.render();
        this.startNotificationWatcher();
        this.emitReminderUpdate();
    },

    load() {
        this.data = this.loadEvents();
        this.quickReminders = this.loadQuickReminders();
        this.notifiedMap = this.loadNotifiedMap();
        this.cleanupNotifiedMap();
    },

    loadEvents() {
        const current = localStorage.getItem(this.eventStorageKey);
        if (current) {
            try {
                return JSON.parse(current) || {};
            } catch {
                return {};
            }
        }

        const legacy = localStorage.getItem(this.legacyEventStorageKey);
        if (!legacy) return {};

        try {
            const parsed = JSON.parse(legacy) || {};
            const migrated = {};

            Object.entries(parsed).forEach(([key, value]) => {
                if (!value) return;

                migrated[key] = {
                    title: value.title || "Lembrar",
                    hour: String(value.hour || "07").padStart(2, "0"),
                    minute: String(value.minute || "00").padStart(2, "0"),
                    reminderMinutes: Number(value.pre || 0),
                    type: value.type || "study",
                    notes: value.notes || ""
                };
            });

            localStorage.setItem(this.eventStorageKey, JSON.stringify(migrated));
            return migrated;
        } catch {
            return {};
        }
    },

    loadQuickReminders() {
        const current = localStorage.getItem(this.reminderStorageKey);
        if (current) {
            try {
                return JSON.parse(current) || [];
            } catch {
                return [];
            }
        }

        const legacy = localStorage.getItem(this.legacyReminderStorageKey);
        if (!legacy) return [];

        try {
            const parsed = JSON.parse(legacy) || [];
            const migrated = parsed.map((item, index) => ({
                id: item.id || `${Date.now()}-${index}`,
                title: item.name || `Lembrete ${String(index + 1).padStart(2, "0")}`,
                hour: String(item.hour || "07").padStart(2, "0"),
                minute: String(item.minute || "00").padStart(2, "0"),
                days: Array.isArray(item.days) && item.days.length ? item.days : ["seg"],
                reminderMinutes: Number(item.remindBefore || 0),
                active: item.active !== false
            }));

            localStorage.setItem(this.reminderStorageKey, JSON.stringify(migrated));
            return migrated;
        } catch {
            return [];
        }
    },

    loadNotifiedMap() {
        try {
            return JSON.parse(localStorage.getItem(this.notificationStorageKey) || "{}");
        } catch {
            return {};
        }
    },

    cleanupNotifiedMap() {
        const now = Date.now();
        const maxAge = 1000 * 60 * 60 * 24 * 14;

        Object.keys(this.notifiedMap).forEach(key => {
            if (now - Number(this.notifiedMap[key] || 0) > maxAge) {
                delete this.notifiedMap[key];
            }
        });

        this.saveNotifiedMap();
    },

    ensureUIChrome() {
        if (!document.getElementById("plannerModal")) {
            const modal = document.createElement("div");
            modal.id = "plannerModal";
            modal.className = "planner-modal hidden";
            modal.setAttribute("aria-hidden", "true");
            modal.innerHTML = `
<div class="planner-modal-backdrop" data-planner-close="true"></div>
<div class="planner-modal-card">
  <button id="plannerModalClose" class="planner-modal-close" type="button" aria-label="Fechar">x</button>
  <div id="plannerModalContent"></div>
</div>
`;
            document.body.appendChild(modal);
        }

        if (!document.getElementById("plannerToastHost")) {
            const host = document.createElement("div");
            host.id = "plannerToastHost";
            host.className = "planner-toast-host";
            document.body.appendChild(host);
        }

        this.modalEl = document.getElementById("plannerModal");
        this.modalContent = document.getElementById("plannerModalContent");
        this.toastHost = document.getElementById("plannerToastHost");

        this.modalEl?.addEventListener("click", (event) => {
            if (event.target.closest("[data-planner-close='true']")) {
                this.closeModal();
            }
        });

        document.getElementById("plannerModalClose")?.addEventListener("click", () => {
            this.closeModal();
        });

        document.addEventListener("keydown", (event) => {
            if (event.key === "Escape" && this.modalEl && !this.modalEl.classList.contains("hidden")) {
                this.closeModal();
            }
        });
    },

    render() {
        const container = document.getElementById("calendarModule");
        if (!container) return;

        const year = this.currentDate.getFullYear();
        const month = this.currentDate.getMonth();
        const monthName = this.capitalize(
            this.currentDate.toLocaleString("pt-BR", { month: "long" })
        );

        container.innerHTML = `
<section class="planner-shell">
  <div class="planner-head">
    <div class="planner-head-copy">
      <div class="planner-kicker">Agenda viva</div>
      <h2>${monthName} ${year}</h2>
      <p>Eventos do dia e lembretes rapidos no mesmo lugar.</p>
    </div>

    <div class="planner-head-actions">
      <button id="calendarNotifyBtn" type="button">${this.getNotificationButtonLabel()}</button>
      <button id="calendarQuickReminderBtn" type="button">+ Lembrete rapido</button>
    </div>
  </div>

  <div class="planner-month-nav">
    <button id="calendarPrevMonth" type="button" aria-label="Mes anterior"><</button>
    <div class="planner-month-label">${monthName} ${year}</div>
    <button id="calendarNextMonth" type="button" aria-label="Proximo mes">></button>
  </div>

  <div class="calendar-weekdays">
    ${["DOM", "SEG", "TER", "QUA", "QUI", "SEX", "SAB"]
        .map((day, index) => `<div class="weekday ${index === 0 ? "sun" : ""} ${index === 6 ? "sat" : ""}">${day}</div>`)
        .join("")}
  </div>

  <div class="calendar-grid" id="calendarGrid"></div>

  <section class="planner-reminders">
    <div class="planner-section-head">
      <div>
        <div class="planner-kicker">Acoplado na agenda</div>
        <h3>Lembretes rapidos</h3>
      </div>
      <button id="plannerReminderSecondaryBtn" type="button">Novo</button>
    </div>
    <div id="plannerReminderList" class="planner-reminder-list"></div>
  </section>
</section>
`;

        document.getElementById("calendarPrevMonth")?.addEventListener("click", () => {
            this.currentDate.setMonth(this.currentDate.getMonth() - 1);
            this.render();
        });

        document.getElementById("calendarNextMonth")?.addEventListener("click", () => {
            this.currentDate.setMonth(this.currentDate.getMonth() + 1);
            this.render();
        });

        document.getElementById("calendarNotifyBtn")?.addEventListener("click", () => {
            this.requestNotificationPermission();
        });

        document.getElementById("calendarQuickReminderBtn")?.addEventListener("click", () => {
            this.openQuickReminderModal();
        });

        document.getElementById("plannerReminderSecondaryBtn")?.addEventListener("click", () => {
            this.openQuickReminderModal();
        });

        this.buildDays(year, month);
        this.renderQuickReminders();
    },

    buildDays(year, month) {
        const grid = document.getElementById("calendarGrid");
        if (!grid) return;

        grid.innerHTML = "";

        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const today = new Date();

        for (let index = 0; index < firstDay; index += 1) {
            const spacer = document.createElement("div");
            spacer.className = "calendar-spacer";
            grid.appendChild(spacer);
        }

        for (let day = 1; day <= daysInMonth; day += 1) {
            const key = this.createKey(year, month, day);
            const eventData = this.data[key];
            const cell = document.createElement("button");
            cell.type = "button";
            cell.className = "calendar-day";

            if (eventData) {
                cell.classList.add("has-event");
            }

            if (
                day === today.getDate() &&
                month === today.getMonth() &&
                year === today.getFullYear()
            ) {
                cell.classList.add("today");
            }

            const weekday = new Date(year, month, day).getDay();
            if (weekday === 0) cell.classList.add("sun");
            if (weekday === 6) cell.classList.add("sat");

            const preview = eventData
                ? `
<div class="calendar-day-preview-time">${eventData.hour}:${eventData.minute}</div>
<div class="calendar-day-preview-title">${eventData.title}</div>
`
                : `
<div class="calendar-day-empty">Clique para lembrar</div>
`;

            cell.innerHTML = `
<div class="calendar-day-number">${day}</div>
<div class="calendar-day-preview">${preview}</div>
`;

            cell.addEventListener("click", () => {
                this.openEventModal(key);
            });

            grid.appendChild(cell);
        }
    },

    renderQuickReminders() {
        const list = document.getElementById("plannerReminderList");
        if (!list) return;

        if (!this.quickReminders.length) {
            list.innerHTML = `
<div class="planner-empty-state">
  <div class="planner-empty-title">Nenhum lembrete rapido ainda.</div>
  <div class="planner-empty-text">Use para avisos recorrentes sem poluir a tela principal.</div>
</div>
`;
            return;
        }

        list.innerHTML = this.quickReminders.map(reminder => `
<article class="planner-reminder-card ${reminder.active ? "is-active" : "is-paused"}" data-reminder-id="${reminder.id}">
  <div class="planner-reminder-time">${reminder.hour}:${reminder.minute}</div>
  <div class="planner-reminder-copy">
    <div class="planner-reminder-title">${reminder.title}</div>
    <div class="planner-reminder-meta">${this.formatDays(reminder.days)}${reminder.reminderMinutes ? ` • ${reminder.reminderMinutes} min antes` : ""}</div>
  </div>
  <button class="planner-reminder-edit" data-edit-reminder="${reminder.id}" type="button">Editar</button>
</article>
`).join("");

        list.querySelectorAll("[data-edit-reminder]").forEach(button => {
            button.addEventListener("click", () => {
                this.openQuickReminderModal(button.dataset.editReminder);
            });
        });
    },

    openEventModal(key) {
        const { year, month, day } = this.parseKey(key);
        const current = this.data[key] || {
            title: "",
            hour: "07",
            minute: "00",
            reminderMinutes: 10,
            type: "study",
            notes: ""
        };

        this.setModalContent(`
<div class="planner-modal-header">
  <div class="planner-kicker">Evento do dia</div>
  <h3>${this.formatDateLabel(year, month, day)}</h3>
  <p>Preencha o lembrete de forma rapida e sem bagunca.</p>
</div>

<form id="plannerEventForm" class="planner-form">
  <input type="hidden" name="eventKey" value="${key}">

  <label class="planner-field">
    <span>Título</span>
    <input name="title" type="text" maxlength="80" placeholder="Ex.: Revisar bioquímica" value="${this.escapeHtml(current.title)}">
  </label>

  <div class="planner-field-row">
    <label class="planner-field">
      <span>Horário</span>
      <input name="time" type="time" value="${current.hour}:${current.minute}">
    </label>

    <label class="planner-field">
      <span>Tipo</span>
      <select name="type">
        ${this.renderSelectOptions([
            ["study", "Estudo"],
            ["exam", "Prova"],
            ["break", "Pausa"],
            ["personal", "Pessoal"]
        ], current.type)}
      </select>
    </label>
  </div>

  <div class="planner-field-row">
    <label class="planner-field">
      <span>Lembrar</span>
      <select name="reminderMinutes">
        ${this.renderSelectOptions([
            ["0", "Na hora"],
            ["10", "10 min antes"],
            ["30", "30 min antes"],
            ["60", "1 hora antes"],
            ["1440", "1 dia antes"]
        ], String(current.reminderMinutes ?? 10))}
      </select>
    </label>

    <label class="planner-field">
      <span>Notificacao</span>
      <div class="planner-permission-pill ${this.getNotificationPillClass()}">${this.getNotificationPillLabel()}</div>
    </label>
  </div>

  <label class="planner-field">
    <span>Observacao</span>
    <textarea name="notes" rows="3" placeholder="Opcional">${this.escapeHtml(current.notes || "")}</textarea>
  </label>

  <div class="planner-modal-actions">
    <button class="planner-btn planner-btn-ghost" type="button" id="plannerDeleteEventBtn">${this.data[key] ? "Apagar dia" : "Limpar"}</button>
    <button class="planner-btn planner-btn-ghost" type="button" id="plannerRequestPermissionBtn">Permitir notificações</button>
    <button class="planner-btn planner-btn-primary" type="submit">Salvar</button>
  </div>
</form>
`);

        const form = document.getElementById("plannerEventForm");
        form?.addEventListener("submit", (event) => {
            event.preventDefault();
            this.saveEventFromForm(new FormData(form));
        });

        document.getElementById("plannerDeleteEventBtn")?.addEventListener("click", () => {
            this.deleteEvent(key);
        });

        document.getElementById("plannerRequestPermissionBtn")?.addEventListener("click", () => {
            this.requestNotificationPermission();
        });
    },

    saveEventFromForm(formData) {
        const key = formData.get("eventKey");
        const titleInput = String(formData.get("title") || "").trim();
        const time = String(formData.get("time") || "").trim();
        const notes = String(formData.get("notes") || "").trim();

        if (!time) {
            this.showToast("Escolha um horario para o evento.");
            return;
        }

        const [hour, minute] = time.split(":");

        this.data[key] = {
            title: titleInput || "Lembrete",
            hour: String(hour || "07").padStart(2, "0"),
            minute: String(minute || "00").padStart(2, "0"),
            reminderMinutes: Number(formData.get("reminderMinutes") || 0),
            type: String(formData.get("type") || "study"),
            notes
        };

        this.saveEvents();
        this.closeModal();
        this.render();
        this.emitReminderUpdate();
        this.showToast("Evento salvo na agenda.");
    },

    deleteEvent(key) {
        if (this.data[key]) {
            delete this.data[key];
            this.saveEvents();
        }

        this.closeModal();
        this.render();
        this.emitReminderUpdate();
        this.showToast("Dia limpo com sucesso.");
    },

    openQuickReminderModal(reminderId = null) {
        const current = this.quickReminders.find(item => String(item.id) === String(reminderId)) || {
            id: "",
            title: "",
            hour: "07",
            minute: "00",
            days: ["seg", "ter", "qua", "qui", "sex"],
            reminderMinutes: 0,
            active: true
        };

        this.setModalContent(`
<div class="planner-modal-header">
  <div class="planner-kicker">Lembrete rapido</div>
  <h3>${reminderId ? "Editar lembrete" : "Novo lembrete rapido"}</h3>
  <p>Ideal para alarmes recorrentes que agora vivem junto da agenda.</p>
</div>

<form id="plannerReminderForm" class="planner-form">
  <input type="hidden" name="reminderId" value="${current.id}">

  <label class="planner-field">
    <span>Titulo</span>
    <input name="title" type="text" maxlength="80" placeholder="Ex.: Agua, pausa, revisar flashcards" value="${this.escapeHtml(current.title)}">
  </label>

  <div class="planner-field-row">
    <label class="planner-field">
      <span>Horário</span>
      <input name="time" type="time" value="${current.hour}:${current.minute}">
    </label>

    <label class="planner-field">
      <span>Lembrar</span>
      <select name="reminderMinutes">
        ${this.renderSelectOptions([
            ["0", "Na hora"],
            ["5", "5 min antes"],
            ["10", "10 min antes"],
            ["30", "30 min antes"]
        ], String(current.reminderMinutes ?? 0))}
      </select>
    </label>
  </div>

  <div class="planner-field">
    <span>Repetir em</span>
    <div class="planner-chip-row">
      ${this.days.map(day => `
<label class="planner-chip ${current.days.includes(day) ? "is-active" : ""}">
  <input type="checkbox" name="days" value="${day}" ${current.days.includes(day) ? "checked" : ""}>
  <span>${day.toUpperCase()}</span>
</label>`).join("")}
    </div>
  </div>

  <label class="planner-toggle">
    <input type="checkbox" name="active" ${current.active ? "checked" : ""}>
    <span>Ativo</span>
  </label>

  <div class="planner-modal-actions">
    <button class="planner-btn planner-btn-ghost" type="button" id="plannerDeleteReminderBtn">${reminderId ? "Apagar" : "Cancelar"}</button>
    <button class="planner-btn planner-btn-primary" type="submit">Salvar</button>
  </div>
</form>
`);

        const form = document.getElementById("plannerReminderForm");
        form?.addEventListener("submit", (event) => {
            event.preventDefault();
            this.saveQuickReminderFromForm(new FormData(form));
        });

        document.getElementById("plannerDeleteReminderBtn")?.addEventListener("click", () => {
            if (!reminderId) {
                this.closeModal();
                return;
            }

            this.deleteQuickReminder(reminderId);
        });

        this.modalEl?.querySelectorAll(".planner-chip input").forEach(input => {
            input.addEventListener("change", () => {
                input.closest(".planner-chip")?.classList.toggle("is-active", input.checked);
            });
        });
    },

    saveQuickReminderFromForm(formData) {
        const reminderId = String(formData.get("reminderId") || "");
        const time = String(formData.get("time") || "").trim();
        const title = String(formData.get("title") || "").trim();
        const days = formData.getAll("days").map(value => String(value));

        if (!time) {
            this.showToast("Escolha um horario para o lembrete.");
            return;
        }

        if (!days.length) {
            this.showToast("Escolha pelo menos um dia da semana.");
            return;
        }

        const [hour, minute] = time.split(":");
        const payload = {
            id: reminderId || `${Date.now()}-${Math.random().toString(16).slice(2, 8)}`,
            title: title || "Lembrete rapido",
            hour: String(hour || "07").padStart(2, "0"),
            minute: String(minute || "00").padStart(2, "0"),
            days,
            reminderMinutes: Number(formData.get("reminderMinutes") || 0),
            active: formData.get("active") === "on"
        };

        const index = this.quickReminders.findIndex(item => String(item.id) === reminderId);

        if (index >= 0) {
            this.quickReminders[index] = payload;
        } else {
            this.quickReminders.unshift(payload);
        }

        this.saveQuickReminders();
        this.closeModal();
        this.render();
        this.emitReminderUpdate();
        this.showToast("Lembrete rapido salvo.");
    },

    deleteQuickReminder(reminderId) {
        this.quickReminders = this.quickReminders.filter(item => String(item.id) !== String(reminderId));
        this.saveQuickReminders();
        this.closeModal();
        this.render();
        this.emitReminderUpdate();
        this.showToast("Lembrete removido.");
    },

    setModalContent(html) {
        if (!this.modalEl || !this.modalContent) return;

        this.modalContent.innerHTML = html;
        this.modalEl.classList.remove("hidden");
        this.modalEl.setAttribute("aria-hidden", "false");
    },

    closeModal() {
        if (!this.modalEl || !this.modalContent) return;

        this.modalEl.classList.add("hidden");
        this.modalEl.setAttribute("aria-hidden", "true");
        this.modalContent.innerHTML = "";
    },

    requestNotificationPermission() {
        if (!("Notification" in window)) {
            this.showToast("Seu navegador não suporta notificações.");
            return;
        }

        Notification.requestPermission().then(() => {
            this.render();
            this.showToast(this.getNotificationPillLabel());
        });
    },

    getNotificationButtonLabel() {
        if (!("Notification" in window)) return "Notificações indisponíveis";
        if (Notification.permission === "granted") return "Notificações ativas";
        if (Notification.permission === "denied") return "Notificações bloqueadas";
        return "Permitir notificações";
    },

    getNotificationPillLabel() {
        if (!("Notification" in window)) return "Sem suporte";
        if (Notification.permission === "granted") return "Desktop ativo";
        if (Notification.permission === "denied") return "Bloqueado";
        return "Pedir permissao";
    },

    getNotificationPillClass() {
        if (!("Notification" in window)) return "is-neutral";
        if (Notification.permission === "granted") return "is-on";
        if (Notification.permission === "denied") return "is-off";
        return "is-neutral";
    },

    startNotificationWatcher() {
        if (this.notificationTimer) {
            clearInterval(this.notificationTimer);
        }

        this.checkNotifications();
        this.notificationTimer = setInterval(() => {
            this.checkNotifications();
        }, 15000);
    },

    checkNotifications() {
        const now = new Date();
        const currentMinuteStamp = new Date(
            now.getFullYear(),
            now.getMonth(),
            now.getDate(),
            now.getHours(),
            now.getMinutes(),
            0,
            0
        ).getTime();

        Object.entries(this.data).forEach(([key, eventData]) => {
            const trigger = this.getCalendarTriggerTimestamp(key, eventData);
            if (!trigger) return;

            const triggerKey = `event:${key}:${eventData.hour}${eventData.minute}:${eventData.reminderMinutes || 0}`;

            if (currentMinuteStamp === trigger && !this.notifiedMap[triggerKey]) {
                const { year, month, day } = this.parseKey(key);
                this.fireReminder(
                    eventData.title || "Lembrete",
                    `${this.formatDateLabel(year, month, day)} • ${eventData.hour}:${eventData.minute}`,
                    triggerKey
                );
            }
        });

        this.quickReminders.forEach(reminder => {
            if (!reminder.active) return;

            const weekday = this.days[now.getDay()];
            if (!reminder.days.includes(weekday)) return;

            const eventMinutes = Number(reminder.hour) * 60 + Number(reminder.minute);
            const triggerMinutes = eventMinutes - Number(reminder.reminderMinutes || 0);
            const currentMinutes = now.getHours() * 60 + now.getMinutes();
            const triggerKey = `quick:${now.getFullYear()}-${now.getMonth()}-${now.getDate()}:${reminder.id}:${triggerMinutes}`;

            if (currentMinutes === triggerMinutes && !this.notifiedMap[triggerKey]) {
                this.fireReminder(
                    reminder.title || "Lembrete rapido",
                    `${reminder.hour}:${reminder.minute} • ${this.formatDays(reminder.days)}`,
                    triggerKey
                );
            }
        });
    },

    getCalendarTriggerTimestamp(key, eventData) {
        const { year, month, day } = this.parseKey(key);

        if (!eventData.hour || !eventData.minute) return null;

        const eventDate = new Date(
            year,
            month,
            day,
            Number(eventData.hour),
            Number(eventData.minute),
            0,
            0
        );

        return eventDate.getTime() - (Number(eventData.reminderMinutes || 0) * 60 * 1000);
    },

    fireReminder(title, body, key) {
        this.notifiedMap[key] = Date.now();
        this.saveNotifiedMap();

        if ("Notification" in window && Notification.permission === "granted") {
            try {
                new Notification(title, {
                    body,
                    tag: key,
                    silent: false
                });
            } catch {
                // Keep toast fallback below.
            }
        }

        this.playReminderTone();
        if (navigator.vibrate) {
            navigator.vibrate([70, 50, 90]);
        }

        this.showToast(`${title} • ${body}`);
    },

    playReminderTone() {
        const audio = new Audio("https://actions.google.com/sounds/v1/alarms/beep_short.ogg");
        audio.volume = 0.4;
        audio.play().catch(() => {});
    },

    showToast(message) {
        if (!this.toastHost) return;

        const toast = document.createElement("div");
        toast.className = "planner-toast";
        toast.textContent = message;
        this.toastHost.appendChild(toast);

        requestAnimationFrame(() => {
            toast.classList.add("is-visible");
        });

        setTimeout(() => {
            toast.classList.remove("is-visible");
            setTimeout(() => {
                toast.remove();
            }, 220);
        }, 4200);
    },

    saveEvents() {
        localStorage.setItem(this.eventStorageKey, JSON.stringify(this.data));
    },

    saveQuickReminders() {
        localStorage.setItem(this.reminderStorageKey, JSON.stringify(this.quickReminders));
    },

    saveNotifiedMap() {
        localStorage.setItem(this.notificationStorageKey, JSON.stringify(this.notifiedMap));
    },

    emitReminderUpdate() {
        document.dispatchEvent(new CustomEvent("planner:reminders-updated"));
    },

    createKey(year, month, day) {
        return `${year}-${month}-${day}`;
    },

    parseKey(key) {
        const [year, month, day] = String(key).split("-").map(Number);
        return { year, month, day };
    },

    formatDateLabel(year, month, day) {
        return new Date(year, month, day).toLocaleDateString("pt-BR", {
            weekday: "long",
            day: "2-digit",
            month: "long"
        });
    },

    formatDays(days) {
        return days.map(day => day.toUpperCase()).join(" • ");
    },

    renderSelectOptions(options, currentValue) {
        return options.map(([value, label]) => `
<option value="${value}" ${String(currentValue) === String(value) ? "selected" : ""}>${label}</option>
`).join("");
    },

    capitalize(text) {
        return text.charAt(0).toUpperCase() + text.slice(1);
    },

    escapeHtml(text) {
        return String(text || "")
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#39;");
    },

    getQuickReminders() {
        return [...this.quickReminders];
    }
};

document.addEventListener("DOMContentLoaded", () => {
    Calendar.init();
});

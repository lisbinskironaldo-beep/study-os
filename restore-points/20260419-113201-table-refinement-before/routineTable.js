/* =====================================================
   ROTANOTA ROUTINE TABLE V2
   Weekly routine planner kept separate from the legacy QTS.
===================================================== */

const RoutineTable = {

    storageKey: "rotanota_routine_table_v2",
    activeCell: null,

    days: [
        { key: "mon", short: "Seg", label: "Segunda" },
        { key: "tue", short: "Ter", label: "Terca" },
        { key: "wed", short: "Qua", label: "Quarta" },
        { key: "thu", short: "Qui", label: "Quinta" },
        { key: "fri", short: "Sex", label: "Sexta" },
        { key: "sat", short: "Sab", label: "Sabado" },
        { key: "sun", short: "Dom", label: "Domingo" }
    ],

    methods: {
        free: {
            label: "Livre",
            study: 60,
            break: 0
        },
        p25: {
            label: "25/5",
            study: 25,
            break: 5
        },
        p50: {
            label: "50/10",
            study: 50,
            break: 10
        },
        p52: {
            label: "52/17",
            study: 52,
            break: 17
        },
        p90: {
            label: "90/30",
            study: 90,
            break: 30
        }
    },

    state: null,

    createDefaultState() {
        return {
            start: "08:00",
            end: "12:00",
            method: "p50",
            activeDay: "mon",
            visibleDays: {
                mon: true,
                tue: true,
                wed: true,
                thu: true,
                fri: true,
                sat: false,
                sun: false
            },
            rows: [
                this.createRow("08:00", "08:50"),
                this.createRow("08:50", "09:00", true),
                this.createRow("09:00", "09:50")
            ]
        };
    },

    createRow(start = "08:00", end = "08:50", interval = false) {
        const cells = {};

        this.days.forEach((day) => {
            cells[day.key] = interval ? "Intervalo" : "";
        });

        return {
            id: this.createId(),
            start,
            end,
            interval,
            cells
        };
    },

    createId() {
        return `rt-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
    },

    load() {
        try {
            const saved =
                JSON.parse(localStorage.getItem(this.storageKey) || "null");

            if (saved && Array.isArray(saved.rows)) {
                this.state = this.normalizeState(saved);
                return;
            }
        } catch (error) {
            console.warn("Falha ao carregar rotina V2", error);
        }

        this.state = this.createDefaultState();
        this.save();
    },

    normalizeState(state) {
        const defaults = this.createDefaultState();
        const visibleDays = {
            ...defaults.visibleDays,
            ...(state.visibleDays || {})
        };

        const activeDay =
            visibleDays[state.activeDay] ? state.activeDay : "mon";

        const rows = (state.rows || []).map((row) => {
            const cells = {};

            this.days.forEach((day) => {
                cells[day.key] =
                    typeof row.cells?.[day.key] === "string"
                        ? row.cells[day.key]
                        : "";
            });

            return {
                id: row.id || this.createId(),
                start: this.normalizeTime(row.start) || "08:00",
                end: this.normalizeTime(row.end) || "08:50",
                interval: Boolean(row.interval),
                cells
            };
        });

        return {
            ...defaults,
            ...state,
            visibleDays,
            activeDay,
            rows: rows.length ? rows : defaults.rows
        };
    },

    save() {
        if (!this.state) return;
        localStorage.setItem(this.storageKey, JSON.stringify(this.state));
    },

    render() {
        this.load();

        const module =
            document.getElementById("routineModule");

        if (!module) return;

        module.innerHTML = `
            <section class="routine-v2-shell">
                <div class="routine-v2-hero">
                    <div>
                        <div class="routine-v2-kicker">Rotina semanal</div>
                        <h2>Monte uma semana que cabe na sua vida.</h2>
                        <p>Organize dias, horarios, materias e intervalos sem prender o Pomodoro a tabela.</p>
                    </div>
                    <div class="routine-v2-actions">
                        <button type="button" class="routine-v2-secondary" data-action="legacy">
                            Tabela antiga
                        </button>
                        <button type="button" class="routine-v2-primary" data-action="generate">
                            Gerar horarios
                        </button>
                    </div>
                </div>

                ${this.renderSetup()}
                ${this.renderMobileDayTabs()}
                ${this.renderGrid()}
            </section>
        `;

        this.bind();
    },

    renderSetup() {
        const methodOptions =
            Object.entries(this.methods)
                .map(([key, method]) => `
                    <button type="button" class="routine-method${this.state.method === key ? " is-active" : ""}" data-method="${key}">
                        ${method.label}
                    </button>
                `)
                .join("");

        const dayToggles =
            this.days
                .map((day) => `
                    <button type="button" class="routine-day-toggle${this.state.visibleDays[day.key] ? " is-active" : ""}" data-day-toggle="${day.key}">
                        ${day.short}
                    </button>
                `)
                .join("");

        return `
            <section class="routine-v2-setup">
                <div class="routine-control-card">
                    <span>Dias da rotina</span>
                    <div class="routine-day-toggle-row">${dayToggles}</div>
                </div>
                <label class="routine-control-card">
                    <span>Inicio</span>
                    <input id="routineStart" type="time" value="${this.state.start}">
                </label>
                <label class="routine-control-card">
                    <span>Fim</span>
                    <input id="routineEnd" type="time" value="${this.state.end}">
                </label>
                <div class="routine-control-card is-wide">
                    <span>Ritmo para gerar blocos</span>
                    <div class="routine-method-row">${methodOptions}</div>
                </div>
            </section>
        `;
    },

    renderMobileDayTabs() {
        const tabs =
            this.getVisibleDays()
                .map((day) => `
                    <button type="button" class="routine-mobile-day${this.state.activeDay === day.key ? " is-active" : ""}" data-active-day="${day.key}">
                        ${day.short}
                    </button>
                `)
                .join("");

        return `<div class="routine-mobile-days">${tabs}</div>`;
    },

    renderGrid() {
        const visibleDays = this.getVisibleDays();
        const columns = `104px repeat(${visibleDays.length}, minmax(132px, 1fr)) 46px`;

        return `
            <section class="routine-v2-board" style="--routine-columns:${columns}" data-active-day="${this.state.activeDay}">
                <div class="routine-board-toolbar">
                    <button type="button" data-action="add-row">+ Linha</button>
                    <button type="button" data-action="add-interval">+ Intervalo</button>
                    <button type="button" data-action="clear-empty">Limpar vazias</button>
                    <span>Tab ou Ctrl + setas para navegar. Enter quebra linha.</span>
                </div>
                <div class="routine-grid" role="grid" aria-label="Rotina semanal editavel">
                    <div class="routine-head is-time">Horario</div>
                    ${visibleDays.map((day) => `
                        <div class="routine-head routine-day-col" data-day="${day.key}">${day.label}</div>
                    `).join("")}
                    <div class="routine-head is-action"></div>
                    ${this.state.rows.map((row, rowIndex) => this.renderRow(row, rowIndex, visibleDays)).join("")}
                </div>
            </section>
        `;
    },

    renderRow(row, rowIndex, visibleDays) {
        return `
            <div class="routine-time-cell${row.interval ? " is-interval" : ""}" data-row="${row.id}">
                <input type="time" value="${row.start}" data-time="${row.id}" data-time-field="start" aria-label="Inicio da linha ${rowIndex + 1}">
                <span></span>
                <input type="time" value="${row.end}" data-time="${row.id}" data-time-field="end" aria-label="Fim da linha ${rowIndex + 1}">
            </div>
            ${visibleDays.map((day) => `
                <div class="routine-cell-wrap routine-day-cell${row.interval ? " is-interval" : ""}" data-day="${day.key}">
                    <div class="routine-cell"
                        role="gridcell"
                        contenteditable="true"
                        spellcheck="false"
                        data-row-index="${rowIndex}"
                        data-row-id="${row.id}"
                        data-day="${day.key}"
                        aria-label="${day.label}, ${row.start} ate ${row.end}">${this.escapeHtml(row.cells[day.key] || "")}</div>
                </div>
            `).join("")}
            <div class="routine-row-actions">
                <button type="button" title="Remover linha" aria-label="Remover linha" data-delete-row="${row.id}">x</button>
            </div>
        `;
    },

    bind() {
        const module =
            document.getElementById("routineModule");

        if (!module) return;

        module.querySelectorAll("[data-action]").forEach((button) => {
            button.addEventListener("click", () => {
                this.handleAction(button.dataset.action);
            });
        });

        module.querySelectorAll("[data-method]").forEach((button) => {
            button.addEventListener("click", () => {
                this.state.method = button.dataset.method;
                this.save();
                this.render();
            });
        });

        module.querySelectorAll("[data-day-toggle]").forEach((button) => {
            button.addEventListener("click", () => {
                this.toggleDay(button.dataset.dayToggle);
            });
        });

        module.querySelectorAll("[data-active-day]").forEach((button) => {
            button.addEventListener("click", () => {
                this.state.activeDay = button.dataset.activeDay;
                this.save();
                this.render();
            });
        });

        module.querySelectorAll("[data-time]").forEach((input) => {
            input.addEventListener("change", () => {
                this.updateRowTime(
                    input.dataset.time,
                    input.dataset.timeField,
                    input.value
                );
            });
        });

        const startInput =
            module.querySelector("#routineStart");
        const endInput =
            module.querySelector("#routineEnd");

        if (startInput) {
            startInput.addEventListener("change", () => {
                this.state.start = startInput.value || this.state.start;
                this.save();
            });
        }

        if (endInput) {
            endInput.addEventListener("change", () => {
                this.state.end = endInput.value || this.state.end;
                this.save();
            });
        }

        module.querySelectorAll("[data-delete-row]").forEach((button) => {
            button.addEventListener("click", () => {
                this.deleteRow(button.dataset.deleteRow);
            });
        });

        module.querySelectorAll(".routine-cell").forEach((cell) => {
            cell.addEventListener("input", () => {
                this.updateCell(cell);
            });

            cell.addEventListener("focus", () => {
                this.activeCell = {
                    rowIndex: Number(cell.dataset.rowIndex),
                    day: cell.dataset.day
                };
            });

            cell.addEventListener("keydown", (event) => {
                this.handleCellKeydown(event, cell);
            });
        });
    },

    handleAction(action) {
        if (action === "legacy" && typeof Core !== "undefined") {
            Core.navigate("qts");
            return;
        }

        if (action === "generate") {
            this.generateRows();
            return;
        }

        if (action === "add-row") {
            this.addRow();
            return;
        }

        if (action === "add-interval") {
            this.addInterval();
            return;
        }

        if (action === "clear-empty") {
            this.clearEmptyRows();
        }
    },

    toggleDay(dayKey) {
        const currentlyVisible =
            Boolean(this.state.visibleDays[dayKey]);
        const visibleCount =
            this.getVisibleDays().length;

        if (currentlyVisible && visibleCount <= 1) return;

        this.state.visibleDays[dayKey] = !currentlyVisible;

        if (!this.state.visibleDays[this.state.activeDay]) {
            this.state.activeDay = this.getVisibleDays()[0]?.key || "mon";
        }

        this.save();
        this.render();
    },

    updateRowTime(rowId, field, value) {
        const row =
            this.state.rows.find((item) => item.id === rowId);

        if (!row || !this.normalizeTime(value)) return;

        row[field] = value;
        this.save();
    },

    updateCell(cell) {
        const row =
            this.state.rows[Number(cell.dataset.rowIndex)];

        if (!row) return;

        row.cells[cell.dataset.day] =
            cell.innerText.trim();

        this.save();
    },

    handleCellKeydown(event, cell) {
        if (event.key === "Tab") {
            event.preventDefault();
            this.focusRelativeCell(cell, event.shiftKey ? -1 : 1);
            return;
        }

        if (event.key === "Enter" && event.ctrlKey) {
            event.preventDefault();
            this.addRow(Number(cell.dataset.rowIndex) + 1);
            return;
        }

        if (!event.key.startsWith("Arrow")) return;

        const shouldNavigate =
            event.ctrlKey ||
            event.altKey ||
            cell.innerText.trim().length === 0;

        if (!shouldNavigate) return;

        event.preventDefault();
        this.focusByArrow(cell, event.key);
    },

    focusRelativeCell(cell, step) {
        const cells =
            Array.from(document.querySelectorAll("#routineModule .routine-cell"));
        const index =
            cells.indexOf(cell);

        if (index === -1) return;

        const next =
            cells[index + step] || cells[step > 0 ? 0 : cells.length - 1];

        this.focusCell(next);
    },

    focusByArrow(cell, key) {
        const visibleDays =
            this.getVisibleDays().map((day) => day.key);
        const rowIndex =
            Number(cell.dataset.rowIndex);
        const dayIndex =
            visibleDays.indexOf(cell.dataset.day);

        let nextRow = rowIndex;
        let nextDay = dayIndex;

        if (key === "ArrowUp") nextRow--;
        if (key === "ArrowDown") nextRow++;
        if (key === "ArrowLeft") nextDay--;
        if (key === "ArrowRight") nextDay++;

        nextRow =
            Math.max(0, Math.min(this.state.rows.length - 1, nextRow));
        nextDay =
            Math.max(0, Math.min(visibleDays.length - 1, nextDay));

        const next =
            document.querySelector(
                `#routineModule .routine-cell[data-row-index="${nextRow}"][data-day="${visibleDays[nextDay]}"]`
            );

        this.focusCell(next);
    },

    focusCell(cell) {
        if (!cell) return;

        cell.focus();

        const range =
            document.createRange();
        range.selectNodeContents(cell);
        range.collapse(false);

        const selection =
            window.getSelection();
        selection.removeAllRanges();
        selection.addRange(range);
    },

    generateRows() {
        const method =
            this.methods[this.state.method] || this.methods.p50;
        const start =
            this.timeToMinutes(this.state.start);
        const end =
            this.timeToMinutes(this.state.end);

        if (end <= start) return;

        const rows = [];
        let cursor = start;

        while (cursor < end && rows.length < 42) {
            const studyEnd =
                Math.min(cursor + method.study, end);

            rows.push(
                this.createRow(
                    this.minutesToTime(cursor),
                    this.minutesToTime(studyEnd),
                    false
                )
            );

            cursor = studyEnd;

            if (method.break > 0 && cursor < end) {
                const breakEnd =
                    Math.min(cursor + method.break, end);

                rows.push(
                    this.createRow(
                        this.minutesToTime(cursor),
                        this.minutesToTime(breakEnd),
                        true
                    )
                );

                cursor = breakEnd;
            }
        }

        this.state.rows = rows.length ? rows : this.state.rows;
        this.save();
        this.render();
    },

    addRow(index = null) {
        const position =
            Number.isInteger(index) ? index : this.state.rows.length;
        const previous =
            this.state.rows[Math.max(0, position - 1)];
        const start =
            previous?.end || this.state.start || "08:00";
        const end =
            this.minutesToTime(this.timeToMinutes(start) + 50);

        this.state.rows.splice(
            position,
            0,
            this.createRow(start, end, false)
        );

        this.save();
        this.render();
    },

    addInterval() {
        const previous =
            this.state.rows[this.state.rows.length - 1];
        const start =
            previous?.end || this.state.start || "08:00";
        const method =
            this.methods[this.state.method] || this.methods.p50;
        const length =
            method.break || 10;
        const end =
            this.minutesToTime(this.timeToMinutes(start) + length);

        this.state.rows.push(this.createRow(start, end, true));
        this.save();
        this.render();
    },

    deleteRow(rowId) {
        if (this.state.rows.length <= 1) return;

        this.state.rows =
            this.state.rows.filter((row) => row.id !== rowId);

        this.save();
        this.render();
    },

    clearEmptyRows() {
        const hasContent = (row) =>
            row.interval ||
            Object.values(row.cells || {})
                .some((value) => String(value || "").trim());

        const nextRows =
            this.state.rows.filter(hasContent);

        this.state.rows =
            nextRows.length ? nextRows : [this.createRow()];

        this.save();
        this.render();
    },

    getVisibleDays() {
        return this.days.filter((day) => this.state.visibleDays[day.key]);
    },

    normalizeTime(value) {
        return /^\d{2}:\d{2}$/.test(String(value || ""))
            ? value
            : null;
    },

    timeToMinutes(value) {
        const safe =
            this.normalizeTime(value) || "00:00";
        const [hours, minutes] =
            safe.split(":").map(Number);

        return (hours * 60) + minutes;
    },

    minutesToTime(totalMinutes) {
        const normalized =
            Math.max(0, Math.min(totalMinutes, 23 * 60 + 59));
        const hours =
            Math.floor(normalized / 60);
        const minutes =
            normalized % 60;

        return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
    },

    escapeHtml(value = "") {
        return String(value)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

};

window.RoutineTable = RoutineTable;

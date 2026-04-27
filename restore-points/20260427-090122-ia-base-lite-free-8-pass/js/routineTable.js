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

    render(options = {}) {
        const gridScrollState =
            options.preserveGridScroll ? this.getGridScrollState() : null;

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
                        <p>Organize dias, horarios, materias e intervalos sem prender a rotina ao Pomodoro.</p>
                    </div>
                    <div class="routine-v2-actions">
                        <button type="button" class="routine-v2-secondary" data-action="print">
                            Imprimir
                        </button>
                        <button type="button" class="routine-v2-secondary" data-action="legacy">
                            Tabela classica
                        </button>
                    </div>
                </div>

                ${this.renderSetup()}
                ${this.renderMobileDayTabs()}
                ${this.renderGrid()}
            </section>
        `;

        this.bind();
        this.restoreGridScroll(gridScrollState);
    },

    getGridScrollState() {
        const scroller =
            document.querySelector("#routineModule .routine-grid-scroll");

        if (!scroller) return null;

        return {
            left: scroller.scrollLeft,
            top: scroller.scrollTop
        };
    },

    restoreGridScroll(state) {
        if (!state) return;

        const apply = () => {
            const scroller =
                document.querySelector("#routineModule .routine-grid-scroll");

            if (!scroller) return;

            const maxLeft =
                Math.max(0, scroller.scrollWidth - scroller.clientWidth);

            scroller.scrollLeft =
                Math.min(Math.max(0, state.left), maxLeft);
            scroller.scrollTop =
                Math.max(0, state.top);
        };

        apply();
        requestAnimationFrame(apply);
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
                <label class="routine-control-card is-time-control">
                    <span>Inicio</span>
                    <input id="routineStart" type="time" value="${this.state.start}">
                </label>
                <label class="routine-control-card is-time-control">
                    <span>Fim</span>
                    <input id="routineEnd" type="time" value="${this.state.end}">
                </label>
                <div class="routine-control-card is-wide">
                    <span>Ritmo de atividade/descanso</span>
                    <div class="routine-method-row">${methodOptions}</div>
                </div>
                <div class="routine-control-card is-generate">
                    <span>Horario</span>
                    <button type="button" class="routine-v2-primary" data-action="generate">
                        Gerar horarios
                    </button>
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
        const visibleDays = this.getRenderableDays();
        const gridMinWidth =
            150 + (visibleDays.length * 112);

        return `
            <section class="routine-v2-board" style="--routine-visible-days:${visibleDays.length}; --routine-grid-min:${gridMinWidth}px" data-active-day="${this.state.activeDay}">
                <div class="routine-board-toolbar">
                    <button type="button" data-action="add-row">+ Linha</button>
                    <button type="button" data-action="add-interval">+ Intervalo</button>
                    <button type="button" data-action="clear-empty">Limpar vazias</button>
                    <span>Tab ou Ctrl + setas para navegar. Enter quebra linha.</span>
                </div>
                <div class="routine-grid-scroll">
                    <div class="routine-grid" role="grid" aria-label="Rotina semanal editavel">
                        <div class="routine-head is-time">Horario</div>
                        ${visibleDays.map((day) => `
                            <div class="routine-head routine-day-col" data-day="${day.key}" data-day-short="${day.short}">${day.label}</div>
                        `).join("")}
                        <div class="routine-head is-action"></div>
                        ${this.state.rows.map((row, rowIndex) => this.renderRow(row, rowIndex, visibleDays)).join("")}
                    </div>
                </div>
            </section>
        `;
    },

    renderRow(row, rowIndex, visibleDays) {
        return `
            <div class="routine-time-cell${row.interval ? " is-interval" : ""}" data-row="${row.id}">
                <input type="text" inputmode="numeric" pattern="\\d{2}:\\d{2}" value="${row.start}" data-time="${row.id}" data-time-field="start" aria-label="Inicio da linha ${rowIndex + 1}">
                <span></span>
                <input type="text" inputmode="numeric" pattern="\\d{2}:\\d{2}" value="${row.end}" data-time="${row.id}" data-time-field="end" aria-label="Fim da linha ${rowIndex + 1}">
            </div>
            ${visibleDays.map((day) => `
                <div class="routine-cell-wrap routine-day-cell${row.interval ? " is-interval" : ""}" data-day="${day.key}">
                    <textarea class="routine-cell"
                        role="gridcell"
                        tabindex="0"
                        spellcheck="false"
                        data-row-index="${rowIndex}"
                        data-row-id="${row.id}"
                        data-day="${day.key}"
                        aria-label="${day.label}, ${row.start} ate ${row.end}">${this.escapeHtml(row.cells[day.key] || "")}</textarea>
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
            const focusCellInput = () => {
                if (document.activeElement !== cell) {
                    cell.focus({ preventScroll: true });
                }

                if (typeof cell.setSelectionRange === "function") {
                    const end =
                        this.getCellText(cell).length;
                    cell.setSelectionRange(end, end);
                }
            };

            const beginCellEdit = (event) => {
                event.stopPropagation();

                if (document.activeElement === cell) {
                    return;
                }

                event.preventDefault();
                focusCellInput();
            };

            cell.addEventListener("pointerdown", beginCellEdit);
            cell.addEventListener("mousedown", beginCellEdit);
            cell.addEventListener("click", (event) => {
                event.stopPropagation();
                focusCellInput();
            });

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

        if (action === "print") {
            this.print();
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

        if (action === "remove-row") {
            this.removeLastRow();
            return;
        }

        if (action === "add-interval") {
            this.addInterval();
            return;
        }

        if (action === "remove-interval") {
            this.removeLastInterval();
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
            this.getCellText(cell).trim();

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
            this.getCellText(cell).trim().length === 0;

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

        if (typeof cell.setSelectionRange === "function") {
            const end =
                this.getCellText(cell).length;
            cell.setSelectionRange(end, end);
            return;
        }

        const range =
            document.createRange();
        range.selectNodeContents(cell);
        range.collapse(false);

        const selection =
            window.getSelection();
        selection.removeAllRanges();
        selection.addRange(range);
    },

    getCellText(cell) {
        if (!cell) return "";
        return typeof cell.value === "string"
            ? cell.value
            : cell.innerText || "";
    },

    generateRows() {
        const method =
            this.methods[this.state.method] || this.methods.p50;
        const start =
            this.timeToMinutes(this.state.start);
        const end =
            this.timeToMinutes(this.state.end);
        const maxStudyRows = 4;
        const maxIntervalRows = 3;

        if (end <= start) return;

        const rows = [];
        let cursor = start;
        let studyRows = 0;
        let intervalRows = 0;

        while (cursor < end && studyRows < maxStudyRows) {
            const studyEnd =
                Math.min(cursor + method.study, end);

            rows.push(
                this.createRow(
                    this.minutesToTime(cursor),
                    this.minutesToTime(studyEnd),
                    false
                )
            );

            studyRows++;
            cursor = studyEnd;

            if (
                method.break > 0 &&
                cursor < end &&
                intervalRows < maxIntervalRows
            ) {
                const breakEnd =
                    Math.min(cursor + method.break, end);

                rows.push(
                    this.createRow(
                        this.minutesToTime(cursor),
                        this.minutesToTime(breakEnd),
                        true
                    )
                );

                intervalRows++;
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
        this.render({ preserveGridScroll: true });
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
        this.render({ preserveGridScroll: true });
    },

    deleteRow(rowId) {
        if (this.state.rows.length <= 1) return;

        this.state.rows =
            this.state.rows.filter((row) => row.id !== rowId);

        this.save();
        this.render({ preserveGridScroll: true });
    },

    removeLastRow() {
        const index =
            [...this.state.rows]
                .map((row, rowIndex) => ({ row, rowIndex }))
                .reverse()
                .find((item) => !item.row.interval)?.rowIndex;

        if (!Number.isInteger(index)) return;

        this.deleteRow(this.state.rows[index].id);
    },

    removeLastInterval() {
        const index =
            [...this.state.rows]
                .map((row, rowIndex) => ({ row, rowIndex }))
                .reverse()
                .find((item) => item.row.interval)?.rowIndex;

        if (!Number.isInteger(index)) return;

        this.deleteRow(this.state.rows[index].id);
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
        this.render({ preserveGridScroll: true });
    },

    print() {
        const visibleDays =
            this.getVisibleDays();
        const rows =
            this.state.rows || [];
        const header =
            visibleDays
                .map((day) => `<th>${this.escapeHtml(day.label)}</th>`)
                .join("");
        const body =
            rows
                .map((row) => {
                    const cells =
                        visibleDays
                            .map((day) => {
                                const value =
                                    row.cells?.[day.key] || "";

                                return `<td>${this.escapeHtml(value).replace(/\n/g, "<br>")}</td>`;
                            })
                            .join("");

                    return `
                        <tr class="${row.interval ? "is-interval" : ""}">
                            <th class="time">${this.escapeHtml(row.start)} - ${this.escapeHtml(row.end)}</th>
                            ${cells}
                        </tr>
                    `;
                })
                .join("");
        const win =
            window.open("", "", "width=1100,height=760");

        if (!win) return;

        win.document.write(`
            <html>
            <head>
                <title>Rotina semanal</title>
                <style>
                    * {
                        box-sizing: border-box;
                    }

                    body {
                        margin: 0;
                        padding: 18px;
                        color: #172033;
                        background: #ffffff;
                        font-family: Arial, sans-serif;
                    }

                    h1 {
                        margin: 0 0 14px;
                        text-align: center;
                        font-size: 24px;
                    }

                    table {
                        width: 100%;
                        border-collapse: collapse;
                        table-layout: fixed;
                    }

                    th,
                    td {
                        min-height: 34px;
                        padding: 8px;
                        border: 1px solid #c8ced8;
                        vertical-align: top;
                        font-size: 12px;
                        line-height: 1.25;
                        text-align: left;
                        overflow-wrap: anywhere;
                    }

                    thead th {
                        background: #e9eef5;
                        text-align: center;
                        font-weight: 700;
                    }

                    th.time {
                        width: 92px;
                        background: #f2f6ff;
                        text-align: center;
                        white-space: nowrap;
                        font-weight: 700;
                    }

                    tr.is-interval th,
                    tr.is-interval td {
                        background: #f3efd9;
                        color: #5e4b1d;
                        font-style: italic;
                    }

                    @media print {
                        body {
                            padding: 10mm;
                        }

                        h1 {
                            font-size: 20px;
                        }
                    }
                </style>
            </head>
            <body>
                <h1>Rotina semanal</h1>
                <table>
                    <thead>
                        <tr>
                            <th class="time">Horario</th>
                            ${header}
                        </tr>
                    </thead>
                    <tbody>
                        ${body}
                    </tbody>
                </table>
            </body>
            </html>
        `);

        win.document.close();
        win.focus();
        win.print();
    },

    getVisibleDays() {
        return this.days.filter((day) => this.state.visibleDays[day.key]);
    },

    getRenderableDays() {
        const visibleDays =
            this.getVisibleDays();

        if (
            typeof window !== "undefined" &&
            typeof window.matchMedia === "function" &&
            window.matchMedia("(max-width: 520px) and (pointer: coarse)").matches
        ) {
            const activeDay =
                visibleDays.find((day) => day.key === this.state.activeDay);

            if (activeDay) {
                return [activeDay];
            }
        }

        return visibleDays;
    },

    normalizeTime(value) {
        const match =
            String(value || "").trim().match(/^(\d{1,2}):(\d{2})$/);

        if (!match) return null;

        const hours = Number(match[1]);
        const minutes = Number(match[2]);

        if (hours > 23 || minutes > 59) return null;

        return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
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

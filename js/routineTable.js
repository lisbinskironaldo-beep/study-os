/* =====================================================
   ROTANOTA ROUTINE TABLE V2
   Weekly routine planner kept separate from the legacy QTS.
===================================================== */

const RoutineTable = {

    storageKey: "rotanota_routine_table_v2",
    savedTablesKey: "rotanota_routine_saved_tables_v1",
    maxSavedTables: 10,
    activeCell: null,
    savedTablesMessage: "",

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
            tableName: "",
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

    loadSavedTables() {
        try {
            const saved =
                JSON.parse(localStorage.getItem(this.savedTablesKey) || "[]");

            if (!Array.isArray(saved)) return [];

            return saved
                .sort((a, b) => String(b.updatedAt || "").localeCompare(String(a.updatedAt || "")))
                .slice(0, this.maxSavedTables);
        } catch (error) {
            console.warn("Falha ao carregar tabelas salvas", error);
            return [];
        }
    },

    saveSavedTables(tables) {
        const limitedTables =
            [...tables]
                .sort((a, b) => String(b.updatedAt || "").localeCompare(String(a.updatedAt || "")))
                .slice(0, this.maxSavedTables);

        localStorage.setItem(this.savedTablesKey, JSON.stringify(limitedTables));
    },

    save() {
        if (!this.state) return;
        localStorage.setItem(this.storageKey, JSON.stringify(this.state));
    },

    render(options = {}) {
        if (!options.force && this.hasActiveEditor()) {
            return;
        }

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
                        ${this.renderActiveTableName()}
                        <h2>Monte uma semana que cabe na sua vida.</h2>
                        <p>Organize dias, horarios, materias e intervalos sem prender a rotina ao Pomodoro.</p>
                    </div>
                    <div class="routine-v2-actions">
                        <button type="button" class="routine-v2-secondary" data-action="print">
                            Imprimir
                        </button>
                    </div>
                </div>

                ${this.renderSetup()}
                ${this.renderSavedTables()}
                ${this.renderMobileDayTabs()}
                ${this.renderGrid()}
            </section>
        `;

        this.bind();
        this.restoreGridScroll(gridScrollState);
    },

    hasActiveEditor() {
        const module =
            document.getElementById("routineModule");
        const active =
            document.activeElement;

        if (!module || !active || !module.contains(active)) return false;

        return Boolean(
            active.matches(
                ".routine-cell, [data-time], #routineStart, #routineEnd, #routineTableName"
            )
        );
    },

    renderActiveTableName() {
        const name =
            String(this.state?.tableName || "").trim();

        if (!name) return "";

        return `<div class="routine-active-name">${this.escapeHtml(name.toUpperCase())}</div>`;
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

    renderSavedTables() {
        const savedTables =
            this.loadSavedTables();
        const savedList =
            savedTables.length
                ? savedTables
                    .map((table) => `
                        <div class="routine-saved-item" role="listitem">
                            <button type="button" class="routine-saved-load" data-load-saved="${this.escapeHtml(table.id)}" title="Carregar ${this.escapeHtml(table.name)}">
                                ${this.escapeHtml(table.name)}
                            </button>
                            <button type="button" class="routine-saved-delete" data-delete-saved="${this.escapeHtml(table.id)}" aria-label="Excluir ${this.escapeHtml(table.name)}">
                                Excluir
                            </button>
                        </div>
                    `)
                    .join("")
                : `<span class="routine-saved-empty">Nenhuma tabela salva ainda.</span>`;
        const message =
            this.savedTablesMessage ||
            `${savedTables.length}/${this.maxSavedTables} tabelas salvas`;

        return `
            <section class="routine-save-panel" aria-label="Salvar e buscar tabelas">
                <label class="routine-save-field">
                    <span>Nome da tabela</span>
                    <input id="routineTableName" type="text" maxlength="48" value="${this.escapeHtml(this.state.tableName || "")}" placeholder="Ex.: Semana de provas">
                </label>
                <button type="button" class="routine-v2-primary" data-action="save-table">Salvar tabela</button>
                <div class="routine-saved-panel">
                    <div class="routine-saved-head">
                        <span>Tabelas salvas</span>
                        <strong>${this.escapeHtml(message)}</strong>
                    </div>
                    <div class="routine-saved-list" role="list">${savedList}</div>
                </div>
            </section>
        `;
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
                    <button type="button" data-action="clear-empty">Limpar</button>
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
            input.addEventListener("input", () => {
                this.updateRowTime(
                    input.dataset.time,
                    input.dataset.timeField,
                    input.value
                );
            });

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

        const tableNameInput =
            module.querySelector("#routineTableName");

        if (tableNameInput) {
            tableNameInput.addEventListener("input", () => {
                this.state.tableName = tableNameInput.value.trim();
                this.save();
                this.updateActiveNameDisplay();
            });
        }

        module.querySelectorAll("[data-load-saved]").forEach((button) => {
            button.addEventListener("click", () => {
                this.loadSavedTableById(button.dataset.loadSaved);
            });
        });

        module.querySelectorAll("[data-delete-saved]").forEach((button) => {
            button.addEventListener("click", () => {
                this.deleteSavedTableById(button.dataset.deleteSaved);
            });
        });

        module.querySelectorAll("[data-delete-row]").forEach((button) => {
            button.addEventListener("click", () => {
                this.deleteRow(button.dataset.deleteRow);
            });
        });

        module.querySelectorAll(".routine-cell").forEach((cell) => {
            cell.addEventListener("input", () => {
                this.updateCell(cell);
                this.showSuggestions(cell);
            });

            cell.addEventListener("focus", () => {
                this.activeCell = {
                    rowIndex: Number(cell.dataset.rowIndex),
                    day: cell.dataset.day
                };
                this.showSuggestions(cell);
            });

            cell.addEventListener("blur", () => {
                window.setTimeout(() => this.hideSuggestions(), 120);
            });

            cell.addEventListener("keydown", (event) => {
                if (this.handleSuggestionKeys(event, cell)) return;
                this.handleCellKeydown(event, cell);
            });
        });
    },

    handleAction(action) {
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
            this.clearTableContent();
            return;
        }

        if (action === "save-table") {
            this.saveCurrentTable();
            return;
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

        row[field] = this.normalizeTime(value);
        this.save();
    },

    updateActiveNameDisplay() {
        const holder =
            document.querySelector("#routineModule .routine-active-name");
        const heroText =
            document.querySelector("#routineModule .routine-v2-hero h2");
        const name =
            String(this.state.tableName || "").trim();

        if (holder) {
            holder.textContent = name.toUpperCase();
            holder.hidden = !name;
            return;
        }

        if (name && heroText) {
            heroText.insertAdjacentHTML(
                "beforebegin",
                `<div class="routine-active-name">${this.escapeHtml(name.toUpperCase())}</div>`
            );
        }
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

    getCellSuggestions(cell) {
        const current =
            this.getCellText(cell);
        const cursor =
            typeof cell.selectionStart === "number" ? cell.selectionStart : current.length;
        const beforeCursor =
            current.slice(0, cursor);
        const tokenMatch =
            beforeCursor.match(/([\wÀ-ÿ]{2,})$/);
        const token =
            tokenMatch ? tokenMatch[1].toLowerCase() : "";
        const values = new Set();

        if (!token) return [];

        this.state.rows.forEach((row) => {
            Object.values(row.cells || {}).forEach((value) => {
                String(value || "")
                    .split(/[\n,;|]+/)
                    .map((item) => item.trim())
                    .filter(Boolean)
                    .forEach((item) => {
                        if (item !== current.trim()) values.add(item);

                        item.split(/\s+/)
                            .map((word) => word.trim())
                            .filter((word) => word.length >= 3)
                            .forEach((word) => values.add(word));
                    });
            });
        });

        return [...values]
            .filter((value) => {
                const normalized =
                    value.toLowerCase();

                if (!token) return value.length >= 3;
                return normalized !== token && normalized.startsWith(token);
            })
            .slice(0, 6);
    },

    showSuggestions(cell) {
        const suggestions =
            this.getCellSuggestions(cell);

        this.hideSuggestions();

        if (!suggestions.length || document.activeElement !== cell) return;

        const wrap =
            cell.closest(".routine-cell-wrap");

        if (!wrap) return;

        const box =
            document.createElement("div");

        box.className = "routine-suggestion-box";
        box.setAttribute("role", "listbox");
        box.innerHTML =
            suggestions
                .map((suggestion, index) => `
                    <button type="button" data-suggestion="${this.escapeHtml(suggestion)}" class="${index === 0 ? "is-active" : ""}">
                        ${this.escapeHtml(suggestion)}
                    </button>
                `)
                .join("");

        box.querySelectorAll("[data-suggestion]").forEach((button) => {
            button.addEventListener("mousedown", (event) => {
                event.preventDefault();
                this.applySuggestion(cell, button.dataset.suggestion || "");
            });
        });

        wrap.appendChild(box);
    },

    hideSuggestions() {
        document
            .querySelectorAll("#routineModule .routine-suggestion-box")
            .forEach((box) => box.remove());
    },

    handleSuggestionKeys(event, cell) {
        const box =
            document.querySelector("#routineModule .routine-suggestion-box");

        if (!box) return false;

        const buttons =
            Array.from(box.querySelectorAll("button"));
        const activeIndex =
            Math.max(0, buttons.findIndex((button) => button.classList.contains("is-active")));

        if (event.key === "ArrowDown" || event.key === "ArrowUp") {
            event.preventDefault();
            const nextIndex =
                event.key === "ArrowDown"
                    ? Math.min(buttons.length - 1, activeIndex + 1)
                    : Math.max(0, activeIndex - 1);

            buttons.forEach((button, index) => {
                button.classList.toggle("is-active", index === nextIndex);
            });
            return true;
        }

        if ((event.key === "Enter" || event.key === "Tab") && buttons[activeIndex]) {
            event.preventDefault();
            this.applySuggestion(cell, buttons[activeIndex].dataset.suggestion || "");
            return true;
        }

        if (event.key === "Escape") {
            this.hideSuggestions();
            return true;
        }

        return false;
    },

    applySuggestion(cell, suggestion) {
        const current =
            this.getCellText(cell);
        const start =
            typeof cell.selectionStart === "number" ? cell.selectionStart : current.length;
        const end =
            typeof cell.selectionEnd === "number" ? cell.selectionEnd : start;
        const before =
            current.slice(0, start);
        const after =
            current.slice(end);
        const tokenMatch =
            before.match(/([\wÀ-ÿ]{2,})$/);
        const replaceFrom =
            tokenMatch ? start - tokenMatch[1].length : start;
        const next =
            `${current.slice(0, replaceFrom)}${suggestion}${after}`;

        cell.value = next;
        cell.focus();
        cell.setSelectionRange(replaceFrom + suggestion.length, replaceFrom + suggestion.length);
        this.updateCell(cell);
        this.hideSuggestions();
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

    clearTableContent() {
        this.state.rows.forEach((row) => {
            this.days.forEach((day) => {
                row.cells[day.key] = "";
            });
        });
        this.save();
        this.render({ preserveGridScroll: true });
    },

    getTableSnapshot() {
        return JSON.parse(JSON.stringify({
            ...this.state,
            rows: this.state.rows
        }));
    },

    saveCurrentTable() {
        const input =
            document.querySelector("#routineModule #routineTableName");
        const name =
            String(input?.value || this.state.tableName || "").trim();

        if (!name) {
            input?.focus();
            return;
        }

        this.state.tableName = name;
        const tables =
            this.loadSavedTables();
        const existingIndex =
            tables.findIndex((table) => table.name.toLowerCase() === name.toLowerCase());

        if (existingIndex < 0 && tables.length >= this.maxSavedTables) {
            this.savedTablesMessage =
                `Limite de ${this.maxSavedTables} tabelas salvas. Exclua uma para criar outra.`;
            this.render({ preserveGridScroll: true });
            return;
        }

        const record = {
            id: existingIndex >= 0 ? tables[existingIndex].id : this.createId(),
            name,
            updatedAt: new Date().toISOString(),
            state: this.getTableSnapshot()
        };

        if (existingIndex >= 0) {
            tables[existingIndex] = record;
        } else {
            tables.push(record);
        }

        this.saveSavedTables(tables);
        this.savedTablesMessage = "Tabela salva.";
        this.save();
        this.render({ preserveGridScroll: true });
    },

    loadSavedTableById(id) {
        const table =
            this.loadSavedTables().find((item) => item.id === id);

        if (table) this.loadSavedTable(table);
    },

    loadSavedTable(table) {
        this.state = this.normalizeState({
            ...table.state,
            tableName: table.name
        });
        this.savedTablesMessage = "";
        this.save();
        this.render();
    },

    deleteSavedTableById(id) {
        const nextTables =
            this.loadSavedTables()
                .filter((item) => item.id !== id);

        this.savedTablesMessage = "Tabela excluida.";
        this.saveSavedTables(nextTables);
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

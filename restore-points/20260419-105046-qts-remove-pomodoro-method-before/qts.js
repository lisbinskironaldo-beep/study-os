const QTS = {

    maxTotalRows: 20,
    maxIntervals: 5,
    defaultInitialRows: 4,
    defaultInitialIntervals: 3,
    selection: {
        anchor: null,
        focus: null,
        pointerDown: false,
        dragging: false
    },
    autocomplete: {
        activeCell: null,
        items: [],
        highlightIndex: 0
    },

    data: JSON.parse(localStorage.getItem("qts_core_v6")) || {
        studyDuration: 25,
        showTimeColumn: false,
        showSunday: true,
        showSaturday: true,
        activeTemplate: "manual",
        summaryScope: "week",
        summaryVisible: false,
        summaryExpanded: false,
        hiddenRows: [],

        structure: [],
        grid: {}
    },

    days: [
        "Domingo","Segunda","Terca",
        "Quarta","Quinta","Sexta","Sabado"
    ],

    init() {
        this.normalize();
        this.bindSelectionRuntime();
        this.render();

    },

    bindSelectionRuntime() {
        if (this._selectionRuntimeBound) {
            return;
        }

        this._selectionRuntimeBound = true;

        document.addEventListener("pointerup", () => {
            this.finishTableSelection();
        });

        document.addEventListener("pointerdown", (e) => {
            const autocomplete =
                document.getElementById("qtsAutocomplete");

            if (
                autocomplete &&
                !autocomplete.contains(e.target)
            ) {
                this.hideAutocomplete();
            }
        });

        window.addEventListener("resize", () => {
            this.positionAutocomplete();
            this.syncResponsiveGridLayout();
        });
    },

    normalize() {

        if (!Array.isArray(this.data.structure))
            this.data.structure = [];

        if (!this.data.activeTemplate) {
            this.data.activeTemplate =
                this.inferActiveTemplate();
        }

        if (!this.data.summaryScope) {
            this.data.summaryScope = "week";
        }

        if (typeof this.data.summaryVisible !== "boolean") {
            this.data.summaryVisible = false;
        }

        if (typeof this.data.summaryExpanded !== "boolean") {
            this.data.summaryExpanded = false;
        }

        if (!Array.isArray(this.data.hiddenRows)) {
            this.data.hiddenRows = [];
        }

        if (
            !this.data.weeks ||
            typeof this.data.weeks !== "object"
        ) {
            this.data.weeks = {};
        }

        this.migrateDayKeys();

        if (this.data.structure.length === 0)
            this.data.structure =
                this.buildDefaultStructure();

        if (this.data.structure.length > this.maxTotalRows)
            this.data.structure =
                this.data.structure.slice(0, this.maxTotalRows);

        const currentWeekKey =
            this.getWeekKey(new Date());

        if (!this.data.weeks[currentWeekKey]) {
            this.data.weeks[currentWeekKey] =
                this.captureCurrentPlanState();
        }

        this.viewWeekDate =
            this.getWeekStart(new Date());
        this.applyWeekPlanToState(
            this.resolveWeekPlan(
                currentWeekKey,
                { ensureCurrent: true }
            )
        );

        this.save();
    },

    getWeekStart(date = new Date()) {
        const start = new Date(date);
        start.setHours(12, 0, 0, 0);
        start.setDate(start.getDate() - start.getDay());
        return start;
    },

    getDateForDay(dayName, date = new Date()) {
        const dayIndex = this.days.indexOf(dayName);

        if (dayIndex === -1) {
            return null;
        }

        const target = this.getWeekStart(date);
        target.setDate(target.getDate() + dayIndex);
        return target;
    },

    formatHeaderDate(date) {
        return new Intl.DateTimeFormat("pt-BR", {
            day: "2-digit",
            month: "short"
        })
            .format(date)
            .replace(".", "");
    },

    getResponsiveGridTemplate(
        visibleDays = this.getVisibleDays()
    ) {
        const columns =
            (this.data.showTimeColumn ? 1 : 0) +
            visibleDays.length;

        if (
            window.innerWidth > 1360 ||
            columns < 6
        ) {
            return `repeat(${columns}, 1fr)`;
        }

        const isPhone =
            window.innerWidth <= 760;
        const isVeryTight =
            window.innerWidth <= 900;
        const isTight =
            window.innerWidth <= 980;
        const isNarrowDesktop =
            window.innerWidth <= 1180;
        const isCompact =
            window.innerWidth <= 1280;
        const tracks = [];

        if (this.data.showTimeColumn) {
            const min =
                isPhone ? 40 : isVeryTight ? 44 : isTight ? 48 : isNarrowDesktop ? 56 : isCompact ? 62 : 72;
            const fr =
                isPhone ? 0.72 : isVeryTight ? 0.76 : isTight ? 0.8 : isNarrowDesktop ? 0.84 : isCompact ? 0.9 : 0.96;
            tracks.push(
                `minmax(${min}px, ${fr}fr)`
            );
        }

        visibleDays.forEach((_, index) => {
            const isFirstDay =
                !this.data.showTimeColumn &&
                index === 0;
            const isLastDay =
                index === visibleDays.length - 1;

            if (isLastDay) {
                const min =
                    isPhone ? 38 : isVeryTight ? 42 : isTight ? 46 : isNarrowDesktop ? 50 : isCompact ? 56 : 66;
                const fr =
                    isPhone ? 0.72 : isVeryTight ? 0.76 : isTight ? 0.8 : isNarrowDesktop ? 0.84 : isCompact ? 0.88 : 0.92;
                tracks.push(
                    `minmax(${min}px, ${fr}fr)`
                );
                return;
            }

            if (isFirstDay) {
                const min =
                    isPhone ? 40 : isVeryTight ? 44 : isTight ? 48 : isNarrowDesktop ? 54 : isCompact ? 60 : 70;
                const fr =
                    isPhone ? 0.76 : isVeryTight ? 0.8 : isTight ? 0.82 : isNarrowDesktop ? 0.86 : isCompact ? 0.92 : 0.98;
                tracks.push(
                    `minmax(${min}px, ${fr}fr)`
                );
                return;
            }

            const min =
                isPhone ? 40 : isVeryTight ? 44 : isTight ? 48 : isNarrowDesktop ? 54 : isCompact ? 60 : 70;
            const fr =
                isPhone ? 0.76 : isVeryTight ? 0.8 : isTight ? 0.88 : isNarrowDesktop ? 0.94 : isCompact ? 0.98 : 1;
            tracks.push(`minmax(${min}px, ${fr}fr)`);
        });

        return tracks.join(" ");
    },

    getDayDisplayName(dayName = "") {
        const labels = {
            HORARIO: "Hor\u00e1rio",
            Terca: "Ter\u00e7a",
            Sabado: "S\u00e1bado"
        };

        return labels[dayName] || dayName;
    },

    syncResponsiveGridLayout(visibleDays = null) {
        const grid =
            document.getElementById("qtsGrid");

        if (!grid) {
            return;
        }

        grid.style.gridTemplateColumns =
            this.getResponsiveGridTemplate(
                visibleDays ||
                this.getVisibleDays()
            );
    },

    getWeekContext(date = new Date()) {
        const start = this.getWeekStart(date);
        const end = new Date(start);
        end.setDate(start.getDate() + 6);

        return {
            rangeLabel: `${this.formatHeaderDate(start)} - ${this.formatHeaderDate(end)}`,
            monthLabel: new Intl.DateTimeFormat("pt-BR", {
                month: "long",
                year: "numeric"
            })
                .format(date)
                .normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "")
        };
    },

    getViewDate() {
        return this.viewWeekDate ||
            this.getWeekStart(new Date());
    },

    getWeekKey(date = new Date()) {
        const start = this.getWeekStart(date);
        return `${start.getFullYear()}-${String(start.getMonth() + 1).padStart(2, "0")}-${String(start.getDate()).padStart(2, "0")}`;
    },

    getWeekOffsetFromCurrent(date = this.getViewDate()) {
        const currentStart =
            this.getWeekStart(new Date());
        const targetStart =
            this.getWeekStart(date);
        const diffMs =
            targetStart.getTime() -
            currentStart.getTime();

        return Math.round(
            diffMs / (7 * 24 * 60 * 60 * 1000)
        );
    },

    isReadonlyWeekView() {
        return this.getWeekOffsetFromCurrent() < 0;
    },

    isFutureWeekView() {
        return this.getWeekOffsetFromCurrent() > 0;
    },

    captureCurrentPlanState() {
        return {
            studyDuration:
                this.data.studyDuration || 25,
            showTimeColumn:
                Boolean(this.data.showTimeColumn),
            showSunday:
                this.data.showSunday !== false,
            showSaturday:
                this.data.showSaturday !== false,
            activeTemplate:
                this.data.activeTemplate || "manual",
            hiddenRows:
                (this.data.hiddenRows || []).map(
                    (row) => ({ ...(row || {}) })
                ),
            structure:
                (this.data.structure || []).map(
                    (item) => ({ ...(item || {}) })
                ),
            grid: Object.fromEntries(
                Object.entries(
                    this.data.grid || {}
                ).map(([key, value]) => [
                    key,
                    { ...(value || {}) }
                ])
            )
        };
    },

    createBlankPlanState() {
        return {
            studyDuration: 25,
            showTimeColumn: false,
            showSunday: true,
            showSaturday: true,
            activeTemplate: "manual",
            hiddenRows: [],
            structure: Array.from(
                { length: 6 },
                () => ({ type: "row" })
            ),
            grid: {}
        };
    },

    clonePlanState(source = {}) {
        const fallback =
            this.createBlankPlanState();
        const base = {
            ...fallback,
            ...(source || {})
        };

        return {
            studyDuration:
                base.studyDuration || 25,
            showTimeColumn:
                Boolean(base.showTimeColumn),
            showSunday:
                base.showSunday !== false,
            showSaturday:
                base.showSaturday !== false,
            activeTemplate:
                base.activeTemplate || "manual",
            hiddenRows:
                (base.hiddenRows || []).map(
                    (row) => ({ ...(row || {}) })
                ),
            structure:
                (base.structure || []).map(
                    (item) => ({ ...(item || {}) })
                ),
            grid: Object.fromEntries(
                Object.entries(base.grid || {})
                    .map(([key, value]) => [
                        key,
                        { ...(value || {}) }
                    ])
            )
        };
    },

    applyWeekPlanToState(plan) {
        const normalized =
            this.clonePlanState(plan);

        this.data.studyDuration =
            normalized.studyDuration;
        this.data.showTimeColumn =
            normalized.showTimeColumn;
        this.data.showSunday =
            normalized.showSunday;
        this.data.showSaturday =
            normalized.showSaturday;
        this.data.activeTemplate =
            normalized.activeTemplate;
        this.data.hiddenRows =
            normalized.hiddenRows;
        this.data.structure =
            normalized.structure;
        this.data.grid =
            normalized.grid;
    },

    resolveWeekPlan(weekKey, options = {}) {
        const existing =
            this.data.weeks?.[weekKey];

        if (existing) {
            return this.clonePlanState(existing);
        }

        const currentWeekKey =
            this.getWeekKey(new Date());

        if (
            options.ensureCurrent &&
            weekKey === currentWeekKey
        ) {
            const current =
                this.captureCurrentPlanState();
            this.data.weeks[weekKey] =
                this.clonePlanState(current);
            return current;
        }

        if (
            options.cloneFromCurrent &&
            weekKey > currentWeekKey
        ) {
            const source =
                this.data.weeks[currentWeekKey] ||
                this.captureCurrentPlanState();
            const cloned =
                this.clonePlanState(source);
            this.data.weeks[weekKey] =
                this.clonePlanState(cloned);
            return cloned;
        }

        return this.createBlankPlanState();
    },

    syncViewedWeekPlan() {
        if (
            !this.data.weeks ||
            typeof this.data.weeks !== "object"
        ) {
            this.data.weeks = {};
        }

        const weekKey =
            this.getWeekKey(this.getViewDate());

        this.data.weeks[weekKey] =
            this.captureCurrentPlanState();
    },

    openWeekByOffset(offset = 0) {
        this.commitPendingEdits();
        this.save();

        const current =
            this.getWeekStart(new Date());
        const target = new Date(current);
        target.setDate(
            current.getDate() + (offset * 7)
        );

        const weekKey =
            this.getWeekKey(target);

        this.viewWeekDate =
            this.getWeekStart(target);
        this.applyWeekPlanToState(
            this.resolveWeekPlan(
                weekKey,
                {
                    ensureCurrent:
                        offset === 0,
                    cloneFromCurrent:
                        offset > 0
                }
            )
        );
        this.hideAutocomplete();
        this.clearTableSelection();
        this.render();
    },

    getIntervalMinutesFromText(value) {
        const match = String(value || "").match(/\d+/);
        return match ? parseInt(match[0], 10) : 5;
    },

    getIntervalDurationByIndex(rowIndex) {
        const item = this.data.structure[rowIndex];

        if (!item || item.type !== "interval") {
            return 5;
        }

        return this.getIntervalMinutesFromText(item.duration);
    },

    findPreviousStudyRow(rowIndex) {
        for (let index = rowIndex - 1; index >= 0; index--) {
            if (this.data.structure[index]?.type === "row") {
                return index;
            }
        }

        return -1;
    },

    findNextStudyRow(rowIndex) {
        for (let index = rowIndex + 1; index < this.data.structure.length; index++) {
            if (this.data.structure[index]?.type === "row") {
                return index;
            }
        }

        return -1;
    },

    getIntervalLabel(rowIndex) {
        const rawLabel =
            this.data.structure[rowIndex]?.duration || "Pausa 5min";
        const previousRowIndex =
            this.findPreviousStudyRow(rowIndex);
        const nextRowIndex =
            this.findNextStudyRow(rowIndex);
        const previousStart =
            this.parseTimeToMinutes(this.data.grid[previousRowIndex]?._time);
        const nextStart =
            this.parseTimeToMinutes(this.data.grid[nextRowIndex]?._time);

        if (previousStart === null || nextStart === null) {
            return rawLabel;
        }

        const studyEndsAt =
            previousStart + this.getStudyDuration(previousRowIndex);

        return `${rawLabel} (${this.formatMinutes(studyEndsAt)} -> ${this.formatMinutes(nextStart)})`;
    },

    refreshIntervalLabels() {
        document
            .querySelectorAll("#qtsGrid .qts-interval")
            .forEach((cell) => {
                const rowIndex =
                    parseInt(cell.dataset.row, 10);

                if (Number.isNaN(rowIndex)) {
                    return;
                }

                cell.innerHTML =
                    `<span class="qts-interval-label">${this.getIntervalLabel(rowIndex)}</span>`;
            });
    },

    reflowTimesFromRow(rowIndex) {
        const baseTime =
            this.parseTimeToMinutes(this.data.grid[rowIndex]?._time);

        if (baseTime === null) {
            return;
        }

        let currentMinutes = baseTime;

        for (let index = rowIndex + 1; index < this.data.structure.length; index++) {
            const previousItem =
                this.data.structure[index - 1];

            if (previousItem?.type === "row") {
                currentMinutes += this.getStudyDuration(index - 1);
            } else if (previousItem?.type === "interval") {
                currentMinutes += this.getIntervalDurationByIndex(index - 1);
            }

            if (this.data.structure[index]?.type !== "row") {
                continue;
            }

            const formatted =
                this.formatMinutes(currentMinutes);

            this.data.grid[index] =
                this.data.grid[index] || {};
            this.data.grid[index]._time = formatted;

            const cell = document.querySelector(
                `#qtsGrid .qts-time[data-row="${index}"]`
            );

            if (cell) {
                cell.textContent = formatted;
            }
        }

        this.refreshIntervalLabels();
        this.highlightCurrentTime();
    },

    stripAccents(value) {
        return String(value || "")
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "");
    },

    normalizeSubjectKey(value) {
        return this.stripAccents(value)
            .toLowerCase()
            .replace(/[^\p{L}\p{N}\s]/gu, " ")
            .replace(/\s+/g, " ")
            .trim();
    },

    getCompactSubjectKey(value) {
        return this.normalizeSubjectKey(value)
            .replace(/\s+/g, "");
    },

    getSubjectAliasMap() {
        return {
            mat: "matematica",
            matem: "matematica",
            matema: "matematica",
            matemat: "matematica",
            port: "portugues",
            portug: "portugues",
            geo: "geografia",
            geog: "geografia",
            hist: "historia",
            bio: "biologia",
            quim: "quimica",
            fis: "fisica",
            ing: "ingles",
            jap: "japones",
            lit: "literatura",
            red: "redacao",
            filo: "filosofia",
            soci: "sociologia",
            edfisica: "educacaofisica",
            educacaofisica: "educacaofisica"
        };
    },

    getSubjectDisplayMap() {
        return {
            matematica: "Matemática",
            portugues: "Português",
            geografia: "Geografia",
            historia: "História",
            biologia: "Biologia",
            quimica: "Química",
            fisica: "Física",
            ingles: "Inglês",
            japones: "Japonês",
            literatura: "Literatura",
            redacao: "Redação",
            filosofia: "Filosofia",
            sociologia: "Sociologia",
            ciencias: "Ciências",
            educacaofisica: "Educação Física"
        };
    },

    getSubjectAliasKey(value) {
        const compact =
            this.getCompactSubjectKey(value);
        const aliasMap =
            this.getSubjectAliasMap();

        if (aliasMap[compact]) {
            return aliasMap[compact];
        }

        return compact;
    },

    formatSubjectCellLabel(value) {
        const label =
            String(value || "").trim();

        if (!label) {
            return "";
        }

        const alias =
            this.getSubjectAliasKey(label);
        const display =
            this.getSubjectDisplayMap()[alias];

        return display || label;
    },

    getSubjectTokens(value) {
        return this.normalizeSubjectKey(value)
            .split(" ")
            .filter(Boolean);
    },

    damerauLevenshtein(left, right) {
        const a = String(left || "");
        const b = String(right || "");
        const matrix = Array.from(
            { length: a.length + 1 },
            () =>
                Array.from(
                    { length: b.length + 1 },
                    () => 0
                )
        );

        for (let i = 0; i <= a.length; i++) {
            matrix[i][0] = i;
        }

        for (let j = 0; j <= b.length; j++) {
            matrix[0][j] = j;
        }

        for (let i = 1; i <= a.length; i++) {
            for (let j = 1; j <= b.length; j++) {
                const cost =
                    a[i - 1] === b[j - 1]
                        ? 0
                        : 1;

                matrix[i][j] = Math.min(
                    matrix[i - 1][j] + 1,
                    matrix[i][j - 1] + 1,
                    matrix[i - 1][j - 1] + cost
                );

                if (
                    i > 1 &&
                    j > 1 &&
                    a[i - 1] === b[j - 2] &&
                    a[i - 2] === b[j - 1]
                ) {
                    matrix[i][j] = Math.min(
                        matrix[i][j],
                        matrix[i - 2][j - 2] + 1
                    );
                }
            }
        }

        return matrix[a.length][b.length];
    },

    areSubjectsSimilar(left, right) {
        const leftAlias =
            this.getSubjectAliasKey(left);
        const rightAlias =
            this.getSubjectAliasKey(right);

        if (!leftAlias || !rightAlias) {
            return false;
        }

        if (leftAlias === rightAlias) {
            return true;
        }

        if (
            leftAlias.length >= 3 &&
            rightAlias.startsWith(leftAlias)
        ) {
            return true;
        }

        if (
            rightAlias.length >= 3 &&
            leftAlias.startsWith(rightAlias)
        ) {
            return true;
        }

        const leftTokens =
            this.getSubjectTokens(left);
        const rightTokens =
            this.getSubjectTokens(right);

        if (
            leftTokens.length > 1 ||
            rightTokens.length > 1
        ) {
            const sameSize =
                leftTokens.length === rightTokens.length;

            if (sameSize) {
                return leftTokens.every(
                    (token, index) =>
                        this.areSubjectsSimilar(
                            token,
                            rightTokens[index]
                        )
                );
            }
        }

        const distance =
            this.damerauLevenshtein(
                leftAlias,
                rightAlias
            );
        const maxLength =
            Math.max(
                leftAlias.length,
                rightAlias.length
            );

        if (maxLength <= 4) {
            return distance <= 1;
        }

        if (maxLength <= 8) {
            return distance <= 2;
        }

        return distance <= 3;
    },

    choosePreferredSubjectLabel(variants = new Map()) {
        const labels =
            [...variants.entries()];

        if (!labels.length) {
            return "";
        }

        const aliases =
            [...new Set(
                labels.map(([label]) =>
                    this.getSubjectAliasKey(label)
                )
            )];
        const displayMap =
            this.getSubjectDisplayMap();

        if (
            aliases.length === 1 &&
            displayMap[aliases[0]]
        ) {
            return displayMap[aliases[0]];
        }

        labels.sort((left, right) => {
            const [leftLabel, leftCount] = left;
            const [rightLabel, rightCount] = right;
            const leftAccent =
                leftLabel !== this.stripAccents(leftLabel);
            const rightAccent =
                rightLabel !== this.stripAccents(rightLabel);

            return (
                rightCount - leftCount ||
                Number(rightAccent) - Number(leftAccent) ||
                rightLabel.length - leftLabel.length ||
                leftLabel.localeCompare(
                    rightLabel,
                    "pt-BR",
                    { sensitivity: "base" }
                )
            );
        });

        return labels[0][0];
    },

    getSubjectSuggestionPool() {
        const pool = new Map();
        const collect = (row) => {
            this.days.forEach((day) => {
                const label =
                    String(row?.[day] || "").trim();

                if (!label) {
                    return;
                }

                const existing =
                    pool.get(label) || 0;
                pool.set(label, existing + 1);
            });
        };

        Object.values(this.data.grid || {}).forEach(collect);
        (this.data.hiddenRows || []).forEach(collect);

        return [...pool.entries()]
            .sort((left, right) =>
                right[1] - left[1] ||
                left[0].localeCompare(
                    right[0],
                    "pt-BR",
                    { sensitivity: "base" }
                )
            )
            .map(([label]) => label);
    },

    getSubjectSuggestions(query) {
        const normalizedQuery =
            this.normalizeSubjectKey(query);

        if (!normalizedQuery) {
            return [];
        }

        const compactQuery =
            this.getCompactSubjectKey(query);

        return this.getSubjectSuggestionPool()
            .filter((label) => {
                const normalized =
                    this.normalizeSubjectKey(label);
                const compact =
                    this.getCompactSubjectKey(label);

                if (
                    normalized === normalizedQuery
                ) {
                    return false;
                }

                return (
                    normalized.startsWith(normalizedQuery) ||
                    normalized.includes(normalizedQuery) ||
                    compact.startsWith(compactQuery) ||
                    this.areSubjectsSimilar(
                        label,
                        query
                    )
                );
            })
            .slice(0, 6);
    },

    formatLoad(minutes) {
        const hours = Math.floor(minutes / 60);
        const remaining = minutes % 60;

        if (hours > 0 && remaining > 0) {
            return `${hours}h ${String(remaining).padStart(2, "0")}min`;
        }

        if (hours > 0) {
            return `${hours}h`;
        }

        return `${remaining}min`;
    },

    getScopeDayOccurrences(scope = "week", date = this.getViewDate()) {
        const counts = {};

        this.days.forEach((day) => {
            counts[day] = 0;
        });

        if (scope === "week") {
            this.getVisibleDays().forEach((day) => {
                counts[day] = 1;
            });

            return counts;
        }

        const start =
            scope === "year"
                ? new Date(date.getFullYear(), 0, 1)
                : new Date(date.getFullYear(), date.getMonth(), 1);
        const end =
            scope === "year"
                ? new Date(date.getFullYear(), 11, 31)
                : new Date(date.getFullYear(), date.getMonth() + 1, 0);

        for (
            let cursor = new Date(start);
            cursor <= end;
            cursor.setDate(cursor.getDate() + 1)
        ) {
            const dayName =
                this.getDayName(cursor.getDay());

            if (counts[dayName] !== undefined) {
                counts[dayName] += 1;
            }
        }

        return counts;
    },

    getSummaryScopeMeta(scope = this.data.summaryScope || "week", date = this.getViewDate()) {
        if (scope === "month") {
            return new Intl.DateTimeFormat("pt-BR", {
                month: "long",
                year: "numeric"
            })
                .format(date)
                .normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "");
        }

        if (scope === "year") {
            return String(date.getFullYear());
        }

        return this.getWeekContext(date).rangeLabel;
    },

    getPlannedSubjectSummary(scope = this.data.summaryScope || "week", date = this.getViewDate()) {
        const summary = [];
        const visibleDays = this.getVisibleDays();
        const dayOccurrences =
            this.getScopeDayOccurrences(scope, date);

        this.data.structure.forEach((item, rowIndex) => {
            if (!item || item.type !== "row") {
                return;
            }

            const studyMinutes =
                this.getStudyDuration(rowIndex);
            const rowData =
                this.data.grid[rowIndex] || {};

            visibleDays.forEach((day) => {
                const label =
                    String(rowData[day] || "").trim();
                const multiplier =
                    dayOccurrences[day] || 0;

                if (!label || multiplier <= 0) {
                    return;
                }

                let current =
                    summary.find((item) =>
                        this.areSubjectsSimilar(
                            item.label,
                            label
                        )
                    );

                if (!current) {
                    current = {
                        label,
                        minutes: 0,
                        blocks: 0,
                        variants: new Map()
                    };
                    summary.push(current);
                }

                current.minutes += studyMinutes * multiplier;
                current.blocks += multiplier;
                current.variants.set(
                    label,
                    (current.variants.get(label) || 0) + multiplier
                );
                current.label =
                    this.choosePreferredSubjectLabel(
                        current.variants
                    );
            });
        });

        return summary.sort((left, right) =>
            right.minutes - left.minutes ||
            left.label.localeCompare(right.label, "pt-BR")
        );
    },

    renderSubjectSummary() {
        const container =
            document.getElementById("qtsSubjectSummary");

        if (!container) {
            return;
        }

        if (!this.data.summaryVisible) {
            container.hidden = true;
            container.innerHTML = "";
            return;
        }

        container.hidden = false;

        const summary =
            this.getPlannedSubjectSummary(
                this.data.summaryScope || "week",
                this.getViewDate()
            );
        const scope =
            this.data.summaryScope || "week";
        const scopeMeta =
            this.getSummaryScopeMeta(
                scope,
                this.getViewDate()
            );

        if (!summary.length) {
            container.innerHTML = `
                <div class="qts-summary-card is-empty">
                    <div class="qts-summary-head">
                        <div>
                            <span class="qts-summary-kicker">Planejado por matéria</span>
                            <strong>Sem matérias distribuídas ainda.</strong>
                        </div>
                    </div>
                    <p>Preencha os blocos da semana e o quadro mostra onde o seu tempo programado esta concentrado.</p>
                </div>
            `;
            return;
        }

        const totalMinutes =
            summary.reduce((acc, item) => acc + item.minutes, 0);
        const maxMinutes =
            summary[0]?.minutes || 1;
        const expanded =
            this.data.summaryExpanded === true;

        container.innerHTML = `
            <div class="qts-summary-card${expanded ? " is-expanded" : ""}">
                <button type="button" class="qts-summary-toggle" aria-expanded="${expanded ? "true" : "false"}">
                    <span class="qts-summary-toggle-copy">
                        <span class="qts-summary-kicker">Planejado por matéria</span>
                        <strong>${summary.length} matérias em ${scopeMeta}</strong>
                    </span>
                    <span class="qts-summary-total">${this.formatLoad(totalMinutes)}</span>
                </button>
                <div class="qts-summary-body"${expanded ? "" : " hidden"}>
                    <div class="qts-summary-head">
                    <div>
                        <span class="qts-summary-kicker">Distribuição atual</span>
                        <strong>${summary.length} matérias em ${scopeMeta}</strong>
                    </div>
                        <div class="qts-summary-total">${this.formatLoad(totalMinutes)}</div>
                    </div>
                    <div class="qts-summary-list">
                        ${summary.map((item) => `
                            <div class="qts-summary-item">
                                <div class="qts-summary-copy">
                                    <strong>${item.label}</strong>
                                    <span>${item.blocks} bloco${item.blocks > 1 ? "s" : ""}</span>
                                </div>
                                <div class="qts-summary-bar">
                                    <div class="qts-summary-fill" style="width:${Math.max((item.minutes / maxMinutes) * 100, 8)}%"></div>
                                </div>
                                <div class="qts-summary-time">${this.formatLoad(item.minutes)}</div>
                            </div>
                        `).join("")}
                    </div>
                </div>
            </div>
        `;

        const toggle =
            container.querySelector(".qts-summary-toggle");

        if (toggle) {
            toggle.onclick = () => {
                this.data.summaryExpanded =
                    !this.data.summaryExpanded;
                this.save();
                this.renderSubjectSummary();
            };
        }
    },

    getRowSnapshots() {
        const snapshots = [];

        this.data.structure.forEach((item, rowIndex) => {
            if (item?.type !== "row") {
                return;
            }

            const rowData =
                this.data.grid[rowIndex] || {};
            const snapshot = {};

            this.days.forEach((day) => {
                if (typeof rowData[day] === "string") {
                    snapshot[day] = rowData[day];
                }
            });

            if (rowData._time) {
                snapshot._time = rowData._time;
            }

            snapshots.push(snapshot);
        });

        return snapshots.concat(
            (this.data.hiddenRows || []).map((row) => ({ ...row }))
        );
    },

    restoreRowSnapshots(snapshots = []) {
        const queue =
            snapshots.map((row) => ({ ...row }));
        const generatedGrid = {
            ...(this.data.grid || {})
        };

        this.data.grid = {};

        this.data.structure.forEach((item, rowIndex) => {
            if (item?.type !== "row") {
                return;
            }

            const snapshot =
                queue.shift() || {};
            const generatedTime =
                generatedGrid[rowIndex]?._time || "";

            this.data.grid[rowIndex] = {
                ...snapshot,
                _time: generatedTime || snapshot._time || ""
            };
        });

        this.data.hiddenRows =
            queue;
    },

    getSeedStartTime() {
        for (let index = 0; index < this.data.structure.length; index++) {
            if (this.data.structure[index]?.type !== "row") {
                continue;
            }

            const value =
                String(this.data.grid[index]?._time || "").trim();

            if (value) {
                return value;
            }
        }

        const hiddenValue =
            String(this.data.hiddenRows?.[0]?._time || "").trim();

        return hiddenValue || "07:00";
    },

    buildDefaultStructure() {
        const structure = [];

        for (
            let rowIndex = 0;
            rowIndex < this.defaultInitialRows;
            rowIndex += 1
        ) {
            structure.push({
                type: "row"
            });

            if (
                rowIndex <
                this.defaultInitialIntervals
            ) {
                structure.push({
                    type: "interval"
                });
            }
        }

        return structure;
    },

    buildRepeatingStructure(studyMinutes, breakMinutes) {
        const structure = [];
        let rowCount = 0;
        let intervalCount = 0;

        while (
            structure.length < this.maxTotalRows &&
            rowCount < this.defaultInitialRows
        ) {
            structure.push({
                type: "row",
                duration: studyMinutes
            });
            rowCount += 1;

            if (
                rowCount >=
                    this.defaultInitialRows ||
                intervalCount >=
                    this.defaultInitialIntervals ||
                structure.length + 1 >
                    this.maxTotalRows
            ) {
                break;
            }

            structure.push({
                type: "interval",
                duration: `Pausa ${breakMinutes}min`
            });
            intervalCount += 1;
        }

        return structure;
    },

    getTemplateDefinition(type) {
        const map = {
            pomo25: {
                activeTemplate: "pomo25",
                studyDuration: 25,
                structure: this.buildRepeatingStructure(25, 5)
            },
            deep50: {
                activeTemplate: "deep50",
                studyDuration: 50,
                structure: this.buildRepeatingStructure(50, 15)
            },
            flow52: {
                activeTemplate: "flow52",
                studyDuration: 52,
                structure: this.buildRepeatingStructure(52, 17)
            },
            ultra90: {
                activeTemplate: "ultra90",
                studyDuration: 90,
                structure: this.buildRepeatingStructure(90, 30)
            },
            sprint15: {
                activeTemplate: "sprint15",
                studyDuration: 15,
                structure: this.buildRepeatingStructure(15, 5)
            },
            progressivo: {
                activeTemplate: "progressivo",
                studyDuration: 15,
                structure: [
                    { type: "row", duration: 15 },
                    { type: "interval", duration: "Pausa 5min" },
                    { type: "row", duration: 25 },
                    { type: "interval", duration: "Pausa 10min" },
                    { type: "row", duration: 35 },
                    { type: "interval", duration: "Pausa 15min" },
                    { type: "row", duration: 45 }
                ]
            }
        };

        return map[type] || null;
    },

    render() {

        const container =
            document.getElementById("qtsModule");
        const viewedDate =
            this.getViewDate();
        const weekOffset =
            this.getWeekOffsetFromCurrent(viewedDate);
        const readOnly =
            this.isReadonlyWeekView();
        const futureWeek =
            this.isFutureWeekView();

        container.innerHTML = `
            <div class="qts-stage-shell">
                <div class="qts-stage-main">
                    <div class="qts-template-strip">
                        <div class="qts-template-label" aria-hidden="true">Método pomodoro</div>
                        <div class="qts-templates">
                            <button type="button" ${readOnly ? "disabled" : ""} aria-pressed="${this.data.activeTemplate === "pomo25"}" class="${this.data.activeTemplate === "pomo25" ? "is-active" : ""}" data-template="pomo25">25/5</button>
                            <button type="button" ${readOnly ? "disabled" : ""} aria-pressed="${this.data.activeTemplate === "deep50"}" class="${this.data.activeTemplate === "deep50" ? "is-active" : ""}" data-template="deep50">50/15</button>
                            <button type="button" ${readOnly ? "disabled" : ""} aria-pressed="${this.data.activeTemplate === "flow52"}" class="${this.data.activeTemplate === "flow52" ? "is-active" : ""}" data-template="flow52">52/17</button>
                            <button type="button" ${readOnly ? "disabled" : ""} aria-pressed="${this.data.activeTemplate === "ultra90"}" class="${this.data.activeTemplate === "ultra90" ? "is-active" : ""}" data-template="ultra90">90/30</button>
                            <button type="button" ${readOnly ? "disabled" : ""} aria-pressed="${this.data.activeTemplate === "sprint15"}" class="${this.data.activeTemplate === "sprint15" ? "is-active" : ""}" data-template="sprint15">15/5</button>
                            <button type="button" ${readOnly ? "disabled" : ""} aria-pressed="${this.data.activeTemplate === "progressivo"}" class="${this.data.activeTemplate === "progressivo" ? "is-active" : ""}" data-template="progressivo">Progressivo</button>
                            <button type="button" ${readOnly ? "disabled" : ""} aria-pressed="${this.data.activeTemplate === "manual"}" class="${this.data.activeTemplate === "manual" ? "is-active" : ""}" data-template="manual">Manual</button>
                        </div>
                    </div>

                    <h2 class="qts-title">Quadro semanal</h2>

                    <div class="qts-grid-shell${readOnly ? " is-readonly" : ""}${futureWeek ? " is-future-week" : ""}">
                        ${futureWeek ? '<div class="qts-week-overlay qts-week-overlay-future">PR\u00d3XIMA SEMANA</div>' : ""}
                        <div id="qtsGrid"></div>
                    </div>
                    <div class="qts-controls">
                        <div class="row-control">
                            <button id="removeRowBtn" class="row-btn left" ${readOnly ? "disabled" : ""}>-</button>
                            <div class="row-label">Linhas</div>
                            <button id="addRowBtn" class="row-btn right" ${readOnly ? "disabled" : ""}>+</button>
                        </div>
                        <div class="row-control">
                            <button id="removeIntervalBtn" class="row-btn left" ${readOnly ? "disabled" : ""}>-</button>
                            <div class="row-label">Intervalos</div>
                            <button id="addIntervalBtn" class="row-btn right" ${readOnly ? "disabled" : ""}>+</button>
                        </div>
                    </div>
                    <div id="qtsAutocomplete" class="qts-autocomplete" hidden></div>
                    <div id="qtsSubjectSummary" class="qts-subject-summary"></div>
                </div>
            </div>
        `;

        this.renderDetachedIndexRail();

        this.bindControls();
        this.bindDetachedRailActions();
        this.buildGrid();
        this.renderSubjectSummary();

        document
            .querySelectorAll(".qts-templates button")
            .forEach((btn) => {
                if (btn.disabled) {
                    return;
                }
                btn.onpointerdown = () => {
                    this.commitPendingEdits();
                };
                btn.onclick = () => {
                    this.applyTemplate(btn.dataset.template);
                };
            });

    },
    renderDetachedIndexRail() {
        let rail =
            document.getElementById(
                "qtsDetachedIndex"
            );
        const weekOffset =
            this.getWeekOffsetFromCurrent(
                this.getViewDate()
            );
        const readOnly =
            this.isReadonlyWeekView();

        if (!rail) {
            rail = document.createElement("aside");
            rail.id = "qtsDetachedIndex";
            rail.className = "qts-detached-index";
            rail.setAttribute(
                "aria-label",
                "Índice da tabela"
            );
            document.body.appendChild(rail);
        }

        rail.innerHTML = `
            <section class="qts-detached-block is-week" aria-label="Semanas">
                <div class="qts-detached-block-label">Semanas</div>
                <div class="qts-detached-week-nav" role="group" aria-label="Alternar semana">
                    <button type="button" class="qts-detached-week-button${weekOffset === -1 ? " is-active" : ""}" data-week-nav="-1" data-compact-icon="←" aria-label="Semana anterior" title="Semana anterior" aria-pressed="${weekOffset === -1}">
                        <span class="qts-detached-icon" aria-hidden="true">←</span>
                        <span class="qts-detached-text">Anterior</span>
                    </button>
                    <button type="button" class="qts-detached-week-button${weekOffset === 0 ? " is-active" : ""}" data-week-nav="0" data-compact-icon="•" aria-label="Semana atual" title="Semana atual" aria-pressed="${weekOffset === 0}">
                        <span class="qts-detached-icon" aria-hidden="true">•</span>
                        <span class="qts-detached-text">Atual</span>
                    </button>
                    <button type="button" class="qts-detached-week-button${weekOffset === 1 ? " is-active" : ""}" data-week-nav="1" data-compact-icon="→" aria-label="Próxima semana" title="Próxima semana" aria-pressed="${weekOffset === 1}">
                        <span class="qts-detached-icon" aria-hidden="true">→</span>
                        <span class="qts-detached-text">Próxima</span>
                    </button>
                </div>
            </section>
            <div class="qts-detached-index-divider" aria-hidden="true"></div>
            <section class="qts-detached-block is-toggle" aria-label="Dias e horário">
                <div class="qts-detached-block-label">Dias e horário</div>
                <div class="qts-detached-toggle-group" role="group" aria-label="Opcoes da tabela">
                    <label class="qts-detached-toggle" data-compact-icon="◷" aria-label="Mostrar horário" title="Mostrar horário">
                        <input type="checkbox" id="toggleTimeCol"
                            ${this.data.showTimeColumn ? "checked" : ""}
                            ${readOnly ? "disabled" : ""}>
                        <span class="qts-detached-icon" aria-hidden="true">◷</span>
                        <span>Horário</span>
                    </label>
                    <label class="qts-detached-toggle" data-compact-icon="☀" aria-label="Mostrar domingo" title="Mostrar domingo">
                        <input type="checkbox" id="toggleSunday"
                            ${this.data.showSunday ? "checked" : ""}
                            ${readOnly ? "disabled" : ""}>
                        <span class="qts-detached-icon" aria-hidden="true">☀</span>
                        <span>Domingo</span>
                    </label>
                    <label class="qts-detached-toggle" data-compact-icon="★" aria-label="Mostrar sábado" title="Mostrar sábado">
                        <input type="checkbox" id="toggleSaturday"
                            ${this.data.showSaturday ? "checked" : ""}
                            ${readOnly ? "disabled" : ""}>
                        <span class="qts-detached-icon" aria-hidden="true">★</span>
                        <span>Sábado</span>
                    </label>
                </div>
            </section>
            <div class="qts-detached-index-divider" aria-hidden="true"></div>
            <section class="qts-detached-block is-summary" aria-label="Planejamento">
                <div class="qts-detached-block-label">Planejamento</div>
                <button type="button" class="qts-detached-summary-button${this.data.summaryVisible ? " is-active" : ""}" data-summary-toggle data-compact-icon="▤" aria-label="Mostrar planejamento por matéria" title="Mostrar planejamento por matéria" aria-pressed="${this.data.summaryVisible}">
                    <span class="qts-detached-icon" aria-hidden="true">▤</span>
                    <span class="qts-detached-text">Por matéria</span>
                </button>
            </section>
        `;
    },
    bindDetachedRailActions() {
        document
            .querySelectorAll("[data-week-nav]")
            .forEach((button) => {
                button.onclick = () => {
                    const offset =
                        parseInt(
                            button.dataset.weekNav,
                            10
                        ) || 0;
                    this.openWeekByOffset(offset);
                };
            });

        const summaryToggle =
            document.querySelector(
                "[data-summary-toggle]"
            );

        if (summaryToggle) {
            summaryToggle.onclick = () => {
                this.commitPendingEdits();
                this.data.summaryVisible =
                    !this.data.summaryVisible;
                this.save();
                this.renderDetachedIndexRail();
                this.bindDetachedRailActions();
                this.renderSubjectSummary();
            };
        }
    },
    bindControls() {
        const isReadonly =
            this.isReadonlyWeekView();

        const printBtn = document.getElementById("printQtsBtn");

if (printBtn) {
    printBtn.onclick = () => {

        const printContent =
            document.getElementById("qtsGrid").outerHTML;
            

        const win = window.open("", "", "width=900,height=700");
document.querySelectorAll("#qtsModule h2").forEach((el,i)=>{
if(i>0) el.remove()
})
        win.document.write(`
            <html>
            <head>
                <title>Quadro Horário</title>
                <style>


body {
font-family: Inter, sans-serif;
padding: 20px;
background: white;
color: #111;
zoom: 0.9;
}

/* TÃTULO */
h2{
text-align: center;
font-size: 380% !important;
font-weight: 700;
margin-bottom: 20px;
}

/* GRID */
#qtsGrid {
display: grid;
gap: 4px;
width: 100%;
table-layout: fixed;
}

/* CÃ‰LULAS BASE */
#qtsGrid > div {
font-size: 30px;
line-height: 1.1;
border-radius: 4px;
padding: 4px 6px;
text-align: center;
min-height: 32px;
height: auto;
display:flex;
align-items:center;
justify-content:center;
white-space: normal;
word-break: normal;
overflow-wrap: break-word;
border: 1px solid #bbb;
}

/* HEADER */
.qts-header{
font-size: 15px;
background: #e9eef5;
font-weight: 700;
}

/* HORÃRIO */
.qts-time{
font-size: 28px;
background: #f2f6ff;
font-weight: 600;
}

/* INTERVALO */
.qts-interval{
background: #949393;
font-style: italic;
font-size: 28px;
height: 22px; /* menor que as outras */
}

/* DESTAQUE */
.qts-now{
background: #dbeaff !important;
outline: 1px solid #0078ff;
}

/* LIMPEZA */
*{
box-shadow:none !important;
backdrop-filter:none !important;
}

</style>
            </head>
            <body>
                <h2>Quadro Horário</h2>
                ${printContent}
            </body>
            </html>
        `);

        win.document.close();
        win.focus();
        win.print();
    };
}

        document.getElementById("toggleTimeCol").onchange = (e) => {
            if (isReadonly) return;
            this.data.showTimeColumn = e.target.checked;
            this.save();
            this.render();
        };

        const sunday = document.getElementById("toggleSunday")

if(sunday){
sunday.onchange = (e) => {
if (isReadonly) return
this.data.showSunday = e.target.checked
this.save()
this.render()
}
}

const saturday = document.getElementById("toggleSaturday")

if(saturday){
saturday.onchange = (e) => {
if (isReadonly) return
this.data.showSaturday = e.target.checked
this.save()
this.render()
}
}

        document.getElementById("addRowBtn").onclick = () => {
            if (isReadonly) return;

            if (this.data.structure.length >= this.maxTotalRows)
                return;

            this.data.structure.push({ type: "row" });

            const restored =
                Array.isArray(this.data.hiddenRows) &&
                this.data.hiddenRows.length
                    ? this.data.hiddenRows.shift()
                    : null;

            if (restored) {
                const newIndex =
                    this.data.structure.length - 1;

                this.data.grid[newIndex] = {
                    ...(this.data.grid[newIndex] || {}),
                    ...restored
                };
            }

            this.save();
            this.render();
        };

        document.getElementById("removeRowBtn").onclick = () => {
            if (isReadonly) return;

            const lastRowIndex =
                [...this.data.structure]
                    .map((x,i)=>x.type==="row"?i:null)
                    .filter(x=>x!==null)
                    .pop();

            if (lastRowIndex === undefined) return;

            const removedRow =
                this.data.grid[lastRowIndex];

            if (removedRow) {
                this.data.hiddenRows =
                    this.data.hiddenRows || [];
                this.data.hiddenRows.unshift({
                    ...removedRow
                });
            }

            this.data.structure.splice(lastRowIndex,1);

            this.save();
            this.render();
        };

        // ADICIONAR INTERVALO
document.getElementById("addIntervalBtn").onclick = () => {
    if (isReadonly) return;

    const totalIntervals =
        this.data.structure
            .filter(x=>x.type==="interval")
            .length;

    if (totalIntervals >= this.maxIntervals)
        return;

    if (this.data.structure.length >= this.maxTotalRows)
        return;

    this.data.structure.push({ type:"interval" });

    this.save();
    this.render();
};

// REMOVER INTERVALO
document.getElementById("removeIntervalBtn").onclick = () => {
    if (isReadonly) return;

    const lastIntervalIndex =
        [...this.data.structure]
            .map((x,i)=>x.type==="interval"?i:null)
            .filter(x=>x!==null)
            .pop();

    if (lastIntervalIndex === undefined) return;

    this.data.structure.splice(lastIntervalIndex,1);

    this.save();
    this.render();
};
    },

    buildGrid() {

        const grid =
            document.getElementById("qtsGrid");

        grid.innerHTML = "";

        document.querySelectorAll(".qts-now").forEach(el=>el.classList.remove("qts-now"));

        const visibleDays =
            this.getVisibleDays();

const columns =
    (this.data.showTimeColumn ? 1 : 0)
    + visibleDays.length;

        grid.style.display = "grid";
        grid.style.gridTemplateColumns =
            this.getResponsiveGridTemplate(
                visibleDays
            );

        if (this.data.showTimeColumn)
            grid.appendChild(this.createHeader("HORARIO"));

        visibleDays.forEach((day) =>
            grid.appendChild(
                this.createHeader(
                    day,
                    this.formatHeaderDate(
                        this.getDateForDay(
                            day,
                            this.getViewDate()
                        )
                    )
                )
            )
        );

        this.data.structure.forEach((item, index) => {

            if (item.type === "interval") {
                grid.appendChild(
                    this.createIntervalRow(columns, index)
                );
                return;
            }

            const rowIndex = index;

            if (this.data.showTimeColumn)
                grid.appendChild(
                    this.createTimeCell(rowIndex)
                );

visibleDays.forEach((day, colIndex) =>
    grid.appendChild(
        this.createEditableCell(rowIndex, day, colIndex)
    )
);
        });

        this.refreshIntervalLabels();
        this.applyTableSelection();
        this.highlightCurrentTime();
    },

    getSelectableCells() {
        return Array.from(
            document.querySelectorAll(
                '#qtsGrid div[data-row][data-col]'
            )
        );
    },

    getCellCoord(cell) {
        if (!cell?.dataset) {
            return null;
        }

        const row = parseInt(
            cell.dataset.row,
            10
        );
        const col = parseInt(
            cell.dataset.col,
            10
        );

        if (Number.isNaN(row) || Number.isNaN(col)) {
            return null;
        }

        return { row, col };
    },

    sameCoord(a, b) {
        return !!a && !!b &&
            a.row === b.row &&
            a.col === b.col;
    },

    getSelectionBounds() {
        if (!this.selection.anchor || !this.selection.focus) {
            return null;
        }

        return {
            rowStart: Math.min(
                this.selection.anchor.row,
                this.selection.focus.row
            ),
            rowEnd: Math.max(
                this.selection.anchor.row,
                this.selection.focus.row
            ),
            colStart: Math.min(
                this.selection.anchor.col,
                this.selection.focus.col
            ),
            colEnd: Math.max(
                this.selection.anchor.col,
                this.selection.focus.col
            )
        };
    },

    isCoordSelected(coord) {
        const bounds =
            this.getSelectionBounds();

        if (!coord || !bounds) {
            return false;
        }

        return (
            coord.row >= bounds.rowStart &&
            coord.row <= bounds.rowEnd &&
            coord.col >= bounds.colStart &&
            coord.col <= bounds.colEnd
        );
    },

    getSelectableCellAt(row, col) {
        return document.querySelector(
            `#qtsGrid div[data-row="${row}"][data-col="${col}"]`
        );
    },

    getRowSelectableCols(row) {
        return Array.from(
            document.querySelectorAll(
                `#qtsGrid div[data-row="${row}"][data-col]`
            )
        )
            .map((cell) =>
                parseInt(cell.dataset.col, 10)
            )
            .filter((value) =>
                !Number.isNaN(value)
            )
            .sort((a, b) => a - b);
    },

    findNextSelectableCoord(row, col, direction) {
        if (
            direction === "left" ||
            direction === "right"
        ) {
            const cols =
                this.getRowSelectableCols(row);
            const currentIndex =
                cols.indexOf(col);

            if (currentIndex === -1) {
                return null;
            }

            const nextCol =
                cols[
                    currentIndex +
                    (direction === "right"
                        ? 1
                        : -1)
                ];

            if (typeof nextCol !== "number") {
                return null;
            }

            return { row, col: nextCol };
        }

        let nextRow = row;

        while (true) {
            nextRow +=
                direction === "down"
                    ? 1
                    : -1;

            if (nextRow < 0 || nextRow > 50) {
                return null;
            }

            const target =
                this.getSelectableCellAt(
                    nextRow,
                    col
                );

            if (target) {
                return {
                    row: nextRow,
                    col
                };
            }

            const interval = document.querySelector(
                `#qtsGrid div.qts-interval[data-row="${nextRow}"]`
            );

            if (interval) {
                continue;
            }
        }
    },

    clearTableSelection(resetState = true) {
        const grid =
            document.getElementById("qtsGrid");

        if (grid) {
            grid.classList.remove("is-selecting");
            grid
                .querySelectorAll(
                    ".qts-cell-selected, .qts-selection-anchor"
                )
                .forEach((cell) => {
                    cell.classList.remove(
                        "qts-cell-selected",
                        "qts-selection-anchor"
                    );
                });
        }

        if (resetState) {
            this.selection.anchor = null;
            this.selection.focus = null;
        }
    },

    applyTableSelection() {
        const grid =
            document.getElementById("qtsGrid");

        if (!grid) {
            return;
        }

        this.clearTableSelection(false);

        const bounds =
            this.getSelectionBounds();

        if (!bounds) {
            return;
        }

        this.getSelectableCells().forEach((cell) => {
            const coord =
                this.getCellCoord(cell);

            if (
                coord &&
                coord.row >= bounds.rowStart &&
                coord.row <= bounds.rowEnd &&
                coord.col >= bounds.colStart &&
                coord.col <= bounds.colEnd
            ) {
                cell.classList.add(
                    "qts-cell-selected"
                );
            }
        });

        const anchorCell =
            this.getSelectableCellAt(
                this.selection.anchor.row,
                this.selection.anchor.col
            );

        if (anchorCell) {
            anchorCell.classList.add(
                "qts-selection-anchor"
            );
        }
    },

    startTableSelection(cell, extendExisting = false) {
        const coord =
            this.getCellCoord(cell);

        if (!coord) {
            return;
        }

        if (
            !extendExisting ||
            !this.selection.anchor
        ) {
            this.selection.anchor = coord;
        }

        this.selection.focus = coord;
        this.selection.pointerDown = true;
        this.selection.dragging = false;
        window.getSelection()
            ?.removeAllRanges();
        this.applyTableSelection();
    },

    extendTableSelection(cell) {
        const coord =
            this.getCellCoord(cell);

        if (
            !coord ||
            this.sameCoord(
                this.selection.focus,
                coord
            )
        ) {
            return;
        }

        this.selection.dragging = true;
        this.selection.focus = coord;

        const grid =
            document.getElementById("qtsGrid");

        if (grid) {
            grid.classList.add("is-selecting");
        }

        window.getSelection()
            ?.removeAllRanges();
        this.applyTableSelection();
    },

    finishTableSelection() {
        if (!this.selection.pointerDown) {
            return;
        }

        const wasDragging =
            this.selection.dragging;

        this.selection.pointerDown = false;
        this.selection.dragging = false;

        const grid =
            document.getElementById("qtsGrid");

        if (grid) {
            grid.classList.remove("is-selecting");
        }

        if (wasDragging) {
            window.getSelection()
                ?.removeAllRanges();
        }
    },

    selectSingleCell(cell) {
        const coord =
            this.getCellCoord(cell);

        if (!coord) {
            return;
        }

        this.selection.anchor = coord;
        this.selection.focus = coord;
        this.applyTableSelection();
        window.getSelection()
            ?.removeAllRanges();
    },

    enterCellEditMode(cell) {
        if (!cell) {
            return;
        }

        cell._qtsEditing = true;
        cell.focus({ preventScroll: true });

        requestAnimationFrame(() => {
            this.setCellCaretToEnd(cell);
        });
    },

    isPrintableCellKey(e) {
        return (
            e.key.length === 1 &&
            !e.ctrlKey &&
            !e.metaKey &&
            !e.altKey
        );
    },

    clearSelectedTableCells() {
        const bounds =
            this.getSelectionBounds();

        if (!bounds) {
            return false;
        }

        let didChange = false;

        for (
            let row = bounds.rowStart;
            row <= bounds.rowEnd;
            row++
        ) {
            for (
                let col = bounds.colStart;
                col <= bounds.colEnd;
                col++
            ) {
                const cell =
                    this.getSelectableCellAt(
                        row,
                        col
                    );

                if (!cell) {
                    continue;
                }

                if (cell.textContent) {
                    didChange = true;
                }

                cell.textContent = "";
                this.commitEditableCell(
                    cell,
                    false
                );
            }
        }

        this.save();
        this.renderSubjectSummary();
        this.hideAutocomplete();
        return didChange;
    },

    wireSelectableCell(cell) {
        cell.classList.add("qts-selectable");

        cell.addEventListener("pointerdown", (e) => {
            if (e.button !== 0) {
                return;
            }

            e.preventDefault();
            cell._qtsEditing = false;

            this.startTableSelection(
                cell,
                e.shiftKey
            );

            cell.focus({ preventScroll: true });
        });

        cell.addEventListener("pointerenter", (e) => {
            if (
                !this.selection.pointerDown ||
                !(e.buttons & 1)
            ) {
                return;
            }

            this.extendTableSelection(cell);
        });

        cell.addEventListener("mouseenter", (e) => {
            if (
                !this.selection.pointerDown ||
                !(e.buttons & 1)
            ) {
                return;
            }

            this.extendTableSelection(cell);
        });

        cell.addEventListener("dblclick", (e) => {
            e.preventDefault();
            this.selectSingleCell(cell);
            this.enterCellEditMode(cell);
        });
    },

    getSelectedTableText() {
        const bounds =
            this.getSelectionBounds();

        if (!bounds) {
            return "";
        }

        const lines = [];

        for (
            let row = bounds.rowStart;
            row <= bounds.rowEnd;
            row++
        ) {
            const values = [];

            for (
                let col = bounds.colStart;
                col <= bounds.colEnd;
                col++
            ) {
                const cell =
                    this.getSelectableCellAt(
                        row,
                        col
                    );

                if (!cell) {
                    continue;
                }

                values.push(
                    cell.textContent
                        .replace(/\n+/g, " ")
                        .trim()
                );
            }

            if (values.length) {
                lines.push(values.join("\t"));
            }
        }

        return lines.join("\n");
    },

    copySelectionToClipboard() {
        const text =
            this.getSelectedTableText();

        if (!text) {
            return;
        }

        if (
            navigator.clipboard?.writeText
        ) {
            navigator.clipboard
                .writeText(text)
                .catch(() => {
                    this.fallbackCopyText(text);
                });
            return;
        }

        this.fallbackCopyText(text);
    },

    fallbackCopyText(text) {
        const helper =
            document.createElement("textarea");
        helper.value = text;
        helper.setAttribute("readonly", "");
        helper.style.position = "fixed";
        helper.style.opacity = "0";
        document.body.appendChild(helper);
        helper.select();
        document.execCommand("copy");
        helper.remove();
    },

    handleSelectionHotkey(e, cell) {
        const nativeSelection =
            window.getSelection()
                ?.toString() || "";
        const hasTableSelection =
            !!this.getSelectionBounds();
        const direction = {
            ArrowRight: "right",
            ArrowLeft: "left",
            ArrowDown: "down",
            ArrowUp: "up"
        }[e.key];

        if (
            (e.ctrlKey || e.metaKey) &&
            e.key.toLowerCase() === "c" &&
            hasTableSelection &&
            !nativeSelection
        ) {
            e.preventDefault();
            this.copySelectionToClipboard();
            return true;
        }

        if (
            e.key === "Escape" &&
            hasTableSelection
        ) {
            e.preventDefault();
            this.clearTableSelection();
            return true;
        }

        if (
            (e.key === "Delete" ||
                e.key === "Backspace") &&
            hasTableSelection &&
            !nativeSelection &&
            !cell?._qtsEditing
        ) {
            e.preventDefault();
            this.clearSelectedTableCells();
            this.selectSingleCell(cell);
            return true;
        }

        if (e.shiftKey && direction) {
            e.preventDefault();
            this.extendSelectionWithKeyboard(
                cell,
                direction
            );
            return true;
        }

        return false;
    },

    extendSelectionWithKeyboard(cell, direction) {
        const coord =
            this.getCellCoord(cell);

        if (!coord) {
            return;
        }

        if (
            !this.getSelectionBounds() ||
            !this.isCoordSelected(coord)
        ) {
            this.selection.anchor = coord;
            this.selection.focus = coord;
        } else if (
            !this.sameCoord(
                this.selection.focus,
                coord
            )
        ) {
            this.selection.focus = coord;
        }

        const next =
            this.findNextSelectableCoord(
                coord.row,
                coord.col,
                direction
            );

        if (!next) {
            return;
        }

        this.selection.focus = next;
        this.applyTableSelection();

        const target =
            this.getSelectableCellAt(
                next.row,
                next.col
            );

        if (target) {
            target.focus();
        }
    },

    getAutocompleteElement() {
        return document.getElementById(
            "qtsAutocomplete"
        );
    },

    isAutocompleteOpen() {
        const el =
            this.getAutocompleteElement();

        return !!el && !el.hidden;
    },

    positionAutocomplete() {
        const el =
            this.getAutocompleteElement();
        const cell =
            this.autocomplete.activeCell;

        if (!el || !cell || el.hidden) {
            return;
        }

        const rect =
            cell.getBoundingClientRect();
        el.style.left =
            `${window.scrollX + rect.left}px`;
        el.style.top =
            `${window.scrollY + rect.bottom + 8}px`;
        el.style.minWidth =
            `${Math.max(rect.width, 180)}px`;
    },

    renderAutocomplete() {
        const el =
            this.getAutocompleteElement();

        if (!el) {
            return;
        }

        const items =
            this.autocomplete.items || [];

        if (!items.length || !this.autocomplete.activeCell) {
            this.hideAutocomplete();
            return;
        }

        el.innerHTML = items
            .map((item, index) => `
                <button
                    type="button"
                    class="qts-autocomplete-item${index === this.autocomplete.highlightIndex ? " is-active" : ""}"
                    data-index="${index}">
                    ${item}
                </button>
            `)
            .join("");

        el.hidden = false;
        this.positionAutocomplete();

        el.querySelectorAll(
            ".qts-autocomplete-item"
        ).forEach((button) => {
            button.addEventListener(
                "mousedown",
                (e) => {
                    e.preventDefault();
                    this.applyAutocompleteChoice(
                        this.autocomplete.activeCell,
                        this.autocomplete.items[
                            parseInt(
                                button.dataset.index,
                                10
                            )
                        ]
                    );
                }
            );
        });
    },

    updateAutocomplete(cell) {
        const query =
            String(cell?.textContent || "").trim();
        const items =
            this.getSubjectSuggestions(query);

        if (!query || !items.length) {
            this.hideAutocomplete();
            return;
        }

        this.autocomplete.activeCell = cell;
        this.autocomplete.items = items;
        this.autocomplete.highlightIndex = 0;
        this.renderAutocomplete();
    },

    hideAutocomplete() {
        const el =
            this.getAutocompleteElement();

        if (el) {
            el.hidden = true;
            el.innerHTML = "";
        }

        this.autocomplete.activeCell = null;
        this.autocomplete.items = [];
        this.autocomplete.highlightIndex = 0;
    },

    moveAutocompleteHighlight(step) {
        const items =
            this.autocomplete.items || [];

        if (!items.length) {
            return;
        }

        const nextIndex =
            (
                this.autocomplete.highlightIndex +
                step +
                items.length
            ) % items.length;

        this.autocomplete.highlightIndex =
            nextIndex;
        this.renderAutocomplete();
    },

    setCellCaretToEnd(cell) {
        if (!cell) {
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

    commitEditableCell(cell, persist = true) {
        if (!cell) {
            return;
        }

        const row =
            parseInt(cell.dataset.row, 10);
        const col =
            parseInt(cell.dataset.col, 10);
        const day =
            this.getVisibleDays()[col];

        if (
            Number.isNaN(row) ||
            typeof day !== "string"
        ) {
            return;
        }

        this.data.grid[row] =
            this.data.grid[row] || {};
        this.data.grid[row][day] =
            this.formatSubjectCellLabel(
                cell.textContent
            );
        cell.textContent =
            this.data.grid[row][day];

        if (persist) {
            this.save();
            this.renderSubjectSummary();
        }
    },

    applyAutocompleteChoice(cell, value) {
        if (!cell || !value) {
            return;
        }

        cell.textContent =
            this.formatSubjectCellLabel(value);
        this.commitEditableCell(cell);
        this.hideAutocomplete();
        cell.focus();
        this.setCellCaretToEnd(cell);
    },

    handleAutocompleteHotkey(e, cell) {
        if (
            !this.isAutocompleteOpen() ||
            this.autocomplete.activeCell !== cell
        ) {
            return false;
        }

        if (e.key === "ArrowDown") {
            e.preventDefault();
            this.moveAutocompleteHighlight(1);
            return true;
        }

        if (e.key === "ArrowUp") {
            e.preventDefault();
            this.moveAutocompleteHighlight(-1);
            return true;
        }

        if (e.key === "Enter") {
            const value =
                this.autocomplete.items[
                    this.autocomplete.highlightIndex
                ];

            if (value) {
                e.preventDefault();
                this.applyAutocompleteChoice(
                    cell,
                    value
                );
                return true;
            }
        }

        if (e.key === "Escape") {
            e.preventDefault();
            this.hideAutocomplete();
            return true;
        }

        return false;
    },

    parsePasteMatrix(text) {
        return String(text || "")
            .replace(/\r/g, "")
            .split("\n")
            .filter(
                (line, index, lines) =>
                    line.length > 0 ||
                    index < lines.length - 1
            )
            .map((line) => line.split("\t"));
    },

    normalizeTimeText(value) {
        const text =
            String(value || "").trim();

        if (!text) {
            return "";
        }

        let hours = 0;
        let minutes = 0;

        if (text.includes(":") || text.includes("h")) {
            const parts = text
                .replace("h", ":")
                .split(":");
            hours = parseInt(parts[0], 10);
            minutes =
                parseInt(parts[1], 10) || 0;
        } else {
            hours = parseInt(text, 10);
        }

        if (Number.isNaN(hours)) {
            return text;
        }

        return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
    },

    applyPastedCellValue(cell, value, options = {}) {
        const coord =
            this.getCellCoord(cell);

        if (!coord) {
            return;
        }

        this.data.grid[coord.row] =
            this.data.grid[coord.row] || {};

        if (coord.col === -1) {
            const normalized =
                this.normalizeTimeText(value);
            this.data.grid[coord.row]._time =
                normalized;
            cell.textContent = normalized;

            if (
                options.reflowTimes &&
                normalized
            ) {
                this.reflowTimesFromRow(coord.row);
            }

            return;
        }

        const day =
            this.getVisibleDays()[coord.col];

        if (!day) {
            return;
        }

        const label =
            this.formatSubjectCellLabel(value);
        this.data.grid[coord.row][day] =
            label;
        cell.textContent = label;
    },

    handleCellPaste(cell, text) {
        const matrix =
            this.parsePasteMatrix(text);

        if (!matrix.length) {
            return;
        }

        const start =
            this.getCellCoord(cell);

        if (!start) {
            return;
        }

        const multiCell =
            matrix.length > 1 ||
            matrix[0].length > 1;
        let pastedTime = false;

        matrix.forEach((values, rowOffset) => {
            values.forEach((value, colOffset) => {
                const target =
                    this.getSelectableCellAt(
                        start.row + rowOffset,
                        start.col + colOffset
                    );

                if (!target) {
                    return;
                }

                const targetCoord =
                    this.getCellCoord(target);

                if (targetCoord?.col === -1) {
                    pastedTime = true;
                }

                this.applyPastedCellValue(
                    target,
                    value,
                    {
                        reflowTimes:
                            !multiCell
                    }
                );
            });
        });

        if (!multiCell && pastedTime) {
            this.refreshIntervalLabels();
        }

        this.save();
        this.renderSubjectSummary();
        this.hideAutocomplete();
    },

    createHeader(text, meta = "") {
        const cell = document.createElement("div");
        cell.classList.add("qts-header");
        const displayText =
            this.getDayDisplayName(text);

        if (meta) {
            cell.innerHTML = `
                <span class="qts-header-day">${displayText}</span>
                <span class="qts-header-date">${meta}</span>
            `;
            return cell;
        }

        cell.classList.add("qts-header-single");
        cell.innerHTML = `
            <span class="qts-header-label">${displayText}</span>
        `;
        return cell;
    },

    createIntervalRow(columns, index) {

        const cell = document.createElement("div");
        const readOnly =
            this.isReadonlyWeekView();
        cell.contentEditable = false;
        cell.tabIndex = 0;
cell.dataset.row = index;
cell.dataset.col = -1;

cell.innerHTML = `<span class="qts-interval-label">${this.getIntervalLabel(index)}</span>`;
cell.addEventListener("click",(e)=>{

// se foi arraste, ignora clique
if(cell._dragging) return
if(readOnly) return

e.stopPropagation()

this.openIntervalPicker(cell, index)

})

        cell.style.gridColumn = `span ${columns}`;
        cell.classList.add("qts-interval");


cell.addEventListener("keydown",(e)=>{

const r = parseInt(cell.dataset.row)

if(e.key==="Enter" || e.key===" "){
if(readOnly) return
e.preventDefault()
this.openIntervalPicker(cell, index)
return
}

// BAIXO â†’ vai pra prÃ³xima linha vÃ¡lida
if(e.key==="ArrowDown"){
e.preventDefault()

let next = document.querySelector(
`#qtsGrid div[data-row="${r+1}"][data-col="0"]`
)

if(next) next.focus()
}

// CIMA â†’ mesma lÃ³gica
if(e.key==="ArrowUp"){
e.preventDefault()

let prev = document.querySelector(
`#qtsGrid div[data-row="${r-1}"][data-col="0"]`
)

if(prev) prev.focus()
}

e.stopPropagation()

        })
        return cell;
    },

    openIntervalPicker(cell, index) {
        if (this.isReadonlyWeekView()) {
            return;
        }

        const currentMinutes =
            this.getIntervalDurationByIndex(index);
        const input =
            window.prompt(
                "Intervalo em minutos",
                String(currentMinutes)
            );

        if (input === null) {
            return;
        }

        const minutes =
            parseInt(String(input).trim(), 10);

        if (!Number.isFinite(minutes) || minutes <= 0) {
            return;
        }

        this.data.structure[index].duration =
            `Pausa ${minutes}min`;

        const previousRowIndex =
            this.findPreviousStudyRow(index);

        if (previousRowIndex >= 0) {
            this.reflowTimesFromRow(previousRowIndex);
        } else {
            this.refreshIntervalLabels();
        }

        this.save();
    },

    migrateDayKeys() {
        const aliasMap = {
            "Terça": "Terca",
            "TerÃ§a": "Terca",
            "Sábado": "Sabado",
            "SÃ¡bado": "Sabado"
        };
        const normalizeRows = (collection = []) =>
            collection.map((row) => {
                const normalized = {
                    ...(row || {})
                };

                Object.entries(aliasMap).forEach(([legacy, stable]) => {
                    if (
                        typeof normalized[legacy] === "string" &&
                        !normalized[stable]
                    ) {
                        normalized[stable] = normalized[legacy];
                    }

                    delete normalized[legacy];
                });

                return normalized;
            });

        Object.values(this.data.grid || {}).forEach((row) => {
            if (!row) {
                return;
            }

            Object.entries(aliasMap).forEach(([legacy, stable]) => {
                if (
                    typeof row[legacy] === "string" &&
                    !row[stable]
                ) {
                    row[stable] = row[legacy];
                }

                delete row[legacy];
            });
        });

        this.data.hiddenRows =
            normalizeRows(this.data.hiddenRows || []);

        Object.values(this.data.weeks || {}).forEach((plan) => {
            if (!plan || typeof plan !== "object") {
                return;
            }

            Object.values(plan.grid || {}).forEach((row) => {
                if (!row) {
                    return;
                }

                Object.entries(aliasMap).forEach(([legacy, stable]) => {
                    if (
                        typeof row[legacy] === "string" &&
                        !row[stable]
                    ) {
                        row[stable] = row[legacy];
                    }

                    delete row[legacy];
                });
            });

            plan.hiddenRows =
                normalizeRows(plan.hiddenRows || []);
        });
    },

    inferActiveTemplate() {
        const rowDurations = [];
        const breakDurations = [];

        this.data.structure.forEach((item, index) => {
            if (item?.type === "row") {
                rowDurations.push(this.getStudyDuration(index));
            }

            if (item?.type === "interval") {
                breakDurations.push(this.getIntervalDurationByIndex(index));
            }
        });

        if (!rowDurations.length) {
            return "manual";
        }

        const uniqueStudy =
            [...new Set(rowDurations)];
        const uniqueBreak =
            [...new Set(breakDurations)];

        if (uniqueStudy.length === 1 && uniqueBreak.length <= 1) {
            const signature =
                `${uniqueStudy[0]}/${uniqueBreak[0] || 5}`;
            const mapped =
                this.inferPresetKey(
                    uniqueStudy[0],
                    uniqueBreak[0] || 5
                );

            return mapped === "custom"
                ? "manual"
                : {
                    tradicional: "pomo25",
                    estendido: "deep50",
                    metodo5217: "flow52",
                    ultradiano: "ultra90",
                    mini: "sprint15"
                }[mapped] || "manual";
        }

        const progressiveStudy =
            [15, 25, 35, 45, 55, 65];
        const progressiveBreak =
            [5, 10, 15, 20, 25, 30];

        const looksProgressive =
            rowDurations.every((value, index) =>
                progressiveStudy[index] === value
            ) &&
            breakDurations.every((value, index) =>
                progressiveBreak[index] === value
            );

        return looksProgressive
            ? "progressivo"
            : "manual";
    },

    createTimeCell(row) {

        const cell =
            document.createElement("div");
        const readOnly =
            this.isReadonlyWeekView();
            this.wireSelectableCell(cell);
            cell.addEventListener("pointerdown", () => {
            cell._pointerFocus = true;
        });
        cell.addEventListener("focus", () => {
            this.hideAutocomplete();
            if (cell._pointerFocus) {
                cell._pointerFocus = false;
                return;
            }

                cell._leftOnce = false

const range = document.createRange()
range.selectNodeContents(cell)
range.collapse(false)

const sel = window.getSelection()
sel.removeAllRanges()
sel.addRange(range)

})

        cell.contentEditable = !readOnly;
        cell.dataset.row = row;
cell.dataset.col = -1;
        cell.tabIndex = 0;

cell.addEventListener("paste",(e)=>{
if(readOnly) return
e.preventDefault()
const text = (e.clipboardData || window.clipboardData).getData("text")
this.handleCellPaste(cell, text)
})

cell.addEventListener("keydown",(e)=>{

if(this.handleSelectionHotkey(e, cell)) return

if(e.key==="Enter" && !e.shiftKey){
e.preventDefault()
cell.blur()
return
}

// DIREITA (vai para primeira cÃ©lula da linha)
if(e.key==="ArrowRight"){
e.preventDefault()

const next = document.querySelector(
`#qtsGrid div[data-row="${row}"][data-col]:not([data-col="-1"])`
)

if(next){
next.focus()
return
}
}

if(e.key==="ArrowLeft"){

const sel = window.getSelection()

if(sel && sel.rangeCount > 0){

const range = sel.getRangeAt(0)

// se NÃƒO estÃ¡ no comeÃ§o â†’ nÃ£o sai
if(range.startOffset !== 0){
return
}

}

e.preventDefault()

// pega a Ãºltima cÃ©lula vÃ¡lida da linha
const cells = document.querySelectorAll(
`#qtsGrid div[data-row="${row}"][data-col]:not([data-col="-1"])`
)

if(cells.length > 0){
cells[cells.length - 1].focus()
}
}

// BAIXO (mantÃ©m coluna horÃ¡rio)
if(e.key==="ArrowDown"){
e.preventDefault()

let r = row + 1
let next = null

while(!next){

if(r > 50) break

next = document.querySelector(
`#qtsGrid .qts-time[data-row="${r}"]`
)

// se nÃ£o achou horÃ¡rio, tenta cÃ©lula normal
if(!next){
next = document.querySelector(
`#qtsGrid div[data-row="${r}"][data-col="0"]`
)
}

r++
}

if(next) next.focus()
}

// CIMA
if(e.key==="ArrowUp"){
e.preventDefault()

let r = row - 1
let prev = null

while(!prev){

if(r < 0) break

prev = document.querySelector(
`#qtsGrid .qts-time[data-row="${r}"]`
)

if(!prev){
prev = document.querySelector(
`#qtsGrid div[data-row="${r}"][data-col="0"]`
)
}

r--
}

if(prev) prev.focus()
}

e.stopPropagation()

})
        cell.classList.add("qts-time");

        if (this.data.grid[row]?._time)
            cell.textContent =
                this.data.grid[row]._time;

        cell.onblur = () => {
if(readOnly) return

this.data.grid[row] =
this.data.grid[row] || {};

this.data.grid[row]._time =
cell.textContent;

const text = cell.textContent.trim()

if(text){

let h = 0
let m = 0

if(text.includes(":")){
const parts = text.replace("h",":").split(":")
h = parseInt(parts[0])
m = parseInt(parts[1]) || 0
}else{
h = parseInt(text)
m = 0
}

if(!isNaN(h)){

// NORMALIZA A CÃ‰LULA ATUAL
const formatted =
`${String(h).padStart(2,"0")}:${String(m).padStart(2,"0")}`

cell.textContent = formatted

this.data.grid[row]._time = formatted
this.reflowTimesFromRow(row)
}
}

this.save()
this.refreshIntervalLabels()
this.renderSubjectSummary()

};

        return cell;
    },

    createEditableCell(row, day, colIndex) {

        const cell =
            document.createElement("div");
        const readOnly =
            this.isReadonlyWeekView();

            this.wireSelectableCell(cell);
            cell.addEventListener("pointerdown", () => {
                cell._pointerFocus = true;
            });
            cell.addEventListener("focus", () => {
                this.hideAutocomplete();
                cell._pointerFocus = false;
                cell._leftOnce = false;

                if (cell._qtsEditing) {
                    return;
                }

                this.selectSingleCell(cell);
            })

        cell.contentEditable = !readOnly;

        cell.addEventListener("paste", (e) => {
    if(readOnly) return;
    e.preventDefault();
    const text = (e.clipboardData || window.clipboardData).getData("text");
    const matrix = this.parsePasteMatrix(text);

    if(matrix.length > 1 || matrix[0]?.length > 1){
        this.handleCellPaste(cell, text);
        return;
    }

    if(!cell._qtsEditing){
        this.clearSelectedTableCells()
        this.selectSingleCell(cell)
        cell.textContent = text
        cell._qtsEditing = true
        this.updateAutocomplete(cell)
        this.setCellCaretToEnd(cell)
        return
    }

    document.execCommand("insertText", false, text);
    this.updateAutocomplete(cell);
});

cell.addEventListener("input",()=>{
if(readOnly) return
this.updateAutocomplete(cell)
})
        
cell.dataset.navIndex = 
document.querySelectorAll('#qtsGrid div[contenteditable="true"]').length;
cell.tabIndex = 0;
cell.dataset.row = row;
cell.dataset.col = colIndex;

cell.addEventListener("keydown",(e)=>{

if(this.handleAutocompleteHotkey(e, cell)) return
if(this.handleSelectionHotkey(e, cell)) return

if(
    !cell._qtsEditing &&
    this.isPrintableCellKey(e)
){
e.preventDefault()
this.clearSelectedTableCells()
this.selectSingleCell(cell)
cell.textContent = e.key
cell._qtsEditing = true
this.updateAutocomplete(cell)
this.setCellCaretToEnd(cell)
return
}

if(e.key==="Tab"){
e.preventDefault()
cell._qtsEditing = false
this.commitEditableCell(cell, false)
this.hideAutocomplete()
this.navigateCell(
    parseInt(cell.dataset.row, 10),
    parseInt(cell.dataset.col, 10),
    e.shiftKey ? "left" : "right"
)
return
}

// ENTER = salva (blur)
if(e.key==="Enter" && !e.shiftKey){
e.preventDefault()
cell._qtsEditing = false
cell.blur()
return
}

// SHIFT+ENTER = quebra de linha
if(e.key==="Enter" && e.shiftKey){
e.preventDefault()
return
}

const sel = window.getSelection()

let atStart = false
let atEnd = false

if(sel && sel.rangeCount > 0){

const range = sel.getRangeAt(0)

// forÃ§a leitura correta independente de nodes
const pre = range.cloneRange()
pre.selectNodeContents(cell)
pre.setEnd(range.startContainer, range.startOffset)

atStart = pre.toString().length === 0

const post = range.cloneRange()
post.selectNodeContents(cell)
post.setStart(range.endContainer, range.endOffset)

atEnd = post.toString().length === 0
}

const r = parseInt(cell.dataset.row)
const c = parseInt(cell.dataset.col)

// DIREITA
if(e.key==="ArrowRight"){
if(!cell._qtsEditing){
e.preventDefault()
this.navigateCell(r, c, "right")
return
}
if(!atEnd) return
e.preventDefault()
this.navigateCell(r, c, "right")
}

// ESQUERDA
if(e.key==="ArrowLeft"){
if(!cell._qtsEditing){
e.preventDefault()
this.navigateCell(r, c, "left")
return
}
if(!atStart) return
e.preventDefault()
this.navigateCell(r, c, "left")
}

// BAIXO
if(e.key==="ArrowDown"){
e.preventDefault()
cell._qtsEditing = false
this.navigateCell(r, c, "down")
}

// CIMA
if(e.key==="ArrowUp"){
e.preventDefault()
cell._qtsEditing = false
this.navigateCell(r, c, "up")
}
})

        if (this.data.grid[row]?.[day])
            cell.textContent =
                this.data.grid[row][day];

        cell.onblur = () => {
            if(readOnly) return;
            cell._qtsEditing = false;
            this.commitEditableCell(cell, false);
            this.save();
            this.renderSubjectSummary();
            setTimeout(() => {
                if (
                    this.autocomplete.activeCell ===
                    cell
                ) {
                    this.hideAutocomplete();
                }
            }, 120);
        };

        return cell;
    },
    
   highlightCurrentTime(){

if(!this.data.showTimeColumn) return

const times = document.querySelectorAll(".qts-time")
if(!times.length) return

document.querySelectorAll(".qts-now").forEach(el=>el.classList.remove("qts-now"));

const now = new Date()
const currentMinutes = now.getHours()*60 + now.getMinutes()

times.forEach((cell)=>{

const text = cell.textContent.trim()
if(!text) return

const parts = text.replace("h",":").split(":")
const h = parseInt(parts[0])
const m = parseInt(parts[1]) || 0

if(isNaN(h)) return

const minutes = h*60 + m

if(currentMinutes >= minutes && currentMinutes < minutes + 60){
let el = cell

while(el && !el.classList.contains("qts-header")){

el.classList.add("qts-now")
el = el.nextElementSibling

}

}

})

setTimeout(()=>this.highlightCurrentTime(), 60000);

},

commitPendingEdits() {
    const active =
        document.activeElement;
    const qtsRoot =
        document.getElementById("qtsModule");

    if (!active || !qtsRoot || !qtsRoot.contains(active)) {
        return;
    }

    if (active.isContentEditable) {
        active.blur();
    }
},

applyTemplate(type){

this.commitPendingEdits()
if(this.isReadonlyWeekView()) return

if(type === "manual"){
this.data.activeTemplate = "manual"
this.save()
this.render()
return
}

const template =
    this.getTemplateDefinition(type)

if(!template) return

const snapshots =
    this.getRowSnapshots()
const startTime =
    this.getSeedStartTime()

this.data.activeTemplate =
    template.activeTemplate
this.data.studyDuration =
    template.studyDuration
this.data.structure =
    template.structure.map((item) => ({ ...item }))

this.generateTimes(startTime)
this.restoreRowSnapshots(snapshots)
this.refreshIntervalLabels()
this.save()
this.render()
},

    save() {
        this.syncViewedWeekPlan();
        localStorage.setItem(
            "qts_core_v6",
            JSON.stringify(this.data)
        );
    },

    generateTimes(startTime){

let h = parseInt(startTime.split(":")[0])
let m = parseInt(startTime.split(":")[1]) || 0

let current = h * 60 + m

this.data.grid = {}

for(let i = 0; i < this.data.structure.length; i++){

const item = this.data.structure[i]

if(item.type === "row"){

const hh = Math.floor(current / 60)
const mm = current % 60

this.data.grid[i] = {
_time: `${String(hh).padStart(2,"0")}:${String(mm).padStart(2,"0")}`
}

// soma estudo
const study = item.duration || this.data.studyDuration || 25
current += study
}

if(item.type === "interval"){

const txt = item.duration || ""
const match = txt.match(/\d+/)

if(match){
current += parseInt(match[0])
}
}
}

},

    getRowTimeRange(rowIndex){

const base = this.data.grid[rowIndex]?._time
if(!base) return null

let h = 0
let m = 0

if(base.includes(":")){
const parts = base.split(":")
h = parseInt(parts[0])
m = parseInt(parts[1]) || 0
}else{
h = parseInt(base)
m = 0
}

if(isNaN(h)) return null

let start = h*60 + m

let studyDuration = this.getStudyDuration(rowIndex)

let breakDuration = this.getBreakDuration(rowIndex)

// fim do estudo
let endStudy = start + studyDuration

// fim do intervalo
let endBreak = endStudy + breakDuration

return {
start: endStudy,   // inÃ­cio da pausa
end: endBreak      // fim da pausa
}

},

    getVisibleDays() {

const visibleDays = this.days.filter((day, index) => {

if(index === 0 && !this.data.showSunday) return false
if(index === 6 && !this.data.showSaturday) return false

return true

})

return visibleDays

},

    getDayName(dayIndex = new Date().getDay()) {

return this.days[dayIndex] || this.days[1]

},

    getVisibleDaysFromPlan(plan) {
        return this.days.filter((day, index) => {
            if (index === 0 && !plan.showSunday) return false;
            if (index === 6 && !plan.showSaturday) return false;
            return true;
        });
    },

    getStudyDurationFromPlan(plan, rowIndex) {
        const row =
            plan?.structure?.[rowIndex] || {};
        const duration =
            Number(row.duration);

        if (
            Number.isFinite(duration) &&
            duration > 0
        ) {
            return duration;
        }

        return plan?.studyDuration || 25;
    },

    getBreakDurationFromPlan(plan, rowIndex) {
        const nextItem =
            plan?.structure?.[rowIndex + 1];

        if (!nextItem || nextItem.type !== "interval") {
            return 5;
        }

        return this.getIntervalMinutesFromText(
            nextItem.duration
        );
    },

    parseTimeToMinutes(value) {

if(!value) return null

const text = String(value).trim()
if(!text) return null

const normalized = text.replace("h", ":")
const parts = normalized.split(":")
const hours = parseInt(parts[0], 10)
const minutes = parseInt(parts[1], 10) || 0

if(Number.isNaN(hours) || Number.isNaN(minutes)){
return null
}

return (hours * 60) + minutes

},

    formatMinutes(totalMinutes) {

const normalized =
((totalMinutes % 1440) + 1440) % 1440

const hours = Math.floor(normalized / 60)
const minutes = normalized % 60

return `${String(hours).padStart(2,"0")}:${String(minutes).padStart(2,"0")}`

},

    getStudyDuration(rowIndex) {

const row = this.data.structure[rowIndex] || {}
const duration = Number(row.duration)

if(Number.isFinite(duration) && duration > 0){
return duration
}

return this.data.studyDuration || 25

},

    getBreakDuration(rowIndex) {

const nextItem = this.data.structure[rowIndex + 1]

if(!nextItem || nextItem.type !== "interval"){
return 5
}

return this.getIntervalDurationByIndex(rowIndex + 1)

},

    inferPresetKey(studyMinutes, breakMinutes) {

const signature = `${studyMinutes}/${breakMinutes}`

const map = {
"25/5": "tradicional",
"50/15": "estendido",
"52/17": "metodo5217",
"90/30": "ultradiano",
"15/5": "mini"
}

return map[signature] || "custom"

},

    getPlanForDate(date = new Date()) {

const dayIndex = date.getDay()
const dayName = this.getDayName(dayIndex)
const weekKey = this.getWeekKey(date)
const planState =
    this.resolveWeekPlan(weekKey, {
        ensureCurrent:
            weekKey === this.getWeekKey(new Date())
    })
const visibleDays =
    this.getVisibleDaysFromPlan(planState)
const dateKey =
`${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2,"0")}-${String(date.getDate()).padStart(2,"0")}`

if(!visibleDays.includes(dayName)){
return {
dateKey,
dayIndex,
dayName,
items: [],
hasSchedule: false
}
}

const items = []

planState.structure.forEach((item, rowIndex) => {

if(!item || item.type !== "row") return

const rowData = planState.grid[rowIndex] || {}
const timeLabel = String(rowData._time || "").trim()
const startMinutes = this.parseTimeToMinutes(timeLabel)

if(startMinutes === null) return

const rawTitle = String(rowData[dayName] || "").trim()
const title = rawTitle || "Bloco sem título"
const studyMinutes =
    this.getStudyDurationFromPlan(
        planState,
        rowIndex
    )
const breakMinutes =
    this.getBreakDurationFromPlan(
        planState,
        rowIndex
    )
const endMinutes = startMinutes + studyMinutes
const resetMinutes = endMinutes + breakMinutes

items.push({
id: `${dayIndex}-${rowIndex}-${timeLabel}`,
rowIndex,
queueIndex: items.length,
dayIndex,
dayName,
title,
hasTitle: Boolean(rawTitle),
timeLabel,
startMinutes,
endMinutes,
resetMinutes,
studyMinutes,
breakMinutes,
studyRange: `${this.formatMinutes(startMinutes)} - ${this.formatMinutes(endMinutes)}`,
fullRange: `${this.formatMinutes(startMinutes)} - ${this.formatMinutes(resetMinutes)}`,
presetKey: this.inferPresetKey(studyMinutes, breakMinutes)
})

})

return {
dateKey,
dayIndex,
dayName,
items,
hasSchedule: items.length > 0
}

},

    navigateCell(row, col, direction){

const next =
    this.findNextSelectableCoord(
        row,
        col,
        direction
    )

if(!next) return

let target =
    this.getSelectableCellAt(
        next.row,
        next.col
    )

if(target){
target.focus()
}
}
    
};

document.addEventListener("DOMContentLoaded", () => {
    QTS.init();
});

/* =====================================================
   POMODORO MODULE - CORE
===================================================== */

const Pomodoro = {

    interval: null,
    mode: "study",
    remaining: 0,
    running: false,
    audioCtx: null,
    currentStudySessionSeconds: null,
    linkedScheduleConfig: null,
    linkedTodayBlockId: null,
    todayRefreshInterval: null,
    todayProgressStorageKey: "study_today_flow_v1",
    syncStorageKey: "study_pomodoro_sync_v1",
    syncEnabled: false,
    todayFlowExpanded: false,

    presets: {
        tradicional: {
            study: 25 * 60,
            break: 5 * 60,
            label: "Tomate 25/5",
            desc: "25/5 ideal para foco padrao e produtividade diaria."
        },
        estendido: {
            study: 50 * 60,
            break: 15 * 60,
            label: "Long / Deep Work 50/15",
            desc: "Sessoes longas para trabalho profundo."
        },
        metodo5217: {
            study: 52 * 60,
            break: 17 * 60,
            label: "52/17",
            desc: "Baseado em estudos sobre foco sustentado."
        },
        ultradiano: {
            study: 90 * 60,
            break: 30 * 60,
            label: "Ritmo 90/30",
            desc: "Ciclo ultradiano de alto desempenho."
        },
        mini: {
            study: 15 * 60,
            break: 5 * 60,
            label: "Sprint 15/5",
            desc: "Ideal para tarefas rapidas ou iniciar foco."
        },
        progressivo: {
            study: 15 * 60,
            break: 5 * 60,
            label: "Progressivo",
            desc: "15/5 - 25/7,5 - 35/10 - 45/15..."
        },
        custom: {
            study: 30 * 60,
            break: 5 * 60,
            label: "Custom",
            desc: "Intervalos definidos pelo usuario."
        }
    },

    customSequence: [],
    customIndex: 0,
    customActive: false,
    currentPreset: "tradicional",

    progressiveLevels: [
        { study: 15 * 60, break: 5 * 60 },
        { study: 25 * 60, break: 7.5 * 60 },
        { study: 35 * 60, break: 10 * 60 },
        { study: 45 * 60, break: 15 * 60 }
    ],

    progressiveIndex: 0,

    openCustomModal() {
        const modal = document.getElementById("customModal");
        if (!modal) return;

        modal.classList.remove("hidden");

        this.customSequence = [
            { type: "study", minutes: 25 },
            { type: "break", minutes: 5 }
        ];

        this.renderCustomRows();
        document.addEventListener("keydown", this.handleEnterSave);
    },

    closeCustomModal() {
        const modal = document.getElementById("customModal");
        if (modal) {
            modal.classList.add("hidden");
        }

        document.removeEventListener("keydown", this.handleEnterSave);
    },

    handleEnterSave: (event) => {
        if (event.key === "Enter") {
            Pomodoro.saveCustom();
        }
    },

    addCustomRow() {
        const type =
            this.customSequence.length % 2 === 0
                ? "study"
                : "break";

        this.customSequence.push({
            type,
            minutes: type === "study" ? 25 : 5
        });

        this.renderCustomRows();
    },

    removeCustomRow() {
        if (this.customSequence.length <= 2) return;

        this.customSequence.pop();
        this.renderCustomRows();
    },

    renderCustomRows() {
        const container = document.getElementById("customRows");
        if (!container) return;

        container.innerHTML = "";

        this.customSequence.forEach((item, index) => {
            const row = document.createElement("div");
            row.className = "custom-row";

            const label = document.createElement("span");
            label.textContent =
                item.type === "study"
                    ? "Estudo"
                    : "Descanso";

            const input = document.createElement("input");
            input.type = "number";
            input.min = 1;
            input.value = item.minutes;

            input.oninput = (event) => {
                this.customSequence[index].minutes =
                    Number(event.target.value);
            };

            row.appendChild(label);
            row.appendChild(input);
            container.appendChild(row);
        });
    },

    saveCustom() {
        if (this.customSequence.length < 2) return;

        this.customIndex = 0;
        this.customActive = true;
        this.linkedScheduleConfig = null;
        this.linkedTodayBlockId = null;
        this.currentPreset = "custom";
        this.mode = this.customSequence[0].type;
        this.remaining = this.customSequence[0].minutes * 60;
        this.currentStudySessionSeconds = null;

        this.renderCycleProgress();
        this.updateDisplay();
        this.renderPresets();
        this.renderTodayFlow();
        this.closeCustomModal();
    },

    renderPresets() {
        const container = document.getElementById("pomodoroPresets");
        if (!container) return;

        container.innerHTML = `
            <div class="pomodoro-presets-heading">
                <h2 class="pomodoro-presets-title">
                    <span>Métodos de estudo</span>
                    <em>Pomodoro</em>
                </h2>
            </div>
            <div class="pomodoro-presets-grid"></div>
        `;

        const grid =
            container.querySelector(".pomodoro-presets-grid");

        if (!grid) return;

        Object.keys(this.presets).forEach((key) => {
            const preset = this.presets[key];
            const chip = document.createElement("div");

            chip.className = "preset-chip";
            chip.textContent = preset.label;
            chip.title = preset.desc;

            if (key === this.currentPreset) {
                chip.classList.add("active");
            }

            if (this.syncEnabled) {
                chip.classList.add("is-disabled");
            } else {
                chip.classList.add("is-clickable");
            }

            chip.onclick = () => {
                if (this.syncEnabled) {
                    return;
                }

                if (key === "custom") {
                    this.openCustomModal();
                    return;
                }

                this.setPreset(key);
                this.renderPresets();
            };

            grid.appendChild(chip);
        });
    },

    renderCycleProgress() {
        const container = document.getElementById("cycleProgress");
        if (!container) return;

        container.innerHTML = "";

        if (!this.customActive) return;

        this.customSequence.forEach((item, index) => {
            const bar = document.createElement("div");
            bar.className = "cycle-bar";

            if (index <= this.customIndex) {
                bar.classList.add("active");
            }

            if (item.type === "break") {
                bar.classList.add("is-break");
            }

            container.appendChild(bar);
        });
    },

    renderProgressiveBars() {
        const container = document.getElementById("progressiveBars");
        if (!container) return;

        container.innerHTML = "";

        if (this.currentPreset !== "progressivo") return;

        const rail = document.createElement("div");
        rail.className = "progressive-rail";

        const bars = document.createElement("div");
        bars.className = "cycle-progress";

        this.progressiveLevels.forEach((level, index) => {
            const bar = document.createElement("div");
            bar.className = "progressive-bar";

            if (index < this.progressiveIndex) {
                bar.classList.add("active");
            }

            if (index === this.progressiveIndex) {
                bar.classList.add("active");

                if (this.mode === "break") {
                    const dot = document.createElement("div");
                    dot.className = "progressive-dot";
                    bar.appendChild(dot);
                }
            }

            bar.title = `${Math.round(level.study / 60)}/${Math.round(level.break / 60)}`;
            bars.appendChild(bar);
        });

        if (this.progressiveIndex > 0) {
            const backBtn = document.createElement("button");
            backBtn.type = "button";
            backBtn.className = "progressive-back-btn";
            backBtn.textContent = "Voltar";
            backBtn.disabled = this.syncEnabled;
            backBtn.onclick = () => {
                if (this.syncEnabled) return;
                this.progressiveIndex = Math.max(0, this.progressiveIndex - 1);
                this.mode = "study";
                this.remaining = this.progressiveLevels[this.progressiveIndex].study;
                this.currentStudySessionSeconds = null;
                this.pause();
                this.updateDisplay();
                this.renderPresets();
                this.renderTodayFlow();
            };
            rail.appendChild(backBtn);
        }

        rail.appendChild(bars);
        container.appendChild(rail);
    },

    updateCycleProgress() {
        this.renderCycleProgress();
    },

    render() {
        const progressiveBars =
            document.getElementById("progressiveBars");
        const cycleBars =
            document.getElementById("cycleProgress");

        if (progressiveBars) progressiveBars.innerHTML = "";
        if (cycleBars) cycleBars.innerHTML = "";

        this.pause();
        this.currentStudySessionSeconds = null;
        Core.state.running = false;
        this.running = false;

        this.loadSyncPreference();

        if (this.syncEnabled) {
            this.syncTodayFlowToPlan();
            this.updateSyncedClock();
        } else {
            this.detachLinkedSchedule();
            this.applyDefaultState();
            this.updateDisplay();
        }
        this.renderPresets();
        this.renderTodayFlow();
        this.ensureTodayRefreshInterval();
    },

    play() {
        if (this.syncEnabled) return;
        if (this.interval) return;

        if (this.remaining <= 0) return;

        if (
            this.mode === "study" &&
            !this.currentStudySessionSeconds
        ) {
            this.currentStudySessionSeconds = this.remaining;
        }

        this.running = true;
        Core.state.running = true;

        this.interval = setInterval(() => {
            this.remaining--;

            if (this.remaining <= 0) {
                clearInterval(this.interval);
                this.interval = null;
                this.switchMode();
                return;
            }

            this.updateDisplay();
        }, 1000);
    },

    pause() {
        if (this.syncEnabled) return;
        clearInterval(this.interval);
        this.interval = null;
        this.running = false;
        Core.state.running = false;
    },

    reset() {
        if (this.syncEnabled) return;
        this.pause();

        if (this.customActive) {
            this.customIndex = 0;
            this.mode = this.customSequence[0]?.type || "study";
            this.remaining =
                (this.customSequence[0]?.minutes || 25) * 60;
            this.renderCycleProgress();
        } else if (this.linkedScheduleConfig) {
            this.mode = "study";
            this.remaining = this.linkedScheduleConfig.study;
        } else if (this.currentPreset === "progressivo") {
            this.mode = "study";
            this.remaining =
                this.progressiveLevels[this.progressiveIndex].study;
        } else {
            this.mode = "study";
            this.remaining =
                this.presets[this.currentPreset].study;
        }

        this.currentStudySessionSeconds = null;
        this.updateDisplay();
    },

    switchMode() {
        if (this.interval) {
            clearInterval(this.interval);
            this.interval = null;
        }

        if (this.customActive) {
            this.switchCustomMode();
            return;
        }

        if (this.linkedScheduleConfig) {
            this.switchLinkedMode();
            return;
        }

        if (this.currentPreset === "progressivo") {
            this.switchProgressiveMode();
            return;
        }

        this.switchPresetMode();
    },

    switchCustomMode() {
        if (this.mode === "study") {
            this.logStudySession(
                this.getStudySecondsForLog(),
                "Custom"
            );
        }

        this.customIndex++;

        if (this.customIndex >= this.customSequence.length) {
            this.currentStudySessionSeconds = null;
            this.beepFinish();
            this.pause();
            this.renderTodayFlow();
            return;
        }

        const next = this.customSequence[this.customIndex];

        this.mode = next.type;
        this.remaining = next.minutes * 60;
        this.currentStudySessionSeconds = null;

        this.updateCycleProgress();
        this.updateDisplay();
        this.beepCycle();
        this.play();
    },

    switchProgressiveMode() {
        if (this.mode === "study") {
            this.logStudySession(
                this.getStudySecondsForLog(),
                "Progressivo"
            );

            this.mode = "break";
            this.remaining =
                this.progressiveLevels[this.progressiveIndex].break;
            this.currentStudySessionSeconds = null;
        } else {
            if (
                this.progressiveIndex <
                this.progressiveLevels.length - 1
            ) {
                this.progressiveIndex++;
            }

            this.mode = "study";
            this.remaining =
                this.progressiveLevels[this.progressiveIndex].study;
            this.currentStudySessionSeconds = null;
        }

        this.updateDisplay();
        this.beepCycle();
        this.play();
    },

    switchPresetMode() {
        const cycle = this.getCycleConfig();

        if (this.mode === "study") {
            this.logStudySession(
                this.getStudySecondsForLog(),
                cycle.label
            );

            this.mode = "break";
            this.remaining = cycle.break;
            this.currentStudySessionSeconds = null;
        } else {
            this.mode = "study";
            this.remaining = cycle.study;
            this.currentStudySessionSeconds = null;
        }

        this.updateDisplay();
        this.beepCycle();
        this.play();
    },

    switchLinkedMode() {
        const linkedBlock =
            this.getTodayBlockById(this.linkedTodayBlockId);

        if (this.mode === "study") {
            this.logStudySession(
                this.getStudySecondsForLog(),
                linkedBlock ? linkedBlock.title : "Sessão do dia"
            );

            if (linkedBlock) {
                this.markTodayBlockLogged(linkedBlock.id);
            }

            const breakSeconds =
                this.linkedScheduleConfig.break;

            if (breakSeconds > 0) {
                this.mode = "break";
                this.remaining = breakSeconds;
                this.currentStudySessionSeconds = null;
                this.updateDisplay();
                this.renderTodayFlow();
                this.beepCycle();
                this.play();
                return;
            }
        }

        if (linkedBlock) {
            this.markTodayBlockDone(linkedBlock.id);
        }

        const nextBlock =
            this.getNextPendingTodayBlock(
                linkedBlock ? linkedBlock.id : null
            );

        this.pause();
        this.currentStudySessionSeconds = null;

        if (nextBlock) {
            this.attachTodayBlock(nextBlock, {
                snapToCalendar: true,
                persistSelection: true
            });
            this.beepCycle();
        } else {
            this.detachLinkedSchedule();
            this.applyDefaultState();
            this.beepFinish();
        }

        this.updateDisplay();
        this.renderPresets();
        this.renderTodayFlow();
    },

    updateDisplay() {
        const time = this.format(this.remaining);
        const timeDisplay =
            document.getElementById("timeDisplay");
        const dateDisplay =
            document.getElementById("dateDisplay");

        if (timeDisplay) {
            timeDisplay.textContent = time;
        }

        if (dateDisplay) {
            const modeLabel =
                this.mode === "study"
                    ? "Estudo"
                    : "Descanso";

            dateDisplay.textContent =
                `${this.getDisplayPresetLabel()} - ${modeLabel}`;
        }

        this.syncControlLockUI();
        this.renderProgressiveBars();
    },

    setPreset(name) {
        if (!this.presets[name]) return;
        if (this.syncEnabled) return;

        this.customActive = false;
        this.currentPreset = name;

        const progressiveBars =
            document.getElementById("progressiveBars");

        if (progressiveBars) {
            progressiveBars.innerHTML = "";
        }

        if (name === "progressivo") {
            this.progressiveIndex = 0;
            this.currentStudySessionSeconds = null;

            if (this.syncEnabled && this.linkedTodayBlockId) {
                this.refreshLinkedCycleConfig();
                this.alignLinkedBlockToNow();
            } else {
                this.mode = "study";
                this.remaining =
                    this.progressiveLevels[0].study;
            }

            this.updateDisplay();
            this.renderTodayFlow();
            return;
        }

        if (this.syncEnabled && this.linkedTodayBlockId) {
            this.refreshLinkedCycleConfig();
            this.alignLinkedBlockToNow();
            this.currentStudySessionSeconds = null;
            this.updateDisplay();
            this.renderTodayFlow();
            return;
        }

        this.detachLinkedSchedule();

        this.reset();
        this.renderTodayFlow();
    },

    applyDefaultState() {
        this.customActive = false;

        if (this.currentPreset === "progressivo") {
            this.progressiveIndex = 0;
            this.mode = "study";
            this.remaining =
                this.progressiveLevels[0].study;
            return;
        }

        this.mode = "study";
        this.remaining =
            this.presets[this.currentPreset].study;
    },

    getCycleConfig() {
        if (this.linkedScheduleConfig) {
            return {
                study: this.linkedScheduleConfig.study,
                break: this.linkedScheduleConfig.break,
                label: this.linkedScheduleConfig.label
            };
        }

        if (this.currentPreset === "progressivo") {
            return {
                study: this.progressiveLevels[this.progressiveIndex].study,
                break: this.progressiveLevels[this.progressiveIndex].break,
                label: "Progressivo"
            };
        }

        return this.presets[this.currentPreset];
    },

    getSelectedCycleForSync() {
        if (this.customActive && this.customSequence.length) {
            const studyStep =
                this.customSequence.find((item) =>
                    item.type === "study"
                );
            const breakStep =
                this.customSequence.find((item) =>
                    item.type === "break"
                );

            return {
                study: (studyStep?.minutes || 25) * 60,
                break: (breakStep?.minutes || 5) * 60,
                label: "Custom"
            };
        }

        if (this.currentPreset === "progressivo") {
            return {
                study: this.progressiveLevels[this.progressiveIndex].study,
                break: this.progressiveLevels[this.progressiveIndex].break,
                label: "Progressivo"
            };
        }

        return this.presets[this.currentPreset];
    },

    getBlockCycleConfig(block = null) {
        const targetBlock =
            block || this.getTodayBlockById(this.linkedTodayBlockId);

        if (!targetBlock) {
            return null;
        }

        const presetKey =
            targetBlock.presetKey ||
            (typeof QTS !== "undefined" &&
            typeof QTS.inferPresetKey === "function"
                ? QTS.inferPresetKey(
                    targetBlock.studyMinutes,
                    targetBlock.breakMinutes
                )
                : null);

        const presetLabel =
            presetKey &&
            presetKey !== "custom" &&
            this.presets[presetKey]
                ? this.presets[presetKey].label
                : `${targetBlock.studyMinutes}/${targetBlock.breakMinutes}`;

        return {
            study: (targetBlock.studyMinutes || 25) * 60,
            break: (targetBlock.breakMinutes || 5) * 60,
            label: presetLabel
        };
    },

    refreshLinkedCycleConfig(block = null) {
        const cycle =
            this.getBlockCycleConfig(block) ||
            this.getSelectedCycleForSync();

        this.linkedScheduleConfig = {
            study: cycle.study,
            break: cycle.break,
            label: cycle.label
        };
    },

    getDisplayPresetLabel() {
        if (this.linkedScheduleConfig?.label) {
            return this.linkedScheduleConfig.label;
        }

        if (this.currentPreset === "progressivo") {
            return this.progressiveIndex ===
                this.progressiveLevels.length - 1
                ? "Progressivo - Deep Mode"
                : "Progressivo";
        }

        return this.presets[this.currentPreset].label;
    },

    getTableModeLabel(block = null) {
        const cycle =
            this.getBlockCycleConfig(block);

        return cycle?.label || "Sem ritmo da tabela";
    },

    getStudySecondsForLog() {
        if (this.currentStudySessionSeconds) {
            return this.currentStudySessionSeconds;
        }

        const cycle = this.getCycleConfig();
        return cycle.study;
    },

    logStudySession(seconds, label) {
        if (typeof Stats === "undefined") return;

        Stats.addStudySeconds(seconds);
        Stats.addPomodoro();

        if (typeof Stats.logSession === "function") {
            Stats.logSession(label, seconds);
        }
    },

    format(totalSeconds) {
        const hours =
            String(Math.floor(totalSeconds / 3600))
                .padStart(2, "0");
        const minutes =
            String(Math.floor((totalSeconds % 3600) / 60))
                .padStart(2, "0");
        const seconds =
            String(totalSeconds % 60).padStart(2, "0");

        return `${hours}:${minutes}:${seconds}`;
    },

    getDateKey(date = new Date()) {
        return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
    },

    getNowMinutes(date = new Date()) {
        return (date.getHours() * 60) + date.getMinutes();
    },

    getNowSeconds(date = new Date()) {
        return (date.getHours() * 3600) +
            (date.getMinutes() * 60) +
            date.getSeconds();
    },

    formatRelativeMinutes(totalMinutes) {
        const minutes = Math.max(0, Math.round(totalMinutes));
        const hours = Math.floor(minutes / 60);
        const remaining = minutes % 60;

        if (hours <= 0) {
            return `${remaining} min`;
        }

        if (remaining === 0) {
            return `${hours}h`;
        }

        return `${hours}h ${String(remaining).padStart(2, "0")}min`;
    },

    formatClockMinutes(totalMinutes) {
        const normalized =
            ((totalMinutes % 1440) + 1440) % 1440;

        const hours =
            Math.floor(normalized / 60);

        const minutes =
            normalized % 60;

        return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
    },

    syncControlLockUI() {
        const controls =
            document.getElementById("controls");

        const buttonIds = [
            "playBtn",
            "pauseBtn",
            "resetBtn"
        ];

        buttonIds.forEach((id) => {
            const button =
                document.getElementById(id);

            if (button) {
                button.disabled = this.syncEnabled;
            }
        });

        if (controls) {
            controls.classList.toggle(
                "is-locked",
                this.syncEnabled
            );
        }
    },

    loadSyncPreference() {
        this.syncEnabled =
            localStorage.getItem(this.syncStorageKey) === "1";
        this.todayFlowExpanded =
            this.syncEnabled;
    },

    saveSyncPreference() {
        localStorage.setItem(
            this.syncStorageKey,
            this.syncEnabled ? "1" : "0"
        );
    },

    readTodayProgress(date = new Date()) {
        const storage =
            JSON.parse(
                localStorage.getItem(this.todayProgressStorageKey) || "{}"
            );

        const dateKey = this.getDateKey(date);
        const entry = storage[dateKey] || {
            activeBlockId: null,
            completedIds: [],
            loggedIds: []
        };

        if (!Array.isArray(entry.completedIds)) {
            entry.completedIds = [];
        }

        if (!Array.isArray(entry.loggedIds)) {
            entry.loggedIds = [];
        }

        return {
            storage,
            dateKey,
            entry
        };
    },

    writeTodayProgress(entry, date = new Date()) {
        const { storage, dateKey } =
            this.readTodayProgress(date);

        storage[dateKey] = {
            activeBlockId: entry.activeBlockId || null,
            completedIds: Array.from(
                new Set(entry.completedIds || [])
            ),
            loggedIds: Array.from(
                new Set(entry.loggedIds || [])
            )
        };

        localStorage.setItem(
            this.todayProgressStorageKey,
            JSON.stringify(storage)
        );
    },

    markTodayBlockDone(blockId, date = new Date()) {
        if (!blockId) return;

        const { entry } = this.readTodayProgress(date);

        entry.completedIds =
            entry.completedIds || [];

        if (!entry.completedIds.includes(blockId)) {
            entry.completedIds.push(blockId);
        }

        if (entry.activeBlockId === blockId) {
            entry.activeBlockId = null;
        }

        this.writeTodayProgress(entry, date);
    },

    markTodayBlockLogged(blockId, date = new Date()) {
        if (!blockId) return;

        const { entry } = this.readTodayProgress(date);

        entry.loggedIds =
            entry.loggedIds || [];

        if (!entry.loggedIds.includes(blockId)) {
            entry.loggedIds.push(blockId);
        }

        this.writeTodayProgress(entry, date);
    },

    hasTodayBlockLogged(blockId, date = new Date()) {
        if (!blockId) return false;

        const { entry } = this.readTodayProgress(date);
        return (entry.loggedIds || []).includes(blockId);
    },

    setTodayActiveBlock(blockId, date = new Date()) {
        const { entry } = this.readTodayProgress(date);
        entry.activeBlockId = blockId || null;
        this.writeTodayProgress(entry, date);
    },

    getTodayBlockStudySeconds(block) {
        if (!block) {
            return this.getSelectedCycleForSync().study;
        }

        const scheduledSeconds =
            Math.max(
                (block.endMinutes - block.startMinutes) * 60,
                0
            );

        if (scheduledSeconds > 0) {
            return scheduledSeconds;
        }

        return this.linkedScheduleConfig?.study ||
            this.getSelectedCycleForSync().study;
    },

    reconcileSyncedProgress(date = new Date()) {
        if (!this.syncEnabled) return;

        const plan =
            typeof QTS !== "undefined" &&
            typeof QTS.getPlanForDate === "function"
                ? QTS.getPlanForDate(date)
                : null;

        if (!plan?.items?.length) return;

        const nowSeconds =
            this.getNowSeconds(date);

        const { entry } = this.readTodayProgress(date);

        entry.completedIds =
            entry.completedIds || [];
        entry.loggedIds =
            entry.loggedIds || [];

        let changed = false;

        plan.items.forEach((item) => {
            const studyEndsAt =
                item.endMinutes * 60;
            const blockResetsAt =
                item.resetMinutes * 60;

            if (
                nowSeconds >= studyEndsAt &&
                !entry.loggedIds.includes(item.id)
            ) {
                this.logStudySession(
                    this.getTodayBlockStudySeconds(item),
                    item.title || "Sessão do dia"
                );
                entry.loggedIds.push(item.id);
                changed = true;
            }

            if (
                nowSeconds >= blockResetsAt &&
                !entry.completedIds.includes(item.id)
            ) {
                entry.completedIds.push(item.id);

                if (entry.activeBlockId === item.id) {
                    entry.activeBlockId = null;
                }

                changed = true;
            }
        });

        if (changed) {
            this.writeTodayProgress(entry, date);
        }
    },

    getTodayFlowState(now = new Date()) {
        const emptyPlan = {
            dateKey: this.getDateKey(now),
            dayIndex: now.getDay(),
            dayName: "",
            items: [],
            hasSchedule: false
        };

        const plan =
            typeof QTS !== "undefined" &&
            typeof QTS.getPlanForDate === "function"
                ? QTS.getPlanForDate(now)
                : emptyPlan;

        const { entry } =
            this.readTodayProgress(now);

        const completedIds =
            new Set(entry.completedIds || []);

        const pendingItems =
            (plan.items || [])
                .filter((item) => !completedIds.has(item.id));

        const nowMinutes =
            this.getNowMinutes(now);

        const linkedBlock =
            this.getTodayBlockById(
                this.linkedTodayBlockId,
                plan.items || []
            );

        let current =
            pendingItems.find((item) =>
                item.id === entry.activeBlockId
            ) || null;

        const liveItem =
            pendingItems.find((item) =>
                nowMinutes >= item.startMinutes &&
                nowMinutes < item.resetMinutes
            ) || null;

        const upcomingItem =
            pendingItems.find((item) =>
                nowMinutes < item.startMinutes
            ) || null;

        if (this.syncEnabled) {
            const linkedPendingItem =
                pendingItems.find((item) =>
                    item.id === this.linkedTodayBlockId
                ) || null;

            current =
                liveItem ||
                linkedPendingItem ||
                upcomingItem ||
                pendingItems[0] ||
                null;
        } else if (!current || nowMinutes >= current.resetMinutes) {
            current = liveItem || upcomingItem || pendingItems[0] || null;
        }

        if (
            linkedBlock &&
            this.linkedScheduleConfig &&
            nowMinutes >=
                linkedBlock.startMinutes &&
            nowMinutes <
                linkedBlock.resetMinutes
        ) {
            current = linkedBlock;
        }

        const missedItems =
            pendingItems.filter((item) =>
                nowMinutes >= item.resetMinutes &&
                (!current || item.id !== current.id)
            );

        const queueItems =
            pendingItems.filter((item) =>
                !current || item.id !== current.id
            );

        const allItems = plan.items || [];
        const currentIndex =
            current
                ? allItems.findIndex((item) => item.id === current.id)
                : -1;

        const previousItem =
            currentIndex > 0
                ? allItems[currentIndex - 1]
                : null;

        const nextItem =
            currentIndex >= 0
                ? allItems
                    .slice(currentIndex + 1)
                    .find((item) => !completedIds.has(item.id)) || null
                : queueItems[0] || null;

        return {
            plan,
            entry,
            nowMinutes,
            completedCount: completedIds.size,
            totalCount: (plan.items || []).length,
            pendingItems,
            current,
            previousItem,
            nextItem,
            queueItems,
            missedCount: missedItems.length
        };
    },

    getTodayBlockById(blockId, sourceItems = null) {
        if (!blockId) return null;

        const items =
            sourceItems ||
            (typeof QTS !== "undefined" &&
            typeof QTS.getPlanForDate === "function"
                ? QTS.getPlanForDate(new Date()).items
                : []);

        return items.find((item) => item.id === blockId) || null;
    },

    getNextPendingTodayBlock(currentId = null) {
        const state = this.getTodayFlowState(new Date());
        const { pendingItems, plan } = state;

        if (!pendingItems.length) return null;

        if (!currentId) {
            return pendingItems[0];
        }

        const allItems = plan.items || [];
        const startIndex =
            allItems.findIndex((item) => item.id === currentId);

        if (startIndex === -1) {
            return pendingItems[0];
        }

        for (let index = startIndex + 1; index < allItems.length; index++) {
            const next = allItems[index];

            if (pendingItems.some((item) => item.id === next.id)) {
                return next;
            }
        }

        return pendingItems[0] || null;
    },

    attachTodayBlock(block, options = {}) {
        if (!block) return;

        const shouldPersistSelection =
            options.persistSelection !== false;

        this.linkedTodayBlockId = block.id;
        this.refreshLinkedCycleConfig();

        if (shouldPersistSelection) {
            this.setTodayActiveBlock(block.id);
        }

        if (options.snapToCalendar === false) {
            this.mode = "study";
            this.remaining = this.linkedScheduleConfig.study;
        } else {
            this.alignLinkedBlockToNow();
        }

        this.currentStudySessionSeconds = null;
    },

    detachLinkedSchedule() {
        this.linkedScheduleConfig = null;
        this.linkedTodayBlockId = null;
        this.currentStudySessionSeconds = null;
    },

    alignLinkedBlockToNow() {
        const block =
            this.getTodayBlockById(this.linkedTodayBlockId);

        if (!block || !this.linkedScheduleConfig) return;

        this.refreshLinkedCycleConfig();

        const nowMinutes =
            this.getNowMinutes(new Date());

        if (
            nowMinutes >= block.endMinutes &&
            nowMinutes < block.resetMinutes
        ) {
            this.mode = "break";
            this.remaining = this.linkedScheduleConfig.break;
            this.currentStudySessionSeconds = null;
            return;
        }

        this.mode = "study";
        this.remaining = this.linkedScheduleConfig.study;
        this.currentStudySessionSeconds = null;
    },

    syncTodayFlowToPlan(options = {}) {
        const state =
            this.getTodayFlowState(new Date());
        const targetBlock =
            state.current ||
            state.nextItem ||
            state.pendingItems?.[0] ||
            null;

        if (!targetBlock) {
            this.detachLinkedSchedule();
            return;
        }

        this.attachTodayBlock(targetBlock, {
            snapToCalendar: true,
            persistSelection: true
        });

        if (options.autostart) {
            this.updateSyncedClock();
            this.renderPresets();
        }
    },

    completeTodayFlowBlock() {
        const state =
            this.getTodayFlowState(new Date());

        const target =
            this.getTodayBlockById(this.linkedTodayBlockId) ||
            state.current;

        if (!target) return;

        this.pause();
        this.markTodayBlockDone(target.id);

        const nextBlock =
            this.getNextPendingTodayBlock(target.id);

        if (nextBlock) {
            this.attachTodayBlock(nextBlock, {
                snapToCalendar: true,
                persistSelection: true
            });
        } else {
            this.detachLinkedSchedule();
            this.applyDefaultState();
        }

        this.updateDisplay();
        this.renderPresets();
        this.renderTodayFlow();
    },

    resolveTodayStatus(block, state) {
        if (!block) {
            if (!state.totalCount) {
                return {
                    tone: "empty",
                    pill: "Vazio",
                    title: "Monte a rota de hoje no quadro semanal.",
                    detail: "Com horários e matérias preenchidos, o Pomodoro acompanha ao vivo."
                };
            }

            return {
                tone: "done",
                pill: "Fechado",
                title: "Todos os blocos do dia foram concluídos.",
                detail: "Você pode revisar o quadro ou iniciar um ciclo manual."
            };
        }

        const nowMinutes = state.nowMinutes;

        if (this.mode === "break" && this.linkedTodayBlockId === block.id) {
            return {
                tone: "break",
                pill: "Pausa",
                title: `Janela de pausa ativa por mais ${this.formatRelativeMinutes(this.remaining / 60)}.`,
                detail: `${block.title} encerrou o foco e a próxima matéria já está na fila.`
            };
        }

        if (nowMinutes < block.startMinutes) {
            return {
                tone: "upcoming",
                pill: "Próximo",
                title: `Começa em ${this.formatRelativeMinutes(block.startMinutes - nowMinutes)}.`,
                detail: `Ritmo ${block.studyMinutes}/${block.breakMinutes} pronto para iniciar.`
            };
        }

        if (nowMinutes < block.endMinutes) {
            const delayMinutes =
                Math.max(nowMinutes - block.startMinutes, 0);

            return {
                tone: "live",
                pill: "Ao vivo",
                title: delayMinutes > 0
                    ? `Sessão ao vivo com ${this.formatRelativeMinutes(delayMinutes)} de atraso ajustado.`
                    : "Sessão entrou na janela certa.",
                detail: `Restam ${this.formatRelativeMinutes(Math.max(block.endMinutes - nowMinutes, 0))} para fechar este foco.`
            };
        }

        if (nowMinutes < block.resetMinutes) {
            return {
                tone: "break",
                pill: "Pausa",
                title: `A pausa da rota ainda esta aberta por ${this.formatRelativeMinutes(block.resetMinutes - nowMinutes)}.`,
                detail: "Se voltar agora, o relogio entra na janela real do quadro."
            };
        }

        return {
            tone: "catchup",
            pill: "Rota",
            title: `${state.missedCount + 1} bloco(s) ficaram para trás.`,
            detail: "O app aponta o próximo bloco pendente para você retomar sem perder o fio."
        };
    },

    renderTodayFlow() {
        const container = document.getElementById("todayFlow");
        if (!container) return;

        const state =
            this.getTodayFlowState(new Date());

        const currentBlock = state.current;
        const status =
            this.resolveTodayStatus(currentBlock, state);

        const queue = state.queueItems.slice(0, 3);
        const completedLabel =
            `${state.completedCount}/${state.totalCount || 0}`;

        container.classList.remove("hidden");

        container.innerHTML = `
            <div class="today-flow-shell">
                <div class="today-flow-head">
                    <div class="today-flow-copy">
                        <div class="today-flow-kicker">Rota de hoje</div>
                        <h3>Pomodoro guiado pelo seu quadro</h3>
                        <p>${state.plan.dayName || "Hoje"}${state.missedCount > 0 ? ` • ${state.missedCount} em atraso` : " • ao vivo"}</p>
                    </div>
                    <div class="today-flow-progress">
                        <strong>${completedLabel}</strong>
                        <span>blocos concluídos</span>
                    </div>
                </div>
                <div class="today-flow-grid">
                    <article class="today-flow-card today-flow-current is-${status.tone}">
                        <div class="today-flow-card-top">
                            <span class="today-flow-pill is-${status.tone}">${status.pill}</span>
                            <span class="today-flow-slot">${currentBlock ? currentBlock.studyRange : "Sem bloco ativo"}</span>
                        </div>
                        <div class="today-flow-title">${currentBlock ? currentBlock.title : "Nenhuma rota pronta para hoje"}</div>
                        <div class="today-flow-meta">${currentBlock ? `${currentBlock.dayName} • ${currentBlock.studyMinutes}/${currentBlock.breakMinutes}` : "Abra o quadro e defina horários e matérias."}</div>
                        <div class="today-flow-status">${status.title}</div>
                        <div class="today-flow-detail">${status.detail}</div>
                        <div class="today-flow-actions">
                            <button id="todayFlowSyncBtn" class="today-flow-btn is-primary" type="button"${currentBlock ? "" : " disabled"}>${this.syncEnabled ? "Sincronizado" : "Sincronizar com tabela"}</button>
                            <button id="todayFlowDoneBtn" class="today-flow-btn" type="button"${currentBlock ? "" : " disabled"}>Concluir bloco</button>
                            <button id="todayFlowOpenQtsBtn" class="today-flow-btn" type="button">Abrir quadro</button>
                        </div>
                    </article>
                    <article class="today-flow-card today-flow-queue">
                        <div class="today-flow-card-top">
                            <span class="today-flow-pill is-queue">Depois</span>
                            <span class="today-flow-slot">${queue.length ? "Próximos blocos" : "Fila limpa"}</span>
                        </div>
                        <div class="today-flow-queue-list">
                            ${queue.length ? queue.map((item) => `
                                <div class="today-flow-queue-item">
                                    <div class="today-flow-queue-time">${item.studyRange}</div>
                                    <div class="today-flow-queue-copy">
                                        <strong>${item.title}</strong>
                                        <span>${item.dayName} • ${item.studyMinutes}/${item.breakMinutes}</span>
                                    </div>
                                </div>
                            `).join("") : `
                                <div class="today-flow-empty">
                                    <strong>Dia leve por aqui.</strong>
                                    <span>Quando concluir este bloco, a fila fica limpa.</span>
                                </div>
                            `}
                        </div>
                    </article>
                </div>
            </div>
        `;

        this.bindTodayFlowActions();
    },

    bindTodayFlowActions() {
        const syncBtn =
            document.getElementById("todayFlowSyncBtn");
        const doneBtn =
            document.getElementById("todayFlowDoneBtn");
        const openQtsBtn =
            document.getElementById("todayFlowOpenQtsBtn");

        if (syncBtn) {
            syncBtn.onclick = () => {
                this.syncTodayFlowToPlan();
                this.updateDisplay();
                this.renderPresets();
                this.renderTodayFlow();
            };
        }

        if (doneBtn) {
            doneBtn.onclick = () => {
                this.completeTodayFlowBlock();
            };
        }

        if (openQtsBtn) {
            openQtsBtn.onclick = () => {
                if (typeof Core !== "undefined") {
                    Core.navigate("qts");
                }
            };
        }
    },

    toggleTodaySync() {
        if (!this.syncEnabled) {
            this.todayFlowExpanded = true;
        }

        this.syncEnabled = !this.syncEnabled;
        this.saveSyncPreference();

        if (this.syncEnabled) {
            this.syncTodayFlowToPlan({ autostart: true });
            return;
        }

        this.todayFlowExpanded = false;
        this.pause();
        this.detachLinkedSchedule();
        this.applyDefaultState();
        this.updateDisplay();
        this.renderPresets();
        this.renderTodayFlow();
    },

    renderFlowSlot(label, item, tone = "idle") {
        return `
            <article class="today-flow-slot-card is-${tone}">
                <span class="today-flow-slot-label">${label}</span>
                <strong>${item?.displayTitle || item?.title || "Sem bloco"}</strong>
                <span>${item?.displayTime || item?.timeLabel || "--:--"}</span>
            </article>
        `;
    },

    resolveTodayStatus(block, state) {
        if (!block) {
            if (!state.totalCount) {
                return {
                    tone: "empty",
                    title: "Sem rota para hoje.",
                    detail: "Monte o dia no quadro para sincronizar."
                };
            }

            return {
                    tone: "done",
                title: "Rota de hoje concluída.",
                detail: "Você pode seguir no modo livre."
            };
        }

        if (this.mode === "break" && this.linkedTodayBlockId === block.id) {
            const blockLabel =
                this.getTableModeLabel(block);

            return {
                tone: "break",
                title: "Pausa do bloco atual.",
                detail: `Modo: ${blockLabel}`
            };
        }

        const activeLabel =
            this.getTableModeLabel(block);

        return {
            tone: this.syncEnabled ? "live" : "idle",
            title: this.syncEnabled
                ? "Sincronização ativa."
                : "Sincronização desligada.",
            detail: this.syncEnabled
                ? `Modo: ${activeLabel}`
                : `Modo: ${activeLabel}`
        };
    },

    renderTodayFlow() {
        const container = document.getElementById("todayFlow");
        if (!container) return;

        const state =
            this.getTodayFlowState(new Date());

        const currentBlock = state.current;
        const previousBlock =
            this.syncEnabled &&
            !currentBlock
                ? null
                : state.previousItem;
        const nextBlock =
            this.syncEnabled &&
            !currentBlock
                ? null
                : state.nextItem;
        const status =
            this.resolveTodayStatus(currentBlock, state);
        const referenceBlock =
            currentBlock ||
            nextBlock ||
            previousBlock ||
            this.getTodayBlockById(this.linkedTodayBlockId);
        const activeMode =
            this.getTableModeLabel(referenceBlock);

        const breakRange =
            currentBlock
                ? `${this.formatClockMinutes(currentBlock.endMinutes)} - ${this.formatClockMinutes(currentBlock.resetMinutes)}`
                : null;

        const isBreakLive =
            this.syncEnabled &&
            this.mode === "break" &&
            Boolean(currentBlock);

        const middleItem =
            isBreakLive
                ? {
                    displayTitle: "Intervalo",
                    displayTime: breakRange || "--:--"
                }
                : currentBlock;

        const beforeItem =
            isBreakLive
                ? currentBlock
                : previousBlock;

        const shellState =
            this.syncEnabled
                ? "is-linked"
                : "is-idle";
        const isCollapsed =
            !this.syncEnabled &&
            !this.todayFlowExpanded;

        document.body.classList.toggle(
            "pomodoro-table-sync-on",
            Boolean(
                this.syncEnabled &&
                typeof Core !== "undefined" &&
                Core.state?.mode === "pomodoro"
            )
        );

        container.classList.remove("hidden");

        container.innerHTML = `
            <div class="today-flow-shell ${shellState}${isCollapsed ? " is-collapsed" : ""}">
                <div class="today-flow-center">
                    <button id="todayFlowSyncBtn" class="today-flow-btn is-primary${this.syncEnabled ? " is-on" : ""}" type="button" aria-pressed="${this.syncEnabled ? "true" : "false"}"${referenceBlock ? "" : " disabled"}>
                        ${this.syncEnabled ? "Sincronizado" : "Sincronizar com tabela"}
                    </button>
                    ${isCollapsed ? "" : `
                        <div class="today-flow-mode-wrap">
                            <span class="today-flow-mode-label">Ritmo da tabela</span>
                            <div class="today-flow-mode">${activeMode}</div>
                        </div>
                    `}
                </div>
                ${isCollapsed ? "" : `
                    <div class="today-flow-track ${this.syncEnabled ? "is-live" : "is-muted"}">
                        ${this.renderFlowSlot("Antes", beforeItem, "previous")}
                        ${this.renderFlowSlot("Agora", middleItem, isBreakLive ? "break" : (this.syncEnabled ? "current" : "idle"))}
                        ${this.renderFlowSlot("Próxima", nextBlock, "next")}
                    </div>
                `}
            </div>
        `;

        this.bindTodayFlowActions();
    },

    bindTodayFlowActions() {
        const syncBtn =
            document.getElementById("todayFlowSyncBtn");
        const openQtsBtn =
            document.getElementById("todayFlowOpenQtsBtn");

        if (syncBtn) {
            syncBtn.onclick = () => {
                this.toggleTodaySync();
            };
        }

        if (openQtsBtn) {
            openQtsBtn.onclick = () => {
                if (typeof Core !== "undefined") {
                    Core.navigate("qts");
                }
            };
        }
    },

    updateSyncedClock() {
        if (!this.syncEnabled) return;

        const now = new Date();

        this.reconcileSyncedProgress(now);

        const state =
            this.getTodayFlowState(now);

        const currentBlock =
            state.current;

        if (!currentBlock) {
            this.running = false;
            Core.state.running = false;
            this.detachLinkedSchedule();
            this.updateDisplay();
            this.renderPresets();
            this.renderTodayFlow();
            return;
        }

        if (this.linkedTodayBlockId !== currentBlock.id) {
            this.linkedTodayBlockId = currentBlock.id;
            this.setTodayActiveBlock(currentBlock.id);
        }

        this.refreshLinkedCycleConfig();

        const nowSeconds =
            this.getNowSeconds(now);

        const startSeconds =
            currentBlock.startMinutes * 60;

        const endSeconds =
            currentBlock.endMinutes * 60;

        const resetSeconds =
            currentBlock.resetMinutes * 60;

        if (nowSeconds < startSeconds) {
            this.mode = "study";
            this.remaining =
                Math.max(startSeconds - nowSeconds, 0);
        } else if (nowSeconds < endSeconds) {
            this.mode = "study";
            this.remaining =
                Math.max(endSeconds - nowSeconds, 0);
        } else if (nowSeconds < resetSeconds) {
            this.mode = "break";
            this.remaining =
                Math.max(resetSeconds - nowSeconds, 0);
        } else {
            const nextBlock =
                this.getNextPendingTodayBlock(currentBlock.id);

            if (nextBlock) {
                this.linkedTodayBlockId = nextBlock.id;
                this.setTodayActiveBlock(nextBlock.id);
                this.updateSyncedClock();
                return;
            }

            this.running = false;
            Core.state.running = false;
            this.detachLinkedSchedule();
            this.updateDisplay();
            this.renderPresets();
            this.renderTodayFlow();
            return;
        }

        this.running = true;
        Core.state.running = true;
        this.updateDisplay();
        this.renderTodayFlow();
    },

    ensureTodayRefreshInterval() {
        if (this.todayRefreshInterval) return;

        this.todayRefreshInterval = setInterval(() => {
            if (
                typeof Core !== "undefined" &&
                Core.state?.mode === "pomodoro"
            ) {
                if (this.syncEnabled) {
                    this.updateSyncedClock();
                } else {
                    this.renderTodayFlow();
                }
            }
        }, 1000);
    },

    initAudio() {
        if (!this.audioCtx) {
            this.audioCtx =
                new (window.AudioContext || window.webkitAudioContext)();
        }
    },

    beep(frequency = 800, duration = 120) {
        this.initAudio();

        const oscillator =
            this.audioCtx.createOscillator();
        const gainNode =
            this.audioCtx.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(this.audioCtx.destination);

        oscillator.type = "sine";
        oscillator.frequency.value = frequency;

        gainNode.gain.setValueAtTime(
            0.1,
            this.audioCtx.currentTime
        );

        oscillator.start();

        setTimeout(() => {
            oscillator.stop();
        }, duration);
    },

    beepCycle() {
        this.beep(700, 100);
    },

    beepFinish() {
        this.beep(600, 150);
        setTimeout(() => this.beep(900, 150), 200);
    },

    beepMultiple(times) {
        let count = 0;

        const audio = new Audio(
            "https://actions.google.com/sounds/v1/alarms/alarm_clock.ogg"
        );

        audio.volume = 0.25;

        const loop = setInterval(() => {
            audio.currentTime = 0;
            audio.play();

            count++;

            if (count >= times) {
                clearInterval(loop);
            }
        }, 400);
    }
};

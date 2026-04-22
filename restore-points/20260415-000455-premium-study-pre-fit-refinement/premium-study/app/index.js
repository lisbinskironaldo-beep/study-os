(function () {
    if (window.PremiumStudyApp) {
        return;
    }

    function clamp(value, min, max) {
        return Math.max(min, Math.min(max, value));
    }

    window.PremiumStudyApp = {
        root: null,
        analysisTimers: [],
        fileInput: null,
        persistenceReady: false,
        activeRingControl: null,

        async init(options = {}) {
            this.root = options.root || document.getElementById("premium-studyModule");

            if (!this.root) {
                return;
            }

            this.root.classList.add("premium-study-host");
            this.bindRoot();
            await this.hydrateFromStorage();
            this.render();
        },

        bindRoot() {
            if (this.root.dataset.bound === "true") {
                return;
            }

            this.root.dataset.bound = "true";

            this.root.addEventListener("click", (event) => {
                const actionTarget = event.target.closest("[data-premium-action]");
                if (!actionTarget) {
                    return;
                }

                const action = actionTarget.dataset.premiumAction;
                const blockId = actionTarget.dataset.blockId || "";
                const tabId = actionTarget.dataset.tabId || "";
                const dateValue = actionTarget.dataset.dateValue || "";
                this.handleAction(action, { blockId, tabId, dateValue });
            });

            this.root.addEventListener("change", (event) => {
                if (event.target.id === "premiumStudyFileInput") {
                    const file = event.target.files && event.target.files[0];
                    if (file) {
                        window.PremiumStudyStore.setMaterial(file);
                        window.PremiumStudyRouter.goTo("exam-date");
                        this.render();
                        this.persistCurrentState();
                    }
                }
            });

            this.root.addEventListener("pointerdown", (event) => {
                if (event.target.closest(".premium-ring-adjust")) {
                    return;
                }

                const ring = event.target.closest("[data-ring-control]");
                if (!ring) {
                    return;
                }

                this.activeRingControl = ring.dataset.ringControl || "";
                ring.setPointerCapture(event.pointerId);
                this.updateRingFromPointer(event, ring);
            });

            this.root.addEventListener("pointermove", (event) => {
                if (!this.activeRingControl) {
                    return;
                }

                const ring = this.root.querySelector(`[data-ring-control="${this.activeRingControl}"]`);
                if (!ring) {
                    return;
                }

                this.updateRingFromPointer(event, ring);
            });

            const clearPointer = () => {
                if (this.activeRingControl) {
                    this.persistCurrentState();
                }
                this.activeRingControl = null;
            };

            this.root.addEventListener("pointerup", clearPointer);
            this.root.addEventListener("pointercancel", clearPointer);
        },

        async hydrateFromStorage() {
            if (!window.PremiumStudyStorage) {
                return;
            }

            const latestDraft = await window.PremiumStudyStorage.getLatestDraft();
            if (!latestDraft || !latestDraft.snapshot) {
                return;
            }

            const summary = window.PremiumStudyStorage.buildDraftSummary({
                ...latestDraft.snapshot,
                savedAt: latestDraft.savedAt
            });

            window.PremiumStudyStore.setLatestLocalStudy(summary);
            this.persistenceReady = true;
        },

        async persistCurrentState() {
            const state = window.PremiumStudyStore.getState();
            if (!window.PremiumStudyStorage || !state.materialName) {
                return;
            }

            const snapshot = window.PremiumStudyStore.exportSnapshot();
            const savedDraft = await window.PremiumStudyStorage.saveLatestDraft(snapshot);
            if (!savedDraft) {
                return;
            }

            const summary = window.PremiumStudyStorage.buildDraftSummary({
                ...snapshot,
                savedAt: savedDraft.savedAt
            });

            window.PremiumStudyStore.patch({
                savedDraftId: savedDraft.id,
                savedAt: savedDraft.savedAt
            });
            window.PremiumStudyStore.setLatestLocalStudy(summary);
            this.persistenceReady = true;
        },

        clearAnalysisTimers() {
            this.analysisTimers.forEach((timerId) => window.clearTimeout(timerId));
            this.analysisTimers = [];
        },

        startAnalysisSequence() {
            this.clearAnalysisTimers();
            window.PremiumStudyStore.setAnalysisProgress(10, "running");

            [28, 52, 78, 100].forEach((value, index) => {
                const timerId = window.setTimeout(() => {
                    const status = value >= 100 ? "done" : "running";
                    window.PremiumStudyStore.setAnalysisProgress(value, status);
                    this.render();

                    if (value >= 100) {
                        const finishId = window.setTimeout(() => {
                            window.PremiumStudyRouter.goTo("mode-select");
                            window.PremiumStudyStore.patch({
                                progressLabel: "Sua trilha inicial esta pronta para voce escolher como quer entrar no conteudo."
                            });
                            this.render();
                            this.persistCurrentState();
                        }, 520);
                        this.analysisTimers.push(finishId);
                    }
                }, 520 + (index * 420));

                this.analysisTimers.push(timerId);
            });
        },

        updateRingFromPointer(event, ring) {
            const control = ring.dataset.ringControl || "";
            const rect = ring.getBoundingClientRect();
            const centerX = rect.left + (rect.width / 2);
            const centerY = rect.top + (rect.height / 2);
            const dx = event.clientX - centerX;
            const dy = event.clientY - centerY;
            let angle = Math.atan2(dy, dx) * (180 / Math.PI) + 90;
            if (angle < 0) {
                angle += 360;
            }

            const normalized = angle / 360;
            const store = window.PremiumStudyStore;

            if (control === "target-score") {
                store.setTargetScore(Math.max(0, Math.min(10, normalized * 10)));
            }

            if (control === "study-hours") {
                store.setStudyHours(Math.round(normalized * 12));
            }

            if (control === "study-minutes") {
                store.setStudyMinutes(Math.round((normalized * 60) / 5) * 5);
            }

            this.render();
        },

        async handleAction(action, payload = {}) {
            const router = window.PremiumStudyRouter;
            const store = window.PremiumStudyStore;
            let shouldPersist = false;

            switch (action) {
            case "close":
                this.clearAnalysisTimers();
                if (store.getState().step !== "entry") {
                    router.goTo("entry");
                    this.render();
                    await this.persistCurrentState();
                    return;
                }
                if (window.Core && typeof window.Core.goHome === "function") {
                    window.Core.goHome();
                }
                return;
            case "back":
                this.clearAnalysisTimers();
                router.previous(store.getState().step);
                break;
            case "open-file-picker":
                this.fileInput = this.root.querySelector("#premiumStudyFileInput");
                if (this.fileInput) {
                    this.fileInput.click();
                }
                return;
            case "resume-latest-study": {
                const latestDraft = await window.PremiumStudyStorage.getLatestDraft();
                if (latestDraft && latestDraft.snapshot) {
                    store.restoreFromSnapshot({
                        ...latestDraft.snapshot,
                        savedAt: latestDraft.savedAt
                    });
                }
                break;
            }
            case "pick-date":
                store.setExamDate(payload.dateValue);
                shouldPersist = true;
                break;
            case "calendar-prev":
                store.shiftCalendarMonth(-1);
                break;
            case "calendar-next":
                store.shiftCalendarMonth(1);
                break;
            case "continue-to-target":
                router.goTo("target-score");
                shouldPersist = true;
                break;
            case "target-score-decrease":
                store.setTargetScore(clamp(Number(store.getState().targetScore) - 0.5, 0, 10));
                shouldPersist = true;
                break;
            case "target-score-increase":
                store.setTargetScore(clamp(Number(store.getState().targetScore) + 0.5, 0, 10));
                shouldPersist = true;
                break;
            case "continue-to-time":
                router.goTo("study-time");
                shouldPersist = true;
                break;
            case "study-hours-decrease":
                store.setStudyHours(clamp(Number(store.getState().studyHours) - 1, 0, 12));
                shouldPersist = true;
                break;
            case "study-hours-increase":
                store.setStudyHours(clamp(Number(store.getState().studyHours) + 1, 0, 12));
                shouldPersist = true;
                break;
            case "study-minutes-decrease":
                store.setStudyMinutes(clamp(Number(store.getState().studyMinutes) - 5, 0, 55));
                shouldPersist = true;
                break;
            case "study-minutes-increase":
                store.setStudyMinutes(clamp(Number(store.getState().studyMinutes) + 5, 0, 55));
                shouldPersist = true;
                break;
            case "continue-to-analysis":
                store.setAnalysisProgress(10, "pending");
                router.goTo("analysis");
                shouldPersist = true;
                break;
            case "choose-mode-learn":
                store.setBlockTab("aprender");
                router.goTo("block");
                shouldPersist = true;
                break;
            case "choose-mode-practice":
                store.setBlockTab("praticar");
                router.goTo("block");
                shouldPersist = true;
                break;
            case "choose-mode-exam":
                store.setBlockTab("prova");
                router.goTo("block");
                shouldPersist = true;
                break;
            case "set-tab":
                store.setBlockTab(payload.tabId);
                shouldPersist = true;
                break;
            case "back-to-mode-select":
                router.goTo("mode-select");
                shouldPersist = true;
                break;
            case "next-block": {
                const blocks = store.getState().blocks;
                const activeIndex = blocks.findIndex((block) => block.id === store.getState().activeBlockId);
                const nextBlock = blocks[(activeIndex + 1) % blocks.length];
                store.selectBlock(nextBlock.id);
                shouldPersist = true;
                break;
            }
            case "ai-explain-better":
                store.patch({
                    progressLabel: "Explicacao mais didatica reservada para a etapa de IA contextual."
                });
                shouldPersist = true;
                break;
            case "ai-quick-review":
                store.patch({
                    progressLabel: "Revisao rapida marcada como foco principal deste bloco."
                });
                shouldPersist = true;
                break;
            case "ai-create-questions":
                store.patch({
                    progressLabel: "Criacao de questoes preparada para a proxima fase do motor de conteudo."
                });
                shouldPersist = true;
                break;
            default:
                break;
            }

            this.render();

            if (shouldPersist) {
                await this.persistCurrentState();
            }
        },

        afterRender(step) {
            if (
                step === "analysis" &&
                window.PremiumStudyStore.getState().analysisStatus === "pending"
            ) {
                this.startAnalysisSequence();
                return;
            }

            if (step !== "analysis") {
                this.clearAnalysisTimers();
            }
        },

        render() {
            if (!this.root) {
                return;
            }

            const state = window.PremiumStudyStore.getState();
            const step = state.step;
            const meta = window.PremiumStudyRouter.getMeta(step);
            const summary = meta.showSummary
                ? window.PremiumStudyUI.summaryPanel(state)
                : "";

            this.root.innerHTML = window.PremiumStudyUI.shell({
                step,
                meta,
                content: window.PremiumStudyViews.render(step, state),
                summary,
                showBack: window.PremiumStudyRouter.canGoBack(step)
            });

            document.body.setAttribute("data-premium-step", step);
            this.afterRender(step);
        }
    };
})();

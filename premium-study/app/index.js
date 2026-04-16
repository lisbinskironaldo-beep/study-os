(function () {
    if (window.PremiumStudyApp) {
        return;
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

            document.addEventListener("fullscreenchange", () => {
                if (!this.root) {
                    return;
                }

                const store = window.PremiumStudyStore;
                const state = store.getState();
                const isActive = this.isNativeFullScreenActive();

                if (state.step === "block" && state.blockFullScreen && !isActive) {
                    store.setBlockFullScreen(false);
                    this.render();
                }
            });

            this.root.addEventListener("click", (event) => {
                const actionTarget = event.target.closest("[data-premium-action]");
                if (!actionTarget) {
                    return;
                }

                const action = actionTarget.dataset.premiumAction;
                const blockId = actionTarget.dataset.blockId || "";
                const tabId = actionTarget.dataset.tabId || "";
                const dateValue = actionTarget.dataset.dateValue || "";
                const answerIndex = actionTarget.dataset.answerIndex || "";
                const itemIndex = actionTarget.dataset.itemIndex || "";
                const itemValue = actionTarget.dataset.itemValue || "";
                const practiceType = actionTarget.dataset.practiceType || "";
                const slotIndex = actionTarget.dataset.slotIndex || "";
                this.handleAction(action, { blockId, tabId, dateValue, answerIndex, itemIndex, itemValue, practiceType, slotIndex });
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

        isNativeFullScreenActive() {
            return document.fullscreenElement === this.root;
        },

        async enterNativeFullScreen() {
            if (!this.root || this.isNativeFullScreenActive() || typeof this.root.requestFullscreen !== "function") {
                return;
            }

            try {
                await this.root.requestFullscreen();
            } catch (error) {
                // Mantemos o fallback visual se o navegador bloquear.
            }
        },

        async exitNativeFullScreen() {
            if (!this.isNativeFullScreenActive() || typeof document.exitFullscreen !== "function") {
                return;
            }

            try {
                await document.exitFullscreen();
            } catch (error) {
                // Se falhar, o usuario ainda pode sair com ESC ou pelo navegador.
            }
        },

        async syncNativeFullScreen(preferEnter = false) {
            const state = window.PremiumStudyStore.getState();
            const shouldBeNativeFullScreen =
                state.step === "block" &&
                state.blockFullScreen;

            if (!shouldBeNativeFullScreen) {
                await this.exitNativeFullScreen();
                return;
            }

            if (preferEnter) {
                await this.enterNativeFullScreen();
            }
        },

        async hydrateFromStorage() {
            if (!window.PremiumStudyStorage) {
                return;
            }

            const studyLibrary = await window.PremiumStudyStorage.getStudyLibrary();
            if (studyLibrary && studyLibrary.length) {
                window.PremiumStudyStore.setStudyLibrary(studyLibrary);
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
            const studyLibrary = await window.PremiumStudyStorage.saveStudyLibraryRecord({
                ...window.PremiumStudyStore.exportSnapshot(),
                savedAt: savedDraft.savedAt
            });
            if (studyLibrary && studyLibrary.length) {
                window.PremiumStudyStore.setStudyLibrary(studyLibrary);
            }
            this.persistenceReady = true;
        },

        openPrintWindow(title, bodyContent) {
            const win = window.open("", "_blank", "width=960,height=760");
            if (!win) {
                return;
            }

            win.document.write(`<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="utf-8" />
<title>${window.PremiumStudyUI.escapeHtml(title)}</title>
<style>
body{font-family:Arial,sans-serif;margin:32px;color:#1f2937;line-height:1.6}
h1{font-size:28px;margin:0 0 8px}
h2{font-size:18px;margin:28px 0 10px}
p{margin:0 0 14px}
mark{background:#ffe38a;padding:0 0.18em;border-radius:0.2em}
ul{margin:0;padding-left:22px}
li{margin:0 0 10px}
.meta{margin-bottom:24px;color:#475569}
.section{padding-top:18px;border-top:1px solid #dbe3f4;margin-top:18px}
</style>
</head>
<body>${bodyContent}</body>
</html>`);
            win.document.close();
            win.focus();
            win.print();
        },

        downloadHighlightedPdf(kind) {
            const state = window.PremiumStudyStore.getState();
            const documentData = state.highlightedDocument;

            if (!documentData) {
                return;
            }

            if (kind === "summary") {
                const summary = documentData.extractedSummary || {};
                const bullets = Array.isArray(summary.bullets)
                    ? summary.bullets.map((item) => `<li>${window.PremiumStudyUI.escapeHtml(item)}</li>`).join("")
                    : "";
                this.openPrintWindow(
                    `${summary.title || "Resumo destacado"} - PDF`,
                    `
<h1>${window.PremiumStudyUI.escapeHtml(summary.title || "Resumo destacado")}</h1>
<p class="meta">${window.PremiumStudyUI.escapeHtml(summary.sourceTitle || state.studyTitle || state.materialName || "Documento")}</p>
<p>${window.PremiumStudyUI.escapeHtml(summary.lead || "")}</p>
<div class="section">
    <h2>${window.PremiumStudyUI.escapeHtml(summary.blockTitle || "Pontos principais")}</h2>
    <ul>${bullets}</ul>
</div>`
                );
                return;
            }

            const sections = (documentData.sections || []).map((section) => `
<div class="section">
    <h2>${window.PremiumStudyUI.escapeHtml(section.title)}</h2>
    ${(section.paragraphs || []).map((paragraph) => `
        <p>${paragraph.map((part) => part.highlight
        ? `<mark>${window.PremiumStudyUI.escapeHtml(part.text)}</mark>`
        : window.PremiumStudyUI.escapeHtml(part.text)).join("")}</p>
    `).join("")}
</div>`).join("");

            this.openPrintWindow(
                `${documentData.title} - PDF`,
                `
<h1>${window.PremiumStudyUI.escapeHtml(documentData.title)}</h1>
<p class="meta">${window.PremiumStudyUI.escapeHtml(documentData.subtitle || "")}</p>
${sections}`
            );
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

        getResumeStep(snapshot = {}) {
            if (!snapshot.materialName) {
                return "entry";
            }

            if (
                !snapshot.step ||
                snapshot.step === "entry" ||
                snapshot.step === "analysis" ||
                snapshot.step === "premium-library"
            ) {
                return "mode-select";
            }

            return snapshot.step;
        },

        async resumeSnapshot(snapshot = {}) {
            const store = window.PremiumStudyStore;
            const router = window.PremiumStudyRouter;
            const nextStep = this.getResumeStep(snapshot);

            store.restoreFromSnapshot({
                ...snapshot,
                step: nextStep,
                sessionNote: null
            });

            if (!store.getState().materialName) {
                router.goTo("entry");
                return {
                    shouldSyncNativeFullScreen: false,
                    preferEnterNativeFullScreen: false
                };
            }

            router.goTo(nextStep);

            return {
                shouldSyncNativeFullScreen: true,
                preferEnterNativeFullScreen:
                    nextStep === "block" &&
                    store.getState().blockFullScreen
            };
        },

        async handleAction(action, payload = {}) {
            const router = window.PremiumStudyRouter;
            const store = window.PremiumStudyStore;
            let shouldPersist = false;
            let shouldSyncNativeFullScreen = false;
            let preferEnterNativeFullScreen = false;
            const premiumLibraryEnabled =
                store.getState().accessTier === "premium";

            if (
                action !== "request-extra-quiz" &&
                action !== "request-extra-true-false" &&
                action !== "request-extra-flashcards" &&
                action !== "request-extra-mini-exam"
            ) {
                store.clearSessionNote();
            }

            switch (action) {
            case "close":
                this.clearAnalysisTimers();
                if (
                    store.getState().materialName &&
                    store.getState().step !== "entry" &&
                    store.getState().step !== "mode-select" &&
                    store.getState().step !== "exam-date" &&
                    store.getState().step !== "target-score" &&
                    store.getState().step !== "study-time" &&
                    store.getState().step !== "analysis"
                ) {
                    router.goTo("mode-select");
                    this.render();
                    await this.syncNativeFullScreen();
                    await this.persistCurrentState();
                    return;
                }
                if (store.getState().step !== "entry") {
                    router.goTo("entry");
                    this.render();
                    await this.syncNativeFullScreen();
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
                shouldSyncNativeFullScreen = true;
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
                        savedAt: latestDraft.savedAt,
                        step: "mode-select",
                        sessionNote: null
                    });
                    if (store.getState().materialName) {
                        router.goTo("mode-select");
                        shouldSyncNativeFullScreen = true;
                        preferEnterNativeFullScreen = false;
                    }
                    shouldPersist = true;
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
            case "continue-to-time":
                router.goTo("study-time");
                shouldPersist = true;
                break;
            case "continue-to-analysis":
                store.setAnalysisProgress(10, "pending");
                router.goTo("analysis");
                shouldPersist = true;
                break;
            case "choose-mode-learn":
                store.setBlockTab("aprender");
                store.markActiveBlockProgress({ learn: true });
                router.goTo("learn-map");
                shouldPersist = true;
                break;
            case "choose-mode-highlight":
                store.openHighlightDocument();
                router.goTo("highlight-preview");
                shouldPersist = true;
                break;
            case "choose-mode-practice":
                store.setReturnStep("mode-select");
                store.markActiveBlockProgress({ practice: true });
                router.goTo("practice");
                shouldPersist = true;
                shouldSyncNativeFullScreen = true;
                break;
            case "choose-mode-exam":
                store.setReturnStep("mode-select");
                store.resetActiveSession("miniExam");
                router.goTo("mini-exam");
                shouldPersist = true;
                shouldSyncNativeFullScreen = true;
                break;
            case "open-premium-library":
                if (!premiumLibraryEnabled) {
                    break;
                }
                router.goTo("premium-library");
                shouldPersist = true;
                shouldSyncNativeFullScreen = true;
                break;
            case "open-library-item":
                if (!premiumLibraryEnabled) {
                    break;
                }
                store.setActiveLibraryItem(payload.blockId);
                shouldPersist = true;
                break;
            case "resume-library-item": {
                if (!premiumLibraryEnabled) {
                    break;
                }
                const activeItem = store.getActiveLibraryItem();
                if (activeItem && activeItem.snapshot) {
                    const resumeState = await this.resumeSnapshot({
                        ...activeItem.snapshot,
                        savedAt: activeItem.savedAt || activeItem.snapshot.savedAt
                    });
                    shouldSyncNativeFullScreen = resumeState.shouldSyncNativeFullScreen;
                    preferEnterNativeFullScreen = resumeState.preferEnterNativeFullScreen;
                }
                shouldPersist = true;
                break;
            }
            case "download-highlight-summary":
                if (!premiumLibraryEnabled) {
                    break;
                }
                this.downloadHighlightedPdf("summary");
                shouldPersist = true;
                break;
            case "download-highlighted-full":
                if (!premiumLibraryEnabled) {
                    break;
                }
                this.downloadHighlightedPdf("full");
                shouldPersist = true;
                break;
            case "set-tab":
                store.setBlockTab(payload.tabId);
                shouldPersist = true;
                break;
            case "back-to-mode-select":
                router.goTo("mode-select");
                shouldPersist = true;
                shouldSyncNativeFullScreen = true;
                break;
            case "open-practice":
                store.setReturnStep("block");
                store.markActiveBlockProgress({ practice: true });
                router.goTo("practice");
                shouldPersist = true;
                shouldSyncNativeFullScreen = true;
                break;
            case "open-block":
                store.selectBlock(payload.blockId);
                store.setBlockTab("aprender");
                store.setBlockFullScreen(true);
                store.setBlockAssistMode("");
                store.markActiveBlockProgress({ learn: true });
                router.goTo("block");
                shouldPersist = true;
                shouldSyncNativeFullScreen = true;
                preferEnterNativeFullScreen = true;
                break;
            case "highlight-block":
                store.selectBlock(payload.blockId);
                store.openHighlightDocument(payload.blockId);
                router.goTo("highlight-preview");
                shouldPersist = true;
                break;
            case "open-next-block": {
                const nextBlockId = store.getNextBlockId();
                if (nextBlockId) {
                    store.selectBlock(nextBlockId);
                    store.setBlockFullScreen(true);
                    store.setBlockAssistMode("");
                    router.goTo("block");
                    shouldPersist = true;
                    shouldSyncNativeFullScreen = true;
                    preferEnterNativeFullScreen = true;
                }
                break;
            }
            case "open-mini-exam":
                store.setReturnStep("block");
                router.goTo("mini-exam");
                shouldPersist = true;
                shouldSyncNativeFullScreen = true;
                break;
            case "generate-mini-exam":
                store.startMiniExam();
                shouldPersist = true;
                break;
            case "retry-mini-exam":
                store.resetActiveSession("miniExam");
                store.startMiniExam();
                shouldPersist = true;
                break;
            case "open-trail":
                router.goTo("trail");
                shouldPersist = true;
                break;
            case "open-quiz":
                router.goTo("quiz");
                shouldPersist = true;
                break;
            case "open-practice-slot":
                store.focusPracticeItem(payload.practiceType, Number(payload.slotIndex));
                if (payload.practiceType === "quiz") {
                    router.goTo("quiz");
                } else if (payload.practiceType === "trueFalse") {
                    router.goTo("true-false");
                } else if (payload.practiceType === "flashcards") {
                    router.goTo("flashcards");
                }
                shouldPersist = true;
                break;
            case "answer-quiz":
                store.setQuizAnswer(Number(payload.answerIndex));
                shouldPersist = true;
                break;
            case "continue-quiz":
                store.advanceQuiz();
                shouldPersist = true;
                break;
            case "finish-quiz":
                store.advanceQuiz();
                shouldPersist = true;
                break;
            case "open-true-false":
                router.goTo("true-false");
                shouldPersist = true;
                break;
            case "answer-true-false":
                store.setTrueFalseAnswer(Number(payload.itemIndex), payload.itemValue === "true");
                shouldPersist = true;
                break;
            case "submit-true-false":
                store.submitTrueFalse();
                shouldPersist = true;
                break;
            case "reset-true-false":
                store.resetActiveSession("trueFalse");
                shouldPersist = true;
                break;
            case "open-flashcards":
                router.goTo("flashcards");
                shouldPersist = true;
                break;
            case "request-extra-quiz":
            case "request-extra-true-false":
            case "request-extra-flashcards":
            case "request-extra-mini-exam":
                store.setSessionNote({
                    step: store.getState().step,
                    tone: "premium",
                    title: "Extras liberados no premium",
                    message: "O pacote base continua gratis. No premium, voce libera novas questoes, novos flashcards e reformulacoes por outra otica."
                });
                shouldPersist = true;
                break;
            case "flip-flashcard":
                store.flipFlashcard();
                shouldPersist = true;
                break;
            case "mark-flashcard-review":
                store.markFlashcard(false);
                shouldPersist = true;
                break;
            case "mark-flashcard-known":
                store.markFlashcard(true);
                shouldPersist = true;
                break;
            case "answer-mini-exam":
                store.setMiniExamAnswer(Number(payload.answerIndex));
                shouldPersist = true;
                break;
            case "continue-mini-exam":
                store.advanceMiniExam();
                shouldPersist = true;
                break;
            case "finish-mini-exam":
                store.advanceMiniExam();
                store.markActiveBlockProgress({ exam: true });
                router.goTo("exam-result");
                shouldPersist = true;
                break;
            case "return-to-block":
                store.setBlockFullScreen(true);
                router.goTo("block");
                shouldPersist = true;
                shouldSyncNativeFullScreen = true;
                preferEnterNativeFullScreen = true;
                break;
            case "collapse-block-reader":
                store.setBlockFullScreen(false);
                shouldPersist = true;
                shouldSyncNativeFullScreen = true;
                break;
            case "expand-block-reader":
                store.setBlockFullScreen(true);
                shouldPersist = true;
                shouldSyncNativeFullScreen = true;
                preferEnterNativeFullScreen = true;
                break;
            case "select-block":
                store.selectBlock(payload.blockId);
                shouldPersist = true;
                break;
            case "rename-study": {
                const currentTitle = store.getState().studyTitle || store.getState().materialName || "Estudo personalizado";
                const nextTitle = window.prompt("Como voce quer chamar este estudo?", currentTitle);
                if (nextTitle && nextTitle.trim()) {
                    store.setStudyTitle(nextTitle);
                    shouldPersist = true;
                }
                break;
            }
            case "next-block": {
                const blocks = store.getState().blocks;
                const activeIndex = blocks.findIndex((block) => block.id === store.getState().activeBlockId);
                const nextBlock = blocks[(activeIndex + 1) % blocks.length];
                store.selectBlock(nextBlock.id);
                shouldPersist = true;
                break;
            }
            case "ai-explain-better":
                store.setBlockAssistMode("explain");
                store.patch({
                    progressLabel: "Leitura complementar aberta para explicar este assunto com mais didatica."
                });
                shouldPersist = true;
                break;
            case "ai-quick-review":
                store.setBlockAssistMode("review");
                store.patch({
                    progressLabel: "Revisao em 5 pontos aberta para fixar este assunto com rapidez."
                });
                shouldPersist = true;
                break;
            case "ai-create-questions":
                store.setSessionNote({
                    step: store.getState().step,
                    tone: "info",
                    title: "Criacao extra ainda nao entrou nesta fase",
                    message: "Nesta etapa, o foco continua no pacote base do assunto. A geracao dinamica extra entra junto da operacao premium."
                });
                shouldPersist = true;
                break;
            default:
                break;
            }

            this.render();

            if (shouldSyncNativeFullScreen) {
                await this.syncNativeFullScreen(preferEnterNativeFullScreen);
            }

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

            if (step !== "block" || !window.PremiumStudyStore.getState().blockFullScreen) {
                this.exitNativeFullScreen();
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
                ? window.PremiumStudyUI.summaryPanel(state, step === "mode-select" ? "compact" : "default")
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

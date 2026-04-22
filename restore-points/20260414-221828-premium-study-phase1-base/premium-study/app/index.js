(function () {
    if (window.PremiumStudyApp) {
        return;
    }

    window.PremiumStudyApp = {
        root: null,
        analysisTimers: [],
        fileInput: null,

        init(options = {}) {
            this.root = options.root || document.getElementById("premium-studyModule");

            if (!this.root) {
                return;
            }

            this.root.classList.add("premium-study-host");
            this.bindRoot();
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
                const topicId = actionTarget.dataset.topicId || "";
                this.handleAction(action, { blockId, tabId, topicId });
            });

            this.root.addEventListener("input", (event) => {
                const topicInputId = event.target.dataset.premiumTopicInput;
                if (topicInputId) {
                    window.PremiumStudyStore.updateTopic(topicInputId, event.target.value);
                    return;
                }

                if (event.target.dataset.premiumField === "exam-date") {
                    window.PremiumStudyStore.setExamDate(event.target.value);
                }
            });

            this.root.addEventListener("change", (event) => {
                if (event.target.id === "premiumStudyFileInput") {
                    const file = event.target.files && event.target.files[0];
                    if (file) {
                        window.PremiumStudyStore.setMaterial(file);
                        this.render();
                    }
                }
            });
        },

        clearAnalysisTimers() {
            this.analysisTimers.forEach((timerId) => window.clearTimeout(timerId));
            this.analysisTimers = [];
        },

        startAnalysisSequence() {
            this.clearAnalysisTimers();
            window.PremiumStudyStore.setAnalysisProgress(12, "running");

            [32, 56, 78, 100].forEach((value, index) => {
                const timerId = window.setTimeout(() => {
                    const status = value >= 100 ? "done" : "running";
                    window.PremiumStudyStore.setAnalysisProgress(value, status);
                    this.render();

                    if (value >= 100) {
                        const finishId = window.setTimeout(() => {
                            window.PremiumStudyRouter.goTo("topics");
                            this.render();
                        }, 520);
                        this.analysisTimers.push(finishId);
                    }
                }, 500 + (index * 420));

                this.analysisTimers.push(timerId);
            });
        },

        handleAction(action, payload = {}) {
            const router = window.PremiumStudyRouter;
            const store = window.PremiumStudyStore;

            switch (action) {
            case "close":
                this.clearAnalysisTimers();
                if (window.Core && typeof window.Core.goHome === "function") {
                    window.Core.goHome();
                }
                return;
            case "back":
                this.clearAnalysisTimers();
                router.previous(store.getState().step);
                break;
            case "start-plan":
                router.goTo("new-plan");
                break;
            case "show-example":
                store.useExampleMaterial();
                store.togglePlansPanel(false);
                router.goTo("plan");
                break;
            case "toggle-plans":
                store.togglePlansPanel();
                break;
            case "open-file-picker":
                this.fileInput = this.root.querySelector("#premiumStudyFileInput");
                if (this.fileInput) {
                    this.fileInput.click();
                }
                return;
            case "use-example":
                store.useExampleMaterial();
                break;
            case "continue-to-setup":
                router.goTo("exam-setup");
                break;
            case "countdown-7":
                store.setCountdown("7");
                break;
            case "countdown-14":
                store.setCountdown("14");
                break;
            case "countdown-30":
                store.setCountdown("30");
                break;
            case "objective-reta-final":
                store.setObjective("reta-final");
                break;
            case "objective-equilibrado":
                store.setObjective("equilibrado");
                break;
            case "objective-aprofundado":
                store.setObjective("aprofundado");
                break;
            case "continue-to-analysis":
                store.setAnalysisProgress(12, "pending");
                router.goTo("analysis");
                break;
            case "cancel-analysis":
                this.clearAnalysisTimers();
                store.setAnalysisProgress(12, "pending");
                router.goTo("exam-setup");
                break;
            case "add-topic":
                store.addTopic();
                break;
            case "remove-topic":
                store.removeTopic(payload.topicId);
                break;
            case "continue-to-plan":
                router.goTo("plan");
                break;
            case "start-recommended":
                store.selectBlock(store.getState().blocks[0].id);
                router.goTo("block");
                break;
            case "save-plan":
                store.patch({
                    sessionNote: "Estrutura salva visualmente. Persistencia real entra nas proximas fases.",
                    progressLabel: "Plano salvo como rascunho premium."
                });
                break;
            case "regenerate-plan":
                store.regenerateBlocks();
                break;
            case "open-block":
                store.selectBlock(payload.blockId);
                router.goTo("block");
                break;
            case "set-tab":
                store.setBlockTab(payload.tabId);
                break;
            case "back-to-plan":
                router.goTo("plan");
                break;
            case "next-block": {
                const blocks = store.getState().blocks;
                const activeIndex = blocks.findIndex((block) => block.id === store.getState().activeBlockId);
                const nextBlock = blocks[(activeIndex + 1) % blocks.length];
                store.selectBlock(nextBlock.id);
                store.setBlockTab("aprender");
                break;
            }
            case "ai-explain-better":
                store.patch({
                    progressLabel: "Acao preparada: explicacao mais didatica deste bloco sera ligada na fase de IA.",
                    sessionNote: "Botao mantido de forma enxuta para evitar redundancia e custo excessivo."
                });
                break;
            case "ai-quick-review":
                store.patch({
                    progressLabel: "Revisao rapida marcada como modo principal deste bloco.",
                    sessionNote: "Foco em reta final com pontos quentes, definicoes e linguagem de prova."
                });
                break;
            case "ai-create-questions":
                store.patch({
                    progressLabel: "Criacao de questoes reservada neste bloco para a proxima fase.",
                    sessionNote: "A interface ja deixou o lugar certo pronto para a IA operar sem chat livre."
                });
                break;
            default:
                break;
            }

            this.render();
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

            this.root.innerHTML = window.PremiumStudyUI.shell({
                step,
                meta,
                content: window.PremiumStudyViews.render(step, state),
                summary: window.PremiumStudyUI.summaryPanel(state),
                showBack: window.PremiumStudyRouter.canGoBack(step)
            });

            document.body.setAttribute("data-premium-step", step);
            this.afterRender(step);
        }
    };
})();

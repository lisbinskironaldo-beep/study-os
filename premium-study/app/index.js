(function () {
    if (window.PremiumStudyApp) {
        return;
    }

    const CHECKOUT_CONTEXT_KEY = "rotanota-premium-checkout-context";
    const LOCAL_BUNDLE_VERSION = "local-fallback-v5";
    const LEGACY_AI_PROMPT_VERSIONS = new Set([
        "papiro-tools-pdf-focused-ai-v3",
        "papiro-tools-pdf-focused-ai-v4",
        "papiro-tools-pdf-focused-ai-v5",
        "rotanota-pdf-focused-ai-v3",
        "rotanota-pdf-focused-ai-v4",
        "rotanota-pdf-focused-ai-v5"
    ]);

    function isSuspiciousGeneratedTitle(value = "") {
        const candidate = String(value || "")
            .replace(/\s+/g, " ")
            .trim();

        if (!candidate) {
            return true;
        }

        const wordCount = candidate.split(/\s+/).filter(Boolean).length;
        return Boolean(
            candidate.length > 92 ||
            wordCount > 14 ||
            /[;|]/.test(candidate) ||
            /^[A-Za-z]:\\/.test(candidate) ||
            /^https?:\/\//i.test(candidate) ||
            /^(fonte:|timestamp:|## my request|# context from my ide setup|chat recuperado|open tabs|my request for codex|files mentioned by the user)/i.test(candidate) ||
            /^(\d+\.\s*)?(usu[aá]rio|assistente|resumo compactado)\b/i.test(candidate) ||
            /(codex|request for codex|restore point|rollout-\d{4}|workspace sujo|git status)/i.test(candidate)
        );
    }

    function getTodayIsoDate() {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return [
            today.getFullYear(),
            String(today.getMonth() + 1).padStart(2, "0"),
            String(today.getDate()).padStart(2, "0")
        ].join("-");
    }

    window.PremiumStudyApp = {
        root: null,
        analysisTimers: [],
        analysisProgressTimer: null,
        modePreparationTimer: null,
        shellActivityTimer: null,
        pendingScrollSelector: "",
        fileInput: null,
        persistenceReady: false,
        activeRingControl: null,
        persistTimer: null,
        persistPromise: null,
        premiumStatusTimers: [],
        initialLoadPromise: null,
        lastKnownPremiumActive: false,
        activeMaterialFile: null,
        activeMaterialAssetId: "",
        lastPdfTextFallbackResult: null,
        materialPreparationPromise: null,
        materialPreparationKey: "",
        materialPreparationResult: null,
        pdfBridge: null,
        pdfObjectUrl: "",
        pdfLoadedAssetId: "",
        pdfWorkbenchPersistTimer: null,
        pdfWorkbenchPersistPromise: null,
        librarySyncPromise: null,
        lastLibrarySyncUserId: "",

        getGrowthService() {
            return window.PremiumStudyGrowth || null;
        },

        trackGrowth(eventType, data = {}, options = {}) {
            const growth = this.getGrowthService();
            if (!growth || typeof growth.track !== "function") {
                return Promise.resolve(null);
            }

            const store = window.PremiumStudyStore;
            const state = store && typeof store.getState === "function"
                ? store.getState()
                : {};
            const metadata = data.metadata && typeof data.metadata === "object"
                ? data.metadata
                : {};

            return growth.track(eventType, {
                customerId: data.customerId || state.customerId || "",
                materialHash: data.materialHash || state.materialHash || "",
                metadata: {
                    step: data.step || state.step || "",
                    feature: data.feature || "",
                    surface: data.surface || "",
                    sourceStep: data.sourceStep || "",
                    planId: data.planId || "",
                    reason: data.reason || "",
                    pageCount: Number.isFinite(data.pageCount) ? data.pageCount : (state.materialPageCount || 0),
                    ...metadata
                }
            }, options);
        },

        trackGrowthOnce(key, eventType, data = {}, options = {}) {
            const growth = this.getGrowthService();
            if (!growth || typeof growth.trackOnce !== "function") {
                return Promise.resolve(null);
            }

            const store = window.PremiumStudyStore;
            const state = store && typeof store.getState === "function"
                ? store.getState()
                : {};
            const metadata = data.metadata && typeof data.metadata === "object"
                ? data.metadata
                : {};

            return growth.trackOnce(key, eventType, {
                customerId: data.customerId || state.customerId || "",
                materialHash: data.materialHash || state.materialHash || "",
                metadata: {
                    step: data.step || state.step || "",
                    feature: data.feature || "",
                    surface: data.surface || "",
                    sourceStep: data.sourceStep || "",
                    planId: data.planId || "",
                    reason: data.reason || "",
                    pageCount: Number.isFinite(data.pageCount) ? data.pageCount : (state.materialPageCount || 0),
                    ...metadata
                }
            }, options);
        },

        async runShellActivity(options = {}, task) {
            const store = window.PremiumStudyStore;
            const current = store.getState().shellActivity;

            if (current && current.active) {
                return task();
            }

            const activity = {
                active: true,
                kicker: options.kicker || "Carregando",
                title: options.title || "Organizando sua trilha",
                message: options.message || "Aguarde um instante enquanto o sistema conclui esta etapa.",
                labels: Array.isArray(options.labels) ? options.labels : [],
                progress: Number.isFinite(Number(options.progress)) ? Number(options.progress) : null,
                startedAt: new Date().toISOString()
            };

            store.setShellActivity(activity);
            this.startActivityProgress("shellActivity");
            this.render();

            try {
                return await task(activity);
            } finally {
                this.stopActivityProgress("shellActivity");
                if (store.getState().shellActivity && store.getState().shellActivity.active) {
                    store.clearShellActivity();
                }
                this.render();
            }
        },

        async init(options = {}) {
            this.root = options.root || document.getElementById("premium-studyModule");

            if (!this.root) {
                return;
            }

            this.root.classList.add("premium-study-host");
            this.root.dataset.ready = "true";
            this.bindRoot();
            if (window.PremiumStudyGrowth && typeof window.PremiumStudyGrowth.captureAcquisitionContext === "function") {
                window.PremiumStudyGrowth.captureAcquisitionContext();
            }
            this.render();

            if (!this.initialLoadPromise) {
                this.initialLoadPromise = this.finishInitialLoad();
            }
        },

        async finishInitialLoad() {
            try {
                await this.runShellActivity({
                    kicker: "Carregando sua trilha",
                    title: "Reconectando estudo, biblioteca e premium",
                    message: "Estamos recuperando o último estado, validando sua conta e buscando os estudos salvos antes de liberar a interface.",
                    labels: ["Lendo navegador", "Validando conta", "Buscando biblioteca", "Liberando acesso"]
                }, async () => {
                    await this.hydrateFromStorage();
                    this.render();

                    const paymentReturn = window.RotaNotaPremiumPaymentReturn;
                    if (paymentReturn && !paymentReturn.consumed) {
                        await this.consumePaymentReturn();
                    } else {
                        await this.refreshPremiumAccess();
                    }
                    await this.syncStudyLibraryWithAccount({ force: true });
                    this.render();

                    if (window.PremiumStudyPromotions && typeof window.PremiumStudyPromotions.refresh === "function") {
                        await window.PremiumStudyPromotions.refresh("premium_checkout", "");
                        if (window.PremiumStudyStore.getState().step === "premium-checkout") {
                            this.render();
                        }
                    }

                    await this.runHomeAction(window.RotaNotaPremiumHomeAction || "");

                    this.trackGrowthOnce("premium-module-entry", "premium_module_entry", {
                        surface: "premium_entry"
                    });
                });
            } catch (error) {
                console.warn("Inicializacao em segundo plano do PDF Focado falhou", error);
            } finally {
                this.initialLoadPromise = null;
            }
        },

        getCheckoutReturnContext() {
            if (!window.sessionStorage) {
                return null;
            }

            try {
                const raw = window.sessionStorage.getItem(CHECKOUT_CONTEXT_KEY);
                return raw ? JSON.parse(raw) : null;
            } catch (error) {
                return null;
            }
        },

        clearCheckoutReturnContext() {
            if (!window.sessionStorage) {
                return;
            }

            try {
                window.sessionStorage.removeItem(CHECKOUT_CONTEXT_KEY);
            } catch (error) {
                // Ignora bloqueios de storage do navegador.
            }
        },

        async refreshPremiumAccess(options = {}) {
            if (!window.PremiumStudyAccount || typeof window.PremiumStudyAccount.refreshAndApply !== "function") {
                return null;
            }

            const status = await window.PremiumStudyAccount.refreshAndApply(options);
            const isPremiumActive = Boolean(status && status.premiumActive);

            if (isPremiumActive) {
                window.PremiumStudyStore.clearSessionNote();
            }

            if (!this.lastKnownPremiumActive && isPremiumActive) {
                this.trackGrowthOnce(`premium-active-${status.customerId || "guest"}`, "premium_active_client_seen", {
                    metadata: {
                        subscriptionStatus: status.subscriptionStatus || "premium_active"
                    }
                });
            }

            this.lastKnownPremiumActive = isPremiumActive;

            if (status && status.authenticated && status.user && status.user.userId) {
                this.syncStudyLibraryWithAccount().catch((error) => console.warn("Sincronizacao da biblioteca falhou", error));
            } else {
                this.lastLibrarySyncUserId = "";
            }

            return status;
        },

        getLibraryService() {
            return window.PremiumStudyLibrary || null;
        },

        buildLatestStudySummaryFromLibraryItem(item) {
            if (!item) {
                return null;
            }

            return {
                id: item.id || "",
                title: item.title || item.materialName || "Estudo salvo",
                materialName: item.materialName || "PDF sem nome",
                examDate: item.examDate || "",
                examDateLabel: item.examDateLabel || "Data não definida",
                targetScore: item.targetScore || 7,
                studyHours: item.studyHours || 1,
                studyMinutes: item.studyMinutes || 0,
                step: item.step || "entry",
                savedAt: item.savedAt || new Date().toISOString(),
                pdfAvailable: Boolean(item.pdfAvailable)
            };
        },

        async syncStudyLibraryWithAccount(options = {}) {
            const store = window.PremiumStudyStore;
            const state = store.getState();
            const service = this.getLibraryService();

            if (
                !window.PremiumStudyStorage ||
                !service ||
                !state.accountAuthenticated ||
                !state.accountUser ||
                !state.accountUser.userId
            ) {
                return null;
            }

            const userId = state.accountUser.userId;

            if (this.librarySyncPromise) {
                return this.librarySyncPromise;
            }

            if (!options.force && this.lastLibrarySyncUserId === userId) {
                return store.getState().studyLibrary;
            }

            const executeSync = async () => {
                const localItems = await window.PremiumStudyStorage.getStudyLibrary();
                const remote = await service.getRemoteLibrary();
                const remoteItems = remote.ok ? remote.items : [];
                let mergedItems = service.mergeLibraryItems(localItems, remoteItems);

                if (mergedItems.length || localItems.length || remoteItems.length) {
                    await window.PremiumStudyStorage.saveStudyLibrary(mergedItems);
                    store.setStudyLibrary(mergedItems);

                    if (!store.getState().latestLocalStudy && mergedItems[0]) {
                        store.setLatestLocalStudy(this.buildLatestStudySummaryFromLibraryItem(mergedItems[0]));
                    }
                }

                const itemsToUpload = service.getItemsNeedingUpload(localItems, remoteItems);

                if (itemsToUpload.length) {
                    const uploaded = await service.saveRemoteLibraryItems(itemsToUpload);

                    if (uploaded.ok && uploaded.items.length) {
                        mergedItems = service.mergeLibraryItems(mergedItems, uploaded.items);
                        await window.PremiumStudyStorage.saveStudyLibrary(mergedItems);
                        store.setStudyLibrary(mergedItems);
                    }
                }

                this.lastLibrarySyncUserId = userId;
                return mergedItems;
            };

            this.librarySyncPromise = (options.visual
                ? this.runShellActivity({
                    kicker: "Biblioteca premium",
                    title: "Sincronizando seus estudos salvos",
                    message: "Estamos conferindo o que ja existe neste navegador e na sua conta para mostrar a biblioteca completa.",
                    labels: ["Lendo local", "Consultando nuvem", "Mesclando estudos", "Atualizando biblioteca"]
                }, executeSync)
                : executeSync())
                .catch((error) => {
                    console.warn("Não foi possível sincronizar a biblioteca premium", error);
                    return store.getState().studyLibrary;
                })
                .finally(() => {
                    this.librarySyncPromise = null;
                });

            return this.librarySyncPromise;
        },

        async runHomeAction(action = "") {
            const requestedAction = String(action || "").trim();
            const store = window.PremiumStudyStore;
            const access = window.PremiumStudyAccessControl;

            if (!requestedAction) {
                return false;
            }

            window.RotaNotaPremiumHomeAction = "";

            if (!this.root) {
                return false;
            }

            if (requestedAction === "study-entry") {
                store.patch({
                    workspaceMode: "study"
                });
                store.clearSessionNote();
                this.render();
                return true;
            }

            if (requestedAction === "pdf-upload") {
                store.patch({
                    workspaceMode: "study"
                });
                store.clearSessionNote();
                this.render();
                await this.handleAction("open-file-picker", {});
                return true;
            }

            if (requestedAction === "pdf-convert") {
                store.patch({
                    workspaceMode: "convert"
                });
                this.render();

                if (
                    access &&
                    !access.canUse(access.FEATURES.SCANNED_PDF_TEXT, store.getState())
                ) {
                    this.openPremiumOffer("SCANNED_PDF_TEXT", "entry");
                    this.render();
                    return true;
                }

                await this.handleAction("open-file-picker", {});
                return true;
            }

            if (requestedAction === "pdf-resume") {
                store.patch({
                    workspaceMode: "study"
                });
                store.clearSessionNote();
                await this.handleAction("resume-latest-study", {});
                this.render();
                return true;
            }

            if (requestedAction === "pdf-library") {
                store.patch({
                    workspaceMode: "study"
                });
                store.clearSessionNote();
                await this.handleAction("open-premium-library", {});
                this.render();
                return true;
            }

            return false;
        },

        consumePaymentReturn() {
            const paymentReturn = window.RotaNotaPremiumPaymentReturn;

            if (!paymentReturn || paymentReturn.consumed) {
                return;
            }

            const store = window.PremiumStudyStore;
            const router = window.PremiumStudyRouter;
            const messages = {
                success: {
                    tone: "info",
                    title: "Pagamento recebido pelo Mercado Pago",
                    message: "Estamos aguardando a confirmação segura do webhook para liberar o premium. Se o pagamento foi aprovado, a liberacao final entra na próxima etapa operacional."
                },
                pending: {
                    tone: "premium",
                    title: "Pagamento em analise",
                    message: "O Mercado Pago marcou este pagamento como pendente. Assim que houver confirmacao, o acesso premium podera ser liberado pelo servidor."
                },
                failure: {
                    tone: "premium",
                    title: "Pagamento não concluído",
                    message: "O pagamento não foi aprovado ou foi cancelado. Você pode tentar novamente quando quiser."
                }
            };
            const note = messages[paymentReturn.status] || messages.pending;

            paymentReturn.consumed = true;
            store.setPremiumOffer({
                eyebrow: "Papiro Tools Premium",
                title: paymentReturn.status === "success"
                    ? "Pagamento recebido. Falta a confirmacao segura."
                    : "Finalize seu acesso premium com segurança.",
                lead: "O checkout ja esta conectado ao Mercado Pago. A liberacao definitiva depende do webhook e da fonte de verdade do servidor.",
                benefits: [
                    "Checkout seguro funcionando",
                    "Webhook preparado para confirmacao",
                    "Liberacao premium sera persistida no backend"
                ],
                cta: "Voltar aos planos",
                sourceStep: "entry"
            });
            store.setReturnStep("entry");
            store.setSessionNote({
                step: "premium-checkout",
                ...note
            });
            router.goTo("premium-checkout");

            if (paymentReturn.status === "success" || paymentReturn.status === "pending") {
                this.schedulePremiumStatusRefresh();
            }
        },

        clearPremiumStatusTimers() {
            this.premiumStatusTimers.forEach((timerId) => window.clearTimeout(timerId));
            this.premiumStatusTimers = [];
        },

        schedulePremiumStatusRefresh() {
            this.clearPremiumStatusTimers();

            [2500, 7000, 15000, 30000].forEach((delay) => {
                const timerId = window.setTimeout(async () => {
                    const status = await this.refreshPremiumAccess();

                    if (status && status.premiumActive) {
                        window.PremiumStudyStore.setSessionNote({
                            step: "premium-checkout",
                            tone: "info",
                            title: "Premium liberado",
                            message: "Pagamento confirmado. Seus recursos premium ja estao ativos neste navegador."
                        });
                        this.clearPremiumStatusTimers();
                        this.render();
                    }
                }, delay);

                this.premiumStatusTimers.push(timerId);
            });
        },

        buildPaymentReturnNote(paymentStatus, isPremiumActive) {
            if (paymentStatus === "failure") {
                return {
                    tone: "premium",
                    title: "Pagamento não concluído",
                    message: "O pagamento foi cancelado ou não foi aprovado. Quando quiser, você pode tentar novamente sem perder sua trilha."
                };
            }

            if (isPremiumActive) {
                return {
                    tone: "success",
                    title: "Premium liberado. Sua trilha continua daqui.",
                    message: "Pagamento confirmado com sucesso. Biblioteca completa, continuidade e extras premium ja ficaram disponiveis neste estudo."
                };
            }

            if (paymentStatus === "success") {
                return {
                    tone: "info",
                    title: "Pagamento recebido. Estamos finalizando a liberacao.",
                    message: "Voce ja voltou para a sua trilha. Enquanto isso, validamos a confirmacao do servidor em segundo plano para ativar o premium sem te tirar do estudo."
                };
            }

            return {
                tone: "premium",
                title: "Pagamento em analise",
                message: "O Mercado Pago marcou o pagamento como pendente. Sua trilha continua normal enquanto buscamos a confirmacao final."
            };
        },

        async consumePaymentReturn() {
            const paymentReturn = window.RotaNotaPremiumPaymentReturn;

            if (!paymentReturn || paymentReturn.consumed) {
                return;
            }

            const store = window.PremiumStudyStore;
            const router = window.PremiumStudyRouter;
            const checkoutContext = this.getCheckoutReturnContext();
            const snapshot = checkoutContext && checkoutContext.snapshot && checkoutContext.snapshot.materialName
                ? checkoutContext.snapshot
                : null;
            const targetStep = snapshot
                ? this.getResumeStep(snapshot)
                : "entry";
            let status = null;

            if (
                (paymentReturn.status === "success" || paymentReturn.status === "pending") &&
                paymentReturn.paymentId
            ) {
                status = await this.refreshPremiumAccess({
                    paymentId: paymentReturn.paymentId
                });
            }

            const note = this.buildPaymentReturnNote(
                paymentReturn.status,
                Boolean(status && status.premiumActive)
            );

            paymentReturn.consumed = true;

            if (snapshot && paymentReturn.status !== "failure") {
                store.restoreFromSnapshot({
                    ...snapshot,
                    step: targetStep,
                    sessionNote: null
                });
                router.goTo(targetStep);
                store.setReturnStep(snapshot.returnStep || targetStep);
                store.setPremiumOffer(null);
                store.setSessionNote({
                    step: targetStep,
                    ...note
                });
            } else {
                store.setPremiumOffer({
                    eyebrow: "Papiro Tools Premium",
                    title: paymentReturn.status === "success"
                        ? "Pagamento recebido. Estamos voltando para sua trilha."
                        : "Finalize seu acesso premium com seguranca.",
                    lead: "O checkout segue conectado ao Mercado Pago e o servidor continua como fonte de verdade da liberacao premium.",
                    benefits: [
                        "Checkout seguro funcionando",
                        "Confirmacao premium monitorada pelo servidor",
                        "Acesso premium liberado sem reiniciar sua trilha"
                    ],
                    cta: "Voltar ao estudo",
                    sourceStep: checkoutContext && checkoutContext.sourceStep
                        ? checkoutContext.sourceStep
                        : "entry"
                });
                store.setReturnStep(checkoutContext && checkoutContext.sourceStep
                    ? checkoutContext.sourceStep
                    : "entry");
                store.setSessionNote({
                    step: "premium-checkout",
                    ...note
                });
                router.goTo("premium-checkout");
            }

            this.clearCheckoutReturnContext();

            if (
                (paymentReturn.status === "success" || paymentReturn.status === "pending") &&
                !(status && status.premiumActive)
            ) {
                this.schedulePremiumStatusRefresh(
                    paymentReturn,
                    snapshot ? targetStep : "premium-checkout",
                    checkoutContext
                );
            } else if (
                status &&
                status.premiumActive &&
                checkoutContext &&
                checkoutContext.feature === "SCANNED_PDF_TEXT"
            ) {
                await this.recoverPremiumScannedPdfFlow({
                    targetStep,
                    forceRegenerate: true
                });
            }
        },

        schedulePremiumStatusRefresh(paymentReturn = null, targetStep = "premium-checkout", checkoutContext = null) {
            this.clearPremiumStatusTimers();

            [2500, 7000, 15000, 30000].forEach((delay) => {
                const timerId = window.setTimeout(async () => {
                    const status = await this.refreshPremiumAccess({
                        paymentId: paymentReturn && paymentReturn.paymentId
                            ? paymentReturn.paymentId
                            : ""
                    });

                    if (status && status.premiumActive) {
                        window.PremiumStudyStore.setSessionNote({
                            step: targetStep,
                            tone: "success",
                            title: "Premium liberado",
                            message: "Pagamento confirmado. Seus recursos premium já estão ativos e sua trilha continua do ponto onde você parou."
                        });
                        this.clearPremiumStatusTimers();
                        const recoveryContext = checkoutContext || this.getCheckoutReturnContext();
                        if (recoveryContext && recoveryContext.feature === "SCANNED_PDF_TEXT") {
                            await this.recoverPremiumScannedPdfFlow({
                                targetStep,
                                forceRegenerate: true
                            });
                        }
                        this.render();
                    }
                }, delay);

                this.premiumStatusTimers.push(timerId);
            });
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
                    return;
                }

                if (
                    state.step === "highlight-preview" &&
                    state.highlightEditorOpen &&
                    state.highlightEditorFullScreen &&
                    !isActive
                ) {
                    store.setHighlightEditorFullScreen(false);
                    this.render();
                    return;
                }

                if (
                    state.step === "pdf-workbench" &&
                    state.pdfWorkbenchState &&
                    state.pdfWorkbenchState.fullScreen &&
                    !isActive
                ) {
                    store.patchPdfWorkbenchState({
                        fullScreen: false
                    });
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
                const sectionIndex = actionTarget.dataset.sectionIndex || "";
                const paragraphIndex = actionTarget.dataset.paragraphIndex || "";
                const partIndex = actionTarget.dataset.partIndex || "";
                this.handleAction(action, {
                    blockId,
                    tabId,
                    dateValue,
                    answerIndex,
                    itemIndex,
                    itemValue,
                    practiceType,
                    slotIndex,
                    sectionIndex,
                    paragraphIndex,
                    partIndex
                });
            });

            this.root.addEventListener("change", (event) => {
                if (event.target.id === "premiumStudyFileInput") {
                    const file = event.target.files && event.target.files[0];
                    if (file) {
                        this.handleSelectedFile(file, event.target);
                    }
                }
            });

            this.root.addEventListener("input", (event) => {
                if (event.target && event.target.id === "premiumPdfWorkbenchEditor") {
                    window.PremiumStudyStore.setPdfWorkbenchText(
                        this.getPdfWorkbenchEditorText(),
                        {
                            html: this.getPdfWorkbenchEditorHtml()
                        }
                    );
                    this.schedulePersist(500);
                }
            });

            this.root.addEventListener("paste", (event) => {
                if (!event.target || event.target.id !== "premiumPdfWorkbenchEditor") {
                    return;
                }

                event.preventDefault();
                const text = event.clipboardData
                    ? event.clipboardData.getData("text/plain")
                    : "";

                if (typeof document.execCommand === "function") {
                    document.execCommand("insertText", false, text);
                }
            });

            this.root.addEventListener("keydown", async (event) => {
                if (!event.target || event.target.id !== "premiumPdfSearchInput") {
                    return;
                }

                if (event.key === "Enter") {
                    event.preventDefault();
                    await this.handleAction("pdf-search", {});
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
                    this.schedulePersist(120);
                }
                this.activeRingControl = null;
            };

            this.root.addEventListener("pointerup", clearPointer);
            this.root.addEventListener("pointercancel", clearPointer);
            this.root.addEventListener("mouseup", () => {
                this.captureHighlightSelection();
            });
            this.root.addEventListener("keyup", () => {
                this.captureHighlightSelection();
            });
        },

        getHighlightSelectionOffset(root, container, offset) {
            if (!root || !container) {
                return 0;
            }

            const range = document.createRange();

            try {
                range.selectNodeContents(root);
                range.setEnd(container, Number(offset) || 0);
            } catch (error) {
                return 0;
            }

            return range.toString().length;
        },

        captureHighlightSelection() {
            if (!this.root) {
                return;
            }

            const store = window.PremiumStudyStore;
            const state = store.getState();

            if (
                state.step !== "highlight-preview" ||
                !state.highlightEditorOpen
            ) {
                return;
            }

            const selection = window.getSelection ? window.getSelection() : null;

            if (!selection || selection.rangeCount === 0 || selection.isCollapsed) {
                return;
            }

            const range = selection.getRangeAt(0);
            const startElement = range.startContainer?.parentElement
                ? range.startContainer.parentElement.closest("[data-premium-highlight-paragraph=\"true\"]")
                : null;
            const endElement = range.endContainer?.parentElement
                ? range.endContainer.parentElement.closest("[data-premium-highlight-paragraph=\"true\"]")
                : null;

            if (!startElement || startElement !== endElement) {
                return;
            }

            const sectionIndex = Number(startElement.dataset.sectionIndex);
            const paragraphIndex = Number(startElement.dataset.paragraphIndex);
            const startOffset = this.getHighlightSelectionOffset(startElement, range.startContainer, range.startOffset);
            const endOffset = this.getHighlightSelectionOffset(startElement, range.endContainer, range.endOffset);

            if (!Number.isFinite(sectionIndex) || !Number.isFinite(paragraphIndex) || startOffset === endOffset) {
                return;
            }

            store.setHighlightTextSelection(sectionIndex, paragraphIndex, startOffset, endOffset);
            selection.removeAllRanges();
            this.render();
            this.schedulePersist(120);
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
                (state.step === "block" && state.blockFullScreen) ||
                (
                    state.step === "highlight-preview" &&
                    state.highlightEditorOpen &&
                    state.highlightEditorFullScreen
                ) ||
                (
                    state.step === "pdf-workbench" &&
                    state.pdfWorkbenchState &&
                    state.pdfWorkbenchState.fullScreen
                );

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
                window.PremiumStudyStore.setLatestLocalStudy(this.buildLatestStudySummaryFromLibraryItem(studyLibrary[0]));
            }

            const latestDraft = await window.PremiumStudyStorage.getLatestDraft();
            if (!latestDraft || !latestDraft.snapshot) {
                this.persistenceReady = true;
                return;
            }

            const summary = window.PremiumStudyStorage.buildDraftSummary({
                ...latestDraft.snapshot,
                savedAt: latestDraft.savedAt
            });

            window.PremiumStudyStore.setLatestLocalStudy(summary);
            this.persistenceReady = true;
        },

        async getCurrentMaterialFile() {
            const state = window.PremiumStudyStore.getState();

            if (
                this.activeMaterialFile &&
                this.activeMaterialAssetId &&
                state.pdfAssetId &&
                this.activeMaterialAssetId === state.pdfAssetId
            ) {
                return this.activeMaterialFile;
            }

            if (!window.PremiumStudyStorage || !state.pdfAssetId) {
                return null;
            }

            const asset = await window.PremiumStudyStorage.getPdfAsset(state.pdfAssetId);

            if (!asset || !(asset.blob instanceof Blob)) {
                return null;
            }

            const nextFile = new File(
                [asset.blob],
                state.materialName || asset.fileName || "material.pdf",
                {
                    type: asset.mimeType || asset.blob.type || "application/pdf",
                    lastModified: Date.now()
                }
            );

            this.activeMaterialFile = nextFile;
            this.activeMaterialAssetId = state.pdfAssetId;

            return nextFile;
        },

        startActivityProgress(key) {
            const store = window.PremiumStudyStore;
            const timerKey = key === "modePreparation" ? "modePreparationTimer" : "shellActivityTimer";
            const setter = key === "modePreparation" ? "setModePreparation" : "setShellActivity";

            if (this[timerKey]) {
                window.clearInterval(this[timerKey]);
            }

            this[timerKey] = window.setInterval(() => {
                const state = store.getState();
                const activity = state[key];

                if (!activity || !activity.active) {
                    this.stopActivityProgress(key);
                    return;
                }

                const labels = Array.isArray(activity.labels) && activity.labels.length
                    ? activity.labels
                    : ["Lendo material", "Montando Aprender", "Montando Praticar", "Montando Prova"];
                const currentProgress = Number.isFinite(Number(activity.progress))
                    ? Number(activity.progress)
                    : 8;
                const nextProgress = Math.min(98, currentProgress + Math.max(1, Math.round((99 - currentProgress) * 0.045)));
                const objectiveTotal = labels.length;
                const objectiveIndex = Math.max(1, Math.min(objectiveTotal, Math.ceil((nextProgress / 100) * objectiveTotal)));

                store[setter]({
                    progress: nextProgress,
                    objectiveIndex,
                    objectiveTotal,
                    objectiveLabel: labels[objectiveIndex - 1] || labels[labels.length - 1] || ""
                });
                this.render();
            }, 950);
        },

        stopActivityProgress(key) {
            const timerKey = key === "modePreparation" ? "modePreparationTimer" : "shellActivityTimer";

            if (this[timerKey]) {
                window.clearInterval(this[timerKey]);
                this[timerKey] = null;
            }
        },

        isPdfMaterial(file) {
            const validator = window.PremiumStudyPdfValidator;
            return Boolean(validator && typeof validator.isPdfFile === "function" && validator.isPdfFile(file));
        },

        isStudyTextMaterial(file) {
            const validator = window.PremiumStudyPdfValidator;
            return Boolean(validator && typeof validator.isStudyTextFile === "function" && validator.isStudyTextFile(file));
        },

        normalizeTextMaterial(rawText = "", file) {
            const type = String(file && file.type ? file.type : "").toLowerCase();
            const name = String(file && file.name ? file.name : "").toLowerCase();
            let normalized = String(rawText || "");

            if (type.includes("html") || name.endsWith(".html") || name.endsWith(".htm") || type.includes("xml") || name.endsWith(".xml")) {
                const container = document.createElement("div");
                container.innerHTML = normalized;
                normalized = container.textContent || container.innerText || "";
            }

            return normalized
                .replace(/\r\n/g, "\n")
                .replace(/\n{3,}/g, "\n\n")
                .trim();
        },

        summarizeMaterialExtraction(result = {}, options = {}) {
            const text = String(result.text || "").trim();
            const expectedPages = Number(options.pageCount || result.pageCount || 0) || 0;
            const pageMarkerMatches = text.match(/\bPagina\s+\d+:/g);
            const markedPages = pageMarkerMatches ? pageMarkerMatches.length : 0;
            const nonEmptyPages = Number(result.nonEmptyPages || 0) || markedPages || (text ? 1 : 0);
            const charsPerPage = nonEmptyPages ? text.length / nonEmptyPages : text.length;
            const minTextLength = Math.max(900, Math.min(6000, expectedPages ? expectedPages * 220 : 1400));
            const minPageCoverage = expectedPages
                ? Math.max(1, Math.ceil(expectedPages * 0.45))
                : 1;

            return {
                text,
                textLength: text.length,
                expectedPages,
                nonEmptyPages,
                charsPerPage,
                looksStrong:
                    text.length >= minTextLength &&
                    nonEmptyPages >= minPageCoverage &&
                    charsPerPage >= 160
            };
        },

        normalizeTextForIntegrity(value = "") {
            return String(value || "")
                .normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "")
                .toLowerCase()
                .replace(/[§º°]/g, " ")
                .replace(/[^a-z0-9]+/g, " ")
                .replace(/\s+/g, " ")
                .trim();
        },

        extractLegalIntegrityMarkers(value = "") {
            const text = String(value || "");
            const patterns = [
                /\b\d{4,8}\s*-\s*\d{2}\.\d{4}\.\d{1,2}\.\d{2}\.\d{4}\b/g,
                /\bADI\s+(?:TJSC|STF)?\s*[\d.\-]+/gi,
                /\bIncidente\s+de\s+Argui[cç][aã]o\s+de\s+Inconstitucionalidade\s*:?\s*[\d.\-\s/]+/gi,
                /\bDecreto\s+Legislativo\s*:?\s*\d+[./]\d+\b/gi,
                /\bLei\s+Complementar\s+N?[º°]?\s*\d+\b/gi
            ];
            const markers = [];

            patterns.forEach((pattern) => {
                const matches = text.match(pattern);
                if (matches) {
                    matches.forEach((match) => markers.push(this.normalizeTextForIntegrity(match)));
                }
            });

            return Array.from(new Set(markers.filter(Boolean)));
        },

        hasPdfTextIntegrityRegression(candidate = {}, baseline = {}, options = {}) {
            const candidateText = String(candidate.text || "").trim();
            const baselineText = String(baseline.text || "").trim();
            const baselineSummary = this.summarizeMaterialExtraction(baseline, options);

            if (!candidateText || !baselineText || !baselineSummary.looksStrong) {
                return false;
            }

            const candidateSummary = this.summarizeMaterialExtraction(candidate, options);
            const candidateNorm = this.normalizeTextForIntegrity(candidateText);
            const baselineNorm = this.normalizeTextForIntegrity(baselineText);
            const firstWords = baselineNorm.split(" ").slice(0, 18).join(" ");
            const baselineMarkers = this.extractLegalIntegrityMarkers(baselineText);
            const candidateMarkers = new Set(this.extractLegalIntegrityMarkers(candidateText));
            const missingMarkers = baselineMarkers.filter((marker) => !candidateMarkers.has(marker));
            const baselinePageMarkers = (baselineText.match(/\bPagina\s+\d+:/g) || []).length;
            const candidatePageMarkers = (candidateText.match(/\bPagina\s+\d+:/g) || []).length;

            return Boolean(
                candidateSummary.textLength < baselineSummary.textLength * 0.98 ||
                (firstWords && !candidateNorm.includes(firstWords)) ||
                missingMarkers.length >= Math.max(1, Math.ceil(baselineMarkers.length * 0.15)) ||
                (baselinePageMarkers >= 3 && candidatePageMarkers < baselinePageMarkers)
            );
        },

        chooseBestMaterialExtraction(primary = {}, secondary = {}, options = {}) {
            const primaryText = String(primary.text || "").trim();
            const secondaryText = String(secondary.text || "").trim();

            if (!primaryText) {
                return secondary;
            }

            if (!secondaryText) {
                return primary;
            }

            if (this.hasPdfTextIntegrityRegression(secondary, primary, options)) {
                return {
                    ...primary,
                    status: primary.status || "extracted_local_preferred",
                    source: primary.source || "local_pdfjs",
                    quality: "strong",
                    warnings: [
                        ...((Array.isArray(primary.warnings) ? primary.warnings : [])),
                        "A leitura por IA foi descartada porque perdeu trechos ou identificadores do PDF local."
                    ]
                };
            }

            return secondary;
        },

        shouldUseAiTextFallback(result = {}, options = {}) {
            if (options.skipAiFallback) {
                return false;
            }

            if (!window.PremiumStudyPdfAiText || typeof window.PremiumStudyPdfAiText.requestFallback !== "function") {
                return false;
            }

            if (String(result.status || "") === "extracted_ai") {
                return false;
            }

            const summary = this.summarizeMaterialExtraction(result, options);

            if (!summary.textLength) {
                return true;
            }

            return !summary.looksStrong;
        },

        async loadCachedMaterialText(materialHash) {
            if (!materialHash || !window.PremiumStudyStorage) {
                return null;
            }

            return window.PremiumStudyStorage.getMaterialTextExtraction(materialHash);
        },

        async saveCachedMaterialText(record) {
            if (!window.PremiumStudyStorage || !record || !record.materialHash || !record.text) {
                return null;
            }

            return window.PremiumStudyStorage.saveMaterialTextExtraction(record);
        },

        async ensurePremiumPdfTextSourceReady(file, options = {}) {
            const store = window.PremiumStudyStore;
            const state = store.getState();
            const aiService = window.PremiumStudyPdfAiText;
            const inlineLimit = aiService && Number(aiService.MAX_INLINE_PDF_BYTES || 0) > 0
                ? Number(aiService.MAX_INLINE_PDF_BYTES)
                : (3 * 1024 * 1024);
            const byteSize = Number(file && file.size ? file.size : 0) || 0;

            if (!file || !byteSize || byteSize <= inlineLimit) {
                return {
                    ok: true,
                    status: "inline_pdf_ready",
                    byteSize,
                    inlineLimit
                };
            }

            if (
                aiService &&
                window.PremiumStudyPdfTextExtractor &&
                typeof window.PremiumStudyPdfTextExtractor.renderPageImages === "function"
            ) {
                return {
                    ok: true,
                    status: "local_pdf_images_ready",
                    byteSize,
                    inlineLimit
                };
            }

            if (!state.accountAuthenticated) {
                return {
                    ok: false,
                    status: "auth_required",
                    message: "Entre na sua conta premium para converter este PDF grande em texto com IA."
                };
            }

            if (!state.pdfAssetId) {
                return {
                    ok: false,
                    status: "missing_asset_id",
                    message: "Não encontrei o identificador do PDF para preparar a conversão premium."
                };
            }

            if (state.pdfSyncStatus === "synced") {
                return {
                    ok: true,
                    status: "server_pdf_ready",
                    byteSize,
                    inlineLimit
                };
            }

            store.patch({
                progressLabel: options.syncProgressLabel || "Preparando o PDF premium para a leitura integral por IA."
            });
            this.render();

            const syncResult = await this.syncPdfAssetToServer(file);
            const currentState = store.getState();

            if (syncResult && syncResult.ok) {
                return {
                    ok: true,
                    status: "server_pdf_ready",
                    byteSize,
                    inlineLimit
                };
            }

            return {
                ok: false,
                status: syncResult && syncResult.status ? syncResult.status : "pdf_sync_failed",
                message: syncResult && syncResult.message
                    ? syncResult.message
                    : (currentState.pdfSyncError || "Não consegui sincronizar o PDF premium para a leitura por IA.")
            };
        },

        async extractMaterialTextLocally(options = {}) {
            const store = window.PremiumStudyStore;
            const state = store.getState();
            const expectedPageCount = Number(options.pageCount || state.materialPageCount || 0) || 0;
            const existingText = options.forceRefresh
                ? ""
                : String(state.materialExtractedText || "");

            if (existingText) {
                return {
                    text: existingText,
                    status: state.materialExtractionStatus || "extracted",
                    pageCount: expectedPageCount || Number(state.materialPageCount || 0) || 0
                };
            }

            const materialFile = await this.getCurrentMaterialFile();

            if (
                !materialFile ||
                (
                    !this.isStudyTextMaterial(materialFile) &&
                    (
                        !window.PremiumStudyPdfTextExtractor ||
                        typeof window.PremiumStudyPdfTextExtractor.extractText !== "function"
                    )
                )
            ) {
                return {
                    text: "",
                    status: "missing_local_pdf",
                    pageCount: expectedPageCount
                };
            }

            let localExtraction;

            if (this.isStudyTextMaterial(materialFile) && !this.isPdfMaterial(materialFile)) {
                const rawText = await materialFile.text();
                const text = this.normalizeTextMaterial(rawText, materialFile);
                localExtraction = {
                    text: text.slice(0, Number(options.maxChars || 40000) || 40000),
                    status: text ? "extracted_text_file" : "empty_text",
                    source: "local_text_file",
                    pageCount: 1,
                    nonEmptyPages: text ? 1 : 0
                };
            } else {
                localExtraction = await window.PremiumStudyPdfTextExtractor.extractText(materialFile, {
                    maxChars: Number(options.maxChars || 40000) || 40000,
                    maxPages: Number(options.maxPages || 24) || 24
                });
            }

            store.setMaterialExtraction(localExtraction);

            const extraction = {
                text: localExtraction.text || "",
                status: localExtraction.status || "empty_text",
                source: localExtraction.source || "local_pdfjs",
                quality: localExtraction.quality || "",
                warnings: Array.isArray(localExtraction.warnings) ? localExtraction.warnings : [],
                pageCount: localExtraction.pageCount || expectedPageCount
            };

            if (options.saveCache && extraction.text) {
                const summary = this.summarizeMaterialExtraction(extraction, { pageCount: expectedPageCount });

                if (summary.looksStrong || options.cacheWeakLocal) {
                    await this.saveCachedMaterialText({
                        materialHash: state.materialHash || "",
                        materialName: state.materialName || "",
                        pageCount: extraction.pageCount || expectedPageCount,
                        text: extraction.text,
                        status: extraction.status || "extracted",
                        source: "local_pdfjs",
                        quality: summary.looksStrong ? "strong" : "weak"
                    });
                }
            }

            return extraction;
        },

        async ensureMaterialText(options = {}) {
            const store = window.PremiumStudyStore;
            const state = store.getState();
            const expectedPageCount = Number(options.pageCount || state.materialPageCount || 0) || 0;
            const allowAiFallback = options.allowAiFallback === true;
            const useCache = options.useCache !== false;
            this.lastPdfTextFallbackResult = null;
            let extraction = {
                text: state.materialExtractedText || "",
                status: state.materialExtractionStatus || "pending",
                pageCount: expectedPageCount
            };

            if (
                extraction.text &&
                (!allowAiFallback || !this.shouldUseAiTextFallback(extraction, { pageCount: expectedPageCount }))
            ) {
                return extraction.text;
            }

            if (useCache) {
                const cached = await this.loadCachedMaterialText(state.materialHash || "");

                if (cached && cached.text) {
                    store.setMaterialExtraction(cached);
                    extraction = {
                        text: cached.text,
                        status: cached.status || "cached_text",
                        pageCount: cached.pageCount || expectedPageCount
                    };

                    if (!allowAiFallback || !this.shouldUseAiTextFallback(extraction, { pageCount: expectedPageCount })) {
                        return extraction.text;
                    }
                }
            }

            const localExtraction = await this.extractMaterialTextLocally({
                maxChars: options.maxChars,
                maxPages: options.maxPages,
                pageCount: expectedPageCount,
                saveCache: options.saveLocalCache === true,
                cacheWeakLocal: options.cacheWeakLocal === true
            });

            extraction = {
                text: localExtraction.text || extraction.text || "",
                status: localExtraction.status || extraction.status || "pending",
                pageCount: localExtraction.pageCount || extraction.pageCount || expectedPageCount
            };

            if (!allowAiFallback || !this.shouldUseAiTextFallback(extraction, { pageCount: expectedPageCount })) {
                return extraction.text;
            }

            const materialFile = await this.getCurrentMaterialFile();

            if (!materialFile) {
                return extraction.text;
            }

            const aiService = window.PremiumStudyPdfAiText;

            if (!aiService || typeof aiService.requestFallback !== "function") {
                return extraction.text;
            }

            const sourceReady = await this.ensurePremiumPdfTextSourceReady(materialFile, {
                syncProgressLabel: options.syncProgressLabel || "Sincronizando o PDF premium antes da leitura por IA."
            });

            if (!sourceReady.ok) {
                this.lastPdfTextFallbackResult = sourceReady;

                if (!extraction.text) {
                    store.setMaterialExtraction({
                        text: "",
                        status: sourceReady.status || "pdf_sync_failed",
                        pageCount: expectedPageCount
                    });
                }

                return extraction.text;
            }

            store.patch({
                progressLabel: options.aiProgressLabel || "Tentando uma leitura assistida por IA para montar o texto do PDF."
            });
            this.render();

            const aiResult = await aiService.requestFallback({
                materialHash: state.materialHash || "",
                materialName: state.materialName || "",
                assetId: state.pdfAssetId || "",
                pageCount: expectedPageCount,
                localExtractedText: extraction.text || ""
            }, materialFile);
            this.lastPdfTextFallbackResult = aiResult || null;

            if (aiResult && aiResult.ok && aiResult.text) {
                const bestExtraction = this.chooseBestMaterialExtraction(extraction, aiResult, {
                    pageCount: expectedPageCount
                });
                store.setMaterialExtraction(bestExtraction);
                extraction = {
                    text: bestExtraction.text,
                    status: bestExtraction.status || aiResult.status || "extracted",
                    source: bestExtraction.source || aiResult.source || "",
                    quality: bestExtraction.quality || aiResult.quality || "",
                    warnings: Array.isArray(bestExtraction.warnings) ? bestExtraction.warnings : [],
                    pageCount: bestExtraction.pageCount || aiResult.pageCount || expectedPageCount
                };
                await this.saveCachedMaterialText({
                    materialHash: state.materialHash || "",
                    materialName: state.materialName || "",
                    pageCount: extraction.pageCount || expectedPageCount,
                    text: extraction.text,
                    status: extraction.status || "extracted",
                    source: extraction.source || "pdf_text_extraction",
                    quality: extraction.quality || "full",
                    warnings: extraction.warnings || []
                });
                return extraction.text;
            }

            if (!extraction.text) {
                store.setMaterialExtraction({
                    text: "",
                    status: aiResult && aiResult.status ? aiResult.status : "empty_text",
                    pageCount: expectedPageCount
                });
            }

            return extraction.text;
        },

        async ensurePdfWorkbenchText(options = {}) {
            const store = window.PremiumStudyStore;
            const state = store.getState();

            if (state.pdfWorkbenchText) {
                return state.pdfWorkbenchText;
            }

            const extractedText = await this.ensureMaterialText({
                maxChars: Number(options.maxChars || 40000) || 40000,
                maxPages: Number(options.maxPages || (state.accessTier === "premium" ? 60 : 24)) || 24,
                allowAiFallback: options.allowAiFallback === true,
                useCache: options.useCache !== false,
                saveLocalCache: options.saveLocalCache === true,
                cacheWeakLocal: options.cacheWeakLocal === true,
                syncProgressLabel: options.syncProgressLabel || "Preparando o PDF premium antes da leitura integral.",
                aiProgressLabel: options.aiProgressLabel || "Tentando destravar o texto integral do PDF para abrir o editor."
            });

            if (extractedText) {
                store.setPdfWorkbenchText(extractedText, {
                    preserveOriginal: false,
                    html: this.textToPdfWorkbenchHtml(extractedText)
                });
            }

            return extractedText;
        },

        escapePdfWorkbenchHtml(text) {
            return String(text || "")
                .replace(/&/g, "&amp;")
                .replace(/</g, "&lt;")
                .replace(/>/g, "&gt;")
                .replace(/\"/g, "&quot;")
                .replace(/'/g, "&#39;");
        },

        splitPdfWorkbenchTextParagraphs(text) {
            const normalized = String(text || "")
                .replace(/\r/g, "")
                .replace(/[ \t]+\n/g, "\n")
                .replace(/\n[ \t]+/g, "\n")
                .replace(/[ \t]{2,}/g, " ")
                .replace(/([^\n])\s+(P[aá]gina\s+\d+\s*:)/gi, "$1\n\n$2")
                .replace(/([.;:])\s+((?:Art\.?|Artigo)\s*\d+\s*(?:[º°o.]|\.|º)?)/g, "$1\n\n$2")
                .replace(/([.;])\s+((?:CAP[IÍ]TULO|SE[CÇ][AÃ]O)\b)/g, "$1\n\n$2")
                .trim();
            const sentenceParts = (value = "") => String(value || "")
                .replace(/\s+((?:[IVXLCDM]{1,8})\s*[-–]\s+)/g, "\n$1")
                .replace(/\s+([a-z]\)\s+)/g, "\n$1")
                .split(/\n+/)
                .map((part) => part.replace(/\s+/g, " ").trim())
                .filter(Boolean);
            const splitLongParagraph = (value = "") => {
                const clean = String(value || "").replace(/\s+/g, " ").trim();
                if (!clean) {
                    return [];
                }
                if (clean.length <= 760) {
                    return [clean];
                }

                const sentences = clean.match(/[^.!?;]+[.!?;]+(?=\s|$)|[^.!?;]+$/g) || [clean];
                const paragraphs = [];
                let current = "";

                sentences.forEach((sentence) => {
                    const next = sentence.replace(/\s+/g, " ").trim();
                    if (!next) {
                        return;
                    }

                    const candidate = current ? `${current} ${next}` : next;
                    if (candidate.length > 760 && current.length > 220) {
                        paragraphs.push(current);
                        current = next;
                        return;
                    }

                    current = candidate;
                    if (current.length >= 520 && /[.;!?]$/.test(current)) {
                        paragraphs.push(current);
                        current = "";
                    }
                });

                if (current) {
                    paragraphs.push(current);
                }

                return paragraphs;
            };

            return normalized
                .split(/\n{2,}/)
                .flatMap(sentenceParts)
                .flatMap(splitLongParagraph)
                .filter(Boolean);
        },

        textToPdfWorkbenchHtml(text) {
            const paragraphs = this.splitPdfWorkbenchTextParagraphs(text);
            if (!paragraphs.length) {
                return "";
            }

            return paragraphs
                .map((paragraph) => `<p>${this.escapePdfWorkbenchHtml(paragraph)}</p>`)
                .join("");
        },

        getPdfWorkbenchEditor() {
            return this.root
                ? this.root.querySelector("#premiumPdfWorkbenchEditor")
                : null;
        },

        extractTextFromPdfWorkbenchNode(node) {
            if (!node) {
                return "";
            }

            const blockTags = new Set([
                "P", "DIV", "SECTION", "ARTICLE", "LI", "H1", "H2", "H3", "H4", "H5", "H6", "BLOCKQUOTE"
            ]);
            let output = "";
            const appendBreak = () => {
                if (output && !output.endsWith("\n")) {
                    output += "\n";
                }
            };
            const walk = (current) => {
                if (!current) {
                    return;
                }

                if (current.nodeType === Node.TEXT_NODE) {
                    output += current.nodeValue || "";
                    return;
                }

                if (current.nodeType !== Node.ELEMENT_NODE) {
                    return;
                }

                const tag = current.tagName || "";
                if (tag === "SCRIPT" || tag === "STYLE") {
                    return;
                }

                if (tag === "BR") {
                    appendBreak();
                    return;
                }

                if (blockTags.has(tag)) {
                    appendBreak();
                }

                Array.from(current.childNodes || []).forEach(walk);

                if (blockTags.has(tag)) {
                    appendBreak();
                }
            };

            Array.from(node.childNodes || []).forEach(walk);

            return output
                .replace(/[ \t]+\n/g, "\n")
                .replace(/\n[ \t]+/g, "\n")
                .replace(/\n{3,}/g, "\n\n")
                .trim();
        },

        getPdfWorkbenchEditorText() {
            const editor = this.getPdfWorkbenchEditor();
            return editor
                ? this.extractTextFromPdfWorkbenchNode(editor).replace(/\r/g, "")
                : "";
        },

        getPdfWorkbenchEditorHtml() {
            const editor = this.getPdfWorkbenchEditor();
            return editor
                ? String(editor.innerHTML || "")
                    .replace(/<mark\b[^>]*data-pdf-search-hit="true"[^>]*>/gi, "")
                    .replace(/<\/mark>/gi, "")
                : "";
        },

        createPdfWorkbenchExportHtmlDocument(title, bodyHtml) {
            const safeTitle = String(title || "Documento editado");
            const content = String(bodyHtml || "")
                .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, "");

            return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${this.escapePdfWorkbenchHtml(safeTitle)}</title>
<style>
body { font-family: Calibri, "Segoe UI", Arial, sans-serif; color: #1f2937; margin: 0; background: #f3f4f6; }
.page { max-width: 920px; margin: 32px auto; background: #ffffff; padding: 40px 48px; box-shadow: 0 18px 48px rgba(15, 23, 42, 0.12); border-radius: 18px; }
h1 { margin: 0 0 24px; font-size: 28px; line-height: 1.2; }
.content { white-space: pre-wrap; font-size: 16px; line-height: 1.7; }
mark { padding: 0 2px; border-radius: 4px; }
</style>
</head>
<body>
<main class="page">
<h1>${this.escapePdfWorkbenchHtml(safeTitle)}</h1>
<div class="content">${content}</div>
</main>
</body>
</html>`;
        },

        downloadPdfWorkbenchEditedVersion() {
            const state = window.PremiumStudyStore.getState();
            const html = this.getPdfWorkbenchEditorHtml();

            if (!html) {
                return false;
            }

            const title = state.studyTitle || state.materialName || "documento-editado";
            const baseName = String(title)
                .replace(/\.[a-z0-9]+$/i, "")
                .replace(/[<>:"/\\|?*]+/g, " ")
                .replace(/\s+/g, " ")
                .trim()
                || "documento-editado";
            const documentHtml = this.createPdfWorkbenchExportHtmlDocument(title, html);
            const blob = new Blob([documentHtml], {
                type: "application/msword"
            });
            const url = window.URL.createObjectURL(blob);
            const anchor = document.createElement("a");
            anchor.href = url;
            anchor.download = `${baseName} - editado.doc`;
            document.body.appendChild(anchor);
            anchor.click();
            anchor.remove();
            window.setTimeout(() => {
                window.URL.revokeObjectURL(url);
            }, 2000);
            return true;
        },

        focusPdfWorkbenchText(query) {
            const editor = this.getPdfWorkbenchEditor();
            const search = String(query || "").trim();

            if (!editor) {
                return false;
            }

            this.clearPdfSearchHighlights();

            if (!search) {
                return false;
            }

            const lowerSearch = search.toLowerCase();
            const walker = document.createTreeWalker(editor, NodeFilter.SHOW_TEXT);
            const nodes = [];
            let source = "";
            let currentNode = walker.nextNode();

            while (currentNode) {
                const text = String(currentNode.nodeValue || "");
                if (text) {
                    nodes.push({
                        node: currentNode,
                        start: source.length,
                        end: source.length + text.length
                    });
                    source += text;
                }
                currentNode = walker.nextNode();
            }

            const lowerSource = source.toLowerCase();
            const selection = window.getSelection ? window.getSelection() : null;
            let startFrom = 0;

            if (selection && selection.rangeCount > 0) {
                const activeRange = selection.getRangeAt(0);
                const activeNode = activeRange.endContainer;
                const activeEntry = nodes.find((entry) => entry.node === activeNode);
                startFrom = activeEntry
                    ? activeEntry.start + activeRange.endOffset
                    : 0;
            }

            let matchIndex = lowerSource.indexOf(lowerSearch, startFrom);

            if (matchIndex < 0 && startFrom > 0) {
                matchIndex = lowerSource.indexOf(lowerSearch);
            }

            if (matchIndex < 0) {
                return false;
            }

            const matchEnd = matchIndex + search.length;
            const startEntry = nodes.find((entry) => matchIndex >= entry.start && matchIndex < entry.end);
            const endEntry = nodes.find((entry) => matchEnd > entry.start && matchEnd <= entry.end)
                || startEntry;

            if (!startEntry || !endEntry || !selection) {
                return false;
            }

            const range = document.createRange();
            range.setStart(startEntry.node, matchIndex - startEntry.start);
            range.setEnd(endEntry.node, matchEnd - endEntry.start);
            const highlight = document.createElement("mark");
            highlight.className = "premium-pdf-search-hit";
            highlight.setAttribute("data-pdf-search-hit", "true");
            highlight.appendChild(range.extractContents());
            range.insertNode(highlight);

            const applySelection = () => {
                const nextRange = document.createRange();
                selection.removeAllRanges();
                nextRange.selectNodeContents(highlight);
                selection.addRange(nextRange);
                editor.focus();
                const top = highlight.getBoundingClientRect().top;
                const hostTop = editor.getBoundingClientRect().top;
                editor.scrollTop += top - hostTop - (editor.clientHeight / 3);
            };

            applySelection();

            if (typeof window.requestAnimationFrame === "function") {
                window.requestAnimationFrame(() => {
                    window.requestAnimationFrame(() => {
                        applySelection();
                    });
                });
            } else {
                window.setTimeout(applySelection, 0);
            }

            return true;
        },

        clearPdfSearchHighlights() {
            const editor = this.getPdfWorkbenchEditor();

            if (!editor) {
                return;
            }

            editor.querySelectorAll("mark[data-pdf-search-hit=\"true\"]").forEach((mark) => {
                const parent = mark.parentNode;
                if (!parent) {
                    return;
                }

                while (mark.firstChild) {
                    parent.insertBefore(mark.firstChild, mark);
                }

                parent.removeChild(mark);
                parent.normalize();
            });
        },

        showPdfWorkbenchToast(message = "") {
            const store = window.PremiumStudyStore;

            if (this.pdfWorkbenchToastTimer) {
                window.clearTimeout(this.pdfWorkbenchToastTimer);
            }

            store.patchPdfWorkbenchState({
                transientMessage: String(message || "")
            });
            this.render();

            if (!message) {
                return;
            }

            this.pdfWorkbenchToastTimer = window.setTimeout(() => {
                this.pdfWorkbenchToastTimer = null;
                store.patchPdfWorkbenchState({
                    transientMessage: ""
                });
                this.render();
            }, 2200);
        },

        applyPdfHighlight(colorValue) {
            const editor = this.getPdfWorkbenchEditor();
            const selection = window.getSelection ? window.getSelection() : null;

            if (!editor || !selection || selection.rangeCount === 0 || selection.isCollapsed) {
                return false;
            }

            editor.focus();

            if (typeof document.execCommand === "function") {
                document.execCommand("styleWithCSS", false, true);
                const applied = document.execCommand("hiliteColor", false, colorValue);

                if (applied) {
                    window.PremiumStudyStore.setPdfWorkbenchText(
                        this.getPdfWorkbenchEditorText(),
                        {
                            html: this.getPdfWorkbenchEditorHtml()
                        }
                    );
                    this.schedulePersist(220);
                    return true;
                }
            }

            return false;
        },

        clearPdfHighlight() {
            const editor = this.getPdfWorkbenchEditor();

            if (!editor || typeof document.execCommand !== "function") {
                return false;
            }

            editor.focus();
            document.execCommand("removeFormat", false);
            window.PremiumStudyStore.setPdfWorkbenchText(
                this.getPdfWorkbenchEditorText(),
                {
                    html: this.getPdfWorkbenchEditorHtml()
                }
            );
            this.schedulePersist(220);
            return true;
        },

        getPdfWorkbenchService() {
            return window.PremiumStudyPdfWorkbench || null;
        },

        destroyPdfBridge() {
            const service = this.getPdfWorkbenchService();

            if (this.pdfBridge && typeof this.pdfBridge.destroy === "function") {
                this.pdfBridge.destroy();
            }

            this.pdfBridge = null;
            this.pdfLoadedAssetId = "";

            if (service && this.pdfObjectUrl) {
                service.revokeObjectUrl(this.pdfObjectUrl);
            }

            this.pdfObjectUrl = "";
        },

        async resolvePdfSourceUrl(assetId) {
            if (!assetId || !window.PremiumStudyStorage) {
                return "";
            }

            const service = this.getPdfWorkbenchService();
            const localAsset = await window.PremiumStudyStorage.getPdfAsset(assetId);

            if (localAsset && localAsset.blob && service) {
                if (this.pdfObjectUrl) {
                    service.revokeObjectUrl(this.pdfObjectUrl);
                }

                this.pdfObjectUrl = service.createObjectUrl(localAsset.blob);
                return this.pdfObjectUrl;
            }

            return service ? service.buildRemoteAssetUrl(assetId) : "";
        },

        async loadPdfAnnotationRecord(assetId) {
            if (!assetId || !window.PremiumStudyStorage) {
                return null;
            }

            const localRecord = await window.PremiumStudyStorage.getPdfAnnotations(assetId);
            const state = window.PremiumStudyStore.getState();
            const service = this.getPdfWorkbenchService();

            if (!state.accountAuthenticated || !service || typeof service.getRemoteAnnotations !== "function") {
                return localRecord;
            }

            const remote = await service.getRemoteAnnotations(assetId);

            if (!remote.ok || !remote.annotationRecord) {
                return localRecord;
            }

            const localTime = localRecord && localRecord.updatedAt
                ? new Date(localRecord.updatedAt).getTime()
                : 0;
            const remoteTime = remote.annotationRecord && remote.annotationRecord.updatedAt
                ? new Date(remote.annotationRecord.updatedAt).getTime()
                : 0;
            const winner = remoteTime >= localTime
                ? remote.annotationRecord
                : localRecord;

            if (winner) {
                await window.PremiumStudyStorage.savePdfAnnotations(winner);
            }

            return winner;
        },

        schedulePdfWorkbenchPersist(delay = 400) {
            const state = window.PremiumStudyStore.getState();

            if (!state.pdfAssetId) {
                return;
            }

            if (this.pdfWorkbenchPersistTimer) {
                window.clearTimeout(this.pdfWorkbenchPersistTimer);
            }

            this.pdfWorkbenchPersistTimer = window.setTimeout(() => {
                this.pdfWorkbenchPersistTimer = null;
                this.pdfWorkbenchPersistPromise = this.persistPdfWorkbenchState()
                    .catch((error) => console.error(error))
                    .finally(() => {
                        this.pdfWorkbenchPersistPromise = null;
                    });
            }, delay);
        },

        async persistPdfWorkbenchState() {
            const store = window.PremiumStudyStore;
            const state = store.getState();

            if (!state.pdfAssetId || !window.PremiumStudyStorage) {
                return null;
            }

            let manualAnnotationEntries = [];

            if (this.pdfBridge && typeof this.pdfBridge.request === "function") {
                try {
                    const exportState = await this.pdfBridge.request("exportAnnotations");
                    manualAnnotationEntries = Array.isArray(exportState && exportState.entries)
                        ? exportState.entries
                        : [];
                } catch (error) {
                    console.warn("Não consegui exportar as anotações do PDF", error);
                }
            } else {
                const existing = await window.PremiumStudyStorage.getPdfAnnotations(state.pdfAssetId);
                manualAnnotationEntries = Array.isArray(existing && existing.manualAnnotationEntries)
                    ? existing.manualAnnotationEntries
                    : [];
            }

            const annotationRecord = {
                assetId: state.pdfAssetId,
                version: 1,
                viewerState: state.pdfWorkbenchState,
                aiHighlights: state.aiHighlights,
                manualAnnotationEntries,
                updatedAt: new Date().toISOString()
            };

            const savedLocal = await window.PremiumStudyStorage.savePdfAnnotations(annotationRecord);
            const service = this.getPdfWorkbenchService();

            if (
                state.accountAuthenticated &&
                service &&
                typeof service.saveRemoteAnnotations === "function"
            ) {
                const remote = await service.saveRemoteAnnotations(state.pdfAssetId, annotationRecord);

                if (remote.ok) {
                    store.patchPdfWorkbenchState({
                        lastSyncedAt: annotationRecord.updatedAt
                    });
                    store.setPdfAsset({
                        pdfAssetId: state.pdfAssetId,
                        pdfAssetHash: state.pdfAssetHash,
                        pdfSource: "server",
                        pdfSyncStatus: "synced"
                    });
                }
            }

            return savedLocal;
        },

        async syncPdfAssetToServer(file) {
            const service = this.getPdfWorkbenchService();
            const store = window.PremiumStudyStore;
            const state = store.getState();

            if (
                !file ||
                !state.accountAuthenticated ||
                !service ||
                typeof service.uploadAsset !== "function" ||
                !state.pdfAssetId
            ) {
                return null;
            }

            store.setPdfAsset({
                pdfAssetId: state.pdfAssetId,
                pdfAssetHash: state.pdfAssetHash,
                pdfSource: state.pdfSource || "local",
                pdfSyncStatus: "syncing",
                pdfSyncError: ""
            });
            this.render();

            const result = await service.uploadAsset({
                assetId: state.pdfAssetId,
                assetHash: state.pdfAssetHash,
                fileName: state.materialName,
                mimeType: file.type,
                pageCount: state.materialPageCount,
                customerId: state.customerId
            }, file);

            if (!result.ok) {
                store.setPdfSyncError(result.message || "Não foi possível sincronizar o PDF agora.");
                this.render();
                return result;
            }

            store.setPdfAsset({
                pdfAssetId: result.assetId || state.pdfAssetId,
                pdfAssetHash: result.assetHash || state.pdfAssetHash,
                pdfSource: "server",
                pdfSyncStatus: "synced",
                pdfSyncError: ""
            });
            this.render();
            this.schedulePersist(80);

            return result;
        },

        async mountPdfWorkbench() {
            const store = window.PremiumStudyStore;
            const state = store.getState();
            const iframe = this.root ? this.root.querySelector("#premiumPdfWorkbenchFrame") : null;
            const service = this.getPdfWorkbenchService();

            if (!iframe || !service || !state.pdfAssetId) {
                return;
            }

            if (!this.pdfBridge || this.pdfBridge.iframe !== iframe) {
                this.destroyPdfBridge();
                this.pdfBridge = service.createBridge(iframe, {
                    viewerStateChanged: (payload) => {
                        store.patchPdfWorkbenchState(payload || {});
                        this.schedulePersist(120);
                        this.schedulePdfWorkbenchPersist(500);
                    },
                    aiHighlightSelected: (payload) => {
                        store.selectPdfAiHighlight(payload && payload.highlightId ? payload.highlightId : "");
                        this.render();
                    },
                    viewerError: (payload) => {
                        store.setSessionNote({
                            step: "pdf-workbench",
                            tone: "premium",
                            title: "Erro ao renderizar o PDF",
                            message: payload && payload.message
                                ? `O viewer retornou: ${payload.message}`
                                : "O viewer encontrou um erro ao abrir o documento."
                        });
                        this.render();
                    }
                });
            }

            if (this.pdfLoadedAssetId === state.pdfAssetId) {
                return;
            }

            const sourceUrl = await this.resolvePdfSourceUrl(state.pdfAssetId);
            if (!sourceUrl) {
                store.setSessionNote({
                    step: "pdf-workbench",
                    tone: "premium",
                    title: "PDF original indisponível",
                    message: "Não encontrei o arquivo original neste navegador nem no servidor."
                });
                this.render();
                return;
            }

            if (iframe.contentDocument && iframe.contentDocument.readyState !== "complete") {
                await new Promise((resolve) => {
                    iframe.addEventListener("load", () => resolve(), { once: true });
                });
            }

            const annotationRecord = await this.loadPdfAnnotationRecord(state.pdfAssetId);
            if (annotationRecord) {
                if (annotationRecord.viewerState) {
                    store.patchPdfWorkbenchState(annotationRecord.viewerState);
                }
                if (Array.isArray(annotationRecord.aiHighlights) && annotationRecord.aiHighlights.length) {
                    store.setPdfAiHighlights(annotationRecord.aiHighlights);
                }
            }

            try {
                const viewerState = await this.pdfBridge.request("loadDocument", {
                    url: sourceUrl,
                    annotationEntries: annotationRecord && annotationRecord.manualAnnotationEntries
                        ? annotationRecord.manualAnnotationEntries
                        : [],
                    aiHighlights: store.getState().aiHighlights,
                    viewerState: store.getState().pdfWorkbenchState
                });
                if (viewerState && typeof viewerState === "object") {
                    store.patchPdfWorkbenchState(viewerState);
                }
                this.pdfLoadedAssetId = state.pdfAssetId;
                store.clearSessionNote();
                this.render();
            } catch (error) {
                store.setSessionNote({
                    step: "pdf-workbench",
                    tone: "premium",
                    title: "Não consegui abrir o PDF",
                    message: "O viewer não respondeu a tempo. Tente abrir de novo; se persistir, reenvie o arquivo."
                });
                this.render();
            }
        },

        openPremiumOffer(featureName, sourceStep) {
            const store = window.PremiumStudyStore;
            const router = window.PremiumStudyRouter;
            const access = window.PremiumStudyAccessControl;
            const feature = access && access.FEATURES
                ? access.FEATURES[featureName] || featureName
                : featureName;
            const baseOffer = access
                ? access.buildOffer(feature)
                : {
                    feature,
                    eyebrow: "Premium",
                    title: "Libere recursos premium.",
                    lead: "Este recurso fica liberado no plano premium.",
                    benefits: ["Mais continuidade", "Mais treino", "Mais controle"],
                    cta: "Conhecer premium"
                };
            const source = sourceStep || store.getState().step || "entry";

            const applyOffer = (offer) => {
                store.setPremiumOffer({
                    ...offer,
                    sourceStep: source
                });
            };

            applyOffer(baseOffer);
            store.setReturnStep(source);
            router.goTo("premium-checkout");
            this.trackGrowth("paywall_viewed", {
                feature,
                sourceStep: source,
                surface: "premium_checkout",
                metadata: {
                    offerTitle: baseOffer.title || ""
                }
            });

            if (window.PremiumStudyPromotions && typeof window.PremiumStudyPromotions.refresh === "function") {
                window.PremiumStudyPromotions.refresh("premium_checkout", feature)
                    .then(() => {
                        const enhanced = window.PremiumStudyPromotions.enhanceOffer(baseOffer, {
                            feature,
                            surface: "premium_checkout"
                        });
                        applyOffer(enhanced);
                        if (window.PremiumStudyStore.getState().step === "premium-checkout") {
                            this.render();
                        }
                    })
                    .catch(() => {
                        // Se a promoção não responder, mantemos a oferta base.
                    });
            }
        },

        async handleSelectedFile(file, input) {
            const store = window.PremiumStudyStore;
            const router = window.PremiumStudyRouter;
            const validator = window.PremiumStudyPdfValidator;
            const workspaceMode = store.getState().workspaceMode === "convert" ? "convert" : "study";
            const validation = validator
                ? await validator.validate(file, store.getState(), { mode: workspaceMode })
                : { ok: true, pageCount: null };

            if (input) {
                input.value = "";
            }

            if (!validation.ok) {
                this.trackGrowth("pdf_upload_blocked", {
                    reason: validation.reason || "invalid_pdf",
                    pageCount: Number(validation.pageCount || 0),
                    metadata: {
                        fileName: file && file.name ? file.name : "",
                        message: validation.message || ""
                    }
                });
                if (validation.reason === "page_limit") {
                    this.openPremiumOffer("LARGE_PDF_UPLOAD", "entry");
                    store.setSessionNote({
                        step: "premium-checkout",
                        tone: "premium",
                        title: "PDF acima do limite grátis",
                        message: validation.message
                    });
                } else {
                    store.setSessionNote({
                        step: store.getState().step,
                        tone: "premium",
                        title: "PDF não aceito",
                        message: validation.message || "Tente um PDF textual valido."
                    });
                }

                this.render();
                return;
            }

            if (
                workspaceMode === "convert" &&
                window.PremiumStudyAccessControl &&
                !window.PremiumStudyAccessControl.canUse(
                    window.PremiumStudyAccessControl.FEATURES.SCANNED_PDF_TEXT,
                    store.getState()
                )
            ) {
                this.openPremiumOffer("SCANNED_PDF_TEXT", "entry");
                store.setSessionNote({
                    step: "premium-checkout",
                    tone: "premium",
                    title: "Conversao premium",
                    message: "A conversao integral de PDF ruim em texto editavel fica no premium."
                });
                this.render();
                return;
            }

            this.activeMaterialFile = file;
            this.activeMaterialAssetId = "";
            this.materialPreparationPromise = null;
            this.materialPreparationKey = "";
            this.materialPreparationResult = null;
            const pdfWorkbench = this.getPdfWorkbenchService();
            let materialHash = "";

            if (pdfWorkbench && typeof pdfWorkbench.buildPdfAssetHash === "function") {
                materialHash = await pdfWorkbench.buildPdfAssetHash(file);
            }

            if (!materialHash && window.PremiumStudyGrowth && typeof window.PremiumStudyGrowth.buildMaterialHash === "function") {
                materialHash = await window.PremiumStudyGrowth.buildMaterialHash({
                    name: file.name,
                    size: file.size,
                    type: file.type,
                    pageCount: validation.pageCount
                });
            }

            if (window.PremiumStudyStorage) {
                await window.PremiumStudyStorage.savePdfAsset({
                    id: materialHash,
                    assetHash: materialHash,
                    fileName: file.name,
                    mimeType: file.type || "application/octet-stream",
                    byteSize: file.size,
                    pageCount: validation.pageCount,
                    source: "local",
                    savedAt: new Date().toISOString(),
                    blob: file
                });
            }

            this.activeMaterialAssetId = materialHash;

            store.setMaterial({
                name: file.name,
                size: file.size,
                type: file.type,
                kind: validation.kind || (this.isPdfMaterial(file) ? "pdf" : "text"),
                pageCount: validation.pageCount,
                workspaceMode,
                materialHash,
                pdfAssetId: materialHash,
                pdfAssetHash: materialHash,
                pdfSource: "local",
                pdfSyncStatus: this.isPdfMaterial(file) && store.getState().accountAuthenticated ? "syncing" : "local_only"
            });
            this.trackGrowth(workspaceMode === "convert" ? "pdf_convert_upload_success" : "pdf_upload_success", {
                materialHash,
                pageCount: Number(validation.pageCount || 0),
                metadata: {
                    fileName: file.name || ""
                }
            });

            if (workspaceMode === "convert") {
                this.render();
                const workbenchText = await this.ensurePdfWorkbenchText({
                    maxChars: 50000,
                    maxPages: 60,
                    allowAiFallback: true,
                    useCache: true,
                    saveLocalCache: true,
                    syncProgressLabel: "Preparando o PDF premium antes da conversao em texto editavel.",
                    aiProgressLabel: "Convertendo o PDF em texto editavel com ajuda da IA."
                });

                if (!workbenchText) {
                    store.setSessionNote({
                        step: "entry",
                        tone: "premium",
                        title: "Nao consegui preparar o PDF em texto",
                        message: this.lastPdfTextFallbackResult && this.lastPdfTextFallbackResult.message
                            ? this.lastPdfTextFallbackResult.message
                            : "Nao encontrei texto suficiente para abrir o editor agora."
                    });
                    this.render();
                    return;
                }

                router.goTo("pdf-workbench");
                this.render();
                this.schedulePersist(80);
                return;
            }

            router.goTo("exam-date");
            this.render();
            this.schedulePersist(80);

            if (this.isPdfMaterial(file)) {
                this.syncPdfAssetToServer(file).catch((error) => console.error(error));
            }

            this.primeMaterialPreparation({
                materialHash,
                maxChars: store.getState().accessTier === "premium" ? 90000 : 30000,
                maxPages: store.getState().accessTier === "premium" ? 160 : 12
            }).catch((error) => console.warn("Preparo antecipado do material falhou", error));
        },

        async persistCurrentState() {
            const state = window.PremiumStudyStore.getState();
            if (!window.PremiumStudyStorage || !state.materialName) {
                return;
            }

            if (state.pdfAssetId) {
                await this.persistPdfWorkbenchState().catch((error) => console.error(error));
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
            let studyLibrary = await window.PremiumStudyStorage.saveStudyLibraryRecord({
                ...window.PremiumStudyStore.exportSnapshot(),
                savedAt: savedDraft.savedAt
            });
            if (studyLibrary && studyLibrary.length) {
                window.PremiumStudyStore.setStudyLibrary(studyLibrary);
            }

            const libraryService = this.getLibraryService();
            const currentState = window.PremiumStudyStore.getState();
            const currentLibraryItem = Array.isArray(studyLibrary)
                ? studyLibrary.find((item) => item.id === currentState.studyLibraryId) || studyLibrary[0] || null
                : null;

            if (
                currentState.accountAuthenticated &&
                libraryService &&
                currentLibraryItem
            ) {
                const remoteSave = await libraryService.saveRemoteLibraryItems([currentLibraryItem]);

                if (remoteSave.ok) {
                    studyLibrary = libraryService.mergeLibraryItems(studyLibrary, remoteSave.items);
                    await window.PremiumStudyStorage.saveStudyLibrary(studyLibrary);
                    window.PremiumStudyStore.setStudyLibrary(studyLibrary);
                    this.lastLibrarySyncUserId = currentState.accountUser && currentState.accountUser.userId
                        ? currentState.accountUser.userId
                        : this.lastLibrarySyncUserId;
                }
            }

            this.persistenceReady = true;
        },

        schedulePersist(delay = 180) {
            const state = window.PremiumStudyStore.getState();
            if (!window.PremiumStudyStorage || !state.materialName) {
                return;
            }

            if (this.persistTimer) {
                window.clearTimeout(this.persistTimer);
            }

            this.persistTimer = window.setTimeout(() => {
                this.persistTimer = null;
                this.persistPromise = this.persistCurrentState()
                    .catch((error) => console.error(error))
                    .finally(() => {
                        this.persistPromise = null;
                    });
            }, delay);
        },

        async flushPersist() {
            const state = window.PremiumStudyStore.getState();
            if (!window.PremiumStudyStorage || !state.materialName) {
                return;
            }

            if (this.persistTimer) {
                window.clearTimeout(this.persistTimer);
                this.persistTimer = null;
            }

            if (this.persistPromise) {
                await this.persistPromise;
            } else {
                this.persistPromise = this.persistCurrentState()
                    .catch((error) => console.error(error))
                    .finally(() => {
                        this.persistPromise = null;
                    });

                await this.persistPromise;
            }

            if (this.pdfWorkbenchPersistTimer) {
                window.clearTimeout(this.pdfWorkbenchPersistTimer);
                this.pdfWorkbenchPersistTimer = null;
            }

            if (this.pdfWorkbenchPersistPromise) {
                await this.pdfWorkbenchPersistPromise;
            }
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
        ? `<mark style="background:${({
            gold: "rgba(255, 203, 109, 0.52)",
            mint: "rgba(88, 227, 183, 0.42)",
            blue: "rgba(121, 213, 255, 0.42)",
            rose: "rgba(255, 151, 188, 0.44)"
        })[part.colorKey] || "rgba(255, 203, 109, 0.52)"}">${window.PremiumStudyUI.escapeHtml(part.text)}</mark>`
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
            this.stopAnalysisProgress();
        },

        startAnalysisProgress() {
            const store = window.PremiumStudyStore;

            if (this.analysisProgressTimer) {
                window.clearInterval(this.analysisProgressTimer);
            }

            this.analysisProgressTimer = window.setInterval(() => {
                const state = store.getState();
                const status = String(state.analysisStatus || "");
                const currentProgress = Math.max(0, Number(state.analysisProgress || 0));

                if (status !== "running" || currentProgress >= 92) {
                    this.stopAnalysisProgress();
                    return;
                }

                let cap = 18;

                if (currentProgress >= 72) {
                    cap = 86;
                } else if (currentProgress >= 46) {
                    cap = 60;
                } else if (currentProgress >= 18) {
                    cap = 34;
                }

                if (currentProgress >= cap) {
                    return;
                }

                const nextProgress = Math.min(
                    cap,
                    currentProgress + Math.max(1, Math.round((cap - currentProgress) * 0.16))
                );

                store.setAnalysisProgress(nextProgress, "running");
                this.render();
            }, 900);
        },

        stopAnalysisProgress() {
            if (this.analysisProgressTimer) {
                window.clearInterval(this.analysisProgressTimer);
                this.analysisProgressTimer = null;
            }
        },

        legacyStartAnalysisSequence() {
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
                                progressLabel: "Sua trilha inicial está pronta para você escolher como quer entrar no conteúdo."
                            });
                            this.render();
                            this.schedulePersist(120);
                        }, 520);
                        this.analysisTimers.push(finishId);
                    }
                }, 520 + (index * 420));

                this.analysisTimers.push(timerId);
            });
        },

        buildBundleSummary() {
            const state = window.PremiumStudyStore.getState();
            return state.blocks.map((block) => {
                const learn = block.learn || {};
                return [
                    block.title,
                    block.subtitle,
                    learn.summary,
                    ...(Array.isArray(block.topics) ? block.topics : []),
                    ...(Array.isArray(learn.keyConcepts) ? learn.keyConcepts : []),
                    ...(Array.isArray(learn.hotPoints) ? learn.hotPoints : []),
                    ...(Array.isArray(learn.examFocus) ? learn.examFocus : []),
                    ...(Array.isArray(learn.masteryChecklist) ? learn.masteryChecklist : [])
                ].filter(Boolean).join("\n");
            }).join("\n\n");
        },

        buildFallbackLevelExamQuestions(questionCount = 10) {
            const store = window.PremiumStudyStore;
            const state = store.getState();
            const blocks = Array.isArray(state.blocks) ? state.blocks : [];
            const desiredCount = Math.max(1, Number(questionCount) || 10);
            const uniqueQuestions = [];
            const seenPrompts = new Set();
            const normalizeText = (value = "") => String(value || "")
                .replace(/\b(?:https?:\/\/|www\.)\S+/gi, "")
                .replace(/\b\S+\.(?:gov|com|org|net|br)(?:\/\S*)?/gi, "")
                .replace(/\bPagina\s+\d+:\s*/gi, "")
                .replace(/\b\d{2}\/\d{2}\/\d{4},?\s*\d{2}:\d{2}\b/g, "")
                .replace(/\s+/g, " ")
                .trim();
            const clipText = (value = "", maxLength = 160) => {
                const text = normalizeText(value);
                if (text.length <= maxLength) {
                    return text;
                }

                const clipped = text.slice(0, maxLength);
                const boundary = Math.max(
                    clipped.lastIndexOf(". "),
                    clipped.lastIndexOf("; "),
                    clipped.lastIndexOf(", ")
                );

                return `${clipped.slice(0, boundary > maxLength * 0.58 ? boundary + 1 : maxLength).trim()}...`;
            };
            const phrase = (value = "", maxLength = 95) => clipText(value, maxLength)
                .replace(/[.;:,]+$/g, "")
                .trim();
            const uniqueList = (items = [], max = 8) => {
                const seen = new Set();
                return items
                    .map((item) => phrase(item, 120))
                    .filter(Boolean)
                    .filter((item) => {
                        const key = item.toLowerCase();
                        if (seen.has(key)) {
                            return false;
                        }
                        seen.add(key);
                        return true;
                    })
                    .slice(0, max);
            };
            const extractLearnFocus = (block = {}) => {
                const learn = block.learn || {};
                const fromSections = Array.isArray(learn.documentSections)
                    ? learn.documentSections.flatMap((section) => [
                        ...(Array.isArray(section.items) ? section.items : []),
                        ...(Array.isArray(section.paragraphs) ? section.paragraphs : [])
                    ])
                    : [];
                const fromModules = Array.isArray(learn.lessonModules)
                    ? learn.lessonModules.flatMap((module) => [
                        ...(Array.isArray(module.takeaways) ? module.takeaways : []),
                        ...(Array.isArray(module.paragraphs) ? module.paragraphs : [])
                    ])
                    : [];

                return uniqueList([
                    ...(Array.isArray(learn.examFocus) ? learn.examFocus : []),
                    ...(Array.isArray(learn.keyConcepts) ? learn.keyConcepts : []),
                    ...(Array.isArray(learn.hotPoints) ? learn.hotPoints : []),
                    ...(Array.isArray(block.topics) ? block.topics : []),
                    ...fromModules,
                    ...fromSections,
                    learn.summary,
                    learn.intro,
                    block.subtitle
                ], 10);
            };
            const rotateOptions = (options = [], seed = 0) => {
                const cleanOptions = uniqueList(options, 4);
                const fallbackOptions = [
                    "Marcar a alternativa mais familiar sem conferir o trecho.",
                    "Decorar apenas o numero do artigo.",
                    "Ignorar sujeitos, limites e excecoes.",
                    "Responder pelo tema geral, sem aplicar criterio."
                ];

                while (cleanOptions.length < 4) {
                    const nextFallback = fallbackOptions.find((item) => !cleanOptions.includes(item));
                    cleanOptions.push(nextFallback || `Distrator ${cleanOptions.length + 1}`);
                }

                const correct = cleanOptions[0];
                const distractors = cleanOptions.slice(1, 4);
                const offset = Math.max(0, Number(seed) || 0) % 4;
                const rotated = distractors.slice();
                rotated.splice(offset, 0, correct);

                return {
                    options: rotated,
                    correctIndex: offset
                };
            };
            const buildQuestion = ({ prompt, correct, distractors, rationale }, seed = 0) => {
                const rotated = rotateOptions([correct, ...(Array.isArray(distractors) ? distractors : [])], seed);
                return {
                    prompt: clipText(prompt, 260),
                    options: rotated.options,
                    correctIndex: rotated.correctIndex,
                    rationale: clipText(rationale, 360)
                };
            };

            const pushQuestion = (question, meta = {}) => {
                if (
                    !question ||
                    !question.prompt ||
                    !Array.isArray(question.options) ||
                    question.options.length < 2 ||
                    !Number.isFinite(question.correctIndex)
                ) {
                    return;
                }

                const promptKey = String(question.prompt || "").trim().toLowerCase();
                if (!promptKey || seenPrompts.has(promptKey)) {
                    return;
                }

                seenPrompts.add(promptKey);
                uniqueQuestions.push({
                    prompt: String(question.prompt || "").trim(),
                    options: question.options.slice(0, 4).map((option) => String(option || "").trim()),
                    correctIndex: Number(question.correctIndex),
                    rationale: String(question.rationale || meta.rationale || "").trim()
                });
            };

            blocks.forEach((block, blockIndex) => {
                const title = phrase(block && block.title ? block.title : `Bloco ${blockIndex + 1}`, 80);
                const learn = block && block.learn ? block.learn : {};
                const focus = extractLearnFocus(block);
                const firstFocus = focus[0] || "o comando central do bloco";
                const secondFocus = focus[1] || firstFocus;
                const thirdFocus = focus[2] || secondFocus;
                const pitfall = Array.isArray(learn.pitfalls) && learn.pitfalls[0]
                    ? phrase(learn.pitfalls[0], 120)
                    : "responder por familiaridade sem conferir o criterio";
                const mastery = Array.isArray(learn.masteryChecklist) && learn.masteryChecklist[0]
                    ? phrase(learn.masteryChecklist[0], 120)
                    : "explicar a regra com suas palavras e aplicar ao caso";

                [
                    buildQuestion({
                        prompt: `Na prova de nivel, qual leitura resolve melhor "${title}"?`,
                        correct: "Isolar sujeito, comando, limite e efeito antes de escolher a alternativa.",
                        distractors: [
                            "Procurar a opcao com o texto mais parecido com o PDF.",
                            "Responder pelo tema geral sem voltar ao criterio.",
                            "Decorar apenas o numero do artigo ou titulo do bloco."
                        ],
                        rationale: `A prova de nivel mede transferencia: em ${title}, o acerto depende de aplicar criterio, nao de repetir a questao do treino.`
                    }, blockIndex),
                    buildQuestion({
                        prompt: `Quando "${title}" cobra ${firstFocus}, o que precisa ficar claro?`,
                        correct: "Qual regra ou criterio transforma o trecho em decisao para o caso apresentado.",
                        distractors: [
                            "Qual alternativa parece mais longa ou detalhada.",
                            "Qual palavra apareceu primeiro no material.",
                            "Qual exemplo pode ser decorado sem contexto."
                        ],
                        rationale: `O ponto ${firstFocus} precisa virar criterio de resposta, nao apenas reconhecimento de texto.`
                    }, blockIndex + 1),
                    buildQuestion({
                        prompt: `Qual erro derruba a resposta em "${title}"?`,
                        correct: `Cair em ${pitfall} sem conferir sujeito, condicao ou excecao.`,
                        distractors: [
                            "Comparar o caso narrado com o comando literal.",
                            "Separar regra principal de excecao antes de marcar.",
                            "Explicar o criterio com palavras proprias."
                        ],
                        rationale: `A prova de nivel usa distratores proximos; por isso o erro central e ${pitfall}.`
                    }, blockIndex + 2),
                    buildQuestion({
                        prompt: `O que mostra dominio real de "${title}" alem do questionario?`,
                        correct: mastery,
                        distractors: [
                            "Refazer a mesma pergunta do treino ate decorar a letra correta.",
                            "Ignorar os pontos de apoio do bloco.",
                            "Escolher a resposta por memoria visual da tela."
                        ],
                        rationale: `Dominio real aparece quando o aluno usa ${secondFocus} para justificar uma situacao nova.`
                    }, blockIndex + 3),
                    buildQuestion({
                        prompt: `Se o enunciado trocar o exemplo de "${title}", qual caminho mantem a resposta correta?`,
                        correct: "Aplicar a mesma regra central ao novo caso, conferindo limites e excecoes.",
                        distractors: [
                            "Repetir a alternativa que apareceu no questionario.",
                            "Escolher a opcao com mais palavras copiadas do material.",
                            "Tratar todo exemplo novo como se fosse fora do assunto."
                        ],
                        rationale: `A prova premium precisa cobrar transferencia: ${title} deve funcionar em caso novo, nao so na pergunta treinada.`
                    }, blockIndex + 4),
                    buildQuestion({
                        prompt: `Qual pista diferencia uma resposta forte de um distrator em "${title}"?`,
                        correct: `A alternativa conecta ${thirdFocus} com uma consequencia verificavel no caso.`,
                        distractors: [
                            "A alternativa cita muitas palavras do texto, mesmo sem comando claro.",
                            "A alternativa parece neutra e evita decidir o caso.",
                            "A alternativa troca o criterio por uma frase generica de estudo."
                        ],
                        rationale: `Distratores bons parecem proximos; a pista decisiva e ligar o ponto cobrado a uma consequencia.`
                    }, blockIndex + 5),
                    buildQuestion({
                        prompt: `Em "${title}", quando vale voltar ao trecho antes de marcar?`,
                        correct: "Quando a alternativa depende de sujeito, prazo, condicao, excecao ou efeito especifico.",
                        distractors: [
                            "Quando a alternativa e curta.",
                            "Quando a letra correta parece repetir a posicao da rodada anterior.",
                            "Quando o tema geral do bloco ja foi reconhecido."
                        ],
                        rationale: `A checagem fina evita errar por memoria visual, principalmente quando ha condicoes ou excecoes.`
                    }, blockIndex + 6),
                    buildQuestion({
                        prompt: `Qual alternativa seria mais perigosa numa prova sobre "${title}"?`,
                        correct: "Uma alternativa quase correta que muda o alcance, a condicao ou a consequencia da regra.",
                        distractors: [
                            "Uma alternativa claramente fora do assunto.",
                            "Uma alternativa curta que pede leitura do comando.",
                            "Uma alternativa que exige comparar regra e caso."
                        ],
                        rationale: `O erro mais caro costuma estar no detalhe alterado: alcance, condicao ou consequencia.`
                    }, blockIndex + 7),
                    buildQuestion({
                        prompt: `Como justificar uma resposta de "${title}" sem copiar o artigo inteiro?`,
                        correct: "Dizer a regra em uma frase e mostrar como ela decide o caso proposto.",
                        distractors: [
                            "Colar o maior trecho possivel do material.",
                            "Responder apenas com o numero do artigo.",
                            "Citar o titulo do bloco como se fosse explicacao."
                        ],
                        rationale: `A justificativa boa prova entendimento: regra curta, criterio claro e aplicacao ao caso.`
                    }, blockIndex + 8),
                    buildQuestion({
                        prompt: `Qual decisao de estudo prepara melhor para uma questao nova de "${title}"?`,
                        correct: `Treinar ${firstFocus} como criterio aplicavel, nao como frase decorada.`,
                        distractors: [
                            "Memorizar a primeira alternativa vista em Praticar.",
                            "Ignorar os exemplos porque a prova cobra so texto literal.",
                            "Revisar apenas a ordem das letras corretas."
                        ],
                        rationale: `A prova premium deve medir prontidao: o ponto ${firstFocus} precisa virar criterio de decisao.`
                    }, blockIndex + 9)
                ].forEach((question) => pushQuestion(question));
            });

            if (!uniqueQuestions.length) {
                return [];
            }

            const selectedQuestions = [];
            for (let index = 0; index < desiredCount; index += 1) {
                const sourceQuestion = uniqueQuestions[index % uniqueQuestions.length];
                const cycle = Math.floor(index / uniqueQuestions.length);

                if (!cycle) {
                    selectedQuestions.push({
                        ...sourceQuestion,
                        options: sourceQuestion.options.slice()
                    });
                    continue;
                }

                selectedQuestions.push({
                    ...sourceQuestion,
                    prompt: `${sourceQuestion.prompt} (revisao ${cycle + 1})`,
                    options: sourceQuestion.options.slice(),
                    rationale: sourceQuestion.rationale
                });
            }

            return selectedQuestions;
        },

        buildLocalBundleFromExtractedText(text, options = {}) {
            const store = window.PremiumStudyStore;
            const state = store.getState();
            const materialName = options.materialName || state.studyTitle || state.materialName || "Material";
            const rawText = String(text || "").replace(/\r/g, "");
            const rawLines = rawText
                .split("\n")
                .map((line) => line.replace(/[ \t]+/g, " ").trim());
            const clean = rawLines
                .join("\n")
                .replace(/\n{3,}/g, "\n\n")
                .trim();
            const keepNormativeBody = (value = "") => {
                const source = String(value || "");
                const primaryArticleMatches = [
                    /\bArt\.?\s*1\s*[º°o.]?\s+O\b/i,
                    /\bArtigo\s+1\s*[º°o.]?\s+O\b/i
                ]
                    .map((pattern) => source.search(pattern))
                    .filter((index) => index >= 0);

                if (!primaryArticleMatches.length) {
                    return source;
                }

                const start = Math.min(...primaryArticleMatches);
                const preface = source
                    .slice(0, start)
                    .normalize("NFD")
                    .replace(/[\u0300-\u036f]/g, "")
                    .toLowerCase();

                if (
                    start > 280 ||
                    /(procedencia|natureza|alterada pelas leis|revogada parcialmente|adi|decreto|governador|faco saber|assembleia legislativa)/i.test(preface)
                ) {
                    return source.slice(start);
                }

                return source;
            };
            const studyText = keepNormativeBody(clean);
            const compactText = studyText.replace(/\n+/g, " ");
            const clipText = (value = "", maxLength = 520) => {
                const candidate = String(value || "").replace(/\s+/g, " ").trim();
                if (candidate.length <= maxLength) {
                    return candidate;
                }

                const clipped = candidate.slice(0, maxLength);
                const boundary = Math.max(
                    clipped.lastIndexOf(". "),
                    clipped.lastIndexOf("; "),
                    clipped.lastIndexOf(", ")
                );

                return `${clipped.slice(0, boundary > maxLength * 0.62 ? boundary + 1 : maxLength).trim()}...`;
            };
            const normalizeForStudy = (value = "") => String(value || "")
                .replace(/\b(?:https?:\/\/|www\.)\S+/gi, "")
                .replace(/\b\S+\.(?:gov|com|org|net|br)(?:\/\S*)?/gi, "")
                .replace(/\(\s*Ver\s+ADI[\s\S]*?\)\s*/gi, "")
                .replace(/\(\s*Decreto Legislativo[\s\S]*?\)\s*/gi, "")
                .replace(/\bADI\s+TJSC\b[^.]*\.\s*/gi, "")
                .replace(/,?\s*conferindo-lhes interpreta[cç][aã]o conforme[^.;)]*(?:[.;)]\s*)?/gi, "")
                .replace(/,?\s*a fim de que tais restri[cç][oõ]es[^.;)]*(?:[.;)]\s*)?/gi, "")
                .replace(/,?\s*com efeitos\s*["']?\s*ex nunc["']?[^.;)]*(?:[.;)]\s*)?/gi, "")
                .replace(/,\s*[IVXLCDM]+\s+e\s+[IVXLCDM]+\s+do\s+art\.?\s*\d+\S*\)?/gi, "")
                .replace(/\bIncidente de Argui[cç][aã]o de Inconstitucionalidade\b[^.]*\.\s*/gi, "")
                .replace(/\bLEI COMPLEMENTAR\s+N[º°]?\s*\d+,\s*de\s*\d+\s+de\s+[a-zç]+\s+de\s+\d{4}/gi, "")
                .replace(/\(\s*Reda\S*(?:\s+\S+){0,24}\s*\)/gi, "")
                .replace(/\(\s*Reda\S*(?:\s+\S+){0,14}/gi, "")
                .replace(/\bArt\s*\d+\S*\s+caput[^)]*dada pela LC[^)]*\)/gi, "")
                .replace(/\b(?:dada|incluida|incluída)\s+pela\s+LC\s+\d+[^);.]*/gi, "")
                .replace(/\(\s*Reda[cç][aã]o[^)]*\)/gi, "")
                .replace(/\(\s*Rev\.\s*\)/gi, "")
                .replace(/\b\d{2}\/\d{2}\/\d{4},?\s*\d{2}:\d{2}\b/g, "")
                .replace(/\b\d{2}\/\d{2}\/\d{4}\b/g, "")
                .replace(/\b\d{1,3}\/\d{1,3}\s+Pagina\s+\d+:?/gi, "")
                .replace(/\bPagina\s+\d+:\s*/gi, "")
                .replace(/\s+/g, " ")
                .trim();
            const isLowValueStudyText = (value = "") => {
                const normalized = normalizeForStudy(value)
                    .normalize("NFD")
                    .replace(/[\u0300-\u036f]/g, "")
                    .toLowerCase();

                if (!normalized) {
                    return true;
                }

                if (/^(fonte|procedencia|natureza|timestamp|versao compilada|do:|url:)/i.test(normalized)) {
                    return true;
                }

                if (
                    /^(art\.?\s*\d+\S*,?\s*)?(conferindo-lhes interpretacao|inciso xxv do artigo|artigo\s+\d+\S*\)|da cesc, com efeitos|i, da cesc)/i.test(normalized) ||
                    /\b(adi tjsc|incidente de arguicao de inconstitucionalidade|efeitos ex nunc|julgada procedente|decreto legislativo)\b/i.test(normalized)
                ) {
                    return true;
                }

                return Boolean(
                    normalized.length > 180 &&
                    /(alterada pelas leis|revogada parcialmente|decretos:|governador do estado|faco saber|assembleia legislativa)/i.test(normalized) &&
                    !/\bart\.?\s*\d+/.test(normalized)
                );
            };
            const splitStudyText = (value = "", options = {}) => {
                const maxItems = Math.max(1, Number(options.maxItems || 4));
                const maxLength = Math.max(140, Number(options.maxLength || 520));
                const normalized = normalizeForStudy(value);

                if (!normalized || isLowValueStudyText(normalized)) {
                    return [];
                }

                const articleParts = normalized
                    .split(/(?=\b(?:Art\.?|Artigo)\s*\d+\s*(?:[º°o.]|\.|º)?\s+(?:O|A|As|Os|No|Na|Fica|S[ãÃ]o|Para|Ao)\b)/i)
                    .map((part) => normalizeForStudy(part))
                    .filter((part) => part.length >= 42 && !isLowValueStudyText(part));
                const sourceParts = articleParts.length > 1 ? articleParts : [normalized];
                const result = [];

                sourceParts.forEach((part) => {
                    if (result.length >= maxItems) {
                        return;
                    }

                    const sentences = part
                        .split(/(?:\.\s+|;\s+(?=(?:[A-Z0-9]|\(?[a-z]\))))/)
                        .map((sentence) => normalizeForStudy(sentence))
                        .filter((sentence) => sentence.length >= 34);

                    if (part.length <= maxLength || sentences.length <= 1) {
                        result.push(clipText(part, maxLength));
                        return;
                    }

                    let buffer = "";
                    sentences.forEach((sentence) => {
                        if (result.length >= maxItems) {
                            return;
                        }

                        const next = buffer ? `${buffer}. ${sentence}` : sentence;
                        if (next.length <= maxLength) {
                            buffer = next;
                            return;
                        }

                        if (buffer) {
                            result.push(clipText(buffer, maxLength));
                        }
                        buffer = sentence;
                    });

                    if (buffer && result.length < maxItems) {
                        result.push(clipText(buffer, maxLength));
                    }
                });

                return result.filter(Boolean).slice(0, maxItems);
            };
            const articleUnits = compactText
                .split(/(?=\b(?:Art\.?|Artigo)\s*\d+\s*(?:[º°o.]|\.|º)?\s+(?:O|A|As|Os|No|Na|Fica|S[ãÃ]o|Para|Ao)\b)/i)
                .map((part) => normalizeForStudy(part))
                .filter((part) => part.length >= 70 && /\b(?:Art\.?|Artigo)\s*\d+/i.test(part) && !isLowValueStudyText(part));
            const paragraphs = [
                ...articleUnits,
                ...studyText
                    .split(/\n{2,}|(?=Pagina\s+\d+:)/i)
                    .map((part) => normalizeForStudy(part))
                    .filter((part) => part.length >= 70 && !isLowValueStudyText(part))
            ];
            const studyUnits = articleUnits.length >= 4
                ? articleUnits
                : paragraphs.flatMap((part) => splitStudyText(part, { maxItems: 3, maxLength: 620 }));
            const articleMatches = studyUnits
                .map((part) => (String(part || "").match(/\b(?:Art\.?|Artigo)\s*\d+\S*/i) || [String(part || "").slice(0, 90)])[0])
                .filter(Boolean);
            const accessTier = String(state.accessTier || (state.premiumActive ? "premium" : "free")).toLowerCase();
            const premiumLike = accessTier === "premium";
            const pageCount = Math.max(0, Number(options.pageCount || state.materialPageCount || 0));
            const seeds = (studyUnits.length ? studyUnits : paragraphs).slice(0, premiumLike ? 72 : 40);
            const sourceCount = Math.max(1, seeds.length);
            let desiredBlocks = Math.ceil(sourceCount / (premiumLike ? 4 : 5));

            if (premiumLike) {
                if (pageCount >= 120) {
                    desiredBlocks = Math.max(desiredBlocks, 12);
                } else if (pageCount >= 80) {
                    desiredBlocks = Math.max(desiredBlocks, 10);
                } else if (pageCount >= 40) {
                    desiredBlocks = Math.max(desiredBlocks, 8);
                } else if (pageCount >= 16) {
                    desiredBlocks = Math.max(desiredBlocks, 6);
                } else {
                    desiredBlocks = Math.max(desiredBlocks, 4);
                }
            } else {
                if (pageCount >= 8) {
                    desiredBlocks = Math.max(desiredBlocks, 3);
                }
            }

            desiredBlocks = Math.max(
                premiumLike ? 4 : 2,
                Math.min(
                    premiumLike ? 12 : 8,
                    Math.min(sourceCount, desiredBlocks)
                )
            );

            const chunkSize = Math.max(1, Math.ceil(sourceCount / desiredBlocks));
            const blocks = [];
            const warnings = [];
            const genericTitle = (index) => `Bloco ${index + 1}: estudo guiado`;

            const normalizeTitleCandidate = (value = "") => String(value || "")
                .replace(/^Pagina\s+\d+:\s*/i, "")
                .replace(/^#+\s*/g, "")
                .replace(/^[-*]\s+/g, "")
                .replace(/^\d+\.\s+/g, "")
                .replace(/`/g, "")
                .replace(/\[(.*?)\]\([^)]*\)/g, "$1")
                .replace(/\s+/g, " ")
                .trim();
            const isBadTitleCandidate = (value = "") => {
                const candidate = normalizeTitleCandidate(value);
                if (!candidate || candidate.length < 12) {
                    return true;
                }

                const wordCount = candidate.split(/\s+/).filter(Boolean).length;
                const punctuationHits = (candidate.match(/[;|]/g) || []).length;

                if (
                    candidate.length > 92 ||
                    wordCount > 14 ||
                    punctuationHits > 0 ||
                    /^[A-Za-z]:\\/.test(candidate) ||
                    /^https?:\/\//i.test(candidate) ||
                    /^(fonte:|timestamp:|my request|context from my ide setup|sessao|arquivos salvos|plano de expans[aã]o|chat recuperado|open tabs|my request for codex|files mentioned by the user|vis[aã]o do bloco|minha opini[aã]o|subi para a web)/i.test(candidate) ||
                    /^(\d+\.\s*)?(usu[aá]rio|assistente|resumo compactado)\b/i.test(candidate) ||
                    /(codex|request for codex|chat recuperado|restore point|rollout-\d{4}|browser|workspace sujo|git status)/i.test(candidate) ||
                    /\b(vou|posso|quero|preciso|acho|achei|use|rodar|continuar|valida[cç][aã]o|corrigir|subi)\b/i.test(candidate)
                ) {
                    return true;
                }

                return false;
            };
            const looksLikeStrongTitle = (value = "") => {
                const candidate = normalizeTitleCandidate(value);
                if (isBadTitleCandidate(candidate)) {
                    return false;
                }

                const words = candidate.split(/\s+/).filter(Boolean);
                if (words.length < 2 || words.length > 10) {
                    return false;
                }

                if (/[.!?].+\s/.test(candidate)) {
                    return false;
                }

                return true;
            };
            const compactTitleCandidate = (value = "") => {
                const candidate = normalizeTitleCandidate(value);
                if (!candidate) {
                    return "";
                }

                const clipped = candidate
                    .split(/(?<=[.:;!?])\s+/)[0]
                    .split(/\s+/)
                    .slice(0, 9)
                    .join(" ")
                    .trim();

                return clipped.replace(/[,:;.-]+$/g, "").trim();
            };
            const extractStructuredTitle = (line = "") => {
                const trimmed = String(line || "").trim();
                if (!trimmed) {
                    return "";
                }

                const boldBullet = trimmed.match(/^[-*]\s+\*\*([^*]{4,90})\*\*(?::|\s|$)/);
                if (boldBullet) {
                    return boldBullet[1];
                }

                const numberedBlock = trimmed.match(/^(?:[-*]\s+)?(Bloco|Etapa|Fase|Parte|Modulo|M[oó]dulo|Cap[ií]tulo|Tema|T[oó]pico)\s+\d+\s*:\s*(.+)$/i);
                if (numberedBlock) {
                    return `${numberedBlock[1]} ${numberedBlock[2]}`;
                }

                if (/^#{1,6}\s+/.test(trimmed)) {
                    return trimmed.replace(/^#{1,6}\s+/, "");
                }

                const labelLine = trimmed.match(/^([A-ZÀ-Ý][^:]{4,70}):\s+.+$/);
                if (labelLine) {
                    return labelLine[1];
                }

                return "";
            };
            const structuredTitleCandidates = [...new Set(
                rawLines
                    .map((line) => extractStructuredTitle(line))
                    .map((line) => compactTitleCandidate(line))
                    .filter((line) => looksLikeStrongTitle(line))
            )];
            const chatLikeSignals = rawLines.slice(0, 220).reduce((score, line) => {
                if (/^(#{1,6}\s+)?(context from my ide setup|open tabs|my request for codex|chat recuperado|sessao|usu[aá]rio|assistente)\b/i.test(line)) {
                    return score + 2;
                }

                if (/_timestamp:|^fonte:\s+[a-z]:\\|^-\s+(id|cwd|origem):/i.test(line)) {
                    return score + 1;
                }

                return score;
            }, 0);
            const chatLikeContent = chatLikeSignals >= 8;
            const structuredTitleForBlock = (index) => {
                if (!structuredTitleCandidates.length) {
                    return "";
                }

                const candidateIndex = Math.min(
                    structuredTitleCandidates.length - 1,
                    Math.floor((index / Math.max(1, desiredBlocks)) * structuredTitleCandidates.length)
                );

                return structuredTitleCandidates[candidateIndex] || "";
            };
            const titleFrom = (items, index) => {
                const articleSource = items.find((item) => /\b(?:Art\.?|Artigo)\s*\d+/i.test(String(item || ""))) || "";
                const article = String(articleSource).match(/\b(?:Art\.?|Artigo)\s*\d+/i);
                if (article) {
                    return `${article[0].replace(/Artigo/i, "Art.")}: leitura guiada`;
                }

                if (chatLikeContent) {
                    return genericTitle(index);
                }

                const structured = structuredTitleForBlock(index);
                if (structured) {
                    return structured;
                }

                const preferredCandidate = [
                    ...items,
                    paragraphs[index],
                    paragraphs[index + 1],
                    materialName
                ]
                    .map((item) => normalizeTitleCandidate(item))
                    .find((item) => !isBadTitleCandidate(item));

                const compact = compactTitleCandidate(preferredCandidate);
                if (compact) {
                    return compact;
                }

                return genericTitle(index);
            };
            const articleLabelFrom = (value = "", fallback = "Dispositivo") => {
                const match = String(value || "").match(/\b(?:Art\.?|Artigo)\s*\d+\S*/i);
                return match ? match[0].replace(/Artigo/i, "Art.") : fallback;
            };
            const stripArticleLead = (value = "") => normalizeForStudy(value)
                .replace(/^\b(?:Art\.?|Artigo)\s*\d+\s*(?:[º°o.]|\.|º)?\.?\s*/i, "")
                .replace(/^[:.-]\s*/, "")
                .trim();
            const studyItemFrom = (value = "", maxLength = 220) => {
                const [first] = splitStudyText(value, { maxItems: 1, maxLength });
                return first || clipText(normalizeForStudy(value), maxLength);
            };
            const uniqueOptions = (items = []) => {
                const seen = new Set();
                return items
                    .map((item) => normalizeForStudy(item))
                    .filter((item) => {
                        const key = item.toLowerCase();
                        if (!item || seen.has(key)) {
                            return false;
                        }
                        seen.add(key);
                        return true;
                    });
            };
            const finalizeQuestion = ({ prompt, correct, distractors, rationale }, seed = 0) => {
                const fallbackDistractors = [
                    "O dispositivo trata apenas de orientacao administrativa sem efeito para o militar estadual.",
                    "O trecho elimina a necessidade de observar requisitos, excecoes ou situacoes previstas em lei.",
                    "A regra se aplica somente por analogia, sem depender do texto do Estatuto.",
                    "O ponto central e apenas memorizar o numero do artigo, sem compreender seu comando."
                ];
                const options = uniqueOptions([
                    correct,
                    ...(Array.isArray(distractors) ? distractors : []),
                    ...fallbackDistractors
                ]).slice(0, 4);

                while (options.length < 4) {
                    options.push(fallbackDistractors[options.length - 1] || "A afirmacao nao corresponde ao comando do dispositivo.");
                }

                const correctText = options[0];
                const offset = Math.max(0, Number(seed) || 0) % 4;
                const rotated = options.slice(1);
                rotated.splice(offset, 0, correctText);

                return {
                    prompt,
                    options: rotated,
                    correctIndex: offset,
                    rationale
                };
            };
            const makeLegalQuestion = (topic, seed = 0) => {
                const text = normalizeForStudy(topic);
                const body = stripArticleLead(text);
                const label = articleLabelFrom(text, "O dispositivo");
                const lower = body
                    .normalize("NFD")
                    .replace(/[\u0300-\u036f]/g, "")
                    .toLowerCase();
                const variant = Math.max(0, Number(seed) || 0) % 3;

                if (/regula as obrigacoes, os deveres, os direitos/.test(lower)) {
                    const variants = [
                        {
                            prompt: `Segundo o ${label}, o que o Estatuto regula?`,
                            correct: "As obrigacoes, os deveres, os direitos, as prerrogativas e as situacoes dos policiais-militares de Santa Catarina.",
                            distractors: [
                                "Somente os procedimentos de ingresso nos cursos de formacao.",
                                "Apenas a remuneracao dos militares estaduais da ativa.",
                                "Exclusivamente a estrutura administrativa da Secretaria de Seguranca."
                            ],
                            rationale: `${label} apresenta o alcance geral do Estatuto.`
                        },
                        {
                            prompt: `Qual e o alcance material indicado pelo ${label}?`,
                            correct: "O Estatuto cobre deveres, direitos, prerrogativas, obrigacoes e situacoes dos policiais-militares estaduais.",
                            distractors: [
                                "O Estatuto cobre apenas beneficios financeiros e licencas.",
                                "O Estatuto trata somente da organizacao interna da Assembleia Legislativa.",
                                "O Estatuto se limita a normas de transito e policiamento ostensivo."
                            ],
                            rationale: `${label} lista os grupos de materias regulados pelo Estatuto.`
                        },
                        {
                            prompt: `Ao estudar o ${label}, qual conjunto nao pode ficar fora da resposta?`,
                            correct: "Obrigacoes, deveres, direitos, prerrogativas e situacoes dos policiais-militares.",
                            distractors: [
                                "Apenas forma de ingresso, matricula e curriculo de cursos.",
                                "Somente penalidades criminais comuns aplicaveis a civis.",
                                "Exclusivamente normas de contratacao de temporarios civis."
                            ],
                            rationale: `${label} e uma porta de entrada para o campo de aplicacao do Estatuto.`
                        }
                    ];
                    return finalizeQuestion(variants[variant], seed);
                }

                if (/policia militar.*instituicao permanente|manutencao da ordem publica|reserva do exercito/.test(lower)) {
                    const variants = [
                        {
                            prompt: `Qual afirmativa corresponde ao ${label} sobre a Policia Militar?`,
                            correct: "E uma instituicao permanente, baseada em hierarquia e disciplina, destinada a manutencao da ordem publica e considerada forca auxiliar, Reserva do Exercito.",
                            distractors: [
                                "E uma instituicao temporaria, criada apenas para missoes eventuais de seguranca privada.",
                                "Atua sem subordinacao operacional e sem base em hierarquia ou disciplina.",
                                "Tem finalidade exclusiva de defesa civil, sem relacao com manutencao da ordem publica."
                            ],
                            rationale: `${label} define a natureza institucional e a finalidade da Policia Militar.`
                        },
                        {
                            prompt: `Quais sao as bases organizacionais da Policia Militar no ${label}?`,
                            correct: "Hierarquia e disciplina, dentro de uma instituicao permanente.",
                            distractors: [
                                "Autonomia individual e ausencia de subordinacao operacional.",
                                "Eleicao interna dos postos e rotatividade sem carreira.",
                                "Vinculo temporario sem estrutura hierarquica."
                            ],
                            rationale: `${label} fixa hierarquia e disciplina como bases de organizacao.`
                        },
                        {
                            prompt: `Qual finalidade institucional aparece no ${label}?`,
                            correct: "Manutencao da ordem publica na area do Estado, com consideracao como forca auxiliar e Reserva do Exercito.",
                            distractors: [
                                "Prestacao exclusiva de seguranca privada a orgaos conveniados.",
                                "Defesa civil sem qualquer relacao com ordem publica.",
                                "Administracao de politicas educacionais estaduais."
                            ],
                            rationale: `${label} conecta a finalidade da PM a ordem publica e ao papel de forca auxiliar.`
                        }
                    ];
                    return finalizeQuestion(variants[variant], seed);
                }

                if (/denominados militares estaduais|na ativa|na inatividade/.test(lower)) {
                    const variants = [
                        {
                            prompt: `De acordo com o ${label}, como o Estatuto enquadra os integrantes da PMSC e do CBMSC?`,
                            correct: "Eles sao denominados militares estaduais e podem estar na ativa ou na inatividade, conforme as situacoes previstas no dispositivo.",
                            distractors: [
                                "Sao tratados como servidores civis comuns, sem situacoes proprias de carreira militar.",
                                "Sao sempre considerados temporarios, independentemente do vinculo ou da situacao funcional.",
                                "Ficam automaticamente desligados quando deixam o servico ativo."
                            ],
                            rationale: `${label} organiza a denominacao e as situacoes funcionais dos militares estaduais.`
                        },
                        {
                            prompt: `Qual denominacao o ${label} atribui aos integrantes da PMSC e do CBMSC?`,
                            correct: "Militares estaduais, em razao da destinacao constitucional das corporacoes e da legislacao especifica.",
                            distractors: [
                                "Servidores administrativos estaduais sem regime militar.",
                                "Agentes civis de seguranca contratados temporariamente.",
                                "Colaboradores voluntarios sem situacao funcional propria."
                            ],
                            rationale: `${label} explica a denominacao a partir da destinacao constitucional e da legislacao especifica.`
                        },
                        {
                            prompt: `Quais situacoes funcionais aparecem no ${label}?`,
                            correct: "Na ativa e na inatividade, com subdivisoes previstas no proprio dispositivo.",
                            distractors: [
                                "Apenas em treinamento, sem vinculo com ativa ou inatividade.",
                                "Somente em disponibilidade civil ou contrato temporario.",
                                "Exclusivamente em licenca particular sem remuneracao."
                            ],
                            rationale: `${label} organiza a situacao dos militares estaduais em ativa e inatividade.`
                        }
                    ];
                    return finalizeQuestion(variants[variant], seed);
                }

                if (/servico policial-militar consiste|atividades inerentes/.test(lower)) {
                    return finalizeQuestion({
                        prompt: `O que o ${label} considera servico policial-militar?`,
                        correct: "O exercicio de atividades inerentes a Policia Militar, abrangendo encargos previstos na legislacao especifica relacionados a manutencao da ordem publica.",
                        distractors: [
                            "Somente atividades internas sem relacao com manutencao da ordem publica.",
                            "Apenas tarefas administrativas exercidas por servidores civis.",
                            "Qualquer atividade particular feita por militar fora do servico."
                        ],
                        rationale: `${label} liga o servico policial-militar as atividades inerentes a instituicao.`
                    }, seed);
                }

                if (/carreira de oficial.*privativa de brasileiro nato/.test(lower)) {
                    return finalizeQuestion({
                        prompt: `Segundo o ${label}, quem pode ocupar a carreira de Oficial da Policia Militar?`,
                        correct: "A carreira de Oficial da Policia Militar e privativa de brasileiro nato.",
                        distractors: [
                            "Qualquer brasileiro nato ou naturalizado, sem distincao.",
                            "Somente militares temporarios convocados para funcao especifica.",
                            "Apenas integrantes da reserva remunerada."
                        ],
                        rationale: `${label} traz uma restricao expressa para a carreira de Oficial.`
                    }, seed);
                }

                if (/sao equivalentes as expressoes|na ativa|em atividade|servico ativo/.test(lower)) {
                    return finalizeQuestion({
                        prompt: `Qual e o ponto central do ${label} sobre as expressoes ligadas ao servico ativo?`,
                        correct: "As expressoes na ativa, em atividade e em servico ativo sao equivalentes quando ligadas ao desempenho de cargo, missao, servico ou atividade policial-militar.",
                        distractors: [
                            "Cada expressao cria uma categoria juridica sem relacao com as demais.",
                            "As expressoes so valem para militares reformados.",
                            "A equivalencia depende de autorizacao individual do comandante para cada caso."
                        ],
                        rationale: `${label} evita confusao terminologica sobre a situacao de atividade.`
                    }, seed);
                }

                if (/condicao juridica.*definida/.test(lower)) {
                    return finalizeQuestion({
                        prompt: `Conforme o ${label}, onde se define a condicao juridica dos policiais-militares?`,
                        correct: "Nos dispositivos constitucionais aplicaveis, no Estatuto e na legislacao que outorga direitos e prerrogativas e impoe deveres e obrigacoes.",
                        distractors: [
                            "Apenas em ordens internas sem relacao com a Constituicao ou a lei.",
                            "Exclusivamente por decisao administrativa momentanea.",
                            "Somente no regulamento disciplinar, sem outras fontes normativas."
                        ],
                        rationale: `${label} aponta as fontes normativas da condicao juridica.`
                    }, seed);
                }

                if (/circulos hierarquicos|escala hierarquica|posto|graduacao/.test(lower)) {
                    return finalizeQuestion({
                        prompt: `Qual tema e organizado pelo ${label}?`,
                        correct: clipText(body, 260),
                        distractors: [
                            "A extincao da hierarquia entre oficiais e pracas.",
                            "A transformacao de todos os graus hierarquicos em cargos civis.",
                            "A dispensa de precedencia e respeito mutuo nos circulos militares."
                        ],
                        rationale: `${label} trata da organizacao hierarquica e seus efeitos.`
                    }, seed);
                }

                if (/cargo policial-militar|funcao policial|atribuicoes, deveres/.test(lower)) {
                    return finalizeQuestion({
                        prompt: `Sobre cargo ou funcao policial-militar, qual alternativa corresponde ao ${label}?`,
                        correct: clipText(body, 260),
                        distractors: [
                            "O cargo policial-militar pode ser exercido por qualquer pessoa sem vinculo ao servico ativo.",
                            "As atribuicoes do cargo independem do grau hierarquico do titular.",
                            "A funcao policial-militar nao gera deveres, responsabilidade ou atribuicoes."
                        ],
                        rationale: `${label} delimita cargo, funcao, atribuicoes e responsabilidades.`
                    }, seed);
                }

                return finalizeQuestion({
                    prompt: `Qual alternativa resume corretamente o ${label}?`,
                    correct: clipText(body || text, 260),
                    distractors: [
                        "O dispositivo cria regra sem relacao com a organizacao policial-militar.",
                        "O trecho afasta requisitos, excecoes e consequencias expressas no Estatuto.",
                        "A norma trata apenas de recomendacao de estudo, sem conteudo juridico cobravel."
                    ],
                    rationale: `${label} deve ser lido pelo comando normativo que ele estabelece.`
                }, seed);
            };
            const preparePracticeSources = (items = [], title = "") => {
                const baseSources = (items.length ? items : [title])
                    .map((item) => String(item || "").trim())
                    .filter(Boolean);
                const granularSources = baseSources
                    .flatMap((item) => splitStudyText(item, { maxItems: 8, maxLength: 420 }))
                    .map((item) => String(item || "").trim())
                    .filter(Boolean);

                if (granularSources.length) {
                    return granularSources;
                }

                return baseSources.length ? baseSources : ["Conteudo do bloco"];
            };
            const rotateSources = (items = [], offset = 0) => {
                if (!items.length) {
                    return items;
                }

                const safeOffset = offset % items.length;
                return items.slice(safeOffset).concat(items.slice(0, safeOffset));
            };
            const buildQuestionSeries = (items = [], title = "") => {
                const questionSources = preparePracticeSources(items, title);
                return Array.from({ length: 3 }, (_, seriesIndex) => (
                    Array.from({ length: 3 }, (unused, questionIndex) => {
                        const sourceIndex = (seriesIndex + questionIndex) % questionSources.length;
                        return makeLegalQuestion(questionSources[sourceIndex], (seriesIndex * 3) + questionIndex);
                    })
                ));
            };
            const buildTrueFalseItems = (items = [], title = "") => {
                const trueFalseSources = preparePracticeSources(items, title);
                const first = trueFalseSources[0] || title;
                const second = trueFalseSources[1] || first;
                const third = trueFalseSources[2] || second;

                return [
                    {
                        statement: `${articleLabelFrom(first, "O dispositivo")} estabelece: ${clipText(stripArticleLead(first), 190)}`,
                        answer: true,
                        rationale: "A afirmacao reproduz o comando central do trecho."
                    },
                    {
                        statement: `${articleLabelFrom(second, "O dispositivo")} elimina a necessidade de observar requisitos, excecoes ou situacoes previstas no Estatuto.`,
                        answer: false,
                        rationale: "O Estatuto trabalha justamente com comandos, requisitos, excecoes e situacoes expressas."
                    },
                    {
                        statement: `${articleLabelFrom(third, "O dispositivo")} deve ser interpretado conforme o sujeito, a situacao e o efeito juridico indicados no proprio texto.`,
                        answer: true,
                        rationale: "Em lei, sujeito, situacao e efeito mudam a resposta da questao."
                    }
                ];
            };
            const buildFlashcards = (items = [], title = "") => preparePracticeSources(items, title).slice(0, 3).map((item) => ({
                front: articleLabelFrom(item, "Dispositivo"),
                back: clipText(stripArticleLead(item), 260),
                tip: "Recupere sujeito, comando e excecoes antes de responder."
            }));
            const buildMemoryDeck = (items = [], title = "") => preparePracticeSources(items, title).slice(0, 4).map((item) => {
                const label = articleLabelFrom(item, "Trecho");
                const criterion = clipText(stripArticleLead(item), 240);

                return {
                    front: `${label}: qual criterio preciso recuperar?`,
                    back: criterion ? `Criterio: ${criterion}` : "Criterio: identifique sujeito, comando e efeito antes de aplicar ao caso.",
                    cue: "Procure sujeito, comando, condicao e excecao."
                };
            });
            const moduleFromSource = (value = "", moduleIndex = 0) => {
                const label = articleLabelFrom(value, `Ponto ${moduleIndex + 1}`);
                const paragraphs = splitStudyText(value, { maxItems: 3, maxLength: 560 });

                if (!paragraphs.length) {
                    return null;
                }

                return {
                    title: `${label}: comando central`,
                    objective: "Entender o dispositivo e o que ele muda na resposta.",
                    paragraphs: paragraphs.map((paragraph) => {
                        const hasArticle = /\b(?:Art\.?|Artigo)\s*\d+/i.test(paragraph);
                        const withoutLooseNumber = String(paragraph || "")
                            .replace(/^\d+\s*(?:[º°o.]|\.|º)?\s*/i, "")
                            .trim();
                        return hasArticle
                            ? paragraph
                            : `${label}: ${withoutLooseNumber || paragraph}`;
                    }),
                    takeaways: paragraphs.map((paragraph) => studyItemFrom(paragraph, 170)).filter(Boolean).slice(0, 4)
                };
            };

            for (let index = 0; index < desiredBlocks; index += 1) {
                const chunk = seeds.slice(index * chunkSize, (index + 1) * chunkSize);
                const support = paragraphs.slice(index * 3, index * 3 + 4);
                const source = (chunk.length ? chunk : support).slice(0, premiumLike ? 5 : 3);
                const title = titleFrom(source, index);
                const concepts = source
                    .map((item) => studyItemFrom(item, 220))
                    .filter(Boolean);
                const lessonModules = source
                    .map((item, sourceIndex) => moduleFromSource(item, sourceIndex))
                    .filter(Boolean)
                    .slice(0, premiumLike ? 4 : 3);
                const lessonParagraphs = lessonModules.length
                    ? lessonModules.flatMap((module) => module.paragraphs).slice(0, 6)
                    : (support.length
                        ? support.flatMap((item) => splitStudyText(item, { maxItems: 2, maxLength: 560 })).slice(0, 4)
                        : [concepts.join(" ").slice(0, 900)]);
                const examFocus = [
                    "Identificar o comando literal do dispositivo antes de aplicar conhecimento geral.",
                    "Separar regra, excecao, requisito e consequencia.",
                    "Observar palavras de limite, condicao e remissao entre artigos."
                ];
                const practiceSources = preparePracticeSources(source, title);
                const quizSeries = buildQuestionSeries(practiceSources, title);
                const quizQuestions = quizSeries[0];
                const trueFalseItems = buildTrueFalseItems(practiceSources, title);
                const flashcards = buildFlashcards(practiceSources, title);

                blocks.push({
                    id: `local-block-${index + 1}`,
                    title,
                    subtitle: `Recorte ${index + 1} de ${desiredBlocks} extraido do documento.`,
                    duration: index === 0 ? "25 min" : "20 min",
                    topics: concepts,
                    learn: {
                        summary: lessonParagraphs.join(" ").slice(0, 1000),
                        intro: "Recorte organizado do texto extraido com foco no que tende a virar criterio de prova.",
                        lessonModules,
                        documentSections: [{
                            id: `local-section-${index + 1}`,
                            type: "summary",
                            label: "Aula",
                            title,
                            paragraphs: lessonParagraphs,
                            items: concepts.slice(0, 5)
                        }],
                        keyConcepts: concepts.slice(0, 6),
                        hotPoints: concepts.slice(0, 4),
                        examFocus,
                        pitfalls: ["Responder por conhecimento geral sem voltar ao trecho.", "Ignorar palavras de limite, condicao ou excecao."],
                        practicalCases: concepts.slice(0, 2).map((item) => `Como aplicar em prova: leia o dispositivo, marque o sujeito alcancado e confira se ha excecao ou condicao no trecho "${item}".`),
                        connections: concepts.slice(1, 4),
                        memoryAnchors: concepts.slice(0, 3),
                        mnemonics: [{ title: "Leitura segura", formula: "Texto -> criterio -> aplicacao", explanation: "Leia o trecho, identifique o criterio e so depois aplique ao caso." }],
                        memoryDeck: buildMemoryDeck(concepts, title),
                        masteryChecklist: ["Localizo o trecho central.", "Explico a regra com minhas palavras.", "Separo regra e excecao.", "Aplico o criterio em uma questao."],
                        explainBetter: { title: `Explicando ${title}`, paragraphs: lessonParagraphs },
                        reviewInFivePoints: concepts.slice(0, 5)
                    },
                    practice: {
                        quiz: quizQuestions,
                        quizSeries,
                        trueFalse: trueFalseItems,
                        trueFalseSeries: [
                            trueFalseItems,
                            buildTrueFalseItems(rotateSources(practiceSources, 1), title),
                            buildTrueFalseItems(rotateSources(practiceSources, 2), title)
                        ],
                        flashcards,
                        flashcardSeries: [
                            flashcards,
                            buildFlashcards(rotateSources(practiceSources, 1), title),
                            buildFlashcards(rotateSources(practiceSources, 2), title)
                        ]
                    },
                    exam: { baseCount: 3, questions: quizQuestions }
                });
            }

            if (paragraphs.length < 3) {
                warnings.push("A base textual extraida ficou curta; a trilha pode ter recortes mais rasos do que o material original.");
            }

            if (!articleMatches.length && clean.length < 2500) {
                warnings.push("O documento trouxe pouco texto estruturado. Revise a cobertura antes de assumir que todo o material foi lido.");
            }

            if (premiumLike && pageCount >= 80 && blocks.length <= 6) {
                warnings.push("Mesmo com material longo, a base textual aproveitavel ficou curta para abrir muitos blocos. Revise a cobertura antes de seguir.");
            }

            return {
                title: materialName,
                warnings,
                coverage: {
                    summary: `Trilha local montada a partir do texto extraido para nao deixar o material sem rota inicial.`,
                    sourceQuality: warnings.length >= 2 ? "limitada" : warnings.length ? "media" : "alta",
                    frontsCovered: blocks.map((block) => block.title).filter(Boolean).slice(0, 6),
                    possibleGaps: warnings.slice(0, 4)
                },
                blocks
            };
        },

        hasMeaningfulStudyProgress() {
            const store = window.PremiumStudyStore;

            if (!store || typeof store.getOverallProgress !== "function") {
                return false;
            }

            const progress = store.getOverallProgress();
            return Boolean(progress && Number(progress.completed || 0) > 0);
        },

        hasGeneratedStudyModes() {
            const store = window.PremiumStudyStore;
            const state = store.getState();
            return Array.isArray(state.blocks) && state.blocks.some((block) => block && block.generatedByAi);
        },

        snapshotHasGeneratedStudy(snapshot = {}) {
            const aiGeneration = snapshot.aiGeneration || {};
            const status = String(aiGeneration.status || "");
            const localLike =
                status === "base_ready_local" ||
                aiGeneration.bundleKind === "local_fallback" ||
                aiGeneration.model === "extracted-text-fallback" ||
                aiGeneration.provider === "local";
            const suspiciousTitles = Array.isArray(snapshot.blocks)
                ? snapshot.blocks.some((block) => isSuspiciousGeneratedTitle(block && block.title))
                : false;

            if (
                suspiciousTitles &&
                aiGeneration.localBundleVersion !== LOCAL_BUNDLE_VERSION
            ) {
                return false;
            }

            if (
                snapshot.blocks.some((block) => block && block.generatedByAi) &&
                LEGACY_AI_PROMPT_VERSIONS.has(String(aiGeneration.promptVersion || ""))
            ) {
                return false;
            }

            if (localLike) {
                if (aiGeneration.localBundleVersion !== LOCAL_BUNDLE_VERSION) {
                    return false;
                }
            }

            return Boolean(
                snapshot &&
                snapshot.materialHash &&
                Array.isArray(snapshot.blocks) &&
                (
                    snapshot.blocks.some((block) => block && block.generatedByAi) ||
                    ["base_ready", "base_ready_local", "reused_same_material"].includes(status)
                )
            );
        },

        applyReusableMaterialSnapshot(reusable, options = {}) {
            if (!reusable) {
                return {
                    ok: false,
                    status: "cache_miss"
                };
            }

            const store = window.PremiumStudyStore;
            const state = store.getState();

            store.applyGeneratedBundle({
                title: reusable.studyTitle || reusable.materialName || state.studyTitle || state.materialName,
                blocks: reusable.blocks || [],
                warnings: Array.isArray(reusable.aiGeneration && reusable.aiGeneration.warnings)
                    ? reusable.aiGeneration.warnings.slice()
                    : [],
                coverage: reusable.aiGeneration && reusable.aiGeneration.coverage
                    ? JSON.parse(JSON.stringify(reusable.aiGeneration.coverage))
                    : null
            });

            if (reusable.materialExtractedText) {
                store.setMaterialExtraction({
                    text: reusable.materialExtractedText,
                    status: reusable.materialExtractionStatus || "cached_snapshot_text",
                    pageCount: reusable.materialPageCount || state.materialPageCount || 0
                });
            }

            store.patch({
                aiGeneration: {
                    status: "reused_same_material",
                    provider: "local-cache",
                    model: "material-hash",
                    promptVersion: reusable.aiGeneration && reusable.aiGeneration.promptVersion
                        ? reusable.aiGeneration.promptVersion
                        : (window.PremiumStudyAI ? window.PremiumStudyAI.PROMPT_VERSION : ""),
                    generatedAt: new Date().toISOString(),
                    textLength: String(reusable.materialExtractedText || "").length,
                    source: options.source || "same_material_cache",
                    blockCount: Array.isArray(reusable.blocks) ? reusable.blocks.length : 0,
                    warnings: Array.isArray(reusable.aiGeneration && reusable.aiGeneration.warnings)
                        ? reusable.aiGeneration.warnings.slice()
                        : [],
                    coverage: reusable.aiGeneration && reusable.aiGeneration.coverage
                        ? JSON.parse(JSON.stringify(reusable.aiGeneration.coverage))
                        : null,
                    bundleKind: reusable.aiGeneration && reusable.aiGeneration.bundleKind
                        ? reusable.aiGeneration.bundleKind
                        : "",
                    localBundleVersion: reusable.aiGeneration && reusable.aiGeneration.localBundleVersion
                        ? reusable.aiGeneration.localBundleVersion
                        : ""
                },
                progressLabel: "Reconhecemos este PDF e reaproveitamos a trilha ja preparada para o mesmo material."
            });

            return {
                ok: true,
                status: "reused_same_material",
                snapshot: reusable
            };
        },

        async findReusableMaterialSnapshot(materialHash) {
            const hash = String(materialHash || "").trim();

            if (!hash) {
                return null;
            }

            const store = window.PremiumStudyStore;
            const stateItems = store && typeof store.getState === "function"
                ? store.getState().studyLibrary
                : [];
            let candidates = Array.isArray(stateItems) ? stateItems : [];

            if (window.PremiumStudyStorage && typeof window.PremiumStudyStorage.getStudyLibrary === "function") {
                const localItems = await window.PremiumStudyStorage.getStudyLibrary();
                candidates = window.PremiumStudyLibrary && typeof window.PremiumStudyLibrary.mergeLibraryItems === "function"
                    ? window.PremiumStudyLibrary.mergeLibraryItems(candidates, localItems)
                    : [...candidates, ...(Array.isArray(localItems) ? localItems : [])];
            }

            return candidates
                .map((item) => item && item.snapshot ? item.snapshot : null)
                .filter((snapshot) => snapshot && snapshot.materialHash === hash && this.snapshotHasGeneratedStudy(snapshot))
                .sort((left, right) => Date.parse(right.savedAt || "") - Date.parse(left.savedAt || ""))[0] || null;
        },

        async reuseGeneratedStudyForCurrentMaterial(options = {}) {
            const store = window.PremiumStudyStore;
            const state = store.getState();
            const reusable = await this.findReusableMaterialSnapshot(state.materialHash || "");

            return this.applyReusableMaterialSnapshot(reusable, options);
        },

        async primeMaterialPreparation(options = {}) {
            const store = window.PremiumStudyStore;
            const state = store.getState();
            const materialHash = String(options.materialHash || state.materialHash || "").trim();

            if (!state.materialName) {
                return null;
            }

            if (
                this.materialPreparationPromise &&
                this.materialPreparationKey === materialHash
            ) {
                return this.materialPreparationPromise;
            }

            if (
                this.materialPreparationResult &&
                this.materialPreparationResult.materialHash === materialHash
            ) {
                return this.materialPreparationResult;
            }

            this.materialPreparationKey = materialHash;
            this.materialPreparationPromise = (async () => {
                const latestState = store.getState();
                const extractionOptions = {
                    maxChars: Number(options.maxChars || (latestState.accessTier === "premium" ? 90000 : 30000)) || 30000,
                    maxPages: Number(options.maxPages || (latestState.accessTier === "premium" ? 160 : 12)) || 12,
                    allowAiFallback: false,
                    useCache: true,
                    saveLocalCache: true,
                    cacheWeakLocal: true
                };

                const [reusable] = await Promise.all([
                    materialHash
                        ? this.findReusableMaterialSnapshot(materialHash).catch(() => null)
                        : Promise.resolve(null),
                    this.ensureMaterialText(extractionOptions).catch(() => "")
                ]);

                const result = {
                    materialHash,
                    reusable,
                    extractedTextLength: String(store.getState().materialExtractedText || "").length
                };

                this.materialPreparationResult = result;
                return result;
            })().finally(() => {
                this.materialPreparationPromise = null;
            });

            return this.materialPreparationPromise;
        },

        buildLowQualityPdfNote(step = "mode-select", options = {}) {
            const needsPremium = options.needsPremium === true;

            return {
                step,
                tone: needsPremium ? "info" : "info",
                title: "Ainda nao consegui montar Aprender, Praticar e Prova",
                message: needsPremium
                    ? "O arquivo ainda nao entregou texto suficiente para montar os modos automaticamente. O sistema tenta aproveitar o maximo possivel do material."
                    : "Ainda nao houve texto suficiente para montar os modos automaticamente com este material. O sistema continua tentando aproveitar o maximo possivel do arquivo."
            };
        },

        async runModePreparation(options = {}, task) {
            const store = window.PremiumStudyStore;
            const currentStep = store.getState().step || options.targetStep || "mode-select";
            const preparation = {
                active: true,
                kicker: options.kicker || "Preparando os modos",
                targetStep: options.targetStep || currentStep,
                source: options.source || "",
                title: options.title || "Preparando Aprender, Praticar e Prova",
                message: options.message || "Estamos trabalhando em segundo plano para organizar a versão mais completa do seu estudo.",
                labels: Array.isArray(options.labels) ? options.labels : ["Lendo base", "Montando Aprender", "Montando Praticar", "Montando Prova"],
                progress: Number.isFinite(Number(options.progress)) ? Number(options.progress) : null,
                objectiveIndex: 1,
                objectiveTotal: Array.isArray(options.labels) && options.labels.length ? options.labels.length : 4,
                objectiveLabel: Array.isArray(options.labels) && options.labels.length ? options.labels[0] : "Lendo base",
                startedAt: new Date().toISOString()
            };

            store.setModePreparation(preparation);
            this.startActivityProgress("modePreparation");
            store.setSessionNote({
                step: currentStep,
                tone: "info",
                title: preparation.title,
                message: preparation.message
            });
            this.render();

            try {
                return await task(preparation);
            } finally {
                this.stopActivityProgress("modePreparation");
                if (store.getState().modePreparation && store.getState().modePreparation.active) {
                    store.clearModePreparation();
                }
                this.render();
            }
        },

        async generateBundleFromMaterialText(extractedText, options = {}) {
            const store = window.PremiumStudyStore;
            const state = store.getState();
            const normalizedText = String(extractedText || "").trim();

            if (!normalizedText) {
                return {
                    ok: false,
                    status: "missing_text"
                };
            }

            const dailyMinutes = (Number(state.studyHours) || 0) * 60
                + (Number(state.studyMinutes) || 0);
            const ai = window.PremiumStudyAI;
            const result = ai && typeof ai.request === "function"
                ? await ai.request(ai.TASKS.FREE_BUNDLE_FROM_MATERIAL, {
                    customerId: state.customerId || "",
                    materialHash: state.materialHash || "",
                    materialName: state.materialName || "",
                    pageCount: state.materialPageCount || 0,
                    extractedText: normalizedText,
                    examDate: state.examDate || "",
                    targetScore: state.targetScore || "",
                    dailyMinutes,
                    accessTier: state.accessTier || (state.premiumActive ? "premium" : "free")
                })
                : { ok: false, status: "ai_unavailable" };

            if (result && result.ok && result.bundle) {
                store.applyGeneratedBundle(result);
                this.trackGrowth("ai_bundle_generated", {
                    materialHash: store.getState().materialHash,
                    metadata: {
                        provider: result.provider || "",
                        model: result.model || "",
                        blockCount: result.bundle && result.bundle.blocks ? result.bundle.blocks.length : 0,
                        source: options.source || "material_text"
                    }
                });
            }

            return result;
        },

        async prepareStudyBaseLayer(options = {}) {
            const store = window.PremiumStudyStore;
            const state = store.getState();

            if (!state.materialName) {
                return {
                    ok: false,
                    status: "missing_material"
                };
            }

            if (!options.forceRegenerate && this.hasGeneratedStudyModes()) {
                return {
                    ok: true,
                    status: "already_ready"
                };
            }

            if (!options.forceRegenerate) {
                store.setAnalysisProgress(Math.max(18, Number(store.getState().analysisProgress || 0)), "running");

                const prepared = await this.primeMaterialPreparation({
                    materialHash: state.materialHash || "",
                    maxChars: Number(options.maxChars || (state.accessTier === "premium" ? 90000 : 30000)) || 30000,
                    maxPages: Number(options.maxPages || (state.accessTier === "premium" ? 160 : 12)) || 12
                }).catch(() => null);

                if (prepared && prepared.reusable) {
                    const appliedPrepared = this.applyReusableMaterialSnapshot(prepared.reusable, {
                        source: options.source || "base_layer_prewarm"
                    });

                    if (appliedPrepared && appliedPrepared.ok) {
                        store.setAnalysisProgress(Math.max(92, Number(store.getState().analysisProgress || 0)), "running");
                        return {
                            ok: true,
                            status: appliedPrepared.status || "reused_same_material"
                        };
                    }
                }

                const reused = await this.reuseGeneratedStudyForCurrentMaterial({
                    source: options.source || "base_layer"
                });

                if (reused && reused.ok) {
                    store.setAnalysisProgress(Math.max(92, Number(store.getState().analysisProgress || 0)), "running");
                    return {
                        ok: true,
                        status: reused.status || "reused_same_material"
                    };
                }
            }

            store.setAnalysisProgress(Math.max(18, Number(store.getState().analysisProgress || 0)), "running");
            store.patch({
                progressLabel: "Material recebido. Agora estamos destravando o texto-base antes de organizar a trilha."
            });

            const extractedText = await this.ensureMaterialText({
                maxChars: Number(options.maxChars || (state.accessTier === "premium" ? 90000 : 30000)) || 30000,
                maxPages: Number(options.maxPages || (state.accessTier === "premium" ? 160 : 12)) || 12,
                allowAiFallback: options.allowAiFallback !== false,
                useCache: options.useCache !== false,
                saveLocalCache: options.saveLocalCache !== false,
                cacheWeakLocal: options.cacheWeakLocal !== false,
                syncProgressLabel: options.syncProgressLabel || "Tentando destravar mais texto do material antes de montar a trilha.",
                aiProgressLabel: options.aiProgressLabel || "Tentando ler melhor o material para montar Aprender, Praticar e Prova."
            });

            const normalizedText = String(extractedText || "").trim();
            const summary = this.summarizeMaterialExtraction({
                text: normalizedText,
                pageCount: state.materialPageCount || 0
            }, {
                pageCount: state.materialPageCount || 0
            });

            store.setAnalysisProgress(Math.max(46, Number(store.getState().analysisProgress || 0)), "running");
            store.patch({
                progressLabel: normalizedText
                    ? "Texto-base extraido. Agora estamos separando os eixos do material para montar a trilha."
                    : "Ainda estamos tentando destravar texto suficiente para montar a trilha."
            });

            store.patch({
                aiGeneration: {
                    status: "base_preparing",
                    provider: "",
                    model: "",
                    promptVersion: window.PremiumStudyAI ? window.PremiumStudyAI.PROMPT_VERSION : "",
                    generatedAt: new Date().toISOString(),
                    textLength: summary.textLength,
                    source: options.source || "base_layer"
                }
            });

            if (!normalizedText) {
                store.patch({
                    aiGeneration: {
                        status: "base_missing_text",
                        provider: "",
                        model: "",
                        promptVersion: window.PremiumStudyAI ? window.PremiumStudyAI.PROMPT_VERSION : "",
                        generatedAt: new Date().toISOString(),
                        textLength: 0,
                        source: options.source || "base_layer"
                    }
                });
                return {
                    ok: false,
                    status: "missing_text"
                };
            }

            store.setAnalysisProgress(Math.max(72, Number(store.getState().analysisProgress || 0)), "running");
            store.patch({
                progressLabel: "Texto-base pronto. A IA agora esta montando Aprender, Praticar e Prova em blocos de estudo."
            });

            const bundleResult = await this.generateBundleFromMaterialText(normalizedText, {
                source: options.source || "base_layer"
            });

            if (bundleResult && bundleResult.ok && bundleResult.bundle) {
                store.setAnalysisProgress(Math.max(92, Number(store.getState().analysisProgress || 0)), "running");
                store.patch({
                    aiGeneration: {
                        status: "base_ready",
                        provider: bundleResult.provider || "",
                        model: bundleResult.model || "",
                        promptVersion: bundleResult.promptVersion || (window.PremiumStudyAI ? window.PremiumStudyAI.PROMPT_VERSION : ""),
                        generatedAt: new Date().toISOString(),
                        textLength: summary.textLength,
                        source: options.source || "base_layer",
                        blockCount: Array.isArray(bundleResult.bundle.blocks) ? bundleResult.bundle.blocks.length : 0,
                        bundleKind: "ai_bundle",
                        localBundleVersion: ""
                    },
                    progressLabel: "Camada base do estudo pronta. Aprender, Praticar e Prova ja ficaram preparados para abrir no clique."
                });
                return {
                    ok: true,
                    status: "base_ready",
                    text: normalizedText,
                    bundle: bundleResult.bundle
                };
            }

            const localBundle = this.buildLocalBundleFromExtractedText(normalizedText, {
                materialName: state.studyTitle || state.materialName || "Material"
            });

            if (localBundle && Array.isArray(localBundle.blocks) && localBundle.blocks.length) {
                store.applyGeneratedBundle({
                    ...localBundle,
                    status: "generated_local_from_extracted_text",
                    provider: "local",
                    model: "extracted-text-fallback",
                    promptVersion: window.PremiumStudyAI ? window.PremiumStudyAI.PROMPT_VERSION : "",
                    bundleKind: "local_fallback",
                    localBundleVersion: LOCAL_BUNDLE_VERSION
                });
                store.setAnalysisProgress(Math.max(92, Number(store.getState().analysisProgress || 0)), "running");
                store.patch({
                    aiGeneration: {
                        status: "base_ready_local",
                        provider: "local",
                        model: "extracted-text-fallback",
                        promptVersion: window.PremiumStudyAI ? window.PremiumStudyAI.PROMPT_VERSION : "",
                        generatedAt: new Date().toISOString(),
                        textLength: summary.textLength,
                        source: options.source || "base_layer",
                        blockCount: localBundle.blocks.length,
                        bundleKind: "local_fallback",
                        localBundleVersion: LOCAL_BUNDLE_VERSION
                    },
                    progressLabel: "A IA passou do tempo limite para fechar o pacote completo, entao montamos uma trilha local com o texto extraido para voce nao ficar travado."
                });
                return {
                    ok: true,
                    status: "base_ready_local",
                    text: normalizedText,
                    bundle: localBundle
                };
            }

            store.patch({
                aiGeneration: {
                    status: bundleResult && bundleResult.status ? bundleResult.status : "base_failed",
                    provider: bundleResult && bundleResult.provider ? bundleResult.provider : "",
                    model: bundleResult && bundleResult.model ? bundleResult.model : "",
                    promptVersion: bundleResult && bundleResult.promptVersion ? bundleResult.promptVersion : (window.PremiumStudyAI ? window.PremiumStudyAI.PROMPT_VERSION : ""),
                    generatedAt: new Date().toISOString(),
                    textLength: summary.textLength,
                    source: options.source || "base_layer"
                }
            });

            return {
                ok: false,
                status: bundleResult && bundleResult.status ? bundleResult.status : "bundle_generation_failed",
                text: normalizedText
            };
        },

        async recoverPremiumScannedPdfFlow(options = {}) {
            const store = window.PremiumStudyStore;
            const router = window.PremiumStudyRouter;
            const state = store.getState();
            const targetStep = options.targetStep || state.step || "mode-select";

            if (!state.materialName) {
                return {
                    ok: false,
                    status: "missing_material"
                };
            }

            return this.runModePreparation({
                targetStep,
                source: options.forceRegenerate ? "premium_scanned_pdf_force" : "premium_scanned_pdf_unlock",
                title: "Preparando os modos com o PDF premium",
                message: "Seu documento parece imagem ou escaneado. Agora que o premium foi liberado, estamos convertendo o texto e atualizando Aprender, Praticar e Prova antes de liberar a próxima tela.",
                labels: ["Sincronizando PDF", "Convertendo texto", "Montando blocos", "Liberando modos"]
            }, async () => {
                const extractedText = await this.ensureMaterialText({
                    maxChars: 50000,
                    maxPages: 60,
                    allowAiFallback: true,
                    useCache: true,
                    saveLocalCache: true,
                    cacheWeakLocal: true,
                    syncProgressLabel: "Preparando o PDF premium no servidor antes da leitura integral.",
                    aiProgressLabel: "O premium está convertendo o PDF em texto editável com ajuda da IA."
                });

                const normalizedText = String(extractedText || "").trim();
                if (!normalizedText) {
                    store.setSessionNote({
                        step: targetStep,
                        tone: "premium",
                        title: "Não consegui converter o PDF agora",
                        message: "A liberação premium foi concluída, mas este PDF em imagem ainda não gerou texto suficiente. Tente novamente em instantes ou use um arquivo mais nítido."
                    });
                    return {
                        ok: false,
                        status: "empty_text"
                    };
                }

                store.setPdfWorkbenchText(normalizedText, {
                    preserveOriginal: false,
                    html: this.textToPdfWorkbenchHtml(normalizedText)
                });

                const shouldRefreshModes =
                    options.forceRegenerate === true ||
                    !this.hasMeaningfulStudyProgress() ||
                    !Array.isArray(store.getState().blocks) ||
                    !store.getState().blocks.some((block) => block && block.generatedByAi);

                if (!shouldRefreshModes) {
                    store.setSessionNote({
                        step: targetStep,
                        tone: "success",
                        title: "Texto premium pronto",
                        message: "O PDF foi convertido em texto editável. Como você já tinha progresso na trilha, mantivemos seus modos atuais sem regenerar os blocos."
                    });
                    this.schedulePersist(120);
                    return {
                        ok: true,
                        status: "text_ready_only"
                    };
                }

                store.patch({
                    progressLabel: "Atualizando Aprender, Praticar e Prova com o texto premium extraído do PDF."
                });
                this.render();

                const bundleResult = await this.generateBundleFromMaterialText(normalizedText, {
                    source: "premium_scanned_pdf_unlock"
                });

                if (bundleResult && bundleResult.ok && bundleResult.bundle) {
                    if (store.getState().step !== targetStep) {
                        router.goTo(targetStep);
                    }
                    store.setSessionNote({
                        step: targetStep,
                        tone: "success",
                        title: "Texto premium pronto. Modos atualizados.",
                        message: "Aprender, Praticar e Prova foram regenerados a partir do texto extraído deste PDF em imagem."
                    });
                    this.schedulePersist(120);
                    return {
                        ok: true,
                        status: "bundle_regenerated"
                    };
                }

                store.setSessionNote({
                    step: targetStep,
                    tone: "info",
                    title: "Texto premium pronto",
                    message: "O PDF foi convertido em texto editável. A trilha completa ainda não foi regenerada agora, mas o texto integral já ficou disponível no editor."
                });
                this.schedulePersist(120);

                return {
                    ok: true,
                    status: "text_ready_bundle_pending"
                };
            });
        },

        async ensureStudyModesReady(targetStep = "mode-select", options = {}) {
            const store = window.PremiumStudyStore;
            const normalizedTargetStep = targetStep || "mode-select";

            if (store.getState().modePreparation && store.getState().modePreparation.active) {
                return {
                    ok: false,
                    status: "mode_preparation_active"
                };
            }

            if (this.hasGeneratedStudyModes()) {
                return {
                    ok: true,
                    status: "already_generated"
                };
            }

            return this.runModePreparation({
                targetStep: normalizedTargetStep,
                source: options.source || "base_layer_retry",
                title: "Preparando a camada base do estudo",
                message: "Estamos organizando o estudo em segundo plano. Em PDF escaneado, a leitura visual e a montagem dos blocos podem levar alguns minutos.",
                labels: ["Lendo material", "Montando Aprender", "Montando Praticar", "Finalizando Prova"]
            }, async () => {
                const baseResult = await this.prepareStudyBaseLayer({
                    source: options.source || "base_layer_retry",
                    forceRegenerate: options.forceRegenerate === true
                });

                if (baseResult && baseResult.ok) {
                    store.setSessionNote({
                        step: normalizedTargetStep,
                        tone: "success",
                        title: "Camada base pronta",
                        message: "Aprender, Praticar e Prova ficaram preparados e agora so aguardam o seu clique."
                    });
                    this.schedulePersist(120);
                    return {
                        ok: true,
                        status: baseResult.status || "base_ready"
                    };
                }

                store.setSessionNote(this.buildLowQualityPdfNote(normalizedTargetStep, {
                    needsPremium: false
                }));
                return {
                    ok: false,
                    status: baseResult && baseResult.status ? baseResult.status : "base_layer_failed"
                };
            });
        },

        async startAnalysisSequence() {
            this.clearAnalysisTimers();
            const store = window.PremiumStudyStore;
            store.setAnalysisProgress(12, "running");
            store.patch({
                progressLabel: "Recebemos o material. Agora vamos medir o porte do conteudo e preparar a camada base do estudo."
            });
            this.startAnalysisProgress();
            this.render();

            try {
                const result = await this.prepareStudyBaseLayer({
                    source: "analysis_sequence"
                });

                store.setAnalysisProgress(96, "running");
                this.stopAnalysisProgress();
                if (!(result && result.ok)) {
                    store.patch({
                        progressLabel: "Ainda nao consegui deixar a camada base pronta. Mantive o estudo aberto para continuar tentando."
                    });
                    store.setSessionNote({
                        step: "mode-select",
                        tone: "info",
                        title: "Camada base ainda incompleta",
                        message: "Ainda nao consegui deixar Aprender, Praticar e Prova prontos. O sistema continua tentando aproveitar o maximo possivel do material."
                    });
                } else {
                    store.setSessionNote({
                        step: "mode-select",
                        tone: "success",
                        title: "Camada base pronta",
                        message: "Aprender, Praticar e Prova ja ficaram preparados e agora so aguardam o seu clique."
                    });
                }

                store.setAnalysisProgress(100, "done");
                window.PremiumStudyRouter.goTo("mode-select");
                this.render();
                this.schedulePersist(120);
            } catch (error) {
                this.stopAnalysisProgress();
                store.setAnalysisProgress(100, "done");
                store.patch({
                    progressLabel: "Ainda nao consegui fechar a camada base do estudo."
                });
                store.setSessionNote({
                    step: "mode-select",
                    tone: "info",
                    title: "Camada base ainda incompleta",
                    message: "A IA nao respondeu como esperado. O estudo continua aberto e podemos tentar montar a base novamente."
                });
                window.PremiumStudyRouter.goTo("mode-select");
                this.render();
                this.schedulePersist(120);
            }
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

            if (snapshot.workspaceMode === "convert") {
                return snapshot.pdfWorkbenchText ? "pdf-workbench" : "entry";
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
            return this.runShellActivity({
                kicker: "Abrindo estudo salvo",
                title: "Preparando o material da biblioteca",
                message: "Estamos restaurando o estudo, aplicando o último snapshot salvo e reposicionando você exatamente no ponto certo.",
                labels: ["Lendo snapshot", "Montando sessoes", "Restaurando modo", "Abrindo estudo"]
            }, async () => {
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
                        (nextStep === "block" && store.getState().blockFullScreen) ||
                        (nextStep === "pdf-workbench" && store.getState().pdfWorkbenchState.fullScreen)
                };
            });
        },

        async handleAction(action, payload = {}) {
            const router = window.PremiumStudyRouter;
            const store = window.PremiumStudyStore;
            const access = window.PremiumStudyAccessControl;
            let shouldPersist = false;
            let shouldSyncNativeFullScreen = false;
            let preferEnterNativeFullScreen = false;
            const getFeature = (name) => access && access.FEATURES
                ? access.FEATURES[name]
                : name.toLowerCase();
            const canUseFeature = (name, context = {}) => access
                ? access.canUse(getFeature(name), store.getState(), context)
                : store.getState().accessTier === "premium";
            const setPremiumLockNote = (name) => {
                const feature = getFeature(name);
                const note = access
                    ? access.buildLockNote(feature)
                    : {
                        tone: "premium",
                        title: "Recurso premium",
                        message: "Este recurso fica liberado no plano premium."
                    };

                store.setSessionNote({
                    step: store.getState().step,
                    ...note
                });
            };
            const openPremiumOffer = (name) => {
                this.openPremiumOffer(name, store.getState().step || "entry");
            };
            const openPracticeSeries = (type, step) => {
                const meta = store.getPracticeSeriesMeta(type);
                const targetIndex = Number.isFinite(meta.nextPendingIndex)
                    ? meta.nextPendingIndex
                    : Math.max(0, meta.freeSeriesLimit - 1);

                store.selectPracticeSeries(type, targetIndex);
                router.goTo(step);
            };
            const premiumLibraryEnabled = canUseFeature("PREMIUM_LIBRARY");
            const getFieldValue = (selector) => {
                const element = this.root ? this.root.querySelector(selector) : null;
                if (!element) {
                    return "";
                }

                if ("value" in element) {
                    return String(element.value || "");
                }

                return element.isContentEditable
                    ? String(element.innerText || "")
                    : "";
            };

            if (
                (store.getState().modePreparation && store.getState().modePreparation.active) ||
                (store.getState().shellActivity && store.getState().shellActivity.active)
            ) {
                const activeActivity = store.getState().modePreparation && store.getState().modePreparation.active
                    ? store.getState().modePreparation
                    : store.getState().shellActivity;
                store.setSessionNote({
                    step: store.getState().step,
                    tone: "info",
                    title: activeActivity.title || "Processando",
                    message: activeActivity.message || "Aguarde a preparacao terminar antes de abrir outra area."
                });
                this.render();
                return;
            }

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
                const workspaceMode = store.getState().workspaceMode === "convert" ? "convert" : "study";
                if (
                    store.getState().materialName &&
                    store.getState().step !== "entry" &&
                    store.getState().step !== "mode-select" &&
                    store.getState().step !== "exam-date" &&
                    store.getState().step !== "target-score" &&
                    store.getState().step !== "study-time" &&
                    store.getState().step !== "analysis"
                ) {
                    router.goTo(workspaceMode === "convert" ? "entry" : "mode-select");
                    this.render();
                    await this.syncNativeFullScreen();
                    await this.flushPersist();
                    return;
                }
                if (store.getState().step !== "entry") {
                    router.goTo("entry");
                    this.render();
                    await this.syncNativeFullScreen();
                    await this.flushPersist();
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
            case "switch-to-study-entry":
                store.patch({
                    workspaceMode: "study"
                });
                router.goTo("entry");
                shouldPersist = true;
                break;
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
                    this.trackGrowth("resume_latest_study", {
                        materialHash: store.getState().materialHash,
                        metadata: {
                            source: "latest_draft"
                        }
                    });
                    break;
                }

                const latestLibraryItem = store.getState().studyLibrary[0] || null;
                if (latestLibraryItem && latestLibraryItem.snapshot) {
                    const resumeState = await this.resumeSnapshot({
                        ...latestLibraryItem.snapshot,
                        savedAt: latestLibraryItem.savedAt || latestLibraryItem.snapshot.savedAt
                    });
                    shouldSyncNativeFullScreen = resumeState.shouldSyncNativeFullScreen;
                    preferEnterNativeFullScreen = resumeState.preferEnterNativeFullScreen;
                    shouldPersist = true;
                    this.trackGrowth("resume_latest_study", {
                        materialHash: store.getState().materialHash,
                        metadata: {
                            source: "synced_library"
                        }
                    });
                }
                break;
            }
            case "pick-date":
                if (String(payload.dateValue || "") >= getTodayIsoDate()) {
                    store.setExamDate(payload.dateValue);
                    shouldPersist = true;
                }
                break;
            case "calendar-prev":
                store.shiftCalendarMonth(-1);
                break;
            case "calendar-next":
                store.shiftCalendarMonth(1);
                break;
            case "continue-to-target":
                if (String(store.getState().examDate || "") >= getTodayIsoDate()) {
                    router.goTo("target-score");
                    shouldPersist = true;
                }
                break;
            case "continue-to-time":
                router.goTo("study-time");
                shouldPersist = true;
                break;
            case "continue-to-analysis":
                store.setAnalysisProgress(10, "pending");
                router.goTo("analysis");
                shouldPersist = true;
                this.trackGrowth("trial_started", {
                    materialHash: store.getState().materialHash,
                    pageCount: Number(store.getState().materialPageCount || 0),
                    metadata: {
                        examDate: store.getState().examDate || "",
                        targetScore: store.getState().targetScore || 0,
                        studyHours: store.getState().studyHours || 0,
                        studyMinutes: store.getState().studyMinutes || 0
                    }
                });
                break;
            case "choose-mode-learn":
                {
                    const ensureModes = await this.ensureStudyModesReady("mode-select", {
                        source: "choose_mode_learn"
                    });
                    if (!ensureModes.ok) {
                        router.goTo("mode-select");
                        shouldPersist = true;
                        break;
                    }
                }
                store.setBlockTab("aula");
                router.goTo("learn-map");
                shouldPersist = true;
                break;
            case "choose-mode-highlight":
                store.openHighlightDocument();
                router.goTo("highlight-preview");
                shouldPersist = true;
                break;
            case "choose-mode-pdf-workbench":
                {
                    this.lastPdfTextFallbackResult = null;
                    const localExtraction = await this.extractMaterialTextLocally({
                        maxChars: 180000,
                        maxPages: 80,
                        forceRefresh: true,
                        saveCache: true
                    });
                    const localSummary = this.summarizeMaterialExtraction(localExtraction, {
                        pageCount: store.getState().materialPageCount || 0
                    });
                    let workbenchText = "";

                    if (localSummary.textLength && localSummary.looksStrong) {
                        workbenchText = localExtraction.text || "";
                    } else if (!canUseFeature("SCANNED_PDF_TEXT")) {
                        store.setSessionNote({
                            step: "premium-checkout",
                            tone: "premium",
                            title: "Isto não é erro: este PDF precisa da conversão premium",
                            message: "Este arquivo parece imagem ou escaneado. No grátis, o editor abre PDFs textuais quando a leitura local funciona. Para transformar este documento em texto editável com IA, use o premium."
                        });
                        openPremiumOffer("SCANNED_PDF_TEXT");
                        shouldPersist = true;
                        break;
                    } else {
                        workbenchText = await this.ensurePdfWorkbenchText({
                            maxChars: 180000,
                            maxPages: 80,
                            allowAiFallback: true,
                            useCache: true,
                            saveLocalCache: true,
                            syncProgressLabel: "Preparando o PDF premium no servidor antes da leitura integral.",
                            aiProgressLabel: "O premium está convertendo o PDF em texto editável com ajuda da IA."
                        });
                    }

                    const fallbackFailure = this.lastPdfTextFallbackResult || null;
                    const workbenchSummary = this.summarizeMaterialExtraction({
                        text: workbenchText,
                        pageCount: store.getState().materialPageCount || 0
                    }, {
                        pageCount: store.getState().materialPageCount || 0
                    });

                    if (
                        !workbenchText ||
                        (
                            !localSummary.looksStrong &&
                            fallbackFailure &&
                            !fallbackFailure.ok &&
                            !workbenchSummary.looksStrong
                        )
                    ) {
                        store.setSessionNote({
                            step: "mode-select",
                            tone: "info",
                            title: fallbackFailure && fallbackFailure.status
                                ? "Não consegui preparar o PDF em texto"
                                : "Não consegui extrair o texto",
                            message: fallbackFailure && fallbackFailure.message
                                ? fallbackFailure.message
                                : "Não encontrei texto suficiente no PDF para abrir o editor agora. Tente novamente mais tarde ou use um arquivo mais nítido."
                        });
                        shouldPersist = true;
                        break;
                    }

                    store.setPdfWorkbenchText(workbenchText, {
                        preserveOriginal: false,
                        html: this.textToPdfWorkbenchHtml(workbenchText)
                    });
                }
                store.patchPdfWorkbenchState({
                    fullScreen: true
                });
                router.goTo("pdf-workbench");
                shouldPersist = true;
                shouldSyncNativeFullScreen = true;
                preferEnterNativeFullScreen = true;
                break;
            case "choose-mode-practice":
                {
                    const ensureModes = await this.ensureStudyModesReady("mode-select", {
                        source: "choose_mode_practice"
                    });
                    if (!ensureModes.ok) {
                        router.goTo("mode-select");
                        shouldPersist = true;
                        break;
                    }
                }
                store.setReturnStep("mode-select");
                store.markActiveBlockProgress({ practice: true });
                router.goTo("practice");
                shouldPersist = true;
                shouldSyncNativeFullScreen = true;
                break;
            case "choose-mode-exam":
                if (!canUseFeature("LEVEL_EXAM")) {
                    openPremiumOffer("LEVEL_EXAM");
                    shouldPersist = true;
                    break;
                }
                {
                    const ensureModes = await this.ensureStudyModesReady("mode-select", {
                        source: "choose_mode_exam"
                    });
                    if (!ensureModes.ok) {
                        router.goTo("mode-select");
                        shouldPersist = true;
                        break;
                    }
                }
                store.setReturnStep("mode-select");
                router.goTo("level-exam");
                shouldPersist = true;
                shouldSyncNativeFullScreen = true;
                break;
            case "open-premium-library":
                if (!premiumLibraryEnabled) {
                    openPremiumOffer("PREMIUM_LIBRARY");
                    shouldPersist = true;
                    break;
                }
                await this.syncStudyLibraryWithAccount({
                    force: true,
                    visual: true
                });
                router.goTo("premium-library");
                shouldPersist = true;
                shouldSyncNativeFullScreen = true;
                break;
            case "open-library-item":
                if (!premiumLibraryEnabled) {
                    openPremiumOffer("PREMIUM_LIBRARY");
                    shouldPersist = true;
                    break;
                }
                store.setActiveLibraryItem(payload.blockId);
                shouldPersist = true;
                break;
            case "resume-library-item": {
                if (!premiumLibraryEnabled) {
                    openPremiumOffer("PREMIUM_LIBRARY");
                    shouldPersist = true;
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
            case "resume-library-pdf": {
                if (!premiumLibraryEnabled) {
                    openPremiumOffer("PREMIUM_LIBRARY");
                    shouldPersist = true;
                    break;
                }
                const activeItem = store.getActiveLibraryItem();
                if (activeItem && activeItem.snapshot) {
                    await this.resumeSnapshot({
                        ...activeItem.snapshot,
                        savedAt: activeItem.savedAt || activeItem.snapshot.savedAt,
                        step: "pdf-workbench"
                    });
                    store.patchPdfWorkbenchState({
                        fullScreen: true
                    });
                    router.goTo("pdf-workbench");
                    await this.ensurePdfWorkbenchText();
                    shouldSyncNativeFullScreen = true;
                    preferEnterNativeFullScreen = true;
                }
                shouldPersist = true;
                break;
            }
            case "download-highlight-summary":
                if (!canUseFeature("HIGHLIGHT_EXPORT")) {
                    openPremiumOffer("HIGHLIGHT_EXPORT");
                    shouldPersist = true;
                    break;
                }
                this.downloadHighlightedPdf("summary");
                shouldPersist = true;
                break;
            case "download-highlighted-full":
                if (!canUseFeature("HIGHLIGHT_EXPORT")) {
                    openPremiumOffer("HIGHLIGHT_EXPORT");
                    shouldPersist = true;
                    break;
                }
                this.downloadHighlightedPdf("full");
                shouldPersist = true;
                break;
            case "open-highlight-editor":
                store.setHighlightEditorOpen(true);
                store.setHighlightEditorFullScreen(true);
                shouldPersist = true;
                shouldSyncNativeFullScreen = true;
                preferEnterNativeFullScreen = true;
                break;
            case "close-highlight-editor":
                store.setHighlightEditorFullScreen(false);
                store.setHighlightEditorOpen(false);
                shouldPersist = true;
                shouldSyncNativeFullScreen = true;
                break;
            case "expand-highlight-editor":
                store.setHighlightEditorOpen(true);
                store.setHighlightEditorFullScreen(true);
                shouldPersist = true;
                shouldSyncNativeFullScreen = true;
                preferEnterNativeFullScreen = true;
                break;
            case "collapse-highlight-editor":
                store.setHighlightEditorFullScreen(false);
                shouldPersist = true;
                shouldSyncNativeFullScreen = true;
                break;
            case "pdf-search":
                {
                    const query = getFieldValue("#premiumPdfSearchInput");
                    store.patchPdfWorkbenchState({
                        searchQuery: query
                    });
                    if (!this.focusPdfWorkbenchText(query) && query) {
                        store.setSessionNote({
                            step: "pdf-workbench",
                            tone: "info",
                            title: "Trecho não encontrado",
                            message: "Não localizei esse termo no texto extraído."
                        });
                        this.render();
                    }
                    shouldPersist = true;
                }
                break;
            case "pdf-clear-search":
                this.clearPdfSearchHighlights();
                store.patchPdfWorkbenchState({
                    searchQuery: "",
                    transientMessage: ""
                });
                shouldPersist = true;
                this.render();
                break;
            case "restore-pdf-workbench-text":
                store.restorePdfWorkbenchOriginal();
                store.setSessionNote({
                    step: "pdf-workbench",
                    tone: "info",
                    title: "Texto restaurado",
                    message: "O editor voltou para a versao extraida do PDF."
                });
                shouldPersist = true;
                this.render();
                break;
            case "copy-pdf-workbench-text": {
                const text = this.getPdfWorkbenchEditorText() || store.getState().pdfWorkbenchText || "";
                if (text && navigator.clipboard && typeof navigator.clipboard.writeText === "function") {
                    try {
                        await navigator.clipboard.writeText(text);
                        this.showPdfWorkbenchToast("Texto copiado para a area de transferencia.");
                    } catch (_error) {
                        store.setSessionNote({
                            step: "pdf-workbench",
                            tone: "premium",
                            title: "Não consegui copiar",
                            message: "O navegador bloqueou a copia automatica."
                        });
                    }
                    this.render();
                }
                break;
            }
            case "expand-pdf-workbench":
                store.patchPdfWorkbenchState({
                    fullScreen: true
                });
                shouldPersist = true;
                shouldSyncNativeFullScreen = true;
                preferEnterNativeFullScreen = true;
                break;
            case "collapse-pdf-workbench":
                store.patchPdfWorkbenchState({
                    fullScreen: false
                });
                shouldPersist = true;
                shouldSyncNativeFullScreen = true;
                break;
            case "save-pdf-workbench":
                {
                    const currentTitle = store.getState().studyTitle || store.getState().materialName || "Documento";
                    const nextTitle = window.prompt("Como você quer salvar este arquivo?", currentTitle);
                    if (nextTitle === null) {
                        break;
                    }
                    if (String(nextTitle || "").trim()) {
                        store.setStudyTitle(String(nextTitle || "").trim());
                    }
                }
                this.clearPdfSearchHighlights();
                store.setPdfWorkbenchText(this.getPdfWorkbenchEditorText(), {
                    preserveOriginal: true,
                    html: this.getPdfWorkbenchEditorHtml()
                });
                await this.runShellActivity({
                    kicker: "Salvando",
                    title: "Guardando o texto na sua biblioteca",
                    message: "Estamos salvando o editor atual neste navegador e sincronizando com a sua conta quando houver login.",
                    labels: ["Atualizando editor", "Salvando local", "Sincronizando biblioteca", "Finalizando"]
                }, async () => {
                    await this.persistPdfWorkbenchState();
                    await this.persistCurrentState();
                });
                store.setSessionNote({
                    step: "pdf-workbench",
                    tone: "info",
                    title: "Texto salvo",
                    message: store.getState().accountAuthenticated
                        ? "Salvo neste navegador e sincronizado com a sua conta na Biblioteca premium. Hoje a biblioteca ainda não tem pastas."
                        : "Salvo neste navegador e atualizado no item atual da Biblioteca premium deste navegador. Hoje a biblioteca ainda não tem pastas."
                });
                this.render();
                shouldPersist = false;
                break;
            case "set-pdf-highlight-color":
                if (this.applyPdfHighlight(payload.itemValue || "")) {
                    store.setSessionNote({
                        step: "pdf-workbench",
                        tone: "info",
                        title: "Marcacao aplicada",
                        message: "O trecho selecionado recebeu a cor escolhida."
                    });
                    this.render();
                    shouldPersist = true;
                }
                break;
            case "clear-pdf-highlight":
                if (this.clearPdfHighlight()) {
                    store.setSessionNote({
                        step: "pdf-workbench",
                        tone: "info",
                        title: "Marcacao removida",
                        message: "A marcacao do trecho selecionado foi limpa."
                    });
                    this.render();
                    shouldPersist = true;
                }
                break;
            case "download-original-pdf": {
                this.clearPdfSearchHighlights();
                if (this.downloadPdfWorkbenchEditedVersion()) {
                    store.setSessionNote({
                        step: "pdf-workbench",
                        tone: "info",
                        title: "Versao editada baixada",
                        message: "O download saiu com o texto e as marcacoes que estao na tela agora."
                    });
                    this.render();
                } else {
                    store.setSessionNote({
                        step: "pdf-workbench",
                        tone: "premium",
                        title: "Nada para baixar",
                        message: "Ainda não encontrei conteúdo editado suficiente para gerar o arquivo."
                    });
                    this.render();
                }
                shouldPersist = true;
                break;
            }
            case "pdf-ai-highlight-all":
            case "pdf-ai-highlight-block": {
                if (!canUseFeature("AI_TEXT_HIGHLIGHT")) {
                    openPremiumOffer("AI_TEXT_HIGHLIGHT");
                    shouldPersist = true;
                    break;
                }
                const state = store.getState();
                const dailyMinutes = (Number(state.studyHours) || 0) * 60
                    + (Number(state.studyMinutes) || 0);
                const activeBlockState = store.getActiveBlock();
                const scope = action === "pdf-ai-highlight-block" ? "block" : "all";
                const service = this.getPdfWorkbenchService();
                const result = service
                    ? await service.requestAiHighlights(state.pdfAssetId, {
                        assetId: state.pdfAssetId,
                        assetHash: state.pdfAssetHash,
                        materialName: state.materialName,
                        extractedText: state.materialExtractedText,
                        examDate: state.examDate,
                        targetScore: state.targetScore,
                        dailyMinutes,
                        scope,
                        blockId: scope === "block" && activeBlockState ? activeBlockState.id : "",
                        blockTitle: scope === "block" && activeBlockState ? activeBlockState.title : "",
                        blocks: Array.isArray(state.blocks)
                            ? state.blocks.map((block) => ({
                                id: block.id,
                                title: block.title,
                                topics: block.topics || [],
                                summary: block.learn && block.learn.summary ? block.learn.summary : ""
                            }))
                            : []
                    })
                    : { ok: false, status: "service_unavailable" };

                if (result.ok && Array.isArray(result.highlights)) {
                    store.setPdfAiHighlights(result.highlights);

                    this.schedulePdfWorkbenchPersist(60);
                    shouldPersist = true;
                    this.render();
                } else {
                    store.setSessionNote({
                        step: "pdf-workbench",
                        tone: "info",
                        title: "IA sem retorno agora",
                        message: result.message || "Não consegui gerar os grifos contextualizados neste momento."
                    });
                    this.render();
                }
                break;
            }
            case "select-pdf-ai-highlight":
                store.selectPdfAiHighlight(payload.itemValue);
                shouldPersist = true;
                this.render();
                break;
            case "jump-to-pdf-ai-highlight": {
                const selectedId = store.getState().pdfWorkbenchState.selectedAiHighlightId;
                const selectedHighlight = store.getState().aiHighlights.find((item) => item.id === selectedId);
                if (selectedHighlight) {
                    this.focusPdfWorkbenchText(selectedHighlight.quote || selectedHighlight.anchor || "");
                    shouldPersist = true;
                }
                break;
            }
            case "promote-pdf-ai-highlight": {
                const selectedId = store.getState().pdfWorkbenchState.selectedAiHighlightId;
                if (selectedId) {
                    store.updatePdfAiHighlight(selectedId, {
                        source: "user"
                    });
                    this.schedulePdfWorkbenchPersist(60);
                    shouldPersist = true;
                    this.render();
                }
                break;
            }
            case "dismiss-pdf-ai-highlight": {
                const selectedId = store.getState().pdfWorkbenchState.selectedAiHighlightId;
                if (selectedId) {
                    store.updatePdfAiHighlight(selectedId, {
                        dismissed: true
                    });
                    const nextActive = store.getState().aiHighlights.find((item) => !item.dismissed);
                    store.selectPdfAiHighlight(nextActive ? nextActive.id : "");
                    this.schedulePdfWorkbenchPersist(60);
                    shouldPersist = true;
                    this.render();
                }
                break;
            }
            case "select-highlight-part":
                store.setHighlightSelection(
                    Number(payload.sectionIndex),
                    Number(payload.paragraphIndex),
                    Number(payload.partIndex)
                );
                shouldPersist = true;
                break;
            case "set-highlight-color":
                store.setHighlightColor(payload.itemValue);
                shouldPersist = true;
                break;
            case "toggle-highlight-selection":
                store.toggleSelectedHighlight();
                shouldPersist = true;
                break;
            case "clear-all-highlights":
                store.clearAllHighlights();
                shouldPersist = true;
                break;
            case "restore-highlight-document":
                store.restoreOriginalHighlightedDocument();
                shouldPersist = true;
                break;
            case "save-highlight-text": {
                const editor = this.root.querySelector("#premiumHighlightEditor");
                store.updateSelectedHighlightText(editor ? editor.value : "");
                shouldPersist = true;
                break;
            }
            case "delete-highlight-text":
                store.deleteSelectedHighlightText();
                shouldPersist = true;
                break;
            case "copy-highlight-text": {
                const documentData = store.getState().highlightedDocument;
                const selectedPartId = documentData && documentData.selectedPartId
                    ? documentData.selectedPartId
                    : "";
                let selectedText = "";

                if (selectedPartId) {
                    (documentData.sections || []).some((section) =>
                        (section.paragraphs || []).some((paragraph) =>
                            (paragraph || []).some((part) => {
                                if (part.id !== selectedPartId) {
                                    return false;
                                }

                                selectedText = String(part.text || "");
                                return true;
                            })
                        )
                    );
                }

                if (selectedText && navigator.clipboard && typeof navigator.clipboard.writeText === "function") {
                    try {
                        await navigator.clipboard.writeText(selectedText);
                        store.setSessionNote({
                            step: "highlight-preview",
                            tone: "info",
                            title: "Trecho copiado",
                            message: "O texto selecionado foi enviado para a area de transferencia."
                        });
                    } catch (error) {
                        store.setSessionNote({
                            step: "highlight-preview",
                            tone: "premium",
                            title: "Não consegui copiar agora",
                            message: "O navegador bloqueou a copia automatica deste trecho."
                        });
                    }
                }
                shouldPersist = true;
                break;
            }
            case "set-tab":
                store.setBlockTab(payload.tabId);
                shouldPersist = true;
                break;
            case "toggle-learn-check":
                store.toggleLearnChecklistItem(payload.blockId, payload.itemIndex);
                shouldPersist = true;
                break;
            case "toggle-memory-card":
                store.toggleLearnMemoryCard(payload.blockId, payload.itemIndex);
                shouldPersist = true;
                break;
            case "toggle-learn-case":
                store.toggleLearnCase(payload.blockId, payload.itemIndex);
                shouldPersist = true;
                break;
            case "open-premium-checkout":
                openPremiumOffer(payload.itemValue || "PREMIUM_LIBRARY");
                shouldPersist = true;
                shouldSyncNativeFullScreen = true;
                break;
            case "start-premium-checkout": {
                const plans = window.PremiumStudyBilling
                    && typeof window.PremiumStudyBilling.getPlans === "function"
                    ? window.PremiumStudyBilling.getPlans()
                    : [];
                const selectedPlanId = payload.itemValue || "premium_monthly";
                const selectedPlan = plans.find((plan) => plan.id === selectedPlanId) || null;
                const auth = window.RotaNotaAuth || null;
                const googleLoginAvailable = auth
                    && typeof auth.isGoogleLoginAvailable === "function"
                    ? auth.isGoogleLoginAvailable()
                    : false;
                const alreadyAuthenticated = auth
                    && typeof auth.isAuthenticated === "function"
                    ? auth.isAuthenticated()
                    : false;

                if (
                    !alreadyAuthenticated &&
                    googleLoginAvailable &&
                    window.RotaNotaCore
                    && typeof window.RotaNotaCore.requireGoogleLogin === "function"
                ) {
                    const gate = window.RotaNotaCore.requireGoogleLogin({
                        kind: "premium_checkout",
                        source: "premium_checkout",
                        planId: selectedPlanId,
                        planLabel: selectedPlan && selectedPlan.label
                            ? selectedPlan.label
                            : ""
                    });

                    if (!gate || gate.allowed !== true) {
                        shouldPersist = true;
                        break;
                    }
                }

                if (!alreadyAuthenticated && !googleLoginAvailable) {
                    store.setSessionNote({
                        step: "premium-checkout",
                        tone: "info",
                        title: "Continuando sem login Google",
                        message: "O login Google não está configurado neste ambiente. O checkout foi liberado mesmo assim."
                    });
                    this.render();
                }

                this.trackGrowth("checkout_click", {
                    feature: store.getState().premiumOffer && store.getState().premiumOffer.feature,
                    sourceStep: store.getState().returnStep,
                    surface: "premium_checkout",
                    planId: selectedPlanId,
                    metadata: {
                        promotionCampaignId: store.getState().premiumOffer && store.getState().premiumOffer.promotionCampaignId
                            ? store.getState().premiumOffer.promotionCampaignId
                            : ""
                    }
                });
                const checkout = window.PremiumStudyBilling
                    ? await window.PremiumStudyBilling.startCheckout(selectedPlanId, {
                        feature: store.getState().premiumOffer && store.getState().premiumOffer.feature,
                        sourceStep: store.getState().returnStep
                    })
                    : { status: "not_configured", message: "Checkout real ainda não foi conectado." };

                if (checkout && checkout.ok && checkout.checkoutUrl) {
                    return;
                }

                store.setSessionNote({
                    step: store.getState().step,
                    tone: "premium",
                    title: "Não foi possível abrir o checkout",
                    message: checkout.message || "O checkout não respondeu corretamente agora. Tente de novo em instantes."
                });
                shouldPersist = true;
                break;
            }
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
                store.setBlockTab("aula");
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
                    store.setBlockTab("aula");
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
                openPracticeSeries("quiz", "quiz");
                shouldPersist = true;
                break;
            case "open-practice-slot":
                store.selectPracticeSeries(payload.practiceType, Number(payload.slotIndex));
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
                openPracticeSeries("trueFalse", "true-false");
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
            case "restart-true-false":
                store.restartPracticeType("trueFalse");
                shouldPersist = true;
                break;
            case "open-flashcards":
                openPracticeSeries("flashcards", "flashcards");
                shouldPersist = true;
                break;
            case "request-premium-practice-extra":
                openPremiumOffer("PRACTICE_EXTRA_SERIES");
                shouldPersist = true;
                break;
            case "request-extra-mini-exam":
                if (!canUseFeature("MINI_EXAM_EXTRA")) {
                    openPremiumOffer("MINI_EXAM_EXTRA");
                    shouldPersist = true;
                    break;
                }
                store.setSessionNote({
                    step: "mini-exam",
                    tone: "info",
                    title: "Gerando mais 5 questões",
                    message: "A IA esta criando uma nova rodada premium para este bloco."
                });
                this.render();
                {
                    const block = store.getActiveBlock();
                    const ai = window.PremiumStudyAI;
                    const result = ai && typeof ai.request === "function"
                        ? await ai.request(ai.TASKS.EXTRA_MINI_EXAM, {
                            customerId: store.getState().customerId || "",
                            materialHash: store.getState().materialHash || "",
                            blockId: block.id,
                            blockTitle: block.title,
                            blockSummary: block.learn && block.learn.summary ? block.learn.summary : "",
                            topics: block.topics || [],
                            count: 5
                        })
                        : { ok: false, status: "ai_unavailable" };

                    if (result && result.ok && result.questions) {
                        store.appendMiniExamQuestions(block.id, result.questions);
                        router.goTo("mini-exam");
                    } else {
                        store.setSessionNote({
                            step: "mini-exam",
                            tone: "premium",
                            title: "Não foi possível gerar agora",
                            message: "A IA não retornou novas questões. Tente novamente em alguns instantes."
                        });
                    }
                }
                shouldPersist = true;
                break;
            case "select-level-exam-count":
                store.setLevelExamQuestionCount(Number(payload.itemValue));
                shouldPersist = true;
                break;
            case "generate-level-exam":
                if (!canUseFeature("LEVEL_EXAM")) {
                    openPremiumOffer("LEVEL_EXAM");
                    shouldPersist = true;
                    break;
                }
                {
                    const ensureModes = await this.ensureStudyModesReady("level-exam", {
                        source: "generate_level_exam"
                    });
                    if (!ensureModes.ok && ensureModes.status !== "already_generated") {
                        shouldPersist = true;
                        break;
                    }
                }
                store.setSessionNote({
                    step: "level-exam",
                    tone: "info",
                    title: "Gerando prova premium",
                    message: "A IA está montando uma prova de nível com base na sua rota."
                });
                this.render();
                {
                    const levelExam = store.getState().levelExam || {};
                    const ai = window.PremiumStudyAI;
                    const result = ai && typeof ai.request === "function"
                        ? await ai.request(ai.TASKS.PREMIUM_LEVEL_EXAM, {
                            customerId: store.getState().customerId || "",
                            materialHash: store.getState().materialHash || "",
                            questionCount: levelExam.questionCount || 10,
                            bundleSummary: this.buildBundleSummary()
                        })
                        : { ok: false, status: "ai_unavailable" };

                    if (result && result.ok && result.questions) {
                        store.setLevelExamQuestions({
                            title: result.title,
                            questions: result.questions
                        });
                        store.startLevelExam();
                        store.clearSessionNote();
                    } else {
                        const fallbackQuestions = this.buildFallbackLevelExamQuestions(levelExam.questionCount || 10);

                        if (fallbackQuestions.length) {
                            store.setLevelExamQuestions({
                                title: "Prova de nível do material",
                                questions: fallbackQuestions
                            });
                            store.startLevelExam();
                            store.setSessionNote({
                                step: "level-exam",
                                tone: "info",
                                title: "Prova pronta com base na sua trilha",
                                message: "A IA da prova não respondeu com um conjunto válido agora. Montamos uma prova de nível local com perguntas novas sobre criterio, aplicacao e pegadinhas da sua rota."
                            });
                        } else {
                            store.setSessionNote({
                                step: "level-exam",
                                tone: "premium",
                                title: "Não foi possível gerar a prova",
                                message: "A IA não retornou uma prova válida e a trilha ainda não tinha questões suficientes para montar um fallback local."
                            });
                        }
                    }
                }
                router.goTo("level-exam");
                shouldPersist = true;
                break;
            case "start-level-exam":
                store.startLevelExam();
                shouldPersist = true;
                break;
            case "answer-level-exam":
                store.setLevelExamAnswer(Number(payload.answerIndex));
                shouldPersist = true;
                break;
            case "continue-level-exam":
                store.advanceLevelExam();
                shouldPersist = true;
                break;
            case "finish-level-exam":
                store.advanceLevelExam();
                shouldPersist = true;
                break;
            case "request-extra-quiz": {
                const seriesMeta = store.getPracticeSeriesMeta("quiz");

                if (seriesMeta.hasMoreFreeSeries) {
                    store.advanceQuizSeries();
                    store.clearSessionNote();
                    router.goTo("quiz");
                    shouldPersist = true;
                    break;
                }

                openPremiumOffer("PRACTICE_EXTRA_SERIES");
                shouldPersist = true;
                break;
            }
            case "request-extra-true-false": {
                const seriesMeta = store.getPracticeSeriesMeta("trueFalse");

                if (seriesMeta.hasMoreFreeSeries) {
                    store.advanceTrueFalseSeries();
                    store.clearSessionNote();
                    router.goTo("true-false");
                    shouldPersist = true;
                    break;
                }

                openPremiumOffer("PRACTICE_EXTRA_SERIES");
                shouldPersist = true;
                break;
            }
            case "request-extra-flashcards": {
                const seriesMeta = store.getPracticeSeriesMeta("flashcards");

                if (seriesMeta.hasMoreFreeSeries) {
                    store.advanceFlashcardSeries();
                    store.clearSessionNote();
                    router.goTo("flashcards");
                    shouldPersist = true;
                    break;
                }

                openPremiumOffer("PRACTICE_EXTRA_SERIES");
                shouldPersist = true;
                break;
            }
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
            case "reset-quiz":
                store.resetActiveSession("quiz");
                shouldPersist = true;
                break;
            case "restart-quiz":
                store.restartPracticeType("quiz");
                shouldPersist = true;
                break;
            case "reset-flashcards":
                store.resetActiveSession("flashcards");
                shouldPersist = true;
                break;
            case "restart-flashcards":
                store.restartPracticeType("flashcards");
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
                const nextTitle = window.prompt("Como você quer chamar este estudo?", currentTitle);
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
                this.pendingScrollSelector = ".premium-learn-assist-panel";
                shouldPersist = true;
                break;
            case "ai-quick-review":
                store.setBlockAssistMode("review");
                store.patch({
                    progressLabel: "Revisao em 5 pontos aberta para fixar este assunto com rapidez."
                });
                this.pendingScrollSelector = ".premium-learn-assist-panel";
                shouldPersist = true;
                break;
            case "ai-create-questions":
                store.setSessionNote({
                    step: store.getState().step,
                    tone: "info",
                    title: "Criação extra ainda não entrou nesta fase",
                    message: "Nesta etapa, o foco continua no pacote base do assunto. A geracao dinamica extra entra junto da operacao premium."
                });
                shouldPersist = true;
                break;
            default:
                break;
            }

            this.render();

            if (this.pendingScrollSelector) {
                const selector = this.pendingScrollSelector;
                this.pendingScrollSelector = "";
                window.requestAnimationFrame(() => {
                    const target = this.root && this.root.querySelector(selector);
                    if (target && typeof target.scrollIntoView === "function") {
                        target.scrollIntoView({ behavior: "smooth", block: "start" });
                    }
                });
            }

            if (shouldSyncNativeFullScreen) {
                await this.syncNativeFullScreen(preferEnterNativeFullScreen);
            }

            if (shouldPersist) {
                this.schedulePersist();
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

            const state = window.PremiumStudyStore.getState();
            const keepNativeFullScreen =
                (step === "block" && state.blockFullScreen) ||
                (
                    step === "highlight-preview" &&
                    state.highlightEditorOpen &&
                    state.highlightEditorFullScreen
                ) ||
                (
                    step === "pdf-workbench" &&
                    state.pdfWorkbenchState &&
                    state.pdfWorkbenchState.fullScreen
                );

            this.destroyPdfBridge();

            if (!keepNativeFullScreen) {
                this.exitNativeFullScreen();
            }

            if (step === "pdf-workbench") {
                const searchQuery = state.pdfWorkbenchState && state.pdfWorkbenchState.searchQuery
                    ? state.pdfWorkbenchState.searchQuery
                    : "";

                if (searchQuery) {
                    this.focusPdfWorkbenchText(searchQuery);
                }
            }
        },

        render() {
            if (!this.root) {
                return;
            }

            const state = window.PremiumStudyStore.getState();
            const step = state.step;
            const currentShell = this.root.querySelector(".premium-study-shell");

            const meta = {
                ...window.PremiumStudyRouter.getMeta(step)
            };
            const workspaceMode = state.workspaceMode === "convert" ? "convert" : "study";

            if (step === "entry" && workspaceMode === "convert") {
                meta.title = "Converter PDF ruim em texto editavel.";
                meta.subtitle = "Use esta ferramenta premium para recuperar PDF escaneado ou de baixa qualidade no editor.";
                meta.label = "Conversor premium";
                meta.titleClass = "premium-stage-title-editorial premium-stage-title-entry";
                meta.titleHtml = [
                    '<span class="premium-stage-line premium-stage-line-soft premium-stage-line-shift-1">Converter</span>',
                    '<span class="premium-stage-line premium-stage-line-emphasis premium-stage-line-shift-2">PDF ruim</span>',
                    '<span class="premium-stage-line premium-stage-line-tail premium-stage-line-shift-3">em texto editavel.</span>'
                ].join("");
            }
            const headerActions = step === "pdf-workbench"
                ? [
                    {
                        action: "download-original-pdf",
                        label: "Baixar versao editada",
                        icon: "\u21E9"
                    },
                    {
                        action: state.pdfWorkbenchState && state.pdfWorkbenchState.fullScreen
                            ? "collapse-pdf-workbench"
                            : "expand-pdf-workbench",
                        label: state.pdfWorkbenchState && state.pdfWorkbenchState.fullScreen
                            ? "Sair da tela cheia"
                            : "Abrir em tela cheia",
                        icon: "\u26F6"
                    }
                ]
                : [];

            if (step === "pdf-workbench" && headerActions.length >= 2) {
                headerActions[0].icon = "\u21E9";
                headerActions[1].icon = state.pdfWorkbenchState && state.pdfWorkbenchState.fullScreen
                    ? "\u21F2"
                    : "\u26F6";
            }

            if (step === "highlight-preview" && state.highlightEditorOpen) {
                meta.hideHeading = true;
                meta.showKicker = false;
            }

            const summary = meta.showSummary
                ? window.PremiumStudyUI.summaryPanel(state, step === "mode-select" ? "compact" : "default")
                : "";
            const activeProcessing = state.shellActivity && state.shellActivity.active
                ? state.shellActivity
                : state.modePreparation;

            this.root.innerHTML = window.PremiumStudyUI.shell({
                step,
                meta,
                content: window.PremiumStudyViews.render(step, state),
                summary,
                showBack: window.PremiumStudyRouter.canGoBack(step),
                headerActions,
                processing: activeProcessing
            });

            document.body.setAttribute("data-premium-step", step);
            this.afterRender(step);
        }
    };
})();


(function () {
    if (window.PremiumStudyApp) {
        return;
    }

    const CHECKOUT_CONTEXT_KEY = "rotanota-premium-checkout-context";

    window.PremiumStudyApp = {
        root: null,
        analysisTimers: [],
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
            this.render();

            try {
                return await task(activity);
            } finally {
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
                    message: "Estamos recuperando o ultimo estado, validando sua conta e buscando os estudos salvos antes de liberar a interface.",
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
                examDateLabel: item.examDateLabel || "Data nao definida",
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
                    console.warn("Nao foi possivel sincronizar a biblioteca premium", error);
                    return store.getState().studyLibrary;
                })
                .finally(() => {
                    this.librarySyncPromise = null;
                });

            return this.librarySyncPromise;
        },

        async runHomeAction(action = "") {
            const requestedAction = String(action || "").trim();

            if (!requestedAction) {
                return false;
            }

            window.RotaNotaPremiumHomeAction = "";

            if (!this.root) {
                return false;
            }

            if (requestedAction === "pdf-upload") {
                await this.handleAction("open-file-picker", {});
                return true;
            }

            if (requestedAction === "pdf-resume") {
                await this.handleAction("resume-latest-study", {});
                this.render();
                return true;
            }

            if (requestedAction === "pdf-library") {
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
                    message: "Estamos aguardando a confirmacao segura do webhook para liberar o premium. Se o pagamento foi aprovado, a liberacao final entra na proxima etapa operacional."
                },
                pending: {
                    tone: "premium",
                    title: "Pagamento em analise",
                    message: "O Mercado Pago marcou este pagamento como pendente. Assim que houver confirmacao, o acesso premium podera ser liberado pelo servidor."
                },
                failure: {
                    tone: "premium",
                    title: "Pagamento nÃ£o concluÃ­do",
                    message: "O pagamento nÃ£o foi aprovado ou foi cancelado. VocÃª pode tentar novamente quando quiser."
                }
            };
            const note = messages[paymentReturn.status] || messages.pending;

            paymentReturn.consumed = true;
            store.setPremiumOffer({
                eyebrow: "RotaNota Premium",
                title: paymentReturn.status === "success"
                    ? "Pagamento recebido. Falta a confirmacao segura."
                    : "Finalize seu acesso premium com seguranÃ§a.",
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
                    title: "Pagamento nao concluido",
                    message: "O pagamento foi cancelado ou nao foi aprovado. Quando quiser, voce pode tentar novamente sem perder sua trilha."
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
                    eyebrow: "RotaNota Premium",
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
                            message: "Pagamento confirmado. Seus recursos premium ja estao ativos e sua trilha continua do ponto onde voce parou."
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
                    message: "Nao encontrei o identificador do PDF para preparar a conversao premium."
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
                    : (currentState.pdfSyncError || "Nao consegui sincronizar o PDF premium para a leitura por IA.")
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
                !window.PremiumStudyPdfTextExtractor ||
                typeof window.PremiumStudyPdfTextExtractor.extractText !== "function"
            ) {
                return {
                    text: "",
                    status: "missing_local_pdf",
                    pageCount: expectedPageCount
                };
            }

            const localExtraction = await window.PremiumStudyPdfTextExtractor.extractText(materialFile, {
                maxChars: Number(options.maxChars || 40000) || 40000,
                maxPages: Number(options.maxPages || 24) || 24
            });

            store.setMaterialExtraction(localExtraction);

            const extraction = {
                text: localExtraction.text || "",
                status: localExtraction.status || "empty_text",
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
                store.setMaterialExtraction(aiResult);
                extraction = {
                    text: aiResult.text,
                    status: aiResult.status || "extracted_ai",
                    pageCount: aiResult.pageCount || expectedPageCount
                };
                await this.saveCachedMaterialText({
                    materialHash: state.materialHash || "",
                    materialName: state.materialName || "",
                    pageCount: aiResult.pageCount || expectedPageCount,
                    text: aiResult.text,
                    status: aiResult.status || "extracted_ai",
                    source: aiResult.source || "ai_inline_pdf",
                    quality: aiResult.quality || "full",
                    warnings: aiResult.warnings || []
                });
                return aiResult.text;
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

        textToPdfWorkbenchHtml(text) {
            return this.escapePdfWorkbenchHtml(text).replace(/\r?\n/g, "<br>");
        },

        getPdfWorkbenchEditor() {
            return this.root
                ? this.root.querySelector("#premiumPdfWorkbenchEditor")
                : null;
        },

        getPdfWorkbenchEditorText() {
            const editor = this.getPdfWorkbenchEditor();
            return editor
                ? String(editor.innerText || "").replace(/\r/g, "")
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
                    console.warn("Nao consegui exportar as anotacoes do PDF", error);
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
                store.setPdfSyncError(result.message || "Nao foi possivel sincronizar o PDF agora.");
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
                    title: "PDF original indisponivel",
                    message: "Nao encontrei o arquivo original neste navegador nem no servidor."
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
                    title: "Nao consegui abrir o PDF",
                    message: "O viewer nao respondeu a tempo. Tente abrir de novo; se persistir, reenvie o arquivo."
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
                        // Se a promocao nao responder, mantemos a oferta base.
                    });
            }
        },

        async handleSelectedFile(file, input) {
            const store = window.PremiumStudyStore;
            const router = window.PremiumStudyRouter;
            const validator = window.PremiumStudyPdfValidator;
            const validation = validator
                ? await validator.validate(file, store.getState())
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
                        title: "PDF acima do limite grÃ¡tis",
                        message: validation.message
                    });
                } else {
                    store.setSessionNote({
                        step: store.getState().step,
                        tone: "premium",
                        title: "PDF nao aceito",
                        message: validation.message || "Tente um PDF textual valido."
                    });
                }

                this.render();
                return;
            }

            this.activeMaterialFile = file;
            this.activeMaterialAssetId = "";
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
                    mimeType: file.type || "application/pdf",
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
                pageCount: validation.pageCount,
                materialHash,
                pdfAssetId: materialHash,
                pdfAssetHash: materialHash,
                pdfSource: "local",
                pdfSyncStatus: store.getState().accountAuthenticated ? "syncing" : "local_only"
            });
            this.trackGrowth("pdf_upload_success", {
                materialHash,
                pageCount: Number(validation.pageCount || 0),
                metadata: {
                    fileName: file.name || ""
                }
            });
            router.goTo("exam-date");
            this.render();
            this.schedulePersist(80);
            this.syncPdfAssetToServer(file).catch((error) => console.error(error));
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
                                progressLabel: "Sua trilha inicial estÃ¡ pronta para vocÃª escolher como quer entrar no conteÃºdo."
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
                    ...(Array.isArray(learn.hotPoints) ? learn.hotPoints : [])
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

            blocks.forEach((block) => {
                const practice = block && block.practice ? block.practice : {};
                const exam = block && block.exam ? block.exam : {};
                const trueFalseItems = Array.isArray(practice.trueFalse) ? practice.trueFalse : [];

                (Array.isArray(exam.questions) ? exam.questions : []).forEach((question) => {
                    pushQuestion(question, {
                        rationale: `Questao montada a partir do bloco ${block && block.title ? block.title : "principal"}.`
                    });
                });

                (Array.isArray(practice.quiz) ? practice.quiz : []).forEach((question) => {
                    pushQuestion(question, {
                        rationale: `Questao reaproveitada do treino do bloco ${block && block.title ? block.title : "principal"}.`
                    });
                });

                trueFalseItems.forEach((item) => {
                    if (!item || !item.statement) {
                        return;
                    }

                    pushQuestion({
                        prompt: String(item.statement || "").trim(),
                        options: ["Verdadeiro", "Falso"],
                        correctIndex: item.answer ? 0 : 1,
                        rationale: String(item.rationale || `Validacao de conceito do bloco ${block && block.title ? block.title : "principal"}.`).trim()
                    });
                });
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

        buildLowQualityPdfNote(step = "mode-select", options = {}) {
            const needsPremium = options.needsPremium === true;

            return {
                step,
                tone: needsPremium ? "premium" : "info",
                title: needsPremium
                    ? "Este PDF parece imagem e ainda precisa da conversao premium"
                    : "Ainda nao consegui montar os modos com este PDF",
                message: needsPremium
                    ? "O arquivo parece foto, scan ou imagem com pouca camada de texto. O gratis pode ate montar parte do Aprender, mas para abrir o PDF em Texto e transformar esse material em base estavel para Aprender, Praticar e Prova, o premium usa IA."
                    : "O PDF em Texto ja abriu, mas Aprender, Praticar e Prova ainda nao ficaram prontos. Vamos tentar montar esses modos a partir do texto extraido; se nao der, o arquivo provavelmente esta com qualidade baixa demais."
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
                message: options.message || "Aguarde um instante enquanto o sistema organiza a base do material antes de abrir a proxima aba.",
                labels: Array.isArray(options.labels) ? options.labels : ["Lendo base", "Montando aprender", "Montando pratica", "Montando prova"],
                progress: Number.isFinite(Number(options.progress)) ? Number(options.progress) : null,
                startedAt: new Date().toISOString()
            };

            store.setModePreparation(preparation);
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
                    dailyMinutes
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
                message: "Seu documento parece imagem ou escaneado. Agora que o premium foi liberado, estamos convertendo o texto e atualizando Aprender, Praticar e Prova antes de liberar a proxima tela.",
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
                    aiProgressLabel: "O premium esta convertendo o PDF em texto editavel com ajuda da IA."
                });

                const normalizedText = String(extractedText || "").trim();
                if (!normalizedText) {
                    store.setSessionNote({
                        step: targetStep,
                        tone: "premium",
                        title: "Nao consegui converter o PDF agora",
                        message: "A liberacao premium foi concluida, mas este PDF em imagem ainda nao gerou texto suficiente. Tente novamente em instantes ou use um arquivo mais nitido."
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
                        message: "O PDF foi convertido em texto editavel. Como voce ja tinha progresso na trilha, mantivemos seus modos atuais sem regenerar os blocos."
                    });
                    this.schedulePersist(120);
                    return {
                        ok: true,
                        status: "text_ready_only"
                    };
                }

                store.patch({
                    progressLabel: "Atualizando Aprender, Praticar e Prova com o texto premium extraido do PDF."
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
                        message: "Aprender, Praticar e Prova foram regenerados a partir do texto extraido deste PDF em imagem."
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
                    message: "O PDF foi convertido em texto editavel. A trilha completa ainda nao foi regenerada agora, mas o texto integral ja ficou disponivel no editor."
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
            const state = store.getState();
            const normalizedTargetStep = targetStep || "mode-select";

            if (state.modePreparation && state.modePreparation.active) {
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

            const sourceText = String(
                state.pdfWorkbenchText ||
                state.materialExtractedText ||
                ""
            ).trim();

            if (!sourceText) {
                store.setSessionNote(this.buildLowQualityPdfNote(normalizedTargetStep, {
                    needsPremium: !state.accessTier || state.accessTier !== "premium"
                }));
                return {
                    ok: false,
                    status: "missing_source_text"
                };
            }

            return this.runModePreparation({
                targetStep: normalizedTargetStep,
                source: options.source || "mode_open_recovery",
                title: "Preparando os modos a partir do PDF em Texto",
                message: "Encontramos texto suficiente no editor. Aguarde um instante enquanto Aprender, Praticar e Prova sao montados antes de abrir a aba escolhida.",
                labels: ["Lendo editor", "Montando aprender", "Montando pratica", "Montando prova"]
            }, async () => {
                const bundleResult = await this.generateBundleFromMaterialText(sourceText, {
                    source: options.source || "mode_open_recovery"
                });

                if (bundleResult && bundleResult.ok && bundleResult.bundle) {
                    store.setSessionNote({
                        step: normalizedTargetStep,
                        tone: "success",
                        title: "Modos atualizados com o texto do PDF",
                        message: "Aprender, Praticar e Prova foram montados a partir do texto extraido do editor."
                    });
                    this.schedulePersist(120);
                    return {
                        ok: true,
                        status: "generated_from_pdf_text"
                    };
                }

                store.setSessionNote(this.buildLowQualityPdfNote(normalizedTargetStep, {
                    needsPremium: false
                }));
                return {
                    ok: false,
                    status: bundleResult && bundleResult.status ? bundleResult.status : "bundle_generation_failed"
                };
            });
        },

        async startAnalysisSequence() {
            this.clearAnalysisTimers();
            const store = window.PremiumStudyStore;
            const state = store.getState();
            store.setAnalysisProgress(12, "running");
            store.patch({
                progressLabel: "Lendo o PDF e preparando uma rota unica de estudo."
            });
            this.render();

            try {
                store.setAnalysisProgress(28, "running");
                this.render();
                const extractedText = await this.ensureMaterialText({
                    maxChars: 22000,
                    maxPages: state.accessTier === "premium" ? 40 : 12,
                    allowAiFallback: false,
                    useCache: false,
                    saveLocalCache: false
                });

                store.setAnalysisProgress(52, "running");
                store.patch({
                    progressLabel: "A IA esta montando blocos, praticas e mini provas a partir do material."
                });
                this.render();

                const result = await this.generateBundleFromMaterialText(extractedText, {
                    source: "analysis_sequence"
                });

                store.setAnalysisProgress(82, "running");
                if (!(result && result.ok && result.bundle)) {
                    store.patch({
                        aiGeneration: {
                            status: result && result.status ? result.status : "fallback",
                            provider: result && result.provider ? result.provider : "",
                            model: result && result.model ? result.model : "",
                            promptVersion: result && result.promptVersion ? result.promptVersion : "",
                            generatedAt: new Date().toISOString()
                        },
                        progressLabel: "Nao consegui acionar a IA agora. Mantive uma rota local para voce continuar estudando."
                    });
                    store.setSessionNote({
                        step: "mode-select",
                        tone: "info",
                        title: "IA em modo fallback",
                        message: "O PDF abriu com o pacote local. Tente novamente mais tarde para gerar conteudo totalmente baseado no texto."
                    });
                }

                store.setAnalysisProgress(100, "done");
                window.PremiumStudyRouter.goTo("mode-select");
                this.render();
                this.schedulePersist(120);
            } catch (error) {
                store.setAnalysisProgress(100, "done");
                store.patch({
                    progressLabel: "A rota local esta pronta. A IA nao respondeu desta vez."
                });
                store.setSessionNote({
                    step: "mode-select",
                    tone: "info",
                    title: "IA indisponivel agora",
                    message: "Mantive uma rota base para voce nao perder o fluxo. Quando a IA responder, ela gera o pacote completo do PDF."
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
                message: "Estamos restaurando o estudo, aplicando o ultimo snapshot salvo e reposicionando voce exatamente no ponto certo.",
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
                store.setBlockTab("aprender");
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
                        maxChars: 40000,
                        maxPages: 24,
                        saveCache: false
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
                            title: "Isto nao e erro: este PDF precisa da conversao premium",
                            message: "Este arquivo parece imagem ou escaneado. No gratis, o editor abre PDFs textuais quando a leitura local funciona. Para transformar este documento em texto editavel com IA, use o premium."
                        });
                        openPremiumOffer("SCANNED_PDF_TEXT");
                        shouldPersist = true;
                        break;
                    } else {
                        workbenchText = await this.ensurePdfWorkbenchText({
                            maxChars: 50000,
                            maxPages: 60,
                            allowAiFallback: true,
                            useCache: true,
                            saveLocalCache: true,
                            syncProgressLabel: "Preparando o PDF premium no servidor antes da leitura integral.",
                            aiProgressLabel: "O premium esta convertendo o PDF em texto editavel com ajuda da IA."
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
                                ? "Nao consegui preparar o PDF em texto"
                                : "Nao consegui extrair o texto",
                            message: fallbackFailure && fallbackFailure.message
                                ? fallbackFailure.message
                                : "Nao encontrei texto suficiente no PDF para abrir o editor agora. Tente novamente mais tarde ou use um arquivo mais nitido."
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
                            title: "Trecho nao encontrado",
                            message: "Nao localizei esse termo no texto extraido."
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
                            title: "Nao consegui copiar",
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
                    const nextTitle = window.prompt("Como voce quer salvar este arquivo?", currentTitle);
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
                        ? "Salvo neste navegador e sincronizado com a sua conta na Biblioteca premium. Hoje a biblioteca ainda nao tem pastas."
                        : "Salvo neste navegador e atualizado no item atual da Biblioteca premium deste navegador. Hoje a biblioteca ainda nao tem pastas."
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
                        message: "Ainda nao encontrei conteudo editado suficiente para gerar o arquivo."
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
                        message: result.message || "Nao consegui gerar os grifos contextualizados neste momento."
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
                            title: "Nao consegui copiar agora",
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
                        message: "O login Google nao esta configurado neste ambiente. O checkout foi liberado mesmo assim."
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
                    : { status: "not_configured", message: "Checkout real ainda nao foi conectado." };

                if (checkout && checkout.ok && checkout.checkoutUrl) {
                    return;
                }

                store.setSessionNote({
                    step: store.getState().step,
                    tone: "premium",
                    title: "Nao foi possivel abrir o checkout",
                    message: checkout.message || "O checkout nao respondeu corretamente agora. Tente de novo em instantes."
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
                    title: "Gerando mais 5 questoes",
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
                            title: "Nao foi possivel gerar agora",
                            message: "A IA nao retornou novas questoes. Tente novamente em alguns instantes."
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
                    message: "A IA esta montando uma prova de nivel com base na sua rota."
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
                        store.clearSessionNote();
                    } else {
                        const fallbackQuestions = this.buildFallbackLevelExamQuestions(levelExam.questionCount || 10);

                        if (fallbackQuestions.length) {
                            store.setLevelExamQuestions({
                                title: "Prova de nivel do material",
                                questions: fallbackQuestions
                            });
                            store.setSessionNote({
                                step: "level-exam",
                                tone: "info",
                                title: "Prova pronta com base na sua trilha",
                                message: "A IA da prova nao respondeu com um conjunto valido agora. Montamos a prova usando as questoes e verificacoes dos blocos que ja estavam prontos."
                            });
                        } else {
                            store.setSessionNote({
                                step: "level-exam",
                                tone: "premium",
                                title: "Nao foi possivel gerar a prova",
                                message: "A IA nao retornou uma prova valida e a trilha ainda nao tinha questoes suficientes para montar um fallback local."
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
                const nextTitle = window.prompt("Como vocÃª quer chamar este estudo?", currentTitle);
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


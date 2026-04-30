window.QuestionsPage = {
    runtimeNotice: "",
    activeDialog: null,
    activeContestQuestionId: "",
    activeSavedBlockId: "",
    launcherHistory: [],
    sessionReturnView: "home",
    syncBridgeBound: false,
    coachStorageKey:
        "questions_ui_coach_v2",
    coachState: {},
    coachDismissedViews: {},
    questionContestDefaultText:
        "Enviar sem comentar",
    smartSubjectEditorKey: "",
    smartSubjectFocusKey: "",
    smartTopicReviewOpen: false,
    smartTopicReviewIndex: 0,
    directSearchTerms: [],
    directSearchInput: "",
    directSearchMatchCount: null,
    directSearchLoading: false,
    directSearchLaunchLoading: false,
    directSearchRefocusPending: false,
    directSearchAutoAddPending: false,
    directSearchAutoStartPending: false,
    simuladoBuilder: null,
    renderFrameId: 0,
    renderQueuedSync: false,
    sessionUseCases: null,
    libraryUseCases: null,
    routeUseCases: null,
    legacySessionFallback: null,
    legacyLibraryFallback: null,
    legacyRecoveryFallback: null,
    launcherSelectors: null,
    contextSynchronization: null,
    launcherViewModels: null,
    contentRepository: null,
    scriptUrl:
        document.currentScript?.src || "",

    data: {
        bases: {
            ESCOLAR: {
                key: "ESCOLAR",
                label: "Escolar",
                note: "Treino curricular por s\u00e9rie, mat\u00e9ria e assunto.",
                available: true
            },
            ENEM: {
                key: "ENEM",
                label: "ENEM",
                note: "Fluxo separado de simulado e treino ENEM. Em preparacao.",
                available: false
            }
        },

        modes: {
            ASSUNTO_UNICO: {
                key: "ASSUNTO_UNICO",
                label: "Assunto unico",
                note: "Foco total em um unico assunto."
            },
            ASSUNTOS_COMBINADOS: {
                key: "ASSUNTOS_COMBINADOS",
                label: "Assuntos combinados",
                note: "Mistura equilibrada de dois ou mais assuntos."
            },
            REFORCO_DIRECIONADO: {
                key: "REFORCO_DIRECIONADO",
                label: "Reforco direcionado",
                note: "Prioriza um assunto principal sem abandonar os demais."
            },
            TREINO_PARA_PROVA: {
                key: "TREINO_PARA_PROVA",
                label: "Treino para prova",
                note: "Sessao misturada com ritmo de revisao global."
            }
        },

        mixStrategies: {
            equilibrada: {
                key: "equilibrada",
                label: "Equilibrada"
            },
            foco_principal: {
                key: "foco_principal",
                label: "Foco principal"
            },
            alternada: {
                key: "alternada",
                label: "Alternada"
            },
            adaptativa: {
                key: "adaptativa",
                label: "Adaptativa"
            }
        },

        smartGoals: {
            continue: {
                key: "continue",
                label: "Continuar",
                note: "Segue no ritmo mais natural para manter consistencia."
            },
            reforcar: {
                key: "reforcar",
                label: "Reforcar",
                note: "Puxa primeiro os pontos mais sensiveis dentro do recorte elegivel."
            },
            misturar: {
                key: "misturar",
                label: "Misturar",
                note: "Abre um bloco mais amplo para revisar sem montar tudo na mao."
            }
        },

        questionTypes: {
            multipla_escolha: {
                key: "multipla_escolha",
                label: "Multipla escolha"
            },
            input: {
                key: "input",
                label: "Input"
            },
            ordenacao: {
                key: "ordenacao",
                label: "Ordenacao"
            },
            comparacao: {
                key: "comparacao",
                label: "Comparacao"
            },
            vf: {
                key: "vf",
                label: "Verdadeiro/Falso"
            }
        },

        amountOptions: [3, 5, 8, 12],
        smartQuestionAmountOptions: [
            5, 15, 30, 50
        ],
        smartTimeAmountOptions: [
            15, 30, 60
        ],
        simuladoDifficultyOptions: [
            {
                key: "facil",
                label: "Facil"
            },
            {
                key: "medio",
                label: "Medio"
            },
            {
                key: "dificil",
                label: "Dificil"
            },
            {
                key: "misturar",
                label: "Misturar"
            }
        ],
        simuladoAmountOptions: [
            5, 10, 15, 20, 30, 50
        ],
        schoolCatalog: [],
        schoolCatalogManifest: null,
        bankStatus: "idle"
    },

    async init() {
        this.launcherHistory = [];
        this.sessionReturnView =
            "home";
        QuestionsStore.load();
        QuestionsContext.load();
        this.resetSimuladoBuilder();
        QuestionsState.init();
        const initialLauncherView =
            QuestionsState.isValidLauncherView(
                window.RotaNotaQuestionsLauncherTarget
            )
                ? String(
                      window.RotaNotaQuestionsLauncherTarget
                  ).trim()
                : "home";
        if (
            window.RotaNotaQuestionsFocusDirectSearch ===
            true
        ) {
            const launchSearchInput =
                String(
                    window.RotaNotaQuestionsDirectSearchInput ||
                        ""
                ).trim();
            this.directSearchInput =
                launchSearchInput;
            this.directSearchAutoAddPending =
                Boolean(launchSearchInput);
            this.directSearchAutoStartPending =
                Boolean(
                    window.RotaNotaQuestionsDirectSearchAutoStart &&
                        launchSearchInput
                );
            this.directSearchLaunchLoading =
                this.directSearchAutoStartPending;
            this.directSearchRefocusPending = true;
            window.RotaNotaQuestionsFocusDirectSearch =
                false;
            window.RotaNotaQuestionsDirectSearchInput =
                "";
            window.RotaNotaQuestionsDirectSearchAutoStart =
                false;
        }
        this.loadCoachState();
        QuestionsUI.init(this);
        this.bindSyncBridge();
        this.clearRuntimeNotice();
        await this.ensureSessionUseCases();
        if (!this.sessionUseCases) {
            await this.ensureLegacySessionFallback();
        }
        await this.ensureLibraryUseCases();
        if (!this.libraryUseCases) {
            await this.ensureLegacyLibraryFallback();
            await this.ensureLegacyRecoveryFallback();
        }
        await this.ensureRouteUseCases();
        await this.ensureLauncherSelectors();
        await this.ensureContextSynchronization();
        await this.ensureLauncherViewModels();

        if (
            this.data.bankStatus ===
                "ready" &&
            (
                this.data.schoolCatalog.length ||
                this.data
                    .schoolCatalogManifest
                    ?.topics?.length
            )
        ) {
            this.syncContext();
            if (this.consumePendingSync()) {
                return;
            }
            this.openLauncher(
                initialLauncherView
            );
            this.applyDirectSearchLaunchIntent();
            return;
        }

        this.data.bankStatus = "loading";
        QuestionsState.openLauncher(
            initialLauncherView
        );
        this.registerCoachView(
            initialLauncherView
        );
        this.render();

        await this.loadSchoolCatalog();
        this.syncContext();
        if (this.consumePendingSync()) {
            return;
        }
        this.openLauncher(
            initialLauncherView
        );
        this.applyDirectSearchLaunchIntent();
    },

    async loadSchoolCatalog() {
        try {
            const fallbackUrl =
                new URL(
                    "./questions/questions.js",
                    window.location.href
                ).href;
            const baseUrl =
                this.scriptUrl ||
                fallbackUrl;
            const bootstrapUrl =
                new URL(
                    "./app/bootstrap/questionsModuleBootstrap.mjs",
                    baseUrl
                ).href;
            const {
                bootstrapQuestionsModule
            } = await import(
                bootstrapUrl
            );
            const bundle =
                await bootstrapQuestionsModule(
                    {
                        runtimeBaseUrl:
                            baseUrl
                    }
                );

            this.data.schoolCatalog =
                Array.isArray(
                    bundle.catalog
                )
                    ? [...bundle.catalog]
                    : [];
            this.data.schoolCatalogManifest =
                bundle.manifest &&
                typeof bundle.manifest ===
                    "object"
                    ? {
                        ...bundle.manifest
                    }
                    : null;
            this.contentRepository =
                bundle.repositories
                    ?.content || null;
            QuestionsStore.setProfileStateRepository(
                bundle.repositories
                    ?.profileState || null,
                {
                    reload: true
                }
            );
            QuestionsStore.setSmartProfilesRepository(
                bundle.repositories
                    ?.smartProfiles || null,
                {
                    reload: true
                }
            );
            QuestionsStore.setSavedBlocksRepository(
                bundle.repositories
                    ?.savedBlocks || null,
                {
                    reload: true
                }
            );
            QuestionsStore.setRunsRepository(
                bundle.repositories?.runs ||
                    null,
                {
                    reload: true
                }
            );
            this.sessionUseCases?.setContentRepository?.(
                this.contentRepository
            );
            this.data.bankStatus = "ready";
        } catch (error) {
            this.data.schoolCatalog = [];
            this.data.schoolCatalogManifest =
                null;
            this.contentRepository = null;
            this.data.bankStatus = "error";
            this.runtimeNotice =
                `Nao foi possivel carregar o banco escolar do modulo de questoes. ${error?.message || ""}`.trim();
            console.error(
                "[Questions] Falha ao carregar banco escolar:",
                error
            );
        }
    },

    async ensureDetailedCatalogLoaded() {
        if (
            Array.isArray(
                this.data.schoolCatalog
            ) &&
            this.data.schoolCatalog.length
        ) {
            return this.data.schoolCatalog;
        }

        if (
            !this.contentRepository ||
            typeof this.contentRepository
                .ensureCatalogLoaded !==
                "function"
        ) {
            return this.data.schoolCatalog;
        }

        const catalog =
            await this.contentRepository.ensureCatalogLoaded();

        this.data.schoolCatalog = Array.isArray(
            catalog
        )
            ? [...catalog]
            : [];

        return this.data.schoolCatalog;
    },

    async ensureDirectSearchCatalogLoaded(
        terms = []
    ) {
        const cleanTerms = (
            Array.isArray(terms) ? terms : []
        )
            .map((term) =>
                String(term || "").trim()
            )
            .filter(Boolean);

        if (!cleanTerms.length) {
            return this.ensureDetailedCatalogLoaded();
        }

        if (
            this.contentRepository &&
            typeof this.contentRepository
                .ensureTopicsLoaded ===
                "function" &&
            !QuestionsService.isFullCatalogLoaded(
                this
            ) &&
            QuestionsService.hasCatalogManifest(
                this
            )
        ) {
            const topicIds =
                QuestionsService.getTopicOptions(
                    this
                )
                    .filter((topic) =>
                        cleanTerms.some((term) =>
                            QuestionsService.matchesFuzzySearch(
                                [
                                    topic.label,
                                    topic.subjectLabel,
                                    topic.eixo,
                                    topic.frente,
                                    topic.searchIndex
                                ].join(" "),
                                term
                            )
                        )
                    )
                    .map((topic) => topic.key)
                    .filter(Boolean);

            if (topicIds.length) {
                const catalog =
                    await this.contentRepository.ensureTopicsLoaded(
                        topicIds
                    );

                this.data.schoolCatalog =
                    Array.isArray(catalog)
                        ? [...catalog]
                        : [];

                return this.data.schoolCatalog;
            }
        }

        return this.ensureDetailedCatalogLoaded();
    },

    async ensureRouteCatalogLoaded(
        routeContext = null
    ) {
        const context =
            routeContext &&
            typeof routeContext === "object"
                ? routeContext
                : QuestionsContext.get();
        const topicIds = Array.isArray(
            context?.topicos
        )
            ? context.topicos.filter(
                Boolean
            )
            : [];

        if (
            !topicIds.length ||
            !this.contentRepository ||
            typeof this.contentRepository
                .ensureTopicsLoaded !==
                "function"
        ) {
            return this.ensureDetailedCatalogLoaded();
        }

        const catalog =
            await this.contentRepository.ensureTopicsLoaded(
                topicIds
            );

        this.data.schoolCatalog = Array.isArray(
            catalog
        )
            ? [...catalog]
            : [];

        return this.data.schoolCatalog;
    },

    syncCatalogFromRepository() {
        if (
            !this.contentRepository ||
            typeof this.contentRepository
                .getCatalog !== "function"
        ) {
            return this.data.schoolCatalog;
        }

        const catalog =
            this.contentRepository.getCatalog();

        this.data.schoolCatalog = Array.isArray(
            catalog
        )
            ? [...catalog]
            : [];

        return this.data.schoolCatalog;
    },

    async ensureSessionUseCases() {
        if (this.sessionUseCases) {
            return this.sessionUseCases;
        }

        try {
            const fallbackUrl =
                new URL(
                    "./questions/questions.js",
                    window.location.href
                ).href;
            const baseUrl =
                this.scriptUrl ||
                fallbackUrl;
            const applicationUrl =
                new URL(
                    "./app/application/sessionUseCases.mjs",
                    baseUrl
                ).href;
            const {
                createQuestionsSessionUseCases
            } = await import(
                applicationUrl
            );

            this.sessionUseCases =
                createQuestionsSessionUseCases(
                    {
                        page: this,
                        dependencies: {
                            QuestionsState,
                            QuestionsStore,
                            QuestionsContext,
                            QuestionsService,
                            QuestionsUI,
                            QuestionsContentRepository:
                                this.contentRepository
                        }
                    }
                );
        } catch (error) {
            this.sessionUseCases = null;
            console.warn(
                "[Questions] Falha ao carregar session use cases do v2. Mantendo fallback legado.",
                error
            );
        }

        return this.sessionUseCases;
    },

    async ensureLibraryUseCases() {
        if (this.libraryUseCases) {
            return this.libraryUseCases;
        }

        try {
            const fallbackUrl =
                new URL(
                    "./questions/questions.js",
                    window.location.href
                ).href;
            const baseUrl =
                this.scriptUrl ||
                fallbackUrl;
            const applicationUrl =
                new URL(
                    "./app/application/libraryUseCases.mjs",
                    baseUrl
                ).href;
            const {
                createQuestionsLibraryUseCases
            } = await import(
                applicationUrl
            );

            this.libraryUseCases =
                createQuestionsLibraryUseCases(
                    {
                        page: this,
                        dependencies: {
                            QuestionsStore,
                            QuestionsContext,
                            QuestionsService
                        }
                    }
                );
        } catch (error) {
            this.libraryUseCases = null;
            console.warn(
                "[Questions] Falha ao carregar library use cases do v2. Mantendo fallback legado.",
                error
            );
        }

        return this.libraryUseCases;
    },

    async ensureLegacySessionFallback() {
        if (this.legacySessionFallback) {
            return this.legacySessionFallback;
        }

        try {
            const fallbackUrl =
                new URL(
                    "./questions/questions.js",
                    window.location.href
                ).href;
            const baseUrl =
                this.scriptUrl ||
                fallbackUrl;
            const applicationUrl =
                new URL(
                    "./app/application/legacySessionFallback.mjs",
                    baseUrl
                ).href;
            const {
                createQuestionsLegacySessionFallback
            } = await import(
                applicationUrl
            );

            this.legacySessionFallback =
                createQuestionsLegacySessionFallback(
                    {
                        page: this,
                        dependencies: {
                            QuestionsState,
                            QuestionsStore,
                            QuestionsContext,
                            QuestionsService,
                            QuestionsUI
                        }
                    }
                );
        } catch (error) {
            this.legacySessionFallback =
                null;
            console.warn(
                "[Questions] Falha ao carregar fallback legado de session. Mantendo implementacao inline.",
                error
            );
        }

        return this.legacySessionFallback;
    },

    async ensureLegacyLibraryFallback() {
        if (this.legacyLibraryFallback) {
            return this.legacyLibraryFallback;
        }

        try {
            const fallbackUrl =
                new URL(
                    "./questions/questions.js",
                    window.location.href
                ).href;
            const baseUrl =
                this.scriptUrl ||
                fallbackUrl;
            const applicationUrl =
                new URL(
                    "./app/application/legacyLibraryFallback.mjs",
                    baseUrl
                ).href;
            const {
                createQuestionsLegacyLibraryFallback
            } = await import(
                applicationUrl
            );

            this.legacyLibraryFallback =
                createQuestionsLegacyLibraryFallback(
                    {
                        page: this,
                        dependencies: {
                            QuestionsStore,
                            QuestionsContext,
                            QuestionsService
                        }
                    }
                );
        } catch (error) {
            this.legacyLibraryFallback =
                null;
            console.warn(
                "[Questions] Falha ao carregar fallback legado de library. Mantendo implementacao inline.",
                error
            );
        }

        return this.legacyLibraryFallback;
    },

    async ensureRouteUseCases() {
        if (this.routeUseCases) {
            return this.routeUseCases;
        }

        try {
            const fallbackUrl =
                new URL(
                    "./questions/questions.js",
                    window.location.href
                ).href;
            const baseUrl =
                this.scriptUrl ||
                fallbackUrl;
            const applicationUrl =
                new URL(
                    "./app/application/routeUseCases.mjs",
                    baseUrl
                ).href;
            const {
                createQuestionsRouteUseCases
            } = await import(
                applicationUrl
            );

            this.routeUseCases =
                createQuestionsRouteUseCases(
                    {
                        page: this,
                        dependencies: {
                            QuestionsContext,
                            QuestionsService
                        }
                    }
                );
        } catch (error) {
            this.routeUseCases = null;
            console.warn(
                "[Questions] Falha ao carregar route use cases do v2. Mantendo fallback legado.",
                error
            );
        }

        return this.routeUseCases;
    },

    async ensureLegacyRecoveryFallback() {
        if (this.legacyRecoveryFallback) {
            return this.legacyRecoveryFallback;
        }

        try {
            const fallbackUrl =
                new URL(
                    "./questions/questions.js",
                    window.location.href
                ).href;
            const baseUrl =
                this.scriptUrl ||
                fallbackUrl;
            const applicationUrl =
                new URL(
                    "./app/application/legacyRecoveryFallback.mjs",
                    baseUrl
                ).href;
            const {
                createQuestionsLegacyRecoveryFallback
            } = await import(
                applicationUrl
            );

            this.legacyRecoveryFallback =
                createQuestionsLegacyRecoveryFallback(
                    {
                        page: this,
                        dependencies: {
                            QuestionsStore,
                            QuestionsState,
                            QuestionsContext
                        }
                    }
                );
        } catch (error) {
            this.legacyRecoveryFallback =
                null;
            console.warn(
                "[Questions] Falha ao carregar fallback legado de recovery. Mantendo implementacao inline.",
                error
            );
        }

        return this.legacyRecoveryFallback;
    },

    async ensureLauncherSelectors() {
        if (this.launcherSelectors) {
            return this.launcherSelectors;
        }

        try {
            const fallbackUrl =
                new URL(
                    "./questions/questions.js",
                    window.location.href
                ).href;
            const baseUrl =
                this.scriptUrl ||
                fallbackUrl;
            const selectorsUrl =
                new URL(
                    "./app/application/launcherSelectors.mjs",
                    baseUrl
                ).href;
            const {
                createQuestionsLauncherSelectors
            } = await import(
                selectorsUrl
            );

            this.launcherSelectors =
                createQuestionsLauncherSelectors(
                    {
                        page: this,
                        dependencies: {
                            QuestionsContext,
                            QuestionsService
                        }
                    }
                );
        } catch (error) {
            this.launcherSelectors =
                null;
            console.warn(
                "[Questions] Falha ao carregar launcher selectors do v2. Mantendo fallback legado.",
                error
            );
        }

        return this.launcherSelectors;
    },

    async ensureContextSynchronization() {
        if (
            this.contextSynchronization
        ) {
            return this.contextSynchronization;
        }

        try {
            const fallbackUrl =
                new URL(
                    "./questions/questions.js",
                    window.location.href
                ).href;
            const baseUrl =
                this.scriptUrl ||
                fallbackUrl;
            const applicationUrl =
                new URL(
                    "./app/application/contextSynchronization.mjs",
                    baseUrl
                ).href;
            const {
                createQuestionsContextSynchronization
            } = await import(
                applicationUrl
            );

            this.contextSynchronization =
                createQuestionsContextSynchronization(
                    {
                        page: this,
                        dependencies: {
                            QuestionsContext,
                            QuestionsService
                        }
                    }
                );
        } catch (error) {
            this.contextSynchronization =
                null;
            console.warn(
                "[Questions] Falha ao carregar context synchronization do v2. Mantendo fallback legado.",
                error
            );
        }

        return this.contextSynchronization;
    },

    async ensureLauncherViewModels() {
        if (this.launcherViewModels) {
            return this.launcherViewModels;
        }

        try {
            const fallbackUrl =
                new URL(
                    "./questions/questions.js",
                    window.location.href
                ).href;
            const baseUrl =
                this.scriptUrl ||
                fallbackUrl;
            const applicationUrl =
                new URL(
                    "./app/application/launcherViewModels.mjs",
                    baseUrl
                ).href;
            const {
                createQuestionsLauncherViewModels
            } = await import(
                applicationUrl
            );

            this.launcherViewModels =
                createQuestionsLauncherViewModels(
                    {
                        page: this,
                        dependencies: {
                            QuestionsState,
                            QuestionsStore,
                            QuestionsContext,
                            QuestionsService
                        }
                    }
                );
        } catch (error) {
            this.launcherViewModels =
                null;
            console.warn(
                "[Questions] Falha ao carregar launcher view models do v2. Mantendo fallback legado.",
                error
            );
        }

        return this.launcherViewModels;
    },

    getModeConfig(modeKey = null) {
        const ctx =
            QuestionsContext.get();
        const key =
            modeKey || ctx.mode;

        return (
            this.data.modes[key] ||
            this.data.modes.ASSUNTO_UNICO
        );
    },

    bindSyncBridge() {
        if (this.syncBridgeBound) {
            return;
        }

        this.syncBridgeBound = true;

        document.addEventListener(
            "questions:apply-route",
            (event) => {
                this.applyExternalRoute(
                    event.detail || {}
                );
            }
        );

        window.QuestionsBridge = {
            applyRoute: (payload = {}) =>
                this.applyExternalRoute(
                    payload
                ),
            queueRoute: (payload = {}) =>
                this.queueExternalRoute(
                    payload
                ),
            getSnapshot: () =>
                this.getSyncSnapshot()
        };
    },

    dispatchSyncEvent(
        name,
        detail = {}
    ) {
        document.dispatchEvent(
            new CustomEvent(name, {
                detail: {
                    ...(detail || {}),
                    snapshot:
                        this.getSyncSnapshot()
                }
            })
        );
    },

    getSyncSnapshot() {
        return QuestionsService.buildSyncSnapshot(
            this
        );
    },

    queueExternalRoute(
        payload = {}
    ) {
        if (
            this.routeUseCases
                ?.queueExternalRoute
        ) {
            return this.routeUseCases.queueExternalRoute(
                payload
            );
        }

        QuestionsContext.setPendingSync(
            payload,
            true
        );
        this.dispatchSyncEvent(
            "questions:route-queued",
            {
                source:
                    payload?.source || ""
            }
        );
    },

    consumePendingSync() {
        const pending =
            QuestionsContext.get()
                .pendingSync;

        if (!pending) {
            return false;
        }

        QuestionsContext.consumePendingSync();
        return this.applyExternalRoute(
            pending
        );
    },

    applyExternalRoute(
        payload = {}
    ) {
        if (
            this.routeUseCases
                ?.applyExternalRoute
        ) {
            return this.routeUseCases.applyExternalRoute(
                payload
            );
        }

        const normalized =
            QuestionsService.normalizeSyncPayload(
                this,
                payload
            );

        if (!normalized) {
            return false;
        }

        QuestionsContext.replace(
            {
                ...QuestionsContext.get(),
                ...normalized.context,
                pendingSync: null
            },
            false
        );

        this.clearRuntimeNotice();
        this.syncContext();
        this.dispatchSyncEvent(
            "questions:route-applied",
            {
                source:
                    normalized.source,
                intent:
                    normalized.intent
            }
        );

        if (normalized.autoStart) {
            this.startSession();
            return true;
        }

        this.openLauncher("specific");
        return true;
    },

    syncContext() {
        if (
            this.contextSynchronization
                ?.syncContext
        ) {
            return this.contextSynchronization.syncContext();
        }

        const snapshot =
            QuestionsContext.get();
        const series =
            QuestionsService.getSeriesOptions(
                this
            );
        const validSeries =
            series.map((item) => item.key);
        const serie =
            validSeries.includes(
                Number(snapshot.serie)
            )
                ? Number(snapshot.serie)
                : (validSeries[0] || 1);

        const subjects =
            QuestionsService.getSubjectOptions(
                this,
                serie
            );
        const validSubjects =
            subjects.map((item) => item.key);
        const selectedSubjectRecord =
            subjects.find(
                (item) =>
                    item.key ===
                    snapshot.materia
            ) || null;
        const firstReadySubject =
            subjects.find(
                (item) => item.hasQuestions
            )?.key || "";
        const materia =
            selectedSubjectRecord &&
            (
                selectedSubjectRecord
                    .hasQuestions ||
                !firstReadySubject
            )
                ? snapshot.materia
                : (
                    firstReadySubject ||
                    validSubjects[0] ||
                    ""
                );

        const topics =
            QuestionsService.getTopicOptions(
                this,
                {
                    serie,
                    materia
                }
            );
        const validTopics =
            topics.map((item) => item.key);
        const readyTopicKeys = topics
            .filter((item) => item.hasQuestions)
            .map((item) => item.key);
        const firstReadyTopic =
            topics.find(
                (item) => item.hasQuestions
            )?.key || "";
        let selectedTopics =
            Array.isArray(snapshot.topicos)
                ? snapshot.topicos.filter(
                    (topicKey) =>
                        validTopics.includes(
                            topicKey
                        )
                    )
                : [];

        if (
            readyTopicKeys.length &&
            selectedTopics.length
        ) {
            const selectedReadyTopics =
                selectedTopics.filter(
                    (topicKey) =>
                        readyTopicKeys.includes(
                            topicKey
                        )
                );

            if (selectedReadyTopics.length) {
                selectedTopics =
                    selectedReadyTopics;
            } else {
                selectedTopics = [];
            }
        }

        const mode =
            this.data.modes[
                snapshot.mode
            ]
                ? snapshot.mode
                : "ASSUNTO_UNICO";

        if (
            mode === "ASSUNTO_UNICO" &&
            selectedTopics.length > 1
        ) {
            selectedTopics = [
                selectedTopics[0]
            ];
        }

        if (
            !selectedTopics.length &&
            validTopics.length &&
            mode === "ASSUNTO_UNICO"
        ) {
            selectedTopics = [
                firstReadyTopic ||
                    validTopics[0]
            ];
        }

        let focoPrincipal =
            snapshot.focoPrincipal &&
            selectedTopics.includes(
                snapshot.focoPrincipal
            )
                ? snapshot.focoPrincipal
                : null;

        if (
            mode ===
            "REFORCO_DIRECIONADO" &&
            !focoPrincipal &&
            selectedTopics.length
        ) {
            focoPrincipal =
                selectedTopics[0];
        }

        const quantidadeQuestoes =
            Math.max(
                1,
                Number(
                    snapshot.quantidadeQuestoes ||
                        snapshot.smartQuestionCount
                ) || 5
            );

        const allowedStrategies =
            QuestionsService.getMixStrategies(
                this,
                mode
            ).map((item) => item.key);
        const estrategiaMistura =
            allowedStrategies.includes(
                snapshot.estrategiaMistura
            )
                ? snapshot.estrategiaMistura
                : (
                    mode ===
                    "REFORCO_DIRECIONADO"
                        ? "foco_principal"
                        : "equilibrada"
                );

        const pesos = {};
        selectedTopics.forEach((topicKey) => {
            pesos[topicKey] =
                Number(
                    snapshot.pesos?.[topicKey]
                ) || (
                    focoPrincipal ===
                    topicKey
                        ? 2
                        : 1
                );
        });

        const normalizedContext = {
            ...snapshot,
            mode,
            base:
                this.data.bases[
                    snapshot.base
                ]?.available
                    ? snapshot.base
                    : "ESCOLAR",
            serie,
            materia,
            topicos: selectedTopics,
            focoPrincipal,
            pesos,
            topicSearch:
                String(
                    snapshot.topicSearch || ""
                ).trim(),
            onlyReadyTopics:
                snapshot.onlyReadyTopics !==
                false,
            quantidadeQuestoes,
            estrategiaMistura
        };
        const nextContext =
            QuestionsContext.buildState(
                normalizedContext
            );
        const hasChanged =
            JSON.stringify(snapshot) !==
            JSON.stringify(nextContext);

        QuestionsContext.replace(
            nextContext,
            hasChanged
        );

        return QuestionsContext.get();
    },

    updateContext(patch = {}) {
        if (
            this.routeUseCases
                ?.updateContext
        ) {
            return this.routeUseCases.updateContext(
                patch
            );
        }

        const current =
            QuestionsContext.get();
        const next = {
            ...current,
            ...(patch || {})
        };

        if (
            Object.prototype.hasOwnProperty.call(
                patch,
                "serie"
            )
        ) {
            next.materia = "";
            next.topicos = [];
            next.focoPrincipal = null;
            next.pesos = {};
        }

        if (
            Object.prototype.hasOwnProperty.call(
                patch,
                "materia"
            )
        ) {
            next.topicos = [];
            next.focoPrincipal = null;
            next.pesos = {};
        }

        if (
            Object.prototype.hasOwnProperty.call(
                patch,
                "mode"
            )
        ) {
            if (
                patch.mode ===
                "ASSUNTO_UNICO"
            ) {
                next.topicos =
                    Array.isArray(
                        next.topicos
                    ) &&
                    next.topicos.length
                        ? [next.topicos[0]]
                        : [];
                next.focoPrincipal = null;
                next.estrategiaMistura =
                    "equilibrada";
            }

            if (
                patch.mode ===
                "REFORCO_DIRECIONADO"
            ) {
                next.estrategiaMistura =
                    "foco_principal";
            }

            if (
                patch.mode ===
                "TREINO_PARA_PROVA"
            ) {
                next.estrategiaMistura =
                    "equilibrada";
            }
        }

        QuestionsContext.replace(
            next,
            false
        );
        this.clearRuntimeNotice();
        this.syncContext();
        this.render();
        this.dispatchSyncEvent(
            "questions:route-updated"
        );
    },

    resolveQuestionList(
        questionIds = [],
        fallbackSnapshot = []
    ) {
        if (
            this.contextSynchronization
                ?.resolveQuestionList
        ) {
            return this.contextSynchronization.resolveQuestionList(
                questionIds,
                fallbackSnapshot
            );
        }

        const ids = Array.isArray(questionIds)
            ? questionIds.filter(Boolean)
            : [];

        if (
            ids.length &&
            this.contentRepository &&
            typeof this.contentRepository
                .findQuestionsByIds ===
                "function"
        ) {
            const resolved =
                this.contentRepository.findQuestionsByIds(
                    ids
                );

            if (
                Array.isArray(resolved) &&
                resolved.length === ids.length
            ) {
                return [...resolved];
            }
        }

        return Array.isArray(
            fallbackSnapshot
        ) && fallbackSnapshot.length
            ? [...fallbackSnapshot]
            : [];
    },

    setBase(baseKey) {
        if (
            this.routeUseCases?.setBase
        ) {
            return this.routeUseCases.setBase(
                baseKey
            );
        }

        const base =
            this.data.bases?.[baseKey];

        if (!base) {
            return;
        }

        if (!base.available) {
            this.runtimeNotice =
                "A base ENEM vai ficar em um fluxo separado. O botao ja esta preparado, mas a entrega entra em outra etapa.";
            this.render();
            return;
        }

        this.updateContext({
            base: base.key
        });
    },

    toggleTopic(topicKey) {
        if (
            this.routeUseCases
                ?.toggleTopic
        ) {
            return this.routeUseCases.toggleTopic(
                topicKey
            );
        }

        const ctx =
            QuestionsContext.get();

        if (
            ctx.mode === "ASSUNTO_UNICO"
        ) {
            this.updateContext({
                topicos: [topicKey],
                focoPrincipal: null
            });
            return;
        }

        const currentTopics =
            Array.isArray(ctx.topicos)
                ? [...ctx.topicos]
                : [];
        const nextTopics =
            currentTopics.includes(topicKey)
                ? currentTopics.filter(
                    (item) =>
                        item !== topicKey
                )
                : [
                    ...currentTopics,
                    topicKey
                ];

        this.updateContext({
            topicos: nextTopics,
            focoPrincipal:
                nextTopics.includes(
                    ctx.focoPrincipal
                )
                    ? ctx.focoPrincipal
                    : null
        });
    },

    setFocusPrincipal(topicKey) {
        if (
            this.routeUseCases
                ?.setFocusPrincipal
        ) {
            return this.routeUseCases.setFocusPrincipal(
                topicKey
            );
        }

        this.updateContext({
            focoPrincipal: topicKey
        });
    },

    selectAllTopics() {
        if (
            this.routeUseCases
                ?.selectAllTopics
        ) {
            return this.routeUseCases.selectAllTopics();
        }

        const ctx =
            QuestionsContext.get();

        if (
            ctx.mode === "ASSUNTO_UNICO"
        ) {
            return;
        }

        const topics =
            QuestionsService.getTopicOptions(
                this,
                {
                    serie: ctx.serie,
                    materia: ctx.materia
                }
            ).map((item) => item.key);

        this.updateContext({
            topicos: topics,
            focoPrincipal:
                topics.includes(
                    ctx.focoPrincipal
                )
                    ? ctx.focoPrincipal
                    : null
        });
    },

    clearTopics() {
        if (
            this.routeUseCases
                ?.clearTopics
        ) {
            return this.routeUseCases.clearTopics();
        }

        const ctx =
            QuestionsContext.get();

        if (
            ctx.mode === "ASSUNTO_UNICO"
        ) {
            return;
        }

        this.updateContext({
            topicos: [],
            focoPrincipal: null
        });
    },

    getRuntimeNotice() {
        return this.runtimeNotice || "";
    },

    clearRuntimeNotice() {
        this.runtimeNotice = "";
    },

    createSimuladoBuilderState(
        serie = null
    ) {
        const safeSerie =
            Number(serie) || null;

        return {
            serie: safeSerie,
            draft: {
                subjectKey: "",
                topicKey: "",
                difficulty: "",
                amount: null
            },
            blocks: [],
            timeLimitMinutes: 30,
            editingIndex: -1
        };
    },

    resetSimuladoBuilder(
        options = {}
    ) {
        const next =
            this.createSimuladoBuilderState(
                options.serie
            );
        const preserveBlocks =
            options.preserveBlocks === true;

        if (
            preserveBlocks &&
            Array.isArray(
                this.simuladoBuilder?.blocks
            )
        ) {
            next.blocks = [
                ...this.simuladoBuilder
                    .blocks
            ];
        }

        if (
            this.simuladoBuilder &&
            Object.prototype.hasOwnProperty.call(
                this.simuladoBuilder,
                "timeLimitMinutes"
            )
        ) {
            next.timeLimitMinutes =
                this.simuladoBuilder
                    .timeLimitMinutes ===
                null
                    ? null
                    : Math.max(
                          30,
                          Number(
                              this
                                  .simuladoBuilder
                                  .timeLimitMinutes
                          ) || 30
                      );
        }

        this.simuladoBuilder = next;
        return this.simuladoBuilder;
    },

    ensureSimuladoBuilder() {
        if (
            !this.simuladoBuilder ||
            typeof this.simuladoBuilder !==
                "object"
        ) {
            return this.resetSimuladoBuilder();
        }

        return this.simuladoBuilder;
    },

    getSimuladoSeriesOptions() {
        return QuestionsService.getSeriesOptions(
            this
        );
    },

    getSimuladoDifficultyOptions() {
        return [
            ...(
                this.data
                    .simuladoDifficultyOptions ||
                []
            )
        ];
    },

    getSimuladoAmountOptions() {
        return [
            ...(
                this.data
                    .simuladoAmountOptions ||
                []
            )
        ];
    },

    getSimuladoTimeLabel(
        timeLimitMinutes = 30
    ) {
        if (timeLimitMinutes === null) {
            return "Indeterminado";
        }

        return `${Math.max(
            30,
            Number(timeLimitMinutes) || 30
        )} min`;
    },

    normalizeSimuladoDifficultyKey(
        value = ""
    ) {
        return String(value || "")
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .trim()
            .toLowerCase();
    },

    questionMatchesSimuladoDifficulty(
        question = null,
        difficultyKey = ""
    ) {
        const target =
            this.normalizeSimuladoDifficultyKey(
                difficultyKey
            );

        if (
            !question ||
            !target ||
            target === "misturar"
        ) {
            return true;
        }

        const label =
            this.normalizeSimuladoDifficultyKey(
                question.difficultyLabel ||
                    ""
            );
        const level = Math.max(
            Number(question.difficulty) || 1,
            1
        );

        if (target === "facil") {
            return (
                label.includes("facil") ||
                level <= 1
            );
        }

        if (target === "medio") {
            return (
                label.includes("medio") ||
                label.includes(
                    "intermedi"
                ) ||
                level === 2
            );
        }

        if (target === "dificil") {
            return (
                label.includes(
                    "dificil"
                ) ||
                label.includes("avanc") ||
                level >= 3
            );
        }

        return true;
    },

    getSimuladoQuestionsForBlock(
        block = {}
    ) {
        const requestedAmount =
            Math.max(
                1,
                Number(block.amount) || 0
            );
        const basePool =
            QuestionsService.getAllQuestions(
                this,
                {
                    serie: block.serie,
                    materia:
                        block.subjectKey
                }
            ).filter(
                (question) =>
                    question.topicKey ===
                    block.topicKey
            );
        const eligiblePool =
            basePool.filter((question) =>
                this.questionMatchesSimuladoDifficulty(
                    question,
                    block.difficulty
                )
            );
        const selectedQuestions =
            QuestionsService.shuffle(
                eligiblePool
            )
                .slice(
                    0,
                    requestedAmount
                )
                .map((question) => ({
                    ...question
                }));

        return {
            requestedAmount,
            availableCount:
                eligiblePool.length,
            selectedQuestions
        };
    },

    async ensureSimuladoCatalogLoaded(
        blocks = []
    ) {
        const topicIds =
            [
                ...new Set(
                    (blocks || [])
                        .map(
                            (block) =>
                                block?.topicKey ||
                                ""
                        )
                        .filter(Boolean)
                )
            ];

        if (
            !topicIds.length ||
            !this.contentRepository ||
            typeof this.contentRepository
                .ensureTopicsLoaded !==
                "function"
        ) {
            return this.ensureDetailedCatalogLoaded();
        }

        const catalog =
            await this.contentRepository.ensureTopicsLoaded(
                topicIds
            );

        this.data.schoolCatalog = Array.isArray(
            catalog
        )
            ? [...catalog]
            : [];

        return this.data.schoolCatalog;
    },

    async buildSimuladoPreview(
        timeLimitMinutes = 30
    ) {
        const state =
            this.ensureSimuladoBuilder();
        const blocks = Array.isArray(
            state.blocks
        )
            ? state.blocks
            : [];

        if (!blocks.length) {
            this.runtimeNotice =
                "Monte pelo menos um bloco antes de consolidar o simulado.";
            this.render();
            return null;
        }

        await this.ensureSimuladoCatalogLoaded(
            blocks
        );

        const blockSummaries = [];
        const sessionList = [];

        blocks.forEach((block, index) => {
            const blockQuestions =
                this.getSimuladoQuestionsForBlock(
                    block
                );

            blockQuestions.selectedQuestions.forEach(
                (question, questionIndex) => {
                    sessionList.push({
                        ...question,
                        simuladoBlockIndex:
                            index,
                        simuladoQuestionIndex:
                            questionIndex
                    });
                }
            );

            blockSummaries.push({
                ...block,
                requestedAmount:
                    blockQuestions
                        .requestedAmount,
                availableCount:
                    blockQuestions
                        .availableCount,
                actualAmount:
                    blockQuestions
                        .selectedQuestions
                        .length
            });
        });

        if (!sessionList.length) {
            this.runtimeNotice =
                "Nao encontrei questoes suficientes para montar esse simulado agora.";
            this.render();
            return null;
        }

        const totalQuestions =
            sessionList.length;
        const requestedTotal =
            blockSummaries.reduce(
                (acc, block) =>
                    acc +
                    (block.requestedAmount ||
                        0),
                0
            );
        const estimatedMinutes =
            Math.max(
                1,
                Math.ceil(
                    sessionList.reduce(
                        (acc, question) =>
                            acc +
                            Math.max(
                                Number(
                                    question.expectedTime
                                ) || 25,
                                10
                            ),
                        0
                    ) / 60
                )
            );
        const subjectLabels =
            [
                ...new Set(
                    blockSummaries.map(
                        (block) =>
                            block.subjectLabel
                    )
                )
            ].filter(Boolean);
        const topicKeys =
            [
                ...new Set(
                    blockSummaries.map(
                        (block) =>
                            block.topicKey
                    )
                )
            ].filter(Boolean);
        const primaryBlock =
            blockSummaries[0] || null;
        const timeLabel =
            this.getSimuladoTimeLabel(
                timeLimitMinutes
            );
        const shortages =
            blockSummaries.filter(
                (block) =>
                    block.actualAmount <
                    block.requestedAmount
            );
        const summaryNote =
            shortages.length
                ? `Alguns blocos ficaram abaixo do pedido por falta de questoes prontas. Total fechado: ${totalQuestions} de ${requestedTotal}.`
                : "";
        const currentContext =
            QuestionsContext.get();

        return {
            sessionList,
            blocks: blockSummaries,
            totalQuestions,
            requestedTotal,
            blockCount:
                blockSummaries.length,
            timeLimitMinutes:
                timeLimitMinutes === null
                    ? null
                    : Math.max(
                          30,
                          Number(
                              timeLimitMinutes
                          ) || 30
                      ),
            timeLimitLabel: timeLabel,
            estimatedMinutes,
            estimatedTimeLabel:
                `${estimatedMinutes} min`,
            summaryNote,
            routeContext: {
                ...currentContext,
                serie:
                    Number(
                        primaryBlock?.serie
                    ) ||
                    Number(
                        currentContext.serie
                    ) ||
                    1,
                materia:
                    primaryBlock?.subjectKey ||
                    currentContext.materia ||
                    "",
                topicos: topicKeys,
                focoPrincipal:
                    topicKeys[0] || "",
                quantidadeQuestoes:
                    totalQuestions,
                mode:
                    topicKeys.length > 1
                        ? "ASSUNTOS_COMBINADOS"
                        : "ASSUNTO_UNICO",
                estrategiaMistura:
                    "equilibrada"
            },
            meta: {
                customTitle: `Simulado - ${totalQuestions} questoes`,
                modeLabel: "Simulado",
                materiaLabel:
                    subjectLabels.length === 1
                        ? subjectLabels[0]
                        : "Multidisciplinar",
                topicsLabel:
                    blockSummaries.map(
                        (block) =>
                            block.topicLabel
                    ),
                simuladoBlockCount:
                    blockSummaries.length,
                simuladoTimeLimitMinutes:
                    timeLimitMinutes,
                simuladoTimeLimitLabel:
                    timeLabel
            }
        };
    },

    setSimuladoTimeLimitMinutes(
        timeLimitMinutes = 30
    ) {
        const current =
            this.ensureSimuladoBuilder();

        this.simuladoBuilder = {
            ...current,
            timeLimitMinutes:
                timeLimitMinutes === null
                    ? null
                    : Math.max(
                          30,
                          Number(
                              timeLimitMinutes
                          ) || 30
                      )
        };
    },

    openSimuladoTimeDialog() {
        const state =
            this.ensureSimuladoBuilder();
        const timeLimitMinutes =
            state.timeLimitMinutes ===
            null
                ? null
                : Math.max(
                      30,
                      Number(
                          state.timeLimitMinutes
                      ) || 30
                  );

        this.openDialog({
            mode: "simulado_time",
            title:
                "Tempo do simulado",
            message:
                "Escolha o tempo total antes de fechar o resumo do simulado.",
            confirmLabel: "Aplicar",
            cancelLabel: "Cancelar",
            data: {
                timeLimitMinutes
            },
            onConfirm: async (
                dialogData
            ) => {
                const selectedTime =
                    dialogData &&
                    Object.prototype.hasOwnProperty.call(
                        dialogData,
                        "timeLimitMinutes"
                    )
                        ? dialogData.timeLimitMinutes
                        : timeLimitMinutes;
                const preview =
                    await this.buildSimuladoPreview(
                        selectedTime
                    );

                if (!preview) {
                    return;
                }

                this.setSimuladoTimeLimitMinutes(
                    preview.timeLimitMinutes
                );
                this.openDialog({
                    mode: "simulado_summary",
                    title:
                        "Resumo do simulado",
                    confirmLabel: "Iniciar",
                    cancelLabel: "Fechar",
                    data: {
                        preview
                    },
                    onConfirm:
                        (
                            summaryData
                        ) => {
                            this.startSimuladoSessionFromPreview(
                                summaryData?.preview ||
                                    preview
                            );
                        }
                });
            }
        });
    },

    adjustActiveSimuladoTime(
        minutesToAdd = 30
    ) {
        if (
            !this.activeDialog ||
            this.activeDialog.mode !==
                "simulado_time"
        ) {
            return;
        }

        const currentValue =
            this.activeDialog.data
                ?.timeLimitMinutes;
        const nextValue =
            currentValue === null
                ? 30
                : Math.max(
                      30,
                      Number(
                          currentValue
                      ) || 30
                  ) +
                  Math.max(
                      30,
                      Number(
                          minutesToAdd
                      ) || 30
                  );

        this.activeDialog = {
            ...this.activeDialog,
            data: {
                ...(
                    this.activeDialog
                        .data || {}
                ),
                timeLimitMinutes:
                    nextValue
            }
        };
        this.render();
    },

    setActiveSimuladoTimeBase() {
        if (
            !this.activeDialog ||
            this.activeDialog.mode !==
                "simulado_time"
        ) {
            return;
        }

        this.activeDialog = {
            ...this.activeDialog,
            data: {
                ...(
                    this.activeDialog
                        .data || {}
                ),
                timeLimitMinutes: 30
            }
        };
        this.render();
    },

    toggleActiveSimuladoTimeInfinite() {
        if (
            !this.activeDialog ||
            this.activeDialog.mode !==
                "simulado_time"
        ) {
            return;
        }

        this.activeDialog = {
            ...this.activeDialog,
            data: {
                ...(
                    this.activeDialog
                        .data || {}
                ),
                timeLimitMinutes:
                    this.activeDialog
                        .data
                        ?.timeLimitMinutes ===
                    null
                        ? 30
                        : null
            }
        };
        this.render();
    },

    startSimuladoSessionFromPreview(
        preview = null
    ) {
        if (
            !preview ||
            !Array.isArray(
                preview.sessionList
            ) ||
            !preview.sessionList.length
        ) {
            this.runtimeNotice =
                "Nao foi possivel iniciar esse simulado agora.";
            this.render();
            return;
        }

        const resolvedCustomTitle =
            String(
                preview.meta?.customTitle || ""
            ).trim() ||
            `Simulado - ${Number(preview.totalQuestions) || preview.sessionList.length || 0} questoes`;

        this.setSimuladoTimeLimitMinutes(
            preview.timeLimitMinutes
        );
        this.startSession({
            routeContext:
                preview.routeContext ||
                {},
            sessionList:
                preview.sessionList ||
                [],
            sourceMode: "simulado",
            meta: {
                ...(preview.meta || {}),
                customTitle:
                    resolvedCustomTitle,
                simuladoTimeLimitMinutes:
                    preview.timeLimitMinutes,
                simuladoTimeLimitLabel:
                    preview.timeLimitLabel
            }
        });
    },

    setActiveSimuladoPreviewTitle(
        title = ""
    ) {
        if (
            !this.activeDialog ||
            this.activeDialog.mode !==
                "simulado_summary"
        ) {
            return;
        }

        const preview =
            this.activeDialog.data?.preview;

        if (
            !preview ||
            typeof preview !== "object"
        ) {
            return;
        }

        this.activeDialog = {
            ...this.activeDialog,
            data: {
                ...(
                    this.activeDialog
                        .data || {}
                ),
                preview: {
                    ...preview,
                    meta: {
                        ...(preview.meta || {}),
                        customTitle: String(
                            title || ""
                        )
                    }
                }
            }
        };
    },

    activateSimuladoTimer(
        meta = {},
        options = {}
    ) {
        const sourceMode =
            String(
                options.sourceMode ||
                    meta.sourceMode ||
                    ""
            ).trim();
        const timeLimitMinutes =
            sourceMode === "smart"
                ? meta.smartTimeLimitMinutes
                : Object.prototype.hasOwnProperty.call(
                    meta || {},
                    "simuladoTimeLimitMinutes"
                )
                    ? meta.simuladoTimeLimitMinutes
                    : null;
        const safeMinutes =
            Number(timeLimitMinutes);
        const isResume =
            options.createRun === false &&
            Boolean(
                String(
                    options.activeRunId || ""
                ).trim()
            );

        if (
            ![
                "simulado",
                "smart"
            ].includes(sourceMode) ||
            isResume ||
            !Number.isFinite(safeMinutes) ||
            safeMinutes <= 0 ||
            typeof UtilityWindows ===
                "undefined" ||
            typeof UtilityWindows
                .setTimerDuration !==
                "function"
        ) {
            return;
        }

        UtilityWindows.setTimerDuration(
            safeMinutes * 60,
            {
                open: true,
                autostart: true,
                simuladoCompact:
                    sourceMode ===
                    "simulado"
            }
        );
    },

    pauseSimuladoTimer() {
        const meta =
            QuestionsState.getMeta();
        const sourceMode = String(
            meta?.sourceMode || ""
        ).trim();

        if (
            ![
                "simulado",
                "smart"
            ].includes(sourceMode) ||
            typeof UtilityWindows ===
                "undefined" ||
            typeof UtilityWindows
                .pauseTimer !==
                "function"
        ) {
            return;
        }

        UtilityWindows.pauseTimer();
    },

    getSimuladoSubjectOptions(
        serie = null
    ) {
        const safeSerie =
            Number(serie) ||
            Number(
                this.ensureSimuladoBuilder()
                    ?.serie
            );

        if (!safeSerie) {
            return [];
        }

        return QuestionsService.getSubjectOptions(
            this,
            safeSerie
        ).filter(
            (item) => item.hasQuestions
        );
    },

    getSimuladoTopicOptions(
        subjectKey = "",
        serie = null
    ) {
        const state =
            this.ensureSimuladoBuilder();
        const safeSubjectKey =
            String(
                subjectKey ||
                    state?.draft
                        ?.subjectKey ||
                    ""
            ).trim();
        const safeSerie =
            Number(serie) ||
            Number(state?.serie);

        if (
            !safeSubjectKey ||
            !safeSerie
        ) {
            return [];
        }

        return QuestionsService.getTopicOptions(
            this,
            {
                serie: safeSerie,
                materia: safeSubjectKey
            }
        ).filter(
            (item) => item.hasQuestions
        );
    },

    setSimuladoSerie(serieKey) {
        const current =
            this.ensureSimuladoBuilder();
        const nextSerie =
            Number(serieKey) || null;

        this.simuladoBuilder = {
            ...current,
            serie: nextSerie,
            draft: {
                ...this.createSimuladoBuilderState()
                    .draft
            },
            editingIndex: -1
        };
        this.clearRuntimeNotice();
        this.render();
    },

    setSimuladoDraft(patch = {}) {
        const current =
            this.ensureSimuladoBuilder();
        const nextDraft = {
            ...current.draft,
            ...(patch || {})
        };

        if (
            Object.prototype.hasOwnProperty.call(
                patch,
                "subjectKey"
            )
        ) {
            nextDraft.topicKey = "";
            nextDraft.difficulty = "";
            nextDraft.amount = null;
        }

        if (
            Object.prototype.hasOwnProperty.call(
                patch,
                "topicKey"
            )
        ) {
            nextDraft.difficulty = "";
            nextDraft.amount = null;
        }

        if (
            Object.prototype.hasOwnProperty.call(
                patch,
                "difficulty"
            )
        ) {
            nextDraft.amount = null;
        }

        if (
            Object.prototype.hasOwnProperty.call(
                patch,
                "amount"
            )
        ) {
            nextDraft.amount = Math.max(
                1,
                Number(nextDraft.amount) ||
                    0
            );
        }

        this.simuladoBuilder = {
            ...current,
            draft: nextDraft
        };
        this.clearRuntimeNotice();
        this.render();
    },

    editSimuladoBlock(index) {
        const current =
            this.ensureSimuladoBuilder();
        const block =
            current.blocks?.[
                Number(index)
            ] || null;

        if (!block) {
            return;
        }

        this.simuladoBuilder = {
            ...current,
            serie:
                Number(block.serie) ||
                current.serie,
            draft: {
                subjectKey:
                    block.subjectKey || "",
                topicKey:
                    block.topicKey || "",
                difficulty:
                    block.difficulty || "",
                amount:
                    Number(block.amount) ||
                    current.draft.amount ||
                    10
            },
            editingIndex:
                Number(index) || 0
        };
        this.clearRuntimeNotice();
        this.render();
    },

    deleteSimuladoBlock(index) {
        const current =
            this.ensureSimuladoBuilder();
        const blockIndex =
            Number(index);

        if (
            !Number.isInteger(
                blockIndex
            )
        ) {
            return;
        }

        const nextBlocks =
            (current.blocks || []).filter(
                (_item, itemIndex) =>
                    itemIndex !== blockIndex
            );
        const shouldResetDraft =
            current.editingIndex ===
            blockIndex;

        this.simuladoBuilder = {
            ...current,
            blocks: nextBlocks,
            editingIndex:
                shouldResetDraft
                    ? -1
                    : current.editingIndex >
                        blockIndex
                        ? current.editingIndex -
                          1
                        : current.editingIndex,
            draft: shouldResetDraft
                ? this.createSimuladoBuilderState(
                    current.serie
                ).draft
                : current.draft
        };
        this.clearRuntimeNotice();
        this.render();
    },

    applySimuladoDraft() {
        const current =
            this.ensureSimuladoBuilder();
        const draft = {
            ...(current.draft || {})
        };
        const subjects =
            this.getSimuladoSubjectOptions(
                current.serie
            );
        const subject =
            subjects.find(
                (item) =>
                    item.key ===
                    draft.subjectKey
            ) || null;
        const topics =
            this.getSimuladoTopicOptions(
                draft.subjectKey,
                current.serie
            );
        const topic =
            topics.find(
                (item) =>
                    item.key ===
                    draft.topicKey
            ) || null;
        const difficulty =
            this.getSimuladoDifficultyOptions().find(
                (item) =>
                    item.key ===
                    draft.difficulty
            ) || null;
        const amount = Math.max(
            1,
            Number(draft.amount) || 0
        );

        if (!Number(current.serie)) {
            this.runtimeNotice =
                "Escolha uma serie base antes de montar o bloco do simulado.";
            this.render();
            return false;
        }

        if (!subject) {
            this.runtimeNotice =
                "Escolha uma materia antes de aplicar o bloco do simulado.";
            this.render();
            return false;
        }

        if (!topic) {
            this.runtimeNotice =
                "Escolha um assunto valido antes de aplicar o bloco do simulado.";
            this.render();
            return false;
        }

        if (!difficulty) {
            this.runtimeNotice =
                "Defina a dificuldade antes de aplicar o bloco do simulado.";
            this.render();
            return false;
        }

        if (!amount) {
            this.runtimeNotice =
                "Defina a quantidade antes de aplicar o bloco do simulado.";
            this.render();
            return false;
        }

        const nextBlock = {
            serie: current.serie,
            subjectKey: subject.key,
            subjectLabel:
                subject.label,
            topicKey: topic.key,
            topicLabel: topic.label,
            difficulty:
                difficulty.key,
            difficultyLabel:
                difficulty.label,
            amount
        };
        const nextBlocks = [
            ...(current.blocks || [])
        ];

        if (
            Number.isInteger(
                current.editingIndex
            ) &&
            current.editingIndex >= 0 &&
            current.editingIndex <
                nextBlocks.length
        ) {
            nextBlocks[
                current.editingIndex
            ] = nextBlock;
        } else {
            nextBlocks.push(nextBlock);
        }

        this.simuladoBuilder = {
            ...current,
            blocks: nextBlocks,
            editingIndex: -1,
            draft: this.createSimuladoBuilderState(
                current.serie
            ).draft
        };
        this.clearRuntimeNotice();
        this.render();
        return true;
    },

    consolidateSimulado() {
        const current =
            this.ensureSimuladoBuilder();

        if (
            !Array.isArray(
                current.blocks
            ) ||
            !current.blocks.length
        ) {
            this.runtimeNotice =
                "Monte pelo menos um bloco antes de consolidar o simulado.";
            this.render();
            return;
        }

        this.clearRuntimeNotice();
        this.openSimuladoTimeDialog();
    },

    inferTopicSerie(
        subjectKey = "",
        topicKey = "",
        fallbackSerie = null
    ) {
        const preferredSerie =
            Number(fallbackSerie) ||
            Number(
                QuestionsContext.get()
                    ?.serie
            ) ||
            1;
        const topic =
            QuestionsService.getTopicOptions(
                this,
                {
                    materia: subjectKey
                }
            ).find(
                (item) =>
                    item.key === topicKey
            ) || null;

        if (!topic) {
            return preferredSerie;
        }

        if (
            Array.isArray(topic.serie) &&
            topic.serie.includes(
                preferredSerie
            )
        ) {
            return preferredSerie;
        }

        return (
            Number(topic.serie?.[0]) ||
            preferredSerie
        );
    },

    startQuickAction(actionKey = "") {
        const intent =
            String(actionKey || "").trim();
        const ctx =
            QuestionsContext.get();

        if (intent === "resume") {
            this.openLauncher("resume");
            return;
        }

        if (intent === "saved") {
            this.openLauncher("saved");
            return;
        }

        const weakTopics =
            QuestionsStore.getWeakTopics({
                baseKey:
                    ctx.base || "ESCOLAR",
                minAttempts: 1,
                minErrors: 1
            });

        if (!weakTopics.length) {
            this.runtimeNotice =
                "O modo rapido ainda precisa de historico para sugerir revisao de erros ou foco no ponto fraco.";
            this.openLauncher("quick");
            return;
        }

        if (intent === "weak_points") {
            const target = weakTopics[0];
            const serie =
                this.inferTopicSerie(
                    target.subjectKey,
                    target.topicKey,
                    ctx.serie
                );

            this.startSession({
                routeContext: {
                    ...ctx,
                    serie,
                    materia:
                        target.subjectKey,
                    topicos: [
                        target.topicKey
                    ],
                    focoPrincipal:
                        target.topicKey,
                    mode: "ASSUNTO_UNICO",
                    estrategiaMistura:
                        "equilibrada"
                }
            });
            return;
        }

        if (intent === "review_errors") {
            const primary =
                weakTopics[0];
            const reviewTopics =
                weakTopics
                    .filter(
                        (item) =>
                            item.subjectKey ===
                            primary.subjectKey
                    )
                    .slice(0, 3)
                    .map(
                        (item) =>
                            item.topicKey
                    );
            const serie =
                this.inferTopicSerie(
                    primary.subjectKey,
                    primary.topicKey,
                    ctx.serie
                );

            this.startSession({
                routeContext: {
                    ...ctx,
                    serie,
                    materia:
                        primary.subjectKey,
                    topicos: reviewTopics,
                    focoPrincipal:
                        reviewTopics[0] ||
                        null,
                    mode:
                        reviewTopics.length >
                        1
                            ? "ASSUNTOS_COMBINADOS"
                            : "ASSUNTO_UNICO",
                    estrategiaMistura:
                        reviewTopics.length >
                        1
                            ? "adaptativa"
                            : "equilibrada"
                }
            });
            return;
        }

        this.runtimeNotice =
            "Acao rapida ainda nao reconhecida.";
        this.openLauncher("quick");
    },

    getPreviousLauncherView(
        fallback = "home"
    ) {
        const safeFallback =
            QuestionsState.isValidLauncherView(
                fallback
            )
                ? fallback
                : "home";

        while (
            Array.isArray(
                this.launcherHistory
            ) &&
            this.launcherHistory.length
        ) {
            const previousView =
                this.launcherHistory.pop();

            if (
                QuestionsState.isValidLauncherView(
                    previousView
                ) &&
                previousView !==
                    QuestionsState.getLauncherView()
            ) {
                return previousView;
            }
        }

        return safeFallback;
    },

    goBackLauncher(
        fallback = "home"
    ) {
        this.openLauncher(
            this.getPreviousLauncherView(
                fallback
            ),
            {
                fromBack: true,
                preserveSmartState:
                    true
            }
        );
    },

    getSessionReturnView(
        fallback = "home"
    ) {
        const candidate =
            String(
                this.sessionReturnView || ""
            ).trim();

        if (
            QuestionsState.isValidLauncherView(
                candidate
            )
        ) {
            return candidate;
        }

        return QuestionsState.isValidLauncherView(
            fallback
        )
            ? fallback
            : "home";
    },

    getActiveDialog() {
        return this.activeDialog &&
            typeof this.activeDialog ===
                "object"
            ? {
                  ...this.activeDialog,
                  data:
                      this.activeDialog.data &&
                      typeof this.activeDialog
                          .data ===
                          "object"
                          ? {
                                ...this
                                    .activeDialog
                                    .data
                            }
                          : this.activeDialog
                                .data ||
                            null
              }
            : null;
    },

    resolveDialogPosition(
        anchorRect = null
    ) {
        if (
            !anchorRect ||
            typeof anchorRect !== "object"
        ) {
            return null;
        }

        const viewportWidth =
            window.innerWidth || 1280;
        const viewportHeight =
            window.innerHeight || 720;
        const cardWidth = Math.min(
            Math.max(
                viewportWidth - 32,
                280
            ),
            520
        );
        const margin = 20;
        const estimatedHeight =
            240;
        const left = Math.min(
            Math.max(
                Number(anchorRect.left || 0) +
                    (
                        Number(
                            anchorRect.width ||
                                0
                        ) /
                        2
                    ) -
                    cardWidth / 2,
                margin
            ),
            Math.max(
                viewportWidth -
                    cardWidth -
                    margin,
                margin
            )
        );
        const top = Math.min(
            Math.max(
                Number(
                    anchorRect.bottom ||
                        0
                ) + 14,
                margin
            ),
            Math.max(
                viewportHeight -
                    estimatedHeight -
                    margin,
                margin
            )
        );

        return {
            anchored: true,
            top,
            left,
            width: cardWidth
        };
    },

    openDialog(config = {}) {
        this.activeDialog = {
            mode:
                String(
                    config.mode || ""
                ).trim() ||
                "prompt",
            title:
                String(
                    config.title || ""
                ).trim() ||
                "Confirmar",
            label:
                String(
                    config.label || ""
                ).trim() ||
                "Digite um nome",
            message:
                String(
                    config.message || ""
                ).trim(),
            value:
                String(
                    config.value || ""
                ),
            confirmLabel:
                String(
                    config.confirmLabel || ""
                ).trim() ||
                "Salvar",
            cancelLabel:
                String(
                    config.cancelLabel || ""
                ).trim() ||
                "Cancelar",
            position:
                this.resolveDialogPosition(
                    config.anchorRect ||
                        null
                ),
            data:
                config.data &&
                typeof config.data ===
                    "object"
                    ? {
                          ...config.data
                      }
                    : null,
            onConfirm:
                typeof config.onConfirm ===
                "function"
                    ? config.onConfirm
                    : null
        };
        this.render();
    },

    openConfirmDialog(config = {}) {
        this.openDialog({
            mode: "confirm",
            title:
                config.title ||
                "Confirmar acao",
            message:
                config.message || "",
            confirmLabel:
                config.confirmLabel ||
                "Confirmar",
            onConfirm:
                config.onConfirm
        });
    },

    closeDialog(shouldRender = true) {
        this.activeDialog = null;

        if (shouldRender) {
            this.render();
        }
    },

    confirmDialog(rawValue = "") {
        const dialog =
            this.activeDialog;

        if (!dialog) {
            return;
        }

        if (
            dialog.mode !== "prompt"
        ) {
            const onConfirm =
                dialog.onConfirm;
            const dialogData =
                dialog.data &&
                typeof dialog.data ===
                    "object"
                    ? {
                          ...dialog.data
                      }
                    : dialog.data || null;

            this.activeDialog = null;

            if (
                typeof onConfirm ===
                "function"
            ) {
                onConfirm(dialogData);
                return;
            }

            this.render();
            return;
        }

        const value = String(
            rawValue || ""
        ).trim();

        if (!value) {
            return;
        }

        const onConfirm =
            dialog.onConfirm;

        this.activeDialog = null;

        if (typeof onConfirm === "function") {
            onConfirm(value);
            return;
        }

        this.render();
    },

    isContestComposerOpen(
        questionId = ""
    ) {
        return (
            String(
                this.activeContestQuestionId ||
                    ""
            ) ===
            String(questionId || "")
        );
    },

    toggleContestComposer(
        questionId = ""
    ) {
        const normalized =
            String(questionId || "").trim();

        this.activeContestQuestionId =
            this.activeContestQuestionId ===
            normalized
                ? ""
                : normalized;
        this.render();
    },

    closeContestComposer() {
        if (!this.activeContestQuestionId) {
            return;
        }

        this.activeContestQuestionId =
            "";
        this.render();
    },

    getQuestionContestDefaultText() {
        return String(
            this.questionContestDefaultText ||
                "Enviar sem comentar"
        ).trim();
    },

    getLatestQuestionContest(
        questionId = ""
    ) {
        if (
            typeof QuestionsStore.getLatestQuestionReport !==
            "function"
        ) {
            return null;
        }

        return QuestionsStore.getLatestQuestionReport(
            questionId
        );
    },

    commitLastAnswer() {
        const answer =
            QuestionsState.getCurrentRecordedAnswer() ||
            QuestionsState.getLastAnswer();

        if (
            !answer ||
            typeof answer !== "object"
        ) {
            return false;
        }

        const topicKey =
            String(
                answer.topicKey ||
                    answer.question?.topicKey ||
                    ""
            ).trim();

        if (!topicKey) {
            return false;
        }

        QuestionsStore.registerAnswer(
            {
                baseKey:
                    String(
                        answer.baseKey ||
                            answer.question
                                ?.baseKey ||
                            ""
                    ).trim(),
                baseLabel:
                    String(
                        answer.baseLabel ||
                            answer.question
                                ?.baseLabel ||
                            ""
                    ).trim(),
                subjectKey:
                    String(
                        answer.subjectKey ||
                            answer.question
                                ?.subjectKey ||
                            ""
                    ).trim(),
                subjectLabel:
                    String(
                        answer.subjectLabel ||
                            answer.question
                                ?.subjectLabel ||
                            ""
                    ).trim(),
                topicKey,
                topicLabel:
                    String(
                        answer.topicLabel ||
                            answer.question
                                ?.topicLabel ||
                            ""
                    ).trim()
            },
            Boolean(answer.correct),
            Number(answer.timeMs) || 0
        );

        return true;
    },

    loadCoachState() {
        try {
            const saved =
                localStorage.getItem(
                    this.coachStorageKey
                );
            const parsed = saved
                ? JSON.parse(saved)
                : {};

            this.coachState =
                parsed &&
                typeof parsed === "object"
                    ? { ...parsed }
                    : {};
        } catch (_error) {
            this.coachState = {};
        }

        this.coachDismissedViews = {};
    },

    saveCoachState() {
        localStorage.setItem(
            this.coachStorageKey,
            JSON.stringify(
                this.coachState || {}
            )
        );
    },

    registerCoachView(view = "") {
        const key =
            String(view || "").trim();
        const supported = new Set([
            "smart_start",
            "smart_subjects"
        ]);

        if (!supported.has(key)) {
            return;
        }

        const current =
            Number(
                this.coachState?.[key]
            ) || 0;

        if (current < 3) {
            this.coachState = {
                ...(this.coachState || {}),
                [key]: current + 1
            };
            this.saveCoachState();
        }

        this.coachDismissedViews[key] =
            false;
    },

    dismissCoachHint(view = "") {
        const key =
            String(view || "").trim();

        if (!key) {
            return;
        }

        this.coachDismissedViews[key] =
            true;
    },

    shouldShowCoachHint(view = "") {
        const key =
            String(view || "").trim();
        const shownCount =
            Number(
                this.coachState?.[key]
            ) || 0;

        return (
            shownCount > 0 &&
            shownCount <= 3 &&
            this.coachDismissedViews?.[
                key
            ] !== true
        );
    },

    getCoachHintText(view = "") {
        const key =
            String(view || "").trim();

        if (key === "smart_start") {
            return "Selecione as s\u00e9ries para filtrar as quest\u00f5es e depois toque em Ir.";
        }

        if (key === "smart_subjects") {
            return "Toque nas mat\u00e9rias que quer manter no treino e depois toque em Ir.";
        }

        return "";
    },

    setSmartConfig(patch = {}) {
        if (
            this.routeUseCases
                ?.setSmartConfig
        ) {
            return this.routeUseCases.setSmartConfig(
                patch
            );
        }

        QuestionsContext.replace(
            {
                ...QuestionsContext.get(),
                ...(patch || {})
            },
            false
        );
        this.clearRuntimeNotice();
        this.syncContext();
        this.render();
    },

    setSmartGoal(goalKey) {
        if (
            this.routeUseCases
                ?.setSmartGoal
        ) {
            return this.routeUseCases.setSmartGoal(
                goalKey
            );
        }

        if (!this.data.smartGoals?.[goalKey]) {
            return;
        }

        this.setSmartConfig({
            smartGoal: goalKey
        });
    },

    setSmartSessionMetric(metric) {
        const normalized =
            String(metric || "")
                .trim()
                .toLowerCase() === "tempo"
                ? "tempo"
                : "quantidade";

        this.setSmartConfig({
            smartSessionMetric:
                normalized
        });
    },

    setSmartTimeMinutes(
        minutes
    ) {
        this.setSmartConfig({
            smartSessionMetric: "tempo",
            smartTimeMinutes:
                minutes === null
                    ? null
                    : Math.max(
                        1,
                        Number(minutes) || 15
                    )
        });
    },

    setSmartQuestionCount(count) {
        this.setSmartConfig({
            smartSessionMetric:
                "quantidade",
            quantidadeQuestoes:
                count === null
                    ? QuestionsContext.get()
                          .quantidadeQuestoes
                    : Math.max(
                        1,
                        Number(count) || 5
                    ),
            smartQuestionCount:
                count === null
                    ? null
                    : Math.max(
                        1,
                        Number(count) || 5
                    )
        });
    },

    getSmartStartOptions() {
        if (
            this.launcherSelectors
                ?.getSmartStartOptions
        ) {
            return this.launcherSelectors.getSmartStartOptions();
        }

        const ctx =
            QuestionsContext.get();
        const availableSeries =
            QuestionsService.getSeriesOptions(
                this
            );
        const selectedSeries =
            Array.isArray(
                ctx.smartSelectedSeries
            )
                ? ctx.smartSelectedSeries
                : [];

        return [
            ...availableSeries.map((serie) => ({
                key: String(serie.key),
                label: serie.label.replace(
                    " serie",
                    ""
                ),
                type: "serie",
                active:
                    selectedSeries.includes(
                        serie.key
                    ),
                disabled: false,
                note:
                    serie.key === 1
                        ? "Base escolar"
                        : "Escolar"
            })),
            {
                key: "ENEM",
                label: "ENEM",
                type: "base",
                active: false,
                disabled:
                    !this.data.bases.ENEM
                        ?.available,
                note:
                    this.data.bases.ENEM
                        ?.available
                        ? "Base pronta"
                        : "Em breve"
            }
        ];
    },

    getSelectedSmartSeries() {
        if (
            this.launcherSelectors
                ?.getSelectedSmartSeries
        ) {
            return this.launcherSelectors.getSelectedSmartSeries();
        }

        return this.getSmartStartOptions()
            .filter(
                (item) =>
                    item.type === "serie" &&
                    item.active &&
                    !item.disabled
            )
            .map((item) =>
                Number(item.key)
            )
            .filter((item) =>
                Number.isFinite(item)
            );
    },

    getSmartSubjectOptions() {
        if (
            this.launcherSelectors
                ?.getSmartSubjectOptions
        ) {
            return this.launcherSelectors.getSmartSubjectOptions();
        }

        const ctx =
            QuestionsContext.get();
        const selectedSeries =
            this.getSelectedSmartSeries();
        const grouped = new Map();

        selectedSeries.forEach((serie) => {
            QuestionsService.getSubjectOptions(
                this,
                serie
            ).forEach((subject) => {
                const current =
                    grouped.get(
                        subject.key
                    ) || {
                        key: subject.key,
                        label: subject.label,
                        count: 0,
                        topicCount: 0,
                        readyQuestionCount: 0,
                        readyTopicCount: 0,
                        hasQuestions: false
                    };

                current.count +=
                    Number(
                        subject.count
                    ) || 0;
                current.topicCount +=
                    Number(
                        subject.topicCount
                    ) || 0;
                current.readyQuestionCount +=
                    Number(
                        subject.readyQuestionCount
                    ) || 0;
                current.readyTopicCount +=
                    Number(
                        subject.readyTopicCount
                    ) || 0;
                current.hasQuestions =
                    current.hasQuestions ||
                    Boolean(
                        subject.hasQuestions
                    );

                grouped.set(
                    subject.key,
                    current
                );
            });
        });

        return [...grouped.values()]
            .sort((left, right) => {
                if (
                    left.hasQuestions !==
                    right.hasQuestions
                ) {
                    return left.hasQuestions
                        ? -1
                        : 1;
                }

                if (
                    left.readyQuestionCount !==
                    right.readyQuestionCount
                ) {
                    return (
                        right.readyQuestionCount -
                        left.readyQuestionCount
                    );
                }

                return left.label.localeCompare(
                    right.label,
                    "pt-BR"
                );
            })
            .map((subject) => {
                const topicOptions =
                    QuestionsService.getSmartSubjectTopicOptions(
                        this,
                        subject.key,
                        ctx
                    );
                const selectedTopicCount =
                    topicOptions.filter(
                        (topic) =>
                            topic.active
                    ).length;
                const excludedTopicCount =
                    Math.max(
                        topicOptions.length -
                            selectedTopicCount,
                        0
                    );

                return {
                    ...subject,
                    active:
                        (
                            ctx.smartSelectedSubjects ||
                            []
                        ).includes(subject.key) &&
                        subject.hasQuestions,
                    disabled:
                        !subject.hasQuestions,
                    topicOptions,
                    selectedTopicCount,
                    excludedTopicCount,
                    hasTopicEditor:
                        topicOptions.length > 1,
                    hasTopicOverrides:
                        excludedTopicCount > 0
                };
            });
    },

    getSmartSubjectTopicOptions(
        subjectKey,
        context = null
    ) {
        const cleanKey =
            String(subjectKey || "")
                .trim()
                .toLowerCase();

        if (!cleanKey) {
            return [];
        }

        return QuestionsService.getSmartSubjectTopicOptions(
            this,
            cleanKey,
            context
        );
    },

    resolveSmartSubjectFocus(
        subjectOptions = null
    ) {
        const options =
            Array.isArray(subjectOptions) &&
            subjectOptions.length
                ? subjectOptions
                : this.getSmartSubjectOptions();
        const cleanFocusKey =
            String(
                this.smartSubjectFocusKey || ""
            )
                .trim()
                .toLowerCase();
        const cleanEditorKey =
            String(
                this.smartSubjectEditorKey || ""
            )
                .trim()
                .toLowerCase();
        const activeOptions =
            options.filter(
                (item) =>
                    item.active &&
                    !item.disabled &&
                    item.selectedTopicCount !==
                        0
            );
        const availableOptions =
            options.filter(
                (item) => !item.disabled
            );

        return (
            activeOptions.find(
                (item) =>
                    item.key === cleanEditorKey
            ) ||
            activeOptions.find(
                (item) =>
                    item.key === cleanFocusKey
            ) ||
            activeOptions.find(
                (item) =>
                    item.hasTopicEditor
            ) ||
            activeOptions[0] ||
            availableOptions.find(
                (item) =>
                    item.key === cleanFocusKey
            ) ||
            availableOptions[0] ||
            null
        );
    },

    focusSmartSubject(subjectKey) {
        const cleanSubjectKey =
            String(subjectKey || "")
                .trim()
                .toLowerCase();

        if (!cleanSubjectKey) {
            return;
        }

        const option =
            this.getSmartSubjectOptions().find(
                (item) =>
                    item.key ===
                        cleanSubjectKey &&
                    !item.disabled
            );

        if (!option) {
            return;
        }

        if (
            this.smartSubjectFocusKey ===
            cleanSubjectKey
        ) {
            return;
        }

        this.smartSubjectFocusKey =
            cleanSubjectKey;
        this.render();
    },

    toggleSmartSubjectTopic(
        subjectKey,
        topicKey
    ) {
        const cleanSubjectKey =
            String(subjectKey || "")
                .trim()
                .toLowerCase();
        const cleanTopicKey =
            String(topicKey || "").trim();

        if (
            !cleanSubjectKey ||
            !cleanTopicKey
        ) {
            return;
        }

        const topicOptions =
            this.getSmartSubjectTopicOptions(
                cleanSubjectKey
            );

        if (
            !topicOptions.some(
                (topic) =>
                    topic.key === cleanTopicKey
            )
        ) {
            return;
        }

        const ctx =
            QuestionsContext.get();
        const nextMap = {
            ...(
                ctx.smartExcludedTopicsBySubject ||
                {}
            )
        };
        const currentExcluded =
            new Set(
                (
                    nextMap[
                        cleanSubjectKey
                    ] || []
                )
                    .map((item) =>
                        String(item || "").trim()
                    )
                    .filter(Boolean)
            );

        if (
            currentExcluded.has(
                cleanTopicKey
            )
        ) {
            currentExcluded.delete(
                cleanTopicKey
            );
        } else {
            currentExcluded.add(
                cleanTopicKey
            );
        }

        if (currentExcluded.size) {
            nextMap[cleanSubjectKey] = [
                ...currentExcluded
            ];
        } else {
            delete nextMap[
                cleanSubjectKey
            ];
        }

        this.dismissCoachHint(
            "smart_subjects"
        );
        this.setSmartConfig({
            smartExcludedTopicsBySubject:
                nextMap
        });
    },

    setAllSmartSubjectTopics(
        subjectKey,
        includeAll = true
    ) {
        const cleanSubjectKey =
            String(subjectKey || "")
                .trim()
                .toLowerCase();

        if (!cleanSubjectKey) {
            return;
        }

        const topicOptions =
            this.getSmartSubjectTopicOptions(
                cleanSubjectKey
            );

        if (!topicOptions.length) {
            return;
        }

        const ctx =
            QuestionsContext.get();
        const nextMap = {
            ...(
                ctx.smartExcludedTopicsBySubject ||
                {}
            )
        };

        if (includeAll) {
            delete nextMap[
                cleanSubjectKey
            ];
        } else {
            nextMap[cleanSubjectKey] =
                topicOptions.map(
                    (topic) => topic.key
                );
        }

        this.dismissCoachHint(
            "smart_subjects"
        );
        this.setSmartConfig({
            smartExcludedTopicsBySubject:
                nextMap
        });
    },

    openSmartSubjectEditor(
        subjectKey
    ) {
        const cleanSubjectKey =
            String(subjectKey || "")
                .trim()
                .toLowerCase();
        const option =
            this.getSmartSubjectOptions().find(
                (item) =>
                    item.key ===
                        cleanSubjectKey &&
                    item.active &&
                    !item.disabled &&
                    item.hasTopicEditor
            );

        if (!option) {
            return;
        }

        this.smartSubjectFocusKey =
            cleanSubjectKey;
        this.smartSubjectEditorKey =
            cleanSubjectKey;
        this.clearRuntimeNotice();
        this.render();
    },

    closeSmartSubjectEditor() {
        if (!this.smartSubjectEditorKey) {
            return;
        }

        this.smartSubjectEditorKey = "";
        this.render();
    },

    buildSmartTopicReviewModel() {
        const activeSubjects =
            this.getSmartSubjectOptions().filter(
                (item) =>
                    item.active &&
                    !item.disabled &&
                    item.selectedTopicCount !==
                        0
            );

        const safeIndex =
            Math.min(
                Math.max(
                    0,
                    Number(
                        this.smartTopicReviewIndex
                    ) || 0
                ),
                Math.max(
                    activeSubjects.length - 1,
                    0
                )
            );
        const currentSubject =
            activeSubjects[safeIndex] ||
            null;

        return {
            activeSubjects,
            totalTopics:
                activeSubjects.reduce(
                    (sum, subject) =>
                        sum +
                        Number(
                            subject.selectedTopicCount ||
                                0
                        ),
                    0
                ),
            currentIndex:
                safeIndex,
            totalSubjects:
                activeSubjects.length,
            currentSubject,
            hasPrevious:
                safeIndex > 0,
            hasNext:
                safeIndex <
                activeSubjects.length - 1
        };
    },

    openSmartTopicReview() {
        const selectedSeries =
            this.getSelectedSmartSeries();

        if (!selectedSeries.length) {
            this.runtimeNotice =
                "Selecione ao menos uma serie antes de escolher as materias.";
            this.openLauncher(
                "smart_start"
            );
            return;
        }

        const reviewModel =
            this.buildSmartTopicReviewModel();

        if (
            !reviewModel.activeSubjects.length
        ) {
            this.runtimeNotice =
                "Mantenha pelo menos uma materia com assuntos ativos para continuar.";
            this.render();
            return;
        }

        this.dismissCoachHint(
            "smart_subjects"
        );
        this.smartSubjectEditorKey = "";
        this.smartTopicReviewIndex = 0;
        this.clearRuntimeNotice();
        this.smartTopicReviewOpen = true;
        this.render();
    },

    closeSmartTopicReview() {
        if (!this.smartTopicReviewOpen) {
            return;
        }

        this.smartTopicReviewOpen = false;
        this.smartTopicReviewIndex = 0;
        this.render();
    },

    goToSmartTopicReviewStep(
        direction = 0
    ) {
        if (!this.smartTopicReviewOpen) {
            return;
        }

        const reviewModel =
            this.buildSmartTopicReviewModel();
        const nextIndex =
            Math.min(
                Math.max(
                    reviewModel.currentIndex +
                        Number(direction || 0),
                    0
                ),
                Math.max(
                    reviewModel.totalSubjects -
                        1,
                    0
                )
            );

        this.smartTopicReviewIndex =
            nextIndex;
        this.render();
    },

    continueSmartTopicReview() {
        const reviewModel =
            this.buildSmartTopicReviewModel();

        if (
            !reviewModel.activeSubjects.length
        ) {
            this.runtimeNotice =
                "Mantenha pelo menos uma materia com assuntos ativos para continuar.";
            this.smartTopicReviewOpen =
                false;
            this.render();
            return;
        }

        this.smartTopicReviewOpen = false;
        this.smartTopicReviewIndex = 0;
        this.smartSubjectFocusKey = "";
        this.clearRuntimeNotice();
        this.openLauncher("smart");
    },

    startSmartSessionFromTopicReview() {
        const reviewModel =
            this.buildSmartTopicReviewModel();

        if (
            !reviewModel.activeSubjects.length
        ) {
            this.runtimeNotice =
                "Mantenha pelo menos uma materia com assuntos ativos para continuar.";
            this.smartTopicReviewOpen =
                false;
            this.render();
            return;
        }

        this.smartTopicReviewOpen = false;
        this.smartTopicReviewIndex = 0;
        this.smartSubjectFocusKey = "";
        this.clearRuntimeNotice();
        this.startSmartSession();
    },

    toggleSmartStartOption(optionKey) {
        if (
            this.routeUseCases
                ?.toggleSmartStartOption
        ) {
            return this.routeUseCases.toggleSmartStartOption(
                optionKey
            );
        }

        const cleanKey =
            String(optionKey || "")
                .trim()
                .toUpperCase();

        if (!cleanKey) {
            return;
        }

        if (cleanKey === "ENEM") {
            this.runtimeNotice =
                this.data.bases.ENEM
                    ?.available
                    ? "A base ENEM entra na pr\u00f3xima etapa do treino inteligente."
                    : "ENEM continua visivel aqui, mas ainda esta em preparacao.";
            this.render();
            return;
        }

        this.dismissCoachHint(
            "smart_start"
        );
        this.toggleSmartSeriesExclusion(
            cleanKey
        );
    },

    selectAllSmartStartOptions() {
        if (
            this.routeUseCases
                ?.selectAllSmartStartOptions
        ) {
            return this.routeUseCases.selectAllSmartStartOptions();
        }

        this.dismissCoachHint(
            "smart_start"
        );
        const availableSeries =
            QuestionsService.getSeriesOptions(
                this
            ).map((item) => item.key);
        const selectedSeries =
            QuestionsContext.get()
                .smartSelectedSeries || [];

        this.setSmartConfig({
            smartSelectedSeries:
                selectedSeries.length ===
                availableSeries.length
                    ? []
                    : [...availableSeries]
        });
    },

    continueSmartStart() {
        if (
            this.routeUseCases
                ?.continueSmartStart
        ) {
            return this.routeUseCases.continueSmartStart();
        }

        const activeOptions =
            this.getSmartStartOptions().filter(
                (item) =>
                    item.active &&
                    !item.disabled
            );

        if (!activeOptions.length) {
            this.runtimeNotice =
                "Selecione pelo menos uma s\u00e9rie para continuar.";
            this.render();
            return;
        }

        this.dismissCoachHint(
            "smart_start"
        );
        this.clearRuntimeNotice();
        this.openLauncher(
            "smart_subjects"
        );
    },

    toggleSmartSubjectOption(
        subjectKey
    ) {
        if (
            this.routeUseCases
                ?.toggleSmartSubjectOption
        ) {
            return this.routeUseCases.toggleSmartSubjectOption(
                subjectKey
            );
        }

        const option =
            this.getSmartSubjectOptions().find(
                (item) =>
                    item.key === subjectKey
            );

        if (!option || option.disabled) {
            return;
        }

        this.dismissCoachHint(
            "smart_subjects"
        );
        this.toggleSmartSubjectExclusion(
            subjectKey
        );
    },

    selectAllSmartSubjectOptions() {
        if (
            this.routeUseCases
                ?.selectAllSmartSubjectOptions
        ) {
            return this.routeUseCases.selectAllSmartSubjectOptions();
        }

        this.dismissCoachHint(
            "smart_subjects"
        );
        this.smartSubjectEditorKey = "";
        const availableSubjects =
            this.getSmartSubjectOptions()
                .filter(
                    (item) =>
                        !item.disabled
                )
                .map((item) => item.key);
        const selectedSubjects =
            QuestionsContext.get()
                .smartSelectedSubjects || [];
        const nextSelectedSubjects =
            selectedSubjects.length ===
            availableSubjects.length
                ? []
                : [...availableSubjects];

        this.smartSubjectFocusKey =
            nextSelectedSubjects[0] || "";

        this.setSmartConfig({
            smartSelectedSubjects:
                nextSelectedSubjects
        });
    },

    continueSmartSubjects() {
        if (
            this.routeUseCases
                ?.continueSmartSubjects
        ) {
            return this.routeUseCases.continueSmartSubjects();
        }

        const selectedSeries =
            this.getSelectedSmartSeries();

        if (!selectedSeries.length) {
            this.runtimeNotice =
                "Selecione ao menos uma s\u00e9rie antes de escolher as mat\u00e9rias.";
            this.openLauncher(
                "smart_start"
            );
            return;
        }

        const activeSubjects =
            this.getSmartSubjectOptions().filter(
                (item) =>
                    item.active &&
                    !item.disabled &&
                    item.selectedTopicCount !==
                        0
            );

        if (!activeSubjects.length) {
            this.runtimeNotice =
                "Mantenha pelo menos uma materia com assuntos ativos para continuar.";
            this.render();
            return;
        }

        this.dismissCoachHint(
            "smart_subjects"
        );
        this.openSmartTopicReview();
    },

    setDirectSearchInput(value = "") {
        this.directSearchInput =
            String(value || "");
    },

    applyDirectSearchLaunchIntent() {
        const launchInput =
            String(
                this.directSearchInput || ""
            ).trim();

        if (!launchInput) {
            this.directSearchAutoAddPending = false;
            this.directSearchAutoStartPending = false;
            this.directSearchLaunchLoading = false;
            return false;
        }

        if (
            this.directSearchAutoAddPending ===
            true
        ) {
            const shouldAutoStart =
                this.directSearchAutoStartPending ===
                true;
            this.directSearchLaunchLoading =
                shouldAutoStart;
            this.directSearchAutoAddPending = false;
            this.addDirectSearchTerm(
                launchInput,
                {
                    replace: true,
                    refresh:
                        !shouldAutoStart
                }
            );
            if (shouldAutoStart) {
                this.directSearchAutoStartPending = false;
                window.setTimeout(() => {
                    this.startDirectSearchSession();
                }, 0);
            }
            return true;
        }

        this.directSearchRefocusPending = true;
        this.directSearchAutoStartPending = false;
        this.directSearchLaunchLoading = false;
        this.render();
        return false;
    },

    async refreshDirectSearchMatches(
        options = {}
    ) {
        const shouldRender =
            options.render !== false;
        const terms =
            this.directSearchTerms
                .map((term) =>
                    String(term || "").trim()
                )
                .filter(Boolean);

        if (!terms.length) {
            this.directSearchLoading = false;
            this.directSearchMatchCount =
                null;

            if (shouldRender) {
                this.render();
            }

            return [];
        }

        this.directSearchLoading = true;

        if (shouldRender) {
            this.render();
        }

        try {
            await this.ensureDirectSearchCatalogLoaded(
                terms
            );

            const matches =
                this.getDirectSearchMatches();

            this.directSearchMatchCount =
                matches.length;
            this.directSearchLoading = false;

            if (shouldRender) {
                this.render();
            }

            return matches;
        } catch (_error) {
            this.directSearchLoading =
                false;
            this.directSearchMatchCount = 0;
            this.runtimeNotice =
                "Nao consegui carregar o banco completo para a busca agora.";

            if (shouldRender) {
                this.render();
            }

            return [];
        }
    },

    addDirectSearchTerm(rawValue = "", options = {}) {
        const normalized =
            String(rawValue || "")
                .replace(/\s+/g, " ")
                .trim();

        if (!normalized) {
            return;
        }

        const shouldReplace =
            options.replace === true;
        const currentTerms = shouldReplace
            ? []
            : this.directSearchTerms;
        const duplicate =
            currentTerms.some(
                (term) =>
                    QuestionsService.normalizeText(
                        term
                    ) ===
                    QuestionsService.normalizeText(
                        normalized
                    )
            );

        if (duplicate) {
            this.directSearchInput = "";
            this.directSearchRefocusPending =
                true;
            this.render();
            return;
        }

        this.directSearchTerms = [
            ...currentTerms,
            normalized
        ].slice(-8);
        this.directSearchInput = "";
        this.directSearchRefocusPending =
            true;
        this.clearRuntimeNotice();
        if (options.refresh !== false) {
            this.refreshDirectSearchMatches();
        } else {
            this.directSearchMatchCount = null;
            this.render();
        }
    },

    removeDirectSearchTerm(rawValue = "") {
        const normalized =
            QuestionsService.normalizeText(
                rawValue
            );
        this.directSearchTerms =
            this.directSearchTerms.filter(
                (term) =>
                    QuestionsService.normalizeText(
                        term
                    ) !== normalized
            );
        this.refreshDirectSearchMatches();
    },

    clearDirectSearchTerms() {
        this.directSearchTerms = [];
        this.directSearchInput = "";
        this.directSearchLoading = false;
        this.directSearchMatchCount =
            null;
        this.render();
    },

    getDirectSearchMatches() {
        const terms =
            this.directSearchTerms
                .map((term) => String(term || "").trim())
                .filter(Boolean);

        if (!terms.length) {
            return [];
        }

        return QuestionsService.getAllQuestions(
            this,
            {}
        )
            .map((question) => {
                const score =
                    QuestionsService.getDirectSearchQuestionScore(
                        question,
                        terms
                    );

                return score > 0
                    ? {
                          ...question,
                          directSearchScore:
                              score
                      }
                    : null;
            })
            .filter(Boolean);
    },

    async startDirectSearchSession() {
        if (!this.directSearchTerms.length) {
            this.directSearchLaunchLoading = false;
            this.runtimeNotice =
                "Digite pelo menos um assunto ou subassunto para gerar o treino direto.";
            this.render();
            return;
        }

        const list =
            await this.refreshDirectSearchMatches(
                {
                    render: true
                }
            );

        if (!list.length) {
            this.directSearchLaunchLoading = false;
            this.runtimeNotice =
                "Nao encontrei questoes para os termos buscados agora. Tente outro assunto ou subassunto.";
            this.render();
            return;
        }

        const label =
            this.directSearchTerms
                .slice(0, 3)
                .join(" + ");
        const strategy =
            "gradual";
        const orderedList =
            QuestionsService.orderDirectSearchQuestions(
                list,
                strategy,
                {
                    terms: this.directSearchTerms
                }
            );

        this.clearRuntimeNotice();
        this.directSearchLaunchLoading = false;
        this.startSession({
            sessionList: orderedList,
            sourceMode: "direct_search",
            meta: {
                title: `Busca direta - ${label}`,
                routeLabel: "Busca direta",
                requestedCount:
                    orderedList.length,
                availableCount:
                    orderedList.length,
                readyCount:
                    orderedList.length,
                directSearchTerms: [
                    ...this.directSearchTerms
                ],
                directSearchStrategy:
                    strategy,
                trainingModeLabel:
                    "Busca por assunto",
                trainingValueLabel:
                    "Gradativa"
            }
        });
    },

    toggleSmartSeriesExclusion(
        serieKey
    ) {
        if (
            this.routeUseCases
                ?.toggleSmartSeriesExclusion
        ) {
            return this.routeUseCases.toggleSmartSeriesExclusion(
                serieKey
            );
        }

        const ctx =
            QuestionsContext.get();
        const serie =
            Number(serieKey);

        if (!Number.isFinite(serie)) {
            return;
        }

        const selected =
            Array.isArray(
                ctx.smartSelectedSeries
            )
                ? [
                    ...ctx.smartSelectedSeries
                ]
                : [];
        const next =
            selected.includes(serie)
                ? selected.filter(
                    (item) => item !== serie
                )
                : [...selected, serie];

        this.setSmartConfig({
            smartSelectedSeries: next
        });
    },

    toggleSmartBaseExclusion(baseKey) {
        if (
            this.routeUseCases
                ?.toggleSmartBaseExclusion
        ) {
            return this.routeUseCases.toggleSmartBaseExclusion(
                baseKey
            );
        }

        const base =
            this.data.bases?.[baseKey];

        if (!base?.available) {
            return;
        }

        const ctx =
            QuestionsContext.get();
        const excluded =
            Array.isArray(
                ctx.smartExcludedBases
            )
                ? [
                    ...ctx.smartExcludedBases
                ]
                : [];
        const next =
            excluded.includes(baseKey)
                ? excluded.filter(
                    (item) =>
                        item !== baseKey
                )
                : [...excluded, baseKey];

        this.setSmartConfig({
            smartExcludedBases: next
        });
    },

    toggleSmartSubjectExclusion(
        subjectKey
    ) {
        if (
            this.routeUseCases
                ?.toggleSmartSubjectExclusion
        ) {
            return this.routeUseCases.toggleSmartSubjectExclusion(
                subjectKey
            );
        }

        const key =
            String(subjectKey || "")
                .trim()
                .toLowerCase();

        if (!key) {
            return;
        }

        const ctx =
            QuestionsContext.get();
        const selected =
            Array.isArray(
                ctx.smartSelectedSubjects
            )
                ? [
                    ...ctx.smartSelectedSubjects
                ]
                : [];
        const next =
            selected.includes(key)
                ? selected.filter(
                    (item) => item !== key
                )
                : [...selected, key];
        const isAdding =
            !selected.includes(key);
        const orderedActiveKeys =
            this.getSmartSubjectOptions()
                .filter(
                    (item) => !item.disabled
                )
                .map((item) => item.key)
                .filter((item) =>
                    next.includes(item)
                );
        const nextFocusKey =
            isAdding
                ? key
                : orderedActiveKeys.includes(
                    this.smartSubjectFocusKey
                )
                    ? this.smartSubjectFocusKey
                    : orderedActiveKeys[0] ||
                        "";

        if (
            selected.includes(key) &&
            this.smartSubjectEditorKey ===
                key
        ) {
            this.smartSubjectEditorKey =
                "";
        }

        this.smartSubjectFocusKey =
            nextFocusKey;

        this.setSmartConfig({
            smartSelectedSubjects: next
        });
    },

    clearSmartExclusions() {
        if (
            this.routeUseCases
                ?.clearSmartExclusions
        ) {
            return this.routeUseCases.clearSmartExclusions();
        }

        this.setSmartConfig({
            smartSelectedSeries: [],
            smartSelectedSubjects: [],
            smartExcludedSeries: [],
            smartExcludedBases: [],
            smartExcludedSubjects: [],
            smartExcludedTopicsBySubject:
                {}
        });
    },

    buildSmartProfilePayload(
        overrides = {}
    ) {
        if (
            this.launcherSelectors
                ?.buildSmartProfilePayload
        ) {
            return this.launcherSelectors.buildSmartProfilePayload(
                overrides
            );
        }

        const ctx =
            QuestionsContext.get();

        return {
            smartGoal:
                ctx.smartGoal ||
                "continue",
            sessionMetric:
                ctx.smartSessionMetric ||
                "quantidade",
            selectedSeries: [
                ...(ctx.smartSelectedSeries ||
                    [])
            ],
            selectedSubjects: [
                ...(ctx.smartSelectedSubjects ||
                    [])
            ],
            excludedSeries: [
                ...(ctx.smartExcludedSeries ||
                    [])
            ],
            excludedBases: [
                ...(ctx.smartExcludedBases ||
                    [])
            ],
            excludedSubjects: [
                ...(ctx.smartExcludedSubjects ||
                    [])
            ],
            excludedTopicsBySubject: {
                ...(
                    ctx.smartExcludedTopicsBySubject ||
                    {}
                )
            },
            preferredAmount:
                Number(
                    ctx.quantidadeQuestoes
                ) || 5,
            questionCount:
                ctx.smartQuestionCount === null
                    ? null
                    : Number(
                        ctx.smartQuestionCount
                    ) || 5,
            timeMinutes:
                ctx.smartTimeMinutes === null
                    ? null
                    : Number(
                        ctx.smartTimeMinutes
                    ) || 15,
            ...overrides
        };
    },

    getSuggestedSmartProfileName() {
        if (
            this.launcherSelectors
                ?.getSuggestedSmartProfileName
        ) {
            return this.launcherSelectors.getSuggestedSmartProfileName();
        }

        const ctx =
            QuestionsContext.get();
        const goalLabel =
            this.data.smartGoals?.[
                ctx.smartGoal
            ]?.label ||
            "Continuar";
        const subjects =
            QuestionsService.getSubjectOptions(
                this
            );
        const selectedSubjects =
            (ctx.smartSelectedSubjects || [])
                .map((subjectKey) =>
                    subjects.find(
                        (subject) =>
                            subject.key ===
                            subjectKey
                    )?.label || ""
                )
                .filter(Boolean);
        const selectedSeries =
            (ctx.smartSelectedSeries || []).map(
                (serie) => `${serie}\u00aa s\u00e9rie`
            );
        const pieces = [];

        if (selectedSubjects.length) {
            pieces.push(
                selectedSubjects
                    .slice(0, 2)
                    .join(" e ")
            );
        } else if (
            selectedSeries.length
        ) {
            pieces.push(
                selectedSeries
                    .slice(0, 2)
                    .join(" e ")
            );
        }

        return [
            "Treino inteligente",
            goalLabel.toLowerCase(),
            ...pieces
        ].join(" - ");
    },

    saveCurrentSmartProfile() {
        if (
            this.libraryUseCases
                ?.saveCurrentSmartProfile
        ) {
            return this.libraryUseCases.saveCurrentSmartProfile();
        }

        const suggestedName =
            this.getSuggestedSmartProfileName();
        const name = window.prompt(
            "Nome do perfil inteligente:",
            suggestedName
        );

        if (name === null) {
            return;
        }

        const cleanName =
            String(name || "").trim() ||
            suggestedName;

        QuestionsStore.saveSmartProfile({
            name: cleanName,
            ...this.buildSmartProfilePayload()
        });

        this.runtimeNotice =
            `Perfil salvo: ${cleanName}.`;
        this.openLauncher(
            "smart_profiles"
        );
    },

    applySmartProfile(profileId) {
        if (
            this.libraryUseCases
                ?.applySmartProfile
        ) {
            return this.libraryUseCases.applySmartProfile(
                profileId
            );
        }

        const profile =
            QuestionsStore.getSmartProfileById(
                profileId
            );

        if (!profile) {
            this.runtimeNotice =
                "Nao foi possivel encontrar esse perfil inteligente.";
            this.openLauncher(
                "smart_profiles"
            );
            return;
        }

        QuestionsStore.markSmartProfileUsed(
            profile.id
        );
        this.setSmartConfig({
            smartGoal:
                profile.smartGoal ||
                    "continue",
            smartSessionMetric:
                profile.sessionMetric ||
                "quantidade",
            smartSelectedSeries: [
                ...(profile.selectedSeries ||
                    [])
            ],
            smartSelectedSubjects: [
                ...(profile.selectedSubjects ||
                    [])
            ],
            smartExcludedSeries: [
                ...(profile.excludedSeries ||
                    [])
            ],
            smartExcludedBases: [
                ...(profile.excludedBases ||
                    [])
            ],
            smartExcludedSubjects: [
                ...(profile.excludedSubjects ||
                    [])
            ],
            smartExcludedTopicsBySubject:
                {
                    ...(
                        profile.excludedTopicsBySubject ||
                        {}
                    )
                },
            smartQuestionCount:
                profile.questionCount === null
                    ? null
                    : Number(
                        profile.questionCount
                    ) || 5,
            smartTimeMinutes:
                profile.timeMinutes === null
                    ? null
                    : Number(
                        profile.timeMinutes
                    ) || 15,
            quantidadeQuestoes:
                Number(
                    profile.preferredAmount
                ) ||
                QuestionsContext.get()
                    .quantidadeQuestoes
        });
        this.runtimeNotice =
            `Perfil aplicado: ${profile.name}.`;
        this.openLauncher("smart");
    },

    saveSmartPresetAndStart() {
        const preview =
            this.buildSmartRoutePreview();

        if (
            !preview.isReady ||
            !preview.patch
        ) {
            this.runtimeNotice =
                preview.reason ||
                "Nao foi possivel iniciar esse treino agora.";
            this.render();
            return;
        }

        const suggestedName =
            this.getSuggestedSmartProfileName();
        this.openDialog({
            title:
                "Salvar predefinicao",
            label:
                "Nome da predefinicao",
            value: suggestedName,
            confirmLabel: "Salvar e iniciar",
            onConfirm: async (name) => {
                const cleanName =
                    String(
                        name || ""
                    ).trim() ||
                    suggestedName;
                const savedProfile =
                    QuestionsStore.saveSmartProfile(
                        {
                            name: cleanName,
                            ...this.buildSmartProfilePayload(
                                {
                                    preferredAmount:
                                        preview.amount
                                }
                            )
                        }
                    );
                if (
                    typeof this
                        .ensureRouteCatalogLoaded ===
                    "function"
                ) {
                    await this.ensureRouteCatalogLoaded(
                        preview.patch
                    );
                }
                const snapshot =
                    this.buildSessionSnapshotForBlock(
                        preview.patch,
                        {
                            sourceMode:
                                "smart",
                            launcherContext:
                                QuestionsContext.get(),
                            meta: {
                                customTitle:
                                    cleanName
                            }
                        }
                    );
                const savedBlock =
                    this.saveBlockSnapshot(
                        snapshot,
                        {
                            sourceMode:
                                "smart",
                            defaultName:
                                cleanName,
                            note:
                                preview.note ||
                                "",
                            profileId:
                                savedProfile?.id ||
                                "",
                            skipPrompt:
                                true,
                            silent: true
                        }
                    );

                if (!savedBlock) {
                    this.runtimeNotice =
                        "Nao foi possivel guardar esse treino agora. Tente novamente.";
                    this.openLauncher("smart");
                    return;
                }

                this.runtimeNotice =
                    `Predefinicao salva: ${cleanName}.`;
                this.startSmartSession(
                    {
                        meta: {
                            customTitle:
                                cleanName
                        },
                        profileId:
                            savedProfile?.id ||
                            "",
                        savedBlockId:
                            savedBlock?.id ||
                            ""
                    }
                );
            }
        });
    },

    renameSmartProfile(profileId) {
        if (
            this.libraryUseCases
                ?.renameSmartProfile
        ) {
            return this.libraryUseCases.renameSmartProfile(
                profileId
            );
        }

        const profile =
            QuestionsStore.getSmartProfileById(
                profileId
            );

        if (!profile) {
            this.runtimeNotice =
                "Nao foi possivel encontrar esse perfil inteligente.";
            this.openLauncher(
                "smart_profiles"
            );
            return;
        }

        const name = window.prompt(
            "Novo nome do perfil:",
            profile.name || ""
        );

        if (name === null) {
            return;
        }

        const cleanName =
            String(name || "").trim();

        if (!cleanName) {
            this.runtimeNotice =
                "O perfil precisa de um nome para ser salvo.";
            this.openLauncher(
                "smart_profiles"
            );
            return;
        }

        QuestionsStore.saveSmartProfile({
            ...profile,
            name: cleanName
        });
        this.runtimeNotice =
            `Perfil renomeado para ${cleanName}.`;
        this.openLauncher(
            "smart_profiles"
        );
    },

    duplicateSmartProfile(profileId) {
        if (
            this.libraryUseCases
                ?.duplicateSmartProfile
        ) {
            return this.libraryUseCases.duplicateSmartProfile(
                profileId
            );
        }

        const profile =
            QuestionsStore.getSmartProfileById(
                profileId
            );

        if (!profile) {
            this.runtimeNotice =
                "Nao foi possivel duplicar esse perfil inteligente.";
            this.openLauncher(
                "smart_profiles"
            );
            return;
        }

        const defaultName =
            `${profile.name} copia`;
        const name = window.prompt(
            "Nome da copia do perfil:",
            defaultName
        );

        if (name === null) {
            return;
        }

        const cleanName =
            String(name || "").trim() ||
            defaultName;

        QuestionsStore.saveSmartProfile({
            ...profile,
            id: "",
            createdAt: 0,
            updatedAt: 0,
            lastUsedAt: 0,
            name: cleanName
        });
        this.runtimeNotice =
            `Perfil duplicado: ${cleanName}.`;
        this.openLauncher(
            "smart_profiles"
        );
    },

    deleteSmartProfile(
        profileId,
        options = {}
    ) {
        if (
            this.libraryUseCases
                ?.deleteSmartProfile
        ) {
            return this.libraryUseCases.deleteSmartProfile(
                profileId,
                options
            );
        }

        const profile =
            QuestionsStore.getSmartProfileById(
                profileId
            );

        if (!profile) {
            this.runtimeNotice =
                "Nao foi possivel encontrar esse perfil inteligente.";
            this.openLauncher(
                "smart_profiles"
            );
            return;
        }

        this.openConfirmDialog({
            title: "Apagar perfil",
            message:
                `Apagar o perfil "${profile.name}"?`,
            confirmLabel: "Apagar",
            anchorRect:
                options.anchorRect ||
                null,
            onConfirm: () => {
                QuestionsStore.deleteSmartProfile(
                    profileId
                );
                this.runtimeNotice =
                    `Perfil apagado: ${profile.name}.`;
                this.openLauncher(
                    "smart_profiles"
                );
            }
        });
    },

    buildSavedBlockName(
        meta = {},
        context = {},
        sourceMode = ""
    ) {
        const customTitle =
            String(
                meta.customTitle || ""
            ).trim();

        if (customTitle) {
            return customTitle;
        }

        if (
            this.launcherSelectors
                ?.buildSavedBlockName
        ) {
            return this.launcherSelectors.buildSavedBlockName(
                meta,
                context,
                sourceMode
            );
        }

        const modeLabel =
            sourceMode === "smart"
                ? "Bloco inteligente"
                : "Bloco especifico";
        const materia =
            meta.materiaLabel ||
            context.materia ||
            "Mat\u00e9ria";
        const topics =
            Array.isArray(
                meta.topicsLabel
            )
                ? meta.topicsLabel.filter(
                    Boolean
                )
                : [];

        if (topics.length) {
            return `${modeLabel} - ${materia} - ${topics
                .slice(0, 2)
                .join(", ")}`;
        }

        return `${modeLabel} - ${materia}`;
    },

    buildSessionSnapshotForBlock(
        routeContext = {},
        options = {}
    ) {
        const previousContext =
            QuestionsContext.get();
        const nextContext = {
            ...previousContext,
            ...(routeContext || {})
        };

        QuestionsContext.replace(
            nextContext,
            false
        );

        try {
            const list =
                QuestionsService.buildSession(
                    this
                );
            const meta = {
                ...QuestionsService.getRouteSummary(
                    this
                ),
                ...(
                    options.meta &&
                    typeof options.meta ===
                        "object"
                        ? options.meta
                        : {}
                ),
                sourceMode:
                    options.sourceMode ||
                    "specific"
            };

            return {
                list,
                meta,
                routeContext: {
                    ...QuestionsContext.get()
                },
                launcherContext: {
                    ...(
                        options.launcherContext ||
                        previousContext
                    )
                }
            };
        } finally {
            QuestionsContext.replace(
                previousContext,
                false
            );
        }
    },

    saveBlockSnapshot(
        snapshot = {},
        options = {}
    ) {
        if (
            this.libraryUseCases
                ?.saveBlockSnapshot
        ) {
            return this.libraryUseCases.saveBlockSnapshot(
                snapshot,
                options
            );
        }

        if (
            this.legacyLibraryFallback
                ?.saveBlockSnapshot
        ) {
            return this.legacyLibraryFallback.saveBlockSnapshot(
                snapshot,
                options
            );
        }

        const list = Array.isArray(
            snapshot.list
        )
            ? snapshot.list
            : [];
        const meta =
            snapshot.meta &&
            typeof snapshot.meta === "object"
                ? {
                    ...snapshot.meta
                }
                : {};
        const routeContext =
            snapshot.routeContext &&
            typeof snapshot.routeContext ===
                "object"
                ? {
                    ...snapshot.routeContext
                }
                : {
                    ...QuestionsContext.get()
                };
        const launcherContext =
            snapshot.launcherContext &&
            typeof snapshot.launcherContext ===
                "object"
                ? {
                    ...snapshot.launcherContext
                }
                : {
                    ...routeContext
                };
        const sourceMode =
            options.sourceMode ||
            meta.sourceMode ||
            "specific";

        if (!list.length) {
            this.runtimeNotice =
                "Nao foi possivel salvar um bloco vazio com o recorte atual.";
            this.render();
            return null;
        }

        const suggestedName =
            this.buildSavedBlockName(
                meta,
                routeContext,
                sourceMode
            );
        const requestedName =
            options.skipPrompt === true
                ? options.defaultName
                : window.prompt(
                    "Nome do bloco salvo:",
                    options.defaultName ||
                        suggestedName
                );

        if (
            requestedName === null &&
            options.skipPrompt !== true
        ) {
            return null;
        }

        const cleanName =
            String(
                requestedName || ""
            ).trim() ||
            suggestedName;
        const block =
            QuestionsStore.saveSavedBlock({
                name: cleanName,
                mode: sourceMode,
                launcherContext,
                routeSnapshot: {
                    context: routeContext,
                    meta,
                    note:
                        String(
                            options.note || ""
                        ).trim()
                },
                questionIds: list.map(
                    (question) =>
                        question?.id || ""
                ),
                sessionSnapshot: list,
                profileId:
                    String(
                        options.profileId || ""
                    ).trim()
            });

        if (options.silent !== true) {
            this.runtimeNotice =
                `Bloco salvo: ${cleanName}.`;
            this.render();
        }

        return block;
    },

    saveCurrentSpecificBlock() {
        if (
            this.libraryUseCases
                ?.saveCurrentSpecificBlock
        ) {
            return this.libraryUseCases.saveCurrentSpecificBlock();
        }

        if (
            this.legacyLibraryFallback
                ?.saveCurrentSpecificBlock
        ) {
            return this.legacyLibraryFallback.saveCurrentSpecificBlock();
        }

        const validation =
            QuestionsService.getLauncherValidation(
                this
            );

        if (!validation.isReady) {
            this.runtimeNotice =
                validation.issues[0] ||
                "Complete a rota antes de salvar um bloco.";
            this.openLauncher(
                "specific"
            );
            return;
        }

        const current =
            QuestionsContext.get();
        const list =
            QuestionsService.buildSession(this);

        this.saveBlockSnapshot(
            {
                list,
                meta: {
                    ...QuestionsService.getRouteSummary(
                        this
                    ),
                    sourceMode: "specific"
                },
                routeContext: current,
                launcherContext: current
            },
            {
                sourceMode: "specific"
            }
        );
    },

    saveCurrentSmartBlock() {
        if (
            this.libraryUseCases
                ?.saveCurrentSmartBlock
        ) {
            return this.libraryUseCases.saveCurrentSmartBlock();
        }

        if (
            this.legacyLibraryFallback
                ?.saveCurrentSmartBlock
        ) {
            return this.legacyLibraryFallback.saveCurrentSmartBlock();
        }

        const current =
            QuestionsContext.get();
        const preview =
            this.buildSmartRoutePreview();

        if (
            !preview.isReady ||
            !preview.patch
        ) {
            this.runtimeNotice =
                preview.reason ||
                "Nao foi possivel salvar um bloco inteligente com o recorte atual.";
            this.openLauncher("smart");
            return;
        }

        const snapshot =
            this.buildSessionSnapshotForBlock(
                preview.patch,
                {
                    sourceMode: "smart",
                    launcherContext: current
                }
            );

        this.saveBlockSnapshot(snapshot, {
            sourceMode: "smart",
            note: preview.note || ""
        });
    },

    openSavedBlock(blockId) {
        if (
            this.libraryUseCases
                ?.openSavedBlock
        ) {
            return this.libraryUseCases.openSavedBlock(
                blockId
            );
        }

        if (
            this.legacyLibraryFallback
                ?.openSavedBlock
        ) {
            return this.legacyLibraryFallback.openSavedBlock(
                blockId
            );
        }

        const block =
            QuestionsStore.getSavedBlockById(
                blockId
            );

        if (!block) {
            this.runtimeNotice =
                "Nao foi possivel encontrar esse bloco salvo.";
            this.openLauncher("saved");
            return;
        }

        this.activeSavedBlockId =
            String(block.id || "");
        this.openLauncher("saved_detail");
    },

    async startSavedBlock(blockId) {
        if (
            this.libraryUseCases
                ?.startSavedBlock
        ) {
            return this.libraryUseCases.startSavedBlock(
                blockId
            );
        }

        if (
            !this.libraryUseCases &&
            !this.legacyRecoveryFallback
        ) {
            await this.ensureLegacyRecoveryFallback();
        }

        if (
            this.legacyRecoveryFallback
                ?.startSavedBlock
        ) {
            return this.legacyRecoveryFallback.startSavedBlock(
                blockId
            );
        }

        const block =
            QuestionsStore.getSavedBlockById(
                blockId
            );

        if (!block) {
            this.runtimeNotice =
                "Nao foi possivel encontrar esse bloco salvo.";
            this.openLauncher("saved");
            return;
        }

        if (
            !this.resolveQuestionList(
                block.questionIds,
                block.sessionSnapshot
            ).length
        ) {
            this.runtimeNotice =
                "Esse bloco n\u00e3o tem quest\u00f5es suficientes para ser refeito.";
            this.openLauncher("saved");
            return;
        }

        QuestionsStore.markSavedBlockUsed(
            block.id
        );
        this.clearRuntimeNotice();
        this.startSession({
            sessionList:
                this.resolveQuestionList(
                    block.questionIds,
                    block.sessionSnapshot
                ),
            questionIds:
                block.questionIds || [],
            meta: {
                ...(block.routeSnapshot
                    ?.meta || {}),
                sourceMode:
                    block.mode ||
                    block.routeSnapshot?.meta
                        ?.sourceMode ||
                    "specific"
            },
            routeContext:
                block.routeSnapshot
                    ?.context || {},
            sourceMode:
                block.mode || "specific",
            savedBlockId: block.id
        });
    },

    renameSavedBlock(blockId) {
        if (
            this.libraryUseCases
                ?.renameSavedBlock
        ) {
            return this.libraryUseCases.renameSavedBlock(
                blockId
            );
        }

        if (
            this.legacyLibraryFallback
                ?.renameSavedBlock
        ) {
            return this.legacyLibraryFallback.renameSavedBlock(
                blockId
            );
        }

        const block =
            QuestionsStore.getSavedBlockById(
                blockId
            );

        if (!block) {
            this.runtimeNotice =
                "Nao foi possivel encontrar esse bloco salvo.";
            this.openLauncher("saved");
            return;
        }

        const name = window.prompt(
            "Novo nome do bloco:",
            block.name || ""
        );

        if (name === null) {
            return;
        }

        const cleanName =
            String(name || "").trim();

        if (!cleanName) {
            this.runtimeNotice =
                "O bloco precisa de um nome para ser salvo.";
            this.openLauncher("saved");
            return;
        }

        QuestionsStore.saveSavedBlock({
            ...block,
            name: cleanName
        });
        this.runtimeNotice =
            `Bloco renomeado para ${cleanName}.`;
        this.openLauncher("saved");
    },

    duplicateSavedBlock(blockId) {
        if (
            this.libraryUseCases
                ?.duplicateSavedBlock
        ) {
            return this.libraryUseCases.duplicateSavedBlock(
                blockId
            );
        }

        if (
            this.legacyLibraryFallback
                ?.duplicateSavedBlock
        ) {
            return this.legacyLibraryFallback.duplicateSavedBlock(
                blockId
            );
        }

        const block =
            QuestionsStore.getSavedBlockById(
                blockId
            );

        if (!block) {
            this.runtimeNotice =
                "Nao foi possivel duplicar esse bloco salvo.";
            this.openLauncher("saved");
            return;
        }

        const defaultName =
            `${block.name} copia`;
        const name = window.prompt(
            "Nome da copia do bloco:",
            defaultName
        );

        if (name === null) {
            return;
        }

        const cleanName =
            String(name || "").trim() ||
            defaultName;

        QuestionsStore.saveSavedBlock({
            ...block,
            id: "",
            createdAt: 0,
            updatedAt: 0,
            lastUsedAt: 0,
            name: cleanName
        });
        this.runtimeNotice =
            `Bloco duplicado: ${cleanName}.`;
        this.openLauncher("saved");
    },

    deleteSavedBlock(
        blockId,
        options = {}
    ) {
        if (
            this.libraryUseCases
                ?.deleteSavedBlock
        ) {
            return this.libraryUseCases.deleteSavedBlock(
                blockId,
                options
            );
        }

        if (
            this.legacyLibraryFallback
                ?.deleteSavedBlock
        ) {
            return this.legacyLibraryFallback.deleteSavedBlock(
                blockId,
                options
            );
        }

        const block =
            QuestionsStore.getSavedBlockById(
                blockId
            );

        if (!block) {
            this.runtimeNotice =
                "Nao foi possivel encontrar esse bloco salvo.";
            this.openLauncher("saved");
            return;
        }

        QuestionsStore.deleteSavedBlock(
            block.id
        );
        this.runtimeNotice =
            `Bloco apagado: ${block.name}.`;
        this.openLauncher("saved");
    },

    buildRunTitle(
        meta = {},
        context = {},
        sourceMode = ""
    ) {
        const customTitle =
            String(
                meta.customTitle || ""
            ).trim();

        if (customTitle) {
            return customTitle;
        }

        if (
            this.launcherSelectors
                ?.buildRunTitle
        ) {
            return this.launcherSelectors.buildRunTitle(
                meta,
                context,
                sourceMode
            );
        }

        const modeLabel =
            sourceMode === "smart"
                ? "Treino inteligente"
                : sourceMode ===
                      "direct_search"
                    ? "Busca por assunto"
                    : "Treino especifico";
        const materia =
            meta.materiaLabel ||
            context.materia ||
            "Mat\u00e9ria";
        const topics =
            Array.isArray(
                meta.topicsLabel
            )
                ? meta.topicsLabel.filter(
                    Boolean
                )
                : [];

        if (topics.length) {
            return `${modeLabel} - ${materia} - ${topics
                .slice(0, 2)
                .join(", ")}`;
        }

        return `${modeLabel} - ${materia}`;
    },

    createRunFromSession(
        list = [],
        meta = {},
        options = {}
    ) {
        if (
            this.sessionUseCases
                ?.createRunFromSession
        ) {
            return this.sessionUseCases.createRunFromSession(
                list,
                meta,
                options
            );
        }

        if (
            this.legacySessionFallback
                ?.createRunFromSession
        ) {
            return this.legacySessionFallback.createRunFromSession(
                list,
                meta,
                options
            );
        }

        const ctx =
            QuestionsContext.get();
        const sourceMode =
            options.sourceMode ||
            meta.sourceMode ||
            "specific";

        return QuestionsStore.saveRun({
            mode: sourceMode,
            status: "in_progress",
            title: this.buildRunTitle(
                meta,
                ctx,
                sourceMode
            ),
            routeSnapshot: {
                context: {
                    ...ctx
                },
                meta: {
                    ...meta
                }
            },
            questionIds: (list || []).map(
                (question) =>
                    question?.id || ""
            ),
            sessionSnapshot: Array.isArray(
                list
            )
                ? [...list]
                : [],
            currentIndex:
                Number(
                    options.currentIndex
                ) || 0,
            answers: Array.isArray(
                options.answers
            )
                ? [...options.answers]
                : [],
            lastAnswer:
                options.lastAnswer || null,
            profileId:
                String(
                    options.profileId || ""
                ).trim(),
            savedBlockId:
                String(
                    options.savedBlockId || ""
                ).trim(),
            startedAt:
                Number(
                    options.startedAt
                ) || Date.now(),
            summary:
                options.summary || null
        });
    },

    persistActiveRun(
        status = "in_progress",
        extra = {}
    ) {
        if (
            this.sessionUseCases
                ?.persistActiveRun
        ) {
            return this.sessionUseCases.persistActiveRun(
                status,
                extra
            );
        }

        if (
            this.legacySessionFallback
                ?.persistActiveRun
        ) {
            return this.legacySessionFallback.persistActiveRun(
                status,
                extra
            );
        }

        const runId =
            QuestionsState.getActiveRunId();

        if (!runId) {
            return null;
        }

        const meta =
            QuestionsState.getMeta();
        const ctx =
            QuestionsContext.get();
        const sourceMode =
            extra.mode ||
            meta.sourceMode ||
            "specific";
        const patch = {
            mode: sourceMode,
            status,
            title: this.buildRunTitle(
                meta,
                ctx,
                sourceMode
            ),
            currentIndex:
                Object.prototype.hasOwnProperty.call(
                    extra,
                    "currentIndex"
                )
                    ? Number(
                        extra.currentIndex
                    ) || 0
                    : QuestionsState.getCurrent(),
            answers:
                Array.isArray(
                    extra.answers
                )
                    ? [...extra.answers]
                    : QuestionsState.getResults(),
            lastAnswer:
                Object.prototype.hasOwnProperty.call(
                    extra,
                    "lastAnswer"
                )
                    ? extra.lastAnswer
                    : QuestionsState.getLastAnswer(),
            completedAt:
                status === "completed"
                    ? Date.now()
                    : 0,
            summary:
                extra.summary ||
                QuestionsStore.getRunById(
                    runId
                )?.summary ||
                null
        };

        if (extra.refreshSnapshot) {
            const session =
                QuestionsState.getSession();
            patch.routeSnapshot = {
                context: {
                    ...ctx
                },
                meta: {
                    ...meta
                }
            };
            patch.questionIds =
                session.map((question) =>
                    question?.id || ""
                );
            patch.sessionSnapshot =
                Array.isArray(session)
                    ? [...session]
                    : [];
        }

        return QuestionsStore.updateRun(
            runId,
            patch
        );
    },

    pauseSession() {
        if (
            this.sessionUseCases
                ?.pauseSession
        ) {
            return this.sessionUseCases.pauseSession();
        }

        if (
            this.legacySessionFallback
                ?.pauseSession
        ) {
            return this.legacySessionFallback.pauseSession();
        }

        if (
            QuestionsState.getPhase() !==
            "session"
        ) {
            this.openLauncher(
                this.getSessionReturnView(
                    "home"
                )
            );
            return;
        }

        QuestionsStore.flushProfileState(true);
        this.pauseSimuladoTimer();
        this.persistActiveRun(
            "in_progress"
        );
        this.runtimeNotice =
            "Treino pausado. Voce pode retomar depois.";
        this.openLauncher(
            this.getSessionReturnView(
                "home"
            )
        );
    },

    suppressAmbientForQuestionsSession() {
        if (
            typeof AmbientState ===
                "undefined" ||
            typeof AmbientUI === "undefined" ||
            typeof AmbientUI.setPanelMode !==
                "function"
        ) {
            return;
        }

        if (AmbientState.panelMode !== 2) {
            AmbientUI.setPanelMode(2);
        }
    },

    async resumeRun(runId) {
        if (
            this.sessionUseCases?.resumeRun
        ) {
            return this.sessionUseCases.resumeRun(
                runId
            );
        }

        if (
            !this.sessionUseCases &&
            !this.legacyRecoveryFallback
        ) {
            await this.ensureLegacyRecoveryFallback();
        }

        if (
            this.legacyRecoveryFallback
                ?.resumeRun
        ) {
            return this.legacyRecoveryFallback.resumeRun(
                runId
            );
        }

        const run =
            QuestionsStore.getRunById(runId);

        if (!run) {
            this.runtimeNotice =
                "N\u00e3o foi poss\u00edvel reencontrar essa sess\u00e3o.";
            this.openLauncher("resume");
            return;
        }

        const list =
            this.resolveQuestionList(
                run.questionIds,
                run.sessionSnapshot
            );

        if (!list.length) {
            this.runtimeNotice =
                "Essa sess\u00e3o n\u00e3o tem mais uma lista v\u00e1lida para retomada.";
            this.openLauncher("resume");
            return;
        }

        this.clearRuntimeNotice();
        this.startSession({
            sessionList: list,
            questionIds:
                run.questionIds || [],
            meta:
                run.routeSnapshot?.meta || {},
            routeContext:
                run.routeSnapshot?.context ||
                {},
            activeRunId: run.id,
            currentIndex:
                Number(
                    run.currentIndex
                ) || 0,
            results:
                Array.isArray(run.answers)
                    ? [...run.answers]
                    : [],
            lastAnswer:
                run.lastAnswer || null,
            sourceMode:
                run.mode || "specific",
            createRun: false
        });
    },

    async restartRun(runId) {
        if (
            this.sessionUseCases?.restartRun
        ) {
            return this.sessionUseCases.restartRun(
                runId
            );
        }

        if (
            !this.sessionUseCases &&
            !this.legacyRecoveryFallback
        ) {
            await this.ensureLegacyRecoveryFallback();
        }

        if (
            this.legacyRecoveryFallback
                ?.restartRun
        ) {
            return this.legacyRecoveryFallback.restartRun(
                runId
            );
        }

        const run =
            QuestionsStore.getRunById(runId);

        if (!run) {
            this.runtimeNotice =
                "N\u00e3o foi poss\u00edvel reencontrar essa sess\u00e3o.";
            this.openLauncher("resume");
            return;
        }

        const list =
            this.resolveQuestionList(
                run.questionIds,
                run.sessionSnapshot
            );

        if (!list.length) {
            this.runtimeNotice =
                "Essa sess\u00e3o n\u00e3o pode ser reiniciada porque a lista de quest\u00f5es n\u00e3o est\u00e1 mais dispon\u00edvel.";
            this.openLauncher("resume");
            return;
        }

        if (
            run.status === "in_progress"
        ) {
            QuestionsStore.updateRun(
                run.id,
                {
                    status: "abandoned"
                }
            );
        }

        this.clearRuntimeNotice();
        this.startSession({
            sessionList: list,
            questionIds:
                run.questionIds || [],
            meta:
                run.routeSnapshot?.meta || {},
            routeContext:
                run.routeSnapshot?.context ||
                {},
            sourceMode:
                run.mode || "specific",
            createRun: true
        });
    },

    deleteRun(
        runId,
        options = {}
    ) {
        const run =
            QuestionsStore.getRunById(runId);

        if (!run) {
            this.runtimeNotice =
                "N\u00e3o foi poss\u00edvel encontrar essa sess\u00e3o.";
            this.openLauncher("resume");
            return;
        }

        QuestionsStore.deleteRun(
            runId
        );
        this.runtimeNotice =
            `Sessao apagada: ${run.title}.`;
        this.openLauncher(
            "resume"
        );
    },

    exitModule() {
        if (
            typeof Core !==
                "undefined" &&
            typeof Core.goHome ===
                "function"
        ) {
            Core.goHome();
            return;
        }

        document.getElementById(
            "homeBtn"
        )?.click();

        if (
            typeof Core === "undefined" &&
            !document.getElementById(
                "homeBtn"
            )
        ) {
            window.location.href =
                "index.html";
        }
    },

    prepareHomeExit() {
        this.launcherHistory = [];

        if (
            QuestionsState.getPhase() ===
                "session" &&
            !QuestionsState.isComplete()
        ) {
            QuestionsStore.flushProfileState(
                true
            );
            this.pauseSimuladoTimer();
            this.persistActiveRun(
                "in_progress"
            );
            this.runtimeNotice =
                "Treino pausado. Voce pode retomar depois.";
        }

        QuestionsState.openLauncher(
            "home"
        );
    },

    buildSmartRoutePreview() {
        if (
            this.sessionUseCases
                ?.buildSmartRoutePreview
        ) {
            return this.sessionUseCases.buildSmartRoutePreview();
        }

        if (
            this.legacySessionFallback
                ?.buildSmartRoutePreview
        ) {
            return this.legacySessionFallback.buildSmartRoutePreview();
        }

        const current =
            QuestionsContext.get();
        const validation =
            QuestionsService.getSmartLauncherValidation(
                this,
                current
            );
        const goal =
            this.data.smartGoals[
                current.smartGoal
            ] ||
            this.data.smartGoals.continue;

        if (!validation.isReady) {
            return {
                isReady: false,
                reason:
                    validation.issues[0] ||
                    "Nao foi possivel montar um recorte inteligente agora.",
                issues:
                    validation.issues || [],
                goal,
                patch: null,
                topics: [],
                eligibleSeries:
                    validation.eligibleSeries ||
                    [],
                eligibleSubjects:
                    validation.eligibleSubjects ||
                    [],
                eligibleQuestionCount:
                    validation.eligibleQuestionCount ||
                    0
            };
        }
        const eligibleTopics =
            validation.eligibleTopics || [];
        const groups = new Map();

        eligibleTopics.forEach((topic) => {
            const serie =
                Number(
                    topic.primarySerie ||
                        topic.serie?.[0] ||
                        0
                ) || 0;
            const key =
                `${serie}::${topic.subjectKey}`;
            const currentGroup =
                groups.get(key) || {
                    key,
                    serie,
                    materia:
                        topic.subjectKey,
                    materiaLabel:
                        topic.subjectLabel,
                    topics: [],
                    questionCount: 0
                };

            currentGroup.topics.push(topic);
            currentGroup.questionCount +=
                topic.count || 0;
            groups.set(key, currentGroup);
        });

        const recentSessions =
            QuestionsStore.getRecentSessions();
        const weakEntries =
            QuestionsStore.getWeakTopics({
                minAttempts: 4,
                minErrors: 2
            });
        const getGroupAttempts = (
            group = null
        ) =>
            QuestionsStore.getTopicEntries({
                baseKey: "ESCOLAR",
                subjectKey:
                    group?.materia ||
                    current.materia
            }).reduce(
                (acc, entry) =>
                    acc +
                    (entry?.attempts || 0),
                0
            );
        const rankedGroups =
            [...groups.values()]
                .map((group) => {
                    const topicKeys =
                        group.topics.map(
                            (topic) =>
                                topic.key
                        );
                    const recentMatch =
                        recentSessions.find(
                            (session) =>
                                Number(
                                    session.serie
                                ) ===
                                    group.serie &&
                                session.subjectKey ===
                                    group.materia &&
                                (
                                    session.topicKeys ||
                                    []
                                ).some((key) =>
                                    topicKeys.includes(
                                        key
                                    )
                                )
                        ) || null;
                    const weakMatch =
                        weakEntries.find(
                            (entry) =>
                                entry.subjectKey ===
                                    group.materia &&
                                topicKeys.includes(
                                    entry.topicKey
                                )
                        ) || null;

                    return {
                        ...group,
                        recentMatch,
                        weakMatch
                    };
                })
                .sort((left, right) =>
                    (right.questionCount || 0) -
                        (left.questionCount || 0) ||
                    (right.topics.length || 0) -
                        (left.topics.length || 0)
                );

        const defaultGroup =
            rankedGroups[0] || null;
        let chosenGroup =
            defaultGroup;
        let topicos = [];
        let focoPrincipal = null;
        let mode = "ASSUNTO_UNICO";
        let estrategiaMistura =
            "equilibrada";
        let objectiveLabel =
            goal.label;
        let note = goal.note;

        if (current.smartGoal === "continue") {
            chosenGroup =
                rankedGroups.find(
                    (group) =>
                        Boolean(
                            group.recentMatch
                        )
                ) || defaultGroup;
            const groupAttempts =
                getGroupAttempts(
                    chosenGroup
                );
            const isWarmupStage =
                groupAttempts < 100;
            const canReuseNarrowRoute =
                groupAttempts >= 24;

            const reusedTopics =
                (chosenGroup?.recentMatch
                    ?.topicKeys || []
                ).filter((topicKey) =>
                    chosenGroup?.topics.some(
                        (topic) =>
                            topic.key ===
                            topicKey
                    )
                );

            topicos =
                reusedTopics.length &&
                reusedTopics.length > 1 &&
                canReuseNarrowRoute
                    ? reusedTopics
                    : QuestionsService.pickTopicKeys(
                        chosenGroup?.topics ||
                            [],
                        Math.min(
                            isWarmupStage
                                ? 3
                                : 2,
                            chosenGroup?.topics
                                ?.length || 0
                        ),
                        reusedTopics
                    );

            if (topicos.length > 1) {
                mode =
                    "ASSUNTOS_COMBINADOS";
                estrategiaMistura =
                    isWarmupStage
                        ? "alternada"
                        : "adaptativa";
            }

            note =
                isWarmupStage
                    ? "No comeco, a rota mistura mais assuntos para entender melhor onde esta sua dificuldade real antes de apertar o reforco."
                    : chosenGroup?.recentMatch
                    ? "A sugestao reaproveita o recorte mais recente ainda elegivel para voce continuar sem remontar tudo."
                    : "Sem historico forte no recorte atual, o sistema abre um bloco curto e seguro para continuar o ritmo.";
        } else if (
            current.smartGoal ===
            "reforcar"
        ) {
            chosenGroup =
                rankedGroups.find(
                    (group) =>
                        Boolean(
                            group.weakMatch
                        )
                ) || defaultGroup;
            const groupAttempts =
                getGroupAttempts(
                    chosenGroup
                );
            const canFocusHard =
                groupAttempts >= 24;
            const weakTopic =
                canFocusHard
                    ? chosenGroup?.weakMatch
                          ?.topicKey || ""
                    : "";
            const supportTopics =
                QuestionsService.pickTopicKeys(
                    (
                        chosenGroup?.topics ||
                        []
                    ).filter(
                        (topic) =>
                            topic.key !==
                            weakTopic
                    ),
                    Math.min(
                        2,
                        (
                            chosenGroup?.topics ||
                            []
                        ).filter(
                            (topic) =>
                                topic.key !==
                                weakTopic
                        ).length
                    )
                );

            topicos = weakTopic
                ? [
                    weakTopic,
                    ...supportTopics
                ]
                : QuestionsService.pickTopicKeys(
                    chosenGroup?.topics ||
                        [],
                    Math.min(
                        canFocusHard ? 2 : 3,
                        chosenGroup?.topics
                            ?.length || 0
                    )
                );

            focoPrincipal =
                weakTopic || null;

            if (topicos.length > 1) {
                mode =
                    "REFORCO_DIRECIONADO";
                estrategiaMistura =
                    "foco_principal";
            }

            note =
                canFocusHard &&
                chosenGroup?.weakMatch
                    ? `A rota vai puxar primeiro ${chosenGroup.weakMatch.topicLabel}, que concentra mais erro dentro do recorte liberado.`
                    : "Ainda ha pouca evidencia para travar um unico ponto fraco, entao o sistema abre um reforco leve e misturado.";
        } else {
            chosenGroup = defaultGroup;
            const groupAttempts =
                getGroupAttempts(
                    chosenGroup
                );
            topicos =
                QuestionsService.pickTopicKeys(
                    chosenGroup?.topics || [],
                    Math.min(
                        groupAttempts < 100
                            ? 3
                            : 2,
                        chosenGroup?.topics
                            ?.length || 0
                    )
                );

            if (topicos.length > 1) {
                mode =
                    "ASSUNTOS_COMBINADOS";
                estrategiaMistura =
                    "adaptativa";
            }

            note =
                "A rota vai misturar assuntos prontos dentro do recorte elegivel para revisar sem abrir todos os filtros.";
        }

        if (!chosenGroup || !topicos.length) {
            return {
                isReady: false,
                reason:
                    "Nao foi possivel formar um bloco inteligente com o recorte atual.",
                issues: [
                    "Nao foi possivel formar um bloco inteligente com o recorte atual."
                ],
                goal,
                patch: null,
                topics: [],
                eligibleSeries:
                    validation.eligibleSeries,
                eligibleSubjects:
                    validation.eligibleSubjects,
                eligibleQuestionCount:
                    validation.eligibleQuestionCount
            };
        }

        const pesos =
            topicos.reduce(
                (acc, topicKey) => {
                    acc[topicKey] =
                        focoPrincipal ===
                        topicKey
                            ? 2
                            : 1;
                    return acc;
                },
                {}
            );
        const selectedTopics =
            chosenGroup.topics.filter(
                (topic) =>
                    topicos.includes(topic.key)
            );
        const amount =
            QuestionsService.getResolvedSessionAmount(
                this,
                current,
                validation.eligibleQuestionCount
            );
        const smartTimeLimitMinutes =
            QuestionsService.getSmartTimeLimitMinutes(
                current
            );
        const estimatedDuration =
            smartTimeLimitMinutes !== null
                ? `ate ${smartTimeLimitMinutes} min`
                : current.smartQuestionCount ===
                      null
                    ? "Livre"
                    : QuestionsService.getEstimatedDurationFromCount(
                        amount
                    );

        return {
            isReady: true,
            goal,
            validation,
            patch: {
                ...current,
                base: "ESCOLAR",
                serie:
                    chosenGroup.serie ||
                    current.serie,
                materia:
                    chosenGroup.materia ||
                    current.materia,
                topicos,
                focoPrincipal,
                mode,
                estrategiaMistura,
                pesos,
                topicSearch: "",
                onlyReadyTopics: true,
                quantidadeQuestoes:
                    amount
            },
            mode,
            objectiveLabel,
            note,
            amount,
            trainingModeLabel:
                QuestionsService.getTrainingModeLabel(
                    current
                ),
            trainingValueLabel:
                QuestionsService.getTrainingValueLabel(
                    current
                ),
            serieLabel: `${chosenGroup.serie}\u00aa S\u00e9rie`,
            materiaLabel:
                chosenGroup.materiaLabel ||
                "Mat\u00e9ria",
            focusLabel:
                selectedTopics.find(
                    (topic) =>
                        topic.key ===
                        focoPrincipal
                )?.label || "",
            topics: selectedTopics,
            availableCount:
                validation.eligibleQuestionCount,
            estimatedDuration,
            eligibleSeries:
                validation.eligibleSeries,
            eligibleSubjects:
                validation.eligibleSubjects,
            eligibleQuestionCount:
                validation.eligibleQuestionCount
        };
    },

    startSmartSession(options = {}) {
        if (
            this.sessionUseCases
                ?.startSmartSession
        ) {
            return this.sessionUseCases.startSmartSession(
                options
            );
        }

        if (
            this.legacySessionFallback
                ?.startSmartSession
        ) {
            return this.legacySessionFallback.startSmartSession(
                options
            );
        }

        const preview =
            this.buildSmartRoutePreview();

        if (
            !preview.isReady ||
            !preview.patch
        ) {
            this.runtimeNotice =
                preview.reason ||
                "Nao foi possivel montar uma sugestao automatica agora.";
            this.openLauncher(
                "specific"
            );
            return;
        }

        QuestionsContext.replace(
            preview.patch,
            false
        );
        QuestionsState.setLauncherView(
            "smart"
        );
        this.clearRuntimeNotice();
        this.syncContext();
        this.startSession(options);
    },

    reuseSessionRoute(sessionId = "") {
        const session =
            QuestionsStore.getRecentSessions().find(
                (entry) =>
                    String(entry.id) ===
                    String(sessionId)
            );

        if (!session) {
            this.runtimeNotice =
                "Nao foi possivel reencontrar essa rota recente.";
            this.openLauncher("resume");
            return;
        }

        const current =
            QuestionsContext.get();
        const topicKeys =
            Array.isArray(
                session.topicKeys
            )
                ? session.topicKeys.filter(
                    Boolean
                )
                : [];
        const mode =
            this.data.modes[
                session.modeKey
            ]
                ? session.modeKey
                : (
                    topicKeys.length > 1
                        ? "ASSUNTOS_COMBINADOS"
                        : "ASSUNTO_UNICO"
                );
        const focoPrincipal =
            topicKeys.includes(
                session.focusTopicKey
            )
                ? session.focusTopicKey
                : null;
        const estrategiaMistura =
            mode ===
            "REFORCO_DIRECIONADO"
                ? "foco_principal"
                : "equilibrada";
        const pesos =
            topicKeys.reduce(
                (acc, topicKey) => {
                    acc[topicKey] =
                        focoPrincipal ===
                        topicKey
                            ? 2
                            : 1;
                    return acc;
                },
                {}
            );

        QuestionsContext.replace(
            {
                ...current,
                base:
                    session.baseKey ||
                    current.base,
                serie:
                    Number(
                        session.serie
                    ) || current.serie,
                materia:
                    session.subjectKey ||
                    current.materia,
                topicos: topicKeys,
                focoPrincipal,
                mode,
                quantidadeQuestoes:
                    Number(
                        session.amount
                    ) ||
                    current.quantidadeQuestoes,
                estrategiaMistura,
                pesos
            },
            false
        );

        this.clearRuntimeNotice();
        this.syncContext();
        this.openLauncher(
            "specific"
        );
    },

    submitAnswer(payload = {}) {
        const question =
            QuestionsState.getCurrentQuestion();

        if (!question) {
            return;
        }

        if (QuestionsState.getLastAnswer()) {
            return;
        }

        const result =
            QuestionsService.answer(
                payload.index,
                payload.value
            );

        QuestionsState.setAnswer(result);
        this.render();
    },

    retryCurrentQuestion() {
        const answer =
            QuestionsState.getLastAnswer();

        if (!answer) {
            return;
        }

        QuestionsState.retryCurrentQuestion();
        this.clearRuntimeNotice();
        this.render();
    },

    submitQuestionContest(
        rawMessage = ""
    ) {
        const question =
            QuestionsState.getCurrentQuestion();

        if (!question) {
            return;
        }

        const message =
            String(rawMessage || "").trim() ||
            this.getQuestionContestDefaultText();
        const meta =
            QuestionsState.getMeta();
        const report =
            QuestionsStore.saveQuestionReport({
                questionId:
                    question.id || "",
                prompt:
                    question.prompt || "",
                explanation:
                    question.explanation ||
                    "",
                message,
                meta: {
                    runId:
                        QuestionsState.getActiveRunId(),
                    sourceMode:
                        meta.sourceMode ||
                        "",
                    subjectKey:
                        question.subjectKey ||
                        "",
                    subjectLabel:
                        question.subjectLabel ||
                        "",
                    topicKey:
                        question.topicKey || "",
                    topicLabel:
                        question.topicLabel ||
                        ""
                }
            });

        if (!report) {
            this.runtimeNotice =
                "Nao foi possivel registrar a contestacao agora.";
            this.render();
            return;
        }

        this.runtimeNotice =
            "Contestacao registrada para revisao.";
        this.activeContestQuestionId =
            "";
        this.render();
    },

    continueSession() {
        if (
            this.sessionUseCases
                ?.continueSession
        ) {
            return this.sessionUseCases.continueSession();
        }

        if (
            this.legacySessionFallback
                ?.continueSession
        ) {
            return this.legacySessionFallback.continueSession();
        }

        if (
            !QuestionsState.getLastAnswer() &&
            !QuestionsState.isComplete()
        ) {
            return;
        }

        this.commitLastAnswer();
        QuestionsState.next();

        if (
            QuestionsState.isComplete() &&
            !QuestionsState.isSessionRecorded()
        ) {
            this.pauseSimuladoTimer();
            const summary =
                QuestionsService.summarizeSessionResults(
                    QuestionsState.getResults(),
                    QuestionsState.getMeta()
                );

            QuestionsStore.registerSession({
                sourceMode:
                    QuestionsState.getMeta()
                        .sourceMode || "",
                baseKey:
                    QuestionsContext.get()
                        .base,
                baseLabel:
                    QuestionsContext.get()
                        .base === "ENEM"
                            ? "ENEM"
                            : "Escolar",
                mode:
                    QuestionsState.getMeta()
                        .modeLabel || "",
                modeKey:
                    QuestionsContext.get()
                        .mode,
                subjectKey:
                    QuestionsContext.get()
                        .materia,
                subjectLabel:
                    QuestionsState.getMeta()
                        .materiaLabel || "",
                serie:
                    QuestionsContext.get()
                        .serie,
                amount:
                    summary.total,
                accuracy:
                    summary.accuracy,
                hits: summary.hits,
                errors: summary.errors,
                avgTimeMs:
                    summary.avgTimeMs,
                elapsedAnsweredMs:
                    summary.elapsedAnsweredMs,
                topicCount:
                    summary.topicCount,
                topicKeys: [
                    ...(
                        QuestionsContext.get()
                            .topicos || []
                    )
                ],
                topicLabels: [
                    ...(
                        QuestionsState.getMeta()
                            .topicsLabel || []
                    )
                ],
                focusTopicKey:
                    QuestionsContext.get()
                        .focoPrincipal || "",
                focusTopicLabel:
                    summary.weakTopic
                        ?.topicLabel || "",
                weakTopicLabel:
                    summary.weakTopic
                        ?.topicLabel || "",
                strongTopicLabel:
                    summary.strongTopic
                        ?.topicLabel || "",
                directSearchTerms: Array.isArray(
                    QuestionsState.getMeta()
                        .directSearchTerms
                )
                    ? [
                        ...QuestionsState.getMeta()
                            .directSearchTerms
                    ]
                    : [],
                directSearchStrategy:
                    String(
                        QuestionsState.getMeta()
                            .directSearchStrategy ||
                            ""
                    ).trim()
            });
            QuestionsStore.flushProfileState(
                true
            );

            this.persistActiveRun(
                "completed",
                {
                    currentIndex:
                        QuestionsState.getCurrent(),
                    summary
                }
            );

            QuestionsState.markSessionRecorded();
            this.dispatchSyncEvent(
                "questions:session-completed",
                {
                    summary
                }
            );
        }

        this.render();
    },

    restartSession() {
        const activeRunId =
            QuestionsState.getActiveRunId();

        if (activeRunId) {
            this.restartRun(activeRunId);
            return;
        }

        this.startSession();
    },

    startFollowUp(intent) {
        if (
            this.sessionUseCases
                ?.startFollowUp
        ) {
            return this.sessionUseCases.startFollowUp(
                intent
            );
        }

        if (
            this.legacySessionFallback
                ?.startFollowUp
        ) {
            return this.legacySessionFallback.startFollowUp(
                intent
            );
        }

        const summary =
            QuestionsService.summarizeSessionResults(
                QuestionsState.getResults(),
                QuestionsState.getMeta()
            );
        const patch =
            QuestionsService.buildFollowUpContext(
                this,
                intent,
                summary
            );

        this.updateContext(patch);
        this.startSession();
    },

    startSession(options = {}) {
        if (
            this.sessionUseCases?.startSession
        ) {
            return this.sessionUseCases.startSession(
                options
            );
        }

        if (
            this.legacySessionFallback
                ?.startSession
        ) {
            return this.legacySessionFallback.startSession(
                options
            );
        }

        const hasSnapshotList =
            Array.isArray(
                options.sessionList
            ) &&
            options.sessionList.length;

        if (
            options.routeContext &&
            typeof options.routeContext ===
                "object"
        ) {
            QuestionsContext.replace(
                {
                    ...QuestionsContext.get(),
                    ...options.routeContext
                },
                false
            );
        }

        this.syncContext();

        let list = hasSnapshotList
            ? [...options.sessionList]
            : [];
        let meta = {};

        if (!hasSnapshotList) {
            const validation =
                QuestionsService.getLauncherValidation(
                    this
                );

            if (!validation.isReady) {
                this.runtimeNotice =
                    validation.issues[0] ||
                    "Complete a rota antes de iniciar o treino.";
                this.openLauncher();
                return;
            }

            list =
                QuestionsService.buildSession(
                    this
                );

            if (!list.length) {
                this.runtimeNotice =
                    "Ainda n\u00e3o h\u00e1 quest\u00f5es preenchidas nesse recorte. Continue alimentando o banco e tente de novo.";
                this.openLauncher();
                return;
            }
        }

        const sourceMode =
            options.sourceMode ||
            (
                QuestionsState.getLauncherView() ===
                    "smart" ||
                QuestionsState.getLauncherView() ===
                    "smart_profiles"
                    ? "smart"
                    : "specific"
            );

        meta = {
            ...QuestionsService.getRouteSummary(
                this
            ),
            ...(options.meta || {}),
            sourceMode
        };

        this.clearRuntimeNotice();

        let activeRunId =
            String(
                options.activeRunId || ""
            ).trim();

        if (
            options.createRun !== false &&
            !activeRunId
        ) {
            const run =
                this.createRunFromSession(
                    list,
                    meta,
                    {
                        sourceMode,
                        profileId:
                            String(
                                options.profileId ||
                                    ""
                            ).trim(),
                        savedBlockId:
                            String(
                                options.savedBlockId ||
                                    ""
                            ).trim()
                    }
                );
            activeRunId = run?.id || "";
        }

        this.sessionReturnView =
            QuestionsState.isValidLauncherView(
                QuestionsState.getLauncherView()
            )
                ? QuestionsState.getLauncherView()
                : this.getSessionReturnView(
                    "home"
                );

        QuestionsState.startSession(
            list,
            meta,
            {
                activeRunId,
                currentIndex:
                    options.currentIndex,
                results: options.results,
                lastAnswer:
                    options.lastAnswer,
                startTime:
                    Date.now()
            }
        );

        this.suppressAmbientForQuestionsSession();
        this.activateSimuladoTimer(
            meta,
            {
                ...options,
                sourceMode,
                activeRunId
            }
        );

        this.dispatchSyncEvent(
            "questions:session-started",
            {
                route:
                    QuestionsState.getMeta()
            }
        );
        this.render({
            sync: false,
            immediate: true
        });
    },

    buildSmartBlockSnapshotFromProfile(
        profile = {}
    ) {
        const previousContext =
            QuestionsContext.get();
        const profileContext = {
            ...previousContext,
            smartGoal:
                profile.smartGoal ||
                    "continue",
            smartSessionMetric:
                profile.sessionMetric ||
                "quantidade",
            smartSelectedSeries: [
                ...(profile.selectedSeries ||
                    [])
            ],
            smartSelectedSubjects: [
                ...(profile.selectedSubjects ||
                    [])
            ],
            smartExcludedSeries: [
                ...(profile.excludedSeries ||
                    [])
            ],
            smartExcludedBases: [
                ...(profile.excludedBases ||
                    [])
            ],
            smartExcludedSubjects: [
                ...(profile.excludedSubjects ||
                    [])
            ],
            smartExcludedTopicsBySubject:
                {
                    ...(
                        profile.excludedTopicsBySubject ||
                        {}
                    )
                },
            smartQuestionCount:
                profile.questionCount ===
                null
                    ? null
                    : Number(
                        profile.questionCount
                    ) || 5,
            smartTimeMinutes:
                profile.timeMinutes === null
                    ? null
                    : Number(
                        profile.timeMinutes
                    ) || 15,
            quantidadeQuestoes:
                Number(
                    profile.preferredAmount
                ) ||
                previousContext.quantidadeQuestoes
        };

        QuestionsContext.replace(
            profileContext,
            false
        );

        try {
            const preview =
                this.buildSmartRoutePreview();

            if (
                !preview.isReady ||
                !preview.patch
            ) {
                return null;
            }

            return {
                preview,
                snapshot:
                    this.buildSessionSnapshotForBlock(
                        preview.patch,
                        {
                            sourceMode:
                                "smart",
                            launcherContext:
                                profileContext,
                            meta: {
                                customTitle:
                                    profile.name ||
                                    ""
                            }
                        }
                    )
            };
        } finally {
            QuestionsContext.replace(
                previousContext,
                false
            );
        }
    },

    syncSavedBlocksFromSmartProfiles() {
        const profiles =
            QuestionsStore.getSmartProfiles();

        if (!profiles.length) {
            return 0;
        }

        const existingProfileIds =
            new Set(
                QuestionsStore.getSavedBlocks()
                    .map((block) =>
                        String(
                            block.profileId || ""
                        ).trim()
                    )
                    .filter(Boolean)
            );
        let createdCount = 0;

        profiles.forEach((profile) => {
            if (
                existingProfileIds.has(
                    String(profile.id)
                )
            ) {
                return;
            }

            const bundle =
                this.buildSmartBlockSnapshotFromProfile(
                    profile
                );

            if (!bundle?.snapshot) {
                return;
            }

            const block =
                this.saveBlockSnapshot(
                    bundle.snapshot,
                    {
                        sourceMode:
                            "smart",
                        defaultName:
                            profile.name ||
                            "",
                        note:
                            bundle.preview
                                ?.note || "",
                        profileId:
                            profile.id || "",
                        skipPrompt:
                            true,
                        silent: true
                    }
                );

            if (block?.id) {
                existingProfileIds.add(
                    String(profile.id)
                );
                createdCount += 1;
            }
        });

        return createdCount;
    },

    openLauncher(
        view = null,
        options = {}
    ) {
        const currentView =
            QuestionsState.getLauncherView();
        const targetView =
            QuestionsState.isValidLauncherView(
                view
            )
                ? view
                : currentView;

        if (
            options.fromBack !== true &&
            options.trackHistory !==
                false &&
            QuestionsState.getPhase() ===
                "launcher" &&
            targetView !== currentView
        ) {
            this.launcherHistory = [
                ...(
                    Array.isArray(
                        this.launcherHistory
                    )
                        ? this.launcherHistory
                        : []
                ),
                currentView
            ].slice(-24);
        }

        if (
            targetView === "smart_start" &&
            options.preserveSmartState !==
                true
        ) {
            QuestionsContext.replace(
                {
                    ...QuestionsContext.get(),
                    smartSelectedSeries: [],
                    smartSelectedSubjects: [],
                    smartExcludedSubjects: [],
                    smartExcludedBases: [],
                    smartExcludedTopicsBySubject:
                        {}
                },
                false
            );
            this.syncContext();
        }

        if (
            targetView !==
            "smart_subjects"
        ) {
            this.smartSubjectEditorKey =
                "";
            this.smartSubjectFocusKey =
                "";
            this.smartTopicReviewOpen =
                false;
        }

        if (
            targetView === "smart" &&
            this.data.bankStatus === "ready"
        ) {
            const recovery =
                QuestionsService.getSmartLauncherRecovery(
                    this
                );

            if (
                recovery?.isRecoverable &&
                recovery.recoveryPatch
            ) {
                QuestionsContext.replace(
                    {
                        ...QuestionsContext.get(),
                        ...recovery.recoveryPatch
                    },
                    true
                );
                this.runtimeNotice =
                    recovery.reason ||
                    "As exclusoes salvas foram limpas para liberar o treino.";
                this.syncContext();
            }
        }

        if (
            targetView === "saved" &&
            this.data.bankStatus ===
                "ready"
        ) {
            this.syncSavedBlocksFromSmartProfiles();
        }

        if (
            targetView ===
            "simulado_build"
        ) {
            this.ensureSimuladoBuilder();
        }

        QuestionsState.openLauncher(
            targetView
        );
        this.registerCoachView(
            QuestionsState.getLauncherView()
        );
        this.render();
        this.dispatchSyncEvent(
            "questions:launcher-opened",
            {
                view:
                    QuestionsState.getLauncherView()
            }
        );
    },

    render(options = {}) {
        const shouldSync =
            Object.prototype.hasOwnProperty.call(
                options,
                "sync"
            )
                ? options.sync === true
                : QuestionsState.getPhase() !==
                  "session";
        const immediate =
            options.immediate === true;

        if (shouldSync) {
            this.renderQueuedSync = true;
        }

        const flushRender = () => {
            const queuedSync =
                this.renderQueuedSync;

            this.renderQueuedSync = false;

            if (queuedSync) {
                this.syncContext();
            }

            QuestionsUI.render();
        };

        if (immediate) {
            if (this.renderFrameId) {
                cancelAnimationFrame(
                    this.renderFrameId
                );
                this.renderFrameId = 0;
            }

            flushRender();
            return;
        }

        if (this.renderFrameId) {
            return;
        }

        this.renderFrameId =
            requestAnimationFrame(() => {
                this.renderFrameId = 0;
                flushRender();
            });
    }
};

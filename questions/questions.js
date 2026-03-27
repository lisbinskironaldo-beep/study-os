window.QuestionsPage = {
    runtimeNotice: "",
    syncBridgeBound: false,
    coachStorageKey:
        "questions_ui_coach_v1",
    coachState: {},
    coachDismissedViews: {},
    scriptUrl:
        document.currentScript?.src || "",

    data: {
        bases: {
            ESCOLAR: {
                key: "ESCOLAR",
                label: "Escolar",
                note: "Treino curricular por serie, materia e assunto.",
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
        schoolCatalog: [],
        bankStatus: "idle"
    },

    async init() {
        QuestionsStore.load();
        QuestionsContext.load();
        QuestionsState.init();
        this.loadCoachState();
        QuestionsUI.init(this);
        this.bindSyncBridge();
        this.clearRuntimeNotice();

        if (
            this.data.bankStatus ===
                "ready" &&
            this.data.schoolCatalog.length
        ) {
            this.syncContext();
            if (this.consumePendingSync()) {
                return;
            }
            this.openLauncher("home");
            return;
        }

        this.data.bankStatus = "loading";
        QuestionsState.openLauncher("home");
        this.registerCoachView("home");
        this.render();

        await this.loadSchoolCatalog();
        this.syncContext();
        if (this.consumePendingSync()) {
            return;
        }
        this.openLauncher("home");
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
            const bankUrl =
                new URL(
                    "./banks/index.js",
                    baseUrl
                ).href;
            const module = await import(
                bankUrl
            );

            this.data.schoolCatalog =
                Array.isArray(
                    module.questionsDB
                )
                    ? [...module.questionsDB]
                    : [];
            this.data.bankStatus = "ready";
        } catch (error) {
            this.data.schoolCatalog = [];
            this.data.bankStatus = "error";
            this.runtimeNotice =
                `Nao foi possivel carregar o banco escolar do modulo de questoes. ${error?.message || ""}`.trim();
            console.error(
                "[Questions] Falha ao carregar banco escolar:",
                error
            );
        }
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
        const materia =
            validSubjects.includes(
                snapshot.materia
            )
                ? snapshot.materia
                : (validSubjects[0] || "");

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
        let selectedTopics =
            Array.isArray(snapshot.topicos)
                ? snapshot.topicos.filter(
                    (topicKey) =>
                        validTopics.includes(
                            topicKey
                        )
                )
                : [];

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
            this.data.amountOptions.includes(
                Number(
                    snapshot.quantidadeQuestoes
                )
            )
                ? Number(
                    snapshot.quantidadeQuestoes
                )
                : 5;

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

    setBase(baseKey) {
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
        this.updateContext({
            focoPrincipal: topicKey
        });
    },

    selectAllTopics() {
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
            return "Selecione as series para filtrar as questoes e depois toque em Ir.";
        }

        if (key === "smart_subjects") {
            return "Toque nas materias que quer manter no treino e depois toque em Ir.";
        }

        return "";
    },

    setSmartConfig(patch = {}) {
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
        if (!this.data.smartGoals?.[goalKey]) {
            return;
        }

        this.setSmartConfig({
            smartGoal: goalKey
        });
    },

    getSmartStartOptions() {
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
                        topicCount: 0
                    };

                current.count +=
                    Number(
                        subject.count
                    ) || 0;
                current.topicCount +=
                    Number(
                        subject.topicCount
                    ) || 0;

                grouped.set(
                    subject.key,
                    current
                );
            });
        });

        return [...grouped.values()].map(
            (subject) => ({
                ...subject,
                active:
                    (
                        ctx.smartSelectedSubjects ||
                        []
                    ).includes(subject.key),
                disabled: false
            })
        );
    },

    toggleSmartStartOption(optionKey) {
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
                    ? "A base ENEM entra na proxima etapa do treino inteligente."
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
        const activeOptions =
            this.getSmartStartOptions().filter(
                (item) =>
                    item.active &&
                    !item.disabled
            );

        if (!activeOptions.length) {
            this.runtimeNotice =
                "Selecione pelo menos uma serie para continuar.";
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
        this.dismissCoachHint(
            "smart_subjects"
        );
        this.toggleSmartSubjectExclusion(
            subjectKey
        );
    },

    selectAllSmartSubjectOptions() {
        this.dismissCoachHint(
            "smart_subjects"
        );
        const availableSubjects =
            this.getSmartSubjectOptions().map(
                (item) => item.key
            );
        const selectedSubjects =
            QuestionsContext.get()
                .smartSelectedSubjects || [];

        this.setSmartConfig({
            smartSelectedSubjects:
                selectedSubjects.length ===
                availableSubjects.length
                    ? []
                    : [...availableSubjects]
        });
    },

    continueSmartSubjects() {
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

        const activeSubjects =
            this.getSmartSubjectOptions().filter(
                (item) => item.active
            );

        if (!activeSubjects.length) {
            this.runtimeNotice =
                "Selecione pelo menos uma materia para continuar.";
            this.render();
            return;
        }

        this.dismissCoachHint(
            "smart_subjects"
        );
        this.clearRuntimeNotice();
        this.openLauncher("smart");
    },

    toggleSmartSeriesExclusion(
        serieKey
    ) {
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

        this.setSmartConfig({
            smartSelectedSubjects: next
        });
    },

    clearSmartExclusions() {
        this.setSmartConfig({
            smartSelectedSeries: [],
            smartSelectedSubjects: [],
            smartExcludedSeries: [],
            smartExcludedBases: [],
            smartExcludedSubjects: []
        });
    },

    buildSmartProfilePayload(
        overrides = {}
    ) {
        const ctx =
            QuestionsContext.get();

        return {
            smartGoal:
                ctx.smartGoal ||
                "continue",
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
            preferredAmount:
                Number(
                    ctx.quantidadeQuestoes
                ) || 5,
            ...overrides
        };
    },

    getSuggestedSmartProfileName() {
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
                (serie) => `${serie}a serie`
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

    renameSmartProfile(profileId) {
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

    deleteSmartProfile(profileId) {
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

        const confirmed =
            window.confirm(
                `Apagar o perfil "${profile.name}"?`
            );

        if (!confirmed) {
            return;
        }

        QuestionsStore.deleteSmartProfile(
            profileId
        );
        this.runtimeNotice =
            `Perfil apagado: ${profile.name}.`;
        this.openLauncher(
            "smart_profiles"
        );
    },

    buildSavedBlockName(
        meta = {},
        context = {},
        sourceMode = ""
    ) {
        const modeLabel =
            sourceMode === "smart"
                ? "Bloco inteligente"
                : "Bloco especifico";
        const materia =
            meta.materiaLabel ||
            context.materia ||
            "Materia";
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
        const name = window.prompt(
            "Nome do bloco salvo:",
            options.defaultName ||
                suggestedName
        );

        if (name === null) {
            return null;
        }

        const cleanName =
            String(name || "").trim() ||
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
                sessionSnapshot: list
            });

        this.runtimeNotice =
            `Bloco salvo: ${cleanName}.`;
        this.render();

        return block;
    },

    saveCurrentSpecificBlock() {
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

        QuestionsStore.markSavedBlockUsed(
            block.id
        );
        QuestionsContext.replace(
            {
                ...QuestionsContext.get(),
                ...(
                    block.launcherContext ||
                    block.routeSnapshot
                        ?.context ||
                    {}
                )
            },
            false
        );

        this.runtimeNotice =
            `Bloco aplicado: ${block.name}.`;
        this.syncContext();
        this.openLauncher(
            block.mode === "smart"
                ? "smart"
                : "specific"
        );
    },

    startSavedBlock(blockId) {
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
            !Array.isArray(
                block.sessionSnapshot
            ) ||
            !block.sessionSnapshot.length
        ) {
            this.runtimeNotice =
                "Esse bloco nao tem questoes suficientes para ser refeito.";
            this.openLauncher("saved");
            return;
        }

        QuestionsStore.markSavedBlockUsed(
            block.id
        );
        this.clearRuntimeNotice();
        this.startSession({
            sessionList: [
                ...block.sessionSnapshot
            ],
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

    deleteSavedBlock(blockId) {
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

        const confirmed =
            window.confirm(
                `Apagar o bloco "${block.name}"?`
            );

        if (!confirmed) {
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
        const modeLabel =
            sourceMode === "smart"
                ? "Treino inteligente"
                : "Treino especifico";
        const materia =
            meta.materiaLabel ||
            context.materia ||
            "Materia";
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
            QuestionsState.getPhase() !==
            "session"
        ) {
            this.openLauncher("resume");
            return;
        }

        this.persistActiveRun(
            "in_progress"
        );
        this.runtimeNotice =
            "Treino pausado. Voce pode retomar depois.";
        this.openLauncher("resume");
    },

    resumeRun(runId) {
        const run =
            QuestionsStore.getRunById(runId);

        if (!run) {
            this.runtimeNotice =
                "Nao foi possivel reencontrar essa sessao.";
            this.openLauncher("resume");
            return;
        }

        const list =
            Array.isArray(
                run.sessionSnapshot
            ) &&
            run.sessionSnapshot.length
                ? [...run.sessionSnapshot]
                : [];

        if (!list.length) {
            this.runtimeNotice =
                "Essa sessao nao tem mais um snapshot valido para retomada.";
            this.openLauncher("resume");
            return;
        }

        this.clearRuntimeNotice();
        this.startSession({
            sessionList: list,
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

    restartRun(runId) {
        const run =
            QuestionsStore.getRunById(runId);

        if (!run) {
            this.runtimeNotice =
                "Nao foi possivel reencontrar essa sessao.";
            this.openLauncher("resume");
            return;
        }

        const list =
            Array.isArray(
                run.sessionSnapshot
            ) &&
            run.sessionSnapshot.length
                ? [...run.sessionSnapshot]
                : [];

        if (!list.length) {
            this.runtimeNotice =
                "Essa sessao nao pode ser reiniciada porque o snapshot esta vazio.";
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

    deleteRun(runId) {
        const run =
            QuestionsStore.getRunById(runId);

        if (!run) {
            this.runtimeNotice =
                "Nao foi possivel encontrar essa sessao.";
            this.openLauncher("resume");
            return;
        }

        const confirmed =
            window.confirm(
                `Apagar a sessao "${run.title}"?`
            );

        if (!confirmed) {
            return;
        }

        QuestionsStore.deleteRun(runId);
        this.runtimeNotice =
            `Sessao apagada: ${run.title}.`;
        this.openLauncher("resume");
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
    },

    buildSmartRoutePreview() {
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
            QuestionsStore.getWeakTopics();
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
                reusedTopics.length
                    ? reusedTopics
                    : (
                        chosenGroup?.topics || []
                    )
                        .slice(
                            0,
                            Math.min(
                                2,
                                chosenGroup?.topics
                                    ?.length || 0
                            )
                        )
                        .map((topic) =>
                            topic.key
                        );

            if (topicos.length > 1) {
                mode =
                    "ASSUNTOS_COMBINADOS";
                estrategiaMistura =
                    "adaptativa";
            }

            note =
                chosenGroup?.recentMatch
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
            const weakTopic =
                chosenGroup?.weakMatch
                    ?.topicKey || "";
            const supportTopics =
                (chosenGroup?.topics || [])
                    .filter(
                        (topic) =>
                            topic.key !==
                            weakTopic
                    )
                    .slice(0, 2)
                    .map((topic) =>
                        topic.key
                    );

            topicos = weakTopic
                ? [
                    weakTopic,
                    ...supportTopics
                ]
                : (
                    chosenGroup?.topics || []
                )
                    .slice(
                        0,
                        Math.min(
                            2,
                            chosenGroup?.topics
                                ?.length || 0
                        )
                    )
                    .map((topic) =>
                        topic.key
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
                chosenGroup?.weakMatch
                    ? `A rota vai puxar primeiro ${chosenGroup.weakMatch.topicLabel}, que concentra mais erro dentro do recorte liberado.`
                    : "Como ainda nao ha um ponto fraco dominante, o sistema vai abrir um reforco curto com os primeiros assuntos prontos.";
        } else {
            chosenGroup = defaultGroup;
            topicos =
                (chosenGroup?.topics || [])
                    .slice(
                        0,
                        Math.min(
                            3,
                            chosenGroup?.topics
                                ?.length || 0
                        )
                    )
                    .map((topic) =>
                        topic.key
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
            Number(
                current.quantidadeQuestoes
            ) || 5;
        const estimatedDuration =
            QuestionsService.formatTime(
                amount * 25000
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
                onlyReadyTopics: true
            },
            mode,
            objectiveLabel,
            note,
            serieLabel: `${chosenGroup.serie}a serie`,
            materiaLabel:
                chosenGroup.materiaLabel ||
                "Materia",
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

    startSmartSession() {
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
        this.startSession();
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

        const result =
            QuestionsService.answer(
                payload.index,
                payload.value
            );

        QuestionsState.setAnswer(result);
        this.persistActiveRun(
            "in_progress"
        );
        this.render();
    },

    continueSession() {
        QuestionsState.next();

        if (
            QuestionsState.isComplete() &&
            !QuestionsState.isSessionRecorded()
        ) {
            const summary =
                QuestionsService.summarizeSessionResults(
                    QuestionsState.getResults(),
                    QuestionsState.getMeta()
                );

            QuestionsStore.registerSession({
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
                        ?.topicLabel || ""
            });

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

        if (!QuestionsState.isComplete()) {
            this.persistActiveRun(
                "in_progress"
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
                    "Ainda nao ha questoes preenchidas nesse recorte. Continue alimentando o banco e tente de novo.";
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
                        savedBlockId:
                            String(
                                options.savedBlockId ||
                                    ""
                            ).trim()
                    }
                );
            activeRunId = run?.id || "";
        }

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

        if (activeRunId) {
            this.persistActiveRun(
                "in_progress"
            );
        }

        this.dispatchSyncEvent(
            "questions:session-started",
            {
                route:
                    QuestionsState.getMeta()
            }
        );
        QuestionsUI.render();
    },

    openLauncher(view = null) {
        if (view === "smart_start") {
            QuestionsContext.replace(
                {
                    ...QuestionsContext.get(),
                    smartSelectedSeries: [],
                    smartSelectedSubjects: [],
                    smartExcludedSubjects: [],
                    smartExcludedBases: []
                },
                false
            );
            this.syncContext();
        }

        QuestionsState.openLauncher(view);
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

    render() {
        this.syncContext();
        QuestionsUI.render();
    }
};

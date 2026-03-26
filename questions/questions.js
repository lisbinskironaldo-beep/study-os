window.QuestionsPage = {
    runtimeNotice: "",
    syncBridgeBound: false,
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
        QuestionsUI.init(this);
        this.bindSyncBridge();

        this.data.bankStatus = "loading";
        QuestionsUI.render();

        await this.loadSchoolCatalog();
        this.syncContext();
        if (this.consumePendingSync()) {
            return;
        }
        this.openLauncher();
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

        this.openLauncher();
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

        QuestionsContext.replace({
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
        });

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

    startSession() {
        this.syncContext();
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

        const list =
            QuestionsService.buildSession(
                this
            );

        if (!list.length) {
            this.runtimeNotice =
                "Ainda nao ha questoes preenchidas nesse recorte. Continue alimentando o banco e tente de novo.";
            this.openLauncher();
            return;
        }

        this.clearRuntimeNotice();

        QuestionsState.startSession(
            list,
            QuestionsService.getRouteSummary(
                this
            )
        );

        this.dispatchSyncEvent(
            "questions:session-started",
            {
                route:
                    QuestionsState.getMeta()
            }
        );
        QuestionsUI.render();
    },

    openLauncher() {
        QuestionsState.openLauncher();
        this.render();
        this.dispatchSyncEvent(
            "questions:launcher-opened"
        );
    },

    render() {
        this.syncContext();
        QuestionsUI.render();
    }
};

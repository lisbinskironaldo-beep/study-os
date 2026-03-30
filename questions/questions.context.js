window.QuestionsContext = {
    key: "questions_context_v4",
    saveTimer: null,

    defaults: {
        mode: "ASSUNTO_UNICO",
        base: "ESCOLAR",
        serie: 1,
        materia: "matematica",
        topicos: [],
        focoPrincipal: null,
        pesos: {},
        topicSearch: "",
        onlyReadyTopics: true,
        quantidadeQuestoes: 5,
        smartSessionMetric: "quantidade",
        smartQuestionCount: 5,
        smartTimeMinutes: 15,
        estrategiaMistura: "equilibrada",
        smartGoal: "continue",
        smartSelectedSeries: [],
        smartSelectedSubjects: [],
        smartExcludedSeries: [],
        smartExcludedBases: [],
        smartExcludedSubjects: [],
        statsSection: "resumo",
        statsBase: "ESCOLAR",
        statsScope: "geral",
        statsSerie: 1,
        statsMateria: "matematica",
        statsTopicKey: "",
        syncSource: "",
        syncIntent: "",
        pendingSync: null
    },

    data: {},

    load() {
        const saved =
            localStorage.getItem(this.key);

        if (!saved) {
            this.data = this.buildState(
                this.defaults
            );
            return;
        }

        try {
            const parsed =
                JSON.parse(saved);
            this.data = this.buildState(
                parsed
            );
        } catch (_error) {
            this.data = this.buildState(
                this.defaults
            );
        }
    },

    buildState(source = {}) {
        const next = {
            ...this.defaults,
            ...(source || {})
        };

        next.topicos =
            Array.isArray(next.topicos)
                ? [...next.topicos]
                : [];
        next.smartGoal =
            String(
                next.smartGoal ||
                    "continue"
            ).trim() || "continue";
        next.smartSelectedSeries =
            Array.isArray(
                next.smartSelectedSeries
            )
                ? [
                    ...new Set(
                        next.smartSelectedSeries
                            .map((item) =>
                                Number(item)
                            )
                            .filter((item) =>
                                Number.isFinite(item)
                            )
                    )
                ]
                : [];
        next.smartSelectedSubjects =
            Array.isArray(
                next.smartSelectedSubjects
            )
                ? [
                    ...new Set(
                        next.smartSelectedSubjects
                            .map((item) =>
                                String(
                                    item || ""
                                )
                                    .trim()
                                    .toLowerCase()
                            )
                            .filter(Boolean)
                    )
                ]
                : [];
        next.topicSearch =
            String(
                next.topicSearch || ""
            ).trim();
        next.smartSessionMetric =
            String(
                next.smartSessionMetric ||
                    "quantidade"
            )
                .trim()
                .toLowerCase() === "tempo"
                ? "tempo"
                : "quantidade";
        next.onlyReadyTopics =
            next.onlyReadyTopics !== false;
        next.smartExcludedSeries =
            Array.isArray(
                next.smartExcludedSeries
            )
                ? [
                    ...new Set(
                        next.smartExcludedSeries
                            .map((item) =>
                                Number(item)
                            )
                            .filter((item) =>
                                Number.isFinite(item)
                            )
                    )
                ]
                : [];
        next.smartExcludedBases =
            Array.isArray(
                next.smartExcludedBases
            )
                ? [
                    ...new Set(
                        next.smartExcludedBases
                            .map((item) =>
                                String(
                                    item || ""
                                )
                                    .trim()
                                    .toUpperCase()
                            )
                            .filter(Boolean)
                    )
                ]
                : [];
        next.smartExcludedSubjects =
            Array.isArray(
                next.smartExcludedSubjects
            )
                ? [
                    ...new Set(
                        next.smartExcludedSubjects
                            .map((item) =>
                                String(
                                    item || ""
                                )
                                    .trim()
                                    .toLowerCase()
                            )
                            .filter(Boolean)
                    )
                ]
                : [];
        next.statsSection = [
            "resumo",
            "melhorar",
            "evolucao",
            "consistencia"
        ].includes(
            String(
                next.statsSection ||
                    "resumo"
            )
                .trim()
                .toLowerCase()
        )
            ? String(
                next.statsSection ||
                    "resumo"
            )
                  .trim()
                  .toLowerCase()
            : "resumo";
        next.statsBase = [
            "ESCOLAR",
            "ENEM",
            "VESTIBULAR"
        ].includes(
            String(
                next.statsBase ||
                    next.base ||
                    "ESCOLAR"
            )
                .trim()
                .toUpperCase()
        )
            ? String(
                next.statsBase ||
                    next.base ||
                    "ESCOLAR"
            )
                  .trim()
                  .toUpperCase()
            : "ESCOLAR";
        next.statsScope = [
            "geral",
            "serie",
            "materia",
            "assunto"
        ].includes(
            String(
                next.statsScope ||
                    "geral"
            )
                .trim()
                .toLowerCase()
        )
            ? String(
                next.statsScope ||
                    "geral"
            )
                  .trim()
                  .toLowerCase()
            : "geral";
        next.statsSerie =
            Number(next.statsSerie) ||
            Number(next.serie) ||
            1;
        next.statsMateria =
            String(
                next.statsMateria ||
                    next.materia ||
                    ""
            )
                .trim()
                .toLowerCase();
        next.statsTopicKey =
            String(
                next.statsTopicKey || ""
            ).trim();

        next.pesos =
            next.pesos &&
            typeof next.pesos === "object"
                ? { ...next.pesos }
                : {};
        next.pendingSync =
            next.pendingSync &&
            typeof next.pendingSync ===
                "object"
                ? {
                    ...next.pendingSync
                }
                : null;

        next.serie =
            Number(next.serie) || 1;
        next.quantidadeQuestoes =
            Math.max(
                1,
                Number(
                    next.quantidadeQuestoes
                ) || 5
            );
        next.smartQuestionCount =
            next.smartQuestionCount === null
                ? null
                : Math.max(
                    1,
                    Number(
                        next.smartQuestionCount ||
                            next.quantidadeQuestoes
                    ) || 5
                );
        next.smartTimeMinutes =
            next.smartTimeMinutes === null
                ? null
                : Math.max(
                    1,
                    Number(
                        next.smartTimeMinutes
                    ) || 15
                );

        return next;
    },

    save(immediate = false) {
        if (this.saveTimer) {
            clearTimeout(this.saveTimer);
            this.saveTimer = null;
        }

        const write = () => {
            localStorage.setItem(
                this.key,
                JSON.stringify(this.data)
            );
        };

        if (immediate) {
            write();
            return;
        }

        this.saveTimer = setTimeout(() => {
            this.saveTimer = null;
            write();
        }, 80);
    },

    set(patch = {}, shouldSave = true) {
        this.data = this.buildState({
            ...this.data,
            ...(patch || {})
        });

        if (shouldSave) {
            this.save();
        }
    },

    replace(nextState = {}, shouldSave = true) {
        this.data = this.buildState(
            nextState
        );

        if (shouldSave) {
            this.save();
        }
    },

    get() {
        return this.buildState(this.data);
    },

    setPendingSync(
        payload = {},
        shouldSave = true
    ) {
        this.set(
            {
                pendingSync:
                    payload &&
                    typeof payload ===
                        "object"
                        ? { ...payload }
                        : null
            },
            shouldSave
        );
    },

    consumePendingSync() {
        const pending =
            this.get().pendingSync;

        this.set(
            { pendingSync: null },
            true
        );

        return pending;
    }
};

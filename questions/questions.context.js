window.QuestionsContext = {
    key: "questions_context_v3",

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
        estrategiaMistura: "equilibrada",
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
        next.topicSearch =
            String(
                next.topicSearch || ""
            ).trim();
        next.onlyReadyTopics =
            next.onlyReadyTopics !== false;

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
            Number(next.quantidadeQuestoes) || 5;

        return next;
    },

    save() {
        localStorage.setItem(
            this.key,
            JSON.stringify(this.data)
        );
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

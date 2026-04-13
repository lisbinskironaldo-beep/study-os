export function createQuestionsRouteUseCases(
    {
        page,
        dependencies
    } = {}
) {
    const {
        QuestionsContext,
        QuestionsService
    } = dependencies || {};

    function queueExternalRoute(
        payload = {}
    ) {
        QuestionsContext.setPendingSync(
            payload,
            true
        );
        page.dispatchSyncEvent(
            "questions:route-queued",
            {
                source:
                    payload?.source || ""
            }
        );
    }

    function applyExternalRoute(
        payload = {}
    ) {
        const normalized =
            QuestionsService.normalizeSyncPayload(
                page,
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

        page.clearRuntimeNotice();
        page.syncContext();
        page.dispatchSyncEvent(
            "questions:route-applied",
            {
                source:
                    normalized.source,
                intent:
                    normalized.intent
            }
        );

        if (normalized.autoStart) {
            page.startSession();
            return true;
        }

        page.openLauncher("specific");
        return true;
    }

    function updateContext(
        patch = {}
    ) {
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
        page.clearRuntimeNotice();
        page.syncContext();
        page.render();
        page.dispatchSyncEvent(
            "questions:route-updated"
        );
    }

    function setBase(baseKey) {
        const base =
            page.data.bases?.[baseKey];

        if (!base) {
            return;
        }

        if (!base.available) {
            page.runtimeNotice =
                "A base ENEM vai ficar em um fluxo separado. O botao ja esta preparado, mas a entrega entra em outra etapa.";
            page.render();
            return;
        }

        updateContext({
            base: base.key
        });
    }

    function toggleTopic(topicKey) {
        const ctx =
            QuestionsContext.get();

        if (
            ctx.mode === "ASSUNTO_UNICO"
        ) {
            updateContext({
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

        updateContext({
            topicos: nextTopics,
            focoPrincipal:
                nextTopics.includes(
                    ctx.focoPrincipal
                )
                    ? ctx.focoPrincipal
                    : null
        });
    }

    function setFocusPrincipal(
        topicKey
    ) {
        updateContext({
            focoPrincipal: topicKey
        });
    }

    function selectAllTopics() {
        const ctx =
            QuestionsContext.get();

        if (
            ctx.mode === "ASSUNTO_UNICO"
        ) {
            return;
        }

        const topics =
            QuestionsService.getTopicOptions(
                page,
                {
                    serie: ctx.serie,
                    materia: ctx.materia
                }
            ).map((item) => item.key);

        updateContext({
            topicos: topics,
            focoPrincipal:
                topics.includes(
                    ctx.focoPrincipal
                )
                    ? ctx.focoPrincipal
                    : null
        });
    }

    function clearTopics() {
        const ctx =
            QuestionsContext.get();

        if (
            ctx.mode === "ASSUNTO_UNICO"
        ) {
            return;
        }

        updateContext({
            topicos: [],
            focoPrincipal: null
        });
    }

    function setSmartConfig(
        patch = {}
    ) {
        QuestionsContext.replace(
            {
                ...QuestionsContext.get(),
                ...(patch || {})
            },
            false
        );
        page.clearRuntimeNotice();
        page.syncContext();
        page.render();
    }

    function setSmartGoal(goalKey) {
        if (
            !page.data.smartGoals?.[
                goalKey
            ]
        ) {
            return;
        }

        setSmartConfig({
            smartGoal: goalKey
        });
    }

    function toggleSmartSeriesExclusion(
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
                    (item) =>
                        item !== serie
                )
                : [...selected, serie];

        setSmartConfig({
            smartSelectedSeries: next
        });
    }

    function toggleSmartBaseExclusion(
        baseKey
    ) {
        const base =
            page.data.bases?.[baseKey];

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

        setSmartConfig({
            smartExcludedBases: next
        });
    }

    function toggleSmartSubjectExclusion(
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

        if (
            selected.includes(key) &&
            page.smartSubjectEditorKey ===
                key
        ) {
            page.smartSubjectEditorKey =
                "";
        }

        setSmartConfig({
            smartSelectedSubjects: next
        });
    }

    function toggleSmartStartOption(
        optionKey
    ) {
        const cleanKey =
            String(optionKey || "")
                .trim()
                .toUpperCase();

        if (!cleanKey) {
            return;
        }

        if (cleanKey === "ENEM") {
            page.runtimeNotice =
                page.data.bases.ENEM
                    ?.available
                    ? "A base ENEM entra na proxima etapa do treino inteligente."
                    : "ENEM continua visivel aqui, mas ainda esta em preparacao.";
            page.render();
            return;
        }

        page.dismissCoachHint(
            "smart_start"
        );
        toggleSmartSeriesExclusion(
            cleanKey
        );
    }

    function selectAllSmartStartOptions() {
        page.dismissCoachHint(
            "smart_start"
        );
        const availableSeries =
            QuestionsService.getSeriesOptions(
                page
            ).map((item) => item.key);
        const selectedSeries =
            QuestionsContext.get()
                .smartSelectedSeries || [];

        setSmartConfig({
            smartSelectedSeries:
                selectedSeries.length ===
                availableSeries.length
                    ? []
                    : [...availableSeries]
        });
    }

    function continueSmartStart() {
        const activeOptions =
            page.getSmartStartOptions().filter(
                (item) =>
                    item.active &&
                    !item.disabled
            );

        if (!activeOptions.length) {
            page.runtimeNotice =
                "Selecione pelo menos uma serie para continuar.";
            page.render();
            return;
        }

        page.dismissCoachHint(
            "smart_start"
        );
        page.clearRuntimeNotice();
        page.openLauncher(
            "smart_subjects"
        );
    }

    function toggleSmartSubjectOption(
        subjectKey
    ) {
        const option =
            page.getSmartSubjectOptions().find(
                (item) =>
                    item.key === subjectKey
            );

        if (!option || option.disabled) {
            return;
        }

        page.dismissCoachHint(
            "smart_subjects"
        );
        toggleSmartSubjectExclusion(
            subjectKey
        );
    }

    function selectAllSmartSubjectOptions() {
        page.dismissCoachHint(
            "smart_subjects"
        );
        page.smartSubjectEditorKey = "";
        const availableSubjects =
            page.getSmartSubjectOptions()
                .filter(
                    (item) =>
                        !item.disabled
                )
                .map((item) => item.key);
        const selectedSubjects =
            QuestionsContext.get()
                .smartSelectedSubjects || [];

        setSmartConfig({
            smartSelectedSubjects:
                selectedSubjects.length ===
                availableSubjects.length
                    ? []
                    : [...availableSubjects]
        });
    }

    function continueSmartSubjects() {
        const selectedSeries =
            page.getSelectedSmartSeries();

        if (!selectedSeries.length) {
            page.runtimeNotice =
                "Selecione ao menos uma serie antes de escolher as materias.";
            page.openLauncher(
                "smart_start"
            );
            return;
        }

        const activeSubjects =
            page.getSmartSubjectOptions().filter(
                (item) =>
                    item.active &&
                    !item.disabled &&
                    item.selectedTopicCount !==
                        0
            );

        if (!activeSubjects.length) {
            page.runtimeNotice =
                "Mantenha pelo menos uma materia com assuntos ativos para continuar.";
            page.render();
            return;
        }

        page.dismissCoachHint(
            "smart_subjects"
        );
        page.smartSubjectEditorKey = "";
        page.clearRuntimeNotice();
        page.openLauncher("smart");
    }

    function clearSmartExclusions() {
        setSmartConfig({
            smartSelectedSeries: [],
            smartSelectedSubjects: [],
            smartExcludedSeries: [],
            smartExcludedBases: [],
            smartExcludedSubjects: [],
            smartExcludedTopicsBySubject:
                {}
        });
    }

    return {
        queueExternalRoute,
        applyExternalRoute,
        updateContext,
        setBase,
        toggleTopic,
        setFocusPrincipal,
        selectAllTopics,
        clearTopics,
        setSmartConfig,
        setSmartGoal,
        toggleSmartSeriesExclusion,
        toggleSmartBaseExclusion,
        toggleSmartSubjectExclusion,
        toggleSmartStartOption,
        selectAllSmartStartOptions,
        continueSmartStart,
        toggleSmartSubjectOption,
        selectAllSmartSubjectOptions,
        continueSmartSubjects,
        clearSmartExclusions
    };
}

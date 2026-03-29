export function createQuestionsContextSynchronization(
    {
        page,
        dependencies
    } = {}
) {
    const {
        QuestionsContext,
        QuestionsService
    } = dependencies || {};

    function syncContext() {
        const snapshot =
            QuestionsContext.get();
        const series =
            QuestionsService.getSeriesOptions(
                page
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
                page,
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
                page,
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
            page.data.modes[
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
                page,
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
                page.data.bases[
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
    }

    function resolveQuestionList(
        questionIds = [],
        fallbackSnapshot = []
    ) {
        const ids = Array.isArray(questionIds)
            ? questionIds.filter(Boolean)
            : [];

        if (
            ids.length &&
            page.contentRepository &&
            typeof page.contentRepository
                .findQuestionsByIds ===
                "function"
        ) {
            const resolved =
                page.contentRepository.findQuestionsByIds(
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
    }

    return {
        syncContext,
        resolveQuestionList
    };
}

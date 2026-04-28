export function createQuestionsSessionEngine(
    {
        page,
        dependencies
    } = {}
) {
    const {
        QuestionsService,
        QuestionsStore,
        QuestionsContext
    } = dependencies || {};

    function validateRoute() {
        return QuestionsService.getLauncherValidation(
            page
        );
    }

    function buildRouteSummary() {
        return QuestionsService.getRouteSummary(
            page
        );
    }

    function buildSessionPlan() {
        const validation =
            validateRoute();
        const questions =
            validation.isReady
                ? QuestionsService.buildSession(
                    page
                )
                : [];
        const questionIds =
            questions.map(
                (question) =>
                    question?.id || ""
            );

        return {
            validation,
            questions,
            questionIds,
            meta: {
                ...buildRouteSummary()
            }
        };
    }

    function summarizeResults(
        results = [],
        meta = {}
    ) {
        return QuestionsService.summarizeSessionResults(
            results,
            meta
        );
    }

    function buildFollowUpContext(
        intent,
        summary = null
    ) {
        return QuestionsService.buildFollowUpContext(
            page,
            intent,
            summary
        );
    }

    function buildSmartRoutePreview(
        context = null
    ) {
        const current =
            context ||
            QuestionsContext.get();
        const validation =
            QuestionsService.getSmartLauncherValidation(
                page,
                current
            );
        const goal =
            page.data.smartGoals[
                current.smartGoal
            ] ||
            page.data.smartGoals.continue;

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
            validation.eligibleTopics ||
            [];
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
                page,
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
    }

    return {
        validateRoute,
        buildRouteSummary,
        buildSessionPlan,
        summarizeResults,
        buildFollowUpContext,
        buildSmartRoutePreview
    };
}

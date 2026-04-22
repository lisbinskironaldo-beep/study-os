import { createQuestionsSessionPlanner } from "./sessionPlanner.mjs";

export function createQuestionsSessionUseCases(
    {
        page,
        dependencies
    } = {}
) {
    const {
        QuestionsState,
        QuestionsStore,
        QuestionsContext,
        QuestionsUI,
        QuestionsContentRepository
    } = dependencies || {};
    let contentRepository =
        QuestionsContentRepository ||
        null;
    const planner =
        createQuestionsSessionPlanner({
            page,
            dependencies
        });

    function setContentRepository(
        repository = null
    ) {
        contentRepository =
            repository || null;
    }

    async function ensureDetailedCatalogLoaded() {
        if (
            typeof page
                .ensureDetailedCatalogLoaded ===
            "function"
        ) {
            await page.ensureDetailedCatalogLoaded();
        }
    }

    async function ensureRouteCatalogLoaded(
        routeContext = null
    ) {
        if (
            typeof page
                .ensureRouteCatalogLoaded ===
            "function"
        ) {
            await page.ensureRouteCatalogLoaded(
                routeContext
            );
            return;
        }

        await ensureDetailedCatalogLoaded();
    }

    function getRouteTopicIds(
        routeContext = null
    ) {
        const fallbackContext =
            typeof QuestionsContext.get ===
            "function"
                ? QuestionsContext.get()
                : {};
        const sourceContext =
            routeContext &&
            typeof routeContext === "object"
                ? routeContext
                : fallbackContext;

        return Array.isArray(
            sourceContext?.topicos
        )
            ? sourceContext.topicos.filter(
                Boolean
            )
            : [];
    }

    function createListResolutionResult(
        {
            list = [],
            source = "empty",
            requestedCount = 0,
            resolvedCount = 0
        } = {}
    ) {
        return {
            list: Array.isArray(list)
                ? [...list]
                : [],
            source,
            requestedCount:
                Number(requestedCount) || 0,
            resolvedCount:
                Number(resolvedCount) || 0
        };
    }

    function getRunResolutionNotice(
        run = {},
        resolution = {},
        mode = "resume"
    ) {
        const requestedCount =
            Number(
                resolution.requestedCount
            ) || 0;
        const resolvedCount =
            Number(
                resolution.resolvedCount
            ) || 0;
        const hasSnapshot =
            Array.isArray(
                run.sessionSnapshot
            ) &&
            run.sessionSnapshot.length > 0;

        if (
            resolution.source === "snapshot"
        ) {
            if (
                requestedCount > 0 &&
                resolvedCount > 0 &&
                resolvedCount < requestedCount
            ) {
                return mode === "restart"
                    ? "Essa sessão foi reiniciada pelo snapshot salvo porque parte das questões por id não está mais disponível."
                    : "Essa sessão foi retomada pelo snapshot salvo porque parte das questões por id não está mais disponível.";
            }

            return mode === "restart"
                ? "Essa sessão foi reiniciada pelo snapshot de compatibilidade."
                : "Essa sessão foi retomada pelo snapshot de compatibilidade.";
        }

        if (
            requestedCount > 0 &&
            resolvedCount > 0 &&
            resolvedCount < requestedCount
        ) {
            return hasSnapshot
                ? "Parte das questões salvas não está mais disponível e nem o snapshot de compatibilidade conseguiu reconstruir a sessão."
                : "Parte das questões salvas não está mais disponível para reconstruir essa sessão.";
        }

        if (requestedCount > 0) {
            return hasSnapshot
                ? "Não foi possível reconstruir essa sessão pelos ids salvos nem pelo snapshot de compatibilidade."
                : "Não foi possível reconstruir essa sessão pelos ids salvos.";
        }

        return mode === "restart"
            ? "Essa sessão não pode ser reiniciada porque a lista de questões não está mais disponível."
            : "Essa sessão não tem mais uma lista válida para retomada.";
    }

    async function resolveSessionListFromIds(
        questionIds = [],
        routeContext = null
    ) {
        if (
            !contentRepository ||
            (
                typeof contentRepository.findQuestionsByIds !==
                    "function" &&
                typeof contentRepository.findQuestionsByIdsAsync !==
                    "function"
            )
        ) {
            return createListResolutionResult();
        }

        const ids = Array.isArray(
            questionIds
        )
            ? questionIds.filter(Boolean)
            : [];

        if (!ids.length) {
            return createListResolutionResult();
        }

        const resolved =
            typeof contentRepository.findQuestionsByIdsAsync ===
            "function"
                ? await contentRepository.findQuestionsByIdsAsync(
                    ids,
                    {
                        topicIds:
                            getRouteTopicIds(
                                routeContext
                            )
                    }
                )
                : contentRepository.findQuestionsByIds(
                    ids
                );

        if (
            typeof page
                .syncCatalogFromRepository ===
            "function"
        ) {
            page.syncCatalogFromRepository();
        }

        const resolvedList = Array.isArray(
            resolved
        )
            ? [...resolved]
            : [];

        return createListResolutionResult({
            list:
                resolvedList.length ===
                ids.length
                    ? resolvedList
                    : [],
            source:
                resolvedList.length ===
                ids.length
                    ? "ids"
                    : "empty",
            requestedCount: ids.length,
            resolvedCount:
                resolvedList.length
        });
    }

    async function resolveRunSessionList(
        run = {}
    ) {
        const listFromIds =
            await resolveSessionListFromIds(
                run.questionIds,
                run.routeSnapshot?.context ||
                    {}
            );

        if (listFromIds.list.length) {
            return listFromIds;
        }

        const snapshotList = Array.isArray(
            run.sessionSnapshot
        ) &&
            run.sessionSnapshot.length
            ? [...run.sessionSnapshot]
            : [];

        if (snapshotList.length) {
            return createListResolutionResult({
                list: snapshotList,
                source: "snapshot",
                requestedCount:
                    listFromIds.requestedCount,
                resolvedCount:
                    listFromIds.resolvedCount
            });
        }

        return createListResolutionResult({
            requestedCount:
                listFromIds.requestedCount,
            resolvedCount:
                listFromIds.resolvedCount
        });
    }

    function createRunFromSession(
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
            title: page.buildRunTitle(
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
    }

    function persistActiveRun(
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
            title: page.buildRunTitle(
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
    }

    async function startSession(options = {}) {
        const hasSnapshotList =
            Array.isArray(
                options.sessionList
            ) &&
            options.sessionList.length;
        const hasQuestionIds =
            Array.isArray(
                options.questionIds
            ) &&
            options.questionIds.length;

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

        page.syncContext();

        let list = hasSnapshotList
            ? [...options.sessionList]
            : (
                hasQuestionIds
                    ? (
                        await resolveSessionListFromIds(
                        options.questionIds,
                        options.routeContext ||
                            QuestionsContext.get()
                    )
                    ).list
                    : []
            );
        let meta = {};
        let sessionPlan = null;

        if (
            !hasSnapshotList &&
            !hasQuestionIds
        ) {
            await ensureRouteCatalogLoaded(
                options.routeContext ||
                    QuestionsContext.get()
            );
            sessionPlan =
                planner.buildSessionPlan();
            const validation =
                sessionPlan.validation;

            if (!validation.isReady) {
                page.runtimeNotice =
                    validation.issues[0] ||
                    "Complete a rota antes de iniciar o treino.";
                page.openLauncher();
                return;
            }

            list = Array.isArray(
                sessionPlan.questions
            )
                ? [...sessionPlan.questions]
                : [];

            if (!list.length) {
                page.runtimeNotice =
                    "Ainda não há questões preenchidas nesse recorte. Continue alimentando o banco e tente de novo.";
                page.openLauncher();
                return;
            }
        }

        if (!list.length) {
            page.runtimeNotice =
                hasQuestionIds
                    ? "Não foi possível reconstruir essa sessão pelos ids salvos."
                    : "Ainda não há questões preenchidas nesse recorte. Continue alimentando o banco e tente de novo.";
            page.openLauncher();
            return;
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
            ...(
                sessionPlan?.meta ||
                planner.buildRouteSummary()
            ),
            ...(options.meta || {}),
            sourceMode
        };

        page.clearRuntimeNotice();

        let activeRunId =
            String(
                options.activeRunId || ""
            ).trim();

        if (
            options.createRun !== false &&
            !activeRunId
        ) {
            const run =
                createRunFromSession(
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

        page.sessionReturnView =
            QuestionsState.isValidLauncherView(
                QuestionsState.getLauncherView()
            )
                ? QuestionsState.getLauncherView()
                : page.getSessionReturnView(
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

        page.activateSimuladoTimer?.(
            meta,
            {
                ...options,
                sourceMode,
                activeRunId
            }
        );

        page.dispatchSyncEvent(
            "questions:session-started",
            {
                route:
                    QuestionsState.getMeta()
            }
        );
        page.render({
            sync: false,
            immediate: true
        });
    }

    function pauseSession() {
        if (
            QuestionsState.getPhase() !==
            "session"
        ) {
            page.openLauncher(
                page.getSessionReturnView(
                    "home"
                )
            );
            return;
        }

        QuestionsStore.flushProfileState(true);
        page.pauseSimuladoTimer?.();
        persistActiveRun("in_progress");
        page.runtimeNotice =
            "Treino pausado. Você pode retomar depois.";
        page.openLauncher(
            page.getSessionReturnView(
                "home"
            )
        );
    }

    async function resumeRun(runId) {
        const run =
            QuestionsStore.getRunById(runId);

        if (!run) {
            page.runtimeNotice =
                "Não foi possível reencontrar essa sessão.";
            page.openLauncher("resume");
            return;
        }

        const resolution =
            await resolveRunSessionList(run);

        if (!resolution.list.length) {
            page.runtimeNotice =
                getRunResolutionNotice(
                    run,
                    resolution,
                    "resume"
                );
            page.openLauncher("resume");
            return;
        }

        const postStartNotice =
            resolution.source ===
            "snapshot"
                ? getRunResolutionNotice(
                    run,
                    resolution,
                    "resume"
                )
                : "";

        if (
            resolution.source ===
            "snapshot"
        ) {
            page.clearRuntimeNotice();
        }

        await startSession({
            sessionList:
                resolution.list,
            questionIds:
                run.questionIds || [],
            meta:
                run.routeSnapshot?.meta || {},
            routeContext:
                run.routeSnapshot?.context ||
                {},
            activeRunId: run.id,
            currentIndex:
                Number(run.currentIndex) || 0,
            results: Array.isArray(
                run.answers
            )
                ? [...run.answers]
                : [],
            lastAnswer:
                run.lastAnswer || null,
            sourceMode:
                run.mode || "specific",
            createRun: false
        });

        if (
            postStartNotice &&
            QuestionsState.getPhase() ===
                "session"
        ) {
            page.runtimeNotice =
                postStartNotice;
            page.render({
                sync: false,
                immediate: true
            });
        }
    }

    async function restartRun(runId) {
        const run =
            QuestionsStore.getRunById(runId);

        if (!run) {
            page.runtimeNotice =
                "Não foi possível reencontrar essa sessão.";
            page.openLauncher("resume");
            return;
        }

        const resolution =
            await resolveRunSessionList(run);

        if (!resolution.list.length) {
            page.runtimeNotice =
                getRunResolutionNotice(
                    run,
                    resolution,
                    "restart"
                );
            page.openLauncher("resume");
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

        const postStartNotice =
            resolution.source ===
            "snapshot"
                ? getRunResolutionNotice(
                    run,
                    resolution,
                    "restart"
                )
                : "";

        if (
            resolution.source ===
            "snapshot"
        ) {
            page.clearRuntimeNotice();
        }
        await startSession({
            sessionList:
                resolution.list,
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

        if (
            postStartNotice &&
            QuestionsState.getPhase() ===
                "session"
        ) {
            page.runtimeNotice =
                postStartNotice;
            page.render({
                sync: false,
                immediate: true
            });
        }
    }

    function continueSession() {
        if (
            !QuestionsState.getLastAnswer() &&
            !QuestionsState.isComplete()
        ) {
            return;
        }

        page.commitLastAnswer?.();
        QuestionsState.next();

        if (
            QuestionsState.isComplete() &&
            !QuestionsState.isSessionRecorded()
        ) {
            page.pauseSimuladoTimer?.();
            const summary =
                planner.summarizeResults(
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
                amount: summary.total,
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

            persistActiveRun(
                "completed",
                {
                    currentIndex:
                        QuestionsState.getCurrent(),
                    summary
                }
            );

            QuestionsState.markSessionRecorded();
            page.dispatchSyncEvent(
                "questions:session-completed",
                {
                    summary
                }
            );
        }

        page.render();
    }

    function buildSmartRoutePreview() {
        return planner.buildSmartRoutePreview();
    }

    async function startSmartSession(
        options = {}
    ) {
        const preview =
            buildSmartRoutePreview();

        if (
            !preview.isReady ||
            !preview.patch
        ) {
            page.runtimeNotice =
                preview.reason ||
                "Nao foi possivel montar uma sugestao automatica agora.";
            page.openLauncher(
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
        page.clearRuntimeNotice();
        page.syncContext();
        await startSession(options);
    }

    async function startFollowUp(intent) {
        const summary =
            planner.summarizeResults(
                QuestionsState.getResults(),
                QuestionsState.getMeta()
            );
        const patch =
            planner.buildFollowUpContext(
                intent,
                summary
            );

        page.updateContext(patch);
        await startSession();
    }

    return {
        createRunFromSession,
        persistActiveRun,
        setContentRepository,
        startSession,
        pauseSession,
        resumeRun,
        restartRun,
        continueSession,
        buildSmartRoutePreview,
        startSmartSession,
        startFollowUp
    };
}

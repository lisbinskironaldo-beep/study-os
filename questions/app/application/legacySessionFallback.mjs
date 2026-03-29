import { createQuestionsSessionPlanner } from "./sessionPlanner.mjs";

export function createQuestionsLegacySessionFallback(
    {
        page,
        dependencies
    } = {}
) {
    const {
        QuestionsState,
        QuestionsStore,
        QuestionsContext,
        QuestionsUI
    } = dependencies || {};
    const planner =
        createQuestionsSessionPlanner({
            page,
            dependencies
        });

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
        persistActiveRun(
            "in_progress"
        );
        page.runtimeNotice =
            "Treino pausado. Voce pode retomar depois.";
        page.openLauncher(
            page.getSessionReturnView(
                "home"
            )
        );
    }

    function buildSmartRoutePreview() {
        return planner.buildSmartRoutePreview();
    }

    function startSmartSession(
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
        page.startSession(options);
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
            const summary =
                planner.summarizeResults(
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

    function startFollowUp(intent) {
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
        page.startSession();
    }

    function startSession(options = {}) {
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

        page.syncContext();

        let list = hasSnapshotList
            ? [...options.sessionList]
            : [];
        let meta = {};
        let sessionPlan = null;

        if (!hasSnapshotList) {
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
                    "Ainda nao ha questoes preenchidas nesse recorte. Continue alimentando o banco e tente de novo.";
                page.openLauncher();
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

    return {
        createRunFromSession,
        persistActiveRun,
        pauseSession,
        buildSmartRoutePreview,
        startSmartSession,
        continueSession,
        startFollowUp,
        startSession
    };
}

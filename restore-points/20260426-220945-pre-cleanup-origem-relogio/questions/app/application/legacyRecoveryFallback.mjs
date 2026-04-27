export function createQuestionsLegacyRecoveryFallback(
    {
        page,
        dependencies
    } = {}
) {
    const {
        QuestionsStore,
        QuestionsState
    } = dependencies || {};

    function resumeRun(runId) {
        const run =
            QuestionsStore.getRunById(runId);

        if (!run) {
            page.runtimeNotice =
                "Não foi possível reencontrar essa sessão.";
            page.openLauncher("resume");
            return;
        }

        const list =
            page.resolveQuestionList(
                run.questionIds,
                run.sessionSnapshot
            );

        if (!list.length) {
            page.runtimeNotice =
                "Essa sessão não tem mais uma lista válida para retomada.";
            page.openLauncher("resume");
            return;
        }

        page.clearRuntimeNotice();
        page.startSession({
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
    }

    function restartRun(runId) {
        const run =
            QuestionsStore.getRunById(runId);

        if (!run) {
            page.runtimeNotice =
                "Não foi possível reencontrar essa sessão.";
            page.openLauncher("resume");
            return;
        }

        const list =
            page.resolveQuestionList(
                run.questionIds,
                run.sessionSnapshot
            );

        if (!list.length) {
            page.runtimeNotice =
                "Essa sessão não pode ser reiniciada porque a lista de questões não está mais disponível.";
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

        page.clearRuntimeNotice();
        page.startSession({
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
    }

    function startSavedBlock(blockId) {
        const block =
            QuestionsStore.getSavedBlockById(
                blockId
            );

        if (!block) {
            page.runtimeNotice =
                "Nao foi possivel encontrar esse bloco salvo.";
            page.openLauncher("saved");
            return;
        }

        const resolvedList =
            page.resolveQuestionList(
                block.questionIds,
                block.sessionSnapshot
            );

        if (!resolvedList.length) {
            page.runtimeNotice =
                "Esse bloco não tem questões suficientes para ser refeito.";
            page.openLauncher("saved");
            return;
        }

        QuestionsStore.markSavedBlockUsed(
            block.id
        );
        page.clearRuntimeNotice();
        page.startSession({
            sessionList: resolvedList,
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
    }

    return {
        resumeRun,
        restartRun,
        startSavedBlock
    };
}

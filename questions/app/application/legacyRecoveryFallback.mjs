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
                "Nao foi possivel reencontrar essa sessao.";
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
                "Essa sessao nao tem mais uma lista valida para retomada.";
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
                "Nao foi possivel reencontrar essa sessao.";
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
                "Essa sessao nao pode ser reiniciada porque a lista de questoes nao esta mais disponivel.";
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
                "Esse bloco nao tem questoes suficientes para ser refeito.";
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

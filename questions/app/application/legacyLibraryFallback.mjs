export function createQuestionsLegacyLibraryFallback(
    {
        page,
        dependencies
    } = {}
) {
    const {
        QuestionsStore,
        QuestionsContext,
        QuestionsService
    } = dependencies || {};

    function saveBlockSnapshot(
        snapshot = {},
        options = {}
    ) {
        const list = Array.isArray(
            snapshot.list
        )
            ? snapshot.list
            : [];
        const meta =
            snapshot.meta &&
            typeof snapshot.meta === "object"
                ? {
                    ...snapshot.meta
                }
                : {};
        const routeContext =
            snapshot.routeContext &&
            typeof snapshot.routeContext ===
                "object"
                ? {
                    ...snapshot.routeContext
                }
                : {
                    ...QuestionsContext.get()
                };
        const launcherContext =
            snapshot.launcherContext &&
            typeof snapshot.launcherContext ===
                "object"
                ? {
                    ...snapshot.launcherContext
                }
                : {
                    ...routeContext
                };
        const sourceMode =
            options.sourceMode ||
            meta.sourceMode ||
            "specific";

        if (!list.length) {
            page.runtimeNotice =
                "Nao foi possivel salvar um bloco vazio com o recorte atual.";
            page.render();
            return null;
        }

        const suggestedName =
            page.buildSavedBlockName(
                meta,
                routeContext,
                sourceMode
            );
        const requestedName =
            options.skipPrompt === true
                ? options.defaultName
                : window.prompt(
                    "Nome do bloco salvo:",
                    options.defaultName ||
                        suggestedName
                );

        if (
            requestedName === null &&
            options.skipPrompt !== true
        ) {
            return null;
        }

        const cleanName =
            String(
                requestedName || ""
            ).trim() ||
            suggestedName;
        const block =
            QuestionsStore.saveSavedBlock({
                name: cleanName,
                mode: sourceMode,
                launcherContext,
                routeSnapshot: {
                    context: routeContext,
                    meta,
                    note:
                        String(
                            options.note || ""
                        ).trim()
                },
                questionIds: list.map(
                    (question) =>
                        question?.id || ""
                ),
                sessionSnapshot: list,
                profileId:
                    String(
                        options.profileId || ""
                    ).trim()
            });

        if (options.silent !== true) {
            page.runtimeNotice =
                `Bloco salvo: ${cleanName}.`;
            page.render();
        }

        return block;
    }

    function saveCurrentSpecificBlock() {
        const validation =
            QuestionsService.getLauncherValidation(
                page
            );

        if (!validation.isReady) {
            page.runtimeNotice =
                validation.issues[0] ||
                "Complete a rota antes de salvar um bloco.";
            page.openLauncher(
                "specific"
            );
            return;
        }

        const current =
            QuestionsContext.get();
        const list =
            QuestionsService.buildSession(
                page
            );

        return saveBlockSnapshot(
            {
                list,
                meta: {
                    ...QuestionsService.getRouteSummary(
                        page
                    ),
                    sourceMode: "specific"
                },
                routeContext: current,
                launcherContext: current
            },
            {
                sourceMode: "specific"
            }
        );
    }

    function saveCurrentSmartBlock() {
        const current =
            QuestionsContext.get();
        const preview =
            page.buildSmartRoutePreview();

        if (
            !preview.isReady ||
            !preview.patch
        ) {
            page.runtimeNotice =
                preview.reason ||
                "Nao foi possivel salvar um bloco inteligente com o recorte atual.";
            page.openLauncher("smart");
            return;
        }

        const snapshot =
            page.buildSessionSnapshotForBlock(
                preview.patch,
                {
                    sourceMode: "smart",
                    launcherContext: current
                }
            );

        return saveBlockSnapshot(snapshot, {
            sourceMode: "smart",
            note: preview.note || ""
        });
    }

    function openSavedBlock(blockId) {
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

        QuestionsStore.markSavedBlockUsed(
            block.id
        );
        QuestionsContext.replace(
            {
                ...QuestionsContext.get(),
                ...(
                    block.launcherContext ||
                    block.routeSnapshot
                        ?.context ||
                    {}
                )
            },
            false
        );

        page.runtimeNotice =
            `Bloco aplicado: ${block.name}.`;
        page.syncContext();
        page.openLauncher(
            block.mode === "smart"
                ? "smart"
                : "specific"
        );
    }

    function renameSavedBlock(blockId) {
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

        const name = window.prompt(
            "Novo nome do bloco:",
            block.name || ""
        );

        if (name === null) {
            return;
        }

        const cleanName =
            String(name || "").trim();

        if (!cleanName) {
            page.runtimeNotice =
                "O bloco precisa de um nome para ser salvo.";
            page.openLauncher("saved");
            return;
        }

        QuestionsStore.saveSavedBlock({
            ...block,
            name: cleanName
        });
        page.runtimeNotice =
            `Bloco renomeado para ${cleanName}.`;
        page.openLauncher("saved");
    }

    function duplicateSavedBlock(
        blockId
    ) {
        const block =
            QuestionsStore.getSavedBlockById(
                blockId
            );

        if (!block) {
            page.runtimeNotice =
                "Nao foi possivel duplicar esse bloco salvo.";
            page.openLauncher("saved");
            return;
        }

        const defaultName =
            `${block.name} copia`;
        const name = window.prompt(
            "Nome da copia do bloco:",
            defaultName
        );

        if (name === null) {
            return;
        }

        const cleanName =
            String(name || "").trim() ||
            defaultName;

        QuestionsStore.saveSavedBlock({
            ...block,
            id: "",
            createdAt: 0,
            updatedAt: 0,
            lastUsedAt: 0,
            name: cleanName
        });
        page.runtimeNotice =
            `Bloco duplicado: ${cleanName}.`;
        page.openLauncher("saved");
    }

    function deleteSavedBlock(
        blockId,
        options = {}
    ) {
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

        QuestionsStore.deleteSavedBlock(
            block.id
        );
        page.runtimeNotice =
            `Bloco apagado: ${block.name}.`;
        page.openLauncher("saved");
    }

    return {
        saveBlockSnapshot,
        saveCurrentSpecificBlock,
        saveCurrentSmartBlock,
        openSavedBlock,
        renameSavedBlock,
        duplicateSavedBlock,
        deleteSavedBlock
    };
}

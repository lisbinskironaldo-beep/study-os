export function createQuestionsLibraryUseCases(
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

    function saveCurrentSmartProfile() {
        const suggestedName =
            page.getSuggestedSmartProfileName();
        const name = window.prompt(
            "Nome do perfil inteligente:",
            suggestedName
        );

        if (name === null) {
            return;
        }

        const cleanName =
            String(name || "").trim() ||
            suggestedName;

        QuestionsStore.saveSmartProfile({
            name: cleanName,
            ...page.buildSmartProfilePayload()
        });

        page.runtimeNotice =
            `Perfil salvo: ${cleanName}.`;
        page.openLauncher(
            "smart_profiles"
        );
    }

    function applySmartProfile(
        profileId
    ) {
        const profile =
            QuestionsStore.getSmartProfileById(
                profileId
            );

        if (!profile) {
            page.runtimeNotice =
                "Nao foi possivel encontrar esse perfil inteligente.";
            page.openLauncher(
                "smart_profiles"
            );
            return;
        }

        QuestionsStore.markSmartProfileUsed(
            profile.id
        );
        page.setSmartConfig({
            smartGoal:
                profile.smartGoal ||
                "continue",
            smartSelectedSeries: [
                ...(profile.selectedSeries ||
                    [])
            ],
            smartSelectedSubjects: [
                ...(profile.selectedSubjects ||
                    [])
            ],
            smartExcludedSeries: [
                ...(profile.excludedSeries ||
                    [])
            ],
            smartExcludedBases: [
                ...(profile.excludedBases ||
                    [])
            ],
            smartExcludedSubjects: [
                ...(profile.excludedSubjects ||
                    [])
            ],
            quantidadeQuestoes:
                Number(
                    profile.preferredAmount
                ) ||
                QuestionsContext.get()
                    .quantidadeQuestoes
        });
        page.runtimeNotice =
            `Perfil aplicado: ${profile.name}.`;
        page.openLauncher("smart");
    }

    function renameSmartProfile(
        profileId
    ) {
        const profile =
            QuestionsStore.getSmartProfileById(
                profileId
            );

        if (!profile) {
            page.runtimeNotice =
                "Nao foi possivel encontrar esse perfil inteligente.";
            page.openLauncher(
                "smart_profiles"
            );
            return;
        }

        const name = window.prompt(
            "Novo nome do perfil:",
            profile.name || ""
        );

        if (name === null) {
            return;
        }

        const cleanName =
            String(name || "").trim();

        if (!cleanName) {
            page.runtimeNotice =
                "O perfil precisa de um nome para ser salvo.";
            page.openLauncher(
                "smart_profiles"
            );
            return;
        }

        QuestionsStore.saveSmartProfile({
            ...profile,
            name: cleanName
        });
        page.runtimeNotice =
            `Perfil renomeado para ${cleanName}.`;
        page.openLauncher(
            "smart_profiles"
        );
    }

    function duplicateSmartProfile(
        profileId
    ) {
        const profile =
            QuestionsStore.getSmartProfileById(
                profileId
            );

        if (!profile) {
            page.runtimeNotice =
                "Nao foi possivel duplicar esse perfil inteligente.";
            page.openLauncher(
                "smart_profiles"
            );
            return;
        }

        const defaultName =
            `${profile.name} copia`;
        const name = window.prompt(
            "Nome da copia do perfil:",
            defaultName
        );

        if (name === null) {
            return;
        }

        const cleanName =
            String(name || "").trim() ||
            defaultName;

        QuestionsStore.saveSmartProfile({
            ...profile,
            id: "",
            createdAt: 0,
            updatedAt: 0,
            lastUsedAt: 0,
            name: cleanName
        });
        page.runtimeNotice =
            `Perfil duplicado: ${cleanName}.`;
        page.openLauncher(
            "smart_profiles"
        );
    }

    function deleteSmartProfile(
        profileId
    ) {
        const profile =
            QuestionsStore.getSmartProfileById(
                profileId
            );

        if (!profile) {
            page.runtimeNotice =
                "Nao foi possivel encontrar esse perfil inteligente.";
            page.openLauncher(
                "smart_profiles"
            );
            return;
        }

        const confirmed =
            window.confirm(
                `Apagar o perfil "${profile.name}"?`
            );

        if (!confirmed) {
            return;
        }

        QuestionsStore.deleteSmartProfile(
            profileId
        );
        page.runtimeNotice =
            `Perfil apagado: ${profile.name}.`;
        page.openLauncher(
            "smart_profiles"
        );
    }

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
        const name = window.prompt(
            "Nome do bloco salvo:",
            options.defaultName ||
                suggestedName
        );

        if (name === null) {
            return null;
        }

        const cleanName =
            String(name || "").trim() ||
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
                sessionSnapshot: list
            });

        page.runtimeNotice =
            `Bloco salvo: ${cleanName}.`;
        page.render();

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

        saveBlockSnapshot(
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

        saveBlockSnapshot(snapshot, {
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

    function startSavedBlock(
        blockId
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

    function renameSavedBlock(
        blockId
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
        blockId
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

        const confirmed =
            window.confirm(
                `Apagar o bloco "${block.name}"?`
            );

        if (!confirmed) {
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
        saveCurrentSmartProfile,
        applySmartProfile,
        renameSmartProfile,
        duplicateSmartProfile,
        deleteSmartProfile,
        saveBlockSnapshot,
        saveCurrentSpecificBlock,
        saveCurrentSmartBlock,
        openSavedBlock,
        startSavedBlock,
        renameSavedBlock,
        duplicateSavedBlock,
        deleteSavedBlock
    };
}

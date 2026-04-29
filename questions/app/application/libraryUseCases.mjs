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
        return Array.isArray(
            routeContext?.topicos
        )
            ? routeContext.topicos.filter(
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

    function getSavedBlockResolutionNotice(
        block = {},
        resolution = {}
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
                block.sessionSnapshot
            ) &&
            block.sessionSnapshot.length > 0;

        if (
            resolution.source === "snapshot"
        ) {
            if (
                requestedCount > 0 &&
                resolvedCount > 0 &&
                resolvedCount < requestedCount
            ) {
                return "Esse bloco foi refeito pelo snapshot salvo porque parte das questoes por id nao esta mais disponivel.";
            }

            return "Esse bloco foi refeito pelo snapshot de compatibilidade.";
        }

        if (
            requestedCount > 0 &&
            resolvedCount > 0 &&
            resolvedCount < requestedCount
        ) {
            return hasSnapshot
                ? "Parte das questoes desse bloco nao esta mais disponivel e nem o snapshot de compatibilidade conseguiu reconstruir o treino."
                : "Parte das questoes desse bloco nao esta mais disponivel para reconstruir o treino.";
        }

        if (requestedCount > 0) {
            return hasSnapshot
                ? "Nao foi possivel reconstruir esse bloco nem pelos ids salvos nem pelo snapshot de compatibilidade."
                : "Nao foi possivel reconstruir esse bloco pelos ids salvos.";
        }

        return "Esse bloco nao tem questoes suficientes para ser refeito.";
    }

    async function resolveQuestionList(
        questionIds = [],
        fallbackSnapshot = [],
        routeContext = null
    ) {
        const ids = Array.isArray(questionIds)
            ? questionIds.filter(Boolean)
            : [];
        const fallbackList = Array.isArray(
            fallbackSnapshot
        ) && fallbackSnapshot.length
            ? [...fallbackSnapshot]
            : [];

        if (
            ids.length &&
            page.contentRepository &&
            typeof page.contentRepository
                .findQuestionsByIdsAsync ===
                "function"
        ) {
            const resolved =
                await page.contentRepository.findQuestionsByIdsAsync(
                    ids,
                    {
                        topicIds:
                            getRouteTopicIds(
                                routeContext
                            )
                    }
                );

            if (
                typeof page
                    .syncCatalogFromRepository ===
                "function"
            ) {
                page.syncCatalogFromRepository();
            }

            if (
                Array.isArray(resolved) &&
                resolved.length === ids.length
            ) {
                return createListResolutionResult(
                    {
                        list: resolved,
                        source: "ids",
                        requestedCount:
                            ids.length,
                        resolvedCount:
                            resolved.length
                    }
                );
            }

            if (fallbackList.length) {
                return createListResolutionResult(
                    {
                        list: fallbackList,
                        source: "snapshot",
                        requestedCount:
                            ids.length,
                        resolvedCount:
                            Array.isArray(
                                resolved
                            )
                                ? resolved.length
                                : 0
                    }
                );
            }

            return createListResolutionResult(
                {
                    requestedCount:
                        ids.length,
                    resolvedCount:
                        Array.isArray(
                            resolved
                        )
                            ? resolved.length
                            : 0
                }
            );
        }

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
                typeof page
                    .syncCatalogFromRepository ===
                "function"
            ) {
                page.syncCatalogFromRepository();
            }

            if (
                Array.isArray(resolved) &&
                resolved.length === ids.length
            ) {
                return createListResolutionResult(
                    {
                        list: resolved,
                        source: "ids",
                        requestedCount:
                            ids.length,
                        resolvedCount:
                            resolved.length
                    }
                );
            }
        }

        if (fallbackList.length) {
            return createListResolutionResult({
                list: fallbackList,
                source: "snapshot",
                requestedCount: ids.length,
                resolvedCount: 0
            });
        }

        return createListResolutionResult({
            requestedCount: ids.length,
            resolvedCount: 0
        });
    }

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
            smartSessionMetric:
                profile.sessionMetric ||
                "quantidade",
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
            smartExcludedTopicsBySubject:
                {
                    ...(
                        profile.excludedTopicsBySubject ||
                        {}
                    )
                },
            smartQuestionCount:
                profile.questionCount === null
                    ? null
                    : Number(
                        profile.questionCount
                    ) || 5,
            smartTimeMinutes:
                profile.timeMinutes === null
                    ? null
                    : Number(
                        profile.timeMinutes
                    ) || 15,
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
        profileId,
        options = {}
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

        if (
            typeof page.openConfirmDialog ===
            "function"
        ) {
            page.openConfirmDialog({
                title: "Apagar perfil",
                message:
                    `Apagar o perfil "${profile.name}"?`,
                confirmLabel: "Apagar",
                anchorRect:
                    options.anchorRect ||
                    null,
                onConfirm: () => {
                    QuestionsStore.deleteSmartProfile(
                        profileId
                    );
                    page.runtimeNotice =
                        `Perfil apagado: ${profile.name}.`;
                    page.openLauncher(
                        "smart_profiles"
                    );
                }
            });
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

    async function saveCurrentSpecificBlock() {
        const validation =
            QuestionsService.getLauncherValidation(
                page
            );
        const current =
            QuestionsContext.get();

        if (!validation.isReady) {
            page.runtimeNotice =
                validation.issues[0] ||
                "Complete a rota antes de salvar um bloco.";
            page.openLauncher(
                "specific"
            );
            return;
        }

        await ensureRouteCatalogLoaded(
            current
        );
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

    async function saveCurrentSmartBlock() {
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

        await ensureRouteCatalogLoaded(
            preview.patch
        );
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

        page.activeSavedBlockId =
            String(block.id || "");
        page.openLauncher("saved_detail");
    }

    async function startSavedBlock(
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

        const resolution =
            await resolveQuestionList(
                block.questionIds,
                block.sessionSnapshot,
                block.routeSnapshot?.context ||
                    {}
            );

        if (!resolution.list.length) {
            page.runtimeNotice =
                getSavedBlockResolutionNotice(
                    block,
                    resolution
                );
            page.openLauncher("saved");
            return;
        }

        QuestionsStore.markSavedBlockUsed(
            block.id
        );
        const postStartNotice =
            resolution.source ===
            "snapshot"
                ? getSavedBlockResolutionNotice(
                    block,
                    resolution
                )
                : "";

        page.clearRuntimeNotice();
        await page.startSession({
            sessionList:
                resolution.list,
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

        if (
            postStartNotice &&
            typeof page.render === "function"
        ) {
            page.runtimeNotice =
                postStartNotice;
            page.render();
        }
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

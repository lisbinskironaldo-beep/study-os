export function createQuestionsLauncherViewModels(
    {
        page,
        dependencies
    } = {}
) {
    const {
        QuestionsState,
        QuestionsStore,
        QuestionsContext,
        QuestionsService
    } = dependencies || {};

    function buildLauncherHomeViewModel() {
        const bankStatus =
            page.data.bankStatus;
        const isLoading =
            bankStatus === "loading";
        const isError =
            bankStatus === "error";
        const launcherNotice =
            isError
                ? page.getRuntimeNotice()
                : isLoading
                    ? "Preparando o banco escolar para liberar o treino."
                    : page.getRuntimeNotice();
        const recentRuns =
            QuestionsStore.getRuns({
                status: "in_progress"
            });
        const savedBlocks =
            QuestionsStore.getSavedBlocks();

        return {
            bankStatus,
            isLoading,
            isError,
            launcherNotice,
            recentRuns,
            recentRunsCount:
                recentRuns.length,
            savedBlocks,
            savedBlocksCount:
                savedBlocks.length
        };
    }

    function buildSmartStartViewModel() {
        const bankStatus =
            page.data.bankStatus;
        const startOptions =
            page.getSmartStartOptions();
        const activeCount =
            startOptions.filter(
                (item) =>
                    item.active &&
                    !item.disabled
            ).length;
        const allAvailableActive =
            startOptions
                .filter(
                    (item) => !item.disabled
                )
                .every((item) => item.active);
        const coachHint =
            page.shouldShowCoachHint(
                "smart_start"
            )
                ? page.getCoachHintText(
                    "smart_start"
                )
                : "";

        return {
            bankStatus,
            runtimeNotice:
                page.getRuntimeNotice(),
            startOptions,
            activeCount,
            allAvailableActive,
            coachHint,
            petalClasses: [
                "questions-smart-petal-1",
                "questions-smart-petal-2",
                "questions-smart-petal-3",
                "questions-smart-petal-4"
            ]
        };
    }

    function buildSmartSubjectsViewModel() {
        const bankStatus =
            page.data.bankStatus;
        const subjectOptions =
            page.getSmartSubjectOptions();
        const activeCount =
            subjectOptions.filter(
                (item) => item.active
            ).length;
        const allActive =
            subjectOptions.length > 0 &&
            subjectOptions.every(
                (item) => item.active
            );
        const visibleSubjects =
            subjectOptions.slice(0, 12);
        const totalSubjects =
            visibleSubjects.length || 1;
        const hiddenSubjects =
            Math.max(
                subjectOptions.length -
                    visibleSubjects.length,
                0
            );

        return {
            bankStatus,
            runtimeNotice:
                page.getRuntimeNotice(),
            subjectOptions,
            activeCount,
            allActive,
            visibleSubjects,
            totalSubjects,
            hiddenSubjects
        };
    }

    function buildSmartLauncherViewModel() {
        const ctx =
            QuestionsContext.get();
        const goalOptions =
            QuestionsService.getSmartGoalOptions(
                page
            );
        const preview =
            page.buildSmartRoutePreview();
        const amountOptions =
            page.data.amountOptions;
        const smartProfiles =
            QuestionsStore.getSmartProfiles();
        const savedBlocks =
            QuestionsStore.getSavedBlocks();
        const activeSeries =
            page.getSmartStartOptions()
                .filter(
                    (item) =>
                        item.type === "serie" &&
                        item.active &&
                        !item.disabled
                );
        const activeSubjects =
            page.getSmartSubjectOptions().filter(
                (item) => item.active
            );
        const hiddenSubjectCount =
            Math.max(
                activeSubjects.length - 6,
                0
            );
        const visibleTopics =
            preview.isReady
                ? preview.topics.slice(0, 5)
                : [];
        const hiddenTopicCount =
            preview.isReady
                ? Math.max(
                    preview.topics.length -
                        visibleTopics.length,
                    0
                )
                : 0;

        return {
            launcherView:
                QuestionsState.getLauncherView(),
            runtimeNotice:
                page.getRuntimeNotice(),
            ctx,
            goalOptions,
            preview,
            amountOptions,
            smartProfiles,
            smartProfilesCount:
                smartProfiles.length,
            savedBlocks,
            savedBlocksCount:
                savedBlocks.length,
            activeSeries,
            activeSubjects,
            hiddenSubjectCount,
            visibleTopics,
            hiddenTopicCount
        };
    }

    return {
        buildLauncherHomeViewModel,
        buildSmartStartViewModel,
        buildSmartSubjectsViewModel,
        buildSmartLauncherViewModel
    };
}

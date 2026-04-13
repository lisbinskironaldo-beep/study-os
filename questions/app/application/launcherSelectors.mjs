import { formatSerieLabel } from "../domain/subjectMetadata.mjs";

export function createQuestionsLauncherSelectors(
    {
        page,
        dependencies
    } = {}
) {
    const {
        QuestionsContext,
        QuestionsService
    } = dependencies || {};

    function getSmartStartOptions() {
        const ctx =
            QuestionsContext.get();
        const availableSeries =
            QuestionsService.getSeriesOptions(
                page
            );
        const selectedSeries =
            Array.isArray(
                ctx.smartSelectedSeries
            )
                ? ctx.smartSelectedSeries
                : [];

        return [
            ...availableSeries.map((serie) => ({
                key: String(serie.key),
                label: formatSerieLabel(
                    serie.key
                ),
                type: "serie",
                active:
                    selectedSeries.includes(
                        serie.key
                    ),
                disabled: false,
                note: ""
            })),
            {
                key: "ENEM",
                label: "ENEM",
                type: "base",
                active: false,
                disabled:
                    !page.data.bases.ENEM
                        ?.available,
                note:
                    page.data.bases.ENEM
                        ?.available
                        ? "Base pronta"
                        : "Em breve"
            }
        ];
    }

    function getSelectedSmartSeries() {
        return getSmartStartOptions()
            .filter(
                (item) =>
                    item.type === "serie" &&
                    item.active &&
                    !item.disabled
            )
            .map((item) =>
                Number(item.key)
            )
            .filter((item) =>
                Number.isFinite(item)
            );
    }

    function getSmartSubjectOptions() {
        const ctx =
            QuestionsContext.get();
        const selectedSeries =
            getSelectedSmartSeries();
        const grouped = new Map();

        selectedSeries.forEach((serie) => {
            QuestionsService.getSubjectOptions(
                page,
                serie
            ).forEach((subject) => {
                const current =
                    grouped.get(
                        subject.key
                    ) || {
                        key: subject.key,
                        label: subject.label,
                        count: 0,
                        topicCount: 0,
                        readyQuestionCount: 0,
                        readyTopicCount: 0,
                        hasQuestions: false
                    };

                current.count +=
                    Number(
                        subject.count
                    ) || 0;
                current.topicCount +=
                    Number(
                        subject.topicCount
                    ) || 0;
                current.readyQuestionCount +=
                    Number(
                        subject.readyQuestionCount
                    ) || 0;
                current.readyTopicCount +=
                    Number(
                        subject.readyTopicCount
                    ) || 0;
                current.hasQuestions =
                    current.hasQuestions ||
                    Boolean(
                        subject.hasQuestions
                    );

                grouped.set(
                    subject.key,
                    current
                );
            });
        });

        return [...grouped.values()]
            .sort((left, right) => {
                if (
                    left.hasQuestions !==
                    right.hasQuestions
                ) {
                    return left.hasQuestions
                        ? -1
                        : 1;
                }

                if (
                    left.readyQuestionCount !==
                    right.readyQuestionCount
                ) {
                    return (
                        right.readyQuestionCount -
                        left.readyQuestionCount
                    );
                }

                return left.label.localeCompare(
                    right.label,
                    "pt-BR"
                );
            })
            .map((subject) => {
                const topicOptions =
                    QuestionsService.getSmartSubjectTopicOptions(
                        page,
                        subject.key,
                        ctx
                    );
                const selectedTopicCount =
                    topicOptions.filter(
                        (topic) =>
                            topic.active
                    ).length;
                const excludedTopicCount =
                    Math.max(
                        topicOptions.length -
                            selectedTopicCount,
                        0
                    );

                return {
                    ...subject,
                    active:
                        (
                            ctx.smartSelectedSubjects ||
                            []
                        ).includes(subject.key) &&
                        subject.hasQuestions,
                    disabled:
                        !subject.hasQuestions,
                    topicOptions,
                    selectedTopicCount,
                    excludedTopicCount,
                    hasTopicEditor:
                        topicOptions.length > 1,
                    hasTopicOverrides:
                        excludedTopicCount > 0
                };
            });
    }

    function buildSmartProfilePayload(
        overrides = {}
    ) {
        const ctx =
            QuestionsContext.get();

        return {
            smartGoal:
                ctx.smartGoal ||
                "continue",
            sessionMetric:
                ctx.smartSessionMetric ||
                "quantidade",
            selectedSeries: [
                ...(ctx.smartSelectedSeries ||
                    [])
            ],
            selectedSubjects: [
                ...(ctx.smartSelectedSubjects ||
                    [])
            ],
            excludedSeries: [
                ...(ctx.smartExcludedSeries ||
                    [])
            ],
            excludedBases: [
                ...(ctx.smartExcludedBases ||
                    [])
            ],
            excludedSubjects: [
                ...(ctx.smartExcludedSubjects ||
                    [])
            ],
            excludedTopicsBySubject: {
                ...(
                    ctx.smartExcludedTopicsBySubject ||
                    {}
                )
            },
            preferredAmount:
                Number(
                    ctx.quantidadeQuestoes
                ) || 5,
            questionCount:
                ctx.smartQuestionCount === null
                    ? null
                    : Number(
                        ctx.smartQuestionCount
                    ) || 5,
            timeMinutes:
                ctx.smartTimeMinutes === null
                    ? null
                    : Number(
                        ctx.smartTimeMinutes
                    ) || 15,
            ...overrides
        };
    }

    function getSuggestedSmartProfileName() {
        const ctx =
            QuestionsContext.get();
        const goalLabel =
            page.data.smartGoals?.[
                ctx.smartGoal
            ]?.label ||
            "Continuar";
        const subjects =
            QuestionsService.getSubjectOptions(
                page
            );
        const selectedSubjects =
            (ctx.smartSelectedSubjects || [])
                .map((subjectKey) =>
                    subjects.find(
                        (subject) =>
                            subject.key ===
                            subjectKey
                    )?.label || ""
                )
                .filter(Boolean);
        const selectedSeries =
            (ctx.smartSelectedSeries || []).map(
                (serie) =>
                    formatSerieLabel(
                        serie
                    ).toLowerCase()
            );
        const pieces = [];

        if (selectedSubjects.length) {
            pieces.push(
                selectedSubjects
                    .slice(0, 2)
                    .join(", ")
            );
        }

        if (selectedSeries.length) {
            pieces.push(
                selectedSeries
                    .slice(0, 2)
                    .join(", ")
            );
        }

        return [
            "Treino inteligente",
            goalLabel.toLowerCase(),
            ...pieces
        ].join(" - ");
    }

    function buildSavedBlockName(
        meta = {},
        context = {},
        sourceMode = ""
    ) {
        const customTitle =
            String(
                meta.customTitle || ""
            ).trim();

        if (customTitle) {
            return customTitle;
        }

        const modeLabel =
            sourceMode === "smart"
                ? "Bloco inteligente"
                : "Bloco específico";
        const materia =
            meta.materiaLabel ||
            context.materia ||
            "Matéria";
        const topics =
            Array.isArray(
                meta.topicsLabel
            )
                ? meta.topicsLabel.filter(
                    Boolean
                )
                : [];

        if (topics.length) {
            return `${modeLabel} - ${materia} - ${topics
                .slice(0, 2)
                .join(", ")}`;
        }

        return `${modeLabel} - ${materia}`;
    }

    function buildRunTitle(
        meta = {},
        context = {},
        sourceMode = ""
    ) {
        const customTitle =
            String(
                meta.customTitle || ""
            ).trim();

        if (customTitle) {
            return customTitle;
        }

        const modeLabel =
            sourceMode === "smart"
                ? "Treino inteligente"
                : "Treino específico";
        const materia =
            meta.materiaLabel ||
            context.materia ||
            "Matéria";
        const topics =
            Array.isArray(
                meta.topicsLabel
            )
                ? meta.topicsLabel.filter(
                    Boolean
                )
                : [];

        if (topics.length) {
            return `${modeLabel} - ${materia} - ${topics
                .slice(0, 2)
                .join(", ")}`;
        }

        return `${modeLabel} - ${materia}`;
    }

    return {
        getSmartStartOptions,
        getSelectedSmartSeries,
        getSmartSubjectOptions,
        buildSmartProfilePayload,
        getSuggestedSmartProfileName,
        buildSavedBlockName,
        buildRunTitle
    };
}

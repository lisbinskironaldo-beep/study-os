function normalizeQuestionIds(
    questionIds = []
) {
    return Array.isArray(questionIds)
        ? questionIds
            .map((questionId) =>
                String(questionId || "")
                    .trim()
            )
            .filter(Boolean)
        : [];
}

function normalizeSessionSnapshot(
    questionIds = [],
    sessionSnapshot = []
) {
    if (questionIds.length) {
        return [];
    }

    return Array.isArray(sessionSnapshot)
        ? [...sessionSnapshot]
        : [];
}

export function normalizeRunRecord(
    run = {}
) {
    const now = Date.now();
    const questionIds =
        normalizeQuestionIds(
            run.questionIds
        );

    return {
        id:
            String(run.id || "").trim() ||
            `run_${now}`,
        mode:
            String(
                run.mode || "specific"
            ).trim() || "specific",
        status:
            String(
                run.status || "in_progress"
            ).trim() || "in_progress",
        title:
            String(run.title || "Treino")
                .trim() || "Treino",
        createdAt:
            Number(run.createdAt) || now,
        updatedAt:
            Number(run.updatedAt) || now,
        completedAt:
            Number(run.completedAt) || 0,
        routeSnapshot:
            run.routeSnapshot &&
            typeof run.routeSnapshot ===
                "object"
                ? { ...run.routeSnapshot }
                : {},
        questionIds,
        sessionSnapshot:
            normalizeSessionSnapshot(
                questionIds,
                run.sessionSnapshot
            ),
        currentIndex:
            Number(run.currentIndex) || 0,
        answers: Array.isArray(run.answers)
            ? [...run.answers]
            : [],
        lastAnswer:
            run.lastAnswer || null,
        summary:
            run.summary &&
            typeof run.summary === "object"
                ? { ...run.summary }
                : null,
        profileId:
            String(run.profileId || "")
                .trim(),
        savedBlockId:
            String(run.savedBlockId || "")
                .trim(),
        startedAt:
            Number(run.startedAt) || now
    };
}

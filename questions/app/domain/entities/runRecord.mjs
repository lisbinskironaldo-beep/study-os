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

function normalizeAnswerRecord(
    answer = null
) {
    if (
        !answer ||
        typeof answer !== "object"
    ) {
        return null;
    }

    const question =
        answer.question &&
        typeof answer.question === "object"
            ? answer.question
            : {};

    return {
        correct: Boolean(answer.correct),
        selectedIndex:
            answer.selectedIndex ?? null,
        selectedValue:
            Object.prototype.hasOwnProperty.call(
                answer,
                "selectedValue"
            )
                ? answer.selectedValue
                : null,
        selectedAnswerLabel:
            String(
                answer.selectedAnswerLabel || ""
            ).trim(),
        correctAnswerLabel:
            String(
                answer.correctAnswerLabel || ""
            ).trim(),
        timeMs:
            Number(answer.timeMs) || 0,
        questionId:
            String(
                answer.questionId ||
                    question.id ||
                    ""
            ).trim(),
        baseKey:
            String(
                answer.baseKey ||
                    question.baseKey ||
                    ""
            ).trim(),
        baseLabel:
            String(
                answer.baseLabel ||
                    question.baseLabel ||
                    ""
            ).trim(),
        subjectKey:
            String(
                answer.subjectKey ||
                    question.subjectKey ||
                    ""
            ).trim(),
        subjectLabel:
            String(
                answer.subjectLabel ||
                    question.subjectLabel ||
                    ""
            ).trim(),
        topicKey:
            String(
                answer.topicKey ||
                    question.topicKey ||
                    ""
            ).trim(),
        topicLabel:
            String(
                answer.topicLabel ||
                    question.topicLabel ||
                    ""
            ).trim()
    };
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
            ? run.answers
                  .map((answer) =>
                      normalizeAnswerRecord(
                          answer
                      )
                  )
                  .filter(Boolean)
            : [],
        lastAnswer:
            normalizeAnswerRecord(
                run.lastAnswer
            ),
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

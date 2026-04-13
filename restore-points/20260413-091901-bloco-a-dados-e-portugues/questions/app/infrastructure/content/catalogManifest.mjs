function slugify(value) {
    return String(value || "")
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "_")
        .replace(/^_+|_+$/g, "");
}

export function normalizeCatalogTopic(
    topic = {},
    options = {}
) {
    const topicId = String(
        topic.id || ""
    ).trim();
    const questions = Array.isArray(
        topic.questoes
    )
        ? topic.questoes
        : [];
    const readyQuestionCount =
        questions.filter((question) =>
            String(
                question?.enunciado || ""
            ).trim()
        ).length;
    const series = Array.isArray(topic.serie)
        ? topic.serie
              .map((item) =>
                  Number(item)
              )
              .filter((item) =>
                  Number.isFinite(item)
              )
        : [];
    const sourceMeta =
        options.topicMetaById?.[topicId] ||
        {};

    return {
        id: topicId,
        subjectKey: slugify(topic.materia),
        materia: String(
            topic.materia || ""
        ).trim(),
        topico: String(
            topic.topico || ""
        ).trim(),
        serie: series,
        totalQuestionCount: questions.length,
        readyQuestionCount,
        hasQuestions:
            readyQuestionCount > 0,
        path:
            String(
                sourceMeta.path || ""
            ).trim(),
        updatedAt:
            String(
                sourceMeta.updatedAt || ""
            ).trim(),
        seloEditorial: String(
            topic?.metadados
                ?.seloEditorial || ""
        )
            .trim()
            .toUpperCase(),
        base: String(
            topic?.metadados?.base ||
                "ESCOLAR"
        )
            .trim()
            .toUpperCase()
    };
}

export function buildQuestionsCatalogManifest(
    catalog = [],
    options = {}
) {
    const topics = (
        Array.isArray(catalog) ? catalog : []
    ).map((topic) =>
        normalizeCatalogTopic(
            topic,
            options
        )
    );
    const subjectsMap = new Map();
    const questionIndex = {};

    (
        Array.isArray(catalog) ? catalog : []
    ).forEach((topic = {}) => {
        const topicId = String(
            topic.id || ""
        ).trim();

        if (!topicId) {
            return;
        }

        (Array.isArray(topic.questoes)
            ? topic.questoes
            : []
        ).forEach((question = {}) => {
            const questionId = String(
                question.id || ""
            ).trim();
            const hasPrompt = String(
                question?.enunciado || ""
            ).trim();

            if (
                !questionId ||
                !hasPrompt
            ) {
                return;
            }

            questionIndex[questionId] =
                topicId;
        });
    });

    topics.forEach((topic) => {
        topic.serie.forEach((serie) => {
            const key =
                `${serie}::${topic.subjectKey}`;
            const current =
                subjectsMap.get(key) || {
                    serie,
                    subjectKey:
                        topic.subjectKey,
                    materia: topic.materia,
                    topicCount: 0,
                    readyTopicCount: 0,
                    readyQuestionCount: 0
                };

            current.topicCount += 1;
            current.readyTopicCount +=
                topic.hasQuestions ? 1 : 0;
            current.readyQuestionCount +=
                topic.readyQuestionCount;

            if (
                topic.hasQuestions &&
                current.materia !==
                    topic.materia
            ) {
                current.materia =
                    topic.materia;
            }

            subjectsMap.set(key, current);
        });
    });

    return {
        generatedAt:
            new Date().toISOString(),
        totals: {
            topics: topics.length,
            readyTopics: topics.filter(
                (topic) => topic.hasQuestions
            ).length,
            questions: topics.reduce(
                (acc, topic) =>
                    acc +
                    topic.readyQuestionCount,
                0
            )
        },
        subjects: [...subjectsMap.values()].sort(
            (left, right) =>
                left.serie - right.serie ||
                left.materia.localeCompare(
                    right.materia,
                    "pt-BR"
                )
        ),
        questionIndex,
        topics: topics.sort(
            (left, right) =>
                (left.serie[0] || 0) -
                    (right.serie[0] || 0) ||
                left.materia.localeCompare(
                    right.materia,
                    "pt-BR"
                ) ||
                left.topico.localeCompare(
                    right.topico,
                    "pt-BR"
                )
        )
    };
}

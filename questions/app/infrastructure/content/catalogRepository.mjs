function buildRuntimeUrl(
    runtimeBaseUrl,
    relativePath
) {
    return new URL(
        relativePath,
        runtimeBaseUrl
    ).href;
}

export function resolveCatalogRuntimeUrls(
    runtimeBaseUrl
) {
    return {
        manifestUrl: buildRuntimeUrl(
            runtimeBaseUrl,
            "./content/generated/catalog-manifest.json"
        ),
        bankUrl: buildRuntimeUrl(
            runtimeBaseUrl,
            "./banks/index.js"
        )
    };
}

export async function loadCatalogManifest(
    runtimeBaseUrl
) {
    const { manifestUrl } =
        resolveCatalogRuntimeUrls(
            runtimeBaseUrl
        );

    try {
        const response = await fetch(
            manifestUrl,
            {
                cache: "no-store"
            }
        );

        if (!response.ok) {
            return null;
        }

        return await response.json();
    } catch (_error) {
        return null;
    }
}

export async function loadCatalogModule(
    runtimeBaseUrl
) {
    const { bankUrl } =
        resolveCatalogRuntimeUrls(
            runtimeBaseUrl
        );
    const module = await import(bankUrl);

    return Array.isArray(
        module.questionsDB
    )
        ? [...module.questionsDB]
        : [];
}

function slugify(value) {
    return String(value || "")
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "_")
        .replace(/^_+|_+$/g, "");
}

function resolveCorrectValue(
    type,
    correct
) {
    if (type === "vf") {
        return correct === true
            ? 0
            : 1;
    }

    return correct;
}

function mapQuestionRecord(
    topicRecord = {},
    question = {},
    index = 0
) {
    const subjectKey =
        slugify(topicRecord.materia);
    const topicKey =
        topicRecord.id ||
        slugify(topicRecord.topico);
    const type =
        question.tipo ||
        "multipla_escolha";
    const metadados =
        topicRecord?.metadados || {};
    const baseKey = String(
        question.base ||
            metadados.base ||
            "ESCOLAR"
    ).toUpperCase();
    const subtopicLabel =
        question.subtopico || "";

    return {
        id:
            question.id ||
            `${topicKey}_${index + 1}`,
        baseKey,
        baseLabel:
            baseKey === "ENEM"
                ? "ENEM"
                : "Escolar",
        serie:
            Array.isArray(question.serie) &&
            question.serie.length
                ? [...question.serie]
                : [...(topicRecord.serie || [])],
        subjectKey,
        subjectLabel: topicRecord.materia,
        topicKey,
        topicLabel: topicRecord.topico,
        subtopicKey:
            slugify(subtopicLabel),
        subtopicLabel,
        axisLabel: String(
            metadados.eixo || ""
        ).trim(),
        frontLabel: String(
            metadados.frente || ""
        ).trim(),
        type,
        prompt:
            question.enunciado || "",
        options: Array.isArray(
            question.opcoes
        )
            ? [...question.opcoes]
            : [],
        correct: resolveCorrectValue(
            type,
            question.correta
        ),
        explanation:
            question.comentario || "",
        difficultyLabel:
            question.dificuldadeLabel ||
            "facil",
        difficulty:
            Number(
                question.dificuldadeNivel ||
                    1
            ) || 1,
        cognition:
            question.cognicao ||
            "calculo",
        expectedTime:
            Number(
                question.tempoEstimado ||
                    25
            ) || 25,
        tags: Array.isArray(question.tags)
            ? [...question.tags]
            : [],
        abilities: Array.isArray(
            question.habilidades
        )
            ? [...question.habilidades]
            : [],
        collections: Array.isArray(
            question.collections
        )
            ? [...question.collections]
            : ["questions"],
        sourceType:
            question.sourceType ||
            "original",
        sourceYear:
            Number(
                question.sourceYear
            ) || null,
        sourceExam:
            question.sourceExam || "",
        competencies: Array.isArray(
            question.competencies
        )
            ? [...question.competencies]
            : [],
        status:
            question.status ||
            "rascunho"
    };
}

export function createCatalogContentRepository(
    catalog = []
) {
    const safeCatalog = Array.isArray(catalog)
        ? [...catalog]
        : [];
    const questions = [];

    safeCatalog.forEach((topicRecord) => {
        (topicRecord?.questoes || []).forEach(
            (question, index) => {
                const mapped =
                    mapQuestionRecord(
                        topicRecord,
                        question,
                        index
                    );

                if (
                    !String(
                        mapped.prompt || ""
                    ).trim()
                ) {
                    return;
                }

                questions.push(mapped);
            }
        );
    });

    const questionMap = new Map(
        questions.map((question) => [
            String(question.id),
            { ...question }
        ])
    );

    return {
        getCatalog() {
            return [...safeCatalog];
        },

        listQuestions() {
            return questions.map(
                (question) => ({
                    ...question
                })
            );
        },

        findQuestionById(questionId) {
            const match =
                questionMap.get(
                    String(questionId)
                ) || null;

            return match
                ? { ...match }
                : null;
        },

        findQuestionsByIds(
            questionIds = []
        ) {
            return (
                Array.isArray(questionIds)
                    ? questionIds
                    : []
            )
                .map((questionId) =>
                    this.findQuestionById(
                        questionId
                    )
                )
                .filter(Boolean);
        }
    };
}

export async function loadCatalogBundle(
    runtimeBaseUrl
) {
    const [manifest, catalog] =
        await Promise.all([
            loadCatalogManifest(
                runtimeBaseUrl
            ),
            loadCatalogModule(
                runtimeBaseUrl
            )
        ]);

    return {
        manifest,
        catalog,
        contentRepository:
            createCatalogContentRepository(
                catalog
            )
    };
}

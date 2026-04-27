import {
    getCanonicalSubjectMetadata,
    slugify
} from "../../domain/subjectMetadata.mjs";

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

function resolveTopicRuntimePath(
    topicPath = ""
) {
    const normalized = String(
        topicPath || ""
    )
        .replace(/\\/g, "/")
        .trim();

    if (!normalized) {
        return "";
    }

    if (
        normalized.startsWith("./") ||
        normalized.startsWith("../")
    ) {
        return normalized;
    }

    if (
        normalized.startsWith("questions/")
    ) {
        return `./${normalized.slice(
            "questions/".length
        )}`;
    }

    return `./${normalized.replace(
        /^\/+/,
        ""
    )}`;
}

function extractTopicRecord(
    moduleNamespace = {}
) {
    if (
        moduleNamespace &&
        typeof moduleNamespace.default ===
            "object" &&
        Array.isArray(
            moduleNamespace.default.questoes
        )
    ) {
        return moduleNamespace.default;
    }

    const exportedValues = Object.values(
        moduleNamespace || {}
    );

    return (
        exportedValues.find(
            (value) =>
                value &&
                typeof value === "object" &&
                Array.isArray(value.questoes)
        ) || null
    );
}

export async function loadCatalogTopicModule(
    runtimeBaseUrl,
    topicPath
) {
    const runtimePath =
        resolveTopicRuntimePath(topicPath);

    if (!runtimePath) {
        return null;
    }

    const moduleUrl = buildRuntimeUrl(
        runtimeBaseUrl,
        runtimePath
    );
    const module = await import(moduleUrl);
    const topicRecord =
        extractTopicRecord(module);

    return topicRecord
        ? cloneValue(topicRecord)
        : null;
}

function cloneValue(value) {
    if (
        typeof globalThis.structuredClone ===
        "function"
    ) {
        return globalThis.structuredClone(value);
    }

    return JSON.parse(
        JSON.stringify(value)
    );
}

function normalizeText(value) {
    return String(value || "")
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .trim();
}

function resolveChoiceCorrectIndex(
    correct,
    options = []
) {
    if (
        Number.isInteger(correct)
    ) {
        return correct;
    }

    const numericCorrect =
        Number(correct);

    if (
        Number.isInteger(
            numericCorrect
        ) &&
        String(correct).trim() !== ""
    ) {
        return numericCorrect;
    }

    const normalizedCorrect =
        normalizeText(correct);

    if (!normalizedCorrect) {
        return correct;
    }

    const optionIndex =
        (Array.isArray(options)
            ? options
            : []
        ).findIndex(
            (option) =>
                normalizeText(option) ===
                normalizedCorrect
        );

    return optionIndex >= 0
        ? optionIndex
        : correct;
}

function resolveCorrectValue(
    type,
    correct,
    options = []
) {
    if (type === "vf") {
        return correct === true
            ? 0
            : 1;
    }

    if (
        type === "multipla_escolha" ||
        type === "comparacao"
    ) {
        return resolveChoiceCorrectIndex(
            correct,
            options
        );
    }

    return correct;
}

function mapQuestionRecord(
    topicRecord = {},
    question = {},
    index = 0
) {
    const subjectMeta =
        getCanonicalSubjectMetadata(
            topicRecord.materia
        );
    const subjectKey =
        subjectMeta.key;
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
        subjectLabel:
            subjectMeta.label,
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
            question.correta,
            question.opcoes
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

function createCatalogState() {
    return {
        catalogByTopic: new Map(),
        questionMap: new Map(),
        topicQuestionIds: new Map(),
        loadedTopicIds: new Set(),
        loaded: false,
        loadingPromise: null,
        topicLoadingPromises: new Map()
    };
}

function addTopicRecordToState(
    state,
    topicRecord = {},
    explicitTopicId = ""
) {
    const safeTopic =
        topicRecord &&
        typeof topicRecord === "object"
            ? cloneValue(topicRecord)
            : null;

    if (!safeTopic) {
        return;
    }

    const topicId = String(
        explicitTopicId ||
            safeTopic.id ||
            slugify(safeTopic.topico)
    );

    if (!topicId) {
        return;
    }

    if (!safeTopic.id) {
        safeTopic.id = topicId;
    }

    const previousQuestionIds =
        state.topicQuestionIds.get(topicId) ||
        [];

    previousQuestionIds.forEach(
        (questionId) => {
            state.questionMap.delete(
                String(questionId)
            );
        }
    );

    const nextQuestionIds = [];

    (safeTopic.questoes || []).forEach(
        (question, index) => {
            const mapped =
                mapQuestionRecord(
                    safeTopic,
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

            const questionId = String(
                mapped.id
            );
            nextQuestionIds.push(
                questionId
            );
            state.questionMap.set(
                questionId,
                mapped
            );
        }
    );

    state.catalogByTopic.set(
        topicId,
        safeTopic
    );
    state.topicQuestionIds.set(
        topicId,
        nextQuestionIds
    );
    state.loadedTopicIds.add(topicId);
}

function resetCatalogState(state) {
    state.catalogByTopic = new Map();
    state.questionMap = new Map();
    state.topicQuestionIds = new Map();
    state.loadedTopicIds = new Set();
}

function hydrateCatalogState(
    state,
    catalog = []
) {
    const safeCatalog = Array.isArray(catalog)
        ? cloneValue(catalog)
        : [];

    resetCatalogState(state);
    safeCatalog.forEach((topicRecord) => {
        addTopicRecordToState(
            state,
            topicRecord
        );
    });
    state.loaded = true;
}

function getCatalogSnapshot(state) {
    return [
        ...state.catalogByTopic.values()
    ].map((topicRecord) =>
        cloneValue(topicRecord)
    );
}

export function createCatalogContentRepository(
    {
        runtimeBaseUrl,
        manifest = null,
        catalog = []
    } = {}
) {
    const state =
        createCatalogState();
    const manifestTopics = Array.isArray(
        manifest?.topics
    )
        ? manifest.topics
        : [];
    const manifestQuestionIndex =
        manifest &&
        typeof manifest.questionIndex ===
            "object"
            ? manifest.questionIndex
            : {};
    const manifestTopicMap = new Map(
        manifestTopics.map((topic) => [
            String(
                topic?.id ||
                    slugify(topic?.topico)
            ),
            cloneValue(topic)
        ])
    );
    const manifestQuestionTopicMap =
        new Map(
            Object.entries(
                manifestQuestionIndex
            ).map(
                ([questionId, topicId]) => [
                    String(
                        questionId || ""
                    ).trim(),
                    String(
                        topicId || ""
                    ).trim()
                ]
            )
        );

    if (
        Array.isArray(catalog) &&
        catalog.length
    ) {
        hydrateCatalogState(
            state,
            catalog
        );
    }

    async function ensureCatalogLoaded() {
        if (state.loaded) {
            return getCatalogSnapshot(state);
        }

        if (state.loadingPromise) {
            return state.loadingPromise;
        }

        state.loadingPromise = (async () => {
            const loadedCatalog =
                await loadCatalogModule(
                    runtimeBaseUrl
                );

            hydrateCatalogState(
                state,
                loadedCatalog
            );

            return getCatalogSnapshot(
                state
            );
        })();

        try {
            return await state.loadingPromise;
        } finally {
            state.loadingPromise = null;
        }
    }

    async function ensureTopicLoaded(
        topicId
    ) {
        if (
            state.loadedTopicIds.has(topicId)
        ) {
            return;
        }

        if (
            state.topicLoadingPromises.has(
                topicId
            )
        ) {
            await state.topicLoadingPromises.get(
                topicId
            );
            return;
        }

        const manifestTopic =
            manifestTopicMap.get(
                String(topicId)
            ) || null;

        if (
            !manifestTopic?.path ||
            !runtimeBaseUrl
        ) {
            await ensureCatalogLoaded();
            return;
        }

        const loadingPromise = (async () => {
            try {
                const loadedTopic =
                    await loadCatalogTopicModule(
                        runtimeBaseUrl,
                        manifestTopic.path
                    );

                if (!loadedTopic) {
                    await ensureCatalogLoaded();
                    return;
                }

                addTopicRecordToState(
                    state,
                    loadedTopic,
                    topicId
                );
            } catch (_error) {
                await ensureCatalogLoaded();
            }
        })();

        state.topicLoadingPromises.set(
            topicId,
            loadingPromise
        );

        try {
            await loadingPromise;
        } finally {
            state.topicLoadingPromises.delete(
                topicId
            );
        }
    }

    async function ensureTopicsLoaded(
        topicIds = []
    ) {
        if (state.loaded) {
            return getCatalogSnapshot(state);
        }

        const requestedTopicIds = [
            ...new Set(
                (
                    Array.isArray(topicIds)
                        ? topicIds
                        : []
                )
                    .map((topicId) =>
                        String(
                            topicId || ""
                        ).trim()
                    )
                    .filter(Boolean)
            )
        ];

        if (!requestedTopicIds.length) {
            return getCatalogSnapshot(state);
        }

        const hasMissingManifestTopic =
            requestedTopicIds.some(
                (topicId) =>
                    !manifestTopicMap.has(
                        topicId
                    )
            );

        if (hasMissingManifestTopic) {
            return ensureCatalogLoaded();
        }

        await Promise.all(
            requestedTopicIds.map((topicId) =>
                ensureTopicLoaded(topicId)
            )
        );

        return getCatalogSnapshot(state);
    }

    function resolveTopicIdsForQuestionIds(
        questionIds = [],
        providedTopicIds = []
    ) {
        const directTopicIds = [
            ...new Set(
                (
                    Array.isArray(
                        providedTopicIds
                    )
                        ? providedTopicIds
                        : []
                )
                    .map((topicId) =>
                        String(
                            topicId || ""
                        ).trim()
                    )
                    .filter(Boolean)
            )
        ];

        if (directTopicIds.length) {
            return directTopicIds;
        }

        return [
            ...new Set(
                (
                    Array.isArray(questionIds)
                        ? questionIds
                        : []
                )
                    .map((questionId) =>
                        manifestQuestionTopicMap.get(
                            String(
                                questionId || ""
                            ).trim()
                        ) || ""
                    )
                    .filter(Boolean)
            )
        ];
    }

    function findQuestionById(
        questionId
    ) {
        const match =
            state.questionMap.get(
                String(questionId)
            ) || null;

        return match
            ? cloneValue(match)
            : null;
    }

    function findQuestionsByIds(
        questionIds = []
    ) {
        return (
            Array.isArray(questionIds)
                ? questionIds
                : []
        )
            .map((questionId) =>
                findQuestionById(
                    questionId
                )
            )
            .filter(Boolean);
    }

    return {
        getManifest() {
            return manifest
                ? cloneValue(manifest)
                : null;
        },

        isCatalogLoaded() {
            return state.loaded;
        },

        async ensureCatalogLoaded() {
            return ensureCatalogLoaded();
        },

        async ensureTopicsLoaded(
            topicIds = []
        ) {
            return ensureTopicsLoaded(
                topicIds
            );
        },

        getCatalog() {
            return getCatalogSnapshot(
                state
            );
        },

        listQuestions() {
            return [...state.questionMap.values()].map(
                (question) =>
                    cloneValue(question)
            );
        },

        findQuestionById,

        async findQuestionByIdAsync(
            questionId,
            options = {}
        ) {
            if (
                !state.questionMap.has(
                    String(questionId)
                )
            ) {
                await ensureTopicsLoaded(
                    resolveTopicIdsForQuestionIds(
                        [questionId],
                        options.topicIds
                    )
                );
            }

            if (
                !state.questionMap.has(
                    String(questionId)
                ) &&
                !state.loaded
            ) {
                await ensureCatalogLoaded();
            }

            return findQuestionById(
                questionId
            );
        },

        findQuestionsByIds,

        async findQuestionsByIdsAsync(
            questionIds = [],
            options = {}
        ) {
            const ids = Array.isArray(
                questionIds
            )
                ? questionIds
                    .map((questionId) =>
                        String(
                            questionId || ""
                        ).trim()
                    )
                    .filter(Boolean)
                : [];
            const unresolvedIds =
                ids.filter(
                    (questionId) =>
                        !state.questionMap.has(
                            questionId
                        )
                );

            if (unresolvedIds.length) {
                await ensureTopicsLoaded(
                    resolveTopicIdsForQuestionIds(
                        ids,
                        options.topicIds
                    )
                );
            }

            const stillUnresolvedIds =
                ids.filter(
                    (questionId) =>
                        !state.questionMap.has(
                            questionId
                        )
                );

            if (
                stillUnresolvedIds.length &&
                !state.loaded
            ) {
                await ensureCatalogLoaded();
            }

            return findQuestionsByIds(
                questionIds
            );
        }
    };
}

export async function loadCatalogBundle(
    runtimeBaseUrl,
    options = {}
) {
    const preloadCatalog =
        options.preloadCatalog === true;
    const manifest =
        await loadCatalogManifest(
            runtimeBaseUrl
        );
    const shouldLoadCatalog =
        preloadCatalog || !manifest;
    const catalog =
        shouldLoadCatalog
            ? await loadCatalogModule(
                runtimeBaseUrl
            )
            : [];

    return {
        manifest,
        catalog,
        contentRepository:
            createCatalogContentRepository(
                {
                    runtimeBaseUrl,
                    manifest,
                    catalog
                }
            )
    };
}

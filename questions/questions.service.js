window.QuestionsService = {
    shuffle(list) {
        return [...(list || [])].sort(
            () => Math.random() - 0.5
        );
    },

    slugify(value) {
        return String(value || "")
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "_")
            .replace(/^_+|_+$/g, "");
    },

    normalizeText(value) {
        return String(value ?? "")
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .toLowerCase()
            .trim()
            .replace(/\s+/g, " ");
    },

    formatTime(ms) {
        const totalSeconds =
            Math.max(
                Math.round((ms || 0) / 1000),
                0
            );
        const minutes =
            Math.floor(totalSeconds / 60);
        const seconds =
            totalSeconds % 60;

        if (minutes <= 0) {
            return `${seconds}s`;
        }

        return `${minutes}m ${String(seconds).padStart(2, "0")}s`;
    },

    getModeOptions(page) {
        return Object.values(
            page.data.modes || {}
        );
    },

    getBaseOptions(page) {
        return Object.values(
            page.data.bases || {}
        );
    },

    getSmartGoalOptions(page) {
        return Object.values(
            page.data.smartGoals || {}
        );
    },

    getAllowedMixStrategyKeys(modeKey) {
        if (modeKey === "ASSUNTO_UNICO") {
            return ["equilibrada"];
        }

        if (
            modeKey ===
            "ASSUNTOS_COMBINADOS"
        ) {
            return [
                "equilibrada",
                "alternada",
                "adaptativa"
            ];
        }

        if (
            modeKey ===
            "REFORCO_DIRECIONADO"
        ) {
            return [
                "foco_principal",
                "adaptativa"
            ];
        }

        return [
            "equilibrada",
            "alternada",
            "adaptativa"
        ];
    },

    getMixStrategies(
        page,
        modeKey = null
    ) {
        const ctx =
            QuestionsContext.get();
        const targetMode =
            modeKey || ctx.mode;
        const allowed =
            new Set(
                this.getAllowedMixStrategyKeys(
                    targetMode
                )
            );

        return Object.values(
            page.data.mixStrategies || {}
        ).filter((strategy) =>
            allowed.has(strategy.key)
        );
    },

    getCatalog(page) {
        return Array.isArray(
            page.data.schoolCatalog
        )
            ? page.data.schoolCatalog
            : [];
    },

    getTopicBaseKey(topicRecord) {
        return String(
            topicRecord?.metadados?.base ||
                "ESCOLAR"
        )
            .trim()
            .toUpperCase();
    },

    getTopicQuestionCount(topicRecord) {
        return Array.isArray(
            topicRecord?.questoes
        )
            ? topicRecord.questoes.filter(
                (question) =>
                    String(
                        question?.enunciado || ""
                    ).trim()
            ).length
            : 0;
    },

    getSeriesOptions(page) {
        const found = new Set();

        this.getCatalog(page).forEach((topic) => {
            (topic?.serie || []).forEach((serie) => {
                if (Number.isFinite(Number(serie))) {
                    found.add(Number(serie));
                }
            });
        });

        return [...found]
            .sort((left, right) => left - right)
            .map((serie) => ({
                key: serie,
                label: `${serie}a serie`
            }));
    },

    getSubjectOptions(page, serie = null) {
        const targetSerie =
            Number(serie) || null;
        const grouped = new Map();

        this.getCatalog(page).forEach((topic) => {
            if (
                targetSerie &&
                !topic?.serie?.includes(targetSerie)
            ) {
                return;
            }

            const subjectKey =
                this.slugify(topic.materia);
            const current =
                grouped.get(subjectKey) || {
                    key: subjectKey,
                    label: topic.materia,
                    count: 0,
                    topicCount: 0
                };

            current.count +=
                Array.isArray(topic.questoes)
                    ? topic.questoes.length
                    : 0;
            current.topicCount += 1;

            grouped.set(subjectKey, current);
        });

        return [...grouped.values()]
            .sort((left, right) =>
                left.label.localeCompare(
                    right.label,
                    "pt-BR"
                )
            );
    },

    getTopicRecords(page, filters = {}) {
        const targetSerie =
            Number(filters.serie) || null;
        const targetMateria =
            String(filters.materia || "").trim();

        return this.getCatalog(page).filter((topic) => {
            if (
                targetSerie &&
                !topic?.serie?.includes(targetSerie)
            ) {
                return false;
            }

            if (
                targetMateria &&
                this.slugify(topic.materia) !==
                    targetMateria
            ) {
                return false;
            }

            return true;
        });
    },

    getTopicOptions(page, filters = {}) {
        return this.getTopicRecords(
            page,
            filters
        ).map((topic) => {
            const questionCount =
                this.getTopicQuestionCount(
                    topic
                );
            const topicQuestions =
                Array.isArray(topic.questoes)
                    ? topic.questoes
                    : [];
            const metadados =
                topic?.metadados || {};
            const subjectKey =
                this.slugify(topic.materia);
            const baseKey =
                this.getTopicBaseKey(topic);
            const subtopics =
                [
                    ...(Array.isArray(
                        metadados.subtopicosBase
                    )
                        ? metadados.subtopicosBase
                        : []),
                    ...topicQuestions.map(
                        (question) =>
                            question?.subtopico || ""
                    )
                ].filter(Boolean);
            const uniqueSubtopics =
                [...new Set(subtopics)];
            const aliases =
                Array.isArray(
                    metadados.searchAliases
                )
                    ? metadados.searchAliases
                    : [];
            const eixo =
                String(
                    metadados.eixo || ""
                ).trim();
            const frente =
                String(
                    metadados.frente || ""
                ).trim();
            const searchIndex = this.normalizeText(
                [
                    topic.topico,
                    topic.materia,
                    eixo,
                    frente,
                    ...uniqueSubtopics,
                    ...aliases
                ].join(" ")
            );

            return {
                key:
                    topic.id ||
                    this.slugify(topic.topico),
                label: topic.topico,
                serie: Array.isArray(topic.serie)
                    ? [...topic.serie]
                    : [],
                subjectKey,
                subjectLabel:
                    topic.materia,
                baseKey,
                count: questionCount,
                hasQuestions:
                    questionCount > 0,
                subtopicCount:
                    uniqueSubtopics.length,
                subtopicsPreview:
                    uniqueSubtopics.slice(0, 3),
                eixo,
                frente,
                searchIndex
            };
        });
    },

    getSmartEligibleTopicOptions(
        page,
        context = null
    ) {
        const ctx =
            context ||
            QuestionsContext.get();
        const selectedSeries =
            new Set(
                (ctx.smartSelectedSeries || [])
                    .map((item) =>
                        Number(item)
                    )
                    .filter((item) =>
                        Number.isFinite(item)
                    )
            );
        const selectedSubjects =
            new Set(
                (ctx.smartSelectedSubjects || [])
                    .map((item) =>
                        String(item || "")
                            .trim()
                            .toLowerCase()
                    )
                    .filter(Boolean)
            );
        const excludedSeries =
            new Set(
                (ctx.smartExcludedSeries || [])
                    .map((item) =>
                        Number(item)
                    )
                    .filter((item) =>
                        Number.isFinite(item)
                    )
            );
        const excludedBases =
            new Set(
                (ctx.smartExcludedBases || [])
                    .map((item) =>
                        String(item || "")
                            .trim()
                            .toUpperCase()
                    )
                    .filter(Boolean)
            );
        const excludedSubjects =
            new Set(
                (ctx.smartExcludedSubjects || [])
                    .map((item) =>
                        String(item || "")
                            .trim()
                            .toLowerCase()
                    )
                    .filter(Boolean)
            );
        const availableBases =
            new Set(
                this.getBaseOptions(page)
                    .filter(
                        (base) =>
                            base.available
                    )
                    .map((base) => base.key)
            );

        return this.getTopicOptions(page, {})
            .filter((topic) => {
                if (!topic.hasQuestions) {
                    return false;
                }

                if (
                    !availableBases.has(
                        topic.baseKey
                    )
                ) {
                    return false;
                }

                if (
                    selectedSeries.size &&
                    !topic.serie.some((serie) =>
                        selectedSeries.has(
                            Number(serie)
                        )
                    )
                ) {
                    return false;
                }

                if (
                    excludedBases.has(
                        topic.baseKey
                    )
                ) {
                    return false;
                }

                if (
                    selectedSubjects.size &&
                    !selectedSubjects.has(
                        topic.subjectKey
                    )
                ) {
                    return false;
                }

                if (
                    excludedSubjects.has(
                        topic.subjectKey
                    )
                ) {
                    return false;
                }

                const topicSeries =
                    Array.isArray(topic.serie)
                        ? topic.serie
                        : [];

                if (
                    topicSeries.length &&
                    !topicSeries.some(
                        (serie) =>
                            !excludedSeries.has(
                                Number(serie)
                            )
                    )
                ) {
                    return false;
                }

                return true;
            })
            .map((topic) => ({
                ...topic,
                primarySerie:
                    Array.isArray(
                        topic.serie
                    ) &&
                    topic.serie.length
                        ? Number(
                            topic.serie[0]
                        )
                        : 0
            }));
    },

    getSmartLauncherValidation(
        page,
        context = null
    ) {
        const ctx =
            context ||
            QuestionsContext.get();
        const availableBases =
            this.getBaseOptions(page).filter(
                (base) => base.available
            );
        const eligibleTopics =
            this.getSmartEligibleTopicOptions(
                page,
                ctx
            );
        const eligibleSeries =
            [
                ...new Set(
                    eligibleTopics.flatMap(
                        (topic) =>
                            Array.isArray(
                                topic.serie
                            )
                                ? topic.serie
                                : []
                    )
                )
            ].sort(
                (left, right) =>
                    Number(left) -
                    Number(right)
            );
        const eligibleSubjects =
            [
                ...new Map(
                    eligibleTopics.map(
                        (topic) => [
                            topic.subjectKey,
                            {
                                key:
                                    topic.subjectKey,
                                label:
                                    topic.subjectLabel
                            }
                        ]
                    )
                ).values()
            ].sort((left, right) =>
                left.label.localeCompare(
                    right.label,
                    "pt-BR"
                )
            );
        const eligibleQuestionCount =
            eligibleTopics.reduce(
                (acc, topic) =>
                    acc + (topic.count || 0),
                0
            );
        const requestedCount =
            Number(
                ctx.quantidadeQuestoes || 5
            );
        const readyCount =
            Math.min(
                requestedCount,
                eligibleQuestionCount
            );
        const issues = [];

        if (
            !availableBases.some(
                (base) =>
                    !(
                        ctx.smartExcludedBases || []
                    ).includes(base.key)
            )
        ) {
            issues.push(
                "Libere pelo menos uma base de treino para continuar."
            );
        }

        if (!eligibleTopics.length) {
            issues.push(
                "As exclusoes atuais removeram todas as questoes disponiveis. Limpe parte do recorte para continuar."
            );
        }

        return {
            isReady:
                issues.length === 0,
            issues,
            requestedCount,
            readyCount,
            eligibleTopics,
            eligibleSeries,
            eligibleSubjects,
            eligibleQuestionCount,
            availableBases
        };
    },

    filterTopicOptions(
        topicOptions = [],
        filters = {}
    ) {
        const search =
            this.normalizeText(
                filters.search || ""
            );
        const readyOnly =
            filters.readyOnly === true;

        return (topicOptions || []).filter(
            (topic) => {
                if (
                    readyOnly &&
                    !topic.hasQuestions
                ) {
                    return false;
                }

                if (!search) {
                    return true;
                }

                return String(
                    topic.searchIndex || ""
                ).includes(search);
            }
        );
    },

    getTopicCoverage(topicOptions = []) {
        const topics =
            Array.isArray(topicOptions)
                ? topicOptions
                : [];
        const readyTopics =
            topics.filter(
                (topic) => topic.hasQuestions
            );
        const totalQuestions =
            readyTopics.reduce(
                (acc, topic) =>
                    acc + (topic.count || 0),
                0
            );

        return {
            totalTopics: topics.length,
            readyTopics:
                readyTopics.length,
            emptyTopics:
                topics.length -
                readyTopics.length,
            totalQuestions
        };
    },

    getSelectedTopicOptions(page) {
        const ctx =
            QuestionsContext.get();

        return this.getTopicOptions(page, {
            serie: ctx.serie,
            materia: ctx.materia
        }).filter((topic) =>
            (ctx.topicos || []).includes(
                topic.key
            )
        );
    },

    resolveCorrectValue(
        type,
        correct
    ) {
        if (type === "vf") {
            return correct === true
                ? 0
                : 1;
        }

        return correct;
    },

    getQuestionMeta(topicRecord, question, index) {
        const subjectKey =
            this.slugify(topicRecord.materia);
        const topicKey =
            topicRecord.id ||
            this.slugify(topicRecord.topico);
        const type =
            question.tipo ||
            "multipla_escolha";
        const metadados =
            topicRecord?.metadados || {};
        const baseKey =
            String(
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
                this.slugify(subtopicLabel),
            subtopicLabel,
            axisLabel:
                String(
                    metadados.eixo || ""
                ).trim(),
            frontLabel:
                String(
                    metadados.frente || ""
                ).trim(),
            type,
            prompt:
                question.enunciado || "",
            options: Array.isArray(question.opcoes)
                ? [...question.opcoes]
                : [],
            correct: this.resolveCorrectValue(
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
                    question.dificuldadeNivel || 1
                ) || 1,
            cognition:
                question.cognicao ||
                "calculo",
            expectedTime:
                Number(
                    question.tempoEstimado || 25
                ) || 25,
            tags: Array.isArray(question.tags)
                ? [...question.tags]
                : [],
            abilities:
                Array.isArray(
                    question.habilidades
                )
                    ? [...question.habilidades]
                    : [],
            collections:
                Array.isArray(
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
            competencies:
                Array.isArray(
                    question.competencies
                )
                    ? [...question.competencies]
                    : [],
            status:
                question.status ||
                "rascunho"
        };
    },

    getAllQuestions(page, filters = {}) {
        const questions = [];

        this.getTopicRecords(
            page,
            filters
        ).forEach((topicRecord) => {
            (topicRecord.questoes || []).forEach(
                (question, index) => {
                    const mapped =
                        this.getQuestionMeta(
                            topicRecord,
                            question,
                            index
                        );

                    if (
                        !String(mapped.prompt).trim()
                    ) {
                        return;
                    }

                    questions.push(mapped);
                }
            );
        });

        return questions;
    },

    getQuestionPool(page) {
        const ctx =
            QuestionsContext.get();
        let pool =
            this.getAllQuestions(page, {
                serie: ctx.serie,
                materia: ctx.materia
            });

        if (
            !Array.isArray(ctx.topicos) ||
            !ctx.topicos.length
        ) {
            return [];
        }

        pool = pool.filter((question) =>
            ctx.topicos.includes(
                question.topicKey
            )
        );

        return pool;
    },

    clamp(value, min, max) {
        return Math.min(
            Math.max(value, min),
            max
        );
    },

    getTopicPerformanceMap(ctx) {
        return new Map(
            QuestionsStore.getTopicEntries({
                baseKey: ctx.base,
                subjectKey: ctx.materia
            }).map((entry) => [
                entry.topicKey,
                {
                    ...entry,
                    accuracy:
                        entry.attempts > 0
                            ? entry.hits /
                              entry.attempts
                            : 0
                }
            ])
        );
    },

    getTopicWeight(question, ctx, performanceMap) {
        const entry =
            performanceMap.get(
                question.topicKey
            );
        const manualWeight =
            Number(
                ctx.pesos?.[
                    question.topicKey
                ]
            ) || 1;
        const now = Date.now();
        const daysSinceSeen =
            entry?.lastSeen
                ? (
                    now - entry.lastSeen
                ) /
                86400000
                : 14;
        const recencyWeight =
            this.clamp(
                daysSinceSeen * 0.35,
                0.2,
                3
            );
        const errorWeight =
            entry
                ? (
                    entry.errors * 1.8
                ) +
                (
                    (1 - entry.accuracy) *
                    4
                )
                : 2.6;
        const reviewWeight =
            entry &&
            entry.errors > 0
                ? 1 +
                  this.clamp(
                      daysSinceSeen * 0.2,
                      0,
                      2
                  )
                : 0;
        const focusWeight =
            ctx.focoPrincipal ===
            question.topicKey
                ? 2.5
                : 0;
        const noveltyWeight =
            entry ? 0 : 1.4;

        return (
            manualWeight * 1.4 +
            errorWeight +
            recencyWeight +
            reviewWeight +
            focusWeight +
            noveltyWeight
        );
    },

    getDifficultyTarget(
        ctx,
        selectedCount,
        size,
        options = {}
    ) {
        if (
            options.profile ===
            "proof"
        ) {
            return 5.5;
        }

        const progress =
            size > 1
                ? selectedCount /
                  (size - 1)
                : 0;

        if (
            options.profile ===
            "focus"
        ) {
            return 3 + progress * 4;
        }

        if (
            ctx.mode ===
            "ASSUNTO_UNICO"
        ) {
            return 2.5 + progress * 4.5;
        }

        return 3.5 + progress * 3;
    },

    scoreQuestion(
        question,
        ctx,
        performanceMap,
        selected,
        size,
        options = {}
    ) {
        const topicWeight =
            this.getTopicWeight(
                question,
                ctx,
                performanceMap
            );
        const topicCountMap =
            selected.reduce(
                (acc, item) => {
                    acc[item.topicKey] =
                        (acc[item.topicKey] ||
                            0) + 1;
                    return acc;
                },
                {}
            );
        const seenTopics = new Set(
            selected.map(
                (item) => item.topicKey
            )
        );
        const lastTopic =
            selected.length
                ? selected[
                    selected.length - 1
                ].topicKey
                : null;
        const difficultyTarget =
            this.getDifficultyTarget(
                ctx,
                selected.length,
                size,
                options
            );
        const difficultyScore =
            2.4 -
            Math.abs(
                Number(
                    question.difficulty || 1
                ) - difficultyTarget
            ) *
                0.38;
        const coverageBoost =
            options.enforceCoverage &&
            !seenTopics.has(
                question.topicKey
            )
                ? 2.2
                : 0;
        const focusBoost =
            options.focusMode &&
            ctx.focoPrincipal ===
                question.topicKey
                ? 1.6
                : 0;
        const repeatPenalty =
            lastTopic ===
                question.topicKey &&
            !options.focusMode
                ? -2.1
                : 0;
        const saturationPenalty =
            (topicCountMap[
                question.topicKey
            ] || 0) * 0.85;
        const reviewBoost =
            options.reviewBias &&
            performanceMap.get(
                question.topicKey
            )?.errors
                ? options.reviewBias
                : 0;
        const proofBalanceBoost =
            options.profile ===
                "proof" &&
            (topicCountMap[
                question.topicKey
            ] || 0) === 0
                ? 1.4
                : 0;

        return (
            topicWeight +
            difficultyScore +
            coverageBoost +
            focusBoost +
            reviewBoost +
            proofBalanceBoost +
            repeatPenalty -
            saturationPenalty +
            Math.random() * 0.15
        );
    },

    buildEngineSession(
        pool,
        ctx,
        size,
        options = {}
    ) {
        const selected = [];
        const remaining =
            this.shuffle(pool);
        const performanceMap =
            this.getTopicPerformanceMap(
                ctx
            );

        while (
            selected.length < size &&
            remaining.length
        ) {
            let bestIndex = 0;
            let bestScore =
                -Infinity;

            remaining.forEach(
                (question, index) => {
                    const score =
                        this.scoreQuestion(
                            question,
                            ctx,
                            performanceMap,
                            selected,
                            size,
                            options
                        );

                    if (score > bestScore) {
                        bestScore = score;
                        bestIndex = index;
                    }
                }
            );

            selected.push(
                remaining.splice(
                    bestIndex,
                    1
                )[0]
            );
        }

        return selected;
    },

    buildCombinedSession(pool, size) {
        return this.shuffle(pool)
            .slice(0, size);
    },

    buildBalancedSession(pool, ctx, size) {
        return this.buildEngineSession(
            pool,
            ctx,
            size,
            {
                profile: "balanced",
                enforceCoverage: true
            }
        );
    },

    buildAlternatingSession(pool, ctx, size) {
        return this.buildEngineSession(
            pool,
            ctx,
            size,
            {
                profile: "alternating",
                enforceCoverage: true
            }
        );
    },

    buildFocusedSession(pool, ctx, size) {
        return this.buildEngineSession(
            pool,
            ctx,
            size,
            {
                profile: "focus",
                enforceCoverage: true,
                focusMode: true,
                reviewBias: 0.8
            }
        );
    },

    buildAdaptiveSession(pool, ctx, size) {
        return this.buildEngineSession(
            pool,
            ctx,
            size,
            {
                profile: "adaptive",
                enforceCoverage: true,
                reviewBias: 1.8,
                focusMode:
                    ctx.mode ===
                    "REFORCO_DIRECIONADO"
            }
        );
    },

    buildProofSession(pool, ctx, size) {
        return this.buildEngineSession(
            pool,
            ctx,
            size,
            {
                profile: "proof",
                enforceCoverage: true,
                reviewBias: 1.2
            }
        );
    },

    buildSession(page) {
        const ctx =
            QuestionsContext.get();
        const pool =
            this.getQuestionPool(page);
        const sessionSize =
            Math.min(
                Number(
                    ctx.quantidadeQuestoes || 5
                ),
                pool.length
            );

        if (!sessionSize) {
            return [];
        }

        if (ctx.mode === "ASSUNTO_UNICO") {
            return this.buildEngineSession(
                pool,
                ctx,
                sessionSize,
                {
                    profile: "single",
                    enforceCoverage: false,
                    reviewBias: 1
                }
            );
        }

        if (
            ctx.mode ===
            "ASSUNTOS_COMBINADOS"
        ) {
            if (
                ctx.estrategiaMistura ===
                "adaptativa"
            ) {
                return this.buildAdaptiveSession(
                    pool,
                    ctx,
                    sessionSize
                );
            }

            if (
                ctx.estrategiaMistura ===
                "alternada"
            ) {
                return this.buildAlternatingSession(
                    pool,
                    ctx,
                    sessionSize
                );
            }

            return this.buildBalancedSession(
                pool,
                ctx,
                sessionSize
            );
        }

        if (
            ctx.mode ===
            "REFORCO_DIRECIONADO"
        ) {
            return ctx.estrategiaMistura ===
                "adaptativa"
                ? this.buildAdaptiveSession(
                    pool,
                    ctx,
                    sessionSize
                )
                : this.buildFocusedSession(
                    pool,
                    ctx,
                    sessionSize
                );
        }

        return this.buildProofSession(
            pool,
            ctx,
            sessionSize
        );
    },

    getEstimatedDurationLabel(
        pool,
        count
    ) {
        if (
            !Array.isArray(pool) ||
            !pool.length ||
            !count
        ) {
            return "0 min";
        }

        const selected =
            pool.slice(
                0,
                Math.min(count, pool.length)
            );
        const totalSeconds =
            selected.reduce(
                (acc, question) =>
                    acc +
                    Math.max(
                        Number(
                            question.expectedTime || 25
                        ),
                        10
                    ),
                0
            );
        const minutes =
            Math.max(
                1,
                Math.ceil(totalSeconds / 60)
            );

        return `${minutes} min`;
    },

    getLauncherValidation(page) {
        const ctx =
            QuestionsContext.get();
        const subject =
            this.getSubjectOptions(
                page,
                ctx.serie
            ).find((item) =>
                item.key === ctx.materia
            );
        const selectedTopics =
            this.getSelectedTopicOptions(
                page
            );
        const pool =
            this.getQuestionPool(page);
        const requestedCount =
            Number(
                ctx.quantidadeQuestoes || 5
            );
        const availableCount =
            pool.length;
        const readyCount =
            Math.min(
                requestedCount,
                availableCount
            );
        const issues = [];
        let requiredTopics = 1;

        if (
            ctx.mode ===
            "ASSUNTOS_COMBINADOS" ||
            ctx.mode ===
            "REFORCO_DIRECIONADO" ||
            ctx.mode ===
            "TREINO_PARA_PROVA"
        ) {
            requiredTopics = 2;
        }

        if (!subject) {
            issues.push(
                "Escolha uma materia para montar a rota."
            );
        }

        if (
            selectedTopics.length <
            requiredTopics
        ) {
            issues.push(
                requiredTopics === 1
                    ? "Selecione 1 assunto para iniciar."
                    : "Selecione pelo menos 2 assuntos para esse modo."
            );
        }

        if (
            ctx.mode ===
                "REFORCO_DIRECIONADO" &&
            !ctx.focoPrincipal
        ) {
            issues.push(
                "Defina o foco principal do reforco."
            );
        }

        if (!availableCount) {
            issues.push(
                "Ainda nao ha questoes preenchidas para essa combinacao."
            );
        }

        return {
            isReady:
                issues.length === 0,
            issues,
            requiredTopics,
            requestedCount,
            availableCount,
            readyCount,
            selectedTopics,
            subjectLabel:
                subject?.label || "",
            estimatedDuration:
                this.getEstimatedDurationLabel(
                    pool,
                    readyCount
                )
        };
    },

    getLauncherChecklist(page) {
        const ctx =
            QuestionsContext.get();
        const validation =
            this.getLauncherValidation(page);
        const mode =
            page.getModeConfig(ctx.mode);
        const focusTopic =
            validation.selectedTopics.find(
                (topic) =>
                    topic.key ===
                    ctx.focoPrincipal
            );

        return [
            {
                label: "Modo",
                done: Boolean(mode?.key),
                detail:
                    mode?.label ||
                    "Defina o modo"
            },
            {
                label: "Recorte",
                done: Boolean(
                    validation.subjectLabel
                ),
                detail:
                    validation.subjectLabel
                        ? `${ctx.serie}a serie | ${validation.subjectLabel}`
                        : "Escolha serie e materia"
            },
            {
                label: "Assuntos",
                done:
                    validation.selectedTopics
                        .length >=
                    validation.requiredTopics,
                detail:
                    validation.selectedTopics
                        .length
                        ? `${validation.selectedTopics.length} selecionado(s)`
                        : "Nenhum assunto selecionado"
            },
            {
                label: "Foco",
                done:
                    ctx.mode !==
                        "REFORCO_DIRECIONADO" ||
                    Boolean(focusTopic),
                detail:
                    ctx.mode !==
                    "REFORCO_DIRECIONADO"
                        ? "Nao se aplica"
                        : (
                            focusTopic?.label ||
                            "Defina o principal"
                        )
            },
            {
                label: "Carga",
                done:
                    validation.availableCount >
                    0,
                detail: `${validation.readyCount}/${validation.requestedCount} questoes prontas`
            }
        ];
    },

    getQuestionInstruction(question) {
        if (!question) {
            return "";
        }

        if (question.type === "input") {
            return "Digite a resposta e confirme.";
        }

        if (question.type === "ordenacao") {
            return "Organize os itens na ordem correta antes de confirmar.";
        }

        if (question.type === "comparacao") {
            return "Escolha a comparacao correta.";
        }

        if (question.type === "vf") {
            return "Marque verdadeiro ou falso.";
        }

        return "Escolha a alternativa correta.";
    },

    getChoiceLabel(question, index) {
        if (
            !Array.isArray(question?.options)
        ) {
            return "";
        }

        return (
            question.options[index] || ""
        );
    },

    parseOrderedList(
        value,
        options = []
    ) {
        if (Array.isArray(value)) {
            return value.map((item) => {
                if (
                    Number.isInteger(item) &&
                    options[item] !== undefined
                ) {
                    return String(options[item]);
                }

                return String(item);
            });
        }

        if (typeof value === "string") {
            return value
                .split(/\s*(?:\||>|,|;)\s*/)
                .filter(Boolean)
                .map((item) => String(item));
        }

        return [];
    },

    arraysMatch(left, right) {
        if (
            left.length !== right.length
        ) {
            return false;
        }

        return left.every(
            (item, index) =>
                item === right[index]
        );
    },

    getCorrectAnswerLabel(question) {
        if (!question) {
            return "";
        }

        if (question.type === "vf") {
            return question.correct === 0
                ? "Verdadeiro"
                : "Falso";
        }

        if (question.type === "ordenacao") {
            const items =
                this.parseOrderedList(
                    question.correct,
                    question.options
                );

            return items.join(" -> ");
        }

        if (question.type === "input") {
            if (Array.isArray(question.correct)) {
                return question.correct.join(" / ");
            }

            return String(
                question.correct ?? ""
            );
        }

        if (
            Number.isInteger(question.correct)
        ) {
            return (
                this.getChoiceLabel(
                    question,
                    question.correct
                ) || String(question.correct)
            );
        }

        return String(
            question.correct ?? ""
        );
    },

    getSelectedAnswerLabel(
        question,
        selectedIndex,
        selectedValue
    ) {
        if (question.type === "ordenacao") {
            return this.parseOrderedList(
                selectedValue,
                question.options
            ).join(" -> ");
        }

        if (question.type === "input") {
            return String(
                selectedValue ?? ""
            );
        }

        if (
            selectedIndex !== null &&
            selectedIndex !== undefined
        ) {
            return (
                this.getChoiceLabel(
                    question,
                    selectedIndex
                ) || String(selectedIndex)
            );
        }

        return String(
            selectedValue ?? ""
        );
    },

    evaluateAnswer(
        question,
        selectedValue,
        selectedIndex
    ) {
        if (!question) {
            return {
                correct: false,
                correctAnswerLabel: "",
                selectedAnswerLabel: ""
            };
        }

        if (question.type === "input") {
            const accepted = Array.isArray(
                question.correct
            )
                ? question.correct
                : [question.correct];
            const selected =
                this.normalizeText(
                    selectedValue
                );
            const correct =
                accepted.some(
                    (candidate) =>
                        this.normalizeText(
                            candidate
                        ) === selected
                );

            return {
                correct,
                correctAnswerLabel:
                    this.getCorrectAnswerLabel(
                        question
                    ),
                selectedAnswerLabel:
                    this.getSelectedAnswerLabel(
                        question,
                        selectedIndex,
                        selectedValue
                    )
            };
        }

        if (question.type === "ordenacao") {
            const selectedOrder =
                this.parseOrderedList(
                    selectedValue,
                    question.options
                ).map((item) =>
                    this.normalizeText(item)
                );
            const correctOrder =
                this.parseOrderedList(
                    question.correct,
                    question.options
                ).map((item) =>
                    this.normalizeText(item)
                );
            const correct =
                this.arraysMatch(
                    selectedOrder,
                    correctOrder
                );

            return {
                correct,
                correctAnswerLabel:
                    this.getCorrectAnswerLabel(
                        question
                    ),
                selectedAnswerLabel:
                    this.getSelectedAnswerLabel(
                        question,
                        selectedIndex,
                        selectedValue
                    )
            };
        }

        let correct = false;

        if (
            Number.isInteger(question.correct)
        ) {
            correct =
                Number(selectedIndex) ===
                Number(question.correct);
        } else {
            correct =
                this.normalizeText(
                    selectedValue
                ) ===
                this.normalizeText(
                    question.correct
                );
        }

        return {
            correct,
            correctAnswerLabel:
                this.getCorrectAnswerLabel(
                    question
                ),
            selectedAnswerLabel:
                this.getSelectedAnswerLabel(
                    question,
                    selectedIndex,
                    selectedValue
                )
        };
    },

    answer(index, value = null) {
        const question =
            QuestionsState.getCurrentQuestion();

        if (!question) {
            return null;
        }

        const selectedValue =
            value !== null
                ? value
                : index;
        const selectedIndex =
            index !== null &&
            index !== undefined
                ? index
                : null;
        const evaluation =
            this.evaluateAnswer(
                question,
                selectedValue,
                selectedIndex
            );
        const timeMs =
            Date.now() -
            QuestionsState.getStartTime();

        QuestionsStore.registerAnswer(
            {
                baseKey:
                    question.baseKey,
                baseLabel:
                    question.baseLabel,
                subjectKey:
                    question.subjectKey,
                subjectLabel:
                    question.subjectLabel,
                topicKey:
                    question.topicKey,
                topicLabel:
                    question.topicLabel
            },
            evaluation.correct,
            timeMs
        );

        return {
            correct:
                evaluation.correct,
            selectedIndex,
            selectedValue,
            selectedAnswerLabel:
                evaluation.selectedAnswerLabel,
            correctAnswerLabel:
                evaluation.correctAnswerLabel,
            timeMs,
            question
        };
    },

    getRouteSummary(page) {
        const ctx =
            QuestionsContext.get();
        const mode =
            page.getModeConfig(ctx.mode);
        const subject =
            this.getSubjectOptions(
                page,
                ctx.serie
            ).find((item) =>
                item.key === ctx.materia
            );
        const topics =
            this.getSelectedTopicOptions(
                page
            ).map((topic) => topic.label);
        const focusTopic =
            this.getSelectedTopicOptions(
                page
            ).find((topic) =>
                topic.key ===
                ctx.focoPrincipal
            );
        const strategy =
            this.getMixStrategies(
                page,
                ctx.mode
            ).find((item) =>
                item.key ===
                ctx.estrategiaMistura
            );
        const validation =
            this.getLauncherValidation(
                page
            );

        return {
            modeLabel: mode?.label || "",
            baseLabel:
                ctx.base === "ENEM"
                    ? "ENEM"
                    : "Escolar",
            serieLabel: `${ctx.serie}a serie`,
            materiaLabel:
                subject?.label || "",
            topicsLabel: topics,
            amount:
                ctx.quantidadeQuestoes || 5,
            focusLabel:
                focusTopic?.label || "",
            strategyLabel:
                strategy?.label || "",
            availableCount:
                validation.availableCount,
            estimatedDuration:
                validation.estimatedDuration
        };
    },

    findSubjectKey(
        page,
        serie,
        materia
    ) {
        const target =
            this.slugify(materia);

        return (
            this.getSubjectOptions(
                page,
                serie
            ).find((item) =>
                item.key === target ||
                this.slugify(
                    item.label
                ) === target
            )?.key || ""
        );
    },

    findTopicKeys(
        page,
        filters = {},
        rawTopics = []
    ) {
        const topics =
            this.getTopicOptions(
                page,
                filters
            );
        const normalized =
            (Array.isArray(rawTopics)
                ? rawTopics
                : [rawTopics]
            )
                .filter(Boolean)
                .map((item) =>
                    this.slugify(item)
                );

        return topics
            .filter(
                (topic) =>
                    normalized.includes(
                        topic.key
                    ) ||
                    normalized.includes(
                        this.slugify(
                            topic.label
                        )
                    )
            )
            .map((topic) => topic.key);
    },

    normalizeSyncPayload(
        page,
        payload = {}
    ) {
        if (
            !payload ||
            typeof payload !== "object"
        ) {
            return null;
        }

        const current =
            QuestionsContext.get();
        const targetSerie =
            Number(
                payload.serie ||
                    current.serie
            ) || current.serie;
        const materia =
            this.findSubjectKey(
                page,
                targetSerie,
                payload.materia ||
                    current.materia
            ) || current.materia;
        const rawTopics =
            payload.topicos ||
            payload.topics ||
            payload.topico ||
            [];
        const topicos =
            this.findTopicKeys(
                page,
                {
                    serie: targetSerie,
                    materia
                },
                rawTopics
            );
        const focoPrincipal =
            this.findTopicKeys(
                page,
                {
                    serie: targetSerie,
                    materia
                },
                payload.focoPrincipal ||
                    payload.focusTopic ||
                    []
            )[0] || null;
        const requestedMode =
            payload.mode || current.mode;
        const mode =
            page.data.modes[
                requestedMode
            ]
                ? requestedMode
                : current.mode;
        const allowedStrategies =
            this.getMixStrategies(
                page,
                mode
            ).map((item) => item.key);
        const requestedStrategy =
            payload.estrategiaMistura ||
            payload.strategy ||
            current.estrategiaMistura;
        const estrategiaMistura =
            allowedStrategies.includes(
                requestedStrategy
            )
                ? requestedStrategy
                : allowedStrategies[0] ||
                  "equilibrada";
        const quantidadeQuestoes =
            Number(
                payload.quantidadeQuestoes ||
                    payload.amount ||
                    current.quantidadeQuestoes
            ) || current.quantidadeQuestoes;
        const pesos =
            topicos.reduce(
                (acc, topicKey) => {
                    const manual =
                        Number(
                            payload.pesos?.[
                                topicKey
                            ]
                        ) || 1;
                    acc[topicKey] =
                        focoPrincipal ===
                        topicKey
                            ? Math.max(
                                manual,
                                2
                            )
                            : manual;
                    return acc;
                },
                {}
            );

        return {
            context: {
                serie: targetSerie,
                materia,
                topicos,
                focoPrincipal,
                mode,
                estrategiaMistura,
                quantidadeQuestoes,
                pesos,
                syncSource:
                    String(
                        payload.source ||
                            payload.syncSource ||
                            ""
                    ),
                syncIntent:
                    String(
                        payload.intent ||
                            ""
                    )
            },
            autoStart: Boolean(
                payload.autoStart
            ),
            source: String(
                payload.source ||
                    payload.syncSource ||
                    ""
            ),
            intent: String(
                payload.intent || ""
            )
        };
    },

    buildSyncSnapshot(page) {
        const ctx =
            QuestionsContext.get();
        const route =
            this.getRouteSummary(page);
        const dashboard =
            QuestionsStore.getDashboard({
                baseKey: ctx.base,
                subjectKey: ctx.materia
            });
        const sessionMeta =
            QuestionsState.getMeta();

        return {
            phase:
                QuestionsState.getPhase(),
            timestamp: Date.now(),
            context: {
                ...ctx
            },
            route,
            stats: {
                attempts:
                    dashboard.attempts,
                accuracy:
                    Math.round(
                        (dashboard.accuracy ||
                            0) * 100
                    ),
                totalSessions:
                    dashboard.totalSessions ||
                    0,
                weakTopic:
                    dashboard.weakTopics?.[0]
                        ?.topicLabel || "",
                strongTopic:
                    dashboard.strongTopics?.[0]
                        ?.topicLabel || ""
            },
            activeSession:
                QuestionsState.getPhase() ===
                "session"
                    ? {
                        meta: sessionMeta,
                        current:
                            QuestionsState.getCurrent(),
                        total:
                            QuestionsState.getSession()
                                .length
                    }
                    : null
        };
    },

    getSmartSuggestion(page) {
        const ctx =
            QuestionsContext.get();
        const weak =
            QuestionsStore.getWeakTopics({
                baseKey: ctx.base,
                subjectKey: ctx.materia
            })[0];

        if (weak) {
            return {
                title: `Reforco ideal: ${weak.topicLabel}`,
                note: "Esse assunto concentra mais erros recentes. Vale puxar um treino focado."
            };
        }

        const route =
            this.getRouteSummary(page);

        return {
            title: `${route.materiaLabel || "Materia"} pronta para treino`,
            note:
                route.topicsLabel.length
                    ? `Sessao configurada em ${route.topicsLabel.join(", ")}.`
                    : "Escolha um ou mais assuntos para montar a rota."
        };
    },

    summarizeSessionResults(
        results = [],
        meta = {}
    ) {
        const safeResults =
            Array.isArray(results)
                ? results
                : [];
        const total =
            safeResults.length;
        const hits =
            safeResults.filter(
                (item) => item.correct
            ).length;
        const errors =
            total - hits;
        const avgTimeMs =
            total
                ? safeResults.reduce(
                    (acc, item) =>
                        acc + (item.timeMs || 0),
                    0
                ) / total
                : 0;
        const accuracy =
            total
                ? Math.round(
                    (hits / total) * 100
                )
                : 0;
        const grouped = new Map();

        safeResults.forEach((entry) => {
            const topicKey =
                entry.question.topicKey;
            const current =
                grouped.get(topicKey) || {
                    topicKey,
                    topicLabel:
                        entry.question.topicLabel,
                    attempts: 0,
                    hits: 0,
                    errors: 0,
                    totalTimeMs: 0
                };

            current.attempts += 1;
            current.totalTimeMs +=
                entry.timeMs || 0;

            if (entry.correct) {
                current.hits += 1;
            } else {
                current.errors += 1;
            }

            grouped.set(
                topicKey,
                current
            );
        });

        const topics = [
            ...grouped.values()
        ].map((item) => ({
            ...item,
            accuracy:
                item.attempts > 0
                    ? Math.round(
                        (item.hits /
                            item.attempts) *
                            100
                    )
                    : 0,
            avgTimeMs:
                item.attempts > 0
                    ? item.totalTimeMs /
                      item.attempts
                    : 0
        }));

        const weakestTopics =
            [...topics].sort(
                (left, right) =>
                    right.errors - left.errors ||
                    left.accuracy -
                        right.accuracy ||
                    right.attempts -
                        left.attempts
            );
        const strongestTopics =
            [...topics].sort(
                (left, right) =>
                    right.hits - left.hits ||
                    right.accuracy -
                        left.accuracy ||
                    left.errors -
                        right.errors
            );
        const weakTopic =
            weakestTopics.find(
                (item) => item.errors > 0
            ) || null;
        const strongTopic =
            strongestTopics.find(
                (item) => item.hits > 0
            ) || null;
        const reviewTopics =
            weakestTopics
                .filter(
                    (item) => item.errors > 0
                )
                .slice(0, 3);

        let headline =
            "Sessao concluida";
        let nextStep =
            "Monte a proxima rota com base nos seus pontos fracos.";

        if (accuracy >= 85) {
            headline =
                "Sessao muito forte";
            nextStep =
                "Vale subir a dificuldade ou misturar assuntos para consolidar.";
        } else if (accuracy >= 70) {
            headline =
                "Boa sessao";
            nextStep =
                "A base esta ficando solida. Agora vale revisar os deslizes.";
        } else if (total > 0) {
            headline =
                "Sessao de ajuste";
            nextStep =
                "O melhor proximo passo e reforcar os assuntos com erro.";
        }

        return {
            total,
            hits,
            errors,
            accuracy,
            avgTimeMs,
            topics,
            weakTopic,
            strongTopic,
            reviewTopics,
            topicCount: topics.length,
            headline,
            nextStep,
            meta: {
                ...(meta || {})
            }
        };
    },

    buildFollowUpContext(
        page,
        intent,
        summary = null
    ) {
        const ctx =
            QuestionsContext.get();
        const sessionSummary =
            summary ||
            this.summarizeSessionResults(
                QuestionsState.getResults(),
                QuestionsState.getMeta()
            );
        const uniqueReviewTopics =
            [
                ...new Set(
                    (sessionSummary.reviewTopics || []).map(
                        (item) =>
                            item.topicKey
                    )
                )
            ];
        const currentTopics =
            Array.isArray(ctx.topicos)
                ? [...ctx.topicos]
                : [];

        if (
            intent === "weak_topic" &&
            sessionSummary.weakTopic
        ) {
            return {
                mode: "ASSUNTO_UNICO",
                topicos: [
                    sessionSummary.weakTopic
                        .topicKey
                ],
                focoPrincipal: null,
                estrategiaMistura:
                    "equilibrada"
            };
        }

        if (intent === "review_errors") {
            const topics =
                uniqueReviewTopics.length
                    ? uniqueReviewTopics
                    : currentTopics;

            return {
                mode:
                    topics.length > 1
                        ? "ASSUNTOS_COMBINADOS"
                        : "ASSUNTO_UNICO",
                topicos: topics,
                focoPrincipal: null,
                estrategiaMistura:
                    topics.length > 1
                        ? "adaptativa"
                        : "equilibrada"
            };
        }

        return {
            mode:
                currentTopics.length > 1
                    ? "TREINO_PARA_PROVA"
                    : "ASSUNTO_UNICO",
            topicos: currentTopics,
            focoPrincipal: null,
            estrategiaMistura:
                currentTopics.length > 1
                    ? "equilibrada"
                    : "equilibrada"
        };
    }
};

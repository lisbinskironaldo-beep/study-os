window.QuestionsService = {
    shuffle(list) {
        const items = [...(list || [])];

        for (
            let index = items.length - 1;
            index > 0;
            index -= 1
        ) {
            const swapIndex = Math.floor(
                Math.random() * (index + 1)
            );
            const current = items[index];
            items[index] = items[swapIndex];
            items[swapIndex] = current;
        }

        return items;
    },

    pickTopicKeys(
        topicOptions = [],
        count = 1,
        preferredKeys = []
    ) {
        const topics = Array.isArray(
            topicOptions
        )
            ? topicOptions.filter(Boolean)
            : [];
        const desiredCount = Math.max(
            Number(count) || 0,
            0
        );

        if (!desiredCount || !topics.length) {
            return [];
        }

        const selected = [];
        const availableKeys = new Set(
            topics.map((topic) => topic.key)
        );

        (preferredKeys || []).forEach((key) => {
            if (
                availableKeys.has(key) &&
                !selected.includes(key)
            ) {
                selected.push(key);
            }
        });

        this.shuffle(
            topics.filter(
                (topic) =>
                    !selected.includes(topic.key)
            )
        )
            .slice(
                0,
                Math.max(
                    desiredCount -
                        selected.length,
                    0
                )
            )
            .forEach((topic) => {
                selected.push(topic.key);
            });

        return selected.slice(0, desiredCount);
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

    normalizeSearchTokens(value) {
        return this.normalizeText(value)
            .replace(/[^a-z0-9\s]/g, " ")
            .split(/\s+/)
            .map((token) => token.trim())
            .filter((token) => token.length >= 2);
    },

    levenshteinDistance(a = "", b = "") {
        const left = String(a || "");
        const right = String(b || "");

        if (left === right) {
            return 0;
        }

        if (!left.length) {
            return right.length;
        }

        if (!right.length) {
            return left.length;
        }

        const matrix = Array.from(
            { length: left.length + 1 },
            () =>
                new Array(
                    right.length + 1
                ).fill(0)
        );

        for (
            let row = 0;
            row <= left.length;
            row += 1
        ) {
            matrix[row][0] = row;
        }

        for (
            let col = 0;
            col <= right.length;
            col += 1
        ) {
            matrix[0][col] = col;
        }

        for (
            let row = 1;
            row <= left.length;
            row += 1
        ) {
            for (
                let col = 1;
                col <= right.length;
                col += 1
            ) {
                const cost =
                    left[row - 1] ===
                    right[col - 1]
                        ? 0
                        : 1;

                matrix[row][col] = Math.min(
                    matrix[row - 1][col] + 1,
                    matrix[row][col - 1] + 1,
                    matrix[row - 1][col - 1] +
                        cost
                );
            }
        }

        return matrix[left.length][right.length];
    },

    fuzzyTokenMatch(leftToken, rightToken) {
        const left =
            this.normalizeText(leftToken);
        const right =
            this.normalizeText(rightToken);

        if (!left || !right) {
            return false;
        }

        if (left === right) {
            return true;
        }

        if (
            left.includes(right) ||
            right.includes(left)
        ) {
            return true;
        }

        const distance =
            this.levenshteinDistance(
                left,
                right
            );
        const maxLength = Math.max(
            left.length,
            right.length
        );
        const threshold =
            maxLength >= 9
                ? 2
                : 1;

        return distance <= threshold;
    },

    matchesFuzzySearch(
        haystack,
        rawTerm
    ) {
        const normalizedHaystack =
            this.normalizeText(haystack);
        const normalizedTerm =
            this.normalizeText(rawTerm);

        if (!normalizedHaystack || !normalizedTerm) {
            return false;
        }

        if (
            normalizedHaystack.includes(
                normalizedTerm
            )
        ) {
            return true;
        }

        const haystackTokens =
            this.normalizeSearchTokens(
                normalizedHaystack
            );
        const termTokens =
            this.normalizeSearchTokens(
                normalizedTerm
            );

        if (!termTokens.length) {
            return false;
        }

        let matchedCount = 0;

        termTokens.forEach((termToken) => {
            const matched =
                haystackTokens.some(
                    (hayToken) =>
                        this.fuzzyTokenMatch(
                            hayToken,
                            termToken
                        )
                );

            if (matched) {
                matchedCount += 1;
            }
        });

        const minimumMatches =
            termTokens.length <= 2
                ? termTokens.length
                : termTokens.length - 1;

        return matchedCount >= minimumMatches;
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

    hasDetailedCatalog(page) {
        return this.getCatalog(page).length > 0;
    },

    isFullCatalogLoaded(page) {
        return Boolean(
            page?.contentRepository &&
                typeof page.contentRepository
                    .isCatalogLoaded ===
                    "function" &&
                page.contentRepository.isCatalogLoaded()
        );
    },

    shouldUseDetailedQuestionPool(
        page
    ) {
        return (
            this.isFullCatalogLoaded(page) ||
            (
                !this.hasCatalogManifest(page) &&
                this.hasDetailedCatalog(page)
            )
        );
    },

    getCatalogManifest(page) {
        return page?.data
            ?.schoolCatalogManifest &&
            typeof page.data
                .schoolCatalogManifest ===
                "object"
            ? page.data.schoolCatalogManifest
            : null;
    },

    hasCatalogManifest(page) {
        return Array.isArray(
            this.getCatalogManifest(page)
                ?.topics
        );
    },

    getManifestTopicRecords(
        page,
        filters = {}
    ) {
        const manifest =
            this.getCatalogManifest(page);
        const topics = Array.isArray(
            manifest?.topics
        )
            ? manifest.topics
            : [];
        const targetSerie =
            Number(filters.serie) || null;
        const targetMateria =
            String(filters.materia || "").trim();

        return topics.filter((topic) => {
            if (
                targetSerie &&
                !topic?.serie?.includes(targetSerie)
            ) {
                return false;
            }

            if (
                targetMateria &&
                String(
                    topic.subjectKey ||
                        this.slugify(
                            topic.materia
                        )
                ) !== targetMateria
            ) {
                return false;
            }

            return true;
        });
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
        if (this.hasCatalogManifest(page)) {
            const found = new Set();

            this.getManifestTopicRecords(
                page
            ).forEach((topic) => {
                (topic?.serie || []).forEach(
                    (serie) => {
                        if (
                            Number.isFinite(
                                Number(serie)
                            )
                        ) {
                            found.add(
                                Number(serie)
                            );
                        }
                    }
                );
            });

            return [...found]
                .sort(
                    (left, right) =>
                        left - right
                )
                .map((serie) => ({
                    key: serie,
                    label: `${serie}a serie`
                }));
        }

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
        if (this.hasCatalogManifest(page)) {
            const manifest =
                this.getCatalogManifest(page);
            const targetSerie =
                Number(serie) || null;
            const grouped = new Map();
            const subjects = Array.isArray(
                manifest?.subjects
            )
                ? manifest.subjects
                : [];

            subjects.forEach((subject) => {
                if (
                    targetSerie &&
                    Number(subject?.serie) !==
                        targetSerie
                ) {
                    return;
                }

                const subjectKey =
                    String(
                        subject?.subjectKey ||
                            this.slugify(
                                subject?.materia
                            )
                    );
                const current =
                    grouped.get(
                        subjectKey
                    ) || {
                        key: subjectKey,
                        label:
                            subject?.materia ||
                            "",
                        count: 0,
                        topicCount: 0,
                        readyQuestionCount: 0,
                        readyTopicCount: 0,
                        hasQuestions: false
                    };

                current.count +=
                    Number(
                        subject?.readyQuestionCount
                    ) || 0;
                current.topicCount +=
                    Number(
                        subject?.topicCount
                    ) || 0;
                current.readyQuestionCount +=
                    Number(
                        subject?.readyQuestionCount
                    ) || 0;
                current.readyTopicCount +=
                    Number(
                        subject?.readyTopicCount
                    ) || 0;
                current.hasQuestions =
                    current.readyQuestionCount >
                    0;

                if (
                    current.hasQuestions &&
                    subject?.materia
                ) {
                    current.label =
                        subject.materia;
                }

                grouped.set(
                    subjectKey,
                    current
                );
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
                });
        }

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
            const readyQuestionCount =
                this.getTopicQuestionCount(
                    topic
                );
            const current =
                grouped.get(subjectKey) || {
                    key: subjectKey,
                    label: topic.materia,
                    count: 0,
                    topicCount: 0,
                    readyQuestionCount: 0,
                    readyTopicCount: 0,
                    hasQuestions: false
                };

            current.count +=
                Array.isArray(topic.questoes)
                    ? topic.questoes.length
                    : 0;
            current.topicCount += 1;
            current.readyQuestionCount +=
                readyQuestionCount;
            current.readyTopicCount +=
                readyQuestionCount > 0
                    ? 1
                    : 0;
            current.hasQuestions =
                current.readyQuestionCount >
                0;

            if (
                readyQuestionCount > 0 &&
                current.label !== topic.materia
            ) {
                current.label = topic.materia;
            }

            grouped.set(subjectKey, current);
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
            });
    },

    getTopicRecords(page, filters = {}) {
        if (
            !this.getCatalog(page).length &&
            this.hasCatalogManifest(page)
        ) {
            return this.getManifestTopicRecords(
                page,
                filters
            ).map((topic) => ({
                ...topic
            }));
        }

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
        if (
            !this.isFullCatalogLoaded(page) &&
            this.hasCatalogManifest(page)
        ) {
            return this.getManifestTopicRecords(
                page,
                filters
            ).map((topic) => {
                const subjectKey =
                    String(
                        topic.subjectKey ||
                            this.slugify(
                                topic.materia
                            )
                    );
                const baseKey = String(
                    topic.base || "ESCOLAR"
                )
                    .trim()
                    .toUpperCase();
                const searchIndex =
                    this.normalizeText(
                        [
                            topic.topico,
                            topic.materia,
                            baseKey
                        ].join(" ")
                    );
                const count =
                    Number(
                        topic.readyQuestionCount
                    ) || 0;

                return {
                    key:
                        topic.id ||
                        this.slugify(
                            topic.topico
                        ),
                    label: topic.topico,
                    serie: Array.isArray(
                        topic.serie
                    )
                        ? [...topic.serie]
                        : [],
                    subjectKey,
                    subjectLabel:
                        topic.materia,
                    baseKey,
                    count,
                    hasQuestions:
                        Boolean(topic.hasQuestions) ||
                        count > 0,
                    subtopicCount: 0,
                    subtopicsPreview: [],
                    eixo: "",
                    frente: "",
                    searchIndex
                };
            });
        }

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

    getSmartSubjectTopicOptions(
        page,
        subjectKey,
        context = null
    ) {
        const ctx =
            context ||
            QuestionsContext.get();
        const cleanSubjectKey =
            String(subjectKey || "")
                .trim()
                .toLowerCase();

        if (!cleanSubjectKey) {
            return [];
        }

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
        const excludedTopics =
            new Set(
                (
                    ctx
                        .smartExcludedTopicsBySubject?.[
                        cleanSubjectKey
                    ] || []
                )
                    .map((item) =>
                        String(item || "").trim()
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

        return this.getTopicOptions(page, {
            materia: cleanSubjectKey
        })
            .filter((topic) => {
                if (
                    topic.subjectKey !==
                    cleanSubjectKey
                ) {
                    return false;
                }

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
                    excludedBases.has(
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
            .sort((left, right) => {
                if (
                    left.count !==
                    right.count
                ) {
                    return (
                        right.count - left.count
                    );
                }

                return left.label.localeCompare(
                    right.label,
                    "pt-BR"
                );
            })
            .map((topic) => ({
                ...topic,
                active:
                    !excludedTopics.has(
                        topic.key
                    )
            }));
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
        const excludedTopicsBySubject =
            ctx
                .smartExcludedTopicsBySubject &&
            typeof ctx
                .smartExcludedTopicsBySubject ===
                "object"
                ? ctx.smartExcludedTopicsBySubject
                : {};
        const excludedTopicLookup =
            new Map(
                Object.entries(
                    excludedTopicsBySubject
                ).map(
                    ([subjectKey, topicKeys]) => [
                        String(
                            subjectKey || ""
                        )
                            .trim()
                            .toLowerCase(),
                        new Set(
                            (
                                Array.isArray(
                                    topicKeys
                                )
                                    ? topicKeys
                                    : []
                            )
                                .map((item) =>
                                    String(
                                        item || ""
                                    ).trim()
                                )
                                .filter(Boolean)
                        )
                    ]
                )
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

                const excludedTopics =
                    excludedTopicLookup.get(
                        topic.subjectKey
                    );

                if (
                    excludedTopics?.has(
                        topic.key
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
            this.getResolvedSessionAmount(
                page,
                ctx,
                eligibleQuestionCount
            );
        const readyCount =
            eligibleQuestionCount
                ? Math.min(
                    requestedCount,
                    eligibleQuestionCount
                )
                : requestedCount;
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

    getSmartLauncherRecovery(
        page,
        context = null
    ) {
        const ctx =
            context ||
            QuestionsContext.get();
        const currentValidation =
            this.getSmartLauncherValidation(
                page,
                ctx
            );
        const hasHiddenExclusions =
            Boolean(
                (ctx.smartExcludedSeries || [])
                    .length ||
                    (ctx.smartExcludedBases || [])
                        .length ||
                    (
                        ctx.smartExcludedSubjects ||
                        []
                    ).length ||
                    Object.keys(
                        ctx
                            .smartExcludedTopicsBySubject ||
                            {}
                    ).length
            );

        if (
            currentValidation.isReady ||
            !hasHiddenExclusions
        ) {
            return {
                isRecoverable: false,
                currentValidation,
                recoveredValidation: null,
                recoveryPatch: null
            };
        }

        const recoveryPatch = {
            smartExcludedSeries: [],
            smartExcludedBases: [],
            smartExcludedSubjects: [],
            smartExcludedTopicsBySubject:
                {}
        };
        const recoveredValidation =
            this.getSmartLauncherValidation(
                page,
                {
                    ...ctx,
                    ...recoveryPatch
                }
            );

        if (
            !recoveredValidation.isReady &&
            !(
                recoveredValidation
                    ?.eligibleTopics?.length
            )
        ) {
            return {
                isRecoverable: false,
                currentValidation,
                recoveredValidation,
                recoveryPatch: null
            };
        }

        const hiddenFilters = [];

        if (
            (ctx.smartExcludedBases || [])
                .length
        ) {
            hiddenFilters.push(
                `${ctx.smartExcludedBases.length} base(s)`
            );
        }

        if (
            (ctx.smartExcludedSeries || [])
                .length
        ) {
            hiddenFilters.push(
                `${ctx.smartExcludedSeries.length} serie(s)`
            );
        }

        if (
            (ctx.smartExcludedSubjects || [])
                .length
        ) {
            hiddenFilters.push(
                `${ctx.smartExcludedSubjects.length} materia(s)`
            );
        }

        const topicExcludedCount =
            Object.values(
                ctx
                    .smartExcludedTopicsBySubject ||
                    {}
            ).reduce(
                (acc, topicKeys) =>
                    acc +
                    (
                        Array.isArray(topicKeys)
                            ? topicKeys.length
                            : 0
                    ),
                0
            );

        if (topicExcludedCount) {
            hiddenFilters.push(
                `${topicExcludedCount} assunto(s)`
            );
        }

        return {
            isRecoverable: true,
            currentValidation,
            recoveredValidation,
            recoveryPatch,
            hiddenFilters,
            reason:
                hiddenFilters.length
                    ? `Havia exclusoes salvas (${hiddenFilters.join(", ")}) escondendo as questoes prontas. O recorte foi liberado automaticamente.`
                    : "Havia exclusoes salvas escondendo as questoes prontas. O recorte foi liberado automaticamente."
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

    getCatalogHealth(page) {
        const topics =
            this.getTopicOptions(page);
        const readyTopics =
            topics.filter(
                (topic) => topic.hasQuestions
            );
        const subjects =
            this.getSubjectOptions(page);
        const readySubjects =
            subjects.filter(
                (subject) =>
                    subject.hasQuestions
            );

        return {
            totalTopics: topics.length,
            readyTopics: readyTopics.length,
            totalSubjects: subjects.length,
            readySubjects:
                readySubjects.length,
            totalQuestions:
                readyTopics.reduce(
                    (acc, topic) =>
                        acc + (topic.count || 0),
                    0
                )
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

    resolveChoiceCorrectIndex(
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
            this.normalizeText(correct);

        if (!normalizedCorrect) {
            return correct;
        }

        const optionIndex =
            (Array.isArray(options)
                ? options
                : []
            ).findIndex(
                (option) =>
                    this.normalizeText(
                        option
                    ) ===
                    normalizedCorrect
            );

        return optionIndex >= 0
            ? optionIndex
            : correct;
    },

    resolveCorrectValue(
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
            return this.resolveChoiceCorrectIndex(
                correct,
                options
            );
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

    orderDirectSearchQuestions(
        questions = [],
        strategy = "gradual"
    ) {
        const pool = Array.isArray(questions)
            ? questions.filter(Boolean)
            : [];
        const normalizedStrategy =
            String(strategy || "gradual")
                .trim()
                .toLowerCase();

        if (normalizedStrategy === "random") {
            return this.shuffle(pool);
        }

        const grouped = new Map();

        pool.forEach((question) => {
            const difficulty = Math.max(
                Number(question?.difficulty) || 1,
                1
            );
            const bucket =
                grouped.get(difficulty) || [];

            bucket.push(question);
            grouped.set(difficulty, bucket);
        });

        return [...grouped.keys()]
            .sort((left, right) => left - right)
            .flatMap((difficulty) =>
                [...grouped.get(difficulty)]
                    .sort((left, right) => {
                    const timeDiff =
                        (Number(
                            left?.expectedTime
                        ) || 0) -
                        (Number(
                            right?.expectedTime
                        ) || 0);

                    if (timeDiff !== 0) {
                        return timeDiff;
                    }

                    return String(
                        left?.topicLabel || ""
                    ).localeCompare(
                        String(
                            right?.topicLabel || ""
                        ),
                        "pt-BR"
                    );
                    })
            );
    },

    getWarmupExpandedTopicKeys(
        page,
        context = null,
        preferredKeys = []
    ) {
        const ctx =
            context ||
            QuestionsContext.get();
        const currentTopics =
            Array.isArray(ctx.topicos)
                ? ctx.topicos.filter(Boolean)
                : [];
        const selectedSmartSeries =
            Array.isArray(
                ctx.smartSelectedSeries
            )
                ? ctx.smartSelectedSeries
                : [];
        const selectedSmartSubjects =
            Array.isArray(
                ctx.smartSelectedSubjects
            )
                ? ctx.smartSelectedSubjects
                : [];
        const smartScoped =
            selectedSmartSeries.length > 0 ||
            selectedSmartSubjects.length >
                0;

        if (
            currentTopics.length > 1 ||
            (
                ctx.mode ===
                    "ASSUNTO_UNICO" &&
                !smartScoped
            )
        ) {
            return currentTopics;
        }

        const subjectTopics =
            this.getTopicOptions(page, {
                serie: ctx.serie,
                materia: ctx.materia
            }).filter(
                (topic) =>
                    Number(topic?.count || 0) >
                    0
            );

        if (subjectTopics.length <= 1) {
            return currentTopics;
        }

        const evidence =
            this.getAdaptiveEvidenceProfile(
                ctx,
                this.getTopicPerformanceMap(
                    ctx
                )
            );
        const desiredCount =
            Math.min(
                evidence.totalAttempts < 100
                    ? 3
                    : 2,
                subjectTopics.length,
                Math.max(
                    Number(
                        ctx.quantidadeQuestoes
                    ) || 1,
                    1
                )
            );

        if (
            desiredCount <=
            currentTopics.length
        ) {
            return currentTopics;
        }

        return this.pickTopicKeys(
            subjectTopics,
            desiredCount,
            [
                ...currentTopics,
                ...(
                    Array.isArray(
                        preferredKeys
                    )
                        ? preferredKeys
                        : []
                )
            ]
        );
    },

    getQuestionPool(page, context = null) {
        const ctx =
            context ||
            QuestionsContext.get();
        const effectiveTopics =
            this.getWarmupExpandedTopicKeys(
                page,
                ctx
            );
        let pool =
            this.getAllQuestions(page, {
                serie: ctx.serie,
                materia: ctx.materia
            });

        if (
            !effectiveTopics.length
        ) {
            return [];
        }

        pool = pool.filter((question) =>
            effectiveTopics.includes(
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
                            : 0,
                    consecutiveHits:
                        Number(
                            entry.consecutiveHits
                        ) || 0,
                    consecutiveErrors:
                        Number(
                            entry.consecutiveErrors
                        ) || 0,
                    lastCorrect:
                        typeof entry.lastCorrect ===
                            "boolean"
                            ? entry.lastCorrect
                            : null,
                    lastErrorAt:
                        Number(
                            entry.lastErrorAt
                        ) || 0
                }
            ])
        );
    },

    getQuestionPerformanceEntry(
        question = {}
    ) {
        const baseKey =
            String(
                question.baseKey || "ESCOLAR"
            ).trim() || "ESCOLAR";
        const subjectKey =
            String(
                question.subjectKey || ""
            ).trim();
        const topicKey =
            String(
                question.topicKey || ""
            ).trim();

        if (!subjectKey || !topicKey) {
            return null;
        }

        const entries =
            QuestionsStore.getTopicEntries({
                baseKey,
                subjectKey
            });

        const entry =
            entries.find(
                (item) =>
                    String(
                        item?.topicKey || ""
                    ) === topicKey
            ) || null;

        if (!entry) {
            return null;
        }

        return {
            ...entry,
            accuracy:
                entry.attempts > 0
                    ? entry.hits /
                      entry.attempts
                    : 0,
            consecutiveHits:
                Number(
                    entry.consecutiveHits
                ) || 0,
            consecutiveErrors:
                Number(
                    entry.consecutiveErrors
                ) || 0,
            lastCorrect:
                typeof entry.lastCorrect ===
                    "boolean"
                    ? entry.lastCorrect
                    : null,
            lastErrorAt:
                Number(
                    entry.lastErrorAt
                ) || 0
        };
    },

    getSessionGuidance(
        question = {},
        meta = {}
    ) {
        const sourceMode =
            String(
                meta.sourceMode || ""
            ).trim();

        if (
            sourceMode !== "smart" &&
            sourceMode !== "specific" &&
            sourceMode !== "direct_search"
        ) {
            return null;
        }

        const entry =
            this.getQuestionPerformanceEntry(
                question
            );
        const difficulty =
            Number(
                question.difficulty || 1
            ) || 1;
        const topicLabel =
            String(
                question.topicLabel ||
                    "este assunto"
            ).trim();

        if (!entry) {
            return {
                tone: "confidence",
                label: "Primeiro contato",
                message:
                    "Comecando por uma questao de confianca para mapear o ritmo."
            };
        }

        const now = Date.now();
        const daysSinceSeen =
            entry.lastSeen
                ? (
                    now - entry.lastSeen
                ) / 86400000
                : 99;
        const daysSinceError =
            entry.lastErrorAt
                ? (
                    now - entry.lastErrorAt
                ) / 86400000
                : null;
        const accuracy =
            Number(entry.accuracy) || 0;

        if (
            entry.consecutiveErrors >= 2 ||
            (
                entry.lastCorrect === false &&
                daysSinceError !== null &&
                daysSinceError <= 1.5
            ) ||
            (
                daysSinceError !== null &&
                daysSinceError <= 3
            )
        ) {
            return {
                tone: "review",
                label: "Reforco guiado",
                message:
                    "Voltamos um passo para reforcar este ponto sem pressa."
            };
        }

        if (
            daysSinceSeen >= 7 &&
            entry.attempts > 0
        ) {
            return {
                tone: "review",
                label: "Revisao",
                message:
                    "Revisando um ponto visto antes para fixacao."
            };
        }

        if (
            entry.consecutiveHits >= 5 &&
            accuracy >= 0.86 &&
            difficulty >= 4 &&
            !(
                daysSinceError !== null &&
                daysSinceError <= 4
            )
        ) {
            return {
                tone: "challenge",
                label: "Desafio leve",
                message:
                    "Agora vai um desafio leve porque voce manteve consistencia."
            };
        }

        if (
            entry.consecutiveHits >= 3 &&
            accuracy >= 0.76
        ) {
            return {
                tone: "steady",
                label: "Consolidacao",
                message:
                    "Mantendo o ritmo para consolidar antes de subir."
            };
        }

        return {
            tone: "confidence",
            label: topicLabel,
            message:
                "Entrou uma questao de confianca para fixar o assunto."
        };
    },

    getAdaptiveEvidenceProfile(
        ctx,
        performanceMap = null
    ) {
        const sourceMap =
            performanceMap ||
            this.getTopicPerformanceMap(ctx);
        const entries = [
            ...(
                sourceMap instanceof Map
                    ? sourceMap.values()
                    : []
            )
        ];
        const totalAttempts =
            entries.reduce(
                (acc, entry) =>
                    acc +
                    (entry?.attempts || 0),
                0
            );
        const warmupAttempts = 100;
        const warmupProgress =
            this.clamp(
                totalAttempts /
                    warmupAttempts,
                0,
                1
            );

        return {
            totalAttempts,
            warmupAttempts,
            warmupProgress,
            explorationWeight:
                1 - warmupProgress,
            reinforcementWeight:
                0.35 +
                warmupProgress * 0.65
        };
    },

    getTopicWeight(question, ctx, performanceMap) {
        const entry =
            performanceMap.get(
                question.topicKey
            );
        const evidence =
            this.getAdaptiveEvidenceProfile(
                ctx,
                performanceMap
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
        const daysSinceError =
            entry?.lastErrorAt
                ? (
                    now - entry.lastErrorAt
                ) /
                86400000
                : null;
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
                ? 1.15 +
                  this.clamp(
                      daysSinceSeen * 0.22,
                      0,
                      2.3
                  )
                : 0;
        const errorStreakWeight =
            entry?.consecutiveErrors
                ? this.clamp(
                    entry.consecutiveErrors *
                        1.3,
                    0,
                    4
                )
                : 0;
        const freshErrorWeight =
            daysSinceError !== null &&
            daysSinceError <= 4
                ? this.clamp(
                    3.2 - daysSinceError,
                    0.55,
                    3.2
                )
                : 0;
        const masteryDampener =
            entry?.consecutiveHits >= 3 &&
            entry.accuracy >= 0.82
                ? 0.6
                : 1;
        const focusWeight =
            ctx.focoPrincipal ===
            question.topicKey
                ? 2.5
                : 0;
        const topicEvidenceFactor =
            entry
                ? this.clamp(
                    (entry.attempts || 0) /
                        6,
                    0.25,
                    1
                )
                : 0.35;
        const noveltyWeight = entry
            ? 0.32 *
              evidence.explorationWeight
            : 1.35 +
              evidence.explorationWeight *
                  1.45;

        return (
            manualWeight *
                (1.1 +
                    evidence
                        .reinforcementWeight *
                        0.5) +
            errorWeight *
                evidence.reinforcementWeight *
                topicEvidenceFactor +
            recencyWeight +
            (
                reviewWeight +
                errorStreakWeight +
                freshErrorWeight
            ) *
                evidence.reinforcementWeight *
                topicEvidenceFactor *
                masteryDampener +
            focusWeight *
                evidence.reinforcementWeight *
                topicEvidenceFactor +
            noveltyWeight
        );
    },

    getQuestionDifficultyTarget(
        question,
        ctx,
        performanceMap,
        selected,
        size,
        options = {}
    ) {
        const baseTarget =
            this.getDifficultyTarget(
                ctx,
                selected.length,
                size,
                options
            );
        const entry =
            performanceMap.get(
                question.topicKey
            );

        if (!entry) {
            return this.clamp(
                baseTarget - 0.7,
                1,
                7
            );
        }

        const attempts =
            Number(entry.attempts) || 0;
        const accuracy =
            Number(entry.accuracy) || 0;
        const errorStreak =
            Number(
                entry.consecutiveErrors
            ) || 0;
        const hitStreak =
            Number(
                entry.consecutiveHits
            ) || 0;
        const now = Date.now();
        const daysSinceError =
            entry.lastErrorAt
                ? (
                    now - entry.lastErrorAt
                ) / 86400000
                : null;
        let target = baseTarget;

        if (
            attempts < 5 ||
            errorStreak >= 2 ||
            accuracy < 0.55
        ) {
            target -= 1.35;
        } else if (
            hitStreak >= 5 &&
            accuracy >= 0.86
        ) {
            target += 0.8;
        } else if (
            hitStreak >= 3 &&
            accuracy >= 0.76
        ) {
            target += 0.25;
        }

        if (
            daysSinceError !== null &&
            daysSinceError <= 3
        ) {
            target -= 0.8;
        }

        if (
            options.reviewBias &&
            entry.errors > 0
        ) {
            target -= 0.35;
        }

        return this.clamp(
            target,
            1,
            7
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
        const subtopicCountMap =
            selected.reduce(
                (acc, item) => {
                    const key =
                        item.subtopicKey ||
                        item.topicKey ||
                        item.id;
                    acc[key] =
                        (acc[key] || 0) + 1;
                    return acc;
                },
                {}
            );
        const seenTopics = new Set(
            selected.map(
                (item) => item.topicKey
            )
        );
        const seenSubtopics = new Set(
            selected.map(
                (item) =>
                    item.subtopicKey ||
                    item.topicKey ||
                    item.id
            )
        );
        const lastTopic =
            selected.length
                ? selected[
                    selected.length - 1
                ].topicKey
                : null;
        const questionSubtopicKey =
            question.subtopicKey ||
            question.topicKey ||
            question.id;
        const lastSubtopic =
            selected.length
                ? selected[
                    selected.length - 1
                ].subtopicKey ||
                  selected[
                      selected.length - 1
                  ].topicKey ||
                  selected[
                      selected.length - 1
                  ].id
                : null;
        const difficultyTarget =
            this.getQuestionDifficultyTarget(
                question,
                ctx,
                performanceMap,
                selected,
                size,
                options
            );
        const evidence =
            this.getAdaptiveEvidenceProfile(
                ctx,
                performanceMap
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
                ? 2.2 +
                  evidence.explorationWeight *
                      1.35
                : 0;
        const subtopicCoverageBoost =
            !seenSubtopics.has(
                questionSubtopicKey
            )
                ? 1.15 +
                  evidence.explorationWeight *
                      0.7
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
                ? -2.45
                : 0;
        const subtopicRepeatPenalty =
            lastSubtopic ===
                questionSubtopicKey
                ? -1.55
                : 0;
        const saturationPenalty =
            (topicCountMap[
                question.topicKey
            ] || 0) * 1.05;
        const subtopicSaturationPenalty =
            (subtopicCountMap[
                questionSubtopicKey
            ] || 0) * 0.55;
        const reviewBoost =
            options.reviewBias &&
            performanceMap.get(
                question.topicKey
            )?.errors
                ? options.reviewBias +
                  this.clamp(
                      (
                          performanceMap.get(
                              question.topicKey
                          )
                              ?.consecutiveErrors ||
                          0
                      ) * 0.38,
                      0,
                      1.45
                  )
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
            subtopicCoverageBoost +
            subtopicRepeatPenalty -
            subtopicSaturationPenalty +
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

        return this.interleaveTopicsForWarmup(
            this.ensureComfortMix(
                this.ensureTopicDiversity(
                    selected,
                    pool,
                    ctx,
                    size,
                    options
                ),
                pool,
                ctx,
                size,
                options
            ),
            ctx
        );
    },

    getDesiredTopicDiversity(
        selected,
        pool,
        ctx,
        size,
        options = {}
    ) {
        if (
            ctx.mode === "ASSUNTO_UNICO"
        ) {
            return 1;
        }

        const availableTopics = [
            ...new Set(
                (Array.isArray(pool)
                    ? pool
                    : []
                )
                    .map((question) =>
                        question?.topicKey
                    )
                    .filter(Boolean)
            )
        ];
        const availableCount =
            availableTopics.length;

        if (availableCount <= 1) {
            return availableCount;
        }

        const performanceMap =
            this.getTopicPerformanceMap(
                ctx
            );
        const evidence =
            this.getAdaptiveEvidenceProfile(
                ctx,
                performanceMap
            );
        const warmupStage =
            evidence.totalAttempts < 100;

        if (
            options.focusMode ||
            ctx.mode ===
                "REFORCO_DIRECIONADO"
        ) {
            return Math.min(
                2,
                availableCount,
                size
            );
        }

        if (
            warmupStage ||
            options.profile ===
                "alternating"
        ) {
            return Math.min(
                3,
                availableCount,
                size
            );
        }

        return Math.min(
            2,
            availableCount,
            size
        );
    },

    ensureTopicDiversity(
        selected,
        pool,
        ctx,
        size,
        options = {}
    ) {
        const chosen = Array.isArray(
            selected
        )
            ? [...selected]
            : [];
        const desiredTopics =
            this.getDesiredTopicDiversity(
                chosen,
                pool,
                ctx,
                size,
                options
            );

        if (desiredTopics <= 1) {
            return chosen;
        }

        const currentTopics = new Set(
            chosen
                .map((question) =>
                    question?.topicKey
                )
                .filter(Boolean)
        );

        if (
            currentTopics.size >=
            desiredTopics
        ) {
            return chosen;
        }

        const remainingPool =
            this.shuffle(
                (Array.isArray(pool)
                    ? pool
                    : []
                ).filter(
                    (candidate) =>
                        candidate &&
                        !chosen.some(
                            (item) =>
                                item.id ===
                                candidate.id
                        )
                )
            );

        while (
            currentTopics.size <
                desiredTopics &&
            remainingPool.length
        ) {
            const missingTopicQuestion =
                remainingPool.find(
                    (candidate) =>
                        candidate?.topicKey &&
                        !currentTopics.has(
                            candidate.topicKey
                        )
                );

            if (!missingTopicQuestion) {
                break;
            }

            const topicCountMap =
                chosen.reduce(
                    (acc, question) => {
                        if (
                            question?.topicKey
                        ) {
                            acc[
                                question.topicKey
                            ] =
                                (acc[
                                    question
                                        .topicKey
                                ] || 0) + 1;
                        }
                        return acc;
                    },
                    {}
                );
            const replaceIndex =
                chosen
                    .map(
                        (
                            question,
                            index
                        ) => ({
                            index,
                            topicKey:
                                question?.topicKey ||
                                "",
                            count:
                                topicCountMap[
                                    question
                                        ?.topicKey
                                ] || 0
                        })
                    )
                    .filter(
                        (entry) =>
                            entry.count > 1 &&
                            entry.topicKey !==
                                ctx.focoPrincipal
                    )
                    .sort(
                        (left, right) =>
                            right.count -
                                left.count ||
                            right.index -
                                left.index
                    )[0]?.index;

            const safeIndex =
                Number.isInteger(
                    replaceIndex
                )
                    ? replaceIndex
                    : chosen.length - 1;

            chosen.splice(
                safeIndex,
                1,
                missingTopicQuestion
            );
            currentTopics.add(
                missingTopicQuestion.topicKey
            );

            const usedIds = new Set(
                chosen.map(
                    (item) => item.id
                )
            );
            const nextPoolIndex =
                remainingPool.findIndex(
                    (candidate) =>
                        candidate.id ===
                        missingTopicQuestion.id
                );

            if (nextPoolIndex >= 0) {
                remainingPool.splice(
                    nextPoolIndex,
                    1
                );
            }

            for (
                let index =
                    remainingPool.length - 1;
                index >= 0;
                index -= 1
            ) {
                if (
                    usedIds.has(
                        remainingPool[index]
                            ?.id
                    )
                ) {
                    remainingPool.splice(
                        index,
                        1
                    );
                }
            }
        }

        return chosen;
    },

    ensureComfortMix(
        selected,
        pool,
        ctx,
        size,
        options = {}
    ) {
        const chosen = Array.isArray(
            selected
        )
            ? [...selected]
            : [];

        if (
            chosen.length < 3 ||
            options.profile === "proof"
        ) {
            return chosen;
        }

        const getDifficulty = (
            question
        ) =>
            Number(question?.difficulty) ||
            1;
        const isConfidence = (
            question
        ) => getDifficulty(question) <= 3;
        const isChallenge = (
            question
        ) => getDifficulty(question) >= 5;
        const available =
            Array.isArray(pool)
                ? pool.filter(Boolean)
                : [];
        const usedIds = () =>
            new Set(
                chosen.map(
                    (question) =>
                        question?.id || ""
                )
            );
        const findCandidate = (
            predicate,
            used
        ) =>
            available
                .filter(
                    (question) =>
                        question &&
                        !used.has(
                            question.id
                        ) &&
                        predicate(question)
                )
                .sort(
                    (left, right) =>
                        getDifficulty(left) -
                        getDifficulty(right)
                )[0] || null;
        const findReplaceIndex = (
            predicate
        ) => {
            const candidates =
                chosen
                    .map(
                        (
                            question,
                            index
                        ) => ({
                            question,
                            index
                        })
                    )
                    .filter(
                        ({ question }) =>
                            predicate(question) &&
                            question?.topicKey !==
                                ctx.focoPrincipal
                    )
                    .sort(
                        (left, right) =>
                            getDifficulty(
                                right.question
                            ) -
                                getDifficulty(
                                    left.question
                                ) ||
                            right.index -
                                left.index
                    );

            if (candidates.length) {
                return candidates[0].index;
            }

            return chosen.findIndex(
                predicate
            );
        };

        if (
            !chosen.some(isConfidence)
        ) {
            const candidate =
                findCandidate(
                    isConfidence,
                    usedIds()
                );
            const replaceIndex =
                candidate
                    ? findReplaceIndex(
                        (question) =>
                            isChallenge(
                                question
                            ) ||
                            !isConfidence(
                                question
                            )
                    )
                    : -1;

            if (
                candidate &&
                replaceIndex >= 0
            ) {
                chosen.splice(
                    replaceIndex,
                    1,
                    candidate
                );
            }
        }

        const maxChallengeCount =
            Math.max(
                1,
                Math.ceil(
                    chosen.length *
                        (
                            options.focusMode
                                ? 0.45
                                : 0.35
                        )
                )
            );

        while (
            chosen.filter(isChallenge)
                .length > maxChallengeCount
        ) {
            const candidate =
                findCandidate(
                    (question) =>
                        getDifficulty(
                            question
                        ) <= 4,
                    usedIds()
                );
            const replaceIndex =
                candidate
                    ? findReplaceIndex(
                        isChallenge
                    )
                    : -1;

            if (
                !candidate ||
                replaceIndex < 0
            ) {
                break;
            }

            chosen.splice(
                replaceIndex,
                1,
                candidate
            );
        }

        return chosen;
    },

    interleaveTopicsForWarmup(
        selected,
        ctx
    ) {
        const chosen = Array.isArray(
            selected
        )
            ? [...selected]
            : [];

        if (
            ctx.mode === "ASSUNTO_UNICO"
        ) {
            return chosen;
        }

        const performanceMap =
            this.getTopicPerformanceMap(
                ctx
            );
        const evidence =
            this.getAdaptiveEvidenceProfile(
                ctx,
                performanceMap
            );
        const distinctTopics = [
            ...new Set(
                chosen
                    .map((question) =>
                        question?.topicKey
                    )
                    .filter(Boolean)
            )
        ];

        if (
            evidence.totalAttempts >=
                100 ||
            distinctTopics.length <= 1
        ) {
            return chosen;
        }

        const buckets = new Map();

        chosen.forEach((question) => {
            const key =
                question?.topicKey ||
                question?.id ||
                "";

            if (!buckets.has(key)) {
                buckets.set(key, []);
            }

            buckets.get(key).push(
                question
            );
        });

        const result = [];
        let lastTopicKey = "";

        while (
            result.length < chosen.length
        ) {
            const nextKey =
                [...buckets.entries()]
                    .filter(
                        ([, items]) =>
                            items.length
                    )
                    .sort(
                        (left, right) =>
                            right[1].length -
                                left[1].length ||
                            left[0].localeCompare(
                                right[0],
                                "pt-BR"
                            )
                    )
                    .find(
                        ([topicKey]) =>
                            topicKey !==
                            lastTopicKey
                    )?.[0] ||
                [...buckets.entries()]
                    .find(
                        ([, items]) =>
                            items.length
                    )?.[0];

            if (!nextKey) {
                break;
            }

            const bucket =
                buckets.get(nextKey) || [];
            const nextQuestion =
                bucket.shift();

            if (!nextQuestion) {
                continue;
            }

            result.push(nextQuestion);
            lastTopicKey =
                nextQuestion.topicKey ||
                nextQuestion.id ||
                "";
        }

        return result.length ===
            chosen.length
            ? result
            : chosen;
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
                reviewBias: 0.95
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
                reviewBias: 1.45,
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
                reviewBias: 1.05
            }
        );
    },

    buildSession(page) {
        const ctx =
            QuestionsContext.get();
        const effectiveTopics =
            this.getWarmupExpandedTopicKeys(
                page,
                ctx
            );
        const effectiveContext = {
            ...ctx,
            topicos:
                effectiveTopics.length
                    ? effectiveTopics
                    : ctx.topicos
        };
        const pool =
            this.getQuestionPool(
                page,
                effectiveContext
            );
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
                effectiveContext,
                sessionSize,
                {
                    profile: "single",
                    enforceCoverage: false,
                    reviewBias: 0.9
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
                    effectiveContext,
                    sessionSize
                );
            }

            if (
                ctx.estrategiaMistura ===
                "alternada"
            ) {
                return this.buildAlternatingSession(
                    pool,
                    effectiveContext,
                    sessionSize
                );
            }

            return this.buildBalancedSession(
                pool,
                effectiveContext,
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
                    effectiveContext,
                    sessionSize
                )
                : this.buildFocusedSession(
                    pool,
                    effectiveContext,
                    sessionSize
                );
        }

        return this.buildProofSession(
            pool,
            effectiveContext,
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

    getEstimatedDurationFromCount(
        count = 0
    ) {
        const safeCount =
            Math.max(
                Number(count) || 0,
                0
            );

        if (!safeCount) {
            return "0 min";
        }

        const totalSeconds =
            safeCount * 25;
        const minutes =
            Math.max(
                1,
                Math.ceil(totalSeconds / 60)
            );

        return `${minutes} min`;
    },

    getSmartQuestionLimit(
        context = null
    ) {
        const ctx =
            context ||
            QuestionsContext.get();

        if (
            ctx.smartQuestionCount === null
        ) {
            return null;
        }

        return Math.max(
            1,
            Number(
                ctx.smartQuestionCount ||
                    ctx.quantidadeQuestoes
            ) || 5
        );
    },

    getSmartTimeLimitMinutes(
        context = null
    ) {
        const ctx =
            context ||
            QuestionsContext.get();

        if (
            ctx.smartTimeMinutes === null
        ) {
            return null;
        }

        return Math.max(
            1,
            Number(
                ctx.smartTimeMinutes
            ) || 15
        );
    },

    getTrainingModeLabel(
        context = null
    ) {
        const questionLimit =
            this.getSmartQuestionLimit(
                context
            );
        const timeLimitMinutes =
            this.getSmartTimeLimitMinutes(
                context
            );

        if (
            questionLimit !== null &&
            timeLimitMinutes !== null
        ) {
            return "Primeiro limite";
        }

        if (questionLimit !== null) {
            return "Por quantidade";
        }

        if (timeLimitMinutes !== null) {
            return "Por tempo";
        }

        return "Livre";
    },

    getTrainingValueLabel(
        context = null
    ) {
        const questionLimit =
            this.getSmartQuestionLimit(
                context
            );
        const timeLimitMinutes =
            this.getSmartTimeLimitMinutes(
                context
            );

        if (
            questionLimit !== null &&
            timeLimitMinutes !== null
        ) {
            return `${String(
                questionLimit
            ).padStart(
                2,
                "0"
            )} questoes ou ${timeLimitMinutes} min`;
        }

        if (questionLimit !== null) {
            return `${String(
                questionLimit
            ).padStart(2, "0")} questoes`;
        }

        if (timeLimitMinutes !== null) {
            return `${timeLimitMinutes} min`;
        }

        return "Livre";
    },

    getResolvedSessionAmount(
        page,
        context = null,
        availableCount = 0
    ) {
        const ctx =
            context ||
            QuestionsContext.get();
        const safeAvailableCount =
            Math.max(
                Number(availableCount) || 0,
                0
            );
        const questionLimit =
            this.getSmartQuestionLimit(ctx);
        const timeLimitMinutes =
            this.getSmartTimeLimitMinutes(
                ctx
            );
        const limits = [];

        if (questionLimit !== null) {
            limits.push(questionLimit);
        }

        if (timeLimitMinutes !== null) {
            const targetMinutes =
                Math.max(1, timeLimitMinutes);
            const timeBasedCount =
                Math.max(
                    1,
                    Math.floor(
                        (targetMinutes * 60) /
                            25
                    )
                );

            limits.push(timeBasedCount);
        }

        if (!limits.length) {
            return safeAvailableCount;
        }

        const requestedCount =
            Math.min(...limits);

        return safeAvailableCount
            ? Math.min(
                requestedCount,
                safeAvailableCount
            )
            : requestedCount;
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
        const canUseDetailedPool =
            this.shouldUseDetailedQuestionPool(
                page
            );
        const requestedCount =
            Math.max(
                1,
                Number(
                    ctx.quantidadeQuestoes
                ) || 5
            );
        const availableCount =
            canUseDetailedPool
                ? pool.length
                : selectedTopics.reduce(
                    (acc, topic) =>
                        acc +
                        (Number(
                            topic.count
                        ) || 0),
                    0
                );
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
                canUseDetailedPool
                    ? this.getEstimatedDurationLabel(
                        pool,
                        readyCount
                    )
                    : this.getEstimatedDurationFromCount(
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

        if (
            question.type === "vf" ||
            question.type ===
                "multipla_escolha" ||
            question.type === "comparacao"
        ) {
            const correctIndex =
                this.getCorrectChoiceIndex(
                    question
                );

            if (
                Number.isInteger(
                    correctIndex
                )
            ) {
                return (
                    this.getChoiceLabel(
                        question,
                        correctIndex
                    ) ||
                    String(correctIndex)
                );
            }

            if (question.type === "vf") {
                return correctIndex === 0
                    ? "Verdadeiro"
                    : "Falso";
            }

            return String(
                question.correct ?? ""
            );
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

    getCorrectChoiceIndex(question) {
        if (!question) {
            return null;
        }

        if (question.type === "vf") {
            if (
                question.correct === true
            ) {
                return 0;
            }

            if (
                question.correct === false
            ) {
                return 1;
            }
        }

        const resolved =
            this.resolveChoiceCorrectIndex(
                question.correct,
                question.options
            );

        return Number.isInteger(resolved)
            ? resolved
            : null;
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
        const correctIndex =
            this.getCorrectChoiceIndex(
                question
            );

        if (
            Number.isInteger(correctIndex)
        ) {
            correct =
                Number(selectedIndex) ===
                Number(correctIndex);
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
            questionId:
                String(question.id || "").trim(),
            baseKey:
                String(question.baseKey || "").trim(),
            baseLabel:
                String(question.baseLabel || "").trim(),
            subjectKey:
                String(question.subjectKey || "").trim(),
            subjectLabel:
                String(
                    question.subjectLabel || ""
                ).trim(),
            topicKey:
                String(question.topicKey || "").trim(),
            topicLabel:
                String(question.topicLabel || "").trim(),
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
                Math.max(
                    1,
                    Number(
                        ctx.quantidadeQuestoes
                    ) || 5
                ),
            trainingModeLabel:
                this.getTrainingModeLabel(
                    ctx
                ),
            trainingValueLabel:
                this.getTrainingValueLabel(
                    ctx
                ),
            focusLabel:
                focusTopic?.label || "",
            strategyLabel:
                strategy?.label || "",
            availableCount:
                validation.availableCount,
            smartTimeLimitMinutes:
                this.getSmartTimeLimitMinutes(
                    ctx
                ),
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
                String(
                    entry?.topicKey ||
                        entry?.question
                            ?.topicKey ||
                        ""
                ).trim() || "geral";
            const topicLabel =
                String(
                    entry?.topicLabel ||
                        entry?.question
                            ?.topicLabel ||
                        ""
                ).trim() ||
                "Geral";
            const current =
                grouped.get(topicKey) || {
                    topicKey,
                    topicLabel,
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
            elapsedAnsweredMs:
                safeResults.reduce(
                    (acc, item) =>
                        acc +
                        (Number(
                            item?.timeMs
                        ) || 0),
                    0
                ),
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
        const eligibleSubjectTopics =
            this.getTopicOptions(page, {
                serie: ctx.serie,
                materia: ctx.materia
            })
                .filter((topic) =>
                    Number(topic?.count || 0) > 0
                )
                .map((topic) => topic.key);

        if (
            intent === "weak_topic" &&
            sessionSummary.weakTopic
        ) {
            const topicos =
                this.getWarmupExpandedTopicKeys(
                    page,
                    {
                        ...ctx,
                        mode: "REFORCO_DIRECIONADO",
                        topicos: [
                            sessionSummary
                                .weakTopic
                                .topicKey
                        ],
                        focoPrincipal:
                            sessionSummary
                                .weakTopic
                                .topicKey
                    },
                    [
                        sessionSummary.weakTopic
                            .topicKey
                    ]
                );
            return {
                mode:
                    topicos.length > 1
                        ? "REFORCO_DIRECIONADO"
                        : "ASSUNTO_UNICO",
                topicos:
                    topicos.length
                        ? topicos
                        : [
                            sessionSummary
                                .weakTopic
                                .topicKey
                        ],
                focoPrincipal:
                    topicos.length > 1
                        ? sessionSummary
                              .weakTopic
                              .topicKey
                        : null,
                estrategiaMistura:
                    topicos.length > 1
                        ? "foco_principal"
                        : "equilibrada"
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

        const mixedTopics = [
            ...new Set([
                ...uniqueReviewTopics,
                ...currentTopics,
                ...eligibleSubjectTopics
            ])
        ].slice(0, 4);

        return {
            mode:
                mixedTopics.length > 1
                    ? "TREINO_PARA_PROVA"
                    : "ASSUNTO_UNICO",
            topicos:
                mixedTopics.length
                    ? mixedTopics
                    : currentTopics,
            focoPrincipal: null,
            estrategiaMistura:
                mixedTopics.length > 1
                    ? "equilibrada"
                    : "equilibrada"
        };
    }
};



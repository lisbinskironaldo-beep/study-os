window.QuestionsStore = {
    key: "questions_profile_v4",
    runsKey: "questions_runs_v2",
    questionReportsKey:
        "questions_reports_v2",
    saveTimer: null,
    runsSaveTimer: null,
    questionReportsSaveTimer: null,
    smartProfilesSaveTimer: null,
    savedBlocksSaveTimer: null,
    runsRepository: null,
    profileStateRepository: null,
    smartProfilesRepository: null,
    savedBlocksRepository: null,
    profileStateDirty: false,

    data: {
        topics: {},
        sessions: [],
        questionReports: [],
        smartProfiles: [],
        savedBlocks: [],
        runs: []
    },

    load() {
        this.profileStateDirty = false;

        if (this.profileStateRepository) {
            const loaded =
                this.profileStateRepository.load();

            this.data = {
                topics: {},
                sessions: [],
                questionReports: [],
                smartProfiles: [],
                savedBlocks: [],
                runs: [],
                ...(loaded || {})
            };
            this.loadSmartProfiles();
            this.loadSavedBlocks();
            this.loadRuns();
            this.loadQuestionReports();
            return;
        }

        const saved =
            localStorage.getItem(this.key);

        if (!saved) {
            this.data = {
                topics: {},
                sessions: [],
                questionReports: [],
                smartProfiles: [],
                savedBlocks: [],
                runs: []
            };
            this.loadSmartProfiles();
            this.loadSavedBlocks();
            this.loadRuns();
            this.loadQuestionReports();
            return;
        }

        try {
            const parsed =
                JSON.parse(saved);

            this.data = {
                topics: {},
                sessions: [],
                questionReports: [],
                smartProfiles: [],
                savedBlocks: [],
                runs: [],
                ...(parsed || {})
            };
        } catch (_error) {
            this.data = {
                topics: {},
                sessions: [],
                questionReports: [],
                smartProfiles: [],
                savedBlocks: [],
                runs: []
            };
        }

        if (
            !this.data.topics ||
            typeof this.data.topics !== "object"
        ) {
            this.data.topics = {};
        }

        if (
            !Array.isArray(
                this.data.sessions
            )
        ) {
            this.data.sessions = [];
        }

        if (
            !Array.isArray(
                this.data.questionReports
            )
        ) {
            this.data.questionReports = [];
        }

        if (
            !Array.isArray(
                this.data.smartProfiles
            )
        ) {
            this.data.smartProfiles = [];
        }

        if (
            !Array.isArray(
                this.data.savedBlocks
            )
        ) {
            this.data.savedBlocks = [];
        }

        this.loadSmartProfiles();
        this.loadSavedBlocks();
        this.loadRuns();
        this.loadQuestionReports();
    },

    save(immediate = false) {
        this.profileStateDirty = false;

        if (this.profileStateRepository) {
            if (this.saveTimer) {
                clearTimeout(this.saveTimer);
                this.saveTimer = null;
            }

            const write = () => {
                const payload = {
                    topics:
                        this.data.topics || {},
                    sessions:
                        this.data.sessions || []
                };

                if (
                    !this.smartProfilesRepository
                ) {
                    payload.smartProfiles =
                        this.data
                            .smartProfiles ||
                        [];
                }

                if (
                    !this.savedBlocksRepository
                ) {
                    payload.savedBlocks =
                        this.data
                            .savedBlocks ||
                        [];
                }

                this.profileStateRepository.save(
                    payload
                );
            };

            if (immediate) {
                write();
                return;
            }

            this.saveTimer = setTimeout(() => {
                this.saveTimer = null;
                write();
            }, 80);
            return;
        }

        if (this.saveTimer) {
            clearTimeout(this.saveTimer);
            this.saveTimer = null;
        }

        const write = () => {
            localStorage.setItem(
                this.key,
                JSON.stringify({
                    topics:
                        this.data.topics || {},
                    sessions:
                        this.data.sessions || [],
                    smartProfiles:
                        this.data.smartProfiles ||
                        [],
                    savedBlocks:
                        this.data.savedBlocks ||
                        []
                })
            );
        };

        if (immediate) {
            write();
            return;
        }

        this.saveTimer = setTimeout(() => {
            this.saveTimer = null;
            write();
        }, 80);
    },

    markProfileStateDirty() {
        this.profileStateDirty = true;
    },

    flushProfileState(immediate = false) {
        if (!this.profileStateDirty) {
            return false;
        }

        this.save(immediate);
        return true;
    },

    loadRuns() {
        if (this.runsRepository) {
            this.data.runs =
                this.runsRepository.list();
            return;
        }

        const saved =
            localStorage.getItem(
                this.runsKey
            );

        if (!saved) {
            this.data.runs = [];
            return;
        }

        try {
            const parsed =
                JSON.parse(saved);
            this.data.runs = Array.isArray(
                parsed
            )
                ? parsed.map((run) => {
                    const questionIds =
                        this.normalizeQuestionIds(
                            run?.questionIds
                        );

                    return {
                        ...(run || {}),
                        questionIds,
                        sessionSnapshot:
                            this.compactSessionSnapshot(
                                questionIds,
                                run?.sessionSnapshot
                            ),
                        answers:
                            this.compactAnswerList(
                                run?.answers
                            ),
                        lastAnswer:
                            this.compactAnswerRecord(
                                run?.lastAnswer
                            )
                    };
                })
                : [];
        } catch (_error) {
            this.data.runs = [];
        }
    },

    saveRuns(immediate = false) {
        if (this.runsRepository) {
            if (this.runsSaveTimer) {
                clearTimeout(
                    this.runsSaveTimer
                );
                this.runsSaveTimer = null;
            }

            const write = () => {
                this.runsRepository.saveAll(
                    this.data.runs || []
                );
            };

            if (immediate) {
                write();
                return;
            }

            this.runsSaveTimer =
                setTimeout(() => {
                    this.runsSaveTimer =
                        null;
                    write();
                }, 80);
            return;
        }

        if (this.runsSaveTimer) {
            clearTimeout(this.runsSaveTimer);
            this.runsSaveTimer = null;
        }

        const write = () => {
            localStorage.setItem(
                this.runsKey,
                JSON.stringify(
                    this.data.runs || []
                )
            );
        };

        if (immediate) {
            write();
            return;
        }

        this.runsSaveTimer = setTimeout(() => {
            this.runsSaveTimer = null;
            write();
        }, 80);
    },

    loadQuestionReports() {
        if (
            typeof localStorage === "undefined"
        ) {
            if (
                !Array.isArray(
                    this.data.questionReports
                )
            ) {
                this.data.questionReports = [];
            }
            return;
        }

        try {
            const saved =
                localStorage.getItem(
                    this.questionReportsKey
                );

            if (saved) {
                const parsed =
                    JSON.parse(saved);
                this.data.questionReports =
                    Array.isArray(parsed)
                        ? parsed
                        : [];
                return;
            }
        } catch (_error) {
            this.data.questionReports = [];
            return;
        }

        this.data.questionReports =
            Array.isArray(
                this.data.questionReports
            )
                ? this.data.questionReports
                : [];
    },

    saveQuestionReports(
        immediate = false
    ) {
        if (
            typeof localStorage === "undefined"
        ) {
            return;
        }

        if (this.questionReportsSaveTimer) {
            clearTimeout(
                this.questionReportsSaveTimer
            );
            this.questionReportsSaveTimer =
                null;
        }

        const write = () => {
            try {
                localStorage.setItem(
                    this.questionReportsKey,
                    JSON.stringify(
                        this.data
                            .questionReports || []
                    )
                );
            } catch (_error) {
                return;
            }
        };

        if (immediate) {
            write();
            return;
        }

        this.questionReportsSaveTimer =
            setTimeout(() => {
                this.questionReportsSaveTimer =
                    null;
                write();
            }, 80);
    },

    loadSmartProfiles() {
        if (this.smartProfilesRepository) {
            this.data.smartProfiles =
                this.smartProfilesRepository.list();
            return;
        }

        if (
            !Array.isArray(
                this.data.smartProfiles
            )
        ) {
            this.data.smartProfiles = [];
        }
    },

    saveSmartProfiles(
        immediate = false
    ) {
        if (this.smartProfilesRepository) {
            if (this.smartProfilesSaveTimer) {
                clearTimeout(
                    this.smartProfilesSaveTimer
                );
                this.smartProfilesSaveTimer =
                    null;
            }

            const write = () => {
                this.smartProfilesRepository.saveAll(
                    this.data.smartProfiles || []
                );
            };

            if (immediate) {
                write();
                return;
            }

            this.smartProfilesSaveTimer =
                setTimeout(() => {
                    this.smartProfilesSaveTimer =
                        null;
                    write();
                }, 80);
            return;
        }

        this.save(immediate);
    },

    loadSavedBlocks() {
        if (this.savedBlocksRepository) {
            this.data.savedBlocks =
                this.savedBlocksRepository.list();
            return;
        }

        if (
            !Array.isArray(
                this.data.savedBlocks
            )
        ) {
            this.data.savedBlocks = [];
        }
    },

    saveSavedBlocks(
        immediate = false
    ) {
        if (this.savedBlocksRepository) {
            if (this.savedBlocksSaveTimer) {
                clearTimeout(
                    this.savedBlocksSaveTimer
                );
                this.savedBlocksSaveTimer =
                    null;
            }

            const write = () => {
                this.savedBlocksRepository.saveAll(
                    this.data.savedBlocks || []
                );
            };

            if (immediate) {
                write();
                return;
            }

            this.savedBlocksSaveTimer =
                setTimeout(() => {
                    this.savedBlocksSaveTimer =
                        null;
                    write();
                }, 80);
            return;
        }

        this.save(immediate);
    },

    setRunsRepository(
        repository = null,
        options = {}
    ) {
        this.runsRepository =
            repository || null;

        if (options.reload) {
            this.loadRuns();
        }
    },

    setProfileStateRepository(
        repository = null,
        options = {}
    ) {
        this.profileStateRepository =
            repository || null;

        if (options.reload) {
            this.load();
        }
    },

    setSmartProfilesRepository(
        repository = null,
        options = {}
    ) {
        this.smartProfilesRepository =
            repository || null;

        if (options.reload) {
            this.loadSmartProfiles();
        }
    },

    setSavedBlocksRepository(
        repository = null,
        options = {}
    ) {
        this.savedBlocksRepository =
            repository || null;

        if (options.reload) {
            this.loadSavedBlocks();
        }
    },

    normalizeQuestionIds(
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
    },

    compactSessionSnapshot(
        questionIds = [],
        sessionSnapshot = []
    ) {
        if (
            Array.isArray(questionIds) &&
            questionIds.length
        ) {
            return [];
        }

        return Array.isArray(
            sessionSnapshot
        )
            ? [...sessionSnapshot]
            : [];
    },

    compactAnswerRecord(answer = null) {
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
                answer.selectedIndex ??
                null,
            selectedValue:
                Object.prototype.hasOwnProperty.call(
                    answer,
                    "selectedValue"
                )
                    ? answer.selectedValue
                    : null,
            selectedAnswerLabel:
                String(
                    answer.selectedAnswerLabel ||
                        ""
                ).trim(),
            correctAnswerLabel:
                String(
                    answer.correctAnswerLabel ||
                        ""
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
    },

    compactAnswerList(answers = []) {
        return Array.isArray(answers)
            ? answers
                .map((answer) =>
                    this.compactAnswerRecord(
                        answer
                    )
                )
                .filter(Boolean)
            : [];
    },

    getTopicStorageKey(meta) {
        return [
            meta.baseKey,
            meta.subjectKey,
            meta.topicKey
        ].join("::");
    },

    registerAnswer(meta, correct, timeMs) {
        const key =
            this.getTopicStorageKey(meta);
        const current =
            this.data.topics[key] || {
                baseKey: meta.baseKey,
                baseLabel: meta.baseLabel,
                subjectKey: meta.subjectKey,
                subjectLabel: meta.subjectLabel,
                topicKey: meta.topicKey,
                topicLabel: meta.topicLabel,
                hits: 0,
                errors: 0,
                attempts: 0,
                avgTime: 0,
                lastSeen: 0
            };

        current.attempts += 1;

        if (correct) {
            current.hits += 1;
        } else {
            current.errors += 1;
        }

        current.avgTime =
            current.avgTime > 0
                ? (
                    (
                        current.avgTime *
                        (current.attempts - 1)
                    ) +
                    timeMs
                ) / current.attempts
                : timeMs;

        current.lastSeen = Date.now();
        this.data.topics[key] = current;
        this.markProfileStateDirty();
    },

    registerSession(session = {}) {
        const next = {
            id:
                session.id ||
                `session_${Date.now()}`,
            createdAt:
                session.createdAt ||
                Date.now(),
            ...session
        };

        this.data.sessions = [
            next,
            ...(this.data.sessions || [])
        ].slice(0, 40);

        this.markProfileStateDirty();
    },

    getQuestionReports(
        questionId = ""
    ) {
        const cleanQuestionId =
            String(questionId || "").trim();

        return [
            ...(this.data.questionReports ||
                [])
        ]
            .filter((report) =>
                cleanQuestionId
                    ? String(
                        report.questionId
                    ) === cleanQuestionId
                    : true
            )
            .sort(
                (left, right) =>
                    (right.createdAt || 0) -
                    (left.createdAt || 0)
            );
    },

    getLatestQuestionReport(
        questionId = ""
    ) {
        return (
            this.getQuestionReports(
                questionId
            )[0] || null
        );
    },

    saveQuestionReport(
        report = {}
    ) {
        const now = Date.now();
        const next = {
            id:
                report.id ||
                `question_report_${now}`,
            questionId: String(
                report.questionId || ""
            ).trim(),
            prompt: String(
                report.prompt || ""
            ).trim(),
            explanation: String(
                report.explanation || ""
            ).trim(),
            message: String(
                report.message || ""
            ).trim(),
            status:
                String(
                    report.status || "sent"
                ).trim() || "sent",
            createdAt:
                Number(
                    report.createdAt
                ) || now,
            updatedAt: now,
            meta:
                report.meta &&
                typeof report.meta ===
                    "object"
                    ? {
                        ...report.meta
                    }
                    : {}
        };

        if (!next.questionId) {
            return null;
        }

        this.data.questionReports = [
            next,
            ...(
                this.data
                    .questionReports || []
            ).filter(
                (entry) =>
                    String(entry.id) !==
                    String(next.id)
            )
        ].slice(0, 200);

        this.saveQuestionReports();

        return next;
    },

    getSmartProfiles() {
        return [
            ...(this.data.smartProfiles || [])
        ].sort(
            (left, right) =>
                (right.updatedAt || 0) -
                (left.updatedAt || 0)
        );
    },

    getSmartProfileById(profileId) {
        return this.getSmartProfiles().find(
            (profile) =>
                String(profile.id) ===
                String(profileId)
        ) || null;
    },

    saveSmartProfile(profile = {}) {
        const now = Date.now();
        const next = {
            id:
                profile.id ||
                `smart_profile_${now}`,
            name:
                String(
                    profile.name ||
                        "Perfil inteligente"
                ).trim() ||
                "Perfil inteligente",
            createdAt:
                Number(
                    profile.createdAt
                ) || now,
            updatedAt: now,
            smartGoal:
                String(
                    profile.smartGoal ||
                        "continue"
                ).trim() || "continue",
            selectedSeries:
                Array.isArray(
                    profile.selectedSeries
                )
                    ? [
                        ...new Set(
                            profile.selectedSeries
                                .map((item) =>
                                    Number(item)
                                )
                                .filter((item) =>
                                    Number.isFinite(
                                        item
                                    )
                                )
                        )
                    ]
                    : [],
            selectedSubjects:
                Array.isArray(
                    profile.selectedSubjects
                )
                    ? [
                        ...new Set(
                            profile.selectedSubjects
                                .map((item) =>
                                    String(
                                        item || ""
                                    )
                                        .trim()
                                        .toLowerCase()
                                )
                                .filter(Boolean)
                        )
                    ]
                    : [],
            excludedSeries:
                Array.isArray(
                    profile.excludedSeries
                )
                    ? [
                        ...new Set(
                            profile.excludedSeries
                                .map((item) =>
                                    Number(item)
                                )
                                .filter((item) =>
                                    Number.isFinite(
                                        item
                                    )
                                )
                        )
                    ]
                    : [],
            excludedBases:
                Array.isArray(
                    profile.excludedBases
                )
                    ? [
                        ...new Set(
                            profile.excludedBases
                                .map((item) =>
                                    String(
                                        item || ""
                                    )
                                        .trim()
                                        .toUpperCase()
                                )
                                .filter(Boolean)
                        )
                    ]
                    : [],
            excludedSubjects:
                Array.isArray(
                    profile.excludedSubjects
                )
                    ? [
                        ...new Set(
                            profile.excludedSubjects
                                .map((item) =>
                                    String(
                                        item || ""
                                    )
                                        .trim()
                                        .toLowerCase()
                                )
                                .filter(Boolean)
                        )
                    ]
                    : [],
            preferredAmount:
                Number(
                    profile.preferredAmount
                ) || null,
            sessionMetric:
                String(
                    profile.sessionMetric ||
                        "quantidade"
                )
                    .trim()
                    .toLowerCase() === "tempo"
                    ? "tempo"
                    : "quantidade",
            questionCount:
                profile.questionCount === null
                    ? null
                    : Math.max(
                        1,
                        Number(
                            profile.questionCount
                        ) || 5
                    ),
            timeMinutes:
                profile.timeMinutes === null
                    ? null
                    : Math.max(
                        1,
                        Number(
                            profile.timeMinutes
                        ) || 15
                    ),
            notes:
                String(
                    profile.notes || ""
                ).trim(),
            lastUsedAt:
                Number(
                    profile.lastUsedAt
                ) || 0
        };
        const list =
            this.getSmartProfiles().filter(
                (entry) =>
                    String(entry.id) !==
                    String(next.id)
            );

        this.data.smartProfiles = [
            next,
            ...list
        ].slice(0, 40);
        this.saveSmartProfiles();

        return next;
    },

    deleteSmartProfile(profileId) {
        const before =
            (this.data.smartProfiles || [])
                .length;

        this.data.smartProfiles =
            (this.data.smartProfiles || []).filter(
                (profile) =>
                    String(profile.id) !==
                    String(profileId)
            );

        if (
            this.data.smartProfiles.length !==
            before
        ) {
            this.saveSmartProfiles();
            return true;
        }

        return false;
    },

    markSmartProfileUsed(profileId) {
        const profile =
            this.getSmartProfileById(profileId);

        if (!profile) {
            return null;
        }

        return this.saveSmartProfile({
            ...profile,
            lastUsedAt: Date.now()
        });
    },

    getSavedBlocks(filters = {}) {
        return [
            ...(this.data.savedBlocks || [])
        ]
            .filter((block) => {
                if (
                    filters.mode &&
                    block.mode !== filters.mode
                ) {
                    return false;
                }

                return true;
            })
            .sort(
                (left, right) =>
                    (right.updatedAt || 0) -
                    (left.updatedAt || 0)
            );
    },

    getSavedBlockById(blockId) {
        return this.getSavedBlocks().find(
            (block) =>
                String(block.id) ===
                String(blockId)
        ) || null;
    },

    saveSavedBlock(block = {}) {
        const now = Date.now();
        const questionIds =
            this.normalizeQuestionIds(
                block.questionIds
            );
        const next = {
            id:
                block.id ||
                `saved_block_${now}`,
            name:
                String(
                    block.name ||
                        "Bloco salvo"
                ).trim() || "Bloco salvo",
            mode:
                String(
                    block.mode || "specific"
                ).trim() || "specific",
            createdAt:
                Number(
                    block.createdAt
                ) || now,
            updatedAt: now,
            lastUsedAt:
                Number(
                    block.lastUsedAt
                ) || 0,
            launcherContext:
                block.launcherContext &&
                typeof block.launcherContext ===
                    "object"
                    ? {
                        ...block.launcherContext
                    }
                    : {},
            routeSnapshot:
                block.routeSnapshot &&
                typeof block.routeSnapshot ===
                    "object"
                    ? {
                        ...block.routeSnapshot,
                        context:
                            block.routeSnapshot
                                .context &&
                            typeof block
                                .routeSnapshot
                                .context ===
                                "object"
                                ? {
                                    ...block
                                        .routeSnapshot
                                        .context
                                }
                                : {},
                        meta:
                            block.routeSnapshot
                                .meta &&
                            typeof block
                                .routeSnapshot
                                .meta ===
                                "object"
                                ? {
                                    ...block
                                        .routeSnapshot
                                        .meta
                                }
                                : {}
                    }
                    : {
                        context: {},
                        meta: {}
                    },
            questionIds,
            sessionSnapshot:
                this.compactSessionSnapshot(
                    questionIds,
                    block.sessionSnapshot
                ),
            profileId:
                String(
                    block.profileId || ""
                ).trim()
        };
        const list =
            this.getSavedBlocks().filter(
                (entry) =>
                    String(entry.id) !==
                    String(next.id)
            );

        this.data.savedBlocks = [
            next,
            ...list
        ].slice(0, 80);
        this.saveSavedBlocks();

        return next;
    },

    deleteSavedBlock(blockId) {
        const before =
            (this.data.savedBlocks || [])
                .length;

        this.data.savedBlocks = (
            this.data.savedBlocks || []
        ).filter(
            (block) =>
                String(block.id) !==
                String(blockId)
        );

        if (
            this.data.savedBlocks.length !==
            before
        ) {
            this.saveSavedBlocks();
            return true;
        }

        return false;
    },

    markSavedBlockUsed(blockId) {
        const block =
            this.getSavedBlockById(blockId);

        if (!block) {
            return null;
        }

        return this.saveSavedBlock({
            ...block,
            lastUsedAt: Date.now()
        });
    },

    getRuns(filters = {}) {
        return [
            ...(this.data.runs || [])
        ]
            .filter((run) => {
                if (
                    filters.status &&
                    run.status !==
                        filters.status
                ) {
                    return false;
                }

                if (
                    filters.mode &&
                    run.mode !== filters.mode
                ) {
                    return false;
                }

                return true;
            })
            .sort(
                (left, right) =>
                    (right.updatedAt || 0) -
                    (left.updatedAt || 0)
            );
    },

    getRunById(runId) {
        return this.getRuns().find(
            (run) =>
                String(run.id) ===
                String(runId)
        ) || null;
    },

    getDirectSearchDashboard() {
        const runs =
            this.getRuns({
                mode: "direct_search"
            });
        const resolvedRuns =
            runs.filter((run) =>
                Array.isArray(run?.answers) &&
                run.answers.length
            );
        const totals =
            resolvedRuns.reduce(
                (acc, run) => {
                    const answers =
                        Array.isArray(
                            run.answers
                        )
                            ? run.answers
                            : [];

                    answers.forEach((answer) => {
                        acc.attempts += 1;
                        acc.totalTimeMs +=
                            Number(
                                answer?.timeMs
                            ) || 0;

                        if (answer?.correct) {
                            acc.hits += 1;
                        } else {
                            acc.errors += 1;
                        }
                    });

                    acc.lastResolvedAt =
                        Math.max(
                            acc.lastResolvedAt,
                            Number(
                                run.completedAt
                            ) ||
                                Number(
                                    run.updatedAt
                                ) ||
                                Number(
                                    run.startedAt
                                ) ||
                                0
                        );

                    const meta =
                        run?.routeSnapshot?.meta &&
                        typeof run
                            .routeSnapshot.meta ===
                            "object"
                            ? run.routeSnapshot.meta
                            : run?.summary?.meta &&
                                typeof run
                                    .summary.meta ===
                                    "object"
                              ? run.summary.meta
                              : {};
                    const terms =
                        Array.isArray(
                            meta.directSearchTerms
                        )
                            ? meta.directSearchTerms
                            : [];
                    const strategy = String(
                        meta.directSearchStrategy ||
                            ""
                    ).trim();

                    terms.forEach((term) => {
                        const key = String(
                            term || ""
                        ).trim();

                        if (!key) {
                            return;
                        }

                        acc.termUsage.set(
                            key,
                            (acc.termUsage.get(
                                key
                            ) || 0) + 1
                        );
                    });

                    if (strategy) {
                        acc.strategyUsage.set(
                            strategy,
                            (acc.strategyUsage.get(
                                strategy
                            ) || 0) + 1
                        );
                    }

                    return acc;
                },
                {
                    attempts: 0,
                    hits: 0,
                    errors: 0,
                    totalTimeMs: 0,
                    lastResolvedAt: 0,
                    termUsage: new Map(),
                    strategyUsage:
                        new Map()
                }
            );

        const topTerms = [
            ...totals.termUsage.entries()
        ]
            .sort((left, right) =>
                right[1] - left[1] ||
                left[0].localeCompare(
                    right[0],
                    "pt-BR"
                )
            )
            .slice(0, 6)
            .map(([term, count]) => ({
                term,
                count
            }));
        const preferredStrategy =
            [...totals.strategyUsage.entries()]
                .sort((left, right) =>
                    right[1] - left[1]
                )[0]?.[0] || "gradual";

        return {
            runs,
            resolvedRuns,
            attempts: totals.attempts,
            hits: totals.hits,
            errors: totals.errors,
            accuracy:
                totals.attempts > 0
                    ? totals.hits /
                      totals.attempts
                    : 0,
            avgTimeMs:
                totals.attempts > 0
                    ? totals.totalTimeMs /
                      totals.attempts
                    : 0,
            elapsedAnsweredMs:
                totals.totalTimeMs,
            totalRuns:
                runs.length,
            answeredRuns:
                resolvedRuns.length,
            avgAnsweredPerRun:
                resolvedRuns.length > 0
                    ? totals.attempts /
                      resolvedRuns.length
                    : 0,
            lastResolvedAt:
                totals.lastResolvedAt,
            topTerms,
            strategy:
                preferredStrategy
        };
    },

    saveRun(run = {}) {
        const now = Date.now();
        const questionIds =
            this.normalizeQuestionIds(
                run.questionIds
            );
        const answers =
            this.compactAnswerList(
                run.answers
            );
        const lastAnswer =
            this.compactAnswerRecord(
                run.lastAnswer
            );
        const next = {
            id:
                run.id ||
                `run_${now}`,
            mode:
                String(
                    run.mode || "specific"
                ).trim() || "specific",
            status:
                String(
                    run.status ||
                        "in_progress"
                ).trim() ||
                "in_progress",
            title:
                String(
                    run.title || "Treino"
                ).trim() || "Treino",
            createdAt:
                Number(
                    run.createdAt
                ) || now,
            updatedAt: now,
            completedAt:
                Number(
                    run.completedAt
                ) || 0,
            routeSnapshot:
                run.routeSnapshot &&
                typeof run.routeSnapshot ===
                    "object"
                    ? {
                        ...run.routeSnapshot
                    }
                    : {},
            questionIds,
            sessionSnapshot:
                this.compactSessionSnapshot(
                    questionIds,
                    run.sessionSnapshot
                ),
            currentIndex:
                Number(
                    run.currentIndex
                ) || 0,
            answers,
            lastAnswer,
            summary:
                run.summary &&
                typeof run.summary ===
                    "object"
                    ? { ...run.summary }
                    : null,
            profileId:
                String(
                    run.profileId || ""
                ).trim(),
            savedBlockId:
                String(
                    run.savedBlockId || ""
                ).trim(),
            startedAt:
                Number(
                    run.startedAt
                ) || now
        };

        this.data.runs = [
            next,
            ...this.getRuns().filter(
                (entry) =>
                    String(entry.id) !==
                    String(next.id)
            )
        ].slice(0, 80);
        this.saveRuns();

        return next;
    },

    updateRun(runId, patch = {}) {
        const run =
            this.getRunById(runId);

        if (!run) {
            return null;
        }

        return this.saveRun({
            ...run,
            ...(patch || {}),
            id: run.id,
            createdAt:
                run.createdAt
        });
    },

    deleteRun(runId) {
        const before =
            (this.data.runs || []).length;

        this.data.runs = (
            this.data.runs || []
        ).filter(
            (run) =>
                String(run.id) !==
                String(runId)
        );

        if (
            this.data.runs.length !== before
        ) {
            this.saveRuns();
            return true;
        }

        return false;
    },

    getTopicEntries(filters = {}) {
        return Object.values(
            this.data.topics || {}
        ).filter((entry) => {
            if (
                filters.baseKey &&
                entry.baseKey !== filters.baseKey
            ) {
                return false;
            }

            if (
                filters.subjectKey &&
                entry.subjectKey !==
                    filters.subjectKey
            ) {
                return false;
            }

            return true;
        });
    },

    getWeakTopics(filters = {}) {
        const minAttempts = Math.max(
            Number(filters.minAttempts) || 0,
            0
        );
        const minErrors = Math.max(
            Number(filters.minErrors) || 0,
            0
        );

        return this.getTopicEntries(filters)
            .filter((entry) => {
                if (
                    minAttempts > 0 &&
                    (entry.attempts || 0) <
                        minAttempts
                ) {
                    return false;
                }

                if (
                    minErrors > 0 &&
                    (entry.errors || 0) <
                        minErrors
                ) {
                    return false;
                }

                return true;
            })
            .map((entry) => ({
                ...entry,
                accuracy:
                    entry.attempts > 0
                        ? entry.hits /
                          entry.attempts
                        : 0
            }))
            .sort((left, right) =>
                right.errors - left.errors ||
                left.accuracy - right.accuracy ||
                right.attempts - left.attempts
            );
    },

    getRecentSessions(filters = {}) {
        return (this.data.sessions || [])
            .filter((entry) => {
                if (
                    filters.baseKey &&
                    entry.baseKey !==
                        filters.baseKey
                ) {
                    return false;
                }

                if (
                    filters.subjectKey &&
                    entry.subjectKey !==
                        filters.subjectKey
                ) {
                    return false;
                }

                if (
                    filters.mode &&
                    entry.mode !== filters.mode
                ) {
                    return false;
                }

                if (
                    filters.modeKey &&
                    entry.modeKey !==
                        filters.modeKey
                ) {
                    return false;
                }

                if (
                    filters.sourceMode &&
                    entry.sourceMode !==
                        filters.sourceMode
                ) {
                    return false;
                }

                return true;
            })
            .sort(
                (left, right) =>
                    (right.createdAt || 0) -
                    (left.createdAt || 0)
            );
    },

    getStrongTopics(filters = {}) {
        return this.getTopicEntries(filters)
            .map((entry) => ({
                ...entry,
                accuracy:
                    entry.attempts > 0
                        ? entry.hits /
                          entry.attempts
                        : 0
            }))
            .filter((entry) => entry.hits > 0)
            .sort((left, right) =>
                right.hits - left.hits ||
                right.accuracy -
                    left.accuracy ||
                left.errors - right.errors
            );
    },

    getModeBreakdown(filters = {}) {
        const grouped = new Map();

        this.getRecentSessions(filters).forEach(
            (session) => {
                const key =
                    session.modeKey ||
                    session.mode ||
                    "desconhecido";
                const current =
                    grouped.get(key) || {
                        modeKey:
                            session.modeKey || "",
                        modeLabel:
                            session.mode ||
                            "Modo",
                        sessions: 0,
                        hits: 0,
                        errors: 0,
                        totalAccuracy: 0
                    };

                current.sessions += 1;
                current.hits +=
                    session.hits || 0;
                current.errors +=
                    session.errors || 0;
                current.totalAccuracy +=
                    Number(
                        session.accuracy || 0
                    );

                grouped.set(key, current);
            }
        );

        return [...grouped.values()]
            .map((entry) => ({
                ...entry,
                avgAccuracy:
                    entry.sessions > 0
                        ? Math.round(
                            entry.totalAccuracy /
                                entry.sessions
                        )
                        : 0
            }))
            .sort((left, right) =>
                right.sessions - left.sessions ||
                right.avgAccuracy -
                    left.avgAccuracy
            );
    },

    getFocusedSessions(filters = {}) {
        return this.getRecentSessions(filters)
            .filter((session) => {
                const topics =
                    Array.isArray(
                        session.topicKeys
                    )
                        ? session.topicKeys
                        : [];

                return (
                    session.topicCount === 1 ||
                    topics.length === 1 ||
                    session.modeKey ===
                        "ASSUNTO_UNICO" ||
                    session.modeKey ===
                        "REFORCO_DIRECIONADO"
                );
            });
    },

    getDashboard(filters = {}) {
        const entries =
            this.getTopicEntries(filters);
        const sessions =
            this.getRecentSessions(filters);
        const weakTopics =
            this.getWeakTopics(filters)
                .slice(0, 5);
        const strongTopics =
            this.getStrongTopics(filters)
                .slice(0, 5);
        const modeBreakdown =
            this.getModeBreakdown(filters)
                .slice(0, 4);
        const focusedSessions =
            this.getFocusedSessions(filters)
                .slice(0, 5);
        const directSearch =
            this.getDirectSearchDashboard();
        const totals =
            entries.reduce(
                (acc, entry) => {
                    acc.attempts +=
                        entry.attempts || 0;
                    acc.hits +=
                        entry.hits || 0;
                    acc.errors +=
                        entry.errors || 0;
                    acc.totalTime +=
                        (entry.avgTime || 0) *
                        (entry.attempts || 0);
                    return acc;
                },
                {
                    attempts: 0,
                    hits: 0,
                    errors: 0,
                    totalTime: 0
                }
            );

        return {
            entries,
            attempts: totals.attempts,
            hits: totals.hits,
            errors: totals.errors,
            accuracy:
                totals.attempts > 0
                    ? totals.hits /
                      totals.attempts
                    : 0,
            avgTimeMs:
                totals.attempts > 0
                    ? totals.totalTime /
                      totals.attempts
                    : 0,
            totalSessions:
                sessions.length,
            sessions,
            weakTopics,
            strongTopics,
            modeBreakdown,
            focusedSessions,
            directSearch,
            mostTrainedTopic:
                [...entries].sort(
                    (left, right) =>
                        (right.attempts || 0) -
                        (left.attempts || 0)
                )[0] || null
        };
    }
};

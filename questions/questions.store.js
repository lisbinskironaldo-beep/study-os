window.QuestionsStore = {
    key: "questions_profile_v3",
    runsKey: "questions_runs_v1",
    saveTimer: null,
    runsSaveTimer: null,
    smartProfilesSaveTimer: null,
    savedBlocksSaveTimer: null,
    runsRepository: null,
    profileStateRepository: null,
    smartProfilesRepository: null,
    savedBlocksRepository: null,

    data: {
        topics: {},
        sessions: [],
        smartProfiles: [],
        savedBlocks: [],
        runs: []
    },

    load() {
        if (this.profileStateRepository) {
            const loaded =
                this.profileStateRepository.load();

            this.data = {
                topics: {},
                sessions: [],
                smartProfiles: [],
                savedBlocks: [],
                runs: [],
                ...(loaded || {})
            };
            this.loadSmartProfiles();
            this.loadSavedBlocks();
            this.loadRuns();
            return;
        }

        const saved =
            localStorage.getItem(this.key);

        if (!saved) {
            this.data = {
                topics: {},
                sessions: [],
                smartProfiles: [],
                savedBlocks: [],
                runs: []
            };
            this.loadSmartProfiles();
            this.loadSavedBlocks();
            this.loadRuns();
            return;
        }

        try {
            const parsed =
                JSON.parse(saved);

            this.data = {
                topics: {},
                sessions: [],
                smartProfiles: [],
                savedBlocks: [],
                runs: [],
                ...(parsed || {})
            };
        } catch (_error) {
            this.data = {
                topics: {},
                sessions: [],
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
    },

    save(immediate = false) {
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
                ? parsed
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
        this.save();
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

        this.save();
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

    saveRun(run = {}) {
        const now = Date.now();
        const questionIds =
            this.normalizeQuestionIds(
                run.questionIds
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
            answers:
                Array.isArray(run.answers)
                    ? [...run.answers]
                    : [],
            lastAnswer:
                run.lastAnswer || null,
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
        return this.getTopicEntries(filters)
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
            mostTrainedTopic:
                [...entries].sort(
                    (left, right) =>
                        (right.attempts || 0) -
                        (left.attempts || 0)
                )[0] || null
        };
    }
};

window.QuestionsStore = {
    key: "questions_profile_v3",

    data: {
        topics: {},
        sessions: []
    },

    load() {
        const saved =
            localStorage.getItem(this.key);

        if (!saved) {
            this.data = {
                topics: {},
                sessions: []
            };
            return;
        }

        try {
            const parsed =
                JSON.parse(saved);

            this.data = {
                topics: {},
                sessions: [],
                ...(parsed || {})
            };
        } catch (_error) {
            this.data = {
                topics: {},
                sessions: []
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
    },

    save() {
        localStorage.setItem(
            this.key,
            JSON.stringify(this.data)
        );
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

window.QuestionsStore = {
    key: "questions_profile_v2",

    data: {
        topics: {}
    },

    load() {
        const saved =
            localStorage.getItem(this.key);

        if (!saved) {
            this.data = { topics: {} };
            return;
        }

        try {
            const parsed =
                JSON.parse(saved);

            this.data = {
                topics: {},
                ...(parsed || {})
            };
        } catch (_error) {
            this.data = { topics: {} };
        }

        if (
            !this.data.topics ||
            typeof this.data.topics !== "object"
        ) {
            this.data.topics = {};
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

    getDashboard(filters = {}) {
        const entries =
            this.getTopicEntries(filters);
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
            weakTopics:
                this.getWeakTopics(filters)
                    .slice(0, 5)
        };
    }
};

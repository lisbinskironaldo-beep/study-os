window.QuestionsService = {
    shuffle(list) {
        return [...(list || [])].sort(
            () => Math.random() - 0.5
        );
    },

    titleize(key) {
        return String(key || "")
            .split("_")
            .filter(Boolean)
            .map((chunk) =>
                chunk.charAt(0).toUpperCase() +
                chunk.slice(1)
            )
            .join(" ");
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

    getBaseCatalog(page, baseKey) {
        return (
            page.data.questionsDB[baseKey] ||
            null
        );
    },

    getSubjectOptions(page) {
        const ctx =
            QuestionsContext.get();
        const base =
            this.getBaseCatalog(
                page,
                ctx.base
            );

        if (!base) {
            return [];
        }

        return Object.entries(
            base.subjects || {}
        ).map(([key, subject]) => ({
            key,
            label: subject.label,
            count: Object.values(
                subject.topics || {}
            ).reduce(
                (acc, list) =>
                    acc + list.length,
                0
            )
        }));
    },

    getTopicOptions(page, subjectKey = null) {
        const ctx =
            QuestionsContext.get();
        const base =
            this.getBaseCatalog(
                page,
                ctx.base
            );
        const subject =
            base?.subjects?.[
                subjectKey || ctx.focus
            ];

        if (!subject) {
            return [];
        }

        return Object.entries(
            subject.topics || {}
        ).map(([key, list]) => ({
            key,
            label:
                this.titleize(key),
            count: list.length
        }));
    },

    getAllQuestions(page) {
        const ctx =
            QuestionsContext.get();
        const base =
            this.getBaseCatalog(
                page,
                ctx.base
            );
        const track =
            page.getTrackConfig(ctx.track);

        if (!base) {
            return [];
        }

        const questions = [];

        Object.entries(
            base.subjects || {}
        ).forEach(([subjectKey, subject]) => {
            Object.entries(
                subject.topics || {}
            ).forEach(([topicKey, list]) => {
                list.forEach((question, index) => {
                    questions.push({
                        ...question,
                        id:
                            question.id ||
                            [
                                ctx.base,
                                subjectKey,
                                topicKey,
                                index
                            ].join("_"),
                        baseKey: ctx.base,
                        baseLabel: base.label,
                        subjectKey,
                        subjectLabel:
                            subject.label,
                        topicKey,
                        topicLabel:
                            this.titleize(
                                topicKey
                            )
                    });
                });
            });
        });

        return questions.filter((question) => {
            const level =
                Number(
                    question.difficulty || 1
                );
            return (
                level >=
                    track.difficultyRange[0] &&
                level <=
                    track.difficultyRange[1]
            );
        });
    },

    getQuestionPool(page) {
        const ctx =
            QuestionsContext.get();
        let pool =
            this.getAllQuestions(page);

        if (ctx.focus) {
            pool = pool.filter(
                (question) =>
                    question.subjectKey ===
                    ctx.focus
            );
        }

        if (
            ctx.mission === "topic" &&
            Array.isArray(ctx.topics) &&
            ctx.topics.length
        ) {
            pool = pool.filter((question) =>
                ctx.topics.includes(
                    question.topicKey
                )
            );
        }

        if (ctx.mission === "weak") {
            const weakTopics =
                QuestionsStore.getWeakTopics({
                    baseKey: ctx.base,
                    subjectKey: ctx.focus
                })
                    .slice(0, 2)
                    .map((entry) =>
                        entry.topicKey
                    );

            if (weakTopics.length) {
                const focused =
                    pool.filter((question) =>
                        weakTopics.includes(
                            question.topicKey
                        )
                    );

                if (focused.length) {
                    pool = focused;
                }
            }
        }

        return pool;
    },

    buildSession(page) {
        const ctx =
            QuestionsContext.get();
        let pool =
            this.getQuestionPool(page);

        if (!pool.length) {
            pool = this.getAllQuestions(page)
                .filter((question) =>
                    ctx.focus
                        ? question.subjectKey ===
                          ctx.focus
                        : true
                );
        }

        if (ctx.mission === "weak") {
            const weights = new Map(
                QuestionsStore.getWeakTopics({
                    baseKey: ctx.base,
                    subjectKey: ctx.focus
                }).map((entry) => [
                    entry.topicKey,
                    (
                        entry.errors * 3
                    ) +
                    entry.attempts
                ])
            );

            pool = [...pool].sort(
                (left, right) =>
                    (weights.get(
                        right.topicKey
                    ) || 0) -
                    (weights.get(
                        left.topicKey
                    ) || 0)
            );
        } else {
            pool = this.shuffle(pool);
        }

        const sessionSize =
            Math.min(
                ctx.sessionSize || 8,
                pool.length
            );

        return pool.slice(0, sessionSize);
    },

    answer(page, index) {
        const question =
            QuestionsState.getCurrentQuestion();

        if (!question) {
            return null;
        }

        const correct =
            index === question.correct;
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
            correct,
            timeMs
        );

        return {
            correct,
            selectedIndex: index,
            timeMs,
            question
        };
    },

    getRouteSummary(page) {
        const ctx =
            QuestionsContext.get();
        const track =
            page.getTrackConfig(ctx.track);
        const topicOptions =
            this.getTopicOptions(
                page,
                ctx.focus
            );
        const topicLabels =
            topicOptions
                .filter((topic) =>
                    (ctx.topics || []).includes(
                        topic.key
                    )
                )
                .map((topic) => topic.label);

        return {
            trackLabel: track.label,
            missionLabel:
                page.data.missions[
                    ctx.mission
                ]?.label || "",
            focusLabel:
                this.getSubjectOptions(page)
                    .find((subject) =>
                        subject.key ===
                        ctx.focus
                    )?.label || "",
            topicsLabel:
                topicLabels.join(", "),
            sessionSize:
                ctx.sessionSize || 8
        };
    },

    getSmartSuggestion(page) {
        const ctx =
            QuestionsContext.get();
        const weak =
            QuestionsStore.getWeakTopics({
                baseKey: ctx.base,
                subjectKey: ctx.focus
            })[0];

        if (weak) {
            return {
                title: `Ponto mais sensivel: ${weak.topicLabel}`,
                note: `Voce ja errou ${weak.errors} vez${weak.errors > 1 ? "es" : ""} nesse tema. Vale entrar em Pontos fracos hoje.`
            };
        }

        const route =
            this.getRouteSummary(page);

        return {
            title: `Rota pronta em ${route.focusLabel || route.trackLabel}`,
            note: route.topicsLabel
                ? `Sessao focada em ${route.topicsLabel}.`
                : `Selecione um assunto para deixar a sessao mais afiada.`
        };
    }
};

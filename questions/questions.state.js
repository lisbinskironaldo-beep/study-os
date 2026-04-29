window.QuestionsState = {
    launcherViews: new Set([
        "home",
        "quick",
        "simulado",
        "simulado_build",
        "progress",
        "smart_start",
        "smart_subjects",
        "smart",
        "smart_profiles",
        "specific",
        "saved",
        "saved_detail",
        "resume"
    ]),

    defaults: {
        phase: "launcher",
        launcherView: "home",
        activeRunId: "",
        current: 0,
        sessionList: [],
        startTime: 0,
        lastAnswer: null,
        results: [],
        meta: {},
        sessionRecorded: false
    },

    data: {},

    init() {
        this.data = {
            ...this.defaults,
            sessionList: [],
            results: []
        };
    },

    isValidLauncherView(view) {
        return this.launcherViews.has(
            String(view || "").trim()
        );
    },

    setLauncherView(view) {
        if (!this.isValidLauncherView(view)) {
            return;
        }

        this.data.launcherView = view;
    },

    getLauncherView() {
        return this.isValidLauncherView(
            this.data.launcherView
        )
            ? this.data.launcherView
            : "home";
    },

    openLauncher(view = null) {
        if (this.isValidLauncherView(view)) {
            this.data.launcherView = view;
        }

        this.data.phase = "launcher";
        this.data.activeRunId = "";
        this.data.current = 0;
        this.data.sessionList = [];
        this.data.startTime = 0;
        this.data.lastAnswer = null;
        this.data.results = [];
        this.data.meta = {};
        this.data.sessionRecorded =
            false;
    },

    startSession(
        list,
        meta = {},
        options = {}
    ) {
        this.data.phase = "session";
        this.data.activeRunId =
            String(
                options.activeRunId || ""
            ).trim();
        this.data.current =
            Number(
                options.currentIndex
            ) || 0;
        this.data.sessionList =
            Array.isArray(list) ? [...list] : [];
        this.data.startTime =
            Number(options.startTime) ||
            Date.now();
        this.data.lastAnswer =
            options.lastAnswer || null;
        this.data.results =
            Array.isArray(options.results)
                ? [...options.results]
                : [];
        this.data.meta = { ...(meta || {}) };
        this.data.sessionRecorded =
            false;
    },

    getPhase() {
        return this.data.phase;
    },

    getActiveRunId() {
        return String(
            this.data.activeRunId || ""
        ).trim();
    },

    getSession() {
        return this.data.sessionList || [];
    },

    getCurrent() {
        return this.data.current || 0;
    },

    getCurrentQuestion() {
        return this.getSession()[
            this.getCurrent()
        ] || null;
    },

    setStartTime() {
        this.data.startTime = Date.now();
    },

    getStartTime() {
        return this.data.startTime || 0;
    },

    getRecordedAnswer(
        questionId = ""
    ) {
        const safeQuestionId =
            String(questionId || "").trim();

        if (!safeQuestionId) {
            return null;
        }

        return (
            (this.data.results || []).find(
                (entry) =>
                    String(
                        entry?.questionId || ""
                    ).trim() ===
                    safeQuestionId
            ) || null
        );
    },

    getCurrentRecordedAnswer() {
        return this.getRecordedAnswer(
            this.getCurrentQuestion()?.id ||
                ""
        );
    },

    setAnswer(result) {
        if (!result) {
            this.data.lastAnswer = null;
            return;
        }

        const recorded =
            this.getRecordedAnswer(
                result.questionId
            );

        this.data.lastAnswer = {
            ...result,
            scoredCorrect:
                recorded?.correct ??
                result.correct,
            outcomeLocked:
                Boolean(recorded),
            recordedAnswerLabel:
                recorded
                    ?.selectedAnswerLabel ||
                "",
            firstAttemptCorrect:
                recorded?.correct ??
                result.correct
        };

        if (!recorded) {
            this.data.results = [
                ...(this.data.results || []),
                result
            ];
        }
    },

    retryCurrentQuestion() {
        if (!this.data.lastAnswer) {
            return;
        }

        this.data.lastAnswer = null;
        this.data.startTime = Date.now();
    },

    getLastAnswer() {
        return this.data.lastAnswer;
    },

    next() {
        this.data.current += 1;
        this.data.lastAnswer = null;
        this.data.startTime = Date.now();
    },

    isComplete() {
        return (
            this.getPhase() === "session" &&
            this.getCurrent() >=
                this.getSession().length
        );
    },

    getResults() {
        return [...(this.data.results || [])];
    },

    getMeta() {
        return {
            ...(this.data.meta || {})
        };
    },

    markSessionRecorded() {
        this.data.sessionRecorded =
            true;
    },

    isSessionRecorded() {
        return Boolean(
            this.data.sessionRecorded
        );
    }
};

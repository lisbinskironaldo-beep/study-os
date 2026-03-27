window.QuestionsState = {
    launcherViews: new Set([
        "home",
        "smart_start",
        "smart_subjects",
        "smart",
        "smart_profiles",
        "specific",
        "saved",
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

    setAnswer(result) {
        this.data.lastAnswer =
            result || null;

        if (result) {
            this.data.results = [
                ...(this.data.results || []),
                result
            ];
        }
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

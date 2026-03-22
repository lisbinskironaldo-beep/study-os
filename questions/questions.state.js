window.QuestionsState = {
    defaults: {
        phase: "launcher",
        current: 0,
        sessionList: [],
        startTime: 0,
        lastAnswer: null,
        results: [],
        meta: {}
    },

    data: {},

    init() {
        this.data = {
            ...this.defaults,
            sessionList: [],
            results: []
        };
    },

    openLauncher() {
        this.data.phase = "launcher";
        this.data.current = 0;
        this.data.sessionList = [];
        this.data.startTime = 0;
        this.data.lastAnswer = null;
        this.data.results = [];
        this.data.meta = {};
    },

    startSession(list, meta = {}) {
        this.data.phase = "session";
        this.data.current = 0;
        this.data.sessionList =
            Array.isArray(list) ? [...list] : [];
        this.data.startTime = Date.now();
        this.data.lastAnswer = null;
        this.data.results = [];
        this.data.meta = { ...(meta || {}) };
    },

    getPhase() {
        return this.data.phase;
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
    }
};

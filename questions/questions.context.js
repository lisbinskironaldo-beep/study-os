window.QuestionsContext = {
    key: "questions_context_v2",

    defaults: {
        track: "enem",
        base: "ENEM",
        mission: "topic",
        focus: "matematica",
        topics: ["algebra"],
        sessionSize: 8
    },

    data: {},

    load() {
        const saved =
            localStorage.getItem(this.key);

        if (!saved) {
            this.data = {
                ...this.defaults,
                topics: [...this.defaults.topics]
            };
            return;
        }

        try {
            const parsed =
                JSON.parse(saved);

            this.data = {
                ...this.defaults,
                ...(parsed || {})
            };
        } catch (_error) {
            this.data = {
                ...this.defaults,
                topics: [...this.defaults.topics]
            };
        }

        this.data.topics =
            Array.isArray(this.data.topics)
                ? [...this.data.topics]
                : [...this.defaults.topics];
    },

    save() {
        localStorage.setItem(
            this.key,
            JSON.stringify(this.data)
        );
    },

    set(patch, shouldSave = true) {
        this.data = {
            ...this.data,
            ...(patch || {})
        };

        if (!Array.isArray(this.data.topics)) {
            this.data.topics = [];
        }

        if (shouldSave) {
            this.save();
        }
    },

    replace(nextState, shouldSave = true) {
        this.data = {
            ...this.defaults,
            ...(nextState || {})
        };

        this.data.topics =
            Array.isArray(this.data.topics)
                ? [...this.data.topics]
                : [...this.defaults.topics];

        if (shouldSave) {
            this.save();
        }
    },

    get() {
        return {
            ...this.data,
            topics: Array.isArray(this.data.topics)
                ? [...this.data.topics]
                : []
        };
    }
};

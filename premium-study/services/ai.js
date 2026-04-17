(function () {
    if (window.PremiumStudyAI) {
        return;
    }

    const PROMPT_VERSION = "premium-study-ai-v1";

    const TASKS = {
        PLAN_FROM_MATERIAL: "plan_from_material",
        EXPLAIN_BLOCK: "explain_block",
        QUICK_REVIEW: "quick_review",
        EXTRA_QUIZ: "extra_quiz",
        EXTRA_TRUE_FALSE: "extra_true_false",
        EXTRA_FLASHCARDS: "extra_flashcards",
        EXTRA_MINI_EXAM: "extra_mini_exam"
    };

    const TASK_CONTRACTS = {
        [TASKS.PLAN_FROM_MATERIAL]: {
            prompt: "premium-study/services/ai/prompts/plan.md",
            cacheKeyParts: ["materialHash", "examDate", "targetScore", "dailyMinutes"]
        },
        [TASKS.EXPLAIN_BLOCK]: {
            prompt: "premium-study/services/ai/prompts/explain.md",
            cacheKeyParts: ["materialHash", "blockId"]
        },
        [TASKS.QUICK_REVIEW]: {
            prompt: "premium-study/services/ai/prompts/review.md",
            cacheKeyParts: ["materialHash", "blockId"]
        },
        [TASKS.EXTRA_QUIZ]: {
            prompt: "premium-study/services/ai/prompts/questions.md",
            cacheKeyParts: ["materialHash", "blockId", "seriesIndex"]
        },
        [TASKS.EXTRA_TRUE_FALSE]: {
            prompt: "premium-study/services/ai/prompts/questions.md",
            cacheKeyParts: ["materialHash", "blockId", "seriesIndex"]
        },
        [TASKS.EXTRA_FLASHCARDS]: {
            prompt: "premium-study/services/ai/prompts/flashcards.md",
            cacheKeyParts: ["materialHash", "blockId", "seriesIndex"]
        },
        [TASKS.EXTRA_MINI_EXAM]: {
            prompt: "premium-study/services/ai/prompts/mini_exam.md",
            cacheKeyParts: ["materialHash", "blockId", "count"]
        }
    };

    function isConfigured() {
        return false;
    }

    function getTaskContract(task) {
        return TASK_CONTRACTS[task]
            ? { ...TASK_CONTRACTS[task] }
            : null;
    }

    function buildCacheKey(task, payload = {}) {
        const contract = getTaskContract(task);
        if (!contract) {
            return `${PROMPT_VERSION}:${task}:unknown`;
        }

        const parts = contract.cacheKeyParts.map((key) => `${key}=${payload[key] || ""}`);
        return `${PROMPT_VERSION}:${task}:${parts.join("|")}`;
    }

    async function request(task, payload = {}) {
        const contract = getTaskContract(task);

        return {
            ok: false,
            status: "not_configured",
            task,
            promptVersion: PROMPT_VERSION,
            cacheKey: buildCacheKey(task, payload),
            contract,
            message: "Cliente de IA real ainda nao foi conectado. Use este contrato para ligar backend, cache e prompts versionados."
        };
    }

    window.PremiumStudyAI = {
        PROMPT_VERSION,
        TASKS,
        TASK_CONTRACTS,
        isConfigured,
        getTaskContract,
        buildCacheKey,
        request
    };
})();

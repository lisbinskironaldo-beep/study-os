(function () {
    if (window.PremiumStudyAI) {
        return;
    }

    const PROMPT_VERSION = "rotanota-pdf-focused-ai-v6";
    const ENDPOINT = "/api/premium/ai-generate";
    const DEFAULT_REQUEST_TIMEOUT_MS = 120000;
    const FREE_BUNDLE_TIMEOUT_MS = 45000;
    const PREMIUM_BUNDLE_TIMEOUT_MS = 90000;
    const state = {
        configured: null,
        model: ""
    };

    const TASKS = {
        FREE_BUNDLE_FROM_MATERIAL: "free_bundle_from_material",
        PLAN_FROM_MATERIAL: "plan_from_material",
        EXPLAIN_BLOCK: "explain_block",
        QUICK_REVIEW: "quick_review",
        EXTRA_QUIZ: "extra_quiz",
        EXTRA_TRUE_FALSE: "extra_true_false",
        EXTRA_FLASHCARDS: "extra_flashcards",
        EXTRA_MINI_EXAM: "extra_mini_exam",
        PREMIUM_LEVEL_EXAM: "premium_level_exam"
    };

    const TASK_CONTRACTS = {
        [TASKS.FREE_BUNDLE_FROM_MATERIAL]: {
            prompt: "api/premium/ai-generate.js",
            cacheKeyParts: ["materialHash", "pageCount", "examDate", "targetScore", "dailyMinutes", "accessTier"]
        },
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
        },
        [TASKS.PREMIUM_LEVEL_EXAM]: {
            prompt: "api/premium/ai-generate.js",
            cacheKeyParts: ["materialHash", "questionCount"]
        }
    };

    function isConfigured() {
        return state.configured !== false;
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

    function getRequestTimeoutMs(task, payload = {}) {
        if (task === TASKS.FREE_BUNDLE_FROM_MATERIAL || task === TASKS.PLAN_FROM_MATERIAL) {
            const accessTier = String(payload.accessTier || "").toLowerCase();
            return accessTier === "premium"
                ? PREMIUM_BUNDLE_TIMEOUT_MS
                : FREE_BUNDLE_TIMEOUT_MS;
        }

        return DEFAULT_REQUEST_TIMEOUT_MS;
    }

    async function request(task, payload = {}) {
        const contract = getTaskContract(task);
        const normalizedTask = task === TASKS.PLAN_FROM_MATERIAL
            ? TASKS.FREE_BUNDLE_FROM_MATERIAL
            : task;
        const timeoutMs = getRequestTimeoutMs(normalizedTask, payload);
        const controller = typeof AbortController !== "undefined" ? new AbortController() : null;
        const timeoutId = controller
            ? window.setTimeout(() => controller.abort(), timeoutMs)
            : null;

        try {
            const response = await fetch(ENDPOINT, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                signal: controller ? controller.signal : undefined,
                body: JSON.stringify({
                    ...payload,
                    task: normalizedTask
                })
            });
            const data = await response.json().catch(() => null);

            return {
                ok: Boolean(response.ok && data && data.ok),
                status: data && data.status ? data.status : response.ok ? "ok" : "request_failed",
                task: normalizedTask,
                promptVersion: data && data.promptVersion ? data.promptVersion : PROMPT_VERSION,
                cacheKey: buildCacheKey(normalizedTask, payload),
                contract,
                ...data
            };
        } catch (error) {
            state.configured = false;
            return {
                ok: false,
                status: error && error.name === "AbortError" ? "request_timeout" : "network_error",
                task: normalizedTask,
                promptVersion: PROMPT_VERSION,
                cacheKey: buildCacheKey(normalizedTask, payload),
                contract,
                message: error && error.name === "AbortError"
                    ? "A IA demorou demais para montar o pacote completo. Mantive uma base local do texto extraido para voce nao ficar travado."
                    : "Nao consegui acessar a IA agora. Vou manter o pacote base local para voce seguir estudando."
            };
        } finally {
            if (timeoutId) {
                window.clearTimeout(timeoutId);
            }
        }
    }

    function syncConfiguration(data = {}) {
        if (typeof data.aiAvailable === "boolean") {
            state.configured = data.aiAvailable;
        } else if (typeof data.ok === "boolean") {
            state.configured = data.ok;
        }

        if (data.model) {
            state.model = data.model;
        } else if (data.aiModel) {
            state.model = data.aiModel;
        }
    }

    const originalRequest = request;
    async function trackedRequest(task, payload = {}) {
        const result = await originalRequest(task, payload);
        syncConfiguration(result);
        return result;
    }

    window.PremiumStudyAI = {
        PROMPT_VERSION,
        TASKS,
        TASK_CONTRACTS,
        isConfigured,
        getTaskContract,
        buildCacheKey,
        request: trackedRequest
    };
})();

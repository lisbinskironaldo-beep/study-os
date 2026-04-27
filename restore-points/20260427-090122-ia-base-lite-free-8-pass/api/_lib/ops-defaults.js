const DEFAULT_THRESHOLDS = {
    dailyWarnThreshold: 500,
    dailyCriticalThreshold: 600,
    dailyHardStopThreshold: 650
};

const DEFAULT_PROMOTION_CHANNELS = [
    "internal_site",
    "meta_ads",
    "google_ads"
];

const DEFAULT_APP_MODULES = [
    "dev",
    "analytics",
    "improvements",
    "promotions_internal",
    "promotions_external",
    "finance",
    "bugs"
];

const DEFAULT_MANAGED_APPS = [
    {
        appKey: "northstar_ecosystem",
        name: "NorthStar",
        category: "management",
        status: "connected",
        maturityStage: "active_build",
        managementMode: "internal",
        capabilities: ["portfolio_overview", "app_registry", "ops_control", "alerts", "connector_governance"],
        scopes: ["ecosystem_control", "ops_panel", "authorized_changes"],
        enabledModules: ["dev", "analytics", "improvements", "finance", "bugs"],
        dashboardUrl: "/ops/",
        notes: "Control plane do ecossistema NorthStar. Hoje fica hospedado tecnicamente dentro do RotaNota, mas ja opera como retaguarda multi-app."
    },
    {
        appKey: "rota_nota",
        name: "RotaNota",
        category: "product",
        status: "connected",
        maturityStage: "live",
        managementMode: "internal",
        capabilities: ["premium_checkout", "growth", "copilot", "promotions", "study_flow"],
        scopes: ["education_product", "premium_operations"],
        enabledModules: [...DEFAULT_APP_MODULES],
        dashboardUrl: "/",
        notes: "Produto educacional principal do ecossistema NorthStar, com checkout, growth, biblioteca premium e operacao centralizada no /ops."
    },
    {
        appKey: "vercel",
        name: "Vercel",
        category: "platform",
        status: "connected",
        maturityStage: "live",
        managementMode: "hybrid",
        capabilities: ["deployments", "envs", "domains", "runtime"],
        scopes: ["production", "preview", "operations"],
        enabledModules: ["dev", "analytics", "improvements", "bugs"],
        dashboardUrl: "https://vercel.com/dashboard",
        notes: "Deploy e operacao da aplicacao publicados na Vercel."
    },
    {
        appKey: "supabase",
        name: "Supabase",
        category: "data",
        status: "connected",
        maturityStage: "live",
        managementMode: "hybrid",
        capabilities: ["database", "entitlements", "growth_data", "ops_state"],
        scopes: ["postgres", "storage", "auth_future"],
        enabledModules: ["dev", "analytics", "improvements", "finance", "bugs"],
        dashboardUrl: "",
        notes: "Fonte de dados principal da operacao premium."
    },
    {
        appKey: "mercado_pago",
        name: "Mercado Pago",
        category: "payments",
        status: "connected",
        maturityStage: "live",
        managementMode: "api",
        capabilities: ["checkout", "payments", "webhook"],
        scopes: ["billing", "entitlements"],
        enabledModules: ["analytics", "finance", "bugs"],
        dashboardUrl: "https://www.mercadopago.com.br/developers/panel",
        notes: "Checkout ativo. Webhook assinado deve ser acompanhado no NorthStar junto com activations e reconciliacao."
    },
    {
        appKey: "gemini",
        name: "Gemini",
        category: "ai",
        status: "connected",
        maturityStage: "pilot",
        managementMode: "api",
        capabilities: ["copilot", "promotion_drafts", "ops_analysis"],
        scopes: ["llm_provider"],
        enabledModules: ["dev", "analytics", "improvements"],
        dashboardUrl: "https://aistudio.google.com/",
        notes: "IA de fiscalizacao e analise operacional do hub, com foco em acompanhamento, auditoria e recomendacoes."
    },
    {
        appKey: "github",
        name: "GitHub",
        category: "code",
        status: "connected",
        maturityStage: "live",
        managementMode: "hybrid",
        capabilities: ["repo_management", "issues", "actions", "automation"],
        scopes: ["source_control", "workflow_control"],
        enabledModules: ["dev", "improvements", "bugs"],
        dashboardUrl: "https://github.com/",
        notes: "Repositorio e automacoes do ecossistema. Pode disparar workflows, checks e sincronismos operacionais."
    },
    {
        appKey: "openai_chatgpt",
        name: "OpenAI / ChatGPT",
        category: "ai",
        status: "planned",
        maturityStage: "discovery",
        managementMode: "hybrid",
        capabilities: ["chatgpt_app", "mcp_distribution", "authorized_ops"],
        scopes: ["assistant_control", "developer_mode"],
        enabledModules: ["dev", "analytics", "improvements", "bugs", "finance"],
        dashboardUrl: "https://chatgpt.com/",
        notes: "Canal oficial do ChatGPT para operar o NorthStar via Apps SDK + MCP, com leitura ampla, preparo de mudancas e aprovacao humana."
    },
    {
        appKey: "google_ads",
        name: "Google Ads",
        category: "automation",
        status: "planned",
        maturityStage: "discovery",
        managementMode: "api",
        capabilities: ["campaign_management", "reporting", "budget_monitoring"],
        scopes: ["ads_management", "ads_reporting"],
        enabledModules: ["analytics", "promotions_external", "finance", "bugs"],
        dashboardUrl: "https://ads.google.com/",
        notes: "Canal previsto para campanhas externas, relatorios e automacoes futuras com developer token, manager account e OAuth."
    },
    {
        appKey: "meta_ads",
        name: "Meta Ads",
        category: "automation",
        status: "planned",
        maturityStage: "discovery",
        managementMode: "api",
        capabilities: ["campaign_management", "ads_insights", "creative_ops"],
        scopes: ["ads_management", "business_management"],
        enabledModules: ["analytics", "promotions_external", "finance", "bugs"],
        dashboardUrl: "https://adsmanager.facebook.com/",
        notes: "Canal previsto para campanhas externas e insights do funil, sujeito a app review, permissoes e tokens do ecossistema Meta."
    }
];

function parseBoolean(value, fallback = false) {
    if (value === undefined || value === null || value === "") {
        return fallback;
    }

    return String(value).toLowerCase() === "true";
}

function parseCsv(value, fallback = []) {
    const source = String(value || "")
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);

    return source.length ? source : [...fallback];
}

function normalizeString(value, fallback = "") {
    const normalized = String(value || "").trim();
    return normalized || fallback;
}

function normalizeStringArray(value, fallback = []) {
    if (Array.isArray(value)) {
        const items = value
            .map((item) => String(item || "").trim())
            .filter(Boolean);
        return items.length ? items : [...fallback];
    }

    return parseCsv(value, fallback);
}

function normalizeManagedApp(value = {}, fallback = {}) {
    const normalizedAppKey = normalizeString(value.appKey || value.app_key, fallback.appKey || "");
    const mappedAppKey = normalizedAppKey === "rotanota_ops" || normalizedAppKey === "north_ecosystem"
        ? "northstar_ecosystem"
        : normalizedAppKey;
    const normalizedCategory = normalizeString(value.category, fallback.category || "internal");
    const mappedCategory = mappedAppKey === "northstar_ecosystem" && normalizedCategory === "internal"
        ? "management"
        : normalizedCategory;

    return {
        appKey: mappedAppKey,
        name: normalizeString(value.name, fallback.name || ""),
        category: mappedCategory,
        status: normalizeString(value.status, fallback.status || "planned"),
        maturityStage: normalizeString(value.maturityStage || value.maturity_stage, fallback.maturityStage || "planned"),
        managementMode: normalizeString(value.managementMode || value.management_mode, fallback.managementMode || "manual"),
        capabilities: normalizeStringArray(value.capabilities, fallback.capabilities || []),
        scopes: normalizeStringArray(value.scopes, fallback.scopes || []),
        enabledModules: normalizeStringArray(value.enabledModules || value.enabled_modules, fallback.enabledModules || DEFAULT_APP_MODULES),
        dashboardUrl: normalizeString(value.dashboardUrl || value.dashboard_url, fallback.dashboardUrl || ""),
        notes: normalizeString(value.notes, fallback.notes || ""),
        lastCheckedAt: normalizeString(value.lastCheckedAt || value.last_checked_at, fallback.lastCheckedAt || ""),
        healthStatus: normalizeString(value.healthStatus || value.health_status, fallback.healthStatus || "unknown"),
        healthSummary: normalizeString(value.healthSummary || value.health_summary, fallback.healthSummary || ""),
        lastError: normalizeString(value.lastError || value.last_error, fallback.lastError || ""),
        healthChecks: normalizeStringArray(value.healthChecks || value.health_checks, fallback.healthChecks || [])
    };
}

function mergeManagedApps(stored = []) {
    const registry = new Map();

    DEFAULT_MANAGED_APPS.forEach((item) => {
        const normalized = normalizeManagedApp(item);
        registry.set(normalized.appKey, normalized);
    });

    (Array.isArray(stored) ? stored : []).forEach((item) => {
        const incoming = normalizeManagedApp(item);

        if (!incoming.appKey) {
            return;
        }

        const current = registry.get(incoming.appKey) || {};
        registry.set(incoming.appKey, normalizeManagedApp({
            ...current,
            ...incoming,
            capabilities: incoming.capabilities.length ? incoming.capabilities : current.capabilities,
            scopes: incoming.scopes.length ? incoming.scopes : current.scopes
        }, current));
    });

    return [...registry.values()].sort((left, right) => left.name.localeCompare(right.name, "pt-BR"));
}

function getEnvironmentDefaults() {
    return {
        thresholds: { ...DEFAULT_THRESHOLDS },
        lanes: {
            freeLanePaused: false,
            premiumLanePaused: false
        },
        promotionMode: process.env.OPS_PROMOTION_MODE || "suggest",
        promotionChannels: parseCsv(
            process.env.OPS_PROMOTION_CHANNELS,
            DEFAULT_PROMOTION_CHANNELS
        ),
        copilot: {
            enabled: parseBoolean(process.env.OPS_COPILOT_ENABLED, true),
            defaultModel: process.env.OPS_COPILOT_DEFAULT_MODEL || "gemini-2.5-flash-lite",
            strategyModel: process.env.OPS_COPILOT_STRATEGY_MODEL || "gemini-2.5-flash",
            monthlyHardCap: 300,
            dailyManualCap: 3,
            threeDayReviewMonthlyCap: 12
        },
        lastProviderStatus: "unknown",
        lastAlertAt: null
    };
}

function deepMerge(base, incoming) {
    if (!incoming || typeof incoming !== "object") {
        return Array.isArray(base) ? [...base] : { ...base };
    }

    return Object.keys({ ...base, ...incoming }).reduce((acc, key) => {
        const baseValue = base ? base[key] : undefined;
        const nextValue = incoming[key];

        if (
            baseValue &&
            nextValue &&
            typeof baseValue === "object" &&
            typeof nextValue === "object" &&
            !Array.isArray(baseValue) &&
            !Array.isArray(nextValue)
        ) {
            acc[key] = deepMerge(baseValue, nextValue);
            return acc;
        }

        if (Array.isArray(nextValue)) {
            acc[key] = [...nextValue];
            return acc;
        }

        acc[key] = nextValue !== undefined ? nextValue : baseValue;
        return acc;
    }, Array.isArray(base) ? [] : {});
}

function normalizePrimaryState(value = {}) {
    return deepMerge(getEnvironmentDefaults(), value);
}

function startOfDay(date = new Date()) {
    const copy = new Date(date);
    copy.setHours(0, 0, 0, 0);
    return copy;
}

function startOfWeek(date = new Date()) {
    const copy = startOfDay(date);
    const day = copy.getDay();
    const diff = day === 0 ? -6 : 1 - day;
    copy.setDate(copy.getDate() + diff);
    return copy;
}

function startOfMonth(date = new Date()) {
    return new Date(date.getFullYear(), date.getMonth(), 1);
}

function addDays(date, amount) {
    const copy = new Date(date);
    copy.setDate(copy.getDate() + amount);
    return copy;
}

function getMonthKey(date = new Date()) {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

function getDayKey(date = new Date()) {
    return startOfDay(date).toISOString().slice(0, 10);
}

function getWeekKey(date = new Date()) {
    const start = startOfWeek(date);
    return `${start.getFullYear()}-W${String(Math.ceil((((start - new Date(start.getFullYear(), 0, 1)) / 86400000) + 1) / 7)).padStart(2, "0")}`;
}

function isFreeUsageEvent(eventType = "") {
    return [
        "free_bundle_generated",
        "trial_bundle_completed",
        "free_pdf_bundle_ready"
    ].includes(String(eventType || ""));
}

module.exports = {
    DEFAULT_THRESHOLDS,
    DEFAULT_PROMOTION_CHANNELS,
    DEFAULT_APP_MODULES,
    DEFAULT_MANAGED_APPS,
    parseBoolean,
    parseCsv,
    normalizeManagedApp,
    mergeManagedApps,
    getEnvironmentDefaults,
    normalizePrimaryState,
    startOfDay,
    startOfWeek,
    startOfMonth,
    addDays,
    getMonthKey,
    getDayKey,
    getWeekKey,
    isFreeUsageEvent
};

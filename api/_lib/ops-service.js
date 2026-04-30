const crypto = require("crypto");
const { isSupabaseConfigured, supabaseRequest } = require("./supabase");
const { DEFAULT_APP_MODULES, normalizePrimaryState, normalizeManagedApp, mergeManagedApps, startOfDay, startOfWeek, startOfMonth, addDays, getMonthKey, getDayKey, getWeekKey, isFreeUsageEvent } = require("./ops-defaults");
const { isGeminiConfigured, callGeminiJson } = require("./gemini");
const { sanitizeCustomerId, applyPaymentToEntitlement } = require("./premium-entitlements");

const GROWTH_TABLE = "premium_study_growth_events";
const SPEND_TABLE = "premium_study_channel_spend";
const ALERTS_TABLE = "premium_study_ops_alerts";
const STATE_TABLE = "premium_study_ops_state";
const PROMOTION_CAMPAIGNS_TABLE = "premium_study_promotion_campaigns";
const PROMOTION_ACTIONS_TABLE = "premium_study_promotion_actions";
const PROMOTION_RULES_TABLE = "premium_study_promotion_rules";
const APP_WORK_ITEMS_TABLE = "northstar_app_work_items";
const APP_BUG_REPORTS_TABLE = "northstar_app_bug_reports";
const APP_FINANCE_SNAPSHOTS_TABLE = "northstar_app_finance_snapshots";
const CHANGE_REQUESTS_TABLE = "northstar_change_requests";
const REVIEW_RUNS_TABLE = "northstar_review_runs";
const AUDIT_LOG_TABLE = "northstar_audit_log";
const MANAGED_APPS_STATE_KEY = "managed_apps_registry";
const OPS_AI_MEMORY_STATE_KEY = "papiro_ops_ai_memory";
const MARKETING_CONTENT_STATE_KEY = "papiro_marketing_content_queue";

const EVENT_BUCKETS = {
    premium_entry_view: "visits",
    premium_module_entry: "visits",
    pdf_upload_success: "uploads",
    pdf_upload_blocked: "uploadsBlocked",
    trial_started: "trialStarts",
    free_bundle_generated: "bundles",
    trial_bundle_completed: "bundles",
    premium_bundle_generated: "bundles",
    paywall_viewed: "paywalls",
    checkout_click: "checkoutClicks",
    checkout_created: "checkoutCreated",
    webhook_received: "webhooks",
    premium_activated: "premiumActivations",
    premium_active_client_seen: "premiumActivations",
    resume_latest_study: "resumes"
};

function getNow() {
    return new Date();
}

function getEnvValue(name) {
    return String(process.env[name] || "").trim();
}

function safeArray(value) {
    return Array.isArray(value) ? value : [];
}

function encodeFilter(operator, value) {
    return `${operator}.${encodeURIComponent(String(value))}`;
}

function buildTablePath(table, {
    select = "*",
    filters = [],
    order = "",
    limit = 0
} = {}) {
    const parts = [`select=${encodeURIComponent(select)}`];

    filters.forEach((item) => {
        if (item && item.column && item.value) {
            parts.push(`${item.column}=${item.value}`);
        }
    });

    if (order) {
        parts.push(`order=${encodeURIComponent(order)}`);
    }

    if (limit) {
        parts.push(`limit=${Number(limit)}`);
    }

    return `${table}?${parts.join("&")}`;
}

async function listRows(table, options = {}) {
    if (!isSupabaseConfigured()) {
        return {
            ok: true,
            configured: false,
            data: []
        };
    }

    const response = await supabaseRequest(buildTablePath(table, options));

    return {
        ok: response.ok,
        configured: true,
        data: Array.isArray(response.data) ? response.data : [],
        error: response.error
    };
}

async function insertRow(table, body) {
    if (!isSupabaseConfigured()) {
        return {
            ok: false,
            configured: false,
            skipped: true,
            data: null
        };
    }

    return supabaseRequest(table, {
        method: "POST",
        prefer: "return=representation",
        body
    });
}

async function upsertRow(table, body, onConflict) {
    if (!isSupabaseConfigured()) {
        return {
            ok: false,
            configured: false,
            skipped: true,
            data: null
        };
    }

    return supabaseRequest(`${table}?on_conflict=${encodeURIComponent(onConflict)}`, {
        method: "POST",
        prefer: "resolution=merge-duplicates,return=representation",
        body
    });
}

async function patchRows(table, filters, body) {
    if (!isSupabaseConfigured()) {
        return {
            ok: false,
            configured: false,
            skipped: true,
            data: null
        };
    }

    return supabaseRequest(buildTablePath(table, { filters }), {
        method: "PATCH",
        prefer: "return=representation",
        body
    });
}

async function insertAuditLog(input = {}) {
    if (!isSupabaseConfigured()) {
        return {
            ok: false,
            configured: false,
            skipped: true
        };
    }

    return insertRow(AUDIT_LOG_TABLE, {
        event_type: String(input.eventType || input.event_type || "ops_event").trim() || "ops_event",
        actor: String(input.actor || "papiro_ops").trim() || "papiro_ops",
        target_system: String(input.targetSystem || input.target_system || "").trim(),
        entity_type: String(input.entityType || input.entity_type || "").trim(),
        entity_id: String(input.entityId || input.entity_id || "").trim(),
        status: String(input.status || "info").trim() || "info",
        metadata: input.metadata && typeof input.metadata === "object"
            ? input.metadata
            : {}
    });
}

async function getStateValue(stateKey, fallback = null) {
    const response = await listRows(STATE_TABLE, {
        filters: [
            {
                column: "state_key",
                value: encodeFilter("eq", stateKey)
            }
        ],
        limit: 1
    });

    const row = response.ok ? response.data[0] : null;
    if (!row) {
        return fallback;
    }
    if (row.state_value !== undefined) {
        return row.state_value;
    }
    if (row.value !== undefined) {
        return row.value;
    }
    return fallback;
}

async function setStateValue(stateKey, value) {
    const payload = {
        state_key: stateKey,
        state_value: value || {}
    };
    const result = await upsertRow(STATE_TABLE, payload, "state_key");

    if (result.ok || !result.error || !["PGRST204", "42703"].includes(String(result.error.code || ""))) {
        return result;
    }

    return upsertRow(STATE_TABLE, {
        state_key: stateKey,
        value: value || {}
    }, "state_key");
}

async function getPrimaryOpsState() {
    const stored = await getStateValue("primary", {});
    return normalizePrimaryState(stored || {});
}

function buildManagedAppsSummary(items = []) {
    const list = safeArray(items);
    return {
        total: list.length,
        connected: list.filter((item) => item.status === "connected").length,
        planned: list.filter((item) => item.status === "planned").length,
        attention: list.filter((item) => item.status === "attention").length,
        healthy: list.filter((item) => item.healthStatus === "healthy").length,
        warning: list.filter((item) => item.healthStatus === "warning").length,
        failed: list.filter((item) => item.healthStatus === "failed").length,
        notConfigured: list.filter((item) => item.healthStatus === "not_configured").length,
        unknown: list.filter((item) => !item.healthStatus || item.healthStatus === "unknown").length
    };
}

function getModuleLabels() {
    return {
        dev: "Desenvolvimento",
        analytics: "Analise operacional",
        improvements: "Melhorias",
        promotions_internal: "Promocoes internas",
        promotions_external: "Promocoes externas",
        finance: "Financas",
        bugs: "Bugs"
    };
}

function getDefaultOpsAiMemory() {
    return {
        version: 2,
        productName: "Papiro Tools",
        mission: "Manter a operacao do Papiro Tools estavel, com vendas premium saudaveis, divulgacao organica em movimento e alertas acionaveis.",
        guardrails: [
            "Nunca executar mudanca destrutiva sem tarefa aprovada.",
            "Priorizar vendas premium, acesso premium, Mercado Pago, Supabase, Gemini e alertas ativos.",
            "Separar problema real de historico resolvido.",
            "Preferir acoes pequenas, reversiveis e verificaveis.",
            "Nao recomendar aumento alto de gasto pago sem dados de conversao suficientes.",
            "Escrever para o dono do negocio em linguagem simples; termos tecnicos ficam apenas em detalhes."
        ],
        recurringChecks: [
            "Verificar se Mercado Pago esta recebendo avisos de pagamento corretamente.",
            "Verificar se activeAlerts esta zerado ou explicado.",
            "Verificar se freeLaneStatus esta healthy.",
            "Verificar se Supabase e Gemini estao configurados.",
            "Verificar se ha venda recente sem ativacao premium que precise reprocessamento.",
            "Verificar se existem tarefas pendentes ha muitos dias."
        ],
        playbooks: {
            mercadoPagoWebhook: [
                "Se Mercado Pago nao estiver recebendo avisos corretamente, conferir MERCADO_PAGO_WEBHOOK_SECRET e notification_url nos detalhes tecnicos.",
                "Se houver assinatura invalida ativa, coletar diagnostico antes de mexer na validacao.",
                "Se pagamento aprovado nao ativar premium, criar tarefa de reprocessamento com o numero do pagamento."
            ],
            alerts: [
                "Alertas ativos devem virar investigacao ou resolucao; alertas antigos resolvidos nao devem poluir o painel.",
                "Queda da IA principal so vira prioridade se se repetir; primeiro usar plano reserva e registrar em historico."
            ],
            growth: [
                "Sem volume de conversao, priorizar melhoria interna e instrumentacao antes de gasto pago.",
                "Com canal vencedor, sugerir campanha pequena e mensuravel."
            ],
            organicMarketing: [
                "Manter fila semanal de conteudo organico antes de pensar em gasto pago.",
                "Priorizar Meta Business Suite gratuito para Instagram/Facebook e usar Buffer/Publer apenas como fila auxiliar.",
                "Todo post deve ter CTA claro para usar o Papiro, treinar questoes ou conhecer o premium.",
                "Nao automatizar curtidas, follows, DMs ou comentarios em massa."
            ],
            ownerDashboard: [
                "Comecar sempre por: o que precisa de atencao hoje, dinheiro, divulgacao e saude do sistema.",
                "Transformar alertas tecnicos em tarefas com uma proxima acao clara.",
                "Nao mostrar provider, webhook, entitlement, change request ou fallback sem traducao para linguagem comum."
            ]
        },
        brandVoice: {
            audience: "estudantes do ensino medio, vestibulandos e pessoas que querem estudar com menos atrito",
            tone: "direto, util, confiante, sem promessa exagerada",
            cta: "Entrar no Papiro e estudar com foco"
        },
        freeGrowthStack: [
            {
                name: "Meta Business Suite",
                cost: "zero",
                use: "agendar Instagram e Facebook, acompanhar insights e publicar Stories/Reels sem ferramenta paga"
            },
            {
                name: "Instagram scheduler nativo",
                cost: "zero",
                use: "programar posts diretamente pelo app quando nao precisar de painel externo"
            },
            {
                name: "Buffer Free",
                cost: "zero com limite",
                use: "fila simples para ate 3 canais e poucos posts em espera por canal"
            },
            {
                name: "Publer Free",
                cost: "zero com limite",
                use: "fila auxiliar para multiplataforma quando o limite gratuito atender"
            },
            {
                name: "Canva Free",
                cost: "zero com recursos limitados",
                use: "montar artes simples a partir dos roteiros e carrosseis gerados pela retaguarda"
            }
        ],
        updatedAt: new Date().toISOString()
    };
}

async function getOpsAiMemory() {
    const stored = await getStateValue(OPS_AI_MEMORY_STATE_KEY, null);
    const defaults = getDefaultOpsAiMemory();
    return stored && typeof stored === "object"
        ? {
            ...defaults,
            ...stored,
            version: defaults.version,
            productName: defaults.productName,
            mission: defaults.mission,
            guardrails: Array.from(new Set([
                ...safeArray(defaults.guardrails),
                ...safeArray(stored.guardrails)
            ])),
            recurringChecks: Array.from(new Set([
                ...safeArray(defaults.recurringChecks),
                ...safeArray(stored.recurringChecks)
            ])),
            playbooks: {
                ...defaults.playbooks,
                ...(stored.playbooks || {}),
                mercadoPagoWebhook: defaults.playbooks.mercadoPagoWebhook,
                alerts: defaults.playbooks.alerts,
                ownerDashboard: defaults.playbooks.ownerDashboard
            }
        }
        : defaults;
}

async function saveOpsAiMemory(partial = {}) {
    const current = await getOpsAiMemory();
    const next = {
        ...current,
        ...(partial && typeof partial === "object" ? partial : {}),
        playbooks: {
            ...(current.playbooks || {}),
            ...((partial && partial.playbooks) || {})
        },
        updatedAt: new Date().toISOString()
    };
    await setStateValue(OPS_AI_MEMORY_STATE_KEY, next);
    return next;
}

function hasFreshManagedAppChecks(items = [], maxAgeMs = 15 * 60 * 1000) {
    const list = safeArray(items);

    if (!list.length) {
        return false;
    }

    return list.every((item) => {
        if (!item.lastCheckedAt) {
            return false;
        }

        const checkedAt = new Date(item.lastCheckedAt).getTime();
        if (!Number.isFinite(checkedAt)) {
            return false;
        }

        return Date.now() - checkedAt <= maxAgeMs;
    });
}

function getMaturityLabel(value = "") {
    const labels = {
        live: "live",
        active_build: "em construcao",
        pilot: "piloto",
        discovery: "descoberta",
        planned: "planejado"
    };

    return labels[String(value || "").trim()] || String(value || "planned").trim() || "planned";
}

function emptyModuleSummary(moduleKey) {
    return {
        moduleKey,
        label: getModuleLabels()[moduleKey] || moduleKey,
        status: "planned",
        summary: "Modulo ainda sem dados consolidados.",
        metrics: []
    };
}

function formatProviderError(error, fallback = "provider_error") {
    if (!error) {
        return fallback;
    }

    if (typeof error === "string") {
        return error;
    }

    if (typeof error.message === "string" && error.message.trim()) {
        return error.message.trim();
    }

    try {
        return JSON.stringify(error);
    } catch (stringifyError) {
        return fallback;
    }
}

function parseJsonSafe(value, fallback = null) {
    try {
        return JSON.parse(value);
    } catch (error) {
        return fallback;
    }
}

function toBase64Url(value) {
    return Buffer.from(value)
        .toString("base64")
        .replace(/\+/g, "-")
        .replace(/\//g, "_")
        .replace(/=+$/g, "");
}

async function getGoogleAdsAccessToken() {
    const serviceAccountKey = getEnvValue("GOOGLE_ADS_SERVICE_ACCOUNT_KEY");
    const oauthClientId = getEnvValue("GOOGLE_ADS_CLIENT_ID");
    const oauthClientSecret = getEnvValue("GOOGLE_ADS_CLIENT_SECRET");
    const refreshToken = getEnvValue("GOOGLE_ADS_REFRESH_TOKEN");

    if (serviceAccountKey) {
        const credentials = parseJsonSafe(serviceAccountKey, null);
        if (!credentials || !credentials.client_email || !credentials.private_key || !credentials.token_uri) {
            return {
                ok: false,
                status: "invalid_service_account_key"
            };
        }

        const issuedAt = Math.floor(Date.now() / 1000);
        const expiresAt = issuedAt + 3600;
        const header = toBase64Url(JSON.stringify({ alg: "RS256", typ: "JWT" }));
        const claimSet = toBase64Url(JSON.stringify({
            iss: credentials.client_email,
            scope: "https://www.googleapis.com/auth/adwords",
            aud: credentials.token_uri,
            exp: expiresAt,
            iat: issuedAt
        }));
        const signer = crypto.createSign("RSA-SHA256");
        signer.update(`${header}.${claimSet}`);
        signer.end();
        const signature = signer.sign(credentials.private_key)
            .toString("base64")
            .replace(/\+/g, "-")
            .replace(/\//g, "_")
            .replace(/=+$/g, "");
        const assertion = `${header}.${claimSet}.${signature}`;

        const response = await fetch(credentials.token_uri, {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: new URLSearchParams({
                grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
                assertion
            })
        });
        const payload = await response.json().catch(() => null);

        if (!response.ok || !payload || !payload.access_token) {
            return {
                ok: false,
                status: "google_ads_auth_failed",
                payload
            };
        }

        return {
            ok: true,
            accessToken: payload.access_token,
            authMode: "service_account"
        };
    }

    if (oauthClientId && oauthClientSecret && refreshToken) {
        const response = await fetch("https://oauth2.googleapis.com/token", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: new URLSearchParams({
                client_id: oauthClientId,
                client_secret: oauthClientSecret,
                refresh_token: refreshToken,
                grant_type: "refresh_token"
            })
        });
        const payload = await response.json().catch(() => null);

        if (!response.ok || !payload || !payload.access_token) {
            return {
                ok: false,
                status: "google_ads_auth_failed",
                payload
            };
        }

        return {
            ok: true,
            accessToken: payload.access_token,
            authMode: "oauth"
        };
    }

    return {
        ok: false,
        status: "google_ads_auth_not_configured"
    };
}

function getEnvValue(name) {
    return String(process.env[name] || "").trim();
}

async function inspectOpsManagedApp(app, state) {
    const passwordConfigured = Boolean(getEnvValue("OPS_PANEL_PASSWORD"));
    const checks = [
        passwordConfigured
            ? "OPS_PANEL_PASSWORD configurado"
            : "OPS_PANEL_PASSWORD pendente",
        state && state.thresholds
            ? "estado operacional carregado"
            : "estado operacional indisponivel"
    ];

        return normalizeManagedApp({
        ...app,
        healthStatus: passwordConfigured ? "healthy" : "not_configured",
        healthSummary: passwordConfigured
            ? "Retaguarda Papiro pronta para autenticacao."
            : "Configure OPS_PANEL_PASSWORD para liberar a retaguarda Papiro.",
        lastError: passwordConfigured ? "" : "OPS_PANEL_PASSWORD ausente",
        healthChecks: checks
    }, app);
}

async function inspectVercelManagedApp(app) {
    const vercelEnv = getEnvValue("VERCEL_ENV");
    const projectUrl = getEnvValue("VERCEL_PROJECT_PRODUCTION_URL") || getEnvValue("VERCEL_URL");
    const vercelRuntime = Boolean(getEnvValue("VERCEL") || vercelEnv || projectUrl);
    const isLocal = String(process.env.NODE_ENV || "").trim() !== "production";

    const checks = [
        vercelRuntime
            ? `runtime Vercel detectado${vercelEnv ? ` (${vercelEnv})` : ""}`
            : (isLocal ? "ambiente local fora da Vercel" : "runtime Vercel nao detectado"),
        projectUrl
            ? `url de projeto disponivel: ${projectUrl}`
            : "url de projeto nao exposta no runtime"
    ];

    if (vercelRuntime) {
        return normalizeManagedApp({
            ...app,
            healthStatus: "healthy",
            healthSummary: `Operacao vinculada a deploy${vercelEnv ? ` ${vercelEnv}` : ""}.`,
            lastError: "",
            healthChecks: checks
        }, app);
    }

    if (isLocal) {
        return normalizeManagedApp({
            ...app,
            healthStatus: "warning",
            healthSummary: "Rodando em ambiente local; sinais da Vercel ficam limitados aqui.",
            lastError: "",
            healthChecks: checks
        }, app);
    }

    return normalizeManagedApp({
        ...app,
        healthStatus: "failed",
        healthSummary: "Nao foi possivel confirmar o runtime da Vercel.",
        lastError: "runtime_vercel_not_detected",
        healthChecks: checks
    }, app);
}

async function inspectSupabaseManagedApp(app) {
    if (!isSupabaseConfigured()) {
        return normalizeManagedApp({
            ...app,
            healthStatus: "not_configured",
            healthSummary: "Supabase ainda nao esta configurado no ambiente.",
            lastError: "supabase_not_configured",
            healthChecks: [
                "SUPABASE_URL pendente ou vazio",
                "SUPABASE_SERVICE_ROLE_KEY pendente ou vazio"
            ]
        }, app);
    }

    try {
        const response = await supabaseRequest(`${STATE_TABLE}?select=state_key&limit=1`);

        if (!response.ok) {
            return normalizeManagedApp({
                ...app,
                healthStatus: "failed",
                healthSummary: "Falha ao consultar o Supabase.",
                lastError: formatProviderError(response.error, "supabase_request_failed"),
                healthChecks: [
                    "credenciais do Supabase carregadas",
                    `consulta rest respondeu ${response.status || "erro"}`
                ]
            }, app);
        }

        return normalizeManagedApp({
            ...app,
            healthStatus: "healthy",
            healthSummary: "Conexao com o Supabase validada com sucesso.",
            lastError: "",
            healthChecks: [
                "credenciais do Supabase carregadas",
                "consulta de estado operacional respondeu com sucesso"
            ]
        }, app);
    } catch (error) {
        return normalizeManagedApp({
            ...app,
            healthStatus: "failed",
            healthSummary: "Erro inesperado ao validar o Supabase.",
            lastError: formatProviderError(error, "supabase_request_failed"),
            healthChecks: [
                "credenciais do Supabase carregadas",
                "consulta de validacao falhou antes da resposta"
            ]
        }, app);
    }
}

async function inspectMercadoPagoManagedApp(app) {
    const accessToken = getEnvValue("MERCADO_PAGO_ACCESS_TOKEN");
    const webhookSecret = getEnvValue("MERCADO_PAGO_WEBHOOK_SECRET");

    if (!accessToken) {
        return normalizeManagedApp({
            ...app,
            healthStatus: "not_configured",
            healthSummary: "Checkout indisponivel sem MERCADO_PAGO_ACCESS_TOKEN.",
            lastError: "missing_access_token",
            healthChecks: [
                "MERCADO_PAGO_ACCESS_TOKEN pendente",
                "MERCADO_PAGO_WEBHOOK_SECRET pendente"
            ]
        }, app);
    }

    try {
        const response = await fetch("https://api.mercadopago.com/users/me", {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });

        if (!response.ok) {
            return normalizeManagedApp({
                ...app,
                healthStatus: "failed",
                healthSummary: "Mercado Pago recusou a validacao do token.",
                lastError: `mercado_pago_status_${response.status}`,
                healthChecks: [
                    `access token respondeu ${response.status}`,
                    webhookSecret
                        ? "MERCADO_PAGO_WEBHOOK_SECRET configurado"
                        : "MERCADO_PAGO_WEBHOOK_SECRET pendente"
                ]
            }, app);
        }

        return normalizeManagedApp({
            ...app,
            healthStatus: webhookSecret ? "healthy" : "warning",
            healthSummary: webhookSecret
                ? "Checkout e webhook prontos para operacao."
                : "Checkout ativo; falta fechar MERCADO_PAGO_WEBHOOK_SECRET.",
            lastError: webhookSecret ? "" : "missing_webhook_secret",
            healthChecks: [
                "access token validado no provider",
                webhookSecret
                    ? "MERCADO_PAGO_WEBHOOK_SECRET configurado"
                    : "MERCADO_PAGO_WEBHOOK_SECRET pendente"
            ]
        }, app);
    } catch (error) {
        return normalizeManagedApp({
            ...app,
            healthStatus: "failed",
            healthSummary: "Erro de rede ao validar o Mercado Pago.",
            lastError: formatProviderError(error, "mercado_pago_unreachable"),
            healthChecks: [
                "MERCADO_PAGO_ACCESS_TOKEN carregado",
                webhookSecret
                    ? "MERCADO_PAGO_WEBHOOK_SECRET configurado"
                    : "MERCADO_PAGO_WEBHOOK_SECRET pendente"
            ]
        }, app);
    }
}

async function inspectGeminiManagedApp(app) {
    const apiKey = getEnvValue("GEMINI_API_KEY") || getEnvValue("GEMINI_PAID_API_KEY") || getEnvValue("GEMINI_FREE_API_KEY");

    if (!apiKey || !isGeminiConfigured()) {
        return normalizeManagedApp({
            ...app,
            healthStatus: "not_configured",
            healthSummary: "Gemini ainda nao esta configurado no ambiente.",
            lastError: "gemini_not_configured",
            healthChecks: [
                "GEMINI_API_KEY ou chaves equivalentes pendentes",
                "copiloto fica em fallback sem provider"
            ]
        }, app);
    }

    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${encodeURIComponent(apiKey)}`);
        const payload = await response.json().catch(() => null);

        if (!response.ok) {
            return normalizeManagedApp({
                ...app,
                healthStatus: "failed",
                healthSummary: "Gemini recusou a validacao da chave.",
                lastError: formatProviderError(payload, `gemini_status_${response.status}`),
                healthChecks: [
                    `listagem de modelos respondeu ${response.status}`,
                    "copiloto nao conseguiu validar o provider"
                ]
            }, app);
        }

        const models = Array.isArray(payload && payload.models) ? payload.models : [];

        return normalizeManagedApp({
            ...app,
            healthStatus: "healthy",
            healthSummary: `Provider Gemini validado com ${models.length} modelo(s) listado(s).`,
            lastError: "",
            healthChecks: [
                "api key carregada",
                `provider respondeu com ${models.length} modelo(s)`
            ]
        }, app);
    } catch (error) {
        return normalizeManagedApp({
            ...app,
            healthStatus: "failed",
            healthSummary: "Erro de rede ao validar o Gemini.",
            lastError: formatProviderError(error, "gemini_unreachable"),
            healthChecks: [
                "api key carregada",
                "listagem de modelos falhou antes da resposta"
            ]
        }, app);
    }
}

async function inspectGitHubManagedApp(app) {
    const owner = getEnvValue("VERCEL_GIT_REPO_OWNER");
    const repo = getEnvValue("VERCEL_GIT_REPO_SLUG");
    const commitSha = getEnvValue("VERCEL_GIT_COMMIT_SHA") || getEnvValue("GITHUB_SHA");
    const token = getEnvValue("GITHUB_TOKEN");
    const repoDetected = Boolean(owner && repo);

    if (token && repoDetected) {
        return normalizeManagedApp({
            ...app,
            healthStatus: "healthy",
            healthSummary: `GitHub pronto para automacao em ${owner}/${repo}.`,
            lastError: "",
            healthChecks: [
                `repositorio detectado: ${owner}/${repo}`,
                commitSha ? `ultimo commit conhecido: ${commitSha.slice(0, 7)}` : "commit atual nao informado",
                "GITHUB_TOKEN configurado"
            ]
        }, app);
    }

    if (repoDetected) {
        return normalizeManagedApp({
            ...app,
            healthStatus: "warning",
            healthSummary: `Repositorio ${owner}/${repo} detectado, mas falta token/app para operacao automatica.`,
            lastError: "missing_github_token",
            healthChecks: [
                `repositorio detectado: ${owner}/${repo}`,
                commitSha ? `ultimo commit conhecido: ${commitSha.slice(0, 7)}` : "commit atual nao informado",
                "GITHUB_TOKEN pendente"
            ]
        }, app);
    }

    return normalizeManagedApp({
        ...app,
        healthStatus: "not_configured",
        healthSummary: "GitHub ainda nao esta conectado ao hub operacional.",
        lastError: "github_not_configured",
        healthChecks: [
            "metadata de repositorio nao detectada no runtime",
            "GITHUB_TOKEN pendente"
        ]
    }, app);
}

async function inspectGoogleAdsManagedApp(app) {
    const developerToken = getEnvValue("GOOGLE_ADS_DEVELOPER_TOKEN");
    const managerCustomerId = getEnvValue("GOOGLE_ADS_MANAGER_CUSTOMER_ID");
    const customerId = getEnvValue("GOOGLE_ADS_CUSTOMER_ID") || getEnvValue("GOOGLE_ADS_CLIENT_CUSTOMER_ID");
    const serviceAccountKey = getEnvValue("GOOGLE_ADS_SERVICE_ACCOUNT_KEY");
    const oauthClientId = getEnvValue("GOOGLE_ADS_CLIENT_ID");
    const oauthClientSecret = getEnvValue("GOOGLE_ADS_CLIENT_SECRET");
    const refreshToken = getEnvValue("GOOGLE_ADS_REFRESH_TOKEN");
    const authReady = Boolean(serviceAccountKey || (oauthClientId && oauthClientSecret && refreshToken));

    const checks = [
        developerToken ? "developer token configurado" : "developer token pendente",
        managerCustomerId ? `manager account: ${managerCustomerId}` : "manager account pendente",
        customerId ? `customer account: ${customerId}` : "customer account pendente",
        authReady
            ? (serviceAccountKey ? "service account configurada" : "OAuth configurado")
            : "autenticacao Google Ads pendente"
    ];

    if (developerToken && managerCustomerId && customerId && authReady) {
        try {
            const auth = await getGoogleAdsAccessToken();

            if (!auth.ok || !auth.accessToken) {
                return normalizeManagedApp({
                    ...app,
                    healthStatus: "failed",
                    healthSummary: "Google Ads tem envs carregadas, mas a autenticacao real falhou.",
                    lastError: auth.status || "google_ads_auth_failed",
                    healthChecks: checks
                }, app);
            }

            const response = await fetch(
                `https://googleads.googleapis.com/v18/customers/${encodeURIComponent(customerId)}/googleAds:search`,
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${auth.accessToken}`,
                        "developer-token": developerToken,
                        "login-customer-id": managerCustomerId,
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        query: "SELECT customer.id, customer.descriptive_name FROM customer LIMIT 1"
                    })
                }
            );
            const payload = await response.json().catch(() => null);

            if (!response.ok) {
                return normalizeManagedApp({
                    ...app,
                    healthStatus: "failed",
                    healthSummary: "Google Ads autenticou, mas a leitura real da conta falhou.",
                    lastError: formatProviderError(payload, `google_ads_status_${response.status}`),
                    healthChecks: [
                        ...checks,
                        `auth: ${auth.authMode}`,
                        `leitura real respondeu ${response.status}`
                    ]
                }, app);
            }

            return normalizeManagedApp({
                ...app,
                healthStatus: "healthy",
                healthSummary: "Google Ads validado com leitura real segura da conta.",
                lastError: "",
                healthChecks: [
                    ...checks,
                    `auth: ${auth.authMode}`,
                    "leitura real da conta concluida"
                ]
            }, app);
        } catch (error) {
            return normalizeManagedApp({
                ...app,
                healthStatus: "failed",
                healthSummary: "Erro de rede ao validar Google Ads com leitura real.",
                lastError: formatProviderError(error, "google_ads_unreachable"),
                healthChecks: checks
            }, app);
        }
    }

    if (developerToken || managerCustomerId || customerId || authReady) {
        return normalizeManagedApp({
            ...app,
            healthStatus: "warning",
            healthSummary: "Google Ads parcialmente configurado; ainda faltam credenciais ou contas para operacao segura.",
            lastError: "google_ads_incomplete_setup",
            healthChecks: checks
        }, app);
    }

    return normalizeManagedApp({
        ...app,
        healthStatus: "not_configured",
        healthSummary: "Google Ads ainda nao esta configurado no hub operacional.",
        lastError: "google_ads_not_configured",
        healthChecks: checks
    }, app);
}

async function inspectMetaAdsManagedApp(app) {
    const appId = getEnvValue("META_APP_ID");
    const adAccountId = getEnvValue("META_AD_ACCOUNT_ID");
    const accessToken = getEnvValue("META_ACCESS_TOKEN");

    const checks = [
        appId ? `Meta app id: ${appId}` : "META_APP_ID pendente",
        adAccountId ? `ad account: ${adAccountId}` : "META_AD_ACCOUNT_ID pendente",
        accessToken ? "META_ACCESS_TOKEN configurado" : "META_ACCESS_TOKEN pendente"
    ];

    if (appId && adAccountId && accessToken) {
        try {
            const response = await fetch(
                `https://graph.facebook.com/v19.0/act_${encodeURIComponent(adAccountId)}?fields=id,account_id,name&access_token=${encodeURIComponent(accessToken)}`
            );
            const payload = await response.json().catch(() => null);

            if (!response.ok || !payload || payload.error) {
                return normalizeManagedApp({
                    ...app,
                    healthStatus: "failed",
                    healthSummary: "Meta Ads tem envs carregadas, mas a leitura real da conta falhou.",
                    lastError: formatProviderError(payload, `meta_ads_status_${response.status}`),
                    healthChecks: [
                        ...checks,
                        `leitura real respondeu ${response.status}`
                    ]
                }, app);
            }

            return normalizeManagedApp({
                ...app,
                healthStatus: "healthy",
                healthSummary: "Meta Ads validado com leitura real segura da conta.",
                lastError: "",
                healthChecks: [
                    ...checks,
                    "leitura real da conta concluida"
                ]
            }, app);
        } catch (error) {
            return normalizeManagedApp({
                ...app,
                healthStatus: "failed",
                healthSummary: "Erro de rede ao validar Meta Ads com leitura real.",
                lastError: formatProviderError(error, "meta_ads_unreachable"),
                healthChecks: checks
            }, app);
        }
    }

    if (appId || adAccountId || accessToken) {
        return normalizeManagedApp({
            ...app,
            healthStatus: "warning",
            healthSummary: "Meta Ads parcialmente configurado; ainda faltam permissoes ou credenciais para operacao segura.",
            lastError: "meta_ads_incomplete_setup",
            healthChecks: checks
        }, app);
    }

    return normalizeManagedApp({
        ...app,
        healthStatus: "not_configured",
        healthSummary: "Meta Ads ainda nao esta configurado no hub operacional.",
        lastError: "meta_ads_not_configured",
        healthChecks: checks
    }, app);
}

async function inspectManagedApp(app, state) {
    if (app.appKey === "rota_nota") {
        return inspectOpsManagedApp(app, state);
    }

    if (app.appKey === "vercel") {
        return inspectVercelManagedApp(app, state);
    }

    if (app.appKey === "supabase") {
        return inspectSupabaseManagedApp(app, state);
    }

    if (app.appKey === "mercado_pago") {
        return inspectMercadoPagoManagedApp(app, state);
    }

    if (app.appKey === "gemini") {
        return inspectGeminiManagedApp(app, state);
    }

    if (app.appKey === "github") {
        return inspectGitHubManagedApp(app, state);
    }

    if (app.appKey === "google_ads") {
        return inspectGoogleAdsManagedApp(app, state);
    }

    if (app.appKey === "meta_ads") {
        return inspectMetaAdsManagedApp(app, state);
    }

    return normalizeManagedApp({
        ...app,
        healthStatus: "unknown",
        healthSummary: "App sem rotina de health check dedicada ainda.",
        lastError: "",
        healthChecks: ["aguardando integracao especifica"]
    }, app);
}

async function getManagedApps(options = {}) {
    const stored = await getStateValue(MANAGED_APPS_STATE_KEY, []);
    const items = mergeManagedApps(stored);
    const ensureFresh = Boolean(options.ensureFresh);
    const maxAgeMs = Number(options.maxAgeMs || (15 * 60 * 1000));

    if (ensureFresh && !hasFreshManagedAppChecks(items, maxAgeMs)) {
        return refreshManagedAppsHealth({
            maxAgeMs
        });
    }

    return {
        ok: true,
        items,
        summary: buildManagedAppsSummary(items)
    };
}

async function refreshManagedAppsHealth(input = {}) {
    const current = await getManagedApps({ ensureFresh: false });
    const state = await getPrimaryOpsState();
    const requestedAppKey = String(input.appKey || input.app_key || "").trim();
    const checkedAt = new Date().toISOString();

    const items = await Promise.all(current.items.map(async (item) => {
        if (requestedAppKey && item.appKey !== requestedAppKey) {
            return item;
        }

        const inspected = await inspectManagedApp(item, state);
        return normalizeManagedApp({
            ...item,
            ...inspected,
            lastCheckedAt: checkedAt
        }, item);
    }));

    await setStateValue(MANAGED_APPS_STATE_KEY, items);

    return {
        ok: true,
        checkedAt,
        checkedCount: requestedAppKey ? items.filter((item) => item.appKey === requestedAppKey).length : items.length,
        items,
        summary: buildManagedAppsSummary(items)
    };
}

async function saveManagedApp(input = {}) {
    const current = await getManagedApps();
    const item = normalizeManagedApp({
        ...input,
        lastCheckedAt: new Date().toISOString()
    });

    if (!item.appKey || !item.name) {
        return {
            ok: false,
            status: "missing_app_identity"
        };
    }

    const registry = new Map(current.items.map((entry) => [entry.appKey, entry]));
    const previous = registry.get(item.appKey) || {};

    registry.set(item.appKey, normalizeManagedApp({
        ...previous,
        ...item,
        capabilities: item.capabilities.length ? item.capabilities : previous.capabilities,
        scopes: item.scopes.length ? item.scopes : previous.scopes,
        enabledModules: item.enabledModules && item.enabledModules.length ? item.enabledModules : previous.enabledModules
    }, previous));

    const items = [...registry.values()].sort((left, right) => left.name.localeCompare(right.name, "pt-BR"));
    await setStateValue(MANAGED_APPS_STATE_KEY, items);

    return {
        ok: true,
        item: registry.get(item.appKey),
        items
    };
}

function normalizeAppKeyInput(input = {}) {
    return normalizeManagedApp({
        appKey: input.appKey || input.app_key
    }).appKey;
}

function normalizeWorkItem(input = {}) {
    const appKey = normalizeAppKeyInput(input);
    return {
        app_key: appKey,
        item_type: String(input.itemType || input.item_type || "improvement").trim() || "improvement",
        title: String(input.title || "").trim(),
        summary: String(input.summary || "").trim(),
        status: String(input.status || "open").trim() || "open",
        priority: Number.isFinite(Number(input.priority)) ? Number(input.priority) : 100,
        owner: String(input.owner || "").trim(),
        metadata: input.metadata && typeof input.metadata === "object" ? input.metadata : {}
    };
}

async function saveAppWorkItem(input = {}) {
    const payload = normalizeWorkItem(input);

    if (!payload.app_key || !payload.title) {
        return {
            ok: false,
            status: "missing_app_work_item_fields"
        };
    }

    const result = await insertRow(APP_WORK_ITEMS_TABLE, payload);
    return {
        ok: result.ok,
        item: Array.isArray(result.data) ? result.data[0] : null
    };
}

function normalizeBugReport(input = {}) {
    const appKey = normalizeAppKeyInput(input);
    return {
        app_key: appKey,
        title: String(input.title || "").trim(),
        description: String(input.description || "").trim(),
        severity: String(input.severity || "medium").trim() || "medium",
        status: String(input.status || "open").trim() || "open",
        source_channel: String(input.sourceChannel || input.source_channel || "ops_console").trim() || "ops_console",
        reporter_email: String(input.reporterEmail || input.reporter_email || "").trim(),
        metadata: input.metadata && typeof input.metadata === "object" ? input.metadata : {}
    };
}

async function saveAppBugReport(input = {}) {
    const payload = normalizeBugReport(input);

    if (!payload.app_key || !payload.title) {
        return {
            ok: false,
            status: "missing_app_bug_fields"
        };
    }

    const result = await insertRow(APP_BUG_REPORTS_TABLE, payload);
    return {
        ok: result.ok,
        item: Array.isArray(result.data) ? result.data[0] : null
    };
}

function normalizeFinanceSnapshot(input = {}) {
    const appKey = normalizeAppKeyInput(input);
    const revenue = Number(input.revenueAmount || input.revenue_amount || 0);
    const expense = Number(input.expenseAmount || input.expense_amount || 0);

    return {
        app_key: appKey,
        period_start: String(input.periodStart || input.period_start || "").trim(),
        period_end: String(input.periodEnd || input.period_end || "").trim(),
        revenue_amount: Number.isFinite(revenue) ? revenue : 0,
        expense_amount: Number.isFinite(expense) ? expense : 0,
        currency: String(input.currency || "BRL").trim() || "BRL",
        source_channel: String(input.sourceChannel || input.source_channel || "manual").trim() || "manual",
        metadata: input.metadata && typeof input.metadata === "object" ? input.metadata : {},
        notes: String(input.notes || "").trim()
    };
}

async function saveAppFinanceSnapshot(input = {}) {
    const payload = normalizeFinanceSnapshot(input);

    if (!payload.app_key || !payload.period_start || !payload.period_end) {
        return {
            ok: false,
            status: "missing_app_finance_fields"
        };
    }

    const result = await insertRow(APP_FINANCE_SNAPSHOTS_TABLE, payload);
    return {
        ok: result.ok,
        item: Array.isArray(result.data) ? result.data[0] : null
    };
}

function getStatusFromCount(count, planned) {
    if (planned) {
        return "planned";
    }

    return count > 0 ? "warning" : "healthy";
}

function sumBy(rows, field) {
    return safeArray(rows).reduce((acc, item) => acc + Number(item && item[field] ? item[field] : 0), 0);
}

function formatModuleMetrics(items = []) {
    return items.filter((item) => item && item.value !== undefined && item.value !== null && item.value !== "");
}

function getPromotionOwner(item = {}) {
    const targeting = item.targeting && typeof item.targeting === "object" ? item.targeting : {};
    return String(targeting.appKey || targeting.app_key || "").trim();
}

function getSpendOwner(item = {}) {
    const metadata = item.metadata && typeof item.metadata === "object" ? item.metadata : {};
    return String(metadata.appKey || metadata.app_key || "").trim();
}

function buildAppModuleSummary(app, context = {}) {
    const modules = {};
    const enabledModules = Array.isArray(app.enabledModules) && app.enabledModules.length
        ? app.enabledModules
        : DEFAULT_APP_MODULES;
    const planned = app.status === "planned";
    const workItems = safeArray(context.workItems);
    const bugReports = safeArray(context.bugReports);
    const financeSnapshots = safeArray(context.financeSnapshots);
    const promotions = safeArray(context.promotions);
    const spends = safeArray(context.spends);

    enabledModules.forEach((moduleKey) => {
        modules[moduleKey] = emptyModuleSummary(moduleKey);
    });

    if (enabledModules.includes("dev")) {
        modules.dev = {
            moduleKey: "dev",
            label: getModuleLabels().dev,
            status: app.healthStatus || (planned ? "planned" : "healthy"),
            summary: app.healthSummary || (planned ? "App ainda sem infraestrutura conectada." : "Ambiente operacional pronto para acompanhamento tecnico."),
            metrics: formatModuleMetrics([
                { label: "gestao", value: app.managementMode || "-" },
                { label: "maturidade", value: getMaturityLabel(app.maturityStage) }
            ])
        };
    }

    if (enabledModules.includes("analytics")) {
        if (app.appKey === "rota_nota" && context.growthOverview) {
            const growth = context.growthOverview;
            modules.analytics = {
                moduleKey: "analytics",
                label: getModuleLabels().analytics,
                status: "healthy",
                summary: "Analise operacional alimentada pelos sinais reais do produto e do funil premium.",
                metrics: formatModuleMetrics([
                    { label: "visitas", value: growth.totals.visits || 0 },
                    { label: "checkouts", value: growth.totals.checkoutCreated || 0 },
                    { label: "premium", value: growth.totals.premiumActivations || 0 }
                ])
            };
        } else {
            modules.analytics = {
                moduleKey: "analytics",
                label: getModuleLabels().analytics,
                status: planned ? "planned" : (app.healthStatus || "warning"),
                summary: planned
                    ? "Slot preparado para metricas, funil e saude operacional deste app."
                    : "Conector pronto para receber metricas e saude operacional dedicadas.",
                metrics: formatModuleMetrics([
                    { label: "health", value: app.healthStatus || "sem check" },
                    { label: "categoria", value: app.category || "-" }
                ])
            };
        }
    }

    if (enabledModules.includes("improvements")) {
        const openItems = workItems.filter((item) => !["done", "completed", "archived"].includes(String(item.status || "").toLowerCase()));
        modules.improvements = {
            moduleKey: "improvements",
            label: getModuleLabels().improvements,
            status: getStatusFromCount(openItems.length, planned),
            summary: openItems.length
                ? `${openItems.length} melhoria(s) ou iniciativa(s) abertas para este app.`
                : (planned ? "Modulo preparado para backlog de melhorias." : "Nenhuma melhoria aberta neste momento."),
            metrics: formatModuleMetrics([
                { label: "abertas", value: openItems.length },
                { label: "total", value: workItems.length }
            ])
        };
    }

    if (enabledModules.includes("promotions_internal")) {
        const activePromotions = promotions.filter((item) => String(item.status || "") === "active");
        modules.promotions_internal = {
            moduleKey: "promotions_internal",
            label: getModuleLabels().promotions_internal,
            status: promotions.length ? "healthy" : (planned ? "planned" : "warning"),
            summary: promotions.length
                ? `${promotions.length} campanha(s) internas registradas para este app.`
                : (planned ? "Slot preparado para paywalls, ofertas e experimentos internos." : "Sem promocoes internas registradas ainda."),
            metrics: formatModuleMetrics([
                { label: "ativas", value: activePromotions.length },
                { label: "total", value: promotions.length }
            ])
        };
    }

    if (enabledModules.includes("promotions_external")) {
        const spendTotal = sumBy(spends, "amount");
        modules.promotions_external = {
            moduleKey: "promotions_external",
            label: getModuleLabels().promotions_external,
            status: spends.length ? "healthy" : (planned ? "planned" : "warning"),
            summary: spends.length
                ? "Canal preparado para campanhas externas, criativos e acompanhamento de midia."
                : (planned ? "Slot preparado para campanhas externas e automacoes futuras." : "Sem gastos externos registrados ainda."),
            metrics: formatModuleMetrics([
                { label: "registros", value: spends.length },
                { label: "gasto", value: `R$ ${Number(spendTotal || 0).toFixed(2)}` }
            ])
        };
    }

    if (enabledModules.includes("finance")) {
        const revenueSnapshots = sumBy(financeSnapshots, "revenue_amount");
        const expenseSnapshots = sumBy(financeSnapshots, "expense_amount");
        const routedSpend = app.appKey === "rota_nota" ? Number(context.routedSpend || 0) : 0;
        const totalExpenses = expenseSnapshots + routedSpend;
        modules.finance = {
            moduleKey: "finance",
            label: getModuleLabels().finance,
            status: financeSnapshots.length || routedSpend ? "healthy" : (planned ? "planned" : "warning"),
            summary: financeSnapshots.length
                ? "Receitas e gastos deste app ja podem ser acompanhados separadamente no ecossistema."
                : (planned ? "Modulo preparado para snapshots de receita e gasto por app." : "Sem snapshots financeiros consolidados ainda."),
            metrics: formatModuleMetrics([
                { label: "receita", value: `R$ ${Number(revenueSnapshots || 0).toFixed(2)}` },
                { label: "gasto", value: `R$ ${Number(totalExpenses || 0).toFixed(2)}` },
                { label: "snapshots", value: financeSnapshots.length }
            ])
        };
    }

    if (enabledModules.includes("bugs")) {
        const openBugs = bugReports.filter((item) => !["resolved", "closed", "archived"].includes(String(item.status || "").toLowerCase()));
        const criticalBugs = openBugs.filter((item) => ["critical", "high"].includes(String(item.severity || "").toLowerCase()));
        modules.bugs = {
            moduleKey: "bugs",
            label: getModuleLabels().bugs,
            status: criticalBugs.length ? "failed" : getStatusFromCount(openBugs.length, planned),
            summary: openBugs.length
                ? `${openBugs.length} bug(s) em triagem ou correção para este app.`
                : (planned ? "Modulo preparado para recebimento e triagem de bugs." : "Nenhum bug aberto neste momento."),
            metrics: formatModuleMetrics([
                { label: "abertos", value: openBugs.length },
                { label: "criticos", value: criticalBugs.length }
            ])
        };
    }

    return modules;
}

async function getAppsWorkspace() {
    const [managedApps, growthOverview, promotionsResult, spendsResult, workItemsResult, bugReportsResult, financeSnapshotsResult] = await Promise.all([
        getManagedApps({ ensureFresh: true }),
        getGrowthOverview(),
        listRows(PROMOTION_CAMPAIGNS_TABLE, { order: "updated_at.desc", limit: 200 }),
        listRows(SPEND_TABLE, { order: "updated_at.desc", limit: 200 }),
        listRows(APP_WORK_ITEMS_TABLE, { order: "updated_at.desc", limit: 200 }),
        listRows(APP_BUG_REPORTS_TABLE, { order: "updated_at.desc", limit: 200 }),
        listRows(APP_FINANCE_SNAPSHOTS_TABLE, { order: "updated_at.desc", limit: 200 })
    ]);

    const promotions = safeArray(promotionsResult.data);
    const spends = safeArray(spendsResult.data);
    const workItems = safeArray(workItemsResult.data);
    const bugReports = safeArray(bugReportsResult.data);
    const financeSnapshots = safeArray(financeSnapshotsResult.data);

    const items = managedApps.items.map((app) => {
        const appPromotions = promotions.filter((item) => {
            const owner = getPromotionOwner(item);
            return owner
                ? owner === app.appKey
                : app.appKey === "rota_nota";
        });

        const appSpends = spends.filter((item) => {
            const owner = getSpendOwner(item);
            return owner
                ? owner === app.appKey
                : app.appKey === "rota_nota";
        });

        const appWorkItems = workItems.filter((item) => String(item.app_key || "") === app.appKey);
        const appBugReports = bugReports.filter((item) => String(item.app_key || "") === app.appKey);
        const appFinanceSnapshots = financeSnapshots.filter((item) => String(item.app_key || "") === app.appKey);
        const moduleSummary = buildAppModuleSummary(app, {
            growthOverview,
            promotions: appPromotions,
            spends: appSpends,
            workItems: appWorkItems,
            bugReports: appBugReports,
            financeSnapshots: appFinanceSnapshots,
            routedSpend: sumBy(appSpends, "amount")
        });

        return {
            ...app,
            moduleSummary,
            highlights: {
                openWorkItems: appWorkItems.filter((item) => !["done", "completed", "archived"].includes(String(item.status || "").toLowerCase())).length,
                openBugs: appBugReports.filter((item) => !["resolved", "closed", "archived"].includes(String(item.status || "").toLowerCase())).length,
                financeSnapshots: appFinanceSnapshots.length
            }
        };
    });

    return {
        ok: true,
        items
    };
}

async function savePrimaryOpsState(partial) {
    const current = await getPrimaryOpsState();
    const next = normalizePrimaryState({
        ...current,
        ...partial,
        lanes: {
            ...(current.lanes || {}),
            ...((partial && partial.lanes) || {})
        },
        thresholds: {
            ...(current.thresholds || {}),
            ...((partial && partial.thresholds) || {})
        },
        copilot: {
            ...(current.copilot || {}),
            ...((partial && partial.copilot) || {})
        }
    });

    await setStateValue("primary", next);
    return next;
}

function normalizeGrowthEvent(input = {}) {
    return {
        customer_id: sanitizeCustomerId(input.customerId || input.customer_id || ""),
        event_type: String(input.eventType || input.event_type || "").trim(),
        material_hash: String(input.materialHash || input.material_hash || "").trim(),
        channel: String(input.channel || "internal_site").trim() || "internal_site",
        utm_source: String(input.utmSource || input.utm_source || "").trim(),
        utm_medium: String(input.utmMedium || input.utm_medium || "").trim(),
        utm_campaign: String(input.utmCampaign || input.utm_campaign || "").trim(),
        utm_content: String(input.utmContent || input.utm_content || "").trim(),
        referrer: String(input.referrer || "").trim(),
        landing_path: String(input.landingPath || input.landing_path || "").trim(),
        metadata: input.metadata && typeof input.metadata === "object"
            ? input.metadata
            : {}
    };
}

async function recordOpsAlert(input = {}) {
    const payload = {
        event_type: String(input.eventType || input.event_type || "ops_event"),
        severity: String(input.severity || "info"),
        provider: String(input.provider || ""),
        message: String(input.message || ""),
        payload: input.payload && typeof input.payload === "object"
            ? input.payload
            : {}
    };

    const response = await insertRow(ALERTS_TABLE, payload);

    if (response.ok) {
        await savePrimaryOpsState({
            lastAlertAt: new Date().toISOString()
        });
    }

    return response;
}

async function listOpsAlerts(limit = 50) {
    const response = await listRows(ALERTS_TABLE, {
        filters: [
            {
                column: "resolved_at",
                value: "is.null"
            }
        ],
        order: "created_at.desc",
        limit
    });

    return {
        ok: true,
        configured: isSupabaseConfigured(),
        items: safeArray(response.data)
    };
}

async function getPaymentsStatus() {
    const [checkoutSessions, entitlements] = await Promise.all([
        listRows("premium_checkout_sessions", {
            order: "updated_at.desc",
            limit: 20
        }),
        listRows("premium_entitlements", {
            order: "updated_at.desc",
            limit: 20
        })
    ]);

    const checkoutItems = safeArray(checkoutSessions.data);
    const entitlementItems = safeArray(entitlements.data);
    const webhookValidationActive = Boolean(getEnvValue("MERCADO_PAGO_WEBHOOK_SECRET"));

    return {
        ok: true,
        provider: "mercado_pago",
        webhookSignatureValidation: webhookValidationActive ? "active" : "not_configured",
        checkoutConfigured: Boolean(getEnvValue("MERCADO_PAGO_ACCESS_TOKEN")),
        recentPayments: checkoutItems,
        recentEntitlements: entitlementItems,
        summary: {
            recentCheckouts: checkoutItems.length,
            activeEntitlements: entitlementItems.filter((item) => String(item.status || "") === "active").length
        }
    };
}

async function getEventWindowCounts(now = getNow()) {
    const monthStart = startOfMonth(now).toISOString();
    const result = await listRows(GROWTH_TABLE, {
        filters: [
            {
                column: "created_at",
                value: encodeFilter("gte", monthStart)
            }
        ],
        order: "created_at.desc",
        limit: 5000
    });
    const events = safeArray(result.data);
    const dayStart = startOfDay(now).getTime();
    const weekStart = startOfWeek(now).getTime();

    const counts = events.reduce((acc, event) => {
        if (!isFreeUsageEvent(event.event_type)) {
            return acc;
        }

        const createdTime = new Date(event.created_at).getTime();

        acc.month += 1;

        if (createdTime >= weekStart) {
            acc.week += 1;
        }

        if (createdTime >= dayStart) {
            acc.day += 1;
        }

        return acc;
    }, { day: 0, week: 0, month: 0 });

    return counts;
}

async function maybeRaiseThresholdAlerts(counts, state) {
    const dayKey = getDayKey();

    if (counts.day >= state.thresholds.dailyHardStopThreshold && !state.lanes.freeLanePaused) {
        await savePrimaryOpsState({
            lanes: {
                ...state.lanes,
                freeLanePaused: true
            }
        });

        const alreadyRaised = await getStateValue(`alert-hard-stop-${dayKey}`, false);

        if (!alreadyRaised) {
            await recordOpsAlert({
                eventType: "free_lane_hard_stop",
                severity: "critical",
                provider: "gemini",
                message: `A free lane atingiu ${counts.day}/${state.thresholds.dailyHardStopThreshold} geracoes no dia.`,
                payload: counts
            });
            await setStateValue(`alert-hard-stop-${dayKey}`, true);
        }
        return;
    }

    if (counts.day >= state.thresholds.dailyCriticalThreshold) {
        const alreadyRaised = await getStateValue(`alert-critical-${dayKey}`, false);

        if (!alreadyRaised) {
            await recordOpsAlert({
                eventType: "free_lane_critical",
                severity: "critical",
                provider: "gemini",
                message: `A free lane entrou em estado critico com ${counts.day} geracoes hoje.`,
                payload: counts
            });
            await setStateValue(`alert-critical-${dayKey}`, true);
        }
    }

    if (counts.day >= state.thresholds.dailyWarnThreshold) {
        const alreadyRaised = await getStateValue(`alert-warning-${dayKey}`, false);

        if (!alreadyRaised) {
            await recordOpsAlert({
                eventType: "free_lane_warning",
                severity: "warning",
                provider: "gemini",
                message: `A free lane passou do aviso diario com ${counts.day} geracoes hoje.`,
                payload: counts
            });
            await setStateValue(`alert-warning-${dayKey}`, true);
        }
    }
}

async function recordGrowthEvent(input = {}) {
    const event = normalizeGrowthEvent(input);

    if (!event.event_type) {
        return {
            ok: false,
            status: "missing_event_type"
        };
    }

    const response = await insertRow(GROWTH_TABLE, event);

    if (response.ok && isFreeUsageEvent(event.event_type)) {
        const state = await getPrimaryOpsState();
        const counts = await getEventWindowCounts();
        await maybeRaiseThresholdAlerts(counts, state);
    }

    return response;
}

function buildChannelKey(item = {}) {
    const source = item.utm_source || item.channel || "direct";
    const campaign = item.utm_campaign || item.campaign || "(sem campanha)";
    return `${source}__${campaign}`;
}

function buildChannelRowSeed(item = {}) {
    return {
        key: buildChannelKey(item),
        source: item.utm_source || item.channel || "direct",
        campaign: item.utm_campaign || item.campaign || "(sem campanha)",
        channel: item.channel || "internal_site",
        visits: 0,
        uploads: 0,
        uploadsBlocked: 0,
        trialStarts: 0,
        bundles: 0,
        paywalls: 0,
        checkoutClicks: 0,
        checkoutCreated: 0,
        premiumActivations: 0,
        resumes: 0,
        spend: 0,
        currency: "BRL"
    };
}

function bucketGrowthEvent(row, event) {
    const bucket = EVENT_BUCKETS[event.event_type];

    if (!bucket) {
        return row;
    }

    row[bucket] = (row[bucket] || 0) + 1;
    return row;
}

async function getGrowthOverview() {
    const monthStart = startOfMonth().toISOString();
    const [eventsResult, spendResult] = await Promise.all([
        listRows(GROWTH_TABLE, {
            filters: [
                {
                    column: "created_at",
                    value: encodeFilter("gte", monthStart)
                }
            ],
            order: "created_at.desc",
            limit: 5000
        }),
        listRows(SPEND_TABLE, {
            order: "period_start.desc",
            limit: 500
        })
    ]);

    const channelMap = new Map();
    const events = safeArray(eventsResult.data);
    const spends = safeArray(spendResult.data);

    events.forEach((event) => {
        const key = buildChannelKey(event);
        const row = channelMap.get(key) || buildChannelRowSeed(event);
        channelMap.set(key, bucketGrowthEvent(row, event));
    });

    spends.forEach((spend) => {
        const key = buildChannelKey(spend);
        const row = channelMap.get(key) || buildChannelRowSeed({
            channel: spend.channel,
            utm_source: spend.channel,
            utm_campaign: spend.campaign
        });
        row.spend += Number(spend.amount || 0);
        row.currency = spend.currency || row.currency;
        row.externalPlatform = spend.external_platform || "";
        channelMap.set(key, row);
    });

    const channels = [...channelMap.values()]
        .map((row) => ({
            ...row,
            costPerPremium: row.premiumActivations > 0
                ? Number((row.spend / row.premiumActivations).toFixed(2))
                : null,
            checkoutRate: row.visits > 0
                ? Number(((row.checkoutCreated / row.visits) * 100).toFixed(1))
                : null,
            premiumRate: row.visits > 0
                ? Number(((row.premiumActivations / row.visits) * 100).toFixed(1))
                : null
        }))
        .sort((left, right) =>
            (right.premiumActivations - left.premiumActivations) ||
            (right.bundles - left.bundles) ||
            (right.visits - left.visits)
        );

    const totals = channels.reduce((acc, row) => {
        acc.visits += row.visits;
        acc.uploads += row.uploads;
        acc.bundles += row.bundles;
        acc.paywalls += row.paywalls;
        acc.checkoutCreated += row.checkoutCreated;
        acc.premiumActivations += row.premiumActivations;
        acc.spend += row.spend;
        return acc;
    }, {
        visits: 0,
        uploads: 0,
        bundles: 0,
        paywalls: 0,
        checkoutCreated: 0,
        premiumActivations: 0,
        spend: 0
    });

    return {
        ok: true,
        configured: isSupabaseConfigured(),
        totals,
        channels,
        recentEvents: events.slice(0, 25),
        recentSpend: spends.slice(0, 25)
    };
}

async function getOverview() {
    const state = await getPrimaryOpsState();
    const [counts, alertsResult, paymentsResult, entitlementsResult, promotionsResult, growthOverview, managedApps, paymentsStatus, reviewRuns, changeRequests] = await Promise.all([
        getEventWindowCounts(),
        listRows(ALERTS_TABLE, { order: "created_at.desc", limit: 12 }),
        listRows("premium_checkout_sessions", { order: "created_at.desc", limit: 12 }),
        listRows("premium_entitlements", { order: "updated_at.desc", limit: 200 }),
        listRows(PROMOTION_CAMPAIGNS_TABLE, { order: "created_at.desc", limit: 12 }),
        getGrowthOverview(),
        getManagedApps({ ensureFresh: true }),
        getPaymentsStatus(),
        listReviewRuns(5),
        listChangeRequests({ limit: 12 })
    ]);

    return {
        ok: true,
        configured: {
            supabase: isSupabaseConfigured(),
            gemini: isGeminiConfigured()
        },
        state,
        thresholds: state.thresholds,
        counters: {
            freeLaneDaily: counts.day,
            freeLaneWeekly: counts.week,
            freeLaneMonthly: counts.month,
            premiumActive: safeArray(entitlementsResult.data)
                .filter((item) => item.status === "active")
                .length,
            checkoutSessions: safeArray(paymentsResult.data).length,
            activeAlerts: safeArray(alertsResult.data)
                .filter((item) => !item.resolved_at)
                .length,
            connectedApps: managedApps.summary.connected
        },
        freeLaneStatus: state.lanes.freeLanePaused
            ? "paused"
            : counts.day >= state.thresholds.dailyCriticalThreshold
                ? "critical"
                : counts.day >= state.thresholds.dailyWarnThreshold
                    ? "warning"
                    : "healthy",
        recentAlerts: safeArray(alertsResult.data),
        recentPayments: safeArray(paymentsResult.data),
        recentPromotions: safeArray(promotionsResult.data),
        recentEntitlements: safeArray(entitlementsResult.data).slice(0, 12),
        growth: growthOverview,
        managedApps,
        paymentsStatus,
        latestReviewRun: reviewRuns.items[0] || null,
        changeRequestsSummary: changeRequests.summary || {
            total: 0,
            pending: 0,
            approved: 0,
            executed: 0
        }
    };
}

async function getWeeklyReport() {
    const overview = await getOverview();
    const growth = await getGrowthOverview();
    const topChannel = growth.channels[0] || null;
    const weakChannel = [...growth.channels]
        .filter((item) => item.visits > 0)
        .sort((left, right) => (left.premiumRate || 0) - (right.premiumRate || 0))[0] || null;

    const highlights = [];

    if (topChannel) {
        highlights.push(`Melhor sinal atual: ${topChannel.source} / ${topChannel.campaign} com ${topChannel.premiumActivations} premium(s).`);
    }

    if (weakChannel) {
        highlights.push(`Canal mais fraco no momento: ${weakChannel.source} / ${weakChannel.campaign} com taxa premium de ${weakChannel.premiumRate || 0}%.`);
    }

    if (!highlights.length) {
        highlights.push("Ainda nao ha volume suficiente para comparacao confiavel de canais.");
    }

    return {
        ok: true,
        generatedAt: new Date().toISOString(),
        weekKey: getWeekKey(),
        overview,
        growth,
        highlights,
        textReport: [
            `Resumo semanal ${getWeekKey()}`,
            `Free lane hoje: ${overview.counters.freeLaneDaily}/${overview.thresholds.dailyHardStopThreshold}.`,
            `Premium ativos: ${overview.counters.premiumActive}.`,
            `Spend registrado no periodo: R$ ${Number(growth.totals.spend || 0).toFixed(2)}.`,
            ...highlights
        ].join("\n")
    };
}

function buildFallbackCopilot(dataset = {}) {
    const growth = dataset.growth || {};
    const overview = dataset.overview || {};
    const channels = safeArray(growth.channels);
    const best = channels[0] || null;
    const worst = [...channels]
        .filter((item) => item.visits > 0)
        .sort((left, right) => (left.premiumRate || 0) - (right.premiumRate || 0))[0] || null;

    const insufficientData = [];

    if (!channels.length) {
        insufficientData.push("Ainda nao ha canais suficientes registrados.");
    }

    if (!Number(growth.totals && growth.totals.spend)) {
        insufficientData.push("Ainda nao ha gasto manual suficiente para concluir ROI.");
    }

    return {
        summary: best
            ? `O melhor canal atual e ${best.source}/${best.campaign}.`
            : "Ainda nao ha dados suficientes para um veredito forte.",
        opsFindings: [
            `Free lane hoje: ${overview.counters ? overview.counters.freeLaneDaily : 0}/${overview.thresholds ? overview.thresholds.dailyHardStopThreshold : 650}.`,
            `Status da free lane: ${overview.freeLaneStatus || "unknown"}.`
        ],
        growthFindings: [
            best
                ? `${best.source}/${best.campaign} lidera em premium com ${best.premiumActivations} conversoes.`
                : "Sem canal dominante no momento.",
            worst
                ? `${worst.source}/${worst.campaign} exige revisao por baixa taxa premium (${worst.premiumRate || 0}%).`
                : "Sem canal fraco claramente detectado."
        ],
        investmentRecommendations: best
            ? [
                {
                    channel: `${best.source}/${best.campaign}`,
                    reason: "melhor sinal de premium no periodo",
                    confidence: best.premiumActivations >= 2 ? "medium" : "low"
                }
            ]
            : [],
        promotionRecommendations: best
            ? [
                {
                    channel: `${best.source}/${best.campaign}`,
                    angle: "reforcar continuidade, historico e treinos extras",
                    reason: "esse canal ja mostrou melhor sinal de conversao"
                }
            ]
            : [],
        weeklyPlan: [
            "Revisar alertas e lane states no inicio da semana.",
            "Comparar os dois canais com melhor premium rate.",
            "Gerar ao menos uma nova oferta interna para o paywall premium."
        ],
        confidence: insufficientData.length ? "low" : "medium",
        insufficientData
    };
}

function buildCopilotPrompt(scope, dataset) {
    return [
        "Voce e o copiloto operacional e de growth do Papiro.",
        `Escopo atual: ${scope}.`,
        "Analise apenas os dados fornecidos.",
        "Responda em JSON com as chaves: summary, opsFindings, growthFindings, investmentRecommendations, promotionRecommendations, weeklyPlan, confidence, insufficientData.",
        "Se faltarem dados, diga explicitamente em insufficientData e evite inventar ROI.",
        `Dados:\n${JSON.stringify(dataset)}`
    ].join("\n\n");
}

async function incrementCopilotUsageCounters(scope) {
    const now = getNow();
    const monthKey = `copilot-usage-${getMonthKey(now)}`;
    const currentMonth = await getStateValue(monthKey, { count: 0 });
    await setStateValue(monthKey, {
        count: Number(currentMonth.count || 0) + 1
    });

    if (scope === "manual") {
        const dayKey = `copilot-manual-${getDayKey(now)}`;
        const currentDay = await getStateValue(dayKey, { count: 0 });
        await setStateValue(dayKey, {
            count: Number(currentDay.count || 0) + 1
        });
    }
}

async function getCopilotUsageStatus(scope) {
    const now = getNow();
    const state = await getPrimaryOpsState();
    const monthly = await getStateValue(`copilot-usage-${getMonthKey(now)}`, { count: 0 });
    const dailyManual = await getStateValue(`copilot-manual-${getDayKey(now)}`, { count: 0 });

    if (Number(monthly.count || 0) >= Number(state.copilot.monthlyHardCap || 300)) {
        return {
            ok: false,
            status: "monthly_cap_reached"
        };
    }

    if (scope === "manual" && Number(dailyManual.count || 0) >= Number(state.copilot.dailyManualCap || 3)) {
        return {
            ok: false,
            status: "daily_manual_cap_reached"
        };
    }

    return {
        ok: true,
        state
    };
}

async function resolveCopilotDataset(scope, payload = {}) {
    const memory = await getOpsAiMemory();

    if (scope === "weekly_strategy") {
        const weekly = await getWeeklyReport();
        return {
            ...weekly,
            memory,
            query: payload.query || ""
        };
    }

    const overview = await getOverview();
    return {
        ok: true,
        generatedAt: new Date().toISOString(),
        memory,
        overview,
        growth: overview.growth,
        query: payload.query || ""
    };
}

async function analyzeWithCopilot(scope = "manual", payload = {}) {
    const state = await getPrimaryOpsState();
    const cacheKey = scope === "daily_digest"
        ? `copilot-cache-daily-${getDayKey()}`
        : scope === "weekly_strategy"
            ? `copilot-cache-weekly-${getWeekKey()}`
            : "";

    if (cacheKey) {
        const cached = await getStateValue(cacheKey, null);
        if (cached) {
            return {
                ok: true,
                cached: true,
                scope,
                analysis: cached
            };
        }
    }

    const usageStatus = await getCopilotUsageStatus(scope);

    if (!usageStatus.ok) {
        return {
            ok: false,
            status: usageStatus.status,
            message: "O copiloto atingiu o limite operacional configurado."
        };
    }

    const dataset = await resolveCopilotDataset(scope, payload);
    const fallback = buildFallbackCopilot(dataset);

    if (!state.copilot.enabled || !isGeminiConfigured()) {
        if (cacheKey) {
            await setStateValue(cacheKey, fallback);
        }

        return {
            ok: true,
            cached: false,
            provider: "fallback",
            analysis: fallback
        };
    }

    const model = scope === "weekly_strategy"
        ? state.copilot.strategyModel
        : state.copilot.defaultModel;

    const aiResponse = await callGeminiJson({
        model,
        prompt: buildCopilotPrompt(scope, dataset),
        schemaInstruction: "As listas devem ser arrays simples de strings ou objetos curtos."
    });

    if (!aiResponse.ok || !aiResponse.data) {
        await insertAuditLog({
            eventType: "copilot_fallback_used",
            actor: "gemini",
            targetSystem: "papiro_ops",
            entityType: "copilot",
            status: "fallback",
            metadata: {
                scope,
                status: aiResponse.status
            }
        });

        if (cacheKey) {
            await setStateValue(cacheKey, fallback);
        }

        return {
            ok: true,
            cached: false,
            provider: "fallback",
            analysis: fallback
        };
    }

    await incrementCopilotUsageCounters(scope);

    const analysis = {
        ...fallback,
        ...aiResponse.data,
        provider: "gemini",
        model
    };

    if (cacheKey) {
        await setStateValue(cacheKey, analysis);
    }

    return {
        ok: true,
        cached: false,
        provider: "gemini",
        analysis
    };
}

function buildHealthCheckIssues(dataset = {}) {
    const overview = dataset.overview || {};
    const paymentsStatus = dataset.paymentsStatus || {};
    const counters = overview.counters || {};
    const configured = overview.configured || {};
    const issues = [];

    if (paymentsStatus.webhookSignatureValidation !== "active") {
        issues.push({
            severity: "critical",
            targetSystem: "mercado_pago",
            actionType: "investigate_webhook_signature",
            title: "Conferir aviso de pagamento do Mercado Pago",
            summary: "O Mercado Pago ainda nao confirmou que os avisos de pagamento estao chegando corretamente. Conferir os detalhes tecnicos se isso aparecer de novo.",
            payload: {
                webhookSignatureValidation: paymentsStatus.webhookSignatureValidation || "unknown",
                checkoutConfigured: paymentsStatus.checkoutConfigured
            }
        });
    }

    if (!paymentsStatus.checkoutConfigured) {
        issues.push({
            severity: "critical",
            targetSystem: "mercado_pago",
            actionType: "configure_checkout_provider",
            title: "Configurar venda pelo Mercado Pago",
            summary: "MERCADO_PAGO_ACCESS_TOKEN nao aparece como configurado para a retaguarda.",
            payload: paymentsStatus
        });
    }

    if (Number(counters.activeAlerts || 0) > 0) {
        issues.push({
            severity: "warning",
            targetSystem: "papiro_ops",
            actionType: "triage_active_alerts",
            title: "Triar alertas ativos",
            summary: `A retaguarda reporta ${Number(counters.activeAlerts || 0)} alerta(s) ativo(s).`,
            payload: {
                activeAlerts: counters.activeAlerts,
                recentAlerts: dataset.alerts
            }
        });
    }

    if (overview.freeLaneStatus && overview.freeLaneStatus !== "healthy") {
        issues.push({
            severity: overview.freeLaneStatus === "critical" ? "critical" : "warning",
            targetSystem: "papiro_ops",
            actionType: "review_free_lane",
            title: "Revisar uso gratuito",
            summary: `O uso gratuito esta em estado ${overview.freeLaneStatus}.`,
            payload: {
                freeLaneStatus: overview.freeLaneStatus,
                counters
            }
        });
    }

    if (!configured.supabase) {
        issues.push({
            severity: "critical",
            targetSystem: "supabase",
            actionType: "configure_supabase",
            title: "Configurar Supabase",
            summary: "Supabase nao aparece como configurado.",
            payload: configured
        });
    }

    if (!configured.gemini) {
        issues.push({
            severity: "warning",
            targetSystem: "gemini",
            actionType: "configure_gemini",
            title: "Configurar Gemini",
            summary: "Gemini nao aparece como configurado; a IA usa o plano reserva.",
            payload: configured
        });
    }

    return issues;
}

function addDaysIso(date, offset) {
    const next = new Date(date);
    next.setDate(next.getDate() + offset);
    return next.toISOString().slice(0, 10);
}

function slugifyContentId(value = "") {
    return String(value || "")
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "")
        .slice(0, 80) || crypto.randomBytes(4).toString("hex");
}

function getDefaultMarketingContentState() {
    return {
        version: 1,
        strategy: {
            goal: "Crescer divulgacao organica do Papiro sem gasto pago.",
            cadence: "1 post curto por dia, 3 carrosseis por semana, 2 roteiros de Reels por semana e stories leves em dias uteis.",
            approvalMode: "human_review",
            primaryChannels: ["instagram", "facebook", "whatsapp_status"],
            freeTools: ["Meta Business Suite", "Instagram scheduler nativo", "Buffer Free", "Publer Free", "Canva Free"]
        },
        items: [],
        lastGeneratedAt: null,
        updatedAt: new Date().toISOString()
    };
}

function getContentTopicSeeds() {
    return [
        {
            subject: "Filosofia",
            grade: "3 serie",
            topic: "Etica",
            hook: "Voce sabe diferenciar etica de moral em uma questao?",
            quiz: "Etica investiga criterios de acao justa; moral e o conjunto de costumes e normas de um grupo.",
            cta: "Treine mais questoes de filosofia no Papiro."
        },
        {
            subject: "Redacao",
            grade: "3 serie",
            topic: "Repertorio",
            hook: "Um repertorio bom nao precisa ser dificil, precisa funcionar no argumento.",
            quiz: "Antes de decorar citacoes, ligue o repertorio ao problema, causa, consequencia e proposta.",
            cta: "Use o Papiro para organizar seu treino de redacao."
        },
        {
            subject: "Matematica",
            grade: "3 serie",
            topic: "Probabilidade",
            hook: "A questao parece de sorte, mas costuma ser organizacao de casos.",
            quiz: "Em probabilidade, escreva primeiro o espaco amostral e depois conte os casos favoraveis.",
            cta: "Abra o Papiro e resolva uma bateria curta hoje."
        },
        {
            subject: "Biologia",
            grade: "3 serie",
            topic: "Ecologia",
            hook: "Cadeia alimentar cai muito porque mistura conceito simples com leitura atenta.",
            quiz: "Produtores transformam energia luminosa em materia organica; consumidores dependem dessa base.",
            cta: "Treine ecologia no Papiro em poucos minutos."
        },
        {
            subject: "Historia",
            grade: "3 serie",
            topic: "Brasil republicano",
            hook: "Historia fica mais facil quando voce pergunta: quem ganhou poder com isso?",
            quiz: "Em questoes historicas, localize periodo, grupo social e interesse politico antes da alternativa.",
            cta: "Use o Papiro para revisar por tema."
        },
        {
            subject: "Portugues",
            grade: "3 serie",
            topic: "Interpretacao",
            hook: "A resposta geralmente esta no texto, mas escondida por sinonimo.",
            quiz: "Antes de marcar, volte ao trecho e troque a alternativa por uma frase equivalente.",
            cta: "Pratique interpretacao no Papiro."
        },
        {
            subject: "Quimica",
            grade: "3 serie",
            topic: "Organica",
            hook: "Funcao organica nao e decoreba pura: procure o grupo funcional.",
            quiz: "Hidroxila ligada a carbono saturado indica alcool; carbonila muda completamente a leitura.",
            cta: "Treine reconhecimento de funcoes no Papiro."
        }
    ];
}

function buildDeterministicMarketingItems({ days = 14, startDate = new Date() } = {}) {
    const seeds = getContentTopicSeeds();
    const formats = ["quiz_post", "carousel", "reel_script", "story_quiz"];
    const channelsByFormat = {
        quiz_post: ["instagram", "facebook", "whatsapp_status"],
        carousel: ["instagram", "facebook"],
        reel_script: ["instagram_reels", "youtube_shorts", "tiktok"],
        story_quiz: ["instagram_stories", "whatsapp_status"]
    };

    return Array.from({ length: Math.max(1, Number(days) || 14) }).map((_, index) => {
        const seed = seeds[index % seeds.length];
        const format = formats[index % formats.length];
        const publishDate = addDaysIso(startDate, index);
        const id = `${publishDate}-${slugifyContentId(`${format}-${seed.subject}-${seed.topic}`)}`;
        const title = format === "carousel"
            ? `Carrossel: ${seed.topic} sem enrolacao`
            : format === "reel_script"
                ? `Reel: ${seed.hook}`
                : format === "story_quiz"
                    ? `Story quiz: ${seed.subject}`
                    : `Post quiz: ${seed.topic}`;
        const caption = [
            seed.hook,
            "",
            seed.quiz,
            "",
            seed.cta,
            "",
            "#Papiro #Estudos #ENEM #EnsinoMedio"
        ].join("\n");

        return {
            id,
            status: "draft",
            priority: index < 7 ? "high" : "normal",
            publishDate,
            format,
            title,
            subject: seed.subject,
            grade: seed.grade,
            topic: seed.topic,
            hook: seed.hook,
            caption,
            visualBrief: format === "carousel"
                ? `Carrossel de 5 slides: gancho, conceito, exemplo, erro comum e CTA para ${seed.subject}.`
                : format === "reel_script"
                    ? `Video vertical simples com texto na tela, professor/narracao curta e fechamento com CTA.`
                    : `Arte limpa com pergunta curta, alternativa mental e CTA discreto.`,
            script: format === "reel_script"
                ? [
                    `Abertura: ${seed.hook}`,
                    `Corpo: ${seed.quiz}`,
                    `Fechamento: ${seed.cta}`
                ]
                : [],
            channels: channelsByFormat[format] || ["instagram"],
            source: "papiro_ops_ai",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
    });
}

function normalizeMarketingContentState(value = {}) {
    const base = getDefaultMarketingContentState();
    const input = value && typeof value === "object" ? value : {};
    return {
        ...base,
        ...input,
        strategy: {
            ...base.strategy,
            ...(input.strategy || {})
        },
        items: safeArray(input.items).map((item) => ({
            ...item,
            id: String(item.id || crypto.randomBytes(6).toString("hex")),
            status: String(item.status || "draft")
        })),
        updatedAt: input.updatedAt || base.updatedAt
    };
}

async function getMarketingContentQueue() {
    const stored = await getStateValue(MARKETING_CONTENT_STATE_KEY, null);
    return {
        ok: true,
        configured: isSupabaseConfigured(),
        ...normalizeMarketingContentState(stored || {})
    };
}

function mergeMarketingItems(existing = [], incoming = []) {
    const map = new Map();
    safeArray(existing).forEach((item) => {
        map.set(String(item.id), item);
    });
    safeArray(incoming).forEach((item) => {
        const previous = map.get(String(item.id));
        map.set(String(item.id), {
            ...(previous || {}),
            ...item,
            status: previous && previous.status && previous.status !== "draft"
                ? previous.status
                : (item.status || "draft"),
            updatedAt: new Date().toISOString()
        });
    });
    return [...map.values()]
        .sort((left, right) => String(left.publishDate || "").localeCompare(String(right.publishDate || "")))
        .slice(0, 80);
}

function buildMarketingPrompt(dataset = {}) {
    return [
        "Voce e editor de crescimento organico do Papiro.",
        "Crie conteudo util, especifico e pronto para revisao humana. Nao prometa resultado garantido.",
        "Responda JSON com a chave items. Cada item deve ter: format, title, hook, caption, visualBrief, script, channels, subject, topic.",
        "Formatos permitidos: quiz_post, carousel, reel_script, story_quiz.",
        `Dados:\n${JSON.stringify(dataset)}`
    ].join("\n\n");
}

function normalizeAiMarketingItems(items = [], fallback = []) {
    const today = new Date();
    return safeArray(items).slice(0, 14).map((item, index) => {
        const base = fallback[index] || buildDeterministicMarketingItems({ days: 1, startDate: today })[0];
        const publishDate = item.publishDate || base.publishDate || addDaysIso(today, index);
        const format = String(item.format || base.format || "quiz_post");
        const title = String(item.title || base.title || "Conteudo Papiro").trim();
        return {
            ...base,
            id: `${publishDate}-${slugifyContentId(`${format}-${title}`)}`,
            status: "draft",
            publishDate,
            format,
            title,
            hook: String(item.hook || base.hook || "").trim(),
            caption: String(item.caption || base.caption || "").trim(),
            visualBrief: String(item.visualBrief || item.visual_brief || base.visualBrief || "").trim(),
            script: safeArray(item.script).length ? safeArray(item.script) : safeArray(base.script),
            channels: safeArray(item.channels).length ? safeArray(item.channels) : safeArray(base.channels),
            subject: String(item.subject || base.subject || "").trim(),
            topic: String(item.topic || base.topic || "").trim(),
            updatedAt: new Date().toISOString()
        };
    }).filter((item) => item.title && item.caption);
}

async function generateMarketingContentQueue(input = {}) {
    const current = await getMarketingContentQueue();
    const memory = await getOpsAiMemory();
    const days = Math.min(Math.max(Number(input.days || 14), 3), 30);
    const fallbackItems = buildDeterministicMarketingItems({ days });
    let provider = "fallback";
    let generatedItems = fallbackItems;

    if (isGeminiConfigured() && input.provider !== "fallback") {
        const state = await getPrimaryOpsState();
        const response = await callGeminiJson({
            model: state.copilot.strategyModel || state.copilot.defaultModel,
            prompt: buildMarketingPrompt({
                days,
                memory: {
                    productName: memory.productName,
                    mission: memory.mission,
                    brandVoice: memory.brandVoice,
                    freeGrowthStack: memory.freeGrowthStack
                },
                existingQueue: safeArray(current.items).slice(0, 10)
            }),
            schemaInstruction: "Retorne apenas JSON valido com items como array."
        });

        if (response.ok && response.data && Array.isArray(response.data.items)) {
            const normalized = normalizeAiMarketingItems(response.data.items, fallbackItems);
            if (normalized.length) {
                provider = "gemini";
                generatedItems = normalized;
            }
        }
    }

    const next = normalizeMarketingContentState({
        ...current,
        items: mergeMarketingItems(input.replace ? [] : current.items, generatedItems),
        lastGeneratedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    });

    await setStateValue(MARKETING_CONTENT_STATE_KEY, next);
    await saveOpsAiMemory({
        lastOrganicMarketingRun: {
            generatedAt: next.lastGeneratedAt,
            provider,
            itemsGenerated: generatedItems.length,
            totalQueue: next.items.length
        }
    });
    await insertAuditLog({
        eventType: "organic_marketing_queue_generated",
        actor: provider,
        targetSystem: "papiro_marketing",
        entityType: "content_queue",
        status: "completed",
        metadata: {
            itemsGenerated: generatedItems.length,
            totalQueue: next.items.length,
            source: input.source || "ops_console"
        }
    });

    return {
        ok: true,
        provider,
        ...next,
        generatedItems
    };
}

async function ensureMarketingContentQueue(input = {}) {
    const current = await getMarketingContentQueue();
    const openItems = safeArray(current.items).filter((item) => !["published", "rejected"].includes(String(item.status || "")));
    if (!input.force && openItems.length >= Number(input.minimumOpenItems || 7)) {
        return {
            ok: true,
            provider: "existing_queue",
            ...current
        };
    }
    return generateMarketingContentQueue({
        ...input,
        source: input.source || "daily_health_check"
    });
}

async function updateMarketingContentItem(input = {}) {
    const itemId = String(input.itemId || input.id || "").trim();
    const status = String(input.status || "").trim();
    if (!itemId || !status) {
        return {
            ok: false,
            status: "missing_item_or_status"
        };
    }

    const current = await getMarketingContentQueue();
    let updatedItem = null;
    const items = safeArray(current.items).map((item) => {
        if (String(item.id) !== itemId) {
            return item;
        }
        updatedItem = {
            ...item,
            status,
            operatorNotes: String(input.operatorNotes || input.notes || item.operatorNotes || "").trim(),
            publishedUrl: String(input.publishedUrl || item.publishedUrl || "").trim(),
            updatedAt: new Date().toISOString()
        };
        if (status === "published" && !updatedItem.publishedAt) {
            updatedItem.publishedAt = new Date().toISOString();
        }
        return updatedItem;
    });

    if (!updatedItem) {
        return {
            ok: false,
            status: "content_item_not_found"
        };
    }

    const next = normalizeMarketingContentState({
        ...current,
        items,
        updatedAt: new Date().toISOString()
    });
    await setStateValue(MARKETING_CONTENT_STATE_KEY, next);
    await insertAuditLog({
        eventType: "organic_marketing_item_updated",
        actor: "papiro_operator",
        targetSystem: "papiro_marketing",
        entityType: "content_item",
        entityId: itemId,
        status,
        metadata: {
            title: updatedItem.title,
            publishedUrl: updatedItem.publishedUrl || ""
        }
    });

    return {
        ok: true,
        item: updatedItem,
        ...next
    };
}

function buildDailyHealthPrompt(dataset = {}) {
    return [
        "Voce e o fiscal operacional diario da retaguarda Papiro.",
        "Use a memoria operacional como regra permanente.",
        "Objetivo: encontrar riscos reais, separar historico de incidente ativo e propor a menor acao segura.",
        "Responda em JSON com as chaves: summary, healthScore, risks, recommendedChangeRequests, watchlist, memoryUpdates.",
        "recommendedChangeRequests deve conter objetos curtos com targetSystem, actionType, title, summary, severity e payload.",
        "Nao invente credenciais, receita ou eventos. Se faltar dado, coloque em watchlist.",
        `Dados:\n${JSON.stringify(dataset)}`
    ].join("\n\n");
}

function normalizeHealthCheckOutput(output = {}, deterministicIssues = []) {
    const asArray = (value) => Array.isArray(value) ? value.filter(Boolean) : [];
    const aiRecommended = deterministicIssues.length
        ? asArray(output.recommendedChangeRequests)
        : [];
    const changeRequests = [
        ...deterministicIssues,
        ...aiRecommended
    ].map((item) => ({
        targetSystem: String(item.targetSystem || item.target_system || "papiro_ops").trim() || "papiro_ops",
        actionType: String(item.actionType || item.action_type || "manual_followup").trim() || "manual_followup",
        title: String(item.title || item.summary || "Pendencia operacional").trim(),
        summary: String(item.summary || item.title || "Pendencia operacional detectada pela IA.").trim(),
        severity: String(item.severity || "warning").trim() || "warning",
        payload: item.payload && typeof item.payload === "object" ? item.payload : {}
    }));

    const unique = new Map();
    changeRequests.forEach((item) => {
        const key = `${item.targetSystem}:${item.actionType}:${item.title}`;
        if (!unique.has(key)) {
            unique.set(key, item);
        }
    });

    return {
        summary: String(output.summary || (deterministicIssues.length ? "Pendencias operacionais encontradas." : "Retaguarda sem pendencias criticas no health-check.")).trim(),
        healthScore: Number.isFinite(Number(output.healthScore)) ? Number(output.healthScore) : (deterministicIssues.length ? 72 : 94),
        risks: asArray(output.risks),
        recommendedChangeRequests: [...unique.values()],
        watchlist: asArray(output.watchlist),
        memoryUpdates: output.memoryUpdates && typeof output.memoryUpdates === "object" ? output.memoryUpdates : {}
    };
}

async function createHealthCheckChangeRequests(health, runId) {
    const created = [];

    for (const item of safeArray(health.recommendedChangeRequests)) {
        const request = await createChangeRequest({
            reviewRunId: runId || null,
            targetSystem: item.targetSystem,
            actionType: item.actionType,
            preparedBy: "papiro_health_check",
            resultSummary: item.summary,
            payload: {
                title: item.title,
                summary: item.summary,
                severity: item.severity,
                ...item.payload
            }
        });

        if (request.item) {
            created.push(request.item);
        }
    }

    return created;
}

async function runDailyHealthCheck(input = {}) {
    const [memory, overview, paymentsStatus, alerts, changeRequests, contentQueue] = await Promise.all([
        getOpsAiMemory(),
        getOverview(),
        getPaymentsStatus(),
        listOpsAlerts(20),
        listChangeRequests({ status: "pending", limit: 20 }),
        ensureMarketingContentQueue({
            minimumOpenItems: 7,
            source: "daily_health_check",
            provider: input.provider || "fallback"
        })
    ]);
    const dataset = {
        generatedAt: new Date().toISOString(),
        memory,
        overview: {
            configured: overview.configured,
            counters: overview.counters,
            freeLaneStatus: overview.freeLaneStatus,
            state: overview.state,
            latestReviewRun: overview.latestReviewRun
        },
        paymentsStatus: {
            checkoutConfigured: paymentsStatus.checkoutConfigured,
            webhookSignatureValidation: paymentsStatus.webhookSignatureValidation,
            resyncAvailable: paymentsStatus.resyncAvailable,
            summary: paymentsStatus.summary
        },
        alerts: safeArray(alerts.items).map((item) => ({
            id: item.id,
            eventType: item.event_type,
            severity: item.severity,
            provider: item.provider,
            message: item.message,
            createdAt: item.created_at
        })),
        pendingChangeRequests: safeArray(changeRequests.items).map((item) => ({
            id: item.id,
            targetSystem: item.target_system,
            actionType: item.action_type,
            status: item.status,
            createdAt: item.created_at,
            summary: item.result_summary
        })),
        organicMarketing: {
            openItems: safeArray(contentQueue.items).filter((item) => !["published", "rejected"].includes(String(item.status || ""))).length,
            lastGeneratedAt: contentQueue.lastGeneratedAt,
            provider: contentQueue.provider || "existing_queue"
        }
    };
    const deterministicIssues = buildHealthCheckIssues(dataset);
    let provider = "fallback";
    let health = normalizeHealthCheckOutput({}, deterministicIssues);

    if (isGeminiConfigured() && input.provider !== "fallback") {
        const state = await getPrimaryOpsState();
        const response = await callGeminiJson({
            model: state.copilot.strategyModel || state.copilot.defaultModel,
            prompt: buildDailyHealthPrompt(dataset),
            schemaInstruction: "Use healthScore de 0 a 100. recommendedChangeRequests deve ser uma lista de objetos."
        });

        if (response.ok && response.data) {
            provider = "gemini";
            health = normalizeHealthCheckOutput(response.data, deterministicIssues);
        }
    }

    const insertResult = await insertRow(REVIEW_RUNS_TABLE, {
        run_type: String(input.runType || "daily_health_check"),
        provider,
        status: "completed",
        summary: health.summary,
        recommendations: {
            risks: health.risks,
            recommendedChangeRequests: health.recommendedChangeRequests,
            watchlist: health.watchlist
        },
        confidence: health.healthScore >= 85 ? "high" : health.healthScore >= 70 ? "medium" : "low",
        missing_data: health.watchlist,
        generated_change_requests: 0,
        started_at: dataset.generatedAt,
        completed_at: new Date().toISOString()
    });
    const run = Array.isArray(insertResult.data) ? insertResult.data[0] : null;
    const createdChangeRequests = run
        ? await createHealthCheckChangeRequests(health, run.id)
        : [];

    if (run) {
        await patchRows(REVIEW_RUNS_TABLE, [
            {
                column: "id",
                value: encodeFilter("eq", run.id)
            }
        ], {
            generated_change_requests: createdChangeRequests.length
        });
    }

    if (health.memoryUpdates && Object.keys(health.memoryUpdates).length) {
        await saveOpsAiMemory(health.memoryUpdates);
    } else {
        await saveOpsAiMemory({
            lastHealthCheck: {
                generatedAt: dataset.generatedAt,
                healthScore: health.healthScore,
                summary: health.summary,
                createdChangeRequests: createdChangeRequests.length
            },
            lastOrganicMarketingRun: {
                generatedAt: contentQueue.lastGeneratedAt || dataset.generatedAt,
                openItems: dataset.organicMarketing.openItems,
                provider: dataset.organicMarketing.provider
            }
        });
    }

    await insertAuditLog({
        eventType: "daily_health_check_completed",
        actor: provider,
        targetSystem: "papiro_ops",
        entityType: "review_run",
        entityId: run ? run.id : "",
        status: "completed",
        metadata: {
            healthScore: health.healthScore,
            createdChangeRequests: createdChangeRequests.length,
            organicMarketingOpenItems: dataset.organicMarketing.openItems
        }
    });

    return {
        ok: insertResult.ok,
        provider,
        health,
        reviewRun: run,
        createdChangeRequests,
        contentQueue: {
            provider: dataset.organicMarketing.provider,
            openItems: dataset.organicMarketing.openItems,
            lastGeneratedAt: dataset.organicMarketing.lastGeneratedAt
        }
    };
}

function getBaseOfferTemplates() {
    return {
        PREMIUM_LIBRARY: {
            headline: "Seu estudo completo fica guardado.",
            lead: "Retome outros materiais, veja seu historico e continue sem reconstruir a trilha.",
            benefits: [
                "Retomar PDFs alem do ultimo estudo",
                "Biblioteca premium por objetivo",
                "Mais continuidade sem recomecar"
            ],
            cta: "Liberar biblioteca premium",
            recommendedPlanId: "premium_annual"
        },
        PRACTICE_EXTRA_SERIES: {
            headline: "Treine ate sentir seguranca.",
            lead: "Depois das rodadas gratis, gere novas praticas por outros angulos.",
            benefits: [
                "Novas rodadas do mesmo assunto",
                "Treinos extras por bloco",
                "Mais confianca em prova"
            ],
            cta: "Liberar pratica premium",
            recommendedPlanId: "premium_monthly"
        },
        LARGE_PDF_UPLOAD: {
            headline: "Use materiais grandes sem perder foco.",
            lead: "O sistema divide o conteudo antes da IA para manter qualidade e custo sob controle.",
            benefits: [
                "PDFs longos com divisao inteligente",
                "Mais materiais no mesmo lugar",
                "Historico premium de estudos"
            ],
            cta: "Liberar PDF maior",
            recommendedPlanId: "premium_annual"
        }
    };
}

function buildFallbackPromotionDraft(input = {}) {
    const templates = getBaseOfferTemplates();
    const template = templates[input.feature] || {
        headline: "Desbloqueie o estudo completo.",
        lead: "Mais materiais, mais treino, mais controle e continuidade.",
        benefits: [
            "Modo completo de estudo",
            "Historico premium",
            "Mais desempenho"
        ],
        cta: "Conhecer premium",
        recommendedPlanId: "premium_annual"
    };

    return {
        surface: input.surface || "premium_checkout",
        feature: input.feature || "PREMIUM_LIBRARY",
        channel: input.channel || "internal_site",
        status: "draft",
        mode: input.mode || "suggest",
        headline: template.headline,
        lead: template.lead,
        benefits: template.benefits,
        cta: template.cta,
        recommendedPlanId: template.recommendedPlanId,
        targeting: {
            audience: input.audience || {},
            origin: input.origin || "ops_generate"
        }
    };
}

function buildPromotionPrompt(input, growthOverview) {
    return [
        "Voce gera um draft de promocao interna para o paywall do Papiro Tools.",
        "Responda em JSON com: headline, lead, benefits, cta, recommendedPlanId, audienceSummary.",
        "Nao use promessas exageradas. Foque em continuidade, profundidade e desempenho.",
        `Contexto:\n${JSON.stringify({
            request: input,
            growth: {
                totals: growthOverview.totals,
                topChannels: growthOverview.channels.slice(0, 3)
            }
        })}`
    ].join("\n\n");
}

async function generatePromotionDraft(input = {}) {
    const fallbackDraft = buildFallbackPromotionDraft(input);
    let draft = { ...fallbackDraft };

    const state = await getPrimaryOpsState();

    if (state.copilot.enabled && isGeminiConfigured()) {
        const growthOverview = await getGrowthOverview();
        const aiResponse = await callGeminiJson({
            model: state.copilot.defaultModel,
            prompt: buildPromotionPrompt(input, growthOverview),
            schemaInstruction: "benefits deve ser array curto de strings."
        });

        if (aiResponse.ok && aiResponse.data) {
            draft = {
                ...draft,
                headline: aiResponse.data.headline || draft.headline,
                lead: aiResponse.data.lead || draft.lead,
                benefits: Array.isArray(aiResponse.data.benefits) && aiResponse.data.benefits.length
                    ? aiResponse.data.benefits
                    : draft.benefits,
                cta: aiResponse.data.cta || draft.cta,
                recommendedPlanId: aiResponse.data.recommendedPlanId || draft.recommendedPlanId,
                targeting: {
                    ...draft.targeting,
                    audienceSummary: aiResponse.data.audienceSummary || ""
                }
            };
        }
    }

    const insertResponse = await insertRow(PROMOTION_CAMPAIGNS_TABLE, {
        surface: draft.surface,
        feature: draft.feature,
        channel: draft.channel,
        status: "draft",
        mode: draft.mode,
        headline: draft.headline,
        lead: draft.lead,
        benefits: draft.benefits,
        cta: draft.cta,
        recommended_plan_id: draft.recommendedPlanId,
        targeting: draft.targeting,
        external_platform: input.externalPlatform || "",
        campaign_id: input.campaignId || "",
        adset_id: input.adsetId || "",
        ad_id: input.adId || "",
        creative_id: input.creativeId || ""
    });

    const campaign = Array.isArray(insertResponse.data) ? insertResponse.data[0] : null;

    if (campaign) {
        await insertRow(PROMOTION_ACTIONS_TABLE, {
            campaign_id: campaign.id,
            action_type: "generate_draft",
            status: "completed",
            mode: draft.mode,
            reason: "ops_generate",
            payload: {
                source: "copilot",
                feature: draft.feature
            }
        });
    }

    return {
        ok: insertResponse.ok,
        draft: campaign || draft
    };
}

async function listPromotionCampaigns() {
    const response = await listRows(PROMOTION_CAMPAIGNS_TABLE, {
        order: "created_at.desc",
        limit: 30
    });

    return {
        ok: true,
        configured: isSupabaseConfigured(),
        items: safeArray(response.data)
    };
}

async function getActivePromotion(surface = "premium_checkout", feature = "") {
    const response = await listRows(PROMOTION_CAMPAIGNS_TABLE, {
        filters: [
            {
                column: "status",
                value: encodeFilter("eq", "active")
            },
            {
                column: "surface",
                value: encodeFilter("eq", surface)
            },
            {
                column: "channel",
                value: encodeFilter("eq", "internal_site")
            }
        ],
        order: "updated_at.desc",
        limit: 20
    });

    const items = safeArray(response.data);
    const exact = items.find((item) => String(item.feature || "") === String(feature || ""));
    return exact || items.find((item) => !item.feature) || null;
}

async function applyPromotion(input = {}) {
    const action = String(input.action || "activate");
    const campaignId = String(input.campaignId || "");

    if (!campaignId) {
        return {
            ok: false,
            status: "missing_campaign_id"
        };
    }

    let status = "active";

    if (action === "pause") {
        status = "paused";
    }

    if (action === "archive") {
        status = "archived";
    }

    const patchResponse = await patchRows(PROMOTION_CAMPAIGNS_TABLE, [
        {
            column: "id",
            value: encodeFilter("eq", campaignId)
        }
    ], {
        status
    });

    if (patchResponse.ok) {
        await insertRow(PROMOTION_ACTIONS_TABLE, {
            campaign_id: campaignId,
            action_type: action,
            status: "completed",
            mode: input.mode || "approval_required",
            reason: input.reason || "ops_apply",
            payload: input.payload && typeof input.payload === "object"
                ? input.payload
                : {}
        });
    }

    return {
        ok: patchResponse.ok,
        status,
        item: Array.isArray(patchResponse.data) ? patchResponse.data[0] : null
    };
}

async function setPromotionMode(mode) {
    const state = await savePrimaryOpsState({
        promotionMode: String(mode || "suggest")
    });

    return {
        ok: true,
        mode: state.promotionMode
    };
}

async function recordChannelSpend(input = {}) {
    const payload = {
        period_start: input.periodStart,
        period_end: input.periodEnd,
        channel: String(input.channel || "internal_site"),
        campaign: String(input.campaign || "(manual)"),
        external_platform: String(input.externalPlatform || ""),
        external_account_id: String(input.externalAccountId || ""),
        amount: Number(input.amount || 0),
        currency: String(input.currency || "BRL"),
        notes: String(input.notes || ""),
        metadata: input.metadata && typeof input.metadata === "object"
            ? input.metadata
            : {}
    };

    return insertRow(SPEND_TABLE, payload);
}

async function searchOps(query = "") {
    const term = String(query || "").trim();

    if (!term) {
        return {
            ok: true,
            query: term,
            results: {}
        };
    }

    const [entitlements, checkoutSessions, growthEvents, campaigns] = await Promise.all([
        listRows("premium_entitlements", { order: "updated_at.desc", limit: 200 }),
        listRows("premium_checkout_sessions", { order: "updated_at.desc", limit: 200 }),
        listRows(GROWTH_TABLE, { order: "created_at.desc", limit: 200 }),
        listRows(PROMOTION_CAMPAIGNS_TABLE, { order: "updated_at.desc", limit: 100 })
    ]);

    const matches = (item) => JSON.stringify(item || {}).toLowerCase().includes(term.toLowerCase());

    return {
        ok: true,
        query: term,
        results: {
            entitlements: safeArray(entitlements.data).filter(matches).slice(0, 20),
            checkoutSessions: safeArray(checkoutSessions.data).filter(matches).slice(0, 20),
            growthEvents: safeArray(growthEvents.data).filter(matches).slice(0, 20),
            promotionCampaigns: safeArray(campaigns.data).filter(matches).slice(0, 20)
        }
    };
}

async function handleOpsAction(input = {}) {
    const action = String(input.action || "").trim();
    const reason = String(input.reason || "").trim();

    if (!action) {
        return {
            ok: false,
            status: "missing_action"
        };
    }

    const state = await getPrimaryOpsState();

    if (action === "pause_free_lane") {
        const next = await savePrimaryOpsState({
            lanes: {
                ...state.lanes,
                freeLanePaused: true
            }
        });
        await recordOpsAlert({
            eventType: "free_lane_paused_manual",
            severity: "warning",
            provider: "ops",
            message: "Free lane pausada manualmente.",
            payload: { reason }
        });
        return { ok: true, state: next };
    }

    if (action === "resume_free_lane") {
        const next = await savePrimaryOpsState({
            lanes: {
                ...state.lanes,
                freeLanePaused: false
            }
        });
        return { ok: true, state: next };
    }

    if (action === "pause_premium_lane") {
        const next = await savePrimaryOpsState({
            lanes: {
                ...state.lanes,
                premiumLanePaused: true
            }
        });
        await recordOpsAlert({
            eventType: "premium_lane_paused_manual",
            severity: "critical",
            provider: "ops",
            message: "Premium lane pausada manualmente.",
            payload: { reason }
        });
        return { ok: true, state: next };
    }

    if (action === "resume_premium_lane") {
        const next = await savePrimaryOpsState({
            lanes: {
                ...state.lanes,
                premiumLanePaused: false
            }
        });
        return { ok: true, state: next };
    }

    if (action === "ack_alert" && input.alertId) {
        const response = await patchRows(ALERTS_TABLE, [
            {
                column: "id",
                value: encodeFilter("eq", input.alertId)
            }
        ], {
            acknowledged_at: new Date().toISOString()
        });
        return {
            ok: response.ok,
            item: Array.isArray(response.data) ? response.data[0] : null
        };
    }

    if (action === "resolve_alert" && input.alertId) {
        const response = await patchRows(ALERTS_TABLE, [
            {
                column: "id",
                value: encodeFilter("eq", input.alertId)
            }
        ], {
            acknowledged_at: new Date().toISOString(),
            resolved_at: new Date().toISOString()
        });
        return {
            ok: response.ok,
            item: Array.isArray(response.data) ? response.data[0] : null
        };
    }

    if (action === "resolve_provider_fallback_alerts") {
        const now = new Date().toISOString();
        const eventTypes = [
            "daily_health_check_fallback",
            "three_day_review_fallback",
            "copilot_fallback_used"
        ];
        const responses = [];

        for (const eventType of eventTypes) {
            responses.push(await patchRows(ALERTS_TABLE, [
                {
                    column: "event_type",
                    value: encodeFilter("eq", eventType)
                },
                {
                    column: "resolved_at",
                    value: "is.null"
                }
            ], {
                acknowledged_at: now,
                resolved_at: now
            }));
        }

        const ok = responses.every((response) => response.ok || response.skipped);
        return {
            ok,
            status: ok ? "fallback_alerts_resolved" : "fallback_alerts_resolution_failed",
            items: responses.flatMap((response) => safeArray(response.data))
        };
    }

    if (action === "recheck_provider_status") {
        const next = await savePrimaryOpsState({
            lastProviderStatus: isGeminiConfigured() ? "gemini_configured" : "gemini_not_configured"
        });
        return {
            ok: true,
            state: next
        };
    }

    if (action === "resync_payment" && input.paymentId) {
        const accessToken = process.env.MERCADO_PAGO_ACCESS_TOKEN || "";

        if (!accessToken) {
            return {
                ok: false,
                status: "missing_access_token"
            };
        }

        const response = await fetch(`https://api.mercadopago.com/v1/payments/${encodeURIComponent(input.paymentId)}`, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });
        const payment = response.ok ? await response.json() : null;

        if (!payment) {
            return {
                ok: false,
                status: "payment_not_found"
            };
        }

        const activation = await applyPaymentToEntitlement(payment);

        if (!activation.ok) {
            await recordOpsAlert({
                eventType: "payment_resync_failed",
                severity: "warning",
                provider: "mercado_pago",
                message: "Falha ao resincronizar pagamento.",
                payload: {
                    paymentId: input.paymentId,
                    activation
                }
            });
        }

        return {
            ok: true,
            activation
        };
    }

    return {
        ok: false,
        status: "unsupported_action"
    };
}

function normalizeChangeRequestInput(input = {}) {
    return {
        review_run_id: String(input.reviewRunId || input.review_run_id || "").trim() || null,
        target_system: String(input.targetSystem || input.target_system || "").trim(),
        action_type: String(input.actionType || input.action_type || "").trim(),
        payload: input.payload && typeof input.payload === "object" ? input.payload : {},
        prepared_by: String(input.preparedBy || input.prepared_by || "papiro_ops").trim() || "papiro_ops",
        status: String(input.status || "pending").trim() || "pending",
        approval_notes: String(input.approvalNotes || input.approval_notes || "").trim(),
        approved_by: String(input.approvedBy || input.approved_by || "").trim(),
        rejected_by: String(input.rejectedBy || input.rejected_by || "").trim(),
        result_summary: String(input.resultSummary || input.result_summary || "").trim()
    };
}

function summarizeChangeRequests(items = []) {
    const list = safeArray(items);
    return {
        total: list.length,
        pending: list.filter((item) => String(item.status || "") === "pending").length,
        approved: list.filter((item) => String(item.status || "") === "approved").length,
        rejected: list.filter((item) => String(item.status || "") === "rejected").length,
        executed: list.filter((item) => String(item.status || "") === "executed").length,
        failed: list.filter((item) => String(item.status || "") === "failed").length
    };
}

async function listChangeRequests(options = {}) {
    const filters = [];
    const status = String(options.status || "").trim();

    if (status) {
        filters.push({
            column: "status",
            value: encodeFilter("eq", status)
        });
    }

    const result = await listRows(CHANGE_REQUESTS_TABLE, {
        filters,
        order: "updated_at.desc",
        limit: Number(options.limit || 50)
    });

    const items = safeArray(result.data);
    return {
        ok: true,
        configured: isSupabaseConfigured(),
        items,
        summary: summarizeChangeRequests(items)
    };
}

async function createChangeRequest(input = {}) {
    const payload = normalizeChangeRequestInput(input);

    if (!payload.target_system || !payload.action_type) {
        return {
            ok: false,
            status: "missing_change_request_fields"
        };
    }

    const result = await insertRow(CHANGE_REQUESTS_TABLE, payload);
    const item = Array.isArray(result.data) ? result.data[0] : null;

    if (item) {
        await insertAuditLog({
            eventType: "change_request_created",
            actor: payload.prepared_by,
            targetSystem: payload.target_system,
            entityType: "change_request",
            entityId: item.id,
            status: item.status,
            metadata: {
                actionType: payload.action_type,
                reviewRunId: payload.review_run_id,
                payload: payload.payload
            }
        });
    }

    return {
        ok: result.ok,
        item
    };
}

async function getChangeRequestById(changeRequestId) {
    const result = await listRows(CHANGE_REQUESTS_TABLE, {
        filters: [
            {
                column: "id",
                value: encodeFilter("eq", changeRequestId)
            }
        ],
        limit: 1
    });

    return safeArray(result.data)[0] || null;
}

async function approveChangeRequest(input = {}) {
    const changeRequestId = String(input.changeRequestId || input.change_request_id || "").trim();
    if (!changeRequestId) {
        return {
            ok: false,
            status: "missing_change_request_id"
        };
    }

    const actor = String(input.approvedBy || input.approved_by || "papiro_operator").trim() || "papiro_operator";
    const notes = String(input.approvalNotes || input.approval_notes || "").trim();
    const result = await patchRows(CHANGE_REQUESTS_TABLE, [
        {
            column: "id",
            value: encodeFilter("eq", changeRequestId)
        }
    ], {
        status: "approved",
        approved_by: actor,
        approval_notes: notes
    });

    const item = Array.isArray(result.data) ? result.data[0] : null;

    if (item) {
        await insertAuditLog({
            eventType: "change_request_approved",
            actor,
            targetSystem: item.target_system,
            entityType: "change_request",
            entityId: item.id,
            status: "approved",
            metadata: {
                approvalNotes: notes,
                actionType: item.action_type
            }
        });
    }

    return {
        ok: result.ok,
        item
    };
}

async function rejectChangeRequest(input = {}) {
    const changeRequestId = String(input.changeRequestId || input.change_request_id || "").trim();
    if (!changeRequestId) {
        return {
            ok: false,
            status: "missing_change_request_id"
        };
    }

    const actor = String(input.rejectedBy || input.rejected_by || "papiro_operator").trim() || "papiro_operator";
    const notes = String(input.approvalNotes || input.approval_notes || "").trim();
    const result = await patchRows(CHANGE_REQUESTS_TABLE, [
        {
            column: "id",
            value: encodeFilter("eq", changeRequestId)
        }
    ], {
        status: "rejected",
        rejected_by: actor,
        approval_notes: notes
    });

    const item = Array.isArray(result.data) ? result.data[0] : null;

    if (item) {
        await insertAuditLog({
            eventType: "change_request_rejected",
            actor,
            targetSystem: item.target_system,
            entityType: "change_request",
            entityId: item.id,
            status: "rejected",
            metadata: {
                approvalNotes: notes,
                actionType: item.action_type
            }
        });
    }

    return {
        ok: result.ok,
        item
    };
}

function buildFallbackThreeDayReview(dataset = {}) {
    const growth = dataset.growthOverview || { totals: {}, channels: [] };
    const bestChannel = safeArray(growth.channels)[0] || null;
    const summary = bestChannel
        ? `A retaguarda revisou o Papiro. Melhor sinal atual: ${bestChannel.source}/${bestChannel.campaign}; foco segue em growth barato e friccoes do paywall.`
        : "A retaguarda revisou o Papiro. Ainda faltam sinais fortes de canal, entao o foco segue em instrumentacao, melhoria de site e promocoes internas.";

    return {
        provider: "fallback",
        summary,
        confidence: bestChannel ? "medium" : "low",
        missingData: bestChannel ? [] : ["Pouco volume de dados para comparar canais com seguranca."],
        recommendations: {
            executiveSummary: [
                summary
            ],
            campaignActions: [
                "Reforcar promocoes internas do premium antes de subir gasto pago."
            ],
            siteImprovements: [
                "Revisar friccao do paywall e clareza da promessa premium."
            ],
            lowCostIdeas: [
                "Criar card compartilhavel do plano pronto para uso em WhatsApp e Instagram."
            ],
            onboardingFindings: [
                "Verificar se o retorno do checkout deixa claro quando o premium foi ativado."
            ],
            bugPriorities: [
                "Priorizar bugs que interrompem checkout, entitlement ou acesso premium."
            ]
        }
    };
}

function buildThreeDayReviewPrompt(dataset = {}) {
    return [
        "Voce e o analista recorrente da retaguarda Papiro.",
        "Objetivo: revisar o site Papiro a cada 3 dias com foco em growth barato, monetizacao do premium e melhorias do site.",
        "Responda em JSON valido com as chaves: summary, confidence, missingData, recommendations.",
        "recommendations deve conter arrays com as chaves: executiveSummary, campaignActions, siteImprovements, lowCostIdeas, onboardingFindings, bugPriorities.",
        "Nao proponha gasto pago alto. Prefira ideias baratas, campanhas internas e melhorias de conversao.",
        `Dados:\n${JSON.stringify(dataset)}`
    ].join("\n\n");
}

async function incrementThreeDayReviewUsage() {
    const key = `three-day-review-${getMonthKey()}`;
    const current = await getStateValue(key, { count: 0 });
    await setStateValue(key, {
        count: Number(current.count || 0) + 1
    });
}

async function getThreeDayReviewUsageStatus() {
    const state = await getPrimaryOpsState();
    const key = `three-day-review-${getMonthKey()}`;
    const current = await getStateValue(key, { count: 0 });
    const limit = Number(state.copilot.threeDayReviewMonthlyCap || 12);

    return {
        ok: Number(current.count || 0) < limit,
        used: Number(current.count || 0),
        limit
    };
}

async function getThreeDayReviewDataset() {
    const [overview, growthOverview, weeklyReport, appsWorkspace, alerts, paymentsStatus, promotions] = await Promise.all([
        getOverview(),
        getGrowthOverview(),
        getWeeklyReport(),
        getAppsWorkspace(),
        listOpsAlerts(20),
        getPaymentsStatus(),
        listPromotionCampaigns()
    ]);

    return {
        generatedAt: new Date().toISOString(),
        overview,
        growthOverview,
        weeklyReport,
        appsWorkspace,
        alerts: alerts.items,
        paymentsStatus,
        promotions: promotions.items
    };
}

function normalizeReviewOutput(review) {
    const recommendations = review && review.recommendations && typeof review.recommendations === "object"
        ? review.recommendations
        : {};

    const asArray = (value) => Array.isArray(value) ? value.map((item) => String(item || "").trim()).filter(Boolean) : [];

    return {
        provider: String(review.provider || "fallback").trim() || "fallback",
        summary: String(review.summary || "").trim(),
        confidence: String(review.confidence || "").trim() || "low",
        missingData: asArray(review.missingData),
        recommendations: {
            executiveSummary: asArray(recommendations.executiveSummary),
            campaignActions: asArray(recommendations.campaignActions),
            siteImprovements: asArray(recommendations.siteImprovements),
            lowCostIdeas: asArray(recommendations.lowCostIdeas),
            onboardingFindings: asArray(recommendations.onboardingFindings),
            bugPriorities: asArray(recommendations.bugPriorities)
        }
    };
}

async function createReviewFollowupRequests(reviewRunId, review) {
    const bundles = [
        {
            targetSystem: "growth",
            actionType: "manual_review_bundle",
            bundleType: "campaign_actions",
            items: review.recommendations.campaignActions
        },
        {
            targetSystem: "papiro_tools",
            actionType: "manual_review_bundle",
            bundleType: "site_improvements",
            items: review.recommendations.siteImprovements
        },
        {
            targetSystem: "growth",
            actionType: "manual_review_bundle",
            bundleType: "low_cost_ideas",
            items: review.recommendations.lowCostIdeas
        },
        {
            targetSystem: "papiro_tools",
            actionType: "manual_review_bundle",
            bundleType: "bug_priorities",
            items: review.recommendations.bugPriorities
        }
    ];

    const created = [];

    for (const bundle of bundles) {
        if (!bundle.items.length) {
            continue;
        }

        const request = await createChangeRequest({
            reviewRunId,
            targetSystem: bundle.targetSystem,
            actionType: bundle.actionType,
            preparedBy: review.provider,
            payload: {
                bundleType: bundle.bundleType,
                items: bundle.items
            }
        });

        if (request.item) {
            created.push(request.item);
        }
    }

    return created;
}

async function runThreeDayReview(input = {}) {
    const usage = await getThreeDayReviewUsageStatus();

    if (!usage.ok && !input.force) {
        return {
            ok: false,
            status: "three_day_review_monthly_cap_reached",
            usage
        };
    }

    const startedAt = new Date().toISOString();
    const dataset = await getThreeDayReviewDataset();
    const fallback = buildFallbackThreeDayReview(dataset);
    let review = fallback;

    if (isGeminiConfigured() && input.provider !== "fallback") {
        const state = await getPrimaryOpsState();
        const response = await callGeminiJson({
            model: state.copilot.strategyModel || state.copilot.defaultModel,
            prompt: buildThreeDayReviewPrompt(dataset),
            schemaInstruction: "As listas devem ser arrays simples de strings."
        });

        if (response.ok && response.data) {
            review = normalizeReviewOutput({
                ...response.data,
                provider: "gemini"
            });
        } else {
            await insertAuditLog({
                eventType: "three_day_review_fallback",
                actor: "gemini",
                targetSystem: "papiro_ops",
                entityType: "review_run",
                status: "fallback",
                metadata: {
                    status: response.status
                }
            });
        }
    } else {
        review = normalizeReviewOutput(fallback);
    }

    const insertResult = await insertRow(REVIEW_RUNS_TABLE, {
        run_type: String(input.runType || "three_day_growth_review"),
        provider: review.provider,
        status: "completed",
        summary: review.summary,
        recommendations: review.recommendations,
        confidence: review.confidence,
        missing_data: review.missingData,
        generated_change_requests: 0,
        started_at: startedAt,
        completed_at: new Date().toISOString()
    });

    const run = Array.isArray(insertResult.data) ? insertResult.data[0] : null;
    const createdChangeRequests = run
        ? await createReviewFollowupRequests(run.id, review)
        : [];

    if (run) {
        await patchRows(REVIEW_RUNS_TABLE, [
            {
                column: "id",
                value: encodeFilter("eq", run.id)
            }
        ], {
            generated_change_requests: createdChangeRequests.length
        });

        await insertAuditLog({
            eventType: "three_day_review_completed",
            actor: review.provider,
            targetSystem: "papiro_ops",
            entityType: "review_run",
            entityId: run.id,
            status: "completed",
            metadata: {
                runType: run.run_type,
                confidence: review.confidence,
                generatedChangeRequests: createdChangeRequests.length
            }
        });
    }

    await incrementThreeDayReviewUsage();

    return {
        ok: insertResult.ok,
        reviewRun: run
            ? {
                ...run,
                recommendations: review.recommendations,
                missing_data: review.missingData,
                generated_change_requests: createdChangeRequests.length
            }
            : null,
        createdChangeRequests
    };
}

async function listReviewRuns(limit = 20) {
    const result = await listRows(REVIEW_RUNS_TABLE, {
        order: "created_at.desc",
        limit
    });

    return {
        ok: true,
        configured: isSupabaseConfigured(),
        items: safeArray(result.data)
    };
}

async function getSiteImprovements(limit = 20) {
    const [workItems, reviewRuns] = await Promise.all([
        listRows(APP_WORK_ITEMS_TABLE, {
            order: "updated_at.desc",
            limit: 100
        }),
        listReviewRuns(5)
    ]);

    const openItems = safeArray(workItems.data)
        .filter((item) => String(item.item_type || "") === "improvement" && !["done", "completed", "archived"].includes(String(item.status || "").toLowerCase()))
        .slice(0, limit);
    const reviewSuggestions = reviewRuns.items
        .flatMap((item) => safeArray(item.recommendations && item.recommendations.siteImprovements))
        .map((text, index) => ({
            id: `review-suggestion-${index + 1}`,
            source: "three_day_review",
            title: text,
            summary: text
        }))
        .slice(0, limit);

    return {
        ok: true,
        items: [
            ...openItems.map((item) => ({
                id: item.id,
                source: "work_item",
                title: item.title,
                summary: item.summary,
                app_key: item.app_key,
                status: item.status,
                priority: item.priority
            })),
            ...reviewSuggestions
        ].slice(0, limit)
    };
}

async function executeChangeRequestPayload(item) {
    const payload = item && item.payload && typeof item.payload === "object" ? item.payload : {};

    if (item.action_type === "promotion_apply") {
        return applyPromotion({
            ...payload,
            reason: payload.reason || "change_request_execution"
        });
    }

    if (item.action_type === "ops_action") {
        return handleOpsAction(payload);
    }

    if (item.action_type === "payment_resync") {
        return handleOpsAction({
            action: "resync_payment",
            paymentId: payload.paymentId,
            reason: payload.reason || "change_request_execution"
        });
    }

    if (item.action_type === "run_three_day_review") {
        return runThreeDayReview({
            force: true,
            runType: "manual_review"
        });
    }

    if (item.action_type === "recheck_apps") {
        return refreshManagedAppsHealth(payload);
    }

    if (item.action_type === "manual_review_bundle") {
        return {
            ok: true,
            status: "manual_followup_required",
            summary: "Bundle aprovado para acompanhamento humano na retaguarda Papiro."
        };
    }

    return {
        ok: false,
        status: "unsupported_change_request_action"
    };
}

async function executeApprovedChangeRequest(input = {}) {
    const changeRequestId = String(input.changeRequestId || input.change_request_id || "").trim();

    if (!changeRequestId) {
        return {
            ok: false,
            status: "missing_change_request_id"
        };
    }

    const item = await getChangeRequestById(changeRequestId);

    if (!item) {
        return {
            ok: false,
            status: "change_request_not_found"
        };
    }

    if (String(item.status || "") !== "approved") {
        return {
            ok: false,
            status: "change_request_not_approved",
            item
        };
    }

    const execution = await executeChangeRequestPayload(item);
    const nextStatus = execution.ok ? "executed" : "failed";
    const resultSummary = execution.summary || execution.status || (execution.ok ? "executed" : "failed");
    const patchResult = await patchRows(CHANGE_REQUESTS_TABLE, [
        {
            column: "id",
            value: encodeFilter("eq", changeRequestId)
        }
    ], {
        status: nextStatus,
        executed_at: new Date().toISOString(),
        result_summary: resultSummary
    });

    const updated = Array.isArray(patchResult.data) ? patchResult.data[0] : item;

    await insertAuditLog({
        eventType: "change_request_executed",
        actor: String(input.executedBy || input.executed_by || "papiro_operator"),
        targetSystem: updated.target_system,
        entityType: "change_request",
        entityId: updated.id,
        status: nextStatus,
        metadata: {
            actionType: updated.action_type,
            resultSummary,
            execution
        }
    });

    return {
        ok: execution.ok,
        item: updated,
        execution
    };
}

module.exports = {
    GROWTH_TABLE,
    SPEND_TABLE,
    ALERTS_TABLE,
    STATE_TABLE,
    PROMOTION_CAMPAIGNS_TABLE,
    PROMOTION_ACTIONS_TABLE,
    PROMOTION_RULES_TABLE,
    getPrimaryOpsState,
    savePrimaryOpsState,
    getManagedApps,
    getAppsWorkspace,
    refreshManagedAppsHealth,
    saveManagedApp,
    saveAppWorkItem,
    saveAppBugReport,
    saveAppFinanceSnapshot,
    getStateValue,
    setStateValue,
    insertAuditLog,
    recordGrowthEvent,
    recordOpsAlert,
    listOpsAlerts,
    getPaymentsStatus,
    getGrowthOverview,
    getOverview,
    getWeeklyReport,
    listReviewRuns,
    runThreeDayReview,
    runDailyHealthCheck,
    getOpsAiMemory,
    saveOpsAiMemory,
    getMarketingContentQueue,
    generateMarketingContentQueue,
    ensureMarketingContentQueue,
    updateMarketingContentItem,
    listChangeRequests,
    createChangeRequest,
    approveChangeRequest,
    rejectChangeRequest,
    executeApprovedChangeRequest,
    getSiteImprovements,
    analyzeWithCopilot,
    generatePromotionDraft,
    listPromotionCampaigns,
    getActivePromotion,
    applyPromotion,
    setPromotionMode,
    recordChannelSpend,
    searchOps,
    handleOpsAction
};

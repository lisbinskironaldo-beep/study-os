const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");

const root = process.cwd();
const envPath = path.join(root, ".env.local");
const schemaPath = path.join(root, "docs", "supabase_premium_schema.sql");
const opsIndexPath = path.join(root, "ops", "index.html");
const criticalTables = [
    "premium_checkout_sessions",
    "premium_entitlements",
    "rotanota_user_accounts",
    "rotanota_user_customer_links",
    "premium_study_growth_events",
    "premium_study_channel_spend",
    "premium_study_ops_alerts",
    "premium_study_ops_state",
    "premium_study_promotion_campaigns",
    "premium_study_promotion_actions",
    "premium_study_promotion_rules",
    "northstar_app_work_items",
    "northstar_app_bug_reports",
    "northstar_app_finance_snapshots",
    "northstar_change_requests",
    "northstar_review_runs",
    "northstar_audit_log"
];

function parseEnvFile(filePath) {
    if (!fs.existsSync(filePath)) {
        return {};
    }

    const source = fs.readFileSync(filePath, "utf8");
    return source.split(/\r?\n/).reduce((acc, line) => {
        const trimmed = line.trim();

        if (!trimmed || trimmed.startsWith("#")) {
            return acc;
        }

        const separator = trimmed.indexOf("=");
        if (separator <= 0) {
            return acc;
        }

        const key = trimmed.slice(0, separator).trim();
        const value = trimmed.slice(separator + 1).trim();
        acc[key] = value;
        return acc;
    }, {});
}

function isFilled(value) {
    return typeof value === "string" && value.trim().length > 0;
}

function loadEnvIntoProcess(env) {
    Object.entries(env).forEach(([key, value]) => {
        process.env[key] = value;
    });
}

function printSection(title, rows) {
    console.log(`\n${title}`);
    rows.forEach((row) => console.log(row));
}

async function validateSupabaseTables() {
    const { isSupabaseConfigured, supabaseRequest } = require("../api/_lib/supabase");

    if (!isSupabaseConfigured()) {
        return {
            ok: false,
            message: "Supabase nao configurado."
        };
    }

    const results = await Promise.all(criticalTables.map(async (table) => {
        const response = await supabaseRequest(`${table}?select=*&limit=1`);
        return {
            table,
            ok: response.ok,
            status: response.status
        };
    }));

    return {
        ok: results.every((item) => item.ok),
        results
    };
}

async function validateGemini() {
    const { getGeminiApiKey } = require("../api/_lib/gemini");
    const apiKey = getGeminiApiKey();

    if (!apiKey) {
        return {
            ok: false,
            status: "missing_gemini_key"
        };
    }

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${encodeURIComponent(apiKey)}`);
    return {
        ok: response.ok,
        status: response.status
    };
}

async function validateMercadoPago(accessToken) {
    if (!isFilled(accessToken)) {
        return {
            ok: false,
            status: "missing_access_token"
        };
    }

    const response = await fetch("https://api.mercadopago.com/users/me", {
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    });

    return {
        ok: response.ok,
        status: response.status
    };
}

async function validateOpenAiSurface(env) {
    const appUrl = env.OPENAI_APP_PUBLIC_URL;
    const mcpUrl = env.OPENAI_MCP_SERVER_URL;
    const mcpApiKey = env.OPENAI_MCP_API_KEY;

    if (!isFilled(appUrl) || !isFilled(mcpUrl) || !isFilled(mcpApiKey)) {
        return {
            ok: false,
            status: "not_fully_configured"
        };
    }

    const [appResponse, mcpResponse] = await Promise.all([
        fetch(appUrl).catch(() => null),
        fetch(mcpUrl, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${mcpApiKey}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                jsonrpc: "2.0",
                id: "readiness",
                method: "tools/list",
                params: {}
            })
        }).catch(() => null)
    ]);

    return {
        ok: Boolean(appResponse && appResponse.ok && mcpResponse && mcpResponse.ok),
        appStatus: appResponse ? appResponse.status : 0,
        mcpStatus: mcpResponse ? mcpResponse.status : 0
    };
}

async function validateGoogleAuth(env) {
    const clientId = env.GOOGLE_CLIENT_ID || env.PAPIRO_TOOLS_GOOGLE_CLIENT_ID || env.ROTANOTA_GOOGLE_CLIENT_ID || "";
    const sessionSecretReady = isFilled(env.PAPIRO_TOOLS_AUTH_SECRET) || isFilled(env.ROTANOTA_AUTH_SECRET) || isFilled(env.OPS_SESSION_SECRET);

    if (!isFilled(clientId)) {
        return {
            ok: false,
            status: "missing_google_client_id"
        };
    }

    if (!sessionSecretReady) {
        return {
            ok: false,
            status: "missing_auth_secret"
        };
    }

    return {
        ok: true,
        status: "configured_for_runtime"
    };
}

async function validateGoogleAds(env) {
    const ready = isFilled(env.GOOGLE_ADS_DEVELOPER_TOKEN)
        && isFilled(env.GOOGLE_ADS_MANAGER_CUSTOMER_ID)
        && isFilled(env.GOOGLE_ADS_CUSTOMER_ID)
        && (
            isFilled(env.GOOGLE_ADS_SERVICE_ACCOUNT_KEY)
            || (isFilled(env.GOOGLE_ADS_CLIENT_ID) && isFilled(env.GOOGLE_ADS_CLIENT_SECRET) && isFilled(env.GOOGLE_ADS_REFRESH_TOKEN))
        );

    return {
        ok: ready,
        status: ready ? "configured_for_runtime_check" : "not_configured"
    };
}

async function validateMetaAds(env) {
    const ready = isFilled(env.META_APP_ID)
        && isFilled(env.META_AD_ACCOUNT_ID)
        && isFilled(env.META_ACCESS_TOKEN);

    if (!ready) {
        return {
            ok: false,
            status: "not_configured"
        };
    }

    const response = await fetch(`https://graph.facebook.com/v19.0/act_${encodeURIComponent(env.META_AD_ACCOUNT_ID)}?fields=id&access_token=${encodeURIComponent(env.META_ACCESS_TOKEN)}`).catch(() => null);
    return {
        ok: Boolean(response && response.ok),
        status: response ? response.status : 0
    };
}

async function validateBuffer(env) {
    const apiKey = env.BUFFER_API_KEY || env.BUFFER_ACCESS_TOKEN || "";
    const profileIds = env.BUFFER_PROFILE_IDS || env.BUFFER_CHANNEL_IDS || "";

    if (!isFilled(apiKey) || !isFilled(profileIds)) {
        return {
            ok: false,
            status: "not_configured",
            hasApiKey: isFilled(apiKey),
            hasProfileIds: isFilled(profileIds)
        };
    }

    const response = await fetch("https://api.buffer.com", {
        method: "POST",
        headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            query: "{ account { organizations { id name } } }"
        })
    }).catch(() => null);

    return {
        ok: Boolean(response && response.ok),
        status: response ? response.status : 0,
        hasApiKey: true,
        hasProfileIds: true
    };
}

async function validateCanvaAi2Preview() {
    const response = await fetch("https://www.canva.com/magic/", {
        method: "GET"
    }).catch(() => null);

    return {
        ok: Boolean(response && response.ok),
        status: response ? response.status : 0,
        url: "https://www.canva.com/magic/"
    };
}

function inspectMarketingConnectors(env) {
    return {
        canvaPro: true,
        buffer: isFilled(env.BUFFER_API_KEY || env.BUFFER_ACCESS_TOKEN) && isFilled(env.BUFFER_PROFILE_IDS || env.BUFFER_CHANNEL_IDS)
    };
}

function inspectVercelProductionEnv() {
    try {
        const pulledPath = path.join(root, ".codex-temp", "vercel-production-readiness.env");
        fs.mkdirSync(path.dirname(pulledPath), { recursive: true });
        execFileSync("vercel.cmd", ["env", "pull", pulledPath, "--environment=production"], {
            cwd: root,
            stdio: "ignore"
        });
        const pulled = parseEnvFile(pulledPath);
        const keys = [
            "OPENAI_APP_PUBLIC_URL",
            "OPENAI_MCP_SERVER_URL",
            "OPENAI_MCP_API_KEY",
            "GOOGLE_CLIENT_ID",
            "PAPIRO_TOOLS_AUTH_SECRET",
            "GOOGLE_ADS_DEVELOPER_TOKEN",
            "GOOGLE_ADS_MANAGER_CUSTOMER_ID",
            "GOOGLE_ADS_CUSTOMER_ID",
            "META_APP_ID",
            "META_AD_ACCOUNT_ID",
            "META_ACCESS_TOKEN",
            "MERCADO_PAGO_WEBHOOK_SECRET",
            "BUFFER_API_KEY",
            "BUFFER_PROFILE_IDS",
            "BUFFER_ORGANIZATION_ID"
        ];

        return Object.fromEntries(keys.map((key) => [key, isFilled(pulled[key])]));
    } catch (error) {
        return null;
    }
}

async function main() {
    const env = parseEnvFile(envPath);
    loadEnvIntoProcess(env);
    const checks = {
        mercadoPago: [
            "MERCADO_PAGO_ACCESS_TOKEN",
            "MERCADO_PAGO_MONTHLY_PRICE",
            "MERCADO_PAGO_ANNUAL_PRICE",
            "MERCADO_PAGO_SUCCESS_URL",
            "MERCADO_PAGO_FAILURE_URL",
            "MERCADO_PAGO_PENDING_URL"
        ],
        supabase: [
            "SUPABASE_URL",
            "SUPABASE_SERVICE_ROLE_KEY"
        ],
        gemini: [
            "GEMINI_API_KEY"
        ],
        ops: [
            "OPS_PANEL_PASSWORD"
        ]
    };

    const fallbackGroups = {
        baseUrl: ["PAPIRO_TOOLS_BASE_URL"],
        gemini: ["GEMINI_API_KEY", "GEMINI_FREE_API_KEY", "GEMINI_PAID_API_KEY"],
        opsSession: ["OPS_SESSION_SECRET", "OPS_PANEL_PASSWORD"]
    };

    const missing = [];
    const warnings = [];

    Object.entries(checks).forEach(([group, keys]) => {
        keys.forEach((key) => {
            if (!isFilled(env[key])) {
                missing.push(`${group}: ${key}`);
            }
        });
    });

    if (!fallbackGroups.baseUrl.some((key) => isFilled(env[key]))) {
        missing.push("baseUrl: PAPIRO_TOOLS_BASE_URL");
    }

    if (!fallbackGroups.gemini.some((key) => isFilled(env[key]))) {
        missing.push("gemini: GEMINI_API_KEY ou GEMINI_FREE_API_KEY / GEMINI_PAID_API_KEY");
    }

    if (!fallbackGroups.opsSession.some((key) => isFilled(env[key]))) {
        missing.push("ops: OPS_SESSION_SECRET ou OPS_PANEL_PASSWORD");
    }

    if (!isFilled(env.GOOGLE_CLIENT_ID) && !isFilled(env.PAPIRO_TOOLS_GOOGLE_CLIENT_ID) && !isFilled(env.ROTANOTA_GOOGLE_CLIENT_ID)) {
        missing.push("googleAuth: GOOGLE_CLIENT_ID");
    }

    if (!isFilled(env.MERCADO_PAGO_WEBHOOK_SECRET)) {
        warnings.push("MERCADO_PAGO_WEBHOOK_SECRET ainda nao preenchido. O webhook valida assinatura apenas quando esse segredo existir.");
    }

    if (isFilled(env.MERCADO_PAGO_ACCESS_TOKEN) && env.MERCADO_PAGO_ACCESS_TOKEN.startsWith("APP_USR-")) {
        warnings.push("MERCADO_PAGO_ACCESS_TOKEN parece token de producao (APP_USR). Recomenda-se homologar primeiro com credenciais de teste.");
    }

    if (!isFilled(env.OPS_SESSION_SECRET) && isFilled(env.OPS_PANEL_PASSWORD)) {
        warnings.push("OPS_SESSION_SECRET nao foi preenchido. O sistema cai no fallback da senha do painel, mas o ideal e usar um segredo dedicado.");
    }

    if (!isFilled(env.PAPIRO_TOOLS_AUTH_SECRET) && !isFilled(env.ROTANOTA_AUTH_SECRET)) {
        warnings.push("PAPIRO_TOOLS_AUTH_SECRET ainda nao foi preenchido. O login usa fallback do painel, mas o ideal e usar um segredo proprio para a conta.");
    }

    if (!isFilled(env.CRON_SECRET)) {
        warnings.push("CRON_SECRET nao foi preenchido. O ciclo automatico de 3 dias deve ser protegido com esse segredo na Vercel.");
    }

    if (isFilled(env.OPENAI_APP_PUBLIC_URL) || isFilled(env.OPENAI_MCP_SERVER_URL) || isFilled(env.OPENAI_MCP_API_KEY)) {
        if (!isFilled(env.OPENAI_APP_PUBLIC_URL) || !isFilled(env.OPENAI_MCP_SERVER_URL) || !isFilled(env.OPENAI_MCP_API_KEY)) {
            warnings.push("OpenAI / ChatGPT foi iniciado parcialmente. Feche OPENAI_APP_PUBLIC_URL, OPENAI_MCP_SERVER_URL e OPENAI_MCP_API_KEY juntos.");
        }
    }

    if (!fs.existsSync(schemaPath)) {
        warnings.push("Schema do Supabase nao encontrado em docs/supabase_premium_schema.sql.");
    }

    if (!fs.existsSync(opsIndexPath)) {
        warnings.push("Painel /ops nao encontrado em ops/index.html.");
    }

    const [supabaseValidation, geminiValidation, mercadoPagoValidation, openAiValidation, googleAuthValidation, googleAdsValidation, metaAdsValidation, bufferValidation, canvaAi2Validation] = await Promise.all([
        validateSupabaseTables(),
        validateGemini(),
        validateMercadoPago(env.MERCADO_PAGO_ACCESS_TOKEN),
        validateOpenAiSurface(env),
        validateGoogleAuth(env),
        validateGoogleAds(env),
        validateMetaAds(env),
        validateBuffer(env),
        validateCanvaAi2Preview()
    ]);
    const marketingConnectors = inspectMarketingConnectors(env);
    const vercelProductionEnv = inspectVercelProductionEnv();

    if (!supabaseValidation.ok) {
        missing.push("supabase: tabelas criticas nao acessiveis");
    }

    if (!geminiValidation.ok) {
        missing.push(`gemini: validacao runtime falhou (${geminiValidation.status})`);
    }

    if (!mercadoPagoValidation.ok) {
        missing.push(`mercadoPago: validacao runtime falhou (${mercadoPagoValidation.status})`);
    }

    if (!openAiValidation.ok) {
        warnings.push("OpenAI / ChatGPT ainda nao fechou o circuito publico + MCP + bearer neste ambiente.");
    }

    if (!googleAuthValidation.ok) {
        missing.push(`googleAuth: validacao falhou (${googleAuthValidation.status})`);
    }

    if (!googleAdsValidation.ok) {
        warnings.push("Google Ads ainda nao esta pronto para validacao real neste ambiente.");
    }

    if (!metaAdsValidation.ok) {
        warnings.push("Meta Ads ainda nao esta pronto para validacao real neste ambiente.");
    }

    if (!bufferValidation.ok) {
        warnings.push("Buffer ainda nao esta pronto neste ambiente local. Em producao, confira BUFFER_API_KEY e BUFFER_PROFILE_IDS.");
    }

    if (!vercelProductionEnv) {
        warnings.push("Nao foi possivel inspecionar automaticamente as envs de production na Vercel.");
    }

    console.log("Papiro Tools readiness check");
    console.log(`Projeto: ${root}`);
    console.log(`.env.local: ${fs.existsSync(envPath) ? "encontrado" : "nao encontrado"}`);

    printSection("Resumo", [
        `- faltando: ${missing.length}`,
        `- alertas: ${warnings.length}`,
        `- schema supabase: ${fs.existsSync(schemaPath) ? "ok" : "faltando"}`,
        `- painel /ops: ${fs.existsSync(opsIndexPath) ? "ok" : "faltando"}`,
        `- supabase runtime: ${supabaseValidation.ok ? "ok" : "falhou"}`,
        `- gemini runtime: ${geminiValidation.ok ? "ok" : "falhou"}`,
        `- mercado pago runtime: ${mercadoPagoValidation.ok ? "ok" : "falhou"}`,
        `- openai app/mcp runtime: ${openAiValidation.ok ? "ok" : "pendente"}`,
        `- google auth runtime: ${googleAuthValidation.ok ? "ok" : "pendente"}`,
        `- google ads runtime: ${googleAdsValidation.ok ? "ok" : "pendente"}`,
        `- meta ads runtime: ${metaAdsValidation.ok ? "ok" : "pendente"}`,
        `- buffer runtime: ${bufferValidation.ok ? "ok" : "pendente"}`
    ]);

    printSection("Pendencias", missing.length
        ? missing.map((item) => `- ${item}`)
        : ["- nenhuma pendencia obrigatoria detectada no arquivo .env.local"]);

    printSection("Alertas", warnings.length
        ? warnings.map((item) => `- ${item}`)
        : ["- nenhum alerta extra"]);

    printSection("Runtime checks", [
        `- Supabase tabelas criticas: ${supabaseValidation.ok ? "ok" : "falhou"}`,
        `- Gemini provider: ${geminiValidation.ok ? `ok (${geminiValidation.status})` : `falhou (${geminiValidation.status})`}`,
        `- Mercado Pago provider: ${mercadoPagoValidation.ok ? `ok (${mercadoPagoValidation.status})` : `falhou (${mercadoPagoValidation.status})`}`,
        `- OpenAI app/MCP: ${openAiValidation.ok ? `ok (app ${openAiValidation.appStatus}, mcp ${openAiValidation.mcpStatus})` : "pendente"}`,
        `- Google Auth: ${googleAuthValidation.ok ? googleAuthValidation.status : `falhou (${googleAuthValidation.status})`}`,
        `- Google Ads: ${googleAdsValidation.ok ? googleAdsValidation.status : "pendente"}`,
        `- Meta Ads: ${metaAdsValidation.ok ? `ok (${metaAdsValidation.status})` : "pendente"}`,
        `- Buffer: ${bufferValidation.ok ? `ok (${bufferValidation.status})` : `pendente (${bufferValidation.status})`}`
    ]);

    printSection("Conectores de divulgacao", [
        `- Canva Pro: ${marketingConnectors.canvaPro ? "pronto" : "revisar"}`,
        `- Buffer: ${marketingConnectors.buffer ? "pronto" : "pendente"}`,
        `- Canva IA 2.0 preview: ${canvaAi2Validation.ok ? `pagina acessivel (${canvaAi2Validation.status})` : `indisponivel (${canvaAi2Validation.status})`}`,
        "- Meta Business Suite: uso manual quando precisar"
    ]);

    if (vercelProductionEnv) {
        printSection("Vercel production env", Object.entries(vercelProductionEnv).map(([key, value]) => `- ${key}: ${value ? "set" : "missing"}`));
    }

    printSection("Passos locais", [
        "- rodar o app com `vercel dev` para servir site + /api no mesmo processo",
        "- configurar `GOOGLE_CLIENT_ID` e `PAPIRO_TOOLS_AUTH_SECRET` antes de testar login real",
        "- validar `POST /api/premium/ai-generate` com fixture controlada",
        "- abrir /ops/ depois de configurar OPS_PANEL_PASSWORD",
        "- tratar qualquer item pendente de OpenAI / Google Ads / Meta Ads como bloqueio externo real"
    ]);

    process.exit(missing.length ? 1 : 0);
}

main().catch((error) => {
    console.error(error && error.message ? error.message : String(error));
    process.exit(1);
});

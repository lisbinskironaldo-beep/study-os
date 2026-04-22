const { sendJson, readJsonBody } = require("../_lib/json");
const {
    getPremiumStatus,
    sanitizeCustomerId,
    sanitizePaymentId,
    reconcilePaymentById
} = require("../_lib/premium-entitlements");
const { readAppSession } = require("../_lib/auth-session");
const { getPrimaryOpsState } = require("../_lib/ops-service");
const { isGeminiConfigured } = require("../_lib/gemini");
const { isSupabaseConfigured, supabaseRequest } = require("../_lib/supabase");

const REQUIRED_SCHEMA_TABLES = [
    "premium_checkout_sessions",
    "premium_entitlements",
    "premium_study_library_items",
    "premium_study_growth_events",
    "premium_study_ops_alerts",
    "northstar_change_requests",
    "northstar_review_runs",
    "northstar_audit_log"
];

let schemaCache = {
    checkedAt: 0,
    ready: false
};

function getCustomerIdFromRequest(req, body = {}) {
    const host = req.headers.host || "localhost";
    const url = new URL(req.url || "/", `https://${host}`);

    return sanitizeCustomerId(
        url.searchParams.get("customerId") ||
        body.customerId ||
        body.customer_id ||
        ""
    );
}

function getPaymentIdFromRequest(req, body = {}) {
    const host = req.headers.host || "localhost";
    const url = new URL(req.url || "/", `https://${host}`);

    return sanitizePaymentId(
        url.searchParams.get("paymentId") ||
        body.paymentId ||
        body.payment_id ||
        ""
    );
}

async function getSchemaReady() {
    if (!isSupabaseConfigured()) {
        return false;
    }

    const now = Date.now();
    if (schemaCache.checkedAt && now - schemaCache.checkedAt < 60 * 1000) {
        return schemaCache.ready;
    }

    const results = await Promise.all(REQUIRED_SCHEMA_TABLES.map((table) => supabaseRequest(`${table}?select=*&limit=1`)));
    const ready = results.every((result) => result.ok);

    schemaCache = {
        checkedAt: now,
        ready
    };

    return ready;
}

module.exports = async function handler(req, res) {
    if (req.method === "OPTIONS") {
        res.setHeader("Allow", "GET, POST, OPTIONS");
        return sendJson(res, 204, {});
    }

    if (req.method !== "GET" && req.method !== "POST") {
        res.setHeader("Allow", "GET, POST, OPTIONS");
        return sendJson(res, 405, {
            ok: false,
            status: "method_not_allowed",
            message: "Use GET ou POST para consultar o status premium."
        });
    }

    let body = {};

    if (req.method === "POST") {
        try {
            body = await readJsonBody(req);
        } catch (error) {
            return sendJson(res, 400, {
                ok: false,
                status: "invalid_json",
                message: "Corpo da requisicao invalido."
            });
        }
    }

    const requestedCustomerId = getCustomerIdFromRequest(req, body);
    const paymentId = getPaymentIdFromRequest(req, body);
    const authSession = readAppSession(req);
    const userId = authSession.ok
        ? authSession.payload.userId
        : "";
    const userEmail = authSession.ok
        ? authSession.payload.email
        : "";
    const reconciliation = paymentId
        ? await reconcilePaymentById(paymentId)
        : null;
    const customerId = requestedCustomerId
        || (reconciliation && reconciliation.customerId)
        || "";
    const [status, opsState, schemaReady] = await Promise.all([
        getPremiumStatus({
            customerId,
            userId,
            userEmail
        }),
        getPrimaryOpsState(),
        getSchemaReady()
    ]);
    const premiumLike = Boolean(status && status.premiumActive);
    const generationPaused = premiumLike
        ? Boolean(opsState.lanes && opsState.lanes.premiumLanePaused)
        : Boolean(opsState.lanes && opsState.lanes.freeLanePaused);
    const aiModel = String(process.env.ROTANOTA_AI_MODEL || process.env.GEMINI_MODEL || "gemini-2.5-flash-lite").trim();

    return sendJson(res, status.ok ? 200 : 400, {
        ...status,
        customerId,
        userId,
        paymentId,
        reconciliation,
        authenticated: authSession.ok,
        user: authSession.ok
            ? {
                userId: authSession.payload.userId,
                email: authSession.payload.email,
                name: authSession.payload.name,
                picture: authSession.payload.picture
            }
            : null,
        aiAvailable: isGeminiConfigured(),
        aiModel,
        schemaReady,
        generationPaused,
        lanes: opsState.lanes,
        opsThresholds: opsState.thresholds
    });
};

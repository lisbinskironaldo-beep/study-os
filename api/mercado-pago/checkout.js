const MERCADO_PAGO_PREFERENCES_URL = "https://api.mercadopago.com/checkout/preferences";

const PLAN_CONFIG = {
    premium_monthly: {
        id: "premium_monthly",
        title: "RotaNota Premium mensal",
        description: "Biblioteca premium, PDFs maiores, treinos extras e continuidade dos estudos.",
        priceEnv: "MERCADO_PAGO_MONTHLY_PRICE"
    },
    premium_annual: {
        id: "premium_annual",
        title: "RotaNota Premium anual",
        description: "Acesso premium anual com continuidade, biblioteca e treinos extras.",
        priceEnv: "MERCADO_PAGO_ANNUAL_PRICE"
    }
};

function sendJson(res, statusCode, payload) {
    res.statusCode = statusCode;
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    res.end(JSON.stringify(payload));
}

async function readJsonBody(req) {
    if (req.body && typeof req.body === "object") {
        return req.body;
    }

    const chunks = [];

    for await (const chunk of req) {
        chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
    }

    const rawBody = Buffer.concat(chunks).toString("utf8");

    if (!rawBody.trim()) {
        return {};
    }

    return JSON.parse(rawBody);
}

function getOrigin(req) {
    const forwardedProto = req.headers["x-forwarded-proto"];
    const proto = Array.isArray(forwardedProto)
        ? forwardedProto[0]
        : forwardedProto || "https";
    const host = req.headers["x-forwarded-host"] || req.headers.host;

    return host ? `${proto}://${host}` : "";
}

function parsePrice(value) {
    const normalized = String(value || "").replace(",", ".").trim();
    const price = Number.parseFloat(normalized);

    if (!Number.isFinite(price) || price <= 0) {
        return null;
    }

    return Math.round(price * 100) / 100;
}

function getBackUrl(name, origin) {
    const envValue = process.env[name];

    if (envValue) {
        return envValue;
    }

    return origin
        ? `${origin}/index.html?premiumPayment=${name.split("_").at(-2).toLowerCase()}`
        : "";
}

function getNotificationUrl(origin) {
    if (process.env.MERCADO_PAGO_NOTIFICATION_URL) {
        return process.env.MERCADO_PAGO_NOTIFICATION_URL;
    }

    if (origin && origin.startsWith("https://")) {
        return `${origin}/api/mercado-pago/webhook`;
    }

    return "";
}

module.exports = async function handler(req, res) {
    if (req.method === "OPTIONS") {
        res.setHeader("Allow", "POST, OPTIONS");
        return sendJson(res, 204, {});
    }

    if (req.method !== "POST") {
        res.setHeader("Allow", "POST, OPTIONS");
        return sendJson(res, 405, {
            ok: false,
            status: "method_not_allowed",
            message: "Use POST para iniciar o checkout."
        });
    }

    const accessToken = process.env.MERCADO_PAGO_ACCESS_TOKEN;

    if (!accessToken) {
        return sendJson(res, 500, {
            ok: false,
            status: "missing_access_token",
            message: "Configure MERCADO_PAGO_ACCESS_TOKEN no ambiente do servidor."
        });
    }

    let body;

    try {
        body = await readJsonBody(req);
    } catch (error) {
        return sendJson(res, 400, {
            ok: false,
            status: "invalid_json",
            message: "Corpo da requisicao invalido."
        });
    }

    const plan = PLAN_CONFIG[body.planId] || PLAN_CONFIG.premium_monthly;
    const unitPrice = parsePrice(process.env[plan.priceEnv]);

    if (!unitPrice) {
        return sendJson(res, 500, {
            ok: false,
            status: "missing_plan_price",
            message: `Configure ${plan.priceEnv} no ambiente do servidor. Exemplo: 19.90`
        });
    }

    const origin = process.env.STUDY_OS_BASE_URL || getOrigin(req);
    const successUrl = getBackUrl("MERCADO_PAGO_SUCCESS_URL", origin);
    const failureUrl = getBackUrl("MERCADO_PAGO_FAILURE_URL", origin);
    const pendingUrl = getBackUrl("MERCADO_PAGO_PENDING_URL", origin);
    const notificationUrl = getNotificationUrl(origin);
    const currencyId = process.env.MERCADO_PAGO_CURRENCY || "BRL";
    const context = body.context && typeof body.context === "object"
        ? body.context
        : {};

    const preference = {
        items: [
            {
                id: plan.id,
                title: plan.title,
                description: plan.description,
                quantity: 1,
                currency_id: currencyId,
                unit_price: unitPrice
            }
        ],
        back_urls: {
            success: successUrl,
            failure: failureUrl,
            pending: pendingUrl
        },
        auto_return: "approved",
        external_reference: `study_os:${plan.id}:${Date.now()}`,
        metadata: {
            plan_id: plan.id,
            feature: context.feature || "",
            source_step: context.sourceStep || ""
        },
        statement_descriptor: "ROTANOTA"
    };

    if (notificationUrl) {
        preference.notification_url = notificationUrl;
    }

    let mercadoPagoResponse;
    let mercadoPagoPayload;

    try {
        mercadoPagoResponse = await fetch(MERCADO_PAGO_PREFERENCES_URL, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(preference)
        });

        mercadoPagoPayload = await mercadoPagoResponse.json();
    } catch (error) {
        return sendJson(res, 502, {
            ok: false,
            status: "provider_unreachable",
            message: "Nao foi possivel falar com o Mercado Pago agora."
        });
    }

    if (!mercadoPagoResponse.ok) {
        return sendJson(res, 502, {
            ok: false,
            status: "provider_error",
            message: "Mercado Pago recusou a criacao do checkout.",
            details: mercadoPagoPayload && mercadoPagoPayload.message
                ? mercadoPagoPayload.message
                : mercadoPagoPayload
        });
    }

    const checkoutUrl = accessToken.startsWith("TEST-")
        ? mercadoPagoPayload.sandbox_init_point || mercadoPagoPayload.init_point
        : mercadoPagoPayload.init_point || mercadoPagoPayload.sandbox_init_point;

    if (!checkoutUrl) {
        return sendJson(res, 502, {
            ok: false,
            status: "missing_checkout_url",
            message: "Mercado Pago criou a preferencia, mas nao retornou URL de checkout."
        });
    }

    return sendJson(res, 200, {
        ok: true,
        status: "checkout_created",
        provider: "mercado_pago",
        planId: plan.id,
        preferenceId: mercadoPagoPayload.id,
        checkoutUrl
    });
};

const crypto = require("crypto");
const { sendJson } = require("../_lib/json");
const { applyPaymentToEntitlement } = require("../_lib/premium-entitlements");

async function readRawBody(req) {
    const chunks = [];

    for await (const chunk of req) {
        chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
    }

    return Buffer.concat(chunks).toString("utf8");
}

function parseSignature(headerValue) {
    return String(headerValue || "")
        .split(",")
        .map((part) => part.trim().split("="))
        .reduce((acc, [key, value]) => {
            if (key && value) {
                acc[key] = value;
            }
            return acc;
        }, {});
}

function getQueryDataId(req, body) {
    const host = req.headers.host || "localhost";
    const url = new URL(req.url || "/", `https://${host}`);
    const queryDataId = url.searchParams.get("data.id");
    const bodyDataId = body && body.data && body.data.id
        ? body.data.id
        : body && body.id
            ? body.id
            : "";
    const dataId = String(queryDataId || bodyDataId || "");

    return /[a-z]/i.test(dataId) ? dataId.toLowerCase() : dataId;
}

function timingSafeEqualHex(left, right) {
    if (!left || !right || left.length !== right.length) {
        return false;
    }

    return crypto.timingSafeEqual(Buffer.from(left, "hex"), Buffer.from(right, "hex"));
}

function verifyMercadoPagoSignature(req, body) {
    const secret = process.env.MERCADO_PAGO_WEBHOOK_SECRET;

    if (!secret) {
        return {
            ok: false,
            skipped: true,
            message: "MERCADO_PAGO_WEBHOOK_SECRET ainda nao configurado."
        };
    }

    const signature = parseSignature(req.headers["x-signature"]);
    const requestId = req.headers["x-request-id"];
    const dataId = getQueryDataId(req, body);

    if (!signature.ts || !signature.v1 || !requestId || !dataId) {
        return {
            ok: false,
            skipped: false,
            message: "Assinatura Mercado Pago incompleta."
        };
    }

    const manifest = `id:${dataId};request-id:${requestId};ts:${signature.ts};`;
    const expected = crypto
        .createHmac("sha256", secret)
        .update(manifest)
        .digest("hex");

    return {
        ok: timingSafeEqualHex(expected, signature.v1),
        skipped: false,
        dataId,
        message: "Assinatura verificada."
    };
}

async function fetchPayment(paymentId) {
    const accessToken = process.env.MERCADO_PAGO_ACCESS_TOKEN;

    if (!accessToken || !paymentId) {
        return null;
    }

    const response = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    });

    if (!response.ok) {
        return null;
    }

    return response.json();
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
            message: "Use POST para receber webhooks."
        });
    }

    const rawBody = await readRawBody(req);
    let body = {};

    try {
        body = rawBody.trim() ? JSON.parse(rawBody) : {};
    } catch (error) {
        return sendJson(res, 400, {
            ok: false,
            status: "invalid_json",
            message: "Webhook com JSON invalido."
        });
    }

    const signature = verifyMercadoPagoSignature(req, body);

    if (!signature.ok && !signature.skipped) {
        return sendJson(res, 401, {
            ok: false,
            status: "invalid_signature",
            message: signature.message
        });
    }

    const eventType = body.type || body.topic || "";
    const action = body.action || "";
    const paymentId = body && body.data && body.data.id
        ? body.data.id
        : "";
    const payment = eventType === "payment" && paymentId
        ? await fetchPayment(paymentId)
        : null;
    const premiumActivation = payment
        ? await applyPaymentToEntitlement(payment)
        : {
            ok: false,
            skipped: true,
            status: "payment_not_loaded"
        };

    return sendJson(res, 200, {
        ok: true,
        status: "webhook_received",
        signature: signature.skipped ? "not_configured" : "valid",
        eventType,
        action,
        paymentId,
        paymentStatus: payment ? payment.status : null,
        premiumActivation
    });
};

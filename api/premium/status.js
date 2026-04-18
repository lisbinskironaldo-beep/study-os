const { sendJson, readJsonBody } = require("../_lib/json");
const { getPremiumStatus, sanitizeCustomerId } = require("../_lib/premium-entitlements");

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

    const customerId = getCustomerIdFromRequest(req, body);
    const status = await getPremiumStatus(customerId);

    return sendJson(res, status.ok ? 200 : 400, {
        ...status,
        customerId
    });
};

const checkoutHandler = require("./_lib/handlers/mercado-pago/checkout");
const webhookHandler = require("./_lib/handlers/mercado-pago/webhook");
const { sendJson } = require("./_lib/json");

function getRoutePath(req) {
    const url = new URL(req.url || "/", `https://${req.headers.host || "localhost"}`);
    const routeFromQuery = url.searchParams.get("route");

    if (routeFromQuery) {
        return String(routeFromQuery).replace(/^\/+|\/+$/g, "");
    }

    const prefix = "/api/mercado-pago/";
    const pathname = url.pathname.startsWith(prefix)
        ? url.pathname.slice(prefix.length)
        : "";

    return pathname.replace(/^\/+|\/+$/g, "");
}

module.exports = async function handler(req, res) {
    const routePath = getRoutePath(req);

    if (routePath === "checkout") {
        return checkoutHandler(req, res);
    }

    if (routePath === "webhook") {
        return webhookHandler(req, res);
    }

    return sendJson(res, 404, {
        ok: false,
        status: "not_found"
    });
};

const googleHandler = require("./_lib/handlers/auth/google");
const logoutHandler = require("./_lib/handlers/auth/logout");
const sessionHandler = require("./_lib/handlers/auth/session");
const { sendJson } = require("./_lib/json");

function getRoutePath(req) {
    const url = new URL(req.url || "/", `https://${req.headers.host || "localhost"}`);
    const routeFromQuery = url.searchParams.get("route");

    if (routeFromQuery) {
        return String(routeFromQuery).replace(/^\/+|\/+$/g, "");
    }

    const prefix = "/api/auth/";
    const pathname = url.pathname.startsWith(prefix)
        ? url.pathname.slice(prefix.length)
        : "";

    return pathname.replace(/^\/+|\/+$/g, "");
}

module.exports = async function handler(req, res) {
    const routePath = getRoutePath(req);

    if (routePath === "google") {
        return googleHandler(req, res);
    }

    if (routePath === "logout") {
        return logoutHandler(req, res);
    }

    if (routePath === "session") {
        return sessionHandler(req, res);
    }

    return sendJson(res, 404, {
        ok: false,
        status: "not_found"
    });
};

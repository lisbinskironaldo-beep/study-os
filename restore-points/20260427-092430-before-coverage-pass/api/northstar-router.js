const appManifestHandler = require("./_lib/handlers/northstar/app-manifest");
const mcpHandler = require("./_lib/handlers/northstar/mcp");
const { sendJson } = require("./_lib/json");

function getRoutePath(req) {
    const url = new URL(req.url || "/", `https://${req.headers.host || "localhost"}`);
    const routeFromQuery = url.searchParams.get("route");

    if (routeFromQuery) {
        return String(routeFromQuery).replace(/^\/+|\/+$/g, "");
    }

    if (url.pathname.endsWith("/api/northstar-app-manifest")) {
        return "app-manifest";
    }

    if (url.pathname.endsWith("/api/northstar-mcp")) {
        return "mcp";
    }

    return "";
}

module.exports = async function handler(req, res) {
    const routePath = getRoutePath(req);

    if (routePath === "app-manifest") {
        return appManifestHandler(req, res);
    }

    if (routePath === "mcp") {
        return mcpHandler(req, res);
    }

    return sendJson(res, 404, {
        ok: false,
        status: "not_found"
    });
};

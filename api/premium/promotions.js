const { sendJson } = require("../_lib/json");
const { getActivePromotion } = require("../_lib/ops-service");

module.exports = async function handler(req, res) {
    if (req.method === "OPTIONS") {
        res.setHeader("Allow", "GET, OPTIONS");
        return sendJson(res, 204, {});
    }

    if (req.method !== "GET") {
        res.setHeader("Allow", "GET, OPTIONS");
        return sendJson(res, 405, {
            ok: false,
            status: "method_not_allowed"
        });
    }

    const url = new URL(req.url || "/", `https://${req.headers.host || "localhost"}`);
    const surface = url.searchParams.get("surface") || "premium_checkout";
    const feature = url.searchParams.get("feature") || "";
    const promotion = await getActivePromotion(surface, feature);

    return sendJson(res, 200, {
        ok: true,
        promotion
    });
};

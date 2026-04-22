const { sendJson, readJsonBody } = require("../_lib/json");
const { recordGrowthEvent } = require("../_lib/ops-service");

module.exports = async function handler(req, res) {
    if (req.method === "OPTIONS") {
        res.setHeader("Allow", "POST, OPTIONS");
        return sendJson(res, 204, {});
    }

    if (req.method !== "POST") {
        res.setHeader("Allow", "POST, OPTIONS");
        return sendJson(res, 405, {
            ok: false,
            status: "method_not_allowed"
        });
    }

    let body = {};

    try {
        body = await readJsonBody(req);
    } catch (error) {
        return sendJson(res, 400, {
            ok: false,
            status: "invalid_json"
        });
    }

    const result = await recordGrowthEvent({
        ...body,
        referrer: body.referrer || req.headers.referer || ""
    });

    return sendJson(res, result.ok ? 200 : 202, {
        ok: Boolean(result.ok),
        status: result.ok ? "event_recorded" : "event_skipped"
    });
};

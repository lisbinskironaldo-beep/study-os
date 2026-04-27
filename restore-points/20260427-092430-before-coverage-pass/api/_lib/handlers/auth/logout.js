const { sendJson } = require("../../json");
const { clearAppSession } = require("../../auth-session");

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
            message: "Use POST para encerrar a sessao."
        });
    }

    clearAppSession(req, res);

    return sendJson(res, 200, {
        ok: true,
        status: "logged_out"
    });
};

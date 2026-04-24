const { sendJson, readJsonBody } = require("../../json");
const { setAppSession } = require("../../auth-session");
const { exchangeGoogleCredential } = require("../../google-auth");
const { getPremiumStatus } = require("../../premium-entitlements");

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
            message: "Use POST para concluir o login Google."
        });
    }

    let body = {};

    try {
        body = await readJsonBody(req);
    } catch (_error) {
        return sendJson(res, 400, {
            ok: false,
            status: "invalid_json",
            message: "Corpo da requisicao invalido."
        });
    }

    const result = await exchangeGoogleCredential(
        body.credential || body.idToken || "",
        {
            customerId: body.customerId || ""
        }
    );

    if (!result.ok || !result.user) {
        return sendJson(res, 401, {
            ok: false,
            status: result.status || "google_login_failed",
            message: result.message || "Nao foi possivel validar o login Google."
        });
    }

    setAppSession(req, res, result.user);

    const premiumStatus = await getPremiumStatus({
        userId: result.user.userId,
        userEmail: result.user.email,
        customerId: result.customerId || ""
    });

    return sendJson(res, 200, {
        ok: true,
        status: "authenticated",
        user: {
            userId: result.user.userId,
            provider: result.user.provider,
            email: result.user.email,
            name: result.user.name,
            picture: result.user.picture
        },
        customerId: result.customerId || "",
        premiumActive: Boolean(premiumStatus.premiumActive),
        accessTier: premiumStatus.accessTier || "free",
        subscriptionStatus: premiumStatus.subscriptionStatus || "registered_free"
    });
};

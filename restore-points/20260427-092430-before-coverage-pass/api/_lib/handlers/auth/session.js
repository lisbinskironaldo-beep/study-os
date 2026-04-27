const { sendJson } = require("../../json");
const { readAppSession } = require("../../auth-session");
const { isGoogleAuthConfigured, getGoogleClientId } = require("../../google-auth");
const { findPrimaryCustomer } = require("../../user-accounts");
const { getPremiumStatus } = require("../../premium-entitlements");

module.exports = async function handler(req, res) {
    if (req.method === "OPTIONS") {
        res.setHeader("Allow", "GET, OPTIONS");
        return sendJson(res, 204, {});
    }

    if (req.method !== "GET") {
        res.setHeader("Allow", "GET, OPTIONS");
        return sendJson(res, 405, {
            ok: false,
            status: "method_not_allowed",
            message: "Use GET para consultar a sessao."
        });
    }

    const session = readAppSession(req);
    const googleClientId = getGoogleClientId();
    const googleConfigured = isGoogleAuthConfigured();

    if (!session.ok) {
        return sendJson(res, 200, {
            ok: true,
            authenticated: false,
            googleConfigured,
            googleClientId,
            user: null,
            customerId: "",
            premiumActive: false,
            accessTier: "free",
            subscriptionStatus: "guest"
        });
    }

    const primaryCustomer = await findPrimaryCustomer(
        session.payload.userId
    );
    const premiumStatus = await getPremiumStatus({
        userId: session.payload.userId,
        userEmail: session.payload.email,
        customerId: primaryCustomer && primaryCustomer.customer_id
            ? primaryCustomer.customer_id
            : ""
    });

    return sendJson(res, 200, {
        ok: true,
        authenticated: true,
        googleConfigured,
        googleClientId,
        user: {
            userId: session.payload.userId,
            provider: session.payload.provider,
            providerUserId: session.payload.providerUserId,
            email: session.payload.email,
            name: session.payload.name,
            picture: session.payload.picture
        },
        customerId: primaryCustomer && primaryCustomer.customer_id
            ? primaryCustomer.customer_id
            : "",
        premiumActive: Boolean(premiumStatus.premiumActive),
        accessTier: premiumStatus.accessTier || "free",
        subscriptionStatus: premiumStatus.subscriptionStatus || "registered_free"
    });
};

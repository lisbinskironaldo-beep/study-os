const crypto = require("crypto");
const {
    parseCookies,
    serializeCookie,
    appendSetCookie
} = require("./cookies");
const { sanitizeUserId } = require("./user-accounts");

const APP_SESSION_COOKIE = "rotanota_app_session";
const APP_SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 30;

function getAppAuthSecret() {
    return String(
        process.env.PAPIRO_TOOLS_AUTH_SECRET ||
        process.env.ROTANOTA_AUTH_SECRET ||
        process.env.OPS_SESSION_SECRET ||
        process.env.SUPABASE_SERVICE_ROLE_KEY ||
        ""
    ).trim();
}

function createSignature(value) {
    const secret = getAppAuthSecret();

    if (!secret) {
        return "";
    }

    return crypto
        .createHmac("sha256", secret)
        .update(value)
        .digest("hex");
}

function createSessionPayload(user = {}) {
    return {
        exp: Date.now() + (APP_SESSION_MAX_AGE_SECONDS * 1000),
        userId: sanitizeUserId(user.userId || ""),
        provider: String(user.provider || "google").trim() || "google",
        providerUserId: String(user.providerUserId || "").trim(),
        email: String(user.email || "").trim(),
        name: String(user.name || "").trim(),
        picture: String(user.picture || "").trim()
    };
}

function shouldUseSecureCookies(req) {
    const forwardedProto = String(
        req && req.headers
            ? req.headers["x-forwarded-proto"] || ""
            : ""
    ).toLowerCase();
    const host = String(
        req && req.headers
            ? req.headers.host || ""
            : ""
    ).toLowerCase();

    if (forwardedProto === "https") {
        return true;
    }

    if (
        host.includes("localhost") ||
        host.startsWith("127.0.0.1")
    ) {
        return false;
    }

    return process.env.NODE_ENV === "production";
}

function createSessionToken(user = {}) {
    const payload = createSessionPayload(user);
    const encoded = Buffer.from(
        JSON.stringify(payload)
    ).toString("base64url");
    const signature = createSignature(encoded);

    return `${encoded}.${signature}`;
}

function readAppSession(req) {
    const cookies = parseCookies(req);
    const token = cookies[APP_SESSION_COOKIE] || "";

    if (!token || !token.includes(".")) {
        return {
            ok: false,
            reason: "missing_session"
        };
    }

    const [encoded, signature] = token.split(".");
    const expected = createSignature(encoded);

    if (!expected || !signature || expected !== signature) {
        return {
            ok: false,
            reason: "invalid_signature"
        };
    }

    let payload;

    try {
        payload = JSON.parse(
            Buffer.from(encoded, "base64url").toString("utf8")
        );
    } catch (_error) {
        return {
            ok: false,
            reason: "invalid_payload"
        };
    }

    if (
        !payload ||
        !payload.exp ||
        payload.exp < Date.now() ||
        !sanitizeUserId(payload.userId)
    ) {
        return {
            ok: false,
            reason: "expired"
        };
    }

    return {
        ok: true,
        payload
    };
}

function setAppSession(req, res, user = {}) {
    appendSetCookie(
        res,
        serializeCookie(
            APP_SESSION_COOKIE,
            createSessionToken(user),
            {
                maxAge: APP_SESSION_MAX_AGE_SECONDS,
                path: "/",
                sameSite: "Lax",
                secure: shouldUseSecureCookies(req)
            }
        )
    );
}

function clearAppSession(req, res) {
    appendSetCookie(
        res,
        serializeCookie(
            APP_SESSION_COOKIE,
            "",
            {
                maxAge: 0,
                expires: new Date(0),
                path: "/",
                sameSite: "Lax",
                secure: shouldUseSecureCookies(req)
            }
        )
    );
}

module.exports = {
    APP_SESSION_COOKIE,
    APP_SESSION_MAX_AGE_SECONDS,
    getAppAuthSecret,
    readAppSession,
    setAppSession,
    clearAppSession
};

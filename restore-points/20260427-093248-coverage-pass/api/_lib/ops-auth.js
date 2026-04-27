const crypto = require("crypto");
const { parseCookies, serializeCookie, appendSetCookie } = require("./cookies");
const { sendJson } = require("./json");

const OPS_SESSION_COOKIE = "rotanota_ops_session";
const OPS_SESSION_MAX_AGE_SECONDS = 60 * 60 * 10;

function normalizeSecret(value) {
    return String(value || "").trim();
}

function getOpsSecret() {
    return normalizeSecret(process.env.OPS_SESSION_SECRET || process.env.OPS_PANEL_PASSWORD || "");
}

function createSignature(value) {
    const secret = getOpsSecret();

    if (!secret) {
        return "";
    }

    return crypto
        .createHmac("sha256", secret)
        .update(value)
        .digest("hex");
}

function timingSafeEqual(left, right) {
    if (!left || !right || left.length !== right.length) {
        return false;
    }

    return crypto.timingSafeEqual(
        Buffer.from(left, "utf8"),
        Buffer.from(right, "utf8")
    );
}

function verifyPassword(candidate) {
    const expected = normalizeSecret(process.env.OPS_PANEL_PASSWORD || "");
    const provided = normalizeSecret(candidate || "");

    if (!expected || !provided || expected.length !== provided.length) {
        return false;
    }

    return timingSafeEqual(expected, provided);
}

function createSessionToken() {
    const payload = {
        exp: Date.now() + (OPS_SESSION_MAX_AGE_SECONDS * 1000),
        role: "ops"
    };
    const encoded = Buffer.from(JSON.stringify(payload)).toString("base64url");
    const signature = createSignature(encoded);

    return `${encoded}.${signature}`;
}

function readSession(req) {
    const cookies = parseCookies(req);
    const token = cookies[OPS_SESSION_COOKIE] || "";

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
        payload = JSON.parse(Buffer.from(encoded, "base64url").toString("utf8"));
    } catch (error) {
        return {
            ok: false,
            reason: "invalid_payload"
        };
    }

    if (!payload || !payload.exp || payload.exp < Date.now()) {
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

function shouldUseSecureCookies(req) {
    const forwardedProto = String(req && req.headers ? req.headers["x-forwarded-proto"] || "" : "").toLowerCase();
    const host = String(req && req.headers ? req.headers.host || "" : "").toLowerCase();

    if (forwardedProto === "https") {
        return true;
    }

    if (host.includes("localhost") || host.startsWith("127.0.0.1")) {
        return false;
    }

    return process.env.NODE_ENV === "production";
}

function setOpsSession(req, res) {
    appendSetCookie(
        res,
        serializeCookie(OPS_SESSION_COOKIE, createSessionToken(), {
            maxAge: OPS_SESSION_MAX_AGE_SECONDS,
            path: "/",
            sameSite: "Lax",
            secure: shouldUseSecureCookies(req)
        })
    );
}

function clearOpsSession(req, res) {
    appendSetCookie(
        res,
        serializeCookie(OPS_SESSION_COOKIE, "", {
            maxAge: 0,
            expires: new Date(0),
            path: "/",
            sameSite: "Lax",
            secure: shouldUseSecureCookies(req)
        })
    );
}

function requireOpsSession(req, res) {
    const session = readSession(req);

    if (session.ok) {
        return session;
    }

    if (res) {
        sendJson(res, 401, {
            ok: false,
            status: "unauthorized",
            message: "Sessao ops invalida ou expirada."
        });
    }

    return session;
}

module.exports = {
    OPS_SESSION_COOKIE,
    verifyPassword,
    createSessionToken,
    readSession,
    setOpsSession,
    clearOpsSession,
    requireOpsSession
};

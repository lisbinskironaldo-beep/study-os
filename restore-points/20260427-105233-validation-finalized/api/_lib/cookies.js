function parseCookies(req) {
    const header = req && req.headers
        ? req.headers.cookie || ""
        : "";

    return String(header || "")
        .split(";")
        .map((part) => part.trim())
        .filter(Boolean)
        .reduce((acc, chunk) => {
            const index = chunk.indexOf("=");
            if (index === -1) {
                return acc;
            }

            const key = chunk.slice(0, index).trim();
            const value = chunk.slice(index + 1).trim();

            if (key) {
                acc[key] = decodeURIComponent(value);
            }

            return acc;
        }, {});
}

function serializeCookie(name, value, options = {}) {
    const parts = [`${name}=${encodeURIComponent(value)}`];

    if (options.maxAge !== undefined) {
        parts.push(`Max-Age=${Math.max(0, Number(options.maxAge) || 0)}`);
    }

    if (options.expires instanceof Date) {
        parts.push(`Expires=${options.expires.toUTCString()}`);
    }

    parts.push(`Path=${options.path || "/"}`);

    if (options.httpOnly !== false) {
        parts.push("HttpOnly");
    }

    if (options.sameSite) {
        parts.push(`SameSite=${options.sameSite}`);
    } else {
        parts.push("SameSite=Lax");
    }

    if (options.secure !== false) {
        parts.push("Secure");
    }

    if (options.domain) {
        parts.push(`Domain=${options.domain}`);
    }

    return parts.join("; ");
}

function appendSetCookie(res, cookieValue) {
    const current = res.getHeader("Set-Cookie");

    if (!current) {
        res.setHeader("Set-Cookie", cookieValue);
        return;
    }

    if (Array.isArray(current)) {
        res.setHeader("Set-Cookie", [...current, cookieValue]);
        return;
    }

    res.setHeader("Set-Cookie", [current, cookieValue]);
}

module.exports = {
    parseCookies,
    serializeCookie,
    appendSetCookie
};

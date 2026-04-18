function getSupabaseConfig() {
    const url = process.env.SUPABASE_URL || "";
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

    return {
        url: url.replace(/\/+$/, ""),
        serviceRoleKey,
        configured: Boolean(url && serviceRoleKey)
    };
}

function isSupabaseConfigured() {
    return getSupabaseConfig().configured;
}

async function supabaseRequest(path, options = {}) {
    const config = getSupabaseConfig();

    if (!config.configured) {
        return {
            ok: false,
            status: 503,
            data: null,
            error: "supabase_not_configured"
        };
    }

    const response = await fetch(`${config.url}/rest/v1/${path.replace(/^\/+/, "")}`, {
        method: options.method || "GET",
        headers: {
            apikey: config.serviceRoleKey,
            Authorization: `Bearer ${config.serviceRoleKey}`,
            "Content-Type": "application/json",
            ...(options.prefer ? { Prefer: options.prefer } : {}),
            ...(options.headers || {})
        },
        body: options.body ? JSON.stringify(options.body) : undefined
    });

    let data = null;
    const text = await response.text();

    if (text) {
        try {
            data = JSON.parse(text);
        } catch (error) {
            data = text;
        }
    }

    return {
        ok: response.ok,
        status: response.status,
        data,
        error: response.ok ? null : data
    };
}

module.exports = {
    getSupabaseConfig,
    isSupabaseConfigured,
    supabaseRequest
};

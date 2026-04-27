const { sendJson, readJsonBody } = require("../../json");
const { readAppSession } = require("../../auth-session");
const { isSupabaseConfigured, supabaseRequest } = require("../../supabase");
const {
    sanitizeStudyLibraryItem,
    mapLibraryItemToSupabase,
    mapLibraryItemFromSupabase
} = require("../../premium-library");

function sanitizeIncomingItems(body = {}) {
    if (Array.isArray(body.items)) {
        return body.items.map(sanitizeStudyLibraryItem).filter(Boolean);
    }

    if (body.item && typeof body.item === "object") {
        return [sanitizeStudyLibraryItem(body.item)];
    }

    if (body.snapshot && typeof body.snapshot === "object") {
        return [sanitizeStudyLibraryItem(body.snapshot)];
    }

    if (body && typeof body === "object" && (body.id || body.materialName || body.snapshot)) {
        return [sanitizeStudyLibraryItem(body)];
    }

    return [];
}

module.exports = async function handler(req, res) {
    if (req.method === "OPTIONS") {
        res.setHeader("Allow", "GET, PUT, OPTIONS");
        return sendJson(res, 204, {});
    }

    if (req.method !== "GET" && req.method !== "PUT") {
        res.setHeader("Allow", "GET, PUT, OPTIONS");
        return sendJson(res, 405, {
            ok: false,
            status: "method_not_allowed"
        });
    }

    const session = readAppSession(req);

    if (!session.ok || !session.payload || !session.payload.userId) {
        return sendJson(res, 401, {
            ok: false,
            status: "auth_required"
        });
    }

    if (!isSupabaseConfigured()) {
        return sendJson(res, 503, {
            ok: false,
            status: "supabase_not_configured"
        });
    }

    const userId = session.payload.userId;

    if (req.method === "GET") {
        const result = await supabaseRequest(`premium_study_library_items?user_id=eq.${encodeURIComponent(userId)}&select=*&order=saved_at.desc`, {
            method: "GET"
        });

        if (!result.ok) {
            return sendJson(res, 502, {
                ok: false,
                status: "library_lookup_failed",
                items: []
            });
        }

        return sendJson(res, 200, {
            ok: true,
            status: "loaded",
            items: Array.isArray(result.data)
                ? result.data.map(mapLibraryItemFromSupabase).filter(Boolean)
                : []
        });
    }

    const body = await readJsonBody(req).catch(() => ({}));
    const items = sanitizeIncomingItems(body);

    if (!items.length) {
        return sendJson(res, 200, {
            ok: true,
            status: "empty",
            items: []
        });
    }

    const payload = items.map((item) => mapLibraryItemToSupabase(item, userId));
    const result = await supabaseRequest("premium_study_library_items", {
        method: "POST",
        prefer: "resolution=merge-duplicates,return=representation",
        headers: {
            "Content-Type": "application/json"
        },
        body: payload
    });

    if (!result.ok) {
        return sendJson(res, 502, {
            ok: false,
            status: "library_upsert_failed",
            items: []
        });
    }

    return sendJson(res, 200, {
        ok: true,
        status: "saved",
        items: Array.isArray(result.data)
            ? result.data.map(mapLibraryItemFromSupabase).filter(Boolean)
            : items
    });
};

const { sendJson, readJsonBody } = require("../../../../json");
const { readAppSession } = require("../../../../auth-session");
const { supabaseRequest, isSupabaseConfigured } = require("../../../../supabase");
const { cleanText, normalizeAiHighlight } = require("../../../../premium-pdf");

function getAssetId(req) {
    if (req.query && req.query.assetId) {
        return cleanText(req.query.assetId);
    }

    const url = String(req.url || "");
    const match = url.match(/\/api\/premium\/pdf-assets\/([^/]+)\/annotations/);
    return match ? decodeURIComponent(match[1]) : "";
}

function sanitizeBody(body = {}, assetId = "") {
    return {
        asset_id: assetId,
        annotation_version: Number(body.version || 1),
        viewer_state: body.viewerState && typeof body.viewerState === "object"
            ? body.viewerState
            : {},
        ai_highlights: Array.isArray(body.aiHighlights)
            ? body.aiHighlights.map(normalizeAiHighlight).filter(Boolean)
            : [],
        manual_annotation_entries: Array.isArray(body.manualAnnotationEntries)
            ? body.manualAnnotationEntries.filter((entry) => entry && entry.key)
            : []
    };
}

module.exports = async function handler(req, res) {
    if (req.method === "OPTIONS") {
        res.setHeader("Allow", "GET, PUT, OPTIONS");
        return sendJson(res, 204, {});
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

    const userId = cleanText(session.payload.userId);
    const assetId = getAssetId(req);

    if (!assetId) {
        return sendJson(res, 400, {
            ok: false,
            status: "missing_asset_id"
        });
    }

    const assetLookup = await supabaseRequest(`premium_pdf_assets?asset_id=eq.${encodeURIComponent(assetId)}&user_id=eq.${encodeURIComponent(userId)}&select=asset_id`, {
        method: "GET"
    });

    if (!assetLookup.ok || !Array.isArray(assetLookup.data) || !assetLookup.data.length) {
        return sendJson(res, 404, {
            ok: false,
            status: "asset_not_found"
        });
    }

    if (req.method === "GET") {
        const record = await supabaseRequest(`premium_pdf_annotations?asset_id=eq.${encodeURIComponent(assetId)}&select=*`, {
            method: "GET"
        });

        if (!record.ok) {
            return sendJson(res, 200, {
                ok: true,
                status: "empty",
                annotationRecord: null
            });
        }

        const annotation = Array.isArray(record.data) && record.data.length
            ? record.data[0]
            : null;

        return sendJson(res, 200, {
            ok: true,
            status: annotation ? "loaded" : "empty",
            annotationRecord: annotation
                ? {
                    assetId: annotation.asset_id,
                    version: annotation.annotation_version || 1,
                    viewerState: annotation.viewer_state || {},
                    aiHighlights: annotation.ai_highlights || [],
                    manualAnnotationEntries: annotation.manual_annotation_entries || [],
                    updatedAt: annotation.updated_at || new Date().toISOString()
                }
                : null
        });
    }

    if (req.method !== "PUT") {
        res.setHeader("Allow", "GET, PUT, OPTIONS");
        return sendJson(res, 405, {
            ok: false,
            status: "method_not_allowed"
        });
    }

    const body = await readJsonBody(req).catch(() => ({}));
    const payload = sanitizeBody(body, assetId);
    const upsert = await supabaseRequest("premium_pdf_annotations", {
        method: "POST",
        prefer: "resolution=merge-duplicates,return=representation",
        headers: {
            "Content-Type": "application/json"
        },
        body: payload
    });

    if (!upsert.ok) {
        return sendJson(res, 502, {
            ok: false,
            status: "annotation_upsert_failed"
        });
    }

    return sendJson(res, 200, {
        ok: true,
        status: "saved"
    });
};

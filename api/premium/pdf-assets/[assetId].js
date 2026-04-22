const { sendJson } = require("../../_lib/json");
const { readAppSession } = require("../../_lib/auth-session");
const { supabaseRequest, supabaseStorageRequest, isSupabaseConfigured } = require("../../_lib/supabase");
const { cleanText } = require("../../_lib/premium-pdf");

function getAssetId(req) {
    if (req.query && req.query.assetId) {
        return cleanText(req.query.assetId);
    }

    const url = String(req.url || "");
    const match = url.match(/\/api\/premium\/pdf-assets\/([^/?]+)/);
    return match ? decodeURIComponent(match[1]) : "";
}

module.exports = async function handler(req, res) {
    if (req.method === "OPTIONS") {
        res.setHeader("Allow", "GET, OPTIONS");
        return sendJson(res, 204, {});
    }

    if (req.method !== "GET") {
        res.setHeader("Allow", "GET, OPTIONS");
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

    const assetId = getAssetId(req);

    if (!assetId) {
        return sendJson(res, 400, {
            ok: false,
            status: "missing_asset_id"
        });
    }

    const userId = cleanText(session.payload.userId);
    const lookup = await supabaseRequest(`premium_pdf_assets?asset_id=eq.${encodeURIComponent(assetId)}&user_id=eq.${encodeURIComponent(userId)}&select=*`, {
        method: "GET"
    });

    if (!lookup.ok || !Array.isArray(lookup.data) || !lookup.data.length) {
        return sendJson(res, 404, {
            ok: false,
            status: "asset_not_found"
        });
    }

    const asset = lookup.data[0];
    const file = await supabaseStorageRequest(`object/${asset.storage_bucket}/${asset.storage_path}`, {
        method: "GET",
        responseType: "arrayBuffer"
    });

    if (!file.ok || !file.data) {
        return sendJson(res, 404, {
            ok: false,
            status: "file_not_found"
        });
    }

    res.statusCode = 200;
    res.setHeader("Content-Type", asset.mime_type || "application/pdf");
    res.setHeader("Content-Disposition", `inline; filename="${asset.file_name || "material.pdf"}"`);
    res.end(Buffer.from(file.data));
};

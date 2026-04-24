const { sendJson } = require("../../../json");
const { readAppSession } = require("../../../auth-session");
const { supabaseRequest, supabaseStorageRequest, isSupabaseConfigured } = require("../../../supabase");
const { PDF_BUCKET, buildAssetId, buildStoragePath, readBinaryBody, cleanText } = require("../../../premium-pdf");

module.exports = async function handler(req, res) {
    if (req.method === "OPTIONS") {
        res.setHeader("Allow", "POST, OPTIONS");
        return sendJson(res, 204, {});
    }

    if (req.method !== "POST") {
        res.setHeader("Allow", "POST, OPTIONS");
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

    const userId = cleanText(session.payload.userId);
    const fileName = decodeURIComponent(String(req.headers["x-rotanota-file-name"] || "material.pdf"));
    const assetHash = cleanText(req.headers["x-rotanota-asset-hash"]);
    const assetId = buildAssetId(req.headers["x-rotanota-asset-id"] || assetHash, fileName);
    const mimeType = cleanText(req.headers["content-type"], "application/pdf");
    const pageCount = Number(req.headers["x-rotanota-page-count"] || 0) || 0;
    const customerId = cleanText(req.headers["x-rotanota-customer-id"]);
    const fileBuffer = await readBinaryBody(req);

    if (!fileBuffer.length) {
        return sendJson(res, 400, {
            ok: false,
            status: "empty_file"
        });
    }

    const storagePath = buildStoragePath(userId, assetId);
    const upload = await supabaseStorageRequest(`object/${PDF_BUCKET}/${storagePath}`, {
        method: "POST",
        contentType: mimeType,
        headers: {
            "x-upsert": "true"
        },
        body: fileBuffer
    });

    if (!upload.ok) {
        return sendJson(res, 502, {
            ok: false,
            status: "storage_upload_failed",
            message: "Nao foi possivel sincronizar o PDF original agora."
        });
    }

    const metadata = {
        asset_id: assetId,
        asset_hash: assetHash || assetId,
        user_id: userId,
        customer_id: customerId,
        file_name: fileName,
        mime_type: mimeType,
        byte_size: fileBuffer.length,
        page_count: pageCount,
        storage_bucket: PDF_BUCKET,
        storage_path: storagePath
    };
    const upsert = await supabaseRequest("premium_pdf_assets", {
        method: "POST",
        prefer: "resolution=merge-duplicates,return=representation",
        headers: {
            "Content-Type": "application/json"
        },
        body: metadata
    });

    if (!upsert.ok) {
        return sendJson(res, 502, {
            ok: false,
            status: "metadata_upsert_failed",
            message: "O PDF foi enviado, mas nao consegui salvar os metadados."
        });
    }

    return sendJson(res, 200, {
        ok: true,
        status: "stored",
        assetId,
        assetHash: assetHash || assetId,
        sourceUrl: `/api/premium/pdf-assets/${encodeURIComponent(assetId)}`
    });
};

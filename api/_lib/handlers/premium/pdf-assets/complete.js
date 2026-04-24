const { sendJson, readJsonBody } = require("../../../../json");
const { readAppSession } = require("../../../../auth-session");
const { supabaseRequest, isSupabaseConfigured } = require("../../../../supabase");
const { PDF_BUCKET, buildAssetId, buildStoragePath, cleanText } = require("../../../../premium-pdf");

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
            status: "auth_required",
            message: "Entre na sua conta para concluir o sync premium do PDF."
        });
    }

    if (!isSupabaseConfigured()) {
        return sendJson(res, 503, {
            ok: false,
            status: "supabase_not_configured",
            message: "O armazenamento premium ainda nao esta configurado."
        });
    }

    let body = {};

    try {
        body = await readJsonBody(req);
    } catch (_error) {
        return sendJson(res, 400, {
            ok: false,
            status: "invalid_json",
            message: "Nao consegui ler os metadados do PDF premium."
        });
    }

    const userId = cleanText(session.payload.userId);
    const fileName = cleanText(body.fileName, "material.pdf");
    const assetHash = cleanText(body.assetHash || body.materialHash);
    const assetId = buildAssetId(cleanText(body.assetId || assetHash), fileName);
    const mimeType = cleanText(body.mimeType, "application/pdf");
    const byteSize = Number(body.byteSize || 0) || 0;
    const pageCount = Number(body.pageCount || 0) || 0;
    const customerId = cleanText(body.customerId);
    const storagePath = cleanText(body.storagePath, buildStoragePath(userId, assetId));
    const metadata = {
        asset_id: assetId,
        asset_hash: assetHash || assetId,
        user_id: userId,
        customer_id: customerId,
        file_name: fileName,
        mime_type: mimeType,
        byte_size: byteSize,
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
        storagePath,
        sourceUrl: `/api/premium/pdf-assets/${encodeURIComponent(assetId)}`
    });
};

const { sendJson, readJsonBody } = require("../../../../json");
const { readAppSession } = require("../../../../auth-session");
const { getSupabaseConfig, supabaseStorageRequest, isSupabaseConfigured } = require("../../../../supabase");
const { PDF_BUCKET, buildAssetId, buildStoragePath, cleanText } = require("../../../../premium-pdf");

const MAX_DIRECT_PDF_BYTES = 12 * 1024 * 1024;

async function ensureBucketExists() {
    const bucketCheck = await supabaseStorageRequest(`bucket/${encodeURIComponent(PDF_BUCKET)}`, {
        method: "GET"
    });

    if (bucketCheck.ok) {
        return {
            ok: true,
            status: "bucket_ready"
        };
    }

    if (Number(bucketCheck.status || 0) !== 404) {
        return {
            ok: false,
            status: "bucket_lookup_failed",
            message: "Nao consegui verificar o bucket premium do PDF."
        };
    }

    const bucketCreate = await supabaseStorageRequest("bucket", {
        method: "POST",
        contentType: "application/json",
        body: JSON.stringify({
            name: PDF_BUCKET,
            public: false,
            file_size_limit: MAX_DIRECT_PDF_BYTES,
            allowed_mime_types: ["application/pdf"]
        })
    });

    if (bucketCreate.ok || Number(bucketCreate.status || 0) === 409) {
        return {
            ok: true,
            status: bucketCreate.ok ? "bucket_created" : "bucket_exists"
        };
    }

    return {
        ok: false,
        status: "bucket_create_failed",
        message: "Nao consegui preparar o bucket premium do PDF."
    };
}

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
            message: "Entre na sua conta para preparar o upload premium do PDF."
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
            message: "Nao consegui ler os dados do upload premium."
        });
    }

    const fileName = cleanText(body.fileName, "material.pdf");
    const assetHash = cleanText(body.assetHash || body.materialHash);
    const assetId = buildAssetId(cleanText(body.assetId || assetHash), fileName);
    const mimeType = cleanText(body.mimeType, "application/pdf");
    const byteSize = Number(body.byteSize || 0) || 0;
    const pageCount = Number(body.pageCount || 0) || 0;
    const userId = cleanText(session.payload.userId);
    const storagePath = buildStoragePath(userId, assetId);

    if (!byteSize) {
        return sendJson(res, 400, {
            ok: false,
            status: "missing_byte_size",
            message: "Nao recebi o tamanho do PDF premium."
        });
    }

    if (byteSize > MAX_DIRECT_PDF_BYTES) {
        return sendJson(res, 413, {
            ok: false,
            status: "pdf_too_large_for_premium_text",
            message: "Este PDF ainda ficou grande demais para a conversao premium automatica.",
            maxDirectPdfBytes: MAX_DIRECT_PDF_BYTES
        });
    }

    const bucketReady = await ensureBucketExists();

    if (!bucketReady.ok) {
        return sendJson(res, 502, {
            ok: false,
            status: bucketReady.status || "bucket_unavailable",
            message: bucketReady.message || "Nao consegui preparar o bucket premium do PDF."
        });
    }

    const signed = await supabaseStorageRequest(`object/upload/sign/${PDF_BUCKET}/${storagePath}`, {
        method: "POST",
        headers: {
            "x-upsert": "true"
        }
    });

    const signedData = signed.data && typeof signed.data === "object"
        ? signed.data
        : null;
    const relativeUrl = signedData && signedData.url
        ? cleanText(signedData.url)
        : "";

    if (!signed.ok || !relativeUrl) {
        return sendJson(res, 502, {
            ok: false,
            status: "signed_upload_url_failed",
            message: "Nao consegui preparar o upload direto do PDF premium."
        });
    }

    const config = getSupabaseConfig();
    const signedUrl = `${config.url}/storage/v1${relativeUrl}`;
    const signedUrlObject = new URL(signedUrl);
    const token = signedUrlObject.searchParams.get("token") || "";

    return sendJson(res, 200, {
        ok: true,
        status: "upload_url_created",
        assetId,
        assetHash: assetHash || assetId,
        bucket: PDF_BUCKET,
        storagePath,
        signedUrl,
        token,
        fileName,
        mimeType,
        byteSize,
        pageCount
    });
};

const { sendJson, readJsonBody } = require("../../json");
const { callGeminiJsonWithParts, isGeminiConfigured } = require("../../gemini");
const { readAppSession } = require("../../auth-session");
const { supabaseRequest, supabaseStorageRequest, isSupabaseConfigured } = require("../../supabase");

const PROMPT_VERSION = "rotanota-pdf-text-v1";
const DEFAULT_MODEL = process.env.ROTANOTA_PDF_TEXT_AI_MODEL || "gemini-2.5-flash-lite";
const FALLBACK_MODEL = process.env.ROTANOTA_PDF_TEXT_AI_FALLBACK_MODEL || "gemini-2.5-flash";
const MAX_INLINE_PDF_BYTES = 3 * 1024 * 1024;
const MAX_SERVER_PDF_BYTES = 12 * 1024 * 1024;
const MAX_PAGE_IMAGES = 16;
const MAX_PAGE_IMAGE_BYTES = 450 * 1024;
const MAX_PAGE_IMAGES_TOTAL_BYTES = 3600 * 1024;
const MAX_HINT_CHARS = 6000;

function cleanText(value, fallback = "") {
    return String(value || fallback).trim();
}

function cleanWarningList(items) {
    return Array.isArray(items)
        ? items.map((item) => cleanText(item)).filter(Boolean).slice(0, 8)
        : [];
}

function normalizeExtractedText(value) {
    return String(value || "")
        .replace(/\r/g, "")
        .replace(/[ \t]+\n/g, "\n")
        .replace(/\n{3,}/g, "\n\n")
        .trim();
}

function toBase64(bufferLike) {
    const buffer = Buffer.isBuffer(bufferLike)
        ? bufferLike
        : Buffer.from(bufferLike || []);

    return buffer.toString("base64");
}

function buildPrompt(body = {}) {
    const pageCount = Number(body.pageCount || 0) || 0;
    const extractedHint = cleanText(body.localExtractedText).slice(0, MAX_HINT_CHARS);
    const imageCount = Array.isArray(body.pageImages) ? body.pageImages.length : 0;

    return [
        "Voce e um extrator fiel de PDF para estudo.",
        "Sua tarefa e transcrever o documento em texto editavel, e nao resumir.",
        "Regras obrigatorias:",
        "- preserve titulos, subtitulos, listas, numeracao, artigos, incisos e paragrafos",
        "- use marcadores de pagina no formato 'Pagina N: ...' quando fizer sentido",
        "- nao invente trechos que nao aparecem no documento",
        "- corrija apenas erros obvios de OCR quando a leitura visual deixar isso claro",
        "- nao adicione comentarios, explicacoes ou observacoes fora do JSON",
        "- se alguma parte estiver ilegivel, registre isso em warnings e siga com o restante",
        "",
        `Material: ${cleanText(body.materialName, "material.pdf")}`,
        `Paginas esperadas: ${pageCount || "nao informado"}`,
        imageCount ? `Paginas renderizadas como imagem para OCR visual: ${imageCount}` : "",
        "",
        extractedHint
            ? `Texto local parcial para apoio (nao trate como fonte unica):\n${extractedHint}`
            : "Nao ha texto local confiavel. Leia o PDF visualmente.",
        "",
        "Devolva a transcricao mais fiel e completa possivel para alimentar um editor de texto."
    ].join("\n");
}

function buildSchema() {
    return [
        "{",
        '  "text": "string",',
        '  "pageCount": 12,',
        '  "quality": "full",',
        '  "warnings": ["string"]',
        "}"
    ].join("\n");
}

async function callGeminiPdfExtraction(body = {}) {
    const attemptedModels = [];
    let lastResult = {
        ok: false,
        status: "not_started"
    };
    const prompt = buildPrompt(body);
    const parts = [
        {
            text: prompt
        }
    ];
    const images = normalizePageImages(body.pageImages);

    if (body.pdfBase64) {
        parts.push({
            inlineData: {
                mimeType: "application/pdf",
                data: body.pdfBase64
            }
        });
    } else {
        images.forEach((image) => {
            parts.push({
                text: `Pagina ${image.pageNumber}:`
            });
            parts.push({
                inlineData: {
                    mimeType: image.mimeType,
                    data: image.data
                }
            });
        });
    }

    for (const model of [DEFAULT_MODEL, FALLBACK_MODEL]) {
        if (!model || attemptedModels.includes(model)) {
            continue;
        }

        attemptedModels.push(model);
        const result = await callGeminiJsonWithParts({
            model,
            parts,
            schemaInstruction: buildSchema(),
            temperature: 0.1,
            maxOutputTokens: 24000
        });

        lastResult = {
            ...result,
            model
        };

        if (result.ok) {
            break;
        }

        if (result.status === "not_configured") {
            break;
        }
    }

    return {
        ...lastResult,
        attemptedModels
    };
}

function normalizePageImages(items) {
    if (!Array.isArray(items)) {
        return [];
    }

    const images = [];
    let totalBytes = 0;

    for (const item of items.slice(0, MAX_PAGE_IMAGES)) {
        const data = cleanText(item && item.data);
        const mimeType = cleanText(item && item.mimeType, "image/jpeg");

        if (!data || !/^image\/(jpeg|jpg|png|webp)$/i.test(mimeType)) {
            continue;
        }

        const byteSize = Math.ceil((data.length * 3) / 4);

        if (byteSize > MAX_PAGE_IMAGE_BYTES || totalBytes + byteSize > MAX_PAGE_IMAGES_TOTAL_BYTES) {
            continue;
        }

        totalBytes += byteSize;
        images.push({
            pageNumber: Number(item && item.pageNumber) || images.length + 1,
            mimeType: mimeType.toLowerCase() === "image/jpg" ? "image/jpeg" : mimeType,
            data,
            byteSize
        });
    }

    return images;
}

async function loadPdfBase64FromServerAsset(assetId, req) {
    const session = readAppSession(req);

    if (!session.ok || !session.payload || !session.payload.userId) {
        return {
            ok: false,
            status: "auth_required",
            message: "Entre na sua conta para usar a conversao premium deste PDF."
        };
    }

    if (!isSupabaseConfigured()) {
        return {
            ok: false,
            status: "supabase_not_configured",
            message: "O armazenamento premium ainda nao esta configurado."
        };
    }

    const userId = cleanText(session.payload.userId);
    const lookup = await supabaseRequest(`premium_pdf_assets?asset_id=eq.${encodeURIComponent(assetId)}&user_id=eq.${encodeURIComponent(userId)}&select=*`, {
        method: "GET"
    });

    if (!lookup.ok || !Array.isArray(lookup.data) || !lookup.data.length) {
        return {
            ok: false,
            status: "asset_not_found",
            message: "Ainda nao encontrei o PDF sincronizado para a leitura premium."
        };
    }

    const asset = lookup.data[0];
    const file = await supabaseStorageRequest(`object/${asset.storage_bucket}/${asset.storage_path}`, {
        method: "GET",
        responseType: "arrayBuffer"
    });

    if (!file.ok || !file.data) {
        return {
            ok: false,
            status: "file_not_found",
            message: "Nao consegui baixar o PDF original do armazenamento premium."
        };
    }

    const byteSize = Number(asset.byte_size || (file.data && file.data.byteLength) || 0) || 0;

    if (byteSize > MAX_SERVER_PDF_BYTES) {
        return {
            ok: false,
            status: "pdf_too_large_for_premium_text",
            message: "Este PDF ainda ficou grande demais para a conversao premium automatica.",
            maxServerPdfBytes: MAX_SERVER_PDF_BYTES
        };
    }

    return {
        ok: true,
        status: "loaded",
        byteSize,
        pdfBase64: toBase64(file.data)
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

    let body = {};

    try {
        body = await readJsonBody(req);
    } catch (error) {
        return sendJson(res, 400, {
            ok: false,
            status: "invalid_json",
            message: "Corpo da requisicao invalido."
        });
    }

    if (!isGeminiConfigured()) {
        return sendJson(res, 503, {
            ok: false,
            status: "not_configured",
            message: "Gemini nao esta configurado para extrair texto do PDF.",
            promptVersion: PROMPT_VERSION
        });
    }

    const materialName = cleanText(body.materialName, "material.pdf");
    let pdfBase64 = cleanText(body.pdfBase64);
    let byteSize = Number(body.byteSize || 0) || 0;
    const assetId = cleanText(body.assetId);
    const pageImages = normalizePageImages(body.pageImages);

    if (pdfBase64 && byteSize > MAX_INLINE_PDF_BYTES) {
        pdfBase64 = "";
    }

    if (!pdfBase64 && assetId && !pageImages.length) {
        const remotePdf = await loadPdfBase64FromServerAsset(assetId, req);

        if (!remotePdf.ok) {
            return sendJson(res, 409, {
                ok: false,
                status: remotePdf.status || "asset_load_failed",
                message: remotePdf.message || "Nao consegui preparar o PDF premium agora.",
                promptVersion: PROMPT_VERSION
            });
        }

        pdfBase64 = remotePdf.pdfBase64 || "";
        byteSize = remotePdf.byteSize || byteSize;
    }

    if (!pdfBase64 && !pageImages.length) {
        return sendJson(res, 400, {
            ok: false,
            status: "missing_pdf_data",
            message: "Nao recebi os bytes do PDF nem imagens das paginas para a leitura por IA.",
            promptVersion: PROMPT_VERSION,
            maxInlinePdfBytes: MAX_INLINE_PDF_BYTES
        });
    }

    const result = await callGeminiPdfExtraction({
        ...body,
        materialName,
        pdfBase64,
        pageImages
    });

    if (!result.ok) {
        return sendJson(res, result.httpStatus && result.httpStatus >= 400 ? result.httpStatus : 502, {
            ok: false,
            status: result.status || "generation_failed",
            provider: "gemini",
            providerStatus: result.providerStatus || "",
            model: result.model || DEFAULT_MODEL,
            attemptedModels: result.attemptedModels || [DEFAULT_MODEL],
            promptVersion: PROMPT_VERSION,
            message: "Nao consegui extrair o texto integral com a IA agora."
        });
    }

    const payload = result.data && typeof result.data === "object"
        ? result.data
        : {};
    const text = normalizeExtractedText(payload.text);
    const pageCount = Number(payload.pageCount || body.pageCount || 0) || 0;
    const quality = cleanText(payload.quality, text ? "full" : "empty");
    const warnings = cleanWarningList(payload.warnings);

    if (!text) {
        return sendJson(res, 200, {
            ok: false,
            status: "empty_text",
            provider: "gemini",
            providerStatus: result.providerStatus || "",
            model: result.model || DEFAULT_MODEL,
            attemptedModels: result.attemptedModels || [DEFAULT_MODEL],
            promptVersion: PROMPT_VERSION,
            warnings,
            message: "A IA respondeu, mas nao devolveu texto utilizavel."
        });
    }

    return sendJson(res, 200, {
        ok: true,
        status: "extracted_ai",
        source: pageImages.length ? "ai_page_images" : assetId && !cleanText(body.pdfBase64) ? "ai_server_pdf" : "ai_inline_pdf",
        provider: "gemini",
        providerStatus: result.providerStatus || "",
        model: result.model || DEFAULT_MODEL,
        attemptedModels: result.attemptedModels || [DEFAULT_MODEL],
        promptVersion: PROMPT_VERSION,
        materialName,
        text,
        pageCount,
        quality,
        warnings
    });
};

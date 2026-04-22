const { sendJson, readJsonBody } = require("../../../_lib/json");
const { generatePdfHighlights, cleanText } = require("../../../_lib/premium-pdf");

function getAssetId(req) {
    if (req.query && req.query.assetId) {
        return cleanText(req.query.assetId);
    }

    const url = String(req.url || "");
    const match = url.match(/\/api\/premium\/pdf-assets\/([^/]+)\/ai-highlights/);
    return match ? decodeURIComponent(match[1]) : "";
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

    const body = await readJsonBody(req).catch(() => ({}));
    const result = await generatePdfHighlights({
        ...body,
        assetId: body.assetId || getAssetId(req)
    });

    if (!result.ok) {
        return sendJson(res, 502, {
            ok: false,
            status: result.status || "generation_failed",
            provider: result.provider || "gemini",
            model: result.model || "",
            attemptedModels: result.attemptedModels || [],
            providerStatus: result.providerStatus || "",
            promptVersion: result.promptVersion || "",
            message: "Nao consegui gerar os grifos contextualizados agora."
        });
    }

    return sendJson(res, 200, {
        ok: true,
        status: "generated",
        provider: result.provider,
        model: result.model,
        attemptedModels: result.attemptedModels,
        providerStatus: result.providerStatus,
        promptVersion: result.promptVersion,
        highlights: result.highlights
    });
};

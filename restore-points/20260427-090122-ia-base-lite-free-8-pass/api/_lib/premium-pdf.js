const crypto = require("crypto");
const { callGeminiJson, isRetryableGeminiStatus } = require("./gemini");

const PDF_BUCKET = process.env.PREMIUM_PDF_BUCKET || "premium-pdf-assets";
const PDF_HIGHLIGHT_PROMPT_VERSION = "rotanota-pdf-highlights-v1";
const DEFAULT_MODEL = "gemini-2.5-flash-lite";
const FALLBACK_MODEL = "gemini-2.5-flash-lite";

function cleanText(value, fallback = "") {
    return String(value || fallback)
        .replace(/\s+/g, " ")
        .trim();
}

function asArray(value) {
    return Array.isArray(value) ? value : [];
}

async function readBinaryBody(req) {
    const chunks = [];

    for await (const chunk of req) {
        chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
    }

    return Buffer.concat(chunks);
}

function buildAssetId(assetHash, fileName) {
    const normalizedHash = cleanText(assetHash);

    if (normalizedHash) {
        return normalizedHash;
    }

    return crypto
        .createHash("sha256")
        .update(cleanText(fileName, "material.pdf"))
        .digest("hex");
}

function buildStoragePath(userId, assetId) {
    return `pdf-assets/${cleanText(userId, "guest")}/${assetId}.pdf`;
}

function normalizeAiHighlight(item, index = 0) {
    return {
        id: cleanText(item && item.id, `ai-highlight-${index + 1}`),
        source: item && item.source === "user" ? "user" : "ai",
        pageHint: Number(item && item.pageHint) || 0,
        quote: cleanText(item && item.quote),
        anchor: cleanText(item && item.anchor),
        contextLabel: cleanText(item && item.contextLabel, "Trecho importante"),
        reason: cleanText(item && item.reason, "Trecho relevante para leitura, revisao e prova."),
        importance: cleanText(item && item.importance, "high"),
        colorKey: cleanText(item && (item.colorKey || item.suggestedColor), "gold"),
        dismissed: Boolean(item && item.dismissed)
    };
}

function buildPdfHighlightPrompt(body = {}) {
    const extractedText = cleanText(body.extractedText).slice(0, 18000);
    const blockSummaries = asArray(body.blocks).slice(0, 8).map((block) => [
        `ID: ${cleanText(block.id)}`,
        `Titulo: ${cleanText(block.title)}`,
        `Resumo: ${cleanText(block.summary)}`,
        `Topicos: ${asArray(block.topics).map((item) => cleanText(item)).filter(Boolean).join(", ")}`
    ].join("\n")).join("\n\n");
    const scope = cleanText(body.scope, "all");
    const blockFocus = scope === "block"
        ? `Bloco prioritario: ${cleanText(body.blockTitle)} (${cleanText(body.blockId)})`
        : "Escopo: material inteiro.";

    return [
        "Voce e um assistente especializado em leitura juridica e marcacao de PDF para estudo.",
        "Seu trabalho e escolher trechos realmente importantes do material e devolver apenas JSON valido.",
        "Cada item precisa apontar uma citacao ou ancora textual exata que exista no material.",
        "Nao resuma o documento inteiro. Marque de 5 a 10 trechos no escopo pedido.",
        "Priorize criterios, definicoes, excecoes, passos processuais, prazos, competencias e pontos com alto potencial de prova.",
        "Nao invente paginas. Use pageHint apenas quando a pagina estiver muito clara no texto.",
        "Contexto deve ser curto e util.",
        "",
        `Material: ${cleanText(body.materialName)}`,
        `Prova: ${cleanText(body.examDate)}`,
        `Meta: ${cleanText(body.targetScore)}`,
        `Carga diaria em minutos: ${cleanText(body.dailyMinutes)}`,
        blockFocus,
        "",
        "Blocos da trilha:",
        blockSummaries || "Sem blocos informados.",
        "",
        "Texto extraido do PDF:",
        extractedText || "Sem texto extraido."
    ].join("\n");
}

function buildPdfHighlightSchema() {
    return '{ "highlights": [{ "id": "string", "pageHint": 1, "quote": "string", "anchor": "string", "contextLabel": "string", "reason": "string", "importance": "high", "suggestedColor": "gold" }] }';
}

async function callGeminiWithFallback(input = {}) {
    const attemptedModels = [];
    let lastResult = {
        ok: false,
        status: "not_started"
    };

    for (const currentModel of [DEFAULT_MODEL, FALLBACK_MODEL]) {
        if (!currentModel || attemptedModels.includes(currentModel)) {
            continue;
        }

        attemptedModels.push(currentModel);

        const result = await callGeminiJson({
            model: currentModel,
            prompt: input.prompt,
            schemaInstruction: input.schemaInstruction,
            temperature: typeof input.temperature === "number" ? input.temperature : 0.3
        });

        lastResult = {
            ...result,
            model: currentModel
        };

        if (result.ok || !isRetryableGeminiStatus(result)) {
            break;
        }
    }

    return {
        ...lastResult,
        attemptedModels
    };
}

async function generatePdfHighlights(body = {}) {
    const result = await callGeminiWithFallback({
        prompt: buildPdfHighlightPrompt(body),
        schemaInstruction: buildPdfHighlightSchema(),
        temperature: 0.25
    });

    const highlights = result.ok
        ? asArray(result.data && result.data.highlights)
            .slice(0, 10)
            .map(normalizeAiHighlight)
            .filter((item) => item.quote || item.anchor)
        : [];

    return {
        ok: Boolean(result.ok && highlights.length),
        status: result.ok ? "generated" : (result.status || "generation_failed"),
        provider: "gemini",
        model: result.model || DEFAULT_MODEL,
        attemptedModels: result.attemptedModels || [DEFAULT_MODEL],
        providerStatus: result.providerStatus || "",
        promptVersion: PDF_HIGHLIGHT_PROMPT_VERSION,
        highlights
    };
}

module.exports = {
    PDF_BUCKET,
    PDF_HIGHLIGHT_PROMPT_VERSION,
    buildAssetId,
    buildStoragePath,
    cleanText,
    generatePdfHighlights,
    normalizeAiHighlight,
    readBinaryBody
};

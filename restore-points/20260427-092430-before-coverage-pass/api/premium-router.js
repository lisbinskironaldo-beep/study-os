const aiGenerateHandler = require("./_lib/handlers/premium/ai-generate");
const growthEventHandler = require("./_lib/handlers/premium/growth-event");
const libraryHandler = require("./_lib/handlers/premium/library");
const pdfExtractHandler = require("./_lib/handlers/premium/pdf-extract");
const promotionsHandler = require("./_lib/handlers/premium/promotions");
const statusHandler = require("./_lib/handlers/premium/status");
const pdfAssetsIndexHandler = require("./_lib/handlers/premium/pdf-assets/index");
const pdfAssetsUploadUrlHandler = require("./_lib/handlers/premium/pdf-assets/upload-url");
const pdfAssetsCompleteHandler = require("./_lib/handlers/premium/pdf-assets/complete");
const pdfAssetHandler = require("./_lib/handlers/premium/pdf-assets/[assetId]");
const pdfAssetAiHighlightsHandler = require("./_lib/handlers/premium/pdf-assets/[assetId]/ai-highlights");
const pdfAssetAnnotationsHandler = require("./_lib/handlers/premium/pdf-assets/[assetId]/annotations");
const { sendJson } = require("./_lib/json");

function getRoutePath(req) {
    const url = new URL(req.url || "/", `https://${req.headers.host || "localhost"}`);
    const routeFromQuery = url.searchParams.get("route");

    if (routeFromQuery) {
        return String(routeFromQuery).replace(/^\/+|\/+$/g, "");
    }

    const prefix = "/api/premium/";
    const pathname = url.pathname.startsWith(prefix)
        ? url.pathname.slice(prefix.length)
        : "";

    return pathname.replace(/^\/+|\/+$/g, "");
}

function setAssetId(req, routePath, suffix = "") {
    const normalized = suffix && routePath.endsWith(suffix)
        ? routePath.slice(0, -suffix.length)
        : routePath;
    const assetId = decodeURIComponent(normalized.split("/").pop() || "");

    req.query = {
        ...(req.query || {}),
        assetId
    };
}

module.exports = async function handler(req, res) {
    const routePath = getRoutePath(req);

    if (routePath === "ai-generate") {
        return aiGenerateHandler(req, res);
    }

    if (routePath === "growth-event") {
        return growthEventHandler(req, res);
    }

    if (routePath === "library") {
        return libraryHandler(req, res);
    }

    if (routePath === "pdf-extract") {
        return pdfExtractHandler(req, res);
    }

    if (routePath === "promotions") {
        return promotionsHandler(req, res);
    }

    if (routePath === "status") {
        return statusHandler(req, res);
    }

    if (routePath === "pdf-assets") {
        return pdfAssetsIndexHandler(req, res);
    }

    if (routePath === "pdf-assets/upload-url") {
        return pdfAssetsUploadUrlHandler(req, res);
    }

    if (routePath === "pdf-assets/complete") {
        return pdfAssetsCompleteHandler(req, res);
    }

    if (routePath.endsWith("/ai-highlights") && routePath.startsWith("pdf-assets/")) {
        setAssetId(req, routePath, "/ai-highlights");
        return pdfAssetAiHighlightsHandler(req, res);
    }

    if (routePath.endsWith("/annotations") && routePath.startsWith("pdf-assets/")) {
        setAssetId(req, routePath, "/annotations");
        return pdfAssetAnnotationsHandler(req, res);
    }

    if (routePath.startsWith("pdf-assets/")) {
        setAssetId(req, routePath);
        return pdfAssetHandler(req, res);
    }

    return sendJson(res, 404, {
        ok: false,
        status: "not_found"
    });
};

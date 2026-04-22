import * as pdfjsLib from "../vendor/pdfjs/build/pdf.mjs";
import {
    EventBus,
    PDFFindController,
    PDFLinkService,
    PDFViewer
} from "../vendor/pdfjs/web/pdf_viewer.mjs";

const CHANNEL = "rotanota-premium-pdf-workbench";
const container = document.getElementById("viewerContainer");
const viewer = document.getElementById("viewer");

pdfjsLib.GlobalWorkerOptions.workerSrc = "../vendor/pdfjs/build/pdf.worker.mjs";

const eventBus = new EventBus();
const linkService = new PDFLinkService({ eventBus });
const findController = new PDFFindController({ eventBus, linkService });
const pdfViewer = new PDFViewer({
    container,
    viewer,
    eventBus,
    linkService,
    findController,
    annotationMode: pdfjsLib.AnnotationMode.ENABLE_FORMS,
    annotationEditorMode: pdfjsLib.AnnotationEditorType.NONE,
    textLayerMode: 1
});

linkService.setViewer(pdfViewer);

let pdfDocument = null;
let currentUrl = "";
let aiHighlights = [];
let selectedAiHighlightId = "";

function normalizeText(value) {
    return String(value || "")
        .normalize("NFKD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/\s+/g, " ")
        .trim()
        .toLowerCase();
}

function postResponse(requestId, payload = {}, ok = true, error = "") {
    window.parent.postMessage({
        channel: CHANNEL,
        direction: "response",
        requestId,
        ok,
        error,
        payload
    }, window.location.origin);
}

function postEvent(event, payload = {}) {
    window.parent.postMessage({
        channel: CHANNEL,
        direction: "event",
        event,
        payload
    }, window.location.origin);
}

window.addEventListener("error", (event) => {
    postEvent("viewerError", {
        message: event && event.message ? event.message : "viewer_error"
    });
});

window.addEventListener("unhandledrejection", (event) => {
    const reason = event && event.reason && event.reason.message
        ? event.reason.message
        : String((event && event.reason) || "viewer_unhandled_rejection");
    postEvent("viewerError", {
        message: reason
    });
});

function buildViewerState() {
    return {
        currentPage: Number(pdfViewer.currentPageNumber || 1),
        totalPages: Number(pdfDocument && pdfDocument.numPages ? pdfDocument.numPages : 0),
        zoomValue: String(pdfViewer.currentScaleValue || "page-width"),
        editorMode: getCurrentEditorMode(),
        selectedAiHighlightId
    };
}

function getCurrentEditorMode() {
    const mode = pdfViewer.annotationEditorMode;

    switch (mode) {
    case pdfjsLib.AnnotationEditorType.HIGHLIGHT:
        return "highlight";
    case pdfjsLib.AnnotationEditorType.FREETEXT:
        return "freetext";
    case pdfjsLib.AnnotationEditorType.INK:
        return "ink";
    default:
        return "none";
    }
}

function setEditorMode(mode) {
    const nextMode = {
        highlight: pdfjsLib.AnnotationEditorType.HIGHLIGHT,
        freetext: pdfjsLib.AnnotationEditorType.FREETEXT,
        ink: pdfjsLib.AnnotationEditorType.INK,
        none: pdfjsLib.AnnotationEditorType.NONE
    }[mode] ?? pdfjsLib.AnnotationEditorType.NONE;

    pdfViewer.annotationEditorMode = {
        mode: nextMode
    };

    return buildViewerState();
}

function getPageElement(pageNumber) {
    return viewer.querySelector(`.page[data-page-number="${pageNumber}"]`);
}

function getOverlayLayer(pageElement) {
    let layer = pageElement.querySelector(".pdf-ai-overlay-layer");

    if (!layer) {
        layer = document.createElement("div");
        layer.className = "pdf-ai-overlay-layer";
        pageElement.appendChild(layer);
    }

    return layer;
}

function buildSpanMap(pageElement) {
    const spans = Array.from(pageElement.querySelectorAll(".textLayer span"))
        .map((span) => ({
            span,
            text: normalizeText(span.textContent)
        }))
        .filter((item) => item.text);
    let composite = "";
    const segments = [];

    spans.forEach((item) => {
        if (composite) {
            composite += " ";
        }

        const start = composite.length;
        composite += item.text;
        const end = composite.length;
        segments.push({
            ...item,
            start,
            end
        });
    });

    return {
        composite,
        segments
    };
}

function findQuoteSegments(pageElement, quote) {
    const normalizedQuote = normalizeText(quote);

    if (!normalizedQuote) {
        return [];
    }

    const { composite, segments } = buildSpanMap(pageElement);
    let matchIndex = composite.indexOf(normalizedQuote);

    if (matchIndex < 0) {
        const words = normalizedQuote.split(" ").filter(Boolean);
        const shortened = words.slice(0, Math.min(words.length, 14)).join(" ");
        matchIndex = shortened ? composite.indexOf(shortened) : -1;
    }

    if (matchIndex < 0) {
        return [];
    }

    const endIndex = matchIndex + normalizedQuote.length;
    return segments.filter((item) => item.end > matchIndex && item.start < endIndex);
}

function focusHighlightRect(pageNumber, highlightId) {
    const pageElement = getPageElement(pageNumber);
    const target = pageElement
        ? pageElement.querySelector(`.pdf-ai-highlight[data-highlight-id="${highlightId}"]`)
        : null;

    if (!target) {
        return false;
    }

    target.scrollIntoView({
        behavior: "smooth",
        block: "center"
    });

    return true;
}

function renderAiHighlights() {
    viewer.querySelectorAll(".pdf-ai-overlay-layer").forEach((layer) => {
        layer.innerHTML = "";
    });

    aiHighlights
        .filter((item) => !item.dismissed)
        .forEach((highlight) => {
            const preferredPage = Number(highlight.pageHint || 0);
            const candidatePages = preferredPage
                ? [getPageElement(preferredPage)].filter(Boolean)
                : Array.from(viewer.querySelectorAll(".page[data-page-number]"));
            let matchedPageNumber = preferredPage;
            let matchedSegments = [];
            let matchedPageElement = null;

            candidatePages.some((pageElement) => {
                const targetSegments = findQuoteSegments(pageElement, highlight.quote || highlight.anchor || "");

                if (!targetSegments.length) {
                    return false;
                }

                matchedSegments = targetSegments;
                matchedPageElement = pageElement;
                matchedPageNumber = Number(pageElement.dataset.pageNumber || preferredPage || 0);
                return true;
            });

            if (!matchedPageElement || !matchedSegments.length) {
                return;
            }

            const pageRect = matchedPageElement.getBoundingClientRect();
            const layer = getOverlayLayer(matchedPageElement);

            matchedSegments.forEach((segment) => {
                const rect = segment.span.getBoundingClientRect();
                if (!rect.width || !rect.height) {
                    return;
                }

                const node = document.createElement("button");
                node.type = "button";
                node.className = `pdf-ai-highlight pdf-ai-highlight-${highlight.colorKey || "gold"}${selectedAiHighlightId === highlight.id ? " is-active" : ""}`;
                node.dataset.highlightId = highlight.id;
                node.style.left = `${rect.left - pageRect.left}px`;
                node.style.top = `${rect.top - pageRect.top}px`;
                node.style.width = `${rect.width}px`;
                node.style.height = `${rect.height}px`;
                node.title = highlight.contextLabel || "Trecho grifado por IA";
                node.addEventListener("click", () => {
                    selectedAiHighlightId = highlight.id;
                    renderAiHighlights();
                    postEvent("aiHighlightSelected", {
                        highlightId: highlight.id
                    });
                });
                layer.appendChild(node);
            });

            if (!highlight.pageHint && matchedPageNumber) {
                highlight.pageHint = matchedPageNumber;
            }
        });
}

async function loadDocument(payload = {}) {
    if (currentUrl && currentUrl.startsWith("blob:")) {
        window.URL.revokeObjectURL(currentUrl);
    }

    currentUrl = payload.url || "";

    if (!currentUrl) {
        throw new Error("missing_document_url");
    }

    if (pdfDocument) {
        await pdfViewer.setDocument(null);
        await linkService.setDocument(null);
        pdfDocument = null;
    }

    const task = pdfjsLib.getDocument({
        url: currentUrl,
        enableXfa: false,
        useSystemFonts: true
    });

    pdfDocument = await task.promise;

    if (Array.isArray(payload.annotationEntries) && payload.annotationEntries.length) {
        payload.annotationEntries.forEach((entry) => {
            if (!entry || !entry.key) {
                return;
            }

            pdfDocument.annotationStorage.setValue(entry.key, entry.value || {});
        });
    }

    pdfDocument.annotationStorage.onSetModified = () => {
        postEvent("viewerStateChanged", buildViewerState());
    };
    pdfDocument.annotationStorage.onResetModified = () => {
        postEvent("viewerStateChanged", buildViewerState());
    };

    pdfViewer.setDocument(pdfDocument);
    linkService.setDocument(pdfDocument);
    pdfViewer.currentScaleValue = payload.viewerState && payload.viewerState.zoomValue
        ? payload.viewerState.zoomValue
        : "page-width";
    pdfViewer.currentPageNumber = payload.viewerState && payload.viewerState.currentPage
        ? Number(payload.viewerState.currentPage)
        : 1;
    setEditorMode(payload.viewerState && payload.viewerState.editorMode ? payload.viewerState.editorMode : "none");
    aiHighlights = Array.isArray(payload.aiHighlights) ? payload.aiHighlights : [];
    selectedAiHighlightId = payload.viewerState && payload.viewerState.selectedAiHighlightId
        ? String(payload.viewerState.selectedAiHighlightId)
        : "";
    window.setTimeout(renderAiHighlights, 120);

    return buildViewerState();
}

function exportAnnotations() {
    if (!pdfDocument) {
        return {
            entries: []
        };
    }

    const serializable = pdfDocument.annotationStorage.serializable;
    const map = serializable && serializable.map instanceof Map
        ? serializable.map
        : null;

    return {
        entries: map
            ? Array.from(map.entries()).map(([key, value]) => ({
                key,
                value
            }))
            : []
    };
}

async function handleRequest(type, payload = {}) {
    switch (type) {
    case "ping":
        return {
            ready: true
        };
    case "loadDocument":
        return loadDocument(payload);
    case "find":
        eventBus.dispatch("find", {
            source: window,
            type: "",
            query: payload.query || "",
            caseSensitive: false,
            entireWord: false,
            highlightAll: true,
            findPrevious: false,
            matchDiacritics: false
        });
        return buildViewerState();
    case "setPage":
        pdfViewer.currentPageNumber = Math.max(1, Number(payload.pageNumber || 1));
        return buildViewerState();
    case "setScale":
        pdfViewer.currentScaleValue = payload.value || "page-width";
        return buildViewerState();
    case "changeScale":
        {
            const currentScale = Number(pdfViewer.currentScale || 1);
            const nextScale = payload.direction === "out"
                ? Math.max(0.5, currentScale - 0.15)
                : Math.min(3, currentScale + 0.15);
            pdfViewer.currentScaleValue = String(nextScale.toFixed(2));
        }
        return buildViewerState();
    case "setEditorMode":
        return setEditorMode(payload.mode || "none");
    case "setAiHighlights":
        aiHighlights = Array.isArray(payload.items) ? payload.items : [];
        selectedAiHighlightId = payload.selectedAiHighlightId || selectedAiHighlightId;
        renderAiHighlights();
        return buildViewerState();
    case "selectAiHighlight": {
        selectedAiHighlightId = String(payload.highlightId || "");
        renderAiHighlights();
        const target = aiHighlights.find((item) => item.id === selectedAiHighlightId);
        if (target && target.pageHint) {
            pdfViewer.currentPageNumber = Number(target.pageHint);
            window.setTimeout(() => focusHighlightRect(Number(target.pageHint), selectedAiHighlightId), 120);
        }
        return buildViewerState();
    }
    case "exportAnnotations":
        return exportAnnotations();
    case "getState":
        return buildViewerState();
    default:
        return buildViewerState();
    }
}

window.addEventListener("message", async (event) => {
    const data = event && event.data ? event.data : null;

    if (!data || data.channel !== CHANNEL || data.direction !== "request") {
        return;
    }

    try {
        const payload = await handleRequest(data.type, data.payload || {});
        postResponse(data.requestId, payload, true);
    } catch (error) {
        postResponse(data.requestId, {}, false, error && error.message ? error.message : "viewer_error");
    }
});

eventBus.on("pagesloaded", () => {
    renderAiHighlights();
    postEvent("viewerStateChanged", buildViewerState());
});

eventBus.on("pagerendered", () => {
    renderAiHighlights();
});

eventBus.on("pagechanging", ({ pageNumber }) => {
    postEvent("viewerStateChanged", {
        ...buildViewerState(),
        currentPage: Number(pageNumber || 1)
    });
});

eventBus.on("scalechanging", ({ presetValue }) => {
    postEvent("viewerStateChanged", {
        ...buildViewerState(),
        zoomValue: String(presetValue || pdfViewer.currentScaleValue || "page-width")
    });
});

postEvent("viewerReady", {});

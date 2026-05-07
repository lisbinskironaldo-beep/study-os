(function () {
    if (window.PremiumStudyPdfTextExtractor) {
        return;
    }

    const PDFJS_URL = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js";
    const PDFJS_WORKER_URL = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
    const SCRIPT_ID = "rotanota-pdfjs-script";
    const DEFAULT_MAX_CHARS = 22000;
    const DEFAULT_MAX_PAGES = 24;
    const DEFAULT_RENDER_WIDTH = 1500;
    const DEFAULT_IMAGE_QUALITY = 0.68;

    let loadPromise = null;

    function loadPdfJs() {
        if (window.pdfjsLib) {
            return Promise.resolve(window.pdfjsLib);
        }

        if (loadPromise) {
            return loadPromise;
        }

        loadPromise = new Promise((resolve, reject) => {
            const existing = document.getElementById(SCRIPT_ID);
            if (existing) {
                existing.addEventListener("load", () => resolve(window.pdfjsLib));
                existing.addEventListener("error", reject);
                return;
            }

            const script = document.createElement("script");
            script.id = SCRIPT_ID;
            script.src = PDFJS_URL;
            script.async = true;
            script.onload = () => resolve(window.pdfjsLib);
            script.onerror = () => reject(new Error("pdfjs_load_failed"));
            document.head.appendChild(script);
        }).then((pdfjsLib) => {
            if (!pdfjsLib) {
                throw new Error("pdfjs_unavailable");
            }

            pdfjsLib.GlobalWorkerOptions.workerSrc = PDFJS_WORKER_URL;
            return pdfjsLib;
        });

        return loadPromise;
    }

    async function extractText(file, options = {}) {
        const maxChars = Number(options.maxChars) || DEFAULT_MAX_CHARS;
        const maxPages = Number(options.maxPages) || DEFAULT_MAX_PAGES;

        if (!file) {
            return {
                ok: false,
                status: "missing_file",
                text: ""
            };
        }

        try {
            const pdfjsLib = await loadPdfJs();
            const buffer = await file.arrayBuffer();
            const documentTask = pdfjsLib.getDocument({
                data: new Uint8Array(buffer),
                useWorkerFetch: false,
                isEvalSupported: false
            });
            const pdf = await documentTask.promise;
            const totalPages = Number(pdf.numPages || 0);
            const pageLimit = Math.max(1, Math.min(totalPages || maxPages, maxPages));
            const chunks = [];
            let truncated = false;
            let nonEmptyPages = 0;

            for (let pageNumber = 1; pageNumber <= pageLimit; pageNumber += 1) {
                const page = await pdf.getPage(pageNumber);
                const content = await page.getTextContent();
                const pageText = extractPageText(content.items || []);

                if (pageText) {
                    nonEmptyPages += 1;
                    chunks.push(`Pagina ${pageNumber}: ${pageText}`);
                }

                if (chunks.join("\n\n").length >= maxChars) {
                    truncated = true;
                    break;
                }
            }

            let text = chunks.join("\n\n");
            if (text.length > maxChars) {
                text = text.slice(0, maxChars);
                truncated = true;
            }
            const encodingArtifacts = inspectTextEncodingArtifacts(text);
            const status = text.trim()
                ? encodingArtifacts.hasArtifacts ? "mojibake_text" : "extracted"
                : "empty_text";

            return {
                ok: Boolean(text.trim()),
                status,
                text,
                pageCount: totalPages,
                extractedPages: pageLimit,
                nonEmptyPages,
                hasEncodingArtifacts: encodingArtifacts.hasArtifacts,
                encodingArtifactCount: encodingArtifacts.count,
                quality: encodingArtifacts.hasArtifacts ? "weak_encoding" : "",
                warnings: encodingArtifacts.hasArtifacts
                    ? ["O texto local do PDF parece ter acentos corrompidos; use a leitura assistida por IA."]
                    : [],
                truncated: truncated || text.length >= maxChars
            };
        } catch (error) {
            return {
                ok: false,
                status: error && error.message ? error.message : "extract_failed",
                text: ""
            };
        }
    }

    function extractPageText(items = []) {
        const text = items
            .map((item) => item && item.str ? String(item.str) : "")
            .filter(Boolean)
            .join(" ")
            .replace(/\s+([,.;:!?])/g, "$1")
            .replace(/\s+/g, " ")
            .trim();
        return normalizeLegalIdentifierSpacing(text);
    }

    function normalizeLegalIdentifierSpacing(text = "") {
        return String(text || "")
            .replace(/\b(\d{1,8})\s+(\d{1,8})\s*-\s*(\d{2})\.(\d{4})\.(\d{1,2})\.(\d{2})\.(\d{4})(?:\s*\/\s*([A-Z]{2}))?\b/g, (match, left, right, segment, year, court, state, sequence, suffix) => {
                const first = `${left}${right}`;
                if (first.length < 7 || first.length > 8) {
                    return match;
                }
                return `${first}-${segment}.${year}.${court}.${state}.${sequence}${suffix ? `/${suffix}` : ""}`;
            })
            .replace(/\b(\d{4,8})\s*-\s*(\d{2})\.(\d{4})\.(\d{1,2})\.(\d{2})\.(\d{4})(?:\s*\/\s*([A-Z]{2}))?\b/g, (match, first, segment, year, court, state, sequence, suffix) => {
                return `${first}-${segment}.${year}.${court}.${state}.${sequence}${suffix ? `/${suffix}` : ""}`;
            });
    }

    function inspectTextEncodingArtifacts(value = "") {
        const text = String(value || "");
        const artifactMatches = text.match(/[\u221a\u222b\ufffd\u2044\u02d9\u2021\u00b7\u00a1\u201e\u00ab]/g) || [];
        const knownPattern = /(?:padr\u221ao|cria\u00ab\u221ao|guarni\u00ab\u221ao|execu\u00c1\u201eo|instru\u00c1\u201eo|n\u201eo|ocorr\u00cdncia|formul\u00b7rio|indispon\u00ccvel|a\u00ab[\u2019\u00d5]es)/i;
        const compactLength = text.replace(/\s+/g, "").length || 1;
        const count = artifactMatches.length + (knownPattern.test(text) ? 6 : 0);

        return {
            count,
            ratio: count / compactLength,
            hasArtifacts: Boolean(knownPattern.test(text) || (count >= 6 && count / compactLength >= 0.0005))
        };
    }

    function dataUrlToBase64(dataUrl) {
        const text = String(dataUrl || "");
        const commaIndex = text.indexOf(",");
        return commaIndex >= 0 ? text.slice(commaIndex + 1) : text;
    }

    function estimateBase64Bytes(base64) {
        return Math.ceil((String(base64 || "").length * 3) / 4);
    }

    async function renderPageToImage(page, options = {}) {
        const targetWidth = Number(options.targetWidth || DEFAULT_RENDER_WIDTH) || DEFAULT_RENDER_WIDTH;
        const quality = Number(options.quality || DEFAULT_IMAGE_QUALITY) || DEFAULT_IMAGE_QUALITY;
        const baseViewport = page.getViewport({ scale: 1 });
        const scale = Math.max(0.8, targetWidth / Math.max(1, baseViewport.width));
        const viewport = page.getViewport({ scale });
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d", {
            alpha: false,
            willReadFrequently: false
        });

        canvas.width = Math.ceil(viewport.width);
        canvas.height = Math.ceil(viewport.height);
        context.fillStyle = "#ffffff";
        context.fillRect(0, 0, canvas.width, canvas.height);

        await page.render({
            canvasContext: context,
            viewport
        }).promise;

        const dataUrl = canvas.toDataURL("image/jpeg", quality);
        canvas.width = 0;
        canvas.height = 0;

        return {
            mimeType: "image/jpeg",
            data: dataUrlToBase64(dataUrl)
        };
    }

    async function renderPageImages(file, options = {}) {
        const maxPages = Number(options.maxPages) || 12;
        const maxTotalBytes = Number(options.maxTotalBytes) || (2800 * 1024);
        const maxPageBytes = Number(options.maxPageBytes) || (320 * 1024);

        if (!file) {
            return {
                ok: false,
                status: "missing_file",
                pages: []
            };
        }

        try {
            const pdfjsLib = await loadPdfJs();
            const buffer = await file.arrayBuffer();
            const documentTask = pdfjsLib.getDocument({
                data: new Uint8Array(buffer),
                useWorkerFetch: false,
                isEvalSupported: false
            });
            const pdf = await documentTask.promise;
            const totalPages = Number(pdf.numPages || 0);
            const pageLimit = Math.max(1, Math.min(totalPages || maxPages, maxPages));
            const pages = [];
            let totalBytes = 0;
            let truncated = totalPages > pageLimit;

            for (let pageNumber = 1; pageNumber <= pageLimit; pageNumber += 1) {
                const page = await pdf.getPage(pageNumber);
                let rendered = await renderPageToImage(page, {
                    targetWidth: Number(options.targetWidth || DEFAULT_RENDER_WIDTH),
                    quality: Number(options.quality || DEFAULT_IMAGE_QUALITY)
                });
                let byteSize = estimateBase64Bytes(rendered.data);

                if (byteSize > maxPageBytes) {
                    rendered = await renderPageToImage(page, {
                        targetWidth: 1220,
                        quality: 0.56
                    });
                    byteSize = estimateBase64Bytes(rendered.data);
                }

                if (pages.length && totalBytes + byteSize > maxTotalBytes) {
                    truncated = true;
                    break;
                }

                totalBytes += byteSize;
                pages.push({
                    pageNumber,
                    mimeType: rendered.mimeType,
                    data: rendered.data,
                    byteSize
                });
            }

            return {
                ok: Boolean(pages.length),
                status: pages.length ? "rendered_page_images" : "empty_images",
                pages,
                pageCount: totalPages,
                renderedPages: pages.length,
                byteSize: totalBytes,
                truncated
            };
        } catch (error) {
            return {
                ok: false,
                status: error && error.message ? error.message : "render_images_failed",
                pages: []
            };
        }
    }

    window.PremiumStudyPdfTextExtractor = {
        extractText,
        renderPageImages
    };
})();

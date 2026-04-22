(function () {
    if (window.PremiumStudyPdfTextExtractor) {
        return;
    }

    const PDFJS_URL = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js";
    const PDFJS_WORKER_URL = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
    const SCRIPT_ID = "rotanota-pdfjs-script";
    const DEFAULT_MAX_CHARS = 22000;
    const DEFAULT_MAX_PAGES = 24;

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

            for (let pageNumber = 1; pageNumber <= pageLimit; pageNumber += 1) {
                const page = await pdf.getPage(pageNumber);
                const content = await page.getTextContent();
                const pageText = content.items
                    .map((item) => item && item.str ? item.str : "")
                    .join(" ")
                    .replace(/\s+/g, " ")
                    .trim();

                if (pageText) {
                    chunks.push(`Pagina ${pageNumber}: ${pageText}`);
                }

                if (chunks.join("\n\n").length >= maxChars) {
                    truncated = true;
                    break;
                }
            }

            const text = chunks.join("\n\n").slice(0, maxChars);

            return {
                ok: Boolean(text.trim()),
                status: text.trim() ? "extracted" : "empty_text",
                text,
                pageCount: totalPages,
                extractedPages: pageLimit,
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

    window.PremiumStudyPdfTextExtractor = {
        extractText
    };
})();

(function () {
    if (window.PremiumStudyPdfAiText) {
        return;
    }

    const ENDPOINT = "/api/premium/pdf-extract";
    const MAX_INLINE_PDF_BYTES = 3 * 1024 * 1024;
    const MAX_IMAGE_PAGES = 12;
    const MAX_IMAGE_PAYLOAD_BYTES = 2800 * 1024;

    function blobToBase64(blob) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();

            reader.addEventListener("load", () => {
                const result = String(reader.result || "");
                const commaIndex = result.indexOf(",");
                resolve(commaIndex >= 0 ? result.slice(commaIndex + 1) : result);
            }, { once: true });
            reader.addEventListener("error", () => {
                reject(reader.error || new Error("pdf_base64_failed"));
            }, { once: true });
            reader.readAsDataURL(blob);
        });
    }

    async function requestFallback(payload = {}, file) {
        const blob = file instanceof Blob ? file : null;
        const assetId = String(payload.assetId || payload.pdfAssetId || "").trim();

        if (!blob && !assetId) {
            return {
                ok: false,
                status: "missing_pdf_blob",
                message: "Nao encontrei o PDF para a leitura por IA."
            };
        }

        try {
            const byteSize = Number(blob && blob.size ? blob.size : 0) || 0;
            const useInline = blob && byteSize > 0 && byteSize <= MAX_INLINE_PDF_BYTES;
            const pdfBase64 = useInline
                ? await blobToBase64(blob)
                : "";
            let pageImages = [];
            let imageFallback = null;

            if (!pdfBase64 && blob && window.PremiumStudyPdfTextExtractor && typeof window.PremiumStudyPdfTextExtractor.renderPageImages === "function") {
                imageFallback = await window.PremiumStudyPdfTextExtractor.renderPageImages(blob, {
                    maxPages: Number(payload.pageCount || 0) > 0
                        ? Math.min(MAX_IMAGE_PAGES, Number(payload.pageCount || 0))
                        : MAX_IMAGE_PAGES,
                    maxTotalBytes: MAX_IMAGE_PAYLOAD_BYTES
                });
                pageImages = imageFallback && Array.isArray(imageFallback.pages)
                    ? imageFallback.pages
                    : [];
            }

            const response = await fetch(ENDPOINT, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    materialHash: payload.materialHash || "",
                    materialName: payload.materialName || "",
                    assetId,
                    pageCount: Number(payload.pageCount || 0) || 0,
                    localExtractedText: payload.localExtractedText || "",
                    byteSize,
                    pdfBase64,
                    pageImages,
                    imageFallbackStatus: imageFallback && imageFallback.status ? imageFallback.status : "",
                    renderedPageCount: imageFallback && imageFallback.renderedPages ? imageFallback.renderedPages : 0
                })
            });
            const data = await response.json().catch(() => null);

            return {
                ok: Boolean(response.ok && data && data.ok),
                status: data && data.status ? data.status : response.ok ? "ok" : "request_failed",
                ...data
            };
        } catch (error) {
            return {
                ok: false,
                status: "network_error",
                message: "Nao consegui acionar a leitura por IA agora."
            };
        }
    }

    window.PremiumStudyPdfAiText = {
        ENDPOINT,
        MAX_INLINE_PDF_BYTES,
        MAX_IMAGE_PAGES,
        requestFallback
    };
})();

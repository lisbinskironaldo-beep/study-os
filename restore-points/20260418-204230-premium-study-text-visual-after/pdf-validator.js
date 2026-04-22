(function () {
    if (window.PremiumStudyPdfValidator) {
        return;
    }

    const PDF_HEADER_BYTES = "%PDF";

    function isPdfFile(file) {
        const name = String(file && file.name ? file.name : "").toLowerCase();
        const type = String(file && file.type ? file.type : "").toLowerCase();

        return name.endsWith(".pdf") || type === "application/pdf";
    }

    function countPageMarkers(text) {
        const matches = text.match(/\/Type\s*\/Page\b/g);
        return matches ? matches.length : 0;
    }

    function getLargestCountHint(text) {
        const matches = [...text.matchAll(/\/Count\s+(\d+)/g)]
            .map((match) => Number(match[1]))
            .filter((value) => Number.isFinite(value) && value > 0);

        return matches.length ? Math.max(...matches) : 0;
    }

    async function readPdfInfo(file) {
        const buffer = await file.arrayBuffer();
        const head = new TextDecoder("latin1").decode(buffer.slice(0, 16));

        if (!head.startsWith(PDF_HEADER_BYTES)) {
            return {
                pageCount: 0,
                isPdf: false,
                confidence: "none"
            };
        }

        const text = new TextDecoder("latin1").decode(buffer);
        const markerCount = countPageMarkers(text);
        const countHint = getLargestCountHint(text);
        const pageCount = markerCount || countHint || 0;

        return {
            pageCount,
            isPdf: true,
            confidence: markerCount ? "page-markers" : countHint ? "count-hint" : "unknown"
        };
    }

    async function validate(file, state = {}) {
        if (!file) {
            return {
                ok: false,
                reason: "missing_file",
                message: "Nenhum arquivo foi selecionado."
            };
        }

        if (!isPdfFile(file)) {
            return {
                ok: false,
                reason: "invalid_type",
                message: "Envie um arquivo PDF textual."
            };
        }

        let info;
        try {
            info = await readPdfInfo(file);
        } catch (error) {
            return {
                ok: false,
                reason: "read_error",
                message: "Nao consegui ler este PDF. Tente um arquivo textual mais nitido."
            };
        }

        if (!info.isPdf) {
            return {
                ok: false,
                reason: "invalid_pdf",
                message: "O arquivo selecionado não parece ser um PDF válido."
            };
        }

        const access = window.PremiumStudyAccessControl;
        const limit = access
            ? access.getPlanForState(state).pdfPageLimit
            : 12;
        const pageCount = Number(info.pageCount || 0);

        if (pageCount > limit) {
            return {
                ok: false,
                reason: "page_limit",
                feature: access && access.FEATURES
                    ? access.FEATURES.LARGE_PDF_UPLOAD
                    : "large_pdf_upload",
                pageCount,
                limit,
                message: `Este PDF tem ${pageCount} páginas. No grátis, o limite é de ${limit} páginas.`
            };
        }

        return {
            ok: true,
            pageCount,
            limit,
            confidence: info.confidence
        };
    }

    window.PremiumStudyPdfValidator = {
        validate
    };
})();

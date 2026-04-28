(function () {
    if (window.PremiumStudyPdfValidator) {
        return;
    }

    const PDF_HEADER_BYTES = "%PDF";
    const STUDY_TEXT_EXTENSIONS = [".txt", ".md", ".markdown", ".csv", ".json", ".html", ".htm", ".xml"];
    const STUDY_TEXT_MIME_PREFIXES = ["text/"];
    const STUDY_TEXT_MIME_TYPES = [
        "application/json",
        "application/ld+json",
        "application/xml"
    ];

    function getFileName(file) {
        return String(file && file.name ? file.name : "").toLowerCase();
    }

    function getFileType(file) {
        return String(file && file.type ? file.type : "").toLowerCase();
    }

    function isPdfFile(file) {
        const name = getFileName(file);
        const type = getFileType(file);

        return name.endsWith(".pdf") || type === "application/pdf";
    }

    function isStudyTextFile(file) {
        const name = getFileName(file);
        const type = getFileType(file);

        if (STUDY_TEXT_EXTENSIONS.some((extension) => name.endsWith(extension))) {
            return true;
        }

        if (STUDY_TEXT_MIME_PREFIXES.some((prefix) => type.startsWith(prefix))) {
            return true;
        }

        return STUDY_TEXT_MIME_TYPES.includes(type);
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

    function resolveMode(options = {}) {
        const mode = String(options.mode || "study").trim().toLowerCase();
        return mode === "convert" ? "convert" : "study";
    }

    async function validate(file, state = {}, options = {}) {
        const mode = resolveMode(options);

        if (!file) {
            return {
                ok: false,
                reason: "missing_file",
                message: "Nenhum arquivo foi selecionado."
            };
        }

        if (mode === "convert") {
            if (!isPdfFile(file)) {
                return {
                    ok: false,
                    reason: "invalid_type",
                    kind: "unsupported",
                    message: "Envie um arquivo PDF para converter em texto editavel."
                };
            }
        } else if (!isPdfFile(file) && !isStudyTextFile(file)) {
            return {
                ok: false,
                reason: "invalid_type",
                kind: "unsupported",
                message: "Envie um PDF, TXT, MD, CSV, JSON ou HTML para montar a trilha."
            };
        }

        if (isStudyTextFile(file) && !isPdfFile(file)) {
            return {
                ok: true,
                kind: "text",
                pageCount: 1,
                limit: null,
                confidence: "text-file"
            };
        }

        let info;
        try {
            info = await readPdfInfo(file);
        } catch (error) {
            return {
                ok: false,
                reason: "read_error",
                kind: "pdf",
                message: mode === "convert"
                    ? "Nao consegui ler este PDF agora. Tente outro arquivo."
                    : "Nao consegui ler este material. Tente um PDF textual mais nitido."
            };
        }

        if (!info.isPdf) {
            return {
                ok: false,
                reason: "invalid_pdf",
                kind: "pdf",
                message: "O arquivo selecionado nao parece ser um PDF valido."
            };
        }

        const access = window.PremiumStudyAccessControl;
        const limit = access
            ? access.getPlanForState(state).pdfPageLimit
            : 8;
        const pageCount = Number(info.pageCount || 0);

        if (mode === "study" && pageCount > limit) {
            return {
                ok: false,
                reason: "page_limit",
                kind: "pdf",
                feature: access && access.FEATURES
                    ? access.FEATURES.LARGE_PDF_UPLOAD
                    : "large_pdf_upload",
                pageCount,
                limit,
                message: `Este PDF tem ${pageCount} paginas. No gratis, o limite e de ${limit} paginas.`
            };
        }

        return {
            ok: true,
            kind: "pdf",
            pageCount,
            limit,
            confidence: info.confidence
        };
    }

    window.PremiumStudyPdfValidator = {
        validate,
        isPdfFile,
        isStudyTextFile
    };
})();

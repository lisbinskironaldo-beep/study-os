(function () {
    if (window.PremiumStudyStorage) {
        return;
    }

    const DB_NAME = "premiumStudyLocal";
    const DB_VERSION = 3;
    const DRAFTS_STORE = "drafts";
    const PDF_ASSETS_STORE = "pdfAssets";
    const PDF_ANNOTATIONS_STORE = "pdfAnnotations";
    const TEXT_EXTRACTIONS_STORE = "materialTextExtractions";
    const LATEST_KEY = "latest";
    const SAVED_SUMMARIES_KEY = "saved-summaries";
    const STUDY_LIBRARY_KEY = "study-library";
    let openPromise = null;

    function requestToPromise(request) {
        return new Promise((resolve, reject) => {
            request.addEventListener("success", () => resolve(request.result), { once: true });
            request.addEventListener("error", () => reject(request.error || new Error("Falha no IndexedDB")), { once: true });
        });
    }

    function openDatabase() {
        if (openPromise) {
            return openPromise;
        }

        openPromise = new Promise((resolve, reject) => {
            const request = window.indexedDB.open(DB_NAME, DB_VERSION);

            request.addEventListener("upgradeneeded", () => {
                const db = request.result;

                if (!db.objectStoreNames.contains(DRAFTS_STORE)) {
                    db.createObjectStore(DRAFTS_STORE, { keyPath: "id" });
                }

                if (!db.objectStoreNames.contains(PDF_ASSETS_STORE)) {
                    db.createObjectStore(PDF_ASSETS_STORE, { keyPath: "id" });
                }

                if (!db.objectStoreNames.contains(PDF_ANNOTATIONS_STORE)) {
                    db.createObjectStore(PDF_ANNOTATIONS_STORE, { keyPath: "assetId" });
                }

                if (!db.objectStoreNames.contains(TEXT_EXTRACTIONS_STORE)) {
                    db.createObjectStore(TEXT_EXTRACTIONS_STORE, { keyPath: "materialHash" });
                }
            });

            request.addEventListener("success", () => resolve(request.result), { once: true });
            request.addEventListener("error", () => reject(request.error || new Error("Nao foi possivel abrir o banco local")), { once: true });
        });

        return openPromise;
    }

    async function withStore(storeName, mode, callback) {
        if (!window.indexedDB) {
            return null;
        }

        const db = await openDatabase();
        const transaction = db.transaction(storeName, mode);
        const store = transaction.objectStore(storeName);
        const result = await callback(store);

        await new Promise((resolve, reject) => {
            transaction.addEventListener("complete", () => resolve(), { once: true });
            transaction.addEventListener("error", () => reject(transaction.error || new Error("Falha de transacao")), { once: true });
            transaction.addEventListener("abort", () => reject(transaction.error || new Error("Transacao abortada")), { once: true });
        });

        return result;
    }

    function normalizeDateLabel(dateString) {
        if (!dateString) {
            return "Data nao definida";
        }

        const parts = dateString.split("-");
        if (parts.length !== 3) {
            return dateString;
        }

        return `${parts[2]}/${parts[1]}/${parts[0]}`;
    }

    function sanitizePdfWorkbenchState(input) {
        const state = input && typeof input === "object" ? input : {};

        return {
            currentPage: Number(state.currentPage || 1),
            totalPages: Number(state.totalPages || 0),
            zoomValue: String(state.zoomValue || "page-width"),
            sidebarOpen: Boolean(state.sidebarOpen),
            editorMode: String(state.editorMode || "none"),
            searchQuery: String(state.searchQuery || ""),
            selectedAiHighlightId: String(state.selectedAiHighlightId || ""),
            fullScreen: Boolean(state.fullScreen),
            lastSyncedAt: String(state.lastSyncedAt || "")
        };
    }

    function sanitizeAiHighlight(item, index = 0) {
        if (!item || typeof item !== "object") {
            return null;
        }

        return {
            id: String(item.id || `ai-highlight-${index + 1}`),
            source: item.source === "user" ? "user" : "ai",
            pageHint: Number(item.pageHint || 0) || 0,
            quote: String(item.quote || ""),
            anchor: String(item.anchor || ""),
            contextLabel: String(item.contextLabel || ""),
            reason: String(item.reason || ""),
            importance: String(item.importance || "high"),
            colorKey: String(item.colorKey || item.suggestedColor || "gold"),
            dismissed: Boolean(item.dismissed)
        };
    }

    function buildDraftSummary(snapshot) {
        return {
            id: snapshot.savedDraftId || LATEST_KEY,
            title: snapshot.studyTitle || snapshot.materialName || "Estudo salvo",
            materialName: snapshot.materialName || "Arquivo sem nome",
            examDate: snapshot.examDate || "",
            examDateLabel: normalizeDateLabel(snapshot.examDate),
            targetScore: snapshot.targetScore || 7,
            studyHours: snapshot.studyHours || 1,
            studyMinutes: snapshot.studyMinutes || 0,
            step: snapshot.step || "entry",
            savedAt: snapshot.savedAt || new Date().toISOString(),
            pdfAvailable: Boolean(snapshot.pdfAssetId)
        };
    }

    function sanitizeSnapshot(snapshot) {
        if (!snapshot || typeof snapshot !== "object") {
            return null;
        }

        return {
            step: snapshot.step || "entry",
            returnStep: snapshot.returnStep || "",
            accessTier: snapshot.accessTier || "guest",
            studyTitle: snapshot.studyTitle || "",
            studyLibraryId: snapshot.studyLibraryId || "",
            materialName: snapshot.materialName || "",
            materialHash: snapshot.materialHash || "",
            materialSizeLabel: snapshot.materialSizeLabel || "",
            materialPageCount: snapshot.materialPageCount || 0,
            materialExtractedText: snapshot.materialExtractedText || "",
            materialExtractionStatus: snapshot.materialExtractionStatus || "pending",
            pdfAssetId: snapshot.pdfAssetId || "",
            pdfAssetHash: snapshot.pdfAssetHash || "",
            pdfSource: snapshot.pdfSource || "",
            pdfSyncStatus: snapshot.pdfSyncStatus || "",
            pdfSyncError: snapshot.pdfSyncError || "",
            pdfWorkbenchState: sanitizePdfWorkbenchState(snapshot.pdfWorkbenchState),
            pdfWorkbenchText: snapshot.pdfWorkbenchText || "",
            pdfWorkbenchOriginalText: snapshot.pdfWorkbenchOriginalText || snapshot.pdfWorkbenchText || "",
            pdfWorkbenchHtml: snapshot.pdfWorkbenchHtml || "",
            pdfWorkbenchOriginalHtml: snapshot.pdfWorkbenchOriginalHtml || snapshot.pdfWorkbenchHtml || "",
            aiHighlights: Array.isArray(snapshot.aiHighlights)
                ? snapshot.aiHighlights.map(sanitizeAiHighlight).filter(Boolean)
                : [],
            examDate: snapshot.examDate || "",
            targetScore: snapshot.targetScore || 7,
            studyHours: snapshot.studyHours || 1,
            studyMinutes: snapshot.studyMinutes || 0,
            blocks: Array.isArray(snapshot.blocks) ? snapshot.blocks : [],
            sessions: snapshot.sessions && typeof snapshot.sessions === "object"
                ? snapshot.sessions
                : {},
            activeBlockId: snapshot.activeBlockId || "",
            blockTab: snapshot.blockTab || "aprender",
            blockFullScreen: Boolean(snapshot.blockFullScreen),
            highlightEditorOpen: Boolean(snapshot.highlightEditorOpen),
            highlightEditorFullScreen: Boolean(snapshot.highlightEditorFullScreen),
            blockAssistMode: snapshot.blockAssistMode || "",
            levelExam: snapshot.levelExam && typeof snapshot.levelExam === "object"
                ? snapshot.levelExam
                : null,
            highlightedDocument: snapshot.highlightedDocument && typeof snapshot.highlightedDocument === "object"
                ? snapshot.highlightedDocument
                : null,
            savedSummaries: Array.isArray(snapshot.savedSummaries)
                ? snapshot.savedSummaries
                : [],
            activeSavedSummaryId: snapshot.activeSavedSummaryId || "",
            savedDraftId: snapshot.savedDraftId || "",
            savedAt: snapshot.savedAt || "",
            progressLabel: snapshot.progressLabel || "",
            sessionNote: snapshot.sessionNote && typeof snapshot.sessionNote === "object"
                ? snapshot.sessionNote
                : null,
            premiumOffer: snapshot.premiumOffer && typeof snapshot.premiumOffer === "object"
                ? snapshot.premiumOffer
                : null
        };
    }

    function sanitizeStudyLibraryItem(item) {
        if (!item || typeof item !== "object") {
            return null;
        }

        const snapshot = sanitizeSnapshot(item.snapshot);
        const base = snapshot || item;
        const savedAt = item.savedAt || snapshot?.savedAt || new Date().toISOString();

        return {
            id: item.id || base.studyLibraryId || `library-${Date.now()}`,
            title: item.title || base.studyTitle || base.materialName || "Estudo salvo",
            materialName: item.materialName || base.materialName || "Arquivo sem nome",
            examDate: item.examDate || base.examDate || "",
            examDateLabel: item.examDateLabel || normalizeDateLabel(item.examDate || base.examDate),
            targetScore: item.targetScore ?? base.targetScore ?? 7,
            studyHours: item.studyHours ?? base.studyHours ?? 1,
            studyMinutes: item.studyMinutes ?? base.studyMinutes ?? 0,
            step: item.step || base.step || "entry",
            savedAt,
            pdfAvailable: Boolean(item.pdfAvailable || base.pdfAssetId),
            snapshot
        };
    }

    function buildStudyLibraryRecord(snapshot) {
        const cleanSnapshot = sanitizeSnapshot(snapshot);
        const summary = buildDraftSummary(cleanSnapshot || {});

        return {
            id: cleanSnapshot?.studyLibraryId || `library-${Date.now()}`,
            title: summary.title,
            materialName: summary.materialName,
            examDate: summary.examDate,
            examDateLabel: summary.examDateLabel,
            targetScore: summary.targetScore,
            studyHours: summary.studyHours,
            studyMinutes: summary.studyMinutes,
            step: summary.step,
            savedAt: cleanSnapshot?.savedAt || new Date().toISOString(),
            pdfAvailable: Boolean(cleanSnapshot?.pdfAssetId),
            snapshot: cleanSnapshot
        };
    }

    function sanitizePdfAssetRecord(record) {
        if (!record || typeof record !== "object") {
            return null;
        }

        return {
            id: String(record.id || ""),
            assetHash: String(record.assetHash || record.id || ""),
            fileName: String(record.fileName || "material.pdf"),
            mimeType: String(record.mimeType || "application/pdf"),
            byteSize: Number(record.byteSize || 0),
            pageCount: Number(record.pageCount || 0),
            source: String(record.source || "local"),
            savedAt: String(record.savedAt || new Date().toISOString()),
            blob: record.blob instanceof Blob ? record.blob : null
        };
    }

    function sanitizePdfAnnotationRecord(record) {
        if (!record || typeof record !== "object") {
            return null;
        }

        return {
            assetId: String(record.assetId || ""),
            version: Number(record.version || 1),
            viewerState: sanitizePdfWorkbenchState(record.viewerState),
            aiHighlights: Array.isArray(record.aiHighlights)
                ? record.aiHighlights.map(sanitizeAiHighlight).filter(Boolean)
                : [],
            manualAnnotationEntries: Array.isArray(record.manualAnnotationEntries)
                ? record.manualAnnotationEntries.map((entry) => ({
                    key: String(entry && entry.key ? entry.key : ""),
                    value: entry && typeof entry.value === "object" ? entry.value : {}
                })).filter((entry) => entry.key)
                : [],
            updatedAt: String(record.updatedAt || new Date().toISOString())
        };
    }

    function sanitizeMaterialTextExtractionRecord(record) {
        if (!record || typeof record !== "object") {
            return null;
        }

        return {
            materialHash: String(record.materialHash || ""),
            materialName: String(record.materialName || ""),
            pageCount: Number(record.pageCount || 0) || 0,
            text: String(record.text || ""),
            status: String(record.status || "pending"),
            source: String(record.source || ""),
            quality: String(record.quality || ""),
            warnings: Array.isArray(record.warnings)
                ? record.warnings.map((item) => String(item || "").trim()).filter(Boolean).slice(0, 8)
                : [],
            savedAt: String(record.savedAt || new Date().toISOString())
        };
    }

    window.PremiumStudyStorage = {
        buildDraftSummary,

        async getLatestDraft() {
            try {
                const draft = await withStore(DRAFTS_STORE, "readonly", (store) => requestToPromise(store.get(LATEST_KEY)));
                if (!draft) {
                    return null;
                }

                return {
                    ...draft,
                    snapshot: sanitizeSnapshot(draft.snapshot)
                };
            } catch (error) {
                console.error(error);
                return null;
            }
        },

        async saveLatestDraft(snapshot) {
            if (!snapshot || !snapshot.materialName) {
                return null;
            }

            const cleanSnapshot = sanitizeSnapshot(snapshot);
            const draft = {
                id: LATEST_KEY,
                savedAt: new Date().toISOString(),
                snapshot: cleanSnapshot
            };

            try {
                await withStore(DRAFTS_STORE, "readwrite", (store) => requestToPromise(store.put(draft)));
                return draft;
            } catch (error) {
                console.error(error);
                return null;
            }
        },

        async clearLatestDraft() {
            try {
                await withStore(DRAFTS_STORE, "readwrite", (store) => requestToPromise(store.delete(LATEST_KEY)));
            } catch (error) {
                console.error(error);
            }
        },

        async getStudyLibrary() {
            try {
                const record = await withStore(DRAFTS_STORE, "readonly", (store) => requestToPromise(store.get(STUDY_LIBRARY_KEY)));
                return Array.isArray(record?.items)
                    ? record.items.map(sanitizeStudyLibraryItem).filter(Boolean)
                    : [];
            } catch (error) {
                console.error(error);
                return [];
            }
        },

        async saveStudyLibrary(items) {
            try {
                const nextItems = Array.isArray(items)
                    ? items.map(sanitizeStudyLibraryItem).filter(Boolean)
                    : [];
                const record = {
                    id: STUDY_LIBRARY_KEY,
                    savedAt: new Date().toISOString(),
                    items: nextItems
                };

                await withStore(DRAFTS_STORE, "readwrite", (store) => requestToPromise(store.put(record)));
                return nextItems;
            } catch (error) {
                console.error(error);
                return [];
            }
        },

        async saveStudyLibraryRecord(snapshot) {
            if (!snapshot || !snapshot.materialName) {
                return [];
            }

            try {
                const nextItem = buildStudyLibraryRecord(snapshot);
                const currentItems = await this.getStudyLibrary();
                const nextItems = [
                    nextItem,
                    ...currentItems.filter((item) => item.id !== nextItem.id)
                ];
                const record = {
                    id: STUDY_LIBRARY_KEY,
                    savedAt: new Date().toISOString(),
                    items: nextItems
                };

                await withStore(DRAFTS_STORE, "readwrite", (store) => requestToPromise(store.put(record)));
                return nextItems;
            } catch (error) {
                console.error(error);
                return [];
            }
        },

        async getSavedSummaries() {
            try {
                const record = await withStore(DRAFTS_STORE, "readonly", (store) => requestToPromise(store.get(SAVED_SUMMARIES_KEY)));
                return Array.isArray(record?.items)
                    ? record.items
                    : [];
            } catch (error) {
                console.error(error);
                return [];
            }
        },

        async saveSavedSummary(summaryRecord) {
            if (!summaryRecord) {
                return [];
            }

            try {
                const currentItems = await this.getSavedSummaries();
                const nextItems = [
                    summaryRecord,
                    ...currentItems.filter((item) => item.id !== summaryRecord.id)
                ];
                const record = {
                    id: SAVED_SUMMARIES_KEY,
                    savedAt: new Date().toISOString(),
                    items: nextItems
                };

                await withStore(DRAFTS_STORE, "readwrite", (store) => requestToPromise(store.put(record)));
                return nextItems;
            } catch (error) {
                console.error(error);
                return [];
            }
        },

        async savePdfAsset(record) {
            const cleanRecord = sanitizePdfAssetRecord(record);

            if (!cleanRecord || !cleanRecord.id || !(cleanRecord.blob instanceof Blob)) {
                return null;
            }

            try {
                await withStore(PDF_ASSETS_STORE, "readwrite", (store) => requestToPromise(store.put(cleanRecord)));
                return cleanRecord;
            } catch (error) {
                console.error(error);
                return null;
            }
        },

        async getPdfAsset(assetId) {
            if (!assetId) {
                return null;
            }

            try {
                const record = await withStore(PDF_ASSETS_STORE, "readonly", (store) => requestToPromise(store.get(assetId)));
                return sanitizePdfAssetRecord(record);
            } catch (error) {
                console.error(error);
                return null;
            }
        },

        async savePdfAnnotations(record) {
            const cleanRecord = sanitizePdfAnnotationRecord(record);

            if (!cleanRecord || !cleanRecord.assetId) {
                return null;
            }

            try {
                await withStore(PDF_ANNOTATIONS_STORE, "readwrite", (store) => requestToPromise(store.put(cleanRecord)));
                return cleanRecord;
            } catch (error) {
                console.error(error);
                return null;
            }
        },

        async getPdfAnnotations(assetId) {
            if (!assetId) {
                return null;
            }

            try {
                const record = await withStore(PDF_ANNOTATIONS_STORE, "readonly", (store) => requestToPromise(store.get(assetId)));
                return sanitizePdfAnnotationRecord(record);
            } catch (error) {
                console.error(error);
                return null;
            }
        },

        async saveMaterialTextExtraction(record) {
            const cleanRecord = sanitizeMaterialTextExtractionRecord(record);

            if (!cleanRecord || !cleanRecord.materialHash || !cleanRecord.text) {
                return null;
            }

            try {
                await withStore(TEXT_EXTRACTIONS_STORE, "readwrite", (store) => requestToPromise(store.put(cleanRecord)));
                return cleanRecord;
            } catch (error) {
                console.error(error);
                return null;
            }
        },

        async getMaterialTextExtraction(materialHash) {
            if (!materialHash) {
                return null;
            }

            try {
                const record = await withStore(TEXT_EXTRACTIONS_STORE, "readonly", (store) => requestToPromise(store.get(materialHash)));
                return sanitizeMaterialTextExtractionRecord(record);
            } catch (error) {
                console.error(error);
                return null;
            }
        },

        buildDraftSummary,
        buildStudyLibraryRecord,
        sanitizeStudyLibraryItem,
        sanitizeSnapshot,
        sanitizePdfAnnotationRecord,
        sanitizeMaterialTextExtractionRecord
    };
})();

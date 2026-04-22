(function () {
    if (window.PremiumStudyStorage) {
        return;
    }

    const DB_NAME = "premiumStudyLocal";
    const DB_VERSION = 1;
    const STORE_NAME = "drafts";
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
                if (!db.objectStoreNames.contains(STORE_NAME)) {
                    db.createObjectStore(STORE_NAME, { keyPath: "id" });
                }
            });

            request.addEventListener("success", () => resolve(request.result), { once: true });
            request.addEventListener("error", () => reject(request.error || new Error("Nao foi possivel abrir o banco local")), { once: true });
        });

        return openPromise;
    }

    async function withStore(mode, callback) {
        if (!window.indexedDB) {
            return null;
        }

        const db = await openDatabase();
        const transaction = db.transaction(STORE_NAME, mode);
        const store = transaction.objectStore(STORE_NAME);
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

    function buildDraftSummary(snapshot) {
        return {
            id: snapshot.savedDraftId || LATEST_KEY,
            title: snapshot.studyTitle || snapshot.materialName || "Estudo salvo",
            materialName: snapshot.materialName || "PDF sem nome",
            examDate: snapshot.examDate || "",
            examDateLabel: normalizeDateLabel(snapshot.examDate),
            targetScore: snapshot.targetScore || 7,
            studyHours: snapshot.studyHours || 1,
            studyMinutes: snapshot.studyMinutes || 0,
            step: snapshot.step || "entry",
            savedAt: snapshot.savedAt || new Date().toISOString()
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
            materialName: item.materialName || base.materialName || "PDF sem nome",
            examDate: item.examDate || base.examDate || "",
            examDateLabel: item.examDateLabel || normalizeDateLabel(item.examDate || base.examDate),
            targetScore: item.targetScore ?? base.targetScore ?? 7,
            studyHours: item.studyHours ?? base.studyHours ?? 1,
            studyMinutes: item.studyMinutes ?? base.studyMinutes ?? 0,
            step: item.step || base.step || "entry",
            savedAt,
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
            snapshot: cleanSnapshot
        };
    }

    window.PremiumStudyStorage = {
        async getLatestDraft() {
            try {
                const draft = await withStore("readonly", (store) => requestToPromise(store.get(LATEST_KEY)));
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
                await withStore("readwrite", (store) => requestToPromise(store.put(draft)));
                return draft;
            } catch (error) {
                console.error(error);
                return null;
            }
        },

        async clearLatestDraft() {
            try {
                await withStore("readwrite", (store) => requestToPromise(store.delete(LATEST_KEY)));
            } catch (error) {
                console.error(error);
            }
        },

        async getStudyLibrary() {
            try {
                const record = await withStore("readonly", (store) => requestToPromise(store.get(STUDY_LIBRARY_KEY)));
                return Array.isArray(record?.items)
                    ? record.items.map(sanitizeStudyLibraryItem).filter(Boolean)
                    : [];
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

                await withStore("readwrite", (store) => requestToPromise(store.put(record)));
                return nextItems;
            } catch (error) {
                console.error(error);
                return [];
            }
        },

        async getSavedSummaries() {
            try {
                const record = await withStore("readonly", (store) => requestToPromise(store.get(SAVED_SUMMARIES_KEY)));
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

                await withStore("readwrite", (store) => requestToPromise(store.put(record)));
                return nextItems;
            } catch (error) {
                console.error(error);
                return [];
            }
        },

        buildDraftSummary,
        buildStudyLibraryRecord
    };
})();

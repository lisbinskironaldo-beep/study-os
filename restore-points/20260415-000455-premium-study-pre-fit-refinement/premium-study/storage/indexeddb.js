(function () {
    if (window.PremiumStudyStorage) {
        return;
    }

    const DB_NAME = "premiumStudyLocal";
    const DB_VERSION = 1;
    const STORE_NAME = "drafts";
    const LATEST_KEY = "latest";
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

    window.PremiumStudyStorage = {
        async getLatestDraft() {
            try {
                return await withStore("readonly", (store) => requestToPromise(store.get(LATEST_KEY)));
            } catch (error) {
                console.error(error);
                return null;
            }
        },

        async saveLatestDraft(snapshot) {
            if (!snapshot || !snapshot.materialName) {
                return null;
            }

            const draft = {
                id: LATEST_KEY,
                savedAt: new Date().toISOString(),
                snapshot
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

        buildDraftSummary
    };
})();

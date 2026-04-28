(function () {
    if (window.PremiumStudyLibrary) {
        return;
    }

    const ENDPOINT = "/api/premium/library";

    function normalizeDateLabel(dateString) {
        const input = String(dateString || "").trim();

        if (!input) {
            return "Data nao definida";
        }

        const parts = input.split("-");
        if (parts.length !== 3) {
            return input;
        }

        return `${parts[2]}/${parts[1]}/${parts[0]}`;
    }

    function normalizeItem(item = {}) {
        const source = item && typeof item === "object"
            ? item
            : {};
        const snapshot = source.snapshot && typeof source.snapshot === "object"
            ? source.snapshot
            : null;
        const savedAt = String(source.savedAt || (snapshot && snapshot.savedAt) || new Date().toISOString());

        return {
            id: String(source.id || (snapshot && snapshot.studyLibraryId) || `library-${Date.now()}`),
            title: String(source.title || (snapshot && (snapshot.studyTitle || snapshot.materialName)) || "Estudo salvo"),
            materialName: String(source.materialName || (snapshot && snapshot.materialName) || "PDF sem nome"),
            examDate: String(source.examDate || (snapshot && snapshot.examDate) || ""),
            examDateLabel: String(source.examDateLabel || normalizeDateLabel(source.examDate || (snapshot && snapshot.examDate) || "")),
            targetScore: Number(source.targetScore ?? (snapshot && snapshot.targetScore) ?? 7),
            studyHours: Number(source.studyHours ?? (snapshot && snapshot.studyHours) ?? 1),
            studyMinutes: Number(source.studyMinutes ?? (snapshot && snapshot.studyMinutes) ?? 0),
            step: String(source.step || (snapshot && snapshot.step) || "entry"),
            savedAt,
            pdfAvailable: Boolean(source.pdfAvailable || (snapshot && snapshot.pdfAssetId)),
            snapshot: snapshot
                ? {
                    ...snapshot,
                    studyLibraryId: String(snapshot.studyLibraryId || source.id || ""),
                    savedAt
                }
                : null
        };
    }

    function getSavedAtTime(item = {}) {
        const value = Date.parse(String(item.savedAt || ""));
        return Number.isFinite(value) ? value : 0;
    }

    function compareItemsBySavedAtDesc(left = {}, right = {}) {
        return getSavedAtTime(right) - getSavedAtTime(left);
    }

    function mergeLibraryItems(...collections) {
        const map = new Map();

        collections.forEach((collection) => {
            (Array.isArray(collection) ? collection : []).forEach((item) => {
                const normalized = normalizeItem(item);
                const current = map.get(normalized.id);

                if (!current || getSavedAtTime(normalized) >= getSavedAtTime(current)) {
                    map.set(normalized.id, normalized);
                }
            });
        });

        return Array.from(map.values()).sort(compareItemsBySavedAtDesc);
    }

    function getItemsNeedingUpload(localItems = [], remoteItems = []) {
        const local = mergeLibraryItems(localItems);
        const remoteMap = new Map(
            mergeLibraryItems(remoteItems).map((item) => [item.id, item])
        );

        return local.filter((item) => {
            const remoteItem = remoteMap.get(item.id);
            return !remoteItem || getSavedAtTime(item) > getSavedAtTime(remoteItem);
        });
    }

    async function getRemoteLibrary() {
        const response = await fetch(ENDPOINT);
        const data = await response.json().catch(() => null);

        return {
            ok: Boolean(response.ok && data && data.ok),
            status: data && data.status ? data.status : response.ok ? "ok" : "request_failed",
            items: Array.isArray(data && data.items)
                ? data.items.map(normalizeItem)
                : []
        };
    }

    async function saveRemoteLibraryItems(items = []) {
        const normalizedItems = mergeLibraryItems(items);

        if (!normalizedItems.length) {
            return {
                ok: true,
                status: "empty",
                items: []
            };
        }

        const response = await fetch(ENDPOINT, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                items: normalizedItems
            })
        });
        const data = await response.json().catch(() => null);

        return {
            ok: Boolean(response.ok && data && data.ok),
            status: data && data.status ? data.status : response.ok ? "ok" : "request_failed",
            items: Array.isArray(data && data.items)
                ? data.items.map(normalizeItem)
                : []
        };
    }

    window.PremiumStudyLibrary = {
        normalizeItem,
        mergeLibraryItems,
        getItemsNeedingUpload,
        getRemoteLibrary,
        saveRemoteLibraryItems
    };
})();

function cleanText(value, fallback = "") {
    return String(value ?? fallback).trim();
}

function sanitizeIsoDateTime(value) {
    const input = cleanText(value);

    if (!input) {
        return new Date().toISOString();
    }

    const parsed = new Date(input);

    if (Number.isNaN(parsed.getTime())) {
        return new Date().toISOString();
    }

    return parsed.toISOString();
}

function normalizeDateLabel(dateString) {
    const input = cleanText(dateString);

    if (!input) {
        return "Data nao definida";
    }

    const parts = input.split("-");
    if (parts.length !== 3) {
        return input;
    }

    return `${parts[2]}/${parts[1]}/${parts[0]}`;
}

function sanitizeNumber(value, fallback) {
    const numeric = Number(value);
    return Number.isFinite(numeric) ? numeric : fallback;
}

function sanitizeSnapshot(snapshot = {}, itemId = "", savedAt = "") {
    const source = snapshot && typeof snapshot === "object"
        ? snapshot
        : {};

    return {
        ...source,
        studyLibraryId: cleanText(source.studyLibraryId || itemId),
        savedAt: sanitizeIsoDateTime(source.savedAt || savedAt)
    };
}

function buildFallbackLibraryId() {
    return `library-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function sanitizeStudyLibraryItem(input = {}) {
    const source = input && typeof input === "object"
        ? input
        : {};
    const snapshotSource = source.snapshot && typeof source.snapshot === "object"
        ? source.snapshot
        : source;
    const id = cleanText(source.id || snapshotSource.studyLibraryId || buildFallbackLibraryId());
    const savedAt = sanitizeIsoDateTime(source.savedAt || snapshotSource.savedAt);
    const snapshot = sanitizeSnapshot(snapshotSource, id, savedAt);

    return {
        id,
        title: cleanText(source.title || snapshot.studyTitle || snapshot.materialName || "Estudo salvo"),
        materialName: cleanText(source.materialName || snapshot.materialName || "PDF sem nome"),
        examDate: cleanText(source.examDate || snapshot.examDate),
        examDateLabel: cleanText(source.examDateLabel || normalizeDateLabel(source.examDate || snapshot.examDate)),
        targetScore: sanitizeNumber(source.targetScore ?? snapshot.targetScore, 7),
        studyHours: sanitizeNumber(source.studyHours ?? snapshot.studyHours, 1),
        studyMinutes: sanitizeNumber(source.studyMinutes ?? snapshot.studyMinutes, 0),
        step: cleanText(source.step || snapshot.step || "entry"),
        savedAt,
        pdfAvailable: Boolean(source.pdfAvailable || snapshot.pdfAssetId),
        snapshot
    };
}

function mapLibraryItemToSupabase(item = {}, userId = "") {
    const cleanItem = sanitizeStudyLibraryItem(item);

    return {
        user_id: cleanText(userId),
        library_item_id: cleanItem.id,
        title: cleanItem.title,
        material_name: cleanItem.materialName,
        exam_date: cleanItem.examDate,
        exam_date_label: cleanItem.examDateLabel,
        target_score: cleanItem.targetScore,
        study_hours: cleanItem.studyHours,
        study_minutes: cleanItem.studyMinutes,
        step: cleanItem.step,
        saved_at: cleanItem.savedAt,
        pdf_available: cleanItem.pdfAvailable,
        snapshot: cleanItem.snapshot
    };
}

function mapLibraryItemFromSupabase(record = {}) {
    return sanitizeStudyLibraryItem({
        id: record.library_item_id,
        title: record.title,
        materialName: record.material_name,
        examDate: record.exam_date,
        examDateLabel: record.exam_date_label,
        targetScore: record.target_score,
        studyHours: record.study_hours,
        studyMinutes: record.study_minutes,
        step: record.step,
        savedAt: record.saved_at || record.updated_at || record.created_at,
        pdfAvailable: record.pdf_available,
        snapshot: record.snapshot
    });
}

module.exports = {
    sanitizeStudyLibraryItem,
    mapLibraryItemToSupabase,
    mapLibraryItemFromSupabase
};

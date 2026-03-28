export function normalizeProfileState(
    value = {}
) {
    const next = {
        topics: {},
        sessions: [],
        smartProfiles: [],
        savedBlocks: [],
        ...(value || {})
    };

    if (
        !next.topics ||
        typeof next.topics !== "object"
    ) {
        next.topics = {};
    }

    if (!Array.isArray(next.sessions)) {
        next.sessions = [];
    }

    if (
        !Array.isArray(next.smartProfiles)
    ) {
        next.smartProfiles = [];
    }

    if (
        !Array.isArray(next.savedBlocks)
    ) {
        next.savedBlocks = [];
    }

    return next;
}

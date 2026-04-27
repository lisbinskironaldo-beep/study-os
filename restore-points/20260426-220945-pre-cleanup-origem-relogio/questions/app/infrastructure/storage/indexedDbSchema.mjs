export const QUESTIONS_INDEXED_DB_SCHEMA =
    Object.freeze({
        dbName: "rotanota_questions_v3",
        version: 1,
        stores: {
            runs: {
                keyPath: "id",
                indexes: [
                    "status",
                    "mode",
                    "updatedAt",
                    "completedAt"
                ]
            },
            profileState: {
                keyPath: "scope",
                indexes: ["updatedAt"]
            },
            topicStats: {
                keyPath: "key",
                indexes: [
                    "baseKey",
                    "subjectKey",
                    "topicKey",
                    "lastSeen"
                ]
            },
            sessions: {
                keyPath: "id",
                indexes: [
                    "baseKey",
                    "subjectKey",
                    "createdAt"
                ]
            },
            smartProfiles: {
                keyPath: "id",
                indexes: [
                    "updatedAt",
                    "lastUsedAt"
                ]
            },
            savedBlocks: {
                keyPath: "id",
                indexes: [
                    "updatedAt",
                    "lastUsedAt",
                    "mode"
                ]
            }
        }
    });

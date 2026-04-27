import { QUESTIONS_INDEXED_DB_SCHEMA } from "../storage/indexedDbSchema.mjs";
import {
    openQuestionsIndexedDb,
    readAllFromStore,
    replaceStoreContents
} from "../storage/indexedDbClient.mjs";

function readLegacyList(
    legacyProfileStateRepository,
    fieldName
) {
    try {
        const current =
            legacyProfileStateRepository?.load?.() ||
            {};
        const list =
            current?.[fieldName];

        return Array.isArray(list)
            ? [...list]
            : [];
    } catch (_error) {
        return [];
    }
}

function writeLegacyList(
    legacyProfileStateRepository,
    fieldName,
    records = []
) {
    if (
        !legacyProfileStateRepository ||
        typeof legacyProfileStateRepository.load !==
            "function" ||
        typeof legacyProfileStateRepository.save !==
            "function"
    ) {
        return false;
    }

    try {
        const current =
            legacyProfileStateRepository.load();
        legacyProfileStateRepository.save(
            {
                ...(current || {}),
                [fieldName]:
                    Array.isArray(records)
                        ? [...records]
                        : []
            }
        );
        return true;
    } catch (_error) {
        return false;
    }
}

export async function createIndexedDbProfileListRepository(
    options = {}
) {
    const schema =
        options.schema ||
        QUESTIONS_INDEXED_DB_SCHEMA;
    const storeName =
        String(
            options.storeName || ""
        ).trim();
    const fieldName =
        String(
            options.fieldName || ""
        ).trim();
    const legacyProfileStateRepository =
        options.legacyProfileStateRepository ||
        null;

    if (!storeName || !fieldName) {
        throw new Error(
            "storeName and fieldName are required for indexed profile list repositories."
        );
    }

    const database =
        await openQuestionsIndexedDb(
            schema
        );
    const state = {
        database,
        cache: [],
        persistChain:
            Promise.resolve()
    };

    const persistedRecords =
        await readAllFromStore(
            database,
            storeName
        );
    const legacyRecords =
        readLegacyList(
            legacyProfileStateRepository,
            fieldName
        );

    if (
        !persistedRecords.length &&
        legacyRecords.length
    ) {
        await replaceStoreContents(
            database,
            storeName,
            legacyRecords
        );
        state.cache = [...legacyRecords];
    } else {
        state.cache = [
            ...persistedRecords
        ];
    }

    function enqueuePersist(
        records = []
    ) {
        const snapshot = (
            Array.isArray(records)
                ? records
                : []
        ).map((record) =>
            record &&
            typeof record === "object"
                ? { ...record }
                : record
        );

        state.persistChain =
            state.persistChain
                .catch(() => null)
                .then(async () => {
                    writeLegacyList(
                        legacyProfileStateRepository,
                        fieldName,
                        snapshot
                    );

                    return replaceStoreContents(
                        state.database,
                        storeName,
                        snapshot
                    );
                });

        return state.persistChain;
    }

    return {
        key: `${schema.dbName}:${storeName}`,
        storageType: "indexeddb",

        list() {
            return state.cache.map(
                (record) =>
                    record &&
                    typeof record ===
                        "object"
                        ? { ...record }
                        : record
            );
        },

        saveAll(records = []) {
            const next = (
                Array.isArray(records)
                    ? records
                    : []
            ).map((record) =>
                record &&
                typeof record ===
                    "object"
                    ? { ...record }
                    : record
            );

            state.cache = next;
            enqueuePersist(next);
            return next;
        },

        async ready() {
            await state.persistChain.catch(
                () => null
            );
            return true;
        }
    };
}

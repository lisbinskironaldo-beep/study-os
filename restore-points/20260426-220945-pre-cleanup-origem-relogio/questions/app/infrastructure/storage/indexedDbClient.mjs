import { QUESTIONS_INDEXED_DB_SCHEMA } from "./indexedDbSchema.mjs";

function ensureIndexedDb() {
    if (
        typeof globalThis.indexedDB ===
        "undefined"
    ) {
        throw new Error(
            "IndexedDB is not available in this runtime."
        );
    }

    return globalThis.indexedDB;
}

function createObjectStore(
    database,
    storeName,
    storeConfig = {}
) {
    const keyPath =
        storeConfig.keyPath || "id";
    const objectStore =
        database.createObjectStore(
            storeName,
            { keyPath }
        );

    (storeConfig.indexes || []).forEach(
        (indexName) => {
            if (
                !objectStore.indexNames.contains(
                    indexName
                )
            ) {
                objectStore.createIndex(
                    indexName,
                    indexName,
                    { unique: false }
                );
            }
        }
    );
}

function ensureStoreSchema(
    database,
    transaction,
    storeName,
    storeConfig = {}
) {
    if (
        !database.objectStoreNames.contains(
            storeName
        )
    ) {
        createObjectStore(
            database,
            storeName,
            storeConfig
        );
        return;
    }

    if (!transaction) {
        return;
    }

    const objectStore =
        transaction.objectStore(
            storeName
        );

    (storeConfig.indexes || []).forEach(
        (indexName) => {
            if (
                !objectStore.indexNames.contains(
                    indexName
                )
            ) {
                objectStore.createIndex(
                    indexName,
                    indexName,
                    { unique: false }
                );
            }
        }
    );
}

export function openQuestionsIndexedDb(
    schema = QUESTIONS_INDEXED_DB_SCHEMA
) {
    const indexedDb =
        ensureIndexedDb();

    return new Promise(
        (resolve, reject) => {
            const request =
                indexedDb.open(
                    schema.dbName,
                    schema.version
                );

            request.onupgradeneeded =
                (event) => {
                    const database =
                        event.target
                            ?.result;

                    Object.entries(
                        schema.stores || {}
                    ).forEach(
                        ([
                            storeName,
                            storeConfig
                        ]) => {
                            ensureStoreSchema(
                                database,
                                event.target
                                    ?.transaction,
                                storeName,
                                storeConfig
                            );
                        }
                    );
                };

            request.onsuccess = () => {
                resolve(
                    request.result
                );
            };

            request.onerror = () => {
                reject(
                    request.error ||
                        new Error(
                            "Failed to open IndexedDB."
                        )
                );
            };
        }
    );
}

export function readAllFromStore(
    database,
    storeName
) {
    return new Promise(
        (resolve, reject) => {
            const transaction =
                database.transaction(
                    storeName,
                    "readonly"
                );
            const objectStore =
                transaction.objectStore(
                    storeName
                );
            const request =
                objectStore.getAll();

            request.onsuccess = () => {
                resolve(
                    Array.isArray(
                        request.result
                    )
                        ? request.result
                        : []
                );
            };

            request.onerror = () => {
                reject(
                    request.error ||
                        new Error(
                            `Failed to read store ${storeName}.`
                        )
                );
            };
        }
    );
}

export function replaceStoreContents(
    database,
    storeName,
    records = []
) {
    return new Promise(
        (resolve, reject) => {
            const transaction =
                database.transaction(
                    storeName,
                    "readwrite"
                );
            const objectStore =
                transaction.objectStore(
                    storeName
                );

            transaction.oncomplete = () => {
                resolve(true);
            };

            transaction.onerror = () => {
                reject(
                    transaction.error ||
                        new Error(
                            `Failed to write store ${storeName}.`
                        )
                );
            };

            objectStore.clear();

            (
                Array.isArray(records)
                    ? records
                    : []
            ).forEach((record) => {
                objectStore.put(record);
            });
        }
    );
}

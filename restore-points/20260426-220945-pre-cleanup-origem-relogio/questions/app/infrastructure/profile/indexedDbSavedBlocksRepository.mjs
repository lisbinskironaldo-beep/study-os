import { createIndexedDbProfileListRepository } from "./indexedDbProfileListRepository.mjs";

export function createIndexedDbSavedBlocksRepository(
    options = {}
) {
    return createIndexedDbProfileListRepository(
        {
            ...options,
            storeName:
                options.storeName ||
                "savedBlocks",
            fieldName:
                options.fieldName ||
                "savedBlocks"
        }
    );
}

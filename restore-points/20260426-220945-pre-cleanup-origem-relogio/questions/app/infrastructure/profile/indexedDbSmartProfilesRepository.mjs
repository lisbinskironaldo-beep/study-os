import { createIndexedDbProfileListRepository } from "./indexedDbProfileListRepository.mjs";

export function createIndexedDbSmartProfilesRepository(
    options = {}
) {
    return createIndexedDbProfileListRepository(
        {
            ...options,
            storeName:
                options.storeName ||
                "smartProfiles",
            fieldName:
                options.fieldName ||
                "smartProfiles"
        }
    );
}

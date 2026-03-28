import {
    QUESTIONS_CONTENT_REPOSITORIES,
    QUESTIONS_MODULE_EVENTS,
    QUESTIONS_V2_BOOTSTRAP
} from "../domain/contracts.mjs";
import { loadCatalogBundle } from "../infrastructure/content/catalogRepository.mjs";
import { createIndexedDbSavedBlocksRepository } from "../infrastructure/profile/indexedDbSavedBlocksRepository.mjs";
import { createIndexedDbProfileStateRepository } from "../infrastructure/profile/indexedDbProfileStateRepository.mjs";
import { createIndexedDbSmartProfilesRepository } from "../infrastructure/profile/indexedDbSmartProfilesRepository.mjs";
import { createLocalStorageProfileStateRepository } from "../infrastructure/profile/localStorageProfileStateRepository.mjs";
import { createLocalStorageSavedBlocksRepository } from "../infrastructure/profile/localStorageSavedBlocksRepository.mjs";
import { createLocalStorageSmartProfilesRepository } from "../infrastructure/profile/localStorageSmartProfilesRepository.mjs";
import { createIndexedDbRunsRepository } from "../infrastructure/runs/indexedDbRunsRepository.mjs";
import { createLocalStorageRunsRepository } from "../infrastructure/runs/localStorageRunsRepository.mjs";

export async function bootstrapQuestionsModule(
    options = {}
) {
    const runtimeBaseUrl =
        String(
            options.runtimeBaseUrl || ""
        ).trim();

    if (!runtimeBaseUrl) {
        throw new Error(
            "runtimeBaseUrl is required to bootstrap questions v2 foundation."
        );
    }

    const catalogBundle =
        await loadCatalogBundle(
            runtimeBaseUrl
        );
    const hasLocalStorage =
        typeof globalThis.localStorage !==
        "undefined";
    const legacyProfileStateRepository =
        hasLocalStorage
            ? createLocalStorageProfileStateRepository(
                {
                    storage:
                        globalThis.localStorage
                }
            )
            : null;
    let profileStateRepository =
        legacyProfileStateRepository;
    let runsRepository = null;
    let smartProfilesRepository =
        legacyProfileStateRepository
            ? createLocalStorageSmartProfilesRepository(
                legacyProfileStateRepository
            )
            : null;
    let savedBlocksRepository =
        legacyProfileStateRepository
            ? createLocalStorageSavedBlocksRepository(
                legacyProfileStateRepository
            )
            : null;

    if (
        typeof globalThis.indexedDB !==
        "undefined"
    ) {
        try {
            [
                profileStateRepository,
                smartProfilesRepository,
                savedBlocksRepository,
                runsRepository
            ] = await Promise.all([
                createIndexedDbProfileStateRepository(
                    {
                        legacyProfileStateRepository
                    }
                ),
                createIndexedDbSmartProfilesRepository(
                    {
                        legacyProfileStateRepository:
                            legacyProfileStateRepository
                    }
                ),
                createIndexedDbSavedBlocksRepository(
                    {
                        legacyProfileStateRepository:
                            legacyProfileStateRepository
                    }
                ),
                createIndexedDbRunsRepository(
                    {
                        legacyStorage:
                            hasLocalStorage
                                ? globalThis.localStorage
                                : null
                    }
                )
            ]);
        } catch (error) {
            console.warn(
                "[Questions] Falha ao iniciar persistencia de Questions em IndexedDB. Mantendo fallback em localStorage.",
                error
            );
        }
    }

    if (
        !runsRepository &&
        hasLocalStorage
    ) {
        runsRepository =
            createLocalStorageRunsRepository(
                {
                    storage:
                        globalThis.localStorage
                }
            );
    }

    return {
        foundation:
            QUESTIONS_V2_BOOTSTRAP,
        contracts: {
            events:
                QUESTIONS_MODULE_EVENTS,
            repositories:
                QUESTIONS_CONTENT_REPOSITORIES
        },
        repositories: {
            content:
                catalogBundle.contentRepository ||
                null,
            profileState:
                profileStateRepository,
            smartProfiles:
                smartProfilesRepository,
            savedBlocks:
                savedBlocksRepository,
            runs: runsRepository
        },
        ...catalogBundle
    };
}

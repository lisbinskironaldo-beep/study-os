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
import { normalizeProfileState } from "../domain/entities/profileState.mjs";
import { normalizeRunRecord } from "../domain/entities/runRecord.mjs";
import { createQuestionsAccountStateClient } from "../infrastructure/remote/questionsAccountStateClient.mjs";
import { createRemoteProfileListRepository } from "../infrastructure/remote/remoteProfileListRepository.mjs";
import { createRemoteProfileStateRepository } from "../infrastructure/remote/remoteProfileStateRepository.mjs";
import { createRemoteRunsRepository } from "../infrastructure/remote/remoteRunsRepository.mjs";
import { createIndexedDbRunsRepository } from "../infrastructure/runs/indexedDbRunsRepository.mjs";
import { createLocalStorageRunsRepository } from "../infrastructure/runs/localStorageRunsRepository.mjs";

function cloneObjectMap(
    value = {}
) {
    return Object.fromEntries(
        Object.entries(
            value &&
                typeof value === "object"
                ? value
                : {}
        ).map(([key, entry]) => [
            key,
            entry &&
            typeof entry === "object"
                ? { ...entry }
                : entry
        ])
    );
}

function cloneList(list = []) {
    return (
        Array.isArray(list)
            ? list
            : []
    ).map((entry) =>
        entry &&
        typeof entry === "object"
            ? { ...entry }
            : entry
    );
}

function normalizeQuestionsAccountSnapshot(
    value = {}
) {
    const profileState =
        value &&
        value.profileState &&
        typeof value.profileState ===
            "object"
            ? value.profileState
            : {};

    return {
        profileState:
            normalizeProfileState({
                topics:
                    cloneObjectMap(
                        profileState.topics
                    ),
                sessions:
                    cloneList(
                        profileState.sessions
                    )
            }),
        smartProfiles:
            cloneList(
                value.smartProfiles
            ),
        savedBlocks:
            cloneList(
                value.savedBlocks
            ),
        runs: (
            Array.isArray(value.runs)
                ? value.runs
                : []
        ).map((run) =>
            normalizeRunRecord(run)
        )
    };
}

function hasSnapshotData(
    snapshot = {}
) {
    const normalized =
        normalizeQuestionsAccountSnapshot(
            snapshot
        );

    return Boolean(
        Object.keys(
            normalized.profileState
                .topics || {}
        ).length ||
            normalized.profileState
                .sessions.length ||
            normalized.smartProfiles
                .length ||
            normalized.savedBlocks
                .length ||
            normalized.runs.length
    );
}

function getRecordTimestamp(
    value = {}
) {
    const candidates = [
        value.updatedAt,
        value.lastUsedAt,
        value.lastSeen,
        value.completedAt,
        value.createdAt,
        value.startedAt
    ];

    for (const candidate of candidates) {
        const numeric =
            Number(candidate);

        if (
            Number.isFinite(numeric) &&
            numeric > 0
        ) {
            return numeric;
        }

        const dateValue = new Date(
            candidate
        ).getTime();

        if (
            Number.isFinite(dateValue) &&
            dateValue > 0
        ) {
            return dateValue;
        }
    }

    return 0;
}

function mergeRecordsByIdentity(
    remoteRecords = [],
    localRecords = [],
    options = {}
) {
    const getIdentity =
        typeof options.getIdentity ===
        "function"
            ? options.getIdentity
            : (record, index) =>
                  String(
                      record?.id ||
                          record?.key ||
                          index
                  );
    const limit = Math.max(
        Number(options.limit) || 0,
        0
    );
    const merged = new Map();

    [
        ...(Array.isArray(remoteRecords)
            ? remoteRecords
            : []),
        ...(Array.isArray(localRecords)
            ? localRecords
            : [])
    ].forEach((record, index) => {
        if (
            !record ||
            typeof record !== "object"
        ) {
            return;
        }

        const identity = String(
            getIdentity(record, index) ||
                ""
        ).trim();

        if (!identity) {
            return;
        }

        const current =
            merged.get(identity);

        if (!current) {
            merged.set(identity, {
                ...record
            });
            return;
        }

        if (
            getRecordTimestamp(record) >=
            getRecordTimestamp(current)
        ) {
            merged.set(identity, {
                ...record
            });
        }
    });

    const ordered = [
        ...merged.values()
    ].sort(
        (left, right) =>
            getRecordTimestamp(right) -
            getRecordTimestamp(left)
    );

    return limit
        ? ordered.slice(0, limit)
        : ordered;
}

function mergeTopicMaps(
    remoteTopics = {},
    localTopics = {}
) {
    const merged = new Map();

    [
        cloneObjectMap(remoteTopics),
        cloneObjectMap(localTopics)
    ].forEach((bucket) => {
        Object.entries(bucket).forEach(
            ([key, value]) => {
                if (
                    !value ||
                    typeof value !== "object"
                ) {
                    return;
                }

                const current =
                    merged.get(key);

                if (!current) {
                    merged.set(key, {
                        ...value
                    });
                    return;
                }

                if (
                    getRecordTimestamp(value) >=
                    getRecordTimestamp(current)
                ) {
                    merged.set(key, {
                        ...value
                    });
                }
            }
        );
    });

    return Object.fromEntries(
        merged.entries()
    );
}

function mergeAccountSnapshots(
    remoteSnapshot = {},
    localSnapshot = {}
) {
    const remote =
        normalizeQuestionsAccountSnapshot(
            remoteSnapshot
        );
    const local =
        normalizeQuestionsAccountSnapshot(
            localSnapshot
        );

    return normalizeQuestionsAccountSnapshot(
        {
            profileState: {
                topics:
                    mergeTopicMaps(
                        remote.profileState
                            .topics,
                        local.profileState
                            .topics
                    ),
                sessions:
                    mergeRecordsByIdentity(
                        remote.profileState
                            .sessions,
                        local.profileState
                            .sessions,
                        {
                            getIdentity:
                                (record) =>
                                    record?.id ||
                                    `${record?.createdAt || 0}:${record?.modeKey || ""}:${record?.subjectKey || ""}`,
                            limit: 40
                        }
                    )
            },
            smartProfiles:
                mergeRecordsByIdentity(
                    remote.smartProfiles,
                    local.smartProfiles,
                    {
                        getIdentity:
                            (record) =>
                                record?.id ||
                                record?.profileId ||
                                JSON.stringify(
                                    record
                                )
                    }
                ),
            savedBlocks:
                mergeRecordsByIdentity(
                    remote.savedBlocks,
                    local.savedBlocks,
                    {
                        getIdentity:
                            (record) =>
                                record?.id ||
                                record?.profileId ||
                                JSON.stringify(
                                    record
                                ),
                        limit: 80
                    }
                ),
            runs: mergeRecordsByIdentity(
                remote.runs,
                local.runs,
                {
                    getIdentity:
                        (record) =>
                            record?.id ||
                            JSON.stringify(
                                record
                            ),
                    limit: 80
                }
            )
        }
    );
}

function snapshotsEqual(
    left = {},
    right = {}
) {
    return (
        JSON.stringify(
            normalizeQuestionsAccountSnapshot(
                left
            )
        ) ===
        JSON.stringify(
            normalizeQuestionsAccountSnapshot(
                right
            )
        )
    );
}

function collectLocalSnapshot(
    repositories = {}
) {
    return normalizeQuestionsAccountSnapshot(
        {
            profileState:
                repositories.profileState?.load?.() ||
                {},
            smartProfiles:
                repositories.smartProfiles?.list?.() ||
                [],
            savedBlocks:
                repositories.savedBlocks?.list?.() ||
                [],
            runs:
                repositories.runs?.list?.() ||
                []
        }
    );
}

async function persistSnapshotLocally(
    repositories = {},
    snapshot = {}
) {
    const normalized =
        normalizeQuestionsAccountSnapshot(
            snapshot
        );

    repositories.profileState?.save?.(
        normalized.profileState
    );
    repositories.smartProfiles?.saveAll?.(
        normalized.smartProfiles
    );
    repositories.savedBlocks?.saveAll?.(
        normalized.savedBlocks
    );
    repositories.runs?.saveAll?.(
        normalized.runs
    );

    await Promise.all(
        [
            repositories.profileState?.ready?.(),
            repositories.smartProfiles?.ready?.(),
            repositories.savedBlocks?.ready?.(),
            repositories.runs?.ready?.()
        ].filter(Boolean)
    );
}

async function resolveAuthenticatedSession() {
    const liveSession =
        globalThis.RotaNotaAuth?.getSession?.();

    if (liveSession?.userId) {
        return liveSession;
    }

    try {
        const response = await fetch(
            "/api/auth/session",
            {
                method: "GET",
                credentials:
                    "same-origin",
                headers: {
                    Accept:
                        "application/json"
                }
            }
        );

        if (!response.ok) {
            return null;
        }

        const payload =
            await response
                .json()
                .catch(() => null);

        return payload?.authenticated &&
            payload?.user?.userId
            ? payload.user
            : null;
    } catch (_error) {
        return null;
    }
}

async function upgradeRepositoriesWithAccountSync(
    repositories = {}
) {
    const session =
        await resolveAuthenticatedSession();

    if (!session?.userId) {
        return repositories;
    }

    const client =
        createQuestionsAccountStateClient(
            { session }
        );

    await client.ready();

    if (!client.isAuthenticated()) {
        return repositories;
    }

    const localSnapshot =
        collectLocalSnapshot(
            repositories
        );
    const remoteSnapshot =
        client.getState();
    const mergedSnapshot =
        mergeAccountSnapshots(
            remoteSnapshot,
            localSnapshot
        );

    if (
        hasSnapshotData(
            mergedSnapshot
        ) &&
        !snapshotsEqual(
            remoteSnapshot,
            mergedSnapshot
        )
    ) {
        client.setState(
            mergedSnapshot
        );
        await client.flush();
    }

    if (
        !snapshotsEqual(
            localSnapshot,
            mergedSnapshot
        )
    ) {
        await persistSnapshotLocally(
            repositories,
            mergedSnapshot
        );
    }

    return {
        ...repositories,
        profileState:
            createRemoteProfileStateRepository(
                {
                    client,
                    fallbackRepository:
                        repositories.profileState
                }
            ),
        smartProfiles:
            createRemoteProfileListRepository(
                {
                    client,
                    sectionName:
                        "smartProfiles",
                    fallbackRepository:
                        repositories.smartProfiles
                }
            ),
        savedBlocks:
            createRemoteProfileListRepository(
                {
                    client,
                    sectionName:
                        "savedBlocks",
                    fallbackRepository:
                        repositories.savedBlocks
                }
            ),
        runs: createRemoteRunsRepository(
            {
                client,
                fallbackRepository:
                    repositories.runs
            }
        )
    };
}

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

    const upgradedRepositories =
        await upgradeRepositoriesWithAccountSync(
            {
                profileState:
                    profileStateRepository,
                smartProfiles:
                    smartProfilesRepository,
                savedBlocks:
                    savedBlocksRepository,
                runs: runsRepository
            }
        ).catch((error) => {
            console.warn(
                "[Questions] Falha ao sincronizar historico com a conta. Mantendo persistencia local.",
                error
            );

            return {
                profileState:
                    profileStateRepository,
                smartProfiles:
                    smartProfilesRepository,
                savedBlocks:
                    savedBlocksRepository,
                runs: runsRepository
            };
        });

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
                upgradedRepositories.profileState,
            smartProfiles:
                upgradedRepositories.smartProfiles,
            savedBlocks:
                upgradedRepositories.savedBlocks,
            runs:
                upgradedRepositories.runs
        },
        ...catalogBundle
    };
}

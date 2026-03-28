export function createLocalStorageSmartProfilesRepository(
    profileStateRepository
) {
    return {
        list() {
            return [
                ...(
                    profileStateRepository
                        ?.load()
                        ?.smartProfiles || []
                )
            ];
        },

        saveAll(list = []) {
            const current =
                profileStateRepository.load();
            return profileStateRepository.save(
                {
                    ...current,
                    smartProfiles:
                        Array.isArray(list)
                            ? [...list]
                            : []
                }
            );
        }
    };
}

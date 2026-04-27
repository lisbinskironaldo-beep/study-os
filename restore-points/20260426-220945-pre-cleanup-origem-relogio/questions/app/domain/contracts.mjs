export const QUESTIONS_MODULE_EVENTS =
    Object.freeze({
        launcherOpened:
            "questions:launcher-opened",
        routeQueued:
            "questions:route-queued",
        routeUpdated:
            "questions:route-updated",
        sessionStarted:
            "questions:session-started",
        sessionCompleted:
            "questions:session-completed"
    });

export const QUESTIONS_CONTENT_REPOSITORIES =
    Object.freeze({
        manifest: "questions.catalog.manifest",
        catalog: "questions.catalog.full",
        content: "questions.catalog.questions",
        runs: "questions.persistence.runs",
        profileState:
            "questions.persistence.profile_state",
        smartProfiles:
            "questions.persistence.smart_profiles",
        savedBlocks:
            "questions.persistence.saved_blocks"
    });

export const QUESTIONS_V2_BOOTSTRAP =
    Object.freeze({
        version: "0.1.0",
        status: "foundation"
    });

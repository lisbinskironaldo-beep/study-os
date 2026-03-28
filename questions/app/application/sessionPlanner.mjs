import { createQuestionsSessionEngine } from "./sessionEngine.mjs";

export function createQuestionsSessionPlanner(
    {
        page,
        dependencies
    } = {}
) {
    const engine =
        createQuestionsSessionEngine({
            page,
            dependencies
        });

    function validateRoute() {
        return engine.validateRoute();
    }

    function buildSessionList() {
        return engine.buildSessionPlan()
            .questions;
    }

    function buildSessionPlan() {
        return engine.buildSessionPlan();
    }

    function buildRouteSummary() {
        return engine.buildRouteSummary();
    }

    function summarizeResults(
        results = [],
        meta = {}
    ) {
        return engine.summarizeResults(
            results,
            meta
        );
    }

    function buildFollowUpContext(
        intent,
        summary = null
    ) {
        return engine.buildFollowUpContext(
            intent,
            summary
        );
    }

    function buildSmartRoutePreview(
        context = null
    ) {
        return engine.buildSmartRoutePreview(
            context
        );
    }

    return {
        validateRoute,
        buildSessionList,
        buildSessionPlan,
        buildRouteSummary,
        summarizeResults,
        buildFollowUpContext,
        buildSmartRoutePreview
    };
}

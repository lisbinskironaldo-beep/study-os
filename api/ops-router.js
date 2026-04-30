const { sendJson, readJsonBody } = require("./_lib/json");
const {
    verifyPassword,
    setOpsSession,
    clearOpsSession,
    requireOpsSession
} = require("./_lib/ops-auth");
const {
    recordOpsAlert,
    savePrimaryOpsState,
    getPrimaryOpsState,
    getOverview,
    listOpsAlerts,
    getPaymentsStatus,
    getGrowthOverview,
    getWeeklyReport,
    listReviewRuns,
    runThreeDayReview,
    runDailyHealthCheck,
    getOpsAiMemory,
    saveOpsAiMemory,
    getMarketingContentQueue,
    getMarketingIntegrations,
    generateMarketingContentQueue,
    updateMarketingContentItem,
    prepareMarketingContentIntegration,
    getBufferOrganizationsAndChannels,
    publishMarketingContentToInstagram,
    scheduleMarketingContentWithBuffer,
    listChangeRequests,
    createChangeRequest,
    approveChangeRequest,
    rejectChangeRequest,
    executeApprovedChangeRequest,
    getSiteImprovements,
    searchOps,
    recordChannelSpend,
    analyzeWithCopilot,
    listPromotionCampaigns,
    generatePromotionDraft,
    applyPromotion,
    setPromotionMode,
    handleOpsAction
} = require("./_lib/ops-service");

function getUrl(req) {
    return new URL(req.url || "/", `https://${req.headers.host || "localhost"}`);
}

function getRoutePath(req) {
    const url = getUrl(req);
    const routeFromQuery = url.searchParams.get("route");

    if (routeFromQuery) {
        return String(routeFromQuery).replace(/^\/+|\/+$/g, "");
    }

    const prefix = "/api/ops/";
    const pathname = url.pathname.startsWith(prefix)
        ? url.pathname.slice(prefix.length)
        : "";

    return pathname.replace(/^\/+|\/+$/g, "");
}

function allow(res, methods) {
    res.setHeader("Allow", methods.join(", "));
}

function methodNotAllowed(res, methods) {
    allow(res, methods);
    return sendJson(res, 405, {
        ok: false,
        status: "method_not_allowed"
    });
}

function hasAlertSecret(req) {
    const expected = String(process.env.OPS_ALERT_SECRET || "");
    const provided = String(req.headers["x-ops-alert-secret"] || "");
    return Boolean(expected && provided && expected === provided);
}

function hasCronSecret(req) {
    const expected = String(process.env.CRON_SECRET || "");
    const authHeader = String(req.headers.authorization || "");
    const bearer = authHeader.startsWith("Bearer ")
        ? authHeader.slice("Bearer ".length).trim()
        : "";

    if (expected && bearer) {
        return expected === bearer;
    }

    return false;
}

module.exports = async function handler(req, res) {
    const routePath = getRoutePath(req);

    if (req.method === "OPTIONS") {
        return sendJson(res, 204, {});
    }

    if (routePath === "login") {
        if (req.method !== "POST") {
            return methodNotAllowed(res, ["POST", "OPTIONS"]);
        }

        let body = {};

        try {
            body = await readJsonBody(req);
        } catch (error) {
            return sendJson(res, 400, {
                ok: false,
                status: "invalid_json"
            });
        }

        if (!verifyPassword(body.password)) {
            return sendJson(res, 401, {
                ok: false,
                status: "invalid_password",
                message: "Senha da retaguarda invalida."
            });
        }

        setOpsSession(req, res);
        return sendJson(res, 200, {
            ok: true,
            status: "authenticated"
        });
    }

    if (routePath === "logout") {
        if (req.method !== "POST") {
            return methodNotAllowed(res, ["POST", "OPTIONS"]);
        }

        clearOpsSession(req, res);
        return sendJson(res, 200, {
            ok: true,
            status: "logged_out"
        });
    }

    if (routePath === "billing-alert") {
        if (req.method !== "POST") {
            return methodNotAllowed(res, ["POST", "OPTIONS"]);
        }

        if (!hasAlertSecret(req) && !requireOpsSession(req).ok) {
            return sendJson(res, 401, {
                ok: false,
                status: "unauthorized"
            });
        }

        let body = {};

        try {
            body = await readJsonBody(req);
        } catch (error) {
            return sendJson(res, 400, {
                ok: false,
                status: "invalid_json"
            });
        }

        const alert = await recordOpsAlert(body);

        if (String(body.eventType || "").includes("paid_lane")) {
            const state = await getPrimaryOpsState();
            await savePrimaryOpsState({
                lanes: {
                    ...state.lanes,
                    premiumLanePaused: true
                }
            });
        }

        return sendJson(res, alert.ok ? 200 : 400, {
            ok: alert.ok,
            status: alert.ok ? "alert_recorded" : "alert_failed"
        });
    }

    if (routePath === "reviews/three-day-run") {
        if (!["GET", "POST"].includes(req.method)) {
            return methodNotAllowed(res, ["GET", "POST", "OPTIONS"]);
        }

        if (!hasCronSecret(req) && !requireOpsSession(req).ok) {
            return sendJson(res, 401, {
                ok: false,
                status: "unauthorized"
            });
        }

        let body = {};
        if (req.method === "POST") {
            try {
                body = await readJsonBody(req);
            } catch (error) {
                return sendJson(res, 400, {
                    ok: false,
                    status: "invalid_json"
                });
            }
        }

        const result = await runThreeDayReview({
            force: req.method === "POST",
            provider: body.provider || "fallback"
        });
        return sendJson(res, result.ok ? 200 : 429, result);
    }

    if (routePath === "health/daily-run") {
        if (!["GET", "POST"].includes(req.method)) {
            return methodNotAllowed(res, ["GET", "POST", "OPTIONS"]);
        }

        if (!hasCronSecret(req) && !requireOpsSession(req).ok) {
            return sendJson(res, 401, {
                ok: false,
                status: "unauthorized"
            });
        }

        let body = {};
        if (req.method === "POST") {
            try {
                body = await readJsonBody(req);
            } catch (error) {
                return sendJson(res, 400, {
                    ok: false,
                    status: "invalid_json"
                });
            }
        }

        const result = await runDailyHealthCheck({
            force: req.method === "POST",
            provider: body.provider || "fallback"
        });
        return sendJson(res, result.ok ? 200 : 429, result);
    }

    if (!requireOpsSession(req, res).ok) {
        return;
    }

    if (routePath === "overview") {
        if (req.method !== "GET") {
            return methodNotAllowed(res, ["GET", "OPTIONS"]);
        }

        return sendJson(res, 200, await getOverview());
    }

    if (routePath === "alerts") {
        if (req.method !== "GET") {
            return methodNotAllowed(res, ["GET", "OPTIONS"]);
        }

        return sendJson(res, 200, await listOpsAlerts());
    }

    if (routePath === "payments") {
        if (req.method !== "GET") {
            return methodNotAllowed(res, ["GET", "OPTIONS"]);
        }

        const overview = await getOverview();
        return sendJson(res, 200, {
            ok: true,
            recentPayments: overview.recentPayments || [],
            recentEntitlements: overview.recentEntitlements || []
        });
    }

    if (routePath === "payments/status") {
        if (req.method !== "GET") {
            return methodNotAllowed(res, ["GET", "OPTIONS"]);
        }

        return sendJson(res, 200, await getPaymentsStatus());
    }

    if (routePath === "search") {
        if (req.method !== "GET") {
            return methodNotAllowed(res, ["GET", "OPTIONS"]);
        }

        const query = getUrl(req).searchParams.get("query") || "";
        return sendJson(res, 200, await searchOps(query));
    }

    if (routePath === "actions") {
        if (req.method !== "POST") {
            return methodNotAllowed(res, ["POST", "OPTIONS"]);
        }

        let body = {};

        try {
            body = await readJsonBody(req);
        } catch (error) {
            return sendJson(res, 400, {
                ok: false,
                status: "invalid_json"
            });
        }

        const result = await handleOpsAction(body);
        return sendJson(res, result.ok ? 200 : 400, result);
    }

    if (routePath === "change-requests") {
        if (req.method === "GET") {
            const url = getUrl(req);
            return sendJson(res, 200, await listChangeRequests({
                status: url.searchParams.get("status") || "",
                limit: Number(url.searchParams.get("limit") || 50)
            }));
        }

        if (req.method === "POST") {
            let body = {};

            try {
                body = await readJsonBody(req);
            } catch (error) {
                return sendJson(res, 400, {
                    ok: false,
                    status: "invalid_json"
                });
            }

            const result = await createChangeRequest(body);
            return sendJson(res, result.ok ? 200 : 400, result);
        }

        return methodNotAllowed(res, ["GET", "POST", "OPTIONS"]);
    }

    if (routePath === "change-requests/approve") {
        if (req.method !== "POST") {
            return methodNotAllowed(res, ["POST", "OPTIONS"]);
        }

        let body = {};

        try {
            body = await readJsonBody(req);
        } catch (error) {
            return sendJson(res, 400, {
                ok: false,
                status: "invalid_json"
            });
        }

        const result = await approveChangeRequest(body);
        return sendJson(res, result.ok ? 200 : 400, result);
    }

    if (routePath === "change-requests/reject") {
        if (req.method !== "POST") {
            return methodNotAllowed(res, ["POST", "OPTIONS"]);
        }

        let body = {};

        try {
            body = await readJsonBody(req);
        } catch (error) {
            return sendJson(res, 400, {
                ok: false,
                status: "invalid_json"
            });
        }

        const result = await rejectChangeRequest(body);
        return sendJson(res, result.ok ? 200 : 400, result);
    }

    if (routePath === "change-requests/execute") {
        if (req.method !== "POST") {
            return methodNotAllowed(res, ["POST", "OPTIONS"]);
        }

        let body = {};

        try {
            body = await readJsonBody(req);
        } catch (error) {
            return sendJson(res, 400, {
                ok: false,
                status: "invalid_json"
            });
        }

        const result = await executeApprovedChangeRequest(body);
        return sendJson(res, result.ok ? 200 : 400, result);
    }

    if (routePath === "reviews") {
        if (req.method !== "GET") {
            return methodNotAllowed(res, ["GET", "OPTIONS"]);
        }

        const url = getUrl(req);
        return sendJson(res, 200, await listReviewRuns(Number(url.searchParams.get("limit") || 20)));
    }

    if (routePath === "reviews/run") {
        if (req.method !== "POST") {
            return methodNotAllowed(res, ["POST", "OPTIONS"]);
        }

        let body = {};
        try {
            body = await readJsonBody(req);
        } catch (error) {
            return sendJson(res, 400, {
                ok: false,
                status: "invalid_json"
            });
        }

        const result = await runThreeDayReview({
            force: true,
            runType: "manual_review",
            provider: body.provider || "fallback"
        });
        return sendJson(res, result.ok ? 200 : 429, result);
    }

    if (routePath === "site-improvements") {
        if (req.method !== "GET") {
            return methodNotAllowed(res, ["GET", "OPTIONS"]);
        }

        return sendJson(res, 200, await getSiteImprovements());
    }

    if (routePath === "growth/overview") {
        if (req.method !== "GET") {
            return methodNotAllowed(res, ["GET", "OPTIONS"]);
        }

        return sendJson(res, 200, await getGrowthOverview());
    }

    if (routePath === "growth/spend") {
        if (req.method !== "POST") {
            return methodNotAllowed(res, ["POST", "OPTIONS"]);
        }

        let body = {};

        try {
            body = await readJsonBody(req);
        } catch (error) {
            return sendJson(res, 400, {
                ok: false,
                status: "invalid_json"
            });
        }

        const result = await recordChannelSpend(body);
        return sendJson(res, result.ok ? 200 : 400, {
            ok: result.ok,
            status: result.ok ? "spend_recorded" : "spend_failed",
            data: result.data
        });
    }

    if (routePath === "copilot/analyze") {
        if (req.method !== "POST") {
            return methodNotAllowed(res, ["POST", "OPTIONS"]);
        }

        let body = {};

        try {
            body = await readJsonBody(req);
        } catch (error) {
            return sendJson(res, 400, {
                ok: false,
                status: "invalid_json"
            });
        }

        const result = await analyzeWithCopilot(body.scope || "manual", body);
        return sendJson(res, result.ok ? 200 : 429, result);
    }

    if (routePath === "reports/weekly") {
        if (req.method !== "GET") {
            return methodNotAllowed(res, ["GET", "OPTIONS"]);
        }

        return sendJson(res, 200, await getWeeklyReport());
    }

    if (routePath === "ai/memory") {
        if (req.method === "GET") {
            return sendJson(res, 200, {
                ok: true,
                memory: await getOpsAiMemory()
            });
        }

        if (req.method === "POST") {
            let body = {};

            try {
                body = await readJsonBody(req);
            } catch (error) {
                return sendJson(res, 400, {
                    ok: false,
                    status: "invalid_json"
                });
            }

            return sendJson(res, 200, {
                ok: true,
                memory: await saveOpsAiMemory(body.memory || body)
            });
        }

        return methodNotAllowed(res, ["GET", "POST", "OPTIONS"]);
    }

    if (routePath === "marketing/content") {
        if (req.method !== "GET") {
            return methodNotAllowed(res, ["GET", "OPTIONS"]);
        }

        return sendJson(res, 200, await getMarketingContentQueue());
    }

    if (routePath === "marketing/integrations") {
        if (req.method !== "GET") {
            return methodNotAllowed(res, ["GET", "OPTIONS"]);
        }

        return sendJson(res, 200, await getMarketingIntegrations());
    }

    if (routePath === "marketing/content/generate") {
        if (req.method !== "POST") {
            return methodNotAllowed(res, ["POST", "OPTIONS"]);
        }

        let body = {};

        try {
            body = await readJsonBody(req);
        } catch (error) {
            return sendJson(res, 400, {
                ok: false,
                status: "invalid_json"
            });
        }

        return sendJson(res, 200, await generateMarketingContentQueue({
            ...body,
            source: "ops_console"
        }));
    }

    if (routePath === "marketing/content/status") {
        if (req.method !== "POST") {
            return methodNotAllowed(res, ["POST", "OPTIONS"]);
        }

        let body = {};

        try {
            body = await readJsonBody(req);
        } catch (error) {
            return sendJson(res, 400, {
                ok: false,
                status: "invalid_json"
            });
        }

        const result = await updateMarketingContentItem(body);
        return sendJson(res, result.ok ? 200 : 400, result);
    }

    if (routePath === "marketing/content/prepare") {
        if (req.method !== "POST") {
            return methodNotAllowed(res, ["POST", "OPTIONS"]);
        }

        let body = {};

        try {
            body = await readJsonBody(req);
        } catch (error) {
            return sendJson(res, 400, {
                ok: false,
                status: "invalid_json"
            });
        }

        const result = await prepareMarketingContentIntegration(body);
        return sendJson(res, result.ok ? 200 : 400, result);
    }

    if (routePath === "marketing/content/schedule-buffer") {
        if (req.method !== "POST") {
            return methodNotAllowed(res, ["POST", "OPTIONS"]);
        }

        let body = {};

        try {
            body = await readJsonBody(req);
        } catch (error) {
            return sendJson(res, 400, {
                ok: false,
                status: "invalid_json"
            });
        }

        const result = await scheduleMarketingContentWithBuffer(body);
        return sendJson(res, result.ok ? 200 : 400, result);
    }

    if (routePath === "marketing/buffer/channels") {
        if (req.method !== "GET") {
            return methodNotAllowed(res, ["GET", "OPTIONS"]);
        }

        const result = await getBufferOrganizationsAndChannels();
        return sendJson(res, result.ok ? 200 : 400, result);
    }

    if (routePath === "marketing/content/publish-instagram") {
        if (req.method !== "POST") {
            return methodNotAllowed(res, ["POST", "OPTIONS"]);
        }

        let body = {};

        try {
            body = await readJsonBody(req);
        } catch (error) {
            return sendJson(res, 400, {
                ok: false,
                status: "invalid_json"
            });
        }

        const result = await publishMarketingContentToInstagram(body);
        return sendJson(res, result.ok ? 200 : 400, result);
    }

    if (routePath === "promotions") {
        if (req.method !== "GET") {
            return methodNotAllowed(res, ["GET", "OPTIONS"]);
        }

        const [campaigns, state] = await Promise.all([
            listPromotionCampaigns(),
            getPrimaryOpsState()
        ]);

        return sendJson(res, 200, {
            ok: true,
            mode: state.promotionMode,
            channels: state.promotionChannels,
            items: campaigns.items
        });
    }

    if (routePath === "promotions/generate") {
        if (req.method !== "POST") {
            return methodNotAllowed(res, ["POST", "OPTIONS"]);
        }

        let body = {};

        try {
            body = await readJsonBody(req);
        } catch (error) {
            return sendJson(res, 400, {
                ok: false,
                status: "invalid_json"
            });
        }

        const result = await generatePromotionDraft(body);
        return sendJson(res, result.ok ? 200 : 400, result);
    }

    if (routePath === "promotions/apply") {
        if (req.method !== "POST") {
            return methodNotAllowed(res, ["POST", "OPTIONS"]);
        }

        let body = {};

        try {
            body = await readJsonBody(req);
        } catch (error) {
            return sendJson(res, 400, {
                ok: false,
                status: "invalid_json"
            });
        }

        const result = await applyPromotion(body);
        return sendJson(res, result.ok ? 200 : 400, result);
    }

    if (routePath === "promotions/mode") {
        if (req.method !== "POST") {
            return methodNotAllowed(res, ["POST", "OPTIONS"]);
        }

        let body = {};

        try {
            body = await readJsonBody(req);
        } catch (error) {
            return sendJson(res, 400, {
                ok: false,
                status: "invalid_json"
            });
        }

        return sendJson(res, 200, await setPromotionMode(body.mode));
    }

    return sendJson(res, 404, {
        ok: false,
        status: "not_found"
    });
};

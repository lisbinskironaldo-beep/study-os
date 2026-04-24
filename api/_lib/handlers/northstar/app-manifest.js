const { sendJson } = require("../../json");

module.exports = async function handler(req, res) {
    if (req.method !== "GET") {
        return sendJson(res, 405, {
            ok: false,
            status: "method_not_allowed"
        });
    }

    const host = req.headers["x-forwarded-host"] || req.headers.host || "localhost:3000";
    const proto = req.headers["x-forwarded-proto"] || "https";
    const baseUrl = `${proto}://${host}`;

    return sendJson(res, 200, {
        ok: true,
        name: "NorthStar Control Plane",
        description: "App do ChatGPT para operar o NorthStar com leitura ampla, preparo de mudancas e execucao por aprovacao.",
        appUrl: process.env.OPENAI_APP_PUBLIC_URL || `${baseUrl}/ops/`,
        mcpServerUrl: process.env.OPENAI_MCP_SERVER_URL || `${baseUrl}/api/northstar-mcp`,
        auth: {
            type: "mixed",
            publicTools: [
                "get_ecosystem_overview",
                "get_ops_overview",
                "get_payments_status",
                "get_growth_overview",
                "get_apps_workspace",
                "get_alerts",
                "get_site_improvements",
                "create_change_request",
                "list_change_requests"
            ],
            privilegedTools: [
                "approve_change_request",
                "reject_change_request",
                "execute_approved_change_request"
            ],
            env: "OPENAI_MCP_API_KEY"
        },
        docs: [
            `${baseUrl}/docs/northstar_current_state.md`,
            `${baseUrl}/docs/northstar_ai_ops_policy.md`,
            `${baseUrl}/docs/northstar_go_live_monetization.md`,
            `${baseUrl}/docs/northstar_three_day_growth_loop.md`
        ]
    });
};

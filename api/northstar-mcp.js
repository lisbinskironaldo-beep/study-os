const { sendJson, readJsonBody } = require("./_lib/json");
const {
    getOverview,
    getPaymentsStatus,
    getGrowthOverview,
    getAppsWorkspace,
    listOpsAlerts,
    getSiteImprovements,
    listChangeRequests,
    createChangeRequest,
    approveChangeRequest,
    rejectChangeRequest,
    executeApprovedChangeRequest,
    insertAuditLog
} = require("./_lib/ops-service");

const DEFAULT_PROTOCOL_VERSION = "2025-03-26";

function isAuthorized(req) {
    const expected = String(process.env.OPENAI_MCP_API_KEY || "");
    const authHeader = String(req.headers.authorization || "");
    const bearer = authHeader.startsWith("Bearer ")
        ? authHeader.slice("Bearer ".length).trim()
        : "";

    return Boolean(expected && bearer && bearer === expected);
}

function normalizeObjectSchema(properties = {}, required = []) {
    return {
        type: "object",
        properties,
        additionalProperties: false,
        required
    };
}

const ALL_TOOLS = [
    {
        name: "get_ecosystem_overview",
        title: "Get Ecosystem Overview",
        description: "Resumo consolidado do NorthStar e do RotaNota.",
        inputSchema: normalizeObjectSchema(),
        readOnlyHint: true
    },
    {
        name: "get_ops_overview",
        title: "Get Ops Overview",
        description: "Overview operacional atual do hub.",
        inputSchema: normalizeObjectSchema(),
        readOnlyHint: true
    },
    {
        name: "get_payments_status",
        title: "Get Payments Status",
        description: "Status de pagamentos, webhook e entitlements.",
        inputSchema: normalizeObjectSchema(),
        readOnlyHint: true
    },
    {
        name: "get_growth_overview",
        title: "Get Growth Overview",
        description: "Resumo de growth e canais.",
        inputSchema: normalizeObjectSchema(),
        readOnlyHint: true
    },
    {
        name: "get_apps_workspace",
        title: "Get Apps Workspace",
        description: "Workspace multi-app do ecossistema.",
        inputSchema: normalizeObjectSchema(),
        readOnlyHint: true
    },
    {
        name: "get_alerts",
        title: "Get Alerts",
        description: "Alertas recentes do NorthStar.",
        inputSchema: normalizeObjectSchema({
            limit: {
                type: "number",
                description: "Quantidade maxima de alertas."
            }
        }),
        readOnlyHint: true
    },
    {
        name: "get_site_improvements",
        title: "Get Site Improvements",
        description: "Melhorias abertas e sugeridas para o site.",
        inputSchema: normalizeObjectSchema({
            limit: {
                type: "number",
                description: "Quantidade maxima de melhorias."
            }
        }),
        readOnlyHint: true
    },
    {
        name: "create_change_request",
        title: "Create Change Request",
        description: "Cria uma solicitacao de mudanca preparada para aprovacao.",
        inputSchema: normalizeObjectSchema({
            reviewRunId: {
                type: "string",
                description: "ID opcional da review run associada."
            },
            targetSystem: {
                type: "string",
                description: "Sistema alvo da mudanca."
            },
            actionType: {
                type: "string",
                description: "Tipo da acao preparada."
            },
            payload: {
                type: "object",
                description: "Payload JSON da change request."
            },
            preparedBy: {
                type: "string",
                description: "Autor da solicitacao."
            }
        }, ["targetSystem", "actionType"]),
        readOnlyHint: false
    },
    {
        name: "list_change_requests",
        title: "List Change Requests",
        description: "Lista change requests e seus status.",
        inputSchema: normalizeObjectSchema({
            limit: {
                type: "number",
                description: "Quantidade maxima de registros."
            },
            status: {
                type: "string",
                description: "Filtro opcional por status."
            }
        }),
        readOnlyHint: true
    },
    {
        name: "approve_change_request",
        title: "Approve Change Request",
        description: "Aprova uma change request.",
        inputSchema: normalizeObjectSchema({
            changeRequestId: {
                type: "string",
                description: "ID da change request."
            },
            approvalNotes: {
                type: "string",
                description: "Notas opcionais de aprovacao."
            },
            approvedBy: {
                type: "string",
                description: "Ator responsavel pela aprovacao."
            }
        }, ["changeRequestId"]),
        readOnlyHint: false
    },
    {
        name: "reject_change_request",
        title: "Reject Change Request",
        description: "Rejeita uma change request.",
        inputSchema: normalizeObjectSchema({
            changeRequestId: {
                type: "string",
                description: "ID da change request."
            },
            approvalNotes: {
                type: "string",
                description: "Motivo opcional da rejeicao."
            },
            rejectedBy: {
                type: "string",
                description: "Ator responsavel pela rejeicao."
            }
        }, ["changeRequestId"]),
        readOnlyHint: false
    },
    {
        name: "execute_approved_change_request",
        title: "Execute Approved Change Request",
        description: "Executa uma change request aprovada.",
        inputSchema: normalizeObjectSchema({
            changeRequestId: {
                type: "string",
                description: "ID da change request aprovada."
            },
            executedBy: {
                type: "string",
                description: "Ator responsavel pela execucao."
            }
        }, ["changeRequestId"]),
        readOnlyHint: false
    }
];

const PUBLIC_TOOL_NAMES = new Set([
    "get_ecosystem_overview",
    "get_ops_overview",
    "get_payments_status",
    "get_growth_overview",
    "get_apps_workspace",
    "get_alerts",
    "get_site_improvements",
    "create_change_request",
    "list_change_requests"
]);

function buildTools(authorized = false) {
    return ALL_TOOLS
        .filter((tool) => authorized || PUBLIC_TOOL_NAMES.has(tool.name))
        .map((tool) => ({
            name: tool.name,
            title: tool.title,
            description: tool.description,
            inputSchema: tool.inputSchema,
            annotations: {
                readOnlyHint: Boolean(tool.readOnlyHint)
            }
        }));
}

function canExecuteTool(name, authorized = false) {
    return authorized || PUBLIC_TOOL_NAMES.has(name);
}

async function executeTool(name, args = {}) {
    if (name === "get_ecosystem_overview" || name === "get_ops_overview") {
        return getOverview();
    }

    if (name === "get_payments_status") {
        return getPaymentsStatus();
    }

    if (name === "get_growth_overview") {
        return getGrowthOverview();
    }

    if (name === "get_apps_workspace") {
        return getAppsWorkspace();
    }

    if (name === "get_alerts") {
        return listOpsAlerts(Number(args.limit || 50));
    }

    if (name === "get_site_improvements") {
        return getSiteImprovements(Number(args.limit || 20));
    }

    if (name === "create_change_request") {
        return createChangeRequest(args);
    }

    if (name === "list_change_requests") {
        return listChangeRequests(args);
    }

    if (name === "approve_change_request") {
        return approveChangeRequest(args);
    }

    if (name === "reject_change_request") {
        return rejectChangeRequest(args);
    }

    if (name === "execute_approved_change_request") {
        return executeApprovedChangeRequest(args);
    }

    return {
        ok: false,
        status: "unknown_tool"
    };
}

function getBaseUrl(req) {
    const host = req.headers["x-forwarded-host"] || req.headers.host || "localhost:3000";
    const proto = req.headers["x-forwarded-proto"] || "https";
    return `${proto}://${host}`;
}

function sendRpcJson(res, statusCode, payload, protocolVersion = DEFAULT_PROTOCOL_VERSION) {
    res.statusCode = statusCode;
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    res.setHeader("MCP-Protocol-Version", protocolVersion);
    res.end(JSON.stringify(payload));
}

function sendRpcNoContent(res, statusCode = 202, protocolVersion = DEFAULT_PROTOCOL_VERSION) {
    res.statusCode = statusCode;
    res.setHeader("MCP-Protocol-Version", protocolVersion);
    res.end();
}

function jsonRpcResult(id, result) {
    return {
        jsonrpc: "2.0",
        id,
        result
    };
}

function jsonRpcError(id, code, message, data) {
    return {
        jsonrpc: "2.0",
        id: typeof id === "undefined" ? null : id,
        error: {
            code,
            message,
            ...(typeof data === "undefined" ? {} : { data })
        }
    };
}

function getNegotiatedProtocolVersion(req, body = {}) {
    return String(
        (body.params && body.params.protocolVersion)
        || req.headers["mcp-protocol-version"]
        || DEFAULT_PROTOCOL_VERSION
    );
}

function summarizeResult(name, result) {
    if (result && typeof result.summary === "string" && result.summary.trim()) {
        return result.summary.trim();
    }

    if (result && typeof result.status === "string" && result.status.trim()) {
        return `${name}: ${result.status.trim()}`;
    }

    return `${name} executado com sucesso no NorthStar.`;
}

function buildToolCallResult(name, result) {
    if (result && result.ok === false) {
        return {
            content: [
                {
                    type: "text",
                    text: `Falha em ${name}: ${result.message || result.status || "erro"}`
                }
            ],
            structuredContent: result,
            isError: true
        };
    }

    return {
        content: [
            {
                type: "text",
                text: summarizeResult(name, result || {})
            }
        ],
        structuredContent: result || {}
    };
}

function sendLegacySseProbe(req, res) {
    const endpointUrl = `${getBaseUrl(req)}${req.url}`;
    res.statusCode = 200;
    res.setHeader("Content-Type", "text/event-stream; charset=utf-8");
    res.setHeader("Cache-Control", "no-cache, no-transform");
    res.setHeader("Connection", "keep-alive");
    res.write(`event: endpoint\ndata: ${endpointUrl}\n\n`);
    res.write("retry: 3000\n\n");
    res.end();
}

module.exports = async function handler(req, res) {
    if (req.method === "OPTIONS") {
        res.statusCode = 204;
        res.end();
        return;
    }

    const authorized = isAuthorized(req);

    if (req.method === "GET") {
        const accept = String(req.headers.accept || "");

        if (accept.includes("text/event-stream")) {
            return sendLegacySseProbe(req, res);
        }

        return sendJson(res, 405, {
            ok: false,
            status: "method_not_allowed",
            message: "Use HTTP POST com JSON-RPC MCP neste endpoint."
        });
    }

    if (req.method === "DELETE") {
        return sendRpcNoContent(res, 405);
    }

    if (req.method !== "POST") {
        return sendJson(res, 405, {
            ok: false,
            status: "method_not_allowed"
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

    const protocolVersion = getNegotiatedProtocolVersion(req, body);
    const method = String(body.method || "").trim();
    const id = body.id;

    if (!method) {
        return sendRpcJson(res, 400, jsonRpcError(id, -32600, "Invalid Request"), protocolVersion);
    }

    if (method === "initialize") {
        return sendRpcJson(res, 200, jsonRpcResult(id, {
            protocolVersion,
            capabilities: {
                tools: {
                    listChanged: false
                }
            },
            serverInfo: {
                name: "northstar-control-plane",
                title: "NorthStar Control Plane",
                version: "1.0.0",
                description: "Servidor MCP do NorthStar para leitura ampla, preparo de mudancas e execucao por aprovacao."
            },
            instructions: "Use as ferramentas de leitura livremente. Crie change requests para preparar mudancas. Aprovacao e execucao privilegiada ficam fora do modo publico."
        }), protocolVersion);
    }

    if (method === "notifications/initialized") {
        return sendRpcNoContent(res, 202, protocolVersion);
    }

    if (method === "ping") {
        return sendRpcJson(res, 200, jsonRpcResult(id, {}), protocolVersion);
    }

    if (method === "tools/list") {
        return sendRpcJson(res, 200, jsonRpcResult(id, {
            tools: buildTools(authorized)
        }), protocolVersion);
    }

    if (method === "tools/call") {
        const toolName = String(body.params && body.params.name || "").trim();
        const args = body.params && body.params.arguments && typeof body.params.arguments === "object"
            ? body.params.arguments
            : {};

        if (!toolName) {
            return sendRpcJson(res, 400, jsonRpcError(id, -32602, "Missing tool name"), protocolVersion);
        }

        if (!canExecuteTool(toolName, authorized)) {
            return sendRpcJson(res, 403, jsonRpcError(id, -32001, "Unauthorized tool access", {
                tool: toolName
            }), protocolVersion);
        }

        const result = await executeTool(toolName, args);
        await insertAuditLog({
            eventType: "mcp_tool_call",
            actor: authorized ? "openai_chatgpt_bearer" : "openai_chatgpt_public",
            targetSystem: "northstar_mcp",
            entityType: "tool",
            entityId: toolName,
            status: result.ok ? "ok" : "error",
            metadata: {
                method,
                arguments: args
            }
        });

        return sendRpcJson(res, result.ok === false ? 400 : 200, jsonRpcResult(id, buildToolCallResult(toolName, result)), protocolVersion);
    }

    return sendRpcJson(res, 400, jsonRpcError(id, -32601, "Method not found", {
        method
    }), protocolVersion);
};

(function () {
    if (window.PremiumStudyPdfWorkbench) {
        return;
    }

    const CHANNEL = "rotanota-premium-pdf-workbench";
    const VIEWER_URL = "premium-study/pdf-workbench/viewer.html";

    function normalizeText(value) {
        return String(value || "")
            .normalize("NFKD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/\s+/g, " ")
            .trim();
    }

    async function buildPdfAssetHash(file) {
        if (!file || typeof file.arrayBuffer !== "function") {
            return "";
        }

        if (!window.crypto || !window.crypto.subtle) {
            const fallback = [
                String(file.name || "").trim().toLowerCase(),
                Number(file.size || 0),
                String(file.type || "").trim().toLowerCase()
            ].join("|");

            return `pdf_${normalizeText(fallback).replace(/\s+/g, "-")}`;
        }

        const digest = await window.crypto.subtle.digest(
            "SHA-256",
            await file.arrayBuffer()
        );

        return Array.from(new Uint8Array(digest))
            .map((byte) => byte.toString(16).padStart(2, "0"))
            .join("");
    }

    function createRequestId() {
        if (window.crypto && typeof window.crypto.randomUUID === "function") {
            return window.crypto.randomUUID();
        }

        return `pdf-req-${Date.now()}-${Math.random().toString(16).slice(2)}`;
    }

    function bufferToBase64(buffer) {
        const bytes = buffer instanceof Uint8Array
            ? buffer
            : new Uint8Array(buffer || []);
        let binary = "";

        bytes.forEach((byte) => {
            binary += String.fromCharCode(byte);
        });

        return window.btoa(binary);
    }

    function createBridge(iframe, handlers = {}) {
        if (!iframe) {
            return null;
        }

        const pending = new Map();
        let ready = false;
        let readyResolver = null;
        let readyRejector = null;
        let pingTimer = null;
        let readyTimer = null;
        const readyPromise = new Promise((resolve, reject) => {
            readyResolver = resolve;
            readyRejector = reject;
        });

        const markReady = () => {
            if (ready) {
                return;
            }

            ready = true;

            if (pingTimer) {
                window.clearInterval(pingTimer);
                pingTimer = null;
            }

            if (readyTimer) {
                window.clearTimeout(readyTimer);
                readyTimer = null;
            }

            if (readyResolver) {
                readyResolver(true);
            }
        };

        const startReadyHandshake = () => {
            if (pingTimer || ready) {
                return;
            }

            const sendPing = () => {
                if (!iframe.contentWindow) {
                    return;
                }

                iframe.contentWindow.postMessage({
                    channel: CHANNEL,
                    direction: "request",
                    requestId: createRequestId(),
                    type: "ping",
                    payload: {}
                }, window.location.origin);
            };

            pingTimer = window.setInterval(sendPing, 180);
            readyTimer = window.setTimeout(() => {
                if (ready) {
                    return;
                }

                if (pingTimer) {
                    window.clearInterval(pingTimer);
                    pingTimer = null;
                }

                if (readyRejector) {
                    readyRejector(new Error("viewer_not_ready"));
                }
            }, 7000);

            sendPing();
        };

        const onMessage = (event) => {
            const data = event && event.data ? event.data : null;

            if (!data || data.channel !== CHANNEL || event.source !== iframe.contentWindow) {
                return;
            }

            if (data.direction === "response" && data.requestId) {
                markReady();
                const resolver = pending.get(data.requestId);

                if (!resolver) {
                    return;
                }

                pending.delete(data.requestId);

                if (data.ok === false) {
                    resolver.reject(new Error(data.error || "viewer_request_failed"));
                    return;
                }

                resolver.resolve(data.payload);
                return;
            }

            if (data.direction === "event") {
                if (data.event === "viewerReady") {
                    markReady();
                }

                if (handlers && typeof handlers[data.event] === "function") {
                    handlers[data.event](data.payload || {});
                }
            }
        };

        window.addEventListener("message", onMessage);
        startReadyHandshake();

        return {
            iframe,
            async request(type, payload = {}) {
                const requestId = createRequestId();
                await readyPromise;

                return new Promise((resolve, reject) => {
                    const timeoutId = window.setTimeout(() => {
                        pending.delete(requestId);
                        reject(new Error("viewer_request_timeout"));
                    }, 12000);

                    pending.set(requestId, {
                        resolve: (value) => {
                            window.clearTimeout(timeoutId);
                            resolve(value);
                        },
                        reject: (error) => {
                            window.clearTimeout(timeoutId);
                            reject(error);
                        }
                    });
                    iframe.contentWindow.postMessage({
                        channel: CHANNEL,
                        direction: "request",
                        requestId,
                        type,
                        payload
                    }, window.location.origin);
                });
            },

            destroy() {
                if (pingTimer) {
                    window.clearInterval(pingTimer);
                }
                if (readyTimer) {
                    window.clearTimeout(readyTimer);
                }
                pending.forEach((resolver) => resolver.reject(new Error("viewer_bridge_destroyed")));
                pending.clear();
                window.removeEventListener("message", onMessage);
            }
        };
    }

    function createObjectUrl(blob) {
        return blob instanceof Blob ? window.URL.createObjectURL(blob) : "";
    }

    function revokeObjectUrl(url) {
        if (!url) {
            return;
        }

        try {
            window.URL.revokeObjectURL(url);
        } catch (_error) {
            // Ignora URLs ja revogadas.
        }
    }

    async function uploadAsset({
        assetId,
        assetHash,
        fileName,
        mimeType,
        pageCount,
        customerId
    }, file) {
        const normalizedFileName = fileName || file.name || "material.pdf";
        const normalizedMimeType = mimeType || file.type || "application/pdf";
        const initResponse = await fetch("/api/premium/pdf-assets/upload-url", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                assetId: assetId || "",
                assetHash: assetHash || "",
                fileName: normalizedFileName,
                mimeType: normalizedMimeType,
                byteSize: Number(file && file.size ? file.size : 0) || 0,
                pageCount: Number(pageCount || 0) || 0,
                customerId: customerId || ""
            })
        });
        const initData = await initResponse.json().catch(() => null);

        if (!initResponse.ok || !initData || !initData.ok || !initData.signedUrl) {
            return {
                ok: false,
                status: initData && initData.status ? initData.status : "signed_upload_init_failed",
                message: initData && initData.message
                    ? initData.message
                    : "Nao consegui preparar o upload direto do PDF premium."
            };
        }

        let uploadMessage = "";
        const uploadResponse = await fetch(initData.signedUrl, {
            method: "PUT",
            headers: {
                "Content-Type": normalizedMimeType,
                "cache-control": "3600",
                "x-upsert": "true"
            },
            body: file
        });
        const uploadText = await uploadResponse.text().catch(() => "");

        if (uploadText) {
            try {
                const parsed = JSON.parse(uploadText);
                uploadMessage = parsed && parsed.message
                    ? String(parsed.message)
                    : "";
            } catch (_error) {
                uploadMessage = String(uploadText || "").trim();
            }
        }

        if (!uploadResponse.ok) {
            return {
                ok: false,
                status: "signed_upload_failed",
                message: uploadMessage || "Nao foi possivel enviar o PDF premium para o armazenamento."
            };
        }

        const completeResponse = await fetch("/api/premium/pdf-assets/complete", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                assetId: initData.assetId || assetId || "",
                assetHash: initData.assetHash || assetHash || "",
                storagePath: initData.storagePath || "",
                fileName: normalizedFileName,
                mimeType: normalizedMimeType,
                byteSize: Number(file && file.size ? file.size : 0) || 0,
                pageCount: Number(pageCount || 0) || 0,
                customerId: customerId || ""
            })
        });
        const completeData = await completeResponse.json().catch(() => null);

        return {
            ok: Boolean(completeResponse.ok && completeData && completeData.ok),
            status: completeData && completeData.status ? completeData.status : completeResponse.ok ? "ok" : "request_failed",
            ...(completeData || {}),
            assetId: completeData && completeData.assetId ? completeData.assetId : (initData.assetId || assetId || ""),
            assetHash: completeData && completeData.assetHash ? completeData.assetHash : (initData.assetHash || assetHash || "")
        };
    }

    async function getRemoteAnnotations(assetId) {
        const response = await fetch(`/api/premium/pdf-assets/${encodeURIComponent(assetId)}/annotations`);
        const data = await response.json().catch(() => null);

        return {
            ok: Boolean(response.ok && data && data.ok),
            status: data && data.status ? data.status : response.ok ? "ok" : "request_failed",
            ...data
        };
    }

    async function saveRemoteAnnotations(assetId, payload = {}) {
        const response = await fetch(`/api/premium/pdf-assets/${encodeURIComponent(assetId)}/annotations`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
        });
        const data = await response.json().catch(() => null);

        return {
            ok: Boolean(response.ok && data && data.ok),
            status: data && data.status ? data.status : response.ok ? "ok" : "request_failed",
            ...data
        };
    }

    async function requestAiHighlights(assetId, payload = {}) {
        const response = await fetch(`/api/premium/pdf-assets/${encodeURIComponent(assetId || "local")}/ai-highlights`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
        });
        const data = await response.json().catch(() => null);

        return {
            ok: Boolean(response.ok && data && data.ok),
            status: data && data.status ? data.status : response.ok ? "ok" : "request_failed",
            ...data
        };
    }

    function serializeAnnotationEntries(serializable) {
        const map = serializable && serializable.map instanceof Map
            ? serializable.map
            : null;

        if (!map) {
            return [];
        }

        return Array.from(map.entries()).map(([key, value]) => ({
            key,
            value
        }));
    }

    function buildRemoteAssetUrl(assetId) {
        return `/api/premium/pdf-assets/${encodeURIComponent(assetId)}`;
    }

    window.PremiumStudyPdfWorkbench = {
        CHANNEL,
        VIEWER_URL,
        bufferToBase64,
        buildPdfAssetHash,
        buildRemoteAssetUrl,
        createBridge,
        createObjectUrl,
        getRemoteAnnotations,
        normalizeText,
        requestAiHighlights,
        revokeObjectUrl,
        saveRemoteAnnotations,
        serializeAnnotationEntries,
        uploadAsset
    };
})();

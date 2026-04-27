(function () {
    if (window.PremiumStudyGrowth) {
        return;
    }

    const STORAGE_KEY = "rotanota.premium.acquisition";
    const SESSION_PREFIX = "rotanota.premium.event.";
    let cachedContext = null;

    function readStoredContext() {
        if (cachedContext) {
            return { ...cachedContext };
        }

        try {
            const raw = window.localStorage.getItem(STORAGE_KEY);
            if (!raw) {
                return null;
            }

            const parsed = JSON.parse(raw);
            cachedContext = normalizeContext(parsed);
            return { ...cachedContext };
        } catch (error) {
            return null;
        }
    }

    function persistContext(context) {
        cachedContext = normalizeContext(context);

        try {
            window.localStorage.setItem(STORAGE_KEY, JSON.stringify(cachedContext));
        } catch (error) {
            // Ambiente pode bloquear storage; seguimos em memoria.
        }

        return { ...cachedContext };
    }

    function normalizeContext(input = {}) {
        return {
            channel: "internal_site",
            utmSource: String(input.utmSource || input.utm_source || "").trim(),
            utmMedium: String(input.utmMedium || input.utm_medium || "").trim(),
            utmCampaign: String(input.utmCampaign || input.utm_campaign || "").trim(),
            utmContent: String(input.utmContent || input.utm_content || "").trim(),
            referrer: String(input.referrer || document.referrer || "").trim(),
            landingPath: String(input.landingPath || input.landing_path || `${window.location.pathname}${window.location.search}`).trim()
        };
    }

    function captureAcquisitionContext() {
        const url = new URL(window.location.href);
        const stored = readStoredContext() || {};
        const nextContext = normalizeContext({
            ...stored,
            utm_source: url.searchParams.get("utm_source") || stored.utmSource || "",
            utm_medium: url.searchParams.get("utm_medium") || stored.utmMedium || "",
            utm_campaign: url.searchParams.get("utm_campaign") || stored.utmCampaign || "",
            utm_content: url.searchParams.get("utm_content") || stored.utmContent || "",
            referrer: document.referrer || stored.referrer || "",
            landing_path: `${window.location.pathname}${window.location.search}`
        });

        return persistContext(nextContext);
    }

    function getAcquisitionContext() {
        return captureAcquisitionContext();
    }

    async function hashString(value) {
        const source = String(value || "").trim();

        if (!source) {
            return "";
        }

        if (window.crypto && window.crypto.subtle && window.TextEncoder) {
            const bytes = new window.TextEncoder().encode(source);
            const digest = await window.crypto.subtle.digest("SHA-256", bytes);
            return Array.from(new Uint8Array(digest))
                .map((byte) => byte.toString(16).padStart(2, "0"))
                .join("")
                .slice(0, 40);
        }

        let hash = 0;
        for (let index = 0; index < source.length; index += 1) {
            hash = ((hash << 5) - hash) + source.charCodeAt(index);
            hash |= 0;
        }

        return `mh_${Math.abs(hash)}`;
    }

    async function buildMaterialHash(input = {}) {
        const fingerprint = [
            String(input.name || "").trim().toLowerCase(),
            Number(input.size || 0),
            Number(input.pageCount || 0),
            String(input.type || "").trim().toLowerCase()
        ].join("|");

        return hashString(fingerprint);
    }

    async function track(eventType, input = {}, options = {}) {
        if (!eventType) {
            return {
                ok: false,
                status: "missing_event_type"
            };
        }

        const context = options.captureAcquisition === false
            ? (readStoredContext() || normalizeContext({}))
            : captureAcquisitionContext();
        const identity = window.PremiumStudyIdentity;
        const customerId = input.customerId || (
            identity && typeof identity.getCustomerId === "function"
                ? identity.getCustomerId()
                : ""
        );

        const payload = {
            customerId,
            eventType,
            materialHash: String(input.materialHash || "").trim(),
            channel: "internal_site",
            utmSource: context.utmSource,
            utmMedium: context.utmMedium,
            utmCampaign: context.utmCampaign,
            utmContent: context.utmContent,
            referrer: context.referrer,
            landingPath: context.landingPath,
            metadata: input.metadata && typeof input.metadata === "object"
                ? input.metadata
                : {}
        };

        try {
            const response = await fetch("/api/premium/growth-event", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(payload)
            });
            const result = await response.json().catch(() => null);

            return {
                ok: response.ok && Boolean(result && result.ok),
                status: result && result.status ? result.status : "unknown"
            };
        } catch (error) {
            return {
                ok: false,
                status: "network_error"
            };
        }
    }

    async function trackOnce(key, eventType, input = {}, options = {}) {
        const eventKey = `${SESSION_PREFIX}${String(key || eventType)}`;

        try {
            if (window.sessionStorage.getItem(eventKey) === "1") {
                return {
                    ok: true,
                    status: "already_tracked"
                };
            }
        } catch (error) {
            // Seguimos sem dedupe persistido.
        }

        const result = await track(eventType, input, options);

        if (result.ok) {
            try {
                window.sessionStorage.setItem(eventKey, "1");
            } catch (error) {
                // Ignore falhas de storage.
            }
        }

        return result;
    }

    window.PremiumStudyGrowth = {
        captureAcquisitionContext,
        getAcquisitionContext,
        buildMaterialHash,
        track,
        trackOnce
    };
})();

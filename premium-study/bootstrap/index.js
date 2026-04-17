(function () {
    if (window.PremiumStudyBootstrap) {
        return;
    }

    const STYLE_ID = "premium-study-styles";
    const SCRIPT_MARK = "data-premium-study-src";
    const dependencies = [
        "premium-study/storage/indexeddb.js",
        "premium-study/services/access-control.js",
        "premium-study/services/pdf-validator.js",
        "premium-study/services/billing.js",
        "premium-study/services/ai.js",
        "premium-study/state/store.js",
        "premium-study/router/index.js",
        "premium-study/ui/components/index.js",
        "premium-study/ui/views/index.js",
        "premium-study/app/index.js"
    ];

    function ensureStyle() {
        if (document.getElementById(STYLE_ID)) {
            return;
        }

        const link = document.createElement("link");
        link.id = STYLE_ID;
        link.rel = "stylesheet";
        link.href = "premium-study/styles/premium-study.css";
        document.head.appendChild(link);
    }

    function loadScript(src) {
        return new Promise((resolve, reject) => {
            const existing = document.querySelector(`script[${SCRIPT_MARK}="${src}"]`);
            if (existing) {
                if (existing.dataset.loaded === "true") {
                    resolve();
                    return;
                }

                existing.addEventListener("load", () => resolve(), { once: true });
                existing.addEventListener("error", () => reject(new Error(`Falha ao carregar ${src}`)), { once: true });
                return;
            }

            const script = document.createElement("script");
            script.src = src;
            script.defer = true;
            script.setAttribute(SCRIPT_MARK, src);
            script.addEventListener("load", () => {
                script.dataset.loaded = "true";
                resolve();
            }, { once: true });
            script.addEventListener("error", () => reject(new Error(`Falha ao carregar ${src}`)), { once: true });
            document.body.appendChild(script);
        });
    }

    window.PremiumStudyBootstrap = {
        async init(options = {}) {
            ensureStyle();

            for (const dependency of dependencies) {
                await loadScript(dependency);
            }

            if (window.PremiumStudyApp && typeof window.PremiumStudyApp.init === "function") {
                window.PremiumStudyApp.init(options);
            }
        }
    };
})();

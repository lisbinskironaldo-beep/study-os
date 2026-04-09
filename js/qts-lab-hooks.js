(() => {
    const markerSpecs = [
        { n: 1, label: "Topo", selector: ".topbar", corner: "tl" },
        { n: 2, label: "Semanas", selector: "#qtsDetachedIndex .qts-detached-block.is-week", corner: "tl" },
        { n: 3, label: "Dias e horário", selector: "#qtsDetachedIndex .qts-detached-block.is-toggle", corner: "tl" },
        { n: 4, label: "Planejamento lateral", selector: "#qtsDetachedIndex .qts-detached-block.is-summary", corner: "tl" },
        { n: 5, label: "Método Pomodoro", selector: ".qts-template-strip", corner: "tl" },
        { n: 6, label: "Título", selector: ".qts-title", corner: "tr" },
        { n: 7, label: "Tabela", selector: ".qts-grid-shell", corner: "tl" },
        { n: 8, label: "Controles inferiores", selector: ".qts-controls", corner: "bl" },
        { n: 9, label: "Planejamento por matéria", selector: "#qtsSubjectSummary", corner: "tl", optional: true },
        { n: 10, label: "Trilho direito", selector: ".side-modules", corner: "tr" },
        { n: 11, label: "Rodapé", selector: ".footer", corner: "tl" }
    ];

    function clearMarkers() {
        document.querySelectorAll(".qts-lab-badge").forEach((badge) => badge.remove());
        document.querySelectorAll(".qts-lab-target").forEach((target) => {
            target.classList.remove("qts-lab-target");
            target.removeAttribute("data-lab-corner");
        });
    }

    function renderLegend(items) {
        const legend = document.getElementById("qtsLabLegend");

        if (!legend) {
            return;
        }

        legend.innerHTML = `
            <div class="qts-lab-legend-title">Mapa da Tela</div>
            <ol class="qts-lab-legend-list">
                ${items.join("")}
            </ol>
        `;
    }

    function applyMarkers() {
        clearMarkers();

        const legendItems = markerSpecs.map((spec) => {
            const target = document.querySelector(spec.selector);
            const visible = Boolean(target) && !target.hidden && getComputedStyle(target).display !== "none";

            if (visible && target) {
                target.classList.add("qts-lab-target");
                target.setAttribute("data-lab-corner", spec.corner || "tl");

                const badge = document.createElement("div");
                badge.className = "qts-lab-badge";
                badge.textContent = String(spec.n);
                target.appendChild(badge);
            }

            const suffix = !visible && spec.optional
                ? ' <span class="qts-lab-legend-note">(oculto)</span>'
                : "";

            return `
                <li class="qts-lab-legend-item">
                    <span class="qts-lab-legend-num">${spec.n}</span>
                    <span>${spec.label}${suffix}</span>
                </li>
            `;
        });

        renderLegend(legendItems);
    }

    document.addEventListener("DOMContentLoaded", () => {
        if (typeof QTS === "undefined") {
            return;
        }

        const originalRender = QTS.render.bind(QTS);

        QTS.render = function (...args) {
            const result = originalRender(...args);
            applyMarkers();
            return result;
        };

        applyMarkers();
    });
})();

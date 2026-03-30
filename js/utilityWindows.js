const UtilityWindows = {

    root: null,
    zIndexSeed: 1400,
    activeDrag: null,
    boundPointerMove: null,
    boundPointerUp: null,

    tools: {
        stopwatch: {
            title: "Cronometro",
            open: false,
            seconds: 0,
            interval: null
        },
        timer: {
            title: "Timer",
            open: false,
            total: 0,
            remaining: 0,
            interval: null,
            fields: {
                hours: "00",
                minutes: "00",
                seconds: "00"
            }
        },
        calculator: {
            title: "Calculadora",
            open: false,
            expression: "0",
            justEvaluated: false,
            scientific: false
        }
    },

    init() {
        this.root = document.getElementById("utilityRoot") || null;
        if (!this.root) return;

        this.boundPointerMove = this.handlePointerMove.bind(this);
        this.boundPointerUp = this.handlePointerUp.bind(this);

        window.addEventListener("resize", () => {
            this.constrainAll();
        });

        document.addEventListener("fullscreenchange", () => {
            this.syncPanelFullscreenState();
        });

        this.syncTriggerState();
    },

    isFloatingTool(name) {
        return Boolean(this.tools[name]);
    },

    open(name) {
        const tool = this.tools[name];
        if (!tool || !this.root) return false;

        tool.open = true;

        let panel = this.getPanel(name);

        if (!panel) {
            this.root.insertAdjacentHTML("beforeend", this.renderPanel(name));
            panel = this.getPanel(name);
            this.bindPanel(name);
            this.restorePosition(name);

            requestAnimationFrame(() => {
                if (!panel.style.left || !panel.style.top) {
                    this.setDefaultPosition(name);
                }

                this.updatePanel(name);
                this.constrainPanel(name);
            });
        }

        this.bringToFront(name);
        this.updatePanel(name);
        this.syncTriggerState();
        return true;
    },

    close(name) {
        const tool = this.tools[name];
        const panel = this.getPanel(name);

        if (!tool) return false;

        tool.open = false;

        if (panel) {
            if (document.fullscreenElement === panel) {
                document.exitFullscreen().catch(() => {});
            }

            panel.remove();
        }

        this.syncTriggerState();
        return true;
    },

    getPanel(name) {
        return this.root?.querySelector(`.utility-window[data-tool="${name}"]`) || null;
    },

    renderPanel(name) {
        if (name === "stopwatch") {
            return `
<section class="utility-window" data-tool="stopwatch" aria-label="Cronometro flutuante">
  <div class="utility-window-header" data-drag-handle="true">
    <div class="utility-window-copy">
      <div class="utility-window-kicker">Ferramenta rapida</div>
      <div class="utility-window-title">Cronometro</div>
    </div>
    <div class="utility-window-actions">
      <button class="utility-window-expand" data-fullscreen-tool="stopwatch" type="button" aria-label="Abrir cronometro em tela cheia" title="Tela cheia">[]</button>
      <button class="utility-window-close" data-close-tool="stopwatch" type="button" aria-label="Fechar cronometro">x</button>
    </div>
  </div>
  <div class="utility-window-body">
    <div id="utilityStopwatchDisplay" class="utility-display">00:00:00</div>
    <div class="utility-actions">
      <button data-action="play" data-tool-action="stopwatch" type="button">></button>
      <button data-action="pause" data-tool-action="stopwatch" type="button">||</button>
      <button data-action="reset" data-tool-action="stopwatch" type="button">R</button>
    </div>
  </div>
</section>`;
        }

        if (name === "timer") {
            return `
<section class="utility-window" data-tool="timer" aria-label="Timer flutuante">
  <div class="utility-window-header" data-drag-handle="true">
    <div class="utility-window-copy">
      <div class="utility-window-kicker">Ferramenta rapida</div>
      <div class="utility-window-title">Timer</div>
    </div>
    <div class="utility-window-actions">
      <button class="utility-window-expand" data-fullscreen-tool="timer" type="button" aria-label="Abrir timer em tela cheia" title="Tela cheia">[]</button>
      <button class="utility-window-close" data-close-tool="timer" type="button" aria-label="Fechar timer">x</button>
    </div>
  </div>
  <div class="utility-window-body">
    <div id="utilityTimerDisplay" class="utility-display">00:00:00</div>
    <div class="utility-timer-fields">
      <label class="utility-timer-field">
        <span>H</span>
        <input id="utilityTimerHours" data-timer-field="hours" type="number" min="0" max="99" inputmode="numeric" value="00">
      </label>
      <label class="utility-timer-field">
        <span>M</span>
        <input id="utilityTimerMinutes" data-timer-field="minutes" type="number" min="0" max="59" inputmode="numeric" value="00">
      </label>
      <label class="utility-timer-field">
        <span>S</span>
        <input id="utilityTimerSeconds" data-timer-field="seconds" type="number" min="0" max="59" inputmode="numeric" value="00">
      </label>
    </div>
    <div class="utility-actions">
      <button data-action="play" data-tool-action="timer" type="button">></button>
      <button data-action="pause" data-tool-action="timer" type="button">||</button>
      <button data-action="reset" data-tool-action="timer" type="button">R</button>
    </div>
  </div>
</section>`;
        }

        return `
<section class="utility-window utility-window-calc" data-tool="calculator" aria-label="Calculadora flutuante">
  <div class="utility-window-header" data-drag-handle="true">
    <div class="utility-window-copy">
      <div class="utility-window-kicker">Ferramenta rapida</div>
      <div class="utility-window-title">Calculadora</div>
    </div>
    <div class="utility-window-actions">
      <button class="utility-window-expand" data-fullscreen-tool="calculator" type="button" aria-label="Abrir calculadora em tela cheia" title="Tela cheia">[]</button>
      <button class="utility-window-close" data-close-tool="calculator" type="button" aria-label="Fechar calculadora">x</button>
    </div>
  </div>
  <div class="utility-window-body">
    <div class="utility-calc-toolbar">
      <button class="utility-calc-mode-toggle" data-calc-action="toggle-scientific" type="button" aria-pressed="false">
        Cientifica
      </button>
    </div>
    <div id="utilityCalculatorDisplay" class="utility-calc-display">0</div>
    <div class="utility-calc-science-grid" data-calc-science-grid hidden>
      <button data-calc-value="pi" type="button">pi</button>
      <button data-calc-value="e" type="button">e</button>
      <button data-calc-value="^" type="button">x^y</button>
      <button data-calc-value="^2" type="button">x^2</button>
      <button data-calc-value="sqrt(" type="button">sqrt</button>
      <button data-calc-value="sin(" type="button">sin</button>
      <button data-calc-value="cos(" type="button">cos</button>
      <button data-calc-value="tan(" type="button">tan</button>
      <button data-calc-value="log(" type="button">log</button>
      <button data-calc-value="ln(" type="button">ln</button>
    </div>
    <div class="utility-calc-grid">
      <button data-calc-action="clear" type="button">C</button>
      <button data-calc-action="delete" type="button">DEL</button>
      <button data-calc-value="(" type="button">(</button>
      <button data-calc-value=")" type="button">)</button>
      <button data-calc-value="7" type="button">7</button>
      <button data-calc-value="8" type="button">8</button>
      <button data-calc-value="9" type="button">9</button>
      <button data-calc-value="/" type="button">/</button>
      <button data-calc-value="4" type="button">4</button>
      <button data-calc-value="5" type="button">5</button>
      <button data-calc-value="6" type="button">6</button>
      <button data-calc-value="*" type="button">*</button>
      <button data-calc-value="1" type="button">1</button>
      <button data-calc-value="2" type="button">2</button>
      <button data-calc-value="3" type="button">3</button>
      <button data-calc-value="-" type="button">-</button>
      <button data-calc-value="0" type="button">0</button>
      <button data-calc-value="." type="button">.</button>
      <button data-calc-action="equals" class="utility-calc-equals" type="button">=</button>
      <button data-calc-value="+" type="button">+</button>
    </div>
  </div>
</section>`;
    },

    bindPanel(name) {
        const panel = this.getPanel(name);
        if (!panel) return;

        const dragHandle = panel.querySelector("[data-drag-handle]");
        const closeButton = panel.querySelector(`[data-close-tool="${name}"]`);
        const fullscreenButton = panel.querySelector(`[data-fullscreen-tool="${name}"]`);

        panel.addEventListener("pointerdown", () => {
            this.bringToFront(name);
        });

        dragHandle?.addEventListener("pointerdown", (event) => {
            if (event.target.closest("button")) return;
            this.startDrag(event, name);
        });

        closeButton?.addEventListener("click", () => {
            this.close(name);
        });

        fullscreenButton?.addEventListener("click", () => {
            this.togglePanelFullscreen(name);
        });

        if (name === "stopwatch") {
            panel.querySelectorAll("[data-tool-action='stopwatch']").forEach(button => {
                button.addEventListener("click", () => {
                    this.handleStopwatchAction(button.dataset.action);
                });
            });
        }

        if (name === "timer") {
            panel.querySelectorAll("[data-tool-action='timer']").forEach(button => {
                button.addEventListener("click", () => {
                    this.handleTimerAction(button.dataset.action);
                });
            });

            panel.querySelectorAll("[data-timer-field]").forEach(input => {
                input.addEventListener("input", () => {
                    this.handleTimerField(input.dataset.timerField, input.value);
                });

                input.addEventListener("focus", () => {
                    input.select();
                });
            });
        }

        if (name === "calculator") {
            panel.querySelectorAll("[data-calc-value]").forEach(button => {
                button.addEventListener("click", () => {
                    this.appendCalculatorValue(button.dataset.calcValue);
                });
            });

            panel.querySelectorAll("[data-calc-action]").forEach(button => {
                button.addEventListener("click", () => {
                    this.handleCalculatorAction(button.dataset.calcAction);
                });
            });
        }
    },

    startDrag(event, name) {
        const panel = this.getPanel(name);
        if (!panel) return;
        if (document.fullscreenElement === panel) return;

        const rect = panel.getBoundingClientRect();
        this.activeDrag = {
            name,
            offsetX: event.clientX - rect.left,
            offsetY: event.clientY - rect.top
        };

        panel.classList.add("is-dragging");
        this.bringToFront(name);

        document.addEventListener("pointermove", this.boundPointerMove);
        document.addEventListener("pointerup", this.boundPointerUp);

        event.preventDefault();
    },

    handlePointerMove(event) {
        if (!this.activeDrag) return;

        const { name, offsetX, offsetY } = this.activeDrag;
        const panel = this.getPanel(name);
        if (!panel) return;

        const position = this.getConstrainedPosition(
            panel,
            event.clientX - offsetX,
            event.clientY - offsetY
        );

        panel.style.left = `${position.left}px`;
        panel.style.top = `${position.top}px`;
        panel.style.bottom = "auto";
    },

    handlePointerUp() {
        if (!this.activeDrag) return;

        const panel = this.getPanel(this.activeDrag.name);
        if (panel) {
            panel.classList.remove("is-dragging");
            this.persistPosition(this.activeDrag.name);
        }

        this.activeDrag = null;
        document.removeEventListener("pointermove", this.boundPointerMove);
        document.removeEventListener("pointerup", this.boundPointerUp);
    },

    getConstrainedPosition(panel, left, top) {
        const margin = 12;
        const maxLeft = Math.max(margin, window.innerWidth - panel.offsetWidth - margin);
        const maxTop = Math.max(margin, window.innerHeight - panel.offsetHeight - margin);

        return {
            left: Math.min(Math.max(margin, left), maxLeft),
            top: Math.min(Math.max(margin, top), maxTop)
        };
    },

    setDefaultPosition(name) {
        const panel = this.getPanel(name);
        if (!panel) return;

        const panelWidth = panel.offsetWidth || 292;
        const topMap = {
            stopwatch: 138,
            timer: 408,
            calculator: 186
        };

        const desiredLeft = window.innerWidth - panelWidth - 24;
        const desiredTop = topMap[name] || 150;
        const position = this.getConstrainedPosition(panel, desiredLeft, desiredTop);

        panel.style.left = `${position.left}px`;
        panel.style.top = `${position.top}px`;
        panel.style.bottom = "auto";

        this.persistPosition(name);
    },

    persistPosition(name) {
        const panel = this.getPanel(name);
        if (!panel) return;

        localStorage.setItem(`utility_${name}_x`, panel.style.left || "");
        localStorage.setItem(`utility_${name}_y`, panel.style.top || "");
    },

    restorePosition(name) {
        const panel = this.getPanel(name);
        if (!panel) return;

        const savedX = localStorage.getItem(`utility_${name}_x`);
        const savedY = localStorage.getItem(`utility_${name}_y`);

        if (!savedX || !savedY) return;

        panel.style.left = savedX;
        panel.style.top = savedY;
        panel.style.bottom = "auto";
    },

    constrainPanel(name) {
        const panel = this.getPanel(name);
        if (!panel) return;

        const left = parseFloat(panel.style.left) || 24;
        const top = parseFloat(panel.style.top) || 24;
        const position = this.getConstrainedPosition(panel, left, top);

        panel.style.left = `${position.left}px`;
        panel.style.top = `${position.top}px`;
        panel.style.bottom = "auto";
        this.persistPosition(name);
    },

    constrainAll() {
        Object.keys(this.tools).forEach(name => {
            if (this.tools[name].open) {
                this.constrainPanel(name);
            }
        });
    },

    bringToFront(name) {
        const panel = this.getPanel(name);
        if (!panel) return;

        this.zIndexSeed += 1;
        panel.style.zIndex = String(this.zIndexSeed);
    },

    syncTriggerState() {
        Object.entries(this.tools).forEach(([name, tool]) => {
            const isLive =
                (name === "stopwatch" || name === "timer") &&
                Boolean(tool.interval);

            document.querySelectorAll(`[data-module="${name}"]`).forEach(button => {
                button.classList.toggle("utility-active", tool.open);
                button.classList.toggle("utility-live", isLive);
                button.setAttribute("aria-pressed", tool.open ? "true" : "false");
            });
        });
    },

    togglePanelFullscreen(name) {
        const panel = this.getPanel(name);
        if (!panel) return;

        if (document.fullscreenElement === panel) {
            document.exitFullscreen().catch(() => {});
            return;
        }

        panel.requestFullscreen?.().catch(() => {});
    },

    syncPanelFullscreenState() {
        Object.keys(this.tools).forEach(name => {
            const panel = this.getPanel(name);
            const button = panel?.querySelector(`[data-fullscreen-tool="${name}"]`);
            if (!button) return;

            const isFullscreen = document.fullscreenElement === panel;
            button.classList.toggle("is-active", isFullscreen);
            button.title = isFullscreen ? "Sair da tela cheia" : "Tela cheia";
            button.setAttribute(
                "aria-label",
                isFullscreen
                    ? `Sair da tela cheia de ${this.tools[name].title.toLowerCase()}`
                    : `Abrir ${this.tools[name].title.toLowerCase()} em tela cheia`
            );
        });
    },

    updatePanel(name) {
        if (name === "stopwatch") {
            this.updateStopwatchView();
            return;
        }

        if (name === "timer") {
            this.updateTimerView();
            return;
        }

        this.updateCalculatorView();
    },

    formatClock(totalSeconds) {
        const hours = String(Math.floor(totalSeconds / 3600)).padStart(2, "0");
        const minutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, "0");
        const seconds = String(totalSeconds % 60).padStart(2, "0");
        return `${hours}:${minutes}:${seconds}`;
    },

    handleStopwatchAction(action) {
        const tool = this.tools.stopwatch;
        if (!tool) return;

        if (action === "play") {
            if (tool.interval) return;

            tool.interval = setInterval(() => {
                tool.seconds += 1;
                this.updateStopwatchView();
            }, 1000);
        }

        if (action === "pause") {
            clearInterval(tool.interval);
            tool.interval = null;
        }

        if (action === "reset") {
            clearInterval(tool.interval);
            tool.interval = null;
            tool.seconds = 0;
        }

        this.updateStopwatchView();
        this.syncTriggerState();
    },

    updateStopwatchView() {
        const display = document.getElementById("utilityStopwatchDisplay");
        const panel = this.getPanel("stopwatch");
        const tool = this.tools.stopwatch;

        if (display) {
            display.textContent = this.formatClock(tool.seconds);
        }

        if (panel) {
            panel.classList.toggle("utility-is-live", Boolean(tool.interval));
        }
    },

    handleTimerField(field, value) {
        const tool = this.tools.timer;
        if (!tool || !tool.fields[field]) return;

        const limits = {
            hours: 99,
            minutes: 59,
            seconds: 59
        };

        const cleaned = String(value).replace(/\D/g, "");
        const numeric = cleaned === "" ? 0 : Number(cleaned);
        const clamped = Math.min(limits[field], numeric);
        const formatted = String(clamped).padStart(2, "0");

        tool.fields[field] = formatted;

        if (!tool.interval) {
            tool.total = this.getTimerFieldsInSeconds();
            tool.remaining = tool.total;
        }

        this.updateTimerView();
    },

    getTimerFieldsInSeconds() {
        const tool = this.tools.timer;
        return (
            Number(tool.fields.hours) * 3600 +
            Number(tool.fields.minutes) * 60 +
            Number(tool.fields.seconds)
        );
    },

    handleTimerAction(action) {
        const tool = this.tools.timer;
        if (!tool) return;

        if (action === "play") {
            if (tool.interval) return;

            if (tool.remaining <= 0) {
                tool.total = this.getTimerFieldsInSeconds();
                tool.remaining = tool.total;
            }

            if (tool.remaining <= 0) return;

            tool.interval = setInterval(() => {
                tool.remaining -= 1;

                if (tool.remaining <= 0) {
                    tool.remaining = 0;
                    clearInterval(tool.interval);
                    tool.interval = null;
                    this.playTimerBeep();
                }

                this.updateTimerView();
                this.syncTriggerState();
            }, 1000);
        }

        if (action === "pause") {
            clearInterval(tool.interval);
            tool.interval = null;
        }

        if (action === "reset") {
            clearInterval(tool.interval);
            tool.interval = null;
            tool.total = this.getTimerFieldsInSeconds();
            tool.remaining = tool.total;
        }

        this.updateTimerView();
        this.syncTriggerState();
    },

    updateTimerView() {
        const tool = this.tools.timer;
        const display = document.getElementById("utilityTimerDisplay");
        const panel = this.getPanel("timer");

        if (display) {
            display.textContent = this.formatClock(tool.remaining);
        }

        ["hours", "minutes", "seconds"].forEach(field => {
            const input = document.getElementById(`utilityTimer${field.charAt(0).toUpperCase()}${field.slice(1)}`);
            if (!input) return;

            input.value = tool.fields[field];
            input.disabled = Boolean(tool.interval);
        });

        if (panel) {
            panel.classList.toggle("utility-is-live", Boolean(tool.interval));
        }
    },

    playTimerBeep() {
        const audio = new Audio("https://actions.google.com/sounds/v1/alarms/beep_short.ogg");
        audio.volume = 0.4;
        audio.play().catch(() => {});
    },

    appendCalculatorValue(value) {
        const tool = this.tools.calculator;
        if (!tool) return;

        const operators = /^[+\-*/^]/;
        const isOperator = operators.test(value);

        if (tool.justEvaluated && !isOperator) {
            tool.expression = value;
            tool.justEvaluated = false;
            this.updateCalculatorView();
            return;
        }

        if (tool.expression === "0" && !isOperator && value !== ".") {
            tool.expression = value;
            tool.justEvaluated = false;
            this.updateCalculatorView();
            return;
        }

        if (tool.justEvaluated && isOperator) {
            tool.justEvaluated = false;
        }

        tool.expression += value;
        this.updateCalculatorView();
    },

    handleCalculatorAction(action) {
        const tool = this.tools.calculator;
        if (!tool) return;

        if (action === "clear") {
            tool.expression = "0";
            tool.justEvaluated = false;
        }

        if (action === "delete") {
            tool.expression = tool.expression.length > 1
                ? tool.expression.slice(0, -1)
                : "0";
            tool.justEvaluated = false;
        }

        if (action === "toggle-scientific") {
            tool.scientific = !tool.scientific;
            this.updateCalculatorView();
            this.constrainPanel("calculator");
            return;
        }

        if (action === "equals") {
            this.evaluateCalculator();
            return;
        }

        this.updateCalculatorView();
    },

    evaluateCalculator() {
        const tool = this.tools.calculator;
        const normalizedExpression = String(tool.expression || "")
            .replace(/π/g, "pi")
            .replace(/\s+/g, "")
            .replace(/÷/g, "/")
            .replace(/×/g, "*");
        const tokenPattern = /(sqrt|sin|cos|tan|log|ln|pi|e|\d+(?:\.\d+)?|[+\-*/^()])/g;
        const matchedTokens = normalizedExpression.match(tokenPattern) || [];

        if (!normalizedExpression || matchedTokens.join("") !== normalizedExpression) {
            tool.expression = "Erro";
            tool.justEvaluated = true;
            this.updateCalculatorView();
            return;
        }

        const expression = normalizedExpression
            .replace(/\^/g, "**")
            .replace(/\bpi\b/g, "Math.PI")
            .replace(/\be\b/g, "Math.E")
            .replace(/\bsqrt\(/g, "Math.sqrt(")
            .replace(/\bsin\(/g, "Math.sin(")
            .replace(/\bcos\(/g, "Math.cos(")
            .replace(/\btan\(/g, "Math.tan(")
            .replace(/\blog\(/g, "Math.log10(")
            .replace(/\bln\(/g, "Math.log(");

        try {
            const result = Function(`"use strict"; return (${expression})`)();
            tool.expression = Number.isFinite(result) ? String(result) : "Erro";
            tool.justEvaluated = true;
        } catch {
            tool.expression = "Erro";
            tool.justEvaluated = true;
        }

        this.updateCalculatorView();
    },

    updateCalculatorView() {
        const display = document.getElementById("utilityCalculatorDisplay");
        const panel = this.getPanel("calculator");
        const modeToggle = panel?.querySelector(".utility-calc-mode-toggle");
        const scienceGrid = panel?.querySelector("[data-calc-science-grid]");
        if (!display) return;

        display.textContent = this.tools.calculator.expression;

        if (panel) {
            panel.classList.toggle("is-scientific", Boolean(this.tools.calculator.scientific));
        }

        if (modeToggle) {
            modeToggle.textContent = this.tools.calculator.scientific ? "Basica" : "Cientifica";
            modeToggle.setAttribute("aria-pressed", this.tools.calculator.scientific ? "true" : "false");
        }

        if (scienceGrid) {
            scienceGrid.hidden = !this.tools.calculator.scientific;
        }
    }
};

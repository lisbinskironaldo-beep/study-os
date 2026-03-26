window.QuestionsUI = {
    page: null,

    init(page) {
        this.page = page;
    },

    render() {
        if (!this.page) {
            return;
        }

        const launcher =
            document.getElementById(
                "questionsLauncher"
            );
        const session =
            document.getElementById(
                "questionsSession"
            );
        const statsPanel =
            document.getElementById(
                "questionsStatsPanel"
            );

        if (
            !launcher ||
            !session ||
            !statsPanel
        ) {
            return;
        }

        const phase =
            QuestionsState.getPhase();

        launcher.hidden =
            phase !== "launcher";
        session.hidden =
            phase !== "session";

        if (phase === "launcher") {
            launcher.innerHTML =
                this.renderLauncher();
            session.innerHTML = "";
        } else {
            session.innerHTML =
                this.renderSession();
            launcher.innerHTML = "";
        }

        statsPanel.hidden = false;
        statsPanel.innerHTML =
            this.renderStatsPanel();

        this.bindLauncher();
        this.bindSession();
    },

    renderLoading() {
        return `
            <section class="questions-card questions-card-loading">
                <div class="questions-kicker">Questions</div>
                <h2>Carregando modulo escolar</h2>
                <p>Preparando banco, launcher e contexto do treino.</p>
            </section>
        `;
    },

    renderChecklist(checklist) {
        return `
            <div class="questions-checklist">
                ${checklist.map((item) => `
                    <article class="questions-check-item${item.done ? " is-done" : ""}">
                        <div class="questions-check-icon">${item.done ? "OK" : "..."}</div>
                        <div>
                            <strong>${item.label}</strong>
                            <span>${item.detail}</span>
                        </div>
                    </article>
                `).join("")}
            </div>
        `;
    },

    renderLauncher() {
        const page =
            this.page;

        if (
            page.data.bankStatus ===
            "loading"
        ) {
            return this.renderLoading();
        }

        if (
            page.data.bankStatus ===
            "error"
        ) {
            return `
                <section class="questions-card questions-card-loading">
                    <div class="questions-kicker">Questions</div>
                    <h2>Banco escolar indisponivel</h2>
                    <p>${page.getRuntimeNotice()}</p>
                </section>
            `;
        }

        const ctx =
            QuestionsContext.get();
        const modes =
            QuestionsService.getModeOptions(
                page
            );
        const series =
            QuestionsService.getSeriesOptions(
                page
            );
        const subjects =
            QuestionsService.getSubjectOptions(
                page,
                ctx.serie
            );
        const topics =
            QuestionsService.getTopicOptions(
                page,
                {
                    serie: ctx.serie,
                    materia: ctx.materia
                }
            );
        const selectedTopics =
            QuestionsService.getSelectedTopicOptions(
                page
            );
        const suggestion =
            QuestionsService.getSmartSuggestion(
                page
            );
        const modeConfig =
            page.getModeConfig(ctx.mode);
        const mixStrategies =
            QuestionsService.getMixStrategies(
                page,
                ctx.mode
            );
        const validation =
            QuestionsService.getLauncherValidation(
                page
            );
        const checklist =
            QuestionsService.getLauncherChecklist(
                page
            );
        const route =
            QuestionsService.getRouteSummary(
                page
            );
        const startLabel =
            validation.isReady
                ? "Iniciar treino"
                : "Complete a rota";

        return `
            <section class="questions-card questions-launcher-card">
                <div class="questions-head">
                    <div>
                        <div class="questions-kicker">Questions</div>
                        <h2>Monte sua rota escolar</h2>
                        <p>${modeConfig.note}</p>
                    </div>

                    <div class="questions-head-cta">
                        <div class="questions-readiness${validation.isReady ? " is-ready" : ""}">
                            <strong>${validation.isReady ? "Rota pronta" : "Rota em montagem"}</strong>
                            <span>${validation.readyCount}/${validation.requestedCount} questoes disponiveis</span>
                        </div>
                        <button id="questionsStartBtn" class="questions-primary-btn" type="button" ${validation.isReady ? "" : "disabled"}>
                            ${startLabel}
                        </button>
                    </div>
                </div>

                ${page.getRuntimeNotice() ? `
                    <div class="questions-inline-notice">
                        ${page.getRuntimeNotice()}
                    </div>
                ` : ""}

                <div class="questions-launcher-overview">
                    <article class="questions-route-card">
                        <div class="questions-panel-label">Resumo da rota</div>
                        <div class="questions-route-grid">
                            <article class="questions-route-stat">
                                <strong>${route.serieLabel}</strong>
                                <span>Serie ativa</span>
                            </article>
                            <article class="questions-route-stat">
                                <strong>${route.materiaLabel || "Materia"}</strong>
                                <span>Materia</span>
                            </article>
                            <article class="questions-route-stat">
                                <strong>${selectedTopics.length}</strong>
                                <span>Assunto(s)</span>
                            </article>
                            <article class="questions-route-stat">
                                <strong>${validation.estimatedDuration}</strong>
                                <span>Tempo estimado</span>
                            </article>
                        </div>

                        <div class="questions-route-stack">
                            <div class="questions-summary-label">Assuntos selecionados</div>
                            ${selectedTopics.length ? `
                                <div class="questions-badge-row">
                                    ${selectedTopics.map((topic) => `
                                        <span class="questions-badge${ctx.focoPrincipal === topic.key ? " is-focus" : ""}">
                                            ${topic.label}
                                        </span>
                                    `).join("")}
                                </div>
                            ` : `
                                <div class="questions-empty-inline">
                                    Selecione os assuntos que vao entrar na sessao.
                                </div>
                            `}
                        </div>

                        ${validation.issues.length ? `
                            <div class="questions-issue-list">
                                ${validation.issues.map((issue) => `
                                    <div class="questions-issue-item">${issue}</div>
                                `).join("")}
                            </div>
                        ` : ""}
                    </article>

                    <article class="questions-route-card">
                        <div class="questions-panel-label">Checklist de prontidao</div>
                        ${this.renderChecklist(checklist)}
                    </article>
                </div>

                <div class="questions-grid">
                    <article class="questions-panel">
                        <div class="questions-panel-label">Modo de treino</div>
                        <div class="questions-chip-grid">
                            ${modes.map((mode) => `
                                <button class="questions-chip${ctx.mode === mode.key ? " is-active" : ""}" type="button" data-mode="${mode.key}">
                                    <strong>${mode.label}</strong>
                                    <span>${mode.note}</span>
                                </button>
                            `).join("")}
                        </div>
                    </article>

                    <article class="questions-panel">
                        <div class="questions-panel-label">Serie</div>
                        <div class="questions-inline-grid">
                            ${series.map((serie) => `
                                <button class="questions-pill${ctx.serie === serie.key ? " is-active" : ""}" type="button" data-serie="${serie.key}">
                                    ${serie.label}
                                </button>
                            `).join("")}
                        </div>
                    </article>

                    <article class="questions-panel">
                        <div class="questions-panel-label">Materia</div>
                        <div class="questions-inline-grid">
                            ${subjects.map((subject) => `
                                <button class="questions-pill${ctx.materia === subject.key ? " is-active" : ""}" type="button" data-materia="${subject.key}">
                                    ${subject.label}
                                    <span>${subject.topicCount} assuntos</span>
                                </button>
                            `).join("")}
                        </div>
                    </article>

                    <article class="questions-panel">
                        <div class="questions-panel-head">
                            <div>
                                <div class="questions-panel-label">Assuntos</div>
                                <div class="questions-panel-meta">${selectedTopics.length} selecionado(s)</div>
                            </div>
                            ${ctx.mode !== "ASSUNTO_UNICO" ? `
                                <div class="questions-inline-actions">
                                    <button class="questions-link-btn" type="button" id="questionsSelectAllTopicsBtn">Selecionar todos</button>
                                    <button class="questions-link-btn" type="button" id="questionsClearTopicsBtn">Limpar</button>
                                </div>
                            ` : ""}
                        </div>

                        ${topics.length ? `
                            <div class="questions-topic-grid">
                                ${topics.map((topic) => `
                                    <button class="questions-topic-card${ctx.topicos.includes(topic.key) ? " is-active" : ""}${ctx.focoPrincipal === topic.key ? " is-focus" : ""}${topic.hasQuestions ? "" : " is-empty"}" type="button" data-topic="${topic.key}">
                                        <strong>${topic.label}</strong>
                                        <div class="questions-topic-foot">
                                            <span>${topic.count} questoes</span>
                                            <span class="questions-topic-badge${topic.hasQuestions ? " is-ready" : ""}">
                                                ${topic.hasQuestions ? "pronto" : "vazio"}
                                            </span>
                                        </div>
                                    </button>
                                `).join("")}
                            </div>
                        ` : `
                            <div class="questions-empty-inline">
                                Essa materia ainda nao tem assuntos mapeados.
                            </div>
                        `}
                    </article>

                    ${ctx.mode === "REFORCO_DIRECIONADO" && selectedTopics.length ? `
                        <article class="questions-panel">
                            <div class="questions-panel-label">Foco principal</div>
                            <div class="questions-inline-grid">
                                ${selectedTopics.map((topic) => `
                                    <button class="questions-pill${ctx.focoPrincipal === topic.key ? " is-active" : ""}" type="button" data-focus-topic="${topic.key}">
                                        ${topic.label}
                                    </button>
                                `).join("")}
                            </div>
                        </article>
                    ` : ""}

                    <article class="questions-panel">
                        <div class="questions-panel-label">Quantidade de questoes</div>
                        <div class="questions-inline-grid">
                            ${page.data.amountOptions.map((amount) => `
                                <button class="questions-pill${ctx.quantidadeQuestoes === amount ? " is-active" : ""}" type="button" data-amount="${amount}">
                                    ${amount}
                                </button>
                            `).join("")}
                        </div>
                    </article>

                    <article class="questions-panel">
                        <div class="questions-panel-head">
                            <div>
                                <div class="questions-panel-label">Estrategia de mistura</div>
                                <div class="questions-panel-meta">${route.strategyLabel || "Selecao automatica"}</div>
                            </div>
                        </div>
                        <div class="questions-inline-grid">
                            ${mixStrategies.map((strategy) => `
                                <button class="questions-pill${ctx.estrategiaMistura === strategy.key ? " is-active" : ""}" type="button" data-mix="${strategy.key}">
                                    ${strategy.label}
                                </button>
                            `).join("")}
                        </div>
                    </article>
                </div>

                <div class="questions-summary-band">
                    <div>
                        <div class="questions-summary-label">Sugestao inteligente</div>
                        <strong>${suggestion.title}</strong>
                        <span>${suggestion.note}</span>
                    </div>
                </div>
            </section>
        `;
    },

    renderSessionMeta(meta, current, total) {
        return `
            <div class="questions-session-overview">
                <article class="questions-session-stat">
                    <strong>${meta.materiaLabel || "Materia"}</strong>
                    <span>Materia ativa</span>
                </article>
                <article class="questions-session-stat">
                    <strong>${meta.amount || total}</strong>
                    <span>Questoes na rota</span>
                </article>
                <article class="questions-session-stat">
                    <strong>${meta.estimatedDuration || "0 min"}</strong>
                    <span>Tempo previsto</span>
                </article>
                <article class="questions-session-stat">
                    <strong>${Math.max(total - current - 1, 0)}</strong>
                    <span>Restantes</span>
                </article>
            </div>
        `;
    },

    renderSession() {
        const session =
            QuestionsState.getSession();

        if (
            QuestionsState.isComplete()
        ) {
            return this.renderResults();
        }

        const question =
            QuestionsState.getCurrentQuestion();
        const current =
            QuestionsState.getCurrent();
        const answer =
            QuestionsState.getLastAnswer();
        const meta =
            QuestionsState.getMeta();
        const instruction =
            QuestionsService.getQuestionInstruction(
                question
            );
        const progress =
            session.length
                ? (
                    (current / session.length) * 100
                )
                : 0;

        if (!question) {
            return `
                <section class="questions-card questions-card-loading">
                    <h2>Nenhuma questao ativa</h2>
                    <p>Volte para o launcher e monte outra rota.</p>
                </section>
            `;
        }

        return `
            <section class="questions-card questions-session-card">
                <div class="questions-session-top">
                    <div>
                        <div class="questions-kicker">${meta.modeLabel || "Treino"}</div>
                        <h2>${question.subjectLabel}</h2>
                        <p>${question.topicLabel}${question.subtopicLabel ? ` | ${question.subtopicLabel}` : ""}</p>
                    </div>
                    <button id="questionsBackBtn" class="questions-secondary-btn" type="button">Voltar</button>
                </div>

                ${this.renderSessionMeta(meta, current, session.length)}

                <div class="questions-progress-shell">
                    <div class="questions-progress-copy">
                        <span>${current + 1}/${session.length}</span>
                        <span>${meta.serieLabel || ""}</span>
                    </div>
                    <div class="questions-progress-bar">
                        <div class="questions-progress-fill" style="width:${progress}%"></div>
                    </div>
                </div>

                <article class="questions-question-card">
                    <div class="questions-question-meta">
                        <span>${this.getTypeLabel(question.type)}</span>
                        <span>${question.difficultyLabel}</span>
                        <span>${question.cognition}</span>
                        <span>${question.expectedTime}s estimados</span>
                    </div>
                    <div class="questions-question-instruction">${instruction}</div>
                    <h3>${question.prompt}</h3>
                    <div class="questions-answer-area">
                        ${this.renderAnswerBlock(question, answer)}
                    </div>
                </article>
            </section>
        `;
    },

    renderAnswerBlock(question, answer) {
        if (question.type === "input") {
            return this.renderInputBlock(
                question,
                answer
            );
        }

        if (question.type === "ordenacao") {
            return this.renderOrderingBlock(
                question,
                answer
            );
        }

        if (question.type === "vf") {
            const vfQuestion = {
                ...question,
                options: ["Verdadeiro", "Falso"]
            };

            return this.renderChoiceBlock(
                vfQuestion,
                answer
            );
        }

        return this.renderChoiceBlock(
            question,
            answer
        );
    },

    renderChoiceBlock(question, answer) {
        const isLocked =
            Boolean(answer);

        return `
            <div class="questions-options">
                ${(question.options || []).map((option, index) => {
                    const isCorrect =
                        answer &&
                        index === question.correct;
                    const isWrong =
                        answer &&
                        index === answer.selectedIndex &&
                        !answer.correct;

                    return `
                        <button class="questions-option${isCorrect ? " is-correct" : ""}${isWrong ? " is-wrong" : ""}" type="button" data-answer-index="${index}" ${isLocked ? "disabled" : ""}>
                            <span class="questions-option-index">${String.fromCharCode(65 + index)}</span>
                            <span>${option}</span>
                        </button>
                    `;
                }).join("")}
            </div>
            ${answer ? this.renderFeedback(answer) : ""}
        `;
    },

    renderOrderingBlock(question, answer) {
        const items = Array.isArray(
            question.options
        )
            ? question.options
            : [];
        const isLocked =
            Boolean(answer);

        return `
            <div class="questions-order-shell">
                <div class="questions-order-note">Ajuste a ordem e confirme.</div>
                <div id="questionsOrderingList" class="questions-order-list">
                    ${items.map((item) => `
                        <article class="questions-order-item" data-order-value="${String(item).replace(/"/g, "&quot;")}">
                            <div class="questions-order-grip">::</div>
                            <strong>${item}</strong>
                            <div class="questions-order-actions">
                                <button class="questions-order-btn" type="button" data-order-move="up" ${isLocked ? "disabled" : ""}>Subir</button>
                                <button class="questions-order-btn" type="button" data-order-move="down" ${isLocked ? "disabled" : ""}>Descer</button>
                            </div>
                        </article>
                    `).join("")}
                </div>

                <button id="questionsOrderingSubmitBtn" class="questions-primary-btn" type="button" ${isLocked ? "disabled" : ""}>
                    Confirmar ordem
                </button>
            </div>
            ${answer ? this.renderFeedback(answer) : ""}
        `;
    },

    renderInputBlock(question, answer) {
        return `
            <form id="questionsInputForm" class="questions-input-form">
                <input id="questionsInputField" class="questions-input-field" type="text" placeholder="Digite sua resposta" ${answer ? "disabled" : ""}>
                <button class="questions-primary-btn" type="submit" ${answer ? "disabled" : ""}>Responder</button>
            </form>
            ${answer ? this.renderFeedback(answer) : ""}
        `;
    },

    renderFeedback(answer) {
        return `
            <div class="questions-feedback ${answer.correct ? "is-correct" : "is-wrong"}">
                <strong>${answer.correct ? "Resposta correta" : "Resposta incorreta"}</strong>
                ${!answer.correct ? `
                    <div class="questions-feedback-answer">
                        <span>Sua resposta: ${answer.selectedAnswerLabel || "Nao registrada"}</span>
                        <span>Resposta esperada: ${answer.correctAnswerLabel || "Nao preenchida"}</span>
                    </div>
                ` : ""}
                <p>${answer.question.explanation || "Comentario ainda nao preenchido para esta questao."}</p>
                <div class="questions-feedback-foot">
                    <span>${QuestionsService.formatTime(answer.timeMs)}</span>
                    <button id="questionsContinueBtn" class="questions-primary-btn" type="button">Proxima questao</button>
                </div>
            </div>
        `;
    },

    renderResults() {
        const results =
            QuestionsState.getResults();
        const meta =
            QuestionsState.getMeta();
        const summary =
            QuestionsService.summarizeSessionResults(
                results,
                meta
            );

        return `
            <section class="questions-card questions-results-card">
                <div class="questions-kicker">Sessao concluida</div>
                <h2>${summary.accuracy}% de acerto</h2>
                <p>${summary.headline}. ${summary.nextStep}</p>

                <div class="questions-results-grid">
                    <article class="questions-result-stat">
                        <strong>${summary.hits}</strong>
                        <span>acertos</span>
                    </article>
                    <article class="questions-result-stat">
                        <strong>${summary.errors}</strong>
                        <span>erros</span>
                    </article>
                    <article class="questions-result-stat">
                        <strong>${QuestionsService.formatTime(summary.avgTimeMs)}</strong>
                        <span>tempo medio</span>
                    </article>
                    <article class="questions-result-stat">
                        <strong>${summary.topicCount}</strong>
                        <span>assunto(s)</span>
                    </article>
                </div>

                <div class="questions-results-insights">
                    <article class="questions-result-panel">
                        <div class="questions-panel-label">Leitura da sessao</div>
                        <div class="questions-result-callouts">
                            <div class="questions-result-callout">
                                <strong>Ponto forte</strong>
                                <span>${summary.strongTopic?.topicLabel || "Ainda sem destaque claro nesta rodada."}</span>
                            </div>
                            <div class="questions-result-callout is-warning">
                                <strong>Ponto para reforco</strong>
                                <span>${summary.weakTopic?.topicLabel || "Nenhum topico concentrou erro relevante."}</span>
                            </div>
                        </div>
                    </article>

                    <article class="questions-result-panel">
                        <div class="questions-panel-label">Desempenho por assunto</div>
                        <div class="questions-result-topic-list">
                            ${summary.topics.map((topic) => `
                                <div class="questions-result-topic-item">
                                    <strong>${topic.topicLabel}</strong>
                                    <span>${topic.hits}/${topic.attempts} acertos · ${topic.accuracy}%</span>
                                </div>
                            `).join("")}
                        </div>
                    </article>
                </div>

                <div class="questions-results-actions">
                    ${summary.weakTopic ? `
                        <button id="questionsFocusWeakBtn" class="questions-secondary-btn" type="button">Reforcar ponto fraco</button>
                    ` : ""}
                    <button id="questionsReviewErrorsBtn" class="questions-secondary-btn" type="button">Revisar erros</button>
                    <button id="questionsMixedReviewBtn" class="questions-secondary-btn" type="button">Misturar revisao</button>
                    <button id="questionsRestartBtn" class="questions-primary-btn" type="button">Treinar de novo</button>
                    <button id="questionsResultsBackBtn" class="questions-secondary-btn" type="button">Voltar ao launcher</button>
                </div>
            </section>
        `;
    },

    renderStatsPanel() {
        const page =
            this.page;

        if (
            page.data.bankStatus !==
            "ready"
        ) {
            return "";
        }

        const ctx =
            QuestionsContext.get();
        const dashboard =
            QuestionsStore.getDashboard({
                subjectKey: ctx.materia
            });
        const subject =
            QuestionsService.getSubjectOptions(
                page,
                ctx.serie
            ).find((item) =>
                item.key === ctx.materia
            );

        return `
            <section class="questions-stats-card">
                <div class="questions-panel-label">Radar da materia</div>
                <h3>${subject?.label || "Materia"}</h3>
                <div class="questions-stats-grid">
                    <article>
                        <strong>${dashboard.attempts}</strong>
                        <span>tentativas</span>
                    </article>
                    <article>
                        <strong>${Math.round((dashboard.accuracy || 0) * 100)}%</strong>
                        <span>precisao</span>
                    </article>
                    <article>
                        <strong>${QuestionsService.formatTime(dashboard.avgTimeMs)}</strong>
                        <span>tempo medio</span>
                    </article>
                    <article>
                        <strong>${dashboard.totalSessions || 0}</strong>
                        <span>sessoes</span>
                    </article>
                </div>

                <div class="questions-weak-list">
                    <div class="questions-panel-label">Pontos sensiveis</div>
                    ${(dashboard.weakTopics || []).length ? dashboard.weakTopics.map((topic) => `
                        <div class="questions-weak-item">
                            <strong>${topic.topicLabel}</strong>
                            <span>${topic.errors} erro(s)</span>
                        </div>
                    `).join("") : `
                        <div class="questions-empty-inline">
                            O painel vai ganhar vida conforme voce responder questoes.
                        </div>
                    `}
                </div>

                <div class="questions-stats-section">
                    <div class="questions-panel-label">Pontos fortes</div>
                    ${(dashboard.strongTopics || []).length ? dashboard.strongTopics.slice(0, 3).map((topic) => `
                        <div class="questions-weak-item questions-weak-item-positive">
                            <strong>${topic.topicLabel}</strong>
                            <span>${Math.round((topic.accuracy || 0) * 100)}% de precisao</span>
                        </div>
                    `).join("") : `
                        <div class="questions-empty-inline">
                            Os destaques positivos vao aparecer conforme voce acumular acertos.
                        </div>
                    `}
                </div>

                <div class="questions-stats-section">
                    <div class="questions-panel-label">Modos mais usados</div>
                    ${(dashboard.modeBreakdown || []).length ? dashboard.modeBreakdown.map((mode) => `
                        <div class="questions-weak-item">
                            <strong>${mode.modeLabel}</strong>
                            <span>${mode.sessions} sessao(oes) · ${mode.avgAccuracy}% medio</span>
                        </div>
                    `).join("") : `
                        <div class="questions-empty-inline">
                            O painel de modos vai ganhar vida conforme voce variar os treinos.
                        </div>
                    `}
                </div>

                <div class="questions-stats-section">
                    <div class="questions-panel-label">Sessoes focadas</div>
                    ${(dashboard.focusedSessions || []).length ? dashboard.focusedSessions.slice(0, 3).map((session) => `
                        <div class="questions-session-log">
                            <strong>${session.topicLabels?.[0] || session.weakTopicLabel || session.subjectLabel || "Sessao focada"}</strong>
                            <span>${session.accuracy || 0}% · ${session.amount || 0} questoes</span>
                        </div>
                    `).join("") : `
                        <div class="questions-empty-inline">
                            Quando voce fizer sessoes mais focadas, elas aparecem aqui.
                        </div>
                    `}
                </div>

                <div class="questions-stats-section">
                    <div class="questions-panel-label">Resumo rapido</div>
                    <div class="questions-session-log">
                        <strong>Assunto mais treinado</strong>
                        <span>${dashboard.mostTrainedTopic?.topicLabel || "Ainda sem lideranca clara"}</span>
                    </div>
                    <div class="questions-session-log">
                        <strong>Ultima leitura</strong>
                        <span>${dashboard.sessions?.[0]?.accuracy ?? 0}% na sessao mais recente</span>
                    </div>
                </div>
            </section>
        `;
    },

    bindLauncher() {
        document
            .querySelectorAll("[data-mode]")
            .forEach((button) => {
                button.addEventListener(
                    "click",
                    () => {
                        this.page.updateContext({
                            mode:
                                button.dataset.mode
                        });
                    }
                );
            });

        document
            .querySelectorAll("[data-serie]")
            .forEach((button) => {
                button.addEventListener(
                    "click",
                    () => {
                        this.page.updateContext({
                            serie: Number(
                                button.dataset.serie
                            )
                        });
                    }
                );
            });

        document
            .querySelectorAll("[data-materia]")
            .forEach((button) => {
                button.addEventListener(
                    "click",
                    () => {
                        this.page.updateContext({
                            materia:
                                button.dataset.materia
                        });
                    }
                );
            });

        document
            .querySelectorAll("[data-topic]")
            .forEach((button) => {
                button.addEventListener(
                    "click",
                    () => {
                        this.page.toggleTopic(
                            button.dataset.topic
                        );
                    }
                );
            });

        document
            .querySelectorAll("[data-focus-topic]")
            .forEach((button) => {
                button.addEventListener(
                    "click",
                    () => {
                        this.page.setFocusPrincipal(
                            button.dataset.focusTopic
                        );
                    }
                );
            });

        document
            .querySelectorAll("[data-amount]")
            .forEach((button) => {
                button.addEventListener(
                    "click",
                    () => {
                        this.page.updateContext({
                            quantidadeQuestoes:
                                Number(
                                    button.dataset.amount
                                )
                        });
                    }
                );
            });

        document
            .querySelectorAll("[data-mix]")
            .forEach((button) => {
                button.addEventListener(
                    "click",
                    () => {
                        this.page.updateContext({
                            estrategiaMistura:
                                button.dataset.mix
                        });
                    }
                );
            });

        document.getElementById(
            "questionsSelectAllTopicsBtn"
        )?.addEventListener(
            "click",
            () => {
                this.page.selectAllTopics();
            }
        );

        document.getElementById(
            "questionsClearTopicsBtn"
        )?.addEventListener(
            "click",
            () => {
                this.page.clearTopics();
            }
        );

        document.getElementById(
            "questionsStartBtn"
        )?.addEventListener(
            "click",
            () => {
                this.page.startSession();
            }
        );
    },

    moveOrderItem(button) {
        const item =
            button.closest(
                ".questions-order-item"
            );

        if (!item) {
            return;
        }

        if (
            button.dataset.orderMove ===
            "up"
        ) {
            const previous =
                item.previousElementSibling;

            if (previous) {
                previous.before(item);
            }

            return;
        }

        const next =
            item.nextElementSibling;

        if (next) {
            next.after(item);
        }
    },

    bindSession() {
        document
            .querySelectorAll("[data-answer-index]")
            .forEach((button) => {
                button.addEventListener(
                    "click",
                    () => {
                        this.page.submitAnswer({
                            index: Number(
                                button.dataset.answerIndex
                            )
                        });
                    }
                );
            });

        document.getElementById(
            "questionsInputForm"
        )?.addEventListener(
            "submit",
            (event) => {
                event.preventDefault();
                const field =
                    document.getElementById(
                        "questionsInputField"
                    );

                this.page.submitAnswer({
                    index: null,
                    value: String(
                        field?.value || ""
                    ).trim()
                });
            }
        );

        document
            .querySelectorAll("[data-order-move]")
            .forEach((button) => {
                button.addEventListener(
                    "click",
                    () => {
                        this.moveOrderItem(
                            button
                        );
                    }
                );
            });

        document.getElementById(
            "questionsOrderingSubmitBtn"
        )?.addEventListener(
            "click",
            () => {
                const order = [
                    ...document.querySelectorAll(
                        "#questionsOrderingList [data-order-value]"
                    )
                ].map((item) =>
                    item.dataset.orderValue
                );

                this.page.submitAnswer({
                    index: null,
                    value: order
                });
            }
        );

        document.getElementById(
            "questionsContinueBtn"
        )?.addEventListener(
            "click",
            () => {
                this.page.continueSession();
            }
        );

        document.getElementById(
            "questionsBackBtn"
        )?.addEventListener(
            "click",
            () => {
                this.page.openLauncher();
            }
        );

        document.getElementById(
            "questionsRestartBtn"
        )?.addEventListener(
            "click",
            () => {
                this.page.restartSession();
            }
        );

        document.getElementById(
            "questionsFocusWeakBtn"
        )?.addEventListener(
            "click",
            () => {
                this.page.startFollowUp(
                    "weak_topic"
                );
            }
        );

        document.getElementById(
            "questionsReviewErrorsBtn"
        )?.addEventListener(
            "click",
            () => {
                this.page.startFollowUp(
                    "review_errors"
                );
            }
        );

        document.getElementById(
            "questionsMixedReviewBtn"
        )?.addEventListener(
            "click",
            () => {
                this.page.startFollowUp(
                    "mixed_review"
                );
            }
        );

        document.getElementById(
            "questionsResultsBackBtn"
        )?.addEventListener(
            "click",
            () => {
                this.page.openLauncher();
            }
        );
    },

    getTypeLabel(type) {
        return (
            this.page.data.questionTypes[
                type
            ]?.label || type
        );
    }
};

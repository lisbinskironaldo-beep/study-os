/* =====================================================
   STATS CORE 3.0
===================================================== */

const Stats = {

    goal: 4,
    weeklyGoalHours: 10,
    xpPerMinute: 2,

    achievementsList: [
        { id: "first_pomodoro", label: "Primeiro pomodoro", check: (d) => d.pomodorosToday >= 1 },
        { id: "ten_pomodoros", label: "10 pomodoros", check: (d) => d.totalPomodoros >= 10 },
        { id: "five_hours", label: "5 horas estudadas", check: (d) => d.totalStudySeconds >= 5 * 3600 },
        { id: "streak7", label: "7 dias de streak", check: (d) => d.streak >= 7 },
        { id: "level5", label: "Nivel 5", check: (d) => d.level >= 5 }
    ],

    data: JSON.parse(localStorage.getItem("study_stats_v2")) || {
        days: {},
        streak: 0,
        totalXP: 0,
        level: 1,
        unlocked: [],
        performance: {},
        history: [],
        sessions: []
    },

    getTodayKey() {
        const d = new Date();
        return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
    },

    ensureToday() {
        const key = this.getTodayKey();
        if (!this.data.days[key]) {
            this.data.days[key] = {
                seconds: 0,
                pomodoros: 0
            };
        }
        return key;
    },

    getTodayData() {
        const key = this.getTodayKey();
        return this.data.days[key] || { seconds: 0, pomodoros: 0 };
    },

    getAllDayEntries() {
        return Object.entries(this.data.days || {})
            .map(([key, value]) => ({
                key,
                seconds: Number(value?.seconds) || 0,
                pomodoros: Number(value?.pomodoros) || 0
            }))
            .sort((left, right) => left.key.localeCompare(right.key));
    },

    getActiveDayEntries() {
        return this.getAllDayEntries().filter((entry) =>
            entry.seconds > 0 || entry.pomodoros > 0
        );
    },

    getTotalStudySeconds() {
        return this.getAllDayEntries().reduce(
            (sum, entry) => sum + entry.seconds,
            0
        );
    },

    getTotalPomodoros() {
        return this.getAllDayEntries().reduce(
            (sum, entry) => sum + entry.pomodoros,
            0
        );
    },

    formatMinutesLabel(totalMinutes) {
        const minutes = Math.max(0, Math.round(Number(totalMinutes) || 0));
        const hours = Math.floor(minutes / 60);
        const remainder = minutes % 60;

        if (hours <= 0) {
            return `${remainder} min`;
        }

        if (remainder <= 0) {
            return `${hours}h`;
        }

        return `${hours}h ${remainder}min`;
    },

    getWeeklySnapshot(totalDays = 7) {
        const today = new Date();
        const entries = [];

        for (let offset = totalDays - 1; offset >= 0; offset -= 1) {
            const day = new Date(
                today.getFullYear(),
                today.getMonth(),
                today.getDate() - offset
            );
            const key = `${day.getFullYear()}-${day.getMonth()}-${day.getDate()}`;
            const stored = this.data.days?.[key] || {};
            entries.push({
                key,
                label: day.toLocaleDateString("pt-BR", { weekday: "short" }).replace(".", ""),
                seconds: Number(stored.seconds) || 0,
                pomodoros: Number(stored.pomodoros) || 0
            });
        }

        return entries;
    },

    recalculateStreak() {
        let streak = 0;
        const today = new Date();

        for (let offset = 0; offset < 365; offset += 1) {
            const day = new Date(
                today.getFullYear(),
                today.getMonth(),
                today.getDate() - offset
            );
            const key = `${day.getFullYear()}-${day.getMonth()}-${day.getDate()}`;
            const stored = this.data.days?.[key];
            const hasStudy = stored && ((Number(stored.seconds) || 0) > 0 || (Number(stored.pomodoros) || 0) > 0);

            if (!hasStudy) {
                break;
            }

            streak += 1;
        }

        this.data.streak = streak;
        return streak;
    },

    getRecentAccuracySnapshot(limit = 30) {
        const history = Array.isArray(this.data.history)
            ? this.data.history.slice(0, limit)
            : [];
        const total = history.length;
        const hits = history.filter((item) => Boolean(item?.correta)).length;
        const errors = Math.max(total - hits, 0);
        const accuracy = total > 0
            ? Math.round((hits / total) * 100)
            : 0;

        return {
            total,
            hits,
            errors,
            accuracy
        };
    },

    getWeakTopics(limit = 3) {
        return Object.entries(this.data.performance || {})
            .map(([topic, record]) => {
                const hits = Number(record?.acertos) || 0;
                const errors = Number(record?.erros) || 0;
                const total = hits + errors;
                return {
                    topic,
                    hits,
                    errors,
                    total,
                    accuracy: total > 0
                        ? Math.round((hits / total) * 100)
                        : 0
                };
            })
            .filter((item) => item.total > 0)
            .sort((left, right) =>
                right.errors - left.errors ||
                left.accuracy - right.accuracy ||
                right.total - left.total
            )
            .slice(0, limit);
    },

    getAchievementContext() {
        const today = this.getTodayData();
        return {
            ...this.data,
            pomodorosToday: Number(today.pomodoros) || 0,
            streak: this.data.streak || 0,
            level: this.data.level || 1,
            totalPomodoros: this.getTotalPomodoros(),
            totalStudySeconds: this.getTotalStudySeconds()
        };
    },

    getNextAchievements(limit = 3) {
        const achievementContext = this.getAchievementContext();

        return this.achievementsList
            .filter((item) => !this.data.unlocked.includes(item.id))
            .filter((item) => !item.check(achievementContext))
            .slice(0, limit);
    },

    addStudySeconds(seconds) {
        const key = this.ensureToday();
        this.data.days[key].seconds += seconds;

        const minutes = seconds / 60;
        this.data.totalXP += minutes * this.xpPerMinute;
        this.updateLevel();
        this.save();
    },

    addPomodoro() {
        const key = this.ensureToday();
        this.data.days[key].pomodoros++;
        this.save();
    },

    render() {
        const container = document.getElementById("studyStats");
        if (!container) return;

        const today = this.getTodayData();
        const activeDays = this.getActiveDayEntries().length;
        const recentAccuracy = this.getRecentAccuracySnapshot().accuracy;
        const hours = Math.floor(today.seconds / 3600);
        const minutes = Math.floor((today.seconds % 3600) / 60);
        const formatted = `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;

        this.recalculateStreak();

        container.innerHTML = `
            <div class="study-stat-item study-stat-item-primary">
                <div class="study-stat-value">${formatted}</div>
                <div class="study-stat-label">Tempo hoje</div>
            </div>
            <div class="study-stat-item">
                <div class="study-stat-value">${today.pomodoros}</div>
                <div class="study-stat-label">Pomodoros</div>
            </div>
            <div class="study-stat-item">
                <div class="study-stat-value">${activeDays}</div>
                <div class="study-stat-label">Dias ativos</div>
            </div>
            <div class="study-stat-item">
                <div class="study-stat-value">${recentAccuracy}%</div>
                <div class="study-stat-label">Acerto recente</div>
            </div>
        `;

        this.renderGoal();
        this.renderWeeklyChart();
        this.renderSessionLog();
        this.renderAdvancedStats();
        this.renderWeeklyGoal();
        this.renderLevel();
        this.renderStreakVisual();
        this.renderAchievements();
    },

    renderGoal() {
        const container = document.getElementById("dailyGoal");
        if (!container) return;

        const today = this.getTodayData();
        const totalMinutes = Math.floor((Number(today.seconds) || 0) / 60);
        const remaining = Math.max(this.goal - (Number(today.pomodoros) || 0), 0);
        const percent = Math.min((today.pomodoros / this.goal) * 100, 100);

        container.innerHTML = `
            <div class="stats-card-head">
                <span>Meta diaria</span>
                <strong>${Math.round(percent)}%</strong>
            </div>
            <div class="goal-bar">
                <div class="goal-progress" style="width:${percent}%"></div>
            </div>
            <div class="stats-inline-metrics">
                <div class="stats-inline-metric">
                    <span>Ciclos</span>
                    <strong>${today.pomodoros} / ${this.goal}</strong>
                </div>
                <div class="stats-inline-metric">
                    <span>Tempo</span>
                    <strong>${this.formatMinutesLabel(totalMinutes)}</strong>
                </div>
            </div>
            <div class="goal-text">
                ${remaining > 0 ? `Faltam ${remaining} ciclo(s) para fechar o dia.` : "Meta diaria concluida. Excelente ritmo."}
            </div>
        `;
    },

    renderWeeklyChart() {
        const container = document.getElementById("weeklyChart");
        if (!container) return;

        const week = this.getWeeklySnapshot(7);
        const maxSeconds = Math.max(...week.map((entry) => entry.seconds), 1);
        const totalMinutes = week.reduce((sum, entry) => sum + Math.floor(entry.seconds / 60), 0);

        container.innerHTML = `
            <div class="stats-card-head">
                <span>Evolucao</span>
                <strong>${this.formatMinutesLabel(totalMinutes)}</strong>
            </div>
            <div class="stats-evolution-chart">
                ${week.map((entry) => {
                    const height = Math.max(
                        12,
                        Math.round((entry.seconds / maxSeconds) * 100)
                    );

                    return `
                        <div class="stats-evolution-bar-wrap" title="${Math.floor(entry.seconds / 60)} min">
                            <span class="stats-evolution-bar" style="height:${height}%"></span>
                            <small>${entry.label}</small>
                        </div>
                    `;
                }).join("")}
            </div>
            <div class="goal-text">
                O grafico acompanha seu volume de estudo nos ultimos 7 dias.
            </div>
        `;
    },

    logSession(type, seconds) {
        if (!this.data.sessions) {
            this.data.sessions = [];
        }

        this.data.sessions.unshift({
            date: new Date().toLocaleString("pt-BR"),
            type,
            seconds
        });

        if (this.data.sessions.length > 20) {
            this.data.sessions.pop();
        }

        this.save();
    },

    renderSessionLog() {
        const container = document.getElementById("sessionLog");
        if (!container) return;

        const recent = Array.isArray(this.data.sessions)
            ? this.data.sessions.slice(0, 4)
            : [];

        container.innerHTML = `
            <div class="stats-card-head">
                <span>Ritmo recente</span>
                <strong>${recent.length} sessoes</strong>
            </div>
            <div class="stats-list">
                ${recent.length
                    ? recent.map((session) => {
                        const minutes = Math.floor((Number(session.seconds) || 0) / 60);
                        return `
                            <div class="log-item">
                                <div>${session.type}</div>
                                <div>${minutes} min</div>
                            </div>
                        `;
                    }).join("")
                    : `<div class="stats-empty-copy">Suas ultimas sessoes aparecem aqui conforme voce estuda.</div>`}
            </div>
        `;
    },

    renderAdvancedStats() {
        const container = document.getElementById("advancedStats");
        if (!container) return;

        const weakTopics = this.getWeakTopics(3);
        const totalAnswers = this.getRecentAccuracySnapshot(60).total;

        container.innerHTML = `
            <div class="stats-card-head">
                <span>Onde melhorar</span>
                <strong>${weakTopics.length ? "Foco" : "Sem dados"}</strong>
            </div>
            <div class="stats-topic-list">
                ${weakTopics.length
                    ? weakTopics.map((item) => `
                        <div class="stats-topic-row">
                            <div class="stats-topic-meta">
                                <strong>${item.topic}</strong>
                                <span>${item.accuracy}% de acerto</span>
                            </div>
                            <div class="stats-topic-track">
                                <span class="stats-topic-fill" style="width:${Math.max(10, item.accuracy)}%"></span>
                            </div>
                        </div>
                    `).join("")
                    : `<div class="stats-empty-copy">${totalAnswers > 0 ? "Continue respondendo para aparecerem pontos fracos por tema." : "As areas de reforco aparecem depois das primeiras respostas."}</div>`}
            </div>
        `;
    },

    renderWeeklyGoal() {
        const container = document.getElementById("weeklyGoal");
        if (!container) return;

        const totalSeconds = this.getTotalStudySeconds();
        const totalHours = totalSeconds / 3600;
        const remainingHours = Math.max(this.weeklyGoalHours - totalHours, 0);
        const percent = Math.min((totalHours / this.weeklyGoalHours) * 100, 100);

        container.innerHTML = `
            <div class="stats-card-head">
                <span>Meta semanal</span>
                <strong>${Math.round(percent)}%</strong>
            </div>
            <div class="wg-bar">
                <div class="wg-progress" style="width:${percent}%"></div>
            </div>
            <div class="stats-inline-metrics">
                <div class="stats-inline-metric">
                    <span>Feito</span>
                    <strong>${totalHours.toFixed(1)}h</strong>
                </div>
                <div class="stats-inline-metric">
                    <span>Falta</span>
                    <strong>${remainingHours.toFixed(1)}h</strong>
                </div>
            </div>
            <div class="wg-text">
                ${totalHours.toFixed(1)}h / ${this.weeklyGoalHours}h na semana
            </div>
        `;
    },

    updateLevel() {
        let leveledUp = false;
        let xpToNext = this.data.level * 100;

        while (this.data.totalXP >= xpToNext) {
            this.data.totalXP -= xpToNext;
            this.data.level++;
            leveledUp = true;
            xpToNext = this.data.level * 100;
        }

        if (leveledUp) {
            this.triggerLevelUpEffect();
        }
    },

    triggerLevelUpEffect() {
        const el = document.getElementById("levelSystem");
        if (!el) return;

        el.classList.add("level-up");

        setTimeout(() => {
            el.classList.remove("level-up");
        }, 1200);
    },

    renderLevel() {
        const container = document.getElementById("levelSystem");
        if (!container) return;

        const level = this.data.level;
        const xp = this.data.totalXP;
        const xpToNext = level * 100;
        const percent = Math.min((xp / xpToNext) * 100, 100);
        const totalPomodoros = this.getTotalPomodoros();

        container.innerHTML = `
            <div class="stats-card-head">
                <span>Nivel e XP</span>
                <strong>Nivel ${level}</strong>
            </div>
            <div class="level-bar">
                <div class="level-progress" style="width:${percent}%"></div>
            </div>
            <div class="stats-inline-metrics">
                <div class="stats-inline-metric">
                    <span>XP</span>
                    <strong>${Math.floor(xp)} / ${xpToNext}</strong>
                </div>
                <div class="stats-inline-metric">
                    <span>Ciclos</span>
                    <strong>${totalPomodoros}</strong>
                </div>
            </div>
            <div class="level-text">
                Faltam ${Math.max(xpToNext - Math.floor(xp), 0)} XP para o proximo nivel.
            </div>
        `;
    },

    checkAchievements() {
        const context = this.getAchievementContext();

        this.achievementsList.forEach((item) => {
            if (
                item.check(context) &&
                !this.data.unlocked.includes(item.id)
            ) {
                this.data.unlocked.push(item.id);
            }
        });
    },

    renderAchievements() {
        const container = document.getElementById("achievements");
        if (!container) return;

        this.checkAchievements();

        const unlockedList = this.data.unlocked || [];
        const nextAchievements = this.getNextAchievements(3);

        container.innerHTML = `
            <div class="stats-card-head">
                <span>Conquistas</span>
                <strong>${unlockedList.length}</strong>
            </div>
            <div class="stats-badge-grid">
                ${unlockedList.length
                    ? this.achievementsList
                        .filter((item) => unlockedList.includes(item.id))
                        .slice(0, 3)
                        .map((item) => `<div class="badge unlocked">${item.label}</div>`)
                        .join("")
                    : `<div class="stats-empty-copy">Suas primeiras conquistas aparecem conforme voce mantem ritmo e sobe de nivel.</div>`}
            </div>
            <div class="stats-next-goals">
                ${(nextAchievements.length
                    ? nextAchievements
                    : [{ label: "Todas as conquistas atuais foram desbloqueadas." }])
                    .map((item) => `<span>${item.label}</span>`)
                    .join("")}
            </div>
        `;
    },

    renderStreakVisual() {
        const container = document.getElementById("streakVisual");
        if (!container) return;

        const streak = this.data.streak;
        const activeDays = this.getActiveDayEntries().length;
        const consistency = this.getWeeklySnapshot(28);
        const streakLabel = streak > 0
            ? `${streak} dia${streak === 1 ? "" : "s"}`
            : "Aquecendo";

        container.innerHTML = `
            <div class="stats-card-head">
                <span>Consistencia</span>
                <strong>${streakLabel}</strong>
            </div>
            <div class="stats-consistency-compact">
                ${consistency.map((entry) => `
                    <span class="home-stats-consistency-cell ${entry.seconds > 0 || entry.pomodoros > 0 ? "is-active" : ""}" title="${Math.floor(entry.seconds / 60)} min"></span>
                `).join("")}
            </div>
            <div class="stats-inline-metrics">
                <div class="stats-inline-metric">
                    <span>Dias ativos</span>
                    <strong>${activeDays}</strong>
                </div>
                <div class="stats-inline-metric">
                    <span>Ritmo</span>
                    <strong>${Math.max(streak, 1)}x</strong>
                </div>
            </div>
            <div class="level-text">
                Sua constancia mostra quantos dias voce voltou para estudar e manter o ritmo.
            </div>
        `;
    },

    addAnswer({ tema, correta }) {
        if (!tema) return;

        this.data.history.unshift({
            tema,
            correta,
            timestamp: Date.now()
        });

        if (this.data.history.length > 200) {
            this.data.history.pop();
        }

        if (!this.data.performance[tema]) {
            this.data.performance[tema] = {
                acertos: 0,
                erros: 0
            };
        }

        if (correta) {
            this.data.performance[tema].acertos++;
        } else {
            this.data.performance[tema].erros++;
        }

        this.save();
    },

    save() {
        localStorage.setItem("study_stats_v2", JSON.stringify(this.data));
        this.render();
    }
};

document.addEventListener("DOMContentLoaded", () => {
    Stats.render();
});

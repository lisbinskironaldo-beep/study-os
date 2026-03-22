const Alarm = {

    init() {
        this.render();
        document.addEventListener("planner:reminders-updated", () => {
            this.render();
        });
    },

    render() {
        const container = document.getElementById("alarmModule");
        if (!container) return;

        const reminders = typeof Calendar !== "undefined"
            ? Calendar.getQuickReminders()
            : [];

        container.innerHTML = `
<section class="alarm-bridge">
  <div class="alarm-bridge-copy">
    <div class="planner-kicker">Agora junto da agenda</div>
    <h2>Alarmes viraram lembretes rapidos</h2>
    <p>Para a experiencia ficar mais limpa, os avisos foram acoplados na agenda. Eventos do dia e lembretes recorrentes agora vivem no mesmo fluxo.</p>
  </div>

  <div class="alarm-bridge-actions">
    <button id="alarmBridgeOpenCalendar" type="button">Abrir agenda</button>
    <button id="alarmBridgeNewReminder" type="button">Novo lembrete rapido</button>
  </div>

  <div class="alarm-bridge-list">
    ${reminders.length
        ? reminders.slice(0, 6).map(reminder => `
<article class="alarm-bridge-card">
  <div class="alarm-bridge-time">${reminder.hour}:${reminder.minute}</div>
  <div class="alarm-bridge-title">${reminder.title}</div>
  <div class="alarm-bridge-meta">${reminder.days.map(day => day.toUpperCase()).join(" • ")}</div>
</article>
`).join("")
        : `
<div class="planner-empty-state">
  <div class="planner-empty-title">Nenhum lembrete rapido ativo.</div>
  <div class="planner-empty-text">Crie um na agenda e ele aparece aqui tambem.</div>
</div>
`}
  </div>
</section>
`;

        document.getElementById("alarmBridgeOpenCalendar")?.addEventListener("click", () => {
            if (typeof Core !== "undefined") {
                Core.navigate("calendar");
            }
        });

        document.getElementById("alarmBridgeNewReminder")?.addEventListener("click", () => {
            if (typeof Core !== "undefined") {
                Core.navigate("calendar");
            }

            requestAnimationFrame(() => {
                if (typeof Calendar !== "undefined") {
                    Calendar.openQuickReminderModal();
                }
            });
        });
    }
};

document.addEventListener("DOMContentLoaded", () => {
    Alarm.init();
});

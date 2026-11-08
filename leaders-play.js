// 🏁 Кнопка «Грати» в турнірній таблиці (власниця, 07.11.2026): одразу марафон гри з відкритої вкладки.
// Якщо марафон цієї гри доступний лише в Спільноті (зараз — «Кличний» без PRO) — вікно Спільноти з мотивацією
// (новачкам — кнопка підписки; старим гравцям, як і всюди, — «Спільнота відкриється скоро»). Місце в статистиці — leaders_<гра>.
const LEADERS_PLAY = {
  naholosy: { name: "Наголоси", ok: () => true },
  leksychna: { name: "Лексична помилка", ok: () => true },
  klychnyi: { name: "Кличний відмінок", ok: () => Boolean(BETA_OPEN) }
};

function leadersPlayRender(game) {
  const btn = $("btn-leaders-play");
  const cfg = LEADERS_PLAY[game];
  if (!btn) return;
  btn.hidden = !cfg;
  if (!cfg) return;
  btn.textContent = cfg.ok() ? `🏁 Грати в марафон: ${cfg.name}` : `🔒 Грати в марафон: ${cfg.name}`;
  btn.onclick = () => leadersPlay(game);
}

function leadersPlay(game) {
  const cfg = LEADERS_PLAY[game];
  if (!cfg) return;
  if (!cfg.ok()) {
    const g = GAMES.find(x => x.id === game);
    if (!g || typeof showPro !== "function") return;
    window.proPlace = "leaders_" + game;
    showPro(g);
    if (typeof proUpsell === "function" && proUpsell()) {
      $("pro-title").textContent = `🏆 Марафон: ${g.icon} ${g.name}`;
      $("pro-text").textContent = "Марафон і турнірна таблиця цієї гри — для учасників Спільноти Укрмовича. Долучайся — і нарешті зіграй у марафон, побий рекорди й покажи всім, хто тут найкрутіший! 😎🏆";
    }
    return;
  }
  if (game === "leksychna") {
    if (typeof showLeksModes !== "function") return;
    showLeksModes();
    const b = $("btn-leks-marathon");
    if (b) b.click();
    return;
  }
  if (game === "naholosy" && typeof currentTopic !== "undefined") currentTopic = ""; // марафон з усіх слів (як у таблиці)
  showModes(game);
  const b = $("btn-marathon");
  if (b && !b.closest("section").hidden) b.click();
}

if (typeof showLeaders === "function") {
  const orig = showLeaders;
  showLeaders = function (game) {
    try { leadersPlayRender(game); } catch (e) { /* */ }
    return orig.apply(this, arguments);
  };
}

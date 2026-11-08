// Час у грі (SQL — game-time.sql): кожні 5 с, якщо відкрито гру й гравець щось натискав за останні 90 с,
// додаємо 5 с до поточної гри; раз на хвилину (і коли сторінку ховають) надсилаємо в add_game_time.
// Показ: таблиця класу (myclass.js), статистика → «Класи», «Мої учні».
const GT_TICK = 5;
const GT_IDLE_MS = 90000;
const gtPending = {};
let gtLastInput = Date.now();
["pointerdown", "keydown", "touchstart"].forEach(ev =>
  document.addEventListener(ev, () => { gtLastInput = Date.now(); }, { passive: true, capture: true }));

function gtCurrentGame() {
  if (!screens.game.hidden && currentGame) return currentGame;
  if (screens.nmttest && !screens.nmttest.hidden) return "nmttest";
  if (!screens.duel.hidden && duel && duel.game) return duel.game;
  if (screens.online && !screens.online.hidden && typeof gameKey === "function") return gameKey();
  return "";
}

function gtFlush() {
  if (typeof leaderboardEnabled === "undefined" || !leaderboardEnabled) return;
  Object.keys(gtPending).forEach(game => {
    const seconds = Math.min(gtPending[game], 900);
    delete gtPending[game];
    if (seconds < 1) return;
    fetch(`${LB.url}/rest/v1/rpc/add_game_time`, {
      method: "POST",
      keepalive: true,
      headers: { apikey: LB.anonKey, Authorization: `Bearer ${LB.anonKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({ p_player: getPlayerId(), p_game: game, p_seconds: seconds })
    }).catch(() => {});
  });
}

setInterval(() => {
  if (document.visibilityState !== "visible" || Date.now() - gtLastInput > GT_IDLE_MS) return;
  const game = gtCurrentGame();
  if (game) gtPending[game] = (gtPending[game] || 0) + GT_TICK;
  // «Інше» й «Історія»: ще й окремо кожен тренажер (q_<id>; у статистиці «Тестери» — під «Іншим»)
  if (game === "inshe" && typeof insheQuiz !== "undefined" && insheQuiz && /^[a-z0-9_]{1,28}$/.test(insheQuiz.id)) gtPending["q_" + insheQuiz.id] = (gtPending["q_" + insheQuiz.id] || 0) + GT_TICK;
}, GT_TICK * 1000);
setInterval(gtFlush, 60000);
document.addEventListener("visibilitychange", () => { if (document.visibilityState === "hidden") gtFlush(); });
window.addEventListener("pagehide", gtFlush);

// 75 → «1 хв», 4000 → «1 год 7 хв», 40 → «40 с»
function formatGameTime(sec) {
  sec = Number(sec) || 0;
  if (sec < 60) return `${sec} с`;
  const h = Math.floor(sec / 3600), m = Math.floor((sec % 3600) / 60);
  return h ? `${h} год${m ? ` ${m} хв` : ""}` : `${m} хв`;
}

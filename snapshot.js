// 🧪 Знімок стану гри тестера (власниця, 04.11.2026): лише для PRO-гравців (та вручну доданих тестерів — сервер сам
// перевіряє, testers.sql). Раз на 5 хв і при згортанні — прогрес і пам'ять груп тренування (localStorage train_…, best_…),
// вигляд плиток, пристрій, версія гри → save_snapshot → статистика, вкладка «🧪 Тестери» («як бачить тестер»).
(function () {
  // + усі, хто має «Мій план» (07.11.2026: план відкрито для всіх — бот рахує вивчене за знімком)
  const hasPlan = (() => { try { return Boolean(localStorage.getItem("player_plan")); } catch (e) { return false; } })();
  if (!((typeof PRO_ACCESS !== "undefined" && PRO_ACCESS) || hasPlan) || typeof lbRequest !== "function") return;
  let last = "";
  function collect() {
    const keys = {};
    try {
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (/^(train_|best_)/.test(k)) keys[k] = localStorage.getItem(k);
      }
    } catch (e) { /* немає сховища */ }
    const v = (document.querySelector('script[src*="script.js"]') || {}).src || "";
    return {
      keys, view: typeof memView === "function" ? memView() : null,
      screen: `${window.innerWidth}×${window.innerHeight}`, ua: navigator.userAgent.slice(0, 160),
      platform: (window.Telegram && Telegram.WebApp && Telegram.WebApp.platform) || "",
      version: (v.split("?v=")[1] || ""), pro: Boolean(window.GYM_PRO && GYM_PRO.ok), at: Date.now()
    };
  }
  function send() {
    const data = collect();
    const sig = JSON.stringify(data.keys);
    if (sig === last) return;
    last = sig;
    lbRequest("rpc/save_snapshot", { method: "POST", body: JSON.stringify({ p_player: getPlayerId(), p_data: data }), keepalive: true }).catch(() => { last = ""; });
  }
  setTimeout(send, 8000);
  setInterval(send, 5 * 60 * 1000);
  document.addEventListener("visibilitychange", () => { if (document.visibilityState === "hidden") send(); });
})();

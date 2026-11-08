// 🤖 Грати в Telegram-мініапці — лише підписаним на @ukrmovych_bot (власниця, 07.11.2026).
// Функція bot-sub (supabase/functions/bot-sub) перевіряє, чи бот може написати гравцю (натиснув «Почати» й не заблокував).
// Меню з'являється одразу, перевірка йде у фоні; не підписаний — екран «Підпишись на бота» поверх гри.
// Підписаний — запам'ятовуємо (localStorage bot_sub), далі вікно не з'являється, а перевірка раз на 3 дні йде непомітно.
// Якщо сервер не відповів — гру не блокуємо. Поза Telegram і у вбудованому режимі (embed) — нічого не робить.
// Статистика: bot_gate_view (побачив вимогу), bot_gate_ok (після неї підписався) → get_bot_gate_stats (bot-gate.sql).
(function wait(n) {
  // скрипт Telegram вантажиться окремо (async) — чекаємо, поки з'являться дані учня (до ~10 с)
  const inTg = typeof IN_TG !== "undefined" ? IN_TG : /tgWebAppData/.test(location.hash);
  if (inTg && !(window.Telegram && Telegram.WebApp && Telegram.WebApp.initData) && n < 40) { setTimeout(() => wait(n + 1), 250); return; }
  botGate();
})(0);
function botGate() {
  const BOT = "ukrmovych_bot";
  const KEY = "bot_sub";
  const RECHECK = 3 * 864e5;
  const tg = window.Telegram && Telegram.WebApp;
  const initData = typeof telegramInitData === "function" ? telegramInitData() : "";
  if (!initData || /[?&]embed=/.test(location.search) || typeof LB === "undefined" || !LB.url) return;
  let shown = false, via = "", checking = false;
  const last = Number((() => { try { return localStorage.getItem(KEY); } catch (e) { return 0; } })()) || 0;

  async function check() {
    if (checking) return null;
    checking = true;
    try {
      const res = await fetch(`${LB.url}/functions/v1/bot-sub`, {
        method: "POST",
        headers: { apikey: LB.anonKey, Authorization: `Bearer ${LB.anonKey}`, "Content-Type": "application/json" },
        body: JSON.stringify({ initData })
      });
      const r = await res.json();
      via = r.via || via;
      return r.sub; // true | false | null
    } catch (e) { return null; } finally { checking = false; }
  }
  function ok() {
    try { localStorage.setItem(KEY, String(Date.now())); } catch (e) { /* */ }
    if (shown && typeof track === "function") track("bot_gate_ok");
    const g = document.getElementById("bot-gate");
    if (g) g.remove();
    shown = false;
  }
  function gate() {
    try { localStorage.removeItem(KEY); } catch (e) { /* */ }
    if (shown) return;
    shown = true;
    if (typeof track === "function") track("bot_gate_view");
    const g = document.createElement("div");
    g.id = "bot-gate";
    g.className = "bot-gate";
    g.innerHTML = `<div class="bot-gate-card">
      <img src="logo.png" alt="" width="84" height="84" class="bot-gate-logo">
      <h2>Ще один крок — і качаємось! 💪</h2>
      <p>Щоб грати в НМТ-качалку, підпишись на нашого бота <b>@${BOT}</b>. Він нагадає, коли настане час повторити вивчене, — і до НМТ нічого не забудеться 🧠</p>
      <button type="button" class="btn-primary bot-gate-go">🤖 Підписатися на бота</button>
      <button type="button" class="btn-secondary bot-gate-done">✅ Готово — перевірити</button>
      <p class="bot-gate-hint" hidden></p>
    </div>`;
    document.body.appendChild(g);
    const hint = g.querySelector(".bot-gate-hint");
    const say = t => { hint.textContent = t; hint.hidden = !t; };
    const recheck = async () => {
      say("Перевіряю…");
      const s = await check();
      if (s === true || s === null) ok();
      else say(`Поки не бачу підписки 🙈 Відкрий @${BOT}, натисни «Почати» (Start) — і повертайся сюди.`);
    };
    g.querySelector(".bot-gate-go").onclick = () => {
      // мініапку відкрито через самого @ukrmovych_bot — дозвіл одним натисканням
      if (via === "ukrmovych" && tg && typeof tg.requestWriteAccess === "function") {
        try { tg.requestWriteAccess(granted => { if (granted) recheck(); else say(`Без підписки на бота гра не відкриється. Натисни ще раз або відкрий @${BOT} і натисни «Почати».`); }); return; } catch (e) { /* стара версія Telegram */ }
      }
      const url = `https://t.me/${BOT}?start=gym`;
      if (tg && tg.openTelegramLink) tg.openTelegramLink(url); else window.open(url, "_blank");
      say(`У чаті з ботом натисни «Почати» (Start) — і повертайся сюди.`);
    };
    g.querySelector(".bot-gate-done").onclick = recheck;
    document.addEventListener("visibilitychange", () => { if (shown && document.visibilityState === "visible") recheck(); });
  }

  // підписаний недавно — нічого не показуємо; інакше перевіряємо одразу
  if (last && Date.now() - last < RECHECK) return;
  check().then(s => { if (s === false) gate(); else if (s === true) ok(); });
}

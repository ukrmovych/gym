// 🦆 Заклик до Спільноти для НОВИХ гравців (власниця, 06.11.2026 — експеримент: чи підпишуться нові).
// Новий гравець — той, хто вперше відкрив гру з 05.11.2026 (localStorage player_since; хто вже мав рекорди/тренування
// до появи цього файлу — старий). Для нових: замість «скоро» на закритих тренажерах — «🔒 PRO», а у вікні PRO, під
// закритими групами «Лексичної помилки» тощо — «Стати учасником спільноти й відкрити всі тренажери» з
// переходом на сторінку підписки в monobase (LB.proLink). Події: pro_click (вікно), pro_buy_click (перехід).
const UPSELL_FROM = "2026-11-05";
const GYM_LAUNCH = Date.parse("2026-11-15T20:30:00+02:00"); // 🚀 відкриття НМТ-качалки (countdown.js)
const UPSELL_LINK = (typeof LB !== "undefined" && LB.proLink) || "https://base.monobank.ua/sp/DG8NzmnGCQV3An";
const UPSELL_CTA = "🦆 Стати учасником спільноти й відкрити всі тренажери"; // власниця, 07.11.2026: ціну в грі не пишемо — її видно на сторінці підписки
const PLAYER_SINCE = (() => {
  let v = storageGet("player_since");
  if (!v) {
    let old = false;
    try {
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i) || "";
        if (/^(best_|train_|duel_|feedback_sent|player_name|player_classes)/.test(k)) { old = true; break; }
      }
    } catch (e) { /* немає сховища */ }
    v = old ? "old" : new Date().toISOString().slice(0, 10);
    storageSet("player_since", v);
  }
  return v;
})();
function proUpsell() {
  if (typeof NEWBIE !== "undefined" && NEWBIE) return true; // ?newbie — як для новачка
  // з відкриття (15.11.2026 20:30) — і старим гравцям так само, як новим (власниця, 08.11.2026)
  const fresh = (PLAYER_SINCE !== "old" && PLAYER_SINCE >= UPSELL_FROM) || Date.now() >= GYM_LAUNCH;
  return fresh && !(typeof isPro !== "undefined" && isPro) && !BETA_OPEN;
}
// показ пропозиції (вікно PRO, розгорнуті закриті групи) — у статистику, раз на місце за хвилину
const upsellSeen = {};
function upsellView(place) {
  if (!proUpsell() || (upsellSeen[place] && Date.now() - upsellSeen[place] < 60000)) return;
  upsellSeen[place] = Date.now();
  track("pro_offer_view", { place });
}
function upsellGo(place) {
  track("pro_buy_click", { place });
  const tg = window.Telegram && window.Telegram.WebApp;
  if (tg && tg.openLink && typeof telegramInitData === "function" && telegramInitData()) tg.openLink(UPSELL_LINK);
  else window.open(UPSELL_LINK, "_blank", "noopener");
}
// вікно PRO: для нових — заклик із ціною й прямий перехід на підписку
if (typeof showPro === "function") {
  const showProOrig = showPro;
  showPro = function (game) {
    showProOrig.apply(this, arguments);
    if (!proUpsell()) return;
    // власниця, 08.11.2026: коротко, на два рядки
    $("pro-text").innerHTML = "🔓 У Спільноті Укрмовича відкриються <b>всі тренажери</b> — з поясненнями до кожної помилки.<br><small>Працюють у Telegram-мініапці @ukrmovych_bot</small>";
    const buy = $("btn-pro-buy");
    buy.hidden = false;
    buy.textContent = UPSELL_CTA;
    buy.href = UPSELL_LINK;
    const place = window.proPlace || "pro_" + (game && game.id); // proPlace — інше місце (напр. leaders_klychnyi з leaders-play.js)
    window.proPlace = "";
    upsellView(place);
    buy.onclick = () => track("pro_buy_click", { place });
  };
}
// плитки «скоро» → «🔒 PRO» для нових (після того, як усе завантажилось, зокрема кнопка «Мій клас»)
window.addEventListener("load", () => { if (proUpsell() && typeof renderMenu === "function") try { renderMenu(); } catch (e) { /* */ } });

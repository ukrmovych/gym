// 🔗 Відкрити одразу потрібну гру (власниця, 04.11.2026): …/gym/?go=<гра> або Telegram start_param g_<гра>.
// <гра> — id з GAMES (naholosy, inshomovni, klychnyi…) або inshe_<тренажер> (тренажер «Іншого» / «Історії», напр. inshe_ist_d1).
// Використовують кнопки нагадувань «час повторити» в боті (функція mem-remind). Відкривається так само, як натисканням
// плитки в меню (замочки PRO діють як завжди).
// хеш ключа групи — так само в кабінеті платформи (testtest index.html, gymKeyHash)
function gymKeyHash(s) { let h = 5381; for (const ch of String(s)) h = (Math.imul(h, 33) ^ ch.codePointAt(0)) >>> 0; return h.toString(36); }
function goGroup(game, hash, tries = 0) {
  const cfg = typeof TRAIN_GAMES !== "undefined" && TRAIN_GAMES[game];
  let g = null;
  try { g = cfg && cfg.groups().find(x => gymKeyHash(x.key) === hash); } catch (e) { g = null; }
  if (g && typeof startGroupTraining === "function") { if (!(typeof gymHwOpen === "function" && gymHwOpen(game, g.key))) startGroupTraining(game, [g.key]); return; }
  if (tries < 15) { setTimeout(() => goGroup(game, hash, tries + 1), 600); return; }
  // групи не знайшлося — хоча б екран цієї гри
  if (typeof showModes === "function" && game !== "inshomovni" && game !== "leksychna") showModes(game);
  else if (game === "inshomovni" && typeof showInshModes === "function") showInshModes();
  else if (game === "leksychna" && typeof showLeksModes === "function") showLeksModes();
}
(function () {
  let go = "";
  try {
    const q = new URLSearchParams(location.search);
    go = q.get("go") || "";
    if (!go) {
      const tg = window.Telegram && Telegram.WebApp;
      const sp = (tg && tg.initDataUnsafe && tg.initDataUnsafe.start_param) || q.get("tgWebAppStartParam") || "";
      if (sp.startsWith("g_")) go = sp.slice(2);
      // з кабінету платформи (телефон): c<квиток><гра><хеш ключа групи> — одразу тренування групи ДЗ (вхід за квитком робить loader.js)
      const m = /^c[0-9a-f]{36}([nifsl])([0-9a-z]{1,8})$/.exec(sp);
      if (m) { goGroup({ n: "naholosy", i: "inshomovni", f: "frazeolohizmy", s: "slovospoluch", l: "leksychna" }[m[1]], m[2]); return; }
    }
  } catch (e) { return; }
  if (!/^[a-z0-9_]{2,40}$/.test(go)) return;
  // короткі службові назви з ключів тренування (старі нагадування бота: ?go=leks) → справжні ігри
  go = { leks: "leksychna", slovo: "slovospoluch", frazeo: "frazeolohizmy", chys: "chyslivnyky", klych: "klychnyi" }[go] || go;
  try { history.replaceState(null, "", location.pathname + location.search.replace(/([?&])go=[^&]*&?/, "$1").replace(/[?&]$/, "") + location.hash); } catch (e) { /* */ }
  async function open() {
    if (go.startsWith("inshe_") && typeof insheOpen === "function") {
      const id = go.slice(6);
      const hist = id.startsWith("ist_");
      if (!hist && typeof DEMO !== "undefined" && DEMO) { const t = document.querySelector('#menu [data-best="inshe"]'); const b = t && t.closest("button"); if (b) b.click(); else if (typeof showPro === "function") showPro(GAMES.find(g => g.id === "inshe")); return; } // «Інше» — лише в Спільноті
      await showInsheSections(hist ? "istoriia" : undefined); // вантажить дані «Іншого»
      if (typeof INSHE_META !== "undefined" && INSHE_META[id]) insheOpen(id);
      return;
    }
    if (go === "plan" && document.getElementById("btn-plan")) { document.getElementById("btn-plan").click(); return; } // окрема кнопка
    const tile = document.querySelector(`#menu [data-best="${go}"]`);
    const btn = tile && tile.closest("button");
    if (btn) btn.click();
    else if (go === "slovospoluch") showModes("slovospoluch"); // ці дві — всередині плитки «Лексична помилка» (leks-menu.js)
    else if (go === "leksychna" && typeof leksOpenSentences === "function") leksOpenSentences();
    else if (go === "leksmenu" && typeof showLeksChoice === "function") showLeksChoice();
  }
  setTimeout(open, 300);
})();

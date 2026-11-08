// Переїзд гри з ukrmovych.github.io/naholosy/ на ukrmovych.duckdns.org/gym/.
// Браузер зберігає дані (рекорди, прогрес груп, ім'я) окремо для кожної адреси, тому:
//  • на СТАРІЙ адресі цей скрипт збирає дані гри й одразу відкриває нову адресу,
//    передаючи дані в посиланні (після «#», на сервер вони не потрапляють);
//  • на НОВІЙ адресі приймає ці дані й об'єднує з тими, що вже є
//    (рекорди й прогрес — кращі з двох, номер гравця — старий, щоб лишитися в турнірній таблиці).
// Підключається першим у <head>. Коли стару адресу вимкнуть, перша частина просто не спрацює.
(function () {
  var OLD_HOST = "ukrmovych.github.io";
  var OLD_BASE = "/naholosy/";
  var NEW_BASE = "https://ukrmovych.duckdns.org/gym/";
  // Які ключі належать грі (на старому домені можуть бути дані інших сторінок)
  var KEYS = /^(best_|train_|player_|duel_|qr_target_|stats_|modes_open$|feedback_sent$)/;

  // ---------- Стара адреса: зібрати дані й переїхати ----------
  // …?stay — лишитися на github.io (коли мережа блокує duckdns): гра працює й тут
  if (location.hostname === OLD_HOST && location.pathname.indexOf(OLD_BASE) === 0
      && !/[?&]stay(=|&|$)/.test(location.search)) {
    var data = {};
    try {
      for (var i = 0; i < localStorage.length; i++) {
        var k = localStorage.key(i);
        if (KEYS.test(k)) data[k] = localStorage.getItem(k);
      }
    } catch (e) { /* сховище недоступне — переїжджаємо без даних */ }
    var payload = "";
    try { payload = btoa(unescape(encodeURIComponent(JSON.stringify(data)))); } catch (e) { payload = ""; }
    var rest = location.pathname.slice(OLD_BASE.length);         // напр. "stats/"
    var hash = location.hash.replace(/^#/, "");                    // Telegram передає тут свої дані — зберігаємо
    var target = NEW_BASE + rest + location.search + "#" + (hash ? hash + "&" : "") + "moveData=" + encodeURIComponent(payload);
    document.documentElement.style.visibility = "hidden";
    location.replace(target);
    return;
  }

  // ---------- Нова адреса: прийняти дані ----------
  var m = location.hash.match(/(?:^#|&)moveData=([^&]*)/);
  if (!m) return;
  try {
    var incoming = JSON.parse(decodeURIComponent(escape(atob(decodeURIComponent(m[1])))));
    Object.keys(incoming).forEach(function (key) {
      if (!KEYS.test(key)) return;
      var oldValue = incoming[key];
      var here = localStorage.getItem(key);
      if (/^(best_|train_)/.test(key)) {
        // рекорд / прогрес групи — кращий з двох
        if (here === null || Number(oldValue) > Number(here)) localStorage.setItem(key, oldValue);
      } else if (key === "player_id") {
        // старий номер гравця — щоб лишитися тим самим у турнірній таблиці
        localStorage.setItem(key, oldValue);
      } else if (here === null) {
        localStorage.setItem(key, oldValue);
      }
    });
    localStorage.setItem("moved_from_github", String(Date.now()));
  } catch (e) { /* пошкоджені дані — просто граємо далі */ }
  // прибираємо дані з адреси, решту (зокрема параметри Telegram) лишаємо
  var cleanHash = location.hash.replace(/(^#|&)moveData=[^&]*/, "$1").replace(/^#&/, "#").replace(/&$/, "");
  if (cleanHash === "#") cleanHash = "";
  try { history.replaceState(null, "", location.pathname + location.search + cleanHash); } catch (e) { /* не страшно */ }
})();

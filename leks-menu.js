// 🔎 «Лексична помилка» — одна плитка в меню (власниця, 08.11.2026) → екран вибору: словосполучення або речення.
// Без підписів кількості; порада — починати зі словосполучень (на НМТ є обидва типи завдань).
// «‹ Меню» на екранах словосполучень і речень повертає сюди (script.js btn-modes-back, leks.js btn-leks-back).
function leksOpenSentences() {
  if (typeof LEKS_DATA !== "undefined" && LEKS_DATA && typeof showLeksModes === "function") showLeksModes();
  else { if (typeof leksMode !== "undefined") leksMode = "marathon"; startGame("leksychna"); }
}
screens.leksChoice = (() => {
  const main = document.createElement("main");
  main.id = "leks-choice";
  main.className = "screen";
  main.hidden = true;
  main.innerHTML = `
    <header class="top-bar">
      <button type="button" class="icon-btn lc-back" aria-label="В меню">‹ Меню</button>
      <h2 class="screen-title">🔎 Лексична помилка</h2>
    </header>
    <div class="lc-box">
      <p class="lc-tip">💡 Почни зі <b>словосполучень</b> — так легше навчитися помічати помилку.<br><small>На НМТ трапляються обидва типи завдань.</small></p>
      <button type="button" class="game-tile lc-tile lc-first" data-lc="slovo">
        <span class="tile-icon" aria-hidden="true">🧩</span>
        <span class="tile-name">Словосполучення<span class="tile-sub">Правильно чи неправильно?</span></span>
        <span class="badge lc-badge">Почни звідси</span>
      </button>
      <button type="button" class="game-tile lc-tile" data-lc="leks">
        <span class="tile-icon" aria-hidden="true">🔎</span>
        <span class="tile-name">Речення<span class="tile-sub">Знайди помилку в реченні</span></span>
      </button>
    </div>`;
  $("menu").after(main);
  main.querySelector(".lc-back").addEventListener("click", () => showMenu());
  main.querySelector('[data-lc="slovo"]').addEventListener("click", () => showModes("slovospoluch"));
  main.querySelector('[data-lc="leks"]').addEventListener("click", leksOpenSentences);
  return main;
})();
function showLeksChoice() {
  clearTimeout(nextTimer);
  training = null;
  questionToken++;
  showScreen("leksChoice");
}

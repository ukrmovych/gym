// 🎁 Демо для новачків (власниця, 07.11.2026). Хто вперше відкрив гру з 05.11.2026 і не має PRO (DEMO у script.js,
// дані — demo/…, підставляє loader.js): у кожному PRO-тренажері відкрита перша група — тренування, повторення,
// дуель і гра для класу. Марафон і спринт приховано (там потрібні всі групи). Часто й щоразу інакше заохочуємо
// відкрити все в Спільноті Укрмовича (upsell.js: UPSELL_CTA, upsellGo, upsellView → статистика «Пропозиція підписки»).
// Коли групу вивчено (≥ 80 %), у Telegram бот нагадає повторити саме тоді, коли гра скаже «повтори» (функція later-remind).
const DEMO_NUDGES = [
  "Перша група — є! 💪 Решта груп і марафон чекають у Спільноті Укрмовича.",
  "Подобається? Це лише перша група. Усі тренажери НМТ-качалки відкриваються в Спільноті 🦆",
  "Так тримати! Хочеш пройти не одну групу, а все, що буде на НМТ? Долучайся до Спільноти.",
  "Ти вже знаєш більше, ніж годину тому 😎 Відкрий решту груп — і готуйся до НМТ без прогалин.",
  "Перша група — лише розминка! У Спільноті — 50+ тренажерів і тисячі завдань.",
  "Марафон, усі групи й тренажери «Іншого» відкриваються в Спільноті Укрмовича 🦆",
  "Одна група вивчена — а скільки ще балів можна взяти на НМТ? Усі групи — в Спільноті.",
  "Круто виходить! Уяви, як упевнено почуватимешся, коли пройдеш усі групи 🚀",
  "Тренуватися на одній групі — як читати лише перший розділ книжки 📖 Відкрий усе в Спільноті."
];
let demoNudgeI = Math.floor(Math.random() * DEMO_NUDGES.length);
const demoIsPro = id => DEMO && typeof GAMES !== "undefined" && Boolean((GAMES.find(g => g.id === id) || {}).pro);

function demoNudge(parent, place, before = null) {
  if (!parent || typeof UPSELL_CTA === "undefined") return;
  parent.querySelectorAll(":scope > .demo-nudge").forEach(x => x.remove());
  const box = document.createElement("div");
  box.className = "demo-nudge";
  demoNudgeI = (demoNudgeI + 1 + Math.floor(Math.random() * 3)) % DEMO_NUDGES.length; // щоразу інше формулювання
  box.innerHTML = `<p>${DEMO_NUDGES[demoNudgeI]}</p><button type="button" class="btn-primary demo-nudge-btn"></button>`;
  box.querySelector("button").textContent = UPSELL_CTA;
  box.querySelector("button").onclick = () => upsellGo(place);
  if (before && before.parentNode === parent) parent.insertBefore(box, before); else parent.appendChild(box);
  if (typeof upsellView === "function") upsellView(place);
}

// Екран режимів: банер «Демо», без марафону й спринту
function demoModes(game, screen) {
  const on = demoIsPro(game);
  const mar = document.getElementById("btn-marathon");
  if (mar && screen.id === "modes") mar.closest("section").hidden = on;
  const im = document.getElementById("btn-insh-marathon");
  if (im && screen.id === "insh-modes") im.closest("section").hidden = on;
  screen.querySelectorAll('.online-mode-btn[data-mode="sprint"]').forEach(b => { b.hidden = on; });
  // номери режимів — по порядку видимих (без марафону «2» стає «1»)
  let k = 0;
  screen.querySelectorAll(".mode-num").forEach(n => {
    if (!n.dataset.num) n.dataset.num = n.textContent;
    const sec = n.closest("section");
    if (on && sec && !sec.hidden && sec.offsetParent !== null) n.textContent = String(++k);
    else if (!on) n.textContent = n.dataset.num;
  });
  let ban = screen.querySelector(".demo-banner");
  if (!on) { if (ban) ban.hidden = true; return; }
  if (!ban) {
    ban = document.createElement("div");
    ban.className = "demo-banner";
    const lead = screen.querySelector(".modes-lead") || screen.querySelector("header");
    if (lead) lead.after(ban); else screen.prepend(ban);
  }
  ban.hidden = false;
  // 📊 статистика: новачок відкрив демо-тренажер (track додає details.demo; «Інше» — sub, назва тренажера)
  const sub = game === "inshe" && typeof insheQuiz !== "undefined" && insheQuiz ? insheQuiz.id : "";
  if (typeof track === "function") track("demo_open", { game_type: game, ...(sub ? { sub, sub_name: insheQuiz.name } : {}) });
  ban.innerHTML = `<b>🎁 Демо-доступ</b><span>Відкрита перша група — тренуй її, повторюй, грай дуель і з класом. Усі групи, марафон і спринт — у <a href="#" class="demo-link">Спільноті Укрмовича</a>.</span>`;
  ban.querySelector(".demo-link").onclick = e => { e.preventDefault(); upsellGo("demo_modes_" + game); };
  if (typeof upsellView === "function") upsellView("demo_modes_" + game);
}

if (DEMO) {
  if (typeof showModes === "function") {
    const orig = showModes;
    showModes = function () { const r = orig.apply(this, arguments); try { demoModes(modesGame, document.getElementById("modes")); } catch (e) { /* */ } return r; };
  }
  if (typeof showInshModes === "function") {
    const orig = showInshModes;
    showInshModes = function () { const r = orig.apply(this, arguments); try { demoModes("inshomovni", document.getElementById("insh-modes")); } catch (e) { /* */ } return r; };
  }
  if (typeof finishGroupTraining === "function") {
    const orig = finishGroupTraining;
    finishGroupTraining = function () {
      const t = training;
      const r = orig.apply(this, arguments);
      try {
        if (t && demoIsPro(t.game)) {
          const card = document.querySelector("#train-over .over-card");
          demoNudge(card, "demo_train_" + t.game, card.querySelector(".over-actions"));
          demoRepeatRemind(t);
        }
      } catch (e) { /* */ }
      return r;
    };
  }
  if (typeof showOnlineResults === "function") {
    const orig = showOnlineResults;
    showOnlineResults = function () {
      const r = orig.apply(this, arguments);
      try {
        const g = typeof gameKey === "function" ? gameKey() : "";
        const list = document.querySelector(".online-results");
        if (demoIsPro(g) && list) demoNudge(list.parentNode, "demo_online_" + g);
      } catch (e) { /* */ }
      return r;
    };
  }
  if (typeof startNmtTest === "function") {
    const orig = startNmtTest;
    startNmtTest = function () { try { track("demo_open", { game_type: "nmttest" }); } catch (e) { /* */ } return orig.apply(this, arguments); };
  }
  // тест НМТ у демо — 5 завдань: після п'ятого одразу підсумок (а не по колу)
  if (typeof showNmtTask === "function") {
    const orig = showNmtTask;
    showNmtTask = function () {
      if (typeof nmtHistory !== "undefined" && typeof nmtTestData !== "undefined" && nmtTestData.length && nmtHistory.length >= nmtTestData.length) return finishNmtTest();
      return orig.apply(this, arguments);
    };
  }
  if (typeof finishNmtTest === "function") {
    const orig = finishNmtTest;
    finishNmtTest = function () { const r = orig.apply(this, arguments); try { demoNudge(document.getElementById("nmt-result"), "demo_nmttest"); } catch (e) { /* */ } return r; };
  }
}

// 🔔 Групу вивчено (з'явилось «повтори за …») — у Telegram бот нагадає саме тоді (одне нагадування на групу, нове замінює старе)
function demoRepeatRemind(t) {
  const initData = typeof telegramInitData === "function" ? telegramInitData() : "";
  if (!initData || !t.memNext || !isFinite(t.memNext) || !LB || !LB.url) return;
  const go = t.game === "inshe" && typeof insheQuiz !== "undefined" && insheQuiz ? "inshe_" + insheQuiz.id : t.game;
  const g = GAMES.find(x => x.id === t.game);
  const game = t.game === "inshe" && insheQuiz ? `${insheQuiz.icon || "📂"} ${insheQuiz.name}` : g ? `${g.icon} ${g.name}` : "";
  const grp = t.groups.length === 1 ? t.groups[0].name : "";
  fetch(`${LB.url}/functions/v1/later-remind`, {
    method: "POST",
    headers: { apikey: LB.anonKey, Authorization: `Bearer ${LB.anonKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({ initData, player: getPlayerId(), when: "at", at: Date.now() + t.memNext * 864e5, kind: "repeat", go, game, grp })
  }).catch(() => {});
}

// 🔒 У тренуванні видно ВСІ групи (власниця: «покупець має бачити, як багато тут крутого»): відкрита — перша,
// решта — напівпрозорі з замочком і кількістю завдань; натиснув — вікно Спільноти. Перелік — demo/groups.js (DEMO_GROUPS).
if (DEMO && typeof renderTrainPicker === "function") {
  const orig = renderTrainPicker;
  renderTrainPicker = function (game, list) {
    const r = orig.apply(this, arguments);
    try { demoLockedGroups(game, list); } catch (e) { /* */ }
    return r;
  };
}
function demoLockedGroups(game, list) {
  if (!demoIsPro(game) || !list || typeof DEMO_GROUPS === "undefined") return;
  const all = game === "inshe" ? (typeof insheQuiz !== "undefined" && insheQuiz ? (DEMO_GROUPS.inshe || {})[insheQuiz.id] : null) : DEMO_GROUPS[game];
  if (!all || !all.length) return;
  const have = new Set(TRAIN_GAMES[game].groups().map(g => g.key));
  const locked = all.filter(g => !have.has(g.key));
  if (!locked.length) return;
  const grid = list.querySelector(".train-tiles");
  if (!grid) return;
  const unit = (typeof TRAIN_UNITS !== "undefined" && TRAIN_UNITS[game]) || ["завдання", "завдання", "завдань"];
  const total = locked.reduce((s, g) => s + g.n, 0);
  const head = document.createElement("div");
  head.className = "demo-lock-head";
  head.innerHTML = `🔒 Ще <b>${locked.length}</b> ${plural(locked.length, "група", "групи", "груп")} · <b>${total.toLocaleString("uk-UA")}</b> ${plural(total, ...unit)} — у Спільноті Укрмовича`;
  grid.appendChild(head);
  const mkCta = () => {
    const cta = document.createElement("button");
    cta.type = "button";
    cta.className = "btn-primary demo-lock-cta";
    cta.textContent = UPSELL_CTA;
    cta.onclick = () => upsellGo("demo_groups_" + game);
    return cta;
  };
  if (typeof UPSELL_CTA !== "undefined") grid.appendChild(mkCta()); // одразу під підсумком — видно без прокручування
  const gameObj = GAMES.find(g => g.id === (game === "inshe" && insheQuiz && insheQuiz.id.startsWith("ist_") ? "istoriia" : game));
  locked.forEach(g => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "group-tile train-tile demo-locked";
    btn.innerHTML = `<span class="group-label"></span><span class="group-info"></span>`;
    btn.querySelector(".group-label").textContent = `🔒 ${g.name}`;
    btn.querySelector(".group-info").textContent = `${g.n} ${plural(g.n, ...unit)}`;
    btn.onclick = () => { if (typeof showPro === "function" && gameObj) showPro(gameObj); };
    grid.appendChild(btn);
  });
  if (typeof UPSELL_CTA !== "undefined" && locked.length > 4) grid.appendChild(mkCta()); // і внизу довгого переліку
}

// 📖 «Повний перелік» у демо: наприкінці — скільки ще слів і груп у Спільноті + кнопка
function demoWordlistNudge(game, list, groups) {
  if (!demoIsPro(game) || typeof DEMO_GROUPS === "undefined" || !DEMO_GROUPS[game] || typeof UPSELL_CTA === "undefined") return;
  const have = new Set(groups.map(g => g.key));
  const locked = DEMO_GROUPS[game].filter(g => !have.has(g.key) && !g.name.startsWith("💥"));
  if (!locked.length) return;
  const n = locked.reduce((a, g) => a + g.n, 0);
  const what = { frazeolohizmy: ["речення", "речення", "речень"], inshomovni: ["слово", "слова", "слів"], klychnyi: ["слово", "слова", "слів"] }[game] || ["завдання", "завдання", "завдань"];
  const box = document.createElement("div");
  box.className = "demo-nudge";
  box.innerHTML = `<p>Це перелік лише першої групи. Ще <b>${locked.length}</b> ${plural(locked.length, "група", "групи", "груп")} (<b>${n.toLocaleString("uk-UA")}</b> ${plural(n, ...what)}) — у Спільноті Укрмовича: відкрий і вчи все 🦆</p><button type="button" class="btn-primary demo-nudge-btn"></button>`;
  box.querySelector("button").textContent = UPSELL_CTA;
  box.querySelector("button").onclick = () => upsellGo("demo_wordlist_" + game);
  list.appendChild(box);
  if (typeof upsellView === "function") upsellView("demo_wordlist_" + game);
}

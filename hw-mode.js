// 🏠 Домашнє завдання з платформи (testtest update-121/122): група відкривається з кабінету платформи
// (вбудоване вікно …/gym/?embed=<гра>&grp=<ключ> або Telegram-посилання startapp=c…, go.js).
// Власниця, 07.11.2026: 1) спершу — перелік слів цієї групи, учень читає й лише тоді натискає «▶ Тренуватися»;
// 2) після тренування — чітко: «✅ ДЗ виконано» («Наголоси» — без помилок, інші — до 1 помилки) або «❌ ДЗ ще НЕ виконано» (скільки є,
// скільки треба, «🔁 Пройти ще раз»), щоб не лишалося «я думав, досить одного разу». Відсоток — як на платформі:
// правильні з першого разу / розмір групи («робота над помилками» не рахується).
// Контекст ДЗ — window.GYM_HW {game, key}, у sessionStorage gym_hw (переживає перезавантаження вкладки).

let GYM_HW = null;
try { GYM_HW = JSON.parse(sessionStorage.getItem("gym_hw") || "null"); } catch (e) { GYM_HW = null; }

const HW_TITLES = { naholosy: "🗣️ Наголоси", inshomovni: "🌍 Іншомовні слова", frazeolohizmy: "💬 Фразеологізми",
  slovospoluch: "🧩 Лексична помилка: словосполучення", leksychna: "🔎 Лексична помилка: речення" };

screens.gymhw = (() => {
  const main = document.createElement("main");
  main.id = "gymhw-screen";
  main.className = "screen";
  main.hidden = true;
  main.innerHTML = `
    <header class="top-bar">
      <h2 id="ghw-title" class="screen-title">🏠 Домашнє завдання</h2>
    </header>
    <div class="ghw-box">
      <p id="ghw-lead" class="ghw-lead"></p>
      <button type="button" id="ghw-go" class="btn-primary ghw-go">▶ Тренуватися</button>
      <div id="ghw-list" class="wl-list"></div>
      <button type="button" id="ghw-go2" class="btn-primary ghw-go">▶ Я прочитав — тренуватися</button>
    </div>`;
  $("menu").after(main);
  const go = () => { if (GYM_HW) startGroupTraining(GYM_HW.game, [GYM_HW.key]); };
  main.querySelector("#ghw-go").addEventListener("click", go);
  main.querySelector("#ghw-go2").addEventListener("click", go);
  return main;
})();

function gymHwGroup(game, key) {
  const cfg = typeof TRAIN_GAMES !== "undefined" && TRAIN_GAMES[game];
  try { return cfg ? cfg.groups().find(g => g.key === key) || null : null; } catch (e) { return null; }
}

// перелік слів групи (той самий вигляд, що «📖 Повний перелік»); для «речень» — слова відповідної групи словосполучень
function gymHwRows(game, g) {
  if (typeof wlRows !== "function") return [];
  if (game === "leksychna") {
    const sg = typeof TRAIN_GAMES !== "undefined" && TRAIN_GAMES.slovospoluch
      ? TRAIN_GAMES.slovospoluch.groups().find(x => x.name === g.name) : null;
    return sg ? wlRows("slovospoluch", sg) : [];
  }
  try { return wlRows(game, g); } catch (e) { return []; }
}

// відкрити ДЗ: перелік → «Тренуватися»
function gymHwOpen(game, key) {
  const g = gymHwGroup(game, key);
  if (!g) return false;
  GYM_HW = { game, key, name: g.name };
  try { sessionStorage.setItem("gym_hw", JSON.stringify(GYM_HW)); } catch (e) { /* */ }
  const rows = gymHwRows(game, g);
  $("ghw-title").textContent = `🏠 ДЗ: ${HW_TITLES[game] || ""}`;
  // власниця, 08.11.2026: не суцільний текст, а кроки; ціль — у штуках, не у відсотках
  const n = g.items.length, need = gymHwNeed(n);
  const unit = (typeof TRAIN_UNITS !== "undefined" && TRAIN_UNITS[game]) || ["завдання", "завдання", "завдань"];
  $("ghw-lead").innerHTML = `<div class="ghw-head"><b>«${wlEsc(g.name)}»</b><span>${n} ${plural(n, ...unit)}</span></div>
    <ol class="ghw-steps">
      ${rows.length ? "<li><span>📖</span><span>Прочитай перелік — можна вголос</span></li>" : ""}
      <li><span>▶️</span><span>Пройди тренування</span></li>
      <li><span>🎯</span><span>Зараховано, якщо з першого разу правильно ${need === n ? `<b>усі ${n}</b>` : `<b>${need} з ${n}</b>`}</span></li>
    </ol>
    <p class="ghw-note">Спроб — скільки завгодно.</p>`;
  $("ghw-list").innerHTML = rows.length
    ? `<details class="wl-group" open><summary><span class="wl-gname">${wlEsc(g.name)}</span><span class="wl-count">${rows.length}</span></summary>
       <ul>${rows.map(r => `<li${r.row ? ' class="wl-li-row"' : ""}>${r.html}</li>`).join("")}</ul></details>` : "";
  $("ghw-go2").hidden = !rows.length;
  showScreen("gymhw");
  return true;
}

// скільки правильних з першого разу треба для зарахування (як на платформі, update-130):
// «Наголоси» — без жодної помилки, інші тренажери — можна 1 помилку (власниця, 07.11.2026)
function gymHwNeed(n, game) { n = +n || 0; return n <= 0 ? 1 : (game || (GYM_HW && GYM_HW.game)) === "naholosy" ? n : Math.max(1, n - 1); }

// підсумок тренування: «ДЗ виконано / не виконано»
(function () {
  if (typeof finishGroupTraining !== "function") return;
  const sub = document.getElementById("train-sub");
  if (!sub) return;
  const box = document.createElement("div");
  box.id = "train-hw";
  box.className = "train-hw";
  box.hidden = true;
  sub.after(box);
  const orig = finishGroupTraining;
  finishGroupTraining = function () {
    const t = training;
    const ag = document.getElementById("btn-train-again");
    if (ag) ag.hidden = false; // ДЗ ховає її — щоразу повертаємо
    const r = orig.apply(this, arguments);
    try {
      box.hidden = true;
      if (!GYM_HW || !t || t.game !== GYM_HW.game || !t.groups.some(g => g.key === GYM_HW.key)) return r;
      const g = t.groups.find(x => x.key === GYM_HW.key);
      if (t.round === 1) {
        const ok = g.items.filter(x => t.results.get(x) === true).length;
        GYM_HW.last = ok / g.items.length;
        GYM_HW.lastOk = ok;
        GYM_HW.size = g.items.length;
        if (ok >= gymHwNeed(g.items.length, GYM_HW.game)) GYM_HW.done = true;
        try { sessionStorage.setItem("gym_hw", JSON.stringify(GYM_HW)); } catch (e) { /* */ }
      }
      if (GYM_HW.last == null) return r;
      const need = gymHwNeed(GYM_HW.size, GYM_HW.game), got = GYM_HW.lastOk;
      box.hidden = false;
      // власниця, 08.11.2026: у ДЗ — одна ціль (у штуках), без «80 %» пам'яті й без зайвих кнопок
      const hide = (id, h) => { const el = document.getElementById(id); if (el) el.hidden = h || el.hidden; };
      const mem = document.getElementById("train-mem");
      if (GYM_HW.done) {
        box.className = "train-hw ok";
        box.innerHTML = `<b>✅ ДЗ зараховано!</b><span>${got >= need ? `<b>${got} з ${GYM_HW.size}</b> з першого разу. ` : ""}Так тримати! 💪</span>`;
        if (mem) mem.querySelectorAll(".mem-note-small, .mem-later").forEach(x => x.remove()); // лишаємо лише «⏰ Повтори …»
      } else {
        box.className = "train-hw bad";
        const left = Math.max(0, need - got);
        box.innerHTML = `<b>❌ ДЗ ще не зараховано</b>
          <div class="hw-stats"><span><small>У тебе</small><b>${got}</b></span><span><small>Треба</small><b>${need}</b></span></div>
          <span>Ще <b>${left}</b> ${plural(left, "правильна", "правильні", "правильних")} — і зараховано!${t.round > 1 ? "<br><small>Робота над помилками не зараховується — пройди групу заново.</small>" : ""}</span>`;
        const again = document.createElement("button");
        again.type = "button";
        again.className = "btn-primary";
        again.textContent = "🔁 Пройти групу ще раз";
        again.addEventListener("click", () => gymHwOpen(GYM_HW.game, GYM_HW.key));
        box.append(again);
        if (mem) mem.hidden = true; // «ціль 80 %» тут лише плутає
        hide("btn-train-again", true);
        hide("btn-train-next", true);
        const fix = document.getElementById("btn-fix-mistakes");
        if (fix) fix.className = "btn-secondary";
      }
    } catch (e) { /* не ламаємо гру */ }
    return r;
  };
})();

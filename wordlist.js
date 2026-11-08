// 📖 Повний список для навчання (власниця, 05.11.2026): «Наголоси», «Фразеологізми», «Іншомовні слова» — не тренування,
// а просто переглянути й повчити все: за тими самими групами, що й у тренуванні (TRAIN_GAMES у groups.js), з пошуком.
// Кнопка «📖 Повний список — просто повчити» — на екрані режимів (showModes) і на екрані «Іншомовних слів» (showInshModes);
// у кожній групі — «🎯 Потренувати цю групу» (startGroupTraining). Позначка ✓ — група вже вивчена (є `<ключ>_mem`).
const WL_GAMES = {
  naholosy: { title: "🗣️ Наголоси", what: ["слово", "слова", "слів"] },
  frazeolohizmy: { title: "💬 Фразеологізми", what: ["фразеологізм", "фразеологізми", "фразеологізмів"] },
  inshomovni: { title: "🌍 Іншомовні слова", what: ["слово", "слова", "слів"] },
  slovospoluch: { title: "🧩 Лексичні помилки", what: ["помилка", "помилки", "помилок"] } // «Лексична помилка: словосполучення»
};
let wlGame = "naholosy";
const wlEsc = s => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

screens.wordlist = (() => {
  const main = document.createElement("main");
  main.id = "wordlist-screen";
  main.className = "screen";
  main.hidden = true;
  main.innerHTML = `
    <header class="top-bar">
      <button id="btn-wl-back" class="icon-btn" aria-label="Назад">‹ Назад</button>
      <h2 id="wl-title" class="screen-title">📖 Список</h2>
    </header>
    <input id="wl-search" class="wl-search" type="search" placeholder="Пошук у списку" autocomplete="off">
    <p id="wl-sub" class="wl-sub"></p>
    <div id="wl-list" class="wl-list"></div>`;
  $("menu").after(main);
  main.querySelector("#btn-wl-back").addEventListener("click", () => {
    if (wlGame === "inshomovni" && typeof showInshModes === "function") showInshModes(); else showModes(wlGame);
  });
  main.querySelector("#wl-search").addEventListener("input", e => wlFilter(e.target.value));
  return main;
})();

// наголос — велика буква: «асиметрІя» → асиметр<b>і</b>я
function wlStress(word) {
  return wlEsc(word).replace(/[А-ЯҐЄІЇ]/g, ch => `<b class="wl-acc">${ch.toLowerCase()}</b>`);
}

function wlRows(game, group) {
  if (game === "naholosy") {
    return group.items.map(q => {
      const ok = String(q.correct).split(/\s*,\s*/);
      q = { ...q, correct: ok.join(", ") };
      return { text: q.correct, html: `<span class="wl-main">${wlStress(q.correct)}</span>` };
    });
  }
  if (game === "slovospoluch") {
    // у групі — картки (неправильна й правильна з кожного рядка): показуємо кожну помилку раз: ✗ → ✓ і чому
    const seen = new Set();
    return group.items.filter(c => !c.ok && !seen.has(c.wrong) && seen.add(c.wrong)).map(c => ({
      text: `${c.wrong} ${c.right}`,
      html: `<span class="wl-main"><s class="wl-wrong">${wlEsc(c.wrong)}</s> → <span class="wl-or">${wlEsc(c.right)}</span></span>${c.rule ? `<span class="wl-mean">${wlEsc(c.rule)}</span>` : ""}`
    }));
  }
  if (game === "inshomovni") {
    return group.items.map(r => {
      const exam = typeof INSH_EXAM !== "undefined" && INSH_EXAM.has(r[0]);
      const note = typeof inshomovniNotes !== "undefined" && inshomovniNotes[r[0]]; // [смайлик, асоціація]
      return { text: `${r[0]} ${r[2]}`, row: true, html: `<span class="wl-emo">${note ? wlEsc(note[0]) : "🌍"}</span><span class="wl-txt"><span class="wl-main wl-or">${wlEsc(r[0])}${exam ? ' <span class="wl-exam">💥 НМТ</span>' : ""}</span><span class="wl-mean">${wlEsc(r[2])}</span>${note && note[1] ? `<span class="wl-ex">${wlEsc(note[1])}</span>` : ""}</span>` };
    });
  }
  // фразеологізми: у групі — речення; показуємо кожен фразеологізм один раз зі значенням і прикладом
  const seen = new Map();
  group.items.forEach(row => {
    const ph = typeof FRAZEO_BY_ID !== "undefined" && FRAZEO_BY_ID[row[0]];
    if (!ph || seen.has(ph.id)) return;
    seen.set(ph.id, { ph, ex: row[1] });
  });
  return [...seen.values()].map(({ ph, ex }) => ({
    text: `${ph.p} ${ph.m || ""}`,
    html: `<span class="wl-main wl-or">${wlEsc(ph.p)}${ph.nmt ? ' <span class="wl-exam">💥 НМТ</span>' : ""}</span>${ph.m ? `<span class="wl-mean">${wlEsc(ph.m)}</span>` : ""}${ex ? `<span class="wl-ex">${wlEsc(ex).replace(/_{3,}/, `<i>${wlEsc(ph.p)}</i>`)}</span>` : ""}`
  }));
}

function showWordList(game) {
  wlGame = game;
  const cfg = typeof TRAIN_GAMES !== "undefined" && TRAIN_GAMES[game];
  const all = cfg ? cfg.groups().filter(g => !g.topic) : [];
  let groups = all.filter(g => game === "slovospoluch" || !String(g.name).startsWith("💥")); // у словосполученнях «💥» — окремі помилки, не дублі
  if (!groups.length) groups = all; // демо: відкрита лише «💥»-група — показуємо її
  $("wl-title").textContent = `📖 ${WL_GAMES[game].title}`;
  $("wl-search").value = "";
  const list = $("wl-list");
  let total = 0;
  list.innerHTML = groups.map((g, i) => {
    const rows = wlRows(game, g);
    total += rows.length;
    const done = storageGet(`${g.key}_mem`) != null;
    return `<details class="wl-group"${i === 0 ? " open" : ""} data-key="${wlEsc(g.key)}">
      <summary><span class="wl-gname">${done ? "✓ " : ""}${wlEsc(g.name)}</span><span class="wl-count">${rows.length}</span></summary>
      <ul>${rows.map(r => `<li${r.row ? ' class="wl-li-row"' : ""} data-q="${wlEsc(r.text.toLowerCase())}">${r.html}</li>`).join("")}</ul>
      <button type="button" class="wl-train" data-train="${i}">🎯 Потренувати цю групу</button>
    </details>`;
  }).join("") || '<p class="wl-sub">Список поки недоступний.</p>';
  $("wl-sub").textContent = `${total} ${plural(total, ...WL_GAMES[game].what)} · ${groups.length} ${plural(groups.length, "група", "групи", "груп")}. Читай уважно, промовляй уголос — а потім потренуйся.`;
  list.querySelectorAll("[data-train]").forEach(b => b.addEventListener("click", () => startGroupTraining(game, [groups[Number(b.dataset.train)].key])));
  if (typeof demoWordlistNudge === "function") demoWordlistNudge(game, list, groups); // 🎁 демо: «ще N слів — у Спільноті»
  showScreen("wordlist");
}

function wlFilter(q) {
  q = q.trim().toLowerCase().replace(/[ʼ’`]/g, "'");
  $("wl-list").querySelectorAll(".wl-group").forEach(g => {
    let any = false;
    g.querySelectorAll("li").forEach(li => { const ok = !q || li.dataset.q.replace(/[ʼ’`]/g, "'").includes(q); li.hidden = !ok; if (ok) any = true; });
    g.hidden = !any;
    if (q) g.open = any;
  });
}

// кнопки на екранах режимів
(function () {
  const mk = () => {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "btn-secondary wl-open";
    b.textContent = "📖 Повний перелік";
    return b;
  };
  // під групами тренування (власниця, 07.11.2026), а не вгорі
  const gp = document.getElementById("groups-panel");
  if (gp) {
    const b = mk();
    b.id = "btn-wl-modes";
    b.addEventListener("click", () => showWordList(modesGame));
    gp.after(b);
  }
  const insh = document.getElementById("insh-group-list");
  if (insh) {
    const b = mk();
    b.addEventListener("click", () => showWordList("inshomovni"));
    insh.closest("section").after(b);
  }
  // і на підсумку тренування — «почитати весь список»
  const acts = document.querySelector("#train-over .over-actions");
  if (acts) {
    const b = mk();
    b.id = "btn-wl-train";
    b.classList.add("over-small"); // парою з «До груп» (власниця, 08.11.2026: менше великих кнопок)
    b.hidden = true;
    b.addEventListener("click", () => showWordList(b.dataset.game));
    acts.appendChild(b);
  }
  if (typeof finishGroupTraining === "function") {
    const origF = finishGroupTraining;
    finishGroupTraining = function () {
      const g = training && training.game;
      const r = origF.apply(this, arguments);
      const b = $("btn-wl-train");
      if (b) { b.hidden = !WL_GAMES[g]; b.dataset.game = g || ""; }
      return r;
    };
  }
  const orig = showModes;
  showModes = function (game) {
    const r = orig.apply(this, arguments);
    const btn = $("btn-wl-modes");
    if (btn) btn.hidden = !["naholosy", "frazeolohizmy", "slovospoluch"].includes(modesGame);
    return r;
  };
})();

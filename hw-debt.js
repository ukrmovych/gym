// 🔋 «Спершу врятуй забуте» — лише для учнів курсу (COURSE) у домашці з платформи (власниця, 08.11.2026, тестуємо на її учнях).
// Перш ніж тренувати задану групу (екран ДЗ hw-mode.js), гра дивиться на всі вже вивчені групи 5 ігор ДЗ
// (наголоси, іншомовні, фразеологізми, обидві лексичні), ЗАДАНІ ЯК ДЗ (позначка `<ключ>_hw`, ставиться при відкритті ДЗ): батарейка (прогноз пам'яті memRecall) нижче 60 % — «борг».
//   • боргів < 10 — врятувати всі (кожну пройти на 80 %+);
//   • боргів ≥ 10 — 30 % боргів (вгору) + ті, що впадуть нижче 60 % до завтра; спершу — ті, що ближчі до 60 % (їх ще легко врятувати).
// Перелік на день фіксується (localStorage `hw_debt` {day, keys, done}) — щоб не ріс, поки учень працює; завтра — перерахунок.
// Врятовано = тренування цієї групи завершено з результатом ≥ 80 % (правильні з першого разу / розмір групи).
const DEBT_R = 0.6, DEBT_BIG = 10, DEBT_OK = 0.8;
const DEBT_GAMES = ["naholosy", "inshomovni", "frazeolohizmy", "slovospoluch", "leksychna"];
const debtDay = () => new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Kyiv", year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date(memNow()));

function debtAll(skipKey) {
  const out = [];
  DEBT_GAMES.forEach(game => {
    const cfg = typeof TRAIN_GAMES !== "undefined" && TRAIN_GAMES[game];
    if (!cfg) return;
    let gs = [];
    try { gs = cfg.groups().filter(g => !g.topic); } catch (e) { gs = []; }
    gs.forEach(g => {
      if (g.key === skipKey) return;
      if (!storageGet(`${g.key}_hw`)) return; // лише групи, які задавала вчителька (власниця: додаткове — на розсуд учня)
      const m = memRead(g.key);
      if (!m) return;
      out.push({ game, key: g.key, name: g.name, r: memRecall(m), r1: memRecall(m, memNow() + MEM_DAY) });
    });
  });
  return out;
}

// перелік на сьогодні (фіксований)
function debtToday(skipKey) {
  let st = null;
  try { st = JSON.parse(localStorage.getItem("hw_debt") || "null"); } catch (e) { st = null; }
  const all = debtAll(skipKey);
  const byKey = new Map(all.map(x => [x.key, x]));
  if (!st || st.day !== debtDay()) {
    const low = all.filter(x => x.r < DEBT_R).sort((a, b) => b.r - a.r);
    let keys;
    if (low.length < DEBT_BIG) keys = low.map(x => x.key);
    else {
      const soon = all.filter(x => x.r >= DEBT_R && x.r1 < DEBT_R).map(x => x.key);
      keys = [...low.slice(0, Math.ceil(0.3 * low.length)).map(x => x.key), ...soon];
    }
    st = { day: debtDay(), keys, done: [], low: low.length };
    try { localStorage.setItem("hw_debt", JSON.stringify(st)); } catch (e) { /* */ }
  }
  const items = st.keys.filter(k => byKey.has(k)).map(k => ({ ...byKey.get(k), done: st.done.includes(k) }));
  return { st, items, left: items.filter(x => !x.done) };
}

function debtMarkDone(key) {
  try {
    const st = JSON.parse(localStorage.getItem("hw_debt") || "null");
    if (!st || st.day !== debtDay() || !st.keys.includes(key) || st.done.includes(key)) return false;
    st.done.push(key);
    localStorage.setItem("hw_debt", JSON.stringify(st));
    return true;
  } catch (e) { return false; }
}

const debtOn = () => typeof COURSE !== "undefined" && COURSE && typeof memRead === "function";

// екран ДЗ: якщо є борги — спершу вони, кнопки «Тренуватися» заблоковано
if (typeof gymHwOpen === "function") {
  const origOpen = gymHwOpen;
  gymHwOpen = function (game, key) {
    const r = origOpen.apply(this, arguments);
    // позначка «задано як ДЗ» (число — час; course-sync переносить її на інші пристрої учня)
    try { if (r && !storageGet(`${key}_hw`)) storageSet(`${key}_hw`, String(Date.now())); } catch (e) { /* */ }
    try { if (r && debtOn()) debtPaint(game, key); } catch (e) { console.warn("hw-debt", e); }
    return r;
  };
}

function debtPaint(game, key) {
  const box = document.querySelector("#gymhw-screen .ghw-box");
  if (!box) return;
  let el = document.getElementById("ghw-debt");
  const { items, left } = debtToday(key);
  const goBtns = [document.getElementById("ghw-go"), document.getElementById("ghw-go2")];
  if (!items.length || !left.length) {
    if (el) el.remove();
    goBtns.forEach(b => { if (b) { b.disabled = false; b.classList.remove("ghw-locked"); } });
    if (items.length && !left.length) { // усе врятовано сьогодні — коротка похвала
      el = document.createElement("div");
      el.id = "ghw-debt";
      el.className = "ghw-debt ok";
      el.innerHTML = `<b>🔋 Забуте врятовано!</b><span>Тепер — твоє ДЗ 👇</span>`;
      box.prepend(el);
    }
    return;
  }
  if (!el) { el = document.createElement("div"); el.id = "ghw-debt"; box.prepend(el); }
  el.className = "ghw-debt";
  const n = left.length;
  el.innerHTML = `<b>🔋 Спершу врятуй забуте</b>
    <span>Ці групи вже згасають. Пройди кожну на <b>80 % правильно</b> — і відкриється ДЗ.</span>
    <span class="ghw-debt-count">Лишилося: <b>${n}</b> з ${items.length}</span>
    <div class="ghw-debt-list"></div>`;
  const list = el.querySelector(".ghw-debt-list");
  items.forEach(x => {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "ghw-debt-it" + (x.done ? " done" : "");
    b.innerHTML = `<span class="ghw-debt-g"></span><span class="ghw-debt-n"></span><small></small>`;
    b.querySelector(".ghw-debt-g").textContent = (HW_TITLES[x.game] || "").split(" ")[0];
    b.querySelector(".ghw-debt-n").textContent = x.name;
    b.querySelector("small").textContent = x.done ? "✅ врятовано" : `🔋 ${Math.round(x.r * 100)} % ›`;
    if (!x.done) b.onclick = () => { DEBT_RET = { game, key }; startGroupTraining(x.game, [x.key]); };
    else b.disabled = true;
    list.appendChild(b);
  });
  goBtns.forEach(b => { if (b) { b.disabled = true; b.classList.add("ghw-locked"); } });
  const g = document.getElementById("ghw-go");
  if (g) g.textContent = `🔒 ДЗ — після ${n} ${plural(n, "групи", "груп", "груп")} 🔋`;
}
let DEBT_RET = null;
// повернути звичайний текст кнопки, коли борги закрито
if (typeof gymHwOpen === "function") {
  const o2 = gymHwOpen;
  gymHwOpen = function () {
    const g = document.getElementById("ghw-go");
    if (g) g.textContent = "▶ Тренуватися";
    return o2.apply(this, arguments);
  };
}

// підсумок тренування групи-боргу: врятовано чи ні + «‹ До ДЗ»
(function () {
  if (typeof finishGroupTraining !== "function") return;
  const orig = finishGroupTraining;
  finishGroupTraining = function () {
    const t = training;
    const r = orig.apply(this, arguments);
    try {
      let box = document.getElementById("train-debt");
      if (box) box.hidden = true;
      if (!debtOn() || !DEBT_RET || !t || !GYM_HW) return r;
      const st = debtToday(GYM_HW.key);
      const g = t.groups.find(x => st.items.some(i => i.key === x.key));
      if (!g) return r;
      if (t.round === 1) {
        const ok = g.items.filter(x => t.results.get(x) === true).length;
        if (ok / g.items.length >= DEBT_OK) debtMarkDone(g.key);
      }
      const now = debtToday(GYM_HW.key);
      const saved = now.items.find(i => i.key === g.key);
      if (!box) {
        box = document.createElement("div");
        box.id = "train-debt";
        const sub = document.getElementById("train-sub");
        if (sub) sub.after(box); else return r;
      }
      box.hidden = false;
      box.className = "train-hw " + (saved && saved.done ? "ok" : "bad");
      const need = Math.ceil(g.items.length * DEBT_OK);
      box.innerHTML = saved && saved.done
        ? `<b>🔋 Врятовано!</b><span>${now.left.length ? `Ще ${now.left.length} — і відкриється ДЗ.` : "Усе забуте врятовано — тепер ДЗ!"}</span>`
        : `<b>🔋 Ще не врятовано</b><span>Треба з першого разу правильно <b>${need} з ${g.items.length}</b>. Спробуй ще раз 💪</span>`;
      const back = document.createElement("button");
      back.type = "button";
      back.className = "btn-primary";
      back.textContent = now.left.length ? "‹ До переліку забутого" : "▶ До ДЗ";
      back.onclick = () => { const ret = DEBT_RET; DEBT_RET = null; if (ret) gymHwOpen(ret.game, ret.key); };
      box.append(back);
      const nx = document.getElementById("btn-train-next"); if (nx) nx.hidden = true; // не відволікати від ДЗ
    } catch (e) { console.warn("hw-debt", e); }
    return r;
  };
})();

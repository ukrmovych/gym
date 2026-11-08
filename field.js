// 🟦 «Поле слів» (власниця, 09.11.2026): для «Наголосів» і «Лексичної помилки: словосполучення».
// Учитель (чи учень) обирає групи тренування, що натискати (ПРАВИЛЬНІ чи НЕПРАВИЛЬНІ) і як перевіряти:
//   • «Наприкінці» — весь екран усіяний кнопками-словами, клас біля дошки позначає, тоді «✔ Перевірити»:
//     ✅ знайдено, ✗ натиснуто зайве, ◌ пропущено + «🔁 Робота над помилками» (поле лише з помилок);
//   • «Одразу» — після кожного натискання видно, чи доречно натиснули.
// Половина карток показується правильно, половина — з помилкою (наголоси — неправильний наголос,
// словосполучення — неправильний варіант з тієї ж пари). Налаштування — localStorage `field_cfg`.

const FIELD_GAMES = { naholosy: "наголоси", slovospoluch: "словосполучення" };
const FIELD = { game: null, keys: [], target: "right", check: "end", count: 40, items: [], done: false };
try { Object.assign(FIELD, JSON.parse(localStorage.getItem("field_cfg") || "{}"), { items: [], done: false }); } catch (e) { /* */ }
const fEsc = t => String(t).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const fieldSave = () => { try { localStorage.setItem("field_cfg", JSON.stringify({ target: FIELD.target, check: FIELD.check, count: FIELD.count })); } catch (e) { /* */ } };

// панель на екрані режимів
(function () {
  const panel = document.createElement("section");
  panel.id = "field-panel";
  panel.className = "mode-panel";
  panel.hidden = true;
  panel.innerHTML = `
    <div class="mode-head">
      <span class="mode-num">🟦</span>
      <span class="mode-head-text">
        <span class="mode-title">Поле слів</span>
        <span class="mode-desc">Увесь екран — кнопки. Натисни всі правильні (чи неправильні) — і перевір. Для класу біля дошки</span>
      </span>
    </div>
    <button type="button" id="btn-field" class="btn-primary mode-start">🟦 Налаштувати поле</button>`;
  const gp = $("groups-panel");
  if (gp) gp.after(panel);
  panel.querySelector("#btn-field").addEventListener("click", () => fieldSetup(modesGame));
  const orig = showModes;
  showModes = function (game) {
    const r = orig.apply(this, arguments);
    panel.hidden = !FIELD_GAMES[modesGame] || (typeof DEMO !== "undefined" && DEMO && modesGame !== "naholosy" && modesGame !== "slovospoluch");
    return r;
  };
})();

screens.field = (() => {
  const main = document.createElement("main");
  main.id = "field-screen";
  main.className = "screen field-screen";
  main.hidden = true;
  $("menu").after(main);
  return main;
})();

function fieldGroups(game) {
  try { return TRAIN_GAMES[game].groups().filter(g => g.items && g.items.length); } catch (e) { return []; }
}

// ---------- налаштування ----------
function fieldSetup(game) {
  FIELD.game = game;
  const groups = fieldGroups(game);
  if (!FIELD.keys.length || !FIELD.keys.every(k => groups.some(g => g.key === k))) FIELD.keys = groups.length ? [groups[0].key] : [];
  const el = screens.field;
  const chip = (attr, val, cur, text) => `<button type="button" class="topic-chip${val === cur ? " on" : ""}" data-${attr}="${val}">${text}</button>`;
  const unit = game === "naholosy" ? "слів" : "помилок";
  el.innerHTML = `
    <header class="top-bar">
      <button type="button" class="icon-btn" id="fld-back">‹ Назад</button>
      <h2 class="screen-title">🟦 Поле слів</h2>
    </header>
    <div class="fld-setup">
      <div class="fld-step"><b>1. Які групи</b><span class="fld-hint">можна кілька</span>
        <div class="fld-chips" id="fld-groups">${groups.map(g => `<button type="button" class="topic-chip${FIELD.keys.includes(g.key) ? " on" : ""}" data-key="${fEsc(g.key)}">${fEsc(g.name)}</button>`).join("")}</div>
        <button type="button" class="link-btn" id="fld-all">☑ Усі групи</button>
      </div>
      <div class="fld-step"><b>2. Що натискати</b>
        <div class="fld-chips">${chip("target", "right", FIELD.target, "✅ Правильні")}${chip("target", "wrong", FIELD.target, "❌ З помилкою")}</div>
      </div>
      <div class="fld-step"><b>3. Коли видно, чи правильно</b>
        <div class="fld-chips">${chip("check", "end", FIELD.check, "🧐 Наприкінці — «Перевірити»")}${chip("check", "now", FIELD.check, "⚡ Одразу")}</div>
      </div>
      <div class="fld-step"><b>4. Скільки кнопок на полі</b>
        <div class="fld-chips">${[20, 40, 60, 0].map(n => chip("count", String(n), String(FIELD.count), n ? String(n) : "Усі")).join("")}</div>
      </div>
      <p class="fld-sum" id="fld-sum"></p>
      <button type="button" class="btn-primary fld-go" id="fld-go">▶ Показати поле</button>
    </div>`;
  const sum = () => {
    const n = fieldPool().length;
    el.querySelector("#fld-sum").textContent = n ? `На полі: ${FIELD.count ? Math.min(FIELD.count, n) : n} з ${n} ${unit}` : "Обери хоча б одну групу";
    el.querySelector("#fld-go").disabled = !n;
  };
  el.querySelector("#fld-back").onclick = () => showModes(game);
  el.querySelectorAll("#fld-groups [data-key]").forEach(b => b.onclick = () => {
    const k = b.dataset.key;
    FIELD.keys = FIELD.keys.includes(k) ? FIELD.keys.filter(x => x !== k) : [...FIELD.keys, k];
    b.classList.toggle("on", FIELD.keys.includes(k)); sum();
  });
  el.querySelector("#fld-all").onclick = () => {
    const all = FIELD.keys.length === groups.length;
    FIELD.keys = all ? [] : groups.map(g => g.key);
    el.querySelectorAll("#fld-groups [data-key]").forEach(b => b.classList.toggle("on", !all)); sum();
  };
  ["target", "check", "count"].forEach(a => el.querySelectorAll(`[data-${a}]`).forEach(b => b.onclick = () => {
    FIELD[a] = a === "count" ? Number(b.dataset[a]) : b.dataset[a];
    el.querySelectorAll(`[data-${a}]`).forEach(x => x.classList.toggle("on", x === b)); fieldSave(); sum();
  }));
  el.querySelector("#fld-go").onclick = () => fieldStart();
  sum();
  showScreen("field");
}

// усі «одиниці» вибраних груп: наголоси — слово, словосполучення — пара (помилка + виправлення)
function fieldPool() {
  const gs = fieldGroups(FIELD.game).filter(g => FIELD.keys.includes(g.key));
  const seen = new Set(), out = [];
  gs.forEach(g => g.items.forEach(it => {
    const id = FIELD.game === "naholosy" ? String(it.correct) : it.wrong;
    if (!id || seen.has(id)) return;
    seen.add(id); out.push(it);
  }));
  return out;
}

function fieldCard(it, ok) {
  if (FIELD.game === "naholosy") {
    // буває кілька правильних наголосів (алфАвіт / алфавІт) — correct тоді масив
    const rights = Array.isArray(it.correct) ? it.correct : [it.correct];
    const wrongs = it.words.filter(w => !rights.includes(w));
    const pick = a => a[Math.floor(Math.random() * a.length)];
    const show = ok || !wrongs.length ? pick(rights) : pick(wrongs);
    return { src: it, ok: rights.includes(show), show, right: rights };
  }
  return { src: it, ok, show: ok ? it.right : it.wrong, right: it.right, rule: it.rule };
}

function fieldStart(src) {
  let pool = src || fieldPool();
  if (!src) { shuffleArray(pool); if (FIELD.count) pool = pool.slice(0, FIELD.count); }
  // рівно половина — правильні (якщо це робота над помилками — ті самі картки)
  const idx = pool.map((_, i) => i); shuffleArray(idx);
  const half = new Set(idx.slice(0, Math.round(pool.length / 2)));
  FIELD.items = src ? src.map(c => ({ ...c, sel: false, state: "" })) : pool.map((it, i) => ({ ...fieldCard(it, half.has(i)), sel: false, state: "" }));
  if (!src) shuffleArray(FIELD.items);
  FIELD.done = false;
  fieldDraw();
}

const fieldIsTarget = c => FIELD.target === "right" ? c.ok : !c.ok;

function fieldDraw() {
  const el = screens.field;
  const n = FIELD.items.length;
  const what = FIELD.game === "naholosy"
    ? (FIELD.target === "right" ? "слова з ПРАВИЛЬНИМ наголосом" : "слова з НЕПРАВИЛЬНИМ наголосом")
    : (FIELD.target === "right" ? "ПРАВИЛЬНІ словосполучення" : "словосполучення з ПОМИЛКОЮ");
  el.innerHTML = `
    <header class="top-bar fld-top">
      <button type="button" class="icon-btn" id="fld-set">‹ Налаштування</button>
      <div class="fld-task">${FIELD.target === "right" ? "✅" : "❌"} Натисни на всі ${what}</div>
    </header>
    <div class="fld-grid fld-n${n > 45 ? 3 : n > 22 ? 2 : 1}" id="fld-grid"></div>
    <div class="fld-bar">
      <span id="fld-count" class="fld-count"></span>
      <button type="button" class="btn-primary" id="fld-check">${FIELD.check === "now" ? "🏁 Завершити" : "✔ Перевірити"}</button>
    </div>
    <div class="fld-rule" id="fld-rule" hidden></div>`;
  const grid = el.querySelector("#fld-grid");
  FIELD.items.forEach((c, i) => {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "fld-it";
    if (FIELD.game === "naholosy") renderStressWord(b, c.show); else b.textContent = c.show;
    b.onclick = () => fieldTap(i, b);
    c.el = b;
    grid.appendChild(b);
  });
  el.querySelector("#fld-set").onclick = () => fieldSetup(FIELD.game);
  el.querySelector("#fld-check").onclick = () => FIELD.done ? null : fieldCheck();
  fieldCount();
  showScreen("field");
}

function fieldCount() {
  const el = screens.field.querySelector("#fld-count");
  if (!el) return;
  const t = FIELD.items.filter(fieldIsTarget).length;
  if (FIELD.check === "now") {
    const f = FIELD.items.filter(c => c.state === "ok").length, bad = FIELD.items.filter(c => c.state === "bad").length;
    el.textContent = `Знайдено ${f} з ${t}${bad ? ` · помилок: ${bad}` : ""}`;
  } else el.textContent = `Позначено: ${FIELD.items.filter(c => c.sel).length}`;
}

function fieldTap(i, b) {
  const c = FIELD.items[i];
  if (FIELD.done) { fieldExplain(c); return; }
  if (FIELD.check === "now") {
    if (c.state) { fieldExplain(c); return; }
    c.sel = true;
    c.state = fieldIsTarget(c) ? "ok" : "bad";
    b.classList.add(c.state === "ok" ? "fld-ok" : "fld-bad");
    if (c.state === "bad") fieldExplain(c);
    fieldCount();
    if (FIELD.items.filter(fieldIsTarget).every(x => x.state === "ok")) fieldCheck();
    return;
  }
  c.sel = !c.sel;
  b.classList.toggle("fld-sel", c.sel);
  fieldCount();
}

function fieldExplain(c) {
  const box = screens.field.querySelector("#fld-rule");
  if (!box) return;
  box.hidden = false;
  box.onclick = () => { box.hidden = true; };
  const okTxt = c.ok ? "✅ Правильно" : "❌ З помилкою";
  box.innerHTML = "";
  const head = document.createElement("div");
  head.className = "fld-rule-h";
  head.textContent = okTxt + (c.ok ? ": " : " → правильно: ");
  const r = document.createElement("b");
  if (FIELD.game === "naholosy") [].concat(c.right).forEach((w, k) => { if (k) r.appendChild(document.createTextNode(" або ")); renderStressWord(r, w); });
  else r.textContent = c.right;
  head.appendChild(r);
  box.appendChild(head);
  if (c.rule) { const p = document.createElement("div"); p.textContent = c.rule; box.appendChild(p); }
  const x = document.createElement("span"); x.className = "fld-x"; x.textContent = "✕"; box.appendChild(x);
}

function fieldCheck() {
  FIELD.done = true;
  let found = 0, extra = 0, missed = 0;
  FIELD.items.forEach(c => {
    const t = fieldIsTarget(c);
    c.el.classList.remove("fld-sel", "fld-ok", "fld-bad");
    if (t && c.sel) { found++; c.el.classList.add("fld-ok"); }
    else if (!t && c.sel) { extra++; c.el.classList.add("fld-bad"); }
    else if (t && !c.sel) { missed++; c.el.classList.add("fld-miss"); }
    else c.el.classList.add("fld-dim");
  });
  const total = found + missed;
  const errs = FIELD.items.filter(c => (fieldIsTarget(c) && !c.sel) || (!fieldIsTarget(c) && c.sel));
  const bar = screens.field.querySelector(".fld-bar");
  bar.classList.add("fld-done");
  screens.field.querySelector("#fld-grid").before(bar); // підсумок — над полем, не закриває слова
  bar.innerHTML = `
    <div class="fld-res">
      <span class="fld-r ok">✅ Знайдено: <b>${found} з ${total}</b></span>
      ${extra ? `<span class="fld-r bad">✗ Зайве: <b>${extra}</b></span>` : ""}
      ${missed ? `<span class="fld-r miss">◌ Пропущено: <b>${missed}</b></span>` : ""}
      ${!extra && !missed ? `<span class="fld-r ok">🎉 Без жодної помилки!</span>` : ""}
    </div>
    <div class="fld-acts">
      ${errs.length ? `<button type="button" class="btn-primary" id="fld-redo">🔁 Робота над помилками (${errs.length})</button>` : ""}
      <button type="button" class="btn-secondary" id="fld-new">🎲 Нове поле</button>
    </div>
    <p class="fld-tip">Натисни на будь-яку кнопку — побачиш, як правильно</p>`;
  const redo = bar.querySelector("#fld-redo");
  if (redo) redo.onclick = () => fieldStart(errs.map(c => ({ src: c.src, ok: c.ok, show: c.show, right: c.right, rule: c.rule })));
  bar.querySelector("#fld-new").onclick = () => fieldStart();
}

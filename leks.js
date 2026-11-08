// 🔎 «Лексична помилка: речення» (власниця, 05.11.2026). Пара до «Лексична помилка: словосполучення» (slovospoluch.js):
// там учень вчиться відрізняти правильне від неправильного, тут — спершу знайти в реченні, що перевірити, а тоді вирішити.
// Дані речень — leks-data.js (PRO, закрите сховище): leksSentences = { "<неправильне словосполучення як у slovospoluch-data.js>":
//   [["…давня {зупинка|стоянка} часів палеоліту…", 0], ["…{стоянка|стоянка}…", 1], …] } — у фігурних дужках {як у реченні
//   з помилкою|як правильно}; другий елемент 1 — речення показується ПРАВИЛЬНИМ (без помилки); упорядковано від коротших до довших.
// Режими (бета і PRO; showLeksModes): 🎯 тренування за тими самими групами, що й у «словосполученнях» (slovoTrainGroups,
// ключі train_leks_<група>; на плитці — «🧩 Ти знаєш це на N %» за групою «словосполучень»), 🏁 марафон (довші речення, 3 життя),
// 📝 «Як на НМТ» (4 речення — у якому помилка; рекорд best_leksnmt, без турнірної таблиці).
// Основна версія (без даних PRO) — лише марафон: речення з Supabase (rpc random_leks, leks-sentences.sql) з виправленням.
// Після кожної відповіді — «✏️ Як правильно» (речення з виправленням) і пояснення. Кожного разу — нове речення для тієї самої
// помилки (localStorage leks_pos: скільки речень кожної помилки вже показано; у тренуванні — від коротших до довших).
let LEKS_FULL = typeof leksSentences !== "undefined" && leksSentences && Object.keys(leksSentences).length ? leksSentences : null;
// основна версія (06.11.2026): відкриті групи з leks-free-data.js («💥 Було на НМТ (1)», по групі паронімів, плеоназмів,
// русизмів) — усі режими; решта груп — 🔒 PRO (лише назви, leksFree.locked)
let LEKS_FREE = !LEKS_FULL && typeof leksFree !== "undefined" && leksFree && leksFree.groups && leksFree.groups.length ? leksFree : null;
let LEKS_DATA = LEKS_FULL || (LEKS_FREE && LEKS_FREE.sentences) || null;
const LEKS_POS_KEY = "leks_pos";
let leksMode = "marathon"; // marathon | nmt (тренування — training.game === "leksychna")

// усі помилки (рядки «словосполучень») з поясненнями
function leksBuildRows() {
  const map = new Map();
  (LEKS_FREE ? LEKS_FREE.groups : typeof slovospoluchGroups !== "undefined" ? slovospoluchGroups : []).forEach(g => g.rows.forEach(([wrong, right, rule]) => {
    if (!map.has(wrong)) map.set(wrong, { wrong, right, rule });
  }));
  return map;
}
let LEKS_ROWS = leksBuildRows();
// ⚡ Повний банк речень (6 МБ) loader.js довантажує у фоні, щоб меню з'являлося одразу (07.11.2026) — тоді вмикаємо всі групи
function leksUpgrade() {
  if (typeof leksSentences === "undefined" || !leksSentences || !Object.keys(leksSentences).length) return;
  LEKS_FULL = leksSentences;
  LEKS_FREE = null;
  LEKS_DATA = LEKS_FULL;
  LEKS_ROWS = leksBuildRows();
  leksMarathonRows = [];
  try { if (screens.leksModes && !screens.leksModes.hidden && !(typeof training !== "undefined" && training)) showLeksModes(); } catch (e) { /* */ }
}

// «…{зупинка|стоянка}…» → частини
function leksParse(t) {
  const m = t.match(/^(.*?)\{([^|{}]*)\|([^|{}]*)\}(.*)$/);
  if (!m) return { before: t, wrongForm: "", rightForm: "", after: "" };
  return { before: m[1], wrongForm: m[2], rightForm: m[3], after: m[4] };
}
const leksText = (t, fixed) => { const p = leksParse(t); return p.before + (fixed ? p.rightForm : p.wrongForm) + p.after; };
const leksWords = t => leksText(t, true).split(/\s+/).length;

function leksPos() { try { return JSON.parse(storageGet(LEKS_POS_KEY) || "{}"); } catch (e) { return {}; } }
function leksNextSentence(wrong, longOnly) {
  const list = (LEKS_DATA && LEKS_DATA[wrong]) || [];
  if (!list.length) return null;
  const pos = leksPos();
  let idx;
  if (longOnly) {
    // марафон: довша половина речень, по колу
    const from = Math.floor(list.length / 2);
    const span = list.length - from;
    idx = from + ((pos["m" + wrong] || 0) % span);
    pos["m" + wrong] = (pos["m" + wrong] || 0) + 1;
  } else {
    idx = (pos[wrong] || 0) % list.length;
    pos[wrong] = (pos[wrong] || 0) + 1;
  }
  storageSet(LEKS_POS_KEY, JSON.stringify(pos));
  const [t, ok] = list[idx];
  return { t, ok: Boolean(ok), wrong, idx };
}

function leksCard(row, s) {
  return { t: s.t, ok: s.ok, wrong: row.wrong, right: row.right, rule: row.rule || "" };
}

// ---------- тренування групами (groups.js) — групи ті самі, що в «словосполученнях» ----------
function leksTrainGroups() {
  if (LEKS_FREE) {
    return LEKS_FREE.groups.map(g => ({
      key: `train_leks_${g.name}`, name: g.name,
      items: g.rows.map(([wrong, right, rule]) => LEKS_ROWS.get(wrong) || { wrong, right, rule }),
      sub: leksKnowBadge(`train_slovo_${g.name}`, "🧩")
    }));
  }
  if (!LEKS_DATA || typeof slovoTrainGroups !== "function") return [];
  return slovoTrainGroups().map(g => {
    const seen = new Set();
    const items = [];
    g.items.forEach(c => {
      if (seen.has(c.wrong) || !LEKS_DATA[c.wrong]) return;
      seen.add(c.wrong);
      items.push(LEKS_ROWS.get(c.wrong) || { wrong: c.wrong, right: c.right, rule: c.rule });
    });
    return { key: `train_leks_${g.name}`, name: g.name, items, sub: leksKnowBadge(g.key, "🧩") };
  }).filter(g => g.items.length);
}
// як група вивчена в паралельній грі: «🧩 Ти знаєш це» / «на 55 %»
function leksKnowBadge(otherKey, icon) {
  let a = null;
  try { const m = JSON.parse(storageGet(`${otherKey}_mem`) || "null"); if (m && m.a != null) a = m.a; } catch (e) { /* */ }
  if (a == null) {
    const best = Number(storageGet(otherKey)) || 0;
    if (!best) return "";
    return `${icon} Ти вже трохи знаєш це`;
  }
  const p = Math.round(a * 100);
  return p >= 95 ? `${icon} Ти знаєш це` : `${icon} Ти знаєш це на ${p}%`;
}

if (typeof TRAIN_GAMES !== "undefined") {
  TRAIN_GAMES.leksychna = {
    groups: leksTrainGroups,
    prep: row => { const s = leksNextSentence(row.wrong, false); return s ? leksCard(row, s) : null; },
    render: () => renderLeks()
  };
  TRAIN_UNITS.leksychna = ["помилка", "помилки", "помилок"]; // у групі — помилки, до кожної щоразу нове речення
  // і навпаки: у «словосполученнях» — чи знаєш групу в реченнях
  const slovoGroupsOrig = TRAIN_GAMES.slovospoluch && TRAIN_GAMES.slovospoluch.groups;
  if (slovoGroupsOrig && LEKS_DATA) TRAIN_GAMES.slovospoluch.groups = () => slovoGroupsOrig().map(g => ({ ...g, sub: g.sub || leksKnowBadge(`train_leks_${g.name}`, "🔎") }));
}

// ---------- екран режимів ----------
screens.leksModes = (() => {
  const main = document.createElement("main");
  main.id = "leks-modes";
  main.className = "screen";
  main.hidden = true;
  main.innerHTML = `
    <header class="top-bar">
      <button id="btn-leks-back" class="icon-btn" aria-label="В меню">‹ Меню</button>
      <h2 class="screen-title">🔎 Лексична помилка: речення</h2>
    </header>
    <p class="leks-lead">Знайди в реченні слово чи вислів, який ужито неправильно, — або натисни «Помилок немає». Після відповіді побачиш, як правильно.</p>
    <section class="mode-panel">
      <div class="mode-head">
        <span class="mode-num">1</span>
        <span class="mode-head-text">
          <span class="mode-title">🎯 Тренування за темами</span>
          <span class="mode-desc">Ті самі групи, що й у «Лексична помилка: словосполучення». Щоразу — нові речення, спершу коротші</span>
          <span id="leks-groups-progress" class="mode-progress"></span>
        </span>
      </div>
      <div id="leks-group-list" class="group-grid"></div>
      <details id="leks-locked" class="leks-locked" hidden><summary></summary><div class="leks-locked-list"></div>
        <button type="button" class="btn-secondary leks-locked-btn">🦆 Чекаю на Спільноту Укрмовича!</button></details>
    </section>
    <section class="mode-panel">
      <div class="mode-head">
        <span class="mode-num">2</span>
        <span class="mode-head-text">
          <span class="mode-title">🏁 Марафон</span>
          <span class="mode-desc">Довгі речення з усіх тем · 3 життя · рекорд</span>
        </span>
      </div>
      <button id="btn-leks-marathon" class="btn-primary mode-start">Почати марафон <span class="mode-best" data-best="leksychna"></span></button>
    </section>
    <section class="mode-panel">
      <div class="mode-head">
        <span class="mode-num">3</span>
        <span class="mode-head-text">
          <span class="mode-title">📝 Як на НМТ</span>
          <span class="mode-desc">Чотири речення — у якому з них лексична помилка? · 3 життя</span>
        </span>
      </div>
      <button id="btn-leks-nmt" class="btn-primary mode-start">Почати <span class="mode-best" data-best="leksnmt"></span></button>
    </section>
    <section class="mode-panel">
      <div class="mode-head">
        <span class="mode-num">4</span>
        <span class="mode-head-text">
          <span class="mode-title">🌐 Онлайн з друзями</span>
          <span class="mode-desc">Кожен на своєму телефоні: дуель, спринт, гра для класу. Завдання — як на НМТ</span>
        </span>
      </div>
      <div class="online-modes">
        <button class="online-mode-btn" data-leks-online="duel"><span class="om-title">⚔️ Онлайн-дуель</span><span class="om-desc">Удвох. Однакове завдання — хто правильно й швидше</span></button>
        <button class="online-mode-btn" data-leks-online="sprint"><span class="om-title">⏱ Спринт 2 хвилини</span><span class="om-desc">2–10 гравців. Хто дасть більше правильних відповідей</span></button>
        <button class="online-mode-btn" data-leks-online="class"><span class="om-title">🏫 Гра для класу</span><span class="om-desc">Учитель веде гру на проєкторі, учні відповідають з телефонів</span></button>
      </div>
      <button type="button" class="btn-secondary" data-leks-online="join">🔑 Маю код — приєднатися</button>
    </section>`;
  $("menu").after(main);
  main.querySelector("#btn-leks-back").addEventListener("click", () => (typeof showLeksChoice === "function" ? showLeksChoice() : showMenu()));
  main.querySelector("#btn-leks-marathon").addEventListener("click", () => leksStart("marathon"));
  main.querySelector("#btn-leks-nmt").addEventListener("click", () => leksStart("nmt"));
  main.querySelectorAll("[data-leks-online]").forEach(b => b.addEventListener("click", e => {
    e.stopImmediatePropagation(); // online.js теж слухає .online-mode-btn — тут свій вибір режиму
    modesGame = "leksychna";
    leksRegisterOnline();
    if (typeof openOnline === "function") openOnline(b.dataset.leksOnline === "join" ? null : b.dataset.leksOnline);
  }));
  return main;
})();

function showLeksModes() {
  clearTimeout(nextTimer);
  training = null;
  questionToken++;
  modesGame = "leksychna";
  if (typeof renderTrainPicker === "function") renderTrainPicker("leksychna", $("leks-group-list"), $("leks-groups-progress"));
  const lk = $("leks-locked");
  lk.hidden = !LEKS_FREE;
  if (LEKS_FREE) {
    const n = LEKS_FREE.locked.length;
    lk.querySelector("summary").textContent = `🔒 Ще ${n} ${plural(n, "група", "групи", "груп")} — у PRO`;
    lk.querySelector(".leks-locked-list").innerHTML = LEKS_FREE.locked.map(x => `<span class="leks-locked-chip">🔒 ${x.replace(/[&<>]/g, "")}</span>`).join("");
    const up = typeof proUpsell === "function" && proUpsell(); // upsell.js: новим — заклик із ціною й перехід на підписку
    lk.querySelector(".leks-locked-btn").textContent = up ? UPSELL_CTA : PRO_WAIT_TEXT;
    lk.querySelector(".leks-locked-btn").onclick = e => (up ? upsellGo("leks_locked") : proWaitClick(e.currentTarget));
    lk.ontoggle = () => { if (lk.open && up) upsellView("leks_locked"); };
  }
  renderBestScores();
  showScreen("leksModes");
}

function leksStart(mode) {
  leksMode = mode;
  startGame("leksychna");
}

// ---------- наступне завдання (script.js → nextQuestion → leksLoad; поки нових речень немає — старий loadSentence) ----------
let leksMarathonRows = [];
async function leksLoad() {
  if (leksMode === "nmt" && LEKS_DATA) { leksNextNmt(); return; }
  if (LEKS_DATA) {
    if (!leksMarathonRows.length) { leksMarathonRows = [...LEKS_ROWS.values()].filter(r => LEKS_DATA[r.wrong]); shuffleArray(leksMarathonRows); }
    const row = leksMarathonRows.shift();
    const s = leksNextSentence(row.wrong, true);
    currentQuestion = leksCard(row, s);
    renderLeks();
    return;
  }
  await leksLoadRemote();
}

// основна версія: речення з Supabase по одному (rpc random_leks), наступне — заздалегідь
let leksSeenIds = [];
let leksPrefetch = null;
async function leksFetchRemote() {
  const rows = await lbRequest("rpc/random_leks", { method: "POST", body: JSON.stringify({ exclude: leksSeenIds.slice(-300) }) });
  if (!rows || !rows.length) { if (leksSeenIds.length) { leksSeenIds = []; return leksFetchRemote(); } const e = new Error("empty"); e.empty = true; throw e; }
  return rows[0];
}
let leksRemoteEmpty = false;
async function leksLoadRemote() {
  if (leksRemoteEmpty) { loadSentence(); return; }
  const token = questionToken;
  lock = true;
  questionEl.textContent = "Чи є лексична помилка? Де саме? 👀";
  sentenceEl.hidden = false;
  if (!leaderboardEnabled) { sentenceEl.textContent = "Скоро тут з'являться речення 🙂"; return; }
  sentenceEl.innerHTML = '<span class="loading">Завантажую речення…</span>';
  try {
    const row = await (leksPrefetch || leksFetchRemote());
    leksPrefetch = null;
    if (token !== questionToken) return;
    leksSeenIds.push(row.id);
    currentQuestion = { t: row.t, ok: row.ok, wrong: row.w, right: row.r, rule: row.e || "" };
    lock = false;
    renderLeks();
    leksPrefetch = leksFetchRemote();
    leksPrefetch.catch(() => { leksPrefetch = null; });
  } catch (err) {
    leksPrefetch = null;
    if (token !== questionToken) return;
    if (err && err.empty) { leksRemoteEmpty = true; loadSentence(); return; } // нових речень у базі ще немає — старі (script.js)
    sentenceEl.textContent = "Не вдалося завантажити речення. Перевір інтернет.";
    const retry = document.createElement("button");
    retry.className = "ok-btn";
    retry.textContent = "Спробувати ще раз";
    retry.onclick = () => nextQuestion();
    answersEl.appendChild(retry);
  }
}

// ---------- речення-кнопки: знайди помилку ----------
function leksTokens(card) {
  const p = leksParse(card.t);
  const seg = card.ok ? p.rightForm : p.wrongForm;
  const marked = p.before + "\u0001" + seg + "\u0002" + p.after;
  const out = [];
  let inSeg = false;
  marked.split(/\s+/).filter(Boolean).forEach(tok => {
    const hasStart = tok.includes("\u0001"), hasEnd = tok.includes("\u0002");
    const target = inSeg || hasStart || hasEnd;
    if (hasStart) inSeg = true;
    if (hasEnd) inSeg = false;
    const text = tok.replace(/[\u0001\u0002]/g, "");
    if (text) out.push({ text, target });
    else if (target && out.length) out[out.length - 1].target = true;
  });
  return out;
}

// речення з виправленням: «…давня <b>стоянка</b> часів…»
function leksFixedNode(card, cls = "leks-fixed") {
  const p = leksParse(card.t);
  const el = document.createElement("p");
  el.className = cls;
  const b = document.createElement("b");
  b.textContent = p.rightForm;
  el.append(p.before, b, p.after);
  return el;
}

function leksExplain(card) {
  const box = document.createElement("div");
  box.className = "leks-explain";
  const head = document.createElement("p");
  head.className = "leks-head";
  if (card.ok) {
    head.textContent = "✅ Тут усе правильно:";
    box.append(head, leksFixedNode(card));
  } else {
    head.textContent = "✏️ Як правильно:";
    box.append(head, leksFixedNode(card));
  }
  const pair = document.createElement("p");
  pair.className = "leks-pair";
  const w = document.createElement("s");
  w.textContent = card.wrong;
  const r = document.createElement("b");
  r.textContent = card.right;
  pair.append(w, " → ", r);
  box.appendChild(pair);
  if (card.rule) {
    const rule = document.createElement("p");
    rule.className = "frazeo-meaning";
    rule.textContent = card.rule;
    box.appendChild(rule);
  }
  return box;
}

function renderLeks() {
  const card = currentQuestion;
  if (!card) { nextQuestion(); return; }
  questionEl.textContent = "Чи є лексична помилка? Де саме? 👀";
  hintEl.textContent = "Натисни на слово з помилкою або «Помилок немає»";
  sentenceEl.hidden = false;
  sentenceEl.innerHTML = "";
  answersEl.innerHTML = "";
  const line = document.createElement("p");
  line.className = "leks-sentence";
  sentenceEl.appendChild(line);
  const chips = [];
  leksTokens(card).forEach(tok => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "chip";
    btn.textContent = tok.text;
    btn.dataset.target = tok.target ? "1" : "";
    btn.onclick = () => leksAnswer(card, !card.ok && tok.target, btn, chips, okBtn);
    chips.push(btn);
    line.append(btn, " ");
  });
  const okBtn = document.createElement("button");
  okBtn.type = "button";
  okBtn.className = "ok-btn";
  okBtn.textContent = "✅ Помилок немає";
  okBtn.onclick = () => leksAnswer(card, card.ok, okBtn, chips, okBtn);
  answersEl.appendChild(okBtn);
}

function leksAnswer(card, isCorrect, picked, chips, okBtn) {
  handleAnswer(isCorrect, () => {
    chips.forEach(c => {
      if (c.dataset.target === "1") c.classList.add(card.ok ? "leks-okword" : "correct", ...(card.ok ? [] : ["strikethrough"]));
      if (!isCorrect && c.dataset.target === "1" && !card.ok) c.classList.add("blink");
    });
    if (card.ok) okBtn.classList.add("correct", ...(isCorrect ? [] : ["blink"]));
    if (!isCorrect) picked.classList.add("wrong");
    if (!isCorrect && picked !== okBtn && picked.dataset.target !== "1") {
      const note = document.createElement("p");
      note.className = "leks-note";
      note.textContent = `Слово «${picked.textContent.replace(/[.,!?;:«»"()]/g, "")}» тут ужито правильно.`;
      sentenceEl.appendChild(note);
    }
    sentenceEl.appendChild(leksExplain(card));
    const next = document.createElement("button");
    next.className = "btn-secondary frazeo-next";
    next.textContent = "Далі →";
    next.addEventListener("click", skipWait);
    sentenceEl.appendChild(next);
  }, { leks: true, t: card.t, ok: card.ok, wrong: card.wrong, right: card.right });
}

// ---------- «Як на НМТ»: чотири речення, в одному — помилка ----------
function leksNextNmt() {
  const all = [...LEKS_ROWS.values()].filter(r => LEKS_DATA[r.wrong]);
  shuffleArray(all);
  const rows = all.slice(0, 4);
  // власниця: частіше умова «Лексичної помилки НЕМАЄ в реченні» (3 з помилкою, 1 правильне), інакше — «допущено» (1 з помилкою)
  const none = Math.random() < 0.6;
  const items = rows.map((row, i) => {
    const s = leksNextSentence(row.wrong, true);
    return { ...leksCard(row, s), ok: none ? i === 0 : i !== 0 };
  });
  shuffleArray(items);
  currentQuestion = { nmt: true, none, items };
  renderLeksNmt();
}

function renderLeksNmt() {
  const q = currentQuestion;
  questionEl.innerHTML = q.none ? "Лексичної помилки <b>НЕМАЄ</b> в реченні" : "Лексичну помилку допущено в реченні";
  hintEl.textContent = "Підказка: можна відповідати клавішами 1–4";
  sentenceEl.hidden = false;
  sentenceEl.innerHTML = "";
  answersEl.innerHTML = "";
  const letters = ["А", "Б", "В", "Г"];
  const btns = q.items.map((card, i) => {
    const row = document.createElement("div");
    row.className = "leks-nmt-row";
    const l = document.createElement("span");
    l.className = "leks-nmt-letter";
    l.textContent = letters[i];
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "answer leks-nmt-opt";
    btn.textContent = leksText(card.t, card.ok);
    row.append(l, btn);
    const target = c => (q.none ? c.ok : !c.ok);
    btn.onclick = () => {
      const isCorrect = target(card);
      const shown = q.none ? q.items.filter(c => !c.ok) : [q.items.find(c => !c.ok)];
      const bad = shown[0];
      handleAnswer(isCorrect, () => {
        btns.forEach((b, j) => {
          if (target(q.items[j])) b.classList.add("correct");
          else if (b === btn) b.classList.add("wrong");
          else b.classList.add("dim");
        });
        shown.forEach(c => sentenceEl.appendChild(leksExplain(c)));
        const next = document.createElement("button");
        next.className = "btn-secondary frazeo-next";
        next.textContent = "Далі →";
        next.addEventListener("click", skipWait);
        sentenceEl.appendChild(next);
      }, { leks: true, t: bad.t, ok: false, wrong: bad.wrong, right: bad.right });
    };
    answersEl.appendChild(row);
    return btn;
  });
}
// клавіші 1–4 у «Як на НМТ»
document.addEventListener("keydown", e => {
  if (screens.game.hidden || currentGame !== "leksychna" || !currentQuestion || !currentQuestion.nmt || e.target.tagName === "INPUT") return;
  const b = answersEl.querySelectorAll(".leks-nmt-opt")[Number(e.key) - 1];
  if (b && !b.disabled) b.click();
});

// у списку помилок після гри: речення з виправленням
function leksMistakeNode(m) {
  const wrap = document.createElement("span");
  wrap.className = "sentence-mistake";
  wrap.appendChild(leksFixedNode(m, "leks-fixed leks-fixed-sm"));
  const pair = document.createElement("span");
  pair.className = "leks-pair";
  const w = document.createElement("s");
  w.textContent = m.wrong;
  const r = document.createElement("b");
  r.textContent = m.right;
  pair.append(m.ok ? "✅ помилки не було · " : "", w, " → ", r);
  wrap.appendChild(pair);
  return wrap;
}


// ---------- онлайн (online.js): дуель, спринт, гра для класу — завдання «як на НМТ» ----------
function leksOnlinePool() { return [...LEKS_ROWS.values()].filter(r => LEKS_DATA && LEKS_DATA[r.wrong]); }
function leksOnlineCard(row, rand) {
  const R = typeof rand === "function" ? rand : Math.random;
  const pool = leksOnlinePool();
  const rows = [row];
  for (let k = 0; rows.length < 4 && k < 50; k++) { const r = pool[Math.floor(R() * pool.length)]; if (!rows.includes(r)) rows.push(r); }
  const none = R() < 0.6; // частіше «помилки НЕМАЄ»
  const items = rows.map((r, i) => {
    const list = LEKS_DATA[r.wrong];
    const from = Math.floor(list.length / 2);
    const s = list[from + Math.floor(R() * (list.length - from))];
    const ok = none ? i === 0 : i !== 0;
    return { text: leksText(s[0], ok), t: s[0], ok, wrong: r.wrong, right: r.right, rule: r.rule || "" };
  });
  const target = items[0];
  return {
    text: none ? "Лексичної помилки НЕМАЄ в реченні" : "Лексичну помилку допущено в реченні",
    answer: target.text, options: items.map(x => x.text),
    leks: { none, bad: items.filter(x => !x.ok).map(x => ({ t: x.t, wrong: x.wrong, right: x.right, rule: x.rule })) }
  };
}
function leksOnlineReveal(view, card, picked) {
  view.box.querySelectorAll("button").forEach(b => {
    if (b.dataset.word === card.answer) b.classList.add("correct");
    else if (b.dataset.word === picked) b.classList.add("wrong");
  });
  view.meaning.innerHTML = "";
  card.leks.bad.forEach(m => view.meaning.appendChild(leksExplain({ ...m, ok: false })));
}
// online.js вантажиться після leks.js — реєструємо тему, щойно він є
function leksRegisterOnline() {
  if (typeof ONLINE_GAMES === "undefined" || ONLINE_GAMES.leksychna) return;
  ONLINE_GAMES.leksychna = {
    label: "🔎 Гра: Лексична помилка", what: "у лексичні помилки", unit: "Завдання", next: "Наступне завдання",
    card: true, duelLimit: 45000, duelPause: 6000, sprint: 120, penalty: 3, classLimit: 60000,
    pool: leksOnlinePool,
    makeCard: (row, rand) => leksOnlineCard(row, rand)
  };
}
window.addEventListener("load", leksRegisterOnline);
setTimeout(leksRegisterOnline, 0);
// повернення з онлайн-гри — на екран «Лексична помилка: речення»
if (typeof showModes === "function") {
  const leksShowModesOrig = showModes;
  showModes = function (game) {
    if ((game || modesGame) === "leksychna") return showLeksModes();
    return leksShowModesOrig.apply(this, arguments);
  };
}

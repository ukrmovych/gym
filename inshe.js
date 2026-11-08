// «📂 Інше» (власник, 04.11.2026): одна плитка в меню → розділи НМТ → тренажери.
// Лише актуальні теми й формати НМТ 2022–2026, без пропусків (вимога власниці; «Ділові папери»,
// «Типи й стилі мовлення» тощо свідомо не робимо).
// Кожен тренажер — набір карток у inshe/<розділ>.js (виклик inshe("id", [картки])):
//   { g: група, t: текст (HTML <b>/<i>/<u>; «___» — пропуск), a: правильна, w: [неправильні], r: пояснення,
//     s: джерело («НМТ-2024», «ЗНО-2019») — лише в справжніх завдань: позначка «💥 Було на іспиті» й група тренування
//     з них; решта карток — власні, такі, що МОЖУТЬ бути на НМТ (вимога власниці), q?: своє питання }
//   Наголос у варіантах — велика наголошена голосна («вИпадок»), як у «Наголосах».
// Дані вантажаються лише при відкритті папки (insheLoad). Гра — спільний рушій script.js: currentGame = "inshe",
// поточний тренажер — insheQuiz. Марафон (3 життя, рекорд best_inshe_<id>) і тренування групами (groups.js,
// ключі train_inshe_<id>_<група>). Дуелі й онлайну тут немає.
// Змішані режими: ⚡ Блискавка (60 с), 📅 10 завдань дня, 🔁 Мої помилки (localStorage train_inshe_errors),
// ✍️ Виправ сам (набрати правильне написання), 🪶 Постав коми (inshe/komy.js — торкатися проміжків).
// Усі завдання — за TASK_RULES.md.

const INSHE_V = "20261108c";
const INSHE_FILES = ["fonetyka", "naholos", "orfo1", "orfo2", "budova", "leksyka", "morf1", "morf2", "syntax1", "syntax2", "komy", "istoriia"];

// [id, значок, назва, стандартне питання, позначки]
const INSHE_SECTIONS = [
  { id: "fonetyka", icon: "🔊", name: "Фонетика і графіка", quizzes: [
    ["zvuk", "👂", "Який звук насправді?", "Який звук позначає виділена буква?"],
    ["zaive_zvuk", "🕵️", "Знайди зайвий звук", "Виділена буква позначає ІНШИЙ звук, ніж в інших словах, у слові"],
    ["apostrof", "❜", "Апостроф", "Як правильно?"],
    ["miakyi_znak", "ь", "М'який знак", "Як правильно?"],
    ["sproshchennia", "✂️", "Спрощення приголосних", "Як правильно?"]
  ] },
  { id: "naholos", icon: "🗣️", name: "Наголос", quizzes: [
    ["sklad", "1️⃣", "Котрий склад наголошений?", "Обери слово"],
    ["riadok", "📏", "Усе правильно в рядку?", "Правильно позначено наголос у всіх словах рядка", "stress"],
    ["formy", "🔄", "Наголос у формах слова", "Як наголошуємо?", "stress"]
  ] },
  { id: "orfohrafiia", icon: "✍️", name: "Орфографія", quizzes: [
    ["razom_okremo", "🔗", "Разом, окремо чи з дефісом?", "Обери рядок"],
    ["bez_pomylky", "✅", "Знайди без помилки", "Без помилки написано"],
    ["podvoiennia", "👯", "Подвоєння", "Як правильно?"],
    ["velyka_bukva", "🔠", "Велика буква", "Як правильно?"],
    ["prefiksy", "🧷", "Префікси з-/с-, пре-/при-/прі-", "Як правильно?"],
    ["e_y", "🔤", "Е чи И", "Як правильно?"],
    ["deviatka", "9️⃣", "И чи І в іншомовних словах", "Як правильно?"],
    ["pravopys2019", "📘", "Новий правопис 2019", "Як правильно за чинним правописом?"],
    ["ne_razom", "🚫", "НЕ разом чи окремо", "Як правильно?"],
    ["zminy_pryholosnykh", "🧪", "Зміни приголосних (козацький, празький)", "Як правильно?"]
  ] },
  { id: "budova", icon: "🧩", name: "Будова слова і словотвір", quizzes: [
    ["zakinchennia", "🔚", "Закінчення", "Обери правильну відповідь"],
    ["sufiks", "🧱", "Значення суфікса й префікса", "Обери правильну відповідь"],
    ["sposib", "🛠️", "Творення слів", "Обери правильну відповідь"]
  ] },
  { id: "leksyka", icon: "📚", name: "Лексика і фразеологія", quizzes: [
    ["paronimy", "👥", "Пароніми", "Яке слово підходить?"],
    ["synonimy", "↔️", "Синоніми", "Обери правильну відповідь"],
    ["frazeo_synonim", "💬", "Фразеологізм-синонім", "Обери правильну відповідь"],
  ] },
  { id: "morfolohiia", icon: "🔤", name: "Морфологія", quizzes: [
    ["chastyny_movy", "🏷️", "Яка це частина мови?", "Якою частиною мови є виділене слово?"],
    ["hram_pomylka", "🛑", "Граматична помилка", "Граматичну помилку допущено в реченні"],
    ["nakazovyi", "📢", "Наказовий спосіб", "Як правильно?"],
    ["osobovi", "🏃", "Особові закінчення дієслів", "Як правильно?"],
    ["stupeni", "📈", "Ступені порівняння", "Як правильно?"],
    ["rodovyi_a_u", "🅰️", "Родовий відмінок: -а чи -у", "Як правильно?"],
    ["davalnyi", "🎁", "Давальний відмінок: -ові чи -у", "Як правильно?"],
    ["rid", "⚥", "Рід іменників (той біль, та медаль)", "Як правильно?"],
    ["prizvyshcha", "🪪", "Відмінювання прізвищ", "Як правильно?"],
    ["diieprysl", "🔁", "Дієприслівниковий зворот", "Обери правильну відповідь"],
    ["diieprykm", "🧬", "Дієприкметники (завідувач, а не завідуючий)", "Як правильно?"],
    ["pryimennyky", "🧷", "Прийменники й сполучники", "Як правильно?"]
  ] },
  { id: "syntaksys", icon: "🧱", name: "Синтаксис і пунктуація", quizzes: [
    ["chleny", "🎯", "Член речення", "Яким членом речення є виділене?"],
    ["vyd_rechennia", "🧮", "Вид речення", "Яке це речення?"],
    ["pidriadne", "🪜", "Вид підрядного речення", "Який вид підрядного?"],
    ["koma", "✒️", "Кома: потрібна чи ні?", "Чи потрібна кома на місці цифри?"],
    ["komy_tap", "🪶", "Постав коми", "Торкнися проміжків, де потрібні коми", "komy"],
    ["bezspoluchnykove", "⛓️", "Знак у безсполучниковому реченні", "Який знак на місці цифри?"],
    ["pobudova", "🏗️", "Побудова речення", "Неправильно побудовано речення"],
    ["priama_mova", "🗨️", "Пряма мова і цитати", "Обери правильну відповідь"],
    ["nepriama", "🔀", "Пряма → непряма мова", "Обери правильну відповідь"],
    ["vstavni", "🗯️", "Вставні слова і звертання", "Обери правильну відповідь"],
    ["tyre", "➖", "Тире між підметом і присудком", "Обери правильну відповідь"],
    ["dialoh", "☎️", "Діалог і мовленнєві ситуації", "Обери найдоречнішу відповідь"]
  ] },
  { id: "mix", icon: "🎮", name: "Змішані режими", quizzes: [
    ["shchodnia", "📅", "10 завдань дня", "", "daily"],
    ["blyskavka", "⚡", "Блискавка: 60 секунд", "", "blitz"],
    ["pomylky", "🔁", "Мої помилки", "", "errors"],
    ["napysh", "⌨️", "Виправ сам (набери правильно)", "Виправ помилку — напиши слово правильно", "input"]
  ] },
  // 🏛️ «Історія України» — окрема плитка в меню (не в «Іншому»): дати й персоналії, inshe/istoriia.js
  { id: "istoriia", icon: "🏛️", name: "Історія України", hidden: true, quizzes: [
    ["ist_d1", "🏺", "Дати: найдавніші часи – перша половина XVI ст.", "Коли це було?", "dates"],
    ["ist_d2", "⚔️", "Дати: друга половина XVI – кінець XVIII ст.", "Коли це було?", "dates"],
    ["ist_d3", "📜", "Дати: кінець XVIII ст. – 1914 р.", "Коли це було?", "dates"],
    ["ist_d4", "🔥", "Дати: 1914 – 1939 рр.", "Коли це було?", "dates"],
    ["ist_d5", "🇺🇦", "Дати: 1939 р. – початок XXI ст.", "Коли це було?", "dates"],
    ["ist_portrety", "🖼️", "Персоналії: хто на портреті?", ""],
    ["ist_persony", "👤", "Персоналії: про кого це?", ""]
  ] }
];
const insheHist = id => INSHE_META[id] && INSHE_META[id].sec === "istoriia";

// квізи, з яких «Виправ сам» бере слова з помилками (варіанти — написання того самого слова)
// 🔒 Перелік тренажерів для тих, кому «Інше» ще закрите (власниця, 07.11.2026): назви й кількість завдань видно
// одразу у вікні PRO / «скоро» (script.js → insheLockedList). Кількості — inshe-counts.js (публічний, генерує
// tools/inshe-counts.js під час кожного викладання з inshe/*.js), тож вони оновлюються самі.
const INSHE_COUNTS = (window.INSHE_COUNTS && window.INSHE_COUNTS.by) || {};
function insheLockedList() {
  const esc = s => String(s).replace(/[&<>]/g, "");
  return INSHE_SECTIONS.filter(sec => !sec.hidden).map(sec => {
    const items = sec.quizzes.map(q => {
      const n = INSHE_COUNTS[q[0]];
      return `<span class="inshe-lock-chip">${q[1]} ${esc(q[2])}${n ? ` <i>${n}</i>` : ""}</span>`;
    }).join("");
    return `<div class="inshe-lock-sec"><b>${sec.icon} ${esc(sec.name)}</b><div>${items}</div></div>`;
  }).join("");
}

const INSHE_SPELL = ["apostrof", "miakyi_znak", "sproshchennia", "podvoiennia", "prefiksy", "e_y", "deviatka", "zminy_pryholosnykh", "velyka_bukva"];
const INSHE_ERR_KEY = "train_inshe_errors";

const insheData = {};
function inshe(id, cards) { insheData[id] = cards; }

const INSHE_META = {};
INSHE_SECTIONS.forEach(sec => sec.quizzes.forEach(([id, icon, name, prompt, flag]) => {
  INSHE_META[id] = { id, icon, name, prompt, flag: flag || "", sec: sec.id };
}));

let insheQuiz = null;      // { id, name, icon, prompt, flag, cards: [...] }
let insheSection = null;   // відкритий розділ (null — перелік розділів)
let insheLoading = null;
let insheBlitzTimer = null;

function insheLoad() {
  if (insheLoading) return insheLoading;
  // 🔒 дані — лише тим, кому можна (loader.js → функція pro-data)
  insheLoading = typeof gymProLoad === "function"
    ? gymProLoad(INSHE_FILES.map(f => `inshe/${f}.js?v=${INSHE_V}`))
    : Promise.all(INSHE_FILES.map(f => new Promise(resolve => {
      const s = document.createElement("script");
      s.src = `inshe/${f}.js?v=${INSHE_V}`;
      s.onload = s.onerror = () => resolve();
      document.head.appendChild(s);
    })));
  return insheLoading;
}

// ---------- Картки тренажера ----------
// справжнє завдання ЗНО/НМТ (поле s) → позначка «💥 Було на іспиті» і окрема група тренування
const insheExam = c => /^(НМТ|ЗНО)/.test(c.s || "");
const inshePlain = html => String(html || "").replace(/<[^>]+>/g, "");

function insheCardsOf(id) {
  const meta = INSHE_META[id];
  if (meta.flag === "komy") {
    return (typeof insheKomy !== "undefined" ? insheKomy : []).map((k, i) => ({ g: k.g, r: k.r, sentence: k.s, s: k.src, komy: true, _src: id, _i: i })); // komy.js: s — речення, src — джерело
  }
  if (meta.flag === "input") {
    const out = [];
    INSHE_SPELL.forEach(src => (insheData[src] || []).forEach((c, i) => {
      // лише одне слово-написання, без пропуску в тексті
      if (/[\s,]/.test(inshePlain(c.a)) || (c.t || "").includes("___") || /[<>]/.test(c.a + c.w.join(""))) return;
      const bad = c.w.find(w => !/[\s,]/.test(w) && w.toLowerCase() !== c.a.toLowerCase());
      if (bad) out.push({ ...c, bad, g: INSHE_META[src].name, _src: src, _i: i, input: true });
    }));
    return out;
  }
  if (meta.flag === "errors") {
    return insheErrors().map(k => {
      const [src, i] = k.split("|");
      const c = (insheData[src] || [])[+i];
      return c && { ...c, g: INSHE_META[src] ? INSHE_META[src].name : "", _src: src, _i: +i };
    }).filter(Boolean);
  }
  if (meta.flag === "daily" || meta.flag === "blitz") {
    const all = [];
    Object.keys(insheData).forEach(src => {
      if (!INSHE_META[src] || !["", "stress", "dates"].includes(INSHE_META[src].flag) || insheHist(src)) return; // історія — окремо
      insheData[src].forEach((c, i) => all.push({ ...c, _src: src, _i: i }));
    });
    if (meta.flag === "daily") {
      // однакові 10 завдань для всіх протягом дня
      const d = new Date();
      let seed = d.getFullYear() * 1000 + d.getMonth() * 40 + d.getDate();
      const rand = () => { seed = (seed * 16807) % 2147483647; return seed / 2147483647; };
      shuffleArray(all, rand);
      return all.slice(0, 10).map(c => ({ ...c, g: "Сьогодні" }));
    }
    return all;
  }
  return (insheData[id] || []).map((c, i) => ({ ...c, _src: id, _i: i }));
}

// 🏛️ Дати (власниця, 08.11.2026): «⭐ Лише обов'язкові» (дати програми НМТ, star) або «📚 + додаткові» — localStorage
// train_ist_scope (must — типово / all). Групи обов'язкових — окремі ключі з «⭐ » перед назвою (свій прогрес).
const insheDateScope = () => storageGet("train_ist_scope") === "all" ? "all" : "must";
function insheMakeQuiz(id) {
  const meta = INSHE_META[id];
  let cards = insheCardsOf(id);
  let scope = "";
  if (meta.flag === "dates" && insheDateScope() === "must" && cards.some(c => c.star)) { cards = cards.filter(c => c.star); scope = "must"; }
  insheQuiz = { ...meta, cards, scope };
  return insheQuiz;
}

function insheQueue() {
  // 🏛️ дати: у марафоні — лише складніший рівень (вписати дату самому)
  const all = insheQuiz.flag === "dates" ? insheQuiz.cards.map(insheTyped).filter(Boolean) : insheQuiz.cards.map(insheQuestion);
  shuffleArray(all);
  return all;
}
// скільки завдань у марафоні (для лічильника)
function insheTotal() {
  return insheQuiz.flag === "dates" ? insheQuiz.cards.filter(c => insheDateCanon(c.a)).length : insheQuiz.cards.length;
}

function insheQuestion(card) {
  if (insheQuiz && insheQuiz.flag === "dates" && insheDateLevel() === "type") { const t = insheTyped(card); if (t) return t; }
  const q = { ...card, options: [card.a, ...(card.w || [])] };
  shuffleArray(q.options);
  return q;
}

// ---------- 🏛️ Дати: вписати самому (складніший рівень) ----------
// Рівень тренування — localStorage `train_ist_level` (choose / type). Вписуються лише числові дати:
// рік, проміжок «1648–1657», кілька років «907, 911» (кома й пробіл ставляться самі), місяць → вписати рік (місяць — підказка).
const insheDateLevel = () => storageGet("train_ist_level") === "type" ? "type" : "choose";
const insheNormDash = s => String(s).replace(/\s*[–—-]\s*/g, "–").replace(/\s*,\s*/g, ", ").replace(/\s*р\.?(?=$|[–,\s])/g, "").trim();
function insheDateCanon(d) {
  const m = String(d).match(/^(.*?[а-яіїє][а-яіїє.]*)\s+(\d{3,4})$/i); // «травень 1648», «19–21 серпня 1991»
  if (m && !/ст\.|тис\.|н\.\s*е/.test(d)) return { ans: m[2], hint: m[1].trim() };
  const c = insheNormDash(d);
  return /^\d{1,4}(–\d{1,4})?(, \d{1,4}(–\d{1,4})?)*$/.test(c) ? { ans: c, hint: "" } : null;
}
function insheTyped(card) {
  const c = insheDateCanon(card.a);
  return c ? { ...card, typed: true, ans: c.ans, hint: c.hint } : null;
}

function renderInsheTyped(q) {
  questionEl.textContent = q.hint ? `Якого року? (${q.hint})` : "Впиши дату";
  hintEl.textContent = "Набирай на панелі; кома й пробіл ставляться самі";
  sentenceEl.hidden = false;
  sentenceEl.innerHTML = "";
  if (q.star) {
    const st = document.createElement("p");
    st.className = "exam-badge ist-star";
    st.textContent = "⭐ Треба знати напам'ять";
    sentenceEl.appendChild(st);
  }
  const line = document.createElement("p");
  line.className = "frazeo-sentence inshe-text";
  line.textContent = q.t;
  sentenceEl.appendChild(line);

  let val = "";
  const box = document.createElement("div");
  box.className = "ist-type";
  const screen = document.createElement("div");
  screen.className = "ist-screen";
  const pad = document.createElement("div");
  pad.className = "ist-pad";
  const show = () => { screen.textContent = val || "…"; screen.classList.toggle("empty", !val); };
  const press = k => {
    if (lock) return;
    if (k === "⌫") val = val.endsWith(", ") ? val.slice(0, -2) : val.slice(0, -1);
    else if (k === "–") { if (/\d$/.test(val)) val += "–"; }
    else if (k === ",") { if (/\d$/.test(val)) val += ", "; }
    else if (/\d/.test(k) && val.replace(/.*[–, ]/, "").length < 4) val += k;
    show();
  };
  const check = () => {
    if (lock || !val) return;
    const isCorrect = insheNormDash(val) === q.ans;
    handleAnswer(isCorrect, () => {
      screen.classList.add(isCorrect ? "ok" : "bad");
      pad.querySelectorAll("button").forEach(b => { b.disabled = true; });
      const right = document.createElement("p");
      right.className = "inshe-right";
      right.textContent = isCorrect ? `✓ ${q.a}` : `Правильно: ${q.a}`;
      box.after(right);
      insheAddNote({ ...q, r: q.r });
    }, { frazeo: true, text: `${q.t} — ${q.a}`, chosen: val });
  };
  ["1", "2", "3", "4", "5", "6", "7", "8", "9", "–", "0", ",", "⌫"].forEach(k => {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "ist-key" + (k === "⌫" ? " back" : /\d/.test(k) ? "" : " sign");
    b.textContent = k;
    b.addEventListener("click", () => press(k));
    pad.appendChild(b);
  });
  const ok = document.createElement("button");
  ok.type = "button";
  ok.className = "ist-key go";
  ok.textContent = "Перевірити";
  ok.addEventListener("click", check);
  pad.appendChild(ok);
  box.append(screen, pad);
  answersEl.appendChild(box);
  show();
  // з фізичної клавіатури теж можна (комп'ютер)
  box.tabIndex = -1;
  const onKey = e => {
    if (screens.game.hidden || currentQuestion !== q) { document.removeEventListener("keydown", onKey); return; }
    if (/^\d$/.test(e.key)) press(e.key);
    else if (e.key === "-" ) press("–");
    else if (e.key === ",") press(",");
    else if (e.key === "Backspace") press("⌫");
    else if (e.key === "Enter") check();
    else return;
    e.preventDefault();
    e.stopImmediatePropagation();
  };
  document.addEventListener("keydown", onKey, true);
}

// групи для тренування (groups.js): за полем g; велика група ділиться по ~30
function insheTrainGroups(quiz = insheQuiz) {
  if (!quiz) return [];
  const byG = new Map();
  quiz.cards.forEach(c => {
    // ⭐ лише обов'язкові: частини однієї теми («Русь-Україна (1)», «(2)»…) зливаються — обов'язкових у кожній мало
    const g = c.g || "Усі завдання";
    if (!byG.has(g)) byG.set(g, []);
    byG.get(g).push(c);
  });
  const out = [];
  const exam = quiz.cards.filter(insheExam);
  if (exam.length >= 3 && exam.length < quiz.cards.length) {
    out.push({ key: `train_inshe_${quiz.id}_💥`, name: "💥 Було на іспиті", items: exam });
  }
  // 🏛️ історія (власниця, 08.11.2026): не більше 12 дат/персоналій у групі, рівними частинами; тема — без старих «(1)/(2)»
  const hist = /^ist_/.test(quiz.id || "");
  if (hist) {
    const merged = new Map();
    byG.forEach((items, g) => { const b = g.replace(/ \(\d+\)$/, ""); if (!merged.has(b)) merged.set(b, []); merged.get(b).push(...items); });
    merged.forEach((items, g) => {
      const parts = splitEven(items, 12);
      parts.forEach((part, p) => {
        const name = (quiz.scope === "must" ? "⭐ " : "") + (parts.length > 1 ? `${g} (${p + 1})` : g);
        out.push({ key: `train_inshe_${quiz.id}_${name}`, name, items: part });
      });
    });
    return out;
  }
  byG.forEach((items, g) => {
    const parts = Math.max(1, Math.round(items.length / 30));
    const size = Math.ceil(items.length / parts);
    for (let p = 0; p < parts; p++) {
      const name = (quiz.scope === "must" ? "⭐ " : "") + (parts > 1 ? `${g} (${p + 1})` : g);
      out.push({ key: `train_inshe_${quiz.id}_${name}`, name, items: items.slice(p * size, (p + 1) * size) });
    }
  });
  return out;
}

// групи будь-якого тренажера за id (memory.js: відповіді з марафону й змішаних режимів → пам'ять групи)
const insheGroupsCache = {};
function insheGroupsOf(id) {
  if (!insheGroupsCache[id] && INSHE_META[id] && ["", "stress", "dates"].includes(INSHE_META[id].flag)) {
    insheGroupsCache[id] = insheTrainGroups({ id, cards: insheCardsOf(id) });
  }
  return insheGroupsCache[id] || [];
}

if (typeof TRAIN_GAMES !== "undefined") {
  TRAIN_GAMES.inshe = { groups: insheTrainGroups, prep: insheQuestion, render: () => renderInshe() };
  TRAIN_UNITS.inshe = ["завдання", "завдання", "завдань"];
}

// ---------- Мої помилки ----------
function insheErrors() {
  try { return JSON.parse(storageGet(INSHE_ERR_KEY) || "[]"); } catch (e) { return []; }
}
function insheNoteError(card, isCorrect) {
  if (!card || !card._src || card.komy || insheHist(card._src)) return; // історія — не в «Моїх помилках» мовних тренажерів
  const key = `${card._src}|${card._i}`;
  let list = insheErrors().filter(k => k !== key);
  if (!isCorrect) list.unshift(key);
  else if (insheQuiz.flag !== "errors") return; // правильна відповідь прибирає помилку лише в «Моїх помилках»
  storageSet(INSHE_ERR_KEY, JSON.stringify(list.slice(0, 400)));
}

// ---------- Показ картки ----------
function insheStress(html) {
  // «вИпадок» → підсвічена наголошена літера (лише в маленьких словах)
  return html.replace(/[а-яіїєґ']*[А-ЯІЇЄҐ][а-яіїєґ']*/g, w =>
    /[а-яіїєґ]/.test(w) ? w.replace(/[А-ЯІЇЄҐ]/g, ch => `<span class="stress">${ch.toLowerCase()}</span>`) : w);
}

function insheAddNote(q) {
  if (q.r) {
    const note = document.createElement("p");
    note.className = "frazeo-meaning";
    note.textContent = q.r;
    sentenceEl.appendChild(note);
  }
  if (insheExam(q)) {
    const src = document.createElement("p");
    src.className = "inshe-src";
    src.textContent = `📝 ${q.s}`;
    sentenceEl.appendChild(src);
  }
  if (q.x) { // 🏛️ історія: галерея портретів після відповіді
    const x = document.createElement("div");
    x.className = "ist-extra";
    x.innerHTML = q.x;
    sentenceEl.appendChild(x);
  }
  const next = document.createElement("button");
  next.className = "btn-secondary frazeo-next";
  next.textContent = "Далі →";
  next.addEventListener("click", skipWait);
  sentenceEl.appendChild(next);
}

function renderInshe() {
  let q = currentQuestion;
  if (q.typed) return renderInsheTyped(q);
  if (q.q && q.t === q.q) q = { ...q, t: "" }; // питання не повторюємо текстом картки
  { // текст картки — це саме питання (як на НМТ) → показуємо його замість стандартного
    const two = x => inshePlain(x).trim().split(/\s+/).slice(0, 2).join(" ").toLowerCase();
    const std = q.q || insheQuiz.prompt || "";
    if (q.t && std && two(q.t) === two(std)) q = { ...q, q: inshePlain(q.t), t: "" };
  }
  if (q.komy) return renderInsheKomy(q);
  if (q.input) return renderInsheInput(q);
  const mixed = !["", "stress", "dates"].includes(insheQuiz.flag) && INSHE_META[q._src];
  questionEl.textContent = q.q || (mixed ? INSHE_META[q._src].prompt : insheQuiz.prompt) || "Обери правильну відповідь";
  hintEl.textContent = `Підказка: можна відповідати клавішами 1–${q.options.length}`;
  if (mixed) {
    questionEl.textContent = `${INSHE_META[q._src].icon} ${questionEl.textContent}`;
  }

  sentenceEl.hidden = !q.t && !insheExam(q);
  sentenceEl.innerHTML = "";
  if (insheExam(q)) {
    const exam = document.createElement("p");
    exam.className = "exam-badge";
    exam.textContent = "💥 Було на іспиті";
    sentenceEl.appendChild(exam);
  }
  if (q.star) { // 🏛️ дата, яку треба знати напам'ять
    const st = document.createElement("p");
    st.className = "exam-badge ist-star";
    st.textContent = "⭐ Треба знати напам'ять";
    sentenceEl.appendChild(st);
  }
  let gap = null;
  if (q.t) {
    const line = document.createElement("p");
    line.className = "frazeo-sentence inshe-text";
    if (q.t.includes("___")) {
      const [before, after] = q.t.split("___");
      line.innerHTML = before;
      gap = document.createElement("span");
      gap.className = "address-gap";
      gap.textContent = "…";
      line.appendChild(gap);
      line.insertAdjacentHTML("beforeend", after || "");
    } else {
      line.innerHTML = q.t;
    }
    sentenceEl.appendChild(line);
  }

  answersEl.classList.add("frazeo-answers");
  const stressQuiz = INSHE_META[q._src] && INSHE_META[q._src].flag === "stress";
  q.options.forEach(opt => {
    const btn = document.createElement("button");
    btn.className = "answer frazeo-answer inshe-answer";
    btn.dataset.word = opt;
    btn.innerHTML = `<span class="inshe-opt">${stressQuiz ? insheStress(opt) : opt}</span>`; // одним рядком (кнопка — flex)
    btn.onclick = () => {
      const isCorrect = opt === q.a;
      insheNoteError(training && training.raw ? training.raw : q, isCorrect);
      handleAnswer(isCorrect, () => {
        if (gap) {
          gap.innerHTML = stressQuiz ? insheStress(q.a) : q.a;
          gap.classList.add(isCorrect ? "filled-ok" : "filled-fix");
        }
        Array.from(answersEl.children).forEach(b => {
          if (b.dataset.word === q.a) {
            b.classList.add("correct");
            if (!isCorrect) b.classList.add("blink");
          } else if (b !== btn) {
            b.classList.add("dim");
          }
        });
        if (!isCorrect) btn.classList.add("wrong");
        sentenceEl.hidden = false;
        insheAddNote(q);
      }, {
        frazeo: true,
        text: q.t && q.t.includes("___") ? inshePlain(q.t.replace("___", q.a)) : `${q.t ? inshePlain(q.t) + " — " : ""}${inshePlain(q.a)}`,
        chosen: inshePlain(opt)
      });
    };
    answersEl.appendChild(btn);
  });
}

// ⌨️ Виправ сам: слово з помилкою → учень набирає правильно
function insheNorm(s) {
  return inshePlain(s).toLowerCase().replace(/[’ʼ`´]/g, "'").replace(/\s+/g, " ").trim();
}
function renderInsheInput(q) {
  questionEl.textContent = INSHE_META.napysh.prompt;
  hintEl.textContent = "Набери слово й натисни Enter";
  sentenceEl.hidden = false;
  sentenceEl.innerHTML = "";
  const line = document.createElement("p");
  line.className = "frazeo-sentence inshe-text";
  line.innerHTML = `<s class="inshe-bad">${q.bad}</s>`;
  sentenceEl.appendChild(line);
  const hint = inshePlain(q.t || "").trim();
  if (hint && !/^як правильно\??$/i.test(hint)) { // підказка, про яке слово йдеться
    const h = document.createElement("p");
    h.className = "inshe-src";
    h.textContent = hint.replace(/^Як правильно\?\s*/i, "");
    sentenceEl.appendChild(h);
  }
  const src = document.createElement("p");
  src.className = "inshe-src";
  src.textContent = `${INSHE_META[q._src].icon} ${INSHE_META[q._src].name}`;
  sentenceEl.appendChild(src);

  const form = document.createElement("form");
  form.className = "inshe-input";
  form.innerHTML = '<input type="text" autocomplete="off" autocapitalize="off" spellcheck="false" aria-label="Правильне написання"><button class="btn-primary" type="submit">Перевірити</button>';
  const input = form.querySelector("input");
  form.addEventListener("submit", e => {
    e.preventDefault();
    if (lock || !input.value.trim()) return;
    const isCorrect = insheNorm(input.value) === insheNorm(q.a);
    insheNoteError(training && training.raw ? training.raw : q, isCorrect);
    handleAnswer(isCorrect, () => {
      input.disabled = true;
      input.classList.add(isCorrect ? "ok" : "bad");
      const right = document.createElement("p");
      right.className = "inshe-right";
      right.textContent = isCorrect ? `✓ ${inshePlain(q.a)}` : `Правильно: ${inshePlain(q.a)}`;
      form.after(right);
      insheAddNote(q);
    }, { frazeo: true, text: inshePlain(q.a), chosen: input.value.trim() });
  });
  answersEl.appendChild(form);
  setTimeout(() => input.focus(), 50);
}

// 🪶 Постав коми: проміжки між словами — кнопки; «Перевірити» порівнює з еталоном
function renderInsheKomy(q) {
  questionEl.textContent = INSHE_META.komy_tap.prompt;
  hintEl.textContent = "Коми можна ставити й знімати, потім — «Перевірити»";
  const words = q.sentence.split(" ");
  const need = new Set();
  const clean = words.map((w, i) => {
    if (/,$/.test(w) && i < words.length - 1) need.add(i);
    return w.replace(/,$/, "");
  });
  const put = new Set();
  sentenceEl.hidden = false;
  sentenceEl.innerHTML = "";
  if (insheExam(q)) {
    const exam = document.createElement("p");
    exam.className = "exam-badge";
    exam.textContent = "💥 Було на іспиті";
    sentenceEl.appendChild(exam);
  }
  const line = document.createElement("p");
  line.className = "frazeo-sentence komy-line";
  const gaps = [];
  clean.forEach((w, i) => {
    const word = document.createElement("span");
    word.className = "komy-word";
    word.textContent = w;
    line.appendChild(word);
    if (i < clean.length - 1) {
      const gap = document.createElement("button");
      gap.type = "button";
      gap.className = "komy-gap";
      gap.setAttribute("aria-label", "Поставити кому");
      gap.addEventListener("click", () => {
        if (lock) return;
        put.has(i) ? put.delete(i) : put.add(i);
        gap.classList.toggle("on", put.has(i));
        gap.textContent = put.has(i) ? "," : "";
      });
      gaps[i] = gap;
      line.appendChild(gap);
    }
  });
  sentenceEl.appendChild(line);
  const btn = document.createElement("button");
  btn.className = "btn-primary komy-check";
  btn.textContent = "Перевірити";
  btn.addEventListener("click", () => {
    if (lock) return;
    const isCorrect = need.size === put.size && [...need].every(i => put.has(i));
    const chosen = clean.map((w, i) => w + (put.has(i) ? "," : "")).join(" ");
    handleAnswer(isCorrect, () => {
      btn.hidden = true;
      gaps.forEach((g, i) => {
        if (!g) return;
        g.disabled = true;
        const want = need.has(i), has = put.has(i);
        g.textContent = want ? "," : has ? "," : "";
        g.className = "komy-gap" + (want && has ? " ok" : want ? " miss" : has ? " extra" : "");
      });
      insheAddNote(q);
    }, { frazeo: true, text: q.sentence, chosen: put.size ? chosen : "(без ком)" });
  });
  answersEl.appendChild(btn);
}

// ---------- Екрани: розділи й тренажери ----------
screens.inshe = (() => {
  const main = document.createElement("main");
  main.id = "inshe-screen";
  main.className = "screen";
  main.hidden = true;
  main.innerHTML = `
    <header class="top-bar">
      <button id="btn-inshe-back" class="icon-btn" aria-label="Назад">‹ Меню</button>
      <h2 id="inshe-title" class="screen-title">📂 Інше</h2>
    </header>
    <p id="inshe-sub" class="inshe-sub"></p>
    <div id="inshe-list" class="game-grid inshe-list"></div>
    <p class="test-note">🧪 Бета-версія тренажерів. Помітили неточність — напишіть @ukr_movych.</p>`;
  $("menu").after(main);
  return main;
})();

function insheTile(icon, name, sub, onClick, best) {
  const btn = document.createElement("button");
  btn.className = "game-tile";
  btn.innerHTML = `<span class="tile-icon" aria-hidden="true"></span><span class="tile-name"></span>`;
  btn.querySelector(".tile-icon").textContent = icon;
  const nm = btn.querySelector(".tile-name");
  nm.textContent = name;
  if (sub) {
    const s = document.createElement("span");
    s.className = "tile-sub";
    s.textContent = sub;
    nm.appendChild(s);
  }
  if (best) {
    const b = document.createElement("span");
    b.className = "mode-best";
    b.dataset.best = best;
    btn.appendChild(b);
  }
  btn.addEventListener("click", onClick);
  return btn;
}

function insheCount(id) {
  const m = INSHE_META[id];
  if (m.flag === "daily") return 10;
  if (m.flag === "errors") return insheErrors().length;
  if (m.flag === "blitz") return -1;
  return insheCardsOf(id).length;
}

async function showInsheSections(sectionId) {
  clearTimeout(nextTimer);
  training = null;
  questionToken++;
  insheStopBlitz();
  insheSection = sectionId || null;
  const list = $("inshe-list");
  showScreen("inshe");
  if (!insheLoading || !Object.keys(insheData).length) {
    list.innerHTML = '<p class="inshe-sub">Завантажуємо тренажери…</p>';
    await insheLoad();
  }
  list.innerHTML = "";
  const sec = INSHE_SECTIONS.find(s => s.id === insheSection);
  document.body.classList.toggle("ist-open", Boolean(sec && sec.hidden));
  if (!sec) {
    $("inshe-title").textContent = "📂 Інше";
    $("btn-inshe-back").textContent = "‹ Меню";
    const total = INSHE_SECTIONS.filter(s => !s.hidden).reduce((n, s) => n + s.quizzes.filter(([id]) => !INSHE_META[id].flag || insheCount(id) > 0 || INSHE_META[id].flag === "blitz").length, 0);
    $("inshe-sub").textContent = `${total} ${plural(total, "тренажер", "тренажери", "тренажерів")} за розділами НМТ`;
    INSHE_SECTIONS.filter(s => !s.hidden).forEach(s => {
      const n = s.quizzes.filter(([id]) => insheCount(id) !== 0).length;
      list.appendChild(insheTile(s.icon, s.name, `${n} ${plural(n, "тренажер", "тренажери", "тренажерів")}`, () => showInsheSections(s.id)));
    });
  } else {
    $("inshe-title").textContent = `${sec.icon} ${sec.name}`;
    $("btn-inshe-back").textContent = sec.hidden ? "‹ Меню" : "‹ Розділи";
    $("inshe-sub").textContent = sec.hidden ? "Дати й персоналії за програмою НМТ" : "";
    let lastHead = "";
    sec.quizzes.forEach(([id, icon, name]) => {
      const n = insheCount(id);
      if (n === 0 && INSHE_META[id].flag !== "errors") return; // карток ще немає
      // «Дати: …», «Персоналії: …» (власниця, 07.11.2026): спільне слово — заголовком групи, на кнопці — лише решта
      const m = sec.hidden && name.match(/^([^:]{2,20}):\s*(.+)$/);
      if (m) {
        if (m[1] !== lastHead) {
          const h = document.createElement("h3");
          h.className = "inshe-group-head";
          h.textContent = m[1];
          list.appendChild(h);
          lastHead = m[1];
        }
        name = m[2][0].toUpperCase() + m[2].slice(1);
      }
      const sub = INSHE_META[id].flag === "blitz" ? "Скільки встигнеш за хвилину? · 3 життя"
        : INSHE_META[id].flag === "daily" ? "Однакові для всіх сьогодні · з різних тем"
        : INSHE_META[id].flag === "errors" ? (n ? `${n} ${plural(n, "завдання", "завдання", "завдань")} з помилками` : "Поки що помилок немає 🎉")
        : insheTileSub(id, n);
      list.appendChild(insheTile(icon, name, sub, () => insheOpen(id), INSHE_META[id].flag === "daily" ? "" : `inshe_${id}`));
    });
  }
  renderBestScores();
}

// Підпис на кнопці тренажера (власниця, 07.11.2026): повна кількість (і в демо) + скільки груп —
// «103 дати · 8 груп», «52 персоналії · 4 групи», «57 завдань · 3 групи»; не «9 завдань», ніби тренажер бідний
function insheTileSub(id, n) {
  const C = window.INSHE_COUNTS || {}, H = (C.hist || {})[id];
  const full = Math.max(n, H ? H.n : (C.by || {})[id] || 0);
  let groups = 0;
  if (typeof DEMO !== "undefined" && DEMO && typeof DEMO_GROUPS !== "undefined" && DEMO_GROUPS.inshe && DEMO_GROUPS.inshe[id]) groups = DEMO_GROUPS.inshe[id].length;
  else try { groups = insheTrainGroups({ id, cards: insheCardsOf(id) }).length; } catch (e) { groups = 0; }
  const g = groups > 1 ? ` · ${groups} ${plural(groups, "група", "групи", "груп")}` : "";
  if (/^ist_(portrety|persony)$/.test(id)) {
    const p = H ? H.people : full;
    return `${p} ${plural(p, "персоналія", "персоналії", "персоналій")}${g}`;
  }
  if (INSHE_META[id].flag === "dates") {
    let must = 0;
    try { must = (H && H.must) || insheCardsOf(id).filter(c => c.star).length; } catch (e) { must = 0; }
    return must ? `⭐ ${must} обов'язкових · ${full} ${plural(full, "дата", "дати", "дат")} разом` : `${full} ${plural(full, "дата", "дати", "дат")}${g}`;
  }
  return `${full} ${plural(full, "завдання", "завдання", "завдань")}${g}`;
}

function insheOpen(id) {
  insheMakeQuiz(id);
  const f = insheQuiz.flag;
  if (!insheQuiz.cards.length) {
    if (f === "errors") alert("Тут збираються завдання, у яких ти помилився в інших тренажерах «Іншого». Поки що їх немає!") /* без смайлика: системне вікно (emoji.js) */;
    return;
  }
  if (f === "daily") { startGroupTraining("inshe", [insheTrainGroups()[0].key]); return; }
  if (f === "blitz") { insheStartBlitz(); return; }
  showModes("inshe");
  if (f === "dates") insheDateModes();
}

// 🏛️ Дати: на екрані режимів — перемикач рівня тренування й опис марафону (лише вписування)
function insheDateModes() {
  $("marathon-desc").textContent = `${insheTotal()} дат · вписуєш сам на панелі з цифрами · 3 життя`;
  let bar = document.getElementById("ist-level");
  if (!bar) {
    bar = document.createElement("div");
    bar.id = "ist-level";
    bar.className = "ist-level";
    $("group-list").before(bar);
  }
  bar.hidden = false;
  const lvl = insheDateLevel();
  bar.innerHTML = "";
  // ⭐ які дати: лише обов'язкові за програмою чи всі
  const all = insheCardsOf(insheQuiz.id), mustHere = all.filter(x => x.star).length;
  const HC = ((window.INSHE_COUNTS || {}).hist || {})[insheQuiz.id] || {}; // у демо карток лише перша група — підписи з повних чисел
  const must = Math.max(mustHere, HC.must || 0), allN = Math.max(all.length, HC.n || 0);
  if (mustHere && mustHere < all.length) {
    const sc = insheDateScope();
    const row = document.createElement("div");
    row.className = "ist-scope";
    [["must", `⭐ Лише обов'язкові · ${must}`], ["all", `📚 + додаткові · ${allN}`]].forEach(([k, label]) => {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "train-chip" + (sc === k ? " on" : "");
      b.textContent = label;
      b.addEventListener("click", () => { storageSet("train_ist_scope", k); insheOpen(insheQuiz.id); });
      row.appendChild(b);
    });
    const note = document.createElement("p");
    note.className = "ist-scope-note";
    note.textContent = sc === "must" ? "Дати з програми НМТ — їх треба знати напам'ять. Почни з них!" : "Обов'язкові (⭐) і додаткові дати — для глибшого знання.";
    bar.append(row, note);
  }
  [["choose", "🔘 Обрати з 5 дат"], ["type", "✍️ Вписати самому (складніше)"]].forEach(([k, label]) => {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "train-chip" + (lvl === k ? " on" : "");
    b.textContent = label;
    b.addEventListener("click", () => { storageSet("train_ist_level", k); insheDateModes(); });
    bar.appendChild(b);
  });
}

// ⚡ Блискавка: звичайний марафон з 3 життями + 60 секунд
function insheStopBlitz() {
  clearInterval(insheBlitzTimer);
  insheBlitzTimer = null;
  DELAYS.inshe = [1800, 4500];
}
function insheStartBlitz() {
  insheStopBlitz();
  DELAYS.inshe = [450, 1800];
  startGame("inshe");
  const end = Date.now() + 60000;
  const tick = () => {
    if (screens.game.hidden || currentGame !== "inshe" || !insheQuiz || insheQuiz.flag !== "blitz") { insheStopBlitz(); return; }
    const left = Math.max(0, Math.ceil((end - Date.now()) / 1000));
    $("test-note").hidden = false;
    $("test-note").textContent = `⚡ Залишилось ${left} с`;
    if (left <= 0) { insheStopBlitz(); clearTimeout(nextTimer); gameOver(); }
  };
  tick();
  insheBlitzTimer = setInterval(tick, 250);
}

$("btn-inshe-back").addEventListener("click", () => {
  const sec = INSHE_SECTIONS.find(s => s.id === insheSection);
  if (sec && !sec.hidden) showInsheSections(); else showMenu(); // «Історія України» — назад одразу в меню
});

// Кнопки спільних екранів: для «Іншого» — назад до розділу, «Ще раз» у Блискавці — знову з таймером
const insheBack = () => showInsheSections(insheQuiz ? INSHE_META[insheQuiz.id].sec : null);
$("btn-again").addEventListener("click", e => {
  if (currentGame !== "inshe" || !insheQuiz || insheQuiz.flag !== "blitz") return;
  e.stopImmediatePropagation();
  insheStartBlitz();
}, true);
$("btn-over-menu").addEventListener("click", e => {
  if (currentGame !== "inshe") return;
  e.stopImmediatePropagation();
  insheBack();
}, true);
$("btn-menu").addEventListener("click", e => {
  if (currentGame !== "inshe" || training || endless) return;
  e.stopImmediatePropagation();
  insheStopBlitz();
  insheBack();
}, true);

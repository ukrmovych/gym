// 🏋️ Обов'язкове ДЗ і повторення на платформі «Пробний НМТ» (репозиторій ukrmovych/testtest, update-121.sql).
// Учень курсу («🎓 Я на курсі Укрмовича», COURSE) — після кожного тренування групи (Наголоси, Іншомовні слова,
// Фразеологізми, Лексична помилка: словосполучення / речення) результат іде на платформу:
//   функція гри course-access {progress: [...]} → платформа gym_progress_put (за кодом учня з course_students).
// Результат групи: ok — правильні з першого разу, n — скільки пройдено, size — розмір групи, mem — пам'ять групи (memory.js:
// s — стабільність у днях, t — час), щоб платформа знала, коли пора повторити (так само, як «🔁 повтори» в грі).
// Платформа зараховує групу з ДЗ і повторення від 95 % (ok / size). Якщо зв'язку немає — черга в localStorage course_sync_q.
// Усередині тесту / кабінету платформи (embed.js) — ще й повідомлення gym-train сторінці платформи (щоб одразу оновила стан).
// Підключається після groups.js, memory.js, leks.js і course.js.
const COURSE_SYNC_GAMES = ["naholosy", "inshomovni", "frazeolohizmy", "slovospoluch", "leksychna"];

function courseSyncQueue() {
  try { return JSON.parse(localStorage.getItem("course_sync_q") || "[]"); } catch (e) { return []; }
}
function courseSyncStore(q) {
  try { localStorage.setItem("course_sync_q", JSON.stringify(q.slice(-60))); } catch (e) { /* немає сховища */ }
}

async function courseSyncFlush() {
  const q = courseSyncQueue();
  if (!q.length || typeof courseRequest !== "function") return;
  try {
    const r = await courseRequest({ progress: q, initData: typeof courseInitData === "function" ? courseInitData() : "" });
    if (r && (r.ok || r.error === "not_linked" || r.error === "bad_code")) courseSyncStore([]);
  } catch (e) { /* немає зв'язку — спробуємо наступного разу */ }
}

function courseSyncGroups(t) {
  const items = [];
  t.groups.forEach(g => {
    const ok = g.items.filter(x => t.results.get(x) === true).length;
    const seen = g.items.filter(x => t.results.has(x)).length;
    if (!seen) return;
    let mem = null;
    try { mem = typeof memRead === "function" ? memRead(g.key) : null; } catch (e) { mem = null; }
    items.push({ game: t.game, key: g.key, name: g.name, ok, n: seen, size: g.items.length, at: Date.now(),
      mem: mem && mem.s ? { s: mem.s, t: mem.t, a: mem.a } : null });
  });
  if (!items.length) return;
  if (typeof EMBED !== "undefined" && EMBED && typeof embedPost === "function") embedPost({ type: "gym-train", items });
  if (!COURSE || (typeof NEWBIE !== "undefined" && NEWBIE)) return;
  // той самий тренування може зберігатися кілька разів (дочитали групу) — у черзі лишається останній результат групи
  const q = courseSyncQueue().filter(x => !items.some(y => y.game === x.game && y.key === x.key && Math.abs(y.at - x.at) < 3 * 3600e3));
  courseSyncStore([...q, ...items]);
  courseSyncFlush();
}

// 🔄 Прогрес на всіх пристроях учня курсу (course-progress.sql; власниця, 07.11.2026): ключі train_…/best_… —
// на сервер (course-access {sync}) і назад, об'єднуючи так само, як функція (progPick: _mem — новіша, _acc — краща, числа — більше).
// Коли: на старті, після кожного тренування групи (за 3 с) і при згортанні гри.
function progPick(k, x, y) {
  const none = v => v == null || v === "null" || v === "";
  if (none(x)) return y;
  if (none(y)) return x;
  const js = v => { try { return JSON.parse(String(v)); } catch (e) { return null; } };
  if (k.endsWith("_mem")) { const a = js(x), b = js(y); return (Number(b && b.t) || 0) > (Number(a && a.t) || 0) ? y : x; }
  if (k.endsWith("_acc")) { const a = js(x) || {}, b = js(y) || {}; const ca = Number(a.c) || 0, cb = Number(b.c) || 0;
    return cb > ca || (cb === ca && (Number(b.n) || 0) > (Number(a.n) || 0)) ? y : x; }
  const nx = Number(x), ny = Number(y);
  if (isFinite(nx) && isFinite(ny)) return ny > nx ? y : x;
  return x;
}
const PROG_SKIP = /^train_(recent_|play_|view$|ist_level$|inshe_errors)|_tally$/;
function progLocal() {
  const out = {};
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (!/^(train_|best_)/.test(k) || PROG_SKIP.test(k)) continue;
      const v = localStorage.getItem(k);
      if (v != null && v !== "null" && v.length <= 600) out[k] = v;
    }
  } catch (e) { /* немає сховища */ }
  return out;
}
let progBusy = false, progTimer = null;
async function progSync() {
  if (!COURSE || (typeof NEWBIE !== "undefined" && NEWBIE) || progBusy || typeof courseRequest !== "function") return;
  progBusy = true;
  try {
    const r = await courseRequest({ sync: progLocal(), initData: typeof courseInitData === "function" ? courseInitData() : "" });
    if (r && r.ok && r.data && typeof r.data === "object") {
      let changed = 0;
      for (const [k, v] of Object.entries(r.data)) {
        if (PROG_SKIP.test(k)) continue;
        const cur = storageGet(k), pick = progPick(k, cur, v);
        if (pick != null && pick !== cur) { storageSet(k, String(pick)); changed++; }
      }
      // відкрито перелік груп — перемалювати плитки з новим прогресом
      if (changed && typeof renderTrainPicker === "function" && typeof modesGame !== "undefined" && screens && screens.modes && !screens.modes.hidden && typeof showModes === "function") {
        try { showModes(modesGame); } catch (e) { /* */ }
      }
    }
  } catch (e) { /* немає зв'язку — наступного разу */ }
  progBusy = false;
}
function progSoon(ms = 3000) { clearTimeout(progTimer); progTimer = setTimeout(progSync, ms); }
if (COURSE) {
  setTimeout(progSync, 2500);
  document.addEventListener("visibilitychange", () => { if (document.visibilityState === "hidden") progSync(); });
}

(function () {
  if (typeof saveTrainingResults !== "function") return;
  const orig = saveTrainingResults;
  saveTrainingResults = function () {
    const t = training;
    const before = t && t.saved;
    const r = orig.apply(this, arguments);
    try {
      if (t && t.game && t.saved !== before && COURSE_SYNC_GAMES.includes(t.game)) courseSyncGroups(t);
      if (t && t.saved !== before) progSoon();
    } catch (e) { /* синхронізація не має ламати гру */ }
    return r;
  };
  // те, що не дійшло минулого разу
  if (COURSE) setTimeout(courseSyncFlush, 4000);
})();

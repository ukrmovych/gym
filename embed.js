// Тренажер усередині тесту на платформі (/test/, репозиторій ukrmovych/testtest): …/gym/?embed=<гра>[&sub=<тренажер «Іншого»>][&t=<квиток>]
// Сторінка тесту показує гру у вікні (iframe, той самий сайт): учень тренується, а кожна відповідь іде
// повідомленням (postMessage) сторінці тесту → платформа зберігає й показує вчителю в «Наживо».
// Прогрес гри (рекорди, групи тренування) — той самий, що й у звичайній грі (спільне сховище браузера).
// Квиток t — від платформи: гра сама входить як «🎓 Я на курсі Укрмовича» (функція course-access, поле ticket)
// і запам'ятовує це (localStorage course_auto) — далі й у звичайній грі в цьому браузері вхід автоматичний (course.js).
// …/gym/?embed=list — перелік тренажерів для панелі вчителя (повідомлення gym-list), а за ним — групи тренування
//   ігор обов'язкового ДЗ платформи (gym-groups: naholosy, inshomovni, frazeolohizmy, slovospoluch, leksychna → [{key, name, size}]).
// &grp=<ключ групи> — одразу тренування цієї групи (ДЗ і повторення з кабінету платформи, testtest update-121.sql);
//   результат тренування — повідомлення gym-train (course-sync.js) і запис на платформі.
// Підключається ПЕРШИМ (до script.js): прапорець COURSE рахується під час завантаження script.js.
const EMBED = (() => {
  const q = new URLSearchParams(location.search);
  const game = q.get("embed");
  if (!game) return null;
  return { game, sub: q.get("sub") || "", ticket: q.get("t") || "", grp: q.get("grp") || "", list: game === "list" };
})();

if (EMBED) {
  // у тесті всі тренажери відкриті, як для учня курсу (статистика рахується, як в основній версії)
  try { if (!sessionStorage.getItem("course_access")) sessionStorage.setItem("course_access", JSON.stringify({ name: "", at: Date.now(), embed: 1 })); } catch (e) { /* немає сховища */ }
  document.documentElement.classList.add("gym-embed");
}

function embedPost(msg) {
  try { if (window.parent !== window) window.parent.postMessage(Object.assign({ src: "gym" }, msg), location.origin); } catch (e) { /* немає батьківської сторінки */ }
}

// куди повертатися замість головного меню: стартовий екран обраного тренажера
async function embedHome() {
  const g = EMBED.game;
  if (g === "inshe" && EMBED.sub) {
    await insheLoad();
    if (typeof INSHE_META !== "undefined" && INSHE_META[EMBED.sub]) { insheOpen(EMBED.sub); return; }
  }
  if (g === "inshe") { _embedShowInshe(); return; }
  if (g === "inshomovni") { showInshModes(); return; }
  if (g === "leksychna" && typeof showLeksModes === "function") { showLeksModes(); return; }
  if (["naholosy", "klychnyi", "frazeolohizmy", "slovospoluch", "chyslivnyky"].includes(g)) { showModes(g); return; }
  startGame(g);
}
let _embedShowInshe = null;

function embedList() {
  const games = GAMES.filter(g => !["nmttest", "leksychna", "inshe"].includes(g.id)).map(g => ({ id: g.id, name: g.name, icon: g.icon }));
  const inshe = typeof INSHE_SECTIONS === "undefined" ? [] : INSHE_SECTIONS.map(s => ({
    name: s.name, icon: s.icon,
    quizzes: s.quizzes.filter(x => x[4] !== "errors").map(([id, icon, name]) => ({ id, icon, name }))
  }));
  embedPost({ type: "gym-list", games, inshe });
  embedGroups();
}

// групи тренування для обов'язкового ДЗ платформи; дані PRO-ігор можуть з'явитися трохи пізніше — чекаємо до ~12 с
function embedGroups(tries = 0) {
  const ids = ["naholosy", "inshomovni", "frazeolohizmy", "slovospoluch", "leksychna"];
  const out = {};
  let empty = 0;
  ids.forEach(id => {
    let list = [];
    try { list = TRAIN_GAMES[id] ? TRAIN_GAMES[id].groups().filter(g => !g.topic && g.items && g.items.length) : []; } catch (e) { list = []; }
    if (!list.length) empty++;
    out[id] = list.map(g => ({ key: g.key, name: g.name, size: g.items.length }));
  });
  if (empty && tries < 12) { setTimeout(() => embedGroups(tries + 1), 1000); return; }
  // неповні дані (браузер без PRO: демо чи лише відкриті групи) — гру не надсилаємо, щоб платформа не прибрала задані групи
  if (window.GYM_DEMO) ["inshomovni", "frazeolohizmy"].forEach(id => { out[id] = []; });
  if (typeof slovoFreeLocked !== "undefined" && slovoFreeLocked.length) { out.slovospoluch = []; out.leksychna = []; }
  embedPost({ type: "gym-groups", groups: out });
}

// одразу тренування групи (&grp=): дані можуть довантажуватися — кілька спроб
function embedStartGroup(tries = 0) {
  const g = EMBED.game, cfg = typeof TRAIN_GAMES !== "undefined" && TRAIN_GAMES[g];
  let found = false;
  try { found = Boolean(cfg && cfg.groups().some(x => x.key === EMBED.grp)); } catch (e) { found = false; }
  if (found) { if (!(typeof gymHwOpen === "function" && gymHwOpen(g, EMBED.grp))) startGroupTraining(g, [EMBED.grp]); return; }
  if (tries < 10) { setTimeout(() => embedStartGroup(tries + 1), 800); return; }
  embedPost({ type: "gym-nogroup", game: g, grp: EMBED.grp });
}

// loader.js вантажить код гри по черзі вже ПІСЛЯ DOMContentLoaded — чекаємо, доки є все потрібне (07.11.2026)
function embedReady() {
  return typeof handleAnswer === "function" && typeof showScreen === "function" && typeof GAMES !== "undefined"
    && typeof TRAIN_GAMES !== "undefined" && typeof courseSyncGroups === "function" && typeof showLeksModes === "function" && typeof gymHwOpen === "function";
}
let embedWait = 0;
function embedWhenReady() {
  if (!embedReady() && embedWait++ < 300) { setTimeout(embedWhenReady, 100); return; }
  embedInit();
}
if (EMBED) document.addEventListener("DOMContentLoaded", embedWhenReady);
function embedInit() {
  if (EMBED.list) { embedList(); return; }
  // відповіді → сторінці тесту
  const origAnswer = handleAnswer;
  handleAnswer = function (isCorrect, ...rest) {
    const was = lock;
    origAnswer.call(this, isCorrect, ...rest);
    if (was) return;
    embedPost({ type: "gym-answer", ok: Boolean(isCorrect), game: currentGame,
      sub: currentGame === "inshe" && insheQuiz ? insheQuiz.id : "", train: Boolean(training) });
  };
  // будь-яке «‹ Меню» / «В меню» веде до стартового екрана тренажера, а не в меню гри
  // (частина кнопок тримає саму функцію showMenu, тож перехоплюємо показ екрана меню)
  const origShow = showScreen;
  showScreen = function (name) {
    if (name === "menu") { embedHome(); return; }
    origShow.call(this, name);
  };
  if (EMBED.game === "inshe" && EMBED.sub && typeof showInsheSections === "function") {
    _embedShowInshe = showInsheSections;
    showInsheSections = function () { embedHome(); };
  } else if (typeof showInsheSections === "function") _embedShowInshe = showInsheSections;
  embedHome();
  if (EMBED.grp) setTimeout(embedStartGroup, 50);
  // учень платформи → «Я на курсі Укрмовича» (без коду й Telegram)
  if (EMBED.ticket && typeof courseRequest === "function") {
    courseRequest({ ticket: EMBED.ticket }).then(r => {
      if (r && r.ok) {
        courseSave(r.name || "");
        try { localStorage.setItem("course_auto", "1"); } catch (e) { /* немає сховища */ }
        if (typeof renderCourseButton === "function") renderCourseButton();
      }
      embedPost({ type: "gym-ready", course: Boolean(r && r.ok) });
    }).catch(() => embedPost({ type: "gym-ready", course: false }));
  } else embedPost({ type: "gym-ready", course: false });
}

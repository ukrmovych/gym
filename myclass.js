// ================== 👥 Мій клас ==================
// Будь-хто створює клас (назва) і запрошує однокласників: посилання, QR або 6-значний код.
// Після кожної гри найкращий результат учня автоматично йде в таблицю кожного його класу
// (окремо для кожної гри). SQL і функції — classrooms.sql; адмін-перегляд — статистика, вкладка «Класи».
// Посилання-запрошення: сайт …/gym/?class=КОД, Telegram — t.me/ukrmovych_bot/battle?startapp=c_КОД.
// Список своїх класів кешуємо в localStorage «player_classes».

screens.myclass = $("myclass");
const myClassBody = $("myclass-body");
let myClasses = [];
try { myClasses = JSON.parse(storageGet("player_classes") || "[]"); } catch (e) { myClasses = []; }
let myClassCode = storageGet("player_class_open") || "";
let myClassGame = "naholosy";

function classRpc(name, args) {
  return lbRequest(`rpc/${name}`, { method: "POST", body: JSON.stringify(args) });
}

function classGames() {
  return GAMES.filter(g => g.status !== "soon");
}

function classInviteLink(code) {
  const tg = window.Telegram && Telegram.WebApp;
  if (tg && tg.initData && LB.telegramAppLink) return `${LB.telegramAppLink}?startapp=c_${code}`;
  return `${location.origin}${location.pathname}?class=${code}`;
}

const prettyCode = code => `${code.slice(0, 3)} ${code.slice(3)}`;

function classError(err) {
  const msg = String(err && err.message || "");
  if (err && err.status === 404) return "Функція класів ще не готова на сервері";
  if (/\blang\b/.test(msg)) return "Назва має бути українською мовою або латиницею";
  return /notfound/.test(msg) ? "Клас із таким кодом не знайдено. Перевір цифри"
    : /full/.test(msg) ? "У цьому класі вже немає місць"
    : /too many/.test(msg) ? "Сьогодні створено забагато класів. Спробуй завтра"
    : "Не вдалося. Перевір інтернет і спробуй ще раз";
}

async function refreshMyClasses() {
  if (!leaderboardEnabled) return myClasses;
  try {
    myClasses = await classRpc("my_classrooms", { p_player: getPlayerId() }) || [];
    storageSet("player_classes", JSON.stringify(myClasses));
  } catch (e) { /* лишаємо збережений список */ }
  return myClasses;
}

function el2(tag, cls, text) {
  const n = document.createElement(tag);
  if (cls) n.className = cls;
  if (text !== undefined) n.textContent = text;
  return n;
}

// ---------- Кнопка в меню ----------
// Перший тиждень після запуску кнопка стоїть угорі (одразу під «Наголосами») з позначкою «НОВЕ!»,
// потім сама повертається на звичне місце над «Турнірною таблицею».
const MYCLASS_NEW_UNTIL = new Date("2026-12-01T00:00:00+02:00"); // позначка «НОВЕ!» (власник, 01.11.2026)

function placeMyClassBtn() {
  const btn = $("btn-myclass"), list = $("game-list");
  const isNew = new Date() < MYCLASS_NEW_UNTIL;
  btn.classList.toggle("is-new", isNew);
  let badge = btn.querySelector(".badge-new");
  if (isNew) {
    if (!badge) {
      badge = el2("span", "badge badge-new", "НОВЕ!");
      btn.insertBefore(badge, btn.querySelector(".mode-arrow"));
    }
  } else if (badge) {
    badge.remove();
  }
  // Завжди одразу під головною грою — на колишньому місці відгуку (власник, 01.11.2026)
  // 08.11.2026: угорі трійка рівних плиток (.tile-top) — «Мій клас» одразу під нею
  // 08.11.2026 (власниця): «Мій клас» — унизу меню, одразу під «Мій план»
  const plan = $("btn-plan");
  if (plan) plan.after(btn); else if (list) list.after(btn);
}

// ---------- Екран «Мій клас» ----------
async function showMyClass(opts = {}) {
  showScreen("myclass");
  if (!leaderboardEnabled) {
    myClassBody.innerHTML = '<section class="card"><p class="online-note">Класи скоро запрацюють 🙂</p></section>';
    return;
  }
  if (opts.joinCode) { renderClassJoin(opts.joinCode); return; }
  myClassBody.innerHTML = '<section class="card"><p class="leaders-status">Завантажую…</p></section>';
  await refreshMyClasses();
  if (!myClasses.length || opts.add) renderClassStart(Boolean(myClasses.length));
  else renderClassTable();
}

// Немає класу: приєднатися (код) або створити
function renderClassStart(canBack) {
  myClassBody.innerHTML = "";
  const name = storageGet("player_name") || "";

  // Коротко: що це за режим і чим він крутий
  if (!canBack) {
    const intro = el2("section", "card class-intro");
    intro.append(el2("h3", "class-intro-title", "👥 Змагайся з однокласниками!"));
    const ul = el2("ul", "class-intro-list");
    [["🏆", "Своя таблиця рекордів — лише для твого класу"],
     ["⚡", "Нічого не треба надсилати: просто грай, рекорди потрапляють у таблицю самі"],
     ["🎮", "Окремо по кожній грі — видно, хто король наголосів, а хто — тесту НМТ"],
     ["📨", "Друзів кличеш одним посиланням або QR-кодом"]].forEach(([icon, text]) => {
      const li = el2("li");
      li.append(el2("span", "class-intro-icon", icon), el2("span", "", text));
      ul.appendChild(li);
    });
    intro.append(ul, el2("p", "class-intro-cta", "Приєднайся за кодом від друга або створи свій клас 👇"));
    myClassBody.appendChild(intro);
  }

  const join = el2("section", "card class-card");
  join.append(el2("h3", "class-h", "Приєднатися до класу"),
    el2("p", "class-note", "Введи 6 цифр, які дав учитель чи однокласник (або просто відкрий їхнє посилання)."));
  const codeIn = Object.assign(el2("input", "class-code-input"), { type: "text", inputMode: "numeric", maxLength: 7, placeholder: "000 000", autocomplete: "off" });
  const nameIn1 = Object.assign(el2("input", "class-input"), { type: "text", maxLength: 20, placeholder: "Твоє ім'я", value: name, autocomplete: "nickname" });
  const st1 = el2("p", "submit-status");
  const joinBtn = el2("button", "btn-primary", "Приєднатися");
  joinBtn.addEventListener("click", () => doJoin(codeIn.value.replace(/\D/g, ""), nameIn1.value, st1, joinBtn));
  join.append(codeIn, nameIn1, joinBtn, st1);

  const create = el2("section", "card class-card");
  create.append(el2("h3", "class-h", "Створити свій клас"),
    el2("p", "class-note", "Для вчителя чи будь-кого: отримаєш код і посилання для однокласників."));
  const classIn = Object.assign(el2("input", "class-input"), { type: "text", maxLength: 40, placeholder: "Назва, напр. 11-Б, ліцей №5", autocomplete: "off" });
  const nameIn2 = Object.assign(el2("input", "class-input"), { type: "text", maxLength: 20, placeholder: "Твоє ім'я", value: name, autocomplete: "nickname" });
  const st2 = el2("p", "submit-status");
  const createBtn = el2("button", "btn-secondary", "Створити клас");
  createBtn.addEventListener("click", () => doCreate(classIn.value, nameIn2.value, st2, createBtn));
  create.append(classIn, nameIn2, createBtn, st2);

  myClassBody.append(join, create);
  if (canBack) {
    const back = el2("button", "btn-back class-back", "‹ До моїх класів");
    back.addEventListener("click", () => renderClassTable());
    myClassBody.appendChild(back);
  }
}

// Відкрили посилання-запрошення: назва класу + ім'я → «Приєднатися»
async function renderClassJoin(code) {
  myClassBody.innerHTML = '<section class="card"><p class="leaders-status">Шукаю клас…</p></section>';
  let info = null;
  try { info = await classRpc("classroom_info", { p_code: code }); } catch (e) { info = null; }
  if (!info) {
    myClassBody.innerHTML = "";
    const card = el2("section", "card class-card");
    card.append(el2("h3", "class-h", "Клас не знайдено"), el2("p", "class-note", "Можливо, у посиланні помилка. Спробуй ввести код вручну."));
    myClassBody.appendChild(card);
    renderClassStart(false);
    myClassBody.prepend(card);
    return;
  }
  if (myClasses.some(c => c.code === code)) {
    myClassCode = code;
    renderClassTable();
    return;
  }
  myClassBody.innerHTML = "";
  const card = el2("section", "card class-card class-invite");
  card.append(el2("div", "over-emoji", "👥"), el2("h3", "class-h", `Клас «${info.name}»`),
    el2("p", "class-note", `Тебе запрошують змагатися з однокласниками. Учнів у класі: ${info.members}.`));
  const nameIn = Object.assign(el2("input", "class-input"), { type: "text", maxLength: 20, placeholder: "Як тебе звати?", value: storageGet("player_name") || "", autocomplete: "nickname" });
  const st = el2("p", "submit-status");
  const btn = el2("button", "btn-primary", "Приєднатися");
  btn.addEventListener("click", () => doJoin(code, nameIn.value, st, btn));
  card.append(nameIn, btn, st);
  myClassBody.appendChild(card);
  nameIn.focus();
}

function checkClassName(raw, status) {
  const name = normalizeName(raw);
  const problem = checkName(name);
  if (problem) { status.textContent = problem; status.className = "submit-status bad"; return null; }
  return name;
}

async function doJoin(code, rawName, status, btn) {
  if (!/^\d{6}$/.test(code)) { status.textContent = "Код — це 6 цифр"; status.className = "submit-status bad"; return; }
  const name = checkClassName(rawName, status);
  if (!name) return;
  btn.disabled = true;
  status.textContent = "Приєднуюся…"; status.className = "submit-status";
  try {
    await classRpc("join_classroom", { p_player: getPlayerId(), p_code: code, p_name: name });
    storageSet("player_name", name);
    track("class_join");
    myClassCode = code;
    await syncBestToClasses();
    await showMyClass();
  } catch (err) {
    btn.disabled = false;
    status.textContent = classError(err); status.className = "submit-status bad";
  }
}

async function doCreate(rawClass, rawName, status, btn) {
  const cls = String(rawClass || "").replace(/\s+/g, " ").trim();
  if (cls.length < 2) { status.textContent = "Назва класу — хоча б 2 символи"; status.className = "submit-status bad"; return; }
  if (isRussianText(cls)) { status.textContent = "Назва має бути українською мовою або латиницею"; status.className = "submit-status bad"; return; }
  const name = checkClassName(rawName, status);
  if (!name) return;
  btn.disabled = true;
  status.textContent = "Створюю…"; status.className = "submit-status";
  try {
    const code = await classRpc("create_classroom", { p_player: getPlayerId(), p_class: cls, p_name: name });
    storageSet("player_name", name);
    track("class_create");
    myClassCode = code;
    await syncBestToClasses();
    await showMyClass();
  } catch (err) {
    btn.disabled = false;
    status.textContent = classError(err); status.className = "submit-status bad";
  }
}

// Клас вибрано: код, запрошення, таблиця по іграх
async function renderClassTable() {
  if (!myClasses.length) { renderClassStart(false); return; }
  if (!myClasses.some(c => c.code === myClassCode)) myClassCode = myClasses[0].code;
  storageSet("player_class_open", myClassCode);
  const cls = myClasses.find(c => c.code === myClassCode);
  myClassBody.innerHTML = "";

  // перемикач класів
  const chips = el2("div", "topic-picker class-chips");
  myClasses.forEach(c => {
    const b = el2("button", "topic-chip" + (c.code === myClassCode ? " on" : ""), c.name);
    b.addEventListener("click", () => { myClassCode = c.code; renderClassTable(); });
    chips.appendChild(b);
  });
  const add = el2("button", "topic-chip", "+ Ще клас");
  add.addEventListener("click", () => renderClassStart(true));
  chips.appendChild(add);
  myClassBody.appendChild(chips);

  // картка класу із запрошенням
  const head = el2("section", "card class-card");
  head.append(el2("h3", "class-h", cls.name), el2("p", "class-note", `Учнів: ${cls.members} · ти тут як ${cls.my_name}`));
  const codeRow = el2("p", "class-code", prettyCode(cls.code));
  const actions = el2("div", "class-actions");
  const share = el2("button", "btn-secondary", "📨 Запросити");
  share.addEventListener("click", () => shareClass(cls));
  const qrBtn = el2("button", "btn-secondary", "▦ QR");
  const qrBox = el2("div", "class-qr");
  qrBox.hidden = true;
  qrBtn.addEventListener("click", async () => {
    if (!qrBox.hidden) { qrBox.hidden = true; return; }
    try {
      await loadQrLib();
      const qr = qrcode(0, "M");
      qr.addData(classInviteLink(cls.code));
      qr.make();
      qrBox.innerHTML = qr.createSvgTag({ cellSize: 4, margin: 4, scalable: true });
      qrBox.hidden = false;
    } catch (e) { qrBox.textContent = "Не вдалося показати QR"; qrBox.hidden = false; }
  });
  actions.append(share, qrBtn);
  head.append(el2("p", "class-note", "Код класу:"), codeRow, actions, qrBox);
  myClassBody.appendChild(head);

  // таблиця
  const table = el2("section", "card");
  const tabs = el2("div", "tabs class-tabs");
  const games = classGames();
  if (!games.some(g => g.id === myClassGame)) myClassGame = games[0].id;
  games.forEach(g => {
    const t = el2("button", "tab" + (g.id === myClassGame ? " active" : ""), `${g.icon} ${g.name}`);
    t.addEventListener("click", () => { myClassGame = g.id; renderClassTable(); });
    tabs.appendChild(t);
  });
  // вибрана гра — у полі зору (панель гортається вбік)
  requestAnimationFrame(() => {
    const on = tabs.querySelector(".tab.active");
    if (on) tabs.scrollLeft = on.offsetLeft - tabs.offsetLeft - 8;
  });
  const list = el2("ol", "leaders-list");
  const status = el2("p", "leaders-status", "Завантажую…");
  table.append(tabs, list, status);
  myClassBody.appendChild(table);

  const leave = el2("button", "class-leave", "Вийти з цього класу");
  leave.addEventListener("click", async () => {
    if (!confirm(`Вийти з класу «${cls.name}»? Твої результати зникнуть з його таблиці.`)) return;
    try {
      await classRpc("leave_classroom", { p_player: getPlayerId(), p_code: cls.code });
      myClassCode = "";
      await showMyClass();
    } catch (e) { alert(classError(e)); }
  });
  myClassBody.appendChild(leave);

  try {
    const rows = await classRpc("classroom_table", { p_player: getPlayerId(), p_code: cls.code, p_game: myClassGame });
    list.innerHTML = "";
    rows.forEach(r => {
      const li = el2("li", r.me ? "me" : "");
      const name = el2("span", "name", r.name);
      const points = el2("span", "points", r.score == null ? "—" : String(r.score));
      // ⏱ скільки часу учень провів у цій грі (game-time.js)
      if (r.seconds && typeof formatGameTime === "function") name.append(el2("span", "class-time", `⏱ ${formatGameTime(r.seconds)}`));
      li.append(name, points);
      list.appendChild(li);
    });
    status.textContent = rows.some(r => r.score != null) ? "" : "Ще ніхто не грав у цю гру. Зіграй першим — результат з'явиться тут автоматично!";
  } catch (e) {
    status.textContent = "Не вдалося завантажити таблицю";
  }
}

function shareClass(cls) {
  const link = classInviteLink(cls.code);
  const text = `Приєднуйся до нашого класу «${cls.name}» у НМТ-качалці! Код класу: ${cls.code}`;
  track("class_share");
  const tg = window.Telegram && Telegram.WebApp;
  if (tg && tg.initData && typeof tg.openTelegramLink === "function") {
    tg.openTelegramLink(`https://t.me/share/url?url=${encodeURIComponent(link)}&text=${encodeURIComponent(text)}`);
  } else if (navigator.share) {
    navigator.share({ text, url: link }).catch(() => {});
  } else if (navigator.clipboard) {
    navigator.clipboard.writeText(`${text}\n${link}`).then(() => alert("Посилання скопійовано — надішли його однокласникам"));
  }
}

// ---------- Результати ----------
// Після гри — найкращий результат у таблиці всіх класів гравця (без спецтем і гри без обмеження життів)
async function submitClassScore(game, value) {
  if (!leaderboardEnabled || !value || value < 1 || !myClasses.length) return 0;
  try {
    return await classRpc("submit_classroom_score", { p_player: getPlayerId(), p_game: game, p_score: value });
  } catch (e) { return 0; }
}

// Після вступу до класу — переносимо вже наявні рекорди цього пристрою
async function syncBestToClasses() {
  await refreshMyClasses();
  for (const g of classGames()) {
    const best = g.id === "frazeolohizmy" ? 0 : getBest(g.id); // у фразеологізмах рекорд окремо для частин
    if (best > 0) await submitClassScore(g.id, best);
  }
}

function classOnGameOver(game, value, opts = {}) {
  if (typeof courseOnScore === "function" && !opts.endless && !opts.topic) courseOnScore(game, value); // 🎓 course.js
  const note = $("over-class");
  note.hidden = true;
  if (opts.endless || opts.topic || !myClasses.length || !(value > 0)) return;
  submitClassScore(game, value).then(n => {
    if (!n) return;
    const names = myClasses.map(c => `«${c.name}»`).join(", ");
    note.textContent = `👥 Результат у таблиці класу ${names}`;
    note.hidden = false;
  });
}

// ---------- Посилання-запрошення ----------
function classJoinCode() {
  const query = new URLSearchParams(location.search);
  if (/^\d{6}$/.test(query.get("class") || "")) return query.get("class");
  const hash = new URLSearchParams(location.hash.slice(1));
  const tgData = hash.get("tgWebAppData");
  const tg = window.Telegram && Telegram.WebApp;
  const start = query.get("tgWebAppStartParam") || hash.get("tgWebAppStartParam")
    || (tgData ? new URLSearchParams(tgData).get("start_param") : "")
    || (tg && tg.initDataUnsafe && tg.initDataUnsafe.start_param) || "";
  const m = /^c_(\d{6})$/.exec(start);
  return m ? m[1] : "";
}

$("btn-myclass").addEventListener("click", () => showMyClass());
$("btn-myclass-back").addEventListener("click", showMenu);
$("btn-leaders-class").addEventListener("click", () => {
  myClassGame = leadersGame || "naholosy";
  showMyClass();
});
window.addEventListener("load", () => {
  refreshMyClasses();
  const code = classJoinCode();
  if (code) showMyClass({ joinCode: code });
});

placeMyClassBtn();

// ================== Онлайн-режими ==================
// Кожен гравець на своєму пристрої; зв'язок — Supabase Realtime (broadcast).
// Хто створив кімнату (ведучий), той керує грою: обирає слова, рахує бали.
//
//  ⚔️ duel   — удвох: однакове слово, бал отримує той, хто відповів правильно і швидше
//  ⏱ sprint — 2–10 гравців: за 60 секунд якомога більше правильних відповідей
//  🏫 class  — учитель веде гру (не грає), учні відповідають, бали за правильність і швидкість
//
// Тема (online.game) — див. ONLINE_GAMES: наголоси, фразеологізми, кличний відмінок, словосполучення.
// Нова тема = новий запис в ONLINE_GAMES, і в неї одразу є всі три режими.

const ONLINE_MODES = {
  duel: { title: "⚔️ Онлайн-дуель", max: 2, hostPlays: true },
  sprint: { title: "⏱ Спринт 60 секунд", max: 10, hostPlays: true },
  class: { title: "🏫 Гра для класу", max: 60, hostPlays: false }
};

const ONLINE_DUEL_TARGET = 10;

// Теми. card: true — питання «картка» (речення з пропуском + варіанти), інакше — слово з наголосами.
//   duelLimit / classLimit — мс на питання, duelPause — пауза після раунду дуелі,
//   sprint — секунд у спринті, penalty — секунд штрафу за помилку, unit — як називати питання.
const ONLINE_GAMES = {
  naholosy: {
    label: "🗣️ Гра: Наголоси", what: "в наголоси", unit: "Слово", next: "Наступне слово",
    card: false, duelLimit: 12000, duelPause: 2600, sprint: 60, penalty: 2, classLimit: 15000,
    pool: () => naholosyData
  },
  frazeolohizmy: {
    label: "💬 Гра: Фразеологізми", what: "у фразеологізми", unit: "Речення", next: "Наступне речення",
    card: true, duelLimit: 25000, duelPause: 4500, sprint: 120, penalty: 3, classLimit: 30000,
    pool: () => frazeoSentences,
    // online.topic у «Фразеологізмах» — частина ("1", "2" або "" — обидві), її обирає ведучий
    makeCard: (row, rand) => makeFrazeoCard(row, false, rand, online ? online.topic || "" : frazeoPart)
  },
  klychnyi: {
    label: "📣 Гра: Кличний відмінок", what: "у кличний відмінок", unit: "Звертання", next: "Наступне звертання",
    card: true, duelLimit: 15000, duelPause: 3000, sprint: 60, penalty: 2, classLimit: 20000,
    // онлайн — лише перші 3 рівні: найуживаніші слова й слова із ЗНО/НМТ
    // з вибраними групами (groups.js) — усі слова цих груп, інакше найуживаніші 300
    pool: () => (online && online.groups ? klychnyiData : klychnyiData.slice(0, 300)),
    makeCard: (row, rand) => {
      const r = resolveKlychnyi(row, rand);
      return { text: `${klychnyiPrefix(r[0])} ___!`, answer: r[2], alts: r.alts, options: klychnyiOptions(r, rand) };
    }
  },
  slovospoluch: {
    label: "🧩 Гра: Словосполучення", what: "у словосполучення", unit: "Словосполучення", next: "Наступне словосполучення",
    card: true, duelLimit: 10000, duelPause: 4000, sprint: 60, penalty: 2, classLimit: 15000,
    // картки й вибір груп — slovospoluch.js; online.topic — id вибраних груп через кому ("" — усі)
    pool: () => SLOVO_CARDS,
    makeCard: c => slovoOnlineCard(c)
  }
};

function gameKey() {
  const g = online ? online.game : modesGame;
  return ONLINE_GAMES[g] ? g : "naholosy";
}

function G() {
  return ONLINE_GAMES[gameKey()];
}

// Правильні відповіді картки (у «Кличному» буває дві: Олеже / Олегу)
function cardCorrect(card) {
  return [card.answer, ...(card.alts || [])];
}

// Картка для надсилання гравцям (лише потрібні поля)
function onlineCard(idx, rand) {
  const c = G().makeCard(G().pool()[idx], rand);
  return { text: c.text, answer: c.answer, meaning: c.meaning || "", alts: c.alts || [], options: c.options, ...(c.pair ? { pair: c.pair } : {}), ...(c.leks ? { leks: c.leks } : {}), _i: idx }; // _i — для пам'яті (memory.js)
}

// Номери питань для гри: усі, лише слова спецтеми («Наголоси») або речення вибраної частини («Фразеологізми»)
function poolIndices() {
  const pool = G().pool();
  // groups.js: вибрані ведучим групи (online.groups — номери груп через кому)
  const fit = online && online.groups && typeof playFilter === "function" ? playFilter(gameKey(), online.groups) : null;
  if (fit) {
    const base = poolIndicesBase(pool);
    const picked = base.filter(i => fit(pool[i]));
    if (picked.length) return picked;
    const any = pool.map((x, i) => (fit(x) ? i : -1)).filter(i => i >= 0);
    if (any.length) return any;
  }
  return poolIndicesBase(pool);
}

function poolIndicesBase(pool) {
  if (gameKey() === "slovospoluch") return slovoCardIndices(online && online.topic ? online.topic.split(",") : []);
  if (online && online.topic && gameKey() === "frazeolohizmy") {
    return pool.map((row, i) => (frazeoInPart(FRAZEO_BY_ID[row[0]], online.topic) ? i : -1)).filter(i => i >= 0);
  }
  const words = online && online.topic && gameKey() === "naholosy" ? TOPIC_WORDS[online.topic] : null;
  if (words) {
    const chosen = new Set(words);
    return pool.map((q, i) => (chosen.has(q) ? i : -1)).filter(i => i >= 0);
  }
  return pool.map((_, i) => i);
}

function modeTitle(mode) {
  if (mode === "sprint") return G().sprint === 120 ? "⏱ Спринт 2 хвилини" : "⏱ Спринт 60 секунд";
  return ONLINE_MODES[mode].title;
}
const SUPABASE_JS = "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.45.4/dist/umd/supabase.js";

screens.online = $("online");
const onlineBody = $("online-body");
// Скрипт Telegram вантажиться асинхронно, тому беремо WebApp щоразу заново
const tgWebApp = () => window.Telegram && window.Telegram.WebApp;
let online = null;
let supabaseClient = null;

// Ідентифікатор гравця в онлайн-грі — свій для кожної вкладки/підключення
const ONLINE_ID = Math.random().toString(36).slice(2, 10) + Date.now().toString(36);

// ---------- Повернення в гру ----------
// Учень вийшов (назад, закрив браузер, зник інтернет) — телефон пам'ятає кімнату й «місце»
// в ній; при повторному вході з тим самим кодом ведучий упізнає його й пускає грати далі.
const SEAT_KEY = "online_seat";
const SEAT_TTL = 3 * 60 * 60 * 1000; // 3 години

function getSeat() {
  try {
    const seat = JSON.parse(storageGet(SEAT_KEY) || "null");
    return seat && Date.now() - seat.at < SEAT_TTL ? seat : null;
  } catch (e) { return null; }
}

function saveSeat(code, id, name) {
  storageSet(SEAT_KEY, JSON.stringify({ code, id, name, at: Date.now() }));
}

function clearSeat() {
  storageSet(SEAT_KEY, "");
  renderRejoin();
}

function playerIdFor(code) {
  const seat = getSeat();
  return seat && seat.code === code ? seat.id : ONLINE_ID;
}

// ---------- Учитель теж може повернутися ----------
// Гра для класу живе на пристрої вчителя, тож усе, що треба для продовження (учні, бали,
// поточне питання), постійно зберігаємо. Вихід або закриття сторінки гру не завершує.
const HOST_KEY = "online_host";

function saveHostState() {
  if (!online || !online.isHost || online.mode !== "class") return;
  const { mode, game, topic, code, me, players, phase, classRounds, seed, startedAt, cls } = online;
  storageSet(HOST_KEY, JSON.stringify({ mode, game, topic, code, me, players, phase, classRounds, seed, startedAt, cls, at: Date.now() }));
}

function getHostState() {
  try {
    const st = JSON.parse(storageGet(HOST_KEY) || "null");
    return st && Date.now() - st.at < SEAT_TTL ? st : null;
  } catch (e) { return null; }
}

function clearHostState() {
  storageSet(HOST_KEY, "");
}

async function resumeHost() {
  const st = getHostState();
  if (!st) return renderRejoin();
  showScreen("online");
  setOnline("Повертаємось у гру", el("section", { class: "card online-card" },
    el("p", { class: "online-note" }, `Відновлюю кімнату ${st.code}…`)));
  try {
    online = { ...st, isHost: true, rt: null, current: null };
    delete online.at;
    online.rt = await connectRoom(st.code, handleMessage);
  } catch (e) {
    online = null;
    setOnline("Онлайн", el("section", { class: "card online-card" },
      el("p", { class: "online-note" }, "Не вдалося підключитися. Перевір інтернет і спробуй ще раз."),
      el("button", { class: "btn-primary", on: { click: resumeHost } }, "Спробувати ще раз"),
      el("button", { class: "btn-secondary", on: { click: showMenu } }, "У меню")));
    return;
  }
  if (online.phase === "playing") setCloseGuard(true);
  broadcastState(); // учні бачать, що вчитель повернувся
  const c = online.cls;
  if (online.phase === "lobby" || !c) { renderLobby(); return; }
  if (c.lastEnd) { emit("end", c.lastEnd); return; }
  if (!c.lastQ) return;
  // Екран учителя — як був; кожному учневі — поточне питання (з його відповіддю, якщо вже дав)
  const elapsed = Date.now() - c.lastQ.sentAt;
  classMessage("q", { ...c.lastQ, elapsed });
  online.players.forEach(p => syncPlayer(p.id));
  if (c.resolved && c.lastR) classMessage("r", c.lastR);
  else {
    clearTimeout(online.timer);
    online.timer = setTimeout(resolveClassRound, Math.max(0, classLimit() + 1000 - elapsed));
  }
}

// Кнопка «Повернутися в гру» в меню (учневі — до своєї кімнати, учителеві — до своєї гри)
function renderRejoin() {
  const btn = $("btn-rejoin");
  if (!btn) return;
  const host = getHostState();
  const seat = getSeat();
  btn.hidden = Boolean(online) || (!host && !seat);
  if (host) {
    $("rejoin-label").textContent = "Повернутися до гри (ви ведучий) · кімната";
    $("rejoin-code").textContent = host.code;
  } else if (seat) {
    $("rejoin-label").textContent = "Повернутися в гру · кімната";
    $("rejoin-code").textContent = seat.code;
  }
}

function rejoinClick() {
  if (getHostState()) resumeHost();
  else rejoinSeat();
}

async function rejoinSeat() {
  const seat = getSeat();
  if (!seat) return renderRejoin();
  showScreen("online");
  setOnline("Повертаємось у гру", el("section", { class: "card online-card" },
    el("p", { class: "online-note" }, `Підключаюся до кімнати ${seat.code}…`)));
  try {
    await joinRoom(seat.code, seat.name);
  } catch (e) {
    clearSeat();
    setOnline("Онлайн", el("section", { class: "card online-card" },
      el("p", { class: "online-note" }, e.message === "notfound"
        ? "Цієї кімнати вже немає: гра, мабуть, закінчилась."
        : "Не вдалося повернутися в гру. Перевір інтернет або введи код ще раз."),
      el("button", { class: "btn-primary", on: { click: showMenu } }, "У меню")));
  }
}

// Під час гри — попередження перед закриттям (і в Telegram, і в браузері)
function setCloseGuard(on) {
  const tg = tgWebApp();
  try {
    if (tg && tg.initData) on ? tg.enableClosingConfirmation() : tg.disableClosingConfirmation();
  } catch (e) { /* старий Telegram */ }
}

window.addEventListener("beforeunload", e => {
  if (online && online.phase === "playing") {
    e.preventDefault();
    e.returnValue = "";
  }
});

// ---------- Допоміжне ----------

function el(tag, props = {}, ...children) {
  const node = document.createElement(tag);
  Object.entries(props).forEach(([key, value]) => {
    if (key === "class") node.className = value;
    else if (key === "on") Object.entries(value).forEach(([ev, fn]) => node.addEventListener(ev, fn));
    else if (key in node) node[key] = value;
    else node.setAttribute(key, value);
  });
  children.flat().forEach(child => {
    if (child === null || child === undefined || child === false) return;
    node.append(child instanceof Node ? child : String(child));
  });
  return node;
}

function makeRoomCode() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 5; i++) code += chars[Math.floor(Math.random() * chars.length)];
  return code;
}

// Однакова «випадковість» для всіх гравців (з одного зерна)
function seededRandom(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6D2B79F5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function seededShuffle(array, rand) {
  const copy = [...array];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function correctWords(q) {
  return Array.isArray(q.correct) ? q.correct : [q.correct];
}

function formatSeconds(ms) {
  return `${(ms / 1000).toFixed(1).replace(".", ",")} с`;
}

function defaultName() {
  const tgApp = tgWebApp();
  const tgUser = tgApp && tgApp.initDataUnsafe && tgApp.initDataUnsafe.user;
  return storageGet("player_name") || (tgUser && tgUser.first_name) || "";
}

function webInviteLink(code) {
  return `${location.origin}${location.pathname}?room=${code}`;
}

function inviteLink(code) {
  const app = (window.LEADERBOARD_CONFIG || {}).telegramAppLink;
  if (app) return `${app}?startapp=room_${code}`;
  return webInviteLink(code);
}

// ---------- QR-код запрошення ----------
// Бібліотека лежить у грі (vendor/), вантажиться лише коли потрібен QR

let qrLoading = null;

function loadQrLib() {
  if (window.qrcode) return Promise.resolve();
  if (!qrLoading) {
    qrLoading = new Promise((resolve, reject) => {
      const s = document.createElement("script");
      s.src = "vendor/qrcode.js?v=1.4.4";
      s.onload = resolve;
      s.onerror = () => { qrLoading = null; reject(new Error("qr")); };
      document.head.appendChild(s);
    });
  }
  return qrLoading;
}

// Куди веде QR: у Telegram чи одразу в браузер (для класу зручніше браузер —
// учням не треба мати Telegram). Вибір запам'ятовується окремо для кожного режиму.
function qrTarget() {
  if (!(window.LEADERBOARD_CONFIG || {}).telegramAppLink) return "web";
  return storageGet(`qr_target_${online.mode}`) || (online.mode === "class" ? "web" : "tg");
}

function qrLink() {
  return qrTarget() === "web" ? webInviteLink(online.code) : inviteLink(online.code);
}

function qrImage(link) {
  const box = el("div", { class: "qr-box", role: "img", "aria-label": "QR-код запрошення" });
  loadQrLib().then(() => {
    const qr = qrcode(0, "M");
    qr.addData(link);
    qr.make();
    box.innerHTML = qr.createSvgTag({ cellSize: 4, margin: 4, scalable: true });
  }).catch(() => { box.classList.add("qr-error"); box.textContent = "Не вдалося створити QR-код. Перевір інтернет."; });
  return box;
}

function qrTargetSwitch(onChange) {
  if (!(window.LEADERBOARD_CONFIG || {}).telegramAppLink) return null;
  const current = qrTarget();
  return el("div", { class: "qr-target" },
    el("span", { class: "setup-label" }, "QR відкриває гру"),
    el("div", { class: "seg" }, [["web", "🌐 У браузері"], ["tg", "✈️ У Telegram"]].map(([value, label]) => el("button", {
      class: current === value ? "active" : "",
      on: { click: () => { storageSet(`qr_target_${online.mode}`, value); onChange(); } }
    }, label))));
}

function qrCaption() {
  return qrTarget() === "web"
    ? "Наведи камеру телефона на код — гра відкриється в браузері"
    : "Наведи камеру телефона на код — гра відкриється в Telegram";
}

function closeQrOverlay() {
  const ov = document.querySelector(".qr-overlay");
  if (ov) ov.remove();
}

function openQrOverlay() {
  closeQrOverlay();
  track('online_qr', { mode: online.mode });
  const count = el("p", { class: "qr-count" });
  const ov = el("div", { class: "qr-overlay", role: "dialog", "aria-label": "QR-код кімнати" },
    el("button", { class: "icon-btn qr-close", "aria-label": "Закрити", on: { click: closeQrOverlay } }, "✕ Закрити"),
    el("div", { class: "qr-overlay-body" },
      qrImage(qrLink()),
      el("div", { class: "qr-side" },
        el("p", { class: "qr-caption" }, qrCaption()),
        el("p", { class: "qr-or" }, "або «Маю код — приєднатися» і код:"),
        el("div", { class: "room-code" }, online.code),
        count,
        qrTargetSwitch(() => { renderLobby(); openQrOverlay(); }))));
  ov.addEventListener("click", e => { if (e.target === ov) closeQrOverlay(); });
  document.body.appendChild(ov);
  updateQrCount();
}

function updateQrCount() {
  const count = document.querySelector(".qr-overlay .qr-count");
  if (!count || !online) return;
  const n = online.players.length;
  count.textContent = online.mode === "class" ? `Приєдналося учнів: ${n}` : `Гравців у кімнаті: ${n}`;
}

document.addEventListener("keydown", e => { if (e.key === "Escape") closeQrOverlay(); });

// ---------- Статистика ----------

function logOnline(event, extra = {}) {
  if (!online) return;
  if (online.game !== "naholosy") extra = { game: online.game, ...extra };
  const data = { mode: online.mode, players: online.players.length, ...extra };
  gtag('event', `online_${event}`, data);
  if (!leaderboardEnabled || !online.isHost) return;
  // Таблиця online_events (ONLINE.md). Якщо її ще немає — просто нічого не пишемо.
  lbRequest("online_events", {
    method: "POST",
    headers: { Prefer: "return=minimal" },
    body: JSON.stringify({ room: online.code, mode: online.mode, event, players: data.players, details: extra })
  }).catch(() => {});
}

// ---------- Зв'язок ----------

function loadSupabase() {
  if (window.supabase && window.supabase.createClient) return Promise.resolve();
  return new Promise((resolve, reject) => {
    const s = document.createElement("script");
    s.src = SUPABASE_JS;
    s.onload = resolve;
    s.onerror = () => reject(new Error("supabase-js"));
    document.head.appendChild(s);
  });
}

async function connectRoom(code, onMessage) {
  // Для автотестів: зв'язок між вкладками без сервера
  if (window.__RT_FAKE) {
    const bc = new BroadcastChannel(`room-${code}`);
    bc.onmessage = e => onMessage(e.data.event, e.data.data);
    return { send: (event, data) => bc.postMessage({ event, data }), leave: () => bc.close() };
  }

  await loadSupabase();
  if (!supabaseClient) supabaseClient = window.supabase.createClient(LB.url, LB.anonKey);
  const channel = supabaseClient.channel(`naholosy-${code}`, { config: { broadcast: { self: false } } });
  channel.on("broadcast", { event: "msg" }, ({ payload }) => onMessage(payload.event, payload.data));
  await new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error("timeout")), 10000);
    channel.subscribe(status => {
      if (status === "SUBSCRIBED") { clearTimeout(timer); resolve(); }
      if (status === "CHANNEL_ERROR" || status === "TIMED_OUT") { clearTimeout(timer); reject(new Error(status)); }
    });
  });
  return {
    send: (event, data) => channel.send({ type: "broadcast", event: "msg", payload: { event, data } }),
    leave: () => supabaseClient.removeChannel(channel)
  };
}

// Надіслати всім і обробити в себе (broadcast не повертає власні повідомлення)
function emit(event, data = {}) {
  if (!online) return;
  online.rt.send(event, data);
  handleMessage(event, data);
  saveHostState();
}

// ---------- Екрани ----------

function setOnline(title, ...children) {
  $("online-title").textContent = title;
  onlineBody.innerHTML = "";
  onlineBody.append(...children);
}

function openOnline(mode, joinCode = "") {
  clearTimeout(nextTimer);
  showScreen("online");
  if (!leaderboardEnabled) {
    setOnline("Онлайн", el("section", { class: "card online-card" },
      el("p", { class: "online-note" }, "Онлайн-ігри скоро запрацюють 🙂")));
    return;
  }
  renderOnlineStart(mode, joinCode);
}

function renderOnlineStart(mode, joinCode) {
  const nameInput = el("input", { type: "text", maxLength: 20, placeholder: "Як тебе звати?", value: defaultName(), autocomplete: "nickname" });
  const codeInput = el("input", { type: "text", maxLength: 5, placeholder: "КОД", value: joinCode, class: "code-input", autocapitalize: "characters" });
  const status = el("p", { class: "submit-status" });

  const readName = () => {
    const name = normalizeName(nameInput.value);
    const problem = checkName(name);
    if (problem) { status.textContent = problem; status.className = "submit-status bad"; return null; }
    storageSet("player_name", name);
    return name;
  };

  const nameBlock = el("label", { class: "online-label" }, mode === "class" ? "Твоє ім'я (бачитимуть учні)" : "Твоє ім'я", nameInput);

  if (mode) {
    const m = ONLINE_MODES[mode];
    const create = el("button", { class: "btn-primary", on: { click: async () => {
      const name = readName();
      if (!name) return;
      create.disabled = true;
      status.textContent = "Створюю кімнату…"; status.className = "submit-status";
      try { await createRoom(mode, name); } catch (e) { create.disabled = false; status.textContent = "Не вдалося підключитися. Перевір інтернет"; status.className = "submit-status bad"; }
    } } }, mode === "class" ? "Створити кімнату для класу" : "Створити кімнату");
    setOnline(modeTitle(mode), el("section", { class: "card online-card" }, nameBlock, create, status));
    nameInput.focus();
    return;
  }

  const join = el("button", { class: "btn-primary", on: { click: async () => {
    const name = readName();
    if (!name) return;
    const code = codeInput.value.trim().toUpperCase();
    if (!/^[A-Z0-9]{5}$/.test(code)) { status.textContent = "Код — це 5 символів, як-от K7Q2M"; status.className = "submit-status bad"; return; }
    join.disabled = true;
    status.textContent = "Шукаю кімнату…"; status.className = "submit-status";
    try { await joinRoom(code, name); } catch (e) {
      join.disabled = false;
      status.textContent = e.message === "notfound" ? "Кімнату не знайдено. Перевір код" : e.message === "full" ? "У кімнаті вже немає місць" : e.message === "started" ? "Гра в цій кімнаті вже почалась" : "Не вдалося підключитися. Перевір інтернет";
      status.className = "submit-status bad";
    }
  } } }, "Приєднатися");
  setOnline("Приєднатися до гри", el("section", { class: "card online-card" },
    el("label", { class: "online-label" }, "Код кімнати", codeInput), nameBlock, join, status));
  (joinCode ? nameInput : codeInput).focus();
}

// ---------- Кімната ----------

async function createRoom(mode, name) {
  const code = makeRoomCode();
  const me = { id: ONLINE_ID, name };
  const game = gameKey();
  // Спецтема (вебінар): лише в «Наголосах» і лише якщо в ведучого є доступ;
  // у «Фразеологізмах» — вибрана частина
  const topic = game === "naholosy" && hasTopic(currentTopic) ? currentTopic
    : game === "frazeolohizmy" ? frazeoPart
    : game === "slovospoluch" && slovoGroups.length < slovospoluchGroups.length ? slovoGroups.join(",") : "";
  const groups = typeof playGroupIndexes === "function" ? playGroupIndexes(game) : ""; // groups.js
  online = { mode, game, topic, groups, code, me, isHost: true, phase: "lobby", players: [], rt: null };
  if (ONLINE_MODES[mode].hostPlays) online.players.push(me);
  online.rt = await connectRoom(code, handleMessage);
  logOnline("create");
  renderLobby();
}

async function joinRoom(code, name) {
  const me = { id: playerIdFor(code), name };
  online = { mode: null, game: "naholosy", code, me, isHost: false, phase: "joining", players: [], rt: null };
  online.rt = await connectRoom(code, handleMessage);
  await new Promise((resolve, reject) => {
    online.joinWait = { resolve, reject, timer: setTimeout(() => reject(new Error("notfound")), 6000) };
    online.rt.send("join", me);
  }).catch(err => { leaveOnline(true); throw err; });
  saveSeat(code, me.id, name);
  track('online_join', { mode: online.mode });
}

function leaveOnline(silent = false) {
  closeQrOverlay();
  if (!online) return;
  clearTimeout(online.timer);
  clearInterval(online.ticker);
  // Учитель у грі для класу виходить, не завершуючи гру (може повернутися з меню),
  // крім випадку, коли гру вже закрито (online.closing)
  const hostKeeps = online.isHost && online.mode === "class" && !online.closing;
  if (hostKeeps) saveHostState();
  else if (online.isHost) clearHostState();
  if (!silent) online.rt.send(online.isHost ? (hostKeeps ? "host-away" : "closed") : "leave", { id: online.me.id });
  try { online.rt.leave(); } catch (e) { /* вже відключено */ }
  online = null;
  setCloseGuard(false);
  renderRejoin();
}

function broadcastState() {
  emit("state", { mode: online.mode, game: online.game, topic: online.topic || "", groups: online.groups || "", phase: online.phase, players: online.players, host: online.me.id });
}

function onlinePlayerName(id) {
  const p = online.players.find(x => x.id === id);
  return p ? p.name : "Гравець";
}

// ---------- Обробка повідомлень ----------

function handleMessage(event, data) {
  if (!online) return;
  const host = online.isHost;
  // Повідомлення лише для одного гравця (наприклад, коли він повертається в гру)
  if (data && data.to && data.to !== online.me.id) return;
  if (host && data && data.id && event !== "join" && event !== "leave") {
    const p = online.players.find(x => x.id === data.id);
    if (p && p.away) p.away = false;
  }

  switch (event) {
    case "join": {
      if (!host) return;
      const m = ONLINE_MODES[online.mode];
      const known = online.players.find(p => p.id === data.id);
      if (known) {
        // Повернувся гравець, який уже був у кімнаті
        known.away = false;
        broadcastState();
        syncPlayer(data.id);
        updateClassAnswered();
        return;
      }
      if (online.phase !== "lobby") {
        if (online.mode !== "class") { online.rt.send("reject", { id: data.id, reason: "started" }); return; }
        // Гра для класу: той самий учень з іншого браузера — упізнаємо за ім'ям
        const sameName = online.players.find(p => p.away && p.name.toLowerCase() === String(data.name).toLowerCase());
        if (sameName) {
          renamePlayerId(sameName.id, data.id);
          sameName.away = false;
          broadcastState();
          syncPlayer(data.id);
          updateClassAnswered();
          return;
        }
      }
      if (online.players.length >= m.max) { online.rt.send("reject", { id: data.id, reason: "full" }); return; }
      online.players.push({ id: data.id, name: data.name });
      // Запізнився на гру для класу — заходить з 0 балів
      if (online.cls) online.cls.scores[data.id] = 0;
      broadcastState();
      syncPlayer(data.id);
      updateClassAnswered();
      return;
    }
    case "reject":
      if (data.id === online.me.id && online.joinWait) {
        clearTimeout(online.joinWait.timer);
        online.joinWait.reject(new Error(data.reason));
        online.joinWait = null;
      }
      return;
    case "state": {
      const awayNote = onlineBody.querySelector(".host-away");
      if (awayNote) awayNote.remove();
      online.players = data.players;
      if (!host) {
        online.mode = data.mode;
        online.game = data.game || "naholosy";
        online.topic = data.topic || "";
        online.groups = data.groups || "";
        online.hostId = data.host;
        const inRoom = data.players.some(p => p.id === online.me.id);
        if (online.joinWait && inRoom) {
          clearTimeout(online.joinWait.timer);
          online.joinWait.resolve();
          online.joinWait = null;
        }
        if (!inRoom) return;
      }
      // Лобі показуємо, коли ведучий у лобі (зокрема після «Ще раз»)
      if (data.phase === "lobby") {
        online.phase = "lobby";
        renderLobby();
      } else if (!host && online.phase !== "results") {
        // Гра йде: щоб вихід іншого гравця не повертав екран у лобі
        online.phase = "playing";
      }
      return;
    }
    case "leave": {
      const leaving = online.players.find(p => p.id === data.id);
      if (host && online.mode === "class" && online.phase !== "lobby" && leaving) {
        // Учень від'єднався посеред гри — лишаємо його бали й місце, він може повернутися
        leaving.away = true;
        broadcastState();
        updateClassAnswered();
        return;
      }
      online.players = online.players.filter(p => p.id !== data.id);
      if (host) {
        if (online.phase === "lobby") broadcastState();
        else if (online.mode === "duel") endDuel(`${leaving ? leaving.name : "Суперник"} вийшов з гри`);
      }
      if (!host && online.phase === "lobby") renderLobby();
      return;
    }
    case "host-away":
      if (host) return;
      if (!onlineBody.querySelector(".host-away")) {
        onlineBody.prepend(el("p", { class: "host-away" }, "⏳ Учитель від'єднався. Зачекай — гра продовжиться, щойно він повернеться."));
      }
      return;
    case "closed":
      if (host) return;
      leaveOnline(true);
      clearSeat();
      setOnline("Онлайн", el("section", { class: "card online-card" },
        el("p", { class: "online-note" }, "Ведучий закрив кімнату."),
        el("button", { class: "btn-primary", on: { click: () => showModes(modesGame) } }, "До режимів")));
      return;
    default:
      if (online.mode === "duel") duelMessage(event, data);
      else if (online.mode === "sprint") sprintMessage(event, data);
      else if (online.mode === "class") classMessage(event, data);
  }
}

// ---------- Лобі ----------

function renderLobby() {
  const m = ONLINE_MODES[online.mode];
  const players = el("ul", { class: "online-players" },
    online.players.map(p => el("li", { class: p.id === online.me.id ? "me" : "" }, p.name)));

  const groupsName = online.groups ? ` · ${online.groups.split(",").length} ${plural(online.groups.split(",").length, "група", "групи", "груп")}` : "";
  const topicName = groupsName + (gameKey() === "frazeolohizmy" ? ` · ${frazeoPartName(online.topic || "")}`
    : gameKey() === "slovospoluch" ? ` · ${slovoGroupsName(online.topic || "")}`
    : online.topic && SPECIAL[online.topic] ? ` · ${SPECIAL[online.topic].icon} ${SPECIAL[online.topic].name}` : "");
  const children = [el("p", { class: "online-game" }, G().label + topicName)];
  if (online.isHost) {
    const link = inviteLink(online.code);
    const share = el("button", { class: "btn-secondary", on: { click: () => shareInvite(link) } }, "📨 Надіслати");
    const qrBtn = el("button", { class: "btn-secondary", on: { click: openQrOverlay } },
      online.mode === "class" ? "🔍 QR на весь екран" : "▦ QR-код");
    if (online.mode === "class") {
      // Для класу QR одразу на екрані: учні сканують його з проєктора
      children.push(
        el("div", { class: "qr-inline" },
          qrImage(qrLink()),
          el("p", { class: "online-hint" }, qrCaption())),
        el("p", { class: "online-hint" }, "Або учні відкривають гру → «Маю код — приєднатися»:"),
        el("div", { class: "room-code", "aria-label": "Код кімнати" }, online.code),
        el("div", { class: "invite-actions" }, qrBtn, share),
        qrTargetSwitch(renderLobby)
      );
    } else {
      children.push(
        el("p", { class: "online-hint" }, "Друг відкриває гру → «Маю код — приєднатися»"),
        el("div", { class: "room-code", "aria-label": "Код кімнати" }, online.code),
        el("div", { class: "invite-actions" }, share, qrBtn)
      );
    }
  } else {
    children.push(el("p", { class: "online-hint" }, `Кімната ${online.code}. Чекаємо, поки ведучий почне гру…`));
  }

  children.push(el("h3", { class: "online-sub" }, online.mode === "class" ? `Учні (${online.players.length})` : `Гравці (${online.players.length}/${m.max})`), players);

  if (online.isHost) {
    const min = online.mode === "class" ? 1 : 2;
    const enough = online.players.length >= min;
    let settings = null;
    if (online.mode === "class") {
      // Скільки питань: 10/20/30 або своє число (кнопки − + чи з клавіатури), не більше, ніж є в темі
      const maxRounds = poolIndices().length;
      const clamp = n => Math.max(1, Math.min(maxRounds, Math.round(Number(n)) || 1));
      online.classRounds = clamp(online.classRounds || 10);
      const setRounds = n => { online.classRounds = clamp(n); renderLobby(); };
      const input = el("input", {
        type: "number", min: 1, max: maxRounds, inputmode: "numeric", class: "count-input", value: online.classRounds,
        on: { change: () => setRounds(input.value), keydown: e => { if (e.key === "Enter") input.blur(); } }
      });
      settings = el("div", { class: "setup-row setup-count" }, el("span", { class: "setup-label" }, "Скільки слів"),
        el("div", { class: "seg" }, [10, 20, 30].filter(n => n <= maxRounds).map(n => el("button", {
          class: online.classRounds === n ? "active" : "",
          on: { click: () => setRounds(n) }
        }, n))),
        el("div", { class: "count-stepper" },
          el("button", { class: "count-btn", "aria-label": "Менше", on: { click: () => setRounds(online.classRounds - 1) } }, "−"),
          input,
          el("button", { class: "count-btn", "aria-label": "Більше", on: { click: () => setRounds(online.classRounds + 1) } }, "+"),
          el("span", { class: "count-max" }, `із ${maxRounds}`)));
    }
    const start = el("button", { class: "btn-primary", disabled: !enough, on: { click: startOnlineGame } },
      enough ? "Почати гру" : online.mode === "duel" ? "Чекаємо на суперника…" : online.mode === "class" ? "Чекаємо на учнів…" : "Чекаємо на гравців…");
    if (settings) children.push(settings);
    children.push(start);
  }

  setOnline(modeTitle(online.mode), el("section", { class: "card online-card" }, ...children));
  updateQrCount();
}

function shareInvite(link) {
  const what = online.mode === "class" ? `гри ${G().what} для класу`
    : online.mode === "duel" ? `онлайн-дуелі ${G().what}` : `спринту ${G().what}`;
  const text = `Приєднуйся до ${what}! Код кімнати: ${online.code}`;
  track('online_share', { mode: online.mode });
  const tgApp = tgWebApp();
  if (tgApp && tgApp.initData && typeof tgApp.openTelegramLink === "function") {
    tgApp.openTelegramLink(`https://t.me/share/url?url=${encodeURIComponent(link)}&text=${encodeURIComponent(text)}`);
  } else if (navigator.share) {
    navigator.share({ text, url: link }).catch(() => {});
  } else if (navigator.clipboard) {
    navigator.clipboard.writeText(`${text}\n${link}`).then(() => alert("Запрошення скопійовано — встав його в чат з другом"));
  }
}

function startOnlineGame() {
  closeQrOverlay();
  setCloseGuard(true);
  online.seed = Math.floor(Math.random() * 1e9);
  online.phase = "playing";
  online.startedAt = Date.now();
  broadcastState();
  logOnline("start");
  if (online.mode === "duel") startDuelHost();
  else if (online.mode === "sprint") emit("sprint-start", { seed: online.seed });
  else startClassHost();
}

// Слово з варіантами (спільне для всіх режимів)
// Порядок варіантів у кожного гравця свій (випадковий) — щоб не підглядали в сусіда
function wordButtons(q, order, onPick) {
  const box = el("div", { class: "answers" });
  const shown = [...order];
  shuffleArray(shown);
  shown.forEach(word => {
    const btn = el("button", { class: "answer" });
    btn.dataset.word = word;
    renderStressWord(btn, word);
    btn.addEventListener("click", () => onPick(word, btn, box));
    box.appendChild(btn);
  });
  return box;
}

function markAnswers(box, q, picked) {
  if (typeof memOnlineAnswer === "function") memOnlineAnswer(box, q, picked); // 🧠 пам'ять групи (memory.js)
  const correct = correctWords(q);
  Array.from(box.children).forEach(b => {
    b.classList.remove("dim", "picked");
    if (correct.includes(b.dataset.word) && b.dataset.word === picked) sparkleAt(b);
    if (correct.includes(b.dataset.word)) b.classList.add("correct");
    else if (b.dataset.word === picked) b.classList.add("wrong");
    else b.classList.add("dim");
  });
}

function orderFor(idx, round) {
  return seededShuffle(naholosyData[idx].words, seededRandom(online.seed + round * 7919));
}

// ================== ⚔️ Онлайн-дуель ==================

function duelLimit() {
  return G().duelLimit;
}

// Картка (фразеологізми, кличний): речення з пропуском і варіанти
function frazeoOnlineQuestion(card, onPick) {
  const [before, after] = card.text.split("___");
  const gap = el("span", { class: gameKey() === "frazeolohizmy" ? "address-gap gap-br" : "address-gap" }, gameKey() === "frazeolohizmy" ? "[...]" : "…"); // фразеологізми — як на НМТ
  // Словосполучення (card.pair): саме словосполучення без пропуску, кнопки в незмінному порядку
  // «Лексична помилка: речення» (card.leks, leks.js): умова як на НМТ і 4 речення-варіанти
  const sentence = card.leks ? el("p", { class: "frazeo-sentence leks-online-q" }, card.text)
    : card.pair ? el("p", { class: "slovo-phrase" }, card.text)
    : el("p", { class: "frazeo-sentence" }, before, gap, after);
  const box = el("div", { class: card.leks ? "answers frazeo-answers leks-online-answers" : "answers frazeo-answers" });
  const shown = [...card.options];
  if (!card.pair) shuffleArray(shown); // у кожного гравця свій порядок варіантів
  shown.forEach(phrase => {
    const btn = el("button", { class: "answer frazeo-answer" }, phrase);
    btn.dataset.word = phrase;
    btn.addEventListener("click", () => onPick(phrase, btn, box));
    box.appendChild(btn);
  });
  const meaning = el("div");
  return { sentence, gap, box, meaning };
}

function frazeoOnlineReveal(view, card, picked) {
  const right = cardCorrect(card);
  if (card.leks && typeof leksOnlineReveal === "function") { leksOnlineReveal(view, card, picked); return; }
  if (card.pair) {
    // Словосполучення: правильний варіант і пояснення
    const [wrong, fixed] = card.pair;
    const ok = card.answer === "Правильно";
    view.sentence.classList.add(ok ? "slovo-ok" : "slovo-bad");
    view.meaning.innerHTML = "";
    view.meaning.append(slovoPairNode({ ok, wrong, right: fixed }), el("p", { class: "frazeo-meaning" }, card.meaning));
    return;
  }
  const ok = right.includes(picked);
  view.gap.textContent = ok ? picked : card.answer;
  view.gap.classList.add(ok ? "filled-ok" : "filled-fix");
  view.meaning.innerHTML = "";
  if (card.meaning) {
    view.meaning.appendChild(el("p", { class: "frazeo-meaning" }, el("b", {}, card.answer), ` — ${card.meaning}`));
    if (picked && picked !== card.answer && gameKey() === "frazeolohizmy") {
      view.meaning.appendChild(el("p", { class: "frazeo-meaning frazeo-meaning-wrong" }, el("b", {}, picked), ` — ${frazeoMeaning(picked)}`));
    }
  } else if (right.length > 1) {
    const others = right.filter(w => w !== (ok ? picked : card.answer));
    view.meaning.appendChild(el("p", { class: "address-alt" }, `Також правильно: ${others.join(", ")}`));
  }
}

function startDuelHost() {
  online.duel = { order: seededShuffle(poolIndices(), seededRandom(online.seed)), round: 0, scores: {}, answers: {} };
  online.players.forEach(p => { online.duel.scores[p.id] = 0; });
  nextDuelQuestion();
}

function nextDuelQuestion() {
  const d = online.duel;
  d.round++;
  d.answers = {};
  const idx = d.order[(d.round - 1) % d.order.length];
  if (G().card) {
    // Варіанти добирає ведучий і надсилає всім — щоб у гравців були однакові
    emit("q", { round: d.round, card: onlineCard(idx), scores: d.scores });
  } else {
    emit("q", { round: d.round, idx, order: orderFor(idx, d.round), scores: d.scores });
  }
  clearTimeout(online.timer);
  online.timer = setTimeout(resolveDuelRound, duelLimit() + 1500);
}

function resolveDuelRound() {
  const d = online.duel;
  if (!d || d.resolved === d.round) return;
  d.resolved = d.round;
  clearTimeout(online.timer);
  const right = Object.entries(d.answers).filter(([, a]) => a.ok).sort((a, b) => a[1].ms - b[1].ms);
  const winner = right.length ? right[0][0] : null;
  if (winner) d.scores[winner]++;
  emit("r", { round: d.round, answers: d.answers, winner, scores: d.scores });
  const done = winner && d.scores[winner] >= ONLINE_DUEL_TARGET;
  online.timer = setTimeout(() => done ? endDuel() : nextDuelQuestion(), G().duelPause);
}

function endDuel(reason = "") {
  if (!online) return;
  clearTimeout(online.timer);
  emit("end", { scores: online.duel ? online.duel.scores : {}, reason });
}

function duelScoreLine(scores) {
  return el("div", { class: "online-score" },
    online.players.map(p => el("span", { class: p.id === online.me.id ? "me" : "" }, `${p.name}: ${scores[p.id] || 0}`)));
}

function duelMessage(event, data) {
  if (event === "q") {
    const frazeo = Boolean(data.card);
    const q = frazeo ? { correct: cardCorrect(data.card) } : naholosyData[data.idx];
    online.current = { round: data.round, q, card: data.card, shownAt: performance.now(), answered: false };
    const status = el("p", { class: "feedback" }, "Хто швидше?");
    const onPick = (word, btn, answers) => {
      if (online.current.answered || online.current.round !== data.round) return;
      online.current.answered = true;
      const ms = Math.round(performance.now() - online.current.shownAt);
      const ok = correctWords(q).includes(word);
      btn.classList.add("picked");
      Array.from(answers.children).forEach(b => { if (b !== btn) b.classList.add("dim"); });
      status.textContent = `Твій час: ${formatSeconds(ms)}. Чекаємо суперника…`;
      emit("a", { round: data.round, id: online.me.id, word, ok, ms });
    };
    if (frazeo) {
      const view = frazeoOnlineQuestion(data.card, onPick);
      online.current.box = view.box;
      online.current.view = view;
      online.current.status = status;
      setOnline(modeTitle("duel"), duelScoreLine(data.scores),
        el("section", { class: "card" },
          el("p", { class: "question" }, `${G().unit} ${data.round} · до ${ONLINE_DUEL_TARGET} очок`),
          view.sentence, view.meaning, view.box, status));
      return;
    }
    const box = wordButtons(q, data.order, onPick);
    online.current.box = box;
    online.current.status = status;
    setOnline(modeTitle("duel"), duelScoreLine(data.scores),
      el("section", { class: "card" }, el("p", { class: "question" }, `Слово ${data.round} · до ${ONLINE_DUEL_TARGET} очок`), box, status));
    return;
  }
  if (event === "a") {
    if (!online.isHost || !online.duel || data.round !== online.duel.round) return;
    online.duel.answers[data.id] = { ok: data.ok, ms: data.ms, word: data.word };
    if (online.players.every(p => online.duel.answers[p.id])) resolveDuelRound();
    return;
  }
  if (event === "r") {
    const cur = online.current;
    if (!cur || cur.round !== data.round) return;
    const mine = data.answers[online.me.id];
    markAnswers(cur.box, cur.q, mine && mine.word);
    if (cur.card) frazeoOnlineReveal(cur.view, cur.card, mine && mine.word);
    const parts = online.players.map(p => {
      const a = data.answers[p.id];
      const who = p.id === online.me.id ? "Ти" : p.name;
      return a ? `${who}: ${formatSeconds(a.ms)} ${a.ok ? "✅" : "❌"}` : `${who}: не встиг ⌛`;
    });
    const verdict = data.winner
      ? (data.winner === online.me.id ? "+1 тобі! ⚡" : `+1 — ${onlinePlayerName(data.winner)}`)
      : "Ніхто не отримав бал";
    cur.status.textContent = `${parts.join(" · ")} → ${verdict}`;
    cur.status.className = "feedback " + (data.winner === online.me.id ? "good" : data.winner ? "bad" : "");
    const line = onlineBody.querySelector(".online-score");
    if (line) line.replaceWith(duelScoreLine(data.scores));
    return;
  }
  if (event === "end") {
    clearTimeout(online.timer);
    if (online.isHost) logOnline("finish", { rounds: online.duel ? online.duel.round : 0, duration_s: Math.round((Date.now() - online.startedAt) / 1000) });
    const ranking = online.players.map(p => ({ ...p, score: data.scores[p.id] || 0 })).sort((a, b) => b.score - a.score);
    const iWon = ranking[0] && ranking[0].id === online.me.id && (!ranking[1] || ranking[0].score > ranking[1].score);
    if (iWon) launchConfetti();
    showOnlineResults(iWon ? "🏆 Перемога!" : "Наступного разу пощастить 💪", ranking.map(p => [p.name, p.score, p.id]), data.reason);
  }
}

// ================== ⏱ Спринт ==================

function sprintMessage(event, data) {
  if (event === "sprint-start") {
    online.seed = data.seed;
    online.sprint = {
      order: seededShuffle(poolIndices(), seededRandom(data.seed)),
      pos: 0, correct: 0, wrong: 0, timeLeft: window.__SPRINT_SECONDS || sprintSeconds(), finished: false,
      progress: {}
    };
    online.players.forEach(p => { online.sprint.progress[p.id] = { correct: 0, wrong: 0, done: false }; });
    sprintCountdown(3);
    return;
  }
  if (event === "p" || event === "f") {
    if (!online.sprint) return;
    online.sprint.progress[data.id] = { correct: data.correct, wrong: data.wrong, done: event === "f" };
    renderSprintRivals();
    if (online.sprint.finished) renderSprintResults();
  }
}

function sprintSeconds() {
  return G().sprint;
}

function sprintCountdown(n) {
  setOnline(modeTitle("sprint"), el("div", { class: "countdown" }, n > 0 ? n : "Старт!"));
  if (n > 0) online.timer = setTimeout(() => sprintCountdown(n - 1), 1000);
  else online.timer = setTimeout(startSprintPlay, 500);
}

function startSprintPlay() {
  const s = online.sprint;
  s.endsAt = performance.now() + s.timeLeft * 1000;
  s.timerEl = el("span", { class: "sprint-time" });
  s.scoreEl = el("span", { class: "sprint-score" });
  s.rivalsEl = el("div", { class: "sprint-rivals" });
  s.card = el("section", { class: "card" });
  setOnline(modeTitle("sprint"), el("div", { class: "sprint-bar" }, s.timerEl, s.scoreEl), s.rivalsEl, s.card);
  renderSprintRivals();
  renderSprintWord();
  online.ticker = setInterval(sprintTick, 100);
  sprintTick();
}

function sprintTick() {
  const s = online.sprint;
  if (!s || s.finished) return;
  const left = Math.max(0, s.endsAt - performance.now());
  s.timerEl.textContent = `⏱ ${Math.ceil(left / 1000)} с`;
  s.timerEl.classList.toggle("low", left < 10000);
  s.scoreEl.textContent = `✅ ${s.correct}  ❌ ${s.wrong}`;
  if (left <= 0) finishSprint();
}

function renderSprintWord() {
  const s = online.sprint;
  if (G().card) { renderSprintFrazeo(); return; }
  const idx = s.order[s.pos % s.order.length];
  const q = naholosyData[idx];
  const box = wordButtons(q, orderFor(idx, s.pos), (word, btn, answers) => {
    if (s.finished || s.locked) return;
    s.locked = true;
    const ok = correctWords(q).includes(word);
    markAnswers(answers, q, word);
    if (ok) s.correct++;
    else { s.wrong++; s.endsAt -= G().penalty * 1000; }
    s.progress[online.me.id] = { correct: s.correct, wrong: s.wrong, done: false };
    online.rt.send("p", { id: online.me.id, correct: s.correct, wrong: s.wrong });
    renderSprintRivals();
    sprintTick();
    setTimeout(() => { s.locked = false; s.pos++; if (!s.finished) renderSprintWord(); }, ok ? 250 : 900);
  });
  s.card.innerHTML = "";
  s.card.append(el("p", { class: "question" }, "Обери правильний наголос"), box);
}

// Спринт у фразеологізми: картки однакові в усіх (спільне «зерно»), при помилці — значення
function renderSprintFrazeo() {
  const s = online.sprint;
  const idx = s.order[s.pos % s.order.length];
  const card = onlineCard(idx, seededRandom(online.seed + s.pos * 7919));
  const view = frazeoOnlineQuestion(card, (word, btn, answers) => {
    if (s.finished || s.locked) return;
    s.locked = true;
    const ok = cardCorrect(card).includes(word);
    markAnswers(answers, { correct: cardCorrect(card), card }, word);
    if (!ok) frazeoOnlineReveal(view, card, word);
    else view.gap.textContent = card.answer;
    if (ok) s.correct++;
    else { s.wrong++; s.endsAt -= G().penalty * 1000; }
    s.progress[online.me.id] = { correct: s.correct, wrong: s.wrong, done: false };
    online.rt.send("p", { id: online.me.id, correct: s.correct, wrong: s.wrong });
    renderSprintRivals();
    sprintTick();
    setTimeout(() => { s.locked = false; s.pos++; if (!s.finished) renderSprintWord(); }, ok ? 500 : 3000);
  });
  s.card.innerHTML = "";
  s.card.append(view.sentence, view.meaning, view.box);
}

function renderSprintRivals() {
  const s = online.sprint;
  if (!s || !s.rivalsEl) return;
  const max = Math.max(1, ...Object.values(s.progress).map(p => p.correct));
  s.rivalsEl.innerHTML = "";
  online.players.forEach(p => {
    const pr = s.progress[p.id] || { correct: 0 };
    s.rivalsEl.append(el("div", { class: "rival" + (p.id === online.me.id ? " me" : "") },
      el("span", { class: "rival-name" }, p.id === online.me.id ? "Ти" : p.name),
      el("span", { class: "rival-track" }, el("span", { class: "rival-fill", style: `width:${(pr.correct / max) * 100}%` })),
      el("span", { class: "rival-num" }, pr.correct)));
  });
}

function finishSprint() {
  const s = online.sprint;
  if (s.finished) return;
  s.finished = true;
  clearInterval(online.ticker);
  s.progress[online.me.id] = { correct: s.correct, wrong: s.wrong, done: true };
  online.rt.send("f", { id: online.me.id, correct: s.correct, wrong: s.wrong });
  if (online.isHost) {
    // фіксуємо статистику, коли всі закінчать (або через 5 секунд)
    online.timer = setTimeout(() => logOnline("finish", { duration_s: sprintSeconds() }), 5000);
  }
  renderSprintResults();
}

function renderSprintResults() {
  const s = online.sprint;
  const ranking = online.players
    .map(p => ({ ...p, ...(s.progress[p.id] || { correct: 0, wrong: 0 }) }))
    .sort((a, b) => b.correct - a.correct || a.wrong - b.wrong);
  const waiting = ranking.filter(p => !p.done).length;
  const tie = ranking.length > 1 && ranking[0].correct === ranking[1].correct && ranking[0].wrong === ranking[1].wrong;
  const iWon = !waiting && !tie && ranking[0].id === online.me.id;
  if (iWon && !s.celebrated) { s.celebrated = true; launchConfetti(); }
  showOnlineResults(
    waiting ? "Час вийшов!" : iWon ? "🏆 Перемога!" : tie && ranking[0].correct === (s.progress[online.me.id] || {}).correct ? "🤝 Нічия!" : "Фініш!",
    ranking.map(p => [p.name, `${p.correct} ✅ · ${p.wrong} ❌${p.done ? "" : " …"}`, p.id]),
    waiting ? `Чекаємо, поки допишуть: ${waiting}` : ""
  );
}

// ================== 🏫 Гра для класу ==================

// Учень (по)вернувся в кімнату — надсилаємо лише йому те, що зараз на екрані
function syncPlayer(id) {
  if (!online || !online.isHost) return;
  const c = online.cls;
  if (online.mode !== "class" || !c) return;
  if (c.lastEnd) { emit("end", { ...c.lastEnd, to: id }); return; }
  if (!c.lastQ) return;
  const mine = c.answers[id];
  emit("q", { ...c.lastQ, to: id, elapsed: Date.now() - c.lastQ.sentAt, answered: mine ? mine.word : null });
  if (c.resolved && c.lastR) emit("r", { ...c.lastR, to: id });
}

// Учень зайшов з іншого браузера під тим самим ім'ям — переносимо бали на новий ідентифікатор
function renamePlayerId(oldId, newId) {
  const p = online.players.find(x => x.id === oldId);
  if (p) p.id = newId;
  const c = online.cls;
  if (!c) return;
  if (oldId in c.scores) { c.scores[newId] = c.scores[oldId]; delete c.scores[oldId]; }
  if (c.answers[oldId]) { c.answers[newId] = c.answers[oldId]; delete c.answers[oldId]; }
  ["correct", "answeredCount"].forEach(k => {
    if (c[k] && oldId in c[k]) { c[k][newId] = c[k][oldId]; delete c[k][oldId]; }
  });
}

// Учень повернувся, а відповідь на це питання вже дав — показуємо її, вдруге не приймаємо
function markAlreadyAnswered(box, status, word) {
  online.current.answered = true;
  Array.from(box.children).forEach(b => b.classList.add(b.dataset.word === word ? "picked" : "dim"));
  status.textContent = "Відповідь прийнято! Чекаємо інших…";
}

function activePlayers() {
  return online.players.filter(p => !p.away);
}

function updateClassAnswered() {
  if (!online || !online.cls || !online.current || !online.current.answeredEl) return;
  const n = activePlayers().filter(p => online.cls.answers[p.id]).length;
  const away = online.players.length - activePlayers().length;
  online.current.answeredEl.textContent = `Відповіли: ${n} з ${activePlayers().length}` + (away ? ` · від'єдналися: ${away}` : "");
}

function endClassGame(scores, early = false) {
  const c = online.cls;
  clearTimeout(online.timer);
  clearInterval(online.ticker);
  // зіграні питання: поточне рахуємо, лише якщо відповідь на нього вже показано
  const played = c.resolved ? c.round : Math.max(0, c.round - 1);
  c.round = played;
  c.lastEnd = { scores, early, rounds: played, total: c.total, endedAt: Date.now(), correct: { ...(c.correct || {}) } }; // correct — щоб усі бачили «5/10»
  saveClassResults();
  emit("end", c.lastEnd);
}

// ⏹ Дострокове завершення (кнопка на панелі вчителя)
function finishClassEarly() {
  if (!online || !online.cls || online.cls.lastEnd) return;
  if (!confirm("Завершити гру зараз? Учні побачать підсумки.")) return;
  endClassGame(online.cls.scores, true);
}

function classEndButton() {
  return el("button", { class: "btn-secondary class-end", on: { click: finishClassEarly } }, "⏹ Завершити гру");
}

// Підсумки уроку: місце, ім'я, бали, правильні відповіді
function classResultsRows() {
  const c = online.cls;
  return classRanking(c.scores).map((p, i) => ({
    place: i + 1, name: p.name, score: p.score,
    correct: (c.correct || {})[p.id] || 0, answered: (c.answeredCount || {})[p.id] || 0
  }));
}

// Зберігаємо підсумки в Supabase (таблиця class_results, див. STATS.md) — один раз
function saveClassResults() {
  const c = online.cls;
  if (c.saved || !leaderboardEnabled) return;
  c.saved = true;
  lbRequest("class_results", {
    method: "POST",
    headers: { Prefer: "return=minimal" },
    body: JSON.stringify({
      room: online.code, game: online.game, rounds: c.round, rounds_planned: c.total,
      early: Boolean(c.lastEnd && c.lastEnd.early),
      started_at: new Date(online.startedAt || Date.now()).toISOString(),
      players: classResultsRows()
    })
  }).catch(() => { c.saved = false; });
}

// Таблиця для вчителя: завантажити (Excel/Google Таблиці) або скопіювати
function classResultsTable(sep) {
  const c = online.cls;
  const when = new Date(online.startedAt || Date.now()).toLocaleString("uk-UA", { dateStyle: "short", timeStyle: "short" });
  const head = [
    ["Гра", G().label.replace(/^\S+\s+Гра:\s*/, "")], ["Кімната", online.code], ["Дата", when],
    ["Питань", `${c.round} з ${c.total}${c.lastEnd && c.lastEnd.early ? " (завершено достроково)" : ""}`], [],
    ["Місце", "Ім'я", "Бали", "Правильних відповідей", "Відповідей"]
  ];
  const rows = classResultsRows().map(r => [r.place, r.name, r.score, r.correct, r.answered]);
  return [...head, ...rows].map(r => r.join(sep)).join("\n");
}

function classResultsButtons() {
  const download = el("button", { class: "btn-secondary", on: { click: () => {
    const blob = new Blob(["\ufeff" + classResultsTable(";")], { type: "text/csv;charset=utf-8" });
    const a = el("a", { href: URL.createObjectURL(blob), download: `rezultaty-${online.code}.csv` });
    document.body.appendChild(a); a.click(); a.remove();
  } } }, "⬇️ Завантажити результати");
  // у Telegram і деяких браузерах буфер обміну не дозволено — тоді запасний спосіб, а якщо й він не вдався, показуємо таблицю для ручного копіювання
  const copy = el("button", { class: "btn-secondary", on: { click: () => {
    const text = classResultsTable("\t");
    const done = () => { copy.textContent = "Скопійовано ✓ — встав у таблицю"; };
    const manual = () => {
      const old = box.querySelector("textarea");
      if (old) old.remove();
      const ta = el("textarea", { class: "class-copy", rows: 8, readonly: "" });
      ta.value = text;
      box.append(el("p", { class: "online-hint" }, "Скопіювати автоматично не вийшло — виділи текст нижче й скопіюй вручну:"), ta);
      ta.focus(); ta.select();
    };
    const legacy = () => {
      try {
        const ta = el("textarea", { style: "position:fixed;opacity:0;top:0;left:0" });
        ta.value = text; document.body.appendChild(ta); ta.select();
        const ok = document.execCommand("copy"); ta.remove();
        ok ? done() : manual();
      } catch (e) { manual(); }
    };
    if (navigator.clipboard && window.isSecureContext) navigator.clipboard.writeText(text).then(done, legacy);
    else legacy();
  } } }, "📋 Скопіювати для таблиці");
  const box = el("div", { class: "invite-actions" }, download, copy);
  return box;
}

function classLimit() {
  return G().classLimit;
}

function startClassHost() {
  online.cls = {
    order: seededShuffle(poolIndices(), seededRandom(online.seed)),
    round: 0, total: online.classRounds || 10, scores: {}, answers: {}, correct: {}, answeredCount: {}
  };
  online.players.forEach(p => { online.cls.scores[p.id] = 0; });
  nextClassQuestion();
}

function nextClassQuestion() {
  const c = online.cls;
  c.round++;
  c.answers = {};
  c.resolved = false;
  const idx = c.order[c.round - 1];
  if (G().card) {
    c.lastQ = { round: c.round, total: c.total, card: onlineCard(idx), limit: classLimit() };
  } else {
    c.lastQ = { round: c.round, total: c.total, idx, order: orderFor(idx, c.round), limit: classLimit() };
  }
  c.lastQ.sentAt = Date.now();
  c.lastR = null;
  emit("q", c.lastQ);
  clearTimeout(online.timer);
  online.timer = setTimeout(resolveClassRound, classLimit() + 1000);
}

function resolveClassRound() {
  const c = online.cls;
  if (!c || c.resolved) return;
  c.resolved = true;
  clearTimeout(online.timer);
  clearInterval(online.ticker);
  const gained = {};
  online.players.forEach(p => {
    const a = c.answers[p.id];
    // правильна відповідь: 500 балів + до 500 за швидкість
    gained[p.id] = a && a.ok ? 500 + Math.round(500 * Math.max(0, 1 - a.ms / classLimit())) : 0;
    c.scores[p.id] = (c.scores[p.id] || 0) + gained[p.id];
    if (a) c.answeredCount[p.id] = (c.answeredCount[p.id] || 0) + 1;
    if (a && a.ok) c.correct[p.id] = (c.correct[p.id] || 0) + 1;
  });
  c.lastR = { round: c.round, total: c.total, gained, scores: c.scores, answers: c.answers };
  emit("r", c.lastR);
}

// Гра для класу у фразеологізми: учитель бачить речення й варіанти, учні відповідають
function classFrazeoQuestion(data) {
  const card = data.card;
  const q = { correct: cardCorrect(card) };
  online.current = { round: data.round, q, card, shownAt: performance.now() - (data.elapsed || 0), answered: false };
  const head = el("p", { class: "question" }, `${G().unit} ${data.round} з ${data.total}`);
  const timer = el("div", { class: "class-timer" }, el("span", { class: "class-timer-fill" }));
  const status = el("p", { class: "feedback" }, "");
  const view = frazeoOnlineQuestion(card, (word, btn, answers) => {
    if (online.isHost || online.current.answered || online.current.round !== data.round) return;
    online.current.answered = true;
    const ms = Math.round(performance.now() - online.current.shownAt);
    btn.classList.add("picked");
    Array.from(answers.children).forEach(b => { if (b !== btn) b.classList.add("dim"); });
    status.textContent = "Відповідь прийнято! Чекаємо інших…";
    emit("a", { round: data.round, id: online.me.id, word, ok: cardCorrect(card).includes(word), ms });
  });
  online.current.view = view;
  online.current.box = view.box;
  online.current.status = status;
  if (online.isHost) {
    view.box.querySelectorAll("button").forEach(b => { b.disabled = true; });
    const answered = el("p", { class: "online-hint" });
    online.current.answeredEl = answered;
    updateClassAnswered();
    setOnline(modeTitle("class"), el("section", { class: "card class-frazeo" }, head, timer, view.sentence, view.meaning, view.box, answered,
      el("button", { class: "btn-secondary class-reveal", on: { click: resolveClassRound } }, "Показати відповідь"), classEndButton()));
  } else {
    setOnline(modeTitle("class"), el("section", { class: "card" }, head, timer, view.sentence, view.meaning, view.box, status));
    if (data.answered) markAlreadyAnswered(view.box, status, data.answered);
  }
  const fill = timer.firstChild;
  clearInterval(online.ticker);
  online.ticker = setInterval(() => {
    const left = Math.max(0, 1 - (performance.now() - online.current.shownAt) / data.limit);
    fill.style.width = `${left * 100}%`;
    if (left <= 0) clearInterval(online.ticker);
  }, 100);
}

function classRanking(scores) {
  return online.players.map(p => ({ ...p, score: scores[p.id] || 0 })).sort((a, b) => b.score - a.score);
}

function classMessage(event, data) {
  if (event === "showok") { // вчитель показав / сховав «✅ 8/10» на підсумку
    document.querySelectorAll(".online-results").forEach(l => l.classList.toggle("show-ok", Boolean(data.on)));
    document.querySelectorAll(".ok-toggle").forEach(b => b.replaceChildren(okEmoji(), data.on ? "Сховати, скільки правильних відповідей" : "Показати, скільки правильних відповідей"));
    return;
  }
  if (event === "q" && data.card) {
    classFrazeoQuestion(data);
    return;
  }
  if (event === "q") {
    const q = naholosyData[data.idx];
    const order = data.order;
    online.current = { round: data.round, q, shownAt: performance.now() - (data.elapsed || 0), answered: false };
    const head = el("p", { class: "question" }, `Слово ${data.round} з ${data.total}`);
    const timer = el("div", { class: "class-timer" }, el("span", { class: "class-timer-fill" }));

    if (online.isHost) {
      // Учитель: великі варіанти (без натискання), таймер, скільки відповіли
      const answered = el("p", { class: "online-hint" });
      online.current.answeredEl = answered;
      updateClassAnswered();
      const words = el("div", { class: "answers class-words" }, order.map(w => {
        const b = el("div", { class: "answer" });
        b.dataset.word = w;
        renderStressWord(b, w);
        return b;
      }));
      online.current.box = words;
      setOnline(modeTitle("class"), el("section", { class: "card" }, head, timer, words, answered,
        el("button", { class: "btn-secondary class-reveal", on: { click: resolveClassRound } }, "Показати відповідь"), classEndButton()));
    } else {
      const status = el("p", { class: "feedback" }, "");
      const box = wordButtons(q, order, (word, btn, answers) => {
        if (online.current.answered || online.current.round !== data.round) return;
        online.current.answered = true;
        const ms = Math.round(performance.now() - online.current.shownAt);
        btn.classList.add("picked");
        Array.from(answers.children).forEach(b => { if (b !== btn) b.classList.add("dim"); });
        status.textContent = "Відповідь прийнято! Чекаємо інших…";
        emit("a", { round: data.round, id: online.me.id, word, ok: correctWords(q).includes(word), ms });
      });
      online.current.box = box;
      online.current.status = status;
      setOnline(modeTitle("class"), el("section", { class: "card" }, head, timer, box, status));
      if (data.answered) markAlreadyAnswered(box, status, data.answered);
    }
    // смужка часу
    const fill = timer.firstChild;
    clearInterval(online.ticker);
    online.ticker = setInterval(() => {
      const left = Math.max(0, 1 - (performance.now() - online.current.shownAt) / data.limit);
      fill.style.width = `${left * 100}%`;
      if (left <= 0) clearInterval(online.ticker);
    }, 100);
    return;
  }
  if (event === "a") {
    if (!online.isHost || !online.cls || data.round !== online.cls.round) return;
    online.cls.answers[data.id] = { ok: data.ok, ms: data.ms, word: data.word };
    saveHostState();
    updateClassAnswered();
    if (activePlayers().every(p => online.cls.answers[p.id])) resolveClassRound();
    return;
  }
  if (event === "r") {
    clearInterval(online.ticker);
    const cur = online.current;
    if (!cur || cur.round !== data.round) return;
    const last = data.round >= data.total;
    const ranking = classRanking(data.scores);

    if (cur.card) frazeoOnlineReveal(cur.view, cur.card, online.isHost ? cur.card.answer : (data.answers[online.me.id] || {}).word);
    if (online.isHost) {
      markAnswers(cur.box, cur.q, null);
      // Скільки учнів обрали кожен варіант (без імен)
      const counts = {};
      Object.values(data.answers).forEach(a => { counts[a.word] = (counts[a.word] || 0) + 1; });
      const totalAns = Object.values(data.answers).length || 1;
      Array.from(cur.box.children).forEach(b => {
        const n = counts[b.dataset.word] || 0;
        b.classList.add("with-count");
        b.appendChild(el("span", { class: "answer-count" }, `${n} 👤`));
        b.style.setProperty("--share", `${Math.round(n / totalAns * 100)}%`);
      });
      const okCount = Object.values(data.answers).filter(a => a.ok).length;
      const top = el("ol", { class: "leaders-list class-top" }, ranking.slice(0, 5).map(p =>
        el("li", {}, el("span", { class: "name" }, p.name), el("span", { class: "points" }, p.score))));
      const next = el("button", { class: "btn-primary", on: { click: () => last ? endClassGame(data.scores) : nextClassQuestion() } },
        last ? "🏁 Підсумки" : `${G().next} →`);
      Array.from(cur.box.parentNode.querySelectorAll(".class-reveal, .class-end")).forEach(b => b.remove());
      cur.box.parentNode.append(
        el("p", { class: "online-hint" }, `Правильно відповіли: ${okCount} з ${online.players.length}`),
        el("h3", { class: "online-sub" }, "Топ-5"), top, next, last ? null : classEndButton());
    } else {
      const a = data.answers[online.me.id];
      markAnswers(cur.box, cur.q, a && a.word);
      const place = ranking.findIndex(p => p.id === online.me.id) + 1;
      const gained = data.gained[online.me.id] || 0;
      cur.status.textContent = `${a && a.ok ? `✅ +${gained}` : a ? "❌ +0" : "⌛ Не встиг"} · Разом: ${data.scores[online.me.id] || 0} · Місце: ${place} з ${ranking.length}`;
      cur.status.className = "feedback " + (a && a.ok ? "good" : "bad");
    }
    return;
  }
  if (event === "end") {
    clearTimeout(online.timer);
    clearInterval(online.ticker);
    if (online.isHost) logOnline("finish", { rounds: online.cls ? online.cls.round : 0, duration_s: Math.round((Date.now() - online.startedAt) / 1000) });
    const ranking = classRanking(data.scores);
    const myPlace = ranking.findIndex(p => p.id === online.me.id) + 1;
    if (myPlace === 1 || online.isHost) launchConfetti();
    showOnlineResults(online.isHost ? "🏆 Переможці" : myPlace ? `Твоє місце: ${myPlace} з ${ranking.length}` : "Гру завершено",
      ranking.map(p => [p.name, p.score, p.id, data.correct ? `${data.correct[p.id] || 0}/${data.rounds}` : ""]), data.early ? `Гру завершено достроково: зіграно ${data.rounds} з ${data.total}` : "", true);
    if (data.showOk) classMessage("showok", { on: true });
    if (online.isHost && online.cls) {
      const card = onlineBody.querySelector(".online-card");
      if (card) card.insertBefore(classResultsButtons(), card.querySelector(".btn-primary"));
    }
  }
}

// ---------- Підсумки ----------

// ✅ — картинкою, як на iPhone (на Android і Windows інакше інший вигляд)
const OK_EMOJI = "https://cdn.jsdelivr.net/npm/emoji-datasource-apple@15.1.2/img/apple/64/2705.png";
function okEmoji() {
  return el("img", { class: "emo-img", src: OK_EMOJI, alt: "✅", width: 18, height: 18 });
}

function showOnlineResults(title, rows, note = "", podium = false) {
  online.phase = "results";
  setCloseGuard(false);
  if (!online.isHost) storageSet(SEAT_KEY, ""); // гра закінчилась — повертатися нікуди
  const list = el("ol", { class: "leaders-list online-results" + (podium ? " podium" : "") },
    rows.map(([name, value, id, ok]) => el("li", { class: id === online.me.id ? "me" : "" },
      el("span", { class: "name" }, name), ok ? el("span", { class: "ok-count", title: "правильних відповідей" }, okEmoji(), ok) : null,
      el("span", { class: "points" }, value))));
  // «✅ 8/10» біля балів — лише коли вчитель натисне маленьку кнопку (за замовчуванням тільки бали); учням показується разом із ним
  const okText = on => on ? "Сховати, скільки правильних відповідей" : "Показати, скільки правильних відповідей";
  const okBtn = online.isHost && rows.some(r => r[3]) ? el("button", { class: "ok-toggle", on: { click: () => {
    const on = !list.classList.contains("show-ok");
    if (online.cls && online.cls.lastEnd) online.cls.lastEnd.showOk = on;
    emit("showok", { on });
  } } }, okEmoji(), okText(false)) : null;
  const again = online.isHost
    ? el("button", { class: "btn-primary", on: { click: () => {
      online.phase = "lobby";
      online.duel = online.sprint = online.cls = null;
      broadcastState();
    } } }, "Ще раз з цими гравцями")
    : el("p", { class: "online-hint" }, "Ведучий може почати нову гру — залишайся в кімнаті");
  setOnline(modeTitle(online.mode), el("section", { class: "card online-card" },
    el("h2", { class: "online-result-title" }, title),
    note ? el("p", { class: "online-hint" }, note) : null,
    list, okBtn, again,
    el("button", { class: "btn-secondary", on: { click: exitOnline } }, "Вийти")));
}

function exitOnline() {
  const game = online ? online.game : modesGame;
  if (online && online.isHost && online.mode === "class") {
    if (online.phase === "results" || (online.phase === "lobby" && online.players.length === 0)) {
      online.closing = true; // гра закінчилась — кімнату закриваємо
    } else if (!confirm("Вийти з гри?\n\nГра НЕ завершиться: учні чекатимуть, а ви зможете повернутися з меню («Повернутися до гри»).\nЩоб завершити гру для всіх, натисніть «Завершити гру».") /* без смайлика: системне вікно показує «рідні» смайлики пристрою (emoji.js) */) {
      return;
    }
  }
  leaveOnline();
  showModes(ONLINE_GAMES[game] ? game : "naholosy");
}

// ---------- Події ----------

document.querySelectorAll(".online-mode-btn").forEach(b => {
  b.addEventListener("click", () => openOnline(b.dataset.mode));
});
$("btn-online-join").addEventListener("click", () => openOnline(null));
$("btn-rejoin").addEventListener("click", rejoinClick);
renderRejoin();
$("btn-online-back").addEventListener("click", exitOnline);
window.addEventListener("beforeunload", () => leaveOnline());

// Запрошення: …?room=КОД (сайт) або start_param «room_КОД» (мініапка Telegram).
// Telegram передає start_param і в адресі (tgWebAppStartParam), тож не чекаємо його скрипта.
function telegramStartParam() {
  const tgApp = tgWebApp();
  const fromSdk = tgApp && tgApp.initDataUnsafe && tgApp.initDataUnsafe.start_param;
  if (fromSdk) return fromSdk;
  const fromQuery = new URLSearchParams(location.search).get("tgWebAppStartParam");
  if (fromQuery) return fromQuery;
  const hash = new URLSearchParams(location.hash.slice(1));
  const fromHash = hash.get("tgWebAppStartParam");
  if (fromHash) return fromHash;
  const data = hash.get("tgWebAppData");
  return data ? new URLSearchParams(data).get("start_param") || "" : "";
}

function openInviteFromLink() {
  const fromUrl = new URLSearchParams(location.search).get("room");
  const startParam = telegramStartParam();
  const fromTg = startParam && startParam.startsWith("room_") ? startParam.slice(5) : "";
  const code = (fromUrl || fromTg || "").toUpperCase();
  if (!/^[A-Z0-9]{5}$/.test(code)) return false;
  track('online_invite_open', { source: fromTg ? "telegram" : "link" });
  const seat = getSeat();
  if (seat && seat.code === code) rejoinSeat(); // уже грав у цій кімнаті — одразу назад
  else openOnline(null, code);
  return true;
}

// Якщо код не знайшовся одразу — ще раз, коли довантажиться скрипт Telegram
if (!openInviteFromLink() && document.readyState !== "complete") {
  window.addEventListener("load", openInviteFromLink, { once: true });
}

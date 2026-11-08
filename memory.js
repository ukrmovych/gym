// 🧠 Пам'ять і забування в тренуванні групами (власниця, 04.11.2026).
// Кожна група (плитка) пам'ятає: s — «стабільність» пам'яті в днях, t — коли востаннє тренували, a — точність тоді (0…1).
// localStorage `<ключ групи>_mem` (ключі train_… — префікс не міняти, щоб не загубити прогрес).
//
// Модель — як у сучасних системах інтервальних повторень (FSRS, крива забування Еббінгауза):
//   ймовірність згадати через e днів  R = (1 + 19/81 · e / s)^(-1/2)   → через s днів R = 90 %.
//   Повторювати варто, коли R опускається до ~90 % (ще пам'ятаєш, але вже зусиллям — так пам'ять міцніє найбільше).
// Після тренування групи:
//   • перший раз: s = 0,2 дня ≈ 5 год (≥ 95 %), 0,12 ≈ 3 год (≥ 80 %), 0,04 ≈ 1 год (менше) — найбільше нового
//     забувається в перші години (крива Еббінгауза), тож перше повторення — того ж дня, бажано ввечері перед сном;
//   • точність ≥ 85 %: s × (1 + 2,2·a·k), k = 0,1 + 9·(1 − R) (не більше 1,5): що більше встиг забути, але згадав, —
//     то сильніше росте пам'ять; повторення «одразу ж» майже нічого не додає (захист від зубріння);
//   • 60–85 %: s × (1 + 0,5·k) — трохи; менше 60 %: s × 0,4 (забув — інтервал коротшає, не менше 0,3 дня).
// Ідеальні відповіді щоразу вчасно → повторення через ~5 год, ~15 год (наступного дня, після сну), 2, 7, 21, 67 днів:
// 6–7 повторень, щоб тримати групу в пам'яті до НМТ.
// Вигляд плитки (колір — точність, яскравість — пам'ять зараз, «🔁 повтори», коли R < 90 %):
// 1 згасання, 2 батарейка, 3 сяйво, 4 рослинка, 5 згасання + батарейка, 6 згасання + рослинка.
// За замовчуванням MEM_VIEW_DEFAULT; на пробу …/?b&view=1…6 (localStorage `train_view`); симулятор — simulator.html.

const MEM_DAY = 24 * 60 * 60 * 1000;
const memNow = () => (typeof window !== "undefined" && window.memFakeNow) || Date.now(); // симулятор підміняє час
const MEM_DUE = 0.9;          // нижче — час повторити
const MEM_VIEW_DEFAULT = 1;   // варіант за замовчуванням (обере власниця)

const MEM_START = 0.8; // повторення починається з 80 % точності (власниця, 07.11.2026)
function memRecall(m, now = memNow()) {
  if (!m) return 0;
  const e = Math.max(0, (now - m.t) / MEM_DAY);
  return Math.pow(1 + (19 / 81) * e / Math.max(0.05, m.s), -0.5);
}

function memRead(key) {
  let m = null;
  try { m = JSON.parse(storageGet(`${key}_mem`) || "null"); } catch (e) { return null; }
  // 07.11.2026: пам'ять, що почалася з першого тренування нижче 80 % (до правила MEM_START), — скидаємо: групу ще не вивчено
  if (m && !m.k && m.a < MEM_START) { storageSet(`${key}_mem`, "null"); return null; }
  return m;
}

// Стан групи: a — як вивчив (0…1), r — скільки пам'ятає зараз (0…1), due — час повторити, days — коли повторити
function memState(key, fallbackAcc = 0) {
  let m = memRead(key);
  if (!m && fallbackAcc >= MEM_START) { // старий прогрес (від 80 %) без даних про час: годинник пам'яті починає йти відтепер
    m = { s: 1, t: memNow(), a: fallbackAcc };
    storageSet(`${key}_mem`, JSON.stringify(m));
  }
  if (!m) return null;
  const r = memRecall(m);
  const left = m.t + m.s * MEM_DAY - memNow();
  return { a: m.a, r, due: r < MEM_DUE, days: left / MEM_DAY, s: m.s };
}

// Після тренування групи (acc — точність з першого разу, 0…1); info — для дослідження: {game, src, n, size}
function memUpdate(key, acc, info = {}) {
  const m = memRead(key);
  const pred = m ? memRecall(m) : null;
  let s;
  if (!m) s = acc >= 0.95 ? 0.2 : acc >= 0.8 ? 0.12 : 0.04;
  else {
    const k = Math.min(1.5, Math.max(0.1, 0.1 + 9 * (1 - memRecall(m))));
    s = acc >= 0.85 ? m.s * (1 + 2.2 * acc * k)
      : acc >= 0.6 ? m.s * (1 + 0.5 * k)
      : Math.max(0.04, m.s * 0.4);
  }
  s = Math.min(365, s);
  const now = memNow();
  storageSet(`${key}_mem`, JSON.stringify({
    s: +s.toFixed(4), t: now, a: +acc.toFixed(3),
    k: m ? (m.k || 0) + 1 : 0, f: m ? (m.f || m.t) : now, a0: m ? (m.a0 != null ? m.a0 : m.a) : +acc.toFixed(3)
  }));
  memLog(key, m, { ...info, obs: acc, pred, s1: s });
  return s;
}

// ---------- 📊 Дослідження: прогноз vs реальність (таблиця memory_log, memory-log.sql) ----------
// Кожне повторення (тренування, марафон, онлайн) — запис: що гра прогнозувала (pred) і яку точність показав учень (obs).
// Надсилається пачками раз на хвилину й при закритті вкладки; у симуляторі (memFakeNow) — ні.
const memLogQueue = [];
function memLog(key, m, d) {
  if ((typeof window !== "undefined" && window.memFakeNow) || typeof lbRequest !== "function" || typeof getPlayerId !== "function") return;
  if (!d.n) return;
  const game = d.game || (key.match(/^train_([a-z]+)/) || [])[1] || "";
  memLogQueue.push({
    player: getPlayerId(), game: game.replace(/[^a-z_0-9]/g, "").slice(0, 30) || "other", grp: key.slice(0, 160),
    src: d.src || "train", size: d.size || "", n: d.n, obs: +d.obs.toFixed(3), pred: d.pred == null ? "" : +d.pred.toFixed(3),
    elapsed: m ? +((memNow() - m.t) / MEM_DAY).toFixed(3) : "", s0: m ? m.s : "", s1: +(+d.s1).toFixed(4),
    reviews: m ? (m.k || 0) + 1 : 0, a0: m ? (m.a0 != null ? m.a0 : m.a) : +d.obs.toFixed(3), first: m ? (m.f || m.t) : memNow(),
    beta: typeof BETA !== "undefined" && BETA, course: typeof COURSE !== "undefined" && Boolean(COURSE)
  });
  if (memLogQueue.length >= 50) memLogFlush();
}
function memLogFlush() {
  if (!memLogQueue.length || typeof lbRequest !== "function") return;
  const rows = memLogQueue.splice(0, 50);
  lbRequest("rpc/log_memory", { method: "POST", body: JSON.stringify({ p_rows: rows }), keepalive: true }).catch(() => {});
}
if (typeof window !== "undefined" && !window.memFakeNow) {
  setInterval(memLogFlush, 60000);
  document.addEventListener("visibilitychange", () => { if (document.visibilityState === "hidden") memLogFlush(); });
}

// ---------- ➕/➖ Відповіді з інших режимів (марафон, онлайн-ігри) ----------
// Кожна відповідь іде в «рахунок» своєї групи (localStorage `<ключ>_tally` {c, n, t}). Коли відповідей набирається
// достатньо (≥ 30 % групи, щонайменше 5; для ще не вивченої групи — ≥ 60 %), рахунок стає «повторенням»:
//   • згадав так, як прогнозувала гра, або краще → пам'ять частково оновлюється й міцніє (вага — частка групи);
//   • забув значно більше, ніж прогнозувалося (точність нижча за прогноз на 15+ пунктів) → стабільність зменшується
//     так, щоб прогноз відповідав реальності (плитка швидше попросить повторити).
// Ідентифікатор картки (memSig) — той самий для елементів груп (TRAIN_GAMES) і для питань марафону/онлайну.
function memSig(game, x) {
  if (!x) return "";
  switch (game) {
    case "naholosy": return x.correct || "";
    case "klychnyi": return Array.isArray(x) ? `${x[0]}|${x[1]}` : "";
    case "chyslivnyky": return x.t || "";
    case "slovospoluch": return x.text != null ? `${x.text}|${x.ok}` : "";
    case "frazeolohizmy": return Array.isArray(x) ? x[1] : x.text || "";
    case "inshomovni": return Array.isArray(x) ? x[0] : "";
    case "inshe": return x._src != null ? `${x._src}|${x._i}` : "";
    case "leksychna": return x.nmt ? "" : x.wrong || ""; // leks.js: помилка (у тренуванні — рядок, у марафоні — картка)
    default: return "";
  }
}
const memIndexCache = {};
function memIndex(game) {
  if (memIndexCache[game]) return memIndexCache[game];
  const map = new Map();
  const add = (sig, key, size) => { if (!sig) return; if (!map.has(sig)) map.set(sig, []); map.get(sig).push({ key, size }); };
  if (game === "inshe") {
    if (typeof insheGroupsOf !== "function") return map;
    Object.keys(insheData).forEach(id => insheGroupsOf(id).forEach(g => g.items.forEach(c => add(memSig("inshe", c), g.key, g.items.length))));
  } else if (typeof TRAIN_GAMES !== "undefined" && TRAIN_GAMES[game]) {
    TRAIN_GAMES[game].groups().forEach(g => g.items.forEach(it => add(memSig(game, it), g.key, g.items.length)));
  } else return map;
  memIndexCache[game] = map;
  return map;
}
function memObserve(game, item, ok, src) {
  const sig = memSig(game, item);
  if (!sig) return;
  const groups = memIndex(game).get(sig);
  if (!groups) return;
  groups.forEach(({ key, size }) => {
    let t;
    try { t = JSON.parse(storageGet(`${key}_tally`) || "null"); } catch (e) { t = null; }
    if (!t || memNow() - t.t > 2 * MEM_DAY) t = { c: 0, n: 0, t: memNow() }; // старий рахунок не змішуємо з новим
    t.n++; if (ok) t.c++;
    const m = memRead(key);
    const need = m ? Math.max(5, Math.ceil(size * 0.3)) : Math.max(5, Math.ceil(size * 0.6));
    if (t.n < Math.min(need, size)) { storageSet(`${key}_tally`, JSON.stringify(t)); return; }
    storageSet(`${key}_tally`, "null");
    memApplyTally(key, m, t.c / t.n, t.n, size, game, src);
  });
}
function memApplyTally(key, m, acc, n, size, game, src) {
  const info = { game, src, n, size };
  if (!m) { if (acc >= MEM_START) memUpdate(key, acc, info); return; } // вивчив поза тренуванням (≥ 80 %) — годинник пам'яті почав іти
  const F = 19 / 81, now = memNow();
  const R = memRecall(m), e = Math.max(0, (now - m.t) / MEM_DAY), w = Math.min(1, n / size);
  let s = m.s, t = m.t;
  if (acc >= R - 0.1) {
    // ➕ згадав як прогнозувалось чи краще: часткове повторення
    const k = Math.min(1.5, Math.max(0.1, 0.1 + 9 * (1 - R)));
    const G = acc >= 0.85 ? 1 + 2.2 * acc * k : acc >= 0.6 ? 1 + 0.5 * k : 1;
    s = Math.min(365, m.s * (1 + (G - 1) * w));
    const Rn = R + (1 - R) * w;                  // освіжили лише частку групи
    const en = s * (Math.pow(Rn, -2) - 1) / F;   // скільки «днів забування» лишилось після освіження
    t = now - en * MEM_DAY;
  } else if (acc < R - 0.15 && e > 0) {
    // ➖ забув більше, ніж прогнозувалось: підганяємо стабільність під реальність
    const target = Math.max(0.05, Math.min(0.95, acc));
    const sCal = F * e / (Math.pow(target, -2) - 1);
    const w2 = Math.min(1, 0.4 + w); // забування — сильний сигнал: навіть частина групи важить багато
    s = Math.max(0.04, Math.min(m.s, Math.exp((1 - w2) * Math.log(m.s) + w2 * Math.log(sCal))));
  }
  storageSet(`${key}_mem`, JSON.stringify({ ...m, s: +s.toFixed(4), t, k: (m.k || 0) + 1, f: m.f || m.t, a0: m.a0 != null ? m.a0 : m.a }));
  memLog(key, m, { ...info, obs: acc, pred: R, s1: s });
}
// Марафон та інші режими через handleAnswer (тренування групами враховується окремо — у saveTrainingResults)
if (typeof handleAnswer === "function") {
  const memOrigHandle = handleAnswer;
  handleAnswer = function (isCorrect) {
    try {
      if (!lock && !training && currentGame && currentQuestion) memObserve(currentGame, currentQuestion, isCorrect, "marathon");
    } catch (e) { /* пам'ять не має ламати гру */ }
    return memOrigHandle.apply(this, arguments);
  };
}
// Онлайн-ігри (online.js): власна відповідь гравця, коли показують правильну
const memSeenBoxes = new WeakSet();
function memOnlineAnswer(box, q, picked) {
  try {
    if (picked == null || !box || memSeenBoxes.has(box) || typeof online === "undefined" || !online || typeof G !== "function") return;
    memSeenBoxes.add(box);
    const game = online.game || (typeof gameKey === "function" ? gameKey() : "");
    const ok = correctWords(q).includes(picked);
    let item = q;
    if (!(q && q.words)) { // картка (фразеологізми, кличний, словосполучення): елемент пулу за номером _i
      const card = q.card || (online.current && online.current.q === q ? online.current.card : null);
      item = card && card._i != null ? G().pool()[card._i] : null;
    }
    if (item) memObserve(game, item, ok, "online");
  } catch (e) { /* пам'ять не має ламати гру */ }
}

// «за 3 дні», «завтра», «за 1 годину» (власниця: «за», а не «через»)
function memWhen(days) {
  if (days < 0.9) { const h = Math.max(1, Math.round(days * 24)); return `за ${h} ${plural(h, "годину", "години", "годин")}`; }
  if (days <= 1.5) return "завтра";
  const d = Math.round(days);
  if (d < 30) return `за ${d} ${plural(d, "день", "дні", "днів")}`;
  const mo = Math.round(d / 30);
  return `за ${mo} ${plural(mo, "місяць", "місяці", "місяців")}`;
}

function memView() {
  const q = new URLSearchParams(location.search).get("view");
  if (q && /^[1-6]$/.test(q)) storageSet("train_view", q);
  return Number(storageGet("train_view")) || MEM_VIEW_DEFAULT;
}

// Колір і яскравість плитки. a — точність (червоно-жовтий 15 → зелений 125), r — пам'ять (яскравість)
function memPaint(btn, st, view = memView()) {
  if (!st) return;
  const hue = Math.round(15 + 110 * st.a);
  const r = Math.max(0, Math.min(1, st.r));
  btn.classList.remove("tried", "mastered");
  btn.classList.add("mem-tile", `mem-v${view}`);
  btn.classList.toggle("mem-due", st.due);
  btn.classList.toggle("mem-top", st.a >= 0.999 && !st.due);
  btn.style.setProperty("--mh", hue);
  btn.style.setProperty("--mr", r.toFixed(3));
  btn.style.setProperty("--ma", st.a.toFixed(3));
  // «яскравість» 0…1: свіжа пам'ять — 1, за місяць без повторень — ледь видно
  const glow = Math.max(0, (r - 0.45) / 0.55);
  btn.style.setProperty("--mg", glow.toFixed(3));
  btn.title = st.due ? "Знання згасають — час повторити" : `Пам'ятаєш добре · повтори ${memWhen(st.days)}`;
  const mark = document.createElement("span");
  mark.className = "mem-mark";
  if (view === 2) { // батарейка
    mark.innerHTML = '<span class="mem-bat"><span class="mem-bat-fill"></span></span>';
  } else if (view === 4 || view === 6) { // рослинка
    mark.textContent = st.due ? (r < 0.75 ? "🥀" : "🍂") : st.a >= 0.999 ? "🌳" : st.a >= 0.7 ? "🌿" : "🌱";
  } else if (view === 5) {
    mark.innerHTML = '<span class="mem-bat"><span class="mem-bat-fill"></span></span>';
  }
  if (view === 2 || view >= 4) { btn.classList.add("mem-has-mark"); btn.prepend(mark); }
  if (st.due) {
    const due = document.createElement("span");
    due.className = "mem-due-tag";
    due.textContent = "🔁 повтори";
    btn.appendChild(due);
  }
}

// 07.11.2026 (власниця): повторення (пам'ять, «повтори за …», нагадування) починається лише з 80 % точності.
// Нижче — групу ще не вивчено: підсумок мотивує спробувати ще раз і пропонує нагадати в Telegram (функція later-remind).
function memLowNote(t) {
  memOverNote(0);
  const box = document.getElementById("train-mem");
  const pct = Math.round(t.memLow * 100);
  const left = 80 - pct;
  const head = pct >= 65 ? `💪 ${pct}% — лишилося зовсім трошки!` : pct >= 40 ? `💪 ${pct}% — уже непогано, ти зможеш більше!` : `🌱 ${pct}% — це тільки початок, ти впораєшся!`;
  const note = document.createElement("div");
  // власниця, 08.11.2026: коротко й структуровано, без суцільного тексту
  note.innerHTML = `<p class="mem-note-big">${head}</p>
    <p class="mem-note-small">🎯 Ціль — <b>80 %</b>: тоді гра нагадуватиме, коли повторити.</p>
    <div class="mem-later"><button type="button" class="mem-later-btn">⏰ Нагадати пізніше</button></div>`;
  box.prepend(note);
  const again = document.getElementById("btn-train-again");
  if (again) { again.textContent = "💪 Ще одна спроба"; again.className = "btn-primary"; again.style.order = "-1"; } // головна дія — першою
  const fix = document.getElementById("btn-fix-mistakes");
  if (fix) fix.className = "btn-secondary";
  const wrap = note.querySelector(".mem-later");
  const link = box.querySelector(".mem-note-link");
  if (link) wrap.appendChild(link); // «Нагадати пізніше» і «Як працює забування» — одним рядком
  note.querySelector(".mem-later-btn").onclick = () => {
    const initData = typeof telegramInitData === "function" ? telegramInitData() : "";
    if (!initData) { wrap.innerHTML = `<p class="mem-note-small">Нагадування надсилає бот @ukrmovych_bot — відкрий гру в Telegram, і він нагадає 🙂</p>`; return; }
    wrap.innerHTML = `<p class="mem-note-small">Коли нагадати?</p><div class="mem-later-opts">
      <button type="button" class="btn-secondary" data-when="1h">За 1 годину</button>
      <button type="button" class="btn-secondary" data-when="3h">За 3 години</button>
      <button type="button" class="btn-secondary" data-when="tomorrow">Завтра</button></div>`;
    wrap.querySelectorAll("[data-when]").forEach(b => b.onclick = () => memLater(t, b.dataset.when, wrap, initData, pct));
  };
}
function memLater(t, when, wrap, initData, pct) {
  const go = t.game === "inshe" && typeof insheQuiz !== "undefined" && insheQuiz ? "inshe_" + insheQuiz.id : t.game;
  const g = typeof GAMES !== "undefined" && GAMES.find(x => x.id === t.game);
  const gameName = t.game === "inshe" && insheQuiz ? `${insheQuiz.icon || "📂"} ${insheQuiz.name}` : g ? `${g.icon} ${g.name}` : "";
  const grp = t.groups.length === 1 ? t.groups[0].name : (t.memLowName || "");
  wrap.innerHTML = `<p class="mem-note-small">⏳ Записую…</p>`;
  fetch(`${LB.url}/functions/v1/later-remind`, {
    method: "POST",
    headers: { apikey: LB.anonKey, Authorization: `Bearer ${LB.anonKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({ initData, player: getPlayerId(), when, go, game: gameName, grp, pct })
  }).then(r => r.json()).then(r => {
    const txt = when === "1h" ? "за годину" : when === "3h" ? "за 3 години" : "завтра";
    wrap.innerHTML = r && r.ok
      ? `<p class="mem-note-small">✅ Домовилися! Бот нагадає ${r.shifted ? "зранку (уночі не турбуємо)" : txt} 👋</p>`
      : `<p class="mem-note-small">Не вийшло записати нагадування 😕 Спробуй ще раз трохи згодом.</p>`;
  }).catch(() => { wrap.innerHTML = `<p class="mem-note-small">Немає зв'язку — спробуй ще раз трохи згодом.</p>`; });
}

// Підсумок тренування: після ПЕРШОГО вивчення групи — крупно «Повтори через 5 годин!», дрібніше пояснення,
// посилання на довідку pamyat.html. first = s нової пам'яті (дні) або 0 — лише посилання, -1 — сховати.
function memOverNote(first) {
  const again = document.getElementById("btn-train-again");
  if (again) { again.textContent = "Ще раз цю групу"; again.className = "btn-secondary"; again.style.order = ""; } // memLowNote міняє на «Ще одна спроба»
  const fix = document.getElementById("btn-fix-mistakes");
  if (fix) fix.className = "btn-primary";
  let box = document.getElementById("train-mem");
  if (!box) {
    box = document.createElement("div");
    box.id = "train-mem";
    box.className = "mem-note";
    document.getElementById("train-sub").after(box);
  }
  box.hidden = first < 0;
  if (first < 0) return;
  box.innerHTML = first > 0
    ? `<p class="mem-note-big">⏰ Повтори ${memWhen(first)}!</p>
       <p class="mem-note-small">Перші години — найважливіші. Далі повторювати треба буде дедалі рідше.</p>`
    : "";
  const link = document.createElement("a");
  link.className = "mem-note-link";
  link.href = "pamyat.html";
  link.textContent = "🧠 Як працює забування →";
  box.appendChild(link);
}

// 🧠 Загальний стан пам'яті гри — у шапці «Тренування» (видно й до розгортання): смужка + «пам'ятаєш ≈ 46 %»
// = Σ(точність · пам'ять зараз · розмір групи) / Σ розмір усіх груп; колір — як у плиток.
function memSummary(el, groups) {
  let sum = 0, all = 0, seen = 0, a = 0;
  groups.forEach(g => {
    const n = g.items.length;
    all += n;
    const m = memRead(g.key);
    if (!m) return;
    seen += n;
    sum += m.a * memRecall(m) * n;
    a += m.a * n;
  });
  const old = el.parentNode && el.parentNode.querySelector(".mem-sum");
  if (old) old.remove();
  if (!all || !seen) return;
  const pct = Math.round(sum / all * 100);
  const box = document.createElement("span");
  box.className = "mem-sum";
  box.style.setProperty("--mh", Math.round(15 + 110 * (a / seen)));
  box.style.setProperty("--mg", Math.max(0, Math.min(1, (sum / a - 0.45) / 0.55)).toFixed(3));
  box.innerHTML = `<span class="mem-sum-bar"><span style="width:${pct}%"></span></span><span class="mem-sum-txt">🧠 зараз пам'ятаєш ≈ ${pct}% усього</span>`;
  el.after(box);
}

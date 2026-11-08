// 📅 «Мій план» (PRO, власниця, 05.11.2026): учень САМ складає план — що вчити, до якої дати, у які дні — і сам рахує
// (скільки занять, скільки нових груп за заняття, контрольні точки); гра лише перевіряє, підказує й показує наслідки
// (хвилини на заняття, дата завершення). Ціль власниці — потренувати вміння планувати, а не скласти план за учня.
// План — localStorage `player_plan`; у Telegram — ще й на сервері (функція my-plan, my-plan.sql): у кожній контрольній
// точці бот @ukrmovych_bot пише, чи встигає учень (вивчені групи — зі знімка snapshot.js). Вимкнути сповіщення,
// переробити чи видалити план — на екрані плану. Вивчена група = є `<ключ групи>_mem` (memory.js: пройдено ≥ 60 % групи).
// Відкрити: плитка «📅 Мій план» у меню (GAMES.plan) або …/gym/?go=plan (go.js).
const PLAN_KEY = "player_plan";
const PLAN_SEC_PER_ITEM = 24; // вивчити картку й повторити її ще ~4 рази (5 год, наступного дня, 2 дні, тиждень) ≈ 24 с
const PLAN_DAYS = ["Нд", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"];
const PLAN_FREQ = { week: "щотижня", "2weeks": "раз на 2 тижні", month: "раз на місяць" };
let planDraft = null;
// 📚 Розділи програми НМТ: скільки правильних відповідей (з 45) дає розділ — від власниці; тренажери, що його покривають
const PLAN_SECTIONS = [
  { id: "sec_fon", icon: "🔊", name: "Звуки й наголоси", pts: 2, from: ["naholosy", "inshe_fonetyka", "inshe_naholos"] },
  { id: "sec_slov", icon: "🧩", name: "Словотвір", pts: 1, from: ["inshe_budova"] },
  { id: "sec_lex", icon: "📚", name: "Лексика", pts: 3, from: ["inshomovni", "slovospoluch", "inshe_leksyka"] },
  { id: "sec_fraz", icon: "💬", name: "Фразеологізми", pts: 4, from: ["frazeolohizmy"] },
  { id: "sec_orf", icon: "✍️", name: "Орфографія", pts: 6, from: ["inshe_orfohrafiia"] },
  { id: "sec_morf", icon: "🔤", name: "Морфологія", pts: 9, from: ["inshe_morfolohiia", "klychnyi", "chyslivnyky"] },
  { id: "sec_syn", icon: "🧱", name: "Синтаксис", pts: 20, from: ["inshe_syntaksys"] }
];
// шкала НМТ-2026 з української мови (Додаток 5 до Порядку прийому 2026; як scale.js у testtest): тестовий бал 8…45 → 100…200
const PLAN_UKR_SCALE = { from: 8, v: [100, 105, 110, 120, 125, 130, 134, 136, 138, 140, 142, 143, 144, 145, 146, 148, 149, 150, 152, 154, 156, 157, 159, 160, 162, 163, 165, 167, 170, 172, 175, 177, 180, 183, 186, 191, 195, 200] };
const planScale = pts => pts < PLAN_UKR_SCALE.from ? null : PLAN_UKR_SCALE.v[Math.min(pts, 45) - PLAN_UKR_SCALE.from];
function planSectionUnits(catalog) {
  return PLAN_SECTIONS.map(sec => {
    const parts = sec.from.map(id => catalog.find(u => u.id === id)).filter(Boolean);
    return { id: sec.id, icon: sec.icon, name: sec.name, pts: sec.pts, parts: parts.map(u => `${u.icon} ${u.name.replace(/^Інше: /, "")}`),
      keys: parts.flatMap(u => u.keys), sizes: parts.flatMap(u => u.sizes), items: parts.reduce((s, u) => s + u.items, 0) };
  }).filter(u => u.keys.length);
}
let planCatalog = null;

screens.plan = (() => {
  const main = document.createElement("main");
  main.id = "plan-screen";
  main.className = "screen";
  main.hidden = true;
  main.innerHTML = `
    <header class="top-bar">
      <button id="btn-plan-back" class="icon-btn" aria-label="Назад">‹ Меню</button>
      <h2 class="screen-title">📅 Мій план</h2>
    </header>
    <div id="plan-body" class="plan-body"></div>`;
  $("menu").after(main);
  main.querySelector("#btn-plan-back").addEventListener("click", () => { showScreen("menu"); renderBestScores(); });
  return main;
})();

// ---------- дати ----------
const planIso = d => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
const planDate = s => { const [y, m, d] = s.split("-").map(Number); return new Date(y, m - 1, d); };
const planToday = () => { const d = new Date(); d.setHours(0, 0, 0, 0); return d; };
const planHuman = s => planDate(s).toLocaleDateString("uk-UA", { day: "numeric", month: "long" });
const planWord = (n, a, b, c) => `${n} ${plural(n, a, b, c)}`;
// заняття від `from` до `to` включно у вибрані дні тижня
function planSessions(from, to, days) {
  const out = [];
  const d = new Date(from);
  while (d <= to && out.length < 2000) { if (days.includes(d.getDay())) out.push(planIso(d)); d.setDate(d.getDate() + 1); }
  return out;
}
function planCheckpointDates(start, end, freq) {
  const out = [];
  const d = new Date(start);
  for (let i = 0; i < 60; i++) {
    if (freq === "month") d.setMonth(d.getMonth() + 1); else d.setDate(d.getDate() + (freq === "2weeks" ? 14 : 7));
    if (d >= end) break;
    out.push(planIso(d));
  }
  out.push(planIso(end));
  return out;
}

// ---------- що можна вчити: групи тренувань ----------
async function planBuildCatalog() {
  const units = [];
  const clean = list => (list || []).filter(g => !g.topic && !String(g.name).startsWith("💥"));
  const add = (id, icon, name, groups) => {
    groups = clean(groups);
    if (!groups.length) return;
    const items = groups.reduce((s, g) => s + ((g.items && g.items.length) || 0), 0);
    units.push({ id, icon, name, keys: groups.map(g => g.key), sizes: groups.map(g => (g.items && g.items.length) || 1), items });
  };
  const names = { naholosy: ["🗣️", "Наголоси"], inshomovni: ["🌍", "Іншомовні слова"], frazeolohizmy: ["💬", "Фразеологізми"],
    slovospoluch: ["🧩", "Словосполучення"], chyslivnyky: ["🔢", "Числівники"], klychnyi: ["📣", "Кличний відмінок"] };
  Object.keys(names).forEach(id => { try { if (TRAIN_GAMES[id]) add(id, names[id][0], names[id][1], TRAIN_GAMES[id].groups()); } catch (e) { /* немає даних */ } });
  try {
    if (typeof insheLoad === "function") await insheLoad();
    INSHE_SECTIONS.filter(s => s.id !== "mix").forEach(sec => {
      const groups = [];
      (sec.quizzes || []).forEach(q => { try { groups.push(...insheGroupsOf(q[0])); } catch (e) { /* */ } });
      add(sec.id === "istoriia" ? "istoriia" : "inshe_" + sec.id, sec.id === "istoriia" ? "🏛️" : sec.icon,
        sec.id === "istoriia" ? "Історія України" : `Інше: ${sec.name}`, groups);
    });
  } catch (e) { /* «Інше» не завантажилось */ }
  return units;
}
function planLearned(keys) { return keys.filter(k => storageGet(`${k}_mem`) != null).length; }
// з частинами: група з пам'яттю (_mem) — 1; інакше частка вивчених карток (найкращий результат / розмір, кличний — _acc)
function planGroupPart(key, size) {
  if (storageGet(`${key}_mem`) != null) return 1;
  let got = Number(storageGet(key)) || 0;
  try { const acc = JSON.parse(storageGet(`${key}_acc`) || "null"); if (acc && acc.n) got = Math.max(got, acc.c); } catch (e) { /* */ }
  return size ? Math.min(0.99, got / size) : 0;
}
function planLearnedOf(u) { return u.keys.reduce((s, k, i) => s + planGroupPart(k, (u.sizes && u.sizes[i]) || 0), 0); }

function planLoad() { try { return JSON.parse(storageGet(PLAN_KEY) || "null"); } catch (e) { return null; } }
function planSave(p) {
  if (p) storageSet(PLAN_KEY, JSON.stringify(p)); else { try { localStorage.removeItem(PLAN_KEY); } catch (e) { /* */ } }
  planSync(p);
}

// на сервер — лише в Telegram (бот надсилає перевірку в контрольних точках)
function planSync(p) {
  const initData = typeof telegramInitData === "function" ? telegramInitData() : "";
  if (!initData || !LB || !LB.url) return;
  const plan = p ? { ...p, units: p.units.map(u => ({ id: u.id, name: u.name, icon: u.icon, keys: u.keys, sizes: u.sizes })) } : null;
  fetch(`${LB.url}/functions/v1/my-plan`, {
    method: "POST",
    headers: { apikey: LB.anonKey, Authorization: `Bearer ${LB.anonKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({ initData, player: getPlayerId(), plan })
  }).catch(() => {});
}

async function showPlan(edit = false) {
  showScreen("plan");
  const body = $("plan-body");
  const plan = planLoad();
  if (plan && !edit) { renderPlanView(plan); return; }
  body.innerHTML = '<p class="plan-hint">Завантажуємо тренажери…</p>';
  if (!planCatalog) planCatalog = await planBuildCatalog();
  planDraft = plan ? JSON.parse(JSON.stringify({ ...plan, step: 5, answerD: String(plan.sessions), answerN: planFmt(plan.perSession),
    checkpoints: plan.checkpoints.map(c => ({ date: c.date, target: planFmt(c.target), ok: true, auto: true })) })) : {
    mode: "sections", units: [], deadline: "", days: [1, 3, 5], freq: "month", checkpoints: [], notify: true, step: 1, answerD: "", answerN: ""
  };
  planDraft.tries = {}; planDraft.notes = {};
  if (plan) {
    planDraft.mode = plan.mode || (plan.units.some(u => u.id.startsWith("sec_")) ? "sections" : "trainers");
    const pool = planDraft.mode === "sections" ? planSectionUnits(planCatalog) : planCatalog;
    planDraft.units = planDraft.units.map(u => pool.find(c => c.id === u.id) || u);
  }
  renderPlanWizard();
}

// ---------- конструктор ----------
// числа: можна вписувати з комою; групи — цілі або половинки
const planNum = v => { const x = Number(String(v).replace(",", ".").replace(/\s/g, "")); return String(v).trim() === "" || !isFinite(x) ? null : x; };
const planFmt = v => String(Math.round(v * 100) / 100).replace(".", ",");
const planHalf = v => Math.round(v * 2) / 2;
const planGr = (v, a, b, c) => Number.isInteger(v) ? plural(v, a, b, c) : b; // 1,5 групи
function planNumbers(d) {
  const start = planToday();
  const end = d.deadline ? planDate(d.deadline) : null;
  const G = d.units.reduce((s, u) => s + u.keys.length, 0);
  const items = d.units.reduce((s, u) => s + u.items, 0);
  const done = planHalf(d.units.reduce((s, u) => s + planLearnedOf(u), 0));
  const left = Math.max(0, G - done);
  const sessions = end && end > start && d.days.length ? planSessions(start, end, d.days) : [];
  const weeks = end ? Math.round((end - start) / 864e5 / 7 * 10) / 10 : 0;
  return { start, end, G, items, done, left, sessions, D: sessions.length, weeks, perGroup: G ? items / G : 0 };
}

// 🧮 відповіді учнів — для статистики власниці (що вписують і що правильно): plan-answers.sql
let planLogQueue = [];
function planLog(field, entered, correct, ok, ctx) {
  planLogQueue.push({ field, entered, correct, ok, ctx, at: new Date().toISOString() });
  clearTimeout(planLog.t);
  planLog.t = setTimeout(() => {
    const rows = planLogQueue.splice(0);
    if (!rows.length || typeof lbRequest !== "function") return;
    lbRequest("rpc/log_plan_answers", { method: "POST", body: JSON.stringify({ p_player: getPlayerId(), p_rows: rows }), keepalive: true }).catch(() => {});
  }, 1500);
}

function renderPlanWizard() {
  const d = planDraft, body = $("plan-body");
  const x = planNumbers(d);
  const step = (n, title, html, open) => `<section class="plan-step${open ? "" : " plan-off"}"><h3><span class="plan-num">${n}</span>${title}</h3>${open ? html : ""}</section>`;
  // 1. що вчу
  const secMode = d.mode === "sections";
  const tabs = `<div class="plan-tabs"><button type="button" class="plan-tab${secMode ? " on" : ""}" data-mode="sections">📚 Розділи НМТ</button><button type="button" class="plan-tab${secMode ? "" : " on"}" data-mode="trainers">🎮 Окремі тренажери</button></div>`;
  const secPts = d.units.reduce((s, u) => s + (u.pts || 0), 0);
  const secScore = planScale(secPts);
  const unitsHtml = tabs + (secMode ? `<p class="plan-hint">Обери розділи програми, які хочеш знати до своєї дати. Біля кожного — скільки правильних відповідей із 45 він дає на НМТ.</p>
    <div class="plan-units">${planSectionUnits(planCatalog).map(u => {
      const on = d.units.some(x => x.id === u.id), learned = planHalf(planLearnedOf(u));
      return `<label class="plan-unit${on ? " on" : ""}"><input type="checkbox" data-unit="${u.id}"${on ? " checked" : ""}>
        <span class="plan-unit-ico">${u.icon}</span><span class="plan-unit-name">${u.name} <b class="plan-pts">${u.pts}/45</b><small>${u.parts.join(", ")}</small><small>${planWord(u.keys.length, "група", "групи", "груп")} · ${u.items} ${plural(u.items, "картка", "картки", "карток")}${learned ? ` · уже вивчено ${planFmt(learned)}` : ""}</small></span></label>`;
    }).join("")}</div>
    ${d.units.length ? `<p class="plan-score">Знатимеш на <b>${secPts}/45</b> 👉 це <b>${secScore ? `${secScore}/200` : "поріг ще не подолано"}</b>${secScore ? "" : ` (треба щонайменше ${PLAN_UKR_SCALE.from}/45)`}</p>
      <p class="plan-hint">Якщо вивчиш ці розділи на всі 100 %. Шкала переведення НМТ-2026.</p>` : ""}` : `<p class="plan-hint">Обери, що хочеш знати до своєї дати. Тренування поділене на групи — вчиш групу, а гра потім нагадує її повторити.</p>
    ${(() => {
      const tile = u => {
        const on = d.units.some(x => x.id === u.id), learned = planHalf(planLearnedOf(u));
        return `<label class="plan-unit${on ? " on" : ""}"><input type="checkbox" data-unit="${u.id}"${on ? " checked" : ""}>
        <span class="plan-unit-ico">${u.icon}</span><span class="plan-unit-name">${u.name}<small>${planWord(u.keys.length, "група", "групи", "груп")} · ${u.items} ${plural(u.items, "картка", "картки", "карток")}${learned ? ` · уже вивчено ${planFmt(learned)}` : ""}</small></span></label>`;
      };
      const memo = ["naholosy", "frazeolohizmy", "inshomovni"];
      return `<p class="plan-sub">🧠 Вчити напам'ять — тут правил немає, треба просто знати кожне слово:</p>
        <div class="plan-units">${planCatalog.filter(u => memo.includes(u.id)).map(tile).join("")}</div>
        <p class="plan-sub">📏 Інші тренажери — їх теж можна вчити, але тут легше запам'ятати правило, а в грі просто тренуватися:</p>
        <div class="plan-units">${planCatalog.filter(u => !memo.includes(u.id)).map(tile).join("")}</div>`;
    })()}`) +
    (x.G ? `<p class="plan-total">Разом: <b>${planWord(x.G, "група", "групи", "груп")}</b>${x.done ? `, з них уже вивчено ${planFmt(x.done)} — лишається <b>${planFmt(x.left)}</b>` : ""}.</p>` : "");
  // 2. коли
  const minDate = planIso(new Date(Date.now() + 7 * 864e5));
  const whenHtml = `<label class="plan-field">🎯 До якої дати хочу все знати?<input type="date" id="plan-deadline" min="${minDate}" value="${d.deadline}"></label>
    <p class="plan-hint">У які дні тижня займатимешся? Пам'ятай: краще реальні 3 дні роботи, ніж 7, які пропускатимеш і відкладатимеш.</p>
    <div class="plan-days">${[1, 2, 3, 4, 5, 6, 0].map(i => `<button type="button" class="plan-day${d.days.includes(i) ? " on" : ""}" data-day="${i}">${PLAN_DAYS[i]}</button>`).join("")}</div>
    ${x.end && d.days.length ? `<p class="plan-total">До ${planHuman(d.deadline)} — приблизно <b>${planFmt(x.weeks)} ${plural(Math.round(x.weeks), "тиждень", "тижні", "тижнів")}</b>, ти займаєшся <b>${planWord(d.days.length, "раз", "рази", "разів")} на тиждень</b>.</p>` : ""}`;
  // 3. рахуємо
  const dv = planNum(d.answerD);
  const okD = dv !== null && Math.abs(dv - x.D) <= Math.max(1, Math.round(x.D * 0.06));
  const nv = planNum(d.answerN);
  const nHalf = nv !== null && nv > 0 && Math.abs(nv * 2 - Math.round(nv * 2)) < 1e-9;
  const n = nHalf ? nv : 0;
  const enough = n > 0 && n * x.D >= x.left - 1e-9;
  const minN = x.D ? Math.ceil(x.left / x.D * 2 - 1e-9) / 2 : 0;
  const finishIdx = n > 0 ? Math.ceil(x.left / n - 1e-9) - 1 : -1;
  const mins = Math.round(n * x.perGroup * PLAN_SEC_PER_ITEM / 60);
  let calcHtml = `<p class="plan-q">🧮 Скільки в тебе буде занять до ${x.end ? planHuman(d.deadline) : "цієї дати"}?</p>
    <div class="plan-row"><input type="text" inputmode="decimal" autocomplete="off" class="plan-in" id="plan-d" value="${d.answerD}" placeholder="?"><button type="button" class="plan-mini" id="plan-d-hint">💡 Як порахувати</button></div>
    <p class="plan-help" id="plan-d-help"${d.answerD !== "" && !okD ? "" : " hidden"}>Помнож тижні до дати на кількість занять на тиждень: ${planFmt(x.weeks)} × ${d.days.length} = ? (можна округлити)</p>`;
  if (d.answerD !== "") {
    calcHtml += okD
      ? `${d.notes && d.notes.D ? `<p class="plan-help">🧮 ${d.notes.D}</p>` : ""}<p class="plan-ok">✅ ${d.notes && d.notes.D ? "" : "Так! "}Точно за календарем — <b>${planWord(x.D, "заняття", "заняття", "занять")}</b>.</p>`
      : `<p class="plan-bad">Не зовсім 🤔 ${dv !== null && dv === d.days.length ? "Це кількість занять за один тиждень — а тижнів до дати багато." : dv !== null && Math.abs(dv - Math.round(x.weeks)) <= 1 ? "Це кількість тижнів — а занять у тижні кілька." : "Подивись підказку вище й спробуй ще."}</p>`;
  }
  if (okD) {
    calcHtml += `<p class="plan-q">🧮 Треба вивчити ${planFmt(x.left)} ${planGr(x.left, "групу", "групи", "груп")} за ${planWord(x.D, "заняття", "заняття", "занять")}. Скільки нових груп потрібно вчити на кожному занятті?</p>
      <p class="plan-hint">Можна вчити й половину групи: 1; 1,5; 2; 2,5…</p>
      <div class="plan-row"><input type="text" inputmode="decimal" autocomplete="off" class="plan-in" id="plan-n" value="${d.answerN}" placeholder="?"><button type="button" class="plan-mini" id="plan-n-hint">💡 Підказка</button></div>
      <p class="plan-help" id="plan-n-help"${d.answerN !== "" && !enough ? "" : " hidden"}>Поділи групи на заняття: ${planFmt(x.left)} ÷ ${x.D} = ${planFmt(Math.round(x.left / x.D * 100) / 100)}. Округли вгору до цілого чи до половинки.</p>`;
    if (d.answerN !== "") {
      if (nv === null || nv <= 0) calcHtml += `<p class="plan-bad">Впиши число — скільки груп за одне заняття, наприклад 1 або 1,5.</p>`;
      else if (!nHalf) calcHtml += `<p class="plan-bad">Можна лише цілі групи або половинки (1; 1,5; 2…). ${planFmt(nv)} округли вгору — до ${planFmt(Math.ceil(nv * 2) / 2)}.</p>`;
      else if (!enough) calcHtml += `<p class="plan-bad">❌ Не встигаєш: ${planFmt(n)} × ${x.D} = ${planFmt(n * x.D)}, а треба ${planFmt(x.left)}. Візьми більше груп на заняття, додай днів на тиждень або перенеси дату.</p>`;
      else {
        if (d.notes && d.notes.N) calcHtml += `<p class="plan-help">🧮 ${d.notes.N}</p>`;
        calcHtml += `<p class="plan-ok">✅ Встигаєш! ${planFmt(n)} × ${x.D} = ${planFmt(n * x.D)} — це не менше за ${planFmt(x.left)}. Останню нову групу вивчиш <b>${planHuman(x.sessions[Math.max(0, finishIdx)])}</b>${finishIdx < x.D - 1 ? ` — далі до дати лишаться ${planWord(x.D - 1 - finishIdx, "заняття", "заняття", "занять")} на повторення` : ""}.</p>`;
        if (n > minN) calcHtml += `<p class="plan-hint">💡 Можна й менше: щоб закінчити якраз до ${planHuman(d.deadline)}, вистачить ${planFmt(minN)} на заняття.</p>`;
        if (!Number.isInteger(n)) calcHtml += `<p class="plan-hint">½ групи — це половина її карток: пройди їх і натисни «Завершити». Наступного разу доведеш групу до кінця — гра врахує обидві половинки.</p>`;
        calcHtml += `<p class="plan-total">⏱ Це приблизно <b>${mins} хв</b> на заняття (нові групи + повторення вивченого).${mins > 60 ? " Дуже багато — може, додати днів чи перенести дату?" : mins <= 10 ? " Легко! 😎" : ""}</p>`;
      }
    }
  }
  // 4. контрольні точки — по черзі, з підказкою біля кожної; після 3 правильно вписаних — «Розрахувати решту»
  let cpHtml = "";
  const kOf = date => x.sessions.filter(s => s <= date).length;
  const expect = date => Math.min(x.G, planHalf(x.done + kOf(date) * n));
  if (okD && enough) {
    const dates = planCheckpointDates(x.start, x.end, d.freq);
    if (d.checkpoints.length !== dates.length || d.checkpoints.some((c, i) => c.date !== dates[i])) {
      d.checkpoints = dates.map((date, i) => ({ date, target: "", ok: false }));
    }
    const active = d.checkpoints.findIndex(c => !c.ok);
    const typedOk = d.checkpoints.filter(c => c.ok).length; // пройдені точки — будь-які (і вписані гравцем, і виправлені грою після 2 спроб)
    const finishDate = x.sessions[Math.max(0, finishIdx)];
    const hintFor = i => {
      const c = d.checkpoints[i], k = kOf(c.date), e = expect(c.date);
      const prev = i ? d.checkpoints[i - 1] : null;
      const v = planNum(c.target);
      let h = "";
      if (i === 0) h = `${x.done ? `Ти вже вивчив <b>${planFmt(x.done)}</b> ${planGr(x.done, "групу", "групи", "груп")}. ` : ""}Далі вчиш по <b>${planFmt(n)}</b> ${planGr(n, "нову групу", "нові групи", "нових груп")} на заняття. До ${planHuman(c.date)} — <b>${planWord(k, "заняття", "заняття", "занять")}</b>. Скільки груп ти маєш <b>уже знати</b> ${planHuman(c.date)}?`;
      else h = `До попередньої точки (${planHuman(prev.date)}) ти знатимеш <b>${prev.target}</b>. Між точками ще <b>${planWord(k - kOf(prev.date), "заняття", "заняття", "занять")}</b>, на кожному — ${planFmt(n)} ${planGr(n, "нова група", "нові групи", "нових груп")}. Скільки груп маєш <b>уже знати</b> ${planHuman(c.date)}?`;
      if (e >= x.G && finishDate <= c.date) h += ` <br>⚠️ Зверни увагу: останню нову групу за твоїм планом ти вивчиш ${planHuman(finishDate)} — ще до цієї точки. Тобто до ${planHuman(c.date)} ти вже знатимеш <b>усі групи плану</b>. Впиши, скільки їх усього (крок 1: ${x.G}).`;
      if (c.target === "" || v === null) return `<p class="plan-help plan-help-now">💡 ${h}</p>`;
      // неправильна відповідь — пояснюємо, що саме змінити
      let why;
      const kn = planHalf(k * n);
      if (v > x.G) why = `У твоєму плані всього ${x.G} ${plural(x.G, "група", "групи", "груп")} — більше вивчити не вийде. Останню ти вивчиш ${planHuman(finishDate)}, тож до ${planHuman(c.date)} знатимеш їх усі: впиши ${x.G}.`;
      else if (x.done && Math.abs(v - Math.min(x.G, kn)) < 1e-9 && e !== v) why = `Майже! ${k} × ${planFmt(n)} = ${planFmt(kn)} — це нові групи. Додай ще ${planFmt(x.done)}, які вже вивчив.`;
      else if (prev && v < planNum(prev.target)) { const kp = kOf(prev.date), add = planHalf((k - kp) * n); why = `Тут має бути більше, ніж ${prev.target}: стільки ти знатимеш уже до попередньої точки. Між точками ще ${planWord(k - kp, "заняття", "заняття", "занять")}, тобто додаси ${k - kp} × ${planFmt(n)} = ${planFmt(add)}. Порахуй: ${prev.target} + ${planFmt(add)} = ?${planNum(prev.target) + add > x.G ? ` (але не більше за ${x.G} — усього груп у плані)` : ""}`; }
      else if (Math.abs(v - planHalf(k * n + x.done)) < 1e-9 && e === x.G) why = `${k} × ${planFmt(n)}${x.done ? ` + ${planFmt(x.done)}` : ""} = ${planFmt(planHalf(k * n + x.done))} — але більше ніж ${x.G} груп у плані немає.`;
      else why = `Порахуй так: ${k} ${plural(k, "заняття", "заняття", "занять")} × ${planFmt(n)} = ?${x.done ? ` Потім додай ${planFmt(x.done)} уже вивчених.` : ""}${e === x.G ? ` Вийшло більше за ${x.G}? Тоді впиши ${x.G} — більше груп у плані немає.` : ""}`;
      return `<p class="plan-bad">✏️ ${why}</p><p class="plan-help plan-help-now">💡 ${h}</p>`;
    };
    cpHtml = `<p class="plan-hint">Як часто перевірятимеш, чи встигаєш? У ці дні бот напише тобі, скільки вже вивчено.</p>
      <div class="plan-days">${Object.entries(PLAN_FREQ).map(([k, v]) => `<button type="button" class="plan-day plan-freq${d.freq === k ? " on" : ""}" data-freq="${k}">${v}</button>`).join("")}</div>
      <p class="plan-q">🚩 Скільки груп ти маєш уже знати до кожної точки?</p>
      <table class="plan-cp"><tr><th>Дата</th><th>Занять до неї</th><th>Знатиму груп</th></tr>
      ${d.checkpoints.map((c, i) => {
        const locked = active >= 0 && i > active;
        return `<tr class="${i === active ? "plan-cp-now" : ""}"><td>${planHuman(c.date)}${i === d.checkpoints.length - 1 ? " 🎯" : ""}</td><td>${kOf(c.date)}</td>
          <td>${locked ? '<span class="plan-cp-lock">…</span>' : `<input type="text" inputmode="decimal" autocomplete="off" class="plan-in plan-in-sm" data-cp="${i}" value="${c.target}" placeholder="?"${c.ok ? " readonly" : ""}>${c.ok ? " ✅" : ""}`}</td></tr>
          ${i === active ? `<tr class="plan-cp-hint"><td colspan="3">${hintFor(i)}</td></tr>` : c.note ? `<tr class="plan-cp-hint"><td colspan="3"><p class="plan-help">🧮 ${c.note}</p></td></tr>` : ""}`;
      }).join("")}
      </table>
      ${active >= 0 ? `<button type="button" class="plan-mini" id="plan-fill">🧮 ${typedOk ? "Розрахувати решту автоматично" : "Розрахувати автоматично"}</button>` : ""}
      ${active >= 0 ? `<p class="plan-hint">Можеш порахувати сам — з підказками — або одразу розрахувати автоматично.</p>` : ""}`;
  }
  const cpDone = okD && enough && d.checkpoints.length && d.checkpoints.every(c => c.ok);
  // 5. зберегти
  const inTg = typeof telegramInitData === "function" && telegramInitData();
  const saveHtml = `${inTg ? `<label class="plan-check"><input type="checkbox" id="plan-notify"${d.notify ? " checked" : ""}> 🤖 У кожній контрольній точці бот @ukrmovych_bot напише, чи встигаю за планом</label>` : '<p class="plan-hint">Нагадування від бота — у Telegram-мініапці @ukrmovych_bot.</p>'}
    <button type="button" class="btn-primary" id="plan-save">💾 Зберегти мій план</button>`;
  body.innerHTML = `<p class="plan-intro">Склади власний план і порахуй, скільки треба працювати, щоб устигнути. Гра перевірить твої розрахунки й підкаже, якщо щось не сходиться.</p>
    ${step(1, "Що хочу вивчити", unitsHtml, true)}
    ${step(2, "До коли й у які дні", whenHtml, x.G > 0)}
    ${step(3, "Рахую навантаження", calcHtml, x.G > 0 && x.end && d.days.length)}
    ${step(4, "Контрольні точки", cpHtml, okD && enough)}
    ${step(5, "Готово!", saveHtml, cpDone)}
    ${planLoad() ? '<button type="button" class="btn-secondary" id="plan-cancel">Скасувати зміни</button>' : ""}`;
  planBindWizard(x, n, { kOf, expect, okD, enough, minN, dv });
}

function planBindWizard(x, n, h) {
  const d = planDraft, body = $("plan-body");
  const rerender = focusSel => {
    const y = window.scrollY;
    renderPlanWizard();
    window.scrollTo(0, y);
    const el = focusSel && body.querySelector(focusSel);
    if (el && !el.readOnly) el.focus();
  };
  const reset = () => { d.answerD = ""; d.answerN = ""; d.checkpoints = []; };
  body.querySelectorAll("[data-unit]").forEach(cb => cb.addEventListener("change", () => {
    const u = (d.mode === "sections" ? planSectionUnits(planCatalog) : planCatalog).find(c => c.id === cb.dataset.unit);
    d.units = cb.checked ? [...d.units, u] : d.units.filter(v => v.id !== u.id);
    reset(); rerender();
  }));
  body.querySelectorAll("[data-mode]").forEach(b => b.addEventListener("click", () => {
    if (d.mode === b.dataset.mode) return;
    d.mode = b.dataset.mode; d.units = []; reset(); rerender();
  }));
  const dl = $("plan-deadline");
  if (dl) dl.addEventListener("change", () => { d.deadline = dl.value; reset(); rerender(); });
  body.querySelectorAll("[data-day]").forEach(b => b.addEventListener("click", () => {
    const i = Number(b.dataset.day);
    d.days = d.days.includes(i) ? d.days.filter(v => v !== i) : [...d.days, i];
    reset(); rerender();
  }));
  body.querySelectorAll("[data-freq]").forEach(b => b.addEventListener("click", () => { d.freq = b.dataset.freq; d.checkpoints = []; rerender(); }));
  const ctx = { G: x.G, done: x.done, D: x.D, days: d.days.length, weeks: x.weeks };
  const onField = (id, field, after) => {
    const el = $(id);
    if (!el) return;
    let done = false;
    const commit = () => {
      if (done || !el.isConnected) return; // поле вже перемальоване — повторний «change» від старого поля не рахуємо
      const v = el.value.trim();
      if (v === String(d[field])) return;
      done = true;
      d[field] = v;
      if (v !== "") after(planNum(v));
      rerender(`#${id}`);
    };
    el.addEventListener("change", commit);
    el.addEventListener("keydown", e => { if (e.key === "Enter") { e.preventDefault(); el.blur(); } });
  };
  // після 2 невдалих спроб гра сама вписує правильне й коротко пояснює
  const miss = (key, fix) => { d.tries[key] = (d.tries[key] || 0) + 1; if (d.tries[key] >= 2) { fix(); d.tries[key] = 0; } };
  onField("plan-d", "answerD", v => {
    d.answerN = ""; d.checkpoints = []; d.notes.D = "";
    const ok = v !== null && Math.abs(v - x.D) <= Math.max(1, Math.round(x.D * 0.06));
    planLog("sessions", v, x.D, ok, ctx);
    if (!ok) miss("D", () => { d.answerD = String(x.D); d.notes.D = `Ми вписали правильне: до ${planHuman(d.deadline)} — ${planFmt(x.weeks)} ${plural(Math.round(x.weeks), "тиждень", "тижні", "тижнів")}, у кожному ${d.days.length} ${plural(d.days.length, "заняття", "заняття", "занять")}: ${planFmt(x.weeks)} × ${d.days.length} ≈ ${x.D}.`; });
  });
  onField("plan-n", "answerN", v => {
    d.checkpoints = []; d.notes.N = "";
    const ok = v !== null && v > 0 && Number.isInteger(v * 2) && v * x.D >= x.left - 1e-9;
    planLog("per_session", v, h.minN, ok, { ...ctx, left: x.left });
    if (!ok) miss("N", () => { d.answerN = planFmt(h.minN); d.notes.N = `Ми вписали правильне: ${planFmt(x.left)} груп ÷ ${x.D} занять = ${planFmt(Math.round(x.left / x.D * 100) / 100)} — округлюємо вгору до цілого чи половинки: ${planFmt(h.minN)}.`; });
  });
  [["plan-d-hint", "plan-d-help"], ["plan-n-hint", "plan-n-help"]].forEach(([b, hh]) => {
    const btn = $(b);
    if (btn) btn.addEventListener("click", () => { $(hh).hidden = false; });
  });
  body.querySelectorAll("[data-cp]").forEach(inp => {
    if (inp.readOnly) return;
    const i = Number(inp.dataset.cp);
    let done = false;
    const commit = () => {
      if (done || !inp.isConnected) return;
      const c = d.checkpoints[i], v = inp.value.trim();
      if (v === c.target) return;
      done = true;
      c.target = v;
      const num = planNum(v), e = h.expect(c.date);
      c.ok = num !== null && Math.abs(num - e) < 1e-9;
      if (v !== "") planLog(`cp${i + 1}`, num, e, c.ok, { ...ctx, n, k: h.kOf(c.date), kPrev: i ? h.kOf(d.checkpoints[i - 1].date) : 0 });
      if (v !== "" && !c.ok) miss(`cp${i}`, () => {
        const k = h.kOf(c.date), raw = planHalf(x.done + k * n);
        c.target = planFmt(e); c.ok = true; c.auto = true;
        c.note = raw > x.G
          ? `Ми вписали правильне: ${k} × ${planFmt(n)}${x.done ? ` + ${planFmt(x.done)}` : ""} = ${planFmt(raw)}, але в плані всього ${x.G} груп — до ${planHuman(c.date)} ти вже знатимеш їх усі, тож ${x.G}.`
          : `Ми вписали правильне: ${k} ${plural(k, "заняття", "заняття", "занять")} × ${planFmt(n)} = ${planFmt(planHalf(k * n))}${x.done ? ` + ${planFmt(x.done)} уже вивчених = ${planFmt(e)}` : ""}.`;
      });
      rerender(c.ok ? `[data-cp="${i + 1}"]` : `[data-cp="${i}"]`);
    };
    inp.addEventListener("change", commit);
    inp.addEventListener("keydown", e => { if (e.key === "Enter") { e.preventDefault(); inp.blur(); } });
  });
  const fill = $("plan-fill");
  if (fill) fill.addEventListener("click", () => {
    d.checkpoints.forEach(c => { if (!c.ok) { c.target = planFmt(h.expect(c.date)); c.ok = true; c.auto = true; } });
    rerender();
  });
  const nt = $("plan-notify");
  if (nt) nt.addEventListener("change", () => { d.notify = nt.checked; });
  const cancel = $("plan-cancel");
  if (cancel) cancel.addEventListener("click", () => showPlan());
  const save = $("plan-save");
  if (save) save.addEventListener("click", () => {
    const plan = {
      v: 2, mode: d.mode, created: (planLoad() || {}).created || planIso(planToday()), start: planIso(x.start), deadline: d.deadline, days: d.days.slice().sort(),
      units: d.units.map(u => ({ id: u.id, name: u.name, icon: u.icon, keys: u.keys, sizes: u.sizes, items: u.items, pts: u.pts })), total: x.G, startDone: x.done,
      sessions: x.D, perSession: n, freq: d.freq, checkpoints: d.checkpoints.map(c => ({ date: c.date, target: planNum(c.target) })),
      notify: Boolean(d.notify && typeof telegramInitData === "function" && telegramInitData())
    };
    planSave(plan);
    if (typeof launchConfetti === "function") launchConfetti();
    renderPlanView(plan);
  });
}

// ---------- мій план: прогрес ----------
function renderPlanView(plan) {
  const body = $("plan-body");
  const today = planIso(planToday());
  const learned = planHalf(plan.units.reduce((s, u) => s + planLearnedOf(u), 0) * 2 / 2);
  const sessionsDone = planSessions(planDate(plan.start), planToday(), plan.days).filter(s => s < today).length;
  const expected = Math.min(plan.total, planHalf(plan.startDone + sessionsDone * plan.perSession));
  const diff = planHalf(learned - expected);
  const next = plan.checkpoints.find(c => c.date >= today);
  const pct = v => Math.round(Math.min(1, v / Math.max(1, plan.total)) * 100);
  const status = learned >= plan.total ? "🏆 Усе вивчено! Тепер головне — вчасно повторювати."
    : diff >= 0 ? (diff > 0 ? `🚀 Випереджаєш план на ${planFmt(diff)} ${planGr(diff, "групу", "групи", "груп")}!` : "✅ Ідеш точно за планом!")
    : `⏳ Відстаєш на ${planFmt(-diff)} ${planGr(-diff, "групу", "групи", "груп")}. Нічого страшного — на найближчих заняттях візьми трохи більше.`;
  const left = planSessions(planToday(), planDate(plan.deadline), plan.days).length;
  const need = left ? Math.ceil(Math.max(0, plan.total - learned) / left * 2 - 1e-9) / 2 : 0;
  body.innerHTML = `
    <section class="plan-card">
      <p class="plan-goal">🎯 До <b>${planHuman(plan.deadline)}</b>: ${plan.units.map(u => `${u.icon} ${u.name}`).join(", ")}</p>
      <p class="plan-hint">${plan.days.map(i => PLAN_DAYS[i]).join(", ")} · по ${planFmt(plan.perSession)} ${Number.isInteger(plan.perSession) ? plural(plan.perSession, "новій групі", "нові групи", "нових груп") : "нової групи"} на заняття · перевірка ${PLAN_FREQ[plan.freq]}</p>
      <div class="plan-bar"><span class="plan-bar-exp" style="width:${pct(expected)}%"></span><span class="plan-bar-fact" style="width:${pct(learned)}%"></span></div>
      <p class="plan-legend"><span class="plan-dot fact"></span> вивчено <b>${planFmt(learned)}</b> з ${plan.total} · <span class="plan-dot exp"></span> за планом на сьогодні — ${planFmt(expected)}</p>
      <p class="plan-status">${status}</p>
      ${learned < plan.total && left ? `<p class="plan-hint">Лишилося ${planWord(left, "заняття", "заняття", "занять")} — це по ${planFmt(need)} ${Number.isInteger(need) ? plural(need, "групі", "групи", "груп") : "групи"} на заняття, щоб устигнути.</p>` : ""}
      ${next ? `<p class="plan-next">🚩 Наступна точка — <b>${planHuman(next.date)}</b>: маєш уже знати <b>${planFmt(next.target)}</b> ${planGr(next.target, "групу", "групи", "груп")}.</p>` : ""}
    </section>
    <section class="plan-card">
      <h3>🚩 Мої контрольні точки</h3>
      <ul class="plan-cps">${plan.checkpoints.map(c => `<li class="${c.date < today ? "past" : ""}"><span>${planHuman(c.date)}</span><b>${planFmt(c.target)}</b></li>`).join("")}</ul>
      <h3>📚 Що вчу</h3>
      <ul class="plan-cps">${plan.units.map(u => `<li><span>${u.icon} ${u.name}</span><b>${planFmt(planHalf(planLearnedOf(u)))} / ${u.keys.length}</b></li>`).join("")}</ul>
    </section>
    <div class="plan-actions">
      <button type="button" class="btn-secondary" id="plan-edit">✏️ Переробити план</button>
      ${typeof telegramInitData === "function" && telegramInitData() ? `<button type="button" class="btn-secondary" id="plan-bell">${plan.notify ? "🔕 Вимкнути сповіщення бота" : "🔔 Увімкнути сповіщення бота"}</button>` : ""}
      <button type="button" class="btn-secondary" id="plan-del">🗑 Видалити план</button>
    </div>`;
  $("plan-edit").addEventListener("click", () => showPlan(true));
  const bell = $("plan-bell");
  if (bell) bell.addEventListener("click", () => { plan.notify = !plan.notify; planSave(plan); renderPlanView(plan); });
  $("plan-del").addEventListener("click", () => {
    if (!confirm("Видалити план? Прогрес у тренажерах лишиться, зникнуть лише дати й контрольні точки.")) return;
    planSave(null);
    showPlan();
  });
}

// на плитці в меню — стан плану
const planOrigBest = renderBestScores;
renderBestScores = function () {
  planOrigBest();
  const el = document.querySelector('[data-best="plan"]');
  const plan = planLoad();
  if (el && plan) el.textContent = `Вивчено ${planFmt(planHalf(plan.units.reduce((s, u) => s + planLearnedOf(u), 0)))} з ${plan.total} · до ${planHuman(plan.deadline)}`;
};
renderBestScores();

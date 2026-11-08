// 🔥 Вогник — дні поспіль (власниця, 08.11.2026; для всіх). Праворуч від логотипа: «🔥 N днів поспіль».
// День зараховано, коли є хоч якийсь результат: закінчилась гра (марафон — «вмер», тест, дуель), пройдено групу
// тренування або за день набрано 10 правильних відповідей (будь-яка гра, будь-який режим).
// localStorage `streak` {d: останній день з результатом (Київ, YYYY-MM-DD), n, best}; у Telegram — ще й функція `streak`
// (streak.sql): вона рахує вогник для акаунта (кілька пристроїв) і о 19:00–19:40 нагадує «⌛️🔥 Збережи свій вогник!».
// Натискання → екран «🔥 Вогник»: шлях цілей (3, 5, 10 … 300 днів) з титулами.
(function () {
  // титули — від власниці (08.11.2026)
  const STREAK_GOALS = [
    [3, "🧠", "Мікрогеній"], [5, "💪", "Самодисциплінич"], [10, "🔥", "НМТ-Фанатик"], [20, "😎", "НМТ-Рішала"],
    [35, "🎓", "Майже бюджетник"], [60, "🦁", "Бос НМТ"], [100, "🥇", "Укрмович-молодший"],
    [150, "🫡", "Заступник Укрмовича"], [200, "👑", "Укрмович — твій заступник"], [300, "🏆", "Легенда НМТ"]
  ];
  window.STREAK_GOALS = STREAK_GOALS;
  const LB = window.LEADERBOARD_CONFIG || {};
  const dayOf = ms => new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Kyiv", year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date(ms));
  const today = () => dayOf(Date.now());
  const yesterday = () => dayOf(Date.now() - 864e5);
  const read = () => { try { return JSON.parse(localStorage.getItem("streak") || "{}") || {}; } catch (e) { return {}; } };
  const write = s => { try { localStorage.setItem("streak", JSON.stringify(s)); } catch (e) { /* */ } };
  const days = n => { const a = n % 10, b = n % 100; return a === 1 && b !== 11 ? "день" : a >= 2 && a <= 4 && (b < 12 || b > 14) ? "дні" : "днів"; };
  // скільки зараз: живий, якщо грав сьогодні або вчора
  function current() {
    const s = read();
    const alive = s.d === today() || s.d === yesterday();
    return { n: alive ? (s.n || 0) : 0, best: s.best || 0, todayDone: s.d === today() };
  }
  const titleOf = n => [...STREAK_GOALS].reverse().find(g => n >= g[0]) || null;
  const initData = () => {
    try { return (window.Telegram && Telegram.WebApp && Telegram.WebApp.initData) || new URLSearchParams(location.hash.slice(1)).get("tgWebAppData") || ""; } catch (e) { return ""; }
  };
  async function server(hit) {
    const tg = initData();
    if (!tg || !LB.url || (typeof NEWBIE !== "undefined" && NEWBIE)) return;
    try {
      const r = await (await fetch(`${LB.url}/functions/v1/streak`, {
        method: "POST", headers: { apikey: LB.anonKey, Authorization: `Bearer ${LB.anonKey}`, "Content-Type": "application/json" },
        body: JSON.stringify({ initData: tg, player: typeof getPlayerId === "function" ? getPlayerId() : undefined, hit: Boolean(hit) })
      })).json();
      if (!r || !r.ok) return;
      // кілька пристроїв: беремо більший живий вогник
      const s = read(), c = current();
      if (r.n > c.n) { write({ d: r.today ? today() : yesterday(), n: r.n, best: Math.max(s.best || 0, r.best || 0, r.n) }); render(); }
    } catch (e) { /* без зв'язку — локально */ }
  }

  // 📊 прийшов кнопкою з нагадування бота (…/gym/?from=streak) — до кінця сеансу
  try {
    if (/[?&]from=streak(&|$)/.test(location.search) && !sessionStorage.getItem("streak_from")) {
      sessionStorage.setItem("streak_from", "1");
      setTimeout(() => { try { track("streak_reminder_open", {}); } catch (e) { /* */ } }, 0);
    }
  } catch (e) { /* */ }
  const fromReminder = () => { try { return sessionStorage.getItem("streak_from") === "1"; } catch (e) { return false; } };
  // ---------- зарахувати день ----------
  function hit() {
    if (typeof NEWBIE !== "undefined" && NEWBIE) return;
    const s = read(), t = today();
    if (s.d === t) return;
    const n = s.d === yesterday() ? (s.n || 0) + 1 : 1;
    const best = Math.max(s.best || 0, n);
    write({ d: t, n, best });
    try { // 📊 статистика «🔥 Вогники»: який день поспіль, о котрій, сам чи з нагадування
      const h = Number(new Intl.DateTimeFormat("en-GB", { timeZone: "Europe/Kyiv", hour: "2-digit", hourCycle: "h23" }).format(new Date()));
      track("streak_hit", { n, src: fromReminder() ? "reminder" : "self", h });
    } catch (e) { /* */ }
    render(true);
    toast(n);
    server(true);
  }
  window.streakHit = hit;
  // події з результатом
  if (typeof track === "function") {
    const orig = track;
    track = function (name, params = {}) {
      try {
        if (name === "game_over" || name === "duel_end" || name === "all_words_done") hit();
        else if (name === "training_done" && (!params.early || (params.total || 0) >= 10 || (params.first_try || 0) >= 10)) hit();
      } catch (e) { /* */ }
      return orig.apply(this, arguments);
    };
  }
  // 10 правильних відповідей за день — теж результат
  if (typeof handleAnswer === "function") {
    const origA = handleAnswer;
    handleAnswer = function (isCorrect) {
      try {
        if (isCorrect) {
          const t = today(); let p = {};
          try { p = JSON.parse(localStorage.getItem("streak_pts") || "{}") || {}; } catch (e) { /* */ }
          p = p.d === t ? { d: t, c: (p.c || 0) + 1 } : { d: t, c: 1 };
          localStorage.setItem("streak_pts", JSON.stringify(p));
          if (p.c >= 10) hit();
        }
      } catch (e) { /* */ }
      return origA.apply(this, arguments);
    };
  }

  // ---------- вогник біля логотипа ----------
  const badge = document.createElement("button");
  badge.type = "button";
  badge.id = "streak-badge";
  badge.className = "streak-badge";
  badge.setAttribute("aria-label", "Вогник — дні поспіль");
  const logo = document.querySelector("#menu .menu-logo");
  if (logo) logo.appendChild(badge);
  function render(pop) {
    const c = current();
    badge.innerHTML = `<span class="streak-fire">🔥</span><b>${c.n}</b><small>${days(c.n)} поспіль</small>`;
    badge.classList.toggle("is-off", c.n === 0);
    badge.classList.toggle("is-wait", c.n > 0 && !c.todayDone);
    if (pop) { badge.classList.remove("pop"); void badge.offsetWidth; badge.classList.add("pop"); }
    if (screens.streak && !screens.streak.hidden) renderRoad();
  }
  badge.addEventListener("click", showStreak);

  function toast(n) {
    const t = document.createElement("div");
    t.className = "streak-toast";
    const g = STREAK_GOALS.find(x => x[0] === n);
    t.innerHTML = g ? `${g[1]} <b>${n} ${days(n)} поспіль!</b><br>Новий титул: «${g[2]}»` : `🔥 <b>${n} ${days(n)} поспіль!</b><br>${n === 1 ? "Вогник запалено — повертайся завтра" : "Вогник горить далі"}`;
    document.body.appendChild(t);
    setTimeout(() => t.classList.add("out"), 2600);
    setTimeout(() => t.remove(), 3200);
  }

  // ---------- екран «🔥 Вогник» ----------
  screens.streak = (() => {
    const main = document.createElement("main");
    main.id = "streak";
    main.className = "screen";
    main.hidden = true;
    main.innerHTML = `
      <header class="top-bar">
        <button type="button" class="icon-btn st-back" aria-label="В меню">‹ Меню</button>
        <h2 class="screen-title">🔥 Вогник</h2>
      </header>
      <div class="st-box"></div>`;
    $("menu").after(main);
    main.querySelector(".st-back").addEventListener("click", () => showMenu());
    return main;
  })();
  function renderRoad() {
    const c = current(), box = screens.streak.querySelector(".st-box");
    const next = STREAK_GOALS.find(g => g[0] > c.n);
    const ttl = titleOf(c.n);
    box.innerHTML = `
      <section class="st-hero${c.n ? "" : " is-off"}">
        <span class="st-big-fire">🔥</span>
        <div><b class="st-num">${c.n}</b> <span>${days(c.n)} поспіль</span>
        ${ttl ? `<p class="st-title">${ttl[1]} ${ttl[2]}</p>` : ""}
        <p class="st-note">${c.todayDone ? "✅ Сьогодні вже зараховано" : c.n ? "⌛ Сьогодні ще не зараховано — зіграй, щоб не згас" : "Зіграй сьогодні — і вогник запалиться"}</p></div>
      </section>
      <ul class="st-rules">
        <li>🎮 Щодня — хоча б <b>1 гра</b>, <b>1 група</b> або <b>10 правильних</b></li>
        <li>⏰ У Telegram о 19:00 нагадаємо, якщо вогник під загрозою</li>
        ${c.best > c.n ? `<li>🏆 Найдовший вогник: <b>${c.best} ${days(c.best)}</b></li>` : ""}
      </ul>
      ${next ? `<p class="st-next">До ${next[1]} «${next[2]}» — ще <b>${next[0] - c.n} ${days(next[0] - c.n)}</b></p>` : ""}
      <ol class="st-road">${STREAK_GOALS.map(g => {
        const done = c.n >= g[0] || c.best >= g[0], cur = next && g[0] === next[0];
        const pct = cur ? Math.round((c.n - (STREAK_GOALS[STREAK_GOALS.indexOf(g) - 1] || [0])[0]) / (g[0] - (STREAK_GOALS[STREAK_GOALS.indexOf(g) - 1] || [0])[0]) * 100) : 0;
        return `<li class="${done ? "done" : ""}${cur ? " cur" : ""}">
          <span class="st-dot">${done ? g[1] : "🔒"}</span>
          <span class="st-goal"><b>${g[0]} ${days(g[0])}</b><span>${g[1]} ${g[2]}</span>${cur ? `<i class="st-bar"><i style="width:${Math.max(4, pct)}%"></i></i>` : ""}</span>
        </li>`;
      }).join("")}</ol>
      <p class="st-soon">🎁 Скоро за вогник можна буде відкривати ігри безкоштовно</p>`;
  }
  function showStreak() {
    clearTimeout(typeof nextTimer !== "undefined" ? nextTimer : 0);
    renderRoad();
    showScreen("streak");
  }
  window.showStreak = showStreak;

  render();
  server(false);
  // опівночі вогник міг згаснути/стати «очікує» — оновити, коли гравець повертається в мініапку
  document.addEventListener("visibilitychange", () => { if (!document.hidden) render(); });
})();

// 🧪 Панель тестувальника (власниця, 04.11.2026): лише для Telegram-акаунтів із таблиці testers_tg (tester-feedback.sql).
// Унизу екрана — маленька панель «Панель <ім'я>, крутого тестувальника» з кнопками «😬 Тут щось не так» і «🔥 Ось це дуже круто».
// Натиснув → знімок екрана (html2canvas, вантажиться лише тестеру) + місце в грі (гра, режим, тренажер, завдання) →
// вікно «опиши, що саме 👀👀» → функція tester-feedback → статистика (вкладка «🧪 Тестери») і повідомлення власниці в @ukrmovych_bot.
// Згорнути панель — «✕» (лишається кружечок 🧪), стан — localStorage tester_min.
(function () {
  if (typeof telegramInitData !== "function" || typeof LB === "undefined" || !LB || !LB.url) return;
  // initData: з Telegram.WebApp (скрипт Telegram вантажиться async) або з адреси (#tgWebAppData), як у loader.js
  function readInit() {
    let d = telegramInitData();
    if (d) return d;
    try {
      d = new URLSearchParams(location.hash.slice(1)).get("tgWebAppData");
      if (d) return d;
      const saved = JSON.parse(sessionStorage.getItem("__telegram__initParams") || "{}");
      return (saved && saved.tgWebAppData) || "";
    } catch (e) { return ""; }
  }
  let initData = readInit(), tries = 0;
  if (!initData) {
    const t = setInterval(() => { initData = readInit(); if (initData || ++tries > 20) { clearInterval(t); if (initData) start(); } }, 500);
    return;
  }
  start();
  function start() {
  const H2C = "https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js";
  const get = k => { try { return localStorage.getItem(k); } catch (e) { return null; } };
  const set = (k, v) => { try { v == null ? localStorage.removeItem(k) : localStorage.setItem(k, v); } catch (e) { /* */ } };
  const api = body => fetch(`${LB.url}/functions/v1/tester-feedback`, {
    method: "POST",
    headers: { apikey: LB.anonKey, Authorization: `Bearer ${LB.anonKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({ initData, ...body })
  }).then(r => r.json());

  let panel = null, h2c = null;
  function loadH2c() {
    if (!h2c) h2c = new Promise((ok, no) => {
      if (window.html2canvas) return ok(window.html2canvas);
      const s = document.createElement("script");
      s.src = H2C; s.onload = () => ok(window.html2canvas); s.onerror = no;
      document.head.appendChild(s);
    });
    return h2c;
  }

  // ---------- де саме в грі ----------
  const vis = id => { const el = document.getElementById(id); return el && !el.hidden && el.offsetParent !== null ? el : null; };
  const txt = el => el ? el.textContent.replace(/\s+/g, " ").trim() : "";
  function place() {
    const p = {};
    const scr = [...document.querySelectorAll("main")].find(m => !m.hidden);
    p.screen = scr ? scr.id : "";
    const gid = (scr && scr.id === "duel" && typeof duel !== "undefined" && duel && duel.game) || (typeof currentGame !== "undefined" && currentGame) || "";
    const g = typeof GAMES !== "undefined" && gid ? GAMES.find(x => x.id === gid) : null;
    const inshe = gid === "inshe" && typeof insheQuiz !== "undefined" && insheQuiz;
    if (inshe && String(insheQuiz.id).startsWith("ist_")) p.game = "🏛️ Історія України";
    else if (g) p.game = `${g.icon || ""} ${g.name}`.trim();
    else if (p.screen === "nmttest") p.game = "🎲 Тест НМТ";
    if (inshe) { p.quiz = `${insheQuiz.icon || ""} ${insheQuiz.name || insheQuiz.id}`.trim(); p.quiz_id = insheQuiz.id; }
    const names = { menu: "головне меню", modes: "вибір режиму", game: "", over: "кінець гри", "train-over": "підсумок тренування",
      leaders: "турнірна таблиця", duel: "дуель", online: "онлайн-гра", myclass: "Мій клас", "feedback-screen": "відгук", nmttest: "" };
    let mode = names[p.screen] != null ? names[p.screen] : p.screen;
    if (p.screen === "game") {
      if (typeof training !== "undefined" && training) mode = `тренування «${(training.groups || []).map(x => x.name).join(", ").slice(0, 80)}»`;
      else mode = typeof endless !== "undefined" && endless ? "марафон без обмеження життів" : "марафон";
      if (typeof currentTopic !== "undefined" && currentTopic) mode += ` · спецтема ${currentTopic}`;
    }
    if (vis("groups-panel")) mode = (mode ? mode + " · " : "") + "вибір груп";
    if (mode) p.mode = mode;
    // завдання
    let task = "";
    if (p.screen === "game") task = [txt(document.getElementById("question")), txt(document.getElementById("sentence"))].filter(Boolean).join(" — ");
    else if (p.screen === "nmttest") task = txt(document.getElementById("nmt-question"));
    else if (p.screen === "duel" || p.screen === "online") task = txt(scr.querySelector("[id*=question], .question, .word"));
    if (task) p.task = task.slice(0, 400);
    if (p.screen === "game") {
      const ans = [...document.querySelectorAll("#answers button")].map(b => b.textContent.replace(/\s+/g, " ").trim()).filter(Boolean);
      if (ans.length) p.answers = ans.slice(0, 8).join(" | ").slice(0, 300);
      const fb = txt(document.getElementById("feedback"));
      if (fb) p.feedback = fb.slice(0, 200);
    }
    const tg = window.Telegram && Telegram.WebApp;
    const v = (document.querySelector('script[src*="script.js"]') || {}).src || "";
    p.device = `${(tg && tg.platform) || "?"} · ${window.innerWidth}×${window.innerHeight} · версія ${(v.split("?v=")[1] || "?")}`;
    return p;
  }

  // ---------- знімок екрана ----------
  async function shot() {
    try {
      const html2canvas = await loadH2c();
      const bg = getComputedStyle(document.body).backgroundColor;
      const canvas = await html2canvas(document.body, {
        x: window.scrollX, y: window.scrollY, width: window.innerWidth, height: window.innerHeight,
        windowWidth: document.documentElement.clientWidth, scale: Math.min(2, window.devicePixelRatio || 1),
        backgroundColor: bg && bg !== "rgba(0, 0, 0, 0)" ? bg : "#1f1a17", logging: false, useCORS: true,
        ignoreElements: el => el.id === "tester-panel" || el.id === "tester-modal",
        // у копії сторінки анімації почалися б спочатку (картки «напівпрозорі») — показуємо кінцевий стан
        onclone: doc => { const st = doc.createElement("style"); st.textContent = "*,*::before,*::after{animation:none!important;transition:none!important}"; doc.head.appendChild(st); }
      });
      let q = 0.75, url = canvas.toDataURL("image/jpeg", q);
      while (url.length > 2_500_000 && q > 0.3) { q -= 0.15; url = canvas.toDataURL("image/jpeg", q); }
      return url.length < 2_900_000 ? url : null;
    } catch (e) { return null; }
  }

  // ---------- вікно ----------
  function toast(text) {
    const t = document.createElement("div");
    t.className = "tester-toast";
    t.textContent = text;
    document.body.appendChild(t);
    setTimeout(() => t.classList.add("go"), 2200);
    setTimeout(() => t.remove(), 2800);
  }
  function ask(kind) {
    const where = place();
    const pic = shot();
    const m = document.createElement("div");
    m.id = "tester-modal";
    m.innerHTML = `<div class="tester-box" role="dialog" aria-modal="true">
      <p class="tester-q">${kind === "good" ? "🔥" : "😬"} опиши, що саме 👀👀</p>
      <textarea maxlength="2000" rows="4" placeholder="${kind === "good" ? "Що саме сподобалось?" : "Що не так? Що мало бути?"}"></textarea>
      <p class="tester-where"></p>
      <div class="tester-row"><button type="button" class="tester-cancel">Скасувати</button><button type="button" class="tester-send">Надіслати</button></div>
    </div>`;
    m.querySelector(".tester-where").textContent = "📍 " + ([where.game, where.mode, where.quiz].filter(Boolean).join(" · ") || where.mode || "меню") + " · 📸 скрин додасться сам";
    document.body.appendChild(m);
    const ta = m.querySelector("textarea"), send = m.querySelector(".tester-send");
    setTimeout(() => ta.focus(), 50);
    m.querySelector(".tester-cancel").onclick = () => m.remove();
    m.addEventListener("click", e => { if (e.target === m) m.remove(); });
    send.onclick = async () => {
      const message = ta.value.trim();
      if (!message) { ta.focus(); ta.classList.add("tester-shake"); setTimeout(() => ta.classList.remove("tester-shake"), 400); return; }
      send.disabled = true; send.textContent = "Надсилаю…";
      const image = await Promise.race([pic, new Promise(r => setTimeout(() => r(null), 10000))]);
      try {
        const r = await api({ player: typeof getPlayerId === "function" ? getPlayerId() : undefined, kind, message, place: where, image });
        if (!r.ok) throw new Error("fail");
        m.remove();
        toast("🫡 Надіслано Укрмовичу!");
      } catch (e) {
        send.disabled = false; send.textContent = "Не вийшло, ще раз";
      }
    };
  }

  // ---------- панель ----------
  function render(label) {
    if (panel) panel.remove();
    panel = document.createElement("div");
    panel.id = "tester-panel";
    panel.className = get("tester_min") === "1" ? "min" : "";
    panel.innerHTML = `<button type="button" class="tp-open" aria-label="Панель тестувальника">🧪</button>
      <span class="tp-title"></span>
      <span class="tp-row"><button type="button" class="tp-btn" data-k="bad">😬 Тут щось не так</button>
      <button type="button" class="tp-btn" data-k="good">🔥 Ось це дуже круто</button></span>
      <button type="button" class="tp-x" aria-label="Згорнути">✕</button>`;
    panel.querySelector(".tp-title").textContent = `Панель ${label}, крутого тестувальника`;
    panel.querySelectorAll(".tp-btn").forEach(b => b.addEventListener("click", () => ask(b.dataset.k)));
    panel.querySelector(".tp-x").onclick = () => { panel.classList.add("min"); set("tester_min", "1"); document.body.classList.remove("has-tester"); };
    panel.querySelector(".tp-open").onclick = () => { panel.classList.remove("min"); set("tester_min", null); document.body.classList.add("has-tester"); };
    document.body.appendChild(panel);
    document.body.classList.toggle("has-tester", !panel.classList.contains("min"));
    setTimeout(() => loadH2c().catch(() => { h2c = null; }), 4000);
  }

  const cached = get("tester_label");
  if (cached) render(cached);
  api({ check: true, player: typeof getPlayerId === "function" ? getPlayerId() : undefined }).then(r => {
    if (r.error) return; // не вдалося перевірити — лишаємо як є
    if (r.tester) { if (r.tester !== cached) render(r.tester); set("tester_label", r.tester); }
    else { set("tester_label", null); if (panel) { panel.remove(); panel = null; document.body.classList.remove("has-tester"); } }
  }).catch(() => {});
  }
})();

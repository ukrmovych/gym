// 🔒 Завантажувач гри (власниця, 04.11.2026): дані PRO-ігор НЕ лежать відкритими файлами на сайті — їх видає
// функція Supabase «pro-data» з закритого сховища лише тим, кому можна: учасникам каналу «НМТ-качки» в Telegram-мініапці
// (≤ 2 пристрої), учням курсу (course_tg / course_players) і власниці (пароль статистики). Решта гравців отримує порожні
// заглушки (PRO-ігри для них і так закриті «скоро»).
// У index.html: дані — <script type="text/plain" data-pro src="…">, код — <script type="text/plain" data-code src="…">;
// цей файл вантажить їх по черзі (версії ?v= — як завжди, у index.html). Поки викладання ще не поклало файли в сховище
// (pro-data відповідає "empty"), береться звичайний файл сайту (перехідний період).
// На вимогу: gymProLoad(["inshe/morf1.js", …]) — «Інше», «Історія України», тест НМТ (inshe.js, nmt-test.js).
(function () {
  const LBX = window.LEADERBOARD_CONFIG || null;
  const ls = k => { try { return localStorage.getItem(k); } catch (e) { return null; } };
  const ss = k => { try { return sessionStorage.getItem(k); } catch (e) { return null; } };
  const nameOf = src => src.split("?")[0];

  function initData() {
    try {
      const h = new URLSearchParams(location.hash.slice(1)).get("tgWebAppData");
      if (h) return h;
      const saved = JSON.parse(ss("__telegram__initParams") || "{}");
      return (saved && saved.tgWebAppData) || "";
    } catch (e) { return ""; }
  }
  function playerId() {
    let id = ls("player_id");
    if (!id || !/^[0-9a-f-]{36}$/.test(id)) {
      id = window.crypto && crypto.randomUUID ? crypto.randomUUID()
        : "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, c => { const r = Math.random() * 16 | 0; return (c === "x" ? r : (r & 0x3 | 0x8)).toString(16); });
      try { localStorage.setItem("player_id", id); } catch (e) { /* немає сховища */ }
    }
    return id;
  }
  const tgData = initData();
  const password = ls("stats_password") || "";
  // 🏫 шкільний ключ (власниця, 08.11.2026): QR для планшетів у школі — …/?school=<ключ>; запам'ятовується на пристрої,
  // відкриває лише свої тренажери (перелік — у базі, gym_school_keys; функція pro-data). З адреси ключ прибираємо.
  try {
    const sk = new URLSearchParams(location.search).get("school");
    if (sk && /^[A-Za-z0-9]{6,40}$/.test(sk)) {
      localStorage.setItem("school_key", sk);
      history.replaceState(null, "", location.pathname + location.search.replace(/([?&])school=[^&]*&?/, "$1").replace(/[?&]$/, "") + location.hash);
    }
  } catch (e) { /* */ }
  const school = ls("school_key") || "";
  const inTg = Boolean(tgData);
  const NEWBIE = /[?&]newbie(&|=|$)/.test(location.search); // перегляд очима новачка — без PRO-даних
  const want = !NEWBIE && Boolean(password || school || (inTg && (ls("pro_status") === "1" || ls("course_access"))) || ss("course_access"));

  // Порожні заглушки — щоб гра працювала без даних PRO-ігор
  const STUB = {
    "klychnyi-data.js": "const klychnyiData = [];",
    "chyslivnyky-data.js": "const chyslivnykyData = [];",
    "frazeo-data.js": "const frazeoPhrases = []; const frazeoSentences = [];",
    "frazeo-nmt-data.js": "const frazeoNmtIds = [];",
    "frazeo-options.js": "const frazeoOptions = {};",
    "frazeo-s30.js": "const frazeoS30 = null;",
    "slovospoluch-data.js": "const slovospoluchGroups = [];",
    "leks-data.js": "const leksSentences = {};",
    "inshomovni-data.js": "const inshomovniData = []; const inshomovniExtraAdverbs = []; const inshomovniApart = []; const inshomovniKinds = {}; const inshomovniGroups = []; const inshomovniExam = [];",
    "inshomovni-notes.js": "const inshomovniNotes = {};"
  };

  const state = { ok: false, fallback: false, who: "" };
  window.GYM_PRO = state;

  // 🎁 Демо для новачків (власниця, 07.11.2026): хто вперше відкрив гру з 05.11.2026 і не має PRO — у кожному
  // PRO-тренажері відкрита перша група (файли demo/…, генерує tools/make-demo.js). Новачок — як у upsell.js (player_since).
  const DEMO_FROM = "2026-11-05";
  const DEMO_V = "20261109a";
  const DEMO_FILES = new Set(["klychnyi-data.js", "chyslivnyky-data.js", "frazeo-data.js", "frazeo-nmt-data.js", "frazeo-options.js", "frazeo-s30.js",
    "inshomovni-data.js", "inshomovni-notes.js", "nmt-test-data.js"]);
  const isDemoFile = n => DEMO_FILES.has(n) || n === "inshe/istoriia.js"; // «Інше» новачкам не відкриваємо (власниця, 07.11.2026), лише «Історію»
  // 🔗 Посилання «як у старих гравців» (власниця, 08.11.2026): t.me/ukrmovych_bot/battle?startapp=old (або сайт ?old) —
  // гравець позначається старим: до 15.11 20:30 лише наголоси й лексична, решта — «15.11» і «🔔 Повідомити»; після — як усі.
  try {
    const raw = new URLSearchParams(location.hash.slice(1)).get("tgWebAppData") || "";
    const sp = new URLSearchParams(location.search).get("tgWebAppStartParam") || (raw ? new URLSearchParams(raw).get("start_param") : "") || "";
    if (sp === "old" || /[?&]old(&|=|$)/.test(location.search)) localStorage.setItem("player_since", "old");
  } catch (e) { /* */ }
  const LOCAL = Array.isArray(window.GYM_LOCAL_PRO) ? window.GYM_LOCAL_PRO : [];
  const DEMO = (() => {
    if (want || LOCAL.length) return false;
    if (NEWBIE) return true;
    let since = ls("player_since");
    if (!since) {
      let old = false;
      try {
        for (let i = 0; i < localStorage.length; i++) {
          if (/^(best_|train_|duel_|feedback_sent|player_name|player_classes)/.test(localStorage.key(i) || "")) { old = true; break; }
        }
      } catch (e) { /* */ }
      since = old ? "old" : new Date().toISOString().slice(0, 10);
      try { localStorage.setItem("player_since", since); } catch (e) { /* */ }
    }
    // з відкриття (15.11.2026 20:30) демо — і старим гравцям, як новим (власниця, 08.11.2026)
    return (since !== "old" && since >= DEMO_FROM) || Date.now() >= Date.parse("2026-11-15T20:30:00+02:00");
  })();
  window.GYM_DEMO = DEMO;

  async function request(files) {
    if (!LBX || !LBX.url) return { ok: false, error: "nolb" };
    const res = await fetch(`${LBX.url}/functions/v1/pro-data`, {
      method: "POST",
      headers: { apikey: LBX.anonKey, Authorization: `Bearer ${LBX.anonKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({ files, initData: tgData || undefined, player: playerId(), password: password || undefined, school: school || undefined })
    });
    return res.json();
  }

  // ⚡ Кеш даних PRO на пристрої (власниця, 08.11.2026: «щоб одразу відкривалась готова гра»): файл зберігається з повною
  // адресою (з ?v=), тож нова версія завантажується наново. Наступні запуски беруть дані з пристрою миттєво, а доступ
  // перевіряється у фоні маленьким запитом; доступ зник — кеш стирається (і checkPro у грі перезавантажує сторінку).
  const IDB = (() => {
    let dbp = null;
    const open = () => dbp || (dbp = new Promise(res => {
      try {
        const r = indexedDB.open("gym-pro", 1);
        r.onupgradeneeded = () => r.result.createObjectStore("f");
        r.onsuccess = () => res(r.result); r.onerror = () => res(null);
      } catch (e) { res(null); }
    }));
    const tx = (mode, fn) => open().then(db => db ? new Promise(res => {
      try { const t = db.transaction("f", mode); const st = t.objectStore("f"); const out = fn(st); t.oncomplete = () => res(out && out.result); t.onerror = () => res(null); }
      catch (e) { res(null); }
    }) : null);
    return {
      get: k => tx("readonly", st => st.get(k)),
      put: (k, v) => tx("readwrite", st => st.put(v, k)),
      clear: () => tx("readwrite", st => st.clear())
    };
  })();
  const PRO_CHECK = "chyslivnyky-data.js"; // найменший файл — ним у фоні перевіряємо, чи доступ ще є

  // вставити скрипт (текстом — через blob, або файлом сайту); async=false — суворо по черзі
  function inject(opts) {
    return new Promise(resolve => {
      const s = document.createElement("script");
      s.async = false;
      if (opts.text != null) s.src = URL.createObjectURL(new Blob([opts.text], { type: "text/javascript" }));
      else s.src = opts.src;
      s.onload = () => resolve();
      s.onerror = () => { // демо-файл не знайшовся — порожня заглушка, щоб гра не зламалась
        if (opts.stub != null) inject({ text: opts.stub }).then(resolve); else resolve();
      };
      document.body.appendChild(s);
    });
  }

  // Події load / DOMContentLoaded, на які підписуються скрипти, що вантажаться вже після них, — викликаються одразу
  const addWin = window.addEventListener.bind(window);
  window.addEventListener = function (type, fn, opt) {
    if (type === "load" && document.readyState === "complete") { setTimeout(fn, 0); return; }
    return addWin(type, fn, opt);
  };
  const addDoc = document.addEventListener.bind(document);
  document.addEventListener = function (type, fn, opt) {
    if (type === "DOMContentLoaded" && document.readyState !== "loading") { setTimeout(fn, 0); return; }
    return addDoc(type, fn, opt);
  };

  // На вимогу (inshe.js, nmt-test.js): файли даних за назвами
  window.gymProLoad = async function (names) {
    const list = names.map(n => nameOf(n));
    let useSite = state.fallback;
    if (state.ok) {
      try {
        const r = await request(list);
        if (r.ok) { for (const n of list) if (r.files[n] != null) await inject({ text: r.files[n] }); return; }
        useSite = r.error === "empty";
      } catch (e) { return; }
    }
    if (useSite) { for (const n of names) await inject({ src: n }); return; } // перехідний період: файли ще на сайті
    if (DEMO && !state.ok) for (const n of list) if (isDemoFile(n)) await inject({ src: `demo/${n}?v=${DEMO_V}` }); // 🎁 перша група
  };

  async function start() {
    const tags = [...document.querySelectorAll('script[type="text/plain"][data-pro], script[type="text/plain"][data-code]')];
    const proTags = tags.filter(t => t.hasAttribute("data-pro"));
    let files = {};
    // тест на платформі з квитком: спершу вхід (course-access), щоб функція впізнала учня
    try {
      const q = new URLSearchParams(location.search);
      // або Telegram-посилання з кабінету платформи (телефон): start_param c<квиток 36><гра 1 літера><хеш групи> (go.js)
      const tgRaw = new URLSearchParams(location.hash.slice(1)).get("tgWebAppData") || "";
      const sp = q.get("tgWebAppStartParam") || (tgRaw ? new URLSearchParams(tgRaw).get("start_param") : "") || "";
      const spT = /^c([0-9a-f]{36})[nifsl][0-9a-z]{1,8}$/.exec(sp);
      const t = (q.get("embed") && q.get("t")) || (spT && spT[1]);
      if (t && LBX && LBX.url) {
        await fetch(`${LBX.url}/functions/v1/course-access`, {
          method: "POST", headers: { apikey: LBX.anonKey, "Content-Type": "application/json" },
          body: JSON.stringify({ ticket: t, player: playerId(), initData: tgRaw || undefined })
        }).then(r => r.json()).then(r => { if (r.ok) try { sessionStorage.setItem("course_access", JSON.stringify({ name: r.name || "", at: Date.now(), embed: 1 })); } catch (e) { /* */ } });
      }
    } catch (e) { /* без квитка */ }
    const wantNow = want || (!NEWBIE && Boolean(ss("course_access")));
    // ⚡ великий банк речень «Лексичної помилки» (6 МБ) — не чекаємо на нього, довантажуємо після меню (07.11.2026)
    const LATE = "leks-data.js";
    let late = false;
    if (wantNow) {
      const need = proTags.map(t => t.getAttribute("src")).filter(src => nameOf(src) !== LATE);
      // спершу — з пристрою (лише ті самі версії)
      const cached = {};
      if (ls("pro_status") === "1" || password || school || ss("course_access") || ls("course_access")) {
        for (const src of need) { const c = await IDB.get(nameOf(src)); if (c && c.v === src && c.t != null) cached[nameOf(src)] = c.t; }
      }
      const miss = need.filter(src => cached[nameOf(src)] == null).map(nameOf);
      if (!miss.length) {
        files = cached; state.ok = true; state.who = ls("pro_who") || "";
        // доступ перевіряємо у фоні; зник — стираємо кеш (гра сама перезавантажиться через checkPro)
        request([PRO_CHECK]).then(r => { if (!r.ok && r.error !== "empty") IDB.clear(); else if (r.who) try { localStorage.setItem("pro_who", r.who); } catch (e) { /* */ } }).catch(() => {});
      } else {
        try {
          const r = await request(miss);
          if (r.ok) {
            files = { ...cached, ...(r.files || {}) }; state.ok = true; state.who = r.who || "";
            try { localStorage.setItem("pro_who", state.who); } catch (e) { /* */ }
            for (const src of need) { const n = nameOf(src); if (r.files && r.files[n] != null) IDB.put(n, { v: src, t: r.files[n] }); }
          } else if (r.error === "empty") state.fallback = true;
          else IDB.clear();
        } catch (e) { if (Object.keys(cached).length) { files = cached; state.ok = true; } /* немає зв'язку — що є на пристрої */ }
      }
    }
    for (const t of tags) {
      const src = t.getAttribute("src");
      if (t.hasAttribute("data-code")) { inject({ src }); continue; }
      const n = nameOf(src);
      // 🏫 шкільна копія (GitHub, mirror-config.js): ці дані лежать у самій копії — відкриті, без сервера
      if (LOCAL.includes(n)) { if (n === LATE) late = src; else inject({ src }); continue; }
      if (n === LATE && state.ok) { late = src; continue; } // без заглушки: leks.js поки працює з відкритими групами
      if (files[n] != null) inject({ text: files[n] });
      else if (state.fallback) inject({ src }); // перехідний період: файли ще на сайті
      else if (DEMO && isDemoFile(n)) inject({ src: `demo/${n}?v=${DEMO_V}`, stub: STUB[n] || "" }); // 🎁 новачкам — перша група
      else inject({ text: STUB[n] || "" });
    }
    if (late && LOCAL.includes(LATE)) { await inject({ src: late }); inject({ text: "if (typeof leksUpgrade === 'function') leksUpgrade();" }); late = false; }
    if (late) {
      const c = await IDB.get(LATE);
      if (c && c.v === late && c.t != null) await inject({ text: c.t });
      else try {
        const r = await request([LATE]);
        if (r.ok && r.files && r.files[LATE] != null) { await inject({ text: r.files[LATE] }); IDB.put(LATE, { v: late, t: r.files[LATE] }); }
        else if (r.error === "empty") await inject({ src: late });
      } catch (e) { /* немає зв'язку — лишаються відкриті групи */ }
      inject({ text: "if (typeof leksUpgrade === 'function') leksUpgrade();" });
    }
  }
  start();
})();

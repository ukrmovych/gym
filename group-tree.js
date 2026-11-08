// 🌳 Вибір групи тренування без довгого переліку (власниця, 08.11.2026 — «твоя комбінація шикарна»; демо — proto-groups.html).
// Якщо в гри понад TREE_MIN груп, у блоці «Тренування» замість плиток:
//   ▶ Далі: <група> — наступна невивчена за порядком; 🔁 Повторити: N — ті, що час повторити (перелік розгортається);
//   📂 Усі групи · N розділів — вікно поверх екрана (режими — марафон, дуелі, онлайн — лишаються на місці):
//   розділи → теми → кружечки-частини (колір — пам'ять). Натиснув кружечок — назва, розмір і «▶ Тренувати».
//   У вікні ж — «☑ Кілька груп»: кружечки позначаються, внизу «▶ Тренувати: N груп».
// Ключі груп і самі групи — ті самі (groups.js), тут лише інший вигляд. Тема — назва без «(1)»/« · 1» наприкінці,
// розділ — TREE_SECTIONS (іншомовні), «тип» лексичної помилки, інакше — за абеткою по ~5 тем.
const TREE_MIN = 16;

const TREE_SECTIONS = {
  inshomovni: [
    ["💥", "Було на іспиті", ["Було на іспиті"]],
    ["👤", "Люди", ["Професії й заняття", "Хто є хто", "Характер", "Зовнішність і враження", "Почуття й стосунки"]],
    ["🗣️", "Мова, ідеї, документи", ["Мова й мовлення", "Суперечки й ідеї", "Документи й правила"]],
    ["🏛️", "Суспільство й наука", ["Влада й суспільство", "Гроші й бізнес", "Наука й пізнання", "Здоров'я й тіло"]],
    ["🌍", "Світ, речі, час", ["Місця й простір", "Речі й мистецтво", "Час і події", "Зміни й розвиток", "Процеси й дії"]],
    ["🎨", "Ознаки, дії, поняття", ["Справжнє чи ні", "Міра й важливість", "Властивості", "Дієслова", "Поняття"]],
    ["✨", "Особливі", ["Сучасні слова", "Релігія й давнина", "Питомо українські"]]
  ]
};

// лексична помилка: розділ — тип помилки; споріднені — разом
const TREE_LEX_SEC = {
  "Пароніми": ["👯", "Пароніми"], "Ще пароніми": ["👯", "Пароніми"], "Слововживання": ["📝", "Слововживання"],
  "«По» чи «за»?": ["🔗", "Прийменники й керування"]
};

// скільки «штук» у групі для підписів: лексична помилка — у помилках (словосполучення: 2 картки на помилку)
function treeUnit(game) {
  if (game === "slovospoluch" || game === "leksychna") return ["помилка", "помилки", "помилок"];
  return TRAIN_UNITS[game] || ["завдання", "завдання", "завдань"];
}
const treeN = (game, g) => game === "slovospoluch" ? Math.round(g.items.length / 2) : g.items.length;

const treeUi = {}; // гра -> { repOpen, multi, picked:Set, open:Set(розділи) }
function treeState(game) { return treeUi[game] || (treeUi[game] = { repOpen: false, multi: false, picked: new Set(), open: new Set() }); }
const treeEmoji = s => (s.match(/^(\p{Extended_Pictographic}[️‍\p{Extended_Pictographic}]*)\s*/u) || ["", ""]);
const treeBare = s => s.slice(treeEmoji(s)[0].length);
const treeStrip = (s, all) => { let x = s.replace(/\s·\s\d+$/, ""); if (all) while (/\s\(\d+\)$/.test(x)) x = x.replace(/\s\(\d+\)$/, ""); return x; };

// дерево: [{icon, name, topics:[{name, parts:[group]}]}]
function treeBuild(game, groups) {
  const lex = game === "slovospoluch" || game === "leksychna";
  const topics = [];
  const byName = new Map();
  groups.forEach(g => {
    const tn = g.tp || treeStrip(g.name, !lex), id = treeBare(tn);
    if (!byName.has(id)) { const t = { name: tn, parts: [] }; byName.set(id, t); topics.push(t); }
    byName.get(id).parts.push(g);
  });
  const map = TREE_SECTIONS[game];
  const secs = [];
  if (map) {
    map.forEach(([icon, name, list]) => {
      const ts = topics.filter(t => list.includes(treeBare(t.name)));
      if (ts.length) secs.push({ icon, name, topics: ts });
    });
    const rest = topics.filter(t => !secs.some(s => s.topics.includes(t)));
    if (rest.length) secs.push({ icon: "📦", name: "Інше", topics: rest });
  } else if (lex || groups.some(g => g.sec)) {
    const bySec = new Map();
    topics.forEach(t => {
      const raw = t.parts[0].sec || treeStrip(t.name, true);
      const [icon, name] = TREE_LEX_SEC[treeBare(raw)] || [treeEmoji(raw)[0].trim(), treeBare(raw)];
      const sn = name;
      if (!bySec.has(sn)) { const s = { icon, name, topics: [] }; bySec.set(sn, s); secs.push(s); }
      bySec.get(sn).topics.push(t);
    });
  } else if (topics.length <= 8) {
    secs.push({ icon: "", name: "", topics });
  } else {
    // за абеткою: ~5 тем у розділі
    const k = Math.ceil(topics.length / 5), parts = splitEven(topics, Math.ceil(topics.length / k));
    const fl = t => (treeBare(t.name).match(/[А-ЯҐЄІЇа-яґєії]/) || ["?"])[0].toUpperCase();
    parts.forEach(ts => { const a = fl(ts[0]), b = fl(ts[ts.length - 1]); secs.push({ icon: "📗", name: a === b ? a : `${a} — ${b}`, topics: ts }); });
  }
  return secs;
}

// стан групи для кружечка: new | half | ok | fade | due
function treeGroupState(game, g) {
  const cfg = TRAIN_GAMES[game];
  const m = typeof memRead === "function" ? memRead(g.key) : null;
  if (m) {
    const r = memRecall(m);
    return r < MEM_DUE ? "due" : r < 0.95 ? "fade" : "ok";
  }
  if (cfg.open) { const a = trainAcc(g); return a && a.n ? "half" : "new"; }
  const best = trainBest(g);
  return best >= g.items.length ? "ok" : best > 0 ? "half" : "new";
}

function treeLabel(t, g) { const i = t.parts.indexOf(g); return treeBare(t.name) + (t.parts.length > 1 ? ` · ${i + 1}` : ""); }

function treeRender(game, list, progressEl) {
  const cfg = TRAIN_GAMES[game];
  const groups = cfg.groups().filter(g => !g.topic);
  const special = cfg.groups().filter(g => g.topic);
  const unit = treeUnit(game);
  const st = treeState(game);
  const secs = treeBuild(game, groups);
  const topicOf = new Map();
  secs.forEach(s => s.topics.forEach(t => t.parts.forEach(g => topicOf.set(g.key, t))));
  const state = new Map(groups.map(g => [g.key, treeGroupState(game, g)]));
  list.innerHTML = "";
  list.classList.remove("group-grid", "insh-group-grid", "train-multi");
  list.classList.add("train-grid", "tree-box");

  const next = groups.find(g => ["new", "half"].includes(state.get(g.key)));
  const due = groups.filter(g => state.get(g.key) === "due")
    .sort((x, y) => memRecall(memRead(x.key)) - memRecall(memRead(y.key)));

  if (next) {
    const t = topicOf.get(next.key), n = treeN(game, next);
    const b = document.createElement("button");
    b.type = "button";
    b.className = "tree-big tree-next";
    const best = cfg.open ? 0 : trainBest(next);
    b.innerHTML = `<b></b><span></span>`;
    b.querySelector("b").textContent = `▶ Далі: ${treeLabel(t, next)}`;
    b.querySelector("span").textContent = `${n} ${plural(n, ...unit)} · ${best > 0 ? `почато: ${Math.round(best / next.items.length * 100)} %` : "нова група за порядком"}`;
    b.onclick = () => startGroupTraining(game, [next.key]);
    list.appendChild(b);
  } else {
    const p = document.createElement("p");
    p.className = "tree-alldone";
    p.textContent = "🏆 Усі групи вивчено! Тепер — лише повторювати.";
    list.appendChild(p);
  }

  if (due.length) {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "tree-big tree-rep";
    b.innerHTML = `<b></b><span></span>`;
    b.querySelector("b").textContent = `🔁 Повторити: ${due.length} ${plural(due.length, "групу", "групи", "груп")}`;
    b.querySelector("span").textContent = st.repOpen ? "обери, що повторити ▴" : "пам'ять на них згасає — натисни, щоб обрати";
    b.onclick = () => { st.repOpen = !st.repOpen; treeRender(game, list, progressEl); };
    list.appendChild(b);
    if (st.repOpen) {
      const box = document.createElement("div");
      box.className = "tree-replist";
      due.forEach(g => {
        const r = document.createElement("button");
        r.type = "button";
        r.className = "tree-repit";
        r.innerHTML = `<i class="tree-dot due"></i><span></span><small></small>`;
        r.querySelector("span").textContent = treeLabel(topicOf.get(g.key), g);
        r.querySelector("small").textContent = `${treeN(game, g)} ${plural(treeN(game, g), ...unit)} ›`;
        r.onclick = () => startGroupTraining(game, [g.key]);
        box.appendChild(r);
      });
      if (due.length > 1) {
        const all = document.createElement("button");
        all.type = "button";
        all.className = "tree-repall";
        const n = due.reduce((a, g) => a + treeN(game, g), 0);
        all.textContent = `▶ Повторити все разом · ${n} ${plural(n, ...unit)}`;
        all.onclick = () => startGroupTraining(game, due.map(g => g.key));
        box.appendChild(all);
      }
      list.appendChild(box);
    }
  }

  const open = document.createElement("button");
  open.type = "button";
  open.className = "tree-open";
  const learned = groups.filter(g => ["ok", "fade", "due"].includes(state.get(g.key))).length;
  const secN = secs.filter(s => s.name).length;
  open.innerHTML = `<span>📂</span><span class="tree-nm"><b></b><small></small></span><span class="tree-arr">›</span>`;
  open.querySelector("b").textContent = `Усі групи (${groups.length})`;
  open.querySelector("small").textContent = (secN > 1 ? `${secN} ${plural(secN, "розділ", "розділи", "розділів")} · ` : "") + `вивчено ${learned}`;
  open.onclick = () => treeSheet(game, list, progressEl);
  list.appendChild(open);

  // ⭐ спецтеми (наголоси) — як і раніше, плитками внизу
  if (special.length) {
    const grid = document.createElement("div");
    grid.className = "group-grid train-tiles";
    special.forEach(g => grid.appendChild(trainTile(game, g, cfg, unit, trainState(game), list, progressEl)));
    list.appendChild(grid);
  }

  if (progressEl) {
    progressEl.textContent = [learned ? `✓ вивчено ${learned} з ${groups.length} груп` : "", due.length ? `🔁 час повторити: ${due.length}` : ""].filter(Boolean).join(" · ");
    if (typeof memSummary === "function") memSummary(progressEl, groups);
  }
}

// вікно «Усі групи»: розділи → теми → кружечки
function treeSheet(game, list, progressEl) {
  const cfg = TRAIN_GAMES[game];
  const unit = treeUnit(game);
  const st = treeState(game);
  let ov = document.getElementById("tree-ov");
  if (!ov) {
    ov = document.createElement("div");
    ov.id = "tree-ov";
    ov.className = "tree-ov";
    document.body.appendChild(ov);
  }
  const close = () => { ov.hidden = true; document.body.classList.remove("tree-lock"); treeRender(game, list, progressEl); };
  const draw = () => {
    const groups = cfg.groups().filter(g => !g.topic);
    const secs = treeBuild(game, groups);
    const state = new Map(groups.map(g => [g.key, treeGroupState(game, g)]));
    const nextKey = (groups.find(g => ["new", "half"].includes(state.get(g.key))) || {}).key;
    const title = game === "inshe" && typeof insheQuiz !== "undefined" && insheQuiz ? insheQuiz.name : (GAMES.find(x => x.id === game) || {}).name || "";
    const single = secs.length === 1 && !secs[0].name;
    ov.innerHTML = `<div class="tree-panel"><header class="tree-head"><button type="button" class="tree-back">‹ Назад</button><b class="tree-title"></b>
      <button type="button" class="tree-multi${st.multi ? " on" : ""}">${st.multi ? "✕ Скасувати" : "☑ Кілька груп"}</button></header>
      ${st.multi ? '<p class="tree-hint">Познач кружечки груп, які хочеш тренувати разом</p>' : ""}
      <div class="tree-secs"></div>
      <div class="tree-legend"><span><i class="tree-dot new"></i>нова</span><span><i class="tree-dot half"></i>почато</span><span><i class="tree-dot ok"></i>вивчено</span><span><i class="tree-dot due"></i>повторити</span><span><i class="tree-dot new next"></i>наступна</span></div>
      <div class="tree-foot"></div></div>`;
    ov.querySelector(".tree-title").textContent = `📂 ${title}`;
    ov.querySelector(".tree-back").onclick = close;
    ov.querySelector(".tree-multi").onclick = () => { st.multi = !st.multi; st.picked.clear(); draw(); };
    const box = ov.querySelector(".tree-secs");
    secs.forEach(s => {
      const ps = s.topics.flatMap(t => t.parts);
      const ok = ps.filter(g => ["ok", "fade", "due"].includes(state.get(g.key))).length;
      const d = ps.filter(g => state.get(g.key) === "due").length;
      const sid = s.name || "_";
      const isOpen = single || st.open.has(sid) || (secs.length === 1);
      const sec = document.createElement("div");
      sec.className = "tree-sec" + (isOpen ? " open" : "") + (single ? " flat" : "");
      if (!single) {
        const h = document.createElement("button");
        h.type = "button";
        h.className = "tree-sec-h";
        h.innerHTML = `<span class="tree-ic"></span><span class="tree-nm"><b></b><small></small><span class="tree-bar"><i></i></span></span>${d ? `<span class="tree-badge">🔁 ${d}</span>` : ""}<span class="tree-arr">›</span>`;
        h.querySelector(".tree-ic").textContent = s.icon || "📁";
        h.querySelector("b").textContent = s.name;
        h.querySelector("small").textContent = (s.topics.length > 1 ? `${s.topics.length} ${plural(s.topics.length, "тема", "теми", "тем")} · ` : "") + `${ps.length} ${plural(ps.length, "група", "групи", "груп")} · вивчено ${ok}`;
        h.querySelector(".tree-bar i").style.width = `${ok / ps.length * 100}%`;
        h.onclick = () => { if (st.open.has(sid)) st.open.delete(sid); else st.open.add(sid); draw(); };
        sec.appendChild(h);
      }
      const body = document.createElement("div");
      body.className = "tree-sec-b";
      s.topics.forEach(t => {
        const row = document.createElement("div");
        row.className = "tree-topic";
        const n = t.parts.reduce((a, g) => a + treeN(game, g), 0);
        row.innerHTML = `<span class="tree-tn"><span></span><small></small></span><span class="tree-dots"></span>`;
        row.querySelector(".tree-tn span").textContent = treeBare(t.name);
        row.querySelector(".tree-tn small").textContent = `${n} ${plural(n, ...unit)}` + (t.parts.length > 1 ? ` · ${t.parts.length} ${plural(t.parts.length, "частина", "частини", "частин")}` : "");
        const dots = row.querySelector(".tree-dots");
        t.parts.forEach((g, i) => {
          const b = document.createElement("button");
          b.type = "button";
          const sg = state.get(g.key);
          b.className = `tree-dot ${sg}${g.key === nextKey ? " next" : ""}${st.multi && st.picked.has(g.key) ? " picked" : ""}`;
          b.textContent = String(i + 1);
          b.title = treeLabel(t, g);
          b.onclick = () => {
            if (st.multi) { if (st.picked.has(g.key)) st.picked.delete(g.key); else st.picked.add(g.key); draw(); return; }
            treeAsk(ov, game, t, g, sg, g.key === nextKey, unit, close);
          };
          dots.appendChild(b);
        });
        body.appendChild(row);
      });
      sec.appendChild(body);
      box.appendChild(sec);
    });
    const foot = ov.querySelector(".tree-foot");
    if (st.multi) {
      const picked = groups.filter(g => st.picked.has(g.key));
      const n = picked.reduce((a, g) => a + treeN(game, g), 0);
      const go = document.createElement("button");
      go.type = "button";
      go.className = "btn-primary tree-go";
      go.disabled = !picked.length;
      go.textContent = picked.length ? `▶ Тренувати: ${picked.length} ${plural(picked.length, "група", "групи", "груп")} · ${n} ${plural(n, ...unit)}` : "Познач групи";
      go.onclick = () => { const keys = picked.map(g => g.key); st.multi = false; st.picked.clear(); ov.hidden = true; document.body.classList.remove("tree-lock"); startGroupTraining(game, keys); };
      foot.appendChild(go);
    }
  };
  draw();
  ov.hidden = false;
  ov.scrollTop = 0;
  document.body.classList.add("tree-lock");
}

const TREE_ST = { new: "нова група", half: "почато, ще не вивчено", ok: "✅ вивчено, пам'ятаєш добре", fade: "✅ вивчено, трохи згасає", due: "🔁 час повторити" };
function treeAsk(ov, game, t, g, sg, isNext, unit, close) {
  let sh = ov.querySelector(".tree-ask");
  if (!sh) { sh = document.createElement("div"); sh.className = "tree-ask"; ov.appendChild(sh); }
  sh.innerHTML = `<button type="button" class="tree-ask-x" aria-label="Закрити">✕</button><b></b><p></p><button type="button" class="btn-primary tree-ask-go">▶ Тренувати</button>`;
  sh.querySelector("b").textContent = treeLabel(t, g);
  sh.querySelector("p").textContent = `${treeN(game, g)} ${plural(treeN(game, g), ...unit)} · ${isNext && sg === "new" ? "▶ наступна за порядком" : TREE_ST[sg]}`;
  sh.querySelector(".tree-ask-x").onclick = () => sh.classList.remove("open");
  sh.querySelector(".tree-ask-go").onclick = () => { ov.hidden = true; document.body.classList.remove("tree-lock"); sh.classList.remove("open"); startGroupTraining(game, [g.key]); };
  requestAnimationFrame(() => sh.classList.add("open"));
}

// підміна плиток: лише для довгих переліків (понад TREE_MIN груп)
if (typeof renderTrainPicker === "function") {
  const treeOrig = renderTrainPicker;
  renderTrainPicker = function (game, list, progressEl) {
    try {
      const cfg = TRAIN_GAMES[game];
      if (cfg && list && cfg.groups().filter(g => !g.topic).length > TREE_MIN) {
        list.classList.remove("tree-box");
        return treeRender(game, list, progressEl);
      }
    } catch (e) { console.warn("group-tree", e); }
    if (list) list.classList.remove("tree-box");
    return treeOrig.apply(this, arguments);
  };
}

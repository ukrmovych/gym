// Тренування групами для всіх ігор (власник, 03.11.2026).
// - Кожна гра має свої групи (TRAIN_GAMES): наголоси, іншомовні слова, фразеологізми, словосполучення,
//   числівники, кличний відмінок. Групи рахуються з даних, тож нові слова самі потрапляють у групи.
// - «☑ Тренувати кілька груп»: позначити кілька плиток → одне тренування з усіх вибраних.
// - Довгий перелік груп згорнутий: видно до 3 недавніх груп, «Усі групи (N) ▾» розгортає весь.
// - Вийти можна будь-коли («Завершити»): результат зараховується — правильні з першого разу.
//   Плитка групи: найкращий результат = правильні з першого разу / кількість карток групи
//   (localStorage `train_<гра>_<група>` — ключі наголосів і іншомовних ті самі, що й раніше).
//   Кличний відмінок — групи без обмежень: плитка показує точність у пройдених словах (`…_acc`).
// Запуск і кінець раунду — тут; сам показ завдань — функції ігор (renderNaholosy, renderFrazeo…).
// У script.js: nextQuestion / handleAnswer / finishTrainingRound / кнопки екрана «train-over» звертаються сюди.

const TRAIN_UNITS = {
  naholosy: ["слово", "слова", "слів"], inshomovni: ["слово", "слова", "слів"],
  frazeolohizmy: typeof FRAZEO_S30 !== "undefined" && FRAZEO_S30 ? ["фразеологізм", "фразеологізми", "фразеологізмів"] : ["речення", "речення", "речень"], slovospoluch: ["картка", "картки", "карток"],
  chyslivnyky: ["завдання", "завдання", "завдань"], klychnyi: ["слово", "слова", "слів"]
};

function trainCap(s) { return s ? s[0].toUpperCase() + s.slice(1) : s; }

// Фразеологізми: ~30 речень, фразеологізми з однаковим першим словом — завжди в одній групі; за алфавітом
function frazeoTrainGroups() {
  // 💬 нова будова (frazeo-s30.js): ті самі назви груп (ключі ДЗ), у групі — фразеологізми (кожен — щоразу з новим реченням)
  if (typeof FRAZEO_S30 !== "undefined" && FRAZEO_S30 && FRAZEO_S30.groups) {
    const rowOf = Object.fromEntries(frazeoSentences.map(r => [r[0], r]));
    // власниця, 08.11.2026: не більше 12 фразеологізмів у групі; назва — від першого до останнього першого слова
    const fw = id => ((FRAZEO_BY_ID[id] && FRAZEO_BY_ID[id].p) || "").toLowerCase().split(/\s+/)[0];
    const out = [], used = new Set();
    FRAZEO_S30.groups.forEach(g => {
      const ids = g.ids.filter(id => rowOf[id]);
      const parts = splitEven(ids, 12);
      // зсунути межу на 1–3, щоб однакове перше слово не розірвалось (якщо так не перевищимо 12)
      for (let p = 0; p + 1 < parts.length; p++) {
        for (let tries = 0; tries < 3 && parts[p].length && parts[p + 1].length && fw(parts[p][parts[p].length - 1]) === fw(parts[p + 1][0]); tries++) {
          if (parts[p].length < 12) parts[p].push(parts[p + 1].shift()); else break;
        }
      }
      parts.filter(x => x.length).forEach(part => {
        const a = fw(part[0]), b = fw(part[part.length - 1]);
        let name = parts.length === 1 ? g.name : a === b ? `${trainCap(a)}…` : `${trainCap(a)} — ${b}`;
        let n = 2, base = name;
        while (used.has(name)) name = `${base} (${n++})`;
        used.add(name);
        out.push({ key: `train_frazeo_${name}`, name, items: part.map(id => rowOf[id]), tp: g.name }); // tp — тема для group-tree.js
      });
    });
    return out;
  }
  const byWord = new Map();
  frazeoSentences.forEach(row => {
    const ph = FRAZEO_BY_ID[row[0]];
    if (!ph) return;
    const w = ph.p.toLowerCase().split(/\s+/)[0];
    if (!byWord.has(w)) byWord.set(w, []);
    byWord.get(w).push(row);
  });
  const words = [...byWord.keys()].sort((a, b) => a.localeCompare(b, "uk"));
  const groups = [];
  let cur = null;
  words.forEach(w => {
    const rows = byWord.get(w);
    // велика «родина» (напр. «як…») — окремою групою
    if (cur && (rows.length > 34 || (cur.items.length >= 22 && cur.items.length + rows.length > 34))) { groups.push(cur); cur = null; }
    if (!cur) cur = { words: [], items: [] };
    cur.words.push(w);
    cur.items.push(...rows);
  });
  if (cur) groups.push(cur);
  return groups.map(g => {
    const name = g.words.length === 1 ? `${trainCap(g.words[0])}…`
      : `${trainCap(g.words[0])} — ${g.words[g.words.length - 1]}`;
    return { key: `train_frazeo_${name}`, name, items: g.items };
  });
}

// Словосполучення: групи з даних, поділені на частини по ~30 карток (з рядка — дві картки)
function slovoTrainGroups() {
  const out = [];
  slovospoluchGroups.forEach(g => {
    // власниця, 08.11.2026: не більше 15 помилок у групі, рівними частинами
    const chunks = splitEven(g.rows, 15);
    for (let p = 0; p < chunks.length; p++) {
      const rows = chunks[p];
      const name = chunks.length > 1 ? `${g.name} · ${p + 1}` : g.name;
      const items = rows.flatMap(([wrong, right, rule]) => [
        { text: wrong, ok: false, wrong, right, rule },
        { text: right, ok: true, wrong, right, rule }
      ]);
      out.push({ key: `train_slovo_${name}`, name, items });
    }
  });
  return out;
}

// Числівники: за тим, у якій групі числівників помилка
const CHYS_TRAIN = [
  ["234", "2, 3, 4", /^(двох|двом|двома|трьох|трьом|трьома|чотирьох|чотирьом|чотирма)$/],
  ["510", "5–10 (і 11–30)", /^(п'ят|шест|шіст|сім|сьом|сем|вісім|восьм|вісьм|дев'ят|десят|одинадцят|дванадцят|тринадцят|чотирнадцят|п'ятнадцят|шістнадцят|сімнадцят|вісімнадцят|дев'ятнадцят|двадцят|тридцят)[а-яіїєґ']*$/],
  ["4090", "40, 90, 100", /^(сорока|дев'яноста|ста)$/],
  ["5080", "50–80", /^(п'ят|шіст|сім|вісім)десят/],
  ["200400", "200–400", /^(двохсот|двомстам|двомастами|двохстах|трьохсот|трьомстам|трьомастами|трьохстах|чотирьохсот|чотирьомстам|чотирмастами|чотирьохстах)$/],
  ["500900", "500–900", /^(п'ят|шест|шіст|сем|сім|восьм|вісім|дев'ят)[а-яіїєґ']*(сот|стам|стами|стах)$/]
];
function chysTrainGroups() {
  const groups = CHYS_TRAIN.map(([id, name]) => ({ key: `train_chys_${id}`, name, items: [] }));
  const other = { key: "train_chys_other", name: "Інше: складені, порядкові, дроби, збірні", items: [] };
  chyslivnykyData.forEach(row => {
    const a = row.a.toLowerCase();
    // 50–80 перевіряємо раніше за 5–10 (обидва починаються з «п'ят…»)
    const order = [3, 2, 4, 5, 0, 1];
    const hit = order.find(i => !a.includes(" ") && CHYS_TRAIN[i][2].test(a))
      ?? (/^(п'ят|шіст|сім|вісім)десят[а-яіїєґ']*( |$)/.test(a) ? 3 : undefined);
    (hit === undefined ? other : groups[hit]).items.push(row);
  });
  return [...groups, other].filter(g => g.items.length);
}

// Кличний відмінок: за закінченням і родом (рід — з початку речення: pm/sm/lm/bm — чоловічий)
const KLYCH_TRAIN = [
  ["a", "На -а: Оксана → Оксано, Даша → Даше", "І відміна"],
  ["ya", "На -я: Наталя → Наталю, Настя → Насте", "І відміна"],
  ["r", "Чоловічий рід на -р: Ігор → Ігорю", "ІІ відміна"],
  ["m", "Інші чоловічого роду: Андрій → Андрію", "ІІ відміна"],
  ["f", "Жіночий рід без -а/-я та IV відміна: ніч → ноче", "ІІІ–IV відміни"],
  ["rest", "Решта слів", ""]
];
function klychGroupOf(row) {
  const [frame, nom, voc] = row;
  const male = ["pm", "sm", "lm", "bm"].includes(frame);
  if (frame === "ln") return "f";
  if (/а$/.test(nom)) return "a";
  if (/я$/.test(nom)) return "ya";
  if (!male) return voc.split("|").some(v => /е$/.test(v) && v !== nom) ? "f" : "rest";
  return /р$/.test(nom) ? "r" : "m";
}
function klychTrainGroups() {
  return KLYCH_TRAIN.map(([id, name, sub]) => ({
    key: `train_klychnyi_${id}`, name, sub, items: klychnyiData.filter(r => klychGroupOf(r) === id)
  })).filter(g => g.items.length);
}

const TRAIN_GAMES = {
  naholosy: {
    groups: () => [
      ...GROUPS.map((g, i) => ({ key: groupKey(i), name: g.label, items: g.words, index: i })),
      ...TOPIC_GROUPS.map((g, k) => [g, -1 - k]).filter(([g]) => hasTopic(g.topic))
        .map(([g, i]) => ({ key: groupKey(i), name: `${g.icon} ${g.label}`, items: g.words, index: i, topic: true }))
    ],
    render: () => renderNaholosy()
  },
  inshomovni: {
    groups: () => INSH_GROUPS.map((g, i) => ({
      key: inshGroupKey(i), name: `${g.icon} ${g.name}`,
      items: g.words.map(w => inshomovniData.find(r => r[0] === w)).filter(Boolean)
    })),
    render: () => renderInshomovni()
  },
  frazeolohizmy: {
    groups: frazeoTrainGroups,
    prep: row => makeFrazeoCard(row, false, Math.random, ""),
    render: () => renderFrazeo()
  },
  slovospoluch: { groups: slovoTrainGroups, render: () => renderSlovospoluch() },
  chyslivnyky: {
    groups: chysTrainGroups,
    prep: row => { const q = { ...row, options: [row.a, ...row.w] }; shuffleArray(q.options); return q; },
    render: () => renderChyslivnyky()
  },
  // без обмежень: учень сам завершує, точність — у пройдених словах
  klychnyi: { groups: klychTrainGroups, render: () => renderKlychnyi(), open: true }
};

const trainUi = {}; // гра -> { multi, picked: Set, expanded }
function trainState(game) {
  if (!trainUi[game]) trainUi[game] = { multi: false, picked: new Set(), expanded: false };
  return trainUi[game];
}

function trainRecent(game) {
  try { return JSON.parse(storageGet(`train_recent_${game}`) || "[]"); } catch (e) { return []; }
}

function trainBest(g) { return Number(storageGet(g.key)) || 0; }
function trainAcc(g) {
  try { return JSON.parse(storageGet(`${g.key}_acc`) || "null"); } catch (e) { return null; }
}

// Плитки груп у контейнері (екран режимів або «Іншомовні слова»)
function renderTrainPicker(game, list, progressEl) {
  const cfg = TRAIN_GAMES[game];
  if (!cfg || !list) return;
  const st = trainState(game);
  const groups = cfg.groups();
  const unit = TRAIN_UNITS[game];
  list.innerHTML = "";
  list.classList.remove("group-grid", "insh-group-grid");
  list.classList.add("train-grid");
  list.classList.toggle("train-multi", st.multi);

  const bar = document.createElement("div");
  bar.className = "train-bar";
  const multiBtn = document.createElement("button");
  multiBtn.type = "button";
  multiBtn.className = "train-chip" + (st.multi ? " on" : "");
  multiBtn.textContent = st.multi ? "✕ Скасувати вибір" : "☑ Тренувати кілька груп";
  multiBtn.addEventListener("click", () => {
    st.multi = !st.multi;
    st.picked.clear();
    if (st.multi) st.expanded = true;
    renderTrainPicker(game, list, progressEl);
  });
  bar.appendChild(multiBtn);
  list.appendChild(bar);

  // Згорнутий перелік: недавні групи (до 3), решта — за кнопкою
  const recent = trainRecent(game).filter(k => groups.some(g => g.key === k)).slice(0, 3);
  const collapsible = groups.length > 6;
  // 🔁 групи, які час повторити, — першими (memory.js)
  const dueKeys = typeof memState === "function"
    ? groups.filter(g => { const m = memRead(g.key); return m && memRecall(m) < MEM_DUE; })
        .sort((x, y) => memRecall(memRead(x.key)) - memRecall(memRead(y.key))).map(g => g.key) : [];
  const shortKeys = [...new Set([...dueKeys.slice(0, 3), ...recent])].slice(0, Math.max(3, Math.min(dueKeys.length, 3) + 1));
  const shown = !collapsible || st.expanded || st.multi ? groups
    : (shortKeys.length ? shortKeys.map(k => groups.find(g => g.key === k)) : groups.slice(0, 3));

  const grid = document.createElement("div");
  grid.className = "group-grid train-tiles" + (game === "naholosy" ? "" : " wide");
  shown.forEach(g => grid.appendChild(trainTile(game, g, cfg, unit, st, list, progressEl)));
  list.appendChild(grid);

  if (collapsible && !st.multi) {
    const more = document.createElement("button");
    more.type = "button";
    more.className = "train-more";
    more.textContent = st.expanded ? "Згорнути ▴" : `${recent.length ? "Недавні групи · " : ""}усі групи (${groups.length}) ▾`;
    more.addEventListener("click", () => { st.expanded = !st.expanded; renderTrainPicker(game, list, progressEl); });
    list.appendChild(more);
  }

  if (st.multi) {
    const picked = groups.filter(g => st.picked.has(g.key));
    const n = picked.reduce((s, g) => s + g.items.length, 0);
    const go = document.createElement("button");
    go.type = "button";
    go.className = "btn-primary train-go";
    go.disabled = !picked.length;
    go.textContent = picked.length
      ? `▶ Тренувати: ${picked.length} ${plural(picked.length, "група", "групи", "груп")} · ${n} ${plural(n, ...unit)}`
      : "Познач групи, які хочеш тренувати";
    go.addEventListener("click", () => startGroupTraining(game, picked.map(g => g.key)));
    list.appendChild(go);
  }

  if (progressEl) {
    const done = cfg.open ? 0 : groups.filter(g => trainBest(g) >= g.items.length).length;
    const due = typeof memState === "function" ? groups.filter(g => { const m = memRead(g.key); return m && memRecall(m) < MEM_DUE; }).length : 0;
    progressEl.textContent = [done ? `✓ вивчено ${done} з ${groups.length} груп` : "", due ? `🔁 час повторити: ${due}` : ""].filter(Boolean).join(" · ");
    if (typeof memSummary === "function") memSummary(progressEl, groups.filter(g => !g.topic)); // 🧠 загальний стан пам'яті
  }
}

function trainTile(game, g, cfg, unit, st, list, progressEl) {
  const n = g.items.length;
  const btn = document.createElement("button");
  btn.type = "button";
  btn.className = "group-tile train-tile";
  if (g.topic) btn.classList.add("topic-tile");
  const label = document.createElement("span");
  label.className = "group-label";
  label.textContent = g.name;
  const info = document.createElement("span");
  info.className = "group-info";
  if (cfg.open) {
    const acc = trainAcc(g);
    info.textContent = acc && acc.n ? `${n} ${plural(n, ...unit)} · точність ${Math.round(acc.c / acc.n * 100)}%` : `${n} ${plural(n, ...unit)}`;
    if (acc && acc.n) {
      btn.classList.add(acc.c >= acc.n ? "mastered" : "tried");
      btn.style.setProperty("--p", (acc.c / acc.n).toFixed(2));
      btn.style.setProperty("--h", Math.round(45 + 55 * acc.c / acc.n));
    }
  } else {
    const best = trainBest(g);
    const mastered = best >= n;
    if (mastered) btn.classList.add("mastered");
    else if (best > 0) {
      btn.classList.add("tried");
      btn.style.setProperty("--p", (best / n).toFixed(2));
      btn.style.setProperty("--h", Math.round(45 + 55 * best / n));
    }
    info.textContent = mastered ? "✓ вивчено" : best > 0 ? `${Math.round(best / n * 100)}%` : `${n} ${plural(n, ...unit)}`;
  }
  btn.append(label, info);
  // 🧠 пам'ять (memory.js): колір — як вивчив, яскравість згасає з часом, «🔁 повтори», коли пора
  if (typeof memState === "function") {
    const acc = cfg.open ? trainAcc(g) : null;
    const fallback = cfg.open ? (acc && acc.n ? acc.c / acc.n : 0) : trainBest(g) / n;
    memPaint(btn, memState(g.key, fallback));
  }
  if (g.sub) {
    const sub = document.createElement("span");
    sub.className = "group-sub";
    sub.textContent = g.sub;
    btn.appendChild(sub);
  }
  if (st.multi && st.picked.has(g.key)) btn.classList.add("picked");
  btn.addEventListener("click", () => {
    if (st.multi) {
      if (st.picked.has(g.key)) st.picked.delete(g.key); else st.picked.add(g.key);
      renderTrainPicker(game, list, progressEl);
    } else {
      startGroupTraining(game, [g.key]);
    }
  });
  return btn;
}

function startGroupTraining(game, keys) {
  const cfg = TRAIN_GAMES[game];
  const all = cfg.groups();
  const groups = keys.map(k => all.find(g => g.key === k)).filter(Boolean);
  if (!groups.length) return;
  clearTimeout(nextTimer);
  endless = false;
  const queue = [...new Set(groups.flatMap(g => g.items))];
  shuffleArray(queue);
  currentGame = game;
  streak = 0;
  trainState(game).multi = false;
  trainState(game).picked.clear();
  // недавні групи — для згорнутого переліку
  const recent = [...keys, ...trainRecent(game).filter(k => !keys.includes(k))].slice(0, 6);
  storageSet(`train_recent_${game}`, JSON.stringify(recent));
  training = {
    game, keys, groups, cfg, open: Boolean(cfg.open),
    groupIndex: groups.length === 1 ? all.indexOf(groups[0]) : -1,
    round: 1, queue, total: queue.length, done: 0, firstTry: 0, roundMistakes: [],
    results: new Map()
  };
  track("training_start", { game_type: game, group: groups.map(g => g.name).join(", ").slice(0, 120) });
  $("btn-menu").textContent = "‹ Групи";
  $("test-note").hidden = true;
  $("level-line").hidden = true;
  hintEl.textContent = "";
  updateUI();
  setPrevCard(null);
  showScreen("game");
  nextQuestion();
}

// Наступне завдання тренування (викликає nextQuestion у script.js)
function nextTrainingItem() {
  const raw = training.queue.shift();
  training.raw = raw;
  currentQuestion = training.cfg.prep ? training.cfg.prep(raw) : raw;
  training.cfg.render();
  if (training.round === 1 && training.done > 0) $("btn-menu").textContent = "Завершити";
}

// Відповідь у тренуванні (викликає handleAnswer): запам'ятовуємо, яке завдання — правильно з першого разу
function noteTrainingAnswer(isCorrect) {
  if (training && training.game && training.round === 1 && training.raw !== undefined) {
    training.results.set(training.raw, isCorrect);
  }
}

// Записати результат у групи (і при достроковому виході)
function saveTrainingResults() {
  const t = training;
  if (!t || !t.game || t.round !== 1 || !t.results.size || t.saved === t.results.size) return;
  t.saved = t.results.size;
  t.groups.forEach(g => {
    const ok = g.items.filter(x => t.results.get(x) === true).length;
    const seen = g.items.filter(x => t.results.has(x)).length;
    if (!seen) return;
    if (t.open) storageSet(`${g.key}_acc`, JSON.stringify({ c: ok, n: seen }));
    else if (ok > trainBest(g)) storageSet(g.key, String(ok));
    // 🧠 пам'ять (memory.js) — один раз за тренування, якщо пройдено більшу частину групи
    t.memDone = t.memDone || new Set();
    const enough = t.open ? seen >= Math.min(g.items.length, 10) : seen >= Math.max(1, Math.ceil(g.items.length * 0.6));
    if (typeof memUpdate === "function" && enough && !t.memDone.has(g.key)) {
      t.memDone.add(g.key);
      // 07.11.2026 (власниця): повторення починається, лише коли групу довчено до 80 % — до того мотивуємо ще спробу
      if (!memRead(g.key) && typeof MEM_START === "number" && ok / seen < MEM_START) {
        t.memLow = Math.min(t.memLow == null ? 1 : t.memLow, ok / seen);
        t.memLowName = g.name;
        return;
      }
      if (!memRead(g.key)) t.memFirst = true; // вивчає вперше → найшвидше забування попереду
      const sNew = memUpdate(g.key, ok / seen, { game: t.game, src: "train", n: seen, size: g.items.length });
      t.memNext = Math.min(t.memNext || Infinity, sNew);
    }
  });
}

// Кінець раунду: усі завдання пройдено або учень натиснув «Завершити» (early)
function finishGroupTraining(early = false) {
  const t = training;
  clearTimeout(nextTimer);
  const wrong = t.roundMistakes;
  const answered = t.round === 1 ? t.results.size : t.total - t.queue.length;
  if (t.round === 1) {
    saveTrainingResults();
    track("training_done", { game_type: t.game, group: t.groups.map(g => g.name).join(", ").slice(0, 120), first_try: t.firstTry, total: answered, early });
  }
  const title = t.groups.length === 1 ? t.groups[0].name : `${t.groups.length} ${plural(t.groups.length, "група", "групи", "груп")}`;
  $("train-title").textContent = t.round === 1 ? title : wrong.length === 0 ? "Помилки виправлено 💪" : "Ще трохи!";
  if (t.round === 1) {
    const pct = answered ? Math.round(t.firstTry / answered * 100) : 0;
    $("train-score").textContent = `${t.firstTry}/${answered}`;
    $("train-sub").textContent = !answered ? "Ще не було відповідей"
      : early || t.open ? `правильно з першого разу · точність ${pct}%${early && !t.open ? ` · пройдено ${answered} з ${t.total}` : ""}`
      : wrong.length === 0 ? "Без жодної помилки! 🎉" : "правильно з першого разу";
    // 🧠 коли повторити (memory.js)
    if (t.memNext && isFinite(t.memNext) && typeof memWhen === "function") {
      if (!t.memFirst) $("train-sub").textContent += ` · 🧠 повтори ${memWhen(t.memNext)}`;
      memOverNote(t.memFirst ? t.memNext : 0);
    } else if (t.memLow != null && typeof memLowNote === "function") memLowNote(t);
    else if (typeof memOverNote === "function") memOverNote(-1);
  } else {
    $("train-score").textContent = wrong.length === 0 ? "✓" : `${t.total - wrong.length}/${t.total}`;
    if (typeof memOverNote === "function") memOverNote(-1);
    $("train-sub").textContent = wrong.length === 0 ? "Усі завдання тепер правильні" : "Ці завдання ще раз — і готово";
  }
  const uniq = new Set(wrong.map(m => m.question)).size;
  const fixBtn = $("btn-fix-mistakes");
  fixBtn.hidden = wrong.length === 0;
  fixBtn.textContent = `🔁 Робота над помилками (${uniq})`;
  const all = t.cfg.groups();
  const next = t.groupIndex >= 0 && !early ? all[t.groupIndex + 1] : null;
  const nextBtn = $("btn-train-next");
  nextBtn.hidden = wrong.length > 0 || !next || (t.game === "naholosy" && next.topic);
  if (next) nextBtn.textContent = `Наступна група: ${next.name} →`;
  renderMistakes(wrong, $("train-mistakes-list"), $("train-mistakes"));
  if (wrong.length === 0 && t.round === 1 && !early && answered) launchConfetti();
  showScreen("trainOver");
}

function trainingBackToGroups() {
  const game = training ? training.game : modesGame;
  if (game === "inshomovni") showInshModes();
  else if (game === "leksychna" && typeof showLeksModes === "function") showLeksModes(); // leks.js
  else if (game === "inshe" && insheQuiz && insheQuiz.flag === "daily") showInsheSections("mix"); // inshe.js
  else showModes(game);
}

// ---------- Групи для дуелі й онлайн-ігор (усі режими, крім марафону) ----------
// Вибір зберігається для кожної гри (localStorage `train_play_<гра>`, порожньо — усі групи).
// Дуель (script.js nextDuelRound) і онлайн (online.js poolIndices, поле online.groups — номери груп
// через кому, однакові в усіх гравців) беруть лише завдання вибраних груп.
function playKeys(game) {
  try { return JSON.parse(storageGet(`train_play_${game}`) || "[]"); } catch (e) { return []; }
}

function playGroupsOf(game, keys = playKeys(game)) {
  const cfg = TRAIN_GAMES[game];
  if (!cfg || !keys.length) return [];
  return cfg.groups().filter(g => keys.includes(g.key));
}

// Номери вибраних груп (для online.groups)
function playGroupIndexes(game) {
  const cfg = TRAIN_GAMES[game];
  if (!cfg) return "";
  const keys = playKeys(game);
  return cfg.groups().map((g, i) => (keys.includes(g.key) ? i : -1)).filter(i => i >= 0).join(",");
}

// Чи підходить завдання до вибраних груп (для словосполучень — за текстом картки)
function playFilter(game, indexes) {
  const cfg = TRAIN_GAMES[game];
  if (!cfg) return null;
  const all = cfg.groups();
  const groups = indexes != null
    ? String(indexes).split(",").filter(Boolean).map(Number).map(i => all[i]).filter(Boolean)
    : playGroupsOf(game);
  if (!groups.length) return null;
  const items = new Set(groups.flatMap(g => g.items));
  if (game === "slovospoluch") {
    const texts = new Set([...items].map(c => c.text));
    return x => texts.has(x.text);
  }
  return x => items.has(x);
}

function renderPlayGroups(game) {
  const duelPanel = document.querySelector('#modes [data-panel="duel"]');
  let box = $("play-groups");
  if (!box) {
    box = document.createElement("div");
    box.id = "play-groups";
    box.className = "play-groups";
    duelPanel.before(box);
  }
  const cfg = TRAIN_GAMES[game];
  box.hidden = !cfg || game === "chyslivnyky" || game === "inshe";
  if (box.hidden) return;
  const groups = cfg.groups();
  const keys = playKeys(game).filter(k => groups.some(g => g.key === k));
  const st = trainState(game);
  const chosen = groups.filter(g => keys.includes(g.key));
  const n = chosen.reduce((s, g) => s + g.items.length, 0);
  box.innerHTML = "";
  const head = document.createElement("button");
  head.type = "button";
  head.className = "play-head";
  head.innerHTML = "";
  const t = document.createElement("span");
  t.textContent = `🎲 Дуель і онлайн: ${chosen.length ? `${chosen.length} ${plural(chosen.length, "група", "групи", "груп")} · ${n} ${plural(n, ...TRAIN_UNITS[game])}` : "усі групи"}`;
  const ch = document.createElement("span");
  ch.className = "play-change";
  ch.textContent = st.playOpen ? "Готово ▴" : "Змінити ▾";
  head.append(t, ch);
  head.addEventListener("click", () => { st.playOpen = !st.playOpen; renderPlayGroups(game); });
  box.appendChild(head);
  if (!st.playOpen) return;
  const chips = document.createElement("div");
  chips.className = "play-chips";
  const allChip = document.createElement("button");
  allChip.type = "button";
  allChip.className = "topic-chip" + (keys.length ? "" : " on");
  allChip.textContent = "Усі групи";
  allChip.addEventListener("click", () => { storageSet(`train_play_${game}`, "[]"); renderPlayGroups(game); });
  chips.appendChild(allChip);
  groups.forEach(g => {
    const c = document.createElement("button");
    c.type = "button";
    c.className = "topic-chip" + (keys.includes(g.key) ? " on" : "");
    c.textContent = g.name;
    c.addEventListener("click", () => {
      const next = keys.includes(g.key) ? keys.filter(k => k !== g.key) : [...keys, g.key];
      storageSet(`train_play_${game}`, JSON.stringify(next));
      renderPlayGroups(game);
    });
    chips.appendChild(c);
  });
  box.appendChild(chips);
}

// «Іншомовні слова» (бета, PRO): іншомовне слово → 5 українських відповідників, 1 правильний.
// Дані — inshomovni-data.js. Гра як «Числівники»: марафон, 3 життя, після відповіді — усі відповідники й «Далі →».
// Підключення в script.js: GAMES, DELAYS, startGame, nextQuestion, updateUI, gameOver, клавіші 1–5.
const INSH_TOTAL = typeof inshomovniData !== "undefined" ? inshomovniData.length : 0;
const INSH_OPTIONS = 5;
const INSH_EXAM = new Set(typeof inshomovniExam !== "undefined" ? inshomovniExam : []);

// «випуск (грошей, цінних паперів), емісія» -> ["випуск (грошей, цінних паперів)", "емісія"]: коми в дужках не ділять
function inshSplit(text) {
  return text.split(/[,;](?![^()]*\))/).map(s => s.trim()).filter(Boolean);
}

// Що можна написати на кнопці: один із перших трьох відповідників, без слів у дужках —
// і лише ОДНЕ слово (власниця, 09.11.2026: «імміграція» → «переселення», не «переселення в країну»);
// де жодного однослівного немає — row[3] у даних. Повний рядок — у «Повному переліку» й після відповіді.
function inshShown(row) {
  const all = row[3] || inshSplit(row[2]).slice(0, 3).map(s => s.replace(/\s*\([^)]*\)/g, "").trim());
  const one = all.filter(s => s && !/\s/.test(s));
  return one.length ? one : all;
}

// «Корені» відповідників (перші 5 букв слів) — щоб не поставити поруч синоніми
const inshStemCache = new Map();
function inshStems(row) {
  if (!inshStemCache.has(row)) {
    const words = row[2].toLowerCase().replace(/[(),;]/g, " ").split(/\s+/).filter(w => w.length >= 4);
    inshStemCache.set(row, new Set(words.map(w => w.slice(0, 5))));
  }
  return inshStemCache.get(row);
}

let inshApartMap = null; // слово -> номери груп близьких слів (inshomovniApart)
function inshClash(a, b) {
  if (!inshApartMap) {
    inshApartMap = new Map();
    (typeof inshomovniApart !== "undefined" ? inshomovniApart : []).forEach((g, i) => g.forEach(w => {
      if (!inshApartMap.has(w)) inshApartMap.set(w, []);
      inshApartMap.get(w).push(i);
    }));
  }
  const ga = inshApartMap.get(a[0]) || [];
  const gb = inshApartMap.get(b[0]) || [];
  if (ga.some(i => gb.includes(i))) return true;
  const sb = inshStems(b);
  for (const s of inshStems(a)) if (sb.has(s)) return true;
  return false;
}

let inshKindMap = null; // слово -> група за змістом (inshomovniKinds); без групи — частина мови
function inshKind(row) {
  if (!inshKindMap) {
    inshKindMap = new Map();
    Object.entries(typeof inshomovniKinds !== "undefined" ? inshomovniKinds : {})
      .forEach(([k, words]) => words.forEach(w => inshKindMap.set(w, k)));
  }
  return inshKindMap.get(row[0]) || row[1];
}

function inshQueue() {
  const all = [...inshomovniData];
  shuffleArray(all);
  return all;
}

// Картка: правильний відповідник + 4 неправильні з інших слів тієї самої частини мови
function makeInshCard(row) {
  const answer = pickOne(inshShown(row));
  const options = [answer];
  const from = new Map([[answer, row]]);
  // Спершу — слова з тієї самої групи за змістом (особи, місця, процеси…), потім — решта тієї самої частини мови
  // у демо (demo/inshomovni-data.js) — ще й дієслова для варіантів (inshomovniDemoExtra), щоб вистачало того самого виду
  const src = typeof inshomovniDemoExtra !== "undefined" ? [...inshomovniData, ...inshomovniDemoExtra] : inshomovniData;
  const fits = src.filter(r => r !== row && r[1] === row[1] && !inshClash(row, r));
  const kind = inshKind(row);
  const near = fits.filter(r => inshKind(r) === kind);
  const far = fits.filter(r => inshKind(r) !== kind);
  shuffleArray(near);
  shuffleArray(far);
  const pool = [...near, ...far];
  // дієслова: усі варіанти одного виду з правильним («що робити?» / «що зробити?»; inshomovniAspect)
  const ASP = typeof inshomovniAspect !== "undefined" ? inshomovniAspect : {};
  const want = row[1] === "v" ? ASP[answer] : null;
  for (const r of pool) {
    if (options.length >= INSH_OPTIONS) break;
    const free = inshShown(r).filter(w => !options.includes(w) && !(want && ASP[w] && ASP[w] !== want));
    if (!free.length) continue;
    const w = pickOne(free);
    options.push(w);
    from.set(w, r);
  }
  // запас (мало слів, напр. у демо): дієслова іншого виду — лише якщо інакше варіантів бракує
  for (const r of pool) {
    if (options.length >= INSH_OPTIONS) break;
    const free = inshShown(r).filter(w => !options.includes(w));
    if (!free.length || from.has(free[0])) continue;
    const w = pickOne(free);
    options.push(w);
    from.set(w, r);
  }
  if (row[1] === "d") {
    const stems = inshStems(row);
    const extra = (typeof inshomovniExtraAdverbs !== "undefined" ? inshomovniExtraAdverbs : [])
      .filter(w => !options.includes(w) && !stems.has(w.slice(0, 5)));
    shuffleArray(extra);
    while (options.length < INSH_OPTIONS && extra.length) options.push(extra.pop());
  }
  shuffleArray(options);
  return { row, answer, options, from };
}

// «індУстрія» -> індустрія з підсвіченим наголосом
function inshWordNode(word, tag = "span") {
  const el = document.createElement(tag);
  renderStressWord(el, word);
  return el;
}

function renderInshomovni() {
  const card = makeInshCard(currentQuestion);
  const [word, , meaning] = card.row;
  questionEl.textContent = "Обери український відповідник";
  hintEl.textContent = `Підказка: можна відповідати клавішами 1–${card.options.length}`;

  sentenceEl.hidden = false;
  sentenceEl.innerHTML = "";
  // 💥 слово вже було на іспиті (inshomovniExam у inshomovni-data.js)
  if (INSH_EXAM.has(word)) {
    const exam = document.createElement("p");
    exam.className = "exam-badge";
    exam.textContent = "💥 Було на іспиті";
    sentenceEl.appendChild(exam);
  }
  const line = inshWordNode(word, "p");
  line.className = "insh-word";
  sentenceEl.appendChild(line);

  answersEl.classList.add("frazeo-answers");
  card.options.forEach(option => {
    const btn = document.createElement("button");
    btn.className = "answer frazeo-answer";
    btn.dataset.word = option;
    btn.textContent = option;
    btn.onclick = () => {
      const isCorrect = option === card.answer;
      handleAnswer(isCorrect, () => {
        Array.from(answersEl.children).forEach(b => {
          if (b.dataset.word === card.answer) {
            b.classList.add("correct");
            if (!isCorrect) b.classList.add("blink");
          } else if (b !== btn) {
            b.classList.add("dim");
          }
        });
        if (!isCorrect) btn.classList.add("wrong");
        // Усі відповідники, як у переліку, — щоб запам'ятати
        const note = document.createElement("p");
        note.className = "frazeo-meaning";
        note.append(inshWordNode(word, "b"), ` — ${meaning}`);
        sentenceEl.appendChild(note);
        // Картинка й асоціація: звідки слово (inshomovni-notes.js)
        const extra = typeof inshomovniNotes !== "undefined" && inshomovniNotes[word];
        if (extra) {
          const tip = document.createElement("p");
          tip.className = "insh-note";
          const pic = document.createElement("span");
          pic.className = "insh-pic";
          pic.textContent = extra[0];
          const txt = document.createElement("span");
          txt.textContent = extra[1];
          tip.append(pic, txt);
          sentenceEl.appendChild(tip);
        }
        const other = card.from.get(option);
        if (!isCorrect && other) {
          const wrong = document.createElement("p");
          wrong.className = "frazeo-meaning frazeo-meaning-wrong";
          wrong.append(`«${option}» — це `, inshWordNode(other[0], "b"));
          sentenceEl.appendChild(wrong);
        }
        const next = document.createElement("button");
        next.className = "btn-secondary frazeo-next";
        next.textContent = "Далі →";
        next.addEventListener("click", skipWait);
        sentenceEl.appendChild(next);
      }, { frazeo: true, text: `${word.toLowerCase()} — ${meaning}`, chosen: option });
    };
    answersEl.appendChild(btn);
  });
}

// ---------- Екран режимів: марафон або тренування за групою (inshomovniGroups у inshomovni-data.js) ----------
// Тренування — як у «Наголосах»: слова групи без життів, наприкінці робота над помилками.
// Найкращий результат групи з першого разу — localStorage train_inshomovni_<назва групи>.
screens.inshModes = (() => {
  const main = document.createElement("main");
  main.id = "insh-modes";
  main.className = "screen";
  main.hidden = true;
  main.innerHTML = `
    <header class="top-bar">
      <button id="btn-insh-back" class="icon-btn" aria-label="В меню">‹ Меню</button>
      <h2 class="screen-title">🌍 Іншомовні слова</h2>
    </header>
    <section class="mode-panel">
      <div class="mode-head">
        <span class="mode-num">1</span>
        <span class="mode-head-text">
          <span class="mode-title">🎯 Тренування за темами</span>
          <span class="mode-desc">Групи до 15 слів, без життів, з роботою над помилками</span>
          <span id="insh-groups-progress" class="mode-progress"></span>
        </span>
      </div>
      <div id="insh-group-list" class="group-grid insh-group-grid"></div>
    </section>
    <section class="mode-panel">
      <div class="mode-head">
        <span class="mode-num">2</span>
        <span class="mode-head-text">
          <span class="mode-title">🏁 Марафон</span>
          <span id="insh-marathon-desc" class="mode-desc"></span>
        </span>
      </div>
      <button id="btn-insh-marathon" class="btn-primary mode-start">
        Почати марафон
        <span class="mode-best" data-best="inshomovni"></span>
      </button>
    </section>`;
  $("menu").after(main);
  return main;
})();

// власниця, 08.11.2026: не більше 15 слів у групі — велика тема ділиться рівно: «Наука (1)», «Наука (2)»
const INSH_GROUPS = (typeof inshomovniGroups !== "undefined" ? inshomovniGroups : []).flatMap(g => {
  const parts = splitEven(g.words, 15);
  return parts.map((words, k) => ({ ...g, name: parts.length > 1 ? `${g.name} (${k + 1})` : g.name, words }));
});
const inshGroupKey = i => `train_inshomovni_${INSH_GROUPS[i].name}`;

function showInshModes() {
  clearTimeout(nextTimer);
  training = null;
  questionToken++;
  $("insh-marathon-desc").textContent = `Усі ${INSH_TOTAL} слів · 3 життя · рекорд`;
  if (typeof renderTrainPicker === "function") { // groups.js: кілька груп, згорнутий перелік
    renderTrainPicker("inshomovni", $("insh-group-list"), $("insh-groups-progress"));
    renderBestScores();
    showScreen("inshModes");
    return;
  }
  const list = $("insh-group-list");
  list.innerHTML = "";
  let done = 0;
  INSH_GROUPS.forEach((group, i) => {
    const n = group.words.length;
    const best = Number(storageGet(inshGroupKey(i))) || 0;
    const mastered = best >= n;
    if (mastered) done++;
    const btn = document.createElement("button");
    btn.className = "group-tile insh-tile" + (mastered ? " mastered" : best > 0 ? " tried" : "");
    if (best > 0 && !mastered) {
      const ratio = best / n;
      btn.style.setProperty("--p", ratio.toFixed(2));
      btn.style.setProperty("--h", Math.round(45 + 55 * ratio));
    }
    const label = document.createElement("span");
    label.className = "group-label";
    label.textContent = `${group.icon} ${group.name}`;
    const info = document.createElement("span");
    info.className = "group-info";
    info.textContent = mastered ? "✓ вивчено" : best > 0 ? `${Math.round((best / n) * 100)}%` : `${n} слів`;
    btn.append(label, info);
    btn.addEventListener("click", () => startInshTraining(i));
    list.appendChild(btn);
  });
  $("insh-groups-progress").textContent = done ? `✓ вивчено ${done} з ${INSH_GROUPS.length} груп` : "";
  renderBestScores();
  showScreen("inshModes");
}

function startInshTraining(i) {
  if (typeof startGroupTraining === "function") { startGroupTraining("inshomovni", [inshGroupKey(i)]); return; } // groups.js
  const group = INSH_GROUPS[i];
  if (!group) { showInshModes(); return; }
  clearTimeout(nextTimer);
  endless = false;
  const queue = group.words.map(w => inshomovniData.find(r => r[0] === w)).filter(Boolean);
  shuffleArray(queue);
  currentGame = "inshomovni";
  streak = 0;
  training = { groupIndex: i, round: 1, queue, total: queue.length, done: 0, firstTry: 0, roundMistakes: [] };
  track("training_start", { game_type: "inshomovni", group: group.name });
  $("btn-menu").textContent = "‹ Групи";
  $("test-note").hidden = true;
  $("level-line").hidden = true;
  updateUI();
  setPrevCard(null);
  showScreen("game");
  nextQuestion();
}

// Кінець раунду тренування (викликає finishTrainingRound у script.js)
function finishInshTraining() {
  const i = training.groupIndex;
  const group = INSH_GROUPS[i];
  const wrong = training.roundMistakes;
  const n = group.words.length;
  if (training.round === 1) {
    const best = Number(storageGet(inshGroupKey(i))) || 0;
    if (training.firstTry > best) storageSet(inshGroupKey(i), String(training.firstTry));
    track("training_done", { game_type: "inshomovni", group: group.name, first_try: training.firstTry, total: n });
  }
  $("train-title").textContent = training.round === 1 ? `${group.icon} ${group.name}`
    : wrong.length === 0 ? "Помилки виправлено 💪" : "Ще трохи!";
  if (training.round === 1) {
    $("train-score").textContent = `${training.firstTry}/${n}`;
    $("train-sub").textContent = wrong.length === 0 ? "Без жодної помилки! 🎉" : "правильно з першого разу";
  } else {
    $("train-score").textContent = wrong.length === 0 ? "✓" : `${training.total - wrong.length}/${training.total}`;
    $("train-sub").textContent = wrong.length === 0 ? "Усі слова групи тепер правильні" : "Ці слова ще раз — і готово";
  }
  const fixBtn = $("btn-fix-mistakes");
  fixBtn.hidden = wrong.length === 0;
  fixBtn.textContent = `🔁 Робота над помилками (${new Set(wrong.map(m => m.question)).size})`;
  const nextBtn = $("btn-train-next");
  const hasNext = i + 1 < INSH_GROUPS.length;
  nextBtn.hidden = wrong.length > 0 || !hasNext;
  if (hasNext) nextBtn.textContent = `Наступна група: ${INSH_GROUPS[i + 1].icon} ${INSH_GROUPS[i + 1].name} →`;
  renderMistakes(wrong, $("train-mistakes-list"), $("train-mistakes"));
  if (wrong.length === 0 && training.round === 1) launchConfetti();
  showScreen("trainOver");
}

$("btn-insh-back").addEventListener("click", showMenu);
$("btn-insh-marathon").addEventListener("click", () => startGame("inshomovni"));

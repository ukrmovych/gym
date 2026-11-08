// ================== Лексична помилка (словосполучення) — бета, PRO ==================
// Дані — slovospoluch-data.js. Учень бачить словосполучення й обирає «Правильно» / «Неправильно».
// З кожного рядка — дві картки (помилкова й правильна). На екрані режимів — вибір груп (галочки),
// вибір пам'ятається в localStorage (slovospoluch_groups) і діє в усіх режимах.
// Марафон: 3 життя, рекорд best_slovospoluch. Дуель на одному екрані — script.js (makeDuelRound),
// онлайн-режими — online.js (ONLINE_GAMES.slovospoluch). Підключається після script.js.

const SLOVO_GROUPS_KEY = "slovospoluch_groups";

// 07.11.2026 (власниця): вибір груп на екрані режимів прибрано — його робить «☑ Тренувати кілька груп»
// у «Тренуванні»; марафон і дуель/онлайн (свій вибір «🎲 Дуель і онлайн») — з усіх груп.
let slovoGroups = slovospoluchGroups.map(g => g.id);

function saveSlovoGroups() {
  try {
    localStorage.setItem(SLOVO_GROUPS_KEY, JSON.stringify(slovoGroups));
  } catch (e) {
    // нічого страшного — просто не збережеться
  }
}

function slovoRows() {
  return slovospoluchGroups.filter(g => slovoGroups.includes(g.id)).flatMap(g => g.rows);
}

// Скільки карток у грі (з кожного рядка — дві)
function slovoTotal() {
  return slovoRows().length * 2;
}

function slovoQueue() {
  const cards = [];
  slovoRows().forEach(([wrong, right, rule]) => {
    cards.push({ text: wrong, ok: false, wrong, right, rule });
    cards.push({ text: right, ok: true, wrong, right, rule });
  });
  shuffleArray(cards);
  return cards;
}

function renderSlovospoluch() {
  const q = currentQuestion;
  questionEl.textContent = "Чи правильне це словосполучення?";
  hintEl.textContent = "Підказка: можна відповідати клавішами 1 і 2";

  sentenceEl.hidden = false;
  sentenceEl.innerHTML = "";
  const line = document.createElement("p");
  line.className = "slovo-phrase";
  line.textContent = q.text;
  sentenceEl.appendChild(line);

  [["Правильно", true], ["Неправильно", false]].forEach(([label, saysOk]) => {
    const btn = document.createElement("button");
    btn.className = "answer slovo-answer";
    btn.textContent = label;
    btn.onclick = () => {
      const isCorrect = saysOk === q.ok;
      handleAnswer(isCorrect, () => {
        line.classList.add(q.ok ? "slovo-ok" : "slovo-bad");
        Array.from(answersEl.children).forEach(b => {
          if (b === btn) b.classList.add(isCorrect ? "correct" : "wrong");
          else if (!isCorrect) b.classList.add("correct", "blink");
          else b.classList.add("dim");
        });
        // Правильний варіант і пояснення — щоб запам'ятати, а не лише вгадати
        sentenceEl.appendChild(slovoPairNode(q));
        const note = document.createElement("p");
        note.className = "frazeo-meaning";
        note.textContent = q.rule;
        sentenceEl.appendChild(note);
        const next = document.createElement("button");
        next.className = "btn-secondary frazeo-next";
        next.textContent = "Далі →";
        next.addEventListener("click", skipWait);
        sentenceEl.appendChild(next);
      }, { slovo: true, wrong: q.wrong, right: q.right });
    };
    answersEl.appendChild(btn);
  });
}

// Рядок у списку помилок: «✗ мішає працювати → ✓ заважає працювати»
function slovoMistakeNodes(m) {
  const was = document.createElement("span");
  was.className = "was";
  was.textContent = m.wrong;
  const arrow = document.createElement("span");
  arrow.className = "arrow";
  arrow.textContent = "→";
  const right = document.createElement("span");
  right.className = "right plain-right";
  right.textContent = m.right;
  return [was, arrow, right];
}

// ---------- Вибір груп на екрані режимів (для всіх режимів) ----------
// Галочки малюються в #topic-picker (як вибір частини у «Фразеологізмах»).
// Зняти останню галочку не можна — хоча б одна група завжди відмічена.
let slovoPickerOpen = false;
function renderSlovoGroupPicker(box) {
  box.hidden = false;
  box.innerHTML = "";
  const hint = document.createElement("p");
  hint.className = "topic-hint";
  hint.textContent = "Які групи тренувати (для всіх режимів):";
  const list = document.createElement("div");
  list.className = "slovo-groups";
  const warn = document.createElement("p");
  warn.className = "topic-hint slovo-warn";
  warn.hidden = true;
  warn.textContent = "Хоча б одна група має бути відмічена";
  slovospoluchGroups.forEach(g => {
    const label = document.createElement("label");
    label.className = "feedback-check slovo-group";
    const input = document.createElement("input");
    input.type = "checkbox";
    input.checked = slovoGroups.includes(g.id);
    input.addEventListener("change", () => {
      const next = slovospoluchGroups.map(o => o.id)
        .filter(id => (id === g.id ? input.checked : slovoGroups.includes(id)));
      if (!next.length) {
        input.checked = true;
        warn.hidden = false;
        return;
      }
      slovoGroups = next;
      saveSlovoGroups();
      renderSlovoGroupPicker(box);
    });
    const text = document.createElement("span");
    const n = g.rows.length * 2;
    text.textContent = `${g.name} · ${n} ${plural(n, "картка", "картки", "карток")}`;
    label.append(input, text);
    list.appendChild(label);
  });
  // груп багато (05.11.2026 — 27) — перелік згорнутий: «Групи: усі · Змінити ▾»
  const det = document.createElement("details");
  det.className = "slovo-picker";
  det.open = slovoPickerOpen;
  det.addEventListener("toggle", () => { slovoPickerOpen = det.open; });
  const sum = document.createElement("summary");
  const all = slovoGroups.length === slovospoluchGroups.length;
  sum.innerHTML = `<span>🧩 Групи: ${all ? "усі" : `${slovoGroups.length} з ${slovospoluchGroups.length}`}</span><b>Змінити ▾</b>`;
  const allBtn = document.createElement("button");
  allBtn.type = "button";
  allBtn.className = "slovo-all";
  allBtn.textContent = all ? "Зняти всі, крім першої" : "☑ Відмітити всі";
  allBtn.addEventListener("click", () => {
    slovoGroups = all ? [slovospoluchGroups[0].id] : slovospoluchGroups.map(g => g.id);
    saveSlovoGroups();
    renderSlovoGroupPicker(box);
  });
  // 07.11.2026: перелік груп не показуємо (див. slovoGroups)
  slovoGroups = slovospoluchGroups.map(g => g.id);
  box.innerHTML = "";
  // основна версія: решта груп — 🔒 PRO (slovo-free-data.js)
  if (typeof slovoFreeLocked !== "undefined" && slovoFreeLocked.length) {
    const lk = document.createElement("details");
    lk.className = "leks-locked";
    const n = slovoFreeLocked.length;
    const up = typeof proUpsell === "function" && proUpsell();
    lk.innerHTML = `<summary>🔒 Ще ${n} ${plural(n, "група", "групи", "груп")} — у PRO</summary><div class="leks-locked-list">${slovoFreeLocked.map(x => `<span class="leks-locked-chip">🔒 ${x.replace(/[&<>]/g, "")}</span>`).join("")}</div>`;
    const b = document.createElement("button");
    b.type = "button";
    b.className = "btn-secondary leks-locked-btn";
    b.textContent = up ? UPSELL_CTA : PRO_WAIT_TEXT;
    b.onclick = () => (up ? upsellGo("slovo_locked") : proWaitClick(b));
    lk.addEventListener("toggle", () => { if (lk.open && up) upsellView("slovo_locked"); });
    lk.appendChild(b);
    box.append(lk);
  }
  const n = slovoTotal();
  $("marathon-desc").textContent = `${n} ${plural(n, "словосполучення", "словосполучення", "словосполучень")} · 3 життя`;
}

// ---------- Картки для дуелей і онлайн-режимів ----------
// Усі картки в незмінному порядку (однаковому на всіх пристроях онлайн-гри)
const SLOVO_CARDS = slovospoluchGroups.flatMap(g => g.rows.flatMap(([wrong, right, rule]) => [
  { g: g.id, text: wrong, ok: false, wrong, right, rule },
  { g: g.id, text: right, ok: true, wrong, right, rule }
]));
const SLOVO_ANSWERS = ["Правильно", "Неправильно"];

// groups — список id груп; порожній = усі
function slovoCardIndices(groups = slovoGroups) {
  return SLOVO_CARDS.map((c, i) => (!groups.length || groups.includes(c.g) ? i : -1)).filter(i => i >= 0);
}

// Картка для онлайн-режимів (online.js): дві кнопки в незмінному порядку
function slovoOnlineCard(c) {
  return { text: c.text, answer: c.ok ? SLOVO_ANSWERS[0] : SLOVO_ANSWERS[1], meaning: c.rule, pair: [c.wrong, c.right], options: [...SLOVO_ANSWERS] };
}

// Назва вибраних груп для лобі онлайн-гри (topic — id через кому; порожньо = усі)
function slovoGroupsName(topic) {
  const ids = topic ? topic.split(",") : [];
  if (!ids.length || ids.length === slovospoluchGroups.length) return "усі групи";
  return slovospoluchGroups.filter(g => ids.includes(g.id)).map(g => g.name).join(", ");
}

// «✗ мішає працювати → ✓ заважає працювати» (або «✓ … — правильно»)
function slovoPairNode(card) {
  const pair = document.createElement("p");
  pair.className = "slovo-pair";
  if (card.ok) {
    pair.textContent = `✓ ${card.right} — правильно`;
  } else {
    const was = document.createElement("s");
    was.textContent = card.wrong;
    const right = document.createElement("b");
    right.textContent = card.right;
    pair.append("✗ ", was, " → ✓ ", right);
  }
  return pair;
}

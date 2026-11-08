// «Рандомний тест НМТ» (PRO): випадкове завдання з офіційних тестів НМТ/ЗНО з однією правильною відповіддю.
// Дані — nmt-test-data.js: вантажимо лише при першому відкритті тренажера, щоб не гальмувати сайт.
// Номери вже показаних завдань — у localStorage «nmt_seen», щоб завдання не повторювалися,
// доки не пройдено всі. Рекорд (правильних відповідей за один раз) — «best_nmttest».

screens.nmttest = $("nmttest");
const NMT_LETTERS = ["А", "Б", "В", "Г", "Д"];
const NMT_VERSION = (document.currentScript && document.currentScript.src.split("?v=")[1]) || "";
let nmtHistory = [];   // відповіді цього разу: { task, picked }
let nmtCurrent = null; // поточне завдання
let nmtViewing = -1;   // яке з nmtHistory зараз переглядаємо (-1 — поточне)

function loadNmtData() {
  if (typeof nmtTestData !== "undefined") return Promise.resolve();
  if (typeof gymProLoad === "function") { // 🔒 лише тим, кому можна (loader.js → pro-data)
    return gymProLoad([`nmt-test-data.js?v=${NMT_VERSION}`]).then(() => {
      if (typeof nmtTestData === "undefined") throw new Error("no access");
    });
  }
  return new Promise((resolve, reject) => {
    const s = document.createElement("script");
    s.src = `nmt-test-data.js?v=${NMT_VERSION}`;
    s.onload = resolve;
    s.onerror = reject;
    document.head.appendChild(s);
  });
}

function nextNmtIndex() {
  let seen = [];
  try { seen = JSON.parse(storageGet("nmt_seen") || "[]"); } catch (e) { seen = []; }
  let left = nmtTestData.map((_, i) => i).filter(i => !seen.includes(i));
  if (!left.length) {
    seen = [];
    left = nmtTestData.map((_, i) => i);
  }
  const index = left[Math.floor(Math.random() * left.length)];
  seen.push(index);
  storageSet("nmt_seen", JSON.stringify(seen));
  return index;
}

async function startNmtTest() {
  nmtHistory = [];
  nmtCurrent = null;
  nmtViewing = -1;
  updateNmtScore();
  $("nmt-play").hidden = false;
  $("nmt-result").hidden = true;
  $("btn-nmt-finish").hidden = false;
  showScreen("nmttest");
  $("nmt-question").textContent = "Завантажую завдання…";
  $("nmt-answers").innerHTML = "";
  try {
    await loadNmtData();
  } catch (e) {
    $("nmt-question").textContent = "Не вдалося завантажити завдання. Перевір інтернет і спробуй ще раз.";
    return;
  }
  track("game_start", { game_type: "nmttest" });
  showNmtTask();
}

function updateNmtScore() {
  const right = nmtHistory.filter(h => h.picked === h.task.a).length;
  $("nmt-score").textContent = `${right} з ${nmtHistory.length}`;
}

// Малює завдання; picked — уже вибрана відповідь (для перегляду) або null
function renderNmtTask(task, picked) {
  $("nmt-topic").textContent = task.t;
  $("nmt-question").innerHTML = task.q.replace(/\n/g, "<br>"); // дані наші: лише <b>, <i>, <u>
  $("nmt-source").textContent = `Джерело: ${task.s}`;
  const box = $("nmt-answers");
  box.innerHTML = "";
  task.o.forEach((text, i) => {
    const btn = document.createElement("button");
    btn.className = "answer nmt-answer";
    btn.innerHTML = `<span class="nmt-letter">${NMT_LETTERS[i]}</span><span class="nmt-text">${text.replace(/\n/g, "<br>")}</span>`;
    btn.onclick = () => pickNmtAnswer(i, btn);
    box.appendChild(btn);
  });
  if (picked !== null) markNmtAnswers(task, picked);
  const fb = $("nmt-feedback");
  fb.textContent = "";
  fb.className = "feedback";
  if (picked !== null) {
    const ok = picked === task.a;
    fb.textContent = ok ? "Правильно!" : `Правильна відповідь — ${NMT_LETTERS[task.a]}`;
    fb.className = `feedback ${ok ? "good" : "bad"}`;
  }
  window.scrollTo(0, 0);
}

function markNmtAnswers(task, picked) {
  Array.from($("nmt-answers").children).forEach((b, i) => {
    b.disabled = true;
    if (i === task.a) b.classList.add("correct");
    else if (i === picked) b.classList.add("wrong");
    else b.classList.add("dim");
  });
}

function showNmtTask() {
  nmtViewing = -1;
  nmtCurrent = { task: nmtTestData[nextNmtIndex()], picked: null };
  renderNmtTask(nmtCurrent.task, null);
  updateNmtNav();
}

function pickNmtAnswer(picked, btn) {
  if (nmtViewing !== -1 || !nmtCurrent || nmtCurrent.picked !== null) return;
  const task = nmtCurrent.task;
  const ok = picked === task.a;
  nmtCurrent.picked = picked;
  nmtHistory.push(nmtCurrent);
  markNmtAnswers(task, picked);
  if (ok) sparkleAt(btn);
  updateNmtScore();
  const fb = $("nmt-feedback");
  fb.textContent = ok ? PRAISE[Math.floor(Math.random() * PRAISE.length)] : `Правильна відповідь — ${NMT_LETTERS[task.a]}`;
  fb.className = `feedback ${ok ? "good" : "bad"}`;
  updateNmtNav();
}

// «‹ Попереднє» — подивитися попереднє завдання з відповідями; «До поточного ›» — повернутися
function updateNmtNav() {
  const viewing = nmtViewing !== -1;
  const answered = nmtCurrent && nmtCurrent.picked !== null;
  // скільки завершених завдань є «позаду» того, що зараз на екрані
  const behind = viewing ? nmtViewing : nmtHistory.length - (answered ? 1 : 0);
  $("btn-nmt-prev").hidden = behind <= 0;
  $("btn-nmt-return").hidden = !viewing;
  $("btn-nmt-next").hidden = viewing || !answered;
  $("nmt-review").hidden = !viewing;
}

$("btn-nmt-prev").addEventListener("click", () => {
  const answered = nmtCurrent && nmtCurrent.picked !== null;
  nmtViewing = nmtViewing === -1 ? nmtHistory.length - (answered ? 2 : 1) : nmtViewing - 1;
  const h = nmtHistory[nmtViewing];
  renderNmtTask(h.task, h.picked);
  updateNmtNav();
});

$("btn-nmt-return").addEventListener("click", () => {
  const answered = nmtCurrent && nmtCurrent.picked !== null;
  const last = nmtHistory.length - (answered ? 2 : 1);
  if (nmtViewing < last) {
    nmtViewing++;
    const h = nmtHistory[nmtViewing];
    renderNmtTask(h.task, h.picked);
  } else {
    nmtViewing = -1;
    renderNmtTask(nmtCurrent.task, nmtCurrent.picked);
  }
  updateNmtNav();
});

function finishNmtTest() {
  const right = nmtHistory.filter(h => h.picked === h.task.a).length;
  const total = nmtHistory.length;
  const best = getBest("nmttest");
  const isRecord = right > best;
  if (isRecord) storageSet("best_nmttest", String(right));
  track("game_over", { game_type: "nmttest", score: right, answered: total });

  $("nmt-play").hidden = true;
  $("nmt-result").hidden = false;
  $("btn-nmt-finish").hidden = true;
  $("nmt-result-score").textContent = total
    ? `Правильно: ${right} з ${total} (${Math.round(right / total * 100)}%)`
    : "Ти ще не відповів на жодне завдання.";
  $("nmt-result-best").textContent = isRecord ? `🏆 Новий рекорд: ${right}!` : `Рекорд: ${Math.max(best, right)}`;

  const mistakes = nmtHistory.filter(h => h.picked !== h.task.a);
  $("nmt-mistakes-title").hidden = !mistakes.length;
  $("nmt-mistakes").innerHTML = mistakes.length ? mistakes.map(h => `
    <article class="nmt-mistake">
      <span class="nmt-topic">${h.task.t}</span>
      <div class="nmt-question">${h.task.q.replace(/\n/g, "<br>")}</div>
      <p class="nmt-your">✗ Твоя відповідь: <b>${NMT_LETTERS[h.picked]}</b> — ${h.task.o[h.picked]}</p>
      <p class="nmt-right">✓ Правильна: <b>${NMT_LETTERS[h.task.a]}</b> — ${h.task.o[h.task.a]}</p>
      <p class="nmt-source">Джерело: ${h.task.s}</p>
    </article>`).join("") : (total ? '<p class="nmt-no-mistakes">Без жодної помилки! 🎉</p>' : "");
  if (isRecord && right > 0) launchConfetti();
  if (typeof submitClassScore === "function" && right > 0) submitClassScore("nmttest", right); // 👥 таблиця класу
  if (typeof courseOnScore === "function") courseOnScore("nmttest", right); // 🎓 course.js
  window.scrollTo(0, 0);
}

$("btn-nmt-next").addEventListener("click", () => showNmtTask()); // через ім'я — demo.js обгортає
$("btn-nmt-finish").addEventListener("click", finishNmtTest);
$("btn-nmt-menu").addEventListener("click", showMenu);
$("btn-nmt-again").addEventListener("click", startNmtTest);
$("btn-nmt-result-menu").addEventListener("click", showMenu);

// «🎓 Я на курсі Укрмовича»: учень курсу (платформа /test/) вводить свій код → усі тренажери, що в беті, відкриті.
// Перевірка — функція Supabase course-access (supabase/functions/course-access), таблиці — course-access.sql.
// У Telegram акаунт прив'язується до учня: код вводиться один раз, далі доступ перевіряється за Telegram при кожному запуску
// (учня видалили / код змінили / вебінарник — доступу немає). У браузері — кнопка «Увійти через Telegram»
// (Telegram Login Widget, бот @ukrmovych_bot; домен сайту має бути вказаний у @BotFather → /setdomain):
// прив'язаний Telegram — доступ без коду; ще не прив'язаний — код один раз. Доступ у браузері — до закриття вкладки.
// До одного учня — лише один Telegram (код не передаси іншим); відв'язує власник у статистиці.
// Прапорець COURSE і BETA_OPEN — у script.js (потрібні до побудови меню).
screens.course = (() => {
  const main = document.createElement("main");
  main.id = "course-screen";
  main.className = "screen";
  main.hidden = true;
  main.innerHTML = `
    <header class="top-bar">
      <button id="btn-course-back" class="icon-btn" aria-label="В меню">‹ Меню</button>
      <h2 class="screen-title">Я на курсі</h2>
    </header>
    <section class="card course-card" id="course-body"></section>`;
  $("menu").after(main);
  return main;
})();

function courseInitData() {
  const tg = window.Telegram && Telegram.WebApp;
  return tg && tg.initData ? tg.initData : "";
}

function courseSaved() {
  try { return JSON.parse(sessionStorage.getItem("course_access") || localStorage.getItem("course_access") || "null"); } catch (e) { return null; }
}

function courseSave(name) {
  const v = JSON.stringify({ name, at: Date.now() });
  try { sessionStorage.setItem("course_access", v); } catch (e) { /* немає сховища */ }
  if (courseInitData()) storageSet("course_access", v); // лише в Telegram — назавжди
}

function courseForget() {
  try { sessionStorage.removeItem("course_access"); localStorage.removeItem("course_access"); } catch (e) { /* немає сховища */ }
}

async function courseRequest(body) {
  const res = await fetch(`${LB.url}/functions/v1/course-access`, {
    method: "POST",
    headers: { apikey: LB.anonKey, "Content-Type": "application/json" },
    body: JSON.stringify({ ...body, player: getPlayerId() })
  });
  return res.json();
}

const COURSE_ERRORS = {
  bad_code: "Такого коду немає 🤔 Перевір код у своєму кабінеті на платформі (8 букв і цифр).",
  taken: "Цей код уже прив'язано до іншого Telegram. Якщо це твій новий акаунт — напиши Укрмовичу (@ukr_movych), він відв'яже старий.",
  need_tg: "Увійди через свій Telegram — так доступом не зможе скористатися ніхто інший.",
  webinar: "Цей код — для вебінарів. Повний доступ до тренажерів мають учні курсу 🙂",
  no_code: "Введи свій код із платформи."
};

function renderCourseButton() {
  let btn = $("btn-course");
  if (!btn) {
    btn = document.createElement("button");
    btn.id = "btn-course";
    btn.type = "button";
    btn.className = "course-link";
    btn.addEventListener("click", showCourse);
    $("btn-feedback").after(btn);
  }
  const saved = COURSE && courseSaved();
  btn.textContent = saved ? `🎓 Ти на курсі Укрмовича — усі тренажери відкриті ✓` : "🎓 Я на курсі Укрмовича";
  btn.classList.toggle("on", Boolean(saved));
}

function showCourse() {
  const box = $("course-body");
  box.innerHTML = "";
  const saved = COURSE && courseSaved();
  if (saved) {
    box.innerHTML = `<h3 class="course-title">✅ ${saved.name ? `${escapeCourse(saved.name)}, ти` : "Ти"} на курсі!</h3>
      <p class="course-note">Тобі відкрито всі тренажери, зокрема ті, що ще в бета-версії. Тренуйся на здоров'я 💪</p>
      <p class="course-note small">${courseInitData() ? "Цей Telegram прив'язано до тебе — код більше вводити не треба." : "У браузері доступ діє до закриття вкладки — потім знову натисни «Увійти через Telegram» (без коду)."}</p>
      <button id="btn-course-out" class="btn-secondary" type="button">Вийти</button>`;
    $("btn-course-out").addEventListener("click", async () => {
      if (courseInitData()) courseRequest({ initData: courseInitData(), logout: true }).catch(() => {});
      courseForget();
      location.reload();
    });
  } else if (!courseInitData()) {
    // Браузер: спершу вхід через Telegram, код — лише якщо цей Telegram ще не прив'язаний
    const w = courseWidgetSaved();
    box.innerHTML = `<h3 class="course-title">🎓 Я на курсі Укрмовича</h3>
      <p class="course-note">Увійди через свій Telegram — і всі тренажери відкриються. Так твоїм доступом не скористається ніхто інший.</p>
      <div id="course-widget" class="course-widget"></div>
      <div id="course-code-box" hidden>
        <p class="course-note">Перший вхід: введи свій код із платформи (той, яким входиш у кабінет) — він прив'яжеться до цього Telegram, і далі код не знадобиться.</p>
        <input id="course-code" class="class-code-input" type="text" maxlength="12" placeholder="Твій код" autocomplete="off" autocapitalize="characters">
        <button id="btn-course-go" class="btn-primary" type="button">Прив'язати</button>
      </div>
      <p id="course-status" class="submit-status"></p>
      <p class="course-note small">Або відкрий гру в Telegram: <a href="${LB.telegramAppLink || "https://t.me/ukrmovych_bot/battle"}" target="_blank" rel="noopener">@ukrmovych_bot</a></p>`;
    const s = document.createElement("script");
    s.async = true;
    s.src = "https://telegram.org/js/telegram-widget.js?22";
    s.dataset.telegramLogin = "ukrmovych_bot";
    s.dataset.size = "large";
    s.dataset.radius = "12";
    s.dataset.lang = "uk";
    s.dataset.onauth = "courseOnWidget(user)";
    $("course-widget").appendChild(s);
    $("btn-course-go").addEventListener("click", () => courseWidgetLogin(courseWidgetSaved(), $("course-code").value.trim()));
    $("course-code").addEventListener("keydown", e => { if (e.key === "Enter") $("btn-course-go").click(); });
    if (w) courseWidgetLogin(w, "");
  } else {
    box.innerHTML = `<h3 class="course-title">🎓 Я на курсі Укрмовича</h3>
      <p class="course-note">Введи свій код із платформи (той, яким входиш у кабінет) — і всі тренажери відкриються.
        У Telegram код потрібен лише один раз.</p>
      <input id="course-code" class="class-code-input" type="text" maxlength="12" placeholder="Твій код" autocomplete="off" autocapitalize="characters">
      <button id="btn-course-go" class="btn-primary" type="button">Увійти</button>
      <p id="course-status" class="submit-status"></p>`;
    const go = async () => {
      const code = $("course-code").value.trim();
      const st = $("course-status");
      if (!code) { st.textContent = COURSE_ERRORS.no_code; st.className = "submit-status bad"; return; }
      $("btn-course-go").disabled = true;
      st.textContent = "Перевіряю…";
      st.className = "submit-status";
      try {
        const r = await courseRequest({ code, initData: courseInitData() });
        if (r.ok) {
          courseSave(r.name || "");
          track("course_join", { linked: Boolean(r.linked) });
          st.textContent = "✅ Готово! Відкриваю всі тренажери…";
          st.className = "submit-status good";
          setTimeout(() => location.reload(), 900);
          return;
        }
        st.textContent = COURSE_ERRORS[r.error] || "Не вдалося перевірити код. Спробуй ще раз.";
        st.className = "submit-status bad";
      } catch (e) {
        st.textContent = "Не вдалося перевірити код. Перевір інтернет і спробуй ще раз.";
        st.className = "submit-status bad";
      }
      $("btn-course-go").disabled = false;
    };
    $("btn-course-go").addEventListener("click", go);
    $("course-code").addEventListener("keydown", e => { if (e.key === "Enter") go(); });
  }
  showScreen("course");
}

// Telegram Login Widget у браузері
function courseWidgetSaved() {
  try { return JSON.parse(sessionStorage.getItem("course_tgw") || "null"); } catch (e) { return null; }
}

function courseOnWidget(user) {
  try { sessionStorage.setItem("course_tgw", JSON.stringify(user)); } catch (e) { /* немає сховища */ }
  courseWidgetLogin(user, "");
}

async function courseWidgetLogin(widget, code) {
  const st = $("course-status");
  if (!widget) { st.textContent = COURSE_ERRORS.need_tg; st.className = "submit-status bad"; return; }
  st.textContent = "Перевіряю…";
  st.className = "submit-status";
  try {
    const r = await courseRequest({ widget, code });
    if (r.ok) {
      courseSave(r.name || "");
      track("course_join", { linked: true, web: true });
      st.textContent = "✅ Готово! Відкриваю всі тренажери…";
      st.className = "submit-status good";
      setTimeout(() => location.reload(), 900);
      return;
    }
    if (r.error === "not_linked") {
      $("course-code-box").hidden = false;
      st.textContent = `Привіт${widget.first_name ? `, ${widget.first_name}` : ""}! Цей Telegram ще не прив'язаний до учня курсу.`;
      st.className = "submit-status";
      $("course-code").focus();
      return;
    }
    if (r.error === "bad_code" || r.error === "taken" || r.error === "webinar") $("course-code-box").hidden = false;
    st.textContent = COURSE_ERRORS[r.error] || "Не вдалося перевірити. Спробуй ще раз.";
    st.className = "submit-status bad";
  } catch (e) {
    st.textContent = "Не вдалося перевірити. Перевір інтернет і спробуй ще раз.";
    st.className = "submit-status bad";
  }
}

function escapeCourse(s) {
  return String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

// Результат гри учня курсу → «🎓 Мої учні» у статистиці (викликають classOnGameOver і тест НМТ)
function courseOnScore(game, value) {
  if (!COURSE || typeof leaderboardEnabled === "undefined" || !leaderboardEnabled) return;
  lbRequest("rpc/course_score", {
    method: "POST",
    body: JSON.stringify({ p_player: getPlayerId(), p_game: game, p_score: Math.max(0, Math.round(Number(value) || 0)) })
  }).catch(() => {});
}

// У Telegram: щоразу перевіряємо прив'язку (код ще дійсний?) і вмикаємо/вимикаємо доступ
async function courseCheckTelegram() {
  const initData = courseInitData();
  if (!initData || typeof leaderboardEnabled === "undefined" || !leaderboardEnabled) return;
  try {
    const r = await courseRequest({ initData });
    if (r.ok) {
      const had = COURSE;
      courseSave(r.name || "");
      // 🔒 дані PRO-ігор (loader.js) не прийшли, а доступ є — один раз перезавантажити, щоб отримати їх
      const noData = window.GYM_PRO && !GYM_PRO.ok && !GYM_PRO.fallback;
      let again = false;
      try { again = sessionStorage.getItem("gym_data_retry") === "1"; sessionStorage.setItem("gym_data_retry", "1"); } catch (e) { again = true; }
      if (!had || (noData && !again)) location.reload();
    } else if (["not_linked", "bad_code", "webinar"].includes(r.error) && localStorage.getItem("course_access")) {
      courseForget();
      location.reload();
    }
  } catch (e) { /* немає інтернету — лишаємо як було */ }
}

// Учень уже грав у тренажер у тесті на платформі (embed.js → квиток) — у цьому браузері вхід автоматичний:
// функція перевіряє прив'язку цього гравця (course_players) і чи код учня ще дійсний
async function courseCheckAuto() {
  if (COURSE || courseInitData() || typeof leaderboardEnabled === "undefined" || !leaderboardEnabled) return;
  let flag = null;
  try { flag = localStorage.getItem("course_auto"); } catch (e) { return; }
  if (flag !== "1") return;
  try {
    const r = await courseRequest({ auto: true });
    if (r.ok) { courseSave(r.name || ""); location.reload(); }
    else if (["not_linked", "bad_code", "webinar"].includes(r.error)) localStorage.removeItem("course_auto");
  } catch (e) { /* немає інтернету */ }
}

$("btn-course-back").addEventListener("click", showMenu);
renderCourseButton();
// telegram-web-app.js вантажиться асинхронно — трохи чекаємо
setTimeout(courseCheckTelegram, 1500);
if (typeof EMBED === "undefined" || !EMBED) setTimeout(courseCheckAuto, 1600);

// 🚀 Зворотний відлік до відкриття НМТ-качалки (власниця, 08.11.2026): неділя 15.11.2026, 20:30 за Києвом.
// Показується в меню новачкам і звичайним гравцям (не учасникам Спільноти й не учням курсу); після відкриття зникає сам.
// На всю ширину; вигляд — варіант 4 (інші для перегляду: …/gym/?cd=1…5).
// До відкриття закриті тренажери (у старих гравців — «скоро») показують «15.11», а їхнє вікно — відлік і кнопку
// «🔔 Повідомити, коли з'явиться» → функція later-remind (kind "launch"): бот напише о 20:30 15.11 (одне повідомлення на людину).
const GYM_LAUNCH_AT = Date.parse("2026-11-15T20:30:00+02:00");
function launchLeft() {
  const s = Math.max(0, Math.floor((GYM_LAUNCH_AT - Date.now()) / 1000)), d = Math.floor(s / 86400);
  const p = (n, a, b, c) => { const x = n % 10, y = n % 100; return x === 1 && y !== 11 ? a : x >= 2 && x <= 4 && (y < 12 || y > 14) ? b : c; };
  return `${d ? `${d} ${p(d, "день", "дні", "днів")} ` : ""}${String(Math.floor(s / 3600) % 24).padStart(2, "0")}:${String(Math.floor(s / 60) % 60).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
}
function launchNotify(gameId, btn) {
  const g = typeof GAMES !== "undefined" && GAMES.find(x => x.id === gameId);
  const initData = typeof telegramInitData === "function" ? telegramInitData() : "";
  try { track("launch_notify", { game_type: gameId }); } catch (e) { /* */ } // статистика «🔔 Попросили сповістити»
  if (!initData || typeof LB === "undefined" || !LB.url) {
    if (btn) { btn.textContent = "Відкрий гру в Telegram (@ukrmovych_bot) — і бот повідомить"; btn.disabled = true; }
    return;
  }
  if (btn) { btn.disabled = true; btn.textContent = "⏳ Записую…"; }
  fetch(`${LB.url}/functions/v1/later-remind`, {
    method: "POST",
    headers: { apikey: LB.anonKey, Authorization: `Bearer ${LB.anonKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({ initData, player: typeof getPlayerId === "function" ? getPlayerId() : undefined, when: "at",
      at: Math.max(GYM_LAUNCH_AT, Date.now() + 21 * 60e3), kind: "launch", go: gameId, game: g ? `${g.icon} ${g.name}` : "НМТ-качалка" })
  }).then(r => r.json()).then(r => {
    if (!btn) return;
    btn.textContent = r && r.ok ? "✅ Бот напише 15.11 о 20:30!" : "Не вийшло 😕 Спробуй ще раз";
    btn.disabled = Boolean(r && r.ok);
  }).catch(() => { if (btn) { btn.textContent = "Немає зв'язку 😕 Спробуй ще раз"; btn.disabled = false; } });
}
// вікно закритого тренажера («скоро») — відлік і «Повідомити»
if (typeof showSoon === "function" && Date.now() < GYM_LAUNCH_AT) {
  const soonOrig = showSoon;
  let soonTimer = null;
  showSoon = function (game) {
    soonOrig.apply(this, arguments);
    const card = document.querySelector("#soon .modal-card");
    if (!card) return;
    card.querySelector(".over-emoji").textContent = "🚀";
    const p = card.querySelector(":scope > p");
    p.innerHTML = `Відкриється <b>15 листопада о 20:30</b> — разом із відкриттям НМТ-качалки!<span class="soon-cd"></span>`;
    const cd = p.querySelector(".soon-cd");
    clearInterval(soonTimer);
    const tick = () => { if (card.closest("#soon").hidden) { clearInterval(soonTimer); return; } cd.textContent = `⏳ ${launchLeft()}`; };
    tick(); soonTimer = setInterval(tick, 1000);
    let nb = card.querySelector(".soon-notify");
    if (!nb) { nb = document.createElement("button"); nb.type = "button"; nb.className = "btn-primary soon-notify"; $("btn-soon-ok").before(nb); }
    nb.disabled = false;
    nb.textContent = "🔔 Повідомити, коли з'явиться";
    nb.onclick = () => launchNotify(game.id, nb);
    const ok = $("btn-soon-ok");
    ok.textContent = "Закрити";
    ok.className = "btn-secondary";
  };
}
(function () {
  const LAUNCH = Date.parse("2026-11-15T20:30:00+02:00");
  const START = Date.parse("2026-11-08T12:00:00+02:00"); // для смужки «скільки вже минуло»
  if (Date.now() >= LAUNCH) return;
  if ((typeof PRO_ACCESS !== "undefined" && PRO_ACCESS) || (typeof COURSE !== "undefined" && COURSE) || (typeof SCHOOL !== "undefined" && SCHOOL) || window.GYM_ONLY) return;
  const title = document.querySelector("#menu .title");
  if (!title) return;
  // власниця, 08.11.2026: обрано варіант 4 (нічне небо з ракетою), стиснутий по висоті; інші — лише для перегляду ?cd=1…5
  let view = 4;
  try { const q = new URLSearchParams(location.search).get("cd"); if (q && /^[1-5]$/.test(q)) view = Number(q); } catch (e) { /* */ }
  const box = document.createElement("div");
  box.className = `cd-box cd-v${view}`;
  const units = [["d", "днів"], ["h", "год"], ["m", "хв"], ["s", "сек"]];
  const cells = units.map(([u, l]) => `<span class="cd-c"><b data-u="${u}">00</b><small data-l="${u}">${l}</small></span>`).join('<i class="cd-sep">:</i>');
  const T = {
    1: `<div class="cd-top">🚀 <b>Відкриття НМТ-качалки</b></div><div class="cd-time">${cells}</div><div class="cd-when">неділя, 15 листопада · 20:30</div>`,
    2: `<div class="cd-row"><span class="cd-l">⚡ <b>Старт через</b></span><div class="cd-time">${cells}</div></div><div class="cd-when">Відкриття НМТ-качалки · 15.11 · 20:30</div>`,
    3: `<div class="cd-tk"><div class="cd-tk-l"><small>КВИТОК НА</small><b>Відкриття<br>НМТ-качалки</b><small>15.11 · 20:30</small></div><div class="cd-tk-r"><div class="cd-time">${cells}</div></div></div>`,
    4: `<div class="cd-sky"></div><div class="cd-top">🚀 <b>Відкриття НМТ-качалки</b> <small>· неділя, 15.11 · 20:30</small></div><div class="cd-time">${cells}</div><div class="cd-bar"><i></i><span class="cd-rk">🚀</span></div>`,
    5: `<div class="cd-top"><b>НМТ-качалка відкривається</b></div><div class="cd-time">${cells}</div><div class="cd-when">🔔 неділя · 15 листопада · 20:30</div>`
  };
  box.innerHTML = T[view] || T[1];
  title.after(box);
  const plural = (n, a, b, c) => { const x = n % 10, y = n % 100; return x === 1 && y !== 11 ? a : x >= 2 && x <= 4 && (y < 12 || y > 14) ? b : c; };
  const set = (u, v) => { const el = box.querySelector(`[data-u="${u}"]`); if (el && el.textContent !== v) { el.textContent = v; el.classList.remove("cd-flip"); void el.offsetWidth; el.classList.add("cd-flip"); } };
  const tick = () => {
    const left = Math.max(0, LAUNCH - Date.now());
    if (!left) { box.remove(); clearInterval(timer); return; }
    const s = Math.floor(left / 1000), d = Math.floor(s / 86400);
    set("d", String(d));
    const dl = box.querySelector('[data-l="d"]'); if (dl) dl.textContent = plural(d, "день", "дні", "днів");
    set("h", String(Math.floor(s / 3600) % 24).padStart(2, "0"));
    set("m", String(Math.floor(s / 60) % 60).padStart(2, "0"));
    set("s", String(s % 60).padStart(2, "0"));
    const bar = box.querySelector(".cd-bar");
    if (bar) bar.style.setProperty("--p", Math.min(1, Math.max(0, (Date.now() - START) / (LAUNCH - START))).toFixed(4));
  };
  const timer = setInterval(tick, 1000);
  tick();
})();

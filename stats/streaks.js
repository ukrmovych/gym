// 🔥 Вогники (08.11.2026, власниця): скільки учнів мають вогник і якої довжини, коли продовжують (до 19:00 чи після),
// самі чи кнопкою з нагадування бота. Дані — get_streak_stats (streak-stats.sql): події streak_hit / streak_reminder_open
// і надіслані нагадування gym_streak_sends. Поки вкладка відкрита — оновлюється раз на 5 хв.
(function () {
  const S = { timer: null };
  const pct = (a, b) => b ? Math.round(a / b * 100) : 0;
  const days = n => { const a = n % 10, b = n % 100; return a === 1 && b !== 11 ? "день" : a >= 2 && a <= 4 && (b < 12 || b > 14) ? "дні" : "днів"; };
  // total = 0 — без відсотків, смужки відносно найбільшого
  const bars = (rows, total) => { const m = Math.max(1, ...rows.map(r => r[1])); return rows.map(([k, v]) => `<div class="jr-row"><span>${k}</span><div class="jr-bar"><i style="width:${total ? pct(v, total) : pct(v, m)}%"></i></div><b>${v}${total ? ` · ${pct(v, total)} %` : ""}</b></div>`).join(""); };
  function render(d) {
    const box = document.getElementById("sk-box");
    if (!d.players && !d.sends.total) {
      box.innerHTML = '<p class="note">Вогники ще ніхто не запалював — дані з’являться, щойно учні почнуть грати з новою версією (від 08.11.2026).</p>';
      return;
    }
    const dist = Object.entries(d.dist || {}).map(([n, c]) => [+n, c]).sort((a, b) => a[0] - b[0]);
    const best = Object.entries(d.best || {}).map(([n, c]) => [+n, c]).sort((a, b) => b[0] - a[0]);
    const hrs = Array.from({ length: 24 }, (_, h) => (d.hours || []).find(x => x.h === h) || { h, self: 0, rem: 0 });
    const maxH = Math.max(1, ...hrs.map(x => x.self + x.rem));
    const allHits = d.src.self + d.src.reminder;
    box.innerHTML = `
      <div class="sk-cards">
        <div class="card"><div class="big">${d.alive}</div>мають вогник зараз</div>
        <div class="card"><div class="big">${d.today_done}</div>уже продовжили сьогодні</div>
        <div class="card"><div class="big">${d.at_risk}</div>під загрозою<br><small class="muted">вчора грали, сьогодні ще ні</small></div>
        <div class="card"><div class="big">${d.players}</div>хоч раз запалювали</div>
      </div>
      <h3>📏 Скільки днів поспіль зараз</h3>
      ${dist.length ? bars(dist.map(([n, c]) => [`🔥 ${n} ${days(n)}`, c]), d.alive) : '<p class="note">Зараз живих вогників немає.</p>'}
      <h3>🕰 Коли продовжують вогник</h3>
      <p class="small">До 19:00 — <b>${d.src.before19}</b> (${pct(d.src.before19, allHits)} %) · після 19:00 — <b>${d.src.after19}</b> (${pct(d.src.after19, allHits)} %)</p>
      <div class="sk-hours">${hrs.map(x => `<div class="sk-h" title="${x.h}:00 — сам: ${x.self}, з нагадування: ${x.rem}">
        <i class="sk-self" style="height:${(x.self / maxH) * 100}%"></i><i class="sk-rem" style="height:${(x.rem / maxH) * 100}%"></i>
        <span${x.h === 19 ? ' class="sk-19"' : ""}>${x.h}</span></div>`).join("")}</div>
      <p class="muted small"><span class="sk-key sk-self"></span> зайшов сам · <span class="sk-key sk-rem"></span> кнопкою з нагадування бота · за Києвом</p>
      <h3>🤖 Сам чи з нагадування</h3>
      ${bars([["🙋 сам", d.src.self], ["🔔 кнопкою з нагадування", d.src.reminder]], allHits)}
      <p class="small">Нагадувань надіслано: <b>${d.sends.total}</b> (дійшло ${d.sends.ok}) · після нагадування того ж дня продовжили: <b>${d.sends.back}</b> (${pct(d.sends.back, d.sends.ok)} %), з них саме кнопкою — <b>${d.sends.btn}</b> · натискань кнопки взагалі: ${d.opens}</p>
      <h3>📅 По днях</h3>
      <div class="ts-scroll"><table class="ts-table"><tr><th>День</th><th>Продовжили</th><th>Нові (1-й день)</th><th>Далі (2+)</th><th>Після 19:00</th><th>З нагадування</th><th>Нагадувань</th><th>Повернулися</th></tr>
      ${(d.days || []).map(x => `<tr><td>${x.day}</td><td>${x.hits}</td><td>${x.new}</td><td>${x.cont}</td><td>${x.after19}</td><td>${x.rem}</td><td>${x.sent}</td><td>${x.back}</td></tr>`).join("")}</table></div>
      ${best.length ? `<h3>🏆 Найдовші вогники за весь час</h3>${bars(best.slice(0, 12).map(([n, c]) => [`${n} ${days(n)}`, c]), 0)}` : ""}`;
  }
  async function load() {
    const box = document.getElementById("sk-box");
    try { render(await proRpc("get_streak_stats", {})); }
    catch (err) { box.innerHTML = `<p class="note">${err.message === "nosql" ? "У Supabase ще немає функції (streak-stats.sql)." : "Не вдалося завантажити. Перевір інтернет."}</p>`; }
  }
  window.loadStreaks = () => {
    document.getElementById("sk-box").innerHTML = '<p class="note">Рахую вогники…</p>';
    load();
    clearInterval(S.timer);
    S.timer = setInterval(() => { if (!document.getElementById("streaks-view").hidden) load(); }, 5 * 60 * 1000);
  };
})();

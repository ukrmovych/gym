// 🗺 Шляхи гравців (08.11.2026, власниця): як поводяться новачки в НМТ-качалці — архетипи, мапа першого заходу,
// найтиповіші маршрути й чи повертаються. Дані — get_journeys (journeys.sql), щоразу свіжі; поки вкладка відкрита —
// оновлюється сама раз на 5 хвилин, тож кожен новий гравець з'являється на мапі.
(function () {
  const J = { data: null, days: 30, timer: null, at: null };
  const H = 3600;
  const gname = g => (typeof GAME_NAMES !== "undefined" && GAME_NAMES[g]) || (typeof TS_GAMES !== "undefined" && TS_GAMES[g]) || g || "гра";
  const SHORT = { leksychna: "🔎 Лекс. речення", slovospoluch: "🧩 Лекс. словосполучення", frazeolohizmy: "💬 Фразеологізми", inshomovni: "🌍 Іншомовні", klychnyi: "📣 Кличний", chyslivnyky: "🔢 Числівники", nmttest: "📝 Тест НМТ", istoriia: "🏛️ Історія", inshe: "📂 Інше" };
  const short = g => SHORT[g] || gname(g).replace(/ \(.*\)$/, "");
  const e = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const pct = (a, b) => b ? Math.round(a / b * 100) : 0;

  // Кроки першого заходу: «почав групу» + «пройшов/кинув» зливаються в один крок; однакові підряд — в один
  function steps(p) {
    const out = [];
    for (let i = 0; i < p.length; i++) {
      const [k, g] = p[i].split(":");
      let label;
      if (k === "t") {
        const nx = p[i + 1] ? p[i + 1].split(":") : [];
        if ((nx[0] === "d" || nx[0] === "q") && nx[1] === g) { label = `${short(g)}: група ${nx[0] === "d" ? "пройдена ✅" : "кинута на півдорозі ✋"}`; i++; }
        else label = `${short(g)}: почав групу`;
      } else if (k === "d") label = `${short(g)}: пройшов групу ✅`;
      else if (k === "q") label = `${short(g)}: кинув групу ✋`;
      else if (k === "m") label = `${short(g)}: марафон`;
      else if (k === "s") label = `🔒 натиснув закрите`;
      else if (k === "u") label = `${short(g)}: дуель`;
      else if (k === "o") label = g ? `${short(g)}: онлайн з друзями` : "🌐 онлайн з друзями";
      else if (k === "l") label = `🏆 у таблицю рекордів`;
      else if (k === "x") label = `${short(g)}: демо`;
      else continue;
      if (out.length && out[out.length - 1] === label) continue;
      out.push(label);
    }
    return out;
  }
  function back(x, now) {
    if (x.r === null || x.r === undefined) return now - x.f < 24 * H ? "⏳ ще рано судити" : "🚪 більше не повернувся";
    if (x.r < 24) return "🔁 повернувся того ж дня";
    if (x.r < 48) return "📆 повернувся наступного дня";
    if (x.r < 24 * 8) return "🗓 повернувся протягом тижня";
    return "🐢 повернувся пізніше ніж за тиждень";
  }
  const ARCH = [
    { id: "regular", e: "📅", n: "Постійний", d: "Грав щонайменше 4 різні дні", t: x => x.d >= 4 },
    { id: "return", e: "🔁", n: "Повертається", d: "Грав 2–3 різні дні", t: x => x.d >= 2 },
    { id: "ghost", e: "👻", n: "Відкрив і зник", d: "Відкрив гру, але нічого не почав", t: x => x.a === 0 },
    { id: "peek", e: "🚪", n: "Глянув і пішов", d: "Один захід, 1–2 дії, нічого не пройшов до кінця", t: x => x.a <= 2 && x.td === 0 && x.md <= 1 },
    { id: "explorer", e: "🧭", n: "Мандрівник", d: "Один захід: спробував 3 і більше ігор", t: x => x.g.length >= 3 },
    { id: "focus", e: "🎯", n: "Зосереджений на одному", d: "Один захід: грав у 1–2 ігри, щось пройшов", t: () => true }
  ];
  const archOf = x => ARCH.find(a => a.t(x));

  function render() {
    const box = document.getElementById("jr-box");
    const now = Date.now() / 1000;
    const all = J.data || [];
    const list = J.days ? all.filter(x => now - x.f < J.days * 24 * H) : all;
    const N = list.length;
    const chips = [[7, "Новачки за 7 днів"], [30, "за 30 днів"], [0, "усі"]].map(([d, t]) =>
      `<button type="button" data-jr-days="${d}" class="${J.days === d ? "on" : ""}">${t}</button>`).join("");
    if (!N) { box.innerHTML = `<div class="jr-chips">${chips}</div><p class="note">За цей час нових гравців немає.</p>`; return; }
    list.forEach(x => { x._s = steps(x.p); x._b = back(x, now); x._a = archOf(x); });

    // 1. Архетипи
    const ac = ARCH.map(a => {
      const L = list.filter(x => x._a === a); const n = L.length;
      if (!n) return "";
      const first = {}; L.forEach(x => { const s = x._s[0]; if (s) first[s] = (first[s] || 0) + 1; });
      const top = Object.entries(first).sort((p, q) => q[1] - p[1])[0];
      const quit = L.reduce((k, x) => k + x.tq, 0), done = L.reduce((k, x) => k + x.td, 0);
      const med = [...L].map(x => x.a).sort((p, q) => p - q)[Math.floor(n / 2)];
      const tg = pct(L.filter(x => x.tg).length, n);
      return `<div class="jr-arch"><div class="jr-arch-h"><b>${a.e} ${a.n}</b><span>${n} · ${pct(n, N)} %</span></div>
        <div class="jr-bar"><i style="width:${pct(n, N)}%"></i></div>
        <p class="muted small">${a.d}.</p>
        <p class="small">${top ? `Найчастіше почав із: <b>${e(top[0])}</b> (${pct(top[1], n)} %)` : "Нічого не почав"}<br>
        Дій за весь час (медіана): <b>${med}</b> · груп пройдено/кинуто: <b>${done}</b> / <b>${quit}</b> · з Telegram: ${tg} %</p></div>`;
    }).join("");

    // 2. Мапа першого заходу (Санкі): Прийшов → крок 1 → крок 2 → крок 3 → що далі
    const TOP = 8;
    const seqs = list.map(x => {
      const s = x._s.slice(0, 3);
      const cols = [...s]; while (cols.length < 3) cols.push(cols.length === 0 ? "😶 нічого не почав" : "⏹ вийшов");
      return [...cols, x._b];
    });
    const colNodes = [];
    for (let c = 0; c < 4; c++) {
      const cnt = {}; seqs.forEach(q => { cnt[q[c]] = (cnt[q[c]] || 0) + 1; });
      const keep = new Set(Object.entries(cnt).sort((p, q) => q[1] - p[1]).slice(0, c === 3 ? 9 : TOP).map(p => p[0]));
      seqs.forEach(q => { if (!keep.has(q[c]) && q[c] !== "⏹ вийшов") q[c] = "… інше"; });
      const c2 = {}; seqs.forEach(q => { c2[q[c]] = (c2[q[c]] || 0) + 1; });
      colNodes.push(Object.entries(c2).sort((p, q) => (p[0] === "⏹ вийшов") - (q[0] === "⏹ вийшов") || (p[0] === "… інше") - (q[0] === "… інше") || q[1] - p[1]));
    }
    const W = 1240, Hh = 600, colW = 14, gapY = 6, padT = 26;
    const xs = [0, 1, 2, 3].map(c => 10 + c * (W - 330) / 3);
    const pos = colNodes.map((nodes, c) => {
      const total = nodes.reduce((k, n) => k + n[1], 0), avail = Hh - padT - gapY * (nodes.length - 1);
      let y = padT; const m = {};
      nodes.forEach(([k, n]) => { const h = Math.max(3, n / total * avail); m[k] = { y, h, n, out: y, in: y }; y += h + gapY; });
      return m;
    });
    let links = "";
    for (let c = 0; c < 3; c++) {
      const lc = {}; seqs.forEach(q => { const k = q[c] + "\u0001" + q[c + 1]; lc[k] = (lc[k] || 0) + 1; });
      Object.entries(lc).sort((p, q) => q[1] - p[1]).forEach(([k, n]) => {
        const [a, b] = k.split("\u0001"); const A = pos[c][a], B = pos[c + 1][b]; if (!A || !B) return;
        const ha = n / A.n * A.h, hb = n / B.n * B.h, h = Math.min(ha, hb);
        const x1 = xs[c] + colW, x2 = xs[c + 1], y1 = A.out + ha / 2, y2 = B.in + hb / 2; A.out += ha; B.in += hb;
        const mx = (x1 + x2) / 2;
        links += `<path d="M${x1},${y1} C${mx},${y1} ${mx},${y2} ${x2},${y2}" stroke="${b.startsWith("🚪") || b.startsWith("⏹") ? "#7a5a45" : "#FF7900"}" stroke-opacity=".28" stroke-width="${Math.max(1, h)}" fill="none"><title>${e(a)} → ${e(b)}: ${n}</title></path>`;
      });
    }
    let nodes = "";
    const heads = ["Перша дія", "Друга", "Третя", "Що далі"];
    colNodes.forEach((ns, c) => {
      nodes += `<text x="${xs[c]}" y="14" class="jr-head">${heads[c]}</text>`;
      ns.forEach(([k, n]) => {
        const P = pos[c][k];
        nodes += `<rect x="${xs[c]}" y="${P.y}" width="${colW}" height="${P.h}" rx="3" fill="${k.startsWith("🚪") || k.startsWith("⏹") || k.startsWith("😶") ? "#7a5a45" : "#FF7900"}"><title>${e(k)}: ${n}</title></rect>`;
        if (P.h >= 9) nodes += `<text x="${xs[c] + colW + 5}" y="${P.y + P.h / 2 + 4}" class="jr-lbl">${e(k)} · ${pct(n, N)} %</text>`;
      });
    });
    const map = `<div class="jr-map"><svg viewBox="0 0 ${W} ${Hh}" width="${W}" height="${Hh}" role="img" aria-label="Мапа першого заходу">${links}${nodes}</svg></div>`;

    // 3. Найтиповіші маршрути
    const rc = {}; list.forEach(x => { const k = [...(x._s.length ? x._s.slice(0, 3) : ["😶 нічого не почав"]), x._b].join("\u0001"); rc[k] = (rc[k] || 0) + 1; });
    const routes = Object.entries(rc).sort((p, q) => q[1] - p[1]).slice(0, 12).map(([k, n]) => {
      const parts = k.split("\u0001");
      return `<li><span class="jr-n">${n} · ${pct(n, N)} %</span><span class="jr-route">${parts.map((p, i) => `<span class="jr-step${i === parts.length - 1 ? " jr-end" : ""}">${e(p)}</span>`).join('<span class="jr-ar">→</span>')}</span></li>`;
    }).join("");

    // 4. Чи повертаються
    const bc = {}; list.forEach(x => { bc[x._b] = (bc[x._b] || 0) + 1; });
    const order = ["🚪 більше не повернувся", "🔁 повернувся того ж дня", "📆 повернувся наступного дня", "🗓 повернувся протягом тижня", "🐢 повернувся пізніше ніж за тиждень", "⏳ ще рано судити"];
    const backs = order.filter(k => bc[k]).map(k => `<div class="jr-row"><span>${k}</span><div class="jr-bar"><i style="width:${pct(bc[k], N)}%"></i></div><b>${bc[k]} · ${pct(bc[k], N)} %</b></div>`).join("");
    const firstGame = {}; list.forEach(x => { const g = (x.p[0] || "").split(":")[1]; if (g) firstGame[g] = (firstGame[g] || 0) + 1; });
    const fg = Object.entries(firstGame).sort((p, q) => q[1] - p[1]).slice(0, 8).map(([g, n]) => `<div class="jr-row"><span>${e(gname(g))}</span><div class="jr-bar"><i style="width:${pct(n, N)}%"></i></div><b>${n} · ${pct(n, N)} %</b></div>`).join("");

    box.innerHTML = `<div class="jr-chips">${chips}<span class="muted small">Гравців: <b>${N}</b> · оновлено о ${new Date(J.at).toLocaleTimeString("uk-UA", { hour: "2-digit", minute: "2-digit" })} · само оновлюється раз на 5 хв</span></div>
      <h3>🧬 Архетипи гравців</h3><div class="jr-archs">${ac}</div>
      <h3>🗺 Мапа першого заходу</h3><p class="muted small">Що гравець зробив у перший захід: перша, друга і третя дія, а потім — чи повернувся. Товщина лінії — скільки людей так пройшли. Наведи на лінію чи прямокутник — побачиш число.</p>${map}
      <h3>🛤 Найтиповіші маршрути</h3><ol class="jr-routes">${routes}</ol>
      <div class="jr-two"><div><h3>↩️ Чи повертаються</h3>${backs}</div><div><h3>🚪 З чого починають</h3>${fg}</div></div>`;
  }

  async function load() {
    const box = document.getElementById("jr-box");
    try {
      J.data = await proRpc("get_journeys", {}); J.at = Date.now(); render();
    } catch (err) {
      box.innerHTML = `<p class="note">${err.message === "nosql" ? "У Supabase ще немає функції (journeys.sql)." : "Не вдалося завантажити. Перевір інтернет."}</p>`;
    }
  }
  window.loadJourneys = () => {
    if (!J.data) document.getElementById("jr-box").innerHTML = '<p class="note">Рахую шляхи…</p>';
    load();
    clearInterval(J.timer);
    J.timer = setInterval(() => { if (!document.getElementById("journeys-view").hidden) load(); }, 5 * 60 * 1000);
  };
  document.addEventListener("click", ev => {
    const b = ev.target.closest("[data-jr-days]"); if (!b) return;
    J.days = +b.dataset.jrDays; render();
  });
})();

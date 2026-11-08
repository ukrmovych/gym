// 📱 PRO: «уже 2 пристрої» (власниця, 04.11.2026). Замість «напиши @ukr_movych» учень сам обирає, який зі своїх пристроїв
// відключити → pro-check {release: key} → пристрій видаляється (запис у pro_device_swaps — статистика, вкладка «PRO»),
// цей пристрій підключається, гра перезапускається з PRO. Викликає checkPro (script.js) — proDevicePicker(data).
// proDeviceLabel() — назва цього пристрою (iPhone, Samsung SM-A515F, Windows…) для переліку.
function proDeviceLabel() {
  const ua = navigator.userAgent || "";
  const tg = window.Telegram && Telegram.WebApp;
  const app = { ios: "Telegram", android: "Telegram", tdesktop: "Telegram Desktop", macos: "Telegram для Mac", web: "Telegram Web", weba: "Telegram Web" }[(tg && tg.platform) || ""] || "";
  let dev = "";
  if (/iPad/.test(ua) || (/Macintosh/.test(ua) && navigator.maxTouchPoints > 1)) dev = "iPad";
  else if (/iPhone/.test(ua)) dev = "iPhone";
  else if (/Android/.test(ua)) {
    const m = ua.match(/Android [\d.]+;\s*(?:[a-z]{2}[-_][a-z]{2};\s*)?([^;)]+?)(?:\s+Build|\))/i);
    dev = m && m[1] && !/^(K|wv)$/.test(m[1].trim()) ? "Android · " + m[1].trim() : "Android";
  } else if (/Windows/.test(ua)) dev = "Windows";
  else if (/Mac OS X|Macintosh/.test(ua)) dev = "Mac";
  else if (/Linux/.test(ua)) dev = "Linux";
  return [dev, app].filter(Boolean).join(" · ").slice(0, 60);
}

function proDevicePicker(data) {
  const old = document.getElementById("pro-dev-modal");
  if (old) old.remove();
  const devs = (data && data.devices) || [];
  const day = d => d ? new Date(d).toLocaleDateString("uk-UA", { day: "numeric", month: "long" }) : "";
  const icon = d => /iPhone|Android/.test(d || "") ? "📱" : /iPad/.test(d || "") ? "📲" : /Windows|Mac|Linux|Desktop|Комп|Браузер/.test(d || "") ? "💻" : "📱";
  const name = x => x.device || ({ ios: "iPhone / iPad", android: "Android", tdesktop: "Комп'ютер (Telegram Desktop)", macos: "Mac", web: "Браузер", weba: "Браузер" }[x.platform] || "Пристрій");
  const m = document.createElement("div");
  m.id = "pro-dev-modal";
  m.innerHTML = `<div class="pro-dev-box" role="dialog" aria-modal="true">
    <p class="pro-dev-title">💎 PRO уже відкрито на ${data.max || 2} пристроях</p>
    <p class="pro-dev-text">Одна підписка — щонайбільше ${data.max || 2} пристрої. Щоб відкрити PRO тут (${proDeviceLabel() || "цей пристрій"}), відключи один зі старих — на ньому PRO зникне.</p>
    <div class="pro-dev-list"></div>
    <p class="pro-dev-err" hidden></p>
    <button type="button" class="pro-dev-later">Не зараз</button>
  </div>`;
  const list = m.querySelector(".pro-dev-list"), err = m.querySelector(".pro-dev-err");
  devs.forEach(x => {
    const row = document.createElement("div");
    row.className = "pro-dev-row";
    row.innerHTML = `<span class="pro-dev-ico"></span><span class="pro-dev-name"><b></b><small></small></span><button type="button">Відключити</button>`;
    row.querySelector(".pro-dev-ico").textContent = icon(name(x));
    row.querySelector("b").textContent = name(x);
    row.querySelector("small").textContent = `востаннє ${day(x.last)}${x.first ? ` · з ${day(x.first)}` : ""}`;
    const btn = row.querySelector("button");
    btn.onclick = async () => {
      if (!confirm(`Відключити «${name(x)}»? На ньому PRO зникне, а тут — відкриється.`)) return;
      list.querySelectorAll("button").forEach(b => { b.disabled = true; });
      btn.textContent = "Відключаю…";
      try {
        const tg = window.Telegram && Telegram.WebApp;
        const res = await fetch(`${LB.url}/functions/v1/pro-check`, {
          method: "POST",
          headers: { apikey: LB.anonKey, Authorization: `Bearer ${LB.anonKey}`, "Content-Type": "application/json" },
          body: JSON.stringify({ initData: telegramInitData(), player: getPlayerId(), platform: (tg && tg.platform) || "", device: proDeviceLabel(), release: x.key })
        });
        const r = await res.json();
        if (r.pro) { storageSet("pro_status", "1"); location.reload(); return; }
        throw new Error("no");
      } catch (e) {
        list.querySelectorAll("button").forEach(b => { b.disabled = false; });
        btn.textContent = "Відключити";
        err.hidden = false;
        err.textContent = "Не вийшло — перевір інтернет і спробуй ще раз.";
      }
    };
    list.appendChild(row);
  });
  if (!devs.length) list.textContent = "Не вдалося завантажити перелік пристроїв. Спробуй відкрити гру пізніше.";
  m.querySelector(".pro-dev-later").onclick = () => m.remove();
  document.body.appendChild(m);
}

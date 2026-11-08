// 🦆 М'які заклики до Спільноти в БЕЗКОШТОВНИХ іграх (власниця, 07.11.2026) — лише для новачків без PRO (proUpsell, upsell.js),
// без ціни. Три місця:
//  а) підсумок тренування / марафону в «Наголосах» і «Лексичних помилках» — рядок і кнопка, щоразу інше формулювання,
//     не частіше ніж раз на 3 гри (localStorage free_nudge_n); події place free_train_<гра> / free_over_<гра>;
//  б) новий рекорд у марафоні — завжди (place free_record_<гра>);
//  в) кінець «📖 Повного переліку» безкоштовних ігор (place free_wordlist_<гра>).
// Статистика — та сама, що й для демо: «PRO» → «🦆 Пропозиція підписки новачкам» (pro_offer_view / pro_buy_click).
const FREE_NUDGE_GAMES = ["naholosy", "leksychna", "slovospoluch"];
const FREE_NUDGES = [
  "🦆 Сподобалося? У Спільноті Укрмовича — ще 7 тренажерів: кличний, фразеологізми, іншомовні слова, «Історія України» й інші.",
  "Так тримати! 💪 А в Спільноті — фразеологізми, кличний, числівники й 50+ тренажерів за розділами НМТ.",
  "Наголоси й лексичні помилки — лише частина НМТ 😉 Решту тем можна тренувати так само — у Спільноті Укрмовича.",
  "Круто виходить! Хочеш так само легко вивчити фразеологізми й іншомовні слова? Вони чекають у Спільноті 🦆",
  "Ти вже знаєш більше, ніж годину тому 😎 У Спільноті — тисячі завдань з усіх тем НМТ із поясненнями.",
  "Подобається тренуватися тут? У Спільноті Укрмовича відкриваються всі тренажери НМТ-качалки 🚀"
];
const FREE_RECORD_NUDGES = [
  "🔥 Новий рекорд! Хочеш більше? У Спільноті Укрмовича — ще 7 тренажерів для НМТ.",
  "🔥 Рекорд! Видно, що ти готуєшся всерйоз 😎 Спробуй і фразеологізми, кличний та іншомовні — у Спільноті.",
  "🔥 Новий рекорд! Такий самий результат можна мати з усіх тем НМТ — тренажери чекають у Спільноті 🦆"
];
let freeNudgeI = Math.floor(Math.random() * FREE_NUDGES.length);

function freeNudgeOn(game) {
  return FREE_NUDGE_GAMES.includes(game) && typeof proUpsell === "function" && proUpsell() && typeof UPSELL_CTA !== "undefined";
}
function freeNudgeBox(text, place) {
  const box = document.createElement("div");
  box.className = "demo-nudge free-nudge";
  box.innerHTML = `<p></p><button type="button" class="btn-primary demo-nudge-btn"></button>`;
  box.querySelector("p").textContent = text;
  box.querySelector("button").textContent = UPSELL_CTA;
  box.querySelector("button").onclick = () => upsellGo(place);
  if (typeof upsellView === "function") upsellView(place);
  return box;
}
// раз на 3 гри: 2-га, 5-та, 8-ма… (першу гру — без заклику)
function freeNudgeTurn() {
  const n = Number(storageGet("free_nudge_n") || 0) + 1;
  storageSet("free_nudge_n", String(n));
  return n % 3 === 2;
}
function freeNudgeShow(card, place, record) {
  if (!card) return;
  document.querySelectorAll(".free-nudge").forEach(x => x.remove());
  const turn = freeNudgeTurn();
  if (!record && !turn) return;
  let text;
  if (record) text = FREE_RECORD_NUDGES[Math.floor(Math.random() * FREE_RECORD_NUDGES.length)];
  else { freeNudgeI = (freeNudgeI + 1 + Math.floor(Math.random() * 2)) % FREE_NUDGES.length; text = FREE_NUDGES[freeNudgeI]; }
  const box = freeNudgeBox(text, place);
  const act = card.querySelector(".over-actions");
  if (act) card.insertBefore(box, act); else card.appendChild(box);
}

// а) + б) марафон: підсумок гри
if (typeof gameOver === "function") {
  const orig = gameOver;
  gameOver = function () {
    const g = currentGame;
    const r = orig.apply(this, arguments);
    try {
      if (freeNudgeOn(g)) {
        const record = !endless && /Новий рекорд/.test($("over-best").textContent) && score > 0;
        freeNudgeShow(document.querySelector("#over .over-card"), (record ? "free_record_" : "free_over_") + g, record);
      } else document.querySelectorAll(".free-nudge").forEach(x => x.remove());
    } catch (e) { /* */ }
    return r;
  };
}
// а) тренування групами: підсумок
if (typeof finishGroupTraining === "function") {
  const orig = finishGroupTraining;
  finishGroupTraining = function () {
    const t = typeof training !== "undefined" ? training : null;
    const r = orig.apply(this, arguments);
    try {
      if (t && freeNudgeOn(t.game)) freeNudgeShow(document.querySelector("#train-over .over-card"), "free_train_" + t.game, false);
      else document.querySelectorAll(".free-nudge").forEach(x => x.remove());
    } catch (e) { /* */ }
    return r;
  };
}
// в) «📖 Повний перелік»: наприкінці — що ще є в Спільноті
if (typeof showWordList === "function") {
  const orig = showWordList;
  showWordList = function (game) {
    const r = orig.apply(this, arguments);
    try {
      if (freeNudgeOn(game)) {
        const list = $("wl-list");
        const locked = game === "slovospoluch" && typeof slovoFreeLocked !== "undefined" ? slovoFreeLocked.length : 0;
        const text = locked
          ? `Це перелік відкритих груп. Ще ${locked} ${plural(locked, "група", "групи", "груп")} лексичних помилок — у Спільноті Укрмовича, а з ними й фразеологізми, кличний та інші тренажери 🦆`
          : "Наголоси — відкриті повністю 🎉 А в Спільноті Укрмовича так само можна вчити фразеологізми й іншомовні слова — з переліками, значеннями й прикладами 🦆";
        list.appendChild(freeNudgeBox(text, "free_wordlist_" + game));
      }
    } catch (e) { /* */ }
    return r;
  };
}

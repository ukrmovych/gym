// Відповіді Укрмовича на відгуки (SQL — feedback-reply.sql; власник відповідає на сторінці статистики).
// Нова відповідь → кнопка відгуку в меню: «Укрмович відповів на твій відгук!» з позначкою.
// На екрані відгуку відповіді показано над формою; після перегляду — позначаємо прочитаними.
let feedbackReplies = [];

async function loadFeedbackReplies() {
  if (storageGet("feedback_sent") !== "1" || typeof leaderboardEnabled === "undefined" || !leaderboardEnabled) return;
  try {
    feedbackReplies = (await lbRequest("rpc/get_my_feedback_replies", {
      method: "POST",
      body: JSON.stringify({ p_player: getPlayerId() })
    })) || [];
  } catch (e) {
    feedbackReplies = [];
  }
  renderFeedbackButton();
}

// Викликає renderFeedbackButton (script.js)
function renderFeedbackReplyBadge() {
  const btn = $("btn-feedback");
  const fresh = feedbackReplies.filter(r => !r.seen).length;
  btn.classList.toggle("has-reply", fresh > 0);
  let badge = btn.querySelector(".fb-reply-badge");
  if (fresh > 0) {
    $("feedback-btn-title").textContent = "Укрмович відповів на твій відгук!";
    $("feedback-btn-sub").textContent = "Натисни, щоб прочитати 💌";
    if (!badge) {
      badge = document.createElement("span");
      badge.className = "badge fb-reply-badge";
      btn.insertBefore(badge, btn.querySelector(".mode-arrow"));
    }
    badge.textContent = fresh > 1 ? `${fresh} нові` : "нове";
  } else if (badge) {
    badge.remove();
  }
}

// Викликає showFeedback (script.js): відповіді — над формою
function showFeedbackReplies() {
  let box = $("feedback-replies");
  if (!box) {
    box = document.createElement("section");
    box.id = "feedback-replies";
    box.className = "card fb-replies";
    $("feedback-form").before(box);
  }
  box.hidden = !feedbackReplies.length;
  box.innerHTML = "";
  if (!feedbackReplies.length) return;
  const h = document.createElement("h3");
  h.className = "fb-replies-title";
  h.textContent = "💌 Відповіді Укрмовича";
  box.appendChild(h);
  feedbackReplies.forEach(r => {
    const item = document.createElement("div");
    item.className = "fb-reply" + (r.seen ? "" : " fresh");
    const mine = document.createElement("p");
    mine.className = "fb-reply-mine";
    mine.textContent = `Ти: «${r.message}»`;
    const ans = document.createElement("p");
    ans.className = "fb-reply-text";
    const who = document.createElement("b");
    who.textContent = "Укрмович: ";
    ans.append(who, r.reply);
    item.append(mine, ans);
    box.appendChild(item);
  });
  if (feedbackReplies.some(r => !r.seen)) {
    lbRequest("rpc/mark_feedback_replies_seen", {
      method: "POST",
      body: JSON.stringify({ p_player: getPlayerId() })
    }).catch(() => {});
    feedbackReplies.forEach(r => { r.seen = true; });
    renderFeedbackButton();
  }
}

loadFeedbackReplies();

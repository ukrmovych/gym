// 😀 Смайлики як у Telegram (власниця, 08.11.2026): на Android і комп'ютерах смайлики малює сам пристрій, тому вони
// виглядали по-різному. Тут кожен смайлик на сторінці (і той, що з'являється пізніше) обгортається в <span class="emj">
// з картинкою з img/emoji/ (набір emoji-datasource-apple — ті самі малюнки, що в Telegram). Сам символ лишається всередині
// (прозорим), тож текст кнопок для коду не змінюється. На iPhone, iPad і Mac нічого не робимо — там такі смайлики й так.
// Підключено на ВСІХ сторінках гри (власниця: смайлики однакові абсолютно скрізь). Системні вікна (alert/confirm) і
// підказки в полях (placeholder) картинок не показують — смайликів там не пишемо.
// Нові смайлики в грі → node tools/emoji-collect.js (оновлює карту нижче й кладе картинки). Немає в карті — лишається як є.
const EMOJI_MAP = {"2139":"2139-fe0f","2194":"2194-fe0f","2328":"2328-fe0f","2600":"2600-fe0f","2601":"2601-fe0f","2611":"2611-fe0f","2694":"2694-fe0f","2696":"2696-fe0f","2697":"2697-fe0f","2699":"2699-fe0f","2702":"2702-fe0f","2705":"2705","2708":"2708-fe0f","2712":"2712-fe0f","2714":"2714-fe0f","2728":"2728","2753":"2753","2757":"2757","2764":"2764-fe0f","2795":"2795","2796":"2796","1f600":"1f600","1f916":"1f916","1f4aa":"1f4aa","1f9e0":"1f9e0","1f648":"1f648","1f60c":"1f60c","1f525":"1f525","1f642":"1f642","1f389":"1f389","1f49b":"1f49b","1f499":"1f499","2b50":"2b50","1f973":"1f973","1f44d":"1f44d","1f33b":"1f33b","1f3cb":"1f3cb-fe0f","1f393":"1f393","1f501":"1f501","1f504":"1f504","1f914":"1f914","1f512":"1f512","1f381":"1f381","1f4a5":"1f4a5","1f469-200d-2695":"1f469-200d-2695-fe0f","1f9d1-200d-1f91d-200d-1f9d1":"1f9d1-200d-1f91d-200d-1f9d1","1f60f":"1f60f","1f483":"1f483","1f497":"1f497","1f5e3":"1f5e3-fe0f","1f4dc":"1f4dc","1f3db":"1f3db-fe0f","1f4b0":"1f4b0","1f52c":"1f52c","1fa7a":"1fa7a","1f5fa":"1f5fa-fe0f","1f5bc":"1f5bc-fe0f","23f0":"23f0","1f4c8":"1f4c8","1f50d":"1f50d","1f4cf":"1f4cf","1f9ea":"1f9ea","1f3f7":"1f3f7-fe0f","1f3c3":"1f3c3","1f3c3-200d-2640":"1f3c3-200d-2640-fe0f","1f9e9":"1f9e9","1f4a1":"1f4a1","1f4f1":"1f4f1","26ea":"26ea","1f3dd":"1f3dd-fe0f","1f4af":"1f4af","1f3f3":"1f3f3-fe0f","1fa96":"1fa96","1f46f":"1f46f","1f9d1-200d-1f527":"1f9d1-200d-1f527","1f90f":"1f90f","1f5c2":"1f5c2-fe0f","1f3f0":"1f3f0","1f3c5":"1f3c5","1f305":"1f305","1faa7":"1faa7","1f195":"1f195","1f48e":"1f48e","1f98e":"1f98e","1f5d2":"1f5d2-fe0f","1f612":"1f612","1f48a":"1f48a","1f535":"1f535","270b":"270b","1f494":"1f494","1f6e1":"1f6e1-fe0f","1f392":"1f392","1f60a":"1f60a","1f631":"1f631","1f5ff":"1f5ff","1f94a":"1f94a","1f3e1":"1f3e1","1f32a":"1f32a-fe0f","1f451":"1f451","1f9fd":"1f9fd","1f333":"1f333","1f922":"1f922","1f986":"1f986","1f60e":"1f60e","1f680":"1f680","1f4d6":"1f4d6","1f4ca":"1f4ca","1f514":"1f514","1f4c2":"1f4c2","1f48c":"1f48c","1f609":"1f609","1f517":"1f517","25b6":"25b6-fe0f","1f3b2":"1f3b2","1f3e0":"1f3e0","274c":"274c","1f30d":"1f30d","1f4ac":"1f4ac","1f50e":"1f50e","1f3af":"1f3af","1f465":"1f465","1f4c5":"1f4c5","1f3c6":"1f3c6","1f9e1":"1f9e1","1f615":"1f615","1f610":"1f610","1f603":"1f603","1f929":"1f929","1f469-200d-1f3eb":"1f469-200d-1f3eb","1f468-200d-1f469-200d-1f467":"1f468-200d-1f469-200d-1f467","1f440":"1f440","1f3c1":"1f3c1","267e":"267e-fe0f","1f5a5":"1f5a5-fe0f","1f464":"1f464","1f310":"1f310","23f1":"23f1-fe0f","1f3eb":"1f3eb","1f511":"1f511","1f6a7":"1f6a7","26a1":"26a1","270d":"270d-fe0f","1fab6":"1fab6","1f50a":"1f50a","1f442":"1f442","1f575":"1f575-fe0f","31-20e3":"0031-fe0f-20e3","1f520":"1f520","1f9f7":"1f9f7","1f524":"1f524","39-20e3":"0039-fe0f-20e3","1f4d8":"1f4d8","1f6ab":"1f6ab","1f51a":"1f51a","1f9f1":"1f9f1","1f6e0":"1f6e0-fe0f","1f4da":"1f4da","1f6d1":"1f6d1","1f4e2":"1f4e2","1f170":"1f170-fe0f","1faaa":"1faaa","1f9ec":"1f9ec","1f9ee":"1f9ee","1fa9c":"1fa9c","26d3":"26d3-fe0f","1f3d7":"1f3d7-fe0f","1f5e8":"1f5e8-fe0f","1f500":"1f500","1f5ef":"1f5ef-fe0f","260e":"260e-fe0f","1f3ae":"1f3ae","1f3fa":"1f3fa","1f1fa-1f1e6":"1f1fa-1f1e6","1f4dd":"1f4dd","1f518":"1f518","21a9":"21a9-fe0f","1f9d8":"1f9d8","1f92a":"1f92a","1f6a9":"1f6a9","1f4b5":"1f4b5","1f3a2":"1f3a2","1f0cf":"1f0cf","1f91d":"1f91d","1f4d4":"1f4d4","1f33e":"1f33e","1f620":"1f620","1f527":"1f527","1f331":"1f331","1f64f":"1f64f","1f3b9":"1f3b9","1f45c":"1f45c","1f4f0":"1f4f0","1f50b":"1f50b","1f9f9":"1f9f9","1f58d":"1f58d-fe0f","1f4e3":"1f4e3","1f643":"1f643","1f49d":"1f49d","262f":"262f-fe0f","1f300":"1f300","1f602":"1f602","1f489":"1f489","1f3de":"1f3de-fe0f","1f611":"1f611","1f6cb":"1f6cb-fe0f","1f44f":"1f44f","1f9d1-200d-2696":"1f9d1-200d-2696-fe0f","1f338":"1f338","1fae7":"1fae7","1f6b7":"1f6b7","1f30c":"1f30c","1f4cb":"1f4cb","1f971":"1f971","1f52b":"1f52b","1f4b8":"1f4b8","1f645":"1f645","1f4bc":"1f4bc","1f9fe":"1f9fe","1f522":"1f522","1f32c":"1f32c-fe0f","1f3b0":"1f3b0","2b06":"2b06-fe0f","1f6aa":"1f6aa","1f64b":"1f64b","1f4d0":"1f4d0","1f3b6":"1f3b6","1f3bc":"1f3bc","1f423":"1f423","1fad9":"1fad9","1f9a3":"1f9a3","1f945":"1f945","1f95b":"1f95b","27a1":"27a1-fe0f","1f3d4":"1f3d4-fe0f","1f9a2":"1f9a2","1f917":"1f917","1f49e":"1f49e","1f93f":"1f93f","1f5de":"1f5de-fe0f","1f3a4":"1f3a4","1f3ac":"1f3ac","1f4c9":"1f4c9","2b07":"2b07-fe0f","23f3":"23f3","1f380":"1f380","1f337":"1f337","1f54a":"1f54a-fe0f","1f5f3":"1f5f3-fe0f","1f3ad":"1f3ad","1f4fa":"1f4fa","1f327":"1f327-fe0f","1f4a3":"1f4a3","1f529":"1f529","1fa79":"1fa79","1f4ed":"1f4ed","1f9fa":"1f9fa","1f4b9":"1f4b9","1f9ed":"1f9ed","1f623":"1f623","1f5d1":"1f5d1-fe0f","26d4":"26d4","1f9f5":"1f9f5","1f4cd":"1f4cd","1f69a":"1f69a","1f3b5":"1f3b5","1f981":"1f981","1f93a":"1f93a","1f412":"1f412","1f3bb":"1f3bb","1f7f0":"1f7f0","1f4d7":"1f4d7","1f437":"1f437","1f3ed":"1f3ed","1f6a2":"1f6a2","1f3a8":"1f3a8","1f31f":"1f31f","1f6a8":"1f6a8","1faa2":"1faa2","1f3a9":"1f3a9","1f342":"1f342","1f947":"1f947","1f95a":"1f95a","1f9f3":"1f9f3","1f5a8":"1f5a8-fe0f","1faf6":"1faf6","1f64c":"1f64c","1f39e":"1f39e-fe0f","1f4f6":"1f4f6","1f33a":"1f33a","1f607":"1f607","1f308":"1f308","1f32b":"1f32b-fe0f","1fa9e":"1fa9e","1f99c":"1f99c","1f6ec":"1f6ec","1f99a":"1f99a","1f4e6":"1f4e6","1f636":"1f636","1f4c3":"1f4c3","1f40c":"1f40c","1f40d":"1f40d","1f43e":"1f43e","1f5dd":"1f5dd-fe0f","1f52e":"1f52e","1f37c":"1f37c","1f9a0":"1f9a0","1f927":"1f927","1f4a7":"1f4a7","1f6bf":"1f6bf","1f3ce":"1f3ce-fe0f","1f9d0":"1f9d0","1f5fd":"1f5fd","1f6d2":"1f6d2","1f9d1-200d-1f393":"1f9d1-200d-1f393","1f9cd":"1f9cd","1f9f6":"1f9f6","1f4d1":"1f4d1","1f4cc":"1f4cc","1f3c3-200d-2642":"1f3c3-200d-2642-fe0f","1f96b":"1f96b","1f92b":"1f92b","1f30e":"1f30e","1f510":"1f510","1f693":"1f693","1f633":"1f633","1f4ad":"1f4ad","1f579":"1f579-fe0f","270f":"270f-fe0f","1f3e2":"1f3e2","1f3e6":"1f3e6","1f694":"1f694","21aa":"21aa-fe0f","1f9e8":"1f9e8","1f6a6":"1f6a6","1f468-200d-1f3eb":"1f468-200d-1f3eb","1f415":"1f415","1f935":"1f935","1f51d":"1f51d","1f38e":"1f38e","1f6cd":"1f6cd-fe0f","1f422":"1f422","1f454":"1f454","1f98a":"1f98a","1f6e4":"1f6e4-fe0f","1f645-200d-2642":"1f645-200d-2642-fe0f","1f53b":"1f53b","1f9f8":"1f9f8","1f9f2":"1f9f2","1f343":"1f343","1f630":"1f630","1f44e":"1f44e","1f576":"1f576-fe0f","1f52d":"1f52d","1f418":"1f418","1f645-200d-2640":"1f645-200d-2640-fe0f","1f44c":"1f44c","1f984":"1f984","1f39a":"1f39a-fe0f","1f17f":"1f17f-fe0f","1f6cc":"1f6cc","1f3e5":"1f3e5","1f3d8":"1f3d8-fe0f","1f64b-200d-2640":"1f64b-200d-2640-fe0f","1f9ca":"1f9ca","1f9f0":"1f9f0","1f396":"1f396-fe0f","1f624":"1f624","1f39f":"1f39f-fe0f","1f48d":"1f48d","1faa8":"1faa8","1f4e1":"1f4e1","1f326":"1f326-fe0f","23e9":"23e9","1f4fb":"1f4fb","1f9fc":"1f9fc","1f33f":"1f33f","1f58b":"1f58b-fe0f","1f9c2":"1f9c2","1fa7c":"1fa7c","23f2":"23f2-fe0f","1f5c4":"1f5c4-fe0f","1f4ef":"1f4ef","1f58c":"1f58c-fe0f","1f6b6":"1f6b6","1f4ce":"1f4ce","1f399":"1f399-fe0f","1f56f":"1f56f-fe0f","1f336":"1f336-fe0f","1f979":"1f979","1f6ce":"1f6ce-fe0f","1f98b":"1f98b","1f377":"1f377","1f912":"1f912","1f5d3":"1f5d3-fe0f","1f928":"1f928","1f932":"1f932","1f523":"1f523","1f4b3":"1f4b3","1f9d4":"1f9d4","1f36a":"1f36a","1f955":"1f955","1f62b":"1f62b","1f453":"1f453","1f9da":"1f9da","1f46b":"1f46b","1f69b":"1f69b","1f6e3":"1f6e3-fe0f","1f44a":"1f44a","1f528":"1f528","1f320":"1f320","1f3aa":"1f3aa","1f463":"1f463","26f2":"26f2","1f58a":"1f58a-fe0f","1f4f8":"1f4f8","1f388":"1f388","1f3b8":"1f3b8","1f30b":"1f30b","1f4de":"1f4de","1f38c":"1f38c","1f469-200d-1f37c":"1f469-200d-1f37c","1fa91":"1fa91","1f478":"1f478","1f92f":"1f92f","1f4c4":"1f4c4","1f54c":"1f54c","1f937":"1f937","1f36d":"1f36d","1f4a0":"1f4a0","1f975":"1f975","1f92e":"1f92e","1f7e4":"1f7e4","1f43b":"1f43b","1fab0":"1fab0","1f93c":"1f93c","1f457":"1f457","1faae":"1faae","1f980":"1f980","1f40e":"1f40e","1f370":"1f370","1f940":"1f940","1f44b":"1f44b","1f4e8":"1f4e8","1f447":"1f447","231b":"231b","23f9":"23f9-fe0f","1f634":"1f634","1f449":"1f449","26a0":"26a0-fe0f","1f4be":"1f4be","1f515":"1f515","1f4f2":"1f4f2","1f4bb":"1f4bb","1f446":"1f446","25c0":"25c0-fe0f","1f570":"1f570-fe0f","1f553":"1f553","1f62c":"1f62c","1fae1":"1fae1","1f513":"1f513"};
(function () {
  if (/iPhone|iPad|iPod|Macintosh|Mac OS X/.test(navigator.userAgent)) return;
  // шлях до картинок — поруч із цим файлом (працює і з підпапок: stats/, chill/)
  const BASE = ((document.currentScript && document.currentScript.src) || location.href).replace(/emoji\.js.*$/, "").replace(/[^/]*$/, "") + "img/emoji/";
  document.documentElement.classList.add("emj-on");
  // вигляд — тут, щоб працювало й на сторінках без style.css (статистика, «антистрес»)
  const css = document.createElement("style");
  css.textContent = ".emj{display:inline-block;width:1.2em;height:1.2em;vertical-align:-.22em;background:center/contain no-repeat;color:transparent;-webkit-text-fill-color:transparent;text-shadow:none;overflow:hidden;line-height:1.2em;text-align:center;font-style:normal}";
  (document.head || document.documentElement).appendChild(css);
  const RE = /\p{RI}\p{RI}|[#*0-9]️?⃣|\p{Extended_Pictographic}[️\u{1F3FB}-\u{1F3FF}]?(?:‍\p{Extended_Pictographic}[️\u{1F3FB}-\u{1F3FF}]?)*/gu;
  const TEST = /[\u{1F000}-\u{1FAFF}←-⯿〰〽㊗㊙©®‼⁉™⃣]/u;
  const SKIP = new Set(["SCRIPT", "STYLE", "TEXTAREA", "INPUT", "OPTION", "SELECT", "TITLE", "NOSCRIPT", "SVG", "CANVAS", "CODE", "PRE"]);
  const key = s => [...s].map(c => c.codePointAt(0)).filter(c => c !== 0xFE0F).map(c => c.toString(16)).join("-");
  function wrap(node) {
    const t = node.nodeValue;
    if (!t || !TEST.test(t)) return;
    const p = node.parentNode;
    if (!p || p.nodeType !== 1 || SKIP.has(p.nodeName.toUpperCase()) || p.classList.contains("emj") || p.isContentEditable) return;
    RE.lastIndex = 0;
    let m, last = 0, frag = null;
    while ((m = RE.exec(t))) {
      const f = EMOJI_MAP[key(m[0])];
      if (!f) continue;
      frag = frag || document.createDocumentFragment();
      if (m.index > last) frag.appendChild(document.createTextNode(t.slice(last, m.index)));
      const s = document.createElement("span");
      s.className = "emj";
      s.style.backgroundImage = `url(${BASE}${f}.png)`;
      s.textContent = m[0];
      frag.appendChild(s);
      last = m.index + m[0].length;
    }
    if (!frag) return;
    if (last < t.length) frag.appendChild(document.createTextNode(t.slice(last)));
    p.replaceChild(frag, node);
  }
  function scan(root) {
    if (root.nodeType === 3) { wrap(root); return; }
    if (root.nodeType !== 1 || SKIP.has(root.nodeName.toUpperCase()) || (root.classList && root.classList.contains("emj"))) return;
    const w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    const list = [];
    for (let n = w.nextNode(); n; n = w.nextNode()) if (TEST.test(n.nodeValue)) list.push(n);
    list.forEach(wrap);
  }
  const queue = new Set();
  let planned = false;
  function flush() {
    planned = false;
    const items = [...queue];
    queue.clear();
    items.forEach(n => { if (n.isConnected) scan(n); });
  }
  const mo = new MutationObserver(muts => {
    for (const m of muts) {
      if (m.type === "characterData") queue.add(m.target);
      else m.addedNodes.forEach(n => queue.add(n));
    }
    if (!planned && queue.size) { planned = true; requestAnimationFrame(flush); }
  });
  function start() {
    scan(document.body);
    mo.observe(document.body, { childList: true, subtree: true, characterData: true });
  }
  if (document.body) start(); else document.addEventListener("DOMContentLoaded", start);
})();

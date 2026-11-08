// Дані для наголосів (скорочений варіант)
const naholosyData = [
  { words: ["асиметрІя", "асимЕтрія"], correct: "асиметрІя" },
  { words: ["агронОмія", "агрономІя"], correct: "агронОмія" },
  { words: ["видАння", "вИдання", "виданнЯ"], correct: "видАння" },
  { words: ["відвезтИ", "відвЕзти"], correct: "відвезтИ" },
  { words: ["відвестИ", "відвЕсти"], correct: "відвестИ" },
  { words: ["віднестИ", "віднЕсти"], correct: "віднестИ" },
  { words: ["децимЕтр", "децИметр"], correct: "децимЕтр" },
  { words: ["довезтИ", "довЕзти"], correct: "довезтИ" },
  { words: ["довестИ", "довЕсти"], correct: "довестИ" },
  { words: ["донестИ", "донЕсти"], correct: "донестИ" },
  { words: ["завдАння", "завданнЯ"], correct: "завдАння" },
  { words: ["завезтИ", "завЕзти"], correct: "завезтИ" },
  { words: ["завестИ", "завЕсти"], correct: "завестИ" },
  { words: ["занестИ", "занЕсти"], correct: "занестИ" },
  { words: ["зібрАння", "зібраннЯ"], correct: "зібрАння" },
  { words: ["зрАння", "зраннЯ"], correct: "зрАння" },
  { words: ["індУстрія", "індустрІя"], correct: "індУстрія" },
  { words: ["кіломЕтр", "кілОметр"], correct: "кіломЕтр" },
  { words: ["кОлія", "коліЯ"], correct: "кОлія" },
  { words: ["кулінАрія", "кулінарІя"], correct: "кулінАрія" },
  { words: ["металУргія", "металургІя"], correct: "металУргія" },
  { words: ["мілімЕтр", "мілІметр"], correct: "мілімЕтр" },
  { words: ["навчАння", "навчаннЯ"], correct: "навчАння" },
  { words: ["нанестИ", "нанЕсти"], correct: "нанестИ" },
  { words: ["нестИ", "нЕсти"], correct: "нестИ" },
  { words: ["обрАння", "обраннЯ"], correct: "обрАння" },
  { words: ["перевезтИ", "перевЕзти"], correct: "перевезтИ" },
  { words: ["перевестИ", "перевЕсти"], correct: "перевестИ" },
  { words: ["перенестИ", "перенЕсти"], correct: "перенестИ" },
  { words: ["пізнАння", "пізнаннЯ"], correct: "пізнАння" },
  { words: ["піцЕрія", "піцерІя"], correct: "піцЕрія" },
  { words: ["привезтИ", "привЕзти"], correct: "привезтИ" },
  { words: ["привестИ", "привЕсти"], correct: "привестИ" },
  { words: ["принестИ", "принЕсти"], correct: "принестИ" },
  { words: ["сантимЕтр", "сантИметр"], correct: "сантимЕтр" },
  { words: ["симетрІя", "симЕтрія"], correct: "симетрІя" },
  { words: ["течіЯ", "тЕчія", "течІя"], correct: "течіЯ" },
  { words: ["травестІя", "травЕстія", "трАвестія"], correct: "травестІя" },
  { words: ["уподОбання", "уподобАння"], correct: "уподОбання" },
  { words: ["читАння", "читаннЯ", "чИтання"], correct: "читАння" },
  { words: ["Аркушик", "аркУшик"], correct: "Аркушик" },
  { words: ["багаторазОвий", "багаторАзовий", "багаторазовИй"], correct: "багаторазОвий" },
  { words: ["безпринцИпний", "безпрИнципний", "безпрнципнИй"], correct: "безпринцИпний" },
  { words: ["бЕшкет", "бешкЕт"], correct: "бЕшкет" },
  { words: ["блАговіст", "благовІст", "благОвіст"], correct: "блАговіст" },
  { words: ["близькИй", "блИзький"], correct: "близькИй" },
  { words: ["болотИстий", "болОтистий", "болотистИй"], correct: "болотИстий" },
  { words: ["борОдавка", "бородАвка"], correct: "борОдавка" },
  { words: ["босОніж", "босонІж", "бОсоніж"], correct: "босОніж" },
  { words: ["боЯзнь", "бОязнь"], correct: "боЯзнь" },
  { words: ["бурштинОвий", "бурштИновий", "бурштиновИй"], correct: "бурштинОвий" },
  { words: ["бюлетЕнь", "бЮлетень"], correct: "бюлетЕнь" },
  { words: ["вАги", "вагИ"], correct: "вАги" },
  { words: ["вантажІвка", "вантАжівка"], correct: "вантажІвка" },
  { words: ["вИгода (користь)", "вигОда (користь)"], correct: "вИгода (користь)" },
 { words: ["вигОда (зручність)", "вИгода (зручність)"], correct: "вигОда (зручність)" },
  { words: ["визвОльний", "вИзвольний", "визвольнИй"], correct: "визвОльний" },
  { words: ["вимОга", "вИмога"], correct: "вимОга" },
  { words: ["вИпадок", "випАдок"], correct: "вИпадок" },
  { words: ["вирАзний", "вИразний", "виразнИй"], correct: "вирАзний" },
  { words: ["вИсіти", "висІти", "висітИ"], correct: "вИсіти" },
  { words: ["вИтрата", "витрАта"], correct: "вИтрата" },
  { words: ["вишИваний", "вишивАний", "вишиванИй"], correct: "вишИваний" },
  { words: ["вІдгомін", "відгОмін"], correct: "вІдгомін" },
  { words: ["вІдомість (список)", "відОмість (список)"], correct: "вІдомість (список)" },
  { words: ["відОмість (дані, популярність)", "вІдомість (дані, популярність)"], correct: "відОмість (дані, популярність)" },
  { words: ["вІрші", "віршІ"], correct: "вІрші" },
  { words: ["віршовИй", "віршОвий", "вІршовий"], correct: "віршовИй" },
  { words: ["вітчИм", "вІтчим"], correct: "вітчИм" },
  { words: ["гальмО", "гАльмо"], correct: "гальмО" },
  { words: ["гАльма (у множині)", "гальмА (у множині)"], correct: "гАльма (у множині)" },
  { words: ["глядАч", "глЯдач"], correct: "глядАч" },
  { words: ["горошИна", "горОшина", "горошинА"], correct: "горошИна" },
  { words: ["граблІ", "грАблі"], correct: "граблІ" },
  { words: ["гуртОжиток", "гуртожИток"], correct: "гуртОжиток" },
  { words: ["данИна", "дАнина", "данинА"], correct: "данИна" },
  { words: ["дАно", "данО"], correct: "дАно" },
  { words: ["дЕщиця", "дещИця"], correct: "дЕщиця" },
  { words: ["де-Юре", "де-юрЕ"], correct: "де-Юре" },
  { words: ["джерелО", "джЕрело"], correct: "джерелО" },
  { words: ["дИвлячись", "дивлячИсь"], correct: "дИвлячись" },
  { words: ["дичАвіти", "дичавІти"], correct: "дичАвіти" },
  { words: ["діалОг", "діАлог"], correct: "діалОг" },
  { words: ["добовИй", "добОвий"], correct: "добовИй" },
  { words: ["добУток", "дОбуток"], correct: "добУток" },
  { words: ["довІдник", "довіднИк"], correct: "довІдник" },
  { words: ["дОгмат", "догмАт"], correct: "дОгмат" },
  { words: ["дОнька", "донькА"], correct: "дОнька" },
  { words: ["дочкА", "дОчка"], correct: "дочкА" },
  { words: ["дрОва", "дровА"], correct: "дрОва" },
  { words: ["експЕрт", "Експерт"], correct: "експЕрт" },
  { words: ["єретИк", "єрЕтик"], correct: "єретИк" },
  { words: ["жалюзІ", "жАлюзі"], correct: "жалюзІ" },
  { words: ["завчасУ", "завчАсу"], correct: "завчасУ" },
  { words: ["зАгадка", "загАдка"], correct: "зАгадка" },
  { words: ["заіржАвілий", "заіржавІлий", "заіржавілИй"], correct: "заіржАвілий" },
  { words: ["заіржАвіти", "заіржавІти"], correct: "заіржАвіти" },
  { words: ["закінчИти", "закІнчити"], correct: "закінчИти" },
  { words: ["зАкладка", "заклАдка"], correct: "зАкладка" },
  { words: ["зАкрутка", "закрУтка"], correct: "зАкрутка" },
  { words: ["залишИти", "залИшити"], correct: "залишИти" },
  { words: ["замІжня", "заміжнЯ", "зАміжня"], correct: "замІжня" },
  { words: ["зАпонка", "запОнка"], correct: "зАпонка" },
  { words: ["зАставка", "застАвка"], correct: "зАставка" },
  { words: ["зАстібка", "застІбка"], correct: "зАстібка" },
  { words: ["заробІток", "зАробіток"], correct: "заробІток" },
  { words: ["застОпорити", "застопорИти"], correct: "застОпорити" },
  { words: ["звИсока", "звисОка", "звисокА"], correct: "звИсока" },
  { words: ["здАлека", "здалЕка", "здалекА"], correct: "здАлека" },
  { words: ["зобразИти", "зобрАзити"], correct: "зобразИти" },
  { words: ["зОзла", "зозлА"], correct: "зОзла" },
  { words: ["зрУчний", "зручнИй"], correct: "зрУчний" },
  { words: ["зубОжіння", "зубожІння"], correct: "зубОжіння" },
  { words: ["кАмбала", "камбалА", "камбАла"], correct: "кАмбала" },
  { words: ["каталОг", "катАлог"], correct: "каталОг" },
  { words: ["квартАл", "квАртал"], correct: "квартАл" },
  { words: ["кИшка", "кишкА"], correct: "кИшка" },
  { words: ["кінчИти", "кІнчити"], correct: "кінчИти" },
  { words: ["кОлесо", "колесО"], correct: "кОлесо" },
  { words: ["кОпчений (дієприкметник)", "копчЕний (дієприкметник)"], correct: "кОпчений (дієприкметник)" },
  { words: ["копчЕний (прикметник)", "кОпчений (прикметник)"], correct: "копчЕний (прикметник)" },
  { words: ["корИсний", "кОрисний"], correct: "корИсний" },
  { words: ["кОсий", "косИй"], correct: "кОсий" },
  { words: ["котрИй", "кОтрий"], correct: "котрИй" },
  { words: ["крицЕвий", "крИцевий", "крицевИй"], correct: "крицЕвий" },
  { words: ["крОїти", "кроЇти"], correct: "крОїти" },
  { words: ["кропивА", "кропИва"], correct: "кропивА" },
  { words: ["кУрятина", "курЯтина", "курятинА"], correct: "кУрятина" },
  { words: ["лАте", "латЕ"], correct: "лАте" },
  { words: ["листопАд", "листОпад"], correct: "листопАд" },
  { words: ["літОпис", "лІтопис", "літопИс"], correct: "літОпис" },
  { words: ["лЮстро", "люстрО"], correct: "лЮстро" },
  { words: ["магістЕрський", "магІстерський", "магістерськИй"], correct: "магістЕрський" },
  { words: ["мАркетинг", "маркЕтинг"], correct: "мАркетинг" },
  { words: ["мерЕжа", "мережА"], correct: "мерЕжа" },
  { words: ["напІй", "нАпій"], correct: "напІй" },
  { words: ["нАскрізний", "наскрІзний", "наскрізнИй"], correct: "нАскрізний" },
  { words: ["нАчинка", "начИнка"], correct: "нАчинка" },
  { words: ["ненАвидіти", "ненавИдіти"], correct: "ненАвидіти" },
  { words: ["ненАвисний", "ненавИсний", "нЕнависний", "ненависнИй"], correct: "ненАвисний" },
  { words: ["ненАвисть", "нЕнависть"], correct: "ненАвисть" },
  { words: ["нІздря", "ніздрЯ"], correct: "нІздря" },
  { words: ["новИй", "нОвий"], correct: "новИй" },
  { words: ["обіцЯнка", "обІцянка"], correct: "обіцЯнка" },
  { words: ["обрУч", "Обруч"], correct: "обрУч" },
  { words: ["одинАдцять", "одИнадцять"], correct: "одинАдцять" },
  { words: ["одноразОвий", "однорАзовий", "одноразовИй"], correct: "одноразОвий" },
  { words: ["ознАка", "Ознака"], correct: "ознАка" },
  { words: ["Олень", "олЕнь"], correct: "Олень" },
  { words: ["оптОвий", "Оптовий", "оптовИй"], correct: "оптОвий" },
  { words: ["осетЕр", "осЕтер"], correct: "осетЕр" },
  { words: ["отАман", "отамАн"], correct: "отАман" },
  { words: ["Оцет", "оцЕт"], correct: "Оцет" },
  { words: ["павИч", "пАвич"], correct: "павИч" },
  { words: ["партЕр", "пАртер"], correct: "партЕр" },
  { words: ["пЕкарський", "пекАрський", "пекарськИй"], correct: "пЕкарський" },
  { words: ["перЕкис", "пЕрекис", "перекИс"], correct: "перЕкис" },
  { words: ["перелЯк", "перЕляк"], correct: "перелЯк" },
  { words: ["перЕпад", "перепАд", "пЕрепад"], correct: "перЕпад" },
  { words: ["перЕпис", "пЕрепис", "перепИс"], correct: "перЕпис" },
  { words: ["піалА", "піАла", "пІала"], correct: "піалА" },
  { words: ["пІдданий (дієприкметник)", "піддАний (дієприкметник)"], correct: "пІдданий (дієприкметник)" },
  { words: ["піддАний (іменник, істота)", "пІдданий (іменник, істота)"], correct: "піддАний (іменник, істота)" },
  { words: ["пІдлітковий", "підліткОвий", "підлітковИй"], correct: "пІдлітковий" },
  { words: ["пітнИй", "пІтний"], correct: "пітнИй" },
  { words: ["пОдруга", "подрУга"], correct: "пОдруга" },
  { words: ["пОзначка", "познАчка"], correct: "пОзначка" },
  { words: ["помІщик", "поміщИк"], correct: "помІщик" },
  { words: ["помОвчати", "помовчАти"], correct: "помОвчати" },
  { words: ["понЯття", "поняттЯ"], correct: "понЯття" },
  { words: ["порядкОвий", "порЯдковий", "порядковИй"], correct: "порядкОвий" },
  { words: ["посерЕдині", "посередИні", "посЕредині"], correct: "посерЕдині" },
  { words: ["прИморозок", "приморОзок"], correct: "прИморозок" },
  { words: ["прИчіп", "причІп"], correct: "прИчіп" },
  { words: ["прОділ", "продІл"], correct: "прОділ" },
  { words: ["промІжок", "прОміжок"], correct: "промІжок" },
  { words: ["псевдонІм", "псевдОнім"], correct: "псевдонІм" },
  { words: ["рАзом", "разОм"], correct: "рАзом" },
  { words: ["рЕмінь", "ремІнь"], correct: "рЕмінь" },
  { words: ["рЕшето", "решетО"], correct: "рЕшето" },
  { words: ["рИнковий", "ринкОвий", "ринковИй"], correct: "рИнковий" },
  { words: ["рівнИна", "рівнинА"], correct: "рівнИна" },
  { words: ["роздрібнИй", "роздрІбний", "рОздрібний"], correct: "роздрібнИй" },
  { words: ["рОзпірка", "розпІрка"], correct: "рОзпірка" },
  { words: ["рукОпис", "рУкопис"], correct: "рукОпис" },
  { words: ["руслО", "рУсло"], correct: "руслО" },
  { words: ["свЕрдло", "свердлО"], correct: "свЕрдло" },
  { words: ["серЕдина", "середИна", "серединА"], correct: "серЕдина" },
  { words: ["сЕча", "сечА"], correct: "сЕча" },
  { words: ["сільськогосподАрський", "сільськогоспОдарський"], correct: "сільськогосподАрський" },
  { words: ["сімдесЯт", "сІмдесят"], correct: "сімдесЯт" },
  { words: ["слИна", "слинА"], correct: "слИна" },
  { words: ["соломИнка", "солОминка"], correct: "соломИнка" },
  { words: ["стАтуя", "статУя"], correct: "стАтуя" },
  { words: ["стовідсОтковий", "стовідсоткОвий", "стовідсотковИй"], correct: "стовідсОтковий" },
  { words: ["стрибАти", "стрИбати"], correct: "стрибАти" },
  { words: ["текстовИй", "тЕкстовий"], correct: "текстовИй" },
  { words: ["тИгровий", "тигрОвий", "тигровИй"], correct: "тИгровий" },
  { words: ["тисОвий", "тИсовий", "тисовИй"], correct: "тисОвий" },
  { words: ["тім'янИй", "тім’Яний"], correct: "тім'янИй" },
  { words: ["тризУб", "трИзуб"], correct: "тризУб" },
  { words: ["тУлуб", "тулУб"], correct: "тУлуб" },
  { words: ["украЇнський", "укрАїнський"], correct: "украЇнський" },
  { words: ["урочИстий", "урОчистий"], correct: "урочИстий" },
  { words: ["усерЕдині", "усередИні"], correct: "усерЕдині" },
  { words: ["фартУх", "фАртух"], correct: "фартУх" },
  { words: ["фаховИй", "фАховий", "фахОвий"], correct: "фаховИй" },
  { words: ["фенОмен", "феномЕн"], correct: "фенОмен" },
  { words: ["фОльга", "фольгА"], correct: "фОльга" },
  { words: ["фОрзац", "форзАц"], correct: "фОрзац" },
  { words: ["хАос (у міфології: стихія)", "хаОс (у міфології: стихія)"], correct: "хАос (у міфології: стихія)" },
  { words: ["хаОс (безлад)", "хАос (безлад)"], correct: "хаОс (безлад)" },
  { words: ["цАрина", "царинА", "царИна"], correct: "цАрина" },
  { words: ["цемЕнт", "цЕмент"], correct: "цемЕнт" },
  { words: ["цЕнтнер", "центнЕр"], correct: "цЕнтнер" },
  { words: ["ціннИк", "цІнник"], correct: "ціннИк" },
  { words: ["чарівнИй", "чарІвний"], correct: "чарівнИй" },
  { words: ["черговИй", "чергОвий"], correct: "черговИй" },
  { words: ["чорнОзем", "чорнозЕм"], correct: "чорнОзем" },
  { words: ["чорнОслив", "чорнослИв"], correct: "чорнОслив" },
  { words: ["чотирнАдцять", "чотИрнадцять"], correct: "чотирнАдцять" },
  { words: ["шляхопровІд", "шляхопрОвід"], correct: "шляхопровІд" },
  { words: ["шовкОвий", "шовковИй", "шОвковий"], correct: "шовкОвий" },
  { words: ["шофЕр", "шОфер"], correct: "шофЕр" },
  { words: ["щЕлепа", "щелЕпа"], correct: "щЕлепа" },
  { words: ["щИпці", "щипцІ"], correct: "щИпці" },
  { words: ["щодобовИй", "щодобОвий"], correct: "щодобовИй" },
  { words: ["ярмаркОвий", "Ярмарковий", "ярмарковИй"], correct: "ярмаркОвий" },

  // Перші два слова правильні
  { words: ["алфАвіт", "алфавІт", "Алфавіт"], correct: ["алфАвіт", "алфавІт"] },
  { words: ["веснЯний", "веснянИй", "вЕсняний"], correct: ["веснЯний", "веснянИй"] },
  { words: ["пОмилка", "помИлка", "помилкА"], correct: ["пОмилка", "помИлка"] },
  { words: ["мАбуть", "мабУть"], correct: ["мАбуть", "мабУть"] },
  { words: ["зАвжди", "завждИ"], correct: ["зАвжди", "завждИ"] }
];

// Речення для «Лексичної помилки» зберігаються в Supabase (таблиця sentences)
// і приходять по одному через функцію random_sentence — у коді сайту їх немає.


// ================== Логіка гри ==================

const OK_TOKEN = "✅-помилок-немає-✅";
const MAX_LIVES = 3;
const TOTAL_WORDS = naholosyData.length;

// Затримки перед наступним питанням: [правильно, помилка]
const DELAYS = {
  naholosy: [600, 2000],
  leksychna: [3000, 12000], // «Лексична помилка: речення» (leks.js): час прочитати «як правильно» (є й кнопка «Далі →»)
  klychnyi: [600, 2200],
  frazeolohizmy: [3000, 4500], // час прочитати значення фразеологізму (є й кнопка «Далі →»)
  chyslivnyky: [2200, 4500],    // час прочитати правило (є й кнопка «Далі →»)
  slovospoluch: [1800, 4500],   // час прочитати пояснення (є й кнопка «Далі →»)
  inshomovni: [1800, 4500],     // час прочитати всі відповідники (є й кнопка «Далі →»)
  inshe: [1800, 4500]           // «📂 Інше» (inshe.js): час прочитати пояснення
};

// Бета-режим: ігри в розробці відкриваються лише за посиланням …/?beta, …/?b, …/beta/
// або в Telegram: t.me/ukrmovych_bot/battle?startapp=b (start_param приходить в адресі)
// Сама лише адреса бети нічого не відкриває: бета — лише на пристрої власниці (збережений пароль статистики),
// для учасників «НМТ-качок» (PRO) і учнів курсу — щоб PRO не можна було обійти посиланням (власниця, 04.11.2026).
const BETA_LINK = (() => {
  const query = new URLSearchParams(location.search);
  if (query.has("beta") || query.has("b")) return true;
  const hash = new URLSearchParams(location.hash.slice(1));
  const tgData = hash.get("tgWebAppData");
  const start = query.get("tgWebAppStartParam") || hash.get("tgWebAppStartParam")
    || (tgData ? new URLSearchParams(tgData).get("start_param") : "") || "";
  return start === "b" || start === "beta";
})();
// «Я на курсі Укрмовича» (course.js): учням курсу відкриті всі бета-тренажери (статистика з них рахується).
// У Telegram-мініапці доступ пам'ятається (localStorage course_access, course.js щоразу перевіряє код),
// поза Telegram — лише до закриття вкладки (sessionStorage), потім код вводять знову.
const COURSE = (() => {
  try {
    const inTg = location.hash.includes("tgWebAppData") || Boolean(sessionStorage.getItem("__telegram__initParams"));
    return Boolean(sessionStorage.getItem("course_access") || (inTg && localStorage.getItem("course_access")));
  } catch (e) { return false; }
})();
// 💎 PRO (Спільнота Укрмовича, канал «НМТ-качки»): лише в Telegram-мініапці; checkPro щоразу перевіряє членство
// в каналі й ліміт пристроїв (функція pro-check, pro_devices) і вмикає/вимикає доступ (localStorage pro_status).
const IN_TG = (() => {
  try {
    if (location.hash.includes("tgWebAppData")) return true;
    const saved = JSON.parse(sessionStorage.getItem("__telegram__initParams") || "{}"); // скрипт Telegram зберігає й порожні
    return Boolean(saved && saved.tgWebAppData);
  } catch (e) { return false; }
})();
// ?newbie — подивитися гру очима новачка (власниця, 06.11.2026): без PRO, бети, курсу; статистика не надсилається
const NEWBIE = /[?&]newbie(&|=|$)/.test(location.search);
const PRO_ACCESS = (() => { try { return !NEWBIE && IN_TG && localStorage.getItem("pro_status") === "1"; } catch (e) { return false; } })();
const OWNER_DEVICE = (() => { try { return Boolean(localStorage.getItem("stats_password")); } catch (e) { return false; } })();
const BETA = !NEWBIE && BETA_LINK && (OWNER_DEVICE || COURSE || PRO_ACCESS);
// 🏫 планшети школи за шкільним ключем (loader.js, ?school=…): відкриті тренажери з переліку ключа (дані дає pro-data)
const SCHOOL = (() => { try { return !NEWBIE && Boolean(localStorage.getItem("school_key")); } catch (e) { return false; } })();
const BETA_OPEN = !NEWBIE && (BETA || COURSE || PRO_ACCESS || SCHOOL || Array.isArray(window.GYM_LOCAL_PRO)); // GYM_LOCAL_PRO — шкільна копія з відкритими тренажерами
if (window.GYM_ONLY) document.body.classList.add("gym-only"); // шкільна копія: лише кілька тренажерів — плитки порівну // бета-ігри відкриті (PRO — усе, що є в беті)
// 🎁 Демо для новачків (loader.js → window.GYM_DEMO): у PRO-тренажерах відкрита лише перша група, без марафону й спринту
const DEMO = !BETA_OPEN && Boolean(window.GYM_DEMO);
// ---------- Статистика ----------
// Кожна подія йде в Google Analytics, а важливі — ще й у таблицю game_events
// у Supabase (її показує сторінка …/stats/, див. STATS.md)
const STATS_EVENTS = new Set([
  "streak_hit", "streak_reminder_open", "launch_notify", "game_start", "game_over", "all_words_done", "training_start", "training_done",
  "duel_start", "duel_end", "soon_click", "leaderboard_submit",
  "online_join", "online_share", "online_invite_open", "pro_click", "pro_report", "brand_click",
  "pro_offer_view", "pro_buy_click", // upsell.js: показ пропозиції підписки новачкам і перехід на monobase
  "demo_open", // demo.js: новачок відкрив демо-тренажер
  "bot_gate_view", "bot_gate_ok" // bot-gate.js: вимога підписатися на @ukrmovych_bot і підписка після неї
]);

function track(name, params = {}) {
  if (typeof NEWBIE !== "undefined" && NEWBIE) return; // перегляд очима новачка — без статистики
  if (name !== "visit") gtag('event', name, params); // візити GA рахує сам
  if (name !== "visit" && !STATS_EVENTS.has(name)) return;
  if (typeof leaderboardEnabled === "undefined" || !leaderboardEnabled) return;
  if (BETA) return; // у статистику — лише основна версія, без бети
  const { game_type: game = null, ...details } = params;
  if (typeof DEMO !== "undefined" && DEMO) details.demo = 1; // 🎁 подія новачка в демо (статистика «Демо-доступ»)
  if (game === "inshe" && typeof insheQuiz !== "undefined" && insheQuiz && !details.sub) { details.sub = insheQuiz.id; details.sub_name = insheQuiz.name; } // тренажер «Іншого»/«Історії»
  lbRequest("game_events", {
    method: "POST",
    headers: { Prefer: "return=minimal" },
    body: JSON.stringify({ player: getPlayerId(), event: name, game, details })
  }).catch(() => {});
}

const KLYCHNYI_TOTAL = typeof klychnyiData !== "undefined" ? klychnyiData.length : 0;
// 💬 Нова будова «Фразеологізмів» (власниця, 08.11.2026; frazeo-s30.js, PRO): четвірки однакової граматичної форми,
// на кожен фразеологізм ~30 речень. Картка — завжди 4 варіанти своєї четвірки (з п'ятірки — правильний + 3), речення
// щоразу наступне (localStorage frazeo_pos). frazeoSentences стає «по рядку на фразеологізм» — решта гри (групи,
// марафон, онлайн, перелік) працює як раніше. Групи тренування — ті самі назви (ключі ДЗ), склад — frazeoS30.groups.
const FRAZEO_S30 = typeof frazeoS30 !== "undefined" && frazeoS30 && frazeoS30.s && Object.keys(frazeoS30.s).length ? frazeoS30 : null;
const FRAZEO_QUART = {};
if (FRAZEO_S30 && typeof frazeoPhrases !== "undefined") {
  Object.entries(FRAZEO_S30.forms || {}).forEach(([id, p]) => { const ph = frazeoPhrases.find(x => x.id === id); if (ph) ph.p = p; });
  (FRAZEO_S30.quartets || []).forEach(q => q.forEach(id => { FRAZEO_QUART[id] = q; }));
  // mates — власні 3 «сусіди» для висловів, що не стають у речення своєї групи (не симетрично)
  Object.entries(FRAZEO_S30.mates || {}).forEach(([id, m]) => { FRAZEO_QUART[id] = [id, ...m]; });
  const ids = frazeoPhrases.map(ph => ph.id).filter(id => FRAZEO_QUART[id] && FRAZEO_S30.s[id] && FRAZEO_S30.s[id].length);
  frazeoSentences.length = 0;
  ids.forEach(id => frazeoSentences.push([id, FRAZEO_S30.s[id][0]]));
}
const FRAZEO_S30_COUNT = FRAZEO_S30 ? Object.values(FRAZEO_S30.s).reduce((n, l) => n + l.length, 0) : 0;
const FRAZEO_TOTAL = typeof frazeoSentences !== "undefined" ? frazeoSentences.length : 0;
const CHYS_TOTAL = typeof chyslivnykyData !== "undefined" ? chyslivnykyData.length : 0;

const PRAISE = ["Правильно!", "Так тримати!", "Супер!", "Чудово!", "Влучно!", "Є!"];

// Усі ігри в меню. Нова гра = новий рядок тут.
// status: "live" — працює, "beta" — працює в тестовому режимі, "soon" — ще немає
// pro: true — гра для PRO-підписки (поки що замочок діє лише в беті)
// Підписи на плитках ігор
const STATUS_LABELS = { beta: "бета", soon: Date.now() < Date.parse("2026-11-15T20:30:00+02:00") ? "15.11" : "скоро" }; // до відкриття — дата (власниця, 08.11.2026)

// 📂 підпис плитки «Інше» — з inshe-counts.js (оновлюється сам під час викладання)
function insheCountsText() {
  const c = window.INSHE_COUNTS;
  return c && c.trainers ? `${c.trainers} ${plural(c.trainers, "тренажер", "тренажери", "тренажерів")} · ${c.tasks} ${plural(c.tasks, "завдання", "завдання", "завдань")}` : "";
}
function insheSub() {
  const c = window.INSHE_COUNTS;
  return c && c.trainers ? `${c.trainers} ${plural(c.trainers, "тренажер", "тренажери", "тренажерів")} за розділами НМТ · ${c.tasks} ${plural(c.tasks, "завдання", "завдання", "завдань")}` : "Тренажери за розділами НМТ";
}
const GAMES = [
  // власниця, 08.11.2026 (макет «Ж»): угорі трійка рівних — наголоси (м'яко виділені), іншомовні, фразеологізми; далі Історія (стримано); далі решта
  { id: "naholosy", name: "Наголоси", sub: "Усі, що потрібні для НМТ!", icon: "🗣️", status: "live", main: true, glow: true },
  { id: "inshomovni", main: true, name: "Іншомовні слова", icon: "🌍", status: BETA_OPEN || DEMO ? "live" : "soon", pro: true },
  { id: "frazeolohizmy", main: true, name: "Фразеологізми", icon: "💬", status: BETA_OPEN || DEMO ? "live" : "soon", pro: true },
  { id: "istoriia", name: "Історія України", sub: "Дати й персоналії для НМТ", icon: "🏛️", main: true, soft: true, status: BETA_OPEN ? "beta" : DEMO ? "live" : "soon", pro: true },
  // власниця, 08.11.2026: одна плитка «Лексична помилка» → екран вибору (leks-menu.js): словосполучення або речення
  { id: "leksmenu", name: "Лексична помилка", icon: "🔎", status: "live", isNew: true, glow: true }, // помаранчевий контур, як у «Наголосів» (власниця, 08.11.2026)
  { id: "slovospoluch", name: "Лексична помилка: словосполучення", icon: "🧩", status: "live", menu: false }, // основна версія: відкриті групи (slovo-free-data.js), решта — PRO
  { id: "leksychna", name: "Лексична помилка: речення", icon: "🔎", status: "live", menu: false },
  { id: "klychnyi", name: "Кличний відмінок", icon: "📣", status: BETA_OPEN || DEMO ? "live" : "soon", pro: true },
  { id: "chyslivnyky", name: "Числівники", icon: "🔢", status: BETA_OPEN ? "beta" : DEMO ? "live" : "soon", pro: true },
  { id: "nmttest", name: "Рандомний тест НМТ", icon: "🎲", status: BETA_OPEN ? "beta" : DEMO ? "live" : "soon", pro: true },
  // 📂 папка з усіма іншими тренажерами за розділами НМТ (inshe.js)
  // 🏛️ Історія України: дати й персоналії (рушій «Іншого», inshe.js → розділ istoriia)
  { id: "inshe", name: "Інше", sub: insheSub(), icon: "📂", status: BETA_OPEN ? "beta" : "soon", pro: true }, // власниця, 07.11.2026: новачкам «Інше» не відкривати (без демо) — лише в Спільноті
  { id: "plan", name: "Мій план", sub: "Сам розплануй, як устигнути до своєї дати", icon: "📅", status: "live", menu: false } // власниця, 07.11.2026: відкритий для всіх, без «PRO»; // plan.js — не тренажер: окрема кнопка біля «Турнірної таблиці» (renderPlanBtn)
];
// 📊 Скільки практики в кожній грі — підпис під назвою на головній (власниця, 07.11.2026). Числа — inshe-counts.js
// (window.GYM_COUNTS, перераховує tools/inshe-counts.js під час викладання з повних даних), наголоси — з naholosyData.
(function gamesCounts() {
  const c = window.GYM_COUNTS || {};
  const f = n => Number(n).toLocaleString("uk-UA");
  const SUB = {
    naholosy: typeof naholosyData !== "undefined" && naholosyData.length ? `Усі ${f(naholosyData.length)} ${plural(naholosyData.length, "слово", "слова", "слів")} програми НМТ` : "", // власниця, 08.11.2026
    slovospoluch: c.slovospoluch ? `${f(c.slovospoluch)} ${plural(c.slovospoluch, "словосполучення", "словосполучення", "словосполучень")}` : "",
    leksmenu: c.slovospoluch ? `${f(c.slovospoluch / 2)} ${plural(c.slovospoluch / 2, "помилка", "помилки", "помилок")}` : "", // у даних кожна помилка дає 2 картки (неправильно й правильно)
    leksychna: c.leksychna ? `${f(c.leksychna)} ${plural(c.leksychna, "речення", "речення", "речень")}` : "",
    klychnyi: c.klychnyi ? `${f(c.klychnyi)} ${plural(c.klychnyi, "звертання", "звертання", "звертань")}` : "",
    chyslivnyky: c.chyslivnyky ? `${f(c.chyslivnyky)} ${plural(c.chyslivnyky, "речення", "речення", "речень")}` : "",
    frazeolohizmy: c.frazeolohizmy ? `${f(c.frazeolohizmy)} ${plural(c.frazeolohizmy, "фразеологізм", "фразеологізми", "фразеологізмів")}` : "", // плитка у верхній трійці — коротко
    inshomovni: c.inshomovni ? `${f(c.inshomovni)} ${plural(c.inshomovni, "слово", "слова", "слів")}` : "",
    nmttest: c.nmttest ? `${f(c.nmttest)} ${plural(c.nmttest, "справжнє завдання", "справжні завдання", "справжніх завдань")} НМТ і ЗНО` : "",
    istoriia: c.istoriiaDates ? `${f(c.istoriiaDates)} дат і ${c.istoriiaPersons} ${plural(c.istoriiaPersons, "персоналія", "персоналії", "персоналій")} для НМТ` : ""
  };
  GAMES.forEach(g => { if (SUB[g.id]) g.sub = SUB[g.id]; });
})();


const $ = id => document.getElementById(id);
const screens = {
  menu: $("menu"), modes: $("modes"), game: $("game"), over: $("over"),
  trainOver: $("train-over"), leaders: $("leaders"), duel: $("duel")
};
const scoreEl = $("score");
const livesEl = $("lives");
const progressEl = $("progress");
const progressFill = $("progress-fill");
const questionEl = $("question");
const sentenceEl = $("sentence");
const answersEl = $("answers");
const feedbackEl = $("feedback");
const hintEl = $("hint");

let score = 0;
let lives = MAX_LIVES;
let streak = 0;
let mistakes = [];
let currentGame = "";
let currentQuestion = null;
let lock = false;
let endless = false; // PRO: марафон без обмеження життів (без рекорду й турнірної таблиці)
let remainingQuestions = [];
let klychnyiAsked = 0; // скільки питань «Кличного» вже було в цій грі (для рівнів)
let klychnyiFinished = false;
let questionToken = 0;
let seenSentenceIds = [];
let sentencePrefetch = null;
let nextTimer = null;

// Тренування за групами (null — звичайний марафон)
let training = null;

// ---------- Локальне сховище (може бути недоступне) ----------

function storageGet(key) {
  try {
    return localStorage.getItem(key);
  } catch (e) {
    return null;
  }
}

function storageSet(key, value) {
  try {
    localStorage.setItem(key, value);
  } catch (e) {
    // нічого страшного — просто не збережеться
  }
}

function getBest(game) {
  return Number(storageGet(`best_${game}`)) || 0;
}

// 📅 «Мій план» — окрема кнопка біля «Мого класу» й «Турнірної таблиці» (власниця, 07.11.2026: це не тренажер)
function renderPlanBtn(upsell) {
  const btn = $("btn-plan"), game = GAMES.find(g => g.id === "plan");
  if (!btn || !game) return;
  const b = btn.querySelector(".badge");
  if (b) b.remove();
  const soon = game.status === "soon";
  if (soon || (PRO_ENABLED && game.pro && !isPro)) {
    const badge = document.createElement("span");
    badge.className = soon && !upsell ? "badge badge-soon" : "badge badge-pro";
    badge.textContent = soon && !upsell ? STATUS_LABELS.soon : "🔒 PRO";
    btn.insertBefore(badge, btn.querySelector(".mode-arrow"));
  } else if (game.status === "beta") {
    const badge = document.createElement("span");
    badge.className = "badge badge-beta";
    badge.textContent = STATUS_LABELS.beta;
    btn.insertBefore(badge, btn.querySelector(".mode-arrow"));
  }
  btn.onclick = () => {
    if (soon && upsell) showPro(game);
    else if (soon) showSoon(game);
    else if (PRO_ENABLED && game.pro && !isPro) showPro(game);
    else showPlan();
  };
}

// ⚡ Готове меню з минулого запуску (власниця, 08.11.2026: «щоб одразу відкривалась готова гра»): плитки зберігаються
// в localStorage menu_cache, а вставка в index.html (одразу після «Мій клас») показує їх миттєво, поки вантажиться код.
let menuCacheT = null;
function saveMenuCacheSoon() {
  clearTimeout(menuCacheT);
  menuCacheT = setTimeout(() => {
    try {
      const list = $("game-list").cloneNode(true);
      const mc = list.querySelector("#btn-myclass");
      if (mc) mc.replaceWith(Object.assign(document.createElement("i"), { className: "myclass-slot" }));
      if (typeof NEWBIE === "undefined" || !NEWBIE) localStorage.setItem("menu_cache", list.innerHTML);
    } catch (e) { /* немає сховища */ }
  }, 1500);
}
// 🎬 Перший запуск: кнопки меню вистрибують з боків і збираються на місця (власниця, 08.11.2026)
function menuAssemble() {
  if (!document.body.classList.contains("first-load")) return;
  document.body.classList.remove("first-load");
  const ld = document.querySelector(".gl-loading"); if (ld) ld.remove();
  const items = [...$("game-list").children, ...[...$("menu").children].filter(el => el.matches("button:not([hidden]), .leaders-btn, .feedback-btn") && !el.hidden)];
  items.forEach((el, i) => { el.style.setProperty("--i", i); el.classList.add(i % 2 ? "fly-r" : "fly-l"); });
  $("menu").classList.add("menu-assemble");
  setTimeout(() => { $("menu").classList.remove("menu-assemble"); items.forEach(el => el.classList.remove("fly-l", "fly-r")); }, 1400 + items.length * 70);
}
function renderMenu() {
  const list = $("game-list");
  const mcBtn = $("btn-myclass"); // «Мій клас» стоїть усередині сітки — виносимо, щоб не зник разом зі старими плитками
  if (mcBtn && list.contains(mcBtn)) list.after(mcBtn);
  list.innerHTML = "";
  list.classList.remove("from-cache");

  const upsell = typeof proUpsell === "function" && proUpsell(); // upsell.js: новим — «🔒 PRO» замість «скоро»
  renderPlanBtn(upsell);
  GAMES.filter(g => g.menu !== false && (!window.GYM_ONLY || window.GYM_ONLY.includes(g.id))).forEach(game => { // GYM_ONLY — шкільна копія (mirror-config.js)
    const btn = document.createElement("button");
    const soonPro = upsell && game.pro && game.status === "soon";
    btn.className = "game-tile"
      + (game.featured ? " featured" : "")
      + (game.highlight ? " tile-highlight" : "")
      // власниця, 08.11.2026: 4 основні (наголоси, іншомовні, фразеологізми, історія) — великі, по 2 в ряд; решта — менші, по 3
      + (game.main ? " tile-main" : " tile-top") + (game.glow ? " tile-glow" : "") + (game.soft ? " tile-soft" : "")
      + (game.status === "soon" && !soonPro ? " is-soon" : "");

    const icon = document.createElement("span");
    icon.className = "tile-icon";
    icon.setAttribute("aria-hidden", "true");
    icon.textContent = game.icon;

    const name = document.createElement("span");
    name.className = "tile-name";
    name.textContent = game.name;
    if (game.sub) {
      const sub = document.createElement("span");
      sub.className = "tile-sub";
      sub.textContent = game.sub;
      name.appendChild(sub);
    }

    btn.append(icon, name);

    if (game.isNew && new Date() < new Date("2026-12-01T00:00:00+02:00")) {
      const nb = document.createElement("span");
      nb.className = "badge badge-new";
      nb.textContent = "НОВЕ!";
      btn.appendChild(nb);
    }
    if (soonPro) {
      const badge = document.createElement("span");
      badge.className = "badge badge-pro";
      badge.textContent = "🔒 PRO";
      btn.appendChild(badge);
    } else if (PRO_ENABLED && game.pro && game.status !== "soon") {
      const badge = document.createElement("span");
      badge.className = "badge badge-pro";
      badge.textContent = isPro ? "PRO" : "🔒 PRO";
      btn.appendChild(badge);
    } else if (DEMO && game.pro && game.status !== "soon") {
      // власниця, 07.11.2026: у меню демо-ігри виглядають так само відкритими, як «Наголоси» (без значка «🎁 Демо»)
    } else if (game.status !== "live") {
      const badge = document.createElement("span");
      badge.className = `badge badge-${game.status}`;
      badge.textContent = STATUS_LABELS[game.status];
      btn.appendChild(badge);
    }

    if (game.status !== "soon") {
      const best = document.createElement("span");
      best.className = "mode-best";
      best.dataset.best = game.id;
      btn.appendChild(best);
    }

    btn.addEventListener("click", () => {
      if (soonPro) {
        showPro(game); // upsell.js: заклик до Спільноти
      } else if (game.status === "soon") {
        showSoon(game);
      } else if (PRO_ENABLED && game.pro && !isPro) {
        showPro(game);
      } else if (game.id === "leksmenu" && typeof showLeksChoice === "function") {
        showLeksChoice(); // leks-menu.js: словосполучення чи речення
      } else if (game.id === "nmttest") {
        startNmtTest(); // nmt-test.js
      } else if (game.id === "inshomovni") {
        showInshModes(); // inshomovni.js: марафон або групи
      } else if (game.id === "leksychna" && typeof LEKS_DATA !== "undefined" && LEKS_DATA) {
        showLeksModes(); // leks.js: тренування, марафон, «Як на НМТ» (бета й PRO)
      } else if (game.id === "leksychna") {
        if (typeof leksMode !== "undefined") leksMode = "marathon";
        startGame("leksychna"); // основна версія: лише марафон
      } else if (game.id === "inshe") {
        showInsheSections(); // inshe.js: розділи → тренажери
      } else if (game.id === "istoriia") {
        showInsheSections("istoriia"); // inshe.js: дати й персоналії
      } else if (game.id === "plan") {
        showPlan(); // plan.js: «Мій план»
      } else if (["naholosy", "klychnyi", "frazeolohizmy", "slovospoluch", "chyslivnyky"].includes(game.id)) {
        showModes(game.id);
      } else {
        startGame(game.id);
      }
    });
    list.appendChild(btn);
  });

  // непарна кількість звичайних плиток — остання на всю ширину (щоб не лишалася сама в рядку)
  const half = [...list.querySelectorAll(".game-tile:not(.featured):not(.tile-highlight):not(.tile-top):not(.tile-main)")];
  if (half.length % 2) half[half.length - 1].classList.add("tile-wide");
  // менші плитки по 3 в ряд: останній неповний ряд розтягуємо (2 → по половині, 1 → на всю ширину)
  const small = [...list.querySelectorAll(".game-tile.tile-top")];
  if (small.length % 3 === 2) small.slice(-2).forEach(t => t.classList.add("tile-half"));
  if (small.length % 3 === 1) small[small.length - 1].classList.add("tile-full");
  // Блок відгуку — у самому низу меню (з index.html); під головною грою — «👥 Мій клас»
  if (typeof placeMyClassBtn === "function") placeMyClassBtn(); // 👥 «НОВЕ!» — myclass.js
  saveMenuCacheSoon();
  menuAssemble();
  renderBestScores();
}

// ---------- PRO-підписка ----------
// Підписка оформлюється в Base by mono: Base додає підписника в закритий Telegram-канал,
// а функція Supabase «pro-check» перевіряє, чи є гравець у цьому каналі
// (код — supabase/functions/pro-check/index.ts). Працює лише в Telegram-мініапці.
// Поки що замочки PRO видно тільки в беті.
// Для перевірки в беті: …/?b&pro — PRO-ігри відкриті без підписки (лише до запуску PRO для всіх).
// ТИМЧАСОВО (за проханням власника): замочки PRO вимкнено й у беті — усі бета-ігри відкриті з будь-якого
// пристрою. Перед запуском PRO в основній версії повернути: PRO_LOCKS = true (див. CLAUDE.md → «Тимчасове»).
const PRO_LOCKS = false;
const PRO_ENABLED = PRO_LOCKS && BETA && !COURSE && !new URLSearchParams(location.search).has("pro"); // учням курсу — без замочків
let isPro = !NEWBIE && storageGet("pro_status") === "1";

function telegramInitData() {
  const tg = window.Telegram && Telegram.WebApp;
  return (tg && tg.initData) || "";
}

async function checkPro() {
  if (NEWBIE) return false;
  const initData = telegramInitData();
  if (!initData || !leaderboardEnabled) return isPro; // PRO — лише в Telegram-мініапці
  try {
    const tg = window.Telegram && Telegram.WebApp;
    const res = await fetch(`${LB.url}/functions/v1/pro-check`, {
      method: "POST",
      headers: { apikey: LB.anonKey, Authorization: `Bearer ${LB.anonKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({ initData, player: getPlayerId(), platform: (tg && tg.platform) || "", device: typeof proDeviceLabel === "function" ? proDeviceLabel() : "" })
    });
    const data = await res.json();
    if (data.configured === false || data.reason === "check_failed") return isPro; // перевірку не вдалося зробити — як було
    const was = isPro;
    isPro = Boolean(data.pro);
    storageSet("pro_status", isPro ? "1" : "0");
    // уже 2 пристрої — учень сам обирає, який відключити (pro-devices.js); вікно — раз за запуск
    if (data.reason === "devices" && typeof proDevicePicker === "function" && !window.__proPickerShown) {
      window.__proPickerShown = true;
      proDevicePicker(data);
    }
    // доступ з'явився чи зник (учня додали в канал «НМТ-качки» або прибрали) — перезапуск із новим вмістом
    if (isPro !== PRO_ACCESS) { location.reload(); return isPro; }
    if (was !== isPro) renderMenu();
  } catch (e) {
    // немає зв'язку — лишаємо збережений стан
  }
  return isPro;
}
setInterval(() => { if (document.visibilityState === "visible") checkPro(); }, 10 * 60 * 1000); // і під час гри — раз на 10 хв

function showPro(game) {
  track("pro_click", { game_type: game.id });
  const inTelegram = Boolean(telegramInitData());
  const link = LB.proLink || "";
  $("pro-title").textContent = `${game.icon} ${game.name}`;
  $("pro-text").textContent = inTelegram
    ? "Цей тренажер — для Спільноти Укрмовича. Підпишись — і тебе додадуть у закритий канал «НМТ-качки», а всі тренажери відкриються!"
    : "Тренажери Спільноти Укрмовича відкриваються в Telegram-мініапці @ukrmovych_bot. Відкрий гру там.";
  const buy = $("btn-pro-buy");
  buy.hidden = inTelegram ? !link : !LB.telegramAppLink;
  buy.textContent = inTelegram ? "🦆 Приєднатися до Спільноти" : "Відкрити в Telegram";
  buy.href = inTelegram ? link : (LB.telegramAppLink + "?startapp=b");
  $("btn-pro-check").hidden = !inTelegram;
  $("btn-pro-help").hidden = true; // з'являється лише після невдалої перевірки
  $("pro").classList.remove("pro-form");
  $("pro-help").hidden = true;
  $("pro-done").hidden = true;
  $("pro-status").textContent = inTelegram && !link ? "Спільнота відкриється зовсім скоро!" : "";
  insheLockShow($("pro-text"), game);
  // старим гравцям посилання на Base не показуємо (upsell.js для новачків поверне кнопку)
  if (inTelegram && !(typeof proUpsell === "function" && proUpsell())) {
    buy.hidden = true;
    $("pro-text").textContent = "Цей тренажер — для Спільноти Укрмовича. Вона відкриється 15 листопада о 20:30 — разом із відкриттям НМТ-качалки!";
  }
  $("pro").hidden = false;
  $("btn-pro-close").focus();
}

// 07.11.2026 (власниця): гравцям, що прийшли до 05.11.2026 (не proUpsell), Спільноту й ціну ще не показуємо —
// замість посилання на Base кнопка «Чекаю на Спільноту!».
const PRO_WAIT_TEXT = "🔔 Повідомити, коли з'явиться"; // власниця, 08.11.2026 (було «Чекаю на Спільноту»)
function proWaitClick(btn) {
  if (typeof launchNotify === "function") launchNotify(currentGame || "naholosy", btn); // countdown.js: бот напише 15.11 о 20:30
  else if (btn) btn.textContent = "💛 Уже зовсім скоро — стеж за каналом @ukr_movych!";
}

// 📂 «Інше» закрите — показати, які саме там тренажери (inshe.js insheLockedList)
function insheLockShow(after, game) {
  let el = document.getElementById(after.id + "-inshe");
  if (!el) { el = document.createElement("div"); el.id = after.id + "-inshe"; el.className = "inshe-lock"; after.after(el); }
  const on = game && game.id === "inshe" && typeof insheLockedList === "function";
  el.hidden = !on;
  el.innerHTML = on ? `<p class="inshe-lock-head">Що всередині — ${insheCountsText() || "тренажери за розділами НМТ"}:</p>${insheLockedList()}` : "";
}

function showSoon(game) {
  track('soon_click', { game_type: game.id });
  $("soon-title").textContent = `${game.icon} ${game.name}`;
  insheLockShow(document.querySelector("#soon .modal-card > p"), game);
  $("soon").hidden = false;
  $("btn-soon-ok").focus();
}

function renderBestScores() {
  document.querySelectorAll("[data-best]").forEach(el => {
    const best = getBest(el.dataset.best);
    el.textContent = best > 0 ? `Рекорд: ${best}` : "";
  });
}

// ---------- Допоміжне ----------

function shuffleArray(array, rand = Math.random) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function showScreen(name) {
  $("confetti").innerHTML = "";
  Object.entries(screens).forEach(([key, el]) => {
    el.hidden = key !== name;
  });
  document.body.classList.toggle("duel-open", name === "duel");
  document.body.classList.toggle("off-menu", name !== "menu"); // «Про НМТ-качалку» (для пошуку) — лише під меню
  window.scrollTo(0, 0);
}

let nextFn = null;

function schedule(fn, delay) {
  clearTimeout(nextTimer);
  nextFn = fn;
  nextTimer = setTimeout(() => { nextFn = null; fn(); }, delay);
}

// «Далі →»: не чекати, поки мине пауза після відповіді
function skipWait() {
  if (!nextFn) return;
  clearTimeout(nextTimer);
  const fn = nextFn;
  nextFn = null;
  fn();
}

function restartAnimation(el, className) {
  el.classList.remove(className);
  void el.offsetWidth;
  el.classList.add(className);
}

function updateUI() {
  livesEl.hidden = Boolean(training);
  if (training) {
    scoreEl.textContent = `${training.done}/${training.total}`;
    progressEl.hidden = false;
    progressFill.style.width = `${(training.done / training.total) * 100}%`;
    progressEl.classList.toggle("done", training.done >= training.total);
    return;
  }

  if (currentGame === "naholosy") {
    const total = marathonPool().length;
    scoreEl.textContent = score >= total ? `${score} 🏆` : `${score}/${total}`;
    progressEl.hidden = false;
    progressFill.style.width = `${Math.min(score / total, 1) * 100}%`;
    progressEl.classList.toggle("done", score >= total);
  } else if (currentGame === "klychnyi") {
    // у «Кличному» лінія прогресу — у межах рівня (updateKlychnyiLevelUI)
    scoreEl.textContent = score;
  } else if (["frazeolohizmy", "chyslivnyky", "slovospoluch", "inshomovni", "inshe"].includes(currentGame)) {
    const total = currentGame === "chyslivnyky" ? CHYS_TOTAL
      : currentGame === "inshe" ? insheTotal()
      : currentGame === "inshomovni" ? INSH_TOTAL
      : currentGame === "slovospoluch" ? slovoTotal() : frazeoRows().length;
    scoreEl.textContent = score >= total ? `${score} 🏆` : `${score}/${total}`;
    progressEl.hidden = false;
    progressFill.style.width = `${Math.min(score / total, 1) * 100}%`;
    progressEl.classList.toggle("done", score >= total);
  } else {
    scoreEl.textContent = score;
    progressEl.hidden = true;
  }

  livesEl.innerHTML = "";
  if (endless) {
    livesEl.innerHTML = '<span class="heart">❤️</span><span class="endless-mark">∞</span>';
    livesEl.setAttribute("aria-label", "Життя без обмежень");
    return;
  }
  for (let i = 0; i < MAX_LIVES; i++) {
    const heart = document.createElement("span");
    heart.className = "heart" + (i < lives ? "" : " lost");
    heart.textContent = "❤️";
    livesEl.appendChild(heart);
  }
  livesEl.setAttribute("aria-label", `Життя: ${lives} з ${MAX_LIVES}`);
}

function setFeedback(text, kind) {
  feedbackEl.textContent = text;
  feedbackEl.className = "feedback" + (kind ? ` ${kind}` : "");
}

// Слово з великою літерою-наголосом -> елементи з підсвіченою літерою.
// «вИгода (користь)» -> «вИгода» + підпис «користь»
function renderStressWord(container, word) {
  const match = word.match(/^(.*?)\s*\((.+)\)\s*$/);
  const main = match ? match[1] : word;
  const note = match ? match[2] : "";

  const wordEl = document.createElement("span");
  for (const ch of main) {
    if (ch !== ch.toLowerCase()) {
      const s = document.createElement("span");
      s.className = "stress";
      s.textContent = ch;
      wordEl.appendChild(s);
    } else {
      wordEl.appendChild(document.createTextNode(ch));
    }
  }
  container.appendChild(wordEl);

  if (note) {
    const noteEl = document.createElement("span");
    noteEl.className = "note";
    noteEl.textContent = note;
    container.appendChild(noteEl);
  }
}

// ---------- Хід гри ----------

function startGame(gameType, opts = {}) {
  clearTimeout(nextTimer);
  training = null;
  endless = Boolean(opts.endless);
  $("btn-menu").textContent = endless ? "Завершити" : "‹ Меню";
  currentGame = gameType;
  marathonTopic = gameType === "naholosy" && hasTopic(currentTopic) ? currentTopic : "";
  score = 0;
  lives = MAX_LIVES;
  streak = 0;
  mistakes = [];
  updateUI();
  track('game_start', { game_type: gameType, ...(endless ? { endless: true } : {}), ...(marathonTopic ? { topic: marathonTopic } : {}) });

  remainingQuestions = gameType === "naholosy" ? [...marathonPool()]
    : gameType === "klychnyi" ? klychnyiQueue()
    : gameType === "frazeolohizmy" ? frazeoQueue()
    : gameType === "chyslivnyky" ? chysQueue()
    : gameType === "slovospoluch" ? slovoQueue()
    : gameType === "inshomovni" ? inshQueue()
    : gameType === "inshe" ? insheQueue() // inshe.js
    : [];
  klychnyiAsked = 0;
  $("level-line").hidden = true;
  setPrevCard(null);
  showScreen("game");
  $("test-note").hidden = ["naholosy", "klychnyi", "frazeolohizmy", "inshomovni", "leksychna", "slovospoluch"].includes(gameType); // без позначки «бета»
  $("test-note").textContent = ["klychnyi", "frazeolohizmy", "chyslivnyky", "slovospoluch", "inshomovni", "inshe"].includes(gameType)
    ? "🧪 Бета-версія тренажера. Помітили неточність — напишіть @ukr_movych."
    : "🧪 Розділ працює в тестовому режимі: деякі речення ще потребують доопрацювання.";
  hintEl.textContent = ["naholosy", "klychnyi", "frazeolohizmy", "chyslivnyky", "slovospoluch", "inshomovni", "inshe"].includes(gameType)
    ? "Підказка: можна відповідати клавішами 1, 2, 3"
    : "";
  nextQuestion();
}

function showMenu() {
  clearTimeout(nextTimer);
  training = null;
  endless = false;
  questionToken++;
  $("celebrate").hidden = true;
  renderBestScores();
  if (typeof renderRejoin === "function") renderRejoin(); // «Повернутися в гру» (online.js)
  showScreen("menu");
}

function handleAnswer(isCorrect, highlight, mistake) {
  if (lock) return;
  lock = true;

  gtag('event', 'answer', {
    game_type: currentGame,
    result: isCorrect ? 'correct' : 'wrong',
    score: isCorrect ? score + 1 : score
  });

  highlight();
  if (isCorrect) {
    // іскорки від правильної відповіді й «стрибок» рахунку
    sparkleAt(document.querySelector("#game .answer.correct, #game .correct"));
    scoreEl.classList.remove("bump");
    void scoreEl.offsetWidth;
    scoreEl.classList.add("bump");
  }

  const [okDelay, badDelay] = DELAYS[currentGame];

  if (training) {
    if (typeof noteTrainingAnswer === "function") noteTrainingAnswer(isCorrect); // groups.js
    if (isCorrect) {
      training.done++;
      if (training.round === 1) training.firstTry++;
      streak++;
      const praise = PRAISE[Math.floor(Math.random() * PRAISE.length)];
      setFeedback(streak >= 3 ? `${praise} 🔥 ${streak} поспіль` : praise, "good");
    } else {
      // Слово не зараховується: воно піде в роботу над помилками
      training.done++;
      streak = 0;
      training.roundMistakes.push({ ...mistake, question: training.game ? training.raw : currentQuestion });
      setFeedback("Запам'ятай правильний варіант 👆 Повторимо наприкінці", "bad");
    }
    updateUI();
    restartAnimation(scoreEl, "bump");
    schedule(nextQuestion, isCorrect ? okDelay : badDelay);
    return;
  }

  if (isCorrect) {
    score++;
    streak++;
    updateUI();
    restartAnimation(scoreEl, "bump");
    const praise = PRAISE[Math.floor(Math.random() * PRAISE.length)];
    setFeedback(streak >= 3 ? `${praise} 🔥 ${streak} поспіль` : praise, "good");

    if (currentGame === "naholosy" && score === marathonPool().length) {
      schedule(celebrate, okDelay);
    } else {
      schedule(nextQuestion, okDelay);
    }
    return;
  }

  streak = 0;
  if (!endless) lives--;
  mistakes.push(mistake);
  updateUI();
  restartAnimation(livesEl, "hit");
  setFeedback(lives > 0 ? "Ой, не так. Запам'ятай правильний варіант 👆" : "Це було останнє життя", "bad");
  schedule(lives > 0 ? nextQuestion : gameOver, badDelay);
}

// ---------- «‹ Попереднє»: подивитися попереднє завдання з відповіддю ----------
let prevCard = null; // копія картки завдання одразу після відповіді

function setPrevCard(card) {
  prevCard = card;
  $("btn-game-prev").hidden = !prevCard;
}

function showPrevCard() {
  if (!prevCard) return;
  const box = $("prev-content");
  box.innerHTML = "";
  box.appendChild(prevCard.cloneNode(true));
  $("prev-modal").hidden = false;
  $("btn-prev-close").focus();
}

function nextQuestion() {
  questionToken++;
  // щойно відповіли — зберігаємо картку, щоб її можна було переглянути
  if (lock && answersEl.children.length) {
    const copy = document.querySelector("#game .card").cloneNode(true);
    copy.querySelectorAll("[id]").forEach(el => el.removeAttribute("id"));
    setPrevCard(copy);
  }
  lock = false;
  answersEl.innerHTML = "";
  answersEl.classList.remove("frazeo-answers");
  sentenceEl.innerHTML = "";
  setFeedback("");

  if (training) {
    if (training.queue.length === 0) {
      finishTrainingRound();
      return;
    }
    if (training.game) { nextTrainingItem(); return; } // тренування групами для всіх ігор (groups.js)
    currentQuestion = training.queue.shift();
    if (currentGame === "inshomovni") renderInshomovni(); // тренування за групою (inshomovni.js)
    else renderNaholosy();
  } else if (currentGame === "naholosy") {
    if (remainingQuestions.length === 0) {
      remainingQuestions = [...marathonPool()];
    }
    const randomIndex = Math.floor(Math.random() * remainingQuestions.length);
    currentQuestion = remainingQuestions.splice(randomIndex, 1)[0];
    renderNaholosy();
  } else if (currentGame === "leksychna") {
    if (typeof leksLoad === "function") leksLoad(); else loadSentence(); // leks.js
  } else if (currentGame === "klychnyi") {
    if (remainingQuestions.length === 0) {
      // пройшов усі рівні — фінал «ти молодець», і все спочатку
      if (klychnyiAsked >= KLYCHNYI_TOTAL) klychnyiFinished = true;
      remainingQuestions = klychnyiQueue();
      klychnyiAsked = 0;
    }
    currentQuestion = remainingQuestions.shift();
    klychnyiAsked++;
    renderKlychnyi();
  } else if (currentGame === "frazeolohizmy") {
    if (remainingQuestions.length === 0) {
      remainingQuestions = frazeoQueue();
    }
    currentQuestion = makeFrazeoCard(remainingQuestions.shift());
    renderFrazeo();
  } else if (currentGame === "chyslivnyky") {
    if (remainingQuestions.length === 0) remainingQuestions = chysQueue();
    currentQuestion = remainingQuestions.shift();
    renderChyslivnyky();
  } else if (currentGame === "slovospoluch") {
    if (remainingQuestions.length === 0) remainingQuestions = slovoQueue();
    currentQuestion = remainingQuestions.shift();
    renderSlovospoluch(); // slovospoluch.js
  } else if (currentGame === "inshomovni") {
    if (remainingQuestions.length === 0) remainingQuestions = inshQueue();
    currentQuestion = remainingQuestions.shift();
    renderInshomovni(); // inshomovni.js
  } else if (currentGame === "inshe") {
    if (remainingQuestions.length === 0) remainingQuestions = insheQueue();
    currentQuestion = remainingQuestions.shift();
    renderInshe(); // inshe.js
  }
}

// ---------- Кличний відмінок ----------

// Початок речення залежно від типу слова (див. klychnyi-data.js)
const KLYCHNYI_NAMES = {
  m: ["Іване", "Андрію", "Тарасе", "Олексію", "Петре", "Миколо", "Богдане", "Сергію"],
  f: ["Маріє", "Олено", "Ганно", "Оксано", "Наталіє", "Ірино", "Галино", "Софіє"]
};

function pickOne(list, rand = Math.random) {
  return list[Math.floor(rand() * list.length)];
}

function klychnyiPrefix(frame) {
  if (frame.startsWith("@")) return frame.slice(1); // своє формулювання для слова
  switch (frame) {
    case "pf": return "Шановна пані";
    case "sm": return "Шановний";
    case "sf": return "Шановна";
    case "lm": return pickOne(["Любий", "Дорогий"]);
    case "lf": return pickOne(["Люба", "Дорога"]);
    case "bm": return `Любий ${pickOne(KLYCHNYI_NAMES.m)}`;
    case "bf": return `Люба ${pickOne(KLYCHNYI_NAMES.f)}`;
    case "oh": return "О";
    case "ln": return pickOne(["Любе", "Маленьке"]);
    default: return "Шановний пане";
  }
}

// Рівні: слова у klychnyi-data.js упорядковані від найважливіших (ЗНО/НМТ, найуживаніші)
// до найрідкісніших. Кожні 100 слів — рівень; усередині рівня порядок випадковий,
// тож перші 100 питань у будь-кого — з однакового переліку найпоширеніших слів.
// Рівні: 1 — слова 1–15, 2 — 16–35, 3 — 36–55, 4 — 56–75, 5 — 76–100, далі по 25 слів.
// Рівень короткий, щоб нагорода (новий рівень) була часто, а не раз на 100 слів.
const KLYCHNYI_LEVEL_BOUNDS = (() => {
  const b = [0, 15, 35, 55, 75, 100];
  while (b[b.length - 1] < KLYCHNYI_TOTAL) b.push(Math.min(b[b.length - 1] + 25, KLYCHNYI_TOTAL));
  return b;
})();
const KLYCHNYI_LEVELS = KLYCHNYI_LEVEL_BOUNDS.length - 1;
const KLYCHNYI_ONLINE_POOL = 300; // дуелі й онлайн — лише найуживаніші слова

// n — номер питання в грі (з 1) → рівень (з 1)
function klychnyiLevelOf(n) {
  for (let i = 1; i < KLYCHNYI_LEVEL_BOUNDS.length; i++) if (n <= KLYCHNYI_LEVEL_BOUNDS[i]) return i;
  return KLYCHNYI_LEVELS;
}

function klychnyiQueue() {
  const queue = [];
  for (let i = 1; i <= KLYCHNYI_LEVELS; i++) {
    const level = klychnyiData.slice(KLYCHNYI_LEVEL_BOUNDS[i - 1], KLYCHNYI_LEVEL_BOUNDS[i]);
    shuffleArray(level);
    queue.push(...level);
  }
  return queue;
}

// Прогрес у межах рівня: лінія, підпис «ще N до рівня …»
// done — скільки відповідей уже дано; рівень — той, у якому поточне питання
function updateKlychnyiLevelUI(done) {
  const level = klychnyiLevelOf(Math.max(1, klychnyiAsked));
  const start = KLYCHNYI_LEVEL_BOUNDS[level - 1];
  const end = KLYCHNYI_LEVEL_BOUNDS[level];
  const inLevel = Math.min(done, end) - start;
  progressEl.hidden = false;
  progressFill.style.width = `${Math.max(0, inLevel / (end - start)) * 100}%`;
  progressEl.classList.toggle("done", inLevel >= end - start);
  const left = end - start - inLevel;
  $("level-line").hidden = false;
  $("level-line").textContent = level === KLYCHNYI_LEVELS
    ? `🏁 Останній рівень ${level}! Ще ${left} — і ти пройшов усе`
    : `Рівень ${level} з ${KLYCHNYI_LEVELS} · ще ${left} до рівня ${level + 1}`;
}

function resolveKlychnyi(row, rand = Math.random) {
  const forms = row[2].split("|");
  const vocative = pickOne(forms, rand);
  const resolved = [row[0], row[1], vocative, ...row.slice(3)];
  resolved.alts = forms.filter(f => f !== vocative);
  return resolved;
}

// Варіанти відповіді: кличний, називний і неправильні форми (без повторів —
// у IV відміні кличний збігається з називним)
// Усі правильні форми слова (паралельні — через «|», напр. Олеже|Олегу)
function klychnyiForms(row) {
  return [...new Set([...row[2].split("|"), ...(row.alts || [])])];
}

// Варіанти відповіді: усі правильні форми + називний + неправильні.
// Слова на -а — завжди 4 варіанти з різними закінченнями: Оксана, Оксано, Оксану, Оксане.
function klychnyiOptions(row, rand = Math.random) {
  const [, nominative, , ...wrong] = row;
  const forms = klychnyiForms(row);
  let options;
  const stem = nominative.slice(0, -1);
  if (nominative.endsWith("а") && forms.every(f => f.startsWith(stem))) {
    options = [...new Set([...forms, ...["а", "о", "у", "е"].map(e => stem + e)])];
  } else {
    options = [...new Set([...forms, nominative, ...wrong])];
  }
  shuffleArray(options, rand);
  return options;
}

function renderKlychnyi() {
  const [frame] = currentQuestion;
  const forms = klychnyiForms(currentQuestion);
  const prefix = klychnyiPrefix(frame);
  questionEl.textContent = "Обери правильну форму звертання";
  hintEl.textContent = "Підказка: можна відповідати клавішами 1–4";
  if (!training) updateKlychnyiLevelUI(klychnyiAsked - 1);
  const level = klychnyiLevelOf(klychnyiAsked);
  const newLevel = !training && klychnyiAsked > 1 && klychnyiAsked - 1 === KLYCHNYI_LEVEL_BOUNDS[level - 1];

  // «Шановний пане ___!»
  sentenceEl.hidden = false;
  sentenceEl.innerHTML = "";
  const line = document.createElement("p");
  line.className = "address-line";
  line.append(`${prefix} `);
  const gap = document.createElement("span");
  gap.className = "address-gap";
  gap.textContent = "…";
  line.append(gap, "!");
  sentenceEl.appendChild(line);

  klychnyiOptions(currentQuestion).forEach(word => {
    const btn = document.createElement("button");
    btn.className = "answer";
    btn.dataset.word = word;
    btn.textContent = word;

    btn.onclick = () => {
      const isCorrect = forms.includes(word);
      handleAnswer(isCorrect, () => {
        gap.textContent = isCorrect ? word : forms.join(" / ");
        gap.classList.add(isCorrect ? "filled-ok" : "filled-fix");
        Array.from(answersEl.children).forEach(b => {
          if (forms.includes(b.dataset.word)) {
            b.classList.add("correct");
            if (!isCorrect) b.classList.add("blink");
          } else if (b !== btn) {
            b.classList.add("dim");
          }
        });
        if (!isCorrect) btn.classList.add("wrong");
        const others = forms.filter(f => f !== word);
        if (forms.length > 1 && others.length) {
          const note = document.createElement("p");
          note.className = "address-alt";
          note.textContent = `${isCorrect ? "Також правильно" : "Правильно"}: ${others.join(", ")}`;
          sentenceEl.appendChild(note);
        }
        // 💡 лайфхак до цього слова (klych-rules.js)
        if (typeof klychRule === "function") {
          const tip = document.createElement("div");
          tip.className = "klych-rule";
          tip.innerHTML = klychRuleHtml(klychRule(currentQuestion)); // структуровано: правило + приклади, закінчення помаранчеві
          sentenceEl.appendChild(tip);
        }
        if (!training) updateKlychnyiLevelUI(klychnyiAsked);
      }, { plain: true, prefix, chosen: word, correct: forms });
    };
    answersEl.appendChild(btn);
  });

  // Новий рівень — привітання (що вищий рівень, то яскравіше)
  if (newLevel) celebrateLevel(level);
  // ТИМЧАСОВО в беті: показати фінальне «ти молодець» уже після рівня 1
  if (!training && ((newLevel && level === 2 && BETA) || (klychnyiAsked === 1 && klychnyiFinished))) {
    klychnyiFinished = false;
    setTimeout(() => assembleWord("ТИ МОЛОДЕЦЬ"), newLevel ? 2600 : 600);
  }
}

// ---------- Фразеологізми ----------
// Картка: речення з пропуском і 3–5 фразеологізмів. Картки різної складності йдуть
// вперемішку: у складніших більше «родичів» правильного (зі спільним словом: руки, бити,
// грати…), як у завданнях НМТ. Фразеологізми зі схожим значенням (cl) ніколи не стоять разом.

const FRAZEO_BY_ID = typeof frazeoPhrases !== "undefined"
  ? Object.fromEntries(frazeoPhrases.map(ph => [ph.id, ph]))
  : {};
const FRAZEO_KINDS = [
  { options: 3, family: 0 },
  { options: 4, family: 2 },
  { options: 5, family: 4 }
];
const FRAZEO_DUEL = { options: 3, family: 1 };

// Частини фразеологізмів (part у frazeo-data.js). Гравець обирає частину на екрані режимів —
// вибір діє в усіх режимах: марафон, дуель, онлайн. "" — обидві частини.
// "nmt" — «💥 Усе з НМТ»: усі фразеологізми з НМТ (nmt: true, frazeo-nmt-data.js), "" — усі фразеологізми.
const FRAZEO_PARTS = [["nmt", "💥 Усе з НМТ"], ["1", "НМТ: частина 1"], ["2", "НМТ: частина 2"], ["", "Усі фразеологізми"]];
let frazeoPart = storageGet("frazeo_part") || "";
if (!FRAZEO_PARTS.some(([id]) => id === frazeoPart)) frazeoPart = "";

function frazeoPartOf(ph) {
  return String(ph.part || 1);
}

function frazeoPartName(part) {
  return (FRAZEO_PARTS.find(([id]) => id === part) || FRAZEO_PARTS.find(([id]) => id === ""))[1];
}

// Чи належить фразеологізм до вибраної групи («Усе з НМТ» — за позначкою nmt)
function frazeoInPart(ph, part) {
  if (!part) return true;
  return part === "nmt" ? Boolean(ph && ph.nmt) : frazeoPartOf(ph) === part;
}

// Речення вибраної частини
function frazeoRows(part = frazeoPart) {
  return part ? frazeoSentences.filter(row => frazeoInPart(FRAZEO_BY_ID[row[0]], part)) : frazeoSentences;
}

// Рекорд марафону — окремо для кожної частини (обидві — старий ключ best_frazeolohizmy)
function frazeoBestKey(part = frazeoPart) {
  return part ? `frazeolohizmy_p${part}` : "frazeolohizmy";
}

// Спершу по одному реченню на кожен фразеологізм, потім решта — усе вперемішку
function frazeoQueue() {
  const first = [];
  const rest = [];
  const seen = new Set();
  const all = [...frazeoRows()];
  shuffleArray(all);
  all.forEach(row => {
    if (seen.has(row[0])) rest.push(row);
    else { seen.add(row[0]); first.push(row); }
  });
  return [...first, ...rest];
}

// Чи стає фразеологізм у речення граматично: вид дієслова й доповнення («кому?», «кого?»…)
function frazeoFits(ph, req = "") {
  const tokens = req.split(",").filter(Boolean);
  const aspect = tokens.find(t => t === "i" || t === "p");
  const object = tokens.find(t => t !== "i" && t !== "p") || "";
  return (!aspect || ph.a === aspect) && (ph.o || [""]).includes(object);
}

// rand — своє джерело випадковості (в онлайн-спринті однакове в усіх гравців);
// part — вибрана частина: неправильні варіанти беремо з неї, а якщо їх замало — з усіх
function frazeoPos() { try { return JSON.parse(storageGet("frazeo_pos") || "{}"); } catch (e) { return {}; } }
function makeFrazeoCard(row, forDuel = false, rand = Math.random, part = frazeoPart) {
  const [id, text, req = ""] = row;
  const ph = FRAZEO_BY_ID[id];
  if (FRAZEO_S30 && FRAZEO_QUART[id] && ph) {
    // 💬 нова будова: наступне речення (у грі сам на сам) або випадкове (онлайн — однакове в усіх гравців), варіанти — четвірка
    const list = FRAZEO_S30.s[id];
    let k;
    if (rand === Math.random && !forDuel) {
      const pos = frazeoPos();
      k = (pos[id] || 0) % list.length;
      pos[id] = (pos[id] || 0) + 1;
      storageSet("frazeo_pos", JSON.stringify(pos));
    } else k = Math.floor(rand() * list.length);
    const others = FRAZEO_QUART[id].filter(x => x !== id).map(x => FRAZEO_BY_ID[x]).filter(Boolean);
    shuffleArray(others, rand);
    const options = [ph.p, ...others.slice(0, 3).map(o => o.p)];
    shuffleArray(options, rand);
    return { id, text: list[k], fill: ph.p, answer: ph.p, meaning: ph.m, options, nmt: Boolean(ph.nmt) };
  }
  // Ручні варіанти до цього речення (frazeo-options.js, за TASK_RULES.md) — мають перевагу над автоматичним добором
  const manual = typeof frazeoOptions !== "undefined" && frazeoOptions[text];
  if (manual && manual.length >= 2) {
    const pick = [...manual];
    shuffleArray(pick, rand);
    const options = [ph.p, ...pick.slice(0, forDuel ? FRAZEO_DUEL.options - 1 : pick.length)];
    shuffleArray(options, rand);
    return { id, text, fill: ph.p, answer: ph.p, meaning: ph.m, options, nmt: Boolean(ph.nmt) };
  }
  const cfg = forDuel ? FRAZEO_DUEL : pickOne(FRAZEO_KINDS, rand);
  // Лише варіанти того самого граматичного типу, щоб відповідь не можна було вгадати за формою:
  // дієслівні — з дієслівними, «як…» — з «як…», цитати («ні пари з вуст») — з цитатами й «як…»
  // іменникові («Авгієві стайні») й обставинні («ні світ ні зоря») — лише з такими самими (frazeo-nmt-data.js)
  const sameType = ph.t === "yak" ? o => o.t === "yak"
    : ph.t === "noun" ? o => o.t === "noun"
    : ph.t === "adv" ? o => o.t === "adv"
    : ph.t === "clause" ? o => o.t === "yak" || o.t === "clause"
    : o => !o.t && frazeoFits(o, req);
  const fitting = frazeoPhrases.filter(o => o.cl !== ph.cl && sameType(o));
  const inPart = part ? fitting.filter(o => frazeoInPart(o, part)) : fitting;
  const pool = inPart.length >= cfg.options - 1 ? inPart : fitting;
  // Обставинні — спершу з тим самим питанням (k: коли? / де? / чому? / як?), щоб кожен варіант
  // природно звучав у реченні; решта — спершу «родичі» за спільним словом (fam), як у НМТ
  const near = ph.t === "adv" ? o => o.k === ph.k : o => o.fam === ph.fam;
  const nearCount = ph.t === "adv" ? cfg.options - 1 : cfg.family;
  const family = pool.filter(near);
  const others = pool.filter(o => !near(o));
  shuffleArray(family, rand);
  shuffleArray(others, rand);
  const picked = family.slice(0, nearCount);
  // Добираємо до потрібної кількості: спершу з інших «родин», потім — з тієї самої
  [...others, ...family.slice(nearCount)].forEach(o => { if (picked.length < cfg.options - 1) picked.push(o); });
  const chosen = picked.slice(0, cfg.options - 1);
  frazeoFixStarts(ph, chosen, pool);
  const options = [ph.p, ...chosen.map(o => o.p)];
  shuffleArray(options, rand);
  return { id, text, fill: ph.p, answer: ph.p, meaning: ph.m, options, nmt: Boolean(ph.nmt) };
}

// Перше слово фразеологізму («мов», «наче», «ніби» = «як»)
function frazeoStart(phrase) {
  const w = phrase.toLowerCase().split(/\s+/)[0];
  return ["мов", "наче", "немов", "ніби", "неначе"].includes(w) ? "як" : w;
}

// Правило власника: якщо всі варіанти, крім одного, починаються з того самого слова, цей один
// надто впадає в око (його або точно обирають, або точно відкидають). Тоді міняємо його на
// «родича» з тим самим першим словом, а якщо такого немає — один із однакових на інший початок.
function frazeoFixStarts(ph, chosen, pool) {
  for (let step = 0; step < 4; step++) {
    const all = [ph, ...chosen];
    if (all.length < 3) return;
    const count = {};
    all.forEach(o => { const w = frazeoStart(o.p); count[w] = (count[w] || 0) + 1; });
    const major = Object.keys(count).find(w => count[w] === all.length - 1);
    if (!major) return;
    const used = new Set(all.map(o => o.p));
    const free = pool.filter(o => !used.has(o.p));
    const outlier = all.find(o => frazeoStart(o.p) !== major);
    const same = free.find(o => frazeoStart(o.p) === major);
    if (outlier !== ph && same) {
      chosen[chosen.indexOf(outlier)] = same;
      continue;
    }
    const other = free.find(o => frazeoStart(o.p) !== major && frazeoStart(o.p) !== frazeoStart(outlier.p))
      || free.find(o => frazeoStart(o.p) !== major);
    const victim = chosen.findIndex(o => frazeoStart(o.p) === major);
    if (!other || victim < 0) return;
    chosen[victim] = other;
  }
}

function frazeoMeaning(phrase) {
  const ph = frazeoPhrases.find(o => o.p === phrase);
  return ph ? ph.m : "";
}

function renderFrazeo() {
  const card = currentQuestion;
  questionEl.textContent = "Добери фразеологізм, що підходить за значенням";
  hintEl.textContent = `Підказка: можна відповідати клавішами 1–${card.options.length}`;

  sentenceEl.hidden = false;
  sentenceEl.innerHTML = "";
  // 💥 «було на іспиті» — лише після відповіді, біля правильного фразеологізму (власниця, 07.11.2026: це фразеологізм був на НМТ, не речення)
  const line = document.createElement("p");
  line.className = "frazeo-sentence";
  const [before, after] = card.text.split("___");
  const gap = document.createElement("span");
  gap.className = "address-gap gap-br";
  gap.textContent = "[...]"; // як на НМТ: помаранчеві квадратні дужки з трьома крапками, без пунктиру (власниця, 08.11.2026)
  line.append(before, gap, after);
  sentenceEl.appendChild(line);

  answersEl.classList.add("frazeo-answers");
  card.options.forEach(phrase => {
    const btn = document.createElement("button");
    btn.className = "answer frazeo-answer";
    btn.dataset.word = phrase;
    btn.textContent = phrase;
    btn.onclick = () => {
      const isCorrect = phrase === card.answer;
      handleAnswer(isCorrect, () => {
        gap.textContent = card.fill;
        gap.classList.add(isCorrect ? "filled-ok" : "filled-fix");
        Array.from(answersEl.children).forEach(b => {
          if (b.dataset.word === card.answer) {
            b.classList.add("correct");
            if (!isCorrect) b.classList.add("blink");
          } else if (b !== btn) {
            b.classList.add("dim");
          }
        });
        if (!isCorrect) btn.classList.add("wrong");
        // Значення — щоб запам'ятати, а не лише вгадати
        const note = document.createElement("p");
        note.className = "frazeo-meaning";
        const b = document.createElement("b");
        b.textContent = card.answer;
        note.append(b, ` — ${card.meaning}`);
        sentenceEl.appendChild(note);
        if (card.nmt) {
          const exam = document.createElement("p");
          exam.className = "exam-badge";
          exam.textContent = "💥 Цей фразеологізм був на іспиті";
          sentenceEl.appendChild(exam);
        }
        if (!isCorrect) {
          const wrong = document.createElement("p");
          wrong.className = "frazeo-meaning frazeo-meaning-wrong";
          const w = document.createElement("b");
          w.textContent = phrase;
          wrong.append(w, ` — ${frazeoMeaning(phrase)}`);
          sentenceEl.appendChild(wrong);
        }
        const next = document.createElement("button");
        next.className = "btn-secondary frazeo-next";
        next.textContent = "Далі →";
        next.addEventListener("click", skipWait);
        sentenceEl.appendChild(next);
      }, { frazeo: true, text: card.text.replace("___", card.fill), chosen: phrase });
    };
    answersEl.appendChild(btn);
  });
}

// ---------- Числівники (бета): дані — chyslivnyky-data.js ----------
function chysQueue() {
  const all = chyslivnykyData.map(row => ({ ...row, options: [row.a, ...row.w] }));
  shuffleArray(all);
  all.forEach(q => shuffleArray(q.options));
  return all;
}

function renderChyslivnyky() {
  const q = currentQuestion;
  questionEl.textContent = "Обери правильну форму";
  hintEl.textContent = `Підказка: можна відповідати клавішами 1–${q.options.length}`;

  sentenceEl.hidden = false;
  sentenceEl.innerHTML = "";
  const line = document.createElement("p");
  line.className = "frazeo-sentence";
  const [before, after] = q.t.split("___");
  const gap = document.createElement("span");
  gap.className = "address-gap";
  gap.textContent = "…";
  line.append(before, gap, after);
  sentenceEl.appendChild(line);

  answersEl.classList.add("frazeo-answers");
  q.options.forEach(form => {
    const btn = document.createElement("button");
    btn.className = "answer frazeo-answer";
    btn.dataset.word = form;
    btn.textContent = form;
    btn.onclick = () => {
      const isCorrect = form === q.a;
      handleAnswer(isCorrect, () => {
        gap.textContent = q.a;
        gap.classList.add(isCorrect ? "filled-ok" : "filled-fix");
        Array.from(answersEl.children).forEach(b => {
          if (b.dataset.word === q.a) {
            b.classList.add("correct");
            if (!isCorrect) b.classList.add("blink");
          } else if (b !== btn) {
            b.classList.add("dim");
          }
        });
        if (!isCorrect) btn.classList.add("wrong");
        // Правило — щоб запам'ятати, а не лише вгадати
        const note = document.createElement("p");
        note.className = "frazeo-meaning";
        note.textContent = q.r;
        sentenceEl.appendChild(note);
        if (q.also) {
          const alt = document.createElement("p");
          alt.className = "address-alt";
          alt.textContent = `Також правильно: ${q.also}`;
          sentenceEl.appendChild(alt);
        }
        const next = document.createElement("button");
        next.className = "btn-secondary frazeo-next";
        next.textContent = "Далі →";
        next.addEventListener("click", skipWait);
        sentenceEl.appendChild(next);
      }, { frazeo: true, text: q.t.replace("___", q.a), chosen: form });
    };
    answersEl.appendChild(btn);
  });
}

// ---------- Речення з бази ----------

async function fetchSentence() {
  let rows = await lbRequest("rpc/random_sentence", {
    method: "POST",
    body: JSON.stringify({ exclude: seenSentenceIds })
  });
  if (rows.length === 0 && seenSentenceIds.length > 0) {
    // Усі речення вже були — починаємо коло спочатку
    seenSentenceIds = [];
    rows = await lbRequest("rpc/random_sentence", {
      method: "POST",
      body: JSON.stringify({ exclude: [] })
    });
  }
  if (rows.length === 0) throw new Error("no sentences");
  return rows[0];
}

async function loadSentence() {
  const token = questionToken;
  lock = true;
  questionEl.textContent = "Чи є лексична помилка? Де саме? 👀";
  sentenceEl.hidden = false;

  if (!leaderboardEnabled) {
    sentenceEl.textContent = "Скоро тут з'являться речення 🙂";
    return;
  }

  sentenceEl.innerHTML = '<span class="loading">Завантажую речення…</span>';

  try {
    const row = await (sentencePrefetch || fetchSentence());
    sentencePrefetch = null;
    if (token !== questionToken) return;

    seenSentenceIds.push(row.id);
    currentQuestion = row.text;
    sentenceEl.innerHTML = "";
    lock = false;
    renderLeksychna();

    // Наступне речення завантажуємо заздалегідь, щоб не чекати
    sentencePrefetch = fetchSentence();
    sentencePrefetch.catch(() => { sentencePrefetch = null; });
  } catch (err) {
    sentencePrefetch = null;
    if (token !== questionToken) return;
    sentenceEl.textContent = "Не вдалося завантажити речення. Перевір інтернет.";
    const retry = document.createElement("button");
    retry.className = "ok-btn";
    retry.textContent = "Спробувати ще раз";
    retry.onclick = () => nextQuestion();
    answersEl.appendChild(retry);
  }
}

function renderNaholosy() {
  questionEl.textContent = "Обери правильний наголос";
  sentenceEl.hidden = true;

  const correctArray = Array.isArray(currentQuestion.correct)
    ? currentQuestion.correct
    : [currentQuestion.correct];

  const shuffledWords = [...currentQuestion.words];
  shuffleArray(shuffledWords);

  shuffledWords.forEach(word => {
    const btn = document.createElement("button");
    btn.className = "answer";
    btn.dataset.word = word;
    renderStressWord(btn, word);

    btn.onclick = () => {
      const isCorrect = correctArray.includes(word);
      handleAnswer(isCorrect, () => {
        Array.from(answersEl.children).forEach(b => {
          if (correctArray.includes(b.dataset.word)) {
            b.classList.add("correct");
            if (!isCorrect) b.classList.add("blink");
          } else if (b !== btn) {
            b.classList.add("dim");
          }
        });
        if (!isCorrect) btn.classList.add("wrong");
      }, { chosen: word, correct: correctArray });
    };
    answersEl.appendChild(btn);
  });
}

function renderLeksychna() {
  questionEl.textContent = "Чи є лексична помилка? Де саме? 👀";
  sentenceEl.hidden = false;

  // Слово правильне, якщо в реченні воно позначене зірочками (*слово*).
  // Так працюють і слова з дефісом (*мас*-*медіа*), і слова біля лапок («*Хватить*).
  // Тут без перемішування — зберігаємо порядок слів у реченні
  const sentence = currentQuestion;
  const buttons = [];

  sentence.split(" ").filter(token => token !== "").forEach(token => {
    const isMarked = token.includes("*");
    const text = token.replace(/\*/g, "");
    const btn = document.createElement("button");

    if (text.includes(OK_TOKEN)) {
      // Кнопка «помилок немає» — окремо під реченням
      btn.className = "ok-btn";
      btn.textContent = "✅ Помилок немає";
      answersEl.appendChild(btn);
    } else {
      btn.className = "chip";
      btn.textContent = text;
      sentenceEl.appendChild(btn);
      sentenceEl.appendChild(document.createTextNode(" "));
    }

    if (isMarked) btn.dataset.correct = "1";
    buttons.push(btn);

    btn.onclick = () => {
      handleAnswer(isMarked, () => {
        buttons.forEach(b => {
          if (b.dataset.correct === "1") {
            b.classList.add("correct");
            if (b.classList.contains("chip")) b.classList.add("strikethrough");
            if (!isMarked) b.classList.add("blink");
          }
        });
        if (!isMarked) btn.classList.add("wrong");
      }, { sentence });
    };
  });
}

// ---------- Святкування ----------

function celebrate() {
  track('all_words_done', {
    game_type: currentGame
  });
  $("celebrate-text").textContent =
    `${marathonPool().length} правильних відповідей — це всі слова зі списку! Можна грати далі й ставити рекорд.`;
  $("celebrate").hidden = false;
  launchConfetti();
}

function launchConfetti(count = 120) {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const box = $("confetti");
  const colors = ["#FF7900", "#4CAF50", "#ffffff", "#e6c200", "#d96700"];
  for (let i = 0; i < count; i++) {
    const piece = document.createElement("i");
    piece.style.left = `${Math.random() * 100}%`;
    piece.style.background = colors[i % colors.length];
    piece.style.animationDuration = `${2.5 + Math.random() * 2}s`;
    piece.style.animationDelay = `${Math.random() * 0.8}s`;
    piece.style.setProperty("--dx", `${(Math.random() - 0.5) * 200}px`);
    piece.style.setProperty("--rot", `${Math.random() * 720 - 360}deg`);
    box.appendChild(piece);
  }
  setTimeout(() => { box.innerHTML = ""; }, 5500);
}

// ---------- Іскорки від правильної відповіді ----------
function sparkleAt(target, count = 14) {
  if (!target || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const r = target.getBoundingClientRect();
  const colors = ["#FF7900", "#4CAF50", "#ffffff", "#e6c200"];
  for (let i = 0; i < count; i++) {
    const p = document.createElement("i");
    const star = i % 4 === 0;
    p.className = "sparkle" + (star ? " star" : "");
    if (star) p.textContent = "✦";
    p.style.left = `${r.left + r.width / 2 + (Math.random() - 0.5) * r.width * 0.6}px`;
    p.style.top = `${r.top + r.height / 2}px`;
    p.style.background = colors[i % colors.length];
    p.style.color = colors[i % colors.length];
    const angle = Math.random() * Math.PI * 2;
    const dist = 40 + Math.random() * 60;
    p.style.setProperty("--dx", `${Math.cos(angle) * dist}px`);
    p.style.setProperty("--dy", `${Math.sin(angle) * dist - 20}px`);
    p.style.animationDelay = `${Math.random() * 0.08}s`;
    document.body.appendChild(p);
    setTimeout(() => p.remove(), 900);
  }
}

// ---------- Новий рівень ----------
// Що вищий рівень, то яскравіше: більше конфеті, більший напис, на кожному 5-му — спалах
const LEVEL_CHEERS = [
  [2, "🎉", ["Перший рівень пройдено!", "Так тримати!"]],
  [5, "💪", ["Ти в ударі!", "Ще один рівень підкорено!", "Чудовий темп!"]],
  [10, "🔥", ["Вогонь!", "Ти справжній знавець!", "Ніщо тебе не зупинить!"]],
  [20, "🚀", ["Неймовірно!", "Злітаєш до вершини!", "Це рівень профі!"]],
  [30, "🏆", ["Легенда!", "Таких — одиниці!", "Майже вершина!"]],
  [Infinity, "👑", ["Король кличного!", "Абсолютний рекорд!", "Ти пройшов майже все!"]]
];

function celebrateLevel(level) {
  const [, emoji, phrases] = LEVEL_CHEERS.find(([upTo]) => level <= upTo);
  const milestone = level % 5 === 0 || level === KLYCHNYI_LEVELS;
  const box = document.createElement("div");
  box.className = "level-up" + (milestone ? " big" : "");
  box.style.setProperty("--power", Math.min(1 + level / 12, 3).toFixed(2));
  const icon = document.createElement("div");
  icon.className = "level-up-emoji";
  icon.textContent = milestone ? emoji.repeat(Math.min(3, 1 + Math.floor(level / 10))) : emoji;
  const title = document.createElement("div");
  title.className = "level-up-title";
  title.textContent = `Рівень ${level}!`;
  const sub = document.createElement("div");
  sub.className = "level-up-sub";
  sub.textContent = pickOne(phrases);
  box.append(icon, title, sub);
  document.body.appendChild(box);
  if (milestone) document.body.classList.add("level-flash");
  launchConfetti(Math.min(40 + level * 12, 320));
  const ms = 1500 + Math.min(level, 25) * 40 + (milestone ? 600 : 0);
  setTimeout(() => { box.classList.add("out"); document.body.classList.remove("level-flash"); }, ms);
  setTimeout(() => box.remove(), ms + 500);
}

// Фінал: кнопки відповідей на 3 секунди «складаються» в слова «ТИ МОЛОДЕЦЬ»
function assembleWord(text, ms = 3000) {
  const buttons = Array.from(answersEl.children);
  if (!buttons.length) return;
  const area = answersEl.getBoundingClientRect();
  const wasLocked = lock;
  lock = true;
  buttons.forEach(b => b.classList.add("assemble-hide"));
  const overlay = document.createElement("div");
  overlay.className = "assemble";
  overlay.style.left = `${area.left}px`;
  overlay.style.top = `${area.top}px`;
  overlay.style.width = `${area.width}px`;
  overlay.style.height = `${area.height}px`;
  const letters = [];
  // кожне слово — окремим рядком, щоб не розривалось
  text.split(" ").forEach(wordText => {
    const word = document.createElement("span");
    word.className = "assemble-word";
    [...wordText].forEach(ch => {
      const span = document.createElement("span");
      span.className = "assemble-letter";
      span.textContent = ch;
      word.appendChild(span);
      letters.push(span);
    });
    overlay.appendChild(word);
  });
  document.body.appendChild(overlay);
  // кожна літера вилітає з випадкової кнопки
  letters.forEach((span, i) => {
    const from = buttons[i % buttons.length].getBoundingClientRect();
    const r = span.getBoundingClientRect();
    const dx = from.left + Math.random() * from.width - (r.left + r.width / 2);
    const dy = from.top + Math.random() * from.height - (r.top + r.height / 2);
    span.style.transform = `translate(${dx}px, ${dy}px) scale(0.3) rotate(${Math.random() * 360 - 180}deg)`;
    span.style.opacity = "0";
    span.style.transitionDelay = `${i * 40}ms`;
  });
  requestAnimationFrame(() => requestAnimationFrame(() => {
    overlay.classList.add("in");
    letters.forEach(span => { span.style.transform = ""; span.style.opacity = "1"; });
  }));
  launchConfetti(220);
  setTimeout(() => {
    overlay.classList.add("out");
    buttons.forEach(b => b.classList.remove("assemble-hide"));
  }, ms);
  setTimeout(() => { overlay.remove(); lock = wasLocked; }, ms + 600);
}

// ---------- Кінець гри ----------

function gameOver() {
  track('game_over', {
    game_type: currentGame,
    final_score: score
  });

  // рекорд спецтеми — окремо (best_topic_<id>), у турнірну таблицю не йде
  const bestKey = marathonTopic ? `topic_${marathonTopic}`
    : currentGame === "frazeolohizmy" ? frazeoBestKey()
    : currentGame === "inshe" ? `inshe_${insheQuiz.id}`
    : currentGame === "leksychna" && typeof leksMode !== "undefined" && leksMode === "nmt" ? "leksnmt" : currentGame;
  const best = getBest(bestKey);
  const isRecord = !endless && score > best;
  if (isRecord) storageSet(`best_${bestKey}`, String(score));

  $("over-score").textContent = currentGame === "naholosy" ? `${score}/${marathonPool().length}`
    : currentGame === "klychnyi" ? `${score} · рівень ${klychnyiLevelOf(Math.max(1, klychnyiAsked))}`
    : currentGame === "frazeolohizmy" ? `${score}/${frazeoRows().length}`
    : currentGame === "chyslivnyky" ? `${score}/${CHYS_TOTAL}`
    : currentGame === "slovospoluch" ? `${score}/${slovoTotal()}`
    : currentGame === "inshomovni" ? `${score}/${INSH_TOTAL}`
    : currentGame === "inshe" && insheQuiz.flag !== "blitz" ? `${score}/${insheTotal()}`
    : score;
  $("over-best").textContent = endless
    ? "♾ Гра без обмеження життів: рекорд і турнірна таблиця не зараховуються"
    : marathonTopic
      ? `${isRecord && score > 0 ? "🎉 Новий рекорд! " : `Рекорд: ${Math.max(best, score)}. `}⭐ ${SPECIAL[marathonTopic].name} — без турнірної таблиці`
    : isRecord && score > 0
      ? "🎉 Новий рекорд!"
      : `Рекорд: ${Math.max(best, score)}`;

  renderMistakes();
  prepareSubmitForm();
  // 👥 Мій клас (myclass.js): результат — у таблицю класу
  if (typeof classOnGameOver === "function") classOnGameOver(currentGame, score, { endless, topic: marathonTopic || (currentGame === "inshe" ? "inshe" : "") }); // «Інше» — поки без таблиці класу
  showScreen("over");
}

function renderMistakes(items = mistakes, list = $("mistakes-list"), section = $("mistakes")) {
  list.innerHTML = "";
  section.hidden = items.length === 0;

  items.forEach(m => {
    const li = document.createElement("li");

    if (m.leks && typeof leksMistakeNode === "function") {
      li.appendChild(leksMistakeNode(m)); // «Лексична помилка: речення» (leks.js): речення з виправленням
    } else if (m.sentence) {
      // Лексична помилка: речення з підсвіченими словами-помилками
      const p = document.createElement("span");
      p.className = "sentence-mistake";
      m.sentence.split(" ").filter(t => t !== "").forEach(token => {
        const text = token.replace(/\*/g, "");
        const isOk = text.includes(OK_TOKEN);
        const node = token.includes("*") ? document.createElement("mark") : document.createElement("span");
        node.textContent = isOk ? (token.includes("*") ? "✅ помилок немає" : "") : text;
        p.appendChild(node);
        p.appendChild(document.createTextNode(" "));
      });
      li.appendChild(p);
    } else if (m.slovo) {
      // Словосполучення: неправильне -> правильне (slovospoluch.js)
      li.append(...slovoMistakeNodes(m));
    } else if (m.frazeo) {
      // Фразеологізми: речення з правильним фразеологізмом і що означає обраний
      const right = document.createElement("span");
      right.className = "right plain-right";
      right.textContent = m.text;
      const was = document.createElement("span");
      was.className = "was frazeo-was";
      was.textContent = m.chosen;
      li.append(right, was);
    } else if (m.plain) {
      // Кличний відмінок: обрана форма -> правильна
      const was = document.createElement("span");
      was.className = "was";
      was.textContent = m.chosen;
      const arrow = document.createElement("span");
      arrow.className = "arrow";
      arrow.textContent = "→";
      const right = document.createElement("span");
      right.className = "right plain-right";
      right.textContent = `${m.prefix} ${m.correct.join(" / ")}!`;
      li.append(was, arrow, right);
    } else {
      // Наголоси: обране слово -> правильне
      const was = document.createElement("span");
      was.className = "was";
      was.textContent = m.chosen.replace(/\s*\(.*\)\s*$/, "");
      const arrow = document.createElement("span");
      arrow.className = "arrow";
      arrow.textContent = "→";
      const right = document.createElement("span");
      right.className = "right";
      m.correct.forEach((word, i) => {
        if (i > 0) right.appendChild(document.createTextNode(" / "));
        renderStressWord(right, word);
      });
      li.append(was, arrow, right);
    }
    list.appendChild(li);
  });
}

// ---------- Тренування за групами ----------

const ALPHABET = "абвгґдеєжзиіїйклмнопрстуфхцчшщьюя";

function firstLetter(q) {
  return [].concat(q.correct)[0][0].toLowerCase();
}

// Ділимо слова за абеткою на групи по ~15 так, щоб межі груп
// по можливості збігалися з межами літер
function buildGroups(data, target = 15, min = 10, max = 19) {
  const sorted = data
    .map((q, i) => ({ q, i, letter: firstLetter(q) }))
    .sort((x, y) => ALPHABET.indexOf(x.letter) - ALPHABET.indexOf(y.letter) || x.i - y.i);

  const n = sorted.length;
  const best = new Array(n + 1).fill(Infinity);
  const prev = new Array(n + 1).fill(-1);
  best[0] = 0;
  for (let end = 1; end <= n; end++) {
    for (let size = min; size <= max && size <= end; size++) {
      const start = end - size;
      if (best[start] === Infinity) continue;
      const atBoundary = end === n || sorted[end].letter !== sorted[end - 1].letter;
      const cost = best[start] + (size - target) ** 2 + (atBoundary ? 0 : 12);
      if (cost < best[end]) {
        best[end] = cost;
        prev[end] = start;
      }
    }
  }

  const ranges = [];
  for (let end = n; end > 0; end = prev[end]) ranges.unshift([prev[end], end]);

  const groups = ranges.map(([start, end]) => {
    const items = sorted.slice(start, end);
    const first = items[0].letter.toUpperCase();
    const last = items[items.length - 1].letter.toUpperCase();
    return { label: first === last ? first : `${first}–${last}`, words: items.map(x => x.q) };
  });

  // Однакові назви (наприклад, дві групи на «П») нумеруємо
  const total = {};
  groups.forEach(g => { total[g.label] = (total[g.label] || 0) + 1; });
  const seen = {};
  groups.forEach(g => {
    if (total[g.label] > 1) {
      seen[g.label] = (seen[g.label] || 0) + 1;
      g.label += ` (${seen[g.label]})`;
    }
  });
  return groups;
}

const GROUPS = buildGroups(naholosyData);

// ---------- Спецтеми за посиланням (вебінари) — topics.js ----------
// Доступ: Telegram-користувачі, які перейшли за посиланням до дедлайну (функція topic-access),
// а також власник (браузер, де відкрито сторінку статистики з паролем).
const SPECIAL = window.SPECIAL_TOPICS || {};
const TOPIC_WORDS = {};
Object.entries(SPECIAL).forEach(([id, t]) => {
  TOPIC_WORDS[id] = naholosyData.filter(q => t.match([].concat(q.correct)[0].toLowerCase(), q));
});
// Групи тренування для спецтем мають від'ємні номери: -1, -2, …
const TOPIC_GROUPS = Object.keys(SPECIAL).map(id => ({ topic: id, label: SPECIAL[id].name, icon: SPECIAL[id].icon, words: TOPIC_WORDS[id] }));
const isOwner = Boolean(storageGet("stats_password"));
let topicAccess = new Set();
try { topicAccess = new Set(JSON.parse(storageGet("topic_access") || "[]")); } catch (e) { /* порожньо */ }
let currentTopic = "";  // вибрана тема для марафону й онлайн-ігор ("" — усі слова)
let marathonTopic = ""; // тема поточного марафону

// Слова марафону: усі або вибраної спецтеми
function marathonPool() {
  return marathonTopic ? TOPIC_WORDS[marathonTopic] : naholosyData;
}

function hasTopic(id) {
  return Boolean(SPECIAL[id]) && (isOwner || topicAccess.has(id));
}

function availableTopics() {
  return Object.keys(SPECIAL).filter(hasTopic);
}

function groupAt(i) {
  return i >= 0 ? GROUPS[i] : TOPIC_GROUPS[-1 - i];
}

function groupKey(i) {
  return `train_naholosy_${groupAt(i).label}`;
}

// 1 звертання, 2 звертання, 5 звертань
// Поділ на рівні частини, не більше max у кожній (власниця, 08.11.2026: 18 при межі 15 → 9 + 9, а не 15 + 3)
function splitEven(arr, max) {
  const k = Math.max(1, Math.ceil(arr.length / max)), base = Math.floor(arr.length / k), extra = arr.length % k, out = [];
  let i = 0;
  for (let p = 0; p < k; p++) { const n = base + (p < extra ? 1 : 0); out.push(arr.slice(i, i + n)); i += n; }
  return out.filter(x => x.length);
}
function plural(n, one, few, many) {
  const n10 = n % 10, n100 = n % 100;
  if (n10 === 1 && n100 !== 11) return one;
  if (n10 >= 2 && n10 <= 4 && (n100 < 12 || n100 > 14)) return few;
  return many;
}

// Екран режимів (марафон / групи / дуель) для гри з вибором слів
let modesGame = "naholosy";

// Вибір слів для марафону й онлайн-ігор: «Усі слова» або спецтема (якщо є доступ)
function renderTopicPicker() {
  const box = $("topic-picker");
  if (modesGame === "frazeolohizmy") {
    renderFrazeoPartPicker(box);
    return;
  }
  if (modesGame === "slovospoluch") {
    renderSlovoGroupPicker(box); // slovospoluch.js: галочки груп
    return;
  }
  const topics = modesGame === "naholosy" ? availableTopics() : [];
  if (!topics.includes(currentTopic)) currentTopic = "";
  box.hidden = !topics.length;
  box.innerHTML = "";
  if (topics.length) {
    const hint = document.createElement("p");
    hint.className = "topic-hint";
    hint.textContent = "Слова для марафону й онлайн-ігор:";
    box.appendChild(hint);
    [["", "Усі слова"], ...topics.map(id => [id, `${SPECIAL[id].icon} ${SPECIAL[id].name}`])].forEach(([id, text]) => {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "topic-chip" + (id === currentTopic ? " on" : "");
      b.textContent = text;
      b.addEventListener("click", () => { currentTopic = id; renderTopicPicker(); });
      box.appendChild(b);
    });
  }
  if (modesGame === "naholosy") {
    const n = currentTopic ? TOPIC_WORDS[currentTopic].length : TOTAL_WORDS;
    $("marathon-desc").textContent = currentTopic
      ? `${SPECIAL[currentTopic].name}: ${n} ${plural(n, "слово", "слова", "слів")} · 3 життя · без турнірної таблиці`
      : `Усі ${TOTAL_WORDS} слова · 3 життя · турнірна таблиця`;
    $("marathon-best").dataset.best = currentTopic ? `topic_${currentTopic}` : "naholosy";
    renderBestScores();
  }
}

// «Фразеологізми»: вибір частини (НМТ: частина 1 / 2 / обидві) — для всіх режимів
function renderFrazeoPartPicker(box) {
  box.hidden = false;
  box.innerHTML = "";
  const hint = document.createElement("p");
  hint.className = "topic-hint";
  hint.textContent = "Які фразеологізми тренувати (для всіх режимів):";
  box.appendChild(hint);
  FRAZEO_PARTS.forEach(([id, text]) => {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "topic-chip" + (id === frazeoPart ? " on" : "");
    b.textContent = text;
    b.addEventListener("click", () => {
      frazeoPart = id;
      storageSet("frazeo_part", id);
      renderTopicPicker();
    });
    box.appendChild(b);
  });
  const n = frazeoRows().length;
  $("marathon-desc").textContent = `${frazeoPartName(frazeoPart)}: ${n} ${plural(n, "речення", "речення", "речень")}, як у НМТ · 3–5 варіантів · 3 життя`;
  $("marathon-best").dataset.best = frazeoBestKey();
  renderBestScores();
}

function showModes(game = modesGame) {
  clearTimeout(nextTimer);
  training = null;
  questionToken++;
  modesGame = game;

  const isNaholosy = game === "naholosy";
  const isFrazeo = game === "frazeolohizmy";
  const isSlovo = game === "slovospoluch";
  const isInshe = game === "inshe"; // «📂 Інше» (inshe.js): поточний тренажер — insheQuiz
  const isChys = game === "chyslivnyky" || isInshe;
  $("modes-title").textContent = isInshe ? `${insheQuiz.icon} ${insheQuiz.name}` : isNaholosy ? "Наголоси" : isFrazeo ? "Фразеологізми"
    : isSlovo ? "Словосполучення" : isChys ? "Числівники" : "Кличний відмінок";
  $("btn-modes-back").textContent = isInshe ? "‹ Назад" : "‹ Меню";
  if ($("ist-level")) $("ist-level").hidden = true; // перемикач рівня дат (inshe.js) — лише в «Історії України»
  $("marathon-desc").textContent = isNaholosy
    ? `Усі ${TOTAL_WORDS} слова · 3 життя · турнірна таблиця`
    : isInshe ? `Усі ${insheQuiz.cards.length} ${plural(insheQuiz.cards.length, "завдання", "завдання", "завдань")} · 3 життя`
    : isChys ? `Усі ${CHYS_TOTAL} завдань · 3 життя`
    : isFrazeo
      ? (FRAZEO_S30 ? `${FRAZEO_TOTAL} ${plural(FRAZEO_TOTAL, "фразеологізм", "фразеологізми", "фразеологізмів")} · щоразу нові речення · 3 життя` : `${FRAZEO_TOTAL} речень, як у НМТ · 3–5 варіантів · 3 життя`)
      : `Усі ${KLYCHNYI_TOTAL} ${plural(KLYCHNYI_TOTAL, "звертання", "звертання", "звертань")} · 3 життя · турнірна таблиця`;
  $("marathon-best").dataset.best = isInshe ? `inshe_${insheQuiz.id}` : game;
  // PRO-марафон без життів: поки замочки вимкнено — у беті для всіх
  $("btn-marathon-endless").hidden = !((isNaholosy || isSlovo) && (PRO_ENABLED ? isPro : BETA_OPEN));
  // 🎯 Тренування групами — в усіх іграх з групами (groups.js)
  $("groups-panel").hidden = typeof TRAIN_GAMES === "undefined" || !TRAIN_GAMES[game];
  const groupsDesc = $("groups-panel").querySelector(".mode-desc");
  if (groupsDesc) groupsDesc.textContent = game === "klychnyi"
    ? "Групи за закінченням, без життів: тренуй скільки хочеш, наприкінці — точність і робота над помилками"
    : "Групи без життів, з роботою над помилками · можна кілька груп одразу";
  // Онлайн-режими й дуель — не в «Числівниках»
  $("online-panel").hidden = isChys;
  document.querySelector('#modes [data-panel="duel"]').hidden = isChys;
  $("online-desc").textContent = "Кожен на своєму телефоні: дуель, спринт, гра для класу";
  $("online-duel-desc").textContent = isFrazeo
    ? "Удвох. Однакове речення — хто правильно й швидше добере фразеологізм, тому бал"
    : isSlovo ? "Удвох. Однакове словосполучення — хто правильно й швидше, тому бал"
    : isNaholosy ? "Удвох. Однакове слово — хто правильно й швидше, тому бал"
      : "Удвох. Однакове звертання — хто правильно й швидше, тому бал";
  $("online-sprint-title").textContent = isFrazeo ? "⏱ Спринт 2 хвилини" : "⏱ Спринт 60 секунд";
  $("online-sprint-desc").textContent = isFrazeo
    ? "2–10 гравців. Хто добере більше фразеологізмів за 2 хвилини"
    : "2–10 гравців. Хто дасть більше правильних відповідей за хвилину";
  $("duel-desc").textContent = `Один екран, 2–4 гравці: хто перший ${isNaholosy ? "натисне правильний наголос" : isFrazeo ? "добере фразеологізм" : isSlovo ? "правильно оцінить словосполучення" : "натисне правильну форму"}`;

  if (typeof renderTrainPicker === "function") renderTrainPicker(game, $("group-list"), $("groups-progress")); // groups.js
  if (typeof renderPlayGroups === "function") renderPlayGroups(game); // groups.js: групи для дуелі й онлайну
  renderTopicPicker();
  setOpenPanel(storageGet("modes_open") || "", false);
  renderBestScores();
  // номери режимів — по порядку видимих (немає тренування → марафон «1»)
  let modeK = 0;
  document.querySelectorAll("#modes .mode-panel").forEach(sec => { const n = sec.querySelector(".mode-num"); if (n && !sec.hidden) n.textContent = String(++modeK); });
  showScreen("modes");
}

// Режими згортаються: відкритий лише один, щоб не гортати довгий екран
function setOpenPanel(name, scroll = true) {
  document.querySelectorAll("#modes .collapsible").forEach(panel => {
    const open = panel.dataset.panel === name && !panel.hidden;
    panel.classList.toggle("open", open);
    panel.querySelector(".mode-toggle").setAttribute("aria-expanded", String(open));
    if (open && scroll) {
      requestAnimationFrame(() => panel.scrollIntoView({ behavior: "smooth", block: "start" }));
    }
  });
  storageSet("modes_open", name);
}

document.querySelectorAll("#modes .mode-toggle").forEach(btn => {
  btn.addEventListener("click", () => {
    const panel = btn.closest(".collapsible");
    setOpenPanel(panel.classList.contains("open") ? "" : panel.dataset.panel);
  });
});

function renderGroups() {
  const list = $("group-list");
  list.innerHTML = "";
  // спецтеми — внизу, після звичайних груп
  const items = [
    ...GROUPS.map((g, i) => [g, i]),
    ...TOPIC_GROUPS.map((g, k) => [g, -1 - k]).filter(([g]) => hasTopic(g.topic))
  ];
  items.forEach(([group, i]) => {
    const best = Number(storageGet(groupKey(i))) || 0;
    const mastered = best >= group.words.length;

    const btn = document.createElement("button");
    btn.className = "group-tile" + (mastered ? " mastered" : best > 0 ? " tried" : "");
    if (best > 0 && !mastered) {
      // Колір від жовтого до зеленого: що кращий результат, то зеленіше
      const ratio = best / group.words.length;
      btn.style.setProperty("--p", ratio.toFixed(2));
      btn.style.setProperty("--h", Math.round(45 + 55 * ratio));
    }

    if (group.topic) btn.classList.add("topic-tile");
    const label = document.createElement("span");
    label.className = "group-label";
    label.textContent = group.topic ? `${group.icon} ${group.label}` : group.label;

    const info = document.createElement("span");
    info.className = "group-info";
    info.textContent = mastered
      ? "✓ вивчено"
      : best > 0 ? `${Math.round((best / group.words.length) * 100)}%` : `${group.words.length} слів`;

    btn.append(label, info);
    btn.addEventListener("click", () => startTraining(i));
    list.appendChild(btn);
  });

  const done = GROUPS.filter((g, i) => (Number(storageGet(groupKey(i))) || 0) >= g.words.length).length;
  $("groups-progress").textContent = done ? `✓ вивчено ${done} з ${GROUPS.length} груп` : "";
}

function startTraining(groupIndex) {
  if (typeof startGroupTraining === "function") { startGroupTraining("naholosy", [groupKey(groupIndex)]); return; } // groups.js
  clearTimeout(nextTimer);
  endless = false;
  const group = groupAt(groupIndex);
  const queue = [...group.words];
  shuffleArray(queue);

  currentGame = "naholosy";
  streak = 0;
  training = {
    groupIndex,
    round: 1,
    queue,
    total: queue.length,
    done: 0,
    firstTry: 0,
    roundMistakes: []
  };
  track('training_start', { game_type: currentGame, group: group.label });

  $("btn-menu").textContent = "‹ Групи";
  $("test-note").hidden = true;
  hintEl.textContent = "Підказка: можна відповідати клавішами 1, 2, 3";
  updateUI();
  setPrevCard(null);
  showScreen("game");
  nextQuestion();
}

function startMistakesRound() {
  const unique = [];
  training.roundMistakes.forEach(m => {
    if (!unique.includes(m.question)) unique.push(m.question);
  });
  shuffleArray(unique);
  training.round++;
  training.queue = unique;
  training.total = unique.length;
  training.done = 0;
  training.roundMistakes = [];
  streak = 0;
  updateUI();
  setPrevCard(null);
  showScreen("game");
  nextQuestion();
}

function finishTrainingRound() {
  if (training && training.game) { finishGroupTraining(); return; } // groups.js
  if (currentGame === "inshomovni") { finishInshTraining(); return; } // inshomovni.js
  const group = groupAt(training.groupIndex);
  const wrong = training.roundMistakes;

  if (training.round === 1) {
    const best = Number(storageGet(groupKey(training.groupIndex))) || 0;
    if (training.firstTry > best) storageSet(groupKey(training.groupIndex), String(training.firstTry));
    track('training_done', {
      game_type: currentGame,
      group: group.label,
      first_try: training.firstTry,
      total: group.words.length
    });
  }

  $("train-title").textContent = training.round === 1
    ? (group.topic ? `${group.icon} ${group.label}` : `Група ${group.label}`)
    : wrong.length === 0 ? "Помилки виправлено 💪" : "Ще трохи!";

  if (training.round === 1) {
    $("train-score").textContent = `${training.firstTry}/${group.words.length}`;
    $("train-sub").textContent = wrong.length === 0
      ? "Без жодної помилки! 🎉"
      : "правильно з першого разу";
  } else {
    $("train-score").textContent = wrong.length === 0 ? "✓" : `${training.total - wrong.length}/${training.total}`;
    $("train-sub").textContent = wrong.length === 0
      ? "Усі слова групи тепер правильні"
      : "Ці слова ще раз — і готово";
  }

  const fixBtn = $("btn-fix-mistakes");
  const uniqueCount = new Set(wrong.map(m => m.question)).size;
  fixBtn.hidden = wrong.length === 0;
  fixBtn.textContent = `🔁 Робота над помилками (${uniqueCount})`;

  const nextBtn = $("btn-train-next");
  const hasNext = training.groupIndex >= 0 && training.groupIndex + 1 < GROUPS.length;
  nextBtn.hidden = wrong.length > 0 || !hasNext;
  if (hasNext) nextBtn.textContent = `Наступна група: ${GROUPS[training.groupIndex + 1].label} →`;

  renderMistakes(wrong, $("train-mistakes-list"), $("train-mistakes"));
  if (wrong.length === 0 && training.round === 1) launchConfetti();
  showScreen("trainOver");
}

// ---------- Дуель на одному екрані (2–4 гравці) ----------

const DUEL_TARGETS = [10, 20, 50];
const TG_LINK = "https://t.me/+GkBggS477tlmODQy";

// Командні кольори: команда 1 — помаранчеві відтінки, команда 2 — бірюзові
const TEAM_COLORS = [["#FF7900", "#ffa24d"], ["#2fb8a6", "#74d9cb"]];

const DUEL_PLAYERS = [
  { name: "Гравець 1", color: "#FF7900", keys: ["1", "2", "3"] },
  { name: "Гравець 2", color: "#2fb8a6", keys: ["8", "9", "0"] },
  { name: "Гравець 3", color: "#a77bf3", keys: ["q", "w", "e"] },
  { name: "Гравець 4", color: "#4c9bff", keys: ["i", "o", "p"] }
];

// Налаштування дуелі запам'ятовуються
const coarsePointer = window.matchMedia("(pointer: coarse)").matches;
const duelSetup = {
  n: [2, 3, 4].includes(Number(storageGet("duel_n"))) ? Number(storageGet("duel_n")) : 2,
  layout: ["table", "wall"].includes(storageGet("duel_layout"))
    ? storageGet("duel_layout")
    : (coarsePointer ? "table" : "wall"),
  teams: storageGet("duel_teams") === "1",
  target: DUEL_TARGETS.includes(Number(storageGet("duel_target"))) ? Number(storageGet("duel_target")) : 10
};
let duel = null;

function teamsOn(n = duelSetup.n, teams = duelSetup.teams) {
  return n === 4 && teams;
}

// Команда гравця: на столі — нижня пара проти верхньої, на стіні — ліва проти правої
function teamOf(i) {
  return i < 2 ? 0 : 1;
}

function playerColor(i, teams) {
  return teams ? TEAM_COLORS[teamOf(i)][i % 2] : DUEL_PLAYERS[i].color;
}

function playerName(i, teams) {
  return teams ? `Команда ${teamOf(i) + 1}` : DUEL_PLAYERS[i].name;
}

// Як тримати пристрій для кожної розкладки
function bestOrientation(n, layout) {
  return layout === "table" && n !== 3 ? "portrait" : "landscape";
}

function renderDuelSetup() {
  document.querySelectorAll("#duel-players button").forEach(b => {
    const on = Number(b.dataset.n) === duelSetup.n;
    b.classList.toggle("active", on);
    b.setAttribute("aria-checked", on);
  });
  document.querySelectorAll("#duel-layout button").forEach(b => {
    const on = b.dataset.layout === duelSetup.layout;
    b.classList.toggle("active", on);
    b.setAttribute("aria-checked", on);
  });
  document.querySelectorAll("#duel-target button").forEach(b => {
    const on = Number(b.dataset.target) === duelSetup.target;
    b.classList.toggle("active", on);
    b.setAttribute("aria-checked", on);
  });

  const { n, layout } = duelSetup;
  const teams = teamsOn();
  $("duel-teams-row").hidden = n !== 4;
  document.querySelectorAll("#duel-teams button").forEach(b => {
    const on = (b.dataset.teams === "1") === duelSetup.teams;
    b.classList.toggle("active", on);
    b.setAttribute("aria-checked", on);
  });

  const orientation = bestOrientation(n, layout) === "portrait" ? "вертикально" : "горизонтально";
  let hint = layout === "wall"
    ? `${n} колонки поруч, усі прямо — для дошки, великої сенсорної панелі чи екрана ${orientation}.`
    : n === 2
      ? "Телефон чи планшет лежить між гравцями вертикально: верхня половина перевернута."
      : n === 3
        ? "Телефон чи планшет лежить горизонтально: двоє гравців з одного боку, третій — навпроти (середня частина перевернута)."
        : "«2 на 2»: телефон чи планшет лежить вертикально, верхні дві частини перевернуті.";
  if (teams) {
    hint += layout === "wall"
      ? " Команда 1 — ліві колонки, команда 2 — праві. Бал спільний: хто з пари перший."
      : " Команда 1 — нижня пара, команда 2 — верхня. Бал спільний: хто з пари перший.";
  }
  $("duel-hint").textContent = hint;

  // Мініатюра поділу екрана
  const preview = $("duel-preview");
  preview.className = `duel-preview ${layoutClass(n, layout)} ${bestOrientation(n, layout)}`;
  preview.innerHTML = "";
  for (let i = 0; i < n; i++) {
    const cell = document.createElement("span");
    cell.className = "pv-cell" + (isMirrored(i, n, layout) ? " flipped" : "");
    cell.style.setProperty("--pc", playerColor(i, teams));
    cell.style.gridArea = `p${i}`;
    cell.textContent = i + 1;
    preview.appendChild(cell);
  }
  const bar = document.createElement("span");
  bar.className = "pv-bar";
  bar.style.gridArea = "bar";
  preview.appendChild(bar);
}

function layoutClass(n, layout) {
  return `layout-${layout} n-${n}`;
}

// Хто сидить навпроти й бачить перевернутий екран
function isMirrored(i, n, layout) {
  if (layout !== "table") return false;
  if (n === 2) return i === 1;
  if (n === 3) return i === 1; // середній гравець сидить навпроти двох крайніх
  return i >= 2;
}

function showKeyHints() {
  return duelSetup.layout === "wall" && window.matchMedia("(hover: hover)").matches;
}

function startDuel() {
  clearTimeout(nextTimer);
  training = null;
  const { n, layout } = duelSetup;
  const teams = teamsOn();
  duel = {
    game: modesGame,
    n,
    layout,
    teams,
    target: duelSetup.target,
    // у командній грі рахунок ведеться по командах
    scores: new Array(teams ? 2 : n).fill(0),
    locked: new Array(n).fill(false),
    queue: [],
    resolved: false,
    question: null,
    over: false
  };
  track('duel_start', { game_type: modesGame, players: n, layout, teams, target: duelSetup.target });
  buildDuelBoard();
  showScreen("duel");
  checkDuelOrientation();
  nextDuelRound();
}

function buildDuelBoard() {
  const board = $("duel-board");
  board.className = `duel-board ${layoutClass(duel.n, duel.layout)}`;
  board.innerHTML = "";

  for (let i = 0; i < duel.n; i++) {
    const pane = document.createElement("section");
    pane.className = "duel-pane" + (isMirrored(i, duel.n, duel.layout) ? " flipped" : "");
    pane.dataset.player = i;
    pane.style.gridArea = `p${i}`;
    pane.style.setProperty("--pc", playerColor(i, duel.teams));
    pane.innerHTML = `
      <div class="duel-head">
        <span class="duel-name"></span>
        <span class="duel-score">0</span>
      </div>
      <p class="duel-lead" hidden></p>
      <div class="duel-answers"></div>
      <p class="duel-status"></p>`;
    pane.querySelector(".duel-name").textContent = playerName(i, duel.teams);
    board.appendChild(pane);
  }

  const bar = document.createElement("div");
  bar.className = "duel-bar";
  bar.style.gridArea = "bar";
  bar.innerHTML = `
    <button class="icon-btn duel-exit" aria-label="Вийти з дуелі">✕</button>
    <a class="duel-brand" href="${TG_LINK}" target="_blank" rel="noopener" data-tg-link>
      <img src="logo.png" alt="" width="26" height="26">@ukr_movych
    </a>
    <span class="duel-goal">до ${duel.target}</span>
    <button class="btn-primary btn-small duel-again" hidden>Ще раз</button>`;
  bar.querySelector(".duel-exit").addEventListener("click", exitDuel);
  bar.querySelector(".duel-again").addEventListener("click", startDuel);
  board.appendChild(bar);

  // Підказка повернути пристрій, якщо він тримається не так
  const want = bestOrientation(duel.n, duel.layout);
  const rotate = document.createElement("div");
  rotate.className = `duel-rotate want-${want}`;
  rotate.hidden = true;
  rotate.innerHTML = `
    <div class="rotate-phone" aria-hidden="true"><span>📱</span></div>
    <p class="rotate-title">Поверни пристрій ${want === "portrait" ? "вертикально" : "горизонтально"}</p>
    <p class="rotate-sub">Так усім гравцям буде зручно й нічого не обріжеться</p>
    <button class="btn-secondary btn-small rotate-skip">Грати так</button>`;
  rotate.querySelector(".rotate-skip").addEventListener("click", () => {
    duel.ignoreOrientation = true;
    rotate.hidden = true;
  });
  board.appendChild(rotate);
}

function duelPane(i) {
  return document.querySelector(`.duel-pane[data-player="${i}"]`);
}

function scoreSlot(i) {
  return duel.teams ? teamOf(i) : i;
}

function updateDuelScores() {
  for (let i = 0; i < duel.n; i++) {
    duelPane(i).querySelector(".duel-score").textContent = duel.scores[scoreSlot(i)];
  }
}

function setDuelStatus(i, text, kind) {
  const el = duelPane(i).querySelector(".duel-status");
  el.textContent = text;
  el.className = "duel-status" + (kind ? ` ${kind}` : "");
}

// Питання дуелі: варіанти, правильні відповіді, (для кличного) початок речення
function makeDuelRound(question) {
  if (duel.game === "frazeolohizmy") {
    const card = makeFrazeoCard(question, true);
    return {
      lead: card.text,
      fill: card.fill,
      words: card.options,
      correct: [card.answer],
      render: (btn, word) => { btn.textContent = word; }
    };
  }
  if (duel.game === "slovospoluch") {
    // Словосполучення: «Правильно» / «Неправильно» в незмінному порядку
    const card = SLOVO_CARDS[question];
    return {
      lead: card.text,
      plainLead: true,
      fixed: true,
      card,
      words: [...SLOVO_ANSWERS],
      correct: [card.ok ? SLOVO_ANSWERS[0] : SLOVO_ANSWERS[1]],
      render: (btn, word) => { btn.textContent = word; }
    };
  }
  if (duel.game === "klychnyi") {
    return {
      lead: klychnyiPrefix(question[0]),
      words: klychnyiOptions(question),
      correct: klychnyiForms(question),
      render: (btn, word) => { btn.textContent = word; }
    };
  }
  const words = [...question.words];
  shuffleArray(words);
  return {
    lead: null,
    words,
    correct: Array.isArray(question.correct) ? question.correct : [question.correct],
    render: renderStressWord
  };
}

function nextDuelRound() {
  if (duel.queue.length === 0) {
    // У дуелі «Кличного» — лише перші 3 рівні: найуживаніші слова
    duel.queue = duel.game === "klychnyi" ? klychnyiData.slice(0, KLYCHNYI_ONLINE_POOL)
      : duel.game === "frazeolohizmy" ? [...frazeoRows()]
      : duel.game === "slovospoluch" ? slovoCardIndices()
      : [...naholosyData];
    // groups.js: лише вибрані групи (якщо вибрано)
    const fit = typeof playFilter === "function" ? playFilter(duel.game) : null;
    if (fit) {
      const all = duel.game === "klychnyi" ? klychnyiData : duel.game === "frazeolohizmy" ? frazeoSentences : null;
      const picked = duel.game === "slovospoluch"
        ? SLOVO_CARDS.map((c, i) => (fit(c) ? i : -1)).filter(i => i >= 0)
        : (all || duel.queue).filter(fit);
      if (picked.length) duel.queue = picked;
    }
    shuffleArray(duel.queue);
  }
  duel.question = duel.queue.shift();
  duel.round = makeDuelRound(duel.question);
  duel.locked.fill(false);
  duel.resolved = false;

  const { words, lead } = duel.round;
  const keys = showKeyHints();

  for (let i = 0; i < duel.n; i++) {
    const pane = duelPane(i);
    pane.classList.remove("won-round", "lost-round", "winner", "loser");
    const box = pane.querySelector(".duel-answers");
    box.innerHTML = "";
    setDuelStatus(i, "Хто швидше?");

    const leadEl = pane.querySelector(".duel-lead");
    leadEl.hidden = !lead;
    if (lead && duel.round.plainLead) {
      leadEl.textContent = lead;
    } else if (lead) {
      leadEl.innerHTML = "";
      const gap = document.createElement("span");
      gap.className = "address-gap";
      gap.textContent = lead.includes("___") ? "[...]" : "…"; // фразеологізми — як на НМТ
      if (lead.includes("___")) gap.classList.add("gap-br");
      if (lead.includes("___")) {
        // Речення з пропуском усередині (фразеологізми)
        const [before, after] = lead.split("___");
        leadEl.append(before, gap, after);
      } else {
        leadEl.append(`${lead} `, gap, "!");
      }
    }
    // Кожна частина екрана — зі своїм порядком варіантів, щоб не підглядали
    const paneWords = [...words];
    if (!duel.round.fixed) shuffleArray(paneWords);
    paneWords.forEach((word, k) => {
      const btn = document.createElement("button");
      btn.className = "answer duel-answer";
      btn.dataset.word = word;
      duel.round.render(btn, word);
      if (keys) {
        const key = document.createElement("kbd");
        key.textContent = DUEL_PLAYERS[i].keys[k].toUpperCase();
        btn.appendChild(key);
      }
      // pointerdown — щоб усі гравці могли тиснути одночасно і без затримки
      btn.addEventListener("pointerdown", e => {
        e.preventDefault();
        duelTap(i, word, btn);
      });
      box.appendChild(btn);
    });
  }
  updateDuelScores();
  fitDuelText();
  fitDuelPanes();
}

// Фразеологізми: довге речення + 3 вирази можуть не влізти в чверть телефона —
// тоді пропорційно зменшуємо вміст частини, доки все не вміститься
function fitDuelPanes() {
  if (!duel || !["frazeolohizmy", "slovospoluch"].includes(duel.game)) return;
  document.querySelectorAll(".duel-pane").forEach(pane => {
    const parts = [...pane.children].filter(c => !c.hidden);
    parts.forEach(c => { c.style.zoom = ""; });
    pane.style.justifyContent = "flex-start"; // так переповнення видно в scrollHeight
    let zoom = 1;
    while (pane.scrollHeight > pane.clientHeight + 1 && zoom > 0.45) {
      zoom -= 0.05;
      parts.forEach(c => { c.style.zoom = zoom.toFixed(2); });
    }
    pane.style.justifyContent = "";
  });
}

// Довгі слова у вузьких частинах екрана: зменшуємо шрифт, доки слово не влізе
function fitDuelText() {
  document.querySelectorAll(".duel-answer").forEach(btn => {
    const word = btn.firstElementChild;
    if (!word) return;
    btn.style.fontSize = "";
    let size = parseFloat(getComputedStyle(btn).fontSize);
    const pad = parseFloat(getComputedStyle(btn).paddingLeft) + parseFloat(getComputedStyle(btn).paddingRight);
    const max = btn.clientWidth - pad - 4;
    while (word.scrollWidth > max && size > 11) {
      size -= 1;
      btn.style.fontSize = `${size}px`;
    }
  });
}

// Телефон тримають не так, як треба для розкладки → просимо повернути
function checkDuelOrientation() {
  const rotate = document.querySelector(".duel-rotate");
  if (!duel || !rotate) return;
  const portrait = window.innerHeight >= window.innerWidth;
  const want = bestOrientation(duel.n, duel.layout);
  // Великі екрани (планшети в 2×2, дошки) показують усе й так — лише телефони
  const small = Math.min(window.innerWidth, window.innerHeight) < 600;
  const wrong = want === "portrait" ? !portrait : portrait;
  rotate.hidden = !(small && wrong) || Boolean(duel.ignoreOrientation);
}

window.addEventListener("resize", () => {
  if (duel && !screens.duel.hidden) {
    checkDuelOrientation();
    fitDuelText();
    fitDuelPanes();
  }
});

function duelCorrectWords() {
  return duel.round.correct;
}

function revealDuelAnswer(blink) {
  const correct = duelCorrectWords();
  if (duel.round.card) {
    // Словосполучення: під ним — правильний варіант
    document.querySelectorAll(".duel-lead").forEach(lead => lead.replaceChildren(slovoPairNode(duel.round.card)));
  }
  document.querySelectorAll(".duel-lead .address-gap").forEach(gap => {
    gap.textContent = duel.round.fill || correct[0];
    gap.classList.add("filled-fix");
  });
  document.querySelectorAll(".duel-answer").forEach(b => {
    if (correct.includes(b.dataset.word)) {
      b.classList.add("correct");
      if (blink) b.classList.add("blink");
    } else if (!b.classList.contains("wrong")) {
      b.classList.add("dim");
    }
  });
}

function duelTap(i, word, btn) {
  if (!duel || duel.over || duel.resolved || duel.locked[i]) return;

  if (duelCorrectWords().includes(word)) {
    duel.resolved = true;
    sparkleAt(btn, 18);
    const slot = scoreSlot(i);
    duel.scores[slot]++;
    updateDuelScores();
    revealDuelAnswer(false);
    for (let j = 0; j < duel.n; j++) {
      const sameSide = duel.teams && teamOf(j) === teamOf(i);
      if (j === i || sameSide) duelPane(j).classList.add("won-round");
      if (j === i) setDuelStatus(j, duel.teams ? "+1 команді — швидше за всіх! ⚡" : "+1 — швидше за всіх! ⚡", "good");
      else if (sameSide) setDuelStatus(j, "+1 команді — партнер був швидшим ⚡", "good");
      else setDuelStatus(j, duel.teams
        ? `Швидшою була команда ${teamOf(i) + 1}`
        : `Швидше був ${DUEL_PLAYERS[i].name.toLowerCase()}`);
    }
    if (duel.scores[slot] >= duel.target) {
      duel.over = true;
      schedule(() => finishDuel(slot), 1200);
    } else {
      schedule(nextDuelRound, 1200);
    }
    return;
  }

  // Помилка: цей гравець пропускає слово
  duel.locked[i] = true;
  btn.classList.add("wrong");
  duelPane(i).classList.add("lost-round");
  setDuelStatus(i, "Помилка — чекай наступне слово", "bad");

  if (duel.locked.every(Boolean)) {
    duel.resolved = true;
    revealDuelAnswer(true);
    for (let j = 0; j < duel.n; j++) setDuelStatus(j, "Ніхто не вгадав 🙈", "bad");
    schedule(nextDuelRound, 2000);
  }
}

// winner — номер гравця або (у командах) номер команди
function finishDuel(winner) {
  track('duel_end', { game_type: duel.game, players: duel.n, layout: duel.layout, teams: duel.teams, score: duel.scores.join(":") });
  for (let i = 0; i < duel.n; i++) {
    const pane = duelPane(i);
    const won = scoreSlot(i) === winner;
    pane.querySelector(".duel-answers").innerHTML = "";
    pane.classList.remove("won-round", "lost-round");
    pane.classList.add(won ? "winner" : "loser");
    setDuelStatus(i,
      won ? (duel.teams ? "🏆 Команда перемогла!" : "🏆 Перемога!") : "Наступного разу пощастить 💪",
      won ? "good win" : "lose");
  }
  document.querySelector(".duel-again").hidden = false;
  document.querySelector(".duel-goal").hidden = true;
  launchConfetti();
}

function exitDuel() {
  clearTimeout(nextTimer);
  const game = duel ? duel.game : modesGame;
  duel = null;
  showModes(game);
}

// Клавіатура: у кожного гравця свої три клавіші (видно на кнопках)
document.addEventListener("keydown", e => {
  if (!duel || screens.duel.hidden || e.repeat) return;
  const key = e.key.toLowerCase();
  for (let i = 0; i < duel.n; i++) {
    const k = DUEL_PLAYERS[i].keys.indexOf(key);
    if (k === -1) continue;
    const btn = duelPane(i).querySelectorAll(".duel-answer")[k];
    if (btn) duelTap(i, btn.dataset.word, btn);
  }
});

document.querySelectorAll("#duel-players button").forEach(b => {
  b.addEventListener("click", () => {
    duelSetup.n = Number(b.dataset.n);
    storageSet("duel_n", String(duelSetup.n));
    renderDuelSetup();
  });
});
document.querySelectorAll("#duel-layout button").forEach(b => {
  b.addEventListener("click", () => {
    duelSetup.layout = b.dataset.layout;
    storageSet("duel_layout", duelSetup.layout);
    renderDuelSetup();
  });
});
document.querySelectorAll("#duel-target button").forEach(b => {
  b.addEventListener("click", () => {
    duelSetup.target = Number(b.dataset.target);
    storageSet("duel_target", String(duelSetup.target));
    renderDuelSetup();
  });
});
document.querySelectorAll("#duel-teams button").forEach(b => {
  b.addEventListener("click", () => {
    duelSetup.teams = b.dataset.teams === "1";
    storageSet("duel_teams", duelSetup.teams ? "1" : "0");
    renderDuelSetup();
  });
});
renderDuelSetup();

// ---------- Турнірна таблиця ----------

const LB = window.LEADERBOARD_CONFIG || {};
const leaderboardEnabled = Boolean(LB.url && LB.anonKey);
let leadersGame = "naholosy";

// Простий фільтр: остаточно прибирає небажані імена модератор у Supabase
const BAD_WORDS = [
  "хуй", "хуя", "хує", "хуї", "хуе", "хуи", "пизд", "пізд", "бляд", "блят", "бля",
  "ебат", "ебан", "ебал", "єбат", "єбан", "єбал", "йобан", "їбат", "ебу", "єбу",
  "сука", "сучк", "мудак", "мудил", "гандон", "гондон", "шлюх", "курв", "підар",
  "пидар", "підор", "пидор", "педик", "залуп", "дроч", "срак",
  "fuck", "shit", "bitch", "dick", "cunt", "porn", "sex", "секс", "порн", "казино", "casino"
];

function normalizeName(name) {
  return name.trim().replace(/\s+/g, " ");
}

// Російська заборонена (бажання власника): букви ы э ъ ё або типові російські слова, яких немає в українській.
// Те саме правило на сервері — lang-check.sql (is_russian_text).
const RU_WORDS = new Set(("и его ее что чтобы кто как или этот эта эти они она оно мой мои твой твои свой свои наши ваши " +
  "лучший лучшая лучшие самый самая самые класс друзья привет пока спасибо очень тоже только нет где здесь сейчас " +
  "хорошо игра ученики ребята сегодня всем какой еще меня тебя себя").split(" "));

function isRussianText(text) {
  const lower = String(text || "").toLowerCase();
  return /[ыэъё]/.test(lower) || lower.split(/[^а-яіїєґa-z'’ʼ]+/).some(w => RU_WORDS.has(w));
}

function checkName(name) {
  if (name.length < 2) return "Ім'я має бути хоча б з 2 літер";
  if (isRussianText(name)) return "Ім'я має бути українською мовою або латиницею";
  if (name.length > 20) return "Ім'я задовге (до 20 символів)";
  const lower = name.toLowerCase();
  if (/https?:|www\.|\.(com|net|org|ua|ru|io|me|site|online|shop)\b|t\.me|@|\d{4,}/.test(lower)) {
    return "Посилання й реклама в імені заборонені";
  }
  const compact = lower.replace(/[^a-zа-яіїєґё]/g, "");
  if (BAD_WORDS.some(w => compact.includes(w))) {
    return "Обери, будь ласка, інше ім'я 🙂";
  }
  return "";
}

async function lbRequest(path, options = {}) {
  const res = await fetch(`${LB.url}/rest/v1/${path}`, {
    ...options,
    headers: {
      apikey: LB.anonKey,
      Authorization: `Bearer ${LB.anonKey}`,
      "Content-Type": "application/json",
      ...(options.headers || {})
    }
  });
  if (!res.ok) {
    // текст відповіді — у повідомленні, щоб розрізняти помилки сервера (напр. «notfound», «lang»)
    const err = new Error(`HTTP ${res.status} ${await res.text().catch(() => "")}`);
    err.status = res.status;
    throw err;
  }
  const text = await res.text();
  return text ? JSON.parse(text) : null;
}

// Прихований ідентифікатор гравця на цьому пристрої: так таблиця
// відрізняє одного гравця від інших людей з таким самим іменем
function getPlayerId() {
  let id = storageGet("player_id");
  if (!id || !/^[0-9a-f-]{36}$/.test(id)) {
    id = window.crypto && crypto.randomUUID
      ? crypto.randomUUID()
      : "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, c => {
        const r = Math.random() * 16 | 0;
        return (c === "x" ? r : (r & 0x3 | 0x8)).toString(16);
      });
    storageSet("player_id", id);
  }
  return id;
}

// Записує результат; у таблиці лишається найкращий результат гравця.
// Повертає результат, який стоїть у таблиці (або null для старої бази).
async function submitScore(name, game, value) {
  try {
    return await lbRequest("rpc/submit_score", {
      method: "POST",
      body: JSON.stringify({ p_player: getPlayerId(), p_name: name, p_game: game, p_score: value })
    });
  } catch (err) {
    // База ще без функції submit_score (не запущено leaderboard-best-score.sql)
    if (err.status !== 404) throw err;
    await lbRequest("scores", {
      method: "POST",
      headers: { Prefer: "return=minimal" },
      body: JSON.stringify({ name, game, score: value })
    });
    return null;
  }
}

function prepareSubmitForm() {
  const form = $("submit-form");
  // Турнірна таблиця — лише для ігор, які вже не в бета-версії
  form.hidden = !leaderboardEnabled || score <= 0 || endless || marathonTopic || !["naholosy", "leksychna", "klychnyi"].includes(currentGame)
    || (currentGame === "leksychna" && typeof leksMode !== "undefined" && leksMode === "nmt");
  form.querySelector("button").disabled = false;
  $("player-name").disabled = false;
  $("player-name").value = storageGet("player_name") || "";
  setSubmitStatus("");
}

function setSubmitStatus(text, kind) {
  const el = $("submit-status");
  el.textContent = text;
  el.className = "submit-status" + (kind ? ` ${kind}` : "");
}

$("submit-form").addEventListener("submit", async e => {
  e.preventDefault();
  const name = normalizeName($("player-name").value);
  const problem = checkName(name);
  if (problem) {
    setSubmitStatus(problem, "bad");
    return;
  }

  // спецтеми й гра без обмеження життів у таблицю не йдуть
  if (marathonTopic || endless) return;

  const button = e.target.querySelector("button");
  button.disabled = true;
  setSubmitStatus("Зберігаю…");

  try {
    const stored = await submitScore(name, currentGame, score);
    storageSet("player_name", name);
    $("player-name").disabled = true;
    setSubmitStatus(
      stored !== null && stored > score
        ? `У таблиці лишається твій рекорд — ${stored} 🏆`
        : "Готово! Ти в таблиці 🏆",
      "good"
    );
    track('leaderboard_submit', { game_type: currentGame, score });
  } catch (err) {
    button.disabled = false;
    setSubmitStatus("Не вдалося зберегти. Спробуй ще раз", "bad");
  }
});

async function showLeaders(game) {
  leadersGame = game;
  document.querySelectorAll(".tab").forEach(t => {
    t.classList.toggle("active", t.dataset.game === game);
  });
  showScreen("leaders");

  const list = $("leaders-list");
  const status = $("leaders-status");
  list.innerHTML = "";

  if (!leaderboardEnabled) {
    status.textContent = "Таблиця скоро запрацює 🙂";
    return;
  }

  status.textContent = "Завантажую…";
  try {
    const rows = await lbRequest(
      `scores?select=name,score&game=eq.${game}&order=score.desc,created_at.asc&limit=50`
    );
    if (leadersGame !== game) return;
    const myName = storageGet("player_name");
    list.innerHTML = "";
    rows.forEach(row => {
      const li = document.createElement("li");
      if (myName && row.name === myName) li.classList.add("me");
      const name = document.createElement("span");
      name.className = "name";
      name.textContent = row.name;
      const points = document.createElement("span");
      points.className = "points";
      points.textContent = row.score;
      li.append(name, points);
      list.appendChild(li);
    });
    status.textContent = rows.length ? "" : "Тут поки порожньо — стань першим!";
  } catch (err) {
    if (leadersGame === game) status.textContent = "Не вдалося завантажити таблицю";
  }
}

// ---------- Події ----------

$("btn-soon-ok").addEventListener("click", () => { $("soon").hidden = true; });
$("soon").addEventListener("click", e => {
  if (e.target === $("soon")) $("soon").hidden = true;
});
$("btn-leaders").addEventListener("click", () => showLeaders("naholosy"));
$("btn-menu").addEventListener("click", () => {
  if (endless) gameOver(); // «Завершити»: підсумок і помилки
  else if (training && training.game) {
    // groups.js: вийти посередині — результат зараховується (правильні з першого разу)
    if (training.round === 1 ? training.results.size : training.done) finishGroupTraining(true);
    else trainingBackToGroups();
  }
  else if (training) (currentGame === "inshomovni" ? showInshModes() : currentGame === "leksychna" ? showLeksModes() : showModes());
  else showMenu();
});
$("btn-modes-back").addEventListener("click", () => {
  if (modesGame === "inshe") showInsheSections(INSHE_META[insheQuiz.id].sec); // «📂 Інше»: назад до розділу
  else if (modesGame === "slovospoluch" && typeof showLeksChoice === "function") showLeksChoice(); // назад до вибору «Лексичної помилки»
  else showMenu();
});
$("btn-game-prev").addEventListener("click", showPrevCard);
$("btn-prev-close").addEventListener("click", () => { $("prev-modal").hidden = true; });
// власниця, 08.11.2026: «Далі →» (і будь-яка кнопка) у копії попереднього завдання — повернутися до поточного
$("prev-content").addEventListener("click", e => { if (e.target.closest("button")) $("prev-modal").hidden = true; });
$("prev-modal").addEventListener("click", e => {
  if (e.target === $("prev-modal")) $("prev-modal").hidden = true;
});
$("btn-duel").addEventListener("click", startDuel);
$("btn-marathon").addEventListener("click", () => startGame(modesGame));
$("btn-marathon-endless").addEventListener("click", () => startGame(modesGame, { endless: true }));
$("btn-fix-mistakes").addEventListener("click", startMistakesRound);
// у «Іншомовних словах» свої групи (inshomovni.js)
// тренування групами (groups.js)
$("btn-train-next").addEventListener("click", () => {
  const all = TRAIN_GAMES[training.game].groups();
  startGroupTraining(training.game, [all[training.groupIndex + 1].key]);
});
$("btn-train-again").addEventListener("click", () => startGroupTraining(training.game, training.keys));
$("btn-train-groups").addEventListener("click", () => trainingBackToGroups());
$("btn-leaders-back").addEventListener("click", showMenu);
$("btn-again").addEventListener("click", () => startGame(currentGame));
$("btn-over-menu").addEventListener("click", showMenu);
$("btn-continue").addEventListener("click", () => {
  $("celebrate").hidden = true;
  nextQuestion();
});
document.querySelectorAll(".tab").forEach(tab => {
  tab.addEventListener("click", () => showLeaders(tab.dataset.game));
});

// Клавіші 1–4 для вибору варіанта в «Наголосах»
document.addEventListener("keydown", e => {
  if (screens.game.hidden || !["naholosy", "klychnyi", "frazeolohizmy", "chyslivnyky", "slovospoluch", "inshomovni", "inshe"].includes(currentGame) || !$("celebrate").hidden) return;
  if (e.target.tagName === "INPUT") return;
  const btn = answersEl.children[Number(e.key) - 1];
  if (btn) btn.click();
});

renderMenu();

// Вкладка «Кличний» у турнірній таблиці — поки гра в бета-версії, лише за бета-посиланням
// власниця, 07.11.2026: усім — таблицю бачать і без підписки (кнопка «Грати» → заклик до Спільноти, leaders-play.js)

// ---------- Таємний вхід у статистику ----------
// Логотип унизу: 5 натискань, пауза щонайменше 1,5 с, ще 5 натискань → сторінка статистики (там пароль).
// Сам логотип тому більше не відкриває канал (напис «@ukr_movych» поруч — відкриває).
const secretTaps = [];
document.addEventListener("click", e => {
  const logo = e.target instanceof Element && e.target.closest("footer .brand img");
  if (!logo) return;
  e.preventDefault();
  e.stopPropagation();
  const now = Date.now();
  if (secretTaps.length && now - secretTaps[secretTaps.length - 1] > 6000) secretTaps.length = 0;
  secretTaps.push(now);
  // групи натискань, розділені паузою ≥ 1,5 с
  const groups = [1];
  for (let i = 1; i < secretTaps.length; i++) {
    if (secretTaps[i] - secretTaps[i - 1] >= 1500) groups.push(1);
    else groups[groups.length - 1]++;
  }
  if (groups.length >= 2 && groups[groups.length - 2] === 5 && groups[groups.length - 1] === 5) {
    secretTaps.length = 0;
    location.href = "stats/";
  }
}, true);

// Посилання @ukr_movych: у Telegram відкриваємо через Telegram, на сайті — у новій вкладці
document.addEventListener("click", e => {
  const link = e.target instanceof Element && e.target.closest("[data-tg-link]");
  if (!link) return;
  track("brand_click", { place: link.className });
  const tg = window.Telegram && window.Telegram.WebApp;
  if (tg && tg.initData && typeof tg.openTelegramLink === "function") {
    e.preventDefault();
    tg.openTelegramLink(link.href);
  }
});

// ---------- Заборона копіювання ----------
// Зупиняє звичайне виділення, копіювання й контекстне меню (крім поля для імені)

function isEditable(target) {
  return target instanceof Element && target.closest("input, textarea");
}

["copy", "cut", "contextmenu", "selectstart", "dragstart"].forEach(type => {
  document.addEventListener(type, e => {
    if (!isEditable(e.target)) e.preventDefault();
  });
});

document.addEventListener("keydown", e => {
  if (e.key === "Escape") $("soon").hidden = true;
});

// ---------- Доступ до спецтем за посиланням (вебінари) ----------
// Посилання: у Telegram — t.me/ukrmovych_bot/battle?startapp=w_КОД, на сайті — …/gym/?w=КОД.
// Доступ видає функція Supabase topic-access лише Telegram-користувачам (до дедлайну посилання).
function topicJoinCode() {
  const query = new URLSearchParams(location.search);
  if (query.get("w")) return query.get("w");
  const hash = new URLSearchParams(location.hash.slice(1));
  const tgData = hash.get("tgWebAppData");
  const tg = window.Telegram && Telegram.WebApp;
  const start = query.get("tgWebAppStartParam") || hash.get("tgWebAppStartParam")
    || (tgData ? new URLSearchParams(tgData).get("start_param") : "")
    || (tg && tg.initDataUnsafe && tg.initDataUnsafe.start_param) || "";
  return start.startsWith("w_") ? start.slice(2) : "";
}

function showTopicModal({ emoji, title, text, openLink = "", goTopic = "" }) {
  $("topic-modal-emoji").textContent = emoji;
  $("topic-modal-title").textContent = title;
  $("topic-modal-text").textContent = text;
  $("btn-topic-open").hidden = !openLink;
  if (openLink) $("btn-topic-open").href = openLink;
  $("btn-topic-go").hidden = !goTopic;
  $("btn-topic-go").onclick = () => {
    $("topic-modal").hidden = true;
    currentTopic = goTopic;
    showModes("naholosy");
    setOpenPanel("groups");
  };
  $("topic-modal").hidden = false;
}

async function syncTopicAccess() {
  const code = topicJoinCode().replace(/[^A-Za-z0-9]/g, "");
  const initData = telegramInitData();
  if (!initData) {
    // на сайті доступ за посиланням не видаємо — лише в Telegram (власник має доступ і так)
    if (code && !isOwner) {
      showTopicModal({
        emoji: "✈️", title: "Відкрий у Telegram",
        text: "Доступ за цим посиланням відкривається в Telegram-мініапці @ukrmovych_bot.",
        openLink: `${LB.telegramAppLink}?startapp=w_${code}`
      });
    }
    return;
  }
  if (!leaderboardEnabled) return;
  try {
    const res = await fetch(`${LB.url}/functions/v1/topic-access`, {
      method: "POST",
      headers: { apikey: LB.anonKey, Authorization: `Bearer ${LB.anonKey}`, "Content-Type": "application/json" },
      body: JSON.stringify(code ? { initData, join: code } : { initData })
    });
    const data = await res.json();
    if (!Array.isArray(data.topics)) return;
    topicAccess = new Set(data.topics);
    storageSet("topic_access", JSON.stringify(data.topics));
    if (!screens.modes.hidden) showModes();
    if (data.joined && SPECIAL[data.joined.topic]) {
      const t = SPECIAL[data.joined.topic];
      showTopicModal({
        emoji: "🎉", title: `${t.icon} ${t.name}`,
        text: "Доступ відкрито назавжди! Шукай у «Наголоси» → «Тренування». А ще ці слова можна вибрати для марафону, онлайн-гри з друзями й гри для класу.",
        goTopic: data.joined.topic
      });
    } else if (data.error) {
      showTopicModal({
        emoji: "⏰",
        title: data.error === "expired" ? "Час дії посилання минув" : "Посилання не працює",
        text: data.error === "expired"
          ? "Доступ за цим посиланням можна було отримати лише до певного часу. Напиши Укрмовичу, якщо це помилка: @ukr_movych"
          : "Можливо, посилання скасовано або в ньому помилка. Напиши Укрмовичу: @ukr_movych"
      });
    }
  } catch (e) {
    // немає зв'язку — лишаємо збережений доступ
  }
}

$("btn-topic-close").addEventListener("click", () => { $("topic-modal").hidden = true; });
$("btn-topic-open").addEventListener("click", openProLink);

// PRO: перевіряємо після load, коли довантажився скрипт Telegram
// не учасникам — перевірка у фоні з невеликою випадковою затримкою (до 15 с): коли гру одночасно відкривають тисячі людей
// (відкриття 15.11), запити до Telegram розподіляються, а не йдуть усі в одну секунду
window.addEventListener("load", () => { if (isPro) checkPro(); else setTimeout(checkPro, Math.random() * 15000); syncTopicAccess(); });

$("btn-pro-close").addEventListener("click", () => { $("pro").hidden = true; });
$("pro").addEventListener("click", e => {
  if (e.target === $("pro")) $("pro").hidden = true;
});
// Посилання з вікна PRO: t.me — усередині Telegram, решта — у браузері
function openProLink(e) {
  const tg = window.Telegram && Telegram.WebApp;
  const href = e.currentTarget.href;
  if (tg && tg.initData && /^https:\/\/t\.me\//.test(href) && typeof tg.openTelegramLink === "function") {
    e.preventDefault();
    tg.openTelegramLink(href);
  } else if (tg && tg.initData && typeof tg.openLink === "function") {
    e.preventDefault();
    tg.openLink(href);
  }
}
$("btn-pro-buy").addEventListener("click", openProLink);
// Форма звернення: решту вікна ховаємо, щоб поле було вгорі й клавіатура його не закривала
$("btn-pro-help").addEventListener("click", () => {
  $("pro").classList.add("pro-form");
  $("pro-status").textContent = "";
  $("pro-help").hidden = false;
  $("pro").scrollTop = 0;
});
$("pro-help-text").addEventListener("focus", () => {
  setTimeout(() => $("pro-help-text").scrollIntoView({ block: "center" }), 350);
});
// «Підписка є, а доступу немає»: функція pro-check повідомляє власника й дає посилання-заявку в канал
$("btn-pro-report").addEventListener("click", async () => {
  const btn = $("btn-pro-report");
  btn.disabled = true;
  $("pro-status").textContent = "Надсилаю…";
  try {
    const res = await fetch(`${LB.url}/functions/v1/pro-check`, {
      method: "POST",
      headers: { apikey: LB.anonKey, Authorization: `Bearer ${LB.anonKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({ initData: telegramInitData(), report: $("pro-help-text").value })
    });
    const data = await res.json();
    if (data.pro) {
      isPro = true;
      storageSet("pro_status", "1");
      renderMenu();
      $("pro").classList.remove("pro-form");
      $("pro-help").hidden = true;
      $("pro-status").textContent = "Доступ уже є — тренажери відкрито! 🎉";
      setTimeout(() => { $("pro").hidden = true; }, 1500);
      return;
    }
    if (!data.reported) throw new Error("not reported");
    track("pro_report");
    $("pro-status").textContent = "";
    $("pro-help").hidden = true;
    $("pro-done").hidden = false;
  } catch (err) {
    $("pro-status").textContent = "Не вдалося надіслати. Напиши Укрмовичу в Telegram: @ukr_movych";
  } finally {
    btn.disabled = false;
  }
});
$("btn-pro-check").addEventListener("click", async () => {
  $("pro-status").textContent = "Перевіряю…";
  const ok = await checkPro();
  $("pro-status").textContent = ok ? "PRO відкрито! 🎉" : "Підписку поки не знайдено. Якщо щойно оформив — зачекай хвилинку.";
  $("btn-pro-help").hidden = ok;
  if (ok) setTimeout(() => { $("pro").hidden = true; }, 1200);
});

// Відвідування: одна подія на запуск гри (з Telegram чи з сайту).
// Після load, бо скрипт Telegram вантажиться асинхронно.
window.addEventListener("load", () => track("visit", {
  tg: Boolean(window.Telegram && Telegram.WebApp && Telegram.WebApp.initData),
  beta: BETA
}));

// ---------- Відгуки ----------
// (тут, а не окремим файлом: кнопка не має залежати від ще одного завантаження)
// Відгук пишеться в таблицю feedback у Supabase (feedback.sql),
// читати їх можна на сторінці …/stats/ (з паролем)

screens.feedback = $("feedback-screen");

const feedbackState = { rating: 0, role: "" };

function setFeedbackChoice(groupId, attr, value) {
  $(groupId).querySelectorAll("button").forEach(b => {
    const on = b.dataset[attr] === String(value);
    b.classList.toggle("active", on);
    b.setAttribute("aria-checked", String(on));
  });
}

function renderFeedbackButton() {
  const sent = storageGet("feedback_sent") === "1";
  $("feedback-btn-title").textContent = sent ? "Дякуємо за відгук!" : "Залиш відгук";
  $("feedback-btn-sub").textContent = sent
    ? "Хочеш щось додати? Пиши ще — ми все читаємо 🧡"
    : "Чим тобі допоміг тренажер? Це 1 хвилина, а нам — дуже важливо 🧡";
  if (typeof renderFeedbackReplyBadge === "function") renderFeedbackReplyBadge(); // feedback-reply.js
}

function showFeedback() {
  track("feedback_open");
  $("feedback-form").hidden = false;
  $("feedback-thanks").hidden = true;
  $("feedback-status").textContent = "";
  $("feedback-status").className = "submit-status";
  if (!$("feedback-name").value) {
    const tg = window.Telegram && Telegram.WebApp;
    const tgUser = tg && tg.initDataUnsafe && tg.initDataUnsafe.user;
    $("feedback-name").value = storageGet("player_name") || (tgUser && tgUser.first_name) || "";
  }
  // Нік у Telegram надсилаємо лише з дозволу (галочка, за замовчуванням вимкнена)
  const username = telegramUsername();
  $("feedback-contact-row").hidden = !username;
  $("feedback-username").textContent = username ? `@${username}` : "";
  showScreen("feedback");
  if (typeof showFeedbackReplies === "function") showFeedbackReplies(); // feedback-reply.js
}

function telegramUsername() {
  const tg = window.Telegram && Telegram.WebApp;
  const user = tg && tg.initData && tg.initDataUnsafe && tg.initDataUnsafe.user;
  return user && user.username ? user.username : "";
}

function feedbackError(text) {
  $("feedback-status").textContent = text;
  $("feedback-status").className = "submit-status bad";
}

async function sendFeedback(e) {
  e.preventDefault();
  const message = $("feedback-text").value.trim();
  if (message.length < 3) {
    feedbackError("Напиши хоч кілька слів 🙂");
    $("feedback-text").focus();
    return;
  }
  if (isRussianText(message) || isRussianText($("feedback-name").value)) {
    feedbackError("Відгук має бути українською мовою або латиницею");
    $("feedback-text").focus();
    return;
  }
  if (!leaderboardEnabled) {
    feedbackError("Не вдалося надіслати. Напиши нам у Telegram @ukr_movych");
    return;
  }
  const tg = window.Telegram && Telegram.WebApp;
  const fromTelegram = Boolean(tg && tg.initData);
  const username = telegramUsername();
  const button = $("btn-feedback-send");
  button.disabled = true;
  $("feedback-status").textContent = "Надсилаю…";
  $("feedback-status").className = "submit-status";
  try {
    await lbRequest("feedback", {
      method: "POST",
      headers: { Prefer: "return=minimal" },
      body: JSON.stringify({
        player: getPlayerId(),
        message,
        rating: feedbackState.rating || null,
        role: feedbackState.role || null,
        name: $("feedback-name").value.trim().slice(0, 40) || null,
        contact: username && $("feedback-contact").checked ? `@${username}` : null,
        can_publish: $("feedback-publish").checked,
        source: fromTelegram ? "telegram" : "web"
      })
    });
    track("feedback_sent", { rating: feedbackState.rating, role: feedbackState.role });
    storageSet("feedback_sent", "1");
    $("feedback-text").value = "";
    renderFeedbackButton();
    $("feedback-form").hidden = true;
    $("feedback-thanks").hidden = false;
    window.scrollTo(0, 0);
  } catch (err) {
    feedbackError("Не вдалося надіслати. Перевір інтернет і спробуй ще раз");
  } finally {
    button.disabled = false;
  }
}

$("feedback-rating").addEventListener("click", e => {
  const b = e.target.closest("button");
  if (!b) return;
  feedbackState.rating = Number(b.dataset.rating);
  setFeedbackChoice("feedback-rating", "rating", feedbackState.rating);
});

$("feedback-role").addEventListener("click", e => {
  const b = e.target.closest("button");
  if (!b) return;
  feedbackState.role = b.dataset.role;
  setFeedbackChoice("feedback-role", "role", feedbackState.role);
});

// Підказки: додають початок речення в текст
document.querySelectorAll(".feedback-chips .chip").forEach(chip => {
  chip.addEventListener("click", () => {
    const area = $("feedback-text");
    const start = chip.textContent.replace(/…$/, " ");
    area.value = area.value.trim() ? `${area.value.trimEnd()}\n${start}` : start;
    area.focus();
    area.setSelectionRange(area.value.length, area.value.length);
  });
});

$("feedback-text").addEventListener("input", () => { $("feedback-status").textContent = ""; });
$("btn-feedback").addEventListener("click", showFeedback);
$("btn-feedback-back").addEventListener("click", showMenu);
$("btn-feedback-done").addEventListener("click", showMenu);
$("feedback-form").addEventListener("submit", sendFeedback);
renderFeedbackButton();

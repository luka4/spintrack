/* SpinBook home-page tour: the blueprint walkthrough from the promo video (video/v11.html), played live.
   seek(t) draws the whole frame as a pure function of time; the page drives it with requestAnimationFrame
   (see tour.js, which loads this file and three.js only when the tour is about to be seen).
   The easing helpers, phone builder and 3-D racket below are copied from v11.html; the scene list, the
   localized labels and the playback loop are site-specific. */
window.SpinBookTour = async function (mount, lang, opts) {
  'use strict';
  const base = String(lang || 'en').toLowerCase().split('-')[0];

  // ---------- localized copy ("*x*" is the green emphasis) ----------
  // Order: title, then (label, value) x3 per screen; rk = racket part labels; ui = control labels.
  const STR = {
    en: { t_home: "Your season *at a glance*", home1k: "Season overview", home1v: "204 activities, by type", home2k: "Win rates", home2v: "35% matches · 41% games", home3k: "Training hours", home3v: "16.5 h this season", t_racket: "Assemble your *racket*", rk_fh: "Forehand rubber", rk_bh: "Backhand rubber", rk_blade: "Blade", t_diary: "Log every *session*", di1k: "Day streak", di1v: "Open the app daily, keep it going", di2k: "Photos", di2v: "Pictures from the hall", di3k: "Add activity", di3v: "Log a session in seconds", t_charts: "See your *progress*", ch1k: "Form guide", ch1v: "Wins, draws and losses, match by match", ch2k: "Training progress", ch2v: "Hours trained over time", ch3k: "Full screen", ch3v: "Expand any chart", ui_label: "App preview animation", ui_pause: "Pause animation", ui_play: "Play animation" },
    de: { t_home: "Deine Saison *auf einen Blick*", home1k: "Saisonübersicht", home1v: "204 Aktivitäten, nach Typ", home2k: "Siegquoten", home2v: "35 % Spiele · 41 % Sätze", home3k: "Trainingsstunden", home3v: "16,5 h in dieser Saison", t_racket: "Stelle deinen *Schläger* zusammen", rk_fh: "Vorhandbelag", rk_bh: "Rückhandbelag", rk_blade: "Holz", t_diary: "Halte jede *Einheit* fest", di1k: "Tagesserie", di1v: "App täglich öffnen, Serie halten", di2k: "Fotos", di2v: "Bilder aus der Halle", di3k: "Aktivität hinzufügen", di3v: "Einheit in Sekunden erfassen", t_charts: "Sieh deinen *Fortschritt*", ch1k: "Formkurve", ch1v: "Siege, Remis und Niederlagen, Spiel für Spiel", ch2k: "Trainingsfortschritt", ch2v: "Trainierte Stunden im Zeitverlauf", ch3k: "Vollbild", ch3v: "Jedes Diagramm vergrößern", ui_label: "Animierte App-Vorschau", ui_pause: "Animation pausieren", ui_play: "Animation abspielen" },
    fr: { t_home: "Votre saison *en un coup d'œil*", home1k: "Vue de la saison", home1v: "204 activités, par type", home2k: "Taux de victoire", home2v: "35 % matchs · 41 % sets", home3k: "Heures d'entraînement", home3v: "16,5 h cette saison", t_racket: "Montez votre *raquette*", rk_fh: "Revêtement coup droit", rk_bh: "Revêtement revers", rk_blade: "Bois", t_diary: "Notez chaque *séance*", di1k: "Série quotidienne", di1v: "Ouvrez l'app chaque jour, gardez la série", di2k: "Photos", di2v: "Les images de la salle", di3k: "Ajouter une activité", di3v: "Notez une séance en quelques secondes", t_charts: "Suivez votre *progression*", ch1k: "Courbe de forme", ch1v: "Victoires, nuls et défaites, match après match", ch2k: "Progression à l'entraînement", ch2v: "Heures d'entraînement dans le temps", ch3k: "Plein écran", ch3v: "Agrandissez n'importe quel graphique", ui_label: "Aperçu animé de l'app", ui_pause: "Mettre l'animation en pause", ui_play: "Lancer l'animation" },
    es: { t_home: "Tu temporada *de un vistazo*", home1k: "Resumen de la temporada", home1v: "204 actividades, por tipo", home2k: "Porcentaje de victorias", home2v: "35 % partidos · 41 % sets", home3k: "Horas de entrenamiento", home3v: "16,5 h esta temporada", t_racket: "Monta tu *raqueta*", rk_fh: "Goma de derecha", rk_bh: "Goma de revés", rk_blade: "Madera", t_diary: "Registra cada *sesión*", di1k: "Racha diaria", di1v: "Abre la app cada día y mantén la racha", di2k: "Fotos", di2v: "Imágenes del pabellón", di3k: "Añadir actividad", di3v: "Registra una sesión en segundos", t_charts: "Mira tu *progreso*", ch1k: "Racha de forma", ch1v: "Victorias, empates y derrotas, partido a partido", ch2k: "Progreso de entrenamiento", ch2v: "Horas entrenadas a lo largo del tiempo", ch3k: "Pantalla completa", ch3v: "Amplía cualquier gráfico", ui_label: "Vista previa animada de la app", ui_pause: "Pausar animación", ui_play: "Reproducir animación" },
    pt: { t_home: "A sua temporada *num relance*", home1k: "Resumo da época", home1v: "204 atividades, por tipo", home2k: "Taxas de vitória", home2v: "35 % jogos · 41 % sets", home3k: "Horas de treino", home3v: "16,5 h nesta época", t_racket: "Monte a sua *raquete*", rk_fh: "Borracha de forehand", rk_bh: "Borracha de backhand", rk_blade: "Madeira", t_diary: "Registe cada *sessão*", di1k: "Sequência diária", di1v: "Abra a app todos os dias e mantenha a sequência", di2k: "Fotos", di2v: "Imagens do pavilhão", di3k: "Adicionar atividade", di3v: "Registe uma sessão em segundos", t_charts: "Veja o seu *progresso*", ch1k: "Forma recente", ch1v: "Vitórias, empates e derrotas, jogo a jogo", ch2k: "Progresso de treino", ch2v: "Horas treinadas ao longo do tempo", ch3k: "Ecrã inteiro", ch3v: "Amplie qualquer gráfico", ui_label: "Pré-visualização animada da app", ui_pause: "Pausar animação", ui_play: "Reproduzir animação" },
    sv: { t_home: "Din säsong *i överblick*", home1k: "Säsongsöversikt", home1v: "204 aktiviteter, per typ", home2k: "Vinstprocent", home2v: "35 % matcher · 41 % set", home3k: "Träningstimmar", home3v: "16,5 h denna säsong", t_racket: "Bygg ditt *racket*", rk_fh: "Forehandgummi", rk_bh: "Backhandgummi", rk_blade: "Blad", t_diary: "Logga varje *pass*", di1k: "Dagsserie", di1v: "Öppna appen varje dag och behåll serien", di2k: "Foton", di2v: "Bilder från hallen", di3k: "Lägg till aktivitet", di3v: "Logga ett pass på några sekunder", t_charts: "Se dina *framsteg*", ch1k: "Formkurva", ch1v: "Vinster, oavgjorda och förluster, match för match", ch2k: "Träningsframsteg", ch2v: "Tränade timmar över tid", ch3k: "Helskärm", ch3v: "Förstora vilket diagram som helst", ui_label: "Animerad förhandsvisning av appen", ui_pause: "Pausa animationen", ui_play: "Spela animationen" },
    da: { t_home: "Din sæson *med et blik*", home1k: "Sæsonoversigt", home1v: "204 aktiviteter, efter type", home2k: "Sejrsprocent", home2v: "35 % kampe · 41 % sæt", home3k: "Træningstimer", home3v: "16,5 t i denne sæson", t_racket: "Sæt dit *bat* sammen", rk_fh: "Forehandgummi", rk_bh: "Backhandgummi", rk_blade: "Blad", t_diary: "Log hver *træning*", di1k: "Dagsstreak", di1v: "Åbn appen hver dag og hold stregen", di2k: "Fotos", di2v: "Billeder fra hallen", di3k: "Tilføj aktivitet", di3v: "Log en træning på få sekunder", t_charts: "Se din *fremgang*", ch1k: "Formkurve", ch1v: "Sejre, uafgjorte og nederlag, kamp for kamp", ch2k: "Træningsfremgang", ch2v: "Trænede timer over tid", ch3k: "Fuld skærm", ch3v: "Forstør ethvert diagram", ui_label: "Animeret appvisning", ui_pause: "Sæt animationen på pause", ui_play: "Afspil animationen" },
    zh: { t_home: "赛季*一目了然*", home1k: "赛季概览", home1v: "204 次活动，按类型", home2k: "胜率", home2v: "比赛 35% · 局 41%", home3k: "训练时长", home3v: "本赛季 16.5 小时", t_racket: "组装你的*球拍*", rk_fh: "正手胶皮", rk_bh: "反手胶皮", rk_blade: "底板", t_diary: "记录每一次*练习*", di1k: "连续天数", di1v: "每天打开应用，保持连续", di2k: "照片", di2v: "球馆里的照片", di3k: "添加活动", di3v: "几秒钟记录一次练习", t_charts: "查看你的*进步*", ch1k: "状态走势", ch1v: "逐场显示胜、平、负", ch2k: "训练进度", ch2v: "训练时长随时间变化", ch3k: "全屏", ch3v: "放大任意图表", ui_label: "应用动画预览", ui_pause: "暂停动画", ui_play: "播放动画" },
    ja: { t_home: "シーズンを*ひと目で*", home1k: "シーズン概要", home1v: "204件のアクティビティ（種類別）", home2k: "勝率", home2v: "試合35% · ゲーム41%", home3k: "練習時間", home3v: "今シーズン16.5時間", t_racket: "*ラケット*を組み立てる", rk_fh: "フォア面ラバー", rk_bh: "バック面ラバー", rk_blade: "ブレード", t_diary: "すべての*練習*を記録", di1k: "連続日数", di1v: "毎日アプリを開いて記録を伸ばそう", di2k: "写真", di2v: "体育館での写真", di3k: "アクティビティを追加", di3v: "数秒で練習を記録", t_charts: "*上達*を確認", ch1k: "調子の推移", ch1v: "勝ち・引き分け・負けを試合ごとに", ch2k: "練習の進捗", ch2v: "練習時間の推移", ch3k: "全画面", ch3v: "グラフを拡大", ui_label: "アプリのアニメーションプレビュー", ui_pause: "アニメーションを一時停止", ui_play: "アニメーションを再生" },
    ko: { t_home: "시즌을 *한눈에*", home1k: "시즌 개요", home1v: "활동 204개, 유형별", home2k: "승률", home2v: "경기 35% · 게임 41%", home3k: "훈련 시간", home3v: "이번 시즌 16.5시간", t_racket: "*라켓*을 조립하세요", rk_fh: "포핸드 러버", rk_bh: "백핸드 러버", rk_blade: "블레이드", t_diary: "모든 *세션*을 기록", di1k: "연속 기록", di1v: "매일 앱을 열어 기록을 이어가세요", di2k: "사진", di2v: "체육관에서 찍은 사진", di3k: "활동 추가", di3v: "몇 초 만에 세션 기록", t_charts: "*성장*을 확인", ch1k: "폼 가이드", ch1v: "경기별 승·무·패", ch2k: "훈련 추이", ch2v: "시간에 따른 훈련 시간", ch3k: "전체 화면", ch3v: "어떤 차트든 확대", ui_label: "앱 애니메이션 미리보기", ui_pause: "애니메이션 일시정지", ui_play: "애니메이션 재생" },
    hi: { t_home: "आपका सीज़न *एक नज़र में*", home1k: "सीज़न का अवलोकन", home1v: "204 गतिविधियाँ, प्रकार के अनुसार", home2k: "जीत दर", home2v: "35% मैच · 41% गेम", home3k: "ट्रेनिंग के घंटे", home3v: "इस सीज़न 16.5 घंटे", t_racket: "अपना *रैकेट* बनाएँ", rk_fh: "फ़ोरहैंड रबर", rk_bh: "बैकहैंड रबर", rk_blade: "ब्लेड", t_diary: "हर *सेशन* दर्ज करें", di1k: "रोज़ की स्ट्रीक", di1v: "रोज़ ऐप खोलें, स्ट्रीक बनाए रखें", di2k: "फ़ोटो", di2v: "हॉल की तस्वीरें", di3k: "गतिविधि जोड़ें", di3v: "कुछ सेकंड में सेशन दर्ज करें", t_charts: "अपनी *प्रगति* देखें", ch1k: "फ़ॉर्म गाइड", ch1v: "जीत, ड्रॉ और हार, मैच दर मैच", ch2k: "ट्रेनिंग प्रगति", ch2v: "समय के साथ ट्रेनिंग के घंटे", ch3k: "फ़ुल स्क्रीन", ch3v: "किसी भी चार्ट को बड़ा करें", ui_label: "ऐप एनिमेशन पूर्वावलोकन", ui_pause: "एनिमेशन रोकें", ui_play: "एनिमेशन चलाएँ" },
    uk: { t_home: "Ваш сезон *одним поглядом*", home1k: "Огляд сезону", home1v: "204 активності, за типом", home2k: "Відсоток перемог", home2v: "35% матчів · 41% партій", home3k: "Години тренувань", home3v: "16,5 год цього сезону", t_racket: "Зберіть свою *ракетку*", rk_fh: "Накладка форхенду", rk_bh: "Накладка бекхенду", rk_blade: "Основа", t_diary: "Записуйте кожне *тренування*", di1k: "Денна серія", di1v: "Відкривайте застосунок щодня, не переривайте серію", di2k: "Фото", di2v: "Знімки із залу", di3k: "Додати активність", di3v: "Запишіть тренування за кілька секунд", t_charts: "Бачте свій *прогрес*", ch1k: "Форма", ch1v: "Перемоги, нічиї та поразки, матч за матчем", ch2k: "Прогрес тренувань", ch2v: "Години тренувань у часі", ch3k: "На весь екран", ch3v: "Розгорніть будь-який графік", ui_label: "Анімований огляд застосунку", ui_pause: "Призупинити анімацію", ui_play: "Відтворити анімацію" },
    pl: { t_home: "Twój sezon *w pigułce*", home1k: "Przegląd sezonu", home1v: "204 aktywności, według typu", home2k: "Skuteczność", home2v: "35% meczów · 41% setów", home3k: "Godziny treningów", home3v: "16,5 h w tym sezonie", t_racket: "Złóż swoją *rakietkę*", rk_fh: "Okładzina forhendu", rk_bh: "Okładzina bekhendu", rk_blade: "Drewno", t_diary: "Zapisuj każdy *trening*", di1k: "Seria dni", di1v: "Otwieraj aplikację codziennie i trzymaj serię", di2k: "Zdjęcia", di2v: "Obrazy z sali", di3k: "Dodaj aktywność", di3v: "Zapisz trening w kilka sekund", t_charts: "Zobacz swoje *postępy*", ch1k: "Forma", ch1v: "Wygrane, remisy i porażki, mecz po meczu", ch2k: "Postępy w treningu", ch2v: "Przetrenowane godziny w czasie", ch3k: "Pełny ekran", ch3v: "Powiększ dowolny wykres", ui_label: "Animowany podgląd aplikacji", ui_pause: "Wstrzymaj animację", ui_play: "Odtwórz animację" },
    cs: { t_home: "Vaše sezóna *na první pohled*", home1k: "Přehled sezóny", home1v: "204 aktivit podle typu", home2k: "Úspěšnost", home2v: "35 % zápasů · 41 % setů", home3k: "Hodiny tréninku", home3v: "16,5 h v této sezóně", t_racket: "Sestavte si *pálku*", rk_fh: "Potah na forhend", rk_bh: "Potah na bekhend", rk_blade: "Dřevo", t_diary: "Zapisujte každý *trénink*", di1k: "Denní série", di1v: "Otevírejte aplikaci každý den a držte sérii", di2k: "Fotky", di2v: "Snímky z haly", di3k: "Přidat aktivitu", di3v: "Zapište trénink za pár vteřin", t_charts: "Sledujte svůj *pokrok*", ch1k: "Forma", ch1v: "Výhry, remízy a prohry, zápas za zápasem", ch2k: "Pokrok v tréninku", ch2v: "Odtrénované hodiny v čase", ch3k: "Celá obrazovka", ch3v: "Zvětšete libovolný graf", ui_label: "Animovaná ukázka aplikace", ui_pause: "Pozastavit animaci", ui_play: "Přehrát animaci" },
    sk: { t_home: "Vaša sezóna *na prvý pohľad*", home1k: "Prehľad sezóny", home1v: "204 aktivít podľa typu", home2k: "Úspešnosť", home2v: "35 % zápasov · 41 % setov", home3k: "Hodiny tréningu", home3v: "16,5 h v tejto sezóne", t_racket: "Zostavte si *raketu*", rk_fh: "Poťah na forhend", rk_bh: "Poťah na bekhend", rk_blade: "Drevo", t_diary: "Zapisujte každý *tréning*", di1k: "Denná séria", di1v: "Otvárajte aplikáciu každý deň a držte sériu", di2k: "Fotky", di2v: "Zábery z haly", di3k: "Pridať aktivitu", di3v: "Zapíšte tréning za pár sekúnd", t_charts: "Sledujte svoj *pokrok*", ch1k: "Forma", ch1v: "Výhry, remízy a prehry, zápas za zápasom", ch2k: "Pokrok v tréningu", ch2v: "Odtrénované hodiny v čase", ch3k: "Celá obrazovka", ch3v: "Zväčšite ľubovoľný graf", ui_label: "Animovaná ukážka aplikácie", ui_pause: "Pozastaviť animáciu", ui_play: "Prehrať animáciu" },
    ru: { t_home: "Ваш сезон *с первого взгляда*", home1k: "Обзор сезона", home1v: "204 активности по типам", home2k: "Процент побед", home2v: "35% матчей · 41% партий", home3k: "Часы тренировок", home3v: "16,5 ч в этом сезоне", t_racket: "Соберите свою *ракетку*", rk_fh: "Накладка на форхенд", rk_bh: "Накладка на бэкхенд", rk_blade: "Основание", t_diary: "Записывайте каждую *тренировку*", di1k: "Серия дней", di1v: "Заходите в приложение каждый день и не прерывайте серию", di2k: "Фото", di2v: "Снимки из зала", di3k: "Добавить активность", di3v: "Запишите тренировку за пару секунд", t_charts: "Следите за своим *прогрессом*", ch1k: "Форма", ch1v: "Победы, ничьи и поражения, матч за матчем", ch2k: "Прогресс тренировок", ch2v: "Часы тренировок во времени", ch3k: "На весь экран", ch3v: "Разверните любой график", ui_label: "Анимированный обзор приложения", ui_pause: "Приостановить анимацию", ui_play: "Воспроизвести анимацию" },
    it: { t_home: "La tua stagione *a colpo d'occhio*", home1k: "Panoramica della stagione", home1v: "204 attività, per tipo", home2k: "Percentuali di vittoria", home2v: "35% incontri · 41% set", home3k: "Ore di allenamento", home3v: "16,5 h in questa stagione", t_racket: "Assembla la tua *racchetta*", rk_fh: "Gomma di dritto", rk_bh: "Gomma di rovescio", rk_blade: "Legno", t_diary: "Registra ogni *sessione*", di1k: "Serie giornaliera", di1v: "Apri l'app ogni giorno e mantieni la serie", di2k: "Foto", di2v: "Immagini dalla palestra", di3k: "Aggiungi attività", di3v: "Registra una sessione in pochi secondi", t_charts: "Guarda i tuoi *progressi*", ch1k: "Andamento", ch1v: "Vittorie, pareggi e sconfitte, incontro per incontro", ch2k: "Progressi negli allenamenti", ch2v: "Ore di allenamento nel tempo", ch3k: "Schermo intero", ch3v: "Ingrandisci qualsiasi grafico", ui_label: "Anteprima animata dell'app", ui_pause: "Metti in pausa l'animazione", ui_play: "Riproduci l'animazione" },
    ro: { t_home: "Sezonul tău *dintr-o privire*", home1k: "Privire de ansamblu asupra sezonului", home1v: "204 activități, pe tipuri", home2k: "Rate de victorie", home2v: "35% meciuri · 41% seturi", home3k: "Ore de antrenament", home3v: "16,5 h în acest sezon", t_racket: "Asamblează-ți *racheta*", rk_fh: "Fața de joc forehand", rk_bh: "Fața de joc backhand", rk_blade: "Lemn", t_diary: "Notează fiecare *antrenament*", di1k: "Serie zilnică", di1v: "Deschide aplicația zilnic și păstrează seria", di2k: "Fotografii", di2v: "Imagini din sală", di3k: "Adaugă activitate", di3v: "Notează un antrenament în câteva secunde", t_charts: "Vezi-ți *progresul*", ch1k: "Formă", ch1v: "Victorii, egalități și înfrângeri, meci cu meci", ch2k: "Progres la antrenament", ch2v: "Orele antrenate în timp", ch3k: "Ecran complet", ch3v: "Mărește orice grafic", ui_label: "Previzualizare animată a aplicației", ui_pause: "Pune animația pe pauză", ui_play: "Redă animația" },
    hu: { t_home: "A szezonod *egy pillantással*", home1k: "Szezonáttekintés", home1v: "204 tevékenység, típus szerint", home2k: "Győzelmi arány", home2v: "35% mérkőzés · 41% játszma", home3k: "Edzésórák", home3v: "16,5 óra ebben a szezonban", t_racket: "Állítsd össze az *ütőd*", rk_fh: "Tenyeres borítás", rk_bh: "Fonák borítás", rk_blade: "Ütőfa", t_diary: "Rögzíts minden *edzést*", di1k: "Napi sorozat", di1v: "Nyisd meg az appot naponta, és tartsd a sorozatot", di2k: "Fotók", di2v: "Képek a teremből", di3k: "Tevékenység hozzáadása", di3v: "Rögzíts egy edzést másodpercek alatt", t_charts: "Kövesd a *fejlődésed*", ch1k: "Formagörbe", ch1v: "Győzelmek, döntetlenek és vereségek, meccsről meccsre", ch2k: "Edzéshaladás", ch2v: "Az edzett órák az idő függvényében", ch3k: "Teljes képernyő", ch3v: "Bármelyik diagram nagyítása", ui_label: "Animált appbemutató", ui_pause: "Animáció szüneteltetése", ui_play: "Animáció lejátszása" },
  };
  const L = Object.assign({}, STR.en, STR[base] || {});
  const em = (s) => s.replace(/\*(.+?)\*/g, '<em>$1</em>');
  const up = (s) => s.toLocaleUpperCase(base);
  const ASSETS = (opts && opts.assets) || '/assets/tour/';

  // WebGL is only needed for the 3-D racket; without it that screen is left out of the loop.
  const hasGL = (() => {
    try { const c = document.createElement('canvas'); return !!(window.THREE && (c.getContext('webgl2') || c.getContext('webgl'))); } catch (e) { return false; }
  })();

  // ---------- timing ----------
  const BPM = 120;
  const BEAT = 60 / BPM; // 0.5 s
  // 'wide': the video's 1920x1080 sheet with callouts either side of the phone.
  // 'tall': a 1080x1800 portrait sheet for phones: big phone, one caption at a time underneath.
  const tall = !!(opts && opts.layout === 'tall');
  const LAYOUT = tall
    ? { W: 1080, H: 1800, pr: 0.8, beats: { home: 11, racket: 15, activity: 11, charts: 11 }, phone: { x: 245.6, y: 300, k: 1.45 }, cap: { x: 60, y: 1580 }, stagger: 1.1, poster: 2.4 }
    : { W: 1920, H: 1080, pr: 1.25, beats: { home: 9, racket: 12, activity: 9, charts: 9 }, phone: { x: 976.9, y: 120, k: 1 }, stagger: 0.26, poster: 3.0 };
  const SW = LAYOUT.W, SH = LAYOUT.H;
  const PLAN = ['home', 'racket', 'activity', 'charts'].map((k) => [k, LAYOUT.beats[k]]).filter(([k]) => hasGL || k !== 'racket');
  const SEC = {};
  { let b = 0; PLAN.forEach(([k, n], i) => { SEC[k] = { i, b0: b, b1: b + n }; b += n; }); }
  const TOTAL_BEATS = PLAN.reduce((a, [, n]) => a + n, 0);
  const DURATION = TOTAL_BEATS * BEAT;
  const at = (b) => b * BEAT;
  const T = Object.fromEntries(Object.entries(SEC).map(([k, v]) => [k, at(v.b0)]));
  const PANS = PLAN.slice(1).map(([k]) => T[k]); // the camera pans one sheet to the right at each section start


// ---------- easing ----------
const clamp01 = (x) => (x < 0 ? 0 : x > 1 ? 1 : x);
const lerp = (a, b, p) => a + (b - a) * p;
const linear = (x) => x;
const easeOutExpo = (x) => (x >= 1 ? 1 : 1 - Math.pow(2, -10 * x));
const easeOutCubic = (x) => 1 - Math.pow(1 - x, 3);
const easeInCubic = (x) => x * x * x;
const easeInOutCubic = (x) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);
function spring(t, zeta = 0.7, omega = 10) {
  if (t <= 0) return 0;
  const wd = omega * Math.sqrt(1 - zeta * zeta);
  return 1 - Math.exp(-zeta * omega * t) * (Math.cos(wd * t) + (zeta * omega / wd) * Math.sin(wd * t));
}
const prog = (t, start, dur, ease = linear) => ease(clamp01((t - start) / dur));
function mulberry32(a) {
  return function () {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const $ = (id) => document.getElementById(id);
const el = (tag, cls, parent) => { const e = document.createElement(tag); if (cls) e.className = cls; parent && parent.appendChild(e); return e; };
const css = (e, o) => { for (const k in o) e.style[k] = o[k]; };
const SVGNS = 'http://www.w3.org/2000/svg';
function sv(tag, attrs, parent) { const e = document.createElementNS(SVGNS, tag); for (const k in attrs) e.setAttribute(k, attrs[k]); parent && parent.appendChild(e); return e; }
function drawable(tag, attrs, parent) { return sv(tag, { fill: 'none', stroke: 'rgba(190,225,255,0.9)', 'stroke-width': 2, pathLength: 1, 'stroke-dasharray': '1 1', 'stroke-dashoffset': 1, ...attrs }, parent); }
const setDraw = (e, p) => e.setAttribute('stroke-dashoffset', 1 - clamp01(p));
function typeText(node, full, p) { const n = Math.round(full.length * clamp01(p)); node.textContent = full.slice(0, n); }
  // ---------- stage ----------
  const stage = el('div', 'tour-s' + (tall ? ' tall' : ''), mount);
  stage.style.width = SW + 'px'; stage.style.height = SH + 'px';
  const grid = el('div', 'tour-grid', stage);
  const sheet = el('div', 'tour-sheet', stage);
  el('div', 'tour-vig', stage);
  sheet.style.width = SW * PLAN.length + 'px';
  const secEl = {};
  PLAN.forEach(([k], i) => { const d = el('div', 'sec', sheet); d.style.left = SW * i + 'px'; d.style.width = SW + 'px'; secEl[k] = d; });
  const eyebrowOf = (k) => `${String(SEC[k].i + 1).padStart(2, '0')} / ${String(PLAN.length).padStart(2, '0')}`;
  function makeHead(parent, key, title) {
    const h = el('div', 'head', parent);
    el('div', 'eyebrow', h).textContent = eyebrowOf(key);
    el('h2', 'title', h).innerHTML = em(title);
    return h;
  }

function headIn(h, t, t0) { const p = prog(t, t0, 0.6, easeOutExpo); css(h, { opacity: p, transform: `translateY(${16 * (1 - p)}px)` }); }
function addLabel(parent, x, y, k, v, right = false) {
  const d = el('div', 'lbl' + (right ? ' r' : ''), parent);
  css(d, { left: (right ? x - 640 : x) + 'px', top: y + 'px', width: right ? '640px' : 'auto' });
  return { d, kk: el('div', 'k', d), vv: el('div', 'v', d), k, v };
}

// phones that go wireframe -> render
const S = 406.2 / 1000;
function makePhone(parent, shot, left, top, k = 1) {
  const ph = el('div', 'phone', parent);
  css(ph, { left: left + 'px', top: top + 'px', transformOrigin: '0 0', transform: k === 1 ? '' : `scale(${k})` });
  const rim = el('div', 'rim', ph);
  const img = el('img', '', ph); img.src = `${ASSETS}device-${shot}.webp`;
  const svg = sv('svg', { width: 416.2, height: 870 }, ph);
  const outline = drawable('rect', { x: 1, y: 1, width: 414.2, height: 868, rx: 68, 'stroke-width': 2.5 }, svg);
  const notch = drawable('rect', { x: 150, y: 28, width: 116, height: 32, rx: 16, 'stroke-width': 2 }, svg);
  const scan = el('div', 'scan', ph);
  return { ph, rim, img, outline, notch, scan, anchor: (x, y) => ({ x: left + x * S * k, y: top + y * S * k }) };
}
function phoneReveal(P, t, t0) {
  setDraw(P.outline, prog(t, t0, 0.7, easeInOutCubic)); setDraw(P.notch, prog(t, t0 + 0.3, 0.4));
  const scanP = prog(t, t0 + 0.55, 0.6, easeInOutCubic);
  const clip = `inset(0 0 ${100 - 100 * scanP}% 0)`;
  P.img.style.clipPath = clip; P.rim.style.clipPath = clip; P.rim.style.opacity = scanP > 0 ? 1 : 0;
  const o = 1 - prog(t, t0 + 1.1, 0.3);
  P.outline.style.opacity = o; P.notch.style.opacity = o;
  css(P.scan, { top: 860 * scanP + 'px', opacity: scanP > 0 && scanP < 1 ? 1 : 0 });
}
  // ---------- callout screens ----------
  // a: anchor in device px; side L/R; y: label top. The phone sits at x 976.9 (centre 1180).
  const CALLOUT_SCREENS = {
    home: { shot: 'home', title: L.t_home, calls: [
      { a: [212, 650], side: 'L', y: 340, k: L.home1k, v: L.home1v },
      { a: [58, 1430], side: 'L', y: 490, k: L.home2k, v: L.home2v },
      { a: [944, 1430], side: 'R', y: 640, k: L.home3k, v: L.home3v },
    ] },
    activity: { shot: 'activity', title: L.t_diary, calls: [
      { a: [60, 164], side: 'L', y: 340, k: L.di1k, v: L.di1v },
      { a: [60, 1100], side: 'L', y: 490, k: L.di2k, v: L.di2v },
      { a: [944, 1786], side: 'R', y: 790, k: L.di3k, v: L.di3v },
    ] },
    charts: { shot: 'charts', title: L.t_charts, calls: [
      { a: [60, 700], side: 'L', y: 340, k: L.ch1k, v: L.ch1v },
      { a: [60, 1500], side: 'L', y: 490, k: L.ch2k, v: L.ch2v },
      { a: [900, 516], side: 'R', y: 340, k: L.ch3k, v: L.ch3v },
    ] },
  };
  const CALL_STAGGER = LAYOUT.stagger;
  // tall layout: a dot with a pulsing ring marks the point being described; its caption sits under the phone
  function pulseDot(ink) {
    return {
      ring: sv('circle', { r: 0, fill: 'none', stroke: '#5fe3f0', 'stroke-width': 4 }, ink),
      dot: sv('circle', { r: 0, fill: '#5fe3f0', stroke: '#0b2a5b', 'stroke-width': 3 }, ink),
    };
  }
  // One callout at a time: callout i owns [s_i, s_i+1); the last one holds until tEnd.
  function windowed(calls, cap, t, sStart, tEnd, pointOf) {
    let active = -1;
    calls.forEach((C, i) => {
      const s = sStart + i * LAYOUT.stagger, e = i === calls.length - 1 ? tEnd : s + LAYOUT.stagger;
      if (t >= s) active = i;
      const A = pointOf(C, i), out = 1 - prog(t, e - 0.2, 0.2), live = t >= s && t < e ? 1 : 0, ph = t >= s ? ((t - s) % 1.1) / 1.1 : 0;
      C.dot.setAttribute('cx', A.x); C.dot.setAttribute('cy', A.y); C.dot.setAttribute('r', 20 * spring(t - s, 0.5, 14) * out);
      C.ring.setAttribute('cx', A.x); C.ring.setAttribute('cy', A.y); C.ring.setAttribute('r', 20 + 38 * ph);
      C.ring.style.opacity = live * (1 - ph) * 0.9;
    });
    if (active < 0) { cap.d.style.opacity = 0; return; }
    const C = calls[active], s = sStart + active * LAYOUT.stagger, e = active === calls.length - 1 ? tEnd : s + LAYOUT.stagger;
    typeText(cap.kk, C.k, prog(t, s + 0.05, 0.25)); typeText(cap.vv, C.v, prog(t, s + 0.15, 0.45));
    cap.d.style.opacity = 1 - prog(t, e - 0.2, 0.2);
  }
  const callSections = Object.entries(CALLOUT_SCREENS).filter(([key]) => SEC[key]).map(([key, C]) => {
    const parent = secEl[key];
    const head = makeHead(parent, key, C.title);
    const phone = makePhone(parent, C.shot, LAYOUT.phone.x, LAYOUT.phone.y, LAYOUT.phone.k);
    const ink = sv('svg', { class: 'ink', width: SW, height: SH }, parent);
    if (tall) {
      const cap = addLabel(parent, LAYOUT.cap.x, LAYOUT.cap.y, '', '');
      const calls = C.calls.map((c) => ({ A: phone.anchor(c.a[0], c.a[1]), k: up(c.k), v: c.v, ...pulseDot(ink) }));
      return { key, head, phone, cap, calls };
    }
    const calls = C.calls.map((c) => {
      const A = phone.anchor(c.a[0], c.a[1]);
      const ex = c.side === 'L' ? 930 : 1430, lx = c.side === 'L' ? 890 : 1470;
      const path = drawable('path', { d: `M ${A.x} ${A.y} L ${ex} ${c.y + 18} L ${lx} ${c.y + 18}`, stroke: 'rgba(95,227,240,0.9)' }, ink);
      const dot = sv('circle', { cx: A.x, cy: A.y, r: 0, fill: '#5fe3f0', stroke: '#0b2a5b', 'stroke-width': 2 }, ink);
      const Lb = addLabel(parent, c.side === 'L' ? 880 : 1480, c.y, up(c.k), c.v, c.side === 'L');
      return { path, dot, L: Lb };
    });
    return { key, head, phone, calls };
  });
  function animateCallSection(CS, t) {
    const t0 = T[CS.key];
    headIn(CS.head, t, t0 + 0.2);
    phoneReveal(CS.phone, t, t0 + 0.15);
    if (tall) { windowed(CS.calls, CS.cap, t, t0 + 1.4, at(SEC[CS.key].b1) - 0.25, (C) => C.A); return; }
    CS.calls.forEach((C, i) => {
      const s = t0 + 1.3 + i * CALL_STAGGER;
      setDraw(C.path, prog(t, s, 0.45, easeInOutCubic));
      C.dot.setAttribute('r', 7 * spring(t - s, 0.5, 14));
      typeText(C.L.kk, C.L.k, prog(t, s + 0.3, 0.3)); typeText(C.L.vv, C.L.v, prog(t, s + 0.4, 0.4));
    });
  }

  // ---------- racket builder: a real 3-D racket (three.js) ----------
  // Dimensions in mm: 152x159 head, 5.8 mm 7-ply ALC blade, 2.1 mm sponges, 1.7 mm topsheets,
  // flared (FL) handle 24 mm thick with laminated cheeks. Rendered inside seek(), never animated on its own.
  const GL = tall ? { x: 20, y: 300, w: 1040, h: 1150 } : { x: 70, y: 250, w: 900, h: 800 };
  const RACK_CAM = { az0: -116, turn: 18, pol: 50, dist: 600, target: [0, 38, 0] };
  let R3 = null, rackHead, glCanvas, rackPhone, rackCap, rackCalls = [];

  if (SEC.racket) {
    const sR = secEl.racket;
    rackHead = makeHead(sR, 'racket', L.t_racket);
    glCanvas = el('canvas', '', sR);
    css(glCanvas, { position: 'absolute', left: GL.x + 'px', top: GL.y + 'px', width: GL.w + 'px', height: GL.h + 'px', opacity: 0 });
    if (!tall) rackPhone = makePhone(sR, 'racket', 1330, 120);
    const rackInk = sv('svg', { class: 'ink', width: SW, height: SH }, sR);
    const RACKET_LABELS = [
      { key: 'fhTop', name: L.rk_fh, v: 'Andro NUZN 50 · 96%', anchor: [58, 120] },
      { key: 'bhTop', name: L.rk_bh, v: 'Xiom Vega Korea · 97%', anchor: [75.4, 92] },
      { key: 'handle', name: L.rk_blade, v: 'Sanwei 75 ALC', anchor: [0, -60] },
    ];
    if (tall) {
      rackCap = addLabel(sR, LAYOUT.cap.x, LAYOUT.cap.y, '', '');
      rackCalls = RACKET_LABELS.map((RL) => ({ L: RL, k: up(RL.name), v: RL.v, ...pulseDot(rackInk) }));
    } else rackCalls = RACKET_LABELS.map((RL) => ({
      L: RL, path: drawable('path', { stroke: 'rgba(95,227,240,0.9)' }, rackInk),
      dot: sv('circle', { r: 0, fill: '#5fe3f0', stroke: '#0b2a5b', 'stroke-width': 2 }, rackInk),
      lab: addLabel(sR, 0, 0, up(RL.name), RL.v),
    }));
    // the topsheet textures print the brand in Space Grotesk, so the font has to be there first
    try { await Promise.all(['700 46px "Space Grotesk"', '700 74px "Space Grotesk"'].map((f) => document.fonts.load(f))); } catch (e) { /* canvas falls back to the default font */ }
    try { R3 = makeRacket3D(glCanvas, GL.w, GL.h); } catch (e) { R3 = null; }
  }


function makeRacket3D(canvas, W, H) {
  const rnd = mulberry32(777);
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, preserveDrawingBuffer: true });
  renderer.setPixelRatio(LAYOUT.pr);
  renderer.setSize(W, H, false);
  renderer.setClearColor(0x000000, 0);
  renderer.outputEncoding = THREE.sRGBEncoding;
  renderer.toneMapping = THREE.NoToneMapping;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(28, W / H, 10, 5000);
  camera.up.set(0, 0, 1);
  scene.add(new THREE.HemisphereLight(0xf2f5ff, 0x3a4a6a, 0.75));
  const key = new THREE.DirectionalLight(0xfff6ea, 1.25);
  key.position.set(110, 70, 520);
  key.castShadow = true;
  key.shadow.mapSize.set(1024, 1024);
  Object.assign(key.shadow.camera, { left: -280, right: 280, top: 280, bottom: -280, near: 50, far: 1400 });
  key.shadow.bias = -0.0004;
  scene.add(key);
  const rim = new THREE.DirectionalLight(0xdfeaff, 0.45); rim.position.set(-320, -260, 170); scene.add(rim);
  const fill = new THREE.DirectionalLight(0xffffff, 0.3); fill.position.set(-220, 320, 280); scene.add(fill);
  // the blueprint sheet catches the shadow
  const ground = new THREE.Mesh(new THREE.PlaneGeometry(4000, 4000), new THREE.ShadowMaterial({ opacity: 0.2 }));
  ground.position.z = -70; ground.receiveShadow = true; scene.add(ground);

  // ---- textures (canvas, seeded) ----
  const tex = (w, h, draw, rep, off) => {
    const c = document.createElement('canvas'); c.width = w; c.height = h;
    draw(c.getContext('2d'), w, h);
    const t = new THREE.CanvasTexture(c);
    t.encoding = THREE.sRGBEncoding; t.wrapS = t.wrapT = THREE.RepeatWrapping; t.anisotropy = 8;
    if (rep) t.repeat.set(rep[0], rep[1]);
    if (off) t.offset.set(off[0], off[1]);
    return t;
  };
  const woodGrain = (g, w, h, dark, n, along = 'y') => {
    for (let i = 0; i < n; i++) {
      const p0 = rnd() * (along === 'y' ? w : h), a = 0.04 + rnd() * 0.12, lw = 0.6 + rnd() * 2.4;
      const amp = 2 + rnd() * 9, ph = rnd() * 6.28, fr = 0.003 + rnd() * 0.012;
      g.strokeStyle = `rgba(${dark},${a})`; g.lineWidth = lw; g.beginPath();
      const L = along === 'y' ? h : w;
      for (let q = 0; q <= L; q += 6) {
        const d = p0 + Math.sin(q * fr + ph) * amp + Math.sin(q * fr * 3.1 + ph) * amp * 0.25;
        if (along === 'y') { q ? g.lineTo(d, q) : g.moveTo(d, q); } else { q ? g.lineTo(q, d) : g.moveTo(q, d); }
      }
      g.stroke();
    }
    for (let i = 0; i < n * 5; i++) {
      g.fillStyle = `rgba(${dark},${0.03 + rnd() * 0.06})`;
      if (along === 'y') g.fillRect(rnd() * w, rnd() * h, 1 + rnd() * 1.5, 3 + rnd() * 9);
      else g.fillRect(rnd() * w, rnd() * h, 3 + rnd() * 9, 1 + rnd() * 1.5);
    }
  };
  const BLADE_D = 5.8, SP_D = 2.1, TS_D = 1.7, HANDLE_D = 22, HB = 5;
  // outer limba veneer of the blade face
  const bladeFace = tex(1024, 1024, (g, w, h) => { g.fillStyle = '#e2c28d'; g.fillRect(0, 0, w, h); woodGrain(g, w, h, '120,78,34', 240); }, [1 / 170, 1 / 290], [0.5, 110 / 290]);
  // the blade edge shows its 7 plies: limba / ALC / ayous / kiri / ayous / ALC / limba
  const PLIES = [[0.14, '#e2c28d'], [0.06, '#3b362d'], [0.16, '#d6af78'], [0.28, '#f0dbad'], [0.16, '#d6af78'], [0.06, '#3b362d'], [0.14, '#e2c28d']];
  const plyBands = (g, w, h, y0, y1) => { let y = y0; PLIES.forEach(([f, c]) => { g.fillStyle = c; g.fillRect(0, y, w, f * (y1 - y0) + 1); y += f * (y1 - y0); }); };
  const plyTex = tex(64, 512, (g, w, h) => plyBands(g, w, h, 0, h), [1 / 40, 1 / BLADE_D], [0, 1 - 1 / BLADE_D]);
  // handle face: laminated strips with grain and the blade logo
  const handleFace = tex(512, 1024, (g, w, h) => {
    const strips = [[0.22, '#c99a62'], [0.06, '#a5713f'], [0.44, '#d2a56c'], [0.06, '#a5713f'], [0.22, '#c99a62']];
    let x = 0; strips.forEach(([f, c]) => { g.fillStyle = c; g.fillRect(x, 0, f * w + 1, h); x += f * w; });
    woodGrain(g, w, h, '95,58,26', 150);
    // small printed logo, like the real thing
    g.save(); g.translate(w / 2, h * 0.42); g.rotate(-Math.PI / 2);
    g.fillStyle = 'rgba(60,30,14,0.8)'; g.font = '700 34px "Space Grotesk"'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText('SANWEI', 0, 0);
    g.restore();
  }, [1 / 48, 1 / 112], [0.5, 104 / 112]);
  // handle side: cheek wood | blade plies | cheek wood, across the thickness
  const HSPAN = HANDLE_D + 2 * HB;
  const handleSide = tex(64, 512, (g, w, h) => {
    g.fillStyle = '#c99a62'; g.fillRect(0, 0, w, h);
    woodGrain(g, w, h, '95,58,26', 30, 'x');
    const r = (z) => ((z + HB) / HSPAN) * h;
    const zb0 = HANDLE_D / 2 - BLADE_D / 2, zb1 = HANDLE_D / 2 + BLADE_D / 2;
    plyBands(g, w, h, r(zb0), r(zb1));
    g.fillStyle = 'rgba(40,24,10,0.6)'; g.fillRect(0, r(zb0) - 1, w, 2); g.fillRect(0, r(zb1) - 1, w, 2);
  }, [1 / 60, 1 / HSPAN], [0, 1 - (1 + HB) / HSPAN]);
  const sponge = tex(512, 512, (g, w, h) => {
    g.fillStyle = '#f0ab3c'; g.fillRect(0, 0, w, h);
    for (let i = 0; i < 14000; i++) { g.fillStyle = `rgba(150,80,10,${0.08 + rnd() * 0.18})`; const r = 0.6 + rnd() * 1.8; g.beginPath(); g.arc(rnd() * w, rnd() * h, r, 0, 6.283); g.fill(); }
    for (let i = 0; i < 4000; i++) { g.fillStyle = `rgba(255,220,150,${0.1 + rnd() * 0.2})`; g.fillRect(rnd() * w, rnd() * h, 1.2, 1.2); }
  }, [1 / 60, 1 / 60]);
  const topsheet = (base, ink, brand, model, noiseA, mirror = false) => tex(1024, 1152, (g, w, h) => {
    g.fillStyle = base; g.fillRect(0, 0, w, h);
    for (let i = 0; i < 40000; i++) { g.fillStyle = `rgba(255,255,255,${rnd() * noiseA})`; g.fillRect(rnd() * w, rnd() * h, 1.4, 1.4); }
    const row = (y) => ((180 - y) / 180) * h;
    if (mirror) { g.translate(w, 0); g.scale(-1, 1); }
    g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillStyle = ink;
    g.font = '700 46px "Space Grotesk"'; g.fillText(brand, w / 2, row(46));
    g.font = '700 74px "Space Grotesk"'; g.fillText(model, w / 2, row(34));
  }, [1 / 160, 1 / 180], [0.5, 0]);

  // ---- shapes (mm, head up, handle down) ----
  const bladeShape = () => {
    const s = new THREE.Shape();
    s.moveTo(0, 175);
    s.bezierCurveTo(48, 175, 76, 150, 76, 100);
    s.bezierCurveTo(76, 55, 52, 26, 24, 16);
    s.bezierCurveTo(18, 13, 16, 8, 16, 2);
    s.lineTo(16.5, -10);
    s.bezierCurveTo(17, -45, 18.5, -75, 19.5, -92);
    s.bezierCurveTo(20, -100, -20, -100, -19.5, -92);
    s.bezierCurveTo(-18.5, -75, -17, -45, -16.5, -10);
    s.lineTo(-16, 2);
    s.bezierCurveTo(-16, 8, -18, 13, -24, 16);
    s.bezierCurveTo(-52, 26, -76, 55, -76, 100);
    s.bezierCurveTo(-76, 150, -48, 175, 0, 175);
    return s;
  };
  const rubberShape = () => {
    const s = new THREE.Shape();
    s.moveTo(0, 174.6);
    s.bezierCurveTo(47.8, 174.6, 75.6, 150, 75.6, 100);
    s.bezierCurveTo(75.6, 55.3, 51.8, 26.5, 24, 16.6);
    s.bezierCurveTo(19, 14.6, 16.6, 12, 15.6, 9.2);
    s.quadraticCurveTo(0, 4.5, -15.6, 9.2);
    s.bezierCurveTo(-16.6, 12, -19, 14.6, -24, 16.6);
    s.bezierCurveTo(-51.8, 26.5, -75.6, 55.3, -75.6, 100);
    s.bezierCurveTo(-75.6, 150, -47.8, 174.6, 0, 174.6);
    return s;
  };
  // flared handle outline; the bevel adds ~3 mm all round, giving a rounded 24 mm-thick grip
  const handleShape = () => {
    const s = new THREE.Shape();
    s.moveTo(-11.8, 4.5);
    s.quadraticCurveTo(0, -5, 11.8, 4.5);
    s.lineTo(12.2, -10);
    s.bezierCurveTo(12.8, -45, 14.4, -74, 15.4, -89);
    s.bezierCurveTo(15.8, -96, -15.8, -96, -15.4, -89);
    s.bezierCurveTo(-14.4, -74, -12.8, -45, -12.2, -10);
    s.lineTo(-11.8, 4.5);
    return s;
  };
  const extrude = (shape, depth, bevel, segs = 3) => new THREE.ExtrudeGeometry(shape, {
    depth, steps: 1, curveSegments: 96, bevelEnabled: bevel > 0, bevelThickness: bevel, bevelSize: bevel * 0.92, bevelSegments: segs,
  });

  // ---- materials ----
  const mat = (o) => new THREE.MeshStandardMaterial(o);
  const bladeMats = [mat({ map: bladeFace, roughness: 0.62 }), mat({ map: plyTex, roughness: 0.75 })];
  const handleMats = [mat({ map: handleFace, roughness: 0.68 }), mat({ map: handleSide, roughness: 0.72 })];
  const spongeMat = mat({ map: sponge, roughness: 0.95 });
  const fhMat = new THREE.MeshPhysicalMaterial({ map: topsheet('#0f1013', '#b9bec6', 'andro', 'NUZN 50', 0.025), roughness: 0.62, clearcoat: 0.25, clearcoatRoughness: 0.5 });
  const bhMat = new THREE.MeshPhysicalMaterial({ map: topsheet('#4aaee0', '#ffffff', 'XIOM', 'VEGA KOREA', 0.04, true), roughness: 0.62, clearcoat: 0.2, clearcoatRoughness: 0.5 });
  const fhSide = mat({ color: 0x15171a, roughness: 0.6 });
  const bhSide = mat({ color: 0x3a93c4, roughness: 0.6 });

  // ---- meshes ----
  const group = new THREE.Group();
  group.rotation.set(0.1, -0.16, 0);
  scene.add(group);
  const add = (geo, mats, z) => { const m = new THREE.Mesh(geo, mats); m.castShadow = true; m.receiveShadow = true; m.userData.base = z; group.add(m); return m; };
  const blade = add(extrude(bladeShape(), BLADE_D, 0.35, 2).translate(0, 0, -BLADE_D / 2), bladeMats, 0);
  const handle = add(extrude(handleShape(), HANDLE_D, HB, 10).translate(0, 0, -HANDLE_D / 2), handleMats, 0);
  const fhSponge = add(extrude(rubberShape(), SP_D, 0).translate(0, 0, BLADE_D / 2), [spongeMat, spongeMat], 0);
  const fhTop = add(extrude(rubberShape(), TS_D, 0.22, 2).translate(0, 0, BLADE_D / 2 + SP_D), [fhMat, fhSide], 0);
  const bhSponge = add(extrude(rubberShape(), SP_D, 0).translate(0, 0, -BLADE_D / 2 - SP_D), [spongeMat, spongeMat], 0);
  const bhTop = add(extrude(rubberShape(), TS_D, 0.22, 2).translate(0, 0, -BLADE_D / 2 - SP_D - TS_D), [bhMat, bhSide], 0);
  const LAYERS = { fhTop: [fhTop, 34, BLADE_D / 2 + SP_D + TS_D, -5], fhSponge: [fhSponge, 34, 0, -5], blade: [blade, 0, BLADE_D / 2, 0], handle: [handle, 0, HANDLE_D / 2 + HB, 0], bhSponge: [bhSponge, -34, 0, 9], bhTop: [bhTop, -34, -BLADE_D / 2 - SP_D - TS_D / 2, 9] };

  const v = new THREE.Vector3();
  let lastKey = null; // skip identical re-renders; the drawing buffer is preserved, so output is unchanged
  function placeCamera(az) {
    const a = (az * Math.PI) / 180, p = (RACK_CAM.pol * Math.PI) / 180, d = RACK_CAM.dist, [tx, ty, tz] = RACK_CAM.target;
    camera.position.set(tx + d * Math.sin(p) * Math.cos(a), ty + d * Math.sin(p) * Math.sin(a), tz + d * Math.cos(p));
    camera.lookAt(tx, ty, tz);
    camera.updateMatrixWorld();
  }
  return {
    render({ E, az, flip = 0 }) {
      const stateKey = `${E.toFixed(6)}|${az.toFixed(5)}|${flip.toFixed(6)}`;
      for (const k in LAYERS) { const [m, dz, , dx] = LAYERS[k]; m.position.z = dz * E; m.position.x = dx * E; }
      group.rotation.set(0.1, -0.16 + Math.PI * flip, 0);
      placeCamera(az);
      group.updateMatrixWorld(true);
      if (stateKey !== lastKey) { renderer.render(scene, camera); lastKey = stateKey; }
    },
    // stage coordinates of a point (x, y in mm) on the visible face of a layer
    project(keyName, x, y) {
      const [m, , zFace] = LAYERS[keyName];
      v.set(x, y, zFace); m.localToWorld(v); v.project(camera);
      return { x: GL.x + ((v.x + 1) / 2) * W, y: GL.y + ((1 - v.y) / 2) * H };
    },
  };
}

  // ---------- seek ----------
  function seek(t) {
    sheet.style.opacity = prog(t, 0, 0.4) * (1 - prog(t, DURATION - 0.4, 0.4));
    let pan = 0;
    PANS.forEach((P) => { pan += prog(t, P - 0.35, 0.75, easeInOutCubic); });
    sheet.style.transform = `translateX(${-SW * pan}px)`;
    const gp = `${-SW * pan}px 0`;
    grid.style.backgroundPosition = [gp, gp, gp, gp].join(', ');
    // only the sections near the camera do any work
    const near = (k) => !!SEC[k] && Math.abs(SEC[k].i - pan) < 1.05;
    Object.keys(secEl).forEach((k) => { secEl[k].style.display = near(k) ? 'block' : 'none'; });

    callSections.forEach((CS) => { if (near(CS.key)) animateCallSection(CS, t); });

  // racket builder: a real 3-D racket explodes into its parts, then clicks back together
  if (near('racket') && R3) {
    const T0 = T.racket, T1 = at(SEC.racket.b1);
    const tq = Math.ceil(t * 60 - 1e-6) / 60;
    headIn(rackHead, t, T0 + 0.2);
    glCanvas.style.opacity = prog(t, T0 - 0.25, 0.6, easeOutCubic);
    const regroup = T1 - 2.3;
    const E = clamp01(spring(tq - (T0 + 0.8), 0.7, 7)) * (1 - prog(tq, regroup, 0.4, easeInOutCubic));
    const flip = prog(tq, T1 - 1.85, 1.25, easeInOutCubic);
    R3.render({ E, az: RACK_CAM.az0 + RACK_CAM.turn * prog(tq, T0 - 0.4, T1 - T0 + 0.4), flip });
    if (tall) windowed(rackCalls, rackCap, t, T0 + 1.5, regroup - 0.1, (C) => R3.project(C.L.key, C.L.anchor[0], C.L.anchor[1]));
    else rackCalls.forEach((C, i) => {
      const A = R3.project(C.L.key, C.L.anchor[0], C.L.anchor[1]);
      const ly = [372, 560, 760][i], lx = 960;
      C.path.setAttribute('d', `M ${A.x} ${A.y} L ${lx - 40} ${ly + 18} L ${lx} ${ly + 18}`);
      const s = T0 + 1.4 + i * 0.26;
      setDraw(C.path, prog(t, s, 0.4, easeInOutCubic));
      C.dot.setAttribute('cx', A.x); C.dot.setAttribute('cy', A.y); C.dot.setAttribute('r', 7 * spring(t - s, 0.5, 14));
      css(C.lab.d, { left: lx + 14 + 'px', top: ly + 'px' });
      typeText(C.lab.kk, C.lab.k, prog(t, s + 0.25, 0.3)); typeText(C.lab.vv, C.lab.v, prog(t, s + 0.35, 0.4));
      const fade = 1 - prog(t, regroup - 0.2, 0.3);
      C.path.style.opacity = fade; C.dot.style.opacity = fade; C.lab.d.style.opacity = fade;
    });
    if (rackPhone) phoneReveal(rackPhone, t, T0 + 1.0);
  }
  }

  // ---------- fit, preload, playback ----------
  const fit = () => { stage.style.transform = `scale(${mount.clientWidth / SW})`; };
  fit();
  const ro = typeof ResizeObserver === 'function' ? new ResizeObserver(fit) : null;
  if (ro) ro.observe(mount); else addEventListener('resize', fit);
  await Promise.all([...stage.querySelectorAll('img')].map((img) => img.decode().catch(() => { throw new Error('tour image failed: ' + img.src); })));
  seek(0);

  let t = 0, playing = false, raf = 0, last = 0, acc = 0, frames = 0, sumDt = 0;
  const lowEnd = (navigator.hardwareConcurrency || 8) <= 4 || (navigator.deviceMemory || 8) <= 2;
  const minDt = lowEnd ? 1 / 30 - 0.002 : 0;
  function frame(now) {
    raf = requestAnimationFrame(frame);
    const dt = Math.min((now - last) / 1000, 0.1); last = now;
    acc += dt;
    if (acc < minDt) return;
    const step = acc; acc = 0;
    // a device that cannot hold ~14 fps over the first 90 frames gets the static screenshots instead
    if (frames < 90) { frames++; sumDt += step; if (frames === 90 && sumDt / 90 > 0.07 && opts && opts.onSlow) opts.onSlow(); }
    t = (t + step) % DURATION; seek(t);
  }
  return {
    duration: DURATION,
    labels: L,
    layout: tall ? 'tall' : 'wide',
    // a finished frame (phone drawn, first callouts typed) for people who asked for reduced motion
    showPoster() { seek(T.home + LAYOUT.poster); },
    seekTo(sec) { seek(((sec % DURATION) + DURATION) % DURATION); },
    get playing() { return playing; },
    play() { if (playing) return; playing = true; last = performance.now(); acc = 0; raf = requestAnimationFrame(frame); },
    pause() { playing = false; cancelAnimationFrame(raf); },
    destroy() { playing = false; cancelAnimationFrame(raf); if (ro) ro.disconnect(); else removeEventListener('resize', fit); stage.remove(); },
  };
};

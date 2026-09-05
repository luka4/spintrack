/* Google tag (gtag.js) — measurement ID only maintained here.
   Analytics only loads after the visitor accepts the cookie banner. */
(function () {
  var MEASUREMENT_ID = "G-FZKNNS3RLX";
  var CONSENT_KEY = "sb-cookie-consent";
  var CONSENT_GRANTED = "granted";
  var CONSENT_DENIED = "denied";

  function readConsent() {
    try {
      return window.localStorage.getItem(CONSENT_KEY);
    } catch (e) {
      return null;
    }
  }

  function writeConsent(value) {
    try {
      window.localStorage.setItem(CONSENT_KEY, value);
    } catch (e) {
      // Storage blocked — consent lasts for this page view only.
    }
  }

  var analyticsStarted = false;

  function startAnalytics() {
    if (analyticsStarted) return;
    analyticsStarted = true;

    var s = document.createElement("script");
    s.async = true;
    s.src = "https://www.googletagmanager.com/gtag/js?id=" + encodeURIComponent(MEASUREMENT_ID);
    document.head.appendChild(s);

    window.dataLayer = window.dataLayer || [];
    function gtag() {
      window.dataLayer.push(arguments);
    }
    window.gtag = gtag;
    gtag("js", new Date());
    gtag("config", MEASUREMENT_ID);

    document.addEventListener(
      "click",
      function (ev) {
        var t = ev.target;
        if (!t || typeof t.closest !== "function") return;
        var a = t.closest("a[href]");
        if (!a) return;
        var href = a.getAttribute("href") || "";
        if (href.indexOf("play.google.com") !== -1) {
          gtag("event", "play_store_cta_click", {
            link_url: href,
          });
        } else if (href.indexOf("apps.apple.com") !== -1 || href.indexOf("itunes.apple.com") !== -1) {
          gtag("event", "app_store_cta_click", {
            link_url: href,
          });
        }
      },
      true
    );
  }

  function grantAnalytics() {
    // Clears a previous opt-out so re-accepting works without a reload.
    window["ga-disable-" + MEASUREMENT_ID] = false;
    startAnalytics();
  }

  function denyAnalytics() {
    // Honoured by gtag.js if it was already loaded earlier in this page view.
    window["ga-disable-" + MEASUREMENT_ID] = true;
    clearAnalyticsCookies();
  }

  function clearAnalyticsCookies() {
    var host = window.location.hostname || "";
    var domains = ["", host, "." + host];
    var parts = host.split(".");
    if (parts.length > 2) domains.push("." + parts.slice(-2).join("."));

    var jar = (document.cookie || "").split(";");
    for (var i = 0; i < jar.length; i++) {
      var name = jar[i].split("=")[0].replace(/^\s+|\s+$/g, "");
      // _ga/_ga_<id> are the only ones this property sets today; the rest are
      // covered so revoking stays correct if Ads/Signals are ever switched on.
      if (!/^(_ga|_gid|_gat|_gcl_|_gac_|FPLC|FPAU)/.test(name)) continue;
      for (var d = 0; d < domains.length; d++) {
        document.cookie =
          name +
          "=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/" +
          (domains[d] ? "; domain=" + domains[d] : "");
      }
    }
  }

  // 19 supported languages, same set as SHOTS_I18N below.
  var COOKIE_I18N = {
    en: {
      label: "Cookie notice",
      text: "This website would like to use analytics cookies to measure visits.",
      accept: "Accept",
      decline: "Decline",
      privacy: "Privacy Policy",
    },
    de: {
      label: "Cookie-Hinweis",
      text: "Diese Website möchte Analyse-Cookies verwenden, um Besuche zu messen.",
      accept: "Akzeptieren",
      decline: "Ablehnen",
      privacy: "Datenschutz",
    },
    fr: {
      label: "Avis relatif aux cookies",
      text: "Ce site souhaite utiliser des cookies d’analyse pour mesurer les visites.",
      accept: "Accepter",
      decline: "Refuser",
      privacy: "Confidentialité",
    },
    es: {
      label: "Aviso de cookies",
      text: "Este sitio web desea usar cookies analíticas para medir las visitas.",
      accept: "Aceptar",
      decline: "Rechazar",
      privacy: "Privacidad",
    },
    pt: {
      label: "Aviso de cookies",
      text: "Este site gostaria de usar cookies de análise para medir as visitas.",
      accept: "Aceitar",
      decline: "Recusar",
      privacy: "Privacidade",
    },
    sv: {
      label: "Cookie-meddelande",
      text: "Den här webbplatsen vill använda analyscookies för att mäta besök.",
      accept: "Acceptera",
      decline: "Neka",
      privacy: "Integritetspolicy",
    },
    da: {
      label: "Cookiemeddelelse",
      text: "Dette websted vil gerne bruge analysecookies til at måle besøg.",
      accept: "Accepter",
      decline: "Afvis",
      privacy: "Privatlivspolitik",
    },
    "zh-hans": {
      label: "Cookie 提示",
      text: "本网站希望使用分析 Cookie 来统计访问量。",
      accept: "接受",
      decline: "拒绝",
      privacy: "隐私政策",
    },
    ja: {
      label: "Cookie に関するお知らせ",
      text: "このサイトでは、アクセス数の計測に分析 Cookie を使用したいと考えています。",
      accept: "同意する",
      decline: "拒否する",
      privacy: "プライバシーポリシー",
    },
    ko: {
      label: "쿠키 알림",
      text: "이 웹사이트는 방문 수를 측정하기 위해 분석 쿠키를 사용하고자 합니다.",
      accept: "동의",
      decline: "거부",
      privacy: "개인정보 처리방침",
    },
    hi: {
      label: "कुकी सूचना",
      text: "यह वेबसाइट विज़िट मापने के लिए एनालिटिक्स कुकीज़ का उपयोग करना चाहती है।",
      accept: "स्वीकारें",
      decline: "अस्वीकारें",
      privacy: "गोपनीयता नीति",
    },
    uk: {
      label: "Повідомлення про файли cookie",
      text: "Цей сайт хотів би використовувати аналітичні файли cookie для вимірювання відвідувань.",
      accept: "Прийняти",
      decline: "Відхилити",
      privacy: "Політика конфіденційності",
    },
    pl: {
      label: "Informacja o plikach cookie",
      text: "Ta strona chciałaby używać analitycznych plików cookie do mierzenia odwiedzin.",
      accept: "Akceptuję",
      decline: "Odrzuć",
      privacy: "Prywatność",
    },
    cs: {
      label: "Oznámení o souborech cookie",
      text: "Tento web by rád používal analytické soubory cookie k měření návštěvnosti.",
      accept: "Přijmout",
      decline: "Odmítnout",
      privacy: "Ochrana soukromí",
    },
    sk: {
      label: "Oznámenie o súboroch cookie",
      text: "Táto stránka by rada používala analytické súbory cookie na meranie návštevnosti.",
      accept: "Prijať",
      decline: "Odmietnuť",
      privacy: "Ochrana súkromia",
    },
    ru: {
      label: "Уведомление о файлах cookie",
      text: "Этот сайт хотел бы использовать аналитические файлы cookie для измерения посещений.",
      accept: "Принять",
      decline: "Отклонить",
      privacy: "Политика конфиденциальности",
    },
    it: {
      label: "Avviso sui cookie",
      text: "Questo sito vorrebbe usare cookie analitici per misurare le visite.",
      accept: "Accetta",
      decline: "Rifiuta",
      privacy: "Privacy",
    },
    ro: {
      label: "Notificare privind cookie-urile",
      text: "Acest site ar dori să folosească cookie-uri de analiză pentru a măsura vizitele.",
      accept: "Accept",
      decline: "Refuz",
      privacy: "Confidențialitate",
    },
    hu: {
      label: "Süti tájékoztató",
      text: "Ez a webhely analitikai sütiket szeretne használni a látogatások méréséhez.",
      accept: "Elfogadom",
      decline: "Elutasítom",
      privacy: "Adatvédelem",
    },
  };

  function resolveCookieCopy() {
    var lang = getPageLang();
    return COOKIE_I18N[lang] || COOKIE_I18N[lang.split("-")[0]] || COOKIE_I18N.en;
  }

  function resolvePrivacyHref() {
    // The footer already carries the localized privacy URL for this page.
    var link = document.querySelector('.footer-links a[href*="privacy"]');
    return (link && link.getAttribute("href")) || "/privacy.html";
  }

  function showCookieBanner() {
    if (!document.body) return;
    if (document.getElementById("cookie-banner")) return;

    var copy = resolveCookieCopy();

    var banner = document.createElement("div");
    banner.id = "cookie-banner";
    banner.className = "cookie-banner";
    banner.setAttribute("role", "region");
    banner.setAttribute("aria-label", copy.label);

    var inner = document.createElement("div");
    inner.className = "cookie-banner-inner";

    var text = document.createElement("p");
    text.className = "cookie-banner-text";
    text.appendChild(document.createTextNode(copy.text + " "));

    var privacyLink = document.createElement("a");
    privacyLink.className = "cookie-banner-link";
    privacyLink.href = resolvePrivacyHref();
    privacyLink.textContent = copy.privacy;
    text.appendChild(privacyLink);

    var actions = document.createElement("div");
    actions.className = "cookie-banner-actions";

    var declineBtn = document.createElement("button");
    declineBtn.type = "button";
    declineBtn.className = "cookie-btn cookie-btn-decline";
    declineBtn.textContent = copy.decline;

    var acceptBtn = document.createElement("button");
    acceptBtn.type = "button";
    acceptBtn.className = "cookie-btn cookie-btn-accept";
    acceptBtn.textContent = copy.accept;

    function dismiss() {
      if (banner.parentNode) banner.parentNode.removeChild(banner);
    }

    declineBtn.addEventListener("click", function () {
      writeConsent(CONSENT_DENIED);
      dismiss();
      denyAnalytics();
    });

    acceptBtn.addEventListener("click", function () {
      writeConsent(CONSENT_GRANTED);
      dismiss();
      grantAnalytics();
    });

    actions.appendChild(declineBtn);
    actions.appendChild(acceptBtn);
    inner.appendChild(text);
    inner.appendChild(actions);
    banner.appendChild(inner);
    document.body.appendChild(banner);
  }

  // Cookie settings page. All copy is localized in the HTML and read from
  // data-* attributes, so this stays language-agnostic.
  function bootCookieSettings() {
    var panel = document.getElementById("cookie-settings");
    if (!panel) return false;

    var statusEl = panel.querySelector("[data-cookie-status]");
    var savedEl = panel.querySelector("[data-cookie-saved]");
    var buttons = panel.querySelectorAll("[data-cookie-choice]");

    function stateKey(consent) {
      if (consent === CONSENT_GRANTED) return "granted";
      if (consent === CONSENT_DENIED) return "denied";
      return "unset";
    }

    function render() {
      var consent = readConsent();
      var key = stateKey(consent);
      if (statusEl) {
        statusEl.textContent = statusEl.getAttribute("data-status-" + key) || "";
        statusEl.setAttribute("data-state", key);
      }
      for (var i = 0; i < buttons.length; i++) {
        var choice = buttons[i].getAttribute("data-cookie-choice");
        buttons[i].setAttribute("aria-pressed", choice === key ? "true" : "false");
      }
    }

    function choose(choice) {
      if (choice === "granted") {
        writeConsent(CONSENT_GRANTED);
        grantAnalytics();
      } else {
        writeConsent(CONSENT_DENIED);
        denyAnalytics();
      }
      render();
      if (savedEl) savedEl.hidden = false;
    }

    for (var i = 0; i < buttons.length; i++) {
      (function (btn) {
        btn.addEventListener("click", function () {
          choose(btn.getAttribute("data-cookie-choice"));
        });
      })(buttons[i]);
    }

    render();
    return true;
  }

  function bootCookieConsent() {
    var consent = readConsent();
    if (consent === CONSENT_GRANTED) startAnalytics();

    // The settings page carries its own controls; no banner on top of them.
    var hasSettings = bootCookieSettings();
    if (consent === CONSENT_GRANTED || consent === CONSENT_DENIED) return;
    if (hasSettings) return;
    showCookieBanner();
  }


  function isLandingPage() {
    // Landing pages have the hero block with store badges.
    if (!document.querySelector(".hero .store-row")) return false;
    if (!document.querySelector("footer.site-footer")) return false;
    return true;
  }

  function getPageLang() {
    var raw = (document.documentElement && document.documentElement.lang) || "en";
    return (raw || "en").toLowerCase();
  }

  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  // 19 supported languages: en, de, fr, es, pt, sv, da, zh-Hans, ja, ko, hi, uk, pl, cs, sk, ru, it, ro, hu
  var SHOTS_I18N = {
    en: [
      {
        h: "Track your progress",
        d: "Review your progress and stats over time with powerful filters.",
      },
      {
        h: "Summaries",
        d: "See your overall performance by opponent or partner.",
      },
      {
        h: "Add activities",
        d: "Log training sessions and matches with notes and photos.",
      },
      {
        h: "Opponents & friends",
        d: "View detailed stats for your opponents and friends.",
      },
      {
        h: "Social",
        d: "Add friends and share matches with them.",
      },
      {
        h: "Inventory",
        d: "Track your equipment and its condition.",
      },
    ],
    de: [
      { h: "Fortschritt verfolgen", d: "Sieh dir deinen Fortschritt und deine Statistiken im Zeitverlauf mit leistungsstarken Filtern an." },
      { h: "Zusammenfassungen", d: "Sieh deine Gesamtleistung nach Gegner oder Partner." },
      { h: "Aktivitäten hinzufügen", d: "Protokolliere Trainings und Matches mit Notizen und Fotos." },
      { h: "Gegner & Freunde", d: "Sieh dir detaillierte Statistiken zu deinen Gegnern und Freunden an." },
      { h: "Social", d: "Füge Freunde hinzu und teile Matches mit ihnen." },
      { h: "Inventar", d: "Behalte deine Ausrüstung und ihren Zustand im Blick." },
    ],
    fr: [
      { h: "Suivez vos progrès", d: "Consultez votre progression et vos statistiques dans le temps grâce à des filtres puissants." },
      { h: "Récapitulatif", d: "Visualisez vos performances globales par adversaire ou partenaire." },
      { h: "Ajoutez des activités", d: "Enregistrez vos entraînements et matchs avec des notes et des photos." },
      { h: "Adversaires et amis", d: "Consultez des statistiques détaillées sur vos adversaires et amis." },
      { h: "Social", d: "Ajoutez des amis et partagez vos matchs avec eux." },
      { h: "Inventaire", d: "Suivez votre équipement et son état." },
    ],
    es: [
      { h: "Sigue tu progreso", d: "Revisa tu progreso y estadísticas a lo largo del tiempo con filtros potentes." },
      { h: "Resúmenes", d: "Mira tu rendimiento global por rival o compañero." },
      { h: "Añade actividades", d: "Registra entrenamientos y partidos con notas y fotos." },
      { h: "Rivales y amigos", d: "Consulta estadísticas detalladas de tus rivales y amigos." },
      { h: "Social", d: "Añade amigos y comparte partidos con ellos." },
      { h: "Inventario", d: "Controla tu equipo y su estado." },
    ],
    pt: [
      { h: "Acompanhe seu progresso", d: "Veja seu progresso e estatísticas ao longo do tempo com filtros poderosos." },
      { h: "Resumos", d: "Veja seu desempenho geral por adversário ou parceiro." },
      { h: "Adicione atividades", d: "Registre treinos e partidas com notas e fotos." },
      { h: "Adversários e amigos", d: "Veja estatísticas detalhadas de adversários e amigos." },
      { h: "Social", d: "Adicione amigos e compartilhe partidas com eles." },
      { h: "Inventário", d: "Acompanhe seu equipamento e seu estado." },
    ],
    sv: [
      { h: "Följ dina framsteg", d: "Se din utveckling och statistik över tid med kraftfulla filter." },
      { h: "Sammanfattningar", d: "Se din totala prestation per motståndare eller partner." },
      { h: "Lägg till aktiviteter", d: "Logga träningspass och matcher med anteckningar och foton." },
      { h: "Motståndare och vänner", d: "Se detaljerad statistik om dina motståndare och vänner." },
      { h: "Socialt", d: "Lägg till vänner och dela matcher med dem." },
      { h: "Inventarie", d: "Håll koll på din utrustning och dess skick." },
    ],
    da: [
      { h: "Følg dine fremskridt", d: "Se dine fremskridt og statistikker over tid med kraftfulde filtre." },
      { h: "Opsummeringer", d: "Se din samlede præstation pr. modstander eller makker." },
      { h: "Tilføj aktiviteter", d: "Log træninger og kampe med noter og billeder." },
      { h: "Modstandere og venner", d: "Se detaljerede statistikker om dine modstandere og venner." },
      { h: "Socialt", d: "Tilføj venner og del kampe med dem." },
      { h: "Inventar", d: "Hold styr på dit udstyr og dets tilstand." },
    ],
    "zh-hans": [
      { h: "查看进步", d: "使用强大的筛选器，按时间查看你的进步与统计数据。" },
      { h: "汇总", d: "按对手或搭档查看你的整体表现。" },
      { h: "添加活动", d: "记录训练和比赛，支持备注与照片。" },
      { h: "对手与好友", d: "查看对手和好友的详细统计信息。" },
      { h: "社交", d: "添加好友并与他们分享比赛记录。" },
      { h: "装备管理", d: "跟踪你的装备及其状态。" },
    ],
    ja: [
      { h: "成長をチェック", d: "強力なフィルターで、時間ごとの進捗と統計を確認できます。" },
      { h: "サマリー", d: "対戦相手やパートナー別に総合成績を確認できます。" },
      { h: "アクティビティ追加", d: "練習や試合をメモや写真付きで記録できます。" },
      { h: "対戦相手と友達", d: "対戦相手や友達の詳細な統計を確認できます。" },
      { h: "ソーシャル", d: "友達を追加して、試合を共有できます。" },
      { h: "インベントリ", d: "用具とその状態を管理できます。" },
    ],
    ko: [
      { h: "진행 상황 확인", d: "강력한 필터로 시간에 따른 진행 상황과 통계를 확인하세요." },
      { h: "요약", d: "상대/파트너별 전체 성과를 확인하세요." },
      { h: "활동 추가", d: "훈련과 경기를 메모와 사진과 함께 기록하세요." },
      { h: "상대와 친구", d: "상대와 친구의 상세 통계를 확인하세요." },
      { h: "소셜", d: "친구를 추가하고 경기 기록을 공유하세요." },
      { h: "장비 관리", d: "장비와 상태를 추적하세요." },
    ],
    hi: [
      { h: "प्रगति देखें", d: "शक्तिशाली फ़िल्टर के साथ समय के साथ अपनी प्रगति और आँकड़े देखें।" },
      { h: "सारांश", d: "प्रतिद्वंद्वी या पार्टनर के अनुसार अपना समग्र प्रदर्शन देखें।" },
      { h: "गतिविधियाँ जोड़ें", d: "नोट्स और फ़ोटो के साथ ट्रेनिंग सेशन और मैच लॉग करें।" },
      { h: "प्रतिद्वंद्वी और दोस्त", d: "अपने प्रतिद्वंद्वियों और दोस्तों के विस्तृत आँकड़े देखें।" },
      { h: "सोशल", d: "दोस्त जोड़ें और उनके साथ मैच साझा करें।" },
      { h: "इन्वेंटरी", d: "अपने उपकरण और उसकी स्थिति को ट्रैक करें।" },
    ],
    uk: [
      { h: "Відстежуйте прогрес", d: "Переглядайте прогрес і статистику з часом за допомогою потужних фільтрів." },
      { h: "Підсумки", d: "Дивіться загальну результативність за суперником або партнером." },
      { h: "Додавайте активності", d: "Записуйте тренування та матчі з нотатками й фото." },
      { h: "Суперники та друзі", d: "Переглядайте детальну статистику ваших суперників і друзів." },
      { h: "Соціальне", d: "Додавайте друзів і діліться з ними матчами." },
      { h: "Інвентар", d: "Відстежуйте екіпірування та його стан." },
    ],
    pl: [
      { h: "Śledź postępy", d: "Sprawdzaj postęp i statystyki w czasie dzięki zaawansowanym filtrom." },
      { h: "Podsumowania", d: "Zobacz ogólną skuteczność według przeciwnika lub partnera." },
      { h: "Dodawaj aktywności", d: "Zapisuj treningi i mecze z notatkami oraz zdjęciami." },
      { h: "Przeciwnicy i znajomi", d: "Przeglądaj szczegółowe statystyki przeciwników i znajomych." },
      { h: "Społeczność", d: "Dodawaj znajomych i udostępniaj im mecze." },
      { h: "Ekwipunek", d: "Śledź swój sprzęt i jego stan." },
    ],
    cs: [
      { h: "Sledujte pokrok", d: "Prohlížejte si svůj pokrok a statistiky v čase pomocí výkonných filtrů." },
      { h: "Souhrny", d: "Zobrazte svůj celkový výkon podle soupeře nebo partnera." },
      { h: "Přidávejte aktivity", d: "Zapisujte tréninky i zápasy s poznámkami a fotkami." },
      { h: "Soupeři a přátelé", d: "Zobrazte detailní statistiky soupeřů i přátel." },
      { h: "Sociální", d: "Přidejte si přátele a sdílejte s nimi zápasy." },
      { h: "Inventář", d: "Sledujte své vybavení a jeho stav." },
    ],
    sk: [
      { h: "Sledujte pokrok", d: "Pozrite si svoj pokrok a štatistiky v čase pomocou výkonných filtrov." },
      { h: "Súhrny", d: "Pozrite si celkový výkon podľa súpera alebo partnera." },
      { h: "Pridajte aktivity", d: "Zaznamenávajte tréningy a zápasy s poznámkami a fotkami." },
      { h: "Súperi a priatelia", d: "Pozrite si detailné štatistiky súperov a priateľov." },
      { h: "Sociálne", d: "Pridajte priateľov a zdieľajte s nimi zápasy." },
      { h: "Inventár", d: "Sledujte výbavu a jej stav." },
    ],
    ru: [
      { h: "Следите за прогрессом", d: "Просматривайте прогресс и статистику во времени с помощью мощных фильтров." },
      { h: "Сводка", d: "Смотрите общую результативность по сопернику или партнёру." },
      { h: "Добавляйте активности", d: "Записывайте тренировки и матчи с заметками и фотографиями." },
      { h: "Соперники и друзья", d: "Смотрите подробную статистику по соперникам и друзьям." },
      { h: "Социальное", d: "Добавляйте друзей и делитесь матчами с ними." },
      { h: "Инвентарь", d: "Отслеживайте экипировку и её состояние." },
    ],
    it: [
      { h: "Tieni traccia dei progressi", d: "Controlla i tuoi progressi e le statistiche nel tempo con filtri potenti." },
      { h: "Riepiloghi", d: "Vedi le tue prestazioni complessive per avversario o partner." },
      { h: "Aggiungi attività", d: "Registra allenamenti e partite con note e foto." },
      { h: "Avversari e amici", d: "Consulta statistiche dettagliate su avversari e amici." },
      { h: "Social", d: "Aggiungi amici e condividi le partite con loro." },
      { h: "Inventario", d: "Tieni traccia dell’attrezzatura e del suo stato." },
    ],
    ro: [
      { h: "Urmărește progresul", d: "Vezi progresul și statisticile în timp cu filtre puternice." },
      { h: "Rezumat", d: "Vezi performanța generală pe adversar sau partener." },
      { h: "Adaugă activități", d: "Înregistrează antrenamente și meciuri cu notițe și fotografii." },
      { h: "Adversari și prieteni", d: "Vezi statistici detaliate despre adversari și prieteni." },
      { h: "Social", d: "Adaugă prieteni și partajează meciuri cu ei." },
      { h: "Inventar", d: "Urmărește echipamentul și starea lui." },
    ],
    hu: [
      { h: "Kövesd a fejlődést", d: "Nézd meg a fejlődésedet és a statisztikáidat idővel, erős szűrőkkel." },
      { h: "Összegzés", d: "Lásd az összteljesítményt ellenfél vagy partner szerint." },
      { h: "Tevékenységek hozzáadása", d: "Rögzíts edzéseket és meccseket jegyzetekkel és fotókkal." },
      { h: "Ellenfelek és barátok", d: "Nézd meg az ellenfelek és barátok részletes statisztikáit." },
      { h: "Közösség", d: "Adj hozzá barátokat, és oszd meg velük a meccseket." },
      { h: "Felszerelés", d: "Kövesd a felszerelésedet és annak állapotát." },
    ],
  };

  function resolveShotsForPage() {
    var lang = getPageLang();
    return SHOTS_I18N[lang] || SHOTS_I18N[lang.split("-")[0]] || SHOTS_I18N.en;
  }

  function ensureShotsModal() {
    var existing = document.getElementById("shots-modal");
    if (existing) return existing;

    var modal = document.createElement("div");
    modal.id = "shots-modal";
    modal.className = "shots-modal";
    modal.setAttribute("aria-hidden", "true");
    modal.hidden = true;
    modal.innerHTML =
      '<div class="shots-modal-backdrop" data-shots-close="1"></div>' +
      '<div class="shots-modal-panel" role="dialog" aria-modal="true" aria-label="Screenshot viewer">' +
      '  <button class="shots-modal-close" type="button" aria-label="Close" data-shots-close="1">&#x2715;</button>' +
      '  <button class="shots-modal-nav shots-modal-prev" type="button" aria-label="Previous screenshot">&#x2039;</button>' +
      '  <button class="shots-modal-nav shots-modal-next" type="button" aria-label="Next screenshot">&#x203A;</button>' +
      '  <div class="shots-modal-body">' +
      '    <img class="shots-modal-img" alt="" decoding="async" />' +
      '    <div class="shots-modal-caption">' +
      '      <h3 class="shots-modal-head"></h3>' +
      '      <p class="shots-modal-desc"></p>' +
      "    </div>" +
      "  </div>" +
      "</div>";

    document.body.appendChild(modal);
    return modal;
  }

  function ensureScreenshotsSection(shots) {
    if (!isLandingPage()) return null;

    var existing = document.getElementById("screenshots");
    if (existing) return existing;

    var footer = document.querySelector("footer.site-footer");
    if (!footer || !footer.parentNode) return null;

    var section = document.createElement("section");
    section.className = "screenshots-section";
    section.id = "screenshots";
    section.setAttribute("aria-label", "App screenshots");

    section.innerHTML =
      '<div class="screenshots-inner">' +
      '  <div class="shots-viewport">' +
      '    <button class="shots-btn shots-prev" type="button" aria-label="Previous screenshots">&#x2039;</button>' +
      '    <button class="shots-btn shots-next" type="button" aria-label="Next screenshots">&#x203A;</button>' +
      '    <ul class="shots-track" aria-label="Screenshot slider">' +
      '      <li class="shot-item"><button class="shot-card" type="button" data-shot-index="0"><img class="shot-img" src="/assets/image1.jpg" alt="App screenshot 1" loading="lazy" decoding="async" /><div class="shot-caption"><h3 class="shot-head">' +
      escapeHtml(shots[0].h) +
      '</h3><p class="shot-desc">' +
      escapeHtml(shots[0].d) +
      "</p></div></button></li>" +
      '      <li class="shot-item"><button class="shot-card" type="button" data-shot-index="1"><img class="shot-img" src="/assets/image2.jpg" alt="App screenshot 2" loading="lazy" decoding="async" /><div class="shot-caption"><h3 class="shot-head">' +
      escapeHtml(shots[1].h) +
      '</h3><p class="shot-desc">' +
      escapeHtml(shots[1].d) +
      "</p></div></button></li>" +
      '      <li class="shot-item"><button class="shot-card" type="button" data-shot-index="2"><img class="shot-img" src="/assets/image3.jpg" alt="App screenshot 3" loading="lazy" decoding="async" /><div class="shot-caption"><h3 class="shot-head">' +
      escapeHtml(shots[2].h) +
      '</h3><p class="shot-desc">' +
      escapeHtml(shots[2].d) +
      "</p></div></button></li>" +
      '      <li class="shot-item"><button class="shot-card" type="button" data-shot-index="3"><img class="shot-img" src="/assets/image4.jpg" alt="App screenshot 4" loading="lazy" decoding="async" /><div class="shot-caption"><h3 class="shot-head">' +
      escapeHtml(shots[3].h) +
      '</h3><p class="shot-desc">' +
      escapeHtml(shots[3].d) +
      "</p></div></button></li>" +
      '      <li class="shot-item"><button class="shot-card" type="button" data-shot-index="4"><img class="shot-img" src="/assets/image5.jpg" alt="App screenshot 5" loading="lazy" decoding="async" /><div class="shot-caption"><h3 class="shot-head">' +
      escapeHtml(shots[4].h) +
      '</h3><p class="shot-desc">' +
      escapeHtml(shots[4].d) +
      "</p></div></button></li>" +
      '      <li class="shot-item"><button class="shot-card" type="button" data-shot-index="5"><img class="shot-img" src="/assets/image6.jpg" alt="App screenshot 6" loading="lazy" decoding="async" /><div class="shot-caption"><h3 class="shot-head">' +
      escapeHtml(shots[5].h) +
      '</h3><p class="shot-desc">' +
      escapeHtml(shots[5].d) +
      "</p></div></button></li>" +
      "    </ul>" +
      "  </div>" +
      "</div>";

    footer.parentNode.insertBefore(section, footer);
    return section;
  }

  function initShotsSlider(section, shots) {
    if (!section) return;

    var track = section.querySelector(".shots-track");
    var prevBtn = section.querySelector(".shots-prev");
    var nextBtn = section.querySelector(".shots-next");
    if (!track || !prevBtn || !nextBtn) return;

    function viewerEnabled() {
      // Mobile-only: on desktop the in-page viewer must not open.
      return window.matchMedia && window.matchMedia("(max-width: 720px)").matches;
    }

    var modal = ensureShotsModal();
    var modalImg = modal.querySelector(".shots-modal-img");
    var modalHead = modal.querySelector(".shots-modal-head");
    var modalDesc = modal.querySelector(".shots-modal-desc");
    var modalPrev = modal.querySelector(".shots-modal-prev");
    var modalNext = modal.querySelector(".shots-modal-next");
    var modalPanel = modal.querySelector(".shots-modal-panel");

    var modalOpen = false;
    var modalIndex = 0;

    function shotSrcByIndex(i) {
      return "/assets/image" + (i + 1) + ".jpg";
    }

    function setModalIndex(nextIndex) {
      var total = shots.length;
      var idx = ((nextIndex % total) + total) % total;
      modalIndex = idx;
      modalImg.src = shotSrcByIndex(idx);
      modalImg.alt = "App screenshot " + (idx + 1);
      modalHead.textContent = shots[idx].h || "";
      modalDesc.textContent = shots[idx].d || "";
    }

    function openModalAt(index, pushHistory) {
      if (!viewerEnabled()) return;
      if (!modal) return;
      if (!modalOpen) {
        modal.hidden = false;
        modal.setAttribute("aria-hidden", "false");
        document.body.classList.add("shots-modal-open");
        modalOpen = true;
      }
      setModalIndex(index);

      if (pushHistory) {
        try {
          history.pushState({ shotsModal: true }, "", "#shot-" + (index + 1));
        } catch (e) {
          // ignore
        }
      }

      // Focus inside dialog for accessibility
      if (modalPanel && typeof modalPanel.focus === "function") modalPanel.focus();
    }

    function closeModal(viaHistoryBack) {
      if (!modalOpen) return;
      modalOpen = false;
      modal.hidden = true;
      modal.setAttribute("aria-hidden", "true");
      document.body.classList.remove("shots-modal-open");
      modalImg.removeAttribute("src");

      if (!viaHistoryBack) {
        // Prefer browser back so URL/state is restored.
        try {
          if (history.state && history.state.shotsModal) history.back();
        } catch (e) {
          // ignore
        }
      }
    }

    modal.addEventListener("click", function (ev) {
      var t = ev.target;
      if (!t) return;
      if (t && t.getAttribute && t.getAttribute("data-shots-close") === "1") {
        closeModal(false);
      }
    });
    modalPrev.addEventListener("click", function () {
      openModalAt(modalIndex - 1, true);
    });
    modalNext.addEventListener("click", function () {
      openModalAt(modalIndex + 1, true);
    });

    window.addEventListener("popstate", function () {
      if (modalOpen) closeModal(true);
    });

    window.addEventListener("keydown", function (ev) {
      if (!modalOpen) return;
      if (ev.key === "Escape") closeModal(false);
      else if (ev.key === "ArrowLeft") openModalAt(modalIndex - 1, true);
      else if (ev.key === "ArrowRight") openModalAt(modalIndex + 1, true);
    });

    track.addEventListener("click", function (ev) {
      if (!viewerEnabled()) return;
      var t = ev.target;
      if (!t || typeof t.closest !== "function") return;
      var btn = t.closest("button[data-shot-index]");
      if (!btn) return;
      var idx = parseInt(btn.getAttribute("data-shot-index") || "0", 10);
      if (isNaN(idx)) idx = 0;
      openModalAt(idx, true);
    });

    function updateCropVars() {
      var imgs = track.querySelectorAll("img.shot-img");
      for (var i = 0; i < imgs.length; i++) {
        var img = imgs[i];
        var card = img.closest(".shot-card");
        if (!card) continue;
        var h = img.getBoundingClientRect().height || 0;
        if (h <= 0) continue;
        var cropPx = Math.max(0, Math.round(h * 0.05));
        card.style.setProperty("--shot-crop-px", cropPx + "px");
      }
    }

    function maxScrollLeft() {
      return Math.max(0, track.scrollWidth - track.clientWidth);
    }

    function atStart() {
      return track.scrollLeft <= 2;
    }

    function atEnd() {
      return track.scrollLeft >= maxScrollLeft() - 2;
    }

    function updateButtons() {
      var max = maxScrollLeft();
      var canScroll = max > 4;
      prevBtn.disabled = !canScroll;
      nextBtn.disabled = !canScroll;
    }

    function scrollPage(dir) {
      var max = maxScrollLeft();
      if (max <= 4) return;

      var firstItem = track.querySelector(".shot-item");
      var itemRect = firstItem ? firstItem.getBoundingClientRect() : null;
      var itemW = itemRect ? itemRect.width : 0;
      var styles = window.getComputedStyle(track);
      var gap = parseFloat(styles.columnGap || styles.gap || "0") || 0;
      var step = Math.max(1, Math.round(itemW + gap));

      if (dir > 0 && atEnd()) {
        track.scrollTo({ left: 0, behavior: "smooth" });
        return;
      }
      if (dir < 0 && atStart()) {
        track.scrollTo({ left: max, behavior: "smooth" });
        return;
      }

      track.scrollBy({ left: dir * step, behavior: "smooth" });
    }

    prevBtn.addEventListener("click", function () {
      scrollPage(-1);
    });
    nextBtn.addEventListener("click", function () {
      scrollPage(1);
    });

    window.addEventListener(
      "resize",
      function () {
        updateButtons();
        updateCropVars();
        if (!viewerEnabled() && modalOpen) closeModal(true);
      },
      { passive: true }
    );

    track.addEventListener(
      "scroll",
      function () {
        updateButtons();
      },
      { passive: true }
    );

    updateButtons();
    updateCropVars();

    var imgs = track.querySelectorAll("img.shot-img");
    for (var i = 0; i < imgs.length; i++) {
      imgs[i].addEventListener(
        "load",
        function () {
          updateCropVars();
        },
        { passive: true }
      );
    }
  }

  function bootScreenshots() {
    var shots = resolveShotsForPage();
    var section = ensureScreenshotsSection(shots);
    initShotsSlider(section, shots);
  }

  function boot() {
    bootCookieConsent();
    bootScreenshots();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();

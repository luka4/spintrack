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

  // 19 supported languages, same set as SHOTS_LANGS below (which has no `hi` entry).
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

  // Localized App Store screenshots (assets/screenshots/<lang>/1..8.webp).
  // 19 supported languages: en, de, fr, es, pt, sv, da, zh-Hans, ja, ko, hi, uk, pl, cs, sk, ru, it, ro, hu
  // `hi` has no localized store screenshots, so it falls back to the English set.
  var SHOTS_LANGS = [
    "en",
    "de",
    "fr",
    "es",
    "pt",
    "sv",
    "da",
    "zh",
    "ja",
    "ko",
    "uk",
    "pl",
    "cs",
    "sk",
    "ru",
    "it",
    "ro",
    "hu",
  ];
  var SHOTS_COUNT = 8;
  // Intrinsic size of every generated screenshot — set on <img> so the slider does not shift while loading.
  var SHOT_W = 900;
  var SHOT_H = 1947;

  function resolveShotsLang() {
    var lang = getPageLang();
    var base = lang.split("-")[0];
    if (SHOTS_LANGS.indexOf(lang) !== -1) return lang;
    if (SHOTS_LANGS.indexOf(base) !== -1) return base;
    return "en";
  }

  function shotSrc(lang, index) {
    return "/assets/screenshots/" + lang + "/" + (index + 1) + ".webp";
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
      "  </div>" +
      "</div>";

    document.body.appendChild(modal);
    return modal;
  }

  function ensureScreenshotsSection(lang) {
    if (!isLandingPage()) return null;

    var existing = document.getElementById("screenshots");
    if (existing) return existing;

    var footer = document.querySelector("footer.site-footer");
    if (!footer || !footer.parentNode) return null;

    var section = document.createElement("section");
    section.className = "screenshots-section";
    section.id = "screenshots";
    section.setAttribute("aria-label", "App screenshots");

    var slides = "";
    for (var i = 0; i < SHOTS_COUNT; i++) {
      slides +=
        '<li class="shot-item"><button class="shot-card" type="button" data-shot-index="' +
        i +
        '"><img class="shot-img" src="' +
        shotSrc(lang, i) +
        '" width="' +
        SHOT_W +
        '" height="' +
        SHOT_H +
        '" alt="SpinBook app screenshot ' +
        (i + 1) +
        '" loading="lazy" decoding="async" /></button></li>';
    }

    section.innerHTML =
      '<div class="screenshots-inner">' +
      '  <div class="shots-viewport">' +
      '    <button class="shots-btn shots-prev" type="button" aria-label="Previous screenshots">&#x2039;</button>' +
      '    <button class="shots-btn shots-next" type="button" aria-label="Next screenshots">&#x203A;</button>' +
      '    <ul class="shots-track" aria-label="Screenshot slider">' +
      slides +
      "    </ul>" +
      "  </div>" +
      "</div>";

    footer.parentNode.insertBefore(section, footer);
    return section;
  }

  function initShotsSlider(section, lang) {
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
    var modalPrev = modal.querySelector(".shots-modal-prev");
    var modalNext = modal.querySelector(".shots-modal-next");
    var modalPanel = modal.querySelector(".shots-modal-panel");

    var modalOpen = false;
    var modalIndex = 0;

    function setModalIndex(nextIndex) {
      var total = SHOTS_COUNT;
      var idx = ((nextIndex % total) + total) % total;
      modalIndex = idx;
      modalImg.src = shotSrc(lang, idx);
      modalImg.alt = "SpinBook app screenshot " + (idx + 1);
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
  }

  function bootScreenshots() {
    var lang = resolveShotsLang();
    var section = ensureScreenshotsSection(lang);
    initShotsSlider(section, lang);
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

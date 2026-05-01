/* Google tag (gtag.js) — measurement ID only maintained here */
(function () {
  var MEASUREMENT_ID = "G-FZKNNS3RLX";
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

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", bootScreenshots);
  } else {
    bootScreenshots();
  }
})();

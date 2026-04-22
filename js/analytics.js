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
})();

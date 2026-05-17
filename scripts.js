(function () {
  "use strict";

  var prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  var translations = {};
  var currentLang = "en";
  var storedLang = null;
  var languageToggle = null;

  function handleAnchorClick(event) {
    var link = event.target.closest("a[href^=\"#\"]");
    if (!link) {
      return;
    }

    var href = link.getAttribute("href");
    if (!href || href === "#") {
      return;
    }

    var targetId = href.slice(1);
    var target = document.getElementById(targetId);
    if (!target) {
      return;
    }

    event.preventDefault();
    target.scrollIntoView({ behavior: prefersReducedMotion.matches ? "auto" : "smooth" });
    history.pushState(null, "", href);
  }

  document.addEventListener("click", handleAnchorClick);

  function applyTranslations(lang) {
    if (!translations[lang]) {
      return;
    }

    var nodes = document.querySelectorAll("[data-i18n]");
    nodes.forEach(function (node) {
      var key = node.getAttribute("data-i18n");
      if (!key || !translations[lang][key]) {
        return;
      }
      node.textContent = translations[lang][key];
    });

    var htmlNodes = document.querySelectorAll("[data-i18n-html]");
    htmlNodes.forEach(function (node) {
      var key = node.getAttribute("data-i18n-html");
      if (!key || !translations[lang][key]) {
        return;
      }
      node.innerHTML = translations[lang][key];
    });
  }

  function toggleLanguage() {
    currentLang = currentLang === "en" ? "fr" : "en";
    window.localStorage.setItem("foss-lang", currentLang);
    applyTranslations(currentLang);
  }

  function initTranslations() {
    storedLang = window.localStorage.getItem("foss-lang");
    if (storedLang) {
      currentLang = storedLang;
    }

    languageToggle = document.getElementById("lang-toggle");
    if (languageToggle) {
      languageToggle.addEventListener("click", toggleLanguage);
    }

    fetch("i18n.json")
      .then(function (response) {
        if (!response.ok) {
          throw new Error("Failed to load translations");
        }
        return response.json();
      })
      .then(function (data) {
        translations = data || {};
        applyTranslations(currentLang);
      })
      .catch(function () {
        // Keep fallback text from HTML if translations fail to load.
      });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initTranslations);
  } else {
    initTranslations();
  }
})();

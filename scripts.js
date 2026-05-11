(function () {
  "use strict";

  var prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

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
})();

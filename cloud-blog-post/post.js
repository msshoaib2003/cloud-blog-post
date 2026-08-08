/* ==========================================================================
   MSClouds — Post Template JS
   No dependencies. Drop this next to every post that uses post-template.html.
   ========================================================================== */
(function () {
  "use strict";

  function initNavToggle() {
    const toggle = document.querySelector("[data-nav-toggle]");
    const nav = document.querySelector("[data-nav]");
    if (!toggle || !nav) return;
    toggle.addEventListener("click", function () {
      const isOpen = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", String(isOpen));
      document.body.style.overflow = isOpen ? "hidden" : "";
    });
  }

  function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) {
      return navigator.clipboard.writeText(text);
    }
    // Fallback for browsers without the Clipboard API, or insecure (non-HTTPS) contexts.
    return new Promise(function (resolve, reject) {
      const textarea = document.createElement("textarea");
      textarea.value = text;
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.focus();
      textarea.select();
      try {
        const ok = document.execCommand("copy");
        document.body.removeChild(textarea);
        ok ? resolve() : reject(new Error("execCommand copy failed"));
      } catch (err) {
        document.body.removeChild(textarea);
        reject(err);
      }
    });
  }

  function initCopyButtons() {
    document.querySelectorAll("[data-copy-target]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        const target = document.querySelector(btn.getAttribute("data-copy-target"));
        if (!target) return;
        const original = btn.innerHTML;
        copyText(target.innerText)
          .then(function () {
            btn.innerHTML = "Copied";
            window.setTimeout(function () { btn.innerHTML = original; }, 1600);
          })
          .catch(function () {
            btn.innerHTML = "Copy failed";
            window.setTimeout(function () { btn.innerHTML = original; }, 1600);
          });
      });
    });
  }

  function initTocScrollSpy() {
    const links = document.querySelectorAll("[data-toc] a");
    if (!links.length) return;
    const targets = Array.from(links)
      .map(function (link) { return document.getElementById(link.getAttribute("href").replace("#", "")); })
      .filter(Boolean);
    if (!targets.length) return;

    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        const link = document.querySelector('[data-toc] a[href="#' + entry.target.id + '"]');
        if (!link) return;
        if (entry.isIntersecting) {
          links.forEach(function (l) { l.classList.remove("is-active"); });
          link.classList.add("is-active");
        }
      });
    }, { rootMargin: "-20% 0px -70% 0px" });

    targets.forEach(function (t) { observer.observe(t); });
  }

  function initFooterYear() {
    document.querySelectorAll("[data-year]").forEach(function (el) {
      el.textContent = new Date().getFullYear();
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    initNavToggle();
    initCopyButtons();
    initTocScrollSpy();
    initFooterYear();
  });
})();

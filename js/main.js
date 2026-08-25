/* =========================================================
   Mahmut Hayıroğlu - Dijital Pazarlama Uzmanı
   Vanilla JavaScript, harici kütüphane yok.
   ========================================================= */

(function () {
  "use strict";

  var reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var hasObserver = "IntersectionObserver" in window;

  /* ---------- 1. Kaydırınca başlık ve yukarı çık butonu ---------- */
  var header = document.getElementById("header");
  var toTop = document.getElementById("toTop");

  function onScroll() {
    var y = window.scrollY;

    if (header) {
      header.classList.toggle("is-scrolled", y > 8);
    }
    if (toTop) {
      // Yaklaşık bir ekran boyu kaydırınca görünür olsun
      toTop.classList.toggle("is-visible", y > window.innerHeight * 0.6);
    }
  }

  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  if (toTop) {
    toTop.addEventListener("click", function () {
      if (reducedMotion || typeof window.scrollTo !== "function") {
        window.scrollTo(0, 0);
      } else {
        try {
          window.scrollTo({ top: 0, behavior: "smooth" });
        } catch (err) {
          window.scrollTo(0, 0);
        }
      }
      // Odak sayfanın başına dönsün
      if (header) {
        var logo = header.querySelector(".logo");
        if (logo) logo.focus({ preventScroll: true });
      }
    });
  }

  /* ---------- 2. Mobil menü ---------- */
  var navToggle = document.getElementById("navToggle");
  var navMenu = document.getElementById("navMenu");
  var desktop = window.matchMedia("(min-width: 768px)");

  function setNav(open) {
    if (!navToggle || !navMenu) return;
    navToggle.setAttribute("aria-expanded", open ? "true" : "false");
    navToggle.setAttribute("aria-label", open ? "Menüyü kapat" : "Menüyü aç");
    navMenu.classList.toggle("is-open", open);
    document.body.classList.toggle("nav-open", open);
  }

  if (navToggle && navMenu) {
    navToggle.addEventListener("click", function () {
      setNav(navToggle.getAttribute("aria-expanded") !== "true");
    });

    navMenu.addEventListener("click", function (event) {
      if (event.target.closest("a")) setNav(false);
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") setNav(false);
    });

    var onBreakpoint = function (event) {
      if (event.matches) setNav(false);
    };
    if (typeof desktop.addEventListener === "function") {
      desktop.addEventListener("change", onBreakpoint);
    } else if (typeof desktop.addListener === "function") {
      desktop.addListener(onBreakpoint);
    }
  }

  /* ---------- 3. Yükseliş çizgisi (imza öğesi) ---------- */
  var growth = document.getElementById("growth");

  if (growth) {
    // Çizim, sayfa boyandıktan hemen sonra başlasın
    window.requestAnimationFrame(function () {
      window.requestAnimationFrame(function () {
        growth.classList.add("is-live");
      });
    });

    // Hero ekrandan çıkınca sonsuz nabız animasyonunu durdur
    var hero = document.getElementById("hero");
    if (hero && hasObserver) {
      new IntersectionObserver(
        function (entries) {
          growth.classList.toggle("is-idle", !entries[0].isIntersecting);
        },
        { threshold: 0 }
      ).observe(hero);
    }
  }

  /* ---------- 4. Bölümlerin giriş animasyonu ---------- */
  var revealItems = document.querySelectorAll(".reveal");

  if (reducedMotion || !hasObserver) {
    revealItems.forEach(function (el) {
      el.classList.add("is-visible");
    });
  } else {
    var revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry, index) {
          if (!entry.isIntersecting) return;

          var delay = Math.min(index * 80, 320);
          setTimeout(function () {
            entry.target.classList.add("is-visible");
          }, delay);

          revealObserver.unobserve(entry.target);
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -60px 0px" }
    );

    revealItems.forEach(function (el) {
      revealObserver.observe(el);
    });
  }

  /* ---------- 5. Menüde aktif bölüm ---------- */
  var sections = document.querySelectorAll("main section[id]");
  var navLinks = document.querySelectorAll('.nav-list a[href^="#"]');

  if (sections.length && navLinks.length && hasObserver) {
    var sectionObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          navLinks.forEach(function (link) {
            link.classList.toggle("is-active", link.getAttribute("href") === "#" + entry.target.id);
          });
        });
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );

    sections.forEach(function (section) {
      sectionObserver.observe(section);
    });
  }

  /* ---------- 6. Yumuşak kaydırma (CSS desteklemeyen tarayıcılar için) ---------- */
  var supportsSmooth = "scrollBehavior" in document.documentElement.style;

  if (!supportsSmooth && !reducedMotion) {
    document.querySelectorAll('a[href^="#"]').forEach(function (link) {
      link.addEventListener("click", function (event) {
        var id = link.getAttribute("href");
        if (id.length < 2) return;

        var target = document.querySelector(id);
        if (!target) return;

        event.preventDefault();
        var offset = (header ? header.offsetHeight : 0) + 16;
        var top = target.getBoundingClientRect().top + window.pageYOffset - offset;
        window.scrollTo(0, top);
        target.setAttribute("tabindex", "-1");
        target.focus({ preventScroll: true });
      });
    });
  }
})();

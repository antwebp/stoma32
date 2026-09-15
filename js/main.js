(() => {
  "use strict";

  /* Header scroll state */
  const header = document.getElementById("siteHeader");
  const scrollTopBtn = document.getElementById("scrollTop");

  const onScroll = () => {
    const y = window.scrollY;
    header.classList.toggle("scrolled", y > 40);
    scrollTopBtn.classList.toggle("visible", y > 600);
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  scrollTopBtn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  /* Mobile nav toggle */
  const menuToggle = document.getElementById("menuToggle");
  const mainNav = document.getElementById("mainNav");
  const navClose = document.getElementById("navClose");

  const closeNav = () => {
    mainNav.classList.remove("open");
    menuToggle.classList.remove("open");
    document.body.style.overflow = "";
  };

  menuToggle.addEventListener("click", () => {
    const isOpen = mainNav.classList.toggle("open");
    menuToggle.classList.toggle("open", isOpen);
    document.body.style.overflow = isOpen ? "hidden" : "";
  });

  navClose.addEventListener("click", closeNav);

  mainNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeNav);
  });

  /* Close mobile nav when clicking outside of it */
  document.addEventListener("click", (e) => {
    if (!mainNav.classList.contains("open")) return;
    if (mainNav.contains(e.target) || menuToggle.contains(e.target)) return;
    closeNav();
  });

  /* Scroll reveal for elements marked .reveal (cards/sections below the fold) */
  document.querySelectorAll(".row-grid, .precision-grid, .section-head").forEach((el) => {
    el.classList.add("reveal");
  });
  const revealEls = document.querySelectorAll(".reveal");
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -60px 0px" }
  );
  revealEls.forEach((el) => revealObserver.observe(el));

  /* Animated stat counters */
  const counters = document.querySelectorAll(".stat-num[data-count]");

  const animateCounter = (el) => {
    const target = parseInt(el.dataset.count, 10);
    const suffix = el.dataset.suffix || "";
    const duration = 1500;
    const start = performance.now();

    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = Math.round(target * eased);
      el.textContent = value.toLocaleString("ru-RU") + suffix;
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };

  const counterObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.6 }
  );
  counters.forEach((el) => counterObserver.observe(el));

  /* Generic "page through groups of cards" carousel */
  function setupCarousel(track, prevBtn, nextBtn, getVisibleCount) {
    if (!track || !prevBtn || !nextBtn) return;
    const cards = Array.from(track.children);
    let index = 0;

    const update = () => {
      const visible = getVisibleCount();
      const maxIndex = Math.max(0, cards.length - visible);
      if (index > maxIndex) index = maxIndex;
      const cardRect = cards[0].getBoundingClientRect();
      const gap = parseFloat(getComputedStyle(track).columnGap || getComputedStyle(track).gap) || 0;
      track.style.transform = `translateX(-${index * (cardRect.width + gap)}px)`;
      prevBtn.classList.toggle("active", index > 0);
      nextBtn.classList.toggle("active", index < maxIndex);
    };

    prevBtn.addEventListener("click", () => {
      index = Math.max(0, index - 1);
      update();
    });
    nextBtn.addEventListener("click", () => {
      const maxIndex = Math.max(0, cards.length - getVisibleCount());
      index = index < maxIndex ? index + 1 : 0;
      update();
    });
    window.addEventListener("resize", update, { passive: true });
    update();
  }

  setupCarousel(
    document.getElementById("testimonialsTrack"),
    document.getElementById("carPrev"),
    document.getElementById("carNext"),
    () => (window.innerWidth <= 860 ? 1 : 3)
  );

  setupCarousel(
    document.getElementById("doctorsTrack"),
    document.getElementById("docPrev"),
    document.getElementById("docNext"),
    () => (window.innerWidth <= 560 ? 1 : window.innerWidth <= 900 ? 2 : 4)
  );

  /* All services modal */
  const servicesModalOverlay = document.getElementById("servicesModalOverlay");
  const openServicesModalBtn = document.getElementById("allServicesBtn");
  const closeServicesModalBtn = document.getElementById("servicesModalClose");

  if (servicesModalOverlay && openServicesModalBtn && closeServicesModalBtn) {
    const openModal = () => {
      servicesModalOverlay.classList.add("open");
      document.body.classList.add("modal-open");
    };
    const closeModal = () => {
      servicesModalOverlay.classList.remove("open");
      document.body.classList.remove("modal-open");
    };

    openServicesModalBtn.addEventListener("click", openModal);
    closeServicesModalBtn.addEventListener("click", closeModal);
    servicesModalOverlay.addEventListener("click", (e) => {
      if (e.target === servicesModalOverlay) closeModal();
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && servicesModalOverlay.classList.contains("open")) closeModal();
    });
  }

  /* Booking form modal */
  const bookingOverlay = document.getElementById("bookingModalOverlay");
  const bookingClose = document.getElementById("bookingModalClose");
  const bookingForm = document.getElementById("bookingForm");
  const bookingStatus = document.getElementById("bookingStatus");
  const bookingSubmit = document.getElementById("bookingSubmit");
  const phoneInput = document.getElementById("bkPhone");
  const BOOKING_EMAIL = "antwebton@gmail.com";

  const showStatus = (text, ok) => {
    bookingStatus.hidden = false;
    bookingStatus.textContent = text;
    bookingStatus.classList.toggle("ok", ok);
  };

  if (bookingOverlay && bookingClose && bookingForm) {
    const openBooking = () => {
      bookingStatus.hidden = true;
      bookingOverlay.classList.add("open");
      document.body.classList.add("modal-open");
      document.getElementById("bkName").focus();
    };
    const closeBooking = () => {
      bookingOverlay.classList.remove("open");
      document.body.classList.remove("modal-open");
    };

    document.querySelectorAll("[data-open-booking]").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        if (servicesModalOverlay) servicesModalOverlay.classList.remove("open");
        openBooking();
      });
    });

    bookingClose.addEventListener("click", closeBooking);
    bookingOverlay.addEventListener("click", (e) => {
      if (e.target === bookingOverlay) closeBooking();
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && bookingOverlay.classList.contains("open")) closeBooking();
    });

    /* Phone mask: +7 (XXX) XXX-XX-XX */
    phoneInput.addEventListener("input", () => {
      let d = phoneInput.value.replace(/\D/g, "");
      if (d.startsWith("8")) d = "7" + d.slice(1);
      if (!d.startsWith("7")) d = "7" + d;
      d = d.slice(0, 11);
      let out = "+7";
      if (d.length > 1) out += " (" + d.slice(1, 4);
      if (d.length >= 5) out += ") " + d.slice(4, 7);
      if (d.length >= 8) out += "-" + d.slice(7, 9);
      if (d.length >= 10) out += "-" + d.slice(9, 11);
      phoneInput.value = out;
    });

    bookingForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const name = document.getElementById("bkName").value.trim();
      if (name.length < 2) {
        showStatus("Пожалуйста, укажите ваше имя.", false);
        return;
      }
      if (phoneInput.value.replace(/\D/g, "").length !== 11) {
        showStatus("Укажите телефон полностью.", false);
        return;
      }

      bookingSubmit.disabled = true;
      bookingSubmit.textContent = "Отправляем…";
      try {
        const res = await fetch("https://formsubmit.co/ajax/" + BOOKING_EMAIL, {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify({
            _subject: "Заявка с сайта 32+ — запись на приём",
            _template: "table",
            _captcha: "false",
            "Имя": name,
            "Телефон": phoneInput.value,
            "Комментарий": document.getElementById("bkComment").value.trim() || "—",
          }),
        });
        if (!res.ok) throw new Error("HTTP " + res.status);
        const data = await res.json().catch(() => ({}));
        if (data.success === "false" || data.success === false) {
          throw new Error(data.message || "Service error");
        }
        bookingForm.reset();
        showStatus("Заявка отправлена! Мы перезвоним вам в ближайшее время.", true);
      } catch (err) {
        showStatus("Не удалось отправить заявку. Позвоните нам: +7 (3424) 24-95-00", false);
      } finally {
        bookingSubmit.disabled = false;
        bookingSubmit.textContent = "Отправить заявку";
      }
    });
  }
})();

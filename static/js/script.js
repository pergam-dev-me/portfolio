// Perry Kwesi Portfolio — client-side interactions

(function () {
  "use strict";

  // ----- Year -----
  document.getElementById("year").textContent = new Date().getFullYear();

  // ----- Theme toggle -----
  var themeToggle = document.getElementById("themeToggle");
  var root = document.documentElement;

  var savedTheme = localStorage.getItem("theme");
  if (savedTheme) root.setAttribute("data-theme", savedTheme);

  themeToggle.addEventListener("click", function () {
    var current = root.getAttribute("data-theme");
    var next = current === "dark" ? "light" : "dark";
    root.setAttribute("data-theme", next);
    localStorage.setItem("theme", next);
  });

  // ----- Mobile menu -----
  var menuToggle = document.getElementById("menuToggle");
  var navLinks = document.getElementById("navLinks");

  menuToggle.addEventListener("click", function () {
    var open = navLinks.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", open ? "true" : "false");
  });

  navLinks.querySelectorAll("a").forEach(function (link) {
    link.addEventListener("click", function () {
      navLinks.classList.remove("open");
      menuToggle.setAttribute("aria-expanded", "false");
    });
  });

  // ----- Nav shadow on scroll -----
  var nav = document.getElementById("nav");
  window.addEventListener("scroll", function () {
    if (window.scrollY > 20) nav.style.boxShadow = "0 4px 20px rgba(0,0,0,0.2)";
    else nav.style.boxShadow = "none";
  });

  // ----- Scroll reveal -----
  var reveals = document.querySelectorAll(".reveal");
  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );
  reveals.forEach(function (el) { observer.observe(el); });

  // ----- Contact form -----
  var form = document.getElementById("contactForm");
  var status = document.getElementById("formStatus");

  function clearErrors() {
    document.querySelectorAll(".field__error").forEach(function (el) { el.textContent = ""; });
    document.querySelectorAll(".invalid").forEach(function (el) { el.classList.remove("invalid"); });
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    clearErrors();
    status.textContent = "";
    status.className = "form__status";

    var data = {
      name: document.getElementById("name").value,
      email: document.getElementById("email").value,
      message: document.getElementById("message").value,
    };

    fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
      .then(function (res) { return res.json(); })
      .then(function (res) {
        if (res.errors) {
          Object.keys(res.errors).forEach(function (key) {
            var errEl = document.querySelector('[data-error-for="' + key + '"]');
            var input = document.getElementById(key);
            if (errEl) errEl.textContent = res.errors[key];
            if (input) input.classList.add("invalid");
          });
          status.textContent = "Please fix the errors above.";
          status.classList.add("error");
        } else {
          status.textContent = res.message || "Message sent!";
          status.classList.add("success");
          form.reset();
        }
      })
      .catch(function () {
        status.textContent = "Something went wrong. Please try again.";
        status.classList.add("error");
      });
  });
})();

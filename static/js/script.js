/* Perry Kwesi Portfolio — client-side interactions */

(function () {
    "use strict";

    /* ===== Theme toggle ===== */
    var themeToggle = document.getElementById("theme-toggle");
    var body = document.body;
    var savedTheme = null;
    try { savedTheme = localStorage.getItem("theme"); } catch (e) {}
    if (savedTheme) body.setAttribute("data-theme", savedTheme);

    themeToggle.addEventListener("click", function () {
        var current = body.getAttribute("data-theme");
        var next = current === "dark" ? "light" : "dark";
        body.setAttribute("data-theme", next);
        try { localStorage.setItem("theme", next); } catch (e) {}
    });

    /* ===== Mobile nav ===== */
    var burger = document.getElementById("nav-burger");
    var navLinks = document.getElementById("nav-links");
    burger.addEventListener("click", function () {
        burger.classList.toggle("open");
        navLinks.classList.toggle("open");
        burger.setAttribute("aria-expanded", burger.classList.contains("open"));
    });
    navLinks.querySelectorAll("a").forEach(function (link) {
        link.addEventListener("click", function () {
            burger.classList.remove("open");
            navLinks.classList.remove("open");
        });
    });

    /* ===== Scroll reveal ===== */
    var revealEls = document.querySelectorAll("[data-reveal]");
    if ("IntersectionObserver" in window) {
        var observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add("is-visible");
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15 });
        revealEls.forEach(function (el) { observer.observe(el); });
    } else {
        revealEls.forEach(function (el) { el.classList.add("is-visible"); });
    }

    /* ===== Header shadow on scroll ===== */
    var header = document.getElementById("site-header");
    window.addEventListener("scroll", function () {
        if (window.scrollY > 20) {
            header.style.boxShadow = "0 4px 20px rgba(0,0,0,0.15)";
        } else {
            header.style.boxShadow = "none";
        }
    });

    /* ===== Footer year ===== */
    document.getElementById("year").textContent = new Date().getFullYear();

    /* ===== Chat demo ===== */
    var chatForm = document.getElementById("chat-form");
    var chatInput = document.getElementById("chat-input");
    var chatMessages = document.getElementById("chat-messages");

    function addMessage(text, who) {
        var msg = document.createElement("div");
        msg.className = "chat-msg " + who;
        msg.textContent = text;
        chatMessages.appendChild(msg);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    chatForm.addEventListener("submit", function (e) {
        e.preventDefault();
        var message = chatInput.value.trim();
        if (!message) return;
        addMessage(message, "user");
        chatInput.value = "";

        var btn = chatForm.querySelector("button");
        btn.disabled = true;
        btn.textContent = "Sending...";

        fetch("/api/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message: message })
        })
            .then(function (res) { return res.json(); })
            .then(function (data) {
                if (data.error) {
                    addMessage("Error: " + data.error, "bot");
                } else {
                    addMessage(data.response, "bot");
                }
            })
            .catch(function () {
                addMessage("Something went wrong. Please try again.", "bot");
            })
            .finally(function () {
                btn.disabled = false;
                btn.textContent = "Send";
            });
    });

    /* ===== Contact form ===== */
    var contactForm = document.getElementById("contact-form");

    function clearErrors() {
        ["name", "email", "message"].forEach(function (field) {
            var errEl = document.getElementById("error-" + field);
            errEl.textContent = "";
            var input = document.getElementById("contact-" + field);
            input.removeAttribute("aria-invalid");
        });
    }

    function showErrors(errors) {
        Object.keys(errors).forEach(function (field) {
            var errEl = document.getElementById("error-" + field);
            errEl.textContent = errors[field];
            var input = document.getElementById("contact-" + field);
            input.setAttribute("aria-invalid", "true");
        });
    }

    contactForm.addEventListener("submit", function (e) {
        e.preventDefault();
        clearErrors();
        var successEl = document.getElementById("contact-success");
        successEl.hidden = true;

        var data = {
            name: document.getElementById("contact-name").value,
            email: document.getElementById("contact-email").value,
            message: document.getElementById("contact-message").value
        };

        var btn = contactForm.querySelector("button[type=submit]");
        btn.disabled = true;
        btn.textContent = "Sending...";

        fetch("/api/contact", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        })
            .then(function (res) { return res.json(); })
            .then(function (data) {
                if (data.errors) {
                    showErrors(data.errors);
                } else {
                    successEl.hidden = false;
                    contactForm.reset();
                }
            })
            .catch(function () {
                addMessage ? null : null; // chat may not exist on all pages
                var nameErr = document.getElementById("error-message");
                nameErr.textContent = "Something went wrong. Please try again.";
            })
            .finally(function () {
                btn.disabled = false;
                btn.textContent = "Send Message";
            });
    });
})();

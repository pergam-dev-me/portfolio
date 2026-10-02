/* Perry Kwesi Portfolio — client-side interactions */

(function () {
    "use strict";

    /* ===== Theme toggle ===== */
    var themeToggle = document.getElementById("theme-toggle");
    var body = document.body;
    var savedTheme = null;
    try { savedTheme = localStorage.getItem("theme"); } catch (e) {}
    if (savedTheme) body.setAttribute("data-theme", savedTheme);

    if (themeToggle) {
        themeToggle.addEventListener("click", function () {
            var current = body.getAttribute("data-theme");
            var next = current === "dark" ? "light" : "dark";
            body.setAttribute("data-theme", next);
            try { localStorage.setItem("theme", next); } catch (e) {}
        });
    }

    /* ===== Mobile nav ===== */
    var burger = document.getElementById("nav-burger");
    var navLinks = document.getElementById("nav-links");
    if (burger && navLinks) {
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
    }

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
    if (header) {
        window.addEventListener("scroll", function () {
            header.style.boxShadow = window.scrollY > 20
                ? "0 4px 20px rgba(0,0,0,0.15)" : "none";
        });
    }

    /* ===== Footer year ===== */
    var yearEl = document.getElementById("year");
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    /* ===== Chat demo ===== */
    var chatForm = document.getElementById("chat-form");
    if (chatForm) {
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
                    addMessage(data.error ? "Error: " + data.error : data.response, "bot");
                })
                .catch(function () {
                    addMessage("Something went wrong. Please try again.", "bot");
                })
                .finally(function () {
                    btn.disabled = false;
                    btn.textContent = "Send";
                });
        });
    }

    /* ===== Contact form ===== */
    var contactForm = document.getElementById("contact-form");
    if (contactForm) {
        function clearErrors() {
            ["name", "email", "message"].forEach(function (field) {
                var errEl = document.getElementById("error-" + field);
                if (errEl) errEl.textContent = "";
                var input = document.getElementById("contact-" + field);
                if (input) input.removeAttribute("aria-invalid");
            });
        }

        function showErrors(errors) {
            Object.keys(errors).forEach(function (field) {
                var errEl = document.getElementById("error-" + field);
                if (errEl) errEl.textContent = errors[field];
                var input = document.getElementById("contact-" + field);
                if (input) input.setAttribute("aria-invalid", "true");
            });
        }

        contactForm.addEventListener("submit", function (e) {
            e.preventDefault();
            clearErrors();
            var successEl = document.getElementById("contact-success");
            if (successEl) successEl.hidden = true;

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
                        if (successEl) successEl.hidden = false;
                        contactForm.reset();
                    }
                })
                .catch(function () {
                    var errEl = document.getElementById("error-message");
                    if (errEl) errEl.textContent = "Something went wrong. Please try again.";
                })
                .finally(function () {
                    btn.disabled = false;
                    btn.textContent = "Send Message";
                });
        });
    }

    /* ===== GitHub Activity ===== */
    var githubReposEl = document.getElementById("github-repos");
    if (githubReposEl) {
        fetch("/api/github/repos")
            .then(function (res) { return res.json(); })
            .then(function (data) {
                if (data.repos && data.repos.length > 0) {
                    githubReposEl.innerHTML = data.repos.map(function (repo) {
                        return '<div class="github-repo-item">' +
                            '<a href="' + repo.url + '" class="github-repo-name" target="_blank" rel="noopener">' + repo.name + '</a>' +
                            '<p class="github-repo-desc">' + repo.description + '</p>' +
                            '<div class="github-repo-meta"><span>★ ' + repo.stars + '</span><span>' + repo.language + '</span><span>Updated ' + repo.updated + '</span></div>' +
                            '</div>';
                    }).join("");
                } else {
                    githubReposEl.innerHTML = '<p class="github-placeholder">' + (data.error || "No public repositories found.") + '</p>';
                }
            })
            .catch(function () {
                githubReposEl.innerHTML = '<p class="github-placeholder">Failed to load repositories.</p>';
            });
    }

    var githubActivityEl = document.getElementById("github-activity");
    if (githubActivityEl) {
        fetch("/api/github/activity")
            .then(function (res) { return res.json(); })
            .then(function (data) {
                if (data.events && data.events.length > 0) {
                    githubActivityEl.innerHTML = data.events.map(function (event) {
                        return '<div class="github-activity-item">' +
                            '<div class="github-activity-type">' + event.type + '</div>' +
                            '<div class="github-activity-repo">' + event.repo + '</div>' +
                            '<div class="github-activity-date">' + event.created + '</div>' +
                            '</div>';
                    }).join("");
                } else {
                    githubActivityEl.innerHTML = '<p class="github-placeholder">' + (data.error || "No recent public activity.") + '</p>';
                }
            })
            .catch(function () {
                githubActivityEl.innerHTML = '<p class="github-placeholder">Failed to load activity.</p>';
            });
    }
})();

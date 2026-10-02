"""
Perry Kwesi Portfolio — Flask application.

A modern developer portfolio and AI laboratory.
Serves the single-page portfolio UI, the project gallery page, and provides
REST endpoints for chat, contact, and GitHub activity.
"""

import json
import os
import urllib.error
import urllib.request

from dotenv import load_dotenv
from flask import Flask, jsonify, render_template, request

load_dotenv()

app = Flask(__name__)
app.secret_key = os.environ.get("SECRET_KEY", "dev-secret-key")

AI_API_KEY = os.environ.get("AI_API_KEY", "")
GITHUB_USERNAME = os.environ.get("GITHUB_USERNAME", "")
GITHUB_TOKEN = os.environ.get("GITHUB_TOKEN", "")

GALLERY_PROJECTS = [
    {
        "title": "AI Chat Assistant",
        "description": "A conversational assistant powered by an LLM API, with streaming responses and context handling.",
        "image": "project-chat.svg",
        "tags": ["Python", "Flask", "LLM"],
        "demo_url": "#",
        "code_url": "#",
    },
    {
        "title": "Data Dashboard",
        "description": "An interactive dashboard visualising datasets with filtering, sorting, and export options.",
        "image": "project-dashboard.svg",
        "tags": ["JavaScript", "Charts", "Data"],
        "demo_url": "#",
        "code_url": "#",
    },
    {
        "title": "Automation Toolkit",
        "description": "A collection of scripts automating repetitive workflows, from deployments to data pipelines.",
        "image": "project-automation.svg",
        "tags": ["Python", "Bash", "DevOps"],
        "demo_url": "#",
        "code_url": "#",
    },
    {
        "title": "Sentiment Analyzer",
        "description": "A tool that classifies text sentiment using NLP, with a clean web interface for batch analysis.",
        "image": "project-sentiment.svg",
        "tags": ["NLP", "Python", "ML"],
        "demo_url": "#",
        "code_url": "#",
    },
    {
        "title": "Task Manager API",
        "description": "A RESTful task management API with authentication, CRUD operations, and task prioritisation.",
        "image": "project-taskapi.svg",
        "tags": ["Flask", "REST", "Auth"],
        "demo_url": "#",
        "code_url": "#",
    },
    {
        "title": "Portfolio Website",
        "description": "This very site — a Flask-powered portfolio with dark/light themes, scroll reveals, and an AI lab.",
        "image": "project-portfolio.svg",
        "tags": ["Flask", "CSS", "Responsive"],
        "demo_url": "#",
        "code_url": "#",
    },
]


@app.route("/")
def index():
    """Serve the single-page portfolio."""
    return render_template("index.html")


@app.route("/gallery")
def gallery():
    """Serve the project gallery page."""
    return render_template("gallery.html", projects=GALLERY_PROJECTS)


@app.route("/api/chat", methods=["POST"])
def chat():
    """
    Chat endpoint.

    Currently returns a safe demo response. Replace the marked section
    with a real SDK/API call for your chosen AI provider. The provider
    key lives in .env as AI_API_KEY — never expose it client-side.
    """
    data = request.get_json(silent=True) or {}
    message = (data.get("message") or "").strip()

    if not message:
        return jsonify({"error": "Message is required."}), 400
    if len(message) > 2000:
        return jsonify({"error": "Message is too long (2000 character max)."}), 400

    # ---- Replace this block with a real AI provider call ----
    # e.g. call your provider's SDK using AI_API_KEY
    response_text = (
        "Thanks for reaching out! This is a demo response from the Perry Kwesi "
        "portfolio. Connect an AI provider in app.py to enable real replies."
    )
    # --------------------------------------------------------

    return jsonify({"response": response_text})


@app.route("/api/contact", methods=["POST"])
def contact():
    """
    Contact form endpoint.

    Validates the submitted data. Does not send email yet — connect this
    to a transactional email service or database on the server.
    """
    data = request.get_json(silent=True) or {}
    name = (data.get("name") or "").strip()
    email = (data.get("email") or "").strip()
    message = (data.get("message") or "").strip()

    errors = {}
    if not name:
        errors["name"] = "Name is required."
    if not email:
        errors["email"] = "Email is required."
    elif "@" not in email or "." not in email:
        errors["email"] = "Please enter a valid email address."
    if not message:
        errors["message"] = "Message is required."
    elif len(message) > 5000:
        errors["message"] = "Message is too long (5000 character max)."

    if errors:
        return jsonify({"errors": errors}), 400

    # ---- Replace this block with email sending / DB storage ----
    # e.g. send via a transactional email service
    # --------------------------------------------------------

    return jsonify({"success": True, "message": "Thanks! I'll get back to you soon."})


def _github_request(url):
    """Make an authenticated GitHub API request. Returns parsed JSON or None."""
    req = urllib.request.Request(url)
    req.add_header("Accept", "application/vnd.github+json")
    if GITHUB_TOKEN:
        req.add_header("Authorization", f"Bearer {GITHUB_TOKEN}")
    try:
        with urllib.request.urlopen(req, timeout=10) as resp:
            return json.loads(resp.read().decode())
    except (urllib.error.URLError, urllib.error.HTTPError, ValueError):
        return None


@app.route("/api/github/repos")
def github_repos():
    """Fetch the user's public repositories sorted by last updated."""
    if not GITHUB_USERNAME:
        return jsonify({"error": "GitHub username not configured.", "repos": []})
    data = _github_request(
        f"https://api.github.com/users/{GITHUB_USERNAME}/repos?sort=updated&per_page=6"
    )
    if data is None:
        return jsonify({"error": "Failed to fetch repositories.", "repos": []})
    repos = [
        {
            "name": r.get("name", ""),
            "description": r.get("description") or "No description provided.",
            "url": r.get("html_url", "#"),
            "stars": r.get("stargazers_count", 0),
            "language": r.get("language") or "Unknown",
            "updated": r.get("updated_at", "")[:10],
        }
        for r in data
        if not r.get("fork")
    ]
    return jsonify({"repos": repos})


@app.route("/api/github/activity")
def github_activity():
    """Fetch the user's recent public events."""
    if not GITHUB_USERNAME:
        return jsonify({"error": "GitHub username not configured.", "events": []})
    data = _github_request(
        f"https://api.github.com/users/{GITHUB_USERNAME}/events?per_page=8"
    )
    if data is None:
        return jsonify({"error": "Failed to fetch activity.", "events": []})
    events = [
        {
            "type": e.get("type", "").replace("Event", ""),
            "repo": e.get("repo", {}).get("name", ""),
            "created": e.get("created_at", "")[:10],
        }
        for e in data
    ]
    return jsonify({"events": events})


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)

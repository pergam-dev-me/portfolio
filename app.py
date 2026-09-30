"""
Perry Kwesi Portfolio — Flask application.

A modern developer portfolio and AI laboratory.
Serves the single-page portfolio UI and provides REST endpoints
for the chat demo and the contact form.
"""

import os

from dotenv import load_dotenv
from flask import Flask, jsonify, render_template, request

load_dotenv()

app = Flask(__name__)
app.secret_key = os.environ.get("SECRET_KEY", "dev-secret-key")

AI_API_KEY = os.environ.get("AI_API_KEY", "")


@app.route("/")
def index():
    """Serve the single-page portfolio."""
    return render_template("index.html")


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


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)

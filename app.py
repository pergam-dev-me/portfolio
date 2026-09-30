"""Perry Kwesi Portfolio — Flask application.

Serves the portfolio UI and REST endpoints for chat and contact.
"""

import os

from dotenv import load_dotenv
from flask import Flask, jsonify, render_template, request

load_dotenv()

app = Flask(__name__)

AI_API_KEY = os.environ.get("AI_API_KEY", "")


@app.route("/")
def index():
    """Render the portfolio page."""
    return render_template("index.html")


@app.route("/api/chat", methods=["POST"])
def chat():
    """Handle a chat message.

    Currently returns a safe demo response. Replace the marked section with a
    real AI provider SDK call when AI_API_KEY is configured.
    """
    data = request.get_json(silent=True) or {}
    message = (data.get("message") or "").strip()

    if not message:
        return jsonify({"error": "Message is required."}), 400

    if len(message) > 1000:
        return jsonify({"error": "Message is too long (1000 characters max)."}), 400

    # --- Demo response. Replace with a real provider call when AI_API_KEY is set. ---
    reply = (
        "Thanks for reaching out! This is a demo response from Perry's portfolio. "
        "Connect an AI provider in app.py to enable real replies."
    )
    # -------------------------------------------------------------------------------

    return jsonify({"reply": reply})


@app.route("/api/contact", methods=["POST"])
def contact():
    """Validate a contact form submission.

    Validates the submitted data but does not send email yet. Connect to a
    transactional email service or database on the server.
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
    elif "@" not in email or "." not in email.split("@")[-1]:
        errors["email"] = "Please enter a valid email address."
    if not message:
        errors["message"] = "Message is required."
    elif len(message) > 2000:
        errors["message"] = "Message is too long (2000 characters max)."

    if errors:
        return jsonify({"errors": errors}), 400

    # In production, send an email or store the message here.
    return jsonify({"success": True, "message": "Thanks, Perry will get back to you soon!"})


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)

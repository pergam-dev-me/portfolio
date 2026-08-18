# Perry Kwesi Portfolio

A modern Flask-powered developer portfolio and AI laboratory.

## Features

- Responsive dark/light portfolio UI
- Animated hero and scroll reveals
- Skills, projects, learning journey and capabilities
- Flask REST endpoints for chat and contact
- Server-side environment variable pattern
- Client-side validation and API error handling
- SEO metadata and accessible labels
- Mobile navigation

## Run locally

### 1. Create a virtual environment

Windows:

```bash
python -m venv .venv
.venv\Scripts\activate
```

macOS/Linux:

```bash
python3 -m venv .venv
source .venv/bin/activate
```

### 2. Install dependencies

```bash
pip install -r requirements.txt
```

### 3. Configure environment variables

Copy `.env.example` to `.env` and put real server-side credentials there when you connect an AI provider.

Never put API keys in `static/js/script.js`.

### 4. Start Flask

```bash
python app.py
```

Then open the local address shown by Flask.

## Connecting an AI provider

The `/api/chat` endpoint currently returns a safe demo response. Replace the marked section in `app.py` with the SDK/API call for your chosen provider.

Keep the provider key in `.env`, for example:

```text
AI_API_KEY=your_real_key
```

Do not commit `.env` to GitHub.

## Contact form

The `/api/contact` endpoint validates the submitted data but does not send email yet. Connect it to a transactional email service or database on the server.

## Deployment

For production, use a production WSGI server such as Gunicorn and configure environment variables through your hosting provider.

Example:

```bash
gunicorn app:app
```

Before deploying, disable debug mode and review CORS, rate limiting, email delivery, logging, and secret management.

## Customization

Edit the project cards, social links, email placeholders and profile image placeholder in `templates/index.html`. Replace the avatar placeholder with your own image in `static/images/`.
# portfolio
# portfolio

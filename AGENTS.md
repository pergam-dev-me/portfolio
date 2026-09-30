# Perry Kwesi Portfolio — Base44 Dev Notes

## Project overview
A single-page Flask developer portfolio ("Perry Kwesi Portfolio & AI Laboratory").
The repo originally shipped with only a README; the full app was built from that README spec.

## Stack
- **Backend:** Flask 3.x (`app.py`), served by the built-in dev server on port 5000 (mapped to host port 3000).
- **Frontend:** Server-rendered `templates/index.html` + static CSS/JS (no build step, no framework).
- **Dependencies:** `requirements.txt` (Flask, python-dotenv, gunicorn).

## Running locally (Base44)
```bash
docker compose -f docker-compose.base44.yml up -d --build
```
- Python deps are installed on container startup (not baked into image).
- Source is bind-mounted at `/app`; Flask debug mode gives live reload on edits.
- Health: `GET /` on port 5000 (mapped to host 3000).

## Environment variables
- `SECRET_KEY` — Flask session signing. A dev fallback exists in code; optional at boot.
- `AI_API_KEY` — Optional. The `/api/chat` endpoint returns a demo response without it. Replace the marked block in `app.py` to call a real provider.
- `GITHUB_USERNAME` — Your GitHub username (public, not a secret). Powers the GitHub Activity section on the homepage. Set via compose environment.
- `GITHUB_TOKEN` — Optional. GitHub personal access token for higher API rate limits.

## Pages
- `/` — single-page portfolio (hero, about, skills, projects, GitHub activity, journey, capabilities, chat demo, contact form).
- `/gallery` — project gallery page; each project shows an image, description, tags, and links. Projects defined in `GALLERY_PROJECTS` in `app.py`.

## API endpoints
- `POST /api/chat` — `{ "message": string }` → `{ "response": string }` (demo) or `{ "error": string }`.
- `POST /api/contact` — `{ "name", "email", "message" }` → `{ "success": true }` or `{ "errors": { field: msg } }`.
- `GET /api/github/repos` — fetches the user's public repos (requires `GITHUB_USERNAME`).
- `GET /api/github/activity` — fetches the user's recent public events (requires `GITHUB_USERNAME`).

## Notes
- No database, no migrations, no external services required to boot.
- Production: use Gunicorn (`gunicorn app:app`) and disable debug mode.

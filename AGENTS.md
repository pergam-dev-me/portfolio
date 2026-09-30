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

## API endpoints
- `POST /api/chat` — `{ "message": string }` → `{ "response": string }` (demo) or `{ "error": string }`.
- `POST /api/contact` — `{ "name", "email", "message" }` → `{ "success": true }` or `{ "errors": { field: msg } }`.

## Notes
- No database, no migrations, no external services required to boot.
- Production: use Gunicorn (`gunicorn app:app`) and disable debug mode.

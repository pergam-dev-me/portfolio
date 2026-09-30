# Perry Kwesi Portfolio — Base44 Notes

## Stack
- Flask 3 single-page portfolio served by `app.py` (templates + static assets).
- No database; no external services required to boot.
- `/api/chat` and `/api/contact` are REST endpoints. `/api/chat` returns a demo response unless `AI_API_KEY` is set.

## Running
- `docker compose -f docker-compose.base44.yml up -d --build`
- App listens on container port 5000, mapped to host port 3000.
- Flask runs with `--reload`, so edits to `app.py`, `templates/`, and `static/` hot-reload.

## Secrets
- `AI_API_KEY` (optional): only needed to enable real AI replies in `/api/chat`. The app boots and runs fully without it.

## Verification
- `curl -s localhost:3000/` returns the portfolio HTML.
- `curl -s -X POST localhost:3000/api/contact -H 'Content-Type: application/json' -d '{"name":"Test","email":"t@t.com","message":"hi"}'` returns success.

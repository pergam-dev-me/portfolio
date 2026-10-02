# Perry Gakpe — Portfolio

Static multi-page site (HTML/CSS/JS). Pages: index, about, projects, services, contact.
Header, footer and donate modal are injected by `script.js`; Paystack/Flutterwave/PayPal/Stripe logic is in `paystack.js`.

Run: `docker compose -f docker-compose.base44.yml up -d` → http://localhost:3000
Replace `PAYSTACK_PUBLIC_KEY` in `paystack.js` with your real key.

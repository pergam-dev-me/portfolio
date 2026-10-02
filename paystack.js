// Donate modal + multi-gateway logic (Paystack primary; Flutterwave, PayPal, Stripe extensions)
const PAYSTACK_PUBLIC_KEY = 'pk_test_a01b96bea999ef8b6187fc729866bec2d3baf11e'; // Test public key — swap for pk_live_… in production
const FLUTTERWAVE_PUBLIC_KEY = 'FLWPUBK-xxxxxxxxxxxxxxxx-X'; // Replace
const PAYPAL_ME = 'https://www.paypal.me/perrygakpe'; // Replace
const STRIPE_PUBLISHABLE_KEY = 'pk_test_51ULyTuDBZybyYRMUpWUPmSx2m3VarT14ythEFAKVp0dm55G34TpDVCBiPOZvhwrVJvLhKkwXaz8diUtYmxSt62EN00dDt892UV'; // test publishable key (safe in client code); used once a backend creates Checkout Sessions
const STRIPE_PAYMENT_LINK = 'https://buy.stripe.com/your_link'; // Replace

const donate = { amount: 50, currency: 'GHS', gateway: 'paystack' };

function loadScript(src) {
  return new Promise((res, rej) => {
    if (document.querySelector(`script[src="${src}"]`)) return res();
    const s = document.createElement('script'); s.src = src; s.onload = res; s.onerror = rej; document.head.appendChild(s);
  });
}

function buildDonateModal() {
  document.body.insertAdjacentHTML('beforeend', `
  <div class="modal" id="donate-modal" role="dialog" aria-modal="true" aria-label="Donate and support">
    <div class="box"><button class="close" aria-label="Close">&times;</button>
      <div class="center"><h2 style="font-size:2rem">Support Perry</h2><p>Choose a gateway and an amount.</p></div>
      <div class="tabs" id="gw-tabs">
        <button data-g="paystack" class="on">Paystack</button><button data-g="flutterwave">Flutterwave</button>
        <button data-g="paypal">PayPal</button><button data-g="stripe">Stripe</button>
      </div>
      <div class="amounts" id="amounts">
        <button data-a="20">20</button><button data-a="50" class="on">50</button><button data-a="100">100</button><button data-a="250">250</button>
      </div>
      <form id="donate-form">
        <label>Email<input type="email" id="d-email" required placeholder="you@example.com"></label>
        <label>Currency<select id="d-cur"><option>GHS</option><option>USD</option><option>NGN</option></select></label>
        <label>Amount<input type="number" min="1" id="d-amt" value="50"></label>
        <button class="btn solid" type="submit" id="d-submit">Donate with Paystack</button>
        <div class="msg" id="d-msg"></div>
        <p class="note">Payments are processed securely by the selected gateway.</p>
      </form>
    </div>
  </div>`);
  const modal = document.getElementById('donate-modal');
  const amt = document.getElementById('d-amt'), cur = document.getElementById('d-cur'), msg = document.getElementById('d-msg');
  const names = { paystack: 'Paystack', flutterwave: 'Flutterwave', paypal: 'PayPal', stripe: 'Stripe' };
  const show = (t) => { msg.textContent = t; msg.classList.add('show'); };
  window.donateMessage = show;

  document.addEventListener('click', (e) => {
    if (e.target.closest('[data-donate]')) { modal.classList.add('open'); document.querySelector('nav.main')?.classList.remove('open'); }
    if (e.target === modal || e.target.closest('#donate-modal .close')) modal.classList.remove('open');
  });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') document.querySelectorAll('.modal.open').forEach((m) => m.classList.remove('open')); });

  document.getElementById('gw-tabs').addEventListener('click', (e) => {
    const b = e.target.closest('button'); if (!b) return;
    donate.gateway = b.dataset.g;
    document.querySelectorAll('#gw-tabs button').forEach((x) => x.classList.toggle('on', x === b));
    document.getElementById('d-submit').textContent = 'Donate with ' + names[donate.gateway];
  });
  document.getElementById('amounts').addEventListener('click', (e) => {
    const b = e.target.closest('button'); if (!b) return;
    amt.value = b.dataset.a;
    document.querySelectorAll('#amounts button').forEach((x) => x.classList.toggle('on', x === b));
  });
  document.getElementById('donate-form').addEventListener('submit', (e) => {
    e.preventDefault();
    donate.amount = Math.max(1, +amt.value || 0); donate.currency = cur.value;
    const email = document.getElementById('d-email').value;
    msg.classList.remove('show');
    const handlers = {
      paystack: payWithPaystack,
      flutterwave: payWithFlutterwave,
      paypal: () => window.open(`${PAYPAL_ME}/${donate.amount}${donate.currency}`, '_blank', 'noopener'),
      stripe: () => window.open(STRIPE_PAYMENT_LINK, '_blank', 'noopener'),
    };
    Promise.resolve(handlers[donate.gateway](email)).catch(() => show('Could not load the payment gateway. Check your connection and try again.'));
  });
}

async function payWithPaystack(email) {
  await loadScript('https://js.paystack.co/v1/inline.js');
  const handler = PaystackPop.setup({
    key: PAYSTACK_PUBLIC_KEY,
    email,
    amount: Math.round(donate.amount * 100), // minor units (pesewas/cents/kobo)
    currency: donate.currency,
    callback: (response) => window.donateMessage('Transaction successful. Reference: ' + response.reference + '. Thank you!'),
    onClose: () => console.log('Paystack window closed.'),
  });
  handler.openIframe();
}

async function payWithFlutterwave(email) {
  await loadScript('https://checkout.flutterwave.com/v3.js');
  FlutterwaveCheckout({
    public_key: FLUTTERWAVE_PUBLIC_KEY,
    tx_ref: 'pg-' + Date.now(),
    amount: donate.amount,
    currency: donate.currency,
    customer: { email },
    customizations: { title: 'Support Perry Gakpe' },
    callback: (r) => window.donateMessage('Payment status: ' + r.status + '. Thank you!'),
  });
}

buildDonateModal();

## NoYell Quiz Project

This repo contains a standalone HTML quiz + mini sales/checkout flow for the NoYell project, based on `noyell-quiz (9).html`.

### How to run locally

- **Option 1 (simplest)**: Open `index.html` directly in your browser:
  - In Finder or your file manager, double-click `index.html`.
  - Or from a terminal, run `open index.html` in this repo directory on macOS.

- **Option 2 (via simple static server)**:
  - In this folder, run (no install required):
    - `npx serve .`
  - Then open the shown `http://localhost:...` URL in your browser.

### Stripe / payments

- By default, the quiz runs in **demo mode**:
  - `STRIPE_KEY` is set to `pk_test_YOUR_STRIPE_PUBLISHABLE_KEY_HERE` in `index.html`.
  - With this placeholder key, the checkout simulates a payment and automatically shows the success screen (no real card charge).
- To hook up real Stripe:
  1. Replace `STRIPE_KEY` with your real **publishable** Stripe key in `index.html`.
  2. Implement a backend endpoint at `POST /api/create-payment-intent` that:
     - Uses your **secret** Stripe key on the server.
     - Creates a Payment Intent using one of the `PRICE_IDS` in the script.
     - Returns `{ clientSecret }` JSON to the browser.

Everything else (quiz screens, animations, summary, builder, sales page, and simulated checkout) is fully wired up on the front end.


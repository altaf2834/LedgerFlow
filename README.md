# LedgerFlow

A ledger-style banking application with a production-oriented React frontend — accounts, balances derived from an immutable ledger, and money transfers designed to remain safe under concurrent requests.

**Live app:** https://ledgerflow-cash.vercel.app/

I built this to go deeper than a typical CRUD tutorial project — the interesting part of LedgerFlow isn't the forms, it's keeping transfers correct even when two requests hit the same account at the same instant.

---

## What it does

- **Auth** — register/login with JWT, stored client-side, attached automatically to every request via an axios interceptor
- **Accounts** — create multiple accounts per user, each with a status (`ACTIVE` / `FROZEN` / `CLOSED`)
- **Ledger-based balances** — an account's balance isn't a stored number that gets incremented/decremented. It's *derived* by summing immutable `DEBIT`/`CREDIT` ledger entries. This is closer to how real accounting systems work, and it means the balance can always be reconstructed/audited from the transaction history alone.
- **Transfers** — send money between accounts, protected by:
  - **Idempotency keys**, so a retried request (bad network, double-click) never processes the same transfer twice
  - **A database-level concurrency guard**, so two simultaneous transfers from the same account can't both succeed and overdraw the balance (more on this below — this one took a few tries to get right)
- **Welcome funding** — a new user's *first* account is automatically credited ₹10,000 from a system account, so you can actually test transfers right after signing up instead of hitting an empty balance wall
- **Dashboard** — balance summary (hidden by default, tap to reveal), recent activity merged across all your accounts, with internal transfers between your own accounts correctly deduplicated instead of showing up twice
- **Transaction history** — per account, paginated

---

## Core transaction flow

This is the part of the project that isn't just CRUD. A transfer follows this flow:

1. Authenticate the request.
2. Validate the source and destination accounts.
3. Generate or reuse an idempotency key.
4. Start a MongoDB session/transaction.
5. Create the `PENDING` transaction record.
6. Create the `DEBIT` ledger entry.
7. Create the `CREDIT` ledger entry.
8. Mark the transaction `COMPLETED`.
9. Commit the database transaction.
10. Trigger the confirmation email asynchronously (doesn't block the response).

If any database operation fails partway through, the MongoDB session is aborted and the ledger stays consistent — there's no state where a debit exists without its matching credit.

---

## Architecture

```
                    ┌─────────────────────┐
                    │   React + Vite      │
                    │      Vercel         │
                    └──────────┬──────────┘
                               │
                         REST / JWT
                               │
                               ▼
                    ┌─────────────────────┐
                    │ Node + Express API  │
                    │       Render        │
                    └──────────┬──────────┘
                               │
                         Mongoose
                               │
                               ▼
                    ┌─────────────────────┐
                    │    MongoDB Atlas    │
                    │                     │
                    │ Users               │
                    │ Accounts            │
                    │ Transactions        │
                    │ Ledger Entries      │
                    └─────────────────────┘
```

---

## Stack

**Backend:** Node.js, Express, MongoDB (Mongoose), JWT

**Frontend:** React (Vite, JavaScript), Tailwind CSS v4, React Router, Zod for validation, react-hot-toast

**Hosting:** Backend on Render, frontend on Vercel, database on MongoDB Atlas

No React Query, no state management library, no UI kit — plain hooks and Context. It was a deliberate choice to keep the dependency list small and understand every layer instead of pulling in tools I hadn't used before.

---

## Architecture notes

A few decisions worth explaining, since they weren't obvious upfront:

**JWT in localStorage, not httpOnly cookies.** The backend does set a cookie on login, but the frontend never uses it — it reads the token from the JSON response and attaches it manually via an `Authorization: Bearer` header on every request. This was a deliberate tradeoff (simpler cross-origin setup between Vercel and Render, at the cost of the XSS surface that comes with client-readable tokens).

**Balance is computed, not stored.** `account.getBalance()` sums the ledger entries for that account rather than reading a `balance` field. Slightly more expensive per read, but it means there's no separate "balance" value that can drift out of sync with the actual transaction history — the ledger *is* the source of truth.

**Idempotency and concurrency control are two different problems**, and I didn't fully appreciate that until I hit the bug (see below). Idempotency keys stop the *same* request from being processed twice. They do nothing to stop *two different* requests from racing each other. Those needed two separate mechanisms.

---

## Problems I ran into (and actually had to think through)

**The double-spend race condition.** Early on, nothing stopped a user from opening two tabs and firing two transfers from the same account at the same moment — both would pass the balance check (since both checked *before* either one had actually moved money) and both would succeed, even if combined they exceeded the account's balance. My first fix was a `findOne()` check for an existing pending transaction before creating a new one — which turned out to have the exact same flaw, just moved: two requests could both run that check *before* either had written its own record. The actual fix was a MongoDB partial unique index on `fromAccount`, scoped to documents where `status` is `PENDING`. This moves the constraint into the database itself, so MongoDB — not a race-prone application-level check — is what enforces that an account can't have more than one pending outgoing transfer at a time, atomically, no matter how close together the requests arrive. This was the hardest bug in the project and the one I learned the most from — "check then act" in application code is never safe under concurrency; the constraint has to live in the database. (This index solves double-spending for *this* transaction design specifically — it's a concurrency guard, not a general-purpose solution to every double-spend scenario a banking system might face.)

**Idempotency keys generated on every click.** I initially generated a new UUID inside the submit handler, which meant a genuine retry (after a failed request) got a *new* key instead of reusing the original one — defeating the point of having idempotency at all. Fixed by generating the key once per transaction attempt and only clearing it after success.

**A transaction that took 3–4 minutes in production** but was fine locally. Turned out the backend was `await`-ing the confirmation email send *before* sending the HTTP response back — so if the email provider was slow (which it was, in production, on Render's network), the user's request just hung. The transaction itself had already completed in the database; the response was waiting on something unrelated to whether the money moved. Fixed by firing the email as a background call instead of blocking the response on it.

**Tailwind v4's config change.** Went looking for `tailwind.config.js` partway through styling and it didn't exist — v4 moved theme customization into the CSS file itself via `@theme`. Small thing, but a good reminder that following slightly outdated setup instructions breaks in ways that don't look like your fault at first.

**Deciding what actually needed a backend change vs. a frontend workaround.** More than once the instinct was to patch something in a component when the real fix belonged in the schema or the controller — like account numbers (settled on reusing Mongo's `_id` instead of inventing a new field) and the transaction history endpoint (didn't exist at all until partway through building the Transactions page, so the route had to be designed and added mid-build).

None of these were huge in isolation, but they're the kind of thing that never shows up if you only test the happy path on your own machine.

---

## Running it locally

```bash
# Backend
cd Backend
npm install
# add a .env with MONGO_URI, JWT_SECRET, CLIENT_URL, SYSTEM_ACCOUNT_ID
npm start   

# Frontend
cd Frontend
npm install
# add a .env with VITE_API_BASE_URL pointing at your local backend
npm run dev
```

You'll need a MongoDB instance (local or Atlas) and a system user/account seeded in the database for the welcome-funding feature to work — everything else runs against a fresh database out of the box.

---

## What's not in here yet

- **Admin panel** — viewing all accounts and moving money on any user's behalf, gated by a role field on the user model. Scoped out deliberately once I realized it needed its own authorization layer, not just a UI variant.
- **Multi-currency conversion** — accounts support a currency field, but balances are never summed across currencies. Real FX conversion (rate sourcing, staleness, rounding) is a feature in its own right, not a follow-up task.
- **A dedicated dashboard-summary endpoint** — the dashboard currently fetches balance + recent transactions per account in parallel from the client. Fine for a handful of accounts, but a real aggregate endpoint would be the right fix if this ever needed to scale past that.

---

Built as a way to actually understand what production-oriented engineering looks like past the point where the happy path works — most of what's above only became obvious once something broke.

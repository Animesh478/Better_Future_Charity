# GiveWell Ledger — Charity Donation Platform

A full-stack platform where donors can discover verified charities, fund specific projects, and track exactly where their money went — and where charities go through an admin-reviewed approval process before they're ever visible to donors.

## Tech stack

**Frontend:** React 19, Vite, React Router, Axios
**Backend:** Node.js, Express, Sequelize ORM, MySQL
**Payments:** Cashfree (checkout + signature-verified webhooks)
**Email:** Brevo (transactional email)
**Auth:** JWT stored in an httpOnly cookie

## Features

- **Authentication** — signup/login with a JWT issued as an httpOnly cookie (never exposed to client-side JS); session is confirmed via a server-side profile check on load, not trusted from local state.
- **Charity onboarding** — any user can register a charity; it stays `Pending` and invisible to donors until an admin approves it, at which point the owner's role is promoted from Donor to Charity.
- **Public browsing** — anyone can browse charities and view a charity's projects without an account. Logging in is only required at the point of actually donating.
- **Donations** — Cashfree checkout initiated client-side, but a donation is only ever marked successful via a signature-verified server-side webhook, never a client-side redirect.
- **Donation history & receipts** — donors can view every donation they've made, grouped by charity, with a downloadable PDF receipt per transaction.
- **Impact reports** — charity owners post per-project updates (what was funded, funds utilized); visible to anyone, logged in or not, on a public report page.
- **Admin dashboard** — approve/reject/suspend charities, and manage user roles.
- **Profile & charity management** — users can update their profile; charity owners can update their charity's description.

## Project structure

```
Charity Donation/
├── backend/
│   ├── config/          # Sequelize DB config, Brevo email client
│   ├── controllers/      # request handlers
│   ├── middlewares/       # auth (JWT/cookie) and admin role checks
│   ├── migrations/ + seeders/   # DB schema + super-admin seed
│   ├── models/            # Sequelize models (User, Charity, Project, Donation, ImpactReport)
│   ├── routes/             # /api/auth, /user, /charity, /admin, /project, /public, /donations, /reports
│   ├── services/            # business logic per resource
│   ├── utils/                # JWT helpers, Cashfree client
│   └── index.js
└── frontend/
    └── src/
        ├── components/    # Navbar, ProtectedRoute, AuthProvider
        ├── context/        # AuthContext
        ├── pages/           # one page per route
        ├── routes/           # route table + role-based guards
        └── services/          # axios client + one API module per resource
```

## Getting started

### Prerequisites

- Node.js
- MySQL

### Backend

```bash
cd backend
npm install
```

Create a `.env` file in `backend/` with:

```
PORT=8001

DB_HOST=localhost
DB_USERNAME=root
DB_PASSWORD=
DB_NAME=charity_donation
DB_DIALECT=mysql

JWT_SECRET_KEY=replace-with-a-long-random-string

CASHFREE_CLIENT_ID=
CASHFREE_SECRET_KEY=

BREVO_API_KEY=
SYSTEM_EMAIL_SENDER=
SYSTEM_NAME_SENDER=
DONOR_EMAIL=

FRONTEND_URL=http://localhost:5173
BACKEND_URL=http://localhost:8001
CLOUDFLARE_URL=

# Super-admin seed
ADMIN_NAME=
ADMIN_EMAIL=
ADMIN_PASSWORD=
ADMIN_PHONENUMBER=
```

Run migrations, then seed the first admin account:

```bash
npx sequelize-cli db:migrate
npx sequelize-cli db:seed --seed 20260724135552-create-super-admin.js
npm run dev
```

The seeded admin can then log in normally at `/login` and reach `/admin` — there's no public signup path to the Admin role by design; every other admin is created by an existing admin changing a user's role from the dashboard.

### Frontend

```bash
cd frontend
npm install
```

Optionally create a `.env` in `frontend/` to override the Cashfree checkout mode:

```
VITE_CASHFREE_MODE=sandbox
```

```bash
npm run dev
```

The app runs at `http://localhost:5173` and expects the backend at `http://localhost:8001`.

## Role model

| Role        | How they get it                                             | Can do                                                                               |
| ----------- | ----------------------------------------------------------- | ------------------------------------------------------------------------------------ |
| **Donor**   | Default on signup                                           | Browse, donate, view own donation history, register a charity                        |
| **Charity** | Promoted automatically when an admin approves their charity | Everything a Donor can, plus manage their charity's projects and post impact reports |
| **Admin**   | Seeded once, or promoted by an existing admin               | Approve/reject/suspend charities, manage user roles                                  |

## Security notes

- The JWT lives only in an httpOnly cookie — it's never written to `localStorage` and never readable by client-side JavaScript.
- `role` is never accepted from the signup request body — every new account is created as `Donor` server-side, regardless of what's sent in the request, to prevent self-assigning elevated roles.
- Donation success is only ever written to the database from the Cashfree webhook after signature verification — the frontend's role ends at initiating checkout, not confirming payment.
- Route access is enforced twice: once in the frontend for UX (redirecting logged-out or wrong-role users), and again in Express middleware, since the frontend is never the real security boundary.

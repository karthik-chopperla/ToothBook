# ToothBook

ToothBook is a dental clinic management app for patient records, appointments,
treatment plans, billing, and day-to-day clinic operations. It is built with
Next.js, TypeScript, PostgreSQL, and Prisma.

## What it includes

- Patient records, dental charts, appointments, and treatment plans
- Invoices, payments, prescriptions, and inventory
- Staff accounts with clinic roles
- Patient portal, reminders, reports, and audit history
- Optional integrations for AI, email, SMS, calendars, and payment providers

Integrations that need a third-party account are not enabled automatically.

## Run locally

You need Node.js 22.22.2 or newer in the supported 22.x line, or Node.js
24.15.0 or newer, plus npm. ToothBook needs a PostgreSQL database. Docker is
optional: use a local PostgreSQL install, Docker Compose, or a hosted database
such as Supabase.

```powershell
npm ci
Copy-Item .env.example .env
```

Set `DATABASE_URL` and `DIRECT_URL` in `.env` to your PostgreSQL connection
strings. For Supabase, use its transaction pooler for `DATABASE_URL` and its
session pooler or direct connection for `DIRECT_URL`. Keep `.env` private.

Generate local secrets for `NEXTAUTH_SECRET`, `ENCRYPTION_KEY`, and
`CRON_SECRET` using the commands provided next to each variable in
`.env.example`. Then initialize the database and start the app:

```powershell
npx prisma migrate deploy
npx prisma db seed
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The seed creates a demo
clinic and sample data. Its default login is documented on the login page;
change the demo password before using the app beyond local testing.

For a complete local stack with PostgreSQL, Redis, MinIO, and Mailpit, see the
Docker commands in [docs/INFRASTRUCTURE.md](docs/INFRASTRUCTURE.md). Redis,
MinIO, and Mailpit are optional.

## Architecture

- `app/` contains the Next.js pages, layouts, and API route handlers.
- `components/` contains shared UI and page components.
- `lib/` holds authentication, database access, integrations, and business
  logic.
- `prisma/schema.prisma` defines the PostgreSQL data model; migrations live in
  `prisma/migrations/`.
- `public/` contains static assets and the installable app manifest.
- `tests/` contains unit, API, component, accessibility, and browser tests.

The web app uses Better Auth for staff sessions and Prisma for PostgreSQL.
Uploads use local disk by default; an S3-compatible service can be configured
when persistent shared storage is needed. Redis and background workers are
optional for a single-instance demo.

## Useful commands

```bash
npm run dev                 # Start the development server
npm run build               # Build for production
npm run start               # Serve a production build
npm run lint                # Run ESLint
npm run typecheck           # Check TypeScript
npm test                    # Run unit, API, and component tests
npm run test:e2e            # Run Playwright tests
npm run db:generate         # Regenerate the Prisma client
npm run db:migrate:deploy   # Apply existing migrations
npm run db:seed             # Load demo data
```

## Deployment and documentation

- [Vercel and Supabase demo setup](docs/VERCEL_SUPABASE.md)
- [Self-hosting guide](SELF_HOSTING.md)
- [File storage](docs/STORAGE.md)
- [Localization](docs/LOCALIZATION.md)
- [Infrastructure notes](docs/INFRASTRUCTURE.md)
- [Contributing](CONTRIBUTING.md)
- [Security policy](SECURITY.md)

Use fictional patient data for demos. Do not put real patient records in a
public or shared test environment.

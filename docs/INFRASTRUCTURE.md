# Architecture and infrastructure

ToothBook is a Next.js application backed by PostgreSQL. It can run locally,
on Vercel with Supabase, or as a Docker Compose deployment.

## Application

- `app/` contains the pages and API routes.
- `components/` contains shared UI.
- `lib/` contains authentication, database access, integrations, and business
  logic.
- `prisma/schema.prisma` defines the data model. Database changes are applied
  from `prisma/migrations/`.

The web app uses Better Auth for staff sessions. Patient portal authentication
uses a separate OTP flow. Prisma connects the application to PostgreSQL.
Structured application logs use Pino.

## Services

| Service | Default | Optional alternative |
| --- | --- | --- |
| Database | PostgreSQL | Supabase PostgreSQL |
| File storage | Local `uploads/` directory | S3-compatible object storage |
| Background jobs | Run inline in the app | Redis and the separate worker |
| Email in local development | No delivery by default | Mailpit via Docker Compose |

Use persistent object storage when running more than one app instance or when
uploads must survive redeployments. Redis is usually unnecessary for a small,
single-instance demo.

## Running and deployment

- **Local, without Docker:** use a local PostgreSQL install or hosted database,
  configure `.env`, apply migrations, seed if needed, and run `npm run dev`.
- **Local, with Docker:** `docker-compose.dev.yml` provides PostgreSQL, Redis,
  MinIO, and Mailpit. The Next.js app still runs on the host.
- **Vercel demo:** Vercel runs the app and Supabase provides PostgreSQL. See
  [VERCEL_SUPABASE.md](VERCEL_SUPABASE.md).
- **Self-hosting:** Docker Compose runs the app and database. See
  [SELF_HOSTING.md](../SELF_HOSTING.md). The image is published when a version
  tag is pushed; it is not available in a new GitHub repository until its
  release workflow has completed.

The `/api/health` endpoint checks that the process is responding.
`/api/ready` also checks the database and is intended for readiness probes.

## Database and patient-data notes

The active Prisma migrations target PostgreSQL. Earlier MySQL migrations are
preserved under `prisma/migrations-mysql-archive` and are not applied by Prisma.
This project copy does not convert or import an existing MySQL database.

Keep `.env` and service credentials out of source control. For demos, use
fictional patient records rather than real health information.

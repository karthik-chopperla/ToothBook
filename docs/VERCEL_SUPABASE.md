# Vercel + Supabase demo deployment

This deployment runs the Next.js app on Vercel and uses Supabase PostgreSQL
for data. Docker is not required on the deployed setup or on your laptop. Docker
is only an optional way to run PostgreSQL and supporting services locally.

This project copy now targets PostgreSQL. It does not migrate data from an
existing MySQL installation. Start with a new Supabase project for a demo, and
use fictional/sample patient data only.

## 1. Create Supabase services

1. Create a Supabase project and save its database password.
2. In Supabase's database connection settings, use the transaction-pooler URL
   (port `6543`) for `DATABASE_URL`, adding `pgbouncer=true` to its query string.
   Use a direct or session-pooler URL (port `5432`) for `DIRECT_URL`. The app
   uses `DATABASE_URL`; Prisma migrations use `DIRECT_URL`. Keep both private.
3. Create a **private** Storage bucket for uploads. Enable the S3 protocol in
   Storage settings, then copy the S3 endpoint, region, access key and secret
   key. Supabase S3 access keys bypass Storage RLS and have broad bucket access,
   so keep them server-side in Vercel environment variables only.

For S3 Storage configuration details, see Supabase's
[S3 authentication](https://supabase.com/docs/guides/storage/s3/authentication)
and [S3 compatibility](https://supabase.com/docs/guides/storage/s3/compatibility)
documentation.

## 2. Deploy to Vercel

Import the project repository into Vercel as a Next.js project. Use the normal
install and build commands (`npm ci` and `npm run build`); Vercel selects its
own serverless output while Docker builds continue using Next.js standalone
output.

Set these Vercel environment variables for the Production environment:

| Variable              | Value                                                               |
| --------------------- | ------------------------------------------------------------------- |
| `DATABASE_URL`        | Supabase transaction-pooler URL (port `6543`) with `pgbouncer=true` |
| `DIRECT_URL`          | Supabase direct or session-pooler URL (port `5432`)                 |
| `NEXTAUTH_URL`        | The deployed app's public URL, e.g. `https://your-demo.vercel.app`  |
| `NEXTAUTH_SECRET`     | A new random secret                                                 |
| `ENCRYPTION_KEY`      | A new 64-character hexadecimal key                                  |
| `CRON_SECRET`         | A new random secret                                                 |
| `STORAGE_DRIVER`      | `s3`                                                                |
| `S3_ENDPOINT`         | Endpoint shown in Supabase Storage S3 settings                      |
| `S3_REGION`           | Region shown in Supabase Storage S3 settings                        |
| `S3_BUCKET`           | The private bucket name                                             |
| `S3_ACCESS_KEY`       | Supabase Storage S3 access key                                      |
| `S3_SECRET_KEY`       | Supabase Storage S3 secret key                                      |
| `S3_FORCE_PATH_STYLE` | `true`                                                              |

Generate secrets locally (do not put generated secrets in source control):

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
node -e "console.log(require('crypto').randomBytes(16).toString('hex'))"
```

Use the first output for `NEXTAUTH_SECRET`, the second for `ENCRYPTION_KEY`,
and the third for `CRON_SECRET`.

## 3. Apply the PostgreSQL schema

Put both Supabase connection URLs in your local, untracked `.env` file as
`DATABASE_URL` and `DIRECT_URL`, then run this from the project root:

```bash
npx prisma migrate deploy
```

Then deploy or redeploy the Vercel project. Do not run MySQL migration files
against this PostgreSQL database; the PostgreSQL migration history is separate.

## Demo limitations

- Redis and the separate job worker are optional. Without `REDIS_URL`, queued
  jobs run inline in the app, which is sufficient for a small demo.
- Configure SMTP and payment/AI credentials only if the client needs those
  integrations during testing.
- The app can start without persistent object storage, but Vercel's local
  filesystem is not durable. Configure the S3-compatible bucket above if the
  demo should retain uploaded files.
- The app's file-import endpoint accepts larger files than some serverless
  request paths allow. Keep demo uploads modest; a direct-to-storage upload
  flow would be needed to remove that constraint for large scans or imports.
- Review current Vercel and Supabase free-tier limits before inviting a client;
  free tiers can change, pause inactive services, or impose usage limits.
- Use a private demo and fictional data. Do not enter real patient records.

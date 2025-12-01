# My_Parish
My Parish is a modern parish website/portal built with Next.js. It is designed to serve parishioners with up‑to‑date information and practical tools, such as:

- Parish hero page with photography and quick access tiles
- Announcements and news
- Mass intentions
- Contact and directions
- Additional sections for parish life

The main application lives in the `my-parish/` directory and uses Microsoft SQL Server (via Prisma) as a database, plus extra tooling for working with PDFs and Word documents.

---

## Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Styling & UI:**
  - Tailwind CSS
  - Custom components (hero, tiles, cards)
  - Lucide React / React Icons
- **Database:** Microsoft SQL Server via Prisma
- **ORM:** Prisma Client
- **HTTP & Utilities:** Axios, UUID
- **Documents & PDFs:**
  - `pdf-lib` + `@pdf-lib/fontkit`
  - `mammoth` for working with Word documents (.docx)
- **Other:**
  - `mongoose` (legacy / optional use)
  - `tedious` as the low‑level SQL Server driver (used under Prisma)

---

## Repository Structure

```text
My_Parish/
  README.md          # This file (root project README)
  my-parish/         # Next.js app source
    package.json
    next.config.ts   # Next.js config (basePath /mojaParafia)
    prisma/
      schema.prisma  # Database schema (SQL Server)
    src/
      app/           # Next.js App Router (pages, layouts, API routes)
        api/         # Health check and data APIs
        (other routes: announcements, intentions, contact, etc.)
      lib/
        prisma.ts    # Prisma client + SQL Server connection URL
      components/
        ui/HomeHero.tsx  # Hero section with quick access tiles
```

The production site is intended to be served under the base path `/mojaParafia` (see `next.config.ts`).

---

## Database & Prisma

My Parish uses **Microsoft SQL Server** as its primary database.

In `my-parish/prisma/schema.prisma`:

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "sqlserver"
  url      = env("DATABASE_URL")
}
```

The runtime connection string is built in `my-parish/src/lib/prisma.ts` from environment variables and stored in `DATABASE_COMPILED_URL` for Prisma to use.

---

## Environment Variables

Create a `.env` file inside `my-parish/` (same level as `package.json`). A typical configuration might include:

```env
# Database (SQL Server)
DB_USER=...
DB_PASSWORD=...
DB_SERVER=localhost
DB_DATABASE=MyParishDB
DB_PORT=1433
DB_ENCRYPT=false
DB_TRUST_CERT=true

# Prisma (placeholder; real URL is built from DB_* vars)
DATABASE_URL="sqlserver://placeholder;database=MyParishDB"

# Public URL (used in links/emails if needed)
NEXT_PUBLIC_APP_URL=http://localhost:3000/mojaParafia
```

Always check `my-parish/src/lib/prisma.ts` and API routes under `my-parish/src/app/api` for any extra environment variables you are using.

---

## Installation

From the repository root:

```bash
cd my-parish
npm install
```

Ensure that:

- Microsoft SQL Server is running and reachable
- `.env` is configured as described above

Then run Prisma migrations and generate the client (if needed):

```bash
npx prisma migrate dev
npx prisma generate
```

---

## Running in Development

Inside `my-parish/`:

```bash
npm run dev
```

By default, Next.js runs on:

```text
http://localhost:3000
```

Because of the configured base path, the parish site is reachable at:

```text
http://localhost:3000/mojaParafia
```

You can check API and DB connectivity with the health endpoint, for example:

```text
GET http://localhost:3000/mojaParafia/api
```

This route (`my-parish/src/app/api/route.ts`) attempts to connect to the SQL Server database via Prisma and returns a status JSON.

---

## Building and Running in Production

Build the app (inside `my-parish/`):

```bash
npm run build
```

Start the production server:

```bash
npm start
```

In production, ensure that:

- All required environment variables are set (DB_*, `DATABASE_URL`, `NEXT_PUBLIC_APP_URL`)
- The SQL Server instance is reachable from the server
- The app is served under `/mojaParafia` (matching `next.config.ts`)

---

## Main Features

- **Home / Hero section**
  - Full‑screen hero image with parish name
  - Quick access tiles for key sections

- **Announcements (`/mojaParafia/ogloszenia`)** 
  - Recent parish announcements and news

- **Mass intentions (`/mojaParafia/intencje-mszalne`)** 
  - List of Mass intentions, dates, times, and intentions overview

- **Contact & Directions (`/mojaParafia/kontakt`)** 
  - Contact details, address, and directions to the parish

- **Documents & PDFs (internal)** 
  - Helpers for generating or processing PDF/Word documents (e.g. bulletins, schedules) using `pdf-lib`, `@pdf-lib/fontkit`, and `mammoth`

Additional pages and components can be added as needed for sacramental information, parish groups, galleries, etc.

---

## Notes

- This project assumes a working Microsoft SQL Server instance.
- When changing DB credentials or host, update the `DB_*` variables and, if the schema changes, run `prisma migrate dev` again.

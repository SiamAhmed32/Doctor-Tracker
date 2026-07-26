# Doctor Tracker

Secure admin portal for managing doctors, patients, and operational analytics. Built as a fullstack Next.js app with Express mounted inside the Next.js API layer and MongoDB for persistence.

## Elevator pitch

Doctor Tracker gives clinic admins a focused workspace to register clinicians, attach patients, and read live workload trends without leaving one authenticated portal. The UI is feature-sliced and driven by RTK Query; the API stays query-optimized with indexes, pagination, and aggregation pipelines so the dashboard stays fast as records grow.

## Stack

- **Frontend:** Next.js App Router, TypeScript, Tailwind, Radix/shadcn-style UI, Lucide, Recharts, Redux Toolkit + RTK Query
- **Backend:** Express integrated via `src/pages/api/[...path].ts` (runs inside Next.js)
- **Database:** MongoDB + Mongoose
- **Auth:** httpOnly JWT cookie, seed-only admin bootstrap, login rate limiting

## Setup

```bash
cd doctor-tracker
cp .env.example .env.local
# fill MONGODB_URI, JWT_SECRET, SEED_ADMIN_* values
npm install
npm run seed:admin
npm run seed:demo
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Demo login

Use the admin created by `seed:admin` (defaults from `.env.example` / `.env.local`):

- Email: `admin@doctortracker.com`
- Password: value of `SEED_ADMIN_PASSWORD` in `.env.local`

`seed:demo` loads **6 doctors** and **18 patients** so dashboard charts and list filters are testable immediately.

## Scripts

| Script | Purpose |
| --- | --- |
| `npm run dev` | Next.js + integrated Express API on port 3000 |
| `npm run seed:admin` | Upsert the bootstrap admin user |
| `npm run seed:demo` | Reset demo doctors/patients sample data |
| `npm run lint` | ESLint |
| `npm run build` | Production build |

## Architecture

```
src/
  app/                 # App Router pages (login, dashboard, doctors, patients)
  components/          # Shared UI primitives + layout shell
  features/            # Client features (auth, dashboard, doctors, patients)
  lib/                 # Store, helpers
  pages/api/[...path]  # Catch-all that mounts Express
  server/              # Express app, routes, feature modules, Mongo layer
```

- Feature folders keep UI, RTK endpoints, and types close together.
- Server features follow controller → service → repository (SOLID-friendly boundaries).
- RTK Query tag invalidation keeps lists/dashboard in sync after mutations.
- MongoDB text indexes power search; aggregations power dashboard charts.

## Technical decisions

1. **Express inside Next.js (not a separate always-on process)**  
   A Pages API catch-all mounts the Express app so REST stays familiar while deployment stays a single Next.js unit (including Vercel-friendly hosting). The handler awaits DB connect and response completion to avoid premature API resolution.

2. **Seed-only admin + httpOnly cookie JWT**  
   Public registration is intentionally removed to reduce bootstrap races and unauthorized account creation. Auth uses an httpOnly cookie (not localStorage) plus middleware/`/me` guards so the portal stays admin-scoped by default.

## Routes to verify

- `/login` — authentication
- `/dashboard` — metrics + Recharts visualizations
- `/doctors` — search/filter/paginate + create/edit sheets
- `/doctors/[id]` — doctor detail + nested patients
- `/patients` — global patient list, edit, delete

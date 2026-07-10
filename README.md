# Naaz Amusement — Jaipur

Marketing + booking website and admin panel for **Naaz Amusement**, an 18-acre themed
amusement park in Jaipur. Built with Next.js (App Router), MongoDB (Mongoose),
Tailwind CSS, Zustand, and Cloudinary.

## Features

- **Public site** — Hero, rides, gallery, testimonials, event packages, FAQ, blog,
  attractions, Khao Gali, ticket info, and contact pages.
- **Booking** — Event/ride rental enquiry flow that sends details to WhatsApp and
  stores the enquiry in the database.
- **Accounts** — Register / login, profile with booking history, change password,
  and self-service password reset.
- **Admin panel** (`/admin`) — Dashboard, bookings, rides, customers, and a full
  homepage Content Manager (edit every section, upload images via Cloudinary).

## Environment Variables

Copy `.env.example` to `.env.local` and fill in:

```bash
# MongoDB connection (local or Atlas)
MONGODB_URI=mongodb://127.0.0.1:27017/naaz_amusement

# Signs the admin session cookie — use a long random string in production
ADMIN_SECRET=change-me-to-a-long-random-string

# Public URL, used for sitemap.xml and robots.txt
NEXT_PUBLIC_SITE_URL=https://naazamusementjaipur.com

# Cloudinary uploads for admin assets (either CLOUDINARY_URL or the 3 separate values)
CLOUDINARY_URL=cloudinary://<api-key>:<api-secret>@<cloud-name>
```

The admin account email is fixed in code (`src/lib/admin.ts`). Logging in with that
email sets a signed admin cookie that unlocks `/admin` and the protected APIs.

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the dev server |
| `npm run build` | Production build |
| `npm run start` | Run the production build |
| `npm run lint` | Run ESLint |

## Project Structure

```
src/
  app/            Routes (pages + API routes under app/api)
  components/     UI, sections, shared layout, and admin components
  lib/            Site config, DB connection, auth token, content/ride/blog data
  models/         Mongoose models (User, Booking, Ride, Content)
  stores/         Zustand stores (auth, content, rides)
  proxy.ts        Route protection for /admin and sensitive APIs
```

## Notes

- This repo uses a newer Next.js whose conventions may differ from older versions —
  check `node_modules/next/dist/docs/` before changing framework-level code.
- `robots.ts` and `sitemap.ts` live in `src/app` and are generated at build time.

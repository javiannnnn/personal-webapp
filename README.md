# personal-webapp

Personal portfolio site with a 90s retro-video-game theme (beige & brown, Pixelify Sans + VT323), built with Next.js 16, Tailwind CSS v4, and TypeScript.

## Features

- **Public site**: Home start-screen intro, About Me, Projects (cards with GitHub links), Skills & Experience (game-style XP bars — click a skill to see projects that use it), Contact page.
- **Admin area** (`/admin`): password-gated dashboard where you can edit your About, Projects, Skills, and Experience. Changes persist to `data/portfolio.json` and appear on the public site instantly.
- **Mario background animation**: a pixel-art Mario walks along brick ground collecting gold coins on every page (respects `prefers-reduced-motion`).

## Getting started

```bash
npm install
npm run dev
```

Open http://localhost:3000.

### Admin access

1. Copy `.env.example` to `.env.local`.
2. Set `ADMIN_PASSWORD` to your own secret (default fallback in dev: `press-start-1985`).
3. Set `NEXT_PUBLIC_CONTACT_EMAIL` to the email shown/used by the contact form.
4. Visit `/admin`, log in, and edit your content.

Your content lives in `data/portfolio.json` (seeded with sample data on first run — edit it via the admin console or replace it directly).

## Build for production

```bash
npm run build
npm run start
```

> Note: content is stored as a JSON file on disk, which suits local/self-hosted deploys. For serverless platforms with read-only filesystems, move `src/lib/db.ts` to a database or CMS.

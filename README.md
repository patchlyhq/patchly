# Patchly

Open-source changelog platform. Give every product a public changelog page, an embeddable widget, and email subscriber notifications.

**Live demo:** [patchly.dawit.dev](https://patchly.dawit.dev)

## Features

- Public changelog pages at `/:slug`
- Embeddable JS widget (one script tag)
- Email subscriber notifications via Resend
- Magic link authentication — no passwords
- Markdown support with syntax highlighting
- Dashboard with projects, entries, subscribers, analytics

## Stack

- [Next.js 16](https://nextjs.org) App Router
- [Neon](https://neon.tech) serverless Postgres
- [Drizzle ORM](https://orm.drizzle.team)
- [Resend](https://resend.com) transactional email
- [Tailwind CSS v4](https://tailwindcss.com)
- TypeScript · Biome · pnpm

## Getting started

### Prerequisites

- Node.js 20+
- pnpm 10+
- A [Neon](https://neon.tech) database
- A [Resend](https://resend.com) account with a verified domain

### Setup

```bash
git clone https://github.com/patchlyhq/patchly
cd patchly
pnpm install
cp .env.example .env.local
```

Fill in `.env.local` with your credentials, then:

```bash
pnpm db:push   # creates database tables
pnpm dev       # starts at http://localhost:3030
```

### Environment variables

| Variable | Description |
|---|---|
| `DATABASE_URL` | Neon Postgres connection string |
| `RESEND_API_KEY` | Resend API key for magic link emails |
| `SESSION_SECRET` | Random string for session signing |
| `NEXT_PUBLIC_APP_URL` | Your app's public URL |

## Database

```bash
pnpm db:push    # push schema changes to database
pnpm db:studio  # open Drizzle Studio
```

## Deployment

Deploy to [Vercel](https://vercel.com) with zero config. Add environment variables in the Vercel dashboard.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/patchlyhq/patchly)

## License

MIT — see [LICENSE](LICENSE).

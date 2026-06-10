# Resume Diff

Resume Diff is a Next.js 15 App Router app for comparing multiple job descriptions, ranking repeated skill demand, and checking a resume against that demand map.

## Stack

- Next.js 15 App Router
- TypeScript strict mode
- Tailwind CSS v4
- shadcn/ui-style components
- Drizzle ORM with Neon Postgres
- Anthropic SDK using `claude-sonnet-4-6`
- Zod validation
- Vercel-ready environment configuration

## Environment

Create `.env.local` with:

```bash
ANTHROPIC_API_KEY=
DATABASE_URL=
```

## Development

```bash
npm install
npm run db:generate
npm run db:migrate
npm run dev
```

Open `http://localhost:3000`.

## Deploy

Set `ANTHROPIC_API_KEY` and `DATABASE_URL` in Vercel, then deploy the repository. Run the Drizzle migration against the Neon database before using the app.

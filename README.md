# Link Saver

A minimal, fast web app for saving, searching, editing, and deleting your favorite links. Built with **Next.js 16 (App Router)**, **Convex** for the realtime backend, and **Clerk** for authentication.

---

## Features

- Sign up / sign in via Clerk (email, social, passkeys — whatever you enable in the Clerk dashboard)
- Create a link with **title, URL, note**
- List all your links in realtime (powered by Convex live queries)
- Search across title, URL, and note
- Edit or delete any link you own
- Strict per-user access control — all Convex queries/mutations verify `ctx.auth.getUserIdentity()`
- Form validation with **Zod** + **react-hook-form**
- Toast notifications with **react-hot-toast**
- Tested with **Vitest** + **Testing Library**

---

## Tech stack

| Layer          | Library                                                   |
| -------------- | --------------------------------------------------------- |
| Framework      | Next.js 16 (App Router, React 19, React Compiler enabled) |
| Styling        | Tailwind CSS v4                                           |
| Auth           | Clerk (`@clerk/nextjs`)                                   |
| Backend / DB   | Convex (`convex`)                                         |
| State (client) | Zustand                                                   |
| Forms          | react-hook-form + Zod                                     |
| Icons          | lucide-react                                              |
| Testing        | Vitest, @testing-library/react, happy-dom                 |

---

## Project structure

```
link-saver/
├── app/                     # Next.js App Router pages
│   ├── create/              # "Create link" page
│   ├── sign-in/             # Clerk sign-in route ([[...sign-in]])
│   ├── sign-up/             # Clerk sign-up route ([[...sign-up]])
│   ├── update/[Id]/         # "Edit link" page
│   ├── layout.tsx           # Root layout (Clerk + Convex providers, Toaster)
│   └── page.tsx             # Home (list + search)
├── components/              # UI components (Navbar, SearchBar, LinkForm, …)
├── convex/                  # Convex schema + server functions
│   ├── _generated/          # Auto-generated Convex client types
│   ├── auth.config.ts       # Clerk ↔ Convex JWT provider config
│   ├── schema.ts            # `links` table + indexes
│   └── links.ts             # CRUD + search mutations/queries
├── lib/validations.ts       # Zod schemas for forms
├── store/search-store.ts    # Zustand search-term store
├── public/                  # Static assets
├── __tests__/               # Vitest component tests
├── proxy.ts                 # Clerk middleware
├── next.config.ts
├── tailwind.config.ts
├── vitest.config.ts
└── vitest.setup.tsx
```

---

## Prerequisites

- **Node.js 20+** and **npm** (Node 22 recommended)
- A **Clerk** account — https://clerk.com
- A **Convex** account — https://convex.dev
- **Git**

---

## Setup — step by step

### 1. Clone the repo

```bash
git clone https://github.com/sankha4567/LinkSaver.git
cd LinkSaver
```

### 2. Install dependencies

```bash
npm install
```

### 3. Create a Clerk application

1. Go to https://dashboard.clerk.com and click **Create application**.
2. Pick the sign-in methods you want (Email, Google, etc.).
3. After creation, open **API Keys** and copy:
   - `Publishable key` → `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
   - `Secret key` → `CLERK_SECRET_KEY`
4. Still in the Clerk dashboard, go to **JWT Templates** → **New template** → pick **Convex** from the presets. Save it. Clerk will create a JWT template named `convex`.
5. Copy the **Frontend API URL** (under **Domains** or shown on the JWT template page — looks like `https://your-subdomain.clerk.accounts.dev`) → `CLERK_FRONTEND_API_URL`.

### 4. Configure environment variables

Copy the example file and fill in the values you just collected:

```bash
cp .env.example .env.local      # macOS / Linux / Git Bash
# or on Windows PowerShell:
# Copy-Item .env.example .env.local
```

At this point `.env.local` should have `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY`, and `CLERK_FRONTEND_API_URL` set. Convex values come next.

### 5. Initialize Convex

```bash
npx convex dev
```

The first time you run this it will:

- Ask you to sign in to Convex (browser auth)
- Prompt you to create (or select) a project
- Deploy the schema and functions in `convex/`
- Write `CONVEX_DEPLOYMENT` and `NEXT_PUBLIC_CONVEX_URL` into your `.env.local` automatically

Leave this process running — it watches `convex/**` and re-deploys on save.

### 6. Wire Clerk → Convex

Convex verifies users using the JWT template you created in step 3. Open the Convex dashboard → your project → **Settings** → **Environment variables**, and confirm it's reading `CLERK_FRONTEND_API_URL` from `.env.local` via `convex/auth.config.ts`. If it isn't picking up, restart `npx convex dev`.

### 7. Run the Next.js dev server

In a **second terminal** (keep `npx convex dev` running in the first):

```bash
npm run dev
```

Open http://localhost:3000. You should be redirected to `/sign-in` — create an account, sign in, and start saving links.

---

## Available scripts

| Command                 | What it does                                  |
| ----------------------- | --------------------------------------------- |
| `npm run dev`           | Start Next.js dev server (http://localhost:3000) |
| `npm run build`         | Production build                              |
| `npm run start`         | Serve the production build                    |
| `npm run lint`          | Run ESLint                                    |
| `npm test`              | Run Vitest in watch mode                      |
| `npm run test:ui`       | Run Vitest with UI                            |
| `npm run test:coverage` | Run Vitest once with coverage report          |
| `npx convex dev`        | Watch + deploy Convex functions               |
| `npx convex deploy`     | Deploy Convex functions to production         |

---

## Deployment

### Convex (backend)

```bash
npx convex deploy
```

Copy the production `NEXT_PUBLIC_CONVEX_URL` that Convex prints — you'll set it on your hosting provider.

### Next.js (frontend) — Vercel

1. Push to GitHub (this repo).
2. Import the repo on https://vercel.com/new.
3. Add the same env vars from `.env.local` to Vercel's **Environment Variables**, but use the **production** Convex URL from `npx convex deploy`.
4. Deploy.

Don't forget to add your production domain to Clerk's **Domains** list.

---

## Troubleshooting

- **`Unauthorized` errors from Convex**: the Clerk JWT template isn't named `convex`, or `CLERK_FRONTEND_API_URL` is wrong. Re-check step 3.
- **`.env` changes not picked up**: restart both `npx convex dev` and `npm run dev`.
- **`Module not found: @/...`**: make sure `tsconfig.json` has the `paths` mapping and that you restarted the dev server.
- **React Compiler build warnings**: this project enables `reactCompiler: true` in `next.config.ts`. If you hit a component it can't optimize, mark it with `"use no memo"` at the top.

---

## License

MIT — do whatever you want.

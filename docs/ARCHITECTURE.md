# ARCHITECTURE.md — HabitForge

> Last updated: 2026-02-14

---

## Tech Stack

| Layer       | Technology                       | Notes                        |
| ----------- | -------------------------------- | ---------------------------- |
| Frontend    | React 19 + Vite 7 + TypeScript  | SPA with client-side routing |
| Styling     | Tailwind CSS v3                  | Custom design tokens         |
| Auth        | Clerk (`@clerk/clerk-react`)     | OAuth + email/password       |
| Database    | Supabase (PostgreSQL + RLS)      | Hosted, ap-southeast-1       |
| Font        | Satoshi (self-hosted)            | fontshare.com, WOFF2         |
| Icons       | Lucide React                     |                              |
| Routing     | React Router DOM v7              |                              |
| Hosting     | Vercel (planned)                 |                              |

---

## File Map

```
HabitForge/
├── public/
│   └── fonts/              # Satoshi WOFF2 files (self-hosted)
├── src/
│   ├── components/         # Reusable UI components
│   ├── hooks/              # Custom React hooks
│   ├── lib/
│   │   ├── clerk.ts        # Clerk publishable key export
│   │   └── supabase.ts     # Typed Supabase client
│   ├── pages/              # Route-level page components
│   ├── types/
│   │   └── supabase.ts     # Generated DB types (from Supabase MCP)
│   ├── App.tsx             # Router + app shell
│   ├── main.tsx            # Entry point (ClerkProvider wrapper)
│   └── index.css           # Tailwind + @font-face + base styles
├── docs/
│   └── ARCHITECTURE.md     # This file
├── .gsd/
│   ├── SPEC.md             # Product specification (FINALIZED)
│   ├── ROADMAP.md          # Phased execution plan
│   └── STATE.md            # Session memory
├── .env.local              # Real keys (gitignored)
├── .env.example            # Key placeholders for docs
├── tailwind.config.js      # Design tokens from SPEC §7
├── postcss.config.js       # Tailwind PostCSS pipeline
├── vite.config.ts          # Vite configuration
└── tsconfig.json           # TypeScript configuration
```

---

## Key Patterns

### Auth ↔ Data ("The Golden Link")
- **Clerk** handles all auth flows (sign-up, sign-in, sessions)
- **Supabase** provides PostgreSQL with Row Level Security (RLS)
- **Sync:** Clerk `user.id` maps to `profiles.clerk_user_id`
- **RLS:** All policies use `current_setting('request.jwt.claims')::json->>'sub'` to identify the Clerk user

### Database Schema

| Table              | RLS | Purpose                           |
| ------------------ | --- | --------------------------------- |
| `profiles`         | ✅  | Clerk user sync (id, email, role) |
| `habits`           | ✅  | User habit definitions            |
| `habit_completions`| ✅  | Daily completion records          |

### Design System
- Colors, typography, and spacing defined in `tailwind.config.js`
- All values come from SPEC §7 — no magic values
- Dark theme: `bg-primary (#0F172A)`, accent: `accent-primary (#6366F1)`
- Font: Satoshi (400/500/600/700) via `@font-face` in `index.css`

---

## Recent Decisions

| Date       | Decision                                        | Rationale                                    |
| ---------- | ----------------------------------------------- | -------------------------------------------- |
| 2026-02-14 | New Supabase project (`qltyzyktalhrmsqcyebp`)   | Keep HabitForge isolated from e-commerce app |
| 2026-02-14 | Clerk for auth (not Supabase Auth)               | Better UI components, OAuth support          |
| 2026-02-14 | Tailwind v3 (not v4)                             | Stable, well-documented, broad ecosystem     |
| 2026-02-14 | Self-hosted Satoshi font                         | Avoid external CDN dependency                |
| 2026-02-14 | RLS via Clerk JWT `sub` claim                    | Secure per-user data isolation               |

---

## Context Restoration

* **Current Goal:** Phase 2 Scaffolding complete → next is Phase 3 (Landing Page)
* **Last Action:** Project scaffolded, DB tables created, types generated, design system configured
* **Active Problems:** User needs to drop Satoshi WOFF2 files into `public/fonts/`

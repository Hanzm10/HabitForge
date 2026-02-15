# ARCHITECTURE.md — HabitForge

> Last updated: 2026-02-15

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
│   ├── components/
│   │   ├── admin/          # Admin-specific components (UserTable, Analytics)
│   │   ├── auth/           # Auth guards and wrappers
│   │   ├── dashboard/      # User dashboard components (Habits, Heatmap)
│   │   ├── landing/        # Landing page sections
│   │   └── ui/             # Shared UI components (Shadcn/Base)
│   ├── hooks/              # Custom React hooks (Data fetching, Logic)
│   ├── lib/
│   │   ├── clerk.ts        # Clerk configuration
│   │   └── supabase.ts     # Supabase client instantiation
│   ├── pages/              # Route components
│   │   ├── admin/          # Admin dashboard pages
│   │   └── dashboard/      # User dashboard pages
│   ├── types/
│   │   └── supabase.ts     # Database types
│   ├── App.tsx             # Main router
│   └── index.css           # Global styles
├── docs/
│   └── ARCHITECTURE.md     # This file
├── .gsd/                   # GSD Metadata
├── .env.local              # Environment variables
├── vercel.json             # Deployment config
└── tailwind.config.js      # Design tokens

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
| 2026-02-15 | Strict TypeScript in Hooks                       | Prevent runtime errors and improve DX        |
| 2026-02-15 | Vercel SPA Routing                               | Ensure client-side routing works on deploy   |

---

## Context Restoration

* **Current Goal:** Project Complete. Ready for Deployment.
* **Last Action:** Polished UX, Audit Security, Final Build Verified.
* **Active Problems:** None. Ready to ship.

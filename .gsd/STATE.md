# STATE.md — HabitForge

> Session memory. Read this at the start of every session.

---

## Current Phase
**🟢 Phase 4: AUTHENTICATION → COMPLETE**
**Next: 🟡 Phase 5: USER DASHBOARD**

## Current Status
- SPEC.md FINALIZED (v1.0)
- Project scaffolded (React + Vite + TypeScript)
- Tailwind v3 configured with HabitForge design tokens
- Supabase tables deployed (profiles, habits, habit_completions) with RLS
- TypeScript types generated from Supabase schema
- Clerk provider integrated & Auth pages implemented
- Protected Routes & Admin Guard active
- User Profile Sync hook implemented
- Vitest + React Testing Library configured (40 passing tests)
- Landing page complete (6 sections, navbar, animations, SEO)
- All 18 tests GREEN, build passing

## Key Facts
- **Supabase Project:** `qltyzyktalhrmsqcyebp` (ap-southeast-1, ACTIVE_HEALTHY, $0/mo)
- **Supabase Org:** `skclzwpodyyjxayqspwv` (Hanzm)
- **Supabase URL:** `https://qltyzyktalhrmsqcyebp.supabase.co`
- **Clerk Publishable Key:** `pk_test_YWRlcXVhdGUtbXVza3JhdC00Mi5jbGVyay5hY2NvdW50cy5kZXYk`
- **Stack:** React 19 + Vite 7 + TypeScript + Tailwind v3 + Clerk + Supabase
- **Test Stack:** Vitest 4 + @testing-library/react + jsdom
- **Font:** Satoshi (self-hosted, WOFF2 files in `public/fonts/`)
- **Hosting:** Vercel (planned)
- **DB Tables:** profiles ✅, habits ✅, habit_completions ✅ (all with RLS)

## Blockers
- None

## Session Log
| Date       | Action                                           |
| ---------- | ------------------------------------------------ |
| 2026-02-14 | GSD initialized. SPEC.md created as DRAFT.       |
| 2026-02-14 | User answered open questions. SPEC FINALIZED.    |
| 2026-02-14 | Supabase project `qltyzyktalhrmsqcyebp` created. |
| 2026-02-14 | Phase 2: Project scaffolded. Vite + React + TS.  |
| 2026-02-14 | Phase 2: Tailwind v3 + design tokens configured. |
| 2026-02-14 | Phase 2: DB tables + RLS deployed via MCP.       |
| 2026-02-14 | Phase 2: Clerk provider + Supabase client setup. |
| 2026-02-14 | Phase 2: Types generated. ARCHITECTURE.md created.|
| 2026-02-15 | Phase 3: Test infra (Vitest + RTL) installed.    |
| 2026-02-15 | Phase 3: TDD — 7 test files, 18 tests (all GREEN).|
| 2026-02-15 | Phase 3: Landing page complete (6 sections + nav).|
| 2026-02-15 | Phase 3: Auth UI refinements (font visibility).   |

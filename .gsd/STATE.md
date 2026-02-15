# STATE.md — HabitForge

> Session memory. Read this at the start of every session.

---

## Current Phase
**🟢 Phase 5: USER DASHBOARD → IN PROGRESS**

## Current Status
- SPEC.md FINALIZED (v1.0)
- Project scaffolded (React + Vite + TypeScript)
- Tailwind v3 configured with HabitForge design tokens
- Supabase tables deployed (profiles, habits, habit_completions) with RLS
- TypeScript types generated from Supabase schema
- Clerk provider integrated & Auth pages implemented
- Protected Routes & Admin Guard active
- User Profile Sync hook implemented
- Vitest + React Testing Library configured (93 passing tests)
- Landing page complete (6 sections, navbar, animations, SEO)
- Dashboard layout (sidebar + header + nested routes)
- Create Habit Form (name, desc, color, icon, frequency)
- useHabits hook (Clerk auth → Supabase insert/fetch/update/delete)
- Habit list with edit/delete (HabitList + EditHabitForm)
- Daily completion toggle (useCompletions hook + DailyToggle component)
- Calendar Heatmap (useCompletions history + HabitHeatmap component)
- Icon Picker (reusable component + form integration)
- Streak Counter (useStreaks hook + StreakCounter component)

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
| 2026-02-15 | Phase 5: Create Habit Form + useHabits hook (TDD). |
| 2026-02-15 | Phase 5: 19 test files, 59 tests (all GREEN).    |
| 2026-02-15 | Phase 5: Habit list + edit/delete (TDD, 82 tests).|
| 2026-02-15 | Phase 5: Daily completion toggle (TDD, 93 tests). |
| 2026-02-15 | Phase 5: Calendar heatmap view (TDD, 104 tests). |
| 2026-02-15 | Phase 5: Icon Picker component + integration (TDD). |
| 2026-02-15 | Bugfix: Integrated `useProfileSync` into `ProtectedRoute`. |


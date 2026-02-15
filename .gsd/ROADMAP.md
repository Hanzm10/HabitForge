# ROADMAP.md — HabitForge

> Phased execution plan. Each phase is atomic and independently verifiable.

---

## Milestone 1: MVP — Core Habit Tracking

### Phase 1: INCEPTION ✅
- [x] Create SPEC.md
- [x] Resolve open questions
- [x] Provision Supabase project (`qltyzyktalhrmsqcyebp`)
- [x] Finalize SPEC

---

### Phase 2: SCAFFOLDING ✅
> Init project, install deps, configure design system, set up providers.

- [x] Initialize Vite + React + TypeScript project
- [x] Install dependencies (Tailwind v3, Clerk, Supabase JS, Lucide, React Router)
- [x] Configure Tailwind with HabitForge design tokens
- [x] Download & configure Satoshi font (self-hosted)
- [x] Create folder structure (`src/components/`, `src/pages/`, `src/lib/`, `src/hooks/`, `src/types/`)
- [x] Set up Supabase client (`src/lib/supabase.ts`)
- [x] Set up Clerk provider (`src/lib/clerk.ts`)
- [x] Create database migrations (profiles, habits, habit_completions + RLS)
- [x] Generate TypeScript types from Supabase
- [x] Verify: `npm run dev` starts clean, Supabase tables exist, types generated

---

### Phase 3: LANDING PAGE ✅
> High-conversion landing page with all 6 sections.

- [x] Hero section (headline, subtext, CTA)
- [x] Features section (4 feature cards)
- [x] Social proof section (placeholder testimonials)
- [x] How It Works (3-step flow)
- [x] Pricing section (Free + Pro Coming Soon)
- [x] Footer (Privacy, Terms, Login)
- [x] Responsive design (mobile-first)
- [x] Micro-animations & hover effects
- [x] Verify: All 18 tests GREEN, build passing

---

### Phase 4: AUTHENTICATION ✅
> Clerk integration with protected routes and role-based access.

- [x] Configure Clerk provider with app keys
- [x] Sign-in page (`/sign-in`)
- [x] Sign-up page (`/sign-up`)
- [x] Protected route wrapper component
- [x] Clerk → Supabase profile sync (on sign-up)
- [x] Role-based route guard (admin vs user)
- [x] Verify: Sign up → profile created in Supabase, protected routes redirect

---

### Phase 5: USER DASHBOARD
> Core habit tracking: CRUD, toggle, calendar, streaks.

- [x] Dashboard layout (sidebar + content area)
- [x] Create habit form (name, description, color, icon, frequency)
- [x] Habit list with edit/delete
- [x] Daily completion toggle
- [x] Calendar heatmap view
- [ ] Streak counter (current + longest)
- [ ] Completion rate % per habit
- [ ] Weekly progress overview card
- [ ] Verify: CRUD operations work, streak calculation correct, calendar renders

---

### Phase 6: ADMIN DASHBOARD
> Analytics, engagement metrics, user management.

- [ ] Admin route guard (`role = 'admin'`)
- [ ] User analytics cards (total, new 7/30d, DAU/MAU)
- [ ] Growth graph (users over time)
- [ ] Engagement metrics (avg habits/user, avg completion rate, retention %)
- [ ] User management table (view, suspend, change role)
- [ ] Verify: Admin-only access enforced, metrics compute from real data

---

### Phase 7: POLISH & DEPLOY
> Final UX pass, performance, Vercel deployment.

- [ ] Micro-animation audit (hover, transitions, page loads)
- [ ] Performance optimization (lazy loading, code splitting)
- [ ] SEO meta tags for landing page
- [ ] Vercel deployment config
- [ ] Environment variable setup (.env.example)
- [ ] Final browser test (full user flow)
- [ ] Verify: Lighthouse score, deployment works, full E2E flow

---

## Summary

| Phase | Name           | Status      |
| ----- | -------------- | ----------- |
| 1     | Inception      | ✅ Complete |
| 2     | Scaffolding    | ✅ Complete |
| 3     | Landing Page   | ✅ Complete |
| 4     | Authentication | ✅ Complete |
| 5     | User Dashboard | 🟡 Active   |
| 6     | Admin Dashboard| ⬜ Blocked  |
| 7     | Polish & Deploy| ⬜ Blocked  |

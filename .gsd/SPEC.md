# SPEC.md — HabitForge

> **Status: FINALIZED**
> **Version:** 1.0
> **Last Updated:** 2026-02-14

---

## 1. Product Overview

**Name:** HabitForge
**Tagline:** "Build Systems. Not Motivation."
**Type:** SaaS — Habit Tracking & Analytics Platform
**Target Audience:** Individuals seeking a clean, focused, aesthetically premium productivity system.

**Core Value Proposition:**
A modern, dark-themed habit tracker that turns daily discipline into visual progress — with streaks, analytics, and a no-clutter interface that makes consistency addictive.

---

## 2. Tech Stack

| Layer           | Technology                     |
| --------------- | ------------------------------ |
| Frontend        | React + Vite + TypeScript      |
| Styling         | Tailwind CSS v3                |
| Auth            | Clerk (`@clerk/clerk-react`)   |
| Database        | Supabase (PostgreSQL + RLS)    |
| Hosting         | Vercel                         |
| Font            | Satoshi (self-hosted, fontshare.com) |
| Icons           | Lucide React                   |

---

## 3. Architecture: Auth ↔ Data ("The Golden Link")

- **Authentication:** Clerk handles all auth flows (sign-up, sign-in, OAuth, session management).
- **Database:** Supabase provides PostgreSQL with Row Level Security (RLS).
- **Sync Strategy:** When a user registers in Clerk, a webhook (or client-side trigger) creates a corresponding row in `public.profiles`.
- **RLS Policy:** All user-facing tables enforce `clerk_user_id = requesting_user_id` via Clerk JWT passed to Supabase client.

### Clerk → Supabase User Sync
**YES — a `profiles` table sync is required.**

| Field            | Type        | Source          |
| ---------------- | ----------- | --------------- |
| `id`             | `uuid` (PK) | Supabase `gen_random_uuid()` |
| `clerk_user_id`  | `text` (UNIQUE) | Clerk `user.id` |
| `email`          | `text`      | Clerk `user.emailAddresses[0]` |
| `full_name`      | `text`      | Clerk `user.fullName` |
| `avatar_url`     | `text`      | Clerk `user.imageUrl` |
| `role`           | `enum('user','admin')` | Default `'user'` |
| `created_at`     | `timestamptz` | `now()` |
| `updated_at`     | `timestamptz` | `now()` |

---

## 4. Data Model

### 4.1 `profiles` (Clerk Sync)
See section 3 above.

### 4.2 `habits`

| Field            | Type            | Notes                       |
| ---------------- | --------------- | --------------------------- |
| `id`             | `uuid` (PK)     | `gen_random_uuid()`         |
| `profile_id`     | `uuid` (FK)     | → `profiles.id`             |
| `name`           | `text`          | e.g. "Morning Workout"      |
| `description`    | `text` (nullable) | Optional context           |
| `color`          | `text`          | Hex color for UI            |
| `icon`           | `text` (nullable) | Lucide icon name           |
| `frequency`      | `enum('daily','weekly')` | Default `'daily'`    |
| `is_archived`    | `boolean`       | Default `false`             |
| `created_at`     | `timestamptz`   | `now()`                     |
| `updated_at`     | `timestamptz`   | `now()`                     |

**RLS:** Users can only CRUD their own habits (`profile_id = current_profile_id()`).

### 4.3 `habit_completions`

| Field            | Type            | Notes                       |
| ---------------- | --------------- | --------------------------- |
| `id`             | `uuid` (PK)     | `gen_random_uuid()`         |
| `habit_id`       | `uuid` (FK)     | → `habits.id`               |
| `completed_date` | `date`          | The calendar day             |
| `created_at`     | `timestamptz`   | `now()`                     |

**Unique Constraint:** `(habit_id, completed_date)` — one completion per habit per day.
**RLS:** Via join to `habits.profile_id`.

### 4.4 Computed Metrics (Client-Side or DB Views)

| Metric                | Calculation                                   |
| --------------------- | --------------------------------------------- |
| Current Streak        | Consecutive days ending today (or yesterday)  |
| Longest Streak        | Max consecutive days ever                     |
| Weekly Completion %   | Completions in last 7 days / 7 × 100         |
| Total Completed Days  | `COUNT(*)` on `habit_completions` for habit   |

---

## 5. Pages & Routes

| Route              | Component          | Access     | Description                     |
| ------------------ | ------------------ | ---------- | ------------------------------- |
| `/`                | LandingPage        | Public     | Marketing / conversion page     |
| `/sign-in`         | Clerk `<SignIn />`  | Public     | Clerk-hosted sign-in            |
| `/sign-up`         | Clerk `<SignUp />`  | Public     | Clerk-hosted sign-up            |
| `/dashboard`       | UserDashboard      | Auth       | Habit CRUD, calendar, streaks   |
| `/admin`           | AdminDashboard     | Admin only | Analytics, user mgmt            |

### 5.1 Landing Page Sections
1. **Hero** — "Build Systems. Not Motivation." + CTA "Start Tracking"
2. **Features** — Streak tracking, Daily completion, Progress analytics, Clean UI
3. **Social Proof** — Placeholder testimonials
4. **How It Works** — 3-step flow (Create → Track → Build Streaks)
5. **Pricing** — Free tier + Pro (Coming Soon)
6. **Footer** — Privacy, Terms, Login link

### 5.2 User Dashboard
- Create / Edit / Delete habits
- Toggle daily completion (checkbox/button)
- Calendar heatmap view
- Streak counter per habit
- Completion rate % per habit
- Weekly progress overview

### 5.3 Admin Dashboard
**Access:** `role = 'admin'` only.

#### User Analytics
- Total users, New users (7/30 days), DAU/MAU, Growth graph

#### Engagement Metrics
- Avg habits per user, Avg completion rate, Retention %

#### User Management
- View users, Suspend user, Change role

#### System Health (Future)
- Error logs, DB stats

---

## 6. Authentication & Authorization

### Auth Provider: Clerk
- Email/password sign-up & sign-in
- OAuth: Google
- Protected routes via `<SignedIn>` / `<SignedOut>` wrappers
- Middleware: `clerkMiddleware()` for route protection

### Authorization Logic
| Role    | Access                         |
| ------- | ------------------------------ |
| `user`  | Own habits, own completions    |
| `admin` | All of above + `/admin` routes |

- Only admins can access `/admin`
- Users can only access their own habit data (enforced via RLS)
- Clerk role stored in `profiles.role`, checked client-side + RLS

---

## 7. Design System

### 7.1 Color Palette

#### Backgrounds
| Token              | Hex       | Usage              |
| ------------------ | --------- | ------------------ |
| `bg-primary`       | `#0F172A` | Page background    |
| `bg-secondary`     | `#1E293B` | Section background |
| `bg-card`          | `#111827` | Card surfaces      |
| `border-subtle`    | `#1F2937` | Dividers, borders  |

#### Accent — Indigo
| Token              | Hex       | Usage              |
| ------------------ | --------- | ------------------ |
| `accent-primary`   | `#6366F1` | Buttons, links     |
| `accent-hover`     | `#818CF8` | Hover states       |
| `accent-active`    | `#4F46E5` | Active/pressed     |

#### Success — Emerald (Streaks/Progress)
| Token              | Hex       | Usage              |
| ------------------ | --------- | ------------------ |
| `success`          | `#10B981` | Completed states   |
| `success-hover`    | `#34D399` | Hover              |
| `success-dark`     | `#059669` | Active             |

#### Warning / Error
| Token              | Hex       | Usage              |
| ------------------ | --------- | ------------------ |
| `warning`          | `#F59E0B` | Warnings           |
| `error`            | `#EF4444` | Errors, delete     |

#### Typography Colors
| Token              | Hex       | Usage              |
| ------------------ | --------- | ------------------ |
| `text-primary`     | `#F8FAFC` | Headings, body     |
| `text-secondary`   | `#CBD5E1` | Labels, subtext    |
| `text-muted`       | `#64748B` | Captions, hints    |

### 7.2 Typography — Satoshi

| Usage            | Weight | Tracking       |
| ---------------- | ------ | -------------- |
| Hero headline    | 700    | -2% (`-0.02em`) |
| Section headers  | 600    | -1% (`-0.01em`) |
| Labels           | 500    | normal         |
| Body text        | 400    | normal         |

---

## 8. Supabase Project

- **Project ID:** `qltyzyktalhrmsqcyebp`
- **Organization:** `skclzwpodyyjxayqspwv` (Hanzm)
- **Region:** `ap-southeast-1`
- **Status:** ACTIVE_HEALTHY
- **Cost:** $0/month (free tier)
- **Note:** Dedicated project for HabitForge. Previous e-commerce project (`pyaqifosvygzqcpbbukb`) retained separately.

---

## 9. Resolved Decisions

| # | Question | Decision |
|---|----------|----------|
| 1 | Supabase strategy | **New project** (keep existing e-commerce project separate) |
| 2 | Clerk application | **Create new** Clerk app for HabitForge |
| 3 | Tailwind version | **v3** |
| 4 | Hosting | **Vercel** |
| 5 | Satoshi font | **Self-hosted** (fontshare.com download) |

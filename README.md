# HabitForge

A modern, distraction-free habit tracker built for builders. Turns daily discipline into visual progress with streaks, analytics, and a premium dark-mode interface.

![HabitForge Hero](https://placehold.co/1200x630/0F172A/FFF?text=HabitForge+Preview)

## ✨ Features

- **Dashboard**: Track daily habits with an intuitive toggle interface.
- **Analytics**: Visualize progress with completion rates, streaks, and GitHub-style heatmaps.
- **Goal Setting**: Flexible frequency options (daily/weekly) and customizable colors/icons.
- **Social Proof**: See how you stack up against other builders (coming soon).
- **Dark Mode**: A sleek, eye-strain-free interface designed for deep work sessions.

## 🛠 Tech Stack

- **Frontend**: React 19, Vite 7, TypeScript
- **Styling**: Tailwind CSS v3, Shadcn UI, Lucide Icons
- **Backend/Auth**: Supabase (Database + RLS), Clerk (Authentication)
- **Testing**: Vitest, React Testing Library
- **Deployment**: Vercel

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or pnpm

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/yourusername/habitforge.git
    cd habitforge
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Environment Setup**
    Create a `.env.local` file in the root directory and add the following keys:

    ```env
    VITE_CLERK_PUBLISHABLE_KEY=pk_test_...
    VITE_SUPABASE_URL=https://your-project.supabase.co
    VITE_SUPABASE_ANON_KEY=ey...
    ```

4.  **Run Development Server**
    ```bash
    npm run dev
    ```
    Open [http://localhost:5173](http://localhost:5173) to view it in the browser.

## 🧪 Testing

Run the test suite to ensure everything is working correctly:

```bash
npm test
```

## 📦 Deployment

This project is optimized for deployment on **Vercel**.

1.  Push your code to GitHub.
2.  Import the project into Vercel.
3.  Add the environment variables (`VITE_CLERK_PUBLISHABLE_KEY`, `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`) in the Vercel dashboard.
4.  Deploy!

## 📄 License

MIT License. See [LICENSE](LICENSE) for details.
